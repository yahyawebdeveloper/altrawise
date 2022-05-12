/**
 * @author Jamal
 * @date 9-Apr-2012
 * @Note = Please do not apply Ctr-Alt-Format for better readable codes
 *         Please follow the indentation
 *         Please follow the naming convention
 */

var upload_section = '';

$(window).on('beforeunload', function ()
{
	// Temporary disable
	// $.fn.signout_application();
	// $.fn.user_logout();	
});


$(document).ready(function () 
{
	try
	{
		
	}
	catch (err)
	{
		$.fn.log_error(arguments.callee.caller, err.message);
	}
});