package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type FoodItemModel struct {
	ID        primitive.ObjectID `json:"_id,omitempty" bson:"_id,omitempty"`
	Name      string             `json:"name,omitempty" bson:"name,omitempty" validate:"required"`
	Type      string             `json:"type" bson:"type,omitempty" validate:"eq=FRUIT|eq=FOOD|eq=DRINK|eq=SNACK"`
	Quantity  int                `json:"quantity" bson:"quantity,omitempty" validate:"required"`
	CreatedAt time.Time          `json:"createdAt,omitempty" bson:"createdAt,omitempty"`
	UpdatedAt time.Time          `json:"updatedAt,omitempty" bson:"updatedAt,omitempty"`
}

type EditFoodItemModel struct {
	Name      *string   `json:"name" bson:"name"`
	Type      *string   `json:"type" bson:"type" validate:"eq=FRUIT|eq=FOOD|eq=DRINK|eq=SNACK"`
	Quantity  *int      `json:"quantity" bson:"quantity"`
	UpdatedAt time.Time `json:"updatedAt,omitempty" bson:"updatedAt,omitempty"`
}
