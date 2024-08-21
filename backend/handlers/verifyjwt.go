package middlewares

import (
	"context"
	"fmt"
	"net/http"
	"strings"
	"time"

	jwt "github.com/dgrijalva/jwt-go"
)

var mySigningKey = []byte(DotEnvVariable("JWT_SECRET"))

type contextKey string

const userIDKey contextKey = "userID"

// IsAuthorized -> verify jwt header
func IsAuthorized(next http.Handler) http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		if r.Header["Authorization"] != nil {

			tokenArray := strings.Fields(r.Header["Authorization"][0])
			tokenString := tokenArray[1]

			token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
				if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
					return nil, fmt.Errorf("there was an error")
				}
				return mySigningKey, nil
			})

			if err != nil {
				UnauthorizedErrResponse(err.Error(), w)
			}

			// / Check if the token is valid
			if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
				// Extract the user ID from the claims
				userID, ok := claims["id"].(string)
				if !ok {
					UnauthorizedErrResponse("Invalid token claims", w)
					return
				}

				// Add the user ID to the request context
				ctx := context.WithValue(r.Context(), userIDKey, userID)
				next.ServeHTTP(w, r.WithContext(ctx))
			} else {
				UnauthorizedErrResponse("Not Authorized", w)
			}

		} else {
			UnauthorizedErrResponse("Not Authorized", w)
		}
	})
}

func GetUserIDFromContext(ctx context.Context) string {
	userID := ctx.Value(userIDKey).(string)
	return userID
}

// GenerateJWT -> generate jwt
func GenerateJWT(name string, id string) (string, error) {
	token := jwt.New(jwt.SigningMethodHS256)

	claims := token.Claims.(jwt.MapClaims)

	claims["authorized"] = true
	claims["client"] = name
	claims["id"] = id
	claims["exp"] = time.Now().Add(time.Minute * 200).Unix()

	tokenString, err := token.SignedString(mySigningKey)

	if err != nil {
		return "", err
	}

	return tokenString, nil
}
