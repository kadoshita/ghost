package api

import (
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/kadoshita/ghost/src/db"
)

func OnGetHistories(c *gin.Context) {
	limit, _ := strconv.Atoi(c.Query("limit"))
	if limit <= 0 {
		limit = 10
	}
	histories := db.GetHistories(limit)
	c.JSON(200, histories)
}
