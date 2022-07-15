$.fn.show_hide_form = function(form_status,reset_form)
{
    if(form_status == 'ADMIN')
    {
		$("#checked")	.show()
    }
    else if(form_status == 'NOT_ADMIN')
    {
        $("#note").show();
    }
};
$.fn.populate_dd_values = function (element_id, dd_data, is_search = false)
{
    try
    {
        $('#' + element_id).empty();

        if (is_search)
        {
            $('#' + element_id).append(`<option value="">All</option>`);
        }
        else if (element_id != 'dd_type')
        {
            $('#' + element_id).append(`<option value="">Please Select</option>`);
        }

        for (let item of dd_data)
        {
            $('#' + element_id).append(`<option value="${item.id}">${item.descr}</option>`);
        }
        $('#' + element_id).val('').change();
    }
    catch (err)
    {
        $.fn.log_error(arguments.callee.caller, err.message);
    }
};
$.fn.get_client_drop_down_values = function ()
{
    try
    {
        let data =
        {
            emp_id: SESSIONS_DATA.emp_id,
            view_all: MODULE_ACCESS.viewall
        };

        $.fn.fetch_data
            (
                $.fn.generate_parameter('get_client_drop_down_values', data),
                function (return_data)
                {
                    if (return_data.code == 0)
                    {
                        $.fn.populate_dd_values('dd_search_created_by', return_data.data.account_managers, true);

                        $.fn.populate_dd_values('dd_industry', return_data.data.industry);
                        $.fn.populate_dd_values('dd_client_status', return_data.data.status);
                        $.fn.populate_dd_values('dd_source', return_data.data.source);
                        $.fn.populate_dd_values('dd_offering', return_data.data.offerings);
                        $.fn.populate_dd_values('dd_type', return_data.data.type);
                        $.fn.populate_dd_values('dd_search_type', return_data.data.type);
                    }
                }, true
            );
    }
    catch (err)
    {
        $.fn.log_error(arguments.callee.caller, err.message);
    }
};

$.fn.bind_command_events = function()
 {	
	 try
	 {
		 $('#showSearchDiv').on('click', function (e)
        {
            e.preventDefault();
            $('#searchDiv').show();
			$("#showSearchDiv").hide();
        });
	 }
	 catch(err)
	 {
		 $.fn.log_error(arguments.callee.caller,err.message);
	 }			
 };
 
 $.fn.prepare_form = function()
 {	
	 try
	 {
		if( parseInt(SESSIONS_DATA.is_admin) )
			$.fn.show_hide_form('ADMIN')
		else
			$.fn.show_hide_form('NOT_ADMIN')
		$.fn.get_client_drop_down_values();
		$('.populate').select2();
	 }
	 catch(err)
	 {
		 console.log(err);
		 //$.fn.log_error(arguments.callee.caller,err.message);
	 }			
 };
 
 $.fn.form_load = function()
 {
	 try
	 {	
		$.fn.prepare_form();
		$.fn.bind_command_events();	
	 }
	 catch(err)
	 {
		 $.fn.log_error(arguments.callee.caller,err.message);
	 }
 };
 
 $(document).ready(function () 
 {
	 try
	 {	
		 $.fn.form_load();
	 }
	 catch (err)
	 {
		 $.fn.log_error(arguments.callee.caller, err.message);
	 }
 });
 
