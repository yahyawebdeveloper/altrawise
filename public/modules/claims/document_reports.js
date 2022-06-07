var RECORD_INDEX = 0;
DOC_NO = '';
CLIENT_ID = '';
CONTACT_ID = '';
CURRENT_PATH = '../../';
var FILE_UPLOAD_PATH = ''; //file upload mandatory field
var CLIENTS_MODULE_ACCESS = '';
var APPROVALS = '';
var APPROVALS_SELECTED = '';
//var SESSIONS_DATA = '';
var TO_EMP_ID = 0;
var btn_save, btn_save_remarks, btn_verify_approve;

var drop_down_values = [];

var fields_with_drop_down = ['category_id'
	, 'approved_by'
	, 'verified_by'
	, 'created_by'
	, 'is_active'
];
var fields_with_datepicker = ['doc_date'
	, 'created_date'
];
var fields_with_numbers = ['cost'
	, 'gst'
	, 'roundup'
	, 'total'
];

$.fn.data_table_features = function ()
{
    try
    {
        var table = $('#tbl_list').DataTable
				({
					"searching": false,
					"paging": false,
					"info": false,
					"order": []
				});

			/* var buttons = new $.fn.dataTable.Buttons(table, {
				buttons: [
					{
						text: '<i class="fa fa-cog"></i>',
						className: 'dd',
						extend: 'colvis',
						columns: ':not(:first-child)',
						columnText: function (dt, idx, title)
						{
							return '<label class="checkbox-inline pull-left"><input type="checkbox" class="colvisCheckbox" checked>&nbsp' + title + '</label>';
						}
					}
				]
			}).container().insertAfter($('.btn-toolbar .btn-group')); */
    }
    catch (err)
    { //console.log(err.message);
        $.fn.log_error(arguments.callee.caller, err.message);
    }
};

/* $.fn.data_table_features = function ()
{
	try
	{

		if (!$.fn.dataTable.isDataTable('#tbl_list'))
		{

			table = $('#tbl_list').DataTable
				({
					"searching": false,
					"paging": false,
					"info": false,
					"order": []
				});

			var buttons = new $.fn.dataTable.Buttons(table, {
				buttons: [
					{
						text: '<i class="fa fa-cog"></i>',
						className: 'dd',
						extend: 'colvis',
						columns: ':not(:first-child)',
						columnText: function (dt, idx, title)
						{
							return '<label class="checkbox-inline pull-left"><input type="checkbox" class="colvisCheckbox" checked>&nbsp' + title + '</label>';
						}
					}
				]
			}).container().insertAfter($('.btn-toolbar .btn-group'));
		}
	}
	catch (err)
	{  console.log(err.message);
		//$.fn.log_error(arguments.callee.caller, err.message);
	}
}; */

$.fn.data_table_destroy = function ()
{
	try
	{
		if ($.fn.dataTable.isDataTable('#tbl_list'))
		{
			table.destroy();
		}
	}
	catch (err)
	{
		$.fn.log_error(arguments.callee.caller, err.message);
	}
};

$.fn.reset_form = function (form)
{
	try
	{
		$('#search_field').val('').change();
		$('#search_condition').val('').change();
	}
	catch (err)
	{
		$.fn.log_error(arguments.callee.caller, err.message);
	}
};

$.fn.populate_list_form = function (data, is_scroll)
{
	try
	{
		var row = '';
		var data_val = '';

		var allow_verify = MODULE_ACCESS.verify; //SESSIONS_DATA.allow_verify;
		var allow_approve = MODULE_ACCESS.approve; //SESSIONS_DATA.allow_approve;

		if (is_scroll == false)
		{
			$('#tbl_list > tbody').empty();
		}

		if (data.length > 0) // check if there is any data, precaution
		{
			let row = '';
			let data_val = '';

			if (data.rec_index)
			{
				RECORD_INDEX = data.rec_index;
			}

			data = data;
			for (var i = 0; i < data.length; i++)
			{	
				//var date = moment(data[i].doc_date, 'DD-MM-YYYY');
				data_val = escape(JSON.stringify(data[i])); //.replace(/'/,"");
				//row += '<tr>' + '<td width="10%">';

				let btn_attachment = '';
				if (data[i].attachment.length > 0)
				{
					let func = `$.fn.open_page('${data[i].attachment[0].id}','${CURRENT_PATH}download.php')`;
					btn_attachment = `<a href="javascript:void(0)" class="link-view-file btn btn-outline-info btn-xs waves-effect waves-light" onclick="${func}"><i class="fas fa-image"/></a>`;
				}
				
				row += '<tr id="TR_ROW_' + i + '">' +
				'<td>' + btn_attachment + '</td>' +
				'<td>' + data[i].doc_no + '</td>' +
				'<td>' + data[i].created_by + '</td>' +
				'<td>' + data[i].doc_date + '</td>' +
				'<td>' + data[i].descr + '</td>' +
				'<td><button type="button" class="btn btn-outline-primary btn-xs waves-effect waves-light btn_view_details" id="btn_remark" data-value=\'' + data_val + '\' onclick="$.fn.view_remark(unescape($(this).attr(\'data-value\')))">View</button></td>';

				if (data[i].verified == 0)
				{
					row += '<td>-</td>';
					row += '<td>';
					if (allow_verify == 1)
					{
						row += '<button class="btn btn-outline-warning btn-xs waves-effect waves-light btn_view_details" data-value=\'' + data_val + '\' onclick="$.fn.do_verify( unescape($(this).attr(\'data-value\')), $(this).closest(\'tr\').prop(\'id\') )" name="btn_search">Verify</button>';
					}
					else
					{
						row += '-';
					}
					row += '</td>';
				}
				else if (data[i].verified == 1 && data[i].approved == 0)
				{
					row += '<td><span class="text-success">Verified</span></td>';
					row += '<td>';
					if (allow_verify == 1)
					{
						row += '<button class="btn btn-outline-danger btn-xs waves-effect waves-light btn_view_details" data-value=\'' + data_val + '\' onclick="$.fn.cancel_verify( unescape($(this).attr(\'data-value\')), $(this).closest(\'tr\').prop(\'id\') )" name="btn_cancel">Cancel</button>';
						//row += '<a  class="tooltips" href="javascript:void(0)" data-value=\'' + data_val + '\' onclick="$.fn.cancel_verify(unescape($(this).attr(\'data-value\')),false)">Cancel</a><br>';
					}
					if (allow_approve == 1 && (data[i].category_id == 5 || data[i].category_id == 6 || data[i].category_id == 7))
					{
						row += '<br><button class="btn btn-outline-success btn-xs waves-effect waves-light btn_view_details mt-1" data-value=\'' + data_val + '\' onclick="$.fn.do_approve( unescape($(this).attr(\'data-value\')), $(this).closest(\'tr\').prop(\'id\') )" name="btn_approve">Approve</button>';

						//row += '<input type="checkbox" id="chk_is_approve" name="chk_is_approve" data-value=\'' + data_val + '\' onchange="$.fn.do_approve(unescape($(this).attr(\'data-value\')),$(this).is(\':checked\'))"> Approve';
					}
					else if (allow_verify != 1)
					{
						row += '-';
					}
					row += '</td>';
				}
				else if (data[i].verified == 1 && data[i].approved == 1)
				{
					row += '<td><span class="text-success">Approved</span></td>';
					row += '<td>';
					if (allow_approve == 1 && (data[i].category_id == 5 || data[i].category_id == 6 || data[i].category_id == 7))
					{
						row += '<button class="btn btn-outline-danger btn-xs waves-effect waves-light btn_view_details" data-value=\'' + data_val + '\' onclick="$.fn.cancel_approve( unescape($(this).attr(\'data-value\')), $(this).closest(\'tr\').prop(\'id\') )" name="btn_cancel">Cancel</button>';
						//row += '<a  class="tooltips" href="javascript:void(0)" data-value=\'' + data_val + '\' onclick="$.fn.cancel_approve(unescape($(this).attr(\'data-value\')),false)">Cancel</a>';
					}
					else
					{
						row += '-';
					}
					row += '</td>';
				}
				row += '</tr>';
			}
			$('#tbl_list tbody').append(row);
			$('.load-more').show();

			
		}
	}
	catch (err)
	{
		//console.log(err.message);
		$.fn.log_error(arguments.callee.caller,err.message);
	}
};




$.fn.populate_remark_list_form = function (data)
{
	try
	{
		if (data) // check if there is any data, precaution
		{
			var row = '';
			var data_val = '';
			$('#tbl_remark_list tbody').html('');

			for (var i = 0; i < data.length; i++)
			{
				data_val = escape(JSON.stringify(data[i]));

				row += '<tr>' +
					'<td><a class="tooltips" href="javascript:void(0)" data-value=\'' + data_val + '\' onclick="$.fn.delete_form(unescape($(this).attr(\'data-value\')))" data-trigger="hover" data-original-title="Delete data "><i class="fas fa-trash-alt"/></a></td>' +
					'<td>' + data[i].doc_remarks + '</td>' +
					'<td>' + data[i].created_by + '</td>' +
					'<td>' + data[i].created_date + '</td>' +
					'<td>' + data[i].action + '</td>';
				row += '</tr>';

			}
			$('#tbl_remark_list tbody').html(row);
			$('.back-to-top-badge').removeClass('back-to-top-badge-visible');
		}
		else
		{
			$('#tbl_remark_list > tbody').empty();
		}
	}
	catch (err)
	{  //console.log(err.message);
		$.fn.log_error(arguments.callee.caller, err.message);
	}
};

$.fn.delete_form = function (data)
{
	try
	{
		data = JSON.parse(data);
		if (data.id == '')
		{
			$.fn.show_right_error_noty('Remark ID cannot be empty');
			return;
		}

		var data =
		{
			id: data.id,
			doc_no: data.doc_no,
			emp_id: SESSIONS_DATA.emp_id
		};

		$.fn.write_data
			(
				$.fn.generate_parameter('delete_remark', data),
				function (return_data)
				{
					if (return_data)
					{
						$('#tbl_remark_list > tbody').empty();
						$.fn.populate_remark_list_form(return_data.data, false);
						$.fn.show_right_success_noty('Data has been deleted successfully');
					}

				}, false, btn_save
			);
	}
	catch (err)
	{  //console.log(err.message);
		$.fn.log_error(arguments.callee.caller, err.message);
	}
};

$.fn.open_file = function (data)
{
	try
	{
		data = JSON.parse(data);
		if (data.filepath == '')
		{
			$.fn.show_right_error_noty('Document path cannot be empty');
			return;
		}

		window.open(data.filepath);

		var data =
		{
			doc_no: data.doc_no,
			emp_id: SESSIONS_DATA.emp_id
		};

		$.fn.write_data
			(
				$.fn.generate_parameter('mark_viewed_document', data),
				function (return_data)
				{

				}, true
			);
	}
	catch (err)
	{  //console.log(err.message);
		$.fn.log_error(arguments.callee.caller, err.message);
	}
};

$.fn.get_list = function (is_scroll)
{
    try
    {

		var post_values = [];
		var param = { 
			emp_id: SESSIONS_DATA.emp_id, 
			view_all: MODULE_ACCESS.viewall, // SESSIONS_DATA.allow_contract_view_all,
            start_index: RECORD_INDEX,
            limit: LIST_PAGE_LIMIT,
            is_admin: SESSIONS_DATA.is_admin
		};
		$("#detail_form .condition-row").each(function ()
		{
			var data = {};

			if ($(this).find("[name='search_field']").val() != '')
			{
				data.search_field = $(this).find("[name='search_field']").val();
				data.search_condition = $(this).find("[name='search_condition']").val();

				if (data.search_condition == 'like')
				{
					data.search_value = "%" + $.trim($(this).find("[name='search_value']").val()) + "%";
				}
				else
				{
					data.search_value = $.trim($(this).find("[name='search_value']").val());
				}
				post_values.push(data);
			}
		});
		param.post_values = post_values;
        if (is_scroll)
        {
            param.start_index = RECORD_INDEX;
        }

        $.fn.fetch_data(
            $.fn.generate_parameter('get_document_list_for_approval', param),
            function(return_data) { console.log(return_data);
                if (return_data.data) {
                    var len = return_data.data.length;
                    if (return_data.data.rec_index)
                    {
                        RECORD_INDEX = return_data.data.rec_index;
                    }
                    if (return_data.code == 0 && len != 0)
                    {
                        $.fn.data_table_destroy();
                        $.fn.populate_list_form(return_data.data, is_scroll);
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
                }
            },
            true
        );
    }
    catch (err)
    {// console.log(err.message);
    	 $.fn.log_error(arguments.callee.caller, err.message);
    }
};

/*
$.fn.get_list = function ()
{
	try
	{
		var post_values = [];
		var param = { emp_id: SESSIONS_DATA.emp_id };
		$("#detail_form .condition-row").each(function ()
		{
			var data = {};

			if ($(this).find("[name='search_field']").val() != '')
			{
				data.search_field = $(this).find("[name='search_field']").val();
				data.search_condition = $(this).find("[name='search_condition']").val();

				if (data.search_condition == 'like')
				{
					data.search_value = "%" + $.trim($(this).find("[name='search_value']").val()) + "%";
				}
				else
				{
					data.search_value = $.trim($(this).find("[name='search_value']").val());
				}
				post_values.push(data);
			}
		});

		param.post_values = post_values;

		// console.log(post_values);
		$.fn.fetch_data
			(
				$.fn.generate_parameter('get_document_list_for_approval', param),
				function (return_data)
				{
					if (return_data)
					{
						$.fn.data_table_destroy();
						$.fn.populate_list_form(return_data.data);
						$.fn.data_table_features();
					}
				}, true, btn_save
			);
	}
	catch (err)
	{
		$.fn.log_error(arguments.callee.caller, err.message);
	}
};*/

$.fn.get_drop_down_values = function ()
{
	try
	{
		$.fn.fetch_data
			(
				$.fn.generate_parameter('get_document_search_query_data_check'),
				function (return_data)
				{
					$.fn.populate_dd_values('category', return_data.data.category);
					$.fn.populate_dd_values('emp', return_data.data.emp);
					$.fn.populate_dd_values('search_field', return_data.data.columns);
					$.fn.populate_dd_values('search_condition', return_data.data.conditions);
				}
			);

	}
	catch (err)
	{ //console.log(err.message);
		$.fn.log_error(arguments.callee.caller, err.message);
	}
};


$.fn.populate_dd_values = function(element_id, dd_data, is_search = false)
{
    try
    {
		$('#'+element_id).empty();
		if(is_search)
		{
			$('#'+element_id).append(`<option value="">All</option>`);
		}
		else if(element_id != 'dd_notify_email')
		{
			$('#'+element_id).append(`<option value="">Please Select</option>`);
		}

		for (let item of dd_data)
		{
			$('#'+element_id).append(`<option value="${item.id}">${item.descr}</option>`);
		}
        
    }
    catch(err)
    {
        $.fn.log_error(arguments.callee.caller,err.message);
    }
};

/*$.fn.prepare_form = function ()
{
	try
	{
		$.fn.get_drop_down_values();

		$('.populate').select2();
		


	}
	catch (err)
	{
		$.fn.log_error(arguments.callee.caller, err.message);
	}
};*/

$.fn.prepare_form = function ()
{
    try
    { 
       	$('.populate').select2();
        //$.fn.load_editor('text_editor');
        //$.fn.set_validation_form();

		/* $('#detail_form').parsley
			({
				successClass: 'has-success',
				errorClass: 'has-error',
				errors:
				{
					classHandler: function (el)
					{
						return $(el).closest('.error-container');
					},
					container: function (el)
					{
						return $(el).closest('.error-container');
					},
					errorsWrapper: '<ul class=\"help-block list-unstyled\"></ul>',
					errorElem: '<li></li>'
				}
			}); */

        // CLIENTS_MODULE_ACCESS = $.fn.get_accessibility(152);
       // $.fn.get_drop_down_values();

        /* let elems = Array.prototype.slice.call(document.querySelectorAll('.js-switch'));
        $('.js-switch').each(function() 
        {
            new Switchery($(this)[0], $(this).data());
        }); */
		$.fn.get_drop_down_values();
        ROUTE_DATA = CURRENT_ROUTE.data;
        if(ROUTE_DATA != null) {
            ROUTE_DATA_ACTION = ROUTE_DATA.action;
            ROUTE_DATA_ID = ROUTE_DATA.id;

            //show add form with assignee input
            if(ROUTE_DATA_ACTION == 'assignee' && ROUTE_DATA_ID != '') {
                $.fn.show_hide_form('NEW');
                $.fn.get_assignee(ROUTE_DATA_ID);
            }

            //view outbound document by id
            if(ROUTE_DATA_ACTION == undefined && ROUTE_DATA_ID != '') {
                $.fn.navigate_form(ROUTE_DATA_ID);
            }
            
        }else { 
            $.fn.get_list();
        }

    }
    catch (err)
    {  //console.log(err.message);
        $.fn.log_error(arguments.callee.caller, err.message);
    }
};

$.fn.form_load = function ()
{
	try
	{ 	//	SESSIONS_DATA = JSON.parse($('#session_data').val());
		//MODULE_ACCESS = $.fn.get_accessibility($('#menu_document').attr('data-val'));
		//	    console.log(MODULE_ACCESS.approve_it);
		$.fn.prepare_form();
		$.fn.bind_command_events();
	}
	catch (err)
	{ //console.log(err);
		$.fn.log_error(arguments.callee.caller, err.message);
	}
};

$.fn.prepare_remark_form = function (no, status, is_verify, is_approve)
{
	try
	{

		$('#doc_no').val(no);
		$('#chk_val').val(status);

		if (is_verify == true)
		{
			$('#btn_verify').show();
			$('#btn_approve').hide();
		}
		else if (is_approve == true)
		{
			$('#btn_verify').hide();
			$('#btn_approve').show();
		}
		$('#remarkModal').modal('show');

	}
	catch (err)
	{ //console.log(err.message);
		$.fn.log_error(arguments.callee.caller, err.message);
	}
};

$.fn.do_verify = function (data, table_row_id)
{
	try
	{ console.log(data);
		data = JSON.parse(data);
		$('#table_row').val(table_row_id);
		TO_EMP_ID = data.emp_id;
		$.fn.prepare_remark_form(data.doc_no, true, true, false);
	}
	catch (err)
	{  //console.log(err.message);
		$.fn.log_error(arguments.callee.caller, err.message);
	}
};

$.fn.do_approve = function (data, table_row_id)
{
	try
	{
		data = JSON.parse(data);
		$('#table_row').val(table_row_id);
		TO_EMP_ID = data.emp_id;
		$.fn.prepare_remark_form(data.doc_no, true, false, true);
	}
	catch (err)
	{  //console.log(err.message);
		$.fn.log_error(arguments.callee.caller, err.message);
	}
};

$.fn.view_remark = function (data)
{
	try
	{
		data = JSON.parse(data);

		$.fn.fetch_data
			(
				$.fn.generate_parameter('get_document_remark', { doc_no: data.doc_no }),
				function (return_data)
				{
					if (return_data)
					{
						$.fn.populate_remark_list_form(return_data.data);
					}
				}, false, false, false, true
			);

		$('#document_no').val(data.doc_no);
		TO_EMP_ID = data.emp_id;
		$('#remarkListModal').modal('show');
	}
	catch (err)
	{  //console.log(err.message);
		$.fn.log_error(arguments.callee.caller, err.message);
	}
};

$.fn.cancel_verify = function (data, table_row_id)
{
	try
	{
		bootbox.prompt("Please enter cancelling remark", function (result)
		{
			if (result !== null && result !== '')
			{
				data = JSON.parse(data);
				if (status == false)
				{
					$('#table_row').val(table_row_id);
					$('#doc_remark').val(result);
					$('#doc_no').val(data.doc_no);
					TO_EMP_ID = data.emp_id;
					$.fn.edit_status('Cancelled');
				}
			}
			else
			{
				$.fn.show_right_error_noty('Cancel remark is mandatory');
			}
		});

	}
	catch (err)
	{  //console.log(err.message);
		$.fn.log_error(arguments.callee.caller, err.message);
	}
};

$.fn.cancel_approve = function (data, table_row_id)
{
	try
	{
		bootbox.prompt("Please enter cancelling remarks", function (result)
		{
			if (result !== null && result !== '')
			{
				data = JSON.parse(data);
				if (status == false)
				{
					$('#table_row').val(table_row_id);
					$('#doc_remark').val(result);
					$('#doc_no').val(data.doc_no);
					TO_EMP_ID = data.emp_id;
					$.fn.edit_status("approve");
				}
			}
			else
			{
				$.fn.show_right_error_noty('Cancel remarks is mandatory');
			}
		});
	}
	catch (err)
	{  //console.log(err.message);
		$.fn.log_error(arguments.callee.caller, err.message);
	}
};

$.fn.edit_status = function (action)
{
	try
	{
		var status = 0;
		var is_verify = false;
		var is_approve = false;
		var edited_by = SESSIONS_DATA.emp_id;
		var dt = new Date();
		Boolean($('#chk_val').val()) == true ? status = 1 : status = 0;
		action == "verify" ? is_verify = true : is_verify = false;
		action == "approve" ? is_approve = true : is_approve = false;

		var data =
		{
			doc_no: $('#doc_no').val(),
			status: status,
			is_verify: is_verify,
			is_approve: is_approve,
			emp_id: SESSIONS_DATA.emp_id,
			doc_remarks: $('#doc_remark').val(),
			emp_name: SESSIONS_DATA.name,
			to_emp_id: TO_EMP_ID,
			action: action
		};

			$.fn.write_data(
				$.fn.generate_parameter('edit_verify_approve', data),
				function (return_data)
				{
					if (return_data.data)
					{
						$('#remarkModal').modal('hide');
						let table_id = $('#' + $('#table_row').val());
						table_id.hide('slow', function () { table_id.remove(); });
						$('#table_row').val('');
						$('#doc_no').val('');
						$('#chk_val').val('');
						$.fn.show_right_success_noty('Data has been recorded successfully');
						location.reload();

					}
				}, false, btn_verify_approve
			);	
			
	}
	catch (err)
	{  //console.log(err);
		$.fn.log_error(arguments.callee.caller, err.message);
	}
};

$.fn.edit_remark = function ()
{
	try
	{
	
		var data =
		{
			doc_no: $('#document_no').val(),
			doc_remarks: $('#document_remark').val(),
			action: '',
			emp_id: SESSIONS_DATA.emp_id,
			emp_name: SESSIONS_DATA.name,
			to_emp_id: TO_EMP_ID,
			from_emp: true
		};

		$.fn.write_data
			(
				$.fn.generate_parameter('add_edit_remark', data),
				function (return_data)
				{
					if (return_data.data)
					{
						$('#document_remark').val('');
						$.fn.populate_remark_list_form(return_data.data);
						$.fn.show_right_success_noty('Data has been recorded successfully');
					}

				}, false, btn_save_remarks
			);
	}
	catch (err)
	{ //console.log(err.message);
		$.fn.log_error(arguments.callee.caller, err.message);
	}
}; 


$.fn.bind_command_events = function ()
{
	try
	{
		$('body').on('click', '.search-field', function (e)
		{
			let current_value = $(this).val();
			let this_class = $(this);

			//change conditions accordingly to the fields
			this_class.parents('.condition-row').find('.search-condition').remove();
			let select_condition = $.fn.condition_drop_down(current_value);
			this_class.parents('.condition-row').find('.conditionContainer').html(select_condition);



			if ($.inArray(current_value, fields_with_drop_down) !== -1)
			{
				let select_html = $.fn.create_drop_down(current_value);
				this_class.parents('.condition-row').find('.search-value').replaceWith(select_html);
			}
			else if ($.inArray(current_value, fields_with_datepicker) !== -1)
			{
				let input_html = `<button class="btn btn-default search-value">
									<i class="fa fa-calendar-o"></i> 
									<span>${moment().subtract('days', 29).format('D MMM YYYY')} - ${moment().format('D MMM YYYY')}</span> 
									<b class="caret"></b><input type="hidden" class="date_range_value" name="search_value" value="${moment().subtract('days', 29).format('YYYY-MM-DD')}/${moment().format('YYYY-MM-DD')}">
									</button>`;

				this_class.parents('.condition-row').find('.search-value').replaceWith(input_html);

				this_class.parents('.condition-row').find('.search-value').daterangepicker
					({
						ranges:
						{
							'Today': [moment(), moment()],
							'Yesterday': [moment().subtract('days', 1), moment().subtract('days', 1)],
							'Last 7 Days': [moment().subtract('days', 6), moment()],
							'Last 30 Days': [moment().subtract('days', 29), moment()],
							'This Month': [moment().startOf('month'), moment().endOf('month')],
							'Last Month': [moment().subtract('month', 1).startOf('month'), moment().subtract('month', 1).endOf('month')]
						},
						opens: 'left',
						startDate: moment().subtract('days', 29),
						endDate: moment()

					},
						function (start, end)
						{
							this_class.parents('.condition-row').find('.search-value span').html(start.format('D MMM YYYY') + ' - ' + end.format('D MMM YYYY'));
							this_class.parents('.condition-row').find('.date_range_value').val(start.format('YYYY-MM-DD') + '/' + end.format('YYYY-MM-DD'));
						});
			}
			else
			{
				let input_html = '<input class="form-control search-value" data-required="true" name="search_value">';
				this_class.parents('.condition-row').find('.search-value').replaceWith(input_html);

				if (current_value == 'overdue_tasks')
				{
					this_class.parents('.condition-row').find('.search-condition, .search-value').attr('disabled', 'disabled');
				}
				else
				{
					this_class.parents('.condition-row').find('.search-condition, .search-value').removeAttr('disabled');
				}
			}

			$.fn.reset_validation();

		});

		$('#btn_search1').click(function()
		{
			$('#searchPanel').show();
			$('#btn_search1').hide();
		});

		$('#btn_close_search').click(function()
		{
			$('#searchPanel').hide();
			$('#btn_search1').show();
		});

		$('#btn_reset').click(function (e)
		{
			e.preventDefault();
			$.fn.reset_form();
			$.fn.reset_search();
			//$.fn.get_list('false');
		});

		$('#btn_back, #btn_cancel').click(function (e)
        {
            e.preventDefault();
            $.fn.show_hide_form('BACK');
            RECORD_INDEX = 0;
            $.fn.get_list(false);
            ROUTE_DATA = '';
            ROUTE.navigate("claims/documents-approval");
            ROUTE.resolve();
        });

        $('#btn_load_more').click(function (e)
        {
            e.preventDefault();
            $.fn.get_list(true);
        });

		$('#btn_search_action').click(function (e)
		{
			e.preventDefault();

			//btn_save = Ladda.create(this);
			//btn_save.start();

			/* if ($('#detail_form').parsley().validate() == false || $('#detail_form').parsley().validate() == null)
			{
				btn_save.stop();
				return;
			} */
			$.fn.get_list();
		});

		$('#btn_verify').click(function (e)
		{
			e.preventDefault();
			if($('#doc_remark').val() != ''){
				btn_verify_approve = Ladda.create(this);
				btn_verify_approve.start();
				$.fn.edit_status("verify");
			}
			else{
				$.fn.show_right_error_noty('Confirmation remark is mandatory');
				return;
			}
		});

		$('#btn_approve').click(function (e)
		{
			e.preventDefault();
			btn_verify_approve = Ladda.create(this);
			btn_verify_approve.start();
			$.fn.edit_status("approve");
		});

		$('#btn_add_remark').click(function (e)
		{
			e.preventDefault();
			btn_save_remarks = Ladda.create(this);
			btn_save_remarks.start();
			var no = $('#document_no').val();
			var remark = $('#document_remark').val();
			$.fn.edit_remark(no, remark, "");
			$('#document_remark').val('');
		});

		$('#add-condition').click(function (e)
		{
			e.preventDefault();
			var newCondition = $("#dynamicContent .condition-row").clone();
			newCondition.find('.select2Plugin').select2();
			newCondition.insertAfter("#detail_form .condition-row:last");

			$.fn.reset_validation();
			$.fn.add_remove_delete();
		});

		$('body').on('click', '.delete-condition', function (e)
		{
			$(this).parents('.condition-row').remove();
			$.fn.add_remove_delete();
		});

		$('body').on('change', '.search-field', function (e)
		{
			var current_value = $(this).val();
			var current_element = $(this);
			$('.search-field').not(this).each(function ()
			{
				if (current_value == $(this).val())
				{
					current_element.select2("val", "");
				}
			});
		});

		//enable disable checkbox accordingly the user selection
		$('body').on('click', '.buttons-columnVisibility', function (e)
		{
			var this_checkbox = $(this).find('.colvisCheckbox');
			this_checkbox.prop('checked', !this_checkbox[0].checked);
		});

	}
	catch (err)
	{  //console.log(err.message);
		$.fn.log_error(arguments.callee.caller, err.message);
	}
};

$.fn.reset_search = function (no, remark, action)
{
	var newCondition = $("#dynamicContent .condition-row").clone();
	newCondition.find('.select2Plugin').select2();
	$("#detail_form").html(newCondition);

	$("#detail_form .condition-row:first .delete-condition").hide();

	$.fn.reset_validation();
};

$.fn.add_remove_delete = function ()
{
	var count = $("#detail_form .condition-row").length;
	if (count == 1)
	{
		$("#detail_form .condition-row:first .delete-condition").hide();
	}
	else
	{
		$("#detail_form .condition-row .delete-condition").show();
	}

};

$.fn.create_drop_down = function (field)
{
	try
	{
		let data = drop_down_values;

		let employees = ['approved_by'
			, 'verified_by'
			, 'created_by'
		];

		let select_options;

		if ($.inArray(field, employees) !== -1)
		{
			select_options = data['data']['employees'];
		}
		else
		{
			select_options = data['data'][field];
		}

		let select_html = '<select class="form-control search-value" name="search_value">';

		$.each(select_options, function (id, value) 
		{
			select_html += '<option value="' + value['id'] + '">' + value['value'] + '</option>';
		});

		select_html += '</select>';

		return select_html;
	}
	catch (err)
	{  //console.log(err.message);
		$.fn.log_error(arguments.callee.caller, err.message);
	}
};

$.fn.condition_drop_down = function (field)
{
	try
	{
		let select_conditions;

		if ($.inArray(field, fields_with_datepicker) !== -1 || $.inArray(field, fields_with_drop_down) !== -1)
		{
			select_conditions = ['='];
		}
		else if ($.inArray(field, fields_with_numbers) !== -1)
		{
			select_conditions = ['=', '<=', '>=', '<', '>'];
		}
		else
		{
			select_conditions = ['=', 'like'];
		}

		let select_html = '<select class="form-control search-condition" name="search_condition">';

		$.each(select_conditions, function (id, value) 
		{
			select_html += '<option value="' + value + '">' + value + '</option>';
		});

		select_html += '</select>';
		return select_html;
	}
	catch (err)
	{  //console.log(err.message);
		$.fn.log_error(arguments.callee.caller, err.message);
	}
};

$.fn.reset_validation = function ()
{
	//$('#detail_form').parsley().destroy();
	//$('#detail_form').parsley
		/* ({
			successClass: 'has-success',
			errorClass: 'has-error',
			errors:
			{
				classHandler: function (el)
				{
					return $(el).closest('.error-container');
				},
				container: function (el)
				{
					return $(el).closest('.error-container');
				},
				errorsWrapper: '<ul class=\"help-block list-unstyled\"></ul>',
				errorElem: '<li></li>'
			}
		}); */
};

$(document).ready(function ()
{
	try
	{
		$.fn.form_load();
	}
	catch (err)
	{  //console.log(err.message);
		$.fn.log_error(arguments.callee.caller, err.message);
	}
});
