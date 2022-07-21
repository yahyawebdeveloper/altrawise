var FORM_STATE 		= 0;
var RECORD_INDEX 	= 0;
//var SESSIONS_DATA	= '';
var last_scroll_top = 0;

var btn_save,btn_warranty_save,btn_assign_save;
ASSET_ID = '';

CURRENT_PATH			= '../../';
var FILE_UPLOAD_PATH	= ''; //file upload mandatory field

var drop_down_values 		= [];

var fields_with_drop_down 	= 	[ 'status'
								, 'asset_type'
								, 'asset_owner'
								, 'stake_holders'
								, 'expiry_type'
								, 'assigned_to'
								, 'asset_status'
								];
var fields_with_datepicker 	= 	[ 'purchase_date'
							    , 'expiry_date'
								, 'taken_date'
								, 'return_date'
							    ];
var fields_with_numbers 	= [];

$.fn.data_table_features = function()
{
	try
	{
		if (!$.fn.dataTable.isDataTable('#tbl_list'))
        {
            table = $('#tbl_list').DataTable({
                "searching": false,
                "paging": false,
                "info": false,
                "order": [],
				"buttons": [
					{
						text: '<i class="fa fa-cog"></i>',
						className: 'dd',
						//extend: 'colvis',
						columns: ':not(:first-child)',
						columnText: function (dt, idx, title)
						{
							return '<label class="checkbox-inline pull-left"><input type="checkbox" class="colvisCheckbox" checked>&nbsp' + title + '</label>';
						}
					}
				]
            });
        }
	}
	catch(err)
	{
		console.log(err); //$.fn.log_error(arguments.callee.caller,err.message);
	}
};

$.fn.data_table_destroy = function()
{
	try
	{
		if ($.fn.dataTable.isDataTable('#tbl_list'))
		{
			table.destroy();
		}
	}
	catch(err)
	{
		console.log(err); //$.fn.log_error(arguments.callee.caller,err.message);
	}
};


$.fn.reset_form = function(form)
{
	try
	{
		FORM_STATE		= 0;
		
		if(form == 'list')
		{
			$('#dd_employee_search')	.val('').change();
			$('#dd_asset_type_search')	.val('').change();
		}
		else if(form == 'form')
		{	
			ASSET_ID		= '';
			$('#dd_employee')		.val('').change();
			$('#dd_asset_type')		.val('').change();
			$('#dd_client')			.val('').change();
			$('#dd_asset_owner')	.val('').change();
			$('#purchase_date')		.val('');
			$('#dd_expiry_type')	.val('').change();
			$('#expiry_date')		.val('');
			$('#txt_serial_no')		.val('');
			$('#txt_asset_name')	.val('');
			$('#txt_brand')			.val('');
			$('#txt_product_value')	.val('');
			$('#txt_quantity')		.val('');
			$('#dd_status')			.val('');
			$('#taken_date')		.val('');
			$('#return_date')		.val('');
			// $('#txt_description')	.val('');

			$('#txt_contractor')		.val('');
			$('#txt_warranty_remarks')	.val('');

			$("#table_assign_list").empty();

			$('#asset_form').parsley( 'destroy' );
			$('#asset_form').parsley
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
		}
		else if(form == 'assign_new')
		{	
			$('#txt_assign_id')         .val('');
			$('#dd_employee')        .val('').change();
            $('#taken_date')         .val('');
            $('#return_date')        .val('');
            $('#dd_assign_status')    .val('').change();
            $('#txt_assign_remarks') .val('');
            
        }
	}
	catch(err)
	{
		console.log(err); //$.fn.log_error(arguments.callee.caller,err.message);
	}
};


$.fn.save_edit_form = function()
{
	try
	{
		if($('#asset_form').parsley( 'validate' ) == false)
		{
			btn_save.stop();
			return;
		}
		else
		{
			var data	=
			{
				id					: ASSET_ID,
				employee_id 		: $('#dd_employee')			.val(),
				type_id 			: $('#dd_asset_type')		.val(),
				client_id 			: $('#dd_client')			.val(),
				owner_id 			: $('#dd_asset_owner')	  	.val(),
				status_id 			: $('#dd_status')	  		.val(),
				purchase_date 		: $('#purchase_date')		.val(),
				expiry_type_id 		: $('#dd_expiry_type')	  	.val(),
				expiry_date 		: $('#expiry_date')			.val(),
				serial_no 			: $('#txt_serial_no')		.val(),
				asset_name 			: $('#txt_asset_name')		.val(),
				brand_name 			: $('#txt_brand')			.val(),
				product_value 		: $('#txt_product_value')	.val(),
				quantity 			: $('#txt_quantity')		.val(),
				emp_id 				: SESSIONS_DATA.emp_id
			};

			$.fn.write_data
				(
					$.fn.generate_parameter('add_edit_asset', data),
					function(return_data)
					{
						if(return_data.data)
						{
							ASSET_ID = return_data.data;
							FILE_UPLOAD_PATH    =   `assets/${ASSET_ID}/`;
                    
		                    let attachment_data =   
		                    {
		                        id              : '',
		                        primary_id      : ASSET_ID,
		                        module_id       : MODULE_ACCESS.module_id,
		                        filename        : '',
		                        filesize        : "0",
		                        json_field      : {},
		                        emp_id          : SESSIONS_DATA.emp_id
		                    };

		                    let file_uploaded = 0;
		                    let files_count = $('#files .file-upload.new').length;
		                    if(files_count > 0)
		                    {   
		                        $.fn.upload_file('files','asset_id',ASSET_ID,
		                        attachment_data,function(total_files, total_success,filename,attach_return_data)
		                        {
		                            if(total_files == total_success)
		                            {   
		                            	$.fn.populate_fileupload(attach_return_data,'files',true);
		                                if(file_uploaded == files_count)
		                                {	
		                                	$('#h4_primary_no')		.text('Asset No : ' + ASSET_ID);
											$('#div_sub_details')  	.show();
											$.fn.show_right_success_noty('Data has been recorded successfully');
		                                }
		                                file_uploaded++;
		                            }
		                        },false,btn_save);
		                    }
		                    else
		                    {   
		                        $('#h4_primary_no')		.text('Asset No : ' + ASSET_ID);
								$('#div_sub_details')  	.show();
								$.fn.show_right_success_noty('Data has been recorded successfully');
		                    }

						}

					},false, btn_save
			);

		}
	}
	catch(err)
	{
		console.log(err); //$.fn.log_error(arguments.callee.caller,err.message);
	}
};

$.fn.save_edit_warranty_form = function()
{
	try
	{	
		let json_field  = {
                            contractor 			: $('#txt_contractor')	  	.val(),
                            warranty_remarks 	: $('#txt_warranty_remarks').val()
                          };

		var data	=
		{
			id					: ASSET_ID,
			expiry_type_id 		: $('#dd_expiry_type')	  	.val(),
			expiry_date 		: $('#expiry_date')			.val(),
			json_field          : json_field,
			emp_id 				: SESSIONS_DATA.emp_id
		};

		$.fn.write_data
			(
				$.fn.generate_parameter('add_edit_asset_warranty', data),
				function(return_data)
				{
					if(return_data.data)
					{
						$.fn.show_right_success_noty('Data has been recorded successfully');
					}

				},false, btn_warranty_save
		);
	}
	catch(err)
	{
		console.log(err); //$.fn.log_error(arguments.callee.caller,err.message);
	}
};

$.fn.save_edit_assign_form = function()
{
	try
	{
		if($('#assign_form').parsley( 'validate' ) == false)
		{
			btn_assign_save.stop();
			return;
		}
		else
		{
			var data	=
			{	
				id 					: $('#txt_assign_id')		.val(),
				asset_id			: ASSET_ID,
				assigned_to_id 		: $('#dd_employee')			.val(),
				taken_date 			: $('#taken_date')			.val(),
				return_date 		: $('#return_date')	  		.val(),
				is_active 			: $('#dd_assign_status')	.val(),
				remarks 			: $('#txt_assign_remarks')	.val(),
				emp_id 				: SESSIONS_DATA.emp_id
			};

			$.fn.write_data
			(
				$.fn.generate_parameter('assign_asset_to_employee', data),
				function(return_data)
				{
					if(return_data.data)
					{	
						$.fn.show_right_success_noty('Data has been recorded successfully');
						$('#new_assign_div').hide();
            			$('#btn_new_access').show();
						$.fn.get_asset_employees_list();
					}

				},false, btn_assign_save
			);

		}
	}
	catch(err)
	{
		console.log(err); //$.fn.log_error(arguments.callee.caller,err.message);
	}
};

$.fn.populate_list_form = function(data)
{
	try
	{
		$('#tbl_list > tbody').empty();

		//update counts
        $('#total_records').html(data.length);
		
		if (data.length > 0)
		{
			let row			= '';
			let data_val 	= '';
			
			for(var i = 0; i < data.length; i++)
			{
				data_val = escape(JSON.stringify(data[i]));
				row += '<tr>'+
							'<td>' + data[i].assigned_to		+ '</td>' +
							'<td>' + data[i].type_name 			+ '</td>';
					 data[i].client_name != null  ? row += '<td>'+ data[i].client_name + '</td>' : row += '<td>-</td>';
					 data[i].owner_name != null  ? row += '<td>'+ data[i].owner_name + '</td>' : row += '<td>MSP</td>';
					 data[i].brand_name != null && data[i].brand_name != ''  ? row += '<td>'+ data[i].brand_name + '</td>' : row += '<td>-</td>';
					 data[i].expiry_date != null ? row += '<td>'+ moment(data[i].expiry_date).format('D-MMM-YYYY') + '</td>' : row += '<td>-</td>';
					 
				row += '<td>' +
					   		'<a class="tooltips" href="javascript:void(0)" data-value=\'' + data_val + '\' onclick="$.fn.populate_detail_form(unescape($(this).attr(\'data-value\')))" data-trigger="hover" data-original-title="Edit data "><i class="fa fa-pencil"/></a>&nbsp;&nbsp;'; 
					   		
						if(SESSIONS_DATA.super_admin == 1)
						{
							row += '<a class="tooltips" href="javascript:void(0)" data-value=\'' + data_val + '\' onclick="$.fn.delete_asset(unescape($(this).attr(\'data-value\')))" data-trigger="hover" data-original-title="Delete data "><i class="fa fa-trash-o"/></a>';
						}
				row += '</td>'; 
					 
				row += '</tr>';

			}
			$('#tbl_list tbody').append(row);
			$('#div_load_more').show();
		}

	}
	catch(err)
	{
		console.log(err); //$.fn.log_error(arguments.callee.caller,err.message);
	}
};

$.fn.get_list = function(is_scroll=true, check_item=0)
{
	try
	{
		var post_values = [];
		var param 		= {
			emp_id: SESSIONS_DATA.emp_id, 
			view_all: MODULE_ACCESS.viewall,
            start_index: RECORD_INDEX,
            limit: LIST_PAGE_LIMIT,
            is_admin: SESSIONS_DATA.is_admin
		};
	 	$("#detail_form .condition-row").each(function()
	 	{
	 		var data = {};
	 		
	 		if($(this).find("[name='search_field']").val() != '')
	 		{
	 			data.search_field 		= $(this).find("[name='search_field']").val();
		 		data.search_condition 	= $(this).find("[name='search_condition']").val();
		 		
		 		if(data.search_condition == 'like')
	 			{
		 			data.search_value 		= "%" + $.trim($(this).find("[name='search_value']").val()) + "%";
	 			}
		 		else
		 		{
		 			data.search_value 		= $.trim($(this).find("[name='search_value']").val());
		 		}
		 		post_values.push(data);
	 		}
	 	});
		if(check_item == 1){
			post_values = [];	
		}
	 	param.post_values = post_values;
		if (is_scroll)
        {
            param.start_index = RECORD_INDEX;
        }
	 	
        // console.log(post_values);
		/* 	$.fn.fetch_data
		(
			$.fn.generate_parameter('get_asset_list_flexi',param),
			function(return_data)
			{
				if(return_data)
				{	
					$.fn.data_table_destroy();
					$.fn.populate_list_form(return_data.data);
					$.fn.data_table_features();
				}
			},true, btn_save
		); */

		$.fn.fetch_data(
            $.fn.generate_parameter('get_asset_list_flexi', param),
            function(return_data) {  
                if (return_data.data) { 
                    var len = return_data.data.length;
                    if (return_data.data.rec_index)
                    {
                        RECORD_INDEX = return_data.data.rec_index;
                    }
                    if (return_data.code == 0 && len != 0)
                    {
                        $.fn.data_table_destroy();
                        $.fn.populate_list_form(return_data.data, is_scroll);
                        $.fn.data_table_features();
                        $('#btn_load_more').show();
                    }
                    else if (return_data.code == 1 || len == 0)
                    {
                        if (!is_scroll)
                        {
                            $('#btn_load_more').hide();
                            $.fn.data_table_destroy();
                            $('#tbl_list tbody').empty().append
                                (
                                    `<tr>
                                        <td colspan="8">
                                            <div class="list-placeholder">No records found!</div>
                                        </td>
                                    </tr>`
                                );
                            $.fn.show_right_error_noty('No records found');
                        }
                        else if (is_scroll)
                        {
                            $('#btn_load_more').hide();
                            $.fn.show_right_success_noty('No more records to be loaded');
                        }
                    }
                }else{
					$('#btn_load_more').hide();
					$.fn.data_table_destroy();
					$('#tbl_list tbody').empty().append
						(
							`<tr>
								<td colspan="8">
									<div class="list-placeholder">No records found!</div>
								</td>
							</tr>`
						);
				}
            },
            true
        );
	}
	catch(err)
	{
		console.log(err); //$.fn.log_error(arguments.callee.caller,err.message);
	}
};


$.fn.get_drop_down_values1 = function ()
{
	try
	{
		$.fn.fetch_data
			(
				$.fn.generate_parameter('get_document_search_assest_check'),
				function (return_data)
				{
					$.fn.populate_dd_values('search-field', return_data.data.columns);
					$.fn.populate_dd_values('search-condition', return_data.data.conditions);
				}
			);

	}
	catch (err)
	{ //console.log(err.message);
		$.fn.log_error(arguments.callee.caller, err.message);
	}
};

$.fn.populate_dd_values = function(element_id, dd_data, is_search = false)
{
    try
    {
		$('.'+element_id).empty();
		if(is_search)
		{
			$('.'+element_id).append(`<option value="">All</option>`);
		}
		else if(element_id != 'search-condition')
		{
			$('.'+element_id).append(`<option value="">Please Select</option>`);
		}

		for (let item of dd_data)
		{
			$('.'+element_id).append(`<option value="${item.id}">${item.descr}</option>`);
		}
        
    }
    catch(err)
    {
        $.fn.log_error(arguments.callee.caller,err.message);
    }
};

$.fn.populate_detail_form = function(data)
{
	try
	{
		var data 	= JSON.parse(data);
		$.fn.show_hide_form	('EDIT');
	 	$('#h4_primary_no')		.text('Asset No : ' + data.id);

	 	$.fn.fetch_data
		(
			$.fn.generate_parameter('get_assets_details',{id : data.id}),
			function(return_data)
			{
				if(return_data.data.details)
				{
					var data 					= return_data.data.details;
					ASSET_ID					= data.id;
                    let json_field          	= $.fn.get_json_string(data.json_field);

					$('#dd_employee')			.val(data.employee_id).change();
					$('#dd_asset_type')			.val(data.type_id).change();
					$('#dd_client')				.val(data.client_id).change();
					$('#dd_asset_owner')	  	.val(data.owner_id).change();
					$('#dd_status')	  			.val(data.status_id).change();
				 	$('#purchase_date')			.val(data.purchase_date);
					$('#dd_expiry_type')	  	.val(data.expiry_type_id).change();
				 	$('#expiry_date')			.val(data.expiry_date);
				 	$('#txt_serial_no')			.val(data.serial_no);
				 	$('#txt_asset_name')		.val(data.asset_name);
				 	$('#txt_brand')				.val(data.brand_name);
				 	$('#txt_product_value')		.val(data.product_value);
				 	$('#txt_quantity')			.val(data.quantity);
				 	$('#taken_date')			.val(data.taken_date);
				 	$('#return_date')			.val(data.return_date);
				 	// $('#txt_description')		.val(data.description);

				 	if(json_field.contractor != undefined)
                    {
                        $('#txt_contractor').val(json_field.contractor);
                    }
                    else
                    {
                        $('#txt_contractor').val('');
                    }

                    if(json_field.warranty_remarks != undefined)
                    {
                        $('#txt_warranty_remarks').val(json_field.warranty_remarks);
                    }
                    else
                    {
                        $('#txt_warranty_remarks').val('');
                    }

                    $.fn.populate_fileupload(data,'files',true);
                    $.fn.get_asset_employees_list();
				}
			},true
		);

	}
	catch(err)
	{
		console.log(err); //$.fn.log_error(arguments.callee.caller,err.message);
	}
};

$.fn.delete_asset = function(data)
{
	try
	{
		RECORD_INDEX = 0;
		data = JSON.parse(data);

		var data	=
		{
			id				: data.id,
			employee_id		: $('#dd_employee_search')		.val(),
			type_id 		: $('#dd_asset_type_search')	.val(),
			start_index		: RECORD_INDEX,
			limit			: LIST_PAGE_LIMIT,
			emp_id			: SESSIONS_DATA.emp_id,
			view_all		: MODULE_ACCESS.viewall
	 	};

		bootbox.confirm
        ({
            title: "Delete Confirmation",
            message: "Please confirm before you delete.",
            buttons:
            {
                cancel:
                {
                    label: '<i class="fa fa-times"></i> Cancel'
                },
                confirm:
                {
                    label: '<i class="fa fa-check"></i> Confirm'
                }
            },
            callback: function (result)
            {
                if (result == true)
                {
				  $.fn.write_data
					(
						$.fn.generate_parameter('delete_asset', data),
						function(return_data)
						{
							if(return_data)
							{
								$('#tbl_list > tbody').empty();
								$.fn.populate_list_form(return_data.data, true);
								$.fn.show_right_success_noty('Data has been deleted successfully');
							}

						},false
					);
                }
            }
        });
	}
	catch(err)
	{
		console.log(err); //$.fn.log_error(arguments.callee.caller,err.message);
	}
};


$.fn.show_hide_form = function(form_status)
{
	$.fn.reset_form('form');

	if(form_status == 'NEW')
	{
		$('#list_div')					.hide(400);
		$('#new_div')					.show(400);
		$('#h4_primary_no')				.text('');
		$('#div_sub_details')   		.hide();
		$.fn.init_upload_file();
	}
	else if(form_status == 'EDIT')
	{
		$('#list_div')					.hide(400);
		$('#new_div')					.show(400);
		$('#div_sub_details')   		.show();
		$.fn.reset_form('assign_new');
		$.fn.init_upload_file();
	}
	else if(form_status == 'BACK')
	{
		$('#list_div')		.show(400);
		$('#new_div')		.hide(400);
	}

};

$.fn.get_drop_down_values = function()
{
	try
	{	
		var data	=
		{
			emp_id			: SESSIONS_DATA.emp_id,
			view_all		: MODULE_ACCESS.viewall
	 	};

		$.fn.fetch_data
		(
			$.fn.generate_parameter('get_asset_drop_down_values', data),
			function(return_data)
            {
            	drop_down_values = return_data;
				console.log('get_drop_down_values');
				$.fn.populate_dd('dd_status', return_data.data.status);
				$.fn.populate_dd('dd_asset_type', return_data.data.asset_type);
				$.fn.populate_dd('dd_asset_owner', return_data.data.asset_owner);
				$.fn.populate_dd('dd_client', return_data.data.stake_holders);
				$.fn.populate_dd('dd_expiry_type', return_data.data.expiry_type);
				$.fn.populate_dd('dd_employee', return_data.data.employees);
				$.fn.populate_dd('dd_assign_status', return_data.data.asset_status);
            }
		);
		
	}
	catch(err)
	{
		console.log(err); //$.fn.log_error(arguments.callee.caller,err.message);
	}
};

$.fn.prepare_form = function()
{
	try
	{	

		$.fn.get_list(true, 1);

		$.fn.get_drop_down_values();
		$.fn.get_drop_down_values1();
		$('.populate').select2();
		$('#purchase_date,#expiry_date,#taken_date,#return_date').flatpickr({
			altInput: true,
			altFormat: "d-M-Y",
			dateFormat: "Y-m-d",
			enableTime: false,
		  });

		$('#detail_form').parsley(
			{
				classHandler: function(parsleyField) {              
					return parsleyField.$element.closest(".errorContainer");
				},
				errorsContainer: function(parsleyField) {              
					return parsleyField.$element.closest(".errorContainer");
				},
			}
		);
		$('#asset_form').parsley(
			{
				classHandler: function(parsleyField) {              
					return parsleyField.$element.closest(".errorContainer");
				},
				errorsContainer: function(parsleyField) {              
					return parsleyField.$element.closest(".errorContainer");
				},
			}
		);
		
	}
	catch(err)
	{
		console.log(err); //$.fn.log_error(arguments.callee.caller,err.message);
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
		console.log(err); //$.fn.log_error(arguments.callee.caller,err.message);
	}
};

$.fn.init_upload_file = function()
{
    $.fn.intialize_fileupload('doc_upload','files');
};

$.fn.assign_form = function(form_status,reset_form)
{	
	$('#assign_form').parsley().destroy();
    $.fn.set_validation_form();
    $.fn.reset_form('assign_new');
    $('#new_assign_div').show();
    $('#btn_new_access').hide();
};

$.fn.set_validation_form = function()
{
    $('#assign_form').parsley
    ({
        successClass	: 'has-success',
        errorClass		: 'has-error',
        errors			:
        {
            classHandler: function(el)
            {
                return $(el).closest('.error-container');
            },
            errorsWrapper	: '<ul class=\"help-block list-unstyled\"></ul>',
            errorElem		: '<li></li>'
        }
    });

}

$.fn.get_asset_employees_list = function ()
{
    try 
    {
        let data =
        {
            asset_id : ASSET_ID
        }
        
        $.fn.fetch_data
        (
            $.fn.generate_parameter('get_asset_employees_list', data),
            function (return_data)
            {
                if (return_data.data)
                {   
                    $.fn.populate_asset_employees_list(return_data.data);
                }
            },false,false,false,true
        );
    } 
    catch (err) 
    {
        console.log(err); //$.fn.log_error(arguments.callee.caller, err.message);
    }
};

$.fn.populate_asset_employee_details = function (obj)
{
    try 
    {   
        $.fn.assign_form();
        let data = JSON.parse(obj);
        
        $('#txt_assign_id')         .val(data.id);
		$('#dd_employee')        	.val(data.assigned_to_id).change();
        $('#taken_date')         	.val(data.taken_date);
        $('#return_date')        	.val(data.return_date);
        $('#dd_assign_status')    	.val(data.is_active).change();
        $('#txt_assign_remarks') 	.val(data.remarks);

    } 
    catch (err) 
    {
        console.log(err); //$.fn.log_error(arguments.callee.caller, err.message);
    }
}

$.fn.populate_asset_employees_list = function (data)
{
    try 
    {
        $("#table_assign_list").empty();
        if (data.length > 0)
        {
            let row = '';
            for(let i = 0; i < data.length; i++)
            {
                let edit_row = '';
                if(MODULE_ACCESS.edit == 1)
                {
                    edit_row = `<a class="btn_edit_payment" data-value='${escape(JSON.stringify(data[i]))}' onclick="$.fn.populate_asset_employee_details(unescape($(this).attr('data-value')));">
                                    <i class="fa fa-pencil" aria-hidden="true"></i>
                                </a>`;
                }
                row =  `<tr>
                            <td class='td-shrink'>
                                ${edit_row}
                            </td>
                            <td>${data[i].assigned_to}</td>
                            <td>${data[i].taken_date != null ? moment(data[i].taken_date).format('D-MMM-YYYY') : '-'}</td>
                            <td>${data[i].return_date != null ? moment(data[i].return_date).format('D-MMM-YYYY') : '-'}</td>
                            <td>${data[i].is_active == 1 ? 'Active' : 'InActive'}</td>
                            <td>${data[i].remarks}</td>
                        </tr>`

                $("#table_assign_list").append(row);
                
            }
            
        }
        else
        {
            $("#table_assign_list").append
            (
                `<tr>
                    <td colspan="5">
                        <div class='list-placeholder'>No Records Found</div>
                    </td>
                </tr>`
            );
        }
    } 
    catch (err) 
    {
        console.log(err); //$.fn.log_error(arguments.callee.caller, err.message);
    }
};

$.fn.reset_search = function(no,remark,action)
{
	var newCondition = $("#dynamicContent .condition-row").clone();
    newCondition.find('.select2Plugin').select2();
	$("#detail_form").html(newCondition);

	$("#detail_form .condition-row:first .delete-condition").hide();

	$.fn.reset_validation();
};

$.fn.add_remove_delete = function()
{
	var count = $("#detail_form .condition-row").length;
	if(count == 1)
	{
		$("#detail_form .condition-row:first .delete-condition").hide();
	}
	else
	{
		$("#detail_form .condition-row .delete-condition").show();
	}
	
};

$.fn.reset_validation = function()
{
	$('#detail_form').parsley().destroy();
	$('#detail_form').parsley(
		{
			classHandler: function(parsleyField) {              
				return parsleyField.$element.closest(".errorContainer");
			},
			errorsContainer: function(parsleyField) {              
				return parsleyField.$element.closest(".errorContainer");
			},
		}
	);
};

$.fn.create_drop_down = function(field)
{
	try
	{	
	    let data 		   = drop_down_values;

	    let employees	   =  [ 'approved_by'
							  , 'verified_by'
							  , 'created_by'
							  , 'assigned_to'
							  ];
							  
		let select_options;
		
		if($.inArray(field, employees) !== -1)
		{
			select_options = data['data']['employees'];
		}
		else
		{
			select_options = data['data'][field];
		}
	    
	    let select_html    = '<select class="form-control search-value select2Plugin" name="search_value">';

		$.each( select_options, function( id, value ) 
	    {
		  	select_html	   += '<option value="'+value['id']+'">'+value['descr']+'</option>';
		});

	    select_html   	   += '</select>';
	    
	    return select_html;
    }
	catch(err)
	{
		console.log(err); //$.fn.log_error(arguments.callee.caller,err.message);
	}
};

$.fn.condition_drop_down = function(field)
{
	try
	{	
		let select_conditions;
		if($.inArray(field, fields_with_datepicker) !== -1 || $.inArray(field, fields_with_drop_down) !== -1)
		{
			select_conditions = ['='];
		}
		else if( $.inArray(field, fields_with_numbers) !== -1)
		{
			select_conditions = ['=', '<=', '>=', '<', '>'];
		}
		else
		{
			select_conditions = ['=', 'like'];
		}

		let select_html    = '<select class="form-control search-condition select2Plugin" name="search_condition">';

		$.each( select_conditions, function( id, value ) 
	    {
		  	select_html	   += '<option value="'+value+'">'+value+'</option>';
		});

	    select_html   	   += '</select>';
	    return select_html;
    }
	catch(err)
	{
		console.log(err); //$.fn.log_error(arguments.callee.caller,err.message);
	}
};

$.fn.bind_command_events = function()
{
	try
	{
		$('#btn_new').click( function(e)
		{
			e.preventDefault();
			$.fn.show_hide_form('NEW');
			$('#tblList').hide();
		});
		$('#btn_back,#btn_cancel').click( function(e)
		{
			e.preventDefault();
			$.fn.show_hide_form('BACK');
			// RECORD_INDEX = 0;
			// $.fn.get_list(false);
		});
		$('#btn_save').click( function(e)
		{
			e.preventDefault();
			btn_save = Ladda.create(this);
	 		btn_save.start();
			$.fn.save_edit_form();
		});

		$('#btn_reset').click( function(e)
		{
			e.preventDefault();
			$.fn.reset_form();
			$('#total_records').html('0');
			$.fn.reset_search();
			$.fn.get_list(true);
		});

		$('#btn_search').click( function(e)
		{
			e.preventDefault();
	 		if($('#detail_form').parsley().validate() == false || $('#detail_form').parsley().validate() == null)
			{
				btn_save.stop();
				return;
			}
			$.fn.get_list();
		});
		
		$('#btn_load_more').click( function(e)
		{
			e.preventDefault();
			$.fn.get_list(true);
		});

		$('#btn_warranty_save').click( function(e)
		{
			e.preventDefault();
			btn_warranty_save = Ladda.create(this);
	 		btn_warranty_save.start();
			$.fn.save_edit_warranty_form();
		});

		$('#btn_assign_cancel').click( function(e)
        {
            $('#new_assign_div').hide();
            $('#btn_new_access').show();
        });

        $('#btn_assign_save').click( function(e)
		{
			e.preventDefault();
			btn_assign_save = Ladda.create(this);
	 		btn_assign_save.start();
			$.fn.save_edit_assign_form();
		});

		$('body').on('change', '.search-field', function (e)
		{	
			let current_value = $(this).val();
			let this_class	  = $(this);
			console.log('hii click');
			//change conditions accordingly to the fields
			this_class.parents('.condition-row').find('.search-condition').remove();
			let select_condition = $.fn.condition_drop_down(current_value);
			this_class.parents('.condition-row').find('.conditionContainer').html(select_condition);
			
			if($.inArray(current_value, fields_with_drop_down) !== -1)
			{	
				let select_html = $.fn.create_drop_down(current_value);
				this_class.parents('.condition-row').find('.search-value').replaceWith(select_html);
			}
			else if($.inArray(current_value, fields_with_datepicker) !== -1)
			{
				let input_html 	= 	`<div class="errorContainer">
										<input type="text" id="dp_search_date" class="form-control flatpickr-input search-value" placeholder="16-06-2021 to 30-06-2021" readonly="readonly">
									</div>
									<input type="hidden" class="date_range_value" name="search_value" id="date_range_value">`;

				this_class.parents('.condition-row').find('.search-value').replaceWith(input_html);
				
				this_class.parents('.condition-row').find('.search-value').flatpickr({
					mode:"range",
					altFormat: "d-M-Y",
					dateFormat: "Y-m-d",
					onChange:function(selectedDates){
						var _this=this;
						var dateArr=selectedDates.map(function(date){return _this.formatDate(date,'Y-m-d');});
						$('#date_range_value').val(dateArr[0]+'/'+dateArr[1]);
						
					},
				});
			}
			else
			{		
				let input_html = '<input class="form-control search-value" data-required="true" name="search_value">';
				this_class.parents('.condition-row').find('.search-value').replaceWith(input_html);
				
				if(current_value == 'overdue_tasks')
				{
					this_class.parents('.condition-row').find('.search-condition, .search-value').attr('disabled', 'disabled');
				}
				else
				{
					this_class.parents('.condition-row').find('.search-condition, .search-value').removeAttr('disabled');
				}
			}
			
			$.fn.reset_validation();
			
		});

		$('#add-condition').click( function(e)
        {
            e.preventDefault();
            var newCondition = $("#dynamicContent .condition-row").clone();
            newCondition.find('.select2Plugin').select2();
            newCondition.insertAfter("#detail_form .condition-row:last");

            $.fn.reset_validation();
            $.fn.add_remove_delete();
        });

        $('body').on('click', '.delete-condition', function(e)
        {
        	$(this).parents('.condition-row').remove();
        	$.fn.add_remove_delete();
        });

        $('body').on('change', '.search-field', function(e)
        {
        	var current_value = $(this).val();
        	var current_element = $(this);
        	$('.search-field').not(this).each(function(){
        		if(current_value == $(this).val())
        		{
        			current_element.select2("val", "");
        		}
	        });
        });

	}
	catch(err)
	{
		console.log(err); //$.fn.log_error(arguments.callee.caller,err.message);
	}
};


// START of Document initialization
$(document).ready(function()
{
	$.fn.reset_search();
	$.fn.form_load();
});
// END of Document initialization
