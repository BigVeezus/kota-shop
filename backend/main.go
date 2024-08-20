package main

import (
	"log"
	"net/http"

	middlewares "github.com/bigVeezus/kota-shop/handlers"
	"github.com/bigVeezus/kota-shop/routes"
	"github.com/fatih/color"
	"github.com/rs/cors"
)

func main() {
	port := middlewares.DotEnvVariable("PORT")
	color.Cyan("🌏 Server running on localhost:" + port)

	log.SetFlags(log.Ldate | log.Ltime | log.Lshortfile)
	router := routes.Routes()
	c := cors.New(cors.Options{
		AllowedOrigins: []string{"*"},
		AllowedMethods: []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders: []string{"Origin", "Content-Type", "Accept", "Accept-Language", "Content-Length", "Accept-Language", "Accept-Encoding", "X-CSRF-Token", "accept", "origin", "Cache-Control", "authorizationrequired", "Authorizationrequired", "authorization", "Connection", "Access-Control-Allow-Origin", "Authorization"},
	})

	handler := c.Handler(router)
	http.ListenAndServe(":"+port, middlewares.LogRequest(handler))
}
