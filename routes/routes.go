package routes

import (
	"github.com/bigVeezus/kota-shop/controllers"
	"github.com/gorilla/mux"
)

// Routes -> define endpoints
func Routes() *mux.Router {
	router := mux.NewRouter()
	router.HandleFunc("/auth", controllers.Register).Methods("POST")
	router.HandleFunc("/login", controllers.Login).Methods("POST")
	router.HandleFunc("/item", controllers.CreateItem).Methods("POST")
	router.HandleFunc("/items", controllers.GetAllItems).Methods("GET")
	// router.HandleFunc("/people", middlewares.IsAuthorized(controllers.GetPeopleEndpoint)).Methods("GET")
	router.HandleFunc("/item/{id}", controllers.GetOneItem).Methods("GET")
	router.HandleFunc("/item/{id}", controllers.UpdateItem).Methods("PUT")
	router.HandleFunc("/item/{id}", controllers.DeleteItem).Methods("DELETE")
	return router
}
