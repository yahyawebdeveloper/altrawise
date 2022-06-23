var RECORD_INDEX = 0;
var btn_save, btn_sync, btn_remarks, btn_main_remarks;
var att_user_id = '';
var ROW_OBJ;
$.fn.show_hide_form = function (form_status)
{
	$.fn.reset_form('form');

	if (form_status == 'NEW')
	{
		$('#list_div').hide(400);
		$('#new_div').show(400);
	}
	else if (form_status == 'BACK')
	{
		$('#list_div').show(400);
		$('#new_div').hide(400);
	}
};
$.fn.populate_month_detail_item = function (data, obj)
{
	try
	{

		if ($('#div_more_info_detail_item').is(':visible'))
		{
			$('#div_more_info_detail_item').hide();
			$('#div_more_info_detail_item').closest('tr').remove();
		}

		if (data)
		{
			data = JSON.parse(data);
			data = data.details;

			$('#tbl_month_detail_item > tbody').empty();
			let item_row = '';
			for (i = 0; i < data.length; i++)
			{
				let checktime = moment(data[i].checktime, 'YYYY-MM-DD HH:mm:ss').format('h:mm A');
				let status = '<i class="fa fa-arrow-circle-down text-success"></i> CHECK IN';

				if (data[i].check_status == 1)
				{
					status = '<i class="fa fa-arrow-circle-up text-danger"></i> CHECK OUT';
				}

				if (i == 0 && data[i].check_status == 0)
				{
					if (moment.utc(checktime, 'h:mm A').isAfter(moment.utc("9:15 AM", 'h:mm A')))
					{
						status += '&nbsp;&nbsp;<i class="fa fa-minus-circle text-danger"></i> <b>[LATE IN]</b>';
					}
				}

				if (i == (data.length - 1) && data[i].check_status == 1)
				{
					if (moment.utc(checktime, 'h:mm A').isBefore(moment.utc("6:00 PM", 'h:mm A')))
					{
						status += '&nbsp;&nbsp;<i class="fa fa-minus-circle text-danger"></i> <b>[EARLY CHECKOUT]</b>';
					}
				}

				item_row += `
	                <tr>
	                    <td>${checktime}</td>
	                    <td>${status}</td>
	                </tr>
				`;
			}
			$('#tbl_month_detail_item > tbody').html(item_row);

			let row = '<tr><td colspan=7>' + $('#div_more_info_parent_item').html() + '</td></tr>';
			$(obj).closest('tr').after($(row));
		}

		$('#div_more_info_detail_item').slideToggle();

	}
	catch (err)
	{
		$.fn.log_error(arguments.callee.caller, err.message);
	}
};
$.fn.show_remarks = function (data, obj)
{
	try
	{
		if (data)
		{
			let item = JSON.parse(data);
			ROW_OBJ = $(obj);

			$('#txt_remark').val('');
			$('#txt_remark').val(item.remarks);
			$('#btn_remarks_apply').attr('data', escape(data));
			$('#remark_modal').modal();
		}

	}
	catch (err)
	{
		$.fn.log_error(arguments.callee.caller, err.message);
	}
};
$.fn.show_leave = function (data, obj)
{
	try
	{
		if (data)
		{
			if (data)
			{
				data = JSON.parse(data);
				data = data.leaves_data;

				$('#tbl_leave_detail_item > tbody').empty();
				let item_row = '';
				for (i = 0; i < data.length; i++)
				{
					item_row += `
		                <tr>
		                    <td>${data[i].leave_date}</td>
		                    <td>${data[i].leave_type}</td>
		                    <td>${data[i].reason}</td>
		                </tr>
					`;
				}
				$('#tbl_leave_detail_item > tbody').html(item_row);
			}
			$('#leave_modal').modal();
		}
	}
	catch (err)
	{
		$.fn.log_error(arguments.callee.caller, err.message);
	}
};
$.fn.show_appt = function (data, obj)
{
	try
	{
		if (data)
		{
			if (data)
			{
				data = JSON.parse(data);
				data = data.appt_data;

				$('#tbl_appt_detail_item > tbody').empty();
				let item_row = '';
				for (i = 0; i < data.length; i++)
				{
					let in_time = '00:00';
					let out_time = '00:00';
					if (data[i].check_in_time)
					{
						in_time = moment(data[i].check_in_time, 'HH:mm:ss').format('h:mm A');
					}
					if (data[i].check_out_time)
					{
						out_time = moment(data[i].check_out_time, 'HH:mm:ss').format('h:mm A');
					}

					item_row += `
		                <tr>
		                    <td>
		                    	<i class="fa fa-clock-o text-success fa-fw" aria-hidden="true"></i> ${data[i].date_time} 
		                    	<br/>
		                    	<i class="fa fa-clock-o text-success fa-fw" aria-hidden="true"></i> ${data[i].date_time_to}
		                    </td>
		                    <td>${data[i].email.split(",").join("<br/>")}</td>
		                    <td>
		                    	<i class="fa fa-arrow-circle-down text-success"></i> ${in_time}
		                    	<br/>
		                    	<i class="fa fa-arrow-circle-up text-danger"></i> ${out_time}
		                    </td>
		                    <td>
		                    	<i class="fa fa-home text-success"></i> ${data[i].lat_add} 
		                    	<br/>
		                    	<i class="fa fa-home text-danger"></i> ${data[i].lng_add}
		                    </td>
		                    <td>
		                    	${data[i].client_name}
		                    </td>
		                </tr>
					`;
				}
				$('#tbl_appt_detail_item > tbody').html(item_row);
			}
			$('#appt_modal').modal();
		}
	}
	catch (err)
	{
		$.fn.log_error(arguments.callee.caller, err.message);
	}
};
$.fn.get_total_time = function (data)
{
	var duration = moment.duration(data);
	return Math.floor(duration.asHours()) + moment.utc(duration.asMilliseconds()).format(":mm:ss");
}
$.fn.populate_month_detail_row = function (data)
{
	try
	{
		let item_row = '';
		let background = '';
		let remarks = '';
		let in_time = 0;
		let out_time = 0;
		let appt_time = 0;
		let appt_link = '';
		$('#tbl_month_detail > tbody').empty();
		if (data)
		{
			for (i = 0; i < data.length; i++)
			{

				let status = '<i class="fa fa-check-circle text-success"></i>';

				if (moment.utc(data[i].in_time, 'hh:mm').isBefore(moment.utc("06:00", 'hh:mm')))
				{
					status = '<i class="fa fa-times-circle text-danger"></i>';
				}

				remarks = data[i].remarks;
				if (data[i].remarks == '')
				{
					remarks = '<i class="fa fa-external-link"></i>';
				}
				else if (data[i].remarks.length > 20)
				{
					remarks = data[i].remarks.substring(0, 20) + "...";
				}

				background = '';
				if (data[i].weekends == 1)
				{
					status = '<i class="fa fa-film text-success"></i>';
					remarks = '';
				}
				if (data[i].ph == 1)
				{
					status = `<i class="fa fa-home text-success"> &nbsp;${data[i].ph_data}</i>`;
					remarks = '';
				}
				if (data[i].leaves_data.length > 0)
				{
					background = 'background-color: white';
					status = `<a href="javascript:void(0)" onclick="event.stopPropagation();$.fn.show_leave(unescape($(this).closest('tr').data('value')),this)"><i class="fa fa-wheelchair text-success"></i></a>`;
				}
				if (data[i].no_att_data == 1)
				{
					status = '<i class="fa fa-warning text-danger"></i>';
					background = 'background-color: Ivory';
				}

				if (data[i].in_time != "00:00")
				{
					in_time += parseFloat(data[i].in_time_m * 1000);
				}
				if (data[i].out_time != "00:00")
				{
					out_time += parseFloat(data[i].out_time_m * 1000);
				}

				if (data[i].appt_time != "00:00")
				{
					appt_time += parseFloat(data[i].appt_time_m * 1000);
					appt_link = `<a href="javascript:void(0)" onclick="event.stopPropagation();$.fn.show_appt(unescape($(this).closest('tr').data('value')),this);">${data[i].appt_time}</a>`;
				}
				else
				{
					appt_link = data[i].appt_time;
				}

				item_row += `
	                <tr style="cursor: pointer;${background}" class="attendance_detail" 
	                	data-value='${escape(JSON.stringify(data[i]))}'
	                	onclick="$.fn.populate_month_detail_item(unescape( $(this).closest('tr').data('value')),this )">
	                    <td>${data[i].date}</td>
	                    <td>${data[i].in_time}</td>
	                    <td>${data[i].out_time}</td>
	                    <td>${appt_link}</td>
	                    <td>${data[i].filo}</td>
	                    <td>${status}</td>
	                    <td><a href="javascript:void(0)" onclick="event.stopPropagation();$.fn.show_remarks(unescape($(this).closest('tr').data('value')),this)">${remarks}</a></td>
	                </tr>
				`;
			}
		}

		item_row += `
            <tr style="background-color: OldLace" class="attendance_detail">
                <td></td>
                <td><b>${$.fn.get_total_time(in_time)}</b></td>
                <td><b>${$.fn.get_total_time(out_time)}</b></td>
                <td><b>${$.fn.get_total_time(appt_time)}</b></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
		`;

		$('#tbl_month_detail > tbody').html(item_row);

		//		console.log($.fn.get_total_time(in_time));

	}
	catch (err)
	{
		console.log(arguments.callee.caller + ' ' + err.message);
		//		$.fn.log_error(arguments.callee.caller,err.message);
	}
};
$.fn.populate_month_detail_form = function (data, obj, att_emp_id)
{
	try
	{
		if ($('#div_more_info_detail').is(':visible'))
		{
			$('#div_more_info_detail').hide();
			$('#div_more_info_detail').closest('tr').remove();
		}

		data = JSON.parse(data);

		att_user_id = data.user_id;

		var param =
		{
			user_id: data.user_id,
			start_date: data.check_start_date,
			end_date: data.check_end_date,
			emp_id: SESSIONS_DATA.emp_id,
			att_emp_id: att_emp_id,
			email: data.email
		}

		$.fn.fetch_data
			(
				$.fn.generate_parameter('get_attendance_month_detail', param),
				function (return_data)
				{
					if (return_data.data)
					{
						$.fn.populate_month_detail_row(return_data.data);
					}
				}, true
			);

		let row = '<tr><td colspan=3>' + $('#div_more_info_parent').html() + '</td></tr>';
		$(obj).closest('tr').after($(row));

		$('#div_more_info_detail').slideToggle();

	}
	catch (err)
	{
		$.fn.log_error(arguments.callee.caller, err.message);
	}
};
$.fn.verify_approval = function (data, obj, status)
{
	try
	{

		data = JSON.parse(data);
		let btn = Ladda.create(obj);
		btn.start();

		let param =
		{
			user_id: data.user_id,
			emp_id: SESSIONS_DATA.emp_id,
			status: status,
			att_date: data.check_end_date,

			module_id: MODULE_ACCESS.module_id,
			module_name: MODULE_ACCESS.module_name,
			sender_name: SESSIONS_DATA.name
		};

		$.fn.write_data
			(
				$.fn.generate_parameter('verify_approve_attendance', param),
				function (return_data)
				{
					if (return_data.data)
					{
						if (return_data.data)
						{
							if (status == 1)
							{
								$(obj).closest('span').html(`<i class="fa fa-pencil-square-o" aria-hidden="true">Verified</i><br/>`).remove('slow');
							}
							else if (status == 2)
							{
								$(obj).closest('span').html(`<i class="fa fa-check-square-o" aria-hidden="true">Approved</i>`).remove('slow');
							}
						}
					}
				}, false, btn
			);
	}
	catch (err)
	{
		$.fn.log_error(arguments.callee.caller, err.message);
	}
}

$.fn.save_main_remarks = function ()
{
	try
	{

		let data = JSON.parse(unescape($('#btn_add_remark').attr('data')));

		let param =
		{
			user_id: data.user_id,
			att_date: data.check_end_date,
			remarks: $('#txt_main_remark').val(),
			emp_id: SESSIONS_DATA.emp_id,
			emp_name: SESSIONS_DATA.name
		}

		$.fn.write_data
			(
				$.fn.generate_parameter('add_main_remarks_attendance', param),
				function (return_data)
				{
					if (return_data.data)
					{
						//					console.log(return_data.data[0].remarks);
						$.fn.populate_main_remarks($.fn.get_json_string(return_data.data[0].remarks));
					}
				}, false, btn_main_remarks
			);

		$('#remark_modal').modal('hide');

	}
	catch (err)
	{
		$.fn.log_error(arguments.callee.caller, err.message);
	}
}
$.fn.populate_main_remarks = function (data)
{
	try
	{
		$('#txt_main_remark').val('');
		$('#tbl_remark_list tbody').empty();
		if (data != false)
		{
			let row = '';
			for (i = 0; i < data.length; i++)
			{
				row += `<tr>
						<td>${data[i].remarks}</td>
						<td>${data[i].created_by}</td>
						<td>${data[i].created_date}</td>
					</tr>`;
			}

			$('#tbl_remark_list tbody').append(row);
		}
	}
	catch (err)
	{
		$.fn.log_error(arguments.callee.caller, err.message);
	}
};
$.fn.show_main_remarks = function (data, obj)
{
	try
	{
		if (data)
		{

			let item = JSON.parse(data);
			json_remarks = $.fn.get_json_string(item.json_remarks);

			$.fn.populate_main_remarks(json_remarks);

			$('#btn_add_remark').attr('data', escape(data));
			$('#remarks_list_modal').modal();
		}

	}
	catch (err)
	{
		$.fn.log_error(arguments.callee.caller, err.message);
	}
};
$.fn.populate_detail_form = function (data)
{
	try
	{
		var data = JSON.parse(data);
		$.fn.show_hide_form('NEW');
		$('#h4_primary_no').html(data.portal_name.split('@')[1]);


		let att_emp_id = data.emp_id;
		$.fn.fetch_data
			(
				$.fn.generate_parameter('get_attendance_month', { user_id: data.pin2, emp_id: SESSIONS_DATA.emp_id }),
				function (return_data)
				{
					if (return_data.data)
					{
						let data = return_data.data;
						let row = '';
						let verify = '';
						let status = '';
						let approve = '';
						let json_approval = false;
						$('#tbl_month tbody').empty();

						for (i = 0; i < data.length; i++)
						{
							verify = '';
							approve = '';
							json_approval = $.fn.get_json_string(data[i].json_approval);

							if (json_approval !== false)
							{
								if (json_approval.verify.verified == 1)
								{
									status = `<i class="fa fa-pencil-square-o" aria-hidden="true">Verified</i><br/>`;
								}
								else
								{
									if (MODULE_ACCESS.verify == 1)
									{
										verify = `<button type="button" class="btn btn-info-alt btn-sm btn-label ladda-button tooltips" data-toggle="tooltip" data-placement="left" title="Verify"
											  onclick="$.fn.verify_approval(unescape( $(this).closest('tr').data('value')),this,1)">
				                    				<i class="fa fa-pencil-square-o" aria-hidden="true"></i>
				                    				<span class="hidden-xs">Verify</span>
				                    	 	  </button>`;
									}
								}
								if (json_approval.approve.approved == 1)
								{
									status += `<i class="fa fa-check-square-o" aria-hidden="true">Approved</i>`;
								}
								else
								{
									if (MODULE_ACCESS.approve == 1)
									{
										approve = `<button type="button" class="btn btn-success-alt btn-sm btn-label ladda-button tooltips" data-toggle="tooltip" data-placement="left" title="Approve"
												onclick="$.fn.verify_approval(unescape( $(this).closest('tr').data('value')),this,2)">
				                    				<i class="fa fa-check-square-o" aria-hidden="true"></i>
				                    				<span class="hidden-xs">Approve</span>
				                    	 	  </button>`;
									}
								}
							}
							else
							{
								if (MODULE_ACCESS.verify == 1)
								{
									verify = `<button type="button" class="btn btn-info-alt btn-sm btn-label ladda-button tooltips" data-toggle="tooltip" data-placement="left" title="Verify"
										  onclick="$.fn.verify_approval(unescape( $(this).closest('tr').data('value')),this,1)">
			                    				<i class="fa fa-pencil-square-o" aria-hidden="true"></i>
			                    				<span class="hidden-xs">Verify</span>
			                    	 	  </button>`;
								}
								else if (MODULE_ACCESS.approve == 1)
								{
									approve = `<button type="button" class="btn btn-success-alt btn-sm btn-label ladda-button tooltips" data-toggle="tooltip" data-placement="left" title="Approve"
											onclick="$.fn.verify_approval(unescape( $(this).closest('tr').data('value')),this,2)">
			                    				<i class="fa fa-check-square-o" aria-hidden="true"></i>
			                    				<span class="hidden-xs">Approve</span>
			                    	 	  </button>`;
								}
							}

							row += `<tr class="timesheet" id="TR_ROW_${i}" 
								data-value="${escape(JSON.stringify(data[i]))}" >
								<td>${data[i].attendance_month}</td>
								<td>
									${status}
								</td>
								<td class="action-col">
									<button type="button" class="btn btn-primary-alt btn-sm tooltips" data-toggle="tooltip" data-placement="left" title="Show Details"
										onclick="$.fn.populate_month_detail_form(unescape( $(this).closest('tr').data('value')),this, ${att_emp_id})">
		                    				<i class="fa fa-tasks" aria-hidden="true"></i>
		                    	 	</button>
		                    	 	<button type="button" class="btn btn-info-alt btn-sm tooltips" data-toggle="tooltip" data-placement="left" title="View Comments"
										onclick="$.fn.show_main_remarks(unescape( $(this).closest('tr').data('value')),this)">
		                    				<i class="fa fa-external-link" aria-hidden="true"></i>
		                    	 	</button>
		                    	 	<span>${verify}</span>
									<span>${approve}</span>
								</td>
								
								</tr>`;
						}
						$('#tbl_month tbody').append(row);
					}
				}, true
			);
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
		if (form == 'list')
		{
			RECORD_INDEX = 0;
			att_user_id = '';
			$('#txt_name_search').val('');
		}
	}
	catch (err)
	{
		$.fn.log_error(arguments.callee.caller, err.message);
	}
};
$.fn.sync_users = function ()
{
	try
	{
		var data =
		{
			emp_id: SESSIONS_DATA.emp_id,
			email: SESSIONS_DATA.office_email
		};

		$.fn.write_data
			(
				$.fn.generate_parameter('sync_attendance_users', data),
				function (return_data)
				{
					if (return_data.data)
					{
						RECORD_INDEX = 0;
						$.fn.get_list(false);
						$('#lbl_sync_time').html("Last Sync : " + return_data.data.time_last_run);
						$.fn.show_right_success_noty('User Data has been synced successfully');
					}
				}, false, btn_sync
			);

		$.fn.write_data
			(
				$.fn.generate_parameter('sync_attendance', data),
				function (return_data)
				{
					if (return_data.data)
					{
						$.fn.show_right_success_noty('Attendance Data is been synced in background and will be notified by email');
					}
				}, false, false
			);


	}
	catch (err)
	{
		$.fn.log_error(arguments.callee.caller, err.message);
	}
};
function exportTable2PDF(title,tableId,orientation){

    var doc = new jsPDF(orientation, 'pt', 'a4');

    var htmlcontent = $('#'+tableId+'').html();
    var $jQueryObject = $($.parseHTML(htmlcontent));
    $jQueryObject.find(".ng-hide").remove();
    $jQueryObject.find(".text-danger").remove();
    $jQueryObject.find(".collapse").remove();

    var i = 0;
    var columns = [],
        rows = [],
        ignoreColumn = [];

    $jQueryObject.find('tr').each(function() {
         if(i==0) {
            var k = 0, m = 0, n = 0;
             $(this).find('th').each(function (index, data) {
                 if($(this).attr('id') != "ignorePdf"){
                    columns[k] = $(this)[0].innerText.trim();
                     k++;
                 }
                 else{
                    ignoreColumn[m] = n;
                    m++;
                 }
                 n++;
             });
         }
         else{
             var l = 0, q = 0;
             var rowData = [];
             //$(this).filter(':visible').find('td').each(function(index,data) {
             $(this).find('td').each(function(index,data) {
                 if(ignoreColumn.indexOf(q) == -1){
                    rowData[l] = $(this)[0].innerText.trim();
                    l++;
                 }
                 q++;
             });
             if(l > 0) {
                 rows[i - 1] = rowData;
             }
             if(l == 0){
                 i = i - 1;
             }
         }
         i++;
     });

    var dateObj = new Date();
    var currentDate = dateObj.getDate()+"/"+(dateObj.getMonth() + 1)+"/"+dateObj.getFullYear();

    doc.autoTable(columns, rows, {
        theme: 'striped',
        margin: {top: 60},
        styles: {overflow: 'linebreak'},
        bodyStyles: {valign: 'top'},
        beforePageContent: function(data) {
            doc.text(title, 40, 50);
        },
        afterPageContent: function(data) {
            doc.text(currentDate, 40, doc.internal.pageSize.height - 30);
        }
    });
    doc.save(title.trim()+".pdf");
}
function exportTable2CSV(title,tableId){

    var clean_text = function(text){
        text = text.replace(/"/g, '""');
        return '"'+text+'"';
    };

    var htmlcontent = $('#'+tableId+'').html();
    var $jQueryObject = $($.parseHTML(htmlcontent));
    $jQueryObject.find(".ng-hide").remove();
    $jQueryObject.find(".text-danger").remove();
    $jQueryObject.find(".collapse").remove();

    var i = 0;
    var rows = [],
        ignoreColumn = [];
    rows[0] = title;
    rows[1] = "";
    $jQueryObject.find('tr').each(function() {
        if(i==0) {
            var k = 0, m = 0, n = 0;
            var columnData = [];
            $(this).find('th').each(function (index, data) {
                if($(this).attr('id') != "ignorePdf"){
                    columnData[k] = clean_text($(this)[0].innerText.trim());
                    k++;
                }
                else{
                    ignoreColumn[m] = n;
                    m++;
                }
                n++;
            });
            columnData = columnData.join(",");
            rows[2] = columnData;
        }
        else{
            var l = 0, q = 0;
            var rowData = [];
            $(this).find('td').each(function(index,data) {
                if(ignoreColumn.indexOf(q) == -1){
                    rowData[l] = clean_text($(this)[0].innerText.trim());
                    l++;
                }
                q++;
            });
            if(l > 0) {
                rowData = rowData.join(",");
                rows[i+2] = rowData;
            }
            if(l == 0){
                i = i - 1;
            }
        }
        i++;
    });

    rows = rows.join("\n");

    var csv = rows;
    var uri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
    var download_link = document.createElement('a');
    download_link.href = uri;
    var ts = new Date().getTime();
    if(title==""){
        download_link.download = ts+".csv";
    } else {
        download_link.download = title+"-"+ts+".csv";
    }
    document.body.appendChild(download_link);
    download_link.click();
    document.body.removeChild(download_link);


}
$.fn.populate_list_form = function (data, is_scroll)
{
	try
	{
		if (is_scroll == false)
		{
			$('#tbl_list1 > tbody').empty();
		}

		if (data.list.length > 0) // check if there is any data, precaution
		{
			let row = '';
			let data_val = '';
			let access_level = SESSIONS_DATA.access_level;

			if (data.rec_index)
			{
				RECORD_INDEX = data.rec_index;
			}

			data = data.list;
			for (var i = 0; i < data.length; i++)
			{
				//				data_val = escape(JSON.stringify(data[i])); //.replace(/'/,"");

				row += `<tr id="TR_ROW_${i}" 
							style="cursor: pointer;"
							onclick="$.fn.populate_detail_form(unescape( $(this).closest('tr').attr('data-value')),this )"
							data-value="${escape(JSON.stringify(data[i]))}">
							
							<td>${data[i].id}</td>
							<td>${data[i].portal_name}</td>
							<td>${data[i].name}</td> 
							
							<td>${data[i].user_group}</td> 
							<td>${data[i].card}</td>
							<td>${data[i].pin2}</td>
							<td>
								<a href="javascript:void(0)" onclick="$.fn.populate_detail_form(unescape( $(this).closest('tr').attr('data-value')),this )"><i class="fa fa-sign-in"></i></a>
							</td>`;

			}
			$('#tbl_list1 tbody').append(row);
			$('.load-more').show();
		}
	}
	catch (err)
	{
		$.fn.log_error(arguments.callee.caller, err.message);
	}
};
$.fn.last_sync = function ()
{
	try
	{
		var data =
		{
			id: "2",
			emp_id: SESSIONS_DATA.emp_id
		};

		$.fn.fetch_data
			(
				$.fn.generate_parameter('get_attendance_last_sync', data),
				function (return_data)
				{
					if (return_data.data)
					{
						$('#lbl_sync_time').html("Last Sync : " + return_data.data[0].time_last_run);
					}
				}, false
			);
	}
	catch (err)
	{
		$.fn.log_error(arguments.callee.caller, err.message);
	}
};
$.fn.get_list = function (is_scroll)
{
	try
	{
		var data =
		{
			start_index: RECORD_INDEX,
			limit: LIST_PAGE_LIMIT,
			is_admin: SESSIONS_DATA.is_admin,
			name: $('#txt_name_search').val(),
			emp_id: SESSIONS_DATA.emp_id,
			view_it: MODULE_ACCESS.view,
			view_all: MODULE_ACCESS.viewall
		};

		if (is_scroll)
		{
			data.start_index = RECORD_INDEX;
		}

		$.fn.fetch_data_for_table_v2
			(
				$.fn.generate_parameter('get_attendance_users_list', data),
				$.fn.populate_list_form, is_scroll, 'tbl_list1', false, false, false, true
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
		 $('#btn_back').click(function (e)
		{
			e.preventDefault();
			$.fn.show_hide_form('BACK');
		});

		$('#btn_search').click(function (e)
		{
			e.preventDefault();
			RECORD_INDEX = 0;
			$.fn.get_list(false);
		});

		$('#btn_reset').click(function (e)
		{
			e.preventDefault();
			$.fn.reset_form('list');
			$.fn.get_list(false);
		});

		$('#btn_sync').click(function (e)
		{
			e.preventDefault();
			btn_sync = Ladda.create(this);
			btn_sync.start();
			$.fn.sync_users();
		});

		$('#btn_load_more').click(function (e)
		{
			e.preventDefault();
			$.fn.get_list(true);
		});

		$('#btn_remarks_apply').click(function (e)
		{
			e.preventDefault();
			btn_remarks = Ladda.create(this);
			btn_remarks.start();
			$.fn.save_remarks();
		});

		$('#btn_add_remark').click(function (e)
		{
			e.preventDefault();
			btn_main_remarks = Ladda.create(this);
			btn_main_remarks.start();
			$.fn.save_main_remarks();
		});
		$('#showSearchDiv').on('click', function (e)
        {
            e.preventDefault();
            $('#searchDiv').show();
			$("#showSearchDiv").hide();
        });
		$('#closeSearch').on('click', function (e)
        {
            e.preventDefault();
            $('#searchDiv').hide();
			$("#showSearchDiv").show();
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
		$("#searchDiv").hide();
		if (MODULE_ACCESS.create == 0)
		{
			$('#btn_new').hide();
			$('#btn_sync').hide();
		}

		$.fn.get_list();
		$.fn.last_sync();
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
 
