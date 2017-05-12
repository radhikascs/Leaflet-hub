var ihealthMenu ={};

ihealthMenu.createTargetMenuForSidebar = function(){

	var appObj = {};
	var sidebarMenu;	
	appObj = dureUtil.getCurrentViewKey('APPPROFILE');
	
	//console.log(appObj);
	
	sidebarMenu = ihealthMenu.buildTargetTreeViewForMenu(appObj.applications[0].targetGroups);	
	
	if(sidebarMenu) {
		$('.sidebar-menu').append(sidebarMenu);
		x_navigation();
	}

	//$(document).on('click','.sidebar-menu a',function(){
	$('.indicator').on('click', function() {
		
    var $this = $(this),
	$bc = $('<li class="item"></li>');        
	
	if($this.hasClass('indicator')){

		dureApp.titleObj = $(this);
		//if(event == undefined){
		//	event = window.event;
		//}
		//event.stopPropagation();
		iHealthMap.unsetFilter();
		$.noty.closeAll();
		resetOverLayContainer();
		var check,targetId,target_id,targetRes,indicatorRes,indicatorId;
		indicatorId = $(this).attr('id');
		/*----------------- Commented for VIEW HUB ----------------*/
		//targetId = $(this).parents('.treeview').first().siblings('li').find('.target').attr('id');
		targetId = $(this).parents('.treeview').first().find('.target').attr('id');
		console.log(targetId);
		targetRes = targetId.split("_");
		indicatorRes = indicatorId.split("_");
		dureUtil.setIndicatorMenuId(indicatorId)
		target_flag = dureUtil.setTargetId(parseInt(targetRes[1]));
		indicator_flag = dureUtil.setIndicatorId(parseInt(indicatorRes[1]));
		console.log(indicator_flag);
		dureUtil.setIndicatorYearLimits(dureUtil.appProfile.indicatorMinMaxYear);

		if(indicator_flag){
			//console.log("Data Level == ");
			console.log(dureUtil.getDataLevel());
			// Fix Me :(
			dureUtil.setDataLevel('world');
			dMap.setLevel('world');
			
			if(dureUtil.getDataLevel() == 'world'){
				dMap.setLevel('world');
				iHealthMap.map.setView(new L.LatLng(iHealthMap._lat,iHealthMap._long), 2);
				dureUtil.getWorldIndicatorData();
                
			}else{
				dMap.setLevel('country');
				dureUtil.getIndicatorData(); 
			}
		}
		
		$this.parents('li').each(function(n, li) {
			var $a = $(li).children('a').clone();
            
			if(n == 0){
                $bc.prepend(' <a href="#"><i class="fa fa-angle-double-right"></i><b>' + $a.eq(0).text() + '</b></a> ');
            }else{
               $bc.prepend(' <a href="#"><i class="fa fa-angle-double-right"></i>' + $a.eq(0).text() + '</a> ');   
            }
            
        });
        $('.breadcrumb').html($bc.prepend('<a href="#"> Home</a>'));
		
	}else{
	
		$this.parents('li').each(function(n, li) {
			var $a = $(li).children('a').clone();
			//$bc.prepend(' <a href="#"><i class="fa fa-angle-double-right"></i></a> ', $a.eq(0).text());
				
			if(n == 0){
				$bc.prepend(' <a href="#"><i class="fa fa-angle-double-right"></i><b>' + $a.eq(0).text()+ '</b></a> ');
			}else{
				$bc.prepend(' <a href="#"><i class="fa fa-angle-double-right"></i>' + $a.eq(0).text() + '</a> '); 
			}
            
        });
        $('.breadcrumb').html($bc.prepend('<a href="#"><i class="fa fa-th"></i> Home</a>'));
	}	
	return false;	
});
}

// Function stores target menu for sidebar
ihealthMenu.storeSidebarMenu = function(val){
	var key = "sidebarMenu";
	dureUtil.storeAtLocal(key,val);
}

/* Tree for tab view */
// Function builds Target Tree view required for menu .Example of the treeview is given below.
ihealthMenu.buildTargetTreeViewForMenu = function(targetGrpObj){
	
	var targetTreeView = '';
	for(var i = 0 ; i < targetGrpObj.length; i++){
		
		//if (targetGrpObj[i].targets[0].targetId == dureConfig.getUserTargetId()) {
		
			targetTreeView += "<li class='xn-openable treeview'>"+
									"<a href='#'>"+
										"<i class='fa fa-th'></i> <span class='xn-text'>"+targetGrpObj[i].targetGroupName+"</span>"+										
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

	var targetMenuHtml = '<ul>';
	for(var i = 0 ; i < targetObj.length; i++){
	
		/*----------------- Commented for VIEW HUB ----------------*/
		//targetMenuHtml += "<li><a href='#' style='' class='target' id=T_"+targetObj[i].targetId+"><i class='fa fa-dot-circle-o'></i>"+targetObj[i].targetName+'</a></li>';
		targetMenuHtml += '<li class="xn-openable treeview">';
		if(targetObj[i].indicators != undefined){
			targetMenuHtml += '<a href="#" style="" class="target" id=T_'+targetObj[i].targetId+'>'+
									'<i class="glyphicon glyphicon-th-list"></i> <span>' + targetObj[i].targetName + '</span>'+
									/* '<span class="fa fa-info-circle"></span> Indicators'+ */
									/* '<i class="fa pull-right fa-angle-left"></i>'+ */
									/* '<span class="fa"></span>'+ */
								'</a>'+
								'<ul>';	
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
