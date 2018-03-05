var patchId = jsarguments[1];
var numRoutes = jsarguments[2];
var rampTime = jsarguments[3];
var rampgate = new Rampgate(this.patcher, patchId, numRoutes, rampTime);

function loadbang() {
	rampgate.init();
}

function route(num) {
	rampgate.route(num);
}

function Rampgate(patcher, patchId, numRoutes, rampTime) {

	this.patcher = patcher;
	this.patchId = patchId;
	this.gates = [];
	this.gateToggles = [];
	this.outlets = [];

	if (numRoutes === undefined || numRoutes === null) {
		numRoutes = 1;
	}

	var x0 = 220;
	var xd = 300; 
	var y0 = 400;

	for (var i = 0; i < numRoutes; i++) {

		// Create gate
		this.gates[i] = this.patcher.newdefault(x0 + (xd * i), y0, "rampgate~-voice", rampTime);

		// Create gate toggle
		this.gateToggles[i] = this.patcher.newdefault(x0 + (xd * i) + 50, y0 - 40, "number");

		// Create outlets
		this.outlets[i * 2] = this.patcher.newdefault(x0 + (xd * i), y0 + 100, "outlet");
		this.outlets[(i * 2) + 1] = this.patcher.newdefault(x0 + (xd * i) + 100, y0 + 100, "outlet");
	}
}

Rampgate.prototype.init = function init() {

	this.inlet1 = this.patcher.getnamed(this.patchId + "inlet1");
	this.inlet3 = this.patcher.getnamed(this.patchId + "inlet3");
	this.inlet2 = this.patcher.getnamed(this.patchId + "inlet2");
	this.inlet4 = this.patcher.getnamed(this.patchId + "inlet4");
	
	for (var i = 0; i < this.gates.length; i++) {

		// Connect the toggle to the gate's toggle input
		this.patcher.connect(this.gateToggles[i], 0, this.gates[i], 2);

		// Connect gates to outlets
		this.patcher.connect(this.gates[i], 0, this.outlets[i * 2], 0);
		this.patcher.connect(this.gates[i], 1, this.outlets[(i * 2) + 1], 0);

		// Connect inlets to gates
		this.patcher.connect(this.inlet1, 0, this.gates[i], 0);
		this.patcher.connect(this.in1, 0, this.gates[i], 0);
		this.patcher.connect(this.inlet2, 0, this.gates[i], 1);
		this.patcher.connect(this.in2, 0, this.gates[i], 1);
		this.patcher.connect(this.inlet4, 0, this.gates[i], 3);
		this.patcher.connect(this.in4, 0, this.gates[i], 3);
	}
}

/**
 * Route to a specific route.
 * @param {number} routeNum - Number of the route. Counted from 1.
 */
Rampgate.prototype.route = function route(routeNum) {

	post("routing to ", routeNum);

	// Open the matching gate, close all others
	for (var i = 0; i < this.gates.length; i++) {
		if (i === (routeNum - 1)) {
			this.gateToggles[i].message(1);
		} else {
			this.gateToggles[i].message(0);
		}
	} 
};