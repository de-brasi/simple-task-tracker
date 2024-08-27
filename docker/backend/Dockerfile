FROM node:20-alpine

RUN apk add --no-cache bash
RUN npm install -g @nestjs/cli

ARG uid

COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +sx /usr/local/bin/entrypoint.sh
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]

WORKDIR /var/www/html
#CMD ["bash"]
