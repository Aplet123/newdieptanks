tank.insert("polygon", "circle").attr("fill", "#999999").attr("points", "-5,0 -20,60 -20,0 20,0 20,60 5,0").attr("stroke", "#525252").attr("stroke-width", "2");
var bulletLayer = svg.insert("g", "g.updateCoords");
var linear = d3.transition().ease(d3.easeLinear).duration(1000);
preUpdate = function () {
	bulletLayer.selectAll("polygon").each(function (d) {
		var self = d3.select(this);
		if (Date.now() > d.exp && self.classed("updateCoords")) {
			self.classed("updateCoords", false).attr("opacity", "1").transition(linear).attr("transform", "translate(" + d.x + " " + d.y + ") rotate(0) scale(1.5 1.5)").attr("opacity", "0").on("end", function () {
				this.remove();
			});
		}
	});
	bulletLayer.selectAll("polygon.updateCoords").each(function (d) {
		d.dist += d.bs;
		d.x = Math.cos(d.d) * d.dist + tank.datum().x;
		d.y = Math.sin(d.d) * d.dist + tank.datum().y;
		d.r += 3;
	});
};
function makeBullet (r, d, bs, exp) {
	var temp = d3.select(document.createElementNS("http://www.w3.org/2000/svg", "polygon")).attr("fill", "#00c0e5").attr("points", "0,5 10,10 5,0 10,-10 0,-5 -10,-10 -5,0 -10,10").attr("stroke", "#525252").attr("stroke-width", "2").classed("updateCoords", true).datum({
		x: tank.datum().x,
		y: tank.datum().y,
		r: 0,
		sx: 1,
		sy: 1,
		d: d,
		bs: bs,
		dist: 0,
		exp: Date.now() + exp
	});
	bulletLayer.node().appendChild(temp.node());
	return temp;
}
tankConfig = {
	accel: 0.03,
	topSpeed: 3,
	decel: 0.03
};
generateFireInterval(function (isTime) {
	if (isTime && mouseState == 0) {
		makeBullet(6, tank.datum().r * Math.PI / 180 + Math.PI / 2, 1, 4000);
		return true;
	}
	return false;
}, 500);