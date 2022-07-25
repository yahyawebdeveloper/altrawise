CURRENT_PATH = '../../';
var RECORD_INDEX = 0;
var APPT_ID, btn_save, btn_upload;
var FILE_UPLOAD_PATH = '';

$.fn.reset_form = function (form)
{
    try
    {
        if (form == 'list')
        {
            $('#txt_title_search').val('');
            $('#dd_status_search').val('').change();
            $('#dd_client_search').val('').change();
            $('#dd_created_by_search').val('').change();
            $('#dp_search_date').val('');
        }
        else if (form == 'form')
        {
            APPT_ID = '';
            $('#dd_client option:eq(0)').prop('selected', true).change();
            //$('#dd_attendees').val('').multiselect('reload');
            $('#dd_attendees').val('');
            $('#txt_title').val('');
            $('#tp_time_to').val('');
            $('#dd_category').val(123).change();
            $('#dd_meeting_mode  option:eq(0)').prop('selected', true).change()
            $('#txt_location').val('');
            $('#dp_date_start').val('');
            $('#dp_date_end').val('');
            $('#tp_time_start').val('').change();
            $('#tp_time_end').val('').change();

            $('#txt_outcome').val('');

            $('#btn_status').attr('disabled', true).data('value', 149);
            $('#div_claim,#div_outcome,#div_postpone').hide();
            $.fn.change_status_btn(149);
            // $('#tbl_receipt > tbody').empty();
            $('#btn_save').html('Create Appointment').show();
            $.fn.load_editor('text_editor');
            CKEDITOR.instances.text_editor.setData(atob($('#txt_template').val())); // cause error on mobile phone android

            $('#dp_date_start,#dp_date_end, #dp_followup_date').flatpickr({
                altInput: true,
                altFormat: "d-M-Y",
                dateFormat: "Y-m-d",
                enableTime: false,
              });


            $('#txt_title').removeAttr('disabled');
            $('#btn_save').show();

            $('#txt_cost').val(0);
            $('#txt_gst').val(0);
            $('#txt_roundup').val(0);
            $('#txt_total').val(0);
            // $('#tbl_receipt > tbody').empty();

        }
        else if (form == 'claims')
        {
            $('#txt_cost').val(0);
            $('#txt_gst').val(0);
            $('#txt_roundup').val(0);
            $('#txt_total').val(0);
            // $('#tbl_receipt > tbody').empty();
        }

        $.fn.reset_upload_form();
    }
    catch (err)
    {
        //    	console.log(err.message);
        console.log(err);//$.fn.log_error(arguments.callee.caller, err.message);
    }
};

$.fn.add_edit_form = function ()
{
    try
    {
        if ($('#detail_form').parsley('validate') == false)
        {
            btn_save.stop();
            return;
        }

        if ($('#dd_attendees').val() == null)
        {
            $.fn.show_right_error_noty('Please provide attendance');
            btn_save.stop();
            return;
        }


        let time_start = moment($('#tp_time_start').val(), 'h:mm A');
        let time_end = moment($('#tp_time_end').val(), 'h:mm A');
        let date_start = moment($('#dp_date_start').val(), 'YYYY-MM-DD HH:mm:ss');
        let date_end = moment($('#dp_date_end').val(), 'YYYY-MM-DD HH:mm:ss');
        let meeting_url = '';
        let json_data = $.fn.get_json_string($.fn.get_json_string($('#dd_meeting_mode option:selected').attr('data')).json_field).meeting_url;

        if (json_data)
        {
            meeting_url = json_data;
        }
        $('#txt_outcome').val($('#txt_outcome').val().replace(/['"]/g, ''));

        var attend = [];
        $('#dd_attendees option:selected').each(function (index) 
        {
            // approvals.push($(this).attr('data-type')+'-'+$(this).val());
            let param   = {};
            param.type  = $(this).attr('data-type');
            param.id    = $(this).val();
            attend.push(param);
        });
       
        let data =
        {
            id: APPT_ID,
            client_id: $('#dd_client').val(),
            to: $.fn.get_attendees(),
            attend:attend,
            subject: $('#txt_title').val(),
            category: $('#dd_category').val(),
            meeting_mode: $('#dd_meeting_mode').val(),
            location: $('#txt_location').val(),
            date_time_start: date_start.format(SERVER_DATE_FORMAT) + ' ' + time_start.format('HH:mm'),
            date_time_end: date_end.format(SERVER_DATE_FORMAT) + ' ' + time_end.format('HH:mm'),

            date_pp_time_start: '',
            date_pp_time_end: '',

            descr: encodeURIComponent(CKEDITOR.instances.text_editor.getData()),
            outcome: encodeURIComponent($('#txt_outcome').val()),
            status: $('#btn_status').data('value'),
            emp_id: SESSIONS_DATA.emp_id,
            emp_name: SESSIONS_DATA.name,
            emp_email: SESSIONS_DATA.office_email,
            attendees_id: $('#dd_attendees').val().toString(),
            meeting_mode_desc: $('#dd_meeting_mode option:selected').text(),
            meeting_url_link: meeting_url
        }

        if ($('#btn_status').data('value') == 151 || $('#btn_status').data('value') == 152)
        {
            let pp_time_start = moment($('#tp_pp_time_start').val(), 'h:mm A');
            let pp_time_end = moment($('#tp_pp_time_end').val(), 'h:mm A');
            let pp_date_start = moment($('#dp_pp_date_start').val(), UI_DATE_FORMAT);
            let pp_date_end = moment($('#dp_pp_date_end').val(), UI_DATE_FORMAT);

            data.date_pp_time_start = pp_date_start.format(SERVER_DATE_FORMAT) + ' ' + pp_time_start.format('HH:mm');
            data.date_pp_time_end = pp_date_end.format(SERVER_DATE_FORMAT) + ' ' + pp_time_end.format('HH:mm');
        }

        $.fn.write_data
            (
                $.fn.generate_parameter('add_edit_appt_new', data),
                function (return_data)
                {
                    if (return_data.data)  // NOTE: Success
                    {
                        APPT_ID = return_data.data;
                        if ($('#btn_status').data('value') == 150)
                        {
                            $('#btn_save').hide();
                        }
                        else
                        {
                            if ($('#files .file-upload.new').length > 0)
                            {
                                $.fn.save_receipt();
                            }
                            else
                            {
                                $.fn.show_right_success_noty('Data has been recorded successfully');
                                if ($('#btn_status').data('value') == 151 || $('#btn_status').data('value') == 152)
                                {
                                    $('#btn_back').trigger('click');
                                    return;
                                }
                            }
                            $.fn.show_hide_form('EDIT', false);
                            $('#btn_save').html('Update Appointment');
                        }
                    }
                }, false, btn_save
            );
    }
    catch (e)
    {
        console.log(e);//$.fn.log_error(arguments.callee.caller, e.message);
    }
}

$.fn.save_receipt = function ()
{
    var data =
    {
        appt_id: APPT_ID,
        doc_date: moment($('#dp_date_start').val(), UI_DATE_FORMAT),
        category_id: 7,
        cost: $('#txt_cost').val(),
        gst: $('#txt_gst').val(),
        roundup: $('#txt_roundup').val(),
        total: $('#txt_total').val(),
        noe: $('#dd_expenses').val(),
        remarks: 'Meeting Claims',
        emp_id: SESSIONS_DATA.emp_id,
        c_emp_access_id: $('#hd_claim').val(),
        email: SESSIONS_DATA.office_email,
        sender_name: SESSIONS_DATA.name,
        get_list: 1,
        timesheet_data: { "leave": [] }
    };

    $.fn.write_data
        (
            $.fn.generate_parameter('add_document', data),
            function (return_data)
            {
                if (return_data.data)
                {
                    FILE_UPLOAD_PATH = `111/${return_data.data.doc_no}/`;

                    let attachment_data =
                    {
                        id: '',
                        primary_id: return_data.data.doc_no,
                        secondary_id: APPT_ID,
                        module_id: 111,
                        filename: '',
                        filesize: "0",
                        json_field: {},
                        emp_id: SESSIONS_DATA.emp_id
                    };

                    $.fn.upload_file('files', 'doc_no', return_data.data.doc_no,
                        attachment_data, function (total_files, total_success, filename, attach_return_data)
                    {
                        if (total_files == total_success)
                        {
                            $.fn.reset_form('claims');
                            $.fn.populate_fileupload(attach_return_data, 'files', true);
                        }
                    }, false);

                }
            }, false
        );

    // if ($('#files .file-upload.new').length > 0)
    // {
    //     FILE_UPLOAD_PATH = `${MODULE_ACCESS.module_id}/${APPT_ID}/`;

    //     let attachment_data =
    //     {
    //         id: '',
    //         primary_id: APPT_ID,
    //         secondary_id: '',
    //         module_id: MODULE_ACCESS.module_id,
    //         filename: '',
    //         filesize: "0",
    //         json_field: {},
    //         emp_id: SESSIONS_DATA.emp_id
    //     };


    //     $.fn.upload_file('files', 'id', APPT_ID,
    //         attachment_data, function (total_files, total_success, filename, attach_return_data)
    //     {
    //         if (total_files == total_success)
    //         {
    //             data.filename = filename;
    //             $.fn.write_data
    //                 (
    //                     $.fn.generate_parameter('add_document', data),
    //                     function (return_data)
    //                     {
    //                         if (return_data.data)
    //                         {
    //                             $.fn.show_right_success_noty('Data has been recorded successfully');
    //                             $.fn.reset_form('claims');
    //                             $.fn.populate_receipt_list(return_data.data.list);
    //                         }

    //                     }, false
    //                 );
    //         }
    //     }, false);
    // }

    // $.fn.upload_file(function (filename)
    // {
    //     data.filename = filename;
    //     $.fn.write_data
    //         (
    //             $.fn.generate_parameter('add_document', data),
    //             function (return_data)
    //             {
    //                 if (return_data.data)
    //                 {
    //                     $.fn.show_right_success_noty('Data has been recorded successfully');
    //                     $.fn.reset_form('claims');
    //                     $.fn.populate_receipt_list(return_data.data.list);
    //                 }

    //             }, false
    //         );
    // });
}

$.fn.get_attendees = function ()
{
    try
    { 
        let attendees = [];
       /* $('#dd_attendees').next(".ms-options-wrap").children('.ms-options').find("ul").find("li.selected :checkbox").each(function ()
        {
            attendees.push(JSON.parse($(this).attr('data')).email);
        });*/
        $('#dd_attendees option:selected').each(function (index) 
        {  
            attendees.push(JSON.parse($(this).attr('data')).email);
        });
        return attendees;

    }
    catch (err)
    {
        console.log(err);//$.fn.log_error(arguments.callee.caller, err.message);
    }
};

$.fn.get_attendance_for_chat = function ()
{
    try
    {
        let attendance = [];
        $(".ms-options > ul > li.selected :checkbox").each(function ()
        {
            let data = JSON.parse($(this).attr('data'));
            if (data.chat_username != "")
            {
                attendance.push({ id: data.chat_username, name: data.name });
            }
        });
        return attendance;

    }
    catch (err)
    {
        console.log(err);//$.fn.log_error(arguments.callee.caller, err.message);
    }
};


$.fn.get_list = function (is_scroll)
{
    try 
    {
        let status_search = [""];
        if ($('#dd_status_search').val() != null)
        {
            status_search = $('#dd_status_search').val();
        }

        var data =
        {
            title: $('#txt_title_search').val(),
            status: status_search.toString(),
            client: $('#dd_client_search').val(),
            created_by: $('#dd_created_by_search').val(),
            from_date: $('#from_search_date').val(),
            to_date: $('#to_search_date').val(),
            office_email: SESSIONS_DATA.office_email,
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

       /*  $.fn.fetch_data_for_list
            (
                $.fn.generate_parameter('get_meetings_list', data),
                $.fn.populate_list, is_scroll, 'list_appt'
            ); */

        $.fn.fetch_data(
            $.fn.generate_parameter('get_meetings_list', data),
            function(return_data) {  console.log(return_data);
                    if (return_data.data.list) {
                    var len = return_data.data.list.length;
                    if (return_data.data.rec_index)
                    {
                        RECORD_INDEX = return_data.data.rec_index;
                    }
                    if (return_data.code == 0 && len != 0)
                    {
                        $.fn.populate_list(return_data.data, is_scroll);
                        $('#btn_load_more').show();
                    }
                    else if (return_data.code == 1 || len == 0)
                    {
                        if (!is_scroll)
                        {
                            $('#btn_load_more').hide();
                            $('#list_appt').empty().append
                                (
                                    `<div class="list-placeholder">No records found!</div>`
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
    catch (e) 
    {
        //    	console.log(e.message);
        console.log(e);//$.fn.log_error(arguments.callee.caller, e.message);
    }
};

$.fn.get_attendance = function ()
{
    try 
    {
        var data =
        {
            client_id: $('#dd_client').val()
        }

        $.fn.fetch_data
            (
                $.fn.generate_parameter('get_appt_attendance', data),
                function (return_data)
                {
                    if (return_data.data)
                    {
                        //                	console.log("ere");
                        //                	$('#dd_attendees').multiselect('loadOptions', return_data.data);
                    }
                }, false, '', true, true
            );
    }
    catch (e) 
    {
        console.log(e);//$.fn.log_error(arguments.callee.caller, e.message);
    }
}

$.fn.populate_list = function (data, is_scroll, list_id)
{ 
    try
    { console.log('hi inside populate list');
        if (is_scroll == false)
        {
            $('#list_appt').empty();
        }

        if (data.list.length > 0) // check if there is any data, precaution
        {
            let row = '';
            let row_data = '';
            if (data.rec_index)
            {
                RECORD_INDEX = data.rec_index;
            }
            data = data.list;

            //            $('#badge_review') .html(data[0].count_send_verify);
            //            $('#badge_approve').html(data[0].count_verify);

            for (var i = 0; i < data.length; i++)
            {
                row_data = JSON.stringify(data[i]);
                pic_email = '';
                if (row_data != false)
                {   
                    if(data[i].pic_email != null)
                    {
                        if (data[i].pic_email.length > 40)
                        {
                            pic_email = data[i].pic_email.substring(0, 40) + '...';
                        }
                        else
                        {
                            pic_email = data[i].pic_email;
                        }
                    }

                    row += `<li class='list-group-item ' style="list-style: none;" data-value='${escape(JSON.stringify(data[i]))}' onclick='$.fn.populate_detail_form(unescape($(this).attr("data-value")))'>
                                <div class='row'>
                                    <div class='apt-date col-lg-3'>
                                        <i class="far fa-clock" aria-hidden="true"></i>
                                        <strong>${data[i].date_time}<br/><i class="far fa-clock" aria-hidden="true"></i>&nbsp;${data[i].date_time_to}</strong>
                                        
                                    </div>
                                    <div class='col-lg-5'>
                                       <span class="far fa-comment task-title">&nbsp; <strong>${data[i].subject}</strong></span>
                                        <div class="task-assign">
                                        <i class="fas fa-user-friends" aria-hidden="true"></i>&nbsp;
                                            <strong><i>${pic_email}</i></strong>
                                        </div>
                                        <div class="task-assign">
                                            <i class="fas fa-bars" aria-hidden="true"></i>&nbsp;
                                            <strong><i>${data[i].category_name}</i></strong>
                                        </div>
                                        <div class="task-assign">
                                            <i class="fa fa-user" aria-hidden="true"></i>&nbsp;
                                            <strong><i>${data[i].created_by_name} Created on ${data[i].created_date}</i></strong>
                                        </div>
                                    </div>
                                    <div class='apt-date col-lg-4'>
                                        <i class="fa fa-bookmark text-danger"></i><strong> ${data[i].client_name}</strong><br/>
                                        <span class="fa fa-comments"></span>&nbsp;${decodeURIComponent(data[i].outcome_of_meeting.replace(/%0A/g, '<br/>'))}
                                    </div>
                                </div>
                            </li>`;
                }
            }
            $('#list_appt').append(row);
            $('#div_load_more').show();
        }

    }
    catch (e)
    {
        console.log(e);
        //        console.log(err);//$.fn.log_error(arguments.callee.caller, e.message);
    }
}

$.fn.get_receipt_list = function ()
{
    try 
    {
        var data =
        {
            secondary_id: APPT_ID,
            emp_id: SESSIONS_DATA.emp_id
        }

        $.fn.fetch_data
            (
                $.fn.generate_parameter('get_meetings_attachments', data),
                function (return_data)
                {
                    if (return_data.data)
                    {
                        $.fn.populate_fileupload(return_data.data, 'files', true);
                    }
                }, false, '', true, true
            );
    }
    catch (e) 
    {
        console.log(e);//$.fn.log_error(arguments.callee.caller, e.message);
    }
}

// $.fn.populate_receipt_list = function (data)
// {
//     try 
//     {
//         $('#tbl_receipt > tbody').empty();
//         let row_data = '';
//         for (const row of data)
//         {
//             let total = parseFloat(row.cost) + parseFloat(row.gst) + parseFloat(row.roundup);
//             let func = `$.fn.open_page('${data[i].attachment[j].id}','${CURRENT_PATH}download.php')`;
//             row_data += `<tr>
// 							<td width="50%">
// 								<div class="col-sm-12">
// 								<span class="receipt">
//                             		<a href class="btn_view_file" onclick="" data-path="${row.filepath}">${row.filename}</a>
//                             	</span>
// 							</div>
// 							</td>
// 						<td width="30%">Cost : ${row.cost}<br/> SST/GST : ${row.gst}<br/>RoundUp : ${row.roundup}<br/>Total : ${total}</td>
// 						<td width="20%"></td>
// 					</tr>`;
//         }
//         $('#tbl_receipt > tbody').append(row_data);
//         $('.btn_view_file').unbind().on('click', function (event) 
//         {
//             event.preventDefault();
//             let path = $(this).data('path');
//             $.fn.open_file(path);
//         });

//     }
//     catch (e) 
//     {
//         console.log(err);//$.fn.log_error(arguments.callee.caller, e.message);
//     }
// }

$.fn.populate_detail_form = function (data)
{
    try
    {
        var data = JSON.parse(data);
        let datetime = moment(data.date_time);
        let datetimeto = moment(data.date_time_to);

        $.fn.show_hide_form('EDIT', true);
        APPT_ID = data.id;
        $('#dd_client').val(data.client).change();
    

        if (data.pic)
        {
           // $('#dd_attendees').val(data.pic.split(",")).multiselect('reload');
            $('#dd_attendees').val(data.pic.split(","));
            $("#dd_attendees #dd_attendees_individual option[value='"+data.pic.split(",")+"']").attr('selected', 'selected');
            $("#dd_attendees").change();
        }
        $('#txt_title').val(data.subject);
        $('#dd_category').val(data.category_id).change();
        $('#dd_meeting_mode').val(data.meeting_mode).change();
        $('#txt_location').val(data.location);
        $('#dp_date_start').val(datetime.format(UI_DATE_FORMAT));
        $('#dp_date_end').val(datetimeto.format(UI_DATE_FORMAT));
        $('#tp_time_start').val(datetime.format('h:mm A')).change();
        $('#tp_time_end').val(datetimeto.format('h:mm A')).change();
        CKEDITOR.instances.text_editor.setData(data.remarks);
        $('#txt_outcome').val(decodeURIComponent(data.outcome_of_meeting));
        $('#btn_status').data('value', data.status_id);
        $.fn.change_status_btn(data.status_id);
        $('#btn_status').attr('disabled', false);

        $('#btn_save').html('Update Appointment');
        $.fn.get_receipt_list();

        // IF not owner
        if (SESSIONS_DATA.emp_id != Number(data.created_by))
        {
            $('#txt_title').prop('disabled', 'disabled');
            //            CKEDITOR.instances.text_editor.setReadOnly( true );
            $('#btn_status').attr('disabled', true);
            $('#btn_save').hide();
        }

        if (data.status_id == 150)
        {
            $('#btn_save').hide();
        }

    }
    catch (err)
    {
        console.log(err);
        //        console.log(err);//$.fn.log_error(arguments.callee.caller,err.message);
    }
};


$.fn.set_validation_form = function ()
{
    $('#detail_form').parsley
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

$.fn.change_status_btn = function (value)
{
    try 
    {
        switch (value) 
        {
            case 149:
                $('#btn_status').removeClass('btn-primary btn-success btn-warning btn-danger').addClass('btn-primary').data('value', value);
                break;
            case 150:
                $('#btn_status').removeClass('btn-primary btn-success btn-warning btn-danger').addClass('btn-success').data('value', value);
                break;
            case 153:
                $('#btn_status').removeClass('btn-primary btn-success btn-warning btn-danger').addClass('btn-danger').data('value', value);
                break;
            case 151:
            case 152:
                $('#btn_status').removeClass('btn-primary btn-success btn-warning btn-danger').addClass('btn-warning').data('value', value);
                break;
        };
        $('.status-btn').each(function ()
        {
            if ($(this).data('value') == value)
            {
                $('#btn_status_text').html($(this).html());
            }
        });

    }
    catch (e) 
    {
        console.log(e);//$.fn.log_error(arguments.callee.caller, e.message);
    }
}

$.fn.change_switchery = function (obj, checked)
{
    if ((obj.is(':checked') && checked == false) || (!obj.is(':checked') && checked == true))
    {
        obj.parent().find('.switchery').trigger('click');
    }
}

$.fn.prepare_form = function ()
{
    try
    {    
        $('.populate').select2({ tags: true, tokenSeparators: [",", " "] });
        $.fn.get_dropdown_meeting();
    
       /*  $('#dd_client_to_search,#dd_created_by_search').select2
            ({
                placeholder: 'All'
            });

        $('#dd_expenses,#dd_client,#dd_category,#dd_meeting_mode').select2
            ({
                placeholder: 'Please Select'
            }); */
        
        $('#dd_status_search').val('');
        
       /*  $('#dd_status_search').multiselect
            ({
                columns: 1,
                placeholder: 'Status',
                search: true,
                selectAll: true
            });
 */
      /*  $('#dd_attendees').multiselect
            ({
                columns: 1,
                placeholder: 'Add required attendees',
                search: true,
                selectAll: true
            });
            */
       /*  $('#dd_assignee').multiselect
            ({
                columns: 1,
                placeholder: 'Sending To',
                search: true,
                selectAll: true
            });
 */
        $('#dd_assignee').val('');
        

        $('#dp_date_start,#dp_date_end, #dp_pp_date_start,#dp_pp_date_end, #dp_followup_date').flatpickr({
            altInput: true,
            altFormat: "d-M-Y",
            dateFormat: "Y-m-d",
            enableTime: false,
          });

        /* $('#tp_time_start, #tp_time_end, #tp_pp_time_start, #tp_pp_time_end, #tp_followup_time, #tp_followup_time_to').timepicker
            ({
                timeFormat: 'g:i A',
                minTime: '07:00am',
                maxTime: '10:00pm'
            }); */

        $('#dp_search_date').flatpickr({
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


        $.fn.set_validation_form();

        if (MODULE_ACCESS.create == 0)
        {
            $('#btn_new').hide();
            $('#btn_save').hide();
        }
        else
        {
            $('#btn_new').show();
            $('#btn_save').show();
        }

        $.fn.load_editor('text_editor');
        //$('#dd_status_search').val(["149"]).multiselect('reload');
       // $('#dd_status_search').val('');
        $.fn.get_list(false);
        $.fn.init_upload_file();
    }
    catch (e)
    {
        console.log(e);//$.fn.log_error(arguments.callee.caller, e.message);
    }
}

$.fn.get_dropdown_meeting = function()
{
    try
    {   
        let lead_access = $.fn.get_accessibility(171); 
        let data    =
        {   
            emp_id   : SESSIONS_DATA.emp_id,
            view_all : MODULE_ACCESS.viewall,
            lead_access_view_all : lead_access.viewall,
            lead_access_view     : lead_access.view
        };
       
        $.fn.fetch_data
        ( 
            $.fn.generate_parameter('get_dropdown_meeting', data),
            function(return_data)
            { 
                if (return_data.code == 0)
                { 
                    $.fn.populate_dd_values('dd_status_search', return_data.data.appt_status);
                    $.fn.populate_dd_values('dd_client_search', return_data.data.client);
                    $.fn.populate_dd_values('dd_created_by_search', return_data.data.emp);
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
    { console.log(dd_data);
        
        $('#'+element_id).empty();



        if(is_search)
        {
            $('#'+element_id).append(`<option value="">All</option>`);
        }
        else if(element_id != '') {
            $('#'+element_id).append(`<option value="">All</option>`);
        }

        if(element_id == 'dd_status_search'){
            for (let item of dd_data)
            {
                $('#'+element_id).append(`<option value="${item.id}">${item.descr}</option>`);
            }
        }
        else{
            for (let item of dd_data)
            {
                $('#'+element_id).append(`<option value="${item.id}">${item.name}</option>`);
            }   
        }
    }
    catch(err)
    {
        $.fn.log_error(arguments.callee.caller,err.message);
    }
};

$.fn.show_hide_form = function (form_status, reset_form)
{
    if (reset_form) $.fn.reset_form('form');

    if (form_status == 'NEW')
    {
        $('#list_div').hide(400);
        $('#new_div').show(400);
        $('#h4_primary_no').text('Meetings');
        $('#btn_save').html('<i class="fa fa-check"> </i> Save');
    }
    else if (form_status == 'EDIT')
    {
        $('#list_div').hide(400);
        $('#new_div').show(400);
        $('#div_outcome').show(400);
        // $('#div_claim').show(400);
    }
    else if (form_status == 'BACK')
    {
        $('#list_div').show(400);
        $('#new_div').hide(400);
    }

    if (MODULE_ACCESS.create != 0)
    {
        $('#btn_save').attr('disabled', false);
    }
};

$.fn.init_upload_file = function ()
{
    $.fn.reset_upload_form();
    $.fn.intialize_fileupload('fileupload', 'files', $.fn.set_file_name);

    // $('#fileupload').fileupload
    //     ({
    //         url: CURRENT_PATH + upload_file_path,
    //         dataType: 'json',
    //         autoUpload: false,
    //         acceptFileTypes: /(\.|\/)(pdf)$/i,
    //         maxFileSize: undefined,
    //         disableImageResize: /Android(?!.*Chrome)|Opera/.test(window.navigator.userAgent),
    //         previewMaxWidth: 80,
    //         previewMaxHeight: 80,
    //         previewCrop: true,
    //         filesContainer: '#files'
    //     });

    // let name = SESSIONS_DATA.username.trim();
    // name = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();

    // $('#fileupload').bind('fileuploadsubmit', function (e, data)
    // {
    //     let date = moment($('#dp_date_start').val(), UI_DATE_FORMAT);
    //     let doc_name = data.files[0].name.split('.').slice(0, -1).join('.');
    //     let doc_ext = data.files[0].name.split('.').pop();

    //     data.formData =
    //     {
    //         upload_path: 'documents/' + date.format('MM') + '_' + date.format('YYYY') + '/' + SESSIONS_DATA.emp_id + '/',
    //         file_name: doc_name + "_Claims_" + moment().format('YYYYMMDDhmmss') + '.' + doc_ext
    //     };
    // });

    // $('#fileupload').bind('fileuploadadd', function (e, data)
    // {
    //     $("#btn_add_image").hide(200);
    //     $('#detail_form').parsley().destroy();
    //     $('#dd_expenses,#s2id_dd_expenses').attr('data-parsley-required', 'true');
    //     $('#dd_expenses').attr('required', 'required');
    //     $('#detail_form').parsley();
    // });

    // $('#fileupload').bind('fileuploadfail', function (e, data)
    // {
    //     $("#btn_add_image").show(200);
    //     $('#detail_form').parsley().destroy();
    //     $('#dd_expenses,#s2id_dd_expenses').attr('data-parsley-required', 'false');
    //     $('#dd_expenses').removeAttr('required');
    //     $('#detail_form').parsley();
    // });
};

$.fn.set_file_name = function (filename)
{
    try 
    {
        let doc_name = filename.split('.').slice(0, -1).join('.');
        let doc_ext = filename.split('.').pop();
        let new_name = doc_name + "_Claims_" + moment().format('YYYYMMDDhmmss') + '.' + doc_ext;
        return new_name;
    }
    catch (err) 
    {
        console.log(err);//$.fn.log_error(arguments.callee.caller, err.message);
    }
};

// $.fn.upload_file = function (callback)
// {
//     var data = $('#files').data();
//     $('#files .file-upload.new').each(function (index)
//     {
//         let data = $(this).data('data');

//         if (data.submit)
//         {
//             data.submit().success(function (response)
//             {
//                 if (callback) callback(response.files[0].name);
//             });
//         }
//     });
// };

$.fn.reset_upload_form = function ()
{
    $('#files').html('').removeData();
    $("#btn_add_image").show(200);
}

$.fn.load_editor = function (id)
{
    var editor = CKEDITOR.instances[id];
    if (editor) { editor.destroy(true); }

    //	CKEDITOR.config.contentsCss 	= CURRENT_PATH + 'assets/css/email.css';
    CKEDITOR.config.allowedContent = true;
    CKEDITOR.replace(id,
        {
            height: 300
        });
};

$.fn.bind_command_events = function ()
{
    try
    {
        $('#btn_new').on('click', function (event) 
        {
            event.preventDefault();
            $.fn.show_hide_form('NEW', true);
        });

        $('#btn_reset').click(function (e)
        {
            e.preventDefault();
            $.fn.reset_form('list');
            RECORD_INDEX = 0;
            $.fn.get_list(false);
        });

        $('#btn_back, #btn_cancel').click(function (e)
        {
            e.preventDefault();
            $.fn.show_hide_form('BACK');
            RECORD_INDEX = 0;
            $.fn.get_list(false);
        });

        $('#btn_save').on('click', function (e) 
        {
            e.preventDefault();
            //btn_save = Ladda.create(this);
            //btn_save.start();
            $.fn.add_edit_form();
        });

        $('#div_load_more').click(function (e)
        {
            e.preventDefault();
            $.fn.get_list(true);
        });

        $('#btn_search').click(function (e)
        {
            $('#searchPanel').show();
			$('#btn_search').hide();
        });
        $('#btn_search_action').click(function (e)
        {
            e.preventDefault();
            RECORD_INDEX = 0;
            $.fn.get_list(false);
        });

        $('#btn_reset').click(function (e)
        {
            e.preventDefault();
            $.fn.reset_form('list');
            RECORD_INDEX = 0;
            $.fn.get_list(false);
        });

        $('.status-btn').click(function (e) 
        {
            e.preventDefault();
            let value = $(this).data('value');
            $.fn.change_status_btn(value);

            if ($(this).data('value') == 151 || $(this).data('value') == 152)
            {
                $('#div_postpone').show();
            }
            else
            {
                $('#div_postpone').hide();
            }
        });

        $('#dd_client').on('change', function (e)
        {
            e.preventDefault();
            //            $.fn.get_attendance();
        });


        $('#tp_time_start').on('change', function (e)
        {
            e.preventDefault();

            let time_parts = $(this).val().split(/[\s:]+/);
            let time;

            if (time_parts[1] == '00')
            {
                time = `${time_parts[0]}:30${time_parts[2].toLowerCase()}`;
            }
            else if (time_parts[1] == '30')
            {
                time = `${Number(time_parts[0]) + 1}:00${time_parts[2].toLowerCase()}`;
            }

           // $('#tp_time_end').timepicker('option', 'disableTimeRanges', [['7:00am', time]])
        });

        $('#tp_pp_time_start').on('change', function (e)
        {
            e.preventDefault();

            let time_parts = $(this).val().split(/[\s:]+/);
            let time;

            if (time_parts[1] == '00')
            {
                time = `${time_parts[0]}:30${time_parts[2].toLowerCase()}`;
            }
            else if (time_parts[1] == '30')
            {
                time = `${Number(time_parts[0]) + 1}:00${time_parts[2].toLowerCase()}`;
            }

           // $('#tp_pp_time_end').timepicker('option', 'disableTimeRanges', [['7:00am', time]])
        });

        $('#dp_date_start').on('change', function (e)
        {
            e.preventDefault();
            $('#dp_date_end').val($('#dp_date_start').val());
        });

        $('#dp_pp_date_start').on('change', function (e)
        {
            e.preventDefault();
            $('#dp_pp_date_end').val($('#dp_pp_date_start').val());
        });

        $('#txt_cost, #txt_gst, #txt_roundup').on('click', function (event) 
        {
            event.preventDefault();
            this.select();
        });

        $('#txt_cost, #txt_gst, #txt_roundup').on('change', function (e) 
        {
            e.preventDefault();
            $('#txt_total').val(parseFloat($('#txt_cost').val()) + parseFloat($('#txt_gst').val()) + parseFloat($('#txt_roundup').val()));
        });

        $('#claim_details_toggle').click(function (e)
        {
            e.preventDefault();
            $('#div_claim').slideToggle();
            $(this).find('.fa').toggleClass("fa-chevron-up fa-chevron-down");
        });

    }
    catch (e)
    {
        console.log(e);//$.fn.log_error(arguments.callee.caller, e.message);
    }
}

$.fn.form_load = function ()
{
    try
    {
        $.fn.prepare_form();
        $.fn.bind_command_events();
    }
    catch (e)
    {
        console.log(e);//$.fn.log_error(arguments.callee.caller, e.message);
    }
};

$(document).ready(function ()
{
    $.fn.form_load();
});
