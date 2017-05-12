 var impactStudies = {};
impactStudies.isFilterApplied = 0;
//dureApp.impactStudiesValues= "";

impactStudies.initObj = function() {

	impactStudies.countryId = null;
	impactStudies.detailedCitationPopUpMapping = [
		{"indexNo":"0", "value":"Research title", "labelName": "Research title","orderNum":"1"},
		{"indexNo":"1", "value":"Research Description", "labelName": "Research description/details","orderNum":"2"},
		{"keyName":"Products Evaluated", "value":"Products Evaluated", "labelName": "Product(s) evaluated","orderNum":"3"},
		{"keyName":"Dosing Schedule", "value":"Dosing Schedule","labelName": "Dosing schedule(s) evaluated","orderNum":"4"},

		//{"keyName":"Dosing Schedule", "value":"Dosing Schedule","labelName": "Country immunization schedule","orderNum":"5"},

		{"keyName":"OUTCOMES", "value":"OUTCOMES","labelName": "Outcomes","orderNum":"6"},

		//{"keyName":"Serotyping", "value":"OUTCOMES","labelName": "Serotyping","orderNum":"7"},
		//{"keyName":"Serotyping", "value":"OUTCOMES","labelName": "Assessment of antibiotic resistance","orderNum":"8"},

		{"keyName":"STUDY DESIGN", "value":"STUDY DESIGN","labelName": "Study design","orderNum":"9"},
		//{"keyName":"STUDY DESIGN", "value":"STUDY DESIGN","labelName": "Availability of results","orderNum":"10"},
		{"indexNo":"2", "value":"Date of Anticipated Results","labelName": "Date of anticipated results","orderNum":"11"},
		{"indexNo":"3", "value":"Link to Results / Publication Link","labelName": "Publication links","orderNum":"12"},
		{"indexNo":"4", "value":"Contact person name","labelName": "Contact person","orderNum":"13"},
		{"indexNo":"5", "value":"Contact person email","labelName": "Contact person email","orderNum":"14"},
		//{"indexNo":"5", "value":"Contact person email","labelName": "Contact person email","orderNum":"15"},
		{"indexNo":"6", "value":"Lead organization name & details","labelName": "Lead organization","orderNum":"15"},
	];

	impactStudies.criteriaMatchedCitationsContainer;
	impactStudies.criteriaMatchedCitationsContainerMain = []
}


impactStudies.getRequestData = function(requestUrl) {
	console.log(requestUrl);
	$.ajax({
		type:'GET',
		url:requestUrl,
		dataType: 'jsonp',
		contentType: 'application/json',
		crossDomain : true,
		xhrFields: {
			withCredentials: true
		},
		username : username,
		password : password,
		error: function (request, textStatus, errorThrown) {
			
		}
	});		
}

impactStudies.getImpactStudiesData = function(resp) {
	//console.log("============================== Get Impact studies data ================================");	
	console.log(resp);
	//dureApp.impactStudiesValues = resp.impactStudies.headerobjectivelist;
	dureApp.impactStudiesHeaders = resp.impactStudies.headerobjectivelist;
	dureApp.impactStudiesCountries = resp.impactStudies.countrylist;
}


impactStudies.showPopUp = function(layerFeature) {

	impactStudies.initObj();

	impactStudies.countryId  = layerFeature.id;

	if (dureApp.impactStudiesCountries[impactStudies.countryId] != undefined) {
		var imageFlacCls = dureUtil.getISO_a2FromISO_a3(impactStudies.countryId).toLowerCase();
		var impactStudiesHeader = '<span class="flag ' + imageFlacCls + '" style="float:left"></span><b>&nbsp;&nbsp;&nbsp;' + layerFeature.properties.name + '</b>';
		$('.impactStudiesHeader').html(impactStudiesHeader);
		$('#impact-studies-modalcontent').html('');
		$('#impactStudiesModal').modal('show');
		$('#impact-studies-modalcontent').append(impactStudies.formTemplate());
		$('#row-filter-template').append(impactStudies.buildOptionSelect('impactStudies.onChangeRowFilter()', 'impact-study-rowfilter', 'Row Filter'));
		$('#coloum-filter-template').append(impactStudies.buildOptionSelect('impactStudies.onChangeColFilter()','impact-study-colfilter', 'Column Filter'));
		$('#apply-filter-template').append('<button type="button" class="btn btn-info" style="font-weight:bolder" onclick="impactStudies.applyFilter()">Apply filter</button>');
	}
    
	// remove options show only limited option 
	var eligibleFilters = ["Please Choose", "OUTCOMES", "Products Evaluated", "Dosing Schedule", "Target Population", "STUDY DESIGN", "Time Series","Results","Data Source","ADDITIONAL STUDY OBJECTIVES","HE","Meningitis","Antigen","Pneumonia"];
        //var eligibleFilters = ["Please Choose", "abc", "abcd1", "Dosing", "Target", "STUDY", "Time"];
	$("#impact-study-rowfilter option").each(function() {
		if(eligibleFilters.indexOf($(this).text()) == -1) {
			$(this).remove();
		}
	});
	$("#impact-study-colfilter option").each(function() {
		if(eligibleFilters.indexOf($(this).text()) == -1) {
			$(this).remove();
		}
	});
}

impactStudies.formTemplate = function() {
var formTempate = "";
		formTempate +=  '<form class="form-inline">'
						+'<div class="form-group" id="row-filter-template">'
						+'</div>'
						+'<div class="form-group" id="coloum-filter-template">'
						+'</div>'
						+'<div class="form-group" id="apply-filter-template">'
						+'</div>'
					    +'</form>';

  return formTempate;
}

impactStudies.buildOptionSelect = function(onChangeFunName, idName, labelName) {

	var optionSelectTemplate = null;

	if(dureApp.impactStudiesHeaders) {

		var headers = Object.keys( dureApp.impactStudiesHeaders);
		console.log(dureApp.impactStudiesHeaders);
		headers.sort();
		optionSelectTemplate = '<label>'+labelName+'</label><select  class="form-control" onChange='+onChangeFunName+' id="'+ idName +'"><option value="disabled" >Please Choose</option>';
		headers.map(function(val) {
			optionSelectTemplate += '<option value="' + val + '">' + val + '</option>';
		});
		optionSelectTemplate += '</select>';
	}

	return optionSelectTemplate;
}

impactStudies.buildCitationsOptionSelect = function(citationsKeys) {
	var citationsSelectTemplate = null;
	citationsSelectTemplate = '<select onChange="impactStudies.onChangeCitationFilter()" id="impact-study-citationsfilter"><option value="disabled" >Please Select Citation</option>';
		citationsKeys.map(function(val) {
			citationsSelectTemplate += '<option value="' + val + '">' + val + '</option>';
		});
	citationsSelectTemplate += '</select>';
	return citationsSelectTemplate;
}

impactStudies.onChangeCitationFilter = function() {
	console.log('on change citation filter');
	var citationVal = $("#impact-study-citationsfilter").val();
	if(citationVal == "disabled") return false;
	console.log(citationVal);
	var colFilterVal = $("#impact-study-colfilter").val();
	var rowFilterVal = $("#impact-study-rowfilter").val();
	$('#citation-table').remove(); // todo
	var citationTable = impactStudies.buildTable(rowFilterVal, colFilterVal, citationVal);
	$('.modalcascade').append(citationTable);
}

impactStudies.onChangeRowFilter = function() {
	console.log('on change row filter');
	impactStudies.removeFilterContent();
	$('#impact-study-colfilter option:disabled').attr("disabled", false);
	var rowVal = $("#impact-study-rowfilter").val();
	console.log(rowVal);
	$('#impact-study-colfilter option[value="'+rowVal+'"]').attr("disabled", true);

}

impactStudies.onChangeColFilter = function(value) {
	console.log('on change col filter');
	impactStudies.removeFilterContent();
	$('#impact-study-rowfilter option:disabled').attr("disabled", false);
	var colVal = $("#impact-study-colfilter").val();
	console.log(colVal);
	$('#impact-study-rowfilter option[value="'+colVal+'"]').attr("disabled", true);

}

impactStudies.applyFilter = function() {
	console.log('Filtered is applied');

	impactStudies.removeFilterContent();
	var colFilterVal = $("#impact-study-colfilter").val();
	var rowFilterVal = $("#impact-study-rowfilter").val();

	if(colFilterVal != "disabled" && rowFilterVal !="disabled") {
		var citationsKeys = Object.keys(dureApp.impactStudiesCountries[impactStudies.countryId]['studyidlist']);
		//var citationsOptionSelectTemplate = impactStudies.buildCitationsOptionSelect(citationsKeys);
		//$('.modalcascade').append(citationsOptionSelectTemplate);
		var applyAllCitations =  true;
		var table = impactStudies.buildTable(rowFilterVal, colFilterVal, citationsKeys[0],applyAllCitations);
		$('#impact-studies-modalcontent').append(table);        // todo name
	}

}


impactStudies.buildTable = function(rowFilterVal, colFilterVal, citationVal, applyAllCitations) {

	impactStudies.resetCriteriaMatchedCitations();

	var tableTemplate = '<table id="citation-table">';

	if(dureApp.impactStudiesHeaders) {
		//console.log(dureApp.impactStudiesHeaders);

		var rowHeadersVal =  dureApp.impactStudiesHeaders[rowFilterVal];
		var colHeadersVal = dureApp.impactStudiesHeaders[colFilterVal];

		tableTemplate += '<tr><td rowspan="2">Outcomes/Product</td></tr>';
		tableTemplate += '<tr>';
		for(var i = 0; i < colHeadersVal.length; i++) {
			tableTemplate +='<th scope="col">'+colHeadersVal[i]+'</th>'
		}
		tableTemplate += '</tr>';

		if(applyAllCitations) {
			tableTemplate += impactStudies.iterateOnCitations(rowFilterVal, colFilterVal, rowHeadersVal, colHeadersVal);
		} else {
			tableTemplate += impactStudies.iterateOnIndividualCitation(rowFilterVal, colFilterVal, rowHeadersVal, citationVal);
		}
	}

	tableTemplate += '</table>';

	return tableTemplate;
}


impactStudies.iterateOnIndividualCitation = function(rowFilterVal, colFilterVal, rowHeadersVal, citationVal) {
	// todo check for country
	var trTemplate = '';
	var citationsObj = dureApp.impactStudiesCountries[impactStudies.countryId]['studyidlist'];

	//for(var i in citationsObj) {

		var citationsRowValues = citationsObj[citationVal][rowFilterVal];
		var citationsColValues = citationsObj[citationVal][colFilterVal];

		for(var j = 0; j < rowHeadersVal.length; j++) {
			trTemplate += '<tr><th scope="row">'+rowHeadersVal[j]+'</th>';
			trTemplate += '';
			for(var k = 0; k < citationsColValues.length; k++) {
				var rowVal = citationsRowValues[j];
				var colVal = citationsColValues[k];
				if( rowVal == "Yes" && colVal == "Yes") {
					trTemplate += '<td onclick="impactStudies.onClickCriteriaMatch()"><i class="fa fa-check"></i></td>';
				} else {
					trTemplate += '<td></td>';
				}
			}
			trTemplate += '</tr>';
		}

		//return false;
	//}

	return trTemplate;
}


impactStudies.iterateOnCitations = function(rowFilterVal, colFilterVal, rowHeadersVal, colHeadersVal) {
	// todo check for country
	var trTemplate = '';
	var citationsObj = dureApp.impactStudiesCountries[impactStudies.countryId]['studyidlist'];
	for(var j = 0; j < rowHeadersVal.length; j++) {
		trTemplate += '<tr><th scope="row">'+rowHeadersVal[j]+'</th>';
		trTemplate += '';

		for(var k = 0; k < colHeadersVal.length; k++) {
			var criteriaMatch = '<td></td>';
			var test = [];
			for(var m in citationsObj) {
				var citationsRowValues = citationsObj[m][rowFilterVal];
				var citationsColValues = citationsObj[m][colFilterVal];
				var rowVal = citationsRowValues[j];
				var colVal = citationsColValues[k];
				if( rowVal == "Yes" && colVal == "Yes") {
					var uniquieTdId = k + "-" + j;//dureUtil.removeSpaces(k +" j);
					test.push(m);

					impactStudies.setCriteriaMatchedCitations({'uniquieTdId':uniquieTdId, 'citationName':m,'citationData':citationsObj[m] });

					criteriaMatch = '<td  onclick="impactStudies.onClickCriteriaMatch(\''+uniquieTdId+'\')"	><i class="fa fa-check"></i></td>';
				}
			}
			//console.log(test);
			trTemplate += criteriaMatch;
		}

		trTemplate += '</tr>';
	}

	return trTemplate;
}


impactStudies.removeFilterContent = function() {
	$('#citation-table').remove();
	$("#impact-study-citationsfilter").remove();
}

impactStudies.addFilter = function () {
    
}

impactStudies.unsetFilter = function () {
	impactStudies.isFilterApplied = 0;
}


//****** On click Criteria match show popup *******//

impactStudies.onClickCriteriaMatch = function(id) {
	var uniquieTdId = id; //console.log(e);
	var citationsContainer = impactStudies.getCriteriaMatchedCitationsMain();
	impactStudies.criteriaMatchedCitationsContainer = citationsContainer.filter(function(e) {
		if(e['uniquieTdId'] == uniquieTdId){
			console.log(uniquieTdId);
			return e;
		}
	});
	$('#detailed-citations-popup').modal('show');

	//$("#home").append(citationTemplate);
	impactStudies.renderCitationTemplates();
}


impactStudies.renderCitationTemplates = function() {
	$("#selected-citations-only").html('');
	var htmlTemplate = '';
	var collapseList = '<ul class="list-unstyled" style="max-height: 605px;    overflow-y: auto;">';
	var collapseContent = '';
	var citationTemplateData = impactStudies.createDataForDetailedCitations();
	//var citationTemplate = impactStudies.buildCitationDetailedTableTemplate(citationTemplateData[0]);
	console.log(citationTemplateData);
	htmlTemplate += '<div class="container">'
				 +  '<div class="row">'
				 +	'<div class="col-md-2" id="citation-collapseList"><span><h3>Citation Name</h3></span></div>'
				 +	'<div class="col-md-10" id="citation-collapseContent"><h3>Citation Details <a id="download-citation-details" href="#" data-toggle="tooltip" title="Download Details!"><i class="cursor-pointer fa fa-download" aria-hidden="true"></i></a></h3> </div>'
				 +	'</div>'
				 + '</div>';


	citationTemplateData.map(function(val, index) {
		var id = dureUtil.removeSpaces(val[0]['value']);
		collapseList += '<li><a href="#citation-detailed-'+ id + '" data-toggle="collapse">' + val[0]['value'] + '</a></li>';

		collapseContent += '<div id="citation-detailed-'+ id + '" class="collapse"> ';
		collapseContent	+=	impactStudies.buildCitationDetailedTableTemplate(val);
		collapseContent	+=	'</div>';
	});
	collapseList += '</ul>';
	$("#selected-citations-only").append(htmlTemplate);
	$("#citation-collapseList").append(collapseList);
	$("#citation-collapseContent").append(collapseContent);
	
	setTimeout(function() {
		$($("#citation-collapseList ul li a")[0]).trigger('click');           // by default open
	}, 500);

	impactStudies.bindCollapseEvent();// show only one citation details
	impactStudies.bindTooptip();         // bind bootstrap tooltip
	impactStudies.highLightSelectedItem(); // highlight selected item
	impactStudies.downloadCitationDetails();
	impactStudies.downloadAllCitations(citationTemplateData);

}

impactStudies.resetCriteriaMatchedCitations = function() {
	impactStudies.criteriaMatchedCitationsContainerMain = [];
}

impactStudies.setCriteriaMatchedCitations = function(CitationObj) {
	impactStudies.criteriaMatchedCitationsContainerMain.push(CitationObj);
}

impactStudies.getCriteriaMatchedCitationsMain = function() {
	return impactStudies.criteriaMatchedCitationsContainerMain;
}

impactStudies.getCriteriaMatchedCitations = function() {
	return impactStudies.criteriaMatchedCitationsContainer;
}

impactStudies.createDataForDetailedCitations = function() {
	// HardCode - labels not comming

	var returnCitaioCitationsInfo = [];
	var citationsContainer = impactStudies.getCriteriaMatchedCitations();
	citationsContainer.map(function(citationObj) {

		var citationInfo = [];
		var citationID = {'labelName':'Citation ID', 'value':citationObj['citationName']};
		citationInfo.push(citationID);
		for(var k = 0; k < impactStudies.detailedCitationPopUpMapping.length; k++) {
			var citationDetails = {'labelName':'', 'value':''};
			var mapping = impactStudies.detailedCitationPopUpMapping[k];

			if(mapping.hasOwnProperty('indexNo')) {

				citationDetails['labelName'] =  mapping['labelName'];
				citationDetails['value'] = citationObj['citationData']['Research Publication Info'][mapping['indexNo']];

			} else if(mapping.hasOwnProperty('keyName')) {

				var values = [];
				citationDetails['labelName'] =  mapping['labelName'];
				var singleCitationData = citationObj['citationData'][mapping['keyName']];
				console.log(dureApp.impactStudiesHeaders);
				var headerLabels = dureApp.impactStudiesHeaders[mapping['keyName']];
				headerLabels.map(function(indexVal, indexNum) {
					if(singleCitationData[indexNum] == 'Yes'){
						values.push(indexVal);
					}
				});

				citationDetails['value'] = values.join(',');
			}
			citationInfo.push(citationDetails);
		}

		returnCitaioCitationsInfo.push(citationInfo);
	});

	return returnCitaioCitationsInfo;
}

impactStudies.buildCitationDetailedTableTemplate = function(tableTemplateData) {
	var tableTemplate = '<div class="table-responsive"><table   class="table table-bordered table-hover">';

	for(var i in tableTemplateData) {
		tableTemplate += '<tr>'
					  +	'<td>' + tableTemplateData[i]['labelName'] + '</td>'
					  +	'<td>' + tableTemplateData[i]['value'] + '</td>'
					  +	'</tr>';
	}

	tableTemplate +=  "</table></div>";
	return tableTemplate;
}


// download citation details
impactStudies.downloadCitationDetails = function() {
	$( "#download-citation-details").unbind( "click" );
	$("#download-citation-details").on('click', function() {
		var fileName = $("#citation-collapseContent .in table td").eq(1).text();
		$("#citation-collapseContent .in table").tableExport({escape:'false',  tableName:'Impact_study_' + fileName});
	});
}


// download all citation data for selected
impactStudies.downloadAllCitations = function(citationsData) {
	$( "#download-all-citations").unbind( "click" );
	var formatData = citationsData.map(function(e) { return e.reduce(function(a, b) { a[b['labelName']]  = b['value'];  return a;},{})});
	$("#download-all-citations").on('click', function() {

			var data = formatData;
			var fileName = "Impact_Study"
			var csvData = ConvertToCSV(data,fileName , true);
			var a = document.createElement("a");
			a.setAttribute('style', 'display:none;');
			document.body.appendChild(a);
			var blob = new Blob([csvData], { type: 'text/csv' });
			let url = window.URL.createObjectURL(blob);
			a.href = url;
			a.download = fileName + "_" + Date.now() + ".csv";
			a.click();

	});
}


// Collapse
impactStudies.bindCollapseEvent = function() {
	
	var lanopt = $("#citation-collapseContent");
	lanopt.on("show.bs.collapse",".collapse", function(){
	   lanopt.find(".collapse.in").collapse("hide");
	});

}

// bindTooltip

impactStudies.bindTooptip = function() {
	 $('#citation-collapseContent [data-toggle="tooltip"]').tooltip();
}


impactStudies.highLightSelectedItem = function() {
	$("#citation-collapseList a").on('click', function(e) {
		$("#citation-collapseList a").each(function() {$(this).removeClass('hightlight-selected') });
		$(this).addClass("hightlight-selected");
	});
}

impactStudies.renderCitations = function () {
    var legend = {};
	

    
}

// utility

function ConvertToCSV(JSONData, ReportTitle, ShowLabel ) {
    //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
    let arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;

    let CSV = '';
    //Set Report title in first row or line

    CSV += ReportTitle + '\r\n\n';

    //This condition will generate the Label/Header
    if (ShowLabel) {
        let row = "";

        //This loop will extract the label from 1st index of on array
        for (let index in arrData[0]) {

            //Now convert each value to string and comma-seprated
            row += index + ',';
        }

        row = row.slice(0, -1);

        //append Label row with line break
        CSV += row + '\r\n';
    }

    //1st loop is to extract each row
    for (let i = 0; i < arrData.length; i++) {
        let row = "";

        //2nd loop will extract each column and convert it in string comma-seprated
        for (var index in arrData[i]) {
            row += '"' + arrData[i][index] + '",';
        }

        row.slice(0, row.length - 1);

        //add a line break after each row
        CSV += row + '\r\n';
    }

    if (CSV == '') {
        alert("Invalid data");
        return;
    }

    return CSV;
  }

