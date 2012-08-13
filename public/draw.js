/* CONSTANTS */
var SCALE = 10;
var START_X = 150;
var START_Y = 50;

/* ULTIMATE CONSTANTS */
var ULTIMATE_WIDTH = 40;
var ULTIMATE_HEIGHT = 120;
var ULTIMATE_ENDZONE = 25;
var ULTIMATE_BRICK = 20;

/* SOCCER CONSTANTS */
var SOCCER_WIDTH = 70;
var SOCCER_HEIGHT = 120;
var SOCCER_PENALTY_WIDTH = 44;
var SOCCER_PENALTY_HEIGHT = 18;
var SOCCER_PENALTY_MARK = 12;
var SOCCER_GOAL_BOX_WIDTH = 20;
var SOCCER_GOAL_BOX_HEIGHT = 6;
var SOCCER_CIRCLE_RADIUS = 10;

/* FOOTBALL CONSTANTS */
var FOOTBALL_WIDTH = 160 / 3;
var FOOTBALL_HEIGHT = 120;
var FOOTBALL_ENDZONE = 10;
var FOOTBALL_HASH_WIDTH = 1;
var FOOTBALL_HASH = 20;
var FOOTBALL_NUMBERS = 12;
var FOOTBALL_NUMBERS_HEIGHT = 2;


/* Fields */

function ultimateField(size, startX, startY) {
	if (size === "full") return ultimateFieldFull(startX, startY);
	else if (size === "half") return ultimateFieldHalf(startX, startY);
}

function ultimateFieldFull(startX, startY) {
	var fieldLayer = new Kinetic.Layer({
		x: startX ? startX : START_X,
		y: startY ? startY : START_Y,
		name: "fieldLayer",
		draggable: true,
		dragConstraint: "vertical",
		dragBounds: {
			top: -300,
			bottom: 100
		}
	});
	
	var field = new Kinetic.Rect({
		width: ULTIMATE_WIDTH * SCALE,
		height: ULTIMATE_HEIGHT * SCALE,
		fill: "green",
		stroke: "black",
		strokeWidth: 1,
		x: 0,
		y: 0,
		name: "playingField",
	});
	
	var endLine1 = new Kinetic.Line({
		points: [0, 0, ULTIMATE_WIDTH * SCALE, 0],
		stroke: "white",
		strokeWidth: 1,
		x: 0,
		y: ULTIMATE_ENDZONE * SCALE,
		name: "endLine1"
	});
	
	var endLine2 = new Kinetic.Line({
		points: [0, 0, ULTIMATE_WIDTH * SCALE, 0],
		stroke: "white",
		strokeWidth: 1,
		x: 0,
		y: (ULTIMATE_HEIGHT - ULTIMATE_ENDZONE) * SCALE,
		name: "endLine2"
	});
	
	var brick1 = new Kinetic.Shape({
		drawFunc:function(context) {
			context.beginPath();
			context.arc(SCALE, SCALE, Math.sqrt(2) * SCALE, 0, 2 * Math.PI);
			context.moveTo(0, 0);
			context.lineTo(2 * SCALE, 2 * SCALE);
			context.moveTo(0, 2 * SCALE);
			context.lineTo(2 * SCALE, 0);
			context.closePath();
            this.stroke(context);
		},
        stroke: "white",
        strokeWidth: 2,
        x: ULTIMATE_WIDTH / 2 * SCALE,
        y: (ULTIMATE_ENDZONE + ULTIMATE_BRICK) * SCALE,
        name: "brick1",
        alpha: 0.5,
        offset: {
        	x: 1 * SCALE,
        	y: 1 * SCALE
        }
	});
	
	var brick2 = new Kinetic.Shape({
		drawFunc:function(context) {
			context.beginPath();
			context.arc(SCALE, SCALE, Math.sqrt(2) * SCALE, 0, 2 * Math.PI);
			context.moveTo(0, 0);
			context.lineTo(2 * SCALE, 2 * SCALE);
			context.moveTo(0, 2 * SCALE);
			context.lineTo(2 * SCALE, 0);
			context.closePath();
            this.stroke(context);
		},
        stroke: "white",
        strokeWidth: 2,
        x: ULTIMATE_WIDTH / 2 * SCALE,
        y: (ULTIMATE_HEIGHT - ULTIMATE_ENDZONE - ULTIMATE_BRICK) * SCALE,
        name: "brick2",
        alpha: 0.5,
        offset: {
        	x: 1 * SCALE,
        	y: 1 * SCALE
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

function ultimateFieldHalf(startX, startY) {
	var fieldLayer = new Kinetic.Layer({
		x: startX ? startX : START_X,
		y: startY ? startY : START_Y,
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
		height: ULTIMATE_HEIGHT / 2 * SCALE,
		fill: "green",
		stroke: "black",
		strokeWidth: 1,
		x: 0,
		y: 0,
		name: "playingField"
	});
	
	var endLine1 = new Kinetic.Line({
		points: [0, 0, 40 * SCALE, 0],
		stroke: "white",
		strokeWidth: 1,
		x: 0,
		y: 25 * SCALE,
		name: "endLine1"
	});
	
	var endLine1 = new Kinetic.Line({
		points: [0, 0, ULTIMATE_WIDTH * SCALE, 0],
		stroke: "white",
		strokeWidth: 1,
		x: 0,
		y: ULTIMATE_ENDZONE * SCALE,
		name: "endLine1"
	});
	
	var brick1 = new Kinetic.Shape({
		drawFunc:function(context) {
			context.beginPath();
			context.arc(SCALE, SCALE, Math.sqrt(2) * SCALE, 0, 2 * Math.PI);
			context.moveTo(0, 0);
			context.lineTo(2 * SCALE, 2 * SCALE);
			context.moveTo(0, 2 * SCALE);
			context.lineTo(2 * SCALE, 0);
			context.closePath();
            this.stroke(context);
		},
        stroke: "white",
        strokeWidth: 2,
        x: ULTIMATE_WIDTH / 2 * SCALE,
        y: (ULTIMATE_ENDZONE + ULTIMATE_BRICK) * SCALE,
        name: "brick1",
        alpha: 0.5,
        offset: {
        	x: 1 * SCALE,
        	y: 1 * SCALE
        }
	});
	
	fieldLayer.add(field);
	fieldLayer.add(endLine1);
	fieldLayer.add(brick1);
	
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

function soccerField(size, startX, startY) {
	if (size === "full") return soccerFieldFull(startX, startY);
	else if (size === "half") return soccerFieldHalf(startX, startY);
}

function soccerFieldFull(startX, startY) {
	var fieldLayer = new Kinetic.Layer({
		x: startX ? startX : START_X,
		y: startY ? startY : START_Y,
		name: "fieldLayer",
		draggable: true,
		dragConstraint: "vertical",
		dragBounds: {
			top: -300,
			bottom: 100
		}
	});
	
	var field = new Kinetic.Rect({
		width: SOCCER_WIDTH * SCALE,
		height: SOCCER_HEIGHT * SCALE,
		fill: "green",
		stroke: "black",
		strokeWidth: 1,
		x: 0,
		y: 0,
		name: "playingField"
	});
	
	var penaltyBox1 = new Kinetic.Rect({
		width: SOCCER_PENALTY_WIDTH * SCALE,
		height: SOCCER_PENALTY_HEIGHT * SCALE,
		stroke: "white",
		strokeWidth: 1,
		x: (SOCCER_WIDTH - SOCCER_PENALTY_WIDTH) / 2 * SCALE,
		y: 0,
		name: "penaltyBox1"
	});
	
	var penaltyBox2 = new Kinetic.Rect({
		width: SOCCER_PENALTY_WIDTH * SCALE,
		height: SOCCER_PENALTY_HEIGHT * SCALE,
		stroke: "white",
		strokeWidth: 1,
		x: (SOCCER_WIDTH - SOCCER_PENALTY_WIDTH) / 2 * SCALE,
		y: (SOCCER_HEIGHT - SOCCER_PENALTY_HEIGHT) * SCALE,
		name: "penaltyBox2"
	});
	
	var penaltyMark1 = new Kinetic.Ellipse({
		radius: 0.25 * SCALE,
		fill: "white",
		x: SOCCER_WIDTH / 2 * SCALE,
		y: SOCCER_PENALTY_MARK * SCALE,
		name: "penaltyMark1",
		alpha: 0.5
	});
	
	var penaltyMark2 = new Kinetic.Ellipse({
		radius: 0.25 * SCALE,
		fill: "white",
		x: SOCCER_WIDTH / 2 * SCALE,
		y: (SOCCER_HEIGHT - SOCCER_PENALTY_MARK) * SCALE,
		name: "penaltyMark2",
		alpha: 0.5
	});
	
	var penaltyCircle1 = new Kinetic.Shape({
		drawFunc: function(context) {
			context.beginPath();
			var startRad = Math.asin((SOCCER_PENALTY_HEIGHT - SOCCER_PENALTY_MARK) / SOCCER_CIRCLE_RADIUS);
			var endRad = Math.PI - startRad;
			context.arc(0, 0, SOCCER_CIRCLE_RADIUS * SCALE, startRad, endRad);
            this.stroke(context);
		},
		stroke: "white",
        strokeWidth: 2,
        x: SOCCER_WIDTH / 2 * SCALE,
        y: SOCCER_PENALTY_MARK * SCALE,
        name: "penaltyCircle1",
        alpha: 0.5
	});
	
	var penaltyCircle2 = new Kinetic.Shape({
		drawFunc: function(context) {
			context.beginPath();
			var rad = Math.asin((SOCCER_PENALTY_HEIGHT - SOCCER_PENALTY_MARK) / SOCCER_CIRCLE_RADIUS);
			var startRad = Math.PI + rad
			var endRad = 2 * Math.PI - rad;
			context.arc(0, 0, SOCCER_CIRCLE_RADIUS * SCALE, startRad, endRad);
            this.stroke(context);
		},
		stroke: "white",
        strokeWidth: 2,
        x: SOCCER_WIDTH / 2 * SCALE,
        y: (SOCCER_HEIGHT - SOCCER_PENALTY_MARK) * SCALE,
        name: "penaltyCircle2",
        alpha: 0.5
	});
	
	var goalBox1 = new Kinetic.Rect({
		width: SOCCER_GOAL_BOX_WIDTH * SCALE,
		height: SOCCER_GOAL_BOX_HEIGHT * SCALE,
		stroke: "white",
		strokeWidth: 1,
		x: (SOCCER_WIDTH - SOCCER_GOAL_BOX_WIDTH) / 2 * SCALE,
		y: 0,
		name: "goalBox1"
	});
	
	var goalBox2 = new Kinetic.Rect({
		width: SOCCER_GOAL_BOX_WIDTH * SCALE,
		height: SOCCER_GOAL_BOX_HEIGHT * SCALE,
		stroke: "white",
		strokeWidth: 1,
		x: (SOCCER_WIDTH - SOCCER_GOAL_BOX_WIDTH) / 2 * SCALE,
		y: (SOCCER_HEIGHT - SOCCER_GOAL_BOX_HEIGHT) * SCALE,
		name: "goalBox1"
	});
	
	var midfieldLine = new Kinetic.Line({
		points: [0, 0, SOCCER_WIDTH * SCALE, 0],
		stroke: "white",
		strokeWidth: 1,
		x: 0,
		y: SOCCER_HEIGHT / 2 * SCALE,
		name: "midfieldLine"
	});
	
	var centerCircle = new Kinetic.Ellipse({
		radius: SOCCER_CIRCLE_RADIUS * SCALE,
		stroke: "white",
		strokeWidth: 2,
		x: SOCCER_WIDTH / 2 * SCALE,
		y: SOCCER_HEIGHT / 2 * SCALE,
		name: "centerCircle",
		alpha: 0.5
	});
	
	fieldLayer.add(field);
	fieldLayer.add(penaltyBox1);
	fieldLayer.add(penaltyBox2);
	fieldLayer.add(penaltyMark1);
	fieldLayer.add(penaltyMark2);
	fieldLayer.add(penaltyCircle1);
	fieldLayer.add(penaltyCircle2);
	fieldLayer.add(goalBox1);
	fieldLayer.add(goalBox2);
	fieldLayer.add(midfieldLine);
	fieldLayer.add(centerCircle);
	
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

function soccerFieldHalf(startX, startY) {
	var fieldLayer = new Kinetic.Layer({
		x: startX ? startX : START_X,
		y: startY ? startY : START_Y,
		name: "fieldLayer",
		draggable: true,
		dragConstraint: "vertical",
		dragBounds: {
			top: -300,
			bottom: 100
		}
	});
	
	var field = new Kinetic.Rect({
		width: SOCCER_WIDTH * SCALE,
		height: SOCCER_HEIGHT / 2 * SCALE,
		fill: "green",
		stroke: "black",
		strokeWidth: 1,
		x: 0,
		y: 0,
		name: "playingField"
	});
	
	var penaltyBox1 = new Kinetic.Rect({
		width: SOCCER_PENALTY_WIDTH * SCALE,
		height: SOCCER_PENALTY_HEIGHT * SCALE,
		stroke: "white",
		strokeWidth: 1,
		x: (SOCCER_WIDTH - SOCCER_PENALTY_WIDTH) / 2 * SCALE,
		y: 0,
		name: "penaltyBox1"
	});

	var penaltyMark1 = new Kinetic.Ellipse({
		radius: 0.25 * SCALE,
		fill: "white",
		x: SOCCER_WIDTH / 2 * SCALE,
		y: SOCCER_PENALTY_MARK * SCALE,
		name: "penaltyMark1",
		alpha: 0.5
	});
	
	var penaltyCircle1 = new Kinetic.Shape({
		drawFunc: function(context) {
			context.beginPath();
			var startRad = Math.asin((SOCCER_PENALTY_HEIGHT - SOCCER_PENALTY_MARK) / SOCCER_CIRCLE_RADIUS);
			var endRad = Math.PI - startRad;
			context.arc(0, 0, SOCCER_CIRCLE_RADIUS * SCALE, startRad, endRad);
            this.stroke(context);
		},
		stroke: "white",
        strokeWidth: 2,
        x: SOCCER_WIDTH / 2 * SCALE,
        y: SOCCER_PENALTY_MARK * SCALE,
        name: "penaltyCircle1",
        alpha: 0.5
	});
	
	var goalBox1 = new Kinetic.Rect({
		width: SOCCER_GOAL_BOX_WIDTH * SCALE,
		height: SOCCER_GOAL_BOX_HEIGHT * SCALE,
		stroke: "white",
		strokeWidth: 1,
		x: (SOCCER_WIDTH - SOCCER_GOAL_BOX_WIDTH) / 2 * SCALE,
		y: 0,
		name: "goalBox1"
	});
	
	var centerCircle = new Kinetic.Ellipse({
		radius: SOCCER_CIRCLE_RADIUS * SCALE,
		stroke: "white",
		strokeWidth: 2,
		x: SOCCER_WIDTH / 2 * SCALE,
		y: SOCCER_HEIGHT / 2 * SCALE,
		name: "centerCircle",
		alpha: 0.5
	});
	
	fieldLayer.add(field);
	fieldLayer.add(penaltyBox1);
	fieldLayer.add(penaltyMark1);
	fieldLayer.add(penaltyCircle1);
	fieldLayer.add(goalBox1);
	fieldLayer.add(centerCircle);
	
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

function footballField(size, startX, startY) {
	if (size === "full") return footballFieldFull(startX, startY);
	else if (size === "half") return footballFieldHalf(startX, startY);
}

function footballFieldFull(startX, startY) {
	var fieldLayer = new Kinetic.Layer({
		x: startX ? startX : START_X,
		y: startY ? startY : START_Y,
		name: "fieldLayer",
		draggable: true,
		dragConstraint: "vertical",
		dragBounds: {
			top: -300,
			bottom: 100
		}
	});
	
	var field = new Kinetic.Rect({
		width: FOOTBALL_WIDTH * SCALE,
		height: FOOTBALL_HEIGHT * SCALE,
		fill: "green",
		stroke: "black",
		strokeWidth: 1,
		x: 0,
		y: 0,
		name: "playingField"
	});
	
	var endLine1 = new Kinetic.Line({
		points: [0, 0, FOOTBALL_WIDTH * SCALE, 0],
		stroke: "white",
		strokeWidth: 1,
		x: 0,
		y: FOOTBALL_ENDZONE * SCALE,
		name: "endLine1"
	});
	
	var endLine2 = new Kinetic.Line({
		points: [0, 0, FOOTBALL_WIDTH * SCALE, 0],
		stroke: "white",
		strokeWidth: 1,
		x: 0,
		y: (FOOTBALL_HEIGHT - FOOTBALL_ENDZONE) * SCALE,
		name: "endLine2"
	});
	
	fieldLayer.add(field);
	fieldLayer.add(endLine1);
	fieldLayer.add(endLine2);
	
	for (var i = 1; i < 100; i++) {
		if (i % 5 == 0) {
			var line = new Kinetic.Line({
				points: [0, 0, FOOTBALL_WIDTH * SCALE, 0],
				stroke: "white",
				strokeWidth: 1,
				x: 0,
				y: (FOOTBALL_ENDZONE + i) * SCALE,
				name: "line" + i
			});
			
			fieldLayer.add(line);
			
			if (i % 10 == 0) {
				// draw numbers
				var num1 = new Kinetic.Text({
					text: ("" + (50 - Math.abs(i - 50))).split('').join(' '),
					fontSize: FOOTBALL_NUMBERS_HEIGHT * SCALE,
					fontFamily: "Arial",
					textFill: "white",
					//align: "center",
					x: FOOTBALL_NUMBERS * SCALE,
					y: (FOOTBALL_ENDZONE + i) * SCALE,
					alpha: 0.5,
					rotation: Math.PI / 2
				});
				
				num1.setOffset(num1.getTextWidth() / 2, num1.getTextHeight() / 2);
				
				var num2 = new Kinetic.Text({
					text: ("" + (50 - Math.abs(i - 50))).split('').join(' '),
					fontSize: FOOTBALL_NUMBERS_HEIGHT * SCALE,
					fontFamily: "Arial",
					textFill: "white",
					//align: "center",
					x: (FOOTBALL_WIDTH - FOOTBALL_NUMBERS) * SCALE,
					y: (FOOTBALL_ENDZONE + i) * SCALE,
					alpha: 0.5,
					rotation: -Math.PI / 2
				});
				
				num2.setOffset(num2.getTextWidth() / 2, num2.getTextHeight() / 2);
				
				fieldLayer.add(num1);
				fieldLayer.add(num2);
			}
		} else {
			//draw hashes
			var sideline1 = new Kinetic.Line({
				points: [0, 0, FOOTBALL_HASH_WIDTH * SCALE, 0],
				stroke: "white",
				strokeWidth: 1,
				x: 0,
				y: (FOOTBALL_ENDZONE + i) * SCALE,
				name: "sidelineLeft" + i
			});
			
			var sideline2 = new Kinetic.Line({
				points: [0, 0, FOOTBALL_HASH_WIDTH * SCALE, 0],
				stroke: "white",
				strokeWidth: 1,
				x: (FOOTBALL_WIDTH - FOOTBALL_HASH_WIDTH) * SCALE,
				y: (FOOTBALL_ENDZONE + i) * SCALE,
				name: "sidelineRight" + i
			});
			
			var hash1 = new Kinetic.Line({
				points: [0, 0, FOOTBALL_HASH_WIDTH * SCALE, 0],
				stroke: "white",
				strokeWidth: 1,
				x: FOOTBALL_HASH * SCALE,
				y: (FOOTBALL_ENDZONE + i) * SCALE,
				name: "hashLeft" + i
			});
			
			var hash2 = new Kinetic.Line({
				points: [0, 0, FOOTBALL_HASH_WIDTH * SCALE, 0],
				stroke: "white",
				strokeWidth: 1,
				x: (FOOTBALL_WIDTH - FOOTBALL_HASH - FOOTBALL_HASH_WIDTH) * SCALE,
				y: (FOOTBALL_ENDZONE + i) * SCALE,
				name: "hashRight" + i
			});
			
			fieldLayer.add(sideline1);
			fieldLayer.add(sideline2);
			fieldLayer.add(hash1);
			fieldLayer.add(hash2);
		}
	}
	
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

function footballFieldHalf(startX, startY) {
	var fieldLayer = new Kinetic.Layer({
		x: startX ? startX : START_X,
		y: startY ? startY : START_Y,
		name: "fieldLayer",
		draggable: true,
		dragConstraint: "vertical",
		dragBounds: {
			top: -300,
			bottom: 100
		}
	});
	
	var field = new Kinetic.Rect({
		width: FOOTBALL_WIDTH * SCALE,
		height: FOOTBALL_HEIGHT / 2 * SCALE,
		fill: "green",
		stroke: "black",
		strokeWidth: 1,
		x: 0,
		y: 0,
		name: "playingField"
	});
	
	var endLine1 = new Kinetic.Line({
		points: [0, 0, FOOTBALL_WIDTH * SCALE, 0],
		stroke: "white",
		strokeWidth: 1,
		x: 0,
		y: FOOTBALL_ENDZONE * SCALE,
		name: "endLine1"
	});
	
	fieldLayer.add(field);
	fieldLayer.add(endLine1);
	
	for (var i = 1; i <= 50; i++) {
		if (i % 5 == 0) {
			var line = new Kinetic.Line({
				points: [0, 0, FOOTBALL_WIDTH * SCALE, 0],
				stroke: "white",
				strokeWidth: 1,
				x: 0,
				y: (FOOTBALL_ENDZONE + i) * SCALE,
				name: "line" + i
			});
			
			fieldLayer.add(line);
			
			if (i % 10 == 0) {
				// draw numbers
				var num1 = new Kinetic.Text({
					text: ("" + (50 - Math.abs(i - 50))).split('').join(' '),
					fontSize: FOOTBALL_NUMBERS_HEIGHT * SCALE,
					fontFamily: "Arial",
					textFill: "white",
					//align: "center",
					x: FOOTBALL_NUMBERS * SCALE,
					y: (FOOTBALL_ENDZONE + i) * SCALE,
					alpha: 0.5,
					rotation: Math.PI / 2
				});
				
				num1.setOffset(num1.getTextWidth() / 2, num1.getTextHeight() / 2);
				
				var num2 = new Kinetic.Text({
					text: ("" + (50 - Math.abs(i - 50))).split('').join(' '),
					fontSize: FOOTBALL_NUMBERS_HEIGHT * SCALE,
					fontFamily: "Arial",
					textFill: "white",
					//align: "center",
					x: (FOOTBALL_WIDTH - FOOTBALL_NUMBERS) * SCALE,
					y: (FOOTBALL_ENDZONE + i) * SCALE,
					alpha: 0.5,
					rotation: -Math.PI / 2
				});
				
				num2.setOffset(num2.getTextWidth() / 2, num2.getTextHeight() / 2);
				
				fieldLayer.add(num1);
				fieldLayer.add(num2);
			}
		} else {
			//draw hashes
			var sideline1 = new Kinetic.Line({
				points: [0, 0, FOOTBALL_HASH_WIDTH * SCALE, 0],
				stroke: "white",
				strokeWidth: 1,
				x: 0,
				y: (FOOTBALL_ENDZONE + i) * SCALE,
				name: "sidelineLeft" + i
			});
			
			var sideline2 = new Kinetic.Line({
				points: [0, 0, FOOTBALL_HASH_WIDTH * SCALE, 0],
				stroke: "white",
				strokeWidth: 1,
				x: (FOOTBALL_WIDTH - FOOTBALL_HASH_WIDTH) * SCALE,
				y: (FOOTBALL_ENDZONE + i) * SCALE,
				name: "sidelineRight" + i
			});
			
			var hash1 = new Kinetic.Line({
				points: [0, 0, FOOTBALL_HASH_WIDTH * SCALE, 0],
				stroke: "white",
				strokeWidth: 1,
				x: FOOTBALL_HASH * SCALE,
				y: (FOOTBALL_ENDZONE + i) * SCALE,
				name: "hashLeft" + i
			});
			
			var hash2 = new Kinetic.Line({
				points: [0, 0, FOOTBALL_HASH_WIDTH * SCALE, 0],
				stroke: "white",
				strokeWidth: 1,
				x: (FOOTBALL_WIDTH - FOOTBALL_HASH - FOOTBALL_HASH_WIDTH) * SCALE,
				y: (FOOTBALL_ENDZONE + i) * SCALE,
				name: "hashRight" + i
			});
			
			fieldLayer.add(sideline1);
			fieldLayer.add(sideline2);
			fieldLayer.add(hash1);
			fieldLayer.add(hash2);
		}
	}
	
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

function createArrow(arrow) {
	var arrowGroup = new Kinetic.Group();

	var arrowLine = new Kinetic.Line({
			points: arrow.points,
			lineCap: "round",
			//dashArray: [20, 20],
			//fill: "black",
			stroke: "black",
			name: "arrowLine"
	});
	
	var arrowHead = new Kinetic.RegularPolygon({
		sides: 3,
		radius: 0.75 * SCALE,
		fill: "black",
		stroke: "black",
		strokeWidth: 1,
		x: arrow.points[2],
		y: arrow.points[3],
		name: "arrowHead",
		rotation: rotationAngle(arrow.points),
		draggable: true
	});
	
	arrowGroup.add(arrowLine);
	arrowGroup.add(arrowHead);
	
	return arrowGroup;
}

function rotationAngle(points) {
	var rad = Math.atan2(points[1] - points[3], points[2] - points[0]);
	return Math.PI / 2 - rad;
}