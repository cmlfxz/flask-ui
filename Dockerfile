FROM from myhub.mydocker.com/base/alpine-nginx:1.16.1
MAINTAINER 915613275@qq.com
COPY dist /usr/shar/nginx/flask-ui
COPY default.conf /etc/nginx/conf.d/default.conf
CMD [ "nginx", "-g", "daemon off;"]