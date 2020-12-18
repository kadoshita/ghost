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

func GetHostRoles() (allHostRole []HostRole, isNotFound bool) {
	db := getDB()
	db.Find(&allHostRole)
	isNotFound = false
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

func InsertHostRole(hostRole HostRole) error {
	db := getDB()
	if db.NewRecord(hostRole) {
		return db.Create(&hostRole).Error
	}
	return nil
}
func InsertHostType(hostType HostType) error {
	db := getDB()
	if db.NewRecord(hostType) {
		return db.Create(&hostType).Error
	}
	return nil
}

func DeleteHostRole(id int) error {
	db := getDB()
	var deleteHostRole HostRole
	deleteHostRole.ID = uint(id)
	err := db.Delete(&deleteHostRole).Error
	return err
}
func DeleteHostType(id int) error {
	db := getDB()
	var deleteHostType HostType
	deleteHostType.ID = uint(id)
	err := db.Delete(&deleteHostType).Error
	return err
}

func IsExistHostRole(id int) bool {
	db := getDB()
	var searchHostRole HostRole
	searchHostRole.ID = uint(id)
	return !db.First(&searchHostRole).RecordNotFound()
}
func IsExistHostType(id int) bool {
	db := getDB()
	var searchHostType HostType
	searchHostType.ID = uint(id)
	return !db.First(&searchHostType).RecordNotFound()
}
