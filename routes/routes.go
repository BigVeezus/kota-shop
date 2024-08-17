package routes

import (
	"github.com/bigVeezus/kota-shop/controllers"
	middlewares "github.com/bigVeezus/kota-shop/handlers"
	"github.com/gorilla/mux"
)

// Routes -> define endpoints
func Routes() *mux.Router {
	router := mux.NewRouter()
	router.HandleFunc("/auth", controllers.Register).Methods("POST")
	router.HandleFunc("/login", controllers.Login).Methods("POST")
	router.HandleFunc("/item", middlewares.IsAuthorized(controllers.CreateItem)).Methods("POST")
	router.HandleFunc("/items", middlewares.IsAuthorized(controllers.GetAllItems)).Methods("GET")
	// router.HandleFunc("/people", middlewares.IsAuthorized(controllers.GetPeopleEndpoint)).Methods("GET")
	router.HandleFunc("/item/{id}", middlewares.IsAuthorized(controllers.GetOneItem)).Methods("GET")
	router.HandleFunc("/item/{id}", middlewares.IsAuthorized(controllers.UpdateItem)).Methods("PUT")
	router.HandleFunc("/item/{id}", middlewares.IsAuthorized(controllers.DeleteItem)).Methods("DELETE")
	return router
}
