var RECORD_INDEX = 0;
var btn_save, btn_save_remarks, btn_send_email, btn_verify_approve, btn_save_archive;
DOC_NO = '';
CLIENT_ID = '';
CONTACT_ID = '';
CURRENT_PATH = '../../';
var FILE_UPLOAD_PATH = ''; //file upload mandatory field
var CLIENTS_MODULE_ACCESS = '';
var APPROVALS = '';
var APPROVALS_SELECTED = '';
var UI_DATE_FORMAT = 'DD-MMM-YYYY';
var ROUTE_DATA = '';
var ROUTE_DATA_ACTION = '';
var ROUTE_DATA_ID = '';
var flatpickrdocument_date = "";
var flatpickrdue_date = "";

$.fn.data_table_features = function ()
{
    try
    {
        if (!$.fn.dataTable.isDataTable('#tbl_list'))
        {
            table = $('#tbl_list').DataTable({
                bAutoWidth: false, 
                aoColumns : [
                    { sWidth: '12%' },
                    { sWidth: '10%' },
                    { sWidth: '15%' },
                    { sWidth: '15%' },
                    { sWidth: '10%' },
                    { sWidth: '10%' },
                    { sWidth: '12%' }
                ],
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

$.fn.get_list = function (is_scroll)
{
    try
    {
        var data =
        {
            // client_id: $('#dd_client_search').val(),
            title: $('#txt_title_search').val(),
            created_by: $('#dd_created_by_search').val(),
            category_id: $('#dd_category_search').val(),
            company_id: $('#dd_company_search').val(),
            status: $('#dd_status_search').val() ?? 'all',
            from_date: $('#from_search_date').val(),
            to_date: $('#to_search_date').val(),
            user_doc_no: $('#txt_user_doc_search').val(),
            view_all: MODULE_ACCESS.viewall, // SESSIONS_DATA.allow_contract_view_all,
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
            $.fn.generate_parameter('get_documents_list', data),
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
            },
            true
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
        if (data) {// check if there is any data, precaution 
            if(is_scroll == false)
			{
				$('#tbl_list > tbody').empty();
			}

            //update counts
             $('#total_records').html(data.total_records);
            // $('#badge_pending_ver').html(data.pending_verification);
            // $('#badge_pending_app').html(data.pending_approval);

            if (data.list.length > 0) // check if there is any data, precaution
            {
                let row = '';
                let data_val = '';
                if (data.rec_index)
                {
                    RECORD_INDEX = data.rec_index;
                }
                data = data.list;
                let status = '';
                //let access_level			= SESSIONS_DATA.access_level;
                for (var i = 0; i < data.length; i++)
                {   
                    data_val = encodeURIComponent(JSON.stringify(data[i])); //.replace(/'/,"");
                    if(data[i].is_archived == '1')
                    {
                        status = 'Archived';
                    }
                    else if(data[i].total_approvers_count == data[i].total_approvals_count)
                    {
                        status = 'Document Verified';
                    }
                    else if(data[i].total_approvals_count >= 1)
                    {
                        status = 'Verification in Progress';
                    }
                    else if(data[i].is_to_verify == '1')
                    {
                        status = 'Pending Verification';
                    }
                    else
                    {
                        status = 'Draft';
                    }

                    // row += '</tr>';
                    row += `<tr id="TR_ROW_' + i + '"  data-value=\'' + data_val + '\'>'
                    <td>${data[i].doc_no}</td>
                    <td>${data[i].doc_date}</td>
                    <td>${data[i].title}</td>
                    <td>${data[i].category_name}</td>
                    <td>${data[i].created_by}</td>
                    <td>${status}</td>`;

                    row += '<td><div class="button-group">';
                    if (MODULE_ACCESS.edit == 1)
                    {
                        row += `<button type="button" class="btn btn-success btn-xs waves-effect waves-light" data-bs-toggle="tooltip" data-bs-placement="top" title="Edit" data-value="${data_val}" onclick="$.fn.populate_detail_form(decodeURIComponent('${data_val}'))">
                            <i class="fas fa-sign-in-alt"></i>
                        </button>`;

                    }
                    if (MODULE_ACCESS.delete == 1)
                    {
                        row += `&nbsp;
                        <button type="button" class="btn btn-danger btn-xs waves-effect waves-light" data-bs-toggle="tooltip" data-bs-placement="top" title="Delete" data-value="${data_val}" onclick="$.fn.delete_user_document(decodeURIComponent('${data_val}'))">
                            <i class="far fa-trash-alt"></i>
                        </button>`;
                    }

                    if(data[i].total_approvers_count == data[i].total_approvals_count && data[i].is_archived != '1')
                    {
                        row += `</div>
                        <div class="button-list pt-1">
                        <button type="button" class="btn btn-xs btn-info waves-effect waves-light" data-bs-toggle="tooltip" data-bs-placement="top" title="Archive" data-value="${data_val}" onclick="$.fn.archive_user_document(decodeURIComponent('${data_val}'))">
                        <span class="btn-label"><i class="fas fa-upload"></i></span>Archive
                        </button>`;

                        
                    }
                    
                    row += '</div></td>';
                    row += '</tr>';

                }
                $('#tbl_list tbody').append(row);
                $('#div_load_more').show();
            }
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
        if ($('#doc_upload_files .file-upload .link-view-file').length == 0 && $('#doc_upload_files .file-upload.new').length == 0)
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
            $('#doc_upload_files .file-upload.new').each(function () 
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
                if(fileExtension != 'pdf' && $('#dd_verification_type').val() == 474) {
                    only_pdf = true;
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
        let type = $('#dd_type').val();
        let attention_to = '';
        if (type)
        {
            attention_to = $('#dd_attention_to').val();
        }
        else
        {
            attention_to = $('#txt_attention_to').val();
        }

        var approvals = [];
        $('#dd_approval option:selected').each(function (index) 
        {
            // approvals.push($(this).attr('data-type')+'-'+$(this).val());
            let param   = {};
            param.type  = $(this).attr('data-type');
            param.id    = $(this).val();
            approvals.push(param);
        });

        var data =
        {
            doc_no: DOC_NO,
            doc_date: $('#doc_date').val(),
            due_date: $('#due_date').val(),
            title: $('#txt_title').val(),
            employer_id: $('#dd_company').val(),
            status_id: $('#dd_status').val(),
            approvals: approvals,
            category_id: $('#dd_category').val(),
            amount: $('#txt_amount').val(),
            remark: $('#txt_remark').val(),
            email_content: encodeURIComponent(CKEDITOR.instances.text_editor.getData()),
            emp_id: SESSIONS_DATA.emp_id,
            is_show_verifiers: $('#chk_is_show_verifiers').is(':checked') ? 1 : 0,
            attachment: attachment,
            type_id: $('#dd_type').val(),
            client_id: $('#dd_client').val(),
            attention_to: attention_to,
            verification_type : $('#dd_verification_type').val()
        };

        $.fn.write_data(
            $.fn.generate_parameter('add_edit_documents', data),
            function (return_data)
            {
                if (return_data.data)
                {
                    $.fn.set_edit_form();
                    DOC_NO = return_data.data.details.doc_no;
                    FILE_UPLOAD_PATH = `../files/${MODULE_ACCESS.module_id}/${DOC_NO}/`;

                    let attachment_data =
                    {
                        id: '',
                        primary_id: DOC_NO,
                        secondary_id: 'document',
                        module_id: MODULE_ACCESS.module_id,
                        filename: '',
                        filesize: "0",
                        json_field: {},
                        emp_id: SESSIONS_DATA.emp_id
                    };

                    if ($('#doc_upload_files .file-upload.new').length > 0)
                    {
                        $.fn.upload_file(`doc_upload_files`, 'outbound_no', DOC_NO,
                            attachment_data, function (total_files, total_success, filename, attach_return_data)
                        {
                            if (total_files == total_success)
                            {

                                $.fn.populate_fileupload(attach_return_data, `doc_upload_files`, true);
                            }
                        }, false, btn_save);
                    }
                    
                    //if from task assignee - update task assignee with doc_no
                    if(ROUTE_DATA != '' && ROUTE_DATA_ACTION == 'assignee') {
                        let assignee_data = 
                        {
                            id 				: ROUTE_DATA_ID,
                            doc_no          : DOC_NO,
                            emp_id 			: SESSIONS_DATA.emp_id
                        };

                        $.fn.write_data(
                            $.fn.generate_parameter('update_assignee_document', assignee_data),
                            function(return_data)
                            {
                                // console.log(return_data);
                            },false, '', true
                        );
                    }

                    $('#h4_primary_no').text('Document Number : ' + return_data.data.details.doc_no);
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
    $('#btn_save').html('<i class="fa fa-edit"></i> Update');
    $('#btn_send_email').show();
    $('#div_thread').show();
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
        DOC_NO = data.doc_no;
        $.fn.fetch_data
            (
                $.fn.generate_parameter('get_doc_details', { doc_no: data.doc_no, emp_id: SESSIONS_DATA.emp_id }),
                function (return_data)
                {   
                    if (return_data.data.details)
                    {   
                        var data = return_data.data.details;
                        // console.log(data);
                        DOC_NO = data.doc_no;
                        if (data.type_id)
                        {
                            $('#dd_type').val(data.type_id).change();
                        }
                        else
                        {
                            $('#dd_type').val(0).change();
                        }
                        if (data.doc_date) {
                            var retDate = GetDate(data.doc_date);
                            var dateObject = new Date(retDate);
                            var retDate = dateObject.toString();
                            flatpickrdocument_date.setDate(dateObject);
                        }
                        if (data.due_date) {
                            var retDate = GetDate(data.due_date);
                            var dateObject = new Date(retDate);
                            var retDate = dateObject.toString();
                            flatpickrdue_date.setDate(dateObject);
                        }
                        $('#dd_company').val(data.employer_id).change();
                        $('#txt_title').val(data.title);
                        $('#dd_category').val(data.ctg_id).change();
                        $('#txt_amount').val(data.amount);
                        $('#txt_remark').val(data.remarks);
                        $('#dd_verification_type').val(data.verification_type).change();

                        $.fn.change_switchery($('#chk_is_show_verifiers'),(parseInt(data.is_show_verifiers) ? true : false));
                        $.fn.show_hide_component('EDIT');

                        if (data.type_id)
                        {
                            CLIENT_ID = data.client_id;
                            CONTACT_ID = data.attention_to;
                        }
                        else
                        {
                            CLIENT_ID = '';
                            CONTACT_ID = '';
                            $('#txt_attention_to').val(data.attention_to);
                        }

                        let approvals = data.approvals;
                        $('#div_trail_logs table tbody').empty();
                        let total_approvals = 0;
                        APPROVALS_SELECTED = approvals;
                        $.each( approvals, function( key, value ) 
                        {   
                            let id = value['user_id'];
                            if(value['type'] == 'individual')
                            {   
                                $("#dd_approval #dd_approval_individual option[value='"+id+"']").attr('selected', 'selected');
                            }
                            else if(value['type'] == 'company')
                            {
                                $("#dd_approval #dd_approval_company option[value='"+id+"']").attr('selected', 'selected');
                            }
                            $("#dd_approval").change();
                            let row = `<tr>
                                            <td>${value['name']}</td>
                                            <td>${value['viewed_at'] ? value['viewed_at'] : '-'}</td>
                                            <td>${value['verified_at'] ? value['verified_at'] : '-'}</td>
                                            </tr>`;
                            $('#div_trail_logs table tbody').append(row);

                            if(value['verified_at'])
                            {
                                total_approvals++;
                            }
                            
                        });

                        //show archive button if all verified
                        if(approvals.length > 0 && approvals.length == total_approvals)
                        {
                            $('#btn_send_email').hide();
                        }

                        $.fn.load_editor('text_editor');
                        CKEDITOR.instances.text_editor.setData(decodeURIComponent(data.email_content));

                        for (let i = 0; i < data.attachment.length; i++)
				        { 
                            data.attachment[i]['name'] = data.attachment[i]['filename'];
                            data.attachment[i]['uuid'] = data.attachment[i]['id'];
                            data.attachment[i]['deleteFileParams'] =  JSON.stringify(data.attachment[i]);
                            delete data.attachment[i]['filename'];
                            delete data.attachment[i]['id'];
                        }
                       
                        $.fn.populate_fileupload(data, 'doc_upload_files');

                        if (data.is_to_verify == 1)
                        {
                            $('#btn_save').attr('disabled', true);
                            $('#btn_add_image,.switchery,#btn_send_email,#verifiers_div').addClass('disabled');
                            $('#doc_upload_files').find('.delete').addClass('disabled');
                        }

                        if($("#doc_upload_files").html().length > 0) 
                        {
                            $('#btn_add_image').hide();
                        }
                        else
                        {
                            $('#btn_add_image').show();
                        }

                        $.fn.get_user_doc_comments_list();
                    }
                }, true
            );
    }
    catch (err)
    {
        $.fn.log_error(arguments.callee.caller,err.message);
    }
};

$.fn.delete_user_document = function (data)
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
                            doc_no: data.doc_no,
                            emp_id: SESSIONS_DATA.emp_id
                        };
                        $.fn.write_data
                            (
                                $.fn.generate_parameter('delete_user_document', data_delete),
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


$.fn.reset_form = function (form)
{
    try
    {   
        if (form == 'list')
        {
            $('#txt_title_search').val('');
            $('#dd_created_by_search').val('').change();
            $('#dd_category_search').val('').change();
            $('#dd_company_search').val('').change();
            $('#dd_status_search').val('').change();
            $('#from_search_date').val('');
            $('#to_search_date').val('');
            $('#dp_search_date').val('');
            $('#txt_user_doc_search').val('');
        }
        else if (form == 'form')
        {   
            DOC_NO = '';
            APPROVALS_SELECTED = '';
            $('#txt_title').val('');
            $('#txt_amount').val('');
            $('#dd_category').val('').change();
            $('#dd_company').val('').change();
            $('#dd_verification_type').val('').change();
            if(APPROVALS)
            {
                $.fn.populate_dd_values('dd_approval', APPROVALS);
            }
            $('#btn_send_email').hide();

            $('#doc_date').val('');
            $('#due_date').val('');
            flatpickrdocument_date.clear();
            flatpickrdue_date.clear();
            $('#txt_remark').val('');
            
            $.fn.load_editor('text_editor');
            CKEDITOR.instances.text_editor.setData(atob($('#txt_template').val()));
            
            $('#detail_form').parsley().destroy();
			$('#detail_form').parsley({
                successClass: 'has-success',
                errorClass: 'has-error',
                errors:
                {
                    classHandler: function (el)
                    {
                        return $(el).closest('.error-container');
                    },
                    errorsWrapper: '<ul class=\"help-block list-unstyled\"></ul>',
                    errorElem: '<li></li>'
                }
            });

            $('#btn_save').removeAttr('disabled');
            $('#div_trail_logs table tbody').empty();
            $('#div_reply').empty();
            $('#div_thread').hide();

            $('#chk_is_show_verifiers')    .attr('checked','checked');
            $.fn.change_switchery($('#chk_is_show_verifiers'),true);
            $('#btn_add_image,.switchery,#btn_send_email,#verifiers_div').removeClass('disabled');
            $('#doc_upload_files').find('.delete').removeClass('disabled');

            $('#dd_client').attr('disabled', true);
            $('#attention_others').show();
            $('#attention_client').hide();
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
        $('#btn_send_email').hide();
        $('#h4_primary_no').text('');
        $('#btn_save').html('<i class="fa fa-check"> </i> Save');
        $.fn.intialize_fileupload('doc_upload', 'doc_upload_files');
        $.fn.intialize_fileupload('fileupload_reply', 'files_reply');
        $.fn.set_validation_form();
    }
    else if (form_status == 'EDIT')
    {
        $('#list_div').hide(400);
        $('#new_div').show(400);
        $('#btn_send_email').hide();
        $.fn.set_edit_form();
        $.fn.intialize_fileupload('doc_upload', 'doc_upload_files');
        $.fn.intialize_fileupload('fileupload_reply', 'files_reply');
        getInitials();
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

$.fn.load_editor = function (id)
{
    var editor = CKEDITOR.instances[id];
    if (editor) { editor.destroy(true); }

    CKEDITOR.config.contentsCss =  './assets/css/email.css';
    CKEDITOR.config.allowedContent = true;
    CKEDITOR.replace(id,
        {
            height: 300
        });
};

$.fn.navigate_form = function (doc_no)
{
    try
    {
        var data	= 
		{
			doc_no	    : doc_no
	 	};
        
	 	$.fn.populate_detail_form(JSON.stringify(data));
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
        let lead_access = $.fn.get_accessibility(152); //stake holders
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
                    // console.log(return_data);
                    $.fn.populate_dd_values('dd_category', return_data.data.category);
                    $.fn.populate_dd_values('dd_company', return_data.data.company);
                    $.fn.populate_dd_values('dd_approval', return_data.data.approval);
                   // $.fn.populate_dd_values('dd_type', return_data.data.outbound_type);
                    $.fn.populate_dd_values('dd_client', return_data.data.client);
                    //$.fn.populate_dd_values('dd_verification_type', return_data.data.verification_type);
                    $('#txt_template').val(return_data.data.template);
                    $.fn.load_editor('text_editor');
                    CKEDITOR.instances.text_editor.setData(atob($('#txt_template').val()));
                    APPROVALS = return_data.data.approval;
                    $.fn.populate_dd_values('dd_created_by_search', return_data.data.created_by, true);
                    $.fn.populate_dd_values('dd_category_search', return_data.data.category, true);
                    $.fn.populate_dd_values('dd_company_search', return_data.data.company, true);
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
    {   let lead_access = $.fn.get_accessibility(115);
        let data    =
        {   
            emp_id   : SESSIONS_DATA.emp_id,
            view_all : MODULE_ACCESS.viewall,
            lead_access_view_all : lead_access.viewall,
            lead_access_view     : lead_access.view
        };
       
        $.fn.fetch_data
        ( 
            $.fn.generate_parameter('get_documents_drop_down_values_other', data),
            function(return_data)
            { //console.log(return_data);
                if (return_data.code == 0)
                {   
                    $.fn.populate_dd_values('dd_type', return_data.data.sh_type);
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
        if(element_id == 'dd_approval')
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
            else if(element_id != 'dd_approval')
            {   
                $('#'+element_id).append(`<option value="">Please Select</option>`);
            }

            for (let item of dd_data)
            {
                $('#'+element_id).append(`<option value="${item.id}">${item.descr}</option>`);
            }
        }
        // console.log(APPROVALS_SELECTED);
        if(APPROVALS_SELECTED)
        {   
            $.each( APPROVALS_SELECTED, function( key, value ) 
            {   
                let id = value['user_id'];
                if(value['type'] == 'individual')
                {   
                    $("#dd_approval #dd_approval_individual option[value='"+id+"']").attr('selected', 'selected');
                }
                else if(value['type'] == 'company')
                {
                    $("#dd_approval #dd_approval_company option[value='"+id+"']").attr('selected', 'selected');
                }
                
            });
            $("#dd_approval").change();
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
    // $('#detail_form').parsley
    //     ({
    //         successClass: 'has-success',
    //         errorClass: 'has-error',
    //         errors:
    //         {
    //             classHandler: function (el)
    //             {
    //                 return $(el).closest('.form-group');
    //             },
    //             container: function (el)
    //             {
    //                 if ($(el).attr('id') == 'dd_category' || $(el).attr('id') == 'dd_type' || $(el).attr('id') == 'dd_client' || $(el).attr('id') == 'dd_company' || $(el).attr('id') == 'dd_verification_type') 
    //                 {
    //                     return $(el).parents('.form-group').find('.select2-container');
    //                 }
    //                 else if($(el).attr('id') == 'doc_upload' || $(el).attr('id') == 'dd_approval')
    //                 {
    //                     return $(el).parents('.form-group');
    //                 }
    //             },
    //             errorsWrapper: '<ul class=\"help-block list-unstyled\"></ul>',
    //             errorElem: '<li></li>'
    //         }
    //     });

    //validation
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

$.fn.change_switchery = function(obj, checked) 
{
	if(obj.is(':checked') != checked)
	{
		CODE_TRIGGERED = true;
		obj.parent().find('.switchery').trigger('click');
	}
}

$.fn.archive_user_document = function(data)
{   
    try
    {   
        var data = JSON.parse(data);
        bootbox.confirm
            ({
                title: "Archive Confirmation",
                message: "Please confirm before you archive.",
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
                        var data_archive =
                        {
                            user_doc_no: data.doc_no,
                            document_date: data.doc_date,
                            status_id: 204,
                            doc_type: data.ctg_id,
                            employer_id: data.employer_id,
                            emp_id: SESSIONS_DATA.emp_id
                        };
                        $.fn.write_data
                            (
                                $.fn.generate_parameter('archive_user_document', data_archive),
                                function (return_data)
                                {
                                    if (return_data)
                                    {   
                                        $('.btn_archive').hide();
                                        $.fn.show_right_success_noty('Document Archived Successfully');
                                        setTimeout(function(){ $.fn.open_page(return_data.data.document_no,CURRENT_PATH+'modules/document_archiving/document_archiving.php'); }, 2000);
                                    }
                                }, false
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

$.fn.add_edit_comment_reply = function ()
{
    try
    {
    	if($('#txt_reply').val() == '')
		{
    		$.fn.show_right_error_noty('Reply cannot be empty');
    		btn_comments_reply.stop();
			return;
		}
    	
    	$('#txt_reply').val($('#txt_reply').val().replace(/['"]/g, ''));
    	
    	let data =
        {
    		doc_no	            : DOC_NO,
    		comments            : $('#txt_reply').val().replace(/(?:\r\n|\r|\n)/g,'<br/>'),
    		emp_id              : SESSIONS_DATA.emp_id,
            created_by_name     : SESSIONS_DATA.name,
        }

        $.fn.write_data(
            $.fn.generate_parameter('add_edit_user_doc_comments', data),
            function(return_data)
            {
                if (return_data.data.details)  // NOTE: Success
                {
                	let COMMENT_ID		= return_data.data.details.id;
                    FILE_UPLOAD_PATH = `../files/${MODULE_ACCESS.module_id}/${DOC_NO}/`;
                	let attachment_data =   
                    {
                        id          	: '',
                        primary_id  	: DOC_NO,
                        secondary_id	: COMMENT_ID,
                        module_id   	: MODULE_ACCESS.module_id,
                        filename    	: '',
                        filesize    	: "0",
                        json_field  	: {},
                        emp_id      	: SESSIONS_DATA.emp_id
                    };
                	
                    $.fn.populate_comment_row(return_data.data.details);
                	
                    if($('#files_reply .file-upload.new').length > 0) {   
                    	
                        $.fn.upload_file('files_reply','doc_no',DOC_NO,
                        attachment_data,function(total_files, total_success,filename, attach_return_data)
                        {
                        	if(total_files == total_success)
                            {   
                                $('#txt_reply').val('');
                                btn_comments_reply.stop();
                                $.fn.populate_fileupload(attach_return_data,'comment-'+COMMENT_ID, true);
                            }
                        },false);
                    } else {	
                    	$('#txt_reply').val('');
                    	btn_comments_reply.stop();
						// $.fn.populate_comment_row(return_data.data.details);
                    }
                }
            },false
        );
    } 
    catch (e) 
    {
        $.fn.log_error(arguments.callee.caller, e.message);
    }
}

$.fn.get_user_doc_comments_list = function ()
{
	try
	{	
		$.fn.fetch_data(
		    $.fn.generate_parameter('get_user_doc_comments_list', {doc_no : DOC_NO}),
		    function(return_data)
		    {
		    	if(return_data.data)
				{
		    		$.fn.populate_comments_list(return_data.data);
				}
                else{
                    return false;
                }
		    }
		);
	}
	catch (e) 
    {
        $.fn.log_error(arguments.callee.caller, e.message);
    }
}

$.fn.populate_comments_list = function (data)
{
    try
    {
        let row = '';
        if(data != null)
        {
            for(i = 0; i < data.length;i++)
            {
                $.fn.populate_comment_row(data[i], true);
			}
        }

    }
    catch (e)
    {
        $.fn.log_error(arguments.callee.caller, e.message);
    }
}

$.fn.populate_comment_row = function (row_data, is_list = false)
{
    try
    {	
    	let row 		= 	'';
    	let COMMENT_ID  = 	row_data.id;
        // let photo		= 	CURRENT_PATH + '/assets/img/profile_default.jpg';

        // if(row_data.emp_photo)
        // {
        //     photo = SESSIONS_DATA.filepath + 'photos/' + row_data.emp_id  + '/' + row_data.emp_photo;
        // }

        let date = moment(row_data.created_date).format(UI_DATE_FORMAT + " hh:mm A");

        // row += `<ul class="panel-comments">
        //             <li>
        //                 <img src="${photo}" alt="profile">
        //                 <div class="content">
        //                     <span class="commented"><a href="#">${row_data.name ? row_data.name : row_data.created_by_email}</a> enquired on <a href="#">${date}</a></span>
        //                     ${row_data.descr} <br/><br/>
        //                     <div id="${'comment-'+COMMENT_ID}"></div>
        //                 </div>
        //             </li>
        //         </ul>`; 
        
        row = `<div class="d-flex align-items-start mb-3">
                    <div style="margin-right:0.75rem" class="avatar-initials small" width="30" height="30" data-name="Sayersilan" ></div>
                    <div class="w-100">
                        <h5 class="mt-0">
                        <a href="contacts-profile.html" class="text-reset">
                        ${row_data.name ? row_data.name : row_data.created_by_email}
                        </a> enquired on <small class="text-muted">${date}</small>
                        </h5>
                        ${row_data.descr}
                        <div id="${'comment-'+COMMENT_ID}"></div>
                    </div>
                </div>`;
        if(is_list)
        {
        	$('#div_reply').append(row);
            for (let i = 0; i < row_data.attachment.length; i++)
            { 
                row_data.attachment[i]['name'] = row_data.attachment[i]['filename'];
                row_data.attachment[i]['uuid'] = row_data.attachment[i]['id'];
                row_data.attachment[i]['deleteFileParams'] =  JSON.stringify(row_data.attachment[i]);
                delete row_data.attachment[i]['filename'];
                delete row_data.attachment[i]['id'];
            }
        	$.fn.populate_fileupload(row_data,'comment-'+COMMENT_ID, true);
        }
        else
        {
        	$('#div_reply').prepend(row);
        }
        getInitials();

    }
    catch (e)
    {
        $.fn.log_error(arguments.callee.caller, e.message);
    }
}

$.fn.get_contact_dropdown = function (client_id)
{
    try
    {
        let data =
        {
            client_id: client_id,
            emp_id: SESSIONS_DATA.emp_id,
            view_all: CLIENTS_MODULE_ACCESS.viewall
        }

        $.fn.fetch_data
            (
                $.fn.generate_parameter('get_client_contacts', data),
                function (return_data)
                {
                    if (return_data.data)
                    {
                        data = return_data.data;
                        $('#dd_attention_to').empty();
                        for (let i = 0; i < data.length; i++)
                        {
                            $('#dd_attention_to').append($('<option></option>').attr('value', data[i].id).text(data[i].name));
                        }
                        $('#dd_attention_to option:eq(0)').prop('selected', true).change();
                    }

                    if ($('#dd_attention_to_val').val() != '')
                    {
                        $('#dd_attention_to').val($('#dd_attention_to_val').val()).change();
                    }

                    if (CONTACT_ID)
                    {
                        $('#dd_attention_to').val(CONTACT_ID).change();
                    }
                    else
                    {
                        $('#dd_attention_to option:eq(0)').prop('selected', true).change();
                    }

                }, false
            );
    }
    catch (e) 
    {
        $.fn.log_error(arguments.callee.caller, e.message);
    }
}

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

function getInitials(){
	var colors = ["#1abc9c", "#2ecc71", "#3498db", "#9b59b6", "#34495e", "#16a085", "#27ae60", "#2980b9", "#8e44ad", "#2c3e50", "#f1c40f", "#e67e22", "#e74c3c", "#95a5a6", "#f39c12", "#d35400", "#c0392b", "#bdc3c7", "#7f8c8d"];

		
	$( ".avatar-initials" ).each(function( index ) {
		
			var avatarElement = $(this);
		   var avatarWidth = avatarElement.attr('width');
			var avatarHeight = avatarElement.attr('height');
			var name = avatarElement.attr('data-name');
			var arr = name.split(' ');
			if( arr.length == 1 )
				name = name+" "+name;
			var initials = name.split(' ')[0].charAt(0).toUpperCase() + name.split(" ")[1].charAt(0).toUpperCase();
			var charIndex = initials.charCodeAt(0) - 65;
			var colorIndex = charIndex % 19;

		avatarElement.css({
		  'background-color': colors[colorIndex],
		})
		.html(initials);
	});
}

$.fn.show_hide_component = function (status)
{
    if (status == 'NEW')
    {
        $('#detail_form').parsley().destroy();
    }

    let type = $('#dd_type').val();

    $('#dd_client').attr('disabled', true);
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
    // $.fn.intialize_fileupload('fileupload_reply','files_reply');
};


$.fn.send_email_notification = function ()
{
    try
    {   
        var data =
        {
            doc_no: DOC_NO,
            // status_id: DOC_SENT_STATUS,
            emp_id: SESSIONS_DATA.emp_id
        };
        
        $.fn.write_data (
            $.fn.generate_parameter('send_email_notification_document', data),
            function (return_data)
            {
                if (return_data.data)
                {   
                    $.fn.show_right_success_noty('Email has been sent successfully');
                    $('#btn_save').attr('disabled', true);
                    // $.fn.add_remark_for_send_email(return_data.data);
                }

            }, false, btn_send_email
        );
    }
    catch (e)
    {
        $.fn.log_error(arguments.callee.caller, e.message);
    }
};

function hideSelected(value) {
	if (value && !value.selected) {
	  return $('<span>' + value.text + '</span>');
	}
}

//get assignee data
$.fn.get_assignee = function (assignee_id) {
    try 
    {   
        ROUTE_DATA_ID = assignee_id;
        $.fn.fetch_data
            (
                $.fn.generate_parameter('get_new_task_assignee_by_id', { assignee_id: assignee_id }),
                function (return_data)
                {   
                    if(return_data.code == 0) {
                        let r_data = return_data.data;
                        let assignee = r_data.assignee;

                        //populate assignee data
                        $('#txt_title').val(assignee.action);
                    }
                }, true
            );
    }
    catch (err)
    {
        $.fn.log_error(arguments.callee.caller,err.message);
    }
}

$.fn.prepare_form = function ()
{
    try
    {
        flatpickrdue_date = $("#due_date").flatpickr({
            altInput: true,
            altFormat: "d-M-Y",
            dateFormat: "Y-m-d",
            enableTime: false,
          });
          flatpickrdocument_date = $("#doc_date").flatpickr({
            altInput: true,
            altFormat: "d-M-Y",
            dateFormat: "Y-m-d",
            enableTime: false,
          });
        // $('.populate').select2({ tags: true, tokenSeparators: [",", " "] });
        $('.populate').select2();

        $('.populate-multiple').select2({
			templateResult: hideSelected,
		});
        // $('.tooltips').tooltip();
        $.fn.load_editor('text_editor');
        $.fn.set_validation_form();

        $("#dp_search_date").flatpickr({
            mode:"range",
            altFormat: "d-M-Y",
            dateFormat: "d-m-Y",
            onChange:function(selectedDates){
                var _this=this;
                var dateArr=selectedDates.map(function(date){return _this.formatDate(date,'Y-m-d');});
                $('#from_search_date').val(dateArr[0]);
                $('#to_search_date').val(dateArr[1]);
            },
        });

        // $('#dp_search_date').daterangepicker
        // (
        //     {
        //         ranges:
        //         {
        //             'Today': [moment(), moment()],
        //             'Yesterday': [moment().subtract('days', 1), moment().subtract('days', 1)],
        //             'Last 7 Days': [moment().subtract('days', 6), moment()],
        //             'Last 30 Days': [moment().subtract('days', 29), moment()],
        //             'This Month': [moment().startOf('month'), moment().endOf('month')],
        //             'Last Month': [moment().subtract('month', 1).startOf('month'), moment().subtract('month', 1).endOf('month')]
        //         },
        //         opens: 'left',
        //         startDate: moment().subtract('year', 1),
        //         endDate: moment()

        //     },
        //     function (start, end)
        //     {
        //         RECORD_INDEX = 0;
        //         $('#dp_search_date span').html(start.format(UI_DATE_FORMAT) + ' - ' + end.format(UI_DATE_FORMAT));
        //         $('#from_search_date').val(start.format(SERVER_DATE_FORMAT));
        //         $('#to_search_date').val(end.format(SERVER_DATE_FORMAT));
        //         $.fn.get_list(false);
        //     }
        // );

        if (MODULE_ACCESS.create == 0)
        {
            $('#btn_new').hide();
            $('#btn_save').hide();
            $('#btn_cancel').hide();
        }

        if (MODULE_ACCESS.verify == 0)
        {
            // $('#btn_list_pending_ver').hide();
        }

        if (MODULE_ACCESS.approve == 0)
        {
            // $('#btn_list_pending_app').hide();
        }
        // $.fn.get_list();

        // CLIENTS_MODULE_ACCESS = $.fn.get_accessibility(152);
        $.fn.get_documents_drop_down_values();
        $.fn.get_documents_drop_down_values_other();

        let elems = Array.prototype.slice.call(document.querySelectorAll('.js-switch'));
        $('.js-switch').each(function() 
        {
            new Switchery($(this)[0], $(this).data());
        });

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
            $.fn.get_list(true);
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

        // $('#btn_add_remark').click(function (e)
        // {
        //     e.preventDefault();
        //     btn_save_remarks = Ladda.create(this);
        //     btn_save_remarks.start();
        //     $.fn.add_edit_remark();
        // });

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

        $('#dd_client').change(function (e)
        {
            let client_id = $(this).val();
            if (client_id != '' && client_id != null)
            {
                $.fn.get_contact_dropdown(client_id);
            }
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

        // $('#btn_add_archive').click( function(e)
        // {
        //     e.preventDefault();
		// 	btn_save_archive = Ladda.create(this);
	 	// 	btn_save_archive.start(); 
		// 	$.fn.archive_user_document();
		// });

        // $('#chk_is_show_verifiers').on('change', function(e) 
        // {
        //     e.preventDefault(); 
        //     $(this).is(':checked') ? $('#lbl_is_show_verifiers').html('SHOW') : $('#lbl_is_show_verifiers').html('HIDE');
        // });

        // $('#doc_upload').bind('fileuploadadd', function(event, data)
        // {
        //     $('#btn_add_image').hide();
        // });

        // $('#files_div').on('click', '.cancel', function(e) 
        // {
        //     $('#btn_add_image').show();
        // });

        // $('#files_div').bind('DOMSubtreeModified', function() 
        // {   
        //     // alert($("#files").html());
        // 	if($("#files").html().length <= 0) 
	    //     {
	    //         $('#btn_add_image').show();
	    //     }
        //     else
        //     {   
        //         $('#btn_add_image').hide();
        //     }
	    // });

    }
    catch (err)
    {
        $.fn.log_error(arguments.callee.caller, err.message);
    }
};

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

// START of Document initialization
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
// END of Document initialization
