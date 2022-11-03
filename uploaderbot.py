# load the necessary libraries
from tokenize import String
from wikidataintegrator import wdi_core, wdi_login
import pandas as pd
import pprint

# login to wikibase
logincreds = wdi_login.WDLogin(user="admin", pwd="change-this-password", mediawiki_api_url="http://localhost:80/w/api.php")

# load excel table to load into Wikibase
#mydata = pd.read_excel("mydata.xlsx")
mydata = pd.read_csv("mydata2.csv")
for index, row in mydata.iterrows():
    item_statements = [] # all statements for one item
    print("dave")
    print("index")
    print(row)
    print("not index")
    #for item in row:
    for i in range(1, len(row)):
        item = row[i]
        #if item != None:
        if type(item)==str:
            #print(type(item))
            #print(item)
            item_statements.append(wdi_core.WDUrl(item, prop_nr="P3"))
            #item_statements.append(set_label(item, lang="en"))
            #wbPage.set_description(item, lang="en")
    print("dave")
    ## Prepare the statements to be added
    #item_statements = [] # all statements for one item
    #item_statements.append(wdi_core.WDString("column1111_value", prop_nr="P1")) 
    #item_statements.append(wdi_core.WDItemID("Q42", prop_nr="P2"))
    #item_statements.append(wdi_core.WDUrl("http://www.hhha.com", prop_nr="P3"))

    ## instantiate the Wikibase page, add statements, labels and descriptions
    wbPage = wdi_core.WDItemEngine(data=item_statements, mediawiki_api_url="http://localhost:80/w/api.php")
    wbPage.set_label(row[0], lang="en")
    #wbPage.set_label("label", lang="en")
    #wbPage.set_label("naam", lang="nl")
    #wbPage.set_label("nom", lang="fr")
    #wbPage.set_description("description", lang="en")
    #wbPage.set_description("beschrijving", lang="nl")
    #wbPage.set_description("description", lang="fr")

    ## sanity check (debug)
    pprint.pprint(wbPage.get_wd_json_representation())

    ## write data to wikibase
    wbPage.write(logincreds)
