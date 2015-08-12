function PoolStore(cnt) {
	//REQUIRES
	const EventEmitter = require("eventemitter3").EventEmitter;
	const RC = require("./RenderController");
	const Empty = require("./Empty");
	const slideDown = { direction: "Y", duration: 350, start: -100, end: 0, leave: -100};
	const slideUp = { direction: "Y", duration: 350, start: 100, end: 11, leave: 100};
	const blankSlate = {transition: slideDown,	handler: Empty, classes:"hidden"};

	console.log("PoolStore Cnt: ",cnt);
	//POOLS
	var _EmptyPool = {};
	var _InUsePool = {};
	for(var i = 1; i < cnt+1; i++) {
		_EmptyPool[i] = blankSlate;
	}
	/*
	var _InUsePool = {
		"1": {transition: slideDown, handler: require("../Header/Header"), classes:"Layouts--header"},
		"2": {transition: slideUp, handler: require("../Reports/Reports"), classes: "Layouts--content"},
	};
	*/
	//STORE
	return Object.assign({}, EventEmitter.prototype, {
		getInit: function() {
			return _EmptyPool;
		},
		getEmpty: function() {
			var empty = [];
			for (var prop in _EmptyPool) {
			    empty = [prop, _EmptyPool[prop] ];
			    delete _EmptyPool[prop]
			    break;
			}
			return empty;
		},
		setInUse: function(newPool) {
			_InUsePool[newPool[0]] = newPool[1];
		},
		setToEmpty: function(toBeEmptied) {
			var tbe = toBeEmptied(blankSlate);
			console.log("LOOK AT ME: ",tbe);
		}
	});

}
//
module.exports = PoolStore;
//