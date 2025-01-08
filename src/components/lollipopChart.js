import * as Plot from "npm:@observablehq/plot";

/**
 * Lollipop chart of dams by state / territory
*/
export function LollipopChart(width, height, jobsOG) {

  return Plot.plot({
    width,
    height: height - 50,
    marginTop: 10,
    marginLeft: 175,
    marginBottom: 35,
    insetTop: -5,
    insetBottom: -5,
    color: {scheme: "Viridis"},
    y: {label: "State / Territory"},
    x: {label: "Overall Number of Jobs", grid: true, ticks: 5, tickSize: 0},
    marks: [
      Plot.ruleY(
        jobsOG, 
        Plot.groupY(
          {x: "count"},
          {
            y: "State",
            strokeWidth: 0.5, 
            margin: 20,
            sort: {y: "x", reverse: true}
          }
        )
      ),
      Plot.dot(
        jobsOG,
        Plot.groupY(
          {x: "count", fill: "count"},
          {
            y: "State", 
            r: 4, 
            stroke: "currentColor", 
            strokeWidth: 0.5, 
            tip: true, 
            sort: {y: "x", reverse: true}, title: d => `${d.State}`}
        )
      )
    ]
  });

}
