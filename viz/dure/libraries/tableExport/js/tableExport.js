/*The MIT License (MIT)

Copyright (c) 2014 https://github.com/kayalshri/

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.*/

(function($){
    $.fn.extend({
        tableExport: function(options) {
            var defaults = {
                            separator: ',',
                            ignoreColumn: [],
                            tableName:'yourTableName',
                            type:'csv',
                            pdfFontSize:10,
                            pdfLeftMargin:10,
                            escape:'true',
                            htmlContent:'false',
                            consoleLog:'false',
							tableJsonData: []
                            };
                
            var options = $.extend(defaults, options);
            var el = this;
				
            if(defaults.type == 'csv' || defaults.type == 'txt'){

                // Header
                var tdData ="";
                $(el).find('thead').find('tr').each(function() {
                    tdData += "\n";					
                    $(this).filter(':visible').find('th').each(function(index,data) {
                        if ($(this).css('display') != 'none'){
                            if(defaults.ignoreColumn.indexOf(index) == -1){
                                tdData += '"' + parseString($(this)) + '"' + defaults.separator;									
                            }
                        }

                    });
                    tdData = $.trim(tdData);
                    tdData = $.trim(tdData).substring(0, tdData.length -1);
                });

                // Row vs Column
                $(el).find('tbody').find('tr').each(function() {
                    tdData += "\n";
                    $(this).filter(':visible').find('td').each(function(index,data) {
                        if ($(this).css('display') != 'none'){
                            if(defaults.ignoreColumn.indexOf(index) == -1){
                                tdData += '"'+ parseString($(this)) + '"'+ defaults.separator;
                            }
                        }
                    });
                    //tdData = $.trim(tdData);
                    tdData = $.trim(tdData).substring(0, tdData.length -1);
                });

                //output
                if(defaults.consoleLog == 'true'){
                        console.log(tdData);
                }
                var base64data = "base64," + $.base64.encode(tdData);
                //window.open('data:application/'+defaults.type+';filename=default.csv;' + base64data, 'default.csv');                                        

                var custom_filename;

                if(defaults.tableName)
                {
                    custom_filename = defaults.tableName+"."+defaults.type;
                }
                else
                {
                    custom_filename = "default."+defaults.type;                                            
                } 

                var isSafari = /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor);

                if(isSafari)
                {                                                                                        
                    $.ajax({
                        type: "POST",
                        dataType: "json",
                        url: BASE_URL+"download_file.php",
                        data: {datauri: 'data:text/'+defaults.type+';filename='+custom_filename+';' + base64data},                
                        success: function(response){        

                            window.location = BASE_URL+"download_file.php?datauri="+response.datauri;
                        }
                    });                                             
                }
                else
                {                                            
                    var click_event = document.createEvent("MouseEvent");
                    click_event.initEvent("click", true, true);

                    var link = document.createElement('a');

                    link.download = custom_filename;
                    //link.target = "_blank";
                    link.href = 'data:text/'+defaults.type+';filename='+custom_filename+';' + base64data;                                        
                    link.dispatchEvent(click_event);                                             
                }				            
            }else if(defaults.type == 'json'){

                var jsonHeaderArray = [];
                $(el).find('thead').find('tr').each(function() {
                    var tdData ="";	
                    var jsonArrayTd = [];

                    $(this).filter(':visible').find('th').each(function(index,data) {
                        if ($(this).css('display') != 'none'){
                            if(defaults.ignoreColumn.indexOf(index) == -1){
                                jsonArrayTd.push(parseString($(this)));									
                            }
                        }
                    });									
                    jsonHeaderArray.push(jsonArrayTd);						
                });

                var jsonArray = [];
                $(el).find('tbody').find('tr').each(function() {
                    var tdData ="";	
                    var jsonArrayTd = [];

                    $(this).filter(':visible').find('td').each(function(index,data) {
                        if ($(this).css('display') != 'none'){
                            if(defaults.ignoreColumn.indexOf(index) == -1){
                                jsonArrayTd.push(parseString($(this)));									
                            }
                        }
                    });									
                    jsonArray.push(jsonArrayTd);									
                });

                var jsonExportArray =[];
                jsonExportArray.push({header:jsonHeaderArray,data:jsonArray});

                //Return as JSON
                //console.log(JSON.stringify(jsonExportArray));

                //Return as Array
                //console.log(jsonExportArray);
                if(defaults.consoleLog == 'true'){
                    console.log(JSON.stringify(jsonExportArray));
                }
                var base64data = "base64," + $.base64.encode(JSON.stringify(jsonExportArray));
                //window.open('data:application/json;filename=exportData;' + base64data);

                var click_event = document.createEvent("MouseEvent");
                click_event.initEvent("click", true, true);

                var link = document.createElement('a');

                var custom_filename;

                if(defaults.tableName)
                {
                    custom_filename = defaults.tableName+"."+defaults.type;
                }
                else
                {
                    custom_filename = "default."+defaults.type;                                            
                }                    

                link.download = custom_filename;
                link.target = "_blank";
                link.href = 'data:application/'+defaults.type+';filename='+custom_filename+';' + base64data;                                        
                link.dispatchEvent(click_event);
            
            }else if(defaults.type == 'excel' || defaults.type == 'doc'|| defaults.type == 'powerpoint'  ){
                
                var excel="<table>";
                // Header
                $(el).find('thead').find('tr').each(function() {
                    excel += "<tr>";
                    $(this).filter(':visible').find('th').each(function(index,data) {
                        if ($(this).css('display') != 'none'){					
                            if(defaults.ignoreColumn.indexOf(index) == -1){
                                excel += "<td><b>" + parseString($(this))+ "</b></td>";
                            }
                        }
                    });	
                    excel += '</tr>';						
                });					

                // Row Vs Column
				
				// console.log(defaults.tableJsonData);
				var rowCount = 1;
				$.each(defaults.tableJsonData,function(index,object){
					excel += "<tr>";
					$.each(object,function(key,value){
						excel += "<td>"+value+"</td>";
					});
					excel += '</tr>';	
				});
				
/*                 var rowCount=1;
                $(el).find('tbody').find('tr').each(function() {
                    excel += "<tr>";
                    var colCount=0;
                    $(this).filter(':visible').find('td').each(function(index,data) {
                        if ($(this).css('display') != 'none'){	
                            if(defaults.ignoreColumn.indexOf(index) == -1){
                                excel += "<td>"+parseString($(this))+"</td>";
                            }
                        }
                        colCount++;
                    });															
                    rowCount++;
                    excel += '</tr>';
                });		 */


				
                excel += '</table>'
				

                if(defaults.consoleLog == 'true'){
                    console.log(excel);
                }
                                
                var excelFile = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:x='urn:schemas-microsoft-com:office:"+defaults.type+"' xmlns='http://www.w3.org/TR/REC-html40'>";
                excelFile += "<head>";
                excelFile += '<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">';
                excelFile += "<!--[if gte mso 9]>";
                excelFile += "<xml>";
                excelFile += "<x:ExcelWorkbook>";
                excelFile += "<x:ExcelWorksheets>";
                excelFile += "<x:ExcelWorksheet>";
                excelFile += "<x:Name>";
                excelFile += "Sheet";
                excelFile += "</x:Name>";
                excelFile += "<x:WorksheetOptions>";
                excelFile += "<x:DisplayGridlines/>";
                excelFile += "</x:WorksheetOptions>";
                excelFile += "</x:ExcelWorksheet>";
                excelFile += "</x:ExcelWorksheets>";
                excelFile += "</x:ExcelWorkbook>";
                excelFile += "</xml>";
                excelFile += "<![endif]-->";
                excelFile += "</head>";
                excelFile += "<body>";
                excelFile += excel; //.replace(/%20/g, " ");
                excelFile += "</body>";
                excelFile += "</html>";

                var base64data = "base64," + $.base64.encode(excelFile);
                //window.open('data:application/vnd.ms-'+defaults.type+';filename=exportData.doc;' + base64data);

                var click_event = document.createEvent("MouseEvent");
                click_event.initEvent("click", true, true);

                var link = document.createElement('a');

                var custom_filename;

                if(defaults.tableName)
                {
                    custom_filename = defaults.tableName+".xls";
                }
                else
                {
                    custom_filename = "default.xls";                                            
                }                    

                link.download = custom_filename;
    //                link.target = "_blank";
                link.href = 'data:application/vnd.'+defaults.type+';filename='+custom_filename+';' + base64data;                                        
                link.dispatchEvent(click_event);

            }else if(defaults.type == 'png'){
                html2canvas($(el), {
                    onrendered: function(canvas) {										
                        var img = canvas.toDataURL("image/png");
                        window.open(img);
                    }
                });
            }else if(defaults.type == 'pdf'){
			
				var columns = [
					{title: "Current GAVI Eligibility", key: "Current GAVI Eligibility"},
					{title: "Traditional Geographic Region", key: "Traditional Geographic Region"},
					{title: "UNICEF Region", key: "UNICEF Region"} ,
					{title: "WHO Region", key: "WHO Region"},
					{title: "World Bank Income Group", key: "World Bank Income Group"},
					{title: "Current Vaccine Use Status", key: "Current Vaccine Use Status"},
					{title: "Current National Immunization Program Type", key: "Current National Immunization Program Type"},
					{title: "GAVI Letter of Expression of Interest Date", key: "GAVI Letter of Expression of Interest Date"},
					{title: "GAVI Most Recent Planned Application Date", key: "GAVI Most Recent Planned Application Date"},
					{title: "GAVI Most Recent Actual Application Date", key: "GAVI Most Recent Actual Application Date"}
				];					
				
				console.log(columns.length);
				// console.log(defaults.tableJsonData);
							
				var options = {
						orientation: 'p',
                        unit: 'pt',
                        format: 'letter',
                        compress: true,
                        fontSize: defaults.pdfFontSize,
                        lineHeight: 1			
				};
            
				if(columns.length == 5)
				{
					options.orientation = 'l';
				}
				else
				{
					options.format = 'c1';
				}
			
				var doc = new jsPDF(options);
				
				doc.autoTable(columns, defaults.tableJsonData, {});								
                doc.save(defaults.tableName+'.pdf');                
            }

            function parseString(data){

                if(defaults.htmlContent == 'true'){
                    content_data = data.html().trim();
                }else{
                    content_data = data.text().trim();
                }

                if(defaults.escape == 'true'){
                    content_data = escape(content_data);
                }

                return content_data;
            }            
        }
    });
})(jQuery);
        
