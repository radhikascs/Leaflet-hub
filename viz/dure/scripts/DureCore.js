var dCore = {};
dCore.version = 'v0.1';

dCore.onlineStatus = function(){    
    if(navigator.onLine){
        return true;
    }else{
        return false;
    }
};


