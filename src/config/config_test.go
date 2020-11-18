package config

import (
	"reflect"
	"testing"
)

func TestGetConfing(t *testing.T) {
	tests := []struct {
		name string
		path string
		want Config
	}{
		{
			name: "get config parameters from environment file",
			path: "../../.env",
			want: Config{
				DBUser:    "",
				DBPass:    "",
				DBAddress: "",
				DBPort:    0,
				DBName:    "",
			},
		},
		{
			name: "get config parameters from environment variable",
			path: "",
			want: Config{
				DBUser:    "",
				DBPass:    "",
				DBAddress: "",
				DBPort:    0,
				DBName:    "",
			},
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := GetConfing(tt.path); reflect.DeepEqual(got, tt.want) {
				t.Errorf("GetConfing() = %v, want %v", got, tt.want)
			}
		})
	}
}
