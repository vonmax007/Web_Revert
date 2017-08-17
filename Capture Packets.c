#include <stdio.h>
#include <stdlib.h>
#include <pcap.h>

#include <string.h>
#include <sys/socket.h>
#include <ifaddrs.h>
#include <net/ethernet.h>
#include   <sys/ioctl.h>
#include   <netinet/in.h>
#include   <net/if.h>

#define DEBUG 1

#ifdef DEBUG
#define DbgPrintf printf
#else
#define DbgPrintf /\
/DbgPrintf
#endif

#define MAX_STR_LEN 100

/*因为结构体在内存中顺序存储，
  所以我们将捕获到的数据保存
  到相应的结构体中，对每个字段
  以变量的形式读取         */

struct ip_header {            // IP头部 20 字节

    u_int8_t  ip_vhl;         // 版本号，首部长度  4+4 bit

    u_int8_t  ip_tos;         // 服务类型            8 bit

    u_int16_t ip_len;         // 总长度             16 bit  单位：4字节

    u_int16_t ip_id;          // 身份识别           16 bit

    u_int16_t ip_off;         // 分组偏移           16 bit

    u_int8_t  ip_ttl;         // 生命周期            8 bit

    u_int8_t  ip_p;           // 协议类型            8 bit

    u_int16_t ip_sum;         // 包头测验码         16 bit

    struct in_addr ip_src;    // 源IP地址           32 bit

    struct in_addr ip_dst;    // 目的IP地址         32 bit
};

struct tcp_header {           // TCP 头部   20 字节

    u_int16_t tcp_src_port;   // 源端口号   16 bit

    u_int16_t tcp_dst_port;   // 目的端口号 16 bit

    u_int32_t tcp_seq;        // 序列号     32 bit

    u_int32_t tcp_ack;        // 确认号     32 bit

    u_int8_t  th_offx2;       // 预留偏移   4+4bit

    u_int8_t  th_flags;       // 标志位      8 bit

    u_int16_t tcp_win;        // 窗口大小   16 bit

    u_int16_t tcp_sum;        // 校验和     16 bit

    u_int16_t tcp_urp;        // 紧急指针   16 bit
};


struct udp_header{
    u_int32_t sport;            // 源端口

    u_int32_t dport;            // 目标端口

    u_int8_t zero;              // 保留位

    u_int8_t proto;             // 协议标识

    u_int16_t datalen;          // UDP数据长度

};

struct icmp_header{

    u_int8_t type;              // ICMP类型

    u_int8_t code;              // 代码

    u_int16_t checksum;         // 校验和

    u_int16_t identification;   // 标识

    u_int16_t sequence;         // 序列号

    u_int32_t init_time;        // 发起时间戳

    u_int16_t recv_time;        // 接受时间戳

    u_int16_t send_time;        // 传输时间戳

};

struct arp_header
{

    u_int16_t arp_hardware_type;

    u_int16_t arp_protocol_type;

    u_int8_t arp_hardware_length;

    u_int8_t arp_protocol_length;

    u_int16_t arp_operation_code;

    u_int8_t arp_source_ethernet_address[6];

    u_int8_t arp_source_ip_address[4];

    u_int8_t arp_destination_ethernet_address[6];

    u_int8_t arp_destination_ip_address[4];

};



struct Stream_id {
    char ip_port1[50];
    char ip_port2[50];
    FILE* fd;
    int stream_id;
};


#define True 1
#define False 0
#define MAX_FRAME_LEN (1024 * 16)
#define MAX_STREAM_NUM 500

struct Stream_id stream_id_arr[MAX_STREAM_NUM];

typedef struct _tcp_stream_id {
    u_char mac_src[32];
    u_char mac_dst[32];
    char ip_src[64];
    char ip_dst[64];
    unsigned short port_src;
    unsigned short port_dst;
} Tcp_Stream_Id;

typedef struct _tcp_node {
    int is_ack;
    int syn;
    int fin;
    unsigned long seq;
    int len;
    struct _tcp_node *prev;
    struct _tcp_node *next;
    struct _tcp_node *ack_node_head;
    int ack_len;
    unsigned char data[MAX_FRAME_LEN];
} Tcp_Node;


typedef struct _tcp_list {
    Tcp_Stream_Id id;
    Tcp_Node node_head;
    struct _tcp_list *next;
} Tcp_List;



Tcp_List tcp_list_head;

int get_linux_mac_address(char *mac_addr, const char *if_name)
{
    struct ifreq ifreq;
    int sock;
    if ((sock = socket(AF_INET,SOCK_STREAM,0)) < 0)
    {
        perror("socket");
        return -1;
    }
    strcpy(ifreq.ifr_name, if_name);
    if (ioctl(sock, SIOCGIFHWADDR, &ifreq) < 0)
    {
        perror("ioctl");
        return -1;
    }
    sprintf(mac_addr, "%02x:%02x:%02x:%02x:%02x:%02x",
            (u_char) ifreq.ifr_hwaddr.sa_data[0],
            (u_char) ifreq.ifr_hwaddr.sa_data[1],
            (u_char) ifreq.ifr_hwaddr.sa_data[2],
            (u_char) ifreq.ifr_hwaddr.sa_data[3],
            (u_char) ifreq.ifr_hwaddr.sa_data[4],
            (u_char) ifreq.ifr_hwaddr.sa_data[5]);
    return 0;
}


Tcp_List* create_tcp_list(Tcp_Stream_Id id)
{
    Tcp_List *new_list = malloc(sizeof(Tcp_List));
    Tcp_List *tmp = tcp_list_head.next;
    memset(new_list, 0, sizeof(Tcp_List));
    new_list->id = id;
    tcp_list_head.next = new_list;
    new_list->next = tmp;
    return new_list;
}

int is_list_complete(Tcp_Node *head)
{
    if (head->next == NULL)
        return False;

    Tcp_Node *pt = head;
    unsigned long next_seq = head->next->seq;
    int is_complete = True;
    int total_size = 0;
    do {
        pt = pt->next;
        printf("pt->seq=%ul, next_seq=%ul, len=%d, is_ack=%d\n", pt->seq, next_seq, pt->len, pt->is_ack);
        if (pt->seq != next_seq) {
            is_complete = False;
            break;
        }
        if (pt->len == 0) {
            next_seq = pt->seq + 1;
        } else {
            next_seq = pt->seq + pt->len;
        }
        total_size += pt->len;
    } while (pt->next != NULL);
    printf("------------------\n");
    if (is_complete == True) {
        if (pt->fin == 1) {        // TCP 结束标志  表示包完整
            if (total_size == 0) {
                return False;
            }
            return True;
        }
    }
    return False;
}

void write_list(Tcp_Node *head)
{
    static int name = 1;
    Tcp_Node *pnode = NULL;
    char filename[8] = {0};
    snprintf(filename, 8, "packet%d", name++);
    FILE *fd  = fopen(filename, "a+");
    for (pnode = head->next; pnode != NULL; pnode = pnode->next) {
        char sign[50] = {0};
        if (pnode->ack_len != 0) {
            snprintf(sign, 50, "\r\n\r\n--[len=%d]--\r\n\r\n", pnode->ack_len);
            fwrite(sign, 1, strlen(sign), fd);
        }
        fwrite(pnode->data, 1, pnode->len, fd);


        printf("********pnode->ack_len=%d****************\n", pnode->ack_len);
        is_list_complete(pnode->ack_node_head);
        printf("************************^^^^^^^^^^^^^^^^^^\n");
        Tcp_Node *anode = NULL;
        for (anode = pnode->ack_node_head->next; anode != NULL; anode = anode->next) {
            fwrite(anode->data, 1, anode->len, fd);
        }
    }
    fclose(fd);
    return;
}

void free_stream(Tcp_List **head, Tcp_List *pre)
{
    Tcp_Node *pnode = NULL;
    pnode = (*head)->node_head.next;
    while (pnode != NULL) {
        Tcp_Node *pnext = pnode->next;
        Tcp_Node *anode = pnode->ack_node_head->next;
        while (anode != NULL) {
            Tcp_Node *next = anode->next;
            free(anode);
            anode = next;
        }
        free(pnode);
        pnode = pnext;
    }
    pre->next = (*head)->next;
    free(*head);
    return;
}

Tcp_Stream_Id get_stream_id(struct ip_header *ip_hdr, struct tcp_header *tcp_hdr)
{
    Tcp_Stream_Id id;
    char ip_src[50] = {0};
    char ip_dst[50] = {0};
    memset(&id, 0, sizeof(Tcp_Stream_Id));
    inet_ntop(AF_INET, &(ip_hdr->ip_src), ip_src);
    inet_ntop(AF_INET, &(ip_hdr->ip_dst), ip_dst);
    memcpy(id.ip_src, ip_src, 50);
    memcpy(id.ip_dst, ip_dst, 50);
    id.port_src = ntohs(tcp_hdr->tcp_src_port);
    id.port_dst = ntohs(tcp_hdr->tcp_dst_port);
    return id;
}

int is_same_stream(Tcp_Stream_Id *id1, Tcp_Stream_Id *id2, int *is_ack)
{
    if (id1->port_dst == id2->port_dst && id1->port_src == id2->port_src) {
        if (strcmp(id1->ip_src, id2->ip_src) == 0) {
            if (strcmp(id1->ip_dst, id2->ip_dst) == 0) {
                *is_ack = False;
                return True;
            }
        }
    }

    if (id1->port_src == id2->port_dst && id1->port_dst == id2->port_src) {
        if (strcmp(id1->ip_src, id2->ip_dst) == 0) {
            if (strcmp(id1->ip_dst, id2->ip_src) == 0) {
                *is_ack = True;
                return True;
            }
        }
    }

    return False;
}

// 组包
void insert_node(unsigned long seq, int len, int syn, int fin, Tcp_Node *head, const u_char *packet)
{
    Tcp_Node *pnode = NULL;
    Tcp_Node *pre = head;
    for (pnode = head->next; pnode != NULL; pnode = pnode->next) {
        if (pnode->seq == seq) {
            if (pnode->len < len) {
                // copy the rest data to the node.
                memcpy(pnode->data + pnode->len, packet + pnode->len, len - pnode->len);
                pnode->len = len;
                pnode->fin = fin;
            }
            pnode->fin = fin;
            break;
        } else if (pnode->seq < seq && pnode->seq + pnode->len > seq) {
            if (pnode->seq + pnode->len < seq + len) {
                // copy the rest data to the node.
                int overlap = pnode->seq + pnode->len - seq;
                memcpy(pnode->data + pnode->len, packet + overlap, len - overlap);
                pnode->len = overlap + pnode->len;
                pnode->fin = fin;
            }
            break;
        } else if (pnode->seq > seq) {
            if (seq + len <= pnode->seq) {
                // insert a node in middle.
                Tcp_Node *new_node = malloc(sizeof(Tcp_Node));
                memset(new_node, 0, sizeof(Tcp_Node));
                memcpy(new_node->data, packet, len);
                new_node->syn = syn;
                new_node->fin = fin;
                new_node->seq = seq;
                new_node->len = len;
                new_node->prev = pnode->prev;
                new_node->next = pnode;
                new_node->ack_node_head = malloc(sizeof(Tcp_Node));
                new_node->ack_len = len;
                memset(new_node->ack_node_head, 0, sizeof(Tcp_Node));
                pnode->prev->next = new_node;
                pnode->prev = new_node;
            } else {
                // reset the recv data.
                int overlap = seq + len - pnode->seq;
                unsigned char tmp[MAX_FRAME_LEN] = {0};
                memcpy(tmp, packet, overlap);
                memcpy(tmp + overlap, pnode->data, pnode->len);
                memcpy(pnode->data, tmp, sizeof(MAX_FRAME_LEN));
                pnode->seq = seq;
                pnode->len = overlap + pnode->len;
                pnode->fin = fin;
            }
            break;
        }
        pre = pnode;
    }
    if (pnode == NULL) {
        // insert a node at head or rear.
        Tcp_Node *new_node = malloc(sizeof(Tcp_Node));
        memset(new_node, 0, sizeof(Tcp_Node));
        memcpy(new_node->data, packet, len);
        new_node->syn = syn;
        new_node->fin = fin;
        new_node->seq = seq;
        new_node->len = len;
        new_node->prev = pre;
        new_node->next = NULL;
        new_node->ack_node_head = malloc(sizeof(Tcp_Node));
        memset(new_node->ack_node_head, 0, sizeof(Tcp_Node));
        new_node->ack_len = len;
        pre->next = new_node;
    }
    return;
}

void handle_tcp_stream(struct ip_header *ip_hdr, struct tcp_header *tcp_hdr, const u_char *packet, int length)
{
    Tcp_List *plist = NULL;
    Tcp_Stream_Id stream_id = get_stream_id(ip_hdr, tcp_hdr);
    int is_ack = False;
    Tcp_List *plist_pre = &tcp_list_head;
    for (plist = tcp_list_head.next; plist != NULL; plist = plist->next) {
        if (is_same_stream(&stream_id, &(plist->id), &is_ack) == True) {
            break;
        }
        plist_pre = plist;
    }

    unsigned long seq = ntohl(tcp_hdr->tcp_seq);
    unsigned long ack = ntohl(tcp_hdr->tcp_ack);
    int len = length;
    int syn = (tcp_hdr->th_flags & 0x02) >> 1;
    int fin = (tcp_hdr->th_flags & 0x01);
    if (plist == NULL) {
        if (syn == 1) {
            // first node in stream.
            plist = create_tcp_list(stream_id);
        } else {
            // discard this frame.
            return;
        }
    }

    Tcp_Node *pnode = NULL;
    if (is_ack == True) {
        for (pnode = plist->node_head.next; pnode != NULL; pnode = pnode->next) {
            if (pnode->seq + pnode->len == ack) {
                insert_node(seq, len, syn, fin, pnode->ack_node_head, packet);
                pnode->ack_len += len;
                break;
            }
        }
    } else {
        insert_node(seq, len, syn, fin, &(plist->node_head), packet);

        if (fin == 1) {
//            if (is_list_complete(&(plist->node_head)) == True) {
                write_list(&(plist->node_head));
//            }
            free_stream(&plist, plist_pre);
        }
    }
    return;
}

// Because we use pcap filter rule.
// So only get tcp packet here.
void get_frame_callback(u_char *args, const struct pcap_pkthdr *pcap_hdr, const u_char *packet)
{
    struct ip_header *ip_hdr = NULL;
    struct tcp_header *tcp_hdr = NULL;
    u_int8_t ip_hdr_len = 0x00;
    u_int8_t tcp_hdr_len = 0x00;

    // get ip header
    if (pcap_hdr->caplen < 14) {
        printf("Error： ether frame's header < 14\n");
        return;
    }
    ip_hdr = (struct ip_header *) (packet + sizeof(struct ether_header));
    ip_hdr_len = ip_hdr->ip_vhl & 0x0f;
    if (ip_hdr_len < 5) {
        printf("Error : ip frame's header len < 20 byte\n");
        return;
    }

    // get tcp header
    tcp_hdr = (struct tcp_header *) (packet + sizeof(struct ether_header) + ip_hdr_len * 4);
    tcp_hdr_len = (tcp_hdr->th_offx2 & 0xf0) >> 4;
    if (tcp_hdr_len < 5) {
        printf("Error : tcp frame's header len < 20 byte\n");
        return;
    }
    int total_hdr_len = sizeof(struct ether_header) + (ip_hdr_len + tcp_hdr_len) * 4;
    handle_tcp_stream(ip_hdr, tcp_hdr, packet + total_hdr_len, pcap_hdr->caplen - total_hdr_len);
    return;
}

int main(int argc, char **argv)
{
    pcap_t *pdesc = NULL;
    char err_buff[PCAP_ERRBUF_SIZE] = {0};
    char *if_name = NULL;
    char pcap_filter_rule[MAX_STR_LEN] = {0};
    char mac_addr[MAX_STR_LEN] = {0};
    bpf_u_int32 bpf_mask = 0;
    struct bpf_program bpf_program = {0};

    memset(stream_id_arr, 0, sizeof(struct Stream_id));
    memset(&tcp_list_head, 0, sizeof(Tcp_List));

    // get network device name
    if_name = pcap_lookupdev(err_buff);
    if (if_name == NULL) {
        printf("Get net interface name error!\n");
        return 0;
    }

    // get mac address
    if (get_linux_mac_address(mac_addr, if_name) == -1) {
        printf("Get mac address error at device:%s:!\n", if_name);
        return 0;
    }

    // pcap open
    pdesc = pcap_open_live(if_name, 65536, 0, 30 * (10 ^ 3), err_buff);
    if (pdesc == NULL) {
        printf("pcap open error! ERROR MSG: %s\n", err_buff);
        return 0;
    }

    // set filter rule
    snprintf(pcap_filter_rule, MAX_STR_LEN, "tcp and (ether dst %s or ether src %s)", mac_addr, mac_addr);

    if (pcap_compile(pdesc, &bpf_program, pcap_filter_rule, 0, bpf_mask) == -1) {
        printf("pcap compile error!\n");
        return 0;
    }
    if (pcap_setfilter(pdesc, &bpf_program) == -1) {
        printf("pcap setfilter error!\n");
        return 0;
    }

    // set pcap loop
    if (pcap_loop(pdesc, -1, get_frame_callback, NULL) == -1) {
        printf("set pcap loop error!\n");
        return 0;
    }

    // pcap close
    pcap_close(pdesc);
    return 0;
}
