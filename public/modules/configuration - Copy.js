var btn_save,btn_hp_save,btn_ph_upload,btn_save_upload_batch; 
var ROW_ID			= '';
CURRENT_PATH		= '../../';
var FILE_UPLOAD_PATH        = ''; //file upload mandatory field



$.fn.reset_form = function(form)
{
	try
	{
		ROW_ID					= '';
		$('#txt_desc')			.val('');
		$('#txt_onboarding_cost').val('');

		if(form == true)
		{
			$('#txt_onboarding_cost').val('');
			$('#div_roles')		.hide();
			$('#div_dependent')	.hide();
			$('#div_onboarding').hide();
			$('#div_tasks')		.hide();
			$('#div_noOfDays')	.hide();

			$('#chk_is_active')	.prop('checked',false);
			$('#chk_is_chargeable')	.prop('checked',false);

		}


		if(form == 'holiday')
		{
			$('#dp_hp')			.val('');
			$('#dp_hp').datepicker
	        ({
	            autoclose		: true,
	            todayHighlight	: true
	        }).datepicker("setDate", new Date());
			
			$('#txt_hp_desc')		.val('');
			$('#chk_hp_is_active')	.prop('checked',false);
			$('#btn_hp_save')		.html('<i class="fa fa-check"></i>Save');
		}
		if(form == 'holiday')
		{
			
		}
		
		
		$('#txt_no_of_days')	.val('');
		$('#dd_roles')			.val('').change();
		$('#txt_sla')			.val('');
		$('#txt_kpi')			.val('');
		
		$('#txt_6_months')		.val('');
		$('#txt_7_months')		.val('');
		
		$('#btn_save')			.html('<i class="fa fa-check"></i>Save');
		$('#div_noOfDays')		.hide();
		
	}
	catch(err)
	{
		$.fn.log_error(arguments.callee.caller,err.message);
	}
}

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
		$('.country').select2();
		 $(document).on('select2:open', () => {
    document.querySelector('.select2-search__field').focus();
  });
  
   $('input[data-provide="datepicker"]').datepicker({
    format: 'dd/mm/yyyy',
    todayHighlight:'TRUE',
    autoclose: true,
})

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