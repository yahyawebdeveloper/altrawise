var RECORD_INDEX 	= 0;
var LIST_PAGE_LIMIT = 1000;
var btn_search;
CURRENT_PATH	= '../../';

$.fn.data_table_features = function()
{
	try
	{
		if (!$.fn.dataTable.isDataTable( '#tbl_list' ) )
		{
			table = $('#tbl_list').DataTable
			({
				"searching"	: false,
				"paging"	: false,
				"info"		: false,
				"order"		: [[ 1, "desc" ]]
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
		if ($.fn.dataTable.isDataTable('#tbl_list') )
		{
			$('#tbl_list').DataTable().destroy();
		}
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
			employee_id		: $('#dd_employee').val(),
			type_id			: $('#dd_leave_type').val(),
			from_date		: $('#from_date').val(),
			to_date			: $('#to_date').val(),
			paid			: $('#chk_is_paid').is(':checked') 	? 1 : 0,
			unpaid			: $('#chk_is_unpaid').is(':checked') 	? 1 : 0,
			emp_id			: SESSIONS_DATA.emp_id,
			module_id       : "133"
	 	};
       
	 	$.fn.fetch_data
		(
			$.fn.generate_parameter('get_leave_report',data),
			function(return_data)
			{
				if(return_data)
				{
					$('#tbl_list > tbody').empty();
					if(return_data.code == 0)
					{
						$('#div_report_view').show();
					}
					else
					{
						$('#div_report_view').hide();
					}
					$.fn.pouplate_list(return_data.data);
				}
			},true, btn_search
		);
		
	}
	catch(err)
	{
		$.fn.log_error(arguments.callee.caller,err.message);
	}
};

$.fn.pouplate_list = function(data)
{ 
	try
	{
		if (data)
		{
			var row			= '';
			var data_val 	= '';
			var employee	= 0;
			var count		= 1;
			var current_date = new Date();

			for(var i = 0; i < data.length; i++)
			{
                let date =  moment(data[i].leave_date);
				//moment(data[i].leave_date, 'DD-MM-YYYY');

				data_val = escape(JSON.stringify(data[i]));
				
				var day_info = '';
				if(data[i].leave_no_of_days == 0.5)
				{
					day_info = '<br /><b>(1/2 day)</b>';
					if(data[i].type_id == 55)
					{
						day_info += '<b> (EL)</b>';
					}
				}
				else
				{
					day_info = '';
					if(data[i].type_id == 55)
					{
						day_info = '<br /><b>(EL)</b>';
					}
				}

				row += `<tr style="display:none" class="${data[i].employee_id}">`;
				if(employee	!= data[i].employee_id)
				{
					count = 1;
					row += '<td>' + data[i].name	+ '</td>';
				}
				else
				{
					row += '<td></td>';
				}
				if(data[i].paid != 0)
				{
					if(data[i].type_id != 48)
					{
						row += '<td class="text-center">' + date.format('D-MMM-YYYY') + '' + day_info	+ '<br/>PAID</td>';// date.format(UI_DATE_FORMAT)
						row += '<td>&nbsp;</td>';
						row += '<td>&nbsp;</td>';
					}
					else
					{
						row += '<td>&nbsp;</td>';
						row += '<td class="text-center">' + date.format('D-MMM-YYYY') + '' + day_info	+ '</td>';// date.format(UI_DATE_FORMAT)
						row += '<td>&nbsp;</td>';
					}
				}
				else
				{
					row += '<td>&nbsp;</td>';
					row += '<td>&nbsp;</td>';
					row += '<td class="text-center">' + date.format('D-MMM-YYYY') + '' + day_info	+ '<br/>UNPAID</td>';// date.format(UI_DATE_FORMAT)
				}
				row += '<td>&nbsp;</td>';
				row += '<td>&nbsp;</td>';
				row += '<td>&nbsp;</td>';
				row += '</tr>';
				
				if(count == data[i].day_count)
				{
					row += `<tr onclick="$('.${data[i].employee_id}').show()" style="cursor: pointer">`;
					row += `<td class="text-left" ><b>${data[i].name}</b></td>`; //- ${current_date.getFullYear()}
					row += '<td class="text-center">Entitle: ' + parseFloat(data[i].annual_leave_entitle).toFixed(1) + ' B/F: ' + data[i].brought_forward +  '</td>';
					row += '<td class="text-center">AL Taken: ' + parseFloat(data[i].annual_leave_taken).toFixed(1)	+ '</td>';
					row += '<td class="text-center">AL Balance: ' + ((parseFloat(data[i].annual_leave_entitle)+parseFloat(data[i].brought_forward))-parseFloat(data[i].annual_leave_taken)).toFixed(1)	+ '</td>';
					row += '<td class="text-center">MC Taken: ' + parseFloat(data[i].medical_leave_taken).toFixed(1)	+ '</td>';
					row += '<td class="text-center">MC Balance: ' + (parseFloat(data[i].medical_leave_entitle)-parseFloat(data[i].medical_leave_taken)).toFixed(1)	+ '</td>';
					row += '<td class="text-center">Unpaid Taken: ' + parseFloat(data[i].unpaid_leave_taken).toFixed(1)	+ '</td>';
					row += '</tr>';

					if(data.length != (i+1))
					{
//						row += '<tr>';
//						row += '<td>&nbsp;</td>';
//						row += '<td>&nbsp;</td>';
//						row += '<td>&nbsp;</td>';
//						row += '<td>&nbsp;</td>';
//						row += '<td>&nbsp;</td>';
//						row += '<td>&nbsp;</td>';
//						row += '<td>&nbsp;</td>';
//						row += '</tr>';
//
//						row += '<tr>';
//						row += '<th>Name</th>';
//						row += '<th>AL Date</th>';
//                        row += '<th>MC Date</th>';
//                        row += '<th>Unpaid Date</th>';
//                        row += '<th></th>';
//                        row += '<th></th>';
//                        row += '<th></th>';
//						row += '</tr>';
					}
				}

				employee = data[i].employee_id;
				count++;

			}
			$('#tbl_list tbody').append(row);
		}
	}
	catch(err)
	{
		$.fn.log_error(arguments.callee.caller,err.message);
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
       console.log(data);
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
		$('#dd_employee').append(`<option value="ALL">ALL</option>`);
		 for (let item of dd_data.emp)
        {
            $('#dd_employee').append(`<option 
                                                 data-type="expenses" 
                                                 value="${item.id}">${item.name}
                                                 </option>`
                                               );
        }
		$('#dd_leave_type').empty();
		$('#dd_leave_type').append(`<option value="ALL">ALL</option>`);
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





$.fn.prepare_form = function()
{
	try
	{
		$('.populate').select2();
		$('#search_form').parsley
		({
        	successClass	: 'has-success',
        	errorClass		: 'has-error',
        	errors			:
        	{
            	classHandler: function(el)
            	{
                	return $(el).closest('.form-group');
            	},
            	errorsWrapper	: '<ul class=\"help-block list-unstyled\"></ul>',
            	errorElem		: '<li></li>'
        	}
    	});

		$('#leave_date span').html(moment().startOf('year').format('MMMM D, YYYY') + ' - ' + moment().endOf('year').format('MMMM D, YYYY'));
		$('#from_date').val(moment().startOf('year').format('DD-MM-YYYY'));
		$('#to_date').val(moment().endOf('year').format('DD-MM-YYYY'));

	/*	$('#leave_date').daterangepicker
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
	          startDate	: moment().startOf('year'),
	          endDate	: moment().endOf('year')
	        },
	        function(start, end)
	        {
				RECORD_INDEX = 0;
	            $('#leave_date span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
	            $('#from_date').val(start.format('YYYY-MM-DD'));
				$('#to_date').val(end.format('YYYY-MM-DD'));
				//$.fn.get_list(false);
	        }
	    );*/
		$.fn.get_leave_approval_dropdown_data();
		

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
	    //SESSIONS_DATA = JSON.parse($('#session_data').val());
	    $.fn.prepare_form();
	    $.fn.bind_command_events();
	}
	catch(err)
	{
		$.fn.log_error(arguments.callee.caller,err.message);
	}
};

$.fn.reset_form = function (form)
{
	try
	{
		if (form == 'form')
		{
			$('#dd_employee').val('All').change();
			$('#dd_leave_type').val('All').change();
		
		}
		
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
		$('#btn_reset').click(function (e)
		{
			e.preventDefault();
			RECORD_INDEX = 0;
			$.fn.reset_form('form');
			$.fn.get_list(false);
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
    catch(err)
    {
        $.fn.log_error(arguments.callee.caller,err.message);
    }
};


$(document).ready(function()
{
	$.fn.form_load();
});
