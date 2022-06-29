var FORM_STATE = 0;
var RECORD_INDEX = 0;
//var SESSIONS_DATA = '';
var btn_save, btn_save_remarks, btn_verify_approve;
var total_selected_files = 0
DOC_NO = '';
STATUS_DRAFT = '204';
SEND_VERIFY_STATUS = '213';
var APPROVALS = '';
var APPROVALS_SELECTED = '';
COMPLETE_STATUS = '205';
CURRENT_PATH = '../../';
var CLIENTS_MODULE_ACCESS = '';
var flatpickrdocument_date = "";
var flatpickrnotify_date = "";
var flatpickrfrom_date = "";
var flatpickrto_date = "";
CLIENT_ID = '';
var FILE_UPLOAD_PATH = ''; //file upload mandatory field


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

$.fn.get_list = function (is_scroll, pending_data = false)
{
    try
    { 
        if (pending_data)
        {
            var data = pending_data;
        }
        else
        {
            var data =
            {
                client_id: $('#dd_client_search').val(),
                created_by: $('#dd_created_by_search').val(),
                type_id: $('#dd_category_search').val(),
                status_id: $('#dd_status_search option:selected').val(),
                from_date: $('#from_search_date').val(),
                to_date: $('#to_search_date').val(),
                user_doc_no: $('#txt_user_doc_search').val(),
                view_all: MODULE_ACCESS.viewall,
                start_index: RECORD_INDEX,
                limit: LIST_PAGE_LIMIT,
                is_admin: SESSIONS_DATA.is_admin,
                emp_id: SESSIONS_DATA.emp_id
            };
        }

        if (is_scroll)
        {
            data.start_index = RECORD_INDEX;
        }

            $.fn.fetch_data(
                $.fn.generate_parameter('get_document_archiving_list', data),
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
            )
            ;
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
        if (data) {
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
                    data_val = encodeURIComponent(JSON.stringify(data[i])); //.replace(/'/,"");
                    row += `<tr id="TR_ROW_`+i+`"  data-value='${data_val}'>'
                    <td>${data[i].doc_no}</td>
                    <td>${data[i].user_doc_no ? data[i].user_doc_no : '-'}</td>
                    <td>${data[i].doc_date}</td>
                    <td>${data[i].client_name}</td>
                    <td>${data[i].doc_type}</td>
                    <td>${data[i].created_by}</td>
                    <td>${data[i].status_name}</td>`;

                    row += '<td width="15%">';
                    row += '<a class="btn btn-xs btn-primary waves-effect waves-light" data-toggle="tooltip" data-placement="left" title="View Comments" href="javascript:void(0)" data-value=\'' + data_val + '\' onclick="$.fn.view_remark(unescape($(this).attr(\'data-value\')))"><i class="fas fa-external-link-alt"></i></a>';
                    if (MODULE_ACCESS.edit == 1)
                    {
                        row += '&nbsp;&nbsp;<a class="btn btn-xs btn-success waves-effect waves-light" data-toggle="tooltip" data-placement="left" title="View Details" href="javascript:void(0)" data-value=\'' + data_val + '\' onclick="$.fn.populate_detail_form(unescape($(this).attr(\'data-value\')))"><i class="fas fa-sign-in-alt"></i></a>';
    
                    }
                    if (MODULE_ACCESS.delete == 1)
                    {
                        row += '&nbsp;&nbsp;<a class="btn btn-xs btn-danger waves-effect waves-light" data-toggle="tooltip" data-placement="left" title="View Details" href="javascript:void(0)" data-value=\'' + data_val + '\' onclick="$.fn.delete_document_archiving(unescape($(this).attr(\'data-value\')))"><i class="fas fa-trash-alt"></i></a>';
                    }

                    var status = '';
                    var verify = '';
                    var approve = '';
                    var json_approval = JSON.parse(data[i].approvals);

                    if (json_approval)
                    { 
                        if (json_approval.verify.verified == 1)
                        {
                            status = '<div class="mt-1 badge bg-soft-info text-info"><i class="fas fa-pen-square" aria-hidden="true">&nbsp;Verified</i><br/></div>';
                        }
                        else
                        {
                            if (MODULE_ACCESS.verify == 1 && data[i].status_id == SEND_VERIFY_STATUS)
                            {
                                verify = '<div class="button-list pt-1"><button type="button" class="btn btn-xs btn-info waves-effect waves-light" data-toggle="tooltip" data-placement="left" data-style="expand-left" data-spinner-color="#000000" title="Verify" onclick="$.fn.verify_approval(unescape( $(this).closest(\'tr\').data(\'value\')),this,1)"><span class="btn-label"><i class="fas fa-pen-square" aria-hidden="true"></i></span><span class="hidden-xs">Verify</span></button></div>';
                            }
                        }
                        if (json_approval.approve.approved == 1)
                        {
                            status += '<br><div class="badge bg-soft-success text-success"><i class="fas fa-check-square" aria-hidden="true">&nbsp;Approved</i></div>';
                        }
                        else
                        {
                            if (MODULE_ACCESS.approve == 1)
                            {
                                approve = '<div class="button-list pt-1"><button type="button" class="btn btn-xs btn-info waves-effect waves-light" data-toggle="tooltip" data-placement="left" data-style="expand-left" data-spinner-color="#000000" title="Approve" onclick="$.fn.verify_approval(unescape( $(this).closest(\'tr\').data(\'value\')),this,2)"><span class="btn-label"><i class="far fa-check-square" aria-hidden="true"></i></span><span class="hidden-xs">Approve</span></button></div>';
                            }
                        }
                    }
                    else
                    {
                        if (MODULE_ACCESS.verify == 1)
                        {
                            if (data[i].status_id == SEND_VERIFY_STATUS)
                            {
                                verify = '<div class="button-list pt-1"><button type="button" class="btn btn-xs btn-info waves-effect waves-light" data-toggle="tooltip" data-placement="left" data-style="expand-left" data-spinner-color="#000000" title="Verify" onclick="$.fn.verify_approval(unescape( $(this).closest(\'tr\').data(\'value\')),this,1)"><span class="btn-label"><i class="fas fa-pen-square" aria-hidden="true"></i></span><span class="hidden-xs">Verify</span></button></div>';
                            }
                        }
                        else if (MODULE_ACCESS.approve == 1)
                        {
                            approve = '<div class="button-list pt-1"><button type="button" class="btn btn-xs btn-info waves-effect waves-light" data-toggle="tooltip" data-placement="left" data-style="expand-left" data-spinner-color="#000000" title="Approve" onclick="$.fn.verify_approval(unescape( $(this).closest(\'tr\').data(\'value\')),this,2)"><span class="btn-label"><i class="far fa-check-square" aria-hidden="true"></i></span><span class="hidden-xs">Approve</span></button></div>';
                        }
                    }

                    row += '<br>' + status + verify + approve;

                }
                $('#tbl_list tbody').append(row);
                $('#div_load_more').show();
            }
        }
    }
    catch (err)
    {// console.log(err);
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


        if ($('#files .file-upload.new').length == 0)
		{
			$.fn.show_right_error_noty('Please select file to upload');
			btn_save.stop();
			return;
		}
        else
        {   
            let status = true;
            let only_pdf = false;
            var extensions = 'pdf,doc,docx,xls,xlsx,txt';
            $('#files .file-upload.new').each(function () 
            {
                let data 	= $(this).data('data');
                let file_name = data.files[0].name;
                
                let fileExtension = file_name.split('.').pop();
                let extensions_array = extensions.split(',');
                if($.inArray( fileExtension, extensions_array ) == -1)
                {
                    status = false;
                }
                else
                {
                    status = true;
                }
            });

            if(status == false)
            {
                $.fn.show_right_error_noty('Please select one of these files only - ' + extensions);
                btn_save.stop();
                return;
            }

            if(only_pdf == true) {
                $.fn.show_right_error_noty('For Digital Verification only pdf files can be selected');
                btn_save.stop();
                return;
            }
        }
        var attachment = [];
        
        var data =
        {
            document_no: DOC_NO,
            document_date: $('#document_date').val(),
            type_id: $('#dd_type').val(),
            client_id: $('#dd_client').val(),
            employer_id: $('#dd_company').val(),
            from_date: $('#from_date').val(),
            to_date: $('#to_date').val(),
            doc_type: $('#dd_doc_type').val(),
            notify: $('#dd_notify').val(),
            notify_date: $('#notify_date').val(),
            notify_email: ($('#dd_notify_email').val()) ? $('#dd_notify_email').val() : '',
            status_id: $('#dd_status').val(),
            remark: $('#txt_remark').val(),
            location: $('#txt_location').val(),
            emp_id: SESSIONS_DATA.emp_id,
            attachment: attachment/* ,
            json_field: json_field */
        };

        $.fn.write_data
            (
                $.fn.generate_parameter('add_edit_document_archiving', data),
                function (return_data)
                {
                    if (return_data.data)
                    { 
                        $.fn.set_edit_form();

                        DOC_NO = return_data.data.document_no;
                        FILE_UPLOAD_PATH = `../files/${MODULE_ACCESS.module_id}/${DOC_NO}/`;

                        let attachment_data =
                        {
                            id: '',
                            primary_id: DOC_NO,
                            module_id: MODULE_ACCESS.module_id,
                            filename: '',
                            filesize: "0",
                            json_field: {},
                            emp_id: SESSIONS_DATA.emp_id
                        };
                     console.log(attachment_data);
                        if ($('#files .file-upload.new').length > 0)
                        {
                           /*  $.fn.upload_file(`files`, 'outbound_no', DOC_NO,
                                attachment_data, function (total_files, total_success, filename, attach_return_data)
                            {
                                if (total_files == total_success)
                                {
                                    $.fn.populate_fileupload(attach_return_data, `files`, true);
                                }
                            }, false, btn_save); */
                        }
                        else
                        {
                            if (return_data.data.status_id == SEND_VERIFY_STATUS)
                            {
                                $.fn.send_email_verifier_approver_archiving(return_data.data);
                            }
                        }

                     $('#h4_primary_no').text('Document Number : ' + return_data.data.document_no);
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


function GetDate(str) {	
    	
    var arr = str.split('-');	
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun','Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']	
    var i = 1; 	
    for (i; i <= months.length; i++) { 	
        if (months[i] == arr[1])	
        {                   	
            break;                     	
        } 	
    }	
                	
    var formatddate = (i+1)  + '-' + arr[0] + '-' + arr[2]; 
    return formatddate;	
}


$.fn.populate_detail_form = function (data)
{
    try
    {
        var data = JSON.parse(data);
        $.fn.show_hide_form('EDIT');
        $('#h4_primary_no').text('Document Number : ' + data.doc_no);

        $.fn.fetch_data
            (
                $.fn.generate_parameter('get_document_archiving_details', { document_no: data.doc_no }),
                function (return_data)
                {
                    if (return_data.data.details)
                    {
                        var data = return_data.data.details;

                        DOC_NO = data.doc_no;

                        if (data.type_id)
                        {
                            $('#dd_type').val(data.type_id).change();
                        }
                        else
                        {
                            $('#dd_type').val($('#dd_type option:eq(1)').val()).change();
                        }

                        if (data.client_id)
                        {
                            CLIENT_ID = data.client_id;
                        }

						if (data.doc_date) {
						  var retDate = GetDate(data.doc_date);
						  var dateObject = new Date(retDate);
						  var retDate = dateObject.toString();
						  flatpickrdocument_date.setDate(dateObject);
						}
						if (data.from_date) {
						  var retDate = GetDate(data.from_date);
						  var dateObject = new Date(retDate);
						  var retDate = dateObject.toString();
						  flatpickrfrom_date.setDate(dateObject);
						}
						if (data.to_date) {
						  var retDate = GetDate(data.to_date);
						  var dateObject = new Date(retDate);
						  var retDate = dateObject.toString();
						  flatpickrto_date.setDate(dateObject);
						}
						if (data.notify_by) {
						  var retDate = GetDate(data.notify_by);
						  var dateObject = new Date(retDate);
						  var retDate = dateObject.toString();
						  flatpickrnotify_date.setDate(dateObject);
						}
						
                        //$('#document_date').flatpickr().setDate(new Date(GetDate(data.doc_date)));
                        $('#dd_client').val(data.client_id).change();
                        $('#dd_company').val(data.employer_id).change();
                        //$('#from_date').flatpickr().setDate(new Date(GetDate(data.from_date)));
                        //$('#to_date').flatpickr().setDate(new Date(GetDate(data.to_date)));
                        $('#dd_doc_type').val(data.doc_type).change();
                        $('#dd_notify').val(data.notify).change();
                        //$('#notify_date').flatpickr().setDate(new Date(GetDate(data.notify_by)));
                        $('#txt_location').val(data.location);
                        $('#dd_notify_email').val(JSON.parse(data.notify_email)).change();
						
                        if (data.status_id == COMPLETE_STATUS)
                        {
                            $('#dd_status').attr('disabled', 'disabled');
                            $('#dd_status').append('<option value="' + data.status_id + '">' + data.status_name + '</option>');
                        }
                        $('#dd_status').val(data.status_id).change();
                        $('#txt_remark').val(data.notes);
                        for (let i = 0; i < data.attachment.length; i++)
				        { 
                            data.attachment[i]['name'] = data.attachment[i]['filename'];
                            data.attachment[i]['uuid'] = data.attachment[i]['id'];
                            delete data.attachment[i]['filename'];
                            delete data.attachment[i]['id'];
                        }
                       
                        $.fn.populate_fileupload(data, 'files');

                        if(data.user_doc_no)
                        {
                            $('#user_doc_no_div').show();
                            $('#user_doc_no').html(data.user_doc_no);
                            $('#user_doc_no').attr('href', '../documents/documents.php?id='+data.user_doc_no);
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

$.fn.delete_document_archiving = function (data)
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
                            document_no: data.doc_no,
                            emp_id: SESSIONS_DATA.emp_id
                        };
                        $.fn.write_data
                            (
                                $.fn.generate_parameter('delete_document_archiving', data_delete),
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
            approvals = JSON.parse(data.approvals);
            approvals.approve.approved = 1;
            approvals.approve.approved_by = SESSIONS_DATA.emp_id;
            approvals.approve.approved_date = moment().format('YYYY-MM-DD HH:mm:ss');
            status_id = COMPLETE_STATUS;
        }

        var data_approvals =
        {
            document_no: data.doc_no,
            approvals: approvals,
            status_id: status_id,
            module_id: MODULE_ACCESS.module_id,
            emp_id: SESSIONS_DATA.emp_id
        };

        $.fn.write_data
            (
                $.fn.generate_parameter('document_archiving_verify_approval', data_approvals),
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
            $('#doc_remark').css("border-color","#6c757d");
            var row = '';
            var data_val = '';
            $('#tbl_remark_list tbody').html('');

            for (var i = 0; i < remarks.length; i++)
            {
                data.delete_data = [];
                data.delete_data.push(JSON.stringify(remarks[i]));
                data_val = escape(JSON.stringify(data));

                row += '<tr>' +
                    '<td><a class="tooltips" href="javascript:void(0)" data-value=\'' + data_val + '\' onclick="$.fn.delete_remark(unescape($(this).attr(\'data-value\')))" data-trigger="hover" data-original-title="Delete data "><i class="fas fa-trash-alt"/></a></td>' +
                    '<td>' + remarks[i].remarks + '</td>' +
                    '<td>' + remarks[i].created_by + '</td>' +
                    '<td>' + remarks[i].created_date + '</td>';
                row += '</tr>';

            }
            $('#tbl_remark_list tbody').html(row);
            $('.back-to-top-badge').removeClass('back-to-top-badge-visible');
        }
        else
        {
            $('#tbl_remark_list > tbody').empty();
        }

        $('#document_archive').attr('data-value', JSON.stringify(data));
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
        var data = JSON.parse($('#document_archive').attr('data-value'));
        var remarks = JSON.parse(data.remarks);

        var remark_rec =
        {
            remarks: ($('#doc_remark').val()).trim(),
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
            document_no: data.doc_no,
            remarks: remarks,
            emp_id: SESSIONS_DATA.emp_id
        };

        $.fn.write_data
            (
                $.fn.generate_parameter('document_archiving_add_edit_remark', data),
                function (return_data)
                {
                    if (return_data.data)
                    {
                        RECORD_INDEX = 0;
                        $.fn.get_list(false);
                        $.fn.reset_form('remark_list_modal');
                        $.fn.show_right_success_noty('Data has been recorded successfully');
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
            document_no: data.document_no,
            remarks: remarks,
            emp_id: SESSIONS_DATA.emp_id
        };

        $.fn.write_data
            (
                $.fn.generate_parameter('document_archiving_add_edit_remark', data),
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


        var data =
        {
            document_no: data.doc_no,
            remarks: remarks,
            emp_id: SESSIONS_DATA.emp_id
        };

        $.fn.write_data
            (
                $.fn.generate_parameter('document_archiving_add_edit_remark', data),
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
            $('#dd_client_search').val('').change();
            $('#dd_created_by_search').val('').change();
            $('#dd_category_search').val('').change();
            $('#dd_type_search').val('').change();
            $('#dd_status_search').val('').change();
            $('#dp_search_date').val('');
            $('#txt_user_doc_search').val('');

            PENDING_DATA = '';
        }
        else if (form == 'form')
        {
            DOC_NO = '';
            CLIENT_ID = '';
            $('#document_date').val('');
            $('#dd_type').val('').change();
            $('#dd_client').val('').change();
            $('#dd_company').val('').change();
            $('#from_date').val('');
            $('#to_date').val('');
            $('#dd_doc_type').val('').change();
            $('#dd_notify').val('').change();
            $('#notify_date').val('');
            $('#dd_notify_email').val('').change();
            $('#dd_status').val($("#dd_status option:first").val()).change();
            $('#txt_remark').val('');
            $('#txt_location').val('');
            $('#detail_form').parsley().destroy();
			flatpickrdocument_date.clear();
			flatpickrnotify_date.clear();
			flatpickrfrom_date.clear();
			flatpickrto_date.clear();
            $('#dd_status option[value="' + COMPLETE_STATUS + '"]').remove();
            $('#dd_status').removeAttr('disabled');
            $('#user_doc_no_div').hide();
        }
        else if (form == 'remark_list_modal')
        {
            $('#doc_remark').val('');
            $('#remark_form').parsley().destroy();
        }
    }
    catch (err)
    {
        $.fn.log_error(arguments.callee.caller, err.message);
    }
};

$.fn.get_clients_by_type = function (type_id)
{
    try
    {
        let data =
        {
            type_id: type_id,
            emp_id: SESSIONS_DATA.emp_id,
            view_all: CLIENTS_MODULE_ACCESS.viewall
        }

        $.fn.fetch_data
            (
                $.fn.generate_parameter('get_clients_by_type', data),
                function (return_data)
                {
                    if (return_data.data)
                    {
                        data = return_data.data;
                        $('#dd_client').empty();
                        for (let i = 0; i < data.length; i++)
                        {
                            $('#dd_client').append($('<option></option>').attr('value', data[i].id).text(data[i].name));
                        }
                        if (CLIENT_ID)
                        {
                            $('#dd_client').val(CLIENT_ID).change();
                        }
                        else
                        {
                            $('#dd_client option:eq(0)').prop('selected', true).change();
                        }
                    }

                }, false
            );
    }
    catch (e) 
    {
        $.fn.log_error(arguments.callee.caller, e.message);
    }
}

$.fn.show_hide_form = function (form_status)
{
    if (form_status == 'NEW')
    {
        $('#list_div').hide(400);
        $('#new_div').show(400);
        $('#h4_primary_no').text('');
        $('#btn_save').html('<i class="fa fa-check"> </i> Save');
        $.fn.intialize_fileupload('doc_upload', 'files');
        $.fn.set_validation_form();
    }
    else if (form_status == 'EDIT')
    {
        $('#list_div').hide(400);
        $('#new_div').show(400);
        $.fn.set_edit_form();
        $.fn.intialize_fileupload('doc_upload', 'files');
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


$.fn.prepare_form = function ()
{
    try
    {
		flatpickrdocument_date = $("#document_date").flatpickr({
		  altInput: true,
		  altFormat: "d-M-Y",
		  dateFormat: "Y-m-d",
		  enableTime: false,
		});
		flatpickrnotify_date = $("#notify_date").flatpickr({
		  altInput: true,
		  altFormat: "d-M-Y",
		  dateFormat: "Y-m-d",
		  enableTime: false,
		});
		flatpickrfrom_date = $("#from_date").flatpickr({
		  altInput: true,
		  altFormat: "d-M-Y",
		  dateFormat: "Y-m-d",
		  enableTime: false,
		});
		flatpickrto_date = $("#to_date").flatpickr({
		  altInput: true,
		  altFormat: "d-M-Y",
		  dateFormat: "Y-m-d",
		  enableTime: false,
		});
		
        $('.populate').select2({ tags: true, tokenSeparators: [",", " "] });
        $('.tooltips').tooltip();

        $.fn.set_validation_form();
        $("#dp_search_date").flatpickr({
            mode:"range",
            altFormat: "d-M-Y",
            dateFormat: "Y-m-d",
            onChange:function(selectedDates){
                var _this=this;
                var dateArr=selectedDates.map(function(date){return _this.formatDate(date,'Y-m-d');});
                $('#from_search_date').val(dateArr[0]);
                $('#to_search_date').val(dateArr[1]);
            },
        });



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
        PENDING_DATA = '';

        CLIENTS_MODULE_ACCESS = $.fn.get_accessibility(12);
        $.fn.get_documents_drop_down_values();
        $.fn.get_documents_drop_down_values_other();

        ROUTE_DATA = CURRENT_ROUTE.data;
        if(ROUTE_DATA != null) {
            ROUTE_DATA_ACTION = ROUTE_DATA.action;
            ROUTE_DATA_ID = ROUTE_DATA.id;

            //show add form with assignee input
            if(ROUTE_DATA_ACTION == 'assignee' && ROUTE_DATA_ID != '') {
                $.fn.show_hide_form('NEW');
                $.fn.get_assignee(ROUTE_DATA_ID);
            }

            //view outbound document by id
            if(ROUTE_DATA_ACTION == undefined && ROUTE_DATA_ID != '') {
                $.fn.navigate_form(ROUTE_DATA_ID);
            }
            
        }else {
            $.fn.get_list();
        }

        let search_params 	= new URLSearchParams(window.location.search);
        let doc_no			= search_params.get('id');
        
        if(doc_no != null)
        {
        	$.fn.navigate_form(doc_no);
        }
    }
    catch (err)
    {
        $.fn.log_error(arguments.callee.caller, err.message);
    }
};

$.fn.navigate_form = function (doc_no)
{
    try
    {

    	var data	= 
		{
			document_no	    : doc_no
	 	};
	 	
		$.fn.fetch_data
		(
		    $.fn.generate_parameter('get_document_archiving_details', data),
		    function(return_data)
		    {
		    	if(return_data.data.details)
				{
		    		$.fn.populate_detail_form(JSON.stringify(return_data.data.details));
				}
		    }, true
		);
    }
    catch (e)
    {
        $.fn.log_error(arguments.callee.caller, e.message);
    }
}

$.fn.get_documents_drop_down_values = function()
{
    try
    {   
        let lead_access = $.fn.get_accessibility(115); //stake holders
        let data    =
        {   
            emp_id   : SESSIONS_DATA.emp_id,
            view_all : MODULE_ACCESS.viewall,
            lead_access_view_all : lead_access.viewall,
            lead_access_view     : lead_access.view
        };
       
        $.fn.fetch_data
        ( 
            $.fn.generate_parameter('get_documents_drop_down_values', data),
            function(return_data)
            { 
                if (return_data.code == 0)
                { 
                    $.fn.populate_dd_values('dd_company', return_data.data.company);
                    $.fn.populate_dd_values('dd_client', return_data.data.client);
                    $.fn.populate_dd_values('dd_doc_type', return_data.data.category);
                    $.fn.populate_dd_values('dd_notify_email', return_data.data.approval);
                    APPROVALS = return_data.data.approval;
                    $.fn.populate_dd_values('dd_client_search', return_data.data.client, true);
                    $.fn.populate_dd_values('dd_created_by_search', return_data.data.created_by, true);
                    $.fn.populate_dd_values('dd_category_search', return_data.data.category, true);
                }
            },true
        );
    }
    catch(err)
    {
        $.fn.log_error(arguments.callee.caller,err.message);
    }
};

$.fn.get_documents_drop_down_values_other = function()
{
    try
    {   
        let data    =
        {   
        
        };
       
        $.fn.fetch_data
        ( 
            $.fn.generate_parameter('get_documents_drop_down_values_other', data),
            function(return_data)
            { 
                if (return_data.code == 0)
                {   
                    $.fn.populate_dd_values('dd_type', return_data.data.sh_type);
                    $.fn.populate_dd_values('dd_status', return_data.data.document_status);
                    $.fn.populate_dd_values('dd_status_search', return_data.data.document_status);
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
        if(element_id == 'dd_notify_email')
        {
            $('#dd_approval_individual').empty();
            for (let item of dd_data.employees)
            {
                $('#dd_approval_individual').append(`<option 
                                                     data-type="individual" 
                                                     value="${item.id}">${item.descr}
                                                     </option>`
                                                   );
            }
            $('#dd_approval_company').empty();
            for (let item of dd_data.companies)
            {
                $('#dd_approval_company').append(`<option 
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
            else if(element_id != 'dd_notify_email')
            {
                $('#'+element_id).append(`<option value="">Please Select</option>`);
            }

            for (let item of dd_data)
            {
                $('#'+element_id).append(`<option value="${item.id}">${item.descr}</option>`);
            }
        }

        if(APPROVALS_SELECTED)
        {   
            $.each( APPROVALS_SELECTED, function( key, value ) 
            {   
                let id = value['user_id'];
                if(value['type'] == 'individual')
                {   
                    $("#dd_notify_email #dd_approval_individual option[value='"+id+"']").attr('selected', 'selected');
                }
                else if(value['type'] == 'company')
                {
                    $("#dd_notify_email #dd_approval_company option[value='"+id+"']").attr('selected', 'selected');
                }
                
            });
            $("#dd_notify_email").change();
        }
        else
        {
            $('#'+element_id).val('').change();
        }
        
    }
    catch(err)
    {
        $.fn.log_error(arguments.callee.caller,err.message);
    }
};

$.fn.set_validation_form = function ()
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
    try
    {   
        $('a[data-bs-toggle="tab"]').on('show.bs.tab', function (e) 
		{
			let target = $(e.target).attr("href") // activated tab
            if(target == '#tab-two' || target == '#tab-three')
			{
				$('#div_thread').hide();
			}
			else
			{	
				$('#div_thread').show();
			}
		});

        $('#btn_search').click(function()
		{
			$('#searchPanel').show();
			$('#btn_search').hide();
		});

		$('#btn_close_search').click(function()
		{
			$('#searchPanel').hide();
			$('#btn_search').show();
		});

        $('#btn_reset').click(function (e)
        {
            e.preventDefault();
            $.fn.reset_form('list');
            RECORD_INDEX = 0;
            $.fn.get_list(false);
        });

        $('#btn_search_action').click(function (e)
        {
            e.preventDefault();
            RECORD_INDEX = 0;
            $.fn.get_list(false);
        });

        $('#btn_new').click(function (e)
        {
            e.preventDefault();
            $.fn.reset_form('form');
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
             let doc_remark = $('#doc_remark').val();
             if (doc_remark != '' && doc_remark != null)
             {
                $('#doc_remark').css("border-color","#6c757d");
                 $.fn.add_edit_remark();
             }
             else{
                $("#doc_remark").focus();
                $('#doc_remark').css("border-color","red");
             }
         });

        $('#btn_send_email').click(function (e)
        {
            e.preventDefault();
            btn_send_email = Ladda.create(this);
            btn_send_email.start();
            $.fn.send_email_notification();
        });

        $('#dd_type').change(function (e)
        {
            $.fn.show_hide_component('NEW');
        });

        $('#dd_type').change(function (e)
        {
            let type_id = $(this).val();
            if (type_id != '' && type_id != null)
            {
                $.fn.get_clients_by_type(type_id);
            }
        });

        $('#btn_reply').on('click', function(e) 
        {
        	e.preventDefault();
            btn_comments_reply = Ladda.create(this);
        	btn_comments_reply.start();
            $.fn.add_edit_comment_reply();
        });
        
        $('#btn_list_pending_ver').on('click', function (e) 
        {
            e.preventDefault();

            $.fn.reset_form('list');
            RECORD_INDEX = 0;
            
            PENDING_DATA =
            {
                status: 'verify',
                view_all: MODULE_ACCESS.viewall,
                emp_id: SESSIONS_DATA.emp_id
            };
            
            $.fn.get_list(false, PENDING_DATA);
        });

        $('#btn_list_pending_app').on('click', function (e) 
        {
            e.preventDefault();

            $.fn.reset_form('list');
            RECORD_INDEX = 0;
            PENDING_DATA =
            {
                status: 'approve',
                view_all: MODULE_ACCESS.viewall,
                emp_id: SESSIONS_DATA.emp_id
            };

            $.fn.get_list(false, PENDING_DATA);
        });




    }
    catch (err)
    {
        $.fn.log_error(arguments.callee.caller, err.message);
    }
};

$.fn.show_hide_component = function (status)
{
    if (status == 'NEW')
    {
        $('#detail_form').parsley().destroy();
    }

    let type = $('#dd_type').val();

    $('#dd_client').attr('disabled', false);
    $('#attention_client').hide();
    $('#attention_others').hide();

    if (type && type != 0) 
    {
        $('#dd_client').removeAttr('disabled');
        $('#attention_client').show();
    }
    else
    {
        $('#attention_others').show();
    }

    if (status == 'NEW')
    {
        $.fn.set_validation_form();
    }
};


$.fn.init_upload_file = function ()
{
   // $.fn.intialize_fileupload('doc_upload', 'files');
};

$.fn.send_email_verifier_approver_archiving = function (param)
{
    try
    {
        var data =
        {
            document_no: param.document_no,
            module_id: MODULE_ACCESS.module_id,
            emp_id: SESSIONS_DATA.emp_id
        };

        $.fn.write_data
            (
                $.fn.generate_parameter('send_email_verifier_approver_archiving', data),
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


// START of Document initialization
$(document).ready(function ()
{
    $.fn.form_load();
});
// END of Document initialization