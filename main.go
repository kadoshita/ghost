package main

import (
	"fmt"
	"log"
	"os"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-contrib/static"
	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/mysql"
	"github.com/joho/godotenv"
)

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
}

// HostType はホストの形式の情報
type HostType struct {
	gorm.Model
	Type string `json:"hosttype"`
}

// Setting はアプリケーションの設定情報を持つ
type Setting struct {
	gorm.Model
	Timeout int `json:"timeout" gorm:"DEFAULT:10"`
}

// FindHostByID はホスト情報取得用APIに渡されるパラメーター
type FindHostByID struct {
	ID int `uri:"id" binding:"required"`
}

var dbCon *gorm.DB

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Println("Cannot load .env")
	}

	DBUser := os.Getenv("DB_USER")
	DBPass := os.Getenv("DB_PASS")
	DBAddress := os.Getenv("DB_ADDRESS")
	DBPort := os.Getenv("DB_PORT")
	DBName := os.Getenv("DB_NAME")
	connectionString := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8&parseTime=True&loc=Local", DBUser, DBPass, DBAddress, DBPort, DBName)
	db, err := gorm.Open("mysql", connectionString)
	if err != nil {
		panic(err.Error())
	}

	defer db.Close()

	db.AutoMigrate(&HostInfo{})
	db.AutoMigrate(&Setting{})
	db.AutoMigrate(&HostType{})

	initSetting := Setting{}
	db.NewRecord(&initSetting)
	db.Create(&initSetting)

	dbCon = db

	r := gin.Default()
	if os.Getenv("GIN_MODE") != "release" {
		r.Use(cors.Default())
	}
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status": "OK",
		})
	})
	hostAPI := r.Group("/api/host")
	{
		hostAPI.GET("/", onGetAPIHosts)
		hostAPI.GET("/:id", onGetAPIHostByID)
		hostAPI.POST("/", onPostAPIHost)
		hostAPI.DELETE("/:id", onDeleteAPIHost)
		hostAPI.PUT("/:id", onPutAPIHost)
		hostAPI.Any("/:id/live", onLiveRequest)
	}
	settingAPI := r.Group("/api/setting")
	{
		settingAPI.GET("/hosttype", onGetAPIHostTypes)
		settingAPI.GET("/timeout", onGetAPITimeOut)
	}
	r.Use(static.Serve("/", static.LocalFile("frontend/build", false)))
	r.Run()
}

func onGetAPIHosts(c *gin.Context) {
	var allHostInfo []HostInfo
	dbCon.Find(&allHostInfo)
	for i := range allHostInfo {
		dbCon.Model(allHostInfo[i]).Related(&allHostInfo[i].HostType, "HostType")
	}

	nowUnixTime := time.Now().Unix()
	for i := range allHostInfo {
		if nowUnixTime-allHostInfo[i].OnlineAt.Unix() > 10 {
			allHostInfo[i].Online = false
		}
		hostInfo := allHostInfo[i]
		if err := dbCon.Save(&hostInfo).Error; err != nil {
			log.Println("cannot update online status")
			log.Fatalln(err)
			return
		}
	}

	c.JSON(200, allHostInfo)
}
func onGetAPIHostByID(c *gin.Context) {
	var hostInfo HostInfo
	var findHostByID FindHostByID
	if err := c.ShouldBindUri(&findHostByID); err != nil {
		c.JSON(404, gin.H{"message": "NotFound"})
		return
	}
	if dbCon.First(&hostInfo, findHostByID.ID).RecordNotFound() {
		c.JSON(404, gin.H{"message": "NotFound"})
		return
	}

	dbCon.Model(&hostInfo).Related(&hostInfo.HostType, "HostType")

	if time.Now().Unix()-hostInfo.OnlineAt.Unix() > 10 {
		hostInfo.Online = false
	}

	if err := dbCon.Save(&hostInfo).Error; err != nil {
		log.Println("cannot update online status")
		log.Fatalln(err)
		return
	}

	c.JSON(200, hostInfo)
}
func onPostAPIHost(c *gin.Context) {
	var postData HostInfo
	err := c.ShouldBindJSON(&postData)
	if err != nil {
		c.Status(500)
		log.Fatalln(err)
	} else {
		log.Println(postData.Active, postData.HostName, postData.IPAddress, postData.Core, postData.RAM, postData.Disk, postData.HostTypeID)
		newData := HostInfo{Active: postData.Active, HostName: postData.HostName, IPAddress: postData.IPAddress, OS: postData.OS, Core: postData.Core, RAM: postData.RAM, Disk: postData.Disk, HostTypeID: postData.HostTypeID}
		dbCon.NewRecord(newData)
		dbCon.Create(&newData)
		c.Status(200)
	}
}
func onDeleteAPIHost(c *gin.Context) {
	var deleteHostByID FindHostByID
	if err := c.ShouldBindUri(&deleteHostByID); err != nil {
		c.JSON(400, gin.H{"message": "parameter error"})
		return
	}
	var hostInfo HostInfo
	hostInfo.ID = uint(deleteHostByID.ID)
	if dbCon.First(&hostInfo).RecordNotFound() {
		c.JSON(404, gin.H{"message": "NotFound"})
		return
	}
	if err := dbCon.Delete(&hostInfo).Error; err != nil {
		log.Fatalln(err)
		c.Status(500)
		return
	}
	c.Status(200)
}

func onPutAPIHost(c *gin.Context) {
	var updateHostByID FindHostByID
	if err := c.ShouldBindUri(&updateHostByID); err != nil {
		c.JSON(400, gin.H{"message": "parameter error"})
		return
	}
	var updateData HostInfo
	if err := c.ShouldBindJSON(&updateData); err != nil {
		c.Status(500)
		log.Fatalln(err)
		return
	}
	updateData.ID = uint(updateHostByID.ID)
	log.Println(updateData.ID, updateData.Active, updateData.HostName, updateData.IPAddress, updateData.Core, updateData.RAM, updateData.Disk, updateData.HostTypeID)
	if err := dbCon.Save(&updateData).Error; err != nil {
		c.Status(500)
		log.Fatalln(err)
		return
	}
	c.Status(200)
}

func onLiveRequest(c *gin.Context) {
	var liveHostByID FindHostByID
	if err := c.ShouldBindUri(&liveHostByID); err != nil {
		c.JSON(400, gin.H{"message": "parameter error"})
		return
	}
	var hostInfo HostInfo
	hostInfo.ID = uint(liveHostByID.ID)
	if dbCon.First(&hostInfo).RecordNotFound() {
		c.JSON(404, gin.H{"message": "NotFound"})
		return
	}
	hostInfo.Online = true
	hostInfo.OnlineAt = time.Now()
	if err := dbCon.Save(&hostInfo).Error; err != nil {
		c.Status(500)
		log.Fatalln(err)
		return
	}
	c.Status(200)
}

func onGetAPIHostTypes(c *gin.Context) {
	var allHostType []HostType
	dbCon.Find(&allHostType)
	c.JSON(200, allHostType)
}
func onGetAPITimeOut(c *gin.Context) {
	var setting Setting
	if dbCon.First(&setting).RecordNotFound() {
		c.JSON(404, gin.H{"message": "NotFound"})
		return
	}

	c.JSON(200, setting.Timeout)
}
