tank.insert("circle", ".tankBody").attr("fill", "#999999").attr("cx", "0").attr("cy", "30").attr("r", "12").attr("stroke", "#525252").attr("stroke-width", "2");
tank.insert("circle", ".tankBody").attr("fill", "#999999").attr("cx", "0").attr("cy", "-30").attr("r", "12").attr("stroke", "#525252").attr("stroke-width", "2");
tank.insert("circle", ".tankBody").attr("fill", "#999999").attr("cx", "-30").attr("cy", "0").attr("r", "12").attr("stroke", "#525252").attr("stroke-width", "2");
tank.insert("circle", ".tankBody").attr("fill", "#999999").attr("cx", "30").attr("cy", "0").attr("r", "12").attr("stroke", "#525252").attr("stroke-width", "2");
var bulletLayer = svg.insert("g", "g.updateCoords");
var linear = d3.transition().ease(d3.easeLinear).duration(1000);
var curR = 0;
var curState = "launched";
preUpdate = function () {
	curR += 0.3;
	tank.datum().r = curR;
	bulletLayer.selectAll("polygon.launched").each(function (d) {
		var self = d3.select(this);
		if (Date.now() > d.exp && self.classed("updateCoords")) {
			self.classed("updateCoords", false).attr("opacity", "1").transition(linear).attr("transform", "translate(" + d.x + " " + d.y + ") rotate(0) scale(1.5 1.5)").attr("opacity", "0").on("end", function () {
				this.remove();
			});
		}
	});
	bulletLayer.selectAll("polygon.launched").each(function (d) {
		d.x += Math.cos(d.d) * d.bs;
		d.y += Math.sin(d.d) * d.bs;
	});
	bulletLayer.selectAll("polygon.orbiting").each(function (d) {
		d.x = Math.sin(d.r * Math.PI / 180) * 60 + mouseX;
		d.y = - Math.cos(d.r * Math.PI / 180) * 60 + mouseY;
		d.r += 0.3;
	});
	var selectArray = d3.selectAll("polygon.deploying")._groups[0];
	for (var i = 0; i < selectArray.length; i ++) {
		var self = d3.select(selectArray[i]);
		var d = self.datum();
		if (Date.now() > d.exp && self.classed("updateCoords")) {
			curState = "orbiting";
			self.classed("deploying", false).classed("orbiting", true);
			d.r = i * 90 + 90;
		}
	}
	bulletLayer.selectAll("polygon.deploying").each(function (d) {
		d.x += Math.cos(d.d) * d.bs + momentum.x;
		d.y += Math.sin(d.d) * d.bs + momentum.y;
	});
};
function makeBullet (r, d, bs, exp) {
	var temp = d3.select(document.createElementNS("http://www.w3.org/2000/svg", "polygon")).attr("fill", "#00c0e5").attr("points", "-10,0 10,0 0,20").attr("stroke", "#525252").attr("stroke-width", "2").classed("updateCoords", true).classed("deploying", true).attr("opacity", "0.5").datum({
		x: tank.datum().x,
		y: tank.datum().y,
		r: r,
		sx: 1,
		sy: 1,
		d: d,
		bs: bs,
		exp: Date.now() + exp
	});
	bulletLayer.node().appendChild(temp.node());
	return temp;
}
tankConfig = {
	accel: 0.03,
	topSpeed: 2,
	decel: 0.03
};
generateFireInterval(function (isTime) {
	if (curState != "launched") {
		return true;
	}
	if (isTime) {
		for (var i = 0; i < 4; i ++) {
			makeBullet(tank.datum().r + 90 * i + 90, (tank.datum().r * Math.PI / 180) + (Math.PI / 2) * i, 0.3, 1000);
		}
		curState = "deploying";
		return true;
	}
	return false;
}, 3000);
generateFireInterval(function (isTime) {
	if (isTime && mouseState == 0 && curState == "orbiting") {
		curState = "launched";
		bulletLayer.selectAll("polygon").classed("orbiting", false).classed("launched", true).datum(function (d) {
			d.exp = Date.now() + 2000;
			d.bs = 3;
			d.d = d.r * Math.PI / 180 + Math.PI / 2;
			return d;
		}).attr("opacity", "1");
		return true;
	}
	return false;
}, 4000);