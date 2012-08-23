/* CONSTANTS */
var SCALE = 10;
var CANVAS_WIDTH = 800;
var CANVAS_HEIGHT = 600;
var START_X = 0;
var START_Y = 0;
var DRAG_TOP = -300;
var DRAG_BOTTOM = 50;

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

/* BASKETBALL CONSTANTS */
/* NOTE BASKETBALL USES FEET WHILE OTHER SPORTS USE YARDS */
var BASKETBALL_WIDTH = 50;
var BASKETBALL_HEIGHT = 94;
var BASKETBALL_KEY_WIDTH = 12;
var BASKETBALL_KEY_HEIGHT = 19;
var BASKETBALL_OUTER_KEY_WIDTH = 16;
var BASKETBALL_CIRCLE_RADIUS = 6;
var BASKETBALL_BACKBOARD_WIDTH = 6;
var BASKETBALL_BACKBOARD_OFFSET = 4;
var BASKETBALL_RIM_RADIUS = 9 / 12;
var BASKETBALL_RIM_OFFSET = 15 / 12;
var BASKETBALL_RESTRICTED_RADIUS = 4;
var BASKETBALL_BLOCK_WIDTH = 1 / 2;
var BASKETBALL_BLOCK_DISTANCE = 3;
var BASKETBALL_THREE_POINT_SIDE_LENGTH = 169 / 12;
var BASKETBALL_THREE_POINT_SIDE_DISTANCE = 22;
var BASKETBALL_THREE_POINT_RADIUS = 285 / 12;

/* Fields */

function ultimateField(size, startX, startY) {
	if (size === "full") return ultimateFieldFull(startX, startY);
	else if (size === "half") return ultimateFieldHalf(startX, startY);
	else if (size === "empty") return blankField(startX, startY);
}

function ultimateFieldFull(startX, startY) {
	var fieldLayer = createFieldLayer(startX, startY);
	
	var fieldGroup = new Kinetic.Group({
		x: (CANVAS_WIDTH - ULTIMATE_WIDTH * SCALE) / 2,
		y: 0,
		name: "fieldGroup"
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
	
	fieldGroup.add(field);
	fieldGroup.add(endLine1);
	fieldGroup.add(endLine2);
	fieldGroup.add(brick1);
	fieldGroup.add(brick2);
	
	fieldLayer.add(blankBackground(CANVAS_WIDTH, ULTIMATE_HEIGHT * SCALE));
	fieldLayer.add(fieldGroup);
	
	return fieldLayer;
}

function ultimateFieldHalf(startX, startY) {
	var fieldLayer = createFieldLayer(startX, startY);
	
	var fieldGroup = new Kinetic.Group({
		x: (CANVAS_WIDTH - ULTIMATE_WIDTH * SCALE) / 2,
		y: 0,
		name: "fieldGroup"
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
	
	fieldGroup.add(field);
	fieldGroup.add(endLine1);
	fieldGroup.add(brick1);
	
	fieldLayer.add(blankBackground(CANVAS_WIDTH, ULTIMATE_HEIGHT / 2 * SCALE));
	fieldLayer.add(fieldGroup);
	
	return fieldLayer;
}

function soccerField(size, startX, startY) {
	if (size === "full") return soccerFieldFull(startX, startY);
	else if (size === "half") return soccerFieldHalf(startX, startY);
	else if (size === "empty") return blankField(startX, startY);
}

function soccerFieldFull(startX, startY) {
	var fieldLayer = createFieldLayer(startX, startY);
	
	var fieldGroup = new Kinetic.Group({
		x: (CANVAS_WIDTH - SOCCER_WIDTH * SCALE) / 2,
		y: 0,
		name: "fieldGroup"
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
	
	var penaltyMark1 = new Kinetic.Circle({
		radius: 0.25 * SCALE,
		fill: "white",
		x: SOCCER_WIDTH / 2 * SCALE,
		y: SOCCER_PENALTY_MARK * SCALE,
		name: "penaltyMark1",
		alpha: 0.5
	});
	
	var penaltyMark2 = new Kinetic.Circle({
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
	
	var centerCircle = new Kinetic.Circle({
		radius: SOCCER_CIRCLE_RADIUS * SCALE,
		stroke: "white",
		strokeWidth: 2,
		x: SOCCER_WIDTH / 2 * SCALE,
		y: SOCCER_HEIGHT / 2 * SCALE,
		name: "centerCircle",
		alpha: 0.5
	});
	
	fieldGroup.add(field);
	fieldGroup.add(penaltyBox1);
	fieldGroup.add(penaltyBox2);
	fieldGroup.add(penaltyMark1);
	fieldGroup.add(penaltyMark2);
	fieldGroup.add(penaltyCircle1);
	fieldGroup.add(penaltyCircle2);
	fieldGroup.add(goalBox1);
	fieldGroup.add(goalBox2);
	fieldGroup.add(midfieldLine);
	fieldGroup.add(centerCircle);
	
	fieldLayer.add(blankBackground(CANVAS_WIDTH, SOCCER_HEIGHT / 2 * SCALE));
	fieldLayer.add(fieldGroup);
	
	return fieldLayer;
}

function soccerFieldHalf(startX, startY) {
	var fieldLayer = createFieldLayer(startX, startY);
	
	var fieldGroup = new Kinetic.Group({
		x: (CANVAS_WIDTH - SOCCER_WIDTH * SCALE) / 2,
		y: 0,
		name: "fieldGroup"
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

	var penaltyMark1 = new Kinetic.Circle({
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
	
	var centerCircle = new Kinetic.Circle({
		radius: SOCCER_CIRCLE_RADIUS * SCALE,
		stroke: "white",
		strokeWidth: 2,
		x: SOCCER_WIDTH / 2 * SCALE,
		y: SOCCER_HEIGHT / 2 * SCALE,
		name: "centerCircle",
		alpha: 0.5
	});
	
	fieldGroup.add(field);
	fieldGroup.add(penaltyBox1);
	fieldGroup.add(penaltyMark1);
	fieldGroup.add(penaltyCircle1);
	fieldGroup.add(goalBox1);
	fieldGroup.add(centerCircle);
	
	fieldLayer.add(blankBackground(CANVAS_WIDTH, SOCCER_HEIGHT / 2 * SCALE));
	fieldLayer.add(fieldGroup);
	
	return fieldLayer;
}

function footballField(size, startX, startY) {
	if (size === "full") return footballFieldFull(startX, startY);
	else if (size === "half") return footballFieldHalf(startX, startY);
	else if (size === "empty") return blankField(startX, startY);
}

function footballFieldFull(startX, startY) {
	var fieldLayer = createFieldLayer(startX, startY);
	
	var fieldGroup = new Kinetic.Group({
		x: (CANVAS_WIDTH - FOOTBALL_WIDTH * SCALE) / 2,
		y: 0,
		name: "fieldGroup"
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
	
	fieldGroup.add(field);
	fieldGroup.add(endLine1);
	fieldGroup.add(endLine2);
	
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
			
			fieldGroup.add(line);
			
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
				
				fieldGroup.add(num1);
				fieldGroup.add(num2);
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
			
			fieldGroup.add(sideline1);
			fieldGroup.add(sideline2);
			fieldGroup.add(hash1);
			fieldGroup.add(hash2);
		}
	}
	
	fieldLayer.add(blankBackground(CANVAS_WIDTH, FOOTBALL_HEIGHT / 2 * SCALE));
	fieldLayer.add(fieldGroup);
	
	return fieldLayer;
}

function footballFieldHalf(startX, startY) {
	var fieldLayer = createFieldLayer(startX, startY);
	
	var fieldGroup = new Kinetic.Group({
		x: (CANVAS_WIDTH - FOOTBALL_WIDTH * SCALE) / 2,
		y: 0,
		name: "fieldGroup"
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
	
	fieldGroup.add(field);
	fieldGroup.add(endLine1);
	
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
			
			fieldGroup.add(line);
			
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
				
				fieldGroup.add(num1);
				fieldGroup.add(num2);
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
			
			fieldGroup.add(sideline1);
			fieldGroup.add(sideline2);
			fieldGroup.add(hash1);
			fieldGroup.add(hash2);
		}
	}
	
	fieldLayer.add(blankBackground(CANVAS_WIDTH, FOOTBALL_HEIGHT / 2 * SCALE));
	fieldLayer.add(fieldGroup);
	
	return fieldLayer;
}

function basketballField(size, startX, startY) {
	if (size === "full") return basketballFieldFull(startX, startY);
	else if (size === "half") return basketballFieldHalf(startX, startY);
	else if (size === "empty") return blankField(startX, startY);
}

function basketballFieldFull(startX, startY) {
	var fieldLayer = createFieldLayer(startX, startY);
	
	var fieldGroup = new Kinetic.Group({
		x: (CANVAS_WIDTH - BASKETBALL_WIDTH * SCALE) / 2,
		y: 0,
		name: "fieldGroup"
	});
	
	var field = new Kinetic.Rect({
		width: BASKETBALL_WIDTH * SCALE,
		height: BASKETBALL_HEIGHT * SCALE,
		fill: "#E4B25B",
		stroke: "black",
		strokeWidth: 1,
		x: 0,
		y: 0,
		name: "playingField"
	});
	
	var key1 = new Kinetic.Rect({
		width: BASKETBALL_KEY_WIDTH * SCALE,
		height: BASKETBALL_KEY_HEIGHT * SCALE,
		stroke: "black",
		strokeWidth: 1,
		x: (BASKETBALL_WIDTH - BASKETBALL_KEY_WIDTH) / 2 * SCALE,
		y: 0,
		name: "key1"
	});
	
	var key2 = new Kinetic.Rect({
		width: BASKETBALL_KEY_WIDTH * SCALE,
		height: BASKETBALL_KEY_HEIGHT * SCALE,
		stroke: "black",
		strokeWidth: 1,
		x: (BASKETBALL_WIDTH - BASKETBALL_KEY_WIDTH) / 2 * SCALE,
		y: (BASKETBALL_HEIGHT - BASKETBALL_KEY_HEIGHT) * SCALE,
		name: "key2"
	});
	
	var outerKey1 = new Kinetic.Rect({
		width: BASKETBALL_OUTER_KEY_WIDTH * SCALE,
		height: BASKETBALL_KEY_HEIGHT * SCALE,
		stroke: "black",
		strokeWidth: 1,
		x: (BASKETBALL_WIDTH - BASKETBALL_OUTER_KEY_WIDTH) / 2 * SCALE,
		y: 0,
		name: "outerKey1"
	});
	
	var outerKey2 = new Kinetic.Rect({
		width: BASKETBALL_OUTER_KEY_WIDTH * SCALE,
		height: BASKETBALL_KEY_HEIGHT * SCALE,
		stroke: "black",
		strokeWidth: 1,
		x: (BASKETBALL_WIDTH - BASKETBALL_OUTER_KEY_WIDTH) / 2 * SCALE,
		y: (BASKETBALL_HEIGHT - BASKETBALL_KEY_HEIGHT) * SCALE,
		name: "outerKey2"
	});
	
	var keyCircle1 = new Kinetic.Shape({
		drawFunc: function(context) {
			context.beginPath();
			context.arc(0, 0, BASKETBALL_CIRCLE_RADIUS * SCALE, 0, Math.PI);
			var angle = Math.PI, increment = Math.PI / 20;
			while (angle < Math.PI * 2) {
				context.moveTo(BASKETBALL_CIRCLE_RADIUS * SCALE * Math.cos(angle), BASKETBALL_CIRCLE_RADIUS * SCALE * Math.sin(angle));
				context.arc(0, 0, BASKETBALL_CIRCLE_RADIUS * SCALE, angle, angle + increment);
				angle += 2 * increment;
			}
			this.stroke(context);
		},
		stroke: "black",
		strokeWidth: 1,
		x: BASKETBALL_WIDTH / 2 * SCALE,
		y: BASKETBALL_KEY_HEIGHT * SCALE,
		name: "keyCircle1"
	});
	
	var keyCircle2 = new Kinetic.Shape({
		drawFunc: function(context) {
			context.beginPath();
			context.arc(0, 0, BASKETBALL_CIRCLE_RADIUS * SCALE, Math.PI, 0);
			var angle = 0, increment = Math.PI / 20;
			while (angle < Math.PI) {
				context.moveTo(BASKETBALL_CIRCLE_RADIUS * SCALE * Math.cos(angle), BASKETBALL_CIRCLE_RADIUS * SCALE * Math.sin(angle));
				context.arc(0, 0, BASKETBALL_CIRCLE_RADIUS * SCALE, angle, angle + increment);
				angle += 2 * increment;
			}
			this.stroke(context);
		},
		stroke: "black",
		strokeWidth: 1,
		x: BASKETBALL_WIDTH / 2 * SCALE,
		y: (BASKETBALL_HEIGHT - BASKETBALL_KEY_HEIGHT) * SCALE,
		name: "keyCircle1"
	});
	
	var backboard1 = new Kinetic.Line({
		points: [0, 0, BASKETBALL_BACKBOARD_WIDTH * SCALE, 0],
		stroke: "black",
		strokeWidth: 1,
		x: (BASKETBALL_WIDTH - BASKETBALL_BACKBOARD_WIDTH) / 2 * SCALE,
		y: BASKETBALL_BACKBOARD_OFFSET * SCALE,
		name: "backboard1"
	});
	
	var backboard2 = new Kinetic.Line({
		points: [0, 0, BASKETBALL_BACKBOARD_WIDTH * SCALE, 0],
		stroke: "black",
		strokeWidth: 1,
		x: (BASKETBALL_WIDTH - BASKETBALL_BACKBOARD_WIDTH) / 2 * SCALE,
		y: (BASKETBALL_HEIGHT - BASKETBALL_BACKBOARD_OFFSET) * SCALE,
		name: "backboard2"
	});
	
	var rim1 = new Kinetic.Circle({
		radius: BASKETBALL_RIM_RADIUS * SCALE,
		stroke: "black",
		strokeWidth: 1,
		x: BASKETBALL_WIDTH / 2 * SCALE,
		y: (BASKETBALL_BACKBOARD_OFFSET + BASKETBALL_RIM_OFFSET) * SCALE,
		name: "rim1"
	});
	
	var rim2 = new Kinetic.Circle({
		radius: BASKETBALL_RIM_RADIUS * SCALE,
		stroke: "black",
		strokeWidth: 1,
		x: BASKETBALL_WIDTH / 2 * SCALE,
		y: (BASKETBALL_HEIGHT - BASKETBALL_BACKBOARD_OFFSET - BASKETBALL_RIM_OFFSET) * SCALE,
		name: "rim2"
	});
	
	var angle = Math.acos((2 * Math.pow(BASKETBALL_THREE_POINT_RADIUS, 2) - Math.pow(2 * BASKETBALL_THREE_POINT_SIDE_DISTANCE, 2)) / (2 * Math.pow(BASKETBALL_THREE_POINT_RADIUS, 2))) / 2;
	
	var restricted1 = new Kinetic.Shape({
		drawFunc: function(context) {
			context.beginPath();
			context.arc(0, 0, BASKETBALL_RESTRICTED_RADIUS * SCALE, Math.PI / 2 - angle, Math.PI / 2 + angle);
			this.stroke(context);
		},
		stroke: "black",
		strokeWidth: 1,
		x: BASKETBALL_WIDTH / 2 * SCALE,
		y: (BASKETBALL_BACKBOARD_OFFSET + BASKETBALL_RIM_OFFSET) * SCALE,
		name: "restricted1"
	});
	
	var restricted2 = new Kinetic.Shape({
		drawFunc: function(context) {
			context.beginPath();
			context.arc(0, 0, BASKETBALL_RESTRICTED_RADIUS * SCALE, Math.PI * 3/ 2 - angle, Math.PI * 3 / 2 + angle);
			this.stroke(context);
		},
		stroke: "black",
		strokeWidth: 1,
		x: BASKETBALL_WIDTH / 2 * SCALE,
		y: (BASKETBALL_HEIGHT - BASKETBALL_BACKBOARD_OFFSET - BASKETBALL_RIM_OFFSET) * SCALE,
		name: "restricted2"
	});
	
	var blocks1 = new Kinetic.Group({
		x: BASKETBALL_WIDTH / 2 * SCALE,
		y: BASKETBALL_BACKBOARD_OFFSET * SCALE,
		name: "blocks1"
	});
	
	var blocks2 = new Kinetic.Group({
		x: BASKETBALL_WIDTH / 2 * SCALE,
		y: (BASKETBALL_HEIGHT - BASKETBALL_BACKBOARD_OFFSET) * SCALE,
		name: "blocks2"
	});
	
	for (var i = 1; i <= 4; i++) {
			//draw hashes
			var leftBlock1 = new Kinetic.Line({
				points: [0, 0, BASKETBALL_BLOCK_WIDTH * SCALE, 0],
				fill: "black",
				stroke: "black",
				strokeWidth: 1,
				x: (-BASKETBALL_OUTER_KEY_WIDTH / 2 - BASKETBALL_BLOCK_WIDTH) * SCALE,
				y: i == 1 ? BASKETBALL_BLOCK_DISTANCE * SCALE : (BASKETBALL_BLOCK_DISTANCE * i - 2) * SCALE,
			});
			
			var leftBlock2 = new Kinetic.Line({
				points: [0, 0, BASKETBALL_BLOCK_WIDTH * SCALE, 0],
				fill: "black",
				stroke: "black",
				strokeWidth: 1,
				x: (-BASKETBALL_OUTER_KEY_WIDTH / 2 - BASKETBALL_BLOCK_WIDTH) * SCALE,
				y: i == 1 ? -BASKETBALL_BLOCK_DISTANCE * SCALE : -(BASKETBALL_BLOCK_DISTANCE * i - 2) * SCALE,
			});
			
			var rightBlock1 = new Kinetic.Line({
				points: [0, 0, BASKETBALL_BLOCK_WIDTH * SCALE, 0],
				fill: "black",
				stroke: "black",
				strokeWidth: 1,
				x: (BASKETBALL_OUTER_KEY_WIDTH / 2) * SCALE,
				y: i == 1 ? BASKETBALL_BLOCK_DISTANCE * SCALE : (BASKETBALL_BLOCK_DISTANCE * i - 2) * SCALE,
			});
			
			var rightBlock2 = new Kinetic.Line({
				points: [0, 0, BASKETBALL_BLOCK_WIDTH * SCALE, 0],
				fill: "black",
				stroke: "black",
				strokeWidth: 1,
				x: (BASKETBALL_OUTER_KEY_WIDTH / 2) * SCALE,
				y: i == 1 ? -BASKETBALL_BLOCK_DISTANCE * SCALE : -(BASKETBALL_BLOCK_DISTANCE * i - 2) * SCALE,
			});
			
			blocks1.add(leftBlock1);
			blocks1.add(rightBlock1);
			blocks2.add(leftBlock2);
			blocks2.add(rightBlock2);
	}
	
	var threePointLine1 = new Kinetic.Shape({
		drawFunc: function(context) {
			context.beginPath();
			context.moveTo(BASKETBALL_THREE_POINT_SIDE_DISTANCE * SCALE, 0);
			context.lineTo(BASKETBALL_THREE_POINT_SIDE_DISTANCE * SCALE, BASKETBALL_THREE_POINT_SIDE_LENGTH * SCALE);
			context.arc(0, (BASKETBALL_BACKBOARD_OFFSET + BASKETBALL_RIM_OFFSET) * SCALE, BASKETBALL_THREE_POINT_RADIUS * SCALE, Math.PI / 2 - angle, Math.PI / 2 + angle);
			context.lineTo(-BASKETBALL_THREE_POINT_SIDE_DISTANCE * SCALE, 0);
			this.stroke(context);
		},
		stroke: "black",
		strokeWidth: 1,
		x: BASKETBALL_WIDTH / 2 * SCALE,
		y: 0,
		name: "threePointLine1"
	});
	
	var threePointLine2 = new Kinetic.Shape({
		drawFunc: function(context) {
			context.beginPath();
			context.moveTo(-BASKETBALL_THREE_POINT_SIDE_DISTANCE * SCALE, 0);
			context.lineTo(-BASKETBALL_THREE_POINT_SIDE_DISTANCE * SCALE, -BASKETBALL_THREE_POINT_SIDE_LENGTH * SCALE);
			context.arc(0, -(BASKETBALL_BACKBOARD_OFFSET + BASKETBALL_RIM_OFFSET) * SCALE, BASKETBALL_THREE_POINT_RADIUS * SCALE, Math.PI * 3 / 2 - angle, Math.PI * 3 / 2 + angle);
			context.lineTo(BASKETBALL_THREE_POINT_SIDE_DISTANCE * SCALE, 0);
			this.stroke(context);
		},
		stroke: "black",
		strokeWidth: 1,
		x: BASKETBALL_WIDTH / 2 * SCALE,
		y: BASKETBALL_HEIGHT * SCALE,
		name: "threePointLine2"
	});
	
	var midcourtLine = new Kinetic.Line({
		points: [0, 0, BASKETBALL_WIDTH * SCALE, 0],
		stroke: "black",
		strokeWidth: 1,
		x: 0,
		y: BASKETBALL_HEIGHT / 2 * SCALE,
		name: "midcourtLine"
	});
	
	var midcourtCircle = new Kinetic.Circle({
		radius: BASKETBALL_CIRCLE_RADIUS * SCALE,
		stroke: "black",
		strokeWidth: 1,
		x: BASKETBALL_WIDTH / 2 * SCALE,
		y: BASKETBALL_HEIGHT / 2 * SCALE,
		name: "midcourtCircle"
	});
	
	fieldGroup.add(field);
	fieldGroup.add(key1);
	fieldGroup.add(key2);
	fieldGroup.add(outerKey1);
	fieldGroup.add(outerKey2);
	fieldGroup.add(keyCircle1);
	fieldGroup.add(keyCircle2);
	fieldGroup.add(backboard1);
	fieldGroup.add(backboard2);
	fieldGroup.add(rim1);
	fieldGroup.add(rim2);
	fieldGroup.add(restricted1);
	fieldGroup.add(restricted2);
	fieldGroup.add(blocks1);
	fieldGroup.add(blocks2);
	fieldGroup.add(threePointLine1);
	fieldGroup.add(threePointLine2);
	fieldGroup.add(midcourtLine);
	fieldGroup.add(midcourtCircle);
	
	fieldLayer.add(blankBackground(CANVAS_WIDTH, BASKETBALL_HEIGHT / 2 * SCALE));
	fieldLayer.add(fieldGroup);
	
	return fieldLayer;
}

function basketballFieldHalf(startX, startY) {
	var fieldLayer = createFieldLayer(startX, startY);
	
	var fieldGroup = new Kinetic.Group({
		x: (CANVAS_WIDTH - BASKETBALL_WIDTH * SCALE) / 2,
		y: 0,
		name: "fieldGroup"
	});
	
	var field = new Kinetic.Rect({
		width: BASKETBALL_WIDTH * SCALE,
		height: BASKETBALL_HEIGHT / 2 * SCALE,
		fill: "#E4B25B",
		stroke: "black",
		strokeWidth: 1,
		x: 0,
		y: 0,
		name: "playingField"
	});
	
	var key1 = new Kinetic.Rect({
		width: BASKETBALL_KEY_WIDTH * SCALE,
		height: BASKETBALL_KEY_HEIGHT * SCALE,
		stroke: "black",
		strokeWidth: 1,
		x: (BASKETBALL_WIDTH - BASKETBALL_KEY_WIDTH) / 2 * SCALE,
		y: 0,
		name: "key1"
	});
	
	var outerKey1 = new Kinetic.Rect({
		width: BASKETBALL_OUTER_KEY_WIDTH * SCALE,
		height: BASKETBALL_KEY_HEIGHT * SCALE,
		stroke: "black",
		strokeWidth: 1,
		x: (BASKETBALL_WIDTH - BASKETBALL_OUTER_KEY_WIDTH) / 2 * SCALE,
		y: 0,
		name: "outerKey1"
	});
	
	var keyCircle1 = new Kinetic.Shape({
		drawFunc: function(context) {
			context.beginPath();
			context.arc(0, 0, BASKETBALL_CIRCLE_RADIUS * SCALE, 0, Math.PI);
			var angle = Math.PI, increment = Math.PI / 20;
			while (angle < Math.PI * 2) {
				context.moveTo(BASKETBALL_CIRCLE_RADIUS * SCALE * Math.cos(angle), BASKETBALL_CIRCLE_RADIUS * SCALE * Math.sin(angle));
				context.arc(0, 0, BASKETBALL_CIRCLE_RADIUS * SCALE, angle, angle + increment);
				angle += 2 * increment;
			}
			this.stroke(context);
		},
		stroke: "black",
		strokeWidth: 1,
		x: BASKETBALL_WIDTH / 2 * SCALE,
		y: BASKETBALL_KEY_HEIGHT * SCALE,
		name: "keyCircle1"
	});
	
	var backboard1 = new Kinetic.Line({
		points: [0, 0, BASKETBALL_BACKBOARD_WIDTH * SCALE, 0],
		stroke: "black",
		strokeWidth: 1,
		x: (BASKETBALL_WIDTH - BASKETBALL_BACKBOARD_WIDTH) / 2 * SCALE,
		y: BASKETBALL_BACKBOARD_OFFSET * SCALE,
		name: "backboard1"
	});
	
	var rim1 = new Kinetic.Circle({
		radius: BASKETBALL_RIM_RADIUS * SCALE,
		stroke: "black",
		strokeWidth: 1,
		x: BASKETBALL_WIDTH / 2 * SCALE,
		y: (BASKETBALL_BACKBOARD_OFFSET + BASKETBALL_RIM_OFFSET) * SCALE,
		name: "rim1"
	});
	
	var angle = Math.acos((2 * Math.pow(BASKETBALL_THREE_POINT_RADIUS, 2) - Math.pow(2 * BASKETBALL_THREE_POINT_SIDE_DISTANCE, 2)) / (2 * Math.pow(BASKETBALL_THREE_POINT_RADIUS, 2))) / 2;
	
	var restricted1 = new Kinetic.Shape({
		drawFunc: function(context) {
			context.beginPath();
			context.arc(0, 0, BASKETBALL_RESTRICTED_RADIUS * SCALE, Math.PI / 2 - angle, Math.PI / 2 + angle);
			this.stroke(context);
		},
		stroke: "black",
		strokeWidth: 1,
		x: BASKETBALL_WIDTH / 2 * SCALE,
		y: (BASKETBALL_BACKBOARD_OFFSET + BASKETBALL_RIM_OFFSET) * SCALE,
		name: "restricted1"
	});
	
	var blocks1 = new Kinetic.Group({
		x: BASKETBALL_WIDTH / 2 * SCALE,
		y: BASKETBALL_BACKBOARD_OFFSET * SCALE,
		name: "blocks1"
	});
	
	for (var i = 1; i <= 4; i++) {
			//draw hashes
			var leftBlock1 = new Kinetic.Line({
				points: [0, 0, BASKETBALL_BLOCK_WIDTH * SCALE, 0],
				fill: "black",
				stroke: "black",
				strokeWidth: 1,
				x: (-BASKETBALL_OUTER_KEY_WIDTH / 2 - BASKETBALL_BLOCK_WIDTH) * SCALE,
				y: i == 1 ? BASKETBALL_BLOCK_DISTANCE * SCALE : (BASKETBALL_BLOCK_DISTANCE * i - 2) * SCALE,
			});
			
			var rightBlock1 = new Kinetic.Line({
				points: [0, 0, BASKETBALL_BLOCK_WIDTH * SCALE, 0],
				fill: "black",
				stroke: "black",
				strokeWidth: 1,
				x: (BASKETBALL_OUTER_KEY_WIDTH / 2) * SCALE,
				y: i == 1 ? BASKETBALL_BLOCK_DISTANCE * SCALE : (BASKETBALL_BLOCK_DISTANCE * i - 2) * SCALE,
			});
			
			blocks1.add(leftBlock1);
			blocks1.add(rightBlock1);
	}
	
	var threePointLine1 = new Kinetic.Shape({
		drawFunc: function(context) {
			context.beginPath();
			context.moveTo(BASKETBALL_THREE_POINT_SIDE_DISTANCE * SCALE, 0);
			context.lineTo(BASKETBALL_THREE_POINT_SIDE_DISTANCE * SCALE, BASKETBALL_THREE_POINT_SIDE_LENGTH * SCALE);
			context.arc(0, (BASKETBALL_BACKBOARD_OFFSET + BASKETBALL_RIM_OFFSET) * SCALE, BASKETBALL_THREE_POINT_RADIUS * SCALE, Math.PI / 2 - angle, Math.PI / 2 + angle);
			context.lineTo(-BASKETBALL_THREE_POINT_SIDE_DISTANCE * SCALE, 0);
			this.stroke(context);
		},
		stroke: "black",
		strokeWidth: 1,
		x: BASKETBALL_WIDTH / 2 * SCALE,
		y: 0,
		name: "threePointLine1"
	});
	
	var midcourtLine = new Kinetic.Line({
		points: [0, 0, BASKETBALL_WIDTH * SCALE, 0],
		stroke: "black",
		strokeWidth: 1,
		x: 0,
		y: BASKETBALL_HEIGHT / 2 * SCALE,
		name: "midcourtLine"
	});
	
	var midcourtCircle = new Kinetic.Shape({
		drawFunc: function(context) {
			context.beginPath();
			context.arc(0, 0, BASKETBALL_CIRCLE_RADIUS * SCALE, 0, Math.PI, true);
			this.stroke(context);
		},
		stroke: "black",
		strokeWidth: 1,
		x: BASKETBALL_WIDTH / 2 * SCALE,
		y: BASKETBALL_HEIGHT / 2 * SCALE,
		name: "midcourtCircle"
	});
	
	fieldGroup.add(field);
	fieldGroup.add(key1);
	fieldGroup.add(outerKey1);
	fieldGroup.add(keyCircle1);
	fieldGroup.add(backboard1);
	fieldGroup.add(rim1);
	fieldGroup.add(restricted1);
	fieldGroup.add(blocks1);
	fieldGroup.add(threePointLine1);
	fieldGroup.add(midcourtCircle);
	
	fieldLayer.add(blankBackground(CANVAS_WIDTH, BASKETBALL_HEIGHT / 2 * SCALE));
	fieldLayer.add(fieldGroup);
	
	return fieldLayer;
}

function blankField(startX, startY) {
	var fieldLayer = createFieldLayer(startX, startY);
	
	fieldLayer.add(blankBackground());
	
	return fieldLayer;
}

function createFieldLayer(startX, startY) {
	return new Kinetic.Layer({
		x: startX != null ? startX : START_X,
		y: startY != null ? startY : START_Y,
		name: "fieldLayer",
		draggable: true,
		dragConstraint: "vertical",
		dragBounds: {
			top: DRAG_TOP,
			bottom: DRAG_BOTTOM
		}
	});
}

function blankBackground(width, height) {
	return new Kinetic.Rect({
		width: width >= CANVAS_WIDTH ? width : CANVAS_WIDTH,
		height: height >= CANVAS_HEIGHT ? height : CANVAS_HEIGHT,
		fill: "white",
		//stroke: "black",
		//strokeWidth: 1,
		x: 0,
		y: 0,
		name: "blankBackground"
	});
}

/* Articles */

function createArticle(item) {
	var group = new Kinetic.Group({
		x: item.x,
		y: item.y,
		draggable: true
	});
	
	group.add(createArticleShape(item));
	
	if (item.label)
		group.add(createLabel(item));
	
	group.add(createSelect(item));
	
	return group;
}

function createArticleShape(item) {
	if (item.shape === "circle") {
		return new Kinetic.Circle({
			radius: 1.5 * SCALE,
			fill: item.color,
			stroke: "black",
			strokeWidth: 1,
			draggable: true
		});
	} else if (item.shape === "square") {
		return new Kinetic.Rect({
			width: 3 * SCALE,
			height: 3 * SCALE,
			fill: item.color,
			stroke: "black",
			strokeWidth: 1,
			draggable: true,
			offset: {
				x: 1.5 * SCALE,
				y: 1.5 * SCALE
			}
		});
	} else if (item.shape === "triangle") {
		return new Kinetic.RegularPolygon({
			sides: 3,
			radius: 3 / Math.sqrt(3) * SCALE,
			fill: item.color,
			stroke: "black",
			strokeWidth: 1,
			offset: {
				y: -0.4 * SCALE
			},
			draggable: true,
			
		});
	} else if (item.shape === "x") {
		return new Kinetic.Shape({
			drawFunc: function(context) {
				context.beginPath();
				context.moveTo(-1.4 * SCALE, -1.4 * SCALE);
				context.lineTo(1.4 * SCALE, 1.4 * SCALE);
				context.moveTo(-1.4 * SCALE, 1.4 * SCALE);
				context.lineTo(1.4 * SCALE, -1.4 * SCALE);
				context.closePath();
				this.fill(context);
				this.stroke(context);
			},
			//fill: item.color,
			stroke: item.color,
			strokeWidth: 5,
			draggable: true,
		});
	}
}

function createLabel(label) {
	// Use custom shape to draw text, Kinetic.Text too limited options
	var shrink = label.label && label.label.length === 3;
	return new Kinetic.Shape({
		drawFunc: function(context) {
			context.beginPath();
			context.closePath(); 			
 			context.fillStyle = "black";
 			context.font = shrink ? "10px Arial" : "15px Arial";
 			context.textAlign = "center";
 			context.textBaseline = "middle";
 			context.fillText(label.label, 0, 0);
		},
		offset: {
			y: label.shape === "triangle" ? -0.4 * SCALE : 0
		},
		draggable: true
	});
}

function createSelect(select) {
	var selectGroup = new Kinetic.Group({
		visible: select.select,
		name: "select"
	});
	
	for (var i = -1; i <= 1; i+=2) {
		for (var j = -1; j <= 1; j+=2) {
			var corner = new Kinetic.Rect({
				width: 4,
				height: 4,
				fill: "#E4F084",
// 				fill: "#3BBFCE",
				x: i * 1.5 * SCALE,
				y: j * 1.5 * SCALE,
				offset: {
					x: 2,
					y: 2
				}
			});
			selectGroup.add(corner);
		}
	}
	
	var box = new Kinetic.Rect({
		width: 3 * SCALE,
		height: 3 * SCALE,
		stroke: "#E4F084",
// 		stroke: "#3BBFCE",
		strokeWidth: 1,
		offset: {
			x: 1.5 * SCALE,
			y: 1.5 * SCALE
		}
	});
	
	selectGroup.add(box);
	
	return selectGroup;
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

function createAnnotation(annotation) {
	var annotationGroup = new Kinetic.Group({
		x: annotation.x,
		y: annotation.y,
		draggable: true
	});
	
	var annotationBox = new Kinetic.Rect({
		width: (annotation.width + 1) * SCALE,
		height: (annotation.height + 1) * SCALE,
		fill: "white",
		name: "annotationBox",
		alpha: 0.1,
	});
	
	var annotationText = new Kinetic.Text({
		text: annotation.text,
		//fontSize: 12,
		fontFamily: "Helvetica",
		textFill: "black",
		//textStrokeWidth: 1,
		width: annotation.width * SCALE,
		height: annotation.height * SCALE,
		//lineHeight: 1.2,
		name: "annotationText",
		offset: {
			x: -0.5 * SCALE,
			y: -0.5 * SCALE
		}
	});
	
	var annotationX = createX({
		x: annotation.width + 1,
		y: 0,
		hover: false
	});
	
	var annotationXHover = createX({
		x: annotation.width + 1,
		y: 0,
		hover: true
	});
	
	annotationGroup.add(annotationBox);
	annotationGroup.add(annotationText);
	annotationGroup.add(annotationX);
	annotationGroup.add(annotationXHover);
	
	return annotationGroup;
}

function createX(cross) {
	var xGroup = new Kinetic.Group({
        x: cross.x * SCALE,
        y: cross.y * SCALE,
		visible: false,
		name: cross.hover ? "annotationXHover" : "annotationX"
	});
	
	var xCircle = new Kinetic.Circle({
		radius: Math.sqrt(2) / 2 * SCALE,
 		//fill: cross.hover ? "white" : "#585858",
 		fill: cross.hover ? "#585858" : "white",
 		//stroke: cross.hover ? "#333" : "#CCC",
 		stroke: cross.hover ? "#CCC" : "#333",
 		strokeWidth: 1,
 		//alpha: cross.hover ? 0.1 : 0.65
 		alpha: cross.hover ? 0.65 : 0.1
	});
	
	var xCross = new Kinetic.Shape({	
		drawFunc:function(context) {
			context.beginPath();
			context.moveTo(-0.35 * SCALE, -0.35 * SCALE);
			context.lineTo(0.35 * SCALE, 0.35 * SCALE);
			context.moveTo(-0.35 * SCALE, 0.35 * SCALE);
			context.lineTo(0.35 * SCALE, -0.35 * SCALE);
			context.closePath();
			this.fill(context);
            this.stroke(context);
		},
        //stroke: cross.hover ? "#333" : "#DDD",
        stroke: cross.hover ? "#DDD" : "#333",
        strokeWidth: 2,
        //alpha: 0.75,
    });
    
    xGroup.add(xCircle);
    xGroup.add(xCross);
    return xGroup;
}