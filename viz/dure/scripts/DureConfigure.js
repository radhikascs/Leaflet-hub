var dureConfig = {};
dureConfig.AppBaseURL = 'http://view-hub.org'
dureConfig.AppBaseURLContext = 'http://view-hub.org/service/';
dureConfig.AppBaseURLContext = 'http://view-hub.org/vhservice/';
//dureConfig.AppBaseURLContext = 'http://10.115.62.157:8080/viewhubservice/';


// In future may require it. Currently hard coded
//dureConfig.userAppId = 1;

dureConfig.encodedStrFlag = false;
dureConfig.menuIndicatorSelectFlag = false;

/****************************************** SET/GET APP ID, TARGET ID, INDICATOR ID *********************************************/

dureConfig.getParameterByName = function(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

// Set User's App id
/* dureConfig.setUserAppId = function() {
	
	var app_id = document.getElementById('applicationId');
	
	var searchString = window.location.search.substring(1);
	
	if (app_id != null) {
		dureConfig.userAppId = app_id.value;
	} else if (dureConfig.getParameterByName('appid') != '') {
		
		dureConfig.userAppId = dureConfig.getParameterByName('appid');
		
	} else {
		dureConfig.userAppId = 14;
	}
	
	return true;
} */

//Set User's App id
dureConfig.setUserAppId = function() {
      
	 var app_id = document.getElementById('applicationId');
	  
	 var searchString = window.location.search.substring(1);
	 
	// console.log("  searchString   *******  ");
	// console.log(searchString);
	 //var  encodedval  = Base64.encodecommon(searchString);
	 
	 //console.log("  searchString encoded  *******  ");
	 //console.log(encodedval);
	   
	 if (app_id != null) {
	  dureConfig.userAppId = app_id.value;
	 } else if (dureConfig.getParameterByName('appid') != '') {
	   
	  dureConfig.userAppId = dureConfig.getParameterByName('appid');             
	 } else if(searchString != undefined) {
	  
	  var  decodedVal = Base64.decodecommon(searchString);
	 
	  if(decodedVal != undefined && decodedVal !='')
	  {
	   var splitarray =  decodedVal.split("&");
	   var splitarray1 =  splitarray[0].split("=");
	   var appid = splitarray1[1];
	   //console.log("---APP ID ----");
	   //console.log(appid);
	   dureConfig.encodedStrFlag = true;
		
	   if(appid != undefined)
	   {
		dureConfig.userAppId= appid;
	   } else {
		dureConfig.userAppId = 1;
	   }
	  } else {
	   dureConfig.userAppId = 1;
	  }
	 } else {
	  dureConfig.userAppId = 1;
	 }
		  
	 return true;
}

// Gets User's App id 
dureConfig.getUserAppId = function() {

	return dureConfig.userAppId;;
}

/***************************************************************************/

// Set User's Target id
dureConfig.setUserTargetId = function(target_id) {
	
	var targetId = document.getElementById('targetId');
	
	if (targetId != null) {
		dureConfig.userTargetId = targetId.value;
	} else {
		dureConfig.userTargetId = target_id;
	}
	
	return true;
}

// Gets User's Target id 
dureConfig.getUserTargetId = function() {
	
	return dureConfig.userTargetId;
}

/***************************************************************************/

// Set User's Indicator id
dureConfig.setUserIndicatorId = function(indicator) {
 
		 var indicator_id;

		 var urlbased = false; 
		 
		 var searchString = window.location.search.substring(1);
		 
		 //console.log("searchString -     "+searchString);
		 
		 var  decodedVal = Base64.decodecommon(searchString);
		 
		 console.log("decodedVal -     "+decodedVal);
		 
		 
		  if(decodedVal != undefined  && decodedVal != "")
		  {
		   var splitarray =  decodedVal.split("&");
		   var splitarray1 =  splitarray[1].split("=");
		 //  console.log("splitarray -     "+splitarray[1]);
		   //console.log("splitarray -     "+splitarray[2]);
		   indicator_id  = parseInt(splitarray1[1]);
		 //  console.log("indicator_id -     "+indicator_id);
		  }
		  else{
		 
		   indicator_id = dureConfig.getParameterByName('indicatorid'); 
		  }
		 
		// console.log("indicator id recieved from URL - "+indicator_id);
		 if(indicator_id !=null && indicator_id!='')
		 {
		  urlbased = true;
		  dureConfig.userIndicatorId = indicator_id;
		 }
		 
		// console.log("urlbased  - "+urlbased);
		// console.log(" - dureConfig.userIndicatorId  - "+dureConfig.getUserIndicatorId());
		  if(!urlbased)
		  {
		   indicator_id  = document.getElementById('indicatorID');
		   
		   console.log("indicator id recieved from doc - "+indicator_id);
		  }
		 
		 if (indicator_id != null) {
		  
		  if(urlbased)
		  {
		   //console.log("setting in condition urlbased  - "+urlbased);
		   dureConfig.userIndicatorId = indicator_id;
		   
		  }else{
		   
		   dureConfig.userIndicatorId = indicator_id.value;
		  }
		 } else if (indicator != null) {
		  dureConfig.userIndicatorId = indicator;
		 } else {
		  dureConfig.userIndicatorId = 0;
		 }
		 
		 return true;
		}

		// Gets User's Level id 
		dureConfig.getUserIndicatorId = function() {
			
			return dureConfig.userIndicatorId;
}

/***************************************************************************/

// Set App's Level 
dureConfig.setUserAppLevel = function() {
	
	var appLevel = document.getElementById('appLevel');
	
	if (appLevel != null) {
		dureConfig.userAppLevel = appLevel.value;
	} else {
		dureConfig.userAppLevel = 'world';
	}

	return true;
}

// Gets App's Level 
dureConfig.getUserAppLevel = function() {
	
	return dureConfig.userAppLevel;
}

/***************************************************************************/
// Set User email 
dureConfig.setAdminEmail = function() {
	
	var email = document.getElementById('email');
	var userData = JSON.parse(localStorage.getItem("userJson"));
	
	if (email != null) {
		dureConfig.userAdminEmail = email.value;
	} else if (userData != null) {
		dureConfig.userAdminEmail = userData.username;
	} else {
		dureConfig.userAdminEmail = '';
	}

	return true;
}

// Gets User email 
dureConfig.getAdminEmail = function() {
	
	return dureConfig.userAdminEmail;
}

/***************************************************************************/

dureConfig.setUserOverlayId = function(){
 
 var overlay_id;

  var urlbased = false; 
  
  var searchString = window.location.search.substring(1);
  var  decodedVal = Base64.decodecommon(searchString);
  
  //console.log("decodedVal -     "+decodedVal);
  
  
   if(decodedVal != undefined  && decodedVal != ""){
    
    //console.log(decodedVal.search('overlayid'))
    if(decodedVal.search('overlayid') > -1){
     
      var splitarray =  decodedVal.split("&");
      var splitarray1 =  splitarray[2].split("=");
      //console.log("splitarray -     "+splitarray[2]);
      overlay_id  = parseInt(splitarray1[1]);
     // console.log("overlay_id -     "+overlay_id);     
    }

   }
   else{
  
    overlay_id = dureConfig.getParameterByName('overlayid'); 
   }
  
  //console.log("overlay id recieved from URL - "+overlay_id);
  if(overlay_id !=null && overlay_id!='')
  {
    urlbased = true;
    dureConfig.userOverlayId = overlay_id;
  }
  
  //console.log("urlbased  - "+urlbased);
  //console.log(" - dureConfig.userOverlayId  - "+dureConfig.getUserOverlayId());
   if(!urlbased)
   {
    overlay_id  = document.getElementById('overlayID');
    
    //console.log("overlay id recieved from doc - "+overlay_id);
   }
  
  if (overlay_id != null) {
   
    if(urlbased)
    {
    // console.log("setting in condition urlbased  - "+urlbased);
     dureConfig.userOverlayId = overlay_id;
     
    }else{
     
     dureConfig.userOverlayId = overlay_id.value;
    }
  }else {
   
  dureConfig.userOverlayId = 0;
  }
  
  return true;
}

dureConfig.getUserOverlayId = function(){
 
 return dureConfig.userOverlayId; 
}
