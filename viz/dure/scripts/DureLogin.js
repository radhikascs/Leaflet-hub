var baseURLContext = dureConfig.AppBaseURLContext; 
$("#facebook").attr("href", baseURLContext+"api/socialauth.do?id=facebook");
$("#twitter").attr("href", baseURLContext+"api/socialauth.do?id=twitter");
$("#googleplus").attr("href", baseURLContext+"api/socialauth.do?id=googleplus");

var userinfo = localStorage.getItem("userJson");
if(userinfo == null) {
	$('#login').on('click', function(){
		$('#login-modal').modal({backdrop: 'static'},'show');
	});
}

$("#user-login").submit(function(event) {
	return false;	
}).validate({

	// Specify the validation rules
	rules: {
		username: "required",
		password: {
			required: true,
			minlength: 3
		}			
	},
	
	// Specify the validation error messages
	messages: {
		username: "Please enter your user name",
		password: {
			required: "Please provide a password",
			minlength: "Your password must be at least 5 characters long"
		}							   
	},
	error: function(label) {
		$(this).addClass("error");
	},
	submitHandler: function(form) {
			
		$(this).find(':submit').attr('disabled','disabled');
		sendCORSRequest();
		/* Send the data using post and put the results in a div */
		/*$.ajax({
			url: "http://localhost/ihealth/api/authenticateUser?callback="+callback,
			type: "post",
			dataType: "jsonp",
			//contentType: 'application/json',
			data: values,
			jsonpCallback: callback,
			crossDomain: true,
			error: function(request, status, error) {
				console.log( status );
				console.log( error );
			},
			success: function(data) {
				console.log( data );
			}
		});	*/	
	}
});

$( "input" ).focusin(function() {
	$('#login-error').remove();
});

function sendCORSRequest() {
	
	var req;
	var data = new FormData();
	var username = $("#username").val();
	var password = $("#password").val();
	data.append('username', username);
	data.append('password', password);
	var encodedData = username+':'+password;
	var authorizationToken = 'Basic '+window.btoa(encodedData);
	var baseURLContext = dureConfig.AppBaseURLContext;
	if(XMLHttpRequest) {
		req = new XMLHttpRequest();																				
		req.open("POST", baseURLContext+"dataapi/authenticateiVizardUser", true);
		
		req.setRequestHeader("Authorization",authorizationToken);
		req.onreadystatechange = function() {
			if (req.readyState === 4) {
				if (req.status >= 200 && req.status < 400) {
					getLoginInfo(req.response);
				} else {
					console.log("Status", req.status +" "+req.statusText);
					var errorelement = $( "<label style='font-size: 20px; text-align: center;'>" )
										.attr( "id","login-error" )
										.addClass( "error" )
										.html( "Login not allowed to this application!" );
					$( errorelement ).insertBefore( "#usernameWrapper" );
				}
				if(req.status == 401){
					console.log("Invalid credentials");
					authorizationError();
				}
			}
		};
		req.send(data);
	
	} else if(XDomainRequest) {
		req = new XDomainRequest();
		req.open("POST", baseURLContext+"dataapi/authenticateUser");
		req.setRequestHeader("Authorization",status);
		req.onreadystatechange = function() {
			if (req.readyState === 4) {
				if (req.status >= 200 && req.status < 400) {
					getLoginInfo(req.response);
				} else {
					console.log("Status", req.status + req.statusText);
				}
				if(req.status == 401){
					console.log("Invalid credentials");
					authorizationError();
				}
			}
		};
		req.send(data);
	} else {
		errback(new Error('Error in creating CORS request'));
	}
} 
	
function authorizationError() {
	var errorelement = $( "<label style='font-size: 20px; text-align: center;'>" )
					.attr( "id","login-error" )
							.addClass( "error" )
							.html( "Invalid Credentials" );
	$( errorelement ).insertBefore( "#usernameWrapper" );
}
	
function getLoginInfo(response) {
	$.each(JSON.parse(response), function(index, element) {
		if(index == "verified" && element == true){
			//Set authorization token in api calls
			console.log(response);
			var username = $("#username").val();
			var password = $("#password").val();
			var encodedData = username+':'+password;
			var token = 'Basic '+window.btoa(encodedData);
			localStorage.setItem("authorizationToken",token);
			localStorage.setItem("userJson",response);
			localStorage.removeItem('justOnce')
			location.reload(true);
			//window.location.href = "home.html";
		} else if(index == "verified" && element == false){
			console.log("Invalid credentials");
			var errorelement = $( "<label style='font-size: 20px; text-align: center;'>" )
				.attr( "id","login-error" )
				.addClass( "error" )
				.html( "Invalid Credentials" );
			$( errorelement ).insertBefore( "#usernameWrapper" );
		}
	});
}

dureApp.checkWhetherUserLoggedIn = function() {
	var userinfo = localStorage.getItem("userJson");
	if(userinfo != null) {
		var login = $("#login");
		//login.attr("href", "#");
		login.find( "i" ).removeClass("fa-user");
		login.find( "i" ).addClass("fa-sign-out");
	} else {
		var login = $("#login");
		//login.attr("href", "login.html");
		login.find( "i" ).removeClass("fa-sign-out");
		login.find( "i" ).addClass("fa-user");
	}
};

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
		location.reload(true);
		//window.location.href = "home.html";
	}
});
// Code for login process -- end

/*** Reinitialise after loading HTML, changed for index.html ***/

// START : LoadLayout Function
	
	function loadLayout() {
    /* For demo purposes */
    var demo = $("<div data-original-title='Settings' data-toggle='modal' data-target='.userFilterLayout' />").css({
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
    }).html("<i class='fa fa-gear'></i>").addClass("no-print");

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

loadLayout();

/* Moved from DureApplicationLoadLayout.js */
// On click resets the map .
	$('.resetMap').click(function() {
		console.log(" Reset Map ");
		dMap.onResettingMap();
	});

	$('.listBtn').click(function() {
		$('.countryList').show();
		$('.regionsearch').selectpicker('show');
		$(this).hide();
	});
	
	$('.locatorList').click(function() {
		$('.countrylocatorlist').show();
        $('.countrylocatorPicker').selectpicker('show');
       // $(this).hide();	
    });
	
	$('#gavi-toggle').bootstrapToggle({
		on: 'Gavi ON',
		off: 'Gavi OFF',
		size: 'small',
		onstyle: 'success',
		offstyle: 'info'
	});

	//$('#gavi-toggle').on('change', '[type=checkbox]', function(e) {
	$(document).on('change', '#gavi-toggle', function(e) {
	//$('#gavi-toggle').on('change', 'input', function () {
	//$('#gavi-toggle').change(function() {
		console.log('Toggle: ' + $(this).prop('checked'));
		if ($(this).prop('checked') == true) {
			iHealthMap.isGaviFilterApplied = 1;
			gaviOverlays.gaviOverlay.addTo(iHealthMap.map);
			dureOverlays.showOverLayLegendGavi(); //Show gavi legend
		} else if ($(this).prop('checked') == false) {
			iHealthMap.isGaviFilterApplied = 0;
			gaviOverlays.clearOverlays();
			iHealthMap.removeLegendControl();
			iHealthMap.renderLegend(iHealthMap.legendControlData);
		}
    });
	
	$('.gaviBtn').click(function () {
/*         iHealthMap.isFilterApplied = 1;
        iHealthMap.setFilterType('region');
        iHealthMap.setFilterParam('Gavi');
        iHealthMap.setRegionFilter('Gavi');
        console.log("Loading regions");
        iHealthMap.loadLayer(); */
		iHealthMap.isGaviFilterApplied = 1;
		$('button.gaviBtn').addClass('filter-selected');
		$('button.gaviBtn').blur();
		gaviOverlays.gaviOverlay.addTo(iHealthMap.map);
		dureOverlays.showOverLayLegendGavi(); //Show gavi legend
    });

    $('.nongaviBtn').click(function () {
        iHealthMap.isFilterApplied = 1;
        iHealthMap.setFilterType('region');
        iHealthMap.setFilterParam('Non-Gavi');
        iHealthMap.setRegionFilter('Non-Gavi');
        console.log("Loading regions");
        iHealthMap.loadLayer();
    });
	
	/************************************************SECTION: EXPORT VIEW ****************************************************/

	$(".printBtn").click(function (e) {
	e.stopImmediatePropagation();
		//DureExport.getExportCallElement(this.id);
		DureExport.getExportCallElement(iHealthMap.map);
		return false;        
	});
	/********************************************** SECTION: PRINT VIEW ***************************************/

	$("#pagePrinterDirect").click(function() {
		print();
		//window.location.reload(true);
		return true;
	});

	//Reload page.
	$('.refreshPage').click(function() {
		location.reload();
	});

	// Select all option for component setting
	$('#selectall').click(function(event) {

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


var layoutSettingsObject = {};

var personalizationSettingObj = {};
	personalizationSettingObj.userEmail = "public_profile";
	
	if(!dureUtil.emailId && !dureUtil.checkIfKeyExsist('public_profile')){
		//console.log('localstorage');
		layoutSettingsObject.layout = 'vertical'; 
		layoutSettingsObject.theme = 'blue'; 
		layoutSettingsObject.component = 'all';
		layoutSettingsObject.frequency = '1';
		
		dureUtil.storeAtLocal('public_profile', layoutSettingsObject);
	}

	$('#applyUserPersonalization').on('click', function() {
		
		personalizationSettingObj.appId = dureUtil.appId;
		//var userData = JSON.parse(localStorage.getItem("userJson"));
		//var userData = dureUtil.emailId;
		
		if(dureUtil.emailId){
			//$.jStorage.deleteKey('public_profile');
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

		if(!dureUtil.emailId){
			window.location.href = "";
			//$('#body-content').load('home.html');
		}
		//window.location.href = "home.html";
    });
	
	//dureUtil.applyLayoutSettings();
	var defaultLayoutSetting;

	if(dureUtil.emailId && dureUtil.checkIfKeyExsist(dureUtil.emailId)) {

		defaultLayoutSetting = dureUtil.retrieveFromLocal(dureUtil.emailId);
		
	} else {

		defaultLayoutSetting = dureUtil.retrieveFromLocal('public_profile');
	}

	if(defaultLayoutSetting.layout == "horizontal") {

		//$('#body-content').load('home.html');
		$('head').append('<link rel="stylesheet" href="css/slick-view.css" type="text/css" />');
		$('.carousel').slick();		
	}