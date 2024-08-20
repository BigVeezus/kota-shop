FROM golang:latest

ENV GO111MODULE=on
ENV PORT=8080
ENV MONGO_URL=mongodb://root:example@test-mongo:27017/?directConnection=true
ENV JWT_SECRET=secret
WORKDIR /app
COPY go.mod .
COPY go.sum .

RUN go mod download

COPY . .
RUN go build -o /my-go-app



EXPOSE 8080

ENTRYPOINT ["/my-go-app"]

