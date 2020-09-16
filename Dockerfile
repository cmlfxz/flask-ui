FROM myhub.mydocker.com/base/alpine-nginx:1.16.2
MAINTAINER 915613275@qq.com
COPY dist /usr/share/nginx/flask-ui
COPY default.conf /etc/nginx/conf.d/default.conf
RUN mkdir -p /home/logs/flask-ui
CMD [ "nginx", "-g", "daemon off;"]