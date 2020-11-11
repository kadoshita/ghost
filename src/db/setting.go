package db

import (
	"github.com/jinzhu/gorm"
)

// Setting はアプリケーションの設定情報を持つ
type Setting struct {
	gorm.Model
	Timeout int `json:"timeout" gorm:"DEFAULT:10"`
}

func GetSetting() (setting Setting, isNotFound bool) {
	db := getDB()
	isNotFound = db.First(&setting).RecordNotFound()
	return
}

func GetHostTypes() (allHostType []HostType, isNotFound bool) {
	db := getDB()
	db.Find(&allHostType)
	isNotFound = false
	return
}

func UpdateSetting(setting Setting) error {
	db := getDB()
	err := db.Save(&setting).Error
	return err
}

func InsertHostType(hostType HostType) error {
	db := getDB()
	if db.NewRecord(hostType) {
		return db.Create(&hostType).Error
	}
	return nil
}

func DeleteHostType(id int) error {
	db := getDB()
	var deleteHostType HostType
	deleteHostType.ID = uint(id)
	err := db.Delete(&deleteHostType).Error
	return err
}

func IsExistHostType(id int) bool {
	db := getDB()
	var searchHostType HostType
	searchHostType.ID = uint(id)
	return !db.First(&searchHostType).RecordNotFound()
}
