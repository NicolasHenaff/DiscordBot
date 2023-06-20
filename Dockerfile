FROM node:18-alpine

ENV DISCORD_TOKEN "NONE"
ENV CLIENT_ID "NONE"

WORKDIR /usr/app
COPY ./ /usr/app/

RUN npm install
RUN echo "#!/bin/sh" > startup.sh && \
    echo "echo DISCORD_TOKEN=\$DISCORD_TOKEN > .env" >> startup.sh && \
    echo "echo CLIENT_ID=\$CLIENT_ID >> .env" >> startup.sh && \
    echo "npm start" >> startup.sh && \
    chmod +x startup.sh

CMD ["./startup.sh"]
