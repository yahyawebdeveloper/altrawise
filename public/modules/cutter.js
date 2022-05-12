/**
 * @author Jamal
 * @date 01-Oct-2021
 * @Note = Please do not apply Ctr-Alt-Format for better readable codes
 *         Please follow the indentation
 *         Please follow the naming convention
 */
var RECORD_INDEX 	= 0;
var upload_section 	= '';
var btn_save;

$(window).on('beforeunload', function ()
{
	// Temporary disable
	// $.fn.signout_application();
	// $.fn.user_logout();	
});

$.fn.reset_form = function(form)
{
	try
	{
		FORM_STATE		= 0;		
		if(form == 'list')
		{
			$('#txt_cutter_no_search')		.val('');
			$('#txt_cutter_desc_search')	.val('');
			$('#txt_remarks_search')		.val('');
			$('#dd_cutter_category_search')	.val('').change();
			$('#txt_ups_search')			.val('');
		}
		else if(form == 'form')
		{				
			$('#txt_cutter_no')		.val('');
			$('#txt_cutter_desc')	.val('');							
			$('#dd_cutter_category').val('').change();			
			$('#txt_ups')			.val('');
			$('#txt_remarks')		.val('');
			$('#cutter_image')		.html('');
			$('#hidden_filename')  	.val('');				
			$('.form-group').each(function () { $(this).removeClass('has-error'); });
			$('.help-block').each(function () { $(this).remove(); });
			$('#leave_div').hide();
		}

	}
	catch(err)
	{
		$.fn.log_error(arguments.callee.caller,err.message);
	}
};

$.fn.get_list = function(is_scroll)
{
	try
	{	
		var SESSIONS_DATA = $.jStorage.get('session_data');
		var data	= 
		{
			cutter_no 			: $('#txt_cutter_no_search').val(),
			cutter_desc			: $('#txt_cutter_desc_search')	.val(),
			remarks 			: $('#txt_remarks_search')	.val(),
			cutter_ctg_id 		: $('#dd_cutter_category_search').val(),
			ups					: $('#txt_ups_search').val(),
			is_image_available 	: $('#dd_is_image').val(),
			start_index			: RECORD_INDEX,
			limit				: LIST_PAGE_LIMIT,			
			emp_id				: SESSIONS_DATA.emp_id
	 	};
	 	if(is_scroll)
	 	{
	 		data.start_index =  RECORD_INDEX;
	 	}
	 										
	 	$.fn.fetch_data
		(
			$.fn.generate_parameter('get_employee_list',data),	
			function(return_data)
			{
				if(return_data)
				{	
					console.log(return_data);
					if(return_data.data.rec_index)
					{
						RECORD_INDEX = return_data.data.rec_index;
					}
					//$.fn.data_table_destroy();
					$.fn.populate_list_form(return_data.data.list, is_scroll);
					//$.fn.data_table_features();
				}
			},true
		);
	}
	catch(err)
	{
		$.fn.log_error(arguments.callee.caller,err.message);
	}
};

$.fn.populate_list_form = function(data,is_scroll)
{
	try
	{	
		if (data) // check if there is any data, precaution 
		{
			if(is_scroll == false)
			{
				$('#tbl_list > tbody').empty();
			}
			
			var row			= '';
			var data_val 	= '';
			for(var i = 0; i < data.length; i++)
			{
				data_val = escape(JSON.stringify(data[i])); //.replace(/'/,"");				
				photo_content = '<a href="../../services/files/cutter_image/' + data[i].cutter_image_path  + '" target=_blank><img src="../../services/files/cutter_image/' + data[i].cutter_image_path  + '" width="100" /></a>';
				photo_content = '';
					
				row += `<tr>
							<td><a href="javascript:void(0);" class="action-icon"> <i class="mdi mdi-square-edit-outline"></i></a>
							<td>${data[i].cutter_no}</td> 
							<td>${data[i].cutter_desc}</td> 
							<td>${data[i].ups}</td> 
							<td>${data[i].cutter_ctg_name}</td> 
							<td>${data[i].remarks}</td> 
							<td>${data[i].active_status ? '<span class="badge badge-soft-success">Active</span>' : '<span class="badge badge-soft-danger">InActive</span>'}</td> 
							<td>${photo_content}</td> 
							<td>${data[i].created_by}</td>
							<td>${data[i].created_date}</td>
						'</tr>`;	
							
			}
			$('#tbl_list tbody').append(row);
			$('.back-to-top-badge').removeClass('back-to-top-badge-visible');
		}

	}
	catch(err)
	{
		$.fn.log_error(arguments.callee.caller,err.message);
	}
};

$.fn.get_cutter_config = function()
{
    try
    {   
        $.fn.fetch_data
        (
            $.fn.generate_parameter('get_cutter_config', {}),
            function(return_data)
            {	
				// console.log(return_data);
				if (return_data.code == 0)
                {   
                    $.fn.populate_dd('dd_cutter_category_search', return_data.data.cutter_category, true);
					$.fn.populate_dd('dd_cutter_category', return_data.data.cutter_category);
                }
            },true
        );
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
		$('#detail_form').parsley(
			{
				classHandler: function(parsleyField) {              
					return parsleyField.$element.closest(".errorContainer");
				},
				errorsContainer: function(parsleyField) {              
					return parsleyField.$element.closest(".errorContainer");
				},
			}
		);

		
		//$.fn.get_cutter_config();
		$.fn.get_list(false);
		$('.populate').select2();
	}
	catch(err)
	{
		$.fn.log_error(arguments.callee.caller,err.message);
	}			
};

$.fn.save_edit_form = function()
{
	try
	{	
		if($('#detail_form').parsley().validate() == false)
		{	
			btn_save.stop();
			return;
		}

		var SESSIONS_DATA = $.jStorage.get('session_data');
						
		var data	= 
		{
			//id					: EMP_ID,
			cutter_id			: $('#txt_cutter_id').val(),
			cutter_no			: $('#txt_cutter_no').val(),
			cutter_desc			: $('#txt_cutter_desc').val(),
			cutter_ctg_id		: $('#dd_cutter_category').val(),	
			ups					: $('#txt_ups').val(),
			remarks				: $('#txt_remarks').val(),	
			emp_id 				: SESSIONS_DATA.emp_id,
			
	 	};
		
		$.fn.write_data
			(								
				$.fn.generate_parameter('add_edit_cutter', data),	
				function(return_data)
				{
					if(return_data.data)
					{
						CUTTER_ID = return_data.data.cutter_id;
						$.fn.set_edit_form();
						$('#h4_primary_no').text('Cutter Number : ' + return_data.data.cutter_no);
						$.fn.show_right_success_noty('Data has been recorded successfully');
						$('#cutter_details')	.show();
					}
					
				},false, btn_save
		);
		
	}
	catch(err)
	{
		$.fn.log_error(arguments.callee.caller,err.message);
	}
};

$.fn.set_edit_form = function(data)
{
	FORM_STATE		= 1;
	$('#btn_save')			.html('<i class="fa fa-edit"></i> Edit');
};

$.fn.bind_command_events = function()
{	
	try
	{	
		$('#btn_reset').click( function(e)
		{
			e.preventDefault();
			RECORD_INDEX = 0;
			$.fn.reset_form('list');
			$.fn.get_list(false);
		});

		$('#btn_search_action').click( function(e)
		{
			e.preventDefault();
			RECORD_INDEX = 0;
			$.fn.get_list(false);
		});

		$('#btn_load_more').click( function(e)
		{
			e.preventDefault();
			$.fn.get_list(true);
		});

		$('#btn_save').click( function(e)
		{
			e.preventDefault();
			btn_save = Ladda.create(this);
	 		btn_save.start();
			$.fn.save_edit_form();
		});

		$('#btn_search').click(function()
		{
			$('#searchPanel').show();
			$('#btn_search').hide();
		});

		$('#btn_close_search').click(function()
		{
			$('#searchPanel').hide();
			$('#btn_search').show();
		});

		$('#btn_add').click(function()
		{
			$('#addForm').show();
			$('#tblList').hide();
		});

		$('#btn_cancel').click(function()
		{
			$('#addForm').hide();
			$('#tblList').show();
		});
	}
	catch(err)
	{
		$.fn.log_error(arguments.callee.caller,err.message);
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