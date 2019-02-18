var patchId = jsarguments[1];

var DSG = new DiscreteStochasticGen(this.patcher, patchId); 

function loadbang() {
	DSG.init();
}

function set(newValueList) {
	DSG.set(newValueList);
}

function add(value) {
	DSG.add(value);
}

function clear() {
	DSG.clear();
}

function removelast() {
	DSG.removeLast();
}

function remove(value) {
	DSG.remove(value);
}

/* ====================================================== */

function DiscreteStochasticGen(patcher, patchId) {
	
	this.patcher = patcher;
	this.patchId = patchId;
	this.values = [];
	
	// Storage
	this.coll = this.patcher.getnamed(this.patchId + "coll");
	
	// UI elements
	this.multislider = this.patcher.getnamed(this.patchId + "multislider");
	this.xLabels = [];
		
}

DiscreteStochasticGen.prototype.init = function init() {
	// init
}

/* =============================== */
/* MESSAGE HANDLING
/* =============================== */

DiscreteStochasticGen.prototype.set = function set(newValueList) {
	
	post("JS set: " + newValueList + "\n");

	this.values = newValueList.split(" ");
	
	post("New list: " + typeof(this.values) + " " + this.values);
	
	for(var i = 0; i < this.values.length; i++) {
		post("Element " + i + ": " + this.values[i]);
	}
	
	post("before calling redrawMultislider()... \n");
	
	this.redraw();
}

DiscreteStochasticGen.prototype.add = function add(value) {
	
	this.values.push(value);
	
	this.redraw();
}

DiscreteStochasticGen.prototype.clear = function clear() {
	
	this.values = [];
	
	this.redraw();
}

DiscreteStochasticGen.prototype.removeLast = function removeLast() {

	this.values.pop();
	
	this.redraw();
}

DiscreteStochasticGen.prototype.remove = function remove(targetValue) {

	this.values = this.values.filter(function(value) {
		return value !== targetValue;
	});
	
	this.redraw();
}

/* ======================================== */
/* UI BEHAVIOR
/* ======================================== */

DiscreteStochasticGen.prototype.redraw = function redraw() {
	
	this.coll.message("clear");
	
	for (var i = 0; i < this.xLabels.length; i++) {
		this.patcher.remove(this.xLabels[i]);
	}
	
	this.xLabels = [];
	
	if (this.values.length > 0) {
		
		var maxChars = this.values.reduce(function(accumulator, value) {		
			return (accumulator.length > value.length) ? accumulator.length : value.length;
		});
	
		var x0 = 10;
		var y0 = 50;
		var width = 9 * maxChars;
		var height = 10;
	
		for (var i = 0; i < this.values.length; i++) {
			
			this.coll.insert(i + 1, this.values[i]);
			
			var newXLabel = this.patcher.newdefault(0, 0, "comment");

			var left = x0 + (i * width);
			var top = y0;
			var right = left + width;
			var bottom = y0 + height;
		
			newXLabel.rect = [left, top, right, bottom];
 
			newXLabel.set(this.values[i]);

			this.xLabels.push(newXLabel);	
		}
	
		this.multislider.size(this.values.length);
	
		this.multislider.rect = [x0, 10, x0 + this.values.length * width, 50];
	
	} else {
		this.multislider.size(1);
	}
}

