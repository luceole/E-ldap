# Conteneur E-LDAP  en mode Production
FROM  node:slim
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY .  /usr/src/app

EXPOSE 1389
ENTRYPOINT [ "npm" ]
CMD [ "start" ]

