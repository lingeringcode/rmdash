import pandas as pd
from datetime import datetime

# Read the CSV
df_og = pd.read_csv("all-jobs.csv")
df_latlon = pd.read_csv("lat-lon-references.csv")

'''
@process_data(jdata, geodata)
'''
def process_data(geodata, jdata):
  '''
  # process_data(geodata, jdata)
  Goal: Combine geo lat-lon info with job data
  1. Isolate rows that match addresses
  2. Add all data into row of new list of dicts
  3. Convert to DF
  4. Return DF
  ## @params
  - geodata: pandas DataFrame, geo data set.
  - jdata: pandas DataFrame, job data set.
  '''
  new_data = []
  for row in geodata.to_dict('records'):
    address_check = row['original_address']
    job_rows = jdata.loc[jdata.Address == address_check]
    
    # Combine matched data
    for job in job_rows.to_dict('records'):

      if (job['DateAdded'] != "Unavailable" and job['DateAdded'] != None and type(job['DateAdded']) != float and job['DateAdded'] != '01/01/1900'):
        datetime_str = job['DateAdded']
        datetime_object = datetime.strptime((datetime_str), '%m/%d/%Y')

        new_row = {
          'AY':job['AY'],
          'Institution':job['Institution'],
          'Position': job['Position'].replace("\n", ""),
          'Address':job['Address'],
          'Link':job['Link'].replace("\n", ""),
          'TrackType':job['TrackType'],
          'DateAdded':job['DateAdded'],
          'DateTimeObj':datetime_object,
          'Latitude':row['lat'],
          'Longitude':row['lon'],
          'FormattedAddress':row['formatted'],
          'City':row['city'],
          'County':row['county'],
          'State':row['state'],
          'StateCode':row['state_code'],
          'Country':row['country'],
          'CountryCode':row['country_code']
        }
        new_data.append(new_row)
      else:
        new_row = {
          'AY':job['AY'],
          'Institution':job['Institution'],
          'Position':job['Position'],
          'Address':job['Address'],
          'Link':job['Link'],
          'TrackType':job['TrackType'],
          'DateAdded':job['DateAdded'],
          'DateTimeObj': datetime.strptime('01/01/1900', '%m/%d/%Y'),
          'Latitude':row['lat'],
          'Longitude':row['lon'],
          'FormattedAddress':row['formatted'],
          'City':row['city'],
          'County':row['county'],
          'State':row['state'],
          'StateCode':row['state_code'],
          'Country':row['country'],
          'CountryCode':row['country_code']
        }
        new_data.append(new_row)
    
  df_new = pd.DataFrame(new_data)
  df_new_sorted = df_new.sort_values(by=['AY','DateTimeObj','Institution','TrackType'])
  return df_new_sorted


df_combine_data = process_data(df_latlon, df_og)
print( df_combine_data.tail().values )
print( df_combine_data.info() )

df_combine_data.to_csv('combined-jobs.csv', index=False)

def create_subset(df, subset_col_1, subset_col_dates):
  '''
  # @create_subset: Create subsets of TrackType data

  # Params
  - df: pandas DataFrame. Data set with all parameters of interest
  - subset_col: String. Column of interest.

  ## Return
  - new_df: pandas DataFrame. New dataframe with following structure per row:
    - date: DateTime Obj of posting date.
    - type: String. Type of track: TT, NTT, Unavailable.
    - posts: Integer. Total sum of posts of that type of job on that specific date.
  '''
  uniq_subset_col_values = df[subset_col_1].unique()
  uniq_subset_col_dates = sorted(df[subset_col_dates].apply(lambda d: datetime.strptime(d,'%m/%d/%Y')).unique())
  list_unique_dates_sorted = []
  for date in uniq_subset_col_dates:
    list_unique_dates_sorted.append(date.strftime("%m/%d/%Y"))

  list_record_rows_per_date = []
  list_record_rows_flat = []
  for date_str in list_unique_dates_sorted:
    if date_str != '01/01/1900':
      date_slice = df.loc[df.DateAdded == date_str]
      list_record_rows_per_date.append({
        'date': date_str,
        'datetimeObj': datetime.strptime(date_str, '%m/%d/%Y'),
        'TT': len(date_slice.loc[date_slice.TrackType == 'TT']),
        'NTT': len(date_slice.loc[date_slice.TrackType == 'NTT']),
        'Unavailable': len(date_slice.loc[date_slice.TrackType == 'Unavailable']),
        'Total': len(date_slice.loc[date_slice.TrackType == 'TT'])+len(date_slice.loc[date_slice.TrackType == 'NTT'])+len(date_slice.loc[date_slice.TrackType == 'Unavailable'])
      })

      for tt in uniq_subset_col_values:
        tt_date_slice = date_slice.loc[date_slice.TrackType == tt]
        list_record_rows_flat.append({
          'date': date_str,
          'datetimeObj': datetime.strptime(date_str, '%m/%d/%Y'),
          'type': tt,
          'posts': len(tt_date_slice)
        })
  df_new_flat = pd.DataFrame(list_record_rows_flat)
  df_new_per_date = pd.DataFrame(list_record_rows_per_date)
  # Add moving averages
  df_new_flat['Overall_EMA'] = df_new_flat['posts'].ewm(span=7).mean()        # Exponential Moving Average
  df_new_per_date['Overall_EMA'] = df_new_per_date['Total'].ewm(span=7).mean()        # Exponential Moving Average
  return {
    'df_new_flat': df_new_flat,
    'df_new_per_date': df_new_per_date,
  }

df__tt_per_date_flat = create_subset(
  df_combine_data,
  subset_col_1='TrackType',
  subset_col_dates='DateAdded'
)

df__tt_per_date_flat['df_new_flat'].to_csv('tt-per-date-flat.csv', index=False)
df__tt_per_date_flat['df_new_per_date'].to_csv('tt-per-date.csv', index=False)
