/**
 * @author Jamal
 * @date 01-Oct-2021
 * @Note = Please do not apply Ctr-Alt-Format for better readable codes
 *         Please follow the indentation
 *         Please follow the naming convention
 */
var RECORD_INDEX 	= 0;
var upload_section 	= '';
var btn_save; EMP_ID = '';
var btn_leave_save; EMP_LEAVE_ID = '';
var btn_test_email;
var BACKUP_SESSION = '';
var CODE_TRIGGERED = false;
var p_status = '';
var pid = "";
var flatpickerEndTime, flatpickerEndTime = '';

$(window).on('beforeunload', function ()
{
	// Temporary disable
	// $.fn.signout_application();
	// $.fn.user_logout();	
});

$.fn.data_table_features = function ()
{
	try
	{
		if (!$.fn.dataTable.isDataTable('#tbl_list'))
		{
			table = $('#tbl_list').DataTable
				({
					
					bAutoWidth: false, 
					aoColumns : [
						{ sWidth: '20%' },
						{ sWidth: '15%' },
						{ sWidth: '15%' },
						{ sWidth: '15%' },
						{ sWidth: '5%' },
						{ sWidth: '15%' },
						{ sWidth: '5%' }
					],
					"searching": false,
					"paging": false,
					"info": false,
					//				 "ordering": false
					"order": [],
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

$.fn.reset_form = function(form)
{
	try
	{
		FORM_STATE		= 0;		
		if(form == 'list')
		{
			$('#txt_name_search').val('').change();
			$('#dd_status_search').val('').change();
			$('#dd_client_search').val('').change();
			$('#dd_created_by_search').val('').change();
			$('#txt_email_search').val('');
		}
		else if(form == 'form')
		{
			EMP_ID = '';
			BACKUP_SESSION = '';
			p_status = '';
			pid = "";
			// chat_token = '';
			// chat_user_id = '';

			// var drEvent = $('.dropify').dropify();
			// drEvent = drEvent.data('dropify');
			// drEvent.resetPreview();
			// drEvent.clearElement();
			// drEvent.settings.defaultFile = '';
			// drEvent.destroy();
			// drEvent.init();

			$('#detail-tab a:first').tab('show');
			$('#txt_employee_name').val('');
			$('#txt_nric').val('');
			$('#txt_designation').val('');
			$('#dd_sex').val('0').change();
			$('#txt_email').val('');
			$('#dd_employer').val('').change();
			$('#dd_marital_status').val('0').change();
			$('#dd_contract_type').val('0').change();
			$('#txt_home_phone').val('');
			$('#txt_malaysia_phone').val('');
			$('#txt_home_address').val('');
			$('#txt_address_malaysia').val('');
			$('#dd_home_country').val('0').change();
			$('#dd_nationality').val('0').change();
			$('#txt_race').val('');
			$('#txt_religion').val('');
			$('#txt_office_email').val('');
			$('#txt_office_phone').val('');
			$('#dd_department').val('0').change();
			$('#dd_notice_period').val('0').change();
			$('#dob_date').val('');
			$('#txt_birth_place').val('');
			$('#start_date').val('');
			$('#end_date').val('');
			$('#txt_salary').val('');
			$('#dd_reporting_to').val('0').change();
			$('#leave_date').val('');
			$('#txt_leave_reason').val('');
			$('#chk_is_active').prop('checked', true);
			$.fn.change_switchery($('#chk_is_active'), true);

			$('#txt_ep_applied_date').val('');
			$('#txt_ep_expiry_date').val('');

			$('#dd_general_skills').val('0').change();
			$('#dd_specific_skills').val('0').change();

			$('#txt_spouse_name').val('');
			$('#txt_spouse_occupation').val('');
			$('#marriage_date').val('');
			$('#txt_spouse_ic').val('');
			$('#txt_spouse_company').val('');
			$('#txt_spouse_company_address').val('');
			$('#txt_no_of_children').val(0);
			$('#dd_faq').val('0').change();

			$('#txt_bank_acc_name').val('');
			$('#txt_bank_acc_ic').val('');
			$('#txt_bank_name').val('');
			$('#txt_acc_no').val('');

			$('#txt_emergency_person').val('');
			$('#txt_emergency_relation').val('');
			$('#txt_emergency_address').val('');
			$('#txt_emergency_phone').val('');

			$(`#chk_is_active,#chk_is_admin,#chk_initial_pwd,#chk_enable_portal,#chk_enable_chat
			#chk_enable_email,#chk_is_super_admin,#chk_enable_screen_track,#chk_mail_require_auth,#chk_enable_backup`).attr('checked', 'checked');

			$('#dd_mail_type').val(1).change();
			$('#txt_mail_outserver_name').val('');
			$('#txt_mail_outserver_port').val('');
			$('#txt_mail_inserver_name').val('');
			$('#txt_mail_inserver_port').val('');
			$('#txt_mail_username').val('');
			$('#txt_mail_password').val('');
			$('#txt_mail_from_name').val('');
			$('#chk_mail_require_auth').prop('checked', false);

			$('#txt_username').val('');
			$('#txt_password').val('');

			$('#child_info').hide();
			$('#tbl_child > tbody').empty();

			$('#shift_st_start_time').val('');
			$('#shift_st_end_time').val('');
			
			$('#dd_timezone').val('0').change();

			$.fn.change_switchery($('#chk_is_admin'), false);
			$.fn.change_switchery($('#chk_initial_pwd'), false);
			$.fn.change_switchery($('#chk_enable_portal'), false);
			$.fn.change_switchery($('#chk_enable_chat'), false);
			$.fn.change_switchery($('#chk_enable_email'), false);
			$.fn.change_switchery($('#chk_is_super_admin'), false);
			$.fn.change_switchery($('#chk_enable_screen_track'), false);
			$.fn.change_switchery($('#chk_enable_backup'), false);

			$('#chk_enable_email').next('.switchery').removeClass('disabled');

			$('.user_access').each(function (i, checkbox) 
			{
				$(checkbox).prop('checked', false);
			});

			// $('#tbl_attachment,#tbl_exit').empty();

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

			$('#leave_div').hide();
			$('#div_onboarding_ref').html("");
			$('#div_backup_download').html("");

			$.fn.reset_upload_form();
			CODE_TRIGGERED = false;
		}
		else if (form == 'leave_form')
		{
			$('#leave_type').val('0').change();
			$('#no_of_days').val('');
			$('#brought_forward').val('0');
			$('#applicable_year').val('0').change();
			$('#applicable_to_next_year').prop('checked', false);
			EMP_LEAVE_ID = '';
			$('#btn_leave_save').html('<i class="fa fa-save"></i> Save');

			$('#leave_detail_form').parsley().destroy();
			$('#leave_detail_form').parsley(
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

	}
	catch(err)
	{
		$.fn.log_error(arguments.callee.caller,err.message);
	}
};

$.fn.populate_detail_form = function (data)
{
	try
	{
		data = JSON.parse(data);
		$.fn.show_hide_form('EDIT', true);
		// $.fn.reset_form('his_form');
		$.fn.reset_form('leave_form');
		// $.fn.reset_form('asset_form');
		// $.fn.reset_form('track_form');

		//fetch profile pic
		let get_param = {id: '', module_id: MODULE_ACCESS.module_id, method: "get_files", primary_id: data.id, secondary_id: 13, token: $.jStorage.get('token') };
		$.fn.fetch_data(
			$.fn.generate_parameter('get_files', get_param),
			function(return_data_pp) {
				let profile_img = '';
				if(return_data_pp.data.length > 0) {
					let data = return_data_pp.data[0];
					if(data.thumbnailUrl) {
						profile_img = data.thumbnailUrl;
					}

				}

				var drEvent = $('#img_emp_photo').dropify({
					defaultFile: profile_img
				});
				drEvent = drEvent.data('dropify');
				drEvent.resetPreview();
				drEvent.clearElement();
				drEvent.settings.defaultFile = profile_img;
				drEvent.destroy();
				drEvent.init();
				
			},
			true
		);

		$.fn.fetch_data(
			$.fn.generate_parameter('get_employees_details', { id: data.id }),
			function (return_data)
			{
				if (return_data.data)
				{
					let data = return_data.data[0];
					EMP_ID = data.id;
					p_status = data.p_status;
					// pid = data.pid.replace(/\"/g, "");

					$('#h4_primary_no').text(data.name);
					$('#txt_employee_name').val(data.name);
					$('#txt_email').val(data.email);
					$('#txt_office_email').val(data.office_email);
					$('#dd_department').val(data.dept_id).change();
					$('#dd_reporting_to').val(data.reporting_to_id).change();
					$('#txt_username').val(data.username);
					// $('#txt_password').val(data.pswd);
					if (data.contract_no > 0)
					{
						$('#div_onboarding_ref').html(`<button class="btn btn-success btn-label" value="${data.contract_no}"><i class="fa fa-external-link"></i> ${data.contract_no}</button>`);
					}
					$.fn.change_switchery($('#chk_is_active'), (parseInt(data.is_active) ? true : false));
					$.fn.change_switchery($('#chk_is_admin'), (parseInt(data.is_admin) ? true : false));
					$.fn.change_switchery($('#chk_is_super_admin'), (parseInt(data.super_admin) ? true : false));

					
					let json_field = $.fn.get_json_string(data.json_field);
					if (json_field !== false)
					{
						$('#dob_date').flatpickr().setDate(json_field.dob);
						$('#start_date').flatpickr().setDate(json_field.work_start_date);
						$('#end_date').flatpickr().setDate(json_field.work_end_date);
						$('#txt_nric').val(json_field.nric);
						$('#txt_designation').val(json_field.designation);
						$('#dd_sex').val(json_field.sex).change();
						$('#dd_employer').val(json_field.employer).change();
						$('#dd_marital_status').val(json_field.marital_status).change();
						$('#dd_contract_type').val(json_field.contract_type).change();
						$('#txt_home_phone').val(json_field.home_phone);
						$('#txt_malaysia_phone').val(json_field.malaysia_phone);
						$('#txt_home_address').val(json_field.home_address);
						$('#txt_address_malaysia').val(json_field.local_address);
						$('#dd_home_country').val(json_field.home_country).change();
						$('#dd_nationality').val(json_field.nationality).change();
						$('#txt_race').val(json_field.race);
						$('#txt_religion').val(json_field.religion);
						$('#txt_office_phone').val(json_field.office_phone);
						$('#dd_notice_period').val(json_field.notice_period).change();
						$('#txt_birth_place').val(json_field.birth_place);
						$('#txt_salary').val(json_field.salary);
						$('#leave_date').val(json_field.left_date);
						$('#txt_leave_reason').val(json_field.left_reason);
						$('#txt_ep_applied_date').val(json_field.ep_applied_date);
						$('#txt_ep_expiry_date').val(json_field.ep_expiry_date);
						$('#txt_user_no').val(json_field.user_no);
					// 	chat_token = json_field.chat_token;
					// 	chat_user_id = json_field.chat_user_id;

						json_field.general_skills ? $('#dd_general_skills').val(json_field.general_skills.split(',')).change() : $('#dd_general_skills').val('').change();
						json_field.specific_skills ? $('#dd_specific_skills').val(json_field.specific_skills.split(',')).change() : $('#dd_specific_skills').val('').change();

						if (json_field.marriage)
						{
							$('#txt_spouse_name').val(json_field.marriage.spouse_name);
							$('#txt_spouse_occupation').val(json_field.marriage.spouse_occupation);
							$('#marriage_date').val(json_field.marriage.marriage_date);
							$('#txt_spouse_ic').val(json_field.marriage.spouse_ic);
							$('#txt_spouse_company').val(json_field.marriage.spouse_company);
							$('#txt_spouse_company_address').val(json_field.marriage.spouse_company_address);
							$('#txt_no_of_children').val(json_field.marriage.no_of_children);

							if (json_field.marriage.no_of_children != 0 && json_field.marriage.no_of_children != null && json_field.marriage.no_of_children != '')
							{
								$.fn.add_child_input(json_field.marriage.no_of_children);
								let data_child = json_field.marriage.childs;
								if (data_child)
								{
									for (var i = 0; i < data_child.length; i++)
									{
										$('#txt_child_name_' + i).val(data_child[i].child_name);
										$('#txt_child_ic_' + i).val(data_child[i].child_ic);
										$('#dd_child_sex_' + i).val(data_child[i].child_sex_id).change();
										$('#child_dob_date_' + i).val(data_child[i].child_dob);
									}
								}
							}
						}

						if (json_field.shift) 
						{
							$('#shift_st_start_time').val(json_field.shift.start_time);
							$('#shift_st_end_time').val(json_field.shift.end_time);
							$('#dd_timezone').val(json_field.shift.timezone).change();
						}

						if (json_field.faq_id)
						{
							$('#dd_faq').val(json_field.faq_id.split(',')).change();
						}

						if (json_field.bank)
						{
							$('#txt_bank_acc_name').val(json_field.bank.bank_acc_name);
							$('#txt_bank_acc_ic').val(json_field.bank.bank_acc_ic);
							$('#txt_bank_name').val(json_field.bank.bank_name);
							$('#txt_acc_no').val(json_field.bank.acc_no);
							$('#txt_swift_code').val(json_field.bank.swift_code);
						}

						if (json_field.emergency_contact)
						{
							$('#txt_emergency_person').val(json_field.emergency_contact.emergency_person);
							$('#txt_emergency_relation').val(json_field.emergency_contact.emergency_relation);
							$('#txt_emergency_address').val(json_field.emergency_contact.emergency_address);
							$('#txt_emergency_phone').val(json_field.emergency_contact.emergency_person);
						}

						if (json_field.mail)
						{
							$('#dd_mail_type').val(json_field.mail.type).change();
							$('#txt_mail_outserver_name').val(json_field.mail.outserver_name);
							$('#txt_mail_outserver_port').val(json_field.mail.outserver_port);
							$('#txt_mail_inserver_name').val(json_field.mail.inserver_name);
							$('#txt_mail_inserver_port').val(json_field.mail.inserver_port);
							$('#txt_mail_username').val(json_field.mail.username);
							$('#txt_mail_password').val(json_field.mail.password);
							$('#txt_mail_from_name').val(json_field.mail.from_name);
							$.fn.change_switchery($('#chk_mail_require_auth'), (parseInt(json_field.mail.require_auth) ? true : false));
						}

						if (json_field.permission)
						{
							$.fn.change_switchery($('#chk_initial_pwd'), (parseInt(json_field.permission.initial_pwd) ? true : false));
							$.fn.change_switchery($('#chk_enable_portal'), (parseInt(json_field.permission.enable_portal) ? true : false));
							$.fn.change_switchery($('#chk_enable_chat'), (parseInt(json_field.permission.enable_chat) ? true : false));
							$.fn.change_switchery($('#chk_enable_email'), (parseInt(json_field.permission.enable_email) ? true : false));
							$.fn.change_switchery($('#chk_enable_backup'), (parseInt(json_field.permission.enable_backup) ? true : false));
						}

					// 	if (json_field.screen_track)
					// 	{
					// 		$.fn.change_switchery($('#chk_enable_screen_track'), (parseInt(json_field.screen_track.screenshot_enable) ? true : false));
					// 		$('#txt_interval').val(json_field.screen_track.screenshot_interval);
					// 		$('#st_start_date').val(json_field.screen_track.screenshot_start_date ? moment(json_field.screen_track.screenshot_start_date).format(UI_DATE_FORMAT) : '');
					// 		$('#st_end_date').val(json_field.screen_track.screenshot_end_date ? moment(json_field.screen_track.screenshot_end_date).format(UI_DATE_FORMAT) : '');
					// 		$('#st_start_time').val(json_field.screen_track.screenshot_start_time);
					// 		$('#st_end_time').val(json_field.screen_track.screenshot_end_time);
					// 		for (i = 0; i <= 6; i++)
					// 		{
					// 			$('#chk_enable_day_' + i).prop('checked', json_field.screen_track.screenshot_enable_days[i]);
					// 		}
					// 		$('#chk_exclude_ph').prop('checked', json_field.screen_track.screenshot_exclude_ph);
					// 		$('#chk_exclude_leaves').prop('checked', json_field.screen_track.screenshot_exclude_leaves);
					// 	}

					// 	if (json_field.backup)
					// 	{
					// 		BACKUP_SESSION = json_field.backup
					// 		$.fn.get_backup_link();
					// 	}

						if (data.is_active == 1)
						{
							$('#leave_div').hide();
						}
						else
						{
							$('#leave_div').show();
						}
					// 	$.fn.populate_history_list_form(return_data.data.work_list, true);
					// 	$.fn.populate_leave_list_form(return_data.data.leave_list, true);
					// 	$.fn.populate_asset_list_form(return_data.data.asset_list, true);
					// 	$.fn.populate_attachment_list_form(return_data.data.documents, 1);
					// 	$.fn.populate_attachment_list_form(return_data.data.exit_checklist, 2);
						$.fn.set_user_access(json_field.access);
						$.fn.check_office_email();
						CODE_TRIGGERED = false;
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


$.fn.get_list = function(is_scroll)
{
	try
	{
		var data	= 
		{
			name : $('#txt_name_search').val(),
			status_id: $('#dd_status_search').val(),
			client_id: $('#dd_client_search').val(),
			email: $('#txt_email_search').val(),
			start_index	: RECORD_INDEX,
			limit: LIST_PAGE_LIMIT,
			is_admin: SESSIONS_DATA.is_admin,
			created_by: $('#dd_created_by_search').val(),
			emp_id: SESSIONS_DATA.emp_id,
			cust_id: SESSIONS_DATA.cust_id
	 	};
	 	if(is_scroll)
	 	{
	 		data.start_index =  RECORD_INDEX;
	 	}
	 										
	 	$.fn.fetch_data
		(
			$.fn.generate_parameter('get_employee_list',data),	
			function(return_data)
			{
				if(return_data)
				{	
					// console.log(return_data);
					// if(return_data.data.rec_index)
					// {
					// 	RECORD_INDEX = return_data.data.rec_index;
					// }
					// $.fn.data_table_destroy();
					// $.fn.populate_list_form(return_data.data.list, is_scroll);
					// $.fn.data_table_features();

					if (return_data.data.list)
					{
						var len = return_data.data.list.length;
						if (return_data.data.rec_index)
						{
							RECORD_INDEX = return_data.data.rec_index;
						}
						if (return_data.code == 0 && len != 0)
						{
							$.fn.data_table_destroy();
							$.fn.populate_list_form(return_data.data.list, is_scroll);
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
			},true
		);
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
		if (data) // check if there is any data, precaution 
		{
			if(is_scroll == false)
			{
				$('#tbl_list > tbody').empty();
			}
			
			var row			= '';
			var data_val 	= '';
			for(var i = 0; i < data.length; i++)
			{
				data_val = escape(JSON.stringify(data[i])); //.replace(/'/,"");
				// console.log(data_val);				
				photo_content = '<a href="../../services/files/cutter_image/' + data[i].cutter_image_path  + '" target=_blank><img src="../../services/files/cutter_image/' + data[i].cutter_image_path  + '" width="100" /></a>';
				photo_content = '';
				
				row += `<tr>
							<td>${data[i].name}</td> 
							<td>${data[i].designation}</td> 
							<td>${data[i].office_email}</td> 
							<td>${data[i].malaysia_phone}</td>  
							<td>${
								(() => {
									if(data[i].status == "ACTIVE") {
										return `<span class="badge badge-soft-success">Active</span>`;

									} else {
										return `<span class="badge badge-soft-danger">InActive</span>`;

									}

								})()

							}</td> 
							
							<td>${data[i].created_by}</td>
							<td><a href="javascript:void(0);" data-value="${data_val}" data-trigger="hover" data-original-title="Edit data " onclick="$.fn.populate_detail_form(unescape('${data_val}'))" class="action-icon"> <i class="mdi mdi-square-edit-outline"></i></a></td>
						</tr>`;	
							
			}
			$('#tbl_list tbody').append(row);
			$('.back-to-top-badge').removeClass('back-to-top-badge-visible');
		}

	}
	catch(err)
	{
		$.fn.log_error(arguments.callee.caller,err.message);
	}
};

$.fn.get_cutter_config = function()
{
    try
    {   
        $.fn.fetch_data
        (
            $.fn.generate_parameter('get_cutter_config', {}),
            function(return_data)
            {	
				// console.log(return_data);
				if (return_data.code == 0)
                {   
                    $.fn.populate_dd('dd_cutter_category_search', return_data.data.cutter_category, true);
					$.fn.populate_dd('dd_cutter_category', return_data.data.cutter_category);
                }
            },true
        );
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
		$('#list_div, #btn_new').hide(400);
		// $('#new_div, #btn_back').show(400);
		$('#new_div').show(400);

		var drEvent = $('.dropify').dropify();
		drEvent = drEvent.data('dropify');
		drEvent.resetPreview();
		drEvent.clearElement();
		drEvent.settings.defaultFile = '';
		drEvent.destroy();
		drEvent.init();

		$('#h4_primary_no').text('NEW');
		// $('#tab_assets,#tab_leaves,#tab_wh,#tab_attach,#tab_exit,#tab_track,#permission-tab').hide();
		$('#permission-tab, #tab_leaves').hide();
		$('#btn_save').html('<i class="fa fa-check"> </i> Save');
	}
	else if (form_status == 'EDIT')
	{
		$('#list_div, #btn_new').hide(400);
		$('#new_div').show(400);
		// $('#tab_assets,#tab_leaves,#tab_wh,#tab_attach,#tab_exit,#tab_track,#permission-tab').show();
		$('#permission-tab,#tab_leaves').show();
		$('#btn_save').html('<i class="fa fa-edit"></i> Update');
	}
	else if (form_status == 'BACK')
	{
		$('#list_div').show(400);
		if(MODULE_ACCESS.create == 1) {
			$('#btn_new').show(400);
		}
		$('#new_div').hide(400);
	}
};

$.fn.get_initial_data = function ()
{
	try
	{
		let data =
		{
			emp_id: SESSIONS_DATA.emp_id,
			// view_all: 0
			view_all: MODULE_ACCESS.viewall
		};

		$.fn.fetch_data
			(
				$.fn.generate_parameter('get_user_initial_data', data),
				function (return_data)
				{
					if (return_data.data)
					{
						console.log(return_data.data);
						$.fn.populate_dd('dd_home_country', return_data.data.countries);
						$.fn.populate_dd('dd_nationality', return_data.data.countries);
						$.fn.populate_dd('applicable_year', return_data.data.years);
						$.fn.populate_dd('dd_created_by_search', return_data.data.created_by, false);
						$.fn.populate_dd('dd_department', return_data.data.dept);
						// $.fn.populate_dd('his_dd_dept', return_data.data.dept);
						$.fn.populate_dd('dd_sex', return_data.data.sex);
						$.fn.populate_dd('dd_notice_period', return_data.data.notice_period);
						$.fn.populate_dd('leave_type', return_data.data.leave_type);
						$.fn.populate_dd('dd_employer', return_data.data.employer);
						// $.fn.populate_dd('his_dd_client', return_data.data.client);
						$.fn.populate_dd('dd_client_search', return_data.data.client, false);
						$.fn.populate_dd('dd_reporting_to', return_data.data.reporting_to);
						$.fn.populate_dd('dd_general_skills', return_data.data.skills_general, true, false, false);
						$.fn.populate_dd('dd_specific_skills', return_data.data.skills_specific, true, false, false);
						$.fn.populate_dd('dd_contract_type', return_data.data.employment_type);
						$.fn.populate_dd('dd_marital_status', return_data.data.marital_status);
						$.fn.populate_dd('dd_faq', return_data.data.faq);
						// $.fn.populate_dd('dd_attach_category', return_data.data.doc_ctg);
						// $.fn.populate_dd('dd_exit_category', return_data.data.exit_ctg);
						$.fn.populate_dd('dd_timezone', return_data.data.timezone);
					}
				}, true
			);
	}
	catch (err)
	{
		$.fn.log_error(arguments.callee.caller, err.message);
	}
};

$.fn.navigate_form = function (emp_id)
{
	try
	{
		$.fn.populate_detail_form(JSON.stringify({ id: emp_id }));
	}
	catch (e)
	{
		$.fn.log_error(arguments.callee.caller, e.message);
	}
}

// File Upload
$.fn.init_attach_file = function ()
{
	$.fn.reset_upload_form();

	$('.fileupload').fileupload({
		url: upload_file_path,
		dataType: 'json',
		autoUpload: false,
		acceptFileTypes: /^image\/(jpe?g|png)$/i,
		maxFileSize: undefined,
		disableImageResize: /Android(?!.*Chrome)|Opera/.test(window.navigator.userAgent),
		previewMaxWidth: 80,
		previewMaxHeight: 80,
		previewCrop: true,
	});

	$('.fileupload').bind('fileuploadsubmit', function (e, data)
	{
		let p = JSON.parse($.fn.generate_parameter('add_files'));
		data.formData =
		{
			...p, //concat add files fields with the below fields
			upload_path: '../files/81/' + EMP_ID + '/', //upload dir
			// file_name: EMP_ID + '.jpeg',
			url: services_URL, 
			overwrite: true,
			qquuid: '',
			id: '',
			primary_id: EMP_ID,
			secondary_id: 13,
			module_id : 81,
			emp_id : $.jStorage.get('session_data').emp_id //current user id

		};
	});

	$('.fileupload').bind('fileuploadadd', function (e, data)
	{
		var $files = $('#files');
		$.each(data.files, function (index, file)
		{
			var reader = new FileReader();
			reader.onload = function (e)
			{
				$('#img_emp_photo').attr('src', e.target.result);
			};
			reader.readAsDataURL(file);
			$files.data(data);
		});
	});
};

$.fn.upload_photo_file = function (attachment_data, callback)
{
	var data = $('#files').data();
	
	if (data.submit)
	{
		//update old profile pic record - delete / make it inactive
		let get_param = {id: '', module_id: MODULE_ACCESS.module_id, method: "get_files", primary_id: EMP_ID, secondary_id: 13, token: $.jStorage.get('token') };
		$.fn.fetch_data(
			$.fn.generate_parameter('get_files', get_param),
			function(return_data_pp) {
				let data = return_data_pp.data;
				if(data.length > 0) {
					for(let i=0; i<data.length; i++) {
						let deleteParam = $.fn.get_json_string(data[i].deleteFileParams);
						deleteParam = {
							...deleteParam,
							emp_id : SESSIONS_DATA.emp_id
						}
						$.fn.write_data(
							$.fn.generate_parameter('delete_files', deleteParam),
							function(return_data_dl) {
							},
							true
						);
					}
				}
			},
			true
		);

		//upload pic and update files datatable
		data.submit();

		if(attachment_data) {
			attachment_data.filename = data.files[0].name.trim();
			attachment_data.filesize = data.files[0].size;
			$.fn.write_data(
				$.fn.generate_parameter('add_files', attachment_data), 
				function(return_data) {
					// console.log(return_data);
					// if(return_data.code == 0) {
					// 	total_succeed++;
					// 	total_completed++;
					// 	if(return_data.data) {
					// 		attachment.push(return_data.data[0]);
					// 	}
						
					// }
					// let attachment_data_f = [];
					// attachment_data_f.attachment = attachment;
					// if (typeof call_back === "function") {
					// 	if (progress_btn) { progress_btn.stop(); }
					// 	call_back(total_files, total_succeed, data.files[0].name.trim(), attachment_data_f);
					// 	return;
					// }
				}, false, false, true
			);
		}
		// data.submit().success(function (response)
		// {
		// 	if (callback) callback(response.files[0].name);
		// });
		// data.submit(function (response) {
		// 	console.log(response);
		// });
		// console.log(data.submit());
	}
};

$.fn.reset_upload_form = function ()
{
	$('#files').html('');
};
// File upload

// Permission Tab
$.fn.get_modules_list = function() {
	
	try
	{
		let data =
		{
			emp_id: SESSIONS_DATA.emp_id,
			// view_all: 0
			view_all: MODULE_ACCESS.viewall
		};

		$.fn.fetch_data
			(
				$.fn.generate_parameter('get_modules', data),
				function (return_data)
				{
					if (return_data.data)
					{
						let modules = return_data.data.modules;
						let row	 = '';

						for(let i=0; i < modules.length; i++) {
							let sub_modules = $.fn.get_json_string(modules[i].json_field);
							let colspan = 0;
							
							if(sub_modules && sub_modules.length > 0) {
								colspan    = 9;
								if($.fn.is_super_admin()) {
									colspan    = 8;
								}
							}

							row += `<tr id="${modules[i].id}" data-val="${modules[i].descr}">
										<td colspan="${colspan}">${
											(() => {
												if(!sub_modules) {
													return `<input type="checkbox" class="user_access" onclick="$.fn.set_check_all_module($(this).attr('data-val'),$(this).is(':checked'),${modules[i].id})" data-val="${modules[i].id}" id="all_${modules[i].id}" name="all_${modules[i].id}">`
												}else {
													return ``
												}
											})()
										}
										${modules[i].descr}
										</td>
										${
											(() => {
												if(!sub_modules) {
													return `
													<td><input type="checkbox" class="user_access" data-val="${modules[i].id}" id="view_${modules[i].id}" name="view_${modules[i].id}"></td>

													<td><input type="checkbox" class="user_access" data-val="${modules[i].id}" id="viewall_${modules[i].id}" name="viewall_${modules[i].id}"></td>

													<td><input type="checkbox" class="user_access" data-val="${modules[i].id}" id="create_${modules[i].id}" name="create_${modules[i].id}"></td>
													
													<td><input type="checkbox" class="user_access" data-val="${modules[i].id}" id="edit_${modules[i].id}" name="edit_${modules[i].id}"></td>

													<td><input type="checkbox" class="user_access" data-val="${modules[i].id}" id="delete_${modules[i].id}" name="delete_${modules[i].id}"></td>

													<td><input type="checkbox" class="user_access" data-val="${modules[i].id}" id="verify_${modules[i].id}" name="verify_${modules[i].id}"></td>

													<td><input type="checkbox" class="user_access" data-val="${modules[i].id}" id="approve_${modules[i].id}" name="approve_${modules[i].id}"></td>

													<td><input type="checkbox" class="user_access" data-val="${modules[i].id}" id="print_${modules[i].id}" name="print_${modules[i].id}"></td>
													`
												}else {
													return ``
												}
											})()
										}
										
									</tr>
									${
										(() => {
											let sub_row = '';
											if(sub_modules) {
												for(let j=0; j < sub_modules.length; j++) {
													if(sub_modules[j].is_active == 1) {
														sub_row += `
														<tr id="${sub_modules[j].id}" data-val="${sub_modules[j].descr}">
															<td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
																<input type="checkbox" class="user_access" onclick="$.fn.set_check_all_module($(this).attr('data-val'),$(this).is(':checked'),${sub_modules[j].id})" data-val="${sub_modules[j].id}" id="all_${sub_modules[j].id}" name="all_${sub_modules[j].id}">
																${sub_modules[j].descr}
															</td>
															<td><input type="checkbox" class="user_access" data-val="${sub_modules[j].id}" id="view_${sub_modules[j].id}" name="view_${sub_modules[j].id}"></td>
																
															<td><input type="checkbox" class="user_access" data-val="${sub_modules[j].id}" id="viewall_${sub_modules[j].id}" name="viewall_${sub_modules[j].id}"></td>
																
															<td><input type="checkbox" class="user_access" data-val="${sub_modules[j].id}" id="create_${sub_modules[j].id}" name="create_${sub_modules[j].id}"></td>
															<td><input type="checkbox" class="user_access" data-val="${sub_modules[j].id}" id="edit_${sub_modules[j].id}" name="edit_${sub_modules[j].id}"></td>
															<td><input type="checkbox" class="user_access" data-val="${sub_modules[j].id}" id="delete_${sub_modules[j].id}" name="delete_${sub_modules[j].id}"></td>
															<td><input type="checkbox" class="user_access" data-val="${sub_modules[j].id}" id="verify_${sub_modules[j].id}" name="verify_${sub_modules[j].id}"></td>
															<td><input type="checkbox" class="user_access" data-val="${sub_modules[j].id}" id="approve_${sub_modules[j].id}" name="approve_${sub_modules[j].id}"></td>
															<td><input type="checkbox" class="user_access" data-val="${sub_modules[j].id}" id="print_${sub_modules[j].id}" name="print_${sub_modules[j].id}"></td>
														</tr>
														`
													}else {
														continue;
													}
												}
											}else {
												return ``
											}
											return sub_row;
										})()
										
									}
									`;	

							

						}
						$('#tbl_access tbody').append(row);
					}
				}, true
			);
	}
	catch (err)
	{
		$.fn.log_error(arguments.callee.caller, err.message);
	}
}

$.fn.set_user_access = function (data)
{
	try
	{
		$('.user_access').each(function (i, checkbox) 
		{
			$(checkbox).prop('checked', false);
		});

		if (data != 0 && data != null && data != '')
		{
			for (i = 0; i < data.length; i++)
			{
				$('#tbl_access tr').each(function (x, row) 
				{
					$(this).find('td input:checkbox').each(function (y, checkbox)
					{
						if ($(checkbox).attr('data-val') == data[i].module_id)
						{
							if ($(checkbox).attr('id') == 'create_' + data[i].module_id)
							{
								$(checkbox).prop('checked', data[i].create == 1 ? true : false);
							}
							else if ($(checkbox).attr('id') == 'edit_' + data[i].module_id)
							{
								$(checkbox).prop('checked', data[i].edit == 1 ? true : false);
							}
							else if ($(checkbox).attr('id') == 'delete_' + data[i].module_id)
							{
								$(checkbox).prop('checked', data[i].delete == 1 ? true : false);
							}
							else if ($(checkbox).attr('id') == 'verify_' + data[i].module_id)
							{
								$(checkbox).prop('checked', data[i].verify == 1 ? true : false);
							}
							else if ($(checkbox).attr('id') == 'approve_' + data[i].module_id)
							{
								$(checkbox).prop('checked', data[i].approve == 1 ? true : false);
							}
							else if ($(checkbox).attr('id') == 'view_' + data[i].module_id)
							{
								$(checkbox).prop('checked', data[i].view == 1 ? true : false);
							}
							else if ($(checkbox).attr('id') == 'viewall_' + data[i].module_id)
							{
								$(checkbox).prop('checked', data[i].viewall ? true : false);
							}
							else if ($(checkbox).attr('id') == 'print_' + data[i].module_id)
							{
								$(checkbox).prop('checked', data[i].print ? true : false);
							}
						}
					});

				});
			}
		}
	}
	catch (err)
	{
		//		console.log(err.message);
		$.fn.log_error(arguments.callee.caller, err.message);
	}
}

$.fn.get_user_access = function ()
{
	try
	{
		let data = [];
		$('#tbl_access tbody tr').each(function (x, row) 
		{
			let rows = {};
			$(this).find('td input:checkbox').each(function (y, checkbox)
			{
				let check = $(checkbox).attr('id').split("_")[0];
				if (check != "all")
				{
					rows[check] = ($(checkbox).prop('checked') ? 1 : 0);
				}
			});
			rows['module_id'] = $(this).attr('id');
			rows['module_name'] = $(this).attr('data-val');
			data.push(rows);
		});
		return data;
	}
	catch (err)
	{
		$.fn.log_error(arguments.callee.caller, err.message);
	}
}

$.fn.set_check_all_access = function (check_type, status)
{
	try
	{
		$('#tbl_access tbody tr').each(function (x, row) 
		{
			$(this).find('td input:checkbox').each(function (y, checkbox)
			{
				let check = $(checkbox).attr('id').split("_")[0];
				if (check == check_type)
				{
					$(this).prop('checked', status)
				}
			});
		});
	}
	catch (err)
	{
		$.fn.log_error(arguments.callee.caller, err.message);
	}
}

$.fn.set_check_all_module = function (check_type, status, module_id)
{
	try
	{
		$("#" + module_id).each(function (x, row) 
		{

			$(this).find('td input:checkbox').each(function (y, checkbox)
			{
				let check = $(checkbox).attr('id').split("_")[1];
				if (check == check_type)
				{
					$(this).prop('checked', status)
				}
			});
		});
	}
	catch (err)
	{
		$.fn.log_error(arguments.callee.caller, err.message);
	}
}

$.fn.is_email_exist = function ()
{
	try
	{
		if ($('#txt_username').val() == "")
		{
			$.fn.show_right_error_noty("Please provide username");
			$.fn.change_switchery($('#chk_enable_email'), false);
			CODE_TRIGGERED = false;
			return;
		}
		if (pid == "")
		{
			$.fn.show_right_error_noty("Please provide password");
			$.fn.change_switchery($('#chk_enable_email'), false);
			CODE_TRIGGERED = false;
			return;
		}

		let email = $('#txt_username').val().split('@')[0];
		$.fn.write_data
			(
				$.fn.generate_parameter('is_control_panel_email_exist', { email: email }),
				function (return_data)
				{
					if (return_data.data == false)
					{
						bootbox.confirm
							({
								title: "Create email confirmation",
								message: "The email address does not exist, do you want to create it?",
								buttons:
								{
									cancel:
									{
										label: '<i class="fa fa-times"></i> Cancel'
									},
									confirm:
									{
										label: '<i class="fa fa-check"></i> Create'
									}
								},
								callback: function (result)
								{
									if (result == true)
									{
										$.fn.create_new_email(email);
									}
									else
									{
										$.fn.change_switchery($('#chk_enable_email'), false);
										CODE_TRIGGERED = false;
									}
								}
							});
					}
				}, false, false, false
			);
	}
	catch (err)
	{
		$.fn.log_error(arguments.callee.caller, err.message);
	}
};

$.fn.create_new_email = function (email)
{
	try
	{

		var data =
		{
			email: email,
			password: pid,
			p_status: p_status,
			quota: 1024,
			emp_id: SESSIONS_DATA.emp_id
		};

		$.fn.write_data
			(
				$.fn.generate_parameter('get_control_panel_add_email', data),
				function (return_data)
				{
					if (return_data.data.result == 1)
					{
						$.fn.show_right_success_noty('Email has been created successfully');
						bootbox.confirm
							({
								title: "Send email notification",
								message: `Email has been created, do you want to notify the person at ${$('#txt_email').val()}?`,
								buttons:
								{
									cancel:
									{
										label: '<i class="fa fa-times"></i> Cancel'
									},
									confirm:
									{
										label: '<i class="fa fa-check"></i> Send'
									}
								},
								callback: function (result)
								{
									if (result == true)
									{
										data.notify_email = $('#txt_email').val();
										data.email = $('#txt_office_email').val();

										$.fn.write_data
											(
												$.fn.generate_parameter('send_email_add_notification', data),
												function (return_data)
												{
													if (return_data.data)
													{
														$.fn.show_right_success_noty("Notification has been sent");
														$('#txt_mail_username').val($('#txt_office_email').val());
													}
												}, true, false, true
											);

									}
								}
							});
					}
				}, true, false, true
			);
	}
	catch (err)
	{
		$.fn.log_error(arguments.callee.caller, err.message);
	}
};

$.fn.check_office_email = function ()
{
	try
	{
		let domain = SESSIONS_DATA.CPANEL_DOMAIN;
		let username = $('#txt_username').val();

		if (username.indexOf(domain) >= 0)
		{
			$('#chk_enable_email').next('.switchery').removeClass('disabled');
			CODE_TRIGGERED = false;
		}
		else
		{
			$.fn.change_switchery($('#chk_enable_email'), false);
			$('#chk_enable_email').next('.switchery').addClass('disabled');
			CODE_TRIGGERED = false;
		}
	}
	catch (err)
	{
		$.fn.log_error(arguments.callee.caller, err.message);
	}
};

$.fn.is_chat_exist = function ()
{
	try
	{
		if ($('#txt_username').val() == "")
		{
			$.fn.show_right_error_noty("Please provide username");
			$.fn.change_switchery($('#chk_enable_chat'), false);
			CODE_TRIGGERED = false;
			return;
		}
		if (pid == "")
		{
			$.fn.show_right_error_noty("Please provide password");
			$.fn.change_switchery($('#chk_enable_chat'), false);
			CODE_TRIGGERED = false;
			return;
		}

		let username = $('#txt_username').val().replace("@", "_");
		$.fn.write_data
			(
				$.fn.generate_parameter('chat_get_user_status', { username: username }),
				function (return_data)
				{
					if (return_data.data.success == false)
					{
						bootbox.confirm
							({
								title: "Create chat confirmation",
								message: "The chat login does not exist, do you want to create it?",
								buttons:
								{
									cancel:
									{
										label: '<i class="fa fa-times"></i> Cancel'
									},
									confirm:
									{
										label: '<i class="fa fa-check"></i> Create'
									}
								},
								callback: function (result)
								{
									if (result == true)
									{
										$.fn.create_new_chat();
									}
									else
									{
										$.fn.change_switchery($('#chk_enable_chat'), false);
										CODE_TRIGGERED = false;
									}
								}
							});
					}
					else
					{
						chat_user_id = return_data.data._id;
						$.fn.save_edit_form();
					}
				}, false, false, false
			);
	}
	catch (err)
	{
		$.fn.log_error(arguments.callee.caller, err.message);
	}
};

$.fn.email_credentials = function ()
{
	try
	{
		if ($('#txt_email').val() == "")
		{
			$.fn.show_right_error_noty("Please provide email address");
			return;
		}

		if ($('#txt_username').val() == "")
		{
			$.fn.show_right_error_noty("Please provide username");
			return;
		}

		if (pid == "")
		{
			$.fn.show_right_error_noty("Please provide password");
			return;
		}

		let data =
		{
			email: $('#txt_username').val(),
			password: pid,
			notify_email: $('#txt_email').val(),
			quota: 1024,
			p_status: p_status,
			emp_id: SESSIONS_DATA.emp_id
		};

		$.fn.write_data
			(
				$.fn.generate_parameter('send_email_add_notification', data),
				function (return_data)
				{
					if (return_data.data)
					{
						$.fn.show_right_success_noty("Email has been sent");
					}
				}, true, false, true
			);

	}
	catch (err)
	{
		$.fn.log_error(arguments.callee.caller, err.message);
	}
};

$.fn.is_backup_exist = function ()
{
	try
	{
		if ($('#txt_username').val() == "")
		{
			$.fn.show_right_error_noty("Please provide username");
			$.fn.change_switchery($('#chk_enable_backup'), false);
			CODE_TRIGGERED = false;
			return;
		}

		if (BACKUP_SESSION == '')
		{
			bootbox.confirm
				({
					title: "Create backup confirmation",
					message: "The backup does not exist, do you want to create it?",
					buttons:
					{
						cancel:
						{
							label: '<i class="fa fa-times"></i> Cancel'
						},
						confirm:
						{
							label: '<i class="fa fa-check"></i> Create'
						}
					},
					callback: function (result)
					{
						if (result == true)
						{
							$.fn.write_data
								(
									$.fn.generate_parameter('urbackup_add_client', { clientname: $('#txt_username').val(), emp_id: SESSIONS_DATA.emp_id }),
									function (return_data)
									{
										if (return_data.data)
										{
											BACKUP_SESSION = return_data.data;
											$.fn.get_backup_link(BACKUP_SESSION);
											$.fn.save_edit_form();
										}

									}, false, false, false
								);
						}
						else
						{
							if (BACKUP_SESSION != '')
							{
								bootbox.confirm
									({
										title: "Delete backup confirmation",
										message: "are you sure you want to delete the backup?",
										buttons:
										{
											cancel:
											{
												label: '<i class="fa fa-times"></i> Cancel'
											},
											confirm:
											{
												label: '<i class="fa fa-check"></i> Create'
											}
										},
										callback: function (result)
										{
											if (result == true)
											{
												$.fn.write_data
													(
														$.fn.generate_parameter('urbackup_status', { remove_client_id: BACKUP_SESSION.new_clientid, stop_remove_client: true, emp_id: SESSIONS_DATA.emp_id }),
														function (return_data)
														{
															$('#div_backup_download').html("");
															$.fn.change_switchery($('#chk_enable_backup'), false);
															CODE_TRIGGERED = false;
														}, false, false, false
													);
											}
											else
											{

												$.fn.change_switchery($('#chk_enable_backup'), false);
												CODE_TRIGGERED = false;
											}
										}
									});
							}
							else
							{
								$.fn.change_switchery($('#chk_enable_backup'), false);
								CODE_TRIGGERED = false;
							}
						}
					}
				});

		}
		else
		{
			$.fn.write_data
				(
					$.fn.generate_parameter('urbackup_status', { remove_client_id: BACKUP_SESSION.new_clientid, stop_remove_client: true, emp_id: SESSIONS_DATA.emp_id }),
					function (return_data)
					{
						$('#div_backup_download').html(`<a href="#" onclick="javascript: downloadClient(23, 'e8OeWrHuKM', 'windows')">Download preconfigured client installer for Windows</a>`);
					}, false, false, false
				);
		}
	}
	catch (err)
	{
		$.fn.log_error(arguments.callee.caller, err.message);
	}
};

$.fn.generateP = function ()
{
	var pass = '';
	var str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
		'abcdefghijklmnopqrstuvwxyz0123456789@#$';

	for (i = 1; i <= 15; i++)
	{
		var char = Math.floor(Math.random()
			* str.length + 1);

		pass += str.charAt(char)
	}
	pid = pass;
	return pass;
}
// Permission Tab

// Leave Tab
$.fn.get_leave_list = function (id)
{

	var data_leave =
	{
		start_index: 0,
		limit: LIST_PAGE_LIMIT,
		emp_id: id
	};

	$.fn.fetch_data
		(
			$.fn.generate_parameter('get_employee_leave_list', data_leave),
			function (return_data)
			{
				if (return_data)
				{
					$.fn.populate_leave_list_form(return_data.data.list, true);
				}
			}, true
		);

};

$.fn.populate_leave_list_form = function (data, is_scroll)
{
	try
	{
		if (data) // check if there is any data, precaution
		{
			if (is_scroll == false)
			{
				$('#tbl_leave > tbody').empty();
			}

			var row = '';
			var data_val = '';
			for (var i = 0; i < data.length; i++)
			{
				data_val = escape(JSON.stringify(data[i])); //.replace(/'/,"");
				row += '<tr>' +
					'<td><a class="tooltips" href="javascript:void(0)" data-value=\'' + data_val + '\' onclick="$.fn.delete_leave(unescape($(this).attr(\'data-value\')))" data-trigger="hover" data-original-title="Delete data "><i class="fa fa-trash-o"/></a></td>' +
					'<td>' + data[i].name + '</td>' +
					'<td>' + data[i].leave_type + '</td>' +
					'<td>' + data[i].no_of_days + '</td>' +
					'<td>' + data[i].brought_forward + '</td>' +
					'<td>' + data[i].applicable_year + '</td>' +
					'<td>' + data[i].created_by + '</td>' +
					'</tr>';

			}
			$('#tbl_leave tbody').html(row);
			$('.back-to-top-badge').removeClass('back-to-top-badge-visible');
		}
		else
		{
			$('#tbl_leave tbody').html('');
		}
	}
	catch (err)
	{
		$.fn.log_error(arguments.callee.caller, err.message);
	}
};

$.fn.leave_save_edit_form = function ()
{
	try
	{
		if($('#leave_detail_form').parsley().validate() == false)
		{	
			btn_leave_save.stop();
			return;
		}

		var data =
		{
			id: EMP_LEAVE_ID,
			emp_id: EMP_ID,
			leave_id: $('#leave_type').val(),
			no_of_days: $('#no_of_days').val(),
			brought_forward: $('#brought_forward').val(),
			applicable_year: $('#applicable_year').val(),
			applicable_to_next_year: $('#applicable_to_next_year').is(':checked') ? 1 : 0,
			emp_session_id: SESSIONS_DATA.emp_id
		};
		
		$.fn.write_data
			(
				$.fn.generate_parameter('add_edit_employees_leave', data),
				function (return_data)
				{
					if (return_data.data)
					{
						$.fn.get_leave_list(data.emp_id);
						$.fn.reset_form('leave_form');
						$.fn.show_right_success_noty('Data has been recorded successfully');
					}

				}, false, btn_leave_save
			);
	}
	catch (err)
	{
		$.fn.log_error(arguments.callee.caller, err.message);
	}
};

$.fn.delete_leave = function (data)
{
	try
	{
		data = JSON.parse(data);
		if (data.id == '')
		{
			$.fn.show_right_error_noty('Leave ID cannot be empty');
			return;
		}

		var data =
		{
			id: data.id,
			emp_id: data.emp_id,
			emp_session_id: SESSIONS_DATA.emp_id
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
								$.fn.generate_parameter('delete_leave', data),
								function (return_data)
								{
									if (return_data)
									{
										$('#tbl_leave > tbody').empty();
										$.fn.populate_leave_list_form(return_data.data.list, false);
										$.fn.show_right_success_noty('Data has been deleted successfully');
									}

								}, false, btn_save
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
// Leave Tab

$.fn.send_test_email = function ()
{
	try
	{
		var data =
		{
			mail_type: $('#dd_mail_type').val(),
			outserver_name: $('#txt_mail_outserver_name').val(),
			outserver_port: $('#txt_mail_outserver_port').val(),
			username: $('#txt_mail_username').val(),
			password: $('#txt_mail_password').val(),
			from_name: $('#txt_mail_from_name').val(),
			require_auth: $('#chk_mail_require_auth').is(':checked') ? 1 : 0,
			emp_id: SESSIONS_DATA.emp_id
		}
		
		$.fn.write_data
			(
				$.fn.generate_parameter('send_emp_test_email', data),
				function (return_data)
				{
					if (return_data.data)
					{
						$.fn.show_right_success_noty('Email sent successfully');
					}

				}, false, btn_test_email
			);
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
		if($('#detail_form').parsley().validate() == false)
		{	
			btn_save.stop();
			return;
		}
						
		var form_data = {
			id: EMP_ID,
			name: $('#txt_employee_name').val(),
			email: $('#txt_email').val(),
			office_email: $('#txt_office_email').val(),
			dept_id: $('#dd_department').val(),
			reporting_to_id: $('#dd_reporting_to').val(),
			username: $('#txt_username').val(),
			pswd: '',
			is_active: $('#chk_is_active').is(':checked') ? 1 : 0,
			emp_id: SESSIONS_DATA.emp_id,
			is_admin: $('#chk_is_admin').is(':checked') ? 1 : 0,
			is_super_admin: $('#chk_is_super_admin').is(':checked') ? 1 : 0,
			is_this_super_admin: SESSIONS_DATA.super_admin,
			p_status: p_status,
			json_field:
			{
				work_start_date: $('#start_date').val(),
				work_end_date: $('#end_date').val(),
				dob: $('#dob_date').val(),
				nric: $('#txt_nric').val(),
				designation: $('#txt_designation').val(),
				sex: $('#dd_sex').val(),
				employer: $('#dd_employer').val(),
				marital_status: $('#dd_marital_status').val(),
				contract_type: $('#dd_contract_type').val(),
				home_phone: $('#txt_home_phone').val(),
				malaysia_phone: $('#txt_malaysia_phone').val(),
				home_address: $('#txt_home_address').val(),
				local_address: $('#txt_address_malaysia').val(),
				home_country: $('#dd_home_country').val(),
				nationality: $('#dd_nationality').val(),
				race: $('#txt_race').val(),
				religion: $('#txt_religion').val(),
				office_phone: $('#txt_office_phone').val(),
				notice_period: $('#dd_notice_period').val(),
				birth_place: $('#txt_birth_place').val(),
				salary: $('#txt_salary').val(),
				ep_applied_date: $('#txt_ep_applied_date').val(),
				ep_expiry_date: $('#txt_ep_expiry_date').val(),
				user_no: $('#txt_user_no').val(),
				faq_id: $('#dd_faq').val() ? $('#dd_faq').val().toString() : '',
				general_skills: $('#dd_general_skills').val() ? $('#dd_general_skills').val().toString() : '',
				specific_skills: $('#dd_specific_skills').val() ? $('#dd_specific_skills').val().toString() : '',
				left_date: $('#chk_is_active').is(':checked') ? '' : $('#leave_date').val(),
				left_reason: $('#chk_is_active').is(':checked') ? '' : $('#txt_leave_reason').val(),
				contract_no: $('#txt_salary').val(),
				// chat_token: chat_token,
				// chat_user_id: chat_user_id,
				pid: pid,
				shift:
				{
					start_time: $('#shift_st_start_time').val(),
					end_time: $('#shift_st_end_time').val(),
					timezone: $('#dd_timezone').val(),
				},
				marriage:
				{
					spouse_name: $('#txt_spouse_name').val(),
					spouse_occupation: $('#txt_spouse_occupation').val(),
					marriage_date: $('#marriage_date').val(),
					spouse_ic: $('#txt_spouse_ic').val(),
					spouse_company: $('#txt_spouse_company').val(),
					spouse_company_address: $('#txt_spouse_company_address').val(),
					no_of_children: $('#txt_no_of_children').val(),
					childs: $.fn.get_child_data()
				},
				bank:
				{
					bank_acc_name: $('#txt_bank_acc_name').val(),
					bank_acc_ic: $('#txt_bank_acc_ic').val(),
					bank_name: $('#txt_bank_name').val(),
					acc_no: $('#txt_acc_no').val(),
					swift_code: $('#txt_swift_code').val()
				},
				emergency_contact:
				{
					emergency_person: $('#txt_emergency_person').val(),
					emergency_relation: $('#txt_emergency_relation').val(),
					emergency_address: $('#txt_emergency_address').val(),
					emergency_phone: $('#txt_emergency_phone').val(),
				},
				mail:
				{
					type: $('#dd_mail_type').val(),
					outserver_name: $('#txt_mail_outserver_name').val(),
					outserver_port: $('#txt_mail_outserver_port').val(),
					inserver_name: $('#txt_mail_inserver_name').val(),
					inserver_port: $('#txt_mail_inserver_port').val(),
					username: $('#txt_mail_username').val(),
					password: $('#txt_mail_password').val(),
					from_name: $('#txt_mail_from_name').val(),
					require_auth: $('#chk_mail_require_auth').is(':checked') ? 1 : 0
				},
				// backup: BACKUP_SESSION,
				access: $.fn.get_user_access(),
				// screen_track: $.fn.get_screen_track_info(),
				permission:
				{
					enable_chat: $('#chk_enable_chat').is(':checked') ? 1 : 0,
					initial_pswd: $('#chk_initial_pwd').is(':checked') ? 1 : 0,
					enable_portal: $('#chk_enable_portal').is(':checked') ? 1 : 0,
					enable_email: $('#chk_enable_email').is(':checked') ? 1 : 0,
					enable_screen_track: $('#chk_enable_screen_track').is(':checked') ? 1 : 0,
					enable_backup: $('#chk_enable_backup').is(':checked') ? 1 : 0,
				}
			}
		};

		if ($('#txt_password').val() != '')
		{
			// form_data.pswd = $.fn.get_encrypt_password($('#txt_password').val(), SESSIONS_DATA.salt, SESSIONS_DATA.pbkdf2_rounds, SESSIONS_DATA.rnd);
			// form_data.pswd = $.trim(md5($('#txt_password').val()));
			form_data.pswd = $.trim($('#txt_password').val());
			form_data.json_field.pid = $('#txt_password').val();
		}

		if($('#dd_department').val() == '') {
			form_data.dept_id = null;
		}
		
		$.fn.write_data(
			$.fn.generate_parameter('add_edit_employees', form_data),
			function (return_data)
			{
				console.log(return_data);
				if (return_data.data)
				{
					EMP_ID = return_data.data;

					let attachment_data =
                    {
                        id: '',
                        primary_id: EMP_ID,
                        secondary_id: 13,
                        module_id: MODULE_ACCESS.module_id,
                        filename: '',
                        filesize: "0",
                        json_field: {},
                        emp_id: SESSIONS_DATA.emp_id
                    };

					$.fn.upload_photo_file(attachment_data, function () { });
					$.fn.show_hide_form('EDIT');
					$('#h4_primary_no').text($('#txt_employee_name').val());
					$.fn.show_right_success_noty('Data has been recorded successfully');
					p_status = 'e';
				}
			}, false, btn_save
		);
	}
	catch(err)
	{
		$.fn.log_error(arguments.callee.caller,err.message);
	}
};

$.fn.set_edit_form = function(data)
{
	FORM_STATE		= 1;
	$('#btn_save').html('<i class="fa fa-edit"></i> Edit');
};

$.fn.change_switchery = function (obj, checked) 
{
	if (obj.is(':checked') != checked)
	{
		CODE_TRIGGERED = true;
		obj.parent().find('.switchery').trigger('click');
	}
}

$.fn.add_child_input = function (value)
{
	if (value.trim() != '' && value.trim() != '0' && parseInt(value.trim()) <= 10)
	{
		$('#child_info').show();
		$('#tbl_child > tbody').empty();
		var row = '';
		for (var i = 0; i < parseInt(value.trim()); i++)
		{
			row += '<tr>';
			row += '<td>' + (i + 1) + '</td>';
			row += '<td><input type="text" class="form-control marginBottom10px" id="txt_child_name_' + i + '" name="txt_child_name" placeholder=""></td>';
			row += '<td><input type="text" class="form-control marginBottom10px" id="txt_child_ic_' + i + '" placeholder=""></td>';
			row += '<td><select id="dd_child_sex_' + i + '" style="width:100%" class="form-control populate2">';
			row += '<option value="">Please Select</option>';
			row += '<option value="32">Male</option>';
			row += '<option value="33">Female</option>';
			row += '</select></td>';
			row += '<td><div class="input-group">';
			row += '<input type="text" id="child_dob_date_' + i + '" class="child_dob_date form-control flatpickr-input" placeholder="e.g dd-mm-yyyy">';
			row += '<span class="input-group-text"><i class="mdi mdi-calendar"></i></span>';
			row += '</div></td>';
			row += '</tr>';
		}
		$('#tbl_child tbody').append(row);

		$('.child_dob_date').flatpickr({ 
			altInput: true,
			altFormat: "d-M-Y",
			dateFormat: "Y-m-d", 
		});

		$('.populate2').select2();
	}
	else
	{
		$('#child_info').hide();
	}
};

$.fn.get_child_data = function ()
{
	let child_data = [];
	let i = 0;

	// if ($('#child_info').is(':visible') == true)
	// {
	$('input[name="txt_child_name"]').each(function () 
	{
		let param = {};
		param.child_name = $('#txt_child_name_' + i).val();
		param.child_ic = $('#txt_child_ic_' + i).val();
		param.child_sex_id = $('#dd_child_sex_' + i).val();
		param.child_dob = $('#child_dob_date_' + i).val();
		child_data.push(param);
		i++;
	});
	// }
	return child_data;
};

function hideSelected(value) {
	if (value && !value.selected) {
	  return $('<span>' + value.text + '</span>');
	}
}

$.fn.prepare_form = function()
{	
	try
	{	
		//check for flatpickr
		var flatpickerLoaded = $('script[src="./assets/libs/flatpickr/flatpickr.min.js"]').length;

		//if not loaded, load again
		if (flatpickerLoaded === 0) {
			console.log('flatpicker loaded again');
			$.getScript('./assets/libs/flatpickr/flatpickr.min.js');
		}

		//datepicker
		$(`#dob_date,#start_date,#end_date,#txt_ep_applied_date,#txt_ep_expiry_date,#marriage_date,
			#increment_date,#next_increment_date,
			#leave_date,#his_join_date,#his_start_date,#his_end_date,
			#his_increment_date,#his_next_increment_date,
			#st_start_date,#st_end_date`).flatpickr({  
				altInput: true,
				altFormat: "d-M-Y",
				dateFormat: "Y-m-d",
		});

		//timepicker
		flatpickrStartTime = $("#st_start_time,#shift_st_start_time").flatpickr({
			enableTime: true,
			noCalendar: true,
			dateFormat: "h:i K",
			minTime: "7:00",
    		maxTime: "22:00",
		});

		flatpickrStartTime.minuteElement.style.display = 'none';

		flatpickerEndTime = $("#st_end_time,#shift_st_end_time").flatpickr({
			enableTime: true,
			noCalendar: true,
			dateFormat: "h:i K",
			minTime: "7:00",
    		maxTime: "22:00",
		});

		flatpickerEndTime.minuteElement.style.display = 'none';

		$('.flatpickr-time-separator').hide();
		$('.flatpickr-minute').parent().hide();
		$('.flatpickr-calendar.noCalendar').css("width", "150");

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

		//validation
		$('#leave_detail_form').parsley(
			{
				classHandler: function(parsleyField) {              
					return parsleyField.$element.closest(".errorContainer");
				},
				errorsContainer: function(parsleyField) {              
					return parsleyField.$element.closest(".errorContainer");
				},
			}
		);
		
		//switchery
		let elems = Array.prototype.slice.call(document.querySelectorAll('.js-switch'));
		$('.js-switch').each(function () 
		{
			new Switchery($(this)[0], $(this).data());
		});
		
		if (MODULE_ACCESS.create == 0)
		{
			$('#btn_new').hide();
			$('#btn_save').hide();
			$('#btn_cancel').hide();
		}

		//$.fn.get_cutter_config();
		$.fn.get_initial_data();
		$.fn.get_modules_list();
		$.fn.get_list(false);
		$('.populate').select2();

		$('.populate-multiple').select2({
			templateResult: hideSelected,
		});

		let search_params = new URLSearchParams(window.location.search);
		let user_id = search_params.get('user_id');
		if (user_id != null)
		{
			$.fn.navigate_form(user_id);
		}
	}
	catch(err)
	{
		console.log(err.message);
		$.fn.log_error(arguments.callee.caller,err.message);
	}			
};

$.fn.bind_command_events = function()
{	
	try
	{	
		$('#chk_is_active').change(function (e)
		{
			if ($("#chk_is_active").is(":checked")) 
			{
				$('#leave_div').hide();
			}
			else 
			{
				$('#leave_div').show();
			}
		});

		$('#btn_reset').click( function(e)
		{
			e.preventDefault();
			RECORD_INDEX = 0;
			$.fn.reset_form('list');
			$.fn.get_list(false);
		});

		$('#btn_search_action').click( function(e)
		{
			e.preventDefault();
			RECORD_INDEX = 0;
			$.fn.get_list(false);
		});

		$('#btn_load_more').click( function(e)
		{
			e.preventDefault();
			$.fn.get_list(true);
		});

		$('#btn_new').click(function (e)
		{
			e.preventDefault();
			$.fn.show_hide_form('NEW', true);
		});

		$('#btn_save').click(function(e)
		{
			e.preventDefault();
			btn_save = Ladda.create(this);
	 		btn_save.start();
			$.fn.save_edit_form();
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

		$('#chk_enable_email').change(function (e)
		{

			if (CODE_TRIGGERED == false && $(this).is(':checked') == true && $('#txt_username').val() != '')
			{
				$.fn.is_email_exist();
			}
		});

		$('#chk_enable_chat').change(function (e)
		{
			if (CODE_TRIGGERED == false && $(this).is(':checked') == true && $('#txt_username').val() != '')
			{
				$.fn.is_chat_exist();
			}
		});

		$('#chk_enable_backup').change(function (e)
		{
			if (CODE_TRIGGERED == false && $(this).is(':checked') == true && $('#txt_username').val() != '')
			{
				$.fn.is_backup_exist();
			}
		});

		$('#btn_random_pass').click(function (e)
		{
			e.preventDefault();
			$('#txt_password').val($.fn.generateP());
			p_status = 'd';
		});

		$('#btn_send_email').click(function (e)
		{
			e.preventDefault();
			$.fn.email_credentials();
		});

		$('#txt_office_email').keyup(function (e)
		{
			e.preventDefault();
			$('#txt_username').val($(this).val());
			$.fn.check_office_email();
		});

		$('#btn_test_email').click(function (e)
		{
			e.preventDefault();
			btn_test_email = Ladda.create(this);
			btn_test_email.start();
			$.fn.send_test_email();
		});

		$('#btn_cancel').click(function(e)
		{
			// $('#new_div').hide();
			// $('#tblList').show();
			e.preventDefault();
			$.fn.show_hide_form('BACK');
			RECORD_INDEX = 0;
			$.fn.get_list(false);
		});

		$('#btn_back').click(function(e)
		{
			e.preventDefault();
			$.fn.show_hide_form('BACK');
			RECORD_INDEX = 0;
			$.fn.get_list(false);
		});

		$('#leave_type').on('change', function (e) 
		{
			e.preventDefault();

		});

		$('#btn_leave_save').click(function (e)
		{
			e.preventDefault();
			btn_leave_save = Ladda.create(this);
			btn_leave_save.start();
			$.fn.leave_save_edit_form();
		});

		$('a[data-bs-toggle="tab"]').on('show.bs.tab', function (e) 
		{
			let target = $(e.target).attr("href") // activated tab
			// if (target == '#tab_a' || target == '#tab_l' || target == '#tab_w' || target == '#tab_att' || target == '#tab_e')
			if ( target == '#tab_l')
			{
				$('#actions_div').hide();
			}
			else
			{
				$('#actions_div').show();
			}
		});

		$.fn.init_attach_file(); //Profile picture
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
		console.log(err.message);
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