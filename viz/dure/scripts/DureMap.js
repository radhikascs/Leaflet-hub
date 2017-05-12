/*************************************** Section: Initialize and Load Map object *********************************************/
var iHealthMap = {};
var baseMaps = {};
var baseLayer = {};
var countryValues = [];
iHealthMap.dataProviderCopy = {};
iHealthMap.dataProviderWorkingCopy = {};
iHealthMap.dataProviderWorkingFilteredCopy = {};
iHealthMap.dataProviderWorkingFilteredCountryCopy = {};
// All properties and methods initialized.
iHealthMap.initialize = function () {
	iHealthMap.baseFilterNull = false;
	//console.log("Line 7 : Initializing maps for first time.");
	// remove layer
	province.clearLayer();
	iHealthMap.name = 'iHealth Map';
	iHealthMap.version = 'v0.1';
	iHealthMap._lat = 10.725;
	iHealthMap._long = 12.27;
	// iHealthMap._defaultZoom = 1; //Made change here -- Shone
	iHealthMap._defaultZoom = 2;
	iHealthMap._maxZoom = 18;
	// iHealthMap.jsondata = null;
	// iHealthMap.jsonStdData = null;
	// iHealthMap.jsonNonStdData = null;
	iHealthMap.geoJson = {};
	iHealthMap.geojsonLayer = null;
	iHealthMap.geojsonCountry = [];
	iHealthMap.geocoder = null;
	iHealthMap.zoom = null;
	iHealthMap.ggl = null;
	iHealthMap.markerTemp = null;
	if (google != undefined) {
		iHealthMap.geocoder = new google.maps.Geocoder();
	}
	iHealthMap.legendControl = null;
	iHealthMap.legendControlData = null;
	// iHealthMap.sliderControl = '';
	iHealthMap.currentYearIndex = 0;
	iHealthMap.minYearValue = 0;
	iHealthMap.maxYearValue = 0;
	iHealthMap.rangeOfYears = [];
	iHealthMap.level = 'region';
	iHealthMap.dataLevel = 'indicator';
	iHealthMap.indicatorType = dureUtil.getIndicatorMetaInfoByParam('dataFormat');
	iHealthMap.country = '';
	iHealthMap.isFilterApplied = 0;
	iHealthMap.isGaviFilterApplied = 0;
	iHealthMap.filterParams = [];
	iHealthMap.dataProvider = {};
	iHealthMap.isRegionFilterChanged = false;
	iHealthMap.regionFilter = "";
	iHealthMap.filterType = "";
	iHealthMap.mapPanelWidth = 0;
	iHealthMap.mapPanelHeight = 0;
	iHealthMap.mapHeight = 0;
	iHealthMap.mapFullscreenZoom = 0;
	iHealthMap.geocodeRes = {};
	iHealthMap.dbClickCrntObj = null // TODO 17/5/2015
	iHealthMap.renderMap();
	iHealthMap.collapseBtnClick();
	//iHealthMap.FilterDataArr = [];
	iHealthMap.stylingdata = '';
	iHealthMap.checkLabelBind = true;
	filterLayerContainer('ISO_3_CODE', false, []);
	iHealthMap.playInterval = null; // play interval for play button
	dureUtil.getImpactStudiesData();
};

//Renders the map as required to the map container .
iHealthMap.renderMap = function () {

	iHealthMap.initMap(iHealthMap._lat, iHealthMap._long);
};

// Initialized the map values and load map tiles
iHealthMap.initMap = function (_lat, _lng) {
	// baseLayer = new L.StamenTileLayer('toner', {
	// detectRetina: true
	// });

	if (_lat != undefined && _lng != undefined) {
		iHealthMap._lat = _lat;
		iHealthMap._long = _lng;
	}
	iHealthMap.map = new L.Map('ihmap', {
		center: new L.LatLng(iHealthMap._lat, iHealthMap._long),
		zoom: iHealthMap._defaultZoom,
		trackResize: true,
		crs: L.CRS.EPSG4326                                    // Map projection equirectangular 
		// layers:[baseLayer]
	});

	// Set the bounds of the map
	var northeastBounds = new L.LatLng(73.62778879339942, 201.796875);
	var southwestBounds = new L.LatLng(-66.23145747862573, -177.5390625);
	var bounds = new L.LatLngBounds(southwestBounds, northeastBounds);
	iHealthMap.map.setMaxBounds(bounds);



	//iHealthMap.map.dragging.disable();
	iHealthMap.map.touchZoom.disable();
	iHealthMap.map.doubleClickZoom.disable();
	iHealthMap.map.scrollWheelZoom.disable();
	iHealthMap.map.keyboard.disable();

	//Setting map panel width.
	iHealthMap.mapPanelWidth = $('.connectedSortable').width();
	iHealthMap.mapPanelHeight = $("#map-panel").height();
	iHealthMap.mapHeight = $("#ihmap").height();
	iHealthMap.mapFullscreenZoom = iHealthMap._defaultZoom;
	//console.log(iHealthMap.mapPanelWidth);
	if (dCore.onlineStatus()) {
		iHealthMap.loadMapTiles();
	} else {
		//console.log("----------------------Offline Map ------------------------");
	}
};

// Load map tiles .
iHealthMap.loadMapTiles = function () {
	iHealthMap.map.doubleClickZoom.disable();
	// Google Layer
	iHealthMap.ggl = new L.Google();
	// var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
	//var osmUrl='http://{s}.tile.stamen.com/toner-lite/{z}/{x}/{y}.png';
	//var osmUrl='https://cartocdn_{s}.global.ssl.fastly.net/base-eco/{z}/{x}/{y}.png';
	var osmUrl = 'https://cartocdn_{s}.global.ssl.fastly.net/base-eco/{z}/{x}/{y}.png';
	var osm = new L.TileLayer(osmUrl, {
		minZoom: iHealthMap._defaultZoom,
		maxZoom: 12,
		attribution: "Dure Technologies@2014"
	});

	var Esri_WorldGrayCanvas = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
		attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
		maxZoom: 16
	});

	// Mapbox Layer
	// L.mapbox.accessToken = '<your access token here>'
	// iHealthMap.mapBox = L.mapbox.tileLayer('https://api.tiles.mapbox.com/v3/examples.map-0l53fhk2.json');

	baseMaps = {
		"Google Maps": iHealthMap.ggl,
		//"Open Street Map" : osm
		"Open Street Map": osm
	};
	// iHealthMap.map.addLayer(iHealthMap.ggl);
	iHealthMap.map.addLayer(iHealthMap.ggl);
	iHealthMap.map.invalidateSize();

	$(".leaflet-google-layer").remove();    // todo patch 
};

/**************************************************** Section: Map Data  ***************************************************/

// Fetches data from provider.
iHealthMap.getDataFromProvider = function () {
	//console.log('============================== Fetching data from provider ===================================');
	//console.log(iHealthMap.getIndicatorDataType());

	if (iHealthMap.checkDataLevel == 0) {
		iHealthMap.dataProvider = iHealthMap.jsondata.data;
	} else {
		if (iHealthMap.getIndicatorDataType() == 'Standard') {
			iHealthMap.dataProvider = iHealthMap.getStdIndDataForMap();
		} else {
			iHealthMap.dataProvider = iHealthMap.getNonStdIndDataForMap();
		}
	}

	//console.log(iHealthMap.dataProvider);
	return iHealthMap.dataProvider;
};

// Checks data in provider.
iHealthMap.checkDataInProvider = function () {
	if (iHealthMap.jsondata != undefined) {
		return true;
	} else if (iHealthMap.checkIfKeyExsistInStorage()) {
		if (iHealthMap.getDataFromProvider()) {
			return true;
		}
	}
	return false;
}

// Sets the data which is needed to show in the map .
iHealthMap.setDataForMap = function (data) {
	//console.log("=========Setting map data.==========");
	//console.log(data);
	iHealthMap.jsondata = data;
	iHealthMap.dataProviderCopy = $.extend(true, {}, iHealthMap.jsondata);
	iHealthMap.setIndicatorDataType();
	//console.log("Loading");
	if (iHealthMap.checkDataLevel() == 0) { }
	else {
		//console.log(iHealthMap.getIndicatorDataType());
		if (iHealthMap.getIndicatorDataType() == 'Standard') {
			iHealthMap.setStdIndDataForMap(data);
		} else {
			//console.log(data);
			iHealthMap.setNonStdIndDataForMap(data);
		}
	}
	return true;
};

// Set standard data for Map
iHealthMap.setStdIndDataForMap = function (param) {
	//console.log("Setting std map data.");
	//console.log(param);
	iHealthMap.jsonStdData = param[0];
	//console.log(param);
	iHealthMap.dataProviderWorkingCopy = $.extend(true, {}, param[0]);
	return true;
}

// Get standard data for Map
iHealthMap.getStdIndDataForMap = function () {
	//console.log("Line 149: FETCHING std map data.");
	return iHealthMap.jsonStdData;
}

// Set non-standard data for Map
iHealthMap.setNonStdIndDataForMap = function (param) {
	//console.log("setNonStdIndDataForMap");
	//console.log(param);
	iHealthMap.jsonNonStdData = param[0];
	iHealthMap.dataProviderWorkingCopy = $.extend(true, {}, param[0]);
	return true;
}

// Set non-standard data for Map
iHealthMap.getNonStdIndDataForMap = function () {
	//console.log("Line 159: Fetching non std map data.");
	//console.log(iHealthMap.jsonNonStdData);
	return iHealthMap.jsonNonStdData;
};

// Set the indicator data type
iHealthMap.setIndicatorDataType = function () {
	iHealthMap.indicatorType = dureUtil.getIndicatorMetaInfoByParam('dataFormat');
	return true;
}

// Get the indicator data type - standard/non-standard
iHealthMap.getIndicatorDataType = function () {
	return iHealthMap.indicatorType;
}

// Check Data Level
iHealthMap.checkDataLevel = function () {
	if (iHealthMap.dataLevel == 'target') {
		return 0
	} else {
		return 1;
	}
};

// Check Indicator Data type
iHealthMap.checkIndicatorDataType = function () {
	return iHealthMap.indicatorType;
}

// Fetch data from local storage if it exsist for the key .
iHealthMap.fetchDataFromStorage = function () {

	return dureUtil.retrieveFromLocal('Target_' + dureUtil.appId + '_' + dureUtil.targetId + '_' + dureUtil.langId);
}

// Check if the key is there in the jsStorage .
iHealthMap.checkIfKeyExsistInStorage = function () {

	if (dureUtil.retrieveFromLocal('Target_' + dureUtil.appId + '_' + dureUtil.targetId + '_' + dureUtil.langId)) {
		return true;
	}
	return false;
}

/************************************************ Section : Leaflet Layer ***************************************************/

// Load the Geojson layer which you want to.
iHealthMap.loadLayer = function () {
	var indicatorValue = dureUtil.getIndicatorId();
	dureUtil.getImpactStudiesData(indicatorValue);
	console.log(dureUtil.respJsonData.filterGroups);
	var layer = {};
	iHealthMap.FilterDataArr = [];
		if (dureUtil.respJsonData.filterGroups != undefined) {
			var filterGroupsData = dureUtil.respJsonData.filterGroups;

			for (var i = 0; i < filterGroupsData.length; i++) {
				if (filterGroupsData[i].filterGroupName == dureUtil.indicatorName) {
					for (var j = 0; j < filterGroupsData[i].filterSubGroups.length; j++) {
						for (var k = 0; k < filterGroupsData[i].filterSubGroups[j].filters.length; k++) {
							var tempArr = [];
							tempArr = [filterGroupsData[i].filterSubGroups[j].filters[k].filterName, filterGroupsData[i].filterSubGroups[j].filters[k].filterColor, filterGroupsData[i].filterSubGroups[j].filterSubGroupName];
							iHealthMap.FilterDataArr.push(tempArr);
						}
					}
				}
			}
		}
		else {
			dureUtil.respJsonData.filterGroups = dureUtil.impactStudiesValues.headerobjectivelist;
			console.log(dureUtil.respJsonData.filterGroups);
		}
		console.log(iHealthMap.FilterDataArr);


		iHealthMap.filterRespTempArr = [];
		for (var i = 0; i < dureUtil.respJsonData.filterGroups.length; i++) {
			//console.log(dureUtil.respJsonData.filterGroups[i]);
			for (var j = 0; j < dureUtil.respJsonData.filterGroups[i].filterSubGroups.length; j++) {
				//console.log(dureUtil.respJsonData.filterGroups[i].filterSubGroups[j]);
				for (var k = 0; k < dureUtil.respJsonData.filterGroups[i].filterSubGroups[j].filters.length; k++) {
					var tempObj = {};
					tempObj = dureUtil.respJsonData.filterGroups[i].filterSubGroups[j].filters[k];
					tempObj.filterSubGroupsName = dureUtil.respJsonData.filterGroups[i].filterSubGroups[j].filterSubGroupName;
					iHealthMap.filterRespTempArr.push(dureUtil.respJsonData.filterGroups[i].filterSubGroups[j].filters[k]);
				}
			}
		}
	
		//swapnil changes ends

		if (dureUtil.checkIfKeyExsist('WORLD_GEOJSON') == true) {
			//console.log('Fetching geojson layer from jStorage');
			iHealthMap.clearLayer();
			iHealthMap.geoJson = dureUtil.retrieveFromLocal('WORLD_GEOJSON');
			iHealthMap.addStyle();
			// invokeIncomeLevel();
			iHealthMap.renderMapControls();
		} else {
			iHealthMap.clearLayer();
			layer = iHealthMap.formatLayerObj();
			iHealthMap.geoJson.features = layer.features;
			iHealthMap.geoJson.type = layer.type;
			//console.log(iHealthMap.geoJson);
			iHealthMap.addStyle();
			iHealthMap.renderMapControls();

		}
		return true;
	
};

iHealthMap.formatLayerObj = function () {
	var layer = {};
	layer.data = L.countries;
	layer.features = [];
	iHealthMap.geoJson.features = [];
	layer.type = "FeatureCollection";
	for (var outer in worldGeo.features) {
		for (var inner in layer.data) {
			if (worldGeo.features[outer].properties.iso_a3 == inner) {
				var innerObject = {};
				innerObject = layer.data[inner].features[0];
				innerObject.properties = {};
				innerObject.properties.iso_a3 = inner;
				innerObject.properties.iso_a2 = inner;
				innerObject.properties.name = worldGeo.features[outer].properties.name;
				layer.features.push(innerObject);

			}
		}
	}
	return layer;
};

function filterLayerContainer(baseKey, apply, container) {
	var layerFilter = {};
	layerFilter.baseKey = baseKey
	layerFilter.apply = apply;
	layerFilter.container = container;
	return layerFilter;
}

// Add styles to the layer that is added .
iHealthMap.addStyle = function (layerFilter) {
	//console.log("Styling the world map for the given data");
	if (!layerFilter) { // TODO change it later make seperate functions which are in addstyle
		var layerFilter = {};
		layerFilter.baseKey = 'ISO_3_CODE';
		layerFilter.apply = false;
		layerFilter.container = [];
	}
	var styling = {};
	styling.data = '';
	iHealthMap.stylingdata = '';
	styling.filterParams = [];

	if (iHealthMap.checkFilter() == 1) {
		styling.filterParams = iHealthMap.getFilterParam();

		dureOverlays.clearOverlays();
		gaviOverlays.clearOverlays();

		// console.log(iHealthMap.filterType);
		// if(iHealthMap.filterType == 'region'){
		// styling.filterParams = iHealthMap.getRegionFilter();
		// }else{
		// styling.filterParams = iHealthMap.getFilterParam();
		// }
		//console.log(styling.filterParams);

		// Array of different regions
		var checkRegionFilterParams = ['Gavi', 'Non-Gavi', 'AFRO', 'AMRO', 'EMRO', 'EURO', 'SEARO', 'WPRO', 'Central America', 'Central Asia', 'East Asia', 'Eastern Europe', 'Middle East', 'North Africa', 'North America', 'South America', 'South Asia', 'South-East Asia', 'Sub-Saharan Africa', 'Western Europe'];

		// Check for the region if it exsist in array.
		if ($.inArray(styling.filterParams, checkRegionFilterParams) > -1) {
			//console.log("Region Filter called.");
			//console.log(styling.filterParams);
			//console.log(iHealthMap.checkRegionFilterChange());

			// On filter change clears data object copy and clears the option.
			if (iHealthMap.checkRegionFilterChange()) {

				iHealthMap.dataProviderWorkingFilteredCopy = {};
				iHealthMap.clearFilterOptions();
				iHealthMap.isRegionFilterChanged = false;
			}

			var regionData = [];
			var regionFlag = false;
			for (var index in dureMasterRegionList) {
				for (regionName in dureMasterRegionList[index]) {
					if (regionName == styling.filterParams) {
						regionData = dureMasterRegionList[index][regionName];
						regionFlag = true;
						break;
					}
				}
				if (regionFlag) {
					break;
				}
			}

			// console.log(regionData);
			styling.data = iHealthMap.getFilteredRegions(regionData);
			iHealthMap.stylingdata = iHealthMap.getFilteredRegions(regionData);
		} else {
			//console.log("Data Filter called.");
			styling.data = iHealthMap.getFilteredData(styling.filterParams);
			iHealthMap.stylingdata = iHealthMap.getFilteredData(styling.filterParams);
		}
		//console.log("Line 241: Filtered Data below.");
		//console.log(styling.data);
	} else {
		//console.log("Data without any filter called.");
		styling.data = iHealthMap.getDataFromProvider();
		iHealthMap.stylingdata = iHealthMap.getDataFromProvider();
		//console.log("Line 245:Initial Data below.");
		//console.log(styling.data);
	}

	var universalTimeData = iHealthMap.dataProvider;
	var objectOfCountryObjects = {};
	var keys = Object.keys(universalTimeData);

	$.each(keys, function (k, v) {

		var dataForAYear = universalTimeData[v];
		var innerDataForAYear = dataForAYear[0];

		for (var key in innerDataForAYear) {
			var countryObject = {};
			countryObject[key] = innerDataForAYear[key];
			objectOfCountryObjects[key] = countryObject[key];
		}
	});

	dureUtil.onEachCall = 'addStyle';
	iHealthMap.geojsonLayer = L.geoJson(iHealthMap.geoJson, {
		//filter: function(feature) {	return filterLayer(feature, layerFilter); },     // show only selected layers
		style: style,
		onEachFeature: onEachFeature
	});

	function filterLayer(feature, layerFilter) {
		var returnFilter = true;
		if (layerFilter.apply) {
			//			console.log(layerFilter);
			var id = feature.properties[layerFilter.baseKey];
			returnFilter = idParser(layerFilter.container, id);
		}
		return returnFilter;
	}

	function idParser(container, id) {
		var retCheck = false;
		for (var i in container) {
			if (container.hasOwnProperty(i)) {
				if (container[i][0] === id) {
					retCheck = true;
					break;
				} else {
					if (container[i] === id) {
						retCheck = true;
						break;
					}
				}
			}
		}
		return retCheck;
	}

	iHealthMap.geojsonLayer.addTo(iHealthMap.map);

	if (dureUtil.timeline != undefined) {
		iHealthMap.map.removeLayer(dureUtil.timeline);
	}
	// Hardcoding of timeline for viewhub - Start

	if ($.inArray(dureUtil.indicatorId, introducedIndicatorArray) > -1) {

		if (dureUtil.respJsonData.filterGroups != undefined) {
			var filterGroupsData = dureUtil.respJsonData.filterGroups;
			iHealthMap.FilterDataArr = [];

			for (var i = 0; i < filterGroupsData.length; i++) {
				if (filterGroupsData[i].filterGroupName == dureUtil.indicatorName) {
					for (var j = 0; j < filterGroupsData[i].filterSubGroups.length; j++) {
						/*for (var k = 0; k < filterGroupsData[i].filterSubGroups[j].filters.length; k++) {
						var tempArr = [];
						tempArr = [filterGroupsData[i].filterSubGroups[j].filters[k].filterName, filterGroupsData[i].filterSubGroups[j].filters[k].filterColor];
						iHealthMap.FilterDataArr.push(tempArr);
						}*/
						var tempArr = [];
						tempArr = [filterGroupsData[i].filterSubGroups[j].filterSubGroupName, filterGroupsData[i].filterSubGroups[j].filterSubGroupColor];
						iHealthMap.FilterDataArr.push(tempArr);
					}
				}
			}
		}

		try {
			iHealthMap.map.removeControl(dureUtil.timeline.timeSliderControl);
		} catch (e) { }

		/* Clear default map as it is showing two sheds of color with previous layer present */
		iHealthMap.clearLayer();

		// showTimeLineSeries(iHealthMap.dataProvider);
		showTimeLineSeries(styling.data);
		$('.play').trigger('click');
	} else {
		try {
			iHealthMap.map.removeControl(dureUtil.timeline.timeSliderControl);
		} catch (e) { }
	}
	// Hardcoding of timeline for viewhub - End

	function style(feature) {
		var styleObj = getColorForRegion(feature.properties);

		if (dureUtil.scaleRangeCat.apply) {
			prepareScaleWiseRegionList(styleObj, feature.properties)
		}
		var classNam = 'range-' + styleObj.scaleColor.replace(new RegExp('#', 'g'), "");

		if (!filterLayer(feature, layerFilter)) {
			styleObj.scaleColor = '#ccc';
			classNam = 'range-' + styleObj.scaleColor.replace(new RegExp('#', 'g'), "");
		}

		return {
			weight: 1.4,
			opacity: 1,
			color: '#ffffff',
			fillOpacity: 0.7,
			fillColor: styleObj.scaleColor,
			className: classNam
		};
	}

	// Get the style of the layer ()
	function getLayerStyle(layer) {
		var layerStyleObj = {};
		if (layer.options != undefined) {
			layerStyleObj.className = layer.options.className;
			layerStyleObj.fillColor = layer.options.fillColor;
		} else {
			var getLeafletId = layer._leaflet_id;
			var ftrlayer = layer._layers;
			layerStyleObj.className = ftrlayer[getLeafletId - 1].options.className;
			layerStyleObj.fillColor = ftrlayer[getLeafletId - 1].options.fillColor;
		}
		return layerStyleObj;
	}

	// Seperate Countries according to their scale value
	function prepareScaleWiseRegionList(styleObj, properties) {

		var scaleRangeName = 'range-' + styleObj.scaleColor.replace(new RegExp('#', 'g'), "");
		var countryName = properties.name;
		var metaContainer = [];
		if (!dureUtil.scaleRangeCat.regionList.hasOwnProperty(scaleRangeName)) {
			dureUtil.scaleRangeCat.regionList[scaleRangeName] = [];
		}
		metaContainer.push(countryName);
		metaContainer.push(styleObj.scaleValue);
		dureUtil.scaleRangeCat.regionList[scaleRangeName].push(metaContainer);
	}

	function onEachFeature(feature, layer) {

		var popup_content = buildPopup();

		iHealthMap.checkLabelBind = false;
		if (popup_content != undefined) {
			layer.bindLabel(popup_content);
		}

		layer.on({
			mouseover: highlightFeature,
			mouseout: resetHighlight
		});

		$(layer).click(function (e) {
			// Change region info after 300 milliseconds

			//console.log(e);
			console.log(layer.feature);
			var layerFeature = layer.feature;

			setTimeout(function () {
				dureUtil.setCountryRegionId(countryIdMapping[layer.feature.id].regionId); // TODO 16/3/2015
				dureUtil.setCountryId(countryIdMapping[layer.feature.id].countryId); // set countryId (get id from codes.js)
				iHealthMap.dbClickCrntObj = e;
				changeRegionInfo();

				if (dureUtil.getIndicatorId() == 182 || dureUtil.getIndicatorId() == 183) {
					impactStudies.showPopUp(layerFeature);
				}

			}, 300);
			iHealthMap.setCountryName(layer.feature.properties.name);
		}).dblclick(function (e) {
			//console.log("-------------- Drill downs to country level on dbl click -------");
			//console.log(layer.feature.id);
			dureUtil.setCountryRegionId(countryIdMapping[layer.feature.id].regionId);
			dureUtil.setCountryId(countryIdMapping[layer.feature.id].countryId); // set countryId (get id from codes.js)
			//dureUtil.getDataOnDrillDown();
			iHealthMap.dbClickCrntObj = e;
			// Deactivates REGION-LEVEL functionality of slider.
			iHealthMap.deActivateSliderControls();
		});

		function changeRegionInfo() {
			iHealthMap.OpenInfoContainer();
			var countryCode = layer.feature.properties.iso_a3;
			showCountryInfo();
			iHealthMap.changeChartInfoForCountry(countryCode);
		}

		function showCountryInfo() {

			iHealthMap.checkLabelBind = true;
			var popInfo = {};
			popInfo.data = styling.data;
			popInfo.regData = '';
			popInfo.regExtData = '';
			popInfo.keyContent = '';
			popInfo.extContent = '';
			popInfo.content = '';
			popInfo.level = iHealthMap.checkDataLevel();
			popInfo.countryName = layer.feature.properties.name;

			if (popInfo.data != undefined) {
				if (iHealthMap.checkDataLevel() == 0) {
					popInfo.regData = selectTargetDataByParamFromJson('region');
					popInfo.regExtData = selectTargetDataByParamFromJson('regionExt');
				} else if (iHealthMap.checkDataLevel() == 1) {
					popInfo.regData = selectIndicatorDataByParamFromJson('region');
					popInfo.regExtData = selectIndicatorDataByParamFromJson('regionExt');
				}
				if (popInfo.regData != '') {

					popInfo.keyContent = buildPopupContent(popInfo.regData, popInfo.level);
					var indicatorContainerVaccineIntroduction = [52, 53, 54, 55, 106, 57, 56, 58, 59, 60, 68, 69, 76, 77, 109, 110, 62, 61, 63, 64, 65, 70, 71, 80, 81, 111, 112, 118, 120, 121, 122];
					if ($.inArray(dureUtil.respJsonData.indicatorMetaInfo[0].indicatorInfo.indicatorId, indicatorContainerVaccineIntroduction) > -1) {

						if (popInfo.regData[1].indexOf("Evaluation of vaccine impact") > -1) {
							popInfo.extContent += "<div> " + popInfo.regData[1][popInfo.regData[1].indexOf("Evaluation of vaccine impact")] + " : <span>" + popInfo.regData[0][popInfo.regData[1].indexOf("Evaluation of vaccine impact")] + "</span> </div>";
						}
						if (popInfo.regData[1].indexOf("Number of Impact Studies") > -1) {
							//popInfo.extContent += "<div> " + popInfo.regData[1][popInfo.regData[1].indexOf("Number of Impact Studies")] + " : <span>" + popInfo.regData[0][popInfo.regData[1].indexOf("Number of Impact Studies")] + "</span> </div>";
						}

					}
				}
				if (popInfo.regExtData != '') {
					popInfo.extContent = buildPopupContent(popInfo.regExtData, popInfo.level);
				}

				if (popInfo.keyContent != '' || popInfo.extContent != '') {
					popInfo.content += buildTabsHtml(popInfo.keyContent, popInfo.extContent);
				} else {
					popInfo.content += "<div>No data available for this region.</div>"
				}
			}
			$('.embPopupBody').html(popInfo.content);
			$('.regionInfo').html(popInfo.countryName + ' Info');

			if (dureUtil.getIndicatorMetaInfoByParam('dataFormat') == 'Standard') {

				$('.loadChart').show();
			} else {
				$('.loadChart').hide();
			}
		}

		function highlightFeature(e) {
			layer.setStyle({
				weight: 1,
				color: '#ffffff',
				dashArray: '',
				fillOpacity: 0.7,
				fillColor: "#666"
			});
			if (!L.Browser.ie && !L.Browser.opera) {
				// layer.bringToFront();
			}
			
			if (iHealthMap.checkFilter() == 0) {
				var layerStyle = getLayerStyle(layer);
				iHealthMap.legendControl.highLightScale(layerStyle.className, layerStyle.fillColor, 'bold', '12px'); // When hover on map highlight the legend scale
			}
		}

		function resetHighlight(e) {
			if (iHealthMap.checkFilter() == 0) {
				var layerStyle = getLayerStyle(e.target);
				iHealthMap.legendControl.highLightScale(layerStyle.className, '#555', 'normal', '12px');
			}
			iHealthMap.geojsonLayer.resetStyle(e.target);
		}

		/*function buildPopup() {
		var imageFlacCls = layer.feature.properties.iso_a2;
		if (!imageFlacCls) {
		return false;
		}
		imageFlacCls = dureUtil.getISO_a2FromISO_a3(imageFlacCls).toLowerCase();
		var popup = {};
		popup.content = '';
		popup.data = '';
		popup.totContd = '';
		popup.content += '<div class="popContainer f32" style="padding: 5px;">' + '<div class="popupHeader"><span class="flag ' + imageFlacCls + '" style="float:left"></span><b>' + layer.feature.properties.name + '</b></div>';
		//  popup.data = iHealthMap.stylingdata;

		if (objectOfCountryObjects[layer.feature.properties.iso_a3] != undefined) {
		// build my popup here
		var arrayOfValues = objectOfCountryObjects[layer.feature.properties.iso_a3];

		console.log(arrayOfValues);

		popup.content += "<div class='popupBody'><div class='extensionData'><h1>Key Data</h1></div><div> " + arrayOfValues[1][0] + " : <span class='pull-right'>" + arrayOfValues[0][0] + "</span> </div>";
		popup.totContd = '<div class="popupBody"> ' + popup.content + ' </div>';
		}else {
		popup.totContd = '<div class="popupBody" style="padding:5px;"> Data for this region is unavailable. </div>';
		}
		return popup.totContd;
		}*/

		function buildPopup(data, indicatorId) {
			var imageFlacCls = layer.feature.properties.iso_a2;
			if (!imageFlacCls) {
				return false;
			}
			imageFlacCls = dureUtil.getISO_a2FromISO_a3(imageFlacCls).toLowerCase();

			var popup = {};
			popup.content = '';
			popup.data = styling.data;
			popup.totContd = '';
			popup.regData = '';

			popup.content += '<div class="popContainer f32" style="padding: 5px;">' + '<div class="popupHeader"><span class="flag ' + imageFlacCls + '" style="float:left"></span><b>' + layer.feature.properties.name + '</b></div>';
			popup.dataLvl = iHealthMap.checkDataLevel();
			if (popup.data != undefined) {
				if (popup.dataLvl == 0) {
					popup.regData = selectTargetDataByParamFromJson('region');
					//popup.regExtData = selectTargetDataByParamFromJson('regionExt');
				} else if (popup.dataLvl == 1) {
					popup.regData = selectIndicatorDataByParamFromJson('region');
					//popup.regExtData = selectIndicatorDataByParamFromJson('regionExt');
				}

				if (popup.regData != '') {
					var arrayOfValues = popup.regData;
					//popup.body = buildHoverPopupHtml(layer.feature.properties.name, buildPopupContent(popup.regData));
					if (arrayOfValues[0][0] == -1) {
						arrayOfValues[0][0] = "N/A";
					}
					popup.content += "<div class='popupBody'><div class='extensionData'><h1>Key Data</h1></div><div> " + arrayOfValues[1][0] + " : <span class='pull-right'>" + dureUtil.numberWithCommas(arrayOfValues[0][0]) + "</span> </div>";
					popup.totContd = '<div class="popupBody"> ' + popup.content + ' </div>';
				} else {
					popup.totContd = '<div class="popupBody" style="padding:5px;"> Data for this country is unavailable. </div>';
				}
			}

			return popup.totContd;
		}

		function buildHoverPopupHtml(header, data) {

			var html = '<div class="box box-primary box-solid box-transparent">' +
				'<div class="box-header" data-toggle="tooltip" title="" data-original-title="Header tooltip">' +
				'<h5 class="box-title">' + header + '</h5>' +
				'</div>' +
				'<div class="box-body">'
				+ data +
				'</div>' +
				'</div>';

			return html;
		}

		/* function buildPopup(){
		var popup = {};
		popup.content = '';
		popup.totContd = '';
		popup.content += '<div class="popContainer">'+'<div class="popupHeader"><b>' + layer.feature.properties.name + '</b></div>' ;
		popup.data = styling.data;
		popup.regData = '';
		popup.regExtData = '';
		popup.dataLvl = iHealthMap.checkDataLevel();
		if(popup.data != undefined){
		if(popup.dataLvl == 0){
		popup.regData = selectTargetDataByParamFromJson('region');
		popup.regExtData = selectTargetDataByParamFromJson('regionExt');
		}else if(popup.dataLvl == 1){
		popup.regData = selectIndicatorDataByParamFromJson('region');
		popup.regExtData = selectIndicatorDataByParamFromJson('regionExt');
		}
		if (popup.regData != '') {
		popup.content += "<div class='coreData'><h1>Key Data</h1></div>" + buildPopupContent(popup.regData,popup.dataLvl);
		}
		if(popup.regExtData != ''){
		popup.content += "<div class='extensionData'><h1>Supporting Data</h1></div>" + buildPopupContent(popup.regExtData,popup.dataLvl);
		}
		popup.totContd =  '<div class="popupBody"> '+popup.content+' </div>';
		}
		popup.totContd  += '</div>';
		return popup.totContd;
		} */

		// Selects proper data required from the data set in Json object.
		function selectTargetDataByParamFromJson(dataType) {
			var selectParam = {};
			selectParam.reg == '';
			selectParam.data = styling.data;
			if (dataType == 'region') {
				selectParam.reg = selectTargetRegData(selectParam.data);
			} else if (dataType == 'regionExt') {
				selectParam.reg = selectTargetRegExtData(selectParam.data);
			}
			return selectParam.reg;
		}

		// Selects region data required from the data set in Json object.
		function selectTargetRegData(data) {

			var selectdataReg = {};
			selectdataReg.res = '';
			selectdataReg.data = data;
			if (selectdataReg.data.regions != undefined) {
				if (selectdataReg.data.regions[2].regionData[0][iHealthMap.currentYear][0][layer.feature.properties.iso_a3] != undefined) {
					selectdataReg.res = selectdataReg.data.regions[2].regionData[0][iHealthMap.currentYear][0][layer.feature.properties.iso_a3];
				} else if (selectdataReg.data.regions[2].regionData[0][iHealthMap.currentYear][0][layer.feature.properties.iso_a2] != undefined) {
					selectdataReg.res = selectdataReg.data.regions[2].regionData[0][iHealthMap.currentYear][0][layer.feature.properties.iso_a2];
				}
			}
			return selectdataReg.res;
		}

		// Selects region data extension required from the data set in Json object.
		function selectTargetRegExtData(data) {
			var selRegExt = {};
			selRegExt.res = '';
			selRegExt.data = data;
			if (selRegExt.data.regions != undefined) {
				if (selRegExt.data.regions[3].regionDataExtension[0][iHealthMap.currentYear][0][layer.feature.properties.iso_a3] != undefined) {
					selRegExt.res = selRegExt.data.regions[3].regionDataExtension[0][iHealthMap.currentYear][0][layer.feature.properties.iso_a3];
				} else if (selRegExt.data.regions[3].regionDataExtension[0][iHealthMap.currentYear][0][layer.feature.properties.iso_a2] != undefined) {
					selRegExt.res = selRegExt.data.regions[3].regionDataExtension[0][iHealthMap.currentYear][0][layer.feature.properties.iso_a2];
				}
			}
			return selRegExt.res;
		}

		function selectIndicatorDataByParamFromJson(dataType) {
			var selectParam = {};
			selectParam.reg == '';
			selectParam.data = styling.data;
			//	console.log(styling.data);
			//	console.log(dataType);
			if (dataType == 'region') {
				selectParam.reg = selectIndicatorKeyData(selectParam.data);
			} else if (dataType == 'regionExt') {
				selectParam.reg = selectIndicatorExtData(selectParam.data);
				selectParam.reg = ''; // Hardcoding for supporting data time being 18-03-2015 - KUNAL
			}
			return selectParam.reg;
		}

		// Selects region data required from the data set in Json object.
		function selectIndicatorKeyData(data) {

			var selectdataReg = {};
			selectdataReg.res = '';
			selectdataReg.data = data;
			/* if(selectdataReg.data.regions != undefined){
			if(selectdataReg.data.regions[2].regionData[0][iHealthMap.currentYear][0][layer.feature.properties.iso_a3] != undefined){
			selectdataReg.res = selectdataReg.data.regions[2].regionData[0][iHealthMap.currentYear][0][layer.feature.properties.iso_a3];
			}else if(selectdataReg.data.regions[2].regionData[0][iHealthMap.currentYear][0][layer.feature.properties.iso_a2] != undefined){
			selectdataReg.res = selectdataReg.data.regions[2].regionData[0][iHealthMap.currentYear][0][layer.feature.properties.iso_a2];
			}
			} */
			// TODO 18/03/2015
			if (selectdataReg.data != undefined) {
				if (selectdataReg.data[iHealthMap.getCurrentyear()][0][layer.feature.properties.iso_a3] != undefined) {
					selectdataReg.res = selectdataReg.data[iHealthMap.getCurrentyear()][0][layer.feature.properties.iso_a3];
				} else if (selectdataReg.data[iHealthMap.getCurrentyear()][0][layer.feature.properties.iso_a2] != undefined) {
					selectdataReg.res = selectdataReg.data[iHealthMap.getCurrentyear()][0][layer.feature.properties.iso_a2];
				}
			}
			return selectdataReg.res;
		}

		// Selects region data extension required from the data set in Json object.
		function selectIndicatorExtData(data) {
			// //console.log("Line 468 : ============= Indicator extension data ================");
			var selRegExt = {};
			selRegExt.res = '';
			selRegExt.data = data;
			if (selRegExt.data != undefined) {
				// John hopkins world level array.
				if (selRegExt.data[iHealthMap.getCurrentyear()][0][layer.feature.properties.iso_a3] != undefined) {
					selRegExt.res = selRegExt.data[iHealthMap.getCurrentyear()][0][layer.feature.properties.iso_a3];
				} else if (selRegExt.data[iHealthMap.getCurrentyear()][0][layer.feature.properties.iso_a2] != undefined) {
					selRegExt.res = selRegExt.data[iHealthMap.getCurrentyear()][0][layer.feature.properties.iso_a2];
				}
			}
			return selRegExt.res;
		}

		// Builds the popup content which will present the data in ATTRIBUTE : VALUE pair.
		function buildPopupContent(popData, level) {
			// //console.log("Line 466: Building pop content.");
			//console.log(popData);
			var popup = {};
			popup.codes = [];
			popup.result = '';
			if (level == 0) {
				popup.result = buildTrgtData(popData);
			} else {

				if (iHealthMap.getIndicatorDataType() == 'Standard') {
					popup.result = buildStdIndData(popData, popup.codes);
				} else {
					popup.result = buildNonStdIndData(popData, popup.codes);
				}
			}
			return popup.result;
		}

		function buildTrgtData(data) {
			var targt = {};
			targt.attr = data[1];
			targt.val = data[0];
			targt.contnt = '';
			for (var i = 0; i < targt.attr.length; i++) {
				targt.contnt += "<div> " + targt.attr[i] + " : <span class='badge bg-badge'>" + targt.val[i] + "</span> </div>";
			}
			return targt.contnt;
		}

		function buildStdIndData(data, codes) { // TODO 17/03/2015
			var indStd = {};
			indStd.attr = data[1];
			indStd.val = data[0];
			indStd.contnt = '';
			for (var i = 0; i < indStd.attr.length; i++) {

				if (indStd.val[i] != null) {
					if (indStd.val[i] == -1) { //-1 Changes
						indStd.contnt += "<div> " + indStd.attr[i] + " : <span class='badge bg-badge'>NA</span> </div>";
					} else {
						indStd.contnt += "<div> " + indStd.attr[i] + " : <span class='badge bg-badge'>" + dureUtil.numberWithCommas(indStd.val[i]) + "</span> </div>";
					}
				}
			}
			return indStd.contnt;
		}

		function buildNonStdIndData(data, codes) {
			var indNstd = {};

			if (iHealthMap.checkLabelBind) {
				var indicatorContainerVaccineIntroduction = [52, 53, 54, 55, 106, 57, 56, 58, 59, 60, 68, 69, 76, 77, 109, 110, 62, 61, 63, 64, 65, 70, 71, 80, 81, 111, 112, 118, 120, 121, 122];
				if ($.inArray(dureUtil.respJsonData.indicatorMetaInfo[0].indicatorInfo.indicatorId, indicatorContainerVaccineIntroduction) > -1) {
					indNstd.attr = data[1];
					indNstd.val = data[0];
					indNstd.contnt = '';
					// console.log(indNstd);
					for (var i = 0; i < 5; i++) {
						indNstd.contnt += "<div> " + indNstd.attr[i] + " : <span class='pull-right'>" + indNstd.val[i] + "</span> </div>";
					}
					return indNstd.contnt;
				}
			}

			indNstd.attr = data[1];
			indNstd.val = data[0];
			indNstd.contnt = '';
			if (codes.length == 0) {
				for (var i = 0; i < 5; i++) {

					if (indNstd.val[i] != null) {

						indNstd.contnt += "<div> " + indNstd.attr[i] + " : <span class='badge bg-badge'>" + indNstd.val[i] + "</span> </div>";
					}
				}
			} else {
				for (var i = 0; i < codes.length; i++) {

					if (indNstd.val[i] != null) {

						indNstd.contnt += "<div> " + indNstd.attr[i] + " : <span class='badge bg-badge'>" + indNstd.val[i] + "</span> </div>";
					}
				}
			}
			return indNstd.contnt;
		}

		function buildTabsHtml(core, ext) {
			if (core == '') {
				core = "No key data available.";
			}
			if (ext == '') {
				ext = "No extension data available.";
			}

			/*  LABLE FOR THE TAB HEADERS AS PER THE SELECTED INDICATOR
			FOR PCV INDICATORS IT SHOULD RENAME AS INTRO TAB AND IMPACT TAB */

			/* using indicator id for checking conditions */

			//var arryOfPCV_Indicators = [51, 52, 53, 54, 55, 74, 75,120];
			//var arryOfPCV_Indicators = [51, 52, 53, 54, 55, 74, 75, 120, 57, 56, 58, 59, 60, 166, 160, 77, 109, 110, 157];
			var arryOfPCV_Indicators = [51, 52, 53, 54, 55, 74, 75, 120, 57, 56, 58, 59, 60, 166, 160, 77, 109, 110, 157, 61, 62, 63, 64, 65, 118, 119, 120, 121, 122, 117];
			var currentIndicatorID = dureUtil.indicatorId;

			var pcvIndicatorFlag = jQuery.inArray(currentIndicatorID, arryOfPCV_Indicators);

			if (pcvIndicatorFlag > -1) {

				/* if selected indicator is from pcv indicators */
				var tabLable1 = 'Intro';
				var tabLable2 = 'Impact';

			} else {

				/* if selected indicator is not from pcv indicators */
				var tabLable1 = 'Key data';
				var tabLable2 = 'Supporting data';

			}

			var html = '<div class="nav-tabs-custom">' +
				'<ul class="nav nav-tabs">' +
				'<li class="active"><a href="#tab_1-1" data-toggle="tab">' + tabLable1 + '</a></li>' +
				'<li class=""><a href="#tab_2-2" data-toggle="tab">' + tabLable2 + '</a></li>' +
				'</ul>' +
				'<div class="tab-content" style="min-width:50%">' +
				'<div class="tab-pane active" id="tab_1-1">' + core +
				'</div><!-- /.tab-pane -->' +
				'<div class="tab-pane" id="tab_2-2">' + ext +
				'</div><!-- /.tab-pane -->' +
				'</div><!-- /.tab-content -->' +
				'</div>' + '<div><a href="javascript:void(0)" class="loadChart" data-target="#chart-modal" data-toggle="modal"><i class="fa fa-bar-chart fa-2x"></i></a><span class="iconsholder"></span><div>';
			return html;
		}
	}

	function getColorForRegion(e) {
		var colorRegion = {};
		colorRegion.data = styling.data;
		//console.log(colorRegion.data);
		colorRegion.dataType = iHealthMap.checkDataLevel();
		if (colorRegion.dataType == 0) {
			return getTargetRegionColor(e, colorRegion.data);
		} else if (colorRegion.dataType == 1) {
			return getIndicatorRegionColor(e, colorRegion.data);
		}
	}

	// Gets the color according the data-scale and color-scale from provided data .
	function getTargetRegionColor(e, data) {
		var targtRegData = {};
		targtRegData.data = data;
		if (targtRegData.data == undefined) {
			return '#fff';
		} else if (targtRegData.data[iHealthMap.currentYear][0][e.iso_a2] != undefined) {
			targtRegData.regdata = targtRegData.data[iHealthMap.currentYear][0][e.iso_a2][0][2];
			return getColorScaleForData(targtRegData.regdata);
		} else if (targtRegData.data[iHealthMap.currentYear][0][e.iso_a3] != undefined) {
			targtRegData.regdata = targtRegData.data[iHealthMap.currentYear][0][e.iso_a3][0][2];
			return getColorScaleForData(targtRegData.regdata);
		} else {
			return '#3498db';
		}
	}

	// Gets the color according the data-scale and color-scale from provided data .
	function getColorScaleForData(param) {
		console.log(param);
		var scale = {};
		scale.data = iHealthMap.jsondata.data.targets[0].targetInfo.dataScale;
		scale.color = iHealthMap.jsondata.data.targets[0].targetInfo.colorScale;
		for (var i = 0; i < scale.data.length; i++) {
			if (data > scale.data[i] && data < scale.data[i + 1]) {
				scale.regionColor = scale.color[i];
			} else if (data == scale.data[scale.data.length - 1]) {
				scale.regionColor = scale.color[scale.data.length - 1];
			}
		}
		return scale.regionColor;
	}

	function getIndicatorRegionColor(e, data) {
		var indClr = {};
		indClr.data = data;
		indClr.type = iHealthMap.getIndicatorDataType();
		if (indClr.type == 'Standard') {
			return getStdIndicatorRegionColor(e, indClr.data);
		} else {
			return getNonStdIndicatorRegionColor(e, indClr.data);
		}
	}

	function getStdIndicatorRegionColor(e, data) { //TODO 13/2/2015
		var stdRegColor = {};
		stdRegColor.data = data;
		var returnStyleObj = {};
		returnStyleObj.scaleColor = '';
		returnStyleObj.scaleValue = '';
		//console.log(data);
		//console.log(e.iso_a3);
		//console.log(iHealthMap.getCurrentyear());

		if (stdRegColor.data == undefined) {
			returnStyleObj.scaleColor = '#CFCFCF';
			returnStyleObj.scaleValue = null;
			return returnStyleObj;
		} else {
			if (stdRegColor.data[iHealthMap.getCurrentyear()][0][e.iso_a3] != undefined) {
				//console.log('render the style for the layer');
				//return stdRegColor.data[iHealthMap.getCurrentyear()][0][e.iso_a3][2][0];

				/* check the data for range and get color */
				return iHealthMap.rangeCompare(dureUtil.respJsonData.indicatorMetaInfo[0].indicatorInfo.levels[0].scales[0].linear[0], stdRegColor.data[iHealthMap.getCurrentyear()][0][e.iso_a3][0][0], returnStyleObj);

			} else {
				returnStyleObj.scaleColor = '#CFCFCF';
				returnStyleObj.scaleValue = null;
				return returnStyleObj;
			}
		}
	}

	function getNonStdIndicatorRegionColor(e, data) {
		var nStdRegColor = {};
		var returnStyleObj = {};
		returnStyleObj.scaleColor = '#CFCFCF';
		returnStyleObj.scaleValue = null;
		nStdRegColor.data = data;

		if (nStdRegColor.data != undefined) {
			if (nStdRegColor.data[iHealthMap.getCurrentyear()][0][e.iso_a3] != undefined) {
				for (var i = 0; i < iHealthMap.FilterDataArr.length; i++) {
					if (nStdRegColor.data[iHealthMap.getCurrentyear()][0][e.iso_a3][0][0] != null) {

						if (dureUtil.trim(iHealthMap.FilterDataArr[i][0].toLowerCase()) == dureUtil.trim(nStdRegColor.data[iHealthMap.getCurrentyear()][0][e.iso_a3][0][0].toLowerCase())) {
							returnStyleObj.scaleColor = iHealthMap.FilterDataArr[i][1];
							returnStyleObj.scaleValue = iHealthMap.FilterDataArr[i][0];
						}

						else {
							if ((dureUtil.getIndicatorId() == 157 || dureUtil.getIndicatorId() == 161)) { // country impact
								returnStyleObj.scaleColor = "#7a7a7a";
								returnStyleObj.scaleValue = "No ongoing/published impact study";
							}
						}
					}
				}
			}
		}

		return returnStyleObj;
	}

	//Reload table data if filter applied.
	if (iHealthMap.checkFilter() == 1) {

		//Load filtered data into table after filteration.
		iHealthTable.loadFilteredData(iHealthMap.stylingdata);
	}
};

// Removes the geoJson Layer present on Map.
iHealthMap.clearLayer = function () {
	//console.log('Clearing layer');
	if (iHealthMap.geojsonLayer != undefined) {
		iHealthMap.map.removeLayer(iHealthMap.geojsonLayer);
	}
	if (iHealthMap.markerTemp != null) {
		iHealthMap.map.removeLayer(iHealthMap.markerTemp);
	}
	if (viewhubjs.yearHighlightLabel != null) {
		iHealthMap.map.removeControl(viewhubjs.yearHighlightLabel);
		viewhubjs.yearHighlightLabel = null;
	}
	// if(dureOverlays.selectLayer != undefined){
	// dureOverlays.removeSelectLayers();
	// }
};

iHealthMap.rangeCompare = function (rangeData, valueTocompare, returnStyleObj) {

	var scaleColor = '';
	var mapDataObj = {}; // TODO

	for (var i = 0; i < rangeData.lowScale.length; i++) {

		if (valueTocompare >= rangeData.lowScale[i] && valueTocompare <= rangeData.highScale[i]) {
			scaleColor = rangeData.colorScale[i];
			returnStyleObj.scaleColor = rangeData.colorScale[i];
			returnStyleObj.scaleValue = valueTocompare;
			break;
		}

	}

	if (valueTocompare == -1 || valueTocompare == 'N/A' && dureUtil.indicatorId != 165) { // temp fix change it later
		returnStyleObj.scaleColor = '#b2b2b2';
	}

	return returnStyleObj;
}

/************************************************ Section: Scale ***********************************************************/

// Gets Map controls required for Map.
iHealthMap.renderMapControls = function (data) {
	var controls = {};
	iHealthMap.renderEmbededPopup();

	if (dureUtil.indicatorId == 51 || dureUtil.indicatorId == 56 || dureUtil.indicatorId == 61 || dureUtil.indicatorId == 119) {

		try {
			iHealthMap.removeSliderControl();
		} catch (e) { }

	} else if (dureUtil.indicatorId == 68 || dureUtil.indicatorId == 69 || dureUtil.indicatorId == 70 || dureUtil.indicatorId == 71 || dureUtil.indicatorId == 72 || dureUtil.indicatorId == 73 || dureUtil.indicatorId == 76 || dureUtil.indicatorId == 77 || dureUtil.indicatorId == 80 || dureUtil.indicatorId == 81 || dureUtil.indicatorId == 84 || dureUtil.indicatorId == 85 || dureUtil.indicatorId == 86 || dureUtil.indicatorId == 87 || dureUtil.indicatorId == 107 || dureUtil.indicatorId == 108 || dureUtil.indicatorId == 109 || dureUtil.indicatorId == 110 || dureUtil.indicatorId == 111 || dureUtil.indicatorId == 112 || dureUtil.indicatorId == 159 ||dureUtil.indicatorId == 182 ||dureUtil.indicatorId == 183) {

		try {
			iHealthMap.renderSlider();
		} catch (e) { }
	}

	//Hide filter button
	//var hidefilter = [51,66,67,72,73,107,108,56,68,69,76,77,109,110,61,70,71,80,81,111,112,119];
	//var hidefilter = [66,67,72,73,107,108,56,68,69,76,77,109,110,61,70,71,80,81,111,112,119];
	var hidefilter = [66, 67, 72, 73, 107, 108, 68, 69, 76, 77, 109, 110, 61, 70, 71, 80, 81, 111, 112];

	if ($.inArray(dureUtil.indicatorId, hidefilter) > -1) {
		$("#filterBtn").hide();
	} else {
		$("#filterBtn").show();
	}

	//if($('.dataSourceWrap').length == 0){
	iHealthMap.createSourceLabel();
	iHealthMap.createSourceLabel1();
	//}
	// iHealthMap.renderCountryListDropdown();
	// iHealthMap.renderFilter();
};

// Renders Legend if it does not exsist on map .
iHealthMap.renderLegend = function (data) {
	// console.log("++++++++ Inside render legend func +++++++");
	//console.log(data);
	if ($('.legend').length == 0) {
		if (data != undefined) {
			iHealthMap.createLegendControl(data);
		} else {
			//console.log("You have undefined data in this piece of code.");
		}
	}

};

// Creates a legend control on the Map.
iHealthMap.createLegendControl = function (param) {

	var legend = {};

	var documentFragment = $(document.createDocumentFragment());
	console.log(iHealthMap.getIndicatorDataType());
	// console.log("++++++++ Inside create legend +++++++");
	if (iHealthMap.getIndicatorDataType() == "Standard") {
		if (param != undefined) {
			legend.headerText = "Legend";
			legend.colorArr = param.colorScale;
			console.log(JSON.stringify(param));
			legend.highScaleArr = param.highScale;
			legend.lowScaleArr = param.lowScale;
			legend.dataDesp = param.scaleDesc;
			legend.info = '<div class="legend-info"><div class="legendInnerDiv" ><h5 style="font-weight: bold;">' + param.indicatorName + '</h5></div>';
			documentFragment.append('<div style="width:100%;text-align: center;"><h2 style="text-align: center;">' + param.indicatorName + '</h2></div>');
			documentFragment.append('<div class="legend-info" style="width:50%;"><h3>Legend Information: </h3></div><br>');

			for (var i = 0; i < legend.lowScaleArr.length; i++) {
				legend.info += '<div class="legendInnerDiv"><i class="legendstyle" style="background:' + legend.colorArr[i] + '"></i>&nbsp;<span class="showthisrange range-' + legend.colorArr[i].replace(new RegExp('#', 'g'), "") + '">' + legend.dataDesp[i] + '</span></div>'; // add showthisrange class to highlight legend and clickable

				documentFragment.append('<div class="legendInnerDiv" style="width:30%;display:inline-block;font-size:20px !important;"><i style="background:' + legend.colorArr[i] + '"></i>' + legend.dataDesp[i] + '</div>');
			}
			legend.info += "</div>";

			iHealthMap.legendControl = L.control({
				position: "bottomright"
			});
			iHealthMap.legendControl.onAdd = function (map) {
				legend.div = L.DomUtil.create('div', 'scaleWrap');
				// legend.div.innerHTML += '<div class="gradelist"><h2 class="gradelistHeader">' + legend.headerText + '</h2>' + legend.info + '</div>';

				$("#lengendGrid").html("");
				$("#lengendGrid").append(documentFragment);
				legend.div.innerHTML += iHealthMap.buildBoxHtml(legend.headerText, legend.info, 'scaleInfo');
				return legend.div;
			},
				iHealthMap.legendControl.highLightScale = function (scaleClass, clr, weight, size) {
					$('.' + scaleClass).css({
						"color": clr,
						"fontWeight": weight,
						"font-size": size
					});
				},
				iHealthMap.legendControl.getSelectedRange = function () {
					$('.showthisrange').on('click', function () {
						// console.log("This is a  classs");
						// console.log($(this).hasClass( "resetFilter"))
						if ($(this).hasClass("resetFilter") == false) {

							var filteredIdlist;
							$(this).html();
							var rangeClassName = $(this).attr('class').substring($(this).attr('class').lastIndexOf('range-'));
							filteredIdlist = dureUtil.scaleRangeCat.regionList[rangeClassName];
							iHealthMap.clearLayer();
							dureUtil.scaleRangeCat.apply = false;
							var layerFilter = filterLayerContainer('name', true, filteredIdlist);
							iHealthMap.addStyle(layerFilter);
							var that = this;
							var callBackList = {
								layerList: layerFilter,
								colorCode: {
									apply: true,
									code: rangeClassName,
									scale: $(that).html()
								},
							};
							if (filteredIdlist) {
								var notificationMessage = filteredIdlist.length + ' Countries Found <br/>' + 'Range: ' + $(this).html();
								notifications(notificationMessage, callBackList);
							} else {
								var notificationMessage = 'No Countries Found <br/>' + 'Range: ' + $(this).html();
								callBackList.colorCode.apply = false;
								notifications(notificationMessage, callBackList);
							}
							$('.showthisrange').addClass('resetFilter');

						} else {

							iHealthMap.onResettingMap();
						}

					});
				};

			iHealthMap.legendControl.addTo(iHealthMap.map);
			iHealthMap.legendControl.getSelectedRange();
			if (dureUtil.indicatorId == 51 || dureUtil.indicatorId == 56 || dureUtil.indicatorId == 61 || dureUtil.indicatorId == 119) {

				$(".showthisrange").unbind();
			}
		} else {
			//console.log("You have undefined data in this piece of code.");
		}
	} else {
		console.log(param);
		var checkForNA = '';
		var nonStdParam = dureUtil.respJsonData.filterGroups;
		console.log(nonStdParam);
		legend.headerText = "Legend";
		legend.info = '<div class="legend-info"><div class="legendInnerDiv"><h5 style="font-weight: bold;">' + dureUtil.indicatorName + '</h5></div>';

		documentFragment.append('<div style="width:100%;text-align: center;"><h2 style="text-align: center;">' + dureUtil.indicatorName + '</h2></div>');
		documentFragment.append('<div class="legend-info" style="width:50%;"><h3>Legend Information: </h3></div><br>');

		for (var i = 0; i < nonStdParam.length; i++) {
			if (nonStdParam[i].filterGroupName == dureUtil.indicatorName) {
				for (var j = 0; j < nonStdParam[i].filterSubGroups.length; j++) {

					if (nonStdParam[i].filterSubGroups[j].filterSubGroupName == 'N/A') {
						checkForNA = nonStdParam[i].filterSubGroups[j].filterSubGroupName;
					} else {
						legend.info += '<div class="legendInnerDiv"><i class="legendstyle" style="background:' + nonStdParam[i].filterSubGroups[j].filterSubGroupColor + '"></i>&nbsp;<span class="showthisrange range-' + nonStdParam[i].filterSubGroups[j].filterSubGroupColor.replace(new RegExp('#', 'g'), "") + '">' + nonStdParam[i].filterSubGroups[j].filterSubGroupName + '</span></div>'; // add showthisrange class to highlight legend and clickable

						documentFragment.append('<div class="legendInnerDiv" style="width:30%;display:inline-block;font-size:20px !important;"><i style="background:' + nonStdParam[i].filterSubGroups[j].filterSubGroupColor + '"></i>' + nonStdParam[i].filterSubGroups[j].filterSubGroupName + '</div>');
					}
				}
			}
		}

		if (checkForNA == 'N/A') {
			legend.info += '<div class="legendInnerDiv"><i class="legendstyle" style="background:#cbcfd3"></i>&nbsp;<span class="showthisrange range-cbcfd3" style="color: rgb(85, 85, 85); font-weight: normal; font-size: 12px;">N/A</span></div>';

			documentFragment.append('<div class="legendInnerDiv"><i class="legendstyle" style="background:#cbcfd3"></i>&nbsp;<span class="showthisrange range-cbcfd3" style="color: rgb(85, 85, 85); font-weight: normal; font-size: 12px;">N/A</span></div>');
		}

		legend.info += "</div>";

		iHealthMap.legendControl = L.control({
			position: "bottomright"
		});
		iHealthMap.legendControl.onAdd = function (map) {
			legend.div = L.DomUtil.create('div', 'scaleWrap');
			// legend.div.innerHTML += '<div class="gradelist"><h2 class="gradelistHeader">' + legend.headerText + '</h2>' + legend.info + '</div>';

			$("#lengendGrid").html("");
			$("#lengendGrid").append(documentFragment);
			legend.div.innerHTML += iHealthMap.buildBoxHtml(legend.headerText, legend.info, 'scaleInfo');
			return legend.div;
		},
			iHealthMap.legendControl.highLightScale = function (scaleClass, clr, weight, size) {
				$('.' + scaleClass).css({
					"color": clr,
					"fontWeight": weight,
					"font-size": size
				});
			},
			iHealthMap.legendControl.getSelectedRange = function () {
				$('.showthisrange').on('click', function () {
					//console.log("This is a  classs");
					//console.log($(this).hasClass( "resetFilter"))

					if ($(this).hasClass("resetFilter") == false) {
						var filteredIdlist;
						$(this).html();
						var rangeClassName = $(this).attr('class').substring($(this).attr('class').lastIndexOf('range-'));
						filteredIdlist = dureUtil.scaleRangeCat.regionList[rangeClassName];
						iHealthMap.clearLayer();
						dureUtil.scaleRangeCat.apply = false;
						var layerFilter = filterLayerContainer('name', true, filteredIdlist);
						iHealthMap.addStyle(layerFilter);
						var that = this;
						var callBackList = {
							layerList: layerFilter,
							colorCode: {
								apply: true,
								code: rangeClassName,
								scale: $(that).html()
							},
						};
						if (filteredIdlist) {
							var notificationMessage = filteredIdlist.length + ' Countries Found <br/>' + 'Range: ' + $(this).html();
							callBackList.colorCode.apply = true;
							notifications(notificationMessage, callBackList);
						} else {
							var notificationMessage = 'No Countries Found <br/>' + 'Range: ' + $(this).html();
							callBackList.colorCode.apply = false;
							notifications(notificationMessage, callBackList);
						}
						$('.showthisrange').removeClass('resetFilter');
						$(this).addClass('resetFilter');
					} else {

						iHealthMap.onResettingMap();
					}

				});
			};

		iHealthMap.legendControl.addTo(iHealthMap.map);

		iHealthMap.legendControl.getSelectedRange();
		if (dureUtil.indicatorId == 51 || dureUtil.indicatorId == 56 || dureUtil.indicatorId == 61 || dureUtil.indicatorId == 119) {

			$(".showthisrange").unbind();
		}
	}
};

// Removes the Legend control from map .
iHealthMap.removeLegendControl = function () {
	//console.log(iHealthMap.legendControl + " === Removing the legend");
	if (iHealthMap.legendControl != undefined && iHealthMap.legendControl !== null) {

		iHealthMap.legendControl.removeFrom(iHealthMap.map);
	}
	iHealthMap.legendControl = null;
};

// changes colors as per filters
// Author- Radhika
iHealthMap.createFilterLegend = function (filterValueArr) {
	
	if (dureUtil.getIndicatorId() == 182 || dureUtil.getIndicatorId() == 183) {
		dureUtil.getImpactStudiesData();
	//	console.log(dureUtil.impactStudiesValues);
		var filterCountryList = dureUtil.impactStudiesValues.impactStudies.countrylist;
		console.log(filterCountryList);
		var filterGroupsArr = Object.keys(filterCountryList).map(function (data) {
			return [data, filterCountryList[data]];
		});
		var x = [];
		$.each(filterGroupsArr, (i, v) => {
			$.each(v, (i1, v1) => {
				if (i1 === 0) {
					x.push(v1);
				}
				if (i1 === 1) {
					$.each(v1, function (i, n) {
						x.push(n);
					});
				}
			})

		});
		var countryListjson = JSON.stringify(x);
		iHealthMap.clearLayer();
		iHealthMap.map.addLayer(iHealthMap.ggl);

	}

}

// Removes the Source Label from map .
iHealthMap.removeSourceLabel = function () {

	if (iHealthMap.sourceLabel != undefined && iHealthMap.sourceLabel !== null) {
		iHealthMap.sourceLabel.removeFrom(iHealthMap.map);

	}
	iHealthMap.sourceLabel = null;
};

/************************************************ Section: Map Controls *****************************************************/
iHealthMap.OpenInfoContainer = function () {

	$(".embedPopupWrap .box-primary").removeClass('collapsed-box');
	$(".embedPopupWrap .box-body").show();
	$(".embedPopupWrap .btn-primary").removeClass('fa-plus');
	$(".embedPopupWrap .btn-primary i").addClass('fa-minus');

	/* opening legend container on click */
	$(".infolegend .box-primary").removeClass('collapsed-box');
	$(".infolegend .box-body").show();
	$(".infolegend .btn-primary").removeClass('fa-plus');
	$(".infolegend .btn-primary i").addClass('fa-minus');
}

//Renders embeded popup on map.
iHealthMap.renderEmbededPopup = function () {
	if ($('.embedPopupWrap').length == 0) {
		iHealthMap.createEmbedPopup();
	}
}

//Creates embed popup in the Map.
iHealthMap.createEmbedPopup = function () {
	var header = " Country Info";
	var body = '<div class="embPopupBody"> Please click on a country to get more country info.</div>';

	iHealthMap.popupControl = L.control({
		position: "topright"
	});
	iHealthMap.popupControl.onAdd = function (map) {
		var div = L.DomUtil.create('div', 'embedPopupWrap');
		div.innerHTML += iHealthMap.buildBoxHtml(header, body, 'regionInfo');
		return div;
	};
	iHealthMap.popupControl.addTo(iHealthMap.map);
};

// Removes the Legend control from map .
iHealthMap.removeEmbedPopupControl = function () {
	if (iHealthMap.popupControl != undefined) {

		iHealthMap.popupControl.removeFrom(iHealthMap.map);
	}
};

// Renders Slider if it does not exsist on map .
iHealthMap.renderSlider = function () {
	if ($('.sliderdiv').length == 0) {
		iHealthMap.createSlideControl();
	}
};

// Creates slider control that is needed for map.
iHealthMap.createSlideControl = function () {

	iHealthMap.sliderControl = L.control({
		position: "bottomleft"
	});
	iHealthMap.sliderControl.onAdd = function () {
		var div = L.DomUtil.create('div', 'sliderdiv');
		div.innerHTML = '<div class="btn-group dropup">' +
			'<button type="button" id="sliderPrev" class="btn btn-primary sliderPrev"><i class="fa fa-backward"></i></button>' +
			'<button type="button" id="slideryear" class="btn btn-primary" data-target="#year-modal" data-toggle="modal"> Year ' + iHealthMap.currentYear + '</button>' +
			'<button type="button" id="sliderNext" class="btn btn-primary sliderNext"><i class="fa fa-forward"></i></button>' +
			'<button type="button" id="sliderPlay" class="btn btn-primary playbutton-style"><i class="fa fa-play"></i></button>' +
			'<button type="button" id="sliderPause" class="btn btn-primary playbutton-style hide"><i class="fa fa-pause"></i></button>' +
			'</div>';
		return div;
	}
	iHealthMap.sliderControl.addTo(iHealthMap.map);
	iHealthMap.slideNext();
	iHealthMap.slidePrev();
	iHealthMap.slidePlay();
	iHealthMap.slidePause();
	// Call to build Select year control in slider.
	if (iHealthMap.rangeOfYears.length != 0) {
		iHealthMap.buildYearSelectHtml(iHealthMap.rangeOfYears);
	}
};

// Functionality for next button
iHealthMap.slideNext = function () {
	// console.log("Inside slider next.");
	$('#sliderNext').click(function () {
		// console.log("clicked slider next.");
		iHealthMap.currentYearIndex++;
		if (iHealthMap.currentYearIndex < iHealthMap.rangeOfYears.length && iHealthMap.currentYearIndex >= 0) {
			$(this).addClass('sliderNextRed');
			if (iHealthMap.setCurrentyear(iHealthMap.rangeOfYears[iHealthMap.currentYearIndex])) {
				$('#slideryear').text('Year ' + iHealthMap.rangeOfYears[iHealthMap.currentYearIndex]);
				iHealthMap.onYearChange(iHealthMap.currentYearIndex);
			}
		} else {
			iHealthMap.currentYearIndex--;
		}
	});
};

// Functionality for previous button
iHealthMap.slidePrev = function () {

	$('#sliderPrev').click(function () {
		iHealthMap.currentYearIndex--;
		if (iHealthMap.currentYearIndex < iHealthMap.rangeOfYears.length && iHealthMap.currentYearIndex >= 0) {
			$(this).addClass('sliderPrevRed');
			if (iHealthMap.setCurrentyear(iHealthMap.rangeOfYears[iHealthMap.currentYearIndex])) {
				$('#slideryear').text('Year ' + iHealthMap.rangeOfYears[iHealthMap.currentYearIndex]);
				iHealthMap.onYearChange(iHealthMap.currentYearIndex);
			}
		} else {
			iHealthMap.currentYearIndex++;
		}
	});
};

// Functionality for Play button                          // 24/8/2015
iHealthMap.slidePlay = function () {

	$('#sliderPlay').click(function () {
		$(this).hide();
		$('#sliderPause').show();
		$('#sliderPause').removeClass('hide');
		var slideDuration = 1300;
		var crntIndex = iHealthMap.currentYearIndex;
		iHealthMap.playInterval = setInterval(function () {
			iHealthMap.currentYearIndex++;
			if (iHealthMap.currentYearIndex > iHealthMap.rangeOfYears.length - 1) {
				iHealthMap.currentYearIndex = 0;
			}

			if (crntIndex == iHealthMap.currentYearIndex) {

				$('#sliderPause').hide();
				$('#sliderPlay').show();
				clearInterval(iHealthMap.playInterval);
			}

			$('#slideryear').text('Year ' + iHealthMap.rangeOfYears[iHealthMap.currentYearIndex]);
			iHealthMap.onYearChange(iHealthMap.currentYearIndex);
		}, slideDuration);
	});
};

iHealthMap.slidePause = function () {

	$('#sliderPause').click(function () {
		$(this).hide();
		$('#sliderPlay').show();
		clearInterval(iHealthMap.playInterval);
	});
}

/*
Author: Shone Johnson
Date: 10-12-14
Description: Builds html for year selection control in slider
 */
iHealthMap.buildYearSelectHtml = function (years) {

	$('.yearSelect').children().remove()
	var html = '<option>Select a year</option>';
	if (years != undefined) {

		for (var i = 0; i < years.length; i++) {

			html += "<option value=" + years[i] + ">" + years[i] + "</option>"
		}
		$('.yearSelect').append(html);
		iHealthMap.onYearSelect();
	}
};

// Functionality to select year from dropdown.
iHealthMap.onYearSelect = function () {

	$('.yearSelect').change(function () {
		iHealthMap.currentYear = $('.yearSelect').val();
		$('#slideryear').text('Year ' + iHealthMap.currentYear);

		// Changes to check the level -- By Shone.
		if (dMap.checkLevel() == 'world') {
			iHealthMap.onYearChange();
		} else if (dMap.checkLevel() == 'country') {
			province.onYearChange();
		}
	});
};

// Changes and displays map data on year change.
iHealthMap.onYearChange = function (index) {
	//console.log("Index for the year - " + index);
	if (index != undefined) {
		iHealthMap.currentYear = iHealthMap.rangeOfYears[index];

	}
	/*----------------- Commented for VIEW HUB BY SHONE ----------------*/
	// iHealthMap.changeRegionSummaryDataForYear(iHealthMap.currentYear);
	dureUtil.scaleRangeCat = {
		regionList: {},
		apply: true
	}; //TODO 18/03/2015
	$.noty.closeAll();
	iHealthMap.changeOtherComponentData(iHealthMap.currentYear);
	iHealthMap.loadLayer();
	loadPieChart(); // TODO


	/*  ##### Changes added by Swapnil for changing overlay on year change ##### */
	if (dureOverlays.OverlayVisible) {
		dureOverlays.clearOverlays();

		dureOverlays.CurrentYearOverlayData = dureOverlays.getOverlayDataForPeriodNew(iHealthMap.getCurrentyear(), dureOverlays.CurrentOption.label);

		if (dureOverlays.currentOverlayStyle == 'Radial') {

			dureOverlays.showRadialChartForYear(dureOverlays.CurrentOption, dureOverlays.CurrentYearOverlayData);
			$(dureOverlays.overlayList).eq(dureOverlays.selectedIndexVal).prop('selected', true);
		} else {
			dureOverlays.showBubbleChartForYear(dureOverlays.CurrentOption, dureOverlays.CurrentYearOverlayData);
			$(dureOverlays.overlayList).eq(dureOverlays.selectedIndexVal).prop('selected', true);
		}
	}
	dureOverlays.clearOverlays();
	/*  ##### Changes added by Swapnil ##### */
	// On year change ,change the overview table data too. === Shone
	dureControl.loadOverviewTableData();
	$('#year-modal').modal('hide');
}

//Removes slider control from Map.
iHealthMap.removeSliderControl = function () {
	if (iHealthMap.sliderControl != undefined && iHealthMap.sliderControl !== null) {
		iHealthMap.sliderControl.removeFrom(iHealthMap.map);
	}
	iHealthMap.sliderControl = null;
};

// Unbinds slider controlS attached to the elements at region level.
iHealthMap.deActivateSliderControls = function () {
	//console.log("Deactivating controls");
	$("#sliderNext").unbind("click");
	$("#sliderPrev").unbind("click");
	$("#sliderNext").attr('id', 'sliderNextProv');
	$("#sliderPrev").attr('id', 'sliderPrevProv');
};

// Clears map data and map controls.
iHealthMap.clearMap = function () {
	iHealthMap.clearLayer();
	iHealthMap.removeLegendControl();
	iHealthMap.removeSliderControl();
	iHealthMap.removeEmbedPopupControl();
	iHealthMap.removeSourceLabel();
};

// Drills down into the country provinces/states.
iHealthMap.drilldownToCountry = function (country, countryISO) {
	dMap.setLevel('country'); // TODO change level to country
	province.initialize(country, countryISO);
};

// Resets map and places map to default position .
iHealthMap.onResettingMap = function () {
	//console.log("================== Reset Action From World Level =====================");
	province.clearMapLayer();
	iHealthMap.isGaviFilterApplied = 0;
	$('#gavi-toggle').bootstrapToggle('off');
	//$('.gaviBtn').removeClass('filter-selected');

	$(".fontchange").css('background', 'none');
	$(".fontchange").css('font-size', '13px');

	iHealthMap.unsetFilter();
	impactStudies.unsetFilter();
	iHealthMap.clearLayer();
	iHealthMap.clearFilterOptions();
	iHealthMap.removeSliderControl();
	iHealthMap.removeEmbedPopupControl();
	iHealthMap.removeLegendControl();
	iHealthMap.removeSourceLabel();
	dureOverlays.clearOverlays();
	gaviOverlays.clearOverlays();
	$.noty.closeAll();
	clearInterval(iHealthMap.playInterval);
	iHealthMap.setYearRangeAndLimits();
	iHealthMap.map.setView(new L.LatLng(iHealthMap._lat, iHealthMap._long), 2);
	iHealthMap.map.panTo(new L.LatLng(iHealthMap._lat, iHealthMap._long));
	iHealthMap.loadLayer();
	console.log(iHealthMap.legendControlData);
	iHealthMap.renderLegend(iHealthMap.legendControlData);
	// Reload Table Data....
	iHealthTable.load();
	// province.deActivateSliderControls();
}

// Set Year Range and Limits so as to display data on maps according to year.
iHealthMap.setYearRangeAndLimits = function () {
	//console.log("==== Setting Map Year Ranges ====");
	var range = {};
	range.data = '';
	range.data = iHealthMap.getDataFromProvider();
	//console.log(range.data);
	if (dMap.checkLevel() == 'world') {
		var currentView = dureUtil.retrieveFromLocal("currentView");

		if (currentView != undefined && currentView.indicatorID == dureConfig.getUserIndicatorId()) {
			//console.log('### USING LOCAL STORAGE ###');
			// iHealthMap.currentYear = iHealthMap.minYearValue = dureUtil.getMinYearForTarget(currentView.targetID);
			// iHealthMap.maxYearValue = dureUtil.getMaxYearForTarget(currentView.targetID);
			iHealthMap.minYearValue = dureUtil.getMinYearForIndicator(currentView.indicatorID);
			iHealthMap.currentYear = iHealthMap.maxYearValue = dureUtil.getMaxYearForIndicator(currentView.indicatorID);

			//console.log("setting current year here");
			//console.log(iHealthMap.currentYear);
		}

		iHealthMap.rangeOfYears = dureUtil.getRangeOfYears();

		iHealthMap.currentYearIndex = (iHealthMap.rangeOfYears.length - 1);
		//console.log(iHealthMap.rangeOfYears[0]);
		//console.log(currentYearIndex);

		//iHealthMap.currentYear = iHealthMap.rangeOfYears[0];
		iHealthMap.currentYear = iHealthMap.maxYearValue = iHealthMap.rangeOfYears[iHealthMap.currentYearIndex];

		//console.log("setting current year here");
		//console.log(iHealthMap.currentYear);

	} else if (dMap.checkLevel() == 'country') {
		// iHealthMap.rangeOfYears
		// iHealthMap.currentYearIndex
		// iHealthMap.minYearValue
		// iHealthMap.currentYear = iHealthMap.maxYearValue =
	}
};

//Builds html for popup.
iHealthMap.buildBoxHtml = function (header, body, className) {
	var html = "<div class='box box-solid box-primary box-transparent box-rm-margin-bottom'>" +
		"<div class='box-header collapsibleHeader'>" +
		"<h5 class='pull-left " + className + "'>" + header + "</h5>" +
		"<div class='box-tools pull-right'>" +
		"<button class='btn btn-primary btn-xs' data-widget='collapse'><i class='fa fa-minus'></i></button>" +
		"</div>" +
		"</div>" +
		"<div class='box-body' style='display: block;'>" + body + "</div>" +
		"</div>";
	return html;
};

iHealthMap.renderCountryListDropdown = function () {

	$('.regionsearch').selectpicker({
		style: 'btn-sm btn-primary',
		size: 10,
		width: 150
	});
	$('.countryPick ul.regionsearch').find('.dropdown-header').children('span').addClass('label label-primary');
	$('.regionsearch').change(function () {

		var group = $('.regionsearch option:selected')[0].className;

		if (group == 'optgroup') {

			//console.log( $('.selectpicker').val());
			var optgrpVal = $('.regionsearch').val();
			if (iHealthMap.setFilter()) {
				// iHealthMap.setFilterType('region');
				iHealthMap.setFilterParam(optgrpVal);
				iHealthMap.setRegionFilter(optgrpVal);
				//console.log("Loading regions");
				iHealthMap.loadLayer();
			}
		} else {
			if (iHealthMap.checkFilter()) {
				iHealthMap.isFilterApplied = 0;
				iHealthMap.loadLayer();
			}
			var address = $('.regionsearch').val();
			if (iHealthMap.searchRegionByIsocode(address) == false) {
				iHealthMap.getLatLngForAddr(address);
			}
		}
	});

	/* ######## changes as per the requiremnt of new control on map to locate country ########## */

	$('.countrylocatorPicker').change(function () {

		var group = $('.countrylocatorPicker option:selected')[0].className;

		if (group == 'optgroup') {

			// console.log($('.countrylocatorPicker').val());
			var optgrpVal = $('.countrylocatorPicker').val();
			if (iHealthMap.setFilter()) {
				// iHealthMap.setFilterType('region');
				iHealthMap.setFilterParam(optgrpVal);
				iHealthMap.setRegionFilter(optgrpVal);
				// console.log("Loading regions");
				iHealthMap.loadLayer();
			}
		} else {
			if (iHealthMap.checkFilter()) {
				//iHealthMap.isFilterApplied = 0;
				iHealthMap.loadLayer();
			}
			var address = $('.countrylocatorPicker').val();
			if (iHealthMap.searchRegionByIsocode(address) == false) {
				iHealthMap.getLatLngForAddr(address);
			}
		}
	});

	/* ######## changes as per the requirement of new control on map to locate country ########## */
}

/************************************************ Section: Map Dependent Info ***********************************************/

// Changes Info on Chart for country.
iHealthMap.changeChartInfoForCountry = function (code) {

	if (dureUtil.prepareChartObjects(iHealthMap.jsondata, 'region', code)) {
		//console.log("Chart changed for country");
	}
};

// Changes Region summary data on change of year.
iHealthMap.changeRegionSummaryDataForYear = function (year) {
	var data;
	//console.log("###====== Change Country Summary data ======###");
	if (year != undefined) {
		//console.log(iHealthMap.jsondata.data.regions[1].regionSummaryData[0][year].data);
		data = iHealthMap.jsondata.data.regions[1].regionSummaryData[0][year].data;
		if (data != undefined) {
			//console.log("Changing summary data for country");
			dureUtil.changeRegionSummaryData(data);
		}
	}
};

// Changes the overview panel data
iHealthMap.changeOtherComponentData = function (year) {

	var overviewData;
	if (year != undefined) {
		if (dureUtil.currentFormattedJSONData.extensionData != undefined) {
			if (dureUtil.currentFormattedJSONData.extensionData[0] != undefined) {
				overviewData = dureUtil.currentFormattedJSONData.extensionData[0][year];
				if (overviewData != undefined) {
					// console.log("Changing overview Panel data");
					dureUtil.changeComponentData(overviewData);
				}
			}
		}
	}
}

// Sets country name for click/tap on the map.
iHealthMap.setCountryName = function (country) {
	iHealthMap.country = country;
};

// Returns the country name for country selected from map.
iHealthMap.getCountryName = function () {
	return iHealthMap.country;
};

iHealthMap.searchRegionByIsocode = function (countryName) {
	var countryCode;
	var addr = {},
		lat,
		lng,
		zoom,
		marker;
	zoom = 4;
	if (iHealthMap.markerTemp != null) {
		iHealthMap.map.removeLayer(iHealthMap.markerTemp);
	}

	countryCode = dureUtil.getGeoCodeFromName(countryName, iHealthMap.geoJson);
	if (countryCode != undefined && countryCode != '') {

		lat = L.countryCentroids[countryCode].lat;
		lng = L.countryCentroids[countryCode].lng;

		if ((lat == undefined && lng == undefined) || (lat == '' && lng == '')) {
			bounds = L.latLngBounds(L.countries[countryCode].features[0].geometry.coordinates).getCenter();
			lat = bounds.lng;
			lng = bounds.lat;
		}
	}

	if (lat != undefined && lng != undefined) {
		iHealthMap.map.setView(new L.LatLng(lat, lng), zoom);
		marker = L.marker([lat, lng]);
		marker.addTo(iHealthMap.map);
		iHealthMap.markerTemp = marker;
	} else {
		return false;
	}
	return true;
};

//Returns lat long of a region.
iHealthMap.getLatLngForAddr = function (address) {
	var addr = {};
	iHealthMap.geocoder.geocode({
		'address': address
	}, function (results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			//console.log("=============== Line 968: Geocoding location results =======.");
			if (iHealthMap.markerTemp != null) {
				iHealthMap.map.removeLayer(iHealthMap.markerTemp);
			}
			iHealthMap.geocodeRes = results[0].geometry;
			//console.log(results[0].geometry);
			addr.lat = results[0].geometry.location.k;
			addr.lng = results[0].geometry.location.B;
			addr.zoom = 4;
			iHealthMap.map.setView(new L.LatLng(addr.lat, addr.lng), addr.zoom);
			marker = L.marker([addr.lat, addr.lng]);
			marker.addTo(iHealthMap.map);
			iHealthMap.markerTemp = marker;
		}
	});
}

/************************************************ Section : Map Filter  ****************************************************/

/* ########################################################### */
/* new render filter created for filter grouping functionality */
/* ########################################################### */

/* function starts */
iHealthMap.renderFilter = function () {
	/* using universal data of  dureUtil.respJsonData */

	/* empty the container for new filter data */
	$('#accordion').empty();
	/* empty the object for iHealthMap.CheckedFilter */
	iHealthMap.CheckedFilter = '';
	iHealthMap.isFilterOn = true;

	//var renderfirstfilter = [51, 52, 56, 57, 61, 62, 119];
	//var renderfirstfilter = [52, 56, 57, 61, 62, 119];
	var renderfirstfilter = [52, 57, 62];
	var filterHtml = '';
	var subfilterHtml = '';
	var productsHtml = '';

	var filterGroupsData = dureUtil.respJsonData.filterGroups;
	console.log(dureUtil.getIndicatorId());

	if (filterGroupsData == "") {
		if (dureUtil.getIndicatorId() == 182 || dureUtil.getIndicatorId() == 183) {
			var filterGroupsData = JSON.stringify(dureUtil.impactStudiesValues.impactStudies.headerobjectivelist);
			//console.log(filterGroupsData);
			var result = [];
			var result = $.parseJSON(filterGroupsData);
			var index = 0;
			for (index = 0; index <= 14; index++) {
				$.each(result, function (k, v) {
					filterHtml += '<div class="panel-heading" style="background-color:lightgray;color:#202020">' +
						'<h2 class="panel-title">' +
						'<span class="pull-left">' +
						'<input type="checkbox" class="Main topParentFilter" id="topParentFilter' + index + '" ></input> ' +
						'</span>' +
						'<a href="#filterGroupid' + index + 'container" data-parent="#collapsible-" class="accordion-toggle collapsed" data-toggle="collapse" style="font-weight:bold;margin-left:10px"> ' + k + '</a>' +
						'</h2>' +
						'</div>' +
						'<div id="filterGroupid' + index + 'container" class="panel-collapse collapse">' +
						'<div class="panel-body">';
					for (i = 0; i < v.length; i++) {
						filterHtml += '<div class="panel panel-default">' + /* Internal main panel start here */
							'<div class="panel-heading">' + /* Internal main panel heading strat here */
							'<h2 class="panel-title">' +
							'<span class="pull-left">' +
							'<input style="margin-right:5px;"type="checkbox" class=" topInnerFilter topParentFilter' + index + '" id="topParentInnerFilter' + index + '_' + i + '" datacolorcode="' + v[i] + '"  value="' + v[i] + '"></input>' +
							'</span>' +
							'<a href="#filterSubGroupId' + v[i] + '" data-parent="#collapsible-764" data-toggle="collapse">' + v[i] + '</a>' +
							'</h2>' +
							'</div>' +
							'<div id="filterSubGroupId' + v[i] + '" class="panel-collapse collapse">' + /* Internal panel body container start here */
							'<div class="panel-body">'
							+ '<span>' +
							'<input type="checkbox" style="margin-right:5px;" class="baseFiltercls topParentFilter' + index + ' topParentInnerFilter' + index + '_' + i + ' filterCheckBox" data-color="' + v[i] + '" datacolorcode="' + v[i] + '" dataheadervalue="' + v[i] + '"  value="' + v[i] + '" >' + v[i] + '</input>' +
							'</span></br>';
						filterHtml += '</div>' +
							'</div>';/* Internal panel body container ends here*/
						/* Internal main panel heading ends here */
						filterHtml += '</div>';
						/*  Internal main panel ends here */
					}
					filterHtml += '</div>' +
						'</div>';
					index++;
				});
			}
		}
	} else {
		console.log(JSON.stringify(filterGroupsData));
		var isBaseFilter = false;

		for (var i = 0; i < filterGroupsData.length; i++) {

			if (dureUtil.respJsonData.indicatorMetaInfo[0].indicatorInfo.indicatorName == filterGroupsData[i].filterGroupName) {
				isBaseFilter = true;
			} else if ($.inArray(dureUtil.respJsonData.indicatorMetaInfo[0].indicatorInfo.indicatorId, renderfirstfilter) > -1) {

				if (i == 0) {
					isBaseFilter = true;
				} else {
					isBaseFilter = false;
				}

			} else {
				isBaseFilter = false;
			}

			if (isBaseFilter) {

				filterHtml += '<div class="panel-heading baseClassContainerMain" style="background-color:lightgray;color:#202020">' +
					'<h2 class="panel-title">' +
					'<span class="pull-left">' +
					'<input type="checkbox" class="Main topParentFilter" id="topParentFilter' + i + '" ></input> ' +
					'</span>' +
					'<a href="#filterGroupid' + filterGroupsData[i].filterGroupId + 'container" data-parent="#collapsible-" class="accordion-toggle collapsed" data-toggle="collapse" style="font-weight:bold;margin-left:10px"> ' + filterGroupsData[i].filterGroupName + '</a>' +
					'</h2>' +
					'</div>' +
					'<div id="filterGroupid' + filterGroupsData[i].filterGroupId + 'container" class="panel-collapse collapse baseFilterSubContainer">' +
					'<div class="panel-body">';

			} else {

				filterHtml += '<div class="panel-heading" style="background-color:lightgray;color:#202020">' +
					'<h2 class="panel-title">' +
					'<span class="pull-left">' +
					'<input type="checkbox" class="Main topParentFilter" id="topParentFilter' + i + '" ></input> ' +
					'</span>' +
					'<a href="#filterGroupid' + filterGroupsData[i].filterGroupId + 'container" data-parent="#collapsible-" class="accordion-toggle collapsed" data-toggle="collapse" style="font-weight:bold;margin-left:10px"> ' + filterGroupsData[i].filterGroupName + '</a>' +
					'</h2>' +
					'</div>' +
					'<div id="filterGroupid' + filterGroupsData[i].filterGroupId + 'container" class="panel-collapse collapse">' +
					'<div class="panel-body">';

			}
			/* this loop will generate the internal panel body for the accordion from first loop */
			for (var j = 0; j < filterGroupsData[i].filterSubGroups.length; j++) {
				//                        console.log(filterGroupsData[i].filterSubGroups[j].filterSubGroupColor);
				filterHtml += '<div class="panel panel-default">' + /* Internal main panel start here */
					'<div class="panel-heading">' + /* Internal main panel heading strat here */
					'<h2 class="panel-title">' +
					'<span class="pull-left">' +
					'<input style="margin-right:5px;"type="checkbox" class=" topInnerFilter topParentFilter' + i + '" id="topParentInnerFilter' + i + '_' + j + '" datacolorcode="' + filterGroupsData[i].filterSubGroups[j].filterSubGroupColor + '"  value="' + filterGroupsData[i].filterSubGroups[j].filterSubGroupName + '"></input>' +
					'</span>' +
					'<a href="#filterSubGroupId' + filterGroupsData[i].filterSubGroups[j].filterSubGroupId + '" data-parent="#collapsible-764" class="accordion-toggle collapsed" data-toggle="collapse">' + filterGroupsData[i].filterSubGroups[j].filterSubGroupName + '</a>' +
					'</h2>' +
					'</div>' + /* Internal main panel heading ends here */

					'<div id="filterSubGroupId' + filterGroupsData[i].filterSubGroups[j].filterSubGroupId + '" class="panel-collapse collapse">' + /* Internal panel body container start here */
					'<div class="panel-body">';

				/* for loop for internal subfilter value start here */
				for (var k = 0; k < filterGroupsData[i].filterSubGroups[j].filters.length; k++) {

					if (isBaseFilter) {

						filterHtml += '<span>' +
							'<input type="checkbox" style="margin-right:5px;" class="baseFiltercls topParentFilter' + i + ' topParentInnerFilter' + i + '_' + j + ' filterCheckBox" data-color="' + filterGroupsData[i].filterSubGroups[j].filterSubGroupColor + '" datacolorcode="' + filterGroupsData[i].filterSubGroups[j].filterSubGroupColor + '" dataheadervalue="' + filterGroupsData[i].filterSubGroups[j].filterSubGroupName + '"  value="' + filterGroupsData[i].filterSubGroups[j].filters[k].filterName + '" >' + filterGroupsData[i].filterSubGroups[j].filters[k].filterName + '</input>' +
							'</span></br>';

					} else {

						filterHtml += '<span>' +
							'<input type="checkbox" class="topParentFilter' + i + ' topParentInnerFilter' + i + '_' + j + ' filterCheckBox" data-color="' + filterGroupsData[i].filterSubGroups[j].filterSubGroupColor + '" datacolorcode="' + filterGroupsData[i].filterSubGroups[j].filterSubGroupColor + '" dataheadervalue="' + filterGroupsData[i].filterSubGroups[j].filterSubGroupName + '"  value="' + filterGroupsData[i].filterSubGroups[j].filters[k].filterName + '" >' + filterGroupsData[i].filterSubGroups[j].filters[k].filterName + '</input>' +
							'</span></br>';
					}
				}
				filterHtml += '</div>' +
					'</div>' + /* Internal panel body container ends here*/

					'</div>';
				/*  Internal main panel ends here */
			}

			filterHtml += '</div>' +
				'</div>';

		}
	}
	$("#accordion").append(filterHtml);

	/* moving base class filter to the top of the filter */
	$("#accordion .baseFilterSubContainer").after($("#accordion").children());
	$("#accordion .baseClassContainerMain").after($("#accordion").children());

	/* binding filter check box click event */
	iHealthMap.bindFilterBtnEvent();

	/* Apply iCheck class to the check box filter */

	$('#filterModal input').iCheck({
		checkboxClass: 'icheckbox_minimal textFix',
		radioClass: 'iradio_minimal',
		increaseArea: '20%' // optional
	});
}
/* function ends */

/********************* creating legend based on the data in filter   *********************/
iHealthMap.createLegendOnFilter = function () {

	/*** hardcoded code ***/
	var documentFragment = $(document.createDocumentFragment());
	var addLegendArr = [];
	var notIntroducedDisabled = [51, 56, 61, 119];
	var checkedFilters = $('.filterCheckBox:checkbox:checked');
	iHealthMap.CheckedFilter = '';
	iHealthMap.CheckedFilter = $('.filterCheckBox:checkbox:checked');
	console.log(dureUtil.respJsonData.indicatorMetaInfo[0].indicatorInfo.indicatorId);

	if (iHealthMap.CheckedFilter.length < 1) {
		checkedFilters = $('.filterCheckBox');
		iHealthMap.CheckedFilter = $('.filterCheckBox');
	}

	var header = "Legend";
	var body = '';

	body += '<div class="legend-info"><div  class="legendInnerDiv">' + dureUtil.respJsonData.indicatorMetaInfo[0].indicatorInfo.indicatorName + '</div>';

	iHealthMap.removeLegendControl();
	iHealthMap.legendControl = L.control({
		position: 'bottomright'
	});

	iHealthMap.legendControl.onAdd = function (map) {
		var planningPresent = false;
		var introducedPresent = false;
		var notPlannedPresent = false;
		var notIntroduced = false;
		var PCVImpactStudies = false;
		var div = L.DomUtil.create('div', 'infolegend legend scaleWrap');

		/* Harcoded legend for outcome measures - KunaL 20-01-2015 */

		if (dureUtil.respJsonData.indicatorMetaInfo[0].indicatorInfo.indicatorId == 1289 || dureUtil.respJsonData.indicatorMetaInfo[0].indicatorInfo.indicatorId == 88) {

			body +=
				'<div class="legendInnerDiv"><i style="background: #0040FF;"></i> IPD, Meningitis, Mortality, NP Carriage, Pneumonia </div>';

			documentFragment.append('<div class="legendInnerDiv" style="width:30%;display:inline-block"><i style="background: #0040FF;"></i> IPD, Meningitis, Mortality, NP Carriage, Pneumonia  </div>');

		} else if (dureUtil.respJsonData.indicatorMetaInfo[0].indicatorInfo.indicatorId == 1290) {

			body +=
				'<div class="legendInnerDiv"><i style="background: #0099CC;"></i> PCV7 </div> <div class="legendInnerDiv"><i style="background: #CCFFCC;"></i> PCV10 </div> <div class="legendInnerDiv"><i style="background: #66CCFF;"></i> PCV13 </div> <div class="legendInnerDiv"><i style="background: #003399;"></i> PCV7 and PCV13 </div>';

			documentFragment.append('<div class="legendInnerDiv" style="width:30%;display:inline-block"><i style="background: #0099CC;"></i> PCV7 </div> <div class="legendInnerDiv" style="width:30%;display:inline-block"><i style="background: #CCFFCC;"></i> PCV10 </div> <div class="legendInnerDiv" style="width:30%;display:inline-block"><i style="background: #66CCFF;"></i> PCV13 </div> <div class="legendInnerDiv" style="width:30%;display:inline-block"><i style="background: #003399;"></i> PCV7 and PCV13 </div>');

		} else if (dureUtil.respJsonData.indicatorMetaInfo[0].indicatorInfo.indicatorId == 1153) {

			body +=
				'<div class="legendInnerDiv"><i style="background: #3333CC;"></i> Universal </div> <div class="legendInnerDiv"><i style="background: #0029A3;"></i> Risk </div> <div class="legendInnerDiv"><i style="background: #7575FF;"></i> Phased </div> <div class="legendInnerDiv"><i style="background: #0040FF;"></i> None </div>';

			documentFragment.append('<div class="legendInnerDiv" style="width:30%;display:inline-block"><i style="background: #3333CC;"></i> Universal </div> <div class="legendInnerDiv" style="width:30%;display:inline-block"><i style="background: #0029A3;"></i> Risk </div> <div class="legendInnerDiv" style="width:30%;display:inline-block"><i style="background: #7575FF;"></i> Phased </div> <div class="legendInnerDiv" style="width:30%;display:inline-block"><i style="background: #0040FF;"></i> None </div>');

		} else if (dureUtil.respJsonData.indicatorMetaInfo[0].indicatorInfo.indicatorId == 1154) {

			body +=
				'<div class="legendInnerDiv"><i style="background: #006BB2;"></i> PCV7 </div> <div class="legendInnerDiv"><i style="background: #B2B2E0;"></i> PCV10 </div> <div class="legendInnerDiv"><i style="background: #6666C2;"></i> PCV13 </div> <div class="legendInnerDiv"><i style="background: #0099FF;"></i> N/A </div>';

			documentFragment.append('<div class="legendInnerDiv" style="width:30%;display:inline-block"><i style="background: #006BB2;"></i> PCV7 </div> <div class="legendInnerDiv" style="width:30%;display:inline-block"><i style="background: #B2B2E0;"></i> PCV10 </div> <div class="legendInnerDiv" style="width:30%;display:inline-block"><i style="background: #6666C2;"></i> PCV13 </div> <div class="legendInnerDiv" style="width:30%;display:inline-block"><i style="background: #0099FF;"></i> N/A </div>');

		} else if (dureUtil.respJsonData.indicatorMetaInfo[0].indicatorInfo.indicatorId == 106) {
			// Impact Study - Location
			body +=
				'<div class="legendInnerDiv"><i style="background: #5862A3;"></i> Completed </div>';

			documentFragment.append('<div class="legendInnerDiv" style="width:30%;display:inline-block"><i style="background: #5862A3;"></i> Completed </div>');

	} else if (dureUtil.respJsonData.indicatorMetaInfo[0].indicatorInfo.indicatorId == 182 || dureUtil.respJsonData.indicatorMetaInfo[0].indicatorInfo.indicatorId == 183) {
		console.log(checkedFilters);
			body +=
				'<div class="legendInnerDiv">  </div>';
				$.each(checkedFilters, function (key, val) {
					
				if ($(val).hasClass('baseFiltercls')) {
					if (dureUtil.respJsonData.indicatorMetaInfo[0].indicatorInfo.indicatorId == 1152) {
						console.log(val);
					}
				}
				});
			

		}else {

			$.each(checkedFilters, function (key, val) {
				if ($(val).hasClass('baseFiltercls')) {
					//alert("inside base filter");
					if (dureUtil.respJsonData.indicatorMetaInfo[0].indicatorInfo.indicatorId == 1152) {
						console.log(dureUtil.respJsonData.indicatorMetaInfo[0].indicatorInfo.indicatorId);
						if (val.getAttribute("dataheadervalue") == 'Introduced') {
							/* create Introduced legend */

							if (!introducedPresent) {

								body +=
									'<div  class="legendInnerDiv"><i style="background:' + val.getAttribute("datacolorcode") + '"></i> Introduced </div>';

								documentFragment.append('<div  class="legendInnerDiv" style="width:30%;display:inline-block"><i style="background:' + val.getAttribute("datacolorcode") + '"></i>' + val.getAttribute("dataheadervalue") + '</div>');

								introducedPresent = true;
							}

						} else if (val.getAttribute("dataheadervalue") == 'Planning') {
							/* create Planning legend */

							if (!planningPresent) {

								body +=
									'<div  class="legendInnerDiv"><i style="background:' + val.getAttribute("datacolorcode") + '"></i> Planning </div>';

								documentFragment.append('<div  class="legendInnerDiv" style="width:30%;display:inline-block"><i style="background:' + val.getAttribute("datacolorcode") + '"></i>' + val.getAttribute("dataheadervalue") + '</div>');

								planningPresent = true;
							}

						} else if (val.getAttribute("dataheadervalue") == 'Not Introduced') {
							/* create Not introduced legend */

							if (!notPlannedPresent) {

								body +=
									'<div  class="legendInnerDiv"><i style="background:' + val.getAttribute("datacolorcode") + '"></i> Not introduced </div>';

								documentFragment.append('<div  class="legendInnerDiv" style="width:30%;display:inline-block"><i style="background:' + val.getAttribute("datacolorcode") + '"></i> ' + val.getAttribute("dataheadervalue") + '</div>');

								notPlannedPresent = true;
							}
						}

						/* one more condition to check if the indicator is Universal vaccine introductions over time */
						/* hardcoded on 2 jan 2015 */
					} else if (dureUtil.respJsonData.indicatorMetaInfo[0].indicatorInfo.indicatorId == 111 || dureUtil.respJsonData.indicatorMetaInfo[0].indicatorInfo.indicatorId == 116) {
						console.log(dureUtil.respJsonData.indicatorMetaInfo[0].indicatorInfo.indicatorId);
						if (val.getAttribute("dataheadervalue") == 'N/A') {
							/* create Introduced legend */

							if (!notIntroduced) {

								body +=
									'<div  class="legendInnerDiv"><i style="background:' + val.getAttribute("datacolorcode") + '"></i> Not introduced </div>';

								documentFragment.append('<div  class="legendInnerDiv" style="width:30%;display:inline-block"><i style="background:' + val.getAttribute("datacolorcode") + '"></i> Not introduced</div>');

								notPlannedPresent = true;
							}

						} else {

							if (!introducedPresent) {

								body +=
									'<div  class="legendInnerDiv"><i style="background:' + val.getAttribute("datacolorcode") + '"></i> ' + val.getAttribute("dataheadervalue") + ' </div>';

								documentFragment.append('<div  class="legendInnerDiv" style="width:30%;display:inline-block"><i style="background:' + val.getAttribute("datacolorcode") + '"></i> ' + val.getAttribute("dataheadervalue") + '</div>');

								introducedPresent = true;
							}
						}
				}/*else if (dureUtil.respJsonData.indicatorMetaInfo[0].indicatorInfo.indicatorId == 182) {
						console.log("No of citations in legend");

					} */
					else {
						console.log(dureUtil.respJsonData.indicatorMetaInfo[0].indicatorInfo.indicatorId);
						console.log(val.getAttribute("dataheadervalue").toLowerCase());
						/* check if the legend is already added or not if not added then push to array */

						if ($.inArray(val.getAttribute("dataheadervalue").toLowerCase(), addLegendArr) < 0) {

							if ($.inArray(dureUtil.respJsonData.indicatorMetaInfo[0].indicatorInfo.indicatorId, notIntroducedDisabled) >= 0) {

								if (val.getAttribute("dataheadervalue").toLowerCase() == 'not introduced') {
									// do not enter not introduced
									//alert(123);
								} else {

									addLegendArr.push(val.getAttribute("dataheadervalue").toLowerCase());
									body +=
										'<div  class="legendInnerDiv"><i style="background:' + val.getAttribute("datacolorcode") + '"></i> ' + val.getAttribute("dataheadervalue") + '</div>';

									documentFragment.append('<div  class="legendInnerDiv" style="width:30%;display:inline-block"><i style="background:' + val.getAttribute("datacolorcode") + '"></i> ' + val.getAttribute("dataheadervalue") + '</div>');

								}

							} else {
								addLegendArr.push(val.getAttribute("dataheadervalue").toLowerCase());
								body +=
									'<div  class="legendInnerDiv"><i style="background:' + val.getAttribute("datacolorcode") + '"></i> ' + val.getAttribute("dataheadervalue") + '</div>';

								documentFragment.append('<div  class="legendInnerDiv" style="width:30%;display:inline-block"><i style="background:' + val.getAttribute("datacolorcode") + '"></i> ' + val.getAttribute("dataheadervalue") + '</div>');

							}
						}
					}
				} else {
					/*** CHANGES TO GET FILTER COLOR AND LEGEND ON THE BASIS OF SELECTED FILTER ***/
					//console.log('### Legend Filter ###');

					if (iHealthMap.stylingdata[iHealthMap.getCurrentyear()]) {

						var tempArr = [];
						$.each(iHealthMap.stylingdata[iHealthMap.getCurrentyear()][0], function (i, j) {
							for (var m = 0; m < iHealthMap.FilterDataArr.length; m++) {
								if (iHealthMap.FilterDataArr[m][0] == j[0][0]) {
									var tempObj = {};
									tempObj.order = m;
									tempObj.filterName = iHealthMap.FilterDataArr[m][2];
									tempObj.filterColor = iHealthMap.FilterDataArr[m][1];
									tempArr.push(tempObj);
								}
							}
						});

						var dupes = {};
						var singles = [];

						$.each(tempArr, function (i, el) {
							if (!dupes[el.filterName]) {
								dupes[el.filterName] = true;
								singles.push(el);
							}
						});

						var tempSingles = [];
						for (var k = 0; k < singles.length; k++) {
							tempSingles.push(singles[k].order);
						}

						tempSingles.sort(function (a, b) {
							return a - b
						});
						var objectSingles = [];
						for (var r = 0; r < tempSingles.length; r++) {
							for (var key in singles) {
								if (singles[key].order == tempSingles[r]) {
									objectSingles.push(singles[key]);
								}
							}
						}

						var checkForNA = '';

						$.each(objectSingles, function (r, t) {

							if (t.filterName == 'N/A') {
								checkForNA = t.filterName;
							} else {
								body += '<div  class="legendInnerDiv"><i style="background:' + t.filterColor + '"></i> ' + t.filterName + '</div>';

								documentFragment.append('<div  class="legendInnerDiv" style="width:30%;display:inline-block"><i style="background:' + t.filterColor + '"></i> ' + t.filterName + '</div>');
							}
						});

						if (checkForNA == 'N/A') {
							body += '<div class="legendInnerDiv"><i style="background:#cbcfd3"></i> N/A</div>';

							documentFragment.append('<div class="legendInnerDiv"><i style="background:#cbcfd3"></i> N/A</div>');
						}
					}
					return false;
				}
			});
		}

		//console.log('legend 1');

		$("#lengendGrid").html("");
		$("#lengendGrid").append(documentFragment);
		div.innerHTML += iHealthMap.buildBoxHtml(header, body, 'infolegend');
		return div;
	};

	iHealthMap.legendControl.addTo(iHealthMap.map);

	/* remove duplicates */
	var seen = {};
	$('.legendInnerDiv').each(function () {
		var txt = $(this).text();
		if (seen[txt])
			$(this).remove();
		else
			seen[txt] = true;
	});
}

/********************* binding click event for the button on the map  *********************/
iHealthMap.bindFilterBtnEvent = function () {

	/* binding check box check event for filter */

	$('.topParentFilter').on('ifChecked', function (event) {
		$('.' + this.id).iCheck('check');
	});

	$('.topParentFilter').on('ifUnchecked', function (event) {
		$('.' + this.id).iCheck('uncheck');
	});

	$('.topInnerFilter').on('ifChecked', function (event) {
		$('.' + this.id).iCheck('check');
	});

	$('.topInnerFilter').on('ifUnchecked', function (event) {
		$('.' + this.id).iCheck('uncheck');
	});

	iHealthMap.createLegendOnFilter();

	// Click event for apply filter button starts here
	$("#applyFilterBtn").click(function (e) {
		var filterValueArr = [];
		//var checkedFilters = $('.filterCheckBox:checkbox:checked');

		iHealthMap.isFilterOn = true;
		var checkedFilters = $('.filterCheckBox:checkbox:checked');
		iHealthMap.CheckedFilter = '';

		iHealthMap.CheckedFilter = $('.filterCheckBox:checkbox:checked');

		if (iHealthMap.CheckedFilter.length < 1) {

			checkedFilters = $('.filterCheckBox');
			iHealthMap.CheckedFilter = $('.filterCheckBox');
		}

		var filterData = dureUtil.respJsonData.filterGroups;
				if (filterData == "") {
			if(dureUtil.getIndicatorId()==182 || dureUtil.getIndicatorId()==183 ){
			/* creating global filter array for number of citations */
			iHealthMap.filterRespTempArr = [];
			var filterGroups=[];
			dureUtil.getImpactStudiesData();
			//var filterData = dureUtil.impactStudiesValues.impactStudies.headerobjectivelist;
			var filterData = dureUtil.impactStudiesValues.impactStudies.headerobjectivelist;
			var filterGroups=dureUtil.impactStudiesValues.impactStudies.countrylist;
			console.log(filterGroups);
			var json_data = JSON.stringify(filterGroups);
			var result = [];

			for (var i in json_data) {
				result.push(i, json_data);
			}

			if (filterData.length > 0) {
				// new changes as per the filter grouped data ##### changes are done as filter code is not present

				/* follwoing each function is part of the new change for filter grouping */
				
				$.each(checkedFilters, function (key, val) {
					filterValueArr.push({
						"filterValue": val.value,
					});

				});

			} else {
				$.each(checkedFilters, function (key, val) {
					filterValueArr.push({
						"filterValue": val.value,
						// "filterCode": val.getAttribute("datacode")
					});
				});
			}
			console.log(filterValueArr);
			if (filterValueArr.length != 0) {
				if (iHealthMap.setFilter()) {
					//console.log(filterValueArr);
					iHealthMap.setFilterParam(filterValueArr);
					iHealthMap.setFilterType('data');

					$('#main-filter').addClass('filter-selected');
				}
			} else {
				iHealthMap.unsetFilter();
			}
			if (iHealthMap.loadLayer()) {
				$('.bs-example-modal-lg').modal('hide');
				iHealthMap.createLegendOnFilter();
				iHealthMap.createFilterLegend(filterValueArr);
			}
			iHealthMap.setSelectedImpactFiltervaluesOnLegend(JSON.stringify(filterValueArr));
		}
	}
	else{
		/* creating global filter array */
		iHealthMap.filterRespTempArr = [];
		for (var i = 0; i < dureUtil.respJsonData.filterGroups.length; i++) {

			//console.log(dureUtil.respJsonData.filterGroups[i]);
			for (var j = 0; j < dureUtil.respJsonData.filterGroups[i].filterSubGroups.length; j++) {
				//console.log(dureUtil.respJsonData.filterGroups[i].filterSubGroups[j]);

				for (var k = 0; k < dureUtil.respJsonData.filterGroups[i].filterSubGroups[j].filters.length; k++) {
					var tempObj = {};
					tempObj = dureUtil.respJsonData.filterGroups[i].filterSubGroups[j].filters[k];
					tempObj.filterSubGroupsName = dureUtil.respJsonData.filterGroups[i].filterSubGroups[j].filterSubGroupName;
					iHealthMap.filterRespTempArr.push(dureUtil.respJsonData.filterGroups[i].filterSubGroups[j].filters[k]);
				}
			}
		}
		console.log(JSON.stringify(iHealthMap.filterRespTempArr));

		if (filterData.length > 0) {
			// new changes as per the filter grouped data ##### changes are done as filter code is not present

			/* follwoing each function is part of the new change for filter grouping */
			$.each(checkedFilters, function (key, val) {

				filterValueArr.push({
					"filterValue" : val.value,
				});

			});

		} else {
			$.each(checkedFilters, function (key, val) {
				filterValueArr.push({
					"filterValue" : val.value,
					// "filterCode": val.getAttribute("datacode")
				});
			});
		}

		// If values are checked, then the length of array is checked. If length is 0 filter params set else not set .
		if (filterValueArr.length != 0) {
			if (iHealthMap.setFilter()) {
				//console.log(filterValueArr);
				iHealthMap.setFilterParam(filterValueArr);
				iHealthMap.setFilterType('data');

				$('#main-filter').addClass('filter-selected');
			}
		} else {
			iHealthMap.unsetFilter();
		}
		if (iHealthMap.loadLayer()) {
			$('.bs-example-modal-lg').modal('hide');
			iHealthMap.createLegendOnFilter();
		}
		iHealthMap.setSelectedFiltervaluesOnLegend(filterValueArr);
	}
	});

	// Click event for clear filter button starts here
	$("#clearFilterBtn").click(function (e) {
		if (iHealthMap.unsetFilter()) {
			iHealthMap.clearFilterOptions()
			//iHealthMap.loadLayer();
			iHealthMap.onResettingMap();
			$('.bs-example-modal-lg').modal('hide');

			$('#main-filter').removeClass('filter-selected');

		}
	});
};

iHealthMap.setSelectedFiltervaluesOnLegend = function (filterValueArr) {
	//<i class="fa fa-filter" style="font-size: 20px;"></i>
	var extendLegend = '<div class="legendInnerDiv"><span style="color: green;font-size: 15px;">Filters</span></div>';
	if (Object.prototype.toString.call(filterValueArr) === '[object Array]') {
		if (filterValueArr.length > 0) {
			for (var i = 0; i < filterValueArr.length; i++) {

				extendLegend += '<div class="legendInnerDiv"><i>-</i>' + filterValueArr[i].filterValue + '</div>';
			}
		}
	}
	$(".legend-info").append(extendLegend);
}
/*
* @Author- Radhika Subramanian 
*/
iHealthMap.setSelectedImpactFiltervaluesOnLegend = function (filterValueArr) {
	//<i class="fa fa-filter" style="font-size: 20px;"></i>
	var extendLegend = '<div class="legendInnerDiv"><span style="color: green;font-size: 15px;">Filters</span></div>';
	var result = [];
	var result = $.parseJSON(filterValueArr);
	$.each(result, function (k, v) {
		extendLegend += '<div class="legendInnerDiv"><i>-</i>' + result[k].filterValue + '</div>';
	});
	$(".legend-info").append(extendLegend);
}

iHealthMap.clearFilterOptions = function () {
	iHealthMap.setFilterParam('');
	$('.icheckbox_minimal').removeClass('checked');
	$('.filterCheckBox:checkbox').attr("checked", false);
	iHealthMap.createLegendOnFilter();
}

iHealthMap.setFilter = function () {
	iHealthMap.isFilterApplied = 1;
	return true;
};

iHealthMap.unsetFilter = function () {
	iHealthMap.isFilterApplied = 0;
	$('.regionsearch').selectpicker('val', ''); // Resets the selection to first option i.e blank.
	$('.regionsearch').selectpicker('hide');

	$('.countrylocatorPicker').selectpicker('val', ''); // Resets the selection to first option i.e blank.
	$('.countrylocatorPicker').selectpicker('hide');

	$('#main-filter').removeClass('filter-selected');

	$('.listBtn').show();
	return true;
};

iHealthMap.checkFilter = function () {
	return iHealthMap.isFilterApplied;
};

iHealthMap.setFilterParam = function (filterArr) {
	iHealthMap.filterParams = filterArr;
};

iHealthMap.getFilterParam = function () {
	return iHealthMap.filterParams;
};

iHealthMap.getFilteredRegions = function (listOfRegions) {
	//console.log(listOfRegions);
	var filterRegions = {};
	var originalData;

	if ($.isEmptyObject(iHealthMap.dataProviderWorkingFilteredCopy)) {
		//console.log('Filter not set use OLD object');
		originalData = iHealthMap.dataProviderWorkingCopy;
	} else {
		//console.log('Filter Set set ');
		originalData = iHealthMap.dataProviderWorkingFilteredCopy;
	}

	//console.log(originalData);
	iHealthMap.dataProviderWorkingFilteredCountryCopy = $.extend(true, {}, originalData);

	$.each(iHealthMap.dataProviderWorkingFilteredCountryCopy, function (year, dataForYear) {
		var temp = {};
		//console.log(year);
		$.each(dataForYear, function (index, dataForCountries) {
			//console.log(index);
			$.each(listOfRegions, function (index, regionObject) {
				if (dataForCountries.hasOwnProperty(regionObject.code)) {

					temp[regionObject.code] = dataForCountries[regionObject.code];
				}
			});
		});
		iHealthMap.dataProviderWorkingFilteredCountryCopy[year][0] = temp;
	});

	// var dataFilterParam = iHealthMap.getFilterParam();
	// if(dataFilterParam.length != 0){
	// iHealthMap.dataProviderWorkingFilteredCountryCopy = iHealthMap.getFilteredData(dataFilterParam);
	// }

	return iHealthMap.dataProviderWorkingFilteredCountryCopy;
};

// ---------------------- new filter logic ------------------------------ /
// ------------------------------------------------------ /
// APPLYING NEW LOGIN FOR AND/OR BASED ON SELECTED FLITER /
// ------------------------Start------------------------- /

iHealthMap.getFilteredData = function (param) {
	console.log(dureUtil.respJsonData.filterGroups);
	var UVOT_Indicators = [51, 56, 61, 119];
	var filter = {};
	//    console.log(param);
	if ($.isEmptyObject(iHealthMap.dataProviderWorkingFilteredCountryCopy)) {

		if ($.inArray(dureUtil.indicatorId, UVOT_Indicators) > -1) {
			dureUtil.timelineCountryData = dureUtil.temptimelineCountryData;
			iHealthMap.dataProviderWorkingFilteredCopy = $.extend(true, {}, dureUtil.timelineCountryData);
		} else {
			iHealthMap.dataProviderWorkingFilteredCopy = $.extend(true, {}, iHealthMap.dataProviderWorkingCopy);
		}

	} else {

		if ($.inArray(dureUtil.indicatorId, UVOT_Indicators) > -1) {
			dureUtil.timelineCountryData = dureUtil.temptimelineCountryData;
			iHealthMap.dataProviderWorkingFilteredCopy = $.extend(true, {}, dureUtil.timelineCountryData);
		} else {
			iHealthMap.dataProviderWorkingFilteredCopy = $.extend(true, {}, iHealthMap.dataProviderWorkingFilteredCountryCopy);
		}
	}

	filter.param = param;
	filter.truth = [];
	filter.flag = false;
	/* create array of filter categories on the basis of selected filter */
	var filteDataFromServer = dureUtil.respJsonData.filterGroups;
	var selectedFiltersObj = {};
	var selectedFilter = $('.filterCheckBox:checkbox:checked');

	var i = 0;
	for (i = 0; i < filteDataFromServer.length; i++) {

		selectedFiltersObj[filteDataFromServer[i].filterGroupName] = [selectedFilter.filter(".topParentFilter" + i)];

	}
	//    console.log(selectedFiltersObj);
	//console.log(dureUtil.respJsonData);
	$.each(selectedFiltersObj, function (i, j) {
		if (selectedFiltersObj[i][0].length < 1) {
			if (i == dureUtil.respJsonData.indicatorMetaInfo[0].indicatorInfo.indicatorName) {
				iHealthMap.baseFilterNull = true;
			}
			delete selectedFiltersObj[i];
		}

	});

	//console.log(selectedFiltersObj);
	var arr = [];
	for (var prop in selectedFiltersObj) {

		/* Checking condition to push the Base Filter/Selected-Indicator-Filter param to 0 index in the array... */
		if (prop == dureUtil.respJsonData.indicatorMetaInfo[0].indicatorInfo.indicatorName) {
			arr.unshift(selectedFiltersObj[prop]);
		} else {
			arr.push(selectedFiltersObj[prop]);
		}

	}

	if ($.inArray(dureUtil.indicatorId, UVOT_Indicators) > -1) {
		var list = dureUtil.timelineCountryData;
	} else {
		var list = iHealthMap.dataProviderWorkingFilteredCopy[iHealthMap.getCurrentyear()][0];
	}

	$.each(list, function (k, v) {

		//Iterate through the list of filter group ...
		for (var i = 0; i < arr.length; i++) {

			var tempval = -1;
			// Iterate through the list of filter param checked in a filter group...
			for (var l = 0; l < arr[i][0].length; l++) {

				// Checking condition to know whether Base Filter/Selected-Indicator-Filter Params applied first ...
				if (i < 1 && !iHealthMap.baseFilterNull) {

					if ($.inArray(dureUtil.indicatorId, UVOT_Indicators) > -1) {
						if (list[k][0][0].trim() != undefined) {
							tempval = 0;
						}
					} else {
						if ($(arr[i][0][l]).val().trim() == list[k][0][0].trim()) {
							tempval = 0;
						}
					}
				} else {
					if (jQuery.inArray($(arr[i][0][l]).val(), list[k][0]) > -1) {
						tempval = (jQuery.inArray($(arr[i][0][l]).val(), v[0]));
					}
				}
			}

			if (tempval < 0) {
				break;
			}

		}

		if (tempval < 0) {
			//console.log("value is less then 0 for " + k);
			filter.truth.push(false);
			filter.truth
		} else {
			//console.log("value is greater then 0 for " + k);
			filter.truth.push(true);
		}
		//        console.log(filter.truth);
		if ($.inArray(true, filter.truth) > -1) {
			filter.flag = true;
		} else {
			filter.flag = false;
		}
		filter.truth = [];
		// filter.flag = iHealthMap.filterateDataByParams(filter.param,v);
		if (filter.flag == false) {
			if ($.inArray(dureUtil.indicatorId, UVOT_Indicators) > -1) {
				delete iHealthMap.dataProviderWorkingFilteredCopy[k];
			} else {
				delete iHealthMap.dataProviderWorkingFilteredCopy[iHealthMap.getCurrentyear()][0][k];
			}
		}
	});
	//console.log(iHealthMap.dataProviderWorkingFilteredCopy);
	// Load filtered data into table after filteration.
	// iHealthTable.loadFilteredData(iHealthMap.dataProviderWorkingFilteredCopy);
	if ($.inArray(dureUtil.indicatorId, UVOT_Indicators) > -1) {

		var currentYearVal = iHealthMap.getCurrentyear();
		var obj = {};
		obj[currentYearVal] = [iHealthMap.dataProviderWorkingFilteredCopy];
		iHealthMap.dataProviderWorkingFilteredCopy = obj;
		return iHealthMap.dataProviderWorkingFilteredCopy;
	} else {

		return iHealthMap.dataProviderWorkingFilteredCopy;
	}
};

// ------------------------------------------------------ /
// APPLYING NEW LOGIN FOR AND/OR BASED ON SELECTED FLITER /
// ------------------------End--------------------------- /
// ---------------------- new filter logic ------------------------------ //

// Commented by swapnil for new logic AND/OR on indicator based filter
/*iHealthMap.getFilteredData = function(param){
var filter = {};
console.log(param);
if($.isEmptyObject(iHealthMap.dataProviderWorkingFilteredCountryCopy))
{
console.log('Filter not set use OLD object');
iHealthMap.dataProviderWorkingFilteredCopy = $.extend(true,{},iHealthMap.dataProviderWorkingCopy);
console.log(iHealthMap.dataProviderWorkingFilteredCopy);
}
else
{
console.log('Filter Set set ');
iHealthMap.dataProviderWorkingFilteredCopy = $.extend(true,{},iHealthMap.dataProviderWorkingFilteredCountryCopy);
}

// Deep copy of original object

filter.param = param;
filter.truth = [];
filter.flag = false;

var list = iHealthMap.dataProviderWorkingFilteredCopy[iHealthMap.getCurrentyear()][0];
console.log(filter);
console.log(list);

$.each(list, function(k,v){

$.each(filter.param,function(key,value){
var key = '';
for(var fkey in v[3]){
if(v[3][fkey] != value.filterCode){
continue;
}else{
key = fkey;
break;
}
}
if(value.filterValue == v[0][key]){
filter.truth.push(true);
}else{
filter.truth.push(false);
}
});
if($.inArray(true,filter.truth) > -1){
filter.flag = true;
}else{
filter.flag = false;
}
filter.truth = [];
// filter.flag = iHealthMap.filterateDataByParams(filter.param,v);
if(filter.flag == false){
delete iHealthMap.dataProviderWorkingFilteredCopy[iHealthMap.getCurrentyear()][0][k];
}
});
// iHealthMap.setFilterParamiHealthMap.setFilterParam ===== found something wrong.

return iHealthMap.dataProviderWorkingFilteredCopy;
};*/

iHealthMap.filterateDataByParams = function (param, val) {
	var filterate = {};
	filterate.truth = [];
	filterate.flag = false;
	filterate.param = param;
	filterate.data = val;

	$.each(filterate.param, function (k, v) {
		var key = '';
		for (var fkey in filterate.data[3]) {
			if (filterate.data[3][fkey] != v.filterCode) {
				continue;
			} else {
				key = fkey;
				break;
			}
		}
		//console.log(v.filterValue);
		//console.log(filterate.data[0][key]);
		if (v.filterValue == filterate.data[0][key]) {
			filterate.truth.push(true);
		} else {
			filterate.truth.push(false);
		}
	});

	if ($.inArray(true, filterate.truth) > -1) {
		return true;
	} else {
		return false;
	}
};

iHealthMap.setCurrentyear = function (year) {

	//console.log(year);

	iHealthMap.currentYear = year;
	return true;
}

iHealthMap.getCurrentyear = function () {
	return iHealthMap.currentYear;
}
// iHealthMap.removeSelectLayers = function(){
// 	//console.log('REMOVING SELECT LAYER');
// 	iHealthMap.map.removeLayer(incomeLayer);
// 	iHealthMap.map.removeLayer(telephoneLinesBarChart);
// 	iHealthMap.map.removeLayer(solidFuelLayer);
// 	selectLayer.removeFrom(iHealthMap.map);
// 	selectLayer = null;
// }
/* click event for clear filter button ends here  */

iHealthMap.reloadBaseLayer = function () {
	//console.log("Reloading base layer...");
	setTimeout(function () {
		iHealthMap.map.invalidateSize();
	}, 400);
};

// Get country details from ISO CODE 3.
iHealthMap.getCountryObjectFromAlpha3 = function (alpha3) {

	var countryObject = {};
	if (alpha3 != undefined) {
		for (obj in L.countryLookup) {
			//console.log(L.countryLookup[obj]);
			var objValue = L.countryLookup[obj];

			if (objValue['alpha-3'] == alpha3) {
				//console.log(objValue);
				countryObject.countryCode = objValue['country-code'];
				countryObject.countryName = objValue['name'];
				break;
			}
		}
	}

	return countryObject;
}

iHealthMap.setRegionFilter = function (param) {

	if (iHealthMap.regionFilter != param) {
		iHealthMap.isRegionFilterChanged = true;
	} else {
		iHealthMap.isRegionFilterChanged = false;
	}
	iHealthMap.regionFilter = param;
}

iHealthMap.checkRegionFilterChange = function () {
	return iHealthMap.isRegionFilterChanged;
}

iHealthMap.getRegionFilter = function () {
	return iHealthMap.regionFilter;
}

iHealthMap.setFilterType = function (filterType) {

	iHealthMap.filterType = filterType;
	return true;
}

iHealthMap.collapseBtnClick = function () {
	$(".collapseBtn").click(function (e) {

		//console.log($(this).offsetParent().next().is(':visible'));

		if ($(this).offsetParent().next().is(':visible')) {
			/* if it is true then hide all the button */
			//$(this).parent('.hideOnCollapse').hide();
			//$(this).closest('.hideOnCollapse').hide();
			//      $(this).parent().find(".hideOnCollapse").hide();
			$(this).attr('data-original-title', 'Expand');
			//$('.regionsearch').selectpicker('hide');
			//$('.hideOnCollapse').hide();
		} else {
			/* if it is false then show all the buttons */
			//$('.hideOnCollapse').show();
			//$(this).closest('.hideOnCollapse').show();
			$(this).parent().find(".hideOnCollapse").show();
			$(this).attr('data-original-title', 'Collapse');
		}
	})
};

iHealthMap.setFullScreenZoomLevel = function (zoomLevel) {
	iHealthMap.mapFullscreenZoom = zoomLevel;
}

$(document).bind("fullscreenchange", function () {

	//console.log("Fullscreen " + ($(document).fullScreen() ? "on" : "off"));

	var fullscreen = $(document).fullScreen() ? "on" : "off";

	if (fullscreen === "on") {
		//console.log(screen.width);
		//console.log(screen.height);
		// This is the max num any system can process. So we set it to max number of the system. This will nullify the effect and default indexes will come into picture.
		$("#filterModal").css('z-index', '2147483647');
		// $("#year-modal").css('z-index','2147483647');
		// $(".modal-backdrop").css('z-index','2147483647');
		$("#map-panel").width(screen.width);
		$("#map-panel").height(screen.height);
		$("#ihmap").height(screen.height - 60);
		iHealthMap.map.setZoom(iHealthMap.mapFullscreenZoom);
		iHealthMap.reloadBaseLayer();
	} else {
		// $("#map-panel").width(iHealthMap.mapPanelWidth);
		$("#filterModal").css('z-index', '');
		// $("#year-modal").css('z-index','');
		// $(".modal-backdrop").css('z-index','');
		$("#map-panel").height("");
		$("#map-panel").width("");
		$("#map-panel").attr('width', iHealthMap.mapPanelWidth);
		$("#ihmap").height(iHealthMap.mapHeight);
		iHealthMap.map.setZoom(iHealthMap._defaultZoom);
		iHealthMap.reloadBaseLayer();
	}
});

// Append data source to bottom of Legend Box.
iHealthMap.createSourceLabel = function (arg) {

	var sourceLbl = {};
	if (dureUtil.indicatorMetaInfo.indicatorInfoExt.source != undefined) {
		iHealthMap.sourcelabelDict = true;
		//Nirav changes
		// if(arg.apply) {
		/*var dataSourceHtml = "<div class='dataSourceWrap '><div class='indicatorSourceInfo borderto'>"
		+ "<h4>Indicator Information  :<b> "+dureUtil.indicatorMetaInfo.indicatorInfo.indicatorName+"</b></h4>"
		+ "<span style='font-weight:bold' class='spacefor'>Data Source   : </span>"
		+ dureUtil.indicatorMetaInfo.indicatorInfoExt.source
		+ "<br/><span style='font-weight:bold' class='spacefor1'>Definition   :   </span>  "
		+  dureUtil.indicatorMetaInfo.indicatorInfoExt.label
		+  "</div></div>";*/
		var dataSourceHtml = "<div class='dataSourceWrap '></div>";
		$('#dataSourceContent').html(dataSourceHtml);
		//}

		viewhubjs.serviceCallDataDictionary();
		$('.dataSourceBtn').click(function () {

			$('#dataSourceModal').modal('show');

		});

	}

}
iHealthMap.createSourcelabelDictionary = function (data, checkuser) {

	//	console.log(JSON.parse(data));
	iHealthMap.dataDictionaryHTML = '';
	var dataDictionaryHTML = '<div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true">';
	var availableDataDictionary = [];
	if (data.indicatorMetaInfo[0].indicatorInfoCat) {

		$("#dataSourceContent1").empty();
		$.each(data.indicatorMetaInfo[0].indicatorInfoCat, function (key, val) {
			var objectKeys = Object.keys(val);
			var catKeys = objectKeys.filter(function (num) {
				if (!isNaN(num))
					return num;
			});
			//IndicatorSourceContainer[dureUtil.indicatorId].sourceID
			if (IndicatorSourceContainer[dureUtil.indicatorId]) {

				var sourceId = (IndicatorSourceContainer[dureUtil.indicatorId].sourceID).toString();

				if ($.inArray(sourceId, catKeys) != -1) {
					$.inArray(sourceId, catKeys);
					catKeys[0] = catKeys[$.inArray(sourceId, catKeys)];
					catKeys.splice(1, catKeys.length - 1)
				} else {
					catKeys = [];
				}

			} else {
				catKeys = [];
			}

			for (var i = 0; i < catKeys.length; i++) {

				dataDictionaryHTML += '<div class="panel panel-default" id="pdf-data-dictionary-' + catKeys[i] + '">';
				dataDictionaryHTML += '<div class="panel-heading" style="background-color: #b6f5ff;" role="tab" id="heading' + catKeys[i] + '">';
				dataDictionaryHTML += '<h4 class="panel-title">';
				dataDictionaryHTML += '<a role="button" data-toggle="collapse" data-parent="#accordion" href="#collapse-ind' + catKeys[i] + '" aria-expanded="true" aria-controls="collapse-ind' + catKeys[i] + '">';
				dataDictionaryHTML += '<span class="glyphicon glyphicon-plus"></span>&nbsp;&nbsp;';
				dataDictionaryHTML += val[catKeys[i]];
				dataDictionaryHTML += '</a>';
				dataDictionaryHTML += '</h4>';
				dataDictionaryHTML += '</div>';
				dataDictionaryHTML += '<div id="collapse-ind' + catKeys[i] + '" class="panel-collapse collapse in" role="tabpanel" aria-labelledby="heading' + catKeys[i] + '">';

				dataDictionaryHTML += '<div class="panel-body">';

				var innerObjectKeys = Object.keys(val[catKeys[i] + '_cat']); // inner obj sub cat
				var innerCatKeys = innerObjectKeys.filter(function (num) {
					if (!isNaN(num))
						return num;
				});

				dataDictionaryHTML += '<div class="data-indicator" style="background-color: #b6f5ff; padding: 2px 4px 2px 4px;">';
				dataDictionaryHTML += '<i class="fa fa-info-circle"></i>&nbsp;&nbsp;<span class="def-style">Indicators : ' + val[catKeys[i]] + '</span>';
				//dataDictionaryHTML += '<br/><span style="margin-left:17px;" class="def-style">Source : </span>' + val[catKeys[i]+ "_source"];
				var srcId = catKeys[i] + "-" + 0;
				dataDictionaryHTML += '<div><span class="def-style">Source : </span>';
				dataDictionaryHTML += '<span>' + val[catKeys[i] + "_source"] + '</span></div>';
				dataDictionaryHTML += '</div>';
				dataDictionaryHTML += '<div class="data-category" style="margin-left:25px;">';
				for (var k = 0; k < innerCatKeys.length; k++) {

					$.each(val[catKeys[i] + '_cat'][innerCatKeys[k] + '_subcat'], function (innerKey, innerVal) {
						dataDictionaryHTML += '<hr>';
						if (val[catKeys[i] + '_cat'][innerCatKeys[k]]) {
							dataDictionaryHTML += '<i class="fa fa-info"></i>&nbsp;&nbsp;<span class="def-style">Category : </span>' + val[catKeys[i] + '_cat'][innerCatKeys[k]];
							dataDictionaryHTML += '<br/>';
						}

						if (innerVal['subcategoryname']) {
							dataDictionaryHTML += '<span class="def-style">Sub-Category: </span>' + innerVal['subcategoryname'];
							dataDictionaryHTML += '<br/>';
						}
						//var defId = catKeys[i] + "-" +  innerVal['id'];
						var defId = catKeys[i] + "--" + innerVal['id'];

						dataDictionaryHTML += '<div id=' + defId + '><span class="def-style">Definition : </span>';
						dataDictionaryHTML += '<span>' + innerVal['definition'] + '</span></div>';
					});
				}
				dataDictionaryHTML += '</div>';
				dataDictionaryHTML += '</div>';
				dataDictionaryHTML += '</div>';
				dataDictionaryHTML += '</div>';

			}
		});
		dataDictionaryHTML += '</div>';

	}

	$('#dataSourceContent').append(dataDictionaryHTML);
	iHealthMap.sourcelabelDict = false;
	iHealthMap.dataDictionaryHTML = dataDictionaryHTML;
}

iHealthMap.createSourceLabel1 = function () {

	//  console.log("this is what it is !!!!! ------ >>>>>>")
	$('.dataSourceBtn1').click(function () {

		$('#dataSourceModal1').modal('show');

	});
	$('#dataSourceModal1').on('shown.bs.modal', function () {
		viewhubjs.serviceCallDataDictionary();
	});
}
