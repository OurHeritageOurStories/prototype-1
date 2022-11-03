# load the necessary libraries
from wikidataintegrator import wdi_core, wdi_login
import pandas as pd
import pprint

# login to wikibase
logincreds = wdi_login.WDLogin(user="admin", pwd="change-this-password", mediawiki_api_url="http://localhost:80/w/api.php")
#Item:
mydata = pd.read_csv("mydata2.csv")
#mydata = 
for index, row in mydata.iterrows():
    print("index")
    print(index)
    #for item in row:
        #print("item")
        #print(item)
    item_statements = []
    current_title=""
    if index==0: #if we've just started, start building from nothing
        print("First row")
        current_title=row[0]
        for i in range (1, len(row)):
            if type(row[i])==str:
                print("alpha")
                print(row[i])
                item_statements.append(wdi_core.WDUrl(row[i], prop_nr="P3"))
    #elif row[0]=="Nan": #if there isn't a new subject
    #elif row[0].empty:
    #elif row[0]==None:
    elif pd.isna(row[0]):
        print("row number")
        print(index)
        for i in range (1, len(row)):
            if type(row[i])==str:
                print("beta")
                print(row[i])
                item_statements.append(wdi_core.WDUrl(row[i], prop_nr="P3"))
    else: #if there is a new subject
        #first, write the current data
        print("row number")
        print(index)
        for statement in item_statements:
            print("statement")
            print(statement)
        wbPage = wdi_core.WDItemEngine(data=item_statements, mediawiki_api_url="http://localhost:80/w/api.php")
        wbPage.set_label(current_title, lang="en")
        pprint.pprint(wbPage.get_wd_json_representation())
        wbPage.write(logincreds) 
        #then, start rebuilding
        current_title=row[0]
        item_statements = []
        for i in range (1, len(row)):
            if type(row[i])==str:
                print("gamma")
                print(row[i])
                item_statements.append(wdi_core.WDUrl(row[i], prop_nr="P3"))
