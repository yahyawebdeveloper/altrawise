var FORM_STATE = 0;
var RECORD_INDEX = 0;
var SESSIONS_DATA = '';
var btn_save, btn_save_remarks, btn_verify_approve;
var total_selected_files = 0
var SERVICE_NO = '';
var CURRENT_PATH = '../../';

//START - Category of Request for Service
RAISE_INVOICE = 218;
PAYMENT = 219;
LOAN = 220;
ASSET = 221;
//END - Category of Request for Service

//START - Status of Request for Service
STATUS_DRAFT = 222;
SEND_VERIFY_STATUS = 223;
COMPLETE_STATUS = 224;
//END - Status of Request for Service


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
                "order": [[0, "desc"]]
            });
        }
    }
    catch (err)
    {
        $.fn.log_error(arguments.callee.caller, err.message);
    }
};

$.fn.data_table_destroy = function ()
{
    try
    {
        if ($.fn.dataTable.isDataTable('#tbl_list'))
        {
            $('#tbl_list').DataTable().destroy();
        }
    }
    catch (err)
    {
        $.fn.log_error(arguments.callee.caller, err.message);
    }
};


$.fn.get_list = function (is_scroll)
{
    try
    {
        var data =
        {
            category_id: $('#dd_category_search').val(),
            created_by: $('#dd_created_by_search').val(),
            company_id: $('#dd_company_search').val(),
            status_id: $('#dd_status_search').val(),
            status: $('#txt_status').val(),
            view_all: MODULE_ACCESS.viewall,
            start_index: RECORD_INDEX,
            limit: LIST_PAGE_LIMIT,
            is_admin: SESSIONS_DATA.is_admin,
            emp_id: SESSIONS_DATA.emp_id
        };

        if (is_scroll)
        {
            data.start_index = RECORD_INDEX;
        }

        $.fn.fetch_data(
            $.fn.generate_parameter('get_service_request_list', data),
            function(return_data) { 
                
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

    }
    catch (err)
    {
        $.fn.log_error(arguments.callee.caller, err.message);
    }
};


$.fn.populate_list_form = function (data, is_scroll)
{
    try
    {
        if (is_scroll == false)
        {
            $('#tbl_list > tbody').empty();
        }

        //update counts
        $('#total_records').html(data.total_records);
        $('#badge_pending_ver').html(data.pending_verification);
        $('#badge_pending_app').html(data.pending_approval);

        if (data.list.length > 0) // check if there is any data, precaution
        {
            let row = '';
            let data_val = '';
            if (data.rec_index)
            {
                RECORD_INDEX = data.rec_index;
            }
            data = data.list;

            for (var i = 0; i < data.length; i++)
            {
                data_val = escape(JSON.stringify(data[i])); //.replace(/'/,"");

                row += '</tr>';
                row += '<tr id="TR_ROW_' + i + '"  data-value=\'' + data_val + '\'>' +
                    '<td>' + data[i].service_no + '</td>' +
                    '<td>' + data[i].category_name + '</td>' +
                    '<td>' + data[i].created_by + '</td>' +
                    '<td>' + data[i].created_date + '</td>' +
                    '<td>' + data[i].status_name + '</td>';

                row += '<td width="15%">';
               
                row += `<button type="button" class="btn btn-outline-success btn-xs waves-effect waves-light" data-bs-toggle="tooltip" data-bs-placement="top" title="View Comments" data-value="${data_val}" onclick="$.fn.view_remark(decodeURIComponent('${data_val}'))">
                            <i class="far fa-comment-alt"></i>
                        </button>&nbsp;`;
                
                if (MODULE_ACCESS.edit == 1) {

                    row += `<button type="button" class="btn btn-outline-success btn-xs waves-effect waves-light" data-bs-toggle="tooltip" data-bs-placement="top" title="View Details" data-value="${data_val}" onclick="$.fn.populate_detail_form(decodeURIComponent('${data_val}'))">
                            <i class="fas fa-sign-in-alt"></i>
                        </button>`;
                
                }
                if (MODULE_ACCESS.delete == 1) {
                    
                    row += `&nbsp;
                    <button type="button" class="btn btn-outline-danger btn-xs waves-effect waves-light" data-bs-toggle="tooltip" data-bs-placement="top" title="Delete" data-value="${data_val}" onclick="$.fn.delete_service_request(decodeURIComponent('${data_val}'), $(this).closest(\'tr\').prop(\'id\'))">
                            <i class="far fa-trash-alt"></i>
                        </button>`;

                }

                var status = '';
                var verify = '';
                var approve = '';
                var json_approval = JSON.parse(data[i].approvals);

                if (json_approval)
                {
                    if (json_approval.verify.verified == 1)
                    {
                        status = '<div class="pt-1"><i class="fas fa-pen-square" aria-hidden="true">&nbsp;Verified</i><br/></div>';
                    }
                    else
                    {
                        if (MODULE_ACCESS.verify == 1 && data[i].status_id == SEND_VERIFY_STATUS)
                        {
                            verify = '<div class="button-list pt-1"><button type="button" class="btn btn-xs btn-outline-info waves-effect waves-light" data-toggle="tooltip" data-placement="left" data-style="expand-left" data-spinner-color="#000000" title="Verify" onclick="$.fn.verify_approval(unescape( $(this).closest(\'tr\').data(\'value\')),this,1)"><span class="btn-label"><i class="fas fa-pen-square" aria-hidden="true"></i></span><span class="hidden-xs">Verify</span></button></div>';

                        }
                    }
                    if (json_approval.approve.approved == 1)
                    {
                        status += '<i class="fas fa-check-square" aria-hidden="true">&nbsp;Approved</i>';
                    }
                    else
                    {
                        if (MODULE_ACCESS.approve == 1)
                        {
                            approve = '<div class="button-list pt-1"><button type="button" class="btn btn-xs btn-outline-info waves-effect waves-light" data-toggle="tooltip" data-placement="left" data-style="expand-left" data-spinner-color="#000000" title="Approve" onclick="$.fn.verify_approval(unescape( $(this).closest(\'tr\').data(\'value\')),this,2)"><span class="btn-label"><i class="far fa-check-square" aria-hidden="true"></i></span><span class="hidden-xs">Approve</span></button></div>';
                        }
                    }
                }
                else
                {
                    if (MODULE_ACCESS.verify == 1)
                    {
                        if (data[i].status_id == SEND_VERIFY_STATUS)
                        {
                            verify = '<div class="button-list pt-1"><button type="button" class="btn btn-xs btn-outline-info waves-effect waves-light" data-toggle="tooltip" data-placement="left" data-style="expand-left" data-spinner-color="#000000" title="Verify" onclick="$.fn.verify_approval(unescape( $(this).closest(\'tr\').data(\'value\')),this,1)"><span class="btn-label"><i class="fas fa-pen-square" aria-hidden="true"></i></span><span class="hidden-xs">Verify</span></button></div>';
                        }
                    }
                    else if (MODULE_ACCESS.approve == 1)
                    {
                        approve = '<div class="button-list pt-1"><button type="button" class="btn btn-xs btn-outline-info waves-effect waves-light" data-toggle="tooltip" data-placement="left" data-style="expand-left" data-spinner-color="#000000" title="Approve" onclick="$.fn.verify_approval(unescape( $(this).closest(\'tr\').data(\'value\')),this,2)"><span class="btn-label"><i class="far fa-check-square" aria-hidden="true"></i></span><span class="hidden-xs">Approve</span></button></div>';
                    }
                }

                row += '<br>' + status + verify + approve;
                row += '</td>';

                row += '</tr>';

            }
            $('#tbl_list tbody').append(row);
            $('#div_load_more').show();
        }
    }
    catch (err)
    {
        $.fn.log_error(arguments.callee.caller, err.message);
    }
};


$.fn.save_edit_form = function ()
{
    try
    {

        if ($('#detail_form').parsley().validate() == false)
        {
            btn_save.stop();
            return;
        }

        var data = {
            
            service_no : SERVICE_NO,
            category_id         : $('#dd_category').val(),
            employer_id : $('#dd_company').val(),
            emp_id : SESSIONS_DATA.emp_id
        };


        var attachment = [];

        
        if (data.category_id == RAISE_INVOICE) {
            if ($('#invoice_form').parsley().validate() == false) {
                btn_save.stop();
                return;
            }

            data.description = $('#txt_invoice_description').val();
            data.unit_price = $('#txt_invoice_unit_price').val();
            data.qty = $('#txt_invoice_quantity').val();
            data.amount = $('#txt_invoice_amount').val();
            data.sst = $('#dd_invoice_gst_sst').val();
            data.total_amount = $('#txt_invoice_total_amount').val();
            data.bank_account_details = $('#txt_invoice_bank_details').val();
            data.status_id = $('#dd_invoice_status').val();
            data.client_id = $('#dd_invoice_client').val();
            data.contact_person = $('#txt_invoice_contact_person').val();
            data.payment_terms = $('#dd_invoice_payment_terms').val();

        } else if (data.category_id == PAYMENT) {
            if ($('#payment_form').parsley().validate() == false) {
                btn_save.stop();
                return;
            }

            data.description = $('#txt_payment_description').val();
            data.unit_price = $('#txt_payment_unit_price').val();
            data.qty = $('#txt_payment_quantity').val();
            data.amount = $('#txt_payment_amount').val();
            data.sst = $('#dd_payment_gst_sst').val();
            data.total_amount = $('#txt_payment_total_amount').val();
            data.bank_account_details = $('#txt_payment_bank_details').val();
            data.status_id = $('#dd_payment_status').val();
            data.payable_to = $('#txt_payment_payable_to').val();
        }
        else if (data.category_id == LOAN)
        {
            if ($('#loan_form').parsley().validate() == false) {
                btn_save.stop();
                return;
            }

            data.description = $('#txt_loan_description').val();
            data.amount = $('#txt_loan_amount').val();
            data.date_required = $('#date_loan_required').val();
            data.status_id = $('#dd_loan_status').val();
            data.number_of_repayment = $('#txt_loan_repayment_number').val();
            data.each_repayment_amount = $('#txt_loan_repayment_amount').val();
            data.advance_or_loan = $('#txt_loan_advance').val();
            data.balance_advance_or_loan = $('#txt_loan_balance').val();
        }
        else if (data.category_id == ASSET)
        {
            if ($('#asset_form').parsley().validate() == false) {
                btn_save.stop();
                return;
            }

            data.description = $('#txt_asset_description').val();
            data.date_required = $('#date_asset_needed').val();
            data.status_id = $('#dd_asset_status').val();
            data.type_of_assets = $('#dd_asset_type').val();
            data.duration = $('#txt_asset_duration').val();
            data.asset_remark = $('#txt_asset_remark').val();
        }

       
        $.fn.write_data
            (
                $.fn.generate_parameter('add_edit_service_request', data),
                
                function (return_data)
                {

        
                    if (return_data.data)
                    {
                        $.fn.set_edit_form();

                        SERVICE_NO = return_data.data.service_no;

                        var id_doc = '';
                        if (return_data.data.category_id == RAISE_INVOICE)
                        {
                            id_doc = 'doc_invoice';
                        }
                        if (return_data.data.category_id == PAYMENT)
                        {
                            id_doc = 'doc_payment';
                        }
                        if (return_data.data.category_id == LOAN)
                        {
                            id_doc = 'doc_loan';
                        }
                        if (return_data.data.category_id == ASSET)
                        {
                            id_doc = 'doc_asset';
                        }

                        FILE_UPLOAD_PATH = `${MODULE_ACCESS.module_id}/${SERVICE_NO}/`;

                        let attachment_data =
                        {
                            id: '',
                            primary_id: SERVICE_NO,
                            module_id: MODULE_ACCESS.module_id,
                            filename: '',
                            filesize: "0",
                            json_field: {},
                            emp_id: SESSIONS_DATA.emp_id
                        };

                        if ($(`#${id_doc}_files .file-upload.new`).length > 0)
                        {
                            $.fn.upload_file(`${id_doc}_files`, 'service_no', SERVICE_NO,
                                attachment_data, function (total_files, total_success, filename, attach_return_data)
                            {
                                if (total_files == total_success)
                                {   
                                    for (let i = 0; i < attach_return_data.attachment.length; i++)
                                    { 
                                        attach_return_data.attachment[i]['name'] = attach_return_data.attachment[i]['filename'];
                                        attach_return_data.attachment[i]['uuid'] = attach_return_data.attachment[i]['id'];
                                        attach_return_data.attachment[i]['deleteFileParams'] =  JSON.stringify(attach_return_data.attachment[i]);
                                        delete attach_return_data.attachment[i]['filename'];
                                        delete attach_return_data.attachment[i]['id'];
                                    }
                                    $.fn.populate_fileupload(attach_return_data, `${id_doc}_files`, true);
                                }
                            }, false, btn_save);
                        }
                        if (return_data.data.status_id == SEND_VERIFY_STATUS)
                        {
                            $.fn.send_email_verifier_approver_service_request(return_data.data);
                        }
                        $('#h4_primary_no').text('Service Request Number : ' + return_data.data.service_no);
                        $.fn.show_right_success_noty('Data has been recorded successfully');
                    }
                }, false, btn_save
            );

    }
    catch (err)
    {
        $.fn.log_error(arguments.callee.caller, err.message);
    }
};

$.fn.set_edit_form = function (data)
{
    FORM_STATE = 1;
    $('#btn_save').html('<i class="fa fa-edit"></i> Update');
};


$.fn.populate_detail_form = function (data)
{
    try
    {
        var data = JSON.parse(data);
        $.fn.show_hide_form('EDIT');
        $('#h4_primary_no').text('Service Request Number : ' + data.service_no);

        $.fn.fetch_data
            (
                $.fn.generate_parameter('get_service_request_details', { service_no: data.service_no }),
                function (return_data)
                {
                    if (return_data.data.details)
                    {
                        var data = return_data.data.details;

                        SERVICE_NO = data.service_no;
                        $('#dd_category').val(data.category_id).change();
                        $('#dd_company').val(data.employer_id).change();

                        if (data.category_id == RAISE_INVOICE)
                        {
                            $('#txt_invoice_description').val(data.description);
                            $('#txt_invoice_unit_price').val(data.unit_price);
                            $('#txt_invoice_quantity').val(data.qty);
                            $('#txt_invoice_amount').val(data.amount);
                            $('#dd_invoice_gst_sst').val(data.sst).change();
                            $('#txt_invoice_total_amount').val(data.total_amount);
                            $('#txt_invoice_bank_details').val(data.bank_account_details);
                            $('#dd_invoice_client').val(data.client_id).change();
                            $('#txt_invoice_contact_person').val(data.contact_person);
                            $('#dd_invoice_payment_terms').val(data.payment_terms).change();
                            if (data.status_id == COMPLETE_STATUS)
                            {
                                $('#dd_invoice_status').attr('disabled', 'disabled');
                                $('#dd_invoice_status').append('<option value="' + data.status_id + '">' + data.status_name + '</option>');
                            }
                            $('#dd_invoice_status').val(data.status_id).change();
                            
                            for (let i = 0; i < return_data.data.attachment.length; i++)
                            { 
                                return_data.data.attachment[i]['name'] = return_data.data.attachment[i]['filename'];
                                return_data.data.attachment[i]['uuid'] = return_data.data.attachment[i]['id'];
                                return_data.data.attachment[i]['deleteFileParams'] =  JSON.stringify(return_data.data.attachment[i]);
                                delete return_data.data.attachment[i]['filename'];
                                delete return_data.data.attachment[i]['id'];
                            }
                            $.fn.populate_fileupload(return_data.data, 'doc_invoice_files');
                        }
                        else if (data.category_id == PAYMENT)
                        {
                            $('#txt_payment_description').val(data.description);
                            $('#txt_payment_unit_price').val(data.unit_price);
                            $('#txt_payment_quantity').val(data.qty);
                            $('#txt_payment_amount').val(data.amount);
                            $('#dd_payment_gst_sst').val(data.sst).change();
                            $('#txt_payment_total_amount').val(data.total_amount);
                            $('#txt_payment_bank_details').val(data.bank_account_details);
                            $('#txt_payment_payable_to').val(data.payable_to);
                            if (data.status_id == COMPLETE_STATUS)
                            {
                                $('#dd_payment_status').attr('disabled', 'disabled');
                                $('#dd_payment_status').append('<option value="' + data.status_id + '">' + data.status_name + '</option>');
                            }
                            $('#dd_payment_status').val(data.status_id).change();
                            
                            for (let i = 0; i < return_data.data.attachment.length; i++)
                            { 
                                return_data.data.attachment[i]['name'] = return_data.data.attachment[i]['filename'];
                                return_data.data.attachment[i]['uuid'] = return_data.data.attachment[i]['id'];
                                return_data.data.attachment[i]['deleteFileParams'] =  JSON.stringify(return_data.data.attachment[i]);
                                delete return_data.data.attachment[i]['filename'];
                                delete return_data.data.attachment[i]['id'];
                            }
                            $.fn.populate_fileupload(return_data.data, 'doc_payment_files');
                        }
                        else if (data.category_id == LOAN)
                        {
                            $('#txt_loan_description').val(data.description);
                            $('#txt_loan_amount').val(data.amount);
                            $('#date_loan_required').val(data.date_required);
                            $('#txt_loan_repayment_number').val(data.number_of_repayment);
                            $('#txt_loan_repayment_amount').val(data.each_repayment_amount);
                            $('#txt_loan_advance').val(data.advance_or_loan);
                            $('#txt_loan_balance').val(data.balance_advance_or_loan);
                            if (data.status_id == COMPLETE_STATUS)
                            {
                                $('#dd_loan_status').attr('disabled', 'disabled');
                                $('#dd_loan_status').append('<option value="' + data.status_id + '">' + data.status_name + '</option>');
                            }
                            $('#dd_loan_status').val(data.status_id).change();
                            
                            for (let i = 0; i < return_data.data.attachment.length; i++)
                            { 
                                return_data.data.attachment[i]['name'] = return_data.data.attachment[i]['filename'];
                                return_data.data.attachment[i]['uuid'] = return_data.data.attachment[i]['id'];
                                return_data.data.attachment[i]['deleteFileParams'] =  JSON.stringify(return_data.data.attachment[i]);
                                delete return_data.data.attachment[i]['filename'];
                                delete return_data.data.attachment[i]['id'];
                            }
                            $.fn.populate_fileupload(return_data.data, 'doc_loan_files');
                        }
                        else if (data.category_id == ASSET)
                        {
                            $('#txt_asset_description').val(data.description);
                            $('#date_asset_needed').val(data.date_required);
                            $('#dd_asset_type').val(JSON.parse(data.type_of_assets)).change();
                            $('#txt_asset_duration').val(data.duration);
                            $('#txt_asset_remarks').val(data.asset_remark);
                            if (data.status_id == COMPLETE_STATUS)
                            {
                                $('#dd_asset_status').attr('disabled', 'disabled');
                                $('#dd_asset_status').append('<option value="' + data.status_id + '">' + data.status_name + '</option>');
                            }
                            $('#dd_asset_status').val(data.status_id).change();
                            for (let i = 0; i < return_data.data.attachment.length; i++)
                                { 
                                    return_data.data.attachment[i]['name'] = return_data.data.attachment[i]['filename'];
                                    return_data.data.attachment[i]['uuid'] = return_data.data.attachment[i]['id'];
                                    return_data.data.attachment[i]['deleteFileParams'] =  JSON.stringify(return_data.data.attachment[i]);
                                    delete return_data.data.attachment[i]['filename'];
                                    delete return_data.data.attachment[i]['id'];
                                }
                            $.fn.populate_fileupload(return_data.data, 'doc_asset_files');
                        }
                    }
                }, true
            );
    }
    catch (err)
    {
        $.fn.log_error(arguments.callee.caller, err.message);
    }
};


$.fn.delete_service_request = function (data)
{
    try
    {
        var data = JSON.parse(data);
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
                            service_no: data.service_no,
                            emp_id: SESSIONS_DATA.emp_id
                        };
                        $.fn.write_data
                            (
                                $.fn.generate_parameter('delete_service_request', data_delete),
                                function (return_data)
                                {
                                    if (return_data)
                                    {
                                        RECORD_INDEX = 0;
                                        $.fn.get_list(false);
                                        $.fn.show_right_success_noty('Data has been deleted successfully');
                                    }

                                }, false
                            );
                    }
                }
            });
    }
    catch (err)
    {
        $.fn.log_error(arguments.callee.caller, err.message);
    }
};


$.fn.verify_approval = function (data, event, status)
{
    try
    {
        btn_verify_approve = Ladda.create(event);
        btn_verify_approve.start();

        var data = JSON.parse(data);

        var approvals =
        {
            verify: {
                verified: null,
                verified_by: null,
                verified_date: null
            },
            approve: {
                approved: null,
                approved_by: null,
                approved_date: null
            }
        };

        var status_id = null;

        if (status == 1)
        {
            approvals.verify.verified = 1;
            approvals.verify.verified_by = SESSIONS_DATA.emp_id;
            approvals.verify.verified_date = moment().format('YYYY-MM-DD HH:mm:ss');
            status_id = data.status_id;
        }
        if (status == 2)
        {
            // approvals = JSON.parse(data.approvals);
            approvals.approve.approved = 1;
            approvals.approve.approved_by = SESSIONS_DATA.emp_id;
            approvals.approve.approved_date = moment().format('YYYY-MM-DD HH:mm:ss');
            status_id = COMPLETE_STATUS;
        }

        var data_approvals =
        {
            service_no: data.service_no,
            approvals: approvals,
            status_id: status_id,
            module_id: MODULE_ACCESS.module_id,
            emp_id: SESSIONS_DATA.emp_id
        };

        $.fn.write_data
            (
                $.fn.generate_parameter('service_request_verify_approval', data_approvals),
                function (return_data)
                {
                    if (return_data.data)
                    {
                        if (status == 2)
                        {
                            $.fn.add_remark_for_complete(return_data.data);
                        }
                        else
                        {
                            RECORD_INDEX = 0;
                            $.fn.get_list(false);
                        }
                    }
                }, false, btn_verify_approve
            );
    }
    catch (err)
    {
        $.fn.log_error(arguments.callee.caller, err.message);
    }
};


$.fn.view_remark = function (data)
{
    try
    {
        var data = JSON.parse(data);
        var remarks = JSON.parse(data.remarks);
        
        if (remarks) // check if there is any data, precaution
        {
            var row = '';
            var data_val = '';
            $('#tbl_remark_list tbody').html('');

            for (var i = 0; i < remarks.length; i++) {
                data.delete_data = [];
                data.delete_data.push(JSON.stringify(remarks[i]));
                data_val = escape(JSON.stringify(data));

                row += `<tr><td><button type="button" class="btn btn-outline-danger btn-xs waves-effect waves-light" data-bs-toggle="tooltip" data-bs-placement="top" title="Delete data" data-value="${data_val}" onclick="$.fn.delete_remark(decodeURIComponent('${data_val}'))">
                            <i class="far fa-trash-alt"></i>
                        </button></td>`  +
                        '<td>' + remarks[i].remarks         + '</td>' +
                        '<td>' + remarks[i].created_by      + '</td>' +
                        '<td>' + remarks[i].created_date    + '</td>';
                row += '</tr>';
            }
            
            $('#tbl_remark_list tbody').html(row);
            $('.back-to-top-badge').removeClass('back-to-top-badge-visible');
        } else {
            $('#tbl_remark_list > tbody').empty();
        }
        $('#service_request').attr('data-value', JSON.stringify(data));
        $('#remarkListModal').modal('show');
    }
    catch (err)
    {
        $.fn.log_error(arguments.callee.caller, err.message);
    }
};


$.fn.add_edit_remark = function ()
{
    try
    {
        if ($('#remark_form').parsley('validate') == false)
        {
            btn_save_remarks.stop();
            return;
        }
        var data = JSON.parse($('#service_request').attr('data-value'));
        var remarks = JSON.parse(data.remarks);

        var remark_rec =
        {
            remarks: ($('#service_remark').val()).trim(),
            created_by: SESSIONS_DATA.name,
            created_date: moment().format('YYYY-MM-DD HH:mm:ss')
        };

        if (remarks)
        {
            remarks.push(remark_rec);
        }
        else
        {
            remarks = [];
            remarks.push(remark_rec);
        }

        var data_service =
        {
            service_no: data.service_no,
            remarks: remarks,
            emp_id: SESSIONS_DATA.emp_id
        };

        $.fn.write_data
            (
                $.fn.generate_parameter('service_request_add_edit_remark', data_service),
                function (return_data)
                {
                    if (return_data.data)
                    {
                        RECORD_INDEX = 0;
                        $.fn.get_list(false);
                        $.fn.reset_form('remark_list_modal');
                        $.fn.show_right_success_noty('Data has been recorded successfully');
                    }

                }, false, btn_save_remarks
            );

        $('#remarkListModal').modal('hide');
    }
    catch (err)
    {
        $.fn.log_error(arguments.callee.caller, err.message);
    }
};


$.fn.add_remark_for_complete = function (data)
{
    try
    {
        var remarks = JSON.parse(data.remarks);

        var remark_rec =
        {
            remarks: data.remarks_new,
            created_by: SESSIONS_DATA.name,
            created_date: moment().format('YYYY-MM-DD HH:mm:ss')
        };

        if (remarks)
        {
            remarks.push(remark_rec);
        }
        else
        {
            remarks = [];
            remarks.push(remark_rec);
        }

        var data =
        {
            service_no: data.service_no,
            remarks: remarks,
            emp_id: SESSIONS_DATA.emp_id
        };

        $.fn.write_data
            (
                $.fn.generate_parameter('service_request_add_edit_remark', data),
                function (return_data)
                {
                    if (return_data.data)
                    {
                        RECORD_INDEX = 0;
                        $.fn.get_list(false);
                    }

                }, false
            );
    }
    catch (err)
    {
        $.fn.log_error(arguments.callee.caller, err.message);
    }
};


$.fn.delete_remark = function (data)
{
    try
    {
        var data = JSON.parse(data);
        var remarks = JSON.parse(data.remarks);
        var delete_data = JSON.parse(data.delete_data);
        remarks = remarks.filter(obj => obj.remarks != delete_data.remarks);

        var data_service =
        {
            service_no: data.service_no,
            remarks: remarks,
            emp_id: SESSIONS_DATA.emp_id
        };

        $.fn.write_data
            (
                $.fn.generate_parameter('service_request_add_edit_remark', data_service),
                function (return_data)
                {
                    if (return_data.data)
                    {
                        RECORD_INDEX = 0;
                        $.fn.get_list(false);
                        $.fn.reset_form('remark_list_modal');
                        $.fn.show_right_success_noty('Data has been deleted successfully');
                    }

                }, false
            );

        $('#remarkListModal').modal('hide');
    }
    catch (err)
    {
        $.fn.log_error(arguments.callee.caller, err.message);
    }
};


$.fn.reset_form = function (form)
{
    try
    {
        FORM_STATE = 0;

        if (form == 'list')
        {
            $('#dd_category_search').val('').change();
            $('#dd_created_by_search').val('').change();
            $('#dd_company_search').val('').change();
            $('#dd_status_search').val('').change();

            $('#txt_status').val('');
        }
        else if (form == 'form')
        {
            SERVICE_NO = '';
            $('#dd_category').val('').change();
            $('#dd_company').val('').change();

            $('#dd_invoice_client').val('').change();
            $('#txt_invoice_contact_person').val('');
            $('#txt_invoice_description').val('');
            $('#txt_invoice_bank_details').val('');
            $('#txt_invoice_unit_price').val('');
            $('#txt_invoice_quantity').val('');
            $('#txt_invoice_amount').val('');
            $('#dd_invoice_gst_sst').val('0').change();
            $('#txt_invoice_total_amount').val('');
            $('#dd_invoice_payment_terms').val('').change();
            $('#dd_invoice_status').val(STATUS_DRAFT).change();
            $('#dd_invoice_status option[value="' + COMPLETE_STATUS + '"]').remove();
            $('#dd_invoice_status').removeAttr('disabled');

            $('#txt_payment_description').val('');
            $('#txt_payment_bank_details').val('');
            $('#txt_payment_unit_price').val('');
            $('#txt_payment_quantity').val('');
            $('#txt_payment_amount').val('');
            $('#dd_payment_gst_sst').val('0').change();
            $('#txt_payment_total_amount').val('');
            $('#txt_payment_payable_to').val('');
            $('#dd_payment_status').val(STATUS_DRAFT).change();
            $('#dd_payment_status option[value="' + COMPLETE_STATUS + '"]').remove();
            $('#dd_payment_status').removeAttr('disabled');

            $('#txt_loan_description').val('');
            $('#txt_loan_amount').val('');
            $('#txt_loan_repayment_number').val('');
            $('#txt_loan_repayment_amount').val('');
            $('#txt_loan_advance').val('');
            $('#txt_loan_balance').val('');
            $('#date_loan_required').val('');
            $('#dd_loan_status').val(STATUS_DRAFT).change();
            $('#dd_loan_status option[value="' + COMPLETE_STATUS + '"]').remove();
            $('#dd_loan_status').removeAttr('disabled');

            $('#dd_asset_type').val('').change();
            $('#txt_asset_duration').val('');
            $('#txt_asset_description').val('');
            $('#txt_asset_remarks').val('');
            $('#date_asset_needed').val('');
            $('#dd_asset_status').val(STATUS_DRAFT).change();
            $('#dd_asset_status option[value="' + COMPLETE_STATUS + '"]').remove();
            $('#dd_asset_status').removeAttr('disabled');

            $('#invoice_form').parsley().destroy();
            $('#payment_form').parsley().destroy();
            $('#loan_form').parsley().destroy();
            $('#asset_form').parsley().destroy();
        }
        else if (form == 'remark_list_modal')
        {
            $('#service_remark').val('');
            $('#remark_form').parsley().destroy();
        }
    }
    catch (err)
    {
        $.fn.log_error(arguments.callee.caller, err.message);
    }
};

$.fn.show_hide_form = function (form_status)
{
    $.fn.reset_form('form');
    if (form_status == 'NEW')
    {
        $('#list_div').hide(400);
        $('#new_div').show(400);
        $('#h4_primary_no').text('');
        $('#btn_save').html('<i class="fa fa-check"> </i> Save');
        $.fn.set_validation_form();
        $.fn.init_upload_file();
    }
    else if (form_status == 'EDIT')
    {
        $('#list_div').hide(400);
        $('#new_div').show(400);
        $.fn.set_validation_form();
        $.fn.set_edit_form();
        $.fn.init_upload_file();
    }
    else if (form_status == 'BACK')
    {
        $('#list_div').show(400);
        $('#new_div').hide(400);
    }

    if (MODULE_ACCESS.create == 0)
    {
        $('#btn_new').hide();
        $('#btn_save').hide();
        $('#btn_cancel').hide();
    }
    else
    {
        $('#btn_new').show();
        $('#btn_save').show();
        $('#btn_cancel').show();
    }
};

$.fn.show_hide_component = function ()
{
    var category = $('#dd_category').val();
    var company = $('#dd_company').val();

    $('#div_invoice').hide();
    $('#div_payment').hide();
    $('#div_loan').hide();
    $('#div_asset').hide();
    $('#div_button').hide();

    if (category == RAISE_INVOICE && company != '')
    {
        $('#div_invoice').show();
        $('#div_button').show();
    }
    else if (category == PAYMENT && company != '')
    {
        $('#div_payment').show();
        $('#div_button').show();
    }
    else if (category == LOAN && company != '')
    {
        $('#div_loan').show();
        $('#div_button').show();
    }
    else if (category == ASSET && company != '')
    {
        $('#div_asset').show();
        $('#div_button').show();
    }
};

$.fn.calculate_value = function (option)
{
    if (option == 'AMOUNT_INVOICE')
    {
        var unit_price = $('#txt_invoice_unit_price').val();
        var quantity = $('#txt_invoice_quantity').val();
        var amount = parseFloat(unit_price) * parseFloat(quantity);

        $('#txt_invoice_amount').val(amount.toFixed(2));
    }
    if (option == 'TOTAL_INVOICE')
    {
        var amount = $('#txt_invoice_amount').val();
        var gst = $('#dd_invoice_gst_sst').val();
        var total_amont = parseFloat(amount) + ((parseFloat(amount) * parseFloat(gst)) / 100);

        $('#txt_invoice_total_amount').val(total_amont.toFixed(2));
    }

    if (option == 'AMOUNT_PAYMENT')
    {
        var unit_price = $('#txt_payment_unit_price').val();
        var quantity = $('#txt_payment_quantity').val();
        var amount = parseFloat(unit_price) * parseFloat(quantity);

        $('#txt_payment_amount').val(amount.toFixed(2));
    }
    if (option == 'TOTAL_PAYMENT')
    {
        var amount = $('#txt_payment_amount').val();
        var gst = $('#dd_payment_gst_sst').val();
        var total_amont = parseFloat(amount) + ((parseFloat(amount) * parseFloat(gst)) / 100);

        $('#txt_payment_total_amount').val(total_amont.toFixed(2));
    }
};

$.fn.prepare_form = function ()
{
    try
    {
        $('#date_loan_required,#date_asset_needed').flatpickr({  
            altInput: true,
            altFormat: "d-m-Y",
            dateFormat: "d-m-Y",
        });

        $('.populate').select2({ tags: true, tokenSeparators: [",", " "] });
        $('.tooltips').tooltip();

        $.fn.set_validation_form();

        if (MODULE_ACCESS.create == 0)
        {
            $('#btn_new').hide();
            $('#btn_save').hide();
            $('#btn_cancel').hide();
        }

        if (MODULE_ACCESS.verify == 0)
        {
            $('#btn_list_pending_ver').hide();
        }

        if (MODULE_ACCESS.approve == 0)
        {
            $('#btn_list_pending_app').hide();
        }
        $.fn.get_service_request_search_dropdown();
        $.fn.get_list();
    }
    catch (err)
    {
        $.fn.log_error(arguments.callee.caller, err.message);
    }
};

$.fn.set_validation_form = function ()
{

    $('#invoice_form,#payment_form,#loan_form,#asset_form').parsley(
        {
            classHandler: function(parsleyField) {              
                return parsleyField.$element.closest(".errorContainer");
            },
            errorsContainer: function(parsleyField) {              
                return parsleyField.$element.closest(".errorContainer");
            },
        }
    );

    $('#invoice_form').parsley
        ({
            successClass: 'has-success',
            errorClass: 'has-error',
            errors:
            {
                classHandler: function (el)
                {
                    return $(el).closest('.form-group');
                },
                container: function (el)
                {
                    if ($(el).attr('id') == 'dd_invoice_client' || $(el).attr('id') == 'dd_invoice_payment_terms')
                    {
                        return $(el).parents('.form-group').find('.select2-container');
                    }
                },
                errorsWrapper: '<ul class=\"help-block list-unstyled\"></ul>',
                errorElem: '<li></li>'
            }
        });

    $('#payment_form').parsley
        ({
            successClass: 'has-success',
            errorClass: 'has-error',
            errors:
            {
                classHandler: function (el)
                {
                    return $(el).closest('.form-group');
                },
                errorsWrapper: '<ul class=\"help-block list-unstyled\"></ul>',
                errorElem: '<li></li>'
            }
        });

    $('#loan_form').parsley
        ({
            successClass: 'has-success',
            errorClass: 'has-error',
            errors:
            {
                classHandler: function (el)
                {
                    return $(el).closest('.form-group');
                },
                errorsWrapper: '<ul class=\"help-block list-unstyled\"></ul>',
                errorElem: '<li></li>'
            }
        });

    $('#asset_form').parsley
        ({
            successClass: 'has-success',
            errorClass: 'has-error',
            errors:
            {
                classHandler: function (el)
                {
                    return $(el).closest('.form-group');
                },
                errorsWrapper: '<ul class=\"help-block list-unstyled\"></ul>',
                errorElem: '<li></li>'
            }
        });

    $('#remark_form').parsley
        ({
            successClass: 'has-success',
            errorClass: 'has-error',
            errors:
            {
                classHandler: function (el)
                {
                    return $(el).closest('.form-group');
                },
                errorsWrapper: '<ul class=\"help-block list-unstyled\"></ul>',
                errorElem: '<li></li>'
            }
        });
}

$.fn.form_load = function ()
{
    try
    {
        $.fn.prepare_form();
        $.fn.bind_command_events();
    }
    catch (err)
    {
        $.fn.log_error(arguments.callee.caller, err.message);
    }
};

$.fn.bind_command_events = function ()
{
    $.fn.get_service_add_request_dropdown();
    try
    {
        $('#dd_category, #dd_company').change(function (e)
        {
            $.fn.show_hide_component();
        });

        $('#btn_reset').click(function (e)
        {
            e.preventDefault();
            $.fn.reset_form('list');
            RECORD_INDEX = 0;
            $.fn.get_list(false);
        });

        $('#btn_search').click(function (e)
        {
            e.preventDefault();
            RECORD_INDEX = 0;
            $.fn.get_list(false);
        });

        $('#btn_new').click(function (e)
        {
            e.preventDefault();
            $.fn.show_hide_form('NEW');
        });

        $('#btn_save').click(function (e)
        {
            e.preventDefault();
            btn_save = Ladda.create(this);
            btn_save.start();
            $.fn.save_edit_form();

        });

        $('#btn_back, #btn_cancel').click(function (e)
        {
            e.preventDefault();
            $.fn.show_hide_form('BACK');
            RECORD_INDEX = 0;
            $.fn.get_list(false);
        });

        $('#btn_load_more').click(function (e)
        {
            e.preventDefault();
            $.fn.get_list(true);
        });

        $('#btn_add_remark').click(function (e)
        {
            e.preventDefault();
            btn_save_remarks = Ladda.create(this);
            btn_save_remarks.start();
            $.fn.add_edit_remark();
        });


        $('#txt_invoice_unit_price, #txt_invoice_quantity').keyup(function (e)
        {
            $.fn.calculate_value('AMOUNT_INVOICE');
            $.fn.calculate_value('TOTAL_INVOICE');
        });

        $('#dd_invoice_gst_sst').change(function (e)
        {
            $.fn.calculate_value('TOTAL_INVOICE');
        });

        $('#txt_payment_unit_price, #txt_payment_quantity').keyup(function (e)
        {
            $.fn.calculate_value('AMOUNT_PAYMENT');
            $.fn.calculate_value('TOTAL_PAYMENT');
        });

        $('#dd_payment_gst_sst').change(function (e)
        {
            $.fn.calculate_value('TOTAL_PAYMENT');
        });

        $('#btn_list_pending_ver').on('click', function (e) 
        {
            e.preventDefault();

            $.fn.reset_form('list');
            RECORD_INDEX = 0;
            $('#txt_status').val('verify');

            $.fn.get_list(false);
        });

        $('#btn_list_pending_app').on('click', function (e) 
        {
            e.preventDefault();

            $.fn.reset_form('list');
            RECORD_INDEX = 0;
            $('#txt_status').val('approve');

            $.fn.get_list(false);
        });

        $('#btn_search_action').click(function(){
			$('#searchPanel').show();
			$('#btn_search_action').hide();
		});

        $('#btn_close_search').click(function(){
			$('#searchPanel').hide();
			$('#btn_search_action').show();
		});

    }
    catch (err)
    {
        $.fn.log_error(arguments.callee.caller, err.message);
    }
};

$.fn.init_upload_file = function ()
{
    $.fn.reset_upload_form();

    $.fn.intialize_fileupload('doc_invoice', 'doc_invoice_files');
    $.fn.intialize_fileupload('doc_payment', 'doc_payment_files');
    $.fn.intialize_fileupload('doc_loan', 'doc_loan_files');
    $.fn.intialize_fileupload('doc_asset', 'doc_asset_files');
};

$.fn.reset_upload_form = function ()
{
    $('#doc_invoice').html('');
    $('#doc_payment').html('');
    $('#doc_loan').html('');
    $('#doc_asset').html('');
};

$.fn.upload_file_bk = function (param)
{
    try
    {
        let total_files = total_selected_files;
        let total_completed = 0;
        let total_succeed = 0;
        let failed_file = [];

        var id_doc = '';
        if (param.category_id == RAISE_INVOICE)
        {
            id_doc = 'document_invoice';
        }
        if (param.category_id == PAYMENT)
        {
            id_doc = 'document_payment';
        }
        if (param.category_id == LOAN)
        {
            id_doc = 'document_loan';
        }
        if (param.category_id == ASSET)
        {
            id_doc = 'document_asset';
        }

        $('#' + id_doc).data('service_no', param.service_no);

        $('#' + id_doc + ' .file-upload.new').each(function (index)
        {

            let data = $(this).data();

            if (data.submit)
            {
                data.submit()
                    .success(function (result, textStatus)
                    {
                        total_succeed += 1;
                        //                        console.log(result);
                        // if (callback) callback(result.files[0].name);
                    })
                    .complete(function (result, textStatus)
                    {
                        total_completed += 1;
                        if (total_files == total_completed)
                        {
                            if (param.status_id == SEND_VERIFY_STATUS)
                            {
                                $.fn.send_email_verifier_approver_service_request(param);
                            }
                        }
                        //                        console.log(result);
                    })
                    .error(function (result, textStatus)
                    {
                        failed_file.push(result);
                    });
            }
        });

    } catch (e)
    {
        $.fn.log_error(arguments.callee.caller, e.message);
    }
};

$.fn.send_email_verifier_approver_service_request = function (param)
{
    try
    {
        var data =
        {
            service_no: param.service_no,
            module_id: MODULE_ACCESS.module_id,
            emp_id: SESSIONS_DATA.emp_id
        };

        $.fn.write_data
            (
                $.fn.generate_parameter('send_email_verifier_approver_service_request', data),
                function (return_data)
                {
                    if (return_data.data)
                    {
                        $.fn.show_right_success_noty('Email has been sent successfully');
                    }

                }, false
            );
    }
    catch (e)
    {
        $.fn.log_error(arguments.callee.caller, e.message);
    }
};

$.fn.get_service_add_request_dropdown = function()
{
    try
    {   
        let lead_access = $.fn.get_accessibility(6); //stake holders
        let data    =
        {   
            emp_id   : SESSIONS_DATA.emp_id,
            view_all : MODULE_ACCESS.viewall,
            lead_access_view_all : lead_access.viewall,
            lead_access_view     : lead_access.view
        };
        
        $.fn.fetch_data
        ( 
            $.fn.generate_parameter('get_service_request_search_dropdown', data),
            function(return_data)
            {  
                if (return_data.code == 0)
                {  
                    
                    $.fn.populate_dd_values('dd_category', return_data.data);
                    $.fn.populate_dd_values('dd_company', return_data.data);
                    $.fn.populate_dd_values('dd_invoice_client', return_data.data);
                    $.fn.populate_dd_values('dd_invoice_status', return_data.data);
                    $.fn.populate_dd_values('dd_invoice_payment_terms', return_data.data);
                    $.fn.populate_dd_values('dd_asset_type', return_data.data);
                    
                    
                }
            },true
        );
    }
    catch(err)
    {
        $.fn.log_error(arguments.callee.caller,err.message);
    }
};

$.fn.get_service_request_search_dropdown = function()
{
    
    try
    {   
        let lead_access = $.fn.get_accessibility(6); //stake holders
        let data    =
        {   
            emp_id   : SESSIONS_DATA.emp_id,
            view_all : MODULE_ACCESS.viewall,
            lead_access_view_all : lead_access.viewall,
            lead_access_view     : lead_access.view
        };
        
        $.fn.fetch_data
        ( 
            $.fn.generate_parameter('get_service_request_search_dropdown', data),
            function(return_data)
            {  
                if (return_data.code == 0)
                {  
                  
                    $.fn.populate_dd_values('dd_category_search', return_data.data);
                    $.fn.populate_dd_values('dd_created_by_search', return_data.data);
                    $.fn.populate_dd_values('dd_company_search', return_data.data);
                    $.fn.populate_dd_values('dd_status_search', return_data.data);
                    
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
        if(element_id != 'dd_asset_type') {
            $('#'+element_id).append(`<option value="">Please Select</option>`);
        }
        
        
        if(element_id == 'dd_category_search') {
            for (let item of dd_data.category) {
                
                $('#dd_category_search').append(`<option 
                                                 data-type="category" 
                                                 value="${item.id}">${item.descr}
                                                 </option>`
                                                );
            }
        }

        if(element_id == 'dd_category') {
            for (let item of dd_data.category) {
                
                $('#dd_category').append(`<option 
                                                 data-type="category" 
                                                 value="${item.id}">${item.descr}
                                                 </option>`
                                                );
            }
        }
            

            
        if(element_id == 'dd_company_search') {
            for (let item of dd_data.employer) {
            
                $('#dd_company_search').append(`<option 
                                                    data-type="employer" 
                                                    value="${item.id}">${item.employer_name}
                                                    </option>`
                                                );
            }
        }

        if(element_id == 'dd_company') {
            for (let item of dd_data.employer) {
            
                $('#dd_company').append(`<option 
                                                    data-type="employer" 
                                                    value="${item.id}">${item.employer_name}
                                                    </option>`
                                                );
            }
        }
            

        if(element_id == 'dd_status_search') {
            for (let item of dd_data.status) {
            
                $('#dd_status_search').append(`<option 
                                                    data-type="status" 
                                                    value="${item.id}">${item.descr}
                                                    </option>`
                                                );
            }
        }

        if(element_id == 'dd_created_by_search') {
            for (let item of dd_data.created_by) {
            
                $('#dd_created_by_search').append(`<option 
                                                    data-type="status" 
                                                    value="${item.id}">${item.name}
                                                    </option>`
                                                );
            }
        }
        
        if(element_id == 'dd_invoice_client') {
            for (let item of dd_data.client) {
                
                $('#dd_invoice_client').append(`<option 
                                                 data-type="client" 
                                                 value="${item.id}">${item.name}
                                                 </option>`
                                                );
            }
        }

        if(element_id == 'dd_invoice_status' || element_id == 'dd_payment_status' || element_id == 'dd_loan_status' || element_id == 'dd_asset_status') {
            for (let item of dd_data.status) {
                
                $('#dd_invoice_status,#dd_payment_status,#dd_loan_status,#dd_asset_status').append(`<option 
                                                 data-type="status" 
                                                 value="${item.id}">${item.descr}
                                                 </option>`
                                                );
            }
        }

        if(element_id == 'dd_invoice_payment_terms') {
            for (let item of dd_data.payment_term) {
                
                $('#dd_invoice_payment_terms').append(`<option 
                                                 data-type="status" 
                                                 value="${item.id}">${item.descr}
                                                 </option>`
                                                );
            }
        }

        if(element_id == 'dd_asset_type') {
            for (let item of dd_data.asset_type) {
                
                $('#dd_asset_type').append(`<option 
                                                 data-type="status" 
                                                 value="${item.id}">${item.descr}
                                                 </option>`
                                                );
            }
        }

        
    }
    catch(err)
    {
        $.fn.log_error(arguments.callee.caller,err.message);
    }
};


// START of Document initialization
$(document).ready(function ()
{
    $.fn.form_load();
});
// END of Document initialization
