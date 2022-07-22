var FORM_STATE 			= 0;
var RECORD_INDEX 		= 0;
//var SESSIONS_DATA		= '';
var last_scroll_top 	= 0;

var btn_save; btn_search = ''; FAQ_ID	='';
CURRENT_PATH			= '../../';
var FILE_UPLOAD_PATH		= ''; //file upload mandatory field

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
		//	$('#dd_faq')                .val('').multiselect('reload');
			$('#dd_faq')                .val('');
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
		$.fn.init_upload_file();
		//$.fn.intialize_fileupload('doc_upload', 'doc_upload_files');
	}
	else if(form_status == 'EDIT')
	{
		$('#list_div')					.hide(400);
		$('#new_div')					.show(400);
		$('#btn_save')					.html('<i class="fa fa-save"></i> EDIT');
		$('#new_btn_div')				.hide(400);		// newly added
		$('#col-sm12_div')				.hide(400);		// newly added
		$('#search_div')				.hide(400);
		$('#approval_div')				.hide(400);
		$.fn.init_upload_file();
		//$.fn.intialize_fileupload('doc_upload', 'doc_upload_files');
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


$.fn.populate_faq_list_report = function(data)
{
	try
	{	
		if (data)
		{
			$('#tbl_faq_report > tbody').empty();
			
			var row			= '';
			var data_val 	= '';
			for(var i = 0; i < data.length; i++)
			{
				data_val = escape(JSON.stringify(data[i]));
				
				row += `<tr>
							<td>${i+1}</td>
							<td>${data[i].question_category != null ? data[i].question_category : '-'}</td>
							<td>${data[i].category}</td>
							<td>${data[i].question}</td>
							<td>${data[i].created_by}</td>
							<td>${data[i].approver != null ? data[i].approver : '-'}</td>
							<td>${data[i].approved == 1 ? '<i class="badge bg-soft-success text-success"> Approved</i>' : '<i class="badge bg-soft-warning text-warning"> Pending</i>'}</td>
						`;
						row += '<td width="12%"><div class="button-group">';
						if(SESSIONS_DATA.is_admin = 1)
			         	{
							row += `<button type="button" class="btn btn--success btn-xs waves-effect waves-light" data-bs-toggle="tooltip" data-bs-placement="top" title="Edit" data-value="${data_val}" onclick="$.fn.populate_detail_form(decodeURIComponent('${data_val}'))">
								<i class="mdi mdi-square-edit-outline"></i>
							</button>&nbsp;`;
						}
						if(SESSIONS_DATA.is_admin = 1)
			         	{
							row += `&nbsp;
							<button type="button" class="btn btn-danger btn-xs waves-effect waves-light" data-bs-toggle="tooltip" data-bs-placement="top" title="Delete" data-value="${data_val}" onclick="$.fn.delete_form(decodeURIComponent('${data_val}'))">
								<i class="far fa-trash-alt"></i>
							</button>`;
						}
						
				/*if(SESSIONS_DATA.is_admin = 1)
				{
					row += 	`<td width="1%"><a class="tooltips" href="javascript:void(0)" data-value=${data_val} onclick="$.fn.populate_detail_form(unescape($(this).attr(\'data-value\')))" data-trigger="hover" data-original-title="Edit data "><i class="fa fa-pencil"/></a>&nbsp;&nbsp;<a class="tooltips" href="javascript:void(0)" data-value=${data_val} onclick="$.fn.delete_form(unescape($(this).attr(\'data-value\')))" data-trigger="hover" data-original-title="Delete data "><i class="fa fa-trash-o"/></a></td>`;
				}*/
				row += '</div></td>';
				row += 	`</tr>`;
			}
			$('#tbl_faq_report > tbody').html(row);
			$('#total_faq_report').html(data.length);
		} else
        {
            $("#table_pic_list").append
            (
                `<tr>
                    <td colspan="5">
                        <div class='list-placeholder' >No Records Found</div>
                    </td>
                </tr>`
            );
        }
        
 
	}
	catch(err)
	{
		$.fn.log_error(arguments.callee.caller,err.message);
	}
};


$.fn.populate_detail_form = function(data)
{
	FORM_STATE		= 1;
	$.fn.show_hide_form('EDIT');
	
	try
	{
		var data 	= JSON.parse(data);
		
		var data	= 
		{
			id 					: data.id,
			type_id				: data.type_id,
			question			: data.question,
			answer				: data.answer,	
			is_admin			: SESSIONS_DATA.is_admin,
			emp_id 				: SESSIONS_DATA.emp_id
		};
		
	 	$.fn.fetch_data
		(			
			$.fn.generate_parameter('get_faq_edit_details',data),	
			function(return_data)
			{
				if(return_data.data.details)
				{
					$('#txt_question')			.val('');
					$('#txt_answer')			.val('');	
				//	$('#dd_faq')                .val('').multiselect('reload');
					$('#dd_faq')                .val('');
					$('#dd_question_category')	.val('').change();
					$('#dd_approver')			.val('').change();
					
					var data 					= return_data.data.details;
					FAQ_ID						= data.id;
					$('#txt_question')			.val((data.question).replace(/<br>/g,"\n"));
					$('#txt_answer')			.val((data.answer).replace(/<br>/g,"\n"));	
					CKEDITOR.instances.text_editor.setData(data.answer.replace(/<br>/g,"\n"));    // newly added
					
					if(data.category_id != null)
					{
						//$('#dd_faq')				.val(data.category_id.split(',')).multiselect( 'reload' );	
						$('#dd_faq')				.val(data.category_id.split(',')).change();		
					}
					
					if(data.question_category_id != null)
					{
						$('#dd_question_category')	.val(data.question_category_id).change();	
					}
					if(data.approved_by != null)
					{
						$('#dd_approver')			.val(data.approved_by).change();	
					}
					for (let i = 0; i < data.attachment.length; i++)
					{ 
						data.attachment[i]['name'] = data.attachment[i]['filename'];
						data.attachment[i]['uuid'] = data.attachment[i]['id'];
						data.attachment[i]['deleteFileParams'] =  JSON.stringify(data.attachment[i]);
						delete data.attachment[i]['filename'];
						delete data.attachment[i]['id'];
					}
					$.fn.populate_fileupload(data,'files');
					
				}
			},true
		);

	}
	catch(err)
	{
		$.fn.log_error(arguments.callee.caller,err.message);
	}
};

$.fn.delete_form = function(data)
{
	try
	{
		data = JSON.parse(data);
				
		var data	= 
		{
			id 					: data.id,
			type_id				: data.type_id,
			question			: data.question,
			answer				: data.answer,
			is_admin			: SESSIONS_DATA.is_admin,
			emp_id 				: SESSIONS_DATA.emp_id,
			faq_id				: data.category_id
		};
		
		bootbox.confirm
		({
			title 	: "Delete Confirmation",
			message : "Please confirm before you delete.",
			buttons : 
			{
				cancel : 
				{
					label: '<i class="fa fa-times"></i> Cancel'
				},
				confirm : 
				{
					label: '<i class="fa fa-check"></i> Confirm'
				}
			},
			callback: function (result) 
			{
				
				if(result == true)
				{			
					$.fn.write_data
					(
						$.fn.generate_parameter('delete_faq_details', data),	
						function(return_data)
						{
							if(return_data)
							{
								$.fn.show_right_success_noty('Data has been deleted successfully');
								$.fn.get_faq_report();					
							}
							
						},false, btn_save
					);
				}
			}
		});

	}
	catch(err)
	{
		$.fn.log_error(arguments.callee.caller,err.message);
	}
};


$.fn.get_faq_report = function()
{
	try
	{
		var data	= 
		{
			//date_from   		: $('#from_date').val(),
           // date_to     		: $('#to_date').val(),
		    date_from		    : "2022-01-20",
		    date_to             : "2022-12-20",
            question_category   : $('#search_question_category').val(),
            category   			: $('#search_category').val(),
            question 			: $('#search_question').val(),
            status 				: $('#search_status').val(),
            created_by    		: $('#search_created_by').val(),
            approver    		: $('#search_approver').val(),
			module_id           : "73"
			
	 	};
	 										
	 	$.fn.fetch_data
		(
			$.fn.generate_parameter('get_faq_report',data),	
			function(return_data)
			{
				if(return_data)
				{	//console.log(return_data);
					$.fn.data_table_destroy('tbl_faq_report');
					$.fn.populate_faq_list_report(return_data.data);
					$.fn.data_table_features('tbl_faq_report');
				}
			},true
		);
	}
	catch(err)
	{
		console.log(err.message);
	}
};

$.fn.get_faq_list = function()
{
	try
	{
		var data	= 
		{
			is_admin		: SESSIONS_DATA.is_admin,
			emp_id			: SESSIONS_DATA.emp_id,
			//faq_id			: SESSIONS_DATA.faq_id.toString()
			faq_id			: 7
	 	};
	 	//console.log(data);											
	 	$.fn.fetch_data
		(
			$.fn.generate_parameter('view_faq_list',data),	
			function(return_data)
			{
				if(return_data)
				{	
					$.fn.data_table_destroy('tbl_view_list');
					$.fn.populate_faq_list_form(return_data.data);
					$.fn.data_table_features('tbl_view_list');
				}
			},true
		);
	}
	catch(err)
	{
		console.log(err.message);
	}
};

$.fn.populate_faq_list_form = function(data)
{
	try
	{	
		if (data)
		{
			$('#tbl_view_list > tbody').empty();
			
			var row			= '';
			var data_val 	= '';
			for(var i = 0; i < data.length; i++)
			{
				data_val = escape(JSON.stringify(data[i]));
				row += `<tr>
							<td>Q${(i+1)}</td>
							<td width="13%">${data[i].question_category != null ? data[i].question_category : '-'}</td>
							<td><b>${data[i].question}</b><br/>${data[i].answer}</td>
						</tr>`;
			}
			$('#tbl_view_list > tbody').html(row);
			$('#total_faq_list').html(data.length);
			$('.back-to-top-badge').removeClass('back-to-top-badge-visible');
		}
        
 
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
		if ($('#detail_form').parsley().validate() == false)
        {
            btn_save.stop();
            return;
        }

		var attachment = [];
       
		var question = $('#txt_question').val().replace(/\r\n|\r|\n/g,"<br>");
	    var answer	 = CKEDITOR.instances.text_editor.getData();			// newly added
	    
		var data	= 
		{
			id					: FAQ_ID,			
			question			: question,
			answer				: escape(answer),
			faq_id				: $('#dd_faq').val() ? $('#dd_faq').val().toString() : '',
			question_category_id: $('#dd_question_category').val() ? $('#dd_question_category').val().toString() : '',
			approver			: $('#dd_approver').val() ? $('#dd_approver').val().toString() : '',
			is_admin			: SESSIONS_DATA.is_admin,
			emp_id 				: SESSIONS_DATA.emp_id,	
			attachment: attachment				
	 	}; 	
		// console.log(data);
	 	$.fn.write_data
		(								
			$.fn.generate_parameter('add_edit_faq', data),	
			function(return_data)
			{
				if(return_data.data)
				{	
					faq_id 				= return_data.data;
                  // FILE_UPLOAD_PATH 	= `faq/${faq_id}/`;
				  FILE_UPLOAD_PATH = `../files/${MODULE_ACCESS.module_id}/${faq_id}/`;
                    let attachment_data =   
                    {
                        id          	: '',
                        primary_id  	: faq_id,
                        secondary_id	: 'faq',
                        module_id   	: MODULE_ACCESS.module_id,
                        filename    	: '',
                        filesize    	: "0",
                        json_field  	: {},
                        emp_id      	: SESSIONS_DATA.emp_id
                    };	
 
                    if($('#files .file-upload.new').length > 0)
                	{
                    	$.fn.upload_file('files','id',faq_id,
                    	attachment_data,function(total_files, total_success,filename,attach_return_data)
            	        {
                    		if(total_files == total_success)
                    		{	//console.log('222');
                    			$.fn.populate_fileupload(attach_return_data,'files',true);
                    		}
            	        },false);
                	}
                	
                	$.fn.show_right_success_noty('Data has been recorded successfully');
                }
				
			},false, btn_save
		);
		
	}
	catch(err)
	{
		$.fn.log_error(arguments.callee.caller,err.message);
	}
};

$.fn.load_editor = function(id)
{
	var editor = CKEDITOR.instances[id];
    if (editor) { editor.destroy(true); }

	CKEDITOR.config.contentsCss 	= CURRENT_PATH + 'assets/css/email.css';
	CKEDITOR.config.allowedContent 	= true;
    CKEDITOR.replace(id,
    {
		height		: 300
	});
};

$.fn.init_upload_file = function()
{
    $.fn.intialize_fileupload('doc_upload','files');
};

$.fn.populate_drop_down = function(drop_down_id, drop_down_values, is_search)
{
	try
	{	
		if(drop_down_id != 'dd_faq')
		{
			if(is_search)
			{
				$('#'+drop_down_id).empty().append(`<option value="">All</option>`);
			}
			else
			{
				$('#'+drop_down_id).empty().append(`<option value="">Please Select</option>`);
			}
		}
        for (let item of drop_down_values)
        {
            $('#'+drop_down_id).append(`<option value="${item.id}">${item.descr}</option>`);
        }
        $('#'+drop_down_id).val('').change();
	}
	catch(err)
	{
		$.fn.log_error(arguments.callee.caller,err.message);
	}
};


$.fn.get_faq_drop_down_values = function()
{
	try
	{
		$.fn.fetch_data
		(
			$.fn.generate_parameter('get_faq_drop_down_values'),
			function(return_data)
			{
				if (return_data.code == 0)
                {
                    //for search
                    $.fn.populate_drop_down('search_question_category', return_data.data.question_category, true);
					$.fn.populate_drop_down('search_category', return_data.data.category, true);
					$.fn.populate_drop_down('search_created_by', return_data.data.created_by, true);
					$.fn.populate_drop_down('search_approver', return_data.data.approver, true);

					//for add/edit form
					$.fn.populate_drop_down('dd_question_category', return_data.data.question_category, false);
					$.fn.populate_drop_down('dd_faq', return_data.data.category, false);
					$.fn.populate_drop_down('dd_approver', return_data.data.approver, false);

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
	
		
		$('#detail_form').parsley
		({
        	successClass	: 'has-success',
        	errorClass		: 'has-error',
        	errors			: 
        	{
            	classHandler: function(el) 
            	{
                	return $(el).closest('.error-container');
            	},
				container: function(el) 
            	{
                	return $(el).closest('.form-group');
            	},
            	errorsWrapper	: '<ul class=\"help-block list-unstyled\"></ul>',
            	errorElem		: '<li></li>'
        	}
    	});
		
		if(SESSIONS_DATA.is_admin == 1)
		{
			$('#new_btn_div')	.show(400);
		}
		else
		{
			$('#new_btn_div')	.hide(400);
		}
					
		$('.populate').select2();
        $.fn.load_editor('text_editor');

     
        if(SESSIONS_DATA.is_admin == 1)
		{
	        $.fn.get_faq_drop_down_values();
			$.fn.get_faq_report();
		}
		else
		{
			$.fn.get_faq_list();
		}
		$('#dp_search_date span').html(moment().startOf('year').format('MMMM D, YYYY') + ' - ' + moment().endOf('year').format('MMMM D, YYYY'));
		$('#from_date').val(moment().startOf('year').format('YYYY-MM-DD'));
		$('#to_date').val(moment().endOf('year').format('YYYY-MM-DD'));
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
     	
     	if(SESSIONS_DATA.is_admin == 1)
		{
     		$('#btn_new')	.show(400);
		}
		else
		{
			$('#btn_new')	.hide(400);
		}
	}
	catch(err)
	{
		$.fn.log_error(arguments.callee.caller,err.message);
	}
};

$.fn.bind_command_events = function()
{
	try
	{			
		$('#btn_hide').click( function(e)
		{
			e.preventDefault();
			$.fn.show_hide_form('HIDE');
			$.fn.get_faq_report();
		});
		
		$('#btn_new').click( function(e)
		{
			e.preventDefault();
			$.fn.reset_form('form');
			$.fn.show_hide_form('NEW');
			$('#new_btn_div')				.hide(400); //newly added
			$('#col-sm12_div')				.hide(400); //newly added	
			$('#list_div').hide(400);											
		});
		
		$('#btn_search_action').click(function (e)
        {
            e.preventDefault();
            RECORD_INDEX = 0;
            $.fn.get_faq_report(false);
        });
    
		$('#btn_reset').click( function(e)
		{
			/*e.preventDefault();
			$.fn.reset_form('form');*/
			e.preventDefault();
            $.fn.reset_form('list');
            RECORD_INDEX = 0;
            $.fn.get_faq_list(false);
		});

		$('#btn_search_reset').click( function(e)
		{
			e.preventDefault();
			$.fn.reset_form('list');
		});

		$('#btn_search').click( function(e)
		{
			
			$('#searchPanel').show();
			$('#btn_search').hide();
		});

		$('#btn_close_search').click(function()
		{
			$('#searchPanel').hide();
			$('#btn_search').show();
		});

		$('#btn_back, #btn_cancel').click(function (e)
        {
            e.preventDefault();
            $.fn.show_hide_form('BACK');
            RECORD_INDEX = 0;
            $.fn.get_faq_report(false);
            ROUTE_DATA = '';
            ROUTE.navigate("faqs/report");
            ROUTE.resolve();
        });

		$('#btn_load_more').click(function (e)
        {
            e.preventDefault();
            $.fn.get_faq_report(true);
        });
			
		$('#btn_save').click( function(e)
		{
			e.preventDefault();
			btn_save = Ladda.create(this);
	 		btn_save.start();       
			$.fn.save_edit_form();
		});
		
		$("#dp_search_date").flatpickr({
            mode:"range",
            altFormat: "d-M-Y",
            dateFormat: "Y-m-d",
            onChange:function(selectedDates){
                var _this=this;
                var dateArr=selectedDates.map(function(date){return _this.formatDate(date,'Y-m-d');});
                $('#from_date').val(dateArr[0]);
                $('#to_date').val(dateArr[1]);
            },
        });

		$.fn.init_upload_file();

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