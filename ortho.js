var fixedRot = tank.insert("polygon", ".updateCoords>circle").attr("points", "10,-10 50,-10 50,10 10,10 10,50 -10,50 -10,10 -50,10 -50,-10 -10,-10 -10,-50 10,-50").attr("fill", "#999999").attr("stroke", "#525252").attr("stroke-width", "2").classed("updateCoords", true);
preUpdate = function () {
	fixedRot.datum({
		x: 0,
		y: 0,
		r: - tank.datum().r,
		sx: 1,
		sy: 1
	});
};
tank.append("rect").attr("fill", "#999999").attr("x", "-7").attr("y", "0").attr("width", "14").attr("height", "40").attr("stroke", "#525252").attr("stroke-width", "2");
tank.append("circle").attr("fill", "#999999").attr("cx", "0").attr("cy", "0").attr("r", "12").attr("stroke", "#525252").attr("stroke-width", "2");