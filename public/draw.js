/* Fields */

function ultimateField() {
	var fieldLayer = new Kinetic.Layer({
		x: START_X,
		y: START_Y,
		name: "fieldLayer",
		draggable: true,
		dragConstraint: "vertical",
		dragBounds: {
			top: -300,
			bottom: 100
		}
	});
	
	var field = new Kinetic.Rect({
		width: 40 * SCALE,
		height: 120 * SCALE,
		fill: "green",
		stroke: "black",
		strokeWidth: 1,
		x: 0,
		y: 0,
		name: "playingField",
		//rotation: -Math.PI/2,
		//offset: [20*SCALE, 60*SCALE],
	});
	
	var endLine1 = new Kinetic.Line({
		points: [0, 0, 40 * SCALE, 0],
		stroke: "white",
		strokeWidth: 1,
		x: 0,
		y: 25 * SCALE,
		name: "endLine1"
	});
	
	var endLine2 = new Kinetic.Line({
		points: [0, 0, 40 * SCALE, 0],
		stroke: "white",
		strokeWidth: 1,
		x: 0,
		y: 95 * SCALE,
		name: "endLine2"
	});
	
	var brick1 = new Kinetic.Shape({
		drawFunc:function(context) {
			context.beginPath();
			context.arc(SCALE, SCALE, Math.sqrt(2) * SCALE, 0, 2 * Math.PI);
			//context.closePath();
			//context.beginPath();
			context.moveTo(0, 0);
			context.lineTo(20, 20);
			context.moveTo(0, 20);
			context.lineTo(20, 0);
			context.closePath();
            this.stroke(context);
		},
        stroke: "white",
        strokeWidth: 2,
        x: 20 * SCALE,
        y: 45 * SCALE,
        name: "brick1",
        alpha: 0.5,
        offset: {
        	x: 10,
        	y: 10
        }
	});
	
	var brick2 = new Kinetic.Shape({
		drawFunc:function(context) {
			context.beginPath();
			context.arc(SCALE, SCALE, Math.sqrt(2) * SCALE, 0, 2 * Math.PI);
			//context.closePath();
			//context.beginPath();
			context.moveTo(0, 0);
			context.lineTo(20, 20);
			context.moveTo(0, 20);
			context.lineTo(20, 0);
			context.closePath();
            this.stroke(context);
		},
        stroke: "white",
        strokeWidth: 2,
        x: 20 * SCALE,
        y: 75 * SCALE,
        name: "brick2",
        alpha: 0.5,
        offset: {
        	x: 10,
        	y: 10
        }
	});	
	
	fieldLayer.add(field);
	fieldLayer.add(endLine1);
	fieldLayer.add(endLine2);
	fieldLayer.add(brick1);
	fieldLayer.add(brick2);
	
	fieldLayer.on('dragmove', function(e) {
		var tempLayer = fieldLayer;
		$.each(stage.getChildren(), function(index, value) {
			if (value.getName() !== "fieldLayer") {
				value.setPosition(fieldLayer.getPosition());
				value.draw();
			}
		});
	});
	
	return fieldLayer;
}

/* Articles */

function createArticle(item) {
	var group = new Kinetic.Group({
		x: item.x,
		y: item.y,
		draggable: true
	});
	
	if (item.type === "player") {
		group.add(createPlayer(item));
	} else if (item.type === "ball") {
		group.add(createBall(item));
	} else if (item.type === "cone") {
		group.add(createCone(item));
	}
	
	if (item.label)
		group.add(createLabel(item));
		
	return group;
}

function createPlayer(player) {
	return new Kinetic.Circle({
		radius: 1.5 * SCALE,
		fill: player.color,
		stroke: "black",
		strokeWidth: 1,
		draggable: true
	});
}

function createBall(ball) {
	return new Kinetic.Circle({
		radius: 1.5 * SCALE,
		fill: ball.color,
		stroke: "black",
		strokeWidth: 1,
		draggable: true
	});
}

function createCone(cone) {
	return new Kinetic.RegularPolygon({
		sides: 3,
		radius: 1.5 * SCALE,
		fill: cone.color,
		stroke: "black",
		strokeWidth: 1,
		draggable: true
	});
}

function createLabel(label) {
	// Use custom shape to draw text, Kinetic.Text too limited options
	return new Kinetic.Shape({
		drawFunc: function(context) {
			context.beginPath();
			context.closePath(); 			
 			context.fillStyle = "black";
 			context.font = "15px Arial";
 			context.textAlign = "center";
 			context.textBaseline = "middle";
 			context.fillText(label.label, 0, 0);
		},
		draggable: true
	});
}

function createLine(line) {
	return new Kinetic.Line({
			points: line.points,
			lineCap: "round",
			dashArray: [20, 20],
			//fill: "black",
			stroke: "black"
	});
}