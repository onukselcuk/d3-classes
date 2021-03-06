const canvas = d3.select(".canvas");

const svg = canvas.append("svg").attr("height", 600).attr("width", 600);
// svg.attr("height", 600);
// svg.attr("width", 600);

const group = svg.append("g").attr("transform", "translate(50,100)");

// append shapes to svg container

group
  .append("rect")
  .attr("width", 200)
  .attr("height", 200)
  .attr("fill", "blue")
  .attr("x", 20)
  .attr("y", 20);
group.append("circle");
group.append("line");

group
  .append("text")
  .attr("x", 20)
  .attr("y", 500)
  .attr("fill", "grey")
  .text("hello, ninjas!")
  .style("font-family", "arial");

const data = [
  { width: 200, height: 100, fill: "purple" },
  { width: 100, height: 60, fill: "pink" },
  {
    width: 50,
    height: 30,
    fill: "red",
  },
];

const svg = d3.select("svg");

// Join data to rects
const rects = svg.selectAll("rect").data(data); // attaches every data element to a rect

// add attrs to rects already in the DOM
rects
  .attr("width", (d, i, n) => d.width)
  .attr("height", (d) => d.height)
  .attr("fill", (d) => d.fill);

// append the enter selection to DOM
rects
  .enter()
  .append("rect")
  .attr("width", (d, i, n) => d.width)
  .attr("height", (d) => d.height)
  .attr("fill", (d) => d.fill);

const svg = d3.select("svg");

d3.json("/planets.json").then((data) => {
  const circs = svg.selectAll("circle").data(data);
  // add attrs to circs already in DOM
  circs
    .attr("cy", 200)
    .attr("cx", (d) => d.distance)
    .attr("r", (d) => d.radius)
    .attr("fill", (d) => d.fill);

  // append the enter selection to the DOM
  circs
    .enter()
    .append("circle")
    .attr("cy", 200)
    .attr("cx", (d) => d.distance)
    .attr("r", (d) => d.radius)
    .attr("fill", (d) => d.fill);
});
