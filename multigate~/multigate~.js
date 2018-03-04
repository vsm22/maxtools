var _this = this;
var multigate;

function loadbang() {
	multigate = new Multigate(_this.patcher);
}

function create(num) {
	multigate.create(num);
}

function route(num) {
	multigate.route(num);
}

function Multigate(patcher) {

	this.patcher = patcher;

	// Signal inlets
	this.inlet1 = this.patcher.getnamed("inlet1");
	this.in1 = this.patcher.getnamed("in~1");
	this.inlet2 = this.patcher.getnamed("inlet2");
	this.in2 = this.patcher.getnamed("in~2");

	// Route destination inlet
	this.inlet3 = this.patcher.getnamed("inlet3");
	this.in3 = this.patcher.getnamed("in3");

	// Ramp time setting inlet
	this.inlet4 = this.patcher.getnamed("inlet4");
	this.in4 = this.patcher.getnamed("in4");

	this.gates = [];
	this.gateToggles = [];
	this.outlets = [];
	this.outs = [];			// outs are outlets used for the poly object

	/**
	 * Creates the patch with the specified number of routes (one route is 2 channels).
	 * @param {number} numRoutes - Number of routes.
	 */
	this.create = function create(numRoutes) {

		if (numRoutes === undefined || numRoutes === null) {
			numRoutes = 1;
		}

		var x0 = 220;
		var xd = 300; 
		var y0 = 400;

		for (var i = 0; i < numRoutes; i++) {

			// Create gate
			this.gates[i] = this.patcher.newdefault(x0 + (xd * i), y0, "multigate~-voice");

			// Create gate toggle
			this.gateToggles[i] = this.patcher.newdefault(x0 + (xd * i) + 50, y0 - 40, "number");

			// Create outlets
			this.outlets[i * 2] = this.patcher.newdefault(x0 + (xd * i), y0 + 100, "outlet");
			this.outlets[(i * 2) + 1] = this.patcher.newdefault(x0 + (xd * i) + 100, y0 + 100, "outlet");
			this.outs[i * 2] = this.patcher.newdefault(x0 + (xd * i), y0 + 150, "out~", (i * 2) + 1);
			this.outs[(i * 2) + 1] = this.patcher.newdefault(x0 + (xd * i) + 100, y0 + 150, "out~", (i * 2) + 2);

			// Connect the toggle to the gate's toggle input
			this.patcher.connect(this.gateToggles[i], 0, this.gates[i], 2);

			// Connect inlets to gates
			this.patcher.connect(this.inlet1, 0, this.gates[i], 0);
			this.patcher.connect(this.in1, 0, this.gates[i], 0);
			this.patcher.connect(this.inlet2, 0, this.gates[i], 1);
			this.patcher.connect(this.in2, 0, this.gates[i], 1);
			this.patcher.connect(this.inlet4, 0, this.gates[i], 3);
			this.patcher.connect(this.in4, 0, this.gates[i], 3);

			// Connect gates to outlets
			this.patcher.connect(this.gates[i], 0, this.outlets[i * 2], 0);
			this.patcher.connect(this.gates[i], 1, this.outlets[(i * 2) + 1], 0);
			this.patcher.connect(this.gates[i], 0, this.outs[i * 2], 0);
			this.patcher.connect(this.gates[i], 1, this.outs[(i * 2) + 1], 0);
		}
	};

	/**
	 * Route to a specific route.
	 * @param {number} routeNum - Number of the route.
	 */
	this.route = function route(routeNum) {

		post("routing to ", routeNum);

		// Open the matching gate, close all others
		for (var i = 0; i < this.gates.length; i++) {
			if (i === routeNum) {
				this.gateToggles[i].message(1);
			} else {
				this.gateToggles[i].message(0);
			}
		} 
	}
}