package controllers

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"time"

	"github.com/bigVeezus/kota-shop/db"
	middlewares "github.com/bigVeezus/kota-shop/handlers"
	"github.com/bigVeezus/kota-shop/models"
	"github.com/bigVeezus/kota-shop/validators"
	"github.com/gorilla/mux"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

var client = db.Dbconnect()
var foodItemsCollection = client.Database("kota-shop").Collection("food-items")

// CreateItemEndpoint -> create item
var CreateItem = http.HandlerFunc(func(response http.ResponseWriter, request *http.Request) {
	var ctx = request.Context()

	userId := middlewares.GetUserIDFromContext(ctx)

	var item models.FoodItemModel
	err := json.NewDecoder(request.Body).Decode(&item)
	if err != nil {
		middlewares.InternalServerErrResponse(err.Error(), response)
		return
	}
	if ok, errors := validators.ValidateInputs(item); !ok {
		middlewares.ValidationResponse(errors, response)
		return
	}

	id := middlewares.RemoveExtraQuotes(userId)

	item.ID = primitive.NewObjectID()
	item.UserId = id
	item.CreatedAt, _ = time.Parse(time.RFC3339, time.Now().Format(time.RFC3339))
	item.UpdatedAt = item.CreatedAt

	_, err = foodItemsCollection.InsertOne(ctx, item)
	if err != nil {
		middlewares.InternalServerErrResponse(err.Error(), response)
		return
	}

	middlewares.SuccessResponse("successfully inserted food item", item, response)
})

// GetAllItemsEndpoint -> get items
var GetAllItems = http.HandlerFunc(func(response http.ResponseWriter, request *http.Request) {
	var ctx = request.Context()

	userId := middlewares.GetUserIDFromContext(ctx)

	id := middlewares.RemoveExtraQuotes(userId)

	var items []*models.FoodItemModel

	cursor, err := foodItemsCollection.Find(ctx, bson.M{"userId": id})
	if err != nil {
		middlewares.InternalServerErrResponse(err.Error(), response)
		return
	}
	for cursor.Next(context.TODO()) {
		var item models.FoodItemModel
		err := cursor.Decode(&item)
		if err != nil {
			log.Fatal(err)
		}

		items = append(items, &item)
	}
	if err := cursor.Err(); err != nil {
		middlewares.InternalServerErrResponse(err.Error(), response)
		return
	}

	middlewares.SuccessResponse("Got all items", items, response)
})

// // GetItemEndpoint -> get item by id
var GetOneItem = http.HandlerFunc(func(response http.ResponseWriter, request *http.Request) {
	var ctx, cancel = context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	params := mux.Vars(request)
	id, _ := primitive.ObjectIDFromHex(params["id"])
	var item models.FoodItemModel

	err := foodItemsCollection.FindOne(ctx, bson.D{primitive.E{Key: "_id", Value: id}}).Decode(&item)

	if err != nil {
		middlewares.ErrorResponse(" item does not exist", response)
		return
	}
	middlewares.SuccessResponse("Got one item", item, response)
})

// UpdateItemEndpoint -> update item by id
var UpdateItem = http.HandlerFunc(func(response http.ResponseWriter, request *http.Request) {
	var ctx, cancel = context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	params := mux.Vars(request)
	id, _ := primitive.ObjectIDFromHex(params["id"])

	var item models.FoodItemModel
	var editItem models.EditFoodItemModel
	json.NewDecoder(request.Body).Decode(&editItem)

	err := foodItemsCollection.FindOne(ctx, bson.M{"_id": id}).Decode(&item)
	if err != nil {
		middlewares.BadRequestErrResponse(err.Error(), response)
		return
	}

	if editItem.Name == nil {
		editItem.Name = &item.Name
	}
	if editItem.Quantity == nil {
		editItem.Quantity = &item.Quantity
	}
	if editItem.Type == nil {
		editItem.Type = &item.Type
	}

	editItem.UpdatedAt, _ = time.Parse(time.RFC3339, time.Now().Format(time.RFC3339))

	filter := bson.D{{Key: "_id", Value: id}}

	update := bson.D{{Key: "$set", Value: bson.D{
		{Key: "name", Value: editItem.Name},
		{Key: "type", Value: editItem.Type},
		{Key: "quantity", Value: editItem.Quantity},
		{Key: "updated_at", Value: editItem.UpdatedAt},
	}}}

	res, updateErr := foodItemsCollection.UpdateOne(ctx, filter, update)
	if updateErr != nil {
		msg := "user was not updated"
		middlewares.BadRequestErrResponse(msg, response)
		return
	}

	if res.MatchedCount == 0 {
		middlewares.ErrorResponse("Person does not exist", response)
		return
	}

	middlewares.SuccessResponse("Updated item ", "", response)
})

// DeleteItemEndpoint -> delete item by id
var DeleteItem = http.HandlerFunc(func(response http.ResponseWriter, request *http.Request) {
	var ctx, cancel = context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	params := mux.Vars(request)
	id, _ := primitive.ObjectIDFromHex(params["id"])
	var item models.FoodItemModel

	err := foodItemsCollection.FindOne(ctx, bson.D{primitive.E{Key: "_id", Value: id}}).Decode(&item)
	if err != nil {
		middlewares.ErrorResponse("item does not exist", response)
		return
	}
	_, derr := foodItemsCollection.DeleteOne(ctx, bson.D{primitive.E{Key: "_id", Value: id}})

	if derr != nil {
		middlewares.InternalServerErrResponse(derr.Error(), response)
		return
	}

	middlewares.SuccessResponse("deleted item", "", response)
})
