import * as Plot from "npm:@observablehq/plot";
import deck from "npm:deck.gl";
const {AmbientLight, LightingEffect, PointLight } = deck;
import {csvFormat} from "d3-dsv";
import {csv} from "d3-fetch";
import {utcParse} from "d3-time-format";

const parseDate = utcParse("%m/%d/%Y")

export const sortAscDate = (objArray) => {
  const sortedAsc = objArray.sort(
    (objA, objB) => Number(objA.date) - Number(objB.date),
  )
  return sortedAsc
}

export const sortedAscObjArrayDates = (objArray, key) => {
  return objArray.sort(
    (objA, objB) => Number(parseDate(objA[key])) - Number(parseDate(objB[key])),
  )
}

export const sortedAscListDates = (arr1) => {
  const sortedArray = arr1.sort(
    (dateA, dateB) => Number(parseDate(dateA)) - Number(parseDate(dateB)),
  )
  return sortedArray
}

export const colorRange = [
  [59, 82, 139],
  [33, 145, 140],
  [94, 201, 98],
  [253, 231, 37]
];

export const colorLegend = Plot.plot({
  margin: 0,
  marginTop: 30,
  marginRight: 20,
  width: 450,
  height: 50,
  style: "color: 'currentColor';",
  x: {padding: 0, axis: null},
  marks: [
    Plot.cellX(colorRange, {fill: ([r, g, b]) => `rgb(${r},${g},${b})`, inset: 2}),
    Plot.text(["Fewer jobs"], {frameAnchor: "top-left", dy: -12}),
    Plot.text(["More jobs"], {frameAnchor: "top-right", dy: -12})
  ]
});

export const lightingEffects = [
  new LightingEffect({
    ambientLight: new AmbientLight({color: [255, 255, 255], intensity: 1}),
    pointLight: new PointLight({color: [255, 255, 255], intensity: 0.8, position: [-0.144528, 49.739968, 80000]}),
    pointLight2: new PointLight({color: [255, 255, 255], intensity: 0.8, position: [-3.807751, 54.104682, 8000]})
  })
]

export const removeNulls = (object) => {

  if (object.DateAdded != null || object.DateAdded != "" || object.DateAdded != "Unavailable" || object.AY != "2012-2013") { return object }

}

export const onlyUniqueItems = (value, index, array) => {
  return array.indexOf(value) === index;
}

export const getTooltip = ({object}) => {
  if (!object) return null;
  const [lng, lat] = object.position;
  const count = object.points.length;
  
  // Create content with points
  let points = object.points
  let city = ''
  let cityContent = ''
  let uniContent = ''
  let trackTypeContent = ''
  let listCities = []
  let listUnis = []
  let trackTypes = {}
  let TT = 0
  let NTT = 0
  let NATT = 0
  let contentObj = {}

  points.forEach(point => {
    let source = point.source
    city = source.City
    contentObj[city] = {}
    
    listUnis.push(source.Institution)
    // Count TrackTypes
    if (source.TrackType == 'TT') { TT = TT+1 }
    else if (source.TrackType == 'NTT') { NTT = NTT+1 }
    else { NATT = NATT+1 }
  })
  
  let uniqListUnis = listUnis.filter(onlyUniqueItems)
  contentObj[city].TT = TT
  contentObj[city].NTT = NTT
  contentObj[city].NATT = NATT
  contentObj[city].Unis = uniqListUnis

  cityContent = "Total Jobs in "+city+": "+count;
  // Add Unis
  if (uniqListUnis.length == 1) {
    cityContent = cityContent+"\n@"+uniqListUnis[0]
  }
  else if (uniqListUnis.length > 1) {
    for (let i = 0; i <= uniqListUnis.length-1; i++) {
      if (i == 0) { cityContent = cityContent+"\n@"+uniqListUnis[i] }
      else { cityContent = cityContent+"\n@"+uniqListUnis[i] }
    }
  }

  // Add NTT Job Counts
  if (contentObj[city].NTT != 0) {
    cityContent = cityContent+"\nNTT: "+contentObj[city].NTT
  };
  // Add TT Job Counts
  if (contentObj[city].TT != 0) {
    cityContent = cityContent+"\nTT: "+contentObj[city].TT
  };
  // Add N/A Job Counts
  if (contentObj[city].NATT != 0) {
    cityContent = cityContent+"\nN\\A: "+contentObj[city].NATT
  };

  return cityContent;
}

export const getSearchKeyResults = (data, selectedTrackType, selectedAY) => {
  return data.filter((row) => {
    if (row.TrackType.includes(selectedTrackType) && row.AY.includes(selectedAY)) {
      return row
    }
  })
}

export const download = (value, name = "untitled", label = "Save") => {
  const a = document.createElement("a")
  const b = a.appendChild(document.createElement("button"))
  b.textContent = label
  a.download = name

  async function reset() {
    await new Promise(requestAnimationFrame);
    URL.revokeObjectURL(a.href)
    a.removeAttribute("href")
    b.textContent = label
    b.disabled = false
  }

  a.onclick = async (event) => {
    b.disabled = true
    if (a.href) return reset() // Already saved.
    b.textContent = "Saving…"
    try {
      const object = await (typeof value === "function" ? value() : value)
      const blob = new Blob([object], { type: "application/octet-stream" })
      b.textContent = "Download"
      a.href = URL.createObjectURL(blob) // eslint-disable-line require-atomic-updates
      if (event.eventPhase) return reset() // Already downloaded.
      a.click() // Trigger the download
    } catch (error) {
      console.error("Download error:", error)
      b.textContent = label
    }
    b.disabled = false
  }

  return a
}
