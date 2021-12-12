#include <stdio.h>
#include <unistd.h>
#include <string.h>
#include <stdlib.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <stdbool.h>

#include <sys/socket.h>
#include <sys/types.h>
#include <sys/stat.h>

#define PORT htons(3001)
#define BUFF_SIZE 1024

void recv_message(int socket, char* client_address) {
    char buff[BUFF_SIZE];
    memset(buff, 0, BUFF_SIZE);
    while(recv(socket, buff, BUFF_SIZE, 0)){
    printf("%s: %s\n", client_address, buff);
    memset(buff, 0, BUFF_SIZE);
    }
    // close(socket);
}

int main(void) {
    int sockfd, sockfd_client;
    struct sockaddr_in adr;
    socklen_t dladr = sizeof(struct sockaddr_in);

    sockfd = socket(PF_INET, SOCK_STREAM, 0);
    adr.sin_family = AF_INET;
    adr.sin_port = PORT;
    adr.sin_addr.s_addr = INADDR_ANY;
    memset(adr.sin_zero, 0, sizeof(adr.sin_zero));
    
    // bind
    if (bind(sockfd, (struct sockaddr*) &adr, dladr) < 0)
    {
        printf("Main: bind failed\n");
        return 1;
    }

    // listen
    listen(sockfd, 10);

    while(1)
    {
        dladr = sizeof(struct sockaddr_in);
        sockfd_client = accept(sockfd, (struct sockaddr*) &adr, &dladr);
        if (sockfd_client < 0)
        {
            printf("Main: Error while accepting connection.\n");
            continue;
        }
        printf("Main: %s:%u connected.\n", inet_ntoa(adr.sin_addr), ntohs(adr.sin_port));
        if (fork() == 0)
        {
            // child process
            // printf("Child: starting process\n");
            recv_message(sockfd_client, inet_ntoa(adr.sin_addr));
            printf("Child: %s:%u disconnected.\n", inet_ntoa(adr.sin_addr), ntohs(adr.sin_port));
            exit(0);
        }
        else
        {
            // main process
            continue;
        }
    }
    return 0;
}