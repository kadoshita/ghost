package db

import (
	"time"

	"github.com/jinzhu/gorm"
)

// HostType はホストの形式の情報
type HostType struct {
	gorm.Model
	Type string `json:"hosttype"`
}

// HostInfo はホストの基本的な情報を持つ
type HostInfo struct {
	gorm.Model
	Active    bool   `json:"active" gorm:"DEFAULT:false"`
	HostName  string `json:"hostname"`
	IPAddress string `json:"ipaddress"`
	OS        string `json:"os"`
	Core      int    `json:"core"`
	RAM       int    `json:"ram"`
	Disk      int    `json:"disk"`
	// Type      string    `json:"type" gorm:"type enum('server','router','virtual machine'); default: 'server'; not null"`
	HostTypeID uint `json:"type"`
	HostType   HostType
	Online     bool      `json:"online" gorm:"DEFAULT:false"`
	OnlineAt   time.Time `json:"online_at"`
	Note       string    `json:"note"`
}

func GetHosts() (allHostInfo []HostInfo, isNotFound bool) {
	db := getDB()
	db.Preload("HostType").Find(&allHostInfo)
	isNotFound = false
	return
}

func GetHostById(id int) (hostInfo HostInfo, isNotFound bool) {
	db := getDB()
	isNotFound = db.First(&hostInfo, uint(id)).RecordNotFound()
	db.Model(&hostInfo).Related(&hostInfo.HostType, "HostType")
	return
}

func InsertHost(hostInfo HostInfo) error {
	db := getDB()
	if db.NewRecord(hostInfo) {
		return db.Create(&hostInfo).Error
	}
	return nil
}

func DeleteHost(id int) error {
	db := getDB()
	var deleteHostInfo HostInfo
	deleteHostInfo.ID = uint(id)
	err := db.Delete(&deleteHostInfo).Error
	return err
}

func UpdateHost(hostInfo HostInfo) error {
	db := getDB()
	err := db.Save(&hostInfo).Error
	return err
}

func IsExistHost(id int) bool {
	db := getDB()
	var searchHostInfo HostInfo
	searchHostInfo.ID = uint(id)
	return !db.First(&searchHostInfo).RecordNotFound()
}
