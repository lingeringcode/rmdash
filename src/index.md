# Rhetoric, Composition &amp; TPC Job Dashboard

<p style="font-size:small;">
  Original Data: Jim Ridolfo's <a href="http://rhetmap.org" target="_blank" rel="noreferrer noopenner">Rhetmap.org</a>
  <br/>
  Creator: <a href="https://clndgrn.com" target="_blank" rel="noreferrer noopenner">Chris Lindgren</a>
  <br/>
  Code Repo: <a href="https://github.com/lingeringcode/rmdash" target="_blank" rel="noreferrer noopenner">rmdash</a>
  <br/>
  <strong>Note</strong>: Map currently limited to displaying U.S. only. Full data still includes all available countries.
</p>

<!-- IMPORTS -->
```js
  // Import deck.gl components for interactive map
  import deck from "npm:deck.gl";
  import {LollipopChart} from "./components/lollipopChart.js";
  import {removeNulls, sortedAscListDates, sortedAscObjArrayDates, colorRange, colorLegend, lightingEffects, onlyUniqueItems, getTooltip, download} from "./components/utils.js";
  import {utcParse} from "d3-time-format";

  const {DeckGL, AmbientLight, GeoJsonLayer, TextLayer, HexagonLayer, LightingEffect, PointLight, ScatterplotLayer} = deck;

  const parseDate = utcParse("%m/%d/%Y")
  const formatDecimal = d3.format(".2f")
  const formatPercent = (value, format) => {
    return value == null
      ? "N/A"
      : (value / 100).toLocaleString("en-US", {minimumFractionDigits: 2, style: "percent", ...format});
  }
```

<!-- GET DATA -->
```js
  // County-level shape data for US
  const us = await fetch(import.meta.resolve("npm:us-atlas/counties-10m.json")).then((r) => r.json())

  // State polygons
  const states = topojson.feature(us, us.objects.states)

  // Find state centroids (for text label)
  const stateCentroid = states.features.map(d => ({name: d.properties.name, longitude: d3.geoCentroid(d.geometry)[0], latitude: d3.geoCentroid(d.geometry)[1]}))

  // JOB DATA
  const jobsOG = FileAttachment("data/combined-jobs.csv").csv({typed: true})
  const jobs = FileAttachment("data/tt-per-date.csv").csv({typed: true})
  const tidyCleanSorted = FileAttachment("data/tt-per-date-flat.csv").csv({typed: true})
```

```js
  const defaultStartEnd = [jobs.at(-52).datetimeObj, jobs.at(-1).datetimeObj]
  const startEnd = Mutable(defaultStartEnd)
  const setStartEnd = (se) => startEnd.value = (se ?? defaultStartEnd)
  const getStartEnd = () => startEnd.value
```

```js
const jobsOGSorted = sortedAscObjArrayDates(jobsOG, "DateAdded")
let uniqueAYS = [...new Set(jobsOGSorted.map(post => post.AY))]
let AYLast = uniqueAYS.slice(-1)[0]
```

<!-- Text box with poor condition, high risk summary -->
<p style="font-size: 1.5rem">
  <span style="color: var(--theme-foreground-muted)">Of <span style="color: var(--theme-foreground-alt)">${d3.format(",")(jobsOGSorted.length)} academic jobs</span> included in the RhetMap data set,</span> <span style="color: var(--theme-foreground-alt)">${d3.format(",")(jobsOGSorted.filter(d => d.TrackType == "NTT").length)} are listed as Non-Tenure Track (NTT)</span><span style="color: var(--theme-foreground-muted)">, <span style="color: var(--theme-foreground-alt)">${d3.format(",")(jobsOGSorted.filter(d => d.TrackType == "TT").length)} are Tenure-Track (TT)</span><span style="color: var(--theme-foreground-muted)">, and <span style="color: var(--theme-foreground-alt)">${d3.format(",")(jobsOGSorted.filter(d => d.TrackType == "Unavailable").length)} were unavailable to verify</span>.
</p>

<div class="grid grid-cols-3">
  <div class="card grid-colspan-2" style="padding: 0px;">
    <div style="padding: 1rem;">
      <h2>Rhetoric, Composition &amp; TPC Job Locations</h2>
      <h3>Zoom and scroll, or hold down Shift to rotate.</h3>
      <div>${colorLegend}</div>
    </div>
  <div>
    <figure style="max-width: none; position: relative;">
      <div id="container" style="border-radius: 8px; overflow: hidden; height: 620px; margin: 0rem 0;">
      </div>
    </figure>
  </div>
</div>
  <div class="card grid-colspan-1">
    <h2>Job counts by state or territory</h2>
    <h3>Total jobs listed between the academic years of ${jobsOGSorted.at(0).AY} &amp; ${jobsOGSorted.at(-1).AY}: ${d3.format(",")(jobsOGSorted.length)}</h3>
    ${resize((width, height) => LollipopChart(width, height, jobsOGSorted))}
  </div>
</div>

<!-- Risk bubble chart and year completed histogram -->
<div class="grid grid-cols-2 grid-rows-3" style="grid-auto-rows: 350px">
 <div class="card grid-colspan-3 grid-rowspan-1">
   <h2>Types of Positions Per Academic Year (AY)</h2>
   <h3>Size indicates number of job postings during that academic year</h3>
   ${resize((width, height) => trackTypesGrid(width, height))}
 </div>
</div>

<!-- Create interactive map with deck.gl -->
```js
  const deckInstance = new DeckGL({
    container,
    initialViewState,
    controller: true,
    getTooltip,
    lightingEffects
  });

  // clean up if this code re-runs
  invalidation.then(() => {
    deckInstance.finalize();
    container.innerHTML = "";
  });
```

```js
  const initialViewState = {
    longitude: -100,
    latitude: 36,
    zoom: 4.1,
    minZoom: 3,
    maxZoom: 7,
    pitch: 45,
    bearing: 20
  };
```

```js
deckInstance.setProps({
  controller: true,
  layers: [
    new GeoJsonLayer({
      id: "base-map",
      data: states,
      lineWidthMinPixels: 1.5,
      getLineColor: [38, 38, 38],
      getFillColor: [255,255,255, 100]
    }),
    new HexagonLayer({
      // id: 'hexbin-plot',
      id: 'heatmap',
      data: jobsOGSorted,
      coverage: 1,
      radius: 6000,
      upperPercentile: 100,
      colorRange,
      elevationScale: 100,
      elevationRange: [50, 15000],
      extruded: true,
      getPosition: d => [d.Longitude, d.Latitude],
      opacity: 1,
      pickable: true,
      material: {
        ambient: 0.64,
        diffuse: 0.6,
        shininess: 32,
        specularColor: [51, 51, 51]
      }
    }),
    new TextLayer({
        id: "text-layer",
        data: stateCentroid,
        getPosition: d => [d.longitude, d.latitude],
        getText: d => d.name,
        fontFamily: 'Helvetica',
        fontWeight: 400,
        background: false,
        fontSettings: ({
          sdf: true,
        }),
        outlineWidth: 1,
        getSize: 14,
        getColor: [8,8,8, 255],
        getTextAnchor: 'middle',
        getAlignmentBaseline: 'center',
        getPixelOffset: [0, -10]
      })
  ]
});
```

<!-- Create bubble chart of job track type counts -->
```js
  const trackTypes = [
    "NTT",
    "TT",
    "Unavailable",
  ]

  const tracktypesColors = [
    "#97bbf5",
    "#efb118",
    "#ff725c"
  ]

  const trackTypesGrid = (width, height) => {
    return  Plot.plot({
      width,
      height: height - 30,
      marginLeft: 100,
      marginBottom: 40,
      marginTop: 0,
      grid: true,
      x: {domain: uniqueAYS, label: "AY"},
      y: {domain: trackTypes},
      r: {range: [3, 25], label: "Number of postings"},
      color: {
        domain: trackTypes,
        range: tracktypesColors,
        // label: "Track Type"
      },
      marks: [
        Plot.dot(jobsOGSorted, Plot.group(
          {r: "count"}, 
          {
            x: "AY", 
            y: "TrackType", 
            fill: "TrackType", 
            tip: true, 
            stroke: "currentColor", 
            strokeWidth: 0.5
          }
        ))
      ]
    });
  }
```

```js
const color = Plot.scale({color: {domain: ["TT", "NTT", "Unavailable"]}})
```

```js
const frmCard = (y, jobs, tidy) => {
  const key = `${y}`
  const diff1 = jobs.at(-1)[key] - jobs.at(-2)[key]
  const diffY = jobs.at(-1)[key] - jobs.at(-53)[key]
  const range = d3.extent(jobs.slice(-52), (d) => d[key])
  const stroke = color.apply(`${y}Y FRM`)

  return html.fragment`
    <h2 style="color: ${stroke}">${y} job posts</h2>
    <p style="padding:0;margin:0;font-size:small;">Based on last recorded date: ${jobs.at(-1).datetimeObj.toDateString()}</p>
    <p style="width:100%;font-size:2rem;font-weight:600;margin:0;padding:0;">${jobs.at(-1)[key]}</p>

    <table>
      <tr>
        <td>Last 4-week average</td>
        <td align="right">${formatDecimal(d3.mean(jobs.slice(-4), (d) => d[key]))}</td>
      </tr>
      <tr>
        <td>Last 52-week average</td>
        <td align="right">${formatDecimal(d3.mean(jobs.slice(-52), (d) => d[key]))}</td>
      </tr>
      <tr>
        <td>First 2-year average</td>
        <td align="right">${formatDecimal( d3.mean(jobs.slice(0,104), (d) => d[key]) )}</td>
      </tr>
      <tr>
        <td>Last 2-year average</td>
        <td align="right">${formatDecimal(d3.mean(jobs.slice(-104), (d) => d[key]))}</td>
      </tr>
    </table>
    ${resize((width) => 
      Plot.plot({
        width,
        height: 70,
        marks: [

          Plot.tickX(
            jobs.slice(-52), 
            {
              x: key,
              stroke,
              insetTop: 10,
              insetBottom: 10,
              strokeWidth: 2,
              tip: {anchor: "bottom"},
              title: (d) => `${d.datetimeObj?.toLocaleDateString("en-us")}: ${d[key]} jobs`,
            }
          ),
          Plot.crosshairX(
            jobs.slice(-52),
            {
              x: key, 
              color: "red", 
              opacity: 1
            }
          )
        ]
      })
    )}
    <span class="small muted">Last 52-week range</span>
  `;
}
```

<style type="text/css">

  @container (min-width: 560px) {
    .grid-cols-2-3 {
      grid-template-columns: 1fr 1fr;
    }
    .grid-cols-2-3 .grid-colspan-2 {
      grid-column: span 2;
    }
  }

  @container (min-width: 840px) {
    .grid-cols-2-3 {
      grid-template-columns: 1fr 2fr;
      grid-auto-flow: column;
    }
  }

</style>

<div class="grid grid-cols-2-3" style="margin-top: 2rem;">
  <div class="card">${frmCard("TT", jobs)}</div>
  <div class="card">${frmCard("NTT", jobs)}</div>

  <div class="card grid-colspan-2 grid-rowspan-2" style="display: flex; flex-direction: column;">
    <h2>Job postings ${startEnd === defaultStartEnd ? "over the past year" : startEnd.map((d) => d.toLocaleDateString("en-US")).join("–")}</h2><br>
    <span style="flex-grow: 1;">${resize((width, height) =>
      Plot.plot({
        width,
        height,
        y: {grid: true, label: "Posts"},
        color,
        marks: [
          Plot.lineY(
            tidyCleanSorted.filter((d) => startEnd[0] <= d.datetimeObj && d.datetimeObj <= startEnd[1]),
            {
              x: "datetimeObj", 
              y: "posts", 
              stroke: "type",
              tip: true, 
              markerEnd: true
            }
          ),
        ]
      })
    )}</span>
  </div>
</div>

<div class="grid">
  <div class="card">
    <h2>Job Posts Over Time (${tidyCleanSorted.at(0).datetimeObj.getUTCFullYear()} - ${tidyCleanSorted.at(-1).datetimeObj.getUTCFullYear()})</h2>
    <h3>Click or drag to zoom</h3><br>
    ${resize((width) =>
      Plot.plot({
        width,
        x: {label: null, tickPadding: 6, tickSize: 0},
        y: {grid: true, label: "Posts"},
        color,
        marks: [
          Plot.ruleY([0, d3.max( tidyCleanSorted, (d) => d.posts )]),
          Plot.lineY(
            tidyCleanSorted,
            {x: "datetimeObj", y: "posts", stroke: "type", tip: true}
          ),
          (index, scales, channels, dimensions, context) => {
            const x1 = dimensions.marginLeft;
            const y1 = 0;
            const x2 = dimensions.width - dimensions.marginRight;
            const y2 = dimensions.height;
            const brushed = (event) => {
              if (!event.sourceEvent) return;
              let {selection} = event;
              if (!selection) {
                const r = 10; // radius of point-based selection
                let [px] = d3.pointer(event, context.ownerSVGElement);
                px = Math.max(x1 + r, Math.min(x2 - r, px));
                selection = [px - r, px + r];
                g.call(brush.move, selection);
              }
              setStartEnd(selection.map(scales.x.invert));
            };
            const pointerdowned = (event) => {
              const pointerleave = new PointerEvent("pointerleave", {bubbles: true, pointerType: "mouse"});
              event.target.dispatchEvent(pointerleave);
            };
            const brush = d3.brushX().extent([[x1, y1], [x2, y2]]).on("brush end", brushed);
            const g = d3.create("svg:g").call(brush);
            g.call(brush.move, getStartEnd().map(scales.x));
            g.on("pointerdown", pointerdowned);
            return g.node();
          },
        ]
      })
    )}
  </div>
</div>


<!-- Searchable table -->
<header>
  <h2>Search &amp; Review Job Data</h2>
  <p>
    Use the filters and search box below to search through the data.
    <br>
    Defaults to no selected filters, and you can select multiple options by clicking, dragging, etc. within each filter box.
    <br>
    <strong>Note</strong>: Any date listed as 01/01/1900 demarcates any unknown date in the data.
  </p>
<header>

```js
  // let uniqueAYS = [...new Set(jobsOGSorted.map(post => post.AY))]
  // let AYLast = uniqueAYS.slice(-1)[0]
```

```js
  // For search with table
  const columns = view(Inputs.select(
    ["AY", "DateAdded", "City", "State", "Institution", "TrackType", "Position"],
    {
      multiple: false,
      label: "Sort by Column",
      value: "DateAdded"
    })
  )

  const selectedTrackType = view(Inputs.select(
    ["TT", "NTT", "Unavailable"],
    {
      multiple: true,
      label: "Search by TrackType",
      value: "TT"
    })
  )

  const selectedAY = view(Inputs.select(
    uniqueAYS,
    {
      multiple: true,
      label: "Search by AY",
      value: AYLast,
    })
  )
```

```js
const jobsFiltered = jobsOGSorted
          .filter(d => selectedTrackType.includes(d.TrackType))
          .filter(d => selectedAY.includes(d.AY))
```

```js
  const searchJobs = Inputs.search(jobsFiltered)
  const searchJobsValue = Generators.input(searchJobs)
```

<!-- Searchable Table -->
<section class="card grid-colspan-2 grid-rowspan-1" style="">
  <div style="padding: 1rem">
    ${searchJobs}
    ${ Inputs.table(
      searchJobsValue,
      {
        width: {
          AY: 100,
          Institution: 240,
          City: 140,
          State: 140,
          DateAdded: 100,
          TrackType: 50,
        },
        sort: columns,
        rows: 20,
        columns: ["AY", "DateAdded", "City", "State", "Institution", "TrackType", "Position"], 
        header: {AY: "AY", DateAdded: "DateAdded", City: "City", State: "State", Institution: "Institution", TrackType: "TrackType", Position: "Position"}
      }
    )}
  </div>
</section>

<!-- DOWNLOAD TABLE DATA -->

```js
let todaysDate = new Date()
const offsetDate = todaysDate.getTimezoneOffset()
todaysDate = new Date(todaysDate.getTime() - (offsetDate*60*1000))
todaysDate = todaysDate.toISOString().split('T')[0]
const allFileTableName = "rhetmap-all-"+todaysDate+".csv"
const filteredFileTableName = "rhetmap-filtered-"+todaysDate+".csv"
```

<!-- Download Filtered CSV -->

```js 
view(download(async () => {
  const csvString = d3.csvFormat(searchJobsValue);
  return new Blob([csvString], { type: "text/csv" });
}, filteredFileTableName, "Save Filtered Table As CSV"));
```

<!-- Download Full CSV -->

```js 
view(download(async () => {
  const csvFullString = d3.csvFormat(jobsOGSorted);
  return new Blob([csvFullString], { type: "text/csv" });
}, allFileTableName, "Save Full Data Set As CSV"));
```
