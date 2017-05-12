
head.ready(function(){

dureApp.userPersionalizationSetting = function() {

	var layoutSettingsObject = {};

    var personalizationSettingObj = {};
        personalizationSettingObj.userEmail = "public_profile";
		
		if(!dureUtil.emailId && !dureUtil.checkIfKeyExsist('public_profile')){
			//console.log('localstorage');
			layoutSettingsObject.layout = 'vertical'; 
			layoutSettingsObject.theme = 'blue'; 
			layoutSettingsObject.component = 'all';
			layoutSettingsObject.frequency = '7';
			
			dureUtil.storeAtLocal('public_profile', layoutSettingsObject);
		}
		
   // On click Apply
    $('#applyUserPersonalization').on('click', function(){
		
		personalizationSettingObj.appId = dureUtil.appId;
		//var userData = JSON.parse(localStorage.getItem("userJson"));
		//var userData = dureUtil.emailId;
		
		if(dureUtil.emailId){
			$.jStorage.deleteKey('public_profile');
			personalizationSettingObj.userEmail = dureUtil.emailId;
			//personalizationSettingObj.frequencyVal = $('#frequencyOptionContainer input:checked').val();
		} else {
			personalizationSettingObj.userEmail = "public_profile";
			//personalizationSettingObj.frequencyVal = $('#frequencyOptionContainer input:checked').val();
		}
		
		personalizationSettingObj.frequencyVal = $('#frequencyOptionContainer input:checked').val();
		
        var layoutSetting = {
            value: $('#layoutOptionContainer input:checked').val(),
            id: 1
        };
        
        var themeSetting = {
            value: $('#themeOptionContainer input:checked').val(), 
            id: 2
        };

        var componentSetting = {
            value: '',
            id: 3,
            valueContainer: [],
            getValues: function() {
                    var that = this;
                    $('#compontentOptionContainer  input:checked').each(function(key, value){
                    
                        if($(this).val() == 'all') {
                            that.valueContainer = [];
                            that.valueContainer.push($(this).val())
                            return false;           
                        } else {
                            that.valueContainer.push($(this).val())
                        }  
                    });
                    //console.log(that.valueContainer);
                    return that.valueContainer;
            }
        };
		
		layoutSettingsObject.layout = layoutSetting.value; 
		layoutSettingsObject.theme = themeSetting.value; 
		layoutSettingsObject.component = componentSetting.getValues();
		layoutSettingsObject.frequency = personalizationSettingObj.frequencyVal;

		//console.log(layoutSettingsObject);
		//console.log(personalizationSettingObj);
		
		dureUtil.storeAtLocal(personalizationSettingObj.userEmail, layoutSettingsObject);
			
		if(dureUtil.emailId){
			
			dureApp.updateUserPersonalizationSetting(personalizationSettingObj, layoutSetting, themeSetting);
			
			//dureApp.updateUserPersonalizationSetting(personalizationSettingObj, layoutSetting);
			//dureApp.updateUserPersonalizationSetting(personalizationSettingObj, themeSetting);
			//dureApp.updateUserPersonalizationSetting(personalizationSettingObj, componentSetting);
		}


		window.location.href = "home.html";
    });	

	//dureUtil.syncPersonalLayoutSettings();
	
}

dureApp.userPersionalizationSetting();
//var userData = JSON.parse(localStorage.getItem("userJson"));
var defaultLayoutSetting;

if(dureUtil.emailId && dureUtil.checkIfKeyExsist(dureUtil.emailId)) {

	defaultLayoutSetting = dureUtil.retrieveFromLocal(dureUtil.emailId);
	
} else {

	defaultLayoutSetting = dureUtil.retrieveFromLocal('public_profile');
}

//console.log(defaultLayoutSetting);

if(defaultLayoutSetting.layout == "horizontal"){

$('head').append('<link rel="stylesheet" href="css/slick-view.css" type="text/css" />');
$('.carousel').slick();		
}

/* if(defaultLayoutSetting.layout == "tab"){
	window.location.href = "tab.html";
} */

// Update template theme

dureApp.setTheme = function(theme) {
 var themeObj = {color:'blue', prefix:'skin'};
 if(theme) {
  themeObj.color = theme;
  $("body").removeClass("skin-blue skin-black skin-themeblue skin-red skin-green");
  $("body").addClass(themeObj.prefix + '-' + themeObj.color);
  //$("body").addClass(themeObj.prefix + '-black');
 }
}

//dureApp.setTheme(defaultLayoutSetting.theme);          // Change the color of theme seleted by the user

dureApp.checkWhetherUserLoggedIn = function(){
	var userinfo = localStorage.getItem("userJson");
	if(userinfo != null){
		var login = $("#login");
		login.attr("href", "#");
		login.find( "i" ).removeClass("fa-user");
		login.find( "i" ).addClass("fa-sign-out");
	} else {
		var login = $("#login");
		login.attr("href", "login.html");
		login.find( "i" ).removeClass("fa-sign-out");
		login.find( "i" ).addClass("fa-user");
	}
};

dureApp.setUserRoleId = function(){
	var userinfo = localStorage.getItem("userJson");
	if(userinfo != null){
		//set roleid 
		$.each(JSON.parse(userinfo), function(index, element) {
			if(index == "roleid"){
				dureUtil.setRoleId(element);
			}
		});
	} 
};
// START : LoadLayout Function
	
	function loadLayout() {
    /* For demo purposes */
    var demo = $("<div />").css({
        position: "fixed",
        top: "45px",
        right: "0",
        background: "rgba(0, 0, 0, 0.7)",
        "border-radius": "5px 0px 0px 5px",
        padding: "6px 15px",
        "font-size": "16px",
        "z-index": "999999",
        cursor: "pointer",
        color: "#ddd"
    }).html("<i class='fa fa-gear' data-original-title='Settings' data-toggle='modal' data-target='.userFilterLayout'></i>").addClass("no-print");

    var demo_settings = $("<div />").css({
        "padding": "10px",
        position: "fixed",
        top: "34px",
        right: "-200px",
        background: "#fff",
        border: "3px solid rgba(0, 0, 0, 0.7)",
        "width": "200px",
        "z-index": "999999"
    }).addClass("no-print");
    demo_settings.append(
        "<h4 style='margin: 0 0 5px 0; border-bottom: 1px dashed #ddd; padding-bottom: 3px;'>Layout Options</h4>" + "<div class='form-group no-margin'>" + "<div class='.checkbox'>" + "<label>" + "<input type='checkbox' name='fixlayoutBtn'/> " + "Fixed layout" + "</label>" + "</div>" + "</div>"
    );
    demo_settings.append(
        "<h4 style='margin: 0 0 5px 0; border-bottom: 1px dashed #ddd; padding-bottom: 3px;'>Skins</h4>" + "<div class='form-group no-margin'>" + "<div class='.radio'>" + "<label>" + "<input name='skins' type='radio' data-skin = 'skin-black' onchange='change_skin(\"skin-black\")' /> " + "Black" + "</label>" + "</div>" + "</div>"

        + "<div class='form-group no-margin'>" + "<div class='.radio'>" + "<label>" + "<input name='skins' type='radio' data-skin = 'skin-blue' onchange='change_skin(\"skin-blue\");' checked='checked'/> " + "Blue" + "</label>" + "</div>" + "</div>" 
		
		+ "<div class='form-group no-margin'>" + "<div class='.radio'>" + "<label>" + "<input name='skins' type='radio' data-skin = 'skin-green' onchange='change_skin(\"skin-green\");'/> " + "Green" + "</label>" + "</div>" + "</div>" 

        // + "<div class='form-group no-margin'>" + "<div class='.radio'>" + "<label>" + "<input name='skins' type='radio' data-skin = 'skin-themeblue' onchange='change_skin(\"skin-blue\");' /> " + "Aqua blue" + "</label>" + "</div>" + "</div>"

        + "<div class='form-group no-margin'>" + "<div class='.radio'>" + "<label>" + "<input name='skins' type='radio' data-skin = 'skin-red'  /> " + "Red" + "</label>" + "</div>" + "</div>"
    );

    demo.click(function() {
        if (!$(this).hasClass("open")) {
            //$(this).css("right", "200px");
            //demo_settings.css("right", "0");
            $(this).addClass("open");
        } else {
            //$(this).css("right", "0");
            //demo_settings.css("right", "-200px");
            $(this).removeClass("open")
        }
    });

    $("body").append(demo);
    //$("body").append(demo_settings);

}

// $(".

function change_layout() {
    $("body").toggleClass("fixed");
    fix_sidebar();
}

function change_skin(cls) {
	alert("skins")
    $("body").removeClass("skin-blue skin-black skin-themeblue skin-red skin-green");
    $("body").addClass(cls);
}




$(document).ready(function() {

    $('input[type="checkbox"][name="fixlayoutBtn"]').on('ifChanged', function(event) {
        //alert(0);
        $("body").toggleClass("fixed");
        fix_sidebar();

    });

    $('input[type="radio"][name="skins"]').on('ifChanged', function(event) {

    	$("body").removeClass("skin-blue skin-black skin-themeblue skin-red skin-green");
    	$("body").addClass($(this)[0].attributes[2].value);
      
    	//console.log($(this)[0].attributes[2].value);  

    });


})
	
	// END : LoadLayout Function
	
	$(document).ajaxStart($.blockUI).ajaxStop($.unblockUI);
	// Code for login process -- start
	dureApp.checkWhetherUserLoggedIn();
	$('#login').click(function() {
		
		var userinfo = localStorage.getItem("userJson");
        //console.log(userinfo);
        if(userinfo != null){
			var authToken = localStorage.getItem("authorizationToken");
			//Code to logout user using cors logout api.
			var userData = JSON.parse(localStorage.getItem("userJson"));
			
			$.jStorage.deleteKey(userData.username); // Remove Local storage of user layout setting
			
			localStorage.removeItem("userJson");
			localStorage.removeItem("authorizationToken");
			
			//setting default guest user role id.
			dureUtil.setRoleId(1);
			//dureApp.logoutUser(authToken);
			window.location.href = "home.html";
		}
	});
	// Code for login process -- end

    loadLayout();
    dureUtil.initialize();
	dureApp.setUserRoleId();
	console.log("RoleId: "+dureUtil.roleId);
    // On click changes the data for the TARGET selected by the user from sidebar.
    // $(document).on('click','.target',function(){
        // var check;
        // var targetId = $(this).attr('id');
        // var res = targetId.split("_");
        // var target_id = parseInt(res[1]);
        // var targetFlag = false;
        // targetFlag = dureUtil.setTargetId(target_id);
        // dureUtil.setCurrentView(targetId);        // sHONE COMMENTED HERE TO TEST
        // if(targetFlag){
            // iHealthMap.clearMap();
            // check = dureApp.getRegionDataForTarget(target_id);
            // if(check){
                // console.log("Inside check data");
                // dMap.renderInfoForMap();
                // $('.targetTitle').html($(this).text());
                // $('.targetTitleOnChart').html($(this).text());
                // $('.targetTitleOnMap').html($(this).text());

            // }
        // }
    // });

    // To make the header of embeded popup box collapsible.
    $(document).on('click','.collapsibleHeader',function(){
        console.log("Inside the embed header.");
        //Find the box parent
        var box = $(this).parents(".box").first();
        //Find the body and the footer
        var bf = box.find(".box-body, .box-footer");
        if (!box.hasClass("collapsed-box")) {
            box.addClass("collapsed-box");
            //Convert minus into plus
            $(this).find(".fa-minus").removeClass("fa-minus").addClass("fa-plus");
            bf.slideUp();
        } else {
            box.removeClass("collapsed-box");
            //Convert plus into minus
            $(this).find(".fa-plus").removeClass("fa-plus").addClass("fa-minus");
            bf.slideDown();
        }
    });
	
	/* NEW CLICK EVENT FOR THE INDICATOR LINK IN SIDE MENU ADDED FOR THE BREADCRUMP */
/* NEW CLICK EVENT STARTS HERE */


/* NEW CLICK EVENT ENDS HERE */

/* creating defalut breadcrump */

    $(document).ready(function(){
	   
/* 	  var $bc = $('<li class="item"></li>');
       $('.breadcrumb').html($bc.prepend('<a href="#"><i class="fa fa-th"></i> Home</a> <a href="#"><i class="fa fa-angle-double-right"></i> '+$('.sidebar-menu li a span').eq(1).text()+'</a> <a href="#"><i class="fa fa-angle-double-right"></i>'+ $('.sidebar-menu li ul li a').eq(0).text() +'</a> <a href="#"><i class="fa fa-angle-double-right"></i><b>'+ $('.sidebar-menu li ul li ul li a').eq(0).text() +'</b></a>')); */

    })
/* creating default breadcrump */

    // On click resets the map .
    $('.resetMap').click(function(){
        console.log(" Reset Map ");
        dMap.onResettingMap();
    });


    $('.listBtn').click(function(){
        $('.countryList').show();
        $('.regionsearch').selectpicker('show');
        $(this).hide();
    });

    /************************************************SECTION: EXPORT VIEW ****************************************************/

  $(".printBtn").click(function (e) {
		DureExport.getExportCallElement(this.id);
        return false;        
    });
    /********************************************** SECTION: PRINT VIEW ***************************************/


     $("#pagePrinterDirect").click(function(){

		print();
		//window.location.reload(true);
		return true;
    });
	
	//Reload page.
	$('.refreshPage').click(function(){
		location.reload();
	});

    // END OF HEAD
});

// Get REGION-DATA for the selected target so data can be used to displayed wherever required.
dureApp.getRegionDataForTarget = function(target_id){
    console.log(target_id);
    console.log(dureUtil.checkKeyForTarget(target_id));

    dureUtil.checkUserAuthentication();
    return true;

    //Nath commented here DEMO
/*     if(dureUtil.checkKeyForTarget(target_id) == false){

        dureUtil.checkUserAuthentication();
        return    false;
    }else{
        return true;
    } */
};

// Displays dialog box to show message 
dureApp.showDialog = function(message,type){
	
	if(type == 'info'){		
		jNotify(message,{TimeShown:5000});
	}else if(type == 'error'){
		jError(message,{TimeShown:5000});
	}else if(type == 'success'){
		jSuccess(message,{TimeShown:5000});
	}
};

//   ********************************* Personalization Settings  ************************************* //

dureApp.updateUserPersonalizationSetting = function(personalizationSettingObj, layoutSetting, themeSetting) {
	
	//alert('updateUserPersonalizationSetting');
	//console.log(personalizationSettingObj);
	// components currently is all // TODO
var requestObj = {};
    requestObj.username = 'TIRSP';
    requestObj.password = 'Tirsp111';
    requestObj.callbkStr = '&callback=ux.personalizationUpdate';
    requestObj.serviceUrl = dureUtil.AppBaseURLContext +'personalization/update/?' 
                         +  'email=' + personalizationSettingObj.userEmail
                         +  '&appid=' + dureUtil.appId
                         +  '&theme=' + themeSetting.value
                         +  '&layout=' + layoutSetting.value
                         +  '&component=all'
                         +  '&frequency=' + personalizationSettingObj.frequencyVal                        
                         +   requestObj.callbkStr;
   

$.ajax({
        type:'Get',
        url:requestObj.serviceUrl,
        contentType: 'application/json',
        dataType: 'jsonp',
        crossDomain : true,
        xhrFields: {
            withCredentials: true
        },
        username : requestObj.username,
        password :requestObj.password,
        success: function(success){
           // console.log(success);
        },
        error: function (request, textStatus, errorThrown) {
           // console.log(errorThrown);
        }
    }); 

}

var ux = {};

// callback for Personalization Settings
ux.personalizationUpdate = function(response) {

    if(response.status == 'success'){
        window.location.href = 'home.html';
    }
}

// callback for Personalization Settings
function personalizationUpdate(response) {
    console.log(response);
}

// Select all option for component setting
$(document).ready(function() {
   
    $('#selectall').click(function(event){

         if(this.checked) { // check select status
            $('.singleselection').each(function() { //loop through each checkbox
                this.checked = true;  //select all checkboxes with class "checkbox1"               
            });
        }else{
            $('.singleselection').each(function() { //loop through each checkbox
                this.checked = false; //deselect all checkboxes with class "checkbox1"                       
            });         
        }
              
    });

    $('.singleselection').click(function(event) {           // if single selection cliked then uncheck select all

        $('#selectall').attr("checked", false);
       
    });  
	

});
