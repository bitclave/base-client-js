# This is is docker file to generate Docker container
# that can be used to build-base-clinet-js by external CI tools

FROM node:10-alpine
RUN apk update && \
    apk add --update git && \
    apk add --update openssh
