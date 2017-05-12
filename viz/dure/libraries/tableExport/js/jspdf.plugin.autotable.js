/**
 * jsPDF AutoTable plugin
 * Copyright (c) 2014 Simon Bengtsson, https://github.com/someatoms/jsPDF-AutoTable
 *
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */
(function (API) {
    'use strict';

    var doc, cellPos, pageCount = 1;
	var maxColumnWidth = 150;
	var fixY = false;
    var options = {
        padding: 5,
        fontSize: 10,
        lineHeight: 20,
        renderCell: function (x, y, w, h, txt, fillColor, options) {
            txt = '' + txt;
			// Nath 
			var internalTextWidth = getStringWidth(txt);
			if(internalTextWidth > maxColumnWidth)
			{
				var splitTitle = doc.splitTextToSize(txt, maxColumnWidth);
				txt = splitTitle;
			}
            doc.setFillColor.apply(this, fillColor);
			
            doc.rect(x, y , w , h, 'F');

            doc.text( txt, x + options.padding, y + options.lineHeight / 2 + doc.internal.getLineHeight() / 2 - 2.5);
        },
        margins: { horizontal: 40, top: 50, bottom: 40 },
        extendWidth: true
    };

    /**
     * Create a table from a set of rows and columns.
     *
     * Default options:
     *
     * <pre>
     var options = {
        padding: 3,
        fontSize: 12,
        lineHeight: 20,
        renderCell: function (x, y, w, h, txt, fillColor, options) {
            doc.setFillColor.apply(this, fillColor);
            doc.rect(x, y, w, h, 'F');
            doc.text(txt, x + options.padding, y + doc.internal.getLineHeight());
        },
        margins: { horizontal: 40, top: 50, bottom: 40 },
        extendWidth: true
     };
     * </pre>
     *
     * @param {Object[]|String[]} columns Either as an array of objects or array of strings
     * @param {Object[][]|String[][]} data Either as an array of objects or array of strings
     * @param {Object} [options={}] Options that will override the default ones (above)
     *
     * @param {Object} [options.autoWidth=true] If table should span entire page width (otherwise resorts to min-width)
     */
    API.autoTable = function (columns, data, options) {
        doc = this;
        initData({columns: columns, data: data});
        initOptions(options || {});

        var columnWidths = calculateColumnWidths(data, columns);
		// console.log(columnWidths);
        printHeader(columns, columnWidths);
        printRows(columns, data, columnWidths);

        return this;
    };

    function initData(params) {
        // Transform from String[] to Object[]
        if (typeof params.columns[0] === 'string') {
            params.data.forEach(function (row, i) {
                var obj = {};
                for (var j = 0; j < row.length; j++) {
                    obj[j] = params.data[i][j];
                }
                params.data[i] = obj;
            });
            params.columns.forEach(function (title, i) {
                params.columns[i] = {title: title, key: i};
            });
        }
    }

    function initOptions(raw) {
        Object.keys(raw).forEach(function (key) {
            options[key] = raw[key];
        });
        doc.setFontSize(options.fontSize);
        //console.log( options.margins.top );
        cellPos = { x: options.margins.horizontal, y: options.margins.top };
    }

    function calculateColumnWidths(rows, columns) {
        var widths = {};
        // Min widths
        columns.forEach(function (header) {
            var widest = getStringWidth(header.title);
			console.log(widest);
            rows.forEach(function (row) {
                var w = getStringWidth(row[header.key]);
				console.log(w);
                if (w > widest) {
                    widest = w/2;
                }
            });
            widths[header.key] = widest;
        });

        // Fill page horizontally
        if (options.extendWidth) {
            var keys = Object.keys(widths),
                sum = 0;

            keys.forEach(function (key) {
                return sum += widths[key];
            });

            var spaceLeft = doc.internal.pageSize.width - sum - options.padding * 2 * columns.length - options.margins.horizontal * 2;
            keys.forEach(function (key) {
                widths[key] += spaceLeft / keys.length;
            });
        }

        return widths;
    }

    function printHeader(headers, columnWidths) {
        if (!headers) return; //
        doc.setFontStyle('bold');
        doc.setTextColor(255, 255, 255);
		
		// Calculating the column header height -- Shone.
		var maxWidthInternal  = 0;
		var heightMultiplier = 1;
		var calcualtedHeight = options.lineHeight ;	
		var yFix = 0;
		
		// console.log(headers);
		headers.forEach(function(header){
			console.log(header);
			var columnWidthInternal = getStringWidth(header.key);
			if(columnWidthInternal > maxWidthInternal)
			{
				maxWidthInternal = columnWidthInternal;
				console.log(maxWidthInternal);
				var splitTitle = doc.splitTextToSize(header.key, maxColumnWidth);
				if(splitTitle != undefined)
				{
					// console.log(splitTitle);
					heightMultiplier = splitTitle.length;
					// console.log(heightMultiplier);
					calcualtedHeight = options.lineHeight *  heightMultiplier;
					// console.log(calcualtedHeight);
					if(heightMultiplier > 1)
					{
						yFix = options.lineHeight;
					}
				}					
			}
		});
								
		// console.log(calcualtedHeight);
		
		
        headers.forEach(function (header) {
            var width = columnWidths[header.key] + options.padding * 2;
			console.log(width);
			console.log(header.key);
            var color = [52, 73, 94]; // asphalt
            options.renderCell(cellPos.x, cellPos.y, width,calcualtedHeight, header.title, color, options);
			// console.log(options.lineHeight);
			// console.log(calcualtedHeight);
			//options.renderCell(cellPos.x, cellPos.y, 150, 150, header.title, color, options);
            cellPos.x = cellPos.x + columnWidths[header.key] + options.padding * 2;


        });
        doc.setTextColor(70, 70, 70);
        doc.setFontStyle('normal');

        cellPos.y += options.lineHeight + yFix;
        cellPos.x = options.margins.horizontal;
    }

    function printRows(headers, rows, columnWidths) {
        var odd = false;
        for (var i = 0; i < rows.length; i++) {
            var row = rows[i];
			var fixY = false;
			
			// Nath Get Max width from a row 
			var maxWidthInternal  = 0;
			var heightMultiplier = 1;
			var calcualtedHeight = options.lineHeight ;	
				// console.log(calcualtedHeight);
			var yFix = 0;
			headers.forEach(function (header) {
				var columnWidthInternal = getStringWidth(row[header.key]);
				if(columnWidthInternal> maxWidthInternal)
				{
					maxWidthInternal = columnWidthInternal;
					var splitTitle = doc.splitTextToSize(row[header.key], maxColumnWidth);
					if(splitTitle != undefined)
					{
						// console.log(splitTitle);
						heightMultiplier = splitTitle.length;
						// console.log(heightMultiplier);
						calcualtedHeight = options.lineHeight *  heightMultiplier;
						// console.log(calcualtedHeight);
						if(heightMultiplier > 1)
						{
							yFix = options.lineHeight;
						}
					}					
				}
				
			});

            headers.forEach(function (header) {
                var color = (odd ? 245 : 255);
                var width = columnWidths[header.key] + options.padding * 2;
				options.renderCell(cellPos.x, cellPos.y, width, calcualtedHeight, row[header.key], [color], options);
                cellPos.x = cellPos.x + columnWidths[header.key] + options.padding * 2;

            });
            odd = !odd;
			
			// console.log(yFix);
			cellPos.y = cellPos.y + yFix;

            var newPage = (cellPos.y + options.margins.bottom + options.lineHeight * 2) >= doc.internal.pageSize.height;
            if (newPage) {
                doc.addPage();
                cellPos = {x: options.margins.horizontal, y: options.margins.top};
                pageCount++;
                printHeader(headers, columnWidths);
            } else {

				cellPos.y += options.lineHeight;
                cellPos.x = options.margins.horizontal;
            }
        }
    }

    function getStringWidth(txt) {
        return doc.getStringUnitWidth(txt) * doc.internal.getFontSize();
    }

})(jsPDF.API);