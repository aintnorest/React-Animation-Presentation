//TRANSITIONS
const slideDown = { direction: "Y", duration: 330, start: -100, end: 0, leave: -100};
const slideRight = { direction: "X", duration: 330, start: -40, end: 0, leave: 100};
const slideUp = { direction: "Y", duration: 330, start: 100, end: 12, leave: 100};
const slideUpReport = { direction: "Y", duration: 330, start: 100, end: 0, leave: 100};
//REUSED COMPONENTS;
const Header = {transition: slideDown, handler: require("../components/Header/Header"), classes:"Layouts--header"};
//
const RouteMap = {
	"0": {
		"#Clear":{
			components: [
				Header,
				{transition: slideUp, handler: require("../components/RenderControllers/Empty"), classes: "Layouts--content"}
			],
			check: function() {
				return true;
			}
		},
		"#Reports": {
			components: [
				Header,
				{transition: slideUp, handler: require("../components/Reports/Reports"), classes: "Layouts--content"}
			],
			check: function() {
				return true;
			}
		},
		"#ClientEntry": {
			components: [
				Header,
				{transition: slideUp, handler: require("../components/ClientEntry/ClientEntry"), classes: "Layouts--content"}
			],
			check: function() {
				var DataStore = require("../stores/DataStore");
				var lookupsReady = DataStore.checkLookups();
				if(!lookupsReady) setTimeout(()=>{
					var RouterStore = require("../components/RenderControllers/RouterStore");
					RouterStore.setUrl( "#ClientEntry/ClientInformation");
				},2500);
				return lookupsReady;
			}
		},
		"#ClientLookup": {
			components: [
				Header,
				{transition: slideUp, handler: require("../components/ClientLookup/ClientLookup"), classes: "Layouts--content"}
			],
			check: function() {
				return true;
			}
		},
		"#Login": {
			components: [
				{transition: slideUpReport, handler: require("../components/Login/Login"), classes:"Layouts--fullScreen"},
			],
			check: function() {
				return true;
			}
		}
	},
	"1": {
		"ClientInformation": {
			components:[
				{transition: slideRight, handler: require("../components/ClientEntry/ClientInformation"), classes:"Layouts--leftPannel"}
			],
			check: function() {
				return true;
			}

		},
		"MarketingInformation": {
			components:[
				{transition: slideRight, handler: require("../components/ClientEntry/MarketingInformation"), classes:"Layouts--leftPannel"}
			],
			check: function() {
				return true;
			}

		},
		"CaseInformation": {
			components:[
				{transition: slideRight, handler: require("../components/ClientEntry/CaseInformation"), classes:"Layouts--leftPannel"}
			],
			check: function() {
				return true;
			}

		},
		"RegionalInformation": {
			components:[
				{transition: slideRight, handler: require("../components/ClientEntry/RegionalInformation"), classes:"Layouts--leftPannel"}
			],
			check: function() {
				return true;
			}

		},
		"ClientContactInformation": {
			components:[
				{transition: slideRight, handler: require("../components/ClientEntry/ClientContactInformation"), classes:"Layouts--leftPannel"}
			],
			check: function() {
				return true;
			}

		},
		"AdminInformation": {
			components:[
				{transition: slideRight, handler: require("../components/ClientEntry/AdminInformation"), classes:"Layouts--leftPannel"}
			],
			check: function() {
				return true;
			}

		},
		/* LOOKUP */
		"SearchResults": {
			components:[
				{transition: slideUpReport, handler: require("../components/ClientLookup/SearchResults"), classes:"Layouts--wrap"}
			],
			check: function() {
				return true;
			}
		},
		"InstructionsSearch": {
			components:[
				{transition: slideUpReport, handler: require("../components/ClientLookup/InstructionsSearch"), classes:"Layouts--lookupPanel"}
			],
			check: function() {
				return true;
			}
		},
		/* REPORTING */
		"Daily":{
			components:[
				{transition: slideUpReport, handler: require("../components/Reports/Daily"), classes: "Layouts--content"}
			],
			check: function() {
				return true;
			}
		},
		"CAC":{
			components:[
				{transition: slideUpReport, handler: require("../components/Reports/CAC"), classes: "Layouts--content"}
			],
			check: function() {
				return true;
			}
		}
	}
};

module.exports = RouteMap