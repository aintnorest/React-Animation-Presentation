const React = require("react/addons");
const PureRenderMixin = require('react/addons').addons.PureRenderMixin;
const RouterStore = require("./RouterStore");
const RenderController = require("./RenderController");
const sLayouts = require("./Layouts.scss");
sLayouts.use();
//HELPER FUNCTIONS
function getEmpty(store) {
	function handNew(store){
		store.PoolCount++;
		return store.PoolCount;
	}
	return (store.PoolCount === 0 || store.Empty.length === 0) ? handNew(store) : store.Empty.splice(0,1)[0];
}
//
function filterComponents(components, n, store, TB) {
	var place = getEmpty(store);
	TB.TBU[place] = components[n];
	TB.TBUA.push(place);
	if(n <= 0) return TB;
	return filterComponents(components, n-1, store, TB);
}
//
function checkVsComponents(comps, n, state, inUse) {
	if(comps[n].handler === state[inUse].handler){
		comps.splice(n, 1);
		return true;
	}
	if(n <= 0) return false;
	return checkVsComponents(comps, n-1, state, inUse);
}
//
function sortComponents(inUse, n, components,TB, state) {
	var isInUse = (n === -1) ? undefined : checkVsComponents(components, components.length-1, state, inUse[n]);
	if(isInUse === false) {
		TB.TBE[inUse[n]] = null;
		TB.TBEA.push(inUse[n]);
	}
	if(n <= 0) return filterComponents(components, components.length-1, state.store, TB);
	return sortComponents(inUse, n-1, components,TB, state);
}
//
function setInUse(toBeUsed, n, inUse) {
	inUse.push(toBeUsed[n]);
	if(n <= 0) return;
	return setInUse(toBeUsed, n-1, inUse);
}
//
function findInUse(inUse, n, val) {
	if(inUse[n] === val){
		inUse.splice(n, 1);
		return val;
	}
	if(n <= 0) return;
	return findInUse(inUse, n-1);
}
//
function setEmpty(toBeEmptied, n, store, references, setNull, that, TBE) {
	references[toBeEmptied[n]].animateOut( ()=>{
		store.Empty.push( findInUse(store.InUse, store.InUse.length-1, toBeEmptied[n]) );
		setNull(function(){
			that.setState(TBE);
		});
	} );
	if(n <= 0) return;
	return setEmpty(toBeEmptied, n-1, store, references, setNull, that, TBE);
}
// RENDER HELPER FUNCTIONS
function createJSX(state, cnt) {
	var refrence = state[cnt];
	if(refrence !== null) return ( <RenderController ref={cnt} key={cnt} handler={refrence.handler} transition={refrence.transition} classes={refrence.classes} /> );
}

function iteratePool(n, inUse, state, elms) {
	elms.push(createJSX(state, inUse[n]));
	if(n <= 0) return elms;
	return iteratePool(n-1, inUse, state, elms);
}
//
//
//
//
//
//
//
//
//
//
//RENDER POOL REACT CLASS
const RenderPool = React.createClass({
	mixins: [PureRenderMixin],
	getInitialState: function() {
		return { store:{ PoolCount: 0, Empty: [], InUse: [] } };
	},
	componentDidMount: function() {
		RouterStore.addPool(this.props.routerLvl, (components, cb) => {
			var TB = sortComponents(this.state.store.InUse, this.state.store.InUse.length-1, components, { TBU:{}, TBUA:[], TBE:{}, TBEA:[] }, this.state);
			setInUse(TB.TBUA, TB.TBUA.length - 1, this.state.store.InUse);
			this.setState(TB.TBU);
			function setNull(cnt) {
				var that = this;
				var debounceCount = cnt;
				return function(CB) {
					debounceCount--;
					if(debounceCount <= 0){
						if(typeof CB === "function")CB();
						cb();
					} 
				}
			}
			if(TB.TBEA.length > 0) setEmpty(TB.TBEA, TB.TBEA.length - 1, this.state.store, this.refs, setNull.call(this,TB.TBEA.length), this, TB.TBE);
			else setNull.call(this,0)();
			
		});
		RouterStore.addListener(this.props.routerLvl+"Cleanup", (cb) => {
			RouterStore.removePool(this.props.routerLvl);
			cb();
		});
	},
	render: function() {

		let len = this.state.store.InUse.length - 1;
		let AnimationElements = (len > -1) ? iteratePool(len, this.state.store.InUse, this.state, []) : [];

		return (
			<div className="Layouts--wrap">
				{AnimationElements}
			</div>
		);
	}
});
//
module.exports = RenderPool;
//