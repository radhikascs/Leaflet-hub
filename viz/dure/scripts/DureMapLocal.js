var local = {};
var markerdata;
local.initialize = function(name){
	subprovince.clearLayer();
	iHealthMap.removeLegendControl();
	console.log("==== Initializing the local objects ====");
	local.geoJson = null;
	local.provinceName = dureUtil.capitalizeFirstLetter(name);
	local.marker = null;
	local.fileName = subprovince.provinceName+'.geojson';
	local.currentYear = province.currentYear;
	local.currentYearIndex = 0;
	local.minYearValue = 0;
	local.maxYearValue = 0;
	local.rangeOfYears = [];
	local.latLong = [];
	local.mapBounds = [];
	local.currentBounds = '';
	local.markerCluster = [];
	local.name = '';
	local.setMapObject();
	markerdata = '';
	local.changeRegionSummaryData();
	// local.setYearRangeAndLimits();
	// local.slideNext();
	// local.slidePrev();
};

local.setMapObject = function(data){
	console.log("==== Setting local map obj====");
	if(province.map != undefined){
		local.map = province.map;
	}
	local.showMarkedLocalRegion();
}

local.setDataForMap = function(data){
	console.log("======== Setting local region data =======");
	
	local.jsondata = data;
	return true;
};

local.showMarkedLocalRegion = function(){
	var regMarker = {};
	if(local.jsondata.localAttributeData[0] != undefined){
		markerdata = local.jsondata.localAttributeData[0];
		console.log("Line 46: Local current year = ");
		console.log(local.currentYear);		
		console.log(local.jsondata);		
		if(local.currentYear == undefined){
			local.currentYear = local.getYearForExsistingData(markerdata);
		}else{  
			if(markerdata[local.currentYear] != undefined){
				if(markerdata[local.currentYear][0] != undefined){
				
					// console.log(markerdata[local.currentYear][0]);
					$.each(markerdata[local.currentYear][0],function(k,v){
					  local.marker = L.AwesomeMarkers.icon({
						icon: v[0].localIcon,
						// icon: 'medkit',
						markerColor: 'blue',
						prefix:'fa'
					  });
					  var marker = L.marker([v[0].latitude,v[0].longitude], {icon: local.marker});
					  marker.addTo(local.map).bindPopup(v[0].localAttributeName);
					  regMarker.data = v[0].data;
					  regMarker.label = v[0].label;
					  regMarker.name = v[0].localAttributeName;
					  regMarker.id = k;
					  regMarker.localAtrData = markerdata;
					  local.onMarkerClick(marker,regMarker);
					  local.markerCluster.push(marker);
					  local.latLong.push([v[0].latitude,v[0].longitude]);					
					});
					local.mapBounds = L.latLngBounds(local.latLong);
					local.map.fitBounds(local.mapBounds);
					local.map.setView(local.map.getCenter(),local.map.getZoom());
					// console.log(local.markerCluster);
				}
				else{
					console.log("Line 77: Data is unavailable for this local region.");
				}
			}
			else{
				console.log("Line 81: Data is unavailable for this local region.");
			}
		}

	}else{
		console.log("Line 84: Data is unavailable for this local region.");
	}
	
}

local.onMarkerClick = function(marker,data){
	var markerClk = {};
	markerClk.html = "";
	markerClk.heading = "";
	markerClk.name = "";
	console.log("Remove markers data");
	//console.log(data);
	for(var i=0;i<data.label.length;i++){
		markerClk.html += "<div style='padding:2px'>"+data.label[i]+":<span class='pull-right bg-light-blue-gradient badge'>"+data.data[i]+"</span> </div>";
	}
	markerClk.name = dureUtil.capitalizeFirstLetter(data.name);
	markerClk.heading = local.provinceName+' - '+markerClk.name;
	markerClk.Id = data.id;
	$(marker).click(function(){
		local.setName(markerClk.name);
		$("#tab_1-1").children('div').remove();		
		$("#tab_1-1").append(markerClk.html);
		$(".regionInfo").text(markerClk.heading);
		local.changeChartInfo(data.localAtrData,'region',markerClk.Id);
	});
};

local.removeMarkers = function(){
    console.log('Clearing local marker layer');
	if(local.markerCluster != undefined){
		if(local.markerCluster.length != 0){
			$.each(local.markerCluster,function(k,v){
				local.map.removeLayer(v);
			});
		}

		local.markerCluster = [];
	}
}

local.onResettingMap = function(){	
	console.log("================== Reset Action From Local =====================");
	local.removeMarkers();
	dMap.setLevel('province');
	iHealthMap.removeSliderControl();
	iHealthMap.removeEmbedPopupControl();
	iHealthMap.removeLegendControl();
	province.setYearRangeAndLimits();
	province.map.setView(new L.LatLng(province._lat,province._long), province._defaultZoom);
	//iHealthMap.map.panTo(new L.LatLng(province._lat,province._long));
	province.loadLayer();
	iHealthMap.renderMapControls(province.jsondata);
	// province.deActivateSliderControls();
}

local.clearMarkers = function(){
    console.log('Clearing Local Marker layer');
	if(local.markerCluster != undefined){
		local.removeMarkers();
	}
};

local.changeRegionSummaryData = function(){
	$('.regionSummary_1').find('.inner > h3').text($('#tab_1-1').children('div').eq(0).attr('data-summary'));
	$('.regionSummary_2').find('.inner > h3').text($('#tab_1-1').children('div').eq(1).attr('data-summary'));
	$('.regionSummary_3').find('.inner > h3').text($('#tab_1-1').children('div').eq(2).attr('data-summary'));
};

// Changes the chart info data on the popup chart.
local.changeChartInfo = function(localData,type,id){
	if(dureUtil.prepareChartObjects(localData,type,id)){
		console.log("Chart changed for district.");
	}
};

// Gets local name.
local.getName = function(){
	return local.name;
}

local.setName = function(name){
	local.name = name;
}

local.getYearForExsistingData = function(data){
	
	var dataForYear = {};
	dataForYear.data = data;
	console.log(dataForYear.data);
}