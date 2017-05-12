// On Load Tour Guide
/*$(document).ready(function() {
	$('#joyRideTipContent').joyride({
		autoStart : true,					  
		modal:true,			
		expose: true
	});
	
	$(".x-navigation-minimize").click(function(){
		setTimeout(function(){ 	iHealthMap.map.invalidateSize(); 
								$('.highchartContainer').highcharts().reflow(); 
								
								if ($('.overlaybase-chartcontainer').highcharts() != undefined) {
									$('.overlaybase-chartcontainer').highcharts().reflow(); 	
								}								
		}, 800);   //  map tiles render properly
	});
	
});

*/
// On Load Tour Guide---- New
$(document).ready(function() {
 
 $(".tourGuidePlay").click(function(){ 
        $('.leaflet-overlay-pane').find('g').eq(98).attr('id','usaLayer');
        $('.leaflet-control-layers').last().addClass('overLaySelectButton');
        
        var count = 0;
        $('#joyRideTipContent').joyride({
            autoStart:true,
            modal:true,   
            expose: true,
           // timer:2000,
        });
       /* setTimeout(function(){
            $('.joyride-tip-guide').eq(0).find('.joyride-next-tip').trigger('click');
        },2000);
    */});
 
 $(".x-navigation-minimize").click(function(){
  setTimeout(function(){ iHealthMap.map.invalidateSize();}, 1000);   //  map tiles render properly
  
 });
 
 $(".mapmarkerli").click(function(){      
  setTimeout(function(){ 
   if($(".mapmarkerli").hasClass("active") == true){
    $('.resetMap').show();
   }
  }, 300);  
 });
 
 $(".chartli").click(function(){
  setTimeout(function(){ 
   if($(".chartli").hasClass("active") == true){
    $('.resetMap').hide();
   }
  }, 300);   
 });
 
 $(".tableli").click(function(){  
  setTimeout(function(){ 
   if($(".tableli").hasClass("active") == true){
    $('.resetMap').hide();
   }
  }, 300);
 });
});