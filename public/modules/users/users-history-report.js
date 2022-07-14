var RECORD_INDEX 	= 0;
var btn_search;

$.fn.populate_list = function(data)
{
	try
	{
		if (data)
		{
			var row			= '';
			var data_val 	= '';
			var employee	= 0;
			var count		= 1;

			for(var i = 0; i < data.length; i++)
			{
				data_val = escape(JSON.stringify(data[i]));
                let start_date = moment(data[i].work_start_date, 'DD-MM-YYYY');
                let end_date   = moment(data[i].work_end_date, 'DD-MM-YYYY');
                let join_date  = moment(data[i].join_date);

				row += `<tr>`;
				if(employee	!= data[i].employee_id)
				{
					count = 1;
				row += `<td>${data[i].name}</td>`;
				}
				else
				{
					row += `<td>&nbsp;</td>`;
				}

				row += `<td>${data[i].client_name}</td>;
						<td>${data[i].department}</td>;
						<td>${start_date.format('D-MMM-YYYY')}</td>`;
				if(data[i].work_end_date != null)
				{
					row += `<td>${end_date.format('D-MMM-YYYY')}</td>`;
				}
				else
				{
					row += `<td>-</td>`;
				}
				if(data[i].join_date != null)
				{
					row += `<td>${join_date.format('D-MMM-YYYY')}</td>`;
				}
				else
				{
					row += `<td>-</td>`;
				}
				if(data[i].salary != 0)
				{
					row += `<td>${data[i].salary}</td>`;
				}
				else
				{
					row += `<td>-</td>`;
				}
				row += `</tr>`;

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
$.fn.get_list = function()
{
	try
	{
		var data	=
		{
			employee_id		: $('#dd_employee').val(),
			client_id		: $('#dd_client').val(),
			dept_id			: $('#dd_dept').val(),
			emp_id			: SESSIONS_DATA.emp_id
	 	};

	 	$.fn.fetch_data
		(
			$.fn.generate_parameter('get_employee_report',data),
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
					$.fn.populate_list(return_data.data);
				}
			},true, btn_search
		);
	}
	catch(err)
	{
		$.fn.log_error(arguments.callee.caller,err.message);
	}
};
function get_dept(rowData = false) {
	try {
	  let row = "<option value='ALL'>All</option>";
	  if (rowData) {
		for (var i = 0; i < rowData.length; i++) {
		  let jsval = escape(JSON.stringify(rowData[i]));
		  row += `<option data-val="${jsval}" value=${rowData[i].id}>
							   ${rowData[i].desc}
						   </option>`;
		}
		$("#dd_dept").html(row);
		$("#dd_dept").select2();
	  }
	} catch (err) {
	  // console.log(err.message);
	  $.fn.log_error(arguments.callee.caller,err.message);
	}
  }
function get_outsourced_clients(rowData = false) {
	try {
	  let row = "<option value='ALL'>All</option>";
	  if (rowData) {
		for (var i = 0; i < rowData.length; i++) {
		  let jsval = escape(JSON.stringify(rowData[i]));
		  row += `<option data-val="${jsval}" value=${rowData[i].id}>
							   ${rowData[i].desc}
						   </option>`;
		}
		$("#dd_client").html(row);
		$("#dd_client").select2();
	  }
	} catch (err) {
	  // console.log(err.message);
	  $.fn.log_error(arguments.callee.caller,err.message);
	}
  }
function get_emp(rowData = false) {
	try {
	  let row = "<option value='ALL'>All</option>";
	  if (rowData) {
		for (var i = 0; i < rowData.length; i++) {
		  let jsval = escape(JSON.stringify(rowData[i]));
		  row += `<option data-val="${jsval}" value=${rowData[i].id}>
							   ${rowData[i].desc}
						   </option>`;
		}
		$("#dd_employee").html(row);
		$("#dd_employee").select2();
	  }
	} catch (err) {
	  // console.log(err.message);
	  $.fn.log_error(arguments.callee.caller,err.message);
	}
  }
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
$.fn.bind_command_events = function()
 {	
	 try
	 {
		$('#btn_search').click(function (e)
		{
			e.preventDefault();
			RECORD_INDEX = 0;
			btn_search = Ladda.create(this);
	 		btn_search.start();
            $.fn.get_list();
		});
		$('#showSearchDiv').click(function (e)
		{
			e.preventDefault();
			$("#searchDiv").show();
			$("#showSearchDiv").hide();
		});
		$('#closeSearch').click(function (e)
		{
			e.preventDefault();
			$("#searchDiv").hide();
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
		let params = {
			emp_id:SESSIONS_DATA.emp_id
		}
		let data = [
			{ func: "get_emp", params: params },
			{ func: "get_outsourced_clients", params: params },
			{ func: "get_dept", params: params },
		];
		$.fn.get_everything_at_once_altrawise(data);
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
 
