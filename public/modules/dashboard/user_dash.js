
CURRENT_PATH	= '../../';

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

$.fn.populate_user_detail = function(emp_id)
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
									<td class="text-center">${data[i].duration}</td>
								</tr>`;
					}
					row += `<tr class="texthead">
								<td class="fw-bold">Total Duration</td>
	                            <td  class="fw-bold text-center">${data[0]['totalduration']}</td>
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

$.fn.get_list = function()
{
	try
	{
		//get filter values in variable
		/* let filter_val = '';
	  	$.each($("input[name='appointment_filter[]']:checked"), function() 
	  	{
	    	filter_val += $(this).val() + ",";
	  	}); */
		let company_id = SESSIONS_DATA.company_id;

		let emp_id = SESSIONS_DATA.emp_id;
		let myDate = new Date(); 
		let end_date = Math.round(myDate.getTime()/1000.0);
			var datas =
			{
				filter_val: '1,2,3,4',
				emp_id: emp_id,
				company_id:company_id,
				start: '1500550716',
				end:end_date
			};
			console.log(end_date);
			let event_value_arr = [];
			$.fn.write_data
			( 
				$.fn.generate_parameter('get_user_events','', datas),
				function (return_data){
					if (return_data.data){
							for(var i = 0, l = return_data.data.length; i < l; i++) {
								let event_value = {};
								event_value['id'] = return_data.data[i].id;
								event_value['title'] = return_data.data[i].title;
								event_value['start'] = return_data.data[i].start;
								event_value['end'] = return_data.data[i].end;
								event_value['type'] = return_data.data[i].type;
								event_value['backgroundColor'] = return_data.data[i].backgroundColor;
								event_value_arr.push(event_value);
							}
					} 
					$.fn.load_calender_fun(event_value_arr);
				},false
			);
	}
	catch(err)
	{
		$.fn.log_error(arguments.callee.caller,err.message);
	}
};

$.fn.get_data_dashboard = function()
{
    try
    {  
		let lead_access = $.fn.get_accessibility(192); 
		let emp_id = SESSIONS_DATA.emp_id;
        let data    =
        {   
            emp_id   : emp_id,
            view_all : MODULE_ACCESS.viewall,
            lead_access_view_all : lead_access.viewall,
            lead_access_view     : lead_access.view
        };
    
        $.fn.fetch_data
        ( 
            $.fn.generate_parameter('get_data_dashboard', data),
            function(return_data)
            {
                if (return_data.code == 0)
                { 
					$("#app_count_id").text(return_data.data.app_count);
					$("#tasks_count_id").text(return_data.data.tasks_count);
                    $("#contracts_count_id").text(return_data.data.contracts_count);
                    $("#communications_count_id").text(return_data.data.communications_count);
					$("#topusers_id").text(return_data.data.topusers);
					if(return_data.data.mosttopusers){
						let most_top_duration = return_data.data.mosttopusers.duration ? return_data.data.mosttopusers.duration : '0:00';
						if(emp_id == return_data.data.mosttopusers.id)
                        { 
							$("#mosttopusers_id").text("You are the top user"); 
                        }
                        else 
                        { 
							$("#mosttopusers_id").text(most_top_duration+" "+"(Top hours)"); 
                        } 
					}
                   // $("#faq_count_id").text(return_data.data.faq_count);
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
		$.fn.get_data_dashboard();
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
		$('.close-detail').click(function() 
	    {
	        $(this).parents('.view-detail').fadeOut('slow');
	    });

		$('#btn_close').click(function()
		{
			$('#userdata').hide();
		});
		
		$('#top_user_data_check').click(function()
		{
			let emp_id = SESSIONS_DATA.emp_id;
			$.fn.populate_user_detail(emp_id);
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

		   // $('#calendar').fullCalendar('destroy');
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

			var t = event_arr;
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


$(document).ready(function(){
	$.fn.get_list();
	$.fn.form_load();
});

