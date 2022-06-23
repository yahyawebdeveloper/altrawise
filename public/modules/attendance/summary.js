$.fn.get_list = function()
{
	try
	{
		var data	=
		{
			employee_id			: $('#dd_search_employee').val() ? $('#dd_search_employee').val().toString() : '',
			from_date			: $('#from_search_date').val(),
			to_date				: $('#to_search_date').val()
	 	};

	 	$.fn.fetch_data
		(
			$.fn.generate_parameter('get_attendance_summary',data),	
			function(return_data)
			{
				if(return_data)
				{	
					$.fn.data_table_destroy('tbl_list');
					$.fn.populate_list_form(return_data.data);
					$.fn.data_table_features('tbl_list');
				}
			},true
		);
		
	}
	catch(err)
	{
		$.fn.log_error(arguments.callee.caller,err.message);
	}
};

$.fn.populate_list_form = function(data)
{
	try
	{
		if (data.length > 0) // check if there is any data, precaution
		{
			$('#tbl_list > tbody').empty();

			let row			= '';
			let data_val 	= '';
			
			for(var i = 0; i < data.length; i++)
			{	
				row += `<tr>
							<td></td>
							<td class="ename">${data[i].name}</td>
							<td>${data[i].worked_full}</td>
							<td>${data[i].worked_half}</td>
							<td>${data[i].unpaid_leave}</td>
							<td>${data[i].paid_leave}</td>
						</tr>`;
			}
			$('#tbl_list tbody').append(row);
			
		}
	}
	catch(err)
	{
		console.log(err.message);
	}
};
$.fn.reset_search_form = function(form)
{
	try
	{
		$('#dd_search_employee')	.val('').change();
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
				"order"		: []
			});
		}
	}
	catch(err)
	{
		$.fn.log_error(arguments.callee.caller,err.message);
	}
};
$.fn.get_everything_at_once_altrawise = function (data, details = false) {
  try {
    $.fn.fetch_data(
      $.fn.generate_parameter("get_everything_at_once_altrawise", data),
      function (return_data) {
        if (return_data) {
          var allData = return_data.data;
          var allDataArray;
          for (let i = 0; i < allData.length; i++) {
            allDataArray = JSON.parse(allData[i]);
            window[data[i].func](allDataArray.data, details);
          }
        }
      },
      true
    );
  } catch (err) {
    // console.log(err.message);
    $.fn.log_error(arguments.callee.caller,err.message);
  }
};
function get_attendance_tracker_employee(rowData = false) {
	try {
	  let row = "<option value=''>All</option>";
	  if (rowData) {
		for (var i = 0; i < rowData.length; i++) {
		  let jsval = escape(JSON.stringify(rowData[i]));
		  row += `<option data-val="${jsval}" value=${rowData[i].id}>
							   ${rowData[i].desc}
						   </option>`;
		}
		$("#dd_search_employee").html(row);
		$("#dd_search_employee").select2();
	  }
	} catch (err) {
	  // console.log(err.message);
	  $.fn.log_error(arguments.callee.caller,err.message);
	}
  }
$.fn.bind_command_events = function()
 {	
	 try
	 {
		$('#btn_search_reset').click( function(e)
		{
			e.preventDefault();
			$.fn.reset_search_form();
			$.fn.get_list();
		});

		$('#btn_search').click( function(e)
		{
			e.preventDefault();
			$.fn.get_list();
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
		let params = {
			emp_id:SESSIONS_DATA.emp_id
		}
		let data = [
			{ func: "get_attendance_tracker_employee", params: params },
		];
		$.fn.get_everything_at_once_altrawise(data);
		var startdate = moment();
		startdate = startdate.subtract(1, "month");
		$('#from_search_date').val(startdate.format("YYYY-MM-DD"));
		$('#to_search_date').val(moment(new Date()).format("YYYY-MM-DD"));
		$("#doc_search_date").trigger("change");
		$("#doc_search_date").flatpickr({
			mode:"range",
			altFormat: "d-M-Y",
			dateFormat: "d-M-Y",
			defaultDate: [startdate.format("DD-MMM-YYYY"),moment(new Date()).format("DD-MMM-YYYY")],
			onChange:function(selectedDates){
				var _this=this;
				var dateArr=selectedDates.map(function(date){return _this.formatDate(date,'Y-m-d');});
				$('#from_search_date').val(dateArr[0]);
				$('#to_search_date').val(dateArr[1]);
			},
		});
		
		$('#from_date').val('2021-06-17');
		$('#to_date').val('2022-06-17');
		$("#dd_employee").select2();
		$.fn.get_list();
	 }
	 catch(err)
	 {
		 console.log(err);
		 //$.fn.log_error(arguments.callee.caller,err.message);
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
 
