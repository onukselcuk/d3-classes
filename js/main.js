// const canvas = d3.select(".canvas");
//
// const svg = canvas.append("svg").attr("height", 600).attr("width", 600);
// // svg.attr("height", 600);
// // svg.attr("width", 600);
//
// const group = svg.append("g").attr("transform", "translate(50,100)");
//
// // append shapes to svg container
//
// group
//   .append("rect")
//   .attr("width", 200)
//   .attr("height", 200)
//   .attr("fill", "blue")
//   .attr("x", 20)
//   .attr("y", 20);
// group.append("circle");
// group.append("line");
//
// group
//   .append("text")
//   .attr("x", 20)
//   .attr("y", 500)
//   .attr("fill", "grey")
//   .text("hello, ninjas!")
//   .style("font-family", "arial");

// const data = [
//   { width: 200, height: 100, fill: "purple" },
//   { width: 100, height: 60, fill: "pink" },
//   {
//     width: 50,
//     height: 30,
//     fill: "red",
//   },
// ];
//
// const svg = d3.select("svg");
//
// // Join data to rects
// const rects = svg.selectAll("rect").data(data); // attaches every data element to a rect
//
// // add attrs to rects already in the DOM
// rects
//   .attr("width", (d, i, n) => d.width)
//   .attr("height", (d) => d.height)
//   .attr("fill", (d) => d.fill);
//
// // append the enter selection to DOM
// rects
//   .enter()
//   .append("rect")
//   .attr("width", (d, i, n) => d.width)
//   .attr("height", (d) => d.height)
//   .attr("fill", (d) => d.fill);

// select svg container first

// const svg = d3.select("svg");
//
// d3.json("/planets.json").then((data) => {
//   const circs = svg.selectAll("circle").data(data);
//   // add attrs to circs already in DOM
//   circs
//     .attr("cy", 200)
//     .attr("cx", (d) => d.distance)
//     .attr("r", (d) => d.radius)
//     .attr("fill", (d) => d.fill);
//
//   // append the enter selection to the DOM
//   circs
//     .enter()
//     .append("circle")
//     .attr("cy", 200)
//     .attr("cx", (d) => d.distance)
//     .attr("r", (d) => d.radius)
//     .attr("fill", (d) => d.fill);
// });

const svg = d3
  .select(".canvas")
  .append("svg")
  .attr("width", 600)
  .attr("height", 600);

// create margins and dimensions

const margin = {
  top: 20,
  right: 20,
  bottom: 100,
  left: 100,
};

const graphWidth = 600 - margin.left - margin.right;
const graphHeight = 600 - margin.top - margin.bottom;

const graph = svg
  .append("g")
  .attr("width", graphWidth)
  .attr("height", graphHeight)
  .attr("transform", `translate(${margin.left},${margin.top})`);

const xAxisGroup = graph
  .append("g")
  .attr("transform", `translate(0,${graphHeight})`);
const yAxisGroup = graph.append("g");

d3.json("/menu.json").then((data) => {
  const y = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.orders)])
    .range([graphHeight, 0]);

  // const min = d3.min(data, (d) => d.orders);
  // const max = d3.max(data, (d) => d.orders);
  // const extent = d3.extent(data, (d) => d.orders);

  const x = d3
    .scaleBand()
    .domain(data.map((item) => item.name))
    .range([0, 500])
    .paddingInner(0.2)
    .paddingOuter(0.2);

  // join the data to rects
  const rects = graph.selectAll("rect").data(data);

  rects
    .attr("width", x.bandwidth)
    .attr("height", (d) => graphHeight - y(d.orders))
    .attr("fill", "orange")
    .attr("x", (d, i) => x(d.name))
    .attr("y", (d) => y(d.orders));

  // append the enter selection to the DOM

  rects
    .enter()
    .append("rect")
    .attr("width", x.bandwidth)
    .attr("height", (d) => graphHeight - y(d.orders))
    .attr("fill", "orange")
    .attr("x", (d, i) => x(d.name))
    .attr("y", (d) => y(d.orders));

  // create and call axes

  const xAxis = d3.axisBottom(x);
  const yAxis = d3
    .axisLeft(y)
    .ticks(3)
    .tickFormat((d) => d + " orders");

  xAxisGroup.call(xAxis);
  yAxisGroup.call(yAxis);

  xAxisGroup
    .selectAll("text")
    .attr("transform", "rotate(-40)")
    .attr("text-anchor", "end")
    .attr("fill", "orange");
});
