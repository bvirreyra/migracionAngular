function pdfCertNoAfiliacion() {
	var pdf = new jsPDF('p', 'pt', 'letter');
	source = $('#pdfCertNoAfiliacionDiv')[0];

		specialElementHandlers = {
		'#bypassme': function (element, renderer) {
			return true
		}
	}
	
	 margins = {
            top: 50,
            bottom: 60,
            left: 50,
            right:50			
            
        };


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
  pdf.save('Certificado.pdf');
}
, margins
);

}