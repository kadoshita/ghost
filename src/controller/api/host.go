package api

import (
	"log"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/kadoshita/ghost/src/db"
)

func OnGetAPIHosts(c *gin.Context) {
	allHostInfo, isNotFound := db.GetHosts()
	if isNotFound {
		log.Println("Cannnot get HostInfo")
		c.Status(500)
		return
	}

	nowUnixTime := time.Now().Unix()
	setting, isNotFound := db.GetSetting()
	if isNotFound {
		log.Println("Cannnot get Setting")
		c.Status(500)
		return
	}
	timeoutSecond := int64(setting.Timeout)
	for i := range allHostInfo {
		if nowUnixTime-allHostInfo[i].OnlineAt.Unix() > timeoutSecond {
			allHostInfo[i].Online = false
			history := db.History{
				HostInfo: allHostInfo[i],
				IsUP:     false,
			}
			err := db.InsertHistory(history)
			if err != nil {
				log.Println("Cannot update history status to offline")
				log.Fatalln(err)
				c.Status(500)
				return
			}
		}
		hostInfo := allHostInfo[i]
		err := db.UpdateHost(hostInfo)
		if err != nil {
			log.Println("Cannot update host status to online")
			log.Fatalln(err)
			c.Status(500)
			return
		}
	}

	c.JSON(200, allHostInfo)
}
func OnGetAPIHostByID(c *gin.Context) {
	hostID, _ := strconv.Atoi(c.Param("id"))
	hostInfo, isNotFound := db.GetHostById(hostID)
	if isNotFound {
		c.JSON(404, gin.H{"message": "NotFound"})
		return
	}

	setting, isNotFound := db.GetSetting()
	if isNotFound {
		log.Println("Cannnot get Setting")
		c.Status(500)
		return
	}
	timeoutSecond := int64(setting.Timeout)
	if time.Now().Unix()-hostInfo.OnlineAt.Unix() > timeoutSecond {
		hostInfo.Online = false
		history := db.History{
			HostInfo: hostInfo,
			IsUP:     false,
		}
		err := db.InsertHistory(history)
		if err != nil {
			log.Println("Cannot update history status to offline")
			log.Fatalln(err)
			c.Status(500)
			return
		}
	}

	err := db.UpdateHost(hostInfo)
	if err != nil {
		log.Println("cannot update host status to online")
		log.Fatalln(err)
		return
	}

	c.JSON(200, hostInfo)
}
func OnPostAPIHost(c *gin.Context) {
	var postData db.HostInfo
	err := c.ShouldBindJSON(&postData)
	if err != nil {
		c.Status(400)
		log.Println(err)
		return
	} else {
		log.Println(postData.Active, postData.HostName, postData.IPAddress, postData.Core, postData.RAM, postData.Disk, postData.HostTypeID)
		newData := db.HostInfo{Active: postData.Active, HostName: postData.HostName, IPAddress: postData.IPAddress, OS: postData.OS, Core: postData.Core, RAM: postData.RAM, Disk: postData.Disk, HostTypeID: postData.HostTypeID, Note: postData.Note}
		if err := db.InsertHost(newData); err != nil {
			c.Status(400)
			return
		}
		c.Status(200)
	}
}
func OnDeleteAPIHost(c *gin.Context) {
	hostID, _ := strconv.Atoi(c.Param("id"))

	if !db.IsExistHost(hostID) {
		c.JSON(404, gin.H{"message": "NotFound"})
		return
	}
	if err := db.DeleteHost(hostID); err != nil {
		log.Fatalln(err)
		c.Status(500)
		return
	}
	c.Status(200)
}

func OnPutAPIHost(c *gin.Context) {
	hostID, _ := strconv.Atoi(c.Param("id"))
	var updateData db.HostInfo
	if err := c.ShouldBindJSON(&updateData); err != nil {
		c.Status(500)
		log.Fatalln(err)
		return
	}
	updateData.ID = uint(hostID)
	log.Println(updateData.ID, updateData.Active, updateData.HostName, updateData.IPAddress, updateData.Core, updateData.RAM, updateData.Disk, updateData.HostTypeID)
	if err := db.UpdateHost(updateData); err != nil {
		c.Status(500)
		log.Fatalln(err)
		return
	}
	c.Status(200)
}

func OnLiveRequest(c *gin.Context) {
	hostID, _ := strconv.Atoi(c.Param("id"))
	if err := c.ShouldBindUri(&hostID); err != nil {
		c.JSON(400, gin.H{"message": "parameter error"})
		return
	}
	if !db.IsExistHost(hostID) {
		c.JSON(404, gin.H{"message": "NotFound"})
		return
	}
	hostInfo, _ := db.GetHostById(hostID)
	hostInfo.Online = true
	hostInfo.OnlineAt = time.Now()
	if err := db.UpdateHost(hostInfo); err != nil {
		c.Status(500)
		log.Fatalln(err)
		return
	}

	history := db.History{
		HostInfo: hostInfo,
		IsUP:     true,
	}
	err := db.InsertHistory(history)
	if err != nil {
		c.Status(500)
		log.Println("cannot update host status to online")
		log.Fatalln(err)
		return
	}
	c.Status(200)
}
