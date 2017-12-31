var width = innerWidth - 4;
var height = innerHeight - 4;
var gridlength = 20;
var svg = d3.select("body").append("svg").attr("width", width).attr("height", height).attr("xmlns", "http://www.w3.org/2000/svg");
svg.append("rect").attr("x", "0").attr("y", "0").attr("width", "100%").attr("height", "100%").attr("fill", "#eeeeee");
var defs = svg.append("defs");
defs.append("filter").attr("id", "gridblur").append("feGaussianBlur").attr("in", "SourceGraphic").attr("stdDeviation", "1");
var grid = svg.append("g").attr("filter", "url(#gridblur)");
for (var i = 1; i < width / gridlength; i ++) {
	grid.append("rect").attr("x", gridlength * i - 1).attr("y", "0").attr("width", "2").attr("height", "100%").attr("fill", "#cccccc");
}
for (var i = 1; i < height / gridlength; i ++) {
	grid.append("rect").attr("y", gridlength * i - 1).attr("x", "0").attr("height", "2").attr("width", "100%").attr("fill", "#cccccc");
}
var tank = svg.append("g").classed("updateCoords", true).datum({
	x: width / 2,
	y: height / 2,
	r: 0,
	sx: 1,
	sy: 1
});
tank.append("circle").attr("fill", "#00c0e5").attr("cx", "0").attr("cy", "0").attr("r", "30").attr("stroke", "#525252").attr("stroke-width", "2");
function preUpdate () {}
function updateCoords () {
	preUpdate();
	d3.selectAll(".updateCoords").attr("transform", function (d) {
		return "translate(" + d.x + " " + d.y + ") rotate(" + d.r + ") scale(" + d.sx + " " + d.sy + ")";
	});
}
function distance (x1, y1, x2, y2) {
	return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 -  y1) * (y2 - y1));
}
function properScale (x1, y1, x2, y2, length) {
	if (distance(x1, y1, x2, y2) == 0) {
		return [0, 0];
	}
	var ratio = length / distance(x1, y1, x2, y2);
	return [(x2 - x1) * ratio, (y2 -  y1) * ratio];
}
var tankConfig = {
	accel: 0.03,
	topSpeed: 3,
	decel: 0.03
}
var keys = {};
var mouseX = 0;
var mouseY = 0;
document.addEventListener("keydown", function (e) {
	keys[e.key] = e.code;
});
document.addEventListener("keyup", function (e) {
	delete keys[e.key];
});
var momentum = {
	x: 0,
	y: 0
};
var fireFuncs = [];
var mouseState = -1;
svg.on("mousedown", function (e) {
	mouseState = d3.event.button;
});
d3.select("body").on("mouseup", function () {
	mouseState = -1;
});
setInterval(function () {
	var temp = {
		x: 0,
		y: 0
	};
	if ("w" in keys || "ArrowUp" in keys) {
		temp.y -= 1;
	}
	if ("s" in keys || "ArrowDown" in keys) {
		temp.y += 1;
	}
	if ("a" in keys || "ArrowLeft" in keys) {
		temp.x -= 1;
	}
	if ("d" in keys || "ArrowRight" in keys) {
		temp.x += 1;
	}
	var scales = properScale(0, 0, temp.x, temp.y, tankConfig.accel);
	momentum.x += scales[0];
	momentum.y += scales[1];
	if (temp.x == 0) {
		temp.x -= Math.sign(momentum.x);
	} else {
		temp.x = 0;
	}
	if (temp.y == 0) {
		temp.y -= Math.sign(momentum.y);
	} else {
		temp.y = 0;
	}
	scales = properScale (0, 0, temp.x, temp.y, tankConfig.decel);
	if (Math.abs(momentum.x) <= scales[0]) {
		momentum.x = 0;
	} else {
		momentum.x += scales[0];
	}
	if (Math.abs(momentum.y) <= scales[1]) {
		momentum.y = 0;
	} else {
		momentum.y += scales[1];
	}
	if (distance(0, 0, momentum.x, momentum.y) > tankConfig.topSpeed) {
		scales = properScale (0, 0, momentum.x, momentum.y, tankConfig.topSpeed);
		momentum.x = scales[0];
		momentum.y = scales[1];
	}
	tank.datum().x += momentum.x;
	tank.datum().y += momentum.y;
	if (tank.datum().x < 0) {
		tank.datum().x = 0;
		momentum.x = 1;
	} else if (tank.datum().x > width) {
		tank.datum().x = width;
		momentum.x = -1;
	}
	if (tank.datum().y < 0) {
		tank.datum().y = 0;
		momentum.y = 1;
	} else if (tank.datum().y > height) {
		tank.datum().y = height;
		momentum.y = -1;
	}
	for (var i = 0; i < fireFuncs.length; i ++) {
		fireFuncs[i]();
	}
	tank.datum().r = -180 * (Math.atan2(mouseX - tank.datum().x, mouseY - tank.datum().y) / Math.PI);
	updateCoords();
}, 1);
svg.on("mousemove", function () {
	var mcs = d3.mouse(this);
	mouseX = mcs[0];
	mouseY = mcs[1];
});
function generateFireInterval (cb, wait) {
	var lastTime = -Infinity;
	function fireInterval () {
		var arg = false;
		if (Date.now() - lastTime >= wait) {
			arg = true;
		}
		var ret = cb (arg);
		if (ret) {
			lastTime = Date.now();
		}
		return arg;
	}
	fireFuncs.push(fireInterval);
	return fireInterval;
}
updateCoords();