
// Full Screen Change the map zoom level

$(document).bind("fullscreenchange", function() {
 setTimeout(function(){
 $(document).fullScreen() ? iHealthMap.map.setView(new L.LatLng(iHealthMap._lat, iHealthMap._long), 2) : iHealthMap.map.setView(new L.LatLng(iHealthMap._lat, iHealthMap._long), 2);
  }, 550);        //  map tiles render properly

});

var viewhubjs = {};
viewhubjs.viewhubDataForBarChartHardcoded = [];
viewhubjs.timelineCurrentDate = '';
viewhubjs.yearHighlightLabel = null;
/* function needed for hardcoding */

// Adding one more layer in case of UIOT Indicator

function showTimeLineSeries(data) {

    var countryData = {};
	var dataTimeContainer = [];
    var timelineGeoJSON = {};
    timelineGeoJSON.type = 'FeatureCollection';
    timelineGeoJSON.features = [];

    dureUtil.timelineCountryData = {};

    var endDate = new Date();
    endDate.setDate(endDate.getDate() + 1);
    var timelineColor = '';
	timelineColor = iHealthMap.FilterDataArr[0][1];

    $.extend(countryData, L.countries);

    // Format Default Data to TIMELINE Plugin Data Format

    viewhubjs.timelineCurrentDate = new Date();
    viewhubjs.timelineCurrentDate = viewhubjs.timelineCurrentDate.getTime();

    $.each(data, function (year, countries) {

        $.each(countries[0], function (dataCountryCode, dataCountry) {

            if (dataCountry[0][0] != "N/A" && dataCountry[0][0] != undefined) {
                //timelineColor = dataCountry[2][0];

            	$.each(countryData, function (referenceCountryCode, country) {
					var foundCountry = false;
					if (dataCountryCode == referenceCountryCode) {
						// console.log("country found ");
						if (iHealthMap.checkFilter() == 0) {

							foundCountry = true;
							country.features[0].properties.start = (new Date(dataCountry[0][0])).getTime();
							dataTimeContainer.push((new Date(dataCountry[0][0])).getTime());
							if (viewhubjs.timelineCurrentDate <= country.features[0].properties.start) {

								viewhubjs.timelineCurrentDate = country.features[0].properties.start;
							}

							country.features[0].properties.end = endDate.getTime();
							dataTimeContainer.push(endDate.getTime());
							country.features[0].properties.dataObject = dataCountry;
							country.features[0].properties.color = iHealthMap.FilterDataArr[0][1];
							timelineGeoJSON.features.push(country.features[0]);
							dureUtil.timelineCountryData[country.features[0].properties.iso_a3] = dataCountry;
                            dureUtil.temptimelineCountryData = $.extend(true, {}, dureUtil.timelineCountryData);
						}

						/* apply filter  on UIOT Indicator
						we get filterdata in iHealthMap.stylingdata object
						Check if filter is applied
						 */
						if (iHealthMap.checkFilter() == 1) {
							var filteredCountriesList = Object.keys(iHealthMap.stylingdata[iHealthMap.getCurrentyear()][0]);
							if ($.inArray(dataCountryCode, filteredCountriesList) > -1) {

								foundCountry = true;

								country.features[0].properties.start = (new Date(dataCountry[0][0])).getTime();
								if (viewhubjs.timelineCurrentDate <= country.features[0].properties.start) {

									viewhubjs.timelineCurrentDate = country.features[0].properties.start;
								}

								country.features[0].properties.end = endDate.getTime();
								country.features[0].properties.dataObject = dataCountry;
								country.features[0].properties.color = iHealthMap.FilterDataArr[0][1];
								timelineGeoJSON.features.push(country.features[0]);
								dureUtil.timelineCountryData[country.features[0].properties.iso_a3] = dataCountry;
							}
						}
					}

					if (foundCountry) {
						return;
					}
				});
            }
        });
    });

    //iHealthMap.onEachFeature = function(feature, layer) {
    function onEachFeature(feature, layer) {

        // alert("onEachFeature");
        var popup_content = buildPopup();
        if (popup_content != undefined) {
            layer.bindLabel(popup_content);
        }

        /* changes made by swpanil to check the source of the call*/
        if (dureUtil.onEachCall == 'addStyle') {

            layer.on({
                mouseover: highlightFeature,
                mouseout: resetHighlight
            });
        }

        $(layer).click(function () {
            // Change region info after 300 milliseconds
            setTimeout(function () {
                changeRegionInfo();
				iHealthMap.setCountryName(layer.feature.properties.name);
			}, 300);

        }).dblclick(function () {
            //console.log("-------------- Drill downs to country level on dbl click -------");
            //dureUtil.getDataOnDrillDown();
            // Deactivates REGION-LEVEL functionality of slider.
            iHealthMap.deActivateSliderControls();
        });

        function changeRegionInfo() {
            iHealthMap.OpenInfoContainer();
            var countryCode = layer.feature.properties.iso_a3;
            showCountryInfo();
            if (dureUtil.onEachCall == 'addStyle') {
                iHealthMap.changeChartInfoForCountry(countryCode);
            }
        }

        function showCountryInfo() {
            var popInfo = {};
            popInfo.data = iHealthMap.dataProvider;
            popInfo.regData = '';
            popInfo.regExtData = '';
            popInfo.keyContent = '';
            popInfo.extContent = '';
            popInfo.content = '';
            popInfo.level = iHealthMap.checkDataLevel();
            popInfo.countryName = layer.feature.properties.name;

            if (popInfo.data != undefined) {
                //console.log("popInfo.data");
                //console.log(popInfo.data);
              /*  if (iHealthMap.checkDataLevel() == 0) {
                    popInfo.regData = selectTargetDataByParamFromJson('region');
                    popInfo.regExtData = selectTargetDataByParamFromJson('regionExt');
                } else if (iHealthMap.checkDataLevel() == 1) {
                    popInfo.regData = selectIndicatorDataByParamFromJson('region');
                    popInfo.regExtData = selectIndicatorDataByParamFromJson('regionExt');
					
					popInfo.regExtData = selectIndicatorExtDataForTimeline(dureUtil.timelineCountryData);
                    popInfo.keyContent = buildPopupContent(popInfo.regExtData, popInfo.level);
                    popInfo.extContent = buildPopupContent(popInfo.regExtData, popInfo.level);
                }
                if (popInfo.regData != '') {
                    popInfo.keyContent = buildPopupContent(popInfo.regData, popInfo.level);
                }
                if (popInfo.regExtData != '') {
                    popInfo.extContent = buildPopupContent(popInfo.regExtData, popInfo.level);
                }
				*/
                if (dureUtil.onEachCall == 'timeline') {
                    popInfo.regExtData = selectIndicatorExtDataForTimeline(dureUtil.timelineCountryData);
                    popInfo.keyContent = buildPopupContent(popInfo.regExtData, popInfo.level);
                   // popInfo.extContent = buildPopupContent(popInfo.regExtData, popInfo.level);
				   
				   
				       if(popInfo.regExtData[1].indexOf("Evaluation of vaccine impact") > -1) {
                             popInfo.extContent += "<div> " + popInfo.regExtData[1][popInfo.regExtData[1].indexOf("Evaluation of vaccine impact")] + " : <span>" + popInfo.regExtData[0][popInfo.regExtData[1].indexOf("Evaluation of vaccine impact")] + "</span> </div>";    
                        }
                    if(popInfo.regExtData[1].indexOf("Number of Impact Studies") > -1) {
                     //          popInfo.extContent += "<div> " + popInfo.regExtData[1][popInfo.regExtData[1].indexOf("Number of Impact Studies")] + " : <span>" + popInfo.regExtData[0][popInfo.regExtData[1].indexOf("Number of Impact Studies")] + "</span> </div>";    
                        }
                }

                if (popInfo.keyContent != '' || popInfo.extContent != '') {
                    popInfo.content += buildTabsHtml(popInfo.keyContent, popInfo.extContent);
                } else {
                    popInfo.content += "<div>No data available for this region.</div>"
                }
            }
			
            $('.embPopupBody').html(popInfo.content);
            $('.regionInfo').html(popInfo.countryName + ' Info');
			
			 if (dureUtil.getIndicatorMetaInfoByParam('dataFormat') == 'Standard'){                
                 $('.loadChart').show();                
            }else{
                 $('.loadChart').hide();
            }
        }

        function highlightFeature(e) {
            layer.setStyle({
                weight: 1,
                fillOpacity: 0.9
            });
            if (!L.Browser.ie && !L.Browser.opera) {
                // layer.bringToFront();
            }
        }

        function resetHighlight(e) {
            layer.setStyle({
                weight: 1.4,
                fillOpacity: 0.7
            });

        }

		/*########## in following function <span class="flag ar"></span> added by swapnil for shwoing country flag on hover ##########*/
		function buildHoverPopupHtml(header, data) {

			var html = '<div class="box box-primary box-solid box-transparent">' +
				'<div class="box-header" data-toggle="tooltip" title="" data-original-title="Header tooltip">' +
				'<h5 class="box-title">' + header + '</h5>' +
				'</div>' +
				'<div class="box-body">' + data +
				'</div>' +
				'</div>';

			return html;
		}

		function buildPopup() {
			// alert("buils popup called");
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
				//console.log(arrayOfValues);
				popup.content += "<div class='popupBody'><div class='extensionData'><h1>Supporting Data</h1></div><div> " + arrayOfValues[1][0] + " : <span class='pull-right'>" + arrayOfValues[0][0] + "</span> </div>";
				popup.totContd = '<div class="popupBody"> ' + popup.content + ' </div>';
			} else {				
				popup.totContd = '<div class="popupBody" style="padding:5px;"> Data for this region is unavailable. </div>';
			}
			return popup.totContd;
		}

        // Selects proper data required from the data set in Json object.
        function selectTargetDataByParamFromJson(dataType) {
            var selectParam = {};
            selectParam.reg == '';
            selectParam.data = iHealthMap.dataProvider;
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
            selectParam.data = iHealthMap.dataProvider;
            if (dataType == 'region') {
                selectParam.reg = selectIndicatorKeyData(selectParam.data);
            } else if (dataType == 'regionExt') {
                selectParam.reg = selectIndicatorExtData(selectParam.data);
            }
            return selectParam.reg;
        }

        // Selects region data required from the data set in Json object.
        function selectIndicatorKeyData(data) {
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

        // Function created by swapnil for timeline functinlity
        function selectIndicatorExtDataForTimeline(data) {
            // //console.log("Line 468 : ============= Indicator extension data ================");
            var selRegExt = {};
            selRegExt.res = '';
            selRegExt.data = data;
            if (selRegExt.data != undefined) {
                // John hopkins world level array.
                if (selRegExt.data[layer.feature.properties.iso_a3] != undefined) {
                    selRegExt.res = selRegExt.data[layer.feature.properties.iso_a3];
                } else if (selRegExt.data[layer.feature.properties.iso_a2] != undefined) {
                    selRegExt.res = selRegExt.data[layer.feature.properties.iso_a2];
                }
            }
            return selRegExt.res;
        }

        // Builds the popup content which will present the data in ATTRIBUTE : VALUE pair.
        function buildPopupContent(popData, level) {
            var popup = {};
            popup.codes = [];
            popup.result = '';
            if (level == 0) {
                popup.result = buildTrgtData(popData);
            } else {

                if (iHealthMap.getIndicatorDataType() == 'Standard') {
                    popup.result = buildStdIndData(popData);
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
                targt.contnt += "<div> " + targt.attr[i] + " : <span class='pull-right'>" + targt.val[i] + "</span> </div>";
            }
            return targt.contnt;
        }

        function buildStdIndData(data) {
            var indStd = {};
        }

		 function buildNonStdIndData(data, codes) {
            var indNstd = {};
            indNstd.attr = data[1];
            indNstd.val = data[0];
            indNstd.contnt = '';
            if (data[0].length == 1) {
                indNstd.contnt += "<div> " + indNstd.attr + " : <span class='pull-right'>" + indNstd.val + "</span> </div>";
            } else {
                
                for (var i = 0; i < 5; i++) {
                    indNstd.contnt += "<div> " + indNstd.attr[i] + " : <span class='pull-right'>" + indNstd.val[i] + "</span> </div>";
                }
            }
            return indNstd.contnt;
        }
		
        /*function buildNonStdIndData(data, codes) {
            var indNstd = {};
            indNstd.attr = data[1][0];
            indNstd.val = data[0][0];
            indNstd.contnt = '';
            if (codes.length == 0) {
                indNstd.contnt += "<div> " + indNstd.attr + " : <span class='pull-right'>" + indNstd.val + "</span> </div>";
            } else {
                for (var i = 0; i < codes.length; i++) {
                    indNstd.contnt += "<div> " + indNstd.attr[i] + " : <span class='pull-right'>" + indNstd.val[i] + "</span> </div>";
                }
            }
            return indNstd.contnt;
        }*/

		function buildTabsHtml(core,ext){
			
			if(core == ''){
				core = "No key data available.";
			}			
			if(ext == ''){
				ext = "No extension data available.";
			}
			var html = '<div class="nav-tabs-custom">'+
						'<ul class="nav nav-tabs">'+
							'<li class="active"><a href="#tab_1-1" data-toggle="tab">Intro</a></li>'+
							'<li class=""><a href="#tab_2-2" data-toggle="tab">Impact</a></li>'+
						'</ul>'+
						'<div class="tab-content" style="min-width:50%">'+
							'<div class="tab-pane active" id="tab_1-1">'+core+
							'</div><!-- /.tab-pane -->'+
							'<div class="tab-pane " id="tab_2-2">'+ext+
							'</div><!-- /.tab-pane -->'+
						'</div><!-- /.tab-content -->'+
					'</div>'+ '<div><a href="javascript:void(0)" class="loadChart" data-target="#chart-modal" data-toggle="modal"><i class="fa fa-bar-chart fa-2x"></i></a><span class="iconsholder"></span><div>';
			return html;
		}		
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
	
	// show those blank countries 
		/*.....................*/
	var sortedDataTime = dataTimeContainer.sort ( function (date1, date2){
		 return date1 - date2
	});
	
	var allCountries = {};
	var timeLineCountries = {};
	$.extend(allCountries, L.countries); 
	$.extend(timeLineCountries, timelineGeoJSON); 
	var timeLineCountriesId = timeLineCountries.features.map(function(d, i) {  return d.id});
	for(var country in allCountries) {
		if($.inArray(country, timeLineCountriesId) < 0) {
			allCountries[country].features[0].properties.start = sortedDataTime[0];
			allCountries[country].features[0].properties.end = sortedDataTime[sortedDataTime.length - 1];
			allCountries[country].features[0].properties.color = "#CFCFCF";
			timelineGeoJSON.features.push(allCountries[country].features[0]);
		}
	}
	/*.....................*/
	
    dureUtil.timeline = L.timeline(timelineGeoJSON, {
        onEachFeature: onEachFeature,
        style: function (styleObj) {
            return {
				weight: 1.4,
				opacity: 1,
				color: '#fff',
				fillOpacity: 0.7,
				fillColor: styleObj.properties.color
	/* 			weight: 1,
				color: '#fff',
				stroke: false,
				fillColor: timelineColor,
				fillOpacity: 0.7*/            
			}
        },
        formatDate: function (date) {
            return moment(date).format("YYYY");
        },
        waitToUpdateMap: true,
		showTicks: false
        //start: 1391020200000
    });

    dureUtil.timeline.addTo(iHealthMap.map);
    /* hardcoding for default map with slider to latest date*/
	var d = new Date();
	var n = d.getTime();
    viewhubjs.timelineCurrentDate = n;
    //viewhubjs.timelineCurrentDate = 1415644200000; //2014;

    dureUtil.timeline.timeSliderControl._timeSlider.value = viewhubjs.timelineCurrentDate;
    dureUtil.timeline.setTime(viewhubjs.timelineCurrentDate);
    var customTimeEvent = {};
    customTimeEvent.target = {};
    customTimeEvent.target.value = viewhubjs.timelineCurrentDate;
    dureUtil.timeline.timeSliderControl._sliderChanged(customTimeEvent);
	
    dureUtil.timeline.on('change', function (e) {
        dureUtil.onEachCall = 'timeline';
		 viewhubjs.createlabelBox($('.time-text').text());
    });

    iHealthMap.clearLayer();
}

viewhubjs.createlabelBox = function(val) {
    if(viewhubjs.yearHighlightLabel != null) {
        iHealthMap.map.removeControl(viewhubjs.yearHighlightLabel);     
    }
   
    viewhubjs.yearHighlightLabel = L.control({position: 'bottomleft'});
        viewhubjs.yearHighlightLabel.onAdd = function (map) {
        this._div = L.DomUtil.create('div', 'year-label'); // create a div with a class "info"
        this._div.innerHTML = val;
        return this._div;
    };
     viewhubjs.yearHighlightLabel.addTo(iHealthMap.map);
}

viewhubjs.createPieChart = function (PieData, chartInfo) {

    $('.highchartContainer').highcharts({
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false
        },
        title: {
            text: chartInfo
        },
        credits: {
            enabled: false
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: false
                },
                showInLegend: true
            }
        },
        series: [{
            type: 'pie',
            name: '' + chartInfo + ' share',
            data: PieData
/* 			data: [
			   ['Firefox',   45.0],
			   ['IE',       26.8],
			   ['Chrome',       12.8],
			   ['Safari',    8.5],
			   ['Opera',     6.2],
			   ['Others',   0.7]
			]*/		
		}]
    });
}

viewhubjs.createBarChart = function (categories, yeardata, lable) {
	
    $('.highchartContainer').highcharts({

        chart: {
            type: 'column'
        },
        title: {
            text: lable
        },
        xAxis: {
            categories: categoriesData,
            title: {
                text: 'Years'
            }
        },
        credits: {
            enabled: false
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Number of Countries'
            }
        },
        tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name} in  </td>' +
                '<td style="padding:0"><b> {point.y: 1f} countries</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        series: [{
            name: 'Introduced',
            data: yeardata
        }]
    });
}

//  Universal vaccine introductions over time
function customStaticChartViewhub() {
	/*if (dureUtil.respJsonData.indicatorMetaInfo[0].indicatorInfo.indicatorId == 51) {
		categoriesData =['2000','2002','2005','2006','2007','2008','2009','2010','2011','2012','2013','2014'];
		yeardata = [1, 2, 6, 15, 20, 29, 44, 54, 73, 87, 105, 114];
		viewhubjs.createBarChart(categoriesData,yeardata,dureUtil.respJsonData.indicatorMetaInfo[0].indicatorInfo.indicatorName);
		viewhubjs.viewhubDataForBarChartHardcoded = [];
	} else if(dureUtil.respJsonData.indicatorMetaInfo[0].indicatorInfo.indicatorId == 56){
		categoriesData =['2006','2007','2008','2009','2010','2011','2012','2013','2014'];
		yeardata = [8, 12, 16, 23, 28, 30, 42, 53,72];
		viewhubjs.createBarChart(categoriesData,yeardata,dureUtil.respJsonData.indicatorMetaInfo[0].indicatorInfo.indicatorName);
		viewhubjs.viewhubDataForBarChartHardcoded = [];
	} else if(dureUtil.respJsonData.indicatorMetaInfo[0].indicatorInfo.indicatorId == 61){
		categoriesData =['2000','2001','2002','2003','2004','2005','2006','2007','2008','2009','2010','2011','2012','2013','2014'];
		yeardata = [11, 19, 32,36, 39, 47, 55, 63, 85, 109, 118, 127, 134, 140, 194];
		viewhubjs.createBarChart(categoriesData,yeardata,dureUtil.respJsonData.indicatorMetaInfo[0].indicatorInfo.indicatorName);
		viewhubjs.viewhubDataForBarChartHardcoded = [];
	}*/
    
	var indicatorId = dureUtil.respJsonData.indicatorMetaInfo[0].indicatorInfo.indicatorId;
    
 if($.inArray(indicatorId,introducedIndicatorArray) > -1) {
  var chartData = prepareDataUniVaccIntro();
  categoriesData = chartData.categContainer;
  yeardata = chartData.dataContainer
  viewhubjs.createBarChart(categoriesData,yeardata,dureUtil.respJsonData.indicatorMetaInfo[0].indicatorInfo.indicatorName);
 }
}

function prepareDataUniVaccIntro() {
 if( typeof dureUtil.currentFormattedJSONData != "undefined" ) {
  if( typeof dureUtil.currentFormattedJSONData.extractedObjects.worldIndicatorDataExt[0] != "undefined" ) {
    var dataObj = {};
    dataObj.data = dureUtil.currentFormattedJSONData.extractedObjects.worldIndicatorDataExt[0];
    dataObj.countryCount = 0;
    dataObj.keyContainer = Object.keys( dataObj.data );
    dataObj.keyContainer.sort(function(a, b){return Number(a-b)});
    dataObj.dataContainer = [];
    dataObj.categContainer = [];
     dataObj.validation = [];	
    
    for(var i = 0; i < dataObj.keyContainer.length; i++) {
  
		 var innerKeys = Object.keys(dataObj.data[dataObj.keyContainer[i]][0]);
		 for(var k = 0; k < innerKeys.length; k++) {
			dataObj.validation.push(innerKeys[k]);
		 }
		 dataObj.countryCount = $.unique(dataObj.validation).length;
		 dataObj.categContainer.push(Number(dataObj.keyContainer[i]));
		 dataObj.dataContainer.push(dataObj.countryCount);
    }
	
    /*for(var i = 0; i < dataObj.keyContainer.length; i++) {
     dataObj.countryCount += Object.keys(dataObj.data[dataObj.keyContainer[i]][0]).length;
     dataObj.categContainer.push(Number(dataObj.keyContainer[i]));
     dataObj.dataContainer.push(dataObj.countryCount);
    } */
   return dataObj;
  }
  
 }
}

viewhubjs.createBarChart = function (categories, yeardata, lable) {

    $('.highchartContainer').highcharts({
        chart: {
            type: 'column'
        },
        title: {
            text: lable
        },
        xAxis: {
            categories: categoriesData,
            title: {
                text: 'Years'
            }
        },
        credits: {
            enabled: false
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Number of Countries'
            }
        },
        tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name} in  </td>' +
                '<td style="padding:0"><b> {point.y: 1f} countries</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        series: [{
            name: 'Introduced',
            data: yeardata

        }]
    });
}


/* jQuery( document ).ready(function( $ ) {

    $('#dataSourceModal1').on('shown.bs.modal', function () {
        setTimeout(function() {
            viewhubjs.serviceCallDataDictionary();
        },  1500);
    });
  
}); */

// create data dictionary

viewhubjs.serviceCallDataDictionary = function() {
    if(!localStorage.getItem("dictionaryData")) {
        var serviceObj = {
                type: 'GET',
                url: 'http://view-hub.org/service/datasource/indicator/world/data/?appid=1&callback=callback_GetDictionaryData',
                dataType: 'jsonp',
                contentType: 'application/json',
                crossDomain : true
            }

        $.ajax(serviceObj);
    } else {
        callback_GetDictionaryData();
    }
}

function callback_GetDictionaryData(respData) {
    var data;;
    if(!localStorage.getItem("dictionaryData"))  {
        localStorage.setItem("dictionaryData",JSON.stringify(respData)); 
        data = JSON.parse(localStorage.getItem("dictionaryData"));   
    } else {
        data = JSON.parse(localStorage.getItem("dictionaryData"));
    }
    
    var checkuser = {};
    checkuser.userInfo = JSON.parse(localStorage.getItem("userJson"));
     iHealthMap.sourcelabelDict ? iHealthMap.createSourcelabelDictionary(data, checkuser) : viewhubjs.createDataDictionaryTable(data, checkuser);

}

viewhubjs.createDataDictionaryTable = function(data, checkuser) {
//	console.log(JSON.parse(data));
	var dataDictionaryHTML = '<div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true">';
	var availableDataDictionary = [];
	if(data.indicatorMetaInfo[0].indicatorInfoCat) {

		$("#dataSourceContent1").empty(); 
		$.each(data.indicatorMetaInfo[0].indicatorInfoCat , function(key, val) {
			var objectKeys = Object.keys(val);
			var catKeys = objectKeys.filter(function(num) {
				if(!isNaN(num)) return num;
			});
	
			 for(var i = 0; i < catKeys.length; i++) {

					dataDictionaryHTML += '<div class="panel panel-default" id="pdf-data-dictionary-'+catKeys[i]+'">';
					dataDictionaryHTML += '<div class="panel-heading" style="background-color: #b6f5ff;" role="tab" id="heading'+ catKeys[i] + '">';
					dataDictionaryHTML += '<h4 class="panel-title">';
					dataDictionaryHTML += '<a role="button" data-toggle="collapse" data-parent="#accordion" href="#collapse'+ catKeys[i] +'" aria-expanded="true" aria-controls="collapse'+ catKeys[i]+'">';
					dataDictionaryHTML += '<span class="glyphicon glyphicon-plus"></span>&nbsp;&nbsp;';
					dataDictionaryHTML +=  val[catKeys[i]];
					dataDictionaryHTML += '</a>';
					dataDictionaryHTML += '</h4>';
					dataDictionaryHTML += '</div>';
					dataDictionaryHTML += '<div id="collapse'+ catKeys[i]+ '" class="panel-collapse collapse in" role="tabpanel" aria-labelledby="heading'+catKeys[i]+'">';
					
					dataDictionaryHTML += '<div class="panel-body">';
				
    				var innerObjectKeys = Object.keys(val[catKeys[i] + '_cat']);    // inner obj sub cat
	       			var innerCatKeys = innerObjectKeys.filter(function(num) {
    					if(!isNaN(num)) return num;
	       			});

				dataDictionaryHTML += '<div class="data-indicator" style="background-color: #b6f5ff; padding: 2px 4px 2px 4px;">';
				dataDictionaryHTML += '<i class="fa fa-info-circle"></i>&nbsp;&nbsp;<span class="def-style">Indicators : ' + val[catKeys[i]] + '</span>';
				//dataDictionaryHTML += '<br/><span style="margin-left:17px;" class="def-style">Source : </span>' + val[catKeys[i]+ "_source"];
                var srcId = catKeys[i] + "-" +  0;
                if(checkuser.userInfo) {          
                    if(checkuser.userInfo.roleid == 3)           // allow only admin to edit data source
                        dataDictionaryHTML += '<div id=' + srcId + '><span><span class="def-style">Source : </span>&nbsp;<a class="def-edit"   data-id=' + srcId + '><span class="glyphicon glyphicon-edit"></span></a></span>&nbsp;&nbsp;&nbsp;<a class="src-submit"  data-id=' + srcId + '><span class="glyphicon glyphicon-ok"></a>';    
                }
                else {
                     dataDictionaryHTML += '<div id=' + srcId + '><span class="def-style">Source : </span>';
                }
                
                dataDictionaryHTML += '<textarea disabled  class="form-control vresize">' +  val[catKeys[i]+ "_source"] +'</textarea></div>';                       
				dataDictionaryHTML += '</div>';
				dataDictionaryHTML += '<div class="data-category" style="margin-left:25px;">';
				for(var k = 0; k < innerCatKeys.length; k++) {
					
					$.each(val[catKeys[i] + '_cat'][innerCatKeys[k] + '_subcat'] , function(innerKey, innerVal) {
						dataDictionaryHTML += '<hr>';						
						if(val[catKeys[i] + '_cat'][innerCatKeys[k]]) dataDictionaryHTML += '<i class="fa fa-info"></i>&nbsp;&nbsp;<span class="def-style">Category : </span>' + val[catKeys[i] + '_cat'][innerCatKeys[k]];
						dataDictionaryHTML += '<br/>';	
						if(innerVal['subcategoryname']) dataDictionaryHTML += '<span class="def-style">Sub-Category: </span>' + innerVal['subcategoryname'];
						dataDictionaryHTML += '<br/>';
						var defId = catKeys[i] + "-" +  innerVal['id'];
                       
						if(checkuser.userInfo) {          
                            if(checkuser.userInfo.roleid == 3)           // allow only admin to edit data source
                            dataDictionaryHTML += '<div id=' + defId + '><span><span class="def-style">Definition : </span>&nbsp;<a class="def-edit"   data-id=' + defId + '><span class="glyphicon glyphicon-edit"></span></a></span>&nbsp;&nbsp;&nbsp;<a class="def-submit"  data-id=' + defId + '><span class="glyphicon glyphicon-ok"></a>';    
                        } else {

                            dataDictionaryHTML += '<div id=' + defId + '><span class="def-style">Definition : </span>';
                        }

						dataDictionaryHTML += '<textarea disabled  class="form-control vresize">' + innerVal['definition'] + '</textarea></div>';						
			         });
				}
				dataDictionaryHTML += '</div>';
				dataDictionaryHTML += '</div>';
				dataDictionaryHTML += '</div>';
				dataDictionaryHTML += '</div>';
				
				availableDataDictionary.push(catKeys[i]);
			 }
		});
		dataDictionaryHTML += '</div>';
		
		$("#dataSourceContent1").append(dataDictionaryHTML); 
		$('.panel-collapse').first().addClass('in');
		$('.collapse').on('shown.bs.collapse', function(){
			$(this).parent().find(".glyphicon-plus").removeClass("glyphicon-plus").addClass("glyphicon-minus");
		}).on('hidden.bs.collapse', function(){
			$(this).parent().find(".glyphicon-minus").removeClass("glyphicon-minus").addClass("glyphicon-plus");
		});
		
		$('.def-edit').on('click', function(e) {
			
			$('#' + $(this).data('id')).find('textarea').removeAttr("disabled");
			
		});
		// subcategory  update
		$('.def-submit').on('click', function(e) {
			
			if($('#' + $(this).data('id')).find('textarea').is(":disabled")){
				alert('click on edit to enable defination on editable mode ');
				return false
			}
			
		 	var defObj = {};
			var splitId = $(this).data('id').split('-');
			defObj.indicatorid = splitId[0];
			defObj.subcategoryid = splitId[1];
			defObj.definition = $('#' + $(this).data('id')).find('textarea').val();
            defObj.source = "";
			var serviceObj ={
				type:'POST',
				url:"http://view-hub.org/service/dataapi/datasource/indicator/category",//"http://view-hub.org/viewhubservice/dataapi/indicator/category",
				contentType: 'application/json',
				crossDomain : true,
				dataType: "json",
				data: JSON.stringify(defObj)
				//success:successFunc
			};
			$.ajax(serviceObj);
			$('#' + $(this).data('id')).find('textarea').attr('disabled', 'disabled');
            localStorage.removeItem('dictionaryData');
		});

        // source update 
        $('.src-submit').on('click', function(e) {
            
            if($('#' + $(this).data('id')).find('textarea').is(":disabled")){
                alert('click on edit to enable defination on editable mode ');
                return false
            }
            
            var defObj = {};
            var splitId = $(this).data('id').split('-');
            defObj.indicatorid = splitId[0];
            defObj.subcategoryid = splitId[1];
            defObj.source = $('#' + $(this).data('id')).find('textarea').val();
            defObj.definition = "";
            var serviceObj ={
                type:'POST',
                url:"http://view-hub.org/service/dataapi/datasource/indicator/category",//"http://view-hub.org/viewhubservice/dataapi/indicator/category",
                contentType: 'application/json',
                 crossDomain : true,
                  dataType: "json",
                data: JSON.stringify(defObj)
                //success:successFunc
            };
            $.ajax(serviceObj);
            $('#' + $(this).data('id')).find('textarea').attr('disabled', 'disabled');
            localStorage.removeItem('dictionaryData');
        });
	}
	
	//PRINT All WEBPAGE 
	$( ".exportDataDictionary").unbind( "click" );
	$('.exportDataDictionary').on('click',function() {
		
		viewhubjs.exportNewWord();
		
	});
}
String.prototype.replaceAll = function(target, replacement) {
  return this.split(target).join(replacement);
};

viewhubjs.exportNewWord = function(availableSections) {
	
	var dictHTML = $( "#dataSourceModal1").clone();
	var pareDictHTML = dictHTML.html();
	var pareDictHTMLRep = pareDictHTML.replaceAll('</textarea>', '</p>');
	var pareDictHTMLRepFinal = pareDictHTMLRep.replaceAll('textarea ', 'p ');	
	$(pareDictHTMLRepFinal).wordExport('VH-Data-Dictionary');
};

//create pdf
viewhubjs.exportNewPDF = function(availableSections) {

	var doc = new jsPDF({
		  unit:'pt',
		  format:'a3'
		}),
		img1;	
	
	//viewhubjs.getNewCanvas($(".content-header").append($("#country-profile-graphics-section"))).then(function(canvas) {
		
		//console.log(availableSections);
		//console.log(canvas);
		
		//img1 = canvas.toDataURL("image/jpeg", 1.0);		
		//doc.addImage(img1, 'JPEG', 10, 10);
	
		//for (i = 0; i < availableSections.length; i++) {
		if (availableSections.length > 0) {
			var counter = 0;
			var interValDataURL = setInterval( function() {
				
				if(counter == availableSections.length - 1) clearInterval(interValDataURL);
					
				var img2;
				
				$('#pdf-data-dictionary-'+availableSections[counter]).css('background-color', '#fff');
				
				viewhubjs.getNewCanvas($('#pdf-data-dictionary-'+availableSections[counter])).then(function(canvas) {
				
					//console.log(canvas);
					
					if (canvas != '') {
						//canvas.fillStyle = 'white';
						img2 = canvas.toDataURL("image/jpeg", 0.9);						
						//console.log(img2);
						
						//img2 = canvasToImage(canvas, 'white');						
						doc.addImage(img2, 'JPEG', 10, 10);		
						doc.addPage('a3');						
					}
				});
				$('#pdf-data-dictionary-'+availableSections[counter]).css("background-color", ""); 
				counter++;
			}, 5000);
		
			setTimeout(function(){ 
				doc.save('VH-Data-Dictionary.pdf'); 
				//viewhubjs.printingContainer.width(viewhubjs.cache_width);
			}, 80000);
		} else {			
			//viewhubjs.printingContainer.width(viewhubjs.cache_width);
			//doc.save('WHO-Country-Profile.pdf'); 
		}

		//}
		
	//});
}

// create canvas object
viewhubjs.getNewCanvas = function(htmlToCanvas) {
	//viewhubjs.printingContainer.width((viewhubjs.a3[0]*1.33333) -80).css('max-width','none');
	
	//var ctx = htmlToCanvas.getContext('2d');
	//ctx.fillStyle = '#FFFFFF';                              // main background set color to white
	//ctx.fillRect(0, 0, htmlToCanvas.width, htmlToCanvas.height);
	
	return html2canvas(htmlToCanvas,{
		imageTimeout: 1000,
		//logging: true,
		removeContainer:true
	});
}



// HardCode  datasource and indicator 

var IndicatorSourceContainer = {
    "52": {
        "indicatorID": 52,
        "indicatorName": " Current Vaccine Intro Status",
        "sourceID": 1
    },
    "51": {
        "indicatorID": 51,
        "indicatorName": " Universal vaccine introductions over time",
        "sourceID": 1
    },
    "57": {
        "indicatorID": 57,
        "indicatorName": " Current Vaccine Intro Status",
        "sourceID": 1
    },
    "56": {
        "indicatorID": 56,
        "indicatorName": " Universal vaccine introductions over time",
        "sourceID": 1
    },
    "62": {
        "indicatorID": 62,
        "indicatorName": " Current Vaccine Intro Status",
        "sourceID": 1
    },
    "61": {
        "indicatorID": 61,
        "indicatorName": " Universal vaccine introductions over time",
        "sourceID": 1
    },
    "118": {
        "indicatorID": 118,
        "indicatorName": " Current Vaccine Intro Status",
        "sourceID": 1
    },
    "119": {
        "indicatorID": 119,
        "indicatorName": " Universal vaccine introductions over time",
        "sourceID": 1
    },
    "53": {
        "indicatorID": 53,
        "indicatorName": " Current Program Type",
        "sourceID": 3
    },
    "58": {
        "indicatorID": 58,
        "indicatorName": " Current Program Type",
        "sourceID": 3
    },
    "63": {
        "indicatorID": 63,
        "indicatorName": " Current Program Type",
        "sourceID": 3
    },
    "120": {
        "indicatorID": 120,
        "indicatorName": " Current Program Type",
        "sourceID": 3
    },
    "54": {
        "indicatorID": 54,
        "indicatorName": " Vaccine Product",
        "sourceID": 4
    },
    "59": {
        "indicatorID": 59,
        "indicatorName": " Vaccine Product",
        "sourceID": 4
    },
    "64": {
        "indicatorID": 64,
        "indicatorName": " Vaccine Product",
        "sourceID": 4
    },
    "121": {
        "indicatorID": 121,
        "indicatorName": " Vaccine Product",
        "sourceID": 4
    },
    "55": {
        "indicatorID": 55,
        "indicatorName": " Current Dosing Schedule",
        "sourceID": 5
    },
    "60": {
        "indicatorID": 60,
        "indicatorName": " Current Dosing Schedule",
        "sourceID": 5
    },
    "65": {
        "indicatorID": 65,
        "indicatorName": " Current Dosing Schedule",
        "sourceID": 5
    },
    "122": {
        "indicatorID": 122,
        "indicatorName": " Current Dosing Schedule",
        "sourceID": 5
    },
    "66": {
        "indicatorID": 66,
        "indicatorName": " # Children with Access",
        "sourceID": 6
    },
    "68": {
        "indicatorID": 68,
        "indicatorName": " # Children with Access",
        "sourceID": 6
    },
    "70": {
        "indicatorID": 70,
        "indicatorName": " # Children with Access",
        "sourceID": 6
    },
    "67": {
        "indicatorID": 67,
        "indicatorName": " # Children without Access",
        "sourceID": 7
    },
    "69": {
        "indicatorID": 69,
        "indicatorName": " # Children without Access",
        "sourceID": 7
    },
    "71": {
        "indicatorID": 71,
        "indicatorName": " # Children without Access",
        "sourceID": 7
    },
    "72": {
        "indicatorID": 72,
        "indicatorName": " WUENIC Coverage rates",
        "sourceID": 8
    },
    "76": {
        "indicatorID": 76,
        "indicatorName": " WUENIC Coverage rates",
        "sourceID": 8
    },
    "80": {
        "indicatorID": 80,
        "indicatorName": " WUENIC Coverage rates",
        "sourceID": 8
    },
    "140": {
        "indicatorID": 140,
        "indicatorName": " WUENIC Coverage rates",
        "sourceID": 8
    },
    "73": {
        "indicatorID": 73,
        "indicatorName": " Official country reported coverage",
        "sourceID": 9
    },
    "77": {
        "indicatorID": 77,
        "indicatorName": " Official country reported coverage",
        "sourceID": 9
    },
    "81": {
        "indicatorID": 81,
        "indicatorName": " Official country reported coverage",
        "sourceID": 9
    },
    "107": {
        "indicatorID": 107,
        "indicatorName": " # Children vaccinated",
        "sourceID": 10
    },
    "109": {
        "indicatorID": 109,
        "indicatorName": " # Children vaccinated",
        "sourceID": 10
    },
    "111": {
        "indicatorID": 111,
        "indicatorName": " # Children vaccinated",
        "sourceID": 10
    },
    "108": {
        "indicatorID": 108,
        "indicatorName": " # Children unvaccinated",
        "sourceID": 11
    },
    "110": {
        "indicatorID": 110,
        "indicatorName": " # Children unvaccinated",
        "sourceID": 11
    },
    "112": {
        "indicatorID": 112,
        "indicatorName": " # Children unvaccinated",
        "sourceID": 11
    },
    "161": {
        "indicatorID": 161,
        "indicatorName": " Countries with PCV impact evaluation",
        "sourceID": 12
    },
	"157": {
        "indicatorID": 157,
        "indicatorName": " Countries with RV impact evaluation",
        "sourceID": 12
    },
    "144": {
        "indicatorID": 144,
        "indicatorName": " IPV - DTP3 Coverage Rate",
        "sourceID": 14
    },
    "117": {
        "indicatorID": 117,
        "indicatorName": " IPV-OPV use",
        "sourceID": 19
    }
}


// Apply mask

function applyCountriesBoundriesMask(){
	
if(dureUtil.maskGeoLayer) iHealthMap.map.removeLayer(dureUtil.maskGeoLayer);
 
 $.getJSON('data/countries-mask.geojson', function(rData) {
  
	  dureUtil.maskGeoJson = rData;
	  dureUtil.maskGeoLayer = L.geoJson(dureUtil.maskGeoJson,{ 
	   style: function(features) {
			return {
			  fillColor: "#eee",
			  weight: 1,
			  opacity: 1,
			  color: '#eee',
			  fillOpacity: 0.7
			  };
		  }});
	   iHealthMap.map.addLayer(dureUtil.maskGeoLayer);
	 });
}