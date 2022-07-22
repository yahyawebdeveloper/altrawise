var FORM_STATE = 0;
var RECORD_INDEX = 0;
var TABLE_ROW_ID = 0;
var ROW_DATA = '';
//var SESSIONS_DATA = '';
var last_scroll_top = 0;
var LEAVE_ID = '';
var APPROVE_TYPE = '';
var btn_save, btn_save_remarks, btn_approve;
var leave_id_data = [];

AN_LEAVE_ID = '47';
MC_LEAVE_ID = '48';
EM_LEAVE_ID = '273';
TIME_OFF_ID = '261';

CURRENT_PATH = '../../';

$.fn.data_table_features = function ()
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
					"order"		: [[ 2, "desc" ]]
				});
		}
	}
	catch (err)
	{
		$.fn.log_error(arguments.callee.caller, err.message);
	}
};

$.fn.data_table_destroy = function ()
{
	try
	{
		if ($.fn.dataTable.isDataTable('#tbl_list'))
		{
			$('#tbl_list').DataTable().destroy();
		}
	}
	catch (err)
	{
		$.fn.log_error(arguments.callee.caller, err.message);
	}
};

$.fn.show_hide_form = function (form_status)
{
	$.fn.reset_form('form');
	if (form_status == 'INFO')
	{
		$('#list_div').hide(400);
		$('#info_div').show(400);
	}
	else if (form_status == 'INFO_BACK')
	{
		LEAVE_ID = '';
		$('#list_div').show(400);
		$('#info_div').hide(400);
	}
};

$.fn.reset_form = function (form)
{
	try
	{
		if (form == 'form')
		{
			$('#dd_employee').val('').change();
			$('#dd_leave_type').val('').change();
			$('#chk_is_verified').prop('checked', false);
			$('#chk_is_approved').prop('checked', false);
		}
		if (form == 'remark_form')
		{
			LEAVE_ID = '';
			$('#leave_remark').val('');
			$('#remarkModal').modal('hide');
		}
		if (form == 'remark_list_form')
		{
			LEAVE_ID = '';
			$('#le_remark').val('');
			$('#tbl_remark_list tbody').html('');
		}
		if (form == 'approve_option')
		{
			$('#option_paid').prop('checked', false);
			$('#option_unpaid').prop('checked', false);
			$('#option_reject').prop('checked', false);
		}
		if (form == 'approve_leave')
		{
			$('#approvalModal').modal('hide');
		}
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
		console.log(data);
		if (is_scroll == false)
		{
			$('#tbl_list > tbody').empty();
		}

		if (data.list.length > 0) // check if there is any data, precaution
		{
			let data_val = '';
			let tr_row = $('#tbl_list > tbody').find('tr').length;
			//			console.log(tr_row);
			if (data.rec_index)
			{
				RECORD_INDEX = data.rec_index;
			}
			data = data.list;

			for (var i = 0; i < data.length; i++)
			{	
				let row = '';
				let start_date = moment(data[i].start_date);
				let end_date = moment(data[i].end_date);
				data_val = escape(JSON.stringify(data[i])); //.replace(/'/,"");

				var half_day_opt = '';
				if (data[i].no_of_days == '0.5')
				{
					if (data[i].half_day_opt == '1')
					{
						half_day_opt = '(First Half)';
					}
					if (data[i].half_day_opt == '2')
					{
						half_day_opt = '(Second Half)';
					}
				}
				row += '<tr id="TR_ROW_' + tr_row + '">';

				row += '<td width="15%">' + data[i].name + '</td>' +
					'<td width="10%">' + start_date.format('D-MMM-YYYY') + '</td>' +
					'<td width="10%">' + end_date.format('D-MMM-YYYY') + '</td>' +
					'<td>' + data[i].type + half_day_opt + '</td>' +
					'<td>' + data[i].no_of_days + (data[i].type_id == TIME_OFF_ID ? ' Hour(s)' : '') + '</td>' +
					'<td>' + data[i].reason;
				row += '</td>';

				if (data[i].verified == 0)
				{
					row += '<td>';
					row += '<button class="btn btn-xs btn-outline-info waves-effect waves-light" data-value=\'' + data_val + '\' onclick="$.fn.do_verify( unescape($(this).attr(\'data-value\')), $(this).closest(\'tr\').prop(\'id\') )" name="btn_verify">Verify</button>';
					//row += '<div class="button-list pt-1"><button type="button" class="btn btn-xs btn-outline-info waves-effect waves-light"  title="Verify" onclick="$.fn.do_verify( unescape($(this).attr(\'data-value\')), $(this).closest(\'tr\').prop(\'id\') )"><span class="hidden-xs">Verify</span></button></div>';
					row += '</td>';
				}
				if (data[i].verified == 1)
				{
					row += '<td>';
					if (data[i].all_approved == 0)
					{
						row += '<div class="badge bg-soft-info text-info"><i class="fa fa-check-square" aria-hidden="true">&nbsp;Verified</i><br/></div>';
						row += '&nbsp;<button class="btn btn-xs btn-outline-warning waves-effect waves-light" data-value=\'' + data_val + '\' onclick="$.fn.do_approve( unescape($(this).attr(\'data-value\')), $(this).closest(\'tr\').prop(\'id\') )" name="btn_approve">Approve</button>';
					}
					if (data[i].all_approved == 1)
					{
						if (data[i].rejected >= 1)
						{
							if (parseFloat(data[i].rejected) == parseFloat(data[i].no_of_days))
							{
								row += '<i class="fa fa-times-square badge bg-soft-danger text-danger"> Rejected</i><br/>';
							}
							else
							{
								row += '<i class="fa fa-times-square badge bg-soft-danger text-danger"> Partial Rejected</i><br/>';
							}

							if (parseFloat(data[i].rejected) != parseFloat(data[i].no_of_days))
							{
								row += '<i class="fa fa-check-square badge bg-soft-success text-success" aria-hidden="true">&nbsp;Approved</i>';
							}

						}
						else
						{
							row += '<i class="fa fa-check-square badge bg-soft-success text-success" aria-hidden="true">&nbsp;Approved</i>';
						}
					}
					else
					{
						if (data[i].rejected >= 1)
						{
							if (parseFloat(data[i].rejected) == parseFloat(data[i].no_of_days))
							{
								row += '<i class="fa fa-times-square badge bg-soft-danger text-danger"> Rejected</i><br/>';
							}
							else
							{
								row += '<i class="fa fa-times-square badge bg-soft-danger text-danger"> Partial Rejected</i><br/>';
							}
						}
					}
					row += '</td>';
				}
				row += `<td width="10%"><div id="leave_file_${data[i].id}" style="width: 180px;word-break: break-word;border:none;background-color:none;"></div></td>`;
				row += '<td width="15%" style="width:100%;"><div class="button-group">';
				
				if (data[i].verified == 0)
				{
					
					row += `<button type="button" class="btn btn-danger btn-xs waves-effect waves-light" data-bs-toggle="tooltip" data-bs-placement="top" title="Delete" data-value="${data_val}" onclick="$.fn.delete_form(decodeURIComponent('${data_val}'))">
								<i class="far fa-trash-alt"></i>
							</button>`;
				}
				if (data[i].type_id == MC_LEAVE_ID && data[i].filename != '' && data[i].filename != null)
				{
					row += '&nbsp;<a target="_blank" href="' + data[i].filepath + '" ><i class="fa fa-picture-o"/></a>';
				}
				
				row += '&nbsp;<a class="btn btn-primary btn-xs waves-effect waves-light" data-toggle="tooltip" data-placement="left" title="View Remarks" href="javascript:void(0)" data-value=\'' + data_val + '\' onclick="$.fn.view_remark(unescape($(this).attr(\'data-value\')))"><i class="fas fa-external-link-alt"></i></a>';
				row += '&nbsp;<a class="btn btn-success btn-xs waves-effect waves-light" data-toggle="tooltip" data-placement="left" title="View Details" href="javascript:void(0)" data-value=\'' + data_val + '\'  onclick="$.fn.view_leave_record(unescape($(this).attr(\'data-value\')), $(this).closest(\'tr\').prop(\'id\') )" ><i class="fas fa-sign-in-alt"></i></a>';
				row += '</div></td>';

				row += '</tr>';
				tr_row++;
				
				$('#tbl_list tbody').append(row);
				for (let j = 0; j < data[i].attachment.length; j++)
					{ 
						data[i].attachment[j]['name'] = data[i].attachment[j]['filename'];
						data[i].attachment[j]['uuid'] = data[i].attachment[j]['id'];
						data[i].attachment[j]['deleteFileParams'] =  JSON.stringify(data[i].attachment[j]);
						delete data[i].attachment[j]['filename'];
						delete data[i].attachment[j]['id'];
					}
				$.fn.populate_fileupload(data[i], `leave_file_${data[i].id}`);
                $("#tbl_list").find(`#leave_file_${data[i].id} .col-sm-4`).toggleClass('col-sm-4 col-sm-12');
			}
			$('.load-more').show()
			//			$('#btn_load_more').show();
		}
	}
	catch (err)
	{
		$.fn.log_error(arguments.callee.caller, err.message);
	}
};

$.fn.do_verify = function (data, table_row_id)
{
	try
	{
		ROW_DATA = JSON.parse(data);
		TABLE_ROW_ID = table_row_id;
	//	$('#remarkModal').modal();
		$('#remarkModal').modal('show');
	}
	catch (err)
	{
		$.fn.log_error(arguments.callee.caller, err.message);
	}
};

$.fn.do_approve = function (data, table_row_id)
{
	try
	{
		ROW_DATA = JSON.parse(data);
		TABLE_ROW_ID = table_row_id;

		$.fn.fetch_data
			(
				$.fn.generate_parameter('get_leave_by_day', { leave_id: ROW_DATA.id }),
				function (return_data)
				{
					if (return_data)
					{
						$.fn.reset_form('approve_option');
						APPROVE_TYPE = 'ALL';
						var data = return_data.data.list;
						leave_id_data = [];
						for (var i = 0; i < data.length; i++)
						{
							var leave_day = {};
							leave_day.id = data[i].id;
							leave_id_data.push(leave_day);
						}
						$('#approvalModal').modal('show');
					}
				}, true
			);
	}
	catch (err)
	{
		$.fn.log_error(arguments.callee.caller, err.message);
	}
};

$.fn.edit_verify_status = function ()
{
	try
	{
		var remarks = $('#leave_remark').val();
		var data =
		{
			leave_id: ROW_DATA.id,
			emp_id: SESSIONS_DATA.emp_id,
			leave_remarks: remarks,
			emp_name: SESSIONS_DATA.name,
			applicant_id: ROW_DATA.emp_id,
			applicant_name: ROW_DATA.name,
			no_of_days: ROW_DATA.no_of_days,
			start_date: ROW_DATA.start_date,
			end_date: ROW_DATA.end_date,
			reason: ROW_DATA.reason,
			type_name: ROW_DATA.type,
			action: 'Verified'
		};

		$.fn.write_data
			(
				$.fn.generate_parameter('leave_edit_verify', data),
				function (return_data)
				{
					if (return_data.data)
					{
						//$.fn.remove_table_row(TABLE_ROW_ID);
						$.fn.reset_form('remark_form');
						$.fn.show_right_success_noty('Data has been recorded successfully');
						TABLE_ROW_ID = 0;
						ROW_DATA = '';
					}

				}, false, btn_verify
			);
	}
	catch (err)
	{
		$.fn.log_error(arguments.callee.caller, err.message);
	}
};

$.fn.delete_form = function (data, table_row_id)
{
	try
	{
		ROW_DATA = JSON.parse(data);
		TABLE_ROW_ID = table_row_id;

		if (ROW_DATA.id == '')
		{
			$.fn.show_right_error_noty('ID cannot be empty');
			return;
		}

		var data =
		{
			id: ROW_DATA.id,
			emp_id: SESSIONS_DATA.emp_id
		};

		bootbox.confirm
			({
				title: "Delete Confirmation",
				message: "Please confirm before you delete.",
				buttons:
				{
					cancel:
					{
						label: '<i class="fa fa-times"></i> Cancel'
					},
					confirm:
					{
						label: '<i class="fa fa-check"></i> Confirm'
					}
				},
				callback: function (result) 
				{
					if (result == true)
					{
						$.fn.write_data
							(
								$.fn.generate_parameter('delete_leave_by_id', data),
								function (return_data)
								{
									if (return_data)
									{
									//	$.fn.remove_table_row(TABLE_ROW_ID);
										$.fn.show_right_success_noty('Data has been deleted successfully');
										TABLE_ROW_ID = 0;
										ROW_DATA = '';
									}

								}, false, btn_save
							);
					}
				}
			});

	}
	catch (err)
	{
		$.fn.log_error(arguments.callee.caller, err.message);
	}
};

$.fn.view_remark = function (data)
{
	try
	{
		data = JSON.parse(data);
		$('#tbl_remark_list tbody').html('');

		$.fn.fetch_data
			(
				$.fn.generate_parameter('get_leave_remark', { leave_id: data.id }),
				function (return_data)
				{
					if (return_data)
					{
						$.fn.populate_remark_list_form(return_data.data);
					}
				}, false, false, false, true
			);

		LEAVE_ID = data.id;
		//$('#remarkListModal').modal();
		$('#remarkListModal').modal('show');
	}
	catch (err)
	{
		$.fn.log_error(arguments.callee.caller, err.message);
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


			for (var i = 0; i < data.length; i++)
			{
				data_val = escape(JSON.stringify(data[i]));
//<a class="tooltips" href="javascript:void(0)" data-value=\'' + data_val + '\' onclick="$.fn.delete_remark_form(unescape($(this).attr(\'data-value\')))" data-trigger="hover" data-original-title="Delete data "><i class="fa fa-trash-o"/></a></td>
				row += '<tr><td><a class="tooltips" href="javascript:void(0)" data-value=\'' + data_val + '\' onclick="$.fn.delete_remark_form(unescape($(this).attr(\'data-value\')))" data-trigger="hover" data-original-title="Delete data "><i class="fas fa-trash-alt"/></a></td>' +
					'<td>' +
					'<td>' + data[i].leave_remarks + '</td>' +
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
	{
		$.fn.log_error(arguments.callee.caller, err.message);
	}
};

$.fn.add_edit_remark = function ()
{
	try
	{
		var remark = $('#le_remark').val();
		var action = '';

		if (remark != '')
		{
			var data =
			{
				leave_id: LEAVE_ID,
				leave_remarks: remark,
				action: action,
				emp_id: SESSIONS_DATA.emp_id,
				emp_name: SESSIONS_DATA.name,
			};

			$.fn.write_data
				(
					$.fn.generate_parameter('leave_add_edit_remark', data),
					function (return_data)
					{
						if (return_data.data)
						{
							$.fn.reset_form('remark_list_form');
							$.fn.populate_remark_list_form(return_data.data);
						}

					}, false, btn_save_remarks

				);
		}
		else
		{
			btn_save_remarks.stop();
			return;
		}
	}
	catch (err)
	{
		$.fn.log_error(arguments.callee.caller, err.message);
	}
};

$.fn.delete_remark_form = function (data)
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
			leave_id: data.leave_id,
			emp_id: SESSIONS_DATA.emp_id
		};

		$.fn.write_data
			(
				$.fn.generate_parameter('leave_delete_remark', data),
				function (return_data)
				{
					if (return_data)
					{
						$.fn.reset_form('remark_list_form');
						$.fn.populate_remark_list_form(return_data.data);
					}

				}, false, btn_save
			);
	}
	catch (err)
	{
		$.fn.log_error(arguments.callee.caller, err.message);
	}
};

$.fn.view_leave_record = function (data, table_row_id)
{
	try
	{
		ROW_DATA = JSON.parse(data);
		//console.log(ROW_DATA);
		console.log(moment(ROW_DATA.start_date, 'DD-MM-YYYY').year());
		TABLE_ROW_ID = table_row_id;


		$('#employee_name').html('<b> Name : ' + ROW_DATA.name + '</b>');
		$('#leave_type').html('<b> Type : ' + ROW_DATA.type + '</b>');

		var param =
		{
			em_type_id: EM_LEAVE_ID,
			emp_id: ROW_DATA.emp_id,
			year: moment(ROW_DATA.start_date, 'DD-MM-YYYY').year()
		};
		$.fn.fetch_data
			(
				$.fn.generate_parameter('get_leave_details', param),
				function (return_data)
				{
					if (return_data.code == 0)
					{
						$.fn.populate_leave_details(return_data.data);

						$.fn.view_leave_by_day(data);

						$.fn.show_hide_form('INFO');
					}
					else if (return_data.code == 1)
					{

					}
				}, true
			);
	}
	catch (err)
	{
		$.fn.log_error(arguments.callee.caller, err.message);
	}
};

$.fn.populate_leave_details = function (data)
{
	try
	{

		var row = '';

		for (var i = 0; i < data.length; i++)
		{

			var entitle_leave = data[i].entitle_leave ? data[i].entitle_leave : 0;
			var brought_forward = data[i].brought_forward ? data[i].brought_forward : 0;
			if (data[i].type_id == TIME_OFF_ID)
			{
				entitle_leave = parseFloat(entitle_leave) * 8;
				brought_forward = parseFloat(brought_forward) * 8;
			}
			var paid_leave_taken = data[i].paid_leave_taken ? data[i].paid_leave_taken : 0;
			var unpaid_leave_taken = data[i].unpaid_leave_taken ? data[i].unpaid_leave_taken : 0;
			var em_paid_leave_taken = data[i].em_paid_leave_taken ? data[i].em_paid_leave_taken : 0;

			if (data[i].type_id == AN_LEAVE_ID)
			{
				var available_leave = (parseFloat(entitle_leave) + parseFloat(brought_forward)) - (parseFloat(paid_leave_taken) + parseFloat(em_paid_leave_taken));
			}
			else
			{
				var available_leave = (parseFloat(entitle_leave) + parseFloat(brought_forward)) - (parseFloat(paid_leave_taken));
			}

			row += '<div class="row">';

			row += '<div class="col-md-12 clearfix">' +
				'<h4 class="pull-left" style="margin: 0px;">' + data[i].leave_type + ' <small>(' + (data[i].type_id == TIME_OFF_ID ? 'Hours' : 'Days') + ')</small></h4>' +
				'</div>';

			row += '<div class="col-xs-6 col-md-3">' +
				'<h3 class="text-center text-primary margin-bottom-0">' + parseFloat(entitle_leave).toFixed(1) + '</h3>' +
				'<div class="text-center text-info">Entitled for this year</div>' +
				'</div>';

			row += '<div class="col-xs-6 col-md-2">' +
				'<h3 class="text-center text-primary margin-bottom-0">' + parseFloat(brought_forward).toFixed(1) + '</h3>' +
				'<div class="text-center text-info">Brought Forward</div>' +
				'</div>';

			row += '<div class="col-xs-6 col-md-2">' +
				'<h3 class="text-center text-primary margin-bottom-0">' + parseFloat(paid_leave_taken).toFixed(1) + '</h3>' +
				'<div class="text-center text-info">Taken this year (Paid)</div>' +
				'</div>';

			row += '<div class="col-xs-6 col-md-2">' +
				'<h3 class="text-center text-primary margin-bottom-0">' + parseFloat(unpaid_leave_taken).toFixed(1) + '</h3>' +
				'<div class="text-center text-info">Taken this year (Unpaid)</div>' +
				'</div>';

			row += '<div class="col-xs-6 col-md-3">' +
				'<h3 class="text-center text-primary margin-bottom-0">' + parseFloat(available_leave).toFixed(1) + '</h3>' +
				'<div class="text-center text-info">Available Leave</div>' +
				'</div>';

			row += '</div>';

			if (data.length > (i + 1))
			{
				row += '<hr>';
			}

		}

		$('#div_leave_summary').html(row);

	}
	catch (err)
	{
		$.fn.log_error(arguments.callee.caller, err.message);
	}
};

$.fn.view_leave_by_day = function (data)
{
	try
	{
		data = JSON.parse(data);
		$('#tbl_leave_record > tbody').empty();
		LEAVE_ID = data.id;

		var data =
		{
			leave_id: data.id
		};

		$.fn.fetch_data
			(
				$.fn.generate_parameter('get_leave_by_day', data),
				function (return_data)
				{
					if (return_data)
					{
						$.fn.populate_list_leave_by_day(return_data.data.list);
					}
				}, true
			);

		$('#leaveRecordModal').modal();
	}
	catch (err)
	{
		$.fn.log_error(arguments.callee.caller, err.message);
	}
};

$.fn.populate_list_leave_by_day = function (data)
{
	try
	{
		if (data) // check if there is any data, precaution
		{
			var row = '';

			for (var i = 0; i < data.length; i++)
			{
				data_val = escape(JSON.stringify(data[i]));
				row += '<tr>';

				if (data[i].approved_by == null && data[i].rejected_by == null)
				{
					row += '<td><input type="checkbox" class="checkboxes" id="chk_is_approve" name="chk_is_approve" value=\'' + data[i].id + '\'></td>';
				}
				else
				{
					row += '<td>&nbsp;</td>';
				}

				row += '<td>' + data[i].leave_date + '</td>' +
					'<td>' + data[i].leave_no_of_days + (data[i].type_id == TIME_OFF_ID ? ' Hour(s)' : '') + '</td>';


				if (data[i].approved_by != null)
				{
					if (data[i].approved == 1)
					{
						row += '<td><span class="text-success"><b>APPROVED</b></span>&nbsp;&nbsp;<a class="btn btn-danger tooltips pull-right" href="javascript:void(0)" data-value=\'' + data_val + '\' onclick="$.fn.do_cancel_leave(unescape( $(this).attr(\'data-value\')) )">Cancel</a></td>';
						if (data[i].paid == 1)
						{
							row += '<td><span class="text-success"><b>PAID</b></span></td>';
						}
						else
						{
							row += '<td><span class="text-danger"><b>UNPAID</b></span></td>';
						}
					}
				}
				else if (data[i].rejected == 1)
				{
					row += '<td><span class="text-danger"><b>REJECT</b></span>&nbsp;&nbsp;<a class="btn btn-danger tooltips pull-right" href="javascript:void(0)" data-value=\'' + data_val + '\' onclick="$.fn.do_cancel_leave(unescape( $(this).attr(\'data-value\')) )">Cancel</a></td>';
					row += '<td>-</td>';
				}
				else
				{
					row += '<td><span class="text-info"><b>PENDING</b></span>&nbsp;&nbsp;<a class="btn btn-danger tooltips pull-right" href="javascript:void(0)" data-value=\'' + data_val + '\' onclick="$.fn.do_cancel_leave(unescape( $(this).attr(\'data-value\')) )">Cancel</a></td>';
					row += '<td>-</td>';
				}

				row += '</tr>';

			}
			$('#tbl_leave_record tbody').html(row);

			if ($('#chk_is_approve').length == 0)
			{
				$('#btn_apply').hide();
			}
			else
			{
				$('#btn_apply').show();
			}

		}
	}
	catch (err)
	{
		$.fn.log_error(arguments.callee.caller, err.message);
	}
};

$.fn.do_cancel_leave = function (data)
{
	try
	{
		data = JSON.parse(data);

		var new_no_of_days = parseFloat(parseFloat(data.no_of_days) - parseFloat(data.leave_no_of_days)).toFixed(1);

		var data =
		{
			id: data.id,
			leave_id: data.leave_id,
			no_of_days: new_no_of_days,
			emp_id: SESSIONS_DATA.emp_id
		};

		bootbox.confirm
			({
				title: "Cancel Confirmation",
				message: "Please confirm before you cancel.",
				buttons:
				{
					cancel:
					{
						label: '<i class="fa fa-times"></i> Cancel'
					},
					confirm:
					{
						label: '<i class="fa fa-check"></i> Confirm'
					}
				},
				callback: function (result)
				{

					if (result == true)
					{
						$.fn.write_data
							(
								$.fn.generate_parameter('cancel_leave_day', data),
								function (return_data)
								{
									if (return_data)
									{
										RECORD_INDEX = 0;
										$('#tbl_leave_record > tbody').empty();
										$.fn.populate_list_leave_by_day(return_data.data.list, false);
										$.fn.show_right_success_noty('Data has been cancelled successfully');
									}

								}, false
							);
					}
				}
			});
	}
	catch (err)
	{
		$.fn.log_error(arguments.callee.caller, err.message);
	}
};


$.fn.prepare_approval = function ()
{
	try
	{
		$.fn.reset_form('approve_option');
		APPROVE_TYPE = 'DAY';
		$('#approvalModal').modal('show');
	}
	catch (err)
	{
		$.fn.log_error(arguments.callee.caller, err.message);
	}
};

$.fn.edit_approve_status = function ()
{
	try
	{
		var paid_status = '';
		var approve_status = 0;
		var rejected_status = 0;
		var check_status = false;

		if ($('#option_paid').is(':checked'))
		{
			paid_status = 1;
			approve_status = 1;
			check_status = true;
		}
		else if ($('#option_unpaid').is(':checked'))
		{
			paid_status = 0;
			approve_status = 1;
			check_status = true;
		}
		else if ($('#option_reject').is(':checked'))
		{
			paid_status = 0;
			rejected_status = 1;
			check_status = true;
		}

		if (APPROVE_TYPE == 'ALL')
		{
			if (check_status == true)
			{
				var data =
				{
					leave_id: LEAVE_ID,
					leave_data: leave_id_data,
					paid_status: paid_status,
					approve_status: approve_status,
					rejected_status: rejected_status,
					approve_type: APPROVE_TYPE,
					emp_id: SESSIONS_DATA.emp_id,
					emp_name: SESSIONS_DATA.name,
					applicant_id: ROW_DATA.emp_id,
					applicant_name: ROW_DATA.name,
					no_of_days: ROW_DATA.no_of_days,
					start_date: ROW_DATA.start_date,
					end_date: ROW_DATA.end_date,
					reason: ROW_DATA.reason,
					type_name: ROW_DATA.type
				};

				$.fn.write_data
					(
						$.fn.generate_parameter('leave_edit_approve', data),
						function (return_data)
						{
							if (return_data.data)
							{
								//$.fn.remove_table_row(TABLE_ROW_ID);
								$.fn.show_right_success_noty('Data has been recorded successfully');
								$.fn.reset_form('approve_leave');
								TABLE_ROW_ID = 0;
								ROW_DATA = '';
							}

						}, false, btn_approve
					);
			}
			else
			{
				btn_approve.stop();
				return;
			}
		}

		if (APPROVE_TYPE == 'DAY')
		{
			var count_day = $('#leave_form input[id="chk_is_approve"]:checked').length;

			if (count_day > 0)
			{
				if (check_status == true)
				{
					leave_id_data = [];
					$('#leave_form input[id="chk_is_approve"]:checked').each(function () 
					{
						var leave_day = {};
						leave_day.id = $(this).val();
						leave_id_data.push(leave_day);
					});

					var data =
					{
						leave_id: LEAVE_ID,
						leave_data: leave_id_data,
						paid_status: paid_status,
						approve_status: approve_status,
						rejected_status: rejected_status,
						approve_type: APPROVE_TYPE,
						emp_id: SESSIONS_DATA.emp_id,
						emp_name: SESSIONS_DATA.name,
						applicant_id: ROW_DATA.emp_id,
						applicant_name: ROW_DATA.name,
						no_of_days: ROW_DATA.no_of_days,
						start_date: ROW_DATA.start_date,
						end_date: ROW_DATA.end_date,
						reason: ROW_DATA.reason,
						type_name: ROW_DATA.type
					};

					$.fn.write_data
						(
							$.fn.generate_parameter('leave_edit_approve', data),
							function (return_data)
							{
								if (return_data.data)
								{
									var data_val = escape(JSON.stringify(return_data.data[0]));
									$.fn.view_leave_record(unescape(data_val));
									$.fn.show_right_success_noty('Data has been recorded successfully');
									$.fn.reset_form('approve_leave');
								}

							}, false, btn_approve
						);
				}
				else
				{
					$.fn.show_right_error_noty('Please check atleast one option');
					btn_approve.stop();
					return;
				}
			}
			else
			{
				$.fn.show_right_error_noty('Please check atleast one checkbox');
				btn_approve.stop();
				return;
			}
		}

	}
	catch (err)
	{
		$.fn.log_error(arguments.callee.caller, err.message);
	}
};

$.fn.get_list = function (is_scroll, limit = LIST_PAGE_LIMIT)
{
	try
	{
		var data =
		{
			start_index: RECORD_INDEX,
			limit: limit,
			employee_id: $('#dd_employee').val(),
			type_id: $('#dd_leave_type').val(),
			from_date: $('#from_date').val(),
			to_date: $('#to_date').val(),
			is_date  : $('#chk_is_date').is(':checked')  ? 1 : 0,
			verified: $('#chk_is_verified').is(':checked') ? 1 : 0,
			approved: $('#chk_is_approved').is(':checked') ? 1 : 0,
			emp_id: SESSIONS_DATA.emp_id,
			is_supervisor: SESSIONS_DATA.is_supervisor,
			is_admin: SESSIONS_DATA.is_admin
		};

		if (is_scroll)
		{
			data.start_index = RECORD_INDEX;
		}
		$.fn.fetch_data(
			$.fn.generate_parameter('get_leave_info_list', data),
			function(return_data) {
				 if (return_data.data.list) {
					var len = return_data.data.list.length;
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
										<td colspan="9">
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
			}
		);


	}
	catch (err)
	{
		$.fn.log_error(arguments.callee.caller, err.message);
	}
};

$.fn.select_all_checkbox = function (status)
{
	try
	{
		$('#leave_form input[type="checkbox"]').each(function () 
		{
			if (status == true)
			{
				this.checked = true;
			}
			else
			{
				this.checked = false;
			}
		});
	}
	catch (err)
	{
		$.fn.log_error(arguments.callee.caller, err.message);
	}
};


$.fn.get_leave_approval_dropdown_data = function()
{
    try
    {   
      //  let lead_access = $.fn.get_accessibility(111); 
        let data    =
        {   
			emp_id: SESSIONS_DATA.emp_id,
			is_supervisor: SESSIONS_DATA.is_supervisor,
			is_admin: SESSIONS_DATA.is_admin,
        };
       
        $.fn.fetch_data
        ( 
            $.fn.generate_parameter('get_leave_approval_dropdown_data', data),
            function(return_data)
            { 
                if (return_data.code == 0)
                {
				   $.fn.populate_dd_values('dd_leave_type', return_data.data);
				   $.fn.populate_dd_values('dd_employee', return_data.data);
                }
            },true
        );
    }
    catch(err)
    {
        $.fn.log_error(arguments.callee.caller,err.message);
    }
};
$.fn.populate_dd_values = function(element_id, dd_data, is_search = false)
{
    try
    {
		$('#dd_employee').empty();
		$('#dd_employee').append(`<option value="">Please Select</option>`);
		 for (let item of dd_data.emp)
        {
            $('#dd_employee').append(`<option 
                                                 data-type="expenses" 
                                                 value="${item.id}">${item.name}
                                                 </option>`
                                               );
        }
        $('#dd_leave_type').empty();
		$('#dd_leave_type').append(`<option value="">Please Select</option>`);
        for (let item of dd_data.leave_type)
        {
            $('#dd_leave_type').append(`<option 
                                             data-type="emp_leave_type" 
                                             value="${item.id}">${item.descr}
                                             </option>`
                                            );
        }
        
    }
    catch(err)
    {
        $.fn.log_error(arguments.callee.caller,err.message);
    }
};



$.fn.prepare_form = function ()
{
	try
	{
		$('.populate').select2();
		$('#detail_form').parsley
			({
				successClass: 'has-success',
				errorClass: 'has-error',
				errors:
				{
					classHandler: function (el)
					{
						return $(el).closest('.form-group');
					},
					errorsWrapper: '<ul class=\"help-block list-unstyled\"></ul>',
					errorElem: '<li></li>'
				}
			});
			$.fn.get_leave_approval_dropdown_data();
			$.fn.get_list(false);
	}
	catch (err)
	{
		$.fn.log_error(arguments.callee.caller, err.message);
	}
};

$.fn.form_load = function ()
{
	try
	{
		//SESSIONS_DATA = JSON.parse($('#session_data').val());
		$.fn.prepare_form();
		$.fn.bind_command_events();
	
	}
	catch (err)
	{
		$.fn.log_error(arguments.callee.caller, err.message);
	}
};

$.fn.bind_command_events = function ()
{
	try
	{	
		$('#chk_is_date').click( function(e)
        {
            let chk_is_date = $('#chk_is_date').is(':checked');
            if(chk_is_date)
            {
                $('#date_container').show();
            }
            else
            {
                $('#date_container').hide();
            }
        });
		
		$('#btn_info_back').click(function (e)
		{
			e.preventDefault();
			$.fn.show_hide_form('INFO_BACK');
			RECORD_INDEX = 0;
			$.fn.get_list(false);
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
		$('#btn_search_action').click(function (e)
        {   
			
            e.preventDefault();
            RECORD_INDEX = 0;
            $.fn.get_list(false);
        });

		$('#btn_reset').click(function (e)
		{
			e.preventDefault();
			RECORD_INDEX = 0;
			$.fn.reset_form('form');
			$.fn.get_list(false);
		});

		$('#btn_load_more').click(function (e)
		{
			e.preventDefault();
			$.fn.get_list(true);
		});

		$('#group_checkbox').change(function (e)
		{
			e.preventDefault();
			$.fn.select_all_checkbox($(this).is(':checked'));
		});

		$('#btn_verify').click(function (e)
		{
			e.preventDefault();
			RECORD_INDEX = 0;
			btn_verify = Ladda.create(this);
			btn_verify.start();
			$.fn.edit_verify_status();
		});

		$('#btn_apply').click(function (e)
		{
			e.preventDefault();
			$.fn.prepare_approval();
		});

		$('#btn_approve').click(function (e)
		{
			e.preventDefault();
			btn_approve = Ladda.create(this);
			btn_approve.start();
			$.fn.edit_approve_status();
			
		});

		$('#btn_add_remark').click(function (e)
		{
			e.preventDefault();
			btn_save_remarks = Ladda.create(this);
			btn_save_remarks.start();
			$.fn.add_edit_remark();
		});

		$("#doc_date").flatpickr({
            mode:"range",
            altFormat: "d-M-Y",
            dateFormat: "d-m-Y",
            onChange:function(selectedDates){
                var _this=this;
                var dateArr=selectedDates.map(function(date){return _this.formatDate(date,'Y-m-d');});
                $('#from_date').val(dateArr[0]);
                $('#to_date').val(dateArr[1]);
            },
        });


	}
	catch (err)
	{
		$.fn.log_error(arguments.callee.caller, err.message);
	}
};


$(document).ready(function ()
{
	$.fn.form_load();
});
