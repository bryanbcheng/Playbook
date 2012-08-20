function doIt() {
	stage.removeChildren();
	var layer = new Kinetic.Layer({x: 20, y: 20});
	layer.add(drawIt9());
	layer.add(drawIt10());
	layer.add(drawIt11());
// 	var layer = new Kinetic.Layer({x: 14, y: 12});
// 	layer.add(drawIt());
// 	layer.add(drawIt2());
// 	layer.add(drawIt3());
// 	layer.add(drawIt4());
// 	var layer2 = new Kinetic.Layer({x: 14, y:40});
// 	//layer2.add(drawB());
// 	layer2.add(drawIt5());
// 	layer2.add(drawIt6());
// 	layer2.add(drawIt7());
// 	layer2.add(drawIt8());
// 	layer.on("mouseover", function() {
// 		layer2.setY(12);
// 		layer2.draw();
// 	});
// 	layer.on("click", function() {
// 		layer2.setY(500);
// 		layer2.draw();
// 	});
	stage.add(layer);
// 	stage.add(layer2);
}

var size = 10;
function drawIt() {
	return new Kinetic.Circle({
		radius: size,
 		//fill: cross.hover ? "#585858" : "white",
 		//stroke: cross.hover ? "#333" : "#CCC",
 		stroke: "black",
 		strokeWidth: 3,
 		//offset: {x: -12, y: -12}
	});
}
function drawIt2() {
	return new Kinetic.Rect({
		width: size*2,
		height: size*2,
 		//fill: cross.hover ? "#585858" : "white",
 		//stroke: cross.hover ? "#333" : "#CCC",
 		x: 28,
 		offset: {x: size, y: size}, 
 		stroke: "black",
 		strokeWidth: 3
	});
}

function drawIt3() {
	return new Kinetic.RegularPolygon({
		sides: 3,
		radius: size * (2 / Math.sqrt(3)),
 		//fill: cross.hover ? "#585858" : "white",
 		//stroke: cross.hover ? "#333" : "#CCC",
 		x: 56,
 		offset: {y: -3},
 		stroke: "black",
 		strokeWidth: 3
	});
}

function drawIt4() {
	return new Kinetic.Shape({	
		drawFunc:function(context) {
			context.beginPath();
			context.moveTo(-size, -size);
			context.lineTo(size,size);
			context.moveTo(-size,size);
			context.lineTo(size, -size);
			context.closePath();
			this.fill(context);
            this.stroke(context);
		},
        //stroke: cross.hover ? "#333" : "#DDD",
        stroke: "black",
        strokeWidth: 3,
        //alpha: 0.75,
        x: 84
    });
}

// function drawB() {
// 	return new Kinetic.Rect({
// 		width: 112,
// 		height: 28,
// 		fill: "black",
// 		offset: {x: 12, y: 12}
// 	});
// }

function drawIt5() {
	return new Kinetic.Circle({
		radius: size,
 		//fill: cross.hover ? "#585858" : "white",
 		//stroke: cross.hover ? "#333" : "#CCC",
 		stroke: "#CDCDCD",
 		strokeWidth: 3,
 		//offset: {x: -12, y: -12}
	});
}
function drawIt6() {
	return new Kinetic.Rect({
		width: size*2,
		height: size*2,
 		//fill: cross.hover ? "#585858" : "white",
 		//stroke: cross.hover ? "#333" : "#CCC",
 		x: 28,
 		offset: {x: size, y: size}, 
 		stroke: "#CDCDCD",
 		strokeWidth: 3
	});
}

function drawIt7() {
	return new Kinetic.RegularPolygon({
		sides: 3,
		radius: size * (2 / Math.sqrt(3)),
 		//fill: cross.hover ? "#585858" : "white",
 		//stroke: cross.hover ? "#333" : "#CCC",
 		x: 56,
 		offset: {y: -3},
 		stroke: "#CDCDCD",
 		strokeWidth: 3
	});
}

function drawIt8() {
	return new Kinetic.Shape({	
		drawFunc:function(context) {
			context.beginPath();
			context.moveTo(-size, -size);
			context.lineTo(size,size);
			context.moveTo(-size,size);
			context.lineTo(size, -size);
			context.closePath();
			this.fill(context);
            this.stroke(context);
		},
        //stroke: cross.hover ? "#333" : "#DDD",
        stroke: "#CDCDCD",
        strokeWidth: 3,
        //alpha: 0.75,
        x: 84
    });
}

function drawIt9() {
	return new Kinetic.Circle({
		radius: 5,
		stroke: "black",
		strokeWidth: 2,
	});	
}

function drawIt10() {
	var group = new Kinetic.Group({
		x: 20
	});
	
	group.add(drawIt9());
	
	var half = new Kinetic.Shape({
		drawFunc: function(context) {
			context.beginPath();
			var startRad = Math.PI / 2;//Math.asin((SOCCER_PENALTY_HEIGHT - SOCCER_PENALTY_MARK) / SOCCER_CIRCLE_RADIUS);
			var endRad = Math.PI * 3 / 2;
			context.arc(0, 0, 5, startRad, endRad);
			context.closePath();
            this.fill(context);
        },
        fill: "black",
        //stroke: "black",
        //strokeWidth: 3
	});	
	group.add(half);
	
	return group;
}

function drawIt11() {
	return new Kinetic.Circle({
		radius: 5,
		fill: "black",
		stroke: "black",
		strokeWidth: 2,
		x: 40
	});	
}