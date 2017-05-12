var selectLayer ;
var incomeLayer;
var telephoneLinesBarChart;
var solidFuelLayer;
function invokeIncomeLevel() {	

	var incomeLevelTypes = ['OEC', 'NOC', 'UMC', 'MIC', 'LMC', 'LIC', 'HPC'];
	var valueArray = [{"id":"HIC","value":"High income"},{"id":"HPC","value":"Heavily indebted poor countries (HIPC)"},{"id":"INX","value":"Not classified"},{"id":"LIC","value":"Low income"},{"id":"LMC","value":"Lower middle income"},{"id":"LMY","value":"Low & middle income"},{"id":"MIC","value":"Middle income"},{"id":"NOC","value":"High income: nonOECD"},{"id":"OEC","value":"High income: OECD"},{"id":"UMC","value":"Upper middle income"}];
	
	var getMap = function (valueArray) {
		var map = {};
		for (var index = 0; index < valueArray.length; ++index) {
			var value = valueArray[index];

			map[value['id']] = value['value'];
		}
		return map;
	};

	var valueMap = getMap(valueArray);

	var incomeLevelToText = function (value) {
		//return valueMap[incomeLevelTypes[value]];
		return value;
	};

	var colorFunction1 = new L.HSLLuminosityFunction(new L.Point(0, 0.2), new L.Point(incomeLevelTypes.length - 1, 0.75), {outputHue: 0, outputLuminosity: '100%'});
	var fillColorFunction1 = new L.HSLLuminosityFunction(new L.Point(0, 0.5), new L.Point(incomeLevelTypes.length - 1, 1), {outputHue: 0, outputLuminosity: '100%'});

	// var colorFunction1 = new L.HSLHueFunction(new L.Point(0, 240), new L.Point(incomeLevelTypes.length - 1, 0), {outputSaturation: '100%', outputLuminosity: '25%'});
	// var fillColorFunction1 = new L.HSLHueFunction(new L.Point(0, 240), new L.Point(incomeLevelTypes.length - 1, 0), {outputSaturation: '100%', outputLuminosity: '50%'});

	// var colorFunction1 = new L.HSLLuminosityFunction(new L.Point(0, 0.5), new L.Point(incomeLevelTypes.length - 1, 0.1), {outputHue: 27, outputLuminosity: '100%'});
	// var fillColorFunction1 = new L.HSLLuminosityFunction(new L.Point(0, 0.5), new L.Point(incomeLevelTypes.length - 1, 0.2), {outputHue: 27, outputLuminosity: '100%'});

	var styles = new L.StylesBuilder(incomeLevelTypes, {
		displayName: incomeLevelToText,
		color: colorFunction1,
		fillColor: fillColorFunction1
	});
	
		function getColor(d) {
			return d > 2000 ? '#800026' :
			       d > 1000  ? '#970531' :
			       d > 500  ? '#BB1647' :
			       d > 100  ? '#D73767' :
			       d > 50   ? '#E9658D' :
			       d > 20   ? '#F696B3' :
			       d > 10   ? '#FCBBCE' :
			                  '#FED7E3';
		}	

		var incomeArray = incomeLevels[1];
		for (var i = 0; i < incomeArray.length; i++)
		{
			var object = incomeArray[i];
			//console.log(object);
			for (var j = 0; j < density.length; j++)
			{
				var objectDensity = density[j];
				//console.log(object.iso2Code + " " + objectDensity.code);
				if(object.iso2Code === objectDensity.code)
				{
							//console.log('Settting value for ' + objectDensity.code);
							object.incomeLevel['density'] = objectDensity.value;	
							break;
				}
			}
		}
		
	//console.log(incomeLevels[1]);		
	var options = {
		recordsField: '1',
		locationMode: L.LocationModes.COUNTRY,
		codeField: 'id',
		displayOptions: {
			'incomeLevel.density': {
				displayName: 'Population Density',
				//styles: styles.getStyles()
			}
		},
		layerOptions: {
			fillOpacity: 0.7,
			opacity: 1,
			weight: 1
		},
		tooltipOptions: {
			iconSize: new L.Point(100,65),
			iconAnchor: new L.Point(-5,65)
		},

		onEachRecord: function (layer, record) {
		
		
/* 			var $html = $(L.HTMLUtils.buildTable(record));

			layer.bindPopup($html.wrap('<div/>').parent().html(), {
				maxWidth: 250,
				minWidth: 250
			}); */
			
		layer.setStyle({
			color: getColor(record.incomeLevel.density),
			fillOpacity: 0.8
		});	
			
		}
	};

	incomeLayer = new L.ChoroplethDataLayer(incomeLevels, options);

	// province.map.addLayer(incomeLayer);

	// $('#legend').append(incomeLayer.getLegend({
		// className: 'well'
	// }));
	
/************************************************* End of Income Layer **************************************************/

	var colorFunction = new L.HSLHueFunction(new L.Point(0,90), new L.Point(300000000,0), {outputSaturation: '100%', outputLuminosity: '30%'});
	var fillColorFunction = new L.HSLHueFunction(new L.Point(0,90), new L.Point(300000000,0));

	options = {
		recordsField: null,
		locationMode: L.LocationModes.COUNTRY,
		codeField: 'CountryCode',
		displayOptions: {
			'2010': {
				displayName: 'Telephone Lines',
				color: colorFunction,
				fillColor: fillColorFunction
			}
		},
		layerOptions: {
			fillOpacity: 0.7,
			opacity: 1,
			weight: 1
		},
		tooltipOptions: {
			iconSize: new L.Point(100,65),
			iconAnchor: new L.Point(-5,65)
		},
		onEachRecord: function (layer, record) {
			var $html = $(L.HTMLUtils.buildTable(record));

			layer.bindPopup($html.wrap('<div/>').parent().html(), {
				maxWidth: 400,
				minWidth: 400
			});
		}
	};
	telephoneLinesLayer = new L.ChoroplethDataLayer(telephoneLines, options);
    
	// $('#legend').append(telephoneLinesLayer.getLegend({
		// className: 'well'
	// }));

	var categories = ['1995','2000','2005','2010'];
	var fillColorFunctionBars = new L.HSLLuminosityFunction(new L.Point(0,0.5), new L.Point(categories.length - 1,1), {outputHue: 0, outputSaturation: '100%'});
	var styleFunction = new L.StylesBuilder(categories,{
		displayOptions: {
			'2010': {
				displayName: '# STI Tested',
			}
		},
		color: 'hsl(0,100%,20%)',
		fillColor: fillColorFunctionBars,
		minValue: 0,
		maxValue: 20000000//300000000
	});

	options = {
		recordsField: null,
		locationMode: L.LocationModes.COUNTRY,
		codeField: 'CountryCode',
		chartOptions: styleFunction.getStyles(),

		layerOptions: {
			fillOpacity: 0.7,
			opacity: 1,
			weight: 1,
			width: 6
		},
		tooltipOptions: {
			iconSize: new L.Point(100,65),
			iconAnchor: new L.Point(-5,65)
		},

		onEachRecord: function (layer, record) {
			var $html = $(L.HTMLUtils.buildTable(record));

			layer.bindPopup($html.wrap('<div/>').parent().html(), {
				maxWidth: 400,
				minWidth: 400
			});
		}
	};


	telephoneLinesBarChart = new L.BarChartDataLayer(telephoneLines, options);
	
	// $('#legend').append(telephoneLinesBarChart.getLegend({
		// className: 'well',
		// title: 'Telephone Lines'
	// }));
/******************************************************** Telephone Layer **************************************************/
	var sfFillColorFunction = new L.HSLSaturationFunction(new L.Point(0,0.1), new L.Point(100,1), {outputHue: 220, outputLuminosity: '50%'});
	var radiusFunction = new L.LinearFunction(new L.Point(0,2), new L.Point(100,10));

	options = {
		recordsField: null,
		locationMode: L.LocationModes.COUNTRY,
		codeField: 'CountryCode',
		displayOptions: {
			'2010': {
				displayName: dureUtil.overlayArr[0],
				fillColor: '#e74c3c',
				radius: radiusFunction
			}
		},
		layerOptions: {
			fillOpacity: 0.7,
			opacity: 1,
			weight: 1,
			color: 'hsl(220,100%,25%)',
			numberOfSides: 40,
			dropShadow: true,
			gradient: true
		},
		tooltipOptions: {
			iconSize: new L.Point(100,65),
			iconAnchor: new L.Point(-5,65)
		},

		onEachRecord: function (layer, record) {
			var $html = $(L.HTMLUtils.buildTable(record));

			layer.bindPopup($html.wrap('<div/>').parent().html(), {
				maxWidth: 400,
				minWidth: 400
			});
		}
	};
	
	var radiusMAXBase =  dureUtil.circleMarkerRadiusMax;
	L.CircleMarker = L.CircleMarker.extend({

		initialize: function (latlng, options) {
			L.Circle.prototype.initialize.call(this, latlng, null, options);
			
			// Custom radius coding starts here !
			
			var actualRadius = this.options.radius;			
			// console.log(actualRadius);
			
			var proportionalRadius = Math.round((actualRadius * 1000 / radiusMAXBase),0);
			if(proportionalRadius > 10){
				proportionalRadius = 10;
			}
			this._radius = proportionalRadius;
		},


	});

	solidFuelLayer = new L.DataLayer(dureUtil.bubbleLayerData, options);

	// $('#legend').append(solidFuelLayer.getLegend({
		// className: 'well'
	// }));

	// var overlays = {
		// "Population Density" : incomeLayer,
		// "# STI Tested" : telephoneLinesBarChart,
		// "% HIV Tested" : solidFuelLayer
	// };
		var overlays = {};
		$.each(dureUtil.overlayArr, function (index, value) {
			overlays[value] = solidFuelLayer
		});
		
	// L.control.layers(null,overlays).addTo(province.map);
	var currentView = dureUtil.retrieveFromLocal("currentView");
	console.log(currentView);
	if(currentView.currentViewKey != null)
	{
	  selectLayer =  L.control.selectLayers(baseMaps, overlays,{position:"topleft"});
	  //console.log('ADDING SELECT LAYER');
	  // selectLayer.addTo(province.map);		// Commented by Shone == For JH
	  selectLayer.addTo(iHealthMap.map);
	}
	else
	{
		//console.log('CHECKING SELECT LAYER');
		if(selectLayer != undefined)
		{
			//console.log('REMOVING SELECT LAYER');
			selectLayer.removeLayer(incomeLayer);
			selectLayer.removeLayer(telephoneLinesBarChart);
			selectLayer.removeLayer(solidFuelLayer);			
			// selectLayer.removeFrom(province.map); 	// Commented by Shone == For JH
			selectLayer.removeFrom(iHealthMap.map);
			selectLayer = null;
		}
	}
}
