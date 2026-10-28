FROM node:24-alpine

# Prisma 5 needs OpenSSL, which the Node 24 Alpine image no longer ships
RUN apk add --no-cache openssl

USER root

WORKDIR /home/node/app