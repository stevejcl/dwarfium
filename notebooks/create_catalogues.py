import sys
import os 
from pathlib import Path
import pandas as pd
import json
import numpy as np

project_path = Path(os.path.dirname(os.path.realpath("__file__"))).parent

from scripts.utils import log_df

from scripts.catalog_utils import (
format_ngc_catalog,
format_best_500_catalog,
format_best_500_catalog_M, 
merge_type_constellation, 
catalog_columns,
decToHMS,
convert_to_hh_mm_ss,
convert_to_hh_mm_ss_d
)

mike_draft_path = project_path/'data'/'draft'/'mike_catalog_draft.csv'

best_500dso_path_draft = project_path/'data'/'draft'/'Best_500_Deep_Sky_Objects-draft.csv'
# final best_500dso file
best_500dso_path = project_path/'data'/'draft'/'Best_500_Deep_Sky_Objects-util.csv'

# tmp file for control
# temp best_500dso files
best_500dso_path_tmp = project_path/'data'/'draft'/'Best_500_Deep_Sky_Objects-tmp.csv'
best_500dso_path_merge = project_path/'data'/'draft'/'Best_500_Deep_Sky_Objects-merge.csv'

# openngc file
openngc_path = project_path / 'raw_data' / 'OpenNGC.csv'

# temp openngc files
ngc_draft_path_tmp1 = project_path/'data'/'draft'/'openngc_catalog_draft_tmp1.csv'
ngc_draft_path_tmp2 = project_path/'data'/'draft'/'openngc_catalog_draft_tmp2.csv'

# final ngc_draft file
ngc_draft_path = project_path/'data'/'draft'/'openngc_catalog_draft.csv'


# type files
best_500dso_type_path = project_path/'raw_data'/'Best_500_types.csv'
openngc_types_path = project_path / 'raw_data' / 'OpenNGC_types.csv' 
constellation_path = project_path/'raw_data'/'constellations.csv'

# others files
constellation_path = project_path/'raw_data'/'constellations.csv'
solar_system_path = project_path/'raw_data'/'moon_planets.csv'
hyg_path = project_path / 'raw_data' / 'HYG-Database' / 'hyg' / 'v3' / 'hyg_v35.csv' 

# solar_system files
solar_system_catalog_path = project_path/'data'/'catalogs'/'moon_planets.csv'
solar_system_catalog_json_path = project_path/'data'/'catalogs'/'moon_planets.json'

# final dso_catalog file
dso_catalog_path = project_path/'data'/'catalogs'/'openngc_dso.csv'
dso_catalog_json_path = project_path/'data'/'catalogs'/'dso_catalog.json'
stars_catalog_path = project_path/'data'/'catalogs'/'hyg_stars.csv'

demo_path = project_path/'data'/'draft'/'demo_catalog.json'

openngc_columns = [
    'Name', 'Type', 'RA', 'Dec', 'Const', 'MajAx', 'MinAx', 'V-Mag', 
    'M', 'NGC', 'IC',  'Common names'
]
mike_columns = [
    'Catalog', 
    'Name', 'Name (no leading zero)', 'Name (final)', 'Common Name', 'NGC/ID', 
    "Width (')", "Height (')", 'Mag', 'Type', 'RA', 'Dec'
]

best500_columns = [
    'CONST.', 'TYPE', 'NGC DESIGNATION', 'OTHER NAME(S)', 'R.A.', 'DEC.', 'MAG', 'MAX SZ', 'MIN SZ'
]

best500_columns_modif = [
    'CONST.', 'Types_OpenNGC', 'NGC DESIGNATION', 'OTHER NAME(S)', 'Name normalized', 'R.A.','DEC.','MAG','MAX SZ','MIN SZ','Name catalog','Name number','Best_500'
]
hyg_columns = [
    'hip',  'hd', 'hr', 
    'proper', 'ra', 'dec', 'mag', 'con'
]

## Format best_500dso to file compatible with mergin with ngc data

best500_df = pd.read_csv(best_500dso_path_draft, usecols=best500_columns)
best500_df = format_best_500_catalog(best500_df)

# tmp file for control
#best500_df.to_csv(best_500dso_path_tmp, index=False)

# Extract non-duplicate values of the column
types_Best500 = best500_df['TYPE'].drop_duplicates()
# Convert non-duplicate values to a DataFrame
types_Best500_df = pd.DataFrame(types_Best500, columns=['TYPE'])

# Save  best_500dso TYPE to a CSV file
types_Best500_df.to_csv(best_500dso_type_path, index=False)

best500_2_df = format_best_500_catalog_M(best500_df)
best500_2_df.to_csv(best_500dso_path, index=False)


## Create DSO Draft Catalog 

ngc_df = pd.read_csv(openngc_path, usecols=openngc_columns, dtype={'M': pd.Int64Dtype()})
ngc_df = ngc_df[ngc_df['Type'] != 'Dup']
ngc_df.loc[ngc_df['M'] == 65, 'Common names'] = 'Leo Triplet'

log_df(ngc_df)

df = format_ngc_catalog(ngc_df)

log_df(ngc_df)
# (13340, 18)

df[df['Name']=='IC0359A'][['Name', 'M',  'Name catalog', 'Name number (with zeros)', 'Name number']]

df[df['Name']=='IC4715'][['Name', 'M',  'Name catalog','Name number (with zeros)', 'Name number']]

#mike_file is file containing the large DSO
#mike file has bee restored and updated

draft_df = pd.read_csv(mike_draft_path, dtype={'Name number': pd.Int64Dtype()})

merge_df = df.merge(draft_df,
                    left_on='Name normalized', right_on='Name normalized',
                    how='outer' , suffixes=[None, '_MIKE'])


merge_df['Name number'] = merge_df['Name number'].astype(pd.Int64Dtype())
log_df(merge_df)
# tmp file for control
#merge_df.to_csv(ngc_draft_path_tmp1, index=False)

merge_df[merge_df['Name']=='IC4715'][['Name', 'Name number']]

# best500 is file containing the bedt 500 DSO

best500_df = pd.read_csv(best_500dso_path, usecols=best500_columns_modif)
best500_df.rename(columns={'MAG': 'MAG_500'}, inplace=True)

merge2_df = merge_df.merge(best500_df,
                    left_on='Name normalized', right_on='Name normalized',
                    how='outer' , suffixes=[None, '_500'])

merge2_df['Name number'] = merge2_df['Name number'].astype(pd.Int64Dtype())

log_df(merge2_df)
# tmp file for control
#merge2_df.to_csv(best_500dso_path_merge, index=False)

filter_df = merge2_df.copy()

size_limit = 15
mag_limit = 10

size_bool = (filter_df['MajAx'] >= size_limit) | (filter_df['MinAx'] >= size_limit)

size_b500 = (filter_df['MAX SZ'] >= size_limit) | (filter_df['MIN SZ'] >= size_limit)

# filter_df = filter_df[size_bool]
filter_df = filter_df[(size_bool) | (filter_df['mike'] == True) | (size_b500)]

filter_df = filter_df[(filter_df['V-Mag'] <= mag_limit) | (filter_df['MAG_500'] <= str(mag_limit)) | filter_df['V-Mag'].isna() | filter_df['MAG_500'].isna()]
# filter_df = filter_df[filter_df['V-Mag'] <= mag_limit]
filter_df['Notes'] = 'large_dso'

filter_df = filter_df[(filter_df['Type'] != '**')]
filter_df = filter_df[(filter_df['Type'] != '*')]


log_df(filter_df)

filter2_df = merge2_df.copy()

size_limit = 1
mag_limit = 10

size2_bool = (filter2_df['MajAx'] > size_limit) | (filter2_df['MinAx'] > size_limit)

size2_b500 = (filter_df['MAX SZ'] >= size_limit) | (filter_df['MIN SZ'] >= size_limit)

filter2_df = filter2_df[((size2_bool) | (size2_b500)) & (filter2_df['mike'].isna())]
filter2_df = filter2_df[(filter2_df['V-Mag'] <= mag_limit) | (filter2_df['MAG_500'] <= str(mag_limit))]

filter2_df['Notes'] = 'small_dso'
 
log_df(filter2_df)

filter3_df = merge2_df.copy()

size_limit = 0.5
mag_limit = 12

size3_bool = (filter3_df['MajAx'] > size_limit) | (filter3_df['MinAx'] > size_limit)
size3_b500 = (filter3_df['MAX SZ'] >= size_limit) | (filter3_df['MIN SZ'] >= size_limit)

filter3_df = filter3_df[((size3_bool) | (size3_b500)) & (filter3_df['mike'].isna())]
filter3_df = filter3_df[filter3_df['Common names'].notna() | filter3_df['OTHER NAME(S)'].notna()]
filter3_df = filter3_df[(filter3_df['V-Mag'] <= mag_limit) | (filter3_df['MAG_500'] <= str(mag_limit))]

filter3_df['Notes'] = 'tiny_dso'
 
log_df(filter3_df)


combine1_df = pd.concat([filter_df, filter2_df])
combine_df = pd.concat([combine1_df, filter3_df])

cols = [col for col in combine_df.columns if col != 'Notes']
combine_df.drop_duplicates(inplace=True, subset=cols, keep='first')

log_df(combine_df)

# Apply the function to extract the number from the 'Name' column
combine_df['No Old Value'] = (combine_df['Name'].isna()) & (combine_df['Best_500'] == True)

# tmp file for control
#combine_df.to_csv(ngc_draft_path_tmp2, index=False)

# add only data form Best_500
combine_df['Type'] = combine_df.apply(lambda row:row['Types_OpenNGC']  if (row['No Old Value']) else row['Type'], axis=1)
combine_df['RA'] = combine_df.apply(lambda row:convert_to_hh_mm_ss(row['R.A.'])  if (row['No Old Value']) else row['RA'], axis=1)
combine_df['Dec'] = combine_df.apply(lambda row:convert_to_hh_mm_ss_d(row['DEC.'])  if (row['No Old Value']) else row['Dec'], axis=1)
combine_df['Const'] = combine_df.apply(lambda row:row['CONST.']  if (row['No Old Value']) else row['Const'], axis=1)
combine_df['MajAx'] = combine_df.apply(lambda row:row['MAX SZ']  if (row['No Old Value']) else row['MajAx'], axis=1)
combine_df['MinAx'] = combine_df.apply(lambda row:row['MIN SZ']  if (row['No Old Value']) else row['MinAx'], axis=1)
combine_df['V-Mag'] = combine_df.apply(lambda row:row['MAG_500']  if (row['No Old Value']) else row['V-Mag'], axis=1)
combine_df['NGC'] = combine_df.apply(lambda row:row['NGC DESIGNATION']  if (row['No Old Value']) else row['NGC'], axis=1)
combine_df['Common names'] = combine_df.apply(lambda row:row['OTHER NAME(S)']  if (row['No Old Value']) else row['Common names'], axis=1)
combine_df['Name catalog'] = combine_df.apply(lambda row:row['Name catalog_500']  if (row['No Old Value']) else row['Name catalog'], axis=1)
combine_df['Name number'] = combine_df.apply(lambda row:row['Name number_500']  if (row['No Old Value']) else row['Name number'], axis=1)
combine_df['Name'] = combine_df.apply(lambda row:row['Name normalized']  if (row['No Old Value']) else row['Name'], axis=1)

combine_df.drop(columns=['No Old Value'], inplace=True)

log_df(combine_df)

combine_df.to_csv(ngc_draft_path, index=False)

## Create DSO  Catalog

draft_df = pd.read_csv(ngc_draft_path, dtype={'Name number': pd.Int64Dtype()})
log_df(draft_df)

draft_df.columns

	  
tmp_df =  draft_df.copy()
tmp_df.dropna(subset=['Name'], inplace=True)

for index, row in tmp_df.iterrows():
    # create string with multiple names
    names = set([row['Name normalized'],
                 row['IC name'], row['M name'],
                 row['Name (no leading zero)'], row['IC name_MIKE'], row['NGC name']])
    names.remove(row['Name normalized'])
    names = [name for name in names if pd.notna(name)]
    names.sort()
    tmp_df.at[index, 'Alternate Names'] = ', '.join(names)

    # create string with multiple common names
    common_names = set([row['Common names'], row['Common Name']])
    common_names = [name for name in common_names if pd.notna(name)]
    common_names.sort()
    tmp_df.at[index, 'Common Names'] = ', '.join(common_names)

log_df(tmp_df)

tmp_df = tmp_df[
    [
        'Name normalized', 'Alternate Names', 'Common Names', 
        'Type', 'RA', 'Dec', 'Const', 'MajAx', 'MinAx', 'V-Mag',  
        'Name catalog', 'Name number', "Width (')", "Height (')", 'Notes'
    ]
].copy()

tmp_df.rename(columns={'Name normalized': 'Name'},  inplace=True)

tmp_df = tmp_df.sort_values(['Name catalog', 'Name number'])

log_df(tmp_df)
# (236, 15)

## delete rows with duplicate names

dups = tmp_df[tmp_df.duplicated(subset=['Name'])]['Name'].values

dup_df = tmp_df[tmp_df['Name'].isin(dups)][['Name','Alternate Names', 'Common Names', 'Type']]
dup_df

ngc_catalog_df = tmp_df.copy()

def get_index_by_name(name):
    try:
        return dup_df[dup_df['Name'] == name].index[0]
    except:
        print(name, 'not found')
 

def get_index_by_common_name(name):
    try:
        return dup_df[dup_df['Common Names'] == name].index[0]
    except:
        print(name, 'not found..')
 
names = [
    'Coalsack Nebula',
    'Flaming Star Nebula, Flaming Star nebula', 
    'omi Vel Cluster',
    'Southern Pleiades, tet Car Cluster',
    'Small Sgr Star Cloud',
    'Eagle Nebula, Eagle nebula',
    'M  25',
    'M  67',
    'Filamentary nebula, Veil Nebula,Filamentary Nebula,Western Veil',
    'Eastern Veil,Network Nebula, Network nebula'
]
indexes = [get_index_by_common_name(name) for name in names]

ngc_catalog_df.drop(indexes, inplace=True)

ngc_catalog_df.at[get_index_by_name('IC 2602'), 'Common Names'] = 'Theta Car Cluster, Southern Pleiades'

log_df(ngc_catalog_df)
# (228, 15)

ngc_catalog_df[ngc_catalog_df.duplicated(subset=['Name'])]['Name'].values

merge_df = merge_type_constellation(ngc_catalog_df, openngc_types_path, constellation_path)

log_df(merge_df)

merge_df.to_csv(dso_catalog_path, index=False)

## create HYG stars catalogue

types = {'hip': pd.Int64Dtype(), 'hd': pd.Int64Dtype(), 'hr': pd.Int64Dtype()}
df = pd.read_csv(hyg_path, dtype=types, usecols=hyg_columns)
log_df(df)

cons_df = pd.read_csv(constellation_path, usecols=['Abbreviations IAU', 'name'])
cons_df.rename(columns={'name': 'Constellation'}, inplace=True)
log_df(cons_df)

# Make a copy of the DataFrame
df_copy = df.copy()

# Filter out rows where 'proper' is not NaN and 'mag' is less than or equal to 2.1
brightest_stars_df = df_copy[df_copy['proper'].notna() & (df_copy['mag'] <= 2.1)]

# Get the list of constellations that are represented in the filtered DataFrame
represented_constellations = brightest_stars_df['con'].unique()

# Get the list of constellations in the original DataFrame
all_constellations = df_copy['con'].unique()

# Find constellations that are not represented in the filtered DataFrame
missing_constellations = set(all_constellations) - set(represented_constellations)

# For each missing constellation, include the brightest star from that constellation
for constellation in missing_constellations:
    brightest_star = df_copy[df_copy['con'] == constellation].nsmallest(1, 'mag')
    brightest_stars_df = pd.concat([brightest_stars_df, brightest_star])

# Now brightest_stars_df contains the brightest stars for each constellation
filter_df = brightest_stars_df.copy()

filter_df.drop([0], inplace=True)

filter_df.sort_values(by=['mag'], inplace=True)

filter_df.reset_index(inplace=True)
#filter_df.drop(list(range(50,61)), inplace=True)
del filter_df['index']

log_df(filter_df)

merge_df = filter_df.merge(cons_df, left_on='con', right_on='Abbreviations IAU')

log_df(merge_df)

cat_df = merge_df.copy()
cat_df['Catalogue Entry'] = 'HIP ' + cat_df['hip'].astype(str)
cat_df['Name catalog'] = 'HIP'
cat_df['Alternative Entries'] = ('HD ' + cat_df['hd'].astype(str) + ', HR ' + cat_df['hr'].astype(str))

cat_df['ra'] = cat_df['ra'].apply(decToHMS)
cat_df['dec'] = cat_df['dec'].apply(lambda row: decToHMS(row, True))

cat_df.rename(columns={
    'proper': 'Familiar Name',
    'ra': 'Right Ascension',
    'dec': 'Declination',
    'hip': 'Name number',
    'mag': 'Magnitude'
}, inplace=True)


cat_df['Major Axis'] = pd.NA
cat_df['Minor Axis'] = pd.NA
cat_df['Surface Brightness'] = pd.NA
cat_df["Width (')"] = pd.NA
cat_df["Height (')"] = pd.NA
cat_df['Surface Brightness'] = pd.NA
cat_df['Type'] = 'Star'
cat_df['Type Category'] = 'stars'
cat_df['Notes'] = 'bright_named_stars'

cat_df = cat_df[catalog_columns]

log_df(cat_df)

cat_df.to_csv(stars_catalog_path, index=False)

## create solar system catalogue

df = pd.read_csv(solar_system_path)

log_df(df)

cat_df = df.copy()


cat_df.rename(columns={
    'Name': 'Catalogue Entry',
    'Apparent magnitude (V)': 'Magnitude', 
    'catalog': 'Name catalog',
    'order': 'Name number',
    'type': 'Type',
    'category': 'Type Category'
}, inplace=True)

cat_df['Alternative Entries'] = pd.NA
cat_df['Familiar Name'] = pd.NA
cat_df['Right Ascension'] = pd.NA
cat_df['Declination'] = pd.NA
cat_df['Major Axis'] = pd.NA
cat_df['Minor Axis'] = pd.NA
cat_df['Constellation'] = pd.NA
cat_df["Width (')"] = pd.NA
cat_df["Height (')"] = pd.NA
cat_df['notes'] = pd.NA
cat_df = cat_df[catalog_columns]

log_df(cat_df)

cat_df.to_csv(solar_system_catalog_path, index=False)

cat_df.to_json(solar_system_catalog_json_path, orient='records', indent=2)

## create DSO catalogue

dso_df = pd.read_csv(dso_catalog_path)
log_df(dso_df)

stars_df = pd.read_csv(stars_catalog_path)
log_df(stars_df)

dso_df.columns == stars_df.columns

combine_df = pd.concat([dso_df, stars_df])
combine_df.drop_duplicates(inplace=True)
log_df(combine_df)

combine_df.sort_values(by=['Name catalog', 'Name number'], inplace=True)

combine_df.to_json(dso_catalog_json_path, orient='records', indent=2)

## create messier catalog

dso_df = pd.read_csv(dso_catalog_path, dtype={'Name number': pd.Int64Dtype()})
log_df(dso_df)

df = dso_df.copy()
df = df[(df['Name catalog']=='M') & (df['Familiar Name'].notna()) & (df['Major Axis'] < 17)]
log_df(df)

df.to_json(demo_path, orient='records', indent=2)

## QA catalog

df = pd.read_json(dso_catalog_json_path, orient='records')
log_df(df)

df.groupby(['Type']).size()

large_sizes = ((df["Width (')"] >= 15) | (df["Height (')"] >= 15) | 
               (df['Major Axis'] >= 15) | (df['Minor Axis'] >= 15) )

small_sizes = ((((df["Width (')"] < 15) & (df["Width (')"] > 1)) | ((df["Height (')"] < 15) & (df["Height (')"] > 1))) | 
               (((df['Major Axis'] < 15) & (df['Major Axis'] > 1)) | ((df['Minor Axis'] < 15) & (df['Minor Axis'] > 1))))

tiny_sizes = (((df["Width (')"] < 1) & (df["Height (')"] < 1)) | 
               ((df['Major Axis'] < 1) & (df['Minor Axis'] < 1)) )

# bright and  large
df[(df['Magnitude'] <= 10) & large_sizes].shape

# unknown Magnitude and large
df[df['Magnitude'].isna() & large_sizes].shape

# bright and small
df[small_sizes].shape

# bright and  tiny
df[tiny_sizes].shape

df[(df['Notes'] == 'tiny_dso')].shape

df[(df['Notes'] == 'small_dso')].shape

df[(df['Notes'] == 'large_dso')].shape

df[(df['Type'] == 'Star') ].shape
