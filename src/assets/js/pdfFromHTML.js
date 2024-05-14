function pdfToHTML() {
	var pdf = new jsPDF('L', 'pt', 'legal');
	source = $('#pdf2htmldiv')[0];


	specialElementHandlers = {
		'#bypassme': function (element, renderer) {
			return true
		}
	}
	
	 margins = {
            top: 30,
            bottom: 60,
            left: 40,
            width: 730
        };
/*	
pdf.fromHTML(source,margins.left , margins.top, {
   'width': margins.width // max width of content on PDF
	 		, 'elementHandlers': specialElementHandlers
}, function (dispose) {
        // dispose: object with X, Y of the last line add to the PDF 
        //          this allow the insertion of new lines after html
        pdf.save('Test.pdf');
    }, margins
);*/



pdf.fromHTML(source,margins.left , margins.top, {
   'width': margins.width // max width of content on PDF
	 		, 'elementHandlers': specialElementHandlers
}, function() {
    $.each(pdf.internal.pages, function (index, value) {
        if (value) {
            $.each(value, function (innerIndex, innerValue) {
                var continueAfterThis = true;
                if (innerValue.indexOf('$page$') > -1) {
                    value[innerIndex] = innerValue.replace('$page$', index);
                    continueAfterThis = false;
                }
                return continueAfterThis;
            });
        }
    }),
		
			// dispose: object with X, Y of the last line add to the PDF
			//          this allow the insertion of new lines after html
			
			pdf.save('html2pdf.pdf');
		
		
}, margins
);


	// pdf.fromHTML(

	// 	source // HTML string or DOM elem ref.
	// 	, margins.left // x coord
	// 	, margins.top // y coord
	// 	, {
	// 		'width': margins.width // max width of content on PDF
	// 		, 'elementHandlers': specialElementHandlers
	// 	},
		
	// 	function (dispose) {
	// 		// dispose: object with X, Y of the last line add to the PDF
	// 		//          this allow the insertion of new lines after html
			
	// 		pdf.save('html2pdf.pdf');
	// 	}
	// 	, margins);

}