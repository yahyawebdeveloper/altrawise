/**
 * @author Jamal
 * @date 9-Apr-2012
 * @Note = Please do not apply Ctr-Alt-Format for better readable codes
 *         Please follow the indentation
 *         Please follow the naming convention
 */

var upload_section = '';

// $(window).on('beforeunload', function ()
// {
// 	// Temporary disable
// 	// $.fn.signout_application();
// 	// $.fn.user_logout();	
// });


$(document).ready(function () 
{
	try
	{
		let ext = ['jpg', 'png'];
		let get_param = { id: '', module_id: 1, token: $.jStorage.get('token'), method: "get_files", url: services_URL };
		let add_param = { p_id: 1, s_id: 1, mod_id: 1 };
		$.fn.intialize_upload(ext, '', '', add_param);

		$('#trigger-upload').click(function ()
		{
			file_uploader.uploadStoredFiles();
		});


	}
	catch (err)
	{
		$.fn.log_error(arguments.callee.caller, err.message);
	}
});