var CASE_ID = CASE_REPLY_ID = 0;
var CASE_NO = '';
var btn_save_reply,btn_save;
var SESSIONS_DATA = $.jStorage.get('session_data');
$.fn.add_edit_comm = function (status_id)
{
    try
    {
        
       console.log($("#detail_form").parsley().validate());
		if ($("#detail_form").parsley().validate() == false) {
      btn_save.stop();
      return;
    }

        let str = JSON.parse(unescape($('#dd_category option:selected').attr('data-val')));
        let c_emp_access_id = str.field1;
        let sla = str.field2;
        let kpi = str.field3;

        let data =
        {
            id: CASE_ID,
            case_no: CASE_NO,
            subject: $('#txt_subject').val(),
            category: $('#dd_category').val(),
            sla: sla,
            kpi: kpi,
            descr: encodeURIComponent($('#txt_descr').val()),
            //filename: $('#files')[0].innerText.trim(),
            name: SESSIONS_DATA.name,
            email: SESSIONS_DATA.office_email,
            // contact_no: SESSIONS_DATA.malaysia_phone,
            c_emp_access_id: c_emp_access_id,
            emp_id: SESSIONS_DATA.emp_id,
            emp_access_id: SESSIONS_DATA.access_level,
            status_id: status_id,
            category_name: $('#dd_category option:selected').text()
        }


        $.fn.write_data
            (
                $.fn.generate_parameter('add_edit_comm', data),
                function (return_data)
                {
                    if (return_data.data)
                    {
                        console.log(return_data,CASE_ID,CASE_NO);
                        CASE_ID = return_data.data.id;
                        $('#h4_primary_no').text('Case No. : ' + return_data.data.case_no);
                        $.fn.show_hide_form('EDIT', false);
                        $('#div_close_btn').show();

                        $('#div_created_date').html(return_data.data.created_date);
                        $('#div_lbl_status').html($('#dd_status option:selected').text());
                        $('#div_reply_by').html(return_data.data.exp_reply_date);

                        if (parseInt(status_id) == 170)  //status closed
                        {
                            $('#dd_status').prop('disabled', true);
                            $('#btn_status,#txt_reply,#div_trail_btn').hide();
                            $('#div_lbl_status').html('<label class="control-label ">Closed</label>');
                        }

                        FILE_UPLOAD_PATH = `${MODULE_ACCESS.module_id}/${CASE_ID}/`;

                        let attachment_data =
                        {
                            id: '',
                            primary_id: return_data.data.case_no,
                            secondary_id: return_data.data.id,
                            module_id: MODULE_ACCESS.module_id,
                            filename: '',
                            filesize: "0",
                            json_field: {},
                            emp_id: SESSIONS_DATA.emp_id
                        };

                        if ($('#files_reply .file-upload.new').length > 0)
                        {
                            $.fn.upload_file('files_reply', 'case_id', CASE_ID,
                                attachment_data, function (total_files, total_success, filename, attach_return_data)
                            {
                                if (total_files == total_success)
                                {
                                    $.fn.populate_fileupload(attach_return_data, 'files_reply', true);
                                }
                            }, false, btn_save);
                        }
                        else
                        {
                            $("#files_reply").empty().append
                                (
                                    $('<div></div>')
                                        .addClass('file-upload')
                                        .append('No Attachment Uploaded')
                                );
                        }

                        $.fn.populate_list(return_data.data.list_open, 1);
                        $.fn.populate_list(return_data.data.list_complete, 2);
                    }
                }, false, btn_save
            );
    }
    catch (e) 
    {
        $.fn.log_error(arguments.callee.caller, e.message);
    }
}
$.fn.add_edit_reply = function ()
{
    try
    {
        if ($('#div_thread').parsley('validate') == false)
        {
            btn_save_reply.stop();
            return;
        }

        let data =
        {
            id: '',
            comm_id: CASE_ID,
            case_no: CASE_NO,
            subject: $('#txt_subject').val(),
            category_name: $('#dd_category option:selected').text(),
            main_descr: encodeURIComponent($('#txt_descr').val()),
            descr: $('#txt_reply_trail').val().replace(/(?:\r\n|\r|\n)/g, '<br/>'),
            emp_access_id: JSON.parse(unescape($('#dd_category option:selected').attr('data-val'))).field1,
            emp_id: SESSIONS_DATA.emp_id,
            name: SESSIONS_DATA.name,
            email: SESSIONS_DATA.office_email,
            contact_no: SESSIONS_DATA.malaysia_phone
        }
		
        $.fn.write_data
            (
                $.fn.generate_parameter('add_edit_comm_reply', data),
                function (return_data)
                {
                    if (return_data.data)
                    {
                        CASE_REPLY_ID = return_data.data.id;
                        FILE_UPLOAD_PATH = `${MODULE_ACCESS.module_id}/${CASE_ID}/`;
						
                        let attachment_data =
                        {
                            id: '',
                            primary_id: CASE_ID,
                            secondary_id: CASE_REPLY_ID,
                            module_id: MODULE_ACCESS.module_id,
                            filename: '',
                            filesize: "0",
                            json_field: {},
                            emp_id: SESSIONS_DATA.emp_id
                        };

                        if ($('#files_reply_trail .file-upload.new').length > 0)
                        {
                            $.fn.upload_file('files_reply_trail', 'case_id', CASE_ID,
                                attachment_data, function (total_files, total_success, filename, attach_return_data)
                            {
                                if (total_files == total_success)
                                {
                                    $.fn.populate_list(return_data.data.list, 3);
                                    $.fn.populate_fileupload(attach_return_data, `files_reply_trail_${CASE_REPLY_ID}`);
                                }
                            }, false, btn_save_reply);
                        }
                        else
                        {
                            $.fn.populate_list(return_data.data.list, 3);
                        }
                    }
                }, false, btn_save_reply
            );
    }
    catch (e) 
    {
		console.log(e);
        $.fn.log_error(arguments.callee.caller, e.message);
    }
}
$.fn.get_reply_list = function (comm_id)
{
    try 
    {
        $('#div_reply').empty();
        $.fn.fetch_data
            (
                $.fn.generate_parameter('get_comm_reply_list', { comm_id: comm_id }),
                function (return_data)
                {
					if( return_data.code == 1 ){
						$("#div_reply_trail").html(`<hr><h6 class='text-center'><i>No trails found</i></h6>`);
					}
                    if (return_data.data)
                    {
                        $.fn.populate_list(return_data.data, 3);
                    }
                }, false, '', false, true
            );
    }
    catch (e) 
    {
        $.fn.log_error(arguments.callee.caller, e.message);
    }
}
$.fn.populate_detail_form = function (data)
{
    try
    {
		
        var data = JSON.parse(data);
        $.fn.show_hide_form('EDIT', true);
        CASE_ID = data.id;
        CASE_NO = data.case_no;
        $('#h4_primary_no').text('Case No. : ' + data.case_no);
        $('#txt_subject').val(data.comm_subject);
        $('#dd_category').val(data.category_id).change();
        $('#dd_status').val(data.status_id).change();
        $('#txt_descr').val(decodeURIComponent(data.descr));
        $('#div_created_date').html(data.created_date);
        $('#div_lbl_status').html($('#dd_status option:selected').text());
        $('#div_reply_by').html(data.exp_reply_date);

        if (parseInt(SESSIONS_DATA.emp_id) == parseInt(data.created_by))
        {
            $('#div_close_btn').show();
        }

        if (parseInt(data.status_id) == 170) //status closed
        {
            $('#dd_status').prop('disabled', true);
            $('#btn_status,#txt_reply,#div_trail_btn').hide();
        }

        $.fn.get_reply_list(CASE_ID);

        if (data.attachment)
        {
            $.fn.populate_fileupload(data, 'files_reply');
        }
        else
        {
            $("#files_reply").empty().append
                (
                    $('<div></div>')
                        .addClass('file-upload')
                        .append('No Attachment Uploaded')
                );
        }
		getInitials();
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
        if (form == 'form')
        {
            CASE_ID = 0;
            CASE_NO = '';
            $('#txt_subject').val('').prop('disabled', false);
            $('#dd_category').val($("#dd_category option:first").val()).change().prop('disabled', false);
            $('#txt_descr').val('').prop('disabled', false);
            $('#dd_status').val($("#dd_status option:first").val()).change().prop('disabled', false);
            $('#h4_primary_no').text('Case No. : -');
            $('#btn_save').html('<i class="fa fa-check"> </i> Save'); $("#target").val($("#target option:first").val());
            $("#files_reply").empty();
            $('#txt_reply').val('');
            $("#files_reply_trail").empty();
            $('#div_lbl_status').html('Open');
        }
        else if (form == 'sub_form')
        {
            //          CASE_REPLY_ID           = '';
            $('#txt_reply').val('');
            $("#files_reply").empty();
            $("#files_reply_trail").empty();
            $("#btn_upload_reply").show(200);
        }
    }
    catch (err)
    {
        $.fn.log_error(arguments.callee.caller, err.message);
    }
};
$.fn.show_hide_form = function (form_status, reset_form)
{

    if (form_status == 'NEW')
    {
        $('#list_div').hide(400);
        $('#new_div').show(400);
        $('#btn_save').show();
		$('#btn_back').show();
		$('#btn_new').hide();
        $('#btn_upload').show();
        $('#div_thread').hide();
        $('#div_status').hide();
        $('#div_close_btn').hide();
        $('#div_hr').hide();
        $.fn.reset_form('form');
    }
    if (form_status == 'EDIT')
    {
        if (reset_form)
        {
            $.fn.reset_form('form');
        }

        $('#list_div').hide(400);
        $('#new_div').show(400);
        $('#txt_subject').prop('disabled', true);
        $('#dd_category').prop('disabled', true);
        $('#txt_descr').prop('disabled', true);
        $('#btn_save').hide();
		$('#btn_back').show();
		$('#btn_new').hide();
        $('#div_thread').show();
        $('#btn_upload').hide();
        $('#div_close_btn').hide();
        $('#div_status').show();
        $('#div_hr').show();
        $('#btn_status,#txt_reply,#div_trail_btn').show();

    }
    else if (form_status == 'BACK')
    {
        $('#new_div').hide(400);
        $('#list_div').show(400);
		$('#btn_back').hide();
		$('#btn_new').show();
    }

};
$.fn.set_validation_form = function () {
  $("#detail_form").parsley({
    successClass: "has-success",
    errorClass: "has-error",
    errors: {
      classHandler: function (el) {
        return $(el).closest(".form-group");
      },
      errorsWrapper: '<ul class="help-block list-unstyled"></ul>',
      errorElem: "<li></li>",
    },
  });

  $("#div_thread").parsley({
    classHandler: function (parsleyField) {
      return parsleyField.$element.closest(".errorContainer");
    },
    errorsContainer: function (parsleyField) {
      return parsleyField.$element.closest(".errorContainer");
    },
  });
};
function get_comm_enquiry_categories(rowData = false) {
  try {
    let row = "";
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
function get_comm_status(rowData = false) {
  try {
    let row = "";
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
$.fn.get_completed_list = function ()
{
    try 
    {
        $.fn.fetch_data
            (
                $.fn.generate_parameter('get_communication_list', { emp_id: SESSIONS_DATA.emp_id, emp_access_id: SESSIONS_DATA.access_level, status_id: "170" }),
                function (return_data)
                {
                    if (return_data.code == 0)
                    {
                        $.fn.populate_list(return_data.data, 2);
                    }
                    else if (return_data.code == 1)
                    {
                        $('#list_comm_completed').empty().append
                            (
                                `<a class="list-group-item">
                            <div class="list-placeholder">No Record</div>
                        </a>`
                            );
                    }
                }, false, '', false, true
            );
    }
    catch (e) 
    {
        $.fn.log_error(arguments.callee.caller, e.message);
    }
}
 function getInitials(){
	 var colors = ["#1abc9c", "#2ecc71", "#3498db", "#9b59b6", "#34495e", "#16a085", "#27ae60", "#2980b9", "#8e44ad", "#2c3e50", "#f1c40f", "#e67e22", "#e74c3c", "#95a5a6", "#f39c12", "#d35400", "#c0392b", "#bdc3c7", "#7f8c8d"];
	 $( ".avatar-initials-medium" ).each(function( index ) {
		 
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
$.fn.populate_list = function (data, list_id)
{
    try 
    {
        if (list_id == 1)
        {
            $('#list_comm_active').empty();
            for (const item of data)
            {
                let item_data = JSON.stringify(item);
				let row = `<div class="tasklist list-unstyled" data-value='${item_data}' onclick='$.fn.populate_detail_form($(this).attr("data-value"))'>
						<div >
								<h4 class="header-title p-0 m-0"><i>${item.comm_subject}</i></h4>
								<hr style="margin-top:10px;margin-bottom:10px;">
								<div class="row mb-1">
									<div class="col-1"style="text-align:right;" >
										<div class="avatar-initials-medium" data-name="${item.from_name}" ></div>
									</div>
									<div class="col-11" style="margin-top:2.5px">
										Request From <b>${item.from_name} - ${item.from_email}</b>
									</div>
								</div>
								<div class="row mb-1">
									<div class="col-1" style="text-align:right;">
										<i class="mdi mdi-format-list-bulleted"></i> 
									</div>
									<div class="col-11" style="float:left;">
										${item.category_desc}
									</div>
								</div>
							</div>
						</div>`;
                $('#list_comm_active').append
                    (row);
				
            }
        }
        else if (list_id == 2)
        {
            $('#list_comm_completed').empty();
            for (const item of data)
            {
                let item_data = JSON.stringify(item);
				
				let row = `<div class="tasklist list-unstyled" data-value='${item_data}' onclick='$.fn.populate_detail_form($(this).attr("data-value"))'>
						<div >
								<h4 class="header-title p-0 m-0"><i>${item.comm_subject}</i></h4>
								<hr style="margin-top:10px;margin-bottom:10px;">
								<div class="row mb-1">
									<div class="col-1"style="text-align:right;" >
										<div class="avatar-initials-medium" data-name="${item.from_name}" ></div>
									</div>
									<div class="col-11" style="margin-top:2.5px">
										Request From <b>${item.from_name} - ${item.from_email}</b>
									</div>
								</div>
								<div class="row mb-1">
									<div class="col-1" style="text-align:right;">
										<i class="mdi mdi-format-list-bulleted"></i> 
									</div>
									<div class="col-11" style="float:left;">
										${item.category_desc}
									</div>
								</div>
							</div>
						</div>`;
                $('#list_comm_completed').append
                    (row);
					
               
            }
        }
        else if (list_id == 3)
        {
            $('#div_reply').empty();
            $.fn.reset_form('sub_form');
            for (i = 0; i < data.length; i++)
            {
                let row = '';
                row = `<ul class="panel-comments">
                            <li>
                                <img src="${CURRENT_PATH}assets/img/profile_default.jpg" alt="profile">
                                <div class="content">
                                    <span class="commented"><a href="#">${data[i].created_by_name}</a> commented on <a href="#">${data[i].created_date}</a></span>
                                    ${decodeURIComponent(data[i].descr)} <br/><br/>
                                    <div id="files_reply_trail_${data[i].id}"></div>
                                </div>
                            </li>
                        </ul>`;
						
				newRow = `<div class="d-flex align-items-start mb-3">
								 <div style="margin-right:0.75rem" class="avatar-initials-medium" width="30" height="30" data-name="${data[i].created_by_name}" ></div>
								 <div class="w-100">
									 <h5 class="mt-0 mb-2"><a href="contacts-profile.html" class="text-reset">${data[i].created_by_name}</a> <small class="text-muted">${data[i].created_date}</small></h5>
									  ${decodeURIComponent(data[i].descr)}
									 <div id="files_reply_${data[i].id}" class="mt-2"></div>
								 </div>
							 </div>`;
                $('#div_reply_trail').append(newRow);
				//fetch attachment files
				  let get_param = {
					id: "",
					module_id: MODULE_ACCESS.module_id,
					method: "get_files",
					primary_id: CASE_ID,
					secondary_id: CASE_REPLY_ID,
					token: $.jStorage.get("token"),
				  };
					console.log(data[i].id);
				  $.fn.fetch_data(
					$.fn.generate_parameter("get_files", get_param),
					function (return_data_attachment) {
					  if (return_data_attachment.data) {
						  console.log(return_data_attachment);
						let attachment_data = [];
						attachment_data.attachment = return_data_attachment.data;
						$.fn.populate_fileupload(
						  attachment_data,
						  `files_reply_${CASE_REPLY_ID}`,
						  true
						);
					  }
					},
					true
				  );
                if (data[i].attachment)
                {
                    $.fn.populate_fileupload(data[i], `files_reply_trail_${CASE_REPLY_ID}`);
                }
            }
        }
		getInitials();
    }
    catch (e) 
    {
        $.fn.log_error(arguments.callee.caller, e.message);
    }
}
$.fn.get_new_list = function ()
{
    try 
    {
        $.fn.fetch_data
            (
                $.fn.generate_parameter('get_communication_list', { emp_id: SESSIONS_DATA.emp_id, emp_access_id: SESSIONS_DATA.access_level, status_id: "167" }),
                function (return_data)
                {
                    if (return_data.data)
                    {
                        console.log(return_data);
                        $.fn.populate_list(return_data.data, 1);
                    }
                    else if (return_data.code == 1)
                    {
                        $('#list_comm_active').empty().append
                            (
                                `<a class="list-group-item">
                            <div class="list-placeholder">No Record</div>
                        </a>`
                            );
                    }
                }, false, '', false, true
            );
    }
    catch (e) 
    {
        $.fn.log_error(arguments.callee.caller, e.message);
    }
}
$.fn.bind_command_events = function()
 {	
	 try
	 {
        $('#btn_status').click(function (e)
        {
            e.preventDefault();
            btn_save = Ladda.create(this);
            btn_save.start();
            $.fn.add_edit_comm(170);
        });
		$('#btn_new').click(function (e)
        {
            event.preventDefault();
            $.fn.show_hide_form('NEW');
        });
		$('#btn_back').click(function (e)
        {
            event.preventDefault();
            $.fn.show_hide_form('BACK');
        });
		$('#btn_reply_trail').click(function (e)
        {
            event.preventDefault();
            btn_save_reply = Ladda.create(this);
            btn_save_reply.start();
            $.fn.add_edit_reply();
        });
		$('#btn_save').click(function (e)
        {
            e.preventDefault();
            btn_save = Ladda.create(this);
            btn_save.start();
            $.fn.add_edit_comm("167");
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
		var params = {
			emp_id:SESSIONS_DATA.emp_id
		}
		var data = [
			{ func: "get_comm_enquiry_categories", params: params },
			{ func: "get_comm_status", params: params }
		];
		$.fn.get_everything_at_once_altrawise(data);
		$.fn.set_validation_form();
		$.fn.get_new_list();
		$.fn.get_completed_list();
		getInitials();
		$.fn.intialize_fileupload("fileupload_reply", "files_reply");
        $.fn.intialize_fileupload("fileupload_reply_trail", "files_reply_trail");
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
 
