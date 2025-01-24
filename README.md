# rmdash

Dashboard for Rhetmap.org job data

## Data

- Original Data Source: Jim Ridolfo's <a href="http://rhetmap.org" target="_blank" rel="noreferrer noopenner">Rhetmap.org</a>
- For this project, I manually exported Ridolfo's data into a singular data set (.xslx). <a href="https://docs.google.com/spreadsheets/d/1dTDzfJvlhwAWHQ2HWJpnZxByf0I06fXCV8ciQ8LxSZk/edit?usp=sharing" target="_blank" rel="noreferrer noopenner">Google Sheet version</a> of that data.
- [all-jobs.csv](src/data/all-jobs.csv): CSV format of pre-processed data.
- [lat-lon-references.csv](src/data/lat-lon-references.csv): Geocoded locations included in the data set for cross-referencing.
- [combined-jobs.csv](src/data/combined-jobs.csv): Combined geocode data with job data. Used to construct dashboard.

### Processing

- [1_process.py](src/data/1_process.py): Combines job data with geocodes. I manually ran this file to produce [combined-jobs.csv](src/data/combined-jobs.csv).
- [jobsOG.csv.js](src/data/jobsOG.csv.js): This Observable JS file asynchronously fetches the [combined-jobs.csv]([src/data/combined-jobs.csv](https://raw.githubusercontent.com/lingeringcode/clndgrn-portfolio/refs/heads/master/static/assets/data/combined-jobs.csv)) data hosted on Github.
- [ttdate.csv.js](src/data/ttdate.csv.js): This Observable JS file asynchronously fetches and processes the [combined-jobs.csv]([src/data/combined-jobs.csv](https://raw.githubusercontent.com/lingeringcode/clndgrn-portfolio/refs/heads/master/static/assets/data/combined-jobs.csv)) data hosted on Github. Creates a TrackType only version.
