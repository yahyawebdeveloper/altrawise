$.fn.data_table_features = function()
{
    try
    {
        if (!$.fn.dataTable.isDataTable( '#tbl_list' ) )
        {
            table = $('#tbl_list').DataTable
            ({
                "searching" : false,
                "paging"    : false,
                "info"      : false,
                "order"     : [[ 1, "asc" ]]
            });
        }
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
        $('#tbl_list > tbody').empty();
        $('#total_records').html(data.length);

        if (data.length > 0)
        {
            let row         = '';
            let data_val    = '';
            
            let replies		= '';
            let btn			= '';

            for(let i = 0; i < data.length; i++)
            {
            	data_val 	= escape(JSON.stringify(data[i]));
                let reject_row      = '';
                let approval_row    = '';
                let multiple_approve    = '';

                if(MODULE_ACCESS.approve == 1)
                {
                    approval_row = `<br><button class="btn-success btn mb-1" onclick="$.fn.approve_client_details(${data[i].id}, $(this).closest(\'tr\').prop(\'id\') )" name="btn_approve">Approve</button>`;
                    reject_row = `<br><button class="btn-danger btn mb-1" onclick="$.fn.deactivate_form(unescape( $(this).closest('tr').attr('data-value')),$(this).closest(\'tr\').prop(\'id\') )" name="btn_reject">Reject</button>`;

                    multiple_approve = `<label><input type="checkbox" name="chk_approve_reject[]" class="chk_approve_reject form-check-input midsize-checkbox m-0" value="${data[i].id}" data_id="${data[i].id}"></label>`;
                }
                
                row += `<tr id="TR_ROW_${i}" data-value=${data_val}>
                            <td>
                                ${multiple_approve}
                            </td>
                            <td>${data[i].type}</td>
                            <td>${data[i].name}</td>
                            <td style="color: red;">${data[i].identical_names.split(",").join("<br />")}</td>
                            <td>${data[i].client_status_value}</td> 
                            <td>${data[i].offering_value}</td>
                            <td>${data[i].created_by}</td>
                            <td>${data[i].created_date}</td>
                            <td style="text-align:center;">
                            	<a class="action-icon" href="javascript:void(0)" data-value=${data_val} onclick="$.fn.populate_detail_form(unescape($(this).attr('data-value')))" data-trigger="hover" data-original-title="Edit data "><i class="mdi mdi-square-edit-outline"/></i></a>
                                ${approval_row}
                                ${reject_row}
                            </td>
                        </tr>`;
            }
            $('#tbl_list tbody').append(row);
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
$.fn.get_client_approvals = function()
{
    try
    {
        let data    =
        {
            created_by      : $('#dd_search_created_by').val(),
            type_id         : $('#dd_search_type').val(),
            view_all        : MODULE_ACCESS.viewall,
            emp_id          : SESSIONS_DATA.emp_id
        };

        $.fn.fetch_data
        (
            $.fn.generate_parameter('get_client_approvals',data),
            function(return_data)
            {
                if(return_data)
                {   
                    if(return_data.data)
                    {
                        $.fn.data_table_destroy();
                        $.fn.populate_list_form(return_data.data);
                        $.fn.data_table_features();
                    }
                }
            },true
        );
    }
    catch(err)
    {
        $.fn.log_error(arguments.callee.caller,err.message);
    }
};
$.fn.show_hide_form = function(form_status,reset_form)
{
    if(form_status == 'ADMIN')
    {
		$("#checked")	.show()
    }
    else if(form_status == 'NOT_ADMIN')
    {
        $("#note").show();
    }
};
$.fn.populate_dd_values = function (element_id, dd_data, is_search = false)
{
    try
    {
        $('#' + element_id).empty();

        if (is_search)
        {
            $('#' + element_id).append(`<option value="">All</option>`);
        }
        else if (element_id != 'dd_type')
        {
            $('#' + element_id).append(`<option value="">Please Select</option>`);
        }

        for (let item of dd_data)
        {
            $('#' + element_id).append(`<option value="${item.id}">${item.descr}</option>`);
        }
        $('#' + element_id).val('').change();
    }
    catch (err)
    {
        $.fn.log_error(arguments.callee.caller, err.message);
    }
};
$.fn.get_client_drop_down_values = function ()
{
    try
    {
        let data =
        {
            emp_id: SESSIONS_DATA.emp_id,
            view_all: MODULE_ACCESS.viewall
        };

        $.fn.fetch_data
            (
                $.fn.generate_parameter('get_client_drop_down_values', data),
                function (return_data)
                {
                    if (return_data.code == 0)
                    {
                        $.fn.populate_dd_values('dd_search_created_by', return_data.data.account_managers, true);

                        $.fn.populate_dd_values('dd_industry', return_data.data.industry);
                        $.fn.populate_dd_values('dd_client_status', return_data.data.status);
                        $.fn.populate_dd_values('dd_source', return_data.data.source);
                        $.fn.populate_dd_values('dd_offering', return_data.data.offerings);
                        $.fn.populate_dd_values('dd_type', return_data.data.type);
                        $.fn.populate_dd_values('dd_search_type', return_data.data.type);
                    }
                }, true
            );
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
		 $('#showSearchDiv').on('click', function (e)
        {
            e.preventDefault();
            $('#searchDiv').show();
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
		if( parseInt(SESSIONS_DATA.is_admin) )
			$.fn.show_hide_form('ADMIN')
		else
			$.fn.show_hide_form('NOT_ADMIN')
		$.fn.get_client_drop_down_values();
		$('.populate').select2();
		$.fn.get_client_approvals();
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
 
