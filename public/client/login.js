/**
 * @author Syed Anees
 * @module Client Login
 * @description Client login
 * @date 02-05-2022
 */

 if (!window.location.origin)
 window.location.origin = window.location.protocol + '//' + window.location.host;

var directory_path = "/altrawise/";
var services_URL = window.location.origin + `${directory_path}services/services.php`;
var upload_file_path = window.location.origin + `${directory_path}services/upload/index.php`;
var redirect_mainpage = window.location.origin + `${directory_path}public/client/`;
var CURRENT_PATH = '';
var loading_image = "<img src='" + CURRENT_PATH + "./assets/js/custom/busy.gif'/>";
var BLOCKUI_CSS = { border: 'none', padding: '15px', backgroundColor: '#000', '-webkit-border-radius': '10px', '-moz-border-radius': '10px', opacity: .5, color: '#fff' };
var loading_text = " Just a moment...";

$.fn.set_session_values = function (param) 
{
	$.jStorage.set('client_token', param.token);
	$.jStorage.set('app_name', "XITUI")
	$.jStorage.set('client_session_data', param);
};

$.fn.clear_active_session = function ()
{
	$.removeData(document.body, "scheme");
	$.jStorage.flush();
};

$.fn.is_success = function (code)
{
	if (code == '0')
		return true;
	else
		return false;

};

$.fn.is_session_active = function ()
{
	if ($.jStorage.get('client_token') == null)
		window.location.href = 'login.html';
};

$.fn.do_login = function ()
{
	try
	{

		var param =
		{
			client_username: $.trim($('#txt_client_username').val()),
			client_password: $.trim(md5($('#txt_client_password').val())),
			method: 'client_login'
		};
		$.ajax
			({
				type: 'POST',
				dataType: 'json',
				contentType: 'application/json',
				data: JSON.stringify(param),
				url: services_URL,
				success: function (data)
				{	

					if ($.fn.is_success(data.code) == false)
						alert(data.msg);
					else
					{
						let r_data = data.data;
						var session_info =
						{
							token: r_data.token,
							contact_id: r_data.contact_id,
							contact_name: r_data.contact_name,
							email: r_data.email,
							designation: r_data.designation,
							client_id : r_data.client_id,
							client_name : r_data.client_name,
						};
						$.fn.set_session_values(session_info);
						window.location.href = redirect_mainpage;

					}
				},
				error: function (err)
				{
					alert('Resource is not available. One or more of the services on which we depend is unavailable. Please try again later after the service has had a chance to recover.');
				},
				beforeSend: function ()
				{
					$.blockUI({ message: '<span class="loader_text">' + loading_image + loading_text + '</span>' });
				},
				complete: function ()
				{
					$.unblockUI();
				}
			});
	}
	catch (err)
	{
		$.fn.log_error(arguments.callee.caller, err.message);
	}
};

$(document).ready(function() {

    $.fn.clear_active_session();

    $('#btn_client_login').click(function (e) {	
		$.fn.do_login();
	});

	$('#txt_client_username').keydown(function (e) {
		if (e.which == 13) 
            $.fn.do_login();
	});

	$('#txt_client_password').keydown(function (e) {
		if (e.which == 13)
			$.fn.do_login();
	});
});
