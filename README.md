# prototype-1

Please note, this Readme is in a very "Rough and ready" state, and will be updated at various points

## Install

1. Clone the following repo `https://github.com/wmde/wikibase-release-pipeline/tree/6ab3c2aac2bb5dc95c72ebbe8b2231799acbef35`
2. In the "example" directory, rename `template.env` to `.env`
3. In the "example" directory, in `docker-compose.extra.yml`, under wdqs on line 65, add
```   
    ports:
      - "9999:9999"
```
4. In the "example" directory, run `docker-compose -f docker-compose.yml -f docker-compose.extra.yml up -d`
5. After a few minutes (it's starting quite a few things), go to `localhost:80` to confirm it has all run successfully.
6. Go to `http://localhost:9999/bigdata/#update`. Upload `ai_lab_3.ttl` with Turtle-RDR as the format.
7. Go to the "neutrinoapp" directory and run `npm install --legacy-peer-deps`.

## Start
If you haven't already, do step 4 from above.
Then either A: 
  1. Go to the neutrinoapp folder and run `npm start`.
  2. Go to the Go folder and run `go run main.go`.

Or B:
  1. Go to the neutrinoapp folder and run `docker build -t ohos_observatory_frontend .`.
  1. Go to the Go folder and run `docker build -t ohos_go_api .`.
  1. Go to the main folder and run `docker-compose up`.