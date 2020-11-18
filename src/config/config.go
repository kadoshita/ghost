package config

import (
	"log"
	"os"
	"strconv"

	"github.com/joho/godotenv"
)

type Config struct {
	DBUser    string
	DBPass    string
	DBAddress string
	DBPort    int
	DBName    string
}

func GetConfing(envpath string) Config {
	if envpath != "" {
		err := godotenv.Load(envpath)
		if err != nil {
			log.Fatalln("Cannot load .env")
		}
	}

	var DBPort int
	DBUser := os.Getenv("DB_USER")
	DBPass := os.Getenv("DB_PASS")
	DBAddress := os.Getenv("DB_ADDRESS")
	DBPort, err := strconv.Atoi(os.Getenv("DB_PORT"))
	if err != nil {
		log.Fatalln("Cannnot load DBPort config")
	}
	DBName := os.Getenv("DB_NAME")

	config := Config{DBUser: DBUser, DBPass: DBPass, DBAddress: DBAddress, DBPort: DBPort, DBName: DBName}
	return config
}
