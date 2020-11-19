package db

import (
	"testing"

	"github.com/kadoshita/ghost/src/config"
)

func TestInitDB(t *testing.T) {
	tests := []struct {
		name string
	}{
		{
			name: "init db",
		},
		// TODO: Add test cases.
	}
	for _, tt := range tests {
		config := config.GetConfing("../../.env")
		t.Run(tt.name, func(t *testing.T) {
			if got := InitDB(config); got == nil {
				t.Errorf("InitDB() = %v, want %v", got, "not nil")
			}
		})
	}
}

func Test_getDB(t *testing.T) {
	tests := []struct {
		name string
	}{
		{
			name: "get db",
		},
		// TODO: Add test cases.
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := getDB(); got == nil {
				t.Errorf("getDB() = %v, want %v", got, "not nil")
			}
		})
	}
}
