function pdfToHTMLCarta() {
	var pdf = new jsPDF('p', 'pt', 'letter');
	source = $('#pdf2htmlcartadiv')[0];

		specialElementHandlers = {
		'#bypassme': function (element, renderer) {
			return true
		}
	}
	
	 margins = {
            top: 50,
            bottom: 60,
            left: 10			
            
        };

// pdf.fromHTML(source,margins.left , margins.top, {
//    'width': margins.width // max width of content on PDF
// 	 		, 'elementHandlers': specialElementHandlers
// }, function() {
//     $.each(pdf.internal.pages, function (index, value) {
//         if (value) {
//             $.each(value, function (innerIndex, innerValue) {
//                 var continueAfterThis = true;
//                 if (innerValue.indexOf('$page$') > -1) {
//                     value[innerIndex] = innerValue.replace('$page$', index);
//                     continueAfterThis = false;
//                 }
//                 return continueAfterThis;
//             });
//         }
//     }),
		
// 			dispose: object with X, Y of the last line add to the PDF
// 			         this allow the insertion of new lines after html
			
// 			pdf.save('html2pdf.pdf');
		
		
// }
// , margins
// );

pdf.addHTML(source,margins.left , margins.top,  {
   'width': margins.width // max width of content on PDF
	 		, 'elementHandlers': specialElementHandlers
} , function() {
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
  pdf.save('web.pdf');
}
, margins
);

}