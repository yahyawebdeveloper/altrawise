<?php
session_start();
use setasign\Fpdi\FpdfTpl;
use setasign\Fpdi\Fpdi as FpdiFpdi;
use setasign\Fpdi\Tcpdf\Fpdi as TcpdfFpdi;
use setasign\Fpdi\Tfpdf\FpdfTpl as TfpdfFpdfTpl;
use setasign\Fpdi\Tfpdf\Fpdi;
function get_users_tracker_employee($params) {

    try {
            log_it(__FUNCTION__, $params);
            $emp_id                     = if_property_exist($params, 'emp_id',false);
            if($emp_id === NULL)
            {
                return handle_fail_response('Employee ID is mandatory');
            }
            $return_data    	= [];
            $temp				= [];
            $emp	            = db_query("id,name","cms_employees","is_active = 1 and (JSON_EXTRACT(cms_employees.json_field, '$.permission.enable_screen_track') = 1 or JSON_EXTRACT(cms_employees.json_field, '$.screen_track.screenshot_enable') = '1' )");
           
            $rs_category     	= $emp;
            for($i = 0; $i < count($rs_category); $i++)
            {
                $temp['id']   = $rs_category[$i]['id'];
                $temp['desc'] = $rs_category[$i]['name'];
                $return_data[] = $temp;
            }
            return json_encode( array("code"=>0,"msg"=>"Success","data"=>$return_data) );
    } catch(Exception $e) {
        handle_exception($e);
    }
    
}
function get_dept($params) {

    try {
            log_it(__FUNCTION__, $params);
            $emp_id                     = if_property_exist($params, 'emp_id',false);
            if($emp_id === NULL)
            {
                return handle_fail_response('Employee ID is mandatory');
            }
            $return_data    	= [];
            $temp				= [];
            $dept	            = db_query('id,descr','cms_master_list',"category_id = 1 AND is_active = 1");
            $rs_category     	= $dept;
            for($i = 0; $i < count($rs_category); $i++)
            {
                $temp['id']   = $rs_category[$i]['id'];
                $temp['desc'] = $rs_category[$i]['descr'];
                $return_data[] = $temp;
            }
            return json_encode( array("code"=>0,"msg"=>"Success","data"=>$return_data) );
    } catch(Exception $e) {
        handle_exception($e);
    }
    
} 
function get_outsourced_clients($params) {

    try {
            log_it(__FUNCTION__, $params);
            $emp_id                     = if_property_exist($params, 'emp_id',false);
            if($emp_id === NULL)
            {
                return handle_fail_response('Employee ID is mandatory');
            }
            $return_data    	= [];
            $temp				= [];
            $clients	        = db_query('id,descr','cms_master_list',"category_id = 18 AND is_active = 1");
            $rs_category     	= $clients;
            for($i = 0; $i < count($rs_category); $i++)
            {
                $temp['id']   = $rs_category[$i]['id'];
                $temp['desc'] = $rs_category[$i]['descr'];
                $return_data[] = $temp;
            }
            return json_encode( array("code"=>0,"msg"=>"Success","data"=>$return_data) );
    } catch(Exception $e) {
        handle_exception($e);
    }
    
} 
function get_emp($params) {

    try {
            log_it(__FUNCTION__, $params);
            $emp_id                     = if_property_exist($params, 'emp_id',false);
            $logged_in                     = if_property_exist($params, 'logged_in',false);
            if($emp_id === NULL)
            {
                return handle_fail_response('Employee ID is mandatory');
            }
            $return_data    	= [];
            $temp				= [];
            $where              = "";
            if( $logged_in )
                $where = " AND id = ".$emp_id;
            $emp	            = db_query('id,name','cms_employees','is_active = 1'.$where);
            $rs_category     	= $emp;
            for($i = 0; $i < count($rs_category); $i++)
            {
                $temp['id']   = $rs_category[$i]['id'];
                $temp['desc'] = $rs_category[$i]['name'];
                $return_data[] = $temp;
            }
            return json_encode( array("code"=>0,"msg"=>"Success","data"=>$return_data) );
    } catch(Exception $e) {
        handle_exception($e);
    }
    
} 
/* function get_documents_drop_down_values_other() {
    try
    {   
        $drop_down_groups['document_type']  =   db_query('id,descr','cms_master_list',"category_id = 35 AND is_active = 1");
        $drop_down_groups['document_status'] = db_query('id,descr','cms_master_list',"category_id = 36 AND is_active = 1");

        $drop_down_groups['sh_type'] = db_query('id,descr','cms_master_list',"category_id = 59 AND is_active = 1");
       
        return handle_success_response('Success', $drop_down_groups);
    }
    catch (Exception $e)
    {
        handle_exception($e);
    }
} */
function get_documents_drop_down_values_other($params) {
    try {
        
        $view_all                   = if_property_exist($params, 'view_all',false);
        $emp_id                     = if_property_exist($params, 'emp_id',false);
        $lead_access_view_all       = if_property_exist($params, 'lead_access_view_all',false);
        $lead_access_view           = if_property_exist($params, 'lead_access_view',false);

        $drop_down_groups   = array();

        $drop_down_groups['company']  =   db_query(
            "cms_master_employer.id as id
            , cms_master_employer.employer_name as descr"
            , "cms_master_employer"
            , "cms_master_employer.is_active = 1"
        );

        $drop_down_groups['approval']['employees'] = db_query(
            " cms_employees.id as id
            , cms_employees.office_email as email
            , CONCAT(cms_employees.name, ' - ',tbl_employer.employer_name) as descr",
            "cms_employees
            LEFT JOIN cms_master_employer tbl_employer on FIND_IN_SET(tbl_employer.id, JSON_UNQUOTE(JSON_EXTRACT(cms_employees.json_field, '$.employer')))",
            "cms_employees.is_active = 1 AND cms_employees.office_email <> ''"
        );

        $drop_down_groups['approval']['companies'] = $drop_down_groups['client'] = array();

        if ($lead_access_view_all == 1) {
            $where  =  "cms_clients.is_active = 1";
        } else {
            $where  =   "cms_clients.is_active = 1 AND FIND_IN_SET(" . $emp_id . ", cms_clients.assign_emp_id)";
        }

        if ($lead_access_view == 1) {
            $drop_down_groups['approval']['companies']  =   db_query(
                " cms_clients_contacts.id
                , cms_clients_contacts.email
                , CONCAT(cms_clients_contacts.name, ' - ', cms_clients.name) as descr",
                "cms_clients_contacts
                LEFT JOIN cms_clients ON cms_clients.id = cms_clients_contacts.client",
                $where . ' AND cms_clients_contacts.email <> "" GROUP BY cms_clients.id'
            );

            $drop_down_groups['client']  =   db_query(
                " cms_clients.id as id
                , cms_clients.name as descr",
                "cms_clients
                LEFT JOIN cms_master_list as tbl_type ON FIND_IN_SET(tbl_type.id, cms_clients.type_id) > 0
                LEFT JOIN cms_master_category ON tbl_type.category_id = cms_master_category.id",
                $where . " AND tbl_type.descr = 'Client' AND cms_master_category.id = 59"
            );
        }

        $drop_down_groups['document_type']  =   db_query('id,descr','cms_master_list',"category_id = 35 AND is_active = 1");
        $drop_down_groups['document_status'] = db_query('id,descr','cms_master_list',"category_id = 36 AND is_active = 1");
        $drop_down_groups['sh_type'] = db_query('id,descr','cms_master_list',"category_id = 59 AND is_active = 1");
       
        return handle_success_response('Success', $drop_down_groups);
    }
    catch (Exception $e)
    {
        handle_exception($e);
    }
}


function get_document_search_dropdown_data_check() {
    try
    {   
        $drop_down_groups['category']  =   db_query
                                                ('id,descr,field1,field2,field3','cms_master_list','category_id = 2 AND is_active = 1','','','descr');
        $drop_down_groups['expenses']  =   db_query
                                                ('id,descr','cms_master_list','category_id = 23 AND is_active = 1');                                        
        $drop_down_groups['leaves']  =   db_query
                                                ('id,descr','cms_master_list','category_id = 16 AND is_active = 1');
        return handle_success_response('Success', $drop_down_groups);
    }
    catch (Exception $e)
    {
        handle_exception($e);
    }
}

function get_document_search_query_data_check() {
    try
    {   
        $drop_down['columns'] = array(
            array('id' => 'doc_no','descr' => 'Doc No'),
            array('id' => 'doc_date','descr' => 'Doc Date'),
            array('id' => 'category_id','descr' => 'Category Id'),
            array('id' => 'cost','descr' => 'Cost'),
            array('id' => 'gst','descr' => 'GST'),
            array('id' => 'roundup','descr' => 'Round Up'),
            array('id' => 'total','descr' => 'Total'),
            array('id' => 'approved_by','descr' => 'Approved By'),
            array('id' => 'verified_by','descr' => 'Verified By'),
            array('id' => 'is_active','descr' => 'Is Active'),
            array('id' => 'created_by','descr' => 'Created By'),
            array('id' => 'created_date','descr' => 'Created Date')
        );
        
        $drop_down['conditions'] = array(
            array('id' => '=','descr' => '='),
            array('id' => '<=','descr' => '<='),
            array('id' => '>=','descr' => '>='),
            array('id' => '<','descr' => '<'),
            array('id' => '>','descr' => '>'),
            array('id' => 'like','descr' => 'like')
        );

        return handle_success_response('Success', $drop_down);
    }
    catch (Exception $e)
    {
        handle_exception($e);
    }
}


/** For Leave Application Dropdown */
function get_leave_dropdown_data($params) {
    try
    {  
        $curr_year 	=  date("Y");
        $emp_id                     = if_property_exist($params, 'emp_id',false);
       //$drop_down_groups['emp_leave_type']  =   db_query('cms_master_list.id as id,cms_master_list.descr as descr,cms_emp_leave.no_of_days','cms_emp_leave INNER JOIN cms_master_list ON
       //cms_emp_leave.master_list_id = cms_master_list.id','cms_emp_leave.emp_id = '.$emp_id.' AND cms_emp_leave.applicable_year = ' . $curr_year . ' AND cms_emp_leave.is_active = 1');
       $drop_down_groups['emp_leave_type']  = db_query('id,descr','cms_master_list',"category_id = 16 AND is_active = 1 AND no_of_days=12");
       $drop_down_groups['expenses']  =   db_query('id,descr','cms_master_list','id = 195 AND is_active = 1');     
       return handle_success_response('Success', $drop_down_groups);
    }
    catch (Exception $e)
    {
        handle_exception($e);
    }
}

/** For Leave Approval */
function get_leave_approval_dropdown_data($params) {
    try
    {  
       
        $emp_id                     = if_property_exist($params, 'emp_id',false);
        $is_supervisor              = if_property_exist($params, 'is_supervisor',false);
        $is_admin                   = if_property_exist($params, 'is_admin',false);
        $drop_down_groups['leave_type']  =   db_query('id,descr','cms_master_list',"category_id = 16 AND is_active = 1");
       // if($is_admin)
       // {
            $drop_down_groups['emp']  =  db_query('id,name','cms_employees','is_active = 1');
       // }
      /*  if($is_supervisor==1)
        {
            $drop_down_groups['emp']  =   db_query('id,name','cms_employees','reporting_to_id = ' . $emp_id. ' AND is_active = 1');   
        }*/
        return handle_success_response('Success', $drop_down_groups);
    }
    catch (Exception $e)
    {
        handle_exception($e);
    }
}

function get_service_request_search_dropdown($params) {

    try {

        log_it(__FUNCTION__, $params);
        $emp_id = if_property_exist($params, 'emp_id', '');
        if (!isset($emp_id) || $emp_id == '') {
            return handle_fail_response('Missing employee ID.');
        }

        $emp = array();
        
            $emp        	= db_query('id,name,office_email','cms_employees',"id =" . $emp_id . " AND is_active = 1");
            $where  =   "cms_clients.is_active = 1 AND FIND_IN_SET(" . $emp_id . ", cms_clients.assign_emp_id)";

        $client =  db_query('cms_clients.id,cms_clients.name',
                                    'cms_clients
                                        LEFT JOIN cms_master_list as tbl_type ON FIND_IN_SET(tbl_type.id, cms_clients.type_id) > 0
                                        LEFT JOIN cms_master_category ON tbl_type.category_id = cms_master_category.id',
                                    $where." AND tbl_type.descr = 'Client' AND cms_master_category.id = 59");

        $category     		= db_query('id,descr','cms_master_list',"category_id = 39 AND is_active = 1");
        $employer    	    = db_query('id,employer_name','cms_master_employer',"is_active = 1");
        $status             = db_query('id,descr','cms_master_list',"category_id = 40 AND is_active = 1");
        $payment_term       = db_query('id,descr','cms_master_list',"category_id = 5 AND is_active = 1");
        $asset_type        = db_query('id,descr','cms_master_list',"category_id = 20 AND is_active = 1");

        $return_data = array('category' => $category,'employer' => $employer,'created_by' => $emp ,'status' => $status, 'client' => $client , 'payment_term' => $payment_term,'asset_type' => $asset_type );
		echo json_encode( array( "code"=>0, "msg"=>"Success", "data"=>$return_data ) );exit;

    } catch(Exception $e) {
        handle_exception($e);
    }
    
} 
function get_everything_at_once_altrawise($params){
	$dataArray = [];
	
	for($i=0;$i<sizeof($params);$i++){
		
		$func_params = (!empty($params[$i]->params)) ? $params[$i]->params : false;
		
		if(!empty($params[$i]->func))
			$dataArray[] = call_user_func($params[$i]->func,$func_params);
		else
			$dataArray[] = call_user_func($params[$i]);
	}
	echo json_encode( array( "code"=>0, "msg"=>"Success", 'data'=>$dataArray ) );exit;
}
function get_comm_enquiry_categories($params) {

    try {
            log_it(__FUNCTION__, $params);
            $return_data    	= [];
            $temp				= [];
            $rs_category     		= db_query('id,descr,field1,field2,field3','cms_master_list',"category_id = 30 AND is_active = 1",'','','descr','');
            for($i = 0; $i < count($rs_category); $i++)
            {
                $temp['id']   = $rs_category[$i]['id'];
                $temp['desc'] = $rs_category[$i]['descr'];
                $return_data[] = $temp;
            }
            return json_encode( array("code"=>0,"msg"=>"Success","data"=>$return_data) );
    } catch(Exception $e) {
        handle_exception($e);
    }
    
}
function get_comm_status($params) {

    try {
            log_it(__FUNCTION__, $params);
            $return_data    	= [];
            $temp				= [];
            $rs_category     		= db_query('id,descr','cms_master_list',"category_id = 31 AND is_active = 1");
            for($i = 0; $i < count($rs_category); $i++)
            {
                $temp['id']   = $rs_category[$i]['id'];
                $temp['desc'] = $rs_category[$i]['descr'];
                $return_data[] = $temp;
            }
            return json_encode( array("code"=>0,"msg"=>"Success","data"=>$return_data) );
    } catch(Exception $e) {
        handle_exception($e);
    }
    
}
function get_comm_report_categories($params) {

    try {
            log_it(__FUNCTION__, $params);
            $return_data    	= [];
            $temp				= [];
            $rs_category     		= db_query('id,descr,field1,field2,field3','cms_master_list',"category_id = 30 AND is_active = 1");
            for($i = 0; $i < count($rs_category); $i++)
            {
                $temp['id']   = $rs_category[$i]['id'];
                $temp['desc'] = $rs_category[$i]['descr'];
                $return_data[] = $temp;
            }
            return json_encode( array("code"=>0,"msg"=>"Success","data"=>$return_data) );
    } catch(Exception $e) {
        handle_exception($e);
    }
    
}
function get_comm_report_status($params) {

    try {
            log_it(__FUNCTION__, $params);
            $return_data    	= [];
            $temp				= [];
            $rs_category     		= db_query('id,descr','cms_master_list',"category_id = 31 AND is_active = 1");
            for($i = 0; $i < count($rs_category); $i++)
            {
                $temp['id']   = $rs_category[$i]['id'];
                $temp['desc'] = $rs_category[$i]['descr'];
                $return_data[] = $temp;
            }
            return json_encode( array("code"=>0,"msg"=>"Success","data"=>$return_data) );
    } catch(Exception $e) {
        handle_exception($e);
    }
    
}
function get_comm_report_requestor($params) {

    try {
            log_it(__FUNCTION__, $params);
            $emp_id                     = if_property_exist($params, 'emp_id',false);

            $return_data    	= [];
            $temp				= [];

            if( isset($_SESSION['access']) )
                $access = get_accessibility(42,$_SESSION['access']);
            if(isset($access->viewall) && $access->viewall == 1)
            {
                $emp	= db_query('id,name,office_email','cms_employees','is_active = 1');
            }
            else
            {
                $emp   	= db_query('id,name,office_email','cms_employees',"id =" . $emp_id . " AND is_active = 1");
            }
            $rs_category     		= $emp;
            for($i = 0; $i < count($rs_category); $i++)
            {
                $temp['id']   = $rs_category[$i]['id'];
                $temp['desc'] = $rs_category[$i]['name'];
                $return_data[] = $temp;
            }
            return json_encode( array("code"=>0,"msg"=>"Success","data"=>$return_data) );
    } catch(Exception $e) {
        handle_exception($e);
    }
    
}
function get_attendance_reports_employee($params) {

    try {
            log_it(__FUNCTION__, $params);
            $emp_id                     = if_property_exist($params, 'emp_id',false);

            $return_data    	= [];
            $temp				= [];

            if( isset($_SESSION['access']) )
                $access = get_accessibility(42,$_SESSION['access']);
            if(isset($access->viewall) && $access->viewall == 1)
            {
                $emp	= db_query('id,name,office_email','cms_employees','is_active = 1');
            }
            else
            {
                $emp   	= db_query('id,name,office_email','cms_employees',$emp_id . " IN(reporting_to_id,id) AND is_active = 1");
            }
            $rs_category     		= $emp;
            for($i = 0; $i < count($rs_category); $i++)
            {
                $temp['id']   = $rs_category[$i]['id'];
                $temp['desc'] = $rs_category[$i]['name'];
                $return_data[] = $temp;
            }
            return json_encode( array("code"=>0,"msg"=>"Success","data"=>$return_data) );
    } catch(Exception $e) {
        handle_exception($e);
    }
    
} 
function get_attendance_tracker_employee($params) {

    try {
            log_it(__FUNCTION__, $params);
            $emp_id                     = if_property_exist($params, 'emp_id',false);

            $return_data    	= [];
            $temp				= [];

            $emp = db_query('cms_employees.id,cms_employees.name'
                         , 'cms_employees
                            inner join cms_employee_usage_log on cms_employees.id = cms_employee_usage_log.created_by'
                         , 'cms_employees.is_active = 1 and cms_employees.name IS NOT NULL GROUP BY cms_employees.id ORDER BY cms_employees.name ASC');
            $rs_category     		= $emp;
            if( isset($rs_category) && count(rs_category) > 0 ){
                for($i = 0; $i < count($rs_category); $i++)
                {
                    $temp['id']   = $rs_category[$i]['id'];
                    $temp['desc'] = $rs_category[$i]['name'];
                    $return_data[] = $temp;
                }
            }
            return json_encode( array("code"=>0,"msg"=>"Success","data"=>$return_data) );
    } catch(Exception $e) {
        handle_exception($e);
    }
    
}

function get_contract_search_dropdown($params) {
    try {

        log_it(__FUNCTION__, $params);
        $emp_id = if_property_exist($params, 'emp_id', '');
        if (!isset($emp_id) || $emp_id == '') {
            return handle_fail_response('Missing employee ID.');
        }

        $emp = array();
        
        // $access = get_accessibility(9, $_SESSION['access']);
        // if (isset($access->viewall) && $access->viewall == 1)  {
        //     $emp            = db_query('id,name,office_email', 'cms_employees', 'is_active = 1');
        //     $where  =  "cms_clients.is_active = 1";
        // } else {
            $drop_down_groups['created_by']            = db_query('id,name,office_email', 'cms_employees', "id =" . $emp_id . " AND is_active = 1");
            $where  =   "cms_clients.is_active = 1 AND FIND_IN_SET(" . $emp_id . ", cms_clients.assign_emp_id)";
        // }

        $drop_down_groups['client'] =  db_query('cms_clients.id,cms_clients.name',
							'cms_clients
                                LEFT JOIN cms_master_list as tbl_type ON FIND_IN_SET(tbl_type.id, cms_clients.type_id) > 0
                                LEFT JOIN cms_master_category ON tbl_type.category_id = cms_master_category.id',
							$where." AND tbl_type.descr = 'Client' AND cms_master_category.id = 59");
        
       // $return_data = array('created_by' => $emp,'client'=> $client);
	//	echo json_encode( array( "code"=>0, "msg"=>"Success", "data"=>$return_data ) );
    return handle_success_response('Success', $drop_down_groups);

    } catch(Exception $e) {
        handle_exception($e);
    }
    
} 

function get_data_dashboard($params) {
    try
    {  
        require_once constant('MODULES_DIR') . '/dashboard.php';
        $paramss['emp_id'] = if_property_exist($params, 'emp_id',false);
        $result = json_decode(get_user_dashboard((object)$paramss));
        if($result->code == 0)
        {
        $user_dashboard_data['app_count'] = if_property_exist($result->data->app_count, 'count', 0);
        $user_dashboard_data['tasks_count'] = if_property_exist($result->data->tasks_count, 'count', 0);
        $user_dashboard_data['contracts_count'] = if_property_exist($result->data->contracts_count, 'count', 0);
        $user_dashboard_data['communications_count'] = if_property_exist($result->data->communications_count, 'count', 0);

        $user_dashboard_data['topusers'] = if_property_exist($result->data->topusers, 'totalduration', 0.00);
        $user_dashboard_data['mosttopusers'] = $result->data->mosttopusers;
        $user_dashboard_data['faq_count'] = if_property_exist($result->data->faq_count, 'count', 0);
        }   
       return handle_success_response('Success', $user_dashboard_data);
    }
    catch (Exception $e)
    {
        handle_exception($e);
    }
}

function get_data_admin_dashboard($params) {
    try
    {  
        require_once constant('MODULES_DIR') . '/dashboard.php';
        $paramss['emp_id'] = if_property_exist($params, 'emp_id',false);

        $allusersdetails = array();
        $result = json_decode(get_admin_dashboard((object)$params));
        if($result->code == 0)
        {
            $admin_dashboard_data['app_count'] = if_property_exist($result->data->app_count, 'count', 0);
            $admin_dashboard_data['doc_count'] = if_property_exist($result->data->doc_count, 'count', 0);
            $admin_dashboard_data['asset_count'] = if_property_exist($result->data->asset_count, 'count', 0);
            $admin_dashboard_data['leave_count'] = if_property_exist($result->data->leave_count, 'count', 0);
            $admin_dashboard_data['topusers'] = if_property_exist($result->data->topusers, 'totalduration', 0.00);
            $admin_dashboard_data['total_duration'] = if_property_exist($result->data->total_duration, 'totalduration', 0.00);
            $admin_dashboard_data['mosttopusers'] = $result->data->mosttopusers;
            $admin_dashboard_data['allusersdetails'] = $result->data->allusersdetails;
            $admin_dashboard_data['faq_count'] = if_property_exist($result->data->faq_count, 'count', 0);
        }
       return handle_success_response('Success', $admin_dashboard_data);
    }
    catch (Exception $e)
    {
        handle_exception($e);
    }
}

function get_data_admin_dashboard_details($params) {
    try
    {  
        require_once constant('MODULES_DIR') . '/dashboard.php';
        $paramss['emp_id'] = if_property_exist($params, 'emp_id',false);

        $allusersdetails = array();
        $result = json_decode(get_admin_dashboard((object)$params));
        if($result->code == 0)
        {
            $admin_dashboard_data['total_duration'] = if_property_exist($result->data->total_duration, 'totalduration', 0.00);
            $admin_dashboard_data['allusersdetails'] = $result->data->allusersdetails;
        }
       return handle_success_response('Success', $admin_dashboard_data);
    }
    catch (Exception $e)
    {
        handle_exception($e);
    }
}

function get_document_search_assest_check() {
    try
    {   
        $drop_down['columns'] = array(
            array('id' => 'status','descr' => 'Status'),
            array('id' => 'asset_type','descr' => 'Asset Type'),
            array('id' => 'asset_owner','descr' => 'Asset Owner'),
            array('id' => 'stake_holders','descr' => 'Stake Holders'),
            array('id' => 'purchase_date','descr' => 'Purchase Date'),
            array('id' => 'brand_name','descr' => 'Brand Name'),
            array('id' => 'serial_no','descr' => 'Serial No'),
            array('id' => 'asset_name','descr' => 'Asset Name'),
            array('id' => 'expiry_type','descr' => 'Expiry Type'),
            array('id' => 'expiry_date','descr' => 'Expiry Date'),
            array('id' => 'assigned_to','descr' => 'Assigned To'),
            array('id' => 'taken_date','descr' => 'Taken Date'),
            array('id' => 'return_date','descr' => 'Return Date'),
            array('id' => 'asset_status','descr' => 'Asset Status')
        );

        $drop_down['conditions'] = array(
            array('id' => '=','descr' => '='),
            array('id' => '<=','descr' => '<='),
            array('id' => '>=','descr' => '>='),
            array('id' => '<','descr' => '<'),
            array('id' => '>','descr' => '>'),
            array('id' => 'like','descr' => 'like')
        );

        return handle_success_response('Success', $drop_down);
    }
    catch (Exception $e)
    {
        handle_exception($e);
    }
}

?>
