<?php
/**
 * @author 		Jamal
 * @date 		14-Nov-2015
 * @modify 		Jamal
 * @Note = Please follow the indentation
 *         Please follow the naming convention
 */


php_meta_nocache();
require_once('server.php');


if(isset($_SERVER['REQUEST_METHOD']))
{
	log_trans("Business Layer: " . @file_get_contents('php://input'), SERVICE_LOG);

	if(strlen(@file_get_contents('php://input')) > 0)
	{
		$rec_data 	= stripslashes(@file_get_contents('php://input'));
		$param 		= json_decode($rec_data);
		if( !isset($param->method))
			return false;
		//echo test
		//service exposed without token
		//echo $param;
	/* 	if($param->method === 'login')
		{
			require_once constant('MODULES_DIR')  . '/login.php';
			echo check_login($param);
			return;
		} */
	/* 	else if($param->method === 'recover_password')
		{
		    require_once constant('MODULES_DIR')  . '/login.php';
		    echo recover_password($param->data);
		    return;
		}
		else if($param->method === 'reset_password')
		{
		    require_once constant('MODULES_DIR')  . '/login.php';
		    echo reset_password($param->data);
		    return;
		} */
	 	else if($param->method === 'get_modules')
		{
		    require_once constant('MODULES_DIR')  . '/modules.php';
		    echo get_modules($param->data);
		    return;
		}
		
		else if($param->method === 'get_sbd')
        {
        	require_once constant('MODULES_DIR') 	. '/common.php';
         	echo get_sbd();
		}
		else if($param->method === 'get_search_status')
        {
        	require_once constant('MODULES_DIR') 	. '/common.php';
         	echo get_search_status();
		}
		else if($param->method === 'get_search_assignee')
        {
        	require_once constant('MODULES_DIR') 	. '/common.php';
         	echo get_search_assignee();
		}
		else if($param->method === 'get_search_created_by')
        {
        	require_once constant('MODULES_DIR') 	. '/common.php';
         	echo get_search_created_by();
		}
		else if($param->method === 'get_search_schedule_type')
        {
        	require_once constant('MODULES_DIR') 	. '/common.php';
         	echo get_search_schedule_type();
		}
		else if($param->method === 'get_search_company')
        {
        	require_once constant('MODULES_DIR') 	. '/common.php';
         	echo get_search_company();
		}
		else if($param->method === 'get_sbg')
        {
        	require_once constant('MODULES_DIR') 	. '/common.php';
         	echo get_sbg();
		}
		else if($param->method === 'get_departments')
        {
        	require_once constant('MODULES_DIR') 	. '/common.php';
         	echo get_departments();
		}
		else if($param->method === 'get_company')
        {
        	require_once constant('MODULES_DIR') 	. '/task.php';
         	echo get_company();
		}
		else if($param->method === 'get_taskTypes')
        {
        	require_once constant('MODULES_DIR') 	. '/common.php';
         	echo get_taskTypes();
		}/*
		else if($param->method === 'get_everything_at_once')
        {
        	require_once constant('MODULES_DIR') 	. '/task.php';
         	echo get_everything_at_once($param->data);
		}
		*/else if($param->method === 'get_priority')
        {
        	require_once constant('MODULES_DIR') 	. '/common.php';
         	echo get_priority();
		}
		else if($param->method === 'get_taskGroups')
        {
        	require_once constant('MODULES_DIR') 	. '/common.php';
         	echo get_taskGroups();
		}
		else if($param->method === 'get_status')
        {
        	require_once constant('MODULES_DIR') 	. '/common.php';
         	echo get_status();
		}/*
		else if($param->method === 'get_schedule_tasks_list')
		{
         	require_once constant('MODULES_DIR') 	. '/task.php';
        	echo get_schedule_tasks_list($param->data);
        }
		else if($param->method === 'get_assignee')
		{
         	require_once constant('MODULES_DIR') 	. '/task.php';
        	echo get_assignee($param->data);
        }
		else if($param->method === 'get_emp')
		{
         	require_once constant('MODULES_DIR') 	. '/task.php';
        	echo get_emp($param->data);
        }
		else if($param->method === 'get_task_reply_list_new')
        {
        	require_once constant('MODULES_DIR') 	. '/task.php';
         	echo get_task_reply_list_new($param->data);
		}
		else if($param->method === 'get_search_priority')
        {
        	require_once constant('MODULES_DIR') 	. '/task.php';
         	echo get_search_priority($param->data);
		}
		else if($param->method === 'get_new_task_assignee_by_id')
        {
        	require_once constant('MODULES_DIR') 	. '/task.php';
         	echo get_new_task_assignee_by_id($param->data);
			return;
		}
		else if($param->method === 'update_assignee_document')
        {
        	require_once constant('MODULES_DIR') 	. '/task.php';
         	echo update_assignee_document($param->data);
			return;
		} */
		// else if($param->method === 'get_task_reply_list_new')
        // {
        // 	require_once constant('MODULES_DIR') 	. '/task.php';
        //  	echo get_task_reply_list_new($param->data);
		// }
// 		else if($param->method === 'get_active_job_post')
// 		{
// 			require_once constant('MODULES_DIR') 	. '/jobPost.php';
// 			echo get_active_job_post($param->data);
// 			return;
// 		}
// 		else if($param->method === 'apply_job_post')
// 		{
// 			require_once constant('MODULES_DIR') 	. '/jobPost.php';
// 			echo apply_job_post($param->data);
// 			return;
// 		}
// 		else if($param->method === 'submit_resumes')
// 		{
// 			require_once constant('MODULES_DIR') 	. '/resumes.php';
// 			echo submit_resumes($param->data);
// 			return;
// 		}
		
// 		if($param->method === 'update_tnc_data')
// 		{
// 			require_once constant('MODULES_DIR') 	. '/notification.php';
// 			echo update_tnc_data($param->data);
// 			return;
// 		}
		
// 		if($param->method === 'contact_us')
// 		{
// 			$mail = smtpmailer_new
// 			(
// 				"jamal@msphitect.com.my",
// 				constant('MAIL_USERNAME'),
// 				constant('MAIL_FROMNAME'),
// 				"A Person trying to reach us",
// 				json_encode($param->data)
// 			);
// 			echo handle_success_response('Success', $mail);
// 			return;
// 		}
		
// 		if($param->method === 'create_demo')
// 		{
// 			require_once constant('MODULES_DIR')    . '/registration.php';
// 			echo create_demo($param->data);
// 			return;
// 		}
		
// 		if($param->method === 'validate_demo_email')
// 		{
// 			require_once constant('MODULES_DIR')    . '/registration.php';
// 			echo validate_demo_email($param->data);
// 			return;
// 		}
		
// 		if ($param->method === 'add_employee')
// 		{
// 			require_once constant('MODULES_DIR') . '/onboarding.php';
// 			echo add_employee($param->data);
// 			return;
// 		}
		
// 		if ($param->method === 'decline_offer')
// 		{
// 			require_once constant('MODULES_DIR') . '/onboarding.php';
// 			echo decline_offer($param->data);
// 			return;
// 		}
		
// 		if ($param->method === 'get_contract_comments_list') 
// 		{
// 			require_once constant('MODULES_DIR') . '/contract.php';
// 			echo get_contract_comments_list($param->data);
// 			return;
// 		}
		
// 		if ($param->method === 'add_edit_contract_comments') 
// 		{
// 			require_once constant('MODULES_DIR') . '/contract.php';
// 			echo add_edit_contract_comments($param->data);
// 			return;
// 		}
		
// 		if ($param->method === 'add_edit_contracts_candidate') 
// 		{
//             require_once constant('MODULES_DIR') . '/contract.php';
//             echo add_edit_contracts_candidate($param->data);
//             return;
// 		}

// 		if($param->method === 'get_attachment')
// 		{
// 			require_once constant('MODULES_DIR') 	. '/attachments.php';
// 			echo get_attachment($param->data);
// 			return;
// 		}
// 		if($param->method === 'add_attachment')
// 		{
// 			require_once constant('MODULES_DIR') 	. '/attachments.php';
// 			echo add_attachment($param->data);
// 			return;
// 		}
// 		if($param->method === 'delete_attachment')
// 		{
// 			require_once constant('MODULES_DIR') 	. '/attachments.php';
// 			echo delete_attachment($param->data);
// 			return;
// 		}
// 		if($param->method === 'delete_attachment_old')
// 		{
// 			require_once constant('MODULES_DIR') 	. '/attachments.php';
// 			echo delete_attachment_old($param->data);
// 			return;
// 		}
// 		if ($param->method === 'external_recover_password')
// 		{
// 			require_once constant('MODULES_DIR') . '/external_access.php';
// 			echo recover_password($param->data);
// 			return;
// 		}

// 		if ($param->method === 'update_employee_track') 
// 		{
// 			require_once constant('MODULES_DIR') . '/employees.php';
// 			echo update_employee_track($param->data);
// 			return;
// 		}
		
// 		// START DOCUMENT OTP
		/* if ($param->method === 'generate_digital_signature') 
		{
            require_once constant('MODULES_DIR') . '/user_documents.php';
            echo generate_digital_signature($param->data);
            return;
        }
		if ($param->method === 'generate_otp_document') 
		{
            require_once constant('MODULES_DIR') . '/user_documents.php';
            echo generate_otp_document($param->data);
            return;
        } */

        // if ($param->method === 'validate_otp_document') 
		// {
        //     require_once constant('MODULES_DIR') . '/user_documents.php';
        //     echo validate_otp_document($param->data);
        //     return;
        // }

    /*     if ($param->method === 'verify_document') 
		{
            require_once constant('MODULES_DIR') . '/user_documents.php';
            echo verify_document($param->data);
            return;
        }

        if ($param->method === 'add_edit_user_doc_comments') 
		{
            require_once constant('MODULES_DIR') . '/user_documents.php';
            echo add_edit_user_doc_comments($param->data);
            return;
        }

        if ($param->method === 'get_user_doc_comments_list') 
		{
            require_once constant('MODULES_DIR') . '/user_documents.php';
            echo get_user_doc_comments_list($param->data);
            return;
        }

		if ($param->method === 'update_view_time_doc') 
		{
            require_once constant('MODULES_DIR') . '/user_documents.php';
            echo update_view_time_doc($param->data);
            return;
        } */
// 		// END DOCUMENT OTP

// 		if($param->method === 'is_token_valid')
// 		{
// 			if(!isset($param->token))
// 			{
// 				echo handle_fail_response('Unable to get token');
// 				return;
// 			}
			
// 			if(is_token_valid($param->token) == FALSE)
// 			{
// 				echo handle_fail_response('Invalid Token');
// 				return;
// 			}
// 			else
// 			{
// 				echo handle_success_response('Success', $param->token);
// 				return;
// 			}
// 		}
		
// 		if($param->method === 'get_emp_details_screen_capture')
// 		{
			
// 			$key			= if_property_exist($param, 'key');
// 			$token_string  	= decrypt_string($key);
			
// 			if ($token_string !== constant('SECURITY_SECRET'))
// 			{
// 				echo handle_fail_response('Invalid credential');
// 				return;
// 			}
			
// 			require_once constant('MODULES_DIR') 	. '/employees.php';
// 			echo get_emp_details_screen_capture($param->data);
// 			return;
// 		}
		
// 		if($param->method === 'add_attachment_track')
// 		{
			
// 			$key			= if_property_exist($param, 'key');
// 			$token_string  	= decrypt_string($key);
			
// 			if ($token_string !== constant('SECURITY_SECRET'))
// 			{
// 				echo handle_fail_response('Invalid credential');
// 				return;
// 			}
			
// 			require_once constant('MODULES_DIR') 	. '/attachments.php';
// 			echo add_attachment_track($param->data);
// 			return;
// 		}
		
// 		if ($param->method === 'update_attachments_filename') 
// 		{
// 			require_once constant('MODULES_DIR') . '/contract.php';
// 			echo update_attachments_filename($param->data);
// 			return;
// 		}
		
		
		
		
// 		if(!isset($param->token))
// 		{
// 			echo handle_fail_response('Unable to get token');
// 			return;
// 		}
		
// 		if(is_token_valid($param->token) == FALSE)
// 		{
// 			echo handle_fail_response('Invalid Token');
// 			return;
// 		}

// 		//service exposed with token
// 		if($param->method === 'change_password')
// 		{
// 		    require_once constant('MODULES_DIR')  . '/login.php';
// 		    echo change_password($param->data);
// 		}
		
		
/* 
		else if($param->method === 'get_user_initial_data')
		{
		    require_once constant('MODULES_DIR') 	. '/employees.php';
		    echo get_user_initial_data($param->data);
			return;
		}
		else if($param->method === 'get_employee_list')
		{
		    require_once constant('MODULES_DIR') 	. '/employees.php';
		    echo get_employee_list($param->data);
			return;
		}
// 		else if($param->method === 'get_employee_history_list')
// 		{
// 		    require_once constant('MODULES_DIR') 	. '/employees.php';
// 		    echo get_employee_history_list($param->data);
// 		}
		else if($param->method === 'get_employee_leave_list')
		{
		    require_once constant('MODULES_DIR') 	. '/employees.php';
		    echo get_employee_leave_list($param->data);
			return;
		}
		else if($param->method === 'add_edit_employees')
		{
		    require_once constant('MODULES_DIR') 	. '/employees.php';
		    echo add_edit_employees($param->data);
			return;
		}
 		else if($param->method === 'add_edit_employees_history')
 		{
 		    require_once constant('MODULES_DIR') 	. '/employees.php';
 		    echo add_edit_employees_history($param->data);return;
		}
		else if($param->method === 'add_edit_employees_leave')
		{
		    require_once constant('MODULES_DIR') 	. '/employees.php';
		    echo add_edit_employees_leave($param->data);
			return;
		}
		else if($param->method === 'get_employees_details')
		{
		    require_once constant('MODULES_DIR') 	. '/employees.php';
		    echo get_employees_details($param->data);
			return;
		}
 		else if($param->method === 'get_employees_his_details')
 		{
 		    require_once constant('MODULES_DIR') 	. '/employees.php';
 		    echo get_employees_his_details($param->data);return;
 		}
 		else if($param->method === 'delete_work_history')
 		{
 		    require_once constant('MODULES_DIR') 	. '/employees.php';
 		    echo delete_work_history($param->data);return;
 		}
		else if($param->method === 'delete_leave')
		{
			require_once constant('MODULES_DIR') 	. '/employees.php';
			echo delete_leave($param->data);
			return;
		} */
// 		else if($param->method === 'update_profile')
// 		{
// 			require_once constant('MODULES_DIR') 	. '/employees.php';
// 			echo update_profile($param->data);
// 		}
// 		else if($param->method === 'edit_profile_pic')
// 		{
// 			require_once constant('MODULES_DIR') 	. '/employees.php';
// 			echo edit_profile_pic($param->data);
// 		}
// 		// else if($param->method === 'get_skills')
// 		// {
// 		// 	require_once constant('MODULES_DIR') 	. '/employees.php';
// 		// 	echo get_skills($param->data);
// 		// }
// 		else if($param->method === 'get_employee_report')
// 		{
// 		    require_once constant('MODULES_DIR') 	. '/employees.php';
// 		    echo get_employee_report($param->data);
// 		}
// 		else if($param->method === 'send_emp_test_email')
// 		{
// 			require_once constant('MODULES_DIR') 	. '/employees.php';
// 			echo send_emp_test_email($param->data);
// 		}
// 		else if($param->method === 'update_emp_json_field')
// 		{
// 			require_once constant('MODULES_DIR') 	. '/employees.php';
// 			echo update_emp_json_field($param->data);
// 		}
// 		// else if($param->method === 'update_employee_attachment')
// 		// {
// 		// 	require_once constant('MODULES_DIR') 	. '/employees.php';
// 		// 	echo update_employee_attachment($param->data);
// 		// }
// 		else if($param->method === 'update_employee_attachment_visible_status')
// 		{
// 			require_once constant('MODULES_DIR') 	. '/employees.php';
// 			echo update_employee_attachment_visible_status($param->data);
// 		}
// 		// else if($param->method === 'update_employee_attachment_files_visible_status')
// 		// {
// 		// 	require_once constant('MODULES_DIR') 	. '/employees.php';
// 		// 	echo update_employee_attachment_files_visible_status($param->data);
// 		// }
// 		else if($param->method === 'add_emp_user_log')
// 		{
// 			//helper file already included by default.
// 			echo add_emp_user_log($param->data);
// 		}
// 		else if($param->method === 'get_employee_track')
// 		{
// 			require_once constant('MODULES_DIR') 	. '/employees.php';
// 			echo get_employee_track($param->data);
// 		}
// 		// else if ($param->method === 'add_edit_employees_track') 
// 		// {
// 		// 	require_once constant('MODULES_DIR') . '/employees.php';
// 		// 	echo add_edit_employees_track($param->data);
// 		// }
		
		
	/* 	
		else if($param->method === 'get_misc')
		{
		    require_once constant('MODULES_DIR') 	. '/master_settings.php';
		    echo get_misc($param->data);
			return;
		}
		else if($param->method === 'add_edit_misc')
		{
		    require_once constant('MODULES_DIR') 	. '/master_settings.php';
		    echo add_edit_misc($param->data);
			return;
		}
 		else if($param->method === 'add_edit_holiday')
 		{
 			require_once constant('MODULES_DIR') 	. '/master_settings.php';
 			echo add_edit_holiday($param->data);
		} */
// 		else if($param->method === 'get_dropdown')
// 		{
// 			require_once constant('MODULES_DIR') 	. '/master_settings.php';
// 			echo get_misc($param->data);
// 		}
	/* 	else if($param->method === 'get_employers_list')
		{
			require_once constant('MODULES_DIR') 	. '/master_settings.php';
			echo get_employers_list($param->data);
			return;
		}
		else if($param->method === 'add_edit_employer')
		{
			require_once constant('MODULES_DIR') 	. '/master_settings.php';
			echo add_edit_employer($param->data);
			return;
		}
 		else if ($param->method === 'get_holidays_list') 
 		{
 			require_once constant('MODULES_DIR') . '/master_settings.php';
 			echo get_holidays_list($param->data);
 		}
		else if ($param->method === 'edit_company_logo')
		{
			require_once constant('MODULES_DIR') . '/master_settings.php';
			echo edit_company_logo($param->data);
			return;
		}
 		else if ($param->method === 'get_public_holiday_upload')
 		{
 			require_once constant('MODULES_DIR') . '/master_settings.php';
 			echo get_public_holiday_upload($param->data);
 		}  */
// 		else if ($param->method === 'add_ph_upload_batch') 
// 		{
// 			require_once constant('MODULES_DIR') . '/master_settings.php';
// 			echo add_ph_upload_batch($param->data);
// 		}
 	/* 	else if ($param->method === 'remove_company_logo') 
 		{
 			require_once constant('MODULES_DIR') . '/master_settings.php';
 			echo remove_company_logo($param->data);
 		} */

		//--------Added by Sita----------- 
		else if($param->method === 'get_document_search_dropdown_data_check')
		{
			require_once constant('MODULES_DIR')    . '/common.php';
			echo get_document_search_dropdown_data_check();
			return;
		}
		else if($param->method === 'get_document_search_query_data_check')
		{
			require_once constant('MODULES_DIR')    . '/common.php';
			echo get_document_search_query_data_check();
			return;
		}
		 else if ($param->method === 'get_documents_drop_down_values_other') 
		{
			require_once constant('MODULES_DIR') . '/common.php';
			echo get_documents_drop_down_values_other($param->data);
			return;
		}
		//--------Added by Sita-----------
		//--------Added by Surekha----------- 
		else if ($param->method === 'get_leave_dropdown_data') 
		{
			require_once constant('MODULES_DIR') . '/common.php';
			echo get_leave_dropdown_data($param->data);
			return;
		}
		else if ($param->method === 'get_leave_approval_dropdown_data') 
		{
			require_once constant('MODULES_DIR') . '/common.php';
			echo get_leave_approval_dropdown_data($param->data);
			return;
		}
		//--------Added by Surekha-----------
		
// 		else if($param->method === 'get_document_list')
// 		{
// 		    require_once constant('MODULES_DIR') 	. '/document.php';
// 		    echo get_document_list($param->data);
// 		}
// 		else if($param->method === 'add_document')
// 		{
// 		    require_once constant('MODULES_DIR') 	. '/document.php';
// 		    echo add_document($param->data);
// 		}
// 		else if($param->method === 'get_doc_list_by_appt')
// 		{
// 		    require_once constant('MODULES_DIR') 	. '/document.php';
// 		    echo get_doc_list_by_appt($param->data);
// 		}
// 		else if($param->method === 'delete_document')
// 		{
// 		    require_once constant('MODULES_DIR') 	. '/document.php';
// 		    echo delete_document($param->data);
// 		}
// 		else if($param->method === 'get_document_list_for_approval')
// 		{
// 		    require_once constant('MODULES_DIR') 	. '/document.php';
// 		    echo get_document_list_for_approval($param->data);
// 		}
//         else if($param->method === 'get_document_remark')
//         {
//             require_once constant('MODULES_DIR') 	. '/document.php';
//             echo get_document_remark($param->data);
//         }
// 		else if($param->method === 'mark_viewed_document')
//         {
//             require_once constant('MODULES_DIR') 	. '/document.php';
//             echo mark_viewed_document($param->data);
//         }
//         else if($param->method === 'edit_verify_approve')
//         {
//             require_once constant('MODULES_DIR') 	. '/document.php';
//             echo edit_verify_approve($param->data);
//         }
//         else if($param->method === 'add_edit_remark')
//         {
//             require_once constant('MODULES_DIR') 	. '/document.php';
//             echo add_edit_remark($param->data);
//         }
//         else if($param->method === 'get_claim_list')
//         {
//             require_once constant('MODULES_DIR') 	. '/document.php';
//             echo get_claim_list($param->data);
//         }
//         else if($param->method === 'get_claim_details')
//         {
//             require_once constant('MODULES_DIR') 	. '/document.php';
//             echo get_claim_details($param->data);
//         }
//         else if($param->method === 'verify_claim')
//         {
//             require_once constant('MODULES_DIR') 	. '/document.php';
//             echo verify_claim($param->data);
//         }
// 		else if($param->method === 'delete_remark')
// 		{
// 		    require_once constant('MODULES_DIR') 	. '/document.php';
// 		    echo delete_remark($param->data);
// 		}
// 		else if($param->method === 'get_document_report_drop_down_values')
// 		{
// 			require_once constant('MODULES_DIR')    . '/document.php';
// 			echo get_document_report_drop_down_values();
// 		}
		
		
// 		else if($param->method === 'add_edit_contracts')
//         {
//             require_once constant('MODULES_DIR') 	. '/contract.php';
//             echo add_edit_contracts($param->data);
//         }
//         else if($param->method === 'add_edit_attachments')
//         {
//         	require_once constant('MODULES_DIR') 	. '/contract.php';
//         	echo add_edit_attachments($param->data);
//         }
// //         else if($param->method === 'update_attachments_filename')
// //         {
// //         	require_once constant('MODULES_DIR') 	. '/contract.php';
// //         	echo update_attachments_filename($param->data);
// //         }
// 		else if($param->method === 'get_contract_list')
//         {
//             require_once constant('MODULES_DIR') 	. '/contract.php';
//             echo get_contract_list($param->data);
//         }
//         else if($param->method === 'offer_letter_exist')
//         {
//         	require_once constant('MODULES_DIR') 	. '/contract.php';
//         	echo offer_letter_exist($param->data);
//         }
//         else if($param->method === 'reference_feedback_exist')
//         {
//         	require_once constant('MODULES_DIR') 	. '/contract.php';
//         	echo reference_feedback_exist($param->data);
//         }
// 		else if($param->method === 'get_contract_details')
//         {
//             require_once constant('MODULES_DIR') 	. '/contract.php';
//             echo get_contract_details($param->data);
//         }
// 		else if($param->method === 'add_edit_contract_allowance')
//         {
//             require_once constant('MODULES_DIR') 	. '/contract.php';
//             echo add_edit_contract_allowance($param->data);
//         }
// 		else if($param->method === 'get_contract_allowance_list')
//         {
//             require_once constant('MODULES_DIR') 	. '/contract.php';
//             echo get_contract_allowance_list($param->data);
//         }
//         else if($param->method === 'get_contract_dependent_list')
//         {
//         	require_once constant('MODULES_DIR') 	. '/contract.php';
//         	echo get_contract_dependent_list($param->data);
//         }
//         else if($param->method === 'get_contract_doc_list')
//         {
//         	require_once constant('MODULES_DIR') 	. '/contract.php';
//         	echo get_contract_doc_list($param->data);
//         }
// 		else if($param->method === 'get_allowance_details')
//         {
//             require_once constant('MODULES_DIR') 	. '/contract.php';
//             echo get_allowance_details($param->data);
//         }
// 		else if($param->method === 'get_contract_remark')
//         {
//             require_once constant('MODULES_DIR') 	. '/contract.php';
//             echo get_contract_remark($param->data);
//         }
// 		else if($param->method === 'contract_add_edit_remark')
//         {
//             require_once constant('MODULES_DIR') 	. '/contract.php';
//             echo contract_add_edit_remark($param->data);
//         }
// 		else if($param->method === 'contract_delete_remark')
//         {
//             require_once constant('MODULES_DIR') 	. '/contract.php';
//             echo contract_delete_remark($param->data);
//         }
//         else if($param->method === 'create_emp_data_from_contract')
//         {
//         	require_once constant('MODULES_DIR') 	. '/contract.php';
//         	echo create_emp_data_from_contract($param->data);
//         }
//         else if($param->method === 'revoke_contract_approval')
//         {
//         	require_once constant('MODULES_DIR') 	. '/contract.php';
//         	echo revoke_contract_approval($param->data);
//         }
// 		else if($param->method === 'get_contract_report')
//         {
//         	require_once constant('MODULES_DIR') 	. '/contract.php';
//             echo get_contract_report($param->data);
//         }
//         else if($param->method === 'update_contract_status')
//         {
//         	require_once constant('MODULES_DIR') 	. '/contract.php';
//         	echo update_contract_status($param->data);
//         }
//         else if ($param->method === 'add_assignee') 
//         {
//         	require_once constant('MODULES_DIR') . '/contract.php';
//         	echo add_assignee($param->data);
//         }
// 		else if ($param->method === 'get_contract_config') 
// 		{
// 			require_once constant('MODULES_DIR') . '/contract.php';
// 			echo get_contract_config($param->data);
// 		} 
// 		else if ($param->method === 'send_for_approval') 
// 		{
// 			require_once constant('MODULES_DIR') . '/contract.php';
// 			echo send_for_approval($param->data);
// 		} 
// 		else if ($param->method === 'send_offer_letter') 
// 		{
// 			require_once constant('MODULES_DIR') . '/contract.php';
// 			echo send_offer($param->data);
// 		}
// 		else if ($param->method === 'create_employee_for_contract') 
// 		{
//             require_once constant('MODULES_DIR') . '/contract.php';
//             echo create_employee_for_contract($param->data);
//         }
// 		else if ($param->method === 'get_contract_summary') 
// 		{
// 			require_once constant('MODULES_DIR') . '/contract.php';
// 			echo get_contract_summary($param->data);
// 		}
		

// 		else if($param->method === 'add_edit_leave')
//         {
//             require_once constant('MODULES_DIR') . '/leave.php';
//             echo add_edit_leave($param->data);
//         }
// 		else if($param->method === 'upload_edit_leave')
//         {
//             require_once constant('MODULES_DIR') . '/leave.php';
//             echo upload_edit_leave($param->data);
//         }
// 		else if($param->method === 'get_leave_list')
//         {
//             require_once constant('MODULES_DIR') . '/leave.php';
//             echo get_leave_list($param->data);
//         }
// 		else if($param->method === 'get_balance_leave')
//         {
//             require_once constant('MODULES_DIR') . '/leave.php';
//             echo get_balance_leave($param->data);
//         }
// 		else if($param->method === 'get_leave_details')
//         {
//             require_once constant('MODULES_DIR') . '/leave.php';
//             echo get_leave_details($param->data);
//         }
// 		else if($param->method === 'get_leave_public_holidays')
//         {
//             require_once constant('MODULES_DIR') . '/leave.php';
//             echo get_leave_public_holidays($param->data);
//         }
// 		else if($param->method === 'delete_leave_details')
// 		{
// 		    require_once constant('MODULES_DIR') . '/leave.php';
// 		    echo delete_leave_details($param->data);
// 		}
//         else if($param->method === 'get_leave_by_day')
//         {
//             require_once constant('MODULES_DIR') . '/leave.php';
//             echo get_leave_by_day($param->data);
//         }
//         else if($param->method === 'get_leave_report')
//         {
//         	require_once constant('MODULES_DIR') 	. '/leave.php';
//         	echo get_leave_report($param->data);
//         }
//         else if($param->method === 'get_leave_dashboard_list')
//         {
//         	require_once constant('MODULES_DIR') 	. '/leave.php';
//         	echo get_leave_dashboard_list($param->data);
//         }
//         else if($param->method === 'update_leave_attachment_filename')
//         {
//         	require_once constant('MODULES_DIR') 	. '/leave.php';
//         	echo update_leave_attachment_filename($param->data);
//         }
//         else if($param->method === 'cancel_leave_day')
//         {
//         	require_once constant('MODULES_DIR') . '/leave.php';
//         	echo cancel_leave_day($param->data);
//         }
        
        
// 		else if($param->method === 'get_leave_info_list')
//         {
//             require_once constant('MODULES_DIR') . '/leaveInfo.php';
//             echo get_leave_info_list($param->data);
//         }
//         else if($param->method === 'leave_edit_verify')
//         {
//             require_once constant('MODULES_DIR') . '/leaveInfo.php';
//             echo leave_edit_verify($param->data);
//         }
// 		else if($param->method === 'leave_edit_approve')
//         {
//             require_once constant('MODULES_DIR') . '/leaveInfo.php';
//             echo leave_edit_approve($param->data);
//         }
// 		else if($param->method === 'delete_leave_by_id')
//         {
//             require_once constant('MODULES_DIR') . '/leaveInfo.php';
//             echo delete_leave_by_id($param->data);
//         }
// 		else if($param->method === 'leave_add_edit_remark')
//         {
//             require_once constant('MODULES_DIR') . '/leaveInfo.php';
//             echo leave_add_edit_remark($param->data);
//         }
// 		else if($param->method === 'get_leave_remark')
//         {
//             require_once constant('MODULES_DIR') . '/leaveInfo.php';
//             echo get_leave_remark($param->data);
//         }
// 		else if($param->method === 'leave_delete_remark')
// 		{
//             require_once constant('MODULES_DIR') . '/leaveInfo.php';
// 		    echo leave_delete_remark($param->data);
// 		}
// 		else if($param->method === 'get_underline_list')
// 		{
//             require_once constant('MODULES_DIR') . '/leaveInfo.php';
// 		    echo get_underline_list($param->data);
// 		}
		
		
		
        
        
//         else if($param->method === 'view_faq_list')
//         {
//         	require_once constant('MODULES_DIR') 	. '/faq.php';
//         	echo view_faq_list($param->data);
//         }
//         else if($param->method === 'add_edit_faq')
//         {
//         	require_once constant('MODULES_DIR') 	. '/faq.php';
//         	echo add_edit_faq($param->data);
//         }
//         else if($param->method === 'get_faq_edit_details')
//         {
//         	require_once constant('MODULES_DIR') 	. '/faq.php';
//         	echo get_faq_edit_details($param->data);
//         }
//         else if($param->method === 'delete_faq_details')
//         {
//         	require_once constant('MODULES_DIR') 	. '/faq.php';
//         	echo delete_faq_details($param->data);
//         }
//         else if ($param->method === 'get_faq_report')
//         {
//         	require_once constant('MODULES_DIR') . '/faq.php';
//         	echo get_faq_report($param->data);
//         } 
//         else if ($param->method === 'get_faq_drop_down_values') 
//         {
//         	require_once constant('MODULES_DIR') . '/faq.php';
//         	echo get_faq_drop_down_values();
//         } 
//         else if ($param->method === 'get_faq_approval_list') 
//         {
//         	require_once constant('MODULES_DIR') . '/faq.php';
//         	echo get_faq_approval_list($param->data);
//         } 
//         else if ($param->method === 'approve_faq_details') 
//         {
//         	require_once constant('MODULES_DIR') . '/faq.php';
//         	echo approve_faq_details($param->data);
//         }
        
        
        
// 		else if($param->method === 'get_asset_list_flexi')
// 		{
// 		    require_once constant('MODULES_DIR') 	. '/asset.php';
// 		    echo get_asset_list_flexi($param->data);
// 		}
// 		else if($param->method === 'get_asset_list')
// 		{
// 		    require_once constant('MODULES_DIR') 	. '/asset.php';
// 		    echo get_asset_list($param->data);
// 		}
// 		else if($param->method === 'get_assets_details')
// 		{
// 		    require_once constant('MODULES_DIR') 	. '/asset.php';
// 		    echo get_assets_details($param->data);
// 		}
// 		else if($param->method === 'add_edit_asset')
// 		{
// 		    require_once constant('MODULES_DIR') 	. '/asset.php';
// 		    echo add_edit_asset($param->data);
// 		}
// 		else if($param->method === 'delete_asset')
// 		{
// 		    require_once constant('MODULES_DIR') 	. '/asset.php';
// 		    echo delete_asset($param->data);
// 		}
// 		else if($param->method === 'get_assets_dashboard_list')
// 		{
// 		    require_once constant('MODULES_DIR') 	. '/asset.php';
// 		    echo get_assets_dashboard_list($param->data);
// 		}
// 		else if ($param->method === 'add_edit_asset_warranty') 
// 		{
// 			require_once constant('MODULES_DIR') . '/asset.php';
// 			echo add_edit_asset_warranty($param->data);
// 		} 
// 		else if ($param->method === 'assign_asset_to_employee')
// 		{
// 			require_once constant('MODULES_DIR') . '/asset.php';
// 			echo assign_asset_to_employee($param->data);
// 		} 
// 		else if ($param->method === 'get_asset_employees_list') 
// 		{
// 			require_once constant('MODULES_DIR') . '/asset.php';
// 			echo get_asset_employees_list($param->data);
// 		}
// 		else if ($param->method === 'get_asset_drop_down_values') 
// 		{
// 			require_once constant('MODULES_DIR') . '/asset.php';
// 			echo get_asset_drop_down_values($param->data);
// 		}
		
		
// 		else if($param->method === 'get_timesheet_list')
// 		{
// 		    require_once constant('MODULES_DIR') 	. '/timesheet.php';
// 		    echo get_timesheet_list($param->data);
// 		}
// 		else if($param->method === 'add_edit_timesheet')
// 		{
// 		    require_once constant('MODULES_DIR') 	. '/timesheet.php';
// 		    echo add_edit_timesheet($param->data);
// 		}
// 		else if($param->method === 'submit_timesheet')
// 		{
// 		    require_once constant('MODULES_DIR') 	. '/timesheet.php';
// 		    echo submit_timesheet($param->data);
// 		}
// 		else if($param->method === 'delete_timesheet')
// 		{
// 		    require_once constant('MODULES_DIR') 	. '/timesheet.php';
// 		    echo delete_timesheet($param->data);
// 		}
// 		else if($param->method === 'get_timesheet_task_list')
// 		{
// 		    require_once constant('MODULES_DIR') 	. '/timesheet.php';
// 		    echo get_timesheet_task_list($param->data);
// 		}
// 		else if($param->method === 'add_edit_timesheet_task_batch')
// 		{
// 		    require_once constant('MODULES_DIR') 	. '/timesheet.php';
// 		    echo add_edit_timesheet_task_batch($param->data);
// 		}
// 		else if($param->method === 'add_edit_timesheet_task')
// 		{
// 		    require_once constant('MODULES_DIR') 	. '/timesheet.php';
// 		    echo add_edit_timesheet_task($param->data);
// 		}
// 		else if($param->method === 'delete_timesheet_task')
// 		{
// 		    require_once constant('MODULES_DIR') 	. '/timesheet.php';
// 		    echo delete_timesheet_task($param->data);
// 		}
// 		else if ($param->method === 'validate_timesheet')
// 		{
// 			require_once constant('MODULES_DIR') . '/timesheet.php';
// 			echo validate_timesheet($param->data);
// 		}
// 		else if($param->method === 'get_timesheetinfo_list')
// 		{
//             require_once constant('MODULES_DIR') 	. '/timesheetInfo.php';
// 		    echo get_timesheetinfo_list($param->data);
// 		}
// 		else if($param->method === 'approve_timesheet')
// 		{
//             require_once constant('MODULES_DIR') 	. '/timesheetInfo.php';
// 		    echo approve_timesheet($param->data);
// 		}
// 		else if($param->method === 'accept_timesheet')
// 		{
//             require_once constant('MODULES_DIR') 	. '/timesheetInfo.php';
// 		    echo accept_timesheet($param->data);
// 		}
// 		else if($param->method === 'reject_timesheet')
// 		{
//             require_once constant('MODULES_DIR') 	. '/timesheetInfo.php';
// 		    echo reject_timesheet($param->data);
// 		}
// 		else if($param->method === 'get_timesheet_emp')
// 		{
//             require_once constant('MODULES_DIR') 	. '/timesheetInfo.php';
// 		    echo get_timesheet_emp($param->data);
// 		}
		
		
// // 		else if($param->method === 'get_appt_employee_list')
// //         {
// //             require_once constant('MODULES_DIR') 	. '/appointments.php';
// //             echo get_appt_employee_list($param->data);
// //         }
		
        
        
//         else if($param->method === 'get_appt_dashboard_list')
//         {
//             require_once constant('MODULES_DIR') 	. '/appointments.php';
//             echo get_appt_dashboard_list($param->data);
//         }
//         else if($param->method === 'get_appt_summary_list')
//         {
//             require_once constant('MODULES_DIR') 	. '/appointments.php';
//             echo get_appt_summary_list($param->data);
//         }
//         else if($param->method === 'get_appt_summary_details')
//         {
//             require_once constant('MODULES_DIR') 	. '/appointments.php';
//             echo get_appt_summary_details($param->data);
//         }
// // 		else if($param->method === 'add_edit_appt')
// //         {
// //             require_once constant('MODULES_DIR') 	. '/appointments.php';
// //             echo add_edit_appt($param->data);
// //         }
//         else if($param->method === 'add_edit_appt_new')
//         {
//         	require_once constant('MODULES_DIR') 	. '/appointments.php';
//         	echo add_edit_appt_new($param->data);
//         }
//         else if($param->method === 'get_meetings_list')
//         {
//         	require_once constant('MODULES_DIR') 	. '/appointments.php';
//         	echo get_meetings_list($param->data);
//         }
// // 		else if($param->method === 'get_appt_list')
// //         {
// //             require_once constant('MODULES_DIR') 	. '/appointments.php';
// //             echo get_appt_list($param->data);
// //         }
//         else if($param->method === 'get_appt_list_new')
//         {
//         	require_once constant('MODULES_DIR') 	. '/appointments.php';
//         	echo get_appt_list_new($param->data);
//         }
// 		else if($param->method === 'get_appt_report_list')
//         {
//             require_once constant('MODULES_DIR') 	. '/appointments.php';
//             echo get_appt_report_list($param->data);
//         }
//         else if($param->method === 'update_appt_gps')
//         {
//             require_once constant('MODULES_DIR') 	. '/appointments.php';
//             echo update_appt_gps($param->data);
//         }
//         else if($param->method === 'update_appt_gps_new')
//         {
//         	require_once constant('MODULES_DIR') 	. '/appointments.php';
//         	echo update_appt_gps_new($param->data);
//         }
//         else if($param->method === 'get_appt_invites')
//         {
//         	require_once constant('MODULES_DIR') 	. '/appointments.php';
//         	echo get_appt_invites($param->data);
//         }
//         else if($param->method === 'adhoc_appointments')
//         {
//         	require_once constant('MODULES_DIR') 	. '/appointments.php';
//         	echo adhoc_appointments($param->data);
//         }
//         else if($param->method === 'get_appt_attendance')
//         {
//         	require_once constant('MODULES_DIR') 	. '/appointments.php';
//         	echo get_appt_attendance($param->data);
//         }
//         else if($param->method === 'get_meetings_attachments')
//         {
//         	require_once constant('MODULES_DIR') 	. '/appointments.php';
//         	echo get_meetings_attachments($param->data);
//         }
        
// //         START OF CLIENTS SERVICE
/*          else if($param->method === 'get_client_list')
         {
			 
         	require_once constant('MODULES_DIR') 	. '/clients.php';
         	echo get_client_list($param->data);
         }
         else if($param->method === 'add_edit_client')
         {
         	require_once constant('MODULES_DIR') 	. '/clients.php';
         	echo add_edit_client($param->data);return;
         }
        else if($param->method === 'get_contacts_list')
        {
        	require_once constant('MODULES_DIR') 	. '/clients.php';
        	echo get_contacts_list($param->data);
			return;
        }
        else if($param->method === 'add_edit_contacts')
        {
        	require_once constant('MODULES_DIR') 	. '/clients.php';
        	echo add_edit_contacts($param->data);
			return;
        } */
//         else if($param->method === 'update_contact_attachment')
//         {
//         	require_once constant('MODULES_DIR') 	. '/clients.php';
//         	echo update_contact_attachment($param->data);
//         }
//         else if($param->method === 'add_edit_client_comm')
//         {
//         	require_once constant('MODULES_DIR') 	. '/clients.php';
//         	echo add_edit_client_comm($param->data);
//         }
      /*    else if($param->method === 'get_comm_list')
         {
         	require_once constant('MODULES_DIR') 	. '/clients.php';
         	echo get_comm_list($param->data);return;
         } */
//         else if($param->method === 'update_comm_attachment')
//         {
//         	require_once constant('MODULES_DIR') 	. '/clients.php';
//         	echo update_comm_attachment($param->data);
//         }
       /*  else if($param->method === 'get_client_contacts')
         {
         	require_once constant('MODULES_DIR') 	. '/clients.php';
         	echo get_client_contacts($param->data);return;
         } */
//         else if($param->method === 'get_client_report')
//         {
//         	require_once constant('MODULES_DIR')    . '/clients.php';
//         	echo get_client_report($param->data);
//         }
//         else if($param->method === 'get_client_report_drop_down_values')
//         {
//         	require_once constant('MODULES_DIR')    . '/clients.php';
//         	echo get_client_report_drop_down_values();
//         }
//         else if ($param->method === 'populate_created_by') 
//         {
//         	require_once constant('MODULES_DIR') . '/clients.php';
//         	echo populate_created_by($param->data);
//         }
//         else if ($param->method === 'deactivate_clients')
//         {
//         	require_once constant('MODULES_DIR') . '/clients.php';
//         	echo deactivate_clients($param->data);
//         }
        
        
//         else if ($param->method === 'approve_client_details') 
//         {
//         	require_once constant('MODULES_DIR') . '/clients.php';
//         	echo approve_client_details($param->data);
//         } 
        /*  else if ($param->method === 'get_contacts_for_approval') 
         {
         	require_once constant('MODULES_DIR') . '/clients.php';
         	echo get_contacts_for_approval($param->data);return;
         }  */
//         else if ($param->method === 'assign_client_contacts') 
//         {
//         	require_once constant('MODULES_DIR') . '/clients.php';
//         	echo assign_client_contacts($param->data);
//         } 
//         else if ($param->method === 'get_clients_for_auto_suggest') 
//         {
//         	require_once constant('MODULES_DIR') . '/clients.php';
//         	echo get_clients_for_auto_suggest();
//         } 
//         else if ($param->method === 'get_client_approvals') 
//         {
//         	require_once constant('MODULES_DIR') . '/clients.php';
//         	echo get_client_approvals($param->data);
//         } 
//         else if ($param->method === 'deactivate_clients_tmp') 
//         {
//         	require_once constant('MODULES_DIR') . '/clients.php';
//         	echo deactivate_clients_tmp($param->data);
//         } 
//         else if ($param->method === 'add_edit_tmp_client') 
//         {
//         	require_once constant('MODULES_DIR') . '/clients.php';
//         	echo add_edit_tmp_client($param->data);
//         } 
       /*   else if ($param->method === 'get_documents_list_for_client') 
         {
         	require_once constant('MODULES_DIR') . '/clients.php';
         	echo get_documents_list_for_client($param->data);return;
         } 
         else if ($param->method === 'get_client_drop_down_values')
         {
         	require_once constant('MODULES_DIR') . '/clients.php';
         	echo get_client_drop_down_values($param->data);
         }
         else if ($param->method === 'get_client_details') 
        {
         	require_once constant('MODULES_DIR') . '/clients.php';
         	echo get_client_details($param->data);return;
         } */
//         else if ($param->method === 'assign_principal_account') 
//         {
//         	require_once constant('MODULES_DIR') . '/clients.php';
//         	echo assign_principal_account($param->data);
//         } 
       /*  else if ($param->method === 'get_principal_accounts') 
        {
        	require_once constant('MODULES_DIR') . '/clients.php';
        	echo get_principal_accounts($param->data);return;
         }  */
//         else if ($param->method === 'delete_principal_account') 
//         {	
//         	require_once constant('MODULES_DIR') . '/clients.php';
//         	echo delete_principal_account($param->data);
//         }
//         else if ($param->method === 'get_offerings_by_contacts')
//         {
//         	require_once constant('MODULES_DIR') . '/clients.php';
//         	echo get_offerings_by_contacts($param->data);
//         } 
//         else if ($param->method === 'validate_contact_email')
//         {
//         	require_once constant('MODULES_DIR') . '/clients.php';
//         	echo validate_contact_email($param->data);
//         }
			/* else if ($param->method === 'get_clients_by_type') 
			{
				require_once constant('MODULES_DIR') . '/clients.php';
				echo get_clients_by_type($param->data);
				return;
			} */
//         else if ($param->method === 'get_stake_holders_excel') 
//         {
//         	require_once constant('MODULES_DIR') . '/clients.php';
//         	echo get_stake_holders_excel($param->data);
//         } 
//         else if ($param->method === 'add_stake_holders_excel') 
//         {
//         	require_once constant('MODULES_DIR') . '/clients.php';
//         	echo add_stake_holders_excel($param->data);
//         }
//         else if ($param->method === 'update_stake_holders_multiple')
//         {
//         	require_once constant('MODULES_DIR') . '/clients.php';
//         	echo update_stake_holders_multiple($param->data);
//         }
// //         END OF CLIENTS SERVICE
 
        
// //         START OF TASK SERVICE
//         else if($param->method === 'get_task_report_list')
//         {
//         	require_once constant('MODULES_DIR') 	. '/task.php';
//         	echo get_task_report_list($param->data);
//         }
//         else if($param->method === 'get_task_report_assigned')
//         {
//         	require_once constant('MODULES_DIR') 	. '/task.php';
//         	echo get_task_report_assigned($param->data);
//         }
//         else if($param->method === 'get_task_report_task_detail')
//         {
//         	require_once constant('MODULES_DIR') 	. '/task.php';
//         	echo get_task_report_task_detail($param->data);
//         }
//         else if($param->method === 'get_task_report_assign_to_detail')
//         {
//         	require_once constant('MODULES_DIR') 	. '/task.php';
//         	echo get_task_report_assign_to_detail($param->data);
//         }
       /*   else if($param->method === 'add_edit_schedule_tasks')
         {
         	require_once constant('MODULES_DIR') 	. '/task.php';
         	echo add_edit_schedule_tasks($param->data);
			return;
         } */
//         else if($param->method === 'update_schedule_task_attachment')
//         {
//         	require_once constant('MODULES_DIR') 	. '/task.php';
//         	echo update_schedule_task_attachment($param->data);
//         }
//         else if($param->method === 'get_schedule_tasks_list')
//         {
//         	require_once constant('MODULES_DIR') 	. '/task.php';
//         	echo get_schedule_tasks_list($param->data);
//         }
     /*     else if($param->method === 'get_tasks_list_group')
         {
         	require_once constant('MODULES_DIR') 	. '/task.php';
         	echo get_tasks_list_group($param->data);
         }
         else if($param->method === 'get_tasks_list_new')
         {
         	require_once constant('MODULES_DIR') 	. '/task.php';
         	echo get_tasks_list_new($param->data);
         }
		 else if($param->method === 'get_client_tasks_list_new')
         {
         	require_once constant('MODULES_DIR') 	. '/task.php';
         	echo get_client_tasks_list_new($param->data);
			return;
         }
		 else if($param->method === 'accept_client_task')
         {
         	require_once constant('MODULES_DIR') 	. '/task.php';
         	echo accept_client_task($param->data);
			return;
         }
		 else if($param->method === 'get_tasks_template_list_new')
         {
         	require_once constant('MODULES_DIR') 	. '/task.php';
         	echo get_tasks_template_list_new($param->data);
         }
         else if($param->method === 'get_tasks_list_waiting_review_approval')
         {
         	require_once constant('MODULES_DIR') 	. '/task.php';
         	echo get_tasks_list_waiting_review_approval($param->data);return;
        } */
//         else if($param->method === 'get_task_reply_list_new')
//         {
//         	require_once constant('MODULES_DIR') 	. '/task.php';
//         	echo get_task_reply_list_new($param->data);
//         }
       /*  else if($param->method === 'add_edit_tasks_reply_new')
        {
        	require_once constant('MODULES_DIR') 	. '/task.php';
        	echo add_edit_tasks_reply_new($param->data);
        } */
//         else if($param->method === 'update_task_attachment_reply_new')
//         {
//         	require_once constant('MODULES_DIR') 	. '/task.php';
//         	echo update_task_attachment_reply_new($param->data);
//         }
       /*   else if($param->method === 'add_edit_tasks_new')
         {
         	require_once constant('MODULES_DIR') 	. '/task.php';
         	echo add_edit_tasks_new($param->data);
         }
		 else if($param->method === 'add_edit_client_tasks_new')
         {
         	require_once constant('MODULES_DIR') 	. '/task.php';
         	echo add_edit_client_tasks_new($param->data);
			 return;
         } */
//         else if($param->method === 'update_task_attachment_new')
//         {
//         	require_once constant('MODULES_DIR') 	. '/task.php';
//         	echo update_task_attachment_new($param->data);
//         }
//         else if($param->method === 'update_task_review_approval')
//         {
//         	require_once constant('MODULES_DIR') 	. '/task.php';
//         	echo update_task_review_approval($param->data);
//         }
//         else if($param->method === 'get_sbg_chart')
//         {
//         	require_once constant('MODULES_DIR') 	. '/task.php';
//         	echo get_sbg_chart($param->data);
//         }
        
//         else if($param->method === 'get_oc_chart')
//         {
//         	require_once constant('MODULES_DIR') 	. '/task.php';
//         	echo get_oc_chart($param->data);
//         }
//         else if($param->method === 'get_oc_detail_chart')
//         {
//         	require_once constant('MODULES_DIR') 	. '/task.php';
//         	echo get_oc_detail_chart($param->data);
//         }
//         else if($param->method === 'get_sbg_report_list')
//         {
//         	require_once constant('MODULES_DIR') 	. '/task.php';
//         	echo get_sbg_report_list($param->data);
//         }
       /*   else if($param->method === 'get_schedule_upload')
         {
        	require_once constant('MODULES_DIR') 	. '/task.php';
         	echo get_schedule_upload($param->data);return;
         } */
//         else if($param->method === 'add_schedule_upload_batch')
//         {
//         	require_once constant('MODULES_DIR') 	. '/task.php';
//         	echo add_schedule_upload_batch($param->data);
//         }
        /*  else if($param->method === 'get_tasks_count_waiting_review_approval')
         {
        	require_once constant('MODULES_DIR') 	. '/task.php';
         	echo get_tasks_count_waiting_review_approval($param->data);
         }
         else if($param->method === 'get_tasks_my_priority')
         {
        	require_once constant('MODULES_DIR') 	. '/task.php';
        	echo get_tasks_my_priority($param->data);return;
        } */
//         else if($param->method === 'update_schedule_task_status')
//         {
//         	require_once constant('MODULES_DIR') 	. '/task.php';
//         	echo update_schedule_task_status($param->data);
//         }
//         else if($param->method === 'add_edit_schedule_tasks_batch')
//         {
//         	require_once constant('MODULES_DIR') 	. '/task.php';
//         	echo add_edit_schedule_tasks_batch($param->data);
//         }
       /*   else if($param->method === 'get_tasks_template_list')
         {
         	require_once constant('MODULES_DIR') 	. '/task.php';
         	echo get_tasks_template_list($param->data);
         }
         else if($param->method === 'add_edit_tasks_template')
         {
         	require_once constant('MODULES_DIR') 	. '/task.php';
         	echo add_edit_tasks_template($param->data);
         } */
//         else if($param->method === 'update_task_template_attachment')
//         {
//         	require_once constant('MODULES_DIR') 	. '/task.php';
//         	echo update_task_template_attachment($param->data);
//         }
//         else if($param->method === 'get_tasks_report_list')
//         {
//         	require_once constant('MODULES_DIR') 	. '/task.php';
//         	echo get_tasks_report_list($param->data);
//         }
//         else if($param->method === 'get_task_drop_down_values')
//         {
//         	require_once constant('MODULES_DIR') 	. '/task.php';
//         	echo get_task_drop_down_values($param);
//         }
//         else if ($param->method === 'delete_tasks_attachment') 
//         {
//         	require_once constant('MODULES_DIR') . '/task.php';
//         	echo delete_tasks_attachment($param->data);
//         }
//         else if ($param->method === 'get_tasks_for_timesheet')
//         {
//         	require_once constant('MODULES_DIR') . '/task.php';
//         	echo get_tasks_for_timesheet($param->data);
//         }
     /*     else if ($param->method === 'add_assignee_for_master_task') 
 		{
             require_once constant('MODULES_DIR') . '/task.php';
             echo add_assignee_for_master_task($param->data);
         }
         else if ($param->method === 'get_master_task_detail') 
 		{
             require_once constant('MODULES_DIR') . '/task.php';
             echo get_master_task_detail($param->data);return;
         }
//         else if ($param->method === 'remove_assignee_for_master_task') 
// 		{
//             require_once constant('MODULES_DIR') . '/task.php';
//             echo remove_assignee_for_master_task($param->data);
//         }
         else if ($param->method === 'save_checklist_for_master_task') 
 		{
             require_once constant('MODULES_DIR') . '/task.php';
             echo save_checklist_for_master_task($param->data);
         }



 		else if ($param->method === 'get_tasks_drop_down_values') 
 		{
            require_once constant('MODULES_DIR') . '/task.php';
            echo get_tasks_drop_down_values($param->data);
        }
         else if ($param->method === 'add_assignee_for_task') 
 		{
             require_once constant('MODULES_DIR') . '/task.php';
             echo add_assignee_for_task($param->data);
         }
		  else if ($param->method === 'add_assignee_for_task_template') 
 		{
             require_once constant('MODULES_DIR') . '/task.php';
             echo add_assignee_for_task_template($param->data);
         }
         else if ($param->method === 'get_task_detail') 
 		{
            require_once constant('MODULES_DIR') . '/task.php';
            echo get_task_detail($param->data);
        }
		else if ($param->method === 'get_task_template_detail') 
 		{
            require_once constant('MODULES_DIR') . '/task.php';
            echo get_task_template_detail($param->data);
        }
         else if ($param->method === 'save_checklist_for_task') 
 		{
			
            require_once constant('MODULES_DIR') . '/task.php';
             echo save_checklist_for_task($param->data);
         }
		
		   else if ($param->method === 'save_checklist_for_task_template') 
 		{

            require_once constant('MODULES_DIR') . '/task.php';
             echo save_checklist_for_task_template($param->data);
         }
         else if ($param->method === 'remove_assignee_for_task') 
 		{
             require_once constant('MODULES_DIR') . '/task.php';
             echo remove_assignee_for_task($param->data);
         }
		 else if ($param->method === 'remove_assignee_for_task_template') 
 		{
             require_once constant('MODULES_DIR') . '/task.php';
             echo remove_assignee_for_task_template($param->data);
         }
 */
        
// //         END OF TASK SERVICE
        
// //         STRAT OF JOB ORDER SERVICE
//         else if($param->method === 'get_job_list')
//         {
//         	require_once constant('MODULES_DIR') 	. '/jobPost.php';
//         	echo get_job_list($param->data);
//         }
//         else if($param->method === 'add_edit_job')
//         {
//         	require_once constant('MODULES_DIR') 	. '/jobPost.php';
//         	echo add_edit_job($param->data);
//         }
//         else if($param->method === 'get_job_details')
//         {
//         	require_once constant('MODULES_DIR') 	. '/jobPost.php';
//         	echo get_job_details($param->data);
//         }
//         else if($param->method === 'delete_job')
//         {
//         	require_once constant('MODULES_DIR') 	. '/jobPost.php';
//         	echo delete_job($param->data);
//         }
//         else if($param->method === 'job_category')
//         {
//         	require_once constant('MODULES_DIR') 	. '/jobPost.php';
//         	echo delete_job_category($param->data);
//         }
        
//         else if($param->method === 'get_job_apply_list')
//         {
//         	require_once constant('MODULES_DIR') 	. '/jobPost.php';
//         	echo get_job_apply_list($param->data);
//         }
// // 		END OF JOB ORDER SERVICES
        
        
//         else if($param->method === 'get_communication_list')
//         {
//         	require_once constant('MODULES_DIR') 	. '/communication.php';
//         	echo get_communication_list($param->data);
//         }
//         else if($param->method === 'add_edit_comm')
//         {
//         	require_once constant('MODULES_DIR') 	. '/communication.php';
//         	echo add_edit_comm($param->data);
//         }
//         else if($param->method === 'add_edit_comm_reply')
//         {
//         	require_once constant('MODULES_DIR') 	. '/communication.php';
//         	echo add_edit_comm_reply($param->data);
//         }
//         else if($param->method === 'get_comm_reply_list')
//         {
//         	require_once constant('MODULES_DIR') 	. '/communication.php';
//         	echo get_comm_reply_list($param->data);
//         }
//         else if($param->method === 'update_communication_attachment')
//         {
//         	require_once constant('MODULES_DIR') 	. '/communication.php';
//         	echo update_communication_attachment($param->data);
//         }
//         else if($param->method === 'get_comm_report_list')
//         {
//         	require_once constant('MODULES_DIR') 	. '/communication.php';
//         	echo get_comm_report_list($param->data);
//         }
//         else if($param->method === 'close_comm_case')
//         {
//         	require_once constant('MODULES_DIR') 	. '/communication.php';
//         	echo close_comm_case($param->data);
//         }
        
        
        
//         else if($param->method === 'get_control_panel_email_list')
//         {
//         	require_once constant('MODULES_DIR') 	. '/controlpanel.php';
//         	echo get_control_panel_email_list($param->data);
//         }
//         else if($param->method === 'get_control_panel_change_pass')
//         {
//         	require_once constant('MODULES_DIR') 	. '/controlpanel.php';
//         	echo get_control_panel_change_pass($param->data);
//         }
//         else if($param->method === 'get_control_panel_delete_email')
//         {
//         	require_once constant('MODULES_DIR') 	. '/controlpanel.php';
//         	echo get_control_panel_delete_email($param->data);
//         }
//         else if($param->method === 'get_control_panel_add_email')
//         {
//         	require_once constant('MODULES_DIR') 	. '/controlpanel.php';
//         	echo get_control_panel_add_email($param->data);
//         }
//         else if($param->method === 'send_email_add_notification')
//         {
//         	require_once constant('MODULES_DIR') 	. '/controlpanel.php';
//         	echo send_email_add_notification($param->data);
// 		}
// 		else if($param->method === 'is_control_panel_email_exist')
//         {
//         	require_once constant('MODULES_DIR') 	. '/controlpanel.php';
//         	echo is_control_panel_email_exist($param->data);
//         }
        
        
//         else if($param->method === 'get_attendance_users_list')
//         {
//         	require_once constant('MODULES_DIR') 	. '/attendance.php';
//         	echo get_attendance_users_list($param->data);
//         }
//         else if($param->method === 'sync_attendance_users')
//         {
//         	require_once constant('MODULES_DIR') 	. '/attendance.php';
//         	echo sync_attendance_users($param->data);
//         }
//         else if($param->method === 'get_attendance_last_sync')
//         {
//         	require_once constant('MODULES_DIR') 	. '/attendance.php';
//         	echo get_attendance_last_sync($param->data);
//         }
//         else if($param->method === 'get_attendance_list')
//         {
//         	require_once constant('MODULES_DIR') 	. '/attendance.php';
//         	echo get_attendance_list($param->data);
//         }
//         else if($param->method === 'sync_attendance')
//         {
//         	require_once constant('MODULES_DIR') 	. '/attendance.php';
//         	echo sync_attendance($param->data);
//         }
//         else if($param->method === 'get_attendance_month')
//         {
//         	require_once constant('MODULES_DIR') 	. '/attendance.php';
//         	echo get_attendance_month($param->data);
//         }
//         else if($param->method === 'get_attendance_month_detail')
//         {
//         	require_once constant('MODULES_DIR') 	. '/attendance.php';
//         	echo get_attendance_month_detail($param->data);
//         }
//         else if($param->method === 'add_edit_attendance_remarks')
//         {
//         	require_once constant('MODULES_DIR') 	. '/attendance.php';
//         	echo add_edit_attendance_remarks($param->data);
//         }
//         else if($param->method === 'verify_approve_attendance')
//         {
//         	require_once constant('MODULES_DIR') 	. '/attendance.php';
//         	echo verify_approve_attendance($param->data);
//         }
//         else if($param->method === 'add_main_remarks_attendance')
//         {
//         	require_once constant('MODULES_DIR') 	. '/attendance.php';
//         	echo add_main_remarks_attendance($param->data);
//         }
//         else if($param->method === 'get_timesheet_attendance_report')
//         {
//         	require_once constant('MODULES_DIR') 	. '/attendance.php';
//         	echo get_timesheet_attendance_report($param->data);
//         }
//         else if ($param->method === 'get_attendance_tracker') 
// 		{
// 			require_once constant('MODULES_DIR') . '/attendance.php';
// 			echo get_attendance_tracker($param->data);
// 		}
// 		else if ($param->method === 'get_attendance_tracker_v2') 
// 		{
// 			require_once constant('MODULES_DIR') . '/attendance.php';
// 			echo get_attendance_tracker_v2($param->data);
// 		}
// 		else if ($param->method === 'get_attendance_summary') 
// 		{
//             require_once constant('MODULES_DIR') . '/attendance.php';
//             echo get_attendance_summary($param->data);
//         }
        
        
        
        
//         else if($param->method === 'get_outbound_list')
//         {
//         	require_once constant('MODULES_DIR') 	. '/outbound_document.php';
//         	echo get_outbound_list($param->data);
//         }
//         else if($param->method === 'add_edit_outbound')
//         {
//         	require_once constant('MODULES_DIR') 	. '/outbound_document.php';
//         	echo add_edit_outbound($param->data);
//         }
//         else if($param->method === 'get_outbound_details')
//         {
//         	require_once constant('MODULES_DIR') 	. '/outbound_document.php';
//         	echo get_outbound_details($param->data);
//         }
//         else if($param->method === 'delete_outbound')
//         {
//         	require_once constant('MODULES_DIR') 	. '/outbound_document.php';
//         	echo delete_outbound($param->data);
//         }
//         else if($param->method === 'outbound_verify_approval')
//         {
//         	require_once constant('MODULES_DIR') 	. '/outbound_document.php';
//         	echo outbound_verify_approval($param->data);
//         }
//         else if($param->method === 'outbound_add_edit_remark')
//         {
//         	require_once constant('MODULES_DIR') 	. '/outbound_document.php';
//         	echo outbound_add_edit_remark($param->data);
//         }
//         else if($param->method === 'send_email_verifier_approver')
//         {
//         	require_once constant('MODULES_DIR') 	. '/outbound_document.php';
//         	echo send_email_verifier_approver($param->data);
//         }
//         else if($param->method === 'send_email_notification_outbound')
//         {
//         	require_once constant('MODULES_DIR') 	. '/outbound_document.php';
//         	echo send_email_notification_outbound($param->data);
//         }
//         else if($param->method === 'send_email_verifier_approver_outbound')
//         {
//         	require_once constant('MODULES_DIR') 	. '/outbound_document.php';
//         	echo send_email_verifier_approver_outbound($param->data);
//         }
        
        
        
//         else if($param->method === 'get_document_archiving_list')
//         {
//         	require_once constant('MODULES_DIR') 	. '/document_archiving.php';
//         	echo get_document_archiving_list($param->data);
//         }
//         else if($param->method === 'add_edit_document_archiving')
//         {
//         	require_once constant('MODULES_DIR') 	. '/document_archiving.php';
//         	echo add_edit_document_archiving($param->data);
//         }
//         else if($param->method === 'get_document_archiving_details')
//         {
//         	require_once constant('MODULES_DIR') 	. '/document_archiving.php';
//         	echo get_document_archiving_details($param->data);
//         }
//         else if($param->method === 'delete_document_archiving')
//         {
//         	require_once constant('MODULES_DIR') 	. '/document_archiving.php';
//         	echo delete_document_archiving($param->data);
//         }
//         else if($param->method === 'document_archiving_verify_approval')
//         {
//         	require_once constant('MODULES_DIR') 	. '/document_archiving.php';
//         	echo document_archiving_verify_approval($param->data);
//         }
//         else if($param->method === 'document_archiving_add_edit_remark')
//         {
//         	require_once constant('MODULES_DIR') 	. '/document_archiving.php';
//         	echo document_archiving_add_edit_remark($param->data);
//         }
//         else if($param->method === 'send_email_verifier_approver_archiving')
//         {
//         	require_once constant('MODULES_DIR') 	. '/document_archiving.php';
//         	echo send_email_verifier_approver_archiving($param->data);
//         }
        
        
        
//         else if($param->method === 'test_chat_login')
//         {
//         	require_once constant('MODULES_DIR') 	. '/chat.php';
//         	echo chat_login($param->data);
// 		}
// 		else if($param->method === 'chat_create_user')
//         {
//         	require_once constant('MODULES_DIR') 	. '/chat.php';
//         	echo chat_create_user($param->data);
//         }
// 		else if($param->method === 'chat_get_user_status')
//         {
//         	require_once constant('MODULES_DIR') 	. '/chat.php';
//         	echo chat_get_user_status($param->data);
//         }
        
        
//         else if($param->method === 'get_service_request_list')
//         {
//         	require_once constant('MODULES_DIR') 	. '/service_request.php';
//         	echo get_service_request_list($param->data);
//         }
//         else if($param->method === 'add_edit_service_request')
//         {
//         	require_once constant('MODULES_DIR') 	. '/service_request.php';
//         	echo add_edit_service_request($param->data);
//         }
//         else if($param->method === 'send_email_verifier_approver_service_request')
//         {
//         	require_once constant('MODULES_DIR') 	. '/service_request.php';
//         	echo send_email_verifier_approver_service_request($param->data);
//         }
//         else if($param->method === 'get_service_request_details')
//         {
//         	require_once constant('MODULES_DIR') 	. '/service_request.php';
//         	echo get_service_request_details($param->data);
//         }
//         else if($param->method === 'delete_service_request')
//         {
//         	require_once constant('MODULES_DIR') 	. '/service_request.php';
//         	echo delete_service_request($param->data);
//         }
//         else if($param->method === 'service_request_add_edit_remark')
//         {
//         	require_once constant('MODULES_DIR') 	. '/service_request.php';
//         	echo service_request_add_edit_remark($param->data);
//         }
//         else if($param->method === 'service_request_verify_approval')
//         {
//         	require_once constant('MODULES_DIR') 	. '/service_request.php';
//         	echo service_request_verify_approval($param->data);
//         }
        
        
        
        
//         else if($param->method === 'add_edit_notification')
//         {
//         	require_once constant('MODULES_DIR') 	. '/notification.php';
//         	echo add_edit_notification($param->data);
//         }
//         else if($param->method === 'update_noty_status')
//         {
//         	require_once constant('MODULES_DIR') 	. '/notification.php';
//         	echo update_noty_status($param->data);
//         }
//         else if($param->method === 'add_edit_noty_reply')
//         {
//         	require_once constant('MODULES_DIR') 	. '/notification.php';
//         	echo add_edit_noty_reply($param->data);
//         }
//         else if($param->method === 'get_noty_reply_list')
//         {
//         	require_once constant('MODULES_DIR') 	. '/notification.php';
//         	echo get_noty_reply_list($param->data);
//         }
//         else if($param->method === 'update_noty_attachment')
//         {
//         	require_once constant('MODULES_DIR') 	. '/notification.php';
//         	echo update_noty_attachment($param->data);
//         }
//         else if($param->method === 'update_noty_attachment_reply')
//         {
//         	require_once constant('MODULES_DIR') 	. '/notification.php';
//         	echo update_noty_attachment_reply($param->data);
//         }
//         else if($param->method === 'get_noty_list')
//         {
//         	require_once constant('MODULES_DIR') 	. '/notification.php';
//         	echo get_noty_list($param->data);
//         }
//         else if($param->method === 'delete_notification')
//         {
//         	require_once constant('MODULES_DIR') 	. '/notification.php';
//         	echo delete_notification($param->data);
//         }
//         else if($param->method === 'delete_noty_attachment')
//         {
//         	require_once constant('MODULES_DIR') 	. '/notification.php';
//         	echo delete_noty_attachment($param->data);
//         }
//         else if($param->method === 'send_email_verifier_approver_noty')
//         {
//         	require_once constant('MODULES_DIR') 	. '/notification.php';
//         	echo send_email_verifier_approver_noty($param->data);
//         }
//         else if($param->method === 'send_notification_email')
//         {
//         	require_once constant('MODULES_DIR') 	. '/notification.php';
//         	echo send_notification_email($param->data);
//         }
//         else if($param->method === 'get_noty_report_list')
//         {
//         	require_once constant('MODULES_DIR') 	. '/notification.php';
//         	echo get_noty_report_list($param->data);
//         }
// 		else if($param->method === 'get_notification_drop_down_values')
//         {
//         	require_once constant('MODULES_DIR') 	. '/notification.php';
//         	echo get_notification_drop_down_values($param->data);
//         }
        
		
//         else if($param->method === 'get_admin_events')
//         {
//         	require_once constant('MODULES_DIR')    . '/dashboard.php';
//         	echo get_admin_events($param);
//         }
//         else if($param->method === 'get_admin_event_detail')
//         {
//         	require_once constant('MODULES_DIR')    . '/dashboard.php';
//         	echo get_admin_event_detail($param->data);
//         }
//         else if($param->method === 'get_user_events')
//         {
//         	require_once constant('MODULES_DIR')    . '/dashboard.php';
//         	echo get_user_events($param);
//         }
//         else if($param->method === 'get_user_event_detail')
//         {
//         	require_once constant('MODULES_DIR')    . '/dashboard.php';
//         	echo get_user_event_detail($param->data);
//         }
//         else if($param->method === 'populate_dashboard_all_user_detail')
//         {
//         	require_once constant('MODULES_DIR')    . '/dashboard.php';
//         	echo populate_dashboard_all_user_detail($param->data);
//         }
//         else if ($param->method === 'get_tasks_for_dashboard') 
//         {
//         	require_once constant('MODULES_DIR') . '/dashboard.php';
//         	echo get_tasks_for_dashboard($param->data);
// 		}
// 		else if ($param->method === 'get_admin_dashboard') 
//         {
//         	require_once constant('MODULES_DIR') . '/dashboard.php';
//         	echo get_admin_dashboard($param->data);
//         }
//         else if ($param->method === 'get_user_dashboard') 
//         {
//         	require_once constant('MODULES_DIR') . '/dashboard.php';
//         	echo get_user_dashboard($param->data);
//         }
        
        
// //         START OF PAYMENT VOUCHER SERVICE
//         else if ($param->method === 'get_payment_voucher_drop_down_values') 
//         {
//         	require_once constant('MODULES_DIR') . '/payment_voucher.php';
//         	echo get_payment_voucher_drop_down_values($param->data);
//         } 
//         else if ($param->method === 'add_edit_payment_voucher') 
//         {
//         	require_once constant('MODULES_DIR') . '/payment_voucher.php';
//         	echo add_edit_payment_voucher($param->data);
//         } 
//         else if ($param->method === 'get_payment_voucher_list') 
//         {
//         	require_once constant('MODULES_DIR') . '/payment_voucher.php';
//         	echo get_payment_voucher_list($param->data);
//         } 
//         else if ($param->method === 'get_payment_voucher_details') 
//         {
//         	require_once constant('MODULES_DIR') . '/payment_voucher.php';
//         	echo get_payment_voucher_details($param->data);
//         } 
//         else if ($param->method === 'add_edit_payment_detail') 
//         {
//         	require_once constant('MODULES_DIR') . '/payment_voucher.php';
//         	echo add_edit_payment_detail($param->data);
//         } 
//         else if ($param->method === 'get_payments_list') 
//         {
//         	require_once constant('MODULES_DIR') . '/payment_voucher.php';
//         	echo get_payments_list($param->data);
//         } 
//         else if ($param->method === 'update_payment_voucher_status') 
//         {
//         	require_once constant('MODULES_DIR') . '/payment_voucher.php';
//         	echo update_payment_voucher_status($param->data);
//         }
//         else if ($param->method === 'delete_payment_voucher') 
//         {
//         	require_once constant('MODULES_DIR') . '/payment_voucher.php';
//         	echo delete_payment_voucher($param->data);
//         } 
//         else if ($param->method === 'payment_voucher_add_edit_remark') 
//         {
//         	require_once constant('MODULES_DIR') . '/payment_voucher.php';
//         	echo payment_voucher_add_edit_remark($param->data);
//         } 
//         else if ($param->method === 'get_payment_voucher_to_print') 
//         {
//         	require_once constant('MODULES_DIR') . '/payment_voucher.php';
//         	echo get_payment_voucher_to_print($param->data);
//         }
// //         END OF PAYMENT VOUCHER SERVICE


// //         START OF BACKUP SERVICE
// 		else if ($param->method === 'urbackup_login') 
// 		{
// 			require_once constant('MODULES_DIR') . '/urbackup.php';
// 			echo urbackup_login($param->data);
// 		}	
// 		else if ($param->method === 'urbackup_status') 
// 		{
// 			require_once constant('MODULES_DIR') . '/urbackup.php';
// 			echo urbackup_status($param->data);
// 		}	
// 		else if ($param->method === 'urbackup_backups') 
// 		{
// 			require_once constant('MODULES_DIR') . '/urbackup.php';
// 			echo urbackup_backups($param->data);
// 		}
// 		else if ($param->method === 'urbackup_logs') 
// 		{
// 			require_once constant('MODULES_DIR') . '/urbackup.php';
// 			echo urbackup_logs($param->data);
// 		}
// 		else if ($param->method === 'urbackup_statistics') 
// 		{
// 			require_once constant('MODULES_DIR') . '/urbackup.php';
// 			echo urbackup_statistics($param->data);
// 		}
// 		else if ($param->method === 'urbackup_settings') 
// 		{
// 			require_once constant('MODULES_DIR') . '/urbackup.php';
// 			echo urbackup_settings($param->data);
// 		}	
// 		else if ($param->method === 'urbackup_add_client') 
// 		{
// 			require_once constant('MODULES_DIR') . '/urbackup.php';
// 			echo urbackup_add_client($param->data);
// 		}		
// //         END OF BACKUP SERVICE

//         START OF DOCUMENT SERVICE
	/* 	else if ($param->method === 'add_edit_documents') 
		{
			require_once constant('MODULES_DIR') . '/user_documents.php';
			echo add_edit_documents($param->data);
			return;
		} 
		else if ($param->method === 'get_documents_list') 
		{
			require_once constant('MODULES_DIR') . '/user_documents.php';
			echo get_documents_list($param->data);
			return;
		}  */
		/* else if ($param->method === 'get_documents_drop_down_values') 
		{
			require_once constant('MODULES_DIR') . '/user_documents.php';
			echo get_documents_drop_down_values($param->data);
			return;
		}  */
	/* 	else if ($param->method === 'get_doc_details') 
		{
			require_once constant('MODULES_DIR') . '/user_documents.php';
			echo get_doc_details($param->data);
			return;
		} 
		else if ($param->method === 'send_email_notification_document') 
		{
			require_once constant('MODULES_DIR') . '/user_documents.php';
			echo send_email_notification_document($param->data);
			return;
		}  */
// 		else if ($param->method === 'archive_user_document') 
// 		{
// 			require_once constant('MODULES_DIR') . '/user_documents.php';
// 			echo archive_user_document($param->data);
// 		} 
		/* else if ($param->method === 'delete_user_document') 
		{
			require_once constant('MODULES_DIR') . '/user_documents.php';
			echo delete_user_document($param->data);
			return;
		}
		else if ($param->method === 'get_document_initial_data') 
		{
			require_once constant('MODULES_DIR') . '/user_documents.php';
			echo get_document_initial_data($param->data);
			return;
		} */
// //         END OF DOCUMENT SERVICE

// //         START OF HELPER FILE SERVICE
// 		else if ($param->method === 'get_accessibility') 
// 		{
// 			echo json_encode(get_accessibility($param->data->module_id,$param->data->access));
// 			return;
// 		}
// 		else if ($param->method === 'execute_on_server')
// 		{
// 			echo execute_on_server($param->data);
// 			return;
// 		}
// 		else if ($param->method === 'execute_on_server_single')
// 		{
// 			echo execute_on_server_single($param->data);
// 			return;
// 		}
// 		else if ($param->method === 'execute_on_server_custom')
// 		{
// 			echo execute_on_server_custom($param->data);
// 			return;
// 		}

		/* else if($param->method === 'get_files')
		{
			require_once constant('MODULES_DIR') 	. '/files.php';
			echo get_files($param->data);
			return;
		}
		else if($param->method === 'add_files')
		{
			require_once constant('MODULES_DIR') 	. '/files.php';
			echo add_files($param->data);
			return;
		}  */
		/* else if($param->method === 'delete_files')
		{
			require_once constant('MODULES_DIR') 	. '/files.php';
			echo delete_files($param->data);
			return;
		} */
//         END OF HELPER FILE SERVICE
		// CLIENT PORTAL
		/* else if($param->method === 'client_login') {
			require_once constant('MODULES_DIR') 	. '/client_login.php';
			echo client_login($param);
			return;
		}
		else if($param->method === 'get_client_task_list') {
			require_once constant('MODULES_DIR') 	. '/task.php';
			echo get_client_task_list($param->data);
			return;
		} */


		else if ($param->method === 'get_service_request_search_dropdown') 
		{
			require_once constant('MODULES_DIR') . '/common.php';
			echo get_service_request_search_dropdown($param->data);
			return;
		}

		else if ($param->method === 'get_contract_search_dropdown') 
		{
			require_once constant('MODULES_DIR') . '/common.php';
			echo get_contract_search_dropdown($param->data);
			return;
		}

		// My Communications
		else if($param->method === 'get_everything_at_once_altrawise')
        {
        	require_once constant('MODULES_DIR') 	. '/common.php';
         	echo get_everything_at_once_altrawise($param->data);
		}
		else if ($param->method === 'get_comm_enquiry_categories') 
		{
			require_once constant('MODULES_DIR') . '/common.php';
			echo get_comm_enquiry_categories($param->data);
			return;
		}
		else if ($param->method === 'get_comm_status') 
		{
			require_once constant('MODULES_DIR') . '/common.php';
			echo get_comm_status($param->data);
			return;
		}
		else if ($param->method === 'get_comm_report_categories') 
		{
			require_once constant('MODULES_DIR') . '/common.php';
			echo get_comm_report_categories($param->data);
			return;
		}
		else if ($param->method === 'get_comm_report_status') 
		{
			require_once constant('MODULES_DIR') . '/common.php';
			echo get_comm_report_status($param->data);
			return;
		}
		else if ($param->method === 'get_comm_report_requestor') 
		{
			require_once constant('MODULES_DIR') . '/common.php';
			echo get_comm_report_requestor($param->data);
			return;
		}
		// My Communications
		// Attendance
		else if ($param->method === 'get_attendance_reports_employee') 
		{
			require_once constant('MODULES_DIR') . '/common.php';
			echo get_comm_report_requestor($param->data);
			return;
		}
		else if ($param->method === 'get_attendance_tracker_employee') 
		{
			require_once constant('MODULES_DIR') . '/common.php';
			echo get_comm_report_requestor($param->data);
			return;
		}
		else if ($param->method === 'get_data_dashboard') 
		{
			require_once constant('MODULES_DIR') . '/common.php';
			echo get_data_dashboard($param->data);
			return;
		}
		else if ($param->method === 'get_data_admin_dashboard') 
		{
			require_once constant('MODULES_DIR') . '/common.php';
			echo get_data_admin_dashboard($param->data);
			return;
		}
		else if ($param->method === 'get_data_admin_dashboard_details') 
		{
			require_once constant('MODULES_DIR') . '/common.php';
			echo get_data_admin_dashboard_details($param->data);
			return;
		}
		else if ($param->method === 'get_document_search_assest_check') 
		{
			require_once constant('MODULES_DIR') . '/common.php';
			echo get_document_search_assest_check();
			return;
		}
		else if ($param->method === 'get_dropdown_meeting') 
		{
			require_once constant('MODULES_DIR') . '/common.php';
			echo get_dropdown_meeting($param->data);
			return;
		}
		// Attendance
require_once  'transporter.php';
		
	}
	else
	{
		echo handle_fail_response('Please provide valid inputs');
	}
}

function is_token_valid($token)
{
	try
	{
		
		log_it(__FUNCTION__, $token,false);
		$valid = FALSE;
		
		if($token == '')
		{
			return FALSE;
		}
		
		$rs = db_query( "count(token) as token_count ",
				"cms_emp_login_sessions",
				"token	= '". stripslashes($token) . "'");
		
		if($rs[0]['token_count'] > 0)
		{
			$valid = TRUE;
		}
		
		return $valid;
	}
	catch(Exception $e)
	{
		handle_exception($e);
	}
}

function php_meta_nocache()
{
	header("Cache-Control: no-cache, must-revalidate"); // HTTP/1.1
	header("Expires: Mon, 26 Jul 1997 05:00:00 GMT"); // Date in the past
	header('Content-Type: application/json');
}
?>
