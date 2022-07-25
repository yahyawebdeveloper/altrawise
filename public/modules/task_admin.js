/**
 * @author Jamal
 * @date 01-Oct-2021
 * @Note = Please do not apply Ctr-Alt-Format for better readable codes
 *         Please follow the indentation
 *         Please follow the naming convention
 */
var RECORD_INDEX 	= 0;
var upload_section 	= '';
var btn_save,SCHEDULE_TYPE,flatpickrStartDate,flatpickr1,flatpickrFreeze,flatpickrExpireDate,flatpickrDeadlineDate,flatpickrDeadlineDateEdit,btn_save_template;
var ROW_ID			= '';
var SESSIONS_DATA = $.jStorage.get('session_data');
var UI_DATE_FORMAT = 'DD-MMM-YYYY';
var TASK_ID 		= '';
var UPLOADED_SCHEDULED_DATA = '';
var CODE_TRIGGERED = false;
var TEMP_ROW ='';
$.fn.update_assignee_checklist_when_pick_template = function(data)
{
	try 
	{	
        $.fn.write_data
        (
            $.fn.generate_parameter('save_checklist_for_master_task', data),
            function(return_data)
            {
				console.log(return_data,"innerc");
                if (return_data.data)  // NOTE: Success
                {   
                    $.fn.show_right_success_noty('CheckList has been updated successfully');
                }
            },false, false, false
        );

	}
	catch(err)
	{
		console.log(err,"uac");
		//$.fn.log_error(arguments.callee.caller,err.message);
	}
};
$.fn.populate_template_assignee_row = function (templateId)
{
    try 
    {
		//console.log(templateId,"templateId");
		
    	$.fn.fetch_data
		(
			$.fn.generate_parameter('get_task_template_detail', {task_id : templateId}),
		    function(return_data)
		    {
				//console.log(return_data,"return_data");
				var assignees = return_data.data.assignees;
				var assignees_array = [];
				//console.log(assignees,"assignees");
				if(assignees)
                {
					let i=0;
                    for(; i < assignees.length;i++)
		            {
						let r_data = assignees[i];
						let json_field = r_data.json_field;
						
						
						
						
						//add assignee
						let assigneeData = 
						{
							id 				: 0,
							task_no         : TASK_ID,
							type			: r_data.type,
							user_id 		: r_data.user_id,
							action 			: r_data.action,
							emp_id 			: SESSIONS_DATA.emp_id
						};

						//console.log(assigneeData,"assigneeData");
						$.fn.write_data(
							$.fn.generate_parameter('add_assignee_for_master_task', assigneeData),
							function(return_data)
							{
								//console.log(return_data,"assigneeDatareturn_data");
								if (return_data.data)  // NOTE: Success
								{   
									

										
											let r_data = return_data.data;
											r_data.json_field = json_field;
											$.fn.populate_assignee_row(r_data,'add',true,i);
											
											
											/* let btn_link = btn_edit = btn_delete = btn_delete_dropdown = btn_edit_dropdown = btn_link_dropdown = btn_checklist_dropdown = btn_checklist = '';
											if (SESSIONS_DATA.emp_id == Number(r_data.created_by))
											{
												btn_delete = `<a href="javascript:void(0);" class="action-icon" onClick="$.fn.remove_assignee('${r_data.id}')"> <i class="mdi mdi-delete"></i></a>`;
												
											}
											if (SESSIONS_DATA.emp_id == Number(r_data.created_by) || SESSIONS_DATA.emp_id == Number(r_data.user_id))
											{
												btn_checklist = `<button type="button" class="btn btn-warning waves-effect waves-light btn-xs" onclick="$.fn.view_checklist('${escape(JSON.stringify(r_data))}')">
																			<i class="fa fa-tasks fa-fw" aria-hidden="true"></i> CheckList
																		</button>`;

												btn_edit = `<a href="javascript:void(0);" class="action-icon btn_assignee_edit" data-xid="${i}" data-status="${r_data.status_id}"> <i class="mdi mdi-square-edit-outline"></i></a>`;	
											}
											let row = `<div class="card mb-2 assignee-row assignee-row-${r_data.id}" data='${JSON.stringify(r_data)}' id="assignee-row-${r_data.id}">
												<div class="card-body">
													<div class="row align-items-center assignee-row-data">
														<div class="col-sm-4">
															<div class="d-flex align-items-start">
																<div class="w-100">
																	<h4 class="mt-0 mb-2 font-16">${r_data.name} - ${r_data.company}</h4>
																	<p class="mb-1"><b>Action:</b> ${r_data.action}</p>
																</div>
															</div>
														</div>
														
														<div class="col-sm-4">
															<div class="text-center button-list">
																
																${btn_checklist}
															</div>
														</div>
														
														<div class="col-sm-2">
															<div class="text-sm-end text-center mt-2 mt-sm-0">
																${btn_edit}
																${btn_delete}
															</div>
														</div> <!-- end col-->
													</div> <!-- end row -->
													
												</div>
											</div>`;
											$('#assignee_list').append(row); */
											
								}
							},false, false, true
						);
						//add assignee

							
                    }
					
					if( i == assignees.length )
						btn_save_template.removeAttr("data-template-id");
                }
			}, false, '', true, true
		);
    } 
    catch (e)
    {
		$("#loading").html("Error");
		$("#btn_save").removeAttr("data-template-id");
        $.fn.log_error(arguments.callee.caller, e.message);
    }
}
function get_holidays_list(data)
{
	try
	{
		
		var result 	= {};
	 	$.fn.fetch_data
		(	
			$.fn.generate_parameter('get_holidays_list',data),	
			function(return_data)
			{
				if(return_data)
				{
					let data = JSON.stringify(return_data.data);
					$("#task_creation_date").attr("data-public-holidays",data); 
				}
			},true
		);
		
	}
	catch(err)
	{
		console.log(err.message);
		//$.fn.log_error(arguments.callee.caller,err.message);
	}
};
function getBusinessDateCount (startDate, endDate, holidays = false) {
    var elapsed, daysBeforeFirstSaturday, daysAfterLastSunday;
    var ifThen = function (a, b, c) {
        return a == b ? c : a;
    };

    elapsed = endDate - startDate;
    elapsed /= 86400000;

    daysBeforeFirstSunday = (7 - startDate.getDay()) % 7;
    daysAfterLastSunday = endDate.getDay();

    elapsed -= (daysBeforeFirstSunday + daysAfterLastSunday);
    elapsed = (elapsed / 7) * 5;
    elapsed += ifThen(daysBeforeFirstSunday - 1, -1, 0) + ifThen(daysAfterLastSunday, 6, 5);
	result = new Array();
	if( holidays ){
		let start	= startDate.getTime();
		let end 	= endDate.getTime();
		var holidays = JSON.parse($("#task_creation_date").attr("data-public-holidays"));
		
		let holidaysArray = new Array();
		for( let i=0; i<holidays.length;i ++){
			
				finalDate = new Date(holidays[i].holiday);
				finalDate.setHours( 0,0,0,0 );
				holidaysArray.push(finalDate.getTime());
		}
		result = holidaysArray.filter(filterNumbers(start, end));
	}	

    return Math.ceil((elapsed-1)-result.length);
}

function filterNumbers(min, max) {
    return function (a) { return a >= min && a <= max; };
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
$.fn.populate_upload_schedule = function (data)
{
    try 
    {
		
    	$('#tbl_upload_body').empty();
		if (data.length > 0) // check if there is any data, precaution
		{
			let row			= '';
			let start_date	= '';
			let expiry_date = '';
			let status_icon	= '';
			for(var i = 0; i < data.length; i++)
			{
				start_date 	= moment(data[i].start_date, 'YYYY-MM-DD H:i').format('D-MMM-YYYY H:mm A');
				status_icon	= '<i class="fa fa-check-circle text-warning"></i>';
				
				if(data[i].expiry_date != "NULL" && data[i].expiry_date != null)
				{
					expiry_date = moment(data[i].expiry_date, 'YYYY-MM-DD H:i').format('D-MMM-YYYY H:mm A');
				}
				else
				{
					expiry_date = '';
				}
				
				if(data[i].status == false)
				{
					status_icon = '<i class="fa fa-times-circle text-danger"></i>';
				}
				if(data[i].result == true)
				{
					status_icon = '<i class="fa fa-check-circle text-success"></i>';
				}
				
				row += `<tr class="timesheet" data-value='${escape(JSON.stringify(data[i]))}'>
			                <td>${status_icon}</td>
			                <td>${data[i].title}</td>
			                <td>${data[i].company_name}</td>
			                <td>${data[i].task_type_name}</td>
			                <td>${data[i].schedule_type}</td>
			                <td>${data[i].priority_name}</td>
			                <td><span style="white-space: nowrap;">${start_date}</span></td>
			                <td><span style="white-space: nowrap;">${expiry_date}</span></td>             
			            </tr>`;
			}
			$('#tbl_upload_body').append(row);
		}
    	$('#upload_modal').modal('show');
    } 
    catch (e) 
    {
        $.fn.log_error(arguments.callee.caller, e.message);
    }
}
$.fn.add_upload_batch = function()
{
    try 
    {
    	if(UPLOADED_SCHEDULED_DATA == '')
		{
    		$.fn.show_right_error_noty('Uploading data cannot be empty');
    		btn_save_upload_batch.stop();
    		return;
		}
    	
    	let data =
        {
			scheduled_data 	: UPLOADED_SCHEDULED_DATA,
			emp_id    		: SESSIONS_DATA.emp_id
        }
    	
    	$.fn.write_data
        (
            $.fn.generate_parameter('add_schedule_upload_batch', data),
            function(return_data)
            {
                if(return_data.data)
                {
                	$('#btn_add_upload_batch').hide();
                	$.fn.populate_upload_schedule(return_data.data);
                    $.fn.show_right_success_noty('Data has been recorded successfully');
                    RECORD_INDEX = 0;
                    $.fn.get_list(false);
					$("#upload_modal").modal('hide');
                }
            }, false,btn_save_upload_batch
        );
    	
    } 
    catch (e) 
    {
        $.fn.log_error(arguments.callee.caller, e.message);
    }
}
$.fn.set_line_strike = function (obj)
{
	var data_i = $(obj).attr("data-i");
    if($(obj).is(':checked')) 
    {
    	//$(obj).next(".task-description").addClass("done");
		$(".task-description[data-i='"+data_i+"']").addClass("done");
    }
    else
    {
    	//$(obj).next(".task-description").removeClass("done");
		$(".task-description[data-i='"+data_i+"']").removeClass("done");
    }
    $.fn.save_checklist_for_master_task();
}
$.fn.update_assignee = function()
{
	try 
	{	
        if($('#assignee_form').parsley( 'validate' ) == false)
		{
			btn_update_assignee.stop();
			return;
		}

        let id 		    = $('#btn_update_assignee').attr('data-id');
        
        let data = 
        {
            id 				: id,
            task_no         : TASK_ID, 
			type 			: $("#dd_assign_to_edit option:selected").attr('data-type'),
			user_id 		: $("#dd_assign_to_edit").val(),
			action 			: $('#txt_action_edit').val(),
			deadline_date 	: $('#deadline_date_edit').val(),
			status_id 		: $('#dd_status_edit').val(),
			emp_id 			: SESSIONS_DATA.emp_id,
			is_active 		: 1
        };
        
		$.fn.write_data
        (
            $.fn.generate_parameter('add_assignee_for_master_task', data),
            function(return_data)
            {
                if (return_data.data)  // NOTE: Success
                {   
                    let r_data = return_data.data;
                    //file upload
                    FILE_UPLOAD_PATH = `../files/${MODULE_ACCESS.module_id}/${TASK_ID}/`;

                    let attachment_data =
                    {
                        id: '',
                        primary_id: TASK_ID,
                        secondary_id: r_data.id,
                        module_id: MODULE_ACCESS.module_id,
                        filename: '',
                        filesize: "0",
                        json_field: {},
                        emp_id: SESSIONS_DATA.emp_id
                    };

                    let file_uploaded = 0;
                    let files_count = $(`#upload-files-${r_data.id} .file-upload.new`).length;
                    
                    if (files_count > 0)
                    {   
                        $.fn.upload_file(`upload-files-${r_data.id}`, 'task_id', TASK_ID,
                            attachment_data, function (total_files, total_success, filename, attach_return_data)
                        {
                            if (total_files == total_success)
                            {   
                                if(file_uploaded == files_count)
                                {
                                    $.fn.populate_assignee_row(r_data, 'edit');
                                    $.fn.populate_fileupload(attach_return_data, `assignee-files-${r_data.id}`, true);
                                }
                                file_uploaded++;
                            }
                        }, false, btn_update_assignee);
						
                    }
                    else
                    {
                        $.fn.populate_assignee_row(r_data, 'edit');
                        btn_update_assignee.stop();
                    }

                }
            },false, true
        );

	}
	catch(err)
	{
		$.fn.log_error(arguments.callee.caller,err.message);
	}
};
 function GetDateNoTime(str) {
	
	var arr = str.split('-');
	var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun','Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
	var i = 1; 
	for (i; i <= months.length; i++) { 
		  if (months[i] == arr[1])
		   {                   
			 break;                     
		   } 
	}
				 
	var formatddate = (i+1)  + '/' + arr[0] + '/' + arr[2]; 
	return formatddate;
}
$.fn.edit_assignee = function(data,xid=false)
{
	try 
	{   
        $.fn.reset_form('assignee_form');
        let deadlineDays = diffOfDays = 0;

        let r_data 		= $.fn.get_json_string(data);
		let status_name = (r_data.status_name == null ) ? 'Not Set' : r_data.status_name;
		let status_id = (r_data.status_id == null ) ? '' : r_data.status_id;
		if( r_data.deadline_date ){
			let date1 		= $("#task_creation_date").val();
			date1 			= date1.split(" ");
			date1	 		= date1[0];
			date1 			= new Date(date1);
			let date2 		= r_data.deadline_date;
			var retDate 	= GetDate(r_data.deadline_date);
			date2 			= new Date(retDate);		
			diffOfDays 	= getBusinessDateCount(date1,date2,true);
		}
		//open the modal
		$('#addEditAssigneeModal').modal('show');

		$('#btn_add_assignee').html('<i class="fa fa-edit"></i> Update').data({'mode' : 'update', 'id' : r_data.id});
		$('#assigneeModalLabel').html('Update Assignee');

        $('#txt_action').val(r_data.action);
        //$('#deadline_date').val(r_data.deadline_date);
		if(xid && xid > 0 ){
			let prevStatus = $(".btn_assignee_edit[data-xid='"+(xid-1)+"']").attr("data-status");
			
			if( prevStatus == 252 )
				$('#dd_status').attr('disabled','disabled');
		}
       
        // var newCondition = `<td style="max-width: 300px;">
        //                         <select id="dd_assign_to_edit" class="select2Plugin" required="true" style="width:100%;">
        //                             <optgroup label="Individual" id="dd_assign_to_individual_edit">
        //                             </optgroup>
        //                             <optgroup label="Company" id="dd_assign_to_company_edit">
        //                             </optgroup>
        //                         </select>
        //                     </td>
        //                     <td><input type="text" class="form-control marginBottom10px" id="txt_action_edit" maxlength="150" required="required"></td>
		// 					<td><input type="text" class="form-control marginBottom10px" id="provide_days_edit"  onchange="$.fn.calculate_deadline_date(this,edit=true)" placeholder="Provide days" required="required" ></td>
        //                     <td>
        //                         <div class="input-group date">
        //                             <input type="text" id="deadline_date_edit" class="form-control flatpickr-input" data-date-format="dd-mm-yyyy" data-format="dd-mm-yyyy" placeholder="dd-mmm-yyyy" required="required">
                                   
        //                         </div>
        //                     </td>
        //                     <td>
        //                         <select id="dd_status_edit" ${disableStr} style="width:100%" class="select2Plugin">
                                
        //                         </select>
        //                     </td>
        //                     <td>
        //                         <button id="btn_cancel_assignee" type="button" class="btn btn-light waves-effect btn-xs" data-id="${r_data.id}">
        //                             Cancel
        //                         </button>
        //                         <span class="btn btn-success waves-effect waves-light fileinput-button btn-xs" id="btn_update_image">
        //                             <span><i class="dripicons-paperclip"></i></span>
                                    
        //                         </span>
        //                         <button id="btn_update_assignee" type="button" class="btn btn-info waves-effect waves-light btn-xs" data-id="${r_data.id}">
        //                             Update
        //                         </button>
        //                     </td>`;
        
        // //add active class for the current row
        // $(`.assignee-row-${r_data.id}`).addClass('activeRow');

        // //store current row in temporary storage
        // TEMP_ROW = $(`#assignee-row-${r_data.id}`).html();

        // //replace the table row with edit form
        // $(`#assignee-row-${r_data.id}`).html(newCondition);
		
		$("#provide_days").val(diffOfDays);
        // //hide the add form
        // $(`#base_row_assignee`).hide();

        // //re-initialise the plugins and values for edit form
        // $('.select2Plugin').select2
        // ({
        //     placeholder : 'Please Select'
        // });
		
        $.fn.populate_dd_values('dd_status', STATUS);
        $.fn.populate_dd_values('dd_assign_to', ASSIGN_TO);
        $('#dd_status').val(status_id);
        $('#dd_status').change();

        if(r_data.type == 'individual')
            $("#dd_assign_to #dd_assign_to_individual option[value='"+r_data.user_id+"']").attr('selected', 'selected');
        else
            $("#dd_assign_to #dd_approval_company option[value='"+r_data.user_id+"']").attr('selected', 'selected');

        $('#dd_assign_to').change();
		
        // //overwrite add form values for validation
        // if(r_data.type == 'individual')
        //     $("#dd_assign_to #dd_assign_to_individual option[value='"+r_data.user_id+"']").attr('selected', 'selected');
        // else
        //     $("#dd_assign_to #dd_approval_company option[value='"+r_data.user_id+"']").attr('selected', 'selected');

        // $('#dd_assign_to').val(r_data.user_id).change();
		
        // $('#txt_action_edit').val(r_data.action);

        // $.fn.intialize_fileupload('doc_upload_edit', `upload-files-${r_data.id}`); 
		
        //hide the elements as per the user
        if (SESSIONS_DATA.emp_id != Number(r_data.created_by))
        {
            $("#dd_assign_to").select2("readonly", true);
            $("#txt_action").attr("readonly", "readonly");
            $("#deadline_date").attr("readonly", "readonly");
        }
        else
        {
			
			// var flatpickrDeadlineDate = $("#deadline_date").flatpickr({
			// 	altInput: true,
			// 	altFormat: "d-M-Y",
			// 	dateFormat: "Y-m-d",
			// });
			
			if( r_data.deadline_date ){
				var retDate = GetDate(r_data.deadline_date);
				var dateObject = new Date(retDate);
				var retDate = dateObject.toString();
				
				flatpickrDeadlineDate.setDate(dateObject);
			}
        }
    }
	catch(err)
	{
		$.fn.log_error(arguments.callee.caller,err.message);
	}
};
$.fn.remove_assignee = function(assignee_id)
{
    try
    {   
        bootbox.confirm
        ({
            title: "Delete Confirmation",
            message: "Are you sure to delete this assignee?.",
            buttons:
            {
                cancel:
                {
                    label: '<i class="fa fa-times"></i> Cancel'
                },
                confirm:
                {
                    label: '<i class="fa fa-check"></i> Yes'
                }
            },
            callback: function (result)
            {
                if (result == true)
                {   
                    let data = 
                    {
                        assignee_id 	: assignee_id,
                        emp_id 			: SESSIONS_DATA.emp_id
                    };
                    $.fn.write_data
                    (   
                        $.fn.generate_parameter('remove_assignee_for_master_task', data),
                        function(return_data)
                        {
                            if (return_data.data)  // NOTE: Success
                            {   
                                $.fn.show_right_success_noty('Assignee has been removed successfully');
                                let row_id = $('.assignee-row-' + assignee_id);
                	            row_id.hide('slow', function() { row_id.remove(); });
                            }
                        },false, true
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
$.fn.get_checklist_list = function()
{
	try
	{
		let checklist = [];
		$(".task-description[data-i]").each(function()
		{
			var data_i = $(this).attr("data-i");
			checklist.push({name : $(".task-description[data-i='"+data_i+"']").text(), strike :  $(".dragdrop[data-i='"+data_i+"']").is(':checked') });
		});
		return checklist;
		
	}
	catch(err)
	{
		$.fn.log_error(arguments.callee.caller,err.message);
	}
};
$.fn.save_checklist_for_master_task = function()
{
	try 
	{	
        let assignee_id = $('#txt_assignee_id').val();
        let data = 
        {
            assignee_id 	: assignee_id,
            checklist		: $.fn.get_checklist_list(),
			emp_id 			: SESSIONS_DATA.emp_id
        };
        $.fn.write_data
        (
            $.fn.generate_parameter('save_checklist_for_master_task', data),
            function(return_data)
            {
                if (return_data.data)  // NOTE: Success
                {   
                    //$(`#assignee-row-${assignee_id}`).attr(`data`, `${JSON.stringify(return_data.data)}`);
                    $.fn.populate_assignee_row(return_data.data, 'edit', false);
                    $.fn.show_right_success_noty('CheckList has been updated successfully');
                }
            },false, false
        );

	}
	catch(err)
	{
		$.fn.log_error(arguments.callee.caller,err.message);
	}
};
$.fn.add_checklist = function ()
{
    try
    {
    	if($('#txt_checklist').val() == '')
		{
    		$.fn.show_right_error_noty('Checklist Description is mandatory');
			return;
		}
    	
    	let return_it 	= false;
		
		$("#ul_checklist > .card > .card-body > .align-itames-start > .w-100 > .dragdrop-right > h5").each(function()
		{
			if($('#txt_checklist').val() == $(this).text())
			{
				return_it = true;
			}
		});
		
		if(return_it) return;
    	
		let data = [{name : $('#txt_checklist').val()}];
		$.fn.populate_checklist(data,false, add=true);
    	$('#txt_checklist').val('');
        $.fn.save_checklist_for_master_task();
    	
    } 
    catch (e) 
    {
        $.fn.log_error(arguments.callee.caller, e.message);
    }
}
$.fn.view_checklist = function(data)
{
    try
    {  
		console.log("chk",data);
        var data = JSON.parse(unescape(data));
        let assignee_id = data.id;
        let json_field = $.fn.get_json_string(data.json_field);
	
        $('#txt_assignee_id').val(assignee_id);
        $('#ul_checklist')	.empty();
        
        if(json_field.checklist)
        {

            $.fn.populate_checklist(json_field.checklist, data.created_by);
        }
        $('#checklistModal').modal('show');
    }
    catch(err)
    {
        $.fn.log_error(arguments.callee.caller,err.message);
    }
};
$.fn.populate_assignee_row = function(r_data, mode, is_assignee = true, i = false)
{
	try 
	{   
		console.log(r_data,"jsfieldtest");
        let btn_link = btn_edit = btn_delete = btn_checklist = '';
        if (SESSIONS_DATA.emp_id == Number(r_data.created_by))
        {
            // btn_delete = `<button type="button" class="btn btn-danger waves-effect waves-light btn_assignee_delete btn-xs" onClick="$.fn.remove_assignee('${r_data.id}')"><i class="mdi mdi-delete" aria-hidden="true"></i></button>`;
			btn_delete = `<a href="javascript:void(0);" class="action-icon" onClick="$.fn.remove_assignee('${r_data.id}')"> <i class="mdi mdi-delete"></i></a>`;
		}
        if (SESSIONS_DATA.emp_id == Number(r_data.created_by) || SESSIONS_DATA.emp_id == Number(r_data.user_id))
        {
            btn_checklist = `<button type="button" class="btn btn-warning btn-xs" onclick="$.fn.view_checklist('${escape(JSON.stringify(r_data))}')">
                                        <i class="fa fa-tasks fa-fw" aria-hidden="true"></i> CheckList
                                    </button>`;
            btn_edit = `<a href="javascript:void(0);" class="action-icon btn_assignee_edit" data-xid="${i}" data-status="${r_data.status_id}"> <i class="mdi mdi-square-edit-outline"></i></a>`;
			btn_link = ``;
        }
		let deadlineDays = 0;
		let status_name = (r_data.status_name) ? r_data.status_name : 'Not Set';
		let deadline_date = (r_data.deadline_date) ? r_data.deadline_date : 'Not Set';
		if( r_data.deadline_date )
		{
			let date1 = $("#task_creation_date").val();
			date1 = date1.split(" ");
			date1 = date1[0];
			date1 = new Date(date1);
			var retDate = GetDate(r_data.deadline_date);
			date2 = new Date(retDate);
			deadlineDays = getBusinessDateCount(date1, date2,true);
		}
		let row_data =  `<div class="row align-items-center assignee-row-data">
				<div class="col-sm-4">
					<div class="d-flex align-items-start">
						<div class="w-100">
							<h4 class="mt-0 mb-2 font-16">${r_data.name}</h4>
							<p class="mb-1"><b>Action:</b> ${r_data.action}</p>
						</div>
					</div>
				</div>
				<div class="col-sm-4">
					<div class="my-3 my-sm-0">
						<p class="mb-0"><b>Status:</b> ${status_name}</p>
						<p class="mb-0 text-muted"><b>Deadline:</b> ${deadline_date}</p>
					
					</div>
				</div>
				<div class="col-sm-2">
					<div class="text-center button-list">
						${btn_link}
						${btn_checklist}
					</div>
				</div>
				
				<div class="col-sm-2">
					<div class="text-sm-end text-center mt-2 mt-sm-0">
						${btn_edit}
						${btn_delete}
					</div>
				</div> <!-- end col-->
			</div> <!-- end row -->`;

			let row = `<div class="card mt-2 shadow rounded assignee-row assignee-row-${r_data.id}" data='${JSON.stringify(r_data)}' id="assignee-row-${r_data.id}">
				<div class="card-body">
					${row_data}
					<div class="row">
						<div id="assignee-files-${r_data.id}"></div>
						<div id="upload-files-${r_data.id}" class="files"></div>
					</div>
				</div>
			</div>`;

        if(mode == 'edit')
        {
			
            $(`#assignee-row-${r_data.id} .assignee-row-data`).replaceWith(row_data);
            // $('#tbl_assign_to tbody tr').removeClass('activeRow');
            $('.btn_assignee_edit').removeAttr('disabled');
            if(is_assignee)
                $.fn.show_right_success_noty('Assignee has been updated successfully');
        }
        else if(mode == 'add')
        {
            // row += `<tr class="assignee-row assignee-row-${r_data.id}">
            //             <td colspan="6">
            //                 <div id="assignee-files-${r_data.id}"></div>
            //                 <div id="upload-files-${r_data.id}" class="files"></div>
            //             </td>
            //         </tr>`;
            $('#assignee_list').append(row);
			$("#loading").html("");
            $.fn.show_right_success_noty('Assignee has been added successfully');
			if(r_data.json_field ){
				
				let chkData = 
				{
					assignee_id 	: r_data.id,
					checklist		: JSON.parse(r_data.json_field),
					emp_id 			: SESSIONS_DATA.emp_id
				};
				$.fn.update_assignee_checklist_when_pick_template(chkData);
			} 
        }

        $.fn.reset_form('assignee_form');

        
    }
	catch(err)
	{
		$.fn.log_error(arguments.callee.caller,err.message);
	}
};
$.fn.get_tasks_drop_down_values = function()
{
    try
    {   
        let lead_access = $.fn.get_accessibility(152);
        let data    =
        {   
            emp_id   : SESSIONS_DATA.emp_id,
            view_all : MODULE_ACCESS.viewall,
            lead_access_view_all : lead_access.viewall,
            lead_access_view     : lead_access.view
        };

        $.fn.fetch_data
        (
            $.fn.generate_parameter('get_tasks_drop_down_values', data),
            function(return_data)
            {
                if (return_data.code == 0)
                {   
                    $.fn.populate_dd_values('dd_assign_to', return_data.data.assign_to);
                    ASSIGN_TO = return_data.data.assign_to;
					$.fn.populate_dd_values('dd_status', return_data.data.status);
                    STATUS = return_data.data.status;
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
        if(element_id == 'dd_assign_to')
        {   
            $('#dd_assign_to_individual').empty();
            for (let item of dd_data.employees)
            {
                $('#dd_assign_to_individual').append(`<option 
                                                     data-type="individual" 
                                                     value="${item.id}">${item.descr}
                                                     </option>`
                                                   );
            }
            $('#dd_assign_to_company').empty();
            for (let item of dd_data.companies)
            {
                $('#dd_assign_to_company').append(`<option 
                                                 data-type="company" 
                                                 value="${item.id}">${item.descr}
                                                 </option>`
                                                );
            }
        }
        else if(element_id == 'dd_assign_to_edit')
        {
            $('#dd_assign_to_individual_edit').empty();
            for (let item of dd_data.employees)
            {
                $('#dd_assign_to_individual_edit').append(`<option 
                                                     data-type="individual" 
                                                     value="${item.id}">${item.descr}
                                                     </option>`
                                                   );
            }
            $('#dd_assign_to_company_edit').empty();
            for (let item of dd_data.companies)
            {
                $('#dd_assign_to_company_edit').append(`<option 
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
            else if(element_id != 'dd_assign_to')
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

$.fn.add_assignee = function()
{
	try 
	{	
        if($('#assignee_form').parsley().validate() == false)
		{
			btn_save_assignee.stop();
			return;
		}
		let data_a = $('#btn_add_assignee').data();
		let id = 0;
		let mode = 'add';
		if(data_a.mode == 'update' && data_a.id != 0) {
			id = data_a.id;
			mode = 'edit';
		}
        let data = 
        {
            id 				: id,
            task_no         : TASK_ID, 
			type 			: $("#dd_assign_to option:selected").attr('data-type'),
			user_id 		: $("#dd_assign_to").val(),
			action 			: $('#txt_action').val(),
			deadline_date 	: $('#deadline_date').val(),
			status_id 		: $('#dd_status').val(),
			emp_id 			: SESSIONS_DATA.emp_id,
			is_active 		: 1
        };
		
		$.fn.write_data
        (
            $.fn.generate_parameter('add_assignee_for_master_task', data),
            function(return_data)
            {
                if (return_data.data)  // NOTE: Success
                {   
					
                    let r_data = return_data.data;
                
                    //populate assignee row
					$.fn.populate_assignee_row(r_data, mode);
					
                    //file upload
                    FILE_UPLOAD_PATH = `../files/${MODULE_ACCESS.module_id}/${TASK_ID}/`;
					
                    let attachment_data =
                    {
                        id: '',
                        primary_id: TASK_ID,
                        secondary_id: r_data.id,
                        module_id: MODULE_ACCESS.module_id,
                        filename: '',
                        filesize: "0",
                        json_field: {},
                        emp_id: SESSIONS_DATA.emp_id
                    };
					
                    let files_count = $('#doc_upload_files .file-upload.new').length;
                    if (files_count > 0) {
						$.fn.upload_file('doc_upload_files', 'task_id', TASK_ID,
							attachment_data, 
							function (total_files, total_success, filename, attach_return_data) {
								if (total_files == total_success)
								{   
									if(mode == 'add') {
										$.fn.populate_fileupload(attach_return_data, `assignee-files-${r_data.id}`, true);
									}else {
										$.fn.populate_fileupload(attach_return_data, `assignee-files-${r_data.id}`, false);
									}
									
									
								}
							}, 
							false, btn_save_assignee);
					}else {
						// var flatpickrDeadlineDate = $("#deadline_date").flatpickr({
						// 	altInput: true,
						// 	altFormat: "d-M-Y",
						// 	dateFormat: "Y-m-d",
						// });
                        // $.fn.populate_assignee_row(r_data, 'add');
                        // btn_save_assignee.stop();
						$("#btn_add_assignee").removeClass("ladda-button");
						$("#dd_assign_to").val("").change();
						// flatpickrDeadlineDate.clear();
                    }
					
					//close the modal
					$('#addEditAssigneeModal').modal('hide');
                }
            },false,btn_save_assignee, true
        );

	}
	catch(err)
	{
		$.fn.log_error(arguments.callee.caller,err.message);
	}
};
$.fn.show_hide_form = function(form_status,reset_form)
{
	if(reset_form) 
    {   
        $.fn.reset_form('form');
        $.fn.reset_form('assignee_form');
    }
    if(form_status == 'NEW')
    {
		$(".header-with-backBtn").show();
        $('#searchDiv')		.hide(400);
		$("#buttonsDiv")	.hide(400);
        $('#list_task')		.hide(400);
		$('#div_load_more')	.hide(400);
		$('#new_div')		.show();
		$('#h4_primary_no')	.text('Scheduled Task No. : [ NEW ]');
		btn_save_template = $("#btn_save");
		$('#div_assignee')	.hide();
		$.fn.intialize_fileupload('doc_upload', 'doc_upload_files');
    }
    else if(form_status == 'EDIT')
    {
		$(".header-with-backBtn").show();
		$('#searchDiv')		.hide(400);
		$("#buttonsDiv")	.hide(400);
        $('#list_task')		.hide(400);   
        $('#new_div')		.show(400);
		$('#div_load_more')	.hide(400);
		$('#div_assignee')	.show();
        //$('#div_dd_schedule,#div_task_one_time').hide();
    }
    else if(form_status == 'BACK')
    {	
        $('#list_div')		.show(400);
        $('#new_div')		.hide(400);   
    }
    
    if(MODULE_ACCESS.create_it == 0)
	{
    	 $('#btn_save')		.hide();
    	 $('#btn_new')		.hide();
    	 $('#btn_save')		.hide();
	}
    else
    {
    	$('#btn_new')		.show();
	   	$('#btn_save')		.show();
    }
};
$.fn.reset_form = function(form)
{
    try
    {
    	UPLOADED_SCHEDULED_DATA 		= '';
        if(form == 'list')
        {
            $('#txt_title_search')		.val('');
            $('#dd_assign_to_search')	.val('').change();
            $('#dd_created_by_search')	.val('').change();
            $('#dd_dept_search')		.val('0').change();
            $('#dd_status_search')		.val('').change();
            
        }
        else if(form == 'form')
        {
        	TASK_ID				= '';
        	SCHEDULE_TYPE		= '';
        	$("#files")         .empty();
            $('#txt_task')      .val('');
            $('#txtarea_descr') .val('');
            $('#txtarea_descr_action') .val('');
            $('#chk_status')    .attr('checked','checked');
            $.fn.change_switchery($('#chk_status'),true);
            $.fn.change_switchery($('#chk_roll_over'),false);
            $('#dd_priority')   .val(256).change();
            $('#dd_dept')   	.val(0).change();
            $('#dp_start_date')	.val('');
			flatpickrStartDate.clear();
            $('#dp_expire_date').val('');
            $('#dp_freeze_date').val('');
            $('#dd_due_days,#dd_reviewer_due_days,#dd_approver_due_days')	.val('1');
            
            $('#lbl_schedule_desc')		.html('');
            $('#dd_sbg option:eq(0)')	.prop('selected',true).change();
            $('#dd_sbd option:eq(0)')	.prop('selected',true).change();
            $('#dd_oc option:eq(0)')	.prop('selected',true).change();
            $('#dd_group option:eq(0)')	.prop('selected',true).change();
            $('#dd_schedule_or_one_time option:eq(0)')	.prop('selected',true).change();
            
            
	       	$('#btn_save')		.show();
	       	$('#btn_cancel')	.show();
            $('#btn_fileupload,#div_btn,#div_footer').show();
            
            $('.form-group').each(function () { $(this).removeClass('has-error'); });
			$('.help-block').each(function () { $(this).remove(); });
            
            $('#div_assign')	.show();
            $('#ul_assigned')	.empty();
            $('#ul_checklist')	.empty();
            $('#btn_duplicate') .hide();
            $('.check_it').prop('checked', false);
            $.fn.set_schedule_type_button();

			$("#tbl_assign_to tbody").find("tr:not('#base_row_assignee')").remove();
        }
        else if(form == 'duplicate')
    	{
        	TASK_ID				= '';
        	$('#h4_primary_no')	.text('Scheduled Task No. : [ NEW ]');
            $('#btn_save')		.html('<i class="fa fa-check"> </i> Save');
            $('#div_footer')			.show();
            $('#div_assign')			.show();
            $('#btn_fileupload,#div_btn').show();
            $('#btn_duplicate') .hide();
            
            $('#dd_schedule_or_one_time').val(1).change();
            $('#detail_form')	.parsley().destroy();
    		$('#dp_due_date')	.attr('data-parsley-required', 'false').removeAttr('required');
    		$('#dp_start_date')	.attr('data-parsley-required', 'true').prop('required',true);
    		if($('#chk_roll_over').is(':checked'))
    		{
    			$('#dp_freeze_date')	.attr('data-parsley-required', 'true').prop('required',true);
    		}
    		else
    		{
    			
    		}
    		$('#detail_form')	.parsley();
    	}
		else if(form == 'assignee_form')
        {   
            
            $('#dd_assign_to').val("").change();
            $("#txt_action").val("");
            $("#deadline_date").val("");
			$('#provide_days').val(0);
			
			$("#txt_action_edit").val("");
            $('#btn_add_assignee').html('<i class="fa fa-check"> </i> Add').data({'mode' : 'add', 'id' : 0});
			$('#assigneeModalLabel').html('Add Assignee');
            $.fn.set_validation_form();
        }
    }
    catch(err)
    {
        $.fn.log_error(arguments.callee.caller,err.message);
    }
};
$.fn.get_task_template_list = function (is_scroll)
{
    try 
    {	
		var data	= 
		{
			title			: $('#txt_tt_title_search').val(),
			is_active		: 1,
			view_all		: MODULE_ACCESS.view_it_all,
			start_index		: RECORD_INDEX,
			limit			: 1000, // get 1000 record max	
			is_admin		: SESSIONS_DATA.is_admin,		
			emp_id			: SESSIONS_DATA.emp_id
	 	};
	 	if(is_scroll)
	 	{
	 		data.start_index =  RECORD_INDEX;
	 	}
	 	
	 	$.fn.fetch_data
		(
			$.fn.generate_parameter('get_tasks_template_list',data),	
			function(return_data)
			{
				$.fn.populate_task_template(return_data.data.list);
			},false
    	);
    } 
    catch (e) 
    {
        $.fn.log_error(arguments.callee.caller, e.message);
    }
}
$.fn.pick_this_template = function (obj)
{
    try 
    {
    	let data = JSON.parse(unescape($(obj).closest('tr').attr('data-value')));

    	if(data)
		{
    		$('#txt_task')      		.val(data.task_title);
            $('#txtarea_descr') 		.val($.fn.decodeURIComponentSafe(data.descr));
            $('#txtarea_descr_action') 	.val($.fn.decodeURIComponentSafe(data.descr_action));
            $('#dd_type')   			.val(data.task_type_id).change();
            $('#dd_dept')   			.val(data.dept_id).change();
            
            let json_field = $.fn.get_json_string(data.json_field);

            if(json_field.checklist)
        	{
            	$.fn.populate_checklist(json_field.checklist);
        	}
            
		}
    	$('#task_template_modal').modal('hide');
    } 
    catch (e)
    {
        $.fn.log_error(arguments.callee.caller, e.message);
    }
}
$.fn.populate_task_template = function (data)
{
    try 
    {
    	$('#tbl_task_template_body').empty();
		if (data.length > 0) // check if there is any data, precaution
		{
			let row	= '';
			for(var i = 0; i < data.length; i++)
			{
				row += `<tr class="timesheet" data-value='${escape(JSON.stringify(data[i]))}'>
			                <td>${data[i].task_title}</td>
			                <td>${$.fn.decodeURIComponentSafe(data[i].descr)}</td>
			                <td><button type="button" class="btn btn-success waves-effect waves-light" onclick="$.fn.pick_this_template(this)"><i class="fa fa-download"></i> Pick This</button></td>          
			            </tr>`;
			}
			$('#tbl_task_template_body').append(row);
		}
    	$('#task_template_modal').modal('show');
    } 
    catch (e)
    {
       $.fn.log_error(arguments.callee.caller, e.message);
    }
}
$.fn.decodeURIComponentSafe = function (uri, mod)
{   
    if (!uri) {
        return uri;
    }
    var out = new String(),
    arr,
    i = 0,
    l,
    x;
    typeof mod === "undefined" ? mod = 0 : 0;
    arr = uri.split(/(%(?:d0|d1)%.{2})/);
    for (l = arr.length; i < l; i++) {
        try {
            x = decodeURIComponent(arr[i]);
        } catch (e) {
            x = mod ? arr[i].replace(/%(?!\d+)/g, '%25') : arr[i];
        }
        out += x;
    }
    return out;
}
function get_sbd(rowData = false)
{
	try
	{
	 	var row = '';											
		if(rowData)
		{
			for(var i = 0; i < rowData.length; i++)
			{
				
				row += 	`<option value=${rowData[i].id}>
							${rowData[i].desc}
						</option>`;
			}
			$('#dd_sbd').html(row);
			$('#dd_sbd').val(rowData[0].id);
			$('#dd_sbd').select2();
		}
	}
	catch(err)
	{
		console.log(err.message);
		//$.fn.log_error(arguments.callee.caller,err.message);
	}
};
function get_sbg(rowData = false)
{
	try
	{
	 	var row 	= '';											
		if(rowData)
		{	
			for(var i = 0; i < rowData.length; i++)
			{
				row += 	`<option value=${rowData[i].id}>
							${rowData[i].desc}
						</option>`;
			}
			$('#dd_sbg').html(row);
			$('#dd_sbg').val(rowData[0].id);
			$('#dd_sbg').select2();
		}
	}
	catch(err)
	{
		console.log(err.message);
		//$.fn.log_error(arguments.callee.caller,err.message);
	}
};
function get_company(rowData = false)
{
	try
	{
	 	var row = '';											
		if(rowData)
		{
			for(var i = 0; i < rowData.length; i++)
			{	
				row += 	`<option value=${rowData[i].id}>
							${rowData[i].desc}
						</option>`;
			}
			console.log();
			$('#dd_company').html(row);
			$('#dd_company').val(rowData[0].id).change();
			$('#dd_company').select2();
		}
	}
	catch(err)
	{
		console.log(err.message);
		//$.fn.log_error(arguments.callee.caller,err.message);
	}
};
function get_taskTypes(rowData = false)
{
	try
	{
	 	var row = '';											
		if(rowData)
		{
			for(var i = 0; i < rowData.length; i++)
			{
				
				row += 	`<option value=${rowData[i].id}>
							${rowData[i].desc}
						</option>`;
			}
			$('#dd_type').html(row);
			$('#dd_type').val(rowData[0].id);
			$('#dd_type').select2();
		}
	}
	catch(err)
	{
		console.log(err.message);
		//$.fn.log_error(arguments.callee.caller,err.message);
	}
};
function get_priority(rowData = false)
{
	try
	{
	 	var row = '';											
		if(rowData)
		{
			for(var i = 0; i < rowData.length; i++)
			{
				row += 	`<option value=${rowData[i].id}>
							${rowData[i].desc}
						</option>`;
			}
			$('#dd_priority').html(row);
			$('#dd_priority').val(rowData[0].id);
			$('#dd_priority').select2();
			$('#dd_priority_search').html(row);
			$('#dd_priority_search').val('');
			$('#dd_priority_search').select2();
		}
	}
	catch(err)
	{
		console.log(err.message);
		//$.fn.log_error(arguments.callee.caller,err.message);
	}
};
function get_taskGroups(rowData = false)
{
	try
	{
	 	var row = '';											
		if(rowData)
		{
			for(var i = 0; i < rowData.length; i++)
			{
				row += 	`<option value=${rowData[i].id}>
							${rowData[i].desc}
						</option>`;
			}
			$('#dd_group').html(row);
			$('#dd_group').val(rowData[0].id);
			$('#dd_group').select2();
		}
	}
	catch(err)
	{
		console.log(err.message);
		//$.fn.log_error(arguments.callee.caller,err.message);
	}
};
function get_status(rowData = false)
{
	try
	{
	 	var row = '';											
		if(rowData)
		{
			for(var i = 0; i < rowData.length; i++)
			{
				
				row += 	`<a data-value="${rowData[i].id}" class="dropdown-item status-btn" >${rowData[i].desc}</a>`;
						
			}
			$('div[aria-labelledby="btn_status"]').html(row);
		}
	}
	catch(err)
	{
		console.log(err.message);
		//$.fn.log_error(arguments.callee.caller,err.message);
	}
};
function get_assignee(rowData = false)
{
	try
	{
	 	var row = '';											
		if(rowData)
		{
			for(var i = 0; i < rowData.length; i++)
			{
				row += 	`<option value=${rowData[i].id}>
							${rowData[i].desc}
						</option>`;
			}
			$('#dd_reviewer').html(row);
			$('#dd_reviewer').val(rowData[0].id);
			$('#dd_reviewer').select2();
			$('#dd_approver').html(row);
			$('#dd_approver').val(rowData[0].id);
			$('#dd_approver').select2();
			$('#dd_assign_to_search').html(row);
			$('#dd_assign_to_search').val('');
			$('#dd_assign_to_search').select2();
		}
	}
	catch(err)
	{
		console.log(err.message);
		//$.fn.log_error(arguments.callee.caller,err.message);
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
$.fn.get_departments = function(e)
{
	try
	{
		var data	= {};
	 	var row = '<option value="0">All</option>';											
	 	$.fn.fetch_data
		(
			$.fn.generate_parameter('get_departments',data),
			function(return_data)
			{
				if(return_data)
				{
					var rowData = return_data.data;
					for(var i = 0; i < rowData.length; i++)
					{
						row += 	`<option value=${rowData[i].id}>
									${rowData[i].desc}
								</option>`;
					}
					$(e).html(row);
					$(e).val(0).change();
					$(e).select2();
				}
			},true
		);
	}
	catch(err)
	{
		console.log(err.message);
		//$.fn.log_error(arguments.callee.caller,err.message);
	}
};
$.fn.get_list = function (is_scroll, data = null)
{
    try 
    {
    	let status_search = [""];
		if(!data){
			var data	= 
			{
				title			: $('#txt_title_search')	.val(),
				status			: $('#dd_status_search').val(),
				assign_to 		: $('#dd_assign_to_search').val(),
				created_by 		: $('#dd_created_by_search').val(),
				dept_id 		: $('#dd_dept_search').val(),
				view_all		: 1,//MODULE_ACCESS.view_it_all,
				start_index		: RECORD_INDEX,
				limit			: LIST_PAGE_LIMIT,			
				is_admin		: SESSIONS_DATA.is_admin,		
				emp_id			: SESSIONS_DATA.emp_id
			};
		}
		
	 	if(is_scroll)
	 	{
	 		data.start_index =  RECORD_INDEX;
	 	}
	 	$.fn.fetch_data_for_list
		(
			
			$.fn.generate_parameter('get_schedule_tasks_list',data),
			$.fn.populate_list,is_scroll,'list_task'
		); 
    } 
    catch (e) 
    {
		console.log(e);
        //$.fn.log_error(arguments.callee.caller, e.message);
    }
}
$.fn.populate_list = function (data,is_scroll)
{
    try 
    {   
		
        if(is_scroll == false)
		{
			$('#div_edit_batch').hide();
			$('#list_task').find("li").remove();
		}
		if (data.list.length > 0) // check if there is any data, precaution
		{
			let row			= '';
			let row1		= '';
			let row_data	= '';
			let priority	= '';
			let status		= '';
			let expiry_date	= '';
			let ribbonStyle = `style="background: white;border: 1px solid #566676;font-weight: normal;color: #566676;margin-top:-40px"`;
			if(data.rec_index)
			{
				RECORD_INDEX = data.rec_index;
			}
			data = data.list;
			console.log(data.length);
			if( data.length < 3 )
				$("#div_load_more").hide();
			else
				$("#div_load_more").show();
			for(var i = 0; i < data.length; i++)
			{
				row_data	= JSON.stringify(data[i]);
				if(row_data != false)
				{   
					var badgeStyle = "style='padding: 5px;font-weight: normal;font-size: 11px;border:1px solid white;'";
			        switch (parseInt(data[i].priority_id)) 
			        {
			            case 254:
			            	priority = `<span ${badgeStyle} class="badge bg-danger rounded-pill">${data[i].priority_name.toUpperCase().replace(/ /g, '')}</span>`;
			                break;
			            case 255:
			            	priority = `<span ${badgeStyle} class="badge bg-warning rounded-pill">${data[i].priority_name.toUpperCase().replace(/ /g, '')}</span>`;
			                break;
			            case 256:
			            	priority = `<span ${badgeStyle} class="badge bg-success rounded-pill">${data[i].priority_name.toUpperCase().replace(/ /g, '')}</span>`;
			                break;
			            default:
			            	priority = `<span ${badgeStyle} class="badge bg-success rounded-pill">${data[i].priority_name.toUpperCase().replace(/ /g, '')}</span>`;
		                	break;
			        };
			        if(data[i].expiry_date != null && data[i].expiry_date != "")
		        	{
			        	expiry_date = `<br/>
			        	<strong><span class="badge badge-danger">${data[i].days_left} Days to Expire</span></strong>`;
		        	}
					row += `<li class='list-group-item task-item' data-value='${escape(JSON.stringify(data[i]))}'>
				            	<div class='row'>
				                    <div class='apt-date col-sm-2 col-lg-2'>
				                    	<div class="input-group">
					                		<input type="checkbox" class="check_it" id="chk_${i}" data-val="${data[i].task_no}" name="chk_${i}" style="display:none" />
							      		</div>
				                    	<strong>Next Run Time <br/>
				                        <i class="fa fa-clock-o fa-fw text-success" aria-hidden="true"></i>
				                        ${data[i].next_run_time}</strong>
				                        <br/><br/>
				                        <strong>Last Run Time <br/>
				                        <i class="fa fa-clock-o fa-fw text-warning" aria-hidden="true"></i>
				                        ${data[i].last_run_time}</strong>
				                        <br/>
				                        ${expiry_date}
				                        
				                    </div>
				                    <div class='col-sm-4 col-lg-4' onclick='$.fn.populate_detail_form("${data[i].task_no}")'>
				                        <span class="fa fa-comment-o task-title"> ${data[i].task_title}</span>
				                        <div class="task-assign">
				                            <i class="fa fa-group fa-fw text-info" aria-hidden="true"></i>
				                            <strong><i>${data[i].assign_name}</i></strong>
				                        </div>
				                        <div class="task-assign">
				                            <i class="fa fa-reorder fa-fw" aria-hidden="true"></i>
				                            <strong><i>${priority}</i></strong>
				                            &nbsp;&nbsp;&nbsp;
				                            <i class="fa fa-ticket text-primary" aria-hidden="true"></i>
				                            <strong><i>${data[i].task_type_desc}</i></strong>
				                        </div>
				                        <div class="task-assign">
				                            <i class="fa fa-user text-danger" aria-hidden="true"></i>
				                            <strong><i>${data[i].created_by_name}</i></strong>
				                        </div>
				                        <div class="task-assign">
				                            <i class="fa fa-cogs text-success" aria-hidden="true"></i>
				                            <strong><i>${data[i].schedule_type.toUpperCase()}</i></strong>
				                        </div>
				                        <div class="task-assign">
				                            <i class="fa  fa-exclamation-circle text-danger" aria-hidden="true"></i>
				                            <strong><i>${data[i].active_status}</i></strong>
				                        </div>
				                    </div>
				                    <div class='col-sm-6 col-lg-6' onclick='$.fn.populate_detail_form("${data[i].task_no}")'>
				                        <span class="fa fa-comments text-success task-title"></span>&nbsp;${$.fn.decodeURIComponentSafe(data[i].descr.replace(/%0A/g, '<br/>'))}
				                    </div> 
				              	</div>
				            </li>`;
							var dataName = (data[i]. assign_name == null) ? "Sita Rawat" : data[i]. assign_name;
							var myArray = dataName.split(",");
							var initialHTML = '';
							if( myArray.length > 0 )
							{
								var initialHTML = '';
								$( myArray ).each(function( index, value ) {
									
									initialHTML += `<div class="avatar-initials" width="30" height="30" data-name="${value}" title="${value}" tabindex="0" ></div>`;
								});
							}
							var createdByInitialHTML = '<div class="avatar-initials" width="30" height="30" data-name="'+data[i].created_by_name+'"></div>';
							row1 += 	`<div class="col-lg-4" onclick='$.fn.populate_detail_form("${data[i].task_no}")' data-value='${escape(JSON.stringify(data[i]))}'>
								<div class="card project-box ribbon-box schedulingBox">
									<h4 class="mt-0 mb-0" style="background:#566676;color:white;font-size:16px;padding:10px;font-weight:normal">
										<div style="float:left;margin-right:5px;">
											<input type="checkbox" class="check_it form-check-input mb-1 m-0" id="chk_${i}" data-val="${data[i].task_no}" name="chk_${i}" style="display:none" />
										</div>
										<div class="sp-line-2 custom">
											<a href="javascript:void(0);" title="${data[i].task_title}" class="text-white">${data[i].task_title}</a>
										</div>
									</h4>
                                    <div class="card-body">
									
										<p class="text-muted text-uppercase mb-0" style="float:left;width:50%;"><i class="mdi mdi-clock"></i> <small>Next Run Time</small></p>
										<p class="text-muted text-uppercase mb-0" style="float:right;width:50%;text-align:right"><i class="mdi mdi-clock"></i> <small>Last Run Time</small></p>
										
										<p class="text-muted text-uppercase mb-1" style="float:left;width:50%;"><small>${data[i].next_run_time}</small></p>
										<p class="text-muted text-uppercase  mb-1" style="float:right;width:50%;text-align:right"><small>${data[i].last_run_time}</small></p>
										
										<p style="float:left;margin-right:5px;">${priority}</p>
										<div class="badge bg-soft-primary text-primary mb-3" style="border:1px solid white;padding:5px;margin-right:5px;">${data[i].schedule_type.toUpperCase()}</div>
										<div class="badge badge-outline-info mb-3" style="padding:5px;margin-right:5px;">${data[i].task_type_desc}</div>
										<div class="ribbon ribbon-secondary float-end" ${ribbonStyle} ><i class="mdi mdi-list-status"></i> ${data[i].active_status}</div>
										
										
										<p class="fst-italic text-muted sp-line-2 custom"><i>${$.fn.decodeURIComponentSafe(data[i].descr.replace(/%0A/g, '<br/>'))}</i></p>
										
										<hr style="margin:0.25rem;">
										
										<div><b><i class="mdi mdi-account-group"></i></b> Assign to:</div>
										
										`+initialHTML+`
										
										<div><b><i class="mdi mdi-account-details"></i></b> Created By: `+createdByInitialHTML+`</div>
									</div>
								</div>
							</div>`
				}		
			}
			$('#list_task').append(row1);
			
			getInitials();
		}
    } 
    catch (e) 
    {
    	console.log(e.message);
//        $.fn.log_error(arguments.callee.caller, e.message);
    }
}
$.fn.add_edit_task = function ()
{
    try
    {
		
    	let start_date  = '';
    	let expiry_date = '';
    	let due_date	= '';
    	let freeze_date = '';
    	var attachment 	= [];
    	let method		= 'add_edit_schedule_tasks';
		$.fn.set_validation_form();
		
    	if(parseInt($('#dd_schedule_or_one_time').val()) == 0) // one time task
		{	
    		// $('#detail_form')	.parsley().destroy();
    		$('#dp_start_date')	.attr('data-parsley-required', 'false').removeAttr('required');
			if( $("#dp_start_date").next('input.flatpickr-input') )
				$("#dp_start_date").next('input.flatpickr-input').removeAttr("required");
			
    		$('#dp_freeze_date').attr('data-parsley-required', 'false').removeAttr('required');
			if( $("#dp_freeze_date").next('input.flatpickr-input') )
				$("#dp_freeze_date").next('input.flatpickr-input').removeAttr("required");
			
    		$('#dp_due_date')	.attr('data-parsley-required', 'true').prop('required',true);
			if( $("#dp_due_date").next('input.flatpickr-input') )
				$("#dp_due_date").next('input.flatpickr-input').attr("required","required");
    		// $('#detail_form')	.parsley();
		}
    	else  // schedule
    	{
    		// $('#detail_form')	.parsley().destroy();
    		$('#dp_due_date')	.attr('data-parsley-required', 'false').removeAttr('required');
			if( $("#dp_due_date").next('input.flatpickr-input') )
				$("#dp_due_date").next('input.flatpickr-input').removeAttr("required");
			
    		$('#dp_start_date')	.attr('data-parsley-required', 'true').prop('required',true);
			if( $("#dp_start_date").next('input.flatpickr-input') )
				$("#dp_start_date").next('input.flatpickr-input').attr("required","required");
			
    		if($('#chk_roll_over').is(':checked'))
    		{
    			$('#dp_freeze_date')	.attr('data-parsley-required', 'true').prop('required',true);
				if( $("#dp_freeze_date").next('input.flatpickr-input') )
					$("#dp_freeze_date").next('input.flatpickr-input').attr("required","required");
    		}
    		else
    		{
    			$('#dp_freeze_date')	.attr('data-parsley-required', 'false').removeAttr('required');
				if( $("#dp_freeze_date").next('input.flatpickr-input') )
					$("#dp_freeze_date").next('input.flatpickr-input').removeAttr("required");
    		}
    		// $('#detail_form')	.parsley();
    		
    		if(SCHEDULE_TYPE == '')
        	{
        		$.fn.show_right_error_noty('Please select schedule type');
        		btn_save.stop();
    			return;
        	}
    	}
		
    	if($('#detail_form').parsley().validate() == false)
		{

			btn_save.stop();
			return;
		}
		
    	if(parseInt($('#dd_schedule_or_one_time').val()) == 0)
		{
    		due_date 	= moment($('#dp_due_date').val()).format('YYYY-MM-DD');
    		method		= 'add_edit_tasks_new';
		}
    	else
    	{
    		start_date 	= moment($('#dp_start_date').val()).format('YYYY-MM-DD HH:MM');

        	expiry_date = '';
    	}
		
    	if($('#chk_roll_over').is(':checked'))
    	{
    		freeze_date	= moment($('#dp_freeze_date').val()).format('YYYY-MM-DD');
    	}
    	if($('#dp_expire_date').val() != "")
    	{
    		expiry_date 	= moment($('#dp_expire_date').val()).format('YYYY-MM-DD');
    		
    	}
    	
    	$('.file-upload').each(function(index) 
    	{
            attachment.push($(this)[0].innerText.trim());
        });
    	
    	$('#txtarea_descr').val($('#txtarea_descr').val().replace(/['"]/g, '')); // to replace double quote and single quote
        let data = 
        {
        	task_no			: TASK_ID,
        	title       	: $('#txt_task').val(),
        	descr       	: encodeURIComponent($('#txtarea_descr').val()),
        	task_type       : $('#dd_type').val(),
        	priority		: $('#dd_priority').val(),
        	priority_name 	: $('#dd_priority option:selected').text(),
        	status			: '250', // this is open hardcode
        	is_active		: $('#chk_status').is(':checked') ? 1 : 0,
        	roll_over		: $('#chk_roll_over').is(':checked') ? 1 : 0,
			freeze_date		: freeze_date,
    		dept_id			: $('#dd_dept').val(),
    		attachment		: attachment,
            due_date		: due_date,
            to_chat_ids		: $.fn.get_assignee_for_chat(),
            emp_id      	: SESSIONS_DATA.emp_id,
        	emp_name      	: SESSIONS_DATA.name,
            sbg_id 			: $('#dd_sbg').val(),
        	sbd_id			: $('#dd_sbd').val(),
        	oc_id			: $('#dd_oc').val(),
        	task_group		: $('#dd_group').val(),
            schedule_one_time: $('#dd_schedule_or_one_time').val(),
        	reviewer		: $('#dd_reviewer').val(),
        	approver		: $('#dd_approver').val(),
        	schedule_desc	: $('#lbl_schedule_desc').html(),
            start_date    	: start_date,
            expiry_date    	: expiry_date,
            schedule_type	: SCHEDULE_TYPE,
            due_days		: $('#dd_due_days').val(),
            r_due_days		: $('#dd_reviewer_due_days').val(),
            a_due_days		: $('#dd_approver_due_days').val(),
        }
		
        $.fn.write_data
        (
            $.fn.generate_parameter(method, data),
            function(return_data)
            {
                if (return_data.data)  // NOTE: Success
                {
                	TASK_ID				= return_data.data.task_no;
                	if(method == 'add_edit_tasks_new')
                    {
                        if ($('#files .file-upload.new').length > 0)
                        {
                            $.fn.upload_file(TASK_ID);
                        }
                        else
                        {
                            bootbox.alert("One time task has been created, the form will be cleared.");
                        }
                        $.fn.show_hide_form('NEW', true);
                    }
                    else
                    {
                        $('#h4_primary_no') .text('Task No : ' + return_data.data.task_no);
                        $.fn.show_right_success_noty('Data has been recorded successfully');
                        $.fn.show_hide_form('EDIT');
						if(parseInt($('#dd_schedule_or_one_time').val()) != 0){
							var templateId = $("#btn_save").attr("data-template-id");
							if( templateId  ){
								$("#loading").html("&nbsp;[Please wait...while populating any Assignee(s) to add.] ");
								$.fn.populate_template_assignee_row(templateId);
								
							}
						}
                    }
                	
                }
            },false,btn_save
        );
    } 
    catch (e) 
    {
    	console.trace();
    	console.log(e.message);
//        $.fn.log_error(arguments.callee.caller, e.message);
    }
}
$.fn.set_validation_form = function()
{	
	$('#detail_form').parsley().destroy();
	$('#detail_form').parsley
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
$.fn.get_assignee_for_chat = function()
{
	try
	{
		let assignee = [];
		$("#ul_assigned > li > [href]").each(function()
		{
			if($(this).attr('chat_username') != "")
			{
				assignee.push({id : $(this).attr('chat_username'),name : $(this).attr('name')});
			}
		});
		return assignee
		
	}
	catch(err)
	{
		$.fn.log_error(arguments.callee.caller,err.message);
	}
};
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
$.fn.set_schedule_type_button = function(btn) 
{
	let days 			= 1;
	$('#btn_daily')		.removeClass('btn-outline-dark').addClass('btn-dark');
    $('#btn_weekly')	.removeClass('btn-outline-primary').addClass('btn-primary');
    $('#btn_monthly')	.removeClass('btn-outline-pink').addClass('btn-pink');
    $('#btn_quarterly')	.removeClass('btn-outline-info').addClass('btn-info');
    $('#btn_biannually').removeClass('btn-outline-warning').addClass('btn-warning');
    $('#btn_yearly')	.removeClass('btn-outline-success').addClass('btn-success');
    if(btn)
    {
	    if(btn.attr('id') == 'btn_daily')
		{
	    	btn.removeClass('btn-dark').addClass('btn-outline-dark');
		}
	    else if(btn.attr('id') == 'btn_weekly')
		{
	    	days = 7;
	    	btn.removeClass('btn-primary').addClass('btn-outline-primary');
		}
	    else if(btn.attr('id') == 'btn_monthly')
		{
	    	days = 30;
	    	btn.removeClass('btn-pink').addClass('btn-outline-pink');
		}
		else if(btn.attr('id') == 'btn_quarterly')
		{
			days = 90;
			btn.removeClass('btn-info').addClass('btn-outline-info');
		}
		else if(btn.attr('id') == 'btn_biannually')
		{
			days = 180;
			btn.removeClass('btn-warning').addClass('btn-outline-warning');
		}
		else if(btn.attr('id') == 'btn_yearly')
		{
			days = 365;
			btn.removeClass('btn-success').addClass('btn-outline-success');
		}
	    return days;
    }
}
$.fn.load_due_days_dropdown = function(days) 
{
	$('#dd_due_days,#dd_reviewer_due_days,#dd_approver_due_days').empty();
    for(let i = 1; i <= days;i++)
	{
    	$('#dd_due_days,#dd_reviewer_due_days,#dd_approver_due_days').append
    	(
    			$('<option></option>').val(i).html(i + ' Days')
    	);
	}
}
function get_search_status(rowData = false)
{
	try
	{
		let row = '';
		if(rowData)
		{
			for(var i = 0; i < rowData.length; i++)
			{
				row += 	`<option value=${rowData[i].id}>
							${rowData[i].desc}
						</option>`;
			}
			$('#dd_status_search').html(row);
			$('#dd_status_search').val('');
			$('#dd_status_search').select2();
		}
	}
	catch(err)
	{
		console.log(err.message);
		//$.fn.log_error(arguments.callee.caller,err.message);
	}
};
function get_emp(rowData = false)
{
	try
	{
	 	var row = '';											
		if(rowData)
		{
			for(var i = 0; i < rowData.length; i++)
			{
				
				row += 	`<option value=${rowData[i].id}>
							${rowData[i].desc}
						</option>`;
			}
			$('#dd_batch_assign').html(row);
			$('#dd_batch_assign').val(rowData[0].id);
			$('#dd_batch_assign').select2();
			$('#dd_created_by_search').html(row);
			$('#dd_created_by_search').val('');
			$('#dd_created_by_search').select2();
		}
	}
	catch(err)
	{
		console.log(err.message);
		//$.fn.log_error(arguments.callee.caller,err.message);
	}
};
$.fn.populate_detail_form = function(task_no)
{
	try
	{	
		$.fn.intialize_fileupload('doc_upload','doc_upload_files');
        $.fn.fetch_data
		(
			$.fn.generate_parameter('get_master_task_detail', {task_no : task_no}),
		    function(return_data)
		    {   
				console.log(return_data);
				$("#btn_save").removeAttr("data-template-id");
				
                let data        	= return_data.data.details;
                let assignees   	= return_data.data.assignees;
				let created_date 	= return_data.data.details.created_date;
				$("#task_creation_date").val(created_date);
                $.fn.show_hide_form	('EDIT', true);

                let start_date 		= data.start_date;
                let expiry_date		= '';
                let freeze_date		= '';
                
                if(data.expiry_date != "")
                {
                    expiry_date 	= data.expiry_date;
                }
                
                if(data.freeze_date != "" && data.freeze_date != null)
                {
                    freeze_date 	= data.freeze_date;
                }
                
                TASK_ID				= data.task_no;
                $("#files")         .empty();
                $('#h4_primary_no')	.text('Task No : ' + data.task_no);
                
                $('#txt_task')      .val(data.task_title);
                $('#txtarea_descr') .val($.fn.decodeURIComponentSafe(data.descr));
                $('#txtarea_descr_action') .val($.fn.decodeURIComponentSafe(data.descr_action));
                $.fn.change_switchery($('#chk_status'),(parseInt(data.is_active) ? true : false));
                $.fn.change_switchery($('#chk_roll_over'),(parseInt(data.roll_over) ? true : false));
                CODE_TRIGGERED 		= false;
                $('#dd_type')   	.val(data.task_type).change();
                $('#dd_priority')   .val(data.priority_id).change();  
                $('#dd_sbd')   		.val(data.sbd_id).change();
                $('#dd_oc')   		.val(data.company_id).change();
                $('#dd_sbg')   		.val(data.sbg_id).change();
                $('#dd_group')   	.val(data.task_group_id).change();
                $('#dd_reviewer')   .val(data.reviewer_id).change();
                $('#dd_approver')   .val(data.approver_id).change();
                $('#dd_dept')   	.val(data.dept_id).change();
				
				
				flatpickrStartDate.setDate(start_date);
				if( $("#dp_start_date").next('input.flatpickr-input') )
					$("#dp_start_date").next('input.flatpickr-input').val(start_date);
				$('#dp_due_date')	.attr('data-parsley-required', 'false').removeAttr('required');
			if( $("#dp_due_date").next('input.flatpickr-input') )
				$("#dp_due_date").next('input.flatpickr-input').removeAttr("required");
                if(expiry_date != "")
                    $('#dp_expire_date').val(expiry_date.format(UI_DATE_FORMAT));
                if(freeze_date != "")
                    $('#dp_freeze_date').val(freeze_date.format(UI_DATE_FORMAT));
                $('#lbl_schedule_desc').html(data.schedule_desc);
                SCHEDULE_TYPE		= data.schedule_type;
                let days = $.fn.set_schedule_type_button($('#btn_' + SCHEDULE_TYPE));
                $.fn.load_due_days_dropdown(days);
                $('#dd_due_days')   		.val(data.due_days).change();  // set the due days after the dropdown been loaded
                $('#dd_reviewer_due_days')	.val(data.reviewer_due_days).change();  // set the due days after the dropdown been loaded
                $('#dd_approver_due_days')	.val(data.approver_due_days).change();  // set the due days after the dropdown been loaded
                let json_field = $.fn.get_json_string(data.json_field);
                if(json_field != false)
                {
                    data.attachment = json_field.attachment;
                    $.fn.populate_attachments(data);
                    if(json_field.checklist)
                        $.fn.populate_checklist(json_field.checklist);
                }
                //$('#div_footer')			.hide();
                $('#div_assign')			.hide();
                $('#btn_fileupload').hide();
                $('#btn_duplicate')			.show();
                $('#div_task_schedule')		.show();
                
                //populate assignees list
                if(assignees)
                {   
                    for(let i = 0; i < assignees.length;i++)
		            {
                        let r_data = assignees[i];
						
                        let btn_link = btn_edit = btn_delete = btn_checklist = '';
                        if (SESSIONS_DATA.emp_id == Number(r_data.created_by))
                        {
                            btn_delete = `<a href="javascript:void(0);" class="action-icon" onClick="$.fn.remove_assignee('${r_data.id}')"> <i class="mdi mdi-delete"></i></a>`;
                        }
                        if (SESSIONS_DATA.emp_id == Number(r_data.created_by) || SESSIONS_DATA.emp_id == Number(r_data.user_id))
                        {
                            btn_checklist = `<button type="button" class="btn btn-warning waves-effect waves-light btn-xs" onclick="$.fn.view_checklist('${escape(JSON.stringify(r_data))}')">
                                                        <i class="fa fa-tasks fa-fw" aria-hidden="true"></i> Checklist
                                                    </button>`;
							
							if(r_data.doc_no) {
								btn_link = ``;
							}else {
								btn_link = ``;
							}
							
							btn_edit = `<a href="javascript:void(0);" class="action-icon btn_assignee_edit" data-xid="${i}" data-status="${r_data.status_id}"> <i class="mdi mdi-square-edit-outline"></i></a>`;
                        }
						
						let deadlineDays = 0;
						let status_name = (r_data.status_name) ? r_data.status_name : 'Not Set';
						let deadline_date = (r_data.deadline_date) ? r_data.deadline_date : 'Not Set';
						if( r_data.deadline_date )
						{
							let date1 = $("#task_creation_date").val();
							date1 = date1.split(" ");
							date1 = date1[0];
							date1 = new Date(date1);
							
							var retDate = GetDate(r_data.deadline_date);
							date2 = new Date(retDate);
							deadlineDays = getBusinessDateCount(date1, date2, holidays = true);
						}
						
						//outbound document status
						let outbound_doc_row = '';
						if(r_data.outbound_documents) {
							let outbound_doc = r_data.outbound_documents;
							let outbound_status = '';
							
							if(outbound_doc.is_archived == '1') {
								outbound_status = 'Archived';
							}
							else if(outbound_doc.total_approvers_count == outbound_doc.total_approvals_count)
							{
								outbound_status = 'Document Verified';
							}
							else if(outbound_doc.total_approvals_count >= 1)
							{
								outbound_status = 'Verification in Progress';
							}
							else if(outbound_doc.is_to_verify == '1')
							{
								outbound_status = 'Pending Verification';
							}
							else
							{
								outbound_status = 'Draft';
							}

							outbound_doc_row = `<div class="text-center my-2 my-sm-1">
								<p class="mb-0"><b>Document Status:</b> ${outbound_status}</p>
							</div>`;
						}
                        let row = `<div class="card mt-2 shadow rounded assignee-row assignee-row-${r_data.id}" data='${JSON.stringify(r_data)}' id="assignee-row-${r_data.id}">
							<div class="card-body">
								<div class="row align-items-center assignee-row-data">
									<div class="col-sm-4">
										<div class="d-flex align-items-start">
											<div class="w-100">
												<h4 class="mt-0 mb-2 font-16">${r_data.name}</h4>
												<p class="mb-1"><b>Action:</b> ${r_data.action}</p>
											</div>
										</div>
									</div>
									<div class="col-sm-4">
										<div class="my-3 my-sm-0">
											<p class="mb-0"><b>Status:</b> ${status_name}</p>
											<p class="mb-0 text-muted"><b>Deadline:</b> ${deadline_date}</p>
											
										</div>
									</div>
									<div class="col-sm-2">
										<div class="text-center button-list">
											${btn_link}
											${btn_checklist}
										</div>
										${outbound_doc_row}
									</div>
									
									<div class="col-sm-2">
										<div class="text-sm-end text-center mt-2 mt-sm-0">
											${btn_edit}
											${btn_delete}
										</div>
									</div> <!-- end col-->
								</div> <!-- end row -->
								<div class="row">
									<div id="assignee-files-${r_data.id}"></div>
									<div id="upload-files-${r_data.id}" class="files"></div>
								</div>
							</div>
						</div>`;
                        $('#assignee_list').append(row);
								
						//fetch attachment files
						let get_param = {
							id: '', 
							module_id: MODULE_ACCESS.module_id, 
							method: "get_files", 
							primary_id: task_no, 
							secondary_id: r_data.id, 
							token: $.jStorage.get('token') 
						};

						$.fn.fetch_data(
							$.fn.generate_parameter('get_files', get_param),
							function(return_data_attachment) {
								if(return_data_attachment.data) {
									let attachment_data = [];
                        			attachment_data.attachment = return_data_attachment.data;
                        			$.fn.populate_fileupload(attachment_data,`assignee-files-${r_data.id}`, true);
								}
							},
							true
						);
                    }
                    
                }
				if( $("#div_task_schedule").is(":visible")){
					console.log("yes");
					$("#dd_schedule_or_one_time").val(1).change();
				}
            }, false, '', true, true
        );
	}
	catch(err)
	{
		$.fn.log_error(arguments.callee.caller,err.message);
	}
};
$.fn.populate_attachments = function(data)
{
	try
	{	
		if(data.attachment)
		{
			$("#files").empty();
			for(i = 0; i < data.attachment.length;i++)
			{
				let path = data.filepath + data.attachment[i];
				let btn_delete = `<a href class="delete" data-filename="${data.attachment[i]}">
        							<i class="fa fa-trash-o fa-fw" aria-hidden="true" title="Delete file"></i>
            					  </a>`;

				// IF not owner
		        if (SESSIONS_DATA.emp_id != Number(data.created_by))
		        {
		        	btn_delete = '';
		        }	
		        $("#files").append
                (
                    $('<div class="list-group-item"></div>')
                        .addClass('file-upload')
                        .append(`<div class="col-sm-4">${btn_delete}
                                <a href class="link-view-file" data-path="${path}">${data.attachment[i]}</a></div>`)
                );
			}
            $('.file-upload .delete').unbind().on('click', function(event)
            {
                event.preventDefault();
                let this_file 	= $(this);
                let filename 	= this_file.data('filename');
                bootbox.confirm
                ({
                    title: "Delete Confirmation",
                    message: "Are you sure to delete this attachment?.",
                    buttons:
                    {
                        cancel:
                        {
                            label: '<i class="fa fa-times"></i> Cancel'
                        },
                        confirm:
                        {
                            label: '<i class="fa fa-check"></i> Yes'
                        }
                    },
                    callback: function (result)
                    {
                        if (result == true)
                        {
                            $.fn.delete_file(filename, function()
                            {
                                this_file.parent().remove();
                            });
                        }
                    }
                });

            });

            $('.link-view-file').unbind().on('click', function(event)
            {
                event.preventDefault();
                $.fn.view_file($(this).data('path'));
            });
        }
	}
	catch(err)
	{
		$.fn.log_error(arguments.callee.caller,err.message);
	}
};
$.fn.delete_file = function (filename, callback)
{
    try 
    {
        let data =
        {
            emp_id   	: SESSIONS_DATA.emp_id,
            task_no  	: TASK_ID,
            filename	: filename
        }

        $.fn.write_data
        (
            $.fn.generate_parameter('delete_schedule_tasks_attachment', data),
            function(return_data)
            {
                if (return_data.code == 0)
                {
                    callback();
                }
            }, true
        );
    } 
    catch (e) 
    {
        $.fn.log_error(arguments.callee.caller, e.message);
    }
}
$.fn.populate_checklist = function (data, created_by = false, add = false)
{
    try
    {   
		data = (data.checklist) ? data.checklist : data;
    	let row 	= '';
		let row1	= '';
    	let checked = '';
    	let strike	= '';
		let realData = $("h5.task-description");
		let realI = realData.length;
    	for(i = 0; i < data.length;i++)
    	{
			let thisI = ( add ) ? realI : i;			
			if(data[i].strike == true)
			 {
    			 checked 	= `checked="checked"`;
    			 strike  	= "done";
			 }
    		 else
    		 {
    			 checked 	= "";
    			 strike		= "";
    		 }
    		 row += `<li>
	                 <label>
	                     <i class="fa fa-ellipsis-v icon-dragtask"></i>
	                     <span class="task-description">${data[i].name}</span>
	                 </label>
	                 <div class="options todooptions">
                     	<div class="btn-group">
                            <button class="btn btn-default btn-xs"><i class="fa fa-trash-o" onclick="$(this).closest('li').remove()"></i></button>
                        </div>
                     </div>
	             </li>`;
				 row1 += `<div class="card mb-0 mt-2 deleteRow">
                                                            <div class="card-body dragdrop">
                                                                <div class="d-flex align-itames-start">
                                                                    
                                                                    
                                                                    <div class="w-100">
																		<div class="dragdrop-left"><input class="form-check-input midsize-checkbox dragdrop" type="checkbox" data-i="`+thisI+`" value="" id="customckeck1" onclick="$.fn.set_line_strike(this)" ${checked}>
																			
																		</div>
																		<div class="dragdrop-right"> <h5 class="mb-1 mt-1 task-description ${strike}" data-i="`+thisI+`">${data[i].name}<button class="btn btn-default btn-xs dragdrop" style="float:right;"><i class="mdi mdi-delete customized" onclick="$(this).closest('.deleteRow').remove()"></i></button></h5>
                                                                        </div>
																	
                                                                       
                                                                    </div>
                                                                    <span class="dragula-handle" ></span>
                                                                </div></div></div>`;
    	}
    	$('#ul_checklist').append(row1);    	
    } 
    catch (e) 
    {
        $.fn.log_error(arguments.callee.caller, e.message);
    }
}
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
				 
	var formatddate = (i+1)  + '/' + arr[0] + '/' + arr[2]; 
	return formatddate;
}
$.fn.update_task_batch = function (task_no, type)
{
    try 
    {
    	let data	= 
		{
			task_no 	: task_no,
			assigned_to : '',
			is_active 	: '',
			type		: type,
			emp_id 		: SESSIONS_DATA.emp_id
	 	};
    	
    	if(type == 1)
    	{
    		data.assigned_to = $('#dd_batch_assign').val();
    	}
    	else if(type == 2)
    	{
    		data.is_active = $('#chk_status_all').is(':checked') ? 1 : 0;
    	}

        $.fn.write_data
        (
            $.fn.generate_parameter('add_edit_schedule_tasks_batch', data),
            function (return_data)
            {
                if (return_data.data)
                {
                    $.fn.show_right_success_noty('Data has been updated successfully');
                    RECORD_INDEX = 0;
        			$.fn.get_list(false);
                }
            }, true
        );
    } 
    catch (e) 
    {
        $.fn.log_error(arguments.callee.caller, e.message);
    }
}
$.fn.get_all_batch_checked = function ()
{
	let task_no = '';
	$('.check_it').each(function () 
	{
		if($(this).is(':checked'))
		{
			task_no += ",'" + $(this).attr('data-val') + "'";
		}
	});
	
	return task_no.substring(1);
}
$.fn.bind_command_events = function()
{	
	try
	{
		 $('#btn_upload_schedule').click( function(e)
		{
        	e.preventDefault();
			$('#fileupload_schedule').click();
		});
       
        $("#fileupload_schedule").on("click", function(e)
        {
        	e.stopPropagation();
        });
		$('#btn_batch_status_edit').click( function(e)
		{
        	e.preventDefault();
        	$.fn.update_task_batch($.fn.get_all_batch_checked(),2);
		});
		$("#txt_checklist").keypress(function(e) 
        {
        	if (e.which == 13) 
        	{
        		e.preventDefault();
        		$('#btn_add_checklist').trigger('click');
        	}
    	});
		 $('#btn_add_batch_assign').click( function(e)
		{
        	e.preventDefault();
        	$.fn.update_task_batch($.fn.get_all_batch_checked(),1);
		});
		$('#btn_search').click( function(e)
		{
			e.preventDefault();			
			RECORD_INDEX = 0;
			$("#list_task").empty();
			$.fn.get_list(false);
		});
		$('#btn_reset').click( function(e)
		{
			e.preventDefault();
			$.fn.reset_form('list');
			RECORD_INDEX = 0;
			$.fn.get_list(false);
		});
		$('#btn_add_upload_batch').click( function(e)
		{
			e.preventDefault();
			btn_save_upload_batch = Ladda.create(this);
			btn_save_upload_batch.start();
			$.fn.add_upload_batch();
		});
		 $('body').on('click', '#btn_update_assignee', function(e)
        {
            e.preventDefault();
            btn_update_assignee = Ladda.create(this);
            btn_update_assignee.start();
	 		$.fn.update_assignee();
        });
		$('body').on('click', '#btn_update_image', function(e)
        {
            e.preventDefault();
            $( "#doc_upload_edit" ).trigger( "click" );
        });
		$('body').on('click', '#btn_cancel_assignee', function(e)
        {
            e.preventDefault();
            $('#tbl_assign_to tbody tr').removeClass('activeRow');
            
            $.fn.reset_form('assignee_form');

            let id = $(this).attr('data-id');
            $(`#assignee-row-${id}`).html(TEMP_ROW);
            $('.btn_assignee_edit').removeAttr('disabled');
            $(`#base_row_assignee`).show();
        });
		$('body').on('click', '.btn_assignee_edit', function(e)
        {
            e.preventDefault();
            $('.btn_assignee_edit').attr('disabled', 'disabled');
            $('#tbl_assign_to tbody tr').removeClass('activeRow');
            let data = $(this).parents('.assignee-row').attr('data');
			let xid = $(this).attr("data-xid");
            $.fn.edit_assignee(data, xid);
			$("#provide_days_edit").trigger("change");
        });
		$('#btn_add_checklist').on('click', function(e) 
        {
            e.preventDefault();
            $.fn.add_checklist();
        });
		$('#btn_add_assignee').click( function(e)
        {
            e.preventDefault();
            btn_save_assignee = Ladda.create(this);
            btn_save_assignee.start();
	 		$.fn.add_assignee();
        });
		$('#chk_all').click( function(e)
		{
        	$('.check_it').prop('checked', this.checked);
		});
		$('#btn_daily,#btn_weekly,#btn_monthly,#btn_quarterly,#btn_biannually,#btn_yearly').on('click', function(event) 
        {
            event.preventDefault();
            let days = $.fn.set_schedule_type_button($(this));
            $.fn.load_due_days_dropdown(days);
            SCHEDULE_TYPE 	= $(this).text().toLowerCase();
            let start_date 	= '[SELECTED DATE]';
            let next_date 	= '[SELECTED DATE]';
            let expiry_date	= ', it will run indefinitely';
            if($('#dp_start_date').val() != '')
        	{
            	start_date = $('#dp_start_date').val() + ' ' + $('#start_time').val();
            	next_date  = $('#dp_start_date').val() + ' ' + $('#start_time').val();
        	}
            if($('#dp_expire_date').val() != '')
        	{
            	expiry_date = ', it will expiry on <b>' + $('#dp_expire_date').val() + '</b>';
        	}
            $('#lbl_schedule_desc').html('This task scheduled to repeat ' + $(this).text() + ', it will start on <b>' + 
            		start_date + '</b><br/> next run time will be on <b>[ ' + next_date + ' ]</b>' + expiry_date);
        });
		$('#btn_duplicate').on('click', function(event) 
        {
            event.preventDefault();
            $.fn.reset_form('duplicate');
        });
		$('#chk_roll_over').on('change', function(e) 
        {
            e.preventDefault(); 
            $(this).is(':checked') ? $('#div_roll_over').show() : $('#div_roll_over').hide();
        });
		 $('#dd_schedule_or_one_time').on('change', function(e) 
        {
            e.preventDefault();
            if($(this).val() == 0)
        	{
            	$('#div_task_one_time').show();
            	$('#div_task_schedule').hide();
        	}
            else
            {
            	$('#div_task_one_time').hide();
            	$('#div_task_schedule').show();
            } 
        });
		 $('#div_load_more').click( function(e)
		{
			e.preventDefault();
			$.fn.get_list(true);
		});
		$('#chk_status').on('change', function(e) 
        {
            e.preventDefault(); 
            $(this).is(':checked') ? $('#lbl_status').html('ACTIVE') : $('#lbl_status').html('IN-ACTIVE');
            
            if(TASK_ID != '' && CODE_TRIGGERED == false)
            {
            	bootbox.confirm
                ({
                    title	: "Task Schedule Status Confirmation",
                    message	: "You are about to make this schedule " + $('#lbl_status').html() + ', are you sure to proceed?',
                    buttons	:
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
                        	var data	= 
                    		{
                    			task_no 	: TASK_ID,
                    			status_id 	: $(this).is(':checked') ? 1 : 0,
                    			emp_id 		: SESSIONS_DATA.emp_id
                    	 	};

                            $.fn.write_data
                            (
                                $.fn.generate_parameter('update_schedule_task_status', data),
                                function (return_data)
                                {
                                    if (return_data.data)
                                    {
                                        $.fn.show_right_success_noty('Status has been updated successfully');
                                    }

                                }, false
                            );
                        }
                    }
                });
            }
        });
		 $('#btn_save').on('click', function(e) 
        {
            e.preventDefault();
            btn_save = Ladda.create(this);
	 		btn_save.start();
            $.fn.add_edit_task();
        });
		$('#closeTaskWindow').on('click', function(event) 
        {
            event.preventDefault();
            $("#new_div").hide();
			$("#buttonsDiv").show();
			$("#list_task").empty();
			$("#list_task").show();
			$("#assignee_list").empty();
			RECORD_INDEX = 0;
			$.fn.get_list(false);
			$('#div_load_more').hide();
			$(".header-with-backBtn").hide();
        });
		$("#btn_pickup,#btn_tt_search").on("click", function(e)
        {
        	e.stopPropagation();
        	RECORD_INDEX = 0;
        	$.fn.get_task_template_list(false);
        });
		$('#btn_new').on('click', function(event) 
        {
            event.preventDefault();
            $.fn.show_hide_form('NEW',true);
        });
		$('#showSearchDiv').on('click', function(event) 
        {
            event.preventDefault();
            $("#searchDiv").show();
			$("#showSearchDiv").hide();
        });
		$('#closeSearch').on('click', function(event) 
        {
            event.preventDefault();
            $("#searchDiv").hide();
			$("#showSearchDiv").show();
        });
		$('#btn_list_edit').click( function(e)
		{
        	e.preventDefault();
        	$('#list_task').prepend($('#div_edit_batch').toggle());
        	if($('#div_edit_batch').is(':visible'))
    		{
        		$('.check_it').show();
    		}
        	else
        	{
        		$('.check_it').hide();
        	}
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
	
		
		let dataToSend = {
			company_id:4,
			year:2022
		}
        get_holidays_list(dataToSend);
		
		
		var params = {
			emp_id:SESSIONS_DATA.emp_id
		}
		var data = [
			{ func: "get_sbd", params: params },
			{ func: "get_sbg", params: params },
			
			{ func: "get_company", params: params },
			{ func: "get_taskTypes", params: params },
			
			{ func: "get_priority", params: params },
			{ func: "get_taskGroups", params: params },
			{ func: "get_status", params: params },
			{ func: "get_assignee", params: params },
			{ func: "get_emp", params: params },
			{ func: "get_search_status", params: params },
			
		];
		
		$.fn.get_everything_at_once_altrawise(data);
		e = "#dd_dept_search";
		$.fn.get_departments(e);
		e = "#formDepartment";
		$.fn.get_departments(e);
		
		flatpickr1 = $("#dp_due_date").flatpickr({
			altInput: true,
			altFormat: "d-M-Y",
			dateFormat: "Y-m-d",
		});
		flatpickrFreeze = $("#dp_freeze_date").flatpickr({
			altInput: true,
			altFormat: "d-M-Y",
			dateFormat: "Y-m-d",
		});
		flatpickrStartDate = $("#dp_start_date").flatpickr({
			altInput: true,
			altFormat: "d-M-Y h:i K",
			enableTime:!0,
			dateFormat:"Y-m-d h:i K",
			minTime: "07:00",
			maxTime: "22:00"
		});
		flatpickrExpireDate = $("#dp_expire_date").flatpickr({
			altInput: true,
			altFormat: "d-M-Y",
			dateFormat: "Y-m-d",
		});
		flatpickrDeadlineDate = $("#deadline_date").flatpickr({
			altInput: true,
			altFormat: "d-M-Y",
			dateFormat: "Y-m-d",
		});
		flatpickrDeadlineDateEdit = $("#deadline_date_edit").flatpickr({
			altInput: true,
			altFormat: "d-M-Y",
			dateFormat: "Y-m-d",
		});
		var elems = Array.prototype.slice.call(document.querySelectorAll('.js-switch'));
        $('.js-switch').each(function() 
        {
            new Switchery($(this)[0], $(this).data());
        });
		$("#dd_schedule_or_one_time").select2();
		$("#dd_due_days").select2();
		$("#dd_reviewer_due_days").select2();
		$("#dd_approver_due_days").select2();
		
		$.fn.get_tasks_drop_down_values();
		$.fn.intialize_fileupload('upload_schedule','upload_schedule_file');
		$.fn.intialize_fileupload('fileupload_schedule','files_schedule');	
		$('#dd_assign_to').select2({
			dropdownParent: $("#addEditAssigneeModal")
		});

		$('#dd_status').select2({
			dropdownParent: $("#addEditAssigneeModal")
		});
		var data	= 
		{
			title			: $('#txt_title_search')	.val(),
			status			: null,//$('#dd_status_search').val(),
			assign_to 		: $('#dd_assign_to_search').val(),
			created_by 		: $('#dd_created_by_search').val(),
			dept_id 		: 0,//$('#dd_dept_search').val(),
			view_all		: 1,//MODULE_ACCESS.view_it_all,
			start_index		: RECORD_INDEX,
			limit			: LIST_PAGE_LIMIT,			
			is_admin		: SESSIONS_DATA.is_admin,		
			emp_id			: SESSIONS_DATA.emp_id
		};
		$.fn.get_list(false,data);
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
