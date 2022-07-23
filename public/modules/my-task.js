/**
 * @author Jamal
 * @date 01-Oct-2021
 * @Note = Please do not apply Ctr-Alt-Format for better readable codes
 *         Please follow the indentation
 *         Please follow the naming convention
 */
 var RECORD_INDEX 	= 0;
 var upload_section 	= '';
 var ROW_ID			= '';
 var SESSIONS_DATA 	= $.jStorage.get('session_data');
 var TASK_ID 		= '';
 var TEMPLATE_ID		= '';
 var btn_save,btn_save_reply,btn_save_assignee,btn_update_assignee,btn_save_checklist,flatpickrDeadlineDate,flatpickrDate,flatpickrDeadlineDateEdit,btn_save_template, btn_accept_client_task = '';
 var APPROVER_ID		= '';
 var REVIEWER_ID		= '';
 var ASSIGN_TO       = '';
 var STATUS          = '';
 var TEMP_ROW        = '';
 var FILE_UPLOAD_PATH= '';
 var UI_DATE_FORMAT 	= 'DD-MMM-YYYY';
 var DEFAULT_COMPANY_ID	= 4;
 var DEFAULT_COMPANY_YEAR = 2022;

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
 
 $.fn.update_assignee_checklist_when_pick_template = function(data)
 {
	 try 
	 {	
		 $.fn.write_data
		 (
			 $.fn.generate_parameter('save_checklist_for_task', data),
			 function(return_data)
			 {
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
		 $.fn.fetch_data
		 (
			 $.fn.generate_parameter('get_task_template_detail', {task_id : templateId}),
			 function(return_data)
			 {
				 var assignees = return_data.data.assignees;
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
							 $.fn.generate_parameter('add_assignee_for_task', assigneeData),
							 function(return_data)
							 {
								 if (return_data.data)  // NOTE: Success
								 {   
									 let r_data = return_data.data;
									 r_data.json_field = json_field;
									 i = $(".btn_assignee_edit").length;
									 $.fn.populate_assignee_row(r_data,'add',true,i);
								 }
							 },false, false, true
						 );
						 //add assignee	
					 }
					 if( i == assignees.length )
						 $("#btn_save").removeAttr("data-template-id");
				 }
			 }, false, '', true, true
		 );
	 } 
	 catch (e)
	 {
		 $("#loading").html("Error");
		 $.fn.log_error(arguments.callee.caller, e.message);
	 }
 }
 
 $.fn.get_review_approval_count = function()
 {
	 try 
	 {
		 $.fn.fetch_data
		 (
			 $.fn.generate_parameter('get_tasks_count_waiting_review_approval', {emp_id : SESSIONS_DATA.emp_id}),
			 function(return_data)
			 {
				 if(return_data.data)
				 {
					 $('#badge_priority').html(return_data.data.priority);
					 $('#badge_approve').html(return_data.data.approve);
					 $('#badge_review').html(return_data.data.review);
					 $('#badge_sent_for_review').html(return_data.data.sent_for_review);
					 $('#badge_waiting_for_approval').html(return_data.data.waiting_approval);
				 }
			 }, false
		 );
	 } 
	 catch (e) 
	 {
		 $.fn.log_error(arguments.callee.caller, e.message);
	 }
 }
 
 $.fn.get_list_group = function ()
 {
	 try 
	 {
		 let status_search = [""];
		 if($('#dd_status_search').val() != null)
		 {
			 status_search = $('#dd_status_search').val();
		 }
		 var data	= 
		 {
			 title			: $('#txt_title_search')	.val(),
			 status			: status_search.toString(),
			 assign_to 		: $('#dd_assign_to_search').val(),
			 created_by 		: $('#dd_created_by_search').val(),	
			 view_all		: MODULE_ACCESS.viewall,		
			 is_admin		: SESSIONS_DATA.is_admin,		
			 emp_id			: SESSIONS_DATA.emp_id
		  };
		  
		 $.fn.fetch_data
		 (
			 $.fn.generate_parameter('get_tasks_list_group', data),
			 function(return_data)
			 {
				if(return_data.data)
				{
				$('#list_task_group')			.show();
				$('#list_task_group')			.empty();
				$('#list_task,#div_load_more')	.hide();
				data = return_data.data;
				let row = rowToday = rowOverDue = '';
				let todaysCount 	= return_data.todaysCount;
				let overDueCount 	= return_data.overDueCount;
				
				for(i = 0; i < data.length;i++)
				{
					str = toTitleCase(data[i].s_type);
					
					row += `<div class="col-md-6 col-xl-3" onclick="$.fn.get_list_item_group('${data[i].s_type}')">
								<div class="card hoverCustom activeCustom">
									<div class="card-body">
										<div class="row">
											<div class="col-3">
												<div class="avatar-sm bg-soft-success rounded" >
													<i class="fe-clipboard avatar-title font-22 text-success"></i>
												</div>
											</div>
											<div class="col-9">
												<div class="text-end">
													<h3 class="my-1" style="margin-top:0!important"><span data-plugin="counterup">${data[i].task_count}</span></h3>
													<p class="text-muted mb-1 text-truncate" >`+str+`</p>
												</div>
											</div>
										</div>
									</div>
								</div> <!-- end card-->
							</div>`;
					
				}
				
				rowToday = `<div class="col-md-6 col-xl-3" onclick="$.fn.get_list_item_group('due_today')">
								<div class="card hoverCustom activeCustom due_today">
									<div class="card-body">
										<div class="row">
											<div class="col-3">
												<div class="avatar-sm bg-soft-success rounded" >
													<i class="fe-clipboard avatar-title font-22 text-success"></i>
												</div>
											</div>
											<div class="col-9">
												<div class="text-end">
													<h3 class="my-1" style="margin-top:0!important"><span data-plugin="counterup">${todaysCount}</span></h3>
													<p class="text-muted mb-1 text-truncate" >Due Today</p>
												</div>
											</div>
										</div>
									</div>
								</div> <!-- end card-->
							</div>`;
								
					rowOverDue = `<div class="col-md-6 col-xl-3" onclick="$.fn.get_list_item_group('overdue')">
									<div class="card hoverCustom activeCustom overdue">
										<div class="card-body">
											<div class="row">
												<div class="col-3">
													<div class="avatar-sm bg-soft-success rounded" >
														<i class="fe-clipboard avatar-title font-22 text-success"></i>
													</div>
												</div>
												<div class="col-9">
													<div class="text-end">
														<h3 class="my-1" style="margin-top:0!important"><span data-plugin="counterup">${overDueCount}</span></h3>
														<p class="text-muted mb-1 text-truncate" >Overdue</p>
													</div>
												</div>
											</div>
										</div>
									</div> <!-- end card-->
								</div>`;

					$('#list_task_group').append(row + rowToday + rowOverDue);					
				}


				let clientTaskCount = return_data.clientTaskCount;
				if(clientTaskCount > 0) {
					console.log('client task');
					rowClient = `<div class="col-md-6 col-xl-3" onclick="$.fn.get_list_client_tasks()">
								<div class="card hoverCustom activeCustom overdue">
									<div class="card-body">
										<div class="row">
											<div class="col-3">
												<div class="avatar-sm bg-soft-success rounded" >
													<i class="fe-clipboard avatar-title font-22 text-success"></i>
												</div>
											</div>
											<div class="col-9">
												<div class="text-end">
													<h3 class="my-1" style="margin-top:0!important"><span data-plugin="counterup">${clientTaskCount}</span></h3>
													<p class="text-muted mb-1 text-truncate" >Client</p>
												</div>
											</div>
										</div>
									</div>
								</div> <!-- end card-->
							</div>`;

					$('#list_task_group').append(rowClient);
				}
				
			 }, true
		 );
	 } 
	 catch (e) 
	 {
		 $.fn.log_error(arguments.callee.caller, e.message);
	 }
 }
 
 function toTitleCase(str) {
   return str.replace(
	 /\w\S*/g,
	 function(txt) {
	   return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
	 }
   );
 }
 
 $.fn.show_hide_form = function(form_status,reset_form,template=false)
 {
	 
	 if(reset_form) 
	 {   
		 $.fn.reset_form('form');
		 $.fn.reset_form('assignee_form');
	 }
	 if(form_status == 'NEW')
	 {
		 $('#list_div')		.hide(400);
		 $('#new_div')		.show(400);
		 $('#div_assignee')	.hide();
		 $('#div_thread')	.hide();
		 $('#div_hr')		.hide();
		 $("#searchDiv")		.hide();
		 $("#showSearchDiv")	.hide();
		 $('#h4_primary_no')	.text('Task No. : -');
		 $('#btn_pickup').show();
		 $('#client_remark_container').html('');
		 $('#btn_save')		.html('<i class="fa fa-check"> </i> Save');
		 $.fn.get_departments();
			
			
			var params = {
			emp_id:SESSIONS_DATA.emp_id
		}
		var data = [
			{ func: "get_sbd", params: params },
			{ func: "get_sbg", params: params },
			
			{ func: "get_taskTypes", params: params },
			{ func: "get_priority", params: params },
			
			{ func: "get_taskGroups", params: params },
			
		];
		
		 $.fn.get_everything_at_once_altrawise(data);
		 
		 $.fn.intialize_fileupload('doc_upload', 'doc_upload_files');
		 $("#addNewAssignee").attr("disabled","disabled");
		 btn_save = $("#btn_save");
		 $("#btn_save_template").hide();
		 $("#closeTaskWindow").show();
	 }
	 else if(form_status == 'EDIT')
	 {
		 $('#list_div')			.hide(400);   
		 $('#new_div')			.show(400);
		 $('#div_assignee')		.show();
		 $('#div_thread')		.show();
		 $('#div_hr')			.show();
		 $("#closeTaskWindow").show();
		 $("#addNewAssignee")	.removeAttr("disabled");
		 if(template)
			 $("#btn_save_template").show();
	 }
	 else if(form_status == 'BACK')
	 {	
		 $('#list_div')		.show(400);
		 $('#new_div')		.hide(400);   
		 $('#div_thread')	.hide(400);
				 
	 }
	 else
		 $("#closeTaskWindow").hide();
	
	 /* $('#btn_new')		.show();
	 $('#btn_save')		.show(); */
 };
 
 $.fn.reset_form = function(form)
 {
	 try
	 {
		 if(form == 'list')
		 {
			 $('#txt_title_search')					.val('');
			 $('#dd_status_search')					.val(JSON.parse("[0,1]")).change();
			 $('#dd_assign_to_search option:eq(0)')	.prop('selected',true).change();
			 $('#dd_created_by_search option:eq(0)')	.prop('selected',true).change();
			 $('#dd_task_group_search option:eq(0)')	.prop('selected',true).change();
			 $('#dd_task_company_search option:eq(0)').prop('selected',true).change();
		 }
		 else if(form == 'form')
		 {
			 TASK_ID							= '';
			 APPROVER_ID						= '';
			 REVIEWER_ID						= '';
			 $("#files")         			.empty();
			 $('#txt_task')      			.val('');
			 $('#txtarea_descr')				.val('');
			 $('#txtarea_descr_action')		.val('');
			 $('#ul_assigned li:not(:first)').remove();
			 $('#dd_type option:eq(0)')		.prop('selected',true).change();
			 $('#dd_dept option:eq(0)')		.prop('selected',true).change();
			 $('#dd_status')     			.val(250).change();
			 $('#dd_priority')   			.val(256).change();
			 $('#dp_date')       			.val('');
			 $('#btn_status')				.attr('disabled',true).data('value', 250);
			 $.fn.change_status_btn(250);
				$('#btn_save')					.show();
				$('#btn_cancel')				.show();
				$('#ul_assigned')				.empty();
				$('#ul_checklist')				.empty();
				
				$('#dd_sbg option:eq(0)')		.prop('selected',true).change();
			 $('#dd_sbd option:eq(0)')		.prop('selected',true).change();
			 $('#dd_oc option:eq(0)')		.prop('selected',true).change();
			 $('#dd_group option:eq(0)')		.prop('selected',true).change();
				
				$('#txt_task')      			.prop("disabled", false);
			 $('#txtarea_descr') 			.prop('disabled', false);
			 $('#txtarea_descr_action') 		.prop('disabled', false);
			 $('#dp_date')       			.prop('disabled', false);
			 $('#div_assign')				.show();
			 
			 $('#div_trail_btn')				.show();
			 
			 $('#div_approval_trail')		.hide();
			 $.fn.change_switchery($('#chk_send_review'),false);
			 
			 $('#div_review,#div_approve')	.hide();
			 
			 $('#btn_fileupload,#div_btn')	.show();
			 $('#div_reply').empty();
		 }
		 else if(form == 'assignee_form')
		 {   
			 $("#dd_assign_to #dd_assign_to_individual").empty();
			 $("#dd_assign_to #dd_assign_to_company").empty();
 
			 
			 
			 if(ASSIGN_TO)
				 $.fn.populate_dd_values('dd_assign_to', ASSIGN_TO);
			 
			 
			 $("#txt_action").val("");
			 $("#deadline_date").val("");
			 $('#provide_days').val(0);
			 $("#txt_action_edit").val("");
			 flatpickrDeadlineDate.clear();
			 $('#btn_add_assignee').html('<i class="fa fa-check"> </i> Add').data({'mode' : 'add', 'id' : 0});
			 $('#assigneeModalLabel').html('Add Assignee');
			 $("#dd_status").val(250).change();
			 $.fn.set_validation_form();
		 }
		 else if(form == 'sub_form')
		 {			
			 $("#files_reply")  	.empty();
			 $('#txt_reply')     .val('');
			 $('#div_reply')		.empty();
		 }
	 }
	 catch(err)
	 {
		 console.log(err);
		 //$.fn.log_error(arguments.callee.caller,err.message);
	 }
 };
 
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
							 <td><button type="button" class="btn btn-success waves-effect waves-light" onclick="$.fn.pick_this_template('${data[i].id}')"><i class="fa fa-download"></i> Pick This</button></td>          
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
 
 $.fn.pick_this_template = function (task_id)
 {
	 try 
	 {
		 $.fn.fetch_data
		 (
			 $.fn.generate_parameter('get_task_template_detail', {task_id : task_id}),
			 function(return_data)
			 {   
				 var data = return_data.data.details;
				 var assignees = return_data.data.assignees;
				 $('#txt_task')      		.val(data.task_title);
				 $('#txtarea_descr') 		.val($.fn.decodeURIComponentSafe(data.descr));
				 $('#txtarea_descr_action') 	.val($.fn.decodeURIComponentSafe(data.descr_action));
				 $('#dd_type')   			.val(data.task_type_id).change();
				 $('#dd_dept')   			.val(data.dept_id).change();
				 $("#task_creation_date")	.val(data.created_date);
				 /* flatpickr = $("#dp_date")	.flatpickr({
						 altInput: true,
						 altFormat: "d-M-Y",
						 dateFormat: "Y-m-d",
				 }); */
				 flatpickrDate       		.setDate(data.due_date);
				 $('#btn_status')			.data('value', data.status_id);
				 $('#dd_status')     		.val(250).change();
				 $('#dd_priority')   		.val(data.priority_id).change();
				 $("#dd_group")				.val(data.task_group_id).change();
				 $.fn.change_status_btn(data.status_id);
				 
				 let json_field = $.fn.get_json_string(data.json_field);
 
				 if(json_field.checklist)
				 {
					 $.fn.populate_checklist(json_field.checklist);
				 }
			 }, false, '', true, true
		 );
		 $('#task_template_modal').modal('hide');
		 $("#btn_save").attr("data-template-id",task_id);
	 } 
	 catch (e)
	 {
		 $.fn.log_error(arguments.callee.caller, e.message);
	 }
 }
 
 //get client tasks list
 $.fn.get_list_client_tasks = function() {
	 try {
		 let status_search = [""];
		 if($('#dd_status_search').val() != null) {
			 status_search = $('#dd_status_search').val();
		 }
 
		 var data	= {
			 title			: $('#txt_title_search')	.val(),
			 status			: status_search.toString(),
			 assign_to 		: $('#dd_assign_to_search').val(),
			 // created_by 		: $('#dd_created_by_search').val(),	
			 // group			: group,//$('#dd_task_group_search').val(),
			 company			: $('#dd_task_company_search').val(),
			 view_all		: 0,//MODULE_ACCESS.viewall,
			 start_index		: 0,
			 limit			: 10000,			
			 is_admin		: SESSIONS_DATA.is_admin,		
			 emp_id			: SESSIONS_DATA.emp_id
		  };
 
		 $.fn.fetch_data (
			 $.fn.generate_parameter('get_client_tasks_list_new', data),
			 function(return_data)
			 {
				 if(return_data.data)
				 {
					 $.fn.populate_list(return_data.data,false,1);
				 }
			 }, true
		 );
		 
		  
	 } catch(err) {
		 $.fn.log_error(arguments.callee.caller, e.message);
	 }
 }
 
 $.fn.get_list_item_group = function (group)
 {
	 try 
	 {
		 let status_search = [""];
		 if($('#dd_status_search').val() != null)
		 {
			 status_search = $('#dd_status_search').val();
		 }
		 //group = (group == 'daily') ? '' : group;
		 //$('#dd_task_group_search').val(group).change();
		 var data	= 
		 {
			 title			: $('#txt_title_search')	.val(),
			 status			: status_search.toString(),
			 assign_to 		: $('#dd_assign_to_search').val(),
			 created_by 		: $('#dd_created_by_search').val(),	
			 group			: group,//$('#dd_task_group_search').val(),
			 company			: $('#dd_task_company_search').val(),
			 view_all		: 0,//MODULE_ACCESS.viewall,
			 start_index		: 0,
			 limit			: 10000,			
			 is_admin		: SESSIONS_DATA.is_admin,		
			 emp_id			: SESSIONS_DATA.emp_id
		  };
		 
		  $.fn.fetch_data
		 (
			 $.fn.generate_parameter('get_tasks_list_new', data),
			 function(return_data)
			 {
				 if(return_data.data)
				 {
					 $.fn.populate_list(return_data.data,false,1);
				 }
			 }, true
		 );
	 } 
	 catch (e) 
	 {
		 $.fn.log_error(arguments.callee.caller, e.message);
	 }
 }
 
 $.fn.populate_list = function (data,is_scroll,list_id)
 {
	 try 
	 {	
		console.log("first");
		 if(list_id == 1)
		 {
			 $('#div_list_task_group')	.hide();
			 $('#list_task_group')		.empty();
			 $('#list_task')				.show();
			 
			 if(is_scroll == false)
			 {
				 $('#list_task').empty();
			 }
			
			 if (data.list) // check if there is any data, precaution
			 {
				 let row			= newRow = row_data = status = priority = replies = review_and_approval = '';
				 let due_date	= 'NOT SPECIFIED';
				 if(data.rec_index)
				 {
					 RECORD_INDEX = data.rec_index;
				 }
				 data = data.list;
				 for(var i = 0; i < data.length; i++)
				 {
					 row_data			= JSON.stringify(data[i]);
					 replies				= $.fn.get_json_string(data[i].latest_reply);
					 
					 json_field			= $.fn.get_json_string(data[i].json_field);
					 review_and_approval = '';
					 due_date			= 'NOT SPECIFIED';
					 
					 if(data[i].due_date != null && data[i].due_date != '')
					 {
						 due_date = moment(data[i].due_date).format(UI_DATE_FORMAT);
					 }
					 if(row_data != false)
					 {
						 switch (parseInt(data[i].status_id)) 
						 {
							 case 250:
								 status = `<span class="badge bg-success rounded-pill">${data[i].status_name}</span>`;
								 break;
							 case 251:
								 status = `<span class="badge bg-warning rounded-pill">${data[i].status_name}</span>`;
								 break;
							 case 252:
								 status = `<span class="badge bg-success rounded-pill">${data[i].status_name}</span>`;
								 break;
							 case 253:
								 status = `<span class="badge bg-primary rounded-pill">${data[i].status_name}</span>`;
								 break;
						 }
						 switch (parseInt(data[i].priority_id)) 
						 {
							 
							 case 254:
								 priority = priority.toUpperCase();
								 priority = `<span class="badge bg-success rounded-pill">${data[i].priority_name}</span>`;
								 break;
							 case 255:
								 priority = priority.toUpperCase();
								 priority = `<span class="badge bg-warning rounded-pill">${data[i].priority_name}</span>`;
								 break;
							 case 256:
								 priority = priority.toUpperCase();
								 priority = `<span class="badge bg-success rounded-pill">${data[i].priority_name}</span>`;
								 break;
							 default:
								 priority = priority.toUpperCase();
								 priority = `<span class="badge bg-success rounded-pill">${data[i].priority_name}</span>`;
								 break;
						 };
						 if(replies != false)
						 {
 
							 replies = `<div class="task-assign"><mark><i class="fa fa-exchange text-primary" aria-hidden="true"></i><i> ${replies.name} Replied on ${moment(replies.created_date).format(UI_DATE_FORMAT + " h:m A")}</i></mark></div>`;
						 }
						 else
						 {
 
							 replies = `<div>&nbsp;</div>`;
						 }
						 if(json_field != false)
						 {
							 
							 if(isNaN(parseInt(data[i].reviewer_id)) == false && json_field.sent_for_review == undefined)
							 {
								 review_and_approval = `<div class="task-assign">
															 <mark><i class="fa fa-inbox text-danger" aria-hidden="true"></i>
															 <i><i>Pending to Send For Review</i></i></mark>
														</div>`;
							 }
							 
							 if(isNaN(parseInt(data[i].reviewer_id)) == false && SESSIONS_DATA.emp_id == data[i].reviewer_id || 
									 isNaN(parseInt(data[i].approver_id)) == false && SESSIONS_DATA.emp_id == data[i].approver_id
							 )
							 {
 
								 if(json_field.reviewed_by_id == undefined && json_field.sent_for_review == 1)
								 {
									 review_and_approval = `<div class="task-assign">
																 <mark><i class="fa fa-times-circle text-danger" aria-hidden="true"></i>
																 <i><i>Pending For Review Initiation</i></i></mark>
															</div>`;
								 }
								 
								 if(json_field.reviewed_by_id != undefined)
								 {
									 review_and_approval = `<div class="task-assign">
																 <mark><i class="fa fa-check text-success" aria-hidden="true"></i>
																 <i><i>Reviewed By : ${json_field.reviewed_by_name}</i></i></mark>
															</div>`;
								 }
								 
								 if(json_field.approved_by_id != undefined)
								 {
									 review_and_approval += `<div class="task-assign">
																 <mark><i class="fa fa-check text-success" aria-hidden="true"></i>
																	<i><i>Approved By : ${json_field.approved_by_name}</i></i></mark>
															</div>`;
								 }
								 else if(json_field.reviewed_by_id != undefined && json_field.approved_by_id == undefined)
								 {
									 review_and_approval += `<div class="task-assign">
																 <mark><i class="fa fa-times-circle text-danger" aria-hidden="true"></i>
																 <i><i>Pending For Approval</i></i></mark>
															</div>`;
								 }
							 }
						 }
						 
						 /* row += `<li class='list-group-item task-item' data-value='${escape(JSON.stringify(data[i]))}' onclick=$.fn.populate_detail_form('${data[i].task_no}')>
									 <div class='row'>
										 <div class='apt-date col-sm-2 col-lg-2'>
											 <i class="fa fa-clock-o fa-fw" aria-hidden="true"></i>
											 <strong>${due_date}</strong>
											 <br/>
											 <strong><span class="badge badge-danger">${data[i].days_left} Days to Due</span></strong>
											 <br/>
											 <strong><span class="badge badge-success">${data[i].reply_count} Replies</span></strong>
											 <br/><br/>
											 <i class="fa fa-building" aria-hidden="true"></i>
												<strong><i>${data[i].sbg_name} <br/> ${data[i].sbd_name} <br/> ${data[i].company_name} </i></strong>
										 </div>
										 <div class='col-sm-4 col-lg-4'>
											 <span class="fa fa-comment-o task-title"> ${data[i].task_title}</span>
											 <div class="task-assign">
												 <i class="fa fa-group fa-fw text-info" aria-hidden="true"></i>
												 <strong><i>${data[i].assigned_to_name}</i></strong>
											 </div>
											 <div class="task-assign">
												 <i class="fa fa-reorder fa-fw" aria-hidden="true"></i>
												 <strong><i>${status} ${priority}</i></strong>
												 &nbsp;&nbsp;&nbsp;
												 <i class="fa fa-ticket text-primary" aria-hidden="true"></i>
												 <strong><i>${data[i].task_type_desc}</i></strong>
											 </div>
											 <div class="task-assign">
												 <i class="fa fa-user" aria-hidden="true"></i>
												 <strong><i>${data[i].created_by_name}</i></strong>
											 </div>
											 ${review_and_approval}
											 ${replies}
										 </div>
										 <div class='col-sm-6 col-lg-6'>
											 <span class="fa fa-comments text-success task-title"></span>&nbsp;${$.fn.decodeURIComponentSafe(data[i].descr)}
										 </div>
									   </div>
								 </li>`; */
								 
						 var dataName = (data[i].assigned_to_name == null) ? "Sita Rawat" : data[i]. assigned_to_name;
						 var myArray = dataName.split(",");
						 
						 var initialHTML = '';
						 var managerHTML = '';
						 var managerAvatar = '-'
						 if( myArray.length > 0 )
						 {
							 var initialHTML = '';
							 $( myArray ).each(function( index, value ) {
								 
								 initialHTML += '<div class="avatar-initials" width="30" height="30" data-name="'+value+'" title="I&#39;m a Tippy tooltip!" tabindex="0" data-plugin="tippy" data-tippy-placement="top" ></div>';
							 });
						 }
						 var createdByInitialHTML = '<div class="avatar-initials" width="30" height="30" data-name="'+data[i].created_by_name+'"></div>';
 
						 //if task created by client
						 if(data[i].client_id) {
							 if(data[i].assigned_manager != null) {
								 managerAvatar = '<div class="avatar-initials" width="30" height="30" data-name="'+data[i].assigned_manager+'" title="'+data[i].assigned_manager+'" tabindex="0" data-plugin="tippy" data-tippy-placement="top" ></div>';
							 }
							 
							 managerHTML = `<div><b><i class="mdi mdi-account-group"></i></b> Assign Manager:</div>
								 <div class="avatar-group" >
									 <a href="javascript: void(0);" class="avatar-group-item" id="popover-container`+i+`">
										 `+managerAvatar+`
									 </a>
								 </div>`
							 var createdByInitialHTML = ' '+data[i].client_name+' - ('+data[i].client_contact_name+')';
						 }
								 
								 
								 
								 newRow += `<div class="col-lg-4" data-value='${escape(JSON.stringify(data[i]))}' onclick=$.fn.populate_detail_form('${data[i].task_no}')>
				 <div class="card project-box hoverCustom activeCustom">
					 <div class="card-body">
						 
						 <!-- Title-->
						 <h4 class="mt-0"><a href="javascript:void(0);" class="text-dark sp-line-2 custom">${data[i].task_title}</a></h4>
						 <p class="text-muted text-uppercase"><i class="mdi mdi-clock"></i> <small>${due_date}</small></p>
						 <div class="badge bg-soft-danger text-danger mb-3">${data[i].days_left} Days to Due</div>
						 <div class="badge bg-soft-success text-success mb-3">${data[i].reply_count} Replies</div>
						 <div class="lblTaskStatusPriority">
							 <b>${status} ${priority}</b>
						 </div>
						 <!-- Desc-->
						 
						 <p class="text-muted font-13 mb-3 sp-line-2 custom"><i>${$.fn.decodeURIComponentSafe(data[i].descr)}
						 </i></p>
						 <!-- Task info-->
						 <p class="mb-0">
							 <span class="pe-2 text-nowrap d-inline-block">
								 <b><i class="mdi mdi-format-list-bulleted-type text-muted"></i>
								 ${data[i].task_type_desc}</b>
							 </span>
							 <span class="text-nowrap d-inline-block">
								 <i class="mdi mdi-comment-multiple-outline text-muted"></i>
								 <strong>${data[i].sbg_name}</strong>
								 
								 <p class="text-truncate"><i class="mdi mdi-comment-multiple-outline text-muted"></i> ${data[i].company_name}</p>
							 </span>
						 </p>
						 <!-- Team-->
						 `+managerHTML+`
						 <div><b><i class="mdi mdi-account-group"></i></b> Assign to:</div>
						 <div class="avatar-group" >
							 <a href="javascript: void(0);" class="avatar-group-item" id="popover-container`+i+`">
								 `+initialHTML+`
							 </a>
						 </div>
						 <div><b><i class="mdi mdi-account-details"></i></b> Created By: `+createdByInitialHTML+`</div>
						 <p class="mb-2"><hr style="margin:0.25rem;">${review_and_approval}${replies} </p>
					 </div>
				 </div> <!-- end card box-->
			 </div>`; 
					 
					 }
				 }
				 $('#list_task').append(newRow);
			 }
		 }
		 else if(list_id == 2)
		 {
			 if(data != null)
			 {
				 for(i = 0; i < data.length;i++)
				 {
					 let r_data = data[i];
					 let row_data 	= $.fn.get_json_string(data[i].json_field);
					 let row         = newRow = '';
					 
					 let photo		= CURRENT_PATH + '/assets/img/profile_default.jpg';
					 var dataName = (data[i].name == null) ? "Sita Rawat" : data[i].name;
					 
					 var initialHTML = '<div class="avatar-initials" width="30" height="30" data-name="'+data[i].name+'" title="I&#39;m a Tippy tooltip!" tabindex="0" data-plugin="tippy" data-tippy-placement="top" ></div>';
					 photo = initialHTML;
					 if(data[i].emp_photo != '')
					 {
						 //photo = data[i].emp_photo;
					 }
					 
					 let date = moment(data[i].created_date).format(UI_DATE_FORMAT + " h:mm A");
					 
					 row = `<ul class="panel-comments" style="display:inline-block">
									<li>
									 ${photo}
									 <div class="content" style="display:inline">
										 <span class="commented"><a href="#">${data[i].name}</a> commented on <a href="#">${date}</a></span>
										 ${data[i].descr} <br/><br/>
										 <div id="files_${data[i].id}"></div>
									 </div>
								 </li>
							 </ul>`;
							 
					 newRow = `<div class="d-flex align-items-start mb-3">
								 <div style="margin-right:0.75rem" class="avatar-initials small" width="30" height="30" data-name="Sayersilan" ></div>
								 <div class="w-100">
									 <h5 class="mt-0 mb-2"><a href="contacts-profile.html" class="text-reset">${data[i].name}</a> <small class="text-muted">${date}</small></h5>
									 ${data[i].descr}
									 <div id="files_${data[i].id}" class="mt-2"></div>
								 </div>
							 </div>`;
					 $('#div_reply').append(newRow);
 
					 //fetch attachment files
					 let get_param = {
						 id: '', 
						 module_id: MODULE_ACCESS.module_id, 
						 method: "get_files", 
						 primary_id: TASK_ID, 
						 secondary_id: r_data.id, 
						 token: $.jStorage.get('token') 
					 };
 
					 $.fn.fetch_data(
						 $.fn.generate_parameter('get_files', get_param),
						 function(return_data_attachment) {
							 if(return_data_attachment.data) {
								 let attachment_data = [];
								 attachment_data.attachment = return_data_attachment.data;
								 $.fn.populate_fileupload(attachment_data,`files_${r_data.id}`, true);
							 }
						 },
						 true
					 );
					 
				 }
			 }
		 }
		 else{
			 console.log("in");
			 return false;
		 }
		 $("#list_task_group").hide();
		 $("#list_task").show();
		 getInitials();
	 } 
	 catch (e) 
	 {
		 console.log(e.message);
		 //$.fn.log_error(arguments.callee.caller, e.message);
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
 
 $.fn.accept_client_task = function() {
	 try {
		 let data 	=
		 {
			 id				: TASK_ID,
			 emp_id      	: SESSIONS_DATA.emp_id,
			 emp_name      	: SESSIONS_DATA.name,
			 assign_id		: SESSIONS_DATA.emp_id,
			 
		 }
		 $.fn.write_data
		 (
			 $.fn.generate_parameter('accept_client_task', data),
			 function(return_data)
			 {
				 if (return_data.data)  // NOTE: Success
				 {
					 $('#btn_accept_client_task').hide();
					 $('#div_assign').show();
					 $('#btn_status').removeAttr('disabled');
					 $('#btn_cancel').show();
					 $('#btn_save').show();
					 $('#btn_save_template').show();
					 $.fn.show_hide_form('EDIT');
					 $.fn.show_right_success_noty('Task is assigned to you successfully');
				 }
			 },false, btn_accept_client_task
		 );
	 } catch(err) {
		 $.fn.log_error(arguments.callee.caller, err.message);
	 }
 }
 
 $.fn.populate_detail_form = function(task_no)
 {
	 try
	 {   
		 $("#showSearchDiv").hide();
		 $("#btn_new").hide();
		 
		 $.fn.get_departments();
		 $.fn.intialize_fileupload('fileupload_reply', 'files_reply');
		 $.fn.intialize_fileupload('doc_upload', 'doc_upload_files');
		 $.fn.fetch_data
		 (
			 $.fn.generate_parameter('get_task_detail', {task_no : task_no}),
			 function(return_data)
			 {
				 
				 let data        	= return_data.data.details;
				 let assignees   	= return_data.data.assignees;
				 let created_date 	= return_data.data.details.created_date;
 
				 console.log(data);
 
				 $("#btn_save_template").attr("data-assignees",JSON.stringify(assignees));
				
				 var params = {
			emp_id:SESSIONS_DATA.emp_id
		}
		var methods = [
			{ func: "get_sbd", params: params },
			{ func: "get_sbg", params: params },
			
			{ func: "get_taskTypes", params: params },
			{ func: "get_priority", params: params },
			
			{ func: "get_taskGroups", params: params },
			{ func: "get_status", params: params },
			
		];
		
				 $.fn.get_everything_at_once_altrawise(methods,data); 
		 
				 $("#task_creation_date").val(created_date);
				 $.fn.show_hide_form	('EDIT', true, true);
		 
				 let duedate = '';
				 if(data.due_date != null && data.due_date != '')
				 {
					 duedate = moment(data.due_date).format(UI_DATE_FORMAT);
				 }
				 /* flatpickr = $("#dp_date").flatpickr({
					 altInput: true,
					 altFormat: "d-M-Y",
					 dateFormat: "Y-m-d",
				 }); */
				 
				 TASK_ID						= data.task_no;
				 $("#files")         		.empty();
				 $('#h4_primary_no')			.text('Task No : ' + data.task_no);
				 $('#txt_task')      		.val(data.task_title);
				 $('#txtarea_descr') 		.val($.fn.decodeURIComponentSafe(data.descr));
				 $('#txtarea_descr_action') 	.val($.fn.decodeURIComponentSafe(data.descr_action));
				 $('#btn_status')			.data('value', data.status_id);
				 $('#dd_status')     			.val(250).change();
				 $('#dd_priority')   		.val(data.priority_id).change();
				 flatpickrDate       			.setDate(data.due_date);
				 
				 $('#dd_type')       		.val(data.task_type).change();
				 $('#dd_dept')       		.val(data.dept_id).change();
				 $('#dd_oc')       		.val(data.company_id).change();
				 
				 $.fn.change_status_btn(data.status_id);
				 $('#btn_status')	.attr('disabled',false);
				 APPROVER_ID			= data.approver_id;
				 REVIEWER_ID			= data.reviewer_id;
				 let json_field = $.fn.get_json_string(data.json_field);
				 
				 if(json_field != false)
				 {
					 data.attachment = json_field.attachment;
					 $.fn.populate_attachments(data);
					 
					 $('#div_review').hide();
					 $('#div_approve').hide();
					 
					 if(SESSIONS_DATA.emp_id == data.reviewer_id && json_field.sent_for_review != undefined && json_field.reviewed_by_name == undefined)
					 {
						 $('#div_review').show();
					 }
					 else if(SESSIONS_DATA.emp_id == data.approver_id && json_field.reviewed_by_name != undefined && json_field.approved_by_name == undefined)
					 {
						 $('#div_approve').show();
					 }
					 
					 
					 if(json_field.sent_for_review != undefined)
					 {
						 $('#div_approval_trail').show();
						 if(json_field.sent_for_review_date != undefined)
						 {
							 $('#div_approval_trails').html("Sent for Review on : " + json_field.sent_for_review_date);
						 }
						 if(json_field.reviewed_by_name != undefined)
						 {
							 $('#div_approval_trails').append("<br/>Reviewed on : " + json_field.reviewed_date + ' By : ' + json_field.reviewed_by_name);
						 }
						 if(json_field.approved_by_name != undefined)
						 {
							 $('#div_approval_trails').append("<br/>Approved on : " + json_field.approved_date + ' By : ' + json_field.approved_by_name);
						 }
					 }
					 
					 if(json_field.checklist)
					 {
						 $.fn.populate_checklist(json_field.checklist);
					 }
					 
				 }
 
				 $.fn.get_reply_list();
				 // IF not owner disable the editing
				 if (SESSIONS_DATA.emp_id != Number(data.created_by))
				 {
					 $.fn.disable_master_task_form();
				 }
 
				 if(parseInt(data.freeze_it) == 0)
				 {
					 $.fn.disable_master_task_form();
					 $('#div_trail_btn').hide();
				 }
 
				 //if task created by client
				 if(data.client_id) {
					 //hide template picker
					 $('#btn_pickup').hide();
 
					 //add client remark
					 let client_cont = `<div class="row mb-3">
											 <div class="col-md-12" >
												 <label for="simpleinput" class="form-label">Client Remark</label>
												 <textarea id="txtarea_client_remark" class="form-control fullscreen" rows="5" readonly>${data.client_remarks}</textarea>
											 </div>
										 </div>`;
 
					 $('#client_remark_container').html(client_cont);
 
					 if(data.assign_id == null) {
						 $('#div_assignee').hide();
 
						 $('#div_btn').show();
 
						 $('#btn_cancel').hide();
						 $('#btn_save').hide();
						 $('#btn_save_template').hide();
						 $('#btn_accept_client_task').show();
					 }else if(SESSIONS_DATA.emp_id == Number(data.assign_id)) {
						 // $('#txt_task')      		.prop('disabled', 'disabled');
						 // $('#txtarea_descr') 		.prop('disabled', 'disabled');
						 // $('#txtarea_descr_action') .prop('disabled', 'disabled');
						 // $('#dp_date')       		.prop('disabled', 'disabled');
						 $('#div_assign').show();
						 $('#btn_status').removeAttr('disabled');
						 $('#div_btn').show();
						 $('#btn_accept_client_task').hide();
					 }
				 }
				 
				 $('#btn_save').html('<i class="mdi mdi-update"></i> Update').data({'mode' : 'edit', 'id' : data.id});
				 //populate assignees list
				 var assignees_array = [];
				 if(assignees.length > 0)
				 {
					 for(let i = 0; i < assignees.length;i++)
					 {
						 let r_data = assignees[i];
						 assignees_array.push(r_data.user_id);
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
								 btn_link = `<a href="documents/outbound-documents/${r_data.doc_no}" data-navigo><button type="button" class="btn btn-primary waves-light waves-effect btn-xs"><i class="far fa-eye" aria-hidden="true"></i> Doc</button></a>`;
							 }else {
								 btn_link = `<a href="documents/outbound-documents/assignee/${r_data.id}" data-navigo><button type="button" class="btn btn-primary waves-light waves-effect btn-xs"><i class="fa fa-plus" aria-hidden="true"></i> Doc</button></a>`;
							 }
							 
							 btn_edit = `<a href="javascript:void(0);" class="action-icon btn_assignee_edit"  data-status="${r_data.status_id}"> <i class="mdi mdi-square-edit-outline"></i></a>`;
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
									 <div class="col-sm-2">
										 <div class="my-3 my-sm-0">
											 <p class="mb-0"><b>Status:</b> ${status_name}</p>
											 <p class="mb-0 text-muted"><b>Deadline:</b> ${deadline_date}</p>
											 <p class="mb-0 text-muted">${deadlineDays} days</p>
										 </div>
									 </div>
									 <div class="col-sm-4">
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
					 
				 }else {
					 $('#assignee_list').empty();
				 }
				 if(isNaN(parseInt(data.reviewer_id)) == false)
				 {    
					 if(json_field.sent_for_review == undefined && $.inArray(SESSIONS_DATA.emp_id, assignees_array) !== -1)
					 {
						 $('#div_send_review').show();
					 }
					 else
					 {
						 $('#div_send_review').hide();
					 }
				 }
				 populateXid(className = 'btn_assignee_edit');
			 }, false, '', true, true
		 );
		 
	 }
	 catch(err)
	 {
		 $.fn.log_error(arguments.callee.caller,err.message);
	 }
 };
 
 $.fn.get_employers_list = function()
 {
	 try
	 {
		 var data	= {};
													  
		  $.fn.fetch_data
		 (
			 $.fn.generate_parameter('get_employers_list',data),	
			 function(return_data)
			 {
				 if(return_data)
				 {
					 $.fn.populate_employers_drop_down(return_data.data);
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
					 data = JSON.stringify(return_data.data);
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
 
 $.fn.populate_employers_drop_down = function(data)
 {
	 try
	 {	
		 if (data)
		 {
			 var row			= '';
			 for(var i = 0; i < data.length; i++)
			 {
				 row += 	`<option value=${data[i].id}>
							 ${data[i].employer_name}
						 </option>`;
			 }
			 $('#dd_oc').html(row);
			 $('#dd_oc').val(data[0].id);
		 }
		 
  
	 }
	 catch(err)
	 {
		 $.fn.log_error(arguments.callee.caller,err.message);
	 }
 };
 
 $.fn.change_status_btn = function (value)
 {
	 try 
	 {
		 value = parseInt(value);
		 switch (value) 
		 {
			 case 250:
				 $('#btn_status').removeClass('btn-success btn-warning btn-danger btn-light').addClass('btn-primary').data('value', value);
				 $('#btn_status_text').html('Open');
				 break;
			 case 251:
				 $('#btn_status').removeClass('btn-primary btn-success btn-danger btn-light').addClass('btn-warning').data('value', value);
				 $('#btn_status_text').html('In Progress');
				 break;
			 case 252:
				 $('#btn_status').removeClass('btn-warning btn-primary btn-danger btn-light').addClass('btn-success').data('value', value);
				 $('#btn_status_text').html('Completed');
				 break;
			 case 253:
				 $('#btn_status').removeClass('btn-warning btn-success btn-primary btn-light').addClass('btn-danger').data('value', value);
				 $('#btn_status_text').html('Cancelled');
				 break;
		 };
	 } 
	 catch (e) 
	 {
		 $.fn.log_error(arguments.callee.caller, e.message);
	 }
 }
 
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
									 <i class="mdi mdi-delete" aria-hidden="true" title="Delete file1"></i>
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
						 .append(`<div class="col-sm-12">${btn_delete}
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
								 this_file.parents('.file-upload').remove();
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
		 //$.fn.log_error(arguments.callee.caller,err.message);
		 console.log(err);
	 }
 };
 
 $.fn.get_reply_list = function ()
 {
	 try
	 {
		 $.fn.fetch_data
		 (
			 $.fn.generate_parameter('get_task_reply_list_new', {task_no : TASK_ID}),
			 function(return_data)
			 {
				 if(return_data.data)
				 {
					 $.fn.populate_list(return_data.data,false,2);
				 }
			 }, false, '', true, true
		 );
	 }
	 catch (e) 
	 {
		 $.fn.log_error(arguments.callee.caller, e.message);
	 }
 }
 
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
 
 $.fn.get_task_template_list = function (is_scroll)
 {
	 try 
	 {	
		 
		 var data	= 
		 {
			 title			: $('#txt_tt_title_search').val(),
			 is_active		: 1,
			 view_all		: 0,//MODULE_ACCESS.viewall,
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
 
 $.fn.populate_checklist = function (data, created_by = false, add = false)
 {
	 try
	 {   
		 let row 		= newRow = checked = strike = '';
		 let realData 	= $("h5.task-description");
		 let realI 		= realData.length;
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
 
			  let delete_btn = '';
			  if (SESSIONS_DATA.emp_id == Number(created_by))
			  {
				  delete_btn = `<div class="options todooptions">
									 <div class="btn-group">
										 <button class="btn btn-default btn-xs"><i class="fa fa-trash-o" ></i></button>
									 </div>
								 </div>`;
			  }
			 
			  /* row += `<li>
					  <label>
						  <i class="fa fa-ellipsis-v icon-dragtask"></i>
						  <input type="checkbox" > 
						  <span class="task-description ${strike}"></span>
					  </label>
					  ${delete_btn}
				  </li>`; */
				  
				  newRow += `<div class="card mb-0 mt-2 deleteRow">
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
		 $('#ul_checklist').append(newRow);    	
	 } 
	 catch (e) 
	 {
		 $.fn.log_error(arguments.callee.caller, e.message);
	 }
 }
 
 function countDifferenceBetweenDates(date1, date2){
	 const diffTime = Math.abs(date2 - date1);
	 const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
	 return diffDays;
 }
 
 function populateXid(className){
	 $( "."+className ).each(function( index ) {
		 $(this).attr("data-xid",index);
	 });
 }
 
 $.fn.edit_assignee = function(data,xid=false)
 {
	 try 
	 {   
		 $("#btn_add_assignee").attr("data-xid",xid);
		 $.fn.reset_form('assignee_form');
		 let deadlineDays = diffOfDays = 0;
		 let statusOf1stAssignee = $(".btn_assignee_edit[data-xid='0']").attr("data-status");
		 let statusofThisAssignee = $(".btn_assignee_edit[data-xid='"+xid+"']").attr("data-status");
 
		 let r_data 		= $.fn.get_json_string(data);
		 let status_name = (r_data.status_name == null ) ? 'Not Set' : r_data.status_name;
		 
		 let status_id = (r_data.status_id == null ) ? '' : statusofThisAssignee;
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
		 console.log("selectedXid",xid)
		 if( xid == 0 ){
			 console.log("if selectedXid 0 status remove disabled")
			 $("#dd_status").removeAttr("disabled")
		 }
		 else{
			 console.log("if selectedXid not 0")
			 xid -= 1;
			 console.log("xid - 1",xid)
			 prevStatus = $(".btn_assignee_edit[data-xid='"+xid+"']").attr("data-status")
			 console.log("prevstatus",prevStatus)
			 if( prevStatus != 252 ){
				 console.log("prevstatus not 252 to disabled")
				 $("#dd_status").attr("disabled","disabled")
			 }
			 else{
				 console.log("prevstatus is 252 disabled")
				 $("#dd_status").removeAttr("disabled")
			 }
		 }
		 
		 /* if(xid && xid > 0 ){
			 let prevStatus = $(".btn_assignee_edit[data-xid='"+(xid-1)+"']").attr("data-status");
			 console.log(prevStatus,"ps",xid);
			 if( prevStatus != 252 )
				 $('#dd_status').attr('disabled','disabled');
		 }
		 else
			 $('#dd_status').removeAttr("disabled"); */
		
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
		 $('#dd_status').val(status_id).change();
	  
 
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
 
 $.fn.add_edit_task_reply = function ()
 {
	 try
	 {   
		 if($('#txt_reply').val() == '')
		 {
			 $.fn.show_right_error_noty('Reply cannot be empty');
			 btn_save_reply.stop();
			 return;
		 }
		 
		 $('#txt_reply').val($('#txt_reply').val().replace(/['"]/g, ''));
		 
		 let data =
		 {
			 task_no		: TASK_ID,
			 title       : $('#txt_task').val(),
			 comments    : $('#txt_reply').val().replace(/(?:\r\n|\r|\n)/g,'<br/>'),
			 review_it	: $('#chk_send_review').is(':checked'),
			 emp_id      : SESSIONS_DATA.emp_id,
			 emp_name    : SESSIONS_DATA.name,
		 }
 
		 $.fn.write_data
		 (
			 $.fn.generate_parameter('add_edit_tasks_reply_new', data),
			 function(return_data)
			 {
				 if (return_data.data)  // NOTE: Success
				 {
					 if(return_data.data.review_result == 1)
					 {
						 $('#div_review_it').hide();
					 }
 
					 //fileupload path
					 FILE_UPLOAD_PATH = `../files/${MODULE_ACCESS.module_id}/${TASK_ID}/`;
					 
					 let attachment_data =
					 {
						 id: '',
						 primary_id: TASK_ID,
						 secondary_id: return_data.data.id,
						 module_id: MODULE_ACCESS.module_id,
						 filename: '',
						 filesize: "0",
						 json_field: {},
						 emp_id: SESSIONS_DATA.emp_id
					 };
					 let file_uploaded = 0;
					 let files_count = $('#files_reply .file-upload.new').length;
					 if (files_count > 0)
					 {
						 $.fn.upload_file(`files_reply`, 'task_no', TASK_ID,
								 attachment_data, function (total_files, total_success, filename, attach_return_data)
							 {
								 if (total_files == total_success)
								 {   
									 // if(file_uploaded == files_count)
									 // {
										 $.fn.reset_form('sub_form');
										 $.fn.get_reply_list();
										 $("#btn_reply").removeClass("ladda-button");
									 // }
									 // file_uploaded++;
								 }
							 }, false, btn_save);
					 }
					 else
					 {   
						 $.fn.reset_form('sub_form');
						 $.fn.get_reply_list();
						 $("#btn_reply").removeClass("ladda-button");
					 }
				 }
			 },false,btn_save_reply
		 );
	 } 
	 catch (e) 
	 {
		 $.fn.log_error(arguments.callee.caller, e.message);
	 }
 }
 
 $.fn.set_validation_form = function()
 {   
	 //$('#detail_form').parsley().destroy();
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
 
	 $('#assignee_form').parsley().destroy();
	 $('#assignee_form').parsley(
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
 
 $.fn.view_checklist = function(data)
 {
	 try
	 {   
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
	 $.fn.save_checklist_for_task();
 }
 
 $.fn.save_checklist_for_task = function()
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
			 $.fn.generate_parameter('save_checklist_for_task', data),
			 function(return_data)
			 {
				 if (return_data.data)  // NOTE: Success
				 {   
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
 
 $.fn.populate_assignee_row = function(r_data, mode, is_assignee = true, i = false)
 {
	 try 
	 {   
		 console.log("inside populate_assignee_row",r_data,mode,is_assignee,i);
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
			 btn_edit = `<a href="javascript:void(0);" class="action-icon btn_assignee_edit"  data-status="${r_data.status_id}"> <i class="mdi mdi-square-edit-outline"></i></a>`;
			 btn_link = `<a href="documents/outbound-documents/assignee/${r_data.id}" data-navigo><button type="button" class="btn btn-primary waves-light waves-effect btn-xs"><i class="fa fa-plus" aria-hidden="true"></i> Doc</button></a>`;
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
				 <div class="col-sm-2">
					 <div class="my-3 my-sm-0">
						 <p class="mb-0"><b>Status:</b> ${status_name}</p>
						 <p class="mb-0 text-muted"><b>Deadline:</b> <font style='font-size:13px'>${deadline_date}</font></p>
						 <p class="mb-0 text-muted">${deadlineDays} days</p>
					 </div>
				 </div>
				 <div class="col-sm-4">
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
			 
			 $(`.assignee-row-${r_data.id}`).attr("data",JSON.stringify(r_data));
			 $(`#assignee-row-${r_data.id} .assignee-row-data`).replaceWith(row_data);
			 
			 // $('#tbl_assign_to tbody tr').removeClass('activeRow');
			 $('.btn_assignee_edit').removeAttr('disabled');
			 console.log(is_assignee,"is_assignee true or false")
			 if(is_assignee){
				 console.log(is_assignee,"is_assignee true")
				 $.fn.show_right_success_noty('Assignee has been updated successfully');
			 }
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
			 $("#btn_save").removeAttr("data-template-id");
			 if(r_data.json_field && r_data.json_field != "null"){
				 let tempChk = 		JSON.parse(r_data.json_field);
				 let chkData = 
				 {
					 assignee_id 	: r_data.id,
					 checklist		: tempChk.checklist,
					 emp_id 			: SESSIONS_DATA.emp_id
				 };
				 
				 $.fn.update_assignee_checklist_when_pick_template(chkData);
			 } 
			 $.fn.show_right_success_noty('Assignee has been added successfully');
		 }
		 populateXid(className = 'btn_assignee_edit');
		 $.fn.reset_form('assignee_form');
 
		 
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
		 
		 let data = [{name : $('#txt_checklist').val(), strike : false}];
		 $.fn.populate_checklist(data, false, add=true);
		 $('#txt_checklist').val('');
 
		 $.fn.save_checklist_for_task();
		 
	 } 
	 catch (e) 
	 {
		 $.fn.log_error(arguments.callee.caller, e.message);
	 }
 }
 
 $.fn.add_assignee = function(xid = false)
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
		 
		 $.fn.write_data(
			 $.fn.generate_parameter('add_assignee_for_task', data),
			 function(return_data)
			 {
				 if (return_data.data)  // NOTE: Success
				 {   
					 let r_data = return_data.data;
					 
					 //populate assignee row
					 $.fn.populate_assignee_row(r_data, mode,true,xid);
					 
					 //file upload
					 FILE_UPLOAD_PATH = `../files/${MODULE_ACCESS.module_id}/${TASK_ID}/`;
 
					 let attachment_data = {
						 id: '',
						 primary_id: TASK_ID,
						 secondary_id: r_data.id,
						 module_id: MODULE_ACCESS.module_id,
						 qquuid: '',
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
			 },false, btn_save_assignee, true
		 );
 
	 }
	 catch(err)
	 {
		 $.fn.log_error(arguments.callee.caller,err.message);
	 }
 };
 
 $.fn.change_switchery = function(obj, checked) 
 {
	 if ( ( obj.is(':checked') && checked == false ) || ( !obj.is(':checked') && checked == true ) ) 
	 {
		 obj.parent().find('.switchery').trigger('click');
	 }
 }
 
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
						 $.fn.generate_parameter('remove_assignee_for_task', data),
						 function(return_data)
						 {
							 if (return_data.data)  // NOTE: Success
							 {   
								 $.fn.show_right_success_noty('Assignee has been removed successfully');
								 let row_id = $('.assignee-row-' + assignee_id);
								 row_id.hide('slow', function() { row_id.remove(); });
							 }
						 },false, false
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
 
 $.fn.link_assignee = function(assignee_id)
 {
	 try
	 {
		 location.href = 'users?assignee_id='+assignee_id;
	 }
	 catch(err)
	 {
		 $.fn.log_error(arguments.callee.caller,err.message);
	 }
 };
 
 $.fn.update_assignee = function()
 {
	 try 
	 {	
		 
		 if($('#assignee_form').parsley().validate() == false)
		 {
			 btn_update_assignee.stop();
			 return;
		 }
		 
		 let id 		    	= $('#btn_update_assignee').attr('data-id');
		 let data 			= 
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
		 
			 $.fn.generate_parameter('add_assignee_for_task', data),
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
							 attachment_data, 
							 function (total_files, total_success, filename, attach_return_data) {
								 if (total_files == total_success)
								 {   
									 // if(file_uploaded == files_count)
									 // {
										 $.fn.populate_assignee_row(r_data, 'edit');
										 $.fn.populate_fileupload(attach_return_data, `assignee-files-${r_data.id}`, false);
									 // }
									 // file_uploaded++;
								 }
							 }, false, btn_update_assignee);
					 }
					 else
					 {
						 
						 $.fn.populate_assignee_row(r_data, 'edit');
						 btn_update_assignee.stop();
					 }
					 $(`#base_row_assignee`).show();
				 }
			 },false, btn_update_assignee, true
		 );
 
	 }
	 catch(err)
	 {
		 $.fn.log_error(arguments.callee.caller,err.message);
	 }
 };
 
 function get_sbd(rowData = false,details=false)
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
			 $('#dd_sbd').select2();
			 if(details)
				 $('#dd_sbd').val(details.sbd_id).change();
		 }
	 }
	 catch(err)
	 {
		 console.log(err.message);
		 //$.fn.log_error(arguments.callee.caller,err.message);
	 }
 };
 
 function get_sbg(rowData = false,details=false)
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
			 
			 $('#dd_sbg').select2();
			 if(details)
				 $('#dd_sbg').val(details.sbg_id).change();
		 }
	 }
	 catch(err)
	 {
		 console.log(err.message);
		 //$.fn.log_error(arguments.callee.caller,err.message);
	 }
 };
 
 $.fn.get_departments = function()
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
					 $('#dd_dept').html(row);
					 $('#dd_dept').val(0);
					 $('#dd_dept').select2();
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
 
 function get_taskTypes(rowData = false,details=false)
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
			 $('#dd_type').select2();
			 if(details)
				 $('#dd_type').val(details.task_type).change();
			 
		 }
	 }
	 catch(err)
	 {
		 console.log(err.message);
		 //$.fn.log_error(arguments.callee.caller,err.message);
	 }
 };
 
 function get_priority(rowData = false,details=false)
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
			 $('#dd_priority').select2();
			 $('#search_priority').html(row);
			 $('#search_priority').val('');
			 $('#search_priority').select2();
			 if(details)
				 $('#dd_priority').val(details.priority_id).change();
		 }
	 }
	 catch(err)
	 {
		 console.log(err.message);
		 //$.fn.log_error(arguments.callee.caller,err.message);
	 }
 };
 
 function get_taskGroups(rowData = false,details=false)
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
			 $('#dd_group').select2();
			 if(details)
				 $('#dd_group').val(details.task_group_id).change();
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
 
 $.fn.save_task_as_template = function(){
	 try
	 {
		 if($('#detail_form').parsley().validate() == false)
		 {
			 btn_save_template.stop();
			 return;
		 }
		 let date 	= moment($('#dp_date').val(), SERVER_DATE_FORMAT);
		 let data 	=
		 {
			 id				: TASK_ID,
			 title       	: $('#txt_task').val(),
			 descr       	: encodeURIComponent($('#txtarea_descr').val()),
			 status_id       : $('#dd_status').val(),
			 due_date    	: date.format('YYYY-MM-D'),
			 status			: $('#btn_status').data('value'),
			 priority		: $('#dd_priority').val(),
			 task_type_id	: $('#dd_type').val(),
			 checklist		: null,
			 is_active		: 1,
			 dept_id			: $('#dd_dept').val(),
			 emp_id      	: SESSIONS_DATA.emp_id,
			 emp_name      	: SESSIONS_DATA.name,
			 sbg_id 			: $('#dd_sbg').val(),
			 sbd_id			: $('#dd_sbd').val(),
			 oc_id			: $('#dd_oc').val(),
			 task_group		: $('#dd_group').val()
		 }
		 $.fn.write_data
		 (
			 $.fn.generate_parameter('add_edit_tasks_template', data),
			 function(return_data)
			 {
				 if (return_data.data)  // NOTE: Success
				 {
					 TEMPLATE_ID				= return_data.data.id;
					 var assignees = JSON.parse($("#btn_save_template").attr("data-assignees"));
					 if( assignees ){
						 $( assignees ).each(function(key,value) {
							 
							 let tempData = 
							 {
								 id 				: 0,
								 task_no         : TEMPLATE_ID, 
								 type 			: value.type,
								 user_id 		: value.user_id,
								 action 			: value.action,
								 emp_id 			: SESSIONS_DATA.emp_id
							 };
							 var checkListData 	= value.json_field;
							 //checkListData 		= JSON.parse(checkListData);
							 //console.log(checkListData);return false;
							 $.fn.write_data
							 (
								 $.fn.generate_parameter('add_assignee_for_task_template', tempData),
								 function(return_data)
								 {
									 if (return_data.data)  // NOTE: Success
									 {
										 let chkData = 
										 {
											 assignee_id 	: return_data.data.id,
											 checklist		: JSON.parse(checkListData),
											 emp_id 			: SESSIONS_DATA.emp_id,
											 save_as_temp	: 1
										 };
										 
										 $.fn.write_data
										 (
											 $.fn.generate_parameter('save_checklist_for_task_template', chkData),
											 function(return_data)
											 {
												 if (return_data.data)  // NOTE: Success
												 {   
													 $.fn.show_right_success_noty('CheckList has been updated to new Template.');
												 }
											 },false, false
										 );
										 $.fn.show_right_success_noty('Assignee(s) added successfully to new Template.');
									 }
								 },false, false, true
							 );
						 });
						 
					 }
					 btn_save_template.stop();
					 $.fn.show_right_success_noty('Data has been recorded successfully');
					 $("#btn_save_template").removeClass("ladda-button");
				 }
			 },false, btn_save_template
		 );
		 
	 }
	 catch (e) 
	 {
		 $.fn.log_error(arguments.callee.caller, e.message);
	 }
 }
 
 $.fn.add_edit_task = function ()
 {
	 try
	 {
		 if($('#detail_form').parsley().validate() == false)
		 {
			 btn_save.stop();
			 return;
		 }
		 let date 	= moment($('#dp_date').val(), SERVER_DATE_FORMAT);
		 let data 	=
		 {
			 task_no			: TASK_ID,
			 title       	: $('#txt_task').val(),
			 descr       	: encodeURIComponent($('#txtarea_descr').val()),
			 status_id       : $('#dd_status').val(),
			 // descr_action    : encodeURIComponent($('#txtarea_descr_action').val()),
			 // assign_data 	: $.fn.get_assignee(),
			 due_date    	: date.format('YYYY-MM-D'),
			 status			: $('#btn_status').data('value'),
			 priority		: $('#dd_priority').val(),
			 // priority_name 	: $('#dd_priority option:selected').text(),
			 task_type		: $('#dd_type').val(),
			 dept_id			: $('#dd_dept').val(),
			 // attachment		: attachment,
			 emp_id      	: SESSIONS_DATA.emp_id,
			 emp_name      	: SESSIONS_DATA.name,
			 // to_chat_ids		: $.fn.get_assignee_for_chat(),
			 //checklist		: $.fn.get_checklist_list(),
 
			 sbg_id 			: $('#dd_sbg').val(),
			  sbd_id			: $('#dd_sbd').val(),
			  oc_id			: $('#dd_oc').val(),
			  task_group		: $('#dd_group').val()
		 }
		 var task_creation_date = (new Date()).toISOString().split('T')[0];
		 $("#task_creation_date").val(task_creation_date);
		 $.fn.write_data
		 (
			 $.fn.generate_parameter('add_edit_tasks_new', data),
			 function(return_data)
			 {
				 if (return_data.data)  // NOTE: Success
				 {
					 TASK_ID				= return_data.data.task_no;
					 $('#h4_primary_no').text('Task No : ' + TASK_ID);
					 
					 $.fn.show_hide_form	('EDIT');
					 var templateId = $("#btn_save").attr("data-template-id");
					 btn_save.stop();
					 
					 if( templateId  )
						 $("#loading").html("&nbsp;[Please wait...while populating any Assignee(s) to add.] ");
					 $.fn.show_right_success_noty('Data has been recorded successfully');
					 
					 $.fn.get_list(false);
					 $("#trail").attr("data-name",SESSIONS_DATA.name);
					 $("#btn_save").removeClass("ladda-button");
					 
					 if( templateId  )
						 $.fn.populate_template_assignee_row(templateId);
					 
				 }
			 },false, btn_save
		 );
	 } 
	 catch (e) 
	 {
		 $.fn.log_error(arguments.callee.caller, e.message);
	 }
 }
 
 $.fn.get_tasks_my_priority = function ()
 {
	 try 
	 {
		 var data	= 
		 {		
			 is_admin	: SESSIONS_DATA.is_admin,		
			 emp_id		: SESSIONS_DATA.emp_id
		  };
		  
		 $.fn.fetch_data
		 (
			 $.fn.generate_parameter('get_tasks_my_priority', data),
			 function(return_data)
			 {
				 if(return_data.data)
				 {
					 $('#badge_priority').html(return_data.data.count);
					 $.fn.populate_list(return_data.data,false,1);
					 $('#div_load_more').hide();
				 }
			 }, true
		 );
 
	 } 
	 catch (e) 
	 {
		 $.fn.log_error(arguments.callee.caller, e.message);
	 }
 }
 
 $.fn.get_list_waiting_for_review_approval = function (type)
 {
	 try 
	 {
		 var data	= 
		 {		
			 is_admin	: SESSIONS_DATA.is_admin,		
			 emp_id		: SESSIONS_DATA.emp_id,
			 type		: type
		  };
		  
		  $.fn.fetch_data_for_list
		 (
			 $.fn.generate_parameter('get_tasks_list_waiting_review_approval',data),
			 $.fn.populate_list,false,'list_task'
		 ); 
	 } 
	 catch (e) 
	 {
		 $.fn.log_error(arguments.callee.caller, e.message);
	 }
 }
 
 $.fn.get_list = function (is_scroll)
 {
	 try 
	 {	
		 let status_search = [""];
		 if($('#dd_status_search').val() != null)
		 {
			 status_search = $('#dd_status_search').val();
		 }
		 
		 var data	= 
		 {
			 title			: $('#txt_title_search')	.val(),
			 status			: status_search.toString(),
			 assign_to 		: $('#dd_assign_to_search').val(),
			 created_by 		: $('#dd_created_by_search').val(),	
			 group			: $('#dd_task_group_search').val(),
			 company			: $('#dd_task_company_search').val(),
			 view_all		: MODULE_ACCESS.viewall,
			 start_index		: RECORD_INDEX,
			 limit			: LIST_PAGE_LIMIT,			
			 is_admin		: SESSIONS_DATA.is_admin,		
			 emp_id			: SESSIONS_DATA.emp_id
		  };
		  
		  if(is_scroll)
		  {
			  data.start_index =  RECORD_INDEX;
		  }
		  
		  $.fn.fetch_data_for_list
		 (	
			 $.fn.generate_parameter('get_tasks_list_new',data),
			 $.fn.populate_list,is_scroll,'list_task'
		 ); 
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
 
 $.fn.disable_master_task_form = function()
 {
	  $('#txt_task')      		.prop('disabled', 'disabled');
	  $('#txtarea_descr') 		.prop('disabled', 'disabled');
	  $('#txtarea_descr_action') .prop('disabled', 'disabled');
	  $('#dp_date')       		.prop('disabled', 'disabled');
	  $('#div_assign')			.hide();
	  $('#btn_status')			.attr('disabled',true);
	  $('#btn_fileupload,#div_btn').hide();
 
	  $('#base_row_assignee').hide();
 }
 
 $.fn.create_assignee = function(id,name,photoname,chat_username)
 {
	 try
	 {
		 let return_it 	= false;
		 
		 $("#ul_assigned > li > [href]").each(function()
		 {
			 if(parseInt(id) == parseInt($(this).attr('data')))
			 {
				 return_it = true;
			 }
		 });
		 if(return_it) return;
		 
		 let photo		= SESSIONS_DATA.filepath + 'photos/' + id  + '/' + photoname;
		 row = `<li data-stats="remove">
					 <a href="javascript:void(0)" onclick="$(this).parent().remove()" data="${id}" name="${name}" chat_username="${chat_username}">
						 <img src="${photo}" onerror="this.src=$('#current_path').val() + 'assets/img/profile_default.jpg'">
						 <span>${name}</span>
					 </a>
				 </li>`;
	 
		 $('#ul_assigned').append(row);
		 
	 }
	 catch(err)
	 {
		 $.fn.log_error(arguments.callee.caller,err.message);
	 }
 };
 
 $.fn.get_assignee = function()
 {
	 try
	 {
		 let assignee_data = [];
		 let assignee_inputs = $(".btn_assignee_delete");
		 for(let i = 0; i < assignee_inputs.length;i++)
		 {	
			 assignee_data.push(JSON.parse($(assignee_inputs[i]).attr('data')));
		 }
		 return assignee_data;
	 }
	 catch(err)
	 {
		 $.fn.log_error(arguments.callee.caller,err.message);
	 }
 };
 
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
		 return assignee;
		 
	 }
	 catch(err)
	 {
		 $.fn.log_error(arguments.callee.caller,err.message);
	 }
 };
 
 $.fn.update_task_review_approval = function(type,btn) 
 {
	 try 
	 {
		 let data =
		 {
			 task_no  	: TASK_ID,
			 emp_id   	: SESSIONS_DATA.emp_id,
			 emp_name   	: SESSIONS_DATA.name,
			 type		: type
		 }
 
		 $.fn.write_data
		 (
			 $.fn.generate_parameter('update_task_review_approval', data),
			 function(return_data)
			 {
				 if (return_data.data)
				 {
					 if(type == 1)
					 {
						 $.fn.show_right_success_noty('Task has been reviewed');
						 $('#div_review').hide('slow');
						 if(SESSIONS_DATA.emp_id == APPROVER_ID)
						 {
							 $('#div_approve').show();
						 }
					 }
					 else if(type == 2)
					 {
						 $.fn.show_right_success_noty('Task has been Approved');	
						 $('#div_approve').hide('slow');
					 }
				 }
			 }, false,btn
		 );
	 } 
	 catch (e) 
	 {
		 $.fn.log_error(arguments.callee.caller, e.message);
	 }
 }
 
 $.fn.navigate_form = function (task_no)
 {
	 try
	 {
		 $.fn.populate_detail_form(task_no);
	 }
	 catch (e)
	 {
		 $.fn.log_error(arguments.callee.caller, e.message);
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
			  $('#dd_status_search').val(JSON.parse("[250,251]")).change();
			 $('#dd_status_search').select2();
		 }
	 }
	 catch(err)
	 {
		 console.log(err.message);
		 //$.fn.log_error(arguments.callee.caller,err.message);
	 }
 };
 
 function get_search_assignee(rowData = false)
 {
	 try
	 {
		  var row = '<option value="">Please Select</option>';											
		 if(rowData)
		 {
			 
			 for(var i = 0; i < rowData.length; i++)
			 {
				 
				 row += 	`<option value=${rowData[i].id}>
							 ${rowData[i].desc}
						 </option>`;
			 }
			 $('#dd_assign_to_search').html(row);
			 $('#dd_assign_to_search').val("");
			 $('#dd_assign_to_search').select2();
		 }
	 }
	 catch(err)
	 {
		 console.log(err.message);
		 //$.fn.log_error(arguments.callee.caller,err.message);
	 }
 };
 
 function get_search_created_by(rowData = false)
 {
	 try
	 {
		  var row = '<option value="">Please Select</option>';											
		 if(rowData)
		 {
			 for(var i = 0; i < rowData.length; i++)
			 {
				 
				 row += 	`<option value=${rowData[i].id}>
							 ${rowData[i].desc}
						 </option>`;
			 }
			 $('#dd_created_by_search').html(row);
			 $('#dd_created_by_search').val("");
			 $('#dd_created_by_search').select2();
		 }
	 }
	 catch(err)
	 {
		 console.log(err.message);
		 //$.fn.log_error(arguments.callee.caller,err.message);
	 }
 };
 
 function get_search_schedule_type(rowData = false)
 {
	 try
	 {
		  var row = '<option value="">Please Select</option>';											
		 if(rowData)
		 {
			 
			 for(var i = 0; i < rowData.length; i++)
			 {
				 
				 row += 	`<option value=${rowData[i].id}>
							 ${rowData[i].desc}
						 </option>`;
			 }
			 $('#dd_task_group_search').html(row);
			 $('#dd_task_group_search').val("");
			 $('#dd_task_group_search').select2();
		 }
	 }
	 catch(err)
	 {
		 console.log(err.message);
		 //$.fn.log_error(arguments.callee.caller,err.message);
	 }
 };
 

 
 function get_search_company(rowData = false)
 {
	 try
	 {
		  var row = '<option value="">Please Select</option>';											
		 if(rowData)
		 {
			 for(var i = 0; i < rowData.length; i++)
			 {
				 
				 row += 	`<option value=${rowData[i].id}>
							 ${rowData[i].desc}
						 </option>`;
			 }
			 $('#dd_task_company_search').html(row);
			 $('#dd_task_company_search').val("");
			 $('#dd_task_company_search').select2();
		 }
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
 
 $.fn.calculate_deadline_date = function( $this, edit=false, returnCount=false )
 {
	 try
	 {											
		 var noOfDaysToAdd = $($this).val();
		 var holidays = JSON.parse($("#task_creation_date").attr("data-public-holidays"));
		 let holidaysArray = new Array();
		 for( let i=0; i<holidays.length;i ++){
		 
			 finalDate = new Date(holidays[i].holiday);
			 finalDate.setHours( 0,0,0,0 );
			 holidaysArray.push(finalDate.getTime());
		 }
		 if(noOfDaysToAdd != '')
		 {
			 noOfDaysToAdd 		= parseInt(noOfDaysToAdd);
			 let created_date 	= $("#task_creation_date").val();
			 startDate 			= new Date(created_date.replace(/-/g, "/"));
			 var endDate 		= ""; 
			 var count 			= 0;
			 
			 while(count < noOfDaysToAdd){
				 endDate = new Date(startDate.setDate(startDate.getDate() + 1));
				 endDate.setHours( 0,0,0,0 );
				 if(endDate.getDay() != 0 && endDate.getDay() != 6)
					 count++;
				 if ($.inArray(endDate.getTime(), holidaysArray) > -1)
					 count--;
			 }
			 if(edit){
				 var flatpickrDeadlineDateEdit = $("#deadline_date_edit").flatpickr({
					 altInput: true,
					 altFormat: "d-M-Y",
					 dateFormat: "Y-m-d",
				 });
				 flatpickrDeadlineDateEdit.setDate(endDate);
			 }
			 else
				 flatpickrDeadlineDate.setDate(endDate);
		 }
	 }
	 catch(err)
	 {
		 console.log(err.message);
		 //$.fn.log_error(arguments.callee.caller,err.message);
	 }
 };
 
 $.fn.bind_command_events = function()
 {	
	 try
	 {
		 
		 $('#addEditAssigneeModal').on('show.bs.modal', function(event) {
				 $('#dd_assign_to').select2({
				 dropdownParent: $("#addEditAssigneeModal")
			 });
			 if( (event.relatedTarget) &&  event.relatedTarget.id == 'addNewAssigneeBtn' ){
				 xid = $(".btn_assignee_edit").length -1
				 firstStatus = $(".btn_assignee_edit[data-xid='0']").attr("data-status")
				 if( xid >= 0 ){
					 statusVal = $(".btn_assignee_edit[data-xid='"+xid+"']").attr("data-status")
					 if( statusVal != 252  )
						 $("#dd_status").attr("disabled","disabled")
					 else
						 $("#dd_status").removeAttr("disabled")
				 }
				 else
					 $("#dd_status").removeAttr("disabled")
				 
			 }				
			 $.fn.reset_form('assignee_form')
		 });
		 $('#btn_save_checklist').click( function(e)
		 {   
			 e.preventDefault();
			 btn_save_checklist = Ladda.create(this);
			 btn_save_checklist.start();
			   $.fn.save_checklist_for_task();
		 });
		 
		 $('#btn_save_template').click( function(e)
		 {   
			 e.preventDefault();
			 btn_save_template = Ladda.create(this);
			 btn_save_template.start();
			  $.fn.save_task_as_template();
		 });
 
		 $("#txt_checklist").keypress(function(e) 
		 {
			 if (e.which == 13) 
			 {
				 e.preventDefault();
				 $('#btn_add_checklist').trigger('click');
			 }
		 });
 
		 $('#btn_approve').click( function(e)
		 {
			 e.preventDefault();
			 let btn = Ladda.create(this);
			 btn.start();
			 $.fn.update_task_review_approval(2,btn);
		 });
 
		 $('#btn_verify').click( function(e)
		 {
			 e.preventDefault();
			 let btn = Ladda.create(this);
			 btn.start();
			 $.fn.update_task_review_approval(1,btn);
		 });
 
		 $('#btn_list_send_review').click( function(e)
		 {
			 e.preventDefault();
			 $.fn.get_list_waiting_for_review_approval(2);
		 });
 
		 $('#btn_search').click( function(e)
		 {
			 e.preventDefault();			
			 RECORD_INDEX = 0;
			 $.fn.get_list(false);
		 });
 
		 $('.status-btn').on('click', function(e) 
		 {
			 e.preventDefault();
			 let value = $(this).data('value');
			 $.fn.change_status_btn(value);
		 });
 
		 $('body').on('click', '.status-btn', function(e)
		 {
			 e.preventDefault();
			 let value = $(this).data('value');
			 $.fn.change_status_btn(value);
		 });
 
		  $('#btn_show_group').on('click', function(event) 
		 {
			 event.preventDefault();
			 $.fn.get_list_group();
		 });
 
		 $('#btn_list_approve').click( function(e)
		 {
			 e.preventDefault();
			 $.fn.get_list_waiting_for_review_approval(1);
		 });
 
		 $('#btn_list_review').click( function(e)
		 {
			 e.preventDefault();
			 $.fn.get_list_waiting_for_review_approval(0);
		 });
 
		 $('#btn_list_priority').click( function(e)
		 {
			 e.preventDefault();
			 
			 $.fn.get_tasks_my_priority();
		 });
 
		 $('#btn_save').on('click', function(e) 
		 {
			 e.preventDefault();
			 btn_save = Ladda.create(this);
			  btn_save.start();
			 $.fn.add_edit_task();
			 getInitials();
		 });
 
		 $('body').on('click', '#btn_update_assignee', function(e)
		 {
			 e.preventDefault();
			 btn_update_assignee = Ladda.create(this);
			 btn_update_assignee.start();
			  $.fn.update_assignee();
		 });
 
		 $('#btn_add_assignee').click( function(e)
		 {
			 e.preventDefault();
			 btn_save_assignee = Ladda.create(this);
			 btn_save_assignee.start();
			 var xid = $(this).attr("data-xid");
			 xid = (xid) ? xid : $(".btn_assignee_edit").length;
			 
			  $.fn.add_assignee(xid);
		 });
 
		 $('#btn_add_checklist').on('click', function(e) 
		 {
			 e.preventDefault();
			 $.fn.add_checklist();
		 });
 
		 $('body').on('click', '#btn_cancel_assignee', function(e)
		 {
			 e.preventDefault();
			 // $('#tbl_assign_to tbody tr').removeClass('activeRow');
			 
			 $.fn.reset_form('assignee_form');
 
			 // let id = $(this).attr('data-id');
			 // $(`#assignee-row-${id}`).html(TEMP_ROW);
			 // $('.btn_assignee_edit').removeAttr('disabled');
			 // $(`#base_row_assignee`).show();
		 });
 
		 $('body').on('click', '.btn_assignee_edit', function(e)
		 {
			 e.preventDefault();
			 $('.btn_assignee_edit').attr('disabled', 'disabled');
			 // $('#tbl_assign_to tbody tr').removeClass('activeRow');
			 let data = $(this).parents('.assignee-row').attr('data');
			 let xid = $(this).attr("data-xid");
			 $.fn.edit_assignee(data, xid);
			 $("#provide_days_edit").trigger("change");
		 });
 
		 $('#btn_reply').on('click', function(e) 
		 {
			 e.preventDefault();
			 btn_save_reply = Ladda.create(this);
			 btn_save_reply.start();
			 $.fn.add_edit_task_reply();
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
			 $(this).hide();
		 });
 
		 $('#showSearchDiv').on('click', function(event) 
		 {
			 event.preventDefault();
			 $("#searchDiv").show();
			 $("#showSearchDiv").hide();
		 });
 
		 $('#closeTaskWindow').on('click', function(event) 
		 {
			 event.preventDefault();
			 $("#new_div").hide();
			 $("#div_thread").hide();
			 $("#showSearchDiv").show();
			 $("#btn_new").show();
			 $("#list_div").show();
			 $("#assignee_list").empty();
			 RECORD_INDEX = 0;
			 $.fn.get_list(false);
			 $("a[data-bs-toggle]").removeClass("active");
			 $("#btn_show_group").addClass("active");
			 $("#div_thread").hide();
			 $.fn.show_hide_form('',true);
		 });
 
		 $('#closeSearch').on('click', function(event) 
		 {
			 event.preventDefault();
			 $("#searchDiv").hide();
			 $("#showSearchDiv").show();
		 });
 
		 $('#btn_back, #btn_cancel').click( function(e)
		 {
			 e.preventDefault();
			 $.fn.show_hide_form('BACK');
			 RECORD_INDEX = 0;
			 $.fn.get_list(false);
		 });
		 
		 $('body').on('click', '#btn_update_image', function(e)
		 {
			 e.preventDefault();
			 $( "#doc_upload_edit" ).trigger( "click" );
		 });
 
		 $('#btn_accept_client_task').on('click', function(e) {
			 e.preventDefault();
			 btn_accept_client_task = Ladda.create(this);
			 btn_accept_client_task.start();
			 $.fn.accept_client_task();
		 });
 
		 //switchery
		 let elems = Array.prototype.slice.call(document.querySelectorAll('.js-switch'));
		 $('.js-switch').each(function () 
		 {
			 new Switchery($(this)[0], $(this).data());
		 });
		 
		 $("select.has-error").each(function() {
			 var id = $(this).attr("id");
			 $("span[aria-labelledby='select2-"+id+"-container']").addClass("has-error");
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
		 $("#closeTaskWindow").hide();
		 let dataToSend = {
			 company_id	:DEFAULT_COMPANY_ID,
			 year		:DEFAULT_COMPANY_YEAR,
			 onlyActive	:1
		 }
		 get_holidays_list(dataToSend);
		 flatpickrDeadlineDateEdit = $("#deadline_date_edit").flatpickr({
			 altInput: true,
			 altFormat: "d-M-Y",
			 dateFormat: "Y-m-d",
		 });
		 flatpickrDate = $("#dp_date").flatpickr({
			 altInput: true,
			 altFormat: "d-M-Y",
			 dateFormat: "Y-m-d",
		 });
		 flatpickrDeadlineDate = $("#deadline_date").flatpickr({
			 altInput: true,
			 altFormat: "d-M-Y",
			 dateFormat: "Y-m-d",
			 enableTime:false,
		 });
 
		 $('#assignee_form').parsley(
			 {
				 classHandler: function(parsleyField) {              
					 return parsleyField.$element.closest(".errorContainer");
				 },
				 errorsContainer: function(parsleyField) {              
					 return parsleyField.$element.closest(".errorContainer");
				 },
			 }
		 );
		 
		 $.fn.get_review_approval_count();
		 $.fn.get_list_group();
		 $.fn.get_employers_list();
		 $("#list_task").hide();
		 $('#dd_oc').select2();
		 $('#dd_assign_to').select2({
			 dropdownParent: $("#addEditAssigneeModal")
		 });
		 $('#dd_status').select2({
			 dropdownParent: $("#addEditAssigneeModal")
		 });
		 $("#dd_status_search").select2();
		 let search_params 	= new URLSearchParams(window.location.search);
		 let task_no			= search_params.get('task_no');
		 if(task_no != null)
		 {   
			 $.fn.navigate_form(task_no);
		 }
		 $.fn.get_tasks_drop_down_values();
		 $.fn.set_validation_form();
		
		 
		var params = {
			emp_id:SESSIONS_DATA.emp_id
		}
		var data = [
			{ func: "get_search_status", params: params },
			{ func: "get_search_assignee", params: params },
			{ func: "get_search_company", params: params },
			{ func: "get_search_schedule_type", params: params },
			{ func: "get_search_created_by", params: params }
		];
		
		 $.fn.get_everything_at_once_altrawise(data);
		 var elems = Array.prototype.slice.call(document.querySelectorAll('.js-switch'));
		 $('.js-switch').each(function() 
		 {
			 new Switchery($(this)[0], $(this).data());
		 });
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
 
