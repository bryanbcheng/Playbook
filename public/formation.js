/* USES CONSTANTS IN DRAW.JS */

function formation(sportType, formationType) {
	if (sportType === "ultimate") {
		return formationUltimate(formationType);
	} else if (sportType === "soccer") {
		return formationSoccer(formationType);
	} else if (sportType === "football") {
		return formationFootball(formationType);
	}
}

function formationUltimate(formationType) {
	if (formationType === "vertical") {
		return verticalStack();
	} else if (formationType === "horizontal") {
		return horizontalStack();
	} else if (formationType === "side") {
		return sideStack();
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
		x: (ULTIMATE_WIDTH / 2 - 5) * SCALE,
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
		x: (ULTIMATE_WIDTH / 2 - 5) * SCALE,
		y: (ULTIMATE_HEIGHT / 2 - 5) * SCALE,
		type: "player",
		label: "C",
		team: "team0"
	}, {
		x: (ULTIMATE_WIDTH / 2 - 5) * SCALE,
		y: (ULTIMATE_HEIGHT / 2 - 10) * SCALE,
		type: "player",
		label: "C",
		team: "team0"
	}, {
		x: (ULTIMATE_WIDTH / 2 - 5) * SCALE,
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
	return null;
}

function formationSoccer(formationType) {
	return null;
}

function formationFootball(formationType) {
	return null;
}