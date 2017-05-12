var dTable = {};

dTable.load = function(){
	// console.log("Initializing Table.");
	iHealthTable.initialize();
};

dTable.setLevel = function(level){
	dTable.level = level;
}

dTable.getLevel = function(){
	return dTable.level;
}

