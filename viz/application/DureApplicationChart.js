var dChart = {};

dChart.renderChart = function(type){    
	//console.log("==== Loading charts ===");	
	iHealthChart.init(type);
};

$(document).on('click','.loadChart',function(){
	if(dureUtil.getDataLevel() == 'world'){
		dChart.renderChartForCountry();
	}else if(dureUtil.getDataLevel() == 'country'){
		dChart.renderChartForProvince();
	}else if(dureUtil.getDataLevel() == 'province'){
		dChart.renderChartForDistrict();
	}else if(dureUtil.getDataLevel() == 'subprovince'){
		dChart.renderChartForLocal();
	}
});

dChart.renderChartForCountry = function(){
	var country;
	iHealthChart.loadCombinationChartForProvince();
	iHealthChart.comparisonChart(); 
	country = iHealthChart.getCountryNameFromMap();
	$('.chartHeader').html('<i class="fa fa-bar-chart-o"></i> '+country);
};

dChart.renderChartForProvince = function(){
	var province;
	iHealthChart.loadCombinationChartForProvince();
	iHealthChart.comparisonChart();
	province = iHealthChart.getProvinceNameFromMap();
	$('.chartHeader').html('<i class="fa fa-bar-chart-o"></i> '+province);
};

dChart.renderChartForDistrict = function(){
	//console.log("District Level");
	var district;
	iHealthChart.loadCombinationChartForProvince();
	iHealthChart.comparisonChart();
	district = iHealthChart.getDistrictNameFromMap();
	//console.log(district);
	$('.chartHeader').html('<i class="fa fa-bar-chart-o"></i> '+district);
}

dChart.renderChartForLocal = function(){
	//console.log("Local Level");
	var local;
	iHealthChart.loadCombinationChartForProvince();
	local = iHealthChart.getLocalNameFromMap();
	//console.log(local);
	$('.chartHeader').html('<i class="fa fa-bar-chart-o"></i> '+local);
};