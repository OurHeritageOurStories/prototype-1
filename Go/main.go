package main

import (
    "fmt"
    "io/ioutil"
    "log"
    "net/http"
    "net/url"
    "os"
    "github.com/rs/cors"
    "github.com/gorilla/mux"
    "strings"
    "strconv"
    "encoding/json"
)

func main() {
    r := mux.NewRouter()
    r.HandleFunc("/", printStatus)
    r.HandleFunc("/discovery", fetchDiscovery)
    r.HandleFunc("/entities", getEntities)
    r.HandleFunc("/entities/{entity}", getEntity)
    handler := cors.Default().Handler(r)
    http.ListenAndServe(":8000", handler)
}

func printStatus(w http.ResponseWriter, r *http.Request) {
    
        response := "{'response':'200'}"

        w.Header().Set("Content-Type", "application/json")
        w.Write([]byte(response))
}

func fetchDiscovery(w http.ResponseWriter, r *http.Request) {
    
    keyword := r.URL.Query().Get("keyword")
    source := strings.ToUpper(r.URL.Query().Get("source"))

    if source == "" {
        source = "ALL"
    }

    response, err := http.Get("https://discovery.nationalarchives.gov.uk/API/search/records?sps.heldByCode="+source+"&sps.searchQuery="+keyword)

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

func getEntities(w http.ResponseWriter, r *http.Request) {
    
    keyword := r.URL.Query().Get("keyword")
    page := strings.ToUpper(r.URL.Query().Get("page"))
    off, err := strconv.Atoi(page)
    off = max(1, off)
    o := strconv.Itoa((off-1)*10)
    sparql := url.Values{
        "query": {"prefix tanc: <http://tanc.manchester.ac.uk/> SELECT DISTINCT ?o (count(?text) as ?count) WHERE { ?s <http://tanc.manchester.ac.uk/text> ?text. ?s tanc:mentions ?o FILTER (regex(str(?o), '"+keyword+"', 'i'))} GROUP BY ?o ORDER BY DESC(?count) LIMIT 10 OFFSET " + o},
        "format": {"json"},
    }

    response, err := http.PostForm("http://cgdc-observatory.net/bigdata/namespace/undefined/sparql", sparql)

    if err != nil {
        fmt.Print(err.Error())
        os.Exit(1)
    }
    responseData, err := ioutil.ReadAll(response.Body)

    sparql2 := url.Values{
        "query": {"prefix tanc: <http://tanc.manchester.ac.uk/> SELECT (count(*) as ?count) WHERE {SELECT DISTINCT ?o (count(?text) as ?count) WHERE { ?s <http://tanc.manchester.ac.uk/text> ?text. ?s tanc:mentions ?o FILTER (regex(str(?o), '" + keyword + "', 'i'))} GROUP BY ?o ORDER BY DESC(?count)}"},
        "format": {"json"},
    }

    response2, err := http.PostForm("http://cgdc-observatory.net/bigdata/namespace/undefined/sparql", sparql2)

    if err != nil {
        fmt.Print(err.Error())
        os.Exit(1)
    }
    responseData2, err := ioutil.ReadAll(response2.Body)
    
    out := map[string]interface{}{}
    json.Unmarshal([]byte(responseData), &out)

    out2 := map[string]interface{}{}
    json.Unmarshal([]byte(responseData2), &out2)

    out["count"] = out2

    outputJSON, _ := json.Marshal(out)

    if err != nil {
        log.Fatal(err)
    }
        w.Header().Set("Content-Type", "application/json")
        w.Write([]byte(outputJSON))
}

func getEntity(w http.ResponseWriter, r *http.Request) {

    vars := mux.Vars(r)
    entity := vars["entity"]
    
    page := strings.ToUpper(r.URL.Query().Get("page"))
    off, err := strconv.Atoi(page)
    off = max(1, off)
    o := strconv.Itoa((off-1)*10)
    sparql := url.Values{
        "query": {"SELECT DISTINCT ?text (group_concat(?mentioned;separator=' ') as ?m)  WHERE { ?s <http://tanc.manchester.ac.uk/mentions> ?mentioned. ?s <http://tanc.manchester.ac.uk/text> ?text. ?s <http://tanc.manchester.ac.uk/mentions> <https://en.wikipedia.org/wiki/" + entity + ">.} GROUP BY ?text ORDER BY ?text LIMIT 10 OFFSET " + o},
        "format": {"json"},
    }

    response, err := http.PostForm("http://cgdc-observatory.net/bigdata/namespace/undefined/sparql", sparql)

    if err != nil {
        fmt.Print(err.Error())
        os.Exit(1)
    }
    responseData, err := ioutil.ReadAll(response.Body)

    sparql2 := url.Values{
        "query": {"SELECT (count(?o) as ?count) WHERE { ?s <http://tanc.manchester.ac.uk/text> ?o. ?s <http://tanc.manchester.ac.uk/mentions> <https://en.wikipedia.org/wiki/" + entity + ">.}"},
        "format": {"json"},
    }

    response2, err := http.PostForm("http://cgdc-observatory.net/bigdata/namespace/undefined/sparql", sparql2)

    if err != nil {
        fmt.Print(err.Error())
        os.Exit(1)
    }
    responseData2, err := ioutil.ReadAll(response2.Body)
    
    out := map[string]interface{}{}
    json.Unmarshal([]byte(responseData), &out)

    out2 := map[string]interface{}{}
    json.Unmarshal([]byte(responseData2), &out2)

    out["count"] = out2

    outputJSON, _ := json.Marshal(out)

    if err != nil {
        log.Fatal(err)
    }
        w.Header().Set("Content-Type", "application/json")
        w.Write([]byte(outputJSON))
}

func max(a, b int) int {
    if a > b {
        return a
    }
    return b
}