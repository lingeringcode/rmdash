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
          'Position':job['Position'],
          'Address':job['Address'],
          'Link':job['Link'],
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
print(df_combine_data.tail().values)
print(
  df_combine_data.info()
)
df_combine_data.to_csv('combined-jobs.csv', index=False)
