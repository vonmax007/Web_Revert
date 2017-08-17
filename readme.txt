Capture the packets:
gcc capture.c -o capture -lpcap
chmod +755 capture
sudo ./capture

Revert the webpage:
gcc revert.c -o revert -lz
chmod +755 revert
sudo ./revert

