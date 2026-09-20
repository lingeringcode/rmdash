import * as Plot from "npm:@observablehq/plot";

/**
 * Lollipop chart of dams by state / territory
*/
export function LollipopCityChart(width, height, jobs, jobTrack) {

  return Plot.plot({
    width: width,
    height: height - 125,
    marginLeft: 125,
    marginBottom: 35,
    insetTop: -5,
    insetBottom: -5,
    color: {scheme: "Viridis"},
    y: {label: "City"},
    x: {label: `Number of ${jobTrack} Jobs`, grid: true, ticks: 5, tickSize: 0},
    marks: [
      Plot.ruleY(
        jobs,
        {
          x: "count",
          y: "City",
          strokeWidth: 0.5,
          margin: 20,
          sort: {y: "x", reverse: true}
        }
      ),
      Plot.dot(
        jobs,
        {
          x: "count", fill: "count",
          y: "City",
          r: 6,
          stroke: "currentColor",
          strokeWidth: 0.5,
          tip: true,
          sort: {y: "x", reverse: true}, title: d => `${d.count} jobs in ${d.City}`
        }
      )
    ]
  });

}
