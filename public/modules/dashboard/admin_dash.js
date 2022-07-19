CURRENT_PATH	= '../../';

$.fn.data_table_features = function()
{	
	try
	{	
		if (!$.fn.dataTable.isDataTable('#tbl_asset_dashboard'))
        {
            table = $('#tbl_asset_dashboard').DataTable({
                "searching": false,
                "paging": false,
                "info": false,
                "order": []
            });
        }
		if (!$.fn.dataTable.isDataTable('#tbl_asset_dashboard_detail'))
        {
            table = $('#tbl_asset_dashboard_detail').DataTable({
                "searching": false,
                "paging": false,
                "info": false,
                "order": []
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
		if ($.fn.dataTable.isDataTable('#tbl_asset_dashboard'))
        {
            $('#tbl_asset_dashboard').DataTable().destroy();
        }
		if ($.fn.dataTable.isDataTable('#tbl_asset_dashboard_detail'))
        {
            $('#tbl_asset_dashboard_detail').DataTable().destroy();
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

$.fn.get_list = async function()
{
	try
	{
		//get filter values in variable
	   /*  let filter_val = '';
	    $.each($("input[name='appointment_filter[]']:checked"), function()
	    {
	    	filter_val += $(this).val() + ",";
		}); */
		let company_id = SESSIONS_DATA.company_id;
		let emp_id = SESSIONS_DATA.emp_id;
  
		var datas =
		{
			filter_val: '1,2,3,4',
			emp_id: emp_id,
			company_id:company_id,
			end: '1659810600',
			start: '1656181800'
		};
		let event_value = {};
		$.fn.write_data
		( 
			$.fn.generate_parameter('get_user_events','', datas),
			function (return_data){
				if (return_data.data){
					$.each(return_data.data, function (i, dataa) {
						for(var i = 0, l = return_data.data.length; i < l; i++) {
							event_value['id'] = return_data.data[i].id;
							event_value['title'] = return_data.data[i].title;
							event_value['start'] = return_data.data[i].start;
							event_value['end'] = return_data.data[i].end;
							event_value['type'] = return_data.data[i].type;
							event_value['backgroundColor'] = return_data.data[i].backgroundColor;
						}
					});
				} 
			},false
		);
		$.fn.load_calender_fun(event_value);

		
	}
	catch(err)
	{    console.log(err);
		//$.fn.log_error(arguments.callee.caller,err.message);
	}
};

$.fn.populate_alluser_detail = function(emp_id)
{
	try
	{
	 	$.fn.fetch_data(
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
		let data	=
		{
			emp_id 	: SESSIONS_DATA.emp_id
	 	};
		$.fn.fetch_data(
			$.fn.generate_parameter('get_assets_dashboard_list', data),
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

	 	$.fn.fetch_data(
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
		$('#btn_close_app_details').click(function()
		{
			$('#div_appointment_details').hide();
		});
		$('#btn_close_asset_detail').click(function()
		{
			$('#div_asset_details').hide();
		});
		$('#btn_close_asset_exp_detail').click(function()
		{
			$('#div_asset_details_expiry').hide();
		});
		$('#btn_close_leave_details').click(function()
		{
			$('#div_leave_details').hide();
		});
		$('#btn_close').click(function()
		{
			$('#userdata').hide();
		});
		$('#btn_close_details').click(function()
		{
			$('#demo').hide();
		});

		$('#top_user_data_check_dynamic').click(function()
		{
			let emp_id = SESSIONS_DATA.emp_id;
			$.fn.populate_alluser_detail(emp_id);
		});

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

		    //$('#calendar-drag').fullCalendar('destroy');
			$('#calendar').fullCalendar('destroy');
		    $.fn.get_list();
		});
		
	}
	catch(err)
	{
		$.fn.log_error(arguments.callee.caller,err.message);
	}
};

$.fn.form_load = async function()
{
	try
	{   console.log(1)
	    await $.fn.prepare_form();
		console.log(3)
	    $.fn.bind_command_events();
	}
	catch(err)
	{
		$.fn.log_error(arguments.callee.caller,err.message);
	}
};

$.fn.load_calender_fun = function(event_arr){
	!function(l) {
		"use strict";
		function e() {
			this.$body = l("body"), this.$modal = l("#event-modal"), this.$calendar = l("#calendar"), 
			this.$formEvent = l("#form-event"), this.$btnNewEvent = l("#btn-new-event"), this.$btnDeleteEvent = l("#btn-delete-event"), 
			this.$btnSaveEvent = l("#btn-save-event"), this.$modalTitle = l("#modal-title"), 
			this.$calendarObj = null, this.$selectedEvent = null, this.$newEventData = null;
		}
		e.prototype.onEventClick = function(e) {
			this.$formEvent[0].reset(), this.$formEvent.removeClass("was-validated"), this.$newEventData = null, 
			this.$btnDeleteEvent.show(), this.$modalTitle.text("Edit Event"), this.$modal.show(), 
			this.$selectedEvent = e.event, l("#event-title").val(this.$selectedEvent.title), 
			l("#event-category").val(this.$selectedEvent.classNames[0]);
		}, e.prototype.onSelect = function(e) {
			this.$formEvent[0].reset(), this.$formEvent.removeClass("was-validated"), this.$selectedEvent = null, 
			this.$newEventData = e, this.$btnDeleteEvent.hide(), this.$modalTitle.text("Add New Event"), 
			this.$modal.show(), this.$calendarObj.unselect();
		}, e.prototype.init = function() {
			this.$modal = new bootstrap.Modal(document.getElementById("event-modal"), {
				keyboard: !1
			});
			var e = new Date(l.now());
			new FullCalendar.Draggable(document.getElementById("external-events"), {
				itemSelector: ".external-event",
				eventData: function(e) {
					return {
						title: e.innerText,
						className: l(e).data("class")
					};
				}
			});

			//console.log([event_arr]);
			var t = [event_arr];
			var a = this;
			
			a.$calendarObj = new FullCalendar.Calendar(a.$calendar[0], {
				slotDuration: "00:15:00",
				slotMinTime: "08:00:00",
				slotMaxTime: "19:00:00",
				themeSystem: "bootstrap",
				bootstrapFontAwesome: !1,
				buttonText: {
					today: "Today",
					month: "Month",
					week: "Week",
					day: "Day",
					list: "List",
					prev: "Prev",
					next: "Next"
				},
				initialView: "dayGridMonth",
				contentHeight:"auto",
				handleWindowResize: !0,
				height: l(window).height() - 200,
				headerToolbar: {
					left: "prev,next today",
					center: "title",
					right: "dayGridMonth,timeGridWeek,timeGridDay,listMonth"
				},
				initialEvents: t,
				editable: !0,
				droppable: !0,
				selectable: !0,
				dateClick: function(e) {
					a.onSelect(e);
				},
				eventClick: function(e) {
					a.onEventClick(e);
				}
			}), a.$calendarObj.render(), a.$btnNewEvent.on("click", function(e) {
				a.onSelect({
					date: new Date(),
					allDay: !0
				});
			}), a.$formEvent.on("submit", function(e) {
				e.preventDefault();
				var t = a.$formEvent[0];
				if (t.checkValidity()) {
					if (a.$selectedEvent) a.$selectedEvent.setProp("title", l("#event-title").val()), 
					a.$selectedEvent.setProp("classNames", [ l("#event-category").val() ]); else {
						var n = {
							title: l("#event-title").val(),
							start: a.$newEventData.date,
							allDay: a.$newEventData.allDay,
							className: l("#event-category").val()
						};
						a.$calendarObj.addEvent(n);
					}
					a.$modal.hide();
				} else e.stopPropagation(), t.classList.add("was-validated");
			}), l(a.$btnDeleteEvent.on("click", function(e) {
				a.$selectedEvent && (a.$selectedEvent.remove(), a.$selectedEvent = null, a.$modal.hide());
			}));
		}, l.CalendarApp = new e(), l.CalendarApp.Constructor = e;
	}(window.jQuery), function() {
		"use strict";
		window.jQuery.CalendarApp.init();
	}();
}


$(document).ready(function()
{	
	$.fn.get_list();
	
	$.fn.form_load();
});
