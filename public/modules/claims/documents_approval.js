CURRENT_PATH = '../../';
var btn_process;

$.fn.reset_summary = function()
{
    try
    {   
        $('#table_claim_details_report').empty();
        $('#total_s_summary').html('0.00');
        $('#total_z_summary').html('0.00');
        $('#total_total_summary').html('0.00');
    }
    catch(err)
    {
        $.fn.log_error(arguments.callee.caller,err.message);
    }
};

$.fn.display_claim_details = function (data,chat_id,chat_name)
{
    try 
    {
        let total_cost    = 0;
        let total_gst     = 0;
        let total_roundup = 0;
        let total_total   = 0;
        let total_s       = 0;
        let total_z       = 0;
        let tbody         = $('#table_claim_details');

        tbody.empty();
        for (let row of data)
        {
            let date = moment(row.doc_date)
            
            let btn_attachment = '';
			if(row.attachment.length > 0)
			{   
                for(var j = 0; j < row.attachment.length; j++)
                {
				    let func 		= `$.fn.open_page('${row.attachment[j].id}','${CURRENT_PATH}download.php')`;
				    btn_attachment += `<a href="javascript:void(0)" class="link-view-file btn btn-outline-info btn-xs waves-effect waves-light" onclick="${func}"><i class="fas fa-image"/></a>`;
			    }
            }
            
            tbody.append
            (`
                <tr id="${row.doc_no}" chat_id="${chat_id}" chat_name="${chat_name}" remarks="${row.remarks}">
                
                    <td>${btn_attachment}</td>
                    <td class="cell-shrink text-right">${date.format('D-MMM-YYYY')}</td>
                    <td>${row.remarks}</td>
                    <td>${row.noe}</td>
                    <td class="cell-shrink text-right">${Number(row.cost).toFixed(2)}</td>
                    <td class="cell-shrink text-right">${Number(row.gst).toFixed(2)}</td>
                    <td class="cell-shrink text-right">${Number(row.roundup).toFixed(2)}</td>
                    <td class="cell-shrink text-right">${Number(row.total).toFixed(2)}</td>
                    <td><input name="${row.doc_no}" type="radio" value="1" checked></td>
                    <td><input name="${row.doc_no}" type="radio" value="0"></td>
                </tr>
            `);

            total_cost    += Number(row.cost);
            total_gst     += Number(row.gst);
            total_roundup += Number(row.roundup);
            total_total   += Number(row.total);
            if (row.gst == 0 || row.gst == '') { total_z += Number(row.total); }
            else { total_s += Number(row.total); }
        }

        $('.btn_view_file').unbind().on('click', function(event) 
        {
            event.preventDefault();
            let path = $(this).data('path');
            $.fn.view_file(path);
        });

        // Appending lower section of the table
        tbody.append
        (`
            <tr style="background-color: #f7f8fa;">
                <td colspan="4" class="text-right">Total Expenses</td>
                <td class="text-right" style="border-top: double #e6e7e8;">${total_cost.toFixed(2)}</td>
                <td class="text-right" style="border-top: double #e6e7e8;">${total_gst.toFixed(2)}</td>
                <td class="text-right" style="border-top: double #e6e7e8;">${total_roundup.toFixed(2)}</td>
                <td class="text-right" style="border-top: double #e6e7e8;">${total_total.toFixed(2)}</td>
                <td class="text-right" style="border-top: double #e6e7e8;"></td>
                <td class="text-right" style="border-top: double #e6e7e8;"></td>
            </tr>
            <tr style="background-color: #f7f8fa;">
                <td colspan="4" class="text-right">Less: Advance (if any)</td>
                <td class="text-right" ></td>
                <td class="text-right" ></td>
                <td class="text-right" ></td>
                <td class="text-right" ></td>
                <td class="text-right" ></td>
                <td class="text-right" ></td>
            </tr>
            <tr style="background-color: #f7f8fa;">
                <td colspan="4" class="text-right">Less: Refund to Company</td>
                <td class="text-right" ></td>
                <td class="text-right" ></td>
                <td class="text-right" ></td>
                <td class="text-right" ></td>
                <td class="text-right" ></td>
                <td class="text-right" ></td>
            </tr>
            <tr style="background-color: #f7f8fa;">
                <td colspan="4" class="text-right">Balance Due</td>
                <td class="text-right" ></td>
                <td class="text-right" ></td>
                <td class="text-right" ></td>
                <td class="text-right" ></td>
                <td class="text-right" ></td>
                <td class="text-right" ></td>
            </tr>
        `);

        $('#total_s').html(total_s.toFixed(2));
        $('#total_z').html(total_z.toFixed(2));
        $('#total_total').html(total_total.toFixed(2));
    } 
    catch (e) 
    {
        $.fn.log_error(arguments.callee.caller, e.message);
    }
};

$.fn.view_file = function (path)
{
    try 
    {
        if (!path)
        {
            $.fn.show_right_error_noty('Document path cannot be empty');
			return;
        }

        window.open(path);
    } 
    catch (e) 
    {
        $.fn.log_error(arguments.callee.caller, e.message);
    }
};

$.fn.get_claim_details = function (emp_id,chat_id,chat_name)
{
    try 
    {
        let datemonth = moment($('#dp_month').val(), 'MMM-YYYY');
        let data =
        {
            year  	: datemonth.format('YYYY'),
            month 	: datemonth.format('M'),
            emp_id  : emp_id,
            type    : 0
        }

        $.fn.fetch_data
        (
            $.fn.generate_parameter('get_claim_details', data),
            function(return_data)
            {
                if (return_data.code == 0)
                {
                    $.fn.display_claim_details(return_data.data,chat_id,chat_name);
                    $('#view-list,#search-list').hide(200);
                    $('#div_claim_print').hide(200);
                    $('#view-details').show(200);
                }
            },
            false, '', false, true
        );
    } 
    catch (e) 
    {
        $.fn.log_error(arguments.callee.caller, e.message);
    }
};


$.fn.get_claim_details_summary = function ()
{
    try 
    {   
        let datemonth = moment($('#dp_month').val(), 'MMM-YYYY');
        let data =
        {
            year  	: datemonth.format('YYYY'),
            month 	: datemonth.format('M'),
            type  	: 1
        }

        $.fn.fetch_data
        (
            $.fn.generate_parameter('get_claim_details', data),
            function(return_data)
            {
                if (return_data.code == 0)
                {
                	$.fn.display_claim_details_summary(return_data.data);
                }
            },
            false, '', false, true
        );
    } 
    catch (e) 
    {
        $.fn.log_error(arguments.callee.caller, e.message);
    }
};

$.fn.display_claim_details_summary = function (data)
{
    try 
    {   
        let total_cost    = 0;
        let total_gst     = 0;
        let total_roundup = 0;
        let total_total   = 0;

        let total_cost_ap    = 0;
        let total_gst_ap     = 0;
        let total_roundup_ap = 0;
        let total_total_ap   = 0;

        let total_s       = 0;
        let total_z       = 0;
        let tbody         = $('#table_claim_details_report');

        tbody.empty();

        for (let row of data)
        {   
            let date 	= moment(row.doc_date)
            let status 	= ''; 
            
            if(row.rejected == 1)
            {
            	status = `<i class="fa fa-times-circle text-danger"></i>`;
            }
            else if(row.approved == 1)
            {
            	status = `<i class="fa fa-check-circle text-success"></i>`;
            }
            else
        	{
            	status = `<i class="fa fa-ban text-warning"></i>`;
        	}
            
           
			let btn_attachment = '';
			if(row.attachment.length > 0)
			{   
                for(var j = 0; j < row.attachment.length; j++)
                {
				    let func 		= `$.fn.open_page('${row.attachment[j].id}','${CURRENT_PATH}download.php')`;
				    btn_attachment += `<a href="javascript:void(0)" class="link-view-file" onclick="${func}"><i class="fa fa-picture-o"/></a>`;
			    }
            }
            
            
            tbody.append
            (`
                <tr id="${row.doc_no}">
                
                    <td>${btn_attachment}</td>
                    <td class="cell-shrink text-right">${date.format('D-MMM-YYYY')}</td>
                    <td>${row.name}</td>
                    <td>${row.remarks}</td>
                    <td>${row.noe}</td>
                    <td class="cell-shrink text-right">${Number(row.cost).toFixed(2)}</td>
                    <td class="cell-shrink text-right">${Number(row.gst).toFixed(2)}</td>
                    <td class="cell-shrink text-right">${Number(row.roundup).toFixed(2)}</td>
                    <td class="cell-shrink text-right">${Number(row.total).toFixed(2)}</td>
                    <td style="text-align:center">${status}</td>
                </tr>
            `);

            total_cost    += Number(row.cost);
            total_gst     += Number(row.gst);
            total_roundup += Number(row.roundup);
            total_total   += Number(row.total);

            if(row.approved == 1)
            {
                total_cost_ap    += Number(row.cost);
                total_gst_ap     += Number(row.gst);
                total_roundup_ap += Number(row.roundup);
                total_total_ap   += Number(row.total);
            }

            if (row.gst == 0 || row.gst == '') { total_z += Number(row.total); }
            else { total_s += Number(row.total); }
        }
        
        $('.btn_view_file').unbind().on('click', function(event) 
        {
            event.preventDefault();
            let path = $(this).data('path');
            $.fn.view_file(path);
        });

        // Appending lower section of the table
        tbody.append
        (`
            <tr style="background-color: #f7f8fa;">
                <td colspan="5" class="text-right">Total Expenses</td>
                <td class="text-right" style="border-top: double #e6e7e8;">${total_cost.toFixed(2)}</td>
                <td class="text-right" style="border-top: double #e6e7e8;">${total_gst.toFixed(2)}</td>
                <td class="text-right" style="border-top: double #e6e7e8;">${total_roundup.toFixed(2)}</td>
                <td class="text-right" style="border-top: double #e6e7e8;">${total_total.toFixed(2)}</td>
                <td class="text-right" style="border-top: double #e6e7e8;"></td>
            </tr>
            <tr style="background-color: #f7f8fa;">
                <td colspan="5" class="text-right">Total Approved</td>
                <td class="text-right" style="border-top: double #e6e7e8;">${total_cost_ap.toFixed(2)}</td>
                <td class="text-right" style="border-top: double #e6e7e8;">${total_gst_ap.toFixed(2)}</td>
                <td class="text-right" style="border-top: double #e6e7e8;">${total_roundup_ap.toFixed(2)}</td>
                <td class="text-right" style="border-top: double #e6e7e8;">${total_total_ap.toFixed(2)}</td>
                <td class="text-right" style="border-top: double #e6e7e8;"></td>
            </tr>
            <tr style="background-color: #f7f8fa;">
                <td colspan="5" class="text-right">Less: Advance (if any)</td>
                <td class="text-right" ></td>
                <td class="text-right" ></td>
                <td class="text-right" ></td>
                <td class="text-right" ></td>
                <td class="text-right" ></td>
            </tr>
            <tr style="background-color: #f7f8fa;">
                <td colspan="5" class="text-right">Less: Refund to Company</td>
                <td class="text-right" ></td>
                <td class="text-right" ></td>
                <td class="text-right" ></td>
                <td class="text-right" ></td>
                <td class="text-right" ></td>
            </tr>
            <tr style="background-color: #f7f8fa;">
                <td colspan="5" class="text-right">Balance Due</td>
                <td class="text-right" ></td>
                <td class="text-right" ></td>
                <td class="text-right" ></td>
                <td class="text-right" ></td>
                <td class="text-right" ></td>
            </tr>
        `);

        $('#total_s_summary').html(total_s.toFixed(2));
        $('#total_z_summary').html(total_z.toFixed(2));
        $('#total_total_summary').html(total_total.toFixed(2));
    } 
    catch (e) 
    {
        $.fn.log_error(arguments.callee.caller, e.message);
    }
};


$.fn.save_claim = function ()
{
    try 
    {
    	let data_row 	= [];
    	let chat_id		= '';
    	let chat_name   = '';
    	let chat_array	= [];
    	$('#table_claim_details > tr').each(function() 
    	{
    		if(this.id)
    		{
    			chat_id 	= $(this).attr('chat_id');
    			chat_name 	= $(this).attr('chat_name');
			    let value 	= $('input[name=' + this.id + ']:checked').val();
			    data_row.push({"doc_no" :  this.id, 'value' : value, 'remarks' : $(this).attr('remarks')});
		    }
		});
   
    	chat_array.push({id : chat_id,name : chat_name});
   		let data = 
   		{
   			row 		: data_row,
   			emp_id		: SESSIONS_DATA.emp_id,
   			emp_name 	: SESSIONS_DATA.name,
   			to_chat_ids : chat_array
   		};

   		
        $.fn.write_data
        (
            $.fn.generate_parameter('verify_claim', data),
            function(return_data)
            {
                if (return_data.code == 0)
                {
                    $('#view-list,#search-list').show(200);
                    $('#view-details').hide(200);
                    $.fn.get_claim_list();
                }
            },false,btn_process
        );
    } 
    catch (e) 
    {
        $.fn.log_error(arguments.callee.caller, e.message);
    }
};

$.fn.get_claim_list = function()
{
    try 
    {
        let datemonth = moment($('#dp_month').val(), 'MMM-YYYY');
        let data =
        {
            year  : datemonth.format('YYYY'),
            month : datemonth.format('M'),
            emp_id: $("#dd_employee").val(),
            type  : 0
        }
        $.blockUI({ message: "<div class='circle'/><div class='circle1'/>  Just a moment...", css: BLOCKUI_CSS });
        $.fn.fetch_data
        (
            $.fn.generate_parameter('get_claim_list', data),
            function(return_data)
            {
                //$('#title_month_year').html(datemonth.format('MMMM YYYY'));
                if (return_data.code == 0)
                {
                    $('#table_claim_list').empty();
                    for (let data of return_data.data)
                    {   
                        $('#table_claim_list').append
                        (`
                            <tr>
                                <td width="10%"><button type="button" class="btn btn-outline-primary btn-xs waves-effect waves-light btn_view_details" chat_id="${data.chat_id}" chat_name="${data.name}" data-value="${data.id}">View</button></td>
                                <td>${data.name}</td>
                                <td width="15%">${Number(data.total).toFixed(2)}</td>
                            </tr>
                        `);
                    }

                    $('.btn_view_details').unbind().on('click', function(event) 
                    {
                        event.preventDefault();
                        let id 			= $(this).data('value');
                        let chat_id		= $(this).attr('chat_id');
                        let chat_name	= $(this).attr('chat_name');
                        $.fn.get_claim_details(id,chat_id,chat_name);
                    });
                   
                }
                else
                {
                    $('#table_claim_list').empty().append
                    (`
                        <tr>
                            <td colspan="3">
                                <div class="list-placeholder">No record found for this month</div>
                            </td>
                        </tr>
                    `);
                }
            }
        );
        $.unblockUI();
    } 
    catch (e)
    {
        $.fn.log_error(arguments.callee.caller, e.message);
    }
};

$.fn.get_emp_list = function()
{
    try 
    {
        let data =
        {
            is_sup : false
        }

        $.fn.fetch_data
        (
            $.fn.generate_parameter('get_timesheet_emp', data),
            function(return_data)
            {
                if (return_data.code == 0)
                {
                    $('#dd_employee').empty().append(`<option value="">All</option>`);
                    for (let item of return_data.data)
                    {
                        $('#dd_employee').append(`<option value="${item.id}">${item.name}</option>`);
                    }
                    $('#dd_employee').val('').change();
                }
            },
            false,'',false,true
        );
    } 
    catch (e) 
    {
        $.fn.log_error(arguments.callee.caller, e.message);
    }
};

$.fn.prepare_form = function ()
{
    try 
    {
        $('#dp_month').datepicker
        ({
            format: "M-yyyy",
            startView: 2,
            minViewMode: 1,
            autoclose: true
        }).val(moment().format('MMM-YYYY'));

        $('#dd_employee').select2();
        $.fn.get_emp_list();
        $.fn.get_claim_list();
        
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
        $('#btn_back_1,#btn_back_2').on('click', function(e) 
        {
            e.preventDefault();
            $('#view-details').hide(200);
            $('#btn_search').hide();
            $('#div_claim_print').hide(200);
            $('#view-list,#search-list').show(200);
            $.fn.reset_summary();
        });

        $('#btn_search').click(function()
		{
			$('#search-list').show();
			$('#btn_search').hide();
		});

		$('#btn_close_search').click(function()
		{
			$('#search-list').hide();
			$('#btn_search').show();
		});

        $('#btn_search_action').click(function (e)
        {
            e.preventDefault();
            $.fn.get_claim_list();
        });

       /*  $('#btn_search').on('click', function(e) 
        {
            e.preventDefault();
            $.fn.get_claim_list();
        });
        $('#btn_search_action').click(function (e)
        {
            e.preventDefault();
            RECORD_INDEX = 0;
            $.fn.get_list(false);
        }); */
        
        $('#btn_summary').on('click', function(e) 
        {
            e.preventDefault();
            $('#view-details').hide(200);
            $('#view-list,#search-list').hide(200);
            $('#div_claim_print').show(200);
            $.fn.get_claim_details_summary();
        });
        
        
        $('#btn_approve_claim').on('click', function(e) 
        {
            e.preventDefault();
            btn_process = Ladda.create(this);
            btn_process.start();
            $.fn.save_claim();
        });

        $('#btn_reset').on('click', function(e) 
        {
        	e.preventDefault();
            $('#dp_month').val(moment().format('MMM-YYYY'));
            $('#dd_employee').val('').change();
            $.fn.get_claim_list();
        });


        $('#btn_load_more').click(function (e)
		{
			e.preventDefault();
			$.fn.get_claim_list();
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
