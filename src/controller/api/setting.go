package api

import (
	"log"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/kadoshita/ghost/src/db"
)

func OnGetAPIHostTypes(c *gin.Context) {
	allHostType, isNotFound := db.GetHostTypes()
	if isNotFound {
		log.Println("Cannot get HostType")
		c.Status(500)
		return
	}
	c.JSON(200, allHostType)
}

func OnPostAPIHostType(c *gin.Context) {
	var postData db.HostType
	err := c.ShouldBindJSON(&postData)
	if err != nil {
		c.Status(500)
		log.Fatalln(err)
	} else {
		log.Println(postData.Type)
		if err := db.InsertHostType(postData); err != nil {
			log.Fatalln(err)
			c.Status(500)
			return
		}
		c.Status(200)
	}
}
func OnDeleteAPIHostType(c *gin.Context) {
	hostTypeID, _ := strconv.Atoi(c.Param("id"))
	if !db.IsExistHostType(hostTypeID) {
		c.JSON(404, gin.H{"message": "NotFound"})
		return
	}
	if err := db.DeleteHostType(hostTypeID); err != nil {
		log.Fatalln(err)
		c.Status(500)
		return
	}
	c.Status(200)
}

func OnGetAPITimeOut(c *gin.Context) {
	setting, isNotFound := db.GetSetting()
	if isNotFound {
		c.JSON(404, gin.H{"message": "NotFound"})
		return
	}

	c.JSON(200, setting.Timeout)
}
func OnPutAPITimeOut(c *gin.Context) {
	var setting db.Setting
	err := c.ShouldBindJSON(&setting)
	if err != nil {
		c.Status(500)
		log.Fatalln(err)
	} else {
		currentSetting, isNotFound := db.GetSetting()
		if isNotFound {
			c.Status(500)
			log.Println("Setting NotFound")
		}
		setting.ID = currentSetting.ID
		if err := db.UpdateSetting(setting); err != nil {
			c.Status(500)
			log.Fatalln(err)
			return
		}
		c.Status(200)
	}
}
