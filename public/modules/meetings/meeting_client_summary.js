/**
 * @author 		Jamal
 * @date 		27-Mar-2018
 * @modify
 * @Note = Please follow the indentation
 *         Please follow the naming convention
 */

CURRENT_PATH	= '../../';
var G_LADDA     = [];

$.fn.reset = function()
{
    try 
    {
        $('#dd_employee')   .val('').change();
        $('#from_date')     .val('');
        $('#to_date')       .val('');
        $('#dp_date span').html(moment().subtract('days', 29).format('MMMM D, YYYY') + ' - ' + moment().format('MMMM D, YYYY'));
        $('#from_date').val(moment().subtract('days', 29).format('YYYY-MM-DD'));
		$('#to_date').val(moment().format('YYYY-MM-DD'));
		$('#tbody_list').empty();
    } 
    catch (e) 
    {
        $.fn.log_error(arguments.callee.caller, e.message);
    }
};

$.fn.populate_list_form = function(data)
{
	try
	{
        $('#tbody_list').empty();
		if (data.length > 0) // check if there is any data, precaution
		{
			let row			= '';
			for(var i = 0; i < data.length; i++)
			{
				data_val = escape(JSON.stringify(data[i])); //.replace(/'/,"");
				
				row += '<tr>' +
							'<td>' + data[i].emp_name  		+ '</td>' +
							'<td>' + data[i].email 	    	+ '</td>' +
							'<td>' + data[i].meet_count 	+ '</td>' +
							'<td>' + data[i].total_hour 	+ '</td>' +
							'<td width="10%"><a class="tooltips" href="javascript:void(0)" data-value=\'' + data_val + '\' onclick="$.fn.open_details(unescape($(this).attr(\'data-value\')),this)" data-trigger="hover" data-original-title="View File "><i class="fa fa-search fa-fw"/></a>';
				row += '</tr>';
			}
			
			$('#tbody_list').append(row);
		}
	}
	catch(err)
	{
		$.fn.log_error(arguments.callee.caller,err.message);
	}
};

$.fn.open_details = function(param,obj)
{
	try
	{
		if($('#div_more_info_detail').is(':visible'))
    	{
    		$('#div_more_info_detail').hide();
    		$('#div_more_info_detail').closest('tr').remove();
    	}
    	
    	let dt = JSON.parse(param);
    	
    	var data	=
		{
			date_from	: $('#from_date').val(),
			date_to		: $('#to_date').val(),
			email 		: dt.email
	 	};
    	
    	$('#tbody_details').empty();
    	$.fn.fetch_data
		(
			$.fn.generate_parameter('get_appt_summary_details',data),
			function(return_data)
			{
				if(return_data)
				{
					let data_row 	= '';
					let data 		= return_data.data;
					for(var i = 0; i < data.length; i++)
					{	
						data_row += '<tr>' +
								'<td>' + data[i].dates				+ '</td>' +
								'<td>' + data[i].times 	    		+ '</td>' +
								'<td>' + data[i].duration 			+ '</td>' +
								'<td>' + data[i].check_in_time 		+ '</td>' +
								'<td>' + data[i].check_in_address 	+ '</td>' +
								'<td>' + data[i].check_out_time 	+ '</td>' +
								'<td>' + data[i].check_out_address 	+ '</td>' +
							'</tr>';
					}
					
					$('#tbody_details').append(data_row);
					
					let row = '<tr><td colspan=9>' + $('#div_more_info_parent').html() + '</td></tr>';
					$(obj).closest('tr').after($(row));
			    	
			    	$('#div_more_info_detail').slideToggle();
				}
			},true
		);
		
		
	}
	catch(err)
	{
		$.fn.log_error(arguments.callee.caller,err.message);
	}
};

$.fn.get_list = function()
{
	try
	{
		var data	=
		{
			date_from			: $('#from_date').val(),
			date_to				: $('#to_date').val(),
			emp_id				: $('#dd_employee').val()
	 	};

		$.fn.fetch_data
		(
			$.fn.generate_parameter('get_appt_summary_list',data),
			function(return_data)
			{
				if(return_data)
				{
					$.fn.populate_list_form(return_data.data);
				}
			},true, G_LADDA[0]
		);
		
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
        $('#dd_employee').select2();
		
        $('#dp_date').daterangepicker
	    ({
            ranges:
            {
                'This Month'	: [moment().startOf('month'), moment().endOf('month')],
                'Last Month'	: [moment().subtract('month', 1).startOf('month'), moment().subtract('month', 1).endOf('month')]
            },
            locale:
            {
                cancelLabel : "Reset"
            },
            startDate            : moment().subtract('days', 29),
            endDate              : moment(),
            showCustomRangeLabel : false,
            autoUpdateInput      : false,
            opens		         : 'left'
	    },
        function(start, end)
        {
            $('#dp_date span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
            $('#from_date').val(start.format('YYYY-MM-DD'));
			$('#to_date').val(end.format('YYYY-MM-DD'));
	    });

        $('#dp_date span').html(moment().subtract('days', 29).format('MMMM D, YYYY') + ' - ' + moment().format('MMMM D, YYYY'));
        $('#from_date').val(moment().subtract('days', 29).format('YYYY-MM-DD'));
		$('#to_date').val(moment().format('YYYY-MM-DD'));
        G_LADDA[0] = Ladda.create(document.querySelector('#btn_search'));
    } 
    catch (e) 
    {
        $.fn.log_error(arguments.callee.caller, e.message);
    }
};

$.fn.bind_command_events = function ()
{
    try 
    {
        $('#btn_search').on('click', function(e) 
        {
            e.preventDefault();
            G_LADDA[0].start();
            $.fn.get_list();
        });

        $('#btn_reset').on('click', function(e) 
        {
            e.preventDefault();
            $.fn.reset();
        });
        
        $('#btn_pop_close').on('click', function(e) 
        {
            e.preventDefault();
           $('#detail_modal').modal('hide');
        });
    } 
    catch (e) 
    {
        $.fn.log_error(arguments.callee.caller, e.message);
    }
};

$.fn.form_load = function ()
{
    try
    {
        SESSIONS_DATA = JSON.parse($('#session_data').val());
        $.fn.prepare_form();
        $.fn.bind_command_events();
    }
    catch (e)
    {
        $.fn.log_error(arguments.callee.caller, e.message);
    }
};

$(document).ready(function ()
{
    $.fn.form_load();
});
