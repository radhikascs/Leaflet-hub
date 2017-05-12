var dureApp = {};

dureApp.lastUrlSegment = function() {
    var currPathname = window.location.pathname;
    var segments = currPathname.split('/')
    var lastSegment = segments.pop();
    return lastSegment;
};

if(dureApp.lastUrlSegment() == '' || dureApp.lastUrlSegment() == 'index.html' || dureApp.lastUrlSegment() == 'home.html' || dureApp.lastUrlSegment() == 'tab.html' || dureApp.lastUrlSegment() == 'map.html'|| dureApp.lastUrlSegment() == 'chart.html' || dureApp.lastUrlSegment() == 'authenticate.html'){
    dureApp.relativePath = './dure/';
	dureApp.appPath = '';
    dureApp.seperator = '';
}else{
    dureApp.relativePath = '../dure/';
	dureApp.appPath = '';
    dureApp.seperator = '../';
}

head.js(
    {jquery: dureApp.relativePath + 'libraries/jquery/2.1.1/jquery.min.js'},
    {jqMig: dureApp.relativePath + "libraries/jquery/plugins/jquery-migrate-1.1.1.js"},
    {jqMig: dureApp.relativePath + "libraries/jquery/plugins/jquery.validate.min.js"},
    {bootstrap: dureApp.relativePath + "libraries/bootstrap/3.2/js/bootstrap.js"},
	{bs_wysihtml5: dureApp.appPath + "js/plugins/bootstrap-wysihtml5/bootstrap3-wysihtml5.all.min.js"},
    {jqueryui: dureApp.appPath + "js/jquery-ui-1.10.3.min.js"},
	{base64:dureApp.relativePath + "libraries/base64/base64.js"},
    {touchpunch: dureApp.relativePath + "libraries/touchpunch/jquery.ui.touch-punch.min.js"},
    {leaflet: dureApp.relativePath + 'libraries/leaflet/0.7.3/leaflet.js'},
	{moment : dureApp.relativePath + 'libraries/moment/moment.min.js'},
	{scrolltabs : dureApp.relativePath + 'libraries/jQueryScrollTab/js/jquery.scrolltabs.js'},
	{lteApp: dureApp.appPath + "js/AdminLTE/app.js"},
	{leafletStamen: 'http://maps.stamen.com/js/tile.stamen.js?v1.2.3'},
    {leafletMapboxZoom: dureApp.relativePath + '/libraries/leaflet/plugins/zoom-slider/L.Control.Zoomslider.js'},
    {leafletDvfJs: dureApp.relativePath + 'libraries/leaflet/plugins/leaflet-dvf/examples/lib/jsts/javascript.util.js'},
    {leafletDvfJst: dureApp.relativePath + 'libraries/leaflet/plugins/leaflet-dvf/examples/lib/jsts/jsts.js'},
    //{leafletDateFmt: dureApp.relativePath + 'libraries/leaflet/plugins/leaflet-dvf/examples/lib/date.format.js'},
    //{leafletGeoHash: dureApp.relativePath + 'libraries/leaflet/plugins/leaflet-dvf/examples/lib/geohash.js'},
    {leafletDvf: dureApp.relativePath + 'libraries/leaflet/plugins/leaflet-dvf/leaflet-dvf.min.js'},
    {leafletActiveLayers: dureApp.relativePath + 'libraries/leaflet/plugins/selectLayers/activelayers/leaflet.active-layers.min.js'},
    {leafletSelectLayers: dureApp.relativePath + 'libraries/leaflet/plugins/selectLayers/leaflet.select-layers.min.js'},
    {leafletWorldData: dureApp.appPath + 'data/worldGeo.js'},
    {leafletCountryData: dureApp.appPath + 'data/countryData.min.js'},
	//{leafletStatesData: dureApp.appPath + 'data/stateData.min.js'},
	//{barChartOverlayData: './data/populate.js'},
    {leafletLabel: dureApp.relativePath + 'libraries/leaflet/plugins/leaf-label/leaflet.label.js'},
    {leafletMarker: dureApp.relativePath + 'libraries/leaflet/plugins/leaflet-marker/leaflet.awesome-markers.js'},
    {googlejs: dureApp.relativePath + "libraries/leaflet/plugins/provider/Google.js"},
	/* new libraries added for timestamp changes */
    {timelinejs: dureApp.relativePath + 'libraries/leaflet/plugins/leafletTimeline/leaflet.timeline.js'},
    //{highchart: dureApp.relativePath + "libraries/highchart/js/highcharts.src.js"},
	{highstock: dureApp.relativePath + "libraries/highchart/js/highstock.js"},
	{highchartDrillDown: dureApp.relativePath + "libraries/highchart/js/modules/drilldown.js"},
    {bootSelect: dureApp.relativePath + "libraries/bootstrap-select/js/bootstrap-select.js"},
    {fullscreen: dureApp.relativePath + "libraries/fullscreen/jquery.fullscreen-min.js"},
    {jNotify: dureApp.relativePath + "libraries/jNotify/jquery/jNotify.jquery.min.js"},
	{notify : dureApp.relativePath + 'libraries/noty/jquery.noty.packaged.min.js'},
    {knob:  dureApp.appPath + "js/plugins/jqueryKnob/jquery.knob.js"},
    {jStore: dureApp.relativePath + "libraries/sizeof/sizeof.compressed.js"},
    {jStore: dureApp.relativePath + "libraries/jStorage.js"},
    {modaloverlay: dureApp.relativePath + "libraries/modaloverlay/jquery.popupoverlay.js"},
    {bs_wysihtml5: dureApp.appPath + "js/plugins/bootstrap-wysihtml5/bootstrap3-wysihtml5.all.min.js"},
    {lteiCheck: dureApp.appPath + "js/plugins/iCheck/icheck.min.js"},
    // {dataTables:"js/plugins/datatables/jquery.dataTables.js"},
    {dataTables: dureApp.appPath + "js/plugins/datatables/jquery.dataTables.min.js"},
    {dataTablesBootstrap: dureApp.appPath + "js/plugins/datatables/dataTables.bootstrap.js"},
    {dataTableTools: dureApp.appPath + "js/plugins/datatables/dataTables.tableTools.min.js"},
/*     {lteDatepicker: dureApp.appPath + "js/plugins/daterangepicker/daterangepicker.js"}, */
    {blockUIjs:dureApp.relativePath+"libraries/blockUI/jquery.blockUI.js"},
	{rgbcolor : dureApp.appPath + 'js/pdf_js/rgbcolor.js'},
    {canvg : dureApp.appPath + 'js/pdf_js/canvg.js'},
    {html2canvas : dureApp.appPath + 'js/pdf_js/html2canvas.js'},
    {jspdf : dureApp.appPath + 'js/pdf_js/jspdf.min.js'},
    {exporting : dureApp.appPath + 'js/pdf_js/exporting.js'},
	{bootstrapToggle: dureApp.relativePath + "libraries/bootstrap-toggle/js/bootstrap-toggle.min.js"},	
    {tableExport: dureApp.relativePath + "libraries/tableExport/js/jspdf.plugin.autotable.js"},
    {tableXlExport: dureApp.relativePath + "libraries/tableExport/js/tableExport.js"},

	/* {tableXlExport: dureApp.relativePath + "libraries/pdfExport/jspdf.min.js"},
	{tableXlExport: dureApp.relativePath + "libraries/pdfExport/html2canvas.min.js"},
	{tableXlExport: dureApp.relativePath + "libraries/pdfExport/canvas2image.js"}, */
	
	{tableXlExport: dureApp.relativePath + "libraries/wordExport/FileSaver.js"},
	{tableXlExport: dureApp.relativePath + "libraries/wordExport/jquery.wordexport.js"},
	
    {base64: dureApp.relativePath + "libraries/tableExport/js/jquery.base64.js"},
	/* {fabricjs: dureApp.relativePath + 'libraries/fabric/fabric.js'}, */
	{slick: dureApp.relativePath + "libraries/slick/slick.min.js"},
	/* {tinycolor: dureApp.relativePath + 'libraries/fabric/tinycolor.js'}, */
	{ihealthCountryIdMapping: dureApp.relativePath+ '../data/codes.js'},
	{dureConfigure: dureApp.relativePath + 'scripts/DureConfigure.js'},
    {ihealth_overlays: dureApp.relativePath + 'scripts/DureOverlays.js'},    
    {ihealth_core: dureApp.relativePath + 'scripts/DureCore.js'},
	{ihealth_menu: dureApp.relativePath + 'scripts/DureMenu.js'},
	{ihealth_menu: dureApp.relativePath + 'scripts/DureImpactStudies.js'},
    {ihealth_util: dureApp.relativePath + 'scripts/DureUtil.js'},
    {ihealth_map: dureApp.relativePath + 'scripts/DureMap.js'},
    {ihealth_map_indicator: dureApp.relativePath + 'scripts/DureMapIndicator.js'},
    {ihealth_map_subprovince: dureApp.relativePath + 'scripts/DureMapSubprovince.js'},
    {ihealth_map_local: dureApp.relativePath + 'scripts/DureMapLocal.js'},
    {ihealth_chart: dureApp.relativePath + 'scripts/DureChart.js'},    
    {ihealth_tables: dureApp.relativePath + 'scripts/DureTables.js'},
	{ihealth_export: dureApp.relativePath + 'scripts/DureExport.js'},	
    {ihealth_app_map: dureApp.appPath +'application/DureApplicationMap.js'},
    {ihealth_app_chart: dureApp.appPath +'application/DureApplicationChart.js'},
    {ihealth_app_table: dureApp.appPath +'application/DureApplicationTable.js'},
    {ihealth_app_ken: dureApp.appPath +'application/DureKenya.js'},
	{ihealth_core: dureApp.relativePath + 'scripts/DureLogin.js'},
	{ihealth_viewhub: dureApp.relativePath + 'scripts/DureViewhub.js'},
	{ihealth_controls: dureApp.relativePath + 'scripts/DureControls.js'}, 	
	{ihealth_app_loadlayout: dureApp.appPath +'application/DureApplicationLoadLayout.js'}
	
);