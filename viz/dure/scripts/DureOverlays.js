/* #### iVizard Global #### */
/* #### File containing functionality for creating overlays #### */

var dureOverlays = {};
var gaviOverlays = {};
var states = [];

dureOverlays.scaleRangeCat = {regionList: {}, apply: true};   // for OverLay base Highchart
dureOverlays.colorContainer = null;
dureOverlays.currentSelOverlayName = '';
dureOverlays.initObjBubbleChartOverlay = function () {
  dureOverlays.radiusScaleRangeCat = {regionList: {"Low": [], "Medium": [], "High": []}, range: [{name: "Low", scale: [0, 1, 2, 3]}, {name: "Medium", scale: [4, 5, 6]}, {name: "High", scale: [7, 8, 9, 10]}], apply: true, overlayName: ""};   // for OverLay Bubble type	
};

dureOverlays.initObjBubbleChartOverlay();

gaviOverlays.initialize = function () {
  //gaviOverlays.clearOverlays();
  if (gaviOverlays.selectLayer != undefined && gaviOverlays.selectLayer != null && gaviOverlays.selectLayer != "") {
    gaviOverlays.removeSelectLayers();
    gaviOverlays.clearOverlays();
  }

  gaviOverlays.selectLayer = '';
  gaviOverlays.gaviOverlay = '';
  gaviOverlays.nonGaviOverlay = '';
  gaviOverlays.prepareStripesOverLay();
};

dureOverlays.initialize = function () {

  if (dureOverlays.selectLayer != undefined && dureOverlays.selectLayer != '') {
    dureOverlays.removeSelectLayers();
    dureOverlays.clearOverlays();
  }

  dureOverlays.allOverlayLayers = [];
  dureOverlays.circleMarkerRadiusMax = 0;
  dureOverlays.customMarkerIconSizeMax = 0;
  dureOverlays.tempDatayear = 0;
  dureOverlays.overlayArr = [];
  dureOverlays.bubbleLayerData = [];
  dureOverlays.selectLayer = '';
  dureOverlays.BubbleOverlayOptions = {};
  dureOverlays.radiusFunction = new L.LinearFunction(new L.Point(0, 2), new L.Point(100, 40));
  dureOverlays.setBubbleOptions;
  dureOverlays.prepareOverlays(); // Prepare overlays on page load
  dureOverlays.data = {};
  dureOverlays.OverlayVisible = false;
  dureOverlays.bubbleColor = '';
  dureOverlays.overlayStyle = '';
  dureOverlays.yearOnLegend = '';
  dureOverlays.currentYear = iHealthMap.getCurrentyear();

  gaviOverlays.initialize(); // Uncomment to enable gavi-non gavi stripe overlays 
};
/********************************** Section: Set - Get Overlay Data **********************************/
dureOverlays.setData = function (data) {

  console.log('####### SET OVERLAY DATA #########');
  if (data) {
    if (data.extractedObjects.hasOwnProperty('derivedData') || data.extractedObjects.hasOwnProperty('derivedDataExt')) {
      dureOverlays.data = $.extend(true, {}, data);
      return true;
    }
  }
  return false;
}

dureOverlays.getData = function () {
  return dureOverlays.data;
};

/********************************** SECTION: CALL PREPARATION OF ALL OVERLAYS ON PAGE LOAD **********************************/

dureOverlays.prepareOverlays = function () {
  var dataFormat, overlayData, overlayDerivedInfo = {};

  overlayData = dureOverlays.getData();	// Get data 	

  console.log('### Prepare overlays and overlay control on page load ###');
  //console.log(overlayData);

  if (!overlayData.extractedObjects)
    return;

  if (dureUtil.getDataLevel() == 'province') {
    overlayDerivedInfo = overlayData.extractedObjects.districtDerivedInfo;
  } else {
    overlayDerivedInfo = overlayData.extractedObjects.derivedInfo;
  }

  if (overlayDerivedInfo != undefined) {

    //console.log(overlayData.extractedObjects);

    $.each(overlayDerivedInfo, function (key, object) {

      if (object.dataFormat == 'Non-Standard') {

        var nonStdData = dureOverlays.getNonStandardDataFromDerivedId(object.derivedId, overlayData.extractedObjects.derivedDataExt);

        if (nonStdData.data != undefined) {

          //console.log(nonStdData);	
          var strFlag = false;
          if (dureConfig.getUserOverlayId() != 0 && dureConfig.menuIndicatorSelectFlag == false) {
            strFlag = true;
          }
          dureOverlays.prepareOverlayForEachData(object, nonStdData, strFlag);
          if (dureConfig.getUserOverlayId() == 4) {
            var overLayData = dureOverlays.getOverlayDataForCurrentYear(iHealthMap.getCurrentyear(), 'PCV Product (current/planned)');
            dureOverlays.showOverLayLegendBox({label: 'PCV Product (current/planned)'}, overLayData.info);
          }

          // if ((object.derivedStyle == 'Marker') || (object.derivedStyle == 'Star') || (object.derivedStyle == 'Triangle') || (object.derivedStyle == 'Circle') || (object.derivedStyle == 'Diamond') || (object.derivedStyle == 'Population') || (object.derivedStyle == 'Health Facility') || (object.derivedStyle == 'House Hold') || (object.derivedStyle == 'Marker pin') ) {

          // if (nonStdData != undefined) {
          // //dureOverlays.drawCustomMarkerOverlay(object, nonStdData, false);
          // var strFlag = false;
          // if(dureConfig.getUserOverlayId() != 0 && dureConfig.menuIndicatorSelectFlag == false){
          // strFlag = true;
          // }
          // dureOverlays.drawCustomMarkerOverlay(object, nonStdData, strFlag);
          // }                    
          // } else {
          // console.log('### ERROR: Derived Style does not match Non-Standard Data.');
          // }					

        } else {
          console.log('### ERROR: Derived Style does not match Non-Standard Data.');
        }

      } else if (object.dataFormat == 'Standard') {

        var stdData = dureOverlays.getStandardDataFromDerivedId(object.derivedId, overlayData.extractedObjects.derivedData);

        if (stdData.data != undefined) {

          dureOverlays.prepareOverlayForEachData(object, stdData, false);





          // if (object.derivedStyle == 'Bubble') {

          // if (stdData != undefined) {

          // dureOverlays.setBubbleOverlayOptions();
          // dureOverlays.prepareBubbleOverlay(object, stdData, false);
          // }

          // } else if (object.derivedStyle == 'chart') {

          // if (stdData != undefined) {
          // dureOverlays.prepareBarOverlay(object, stdData)
          // }

          // } else if (object.derivedStyle == 'Radial') {

          // if (stdData != undefined) {
          // dureOverlays.drawRadialBarChart(object, stdData);
          // } 

          // } else if ((object.derivedStyle == 'Marker') || (object.derivedStyle == 'Star') || (object.derivedStyle == 'Triangle') || (object.derivedStyle == 'Circle') || (object.derivedStyle == 'Diamond') || (object.derivedStyle == 'Population') || (object.derivedStyle == 'Health Facility') || (object.derivedStyle == 'House Hold') ||  (object.derivedStyle == 'Marker pin')) {

          // if (stdData != undefined) {
          // dureOverlays.drawCustomMarkerOverlay(object, stdData, false);
          // }                    
          // } else {
          // console.log('### ERROR: Derived Style does not match Standard Data.');
          // }
        } else {
          console.log('### ERROR: Derived Data is not available.');
        }
      } else {
        console.log('### ERROR: Derived IDs does not match for derivedInfo & derivedData.');
      }
    });

    dureOverlays.callOverlayControlsOnMap(dureOverlays.overlayArr);
  } else {

    console.log('No overlay data');
    //dureApp.showDialog('Overlays not available for the indicator as data is not available.', 'info');
  }

  $('.leaflet-control-layers-overlays option').prop('selected', false).trigger('chosen:updated');
};

/****************************************************** SECTION: Clear Overlay *********************************************************/
dureOverlays.removeSelectLayers = function () {

  if (dureOverlays.selectLayer) {
    dureOverlays.selectLayer.removeFrom(iHealthMap.map);
    dureOverlays.selectLayer = null;
  }
};

dureOverlays.clearOverlays = function () {

  console.log('### CLEAR OVERLAY ###');
  if (dureOverlays.allOverlayLayers != undefined) {
    $.each(dureOverlays.allOverlayLayers, function (key, object) {
      iHealthMap.map.removeLayer(object);
    });
  }

  //$('#marker-legend').remove();
  $('#marker-legend').parent().remove();
  $('.leaflet-control-layers-overlays option').prop('selected', false).trigger('chosen:updated');
};

gaviOverlays.removeSelectLayers = function () {
  console.log('REMOVING GAVI SELECT LAYER');
  gaviOverlays.selectLayer.removeFrom(iHealthMap.map);
  gaviOverlays.selectLayer = null;
};

gaviOverlays.clearOverlays = function () {

  if (gaviOverlays.gaviOverlay != undefined) {

    iHealthMap.map.removeLayer(gaviOverlays.gaviOverlay);
  }

  if (gaviOverlays.nonGaviOverlay != undefined) {

    iHealthMap.map.removeLayer(gaviOverlays.nonGaviOverlay);
  }

};

/***************************************** SECTION: Radial Bar Overlay **********************************************/

dureOverlays.prepareDataForRadialBarChart = function (dataJSON) {
  var finalFormmattedJSON = [];
  var straightObjectList = [];

  for (objName in dataJSON) {
    //console.log(objName);
    var newObjectList = [];
    if (dataJSON.hasOwnProperty(objName)) {

      //Get object for objName
      var object = dataJSON[objName];
      var currentYear = objName;

      var innerArrayObject = object[0];

      for (innerObjectName in innerArrayObject) {

        var innerObject = innerArrayObject[innerObjectName];
        var newJSONObject = {};

        newJSONObject.Year = currentYear;
        newJSONObject.Country = innerObjectName;
        newJSONObject.Value = innerObject[0][0];
        straightObjectList.push(newJSONObject);
      }
    }
  }

  var formatterObjectList = [];

  for (countryObjectName in L.countries)
  {
    var formattedObjectContainer = {};
    var formattedObject = {};
    for (objectName in straightObjectList)
    {
      var straightObject = straightObjectList[objectName];

      if (countryObjectName == straightObject.Country)
      {
        if (formattedObjectContainer.hasOwnProperty(countryObjectName))
        {
          formattedObject = formattedObjectContainer[countryObjectName];
          var valueOfData = straightObject.Value;
          if (valueOfData == undefined)
          {
            valueOfData = "";
          }
          formattedObject[straightObject.Year] = "" + valueOfData;
          formattedObjectContainer.countryObjectName = formattedObject;
        }
        else
        {
          var retrievedObject = iHealthMap.getCountryObjectFromAlpha3(countryObjectName);

          formattedObject.Country = retrievedObject.countryName;
          formattedObject.CountryCode = retrievedObject.countryCode;
          var valueOfData = straightObject.Value;
          if (valueOfData == undefined)
          {
            valueOfData = "";
          }
          formattedObject[straightObject.Year] = "" + valueOfData;
          formattedObjectContainer.countryObjectName = formattedObject;
        }
      }
    }

    if (!$.isEmptyObject(formattedObjectContainer))
    {
      formatterObjectList.push(formattedObjectContainer);
    }
  }

  for (obj in formatterObjectList)
  {
    finalFormmattedJSON.push(formatterObjectList[obj].countryObjectName);
  }

  return finalFormmattedJSON;
};

dureOverlays.drawRadialBarChart = function (overlayinfo, dataJSON) {
  //console.log("===== Radial chart ====");
  //console.log(dataJSON);
  dureOverlays.overlayArr.push(overlayinfo.derivedName);
  var dataForRadialBarChart = dureOverlays.prepareDataForRadialBarChart(dataJSON[0]);

  var categories = ['2013']; // Years to display on layer

  //------------ Get max value from data ------------//	
  var maxvalue = 0;

  $.each(dataForRadialBarChart, function (index, object)
  {
    $.each(object, function (ind, obj)
    {
      if (ind !== "CountryCode" && ind !== "Country" && $.inArray(ind, categories) !== -1)
      {
        if (parseInt(obj) > maxvalue)
        {
          maxvalue = parseInt(obj);
        }
      }
    });
  });

  var fillColorFunctionBars = new L.HSLLuminosityFunction(new L.Point(0, 0.5), new L.Point(categories.length - 1, 1), {outputHue: 0, outputSaturation: '100%'});

  var styleFunction = new L.StylesBuilder(categories, {
    displayName: function (index) {
      return categories[index];
    },
    color: 'hsl(0,100%,20%)',
    fillColor: fillColorFunctionBars,
    minValue: 0,
    maxValue: maxvalue + 1,
    maxHeight: 5
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
      width: 6,
      offset: 0
    },
    tooltipOptions: {
      iconSize: new L.Point(250, 100),
      iconAnchor: new L.Point(-5, 100)
    },
    onEachRecord: function (layer, record) {
      var $html = $(L.HTMLUtils.buildTable(record));

      layer.bindPopup($html.wrap('<div/>').parent().html(), {
        maxWidth: 400,
        minWidth: 400
      });
    }
  };

  var radialBarChartLayer = new L.RadialBarChartDataLayer(dataForRadialBarChart, options);

  dureOverlays.allOverlayLayers.push(radialBarChartLayer);
  radialBarChartLayer.addTo(iHealthMap.map);
};

/***************************************** SECTION: Bar Chart Overlay **********************************************/

dureOverlays.prepareBarOverlay = function (object, overLayData) {
  //console.log(overLayData);
  dureOverlays.overlayArr.push(object.derivedName);
  var newFormatedObj = {};
  var newFormattedPeriodWiseObject = [];
  var dataJSON = overLayData[0];
  var currentYear = iHealthMap.getCurrentyear();

  //Prepare overlay data format.	
  var formatArr = [];
  for (var iso in dataJSON) {
    var formatobj = {};
    var label = '';
    var value = '';
    formatobj['Province'] = dureOverlays.getProvinceNamefromIso(iso);
    for (var key in dataJSON[iso][0]) {

      label = dataJSON[iso][1][key];
      value = dataJSON[iso][0][key];
      if (label != undefined && value != undefined) {
        formatobj[label] = value;
      }
    }
    formatobj.year = currentYear;
    formatobj.ISO = iso;
    formatArr.push(formatobj);
  }

  newFormatedObj[currentYear] = formatArr;
  var categories = dureOverlays.getCategoriesForBarChart(dataJSON); // Categories to display on layer	
  var maxvalue = 0;

  $.each(newFormatedObj, function (year, datArray) {
    $.each(datArray, function (index, dataObject) {

      $.each(dataObject, function (key, value) {
        if ($.inArray(key, categories) !== -1) {

          if (parseInt(value) > maxvalue)
          {
            maxvalue = parseInt(value);
          }
        }
      });

    });
  });

  var year = iHealthMap.getCurrentyear();
  newFormattedPeriodWiseObject = newFormatedObj[year]; //Hardcoded to check the working of bar chart.

  var fillColorFunctionBars = new L.HSLHueFunction(new L.Point(0, 90), new L.Point(categories.length - 1, 0));

  //var fillColorFunctionBars = new L.HSLLuminosityFunction(new L.Point(0, 0.5), new L.Point(categories.length - 1, 1), {outputHue: 0, outputSaturation: '100%'});
  //console.log(fillColorFunctionBars);
  var styleFunction = new L.StylesBuilder(categories, {
    displayName: function (index) {
      return categories[index];
    },
    color: 'hsl(0,100%,20%)',
    fillColor: fillColorFunctionBars,
    minValue: 0,
    maxValue: maxvalue + 1,
    maxHeight: 70
  });

  options = {
    recordsField: null,
    locationMode: L.LocationModes.STATE,
    codeField: 'ISO',
    chartOptions: styleFunction.getStyles(),
    layerOptions: {
      fillOpacity: 0.7,
      opacity: 1,
      weight: 1,
      width: 10,
      offset: 1
    },
    tooltipOptions: {
      iconSize: new L.Point(250, 100),
      iconAnchor: new L.Point(-5, 100)
    }/* ,
     onEachRecord: function (layer, record) {
     var $html = $(L.HTMLUtils.buildTable(record));
     
     
     var $newHtml = "<div class='box box-solid box-primary box-transparent box-rm-margin-bottom'>"+
     "<div class='box-header collapsibleHeader'>"+						
     "<div class='box-tools pull-right'>"+
     "<button class='btn btn-primary btn-xs' data-widget='collapse'><i class='fa fa-minus'></i></button>"+
     "</div>"+
     "</div>"+
     "<div class='box-body' style='display: block;'>"+$html.wrap('<div/>').parent().html()+"</div>"+
     "</div>";
     
     layer.bindPopup($newHtml, {
     maxWidth: 400,
     minWidth: 400
     });
     } */
  };
  var barChartLayer = new L.BarChartDataLayer(newFormattedPeriodWiseObject, options);

  dureOverlays.allOverlayLayers.push(barChartLayer);
  barChartLayer.addTo(iHealthMap.map);
};

//Fetch array of categories for chart.
dureOverlays.getCategoriesForBarChart = function (dataJSON) {
  var categories = [];
  var currentYear = iHealthMap.getCurrentyear();
  //console.log(dataJSON);
  for (var iso in dataJSON) {
    for (var index in dataJSON[iso][1]) {
      if (dataJSON[iso][1][index] != '') {
        categories.push(dataJSON[iso][1][index]);
      }
    }
    break;
  }
  return categories;
};

/******************************************** SECTION: Bubble Overlay ***************************************************/

/******************************************** set bubble overlay options ************************************************/

dureOverlays.setBubbleOverlayOptions = function () {

  var currentLocationMode;

  if (dureUtil.getDataLevel() == 'province') {
    currentLocationMode = L.LocationModes.DISTRICT; // Change this for district level
  } else if (dureUtil.getDataLevel() == 'country') {
    currentLocationMode = L.LocationModes.STATE; // Change this for country level
  } else {
    currentLocationMode = L.LocationModes.COUNTRY; // Change this for world level
  }

  dureOverlays.BubbleOverlayOptions = {
    recordsField: null,
    locationMode: currentLocationMode,
    codeField: 'ISO',
    displayOptions: {}, /* display options is set in dureOverlays.prepareBubbleOverlayData */
    layerOptions: {
      fillOpacity: 0.7,
      opacity: 1,
      weight: 1,
      color: 'hsl(220,100%,25%)',
      numberOfSides: 40,
      dropShadow: false,
      gradient: false
    },
    tooltipOptions: {
      iconSize: new L.Point(250, 100),
      iconAnchor: new L.Point(-5, 100)
    },
    onEachRecord: function (layer, record) {
      dureOverlays.prepareRadiusWiseList(layer, record);							// Seperate list for chart
      var $html = $(L.HTMLUtils.buildTable(record));
      layer.bindPopup($html.wrap('<div/>').parent().html(), {
        maxWidth: 400,
        minWidth: 400
      });
    }
  };

  console.log("Set Bubble overlay option");
};

//Prepare bubble overlay data District

dureOverlays.prepareBubbleOverlayDistrictData = function (info, dataJSON) {

  //var countryCentroids = dureOverlays.getCountryCentroids(); // For world level markers 
  var stateCentroids = dureOverlays.getStateCentroids(); // For country level markers

  var currentBubbleOverlay = {};
  currentBubbleOverlay.data = dataJSON.data;

  var currentYear, latestYear;

  //console.log(currentBubbleOverlay);

  currentYear = iHealthMap.getCurrentyear();
  latestYear = dureOverlays.getLatestYearFromData(currentBubbleOverlay.data);

  var finalObject = {};

  //dureOverlays.customMarkerIconSizeMax = 0;
  var currentBubbleOverlayData = [];

  $.each(currentBubbleOverlay.data, function (index, Object) {

    if (Object[currentYear] != undefined) {

      dureOverlays.yearOnLegend = currentYear;
      dureOverlays.circleMarkerRadiusMax = 0;

      $.each(Object[currentYear][0], function (districtISO, Obj) {

        if (districtISO != undefined) {

          var markerValue = Obj[0][0];
          var jsonObject = {};

          //var districtInfo = dureOverlays.getDistrictCentroid(districtISO); // For province level markers					

          if (eval(dureOverlays.circleMarkerRadiusMax) < eval(Object[currentYear][0][districtISO][0][0])) {
            dureOverlays.circleMarkerRadiusMax = eval(Object[currentYear][0][districtISO][0][0]);
          }

          var yearKey = "" + currentYear;
          var CodeKey = "ISO";
          var NameKey = "District";
          //Preparing Data for bubble overlay layer. Data should be an array of objects.
          var obj = {};
          obj[yearKey] = Number(Object[currentYear][0][districtISO][0][0]);
          obj[CodeKey] = districtISO;
          obj[NameKey] = dureOverlays.getDistrictNamefromIso(districtISO);

          currentBubbleOverlayData.push(obj);
        }
      });

    } else if (Object[latestYear] != undefined) {

      dureOverlays.yearOnLegend = latestYear;

      dureOverlays.circleMarkerRadiusMax = 0;

      $.each(Object[latestYear][0], function (districtISO, Obj) {

        if (districtISO != undefined) {

          var markerValue = Obj[0][0];
          var jsonObject = {};

          //var districtInfo = dureOverlays.getDistrictCentroid(districtISO); // For province level markers 

          if (eval(dureOverlays.circleMarkerRadiusMax) < eval(Object[latestYear][0][districtISO][0][0])) {
            dureOverlays.circleMarkerRadiusMax = eval(Object[latestYear][0][districtISO][0][0]);
          }

          var yearKey = "" + latestYear;
          var CodeKey = "ISO";
          var NameKey = "District";
          //Preparing Data for bubble overlay layer. Data should be an array of objects.
          var obj = {};
          obj[yearKey] = Number(Object[latestYear][0][districtISO][0][0]);
          obj[CodeKey] = districtISO;
          obj[NameKey] = dureOverlays.getDistrictNamefromIso(districtISO);

          currentBubbleOverlayData.push(obj);
        }
      });

    } else {
      console.log('### ERROR: Year data does not match.');
    }

  });

  /********** setting display key for dureOverlays.BubbleOverlayOptions **********/

  dureOverlays.BubbleOverlayOptions['displayOptions'][dureOverlays.yearOnLegend] = {};
  dureOverlays.BubbleOverlayOptions['displayOptions'][dureOverlays.yearOnLegend]['displayName'] = info.derivedName;
  dureOverlays.bubbleColor = dureOverlays.BubbleOverlayOptions['displayOptions'][dureOverlays.yearOnLegend]['fillColor'] = info.levels[0].scales[0].linear[0].colorScale[0];

  dureOverlays.radiusFunction = new L.LinearFunction(new L.Point(0, 2), new L.Point(4, 1));

  dureOverlays.BubbleOverlayOptions['displayOptions'][dureOverlays.yearOnLegend]['radius'] = dureOverlays.radiusFunction;

  //console.log(currentBubbleOverlayData);
  return currentBubbleOverlayData;
};

//Prepare bubble overlay data Province.
dureOverlays.prepareBubbleOverlayProvinceData = function (info, dataJSON) {

  //var countryCentroids = dureOverlays.getCountryCentroids(); // For world level markers 
  var stateCentroids = dureOverlays.getStateCentroids(); // For country level markers

  var currentBubbleOverlay = {};
  currentBubbleOverlay.data = dataJSON.data;

  var currentYear, latestYear;

  currentYear = iHealthMap.getCurrentyear();
  latestYear = dureOverlays.getLatestYearFromData(currentBubbleOverlay.data);

  var finalObject = {};

  //dureOverlays.customMarkerIconSizeMax = 0;
  var currentBubbleOverlayData = [];

  $.each(currentBubbleOverlay.data, function (index, Object) {

    //console.log(Object);

    if (Object[currentYear] != undefined) {

      dureOverlays.yearOnLegend = currentYear;
      dureOverlays.circleMarkerRadiusMax = 0;

      $.each(stateCentroids, function (ind, Obj) {

        var isocode;
        isocode = ind;
        //console.log(isocode);
        //console.log(Obj);

        if (Object[currentYear][0][isocode] != undefined) {

          if (eval(dureOverlays.circleMarkerRadiusMax) < eval(Object[currentYear][0][isocode][0][0])) {
            dureOverlays.circleMarkerRadiusMax = eval(Object[currentYear][0][isocode][0][0]);
          }

          var yearKey = "" + currentYear;
          var CodeKey = "ISO";
          var NameKey = "Province";
          //Preparing Data for bubble overlay layer. Data should be an array of objects.
          var obj = {};
          obj[yearKey] = Number(Object[currentYear][0][isocode][0][0]);
          obj[CodeKey] = isocode;
          obj[NameKey] = dureOverlays.getProvinceNamefromIso(isocode);

          currentBubbleOverlayData.push(obj);
        }
      });

    } else if (Object[latestYear] != undefined) {

      dureOverlays.yearOnLegend = latestYear;

      $.each(stateCentroids, function (ind, Obj) {

        var isocode;
        isocode = ind;

        if (Object[latestYear][0][isocode] != undefined) {

          if (eval(dureOverlays.circleMarkerRadiusMax) < eval(Object[latestYear][0][isocode][0][0])) {
            dureOverlays.circleMarkerRadiusMax = eval(Object[latestYear][0][isocode][0][0]);
          }

          var yearKey = "" + latestYear;
          var CodeKey = "ISO";
          var NameKey = "Province";
          //Preparing Data for bubble overlay layer. Data should be an array of objects.
          var obj = {};
          obj[yearKey] = Number(Object[latestYear][0][isocode][0][0]);
          obj[CodeKey] = isocode;
          obj[NameKey] = dureOverlays.getProvinceNamefromIso(isocode);

          currentBubbleOverlayData.push(obj);
        }
      });

    } else {
      console.log('### ERROR: Year data does not match.');
    }

  });

  /********** setting display key for dureOverlays.BubbleOverlayOptions **********/

  dureOverlays.BubbleOverlayOptions['displayOptions'][dureOverlays.yearOnLegend] = {};
  dureOverlays.BubbleOverlayOptions['displayOptions'][dureOverlays.yearOnLegend]['displayName'] = info.derivedName;
  dureOverlays.bubbleColor = dureOverlays.BubbleOverlayOptions['displayOptions'][dureOverlays.yearOnLegend]['fillColor'] = info.levels[0].scales[0].linear[0].colorScale[0];

  dureOverlays.radiusFunction = new L.LinearFunction(new L.Point(0, 1), new L.Point(100, 40));
  dureOverlays.BubbleOverlayOptions['displayOptions'][dureOverlays.yearOnLegend]['radius'] = dureOverlays.radiusFunction;

  //console.log(currentBubbleOverlayData);
  return currentBubbleOverlayData;
};

//Prepare bubble overlay data Country.

dureOverlays.prepareBubbleOverlayData = function (info, dataJSON) {

  var countryCentroids = dureOverlays.getCountryCentroids(); // For world level markers 
  //var stateCentroids = dureOverlays.getStateCentroids(); // For country level markers

  var currentBubbleOverlay = {};
  currentBubbleOverlay.data = dataJSON.data;

  var currentYear, latestYear;

  currentYear = iHealthMap.getCurrentyear();
  latestYear = dureOverlays.getLatestYearFromData(currentBubbleOverlay.data);

  var finalObject = {};

  //dureOverlays.customMarkerIconSizeMax = 0;
  var currentBubbleOverlayData = [];

  $.each(currentBubbleOverlay.data, function (index, Object) {

    if (Object[currentYear] != undefined) {

      dureOverlays.yearOnLegend = currentYear;
      dureOverlays.circleMarkerRadiusMax = 0;

      $.each(countryCentroids, function (ind, Obj) {

        if (Object[currentYear][0][Obj.code] != undefined) {

          if (eval(dureOverlays.circleMarkerRadiusMax) < eval(Object[currentYear][0][Obj.code][0][0])) {
            dureOverlays.circleMarkerRadiusMax = eval(Object[currentYear][0][Obj.code][0][0]);
          }

          var yearKey = "" + currentYear;
          var CodeKey = "ISO";
          var NameKey = "Country";
          //Preparing Data for bubble overlay layer. Data should be an array of objects.
          var obj = {};
          obj[yearKey] = "" + Object[currentYear][0][Obj.code][0][0];
          obj[CodeKey] = Obj.code;
          obj[NameKey] = dureOverlays.getCountryNamefromIso(Obj.code);
          currentBubbleOverlayData.push(obj);
        }
      });

    } else if (Object[latestYear] != undefined) {

      dureOverlays.yearOnLegend = latestYear;

      $.each(countryCentroids, function (ind, Obj) {

        if (Object[latestYear][0][Obj.code] != undefined) {

          if (eval(dureOverlays.circleMarkerRadiusMax) < eval(Object[latestYear][0][Obj.code][0][0])) {
            dureOverlays.circleMarkerRadiusMax = eval(Object[latestYear][0][Obj.code][0][0]);
          }

          var yearKey = "" + latestYear;
          var CodeKey = "ISO";
          var NameKey = "Country";
          //Preparing Data for bubble overlay layer. Data should be an array of objects.
          var obj = {};
          obj[yearKey] = "" + Object[latestYear][0][Obj.code][0][0];
          obj[CodeKey] = Obj.code;
          obj[NameKey] = dureOverlays.getCountryNamefromIso(Obj.code);

          currentBubbleOverlayData.push(obj);
        }
      });

    } else {
      console.log('### ERROR: Year data does not match.');
    }

  });

  /********** setting display key for dureOverlays.BubbleOverlayOptions **********/

  dureOverlays.BubbleOverlayOptions['displayOptions'][dureOverlays.yearOnLegend] = {};
  dureOverlays.BubbleOverlayOptions['displayOptions'][dureOverlays.yearOnLegend]['displayName'] = info.derivedName;
  dureOverlays.bubbleColor = dureOverlays.BubbleOverlayOptions['displayOptions'][dureOverlays.yearOnLegend]['fillColor'] = info.levels[0].scales[0].linear[0].colorScale[0];

  dureOverlays.BubbleOverlayOptions['displayOptions'][dureOverlays.yearOnLegend]['radius'] = dureOverlays.radiusFunction;

  //console.log(currentBubbleOverlayData);
  return currentBubbleOverlayData;
};

dureOverlays.prepareBubbleOverlay = function (info, dataJSON, addToMap) {

  var bubbleOverlay = {};
  var currentBubbleOverlayData = [];

  dureOverlays.overlayArr.push(info.derivedName);

  if (dureUtil.getDataLevel() == 'province') {
    currentBubbleOverlayData = dureOverlays.prepareBubbleOverlayDistrictData(info, dataJSON);
  } else if (dureUtil.getDataLevel() == 'country') {
    currentBubbleOverlayData = dureOverlays.prepareBubbleOverlayProvinceData(info, dataJSON);
  } else {
    currentBubbleOverlayData = dureOverlays.prepareBubbleOverlayData(info, dataJSON);
  }

  /* overwritting the leaflet function for the bubble size with max value */
  dureOverlays.updateCircularMarker();

  //console.log(dureOverlays.BubbleOverlayOptions);	
  //console.log(currentBubbleOverlayData);

  //Instantiate an bubble overlay 			
  var bubbleOverlayLayer = new L.DataLayer(currentBubbleOverlayData, dureOverlays.BubbleOverlayOptions);
  dureOverlays.allOverlayLayers.push(bubbleOverlayLayer);

  if (addToMap) {
    bubbleOverlayLayer.addTo(iHealthMap.map);
  }
};

// Updates the radius of Circular Marker
dureOverlays.updateCircularMarker = function () {

  var radiusMAXBase = dureOverlays.circleMarkerRadiusMax;
  var multiplicationFactor = 25;

  //console.log(radiusMAXBase);
  //console.log(dureOverlays.numDigits(radiusMAXBase));

  if (dureOverlays.numDigits(radiusMAXBase) > 3) {
    multiplicationFactor = 250;
  }

  L.CircleMarker = L.CircleMarker.extend({
    initialize: function (latlng, options) {
      L.Circle.prototype.initialize.call(this, latlng, null, options);

      var actualRadius = this.options.radius;
      //console.log(radiusMAXBase);
      //console.log(radiusMAXBase.length);
      //console.log(multiplicationFactor);
      //console.log(actualRadius);
      var proportionalRadius = Math.abs(Math.round((actualRadius * multiplicationFactor / radiusMAXBase), 0));
      //console.log(proportionalRadius);				
      if (proportionalRadius > 10) {
        proportionalRadius = 10;
      }
      //console.log(proportionalRadius);			
      this._radius = proportionalRadius;

      // this._radius = 10;//proportionalRadius == 0 ? 10 : proportionalRadius; 
    },
  });
};

/******************************************** SECTION: Custom Marker Overlay ***************************************************/

// Calculate custom marker icon size
dureOverlays.customMarkerIconSize = function (markerValue) {

  var multiplicationFactor = 50;

  if (dureOverlays.numDigits(dureOverlays.customMarkerIconSizeMax) > 4) {
    multiplicationFactor = 250;
  }

  var proportionalMarkerIconSize = Math.round((markerValue * multiplicationFactor / dureOverlays.customMarkerIconSizeMax), 0);

  //console.log(proportionalMarkerIconSize);

  if (proportionalMarkerIconSize > 25) {
    proportionalMarkerIconSize = 25;
  }

  return proportionalMarkerIconSize;
};

// Gets the color according to the data-scale and color-scale from provided data .
dureOverlays.getColorScaleForData = function (markerValue, overlayinfo) {

  // Hardcoding for string values matching
  if (overlayinfo.derivedId == 2) {

    if (markerValue == 'Introduced into national immunization program') {

      markerValue = 'Introduced';

    } else if (markerValue == 'Gavi approved/approved with clarification' ||
            markerValue == 'Gavi conditional approval to introduce' ||
            markerValue == 'Gavi application submitted under review' ||
            markerValue == 'Gavi plan to apply' ||
            markerValue == 'Non-Gavi planning introduction') {

      markerValue = 'Planning';

    } else if (markerValue == 'No Decision' ||
            markerValue == 'Decision against Introduction' ||
            markerValue == 'Widespread coverage through private market') {

      markerValue = 'Not Introduced';

    }

  }

  var scale = {};
  if (markerValue != undefined) {

    if (dureUtil.getDataLevel() == 'country') {

      scale.lower = overlayinfo.levels[1].scales[0].linear[0].lowScale;
      scale.higher = overlayinfo.levels[1].scales[0].linear[0].highScale;
      scale.color = overlayinfo.levels[1].scales[0].linear[0].colorScale;
      scale.scaleDesc = overlayinfo.levels[1].scales[0].linear[0].scaleDesc;

    } else if (dureUtil.getDataLevel() == 'province') {

      scale.lower = overlayinfo.levels[2].scales[0].linear[0].lowScale;
      scale.higher = overlayinfo.levels[2].scales[0].linear[0].highScale;
      scale.color = overlayinfo.levels[2].scales[0].linear[0].colorScale;
      scale.scaleDesc = overlayinfo.levels[2].scales[0].linear[0].scaleDesc;

    } else {

      scale.lower = overlayinfo.levels[0].scales[0].linear[0].lowScale;
      scale.higher = overlayinfo.levels[0].scales[0].linear[0].highScale;
      scale.color = overlayinfo.levels[0].scales[0].linear[0].colorScale;
      scale.scaleDesc = overlayinfo.levels[0].scales[0].linear[0].scaleDesc;
    }

    // For standard data format calculate the legend using scales higher and lower
    if (overlayinfo.dataFormat == 'Standard') {

      for (var i = 0; i < scale.higher.length; i++) {
        if (markerValue >= scale.lower[i] && markerValue <= scale.higher[i]) {
          scale.markerColor = scale.color[i];
        } else if (markerValue > scale.higher[scale.higher.length - 1]) {
          scale.markerColor = scale.color[i];
        } else if (markerValue < scale.lower[0]) {
          scale.markerColor = scale.color[i];
        }
      }
    } else { // For non-standard data format calculate the legend using scale description
      if (overlayinfo.derivedId == 39) {

        for (var i = 0; i < scale.higher.length; i++) {
          if (markerValue >= scale.lower[i] && markerValue <= scale.higher[i]) {
            scale.markerColor = scale.color[i];
          } else if (markerValue > scale.higher[scale.higher.length - 1]) {
            scale.markerColor = scale.color[i];
          } else if (markerValue < scale.lower[0]) {
            scale.markerColor = scale.color[i];
          }
        }

      } else {
        for (var i = 0; i < scale.scaleDesc.length; i++) {

          if (scale.scaleDesc[i] != "null") {

            if (scale.scaleDesc[i] == markerValue) {
              scale.markerColor = scale.color[i];
            }
          }
        }
      }
    }

    if (scale.markerColor == undefined) {
      scale.markerColor = '#000000';
    }
  }

  return scale.markerColor;
};

// Prepare marker data for Province Level
dureOverlays.prepareDistrictDataForCustomMarkerLayer = function (overlayinfo, dataJSON) {

  //console.log(overlayinfo);
  //console.log(dataJSON);

  var currentProvince = province.dbClickCrntObj.target.feature.properties.ISO;
  var customMarkerOverlay = {};
  customMarkerOverlay.data = dataJSON.data;

  var currentYear, latestYear;

  currentYear = iHealthMap.getCurrentyear();
  latestYear = dureOverlays.getLatestYearFromData(customMarkerOverlay.data);

  var finalObject = {};
  var currentCustomMarkerOverlayData = [];

  $.each(customMarkerOverlay.data, function (index, Object) {

    if (Object[currentYear] != undefined) {

      dureOverlays.yearOnLegend = currentYear;

      $.each(Object[currentYear][0], function (districtISO, Obj) {

        if (districtISO != undefined) {

          var markerValue = Obj[0][0];
          var jsonObject = {};

          var districtInfo = dureOverlays.getDistrictCentroid(districtISO); // For province level markers 

          //console.log(districtInfo);

          /* if (eval(dureOverlays.customMarkerIconSizeMax) < eval(Object[latestYear][0][isocode][0][0])){
           
           dureOverlays.customMarkerIconSizeMax = eval(Object[latestYear][0][isocode][0][0]);
           } */

          jsonObject.lat = districtInfo[districtISO].lat;
          jsonObject.lon = districtInfo[districtISO].lon;
          jsonObject.code = districtISO;
          jsonObject.name = dureOverlays.getDistrictNamefromIso(districtISO);

          if (typeof markerValue == 'string') {
            jsonObject.value = markerValue;
          } else if ($.isNumeric(markerValue)) {
            jsonObject.value = dureUtil.numberWithCommas(markerValue);
          } else if (markerValue % 1 != 0) {
            jsonObject.value = numberWithRound(markerValue, 2);
          }

          jsonObject.color = dureOverlays.getColorScaleForData(markerValue, overlayinfo);

          finalObject[districtISO] = jsonObject;
        }

      });

    } else if (Object[latestYear] != undefined) {

      dureOverlays.yearOnLegend = latestYear;

      $.each(Object[latestYear][0], function (districtISO, Obj) {

        if (districtISO != undefined) {

          var markerValue = Obj[0][0];
          var jsonObject = {};

          var districtInfo = dureOverlays.getDistrictCentroid(districtISO); // For province level markers 

          /* if (eval(dureOverlays.customMarkerIconSizeMax) < eval(Object[latestYear][0][isocode][0][0])){
           
           dureOverlays.customMarkerIconSizeMax = eval(Object[latestYear][0][isocode][0][0]);
           } */

          jsonObject.lat = districtInfo[districtISO].lat;
          jsonObject.lon = districtInfo[districtISO].lon;
          jsonObject.code = districtISO;
          jsonObject.name = dureOverlays.getDistrictNamefromIso(districtISO);

          if (typeof markerValue == 'string') {
            jsonObject.value = markerValue;
          } else if ($.isNumeric(markerValue)) {
            jsonObject.value = dureUtil.numberWithCommas(markerValue);
          } else if (markerValue % 1 != 0) {
            jsonObject.value = numberWithRound(markerValue, 2);
          }

          jsonObject.color = dureOverlays.getColorScaleForData(markerValue, overlayinfo);
          finalObject[districtISO] = jsonObject;
        }

      });

    } else {
      console.log('### ERROR: Year data does not match.');
    }

  });
  //console.log(finalObject);
  return finalObject;
};

// Prepare marker data for Country level 
dureOverlays.prepareStateDataForCustomMarkerLayer = function (overlayinfo, dataJSON) {

  //console.log(overlayinfo);
  var regionCentroids;

  regionCentroids = dureOverlays.getStateCentroids(); // For country level markers	

  //console.log(regionCentroids);

  var customMarkerOverlay = {};
  customMarkerOverlay.data = dataJSON.data;

  var currentYear, latestYear;

  currentYear = iHealthMap.getCurrentyear();
  latestYear = dureOverlays.getLatestYearFromData(customMarkerOverlay.data);

  var finalObject = {};
  var currentCustomMarkerOverlayData = [];

  //dureOverlays.customMarkerIconSizeMax = 0;

  //console.log(customMarkerOverlay);

  $.each(customMarkerOverlay.data, function (index, Object) {

    if (Object[currentYear] != undefined) {

      //console.log(Object[currentYear]);

      dureOverlays.yearOnLegend = currentYear;

      var labelValue, labelValue1;

      $.each(regionCentroids, function (iso, Obj) {

        if (Object[currentYear][0][iso] != undefined) {

          var markerValue = Object[currentYear][0][iso][0][0];
          var markerValue1 = Object[currentYear][0][iso][0][1];

          if (Object[currentYear][0][iso][1][0] != "" && Object[currentYear][0][iso][1][0] != undefined) {
            labelValue = Object[currentYear][0][iso][1][0];
            labelValue1 = Object[currentYear][0][iso][1][1];
          }

          var jsonObject = {};

          /* if (eval(dureOverlays.customMarkerIconSizeMax) < eval(Object[currentYear][0][isocode][0][0])){
           
           dureOverlays.customMarkerIconSizeMax = eval(Object[currentYear][0][isocode][0][0]);
           } */

          jsonObject.lat = Obj.lat;
          jsonObject.lon = Obj.lng;
          jsonObject.code = iso;
          jsonObject.name = dureOverlays.getProvinceNamefromIso(iso);

          if (labelValue != "") {
            jsonObject.label = labelValue;
          }

          if (typeof markerValue == 'string') {
            jsonObject.value = markerValue;
          } else if ($.isNumeric(markerValue)) {
            jsonObject.value = dureUtil.numberWithCommas(markerValue);
          } else if (markerValue % 1 != 0) {
            jsonObject.value = numberWithRound(markerValue, 2);
          }

          //jsonObject[''+labelValue1] = markerValue1;	

          jsonObject.color = dureOverlays.getColorScaleForData(markerValue, overlayinfo);

          finalObject[iso] = jsonObject;
        }
      });

    } else if (Object[latestYear] != undefined) {

      dureOverlays.yearOnLegend = latestYear;

      $.each(regionCentroids, function (iso, Obj) {

        if (Object[latestYear][0][iso] != undefined) {

          var markerValue = Object[latestYear][0][iso][0][0];
          var jsonObject = {};

          /* if (eval(dureOverlays.customMarkerIconSizeMax) < eval(Object[latestYear][0][isocode][0][0])){
           
           dureOverlays.customMarkerIconSizeMax = eval(Object[latestYear][0][isocode][0][0]);
           } */

          //console.log(dureOverlays.getProvinceNamefromIso(iso));

          jsonObject.lat = Obj.lat;
          jsonObject.lon = Obj.lng;
          jsonObject.code = iso;
          jsonObject.name = dureOverlays.getProvinceNamefromIso(iso);

          if (typeof markerValue == 'string') {
            jsonObject.value = markerValue;
          } else if ($.isNumeric(markerValue)) {
            jsonObject.value = dureUtil.numberWithCommas(markerValue);
          } else if (markerValue % 1 != 0) {
            jsonObject.value = numberWithRound(markerValue, 2);
          }

          jsonObject.color = dureOverlays.getColorScaleForData(markerValue, overlayinfo);

          finalObject[iso] = jsonObject;
        }
      });

    } else {
      console.log('### ERROR: Year data does not match.');
    }

  });
  //console.log(finalObject);
  return finalObject;
};

// Prepare marker data for World level 
dureOverlays.prepareDataForCustomMarkerLayer = function (overlayinfo, dataJSON) {

//	console.log(overlayinfo);
//	console.log(dataJSON);
  var regionCentroids;

  regionCentroids = dureOverlays.getCountryCentroids(); // For world level markers 	

  var customMarkerOverlay = {};
  customMarkerOverlay.data = dataJSON.data;

  var currentYear, latestYear;

  currentYear = iHealthMap.getCurrentyear();
  latestYear = dureOverlays.getLatestYearFromData(customMarkerOverlay.data);

  var finalObject = {};
  var currentCustomMarkerOverlayData = [];

  //dureOverlays.customMarkerIconSizeMax = 0;

  $.each(customMarkerOverlay.data, function (index, Obj1) {

    var countryArray, firstISOCountry;

    if (Obj1[currentYear] != undefined) {

      countryArray = Object.keys(Obj1[currentYear][0]);
    } else if (Obj1[latestYear] != undefined) {

      countryArray = Object.keys(Obj1[latestYear][0]);
    }

    firstISOCountry = countryArray[0];

    //console.log(countryArray[0]);

    if (Obj1[currentYear] != undefined) {

      //console.log(Obj1[currentYear]);

      dureOverlays.yearOnLegend = currentYear;
      var labelValue, labelValue1, labelValue2;

      $.each(regionCentroids, function (ind, Obj) {

        if (Obj1[currentYear][0][Obj.code] != undefined) {

          var jsonObject = {};

          var markerValue = Obj1[currentYear][0][Obj.code][0][0];
          var markerValue1 = Obj1[currentYear][0][Obj.code][0][1];
          var markerValue2 = Obj1[currentYear][0][Obj.code][0][2];

          if (Obj1[currentYear][0][firstISOCountry][1][0] != undefined && Obj1[currentYear][0][firstISOCountry][1][0] != "") {
            labelValue = Obj1[currentYear][0][firstISOCountry][1][0];
            /* 						labelValue1 = Obj1[currentYear][0][firstISOCountry][1][1];	
             labelValue2 = Obj1[currentYear][0][firstISOCountry][1][2]; */
          }

          if (Obj1[currentYear][0][firstISOCountry][1][1] != undefined && Obj1[currentYear][0][firstISOCountry][1][1] != "") {
            labelValue1 = Obj1[currentYear][0][firstISOCountry][1][1];
          }

          if (Obj1[currentYear][0][firstISOCountry][1][2] != undefined && Obj1[currentYear][0][firstISOCountry][1][2] != "") {
            labelValue2 = Obj1[currentYear][0][firstISOCountry][1][2];
          }

          /* if (eval(dureOverlays.customMarkerIconSizeMax) < eval(Obj1[currentYear][0][isocode][0][0])){
           
           dureOverlays.customMarkerIconSizeMax = eval(Obj1[currentYear][0][isocode][0][0]);
           } */

          jsonObject.lat = Obj.center.lat;
          jsonObject.lon = Obj.center.lng;
          jsonObject.code = Obj.code;
          //jsonObject.name = dureOverlays.getCountryNamefromIso(Obj.code);
          jsonObject['Country'] = dureOverlays.getCountryNamefromIso(Obj.code);

          if (typeof markerValue == 'string') {
            jsonObject.value = markerValue;
          } else if ($.isNumeric(markerValue)) {
            jsonObject.value = dureUtil.numberWithCommas(markerValue);
          } else if (markerValue % 1 != 0) {
            jsonObject.value = numberWithRound(markerValue, 2);
          }

          if ($.isNumeric(markerValue1)) {
            markerValue1 = dureUtil.numberWithCommas(markerValue1);
          } else {
            markerValue1 = numberWithRound(markerValue1, 2);
          }

          if ($.isNumeric(markerValue2)) {
            markerValue2 = dureUtil.numberWithCommas(markerValue2);
          } else {
            markerValue2 = numberWithRound(markerValue2, 2);
          }

          if (labelValue != undefined) {
            //jsonObject.label = labelValue;	
            jsonObject['' + labelValue] = jsonObject.value;
          }

          if (labelValue1 != undefined) {
            jsonObject['' + labelValue1] = markerValue1;
          }

          if (labelValue2 != undefined) {
            jsonObject['' + labelValue2] = markerValue2;
          }

          //jsonObject.value = numberWithRound(markerValue, 2);

          //jsonObject[''+labelValue1] = markerValue1;	

          jsonObject.color = dureOverlays.getColorScaleForData(markerValue, overlayinfo);

          //console.log(jsonObject);
          finalObject[Obj.code] = jsonObject;
        }
      });

    } else if (Obj1[latestYear] != undefined) {

      dureOverlays.yearOnLegend = latestYear;
      var labelValue, labelValue1, labelValue2;

      //console.log(Object.keys(Obj1[latestYear][0]));

      $.each(regionCentroids, function (ind, Obj) {

        //console.log(Obj.code);				
        //console.log(Obj1[latestYear][0]);
        //console.log(Obj1[latestYear][0][Obj.code]);

        if (Obj1[latestYear][0][Obj.code] != undefined) {

          //var markerValue = Obj1[latestYear][0][Obj.code][0][0];
          var jsonObject = {};

          //console.log(Obj1[latestYear][0][Obj.code][0]);
          //console.log(Obj1[latestYear][0][Obj.code][1]);

          var markerValue = Obj1[latestYear][0][Obj.code][0][0];
          var markerValue1 = Obj1[latestYear][0][Obj.code][0][1];
          var markerValue2 = Obj1[latestYear][0][Obj.code][0][2];

          if (Obj1[latestYear][0][firstISOCountry][1][0] != undefined && Obj1[latestYear][0][firstISOCountry][1][0] != "") {

            labelValue = Obj1[latestYear][0][firstISOCountry][1][0];
          }

          if (Obj1[latestYear][0][firstISOCountry][1][1] != undefined && Obj1[latestYear][0][firstISOCountry][1][1] != "") {
            labelValue1 = Obj1[latestYear][0][firstISOCountry][1][1];
          }

          if (Obj1[latestYear][0][firstISOCountry][1][2] != undefined && Obj1[latestYear][0][firstISOCountry][1][2] != "") {
            labelValue2 = Obj1[latestYear][0][firstISOCountry][1][2];
          }

          /* if (eval(dureOverlays.customMarkerIconSizeMax) < eval(Obj1[latestYear][0][isocode][0][0])){
           
           dureOverlays.customMarkerIconSizeMax = eval(Obj1[latestYear][0][isocode][0][0]);
           } */

          jsonObject.lat = Obj.center.lat;
          jsonObject.lon = Obj.center.lng;
          jsonObject.code = Obj.code;
          //jsonObject.name = dureOverlays.getCountryNamefromIso(Obj.code);					
          jsonObject['Country'] = dureOverlays.getCountryNamefromIso(Obj.code);

          //console.log(labelValue);
          //console.log(labelValue1);
          //console.log(labelValue2);

          if (typeof markerValue == 'string') {
            jsonObject.value = markerValue;
          } else if ($.isNumeric(markerValue)) {
            jsonObject.value = dureUtil.numberWithCommas(markerValue);
          } else if (markerValue % 1 != 0) {
            jsonObject.value = numberWithRound(markerValue, 2);
          }

          if ($.isNumeric(markerValue1)) {
            markerValue1 = dureUtil.numberWithCommas(markerValue1);
          } else {
            markerValue1 = numberWithRound(markerValue1, 2);
          }

          if ($.isNumeric(markerValue2)) {
            markerValue2 = dureUtil.numberWithCommas(markerValue2);
          } else {
            markerValue2 = numberWithRound(markerValue2, 2);
          }

          if (labelValue != undefined) {
            //jsonObject.label = labelValue;
            jsonObject['' + labelValue] = jsonObject.value;
          }

          if (labelValue1 != undefined) {
            jsonObject['' + labelValue1] = markerValue1;
          }

          if (labelValue2 != undefined) {
            jsonObject['' + labelValue2] = markerValue2;
          }

          jsonObject.color = dureOverlays.getColorScaleForData(markerValue, overlayinfo);
          //console.log(jsonObject);
          finalObject[Obj.code] = jsonObject;
        }
      });

    } else {
      console.log('### ERROR: Year data does not match.');
    }

  });
  //console.log(finalObject);
  return finalObject;
};

dureOverlays.drawCustomMarkerOverlay = function (overlayinfo, dataJSON, addToMap) {

  //console.log(dataJSON);
  //console.log(overlayinfo);

  dureOverlays.scaleRangeCat = {regionList: {}, apply: true};
  dureOverlays.overlayArr.push(overlayinfo.derivedName);

  //console.log(dureOverlays.overlayArr);

  var dataForCustomMarkerLayer;

  if (dureUtil.getDataLevel() == 'country') {

    dataForCustomMarkerLayer = dureOverlays.prepareStateDataForCustomMarkerLayer(overlayinfo, dataJSON);

  } else if (dureUtil.getDataLevel() == 'province') {

    dataForCustomMarkerLayer = dureOverlays.prepareDistrictDataForCustomMarkerLayer(overlayinfo, dataJSON);

  } else {
    dataForCustomMarkerLayer = dureOverlays.prepareDataForCustomMarkerLayer(overlayinfo, dataJSON);
  }


  // Changes " Use leaflet DVF marker it generate marker in svg so that markers export on map"
  // console.log(overlayinfo);
  switch (overlayinfo.derivedStyle) {
    case "Star":
      renderStarMarker();
      //console.log("render star marker");
      break;
    case "Triangle":
      renderTriangleMarker();
      //console.log("render Triangle marker");
      break;
    case "Circle":
      renderOnlyCircleMarker();
      //console.log("render Circle marker");
      break;
    case "Diamond":
      //console.log("render Diamond marker");
      break;
    case "Population":
      //console.log("render Population marker");
      break;
    case "Health Facility":
      //console.log("render Health Facility marker");
      break;
    case "House Hold":
      //console.log("render House Hold marker");
      break;
    case "Marker":
      renderCircleMarker();
      //console.log("render Marker marker");
      break;
    case "Marker pin":
      renderMarkerPin();
      //console.log("render marker pin");
      break;
    default:
      console.log("render default marker");
  }


  function renderStarMarker() {
    console.log(dataForCustomMarkerLayer);
    $.each(dataForCustomMarkerLayer, function (key, val) {
      dureOverlays.prepareDataForOverLayBaseChart(val); // TODO Data for overlay chart
      if (val.value != "N/A") {
        var starMarker = new L.StarMarker(new L.LatLng(val.lat, val.lon), {
          color: '#686868',
          opacity: 1,
          weight: 0.7,
          fillColor: val.color,
          //fillColor: '#FFF',
          fillOpacity: 1,
          numberOfSides: 4,
          rotation: 0,
          radius: 5
        });
        delete val.lat;
        delete val.lon;
        delete val.code;
        delete val.color;
        starMarker.bindPopup($(L.HTMLUtils.buildTable(val)).wrap('<div/>').parent().html());
        renderingCustomMarkerOnMap(starMarker);
      }

    });

  }

  function renderTriangleMarker() {
    $.each(dataForCustomMarkerLayer, function (key, val) {
      dureOverlays.prepareDataForOverLayBaseChart(val); // TODO Data for overlay chart
      if (val.value != "N/A") {
        var triangleMarker = new L.TriangleMarker(new L.LatLng(val.lat, val.lon), {
          color: '#686868',
          opacity: 1,
          weight: 0.7,
          fillColor: val.color,
          fillOpacity: 0,
          numberOfSides: 3,
          rotation: 0,
          radius: 6
        });
        delete val.lat;
        delete val.lon;
        delete val.code;
        delete val.color;
        triangleMarker.bindPopup($(L.HTMLUtils.buildTable(val)).wrap('<div/>').parent().html());
        renderingCustomMarkerOnMap(triangleMarker);
      }
    });
  }

  function renderOnlyCircleMarker() {

    $.each(dataForCustomMarkerLayer, function (key, val) {
      dureOverlays.prepareDataForOverLayBaseChart(val); // TODO Data for overlay chart
      if (val.value != "N/A") {
        var circleMarker = new L.CircleMarker(new L.LatLng(val.lat, val.lon), {
          color: '#686868',
          opacity: 1,
          weight: 0.7,
          fillOpacity: 1,
          fillColor: val.color,
          //stroke: "blue",
          gradient: false,
          radius: 10
        });
        delete val.lat;
        delete val.lon;
        delete val.code;
        delete val.color;
        circleMarker.bindPopup($(L.HTMLUtils.buildTable(val)).wrap('<div/>').parent().html());
        renderingCustomMarkerOnMap(circleMarker);
      }
    });
  }

  function renderCircleMarker() {

    $.each(dataForCustomMarkerLayer, function (key, val) {
      dureOverlays.prepareDataForOverLayBaseChart(val); // TODO Data for overlay chart
      if (val.value != "N/A") {
        var circleMarker = new L.CircleMarker(new L.LatLng(val.lat, val.lon), {
          text: {
            text: val.value,
            // Object of key/value pairs specifying SVG attributes to apply to the text element
            attr: {
              "text-anchor": "middle"
            },
            // Object of key/value pairs specifying style attributes to apply to the text element
            style: {
              'font-size': "10px",
              'font-weight': 'bold'
            }

            // Include path options if you want the text to be drawn along the path shape
            /*   path: {
             startOffset: "50%",
             
             // Objects of key/value pairs specifying SVG attributes/style attributes to apply to the textPath element
             attr: {},
             style: {fill:"#00cc00",stroke: "#006600"}
             }*/
          },
          color: "#686868",
          opacity: 1,
          weight: 0.7,
          fillOpacity: 1,
          fillColor: val.color,
          stroke: "blue",
          gradient: true


        });
        delete val.lat;
        delete val.lon;
        delete val.code;
        delete val.color;
        circleMarker.bindPopup($(L.HTMLUtils.buildTable(val)).wrap('<div/>').parent().html());
        renderingCustomMarkerOnMap(circleMarker);
      }
    });
  }

  function renderMarkerPin() {
    $.each(dataForCustomMarkerLayer, function (key, val) {
      dureOverlays.prepareDataForOverLayBaseChart(val); // TODO Data for overlay chart
      if (val.value != "N/A") {
        var markerPin = new L.MapMarker(new L.LatLng(val.lat, val.lon), {
          color: '#686868',
          opacity: 1,
          weight: 0.8,
          fillOpacity: 1,
          fillColor: val.color,
          //stroke: "blue",
          gradient: true,
          innerRadius: 0,
          radius: 7
        });
        //console.log('render marker pin');
        delete val.lat;
        delete val.lon;
        delete val.code;
        delete val.color;
        markerPin.bindPopup($(L.HTMLUtils.buildTable(val)).wrap('<div/>').parent().html());
        renderingCustomMarkerOnMap(markerPin);
      }
    });
  }

  function renderingCustomMarkerOnMap(customMarkerObj) {
    var markerDataLayer = customMarkerObj;
    dureOverlays.allOverlayLayers.push(markerDataLayer);
    if (addToMap) {
      markerDataLayer.addTo(iHealthMap.map);
      $('.custom-icon-marker').parent().removeAttr('title'); // Remove hover LATLNG title from markers
    }
  }
};

/****************************** SECTION: show overlays functions for overlay select control ******************************/

dureOverlays.showRadialChartForYear = function (option, overLayData) {
  //console.log('REACHED');
  //console.log(overLayData);
  option.derivedName = option.label;
  var overLayDataArray = [];
  overLayDataArray.push(overLayData.data);
  dureOverlays.drawRadialBarChart(option, overLayDataArray);
};

dureOverlays.showBarChartForYear = function (info, overLayData) {
  //console.log(option);
  //option.derivedName = option.label;
  var overLayDataArray = [];
  overLayDataArray.push(overLayData.data);
  dureOverlays.prepareBarOverlay(info, overLayDataArray);
}

dureOverlays.showBubbleOverlay = function (option, overLayData) {

  dureOverlays.setBubbleOverlayOptions();
  dureOverlays.prepareBubbleOverlay(overLayData.info, overLayData.data, true);
}

dureOverlays.showCustomMarkerOverlay = function (info, overLayData) {

  //console.log(overLayData);
  dureOverlays.drawCustomMarkerOverlay(info, overLayData.data, true);
  $('.custom-icon-marker').parent().removeAttr('title');
};

/***************************************** SECTION: Overlay data for specific year **********************************************/

dureOverlays.getOverlayDataForCurrentYear = function (currentYear, overLayLabel) {

  dureOverlays.currentOverlayScales = false;
  var currentDerivedData;
  var currentOverlayData = {};
  currentOverlayData.name = "";
  currentOverlayData.style = "";
  currentOverlayData.data = [];

  if (dureUtil.currentFormattedJSONData.extractedObjects != undefined) {

    var derivedDataExt = dureUtil.currentFormattedJSONData.extractedObjects.derivedDataExt;
    var derivedData = dureUtil.currentFormattedJSONData.extractedObjects.derivedData;
    //var derivedInfo = dureUtil.currentFormattedJSONData.extractedObjects.derivedInfo;
    var derivedInfo;

    //console.log(dureUtil.currentFormattedJSONData.extractedObjects);

    if (dureUtil.getDataLevel() == 'province') {
      derivedInfo = dureUtil.currentFormattedJSONData.extractedObjects.districtDerivedInfo;
    } else {
      derivedInfo = dureUtil.currentFormattedJSONData.extractedObjects.derivedInfo;
    }

    /*      console.log(derivedDataExt);
     console.log(derivedData); */
    //console.log(derivedInfo);

    //console.log(overLayLabel);

    $.each(derivedInfo, function (index, object) {

      //console.log(object.derivedName);

      if (object.derivedName != undefined && dureUtil.trim(object.derivedName.toString().toUpperCase()) == dureUtil.trim(overLayLabel).toUpperCase()) {
        console.log(object.dataFormat);
        if (object.dataFormat == 'Non-Standard' && derivedDataExt != undefined) {
          //console.log(derivedDataExt);
          var nonStdData = dureOverlays.getNonStandardDataFromDerivedId(object.derivedId, derivedDataExt);
          //console.log(nonStdData);
          currentOverlayData.data = nonStdData;

        } else if (object.dataFormat == 'Standard' && derivedData != undefined) {

          var stdData = dureOverlays.getStandardDataFromDerivedId(object.derivedId, derivedData);

          if (object.derivedStyle == 'Radial') {
            /* Radial overlay data */
            // console.log('#### Hardcoding for Radial in Derived Data ####');
            //currentDerivedData = derivedData[index].data[0];                    
            currentOverlayData.data = stdData;

            /* PREPARE THE SCALES FOR THE RADIAL CHART */
            /* do this for first time only */
            if (!dureOverlays.currentOverlayScales) {

              dureOverlays.ScaleArry = [];
              $.each(object.levels[0].scales, function (i, j) {
                for (objName in j) {
                  //console.log(objName);

                  if (objName == 'radial') {

                    $.each(j[objName], function (a, b) {
                      //console.log(b);

                      for (var x = 0; x < b.colorScale.length; x++) {

                        var tempScaleObj = {};

                        tempScaleObj.lowScale = b.lowScale[x];
                        tempScaleObj.highScale = b.highScale[x];
                        tempScaleObj.colorScale = b.colorScale[x];
                        tempScaleObj.scaleDesc = b.scaleDesc[x];

                        dureOverlays.ScaleArry.push(tempScaleObj);
                      }
                    });
                  }
                }
              });
              dureOverlays.currentOverlayScales = true;
            }

            /* PREPARE THE SCALES FOR THE RADIAL CHART */
            // Get all the years not just current .. U r showing radials for each year !!!

          } else {
            currentOverlayData.data = stdData;
          }

        } else {
          console.log('### ERROR: Derived IDs does not match while preparing data.');
        }

        currentOverlayData.name = object.derivedName;
        currentOverlayData.style = object.levels[0].scales[0].linear[0].style;
        // currentOverlayData.style = object.derivedStyle;
        currentOverlayData.info = object;

      } else {
        console.log('### ERROR: Selected overlay name does not match derivedName.');
      }
    });
  }

  //console.log(currentOverlayData);
  return currentOverlayData;
};

/***************************************** SECTION: Overlay select control **********************************************/

L.Control.SelectLayers.prototype._onOverlayLayerOptionChange = function (e) {
  //Note. Don't try to implement this function through .selectedIndex
  //or delegation of click event. These methods have bunch of issues on Android devices.
  //console.log("### Overlay Clicked ###");
  //dureOverlays.clearOverlays();
  dureOverlays.circleMarkerRadiusMax = 0;           // TODO
  var options = this._overlaysList.options;
  //console.log(options);


  for (var i = 0; i < options.length; i++) {
    var option = options[i];
    var layer = this._layers[option.layerId].layer;

    //console.log('###'+option.selected);

    if (option.label == 'X|Clear' && option.selected == true) {

      gaviOverlays.clearOverlays();
      return false;
    } else if (option.label == 'GAVI' && option.selected == true) {

      //console.log('gavi');

      //gaviOverlays.clearOverlays();
      //iHealthMap.map.addLayer(gaviOverlays.Gavi_overlay);

      if (iHealthMap.map.hasLayer(gaviOverlays.gaviOverlay)) {

        //console.log('remove gavi layer');
        iHealthMap.map.removeLayer(gaviOverlays.gaviOverlay);

      } else {

        //console.log('add gavi layer');
        iHealthMap.map.addLayer(gaviOverlays.gaviOverlay);
      }

      return false;

    } else if (option.label == 'Non-GAVI' && option.selected == true) {

      //console.log('non gavi');

      //gaviOverlays.clearOverlays();
      //iHealthMap.map.addLayer(gaviOverlays.Non_gavi_overlay);

      if (iHealthMap.map.hasLayer(gaviOverlays.nonGaviOverlay)) {

        // console.log('remove non gavi layer');
        iHealthMap.map.removeLayer(gaviOverlays.nonGaviOverlay);
      } else {

        //console.log('add non gavi layer');
        iHealthMap.map.addLayer(gaviOverlays.nonGaviOverlay);
      }

      return false;

    }

    if (option.selected) {

      if (option.text == 'X | Clear Overlays') {

        $('.overlaySourceWrap').remove();
        dureOverlays.clearOverlays();
        resetOverLayContainer();
        return false;
      } else {
        dureOverlays.clearOverlays();

        dureOverlays.currentSelOverlayName = option.text;
        $('.overlaySourceWrap').remove();
        var overLayData = dureOverlays.getOverlayDataForCurrentYear(iHealthMap.getCurrentyear(), option.text);
        //console.log(overLayData);
        var datasource = '<div class="overlaySourceWrap borderto"><h4>Overlay Information :<b> ' + dureOverlays.currentSelOverlayName + '</b></h4><span style="font-weight:bold ;font-size:15px;margin-right: 5px;">Data Source : </span>' + overLayData.info.derivedMetaInfoExt[0].source + '<br><span style="font-weight:bold ;font-size:15px;margin-right: 5px;">Definition : </span>' + overLayData.info.derivedMetaInfoExt[0].label + '</div>'
        $('.dataSourceWrap').append(datasource);
        //console.log(overLayData);

        //dureOverlays.showOverLayLegendBox(option, overLayData.info);
        // Update the layer data for current layerid !!
        if (overLayData != undefined && overLayData.data.length != 0) {

          //this._layers[option.layerId].layer._data = overLayData.data;
          //console.log(overLayData.style);
          dureOverlays.currentOverlayStyle = overLayData.style;


          if ($.isArray(dureOverlays.currentOverlayStyle)) {


            //console.log(overLayData.info);
            //console.log(overLayData.data);
            dureOverlays.initObjBubbleChartOverlay();
            dureOverlays.prepareOverlayForEachData(overLayData.info, overLayData.data, true);
            dureOverlays.showOverLayLegendBox(option, overLayData.info);

            if ($.inArray('Bubble', dureOverlays.currentOverlayStyle) > -1) {

              // reinitilize obj when bubble overlay change
              // dureOverlays.showBubbleOverlay(option, overLayData);
              loadOverLayBaseChartBubble(option, overLayData.info);

            } else {

              loadOverLayBaseChart();
            }

          } else if (dureOverlays.currentOverlayStyle == 'Radial') {

            dureOverlays.showRadialChartForYear(option, overLayData);

          } else if (dureOverlays.currentOverlayStyle == 'Bubble') {

            dureOverlays.initObjBubbleChartOverlay();                       // reinitilize obj when bubble overlay change
            dureOverlays.showBubbleOverlay(option, overLayData);
            loadOverLayBaseChartBubble(option);
            dureOverlays.showOverLayLegendBox(option, overLayData.info);

          } else if ((overLayData.style == 'Marker') || (overLayData.style == 'Star') || (overLayData.style == 'Triangle') || (overLayData.style == 'Circle') || (overLayData.style == 'Diamond') || (overLayData.style == 'Population') || (overLayData.style == 'Health Facility') || (overLayData.style == 'House Hold') || (overLayData.style == 'Marker pin') || (overLayData.style == 'Marker pin 2')) {

            dureOverlays.showOverLayLegendBox(option, overLayData.info);
            dureOverlays.showCustomMarkerOverlay(overLayData.info, overLayData);
            loadOverLayBaseChart();
          }

          //dureOverlays.showOverLayLegendBox(option, overLayData.info);

          if (!this._map.hasLayer(layer)) {
            //		this._map.addLayer(layer)
          }
          //loadOverLayBaseChart();	
        } else {

          console.log('### No Overlay Data');
          //dureApp.showDialog('Data is not available for ' + option.label + ' overlay for the year ' + iHealthMap.getCurrentyear(), 'info');
          dureOverlays.clearOverlays();
        }
      }
    } else {
      console.log('Overlay not selected');
    }
  }
};

/********************************************* SECTION: Common functionalities *******************************************************/

// Get derivedData from derivedId
dureOverlays.getStandardDataFromDerivedId = function (derivedId, derivedData) {

  var stdData = {};

  $.each(derivedData, function (ind, object) {

    //console.log(derivedId);
    //console.log(object);

    if (derivedId == object.derivedId) {

      stdData.data = object.data;
    }

  });

  stdData.derivedId = derivedId;
  return stdData;
};

dureOverlays.getNonStandardDataFromDerivedId = function (derivedId, derivedDataExt) {

  var nonStdData = {};

  $.each(derivedDataExt, function (ind, object) {

    if (derivedId == object.derivedId) {

      nonStdData.data = object.data;
    }

  });

  nonStdData.derivedId = derivedId;

  return nonStdData;

};

// Add Overlay select control to map 
dureOverlays.callOverlayControlsOnMap = function (overlayNameArr) {

  var overlays = {};
  // console.log(overlayNameArr);
  // console.log(dureOverlays.allOverlayLayers);

  overlays = {
    "X | Clear Overlays": "" 	/* Hardcode for clear overlays */
  };

  $.each(overlayNameArr, function (index, value) {
    // console.log(index);
    // console.log(value);
    overlays[value] = dureOverlays.allOverlayLayers[index];
  });

  // console.log(overlays);
  var currentView = dureUtil.retrieveFromLocal("currentView");
  //console.log(currentView);
  if (currentView.currentViewKey != null) {
    dureOverlays.selectLayer = L.control.selectLayers(baseMaps, overlays, {
      position: "topleft"
    });
    dureOverlays.selectLayer.addTo(iHealthMap.map);
  } else {
    //console.log('CHECKING SELECT LAYER');
    if (dureOverlays.selectLayer != undefined) {
      //console.log('REMOVING SELECT LAYER');
      dureOverlays.selectLayer.removeLayer(dureOverlays.allOverlayLayers);
      // selectLayer.removeFrom(province.map);     // Commented by Shone == For JH
      dureOverlays.selectLayer.removeFrom(iHealthMap.map);
      dureOverlays.selectLayer = null;
    }
  }
};

// Format geoJson for provinces(states) of a country so as to support the leaflet dvf functionality.
dureOverlays.formatStatesGeoJson = function (geoJSON) {

  var formatgeoJson = {};

  $.each(geoJSON.features, function (key, val) {
    var featureObj = {};
    var featureArr = [];
    featureObj = {
      'type': 'Feature',
      'geometry': {
        'coordinates': val.geometry.coordinates,
        'type': val.geometry.type
      },
      'properties': {
        'name': val.properties.NAME_1,
        'ISO': val.properties.ISO
      }
    }

    featureArr.push(featureObj);
    formatgeoJson[val.properties.ISO] = {
      'type': 'FeatureCollection',
      'features': featureArr
    }
  });
  return formatgeoJson;
};

// Format geoJson for provinces(states) of a country so as to support the leaflet dvf functionality.
dureOverlays.formatDistrictGeoJson = function (geoJSON) {

  var formatgeoJson = {};

  $.each(geoJSON.features, function (key, val) {
    var featureObj = {};
    var featureArr = [];
    featureObj = {
      'type': 'Feature',
      'geometry': {
        'coordinates': val.geometry.coordinates,
        'type': val.geometry.type
      },
      'properties': {
        'name': val.properties.NAME_1,
        'ISO': val.properties.ISOCODE
      }
    }

    featureArr.push(featureObj);
    formatgeoJson[val.properties.ISOCODE] = {
      'type': 'FeatureCollection',
      'features': featureArr
    }
  });
  return formatgeoJson;
};

// Fetch centroids of the provinces(states) for displaying markers overlay
dureOverlays.getDistrictCentroid = function (districtISO) {

  // Overiding or formating the respective province geojson as per leaflet-dvf format.		
  L.districts = dureOverlays.formatDistrictGeoJson(subprovince.geoJson);

  // Overwriting L.districtCentroids
  L.districtCentroids = L.GeometryUtils.loadCentroids(L.districts);

  var finalObject = {};

  $.each(L.districtCentroids, function (iso, Obj) {

    if (districtISO == iso) {

      var jsonObject = {};

      jsonObject.lat = Obj.lat;
      jsonObject.lon = Obj.lng;

      finalObject[iso] = jsonObject;
    }
  });

  //return L.districtCentroids;
  return finalObject;
};

// Fetch centroids of the provinces(states) for displaying markers overlay
dureOverlays.getStateCentroids = function () {

  // Overiding or formating the respective province geojson as per leaflet-dvf format.		
  L.states = dureOverlays.formatStatesGeoJson(dureUtil.geoJson);

  // Overwriting L.stateCentroids
  L.stateCentroids = L.GeometryUtils.loadCentroids(L.states);

  return L.stateCentroids;
};

// Fetch centroids of the countries for displaying markers overlay 
dureOverlays.getCountryCentroids = function () {

  var countriesGEOJSON = L.countries;
  var countryCenters = [];

  $.each(countriesGEOJSON, function (index, Object) //<--- fetch countries with centroids from geoJson
  {
    var center = L.GeometryUtils.loadCentroid(Object);
    var object = {};
    object.code = index;
    object.center = center;
    countryCenters.push(object);
  });

  return countryCenters;
};

dureOverlays.getCountryNamefromIso = function (isocode) {

  var regionName;
  for (var iso in L.countries) {

    if (isocode == iso) {
      regionName = L.countries[iso].features[0].properties.name;
      break;
    }
  }
  return regionName;
};

dureOverlays.getProvinceNamefromIso = function (isocode) {

  var regionName;
  for (var iso in L.states) {

    if (isocode == iso) {
      regionName = L.states[iso].features[0].properties.name;
      break;
    }
  }
  return regionName;
};


dureOverlays.getDistrictNamefromIso = function (isocode) {

  var districtName;

  for (var i = 0; i <= (subprovince.geoJson.features.length - 1); i++) {

    if (subprovince.geoJson.features[i].properties.ISOCODE == isocode) {
      districtName = subprovince.geoJson.features[i].properties.NAME_2;
      break;
    }
  }
  return districtName;
}

// Fetch latest year from data
dureOverlays.getLatestYearFromData = function (data) {
  //console.log(data);
  var yearsWithData = dureUtil.getYearsWithData(data[0]);
  //console.log(yearsWithData);
  return Math.max.apply(Math, yearsWithData);
}

dureOverlays.numDigits = function (x) {

  //var num = (Math.log10((x ^ (x >> 31)) - (x >> 31)) | 0) + 1;	
  var num = 1;
  if (x)
  {
    num = x.toString().length;
  }
  return num;
}

/********************************************* SECTION: Overlay Legend *******************************************************/

dureOverlays.showOverLayLegendBox = function (option, overlayInfo) {

// console.log('### overlay legend ###');
// console.log(overlayInfo);

  // var overlayStyle = overlayInfo.derivedStyle;
  var overlayStyle = overlayInfo.levels[0].scales[0].linear[0].style;
  var scale = {};
  var html = '';
  var icon = '';

  if ($.isArray(overlayStyle)) {

    $.each(overlayInfo.levels, function (index, levelObj) {

      if (levelObj.levelName = "Country") {

        scale.lower = levelObj.scales[0].linear[0].lowScale;
        scale.higher = levelObj.scales[0].linear[0].highScale;
        scale.color = levelObj.scales[0].linear[0].colorScale;
        scale.scaleDesc = levelObj.scales[0].linear[0].scaleDesc;
      }
    });


    dureOverlays.colorContainer = scale;
    //icon += '<div class="legendInnerDiv"><h5 style="font-weight:bold">' + option.label +' - '+iHealthMap.getCurrentyear()+'</h5></div>'
    if (overlayInfo.derivedId == 64 || overlayInfo.derivedId == 65)
    {

      icon += '<div class="legendInnerDiv"><h5 style="font-weight:bold">' + option.label + '</h5></div>'
    }
    else {
      // icon += '<div class="legendInnerDiv"><h5 style="font-weight:bold">' + option.label +' - '+iHealthMap.getCurrentyear()+'</h5></div>'
      icon += '<div class="legendInnerDiv"><h5 style="font-weight:bold">' + option.label + '</h5></div>'
    }
    for (var i = 0; i < scale.scaleDesc.length; i++) {

      var style = '';


      if (overlayStyle[i] == 'Star') {
        markerType = "dure-icon-star";
      } else if (overlayStyle[i] == 'Triangle') {
        markerType = "dure-icon-triangle";
      } else if (overlayStyle[i] == 'Circle') {
        markerType = "ihealth-icon-circle2";
      } else if (overlayStyle[i] == 'Diamond') {
        markerType = "ihealth-icon-hexagon";
      } else if (overlayStyle[i] == 'Population') {
        markerType = "fa fa-users";
      } else if (overlayStyle[i] == 'Health Facility') {
        markerType = "fa fa-hospital-o";
      } else if (overlayStyle[i] == 'House Hold') {
        markerType = "fa fa-home";
      } else if (overlayStyle[i] == 'Marker') {

        markerType = "fa fa-circle";
        //style = "background: linear-gradient(145deg,#e5e6eb, " + scale.color[i] + "); background-color:"+ scale.color[i] +" ;";

      } else if (overlayStyle[i] == 'Marker pin') {

        markerType = "dure-icon-location-pin";
        //style = "background: linear-gradient(145deg,#e5e6eb, " + scale.color[i] + "); background-color:"+ scale.color[i] +" ;";

      } else if (overlayStyle[i] == 'Bubble') {

        markerType = "overlay-bubble";
        style = "background: linear-gradient(145deg,#e5e6eb, " + scale.color[i] + "); background-color:" + scale.color[i] + " ;";

      }
      else if (overlayStyle[i] == 'Marker pin 1') {          // custom-fonts / dure/fonts/custom-fonts(path)

        markerType = "dure-icon-marker-pin-1";
        //style = "background: linear-gradient(145deg,#e5e6eb, " + scale.color[i] + "); background-color:"+ scale.color[i] +" ;";

      }
      else if (overlayStyle[i] == 'Marker pin 2') {

        markerType = "dure-icon-marker-pin-2";
        //style = "background: linear-gradient(145deg,#e5e6eb, " + scale.color[i] + "); background-color:"+ scale.color[i] +" ;";

      }
      else if (overlayStyle[i] == 'Marker pin 3') {

        markerType = "dure-icon-marker-pin-3";
        //style = "background: linear-gradient(145deg,#e5e6eb, " + scale.color[i] + "); background-color:"+ scale.color[i] +" ;";

      }
      else if (overlayStyle[i] == 'Marker pin 4') {

        markerType = "dure-icon-marker-pin-4";
        //style = "background: linear-gradient(145deg,#e5e6eb, " + scale.color[i] + "); background-color:"+ scale.color[i] +" ;";

      }

      else if (overlayStyle[i] == 'Square') {

        markerType = "dure-icon-square";
        //style = "background: linear-gradient(145deg,#e5e6eb, " + scale.color[i] + "); background-color:"+ scale.color[i] +" ;";

      }


      //icon += '<div class="legendInnerDiv"><i class="legendstyle ' + markerType + '" style="color: ' + scale.color[i] + '; '+style+' font-size:18px;font-weight:bolder;"></i>&nbsp;' + '<span>' + scale.scaleDesc[i] + '</span></div>';
      icon += '<div class="legendInnerDiv"><i class="legendstyle ' + markerType + '" style="color: ' + scale.color[i] + '; ' + style + ' font-weight:bolder;"></i>&nbsp;' + '<span>' + scale.scaleDesc[i] + '</span></div>';


    }

  }
  else if (overlayStyle == 'Chart') {
    icon += '<h5>' + option.label + '</h5>' + '<i class="overlay-chart" style="background:#73D137;border:1px solid;float:left;margin-right:10px;height:15px;width:15px;"></i>Male<br/>' +
            '<i class="overlay-chart" style="background:#CE1F37;border:1px solid;float:left;margin-right:10px;height:15px;width:15px;"></i>Female';
  } else if (overlayStyle == 'Bubble') {

    icon += '<div class="legendInnerDiv"><h5>' + option.label + '</h5> - ' + dureOverlays.yearOnLegend + '<i class="legendstyle overlay-bubble" style="background: linear-gradient(145deg,#e5e6eb, ' + dureOverlays.bubbleColor + '); background-color:' + dureOverlays.bubbleColor + ';"></i></div>';

  } else if ((overlayStyle == 'Marker') || (overlayStyle == 'Star') || (overlayStyle == 'Triangle') || (overlayStyle == 'Circle') || (overlayStyle == 'Diamond') || (overlayStyle == 'Population') || (overlayStyle == 'Health Facility') || (overlayStyle == 'House Hold') || (overlayStyle == 'Marker pin')) {

    if (dureUtil.getDataLevel() == 'country') {

      scale.lower = overlayInfo.levels[1].scales[0].linear[0].lowScale;
      scale.higher = overlayInfo.levels[1].scales[0].linear[0].highScale;
      scale.color = overlayInfo.levels[1].scales[0].linear[0].colorScale;
      scale.scaleDesc = overlayInfo.levels[1].scales[0].linear[0].scaleDesc;
      dureOverlays.colorContainer = scale;

    } else if (dureUtil.getDataLevel() == 'province') {

      scale.lower = overlayInfo.levels[2].scales[0].linear[0].lowScale;
      scale.higher = overlayInfo.levels[2].scales[0].linear[0].highScale;
      scale.color = overlayInfo.levels[2].scales[0].linear[0].colorScale;
      scale.scaleDesc = overlayInfo.levels[2].scales[0].linear[0].scaleDesc;
      dureOverlays.colorContainer = scale;

    } else {

      scale.lower = overlayInfo.levels[0].scales[0].linear[0].lowScale;
      scale.higher = overlayInfo.levels[0].scales[0].linear[0].highScale;
      scale.color = overlayInfo.levels[0].scales[0].linear[0].colorScale;
      scale.scaleDesc = overlayInfo.levels[0].scales[0].linear[0].scaleDesc;
      dureOverlays.colorContainer = scale;
    }

    if (overlayStyle == 'Star') {
      markerType = "fa fa-star";
    } else if (overlayStyle == 'Triangle') {
      markerType = "ihealth-icon-triangle";
    } else if (overlayStyle == 'Circle') {
      markerType = "ihealth-icon-circle2";
    } else if (overlayStyle == 'Diamond') {
      markerType = "ihealth-icon-hexagon";
    } else if (overlayStyle == 'Population') {
      markerType = "fa fa-users";
    } else if (overlayStyle == 'Health Facility') {
      markerType = "fa fa-hospital-o";
    } else if (overlayStyle == 'House Hold') {
      markerType = "fa fa-home";
    } else if (overlayStyle == 'Marker') {
      markerType = "badge-with-values";
    } else if (overlayStyle == 'Marker pin') {
      markerType = "badge-with-values";
    }

    // icon += '<div class="legendInnerDiv"><h5>' + option.label + ' - '+ dureOverlays.yearOnLegend +'</h5></div>';
    var arrayOfDerivedIds = [4, 5, 39];
    if ($.inArray(overlayInfo.derivedId, arrayOfDerivedIds) > -1) {

      icon += '<div class="legendInnerDiv"><h5>' + option.label + '</h5></div>';

    } else {
      icon += '<div class="legendInnerDiv"><h5>' + option.label + ' - ' + dureOverlays.yearOnLegend + '</h5></div>';
    }

    for (var i = 0; i < scale.scaleDesc.length; i++) {

      if ((scale.scaleDesc[i] == "null") || (scale.scaleDesc[i] == "None") || (scale.scaleDesc[i] == "Null") || (scale.scaleDesc[i] == undefined) || (scale.scaleDesc[i] == 'N/A')) {
        icon += '';
      } else {

        if (markerType == 'badge-with-values') {
          icon += '<div class="legendInnerDiv"><i class="legendstyle ' + markerType + '" style="color: ' + scale.color[i] + '; font-size:12px;font-weight:bolder; background: radial-gradient( 5px -9px, circle, white 8%, ' + scale.color[i] + ' 26px );' +
                  'background: -moz-radial-gradient( 5px -9px, circle, white 8%, ' + scale.color[i] + ' 26px );' +
                  'background: -ms-radial-gradient( 5px -9px, circle, white 8%, ' + scale.color[i] + ' 26px );' +
                  'background: -o-radial-gradient( 5px -9px, circle, white 8%, ' + scale.color[i] + ' 26px );' +
                  'background: -webkit-radial-gradient( 5px -9px, circle, white 8%, ' + scale.color[i] + ' 26px );' +
                  'background-color: ' + scale.color[i] + ';"></i>&nbsp;' + '<span> ' + scale.scaleDesc[i] + '</span></div>';
        } else if (markerType == 'ihealth-icon-circle2') {
          //icon += '<div class="legendInnerDiv"><i class="legendstyle ' + markerType + '" style="color: ' + scale.color[i] + '; font-size:12px;font-weight:bolder;"></i>&nbsp;' + '<span>' + scale.scaleDesc[i] + '</span></div>';

          icon += '<div class="legendInnerDiv"><i class="legendstyle overlay-circle" style="background: linear-gradient(145deg,#e5e6eb, ' + scale.color[i] + '); background-color:' + scale.color[i] + ';"></i>&nbsp;' + '<span>' + scale.scaleDesc[i] + '</span></div>';

        } else {
          icon += '<div class="legendInnerDiv"><i class="legendstyle ' + markerType + '" style="color: ' + scale.color[i] + '; font-size:12px;font-weight:bolder;"></i>&nbsp;' + '<span>' + scale.scaleDesc[i] + '</span></div>';
        }
      }
    }
  }


  //  html += '<div class="box-body" id="marker-legend" style="display: block;">' + icon + '</div>';
  html += '<div class="box-body" style="display: block;"><div id="marker-legend">' + icon + '</div></div>';

  //The IPV dosing schedule overlay categories are incorrect hard-coded (3+0 and/or 3+1)
  if (overlayInfo.derivedId == 15) {

    var markerLegendHTML = $.parseHTML(html);
    var indexNumber = [];
    var markerLegendInnerHTML = $(markerLegendHTML).find(".legendInnerDiv");
    $.each(markerLegendInnerHTML, function (i, el) {

      if ($(el).text() == " 3+0" || $(el).text() == " 3+1" || $(el).text() == " 3+0 and 3+1") {
        indexNumber.push(i);
      }
    });
    var colorInner = $(markerLegendHTML).find(".legendInnerDiv").find('.legendstyle ').eq(indexNumber[0]).css('color');
    for (var k = 0; k < indexNumber.length; k++) {
      if (k == indexNumber.length - 1) {

        $(markerLegendHTML).find(".legendInnerDiv").eq(indexNumber[0]).html('<i class="legendstyle dure-icon-square" style="color:' + colorInner + ';  font-weight:bolder;"></i>&nbsp;<span>3+0 and/or 3+1</span>');

      } else {
        $(markerLegendHTML).find(".legendInnerDiv").eq(indexNumber[k]).remove();
      }
    }

    html = markerLegendHTML;
  }

  //$('#marker-legend').remove();
  $('#marker-legend').parent().remove();
  $('.scaleWrap .box').append(html);
};


/***************************************** Gavi/Non-Gavi DVF Stripes layer *******************************************************/

dureOverlays.showOverLayLegendGavi = function (option, overlayInfo) {
  var html = '';
  var icon = '';
  var gaviImg = 'img/gavi.png';

  icon += '<div class="legendInnerDiv"><i class="legendstyle" style="background-image: url(img/gavi.png);width: 40px;height: 20px;display:block;border: 1px solid; float: left;"></i>&nbsp;<span>GAVI</span></div>';

  html += '<div class="box-body" id="gavi-pattern-legend" style="display: block;">' + icon + '</div>';

  $('#gavi-pattern-legend').remove();
  $('.scaleWrap .box').append(html);
};

gaviOverlays.getCodes = function (fileterdRegoinValues) {

  var worldGeoJsonData = worldGeo;
  var setFilterData = [];

  for (var i = 0; i <= (worldGeoJsonData.features.length - 1); i++) {
    for (var j = 0; (j <= fileterdRegoinValues.length - 1); j++) {

      //console.log(worldGeoJsonData.features[i].properties.iso_a3);
      //console.log([fileterdRegoinValues[j]]);

      if (worldGeoJsonData.features[i].properties.iso_a3 == fileterdRegoinValues[j].code) {
        setFilterData.push(worldGeoJsonData.features[i]);
      }
    }
  }
  return setFilterData;
}

gaviOverlays.prepareStripesOverLay = function () {

  var worldGeoJsonData = worldGeo;
  var gaviRegionList = dureMasterRegionList[0];
  var nonGaviRegionList = dureMasterRegionList[1];
  //var nonGaviRegionObject = {};

  //nonGaviRegionObject.nonGavi = nonGaviRegionList['Non-Gavi'];

  var gaviGeoJson = gaviOverlays.getCodes(gaviRegionList.Gavi);
  var nonGaviGeoJson = gaviOverlays.getCodes(nonGaviRegionList['Non-Gavi']);

  gaviOverlays.gaviOverlay = new L.GeoJSON(gaviGeoJson, {
    style: function (feature) {


      return {
        color: '#FFFFFF',
        opacity: 1.0,
        weight: 1,
        fillOpacity: 0.7,
        fillPattern: {
          url: 'img/gavi.png',
          pattern: {
            width: '400px',
            height: '400px',
            patternUnits: 'userSpaceOnUse'
          },
          image: {
            width: '400px',
            height: '400px'
          }
        }
      }
    },
    onEachFeature: function (feature, layer) {
      // get LabelContent from lealfet geojson Object ( private variable _layers)
      var gaviRegionISO = layer.feature.properties.iso_a3;
      for (var _i in iHealthMap.geojsonLayer._layers) {
        if (gaviRegionISO == iHealthMap.geojsonLayer._layers[_i].feature.properties.iso_a3) {
          var _popUpContent = iHealthMap.geojsonLayer._layers[_i].label._content;
          layer.bindLabel(_popUpContent);
          break;
        }
      }
      layer.on({
        click: function (e) {
          var layerId = e.target.feature.properties.iso_a3;
          for (var _i in iHealthMap.geojsonLayer._layers) {
            if (layerId == iHealthMap.geojsonLayer._layers[_i].feature.properties.iso_a3) {
              var layerObj = iHealthMap.geojsonLayer._layers[_i];
              $(layerObj).trigger('click');
              break;
            }
          }
        }
      });
    }
  });

  gaviOverlays.nonGaviOverlay = new L.GeoJSON(nonGaviGeoJson, {
    style: function (feature) {

      //console.log(feature);

      return {
        color: '#FFFFFF',
        opacity: 1.0,
        weight: 1,
        fillOpacity: 0.7,
        fillPattern: {
          url: 'img/nongavi.png',
          pattern: {
            width: '200px',
            height: '200px',
            patternUnits: 'userSpaceOnUse'
          },
          image: {
            width: '200px',
            height: '200px'
          }
        }
      }
    }
  });

  //iHealthMap.map.addLayer(gaviOverlays.gaviOverlay);
  //iHealthMap.map.addLayer(gaviOverlays.nonGaviOverlay);

  /*var gaviOverlayLayers = {
   
   "GAVI": gaviOverlays.gaviOverlay,
   "Non-GAVI": gaviOverlays.nonGaviOverlay,
   "X|Clear": ''
   };
   
   if (gaviOverlays.selectLayer == "" || gaviOverlays.selectLayer == undefined || gaviOverlays.selectLayer == null) {
   
   gaviOverlays.selectLayer = L.control.selectLayers(baseMaps, gaviOverlayLayers, {
   position: "topleft",
   showBaseLayers: false
   }).addTo(iHealthMap.map);
   }*/
}

// This function call in dureexport clear gavi and non gavi pattern and fill it will color # isuee black color on gavi when map export
gaviOverlays.prepareStripesOverLayForExportMap = function () {

  var worldGeoJsonData = worldGeo;
  var gaviRegionList = dureMasterRegionList[0];
  var nonGaviRegionList = dureMasterRegionList[1];
  //var nonGaviRegionObject = {};

  //nonGaviRegionObject.nonGavi = nonGaviRegionList['Non-Gavi'];
  iHealthMap.tempGeojsonLayer = [];
  iHealthMap.geojsonLayer.eachLayer(function (layer) {
    //console.log(layer.feature.id);
    for (var k = 0; k < gaviRegionList.Gavi.length; k++) {
      //	console.log(gaviRegionList.Gavi[k].code);
      if (layer.feature.id == gaviRegionList.Gavi[k].code) {
        iHealthMap.tempGeojsonLayer.push(layer);
        iHealthMap.map.removeLayer(layer);
        break;
      }
    }
    //if()
  });

  var gaviGeoJson = gaviOverlays.getCodes(gaviRegionList.Gavi);
  var nonGaviGeoJson = gaviOverlays.getCodes(nonGaviRegionList['Non-Gavi']);

  gaviOverlays.gaviOverlay = new L.GeoJSON(gaviGeoJson, {
    style: function (feature) {

      //console.log(feature);

      return {
        color: '#FFFFFF',
        opacity: 1.0,
        weight: 1,
        fillOpacity: 0.7,
        fillColor: '#ffff00'

      }
    }
  });

  gaviOverlays.nonGaviOverlay = new L.GeoJSON(nonGaviGeoJson, {
    style: function (feature) {

      //console.log(feature);

      return {
        color: '#FFFFFF',
        opacity: 1.0,
        weight: 1,
        fillOpacity: 0.7,
        fillColor: '#ffff00'
      }
    }
  });

  iHealthMap.map.addLayer(gaviOverlays.gaviOverlay);
//	iHealthMap.map.addLayer(gaviOverlays.nonGaviOverlay);
}


/* Overlay base chart  Data*/

dureOverlays.prepareDataForOverLayBaseChart = function (data) {
  if (data) {

    dureOverlays.prepareScaleWiseList(data);
  }
}

// Seperate Countries according to their scale value
dureOverlays.prepareScaleWiseList = function (data) {
  //console.log(data);
  var scaleRangeName = 'range-' + data.color.replace(new RegExp('#', 'g'), "");
  //var displayName = data.Country != undefined ? data.Country : data.name;
  var displayName;

  if (data.Country != undefined) {
    displayName = data.Country;
  } else if (data.Province != undefined) {
    displayName = data.Province;
  } else {
    displayName = data.District;
  }

  var value = data.value;
  var metaContainer = [];
  if (!dureOverlays.scaleRangeCat.regionList.hasOwnProperty(scaleRangeName)) {
    dureOverlays.scaleRangeCat.regionList[scaleRangeName] = [];
  }
  metaContainer.push(displayName);
  metaContainer.push(value);
  dureOverlays.scaleRangeCat.regionList[scaleRangeName].push(metaContainer);
}

function metaInfoPieChartOverLay(colorCode) {
  var returnInfo = {};
  returnInfo.name = 'No data available';
  var color = '#' + colorCode.substring(colorCode.lastIndexOf('-') + 1, colorCode.length);
  var metaInfo = dureOverlays.colorContainer;
  var colorScale = metaInfo.color;
  for (var i = 0; i < colorScale.length; i++) {
    if (color == colorScale[i]) {
      returnInfo.name = metaInfo.scaleDesc[i];
      break;
    }
  }

  return returnInfo;
}


function prepareDataPieOverLay() {

  var returnChartData = {};
  returnChartData.series = [];
  returnChartData.drilldown = [];
  returnChartData.title = dureOverlays.currentSelOverlayName;
  $.each(dureOverlays.scaleRangeCat.regionList, function (index, val) {
    var innerData = {};
    var drillData = {};
    var meta = metaInfoPieChartOverLay(index);
    innerData.name = meta.name;
    innerData.y = val.length;

    if (index.substring(index.lastIndexOf('-') + 1, index.length) != '000000') {

      innerData.color = '#' + index.substring(index.lastIndexOf('-') + 1, index.length);
    } else {
      innerData.color = '#BDC3C7';
    }


    innerData.drilldown = meta.name;
    drillData.id = meta.name;
    drillData.type = 'column';
    drillData.data = [];
    for (var i = 0; i < val.length; i++) {
      var innerDrillData = [];
      //console.log(val[i][1].replace(/([,\s]{1,})/,""));
      innerDrillData.push(val[i][0]);

      iHealthMap.getIndicatorDataType() == "Standard" ? innerDrillData.push(Number(val[i][1].toString().replace(/,/g, ''))) : innerDrillData.push(100);

      drillData.data.push(innerDrillData);

    }
    drillData.dataLabels = {enabled: false};
    returnChartData.series.push(innerData);
    returnChartData.drilldown.push(drillData);
  });
  //console.log(returnChartData);
  return returnChartData;
}

/*Chart for bubble chart*/

dureOverlays.prepareRadiusWiseList = function (layer, record) {

  var bubbleRadius = Math.abs(layer._radius);

  var bubbleValue = record[dureOverlays.yearOnLegend];    // object Key Access by year on legend for bubble chart **
  //var name = record.Province != undefined ? record.Province : record.District;

  var name;

  if (record.Country != undefined) {
    name = record.Country;
  } else if (record.Province != undefined) {
    name = record.Province;
  } else {
    name = record.District;
  }

  for (var i = 0; i < dureOverlays.radiusScaleRangeCat.range.length; i++) {
    // console.log(dureOverlays.yearOnLegend);
    if (dureOverlays.radiusScaleRangeCat.range[i].scale.indexOf(record["2014"]) > -1) {
      var container = [];
      var keyName = dureOverlays.radiusScaleRangeCat.range[i].name;

      container.push(name);
      container.push(Number(record["2014"]));
      dureOverlays.radiusScaleRangeCat.regionList[keyName].push(container);
      // console.log(dureOverlays.radiusScaleRangeCat.regionList);
      break;
    }
  }

}

dureOverlays.parseDataBubbleChart = function (option, overlayInfo) {
  var returnChartData = {};
  returnChartData.series = [];
  returnChartData.drilldown = [];
  returnChartData.title = option.innerHTML;
  // console.log(dureOverlays.radiusScaleRangeCat.regionList);
  //console.log(overlayInfo);

  var colorScale = overlayInfo.levels[0].scales[0].linear[0].colorScale
  var bubbleColor = "#ffffff";
  var i = 0;
  $.each(dureOverlays.radiusScaleRangeCat.regionList, function (index, val) {

    var innerData = {};
    var drillData = {};
    innerData.name = index;
    innerData.y = val.length;
    // console.log(index);

    // innerData.color = dureOverlays.bubbleColor;//'#FF0000';
    if (index == 'Low') {
      i = 0;
    } else if (index == 'Medium') {
      i = 1;
    } else {

      i = 2;
    }
    innerData.color = colorScale[i] //'#FF0000';

    innerData.drilldown = index;
    drillData.id = index;
    drillData.type = 'column';
    drillData.data = [];
    for (var i = 0; i < val.length; i++) {
      var innerDrillData = [];
      //console.log(val[i][1].replace(/([,\s]{1,})/,""));
      // console.log(val[i]);
      // console.log(val[i][1]);
      innerDrillData.push(val[i][0]);

      innerDrillData.push(Number(val[i][1].toString().replace(/,/g, '')));
      drillData.data.push(innerDrillData);

    }
    drillData.dataLabels = {enabled: false};
    returnChartData.series.push(innerData);
    returnChartData.drilldown.push(drillData);
  });

  return returnChartData;
}


// Prepare Overlay Data 
dureOverlays.prepareOverlayForEachData = function (object, overLayData, addToMap) {

  var overlayinfo = object;
  // console.log(overlayinfo);

  // For putting options of overlay in select dropdown.
  dureOverlays.scaleRangeCat = {regionList: {}, apply: true};
  dureOverlays.overlayArr.push(overlayinfo.derivedName);


  var scaleDesc = object.levels[0].scales[0].linear[0].scaleDesc;
  var colorScale = object.levels[0].scales[0].linear[0].colorScale;
  var overlayStyle = object.levels[0].scales[0].linear[0].style;
  var highScale = object.levels[0].scales[0].linear[0].highScale;
  var lowScale = object.levels[0].scales[0].linear[0].lowScale;
  // var currentYear = iHealthMap.getCurrentyear();
  var currentYear = dureOverlays.getLatestYearFromData(overLayData.data);
  // var currentYear = 2014; // Hardcoding
  var overlayType;
  var customMarkerTypeArr = ['Marker', 'Marker pin', 'Star', 'Triangle', 'Diamond', 'Circle', 'Marker pin 1', 'Marker pin 2', 'Marker pin 3', 'Marker pin 4', 'Square'];
  var standardMarkerTypeArr = ['Bubble', 'Radial', 'Bar'];
  var regionCentroids = L.countryCentroids;
  // var regionCentroids = dureOverlays.getCountryCentroids();
  // console.log(regionCentroids);
  //console.log(currentYear);

  var stdFlag = false;
  var bubbleColor = "";
  // Set Overlay options for Bubble Overlay in style available in array.

  if ($.inArray('Bubble', overlayStyle) > -1) {

    dureOverlays.setBubbleOverlayOptions();
  }


  if (overLayData != undefined) {

    var newCountryData = overLayData.data[0][currentYear][0];
    //console.log(overLayData.data[0][currentYear][0]);
    
    var countryData = {};
    for(var k in newCountryData) countryData[k]=newCountryData[k];
    
    //console.log(countryData);
    
    //check filter is apply  
    if (iHealthMap.isFilterApplied == 1) {
      $.each(countryData, function (isocode, dataArr) {
        if (iHealthMap.stylingdata[iHealthMap.currentYear][0][isocode] == undefined) {
          delete countryData[isocode];
        }
      });
    }
    //console.log(countryData);
    if (overlayinfo.dataFormat == 'Non-Standard') {

      $.each(countryData, function (isocode, dataArr) {

        $.each(scaleDesc, function (index, scaleVal) {
          var jsonOverlayObj = {}

          if (dataArr[0][0] == scaleVal) {

            overlayType = overlayStyle[index];
            // console.log(overlayType);
            if ($.inArray(overlayType, customMarkerTypeArr) > -1) {

              // var countryCentroids;
              // for(var index in regionCentroids){

              // if(regionCentroids[index].code == isocode){

              // countryCentroids = regionCentroids[index].center;
              // break;
              // }								
              // }

              var countryCentroids = regionCentroids[isocode];
              var labelValue = dataArr[1][0];
              var markerValue = dataArr[0][0];
              // console.log(labelValue);
              if (countryCentroids != undefined) {

                jsonOverlayObj.lat = countryCentroids.lat;
                jsonOverlayObj.lon = countryCentroids.lng;
                jsonOverlayObj.code = isocode;
                jsonOverlayObj['Country'] = dureOverlays.getCountryNamefromIso(isocode);
                jsonOverlayObj.value = markerValue;
                jsonOverlayObj['' + labelValue] = markerValue;
//								console.log(jsonOverlayObj);
                jsonOverlayObj.color = dureOverlays.getColorScaleForData(dataArr[0][0], overlayinfo);


                switch (overlayType) {

                  case "Star":
                    dureOverlays.renderStarMarker(jsonOverlayObj, addToMap);
                    //console.log("render star marker");
                    break;
                  case "Triangle":
                    dureOverlays.renderTriangleMarker(jsonOverlayObj, addToMap);
                    // console.log("render Triangle marker");
                    break;
                  case "Circle":
                    dureOverlays.renderOnlyCircleMarker(jsonOverlayObj, addToMap);
                    // console.log("render Circle marker");
                    break;
                  case "Diamond":
                    // console.log("render Diamond marker");
                    break;
                  case "Marker pin":
                    dureOverlays.renderMarkerPin(jsonOverlayObj, addToMap);
                    // console.log("render marker pin");
                    break;
                  case "Marker":
                    dureOverlays.renderOnlyCircleMarker(jsonOverlayObj, addToMap);
                    // console.log("render Marker marker");
                    break;
                  case "Marker pin 1":
                    dureOverlays.renderCustomShape(jsonOverlayObj, addToMap, 'Marker_pin_1.svg');
                    break;
                  case "Marker pin 2":
                    dureOverlays.renderCustomShape(jsonOverlayObj, addToMap, 'Marker_pin_2.svg');
                    break;
                  case "Marker pin 3":
                    dureOverlays.renderCustomShape(jsonOverlayObj, addToMap, 'Marker_pin_3.svg');
                    break;
                  case "Marker pin 4":
                    dureOverlays.renderCustomShape(jsonOverlayObj, addToMap, 'Marker_pin_4.svg');
                    break;
                  case "Square":
                    dureOverlays.renderSquareMarker(jsonOverlayObj, addToMap);
                    break;
                }
              } else {

                console.log(" Geojson unavailable for this isocede : - " + isocode);
              }

            }

          }

        });
      });

    } else {

      console.log("Stadard Format")
      $.each(countryData, function (isocode, dataArr) {

        for (var i = 0; i < lowScale.length; i++) {

          if (dataArr[0][0] >= lowScale[i] && dataArr[0][0] <= highScale[i]) {

            overlayType = overlayStyle[i];
            bubbleColor = colorScale[i];
            break;
          }
        }
        // console.log(overlayType);
        if ($.inArray(overlayType, standardMarkerTypeArr) > -1) {

          var currentBubbleOverlayData = [];

          if (eval(dureOverlays.circleMarkerRadiusMax) < eval(dataArr[0][0])) {
            dureOverlays.circleMarkerRadiusMax = eval(dataArr[0][0]);
          }

          //console.log(dureOverlays.circleMarkerRadiusMax);
          var yearKey = "" + currentYear;
          var CodeKey = "ISO";
          var NameKey = "Country";
          dureOverlays.yearOnLegend = yearKey
          //Preparing Data for bubble overlay layer. Data should be an array of objects.
          var obj = {};
          obj[yearKey] = Number(dataArr[0][0]);
          obj[CodeKey] = isocode;
          obj[NameKey] = dureOverlays.getCountryNamefromIso(isocode);

          currentBubbleOverlayData.push(obj);

          dureOverlays.BubbleOverlayOptions['displayOptions'][dureOverlays.yearOnLegend] = {};
          dureOverlays.BubbleOverlayOptions['displayOptions'][dureOverlays.yearOnLegend]['displayName'] = overlayinfo.derivedName;
          dureOverlays.bubbleColor = dureOverlays.BubbleOverlayOptions['displayOptions'][dureOverlays.yearOnLegend]['fillColor'] = bubbleColor;

          dureOverlays.radiusFunction = new L.LinearFunction(new L.Point(0, 0), new L.Point(100, 10));
          dureOverlays.BubbleOverlayOptions['displayOptions'][dureOverlays.yearOnLegend]['radius'] = dureOverlays.radiusFunction;

          dureOverlays.renderBubbleOverlay(currentBubbleOverlayData, addToMap)
          // console.log("This is a standard data .Flow is diff");
        } else {

          // console.log(" This is a custom standard marker ...")

          $.each(scaleDesc, function (index, scaleVal) {
            var jsonOverlayObj = {}

            if (dataArr[0][0] >= lowScale[index] && dataArr[0][0] <= highScale[index]) {

              overlayType = overlayStyle[index];
              // console.log(overlayType);
              if ($.inArray(overlayType, customMarkerTypeArr) > -1) {

                // console.log(isocode);
                var countryCentroids = regionCentroids[isocode];

                // var countryCentroids;
                // for(var index in regionCentroids){

                // if(regionCentroids[index].code == isocode){

                // countryCentroids = regionCentroids[index].center;
                // break;
                // }								
                // }
                // console.log(countryCentroids);
                var labelValue = dataArr[1][0];
                var markerValue = dataArr[0][0];
                // console.log(labelValue);
                if (countryCentroids != undefined) {

                  jsonOverlayObj.lat = countryCentroids.lat;
                  jsonOverlayObj.lon = countryCentroids.lng;
                  jsonOverlayObj.code = isocode;
                  jsonOverlayObj['Country'] = dureOverlays.getCountryNamefromIso(isocode);
                  jsonOverlayObj.value = markerValue;
                  jsonOverlayObj['' + labelValue] = markerValue;
                  // console.log(jsonOverlayObj);
                  jsonOverlayObj.color = dureOverlays.getColorScaleForData(dataArr[0][0], overlayinfo);


                  switch (overlayType) {

                    case "Star":
                      dureOverlays.renderStarMarker(jsonOverlayObj, addToMap);
                      // console.log("render star marker");
                      break;
                    case "Triangle":
                      dureOverlays.renderTriangleMarker(jsonOverlayObj, addToMap);
                      // console.log("render Triangle marker");
                      break;
                    case "Circle":
                      dureOverlays.renderOnlyCircleMarker(jsonOverlayObj, addToMap);
                      // console.log("render Circle marker");
                      break;
                    case "Diamond":
                      // console.log("render Diamond marker");
                      break;
                    case "Marker pin":
                      dureOverlays.renderMarkerPin(jsonOverlayObj, addToMap);
                      // console.log("render marker pin");	
                      break;
                    case "Marker":
                      //dureOverlays.renderCircleMarker(jsonOverlayObj,addToMap);
                      dureOverlays.renderOnlyCircleMarker(jsonOverlayObj, addToMap);
                      // console.log("render Marker marker");
                      break;
                    case "Marker pin 1":
                      dureOverlays.renderCustomShape(jsonOverlayObj, addToMap, 'Marker_pin_1.svg');
                      break;
                    case "Marker pin 2":
                      dureOverlays.renderCustomShape(jsonOverlayObj, addToMap, 'Marker_pin_2.svg');
                      break;
                    case "Marker pin 3":
                      dureOverlays.renderCustomShape(jsonOverlayObj, addToMap, 'Marker_pin_3.svg');
                      break;
                    case "Marker pin 4":
                      dureOverlays.renderCustomShape(jsonOverlayObj, addToMap, 'Marker_pin_4.svg');
                      break;
                    case "Square":
                      dureOverlays.renderSquareMarker(jsonOverlayObj, addToMap);
                      break;

                  }
                } else {

                  console.log(" Geojson unavailable for this isocede:- " + isocode);
                }

              }

            }

          });

        }
      });

    }

    // dureOverlays.BubbleOverlayOptions['displayOptions'][dureOverlays.yearOnLegend]['displayName'] = overlayinfo.derivedName;

    // console.log(currentBubbleOverlayData);		

  } else {

    console.log("Data is not defined.");
  }

};

dureOverlays.renderStarMarker = function (markerObj, addToMap) {

  dureOverlays.prepareDataForOverLayBaseChart(markerObj);
  if (markerObj.value != "N/A") {
    var starMarker = new L.StarMarker(new L.LatLng(markerObj.lat, markerObj.lon), {
      color: '#686868',
      opacity: 1,
      weight: 1,
      stroke: true,
      fillColor: markerObj.color,
      //fillColor: '#FFF',
      fillOpacity: 1,
      numberOfSides: 5,
      rotation: 0,
      radius: 7,
      gradient: false,
      dropShadow: false
    });
    delete markerObj.lat;
    delete markerObj.lon;
    delete markerObj.code;
    delete markerObj.color;
    starMarker.bindPopup($(L.HTMLUtils.buildTable(markerObj)).wrap('<div/>').parent().html());
    dureOverlays.renderingCustomMarkerOnMap(starMarker, addToMap);
  }

}

dureOverlays.renderSquareMarker = function (markerObj, addToMap) {

  dureOverlays.prepareDataForOverLayBaseChart(markerObj);
  if (markerObj.value != "N/A") {
    var squareMarker = new L.SquareMarker(new L.LatLng(markerObj.lat, markerObj.lon), {
      color: '#686868',
      opacity: 1,
      weight: 0.9,
      fillColor: markerObj.color,
      //fillColor: '#FFF',
      fillOpacity: 1,
      radius: 6,
      gradient: false,
      dropShadow: false
    });
    delete markerObj.lat;
    delete markerObj.lon;
    delete markerObj.code;
    delete markerObj.color;
    squareMarker.bindPopup($(L.HTMLUtils.buildTable(markerObj)).wrap('<div/>').parent().html());
    dureOverlays.renderingCustomMarkerOnMap(squareMarker, addToMap);
  }

}



dureOverlays.renderCustomShape = function (markerObj, addToMap, svgFileName) {
  dureOverlays.prepareDataForOverLayBaseChart(markerObj);

  if (markerObj.value != "N/A") {
    var customShape = new L.SVGMarker(new L.LatLng(markerObj.lat, markerObj.lon), {
      svg: 'img/svgshapes/' + svgFileName,
      size: new L.Point(40, 40),
      setStyle: function (svg) {
        $(svg).find('path').attr('fill', markerObj.color);
        $(svg).find('path').attr('stroke', 'white');
        $(svg).find('path').attr('stroke-opacity', 0.7);
        $(svg).find('path').attr('stroke-width', '3px');

      }
    });
    delete markerObj.lat;
    delete markerObj.lon;
    delete markerObj.code;
    customShape.bindPopup($(L.HTMLUtils.buildTable(markerObj)).wrap('<div/>').parent().html());
    dureOverlays.renderingCustomMarkerOnMap(customShape, addToMap);
  }

}

dureOverlays.renderTriangleMarker = function (markerObj, addToMap) {

  dureOverlays.prepareDataForOverLayBaseChart(markerObj);
  if (markerObj.value != "N/A") {
    var triangleMarker = new L.TriangleMarker(new L.LatLng(markerObj.lat, markerObj.lon), {
      color: '#686868',
      opacity: 1,
      weight: 0.7,
      fillColor: markerObj.color,
      //fillColor: '#FFF',
      fillOpacity: 1,
      numberOfSides: 3,
      rotation: 30,
      radius: 8,
      gradient: false,
      dropShadow: false
    });
    delete markerObj.lat;
    delete markerObj.lon;
    delete markerObj.code;
    delete markerObj.color;
    triangleMarker.bindPopup($(L.HTMLUtils.buildTable(markerObj)).wrap('<div/>').parent().html());
    dureOverlays.renderingCustomMarkerOnMap(triangleMarker, addToMap);
  }

}

dureOverlays.renderOnlyCircleMarker = function (markerObj, addToMap) {

  //console.log("Insdie Only Circular.... ");	
  dureOverlays.prepareDataForOverLayBaseChart(markerObj);
  if (markerObj.value != "N/A") {

    var circleMarker = new L.CircleMarker(new L.LatLng(markerObj.lat, markerObj.lon), {
      color: '#686868',
      opacity: 1,
      weight: 0.7,
      fillColor: markerObj.color,
      //fillColor: '#FFF',
      fillOpacity: 1,
      numberOfSides: 0,
      rotation: 0,
      radius: 7,
      gradient: false,
      dropShadow: false
    });

    delete markerObj.lat;
    delete markerObj.lon;
    delete markerObj.code;
    delete markerObj.color;

    circleMarker.bindPopup($(L.HTMLUtils.buildTable(markerObj)).wrap('<div/>').parent().html());
    dureOverlays.renderingCustomMarkerOnMap(circleMarker, addToMap);
  }
}

dureOverlays.renderMarkerPin = function (markerObj, addToMap) {
  // console.log("Insdie Marker pin.... ")
  dureOverlays.prepareDataForOverLayBaseChart(markerObj);
  if (markerObj.value != "N/A") {
    var markerPin = new L.MapMarker(new L.LatLng(markerObj.lat, markerObj.lon), {
      color: '#686868',
      opacity: 1,
      weight: 0.8,
      fillOpacity: 1,
      fillColor: markerObj.color,
      //stroke: "blue",
      gradient: false,
      dropShadow: false,
      innerRadius: 4,
      radius: 7
    });
    delete markerObj.lat;
    delete markerObj.lon;
    delete markerObj.code;
    delete markerObj.color;
    markerPin.bindPopup($(L.HTMLUtils.buildTable(markerObj)).wrap('<div/>').parent().html());
    dureOverlays.renderingCustomMarkerOnMap(markerPin, addToMap);
  }
}

dureOverlays.renderCircleMarker = function (markerObj, addToMap) {

  // console.log("Insdie Marker.... ");
  // console.log(markerObj);
  dureOverlays.prepareDataForOverLayBaseChart(markerObj); // TODO Data for overlay chart
  if (markerObj.value != "N/A") {
    var circleMarker = new L.CircleMarker(new L.LatLng(markerObj.lat, markerObj.lon), {
      text: {
        text: markerObj.value,
        // Object of key/value pairs specifying SVG attributes to apply to the text element
        attr: {
          "text-anchor": "middle"
        },
        // Object of key/value pairs specifying style attributes to apply to the text element
        style: {
          'font-size': "10px",
          'font-weight': 'bold'
        }
      },
      color: "#686868",
      opacity: 1,
      weight: 0.7,
      fillOpacity: 1,
      fillColor: markerObj.color,
      stroke: "blue",
      gradient: false,
      dropShadow: false,
      radius: 10

    });
    // console.log(circleMarker);
    delete markerObj.lat;
    delete markerObj.lon;
    delete markerObj.code;
    delete markerObj.color;
    circleMarker.bindPopup($(L.HTMLUtils.buildTable(markerObj)).wrap('<div/>').parent().html());
    dureOverlays.renderingCustomMarkerOnMap(circleMarker, addToMap);
  }
}

dureOverlays.renderingCustomMarkerOnMap = function (customMarkerObj, addToMap) {

  var markerDataLayer = customMarkerObj;
  dureOverlays.allOverlayLayers.push(markerDataLayer);
  if (addToMap) {

    markerDataLayer.addTo(iHealthMap.map);
    $('.custom-icon-marker').parent().removeAttr('title'); // Remove hover LATLNG title from markers
  }
};

dureOverlays.renderBubbleOverlay = function (currentBubbleOverlayData, addToMap) {

  //dureOverlays.updateCircularMarker();
  // console.log(currentBubbleOverlayData);	
  var bubbleOverlayLayer = new L.DataLayer(currentBubbleOverlayData, dureOverlays.BubbleOverlayOptions);
  dureOverlays.allOverlayLayers.push(bubbleOverlayLayer);

  if (addToMap) {

    bubbleOverlayLayer.addTo(iHealthMap.map);
  }
}

