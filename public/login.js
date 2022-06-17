/**
 * @author 		Jamal
 * @date 		9-Apr-2012
 * @modify 		12-Jun-2012
 * @Note = Please do not apply Ctr-Alt-Format for better readable codes
 *         Please follow the indentation
 *         Please follow the naming convention
 * 		   Please re-read this again
 */

if (!window.location.origin)
	window.location.origin = window.location.protocol + '//' + window.location.host;

var directory_path = "/altrawise/";
var services_URL = window.location.origin + `${directory_path}services/services.php`;
var upload_file_path = window.location.origin + `${directory_path}services/upload/index.php`;
var redirect_mainpage = window.location.origin + `${directory_path}public/`;
var CURRENT_PATH = '';
var loading_image = "<img src='" + CURRENT_PATH + "./assets/js/custom/busy.gif'/>";
var BLOCKUI_CSS = { border: 'none', padding: '15px', backgroundColor: '#000', '-webkit-border-radius': '10px', '-moz-border-radius': '10px', opacity: .5, color: '#fff' };
var loading_text = " Just a moment...";


$.fn.set_session_values = function (param) 
{
	$.jStorage.set('token', param.token);
	$.jStorage.set('app_name', "XITUI")
	$.jStorage.set('session_data', param);
};

$.fn.log_error = function (routine_name, error_msg)
{
	Ladda.stopAll();
	$.unblockUI();
	alert('Error Occur at : ' + routine_name + ' with error msg : ' + error_msg, $.jStorage.get('app_name'));
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
	if ($.jStorage.get('username') == null)
		window.location.href = 'login.html';
};

$.fn.clear_active_session = function ()
{
	$.removeData(document.body, "scheme");
	$.jStorage.flush();
};

$.fn.do_login = function ()
{
	try
	{

		var param =
		{
			username: $.trim($('#txt_username').val()),
			password: $.trim($('#txt_password').val()),
			method: 'login'
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
							emp_id: r_data.emp_id,
							office_email: r_data.office_email,
							name: r_data.name,
							is_admin: r_data.is_admin,
							super_admin: r_data.super_admin,
							access: r_data.access,
							modules: r_data.modules,
							cpanel_domain: r_data.CPANEL_DOMAIN,
							logo_path: r_data.logo_path,
							profile_pic_path: r_data.profile_pic_path,
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

$(document).ready(function () 
{
	$.fn.clear_active_session();

	$('#btn_login').click(function ()
	{	
		$.fn.do_login();
	});
	$('#txt_username').keydown(function (e) 
	{
		if (e.which == 13)
			$.fn.do_login();
	});
	$('#txt_password').keydown(function (e) 
	{
		if (e.which == 13)
			$.fn.do_login();
	});

});
