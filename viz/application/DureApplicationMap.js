var dMap = {};

// Loads the google map to required map container.
dMap.loadMap = function() {   
	console.log("Loading Map Functions ======");
	if(iHealthMap.map == undefined){
		iHealthMap.initialize();
	}
	if(dMap.level == 'country'){
		province.initialize('kenya');
	}else if(dMap.level == 'district'){
		subprovince.initialize('kenya');
	}
	return true;
};

// dMap.onResizeMap = function() {
    // iHealthMap.resizeMap();
// };

dMap.getCurrentGeoJSON = function()
{
	var geoJSON ;
	if(iHealthMap != undefined)
	{
		geoJSON = iHealthMap.geoJSON;
	}
	
	return geoJSON;
}


// Renders information on map like coloured layers,legends and data on click or hover on layers on map.
dMap.renderInfoForMap = function(){
	console.log('======================== Rendering info to Map ==============================');
	if(dMap.level == 'world'){
		console.log('======================== Rendering info to World Map Level ==============================');
		dMap.loadWorldLevelInfo();
	}else if(dMap.level == 'country'){
		console.log('======================== Rendering info to Country Map Level ==============================');
		dMap.loadCountryLevelInfo();
	}else if(dMap.level == 'province'){
		console.log('======================== Rendering info to Province Map Level ==============================');
		dMap.loadProvinceLevelInfo();
	}
}

// Loads world information data on map.
dMap.loadWorldLevelInfo = function(){
	console.log(iHealthMap.checkDataInProvider());
	
	if(iHealthMap.checkDataInProvider()){
		console.log('======================== Loading layer ==============================');
		resetOverLayContainer();
		dureOverlays.clearOverlays();
		gaviOverlays.clearOverlays();
		dureOverlays.removeSelectLayers();
		province.clearLayer();
		subprovince.clearMapLayer();
		iHealthMap.setYearRangeAndLimits();
		iHealthMap.clearMap();
		//iHealthMap.map.setView(new L.latLng(10.833305983642491, 12.12890625), 2);
		iHealthMap.loadLayer();
		iHealthMap.renderLegend(iHealthMap.legendControlData);
		iHealthMap.renderCountryListDropdown();
	}
};

// Loads country information data on map.
dMap.loadCountryLevelInfo = function(){
	if(province.checkDataInProvider()){
		console.log('======================== Loading layer ==============================');
		local.clearMarkers();
		subprovince.clearLayer();
		province.clearMap();
		province.setYearRangeAndLimits();
		province.loadLayer();
		province.renderLegend();
		iHealthMap.renderMapControls();
		iHealthMap.deActivateSliderControls();
	}
};

// Loads province information data on map.
dMap.loadProvinceLevelInfo = function(){
	if(province.checkDataInProvider()){
		//console.log('======================== Loading layer ==============================');
		subprovince.clearMap();
		subprovince.setYearRangeAndLimits();
		subprovince.loadLayer();
		iHealthMap.renderMapControls(subprovince.jsondata);
	}
};

// Resets the map to default position.
dMap.onResettingMap = function(){
	//console.log('Reset Level = '+dMap.level);

	if(dMap.level == 'world'){
		iHealthMap.onResettingMap();	
	}else if(dMap.level == 'country'){
		province.onResettingMap();
	}else if(dMap.level == 'province'){
		province.onResettingMap();
	}else if(dMap.level == 'district'){
		subprovince.onResettingMap();
	}
};

// Check map level 
dMap.checkLevel = function(){
	return dMap.level;
};

// Set Map level
dMap.setLevel = function(level){
	dMap.level = level;
	return true;
};

// Drills down to country/province level
$(document).on('click','.drillDown',function(){
	//console.log("-------------- Drill downs to country level on dbl click -------");	
	var regionId;
	if(dMap.checkLevel() == 'world'){
		regionId = dureUtil.getCountryId();
	}else if(dMap.checkLevel() == 'country'){
		regionId = province.getId();
	}
	
	dureUtil.getDataOnDrillDown(regionId);
	// Deactivates REGION-LEVEL functionality of slider.
	// iHealthMap.deActivateSliderControls();
});