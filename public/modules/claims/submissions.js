var FORM_STATE = 0;
var RECORD_INDEX = 0;
//var SESSIONS_DATA = '';
var last_scroll_top = 0;
var TO_EMP_ID = 0;
var btn_save, btn_save_remarks;
var FILE_UPLOAD_PATH = '';
CURRENT_PATH = '../../';
var FORM_STATE = 0;
var RECORD_INDEX = 0;
var btn_save, btn_save_remarks;
DOC_NO = '';
var CLIENTS_MODULE_ACCESS = '';
CLIENT_ID = '';


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
					"order": []
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

$.fn.reset_form = function (form)
{
    try
    { 
        FORM_STATE = 0;
		if (form == 'list')
        {
			$('#doc_search_date').val('');
			$('#from_search_date').val('');
			$('#to_search_date').val('');
			$flatpickr = $("#doc_search_date").flatpickr();
			$flatpickr.clear();
            $('#dd_search_category').val('').change();
        }
        else if (form == 'form')
        {
            DOC_NO = '';
            CLIENT_ID = '';
			$('#dd_category').val('').change();
			$('#txt_remarks').val('');
			$flatpickr = $("#doc_date").flatpickr();
			$flatpickr.clear();
			$('#detail_form').parsley().destroy();
			$('#timesheet_from_date').val('');
			$('#timesheet_to_date').val('');
			$('#dd_leaves').val('').change();
			$('#leave_from_date').val('');
			$('#leave_to_date').val('');
			$('#leave_days').val('');
			$('#txt_cost').val(0);
			$('#txt_gst').val(0);
			$('#txt_roundup').val(0);
			$('#txt_total').val(0);
			$('#dd_expenses').val('').change();
			$('.form-group').each(function () { $(this).removeClass('has-error'); });
			$('.help-block').each(function () { $(this).remove(); });
        }
        else if (form == 'remark_list_modal')
        {
            $('#doc_remark').val('');
            $('#remark_form').parsley().destroy();
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

		if (is_scroll == false)
		{
			$('#tbl_list > tbody').empty();
		}

		if (data.list.length > 0) // check if there is any data, precaution
		{
			let row = '';
			let data_val = '';

			if (data.rec_index)
			{
				RECORD_INDEX = data.rec_index;
			}

			data = data.list;
			for (var i = 0; i < data.length; i++)
			{
				var date = moment(data[i].doc_date, 'DD-MM-YYYY');
				data_val = escape(JSON.stringify(data[i])); //.replace(/'/,"");
				row += '<tr>' + '<td width="10%">';

				let btn_attachment = '';
				let btn_delete = '';
				if (data[i].attachment.length > 0)
				{
					for (var j = 0; j < data[i].attachment.length; j++)
					{
						if (data[i].verified == 0)
						{
							data_val_check = escape(JSON.stringify(data[i].attachment[j]));
							btn_delete = `<a href class="delete btn btn-outline-danger btn-xs waves-effect waves-light" data-id="`+data[i].doc_no+`" data-value="`+data_val_check+`">
											<i class="fas fa-trash-alt" aria-hidden="true" title="Delete file"></i>
										  </a> `;
						}

						let func = `$.fn.open_page('`+data[i].attachment[j].id+`','`+CURRENT_PATH+`download.php')`;
						btn_attachment += btn_delete+`<a href="javascript:void(0)" class="link-view-file btn btn-outline-info btn-xs waves-effect waves-light" onclick="${func}"><i class="fas fa-image"/></a>`;
					}
				}
				row += btn_attachment;
				
			row += '</td><td>' + data[i].doc_no + '</td>' +
					'<td>' + data[i].doc_date + '</td>' +
					'<td>' + data[i].descr + '</td>' +
					'<td>' + data[i].remarks + '</td>' +
					'<td>' + data[i].status + '</td>' +
					'<td><a class="btn btn-outline-primary btn-xs waves-effect waves-light"" data-toggle="tooltip" data-placement="left" title="View Comments" href="javascript:void(0)" data-value=\'' + data_val + '\' onclick="$.fn.view_remark(unescape($(this).attr(\'data-value\')))"><i class="fas fa-external-link-alt"></i></a></td>' +
					'</tr>';
			}
			$('#tbl_list tbody').append(row);
			$('.load-more').show();

			$('.delete').unbind().on('click', function (event)
			{
				event.preventDefault();

				var this_file = $(this);
				var data_val = JSON.parse(unescape($(this).attr('data-value')));
				var doc_no = $(this).attr('data-id');
				bootbox.confirm
					({
						title: "Delete Confirmation",
						message: "Are you sure to delete this attachment?.",
						buttons:
						{
							cancel:
							{
								label: '<i class="fa fa-times"></i> Cancel'
							},
							confirm:
							{
								label: '<i class="fa fa-check"></i> Yes'
							}
						},
						callback: function (result)
						{
							if (result == true)
							{
								$.fn.delete_fileupload(data_val, function ()
								{
									$.fn.delete_form(doc_no);
								});
							}
						}
					});

			});

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
	{
		$.fn.log_error(arguments.callee.caller, err.message);
	}
};

//populte leaves table tbl_ts_leaves for external timesheet submission 
$.fn.populate_leave_list_form = function (data)
{
	try
	{
		if (data) // check if there is any data, precaution 
		{
			$("#tbl_ts_leaves tbody").find("tr:not('#base_row_leave')").remove();

			let row = '';
			let data_val = '';
			for (var i = 0; i < data.length; i++)
			{
				data_val = JSON.stringify(data[i]); //.replace(/'/,"");

				row += '<tr>' +
					'<td>' + data[i].dd_leaves + '</td>' +
					'<td>' + data[i].leave_from_date + '</td>' +
					'<td>' + data[i].leave_to_date + '</td>' +
					'<td>' + data[i].leave_days + '</td>' +
					'<td>' +
					'<button type="button" class="btn btn-primary rotate-45 btn_reference"' +
					'onClick="$.fn.delete_leave(this);"' +
					' data=\'' + data_val + '\'>' +
					'<i class="fa fa-plus fa-fw" aria-hidden="true"></i>' +
					'</button>' +
					'</td>' +
					'</tr>';
			}
			$('#base_row_leave').before(row);
		}
	}
	catch (err)
	{
		$.fn.log_error(arguments.callee.caller, err.message);
	}
};

$.fn.delete_form = function (doc_no)
{
	try
	{
		if (doc_no == '')
		{
			$.fn.show_right_error_noty('Document Number cannot be empty');
			return;
		}

		var data =
		{
			doc_no: doc_no,
			emp_id: SESSIONS_DATA.emp_id
		};

		$.fn.write_data
			(
				$.fn.generate_parameter('delete_document', data),
				function (return_data)
				{
					if (return_data)
					{
						RECORD_INDEX = 0;
						$.fn.get_list(false);
						$.fn.show_right_success_noty('Data has been deleted successfully');
					}

				}, false, btn_save
			);
	}
	catch (err)
	{
		$.fn.log_error(arguments.callee.caller, err.message);
	}
};

$.fn.view_file = function (data)
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
	}
	catch (err)
	{
		$.fn.log_error(arguments.callee.caller, err.message);
	}
};

$.fn.add_leave = function ()
{
	try
	{
		let data = JSON.stringify
			({
				"leave_category": $('#dd_leaves').val(),
				"leave_from_date": $('#leave_from_date').val(),
				"leave_to_date": $('#leave_to_date').val(),
				"leave_days": $('#leave_days').val()
			});

		let row = '<tr>' +
			'<td>' + $('#dd_leaves option:selected').text() + '</td>' +
			'<td>' + $('#leave_from_date').val() + '</td>' +
			'<td>' + $('#leave_to_date').val() + '</td>' +
			'<td>' + $('#leave_days').val() + '</td>' +

			'<td>' +
			'<button type="button" class="btn btn-danger btn-xs  rotate-45 btn_addleaves"' +
			'onClick="$(this).closest(\'tr\').hide(\'slow\', function(){$(this).closest(\'tr\').remove();});"' +
			' data=\'' + data + '\'>' +
			'<i class="fas fa-window-close fa-fw" aria-hidden="true"></i>' +
			'</button>' +
			'</td>' +
			'</tr>';


		$('#dd_leaves').val('').change();
		$('#leave_from_date').val('');
		$('#leave_to_date').val('');
		$('#leave_days').val('');

		$('#base_row_leave').before(row);

	}
	catch (err)
	{
		$.fn.log_error(arguments.callee.caller, err.message);
	}
};


$.fn.delete_leave = function (obj)
{
	try
	{
		let data = JSON.parse($(obj).attr('data'));
		data.active_status = 0;
		$(obj).attr('data', JSON.stringify(data));
		$(obj).closest('tr').hide('slow');

	}
	catch (err)
	{
		$.fn.log_error(arguments.callee.caller, err.message);
	}
}

$.fn.save_form = function ()
{
	try
	{
		if ($('#detail_form').parsley().validate() == false)
        {
            btn_save.stop();
            return;
        }

		/* if ($('#files .file-upload.new').length == 0)
		{
			$.fn.show_right_error_noty('Please select file to upload');
			btn_save.stop();
			return;
		} */

	//	let str = JSON.parse($('#dd_category option:selected').attr('data-val'));
	//	let c_emp_access_id = str.field1;

		var data =
		{
			start_index: RECORD_INDEX,
			//limit: LIST_PAGE_LIMIT,
			is_admin: SESSIONS_DATA.is_admin,
			category_search_id: $('#dd_search_category').val(),
			from_date: $('#from_search_date').val(),
			to_date: $('#to_search_date').val(),
			doc_date:  $('#doc_date').val(),
			category_id: $('#dd_category').val(),
			category_name: $('#dd_category option:selected').text(),
			remarks: $('#txt_remarks').val(),
			emp_id: SESSIONS_DATA.emp_id,
			//c_emp_access_id: c_emp_access_id,
			email: SESSIONS_DATA.office_email,


			module_id: MODULE_ACCESS.module_id,
			module_name: MODULE_ACCESS.module_name,
			sender_name: SESSIONS_DATA.name,
			get_list: 0,
			timesheet_data: { "leave": [] }
		};

		if ($('#dd_category').val() == 7 || $('#dd_category').val() == 5)
		{
			data.cost = $('#txt_cost').val();
			data.gst = $('#txt_gst').val();
			data.roundup = $('#txt_roundup').val();
			data.total = $('#txt_total').val();
			data.noe = $('#dd_expenses').val();
		}

		if ($('#dd_category').val() == 103)
		{
			data.timesheet_from_date = moment($('#timesheet_from_date').val(), UI_DATE_FORMAT);
			data.timesheet_to_date = moment($('#timesheet_to_date').val(), UI_DATE_FORMAT);

			let ts_inputs = $(".btn_addleaves");
			for (let i = 0; i < ts_inputs.length; i++)
			{
				data.timesheet_data.leave.push(JSON.parse($(ts_inputs[i]).attr('data')));
			}
		}


		$.fn.write_data
			(
				$.fn.generate_parameter('add_document', data),
				function (return_data)
				{
					if (return_data.data)
					{
						//$.fn.set_edit_form();
						FILE_UPLOAD_PATH = `../files/${MODULE_ACCESS.module_id}/${return_data.data.doc_no}/`;

						if ($('#files .file-upload.new').length > 0)
						{
							//						let doc_date 		= $('#doc_date').val().split('-');
							//FILE_UPLOAD_PATH = `${MODULE_ACCESS.module_id}/${return_data.data.doc_no}/`;

							let attachment_data =
							{
								id: '',
								primary_id: return_data.data.doc_no,
								secondary_id: '',
								module_id: MODULE_ACCESS.module_id,
								filename: '',
								filesize: "0",
								json_field: {},
								emp_id: SESSIONS_DATA.emp_id
							};
							if ($('#files .file-upload.new').length > 0)
							{
								$.fn.upload_file(`files`, 'doc_no',  return_data.data.doc_no,
									attachment_data, function (total_files, total_success, filename, attach_return_data)
								{
									if (total_files == total_success)
									{
										$.fn.populate_fileupload(attach_return_data, `files`, true);
									}
								}, false, btn_save);
							}

							/*$.fn.upload_file('files', 'doc_no', return_data.data.doc_no,
								attachment_data, function (total_files, total_success, filename, attach_return_data)
							{
								 if (total_files == total_success)
								{
									$.fn.get_list(false);
									$.fn.show_right_success_noty('Data has been recorded successfully');
									$.fn.reset_form();
								}
							}, false, btn_save); */
						} 
						$.fn.reset_form('form');
						$.fn.show_right_success_noty('Data has been recorded successfully');

					}
				}
			);





		//        $.fn.upload_file('files','','',
		//        function(total_files, total_success,filename)
		//        {
		//        	data.filename  = filename;
		//		 	$.fn.write_data
		//			(
		//				$.fn.generate_parameter('add_document', data),
		//				function(return_data)
		//				{
		//					if(return_data.data)
		//					{
		//						$.fn.populate_list_form(return_data.data, false);
		//						$.fn.show_right_success_noty('Data has been recorded successfully');
		//						$.fn.reset_form();
		//					}
		//				},false, btn_save
		//			);
		//        },false,btn_save);

		//        $.fn.write_data
		//		(
		//			$.fn.generate_parameter('add_document', data),
		//			function(return_data)
		//			{
		//				if(return_data.data)
		//				{
		//					
		//					
		//					
		//					$.fn.populate_list_form(return_data.data, false);
		//					$.fn.show_right_success_noty('Data has been recorded successfully');
		//					$.fn.reset_form();
		//				}
		//
		//			},false, btn_save
		//		);


		//		$.fn.upload_file(function(filename)
		//		{
		//			data.filename  = filename;
		//		 	$.fn.write_data
		//			(
		//				$.fn.generate_parameter('add_document', data),
		//				function(return_data)
		//				{
		//					if(return_data.data)
		//					{
		//						$.fn.populate_list_form(return_data.data, false);
		//						$.fn.show_right_success_noty('Data has been recorded successfully');
		//						$.fn.reset_form();
		//					}
		//
		//				},false, btn_save
		//			);
		//		});

	}
	catch (err)
	{
		//console.log(err.message);
		$.fn.log_error(arguments.callee.caller, err.message);
	}
};


$.fn.set_edit_form = function (data)
{
    FORM_STATE = 1;
    $('#btn_save').html('<i class="fa fa-edit"></i> Update');
};


$.fn.view_remark = function (data)
{
	try
	{
		data = JSON.parse(data);

		var data =
		{
			doc_no: data.doc_no
		};
		$('#doc_remark').css("border-color","#6c757d")
		$.fn.fetch_data(
			$.fn.generate_parameter('get_document_remark', data),
			function(return_data) {
					$.fn.populate_remark_list_form(return_data.data);
			}
		);
		$('#document_no').val(data.doc_no);
		TO_EMP_ID = data.emp_id;
		$('#remarkListModal').modal('show');
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
			is_admin: SESSIONS_DATA.is_admin,
			category_search_id: $('#dd_search_category').val(),
			from_date: $('#from_search_date').val(),
			to_date: $('#to_search_date').val(),
			emp_id: SESSIONS_DATA.emp_id,
			cust_id: SESSIONS_DATA.cust_id
		};

		if (is_scroll)
		{
			data.start_index = RECORD_INDEX;
		}


		$.fn.fetch_data(
			$.fn.generate_parameter('get_document_list', data),
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
			}
		);
	}
	catch (err)
	{
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

$.fn.init_upload_file = function ()
{

	//$.fn.reset_upload_form();
	$.fn.intialize_fileupload('fileupload', 'files', $.fn.set_file_name);
};

$.fn.set_validation_form = function ()
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

    $('#remark_form').parsley
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
}

$.fn.get_month_from_string = function (mon)
{
	var month_number = new Date(Date.parse(mon + " 1, 2012")).getMonth() + 1;
	var s = month_number + "";
	while (s.length < 2) s = "0" + s;
	return s;
};

$.fn.set_file_name = function (filename)
{
	try 
	{
		let category = Number($('#dd_category').val());
		let doc_date = moment($('#doc_date').val(), 'D-MMM-YYYY');
		let doc_ext = filename.split('.').pop();
		let name = SESSIONS_DATA.username.trim();
		let new_name = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();

		switch (category) 
		{
			case 3:
				new_name += '_Timesheet';
				break;
			case 4:
				new_name += '_Medical_Certs';
				break;
			case 5:
				new_name += '_Medical_Bills';
				break;
			case 7:
				new_name += '_Claims';
				break;
			case 216:
				new_name += '_Timesheet';
				break;
		}

		new_name += '_' + doc_date.format('MMMM_YY') + '.' + doc_ext;
		return new_name;
	}
	catch (err) 
	{
		$.fn.log_error(arguments.callee.caller, err.message);
	}
};


$.fn.prepare_form = function ()
{
	try
	{
		if (MODULE_ACCESS.create == 0)
		{
			$('#btn_new').hide();
			$('#btn_save').hide();
			$('#btn_cancel').hide();
		}

		$('#doc_date,#timesheet_from_date,#timesheet_to_date,#leave_from_date,#leave_to_date').flatpickr({ 
            altInput: true,
            altFormat: "d-M-Y",
            dateFormat: "Y-m-d",
        });

		$('.populate').select2({tags: true, tokenSeparators: [",", " "] });

		$.fn.set_validation_form();
		$.fn.get_document_search_dropdown_data();
		$('#search_form').parsley
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

			$("#doc_search_date").flatpickr({
                mode:"range",
                altFormat: "d-M-Y",
                dateFormat: "Y-m-d",
                onChange:function(selectedDates){
                    var _this=this;
                    var dateArr=selectedDates.map(function(date){return _this.formatDate(date,'Y-m-d');});
                    $('#from_search_date').val(dateArr[0]);
                    $('#to_search_date').val(dateArr[1]);
                },
            });

		$.fn.get_list(false);
	}
	catch (err)
	{
		$.fn.log_error(arguments.callee.caller, err.message);
	}
};


$.fn.get_document_search_dropdown_data = function()
{
    try
    {   
        let lead_access = $.fn.get_accessibility(111); 
        let data    =
        {   
           /*  emp_id   : SESSIONS_DATA.emp_id,
            view_all : MODULE_ACCESS.viewall,
            lead_access_view_all : lead_access.viewall,
            lead_access_view     : lead_access.view */
        };
       
        $.fn.fetch_data
        ( 
            $.fn.generate_parameter('get_document_search_dropdown_data_check', data),
            function(return_data)
            {
                if (return_data.code == 0)
                {
                   $.fn.populate_dd_values('dd_search_category', return_data.data.category);
				   $.fn.populate_dd_values('dd_category', return_data.data.category);
				   $.fn.populate_dd_values('dd_expenses', return_data.data.expenses);
				   $.fn.populate_dd_values('dd_leaves', return_data.data.leaves);
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

$.fn.show_hide_form = function (form_status)
{
	$.fn.reset_form('form');

	if (form_status == 'NEW')
	{
		$('#list_div').hide(400);
		$('#new_div').show(400);
        $.fn.intialize_fileupload('doc_upload', 'files');
        $.fn.set_validation_form();
	}
	else if (form_status == 'BACK')
	{
		$('#list_div').show(400);
		$('#new_div').hide(400);
		$.fn.set_edit_form();
        $.fn.intialize_fileupload('doc_upload', 'files');
	}

};


$.fn.bind_command_events = function ()
{
	try
	{

		$('#btn_new').click(function (e)
		{
			e.preventDefault();
			$.fn.show_hide_form('NEW');
		});

		$('#btn_back').click(function (e)
		{
			e.preventDefault();
			$.fn.show_hide_form('BACK');
			RECORD_INDEX = 0;
			$.fn.get_list(false);
		});

		$('#btn_search').click(function()
		{
			$('#searchPanel').show();
			$('#btn_search').hide();
		});
		$('#btn_search_action').click(function (e)
        {
            e.preventDefault();
            RECORD_INDEX = 0;
            $.fn.get_list(false);
        });

		$('#btn_close_search').click(function()
		{
			$('#searchPanel').hide();
			$('#btn_search').show();
		});

        $('#btn_search_reset').click(function (e)
        {
			e.preventDefault();
			RECORD_INDEX = 0;
			$.fn.reset_form('list');
			//$.fn.reset_search_form();
			$.fn.get_list(false);
        });
		$('#btn_reset').click(function (e)
        {
			e.preventDefault();
			RECORD_INDEX = 0;
			$.fn.reset_form('form');
			$.fn.get_list(false);
        });

		$('#btn_save').click(function (e)
		{
			e.preventDefault();
			RECORD_INDEX = 0;
			btn_save = Ladda.create(this);
			btn_save.start();
			$.fn.save_form();
		});

		$('#btn_add_remark').click(function (e)
		{
			e.preventDefault();
			let doc_remark = $('#document_remark').val();
			if (doc_remark != '' && doc_remark != null)
			{
			   $('#document_remark').css("border-color","#6c757d");
			   btn_save_remarks = Ladda.create(this);
			   btn_save_remarks.start();
			   $.fn.edit_remark();
			}
			else{
			   $("#document_remark").focus();
			   $('#document_remark').css("border-color","red");
			}
		});

		$('#btn_load_more').click(function (e)
		{
			e.preventDefault();
			$.fn.get_list(true);
		});

		$('#dd_category').on('change', function (event) 
		{
			event.preventDefault();

			let val = $(this).val();

			$('#detail_form').parsley().destroy();
			$('#dd_expenses,#s2id_dd_expenses').attr('data-parsley-required', 'false');
			$('#dd_expenses').removeAttr('required');
			//    		$('#detail_form')	.parsley();
			$.fn.set_validation_form();

			if (val == 7 || val == 5)
			{
				$('.timesheet_details').slideUp(200);     	
				$('.claim_details').slideDown(200);

				$('#detail_form').parsley().destroy();
				$('#dd_expenses,#s2id_dd_expenses').attr('data-parsley-required', 'true');
				$('#dd_expenses').attr('required', 'required');
				$.fn.set_validation_form();

			}
			else if (val == 216)
			{
				$('.claim_details').slideUp(200);    	
				$('.timesheet_details').slideDown(200);  
			}
			else
			{
				$('.claim_details').slideUp(200);
				$('.timesheet_details').slideUp(200);   
			}
		});

		/**
		 * Function for selecting the whole text when the input field is clicked
		 * @method
		 * @param  {event} event [description]
		 */
		$('#txt_cost, #txt_gst, #txt_roundup').on('click', function (event) 
		{
			event.preventDefault();
			this.select();
		});

		$('#txt_cost, #txt_gst, #txt_roundup').on('change', function (e) 
		{
			e.preventDefault();
			let total = parseFloat($('#txt_cost').val()) + parseFloat($('#txt_gst').val()) + parseFloat($('#txt_roundup').val());
			$('#txt_total').val(total.toFixed(2));
		});


		$('#btn_addleaves').click(function (e)
		{
			e.preventDefault();
			$.fn.add_leave();
			return;
		});


		$.fn.init_upload_file();
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
		$.fn.prepare_form();
		$.fn.bind_command_events();
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