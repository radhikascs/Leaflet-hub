var impactStudies = {};
impactStudies.isFilterApplied = 0;

impactStudies.showPopUp = function(layerFeature) {

	var isocode = layerFeature.id;

	if (dureApp.impactStudiesCountries[isocode] != undefined) {
	
		$('.impactStudiesTabList').html('');
		$('.impactStudiesTabPanel').html('');
		$('.impactStudiesTabList').scrollingTabs('destroy');
		
		impactStudies.impactStudiesHeaders = dureApp.impactStudiesHeaders;
		impactStudies.impactStudiesCountry = dureApp.impactStudiesCountries[isocode]['studyidlist'];
		
		var imageFlacCls = dureUtil.getISO_a2FromISO_a3(isocode).toLowerCase();
		
		var impactStudiesHeader = '<span class="flag ' + imageFlacCls + '" style="float:left"></span><b>&nbsp;&nbsp;&nbsp;' + layerFeature.properties.name + '</b>';
		
		$('.impactStudiesHeader').html(impactStudiesHeader);
		
		impactStudies.buildPopUp();
		
		//$('.impactStudiesTabList').scrollTabs();
		
		/* $('.impactStudiesTabList')
		.scrollingTabs()
		.on('ready.scrtabs', function() {
			$('.tab-content').show();
		}); */
		
		$('#impactStudiesModal').modal('show');	
		
		setTimeout(function(){	
			$('.impactStudiesTabList').scrollingTabs(); 
		}, 800); 
		//$('.impactStudiesTabList').scrollingTabs();
	}
}

impactStudies.buildPopUp = function() {

	var tabHeader = '', tabPanel = '', count = 0;
	
	var tabSectionData = impactStudies.impactStudiesHeaders;
	
	//var tableBody = impactStudies.createTableBody(); // Create table body
	
	$.each(tabSectionData, function(ind, obj) {
	
		//console.log(ind);
		//console.log(obj);
	
		var activeClass;
		if (count == 0) {
			activeClass = 'active';
		} else {
			activeClass = '';
		}
	
		var sectionTabLink = dureUtil.removeSpaces(dureUtil.removeSpecialCharacters(ind.toLowerCase()))+'Tab';

		tabHeader += '<li role="presentation" class="' + activeClass + '"><a href="#' + sectionTabLink + '" data-toggle="tab" aria-expanded="false">'+ ind +'</a></li>';
		
		tabPanel += '<div role="tabpanel" class="tab-pane fade ' + activeClass + ' in" id="' + sectionTabLink + '">';
		tabPanel += '<table class="table">';
		tabPanel += '<thead class="table-bordered">';
		tabPanel += '<tr>';
		tabPanel += impactStudies.createTableHeader(obj); // Create table header
		tabPanel += '</tr>';
		tabPanel += '</thead>';
		tabPanel += '<tbody class="imageAlign">';
		//tabPanel += tableBody;
		tabPanel += impactStudies.createTableBody(ind); // Create table body;
		tabPanel += '</tbody>';
		tabPanel += '</table>';
		tabPanel += '</div>';
	
		count++;
	});

	tabHeader += '<li role="presentation" class=""><a href="#extra" data-toggle="tab" aria-expanded="false"></a></li>';
	
	tabPanel += '<div role="tabpanel" class="tab-pane fade in" id="extra"></div>';
	
	$('.impactStudiesTabList').html(tabHeader);
	$('.impactStudiesTabPanel').html(tabPanel);
}

impactStudies.createTableHeader = function(tableData) {
	
	var tableHTML = '';
	
	tableHTML += '<th> Study ID</th>';
	
	$.each(tableData, function(ind, obj) {
		console.log(obj);
		tableHTML += '<th>'+ obj +'</th>';
	});
	
	return tableHTML;
}

impactStudies.createTableBody = function(tabHeading) {
	
	var tableHTML = '', tableData = impactStudies.impactStudiesCountry;
	
	//console.log(tabHeading);
	
	$.each(tableData, function(ind, obj) {
	
		//console.log(ind);
		//console.log(obj);
		tableHTML += '<tr>';
		tableHTML += '<th scope="row">'+ ind +'</th>';
		
		//console.log(obj[tabHeading]);
		var innerTable = obj[tabHeading];
		if (obj[tabHeading] != undefined) {
		
			for (var i=0; i<=innerTable.length-1; i++) {
				if (innerTable[i] != null) {
				
					if (innerTable[i] == 'Yes') {
						tableHTML += '<td><i class="fa fa-check"></i></td>';
					} else {
						tableHTML += '<td>'+ innerTable[i] +'</td>';
					}					
					
				} else {
					tableHTML += '<td></td>';
				}				
			}
		}
		tableHTML += '</tr>'
	
	});
	
	return tableHTML;
}

/*********************************** Impact Studies Filter Starts *******************************************/

impactStudies.showFilterPopUp = function() {
	
	impactStudies.buildFilterPopUp();
	setTimeout(function() {
		
		/* binding filter check box click event */
		impactStudies.bindFilterEvents();
		
		/* Apply iCheck class to the check box filter */
	
		$('#impactStudiesObjectives input').iCheck({
			checkboxClass : 'icheckbox_minimal textFix',
			radioClass : 'iradio_minimal',
			increaseArea : '20%' // optional
		});
		
	}, 300);
	
	$('#impactStudiesFilterModal').modal('show');
}

impactStudies.buildFilterPopUp = function() {

	var filterHtml = '', count = 0;
	
	var tabSectionData = dureApp.impactStudiesHeaders;
	
	//var tableBody = impactStudies.createTableBody(); // Create table body
	
	$.each(tabSectionData, function(ind, obj) {
	
		//console.log(ind);
		//console.log(obj);
	
		/* var activeClass;
		if (count == 0) {
			activeClass = 'active';
		} else {
			activeClass = '';
		} */
	
		//var sectionTabLink = dureUtil.removeSpaces(dureUtil.removeSpecialCharacters(ind.toLowerCase()))+'Tab';

		filterHtml += '<div class="panel-heading baseClassContainerMain" style="background-color:lightgray;color:#202020">' +
						'<h2 class="panel-title">' +
							'<span class="pull-left">' +
								'<input type="checkbox" class="Main topParentFilter" id="topParentFilter' + count + '" ></input> ' +
							'</span>' +
							'<a href="#filterGroupid' + count + '" data-parent="#collapsible-" class="accordion-toggle collapsed" data-toggle="collapse" style="font-weight:bold;margin-left:10px"> ' + ind + '</a>' +
						'</h2>' +
					'</div>' +
					'<div id="filterGroupid' + count + '" class="panel-collapse collapse baseFilterSubContainer">' +
						'<div class="panel-body">';
			
						$.each(obj, function(i, o) {
							//console.log(o);
							/* filterHtml += '<div class="panel-heading" style="background-color:lightgray;color:#202020">' +
											'<h2 class="panel-title">' +
												'<span class="pull-left">' +
													'<input type="checkbox" class="Main topParentFilter" id="topChildFilter' + i + '" ></input> ' +
												'</span>' +
												'<a href="#filterGroupid'+ i +'container" data-parent="#collapsible-" class="accordion-toggle collapsed" data-toggle="collapse" style="font-weight:bold;margin-left:10px"> ' + o + '</a>' +
											'</h2>' +
										'</div>'; */
										
							filterHtml += '<span>' +
											'<input type="checkbox" class="topParentFilter'+ count +' filterCheckBox" id="'+ ind +'-'+ i +'" data-color="" datacolorcode="" dataheadervalue=""  value="'+ o +'" >' + o + '</input>' +
										'</span></br>';
						});
						filterHtml += '</div>' +
					'</div>';
		count++;
	});
	
	$('#impactStudiesObjectives').html(filterHtml);
	
}
/********************* binding click event for the button on the map  *********************/
impactStudies.bindFilterEvents = function () {

/* binding check box check event for filter */

	$('.topParentFilter').on('ifChecked', function (event) {
		$('.' + this.id).iCheck('check');
	});

	$('.topParentFilter').on('ifUnchecked', function (event) {
		$('.' + this.id).iCheck('uncheck');
	});
	
	
	// Click event for apply filter button starts here
	$("#applyImpactStudiesFilter").click(function (e) {
		var filterValueArr = [];
		var checkedFilters = $('.filterCheckBox:checkbox:checked');

		$.each(checkedFilters, function (key, val) {
	
			//console.log(key);
			//console.log(val);
			console.log(val.id);
			
			var studyType = val.id.split('-');
			
			$.each(dureApp.impactStudiesCountries, function (ind, obj) {
				//console.log(ind);
				//console.log(obj['studyidlist']);
				
				$.each(obj['studyidlist'], function (i, o) {
					//console.log(i);
					//console.log(studyType);
					
					if (o[studyType[0]][studyType[1]] != null) {
					
						console.log(ind);
						console.log(i);
						console.log(o[studyType[0]][studyType[1]]);	
					}
					
				});
			});
		});
		
		
	});
	
	// Click event for clear filter button starts here
	$("#clearImpactStudiesFilter").click(function (e) {
		if (impactStudies.unsetFilter()) {
			impactStudies.clearFilterOptions();
			iHealthMap.onResettingMap();
			$('#impactStudiesFilterModal').modal('hide');

			//$('#main-filter').removeClass('filter-selected');
		}
	});
};

impactStudies.setFilter = function () {
	impactStudies.isFilterApplied = 1;
	return true;
};

impactStudies.unsetFilter = function () {
	impactStudies.isFilterApplied = 0;
	/* $('.regionsearch').selectpicker('val', ''); // Resets the selection to first option i.e blank.
	$('.regionsearch').selectpicker('hide');

	$('.countrylocatorPicker').selectpicker('val', ''); // Resets the selection to first option i.e blank.
	$('.countrylocatorPicker').selectpicker('hide');

	$('#main-filter').removeClass('filter-selected');

	$('.listBtn').show();
	return true; */
};

impactStudies.clearFilterOptions = function () {
	//iHealthMap.setFilterParam('');
	//$('.icheckbox_minimal').removeClass('checked');
	//$('.filterCheckBox:checkbox').attr("checked", false);
	//iHealthMap.createLegendOnFilter();
}

/*********************************** Impact Studies Filter Ends *******************************************/