FROM node:10

RUN apt-get update && apt-get install -y gettext-base && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

RUN mkdir -p /usr/src/app

ADD . /usr/src/app

WORKDIR /usr/src/app

RUN npm install

EXPOSE 80
