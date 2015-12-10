
// var c20 = d3.scale.category20();

// var colors = [
//     'steelblue',
//     'green',
//     'red',
//     'purple'
// ];

var colors = ["#3366cc", "#dc3912", "#ff9900", "#109618", "#990099", "#0099c6", "#dd4477", "#66aa00", "#b82e2e", "#316395", "#994499", "#22aa99", "#aaaa11", "#6633cc", "#e67300", "#8b0707", "#651067", "#329262", "#5574a6", "#3b3eac"];

queue()
    .defer(d3.tsv, "results/AN.k10.RF.ROC", function(d) { return { x:+d.FPR, y:+d.TPR }; } )
    .defer(d3.tsv, "results/CIP.k10.RF.ROC", function(d) { return { x:+d.FPR, y:+d.TPR }; } )
    .defer(d3.tsv, "results/FOSFO.k10.RF.ROC", function(d) { return { x:+d.FPR, y:+d.TPR }; } )
    .defer(d3.tsv, "results/FOX.k10.RF.ROC", function(d) { return { x:+d.FPR, y:+d.TPR }; } )
    .defer(d3.tsv, "results/GM.k10.RF.ROC", function(d) { return { x:+d.FPR, y:+d.TPR }; } )
    .defer(d3.tsv, "results/IPM.k10.RF.ROC", function(d) { return { x:+d.FPR, y:+d.TPR }; } )
    .defer(d3.tsv, "results/LVX.k10.RF.ROC", function(d) { return { x:+d.FPR, y:+d.TPR }; } )
    .defer(d3.tsv, "results/MEM.k10.RF.ROC", function(d) { return { x:+d.FPR, y:+d.TPR }; } )
    .defer(d3.tsv, "results/NN.k10.RF.ROC", function(d) { return { x:+d.FPR, y:+d.TPR }; } )
    .defer(d3.tsv, "results/TE.k10.RF.ROC", function(d) { return { x:+d.FPR, y:+d.TPR }; } )
    .defer(d3.tsv, "results/TIG.k10.RF.ROC", function(d) { return { x:+d.FPR, y:+d.TPR }; } )
    .defer(d3.tsv, "results/TZP.k10.RF.ROC", function(d) { return { x:+d.FPR, y:+d.TPR }; } )
    .awaitAll(ready);

var margin = {
        top: 40,
        right: 30,
        bottom: 50,
        left: 50
    }, width = 960 - margin.left - margin.right, height = 600 - margin.top - margin.bottom;

var x = d3.scale.linear().domain([
    0,
    1
]).range([
    0,
    width
]);

var y = d3.scale.linear().domain([
    0,
    1,
]).range([
    height,
    0
]);

var xAxis = d3.svg.axis().scale(x).tickSize(-height).tickPadding(10).tickSubdivide(true).orient('bottom');
var yAxis = d3.svg.axis().scale(y).tickPadding(10).tickSize(-width).tickSubdivide(true).orient('left');
var zoom = d3.behavior.zoom().x(x).y(y).scaleExtent([
    1,
    10
]).on('zoom', zoomed);
var svg = d3.select('body').append('svg').call(zoom).attr('width', width + margin.left + margin.right).attr('height', height + margin.top + margin.bottom).append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
svg.append("text").attr("x", width/2).attr("y", -20).style("text-anchor", "middle").style("font-size", "22px").text("ROC Curves (Klebsiella, k=10, Random Forest)");
svg.append('g').attr('class', 'x axis').attr('transform', 'translate(0,' + height + ')').call(xAxis);
svg.append('g').attr('class', 'y axis').call(yAxis);
svg.append('g').attr('class', 'y axis').append('text').attr('class', 'axis-label').attr('y', height + 50).attr('x', width/2).text('False Positive Rate');
svg.append('g').attr('class', 'y axis').append('text').attr('class', 'axis-label').attr('transform', 'rotate(-90)').attr('y', -margin.left + 10).attr('x', -height/2).text('True Positive Rate');
svg.append('clipPath').attr('id', 'clip').append('rect').attr('width', width).attr('height', height);

var drugs = [
    "0.968 LVX",
    "0.961 CIP",
    "0.948 IPM",
    "0.932 AN",
    "0.930 NN",
    "0.930 MEM",
    "0.911 GM",
    "0.853 FOX",
    "0.818 TZP",
    "0.803 TE",
    "0.701 FOSFO",
    "0.627 TIG" ];

var legendSpace = 26;
drugs.forEach(function(d,i) {
    console.log(d, i);
    svg.append("text")
	.attr("x", width - 130) // spacing
	.attr("y", i*legendSpace + 120)
	.attr("class", "legend")    // style the legend
	.style("font-weight", "bold")
	.style("fill", function() { // dynamic colours
	    return  colors[i]; })
	.text(d);
});


var line = d3.svg.line().interpolate('linear').x(function (d) {
    return x(d.x);
}).y(function (d) {
    return y(d.y);
});

var points;

function ready(error, data) {
    if (error) throw error;
    console.log(data);

    svg.selectAll('.line').data(data).enter().append('path').attr('class', 'line').attr('clip-path', 'url(#clip)').attr('stroke', function (d, i) {
	return colors[i % colors.length];
    }).attr('d', line);
    points = svg.selectAll('.dots').data(data).enter().append('g').attr('class', 'dots').attr('clip-path', 'url(#clip)');
    points.selectAll('.dot').data(function (d, index) {
	var a = [];
	d.forEach(function (point, i) {
            a.push({
		'index': index,
		'point': point
            });
	});
	return a;
    // }).enter().append('circle').attr('class', 'dot').attr('r', 2.5).attr('fill', function (d, i) {
    }).enter().append('circle').attr('class', 'dot').attr('r', 1.8).attr('fill', function (d, i) { //
	return colors[d.index % colors.length];
    }).attr('transform', function (d) {
	return 'translate(' + x(d.point.x) + ',' + y(d.point.y) + ')';
    });

}


function zoomed() {
    svg.select('.x.axis').call(xAxis);
    svg.select('.y.axis').call(yAxis);
    svg.selectAll('path.line').attr('d', line);
    points.selectAll('circle').attr('transform', function (d) {
        return 'translate(' + x(d.point.x) + ',' + y(d.point.y) + ')';
    });
}

//# sourceURL=pen.js

// var data = [
//     [
//         {
//             'x': 0.1,
//             'y': 0.2
//         },
//         {
//             'x': 0.3,
//             'y': 0.5
//         },
//         {
//             'x': 3,
//             'y': 10
//         },
//         {
//             'x': 4,
//             'y': 0
//         },
//         {
//             'x': 5,
//             'y': 6
//         },
//         {
//             'x': 6,
//             'y': 11
//         },
//         {
//             'x': 7,
//             'y': 9
//         },
//         {
//             'x': 8,
//             'y': 4
//         },
//         {
//             'x': 9,
//             'y': 11
//         },
//         {
//             'x': 10,
//             'y': 2
//         }
//     ],
//     [
//         {
//             'x': 1,
//             'y': 1
//         },
//         {
//             'x': 0.1,
//             'y': 0.2
//         },
//         {
//             'x': 0.2,
//             'y': 0.3
//         },
//         {
//             'x': 0.5,
//             'y': 0.5
//         },
//         {
//             'x': 5,
//             'y': 7
//         },
//         {
//             'x': 6,
//             'y': 12
//         },
//         {
//             'x': 7,
//             'y': 8
//         },
//         {
//             'x': 8,
//             'y': 3
//         },
//         {
//             'x': 9,
//             'y': 13
//         },
//         {
//             'x': 10,
//             'y': 3
//         }
//     ],
//     [
//         {
//             'x': 1,
//             'y': 2
//         },
//         {
//             'x': 2,
//             'y': 7
//         },
//         {
//             'x': 3,
//             'y': 12
//         },
//         {
//             'x': 4,
//             'y': 2
//         },
//         {
//             'x': 5,
//             'y': 8
//         },
//         {
//             'x': 6,
//             'y': 13
//         },
//         {
//             'x': 7,
//             'y': 7
//         },
//         {
//             'x': 8,
//             'y': 2
//         },
//         {
//             'x': 9,
//             'y': 4
//         },
//         {
//             'x': 10,
//             'y': 7
//         }
//     ],
//     [
//         {
//             'x': 1,
//             'y': 3
//         },
//         {
//             'x': 2,
//             'y': 8
//         },
//         {
//             'x': 3,
//             'y': 13
//         },
//         {
//             'x': 4,
//             'y': 3
//         },
//         {
//             'x': 5,
//             'y': 9
//         },
//         {
//             'x': 6,
//             'y': 14
//         },
//         {
//             'x': 7,
//             'y': 6
//         },
//         {
//             'x': 8,
//             'y': 1
//         },
//         {
//             'x': 9,
//             'y': 7
//         },
//         {
//             'x': 10,
//             'y': 9
//         }
//     ],
//     [
//         {
//             'x': 1,
//             'y': 4
//         },
//         {
//             'x': 2,
//             'y': 9
//         },
//         {
//             'x': 3,
//             'y': 14
//         },
//         {
//             'x': 4,
//             'y': 4
//         },
//         {
//             'x': 5,
//             'y': 10
//         },
//         {
//             'x': 6,
//             'y': 15
//         },
//         {
//             'x': 7,
//             'y': 5
//         },
//         {
//             'x': 8,
//             'y': 0
//         },
//         {
//             'x': 9,
//             'y': 8
//         },
//         {
//             'x': 10,
//             'y': 5
//         }
//     ]
// ];
