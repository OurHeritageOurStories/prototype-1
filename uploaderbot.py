# load the necessary libraries
from tokenize import String
from wikidataintegrator import wdi_core, wdi_login
import pandas as pd
import pprint

# login to wikibase
logincreds = wdi_login.WDLogin(user="admin", pwd="change-this-password", mediawiki_api_url="http://localhost:80/w/api.php")
#Item:
mydata = pd.read_csv("mydata2.csv")
for index, row in mydata.iterrows():
    print("index")
    print(index)
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
    elif row[0]==None: #if there isn't a new subject
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
    
'''    if index!=0:


    
    if index==0:
        for i in range (1, len(row)):
            if type(row[i])==str:
                item_statements.append(wdi_core.WDUrl(item, prop_nr="P3"))
        wbPage = wdi_core.WDItemEngine(data=item_statements, mediawiki_api_url="http://localhost:80/w/api.php")
        wbPage.set_label(row[0], lang="en")
        pprint.pprint(wbPage.get_wd_json_representation())
        wbPage.write(logincreds)
        item_statements=[]
    else:
        

    print("index")
    print(index)
    print("row")
    print(row)
    #for item in row:
    #    print("item")
    #    print(item)
    #    print("item tyep")
    #    print(type(item))
        #for bit in item:
        #    print("bit")
        #    print(bit)

#    if index==0:
#            item_statements = [] # all statements for one item
#            for i in range(1, len(row)):
#                item = row[i]
#                if type(item)==str:
#                    item_statements.append(wdi_core.WDUrl(item, prop_nr="P3"))
#            wbPage = wdi_core.WDItemEngine(data=item_statements, mediawiki_api_url="http://localhost:80/w/api.php")
#            wbPage.set_label(row[0], lang="en")
#            pprint.pprint(wbPage.get_wd_json_representation())
#            wbPage.write(logincreds)
#    else:
#        item_statements = [] # all statements for one item
#        if row[0]==None:
#            print("dave")
#            print("index")
#            print(row)
#            print("not index")
#            #for item in row:
#            for i in range(1, len(row)):
#                item = row[i]
#                #if item != None:
#                if type(item)==str:
#                    #print(type(item))
#                    #print(item)
#                    item_statements.append(wdi_core.WDUrl(item, prop_nr="P3"))
#                    #item_statements.append(set_label(item, lang="en"))
#                    #wbPage.set_description(item, lang="en")
#            print("dave")
#            ## Prepare the statements to be added
#            #item_statements = [] # all statements for one item
#            #item_statements.append(wdi_core.WDString("column1111_value", prop_nr="P1")) 
#            #item_statements.append(wdi_core.WDItemID("Q42", prop_nr="P2"))
#            #item_statements.append(wdi_core.WDUrl("http://www.hhha.com", prop_nr="P3"))
#        else:
#            ## instantiate the Wikibase page, add statements, labels and descriptions
#            wbPage = wdi_core.WDItemEngine(data=item_statements, mediawiki_api_url="http://localhost:80/w/api.php")
#            wbPage.set_label(row[0], lang="en")
#            #wbPage.set_label("label", lang="en")
#            #wbPage.set_label("naam", lang="nl")
#            #wbPage.set_label("nom", lang="fr")
#            #wbPage.set_description("description", lang="en")
#            #wbPage.set_description("beschrijving", lang="nl")
#            #wbPage.set_description("description", lang="fr")#

            ## sanity check (debug)
#            pprint.pprint(wbPage.get_wd_json_representation())

            ## write data to wikibase
#            wbPage.write(logincreds)
#            item_statements = []'''