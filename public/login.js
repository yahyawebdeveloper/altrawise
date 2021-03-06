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
		let password = $.trim($('#txt_password').val());
		
		var param ={
			method: 'login_salt'
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
				let pass = $.fn.get_encrypt_password(password, data.data.salt, data.data.pbkdf2_rounds, data.data.rnd);	

				var param =
				{
					username: $.trim($('#txt_username').val()),
					password: pass,
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
									company_id: r_data.company_id,
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
		});
	
		/* let secret_key = "dy@r#tMsp@#iT3ct(M)$dnBhdNextGenOfHRM$g$dfg";
		
		//construct key and iv
		let key_t   = CryptoJS.SHA256(secret_key).toString();
		let key     = key_t.substring(0, 32);
		let iv      = key.substring(0, 16);
		
		let encrypted = CryptoJS.AES.encrypt(password, CryptoJS.enc.Utf8.parse(key), {iv: CryptoJS.enc.Utf8.parse(iv)});
		let open_ssl_string = CryptoJS.enc.Base64.stringify(encrypted.ciphertext);
		let pass = btoa(open_ssl_string); */

	
	}
	catch (err)
	{
		$.fn.log_error(arguments.callee.caller, err.message);
	}
};

$.fn.get_encrypt_password = function (password, salt, pbkdf2_rounds, rnd)
{
	//let check_login_salt = login_salt(); console.log(check_login_salt);
	var pwmd5 = calcMD5(salt + $.trim(password));

	if (pbkdf2_rounds > 0)
	{
		pwmd5 = sjcl.codec.hex.fromBits(sjcl.misc.pbkdf2(sjcl.codec.hex.toBits(pwmd5), salt, pbkdf2_rounds));
	}
	return calcMD5(rnd + pwmd5);

}


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
