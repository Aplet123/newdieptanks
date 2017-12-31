var fixedRot = tank.insert("polygon", ".updateCoords>circle").attr("points", "10,-10 50,-20 50,20 10,10 20,50 -20,50 -10,10 -50,20 -50,-20 -10,-10 -20,-50 20,-50").attr("fill", "#999999").attr("stroke", "#525252").attr("stroke-width", "2").classed("updateCoords", true);
tank.append("rect").attr("fill", "#999999").attr("x", "-7").attr("y", "0").attr("width", "14").attr("height", "40").attr("stroke", "#525252").attr("stroke-width", "2");
tank.append("circle").attr("fill", "#999999").attr("cx", "0").attr("cy", "0").attr("r", "12").attr("stroke", "#525252").attr("stroke-width", "2");
var bulletLayer = svg.insert("g", "g.updateCoords");
var bullets = [];
var linear = d3.transition().ease(d3.easeLinear).duration(1000);
preUpdate = function () {
	fixedRot.datum({
		x: 0,
		y: 0,
		r: - tank.datum().r,
		sx: 1,
		sy: 1
	});
	var shiftCount = 0;
	for (var i = 0; i < bullets.length; i ++) {
		if (Date.now() > bullets[i].datum().exp && bullets[i].classed("updateCoords")) {
			bullets[i].classed("updateCoords", false).attr("opacity", "1").transition(linear).attr("transform", "translate(" + bullets[i].datum().x + " " + bullets[i].datum().y + ") rotate(0) scale(1.5 1.5)").attr("opacity", "0").on("end", function () {
				this.remove();
			});
			shiftCount ++;
		}
	}
	for (var i = 0; i < shiftCount; i ++) {
		bullets.shift();
	}
	for (var i = 0; i < bullets.length; i ++) {
		bullets[i].datum().x += Math.cos(bullets[i].datum().d) * bullets[i].datum().bs;
		bullets[i].datum().y += Math.sin(bullets[i].datum().d) * bullets[i].datum().bs;
	}
};
function makeBullet (r, d, bs, exp) {
	var temp = d3.select(document.createElementNS("http://www.w3.org/2000/svg", "circle")).attr("fill", "#00c0e5").attr("cx", "0").attr("cy", "0").attr("r", r).attr("stroke", "#525252").attr("stroke-width", "2").classed("updateCoords", true).datum({
		x: tank.datum().x,
		y: tank.datum().y,
		r: 0,
		sx: 1,
		sy: 1,
		d: d,
		bs: bs,
		exp: Date.now() + exp
	});
	bullets.push(temp);
	bulletLayer.node().appendChild(temp.node());
	return temp;
}
var tankConfig = {
	accel: 0.05,
	topSpeed: 3,
	decel: 0.03
}
generateFireInterval(function (isTime) {
	if (isTime) {
		var ret = false;
		if ("w" in keys) {
			makeBullet(10, Math.PI / 2 + d3.randomUniform(-0.2, 0.2)(), 1, 1000)
			ret = true;
		}
		if ("s" in keys) {
			makeBullet(10, - Math.PI / 2 + d3.randomUniform(-0.2, 0.2)(), 1, 1000)
			ret = true;
		}
		if ("a" in keys) {
			makeBullet(10, d3.randomUniform(-0.2, 0.2)(), 1, 1000)
			ret = true;
		}
		if ("d" in keys) {
			makeBullet(10, Math.PI + d3.randomUniform(-0.2, 0.2)(), 1, 1000)
			ret = true;
		}
		return ret;
	}
	return false;
}, 200);
generateFireInterval(function (isTime) {
	if (isTime && mouseState == 0) {
		makeBullet(6, tank.datum().r * Math.PI / 180 + Math.PI / 2, 2, 2000);
		return true;
	}
	return false;
}, 200);