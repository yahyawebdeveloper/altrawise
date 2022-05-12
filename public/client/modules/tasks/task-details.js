/**
 * @author          Syed Anees
 * @module          Client Portal
 * @description     Tasks Detail
 * @date            11-05-22
 */

var ROUTE_DATA = '';
var TASK_NO = '';

$.fn.decodeURIComponentSafe = function (uri, mod) {   
    if (!uri) {
        return uri;
    }

    var out = new String(),
    arr,
    i = 0,
    l,
    x;
    typeof mod === "undefined" ? mod = 0 : 0;
    arr = uri.split(/(%(?:d0|d1)%.{2})/);
    for (l = arr.length; i < l; i++) {
        try {
            x = decodeURIComponent(arr[i]);
        } catch (e) {
            x = mod ? arr[i].replace(/%(?!\d+)/g, '%25') : arr[i];
        }
        out += x;
    }
    return out;
}

$.fn.populate_task_detail = function(data) {
    try
	{	
		TASK_NO = data.details.task_no;

		let details = data.details;
		let assignees = data.assignees;

        console.log(details);

		//update detail
        $('#task_title_no').html(' - ' + TASK_NO);
        $('#task-title').html(details.task_title);

        $('#task_description').html($.fn.decodeURIComponentSafe(details.descr));
		
	}
	catch(err)
	{
		$.fn.log_error(arguments.callee.caller,err.message);
	}
}

//task initial data - accessibility
$.fn.get_task_initial_data  = function (data) {
	try {

		$.fn.fetch_data(
			$.fn.generate_parameter('get_task_detail', {task_no : data.id}),
			function(return_data) {
				let r_data = return_data.data;
				if(r_data.details == false) {
                    ROUTE.navigate('tasks');
				}else {
					$.fn.populate_task_detail(r_data);	
				}
				
			}, true, '', true
		);
		
		
	}catch (e) {
		$.fn.log_error(arguments.callee.caller, e.message);
	}	
}

$.fn.prepare_form = function()
{	
    try
    {	
        ROUTE_DATA = CURRENT_ROUTE.data;
		TASK_NO = ROUTE_DATA.id;
		$.fn.get_task_initial_data(ROUTE_DATA);
        console.log(ROUTE_DATA);
        console.log(TASK_NO);
        
        //validation
        // $('#detail_form').parsley(
        //     {
        //         classHandler: function(parsleyField) {              
        //             return parsleyField.$element.closest(".errorContainer");
        //         },
        //         errorsContainer: function(parsleyField) {              
        //             return parsleyField.$element.closest(".errorContainer");
        //         },
        //     }
        // );

        

        //$.fn.get_cutter_config();
        // $.fn.get_initial_data();
        // $.fn.get_modules_list();
        // $.fn.get_list(false);
        // $('.populate').select2();

        // $('.populate-multiple').select2({
        // 	templateResult: hideSelected,
        // });

        // let search_params = new URLSearchParams(window.location.search);
        // let user_id = search_params.get('user_id');
        // if (user_id != null)
        // {
        // 	$.fn.navigate_form(user_id);
        // }
    }
    catch(err)
    {
        console.log(err.message);
        // $.fn.log_error(arguments.callee.caller,err.message);
    }			
};
 
$.fn.bind_command_events = function() {	
    try
    {	
        //  $('#chk_is_active').change(function (e)
        //  {
        //      if ($("#chk_is_active").is(":checked")) 
        //      {
        //          $('#leave_div').hide();
        //      }
        //      else 
        //      {
        //          $('#leave_div').show();
        //      }
        //  });

        //  $('#btn_reset').click( function(e)
        //  {
        //      e.preventDefault();
        //      RECORD_INDEX = 0;
        //      $.fn.reset_form('list');
        //      $.fn.get_list(false);
        //  });

        //  $('#btn_search_action').click( function(e)
        //  {
        //      e.preventDefault();
        //      RECORD_INDEX = 0;
        //      $.fn.get_list(false);
        //  });

        //  $('#btn_load_more').click( function(e)
        //  {
        //      e.preventDefault();
        //      $.fn.get_list(true);
        //  });

        // $('#dd_task').change(function (e)
        // {
        //     let type_id = $(this).val();
        //     if (type_id != '' && type_id != null)
        //     {
        //         $.fn.get_template_details_by_id(type_id);
        //     }else {
        //         $('#txt_task_desc').html('');
        //     }
        // });

        // $('#btn_new').click(function (e) {
        //     e.preventDefault();
        //     $.fn.show_hide_form('NEW', true);
        // });

        // $('#btn_save').click(function(e) {
        //     e.preventDefault();
        //     btn_save = Ladda.create(this);
        //     btn_save.start();
        //     $.fn.save_edit_form();
        // });

        // $('#btn_search').click(function() {
        //     $('#searchPanel').show();
        //     $('#btn_search').hide();
        // });

        // $('#btn_close_search').click(function() {
        //     $('#searchPanel').hide();
        //     $('#btn_search').show();
        // });

        

        // $('#btn_cancel').click(function(e) {
        //     // $('#new_div').hide();
        //     // $('#tblList').show();
        //     e.preventDefault();
        //     $.fn.show_hide_form('BACK');
        //     RECORD_INDEX = 0;
        //     $.fn.get_list(false);
        // });

        // $('#btn_back').click(function(e) {
        //     e.preventDefault();
        //     $.fn.show_hide_form('BACK');
        //     RECORD_INDEX = 0;
        //     $.fn.get_list(false);
        // });

        
    }
    catch(err)
    {
        $.fn.log_error(arguments.callee.caller,err.message);
    }			
};
 
$.fn.form_load = function() {
    try {	
        $.fn.prepare_form();
        $.fn.bind_command_events();	
    } catch(err) {
        $.fn.log_error(arguments.callee.caller,err.message);
    }
};

$(document).ready(function() {
    try
	{	
		$.fn.form_load();
	}
	catch (err)
	{
		$.fn.log_error(arguments.callee.caller, err.message);
	}
});