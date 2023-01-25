package main

import (
    "encoding/json"
    "fmt"
    "io/ioutil"
    "log"
    "net/http"
    "github.com/rs/cors"
    "github.com/gorilla/mux"
)

type url_struct struct {
    Url string
}

func main() {
    r := mux.NewRouter()
    r.HandleFunc("/TNA/{keyword}", getTNA)
    r.HandleFunc("/OTH/{keyword}", getOTH)
    r.HandleFunc("/SPARQL/{url}", getSPARQL)
    handler := cors.Default().Handler(r)
    http.ListenAndServe(":5000", handler)
}

func getTNA(w http.ResponseWriter, r *http.Request) {
    vars := mux.Vars(r)
    keyword := vars["keyword"]

    response, err := http.Get("https://discovery.nationalarchives.gov.uk/API/search/records?sps.heldByCode=TNA&sps.searchQuery="+keyword)

    if err != nil {
        fmt.Print(err.Error())
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
    }

    responseData, err := ioutil.ReadAll(response.Body)
    if err != nil {
        log.Fatal(err)
    }
        w.Header().Set("Content-Type", "application/json")
        w.Write([]byte(responseData))
}

func getSPARQL(w http.ResponseWriter, r *http.Request) {
    body, err := ioutil.ReadAll(r.Body)
    if err != nil {
        panic(err)
    }
    var url url_struct
    err = json.Unmarshal(body, &url)
    if err != nil {
        panic(err)
    }
    response, err := http.Get(url.Url)

    if err != nil {
        fmt.Print(err.Error())
    }

    responseData, err := ioutil.ReadAll(response.Body)
    if err != nil {
        log.Fatal(err)
    }
        w.Header().Set("Content-Type", "application/json")
        w.Write([]byte(responseData))
}