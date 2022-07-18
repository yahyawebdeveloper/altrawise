
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
		let filter_val = '';
	  	$.each($("input[name='appointment_filter[]']:checked"), function() 
	  	{
	    	filter_val += $(this).val() + ",";
	  	});

	  /* 	let calendar = $('#calendar-drag').fullCalendar
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
		    	data		: $.fn.generate_parameter('get_user_events', '',{filter_val: filter_val,emp_id: SESSIONS_DATA.emp_id, company_id:SESSIONS_DATA.company_id})
		    }],
		    eventClick: function(calEvent, jsEvent, view) 
		    {
		      try 
		      {
		      	if (calEvent.type == 'task') 
			    {
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
			            $.fn.generate_parameter('get_user_event_detail', {id: calEvent.id, type: calEvent.type }),
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
	  	}); */
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

		   // $('#calendar-drag').fullCalendar('destroy');
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
