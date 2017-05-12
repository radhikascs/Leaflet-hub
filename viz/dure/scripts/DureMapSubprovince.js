var subprovince = {};
var boundary = {};
subprovince.initialize = function(provinceName){
	console.log("==== Initializing the subprovince objects ====");
	console.log(provinceName);
	province.clearLayer();
	iHealthMap.removeLegendControl();
	subprovince.geoJson = null;
	subprovince.provinceName = provinceName;
	subprovince.fileName = subprovince.provinceName+'.geojson';
	subprovince.currentYear = province.currentYear;
	subprovince.currentYearIndex = 0;
	subprovince.minYearValue = 0;
	subprovince.maxYearValue = 0;
	subprovince.rangeOfYears = [];
	subprovince.stateLayers = [];
	subprovince.currentBounds = '';
	subprovince.serviceUrl = '';
	subprovince.scaleRangeCat = { regionList: {}, apply: true};     // 7/22/2015 Seperate subprovince accor. to scale
	subprovince.setMapObject();
};

subprovince.setId = function(id){
	subprovince.id = id;
	return true;
}
subprovince.setMapObject = function(data){
	console.log("==== Setting map obj====");
	if(province.map != undefined){
		subprovince.map = province.map;
	}
	subprovince.loadLayer();
	subprovince.renderLegend();
}

subprovince.renderLegend = function(){
	console.log("========= Rendering the legend and updating legend to province level ===========");
	console.log(subprovince.jsondata);
	var legend ={};
	legend.colorScale = subprovince.jsondata.indicators[0].indicatorInfo.levels[3].scales[0].linear[0].colorScale;
	legend.highScale = subprovince.jsondata.indicators[0].indicatorInfo.levels[3].scales[0].linear[0].highScale;
	legend.lowScale = subprovince.jsondata.indicators[0].indicatorInfo.levels[3].scales[0].linear[0].lowScale;
	legend.scaleDesc = subprovince.jsondata.indicators[0].indicatorInfo.levels[3].scales[0].linear[0].scaleDesc;
	//legend.indicatorName = province.jsondata.metaInfo.indicatorName;       // TODO
	legend.indicatorName = province.jsondata.indicators[0].indicatorInfo.indicatorName;
	iHealthMap.renderLegend(legend);
}

subprovince.getDataFromProvider = function(){
	console.log("==== Fetching Data for Sub subprovince====");
};

subprovince.setDataForMap = function(data){
	console.log("======== Setting subprovince map data =======");
	
	subprovince.jsondata = data;
	return true;
};

/***************************************** Loading Subprovince Layer And Map Controls ***************************************/

subprovince.loadLayer = function(){
	console.log("======== Loading sub-subprovince layer of country =======");
	$.getJSON('data/provinces/'+province.countryName.toLowerCase()+'/'+subprovince.fileName, function(result) {
		//iHealthMap.map.dragging.disable();
		//iHealthMap.map.panTo(new L.LatLng(province._lat,province._long));
		subprovince.clearMapLayer();
		subprovince.geoJson = result;
		subprovince.addStyle();
		dureOverlays.initialize();
		loadPieChartDistrictLevel();          // TODO
		
	}).error(function(jqXHR, textStatus, errorThrown){
		if(jqXHR.status == 404){
			alert('subprovince level-data unavailable.');
		}
	});
};

subprovince.addStyle = function(){
	console.log("============ Styling subprovinces ===========");	
	subprovince.geojsonLayer = L.geoJson(subprovince.geoJson, {
        style: subprovince.styleOnEachFeature,
        onEachFeature: subprovince.onEachFeature
    });
	subprovince.stateLayers.push(subprovince.geojsonLayer);
	
	subprovince.currentBounds = province.dbClickCrntObj.target.getBounds();
	subprovince.map.setView(subprovince.currentBounds.getCenter(), subprovince.map.getZoom() + 1); // TODO 17/2/2015
	console.log(subprovince.currentBounds.getCenter());	
	//subprovince.map.setView(subprovince.currentBounds.getCenter(),subprovince.map.getZoom());
	//subprovince.map.panTo(subprovince.currentBounds.getCenter());

    subprovince.geojsonLayer.addTo(subprovince.map);
};

subprovince.styleOnEachFeature = function(feature){
	var styleObj = getColorForsubprovince(feature.properties);	
	if(subprovince.scaleRangeCat.apply) {
		prepareScaleWiseRegionListSubprovince(styleObj, feature.properties);
	}

	return {
		weight: 1,
		opacity: 1,
		color: '#ffffff',
		fillOpacity: 0.7,
		fillColor: styleObj.scaleColor
	};

//Seperate subprovince according to their scale value
function prepareScaleWiseRegionListSubprovince(styleObj, properties) {
		
	var scaleRangeName = 'range-'+ styleObj.scaleColor.replace(new RegExp('#', 'g'), "");
	var provinceName = properties.NAME_2;
	var metaContainer = [];
	if(!subprovince.scaleRangeCat.regionList.hasOwnProperty(scaleRangeName)) {
		subprovince.scaleRangeCat.regionList[scaleRangeName] = [];
	} 
	metaContainer.push(provinceName);
	metaContainer.push(styleObj.scaleValue);
	subprovince.scaleRangeCat.regionList[scaleRangeName].push(metaContainer); 
}

//Gets the color for subprovince
function getColorForsubprovince(e) {
	var color = {};
	color.iso = e.ISOCODE;
	if(color.iso != undefined){

		if (iHealthMap.getIndicatorDataType() == "Standard") {
			
			if(subprovince.jsondata.indicators[2] != undefined)
			{
				if(subprovince.jsondata.indicators[2].districtIndicatorData[0] != undefined)
				{
					if (subprovince.jsondata.indicators[2].districtIndicatorData[0][subprovince.currentYear] != undefined)
					{
						color.checkData = subprovince.jsondata.indicators[2].districtIndicatorData[0][subprovince.currentYear][0][color.iso];
					}
				}
			}
		}
		
		if (iHealthMap.getIndicatorDataType() == "Non-Standard") {
			
			var tempIndicatorDataExtension = dureUtil.getObjectFromArray(subprovince.jsondata.indicators, 'districtIndicatorDataExt');
			if (tempIndicatorDataExtension[0][subprovince.currentYear]) {
				color.checkData = tempIndicatorDataExtension[0][subprovince.currentYear][0][color.iso];
			}
		}	
	}
	
	if(color.checkData != undefined){
		
		if (iHealthMap.getIndicatorDataType() == "Standard") {
			color.data = subprovince.jsondata.indicators[2].districtIndicatorData[0][subprovince.currentYear][0][color.iso][0][0];
		}else{
			var tempIndicatorDataExtension = dureUtil.getObjectFromArray(subprovince.jsondata.indicators, 'districtIndicatorDataExt');
			color.data = tempIndicatorDataExtension[0][subprovince.currentYear][0][color.iso][0][0];
		}
		
		color.iscolor = getColorScaleForData(color.data);
		color.scaleValue = color.data;                                                // TODO
		color.scaleColor = color.iscolor;
		return color;
	}else{
		color.iscolor = '#D3D3D3';
		color.scaleValue = undefined;				   
		color.scaleColor = '#D3D3D3';
		return color;	
	}
}

// Gets the color according the data-scale and color-scale from provided data .
function getColorScaleForData(data){
	
	var scale = {};
	
	if(iHealthMap.getIndicatorDataType() == "Standard"){
		scale.lower = subprovince.jsondata.indicators[0].indicatorInfo.levels[3].scales[0].linear[0].lowScale;
		scale.higher = subprovince.jsondata.indicators[0].indicatorInfo.levels[3].scales[0].linear[0].highScale;
		scale.color = subprovince.jsondata.indicators[0].indicatorInfo.levels[3].scales[0].linear[0].colorScale;
		
		for(var i=0;i < scale.higher.length;i++){
			if(data >= scale.lower[i] && data <= scale.higher[i]){		
				scale.regionColor = scale.color[i];
			}else if(data > scale.higher[scale.higher.length-1]){
				scale.regionColor = scale.color[i];
			}else if(data < scale.lower[0]){
				scale.regionColor = scale.color[i];
			}
		}
		
		if (data == -1) {
			scale.regionColor = '#b2b2b2';
		}
		
	}else{
		for (var i = 0; i < iHealthMap.FilterDataArr.length; i++) {
			
			if (dureUtil.trim(iHealthMap.FilterDataArr[i][0].toLowerCase()) == dureUtil.trim(data.toLowerCase())) {
				scale.regionColor = iHealthMap.FilterDataArr[i][1];				
			}
		}
	}
	
	return scale.regionColor;
}
}

subprovince.onEachFeature = function(feature,layer){
	
	if (iHealthMap.getIndicatorDataType() == "Standard") {		
		var mapdata = subprovince.jsondata.indicators[2].districtIndicatorData[0];
	} else {
		var mapdata = dureUtil.getObjectFromArray(subprovince.jsondata.indicators, 'districtIndicatorDataExt');
	}
	
	var popup_content = buildPopup(mapdata);
	if(popup_content != undefined)
	{
		layer.bindLabel(popup_content);
	}
	 
	layer.on({
		mouseover: highlightFeature,
		mouseout: resetHighlight
	});
	
	$(layer).click(function(){
		// Sets the province id for the clicked layer.
		subprovince.setId(layer.feature.properties.ID);
		setTimeout(function() {
				console.log("################# After setting province level ####################");
				changesubprovinceInfo();
			// Sets the province id for the clicked layer.
			subprovince.setId(layer.feature.properties.ID);
			// Sets the province name for the clicked layer. 
			subprovince.setName(layer.feature.properties.NAME_2);
		}, 300);
	}).dblclick(function(){
			
		if(subprovince.setId(layer.feature.properties.ID)){
			console.log("-------------- Drill downs to local-region level on dbl click -------");
			dureUtil.getDataOnDrillDown(subprovince.id);
			loadInitialDistrictSummaryData(mapdata);
		}

	});
	
	function loadInitialDistrictSummaryData(mapdata){

		var subprovinceInfo = {};
		var summary = {};
		var summaryData;
		subprovinceInfo.code = layer.feature.properties.ISOCODE;
		
		if(mapdata[subprovince.currentYear] != undefined){
			summaryData = mapdata[subprovince.currentYear][0][subprovinceInfo.code];
			//console.log(subprovinceInfo.summaryData);

			summary.attrArray = summaryData[1] ;
			summary.valArray = summaryData[0];
			summary.result = dureUtil.formatDataForRegionSummary(summary);
			dureUtil.setRegionSummaryDataInView(summary.result);
		}
		
	}
	
	function changesubprovinceInfo(){
		var isocode;
		isocode = layer.feature.properties.ISOCODE;
		showsubprovinceInfo();
		subprovince.changeChartInfo(isocode);
	}
	
	function showsubprovinceInfo(){
		var subprovinceInfo = {};
		subprovinceInfo.country = layer.feature.properties.NAME_0;
		subprovinceInfo.province = layer.feature.properties.NAME_1;
		subprovinceInfo.name = layer.feature.properties.NAME_2;
		subprovinceInfo.code = layer.feature.properties.ISOCODE;
		if(subprovince.jsondata.indicators[2] != undefined){
			
			if (iHealthMap.getIndicatorDataType() == "Standard") {
				if(subprovince.jsondata.indicators[2].districtIndicatorData[0] != undefined){
					subprovinceInfo.data = subprovince.jsondata.indicators[2].districtIndicatorData[0];
				}else{
					console.log("Data is unavailable for this region.");
				}
			} else {
				var tempIndicatorDataExtension = dureUtil.getObjectFromArray(subprovince.jsondata.indicators, 'districtIndicatorDataExt');
				if(tempIndicatorDataExtension[0] != undefined){
					subprovinceInfo.data = tempIndicatorDataExtension[0];
				}else{
					console.log("Data is unavailable for this region.");
				}
			}
		}else{
			console.log("Data is unavailable for this region.");
		}

		if(subprovinceInfo.data != undefined){
			console.log("Inside provdata if condition.")
			if(subprovinceInfo.data[subprovince.currentYear] != undefined){
				subprovinceInfo.provData = subprovinceInfo.data[subprovince.currentYear][0][subprovinceInfo.code];
				// console.log(subprovinceInfo.provData);
			}
		}		
		if(subprovinceInfo.extdata != undefined){
			subprovinceInfo.provExtData = subprovinceInfo.extdata[subprovince.currentYear][0][subprovinceInfo.code];
		}
		
		// if(subprovinceInfo.provData != '' && subprovinceInfo.provExtData != ''){
		if(subprovinceInfo.provData != ''){
			subprovinceInfo.contentCore =  buildPopupContent(subprovinceInfo.provData);
			// subprovinceInfo.contentExt  =  buildPopupContent(subprovinceInfo.provExtData);
		}else{
			subprovinceInfo.content = "<div> No data available</div>";
		}
		
		// if(subprovinceInfo.contentCore != undefined && subprovinceInfo.contentExt != undefined){
		if(subprovinceInfo.contentCore != undefined){

			subprovinceInfo.popup_content = buildTabsHtml(subprovinceInfo.contentCore,subprovinceInfo.contentExt);
		}else{
			subprovinceInfo.popup_content = subprovinceInfo.content;
		}
		
		$('.embPopupBody').html(subprovinceInfo.popup_content);
		$('.regionInfo').html(subprovinceInfo.country+' - '+subprovinceInfo.province+' - '+subprovinceInfo.name + ' Info');
	}
	
	function buildPopup(data){ 
		//console.log(data);
		// console.log(layer);
		var popup = {};
		popup.content = '<div class="box box-solid box-primary box-transparent box-rm-margin-bottom">'+'<div class="box-header collapsibleHeader"><h5 class="pull-left" style="margin-left: 10px;">' + layer.feature.properties.NAME_2 + '</h5><div class="box-tools pull-right"><button class="btn btn-primary btn-xs" data-widget="collapse"></button></div></div>' ;
		if(data[subprovince.currentYear] != undefined){
			if(data != undefined){
				popup.coredata = data[subprovince.currentYear][0][layer.feature.properties.ISOCODE];
				if(popup.coredata != undefined){
					popup.body = "<div class='coreData'></div>" + buildPopupContent(popup.coredata);			
				}else {
					popup.body = "Data for this region is unavailable.";
				}
				popup.content +=  '<div class="box-body" style="display: block;"> '+popup.body+' </div>';	
			}		
		}
		popup.content += '</div>';
		return popup.content;            
	}
	
	function buildPopupContent(popData){
	
		var currentView = dureUtil.retrieveFromLocal("currentView");			
		
		var inArray = [1, 24, 25, 16, 18]; //Indicators Id to show %
	
		var attribute = popData[1];
		var value = popData[0];
		var content = '<table class="table popupTable"><tbody>';
		
		for(var i=0;i < attribute.length;i++){
			if(value[i] != undefined){
						
				//content += "<div style='padding:2px' data-summary ='"+value[i]+"'> "+attribute[i]+" :<span class='pull-right bg-light-blue-gradient badge'> "+value[i]+"</span></div>";
				
				/* content += "<div style='padding:2px' data-summary='"+value[i]+"'> <span>"+attribute[i]+" :</span>";
					
				if($.inArray(currentView.indicatorID, inArray) > -1){ 
											
					if(i == 0){
						content += "<span class='pull-right badge bg-badge'>"+value[i]+"%</span></div>";
					}
					else{
						content += "<span class='pull-right badge bg-badge'>"+value[i]+"</span></div>";
					}
				}
				else{

					content += "<span class='pull-right badge bg-badge'>"+value[i]+"</span></div>";					
				} */
				
				content += "<tr data-summary='"+value[i]+"'><td><span>"+attribute[i]+"</span></td>";
					
				if($.inArray(currentView.indicatorID, inArray) > -1){ 
											
					if(i == 0){
						content += "<td> : <span class='badge bg-badge'>"+value[i]+"%</span></td></tr>";
					}
					else{
						content += "<td> : <span class='badge bg-badge'>"+dureUtil.numberWithCommas(value[i])+"</span></td></tr>";
					}
				}
				else{
					if(value[i] == -1) {
						content += "<td> : <span class='badge bg-badge'>NA</span></td></tr>";
					} else {
						content += "<td> : <span class='badge bg-badge'>"+dureUtil.numberWithCommas(value[i])+"</span></td></tr>";
					}
				}			
			}
		}
		
		content += "</tbody></table>";
		
		return content;	
	}
	
	function buildTabsHtml(core,ext){
	
		if(ext == undefined){
			ext = "Data unavailable for this region.";
		}
		var html = '<div class="nav-tabs-custom">'+
						'<ul class="nav nav-tabs">'+
							'<li class="active"><a href="#tab_1-1" data-toggle="tab">Key data</a></li>'+
							'<li class=""><a href="#tab_2-2" data-toggle="tab">Supporting data</a></li>'+
						'</ul>'+
						'<div class="tab-content">'+
							'<div class="tab-pane active" id="tab_1-1">'+core+
							'</div><!-- /.tab-pane -->'+
							'<div class="tab-pane" id="tab_2-2">'+ext+
							'</div><!-- /.tab-pane -->'+
						'</div><!-- /.tab-content -->'+
					'</div>'+'<div><a href="javascript:void(0)" class="loadChart" data-target="#chart-modal" data-toggle="modal"><i class="fa fa-bar-chart fa-2x"></i></a><span class="iconsholder"></span><div>';
		return html;
	}
	
	function highlightFeature(e) {
		layer.setStyle({
			weight: 1,
			color: '#666',
			dashArray: '',
			fillOpacity: 0.7,
			fillColor: "#666"
		});
		if (!L.Browser.ie && !L.Browser.opera) {
			//layer.bringToFront();
		}
	}
	
	function resetHighlight(e) {
		subprovince.geojsonLayer.resetStyle(e.target);
	}
}

subprovince.clearMapLayer = function(){
    // console.log('Clearing subprovince layer');
	if(subprovince.geojsonLayer != undefined){
		subprovince.map.removeLayer(subprovince.geojsonLayer);
	}
};

// Set slider Range and Limits 
subprovince.setYearRangeAndLimits = function(){
	// console.log("====setting map ranges=====");
	var currentView = dureUtil.retrieveFromLocal("currentView");
	if(currentView != undefined){
		subprovince.minYearValue = dureUtil.getMinYearForIndicator(currentView.indicatorID);
		iHealthMap.maxYearValue = subprovince.maxYearValue = dureUtil.getMaxYearForIndicator(currentView.targetID);
		// subprovince.currentYear = province.currentYear;
	}
	
	if (iHealthMap.getIndicatorDataType() == "Standard") {
		subprovince.rangeOfYears = dureUtil.formatObjects(subprovince.jsondata.indicators[2].districtIndicatorData[0]);
	} else {
		var tempIndicatorSummaryDataExt = dureUtil.getObjectFromArray(subprovince.jsondata.indicators, 'districtIndicatorDataExt');		
		subprovince.rangeOfYears = dureUtil.formatObjects(tempIndicatorSummaryDataExt[0]);
	}
	
	subprovince.currentYearIndex = (subprovince.rangeOfYears.length - 1)
	$('#slideryear').html('Year '+ subprovince.currentYear);
	// console.log(subprovince.rangeOfYears);
	// console.log(subprovince.currentYearIndex);
};

// Functionality for next button
subprovince.slideNext = function(){
   $('#sliderNextProv').click(function(){ 
		console.log("----------- subprovince Next clicked ------");
		subprovince.currentYearIndex++;
		if(subprovince.currentYearIndex < subprovince.rangeOfYears.length && subprovince.currentYearIndex >= 0 ){		
			$(this).addClass('sliderNextRed');
			$('#slideryear').text('Year '+subprovince.rangeOfYears[subprovince.currentYearIndex]);
			subprovince.onYearChange(subprovince.currentYearIndex);
		}
		else{
			subprovince.currentYearIndex--;
		}   
	});
};

// Functionality for previous button
subprovince.slidePrev = function(){

   $('#sliderPrevProv').click(function() {
		// console.log("----------- subprovince Prev clicked ------");
		subprovince.currentYearIndex--;
		if(subprovince.currentYearIndex < subprovince.rangeOfYears.length && subprovince.currentYearIndex >= 0 ){
			$(this).addClass('sliderPrevRed');
			$('#slideryear').text('Year '+subprovince.rangeOfYears[subprovince.currentYearIndex]);
			subprovince.onYearChange(subprovince.currentYearIndex);
		}
		else{
			subprovince.currentYearIndex++;
		}
   });
};

// Change functionality
subprovince.onYearChange = function(index){
	subprovince.currentYear = subprovince.rangeOfYears[index];
	subprovince.changeRegionSummaryDataForYear(subprovince.currentYear);
	subprovince.loadLayer();
}

// Unbinds slider controlS attached to the elements at region level.
subprovince.deActivateSliderControls = function(){
	$("#sliderNextProv").unbind("click");
	$("#sliderPrevProv").unbind("click");	
	$("#sliderNextProv").attr('id','sliderNext');
	$("#sliderPrevProv").attr('id','sliderPrev');	
};
// Changes the chart info data on the popup chart.
subprovince.changeChartInfo = function(code){
	if(dureUtil.prepareChartObjects(subprovince.jsondata,'region',code)){
		console.log("Chart changed for province");
	}
};
// Sets province name.
subprovince.setName = function(name){
	subprovince.name = name;
	return subprovince.name;
}
// Gets province name.
subprovince.getName = function(){
	return subprovince.name;
}

// Resets map and places map to default position .
subprovince.onResettingMap = function(){	
	// console.log("================== Reset Action From Sub province =====================");
	
	dMap.setLevel('province');
	subprovince.clearMap();
	dureOverlays.clearOverlays();
	dureOverlays.removeSelectLayers();
	subprovince.setYearRangeAndLimits();
	console.log("Year on reset --- "+subprovince.currentYear);
	subprovince.changeRegionSummaryDataForYear(subprovince.currentYear);
	subprovince.loadLayer();
	iHealthMap.renderMapControls();
	subprovince.renderLegend();

	var indicator = {};
	indicator.extractedObjects = {};
	if(subprovince.jsondata.indicators[3].districtDerivedInfo) {
		indicator.extractedObjects.derivedInfo = subprovince.jsondata.indicators[3].districtDerivedInfo // TODO
		indicator.extractedObjects.derivedData = subprovince.jsondata.indicators[4].derivedData;
		if(dureOverlays.setData(indicator)){
			dureOverlays.initialize();
		}	
	}
	
	//subprovince.map.setView(new L.LatLng(province._lat,province._long), province._defaultZoom);
	province.currentBounds = iHealthMap.dbClickCrntObj.target.getBounds();
	subprovince.map.setView(new L.LatLng(province._lat,province._long), province._defaultZoom);
	//iHealthMap.map.panTo(new L.LatLng(province._lat,province._long));
	// province.deActivateSliderControls();
}

// Changes Region summary data on change of year.
subprovince.changeRegionSummaryDataForYear = function(year){
	var data;
	console.log("###====== Change Sub province Summary data ======###");
	if(year != undefined){
		if(subprovince.jsondata.indicators[2].districtIndicatorSummaryData != undefined){
			if(subprovince.jsondata.indicators[2].districtIndicatorSummaryData[0][year] != undefined){
				data = subprovince.jsondata.indicators[2].districtIndicatorSummaryData[0][year][0].data;
			}
		}
		if(data != undefined){
			console.log("Changing summary data for sub province");
			dureUtil.changeRegionSummaryData(data);
		}else{
			console.log("------------- Region Summary Data is Unavailable. ----------");
		}		
	}
};

subprovince.drilldownToDistrict = function(reg){
	dMap.setLevel('district');
	local.initialize(reg);	
};

subprovince.clearLayer = function(){
    console.log('Clearing suprovince layer');
	if(subprovince.geojsonLayer != undefined){
		if(subprovince.geojsonLayer != null){
			subprovince.map.removeLayer(subprovince.geojsonLayer);
		}
	}
	subprovince.geojsonLayer = null;
};

// Clears map data and map controls.
subprovince.clearMap = function(){
	local.removeMarkers();
	iHealthMap.removeSliderControl();
	iHealthMap.removeEmbedPopupControl();
};