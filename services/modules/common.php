<?php

use setasign\Fpdi\FpdfTpl;
use setasign\Fpdi\Fpdi as FpdiFpdi;
use setasign\Fpdi\Tcpdf\Fpdi as TcpdfFpdi;
use setasign\Fpdi\Tfpdf\FpdfTpl as TfpdfFpdfTpl;
use setasign\Fpdi\Tfpdf\Fpdi;


function get_service_request_search_dropdown($params) {

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
        $drop_down['category'] = db_query('id,descr','cms_master_list',"category_id = 2 AND is_active = 1");

        $drop_down['emp']       = db_query('id,name as descr','cms_employees','is_active = 1');

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
        $drop_down_groups['emp_leave_type']  =   db_query('cms_master_list.id as id,cms_master_list.descr as descr,cms_emp_leave.no_of_days','cms_emp_leave INNER JOIN cms_master_list ON
        cms_emp_leave.master_list_id = cms_master_list.id','cms_emp_leave.emp_id = '.$emp_id.' AND cms_emp_leave.applicable_year = ' . $curr_year . ' AND cms_emp_leave.is_active = 1');

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

?>