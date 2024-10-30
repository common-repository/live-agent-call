// Global variables (kill me).
var register_checkbox = null;
var phone_dialed_number_screen = null;
var phone_call_button = null;
var phone_chat_button = null;
var phone_dialpad_button = null;
var soundPlayer = null;
var _Session = null;  // The last RTCSessionHidePhone() instance.
var peerconnection_config = peerconnection_config || undefined;

jQuery(function($) {
$( "#toPopup" ).draggable();
});

function  HidePhone() {
document.getElementById('toPopup').style.display = 'none';
}

jQuery(document).ready(function ($) {

$("#disconnectagentimg").on('click', function(){
document.getElementById('customerPopup').style.display = 'none';
	    
	});



$("#customerphonebtn").on('click', function(){
	//    alert("hello");
	   
document.getElementById('customerPopup').style.display = 'block';
	    
	});


	$("#phonemainbtn").on('click', function(){
	//    alert("hello");
	   
document.getElementById('toPopup').style.display = 'block';
	    
	});
     
    phone_dialed_number_screen = $("#phone > .controls  input.destination");
    phone_call_button = $("#phone > .controls > .dialbox > .dial-buttons > .call");
   
    phone_dialpad_button = $("#phone > .controls > .dialpad .button");

     phone_call_button.click(function (event) {
	    alert("button");
            GUI.phoneCallButtonPressed();
        });


 $('td.phone').click(function (event) {
//alert("KK");
document.getElementById('toPopup').style.display = 'block';
phone_dialed_number_screen.val($.trim($(this).text()));
  }); 

 $('#phone_work').on('click', function(){
document.getElementById('toPopup').style.display = 'block';
phone_dialed_number_screen.val($(this).val());
  }); 
        

        phone_dialpad_button.click(function () {
 
            phone_dialed_number_screen.val(phone_dialed_number_screen.val() + $(this).text());
        });

        phone_dialed_number_screen.keypress(function (e) {
            // Enter pressed? so Dial.
            if (e.which == 13)
                GUI.phoneCallButtonPressed();
        });

    
    

});
