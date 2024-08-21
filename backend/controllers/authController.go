package controllers

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"time"

	middlewares "github.com/bigVeezus/kota-shop/handlers"
	"github.com/bigVeezus/kota-shop/models"
	"github.com/bigVeezus/kota-shop/validators"
	"go.mongodb.org/mongo-driver/bson"
	"golang.org/x/crypto/bcrypt"
)

var usersCollection = client.Database("kota-shop").Collection("users")

// Auths -> register & get token
var Register = http.HandlerFunc(func(response http.ResponseWriter, request *http.Request) {
	var ctx, cancel = context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var newUser models.RegisterUser
	err := json.NewDecoder(request.Body).Decode(&newUser)
	if err != nil {
		middlewares.BadRequestErrResponse(err.Error(), response)
		return
	}

	if ok, errors := validators.ValidateInputs(newUser); !ok {
		middlewares.ValidationResponse(errors, response)
		return
	}

	newUser.CreatedAt, _ = time.Parse(time.RFC3339, time.Now().Format(time.RFC3339))
	newUser.UpdatedAt, _ = time.Parse(time.RFC3339, time.Now().Format(time.RFC3339))

	count, _ := usersCollection.CountDocuments(ctx, bson.M{"email": newUser.Email})

	if count > 0 {
		middlewares.BadRequestErrResponse("Email already exists!", response)
		return
	}

	password := hashPassword(newUser.Password)
	newUser.Password = password

	result, err := usersCollection.InsertOne(ctx, newUser)
	if err != nil {
		middlewares.BadRequestErrResponse(err.Error(), response)
		return
	}

	res, _ := json.Marshal(result.InsertedID)

	validToken, err := middlewares.GenerateJWT(newUser.Name, string(res))
	if err != nil {
		middlewares.ErrorResponse("Failed to generate token", response)
	}

	middlewares.SuccessResponse(string(validToken), "", response)
})

var Login = http.HandlerFunc(func(response http.ResponseWriter, request *http.Request) {
	var ctx, cancel = context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var user models.RegisterUser
	var existingUser models.RegisterUser

	err := json.NewDecoder(request.Body).Decode(&user)
	if err != nil {
		middlewares.BadRequestErrResponse(err.Error(), response)
		return
	}

	if ok, errors := validators.ValidateInputs(user); !ok {
		middlewares.ValidationResponse(errors, response)
		return
	}
	collection := client.Database("kota-shop").Collection("users")

	err = collection.FindOne(ctx, bson.M{"email": user.Email}).Decode(&existingUser)

	if err != nil {
		middlewares.UnauthorizedErrResponse("Invalid credentials!", response)
		return
	}

	passwordIsValid, _ := verifyPassword(user.Password, existingUser.Password)
	if !passwordIsValid {
		middlewares.UnauthorizedErrResponse("Invalid credentials!", response)
		return
	}

	println(existingUser.ID.Hex())

	validToken, err := middlewares.GenerateJWT(existingUser.Name, existingUser.ID.Hex())
	if err != nil {
		middlewares.ErrorResponse("Failed to generate token", response)
		return
	}

	returnUser := models.UserModel{Email: existingUser.Email, ID: existingUser.ID, CreatedAt: existingUser.CreatedAt, UpdatedAt: existingUser.UpdatedAt}

	middlewares.SuccessUserLoginResponse(returnUser, validToken, response)
})

// HashPassword is used to encrypt the password before it is stored in the DB
func hashPassword(password string) string {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	if err != nil {
		log.Panic(err)
	}

	return string(bytes)
}

// VerifyPassword checks the input password while verifying it with the passward in the DB.
func verifyPassword(userPassword string, providedPassword string) (bool, string) {
	err := bcrypt.CompareHashAndPassword([]byte(providedPassword), []byte(userPassword))
	check := true
	msg := ""

	if err != nil {
		msg = "login or passowrd is incorrect"
		check = false
	}

	return check, msg
}
