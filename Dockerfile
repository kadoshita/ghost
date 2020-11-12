FROM golang:latest AS build-backend

WORKDIR /go/src
COPY main.go main.go
COPY go.mod go.mod
COPY go.sum go.sum
COPY src/ src/
RUN CGO_ENABLED=0 GOOS=linux GIN_MODE=release go build -a -installsuffix cgo -o ghost .

FROM node:lts AS build-frontend
WORKDIR /root
COPY ./frontend/package.json .
RUN npm i
COPY ./frontend/src/ ./src/
COPY ./frontend/public/ ./public/
COPY ./frontend/tsconfig.json .
COPY ./frontend/yarn.lock .
RUN npm run build

FROM alpine:latest
LABEL maintainer="sublimer@sublimer.me"
WORKDIR /root/
COPY  --from=build-backend /go/src/ghost .
COPY --from=build-frontend /root/build/ ./frontend/build/
EXPOSE 8080
CMD [ "./ghost" ]