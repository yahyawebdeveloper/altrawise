var RECORD_INDEX 	        = 0;
var CODE_TRIGGERED = false;
var btn_save,btn_save_remarks,btn_send_email,btn_verify_approve,btn_payment_save,btn_save_remarks;
VOCHER_NO		            = '';
var VOUCHER_NO = '';
CURRENT_PATH	            = 	'../../';
var FILE_UPLOAD_PATH		= ''; //file upload mandatory field

$.fn.data_table_features = function ()
{
    try
    {
        if (!$.fn.dataTable.isDataTable('#tbl_list'))
        {
            table = $('#tbl_list').DataTable({
                "searching": false,
                "paging": false,
                "info": false,
                "order": []
            });
        }
    }
    catch (err)
    {
        $.fn.log_error(arguments.callee.caller, err.message);
    }
};

// $.fn.data_table_features = function(table_id)
// {
//     try
//     {
//         if (!$.fn.dataTable.isDataTable('#'+table_id) )
//         {
//             table = $('#'+table_id).DataTable
//             ({
//                 "searching" : false,
//                 "paging"    : false,
//                 "info"      : false,
//                 "order"     : [[ 0, "asc" ]]
//             });
//         }
//     }
//     catch(err)
//     {
//         $.fn.log_error(arguments.callee.caller,err.message);
//     }
// };

$.fn.data_table_destroy = function(table_id)
{
    try
    {
        if ($.fn.dataTable.isDataTable('#'+table_id) )
        {
            table.destroy();
        }
    }
    catch(err)
    {
        $.fn.log_error(arguments.callee.caller,err.message);
    }
};

$.fn.get_list = function(is_scroll, pending_data = false)
{
    try
    {   
        if(pending_data)
        {
            var data = pending_data;
        }
        else
        {
            var data    =
            {
                voucher_no      : $('#txt_search_voucher_no').val(),
                voucher_no_print: $('#txt_voucher_no_print').val(),
                company_id      : $('#dd_search_company').val(),
                title           : $('#txt_search_title').val(),
                paid_to_type    : $('#dd_search_paid_to_type').val(),
                created_by      : $('#dd_search_created_by').val(),
                status          : $('#dd_search_status').val(),
                date_from       : $('#from_date').val(),
                date_to         : $('#to_date').val(),
                view_all        : MODULE_ACCESS.viewall,
                start_index     : RECORD_INDEX,
                limit           : LIST_PAGE_LIMIT,
                is_admin        : SESSIONS_DATA.is_admin,
                emp_id          : SESSIONS_DATA.emp_id
            };
        }

        if(is_scroll)
        {
            data.start_index =  RECORD_INDEX;
        }

        $.fn.fetch_data(
            $.fn.generate_parameter('get_payment_voucher_list', data),
            function(return_data) { 
                console.log(return_data.data);
                 if (return_data.data.list) {
                    var len = return_data.data.list.length;
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
                } 
            }
        );
        
        // $.fn.fetch_data_for_table_v2
        // (
        //     $.fn.generate_parameter('get_payment_voucher_list',data),
        //     $.fn.populate_list_form,is_scroll,'tbl_list'
        // );
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
        if(is_scroll == false)
        {
            $('#tbl_list > tbody').empty();
        }

        //update counts
        $('#total_records').html(data.total_records);
        $('#badge_pending_ver').html(data.pending_verification);
        $('#badge_pending_app').html(data.pending_approval);

        if (data.list.length > 0) // check if there is any data, precaution
        {
            let row			= '';
            let data_val 	= '';
            if(data.rec_index)
            {
                RECORD_INDEX = data.rec_index;
            }
            data = data.list;

            //let access_level			= SESSIONS_DATA.access_level;

            for(var i = 0; i < data.length; i++)
            {
                data_val = escape(JSON.stringify(data[i])); //.replace(/'/,"");

                let status = paid_to = paid_to_name = '';

                //Find status as per the values
                if(data[i].is_to_verify == 0)
                {
                    status = 'Draft';
                }
                else if(data[i].is_to_verify == 1 && data[i].verifier_id == null && data[i].approver_id == null)
                {
                    status = 'Waiting for Verification';
                }
                else if(data[i].is_to_verify == 1 && data[i].verifier_id != null && data[i].approver_id == null)
                {
                    status = 'Waiting for Approval';
                }
                else if(data[i].is_to_verify == 1 && data[i].verifier_id != null && data[i].approver_id != null)
                {
                    status = 'Approved';
                }


                //Find paid to as per the values
                if(data[i].emp_id == 0 && data[i].client_id == 0)
                {
                    paid_to = 'External';
                    paid_to_name = '';
                }
                else if(data[i].emp_id != 0 && data[i].client_id == 0)
                {
                    paid_to = 'Individual';
                    paid_to_name = ` - ${data[i].employee_name}`;
                }
                else if(data[i].emp_id == 0 && data[i].client_id != 0)
                {
                    paid_to = 'Company';
                    paid_to_name = ` - ${data[i].client_name}`;
                }
                row += `<tr id="TR_ROW_${i}"  data-value=\'${data_val}\'>' +
                    <td>${data[i].voucher_no}</td>
                    <td>${data[i].voucher_date}</td>
                    <td>${data[i].title}</td>
                    <td>${data[i].company_name}</td>
                    <td>${paid_to}${paid_to_name}</td>
                    <td>${data[i].created_by}</td>
                    <td>${status}</td>`;

                row += '<td width="10%">';

                // row += '<a class="tooltips" data-toggle="tooltip" data-placement="left" title="View Comments" href="javascript:void(0)" data-value=\'' + data_val + '\' onclick="$.fn.view_remark(unescape($(this).attr(\'data-value\')))"><i class="fa fa-external-link"></i></a>';

                row += `<button type="button" class="btn btn-outline-success btn-xs waves-effect waves-light" data-bs-toggle="tooltip" data-bs-placement="top" title="View Comments" data-value="${data_val}" onclick="$.fn.view_remark(decodeURIComponent('${data_val}'))">
                            <i class="far fa-comment-alt"></i>
                        </button>&nbsp;`;

                if(true)
                {
                    // row += '&nbsp;&nbsp;<a class="tooltips" data-toggle="tooltip" data-placement="left" title="View Details" href="javascript:void(0)" data-value=\'' + data_val + '\' onclick="$.fn.populate_detail_form(unescape($(this).attr(\'data-value\')))"><i class="fa fa-sign-in"></i></a>';

                    row += `<button type="button" class="btn btn-outline-success btn-xs waves-effect waves-light" data-bs-toggle="tooltip" data-bs-placement="top" title="View Details" data-value="${data_val}" onclick="$.fn.populate_detail_form(decodeURIComponent('${data_val}'))">
                            <i class="fas fa-sign-in-alt"></i>
                        </button>`;

                }
                if(MODULE_ACCESS.delete == 1)
                {
                    // row += '&nbsp;&nbsp;<a class="tooltips" data-toggle="tooltip" data-placement="left" title="Delete" href="javascript:void(0)" data-value=\'' + data_val + '\' onclick="$.fn.delete_payment_voucher(unescape($(this).attr(\'data-value\')), $(this).closest(\'tr\').prop(\'id\'))"><i class="fa fa-trash-o"/></a>';

                    row += `&nbsp;
                    <div class="button-list pt-1"><button type="button" class="btn btn-outline-danger btn-xs waves-effect waves-light" data-bs-toggle="tooltip" data-bs-placement="top" title="Delete" data-value="${data_val}" onclick="$.fn.delete_payment_voucher(decodeURIComponent('${data_val}'), $(this).closest(\'tr\').prop(\'id\'))">
                            <i class="far fa-trash-alt"></i>
                        </button>`;
                }

                row += '</div></td>';
                row += '</tr>';

            }
            $('#tbl_list tbody').append(row);
            $('#div_load_more').show();
        }
    }
    catch(err)
    {
        $.fn.log_error(arguments.callee.caller,err.message);
    }
};

$.fn.save_edit_payment_form = function()
{
    try
    {
        
        if($('#payment_form').parsley( 'validate' ) == false)
        {
            btn_save_payment.stop();
            return;
        }

        var attachment = [];
        $('#files .file-upload.new').each(function (index){
            attachment.push($(this)[0].innerText.trim());
        });

        if($('#btn_currency_text').data('value') == undefined)
        {
            $.fn.show_right_error_noty('Please select currency');
            btn_save_payment.stop();
            return;
        }
        
        let json_field  = {
                            remarks   : $('#txt_remarks').val(),
                            reference : $('#txt_reference').val(),
                            // currency  : $('#btn_currency_text').data('value')
                            currency  : $('#currencyValue').text()
                            
                          };

        let data =
        {
            voucher_no          : VOUCHER_NO,
            payment_id          : $(`#txt_payment_id`).val(),
            payment_type_id     : $(`#dd_payment_type`).val(), 
            description         : $(`#txt_description`).val(), 
            department_id       : $(`#dd_department`).val(), 
            client_id           : $(`#dd_client`).val(), 
            amount              : $(`#txt_amount`).val(), 
            json_field          : json_field,
            emp_id          : SESSIONS_DATA.emp_id
        }; 
        


        $.fn.write_data
        (
            $.fn.generate_parameter('add_edit_payment_detail', data),
            function(return_data)
            {
                if(return_data.data)
                {
                    let payment_id      =   return_data.data;
                    FILE_UPLOAD_PATH    =   `${MODULE_ACCESS.module_id}/${VOUCHER_NO}/`;
                    
                    let attachment_data =   
                    {
                        id              : '',
                        primary_id      : VOUCHER_NO,
                        secondary_id    : payment_id,
                        module_id       : MODULE_ACCESS.module_id,
                        filename        : '',
                        filesize        : "0",
                        json_field      : {},
                        emp_id          : SESSIONS_DATA.emp_id
                    };

                    if($('#files .file-upload.new').length > 0)
                    {   
                        let file_uploaded = 1;
                        $.fn.upload_file('files','payment_id',payment_id,
                        attachment_data,function(total_files, total_success,filename,attach_return_data)
                        {
                            if(total_files == total_success)
                            {   
                                // $.fn.populate_fileupload(attach_return_data, 'files', true);
                                if(file_uploaded == 1)
                                {
                                    $.fn.get_payments_list();
                                    $.fn.show_right_success_noty('Data has been recorded successfully');
                                    $.fn.reset_form('payment_new');
                                }
                                file_uploaded++;
                            }
                        },false,btn_save_payment);
                    }
                    else
                    {   
                        $.fn.get_payments_list();
                        $.fn.show_right_success_noty('Data has been recorded successfully');
                        $.fn.reset_form('payment_new');
                    }

                    
                }
            },false, btn_save_payment
        );

    }
    catch(err)
    {
        $.fn.log_error(arguments.callee.caller,err.message);
    }
};

$.fn.get_payments_list = function ()
{
    try 
    {
        let data =
        {
            voucher_no : VOUCHER_NO
        }
        
        $.fn.fetch_data
        (
            $.fn.generate_parameter('get_payments_list', data),
            
            function (return_data)
            {
                if (return_data.data)
                {   
                    $.fn.populate_payments_list(return_data.data);
                }
            },false,false,false,true
        );
    } 
    catch (err) 
    {
        $.fn.log_error(arguments.callee.caller, err.message);
    }
};

$.fn.populate_payment_details = function (obj)
{
    try 
    {   
        $.fn.reset_form('payment_edit');
        let data = JSON.parse(obj);
        let json_field = $.fn.get_json_string(data.json_field);
        if(json_field != false)
        {   
            if(json_field.remarks)
            {
                $('#txt_remarks')         .val(json_field.remarks);
            }
            if(json_field.reference)
            {
                $('#txt_reference')        .val(json_field.reference);
            }
            if(json_field.currency)
            {
                $('#btn_currency_text')   .html(data.currency_name).data('value', json_field.currency);
                $('#currencyValue').html(json_field.currency);
            }
        }

        $('#txt_payment_id')        .val(data.id);
        $('#dd_payment_type')       .val(data.payment_type_id).change();
        $('#txt_description')       .val(data.description);
        $('#dd_department')       .val(data.department_id).change();
        $('#dd_client')             .val(data.client_id).change();
        $('#txt_amount')            .val(data.amount);
        for (let i = 0; i < data.attachment.length; i++)
					{ 
						data.attachment[i]['name'] = data.attachment[i]['filename'];
						data.attachment[i]['uuid'] = data.attachment[i]['id'];
						data.attachment[i]['deleteFileParams'] =  JSON.stringify(data.attachment[i]);
						delete data.attachment[i]['filename'];
						delete data.attachment[i]['id'];
					}
        $.fn.populate_fileupload(data,'attachment_files',true);

    } 
    catch (err) 
    {
        $.fn.log_error(arguments.callee.caller, err.message);
    }
}

$.fn.populate_payments_list = function (data)
{
    try 
    {
        $("#table_payments_list").empty();
        if (data.length > 0)
        {
            let row = '';
            for(let i = 0; i < data.length; i++)
            {
                let json_field        = $.fn.get_json_string(data[i].json_field);
                let remarks           = '';
                let payment_id        = data[i].id;
                if(json_field != false)
                {
                    remarks = json_field.remarks;
                }
                let edit_row = '';
                if(true)
                {
                    // edit_row = `<a class="btn_edit_payment" data-value='${escape(JSON.stringify(data[i]))}' onclick="$.fn.populate_payment_details(unescape($(this).attr('data-value')));">
                    //                 <i class="fa fa-pencil" aria-hidden="true"></i>
                    //             </a>`;

                    edit_row = `<button type="button" class="btn btn-outline-success btn-xs waves-effect waves-light" data-bs-toggle="tooltip" data-bs-placement="top" data-value="${escape(JSON.stringify(data[i]))}" onclick="$.fn.populate_payment_details(decodeURIComponent('${escape(JSON.stringify(data[i]))}'))">
                            <i class="fas fa-edit"></i>
                        </button>`;
                }
                row =  `<tr>
                            <td class='td-shrink'>
                                ${edit_row}
                            </td>
                            <td>${data[i].payment_type}</td>
                            <td>${data[i].description}</td>
                            <td>${data[i].department}</td>
                            <td>${data[i].client_name}</td>
                            <td>${data[i].currency_name ? data[i].currency_name : ''} ${data[i].amount}</td>
                            <td>${remarks}</td>
                            <td><div id="${'payment-'+payment_id}"></div></td>
                        </tr>`

                $("#table_payments_list").append(row);
               
                $.fn.populate_fileupload(data[i],'payment-'+payment_id, true);
                $("#table_payments_list").find('#payment-'+payment_id+' .col-sm-4').toggleClass('col-sm-4 col-sm-12');
            }
            
        }
        else
        {
            $("#table_payments_list").append
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
        $.fn.log_error(arguments.callee.caller, err.message);
    }
};

$.fn.save_edit_form = function()
{
    try
    {
        if ($('#detail_form').parsley().validate() == false)
        {
            btn_save.stop();
            return;
        }

        // if($('#detail_form').parsley( 'validate' ) == false)
        // {
        //     btn_save.stop();
        //     return;
        // }
        
        // VOUCHER_NO = '';
        
        let json_field  = {
                            name   : $('#txt_name').val(),
                            id_no  : $('#txt_id_no').val(),
                            bank   : $('#dd_bank').val(),
                            acc_no : $('#txt_acc_no').val(),
                            reject : []
                          };

        var data	=
        {
            voucher_no		: VOUCHER_NO,
            voucher_no_print: $('#txt_voucher_no_print').val(),
            paid_to_type    : $('#dd_paid_to').find(':selected').attr('data-type'),
            paid_to         : $('#dd_paid_to').val(),
            company_id	    : $('#dd_company').val(),
            title           : $('#txt_title').val(),
            voucher_date 	: $('#txt_voucher_date').val(),
            vendor_id       : $('#dd_vendor').val(),
            payment_mode_id : $('#dd_payment_mode').val(),
            json_field      : json_field,
            emp_id 			: SESSIONS_DATA.emp_id
        };

        $.fn.write_data
        (
            $.fn.generate_parameter('add_edit_payment_voucher', data),
            function(return_data)
            {
                if(return_data.data)
                {
                    $.fn.show_hide_form('EDIT');
                    VOUCHER_NO = return_data.data.details.voucher_no;
                    $('#h4_primary_no').text('Voucher Number : ' + return_data.data.details.voucher_no);
                    $.fn.show_right_success_noty('Data has been recorded successfully');
                }
            },false, btn_save
        );

    }
    catch(err)
    {
        $.fn.log_error(arguments.callee.caller,err.message);
    }
};

$.fn.set_edit_form = function(data)
{
    $('#btn_save')			.html('<i class="fa fa-edit"></i> Update');
};


$.fn.populate_detail_form = function(data)
{
    try
    {
        var data 	= JSON.parse(data);
        $.fn.show_hide_form	('EDIT');
        $('#h4_primary_no')		.text('System PV No : ' + data.voucher_no);

        $.fn.fetch_data
        (
            $.fn.generate_parameter('get_payment_voucher_details',{voucher_no : data.voucher_no, emp_id : SESSIONS_DATA.emp_id}),
            function(return_data)
            {   
                if(return_data.data.details)
                {
                    let data 				= return_data.data.details;
                    let json_field          = $.fn.get_json_string(data.json_field);
                    VOUCHER_NO				= data.voucher_no;
                    $('#voucher_date')	    .val(data.voucher_date);
                    
                    $('#dd_company')		.val(data.company_id).change();
                    $('#txt_title')         .val(data.title);

                    let voucher_no_print = data.voucher_no_print ? data.voucher_no_print : data.voucher_no;
                    $('#txt_voucher_no_print').val(voucher_no_print);

                    $('#dd_vendor')         .val(data.vendor_id).change();
                    $('#dd_payment_mode')   .val(data.payment_mode_id).change();
                    
                    //update approval trail
                    if(parseInt(data.is_to_verify))
                    {
                        $('#div_send_verify').hide();
                        $('#div_approval_trail').show();
                        if(json_field.sent_verification_date != undefined)
                        {   
                            $('#div_approval_trail table tbody').append(`<tr>
                                                                            <td>Sent Verification</td>
                                                                            <td>${json_field.sent_verification_date}</td>
                                                                            <td>${json_field.sent_verification_by_name}</td>
                                                                        </tr>
                                `);
                        }
                        if(parseInt(data.verifier_id) && json_field.verified_by_name != undefined)
                        {
                            $('#div_approval_trail table tbody').append(`<tr>
                                                                            <td>Verified</td>
                                                                            <td>${json_field.verified_date}</td>
                                                                            <td>${json_field.verified_by_name}</td>
                                                                        </tr>
                                `);
                        }
                        if(parseInt(data.approver_id) && json_field.approved_by_name != undefined)
                        {
                            $('#div_approval_trail table tbody').append(`<tr>
                                                                            <td>Approved</td>
                                                                            <td>${json_field.approved_date}</td>
                                                                            <td>${json_field.approved_by_name}</td>
                                                                        </tr>
                                `);
                        }

                    }
                    else
                    {
                        $('#btn_reject').hide();
                    }

                    if(json_field.reject && json_field.reject.length != 0)
                    {   
                        $('#div_approval_trail').show();
                        $.each(json_field.reject, function(key,value) 
                        {
                          
                          let reject_json   = $.fn.get_json_string(value);

                          $('#div_approval_trail table tbody').append(`<tr>
                                                                        <td>Rejected</td>
                                                                        <td>${reject_json.date}</td>
                                                                        <td>${reject_json.by}</td>
                                                                    </tr>
                            `);
                        }); 
                    }
                    //Find paid to as per the values
                    if(data.emp_id == 0 && data.client_id == 0)
                    {
                        $("#dd_paid_to #dd_paid_to_individual option[value='external']").attr('selected', 'selected');
                        $("#dd_paid_to").change();
                    }
                    else if(data.emp_id != 0 && data.client_id == 0)
                    {
                        $("#dd_paid_to #dd_paid_to_individual option[value='"+data.emp_id+"']").attr('selected', 'selected');
                        $("#dd_paid_to").change();
                    }
                    else if(data.emp_id == 0 && data.client_id != 0)
                    {
                        $("#dd_paid_to #dd_paid_to_company option[value='"+data.client_id+"']").attr('selected', 'selected');
                        $("#dd_paid_to").change();
                    }

                    if(json_field.name != undefined)
                    {
                        $('#txt_name').val(json_field.name);
                    }
                    else
                    {
                        $('#txt_name').val('');
                    }

                    if(json_field.id_no != undefined)
                    {
                        $('#txt_id_no').val(json_field.id_no);
                    }
                    else
                    {
                        $('#txt_id_no').val('');
                    }

                    if(json_field.bank != undefined)
                    {
                        $('#dd_bank').val(json_field.bank).change();
                    }
                    else
                    {
                        $('#dd_bank').val('').change();
                    }

                    if(json_field.acc_no != undefined)
                    {
                        $('#txt_acc_no').val(json_field.acc_no);
                    }
                    else
                    {
                        $('#txt_acc_no').val('');
                    }

                    $.fn.get_payments_list();

                    if(MODULE_ACCESS.verify == 1 && parseInt(data.is_to_verify) && data.verifier_id == null)
                    {
                        $('#btn_reject,#btn_verify').show();
                    }
                    if(parseInt(data.is_to_verify) && data.verifier_id != null)
                    {
                        $('#btn_save').hide();
                        $('#btn_new_payment').hide();
                        //$('.btn_edit_payment').hide();
                    }
                    if(MODULE_ACCESS.approve == 1 && parseInt(data.is_to_verify) && data.verifier_id != null && data.approver_id == null)
                    {
                        $('#btn_reject,#btn_approve').show();
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


$.fn.reset_form = function(form)
{
    try
    {
        if(form == 'list')
        {
            $('#txt_search_voucher_no')		.val('');
            $('#dd_search_company')	.val('').change();
            $('#txt_search_title')	.val('');
            $('#dd_search_status')		.val('').change();
            $('#dd_search_vendor')	    .val('').change();
            $('#dd_search_created_by')      .val('').change();
            $('#dd_search_paid_to_type')      .val('').change();
        }
        else if(form == 'voucher_new')
        {
            $('#dd_company')        .val('').change();
            $('#txt_title')         .val('');
            $('#txt_voucher_no_print').val('');

            var today = new Date();
            $("#txt_voucher_date").datepicker("setDate",today);

            $('#dd_vendor')         .val('').change();
            $('#dd_payment_mode')   .val('').change();

            $('#txt_name')         .val('');
            $('#txt_id_no')        .val('');
            $('#dd_payment_mode')  .val('').change();
            $('#txt_acc_no')       .val('');

            $('#div_approval_trail').hide();
            $('#btn_reject').hide();

            VOUCHER_NO = '';
            $.fn.change_switchery($('#chk_send_verify'), false);
            $('#detail_form').parsley().destroy();
            $.fn.set_validation_form();
        }
        else if(form == 'payment_new')
        {
            $('#txt_payment_id')        .val('');

            $('#dd_payment_type')       .val('').change();
            $('#txt_description')       .val('');
            $('#dd_department')         .val('').change();
            $('#dd_client')             .val('').change();
            $('#txt_amount')            .val('');
            $('#txt_remarks')           .val('');
            $('#txt_reference')         .val('');
            $('#btn_save_payment')      .html('Save');

            $('#btn_currency_text').html('$?');
            $('#payment_form').parsley().destroy();
            $.fn.set_validation_form();
            $.fn.init_upload_file();
        }
        else if(form == 'payment_edit')
        {
            $('#btn_save_payment')      .html('Update');
            $('#btn_new_payment').hide();
            $('#new_payment_div').slideDown();
            $('#payment_form').parsley().destroy();
            $.fn.set_validation_form();
            $.fn.init_upload_file();
        }
        else if(form == 'remark_list_modal')
        {
            $('#voucher_remark')      .val('');
            $('#remark_form').parsley().destroy();
        }
    }
    catch(err)
    {
        $.fn.log_error(arguments.callee.caller,err.message);
    }
};

$.fn.init_upload_file = function()
{   
    $.fn.intialize_fileupload('fileupload','files');
};

$.fn.show_hide_form = function(form_status, verification_status = false)
{
    
    if(form_status == 'NEW')
    {   
        $('#div_send_verify').hide();
        $('#list_div')		.hide(400);
        $('#new_div')		.show(400);
        $('#h4_primary_no')	.text('');
        // $.fn.reset_form('voucher_new');
        $('#btn_save')		.html('<i class="fa fa-check"> </i> Save');
        $('#payment_container').hide();
        // $.fn.init_upload_file();
    }
    else if(form_status == 'EDIT')
    {   
        $('#div_send_verify').show();
        $('#list_div')      .hide(400);
        $('#new_div')       .show(400);
        $('#payment_container').show();
        $('#div_approval_trail table tbody').empty();
        $('#btn_verify,#btn_approve').hide();
        $("#table_payments_list").empty();
        $('#new_payment_div').hide();
        $('#btn_new_payment').show();
        $.fn.change_switchery($('#chk_send_verify'), false);
        $.fn.set_edit_form();

        if(verification_status && MODULE_ACCESS.edit == 0)
        {
            $('#btn_save')       .hide();
            $('#btn_new_payment').hide();
        }
        $('#detail_form').parsley().destroy();
        $.fn.set_validation_form();
        // $.fn.init_upload_file();
    }
    else if(form_status == 'BACK')
    {
        $('#list_div')		.show(400);
        $('#new_div')		.hide(400);
    }
};


$.fn.prepare_form = function()
{
    try
    {   
        //datepicker
		$(`#txt_voucher_date`).flatpickr({  
            altInput: true,
            altFormat: "d-m-Y",
            dateFormat: "d-m-Y",
        });

        // $('#txt_voucher_date').datepicker({dateFormat: 'dd-mm-yy'});

        // var today=new Date();
        // $("#txt_voucher_date").datepicker("setDate",today);

        // $('#dp_date').daterangepicker
        // ({
        //     ranges:
        //     {
        //         'Today'         : [moment(), moment()],
        //         'Yesterday'     : [moment().subtract('days', 1), moment().subtract('days', 1)],
        //         'Last 7 Days'   : [moment().subtract('days', 6), moment()],
        //         'Last 30 Days'  : [moment().subtract('days', 29), moment()],
        //         'This Month'    : [moment().startOf('month'), moment().endOf('month')],
        //         'Last Month'    : [moment().subtract('month', 1).startOf('month'), moment().subtract('month', 1).endOf('month')]
        //     },
        //     locale:
        //     {
        //         cancelLabel : "Reset"
        //     },
        //     startDate            : moment().subtract('days', 29),
        //     endDate              : moment(),
        //     showCustomRangeLabel : false,
        //     autoUpdateInput      : false,
        //     opens                : 'left'
        // },
        // function(start, end)
        // {
        //     $('#dp_date span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
        //     $('#from_date').val(start.format('YYYY-MM-DD'));
        //     $('#to_date').val(end.format('YYYY-MM-DD'));
        // });
        // $('#dp_date span').html(moment().subtract('days', 29).format('MMMM D, YYYY') + ' - ' + moment().format('MMMM D, YYYY'));

        var elems = Array.prototype.slice.call(document.querySelectorAll('.js-switch'));
        $('.js-switch').each(function() 
        {
            new Switchery($(this)[0], $(this).data());
        });


        $('.populate').select2();
        $('.tooltips').tooltip();
        $.fn.set_validation_form();

        if(MODULE_ACCESS.create == 0)
        {
            $('#btn_new')		.hide();
            $('#btn_save')		.hide();
            $('#btn_cancel')	.hide();
        }
        if(MODULE_ACCESS.verify == 0)
        {
            $('#btn_list_pending_ver').hide();
        }
        if(MODULE_ACCESS.approve == 0)
        {
            $('#btn_list_pending_app').hide();
        }

        $.fn.get_payment_voucher_drop_down_values();

        $.fn.get_list();
    }
    catch(err)
    {
        $.fn.log_error(arguments.callee.caller,err.message);
    }
};

$.fn.change_switchery = function(obj, checked) 
{   
    if(obj.is(':checked') != checked)
    {   
        CODE_TRIGGERED = true;
        obj.parent().find('.switchery').trigger('click');
    }
}

$.fn.get_payment_voucher_drop_down_values = function()
{
    try
    {   
        let lead_access = $.fn.get_accessibility(121);
        let data    =
        {   
            emp_id   : SESSIONS_DATA.emp_id,
            view_all : MODULE_ACCESS.viewall,
            lead_access_view_all : lead_access.viewall,
            lead_access_view     : lead_access.view
        };

        $.fn.fetch_data
        (
            $.fn.generate_parameter('get_payment_voucher_drop_down_values', data),
            function(return_data)
            {
                if (return_data.code == 0)
                {   
                    $.fn.populate_dd_values('dd_search_company', return_data.data.company, true);
                    //$.fn.populate_dd_values('dd_search_vendor', return_data.data.vendor, true);
                    $.fn.populate_dd_values('dd_search_status', return_data.data.status, true);
                    $.fn.populate_dd_values('dd_search_created_by', return_data.data.created_by, true);
                    $.fn.populate_dd_values('dd_search_paid_to_type', return_data.data.paid_to_type, true);

                    $.fn.populate_dd_values('dd_company', return_data.data.company);
                    //$.fn.populate_dd_values('dd_vendor', return_data.data.vendor);
                    $.fn.populate_dd_values('dd_paid_to', return_data.data.paid_to);
                    $.fn.populate_dd_values('dd_bank', return_data.data.bank);
                    $.fn.populate_dd_values('dd_payment_mode', return_data.data.payment_mode);

                    $.fn.populate_dd_values('dd_department', return_data.data.department);
                    $.fn.populate_dd_values('dd_payment_type', return_data.data.payment_type);
                    $.fn.populate_dd_values('dd_client', return_data.data.client);
                    $.fn.populate_currency('currency_div', return_data.data.currency);
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
        if(element_id == 'dd_paid_to')
        {
            for (let item of dd_data.employees)
            {
                $('#dd_paid_to_individual').append(`<option data-name="${item.name}" 
                                                     data-id_no="${item.id_no}"
                                                     data-acc_no="${item.acc_no}" 
                                                     data-bank="" 
                                                     data-type="individual" 
                                                     value="${item.id}">${item.descr}
                                                     </option>`
                                                   );
            }
            $('#dd_paid_to_individual').append(`<option data-type="external" 
                                                value="external">External
                                                </option>`
                                              );
            for (let item of dd_data.companies)
            {
                $('#dd_paid_to_company').append(`<option data-name="${item.name}"
                                                 data-id_no="${item.id_no}"
                                                 data-acc_no="${item.acc_no}"
                                                 data-bank="${item.bank}" 
                                                 data-type="company" 
                                                 value="${item.id}">${item.descr}
                                                 </option>`
                                                );
            }
        }
        else
        {   
            $('#'+element_id).empty();

            if(is_search)
            {
                $('#'+element_id).append(`<option value="">All</option>`);
            }
            else
            {   
                $('#'+element_id).append(`<option value="">Please Select</option>`);
            }

            for (let item of dd_data)
            {
                $('#'+element_id).append(`<option value="${item.id}">${item.descr}</option>`);
            }
        }
        $('#'+element_id).val('').change();
    }
    catch(err)
    {
        $.fn.log_error(arguments.callee.caller,err.message);
    }
};

$.fn.populate_currency = function(element_id, dd_data)
{
    try
    {   
        $('#'+element_id).empty();

        for (let item of dd_data)
        {
            $('#'+element_id).append(`<li><a class="currency-btn" style="cursor:pointer;" data-value="${item.id}">${item.descr}</a></li>`);
            // $('#'+element_id).append(`<li class="currency-btn option" data-value="${item.id}">${item.descr}</li>`);
        }
        
    }
    catch(err)
    {
        $.fn.log_error(arguments.callee.caller,err.message);
    }
};

$.fn.set_validation_form = function()
{
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

    // $('#detail_form').parsley
    // ({
    //     successClass	: 'has-success',
    //     errorClass		: 'has-error',
    //     errors			:
    //     {
    //         classHandler: function(el)
    //         {
    //             return $(el).closest('.error-container');
    //         },
    //         errorsWrapper	: '<ul class=\"help-block list-unstyled\"></ul>',
    //         errorElem		: '<li></li>'
    //     }
    // });

    $('#payment_form').parsley
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

    $('#remark_form').parsley
    ({
        successClass    : 'has-success',
        errorClass      : 'has-error',
        errors          :
        {
            classHandler: function(el)
            {
                return $(el).closest('.form-group');
            },
            errorsWrapper   : '<ul class=\"help-block list-unstyled\"></ul>',
            errorElem       : '<li></li>'
        }
    });
}

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


$.fn.payment_form = function(form_status,reset_form)
{
    $.fn.reset_form('payment_new');
    $('#new_payment_div').show();
};

$.fn.update_payment_voucher_status = function(type, btn_verify_approve) 
{
    try 
    {
        let data =
        {
            voucher_no      : VOUCHER_NO,
            emp_id          : SESSIONS_DATA.emp_id,
            emp_name        : SESSIONS_DATA.name,
            reject_reason   : $('#reject_reason').val(),
            type            : type
        }

        $.fn.write_data
        (
            $.fn.generate_parameter('update_payment_voucher_status', data),
            function(return_data)
            {
                if (return_data.data)
                {
                    if(type == 1)
                    {
                        $.fn.show_right_success_noty('Payment Voucher has been sent for verification');
                        
                        if(MODULE_ACCESS.verify == 1)
                        {
                            $('#btn_verify').show('slow');
                        }
                    }
                    else if(type == 2)
                    {
                        $.fn.show_right_success_noty('Payment Voucher has been Verified'); 
                        $('#btn_verify').hide('slow');
                        if(MODULE_ACCESS.approve == 1)
                        {
                            $('#btn_approve').show('slow');
                        }
                    }
                    else if(type == 3)
                    {
                        $.fn.show_right_success_noty('Payment Voucher has been Approved'); 
                        $('#btn_approve').hide('slow');
                    }
                    else if(type == 4)
                    {
                        $.fn.show_right_success_noty('Payment Voucher has been Rejected'); 
                        $('#btn_reject').hide('slow');
                    }

                    data = JSON.stringify(data);
                    $.fn.populate_detail_form(data);
                }
            }, false, btn_verify_approve
        );
    } 
    catch (e) 
    {
        $.fn.log_error(arguments.callee.caller, e.message);
    }
}

$.fn.send_for_verification = function() 
{
    try 
    {   
        //validate atleast one payment is added for respective voucher
        if($('#chk_send_verify').is(":checked") && $('#table_payments_list tr').length == 0)
        {   
            $.fn.show_right_error_noty('Atleast one payment should be added');
            $.fn.change_switchery($('#chk_send_verify'), false);
            return false;
        }
        if($('#chk_send_verify').is(":checked"))
        {
            bootbox.confirm
            ({
                title   : "SEND FOR VERIFICATION",
                message : "Are you sure want to send for verification?",
                buttons :
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
                        $.fn.update_payment_voucher_status(1);
                    }
                    else
                    {
                        $.fn.change_switchery($('#chk_send_verify'), false);
                        
                    }
                }
            });
        }
    } 
    catch (e) 
    {
        $.fn.log_error(arguments.callee.caller, e.message);
    }
}

$.fn.delete_payment_voucher = function(data, element_id)
{
    try
    {
        var data    = JSON.parse(data);
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
                    var data_delete =
                    {
                        voucher_no : data.voucher_no,
                        emp_id      : SESSIONS_DATA.emp_id
                    };
                    $.fn.write_data
                    (
                        $.fn.generate_parameter('delete_payment_voucher', data_delete),
                        function(return_data)
                        {
                            if(return_data)
                            {   
                                $(`#${element_id}`).fadeOut();
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
        $.fn.log_error(arguments.callee.caller,err.message);
    }
};

$.fn.view_remark = function(data)
{
    try
    {   
        var data        = JSON.parse(data);
        var remarks     = JSON.parse(data.remarks);

        if (remarks) // check if there is any data, precaution
        {
            var row             = '';
            var data_val        = '';
            $('#tbl_remark_list tbody').html('');
            for(var i = 0; i < remarks.length; i++)
            {
                data.delete_data = [];
                data.delete_data.push(JSON.stringify(remarks[i]));
                data_val        = escape(JSON.stringify(data));

                row += `<tr><td><button type="button" class="btn btn-outline-danger btn-xs waves-effect waves-light" data-bs-toggle="tooltip" data-bs-placement="top" title="Delete data" data-value="${data_val}" onclick="$.fn.delete_remark(decodeURIComponent('${data_val}'))">
                            <i class="far fa-trash-alt"></i>
                        </button></td>`  +
                        '<td>' + remarks[i].remarks         + '</td>' +
                        '<td>' + remarks[i].created_by      + '</td>' +
                        '<td>' + remarks[i].created_date    + '</td>';
                row += '</tr>';
                        

                // row += '<tr>'+
                //             '<td><a class="tooltips" href="javascript:void(0)" data-value=\'' + data_val + '\' onclick="$.fn.delete_remark(unescape($(this).attr(\'data-value\')))" data-trigger="hover" data-original-title="Delete data "><i class="fa fa-trash-o"/></a></td>' +
                //             '<td>' + remarks[i].remarks         + '</td>' +
                //             '<td>' + remarks[i].created_by      + '</td>' +
                //             '<td>' + remarks[i].created_date    + '</td>';
                // row += '</tr>';

            }
            $('#tbl_remark_list tbody').html(row);
            $('.back-to-top-badge').removeClass('back-to-top-badge-visible');
        }
        else
        {
            $('#tbl_remark_list > tbody').empty();
        }
        $('#payment_voucher').attr('data-value',JSON.stringify(data));
        $('#remarkListModal').modal('show');
    }
    catch(err)
    {
        $.fn.log_error(arguments.callee.caller,err.message);
    }
};

$.fn.add_edit_remark = function()
{
    try
    {
        if($('#remark_form').parsley( 'validate' ) == false)
        {
            btn_save_remarks.stop();
            return;
        }
        var data        = JSON.parse($('#payment_voucher').attr('data-value'));
        var remarks     = JSON.parse(data.remarks);

        var remark_rec =
        {
            remarks         : ($('#voucher_remark').val()).trim(),
            created_by      : SESSIONS_DATA.name,
            created_date    : moment().format('YYYY-MM-DD HH:mm:ss')
        };

        if(remarks)
        {
            remarks.push(remark_rec);
        }
        else
        {
            remarks = [];
            remarks.push(remark_rec);
        }

        var data    =
        {
            voucher_no    : data.voucher_no,
            remarks       : remarks,
            remark_comment: ($('#voucher_remark').val()).trim(),
            emp_id          : SESSIONS_DATA.emp_id,
            emp_name        : SESSIONS_DATA.name,
        };

        $.fn.write_data
        (
            $.fn.generate_parameter('payment_voucher_add_edit_remark', data),
            function(return_data)
            {
                if(return_data.data)
                {
                    RECORD_INDEX = 0;
                    $.fn.get_list(false);
                    $.fn.reset_form('remark_list_modal');
                    $.fn.show_right_success_noty('Data has been recorded successfully');
                }

            },false, btn_save_remarks
        );

        $('#remarkListModal').modal('hide');
    }
    catch(err)
    {
        $.fn.log_error(arguments.callee.caller,err.message);
    }
};

$.fn.delete_remark = function(data)
{
    try
    {
        var data            = JSON.parse(data);
        var remarks         = JSON.parse(data.remarks);
        var delete_data     = JSON.parse(data.delete_data);
        remarks             = remarks.filter(obj => obj.remarks != delete_data.remarks);


        var data    =
        {
            voucher_no      : data.voucher_no,
            remarks         : remarks,
            emp_id          : SESSIONS_DATA.emp_id
        };

        $.fn.write_data
        (
            $.fn.generate_parameter('payment_voucher_add_edit_remark', data),
            function(return_data)
            {
                if(return_data.data)
                {
                    RECORD_INDEX = 0;
                    $.fn.get_list(false);
                    $.fn.reset_form('remark_list_modal');
                    $.fn.show_right_success_noty('Data has been deleted successfully');
                }

            },false
        );

        $('#remarkListModal').modal('hide');
    }
    catch(err)
    {
        $.fn.log_error(arguments.callee.caller,err.message);
    }
};

$.fn.print_voucher = function()
{
    try
    {   
        let data =
        {
            voucher_no : VOUCHER_NO
        }
        
        $.fn.fetch_data
        (
            $.fn.generate_parameter('get_payment_voucher_to_print', data),
            function (return_data)
            {
                if (return_data.data)
                {   
                    let details  = return_data.data.details;
                    let payments = return_data.data.payments;
                    let json_field = $.fn.get_json_string(details.json_field);
                    let paid_to = '';

                    if(details.emp_id == 0 && details.client_id == 0)
                    {
                        paid_to = 'External';
                    }
                    else if(details.emp_id != 0 && details.client_id == 0)
                    {
                        paid_to = 'Individual';
                    }
                    else if(details.emp_id == 0 && details.client_id != 0)
                    {
                        paid_to = 'Company';
                    }
                    
                    let row = '';
                    let total_amount = 0; 
                    let currency = ''; 
                    if (payments.length > 0)
                    {
                        for(let i = 0; i < payments.length; i++)
                        {
                            let json_field_payments = $.fn.get_json_string(payments[i].json_field);
                            let remarks           = '';
                            if(json_field_payments != false)
                            {
                                remarks = json_field_payments.remarks;
                            }
                            total_amount += parseFloat(payments[i].amount);
                            currency    = payments[i].currency_name;
                            row +=  `<tr>
                                        <td>${i+1}</td>
                                        <td>${payments[i].payment_type}</td>
                                        <td>${payments[i].description}</td>
                                        <td>${payments[i].department}</td>
                                        <td>${payments[i].client_name}</td>
                                        <td>${remarks}</td>
                                        <td>${payments[i].currency_name} ${payments[i].amount}</td>
                                    </tr>`
                        }
                        
                    }
                    else
                    {
                        row = `<tr>
                                    <td colspan="4">
                                        <div class='list-placeholder'>No Records Found</div>
                                    </td>
                                </tr>`;
                    }
                    
                    let mywindow = window.open('', 'PRINT');
                    let print_css = `<style type="text/css">
                                        @media print {
                                        :root{--blue:#007bff;--indigo:#6610f2;--purple:#6f42c1;--pink:#e83e8c;--red:#dc3545;--orange:#fd7e14;--yellow:#ffc107;--green:#28a745;--teal:#20c997;--cyan:#17a2b8;--white:#fff;--gray:#6c757d;--gray-dark:#343a40;--primary:#007bff;--secondary:#6c757d;--success:#28a745;--info:#17a2b8;--warning:#ffc107;--danger:#dc3545;--light:#f8f9fa;--dark:#343a40;--breakpoint-xs:0;--breakpoint-sm:576px;--breakpoint-md:768px;--breakpoint-lg:992px;--breakpoint-xl:1200px;--font-family-sans-serif:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol";--font-family-monospace:SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace;}
                                        *,::after,::before{box-sizing:border-box;}
                                        html{font-family:sans-serif;line-height:1.15;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;-ms-overflow-style:scrollbar;-webkit-tap-highlight-color:transparent;}
                                        body{margin:0;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol";font-size:1rem;font-weight:400;line-height:1.25;color:#212529;text-align:left;background-color:#fff;}
                                        h3,h5{margin-top:0;margin-bottom:.5rem;}
                                        p{margin-top:0;margin-bottom:1rem;}
                                        strong{font-weight:bolder;}
                                        a{color:#007bff;text-decoration:none;background-color:transparent;-webkit-text-decoration-skip:objects;}
                                        a:hover{color:#0056b3;text-decoration:underline;}
                                        table{border-collapse:collapse;}
                                        th{text-align:inherit;}
                                        h3,h5{margin-bottom:.5rem;font-family:inherit;font-weight:500;line-height:1.2;color:inherit;}
                                        .row{display:-ms-flexbox;display:flex;-ms-flex-wrap:wrap;flex-wrap:wrap;margin-right:-15px;margin-left:-15px;}
                                        .col-12,.col-lg-12,.col-lg-4,.col-md-12,.col-sm-12,.col-sm-5,.col-sm-6,.col-xl-8{position:relative;width:100%;min-height:1px;padding-right:15px;padding-left:15px;}
                                        .col-12{-ms-flex:0 0 100%;flex:0 0 100%;max-width:100%;}
                                        
                                        .col-sm-5{-ms-flex:0 0 41.666667%;flex:0 0 41.666667%;max-width:41.666667%;}
                                        .col-sm-6{-ms-flex:0 0 50%;flex:0 0 50%;max-width:50%;}
                                        .col-sm-12{-ms-flex:0 0 100%;flex:0 0 100%;max-width:100%;}
                                        
                                        
                                        .table{width:100%;max-width:100%;margin-bottom:1rem;background-color:transparent;}
                                        .table td,.table th{padding:.75rem;vertical-align:top;border-top:1px solid #dee2e6;font-size:1rem;}
                                        .table thead th{vertical-align:bottom;border-bottom:2px solid #dee2e6;}
                                        .table-striped tbody tr:nth-of-type(odd){background-color:rgba(0,0,0,.05);}
                                        
                                        
                                        .card{position:relative;display:-ms-flexbox;display:flex;-ms-flex-direction:column;flex-direction:column;min-width:0;word-wrap:break-word;background-color:#fff;background-clip:border-box;border:1px solid rgba(0,0,0,.125);border-radius:.25rem;}
                                        .card-body{-ms-flex:1 1 auto;flex:1 1 auto;padding:1.25rem;}
                                        .card-header{padding:.75rem 1.25rem;margin-bottom:0;background-color:rgba(0,0,0,.03);border-bottom:1px solid rgba(0,0,0,.125);}
                                        .card-header:first-child{border-radius:calc(.25rem - 1px) calc(.25rem - 1px) 0 0;}
                                        .card-footer{padding:.75rem 1.25rem;background-color:rgba(0,0,0,.03);border-top:1px solid rgba(0,0,0,.125);}
                                        .card-footer:last-child{border-radius:0 0 calc(.25rem - 1px) calc(.25rem - 1px);}
                                        .bg-white{background-color:#fff!important;}
                                        .d-inline-block{display:inline-block!important;}
                                        .float-right{float:right!important;}
                                        .mb-0{margin-bottom:0!important;}
                                        .mb-1{margin-bottom:.25rem!important;}
                                        .mb-3{margin-bottom:1rem!important;}
                                        .mb-4{margin-bottom:1.5rem!important;}
                                        .pt-2{padding-top:.5rem!important;}
                                        .p-4{padding:1.5rem!important;}
                                        .ml-auto{margin-left:auto!important;}
                                        .text-dark{color:#343a40!important;}
                                        
                                        *,::after,::before{text-shadow:none!important;box-shadow:none!important;}
                                        a:not(.btn){text-decoration:underline;}
                                        thead{display:table-header-group;}
                                        tr{page-break-inside:avoid;}
                                        h3,p{orphans:3;widows:3;}
                                        h3{page-break-after:avoid;}
                                        body{min-width:992px!important;}
                                        .table{border-collapse:collapse!important;}
                                        .table td,.table th{background-color:#fff!important;}
                                        
                                        /*! CSS Used from: Embedded */
                                        body{background-color:#000;}
                                        .padding{padding:2rem!important;}
                                        .card{margin-bottom:30px;border:none;-webkit-box-shadow:0px 1px 2px 1px rgba(154, 154, 204, 0.22);-moz-box-shadow:0px 1px 2px 1px rgba(154, 154, 204, 0.22);box-shadow:0px 1px 2px 1px rgba(154, 154, 204, 0.22);}
                                        .card-header{background-color:#fff;border-bottom:1px solid #e6e6f2;}
                                        h3{font-size:1.75rem;}
                                        h5{font-size:1.25rem;line-height:20px;color:#3d405c;margin:0px 0px 15px 0px;}
                                        .text-dark{color:#3d405c!important;}
                                        dt { float: left; clear: left; width: 9em; font-weight: 500; }
                                        dd { float: left; }
                                        .right{text-align:right;}​
                                        }
                                        </style>`;

                let print_content = print_css+`<div class="offset-xl-2 col-xl-8 col-lg-12 col-md-12 col-sm-12 col-12">
                <div class="card">
                        <div class="card-header p-4">
                            <div class="float-right">
                                <h3 class="mb-0">Voucher #${details.voucher_no_print}</h3>
                                Date: ${details.voucher_date}
                            </div>
                        </div>
                        <br>
                        <div class="card-body">
                            <div class="row">
                                <div class="col-sm-6 ">
                                    <h5 class="mb-1">Voucher Details:</h5>
                                    <dl>
                                    <dt>Company : </dt>
                                    <dd>${details.company}</dd>
                                    <dt>Title : </dt>
                                    <dd>${details.title}</dd>
                                    <dt>Payment Mode : </dt>
                                    <dd>${details.payment_mode}</dd>
                                    <dt>Paid To : </dt>
                                    <dd>${paid_to}</dd>
                                </dl>
                                </div>
                                <div class="col-sm-6 ">
                                    <h5 class="mb-1">Account Details:</h5>
                                    <dl>
                                    <dt>Name : </dt>
                                    <dd>${json_field.name}</dd>
                                    <dt>Identification # : </dt>
                                    <dd>${json_field.id_no}</dd>
                                    <dt>Bank : </dt>
                                    <dd>${json_field.bank}</dd>
                                    <dt>Account Number : </dt>
                                    <dd>${json_field.acc_no}</dd>
                                </dl>
                                </div>
                            </div>
                            <br>
                            <div class="table-responsive-sm">
                                <table class="table table-striped">
                                    <thead>
                                        <tr>
                                            <th class="center">#</th>
                                            <th>Payment Type</th>
                                            <th>Description</th>
                                            <th>Charge to Department</th>
                                            <th>Charge to Client</th>
                                            <th>Remarks</th>
                                            <th class="right">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${row}
                                    </tbody>
                                    <tfoot>
                                    <tr>
                                        <td colspan="6" class="right"><b>Total :</b></td>
                                        <td class="right">${currency} ${total_amount}</td>
                                    </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>
                        <div class="card-footer bg-white">
                            <div class="row">
                                <div class="col-sm-6">
                                    <p>Approved by : ...........................</p>
                                </div>
                                <div class="col-sm-6" style="text-align: right;">
                                    <p>Received by : ...........................</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`;
                mywindow.document.write(print_content);
                
                mywindow.document.close(); // necessary for IE >= 10
                mywindow.focus(); // necessary for IE >= 10*/

                mywindow.print();
                setTimeout(function(){window.close();}, 10000); 
                return true;
                }
            },false,false,false,true
        );

        
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
        $(document).on('click', '.currency-btn', function(e) 
        {   
            e.preventDefault();
            $('.currency_list').hide();
            currencyVal = $(this).attr('data-value');
            $('#currencyValue').html(currencyVal);
            $(this).parents(".dropdown").find('#btn_currency_text').html($(this).text() + ' <span class="caret" id="btn_currency_text"></span>');
            // $(this).parents(".dropdown").find('.btn').val($(this).data('value'));
            // $(this).parents(".dropdown").find('#btn_currency_text').val($(this).data('value'));
            // $('#btn_currency_text').val($(this).data('value'));
            // alert('1111');
            // $.fn.change_segment_btn(this,$('#btn_currency_text'));
        });

        $(document).on('change', '#dd_paid_to', function(e) 
        {   
            e.preventDefault();
            let paid_to_type  = $('#dd_paid_to').find(':selected').attr('data-type');
            let name          = $("#dd_paid_to option:selected" ).attr('data-name');

            let id_no         = $("#dd_paid_to option:selected" ).attr('data-id_no');
            let acc_no        = $("#dd_paid_to option:selected" ).attr('data-acc_no');
            let bank          = $("#dd_paid_to option:selected" ).attr('data-bank');
            
            if(paid_to_type != 'external' && name != undefined)
            {
                $('#txt_name').val(name);
                $('#txt_id_no').val(id_no);
                $('#txt_acc_no').val(acc_no);
                $('#dd_bank').val(bank).change();
            }
        });

        $('#btn_list_pending_ver').on('click', function(e) 
        {   
            e.preventDefault();
            
            var pending_data    =
            {
                status          : 'waiting_verification',
                view_all        : MODULE_ACCESS.viewall,
                emp_id          : SESSIONS_DATA.emp_id
            };

            $.fn.get_list(false, pending_data);
        });

        $('#btn_list_pending_app').on('click', function(e) 
        {   
            e.preventDefault();
            
            var pending_data    =
            {
                status          : 'waiting_approval',
                view_all        : MODULE_ACCESS.viewall,
                emp_id          : SESSIONS_DATA.emp_id
            };

            $.fn.get_list(false, pending_data);
        });

        $('#btn_reject').click( function(e)
        {
            e.preventDefault();
            
            bootbox.confirm
            ({
                title   : "REJECT VOUCHER",
                message : 'Are you sure want to reject the voucher?<br><br><div class="row"><div class="col-sm-4">Reason:</div><div class="col-sm-8"><textarea class="form-control" id="reject_reason" rows="3"></textarea></div></div>',
                buttons :
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
                        $.fn.update_payment_voucher_status(4);
                    }
                }
            });
        });

        $('#btn_print').click( function(e)
        {
            e.preventDefault();
            $.fn.print_voucher();
        });

        $('#btn_verify').click( function(e)
        {
            e.preventDefault();
            let btn_verify_approve = Ladda.create(this);
            btn_verify_approve.start();
            $.fn.update_payment_voucher_status(2,btn_verify_approve);
        });

        $('#btn_approve').click( function(e)
        {
            e.preventDefault();
            let btn_verify_approve = Ladda.create(this);
            btn_verify_approve.start();
            $.fn.update_payment_voucher_status(3,btn_verify_approve);
        });

        $('#chk_send_verify').change( function(e)
        {   
            e.preventDefault();
            $.fn.send_for_verification();
        });

        $('#btn_reset').click( function(e)
        {
            e.preventDefault();
            $.fn.reset_form('list');
            RECORD_INDEX = 0;
            $.fn.get_list(false);
        });

        $('#btn_search').click( function(e)
        {
            // alert('11111');
            e.preventDefault();
            RECORD_INDEX = 0;
            $.fn.get_list(false);
        });

        $('#btn_new').click( function(e)
        {
            e.preventDefault();
            $.fn.show_hide_form('NEW');
        });

        $('#btn_save').click( function(e)
        {
            e.preventDefault();
            btn_save = Ladda.create(this);
            btn_save.start();
            $.fn.save_edit_form();
        });

        $('#btn_save_payment').click( function(e)
        {
            e.preventDefault();
            btn_save_payment = Ladda.create(this);
            btn_save_payment.start();
            $.fn.save_edit_payment_form();
        });

        $('#btn_payment_cancel').click( function(e)
        {
            $('#new_payment_div').hide();
            $('#btn_new_payment').show();
        });

        $('#btn_back, #btn_cancel').click( function(e)
        {
            e.preventDefault();
            $.fn.show_hide_form('BACK');
            RECORD_INDEX = 0;
            $.fn.get_list(false);
        });

        $('#btn_load_more').click( function(e)
        {
            e.preventDefault();
            $.fn.get_list(true);
        });

        $('#btn_add_remark').click( function(e)
        {
            e.preventDefault();
            btn_save_remarks = Ladda.create(this);
            btn_save_remarks.start();
            $.fn.add_edit_remark();
        });

        $('#btn_search_action').click(function(){
			$('#searchPanel').show();
			$('#btn_search_action').hide();
		});

        $('#btn_close_search').click(function(){
			$('#searchPanel').hide();
			$('#btn_search_action').show();
		});

        // $('#dropdownMenu1').click(function(){
		// 	// $(this).addClass('open');
        //     $('.currency_list').show();
		// });

        $("#dropdownMenu1,.currency_list").mouseover(function(){
            $('.currency_list').show();
        });
       
        $("#dropdownMenu1,.currency_list").mouseleave(function(){
            $('.currency_list').hide();
        });
        

        $(".dropdown-menu li a").click(function(){
            $('.currency_list').hide();
            $(this).parents(".dropdown").find('.btn').html($(this).text() + ' <span class="caret" id="btn_currency_text"></span><i class="fa fa-caret-down"></i>');
            // $(this).parents(".dropdown").find('.btn').val($(this).data('value'));
            $(this).parents(".dropdown").find('#btn_currency_text').val($(this).data('value'));
          });

        $("#dp_date").flatpickr({
            mode:"range",
            altFormat: "d-M-Y",
            dateFormat: "d/m/Y",
            onChange:function(selectedDates){
                var _this=this;
                var dateArr=selectedDates.map(function(date){return _this.formatDate(date,'d/m/Y');});
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


// START of Document initialization
$(document).ready(function()
{
    $.fn.form_load();
});
// END of Document initialization
