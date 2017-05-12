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