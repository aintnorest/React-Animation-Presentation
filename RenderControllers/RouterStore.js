//REQUIRES
const EventEmitter = require("eventemitter3").EventEmitter;
//GLOBAL ROUTE VARIABLES 
const RouteMap = require("../../constants/RouteMap");
// CLEAR HISTORY FIRST
history.pushState({}, "", "#");
// HELPER FUNCTION
function setupWait() {

}
// ROUTER STORE
const RouterStore = Object.assign({}, EventEmitter.prototype, {
	_currentRoute: [],
	_routeHistory: [],
	_funcHolder: {},
	_active: false,
	_urlQue: [],
	setUrl: function(url) {
		this._urlQue.push(url);
		if(this._active) return;
		else {
			this._active = true;
			this.startQue();
		}
	},
	startQue: function() {
		if(this._urlQue.length === 0){
			this._active = false;
			return;
		}
		var nextUrl = this._urlQue.splice(0,1);
		if(this._urlQue === undefined){ this._urlQue = []; }
		this.changeUrl(nextUrl[0]);
		setTimeout(this.startQue.bind(this),450);
	},
	changeUrl: function(url) {
		let urlS = url.split("/");
		let dvrgnt = (this._currentRoute.length === 0) ? 0 : findDivergent(this._currentRoute, urlS, urlS.length - 1, 0);
		if(dvrgnt === false) return;

		if(!RouteMap[dvrgnt][urlS[dvrgnt]].check()) return;

		if(this._currentRoute.length !== 0) requestCleanup(dvrgnt + 1, urlS.length - 1);
		requestInitialize(dvrgnt, urlS.length - 1, urlS, RouteMap);
		this._currentRoute.push(urlS);
		history.pushState({}, "", url);
		this.emit("UrlChange",url);
	},
	addPool: function(lvl, fnc) {
		this._funcHolder[lvl] = fnc;
		this.addListener(lvl, this._funcHolder[lvl]);
	},
	removePool: function(lvl) {
		this.removeListener(lvl, this._funcHolder[lvl]);
		delete this._funcHolder[lvl];
	}
});
//HELPER FUNCTIONS
function findDivergent(currentUrl, newUrl, max, n) {
	if(newUrl[n] !== currentUrl[currentUrl.length-1][n]) return n;
	if(n >= max) return false;
	return findDivergent(currentUrl, newUrl, max, n+1);
}
//
function requestCleanup(n, max) {
	RouterStore.emit(n+"Cleanup", () => {
		if(n >= max) return;
		return requestCleanup(n + 1, max);
	});
/*
Send a message to everything above the divergance so they know not to listen and to clean themselves up.
 */
}
//
function clone(newVersion, og, n) {
	var comp = {transition: og[n].transition, handler: og[n].handler, classes: og[n].classes};
	newVersion.push(comp);
	if(n <= 0) return newVersion;
	return clone(newVersion, og, n-1);
}
//
function requestInitialize(n, max, url, Route) {
	var original = Route[n][url[n]].components;
	var duplicate = clone([],original,original.length - 1);
	RouterStore.emit(n, duplicate, () => {
		if(n >= max) return;
		return requestInitialize(n + 1, max, url, Route);
	});
/*
Initialize everything further up the chain. start at the divergance and go up sending the next one up.
 */
}
//
module.exports = RouterStore;
//
/*
//ROUTER MAP
var currentRoute = [];
var routeHistory = [];
var _routeMap = require("../../constants/RouteMap");
//ROUTER STORE
var funcPlcHldr = {};
const RouterStore = Object.assign({}, EventEmitter.prototype, {
	setUrl: function(url) {
		var u = checkDivergent(url);
		if(!u) return;
		currentRoute.push(u);
		history.pushState({}, "", url);
	},
	addPool: function(lvl,fnc) {
		funcPlcHldr[lvl] = fnc;
		this.addListener(lvl, funcPlcHldr[lvl]);
	},
	removePool: function(lvl) {
		this.removeListener(lvl, funcPlcHldr[lvl]);
		delete funcPlcHldr[lvl];
	},
});
//HELPER FUNCTIONS (NEED TO ADD THE CHECK FOR THE STATIC STUFF FOR WHAT INFO IT NEEDS)
function requestChange(url, dp) {
	var len = url.length-1;
	function fireRoute(n) {
		var r = _routeMap[n][url[n]];
		if(r.check()){
			RouterStore.emit(n, r.components, ()=>{
				if(n >= len) return;
				return fireRoute(n+1);
			});
		}
	}
	fireRoute(dp);
}
//
function checkDivergent(url) {
	var u = url.split("/");
	var len = u.length;
	var divergencePoint;
	if(!currentRoute.length) divergencePoint = 0;
	else {
		for(var i = 0; i < len; i++){
			if(currentRoute[currentRoute.length - 1][i] !== u[i]){
				divergencePoint = i;
				break;
			}
		}
	}
	if(divergencePoint === undefined) return;
	requestChange(u, divergencePoint);
	return u;
}
//
//
module.exports = RouterStore;
*/