/* USES CONSTANTS IN DRAW.JS */

function formation(sportType, formationType) {
	if (sportType === "ultimate") {
		return formationUltimate(formationType);
	} else if (sportType === "soccer") {
		return formationSoccer(formationType);
	} else if (sportType === "football") {
		return formationFootball(formationType);
	} else if (sportType === "basketball") {
		return formationBasketball(formationType);
	}
}

function formationUltimate(formationType) {
	if (formationType === "vertical") {
		return verticalStack();
	} else if (formationType === "horizontal") {
		return horizontalStack();
	} else if (formationType === "side") {
		return sideStack();
	} else if (formationType === "split") {
		return splitStack();
	} else if (formationType === "l") {
		return lStack();
	}
}


function verticalStack() {
	return [{
		x: ULTIMATE_WIDTH / 2 * SCALE,
		y: (ULTIMATE_HEIGHT - ULTIMATE_ENDZONE - ULTIMATE_BRICK) * SCALE,
		type: "player",
		label: "H",
		team: "team0"
	}, {
		x: (ULTIMATE_WIDTH / 2 - 8) * SCALE,
		y: (ULTIMATE_HEIGHT - ULTIMATE_ENDZONE - ULTIMATE_BRICK + 5) * SCALE,
		type: "player",
		label: "H",
		team: "team0"
	}, {
		x: (ULTIMATE_WIDTH / 2 - 3) * SCALE,
		y: (ULTIMATE_HEIGHT / 2 + 5) * SCALE,
		type: "player",
		label: "C",
		team: "team0"
	}, {
		x: (ULTIMATE_WIDTH / 2 - 3) * SCALE,
		y: (ULTIMATE_HEIGHT / 2) * SCALE,
		type: "player",
		label: "C",
		team: "team0"
	}, {
		x: (ULTIMATE_WIDTH / 2 - 3) * SCALE,
		y: (ULTIMATE_HEIGHT / 2 - 5) * SCALE,
		type: "player",
		label: "C",
		team: "team0"
	}, {
		x: (ULTIMATE_WIDTH / 2 - 3) * SCALE,
		y: (ULTIMATE_HEIGHT / 2 - 10) * SCALE,
		type: "player",
		label: "C",
		team: "team0"
	}, {
		x: (ULTIMATE_WIDTH / 2 - 3) * SCALE,
		y: (ULTIMATE_HEIGHT / 2 - 15) * SCALE,
		type: "player",
		label: "C",
		team: "team0"
	}, {
		x: (ULTIMATE_WIDTH / 2 + 2) * SCALE,
		y: (ULTIMATE_HEIGHT - ULTIMATE_ENDZONE - ULTIMATE_BRICK - 1) * SCALE,
		type: "ball",
		label: "",
		team: ""
	}];
}

function horizontalStack() {
	return [{
		x: ULTIMATE_WIDTH / 2 * SCALE,
		y: (ULTIMATE_HEIGHT - ULTIMATE_ENDZONE - ULTIMATE_BRICK) * SCALE,
		type: "player",
		label: "H",
		team: "team0"
	}, {
		x: (ULTIMATE_WIDTH / 2 - 12) * SCALE,
		y: (ULTIMATE_HEIGHT - ULTIMATE_ENDZONE - ULTIMATE_BRICK + 2) * SCALE,
		type: "player",
		label: "H",
		team: "team0"
	}, {
		x: (ULTIMATE_WIDTH / 2 + 12) * SCALE,
		y: (ULTIMATE_HEIGHT - ULTIMATE_ENDZONE - ULTIMATE_BRICK + 2) * SCALE,
		type: "player",
		label: "H",
		team: "team0"
	}, {
		x: (ULTIMATE_WIDTH / 2 - 15) * SCALE,
		y: (ULTIMATE_HEIGHT / 2) * SCALE,
		type: "player",
		label: "C",
		team: "team0"
	}, {
		x: (ULTIMATE_WIDTH / 2 - 5) * SCALE,
		y: (ULTIMATE_HEIGHT / 2) * SCALE,
		type: "player",
		label: "C",
		team: "team0"
	}, {
		x: (ULTIMATE_WIDTH / 2 + 5) * SCALE,
		y: (ULTIMATE_HEIGHT / 2) * SCALE,
		type: "player",
		label: "C",
		team: "team0"
	}, {
		x: (ULTIMATE_WIDTH / 2 + 15) * SCALE,
		y: (ULTIMATE_HEIGHT / 2) * SCALE,
		type: "player",
		label: "C",
		team: "team0"
	}, {
		x: (ULTIMATE_WIDTH / 2 + 2) * SCALE,
		y: (ULTIMATE_HEIGHT - ULTIMATE_ENDZONE - ULTIMATE_BRICK - 1) * SCALE,
		type: "ball",
		label: "",
		team: ""
	}];
}

function sideStack() {
	return [{
		x: ULTIMATE_WIDTH / 2 * SCALE,
		y: (ULTIMATE_HEIGHT - ULTIMATE_ENDZONE - ULTIMATE_BRICK) * SCALE,
		type: "player",
		label: "H",
		team: "team0"
	}, {
		x: (ULTIMATE_WIDTH / 2 - 12) * SCALE,
		y: (ULTIMATE_HEIGHT - ULTIMATE_ENDZONE - ULTIMATE_BRICK + 2) * SCALE,
		type: "player",
		label: "H",
		team: "team0"
	}, {
		x: (ULTIMATE_WIDTH / 2 + 12) * SCALE,
		y: (ULTIMATE_HEIGHT - ULTIMATE_ENDZONE - ULTIMATE_BRICK + 2) * SCALE,
		type: "player",
		label: "H",
		team: "team0"
	}, {
		x: (ULTIMATE_WIDTH / 2 - 15) * SCALE,
		y: (ULTIMATE_HEIGHT / 2 - 10) * SCALE,
		type: "player",
		label: "C",
		team: "team0"
	}, {
		x: (ULTIMATE_WIDTH / 2 - 15) * SCALE,
		y: (ULTIMATE_HEIGHT / 2 - 5) * SCALE,
		type: "player",
		label: "C",
		team: "team0"
	}, {
		x: (ULTIMATE_WIDTH / 2 - 15) * SCALE,
		y: (ULTIMATE_HEIGHT / 2) * SCALE,
		type: "player",
		label: "C",
		team: "team0"
	}, {
		x: (ULTIMATE_WIDTH / 2 - 15) * SCALE,
		y: (ULTIMATE_HEIGHT / 2 + 5) * SCALE,
		type: "player",
		label: "C",
		team: "team0"
	}, {
		x: (ULTIMATE_WIDTH / 2 + 2) * SCALE,
		y: (ULTIMATE_HEIGHT - ULTIMATE_ENDZONE - ULTIMATE_BRICK - 1) * SCALE,
		type: "ball",
		label: "",
		team: ""
	}];
}

function splitStack() {
	return [{
		x: ULTIMATE_WIDTH / 2 * SCALE,
		y: (ULTIMATE_HEIGHT - ULTIMATE_ENDZONE - ULTIMATE_BRICK) * SCALE,
		type: "player",
		label: "H",
		team: "team0"
	}, {
		x: (ULTIMATE_WIDTH / 2 - 12) * SCALE,
		y: (ULTIMATE_HEIGHT - ULTIMATE_ENDZONE - ULTIMATE_BRICK + 2) * SCALE,
		type: "player",
		label: "H",
		team: "team0"
	}, {
		x: (ULTIMATE_WIDTH / 2 + 12) * SCALE,
		y: (ULTIMATE_HEIGHT - ULTIMATE_ENDZONE - ULTIMATE_BRICK + 2) * SCALE,
		type: "player",
		label: "H",
		team: "team0"
	}, {
		x: (ULTIMATE_WIDTH / 2 - 15) * SCALE,
		y: (ULTIMATE_HEIGHT / 2 - 5) * SCALE,
		type: "player",
		label: "C",
		team: "team0"
	}, {
		x: (ULTIMATE_WIDTH / 2 - 15) * SCALE,
		y: (ULTIMATE_HEIGHT / 2 + 5) * SCALE,
		type: "player",
		label: "C",
		team: "team0"
	}, {
		x: (ULTIMATE_WIDTH / 2 + 15) * SCALE,
		y: (ULTIMATE_HEIGHT / 2 + 5) * SCALE,
		type: "player",
		label: "C",
		team: "team0"
	}, {
		x: (ULTIMATE_WIDTH / 2 + 15) * SCALE,
		y: (ULTIMATE_HEIGHT / 2 - 5) * SCALE,
		type: "player",
		label: "C",
		team: "team0"
	}, {
		x: (ULTIMATE_WIDTH / 2 + 2) * SCALE,
		y: (ULTIMATE_HEIGHT - ULTIMATE_ENDZONE - ULTIMATE_BRICK - 1) * SCALE,
		type: "ball",
		label: "",
		team: ""
	}];
}

function lStack() {
	return [{
		x: ULTIMATE_WIDTH / 2 * SCALE,
		y: (ULTIMATE_HEIGHT - ULTIMATE_ENDZONE - ULTIMATE_BRICK) * SCALE,
		type: "player",
		label: "H",
		team: "team0"
	}, {
		x: (ULTIMATE_WIDTH / 2 - 12) * SCALE,
		y: (ULTIMATE_HEIGHT - ULTIMATE_ENDZONE - ULTIMATE_BRICK + 2) * SCALE,
		type: "player",
		label: "H",
		team: "team0"
	}, {
		x: (ULTIMATE_WIDTH / 2 + 12) * SCALE,
		y: (ULTIMATE_HEIGHT - ULTIMATE_ENDZONE - ULTIMATE_BRICK + 2) * SCALE,
		type: "player",
		label: "H",
		team: "team0"
	}, {
		x: (ULTIMATE_WIDTH / 2 - 15) * SCALE,
		y: (ULTIMATE_HEIGHT / 2 - 5) * SCALE,
		type: "player",
		label: "C",
		team: "team0"
	}, {
		x: (ULTIMATE_WIDTH / 2 - 15) * SCALE,
		y: (ULTIMATE_HEIGHT / 2 + 5) * SCALE,
		type: "player",
		label: "C",
		team: "team0"
	}, {
		x: (ULTIMATE_WIDTH / 2 - 5) * SCALE,
		y: (ULTIMATE_HEIGHT / 2) * SCALE,
		type: "player",
		label: "C",
		team: "team0"
	}, {
		x: (ULTIMATE_WIDTH / 2 + 10) * SCALE,
		y: (ULTIMATE_HEIGHT / 2) * SCALE,
		type: "player",
		label: "C",
		team: "team0"
	}, {
		x: (ULTIMATE_WIDTH / 2 + 2) * SCALE,
		y: (ULTIMATE_HEIGHT - ULTIMATE_ENDZONE - ULTIMATE_BRICK - 1) * SCALE,
		type: "ball",
		label: "",
		team: ""
	}];
}

function formationSoccer(formationType) {
	if (formationType === "4-4-2") {
		return fourFourTwo();
	} else if (formationType === "4-3-3") {
		return fourThreeThree();
	} else if (formationType === "3-4-3") {
		return threeFourThree();
	} else if (formationType === "3-5-2") {
		return threeFiveTwo();
	}
}

function fourFourTwo() {
	return [{
		x: SOCCER_WIDTH / 2 * SCALE,
		y: (SOCCER_HEIGHT - SOCCER_GOAL_BOX_HEIGHT) * SCALE,
		type: "player",
		label: "GK",
		team: "team0"
	}, {
		x: (SOCCER_WIDTH / 2 - SOCCER_CIRCLE_RADIUS) * SCALE,
		y: (SOCCER_HEIGHT - SOCCER_PENALTY_MARK - SOCCER_CIRCLE_RADIUS) * SCALE,
		type: "player",
		label: "LCB",
		team: "team0"
	}, {
		x: (SOCCER_WIDTH / 2 + SOCCER_CIRCLE_RADIUS) * SCALE,
		y: (SOCCER_HEIGHT - SOCCER_PENALTY_MARK - SOCCER_CIRCLE_RADIUS) * SCALE,
		type: "player",
		label: "RCB",
		team: "team0"
	}, {
		x: (SOCCER_WIDTH / 2 - 2.5 * SOCCER_CIRCLE_RADIUS) * SCALE,
		y: (SOCCER_HEIGHT - SOCCER_PENALTY_HEIGHT - SOCCER_CIRCLE_RADIUS) * SCALE,
		type: "player",
		label: "LB",
		team: "team0"
	}, {
		x: (SOCCER_WIDTH / 2 + 2.5 * SOCCER_CIRCLE_RADIUS) * SCALE,
		y: (SOCCER_HEIGHT - SOCCER_PENALTY_HEIGHT - SOCCER_CIRCLE_RADIUS) * SCALE,
		type: "player",
		label: "RB",
		team: "team0"
	}, {
		x: (SOCCER_WIDTH / 2 - SOCCER_CIRCLE_RADIUS) * SCALE,
		y: (ULTIMATE_HEIGHT / 2) * SCALE,
		type: "player",
		label: "LCM",
		team: "team0"
	}, {
		x: (SOCCER_WIDTH / 2 + SOCCER_CIRCLE_RADIUS) * SCALE,
		y: (ULTIMATE_HEIGHT / 2) * SCALE,
		type: "player",
		label: "RCM",
		team: "team0"
	}, {
		x: (SOCCER_WIDTH / 2 - 2.5 * SOCCER_CIRCLE_RADIUS) * SCALE,
		y: (ULTIMATE_HEIGHT / 2 - SOCCER_CIRCLE_RADIUS) * SCALE,
		type: "player",
		label: "LM",
		team: "team0"
	}, {
		x: (SOCCER_WIDTH / 2 + 2.5 * SOCCER_CIRCLE_RADIUS) * SCALE,
		y: (ULTIMATE_HEIGHT / 2 - SOCCER_CIRCLE_RADIUS) * SCALE,
		type: "player",
		label: "RM",
		team: "team0"
	}, {
		x: (SOCCER_WIDTH / 2 - 1.25 * SOCCER_CIRCLE_RADIUS) * SCALE,
		y: SOCCER_PENALTY_MARK * SCALE,
		type: "player",
		label: "CF",
		team: "team0"
	}, {
		x: (SOCCER_WIDTH / 2 + 1.25 * SOCCER_CIRCLE_RADIUS) * SCALE,
		y: SOCCER_PENALTY_MARK * SCALE,
		type: "player",
		label: "CF",
		team: "team0"
	}, {
		x: (SOCCER_WIDTH / 2) * SCALE,
		y: (SOCCER_HEIGHT / 2) * SCALE,
		type: "ball",
		label: "",
		team: ""
	}];
}

function fourThreeThree() {
	return [{
		x: SOCCER_WIDTH / 2 * SCALE,
		y: (SOCCER_HEIGHT - SOCCER_GOAL_BOX_HEIGHT) * SCALE,
		type: "player",
		label: "GK",
		team: "team0"
	}, {
		x: (SOCCER_WIDTH / 2 - SOCCER_CIRCLE_RADIUS) * SCALE,
		y: (SOCCER_HEIGHT - SOCCER_PENALTY_MARK - SOCCER_CIRCLE_RADIUS) * SCALE,
		type: "player",
		label: "LCB",
		team: "team0"
	}, {
		x: (SOCCER_WIDTH / 2 + SOCCER_CIRCLE_RADIUS) * SCALE,
		y: (SOCCER_HEIGHT - SOCCER_PENALTY_MARK - SOCCER_CIRCLE_RADIUS) * SCALE,
		type: "player",
		label: "RCB",
		team: "team0"
	}, {
		x: (SOCCER_WIDTH / 2 - 2.5 * SOCCER_CIRCLE_RADIUS) * SCALE,
		y: (SOCCER_HEIGHT - SOCCER_PENALTY_HEIGHT - SOCCER_CIRCLE_RADIUS) * SCALE,
		type: "player",
		label: "LB",
		team: "team0"
	}, {
		x: (SOCCER_WIDTH / 2 + 2.5 * SOCCER_CIRCLE_RADIUS) * SCALE,
		y: (SOCCER_HEIGHT - SOCCER_PENALTY_HEIGHT - SOCCER_CIRCLE_RADIUS) * SCALE,
		type: "player",
		label: "RB",
		team: "team0"
	}, {
		x: (SOCCER_WIDTH / 2) * SCALE,
		y: (ULTIMATE_HEIGHT / 2) * SCALE,
		type: "player",
		label: "CM",
		team: "team0"
	}, {
		x: (SOCCER_WIDTH / 2 - 1.5 * SOCCER_CIRCLE_RADIUS) * SCALE,
		y: (ULTIMATE_HEIGHT / 2 - 0.75 * SOCCER_CIRCLE_RADIUS) * SCALE,
		type: "player",
		label: "LM",
		team: "team0"
	}, {
		x: (SOCCER_WIDTH / 2 + 1.5 * SOCCER_CIRCLE_RADIUS) * SCALE,
		y: (ULTIMATE_HEIGHT / 2 - 0.75 * SOCCER_CIRCLE_RADIUS) * SCALE,
		type: "player",
		label: "RM",
		team: "team0"
	}, {
		x: (SOCCER_WIDTH / 2) * SCALE,
		y: SOCCER_PENALTY_MARK * SCALE,
		type: "player",
		label: "CF",
		team: "team0"
	}, {
		x: (SOCCER_WIDTH / 2 - 2.5 * SOCCER_CIRCLE_RADIUS) * SCALE,
		y: SOCCER_PENALTY_HEIGHT * SCALE,
		type: "player",
		label: "LF",
		team: "team0"
	}, {
		x: (SOCCER_WIDTH / 2 + 2.5 * SOCCER_CIRCLE_RADIUS) * SCALE,
		y: SOCCER_PENALTY_HEIGHT * SCALE,
		type: "player",
		label: "RF",
		team: "team0"
	}, {
		x: (SOCCER_WIDTH / 2 + 2) * SCALE,
		y: (SOCCER_HEIGHT / 2 - 2) * SCALE,
		type: "ball",
		label: "",
		team: ""
	}];
}

function threeFourThree() {
	return [{
		x: SOCCER_WIDTH / 2 * SCALE,
		y: (SOCCER_HEIGHT - SOCCER_GOAL_BOX_HEIGHT) * SCALE,
		type: "player",
		label: "GK",
		team: "team0"
	}, {
		x: (SOCCER_WIDTH / 2) * SCALE,
		y: (SOCCER_HEIGHT - SOCCER_PENALTY_MARK - SOCCER_CIRCLE_RADIUS) * SCALE,
		type: "player",
		label: "CB",
		team: "team0"
	}, {
		x: (SOCCER_WIDTH / 2 - 1.5 * SOCCER_CIRCLE_RADIUS) * SCALE,
		y: (SOCCER_HEIGHT - SOCCER_PENALTY_HEIGHT - 0.5 * SOCCER_CIRCLE_RADIUS) * SCALE,
		type: "player",
		label: "LB",
		team: "team0"
	}, {
		x: (SOCCER_WIDTH / 2 + 1.5 * SOCCER_CIRCLE_RADIUS) * SCALE,
		y: (SOCCER_HEIGHT - SOCCER_PENALTY_HEIGHT - 0.5 * SOCCER_CIRCLE_RADIUS) * SCALE,
		type: "player",
		label: "RB",
		team: "team0"
	}, {
		x: (SOCCER_WIDTH / 2 - SOCCER_CIRCLE_RADIUS) * SCALE,
		y: (ULTIMATE_HEIGHT / 2) * SCALE,
		type: "player",
		label: "LCM",
		team: "team0"
	}, {
		x: (SOCCER_WIDTH / 2 + SOCCER_CIRCLE_RADIUS) * SCALE,
		y: (ULTIMATE_HEIGHT / 2) * SCALE,
		type: "player",
		label: "RCM",
		team: "team0"
	}, {
		x: (SOCCER_WIDTH / 2 - 2.5 * SOCCER_CIRCLE_RADIUS) * SCALE,
		y: (ULTIMATE_HEIGHT / 2 - SOCCER_CIRCLE_RADIUS) * SCALE,
		type: "player",
		label: "LM",
		team: "team0"
	}, {
		x: (SOCCER_WIDTH / 2 + 2.5 * SOCCER_CIRCLE_RADIUS) * SCALE,
		y: (ULTIMATE_HEIGHT / 2 - SOCCER_CIRCLE_RADIUS) * SCALE,
		type: "player",
		label: "RM",
		team: "team0"
	}, {
		x: (SOCCER_WIDTH / 2) * SCALE,
		y: SOCCER_PENALTY_MARK * SCALE,
		type: "player",
		label: "CF",
		team: "team0"
	}, {
		x: (SOCCER_WIDTH / 2 - 2.5 * SOCCER_CIRCLE_RADIUS) * SCALE,
		y: SOCCER_PENALTY_HEIGHT * SCALE,
		type: "player",
		label: "LF",
		team: "team0"
	}, {
		x: (SOCCER_WIDTH / 2 + 2.5 * SOCCER_CIRCLE_RADIUS) * SCALE,
		y: SOCCER_PENALTY_HEIGHT * SCALE,
		type: "player",
		label: "RF",
		team: "team0"
	}, {
		x: (SOCCER_WIDTH / 2) * SCALE,
		y: (SOCCER_HEIGHT / 2) * SCALE,
		type: "ball",
		label: "",
		team: ""
	}];
}

function threeFiveTwo() {
	return [{
		x: SOCCER_WIDTH / 2 * SCALE,
		y: (SOCCER_HEIGHT - SOCCER_GOAL_BOX_HEIGHT) * SCALE,
		type: "player",
		label: "GK",
		team: "team0"
	}, {
		x: (SOCCER_WIDTH / 2) * SCALE,
		y: (SOCCER_HEIGHT - SOCCER_PENALTY_MARK - SOCCER_CIRCLE_RADIUS) * SCALE,
		type: "player",
		label: "CB",
		team: "team0"
	}, {
		x: (SOCCER_WIDTH / 2 - 1.5 * SOCCER_CIRCLE_RADIUS) * SCALE,
		y: (SOCCER_HEIGHT - SOCCER_PENALTY_HEIGHT - 0.5 * SOCCER_CIRCLE_RADIUS) * SCALE,
		type: "player",
		label: "LB",
		team: "team0"
	}, {
		x: (SOCCER_WIDTH / 2 + 1.5 * SOCCER_CIRCLE_RADIUS) * SCALE,
		y: (SOCCER_HEIGHT - SOCCER_PENALTY_HEIGHT - 0.5 * SOCCER_CIRCLE_RADIUS) * SCALE,
		type: "player",
		label: "RB",
		team: "team0"
	}, {
		x: (SOCCER_WIDTH / 2) * SCALE,
		y: (ULTIMATE_HEIGHT / 2 + SOCCER_CIRCLE_RADIUS - 1) * SCALE,
		type: "player",
		label: "DM",
		team: "team0"
	}, {
		x: (SOCCER_WIDTH / 2 - SOCCER_CIRCLE_RADIUS) * SCALE,
		y: (ULTIMATE_HEIGHT / 2 - 1) * SCALE,
		type: "player",
		label: "LCM",
		team: "team0"
	}, {
		x: (SOCCER_WIDTH / 2 + SOCCER_CIRCLE_RADIUS) * SCALE,
		y: (ULTIMATE_HEIGHT / 2 - 1) * SCALE,
		type: "player",
		label: "RCM",
		team: "team0"
	}, {
		x: (SOCCER_WIDTH / 2 - 2.5 * SOCCER_CIRCLE_RADIUS) * SCALE,
		y: (ULTIMATE_HEIGHT / 2 - 1.5 * SOCCER_CIRCLE_RADIUS) * SCALE,
		type: "player",
		label: "LM",
		team: "team0"
	}, {
		x: (SOCCER_WIDTH / 2 + 2.5 * SOCCER_CIRCLE_RADIUS) * SCALE,
		y: (ULTIMATE_HEIGHT / 2 - 1.5 * SOCCER_CIRCLE_RADIUS) * SCALE,
		type: "player",
		label: "RM",
		team: "team0"
	}, {
		x: (SOCCER_WIDTH / 2 - 1.25 * SOCCER_CIRCLE_RADIUS) * SCALE,
		y: SOCCER_PENALTY_MARK * SCALE,
		type: "player",
		label: "CF",
		team: "team0"
	}, {
		x: (SOCCER_WIDTH / 2 + 1.25 * SOCCER_CIRCLE_RADIUS) * SCALE,
		y: SOCCER_PENALTY_MARK * SCALE,
		type: "player",
		label: "CF",
		team: "team0"
	}, {
		x: (SOCCER_WIDTH / 2) * SCALE,
		y: (SOCCER_HEIGHT / 2) * SCALE,
		type: "ball",
		label: "",
		team: ""
	}];
}

// Potentially embellish to choose one offense and one defense
function formationFootball(formationType) {
	if (formationType === "i") {
		return iOffense();
	} else if (formationType === "pro") {
		return proOffense();
	} else if (formationType === "shotgun") {
		return shotgunOffense();
	} else if (formationType === "spread") {
		return spreadOffense();
	} else if (formationType === "4-3") {
		return fourThreeDefense();
	} else if (formationType === "3-4") {
		return threeFourDefense();
	} else if (formationType === "4-2-5") {
		return fourTwoFiveNickelDefense();
	} else if (formationType === "3-5-3") {
		return threeFiveThreeNickelDefense();
	}
}

function iOffense() {
	return [{
		x: (FOOTBALL_WIDTH / 2) * SCALE,
		y: (FOOTBALL_HEIGHT / 2) * SCALE,
		type: "player",
		label: "C",
		team: "team0"
	}, {
		x: (FOOTBALL_WIDTH / 2 - 4) * SCALE,
		y: (FOOTBALL_HEIGHT / 2) * SCALE,
		type: "player",
		label: "LG",
		team: "team0"
	}, {
		x: (FOOTBALL_WIDTH / 2 + 4) * SCALE,
		y: (FOOTBALL_HEIGHT / 2) * SCALE,
		type: "player",
		label: "RG",
		team: "team0"
	}, {
		x: (FOOTBALL_WIDTH / 2 - 8) * SCALE,
		y: (FOOTBALL_HEIGHT / 2) * SCALE,
		type: "player",
		label: "LT",
		team: "team0"
	}, {
		x: (FOOTBALL_WIDTH / 2 + 8) * SCALE,
		y: (FOOTBALL_HEIGHT / 2) * SCALE,
		type: "player",
		label: "RT",
		team: "team0"
	}, {
		x: (FOOTBALL_WIDTH / 2 + 12) * SCALE,
		y: (FOOTBALL_HEIGHT / 2) * SCALE,
		type: "player",
		label: "TE",
		team: "team0"
	}, {
		x: (FOOTBALL_WIDTH / 2) * SCALE,
		y: (FOOTBALL_HEIGHT / 2 + 4) * SCALE,
		type: "player",
		label: "QB",
		team: "team0"
	}, {
		x: (FOOTBALL_WIDTH / 2) * SCALE,
		y: (FOOTBALL_HEIGHT / 2 + 8) * SCALE,
		type: "player",
		label: "FB",
		team: "team0"
	}, {
		x: (FOOTBALL_WIDTH / 2) * SCALE,
		y: (FOOTBALL_HEIGHT / 2 + 12) * SCALE,
		type: "player",
		label: "HB",
		team: "team0"
	}, {
		x: (FOOTBALL_WIDTH / 2 - 20) * SCALE,
		y: (FOOTBALL_HEIGHT / 2) * SCALE,
		type: "player",
		label: "WR",
		team: "team0"
	}, {
		x: (FOOTBALL_WIDTH / 2 + 20) * SCALE,
		y: (FOOTBALL_HEIGHT / 2 + 4) * SCALE,
		type: "player",
		label: "WR",
		team: "team0"
	}, {
		x: (FOOTBALL_WIDTH / 2) * SCALE,
		y: (FOOTBALL_HEIGHT / 2 - 2) * SCALE,
		type: "ball",
		label: "",
		team: ""
	}];
}

function proOffense() {
	return [{
		x: (FOOTBALL_WIDTH / 2) * SCALE,
		y: (FOOTBALL_HEIGHT / 2) * SCALE,
		type: "player",
		label: "C",
		team: "team0"
	}, {
		x: (FOOTBALL_WIDTH / 2 - 4) * SCALE,
		y: (FOOTBALL_HEIGHT / 2) * SCALE,
		type: "player",
		label: "LG",
		team: "team0"
	}, {
		x: (FOOTBALL_WIDTH / 2 + 4) * SCALE,
		y: (FOOTBALL_HEIGHT / 2) * SCALE,
		type: "player",
		label: "RG",
		team: "team0"
	}, {
		x: (FOOTBALL_WIDTH / 2 - 8) * SCALE,
		y: (FOOTBALL_HEIGHT / 2) * SCALE,
		type: "player",
		label: "LT",
		team: "team0"
	}, {
		x: (FOOTBALL_WIDTH / 2 + 8) * SCALE,
		y: (FOOTBALL_HEIGHT / 2) * SCALE,
		type: "player",
		label: "RT",
		team: "team0"
	}, {
		x: (FOOTBALL_WIDTH / 2 + 12) * SCALE,
		y: (FOOTBALL_HEIGHT / 2) * SCALE,
		type: "player",
		label: "TE",
		team: "team0"
	}, {
		x: (FOOTBALL_WIDTH / 2) * SCALE,
		y: (FOOTBALL_HEIGHT / 2 + 4) * SCALE,
		type: "player",
		label: "QB",
		team: "team0"
	}, {
		x: (FOOTBALL_WIDTH / 2 + 5) * SCALE,
		y: (FOOTBALL_HEIGHT / 2 + 8) * SCALE,
		type: "player",
		label: "FB",
		team: "team0"
	}, {
		x: (FOOTBALL_WIDTH / 2 - 5) * SCALE,
		y: (FOOTBALL_HEIGHT / 2 + 8) * SCALE,
		type: "player",
		label: "HB",
		team: "team0"
	}, {
		x: (FOOTBALL_WIDTH / 2 - 20) * SCALE,
		y: (FOOTBALL_HEIGHT / 2) * SCALE,
		type: "player",
		label: "WR",
		team: "team0"
	}, {
		x: (FOOTBALL_WIDTH / 2 + 20) * SCALE,
		y: (FOOTBALL_HEIGHT / 2 + 4) * SCALE,
		type: "player",
		label: "WR",
		team: "team0"
	}, {
		x: (FOOTBALL_WIDTH / 2) * SCALE,
		y: (FOOTBALL_HEIGHT / 2 - 2) * SCALE,
		type: "ball",
		label: "",
		team: ""
	}];
}

function shotgunOffense() {
	return [{
		x: (FOOTBALL_WIDTH / 2) * SCALE,
		y: (FOOTBALL_HEIGHT / 2) * SCALE,
		type: "player",
		label: "C",
		team: "team0"
	}, {
		x: (FOOTBALL_WIDTH / 2 - 4) * SCALE,
		y: (FOOTBALL_HEIGHT / 2) * SCALE,
		type: "player",
		label: "LG",
		team: "team0"
	}, {
		x: (FOOTBALL_WIDTH / 2 + 4) * SCALE,
		y: (FOOTBALL_HEIGHT / 2) * SCALE,
		type: "player",
		label: "RG",
		team: "team0"
	}, {
		x: (FOOTBALL_WIDTH / 2 - 8) * SCALE,
		y: (FOOTBALL_HEIGHT / 2) * SCALE,
		type: "player",
		label: "LT",
		team: "team0"
	}, {
		x: (FOOTBALL_WIDTH / 2 + 8) * SCALE,
		y: (FOOTBALL_HEIGHT / 2) * SCALE,
		type: "player",
		label: "RT",
		team: "team0"
	}, {
		x: (FOOTBALL_WIDTH / 2 + 12) * SCALE,
		y: (FOOTBALL_HEIGHT / 2) * SCALE,
		type: "player",
		label: "TE",
		team: "team0"
	}, {
		x: (FOOTBALL_WIDTH / 2) * SCALE,
		y: (FOOTBALL_HEIGHT / 2 + 12) * SCALE,
		type: "player",
		label: "QB",
		team: "team0"
	}, {
		x: (FOOTBALL_WIDTH / 2 - 4) * SCALE,
		y: (FOOTBALL_HEIGHT / 2 + 12) * SCALE,
		type: "player",
		label: "HB",
		team: "team0"
	}, {
		x: (FOOTBALL_WIDTH / 2 - 20) * SCALE,
		y: (FOOTBALL_HEIGHT / 2) * SCALE,
		type: "player",
		label: "WR",
		team: "team0"
	}, {
		x: (FOOTBALL_WIDTH / 2 - 16) * SCALE,
		y: (FOOTBALL_HEIGHT / 2 + 4) * SCALE,
		type: "player",
		label: "WR",
		team: "team0"
	}, {
		x: (FOOTBALL_WIDTH / 2 + 20) * SCALE,
		y: (FOOTBALL_HEIGHT / 2 + 4) * SCALE,
		type: "player",
		label: "WR",
		team: "team0"
	}, {
		x: (FOOTBALL_WIDTH / 2) * SCALE,
		y: (FOOTBALL_HEIGHT / 2 - 2) * SCALE,
		type: "ball",
		label: "",
		team: ""
	}];
}

function spreadOffense() {
	return [{
		x: (FOOTBALL_WIDTH / 2) * SCALE,
		y: (FOOTBALL_HEIGHT / 2) * SCALE,
		type: "player",
		label: "C",
		team: "team0"
	}, {
		x: (FOOTBALL_WIDTH / 2 - 4) * SCALE,
		y: (FOOTBALL_HEIGHT / 2) * SCALE,
		type: "player",
		label: "LG",
		team: "team0"
	}, {
		x: (FOOTBALL_WIDTH / 2 + 4) * SCALE,
		y: (FOOTBALL_HEIGHT / 2) * SCALE,
		type: "player",
		label: "RG",
		team: "team0"
	}, {
		x: (FOOTBALL_WIDTH / 2 - 8) * SCALE,
		y: (FOOTBALL_HEIGHT / 2) * SCALE,
		type: "player",
		label: "LT",
		team: "team0"
	}, {
		x: (FOOTBALL_WIDTH / 2 + 8) * SCALE,
		y: (FOOTBALL_HEIGHT / 2) * SCALE,
		type: "player",
		label: "RT",
		team: "team0"
	}, {
		x: (FOOTBALL_WIDTH / 2) * SCALE,
		y: (FOOTBALL_HEIGHT / 2 + 4) * SCALE,
		type: "player",
		label: "QB",
		team: "team0"
	}, {
		x: (FOOTBALL_WIDTH / 2) * SCALE,
		y: (FOOTBALL_HEIGHT / 2 + 12) * SCALE,
		type: "player",
		label: "HB",
		team: "team0"
	}, {
		x: (FOOTBALL_WIDTH / 2 - 20) * SCALE,
		y: (FOOTBALL_HEIGHT / 2) * SCALE,
		type: "player",
		label: "WR",
		team: "team0"
	}, {
		x: (FOOTBALL_WIDTH / 2 - 16) * SCALE,
		y: (FOOTBALL_HEIGHT / 2 + 4) * SCALE,
		type: "player",
		label: "WR",
		team: "team0"
	}, {
		x: (FOOTBALL_WIDTH / 2 + 16) * SCALE,
		y: (FOOTBALL_HEIGHT / 2 + 4) * SCALE,
		type: "player",
		label: "WR",
		team: "team0"
	}, {
		x: (FOOTBALL_WIDTH / 2 + 20) * SCALE,
		y: (FOOTBALL_HEIGHT / 2) * SCALE,
		type: "player",
		label: "WR",
		team: "team0"
	}, {
		x: (FOOTBALL_WIDTH / 2) * SCALE,
		y: (FOOTBALL_HEIGHT / 2 - 2) * SCALE,
		type: "ball",
		label: "",
		team: ""
	}];
}

function fourThreeDefense() {
	return [{
		x: (FOOTBALL_WIDTH / 2 - 2) * SCALE,
		y: (FOOTBALL_HEIGHT / 2 - 5) * SCALE,
		type: "player",
		label: "DT",
		team: "team1"
	}, {
		x: (FOOTBALL_WIDTH / 2 + 2) * SCALE,
		y: (FOOTBALL_HEIGHT / 2 - 5) * SCALE,
		type: "player",
		label: "DT",
		team: "team1"
	}, {
		x: (FOOTBALL_WIDTH / 2 - 6) * SCALE,
		y: (FOOTBALL_HEIGHT / 2 - 5) * SCALE,
		type: "player",
		label: "DE",
		team: "team1"
	}, {
		x: (FOOTBALL_WIDTH / 2 + 6) * SCALE,
		y: (FOOTBALL_HEIGHT / 2 - 5) * SCALE,
		type: "player",
		label: "DE",
		team: "team1"
	}, {
		x: (FOOTBALL_WIDTH / 2) * SCALE,
		y: (FOOTBALL_HEIGHT / 2 - 10) * SCALE,
		type: "player",
		label: "MLB",
		team: "team1"
	}, {
		x: (FOOTBALL_WIDTH / 2 - 5) * SCALE,
		y: (FOOTBALL_HEIGHT / 2 - 9) * SCALE,
		type: "player",
		label: "OLB",
		team: "team1"
	}, {
		x: (FOOTBALL_WIDTH / 2 + 5) * SCALE,
		y: (FOOTBALL_HEIGHT / 2 - 9) * SCALE,
		type: "player",
		label: "OLB",
		team: "team1"
	}, {
		x: (FOOTBALL_WIDTH / 2 - 20) * SCALE,
		y: (FOOTBALL_HEIGHT / 2 - 5) * SCALE,
		type: "player",
		label: "CB",
		team: "team1"
	}, {
		x: (FOOTBALL_WIDTH / 2 + 20) * SCALE,
		y: (FOOTBALL_HEIGHT / 2 - 5) * SCALE,
		type: "player",
		label: "CB",
		team: "team1"
	}, {
		x: (FOOTBALL_WIDTH / 2 + 6) * SCALE,
		y: (FOOTBALL_HEIGHT / 2 - 18) * SCALE,
		type: "player",
		label: "SS",
		team: "team1"
	}, {
		x: (FOOTBALL_WIDTH / 2 - 2) * SCALE,
		y: (FOOTBALL_HEIGHT / 2 - 20) * SCALE,
		type: "player",
		label: "FS",
		team: "team1"
	}, {
		x: (FOOTBALL_WIDTH / 2) * SCALE,
		y: (FOOTBALL_HEIGHT / 2 - 2) * SCALE,
		type: "ball",
		label: "",
		team: ""
	}];
}

function threeFourDefense() {
	return [{
		x: (FOOTBALL_WIDTH / 2) * SCALE,
		y: (FOOTBALL_HEIGHT / 2 - 5) * SCALE,
		type: "player",
		label: "NT",
		team: "team1"
	}, {
		x: (FOOTBALL_WIDTH / 2 - 6) * SCALE,
		y: (FOOTBALL_HEIGHT / 2 - 5) * SCALE,
		type: "player",
		label: "DE",
		team: "team1"
	}, {
		x: (FOOTBALL_WIDTH / 2 + 6) * SCALE,
		y: (FOOTBALL_HEIGHT / 2 - 5) * SCALE,
		type: "player",
		label: "DE",
		team: "team1"
	}, {
		x: (FOOTBALL_WIDTH / 2 - 2.5) * SCALE,
		y: (FOOTBALL_HEIGHT / 2 - 10) * SCALE,
		type: "player",
		label: "ILB",
		team: "team1"
	}, {
		x: (FOOTBALL_WIDTH / 2 + 2.5) * SCALE,
		y: (FOOTBALL_HEIGHT / 2 - 10) * SCALE,
		type: "player",
		label: "ILB",
		team: "team1"
	}, {
		x: (FOOTBALL_WIDTH / 2 - 8) * SCALE,
		y: (FOOTBALL_HEIGHT / 2 - 9) * SCALE,
		type: "player",
		label: "OLB",
		team: "team1"
	}, {
		x: (FOOTBALL_WIDTH / 2 + 8) * SCALE,
		y: (FOOTBALL_HEIGHT / 2 - 9) * SCALE,
		type: "player",
		label: "OLB",
		team: "team1"
	}, {
		x: (FOOTBALL_WIDTH / 2 - 20) * SCALE,
		y: (FOOTBALL_HEIGHT / 2 - 5) * SCALE,
		type: "player",
		label: "CB",
		team: "team1"
	}, {
		x: (FOOTBALL_WIDTH / 2 + 20) * SCALE,
		y: (FOOTBALL_HEIGHT / 2 - 5) * SCALE,
		type: "player",
		label: "CB",
		team: "team1"
	}, {
		x: (FOOTBALL_WIDTH / 2 + 6) * SCALE,
		y: (FOOTBALL_HEIGHT / 2 - 18) * SCALE,
		type: "player",
		label: "SS",
		team: "team1"
	}, {
		x: (FOOTBALL_WIDTH / 2 - 2) * SCALE,
		y: (FOOTBALL_HEIGHT / 2 - 20) * SCALE,
		type: "player",
		label: "FS",
		team: "team1"
	}, {
		x: (FOOTBALL_WIDTH / 2) * SCALE,
		y: (FOOTBALL_HEIGHT / 2 - 2) * SCALE,
		type: "ball",
		label: "",
		team: ""
	}];
}

function fourTwoFiveNickelDefense() {
	return [{
		x: (FOOTBALL_WIDTH / 2 - 2) * SCALE,
		y: (FOOTBALL_HEIGHT / 2 - 5) * SCALE,
		type: "player",
		label: "DT",
		team: "team1"
	}, {
		x: (FOOTBALL_WIDTH / 2 + 2) * SCALE,
		y: (FOOTBALL_HEIGHT / 2 - 5) * SCALE,
		type: "player",
		label: "DT",
		team: "team1"
	}, {
		x: (FOOTBALL_WIDTH / 2 - 6) * SCALE,
		y: (FOOTBALL_HEIGHT / 2 - 5) * SCALE,
		type: "player",
		label: "DE",
		team: "team1"
	}, {
		x: (FOOTBALL_WIDTH / 2 + 6) * SCALE,
		y: (FOOTBALL_HEIGHT / 2 - 5) * SCALE,
		type: "player",
		label: "DE",
		team: "team1"
	}, {
		x: (FOOTBALL_WIDTH / 2 - 3) * SCALE,
		y: (FOOTBALL_HEIGHT / 2 - 9) * SCALE,
		type: "player",
		label: "LB",
		team: "team1"
	}, {
		x: (FOOTBALL_WIDTH / 2 + 3) * SCALE,
		y: (FOOTBALL_HEIGHT / 2 - 9) * SCALE,
		type: "player",
		label: "LB",
		team: "team1"
	}, {
		x: (FOOTBALL_WIDTH / 2 - 20) * SCALE,
		y: (FOOTBALL_HEIGHT / 2 - 5) * SCALE,
		type: "player",
		label: "CB",
		team: "team1"
	}, {
		x: (FOOTBALL_WIDTH / 2 - 15) * SCALE,
		y: (FOOTBALL_HEIGHT / 2 - 5) * SCALE,
		type: "player",
		label: "CB",
		team: "team1"
	}, {
		x: (FOOTBALL_WIDTH / 2 + 20) * SCALE,
		y: (FOOTBALL_HEIGHT / 2 - 5) * SCALE,
		type: "player",
		label: "CB",
		team: "team1"
	}, {
		x: (FOOTBALL_WIDTH / 2 + 6) * SCALE,
		y: (FOOTBALL_HEIGHT / 2 - 18) * SCALE,
		type: "player",
		label: "SS",
		team: "team1"
	}, {
		x: (FOOTBALL_WIDTH / 2 - 2) * SCALE,
		y: (FOOTBALL_HEIGHT / 2 - 20) * SCALE,
		type: "player",
		label: "FS",
		team: "team1"
	}, {
		x: (FOOTBALL_WIDTH / 2) * SCALE,
		y: (FOOTBALL_HEIGHT / 2 - 2) * SCALE,
		type: "ball",
		label: "",
		team: ""
	}];
}

function threeFiveThreeNickelDefense() {
	return [{
		x: (FOOTBALL_WIDTH / 2) * SCALE,
		y: (FOOTBALL_HEIGHT / 2 - 5) * SCALE,
		type: "player",
		label: "NT",
		team: "team1"
	}, {
		x: (FOOTBALL_WIDTH / 2 - 6) * SCALE,
		y: (FOOTBALL_HEIGHT / 2 - 5) * SCALE,
		type: "player",
		label: "DE",
		team: "team1"
	}, {
		x: (FOOTBALL_WIDTH / 2 + 6) * SCALE,
		y: (FOOTBALL_HEIGHT / 2 - 5) * SCALE,
		type: "player",
		label: "DE",
		team: "team1"
	}, {
		x: (FOOTBALL_WIDTH / 2) * SCALE,
		y: (FOOTBALL_HEIGHT / 2 - 10) * SCALE,
		type: "player",
		label: "MLB",
		team: "team1"
	}, {
		x: (FOOTBALL_WIDTH / 2 - 10) * SCALE,
		y: (FOOTBALL_HEIGHT / 2 - 7) * SCALE,
		type: "player",
		label: "LB",
		team: "team1"
	}, {
		x: (FOOTBALL_WIDTH / 2 + 10) * SCALE,
		y: (FOOTBALL_HEIGHT / 2 - 7) * SCALE,
		type: "player",
		label: "LB",
		team: "team1"
	}, {
		x: (FOOTBALL_WIDTH / 2 - 20) * SCALE,
		y: (FOOTBALL_HEIGHT / 2 - 5) * SCALE,
		type: "player",
		label: "CB",
		team: "team1"
	}, {
		x: (FOOTBALL_WIDTH / 2 + 20) * SCALE,
		y: (FOOTBALL_HEIGHT / 2 - 5) * SCALE,
		type: "player",
		label: "CB",
		team: "team1"
	}, {
		x: (FOOTBALL_WIDTH / 2 + 12) * SCALE,
		y: (FOOTBALL_HEIGHT / 2 - 18) * SCALE,
		type: "player",
		label: "SS",
		team: "team1"
	}, {
		x: (FOOTBALL_WIDTH / 2 - 12) * SCALE,
		y: (FOOTBALL_HEIGHT / 2 - 18) * SCALE,
		type: "player",
		label: "SS",
		team: "team1"
	}, {
		x: (FOOTBALL_WIDTH / 2) * SCALE,
		y: (FOOTBALL_HEIGHT / 2 - 20) * SCALE,
		type: "player",
		label: "FS",
		team: "team1"
	}, {
		x: (FOOTBALL_WIDTH / 2) * SCALE,
		y: (FOOTBALL_HEIGHT / 2 - 2) * SCALE,
		type: "ball",
		label: "",
		team: ""
	}];
}

function formationBasketball(formationType) {
	if (formationType === "threeOutTwoIn") {
		return threeOutTwoIn();
	} else if (formationType === "") {
		return;
	}
}

function threeOutTwoIn() {
	return [{
		x: (BASKETBALL_WIDTH / 2) * SCALE,
		y: (BASKETBALL_BACKBOARD_OFFSET + BASKETBALL_RIM_OFFSET + BASKETBALL_THREE_POINT_RADIUS + 5) * SCALE,
		type: "player",
		label: "PG",
		team: "team1"
	}, {
		x: (BASKETBALL_WIDTH / 2 - 20) * SCALE,
		y: (BASKETBALL_KEY_HEIGHT + 6) * SCALE,
		type: "player",
		label: "SG",
		team: "team1"
	}, {
		x: (BASKETBALL_WIDTH / 2 + 20) * SCALE,
		y: (BASKETBALL_KEY_HEIGHT + 4) * SCALE,
		type: "player",
		label: "SF",
		team: "team1"
	}, {
		x: ((BASKETBALL_WIDTH + BASKETBALL_OUTER_KEY_WIDTH) / 2 + 3) * SCALE,
		y: (BASKETBALL_BACKBOARD_OFFSET + 3) * SCALE,
		type: "player",
		label: "PF",
		team: "team1"
	}, {
		x: ((BASKETBALL_WIDTH - BASKETBALL_OUTER_KEY_WIDTH) / 2 - 2) * SCALE,
		y: (BASKETBALL_BACKBOARD_OFFSET + 3) * SCALE,
		type: "player",
		label: "C",
		team: "team1"
	}, {
		x: (BASKETBALL_WIDTH / 2 + 2) * SCALE,
		y: (BASKETBALL_BACKBOARD_OFFSET + BASKETBALL_RIM_OFFSET + BASKETBALL_THREE_POINT_RADIUS + 3) * SCALE,
		type: "ball",
		label: "",
		team: ""
	}];
}