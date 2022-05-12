/**
 * @author          Syed Anees
 * @module          Client Portal
 * @description     Tasks Request
 * @date            04-05-22
 */

var RECORD_INDEX 	= 0;

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
                        { sWidth: '25%' },
                        { sWidth: '20%' },
                        { sWidth: '20%' },
                        { sWidth: '20%' },
                        { sWidth: '15%' },
                        { sWidth: '15%' },
                        // { sWidth: '5%' }
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
                data_val = encodeURIComponent(JSON.stringify(data[i]));
				// data_val = escape(JSON.stringify(data[i])); //.replace(/'/,"");
				// console.log(data_val);				
				// photo_content = '<a href="../../services/files/cutter_image/' + data[i].cutter_image_path  + '" target=_blank><img src="../../services/files/cutter_image/' + data[i].cutter_image_path  + '" width="100" /></a>';
				// photo_content = '';

                let action_cont = `<a href="task/${data[i].task_no}" data-navigo>
                <button type="button" class="btn btn-outline-success btn-xs waves-effect waves-light" data-bs-toggle="tooltip" data-bs-placement="top" title="View">
                    <i class="fas fa-sign-in-alt"></i>
                </button></a>`;
				
				row += `<tr>
							<td>${data[i].task_no}</td> 
							<td>${data[i].task_title}</td>  
							<td>${
								(() => {
									if(data[i].assign_to == null) {
										return `-`;

									} else {
										return data[i].assign_to;

									}

								})()

							}</td>
                            <td>${
								(() => {
									if(data[i].due_date == null) {
										return `-`;

									} else {
										return data[i].due_date;

									}

								})()

							}</td>
                            <td>${data[i].status_name}</td>    
							
							<td>
                                ${action_cont}
                            </td>
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

$.fn.get_list = function(is_scroll) {
    try
    {
        var data	= 
        {
        //  name : $('#txt_name_search').val(),
        //  status_id: $('#dd_status_search').val(),
        //  client_id: $('#dd_client_search').val(),
        //  email: $('#txt_email_search').val(),
            start_index	: RECORD_INDEX,
            limit: LIST_PAGE_LIMIT,
        //  is_admin: SESSIONS_DATA.is_admin,
        //  created_by: $('#dd_created_by_search').val(),
            contact_id: SESSIONS_DATA.contact_id,
            client_id: SESSIONS_DATA.client_id
        };
        if(is_scroll)
        {
            data.start_index =  RECORD_INDEX;
        }
                                            
        $.fn.fetch_data
        (
            $.fn.generate_parameter('get_client_task_list',data),	
            function(return_data)
            {
                if(return_data)
                {	
                    // console.log(return_data);
                    if(return_data.data.rec_index) {
                    	RECORD_INDEX = return_data.data.rec_index;
                    }
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
        console.log(err.message);
        // $.fn.log_error(arguments.callee.caller,err.message);
    }
};

$.fn.save_edit_form = function() {
    try
    {
    	if($('#detail_form').parsley().validate() == false)
		{
			btn_save.stop();
			return;
		}

		
		let data 	=
        {
        	task_no			: '',
        	title       	: $('#task_title').val(),
        	descr       	: encodeURIComponent($('#txt_task_desc').val()),
			status_id       : $('#task_status').val(),
        	// descr_action    : encodeURIComponent($('#txtarea_descr_action').val()),
            // assign_data 	: $.fn.get_assignee(),
            // due_date    	: date.format('YYYY-MM-D'),
            // status			: $('#btn_status').data('value'),
            priority		: $('#task_priority').val(),
            // priority_name 	: $('#dd_priority option:selected').text(),
            task_type		: $('#task_type').val(),
        	dept_id			: $('#task_dept_id').val(),
            // attachment		: attachment,
        	emp_id      	: SESSIONS_DATA.contact_id,
        	emp_name      	: SESSIONS_DATA.contact_name,
        	// to_chat_ids		: $.fn.get_assignee_for_chat(),
        	//checklist		: $.fn.get_checklist_list(),

        	sbg_id 			: $('#task_sbg_id').val(),
         	sbd_id			: $('#task_sbd_id').val(),
         	oc_id			: $('#task_company_id').val(),
         	task_group		: $('#task_group_id').val(),
            client_id       : SESSIONS_DATA.client_id,
            client_remarks  : $('#txt_client_remarks').val() 
        }
	    
        // var task_creation_date = (new Date()).toISOString().split('T')[0];
	    // $("#task_creation_date").val(task_creation_date);
		
        $.fn.write_data(
            $.fn.generate_parameter('add_edit_client_tasks_new', data),
            function(return_data)
            {
                if (return_data.data)  // NOTE: Success
                {
                	// TASK_ID				= return_data.data.task_no;
                	// $('#h4_primary_no').text('Task No : ' + TASK_ID);
                    
                    // $.fn.show_hide_form	('EDIT');
					// console.log(btn_save,"bt");
                    // var templateId = $("#btn_save").attr("data-template-id");
                    btn_save.stop();
					
					// if( templateId  )
					// 	$("#loading").html("&nbsp;[Please wait...while populating any Assignee(s) to add.] ");
                    $.fn.show_right_success_noty('Data has been recorded successfully');
                    
					// $.fn.get_list(false);
					// $("#trail").attr("data-name",SESSIONS_DATA.name);
					$("#btn_save").removeClass("ladda-button");
					
					// if( templateId  )
					// 	$.fn.populate_template_assignee_row(templateId);
                	
                }
            },false, btn_save
        );
    } 
    catch (e) 
    {
        $.fn.log_error(arguments.callee.caller, e.message);
    }
}

$.fn.get_template_details_by_id = function(template_id) {
    try
    {
        let data =
        {
            task_id: template_id,
            // emp_id: SESSIONS_DATA.emp_id,
            // view_all: CLIENTS_MODULE_ACCESS.viewall
        }

        $.fn.fetch_data(
            $.fn.generate_parameter('get_task_template_detail', data),
            function (return_data)
            {
                if (return_data.data)
                {
                    data = return_data.data.details;
                    console.log(data);
                    $('#txt_task_desc').html($.fn.decodeURIComponentSafe(data.descr));

                    $('#task_title').val(data.task_title);
                    $('#task_status').val(data.status_id);
                    $('#task_priority').val(data.priority_id);
                    $('#task_type').val(data.task_type_id);
                    $('#task_dept_id').val(data.dept_id);
                    $('#task_sbd_id').val(data.sbd_id);
                    $('#task_sbg_id').val(data.sbg_id);
                    $('#task_company_id').val(data.company_id);
                    $('#task_group_id').val(data.task_group_id);
                }

            }, false
        );
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

$.fn.populate_task_template_dd = function(data) {
    try {
        if (data)
		{
			for (let item of data)
			{
				$('#dd_task').append(`<option value="${item.id}" data-value="">${item.task_title}</option>`);
			}

		}
    } catch(err) {
        $.fn.log_error(arguments.callee.caller, err.message);
    }
}

$.fn.get_initial_data = function () {
    try
    {
        var data	= 
		{
			// title			: $('#txt_tt_title_search').val(),
			is_active		: 1,
			view_all		: 1, //MODULE_ACCESS.viewall,
			start_index		: 0,
			limit			: 1000, // get 1000 record max	
			// is_admin		: SESSIONS_DATA.is_admin,		
			// emp_id			: SESSIONS_DATA.emp_id
	 	};
	 	
	 	
	 	$.fn.fetch_data(
			$.fn.generate_parameter('get_tasks_template_list',data),	
			function(return_data)
			{
				$.fn.populate_task_template_dd(return_data.data.list);
                console.log(return_data.data.list);
			},false
    	);
    }
    catch (err)
    {
        $.fn.log_error(arguments.callee.caller, err.message);
    }
};

$.fn.show_hide_form = function (form_status, reset_form) {
    // if (reset_form) $.fn.reset_form('form');
 
    if (form_status == 'NEW') {
        $('#list_div, #btn_new').hide(400);
        // $('#new_div, #btn_back').show(400);
        $('#new_div').show(400);
        $('#h4_primary_no').text('NEW');
        // $('#tab_assets,#tab_leaves,#tab_wh,#tab_attach,#tab_exit,#tab_track,#permission-tab').hide();
        // $('#permission-tab, #tab_leaves').hide();
        $('#btn_save').html('<i class="fa fa-check"> </i> Save');
    }
    else if (form_status == 'EDIT') {
        $('#list_div, #btn_new').hide(400);
        $('#new_div').show(400);
        // $('#tab_assets,#tab_leaves,#tab_wh,#tab_attach,#tab_exit,#tab_track,#permission-tab').show();
        // $('#permission-tab,#tab_leaves').show();
        $('#btn_save').html('<i class="fa fa-edit"></i> Update');
    }
    else if (form_status == 'BACK') {
        $('#list_div, #btn_new').show(400);
        $('#new_div').hide(400);
     }
};

$.fn.prepare_form = function()
{	
	try
	{	
		
		
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

		

		//$.fn.get_cutter_config();
		$.fn.get_initial_data();
		// $.fn.get_modules_list();
		$.fn.get_list(false);
		$('.populate').select2();

		// $('.populate-multiple').select2({
		// 	templateResult: hideSelected,
		// });

		// let search_params = new URLSearchParams(window.location.search);
		// let user_id = search_params.get('user_id');
		// if (user_id != null)
		// {
		// 	$.fn.navigate_form(user_id);
		// }
	}
	catch(err)
	{
        console.log(err.message);
		// $.fn.log_error(arguments.callee.caller,err.message);
	}			
};

$.fn.bind_command_events = function() {	
     try
     {	
        //  $('#chk_is_active').change(function (e)
        //  {
        //      if ($("#chk_is_active").is(":checked")) 
        //      {
        //          $('#leave_div').hide();
        //      }
        //      else 
        //      {
        //          $('#leave_div').show();
        //      }
        //  });
 
        //  $('#btn_reset').click( function(e)
        //  {
        //      e.preventDefault();
        //      RECORD_INDEX = 0;
        //      $.fn.reset_form('list');
        //      $.fn.get_list(false);
        //  });
 
        //  $('#btn_search_action').click( function(e)
        //  {
        //      e.preventDefault();
        //      RECORD_INDEX = 0;
        //      $.fn.get_list(false);
        //  });
 
        //  $('#btn_load_more').click( function(e)
        //  {
        //      e.preventDefault();
        //      $.fn.get_list(true);
        //  });

        $('#dd_task').change(function (e)
        {
            let type_id = $(this).val();
            if (type_id != '' && type_id != null)
            {
                $.fn.get_template_details_by_id(type_id);
            }else {
                $('#txt_task_desc').html('');
            }
        });
 
        $('#btn_new').click(function (e) {
            e.preventDefault();
            $.fn.show_hide_form('NEW', true);
        });
 
        $('#btn_save').click(function(e) {
            e.preventDefault();
            btn_save = Ladda.create(this);
            btn_save.start();
            $.fn.save_edit_form();
        });
 
        $('#btn_search').click(function() {
            $('#searchPanel').show();
            $('#btn_search').hide();
        });
 
        $('#btn_close_search').click(function() {
            $('#searchPanel').hide();
            $('#btn_search').show();
        });
 
        
 
        $('#btn_cancel').click(function(e) {
            // $('#new_div').hide();
            // $('#tblList').show();
            e.preventDefault();
            $.fn.show_hide_form('BACK');
            RECORD_INDEX = 0;
            $.fn.get_list(false);
        });
 
        $('#btn_back').click(function(e) {
            e.preventDefault();
            $.fn.show_hide_form('BACK');
            RECORD_INDEX = 0;
            $.fn.get_list(false);
        });
 
        
     }
     catch(err)
     {
         $.fn.log_error(arguments.callee.caller,err.message);
     }			
};

$.fn.form_load = function() {
    try {	
        $.fn.prepare_form();
        $.fn.bind_command_events();	
    } catch(err) {
        $.fn.log_error(arguments.callee.caller,err.message);
    }
};

$(document).ready(function() {
    try
	{	
		$.fn.form_load();
	}
	catch (err)
	{
		$.fn.log_error(arguments.callee.caller, err.message);
	}
});
