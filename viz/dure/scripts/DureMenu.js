var ihealthMenu ={};

ihealthMenu.createTargetMenuForSidebar = function(){

	var appObj = {};
	var sidebarMenu;	
	appObj = dureUtil.getCurrentViewKey('APPPROFILE');
	
	//console.log(appObj);
	
	sidebarMenu = ihealthMenu.buildTargetTreeViewForMenu(appObj.applications[0].targetGroups);

	applicationName = appObj.applications[0].applicationName;

	if(sidebarMenu) {
	    //$('.application-name').html("<span class='glyphicon glyphicon-asterisk'></span>&nbsp;&nbsp;" + applicationName);
		$('.sidebar-menu').append(sidebarMenu);
		$(".sidebar .treeview").tree();
	}
	
	//Enable sidebar toggle
	$("[data-toggle='offcanvas']").click(function(e) {
		//e.preventDefault();
		// iHealthChart.chart.redraw();
		// console.log(iHealthChart.chart);
		//If window is small enough, enable sidebar push menu
		if ($(window).width() <= 1025) {
			$('.row-offcanvas').toggleClass('active');
			$('.left-side').removeClass("collapse-left");
			$(".right-side").removeClass("strech");
			$('.row-offcanvas').toggleClass("relative");
		} else {
			//Else, enable content streching
			$('.row-offcanvas-left').toggleClass("active");
			$('.row-offcanvas-left').toggleClass("relative");
			$('.left-side').toggleClass("collapse-left");
			$(".right-side").toggleClass("strech");
		}
		
		$('.highchartContainer').highcharts().reflow(); 
								
		if ($('.overlaybase-chartcontainer').highcharts() != undefined) {
			$('.overlaybase-chartcontainer').highcharts().reflow(); 	
		}
		
		// Redraw chart and map if already available.
		if(dureUtil != undefined){
			dureUtil.redrawViews();
		}
	});
	
	/* Add collapse and remove events to boxes */
	$("[data-widget='collapse']").click(function() {
		//event.stopPropagation();
		//Find the box parent        
		var box = $(this).parents(".box").first();
		console.log("box");
		//Find the body and the footer
		var bf = box.find(".box-body, .box-footer");
		if (!box.hasClass("collapsed-box")) {
			box.addClass("collapsed-box");
			//Convert minus into plus
			$(this).children(".fa-minus").removeClass("fa-minus").addClass("fa-plus");
			bf.slideUp();
		} else {
			box.removeClass("collapsed-box");
			//Convert plus into minus
			$(this).children(".fa-plus").removeClass("fa-plus").addClass("fa-minus");
			bf.slideDown();
		}
	});
}

// Function stores target menu for sidebar
ihealthMenu.storeSidebarMenu = function(val){
	var key = "sidebarMenu";
	dureUtil.storeAtLocal(key,val);
}

// Function builds Target Tree view required for menu .Example of the treeview is given below.
ihealthMenu.buildTargetTreeViewForMenu = function(targetGrpObj){
	
	var targetTreeView = '';
	for(var i = 0 ; i < targetGrpObj.length; i++){
		
		//console.log(dureConfig.getUserTargetId());
		//console.log(targetGrpObj[i].targets[0].targetId);
	
		//if (targetGrpObj[i].targets[0].targetId == dureConfig.getUserTargetId()) {
			
			targetTreeView += "<li class='treeview xn-openable'>"+
									"<a href='#'>"+
										"<i class='glyphicon glyphicon-th-large'></i> <span>"+targetGrpObj[i].targetGroupName+"</span>"+
										 "<i class='fa pull-right fa-angle-left'></i>"+ 
									 "</a>";
			var targetMenu = ihealthMenu.getTargetMenuForTargetGroup(targetGrpObj[i].targets);						
			targetTreeView += targetMenu+"</li>";
		//}
	}
	//targetTreeView += '<li class="treeview"><a id="impact_studies" href="impact_studies.html"><i class="fa fa-th"></i><span>Impact Studies</span></a></li>';	
	return targetTreeView;
		
}

// Creates TARGET menus for particular Target group .
ihealthMenu.getTargetMenuForTargetGroup = function(targetObj){

	var targetMenuHtml = '<ul class="treeview-menu" style="display: none;">';
	for(var i = 0 ; i < targetObj.length; i++){
	
		/*----------------- Commented for VIEW HUB ----------------*/
		//targetMenuHtml += "<li><a href='#' style='' class='target' id=T_"+targetObj[i].targetId+"><i class='fa fa-dot-circle-o'></i>"+targetObj[i].targetName+'</a></li>';
		targetMenuHtml += '<li class="xn-openable treeview">';
		if(targetObj[i].indicators != undefined){
			targetMenuHtml += '<a href="#" style="" class="target" id=T_'+targetObj[i].targetId+'>'+
									'<i class="glyphicon glyphicon-th-list"></i> <span>' + targetObj[i].targetName + '</span><i class="fa pull-right fa-angle-left"></i>'+									
								'</a>   '+
								'<ul class="treeview-menu" style="display: none;">';	
			targetMenuHtml += ihealthMenu.getIndicatorMenuForTarget(targetObj[i].indicators);			
		}		
		targetMenuHtml += "</ul></li>";
	}
	targetMenuHtml += '</ul>';
	return targetMenuHtml;
}

// Creates INDICATOR menus for particular target menus .
ihealthMenu.getIndicatorMenuForTarget = function(indicatorObj){

	var indicatorMenuHtml = '';
	for(var i = 0 ; i < indicatorObj.length; i++){
	
		indicatorMenuHtml += '<li><a href="#" style="" class="indicator" id=I_'+indicatorObj[i].indicatorId+'><i class="fa fa-arrow-circle-right"></i>'+indicatorObj[i].indicatorName+'</a></li>';
	}	
	return indicatorMenuHtml;
}