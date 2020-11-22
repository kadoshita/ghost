package main

import (
	"os"

	"github.com/kadoshita/ghost/src/config"
	"github.com/kadoshita/ghost/src/controller/api"
	"github.com/kadoshita/ghost/src/db"

	"github.com/gin-contrib/cors"
	"github.com/gin-contrib/static"
	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/mysql"
)

var dbCon *gorm.DB
var timeoutSecond int

func main() {
	config := config.GetConfing("./.env")
	dbCon = db.InitDB(config)

	defer dbCon.Close()

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
		hostAPI.GET("/", api.OnGetAPIHosts)
		hostAPI.GET("/:id", api.OnGetAPIHostByID)
		hostAPI.POST("/", api.OnPostAPIHost)
		hostAPI.DELETE("/:id", api.OnDeleteAPIHost)
		hostAPI.PUT("/:id", api.OnPutAPIHost)
		hostAPI.Any("/:id/live", api.OnLiveRequest)
	}
	settingAPI := r.Group("/api/setting")
	{
		settingAPI.GET("/hosttype", api.OnGetAPIHostTypes)
		settingAPI.POST("/hosttype", api.OnPostAPIHostType)
		settingAPI.DELETE("/hosttype/:id", api.OnDeleteAPIHostType)
		settingAPI.GET("/timeout", api.OnGetAPITimeOut)
		settingAPI.PUT("/timeout", api.OnPutAPITimeOut)
	}
	historyAPI := r.Group("/api/history")
	{
		historyAPI.GET("/", api.OnGetHistories)
	}
	r.Use(static.Serve("/", static.LocalFile("frontend/build", false)))
	r.Run()
}
