import * as Plot from "../../_npm/@observablehq/plot@0.6.16/b46f1bd2.js";
import deck from "../../_npm/deck.gl@9.0.38/dist.min.js.130a87fe.js";
const {AmbientLight, LightingEffect, PointLight } = deck;
import {csvFormat} from "../../_node/d3-dsv@3.0.1/index.48418e2e.js";
import {csv} from "../../_node/d3-fetch@3.0.1/index.202d0ad8.js";
import {utcParse} from "../../_node/d3-time-format@4.1.0/index.f32a4c93.js";

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
