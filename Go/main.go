package main

import (
    "fmt"
    "io/ioutil"
    "log"
    "net/http"
    "os"
    "github.com/rs/cors"
    "github.com/gorilla/mux"
)

func main() {
    r := mux.NewRouter()
    r.HandleFunc("/TNA/{keyword}", getTNA)
    r.HandleFunc("/OTH/{keyword}", getOTH)
    handler := cors.Default().Handler(r)
    http.ListenAndServe(":9090", handler)
}

func getTNA(w http.ResponseWriter, r *http.Request) {
    vars := mux.Vars(r)
    keyword := vars["keyword"]

    response, err := http.Get("https://discovery.nationalarchives.gov.uk/API/search/records?sps.heldByCode=TNA&sps.searchQuery="+keyword)

    if err != nil {
        fmt.Print(err.Error())
        os.Exit(1)
    }

    responseData, err := ioutil.ReadAll(response.Body)
    if err != nil {
        log.Fatal(err)
    }
        w.Header().Set("Content-Type", "application/json")
        w.Write([]byte(responseData))
}

func getOTH(w http.ResponseWriter, r *http.Request) {
    vars := mux.Vars(r)
    keyword := vars["keyword"]

    response, err := http.Get("https://discovery.nationalarchives.gov.uk/API/search/records?sps.heldByCode=OTH&sps.searchQuery="+keyword)

    if err != nil {
        fmt.Print(err.Error())
        os.Exit(1)
    }

    responseData, err := ioutil.ReadAll(response.Body)
    if err != nil {
        log.Fatal(err)
    }
        w.Header().Set("Content-Type", "application/json")
        w.Write([]byte(responseData))
}