package db

import (
	"fmt"

	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/mysql"
	"github.com/kadoshita/ghost/src/config"
)

var DB *gorm.DB

func InitDB(config config.Config) *gorm.DB {
	connectionString := fmt.Sprintf("%s:%s@tcp(%s:%d)/%s?charset=utf8&parseTime=True&loc=Local", config.DBUser, config.DBPass, config.DBAddress, config.DBPort, config.DBName)
	db, err := gorm.Open("mysql", connectionString)
	if err != nil {
		panic(err.Error())
	}

	db.AutoMigrate(&HostInfo{})
	db.AutoMigrate(&Setting{})
	db.AutoMigrate(&HostType{})
	db.AutoMigrate(&HostRole{})
	db.AutoMigrate(&History{})

	initSetting := Setting{}
	db.NewRecord(&initSetting)
	db.Create(&initSetting)

	DB = db
	return db
}

func getDB() *gorm.DB {
	return DB
}
