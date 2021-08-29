// DOM elements
const btns = document.querySelectorAll("button");
const form = document.querySelector("form");
const formAct = document.querySelector("form span");
const input = document.querySelector("#cycling");
const error = document.querySelector(".error");

var activity = "cycling";

btns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    //get activity
    activity = e.target.dataset.activity;
    btns.forEach((btn) => btn.classList.remove("active"));
    e.target.classList.add("active");

    // set id of input field
    input.setAttribute("id", activity);

    formAct.textContent = activity;

    // call the update function

    update(data);
  });
});

//form submit

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const distance = parseInt(input.value);
  if (distance) {
    db.collection("activities")
      .add({
        distance,
        activity,
        date: new Date().toString(),
      })
      .then(() => {
        error.textContent = "";
        input.value = "";
      });
  } else {
    error.textContent = "Please enter a valid distance";
  }
});

const margin = { top: 40, left: 100, right: 20, bottom: 50 };
const graphWidth = 560 - margin.left - margin.right;
const graphHeight = 400 - margin.top - margin.bottom;

const svg = d3
  .select(".canvas")
  .append("svg")
  .attr("width", graphWidth + margin.left + margin.right)
  .attr("height", graphHeight + margin.top + margin.bottom);

const graph = svg
  .append("g")
  .attr("width", graphWidth)
  .attr("height", graphHeight)
  .attr("transform", `translate(${margin.left},${margin.top})`);

// scales

const x = d3.scaleTime().range([0, graphWidth]);
const y = d3.scaleLinear().range([graphHeight, 0]);

// axes groups

const xAxisGroup = graph
  .append("g")
  .attr("class", "x-axis")
  .attr("transform", `translate(0,${graphHeight})`);

const yAxisGroup = graph.append("g").attr("class", "y-axis");

// d3 line path generator

const line = d3
  .line()
  .x(function (d) {
    return x(new Date(d.date));
  })
  .y(function (d) {
    return y(d.distance);
  });

// line path elements
const path = graph.append("path");

// create dotted line group and append that to graph

const dottedLines = graph.append("g").style("opacity", 0);

// create x dotted line and append to dotted line group
const xDottedLine = dottedLines
  .append("line")
  .attr("stroke-width", 1)
  .attr("stroke-dasharray", 4)
  .attr("stroke", "#aaa");

// create y dotted line and append to dotted line group

const yDottedLine = dottedLines
  .append("line")
  .attr("stroke-width", 1)
  .attr("stroke-dasharray", 4)
  .attr("stroke", "#aaa");

const update = (data) => {
  data = data.filter((item) => item.activity === activity);

  // sort data based on date object

  data.sort((a, b) => new Date(a.date) - new Date(b.date));

  // set scale domains

  x.domain(d3.extent(data, (d) => new Date(d.date)));

  y.domain([0, d3.max(data, (d) => d.distance)]);

  // update path data
  path
    .data([data])
    .attr("fill", "none")
    .attr("stroke", "#00bfa5")
    .attr("stroke-width", 2)
    .attr("d", line);

  // create circles for objects

  const circles = graph.selectAll("circle").data(data);

  //update current points

  circles
    .attr("cx", (d) => x(new Date(d.date)))
    .attr("cy", (d) => y(d.distance));

  //remove unwanted points
  circles.exit().remove();

  // add new points
  circles
    .enter()
    .append("circle")
    .attr("r", 4)
    .attr("cx", (d) => x(new Date(d.date)))
    .attr("cy", (d) => y(d.distance))
    .attr("fill", "#ccc");

  graph
    .selectAll("circle")
    .on("mouseover", (e, d) => {
      d3.select(e.currentTarget)
        .transition()
        .duration(100)
        .attr("r", 8)
        .attr("fill", "#fff");
      // set x dotted line coords (x1,x2,y1,y2)
      xDottedLine
        .attr("x1", x(new Date(d.date)))
        .attr("x2", x(new Date(d.date)))
        .attr("y1", graphHeight)
        .attr("y2", y(d.distance));

      // set y dotted line coords (x1,x2,y1,y2)
      yDottedLine
        .attr("x1", 0)
        .attr("x2", x(new Date(d.date)))
        .attr("y1", y(d.distance))
        .attr("y2", y(d.distance));

      // show the dotted line group (.style,opacity)
      dottedLines.style("opacity", 1);
    })
    .on("mouseleave", (e, d) => {
      d3.select(e.currentTarget)
        .transition()
        .duration(100)
        .attr("r", 4)
        .attr("fill", "#ccc");

      // hide dotted line group (.style,opacity)
      dottedLines.style("opacity", 0);
    });

  // create axes

  const xAxis = d3.axisBottom(x).ticks(4).tickFormat(d3.timeFormat("%b %d"));
  const yAxis = d3
    .axisLeft(y)
    .ticks(4)
    .tickFormat((d) => d + "m");

  // call axes
  xAxisGroup.call(xAxis);
  yAxisGroup.call(yAxis);

  // rotate axis text

  xAxisGroup
    .selectAll("text")
    .attr("transform", "rotate(-40)")
    .attr("text-anchor", "end");
};

// data and firestore

var data = [];

db.collection("activities").onSnapshot((res) => {
  res.docChanges().forEach((change) => {
    const doc = { ...change.doc.data(), id: change.doc.id };
    switch (change.type) {
      case "added":
        data.push(doc);
        break;
      case "modified":
        const index = data.findIndex((item) => item.id === doc.id);
        data[index] = doc;
        break;
      case "removed":
        data = data.filter((item) => item.id !== doc.id);
        break;
      default:
        break;
    }
  });

  update(data);
});
