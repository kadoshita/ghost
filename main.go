package main

import (
	"fmt"
	"log"
	"os"

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
	HostName  string `json:"hostname" gorm:"UNIQUE"`
	IPAddress string `json:"ipaddress"`
	OS        string `json:"os"`
	Core      int    `json:"core"`
	RAM       int    `json:"ram"`
	Disk      int    `json:"disk"`
}

// FindHostByID はホスト情報取得用APIに渡されるパラメーター
type FindHostByID struct {
	ID int `uri:"id" binding:"required"`
}

var dbCon *gorm.DB

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Cannot load .env")
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
	}
	r.Use(static.Serve("/", static.LocalFile("frontend/build", false)))
	r.Run()
}

func onGetAPIHosts(c *gin.Context) {
	var allHostInfo []HostInfo
	dbCon.Find(&allHostInfo)
	c.JSON(200, allHostInfo)
}
func onGetAPIHostByID(c *gin.Context) {
	var hostInfo HostInfo
	var findHostByID FindHostByID
	if err := c.ShouldBindUri(&findHostByID); err != nil {
		c.JSON(404, gin.H{"message": "NotFound"})
		return
	}
	log.Println(findHostByID.ID)
	if dbCon.First(&hostInfo, findHostByID.ID).RecordNotFound() {
		c.JSON(404, gin.H{"message": "NotFound"})
		return
	}
	c.JSON(200, hostInfo)
}
func onPostAPIHost(c *gin.Context) {
	var postData HostInfo
	err := c.ShouldBindJSON(&postData)
	if err != nil {
		log.Fatalln(err)
		c.Status(500)
	} else {
		log.Println(postData.Active, postData.HostName, postData.IPAddress, postData.Core, postData.RAM, postData.Disk)
		newData := HostInfo{Active: postData.Active, HostName: postData.HostName, IPAddress: postData.IPAddress, OS: postData.OS, Core: postData.Core, RAM: postData.RAM, Disk: postData.Disk}
		dbCon.NewRecord(newData)
		dbCon.Create(&newData)
		c.Status(200)
	}
}
