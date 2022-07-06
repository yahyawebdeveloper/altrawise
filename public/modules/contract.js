var FORM_STATE 		= 0;
var RECORD_INDEX 	= 0;
// var SESSIONS_DATA	= '';
var REF_ROW			= '';
var btn_save,btn_save_remarks,btn_save_revoke_approval,btn_comments_reply,btn_assign_save,btn_upload,btn_send_offer, btn_send_for_approval, btn_create_employee; 
CONTRACT_ID		= ''; 
CREATED_BY		= '';
CLIENT_ID		= '';
CURRENT_PATH	= 	'../../';
var UI_DATE_FORMAT = 'DD-MMM-YYYY';
var btn_onboard_save;
EMPLOYEE_NAME   = '';
var FILE_UPLOAD_PATH        = ''; //file upload mandatory field
var ONBOARDING_COSTS		= '';

$.fn.contact_form = function(form_status,reset_form)
{
    $.fn.reset_form('modal');
    $('#new_reference_div').slideDown();
};

$.fn.data_table_features = function()
{
	try
	{
		if (!$.fn.dataTable.isDataTable( '#tbl_list' ))
		{
			table = $('#tbl_list').DataTable
			({
				"searching"	: false,
				"paging"	: false,
				"info"		: false,
//				 "ordering": false
				"order": []
			});
		}
	}
	catch(err)
	{
		$.fn.log_error(arguments.callee.caller,err.message);
	}
};

$.fn.data_table_destroy = function()
{
	try
	{
		if ($.fn.dataTable.isDataTable('#tbl_list') )
		{
			$('#tbl_list').DataTable().destroy();
		}
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
        FORM_STATE		= 0;
        
        if(form == 'list')
        {
            $('#txt_name_search')		.val('');
            $('#dd_status_search')		.val('').change();
            $('#txt_email_search')		.val('');
            $('#dd_created_by_search')	.val('').change();
            $('#dd_stage_status_search').val(JSON.parse("[174,175,176]")).change();
        }
        else if(form == 'form')
        {			
        	CONTRACT_ID		= '';
        	CREATED_BY		= '';
        	CLIENT_ID		= '';
			EMPLOYEE_NAME   = '';
			ATTACHMENTS     = '';
			CONTRACT_DETAILS= '';
			
			DELETE_EMPLOYMENTS  = [];
			DELETE_CLIENTS      = [];
			DELETE_REFERENCES   = [];
        	$('#contract_tab a:first')				.tab('show');
			$('#txt_employee_name')					.val('');

			$('#txt_designation')					.val('');
			
			$('#dd_sex')							.val('').change();
			$('#dd_nationality')					.val('').change();
			
			$('#txt_email')							.val('');
			$('#dd_marital_status')					.val('').change();
			$('#dd_notification_email_to')		    .val('').change();
			$('#dd_onboarding_status')		    	.val('174').change();
			
			//cost details
			$('#cost_currency_id')					.val('').change();
			$('#txt_salary')		    			.val('');

			//candidate json
			$('#txt_contact_no').val('');
			$('#txt_nric').val('');
			$('#txt_home_address').val('');
			$('#txt_current_company').val('');				
			$('#txt_current_ep_expiry_date').val('');
			$('#txt_apply_ep_on_date').val('');
			$('#chk_noc').prop('checked',false);
			$('#chk_is_expat').prop('checked',false);
			$('#chk_leave_country_required').prop('checked',false);
			$('#notification_month').val('');
			$('#dd_requestor_name').val('').change();
			$('#request_date').val('');

			//additional json
			$('#dd_department').val('').change();
			$('#dd_home_country').val('').change();
			$('#txt_address_malaysia').val('');			
			$('#txt_office_tel').val('');
			$('#txt_age').val('');
			$('#date_of_birth').val('');
			$('#dd_nationality').val('').change();
			$('#txt_place_of_birth').val('');
			$('#txt_office_email').val('');
			$('#txt_race').val('');
			$('#ep_expiry_date').val('');
			$('#dd_general_skills').val('0').change();
			$('#dd_specific_skills').val('0').change();
			$('#txt_spouse_name').val('');
			$('#txt_spouse_occupation').val('');
			$('#marriage_date').val('');
			$('#txt_spouse_company').val('');
			$('#txt_spouse_ic').val('');
			$('#txt_spouse_company_address').val('');
			$('#txt_no_of_children').val('');
			$('#txt_bank_acc_name').val('');
			$('#txt_bank_acc_ic').val('');
			$('#txt_bank_name').val('');
			$('#txt_acc_no').val('');
			$('#txt_swift_code').val('');
			$('#txt_emergency_person').val('');
			$('#txt_emergency_relation').val('');
			$('#txt_emergency_address').val('');
			$('#txt_emergency_phone').val('');

			$('#dd_resume_source').val('').change();
			$('#txt_referral_name').val('');
			$('#txt_referral_amount').val('');
			$('#dd_ext_rec').val('').change();
			$('#txt_ext_rec_amount').val('')
			$('#txt_ext_sales_amount').val('');
			$('#dd_requestor_name').val('').change();
			$('#request_date').val('')
			$('#dd_recruiter_name').val('').change();
			$('#dd_sales_person').val('').change();

			//cost json
			$('#txt_epf').val('');		
			$('#txt_socso').val('');
			$('#txt_epcost').val('');
			$('#txt_recruiter_commission').val('');	
			$('#txt_outpatient_medical_cost').val('');
			$('#txt_medical_insurance_cost').val('');
			$('#txt_overseas_visa_cost').val('');
			$('#txt_laptop_cost').val('');
			$('#txt_temp_accommodation_cost').val('');
			$('#txt_mobilization_cost').val('');
			$('#txt_flight_ticket_cost').val('');
			$('#txt_notice_period_buyout').val('');
			$('#txt_bonus').val('');
			$('#txt_sales_commission').val('');
			$('#txt_eis').val('');
			$('#txt_hrdf').val('');
			$('#txt_other_cost').val('');
			$('#txt_other_cost_remarks').val('');
			$('#txt_annual_leave').val('');
			$('#txt_medical_leave').val('');
			$('#chk_leave_country_required').prop('checked',false);
			$('#chk_client_to_hire_allow').prop('checked',false);
			$('#chk_replacement_leave_applicable').prop('checked',false);
			$('#chk_annual_leave_encash_allow').prop('checked',false);
			$('#chk_is_active').prop('checked',false);
			$('#chk_travelling_claim').prop('checked',false);
			$('#chk_medical_claim').prop('checked',false);
	       	
			$.fn.reset_upload_form();

			$('.send-offer').hide();
			$('#emp_list_block').empty();
			$('#approval_div').hide();

			$('#txt_duration').val('');
			//$('#dd_assignee') 	.val('').multiselect('reload');
			$('#dd_assignee') 	.val('');

			$('#btn_create_employee').hide();
			$('#child_info').hide();

			$("#tbl_dependent tbody").find("tr:not('#base_row_dependent')").remove();
			$("#tbl_allowance tbody").find("tr:not('#base_row')").remove();
			$("#tbl_increment tbody").find("tr:not('#base_row_increment')").remove();

			$('#div_user_ref').html("");
			
		}
		else if(form == 'employment_form')
        {	
			
			$('#btn_employment_add').removeAttr('disabled');
			DELETE_EMPLOYMENTS  = [];
			
			$('#dd_approvals_div').show();
			$('#approval_div').hide();
			$('#send_for_approval').hide();
			$('.emp-block').removeClass('active');
			$('#btn_employment_add').html('<i class="fa fa-plus fa-fw" aria-hidden="true"></i><span class="hidden-xs">Add</span>');
			$('#txt_employment_id').val('');
			$('#dd_employment_category').val('').change();
			$('#dd_employment_type').val('').change();
			$('#commencing_date').val('');
			$('#emp_start_date').val('');
			$('#emp_end_date').val('');
			$('#duration_of_employment').val('');
			$('#dd_duration').val('').change();
			$('#dd_notice_period').val('').change();
			$('#dd_employer').val('').change();
			$('#dd_emp_status').val('').change();
			$('#dd_approvals').val('').change();

			//$('#dd_client_contract') 	.val('').multiselect('reload');
			$('#dd_client_contract') 	.val('');
			//$('#employment_form').parsley().destroy();
			$.fn.set_validation_form();
		}
		else if(form == 'client_form')
        {	
			DELETE_CLIENTS      = [];
			$('.client-block').removeClass('active');
			$('#btn_client_add').html('<i class="fa fa-plus fa-fw" aria-hidden="true"></i><span class="hidden-xs">Add</span>');
			$('#txt_client_id').val('');
			$('#dd_client').val('').change();
			$('#txt_hiring_manager_name').val('');
			$('#txt_hiring_manager_telno').val('');
			$('#txt_hiring_manager_email').val('');
			$('#txt_client_invoice_contact_person').val('');
			$('#txt_client_invoice_address_to').val('');
			$('#dd_client_country').val('').change();
			$('#txt_client_location').val('');
			$('#dd_working_days').val('').change();
			$('#txt_overtime_rate').val('');
			$('#txt_annual_leave_by_client').val('');
			$('#txt_medical_leave_by_client').val('');
			$('#dd_billing_currency').val('').change();
			$('#dd_billing_type').val('').change();
			$('#dd_billing_cycle').val('').change();
			$('#billing_start_date').val('');
			$('#billing_end_date').val('');
			$('#txt_billing_amount').val('');
			$('#txt_billing_amount_with_gst').val('');
			$('#txt_one_time_fees').val('');
			$('#txt_fee_descr').val('');
			$('#txt_total_contract_value').val('');

			//$('#client_form').parsley().destroy();
			$.fn.set_validation_form();
			
		}
		else if(form == 'allowance_form')
        {
			$('#dd_td_allowance')	.val('').change();
			$('#txt_amount')		.val('');	
		}
		else if(form == 'increment_form')
        {
			$('#txt_inc_description').val('');
			$('#txt_inc_amount')	 .val('');
			$('#txt_inc_date')		 .val('');	
		}
		else if(form == 'dependent_form')
        {
			$('#dd_td_dependent')			.val('').change();
			$('#dd_dp_qty')					.val("0").change();
			$('#txt_td_dependent_amount')	.val('');
		}
		else if(form == 'reference_form')
        {
			$('#txt_ref_name')				.val('');
			$('#txt_ref_contact_no')		.val('');
			$('#txt_ref_email')				.val('');
			$('#txt_ref_company')			.val('');
			$('#txt_ref_designation')		.val('');
			$('#dd_ref_relationship')		.val('').change();
			$('#txt_ref_remarks')			.val('');

			DELETE_REFERENCES   = [];
		}
		else if(form == 'remark_modal')
        {
			$('#ct_no')								.val('');	
			$('#chk_level')							.val('');
			$('#ct_remark')							.val('');
			$('#approve_or_cancel')					.val('');							
		}
		else if(form == 'remark_list_modal')
        {
			$('#contract_no')						.val('');	
			$('#contract_remark')					.val('');						
		}
		else if(form == 'comments_form')
        {			
        	$("#files_reply")  	.empty();
            $('#txt_reply')     .val('');
            $('#div_reply')		.empty();
            $('#btn_reply')		.prop('disabled', true);
            $('#txt_reply')		.prop('readonly', true);
            $('#div_reply')		.hide();
            $('#assign_div')	.hide();
           // $('#dd_assignee') 	.val('').multiselect('reload');
		   $('#dd_assignee') 	.val('');
        }
    }
    catch(err)
    { //console.log(err);
        $.fn.log_error(arguments.callee.caller,err.message);
    }
};

$.fn.populate_detail_form = function(contract_no)
{
	try
	{	
		$.fn.show_hide_form	('EDIT');
	 	$('#h4_primary_no').text('Contract Number : ' + contract_no);
		 $.fn.intialize_fileupload('fileupload_reply', 'files_reply');
	 	$.fn.fetch_data
		(
			$.fn.generate_parameter('get_contract_details',{contract_no : contract_no}),	
			function(return_data)
			{
				if(return_data.data)
				{
					let data 								= return_data.data.details;
					CONTRACT_ID								= data.contract_no;	
					EMPLOYEE_NAME                           = data.employee_name;
					$('#txt_employee_name')					.val(data.employee_name);

					$('#txt_designation')					.val(data.designation);
					
					$('#dd_sex')							.val(data.sex_id).change();
					
		        	$('#txt_email')							.val(data.email);
					$('#dd_marital_status')					.val(data.marital_status_id).change();
					$('#dd_notification_email_to')		    .val(data.notification_email).change();
					$('#dd_onboarding_status')		    	.val(data.onboarding_status_id).change();

					//cost details
					$('#cost_currency_id')					.val(data.cost_currency_id).change();
					$('#txt_salary')		    			.val($.fn.format_cost(data.basic_salary));

					if (data.employee_id != null)
					{
						$('#div_user_ref').html(`<button class="btn btn-success btn-label" value="${data.employee_id}"><i class="fa fa-external-link"></i> ${data.employee_id}</button>`);
					}
		        	
		        	let json_field 	= $.fn.get_json_string(data.json_field);
					if(json_field !== false)
					{	
						let candidate_json 	= json_field.candidate;
						$('#txt_contact_no').val(candidate_json.candidate_contact_no);
						$('#txt_nric').val(candidate_json.nric);
						$('#txt_home_address').val(decodeURIComponent(candidate_json.home_address));
						$('#txt_current_company').val(candidate_json.current_company);	

						$('#txt_current_ep_expiry_date').val(candidate_json.current_ep_expiry_date ? moment(candidate_json.current_ep_expiry_date).format(UI_DATE_FORMAT) : '');
						$('#txt_apply_ep_on_date').val(candidate_json.apply_ep_on_date ? moment(candidate_json.apply_ep_on_date).format(UI_DATE_FORMAT) : '');
						$('#chk_noc').prop('checked',parseInt(candidate_json.able_to_obtain_noc));
						$('#chk_is_expat').prop('checked',parseInt(candidate_json.is_expat));
						$('#chk_leave_country_required').prop('checked',parseInt(candidate_json.require_to_exit_country));
						$('#notification_month').val(candidate_json.notification_month);
						$('#dd_requestor_name').val(candidate_json.requestor_name).change();
						$('#request_date').val(candidate_json.request_date);

						let additional_json 	= json_field.additional;
						$('#dd_department').val(additional_json.department).change();
						$('#dd_home_country').val(additional_json.home_country).change();
						$('#txt_address_malaysia').val(decodeURIComponent(additional_json.address_malaysia));			
						$('#txt_office_tel').val(additional_json.office_tel);
						$('#date_of_birth').val(additional_json.date_of_birth ? moment(additional_json.date_of_birth).format(UI_DATE_FORMAT) : '');

						if(additional_json.date_of_birth)
						{
							let age = moment().diff(new Date(moment(additional_json.date_of_birth).format('DD-MMM-YYYY')), 'years');
							$('#txt_age').val(age);
						}
						
						$('#dd_nationality').val(additional_json.nationality).change();
						$('#txt_place_of_birth').val(additional_json.place_of_birth);
						$('#txt_office_email').val(additional_json.office_email);
						$('#txt_race').val(additional_json.race);
						$('#ep_expiry_date').val(additional_json.ep_expiry_date);

						additional_json.general_skills ? $('#dd_general_skills').val(additional_json.general_skills.split(',')).change() : $('#dd_general_skills').val('').change();
						additional_json.specific_skills ? $('#dd_specific_skills').val(additional_json.specific_skills.split(',')).change() : $('#dd_specific_skills').val('').change();

						$('#txt_spouse_name').val(additional_json.spouse_name);
						$('#txt_spouse_occupation').val(additional_json.spouse_occupation);
						$('#marriage_date').val(additional_json.marriage_date);
						$('#txt_spouse_company').val(additional_json.spouse_company);
						$('#txt_spouse_ic').val(additional_json.spouse_ic);
						$('#txt_spouse_company_address').val(additional_json.spouse_company_address);
						$('#txt_no_of_children').val(additional_json.no_of_children);
						
						if (additional_json.no_of_children != 0 && additional_json.no_of_children != null && additional_json.no_of_children != '')
						{
							$.fn.add_child_input(additional_json.no_of_children);
							let data_child = additional_json.childs;
							for (var i = 0; i < data_child.length; i++)
							{
								$('#txt_child_name_' + i).val(data_child[i].child_name);
								$('#txt_child_ic_' + i).val(data_child[i].child_ic);
								$('#dd_child_sex_' + i).val(data_child[i].child_sex_id).change();
								$('#child_dob_date_' + i).val(data_child[i].child_dob);
							}
						}

						$('#txt_bank_acc_name').val(additional_json.bank_acc_name);
						$('#txt_bank_acc_ic').val(additional_json.bank_acc_ic);
						$('#txt_bank_name').val(additional_json.bank_name);
						$('#txt_acc_no').val(additional_json.acc_no);
						$('#txt_swift_code').val(additional_json.swift_code);
						$('#txt_emergency_person').val(additional_json.emergency_person);
						$('#txt_emergency_relation').val(additional_json.emergency_relation);
						$('#txt_emergency_address').val(additional_json.emergency_address);
						$('#txt_emergency_phone').val(additional_json.emergency_phone);

						$('#dd_resume_source').val(additional_json.resume_source).change();
						$('#txt_referral_name').val(decodeURIComponent(additional_json.referral_name));
						$('#txt_referral_amount').val(decodeURIComponent(additional_json.referral_amount));
						$('#dd_ext_rec').val(additional_json.ext_rec).change();
						$('#txt_ext_rec_amount').val(decodeURIComponent(additional_json.ext_rec_amount))
						$('#txt_ext_sales_amount').val(decodeURIComponent(additional_json.ext_sales_amount));
						$('#dd_requestor_name').val(additional_json.requestor_name).change();
						$('#request_date').val(additional_json.request_date ? moment(additional_json.request_date).format(UI_DATE_FORMAT) : '');
						$('#dd_recruiter_name').val(additional_json.recruiter_name).change();
						$('#dd_sales_person').val(additional_json.sales_person).change();

						let cost_json 	= json_field.cost;
						$('#txt_epf').val($.fn.format_cost(cost_json.epf));		
						$('#txt_socso').val($.fn.format_cost(cost_json.socso));
						$('#txt_epcost').val($.fn.format_cost(cost_json.epcost));
						$('#txt_recruiter_commission').val($.fn.format_cost(cost_json.recruiter_commission));	
						$('#txt_outpatient_medical_cost').val($.fn.format_cost(cost_json.outpatient_medical_cost));
						$('#txt_medical_insurance_cost').val($.fn.format_cost(cost_json.medical_insurance_cost));
						$('#txt_overseas_visa_cost').val($.fn.format_cost(cost_json.overseas_visa_cost));
						$('#txt_laptop_cost').val($.fn.format_cost(cost_json.laptop_cost));
						$('#txt_temp_accommodation_cost').val($.fn.format_cost(cost_json.temp_accommodation_cost));
						$('#txt_mobilization_cost').val($.fn.format_cost(cost_json.mobilization_cost));
						$('#txt_flight_ticket_cost').val($.fn.format_cost(cost_json.flight_ticket_cost));
						$('#txt_notice_period_buyout').val($.fn.format_cost(cost_json.notice_period_buyout));
						$('#txt_bonus').val($.fn.format_cost(cost_json.bonus));
						$('#txt_sales_commission').val($.fn.format_cost(cost_json.sales_commission));
						$('#txt_eis').val($.fn.format_cost(cost_json.eis));
						$('#txt_hrdf').val($.fn.format_cost(cost_json.hrdf));
						$('#txt_other_cost').val($.fn.format_cost(cost_json.other_cost));
						$('#txt_other_cost_remarks').val($.fn.format_cost(cost_json.other_cost_remarks));
						$('#txt_annual_leave').val($.fn.format_cost(cost_json.annual_leave));
						$('#txt_medical_leave').val($.fn.format_cost(cost_json.medical_leave));
						$('#chk_client_to_hire_allow').prop('checked',parseInt(cost_json.client_to_hire_allow));
						$('#chk_replacement_leave_applicable').prop('checked',parseInt(cost_json.replacement_leave_applicable));
						$('#chk_annual_leave_encash_allow').prop('checked',parseInt(cost_json.annual_leave_encash_allow));
						$('#chk_is_active').prop('checked',parseInt(cost_json.is_active));
						$('#chk_travelling_claim').prop('checked',parseInt(cost_json.travelling_claim));
						$('#chk_medical_claim').prop('checked',parseInt(cost_json.medical_claim));
					}
					$("#trail").attr("data-name",SESSIONS_DATA.name);
   					$.fn.populate_allowance_list_form(return_data.data.allowance);
					$.fn.populate_dependent_list_form(return_data.data.dependent);
					$.fn.populate_reference_list_form(return_data.data.reference);
					$.fn.populate_increment_list_form(return_data.data.increment);
					$.fn.populate_employment_list_form(return_data.data.employment);
					$.fn.populate_client_list_form(return_data.data.client);
					$.fn.populate_attachments(return_data.data.attachments);

					$.fn.populate_comments_form(return_data.data);

					$.fn.show_hide_components(data);
					ATTACHMENTS = return_data.data.attachments;
					CONTRACT_DETAILS = return_data.data;
					getInitials();
				}
			},true
		);	
	}
	catch(err)
	{
		$.fn.log_error(arguments.callee.caller,err.message);
	}
};

$.fn.populate_attachments = function(data)
{
	$.each(data, function( doc_name, attachments ) 
	{
		let attachment_data = [];
		attachment_data.attachment = attachments;
		$.fn.populate_fileupload(attachment_data,'files_'+doc_name, true);
	});
}

$.fn.construct_filepath = function(path,file)
{
	let return_string = '';
	if(file != "" && file != null)
	{
		return_string = '<a class="btn btn-primary" style="width:100px" href="'+ path +  file + '"  target="_blank">View</a>';
	}
	return return_string;
}


$.fn.set_edit_form = function(data)
{
	FORM_STATE		= 1;
	$('#btn_save')			.html('<i class="fa fa-edit"></i> Update');
};

$.fn.set_sub_edit_form = function(data)
{
	FORM_STATE		= 1;
	$('#btn_sub_save')			.html('<i class="fa fa-edit"></i> Update');
};

$.fn.save_edit_form = function()
{	
	try
	{		
		if($('#detail_form').parsley( 'validate' ) == false)
		{
			btn_save.stop();
			return;
		}
		
		var form_data = 
		{
			id								: CONTRACT_ID,
			emp_id							: SESSIONS_DATA.emp_id,
			delete_employments              : DELETE_EMPLOYMENTS,
			delete_clients              	: DELETE_CLIENTS,
			delete_references              	: DELETE_REFERENCES,
			dependent						: [],
			allowance						: [],
			increment                       : [],
			reference						: [],
			employment_data					: [],
			client_data						: [],
			assigned_to                     : $('#dd_assignee').val() ? $('#dd_assignee').val().toString() : ''
		};

		form_data.candidate					= 
		{
			employee_name					: $('#txt_employee_name').val(),
			designation						: $('#txt_designation').val(),
			sex_id							: $('#dd_sex').val(),
			email							: $('#txt_email').val(),
			marital_status_id				: $('#dd_marital_status').val(),
			notification_email				: $('#dd_notification_email_to').val(),
			onboarding_status_id			: $('#dd_onboarding_status').val(),
		};

		form_data.candidate.json_field   	= 
		{
			candidate_contact_no			: $('#txt_contact_no').val(),
			nric							: $('#txt_nric').val(),
			home_address					: encodeURIComponent($('#txt_home_address').val()),
			current_company					: $('#txt_current_company').val(),				
	       	current_ep_expiry_date			: $('#txt_current_ep_expiry_date').val(),
	       	apply_ep_on_date				: $('#txt_apply_ep_on_date').val(),
			able_to_obtain_noc				: $('#chk_noc').is(':checked') ? 1 : 0,
			is_expat						: $('#chk_is_expat').is(':checked') ? 1 : 0,
			require_to_exit_country			: $('#chk_leave_country_required').is(':checked') ? 1 : 0,
			notification_month				: $('#notification_month').val(),
			requestor_name					: $('#dd_requestor_name').val(),
			request_date					: $('#request_date').val(),   
		};

		form_data.additional                = {};
		form_data.additional.json_field  	= 
		{
			department						: $('#dd_department').val(),
			home_country					: $('#dd_home_country').val(),
			address_malaysia				: encodeURIComponent($('#txt_address_malaysia').val()),			
			office_tel						: $('#txt_office_tel').val(),
			//age								: $('#txt_age').val(),
			date_of_birth					: $('#date_of_birth').val(),
			nationality						: $('#dd_nationality').val(),
			place_of_birth					: $('#txt_place_of_birth').val(),
			office_email					: $('#txt_office_email').val(),
			race							: $('#txt_race').val(),
			ep_expiry_date					: $('#ep_expiry_date').val(),
			general_skills					: $('#dd_general_skills').val() ? $('#dd_general_skills').val().toString() : '',
			specific_skills 				: $('#dd_specific_skills').val() ? $('#dd_specific_skills').val().toString() : '',
			spouse_name						: $('#txt_spouse_name').val(),
			spouse_occupation				: $('#txt_spouse_occupation').val(),
			marriage_date					: $('#marriage_date').val(),
			spouse_company					: $('#txt_spouse_company').val(),
			spouse_ic						: $('#txt_spouse_ic').val(),
			spouse_company_address			: $('#txt_spouse_company_address').val(),
			no_of_children					: $('#txt_no_of_children').val(),
			bank_acc_name					: $('#txt_bank_acc_name').val(),
			childs							: $.fn.get_child_data(),
			bank_acc_ic						: $('#txt_bank_acc_ic').val(),
			bank_name						: $('#txt_bank_name').val(),
			acc_no							: $('#txt_acc_no').val(),
			swift_code						: $('#txt_swift_code').val(),
			emergency_person				: $('#txt_emergency_person').val(),
			emergency_relation				: $('#txt_emergency_relation').val(),
			emergency_address				: $('#txt_emergency_address').val(),
			emergency_phone					: $('#txt_emergency_phone').val(),
			resume_source					: $('#dd_resume_source').val(),
			referral_name					: encodeURIComponent($('#txt_referral_name').val()),
			referral_amount					: encodeURIComponent($('#txt_referral_amount').val()),
			ext_rec							: $('#dd_ext_rec').val(),
			ext_rec_amount					: encodeURIComponent($('#txt_ext_rec_amount').val()),
			ext_sales_amount				: encodeURIComponent($('#txt_ext_sales_amount').val()),
			requestor_name					: $('#dd_requestor_name').val(),
			request_date					: $('#request_date').val(),
			recruiter_name					: $('#dd_recruiter_name').val(),
			sales_person					: $('#dd_sales_person').val(),
		}

		form_data.cost 						= 
		{
			cost_currency_id                : $('#cost_currency_id').val(),
			basic_salary                    : $('#txt_salary').val()
		};

		form_data.cost.json_field  			= 
		{
			epf								: $('#txt_epf').val(),		
			socso							: $('#txt_socso').val(),
			epcost							: $('#txt_epcost').val(),
			recruiter_commission			: $('#txt_recruiter_commission').val(),	
			outpatient_medical_cost			: $('#txt_outpatient_medical_cost').val(),
			medical_insurance_cost			: $('#txt_medical_insurance_cost').val(),
			overseas_visa_cost   			: $('#txt_overseas_visa_cost').val(),
			laptop_cost						: $('#txt_laptop_cost').val(),
			temp_accommodation_cost			: $('#txt_temp_accommodation_cost').val(),
			mobilization_cost				: $('#txt_mobilization_cost').val(),
			flight_ticket_cost				: $('#txt_flight_ticket_cost').val(),
			notice_period_buyout			: $('#txt_notice_period_buyout').val(),
			bonus							: $('#txt_bonus').val(),
			sales_commission				: $('#txt_sales_commission').val(),
			eis								: $('#txt_eis').val(),
			hrdf							: $('#txt_hrdf').val(),
			other_cost						: $('#txt_other_cost').val(),
			other_cost_remarks				: $('#txt_other_cost_remarks').val(),
			annual_leave					: $('#txt_annual_leave').val(),
			medical_leave					: $('#txt_medical_leave').val(),
			overtime_applicable				: $('#chk_overtime_applicable').is(':checked')			? 1 : 0,
			client_to_hire_allow			: $('#chk_client_to_hire_allow').is(':checked') 		? 1 : 0,
			replacement_leave_applicable	: $('#chk_replacement_leave_applicable').is(':checked')	? 1 : 0,
			annual_leave_encash_allow		: $('#chk_annual_leave_encash_allow').is(':checked')	? 1 : 0,
			is_active						: $('#chk_is_active').is(':checked') 					? 1 : 0,
			travelling_claim				: $('#chk_travelling_claim').is(':checked') 			? 1 : 0,
			medical_claim					: $('#chk_medical_claim').is(':checked')				? 1 : 0,
		};

		let allowance_inputs = $(".btn_allowance");
		for(let i = 0; i < allowance_inputs.length;i++)
		{
			form_data.allowance.push(JSON.parse($(allowance_inputs[i]).attr('data')));
		}

		let dependent_inputs = $(".btn_dependent");
		for(let i = 0; i < dependent_inputs.length;i++)
		{
			form_data.dependent.push(JSON.parse($(dependent_inputs[i]).attr('data')));
		}

		let increment_inputs = $(".btn_increment");
		for(let i = 0; i < increment_inputs.length;i++)
		{
			form_data.increment.push(JSON.parse($(increment_inputs[i]).attr('data')));
		}

		reference_data = [];
		$('#table_ref_list  > tr').each(function(i, row) 
		{	
			form_data.reference.push(JSON.parse($(row).find('.ref_data').val()));
		});

		employment_data = [];
		$('#emp_list_block  > .emp-block-container').each(function(i, row) 
		{	
			employment_data.push(JSON.parse($(row).find('.emp_data').val()));
		});
		
		form_data.employment_data = employment_data;

		client_data = [];
		$('#clients_list_block  > .client-block-container').each(function(i, row) 
		{	
			client_data.push(JSON.parse($(row).find('.client_data').val()));
		});
		
		form_data.client_data = client_data;
		
		$.fn.write_data
		(
			$.fn.generate_parameter('add_edit_contracts', form_data),	
			function(return_data)
			{
				if(return_data.data)
				{
					// $.fn.set_edit_form();
					$.fn.show_hide_form('EDIT');
					CONTRACT_ID = return_data.data.id;
					$.fn.populate_detail_form(CONTRACT_ID);
					$('#h4_primary_no').text('Contract Number : ' + CONTRACT_ID);
					$.fn.show_right_success_noty('Data has been recorded successfully');
					$('#tab_permission,#tab_assets,#tab_leaves,#tab_wh,#tab_track').show();
				}
			},false, btn_save
		);

	}
	catch(err)
	{//console.log(err);
		$.fn.log_error(arguments.callee.caller,err.message);
	}
};

$.fn.save_edit_employment_form = function()
{	
	try
	{	
		if($('#employment_form').parsley( 'validate' ) == false)
		{
			return;
		}

		let approvals = [];
		let approvals_data = $('#dd_approvals').select2('data');
		$.each(approvals_data,function( index ) 
		{	
			approvals.push({'id': approvals_data[index].id, 'text': approvals_data[index].text});
		});

		let data	= 
		{
			id									: $('#txt_employment_id').val(),
			employment_category_id				: $('#dd_employment_category').val(),
			employment_type_id					: $('#dd_employment_type').val(),
			commencing_date						: $('#commencing_date').val(),
			emp_start_date						: $('#emp_start_date').val(),
			emp_end_date						: $('#emp_end_date').val(),
			duration_of_employment				: encodeURIComponent($('#duration_of_employment').val()),
			duration							: $('#dd_duration').val(),
			notice_period						: $('#dd_notice_period').val(),
			employer_id							: $('#dd_employer').val(),
			client_contract_id					: $('#dd_client_contract').val() ? $('#dd_client_contract').val().toString() : '',
			is_active							: $('#dd_emp_status').val(),
			approvals                           : encodeURIComponent(JSON.stringify(approvals)),
			is_update_or_add				    : 'true',
		};

		let emp_type = $("#dd_employment_type option:selected").text();
		
		let employment_id = $("#txt_employment_id").val();
		
		let data_json = JSON.stringify(data);
		let row = `<div class="col-md-2 emp-block-container">
						<a class="emp-block" href="#">
							<div class="emp-heading">
								<input type='hidden' value='${employment_id}' class='txt_employment_id'>
								<input type='hidden' value=${data_json} class='emp_data'>
								<div class="pull-left">${emp_type}</div>
								<div class="pull-right remove-employment"><button class="btn btn-danger btn-xs"><i class="fa fa-times"></i></button></div>
							</div>
							<div class="emp-body">
								<div class="text-center"></div>
								<small style="margin-top: 7px;"><span class="fa fa-calendar fa-fw" style="color:blue;"></span> ${data.emp_start_date} - ${data.emp_end_date}</small>
							</div>
						</a>
					</div>`;
		$.fn.reset_form('employment_form');
		if(employment_id)
		{
			$(`#emp-container-${employment_id}`).replaceWith(row);
		}
		else
		{	
			$('#emp_list_block').append(row);
		}
		$('#btn_employment_add').attr('disabled','disabled');
		$.fn.save_edit_form();
	}
	catch(err)
	{
		$.fn.log_error(arguments.callee.caller,err.message);
	}
};

$.fn.populate_employment_list_form = function(data)
{
	try
	{	
		$("#emp_list_block").empty();
		if (data) // check if there is any data, precaution 
		{
			let row			= '';
			let data_val 	= '';
			let data_att    = '';
			let emp_type    = '';
			let duration    = 0;
			for(var i = 0; i < data.length; i++)
			{	

				let json_field 	= data[i].json_field;
				emp_type 		= data[i].emp_type;
				data_val 		= JSON.stringify(data[i].json_field);
				data_att 		= JSON.stringify(data[i].attachment);
				duration        += parseInt(json_field.duration_of_employment);
				row += `<div class="col-md-2 emp-block-container" id="emp-container-${data[i].id}">
						<div class="emp-block">
							<div class="emp-heading">
								<input type='hidden' value='${data[i].id}' class='txt_employment_id'>
								<input type='hidden' value='${data_val}' class='emp_data'>
								<input type='hidden' value='${data_att}' class='att_data'>
								<input type='hidden' value='${data[i].status_id}' class='emp_status_id'>
								<div class="pull-left">${emp_type}</div>
								<div class="pull-right remove-employment"><button class="btn btn-danger btn-xs"><i class="fa fa-times"></i></button></div>
							</div>
							<div class="emp-body">
								<div class="text-center"></div>
								<small style="margin-top: 7px;"><span class="fa fa-calendar fa-fw"  style="color:blue;"></span> ${json_field.emp_start_date} - ${json_field.emp_end_date}</small>
							</div>
						</div>
					</div>`;
			}
			$('#emp_list_block').append(row);
			$('#txt_duration').val(duration);
		}
	}
	catch(err)
	{
		$.fn.log_error(arguments.callee.caller,err.message);
	}
};

$.fn.populate_employment_detail = function(element_id)
{
    try
    {	
		$('#approval_div').show();
		$('.emp-block').removeClass('active');
		element_id.addClass('active');
		// element_id.find('.remove-employment').hide();

		$('#btn_employment_add').html('<i class="fa fa-edit fa-fw" aria-hidden="true"></i><span class="hidden-xs">Update</span>');
		$('#btn_employment_add').removeAttr('disabled');

		let json_field 		= element_id.find('.emp_data').val();
		json_field 			= $.fn.get_json_string(json_field);

		let attachment      = element_id.find('.att_data').val();
		attachment 			= $.fn.get_json_string(attachment);
		
		let status_id      	= element_id.find('.emp_status_id').val();
		let employment_id = element_id.find('.txt_employment_id').val();
		$('#txt_employment_id').val(employment_id);
		$('#dd_employment_category').val(json_field.employment_category_id).change();
		$('#dd_employment_type').val(json_field.employment_type_id).change();
		$('#commencing_date').val(json_field.commencing_date);
		$('#emp_start_date').val(json_field.emp_start_date);
		$('#emp_end_date').val(json_field.emp_end_date);
		$('#duration_of_employment').val(decodeURIComponent(json_field.duration_of_employment));
		$('#dd_duration').val(json_field.duration).change();
		$('#dd_notice_period').val(json_field.notice_period).change();
		$('#dd_employer').val(json_field.employer_id).change();

		//$('#dd_client_contract').val(json_field.client_contract_id.split(",")).multiselect( 'reload' );
		$('#dd_client_contract').val(json_field.client_contract_id.split(",")).change();
		$('#dd_emp_status').val(json_field.is_active).change();
		
		if(json_field.approvals)
		{
			$('#dd_approvals')   .val(json_field.approvals.split(",")).change();
		}
		if(attachment)
		{	
			let attachment_data = [];
			attachment_data.attachment = attachment;
			$.fn.populate_fileupload(attachment_data,'files_po_file', true);
		}
		$.fn.show_hide_approval(status_id, json_field, attachment);
		
	}	
	catch(err)
	{
		$.fn.log_error(arguments.callee.caller,err.message);
	}
};

$.fn.remove_employement = function(element)
{
    try
    {	
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
					element.parents('.emp-block-container').remove();
					let employment_id = element.parents('.emp-block-container').find('.txt_employment_id').val();
					DELETE_EMPLOYMENTS.push(employment_id);

					$.fn.save_edit_form();
                }
            }
        });
	}	
	catch(err)
	{
		$.fn.log_error(arguments.callee.caller,err.message);
	}
};


$.fn.populate_client_list_form = function(data)
{
	try
	{	
		$("#clients_list_block").empty();
		$("#dd_client_contract").empty();

		if (data) // check if there is any data, precaution 
		{
			let row				= '';
			let data_val 		= '';
			let emp_type    	= '';
			let client_contract = '';
			for(var i = 0; i < data.length; i++)
			{	
				data_val 	= data[i].json_field;
				client_name = data[i].client_name;
				let json_field 	= $.fn.get_json_string(data[i].json_field);
				client_contract += `<option value="${data[i].id}">${client_name}</option>`; 
				row += `<div class="col-md-2 client-block-container" id="client-container-${data[i].id}" style="box-shadow: 0 2px 4px 0 rgb(0 0 0 / 10%);width:25%;padding:6px;">
						<div class="client-block">
							<div class="client-heading">
								<input type='hidden' value='${data[i].id}' class='txt_client_id'>
								<input type='hidden' value='${data_val}' class='client_data'>
								<div class="client-title pull-left">${client_name}</div>
								<div class="pull-right remove-client"><i class="mdi mdi-delete customized" aria-hidden="true" title="Delete file"></i></div>
							</div>
							<div class="client-body">
								<div class="text-center"></div>
								<small style="margin-top: 7px;"><span class="fa fa-calendar fa-fw"></span> ${json_field.billing_start_date} - ${json_field.billing_end_date}</small>
							</div>
						</div>
					</div>`;
			}
			$('#clients_list_block').append(row);
			$("#dd_client_contract").append(client_contract);
			//$('#dd_client_contract').multiselect( 'reload' );
		}
	}
	catch(err)
	{
		$.fn.log_error(arguments.callee.caller,err.message);
	}
};

$.fn.populate_client_detail = function(element_id)
{
    try
    {	
		$('.client-block').removeClass('active');
		element_id.addClass('active');

		$('#btn_client_add').html('<i class="fa fa-edit fa-fw" aria-hidden="true"></i><span class="hidden-xs">Update</span>');

		let data = element_id.find('.client_data').val();
		data = $.fn.get_json_string(data);

		let client_id = element_id.find('.txt_client_id').val();
		$('#txt_client_id').val(client_id);
		$('#dd_client').val(data.client_id).change();
		$('#txt_hiring_manager_name').val(decodeURIComponent(data.hiring_manager_name));
		$('#txt_hiring_manager_telno').val(decodeURIComponent(data.hiring_manager_telno));
		$('#txt_hiring_manager_email').val(decodeURIComponent(data.hiring_manager_email));
		$('#txt_client_invoice_contact_person').val(decodeURIComponent(data.client_invoice_contact_person));
		$('#txt_client_invoice_address_to').val(decodeURIComponent(data.client_invoice_address_to));
		$('#dd_client_country').val(data.client_country_id).change();
		$('#txt_client_location').val(decodeURIComponent(data.client_location));
		$('#dd_working_days').val(data.working_days).change();
		$('#txt_overtime_rate').val(decodeURIComponent(data.overtime_rate));
		$('#txt_annual_leave_by_client').val(decodeURIComponent(data.annual_leave_by_client));
		$('#txt_medical_leave_by_client').val(decodeURIComponent(data.medical_leave_by_client));
		$('#dd_billing_currency').val(data.billing_currency_id).change();
		$('#dd_billing_type').val(data.billing_type_id).change();
		$('#dd_billing_cycle').val(data.billing_cycle_id).change();
		$('#billing_start_date').val(data.billing_start_date);
		$('#billing_end_date').val(data.billing_end_date);
		$('#txt_billing_amount').val(decodeURIComponent(data.billing_amount));
		$('#txt_billing_amount_with_gst').val(decodeURIComponent(data.billing_amount_with_gst));
		$('#txt_one_time_fees').val(decodeURIComponent(data.one_time_fees));
		$('#txt_fee_descr').val(decodeURIComponent(data.fee_descr));
		$('#txt_total_contract_value').val(decodeURIComponent(data.total_contract_value));
		
		
	}	
	catch(err)
	{
		$.fn.log_error(arguments.callee.caller,err.message);
	}
};

$.fn.remove_client = function(element)
{
    try
    {	
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
					element.parents('.client-block-container').remove();
					let client_id = element.parents('.client-block-container').find('.txt_client_id').val();
					DELETE_CLIENTS.push(client_id);

					$.fn.save_edit_form();
                }
            }
        });
	}	
	catch(err)
	{
		$.fn.log_error(arguments.callee.caller,err.message);
	}
};


$.fn.save_edit_client_form = function()
{	
	try
	{	
		if($('#client_form').parsley( 'validate' ) == false)
		{
			return;
		}

		let data	= 
		{
			id									: $('#txt_client_id').val(),
			client_id							: $('#dd_client').val(),
			hiring_manager_name					: encodeURIComponent($('#txt_hiring_manager_name').val()),
			hiring_manager_telno				: encodeURIComponent($('#txt_hiring_manager_telno').val()),
			hiring_manager_email				: encodeURIComponent($('#txt_hiring_manager_email').val()),
			client_invoice_contact_person		: encodeURIComponent($('#txt_client_invoice_contact_person').val()),
			client_invoice_address_to			: encodeURIComponent($('#txt_client_invoice_address_to').val()),
			client_country_id					: $('#dd_client_country').val(),
			client_location						: encodeURIComponent($('#txt_client_location').val()),
			working_days						: $('#dd_working_days').val(),
			overtime_rate						: encodeURIComponent($('#txt_overtime_rate').val()),
			annual_leave_by_client				: encodeURIComponent($('#txt_annual_leave_by_client').val()),
			medical_leave_by_client				: encodeURIComponent($('#txt_medical_leave_by_client').val()),
			billing_currency_id					: $('#dd_billing_currency').val(),
			billing_type_id						: $('#dd_billing_type').val(),
			billing_cycle_id					: $('#dd_billing_cycle').val(),
			billing_start_date					: $('#billing_start_date').val(),
			billing_end_date					: $('#billing_end_date').val(),
			billing_amount						: encodeURIComponent($('#txt_billing_amount').val()),
			billing_amount_with_gst				: encodeURIComponent($('#txt_billing_amount_with_gst').val()),
			one_time_fees						: encodeURIComponent($('#txt_one_time_fees').val()),
			fee_descr							: encodeURIComponent($('#txt_fee_descr').val()),
			total_contract_value				: encodeURIComponent($('#txt_total_contract_value').val()),
		};

		let client = $("#dd_client option:selected").text();
		
		let client_id = $("#txt_client_id").val();
		
		let data_json = JSON.stringify(data);
		let row = `<div class="col-md-2 client-block-container">
						<a class="client-block" href="#">
							<div class="client-heading">
								<input type='hidden' value='${client_id}' class='txt_client_id'>
								<input type='hidden' value=${data_json} class='client_data'>
								<div class="client-title pull-left">${client}</div>
								<div class="pull-right remove-client"><button class="btn btn-danger btn-xs"><i class="fas fa-trash-alt"></i></button></div>
							</div>
							<div class="client-body">
								<div class="text-center"></div>
								<small style="margin-top: 7px;"><span class="fa fa-calendar fa-fw"></span> ${data.billing_start_date} - ${data.billing_end_date}</small>
							</div>
						</a>
					</div>`;
		if(client_id)
		{
			$.fn.reset_form('client_form');
			$(`#client-container-${client_id}`).replaceWith(row);
		}
		else
		{	
			$('#clients_list_block').append(row);
		}
		$.fn.save_edit_form();
	}
	catch(err)
	{
		$.fn.log_error(arguments.callee.caller,err.message);
	}
};

$.fn.add_attachment_data = function()
{
	try
	{
		var data	= 
		{
			id			: CONTRACT_ID,
			emp_id 		: SESSIONS_DATA.emp_id,
			attachment	: []
		}
		
		let attach_inputs = $(".attachment_doc");
		for(let i = 0; i < attach_inputs.length;i++)
		{
			if($(attach_inputs[i]).val() != '')
			{
				data.attachment.push(JSON.parse($(attach_inputs[i]).attr('data')));
			}
		}
		
		$.fn.write_data
		(
			$.fn.generate_parameter('add_edit_attachments', data),	
			function(return_data)
			{
				if(return_data.data)
				{
					$.fn.perform_upload();
					$.fn.show_right_success_noty('Data has been recorded successfully');
				}
			},false, btn_save
		);
	}
	catch(err)
	{
		$.fn.log_error(arguments.callee.caller,err.message);
	}
}

$.fn.perform_upload = function()
{
	$.fn.upload_contract_file(function() 
	{
	});
}

$.fn.create_emp_data = function()
{
	try
	{	
		if($('#onboard_date').val() == '')
		{
			$.fn.show_right_error_noty('Please provide onboard date');
			btn_onboard_save.stop();
			return;
		}
						
		var data	= 
		{
			contract_no 	: CONTRACT_ID,
			onboard_date 	: $('#onboard_date').val(),
			emp_id 			: SESSIONS_DATA.emp_id
	 	};
										
	 	$.fn.write_data
		(
			$.fn.generate_parameter('create_emp_data_from_contract', data),	
			function(return_data)
			{
				if(return_data.data)
				{
					$.fn.show_right_success_noty('Data has been recorded successfully');
					$('#btn_onboard_save').hide();
				}
				
			},false, btn_onboard_save
		);
	}
	catch(err)
	{
		$.fn.log_error(arguments.callee.caller,err.message);
	}
};

$.fn.get_list = function(is_scroll)
{
	try
	{
		let status_search = [""];
		if($('#dd_stage_status_search').val() != null)
		{
			status_search = $('#dd_stage_status_search').val();
		}
		
		var data	= 
		{
			candidate_name	: $('#txt_name_search')	.val(),
			status_id 		: $('#dd_status_search').val(),
			email 			: $('#txt_email_search').val(),
			created_by 		: $('#dd_created_by_search').val(),
			cont_status 	: status_search.toString(),
			po_no   		: $('#txt_pono_search').val(),	
			view_all		: MODULE_ACCESS.viewall, // SESSIONS_DATA.allow_contract_view_all,
			start_index		: RECORD_INDEX,
			limit			: LIST_PAGE_LIMIT,			
			is_admin		: SESSIONS_DATA.is_admin,		
			emp_id			: SESSIONS_DATA.emp_id
	 	};
	 	
	 	if(is_scroll)
	 	{
	 		data.start_index =  RECORD_INDEX;
	 	}
		
		 $.fn.fetch_data(
            $.fn.generate_parameter('get_contract_list', data),
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
	 	
	 	// $.fn.fetch_data_for_table
		// (
		// 	$.fn.generate_parameter('get_contract_list',data),
		// 	$.fn.populate_list_form,is_scroll,'tbl_list'
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
		
		if (data.list.length > 0) // check if there is any data, precaution
		{
			let row			 	= '';
			let data_val 	 	= '';
			let status		 	= '';
			let prev_approval	= '';
			if(data.rec_index)
			{
				RECORD_INDEX = data.rec_index;
			}
			data = data.list;
			
			let access_level			= SESSIONS_DATA.access_level;
			let allow_contract_approve	= MODULE_ACCESS.approve;
			
			for(var i = 0; i < data.length; i++)
			{
				status 			= '';
				prev_approval 	= 'true';
				data_val 		= escape(JSON.stringify(data[i])); //.replace(/'/,"");
				row 			+= '<tr id="TR_ROW_' + i + '"  data-value=\'' + data_val + '\'>' +
									'<td>' + data[i].employee_name	+ '</td>' + 
									'<td>' + data[i].email	+ '</td>' + 
									'<td>' + data[i].created_by	+ '</td>' + 
									'<td>' + data[i].designation	+ '</td>' + 
									'<td>' + data[i].status	+ '</td>';
								
				
				//SESSIONS_DATA.emp_id
				// if(access_level == 57 || allow_contract_approve == 1)
				// {
				// 	row += '<td><input type="checkbox" id="chk_is_approve" name="chk_is_approve" data-value=\'' + data_val + '\' onchange="$.fn.do_approve(unescape($(this).attr(\'data-value\')),$(this).is(\':checked\'),\'SALES_HEAD\')"> Approve</td>';
				// }
				// else
				// {
				// 	row += '<td>-</td>';
				// }
				
				
				row += '<td width="15%">';
				// row += `<a class="tooltips" data-toggle="tooltip" data-placement="left" title="View Summary" href="javascript:void(0)" data-value=\'' + data_val + '\' onclick="$.fn.view_contract_summary(${data[i].contract_no})"><i class="fa fa-list"></i></a>`;

				row += `<button type="button" class="btn btn-outline-success btn-xs waves-effect waves-light" data-bs-toggle="tooltip" data-bs-placement="top" title="View Summary" data-value="${data_val}" onclick="$.fn.view_contract_summary(decodeURIComponent('${data[i].contract_no}'))">
                            <i class="mdi mdi-border-all"></i>
                        </button>&nbsp;`;
				
				if(parseInt(MODULE_ACCESS.revoke_approval) == 1)
				{
					//row += '&nbsp;&nbsp;<a class="tooltips" data-toggle="tooltip" data-placement="right" title="Revoke Approval" href="javascript:void(0)" onclick="$.fn.display_revoke_approval(unescape($(this).closest(\'tr\').attr(\'data-value\')))"><i class="fa fa-undo"></i></a>';
				}
					
				// row += `&nbsp;&nbsp;<a class="tooltips" data-toggle="tooltip" data-placement="left" title="View Comments" href="javascript:void(0)" data-value=\'' + data_val + '\' onclick="$.fn.view_remark(${data[i].contract_no})"><i class="fa fa-external-link"></i></a>`;

				row += `<button type="button" class="btn btn-outline-success btn-xs waves-effect waves-light" data-bs-toggle="tooltip" data-bs-placement="top" title="View Comments" data-value="${data_val}" onclick="$.fn.view_remark(decodeURIComponent('${data[i].contract_no}'))">
                            <i class="far fa-comment-alt"></i>
                        </button>&nbsp;`;

				// row += `&nbsp;&nbsp;<a class="tooltips" data-toggle="tooltip" data-placement="left" title="View Details" href="javascript:void(0)" data-value=\'' + data_val + '\' onclick="$.fn.populate_detail_form(${data[i].contract_no})"><i class="fa fa-sign-in"></i></a>`;
				
				row += `<button type="button" class="btn btn-outline-success btn-xs waves-effect waves-light" data-bs-toggle="tooltip" data-bs-placement="top" title="View Details" data-value="${data_val}" onclick="$.fn.populate_detail_form(decodeURIComponent('${data[i].contract_no}'))">
                            <i class="fas fa-sign-in-alt"></i>
                        </button>`;

				row += '</td>';
				
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

$.fn.populate_increment_list_form = function(data)
{
	try
	{	
		if (data) // check if there is any data, precaution 
		{
			$("#tbl_increment tbody").find("tr:not('#base_row_increment')").remove();
			
			let row			 = '';
			let data_val 	 = '';
			let basic_salary = parseFloat($('#txt_salary').val());
			for(var i = 0; i < data.length; i++)
			{
				data_val = JSON.stringify(data[i]); //.replace(/'/,"");
					
				row += '<tr>' +
							'<td>' + data[i].description					+ '</td>' +
							'<td>' + parseFloat(data[i].amount).toFixed(2) 	+ '</td>' +
							'<td>' + data[i].increment_date					+ '</td>' + 
							'<td>' +
								'<button type="button" class="btn btn-primary rotate-45 btn_increment"' +
									'onClick="$.fn.delete_increment(this);"' +
									' data=\'' + data_val + '\'>' +
									'<i class="fa fa-plus fa-fw" aria-hidden="true"></i>' +
								'</button>' +
	                        '</td>' + 
					  '</tr>';

				basic_salary += parseFloat(data[i].amount);
			}
			$('#base_row_increment').before(row);
			$('#txt_salary_after_increment').val(basic_salary.toFixed(2));
		}
	}
	catch(err)
	{
		$.fn.log_error(arguments.callee.caller,err.message);
	}
};

$.fn.delete_increment = function(obj)
{
	try
	{
		let data 			= JSON.parse($(obj).attr('data'));
		data.active_status 	= 0;
		$(obj).attr('data',JSON.stringify(data));
		$(obj).closest('tr').hide('slow');
	}
	catch(err)
	{
		$.fn.log_error(arguments.callee.caller,err.message);
	}
}

$.fn.add_increment = function()
{
	try
	{	
		if($('#txt_inc_description').val() == '' || $('#txt_inc_amount').val() == '' || $('#txt_inc_date').val() == '')
		{
			return false;
		}

		let data = JSON.stringify({"id" : 0,"description" : $('#txt_inc_description').val(),"amount" : parseFloat($('#txt_inc_amount').val()).toFixed(2),"increment_date" : $('#txt_inc_date').val(),"active_status" : 1});
		let row = '<tr>' +
						'<td>' + $('#txt_inc_description').val()			+ '</td>' +
						'<td>' + parseFloat($('#txt_inc_amount').val()).toFixed(2) 		+ '</td>' +
						'<td>' + $('#txt_inc_date').val()			+ '</td>' + 
						'<td>' +
							'<button type="button" class="btn btn-primary rotate-45 btn_increment"' +
								'onClick="$(this).closest(\'tr\').hide(\'slow\', function(){$(this).closest(\'tr\').remove();});"' +
								' data=\'' + data + '\'>' +
								'<i class="fa fa-plus fa-fw" aria-hidden="true"></i>' +
							'</button>' +
                        '</td>' + 
				  '</tr>';
		
		$.fn.reset_form('increment_form');
		$('#base_row_increment').before(row);
	}
	catch(err)
	{
		$.fn.log_error(arguments.callee.caller,err.message);
	}
};


$.fn.populate_allowance_list_form = function(data)
{
	try
	{	
		if (data) // check if there is any data, precaution 
		{
			$("#tbl_allowance tbody").find("tr:not('#base_row')").remove();
			
			let row			= '';
			let data_val 	= '';
			for(var i = 0; i < data.length; i++)
			{
				data_val = JSON.stringify(data[i]); //.replace(/'/,"");
					
				row += '<tr>' +
							'<td>' + data[i].allowance_type					+ '</td>' + 
							'<td>' + parseFloat(data[i].amount).toFixed(2) 	+ '</td>' +
							'<td>' +
								'<button type="button" class="btn btn-primary rotate-45 btn_allowance"' +
									'onClick="$.fn.delete_allowance(this);"' +
									' data=\'' + data_val + '\'>' +
									'<i class="fa fa-plus fa-fw" aria-hidden="true"></i>' +
								'</button>' +
	                        '</td>' + 
					  '</tr>';
			}
			$('#base_row').before(row);
		}
	}
	catch(err)
	{
		$.fn.log_error(arguments.callee.caller,err.message);
	}
};

$.fn.delete_allowance = function(obj)
{
	try
	{
		let data 			= JSON.parse($(obj).attr('data'));
		data.active_status 	= 0;
		$(obj).attr('data',JSON.stringify(data));
		$(obj).closest('tr').hide('slow');
	}
	catch(err)
	{
		$.fn.log_error(arguments.callee.caller,err.message);
	}
}

$.fn.add_allowance = function()
{
	try
	{	
		if($('#dd_td_allowance').val() == '' || $('#txt_td_amount').val() == '')
		{
			return false;
		}

		let data = JSON.stringify({"id" : 0, "type_id" : $('#dd_td_allowance').val(),"amount" : parseFloat($('#txt_td_amount').val()).toFixed(2),"active_status" : 1});
		let row = '<tr>' +
						'<td>' + $('#dd_td_allowance option:selected').text()			+ '</td>' + 
						'<td>' + parseFloat($('#txt_td_amount').val()).toFixed(2) 		+ '</td>' +
						'<td>' +
							'<button type="button" class="btn btn-primary rotate-45 btn_allowance"' +
								'onClick="$(this).closest(\'tr\').hide(\'slow\', function(){$(this).closest(\'tr\').remove();});"' +
								' data=\'' + data + '\'>' +
								'<i class="fa fa-plus fa-fw" aria-hidden="true"></i>' +
							'</button>' +
                        '</td>' + 
				  '</tr>';
		
		$.fn.reset_form('allowance_form');
		$('#base_row').before(row);
	}
	catch(err)
	{
		$.fn.log_error(arguments.callee.caller,err.message);
	}
};

$.fn.populate_dependent_list_form = function(data)
{
	try
	{	
		if (data) // check if there is any data, precaution 
		{
			$("#tbl_dependent tbody").find("tr:not('#base_row_dependent')").remove();
			
			let row			= '';
			let data_val 	= '';
			for(var i = 0; i < data.length; i++)
			{
				data_val = JSON.stringify(data[i]); //.replace(/'/,"");
					
				row += `<tr>
							<td>${data[i].dependent_type}</td>
							<td>${data[i].quantity}</td>
							<td>${parseFloat(data[i].amount).toFixed(2)}</td>
							<td>
								<button type="button" class="btn btn-primary rotate-45 btn_dependent"
									onClick="$.fn.delete_allowance(this);"
									data='${data_val}'>
									<i class="fa fa-plus fa-fw" aria-hidden="true"></i>
								</button>
	                        </td>
					  </tr>`;
			}
			$('#base_row_dependent').before(row);
		}
	}
	catch(err)
	{
		$.fn.log_error(arguments.callee.caller,err.message);
	}
};

$.fn.delete_dependent = function(obj)
{
	try
	{
		let data 			= JSON.parse($(obj).attr('data'));
		data.active_status 	= 0;
		$(obj).attr('data',JSON.stringify(data));
		$(obj).closest('tr').hide('slow');
	}
	catch(err)
	{
		$.fn.log_error(arguments.callee.caller,err.message);
	}
}

$.fn.add_dependent = function()
{
	try
	{	
		if($('#dd_td_dependent').val() == '' || $('#txt_td_dependent_amount').val() == '')
		{
			return false;
		}

		let data = JSON.stringify({ "id" 			: 0,
									"type_id" 		: $('#dd_td_dependent').val(),
									"quantity" 		: $('#dd_dp_qty').val(),
									"amount" 		: isNaN(parseFloat($('#txt_td_dependent_amount').val())) ? '' : parseFloat($('#txt_td_dependent_amount').val()).toFixed(2),
									"active_status" : 1});
		
		let row = `<tr>
						<td>${$('#dd_td_dependent option:selected').text()}</td> 
						<td>${$('#dd_dp_qty').val()}</td>
						<td>${isNaN(parseFloat($('#txt_td_dependent_amount').val())) ? '' : parseFloat($('#txt_td_dependent_amount').val()).toFixed(2)}</td>
						<td>
							<button type="button" class="btn btn-primary rotate-45 btn_dependent"
								onClick="$(this).closest('tr').hide('slow', function(){$(this).closest(tr).remove();});"
								 data='${data}'>
								<i class="fa fa-plus fa-fw" aria-hidden="true"></i>
							</button>
                        </td> 
				  </tr>`;
		
		$.fn.reset_form('dependent_form');
		$('#base_row_dependent').before(row);
	}
	catch(err)
	{
		$.fn.log_error(arguments.callee.caller,err.message);
	}
};


$.fn.populate_reference_list_form = function(data)
{
	try
	{	
		if (data) // check if there is any data, precaution 
		{	
			$("#table_ref_list").empty();
			
			let row			= '';
			let data_json 	= '';
			for(var i = 0; i < data.length; i++)
			{
				data_json = JSON.stringify(data[i]);
				row       +=  `<tr>
									<td class='td-shrink'>
										<a onclick='$.fn.delete_reference($(this));' data='${data_json}'>
										<i class="mdi mdi-delete customized" aria-hidden="true"></i>
										</a>
										<input type='hidden' value='${data_json}' class='ref_data'>
									</td>
									<td>${data[i].name}</td>
									<td>${data[i].contact_no}</td>
									<td>${data[i].email}</td>
									<td>${data[i].company_name}</td>
									<td>${data[i].designation}</td>
									<td>${data[i].relationship}</td>
									<td>${data[i].remarks}</td>
								</tr>`;
		
			}
			$('#table_ref_list').append(row);
		}
	}
	catch(err)
	{
		$.fn.log_error(arguments.callee.caller,err.message);
	}
};

$.fn.delete_reference = function(obj)
{
	try
	{	
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
					let data 			= JSON.parse($(obj).attr('data'));
					data.active_status 	= 0;
					$(obj).attr('data',JSON.stringify(data));
					$(obj).closest('tr').hide('slow');

					if(data.id != undefined)
					{
						DELETE_REFERENCES.push(data.id);
						$.fn.save_edit_form();
					}
				}
            }
        });
	}
	catch(err)
	{
		$.fn.log_error(arguments.callee.caller,err.message);
	}
}

$.fn.view_reference_remark = function(obj)
{
	try
    {
		let data 			= JSON.parse($($(obj)).closest('tr').find('button').attr('data'));
//		let data = JSON.parse($(obj).attr('data'));
		$('#txt_reference_remark')	.val(data.remarks);
//		$('#reference_row_id')		.val($(obj));
		REF_ROW 					= $(obj);
		
		$('#reference_remark_modal').modal();
    }
    catch(err)
    {
        $.fn.log_error(arguments.callee.caller,err.message);
    }

}

$.fn.add_reference = function()
{
	try
	{
		if($('#reference_form').parsley( 'validate' ) == false)
		{
			return;
		}

		let data	= 
		{
			name							: $('#txt_ref_name').val(),
			contact_no						: $('#txt_ref_contact_no').val(),
			email							: $('#txt_ref_email').val(),
			company_name					: $('#txt_ref_company').val(),
			designation						: $('#txt_ref_designation').val(),
			relationship_id					: $('#dd_ref_relationship').val(),
			relationship					: $('#dd_ref_relationship option:selected').text(),
			remarks							: $('#txt_ref_remarks').val(),
			active_status					: 1,
		};
		let data_json = JSON.stringify(data);
		let row     =  `<tr>
							<td>
								<a onclick='$.fn.delete_reference($(this));' data='${data_json}'>
								  <i class="mdi mdi-delete customized" aria-hidden="true"></i>
								</a>
								<input type='hidden' value='${data_json}' class='ref_data'>
							</td>
							<td>${data.name}</td>
							<td>${data.contact_no}</td>
							<td>${data.email}</td>
							<td>${data.company_name}</td>
							<td>${data.designation}</td>
							<td>${data.relationship}</td>
							<td>${data.remarks}</td>
						</tr>`;
		$.fn.reset_form('reference_form');
		$('#table_ref_list').append(row);

		$.fn.save_edit_form();
	}
	catch(err)
	{
		$.fn.log_error(arguments.callee.caller,err.message);
	}
};



$.fn.show_hide_form = function(form_status)
{
	// $.fn.reset_form('form');
    if(form_status == 'NEW')
    {	
		$.fn.reset_form('form');
		$.fn.reset_form('employment_form');
		$('#contract-tab, #clients-tab, #ref-tab, #attach-tab, #enquiry-tab').hide();
		$('#enquiry_li')	.hide();
        $('#list_div')		.hide(400);
        $('#new_div')		.show(400);
        $('#h4_primary_no')	.text('Contract Number : -');
        $('#btn_save')		.html('<i class="fa fa-check"> </i> Save');

        // $('#div_trail_logs table tbody').empty();
        // $('#div_trail_logs').hide();

        $('#detail_form').parsley().destroy();
		$.fn.init_upload_file();
		
		$.fn.set_validation_form();
    }
    else if(form_status == 'EDIT')
    {	
		$.fn.reset_form('form');
		$.fn.reset_form('employment_form');
		$.fn.reset_form('client_form');
		$.fn.reset_form('reference_form');
		$('#contract-tab, #clients-tab, #ref-tab, #attach-tab, #enquiry-tab').show();
    	$('#enquiry_li')	.show();
        $('#list_div')		.hide(400);   
        $('#new_div')		.show(400);

        // $('#div_trail_logs table tbody').empty();
        // $('#div_trail_logs').hide();
        
        $.fn.set_edit_form();
		$.fn.init_upload_file();
		// $.fn.reset_form('allowance_form');
		// $.fn.reset_form('dependent_form');
		// $.fn.reset_form('reference_form');
    }
    else if(form_status == 'BACK')
    {	
        $('#list_div')		.show(400);
        $('#new_div')		.hide(400);
        
    }
	else if(form_status == 'INFO')
    {
        $('#list_div')		.hide(400);
        $('#info_div')		.show(400);
        
    }
	else if(form_status == 'INFO_BACK')
    {
        $('#list_div')		.show(400);
        $('#info_div')		.hide(400);
    }
    
    if(MODULE_ACCESS.create == 0)
	{
    	 $('#btn_onboard_save').hide()
    	 $('#btn_new')		.hide();
    	 $('#btn_save')		.hide();
    	 $('#btn_cancel')	.hide();
	}
    else
    {
//    	$('#btn_onboard_save').show()
    	$('#btn_new')		.show();
	   	$('#btn_save')		.show();
	   	$('#btn_cancel')	.show();
    }
};

$.fn.show_hide_components = function(return_data)
{	
	
	let is_all_approved  = 'true';
	let status_id        = return_data.cce_status_id;
	let employee_id      = return_data.employee_id;
	let data             = $.fn.get_json_string(return_data.cce_json_field);
	let approval_status  = data.approval_status;
	$('.send-offer').hide();
	$('#btn_create_employee').hide();
	//check if all employees approved
	if(approval_status)
	{
		$.each(approval_status, function( index, approval ) 
		{
			if(approval.status == 'false')
			{	
				is_all_approved = 'false';
				return false;
			}
		});
	}
	//check if everyone approved and the current stage is approval or offer letter
	if(is_all_approved == 'true' && (status_id == '176' || status_id == '177'))
	{
		$('.send-offer').show();
	}
	else
	{	
		$('.send-offer').hide();
	}
	//enable employment add only if the last employment is closed
	if(status_id == '179' || status_id == null)
	{
		$('#btn_employment_add').removeAttr('disabled');
	}
	else
	{
		$('#btn_employment_add').attr('disabled','disabled');
	}
	
	//enable emp creation based on the conditions
	if(status_id == '179' && (employee_id == null || employee_id == ''))
	{	
		$('#btn_create_employee').show();
	}
	else
	{	
		$('#btn_create_employee').hide();
	}
};

$.fn.show_hide_approval = function(status_id, data, attachment = '')
{	
	$('#dd_approvals_div').hide();
	$('#send_for_approval').hide();
	$('#chk_is_approve').hide();
	$('#approval_stages_div').hide();
	$('#cancel_approval').hide();
	$('#revoke_approval').hide();
	$('#approval_stages_div').empty();
	$('#btn_employment_add').attr('disabled','disabled');

	//show approval dropdown only for draft and in-progress
	if(status_id == '174' || status_id == '175')
    {
		$('#dd_approvals_div').show();
		$('#btn_employment_add').removeAttr('disabled');
	}
	//in progress
    if(status_id == '175')
    {	
		if(attachment.length > 0)
		{	
			$('#send_for_approval').show();
		}

	}//approval stage
	else if(status_id == '176')
    {	
		let status = '';
		let prev_approval 	 = 'true';
		let current_approval = 'false';
		
		$('#send_for_approval').hide();

		$('#approval_stages_div').show();
		
		//display revoke approval if have access
		if(parseInt(MODULE_ACCESS.approve) == 1)
			$('#revoke_approval').show();
		
		//dispaly approval history
		let approval_status = data.approval_status;
		$.each(approval_status, function( index, approval ) 
		{
			if(approval.status == 'false')
			{   
				status += `<i class="fa fa-minus-circle text-warning"> Pending(${approval.by_name})</i><br/>`;
			}
			else if(approval.status == 'true')
			{
				status += `<i class="fa fa-check-circle text-success"> Approved(${approval.by_name})</i><br/>`;
			}
		});

		$('#approval_stages_div').html(status);

		//check previous approval
		$.each(approval_status, function( index, approval ) 
		{
			//save the approval status untill reaches the current id
			if(approval.by_id == SESSIONS_DATA.emp_id)
			{	
				current_approval = approval.status;
				return false;
			}
			else
			{
				prev_approval = approval.status;
			}
		});

		
		
		//enable approval, if already approved
		if(data.approvals)
		{
			let approvals = data.approvals.split(',');
			if($.inArray(SESSIONS_DATA.emp_id, approvals) !== -1 && prev_approval == 'true')
			{	
				if(current_approval == 'true')
				{
					$('#chk_is_approve').hide();
					$('#cancel_approval').show();
				}
				else
				{	
					$('#chk_is_approve').show();
					$('#cancel_approval').hide();
				}
				
			}
			else
			{
				$('#chk_is_approve').hide();
			}
		}
		else
		{
			$('#chk_is_approve').hide();
		}
	}
};

$.fn.get_contract_config = function()
{
	
    try
    {   
        let data    =
        {   
            emp_id   : SESSIONS_DATA.emp_id,
            view_all : MODULE_ACCESS.viewall
        };

        $.fn.fetch_data
		(
			$.fn.generate_parameter('get_contract_config', data),
			function (return_data)
			{
				if (return_data.code == 0)
				{ //console.log(return_data);
					$.fn.populate_file_blocks(return_data.data.file_uploads);
					$.fn.populate_dd_values('dd_approvals', return_data.data.approvals);
					$.fn.populate_onboarding_status(return_data.data.contract_status);
					$.fn.populate_dd_dependent('dd_td_dependent', return_data.data.dependent);

					$.fn.populate_country('dd_client_country', return_data.data.countries);
					$.fn.populate_country('dd_nationality', return_data.data.countries);
					$.fn.populate_country('dd_home_country', return_data.data.countries);

					$.fn.populate_dd('dd_notification_email_to', return_data.data.notification_to);
					$.fn.populate_dd('dd_send_to', return_data.data.sent_to);
					$.fn.populate_dd('dd_td_allowance', return_data.data.allow_bill_type);
					$.fn.populate_dd('dd_employment_category', return_data.data.employment_category);
					$.fn.populate_dd('dd_marital_status', return_data.data.marital_status);
					$.fn.populate_dd('dd_sex', return_data.data.sex);
					$.fn.populate_dd('dd_billing_cycle', return_data.data.billing_cycle);
					$.fn.populate_dd('dd_working_days', return_data.data.working_days);
					$.fn.populate_dd('dd_notice_period', return_data.data.notice_period);
					$.fn.populate_dd('dd_stage_status_search', return_data.data.contract_status, true);

					$.fn.populate_dd('dd_employment_type', return_data.data.emp_type);
					$.fn.populate_dd('dd_employer', return_data.data.employers);
					$.fn.populate_dd('dd_ref_relationship', return_data.data.relationship);
					$.fn.populate_dd('dd_resume_source', return_data.data.sources);

					$.fn.populate_dd('dd_ext_rec', return_data.data.ext_recruiter);
					$.fn.populate_dd('dd_ext_sales', return_data.data.ext_sales);

					$.fn.populate_dd('dd_requestor_name', return_data.data.approvals);
					$.fn.populate_dd('dd_recruiter_name', return_data.data.approvals);
					
					$.fn.populate_dd('cost_currency_id', return_data.data.currency);
					$.fn.populate_dd('dd_billing_currency', return_data.data.currency);
					$.fn.populate_dd('dd_department', return_data.data.dept);

					$.fn.populate_dd('dd_sales_person', return_data.data.approvals);

					$.fn.populate_dd_values('dd_assignee', return_data.data.approvals);
					
					$.fn.populate_dd('dd_general_skills', return_data.data.skills_general, true, false, false);
					$.fn.populate_dd('dd_specific_skills', return_data.data.skills_specific, true, false, false);

					ONBOARDING_COSTS = return_data.data.onboarding_costs;

				}
			}, false, false, false, false
		);
    }
    catch(err)
    {//console.log(err);
        $.fn.log_error(arguments.callee.caller,err.message);
    }
};

$.fn.populate_country = function (obj_id, data, empty_it = true, is_search = false)
{
	try
	{
		if (empty_it)
		{
			$('#' + obj_id).empty();
		}

		if (is_search)
		{
			$('#' + obj_id).append(`<option value="">All</option>`);
		}
		else
		{
			$('#' + obj_id).append(`<option value="">Select</option>`);
		}
		if (data)
		{
			for (let item of data)
			{
				$('#' + obj_id).append(`<option value="${item.id}" data-value="">${decodeURIComponent(unescape(item.descr)).replace(new RegExp("\\+","g"),' ')}</option>`);
			}

		}
		$('#' + obj_id).val('').change();
	}
	catch (err)
	{
		//console.log(err.message);
		 $.fn.log_error(arguments.callee.caller, err.message);
	}
};

$.fn.populate_dd_dependent = function(element_id, dd_data)
{
    try
    {   
        $('#'+element_id).empty();

        $('#'+element_id).append(`<option value="">Please Select</option>`);
        for (let item of dd_data)
        {	
			$('#'+element_id).append(`<option 
									value="${item.id}"
									data-field1="${item.field1}"
									data-field2="${item.field2}"
									>
									${item.descr}
									</option>`);
        }
        $('#'+element_id).val('').change();
    }
    catch(err)
    {
        $.fn.log_error(arguments.callee.caller,err.message);
    }
};

$.fn.populate_onboarding_status = function(data)
{
    try
    {   
		$('#dd_onboarding_status').empty();
		let options = '';
		
		for (let status of data)
		{	
			let disabled = '';
			if(status.id == 176 || status.id == 177 || status.id == 178 || status.id == 212)
			{	
				//disabled = `disabled="disabled"`;
			}
			options += `<option ${disabled} value="${status.id}">${status.descr}</option>`;
		}
		$('#dd_onboarding_status').append(options);
		

    }
    catch(err)
    {
        $.fn.log_error(arguments.callee.caller,err.message);
    }
};

$.fn.populate_approvals = function(data)
{
    try
    {   
		$('#dd_approvals').empty();
		$.each( data, function( department, employees ) 
		{	
			let department_html = `<optgroup label="${department.toUpperCase()}" id="dd_approvals_sales">`;
			for (let employee of employees)
			{	
				department_html += `<option value="${employee.id}">${employee.descr}</option>`;
			}
			department_html += `</optgroup>`;
			$('#dd_approvals').append(department_html);
		});

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
        $('#'+element_id).empty();

		if(element_id == 'dd_created_by_search') {
            $('#'+element_id).append(`<option value="">Please Select</option>`);
        }

		if(element_id == 'dd_created_by_search') {
            for (let item of dd_data.created_by) {
                
                $('#dd_created_by_search').append(`<option 
                                                 data-type="category" 
                                                 value="${item.id}">${item.name}
                                                 </option>`
                                                );
            }
        }

		if(element_id == 'dd_assignee') {
            for (let item of dd_data) {
                
                $('#dd_assignee').append(`<option 
                                                 data-type="category" 
                                                 value="${item.id}">${item.descr}
                                                 </option>`
                                                );
            }
        }
		if(element_id == 'dd_client') {
            for (let item of dd_data.client) {
                
                $('#dd_client').append(`<option 
                                                 data-type="category" 
                                                 value="${item.id}">${item.name}
                                                 </option>`
                                                );
            }
        }
        // if(is_search)
        // {
        //     $('#'+element_id).append(`<option value="">All</option>`);
        // }
        // for (let item of dd_data)
        // {	
        //     $('#'+element_id).append(`<option value="${item.id}">${item.descr}</option>`);
        // }
        // $('#'+element_id).val('').change();
    }
    catch(err)
    {
        $.fn.log_error(arguments.callee.caller,err.message);
    }
};

$.fn.populate_file_blocks = function(data)
{
    try
    {   
		let attachment_block = '';
		
		let send_offer       = `<button class="btn btn-primary send-offer mb-1">
									Send Offer
								</button><br>`;

    	for(let i = 0; i < data.length; i++)
		{	
			/* if(i % 2 != 0)
			{
				attachment_block += `<div class="">`;
			} */
			//attachment_block += `<div class="row">`;
	        attachment_block += `<div class="col-sm-6 doc_upload mb-1" id="${data[i]['name']}">
					                    <div class="dropzone needsclick dz-clickable ${data[i]['is_mandatory'] == 1 ? 'dropzone-mandatory' : 'dropzone-optional'}">
					                      <div class="dz-message needsclick">
					                        <div class="row">
						                        <div class="col-sm-6">
						                        	<button type="button" class="dz-button">${data[i]['descr']}</button><br>
						                        	<span class="note needsclick">(The extensions should be jpeg,jpg,png and pdf)</span>
						                      	</div>
												  <div class="col-sm-6">
													  <div class="pull-right">
													  	${data[i]['descr'] == 'Offer Letter' ? send_offer : ''}
														<button type="submit" class="btn btn-info fileinput-button">
															Browse
															<input id="fileupload_${data[i]['name']}" type="file" name="files[]" >
														</button>
														<button data-name="${data[i]['name']}" class="btn btn-success save_attachment">
															Upload
														</button>
													</div>
						                        </div>
						                    </div>
					                      </div>

					                      <div id="files_${data[i]['name']}" class="files">
                                    	  </div>
					                    </div>
					                </div>`;
			
			/* if(i % 2 != 0)
			{
				attachment_block += `</div>`;
			} */
		}

		$('#attachments-block').html(attachment_block);
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
		// $('#dd_assignee').multiselect
        // ({
        //     columns		: 1,
        //     placeholder	: 'Assign To',
        //     search		: true,
        //     selectAll	: true
		// });

		// $('#dd_client_contract').multiselect
        // ({
        //     columns		: 1,
        //     placeholder	: 'Assign To',
        //     search		: true,
        //     selectAll	: true
		// });
		
    	$.fn.get_contract_config();
    	$.fn.init_upload_file();

    	// $('#contract_date,#request_date,#emp_start_date,#emp_end_date,#billing_start_date,#billing_end_date,#txt_inc_date,#onboard_date,#txt_current_ep_expiry_date,#commencing_date,#txt_apply_ep_on_date,#date_of_birth,#ep_expiry_date,#marriage_date').datepicker({dateFormat: 'dd-M-yy'});

		$('#contract_date,#request_date,#emp_start_date,#emp_end_date,#billing_start_date,#billing_end_date,#txt_inc_date,#onboard_date,#txt_current_ep_expiry_date,#commencing_date,#txt_apply_ep_on_date,#date_of_birth,#ep_expiry_date,#marriage_date').flatpickr({dateFormat: 'd-M-yy'});

        $('.populate').select2();
        $('.tooltips').tooltip();
        
        $.fn.set_validation_form();

        if(MODULE_ACCESS.create == 0)
    	{
        	 $('#btn_new')		.hide();
        	 $('#btn_save')		.hide();
        	 $('#btn_cancel')	.hide();
    	}
        
        $('#dd_stage_status_search').val(JSON.parse("[174,175,176]")).change();
        
        let search_params 	= new URLSearchParams(window.location.search);
        let contract_no			= search_params.get('primary_no');
		
        if(contract_no != null)
        {
			$.fn.navigate_form(contract_no);
		}
		else
		{
			$.fn.get_list();
		}
		
		var elems = Array.prototype.slice.call(document.querySelectorAll('.js-switch'));
		$('.js-switch').each(function() 
		{
		    new Switchery($(this)[0], $(this).data());
		});

		$.fn.change_switchery($('#chk_pono_status'), false);
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

$.fn.navigate_form = function (contract_no)
{
    try
    {
		$.fn.populate_detail_form(contract_no);
	}
    catch (e)
    {
        $.fn.log_error(arguments.callee.caller, e.message);
    }
}

$.fn.set_validation_form = function()
{
	$('#detail_form').parsley
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
	
	$('#reference_form').parsley
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
	
	$('#employment_form').parsley
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
	
	$('#client_form').parsley
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

$.fn.format_cost = function(cost)
{
	if(cost == '')
	{
		return '';
	}
	
	if(isNaN(cost))
		return parseFloat(0).toFixed(2);
	else
		return parseFloat(cost).toFixed(2);
}

$.fn.view_contract_summary = function(contract_no)
{
	try
	{	
		
		$.fn.fetch_data
		(
			$.fn.generate_parameter('get_contract_summary',{contract_no : contract_no}),	
			function(return_data)
			{	
				if(return_data.data.details.emp_start_date == '' && return_data.data.details.emp_end_date == '')
				{
					$.fn.show_right_error_noty('Employment details missing');
					return false;
				}
				if(return_data.data)
				{	
					$.fn.show_hide_form('INFO');

					let details             = return_data.data.details;
					let allowance_data      = return_data.data.allowance;
					let dependent_data      = return_data.data.dependent;
					let increments_data     = return_data.data.increments;
					let contracts_data      = return_data.data.contracts;
					let json_field          = $.fn.get_json_string(details.json_field);
					let increments_duration = 0;
					let increments_duration_total = 0;
					let increments       	= [];
					let monthly_cost        = {};
					let one_time_cost       = {};
					let table_row           = '';
					let increments_row      = '';
					let increments_no       = 1;
					let increments_total    = 0;
					let mc_no       		= 0; 
					let mc_total            = 0;
					let oc_no       		= 0; 
					let oc_total            = 0;
					let total_cost          = 0;
					let total_billing  		= 0;
					let candidate_details   = `
					<div class="row">
						<label for="dob_date" class="col-3 col-form-label">Name:</label>
						<div class="col-4 col-form-label">
						${details.employee_name}
						</div>
					</div>

					<div class="row">
						<label for="dob_date" class="col-3 col-form-label">Designation:</label>
						<div class="col-4 col-form-label">
						${details.designation}
						</div>
					</div>

					<div class="row">
						<label for="dob_date" class="col-3 col-form-label">Email:</label>
						<div class="col-4 col-form-label">
						${details.email}
						</div>
					</div>

					<div class="row">
						<label for="dob_date" class="col-3 col-form-label">Contact No:</label>
						<div class="col-4 col-form-label">
						${details.contact_no}
						</div>
					</div>

					<div class="row">
						<label for="dob_date" class="col-3 col-form-label">Nationality:</label>
						<div class="col-4 col-form-label">
						${details.nationality}
						</div>
					</div>

					`;
					// let candidate_details   = `<dl>
					// 							<dt>Name : </dt>
					// 							<dd>${details.employee_name}</dd>
					// 							<dt>Designation : </dt>
					// 							<dd>${details.designation}</dd>
					// 							<dt>Email : </dt>
					// 							<dd>${details.email}</dd>
					// 							<dt>Contact No : </dt>
					// 							<dd>${details.contact_no}</dd>
					// 							<dt>Nationality : </dt>
					// 							<dd>${details.nationality}</dd>
					// 						</dl>`;


					let employment_details  = `
					<div class="row">
						<label for="dob_date" class="col-3 col-form-label">Category:</label>
						<div class="col-4 col-form-label">
						${details.employment_category}
						</div>
					</div>

					<div class="row">
						<label for="dob_date" class="col-3 col-form-label">Type:</label>
						<div class="col-4 col-form-label">
						${details.employment_type}
						</div>
					</div>

					<div class="row">
						<label for="dob_date" class="col-3 col-form-label">Start Date:</label>
						<div class="col-4 col-form-label">
						${details.emp_start_date}
						</div>
					</div>

					<div class="row">
						<label for="dob_date" class="col-3 col-form-label">End Date:</label>
						<div class="col-4 col-form-label">
						${details.emp_end_date}
						</div>
					</div>

					<div class="row">
						<label for="dob_date" class="col-3 col-form-label">Employer:</label>
						<div class="col-4 col-form-label">
						${details.employer_name}
						</div>
					</div>

					`;

					// let employment_details  = `<dl>
					// 							<dt>Category : </dt>
					// 							<dd>${details.employment_category}</dd>
					// 							<dt>Type : </dt>
					// 							<dd>${details.employment_type}</dd>
					// 							<dt>Start Date : </dt>
					// 							<dd>${details.emp_start_date}</dd>
					// 							<dt>End Date : </dt>
					// 							<dd>${details.emp_end_date}</dd>
					// 							<dt>Employer : </dt>
					// 							<dd>${details.employer_name}</dd>
					// 						</dl>`;

					// calculate monthly cost
					$.each( allowance_data, function(index,allowance)
					{
						monthly_cost[allowance['allowance']] = allowance['amount'];
					});
					monthly_cost['EIS'] 				= json_field.cost.eis;
					monthly_cost['EPF'] 				= json_field.cost.epf;
					monthly_cost['SOCSO'] 				= json_field.cost.socso;
					monthly_cost['HRDF'] 				= json_field.cost.hrdf;
					monthly_cost['Referral'] 			= json_field.additional.referral_amount;
					monthly_cost['External Recruiter'] 	= json_field.additional.ext_rec_amount;
					monthly_cost['External Sales'] 		= json_field.additional.ext_sales_amount;
					
					$.each( dependent_data, function(index,dependent)
					{
						one_time_cost[dependent['dependent']] = dependent['amount'];
					});

					one_time_cost['Flight Ticket'] 				= json_field.cost.flight_ticket_cost;
					one_time_cost['Temporary Accommodation'] 	= json_field.cost.temp_accommodation_cost;
					one_time_cost['Laptop Cost'] 				= json_field.cost.laptop_cost;
					one_time_cost['Notice Period Buyout'] 		= json_field.cost.notice_period_buyout;
					one_time_cost['EP Cost'] 					= json_field.cost.epcost;
					one_time_cost['Overseas Visa Cost'] 		= json_field.cost.overseas_visa_cost;
					one_time_cost['Out Patient Medical Cost'] 	= json_field.cost.outpatient_medical_cost;
					one_time_cost['Medical Insurance'] 			= json_field.cost.medical_insurance_cost;

					one_time_cost['Recruiter Commission'] 		= json_field.cost.recruiter_commission;
					one_time_cost['Mobilization'] 				= json_field.cost.mobilization_cost;
					one_time_cost['Bonus'] 						= json_field.cost.bonus;
					one_time_cost['Other Cost'] 				= json_field.cost.other_cost;
					
					let start_date = new Date(moment(details.emp_start_date).format('MM/DD/YYYY'));
					let end_date   = new Date(moment(details.emp_end_date).format('MM/DD/YYYY'));
					let total_duration   = $.fn.month_diff(start_date,end_date);
					
					$.each( increments_data, function(index,increment)
					{	
						let increment_date = increment['increment_date'];
						increment_date = new Date(moment(increment_date).format('MM/DD/YYYY'));
						
						if(increments_data.length == increments_no)
						{
							increments_duration = $.fn.month_diff(increment_date,end_date);
						}
						else
						{	
							let next_increment  = new Date(moment(increments_data[increments_no]['increment_date']).format('MM/DD/YYYY'));
							increments_duration = $.fn.month_diff(increment_date,next_increment);
						}
						increments_duration_total += increments_duration;
						increments_no++;
						increments_row += `<tr>
											<td>Increment from ${increment['increment_date']}</td>
											<td>${increment['amount']}</td>
											<td>${increments_duration} months</td>
											<td style="text-align: right">${$.fn.format_cost(increments_duration * increment['amount'])}</td>
										</tr>`;
						increments_total += increments_duration * increment['amount']; 
					});
					
					let basic_salary_duration = total_duration - increments_duration_total;
					
					$('#summary_candidate_details').html(candidate_details);
					$('#summary_employment_details').html(employment_details);

					table_row += `<tr>
									<td rowspan="${increments_no}">1</td>
									<td rowspan="${increments_no}">Salary</td>
									<td>Basic Salary</td>
									<td>${details.basic_salary}</td>
									<td>${total_duration} months</td>
									<td style="text-align: right">${$.fn.format_cost(details.basic_salary * total_duration)}</td>
									<td style="text-align: right" rowspan="${increments_no}">${$.fn.format_cost(increments_total + (details.basic_salary * total_duration))}</td>
								</tr>`;
					
					table_row += increments_row;

					$.each( monthly_cost, function(mc_key,mc_value)
					{	
						if(mc_value != '')
						{
							mc_total += parseFloat(total_duration * mc_value);
						}
						mc_no++;
					});
					let mc_index = 1;
					$.each( monthly_cost, function(mc_key,mc_value)
					{	
						if(mc_index == 1)
						{	
							table_row += `<tr>
											<td rowspan="${mc_no}">2</td>
											<td rowspan="${mc_no}">Monthly Cost</td>
											<td>${mc_key}</td>
											<td>${mc_value ? $.fn.format_cost(mc_value) : 0}</td>
											<td>${total_duration} months</td>
											<td style="text-align: right">${$.fn.format_cost(total_duration * mc_value)}</td>
											<td style="text-align: right" rowspan="${mc_no}">${$.fn.format_cost(mc_total)}</td>
										</tr>`;
						}
						else
						{
							table_row += `<tr>
											<td>${mc_key}</td>
											<td>${mc_value ? $.fn.format_cost(mc_value) : 0}</td>
											<td>${total_duration} months</td>
											<td style="text-align: right">${$.fn.format_cost(total_duration * mc_value)}</td>
										</tr>`;
						}
						mc_index++;
					});

					$.each( one_time_cost, function(oc_key,oc_value)
					{	if(oc_value != '')
						{	
							oc_total += parseFloat(oc_value);
						}
						oc_no++;
					});
					let oc_index = 1;
					$.each( one_time_cost, function(oc_key,oc_value)
					{	
						if(oc_index == 1)
						{	
							table_row += `<tr>
											<td rowspan="${oc_no}">3</td>
											<td rowspan="${oc_no}">One Time Cost</td>
											<td>${oc_key}</td>
											<td>${oc_value ? $.fn.format_cost(oc_value) : 0}</td>
											<td>-</td>
											<td style="text-align: right">${$.fn.format_cost(oc_value ? oc_value : 0)}</td>
											<td style="text-align: right" rowspan="${oc_no}">${$.fn.format_cost(oc_total)}</td>
										</tr>`;
						}
						else
						{
							table_row += `<tr>
											<td>${oc_key}</td>
											<td>${oc_value ? $.fn.format_cost(oc_value) : 0}</td>
											<td>-</td>
											<td style="text-align: right">${$.fn.format_cost(oc_value ? oc_value : 0)}</td>
										</tr>`;
						}
						oc_index++;
					});
					
					$('#cost_summary_body').html(table_row);


					//calculate profit
					total_cost  = increments_total + 
								  (details.basic_salary * total_duration) + 
								  mc_total +
								  oc_total;

					$.each( contracts_data, function(index,contract)
					{	
						let billing_start_date = new Date(moment(contract['billing_start_date']).format('MM/DD/YYYY'));
						let billing_end_date = new Date(moment(contract['billing_end_date']).format('MM/DD/YYYY'));
						let billing_duration   = $.fn.month_diff(billing_start_date,billing_end_date);
						total_billing 	      += billing_duration * contract['billing_amount'];
					});
					
					let total_gross_profit    = total_billing - total_cost;
					let gross_profit_percentage = ((parseFloat(total_gross_profit)* 100) / parseFloat(total_billing)).toFixed(2);
					
					$('#total_cost').html($.fn.format_cost(total_cost));
					$('#total_billing').html($.fn.format_cost(total_billing));
					$('#total_gross_profit').html($.fn.format_cost(total_gross_profit));
					$('#total_gross_profit_per_month').html($.fn.format_cost(parseFloat(total_gross_profit) / parseFloat(total_duration)));
					$('#gross_profit_percentage').html(gross_profit_percentage);

					if(total_billing)
						$('#billing_div').show();
					else	
						$('#billing_div').hide();

                }
				
			},true
		);

		// data = JSON.parse(data);
		
		// let allow_billing;
		// let allowance_amount 	= 0;
		// let billing_amount 		= 0;
		// let dependent_amount 	= 0;
		// let allow_div 			= '';
		// let billing_div 		= '';
		// let dependent_div 		= '';
		// let monthly_allowance_amount = 0;
		// let monthly_dependent_amount = 0;
		
		
		// $.fn.fetch_data
		// (
		// 	$.fn.generate_parameter('get_contract_allowance_list',{contract_no : data.contract_no}),	
		// 	function(return_data)
		// 	{
		// 		if(return_data)
		// 		{
		// 			allow_billing = return_data.data;
		// 		}
		// 	},false,false,false,true
		// );
		
		// for(let i = 0; i < allow_billing.length; i++)
		// {
		// 	if(allow_billing[i].category_id == 7)
		// 	{
		// 		allowance_amount += parseFloat(allow_billing[i].amount);
				
		// 		allow_div += '<tr class="tmp">' +
		// 	  					'<td>' + allow_billing[i].allowance_type + '</td>' +
		// 	  					'<td>:</td>' +
		// 	  					'<td>' + parseFloat(allow_billing[i].amount).toFixed(2)  + '</td>' +
		// 	  				'</tr>';
				
		// 	}
		// 	if(allow_billing[i].category_id == 25)
		// 	{
		// 		billing_amount += parseFloat(allow_billing[i].amount);
				
		// 		billing_div += '<tr>' +
		// 						'<td>' + allow_billing[i].allowance_type + '</td>' +
		// 						'<td>:</td>' +
		// 						'<td>' + parseFloat(allow_billing[i].amount).toFixed(2)  + '</td>' +
		// 					'</tr>';
				
		// 	}
		// }
		
		// $.fn.fetch_data
		// (
		// 	$.fn.generate_parameter('get_contract_dependent_list',{contract_no : data.contract_no}),	
		// 	function(return_data)
		// 	{
		// 		if(return_data)
		// 		{
		// 			dependent_list = return_data.data;
		// 		}
		// 	},false,false,false,true
		// );
		
		// $('.dependent_row').remove();
		
		// for(let i = 0; i < dependent_list.length; i++)
		// {
		// 	dependent_amount += parseFloat(dependent_list[i].amount);
            
		// 	monthly_dependent_amount += (parseFloat(dependent_list[i].amount)  / parseFloat(data.billing_of_month));
			
		// 	dependent_div += `<tr class="dependent_row">
		// 						<td>${dependent_list[i].dependent_type}</td>
		// 	  					<td>${parseFloat(dependent_list[i].amount).toFixed(2)}</td>
		// 	  					<td>${dependent_list[i].quantity}</td>
		// 	  					<td>${(parseFloat(dependent_list[i].amount)  / parseFloat(data.billing_of_month)).toFixed(2) }</td>
		// 	  				</tr>`;
		// }
		
		
		// data.duration != null							? data.duration 				= data.duration : data.duration = 0;
		// data.billing_amount != null						? data.billing_amount 			= data.billing_amount : data.billing_amount = 0;
		// data.billing_amount_with_gst != null			? data.billing_amount_with_gst 	= data.billing_amount_with_gst : data.billing_amount_with_gst = 0;
		// data.salary != null								? data.salary 					= data.salary : data.salary = 0;
		// data.basic_salary != null						? data.basic_salary 			= data.basic_salary : data.basic_salary = 0;
		// data.transport_allowance != null				? data.transport_allowance 		= data.transport_allowance : data.transport_allowance = 0;
		// data.handphone_allowance != null				? data.handphone_allowance 		= data.handphone_allowance : data.handphone_allowance = 0;
		// data.other_allowance != null					? data.other_allowance 			= data.other_allowance : data.other_allowance = 0;
		// data.epf != null								? data.epf 						= data.epf : data.epf = 0;
		// data.socso != null								? data.socso 					= data.socso : data.socso = 0;
		// data.eis != null								? data.eis 						= data.eis : data.eis = 0;
		// data.hrdf != null								? data.hrdf 					= data.hrdf : data.hrdf = 0;
		
		
		// data.referred_amount != null					? data.referred_amount 					= parseFloat(data.referred_amount / parseInt(data.duration))  : data.referred_amount = 0;
		// data.amount_paid_to_external_recruiter != null	? data.amount_paid_to_external_recruiter= parseFloat(data.amount_paid_to_external_recruiter  / parseInt(data.duration)) : data.amount_paid_to_external_recruiter = 0;
		// data.amount_paid_to_external_sales != null		? data.amount_paid_to_external_sales 	= parseFloat(data.amount_paid_to_external_sales / parseInt(data.duration)) : data.amount_paid_to_external_sales = 0;
		
		
		
		// data.flight_ticket_cost != null					? data.flight_ticket_cost 		= data.flight_ticket_cost : data.flight_ticket_cost = 0;
		// data.temp_accommodation_cost != null			? data.temp_accommodation_cost 	= data.temp_accommodation_cost : data.temp_accommodation_cost = 0;
		// data.laptop_cost != null						? data.laptop_cost 				= data.laptop_cost : data.laptop_cost = 0;
		// data.notice_period_buyout != null				? data.notice_period_buyout 	= data.notice_period_buyout : data.notice_period_buyout = 0;		
		// data.ep_cost != null							? data.ep_cost 					= data.ep_cost : data.ep_cost = 0;
		// data.dp_cost != null							? data.dp_cost 					= data.dp_cost : data.dp_cost = 0;
		// data.overseas_visa_cost != null					? data.overseas_visa_cost 		= data.overseas_visa_cost : data.overseas_visa_cost = 0;
		// data.outpatient_medical_cost != null			? data.outpatient_medical_cost 	= data.outpatient_medical_cost : data.outpatient_medical_cost = 0;
		// data.medical_insurance_cost != null				? data.medical_insurance_cost 	= data.medical_insurance_cost : data.medical_insurance_cost = 0;
		
		// $('#h4_contract_no')							.html('Contract Number - ' + data.contract_no);
		// $('#div_contract_type')							.html(data.contract_type);
		// $('#div_contract_date')							.html(data.contract_date);
		// $('#div_requestor_name')						.html(data.requestor_name);
		// $('#div_employer')								.html(data.employer_name);
		// $('#div_employee_name')							.html(data.employee_name);
		// $('#div_designation')							.html(data.designation);
		// $('#div_nationality')							.html(data.nationality);
		// $('#div_email')									.html(data.email);
		// $('#div_client')								.html(data.client_name);
		// $('#div_hiring_manager_name')					.html(data.hiring_manager_name);
		// $('#div_hiring_manager_telno')					.html(data.hiring_manager_telno);
		// $('#div_hiring_manager_email')					.html(data.hiring_manager_email);
		// $('#div_client_invoice_contact_person')			.html(data.client_invoice_contact_person);
		// $('#div_client_invoice_address_to')				.html(decodeURIComponent(data.client_invoice_address_to));	
		// $('#div_start_date')							.html(data.start_date);
   		// $('#div_end_date')								.html(data.end_date);
		// $('#div_duration')								.html(data.duration);
		// $('#div_notice_period')							.html(data.notice_period);
		// $('#div_billing_amount')						.html(parseFloat(data.billing_amount).toFixed(2));
   		// $('#div_billing_amount_with_gst')				.html(parseFloat(data.billing_amount_with_gst).toFixed(2));	
		// $('#div_salary')								.html(parseFloat(data.salary).toFixed(2));
		// $('#div_daily_salary')							.html(parseFloat(data.daily_salary).toFixed(2));
		
		// $('#div_daily_salary1').after(allow_div);

		// var total_salary 								= (parseFloat(data.salary) 
		// 												+ parseFloat(allowance_amount)).toFixed(2);
		
		// $('#div_total_salary')							.html('<b>' + total_salary + '</b>');
		// $('#div_epf')									.html(parseFloat(data.epf).toFixed(2));
		// $('#div_socso')									.html(parseFloat(data.socso).toFixed(2));
		// $('#div_eis')									.html(parseFloat(data.eis).toFixed(2));
		// $('#div_hrdf')									.html(parseFloat(data.hrdf).toFixed(2));
		
		// $('#div_referral')								.html(parseFloat(data.referred_amount).toFixed(2) + " (Monthly)");
		// $('#div_ext_recruiter')							.html(parseFloat(data.amount_paid_to_external_recruiter).toFixed(2) + " (Monthly)");
		// $('#div_ext_sales')								.html(parseFloat(data.amount_paid_to_external_sales).toFixed(2) + " (Monthly)");
		
		// $('#div_flight_ticket_cost')					.html(parseFloat(data.flight_ticket_cost).toFixed(2));
		// $('#div_temp_accommodation_cost')				.html(parseFloat(data.temp_accommodation_cost).toFixed(2));
		// $('#div_laptop_cost')							.html(parseFloat(data.laptop_cost).toFixed(2));
		// $('#div_notice_period_buyout')					.html(parseFloat(data.notice_period_buyout).toFixed(2));
		// $('#div_epcost')								.html(parseFloat(data.ep_cost).toFixed(2));
		// $('#div_dpcost')								.html(parseFloat(data.dp_cost).toFixed(2));
		// $('#div_overseas_visa_cost')					.html(parseFloat(data.overseas_visa_cost).toFixed(2));	
		// $('#div_outpatient_medical_cost')				.html(parseFloat(data.outpatient_medical_cost).toFixed(2));
		// $('#div_medical_insurance_cost')				.html(parseFloat(data.medical_insurance_cost).toFixed(2));
		
		// $('#div_flight_ticket_cost_duration')			.html(1);
		// $('#div_temp_accommodation_cost_duration')		.html(1);
		// $('#div_laptop_cost_duration')					.html(1);
		// $('#div_notice_period_buyout_duration')			.html(1);
		// $('#div_epcost_duration')						.html(1);
		// $('#div_dpcost_duration')						.html(1);
		// $('#div_overseas_visa_cost_duration')			.html(1);	
		// $('#div_outpatient_medical_cost_duration')		.html(1);
		// $('#div_medical_insurance_cost_duration')		.html(1);
		
		// var monthly_flight_ticket_cost 					= (parseFloat(data.flight_ticket_cost) 		/ parseFloat(data.billing_of_month)).toFixed(2);
		// var monthly_temp_accommodation_cost 			= (parseFloat(data.temp_accommodation_cost)	/ parseFloat(data.billing_of_month)).toFixed(2);
		// var monthly_laptop_cost 						= (parseFloat(data.laptop_cost)				/ parseFloat(data.billing_of_month)).toFixed(2);
		// var monthly_notice_period_buyout 				= (parseFloat(data.notice_period_buyout)	/ parseFloat(data.billing_of_month)).toFixed(2);
		// var monthly_epcost 								= (parseFloat(data.ep_cost)					/ parseFloat(data.billing_of_month)).toFixed(2);
		// var monthly_dpcost 								= (parseFloat(data.dp_cost)					/ parseFloat(data.billing_of_month)).toFixed(2);
		// var monthly_overseas_visa_cost 					= (parseFloat(data.overseas_visa_cost)		/ parseFloat(data.billing_of_month)).toFixed(2);
		// var monthly_outpatient_medical_cost 			= (parseFloat(data.outpatient_medical_cost)	/ parseFloat(data.billing_of_month)).toFixed(2);
		// var monthly_medical_insurance_cost 				= (parseFloat(data.medical_insurance_cost)	/ parseFloat(data.billing_of_month)).toFixed(2);
		
		
		
		
		// $('#div_monthly_flight_ticket_cost')			.html(monthly_flight_ticket_cost);
		// $('#div_monthly_temp_accommodation_cost')		.html(monthly_temp_accommodation_cost);
		// $('#div_monthly_laptop_cost')					.html(monthly_laptop_cost);
		// $('#div_monthly_notice_period_buyout')			.html(monthly_notice_period_buyout);
		// $('#div_monthly_epcost')						.html(monthly_epcost);
		// $('#div_monthly_dpcost')						.html(monthly_dpcost);
		// $('#div_monthly_overseas_visa_cost')			.html(monthly_overseas_visa_cost);	
		// $('#div_monthly_outpatient_medical_cost')		.html(monthly_outpatient_medical_cost);
		// $('#div_monthly_medical_insurance_cost')		.html(monthly_medical_insurance_cost);
		
		// $('#tbl_summary_cost_body').append(dependent_div);
		// var total_cost_to_company 						= (parseFloat(total_salary) 						+ 
		// 												  parseFloat(data.epf)								+ 
		// 												  parseFloat(data.socso)							+ 
		// 												  parseFloat(data.eis)								+
		// 												  parseFloat(data.hrdf)								+
		// 												  parseFloat(data.referred_amount)					+
		// 												  parseFloat(data.amount_paid_to_external_recruiter)+
		// 												  parseFloat(data.amount_paid_to_external_sales)	+
		// 												  parseFloat(monthly_flight_ticket_cost)			+
		// 												  parseFloat(monthly_temp_accommodation_cost) 		+ 
		// 												  parseFloat(monthly_laptop_cost)					+
		// 												  parseFloat(monthly_notice_period_buyout) 			+ 
		// 												  parseFloat(monthly_epcost)						+
		// 												  parseFloat(monthly_dpcost) 						+ 
		// 												  parseFloat(monthly_overseas_visa_cost) 			+
		// 												  parseFloat(monthly_outpatient_medical_cost)		+ 
		// 												  parseFloat(monthly_medical_insurance_cost) 		+ 
		// 												  parseFloat(monthly_dependent_amount)).toFixed(2);
		
		// var monthly_gross_profit_margin 				= ((parseFloat(data.billing_amount) + parseFloat(billing_amount)) - parseFloat(total_cost_to_company)).toFixed(2);
		// var total_gross_profit							= (parseFloat(monthly_gross_profit_margin) * parseFloat(data.duration)).toFixed(2);
		// var gross_profit_percentage 					= ((parseFloat(monthly_gross_profit_margin)* 100) / parseFloat(data.billing_amount)).toFixed(2);
		// if(isNaN(gross_profit_percentage))
		// {
		// 	gross_profit_percentage = (parseFloat(0)).toFixed(2);
		// }
		
		// $('#div_total_cost_to_company')					.html('<b>'+total_cost_to_company+'</b>');	
		// $('#div_monthly_gross_profit_margin')			.html('<b>'+monthly_gross_profit_margin+'</b>');		
		// $('#div_total_gross_profit')					.html('<b>'+total_gross_profit+'</b>');
		// $('#div_gross_profit_percentage')				.html('<b>'+gross_profit_percentage+' %</b>');
		
		// $('#div_travelling_claim_applicable')			.html(data.travelling_claim_applicable);
		// $('#div_medical_claim_applicable')				.html(data.medical_claim_applicable);
		// $('#div_overtime_claim_applicable')				.html(data.overtime_applicable);
		// $('#div_medical_leave_day_by_client')			.html(data.medical_leave_day_by_client);
		// $('#div_annual_leave_day_by_client')			.html(data.annual_leave_day_by_client);
		// $('#div_replacement_leave_applicable')			.html(data.replacement_leave_applicable);
		
		// var sales_head_status 		= '';
		// var hr_status 				= '';
		// var finance_status 			= '';
		// var ceo_status 				= '';
		// var offer_letter_status 	= '';
		// (data.approved_sales_head == 1) 				? sales_head_status = '<span class="text-success">Approved</span>' : sales_head_status = '<span class="text-danger">Pending...</span>';
		// (data.approved_hr == 1) 						? hr_status = '<span class="text-success">Approved</span>' : hr_status = '<span class="text-danger">Pending...</span>';
		// (data.approved_accounts == 1) 					? finance_status = '<span class="text-success">Approved</span>' : finance_status = '<span class="text-danger">Pending...</span>';
		// (data.approved_ceo == 1) 						? ceo_status = '<span class="text-success">Approved</span>' : ceo_status = '<span class="text-danger">Pending...</span>';
		// (data.issued_offer == 1) 						? offer_letter_status = '<span class="text-success">Issued</span>' : offer_letter_status = '<span class="text-danger">Pending...</span>';
		
		// $('#sales_head_status')							.html(sales_head_status);
		// $('#hr_status')									.html(hr_status);
		// $('#finance_status')							.html(finance_status);
		// $('#ceo_status')								.html(ceo_status);
		// $('#offer_letter_status')						.html(offer_letter_status);
		

		// $.fn.show_hide_form('INFO');
	}
	catch(err)
	{
		$.fn.log_error(arguments.callee.caller,err.message);
	}
};

$.fn.do_approve = function(approval_status)
{
    try
    {	
		$('#ct_no')				.val(CONTRACT_ID);
		$('#approve_or_cancel')	.val(approval_status);
		$('#chk_level')       	.val($('#txt_employment_id').val());
		$('#remarkModal')   	.modal();
		
    }
    catch(err)
    {
        $.fn.log_error(arguments.callee.caller,err.message);
    }
};

$.fn.display_revoke_approval = function(data)
{
    try
    {
		// data = JSON.parse(data);
		let data = CONTRACT_DETAILS.details;
		
        // $('#chk_sales_head_approval')	.prop( "checked", false );
        // $('#chk_hr_approval')			.prop( "checked", false );
        // $('#chk_accounts_approval')		.prop( "checked", false );
        // $('#chk_ceo_approval')			.prop( "checked", false );
        // $('#chk_offer_letter_approval')	.prop( "checked", false );
        
        // if(data.approved_sales_head == 1)
    	// {
        // 	$('#chk_sales_head_approval').prop( "checked", true );
    	// }
        // if(data.approved_hr == 1)
    	// {
        // 	$('#chk_hr_approval').prop( "checked", true );
    	// }
        // if(data.approved_accounts == 1)
    	// {
        // 	$('#chk_accounts_approval').prop( "checked", true );
    	// }
        // if(data.approved_ceo == 1)
    	// {
        // 	$('#chk_ceo_approval').prop( "checked", true );
    	// }
        // if(data.issued_offer == 1)
    	// {
        // 	$('#chk_offer_letter_approval').prop( "checked", true );
		// }
		
		$('#revoke_users').empty();

		let user_li = '';
		var colors = ['item-danger', 'item-primary', 'item-info', 'item-success'];
		let approval_status = $.fn.get_json_string(data.approval_status);
		
		$.each(approval_status, function( index, approval ) 
		{	
			user_li += `<li class="${colors[index]}">
							<label>
								<input type="checkbox" data-employment-id="${data.employment_id}" data-id="${approval.by_id}" class="chk_revoke_approval" id="chk_revoke_approval_${approval.by_id}" ${approval.status == 'true' ? 'checked' : ''}>
								<span class="task-description">${approval.by_name}</span>
							</label>
						</li>`;
		});
		
		$('#revoke_users').html(user_li);
        $('#div_revoke_approval_title').html("Revoke Approval For " + data.employee_name);
		$('#approval_revoke_modal')    .modal();
    }
    catch(err)
    {
        $.fn.log_error(arguments.callee.caller,err.message);
    }
};

$.fn.revoke_approval = function()
{
	try
	{	
		let approvals = [];
		$("#revoke_users li").each(function( index )  
		{	
			let employment_id = $('#txt_employment_id').val();
			let user_id = $(this).find('.chk_revoke_approval').attr('data-id');
			let status = $(this).find('.chk_revoke_approval').is(':checked') ? 'true' : 'false';
			approvals.push({'user_id': user_id, 'employment_id': employment_id, 'status': status});
		});
		
		var data	= 
		{
			contract_no		: CONTRACT_ID,
			emp_id 			: SESSIONS_DATA.emp_id,
			approvals       : encodeURIComponent(JSON.stringify(approvals)),
			// sh				: $('#chk_sales_head_approval')	.is(':checked') ? 1 : 0,
			// hr				: $('#chk_hr_approval')			.is(':checked') ? 1 : 0,
			// acc				: $('#chk_accounts_approval')	.is(':checked') ? 1 : 0,
			// ceo				: $('#chk_ceo_approval')		.is(':checked') ? 1 : 0,
			// io				: $('#chk_offer_letter_approval').is(':checked')? 1 : 0
	 	};
										
	 	$.fn.write_data
		(
			$.fn.generate_parameter('revoke_contract_approval', data),	
			function(return_data)
			{
				if(return_data.data)
				{
					$.fn.populate_detail_form(CONTRACT_ID);
					$.fn.show_right_success_noty('Data has been recorded successfully');
				}
				
			},false, btn_save_revoke_approval
		);
	}
	catch(err)
	{
		$.fn.log_error(arguments.callee.caller,err.message);
	}
};


$.fn.view_remark = function(contract_no)
{
    try
    {
        $.fn.fetch_data
        (
            $.fn.generate_parameter('get_contract_remark',{contract_no	: contract_no}),
            function(return_data)
            {
                if(return_data)
                {
					$.fn.populate_remark_list_form(return_data.data);
                }
            },false,false,false,true
        );
		
		$('#contract_no').val(contract_no);
		
		$("#dd_send_to").select2({
			dropdownParent: $('#remarkListModal .modal-content')
		});

		$('#remarkListModal').modal('show');
    }
    catch(err)
    {
        $.fn.log_error(arguments.callee.caller,err.message);
    }
};

$.fn.cancel_approve = function(data,level)
{
    try
    {
    	bootbox.prompt("Please enter cancelling remarks", function(result) 
        {
            if (result !== null && result !== '') 
            {
		        data = JSON.parse(data);
				$('#ct_no')				.val(data.contract_no);
				$('#ct_remark')			.val(result);
				$('#chk_level')       	.val(level);
				$.fn.add_edit_remark('cancel');
         	} 
         	else
         	{
         		$.fn.show_right_error_noty('Cancel remarks is mandatory');
         	}
        });
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
	   let action = $('#approve_or_cancel').val();	
       if(action == 'approve' || action == 'cancel')
	   {
    	   let result_ref_exist = '';
    	   if(action == 'approve' && $('#chk_level').val() == 'CEO')
		   {
    		   if(($('#chk_ref_overwrite').length == 0 || $('#chk_ref_overwrite').length == 1) && $('#chk_ref_overwrite').is(':checked') != 1)
    		   {
	    		   $.fn.fetch_data
		   		   (
		   				$.fn.generate_parameter('reference_feedback_exist', {contract_no : $('#ct_no').val()}),
		   				function(return_data)
		   				{
		   					result_ref_exist = return_data.data;
		   	
		   				},false, btn_save_remarks, false, true
		   			);
			   
	    		   if(result_ref_exist == false)
				   {
	    			   let ref_check = '<div class="form-group">' +
	                                   '<label class="checkbox-inline">' +
	                                   '<input type="checkbox" id="chk_ref_overwrite" name="chk_ref_overwrite">No reference check remarks found, it is deemed necessary, Do you want to overwrite it?' +
	                                   '</label></div>';
	    			   
	    			   
	    			   $('#div_overwrite_ref').html(ref_check).show('slow');
	    			   return;
				   }
    		   }
		   }
    	   
			var remarks = ($('#ct_remark').val()).trim();
			var contract_no = $('#ct_no').val();
			var data	=
			{
				contract_no			: $('#ct_no')			.val(),
				contract_remarks	: remarks,
				action				: action,
				level 				: $('#chk_level')		.val(),
				user_id 			: SESSIONS_DATA.emp_id,
				user_name			: SESSIONS_DATA.name,
				notify_emp_id		: $('#dd_send_to').val()
			};
	   }
	   if(action == '')
	   {
			var remarks = ($('#contract_remark').val()).trim();
			var contract_no = $('#contract_no').val();
		   	var data	=
			{
				contract_no			: $('#contract_no')			.val(),
				contract_remarks	: remarks,
				action				: '',
				level 				: '',
				user_id				: SESSIONS_DATA.emp_id,
				user_name			: SESSIONS_DATA.name,
				notify_emp_id		: $('#dd_send_to').val()
			};
	   }

	   if(remarks != '')
	   {
			$.fn.write_data
			(
				$.fn.generate_parameter('contract_add_edit_remark', data),
				function(return_data)
				{
					if(return_data.code == '0')
					{   
						$.fn.show_right_success_noty('Data has been recorded successfully');
						if(action == 'approve' || action == 'cancel')
						{
							RECORD_INDEX = 0;
							$.fn.reset_form('remark_modal');
							$.fn.populate_detail_form(contract_no);
						}
						if(action == '')
						{
							$.fn.populate_remark_list_form(return_data.data);
							$.fn.reset_form('remark_list_modal');
						}
					}
	
				},false, btn_save_remarks
			);
			
		}
		else
		{
			$.fn.show_right_error_noty('Remarks is mandatory');
			btn_save_remarks.stop();
		}
	    $('#remarkModal').modal('hide')
    }
    catch(err)
    {
        $.fn.log_error(arguments.callee.caller,err.message);
    }
};


$.fn.populate_remark_list_form = function(data)
{
	try
	{
		if (data) // check if there is any data, precaution 
		{
			var row			    = '';
			var data_val 	    = '';
			$('#tbl_remark_list tbody').html('');

			for(var i = 0; i < data.length; i++)
			{
				data_val = escape(JSON.stringify(data[i]));

				row += `<tr><td><button type="button" class="btn btn-outline-danger btn-xs waves-effect waves-light" data-bs-toggle="tooltip" data-bs-placement="top" title="Delete data" data-value="${data_val}" onclick="$.fn.delete_form(decodeURIComponent('${data_val}'))">
                            <i class="far fa-trash-alt"></i>
                        </button></td>`  +

				// row += '<tr>'+
				// 			'<td><a class="tooltips" href="javascript:void(0)" data-value=\'' + data_val + '\' onclick="$.fn.delete_form(unescape($(this).attr(\'data-value\')))" data-trigger="hover" data-original-title="Delete data "><i class="fa fa-trash-o"/></a></td>' +
							'<td>' + data[i].contract_remarks  	+ '</td>' +
							'<td>' + data[i].created_by		+ '</td>' +							
							'<td>' + data[i].created_date	+ '</td>' +
							'<td>' + data[i].action			+ '</td>';
				row += '</tr>';

			}
			$('#tbl_remark_list tbody').html(row);
			$('.back-to-top-badge').removeClass('back-to-top-badge-visible');
		}
		else
		{
			$('#tbl_remark_list > tbody').empty();
		}
	}
	catch(err)
	{
		$.fn.log_error(arguments.callee.caller,err.message);
	}
};

$.fn.delete_form = function(data)
{
	try
	{
		data = JSON.parse(data);
		if(data.id == '')
		{
			$.fn.show_right_error_noty('Remark ID cannot be empty');
			return;
		}
		
		var data	= 
		{
			id				: data.id,
			contract_no 	: data.contract_no,
			emp_id 			: SESSIONS_DATA.emp_id
	 	};
										
	 	$.fn.write_data
		(
			$.fn.generate_parameter('contract_delete_remark', data),	
			function(return_data)
			{
				if(return_data)
				{
					$('#tbl_remark_list > tbody').empty();
					$.fn.populate_remark_list_form(return_data.data, false);
					$.fn.show_right_success_noty('Data has been deleted successfully');
				}
				
			},false, btn_save
		);
	}
	catch(err)
	{
		$.fn.log_error(arguments.callee.caller,err.message);
	}
};

$.fn.update_contract_status = function()
{
	try
    {
		bootbox.confirm
        ({
            title: "Update Status Confirmation",
            message: "Please confirm before you update, this operation cannot be rolled back.",
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
                	var data	= 
            		{
            			contract_no 	: CONTRACT_ID,
            			status_id 		: $('#dd_status').val(),
            			emp_id 			: SESSIONS_DATA.emp_id
            	 	};
                	var btn_status_update = Ladda.create($('#btn_status_update')[0]);
                	btn_status_update.start();
                    $.fn.write_data
                    (
                        $.fn.generate_parameter('update_contract_status', data),
                        function (return_data)
                        {
                            if (return_data.data)
                            {
                                $.fn.show_right_success_noty('Status has been updated successfully');
                                
                            }

                        }, false,btn_status_update
                    );
                }
            }
        });
    }
    catch(err)
    {
        $.fn.log_error(arguments.callee.caller,err.message);
    }
}

$.fn.populate_comments_form = function (data)
{
    try
    {
    	$.fn.reset_form('comments_form');
    	$.fn.initiate_upload_file();

    	let details  		= data.details;
    	let json_field 		= $.fn.get_json_string(details.json_field);
    	FILE_UPLOAD_PATH    = `${MODULE_ACCESS.module_id}/${CONTRACT_ID}/`;
		
    	if(SESSIONS_DATA.emp_id == Number(details.created_by))
    	{
    		$('#assign_div').show();
    		$('#txt_reply')	.prop('readonly', false);
    		$('#btn_reply')	.prop('disabled', false);
    		$('#div_reply')	.show();
    	}

    	//create assignee drop down and marks the selection
    	// $('#dd_assignee').html('');   					
		// if(data.approvals != null)
		// {	
		// 	let row 		= '';
		// 	let approvals 	= data.approvals;
		// 	for(i = 0; i < approvals.length;i++)
		// 	{
		// 		row 		+= `<option value="${approvals[i].id}">${approvals[i].name}</option>`;
		// 	}
		
		// 	$('#dd_assignee').append(row);
		// }
		
		//$('#dd_assignee').val('').multiselect('reload');
		$('#dd_assignee').val('');
		if(json_field !== false)
		{
			if(json_field.assigned_to_id)
	        {
	        	//$('#dd_assignee')   .val(json_field.assigned_to_id.split(",")).multiselect( 'reload' );
				$('#dd_assignee')   .val(json_field.assigned_to_id.split(",")).change();
	        	//enable comments
	        	let assignees = json_field.assigned_to_id.split(",");
	        	if($.inArray(SESSIONS_DATA.emp_id, assignees) !== -1)
	        	{
	        		$('#txt_reply')	.prop('readonly', false);
	        		$('#btn_reply')	.prop('disabled', false);
	        		$('#div_reply')	.show();
	        	}

	        }
		}

		$.fn.populate_comments_list(data.comments);

    }
	catch(err)
	{ //console.log(err);
		$.fn.log_error(arguments.callee.caller,err.message);
	}
};

$.fn.add_assignee = function()
{
	try
	{
		if($('#dd_assignee').val() == null)
        {
        	$.fn.show_right_error_noty('Please provide assign to');
        	btn_assign_save.stop();
        	return;
        }

        let data =
        {
            contract_no		: CONTRACT_ID,
            assigned_to		: $('#dd_assignee').val().toString(),
            emp_id      	: SESSIONS_DATA.emp_id
        }

        $.fn.write_data
        (
            $.fn.generate_parameter('add_assignee', data),
            function(return_data)
            {
                if (return_data.data)  // NOTE: Success
                {
                    $.fn.show_right_success_noty('Data has been recorded successfully');

                }
            },false,btn_assign_save
        );
		
	}
	catch(err)
	{//console.log(err);
		$.fn.log_error(arguments.callee.caller,err.message);
	}
};

$.fn.initiate_upload_file = function()
{
    $.fn.intialize_fileupload('fileupload_reply','files_reply');
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
    		contract_no	: CONTRACT_ID,
    		comments    : $('#txt_reply').val().replace(/(?:\r\n|\r|\n)/g,'<br/>'),
    		emp_id      : SESSIONS_DATA.emp_id,
			emp_name    : SESSIONS_DATA.name,
        }

        $.fn.write_data
        (
            $.fn.generate_parameter('add_edit_contract_comments', data),
            function(return_data)
            {
				if (return_data.data.details)
					{
						let COMMENT_ID		= return_data.data.details.id;
							let attachment_data =   
							{
								id          	: '',
								primary_id  	: CONTRACT_ID,
								secondary_id	: COMMENT_ID,
								module_id   	: MODULE_ACCESS.module_id,
								filename    	: '',
								filesize    	: "0",
								json_field  	: {},
								emp_id      	: SESSIONS_DATA.emp_id
							};
							
						if ($('#files_reply .file-upload.new').length > 0)
						{
							$.fn.populate_comment_row(return_data.data.details);
							$.fn.upload_file('files_reply','contract_no',CONTRACT_ID,
								attachment_data,function(total_files, total_success,filename, attach_return_data)
							{
								if (total_files == total_success)
								{
									$('#txt_reply').val('');
									$.fn.populate_fileupload(attach_return_data, `comment-`+COMMENT_ID, true);
									btn_comments_reply.stop();
								}
							}, false, btn_save);
						} 
						else
						{	
							$('#txt_reply')     .val('');
							btn_comments_reply.stop();
							$.fn.populate_comment_row(return_data.data.details);
						}
						$.fn.show_right_success_noty('Data has been recorded successfully');
					}
            }
        );
    } 
    catch (e) 
    {
        $.fn.log_error(arguments.callee.caller, e.message);
    }
}

$.fn.get_contract_comments_list = function ()
{
	try
	{	
		$.fn.fetch_data
		(
		    $.fn.generate_parameter('get_contract_comments_list', {contract_no : CONTRACT_ID}),
		    function(return_data)
		    {
		    	if(return_data.data)
				{
		    		$.fn.populate_comments_list(return_data.data);
				}
		    }, false, '', true, true
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
        let photo		= 	CURRENT_PATH + '/assets/img/profile_default.jpg';

        if(row_data.emp_photo)
        {
            photo = SESSIONS_DATA.filepath + 'photos/' + row_data.emp_id  + '/' + row_data.emp_photo;
        }

        let date = moment(row_data.created_date).format(UI_DATE_FORMAT + " h:ma");

        row += `
				<div class="d-flex align-items-start mb-3">
					<div style="margin-right:0.75rem" class="avatar-initials small" width="30" height="30" data-name="${SESSIONS_DATA.name}" ></div>
					<div class="w-100">
						<h5 class="mt-0 mb-2"><a href="contacts-profile.html" class="text-reset">${row_data.name}</a> <small class="text-muted">${date}</small></h5>
						${row_data.descr}
						<div id="${'comment-'+COMMENT_ID}"" class="mt-2"></div>
					</div>
				</div>`;      
        if(is_list)
        {
        	$('#div_reply').append(row);
        	$.fn.populate_fileupload(row_data,'comment-'+COMMENT_ID, true);
        }
        else
        {
        	$('#div_reply').prepend(row);
        }

    }
    catch (e)
    {
        $.fn.log_error(arguments.callee.caller, e.message);
    }
}

$.fn.create_employee_for_contract = function()
{
	try
	{	
		var data	= 
		{
			contract_no		: CONTRACT_ID,
			emp_id 			: SESSIONS_DATA.emp_id
	 	};
										
	 	$.fn.write_data
		(
			$.fn.generate_parameter('create_employee_for_contract', data),	
			function(return_data)
			{
				$.fn.show_right_success_noty('Employee have been created successfully');
				$.fn.populate_detail_form(CONTRACT_ID);
				
			},false, btn_create_employee
		);
	}
	catch(err)
	{
		$.fn.log_error(arguments.callee.caller,err.message);
	}
};

$.fn.send_for_approval = function()
{
	try
	{	
		var data	= 
		{
			contract_no		: CONTRACT_ID,
			employment_id	: $('#txt_employment_id').val(),
			emp_id 			: SESSIONS_DATA.emp_id
	 	};
										
	 	$.fn.write_data
		(
			$.fn.generate_parameter('send_for_approval', data),	
			function(return_data)
			{
				
				$.fn.show_right_success_noty('Contract has been sent for approval');
				
				
			},false, btn_send_for_approval
		);
	}
	catch(err)
	{
		$.fn.log_error(arguments.callee.caller,err.message);
	}
};

$.fn.send_offer = function()
{
	try
	{	
		let attachments = [];
		$("#offer_files li").each(function( index )  
		{	
			if($(this).find('.chk_offer_attach').is(':checked'))
			{
				attachments.push({'id': $(this).find('.chk_offer_attach').attr('data-id')
								, 'filename': $(this).find('.chk_offer_attach').attr('data-filename')});
			}
		});

		var data	= 
		{
			contract_no		: CONTRACT_ID,
			emp_id 			: SESSIONS_DATA.emp_id,
			attachments     : encodeURIComponent(JSON.stringify(attachments)),
	 	};
										
	 	$.fn.write_data
		(
			$.fn.generate_parameter('send_offer_letter', data),	
			function(return_data)
			{
				if(return_data.data)
				{
					$.fn.show_right_success_noty('Offer letter has been sent successfully');
				}
				
			},false, btn_send_offer
		);
	}
	catch(err)
	{
		$.fn.log_error(arguments.callee.caller,err.message);
	}
};

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
			row += '<td><select id="dd_child_sex_' + i + '" style="width:100%" class="populate2">';
			row += '<option value="">Please Select</option>';
			row += '<option value="32">Male</option>';
			row += '<option value="33">Female</option>';
			row += '</select></td>';
			row += '<td><div class="input-group date">';
			row += '<input type="text" id="child_dob_date_' + i + '" class="child_dob_date form-control" data-date-format="DD-MM-YYYY"  data-format="dd-MM-yyyy" placeholder="e.g dd-mm-yyyy">';
			row += '<span class="input-group-addon"><i class="fa fa-calendar"></i></span>';
			row += '</div></td>';
			row += '</tr>';
		}
		$('#tbl_child tbody').append(row);

		// $('.child_dob_date').datepicker({ dateFormat: 'dd-mm-yy' });

		$('.child_dob_date').flatpickr({ 
            altInput: true,
            altFormat: "d-M-Y", //Display in input field
            dateFormat: "Y-m-d", //Value to be set
            defaultDate: "today"
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

$.fn.bind_command_events = function()
{
	$.fn.get_contract_add_request_dropdown();
    try
    {	
		$('#div_user_ref').click(function (event)
		{
			event.preventDefault();
			if ($(this).find(":button").val())
			{
				$.fn.open_page('0&user_id=' + $(this).find(":button").val(), '../users/users.php')
			}
		});
       
    	//Hide common update toolbar for respective tabs
		$('a[data-bs-toggle="tab"]').on('shown.bs.tab', function (e) 
		{
			let target = $(e.target).attr("href") // activated tab
			
			if(target == '#tab-contract' || target == '#tab-clients' || target == '#tab-ref')
			{
				$('#actions_div').hide();
				
			}
			else
			{	
				$('#actions_div').hide();
			}
		});

		$(document).on('change', '#date_of_birth', function(e) 
        {	
			var age = moment().diff(new Date(moment($(this).val()).format('DD-MMM-YYYY')), 'years');
			$('#txt_age').val(age);
		});

		$(document).on('click', '.send-offer', function(e) 
        {   
			e.preventDefault();
			

			if(ATTACHMENTS)
			{	
				let attach_li = '';
				$.each(ATTACHMENTS.offer_letter, function( doc_name, attachment ) 
				{	
					attach_li += `<li class="item-primary">
										<label>
											<input type="checkbox" class="chk_offer_attach" data-filename="${attachment.filename}" data-id="${attachment.id}" id="chk_${attachment.id}">
											<span class="task-description">${attachment.filename}</span>
										</label>
									</li>`;
				});
				$('#offer_files').html(attach_li);

			}
			$('#offer_letter_modal')    .modal();
		});

		$('#btn_create_employee').click( function(e)
        {
            e.preventDefault();
			btn_create_employee = Ladda.create(this);
			btn_create_employee.start(); 
			$.fn.create_employee_for_contract(); 
		});

		$('#send_for_approval').click( function(e)
        {
            e.preventDefault();
			btn_send_for_approval = Ladda.create(this);
			btn_send_for_approval.start(); 
			$.fn.send_for_approval(); 
		});
		
		$('#chk_is_approve').click( function(e)
        {	
			e.preventDefault();
			$.fn.do_approve('approve');
		});

		$('#cancel_approval').click( function(e)
        {	
			e.preventDefault();
			$.fn.do_approve('cancel');
		});

		$('#revoke_approval').click( function(e)
        {	
			e.preventDefault();
			$.fn.display_revoke_approval();
		});

		$('#btn_approve').click( function(e)
        {
            e.preventDefault();
			btn_save_remarks = Ladda.create(this);
	 		btn_save_remarks.start(); 
			$.fn.add_edit_remark();
		});

		$('#btn_send_offer').click( function(e)
        {
            e.preventDefault();
			btn_send_offer = Ladda.create(this);
			btn_send_offer.start(); 
			$.fn.send_offer(); 
			$('#offer_letter_modal').modal('hide');
        });

		$("body").on('DOMSubtreeModified', "#files_po_file", function() 
		{	
			let status = false;
			$("#files_po_file .file-upload").each(function( index ) 
			{
				if($(this).find('.delete').length > 0)
				{
					status = true;
					return false;
				}
			});
			
			if(status)
				$('#send_for_approval').show();
			else
				$('#send_for_approval').hide();
		});

		//employment tab
		$(document).on('click', '.emp-block', function(e) 
        {   
            e.preventDefault();
            $.fn.populate_employment_detail($(this));
		});
		
		$(document).on('click', '.remove-employment', function(e) 
        {   
            e.stopPropagation();
            $.fn.remove_employement($(this));
		});
		
		$('#btn_employment_add').click( function(e)
		{
			e.preventDefault();
			$.fn.save_edit_employment_form();
		});

		$('#btn_employment_reset').click( function(e)
		{
			e.preventDefault();
			$.fn.reset_form('employment_form');
			if(CONTRACT_DETAILS)
			{	
				$.fn.show_hide_components(CONTRACT_DETAILS.details);
			}
		});
		
		//client tab
		$(document).on('click', '.client-block', function(e) 
        {   
            e.preventDefault();
            $.fn.populate_client_detail($(this));
		});
		
		$(document).on('click', '.remove-client', function(e) 
        {   
            e.stopPropagation();
            $.fn.remove_client($(this));
		});

		$('#btn_client_add').click( function(e)
		{
			e.preventDefault();
			$.fn.save_edit_client_form();
		});

		$('#btn_client_reset').click( function(e)
		{
			e.preventDefault();
			$.fn.reset_form('client_form');
		});

		$('#btn_search_action').click(function(){
			$('#searchPanel').show();
			$('#btn_search_action').hide();
		});

        $('#btn_close_search').click(function(){
			$('#searchPanel').hide();
			$('#btn_search_action').show();
		});

		$(document).on('click', '.save_attachment', function(e) 
        {
            //e.preventDefault();
			let doc_name = $(this).attr('data-name');
            FILE_UPLOAD_PATH    =   `${MODULE_ACCESS.module_id}/${CONTRACT_ID}/`;
			
			let attachment_data =   
			{
				id              : '',
				primary_id      : CONTRACT_ID,
				secondary_id	: doc_name,
				module_id       : MODULE_ACCESS.module_id,
				filename        : '',
				filesize        : "0",
				json_field      : {},
				emp_id          : SESSIONS_DATA.emp_id
			};
			
			if($(`#files_${doc_name} .file-upload.new`).length > 0)
			{   
				$.fn.upload_file(`files_${doc_name}`,'contract_id',1,
				attachment_data,function(total_files, total_success,filename,attach_return_data)
				{
					if(total_files == total_success)
					{   
						if(doc_name == 'offer_letter')
						{
							$.fn.populate_detail_form(CONTRACT_ID);
						}
						else
						{
							$.fn.populate_fileupload(attach_return_data,'files_'+doc_name,true);
						}
					}
				},false,btn_upload);
			}
		});
		
		$('#btn_po_upload').click( function(e)
        {
            e.preventDefault();
            FILE_UPLOAD_PATH    =   `${MODULE_ACCESS.module_id}/${CONTRACT_ID}/`;
			let attachment_data =   
			{
				id              : '',
				primary_id      : CONTRACT_ID,
				secondary_id	: $('#txt_employment_id').val(),
				module_id       : MODULE_ACCESS.module_id,
				filename        : '',
				filesize        : "0",
				json_field      : {},
				emp_id          : SESSIONS_DATA.emp_id
			};

			if($(`#files_po_file .file-upload.new`).length > 0)
			{   
				$.fn.upload_file(`files_po_file`,'contract_id',1,
				attachment_data,function(total_files, total_success,filename,attach_return_data)
				{
					if(total_files == total_success)
					{   
						$.fn.populate_fileupload(attach_return_data,'files_po_file',true);
					}
				},false,btn_upload);
			}
        });

    	$('#client_details_toggle').click( function(e)
        {
            e.preventDefault();
            $('#contract_with_client').slideToggle();
            $(this).find('.fa').toggleClass("fa-plus fa-minus");
        });

        $('#recruitment_toggle').click( function(e)
        {
            e.preventDefault();
            $('#recruitment_div').slideToggle();
            $(this).find('.fa').toggleClass("fa-plus fa-minus");
        });

    	$('#btn_contact_cancel').click( function(e)
        {
            e.preventDefault();
            $('#new_reference_div').slideUp();
            $('#btn_add_pic').show();
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

		// $('#dd_emp_type').change( function(e)
		// {
		// 	let emp_type = $('#dd_emp_type').val();
		// 	if(emp_type == 'permanent')
		// 	{
		// 		$('.nav-tabs a[href="#tab-cost"]').show();
		// 		$('.nav-tabs a[href="#tab-contract"]').hide();
		// 	}
		// 	else
		// 	{
		// 		$('.nav-tabs a[href="#tab-cost"]').hide();
		// 		$('.nav-tabs a[href="#tab-contract"]').show();
		// 	}
		// });
        
		$('#btn_info_back').click( function(e)
        {
            e.preventDefault();
            $('.tmp').remove();
            $.fn.show_hide_form('INFO_BACK');
        });
				
		$('#btn_search').click( function(e)
		{
			e.preventDefault();			
			RECORD_INDEX = 0;
			$.fn.get_list(false);
		});

        $('#btn_new').click( function(e)
        {
            e.preventDefault();
            $.fn.show_hide_form('NEW');
        });
		
		$('#btn_reset').click( function(e)
		{
			e.preventDefault();
			$.fn.reset_form('list');
			RECORD_INDEX = 0;
			$.fn.get_list(false);
		});
				
		$('#btn_save').click( function(e)
		{
			e.preventDefault();
			btn_save = Ladda.create(this);
	 		btn_save.start();
			$.fn.save_edit_form();
		});

		$('#btn_reference_add').click( function(e)
		{
			e.preventDefault();
			$.fn.add_reference();
		});

		$('#btn_reference_cancel').click( function(e)
		{
			e.preventDefault();
			$.fn.reset_form('reference_form');
			$('#new_reference_div').slideUp();
		});

		$('#btn_onboard_save').click( function(e)
		{
			e.preventDefault();
			btn_onboard_save = Ladda.create(this);
			btn_onboard_save.start();
			$.fn.create_emp_data();
		});
		
		$('#chk_pono_status').change( function(e)
		{
			if(this.checked) 
		    {
				$('#div_pono').show();
			}
			else
			{
				$('#div_pono').hide();
			}
		});		

        $('#btn_add_remark').click( function(e)
        {
            e.preventDefault();
			btn_save_remarks = Ladda.create(this);
	 		btn_save_remarks.start(); 
			$.fn.add_edit_remark();
			$('#remarkListModal').modal('hide');
        });
		
		$('#dd_nationality').change(function(e)
		{
			if($(this).val() != 1321)
			{
				$('#txt_eis,#txt_hrdf').val(0);
				$('#txt_eis').attr('disabled','disabled').removeAttr('enabled').removeAttr('onchange');
				$('#txt_hrdf').attr('disabled','disabled').removeAttr('enabled');
			}
			else
			{
				
				$('#txt_eis').attr('enabled','enabled').removeAttr('disabled');
				$('#txt_hrdf').attr('enabled','enabled').removeAttr('disabled');
			}
		});
		
		$('#dd_gst_sst').change( function(e)
		{
			$.fn.fill_amount_with_gst($('#txt_billing_amount').val());
		});
		
		$('#btn_add_allowance').click( function(e)
        {
            e.preventDefault();
	 		$.fn.add_allowance();
        });
		
		$('#btn_add_dependent').click( function(e)
        {
            e.preventDefault();
	 		$.fn.add_dependent();
		});
		
		$('#btn_add_increment').click( function(e)
        {
            e.preventDefault();
	 		$.fn.add_increment();
        });
		
		$('#btn_add_reference').click( function(e)
        {
            e.preventDefault();
	 		$.fn.add_reference();
        });
		
		$('#emp_start_date, #emp_end_date').change( function(e)
		{
			if($('#emp_start_date').val() != '' && $('#emp_end_date').val() != '')
			{	
				let start_date = new Date(moment($('#emp_start_date').val()).format('MM/DD/YYYY'));
				let end_date = new Date(moment($('#emp_end_date').val()).format('MM/DD/YYYY'));
				$('#duration_of_employment').val($.fn.month_diff(start_date,end_date));
			}
		});

		$('#billing_end_date, #billing_start_date').change( function(e)
		{
			if($('#billing_start_date').val() != '' && $('#billing_end_date').val() != '')
			{	
				let start_date = new Date(moment($('#billing_start_date').val()).format('MM/DD/YYYY'));
				let end_date = new Date(moment($('#billing_end_date').val()).format('MM/DD/YYYY'));
				let billing_duration = $.fn.month_diff(start_date,end_date);
				$('#txt_billing_of_month').val(billing_duration);
				$.fn.fill_amount_with_gst(billing_duration);
			}
		});
		
		$('#txt_salary').keypress( function(e)
		{
			$('#txt_daily_salary').val(0);
			
		});
		$( "#txt_salary" ).keyup(function()
		{
			$('#dd_epf_percentage').trigger('change');
		});
		
		$('#txt_daily_salary').keypress( function(e)
		{
			$('#txt_salary').val(0);
		});
		
		
		$('#dd_ext_rec').change(function(e)
		{
			let data = $('option:selected',this).attr('data');
			
			if(data != undefined)
			{
				data = JSON.parse(data);
				$('#txt_ext_rec_amount').val(data.amount);
			}
			
		});
		
		$('#dd_ext_sales').change(function(e)
		{
			let data = $('option:selected',this).attr('data');
			if(data != undefined)
			{
				data = JSON.parse(data);
				$('#txt_ext_sales_amount').val(data.amount);
			}
		});
		
		$('#btn_reference_apply').click( function(e)
        {
            e.preventDefault();
            let data 			= JSON.parse($(REF_ROW).closest('tr').find('button').attr('data'));
    		data.remarks 		= $('#txt_reference_remark').val();
    		$(REF_ROW).closest('tr').find('button').attr('data',JSON.stringify(data));
    		$(REF_ROW).closest('td').find('span').html($('#txt_reference_remark').val().substring(0, 30));
            $('#reference_remark_modal').modal('hide');
        });
		
		$('#dd_epf_percentage').change(function(e)
		{	
			let basic_salary = '';
			if($('#txt_salary_after_increment').val() != '')
			{
				basic_salary = $('#txt_salary_after_increment').val();
			}
			else if($('#txt_salary').val() != '')
			{
				basic_salary = $('#txt_salary').val();
			}

			if(basic_salary != '')
			{
				$('#txt_epf').val(0);
				let ep_cost = parseFloat(basic_salary) * parseFloat($('#dd_epf_percentage').val());
				if (!isNaN(ep_cost)) 
				{
					$('#txt_epf').val(ep_cost);
				}
			}
		});
		
		$("#chk_ep_tick").change(function() 
		{	
			$('#txt_epcost').val(0);
			if(this.checked) 
		    {
				$.fn.set_default_value('EP','txt_epcost');
		    }
		});
		
		$("#dd_dp_qty").change(function() 
		{
			$("#dd_td_dependent").trigger('change');
		});
		
		$("#dd_td_dependent").change(function() 
		{

			if($("option:selected", this).attr('data-field1') != '' && $("option:selected", this).attr('data-field2') != '')
			{	
				let duration= parseInt($('#txt_duration').val());
				let field1 	= $("option:selected", this).attr("data-field1");
				let field2 	= $("option:selected", this).attr("data-field2");
				let cost	= 0;
				let cost_per_annum = parseFloat(field1 * 12);
				
				if(duration <= 6)
				{
					cost = parseFloat(field2 * duration * parseInt($('#dd_dp_qty').val()));
				}
				else if(duration < 12)
				{
					cost 	= (cost_per_annum * parseInt($('#dd_dp_qty').val()));
				}
				else
				{
					cost 	= (field1 * duration * parseInt($('#dd_dp_qty').val()));
				}
				cost = isNaN(cost) ? '' : cost;
				$('#txt_td_dependent_amount').val(cost);
			}
		});
		
		$("#chk_om_tick").change(function() 
		{
			$('#txt_outpatient_medical_cost').val(0);
		    if(this.checked) 
		    {
		    	$.fn.set_default_value('OM','txt_outpatient_medical_cost');
		    }
		});
		
		$("#chk_mi_tick").change(function() 
		{
			$('#txt_medical_insurance_cost').val(0);
		    if(this.checked) 
		    {
		    	$.fn.set_default_value('MI','txt_medical_insurance_cost');
		    }
		});
		
		$("#chk_laptop_tick").change(function() 
		{
			$('#txt_laptop_cost').val(0);
		    if(this.checked) 
		    {
		    	$.fn.set_default_value('LP','txt_laptop_cost');
		    }
		});
		
		
		$("#chk_socso_tick").change(function() 
		{	
			$('#txt_socso').val(0);
		    if(this.checked) 
		    {
		        $('#txt_socso').val(parseFloat(ONBOARDING_COSTS['SOCSO']).toFixed(2));
		    }
		});
		
		$("#chk_ta_tick").change(function() 
		{
			$('#txt_temp_accommodation_cost').val(0);
		    if(this.checked) 
		    {
		    	$.fn.set_default_value('HA','txt_temp_accommodation_cost');
		    }
		});
		
		$("#chk_mobilization_tick").change(function() 
		{
			$('#txt_mobilization_cost').val(0);
		    if(this.checked) 
		    {
		    	$.fn.set_default_value('TC','txt_mobilization_cost');   
		    }
		});
		
		$("#chk_ft_tick").change(function() 
		{
			$('#txt_flight_ticket_cost').val(0);
		    if(this.checked) 
		    {
		    	$.fn.set_default_value('FT','txt_flight_ticket_cost');
		    }
		});
		
		$("#chk_eis_tick").change(function() 
		{
			$('#txt_eis').val(0);
		    if(this.checked) 
		    {
		        $('#txt_eis').val(parseFloat(ONBOARDING_COSTS['EIS']).toFixed(2));
		    }
		});
		
		$("#chk_hrdf_tick").change(function() 
		{
			$('#txt_hrdf').val(0);
		    if(this.checked) 
		    {
		        $('#txt_hrdf').val(parseFloat($('#txt_salary').val()) * 0.01);
		    }
		});
		
		$('#btn_revoke_approval').click( function(e)
        {
            e.preventDefault();
			btn_save_revoke_approval = Ladda.create(this);
			btn_save_revoke_approval.start(); 
			$.fn.revoke_approval(); 
			$('#approval_revoke_modal').modal('hide');
        });
		
		$("#chk_sales_head_approval,#chk_hr_approval,#chk_accounts_approval,#chk_ceo_approval,#chk_offer_letter_approval").on("click", function (e) 
		{
		    var checkbox = $(this);
		    if (checkbox.is(":checked")) 
		    {
		        e.preventDefault();
		        return false;
		    }
		});
		
		$('#dd_status').change(function(e)
		{
			if($.inArray($(this).val(),["174","175","176","177","178","212"]) >= 0)
			{
				$('#btn_status_update').hide();
			}
			else
			{
				$('#btn_status_update').show();
			}
		});
		
		$('#btn_status_update').click( function(e)
        {
            e.preventDefault();
			$.fn.update_contract_status();
        });
		
		$("#dd_duration").change(function() 
		{
			if($(this).val() == 0)
			{
				$('#txt_duration').prop('readonly', true);
			}
			else
			{
				$('#txt_duration').prop('readonly', false);
			}
		});
		
		$("#dd_contract_type").change(function() 
		{
		    if($(this).val() == '243') 
		    {
		    	$('#detail_form')	.parsley().destroy();
		    	$('#start_date')	.attr('data-parsley-required', 'false').removeAttr('required');
		    	$('#end_date')		.attr('data-parsley-required', 'false').removeAttr('required');
		    	$('#dd_employer')	.attr('data-parsley-required', 'false').removeAttr('required');
		    	$('#dd_notice_period').attr('data-parsley-required', 'false').removeAttr('required');
		    	$('#txt_duration')	.val(0);
		    	$.fn.set_validation_form();
		    }
		    else if($(this).val() == '244')
	    	{
		    	$('#detail_form')	.parsley().destroy();
		    	$('#start_date')	.attr('data-parsley-required', 'false').removeAttr('required');
		    	$('#end_date')		.attr('data-parsley-required', 'false').removeAttr('required');
		    	$('#dd_notice_period').attr('data-parsley-required', 'false').removeAttr('required');
		    	
		    	$('#dd_client').attr('data-parsley-required', 'false').removeAttr('required');
		    	$('#txt_duration')	.val(0);
		    	$.fn.set_validation_form();
	    	}
		    else
		    {
		    	$('#detail_form')	.parsley().destroy();
		    	$('#start_date')	.attr('data-parsley-required', 'true').attr('required');
		    	$('#end_date')		.attr('data-parsley-required', 'true').attr('required');
		    	$('#dd_employer')	.attr('data-parsley-required', 'true').attr('required');
		    	$('#dd_notice_period').attr('data-parsley-required', 'true').attr('required');

		    	$('#dd_client').attr('data-parsley-required', 'true').attr('required');
		    	$('#txt_duration')	.val('');
		    	
		    	$.fn.set_validation_form();
		    }
		});
		
		$('.currency-btn').on('click', function(e) 
        {
            e.preventDefault();
            $.fn.change_segment_btn(this,$('#btn_currency_text'));
        });
		
		$('#btn_reply').on('click', function(e) 
        {
        	e.preventDefault();
            btn_comments_reply = Ladda.create(this);
        	btn_comments_reply.start();
            $.fn.add_edit_comment_reply();
        });

        $('#btn_assign_save').on('click', function(e) 
        {
        	e.preventDefault();
            btn_assign_save = Ladda.create(this);
        	btn_assign_save.start();
            $.fn.add_assignee();
        });

        $('.nav-tabs a').on('click', function(e)
        {
        	e.preventDefault();
			
        	if($(this).attr('href') == '#tab-five' || $(this).attr('href') == '#tab-clients' || $(this).attr('href') == '#tab-ref')
        	{
        		$('#actions_div').hide();
        	}
        	else
        	{
        		$('#actions_div').show();	
        	}
        });
		
    }
    catch(err)
    {//console.log(err);
        $.fn.log_error(arguments.callee.caller,err.message);
    }
};

$.fn.set_default_value = function(name,txt)
{
	try
	{	
		let duration 	= 1;
		if($('#txt_duration').val() != '' && $('#txt_duration').val() != 0)
		{
			duration 	= parseInt($('#txt_duration').val());
		}
		
		let cost			= 0;
		let fixed_cost		= 0;
		let cost_per_month 	= 0;
		if(name == 'OM')
		{
			fixed_cost		= ONBOARDING_COSTS['Outpatient Medical'];
		}
		else if(name == 'MI')
		{
			fixed_cost		= ONBOARDING_COSTS['Medical Insurance'];
		}
		else if(name == 'LP')
		{
			fixed_cost		= ONBOARDING_COSTS['Laptop'];;
			
		}
		else if(name == 'EP')
		{	
			fixed_cost		= ONBOARDING_COSTS['EP Cost'];;
		}
		else if(name == 'FT')
		{
			fixed_cost		= ONBOARDING_COSTS['Flight Ticket'];;
		}
		else if(name == 'HA')
		{
			fixed_cost		= ONBOARDING_COSTS['Temp. Accommodation'];;
		}
		else if(name == 'TC')
		{
			fixed_cost		= ONBOARDING_COSTS['Mobilization'];
		}
		cost_per_month 		= parseFloat(fixed_cost / 12);
		if(duration <= 6)
		{
			cost_per_month 		= parseFloat(fixed_cost / 6);
		}
		cost 	= (cost_per_month * duration);
		$(`#${txt}`).val(cost.toFixed(2));
		
	}
	catch(err)
    {
        $.fn.log_error(arguments.callee.caller,err.message);
    }
}


$.fn.init_upload_file = function() 
{

    //$.fn.reset_upload_form();
    // Documents upload start
	$('.doc_upload').each(function(e)
	{  	
		let doc_name        = $(this).attr('id');
		$.fn.intialize_fileupload(`fileupload_${doc_name}`,`files_${doc_name}`);
	});	
	
	$.fn.intialize_fileupload(`fileupload`,`files`);
	// Documents upload end

	$.fn.intialize_fileupload(`fileupload_po_file`,`files_po_file`);
	
};

$.fn.reset_upload_form = function()
{	
	var i = 0;
	$('.doc_upload').each(function()
	{
		$('#document_' + i).html('');
		$('#document_link_' + i).html('');
		var $documentupload = $('#doc_upload_' + i);
		$documentupload.unbind('fileuploadadd');
		i++;
	});	
};

$.fn.upload_contract_file  = function(callback)
{
	$('.document').each(function()
	{
		var document_data = $(this).data();

		if (document_data.submit) 
		{
			document_data.submit().success(function(response) 
			{
//				if (callback) callback(response.files[0].name);

				let item_data = JSON.parse(response.files[0].item_data);
				let doc_data =
                {
                    contract_no	: item_data.contract_no,
                    doc_type_id : item_data.doc_type_id,
                    filename 	: response.files[0].name,
                    emp_id		: SESSIONS_DATA.emp_id
                }

            	$.fn.write_data
                (
                    $.fn.generate_parameter('update_attachments_filename', doc_data),
                    function(return_data)
                    {
                        if(return_data.data)
                        {
                        	$.fn.fetch_data
                		    (
                		        $.fn.generate_parameter('get_contract_doc_list',{contract_no : CONTRACT_ID}),
                		        function(return_data)
                		        {
                		            if(return_data)
                		            {
                		            	$.fn.populate_attachments(return_data.data);        		
                		            }
                		        },false,false,false,true
                		    );
                        }
                    }, false,false,true
                );
			});
		}
	});
};



$.fn.fill_amount_with_gst = function(amount)
{
	$('#txt_total_contract_value').val(0);
	if($.isNumeric(amount))
	{
		if( $.isNumeric( $('#txt_one_time_fees').val()) == false )
		{
			$('#txt_one_time_fees').val(0);
		}
		if( $.isNumeric( $('#txt_billing_amount').val()) == false )
		{
			$('#txt_billing_amount').val(0);
		}
		let total_amount 			=  parseFloat($('#txt_billing_amount').val());
		let tax 					= $('#dd_gst_sst').val();
		let total_amount_with_gst 	= (total_amount * ((tax / 100) + 1)).toFixed(2);
		
		$('#txt_billing_amount_with_gst').val(total_amount_with_gst);
		
		if( $.isNumeric( $('#txt_billing_of_month').val()) == false )
		{
			$('#txt_billing_of_month').val(1);
		}
		
		let total_contract_val 		= ((parseFloat(total_amount_with_gst) * parseFloat($('#txt_billing_of_month').val()) + parseFloat($('#txt_one_time_fees').val())).toFixed(2));
		$('#txt_total_contract_value').val(total_contract_val);
		
	}
	else
	{
		$('#txt_billing_amount_with_gst').val(0);	
	}
};

$.fn.get_contract_add_request_dropdown = function()
{
    try
    {   
        let lead_access = $.fn.get_accessibility(9); //onboarding
        let data    =
        {   
            emp_id   : SESSIONS_DATA.emp_id,
            view_all : MODULE_ACCESS.viewall,
            lead_access_view_all : lead_access.viewall,
            lead_access_view     : lead_access.view
        };
        
        $.fn.fetch_data
        ( 
            $.fn.generate_parameter('get_contract_search_dropdown', data),
            function(return_data)
            {//console.log(return_data.data.client);
                if (return_data.code == 0)
                {
                	$.fn.populate_dd_values('dd_created_by_search', return_data.data);
					$.fn.populate_dd_values('dd_client', return_data.data);
                }
            },true
        );
    }
    catch(err)
    {
        $.fn.log_error(arguments.callee.caller,err.message);
    }
};

$.fn.month_diff = function (startDate, endDate)
{
	let diffResult = Math.round((endDate - startDate) / (1000 * 60 * 60 * 24));
	let months = (diffResult / 30.436875).toFixed(1);
	return months;
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


// START of Document initialization
$(document).ready(function()
{
    $.fn.form_load();
});
// END of Document initialization
