package db

import "github.com/jinzhu/gorm"

// History はHostの死活ステータスの履歴を持つ
type History struct {
	gorm.Model
	HostInfoID uint `json:"host"`
	HostInfo   HostInfo
	IsUP       bool `json:"isup"`
}
