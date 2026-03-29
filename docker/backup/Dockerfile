FROM alpine:3.21

RUN apk add --no-cache postgresql17-client gzip busybox-suid

COPY backup.sh /backup.sh
RUN chmod +x /backup.sh

# Use busybox crond which works in containers
RUN echo "0 2 * * * /backup.sh >> /var/log/backup.log 2>&1" > /etc/crontabs/root

CMD ["crond", "-f", "-l", "2"]
