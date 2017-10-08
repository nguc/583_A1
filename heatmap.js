// variables to set
var title = "Appropriateness of actions based on location";

// STANDARD VARIABLES
var margin = {
    top: 100,
    right: 200,
    bottom: 100,
    left: 100
},
    width = 1400 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

// Variables for this viz
var locations = [];
var rectDim = { width: 3, height: 19 };
// setting up score min/max in case it's useful
var score = { min: 0, max: 9 }


// SCALE FUNCTIONS
var scalesHeatmap = { // color: pallete @ http://paletton.com/#uid=3140j0koQHIemRWk2MxuhDg-Ysy
    color: d3.scale.linear().domain([75, 65, 55, 45, 35]).range(
        ['rgb(202,0,32)', 'rgb(244,165,130)', 'rgb(247,247,247)', 'rgb(146,197,222)', 'rgb(5,113,176)']),
    xTime: d3.time.scale().domain([moment("2010-01-01"), moment("2010-12-31")]).range([0, 3 * 364]),
    legendY: d3.scale.linear().domain([0, 23]).range([height / 2 + 10 * 12, height / 2 - 10 * 12])
};

// STANDARD SVG SETUP
var svg = d3.select('#heatmap')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

// read in data file
d3.csv("MaxToMin.csv", function (error, data) {
    if (error) return console.error(error);

    // transform data to useable format
    var sf = transformData(data);

    // draw lines 
    drawGraph(sf, title);

});

// helper functions
function drawGraph(data, title) {
    drawHeatmap(data);
}

// setup data
function transformData(inputData, location) {
    var outputData = []
    inputData.forEach(function (d) {
        // record min/max in case it's useful
        if (d.HLYTEMPNORMAL / 10 > temp.max) {
            temp.max = d.HLYTEMPNORMAL / 10;
        }
        if (d.HLYTEMPNORMAL / 10 < temp.min) {
            temp.min = d.HLYTEMPNORMAL / 10;
        }
        // setup data structure
        outputData.push({
            dayOfYear: (moment(d.day).dayOfYear() - 1),
            date: d.day,
            hour: +d.hour,
            normalTemp: d.HLYTEMPNORMAL / 10
        })
    });
    return outputData
}

// draw the lines & legend for the graph
function drawHeatmap(data) {
    svg.selectAll('.heatmapdailies')
        .data(data)
        .enter()
        .append('rect')
        .attr("class", "heatmapdailies")
        .attr("y", function (d) { return ((d.hour + vShift) % 24) * rectDim.height; })
        .attr("x", function (d) { return d.dayOfYear * rectDim.width; })
        .attr("width", rectDim.width + 1)
        .attr("height", rectDim.height + 1)
        .attr("fill", function (d) { return scalesHeatmap.color(d.normalTemp); })
        .attr("stroke", "none")
}
