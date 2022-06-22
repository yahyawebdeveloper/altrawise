var G_LADDA     = [];

$.fn.reset_form = function (form)
{
    try
    {
    	$('#dd_category')   .val('').change();
    	$('#dd_status')   	.val('').change();
    	$('#dd_requestor')  .val('').change();
        $('#from_date')     .val(moment().subtract('days', 29));
        $('#to_date')       .val(moment());
    }
    catch (e)
    {
        $.fn.log_error(arguments.callee.caller, e.message);
    }
}
$.fn.data_table_features = function(table_id)
{
    try
    {
        if (!$.fn.dataTable.isDataTable( '#'+table_id ) )
        {
			console.log("here");
            table = $('#'+table_id).DataTable
            ({
                "searching" : false,
                "paging"    : false,
                "info"      : false,
                "order"     : [[ 0, "asc" ]]
            },
			);
        }
    }
    catch(err)
    {
        $.fn.log_error(arguments.callee.caller,err.message);
    }
};
$.fn.show_close_case_modal = function(param)
{
	try
	{
		let data = JSON.parse(param);
		$('#btn_cc_save')	.remove();
		$('#modal_title')	.html("Please Provide Closing Reason");
		$('#modal_body')	.html(`<textarea id="txt_close_reason" class="form-control" rows="3"></textarea>`);
		$('#modal_footer')	.append(`<button type="button" class="btn btn-primary ladda-button" data-color="green"
											 data-style="expand-right" data-spinner-color="grey" 
											 id="btn_cc_save" onclick="$.fn.close_case(${data.id},this);">Save</button>`);
		$('#modal_desc')	.modal('show');
	}
	catch(err)
	{
		$.fn.log_error(arguments.callee.caller,err.message);
	}
};

$.fn.close_case = function(id,obj)
{
	try
	{
		let data = 
		{
			comm_id 	: id,
			close_reason: $('#txt_close_reason').val(),
			emp_id		: SESSIONS_DATA.emp_id
		};
		
		var btn_cc_save = Ladda.create(obj);
		btn_cc_save.start();
		
		$.fn.write_data
        (
            $.fn.generate_parameter('close_comm_case', data),
            function(return_data)
            {
                if (return_data.data)
                {
                	$('#btn_action_' + id).remove();
                	$('#modal_desc').modal('hide');
                }
            },false,btn_cc_save
        );
		
		
	}
	catch(err)
	{
		$.fn.log_error(arguments.callee.caller,err.message);
	}
};
$.fn.open_details = function(id,obj)
{
	try
	{
		if($('#div_more_info_detail').is(':visible'))
    	{
    		$('#div_more_info_detail').hide();
    		$('#div_more_info_detail').closest('tr').remove();
    	}

    	$('#tbody_details').empty();
    	$.fn.fetch_data
		(
			$.fn.generate_parameter('get_comm_reply_list',{comm_id : id}),
			function(return_data)
			{
				if(return_data)
				{
					let data_row 	= '';
					let data 		= return_data.data;
					let file 		= '';
					let action		= '';
					let btn_descr;
					for(var i = 0; i < data.length; i++)
					{	
						file 		= '';
						if(data[i].filename != '')
						{
		    				file = `<div class="fa fa-file">
		                    			<a href="${data[i].filepath}" target="_blank">${data[i].filename}</a>
		    						</div>`;
						}
						
						btn_descr    = data[i].descr;
			        	if(data[i].descr.length > 30)
			    		{
			        		btn_descr = `${data[i].descr.slice(0,30)} 
			        					 <a href="#" data-value="${data[i].descr}" class="btn btn-xs"
			        					 	onclick="$('#modal_title').html('${data[i].created_by_name} On ${data[i].created_date}'); 
			        					 			 $('#modal_body').html($(this).attr('data-value'));
			        					 			 $('#modal_desc').modal()">....
			        				   	 </a>`;
			    		}
						
						data_row += `<tr>
										<td>${data[i].created_date}</td>
										<td>${data[i].created_by_name}</td>
										<td>${btn_descr}</td>
										<td>${file}</td>
									</tr>`;
					}
					
					$('#tbody_details').append(data_row);
					
					let row = '<tr><td colspan=11>' + $('#div_more_info_parent').html() + '</td></tr>';
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
function get_comm_report_requestor(rowData = false) {
	try {
	  let row = "<option value=''>All</option>";
	  if (rowData) {
		for (var i = 0; i < rowData.length; i++) {
		  let jsval = escape(JSON.stringify(rowData[i]));
		  row += `<option data-val="${jsval}" value=${rowData[i].id}>
							   ${rowData[i].desc}
						   </option>`;
		}
		$("#dd_requestor").html(row);
		$("#dd_requestor").select2();
	  }
	} catch (err) {
	  // console.log(err.message);
	  $.fn.log_error(arguments.callee.caller,err.message);
	}
  }
function get_comm_report_status(rowData = false) {
	try {
		let row = "<option value=''>All</option>";
	  if (rowData) {
		for (var i = 0; i < rowData.length; i++) {
		  let jsval = escape(JSON.stringify(rowData[i]));
		  row += `<option data-val="${jsval}" value=${rowData[i].id}>
							   ${rowData[i].desc}
						   </option>`;
		}
		$("#dd_status").html(row);
		$("#dd_status").select2();
	  }
	} catch (err) {
	  // console.log(err.message);
	  $.fn.log_error(arguments.callee.caller,err.message);
	}
  }

function get_comm_report_categories(rowData = false) {
	try {
		let row = "<option value=''>All</option>";
	  if (rowData) {
		for (var i = 0; i < rowData.length; i++) {
		  let jsval = escape(JSON.stringify(rowData[i]));
		  row += `<option data-val="${jsval}" value=${rowData[i].id}>
							   ${rowData[i].desc}
						   </option>`;
		}
		$("#dd_category").html(row);
		$("#dd_category").select2();
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
$.fn.populate_list = function(data, is_scroll = false)
{
    try 
    {
        if (!is_scroll)
        {
            $('#tbody_list').empty();
        }
        
        let btn_action;
        let btn_descr;
        let row_data;
        let	file;
        for (let row of data)
        {
        	data_val 	= escape(JSON.stringify(row)); //.replace(/'/,"");
        	btn_action		= '';
        	if(row.status_id == 167)
			{
        		btn_action = `<button style="width:100%" id="btn_action_${row.id}" class="btn btn-danger btn-sm" data-value="${data_val}" 
        					  onclick="$.fn.show_close_case_modal(unescape(  $(this).attr('data-value') ))">Close Case</button>`;
			}
        	
        	btn_descr    = decodeURIComponent(row.descr.replace(/%0A/g, '<br/>'));
        	if(row.descr.length > 30)
    		{
        		btn_descr = `${decodeURIComponent(row.descr).slice(0,30)} 
        					 <a href="#" data-value="${decodeURIComponent(row.descr.replace(/%0A/g, '<br/>'))}" class="btn btn-xs"
        					 	onclick="$('#modal_title').html('${row.from_name} - ${row.comm_subject}'); $('#modal_body').html($(this).attr('data-value'));$('#modal_desc').modal()">....
        				   	 </a>`;
    		}
        	
        	
        	file 		= '';
			if(row.filename != '')
			{
				file = `<div class="fa fa-file">
                			<a href="${row.filepath}" target="_blank">${row.filename}</a>
						</div>`;
			}
        	
        	row_data += `
			                <tr>
			                    <td>${row.case_no}</td>
			                    <td class="date">${row.created_date}</td>
			                    <td>${row.category_desc}</td>
			                    <td class="requestor">${row.from_name}</td>
			                    <td>${row.comm_subject}</td>
			                    <td>${btn_descr}</td>
			                    <td>${row.sla}</td>
			                    <td>${row.kpi}</td>
			                    <td>${row.status_desc}</td>
			                    <td>${file}</td>
			                    <td width="10%">
			                    	<button style="width:100%" class="btn btn-success btn-sm" onclick="$.fn.open_details(${row.id},this)">View</button>
			                    	${btn_action}
			                    </td>
			                </tr>
        				`;
        }

        $('#tbody_list').html(row_data);
        $('#list_report').slideDown();
        $('.load-more').show();
    } 
    catch (e) 
    {
        $.fn.log_error(arguments.callee.caller, e.message);
    }
}
 $.fn.fetch_report_list = function(is_scroll)
{
    try 
    {
        let data =
        {
            start_index		: 0,
			limit			: LIST_PAGE_LIMIT,
            emp_id			: SESSIONS_DATA.emp_id,
            date_from       : $('#from_date').val(), //moment().subtract('days', 29),
            date_to         : $('#to_date').val(), //moment(),
            category_id		: $('#dd_category').val(),
            status_id		: $('#dd_status').val(),
            requestor_id	: $('#dd_requestor').val()
        };

        if (is_scroll)
        {
            data.start_index = $('#tbody_list tr').length;
        }

        $.fn.fetch_data
        (
            $.fn.generate_parameter('get_comm_report_list', data),
            function(return_data)
            {
            	G_LADDA[0].stop();
                if (return_data.code == 0)
                {
                    $.fn.populate_list(return_data.data.list, is_scroll);
                }
                else if (return_data.code == 1 && !is_scroll)
                {
                    $('.load-more').hide();
                    $('#tbody_list').empty().append
                    (`
                        <tr>
                            <td colspan="7">
                                <div class="list-placeholder">No records found!</div>
                            </td>
                        </tr>
                    `);
                }
                else if (return_data.code == 1 && is_scroll)
                {
                    $('.load-more').hide();
                    $.pnotify
                    ({
                        title   : 'End of records',
                        type    : 'error',
                        text    : 'No more records to be loaded'
                    });
                }
            }, false, '', true, true
        );
    } catch (e) {
        $.fn.log_error(arguments.callee.caller, e.message);
    }
}
 $.fn.bind_command_events = function()
 {	
	 try
	 {
		$('#btn_search').on('click', function(e) 
        {
            e.preventDefault();
            G_LADDA[0].start();
            $.fn.fetch_report_list();
        });

        $('#btn_reset').on('click', function(e) 
        {
            e.preventDefault();
            $.fn.reset_form();
        });

        $('#btn_load_more').on('click', function(e) 
        {
            e.preventDefault();
            $.fn.fetch_report_list(true);
        });
		$("#closeSearch").click(function(e){
			e.preventDefault();
			$("#searchDiv").hide();
			$("#showSearchDiv").show();
		});
		$("#showSearchDiv").click(function(e){
			e.preventDefault();
			$("#searchDiv").show();
			$("#showSearchDiv").hide();
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
			{ func: "get_comm_report_categories", params: params },
			{ func: "get_comm_report_status", params: params },
			{ func: "get_comm_report_requestor", params: params }
		];
		$.fn.get_everything_at_once_altrawise(data);
		var startdate = moment();
		startdate = startdate.subtract(1, "years");
		$('#from_date').val(startdate.format("YYYY-MM-DD"));
		$('#to_date').val(moment(new Date()).format("YYYY-MM-DD"));
		$("#doc_search_date").trigger("change");
		$("#doc_search_date").flatpickr({
			mode:"range",
			altFormat: "d-M-Y",
			dateFormat: "d-m-Y",
			defaultDate: [startdate.format("DD-MM-YYYY"),moment(new Date()).format("DD-MM-YYYY")],
			onChange:function(selectedDates){
				var _this=this;
				var dateArr=selectedDates.map(function(date){return _this.formatDate(date,'Y-m-d');});
				$('#from_date').val(dateArr[0]);
				$('#to_date').val(dateArr[1]);
			},
		});
		
		$('#from_date').val('2021-06-17');
		$('#to_date').val('2022-06-17');
		G_LADDA[0] = Ladda.create(document.querySelector('#btn_search'));
		$.fn.fetch_report_list();
		$.fn.data_table_features('tbl_list');
		$("#btn_search").removeClass("ladda-button");
		$("#showSearchDiv").hide();
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
 
