# rmdash - RhetMap Dashboard

Dashboard for Rhetmap.org job data. Designed to help folx, whether an individually or institutionally, better understand the academic job terrain.

## Data Provenance

- Original Data Source: Jim Ridolfo's <a href="http://rhetmap.org" target="_blank" rel="noreferrer noopenner">Rhetmap.org</a>
- [all-jobs.csv](src/data/all-jobs.csv): CSV format of pre-processed data.
- [lat-lon-references.csv](src/data/lat-lon-references.csv): Geocoded locations included in the data set for cross-referencing.
  - **Note**: Any date listed as `01/01/1900` demarcates any unknown date in the data.
- [combined-jobs.csv](src/data/combined-jobs.csv): Combined geocode data with job data. Used to construct dashboard.
- `npm:us-atlas/counties-10m.json`: County-level shapde data for US. Fetched and cached from NPM.

## Data Processing

- [1_process.py](src/data/1_process.py): Combines job data with geocodes. I manually ran this file to produce [combined-jobs.csv](src/data/combined-jobs.csv).
- [jobsOG.csv.js](src/data/jobsOG.csv.js): This Observable JS file asynchronously fetches the [combined-jobs.csv]([src/data/combined-jobs.csv](https://raw.githubusercontent.com/lingeringcode/clndgrn-portfolio/refs/heads/master/static/assets/data/combined-jobs.csv)) data hosted on Github.
- [ttdate.csv.js](src/data/ttdate.csv.js): This Observable JS file asynchronously fetches and processes the [combined-jobs.csv]([src/data/combined-jobs.csv](https://raw.githubusercontent.com/lingeringcode/clndgrn-portfolio/refs/heads/master/static/assets/data/combined-jobs.csv)) data hosted on Github. Creates a TrackType only version.
