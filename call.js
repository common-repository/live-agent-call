jQuery(document).ready(function($){
    $('.websp-color-field').wpColorPicker();
    $('.websp-color-field-hover').wpColorPicker();
	$("#settings").hide();
	$(".minus").hide();
	

	$("h4.websp_settings").click(function() {
		$("#settings").slideToggle();
		$(".plus").toggle();
		$(".minus").toggle();
	});
});