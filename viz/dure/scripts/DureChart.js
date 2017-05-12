var iHealthChart = {};

iHealthChart.init = function(type) {
	//iHealthChart.chart ={};
	//iHealthChart.chartType = "column"; // Commented by shone for JH project.
    iHealthChart.chartType = type;
    iHealthChart.chartTitle = "";
    iHealthChart.chartData = "bar";
    iHealthChart.chartStyle = "";
	iHealthChart.country = "";
	iHealthChart.json = null;
	iHealthChart.provinceJson = null;
	
	if(iHealthChart.setChartData()){		
		// Loads chart below the map container thus displaying summary.
		iHealthChart.loadChart(type);
	}
};

iHealthChart.loadChart = function(type){
	if(type == 'pie'){
		iHealthChart.loadPieChart();
	}else{
		iHealthChart.loadCombinationChart();
	}
};

/*********************************************  SECTION: SET CHART DATA ***************************************************/
// Sets the chart data.
iHealthChart.setChartData = function(){
	console.log("~~~ Setting charts data ~~~");	
	iHealthChart.json = iHealthChart.getDataFromProvider();
	//console.log(iHealthChart.json);
	return true;
};

// Gets the chart data from provider.
iHealthChart.getDataFromProvider = function(){
	var key = 'regionSummaryData_'+dureUtil.appId+'_'+dureUtil.targetId+'_'+dureUtil.regionId;
	//console.log(dureUtil.retrieveFromLocal(key));
	return dureUtil.retrieveFromLocal(key);
};

iHealthChart.getLevel = function() {
 return dureUtil.getDataLevel() == "country" ? 'Province': dureUtil.getDataLevel() == "province"  ? 'District' : dureUtil.getDataLevel() == "world" ? 'countries': '';   
}

/*********************************************  SECTION: PIE CHART **********************************************************/
// Loads the Pie chart.
iHealthChart.loadPieChart = function() {
	//console.log("Inside pie chart");
    $('.highchartContainer').highcharts({
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: 1, //null,
            plotShadow: false
        },
        title: {
            text: iHealthChart.getPieChartTitle()
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    }
                }
            }
        },
		exporting: {
			enabled: false
		},
		credits: {
			enabled: false
		},        
		series: [{
			type: iHealthChart.chartType,
			name: "Percentage of countries",
			data: iHealthChart.getPieChartDataset()
		}]
    });
};

iHealthChart.getPieChartTitle = function(){
	var titleData = {};
	titleData = iHealthChart.getDataFromProvider();
	return titleData.title;
};

iHealthChart.getPieChartDataset = function(){
	var i=0, pieChart = {};
	pieChart = iHealthChart.getDataFromProvider();
	pieChart.name = [];
	pieChart.result = [];
	
	for(var k in pieChart.dataset){
		pieChart.result.push(iHealthChart.formatPieChartDatasetObj(k,pieChart.dataset[k]));
	}
	return pieChart.result;
}; 

iHealthChart.formatPieChartDatasetObj = function(key,value){
	var prepareObj = {};
	prepareObj.name = key;
	prepareObj.y = value;
	return prepareObj;
};

/*********************************************  SECTION: COMBINATION CHART **************************************************/
// Get data for combination chart .
iHealthChart.loadCombinationChart = function() {

		/* var currentView = dureUtil.retrieveFromLocal("currentView");
		var inArray = [1, 24, 25, 16, 18]; //Indicators Id to show %
		var titleText;
		
		if($.inArray(currentView.indicatorID, inArray) > -1){
			titleText = "Percentage";
		}
		else{
			titleText = "Number";
		} */

	iHealthChart.chart = new Highcharts.Chart({
   
		chart: {
			renderTo: 'chartContainer'
	    },
	    credits:{
			enabled:false
		},		
        title: {
			text: $('.targetTitleOnChart').text()
        },
        yAxis: [{ // Primary yAxis
			labels: {
				style: {
					color: Highcharts.getOptions().colors[0]
                }
            },
            title: {
                text: $('.targetTitleOnChart').text(),
                style: {
                    color: Highcharts.getOptions().colors[0]
                }
            }
        }
/* 		,{ // Secondary yAxis
            title: {
                text: 'Percentage',
                style: {
                    color: Highcharts.getOptions().colors[0]
                }
            },
            labels: {
                format: '{value} %',
                style: {
                    color: Highcharts.getOptions().colors[0]
                }
            },
            opposite: true
        } */ ],        
        xAxis: {
			categories: iHealthChart.getRangeOfYears()
        },
        series: [{
			type: 'column',
            name: iHealthChart.getSummaryData(0,'name'),
            data: iHealthChart.getSummaryData(0,'data'),
            color: "#3C8DBC",
			pointWidth: 40
        }
		/*, {
            type: 'column',
            name: iHealthChart.getSummaryData(1,'name'),
            data: iHealthChart.getSummaryData(1,'data'),
            color: Highcharts.getOptions().colors[1]
        }
		/*, {
            type: 'spline',
            yAxis: 1,
            name: 'ART Coverage',
            data: [3, 2.67, 3, 6.33, 3.33],
            marker: {
                lineWidth: 2,
                lineColor: Highcharts.getOptions().colors[1],
                fillColor: 'white'
            }
			
        }
		*/
		]
    });
		
	iHealthChart.chart.redraw();
};

// Get data for combination chart .
iHealthChart.loadCombinationChartForProvince = function() {
	
	console.log("Loading combination chart... ");

	/* var currentView = dureUtil.retrieveFromLocal("currentView");
	var inArray = [1, 24, 25, 16, 18]; //Indicators Id to show %
	var titleText;
	
	if($.inArray(currentView.indicatorID, inArray) > -1){
		titleText = "Percentage";
	}
	else{
		titleText = "Number";
	} */
	
	//$('#chart-on-modal-title').html($('.targetTitleOnChart').text()); // 18/03/2015
	$('#chart-on-modal-title').html(iHealthChart.provinceJson.data[0].generic.name);

	//console.log(iHealthChart.provinceJson);
    iHealthChart.chart = new Highcharts.Chart({
	    chart: {
	        renderTo: 'provinceChart'
	    },
	    credits:{
			enabled:false
		},		
        title: {
            text: $('.targetTitleOnChart').text()
        },
        yAxis: [{ 
			// Primary yAxis
            labels: {
                style: {
                    color: Highcharts.getOptions().colors[0]
                }
            },
            title: {
                text: $('.targetTitleOnChart').text(),
                style: {
                    color: Highcharts.getOptions().colors[0]
                }
            }
        }],        
        xAxis: {
            categories: iHealthChart.provinceJson.rangeOfYears
        },
        series: [{
            type: 'column',
            name: iHealthChart.getProvinceData(0,'name'),
            data: iHealthChart.getProvinceData(0,'data'),
            color: "#3C8DBC",
			pointWidth: 20
        }]
    });
	
	iHealthChart.chart.redraw();
};

iHealthChart.comparisonChart = function(){

    iHealthChart.chart = new Highcharts.Chart({
   
     chart: {
         renderTo: 'provinceCompChart'
     },
     credits:{
   enabled:false
  },  
        title: {
            text: $('.targetTitleOnChart').text()
        },
  scrollbar: {
            enabled: true
        },      
        yAxis: [{ 
   // Primary yAxis
            labels: {
                style: {
                    color: Highcharts.getOptions().colors[0]
                }
            },
            title: {
                text: iHealthChart.provinceJson.data[0].generic.name,//"Province",//"Country/Province",
                style: {
                    color: Highcharts.getOptions().colors[0]
                }
            }
        }],        
        xAxis: {
            categories: iHealthChart.provinceJson.comparisonData.listOfRegions,
   labels: {
                rotation: -45,
                style: {
                    fontSize: '9px',
                    fontFamily: 'Verdana, sans-serif',
                    fontWeight:'bold'
                }
            },
   max: 34
        },
        series: [{
            type: 'column',
            name: iHealthChart.provinceJson.data[0].generic.name,//"Province",//"Country/Province",
            data: iHealthChart.provinceJson.comparisonData.comparisonDataForRegion,
            color: Highcharts.getOptions().colors[0],
   pointWidth: 20
  }]
    });
};

// Loads line chart
iHealthChart.loadLineChart = function() {
    $('.highchartContainer').highcharts({
        title: {
            text: 'Monthly Average Temperature',
            x: -20 //center
        },
        subtitle: {
            text: 'Source: WorldClimate.com',
            x: -20
        },
        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },
        yAxis: {
            title: {
                text: 'Temperature (°C)'
            },
            plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
        },
        tooltip: {
            valueSuffix: '°C'
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
            borderWidth: 0
        },
        series: [{
                name: 'Tokyo',
                data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
            }, {
                name: 'New York',
                data: [-0.2, 0.8, 5.7, 11.3, 17.0, 22.0, 24.8, 24.1, 20.1, 14.1, 8.6, 2.5]
            }, {
                name: 'Berlin',
                data: [-0.9, 0.6, 3.5, 8.4, 13.5, 17.0, 18.6, 17.9, 14.3, 9.0, 3.9, 1.0]
            }, {
                name: 'London',
                data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
            }]
    });
};

// Just testing for now change it // TODO   
function loadPieChart() {
	
	/*if(iHealthMap.getIndicatorDataType() == "Standard") {
		iHealthChart.barChart();
			return false;
	}
*/	
    var data =  prepareDataPie();
    var tempData = data.series;
    data.series = tempData.filter(function(d) { if(d.name != "No data available")return d;});
	var levelName = dureUtil.getDataLevel() == "country" ? 'Province': dureUtil.getDataLevel() == "province"  ? 'District' : dureUtil.getDataLevel() == "world" ? 'Countries' : '';
    if(iHealthMap.getIndicatorDataType() == "Non-Standard") {
        data.drilldown = [];
    }

	
      $('.highchartContainer').highcharts({
        chart: {
            type: 'pie',
            marginTop: 65,
            events: {
                drilldown: function (e) {
                    var subTitle = e.seriesOptions.id;
                    var count = e.seriesOptions.data.length;
                    var chart = $('.highchartContainer').highcharts();
                    chart.setTitle(null, { text: subTitle + ' - ' + count + ' ' + levelName });
                },
                drillup: function(e) {
                    var chart = $('.highchartContainer').highcharts();
                  //  chart.setTitle(null, { text:'Data Source :'+ dureUtil.indicatorMetaInfo.indicatorInfoExt.source + '<br/>Defination: ' + dureUtil.indicatorMetaInfo.indicatorInfoExt.label});
					$('.highcharts-yaxis-title').hide();
					$('.highcharts-axis').hide();
                } ,
                load: function(event) {
                     setTimeout(function () {      
                        $(document).resize(); 
                        //$(metaInfo.chartContainer).highcharts().reflow();
                        //$(window).resize();
                     }, 100);
                }  
            }
        },
        title: {
            text: data.title,
            margin: 3
        },
        subtitle:{
           // text:'Data Source :'+ dureUtil.indicatorMetaInfo.indicatorInfoExt.source + '<br/>Defination: ' + dureUtil.indicatorMetaInfo.indicatorInfoExt.label,
            floating: true
        },
        tooltip: {
            backgroundColor: '#FCFFC5',
            formatter: function () {
                
                var tooltipHtml = '';
                if(this.series.options.type == 'pie') {
                   tooltipHtml = '<b>' + this.y + ' </b> '+ levelName;
                }
                if(this.series.options.type == 'column'){
					if (iHealthMap.getIndicatorDataType() == "Standard") { 
                        tooltipHtml = '' + this.key +
                        '<br>' + data.title + ': <b>'+ Highcharts.numberFormat(this.y, 0); + '</b>';    
                    } else {

                         tooltipHtml = '' + this.key +
                        '<br>' + data.title + ': <b>'+ this.point.series.userOptions.id + '</b>';    
                    }
                }
                return tooltipHtml;
            }   
        },
        xAxis: {
            type: 'category',
             labels: {
                rotation: -45,
                style: {
                    /*fontSize: '7px',
                    fontFamily: 'Verdana, sans-serif',
                    whiteSpace: 'normal',
                    "fontWeight":"bold"*/
                }
            }
        },

        legend: {
            enabled: false
        },

        plotOptions: {
            
            pie: {
                dataLabels: {
                    enabled: true
                 }
            }
        },
        credits: {
            enabled: false
        },        
        series: [{
            name: 'Chart',
            colorByPoint: true,
            data: data.series,
            type:'pie'
        }],
        drilldown: {
            series: data.drilldown,
            drillUpButton: {
                relativeTo: 'spacingBox',
                position: {
                    y: 0,
                    x: -30
               }
            }
        },
        exporting: {
            sourceWidth: 675,
            sourceHeight:275,
               buttons: {
                contextButton: {
                    text: 'Export'
                }
            }
        }
    });

}

function metaInfoPieChart(colorCode) {
    var returnInfo = {};
    returnInfo.name = 'No data available';
    var color = '#' + colorCode.substring(colorCode.lastIndexOf('-') + 1, colorCode.length);
	
	if (iHealthMap.getIndicatorDataType() == "Standard") {
	
		if (dureUtil.getDataLevel() == 'world') {			
			var metaInfo = dureUtil.indicatorMetaInfo.indicatorInfo.levels[0].scales[0].linear[0];	
		} else {
			var metaInfo = dureUtil.indicatorMetaInfo.levels[0].scales[0].linear[0];
		}
		
		var colorScale = metaInfo.colorScale;
	
		for(var i = 0; i < colorScale.length; i++){
			if(color == colorScale[i]) {
				returnInfo.name = metaInfo.scaleDesc[i];
				break;
			}
		}
	} else {
		
		for (var i = 0; i < iHealthMap.FilterDataArr.length; i++) {
		
			if (color == iHealthMap.FilterDataArr[i][1]) {				
				returnInfo.name = iHealthMap.FilterDataArr[i][0];
				break;
			}
		}
	}

	if((dureUtil.getIndicatorId() == 157 || dureUtil.getIndicatorId() == 161) && color == "#7a7a7a") {             // for impact indicators show country in chart where data not avail.
     
       returnInfo.name = 'No ongoing/published impact study';
    }	
	
    return returnInfo;
}

function prepareDataPie() {
    var returnChartData = {};
	returnChartData.series = [];
	returnChartData.drilldown = [];
	 
	if (dureUtil.getDataLevel() == 'world') {
		returnChartData.title = dureUtil.indicatorMetaInfo.indicatorInfo.levels[0].scales[0].linear[0].indicatorName;		
	} else {
		returnChartData.title = dureUtil.indicatorMetaInfo.levels[0].scales[0].linear[0].indicatorName;
	}
	 
    $.each(dureUtil.scaleRangeCat.regionList, function(index, val) {
        var innerData = {};
        var drillData = {};
        var meta = metaInfoPieChart(index);
        innerData.name = meta.name;
        innerData.y = val.length;
        innerData.color = '#' + index.substring(index.lastIndexOf('-') + 1, index.length);
        innerData.drilldown = meta.name;
        drillData.id = meta.name;
        drillData.type = 'column';
        drillData.data = [];
        for(var i =0; i < val.length; i++){
			var innerDrillData = [];
			innerDrillData.push(val[i][0]);
			iHealthMap.getIndicatorDataType() == "Standard" ? innerDrillData.push(val[i][1]) : innerDrillData.push(100);
			// Chart for non-standard push int value instead of string for drill down in chart
			//  innerDrillData.push(val[i][1]);
			drillData.data.push(innerDrillData);
        }
        drillData.dataLabels = {enabled:false};
        returnChartData.series.push(innerData);
		//if(iHealthMap.getIndicatorDataType() == "Standard"){
			returnChartData.drilldown.push(drillData);
		//}
    });
    //console.log(returnChartData);
    return returnChartData;
}

// Country Level Chart (category based chart)  // TODO
function loadPieChartCountryLevel() {
    var data =  prepareDataPieCountryLevel();
    var levelName = iHealthChart.getLevel();
      $('.highchartContainer').highcharts({
        chart: {
            type: 'pie',
            events: {
                drilldown: function (e) {
                    var subTitle = e.seriesOptions.id;
                    var count = e.seriesOptions.data.length;
                    var chart = $('.highchartContainer').highcharts();
                    chart.setTitle(null, { text: subTitle + ' - ' + count + ' ' + levelName});
                },
                drillup: function(e) {
                    var chart = $('.highchartContainer').highcharts();
                    chart.setTitle(null, { text: ''});
					$('.highcharts-yaxis-title').hide();
					$('.highcharts-axis').hide();
                } ,
                load: function(event) {
                     setTimeout(function () {      
                        $(document).resize(); 
                        //$(metaInfo.chartContainer).highcharts().reflow();
                        //$(window).resize();
                     }, 100);
                }  
            }
        },
        title: {
            text: data.title
        },
      
        tooltip: {
            backgroundColor: '#FCFFC5',
            formatter: function () {
                
                var tooltipHtml = '';
                if(this.series.options.type == 'pie') {
                   tooltipHtml = '<b>' + this.y + ' </b>'+ levelName;
                }
                if(this.series.options.type == 'column'){
                    if (iHealthMap.getIndicatorDataType() == "Standard") { 
                        tooltipHtml = '' + this.key +
                        '<br>' + data.title + ': <b>'+ Highcharts.numberFormat(this.y, 0); + '</b>';    
                    } else {

                         tooltipHtml = '' + this.key +
                        '<br>' + data.title + ': <b>'+ this.point.series.userOptions.id + '</b>';    
                    }
                }
                return tooltipHtml;
            }   
        },
        xAxis: {
            type: 'category',
             labels: {
                rotation: -45
               /* style: {
                    fontSize: '7px',
                    fontFamily: 'Verdana, sans-serif',
                    whiteSpace: 'normal',
                    "fontWeight":"bold"
                }*/
            }
        },

        legend: {
            enabled: false
        },

        plotOptions: {
            
            pie: {
                dataLabels: {
                    enabled: true
                 }
            }
        },
        credits: {
            enabled: false
        },        
        series: [{
            name: 'Chart',
            colorByPoint: true,
            data: data.series,
            type:'pie'
        }],
        drilldown: {
            series: data.drilldown,
            drillUpButton: {
                relativeTo: 'spacingBox',
                position: {
                    y: 0,
                    x: -30
               }
            }
        }
    });

}

function metaInfoPieChartCountryLevel(colorCode) {
    var returnInfo = {};
    returnInfo.name = 'No data available';
    var color = '#' + colorCode.substring(colorCode.lastIndexOf('-') + 1, colorCode.length);
	
	if(iHealthMap.getIndicatorDataType() == "Standard"){
	
		var metaInfo = dureUtil.indicatorMetaInfo.indicatorInfo.levels[0].scales[0].linear[0];
		var colorScale = metaInfo.colorScale;
		for(var i = 0; i < colorScale.length; i++){
			if(color == colorScale[i]) {
				returnInfo.name = metaInfo.scaleDesc[i];
				break;
			}
		}
	} else {
		
		for (var i = 0; i < iHealthMap.FilterDataArr.length; i++) {
		
			if (color == iHealthMap.FilterDataArr[i][1]) {				
				returnInfo.name = iHealthMap.FilterDataArr[i][0];
				break;
			}
		}
	}

    return returnInfo;
}

function prepareDataPieCountryLevel() {
    var returnChartData = {};
     returnChartData.series = [];
     returnChartData.drilldown = []
     returnChartData.title = dureUtil.indicatorMetaInfo.indicatorInfo.levels[0].scales[0].linear[0].indicatorName;
    $.each(province.scaleRangeCat.regionList, function(index, val) {
        var innerData = {};
        var drillData = {};
        var meta = metaInfoPieChartCountryLevel(index);
        innerData.name = meta.name;
        innerData.y = val.length;
        innerData.color = '#' + index.substring(index.lastIndexOf('-') + 1, index.length);
        innerData.drilldown = meta.name;
        drillData.id = meta.name;
        drillData.type = 'column';
        drillData.data = [];
        for(var i =0; i < val.length; i++){
			var innerDrillData = [];
			innerDrillData.push(val[i][0]);
			iHealthMap.getIndicatorDataType() == "Standard" ? innerDrillData.push(val[i][1]) : innerDrillData.push(100);
			// Chart for non-standard push int value insted of string for drill down in chart
			//innerDrillData.push(val[i][1]);
			drillData.data.push(innerDrillData);
        }
        drillData.dataLabels = {enabled:false};
        returnChartData.series.push(innerData);
        if(iHealthMap.getIndicatorDataType() == "Standard"){
			returnChartData.drilldown.push(drillData);
		}
    });
    //console.log(returnChartData);
    return returnChartData;
}

// District Level Chart (category based chart)  // TODO
function loadPieChartDistrictLevel() {
    var data =  prepareDataPieDistrictLevel();
    var levelName = iHealthChart.getLevel();
      $('.highchartContainer').highcharts({
        chart: {
            type: 'pie',
            events: {
                drilldown: function (e) {
                    var subTitle = e.seriesOptions.id;
                    var count = e.seriesOptions.data.length;
                    var chart = $('.highchartContainer').highcharts();
                    chart.setTitle(null, { text: subTitle + ' - ' + count + ' ' + levelName});
                },
                drillup: function(e) {
                    var chart = $('.highchartContainer').highcharts();
                    chart.setTitle(null, { text: ''});
					$('.highcharts-yaxis-title').hide();
					$('.highcharts-axis').hide();
                } ,
                load: function(event) {
                     setTimeout(function () {      
                        $(document).resize(); 
                        //$(metaInfo.chartContainer).highcharts().reflow();
                        //$(window).resize();
                     }, 100);
                }  
            }
        },
        title: {
            text: data.title
        },
      
        tooltip: {
            backgroundColor: '#FCFFC5',
            formatter: function () {
                
                var tooltipHtml = '';
                if(this.series.options.type == 'pie') {
                   tooltipHtml = '<b>' + this.y + ' </b>'+ levelName;
                }
                if(this.series.options.type == 'column'){
					if (iHealthMap.getIndicatorDataType() == "Standard") { 
                        tooltipHtml = '' + this.key +
                        '<br>' + data.title + ': <b>'+ Highcharts.numberFormat(this.y, 0); + '</b>';    
                    } else {
                         tooltipHtml = '' + this.key +
                        '<br>' + data.title + ': <b>'+ this.point.series.userOptions.id + '</b>';    
                    }
                }
                return tooltipHtml;
            }   
        },
        xAxis: {
            type: 'category',
             labels: {
                rotation: -45
               /* style: {
                    fontSize: '7px',
                    fontFamily: 'Verdana, sans-serif',
                    whiteSpace: 'normal',
                    "fontWeight":"bold"
                }*/
            }
        },

        legend: {
            enabled: false
        },

        plotOptions: {
            
            pie: {
                dataLabels: {
                    enabled: true
                 }
            }
        },
        credits: {
            enabled: false
        },        
        series: [{
            name: 'Chart',
            colorByPoint: true,
            data: data.series,
            type:'pie'
        }],
        drilldown: {
            series: data.drilldown,
            drillUpButton: {
                relativeTo: 'spacingBox',
                position: {
                    y: 0,
                    x: -30
               }
            }
        }
    });

}

function metaInfoPieChartDistrictLevel(colorCode) {
    var returnInfo = {};
    returnInfo.name = 'No data available';
    var color = '#' + colorCode.substring(colorCode.lastIndexOf('-') + 1, colorCode.length);
    var metaInfo = dureUtil.indicatorMetaInfo.indicatorInfo.levels[0].scales[0].linear[0];
    var colorScale = metaInfo.colorScale;
    for(var i = 0; i < colorScale.length; i++){
        if(color == colorScale[i]) {
            returnInfo.name = metaInfo.scaleDesc[i];
            break;
        }
    }

    return returnInfo;
}
function prepareDataPieDistrictLevel() {
    var returnChartData = {};
     returnChartData.series = [];
     returnChartData.drilldown = []
     returnChartData.title = dureUtil.indicatorMetaInfo.indicatorInfo.levels[0].scales[0].linear[0].indicatorName;
    $.each(subprovince.scaleRangeCat.regionList, function(index, val) {
        var innerData = {};
        var drillData = {};
        var meta = metaInfoPieChartCountryLevel(index);
        innerData.name = meta.name;
        innerData.y = val.length;
        innerData.color = '#' + index.substring(index.lastIndexOf('-') + 1, index.length);
        innerData.drilldown = meta.name;
        drillData.id = meta.name;
        drillData.type = 'column';
        drillData.data = [];
        for(var i =0; i < val.length; i++){
			var innerDrillData = [];
			innerDrillData.push(val[i][0]);
			iHealthMap.getIndicatorDataType() == "Standard" ? innerDrillData.push(val[i][1]) : innerDrillData.push(100);
			// Chart for non-standard push int value insted of string for drill down in chart
			//innerDrillData.push(val[i][1]);
			drillData.data.push(innerDrillData);

        }
        drillData.dataLabels = {enabled:false};
        returnChartData.series.push(innerData);
        if(iHealthMap.getIndicatorDataType() == "Standard"){
			returnChartData.drilldown.push(drillData);
		}
    });
     //console.log(returnChartData);
    return returnChartData;
}


// Get range of years
iHealthChart.getRangeOfYears = function(){	
//	console.log("Getting range of years for chart.");
	//console.log(iHealthChart.json.rangeOfYears);
	return iHealthChart.json.rangeOfYears;
};

// Get summary data 
iHealthChart.getSummaryData = function(index,ptyName){

	if(ptyName == 'data'){
		return iHealthChart.json.data[index].generic.data;
	}else if(ptyName == 'name'){
		return iHealthChart.json.data[index].generic.name;
	}
};

// Get PROVINCE DATA
iHealthChart.getProvinceData = function(index,ptyName){
	//console.log(iHealthChart.provinceJson);
	if(ptyName == 'data'){
		return iHealthChart.provinceJson.data[index].generic.data;
	}else if(ptyName == 'name'){
		return iHealthChart.provinceJson.data[index].generic.name;
	}
};

// Set Province data 
iHealthChart.setProvinceData = function(result){
	iHealthChart.provinceJson = result;
}

// Build series object
iHealthChart.buildSeries = function(){
	var series = {};	
};

// Updates the chart.
iHealthChart.update = function(result){
	//console.log(iHealthChart.json);
	var chartUpdates = {};
	iHealthChart.chart.xAxis[0].setCategories(result.rangeOfYears);
	for(var i=0;i < result.data.length; i++){
		iHealthChart.chart.series[i].name = result.data[i].generic.name;
		iHealthChart.chart.series[i].setData(result.data[i].generic.data,true);
	}
	
	chartUpdates.oldText =  $('.targetTitleOnChart').text();
	chartUpdates._index = chartUpdates.oldText.lastIndexOf("-");
	if(chartUpdates._index == -1){
		chartUpdates._index = chartUpdates.oldText.length
	}
	chartUpdates.formatText = chartUpdates.oldText.slice(0, parseInt(chartUpdates._index));
	chartUpdates.newText = chartUpdates.formatText.trim();
	chartUpdates.country = "<span class = 'badge bg-green'>"+iHealthChart.getCountryNameFromMap()+"</span>";
	//console.log("Country Text - " +chartUpdates.country);
	
	$('.targetTitleOnChart').html(chartUpdates.newText+' - '+chartUpdates.country);
	
}

// Returns the country name for any map-related interactions by user.
iHealthChart.getCountryNameFromMap = function(){
	return iHealthMap.getCountryName();
}

// Returns the province name for any province map-related interactions by user.
iHealthChart.getProvinceNameFromMap = function(){
	return province.getName();
}

// Returns the district name for any province map-related interactions by user. 
iHealthChart.getDistrictNameFromMap = function(){
	return subprovince.getName();
};

iHealthChart.getLocalNameFromMap = function(){
	return local.getName();
};

iHealthChart.getListOfRegions = function(){

	return iHealthChart.json.regionList;
};


/* OverLay Based Chart */

function loadOverLayBaseChart() {
	 $('.overlaybase-chartcontainer').show();
    $('#chartmyTab li:eq(1) a').tab('show') // Select second tab (Overlay chart) 
    var data = prepareDataPieOverLay();
    var levelName = iHealthChart.getLevel();
      $('.overlaybase-chartcontainer').highcharts({
        chart: {
            type: 'pie',
            events: {
                drilldown: function (e) {
                    var subTitle = e.seriesOptions.id;
                    var count = e.seriesOptions.data.length;
                    var chart = $('.overlaybase-chartcontainer').highcharts();
                    chart.setTitle(null, { text: subTitle + ' - ' + count + ' ' + levelName});
					chart.yAxis[0].setTitle({ text: subTitle });
                },
                drillup: function(e) {
                    var chart = $('.overlaybase-chartcontainer').highcharts();
                    chart.setTitle(null, { text: ''});
					$('.highcharts-yaxis-title').hide();
					$('.highcharts-axis').hide();
                }    
            }
        },
        title: {
            text: data.title
        },
      
        tooltip: {
            backgroundColor: '#FCFFC5',
            formatter: function () {
                
                var tooltipHtml = '';
                if(this.series.options.type == 'pie') {
                   tooltipHtml = '<b>' + this.y + ' </b>'+ levelName;
                }
                if(this.series.options.type == 'column'){
                    if (iHealthMap.getIndicatorDataType() == "Standard") { 
                        tooltipHtml = '' + this.key +
                        '<br>' + data.title + ': <b>'+ Highcharts.numberFormat(this.y, 0); + '</b>';    
                    } else {
                         tooltipHtml = '' + this.key +
                        '<br>' + data.title + ': <b>'+ this.point.series.userOptions.id + '</b>';    
                    }
                }
                return tooltipHtml;
            }
        },
        xAxis: {
            type: 'category',
             labels: {
                rotation: -45,
                style: {
                    fontSize: '7px',
                    fontFamily: 'Verdana, sans-serif',
                    whiteSpace: 'normal',
                    "fontWeight":"bold"
                }
            }
        },

        legend: {
            enabled: false
        },

        plotOptions: {
            
            pie: {
                dataLabels: {
                    enabled: true
                 }
            }
        },
        credits: {
            enabled: false
        },        
        series: [{
            name: 'Chart',
            colorByPoint: true,
            data: data.series,
            type:'pie'
        }],
        drilldown: {
            series: data.drilldown,
            drillUpButton: {
                relativeTo: 'spacingBox',
                position: {
                    y: 0,
                    x: -30
               }
            }
        }
    });
}


/* OverLay Based Chart for Bubble overlay*/

function loadOverLayBaseChartBubble(options) {
	$('.overlaybase-chartcontainer').show();
    $('#chartmyTab li:eq(1) a').tab('show') // Select second tab (Overlay chart)
    var data = dureOverlays.parseDataBubbleChart(options);
    var levelName = iHealthChart.getLevel();
      $('.overlaybase-chartcontainer').highcharts({
        chart: {
            type: 'pie',
            events: {
                drilldown: function (e) {
                    var subTitle = e.seriesOptions.id;
                    var count = e.seriesOptions.data.length;
                    var chart = $('.overlaybase-chartcontainer').highcharts();
                    chart.setTitle(null, { text: subTitle + ' - ' + count +  ' ' + levelName});
                },
                drillup: function(e) {
                    var chart = $('.overlaybase-chartcontainer').highcharts();
                    chart.setTitle(null, { text: ''});
					$('.highcharts-yaxis-title').hide();
					$('.highcharts-axis').hide();
                }    
            }
        },
        title: {
            text: data.title
        },
      
        tooltip: {
            backgroundColor: '#FCFFC5',
            formatter: function () {
                
                var tooltipHtml = '';
                if(this.series.options.type == 'pie') {
                   tooltipHtml = '<b>' + this.y + ' </b>'+ levelName;
                }
                if(this.series.options.type == 'column'){
                    if (iHealthMap.getIndicatorDataType() == "Standard") { 
                        tooltipHtml = '' + this.key +
                        '<br>' + data.title + ': <b>'+ Highcharts.numberFormat(this.y, 0); + '</b>';    
                    } else {
                         tooltipHtml = '' + this.key +
                        '<br>' + data.title + ': <b>'+ this.point.series.userOptions.id + '</b>';    
                    }
                }
                return tooltipHtml;
            }
        },
        xAxis: {
            type: 'category',
             labels: {
                rotation: -45,
                style: {
                  /*  fontSize: '7px',
                    fontFamily: 'Verdana, sans-serif',
                    whiteSpace: 'normal',
                    "fontWeight":"bold"*/
                }
            }
        },

        legend: {
            enabled: false
        },

        plotOptions: {
            
            pie: {
                dataLabels: {
                    enabled: true
                 }
            }
        },
        credits: {
            enabled: false
        },        
        series: [{
            name: 'Chart',
            colorByPoint: true,
            data: data.series,
            type:'pie'
        }],
        drilldown: {
            series: data.drilldown,
            drillUpButton: {
                relativeTo: 'spacingBox',
                position: {
                    y: 0,
                    x: -30
               }
            }
        }
    });
}


function resetOverLayContainer() {

  //  $('.overlaybase-chartcontainer').empty();
   $('.overlaybase-chartcontainer').hide();
   /* $('.overlaybase-chartcontainer').css(
        {   "height": "375px",
            "text-align": "center",
            "padding-top": "168px",
        });*/
    $('.overlaybase-chartcontainer').text('Overlay not available or not selected !');
   $('#chartmyTab a:first').tab('show') // Select first tab (Indicator chart)
}

// instead of pie chart Show bar chart where multiple year are available (7/1/2016)


iHealthChart.barChart = function(){
	
	var barChartData = prepareDataBarChart();
    $('#chartContainer').highcharts({
        chart: {
            type: 'column'
        },
        title: {
            text: barChartData.titleName
        },
        xAxis: {
            categories: barChartData.seriesName,
            title: {
                text: null
            },
			 min:0,
        max:barChartData.titleName.max
        },
		scrollbar: {
			enabled: true
		},
        yAxis: {
            min: 0,
            title: {
            
                align: 'high'
            },
            labels: {
                overflow: 'justify'
            }
        },
 
        plotOptions: {
            bar: {
                dataLabels: {
                    enabled: true
                }
            }
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'top',
            x: -40,
            y: 80,
            floating: true,
            borderWidth: 1,
            backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),
            shadow: true
        },
        credits: {
            enabled: false
        },
        series: [{
            name: 'Year: ' + barChartData.legendText,
            data: barChartData.seriesData
        }]
    });
};


    

function prepareDataBarChart() {
	var returnObj = {
		seriesName : [],
		seriesData : [],
		titleName: dureUtil.indicatorName,
		legendText: iHealthMap.currentYear,
		max: 30
		
	};
	var tempContainer = []
	 $.each(dureUtil.scaleRangeCat.regionList, function(index, val) { 
		for(var i = 0; i < val.length; i++) {
			tempContainer.push({name:val[i][0], value:val[i][1]})
		}
	});
	
	var sortedArray = sortArrayObject(tempContainer, 'value', true);
	for(var k = 0; k < sortedArray.length ; k++) {
			if(typeof sortedArray[k].value === "number") {
				returnObj.seriesName.push(sortedArray[k].name);
				returnObj.seriesData.push(sortedArray[k].value);
			}
			
	}
	if(returnObj.seriesName.length < 30) {
		returnObj.seriesName.max = returnObj.seriesName.length - 1;
	}
	return returnObj;
}

function sortArrayObject(arrayObj, value, checkRev) {

	var sortedData = arrayObj.sort(function (a, b) {
	  if (Number(a[value]) > Number(b[value])) {
		return 1;
	  }
	  if (Number(a[value]) < Number(b[value])) {
		return -1;
	  }
	  // a must be equal to b
	  return 0;
	});
	
	if(checkRev) {
		sortedData.reverse();
	}
	
	return sortedData;
}

