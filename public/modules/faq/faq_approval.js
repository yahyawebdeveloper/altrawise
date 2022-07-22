var FORM_STATE 			= 0;
var RECORD_INDEX 		= 0;
//var SESSIONS_DATA		= '';
var last_scroll_top 	= 0;

var btn_save; btn_search = ''; FAQ_ID	='';
CURRENT_PATH			= '../../';

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

$.fn.get_faq_approval_list = function()
{
	try
	{
		var data	= 
		{
			is_admin			: SESSIONS_DATA.is_admin,
			emp_id				: SESSIONS_DATA.emp_id,
			//faq_id				: SESSIONS_DATA.faq_id.toString()
			faq_id				: 7
		};
													
	 	$.fn.fetch_data
		(
			$.fn.generate_parameter('get_faq_approval_list',data),	
			function(return_data)
			{
				if(return_data.data)
				{	
					var row			= '';
					var data_val 	= '';
					var data 		= return_data.data;
					for(var i = 0; i < data.length; i++)
					{
						data_val = escape(JSON.stringify(data[i]));
						
						row += `<tr ID="tr_row_"${i}>
									<td>${data[i].question_category}</td>
									<td>${data[i].category}</td>
									<td><b>${data[i].question}</b><br/>${data[i].answer}<div id="faq_list_${i}"></div></td>
									<td><button class="btn-success btn-xs" data-value=${data_val} onclick="$.fn.do_approve( unescape($(this).attr(\'data-value\')), $(this).closest(\'tr\').prop(\'id\') )" name="btn_approve">Approve</button></td>
								</tr>`;
					}
					$('#tbl_approver_list > tbody').html(row);
					for(var i = 0; i < data.length; i++)
					{   
						for (let j = 0; j < data[i].attachment.length; j++)
						{ 
							data[i].attachment[j]['name'] = data[i].attachment[j]['filename'];
							data[i].attachment[j]['uuid'] = data[i].attachment[j]['id'];
							data[i].attachment[j]['deleteFileParams'] =  JSON.stringify(data[i].attachment[j]);
							delete data[i].attachment[j]['filename'];
							delete data[i].attachment[j]['id'];
							
						}
						$.fn.populate_fileupload(data[i],'faq_list_'+i);
						
					}
					$('#total_faq_approvals').html(data.length);
				} else
				{
					$("#tbl_approver_list").append
					(
						`<tr>
							<td colspan="5">
								<div class='list-placeholder' >No Records Found</div>
							</td>
						</tr>`
					);
				}
			},true
		);
	}
	catch(err)
	{
		console.log(err.message);
	}
};
$('#btn_load_more').click(function (e)
{
	e.preventDefault();
	$.fn.get_faq_approval_list(true);
});
$.fn.do_approve = function(data, table_row_id)
{
	try
	{
		data = JSON.parse(data);
				
		var data	= 
		{
			id 					: data.id
		};
		
		bootbox.confirm
		({
			title 	: "Approve Confirmation",
			message	: "Please confirm before you approve.",
			buttons	: 
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
						$.fn.generate_parameter('approve_faq_details', data),	
						function(return_data)
						{
							if(return_data)
							{
								$.fn.show_right_success_noty('Data has been approved successfully');
								$.fn.remove_table_row(table_row_id);

								$('#total_faq_approvals').html(parseInt($('#total_faq_approvals').html()) - 1);

							}
							
						},false
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

$.fn.prepare_form = function()
{	
	try
	{
		$.fn.get_faq_approval_list();
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