# load the necessary libraries
from wikidataintegrator import wdi_core, wdi_login
import pandas as pd
import pprint

# login to wikibase
logincreds = wdi_login.WDLogin(user="admin", pwd="change-this-password", mediawiki_api_url="http://localhost:80/w/api.php")
#Item:
mydata = pd.read_csv("mydata2.csv")
#mydata = 
item_statements = []
current_title=""
for index, row in mydata.iterrows():
    if index==0: #if we've just started, start building from nothing
        current_title=row[0]
        for i in range (1, len(row)):
            if type(row[i])==str:
                item_statements.append(wdi_core.WDUrl(row[i], prop_nr="P3"))
    elif pd.isna(row[0]):
        for i in range (1, len(row)):
            if type(row[i])==str:
                item_statements.append(wdi_core.WDUrl(row[i], prop_nr="P3"))
    else: #if there is a new subject
        #first, write the current data
        wbPage = wdi_core.WDItemEngine(data=item_statements, mediawiki_api_url="http://localhost:80/w/api.php")
        wbPage.set_label(current_title, lang="en")
        pprint.pprint(wbPage.get_wd_json_representation())
        wbPage.write(logincreds) 
        #then, start rebuilding
        current_title=row[0]
        item_statements = []
        for i in range (1, len(row)):
            if type(row[i])==str:
                item_statements.append(wdi_core.WDUrl(row[i], prop_nr="P3"))
