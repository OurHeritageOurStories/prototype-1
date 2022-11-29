# prototype-1

Please note, this Readme is in a very "Rough and ready" state, and will be updated at various points

## Install Wikibase

1. Clone the following repo `https://github.com/wmde/wikibase-release-pipeline/tree/6ab3c2aac2bb5dc95c72ebbe8b2231799acbef35`
2. In the "example" directory, rename `template.env` to `.env`
3. In the "example" directory, run `docker-compose -f docker-compose.yml -f docker-compose.extra.yml up -d`
4. After a few minutes (its starting quite a few things), go to `localhost:80` to confirm it has all run sucessfully. 

## Uploaderbot. 

The uploaderbot is basic at the moment, but works. In order to run it:
1. If required, modify the `mydata2.csv` file so that it contains the data you want (Note, as the bot currently works, all data must be a URL. This is a side-effect of the data being based on RDF data). 
2. Ensure that the dockerised wikibase as per the other instructions above is running. 
3. Run the python file. As an example, in VSCode, this is achived by running `python uploaderbot.py` in the directory with both the python file and the data file. 

Notes:
1. The python file and the data csv file must be in the same directory. 
2. If you re-run the script, you will get duplicate items (i.e. same cotent and title, different Q number)
3. The bot works by assuming every new entry in column 1 is a new entitiy (new q number). It will then look at the rest of the row after the new entry in column 1, assuming this is information about this entity. If the subsequent row has an empty cell in column 1, it will assume this row contains further information about the current entitiy, and will continue adding information to the same entity. It will continue this until it encounters a row with an entry in column 1, where it will assume a new entity starts. 


## mydata2.csv

mydata2.csv is a csv representation of the data "ai_lab_2.ttl", available at `https://raw.githubusercontent.com/OurHeritageOurStories/ohos-observatory/main/observatory/src/assets/datasets/ai_lab_2.ttl`. This data was loaded into OpenRefine, where the program was used to conver it into a .csv. 

## Running the search page

1. In the main folder, run `node cors`
2. In the neutrinoapp folder, run `npm start`