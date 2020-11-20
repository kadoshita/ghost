package db

import (
	"log"

	"github.com/jinzhu/gorm"
)

// History はHostの死活ステータスの履歴を持つ
type History struct {
	gorm.Model
	HostInfoID uint `json:"host"`
	HostInfo   HostInfo
	IsUP       bool `json:"isup"`
}

func GetHistories(limit int) (histories []History) {
	db := getDB()
	if limit < 1 {
		log.Println("limit must be greater than or equal to 1.")
		return
	}
	db.Limit(limit).Find(&histories)
	return
}

func InsertHistory(history History) error {
	db := getDB()
	if db.NewRecord(history) {
		return db.Create(&history).Error
	}
	return nil
}
