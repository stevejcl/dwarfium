import pandas as pd
import re
import numpy as np

from datetime import datetime, timedelta

catalog_columns = ['Catalogue Entry', 'Alternative Entries', 'Familiar Name',
       'Right Ascension', 'Declination', 'Major Axis', 'Minor Axis',
       'Magnitude', 'Name catalog', 'Name number',
       'Type', 'Type Category', 'Constellation', "Width (')", "Height (')", 'Notes']

def format_ngc_catalog(original_df):
    df = original_df.copy()

    # get catalog and number
    df[['Name catalog','Name number (with zeros)' ]] = df['Name'].str.strip().str.extract('^([A-Za-z]+)([0-9 A-Z]+)', expand=True)
    df['Name normalized'] = df['Name number (with zeros)'].str.extract('^0*([0-9 A-Z]+)')

    # handle IC and Messier objects
    df.loc[df['Name catalog'] == 'IC',  'IC name'] = 'IC ' + df['Name normalized']
    df.loc[df['Name catalog'] == 'M',  'M name'] = 'M ' + df['Name normalized']

    df['Name normalized'] = df['Name catalog'] + ' ' + df['Name normalized']

    df['Name number'] = df['Name number (with zeros)'].str.extract('([0-9]+)')
    df['Name number'] = df['Name number'].astype(int)

    # If object is a Messier object, use Messier data as the name
    df.loc[df['M'].notna(), 'Name normalized'] = 'M ' + df['M'].astype(str)
    df.loc[df['M'].notna(),  'Name catalog'] = 'M'
    df.loc[df['M'].notna(),  'Name number'] = df['M'].dropna().astype(int)

    return df

def format_best_500_catalog(original_df):
    df = original_df.copy()

    # get catalog and number
    df[['Name catalog','Name number (with zeros)' ]] = df['NGC DESIGNATION'].str.strip().str.extract('^([A-Za-z]+)([0-9 A-Z]+)', expand=True)

    # If 'Name catalog' is null (i.e., the 'Name' column contains only numeric values), set it to 'NGC'

    df['Name normalized'] = df['Name number (with zeros)'].str.extract('^0*([0-9 A-Z]+)')

    # handle IC and Messier objects
    df.loc[df['Name catalog'] == 'IC',  'IC name'] = 'IC ' + df['Name normalized']
    df.loc[df['Name catalog'] == 'M',  'M name'] = 'M ' + df['Name normalized']

    df['Name normalized'] = df['Name catalog'] + ' ' + df['Name normalized']

    df['Name number'] = df['Name number (with zeros)'].str.extract('([0-9]+)')
    #df['Name number'] = df['Name number'].astype(int)

    # If object is a Messier object, use Messier data as the name
    #df.loc[df['M'].notna(), 'Name normalized'] = 'M ' + df['M'].astype(str)
    #df.loc[df['M'].notna(),  'Name catalog'] = 'M'
    #df.loc[df['M'].notna(),  'Name number'] = df['M']

    # Replace Type
    def convert_value(original_value):
      new_value = "Other"
      if (original_value == "*'S"):
        new_value = "*Ass"
      if (original_value == "OC"):
        new_value = "OCl"
      if (original_value == "GC"):
        new_value = "GCl"
      if (original_value == "CL+N"):
        new_value = "Cl+N"
      if (original_value == "N+CL"):
        new_value = "Cl+N"
      if (original_value == "BN+OC"):
        new_value = "Cl+N"
      if (original_value == "GAL"):
        new_value = "G"
      if (original_value == "PN"):
        new_value = "PN"
      if (original_value == "DN"):
        new_value = "DrkN"
      if (original_value == "BN"):
        new_value = "Neb"
      if (original_value == "SNR"):
        new_value = "SNR"

      return new_value

    # Apply the conversion function to create the new column
    df['Types_OpenNGC'] = df['TYPE'].apply(convert_value)

    return df

def format_best_500_catalog_M(original_df):

  # Define a function to extract the number from the string
  def extract_number(s):
    # Extract the number using a regular expression
    match = re.search(r'^M(\d+)', s)
    if match:
        return match.group(1)
    else:
        return None

  df = original_df.copy()

  # Convert 'Name' column to string type
  df['OTHER NAME(S)'] = df['OTHER NAME(S)'].astype(str)

  # Apply the function to extract the number from the 'Name' column
  df['Test M'] = df['OTHER NAME(S)'].apply(extract_number)

  # Update 'Name Catalog', 'Name Normalized', and 'Name M' columns based on the extracted number
  df['Name catalog'] = df.apply(lambda row: f"M"  if row['Test M'] is not None else row['Name catalog'], axis=1)
  df['Name normalized'] = df.apply(lambda row: f"M {row['Test M']}"  if row['Test M'] is not None else row['Name normalized'], axis=1)
  df['M name'] = df.apply(lambda row: f"M {row['Test M']}"  if row['Test M'] is not None else row['M name'], axis=1)
  df['Name number'] = df.apply(lambda row: f"{row['Test M']}"  if row['Test M'] is not None else row['Name number'], axis=1)
  df['Name number (with zeros)'] = df.apply(lambda row: f"{row['Test M']}"  if row['Test M'] is not None else row['Name number (with zeros)'], axis=1)

  df.drop(columns=['Test M'], inplace=True)
  df['CONST.'] = df['CONST.'].str.lower().str.capitalize()
  df['Best_500'] = True
  return df


def merge_type_constellation(df, types_path, constellation_path):
    type_df = pd.read_csv(types_path)
    type_df.rename(columns={'name': 'Type Name', 'category': 'Type Category'}, inplace=True)

    constellation_pd = pd.read_csv(constellation_path, usecols=['Abbreviations IAU', 'name'])
    constellation_pd.rename(columns={'name': 'Constellation'}, inplace=True)

    merge_df = df.merge(type_df, left_on='Type', right_on='code', how='left')
    del merge_df['Type']

    merge_df = merge_df.merge(constellation_pd, left_on='Const', right_on='Abbreviations IAU', how='left')

    merge_df.rename(columns={
        'Name': 'Catalogue Entry',
        'Alternate Names': 'Alternative Entries',
        'Common Names': 'Familiar Name',
        'RA': 'Right Ascension',
        'Dec': 'Declination',
        'MajAx': 'Major Axis',
        'MinAx': 'Minor Axis',
        'V-Mag': 'Magnitude',
        'Type Name': 'Type'
    }, inplace=True)

    if "Width (')" not in merge_df.columns:
        merge_df["Width (')"] = pd.NA
        merge_df["Height (')"] = pd.NA

    return merge_df[catalog_columns]


def formatDD(number):
    return f'{"{:02.0f}".format(number)}'

def formatDDdotDD(number):
    return f'{"{:05.2f}".format(number)}'

# https://stackoverflow.com/a/32087825
def decToHMS(decHour, include_sign=False):
    """convert 1.2345 to 01:04:04.20"""
    time = abs(decHour)
    seconds = time * 3600
    m, s = divmod(seconds, 60)
    h, m = divmod(m, 60)

    timeStr = f'{formatDD(h)}:{formatDD(m)}:{formatDDdotDD(s)}'

    if(include_sign):
        sign = '+' if decHour >= 0 else '-'
        timeStr = sign + timeStr
    elif decHour < 0:
        timeStr = '-' + timeStr

    return timeStr

def convert_to_hh_mm_ss(time_str):
    time_str = str(time_str)
    try :
        hours, minutes_seconds = time_str.split()
        minutes, seconds = map(float, minutes_seconds.split('.'))
    except ValueError:
        return np.nan
    # Convert hours, minutes, and seconds to integers
    hours = int(hours)
    minutes = int(minutes)
    seconds = int(seconds)
    
    # Convert minutes and seconds to hours if seconds exceed 60
    minutes += seconds // 60
    seconds %= 60
    
    # Convert hours and minutes to hours if minutes exceed 60
    hours += minutes // 60
    minutes %= 60
    
    # Create the formatted time string
    formatted_time = f"{hours:02d}:{minutes:02d}:{seconds:02d}"
    
    return formatted_time

def convert_to_hh_mm_ss_d(time_str):
    time_str = str(time_str)
    try:
        # Split the time string into sign, hours, and minutes
        parts = time_str.split()
        sign = parts[0][0]  # Extract the sign from the first character of the first part
        hours = int(parts[0][1:])  # Extract hours from the remaining characters
        minutes = int(parts[1])  # Extract minutes from the second part
        
        # Create the formatted time string
        formatted_time = f"{sign}{hours:02d}:{minutes:02d}:00.0"
        
        return formatted_time
    except (ValueError, IndexError):
        return np.nan
