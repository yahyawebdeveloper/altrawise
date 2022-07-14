CURRENT_PATH	= '../../';

$.fn.data_table_features = function()
{	
	try
	{	
		if (!$.fn.dataTable.isDataTable( '#tbl_asset_dashboard' ) )
		{
			table = $('#tbl_asset_dashboard').DataTable
			({
				"searching"	: false,
				"paging"	: false,
				"info"		: false,
				"order"		: []
			});
		}

		if (!$.fn.dataTable.isDataTable( '#tbl_asset_dashboard_detail' ) )
		{
			table = $('#tbl_asset_dashboard_detail').DataTable
			({
				"searching"	: false,
				"paging"	: false,
				"info"		: false,
				"order"		: []
			});
		}
	}
	catch(err)
	{
		$.fn.log_error(arguments.callee.caller,err.message);
	}
};

$.fn.data_table_destroy = function()
{
	try
	{
		if ($.fn.dataTable.isDataTable('#tbl_asset_dashboard') )
		{
			table.destroy();
		}

		if ($.fn.dataTable.isDataTable('#tbl_asset_dashboard_detail') )
		{
			table.destroy();
		}
	}
	catch(err)
	{
		$.fn.log_error(arguments.callee.caller,err.message);
	}
};

$.fn.reset_form = function(form)
{
	try
	{
		
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
      
	}
	catch(err)
	{
		$.fn.log_error(arguments.callee.caller,err.message);
	}
};

$.fn.got_to_task = function (task_no)
{
    try 
    {	
    	console.log(task_no);
    	if(task_no != '')
    	{
    		window.open("../task/task.php?task_no=" + task_no + "&method=details", '_blank');
    	}
    }
    catch (e)
    {
        $.fn.log_error(arguments.callee.caller, e.message);
    }
}

$.fn.get_list = function()
{
	try
	{
		//get filter values in variable
	    let filter_val = '';
	    $.each($("input[name='appointment_filter[]']:checked"), function()
	    {
	    	filter_val += $(this).val() + ",";
		});

		//initialize calendar plugin
	  /*	let calendar = $('#calendar-drag').fullCalendar
	  	({
		    header			: 
		    {
		    	left		: 'prev,next today',
		    	center		: 'title',
		    	right		: 'month,agendaWeek,agendaDay'
		    },
		    selectable		: true,
		    selectHelper	: true,
		    editable		: true,
		    eventSources	: 
		    [{
			    url			: CURRENT_PATH + controller_URL,
			    method		: 'POST',
			    dataType	: "json",
			    contentType	: "application/json",
			    data		: ($.fn.generate_parameter('get_admin_events', '', {filter_val: filter_val, company_id:SESSIONS_DATA.company_id}))
		    }],
		    eventClick		: function(calEvent, jsEvent, view) 
		    {
		        try 
		        {
			        if (calEvent.type == 'task') 
				    {
				    	//$.fn.got_to_task(calEvent.id);
				    	let due_date = moment(calEvent.start).format('YYYY-MM-DD');
				    	$.fn.fetch_data
				        (
					        $.fn.generate_parameter('get_tasks_for_dashboard', {
				        														due_date: due_date,
				        														is_admin: SESSIONS_DATA.is_admin,
				        														emp_id 	: SESSIONS_DATA.emp_id, 
				        												   }),
					        function(return_data) 
					        {	
					        	$('#display_tasks table > tbody').empty();
								if (return_data.data.length > 0)
        						{	let row	= '';
        							data 	= return_data.data;
        							for(var i = 0; i < data.length; i++)
            						{
            							row += `<tr>
						                    <td>${data[i].task_no}</td>
						                    <td>${data[i].title}</td>
						                    <td>${data[i].task_type_desc}</td>
						                    <td>${data[i].task_priority_desc}</td>
						                    <td>
						                    	<a href="javascript:void(0);" onclick="$.fn.got_to_task('${data[i].task_no}')"><i class="fa fa-sign-in"></i></a>
						                    </td>
					                    </tr>`;
            						}
        							
        							$('#display_tasks table > tbody').append(row);
        						}
        						$('#display_tasks').modal('show');
					        }
				        );
				    }
				    else if(calEvent.type != 'holiday')
				    {
				        $.fn.fetch_data
				        (
					        $.fn.generate_parameter('get_admin_event_detail', {id: calEvent.id, type: calEvent.type }),
					        function(return_data) 
					        {
					            let data = return_data.data;
					            for (let propName in data) 
					            {
					                if (propName == 'people_name') 
					                {
					                 	$('#display-' + propName).html(data[propName].split(',').join('\n'));
					              	} 
					              	else 
					              	{
					                	$('#display-' + propName).html(data[propName]);
					              	}
					            }

					            if (calEvent.type == 'appointment') 
					            {
					              	$('#display_appointment').modal('show');
					            } 
					            else if (calEvent.type == 'leave') 
					            {
					              	$('#display_leave').modal('show');
					            }
					        }
				        );
				    }
		        } 
		        catch (err) 
		        {
		            $.fn.log_error(arguments.callee.caller, err.message);
		        }
		    },
		    buttonText	: 
		    {
		    	today	: 'Today',
		    	month	: 'Month',
		    	week	: 'Week',
		    	day		: 'Day'
		    }
		});*/
	}
	catch(err)
	{
		$.fn.log_error(arguments.callee.caller,err.message);
	}
};

$.fn.populate_alluser_detail = function(emp_id)
{
	try
	{
	 	$.fn.fetch_data
		(
			$.fn.generate_parameter('populate_dashboard_all_user_detail', {emp_id 	: emp_id}),
			function(return_data)
			{
				if(return_data)
				{
					$('#tbl_list > tbody').empty();
					let data 	= return_data.data;
					let row		= '';
					row 		+= `<tr class="textcenter">${data[0].name}</tr>`;
					for(let i = 0; i < data.length; i++)
					{
						var res = data[i].page.split(".");
						row +=`<tr class="">
									<td>${res[0]}</td>
									<td>${data[i].duration}</td>
								</tr>`;
					}
					row += `<tr class="texthead">
								<td>Total Duration</td>
	                            <td>${data[0]['totalduration']}</td>
                            </tr>`;
					
					$('#tbl_list tbody').append(row);
					$('#userdata').show();
				}

			},true
		);
	}
	catch(err)
	{
		$.fn.log_error(arguments.callee.caller,err.message);
	}
};

$.fn.get_appointment_list = function()
{
	try
	{
		var data	=
		{
			emp_id 			: SESSIONS_DATA.emp_id
	 	};

	 	$.fn.fetch_data
		(
			$.fn.generate_parameter('get_appt_dashboard_list', data),
			function(return_data)
			{
				if(return_data)
				{
					$('#tbl_appt_dashboard > tbody').empty();
					let data 	= return_data.data;
					let row		= '';
					for(let i = 0; i < data.length; i++)
					{
						data_val = escape(JSON.stringify(data[i])); //.replace(/'/,"");
						//row += '&nbsp;<a class="tooltips" href="javascript:void(0)" data-value=\'' + data_val + '\' onclick="$.fn.view_file(unescape($(this).attr(\'data-value\')))" data-trigger="hover" data-original-title="View File "><i class="fa fa-picture-o"/></a>';
						
						row += `<tr></td><td>${data[i].name}</td>`;
						
						if(data[i].appt_follow_up > 0)
						{
							data[i].appt_follow_up = `<span class="label label-primary">${data[i].appt_follow_up}</span>`;
						}
						if(data[i].appt_took_place > 0)
						{
							data[i].appt_took_place = `<span class="label label-success">${data[i].appt_took_place}</span>`;
						}
						if(data[i].appt_postponed > 0)
						{
							data[i].appt_postponed = `<span class="label label-warning">${data[i].appt_postponed}</span>`;
						}
						if(data[i].appt_cancelled > 0)
						{
							data[i].appt_cancelled = `<span class="label label-danger">${data[i].appt_cancelled}</span>`;
						}
									
						row +=`<td>${data[i].appt_total}</td>
									<td>${data[i].appt_open}</td>
									<td>${data[i].appt_follow_up}</td>
									<td>${data[i].appt_took_place}</td>
									<td>${data[i].appt_postponed}</td>
									<td>${data[i].appt_cancelled}</td>
								</tr>`;
					}
					$('#tbl_appt_dashboard tbody').append(row);
				}

			},true
		);
	}
	catch(err)
	{
		$.fn.log_error(arguments.callee.caller,err.message);
	}
};

$.fn.get_assets_list = function()
{
	try
	{
	 	$.fn.fetch_data
		(
			$.fn.generate_parameter('get_assets_dashboard_list', {}),
			function(return_data)
			{	
				$.fn.data_table_destroy();
				if(return_data)
				{
					$('#tbl_asset_dashboard > tbody').empty();
					let data 	= return_data.data.list;
					let row		= '';
					for(let i = 0; i < data.length; i++)
					{
						data_val = escape(JSON.stringify(data[i])); //.replace(/'/,"");
						//row += '&nbsp;<a class="tooltips" href="javascript:void(0)" data-value=\'' + data_val + '\' onclick="$.fn.view_file(unescape($(this).attr(\'data-value\')))" data-trigger="hover" data-original-title="View File "><i class="fa fa-picture-o"/></a>';
						
						row += `<tr>
									<td>${data[i].descr}</td>
									<td>${data[i].asset_count}</td>
									<td data-sort="${data[i].asset_val}">RM ${data[i].asset_val}</td>
								</tr>`;

					}
					$('#tbl_asset_dashboard tbody').append(row);
					
					
					$('#tbl_asset_dashboard_detail > tbody').empty();
					let data1 	= return_data.data.detail;
					let row1	= '';
					for(let i = 0; i < data1.length; i++)
					{
						//data_val = escape(JSON.stringify(data1[i])); //.replace(/'/,"");
						//row += '&nbsp;<a class="tooltips" href="javascript:void(0)" data-value=\'' + data_val + '\' onclick="$.fn.view_file(unescape($(this).attr(\'data-value\')))" data-trigger="hover" data-original-title="View File "><i class="fa fa-picture-o"/></a>';
						
						row1 += `<tr>
									<td>${data1[i].assigned_to}</td>
									<td>${data1[i].type_name}</td>
									<td>${data1[i].brand_name}</td>
									<td>${data1[i].client_name != null ? data1[i].client_name : '-'}</td>
									<td>${data1[i].expiry_date != null ? moment(data1[i].expiry_date).format('D-MMM-YYYY') : '-'}</td>
								</tr>`;
					}
					$('#tbl_asset_dashboard_detail tbody').append(row1);
					
				}
				$.fn.data_table_features();
			},true
		);
	}
	catch(err)
	{
		$.fn.log_error(arguments.callee.caller,err.message);
	}
};

$.fn.get_leave_list = function()
{
	try
	{
		let data	=
		{
			emp_id 	: SESSIONS_DATA.emp_id
	 	};

	 	$.fn.fetch_data
		(
			$.fn.generate_parameter('get_leave_dashboard_list', data),
			function(return_data)
			{
				if(return_data)
				{
					$('#tbl_leave_dashboard > tbody').empty();
					let data 	= return_data.data;
					let row		= '';
					for(let i = 0; i < data.length; i++)
					{
						data_val = escape(JSON.stringify(data[i])); //.replace(/'/,"");
						
						row += `<tr>
									<td>${data[i].name}</td>
									<td>${data[i].annual_leave}  BF: ( ${data[i].brought_forward} ) / ${data[i].annual_taken}</td>
									<td>${data[i].med_leave} /  ${data[i].med_taken}</td>
									<td>${data[i].emergency_taken}</td>
									<td>${(parseFloat(data[i].annual_taken) + parseFloat(data[i].emergency_taken))}</td>
									<td>${
											(    ( parseFloat(data[i].annual_leave) + parseFloat(data[i].brought_forward) ) - 
												 ( parseFloat(data[i].annual_taken) + parseFloat(data[i].emergency_taken) )
										     )
										 }</td>
									<td>${data[i].unpaid_taken}</td>
								</tr>`;
					}
					$('#tbl_leave_dashboard tbody').append(row);
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
		/*$('#daterangepicker').daterangepicker
	    (
	        {
	          ranges: 
	          {
	             'Today'		: [moment(), moment()],
	             'Yesterday'	: [moment().subtract('days', 1), moment().subtract('days', 1)],
	             'Last 7 Days'	: [moment().subtract('days', 6), moment()],
	             'Last 30 Days'	: [moment().subtract('days', 29), moment()],
	             'This Month'	: [moment().startOf('month'), moment().endOf('month')],
	             'Last Month'	: [moment().subtract('month', 1).startOf('month'), moment().subtract('month', 1).endOf('month')]
	          },
	          opens		: 'left',
	          startDate	: moment().subtract('days', 29),
	          endDate	: moment()
	        },
	        function(start, end) 
	        {
	            $('#daterangepicker span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
	        }
	    );*/
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
		
		$('#btn_appointment_more').click( function(e)
		{
			e.preventDefault();
			$('#div_asset_details')			.hide();
			$('#div_asset_details_expiry')	.hide();
			$('#div_appointment_details')	.show();
			$.fn.get_appointment_list();
		});
		$('#btn_asset_more').click( function(e)
		{
			e.preventDefault();
			$('#div_appointment_details')	.hide();
			$('#div_asset_details')			.show();
			$('#div_asset_details_expiry')	.show();
			$.fn.get_assets_list();
		});
		
		$('#btn_leave_more').click( function(e)
		{
			e.preventDefault();
			$('#div_appointment_details')	.hide();
			$('#div_asset_details')			.hide();
			$('#div_asset_details_expiry')	.hide();
			$('#div_leave_details')			.show();
			$.fn.get_leave_list();
		});

		$('.close-detail').click(function() 
	    {
	        $(this).parents('.view-detail').fadeOut('slow');
	    });

	 //    $('body').on('click', '.dropdown-menu', function(e)
	 //    {
		//     $(this).parent().is('.open') && e.stopPropagation();
		// });

		$('input[name="appointment_filter[]"]').change(function(event) 
		{
		    if ($(this).attr('id') == 'selectall') 
		    {
		      $('input[type=checkbox]').not(this).prop('checked', this.checked);
		    }

		    if ($(this).attr('id') != 'selectall') 
		    {
		      if (!$(this).is(':checked'))
		      {
		        $('#selectall').prop('checked', false);
		      }
		    }

		    $('#calendar-drag').fullCalendar('destroy');
		    $.fn.get_list();
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

$(document).ready(function()
{	
	$.fn.get_list();
	$.fn.form_load();
});
