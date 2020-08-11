package main

import (
	"log"

	"github.com/gin-contrib/static"
	"github.com/gin-gonic/gin"
)

type HostInfo struct {
	HostName  string `json:"hostname"`
	IPAddress string `json:"ipaddress"`
	OS        string `json:"os"`
	Core      int    `json:"core"`
	RAM       int    `json:"ram"`
	Disk      int    `json:"disk"`
}

func main() {
	r := gin.Default()
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status": "OK",
		})
	})
	hostApi := r.Group("/api/host")
	{
		hostApi.GET("/", onGetApiHosts)
		hostApi.POST("/", onPostApiHost)
	}
	r.Use(static.Serve("/", static.LocalFile("frontend/build", false)))
	r.Run()
}

func onGetApiHosts(c *gin.Context) {
	dummyHostsData := make([]HostInfo, 3)
	dummyHostsData[0] = HostInfo{"kounotori", "192.168.0.8", "ubuntu", 1, 512, 512}
	dummyHostsData[1] = HostInfo{"akatsuki", "192.168.0.10", "ubuntu", 1, 1024, 16}
	dummyHostsData[2] = HostInfo{"daichi", "192.168.0.11", "ubuntu", 1, 512, 32}
	c.JSON(200, dummyHostsData)
}
func onPostApiHost(c *gin.Context) {
	var postData HostInfo
	err := c.ShouldBindJSON(&postData)
	if err != nil {
		log.Fatalln(err)
		c.Status(500)
	} else {
		log.Println(postData.HostName, postData.IPAddress, postData.Core, postData.RAM, postData.Disk)
		c.Status(200)
	}
}
