import pandas as pd
import os

data1 = pd.read_csv("./R3.csv")  # read csv
data2 = pd.read_csv("./R3Imgs.csv", sep=";")  # read images

output = pd.merge(data1, data2, on="OLID", how="outer")

output.drop(
    ["title", "Len", "To", "Pages"],  # drop useless headers
    axis=1, inplace=True, errors='ignore'
)

output.columns = output.columns.str.lower()  # lower case all headings
# reindex
# sr,again,olid,author,book,tags,description,coverid
new_index = {'olid': 'OLID', 'sr': 'index',
             'book': 'name', 'coverid': 'cover'}
output.rename(columns=new_index, inplace=True)
output.to_csv("R3Final.csv", index=False, na_rep="0")
