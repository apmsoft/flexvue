define(['jquery','css!datepicker/themes/classic.css','css!datepicker/themes/classic.date.css',
    'datepicker/picker','datepicker/picker.date','datepicker/translations/ko_KR'], 
	function($,classic_css,classic_date_css,picker,picker_date){ 
	app.log('datepicker');

	var initialize = function(argv,callback){
		app.log('datepicker target_id : '+argv);
        var target_id = argv.join(',');
		$(target_id).addClass('datepicker');

        $('.datepicker').pickadate({
            format: 'yyyy-mm-dd',
            formatSubmit : 'yyyy-mm-dd',
            hiddenName: true,
            onSet: function(context) {
				callback(context);
			}
        });
	};
	return {
		initialize : initialize
	};
});
