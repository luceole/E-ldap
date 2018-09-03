# Conteneur E-LDAP  en mode Production
FROM mhart/alpine-node:6
RUN apk add --no-cache vim

#FROM  node:slim
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY .  /usr/src/app

EXPOSE 389
CMD [ "npm", "start" ]

