<?php
/**
 * @author 		Jamal
 * @date 		16-Nov-2018
 * @modify
 * @Note = Please follow the indentation
 *         Please follow the naming convention
 */

use setasign\Fpdi\FpdfTpl;
use setasign\Fpdi\Fpdi as FpdiFpdi;
use setasign\Fpdi\Tcpdf\Fpdi as TcpdfFpdi;
use setasign\Fpdi\Tfpdf\FpdfTpl as TfpdfFpdfTpl;
use setasign\Fpdi\Tfpdf\Fpdi;

function get_documents_list($params)
{
    try
    {
        log_it(__FUNCTION__, $params);

        $created_by     = if_property_exist($params, 'created_by','');
        $category_id    = if_property_exist($params, 'category_id','');
        $company_id		= if_property_exist($params, 'company_id','');
        $status         = if_property_exist($params, 'status','');
        $title          = if_property_exist($params, 'title','');
        $start_index	= if_property_exist($params, 'start_index',	0);
        $limit	        = if_property_exist($params, 'limit',	MAX_NO_OF_RECORDS);
        $view_all       = if_property_exist($params, 'view_all',0);
        $is_admin       = if_property_exist($params, 'is_admin','');
        $emp_id	        = if_property_exist($params, 'emp_id','');
        $from_date      = if_property_exist($params,'from_date');
        $to_date		= if_property_exist($params,'to_date');
        $user_doc_no	= if_property_exist($params, 'user_doc_no','');

        if($view_all == 1)
        {
            $where	= "1 = 1";
        }
        else
        {
            $where = $emp_id . " IN (cms_user_documents.created_by)";
        }

        if($title != '')
		{
			$where  .= " AND cms_user_documents.title LIKE '%$title%'";
		}

        if($created_by != "")
        {
            $where 	.= " AND cms_user_documents.created_by in(" . $created_by . ")";
        }
        if($category_id != "")
        {
            $where 	.= " AND cms_user_documents.ctg_id in(" . $category_id . ")";
        }

        if($from_date != '' && $to_date != '')
        {
            $where	.= " AND cms_user_documents.doc_date >= '" . $from_date . "' AND cms_user_documents.doc_date <= '" . $to_date . "'";
        }

        if($user_doc_no != '')
		{
			$where  .= " AND cms_user_documents.doc_no LIKE '%$user_doc_no%'";
		}

        if($status != "")
        {
            if($status == 'archived')
            {
                $where 	.= " AND cms_user_documents.is_archived = 1";
            }
            elseif($status == 'pending_verification')
            {
                $where 	.= " AND cms_user_documents.is_to_verify = 1 AND (select count(*) from cms_user_documents_approvals total_approvals where total_approvals.doc_no = cms_user_documents.doc_no and total_approvals.is_verified = 1) = 0";
            }
            elseif($status == 'verification_in_progress')
            {
                $where 	.= " AND (select count(*) from cms_user_documents_approvals total_approvals where total_approvals.doc_no = cms_user_documents.doc_no and total_approvals.is_verified = 1) >= 1 AND (select count(*) from cms_user_documents_approvals total_approvals where total_approvals.doc_no = cms_user_documents.doc_no and total_approvals.is_verified = 1) <> (select count(*) from cms_user_documents_approvals total_approvers where total_approvers.doc_no = cms_user_documents.doc_no)";
            }
            elseif($status == 'document_verified')
            {
                $where 	.= " AND (select count(*) from cms_user_documents_approvals total_approvals where total_approvals.doc_no = cms_user_documents.doc_no and total_approvals.is_verified = 1) = (select count(*) from cms_user_documents_approvals total_approvers where total_approvers.doc_no = cms_user_documents.doc_no)";
            }
            elseif($status == 'draft')
            {   
                $where 	.= " AND cms_user_documents.is_to_verify = 0";
            }
        }
        if($company_id != "")
        {
        	$where 	.= " AND cms_user_documents.employer_id in(" . $company_id. ")";
        }

        $where 	.= " AND cms_user_documents.is_active in(1)";
        // echo $where;exit;
        $sql                = get_doc_sql();
        $field              = $sql['fields'];
        $table              = $sql['table'];

        $rs = db_query_list
        (   $field,
            $table,
            $where, $start_index, $limit, "cms_user_documents.created_date",'DESC'
        );

        $rs_total                   = db_query_single("count(*) as total_records",$table,$where);
        $rs['total_records']        = $rs_total['total_records'];
        
        if(count((array)$rs) < 1 || !isset($rs))
        {
            return handle_fail_response('No record found');
        }
        else
        {
            return handle_success_response('Success', $rs);
        }

    }
    catch(Exception $e)
    {
        handle_exception($e);
    }
}

function get_doc_sql()
{
    try
    {
        $fields = " cms_user_documents.doc_no
                , date_format(doc_date,'" . constant('UI_DATE_FORMAT') .  "') as doc_date
                , date_format(due_date,'" . constant('UI_DATE_FORMAT') .  "') as due_date
                , cms_user_documents.title
                , cms_user_documents.employer_id
                , cms_user_documents.email_content
                , cms_user_documents.remarks
                , cms_user_documents.amount
                , cms_user_documents.created_date
                , cms_user_documents.is_to_verify
                , cms_user_documents.is_archived
                , cms_user_documents.ctg_id
                , (select count(*) from cms_user_documents_approvals total_approvers where total_approvers.doc_no = cms_user_documents.doc_no) as total_approvers_count
                , (select count(*) from cms_user_documents_approvals total_approvals where total_approvals.doc_no = cms_user_documents.doc_no and total_approvals.is_verified = 1) as total_approvals_count
                , (select descr from cms_master_list list where list.id = cms_user_documents.ctg_id) as category_name
                , (select name from cms_employees emp where emp.id = cms_user_documents.created_by) as created_by";
        
        $table = "  cms_user_documents
                ";
        
        return array('fields' => $fields,'table'=> $table);
        
    }
    catch (Exception $e)
    {
        handle_exception($e);
    }
}

function archive_user_document($params)
{
    try
    {
        log_it(__FUNCTION__, $params);
        $document_no    	= if_property_exist($params,'user_doc_no');
        $emp_id    	        = if_property_exist($params,'emp_id');

        $ap_data[':doc_no']         = $document_no;
        $ap_data[':is_archived']    = 1;
        $ap_data                    = add_timestamp_to_array($ap_data,$emp_id,1);
        db_update($ap_data, 'cms_user_documents', 'doc_no');


        //get file details from user document
        require_once constant('MODULES_DIR') . '/attachments.php';
		$params->primary_id	    = $document_no;
        //$params->secondary_id	= 'document';
		$params->module_id  	= 114;
		$attachments = json_decode(get_attachment($params))->data->attachment;
        
        require_once constant('MODULES_DIR') . '/document_archiving.php';
		$doc_archiving = add_edit_document_archiving($params);
        $doc_archiving_data = json_decode($doc_archiving)->data;

        foreach($attachments as $attachment)
        {   
            if($attachment)
            {   
                $primary_id = $attachment->primary_id;
                $filename = $attachment->filename;
                $old_path_file 	= constant("DOC_FOLDER") . "114/$primary_id/$filename";
                $new_path_file 	= constant("DOC_FOLDER") . "doc_archiving/$doc_archiving_data->document_no/$filename";
                    
                if(file_exists($old_path_file))
                {   
                    $sub_folders = dirname($new_path_file);
                    if (!file_exists($sub_folders)) 
                    {   
                        mkdir($sub_folders, 0777, true);
                    }
                    copy($old_path_file,$new_path_file);
                }
                
                $attachment_array = array();
                $attachment_array['primary_id'] = $doc_archiving_data->document_no;
                $attachment_array['module_id']  = 115;
                $attachment_array['filename']  = $attachment->filename;
                $attachment_array['emp_id']  = $emp_id;

                add_attachment((object) $attachment_array);
            }
        }
        
        return $doc_archiving;
        
    }
    catch(Exception $e)
    {
        handle_exception($e);
    }
}

function add_edit_documents($params)
{
    try
    {
        log_it(__FUNCTION__, $params);
        $doc_no    				        = if_property_exist($params,'doc_no');
        $doc_date    				    = if_property_exist($params,'doc_date');
        $due_date    				    = if_property_exist($params,'due_date');
        $title    				        = if_property_exist($params,'title');
        $employer_id      				= if_property_exist($params,'employer_id',null,array(null,""));
        $email_content				    = if_property_exist($params,'email_content');
        $approvals				        = if_property_exist($params,'approvals',[],array([],""));
        $category_id		            = if_property_exist($params,'category_id',null,array(null,""));
        $amount				            = if_property_exist($params,'amount',null,array(null,""));
        $remark				            = if_property_exist($params,'remark');
        $is_show_verifiers				= if_property_exist($params,'is_show_verifiers');
        $emp_id 	        			= if_property_exist($params,'emp_id');

        $type_id                        = if_property_exist($params,'type_id',null,array(null,""));
        $client_id      				= if_property_exist($params,'client_id',null,array(null,""));
        $attention_to      				= if_property_exist($params,'attention_to');
        $verification_type      				= if_property_exist($params,'verification_type');
        
        $doc_date	 				= convert_to_date($doc_date);
        $due_date	 				= convert_to_date($due_date);
        
        if($doc_no == '')
        {
            $rs  = get_doc_primary_no('doc_no', 'cms_user_documents',$employer_id);
            if($rs == false)
            {
            	return handle_fail_response('Error generating document number. Please contact admin');
            }
            else
            {
                $doc_no = $rs['doc_no'];
            }
        }
        
        $data = array
        (
        	':doc_no'			                => 	$doc_no,
            ':doc_date'	                        => 	$doc_date,
            ':due_date'	                        => 	$due_date,
            ':employer_id'			            => 	$employer_id,
            ':title'			                => 	$title,
            ':email_content'	                => 	$email_content,
            ':amount'	                        => 	$amount,
            ':remarks'	                        => 	$remark,
            ':ctg_id'	                        => 	$category_id,
            ':is_to_verify'	                    => 	0,
            ':is_active'	                    => 	1,
            ':is_show_verifiers'                =>  $is_show_verifiers,
            ':type_id'                          =>  $type_id,
            ':client_id'			            => 	$client_id,
            ':attention_to'			            => 	$attention_to,
            ':verification_type'			    => 	$verification_type
        );
        // echo '<pre>';print_r($data);exit;
        if(is_data_exist('cms_user_documents', 'doc_no', $doc_no))
        {
        	$data[':doc_no']  	    = $doc_no;
            $data 					= add_timestamp_to_array($data,$emp_id,1);
            $result 				= db_update($data, 'cms_user_documents', 'doc_no');
            $params->action 		= "edit";
        }
        else
        {
            $data 					= add_timestamp_to_array($data,$emp_id,0);
            $data[':secret_key']  	= get_unique_id();
            $id                		= db_add($data, 'cms_user_documents');
            $params->doc_no         = $doc_no;
            $params->action 		= "add";

        }
        db_execute_sql("DELETE FROM cms_user_documents_approvals WHERE doc_no = '$doc_no'");

        //save approvals
        foreach($approvals as $approval)
        {   
            $ap_array[':id']        = get_db_UUID();
            $ap_array[':doc_no']    = $doc_no;
            $ap_array[':type']      = $approval->type;
            $ap_array[':user_id']   = $approval->id;

            $ap_array 		  = add_timestamp_to_array($ap_array,$emp_id,0);
            db_add($ap_array, 'cms_user_documents_approvals');
        }
        
        $return_data = json_decode(get_doc_details($params))->data;
        return handle_success_response('Success', $return_data);
    }
    catch(Exception $e)
    {
        handle_exception($e);
    }
}

function get_doc_details($params)
{
    try
    {
        log_it(__FUNCTION__, $params);
        
        $doc_no	= if_property_exist($params,'doc_no','');

        if($doc_no === NULL || $doc_no == '')
        {
            return handle_fail_response('Document Number is mandatory');
        }
        
        $rs = db_query("
						doc_no		
						, date_format(doc_date,'" . constant('UI_DATE_FORMAT') .  "') as doc_date
                        , date_format(due_date,'" . constant('UI_DATE_FORMAT') .  "') as due_date	
						, title
                        , type_id
                        , client_id
						, attention_to
                        , employer_id
						, email_content
						, concat('" . constant("UPLOAD_DIR_URL") . "', 'document', '/',doc_no, '/') as filepath
						, remarks
						, ctg_id
						, amount
						, is_active
                        , is_show_verifiers
                        , is_to_verify
                        , is_archived
                        , verification_type
						, date_format(created_date,'" . constant('UI_DATE_FORMAT') .  "') as created_date
						, created_by			
					",
            "cms_user_documents",
            "doc_no = '". $doc_no ."'");
        $data['details']				= $rs[0];
        $data['details']['attachment'] 	= get_doc_attachments($params);
        
        $approvals = db_query("
                          cms_user_documents_approvals.doc_no		
						, cms_user_documents_approvals.type
                        , CASE cms_user_documents_approvals.type
                            when 'individual' then emp_tbl.name
                            when 'company' then contacts_tbl.name
                            END as name
                        , CASE cms_user_documents_approvals.type
                            when 'individual' then emp_tbl.office_email
                            when 'company' then contacts_tbl.email
                            END as email	
                        , cms_user_documents_approvals.user_id
                        , cms_user_documents_approvals.is_viewed
                        , cms_user_documents_approvals.viewed_at
                        , cms_user_documents_approvals.is_verified
                        , cms_user_documents_approvals.verified_at			
					",
            "cms_user_documents_approvals
            left join cms_employees emp_tbl on emp_tbl.id = cms_user_documents_approvals.user_id
            left join cms_clients_contacts contacts_tbl on contacts_tbl.id = cms_user_documents_approvals.user_id",
            "cms_user_documents_approvals.doc_no = '". $doc_no ."'");
        $data['details']['approvals'] 	= $approvals;
        return handle_success_response('Success', $data);
    }
    catch(Exception $e)
    {
        handle_exception($e);
    }
}

function delete_user_document($params)
{
    try
    {
        log_it(__FUNCTION__, $params);

        $doc_no  	    = if_property_exist($params,'doc_no');
        $emp_id	        = if_property_exist($params, 'emp_id');

        $data = array
        (
            ':doc_no'       => $doc_no,
            ':is_active'    => 0
        );

        if(is_data_exist('cms_user_documents', 'doc_no', $doc_no))
        {
            $data[':doc_no']  	    = $doc_no;
            $data 					= add_timestamp_to_array($data,$emp_id,1);
            $result 				= db_update($data, 'cms_user_documents', 'doc_no');
            $params->action 		= "edit";
        }

        $return_data = array('doc_no'   => $doc_no);

        return handle_success_response('Success', $return_data);
    }
    catch(Exception $e)
    {
        handle_exception($e);
    }
}

function send_email_notification_verified($params)
{
    try
    {
        log_it(__FUNCTION__, $params,true);

        $doc_no             = if_property_exist($params, 'doc_no');
        $id                 = if_property_exist($params, 'id');
        
        $emp_id	  	        = if_property_exist($params, 'emp_id');

        $rs = db_query_single("
						  doc_no
                        , secret_key		
						, date_format(doc_date,'" . constant('UI_DATE_FORMAT') .  "') as doc_date	
                        , date_format(due_date,'" . constant('UI_DATE_FORMAT') .  "') as due_date
						, title
                        , employer_id
						, email_content
						, concat('" . constant("UPLOAD_DIR_URL") . "', 'document', '/',doc_no, '/') as filepath
						, remarks
						, ctg_id
						, amount
						, is_active
						, date_format(created_date,'" . constant('UI_DATE_FORMAT') .  "') as created_date
						, created_by
                        , (select name from cms_employees emp where emp.id = cms_user_documents.created_by) as created_by_name
                        , (select office_email from cms_employees emp where emp.id = cms_user_documents.created_by) as created_by_email			
					",
            "cms_user_documents",
            "doc_no = '". $doc_no ."'");
        
        //send email to creator on verified start
        $current_approver = db_query_single("date_format(verified_at,'" . constant('UI_DATE_FORMAT') .  "') as verified_date			
                                            , CASE cms_user_documents_approvals.type
                                            when 'individual' then emp_tbl.name
                                            when 'company' then contacts_tbl.name
                                        END as name",
                                    "cms_user_documents_approvals
                                    left join cms_employees emp_tbl on emp_tbl.id = cms_user_documents_approvals.user_id
                                    left join cms_clients_contacts contacts_tbl on contacts_tbl.id = cms_user_documents_approvals.user_id",
                                    "cms_user_documents_approvals.id = '". $id ."'");
        
        $template_creator           =   db_query_single('template_content','cms_master_template',"template_name = 'Document Trail'");
        $template_content_creator   =   $template_creator['template_content'];

        $doc_link       = constant('ROOT_URL').'/modules/documents/documents.php?id='.$rs['doc_no'];
        
        $mail_subject   = 'Document Verified';
        $replace 		= array('{name}'
                            , '{doc_no}'
                            , '{verified_by}'
                            , '{verified_date}'
                            , '{document_link}'
                            , '{mail_subject}'
                            , '{mail_signature}'
                            , '{APP_TITLE}');
        $with 			= array($rs['created_by_name']
                            , $rs['doc_no']
                            , $current_approver['name']
                            , $current_approver['verified_date']
                            , $doc_link
                            , $mail_subject
                            , constant('MAIL_SIGNATURE')
                            , constant('APPLICATION_TITLE'));
        $body			= str_replace($replace, $with, $template_content_creator);
        // echo $rs['created_by_email'];exit;
        smtpmailer_new
        (
            $rs['created_by_email'],
            constant('MAIL_USERNAME'),
            constant('MAIL_FROMNAME'),
            $mail_subject,
            $body
        );
        //send email to creator on verified end
        
        send_email_notification_document($params);

        return handle_success_response('Success',true);

    }
    catch(Exception $e)
    {
        handle_exception($e);
    }
}

function send_email_notification_document($params)
{
    try
    {
        log_it(__FUNCTION__, $params,true);

        $doc_no             = if_property_exist($params, 'doc_no');
        $id                 = if_property_exist($params, 'id');
        
        $emp_id	  	        = if_property_exist($params, 'emp_id');

        $rs = db_query_single("
						  doc_no
                        , secret_key		
						, date_format(doc_date,'" . constant('UI_DATE_FORMAT') .  "') as doc_date	
                        , date_format(due_date,'" . constant('UI_DATE_FORMAT') .  "') as due_date
						, title
                        , employer_id
						, email_content
						, concat('" . constant("UPLOAD_DIR_URL") . "', 'document', '/',doc_no, '/') as filepath
						, remarks
						, ctg_id
						, amount
						, is_active
                        , is_to_verify
						, date_format(created_date,'" . constant('UI_DATE_FORMAT') .  "') as created_date
						, created_by
                        , (select name from cms_employees emp where emp.id = cms_user_documents.created_by) as created_by_name
                        , (select office_email from cms_employees emp where emp.id = cms_user_documents.created_by) as created_by_email			
					",
            "cms_user_documents",
            "doc_no = '". $doc_no ."'");
        
        $template        = urldecode($rs['email_content']);
        
        $approvals = db_query("
                        cms_user_documents_approvals.id
                        , cms_user_documents_approvals.is_verified
                        , CASE cms_user_documents_approvals.type
                        when 'individual' then emp_tbl.office_email
                        when 'company' then contacts_tbl.email
                       END as email			
					",
            "cms_user_documents_approvals
            left join cms_employees emp_tbl on emp_tbl.id = cms_user_documents_approvals.user_id
            left join cms_clients_contacts contacts_tbl on contacts_tbl.id = cms_user_documents_approvals.user_id",
            "cms_user_documents_approvals.doc_no = '". $doc_no ."'");


        if($rs['is_to_verify'] == 0)
        {
            add_qr_code($params);
        }
        $ap_data[':doc_no']         = $doc_no;
        $ap_data[':is_to_verify']   = 1;
        $ap_data                    = add_timestamp_to_array($ap_data,0,1);
        db_update($ap_data, 'cms_user_documents', 'doc_no');
        foreach($approvals as $approval)
        {   
            //send email based on the sequence
            if($approval['is_verified'] == 0)
            {
                $doc_link       = constant('ROOT_URL').'/user/document/'.$rs['secret_key'].'/'.$approval['id'];
                $mail_subject   = 'Document Verification';
                $replace 		= array('{SENDER_NAME}'
                                    , '{DOC_NO}'
                                    , '{DUE_DATE}'
                                    , '{TITLE}'
                                    , '{REMARKS}'
                                    , '{DOC_LINK}'
                                    , '{MAIL_SUBJECT}'
                                    , '{MAIL_SIGNATURE}'
                                    , '{APP_TITLE}');
                $with 			= array($rs['created_by_name']
                                    , $rs['doc_no']
                                    , $rs['due_date']
                                    , $rs['title']
                                    , $rs['remarks']
                                    , $doc_link
                                    , $mail_subject
                                    , constant('MAIL_SIGNATURE')
                                    , constant('APPLICATION_TITLE'));
                $body			= str_replace($replace, $with, $template);
                smtpmailer_new
                (
                    $approval['email'],
                    constant('MAIL_USERNAME'),
                    constant('MAIL_FROMNAME'),
                    $mail_subject,
                    $body
                );
                break;
            }
        }
        return handle_success_response('Success',true);

    }
    catch(Exception $e)
    {
        handle_exception($e);
    }
}

function get_documents_drop_down_values($params)
{
    try
    {   
        
        $view_all                   = if_property_exist($params, 'view_all',false);
        $emp_id                     = if_property_exist($params, 'emp_id',false);
        $lead_access_view_all       = if_property_exist($params, 'lead_access_view_all',false);
        $lead_access_view           = if_property_exist($params, 'lead_access_view',false);

        $field_id_array  =   array( 'category'        =>  35
                                    , 'status'          =>  36
                                    , 'verification_type' =>  68
                                );
        
        $drop_down_fields   = db_query("id, descr, category_id",
                "cms_master_list",
                "category_id in ('" . implode("','", $field_id_array) . "') AND is_active = 1"
                );
        $drop_down_groups   = array();
        for ($i=0; $i < count($drop_down_fields); $i++)
        {
            $category_id        = $drop_down_fields[$i]['category_id'];
            $category_label     = array_search($category_id, $field_id_array);
            
            if(!array_key_exists($category_label,$drop_down_groups))
            {
                $drop_down_groups[$category_label] = array();
            }
            
            array_push($drop_down_groups[$category_label], $drop_down_fields[$i]);
        }

        
        $drop_down_groups['company']  =   db_query(
                                                "cms_master_employer.id as id
                                                , cms_master_employer.employer_name as descr"
                                                , "cms_master_employer"
                                                , "cms_master_employer.is_active = 1"
                                            );

        //load all clients, vendors if the employee have view_all access
        if($lead_access_view_all == 1)
        {
            $where  =  "cms_clients.is_active = 1";
        }
        else
        {
            $where  =   "cms_clients.is_active = 1 AND FIND_IN_SET(" . $emp_id . ", cms_clients.assign_emp_id)";
        }

        $drop_down_groups['approval']['employees'] = db_query
                                                    (
                                                        " cms_employees.id as id
                                                        , CONCAT(cms_employees.name, ' - ',tbl_employer.employer_name) as descr
                                                        "
                                                        , "cms_employees
                                                        LEFT JOIN cms_master_employer tbl_employer on FIND_IN_SET(tbl_employer.id, JSON_UNQUOTE(JSON_EXTRACT(cms_employees.json_field, '$.employer')))"
                                                        , "cms_employees.is_active = 1"
                                                    );                                         
        $drop_down_groups['approval']['companies'] = $drop_down_groups['client'] = array();

        if($lead_access_view == 1)
        {   
            $drop_down_groups['approval']['companies']  =   db_query
                                                            (
                                                                " cms_clients_contacts.id
                                                                , CONCAT(cms_clients_contacts.name, ' - ', cms_clients.name) as descr
                                                                "
                                                                , "cms_clients_contacts
                                                                LEFT JOIN cms_clients ON cms_clients.id = cms_clients_contacts.client"
                                                                , $where.' AND cms_clients_contacts.email <> "" GROUP BY cms_clients.id'
                                                            );

            $drop_down_groups['client']  =   db_query
                                                (
                                                    " cms_clients.id as id
                                                    , cms_clients.name as descr"
                                                    , "cms_clients
                                                    LEFT JOIN cms_master_list as tbl_type ON FIND_IN_SET(tbl_type.id, cms_clients.type_id) > 0
                                                    LEFT JOIN cms_master_category ON tbl_type.category_id = cms_master_category.id"
                                                    , $where." AND tbl_type.descr = 'Client' AND cms_master_category.id = 59"
                                                );
        }
        
        if($view_all == 1)
        {
            $drop_down_groups['created_by']   = db_query('id,name as descr','cms_employees','is_active = 1');
        }
        else
        {
            $drop_down_groups['created_by']    = db_query('id,name as descr','cms_employees',"cms_employees.id = ".$emp_id." AND is_active = 1");
        }

        //get outbound document type
        $drop_down_groups['outbound_type'] = db_query('id,descr','cms_master_list',"category_id = 59 AND is_active = 1");

        //get client
        if($view_all == 1) {
            $drop_down_groups['client']	= db_query('id,name as descr','cms_clients',"cms_clients.is_active = 1",'','','cms_clients.name');
        }else {
            $drop_down_groups['client']	= db_query('id,name as descr','cms_clients',"is_active = 1 AND FIND_IN_SET(" . $emp_id . ", cms_clients.assign_emp_id)",'','','cms_clients.name');
        }

        //get email template
        $template = db_query('template_content','cms_master_template',"id = 46 AND is_active = 1");
        if($template && is_array($template)) {
            $drop_down_groups['template'] = base64_encode($template[0]['template_content']);
        }else {
            $drop_down_groups['template'] = '';
        }
        

        return handle_success_response('Success',$drop_down_groups);
    }
    catch (Exception $e)
    {
        handle_exception($e);
    }
}


//NON API compatible Services
function get_doc_attachments($params)
{
	try
	{
		log_it(__FUNCTION__, $params);
		
		$doc_no             = if_property_exist($params, 'doc_no');
		
        require_once constant('MODULES_DIR') . '/files.php';
		$params->primary_id	    = $doc_no;
        $params->secondary_id	= 'document';
		$params->module_id	    = 114;

        $files_data = json_decode(get_files($params))->data;
        $data['attachment'] = [];
		if(is_array($files_data)) {
			for($i = 0; $i < count($files_data); $i++)
			{
				$data['attachment'][] = $files_data[$i];
			}
		}
		return $data['attachment'];
	}
	catch(Exception $e)
	{
		handle_exception($e);
	}
}

function generate_otp_document($params)
{
	try
	{
		log_it(__FUNCTION__, $params);
		
		$mobile_no	  	    = if_property_exist($params, 'mobile_no');
		$id	  	            = if_property_exist($params, 'id');

        $emp_id             = 0;
        $otp                = rand(100000, 999999);

        //update existing otp as in-active
        $data_update                    = array();
        $data_update[':approval_id']    = $id;
        $data_update[':is_active']      = 0;
        db_update($data_update, 'cms_user_documents_otp', 'approval_id');

        $data = array
        (   ':id'           =>  get_db_UUID(),
        	':approval_id'	=> 	$id,
            ':otp'			=> 	$otp,
            ':mobile_no'	=> 	$mobile_no,
            ':is_active'	=> 	1
        );
        
        $otp_text = "Your OTP is ".$otp.". Use this to verify the document."; 
        send_sms($otp_text, $mobile_no);

        $data 				= add_timestamp_to_array($data,$emp_id,0);
        db_add($data, 'cms_user_documents_otp');

		return handle_success_response('Success',true);
	}
	catch(Exception $e)
	{
		handle_exception($e);
	}
}

function add_qr_code($params)
{
	try
	{   
        $id	  	    = if_property_exist($params, 'id');
        $doc_no	  	= if_property_exist($params, 'doc_no');

        $document   = get_doc_attachments($params);
        $document_link = constant('FILES_DIR')."/".$document[0]->module_id."/".$document[0]->primary_id."/".$document[0]->name;
        
        $rs = db_query_single("
						  doc_no
                        , title
                        , date_format(cms_user_documents.created_date,'%d-%b-%y %H:%i') as created_date
						, (select name from cms_employees emp where emp.id = cms_user_documents.created_by) as created_by_name
                    ",
            "cms_user_documents",
            "doc_no = '". $doc_no ."'");

        $approvals = db_query("
                        cms_user_documents_approvals.id
                        , cms_user_documents_approvals.is_verified
                        , date_format(cms_user_documents_approvals.verified_at,'%d-%b-%y %H:%i') as verified_date
                        , CASE cms_user_documents_approvals.type
                        when 'individual' then emp_tbl.name
                        when 'company' then contacts_tbl.name
                       END as name			
					",
            "cms_user_documents_approvals
            left join cms_employees emp_tbl on emp_tbl.id = cms_user_documents_approvals.user_id
            left join cms_clients_contacts contacts_tbl on contacts_tbl.id = cms_user_documents_approvals.user_id",
            "cms_user_documents_approvals.is_verified = 1 and cms_user_documents_approvals.doc_no = '". $doc_no ."'");
        
        $approval_string = $rs['title'].'[Created:'.$rs['created_by_name'].' '.$rs['created_date'].']';
        foreach($approvals as $approval)
        {
            $approval_string .= '[Verified:'.$approval['name'].' '.$approval['verified_date'].']';
        }
        
        require_once(constant('LIB_DIR') . '/TCPDF/tcpdf.php');
        require_once(constant('LIB_DIR') . '/fpdf/FPDI-2.3.6/FPDI-2.3.6/src/autoload.php');
        
        $pdf = new TcpdfFpdi;
        
        //Set the source PDF file
        $pageCount = $pdf->setSourceFile($document_link);

        for ($pageNo = 1; $pageNo <= $pageCount; $pageNo++) 
        {   
            //Import the first page of the file
            $tpl = $pdf->importPage($pageNo);

            $pdf->AddPage();
            //Use this page as template
            $pdf->useTemplate($tpl);
            
            //write barcode to only first page
            if($pageNo == 1)
            {
                $pdf->SetXY(150,15);
            
                //Print centered cell with a text in it
                // $pdf->Cell(0, 10, "Hello World", 0, 0, 'C');

                //clear the existing code to overwrite
                $style3 = array('width' => 0.2, 'cap' => 'round', 'join' => 'round', 'dash' => '0', 'color' => array(0, 0, 0));
                $pdf->Rect(180, 20, 20, 20, 'DF', array('all' => $style3), array(255, 255, 255));

                $style = array(
                    'border' => 2,
                    'vpadding' => 'auto',
                    'hpadding' => 'auto',
                    'fgcolor' => array(0,0,0),
                    'bgcolor' => false, //array(255,255,255)
                    'module_width' => 1, // width of a single module in points
                    'module_height' => 1 // height of a single module in points
                );

                // QRCODE,L : QR-CODE Low error correction
                $csv  = $approval_string;
                $pdf->write2DBarcode($csv, 'QRCODE,H', 180, 20, 50, 50, $style, 'N');
                
                $pdf->SetFont('helvetica', 'B', 10);
                $pdf->Text(180, 15, 'QRCODE');
            }
        }
        $pdf->Output($document_link, 'F');
    }
	catch(Exception $e)
	{
		handle_exception($e);
	}
}

function verify_document($params)
{
	try
	{
		log_it(__FUNCTION__, $params);
		$id	  	    = if_property_exist($params, 'id');
        $otp	  	= if_property_exist($params, 'otp');
        $is_valid   = false;
        if($otp != '')
		{
            $rs = db_query_single("
						  count(*) as total
                        , cms_user_documents_approvals.doc_no	
					",
            "cms_user_documents_otp
            left join cms_user_documents_approvals on cms_user_documents_approvals.id = cms_user_documents_otp.approval_id",
            "cms_user_documents_otp.otp = '". $otp ."' and cms_user_documents_approvals.id = '". $id."' and cms_user_documents_otp.is_active = 1 and TIMESTAMPDIFF(HOUR,cms_user_documents_otp.created_date,NOW()) < '".OTP_EXPIRY_MINS."'");
        }
        else
        {
            $rs = db_query_single("
						  count(*) as total
                        , cms_user_documents_approvals.doc_no	
					",
            "cms_user_documents_approvals",
            "cms_user_documents_approvals.id = '". $id."'");
        }        
        
        if($rs['total'] >= 1)
        {
            $is_valid = true;
            $data[':id']        = $id;
            $data[':is_verified'] = 1;
            $data[':verified_at'] = get_current_date();
            $data = add_timestamp_to_array($data,0,1);
            db_update($data, 'cms_user_documents_approvals', 'id');

            send_email_notification_verified($params);

            add_qr_code($params);
        }
        return handle_success_response('Success',$is_valid);
	}
	catch(Exception $e)
	{
		handle_exception($e);
	}
}

function initiate_email_notification_comments($params)
{
    
    $doc_no             = if_property_exist($params, 'doc_no');
    $comments           = if_property_exist($params, 'comments');
    $created_by_name    = if_property_exist($params, 'created_by_name');
    $emp_id             = if_property_exist($params, 'emp_id', 0);

    $approvals = db_query("'true' as is_approver
                        , CASE cms_user_documents_approvals.type
                            when 'individual' then emp_tbl.name
                            when 'company' then contacts_tbl.name
                            END as name
                        , CASE cms_user_documents_approvals.type
                            when 'individual' then emp_tbl.office_email
                            when 'company' then contacts_tbl.email
                            END as email
                        , cms_user_documents.secret_key
                        , cms_user_documents_approvals.id		
					",
            "cms_user_documents_approvals
            left join cms_user_documents on cms_user_documents_approvals.doc_no = cms_user_documents.doc_no
            left join cms_employees emp_tbl on emp_tbl.id = cms_user_documents_approvals.user_id
            left join cms_clients_contacts contacts_tbl on contacts_tbl.id = cms_user_documents_approvals.user_id",
            "cms_user_documents_approvals.doc_no = '". $doc_no ."'");

    $approvals[]    = db_query_single("'false' as is_approver
                        , cms_employees.name
                        , cms_employees.office_email",
                        'cms_user_documents
                        LEFT JOIN cms_employees ON cms_employees.id = cms_user_documents.created_by',
                        "cms_user_documents.doc_no = '". $doc_no ."'");
    
    $subject            =   'Comments Added for Document : '.$doc_no;

    //fetch email template from table
    $template           =   db_query_single('template_content','cms_master_template',"template_name = 'Document Comments'");
    $template_content   =   $template['template_content'];
    
    foreach($approvals as $approval)
    {   
        $document_link = constant('ROOT_URL').'/documents/outbound-documents/'.$doc_no;
        if($approval['is_approver'] == 'true')
        {
            $document_link   = constant('ROOT_URL').'/user/document/'.$approval['secret_key'].'/'.$approval['id'];
        }
        
        //replace variables to values in template
        $replace            =   array
        (         '{mail_subject}'
                , '{APP_TITLE}'
                , '{mail_signature}'
                , '{comments}'
                , '{comments_from}'
                , '{doc_no}'
                , '{document_link}'
                , '{name}'
        );
        $with               =   array
        (
                $subject
                , constant('APPLICATION_TITLE')
                , constant('MAIL_SIGNATURE')
                , $comments
                , $created_by_name
                , $doc_no
                , $document_link
                , $approval['name']
        );
        $body               =   str_replace($replace, $with, $template_content);
        
        $mail               =   smtpmailer_new
        (
                $approval['email']
                , constant('MAIL_USERNAME')
                , constant('MAIL_FROMNAME')
                , $subject
                , $body
        );
    }
}

function add_edit_user_doc_comments($params) {
    try {
        log_it(__FUNCTION__, $params);
        
        $doc_no= if_property_exist($params, 'doc_no');
        $comments   = if_property_exist($params, 'comments');
        $attachment = if_property_exist($params, 'attachment');
        $created_by_email = if_property_exist($params, 'created_by_email');
        $emp_id     = if_property_exist($params, 'emp_id', 0);
        
        $id         = get_db_UUID();
        $data       = array(':id' => $id, ':doc_no' => $doc_no, ':created_by_email' => $created_by_email, ':remarks' => $comments, ':json_field' => json_encode(array('attachment' => $attachment)));
        $data       = add_timestamp_to_array($data, $emp_id, 0);
        db_add($data, 'cms_user_documents_comments');

        initiate_email_notification_comments($params);

        $rs = db_query_single("id,remarks as descr
                            ,(SELECT name FROM cms_employees WHERE
                                cms_employees.id = cms_user_documents_comments.created_by
                              ) AS name, created_date, created_by_email, created_by AS emp_id
                            ", "cms_user_documents_comments", "doc_no = '" . $doc_no . "' AND id='" . $id . "'");
        $result                           = array();
        $result['details']                = $rs;
        $result['details']['attachment']  = get_user_doc_comments_attachments($params, $id);

        return handle_success_response('Success', $result);
    }
    catch(Exception $e) {
        handle_exception($e);
    }
}

function get_user_doc_comments_list($params) {
    try {
        log_it(__FUNCTION__, $params);
        $doc_no = if_property_exist($params, 'doc_no');
        if (!isset($doc_no) || $doc_no == '') {
            return handle_fail_response('Missing Contract ID.');
        }
        
        $result = db_query("id,remarks as descr
                            ,(SELECT name FROM cms_employees WHERE
                                cms_employees.id = cms_user_documents_comments.created_by
                              ) AS name, created_date, created_by_email, created_by AS emp_id
                            ", "cms_user_documents_comments", "doc_no = '" . $doc_no . "'", '', '', 'created_date', 'desc');

        
        if (count($result) > 0) {
            $count = count($result);
            for ($i = 0; $i < $count; $i++) {
                $comment_id = $result[$i]["id"];
                $result[$i]['attachment'] = get_user_doc_comments_attachments($params, $comment_id);
            }
        }
        if (count($result) > 0 || isset($result)) {
            return handle_success_response('Success', $result);
        }
    }
    catch(Exception $e) {
        handle_exception($e);
    }
}

function get_user_doc_comments_attachments($params, $comment_id)
{
    try
    {
        log_it(__FUNCTION__, $params);
        
        $doc_no                 = if_property_exist($params, 'doc_no');
        $emp_id                 = if_property_exist($params, 'emp_id');
        
        require_once constant('MODULES_DIR') . '/files.php';
        $params->primary_id     = $doc_no;
        $params->secondary_id   = $comment_id;
        $params->module_id      = 114;

        $files_data = json_decode(get_files($params))->data;
        $data['attachment'] = [];
		if(is_array($files_data)) {
			for($i = 0; $i < count($files_data); $i++)
			{
				$data['attachment'][] = $files_data[$i];
			}
		}
		return $data['attachment'];
    }
    catch(Exception $e)
    {
        handle_exception($e);
    }
}

function generate_digital_signature($params)
{
	try
	{
		log_it(__FUNCTION__, $params);
		
		$attachment_id	  	            = if_property_exist($params, 'attachment_id');

        $path = str_replace('\\', '/', constant('DOC_FOLDER'));
        $rs = db_query_single("concat('" . $path . "',cms_files.module_id, '/', cms_files.primary_id, '/', cms_files.filename) AS filepath
                             , concat('" . $path . "',cms_files.module_id, '/', cms_files.primary_id) AS path
                             , cms_files.id
                             , cms_files.filename",
                            "cms_files",
                            "cms_files.id ='$attachment_id'");
        
        $img = file_get_contents($rs['filepath']);
        $base_64 = base64_encode($img);


        $reference = uniqid().time();

        //update the reference number in respective file
        $update_data[':id']   	    = $rs['id'];
        $update_data[':json_field'] = json_encode(array('reference_number'=>$reference));
        $update_data                = add_timestamp_to_array($update_data,0,1);
        db_update($update_data, 'cms_files', 'id');
        
        $json = array(
                    'Name' => 'Test',
                    'FileType'  => 'PDF',
                    'SignatureType' => 1,
                    'SelectPage' => 'ALL',
                    'SignaturePosition' => 'Bottom-Center',
                    'AuthToken' => DIGITAL_SIGN_AUTH_TOKEN,
                    'File' => $base_64,
                    'PageNumber' => "",
                    'Noofpages' => 0,
                    'PreviewRequired' => true,
                    'SUrl' => ROOT_URL.'/user/return_from_gateway.php',
                    'FUrl' => '/Error',
                    'CUrl' => '/Cancel',
                    'ReferenceNumber' => $reference,
                    'IsCompressed' => false,
                    'IsCosign' => true,
                    'IsCustomized' => false
                    );
        $json_encode = json_encode($json);
        digital_sign_generate_keys($json_encode, $rs['path']);

        $result = array(
                        'Parameter1'   => file_get_contents($rs['path']."/encrypted_sessionkey.txt")
                      , 'Parameter2'   => file_get_contents($rs['path']."/encrypted_json_data.txt")
                      , 'Parameter3'   => file_get_contents($rs['path']."/encrypted_hashof_json_data.txt")
                        );

		return handle_success_response('Success',$result);
	}
	catch(Exception $e)
	{
		handle_exception($e);
	}
}

function get_document_initial_data($params) {
    try {
        log_it(__FUNCTION__, $params);

        $secret_key             = if_property_exist($params, 'key');
        $approval_id           = if_property_exist($params, 'id');

        $user_document = db_query_single(
            "
                doc_no		
                , date_format(doc_date,'" . constant('UI_DATE_FORMAT') .  "') as doc_date
                , date_format(due_date,'" . constant('UI_DATE_FORMAT') .  "') as due_date	
                , title
                , employer_id
                , email_content
                , concat('" . constant("UPLOAD_DIR_URL") . "', 'document', '/',doc_no, '/') as filepath
                , remarks
                , ctg_id
                , amount
                , is_active
                , is_show_verifiers
                , verification_type
                , date_format(created_date,'" . constant('UI_DATE_FORMAT') .  "') as created_date
                , created_by
                , (select descr from cms_master_list cat_tbl where cat_tbl.id = cms_user_documents.ctg_id) as category_name
                , (select employer_name from cms_master_employer employer_tbl where employer_tbl.id = cms_user_documents.employer_id) as employer_name			
                ",
            "cms_user_documents",
            "secret_key = '" . $secret_key . "'"
        );

        $current_approval = db_query_single(
            "
                cms_user_documents_approvals.doc_no		
                , cms_user_documents_approvals.type
                , cms_user_documents_approvals.user_id
                , cms_user_documents_approvals.is_verified
                , CASE cms_user_documents_approvals.type
                when 'individual' then emp_tbl.name
                when 'company' then contacts_tbl.name
                END as name
                , CASE cms_user_documents_approvals.type
                when 'individual' then emp_tbl.email
                when 'company' then contacts_tbl.email
                END as email	
                , CASE cms_user_documents_approvals.type
                when 'individual' then IFNULL(JSON_UNQUOTE(emp_tbl.json_field->'$.malaysia_phone'),'')
                when 'company' then contacts_tbl.mobile
                END as mobile_no
            ",
            "cms_user_documents_approvals
                left join cms_employees emp_tbl on emp_tbl.id = cms_user_documents_approvals.user_id
                left join cms_clients_contacts contacts_tbl on contacts_tbl.id = cms_user_documents_approvals.user_id",
            "cms_user_documents_approvals.id = '" . $approval_id . "'"
        );

        $approvals = [];

        $documents = [];

        if($user_document) {
            $params = array();
            $params['doc_no'] = $user_document['doc_no'];
            $documents = get_doc_attachments((object)$params);

            $approvals = db_query("
                      cms_user_documents_approvals.doc_no		
                    , cms_user_documents_approvals.type
                    , cms_user_documents_approvals.user_id
                    , cms_user_documents_approvals.is_verified
                    , CASE cms_user_documents_approvals.type
                      when 'individual' then emp_tbl.name
                      when 'company' then contacts_tbl.name
                      END as name
                    , CASE cms_user_documents_approvals.type
                      when 'individual' then emp_tbl.email
                      when 'company' then contacts_tbl.email
                    END as email
                  ",
                    "cms_user_documents_approvals
                    left join cms_employees emp_tbl on emp_tbl.id = cms_user_documents_approvals.user_id
                    left join cms_clients_contacts contacts_tbl on contacts_tbl.id = cms_user_documents_approvals.user_id",
                    "cms_user_documents_approvals.doc_no = '". $user_document['doc_no'] ."'");
        }

        $r_data = array(
            'user_document' => $user_document,
            'current_approval' => $current_approval,
            'approvals' => $approvals,
            'documents' => $documents
        );

        return handle_success_response('Success', $r_data);

    }catch(Exception $e) {
        handle_exception($e);
    }
}

function update_view_time_doc($params) {
    try {
        $id  = if_property_exist($params, 'id');

        $data[':id']        = $id;
        $data[':is_viewed'] = 1;
        $data[':viewed_at'] = get_current_date();
        
        $data = add_timestamp_to_array($data,0,1);
        $result = db_update($data, 'cms_user_documents_approvals', 'id');
        
        return handle_success_response('Success', $result);

    }catch(Exception $e) {
        handle_exception($e);
    }
}

//get outbound document status
function get_document_status($params) {
    try
    {
        log_it(__FUNCTION__, $params);
        
        $doc_no	= if_property_exist($params,'doc_no','');

        if($doc_no === NULL || $doc_no == '')
        {
            return handle_fail_response('Document Number is mandatory');
        }
        
        // echo $where;exit;
        $sql                = get_doc_sql();
        $field              = $sql['fields'];
        $table              = $sql['table'];

        $rs = db_query_single($field, $table, "doc_no = '". $doc_no ."'");

        return handle_success_response('Success', $rs);
        
        // if(count((array)$rs) < 1 || !isset($rs))
        // {
        //     return handle_fail_response('No record found');
        // }
        // else
        // {
        //     return handle_success_response('Success', $rs);
        // }
    }
    catch(Exception $e)
    {
        handle_exception($e);
    }
}
