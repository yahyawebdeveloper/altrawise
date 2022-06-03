var FORM_STATE 			= 0;
var RECORD_INDEX 		= 0;
//var SESSIONS_DATA		= '';
var last_scroll_top 	= 0;

var btn_save; btn_search = ''; FAQ_ID	='';
CURRENT_PATH			= '../../';
console.log(SESSIONS_DATA);		
$.fn.data_table_features = function(table_id)
{
	try
	{
		if (!$.fn.dataTable.isDataTable('#'+table_id) )
		{
			table = $('#'+table_id).DataTable
			({
				"searching"	: false,
				"paging"	: false,
				"info"		: false,
				"order"		: [[ 0, "asc" ]]
			});
		}
	}
	catch(err)
	{
		$.fn.log_error(arguments.callee.caller,err.message);
	}
};

$.fn.data_table_destroy = function(table_id)
{
	try
	{
		if ($.fn.dataTable.isDataTable('#'+table_id) )
		{
			table.destroy();
		}
	}
	catch(err)
	{
		$.fn.log_error(arguments.callee.caller,err.message);
	}
};

$.fn.set_edit_form = function(data)
{
	FORM_STATE		= 1;
	$('#new_div')			.show(400); 
	$('#btn_save')			.html('<i class="fa fa-edit"></i> Edit');
};

$.fn.reset_form = function(form)
{
	try
	{
		FORM_STATE		= 0;
		FAQ_ID			= '';		
		if(form == 'form')
		{				
			
			$('#txt_question')			.val('');
			$('#txt_answer')			.val('');	
			$('#dd_faq')				.val('').change();
			$('#dd_question_category')	.val('').change();	
			$('#dd_approver')			.val('').change();	
			$('.form-group').each(function () { $(this).removeClass('has-error'); });
			$('.help-block').each(function () { $(this).remove(); });
			$('#btn_save')			.html('<i class="fa fa-save"></i> Save');
			CKEDITOR.instances.text_editor.setData(""); // newly added
			
	    }	
	    else if(form == 'list')
        {
        	$('#search_question')						.val('');
            $('#search_question_category option:eq(0)')	.prop('selected',true).change();
            $('#search_category option:eq(0)')			.prop('selected',true).change();
            $('#search_created_by option:eq(0)')		.prop('selected',true).change();
            $('#search_status option:eq(0)')			.prop('selected',true).change();
            $('#search_approver option:eq(0)')			.prop('selected',true).change();
        }
	}
	catch(err)
	{
		$.fn.log_error(arguments.callee.caller,err.message);
	}
};

$.fn.show_hide_form = function(form_status)
{		
	if(form_status == 'NEW')
	{
		$('#new_div')					.show(400);
		$('#h4_primary_no')				.text('New FAQ');
		$('#search_div')				.hide(400);
		$('#approval_div')				.hide(400);
	}
	else if(form_status == 'EDIT')
	{
		$('#new_div')					.show(400);
		$('#btn_save')					.html('<i class="fa fa-save"></i> EDIT');
		$('#new_btn_div')				.hide(400);		// newly added
		$('#col-sm12_div')				.hide(400);		// newly added
		$('#search_div')				.hide(400);
		$('#approval_div')				.hide(400);
		$.fn.init_upload_file();
	}
	else if(form_status == 'HIDE')
	{
		$('#new_div')					.hide(400);
		$('#new_btn_div')				.show(400);		// newly added
		$('#col-sm12_div')				.show(400);		// newly added
		$('#search_div')				.show(400);	
		$('#approval_div')				.show(400);	
	}
};

$.fn.get_faq_list = function(is_scroll)
{
	try
	{ 
		var data	= 
		{
			is_admin		: SESSIONS_DATA.is_admin,
			emp_id			: SESSIONS_DATA.emp_id,
			//faq_id			: encodeURIComponent(JSON.stringify(SESSIONS_DATA.faq_id)) 
			faq_id			: 7
	 	};
	    
		if (is_scroll)
        {
            data.start_index = RECORD_INDEX;
        }
	 	$.fn.fetch_data
		(
			$.fn.generate_parameter('view_faq_list',data),	
			function(return_data)
			{
				if(return_data)
				{	
					var len = return_data.data.length;
					if (return_data.data.rec_index)
                    {
                        RECORD_INDEX = return_data.data.rec_index;
                    }
					if (return_data.code == 0 && len != 0)
                    {
                        $.fn.data_table_destroy();
                        $.fn.populate_faq_list_form(return_data.data, is_scroll);
                        $.fn.data_table_features();
                        $('#btn_load_more').show();
                    }
					else if (return_data.code == 1 || len == 0)
                    {
                        if (!is_scroll)
                        {
                            $('#btn_load_more').hide();
                            $.fn.data_table_destroy();
                            $('#tbl_list tbody').empty().append
                                (
                                    `<tr>
                                        <td colspan="8">
                                            <div class="list-placeholder">No records found!</div>
                                        </td>
                                    </tr>`
                                );
                            $.fn.show_right_error_noty('No records found');
                        }
                        else if (is_scroll)
                        {
                            $('#btn_load_more').hide();
                            $.fn.show_right_success_noty('No more records to be loaded');
                        }
                    }

					//$.fn.data_table_destroy('tbl_view_list');
					//$.fn.populate_faq_list_form(return_data.data,is_scroll);
					//$.fn.data_table_features('tbl_view_list');
				}
			},true
		);
	}
	catch(err)
	{
		console.log(err.message);
	}
};

$.fn.populate_faq_list_form = function(data,is_scroll)
{
	try
	{	
		if (data)
		{
			if(is_scroll == false)
			{
				$('#tbl_list > tbody').empty();
			}
			
			var row			= '';
			var data_val 	= '';
			for(var i = 0; i < data.length; i++)
			{
				data_val = escape(JSON.stringify(data[i]));
				row += `<tr>
							<td>Q${(i+1)}</td>
							<td width="13%">${data[i].question_category != null ? data[i].question_category : '-'}</td>
							<td width="13%">${data[i].category}</td>
							<td><b>${data[i].question}</b><br/>${data[i].answer}<div id="faq_list_${i}"></div></td>
						</tr>`;
			}
			$('#tbl_view_list > tbody').html(row);
			$('#div_load_more').show();
			for(var i = 0; i < data.length; i++)
			{
				$.fn.populate_fileupload(data[i],'faq_list_'+i);
			}
			$('#total_faq_list').html(data.length);
		}
        
 
	}
	catch(err)
	{
		$.fn.log_error(arguments.callee.caller,err.message);
	}
};

$('#btn_load_more').click(function (e)
{
	e.preventDefault();
	$.fn.get_faq_list(true);
});

$.fn.prepare_form = function()
{	
	try
	{
		$.fn.get_faq_list();
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
    }
	catch(err)
	{
		$.fn.log_error(arguments.callee.caller,err.message);
	}
};

// START of Document initialization
$(document).ready(function() 
{	
	$.fn.form_load();
});
// END of Document initialization