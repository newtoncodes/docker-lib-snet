FROM node:9.3-alpine

RUN apk --no-cache --update upgrade && apk --no-cache add bash
RUN apk --no-cache --update upgrade && apk --no-cache add curl
RUN apk --no-cache --update upgrade && apk --no-cache add socat
RUN apk --no-cache --update upgrade && apk --no-cache add openvpn

RUN mkdir /etc/snet

ADD start.js /usr/bin/start
RUN chmod +x /usr/bin/start

CMD ["start"]