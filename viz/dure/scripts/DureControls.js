var dureControl = {};
var overViewObj = {}
dureControl.initialize = function(){
}

// Sets the data for controls.
dureControl.setData = function(controlData){
    
    dureControl.data = controlData;
    return true;
}

dureControl.getData = function(){
    return dureControl.data;
}

// Load OVERVIEW panel data in tabular form
dureControl.loadOverviewTableData = function(){   
    
    // Hide the blocks.
    $(".regionSummary_1,.regionSummary_2,.regionSummary_3").hide();

    //Gets data
    var overviewData = dureControl.getData();    
    var filterSubGroups = [];
    var overviewDataObj = {};
    var col1 = [];
    var col2 = [];
    var tempIndicatorArray = [51,56,61,72,73,76,77,80,81,119,139];  
//    var introducedIndicatorArray = [51,56,61,119,139];
    var currentIndicatorId  = dureUtil.getIndicatorId();
    var gaviStatusRegions = [];

    
    // Check if indicator type is Standard or Non-Standard 
    if(iHealthMap.getIndicatorDataType() == 'Standard'){
        
        var indicatorInfo = dureUtil.indicatorMetaInfo.indicatorInfo;
        var scaleInfo = indicatorInfo.levels[0].scales[0].linear[0];
        
        
        overviewDataObj.colValues = [];
        //console.log(overviewData.extractedObjects);
        
        if(overviewData.extractedObjects.extensionData != undefined){
            gaviStatusRegions = dureControl.getGaviStatusRegionCodes(overviewData.extractedObjects.extensionData[0]);
            col2 = dureControl.formatDataForOverviewTable(overviewData.extractedObjects.extensionData[0],'',gaviStatusRegions);
        }
        col1 = dureControl.formatDataForOverviewTable(overviewData.extractedObjects.coreData[0],'',gaviStatusRegions);
        
        if($.inArray(currentIndicatorId,tempIndicatorArray) == -1){
            overviewDataObj.colValues = $.merge(col1,col2);
        }else{
            overviewDataObj.colValues = col1;
        }
       // console.log(overviewDataObj.colValues);
        
    }else{
        
        //Check indicator name and filter group name and Get the filter sub groups for indicator of correct filter 
        filterSubGroups = dureControl.getFilterSubGroups(overviewData.filterGroups,overviewData.metaInfo.indicatorInfo.indicatorName);
        
        // Format the data for overview table panel
        if($.inArray(currentIndicatorId,introducedIndicatorArray) > -1){
            
            //console.log(overviewData);
            //console.log(overviewData.extractedObjects.extensionData[0]);
           // console.log(filterSubGroups);
			overviewDataObj.colValues = dureControl.formatAcrossYearDataForOverviewTable(overviewData.extractedObjects.extensionData[0],filterSubGroups);
            
        }else{
            
        // Format the data for overview table panel
    overviewDataObj.colValues = dureControl.formatDataForOverviewTable(overviewData.extractedObjects.extensionData[0],filterSubGroups);
       
        
        }
        //console.log(overviewDataObj.colValues);
        
    }
    
    /* Done for temporary purpose...  */

    if($.inArray(currentIndicatorId,[72,73,76,77,80,81,159,160]) > -1){

        overviewDataObj.uniqueCols = scaleInfo.scaleDesc;

    }else{
        
        overviewDataObj.uniqueCols = ['','Global','Gavi'];
    }
    console.log(overviewDataObj);
    // Display Tables
    dureControl.showTable(overviewDataObj);    
};

// Get the filter sub groups for indicator of correct filter
dureControl.getFilterSubGroups = function(filterGroups,indicatorName){
    
    var filterSubGroups = [];
    
    //Checks indicator name and filter group name
    if(filterGroups != undefined){
        
        $.each(filterGroups,function(index,filterGroupObj){
            //console.log(indicatorName);
            //console.log(filterGroupObj.filterGroupName);
            if(indicatorName == filterGroupObj.filterGroupName){
                    filterSubGroups = filterGroupObj.filterSubGroups;        
            }    
        });
    }
    
    return filterSubGroups;    
};

// Format the data for OVERVIEW Pannel
dureControl.formatDataForOverviewPanel = function(extensionData,filterSubGroups){
    
    var currentYear =   iHealthMap.getCurrentyear();
    var filterGrpObj = {};
    if(filterSubGroups != undefined){
        $.each(filterSubGroups,function(index,subGrpObj){

            var counter = 0;
            var gaviCounter = 0;
            /* 
             * Check the filter subgroups value with Extension data array of countries for indicator
             * Increment the respective value counters        
             */
            if(currentYear != undefined){
                if(extensionData != undefined){
                    $.each(extensionData[currentYear][0],function(isocode,countryData){

                        if(subGrpObj.filters[0].filterName == countryData[0][0]){
                            counter++
                        }
                        if(subGrpObj.filters[0].filterName == countryData[0][0] && countryData[0][4] == 'Gavi'){
                            gaviCounter++;
                        }
                    }); 
                }
            }
            
            filterGrpObj[subGrpObj.filterSubGroupName] = [];
            filterGrpObj[subGrpObj.filterSubGroupName].push(counter);
            filterGrpObj[subGrpObj.filterSubGroupName].push(gaviCounter);
        });
    }    
//    console.log(filterGrpObj);
    return filterGrpObj;    
};

// Format the data for OVERVIEW TABLE
dureControl.formatDataForOverviewTable = function(extensionData,filterSubGroups,gaviRegions){
    
    //console.log(extensionData);
   // console.log(filterSubGroups);
    var currentYear =   iHealthMap.getCurrentyear();
    var coverageIndicatorArr = [72,73,76,77,80,81,159,160];
    var indicatorInfo = dureUtil.indicatorMetaInfo.indicatorInfo;
    var formattedDataArr = [];
    var removeRows = ["None","N/A","Unknown"];
    
    if(filterSubGroups != undefined){
            if(filterSubGroups != ''){
            $.each(filterSubGroups,function(index,subGrpObj){

                var counter = 0;
                var gaviCounter = 0;

                /* 
                 * Check the filter subgroups value with Extension data array of countries for indicator
                 * Increment the respective value counters        
                 */
                var filterGrpArr = [];
                // Remove data of rows containing values ["None","N/A","Unknown"]
                if($.inArray(subGrpObj.filterSubGroupName ,removeRows) == -1){
                    filterGrpArr.push(subGrpObj.filterSubGroupName);
                    if(currentYear != undefined){
                        if(extensionData != undefined){
                            $.each(extensionData[currentYear][0],function(isocode,countryData){
                                $.each(subGrpObj.filters,function(filterIndex,filterObj){

								 // Check GAVI Status Index in data json.
                                    var gaviIndex = 0;
                                    $.each(countryData[1],function(index,value){
                                        
                                        if(value == 'GAVI Status'){
                                            gaviIndex = index;
                                        }
                                    });
									
                                    if(filterObj.filterName == countryData[0][0]){
                                        counter++
                                    }
                                    if(filterObj.filterName == countryData[0][0] && countryData[0][gaviIndex] == 'Gavi'){
                                        gaviCounter++;
                                    }
                                });

                            }); 
                        }
                    }

                    filterGrpArr.push(counter);
                    filterGrpArr.push(gaviCounter);
                    formattedDataArr.push(filterGrpArr);
                }

            });
        }else{

            //console.log("Filter sub groups not req");
           // console.log(extensionData);
           // console.log(gaviRegions);
                var filterGrpArr = [];
                var regionCountForRange = [];
                var summaryData = 0;
                var gaviSummaryData = 0;
                var summaryDataName = '';
                
                if(currentYear != undefined){
                    
                    if($.inArray(indicatorInfo.indicatorId,coverageIndicatorArr) > -1){
                        
                        var scaleInfo = indicatorInfo.levels[0].scales[0].linear[0];
						console.log(scaleInfo);
                        var scaleRangeList = dureUtil.scaleRangeCat.regionList;
                        
                        for(var i=0; i < scaleInfo.colorScale.length;i++) {
							
                            var hexcode = scaleInfo.colorScale[i];
                            var key = 'range-'+hexcode.replace('#','');
							if(scaleRangeList[key])                 // TODO
                            regionCountForRange.push(scaleRangeList[key].length);
							
                        }
						
                        formattedDataArr.push(regionCountForRange);
                        
                    }else{
                        if(extensionData != undefined){
                            $.each(extensionData[currentYear][0],function(isocode,countryData){
                                
                                summaryData = summaryData + parseInt(countryData[0][0] != "N/A"? countryData[0][0] : 0);              // TODO 
                                if($.inArray(isocode,gaviRegions) > -1){
                                    gaviSummaryData = gaviSummaryData + parseInt(countryData[0][0]);
                                } 
                                summaryDataName = countryData[1][0];
                            }); 
                            filterGrpArr.push(summaryDataName);
                            filterGrpArr.push(dureUtil.numberWithCommas(summaryData));
                            filterGrpArr.push(dureUtil.numberWithCommas(gaviSummaryData));
                            formattedDataArr.push(filterGrpArr);
                        }
                    }
                } 
        }
    }
    //console.log(formattedDataArr);
    return formattedDataArr;    
};


dureControl.formatAcrossYearDataForOverviewTable = function(dataForAllYears,filterSubGroups){
    
    var countryCounter = 0;
    var gaviCounter = 0;
    var formattedDataArr = [];
    var filterGrpArr = [];
    if(dataForAllYears != undefined){
        
        $.each(dataForAllYears,function(year,dataForOneYear){
            
            $.each(dataForOneYear[0],function(isocode,countryDataArr){
                
                    // Check GAVI Status Index in Data-Json.
                    var gaviIndex = 0;
                    $.each(countryDataArr[1],function(index,value){

                        if(value == 'GAVI Status'){
                            gaviIndex = index;
                        }
                    });
                
                if(countryDataArr[0][0] != undefined){
//                console.log((countryDataArr[0][0].split('/').pop() == year));
//                console.log((year));
                    if(countryDataArr[0][0].split('/').pop() == year){

                        countryCounter++;   
                        
                        if(countryDataArr[0][gaviIndex] == 'Gavi'){
                            
                            gaviCounter++;                            
                        }
                    }  
                    
                }
            });            
        });
        
        filterGrpArr.push(filterSubGroups[0].filterSubGroupName);
        filterGrpArr.push(countryCounter);
        filterGrpArr.push(gaviCounter);
        formattedDataArr.push(filterGrpArr);                
    }
    
    return formattedDataArr;
};


dureControl.showTable = function(data){
    
        var tableHtml = {};
        tableHtml.colHeader = '';
        tableHtml.data = {};
        var colObj = {sClass:"alignCenter",sWidth:"0px"};
        var colArr = [];
        if(data != undefined){
            tableHtml.data = data;
            for(var i= 0; i < tableHtml.data.uniqueCols.length ; i++)
            {
                if(tableHtml.data.uniqueCols.length < iHealthTable.maxColumnsSupported){
                    tableHtml.colHeader += "<th>"+tableHtml.data.uniqueCols[i]+"</th>"; // HTML table column header
                }
                colArr.push(colObj);
            }
        }
    
        if($("#iVzOverview").find('th').length != 0){
           // console.log("Table exsist");
            overViewObj.fnClearTable();
            overViewObj.fnDestroy();
            $("#iVzOverview").children('thead').children('tr').children('th').remove();
            $("#iVzOverview").children('thead').children('tr').append(tableHtml.colHeader);
            $("#iVzOverview").dataTable({
                "data": tableHtml.data.colValues,
                "responsive": true,
                "iDisplayLength": 10,
                "lengthMenu": [ 5,10,15,20],
				"paging": false,
				"ordering": false,
                "bFilter": false, 
                "bInfo": false,
				"aoColumns":colArr
               // "sScrollX": "500px",
                //"sScrollY": "370px"
            });
        }else{
            $("#iVzOverview").children('thead').children('tr').html(tableHtml.colHeader);
            //Initialize Data Tables.
            overViewObj = $("#iVzOverview").dataTable({
                            "data": tableHtml.data.colValues,
                            "responsive": true,
                            "iDisplayLength": 10,
                            "lengthMenu": [ 5,10,15,20],
							"paging": false,
							"ordering": false,
							"bFilter": false, 
							"bInfo": false,
							"aoColumns":[{sClass:"alignCenter",sWidth:"0px"},{sClass:"alignCenter",sWidth:"0px"},{sClass:"alignCenter",sWidth:"0px"}]
                           // "sScrollX": "500px",
                            //"sScrollY": "370px"
                        });
        }
    
        //$( "#iVzOverview_paginate .paginate_button .active > a" ).trigger( "click" );
    
};

//Build dynamic Overview Pannel
dureControl.buildDynamicPanel = function(){
    var count = 0;
    var row = 1;
    var col = 1;
    var bgcolor = 'bg-aqua';
    $.each(overviewDataObj,function(key,dataArr){
        count++;
              
        if(col == 1){
            bgcolor = 'bg-red'; 
        }else if(col == 2){
            bgcolor = 'bg-black'; 
        }else if(col == 3){
            bgcolor = 'bg-green'; 
        }
        
       var cloneHtml = '<div class="col-lg-4 col-md-4 col-sm-4 col-xs-4 overviewWrapper">'+
                        '<div class="small-box '+bgcolor+' regionSummary_"'+count+'>'+
                            '<div class="inner" style="padding:3px;overflow:hidden;">'+
                                '<div class="col-md-5 globalInfo">'+
                                    '<h3>'+dataArr[0]+'</h3>'+
                                    '<p>Global</p>'+
                                '</div>'+
                                '<div class="col-md-5 gaviInfo">'+
                                    '<h3>'+dataArr[1]+'</h3>'+
                                    '<p>Gavi</p>'+
                                '</div>'+
                            '</div>'+
                            '<div class="icon" style="font-size:55px">'+
                                '<i class="ion ion-stats-bars"></i>'+
                            '</div>'+
                            '<a href="#" class="small-box-footer">'+key+
                            '</a>'+
                        '</div>'+
                    '</div>';

        $('#overview-box-body').append(cloneHtml);
        
       
        col++;
        if(count%3 == 0){
            row++;   
            col = 1;
        }


    });
    
};

dureControl.getGaviStatusRegionCodes = function(gaviData){
   // console.log(gaviData);
    var currentYear =   iHealthMap.getCurrentyear();
    var regionCodeArr = [];
    if(gaviData != undefined)
    {
        $.each(gaviData[currentYear][0],function(regionCode,regionData){
            
            if(regionData[0][1] == "Gavi"){
                regionCodeArr.push(regionCode);
            }
            
        });        
    }
   // console.log(regionCodeArr.length);
    return regionCodeArr;
};