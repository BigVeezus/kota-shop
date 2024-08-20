package middlewares

import (
	"encoding/json"
	"net/http"

	"github.com/bigVeezus/kota-shop/models"
)

// SuccessRespond -> response formatter
func SuccessUserLoginResponse(fields models.UserModel, token string, writer http.ResponseWriter) {
	_, err := json.Marshal(fields)
	type data struct {
		User       models.UserModel `json:"data"`
		Token      string           `json:"token"`
		Statuscode int              `json:"status"`
		Message    string           `json:"msg"`
	}
	temp := &data{User: fields, Token: token, Statuscode: 200, Message: "success"}
	if err != nil {
		InternalServerErrResponse(err.Error(), writer)
	}

	//Send header, status code and output to writer
	writer.Header().Set("Content-Type", "application/json")
	writer.WriteHeader(http.StatusOK)
	json.NewEncoder(writer).Encode(temp)
}

// SuccessResponse -> success formatter
func SuccessResponse(msg string, payload interface{}, writer http.ResponseWriter) {
	type errdata struct {
		Statuscode int         `json:"status"`
		Message    string      `json:"msg"`
		Payload    interface{} `json:"data"`
	}
	temp := &errdata{Statuscode: 200, Message: msg, Payload: payload}

	//Send header, status code and output to writer
	writer.Header().Set("Content-Type", "application/json")
	writer.WriteHeader(http.StatusOK)
	json.NewEncoder(writer).Encode(temp)
}

// ErrorResponse -> error formatter
func ErrorResponse(error string, writer http.ResponseWriter) {
	type errdata struct {
		Statuscode int    `json:"status"`
		Message    string `json:"msg"`
	}
	temp := &errdata{Statuscode: 400, Message: error}

	//Send header, status code and output to writer
	writer.Header().Set("Content-Type", "application/json")
	writer.WriteHeader(http.StatusBadRequest)
	json.NewEncoder(writer).Encode(temp)
}

// InternalServerErrResponse -> server error formatter
func InternalServerErrResponse(error string, writer http.ResponseWriter) {
	type servererrdata struct {
		Statuscode int    `json:"status"`
		Message    string `json:"msg"`
	}
	temp := &servererrdata{Statuscode: 500, Message: error}

	//Send header, status code and output to writer
	writer.Header().Set("Content-Type", "application/json")
	writer.WriteHeader(http.StatusInternalServerError)
	json.NewEncoder(writer).Encode(temp)
}

func BadRequestErrResponse(error string, writer http.ResponseWriter) {
	type servererrdata struct {
		Statuscode int    `json:"status"`
		Message    string `json:"msg"`
	}
	temp := &servererrdata{Statuscode: 400, Message: error}

	//Send header, status code and output to writer
	writer.Header().Set("Content-Type", "application/json")
	writer.WriteHeader(http.StatusBadRequest)
	json.NewEncoder(writer).Encode(temp)
}

func UnauthorizedErrResponse(error string, writer http.ResponseWriter) {
	type servererrdata struct {
		Statuscode int    `json:"status"`
		Message    string `json:"msg"`
	}
	temp := &servererrdata{Statuscode: 401, Message: error}

	//Send header, status code and output to writer
	writer.Header().Set("Content-Type", "application/json")
	writer.WriteHeader(http.StatusUnauthorized)
	json.NewEncoder(writer).Encode(temp)
}

// ValidationResponse -> user input validation
func ValidationResponse(fields map[string][]string, writer http.ResponseWriter) {
	//Create a new map and fill it
	response := make(map[string]interface{})
	response["errors"] = fields
	response["status"] = 422
	response["msg"] = "validation error"

	//Send header, status code and output to writer
	writer.Header().Set("Content-Type", "application/json")
	writer.WriteHeader(http.StatusUnprocessableEntity)
	json.NewEncoder(writer).Encode(response)
}
