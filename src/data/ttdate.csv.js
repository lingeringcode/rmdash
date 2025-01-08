import {csvFormat} from "d3-dsv";
import {csv} from "d3-fetch";
import {utcParse} from "d3-time-format";

const parseDate = utcParse("%m/%d/%Y");

async function getData(url) {
  const response = await fetch(url)
  console.log("here")
  if (!response.ok) throw new Error(`fetch error: ${response.status} ${url}`);
  return response
}

/**
  * Github gist: https://gist.githubusercontent.com/lingeringcode/333ea2c5b2afbdda58d115bb2c6962a6/raw/281a1757aee67bcbc4d5b0844296c9d8b11c6cca/combined-jobs.csv
  * Github proper: https://raw.githubusercontent.com/lingeringcode/clndgrn-portfolio/refs/heads/master/static/assets/data/combined-jobs.csv
  * My site URL: https://clndgrn.com/assets/data/combined-jobs.csv
*/

async function load(r) {
  const data = await getData("https://raw.githubusercontent.com/lingeringcode/clndgrn-portfolio/refs/heads/master/static/assets/data/combined-jobs.csv")
  const jobs = []
  for await (const item of data) {
    jobs.push({
      date: parseDate(item.DateAdded), 
      tt: item.TrackType,
      ay: item.AY,
    })
  }
  return jobs
}

process.stdout.write(
  csvFormat(
    await csv("https://raw.githubusercontent.com/lingeringcode/clndgrn-portfolio/refs/heads/master/static/assets/data/combined-jobs.csv")
  )
)
