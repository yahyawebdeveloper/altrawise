/**
 * @author Jamal
 * @date 01-Oct-2021
 * @Note = Please do not apply Ctr-Alt-Format for better readable codes
 *         Please follow the indentation
 *         Please follow the naming convention
 */
var RECORD_INDEX 	= 0;
var upload_section 	= '';
var btn_save;
var ROW_ID			= '';
var SESSIONS_DATA = $.jStorage.get('session_data');
$(window).on('beforeunload', function ()
{
	// Temporary disable
	// $.fn.signout_application();
	// $.fn.user_logout();	
});

$.fn.reset_form = function(form)
{
	try
	{
		
		FORM_STATE		= 0;		
		if(form == 'list')
		{
			$('#txt_cutter_no_search')		.val('');
			$('#txt_cutter_desc_search')	.val('');
			$('#txt_remarks_search')		.val('');
			$('#dd_cutter_category_search')	.val('').change();
			$('#txt_ups_search')			.val('');
		}
		else if(form == 'form')
		{				
			$('#txt_cutter_no')		.val('');
			$('#txt_cutter_desc')	.val('');							
			$('#dd_cutter_category').val('').change();			
			$('#txt_ups')			.val('');
			$('#txt_remarks')		.val('');
			$('#cutter_image')		.html('');
			$('#hidden_filename')  	.val('');				
			$('.form-group').each(function () { $(this).removeClass('has-error'); });
			$('.help-block').each(function () { $(this).remove(); });
			$('#leave_div').hide();
		}

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
		var SESSIONS_DATA = $.jStorage.get('session_data');
		var data	= 
		{
			cutter_no 			: $('#txt_cutter_no_search').val(),
			cutter_desc			: $('#txt_cutter_desc_search')	.val(),
			remarks 			: $('#txt_remarks_search')	.val(),
			cutter_ctg_id 		: $('#dd_cutter_category_search').val(),
			ups					: $('#txt_ups_search').val(),
			is_image_available 	: $('#dd_is_image').val(),
			start_index			: RECORD_INDEX,
			limit				: LIST_PAGE_LIMIT,			
			emp_id				: SESSIONS_DATA.emp_id
	 	};
	 	if(is_scroll)
	 	{
	 		data.start_index =  RECORD_INDEX;
	 	}
	 										
	 	$.fn.fetch_data
		(
			$.fn.generate_parameter('get_misc',data),	
			function(return_data)
			{
				if(return_data)
				{	
					
					if(return_data.data.rec_index)
					{
						RECORD_INDEX = return_data.data.rec_index;
					}
					//$.fn.data_table_destroy();
					$.fn.populate_list_form(return_data.data, is_scroll);
					//$.fn.data_table_features();
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
			
			$('#master_list > tbody').empty();
			var row			= '';
			var data_val 	= '';

			for(var i = 0; i < data.length; i++)
			{	
				data_val = encodeURIComponent(JSON.stringify(data[i])); //.replace(/'/,"");
				
				row += `<tr>
							<td><a class="tooltips" href="javascript:void(0)" data-value=${data_val} onclick="$.fn.populate_detail_form(decodeURIComponent($(this).attr(\'data-value\')))" data-trigger="hover" data-original-title="Edit data "><i class="mdi mdi-lead-pencil text-primary"></i></a></td>
							<td>${data[i].descr}</td>
							<td>${data[i].category}</td>`;

				if(data[i].category_id == 16)
				{
					row +=	`<td>${data[i].no_of_days}</td>`;
				}

				if(data[i].category_id == 2 || data[i].category_id == 30)
				{
					row +=	`<td>${data[i].roles}</td>`;
				}
				else if(data[i].category_id == 32)
				{
					row +=	`<td>${'6 Month and Less : '+data[i].field1+'<br>'+'More than 6 Months : '+data[i].field2}</td>`;
				}
				else if(data[i].category_id == 61 || data[i].category_id == 62)
				{
					row +=	`<td>${data[i].field1 == 1 ? 'Yes' : 'No'}</td>`;
				}
				else if(data[i].category_id == 67)
				{
					row +=	`<td>${data[i].field1}</td>`;
				}

				row +=	`<td>${data[i].status}</td>
						</tr>`;	
							
			}
			$('#master_list tbody').append(row);
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

$.fn.prepare_form = function()
{	
	try
	{
		
		$('#employer_form').parsley
		({
			successClass	: 'has-success',
			errorClass		: 'has-error',
			errors			: 
			{
		    	classHandler: function(el)
		    	{
		        	return $(el).closest('.error-container');
		    	},
		        container : function(el)
		        {
		            return $(el).closest('.error-container');
		        },
		    	errorsWrapper	: '<ul class=\"help-block list-unstyled\"></ul>',
		    	errorElem		: '<li></li>'
			}
		});
		
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
		
		$('#holiday_form').parsley
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
		
		
		//$.fn.get_cutter_config();
		$.fn.get_list(false);
		$.fn.get_employers_list();
		$('#dd_company').select2();
		$('#s2id_dd_category').select2();
		$('#dd_year').select2();
		 $(document).on('select2:open', () => {
    document.querySelector('.select2-search__field').focus();
	
  });
		
		var elems = Array.prototype.slice.call(document.querySelectorAll('.js-switch'));
		$('.js-switch').each(function() 
		{
		    new Switchery($(this)[0], $(this).data());
		});

		$.fn.change_switchery($('#is_active'), true);
		$("#dp_hp").datepicker({
		'todayHighlight': true,
		'format': "dd-M-yyyy",
		});
		$("#dp_hp").datepicker("setDate", new Date());
		
	}
	catch(err)
	{
		$.fn.log_error(arguments.callee.caller,err.message);
	}			
};

$.fn.save_edit_form = function()
{
	try
	{
		
		var cat_id 		= 	$('#dd_category')		.val();
		cat_id = 17;
		var noOfDays	=	null;
		if(cat_id == 16)
		{
			noOfDays 	=	$('#txt_no_of_days')	.val();
		}
		
		let field1,field2,field3 = '0';
		if(cat_id == 30)
		{
			if($('#dd_roles').val() != '' && $('#dd_roles').val() != null)
			{
				field1 = $('#dd_roles').val().toString();
			}
			
			field2 = $('#txt_sla').val();
			field3 = $('#txt_kpi').val();
		}
		else if(cat_id == 32)
		{
			field1 = $('#txt_6_months').val();
			field2 = $('#txt_7_months').val();
			field3 = 0;
		}
		if(cat_id == 2)
		{
			if($('#dd_roles').val() != '' && $('#dd_roles').val() != null)
			{
				field1 = $('#dd_roles').val().toString();
			}
		}
		if(cat_id == 61 || cat_id == 62)
		{
			field1 = $("#chk_is_chargeable").is(":checked") ? 1 : 0;
		}
		if(cat_id == 67)
		{
			field1 = $("#txt_onboarding_cost").val();
		}
		
		var data	= 
		{
			id				: ROW_ID,
			descr			: $('#txt_desc').val(),
			category_id		: cat_id,
			no_of_days		: noOfDays,
			field1			: field1,
			field2			: field2,
			field3			: field3,
			is_active		: $('#chk_is_active').is(':checked')	? 1 : 0,
			emp_id			: SESSIONS_DATA.emp_id
	 	};
										
	 	$.fn.write_data
		(
			$.fn.generate_parameter('add_edit_misc', data),	
			function(return_data)
			{
				if(return_data.data)
				{
					$.fn.populate_list_form(return_data.data);
					$.fn.show_right_success_noty('Data has been recorded successfully');
					
					$.fn.reset_form(false);

					btn_save.stop();
					if(cat_id == 67)
					{
						$('#btn_save').attr('disabled', 'disabled');
					}

				}
				
			},false, false
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
	$('#btn_save')			.html('<i class="fa fa-edit"></i> Edit');
};

$.fn.bind_command_events = function()
{	
	try
	{	
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

		$('#btn_save').click( function(e)
		{
			e.preventDefault();
			btn_save = Ladda.create(this);
	 		btn_save.start();
			setTimeout(function() {
               btn_save.remove();
			   $("#btn_save").removeClass("ladda-button");
            }, 3000);
			
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

		$('#btn_add').click(function()
		{
			$('#addForm').show();
			$('#tblList').hide();
		});

		$('#btn_cancel').click(function()
		{
			$('#addForm').hide();
			$('#tblList').show();
		});
		$('#btn_emp_new').click( function(e)
		{
			e.preventDefault();
			
			$.fn.reset_emp_form();
			$.fn.show_hide_form('NEW');
			$('#new_btn_div')				.hide(400); //newly added
			$('#col-sm12_div')				.hide(400); //newly added		
		
		});	
		$('#btn_emp_hide').click( function(e)
		{
			e.preventDefault();
			$.fn.show_hide_form('HIDE');
		});
		$('#btn_dept_reset').click( function(e)
		{
			e.preventDefault();
			$.fn.reset_form(true);
		});	
		$('#btn_hp_save').click( function(e)
		{
			e.preventDefault();
			btn_hp_save = Ladda.create(this);
			btn_hp_save.start();
			setTimeout(function() {
               btn_hp_save.remove();
			   $("#btn_hp_save").removeClass("ladda-button");
            }, 3000);
	 		$.fn.save_holiday();
		});
		$('#btn_add_upload_batch').click( function(e)
		{
			e.preventDefault();
			btn_save_upload_batch = Ladda.create(this);
			btn_save_upload_batch.start();
			setTimeout(function() {
               btn_save_upload_batch.remove();
			   $("#btn_hp_save").removeClass("ladda-button");
            }, 3000);
			$.fn.add_upload_ph_batch();
		});
		$('#btn_emp_save').click( function(e)
		{
			e.preventDefault();
			btn_emp_save = Ladda.create(this);
			btn_emp_save.start(); 
			setTimeout(function() {
               btn_emp_save.remove();
			   $("#btn_emp_save").removeClass("ladda-button");
            }, 3000);			
			$.fn.save_edit_emp_form();
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
$.fn.populate_detail_form = function(data)
{
	try
	{
		var data 	= JSON.parse(data);
		
		ROW_ID = data.id;
		$('#txt_desc')		.val(data.descr);
		$('#dd_category')	.val(data.category_id).change();
		$('#chk_is_active').prop('checked', parseInt(data.is_active) ? true : false);
		
		$('#txt_no_of_days').val('');
		$('#dd_roles')		.val('').change();
		$('#txt_sla,#txt_kpi').val('');
		if(data.category_id == 16)
		{
			$('#txt_no_of_days').val(data.no_of_days);
		}
		else if(data.category_id == 30)
		{	
			$('#dd_roles')	.val(JSON.parse("[" + data.field1 + "]")).change();
			$('#txt_sla')	.val(data.field2);
			$('#txt_kpi')	.val(data.field3);
		}
		else if(data.category_id == 32)
		{
			$('#txt_6_months')	.val(data.field1);
			$('#txt_7_months')	.val(data.field2);
		}
		else if(data.category_id == 2)
		{
			$('#dd_roles')	.val(JSON.parse("[" + data.field1 + "]")).change();
		}
		else if(data.category_id == 61 || data.category_id == 62)
		{	
			$('#chk_is_chargeable').prop('checked', parseInt(data.field1) ? true : false);
		}
		else if(data.category_id == 67)
		{
			$('#txt_onboarding_cost')	.val(data.field1);
			$('#btn_save').removeAttr('disabled');
		}

		$('#btn_save').html('<i class="mdi mdi-content-save-outline"></i> Update');
		
	}
	catch(err)
	{
		$.fn.log_error(arguments.callee.caller,err.message);
	}
};

$.fn.populate_employers_list = function(data)
{
	
	try
	{	
		if (data)
		{
			
			$('#tbl_view_list > tbody').empty();
			
			var row			= '';
			var data_val 	= '';
			let btn_edit	= '';
			for(var i = 0; i < data.length; i++)
			{
				//console.log(MODULE_ACCESS);
				data_val = escape(JSON.stringify(data[i]));
				
				/* if(MODULE_ACCESS.edit == 1)
				{
					btn_edit = 	`<a class="tooltips" href="javascript:void(0)" onclick="$.fn.populate_employer_details(decodeURIComponent( $(this).closest('tr').attr('data-value')  ))" data-trigger="hover" data-original-title="Edit data "><i class="fa fa-pencil"/></a>`;
				} */
				/* else
				{ */
					btn_edit = 	`<a class="tooltips" href="javascript:void(0)" onclick="$.fn.populate_employer_details(decodeURIComponent( $(this).closest('tr').attr('data-value')  ))" data-trigger="hover" data-original-title="Edit data "><i class="mdi mdi-lead-pencil text-primary"></i></a>`;
				//}
				row += 	`<tr data-value=${data_val} ID=${'tr_row_' + i}">
							<td>${btn_edit}</td>
							<td>${data[i].employer_name}</td>
							<td>${data[i].prefix}</td>
							<td>${data[i].is_active_desc}</td>
							<td>${data[i].created_date}</td>
						</tr>`;
			}
			$('#tbl_view_list > tbody').html(row);
			$('.back-to-top-badge').removeClass('back-to-top-badge-visible');
		}
        
 
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
					
					$.fn.populate_employers_list(return_data.data);
					$.fn.populate_employers_drop_down(return_data.data);
					$.fn.populate_year_drop_down();
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
			$('#dd_company').html(row);
			$('#dd_company').val(data[0].id);
			if( $('#dd_year').val() != null )
				$('#dd_company').trigger('change');
		}
        
 
	}
	catch(err)
	{
		$.fn.log_error(arguments.callee.caller,err.message);
	}
};
$.fn.populate_year_drop_down = function()
{
	try
	{	
		var yearRange = new Date().getFullYear();
		var row = '';
		for(var i = yearRange; i >= 2015; i--)
		{
			row += 	`<option value=${i}>
						${i}
					</option>`;
		}
		$('#dd_year').html(row);
		$('#dd_year').val(yearRange);
		$('#dd_year').trigger('change');
		
        
 
	}
	catch(err)
	{
		$.fn.log_error(arguments.callee.caller,err.message);
	}
};

$.fn.populate_holiday_list = function(data)
{
	try
	{	
		
		if (data) // check if there is any data, precaution 
		{
			$('#hp_list > tbody').empty();
			var row			= '';
			var data_val 	= '';
			for(var i = 0; i < data.length; i++)
			{
				data_val = encodeURIComponent(JSON.stringify(data[i]));
				row += `<tr>
							<td><a class="tooltips" href="javascript:void(0)" data-value="${data_val}" onclick="$.fn.populate_hp_detail(decodeURIComponent( $(this).attr('data-value')  ))" data-trigger="hover" data-original-title="Edit data "><i class="mdi mdi-lead-pencil text-primary"></i></a></td>
							<td>${data[i].company}</td>
							<td>${data[i].holiday}</td>
							<td>${data[i].holiday_desc}</td>
							<td>${data[i].is_active == 1 ? 'ACTIVE' : 'INACTIVE'}</td>
						</tr>`;	
							
			}
			$('#hp_list tbody').append(row);
			$('#total_holidays').html(data.length);
		}						
	}
	catch(err)
	{
		$.fn.log_error(arguments.callee.caller,err.message);
	}
};

$.fn.get_holidays_list = function(id)
{
	try
	{
	
		var data	= 
		{
			company_id	: $('#dd_company').val(),
			year		: $('#dd_year').val()
	 	};
	 											
	 	$.fn.fetch_data
		(
			$.fn.generate_parameter('get_holidays_list',data),	
			function(return_data)
			{
				
				if(return_data.data)
				{
					$.fn.populate_holiday_list(return_data.data);
				}
			},true
		);
	}
	catch(err)
	{
		$.fn.log_error(arguments.callee.caller,err.message);
	}
};
$.fn.show_hide_form = function(form_status)
{		
	if(form_status == 'NEW')
	{	
		$("#messages-b2")				.removeClass("active");
		$('#new_div')					.show(400);
		$("#div_cd")					.addClass("active");					
		$('#h4_primary_no')				.text('New Employer');
	}
	else if(form_status == 'EDIT')
	{
		$("#messages-b2")				.removeClass("active");
		$('#new_div')					.show(400);
		$("#div_cd")					.addClass("active");
		$('#btn_save')					.html('<i class="fa fa-save"></i> EDIT');
		$('#new_btn_div')				.hide(400);		// newly added
		$('#col-sm12_div')				.hide(400);		// newly added
	}
	else if(form_status == 'HIDE')
	{
		$("#messages-b2")				.addClass("active");
		$('#new_div')					.hide(400);
		$('#new_btn_div')				.show(400);		// newly added
		$('#col-sm12_div')				.show(400);		// newly added
		$("#div_cd")					.removeClass("active");
	}
};

$.fn.reset_emp_form = function(form)
{
	try
	{
		$("#btn_remove_logo").hide();
		$("#employer_form").trigger('reset');
		$("#employer_form").parsley().reset();

		$.fn.init_crop();
	}
	catch(err)
	{
		$.fn.log_error(arguments.callee.caller,err.message);
	}
};

$.fn.init_crop = function()
{
	try
	{
		var $uploadCrop,
	    tempFilename,
	    rawImg,
	    imageId;

	    //reset previous codes
	    $('#upload-demo').empty();
	    
	    function readFile(input) {
	        var extension = (input.files[0].name).split('.').pop();
	        var allowed_extensions = ["jpg", "jpeg", "png"];
	        if (input.files && input.files[0]) {
	          var reader = new FileReader();
	            reader.onload = function (e) {
	                $('.upload-demo').addClass('ready');
	                $('#cropImagePop').modal('show');
	                rawImg = e.target.result;
	            }
	            reader.readAsDataURL(input.files[0]);
	        }
	    }

	    /* $uploadCrop = $('#upload-demo').croppie({
	        viewport: {
	            width: 500,
	            height: 32,
	        },
	        enforceBoundary: true,
	        enableExif: true
	    }); */

	    $('#cropImagePop').on('hide.bs.modal', function()
	    {
	    	$('.item-img').val('');
	   	});

	    $('#cropImagePop').on('shown.bs.modal', function(){
	        $uploadCrop.croppie('bind', {
	            url: rawImg
	        }).then(function(){
	            console.log('jQuery bind complete');
	        });
	    });

	    $(document).on('change', '.item-img', function () { imageId = $(this).data('id'); tempFilename = $(this).val();
	     readFile(this); });
	    $('#cropImageBtn').on('click', function (ev) {
	        $uploadCrop.croppie('result', {
	            type: 'rawcanvas',
	            format: 'png',
	            size: {width: 250, height: 16}
	        }).then(function (resp) {
	            $("#profile_photo_base64").val(resp.toDataURL());
	            $('#profile_photo-output').attr('src', resp.toDataURL());
	            $('#cropImagePop').modal('hide');
	        });
	    });

	}
	catch(err)
	{
		$.fn.log_error(arguments.callee.caller,err.message);
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
$.fn.save_holiday = function(tbl_name)
{
	try
	{
		
		if($('#holiday_form').parsley( 'validate' ) == false)
		{
			btn_hp_save.stop();
			return;
		}
		
		var data	= 
		{
			id				: ROW_ID,
			company_id		: $('#dd_company').val(),
			year			: $('#dd_year').val(),
			date			: $('#dp_hp').val(),
			desc			: $('#txt_hp_desc').val(),
			is_active		: $('#chk_hp_is_active').is(':checked')	? 1 : 0,
			emp_id			: SESSIONS_DATA.emp_id
	 	};
										
	 	$.fn.write_data
		(
			$.fn.generate_parameter('add_edit_holiday', data),	
			function(return_data)
			{
				if(return_data.data)
				{
					$.fn.populate_holiday_list(return_data.data);
					$.fn.show_right_success_noty('Data has been recorded successfully');
					$.fn.reset_form('holiday');
				}
				
			},false, btn_hp_save
		);
	}
	catch(err)
	{
		$.fn.log_error(arguments.callee.caller,err.message);
	}
};
$.fn.add_upload_ph_batch = function()
{
    try 
    {
    	if(UPLOADED_PH_DATA == '')
		{
    		$.fn.show_right_error_noty('Uploading data cannot be empty');
    		btn_save_upload_batch.stop();
    		return;
		}
    	
    	let data =
        {
			ph_data 	: UPLOADED_PH_DATA,
			emp_id    	: SESSIONS_DATA.emp_id
        }
    	
    	$.fn.write_data
        (
            $.fn.generate_parameter('add_ph_upload_batch', data),
            function(return_data)
            {
                if(return_data.data)
                {
                	$('#btn_add_upload_batch').hide();
                	$.fn.populate_uploaded_holiday(return_data.data);
                	$.fn.get_holidays_list();
                }
            }, false,btn_save_upload_batch
        );
    	
    } 
    catch (e) 
    {
        $.fn.log_error(arguments.callee.caller, e.message);
    }
}
$.fn.save_edit_emp_form = function(tbl_name)
{
	try
	{
		
		console.log( $('#employer_form').parsley( 'validate' ) == false,"test" );
		if($('#employer_form').parsley( 'validate' ) == false)
		{
			btn_emp_save.stop();
			return false;
		}

		var data	= 
		{
			employer_id			: $('#employer_id').val(),
			created_by			: SESSIONS_DATA.emp_id,
			employer_name		: $('#employer_name').val(),
			employer_address	: $('#employer_address').val(),
			prefix				: $('#prefix').val(),
			mail_signature		: $('#mail_signature').val(),
			phone_no			: $('#phone_no').val(),
			website				: $('#website').val(),
			is_active			: $('#is_active').is(':checked') ? 1 : 0,
			voucher_prefix		: $('#voucher_prefix').val(),
			voucher_suffix		: $('#voucher_suffix').val(),
			voucher_sequence	: $('#voucher_sequence').val(),
		};	
		
		$.fn.write_data
		(
			$.fn.generate_parameter('add_edit_employer', data),	
			function(return_data)
			{
				if(return_data.data)
				{	
					let company_id 		= 	return_data.data;


					$.fn.fetch_data
					(
						$.fn.generate_parameter('edit_company_logo',{image : $('#profile_photo_base64').val(),company_id : company_id}),
						function(return_data)
						{
							$("#employer_form").parsley().reset();
							$.fn.show_right_success_noty('Data has been recorded successfully');
							$.fn.get_employers_list();
							$.fn.show_hide_form('HIDE');					
						}
					);

					


				// 	let company_id 		= 	return_data.data;
				// 	FILE_UPLOAD_PATH    =   `companies/${company_id}/`;
                        
    //                 let attachment_data =   
    //                 {
    //                     id              : '',
    //                     primary_id      : company_id,
    //                     secondary_id    : '',
    //                     module_id       : MODULE_ACCESS.module_id,
    //                     filename        : '',
    //                     filesize        : "0",
    //                     json_field      : {},
    //                     emp_id          : SESSIONS_DATA.emp_id
    //                 };
                    

    //                 if($('#profile_photo').val() != '')
    //                 {   
    //                 	let file_uploaded = 1;
    //                     $.fn.upload_file('profile_photo','company_id',company_id,
    //                     attachment_data,function(total_files, total_success,filename,attach_return_data)
    //                     {
    //                         if(total_files == total_success)
    //                         {   
    //                         	if(file_uploaded == 1)
    //                             {
	   //                          	$("#employer_form").parsley().reset();
				// 					$.fn.show_right_success_noty('Data has been recorded successfully');
				// 					$.fn.get_employers_list();
				// 					$.fn.show_hide_form('HIDE');
				// 				}
				// 				file_uploaded++;
    //                         }
    //                     },false,btn_emp_save);
    //                 }
    //                 else
    //                 {	
    //                 	$("#employer_form").parsley().reset();
				// 		$.fn.show_right_success_noty('Data has been recorded successfully');
				// 		$.fn.get_employers_list();
				// 		$.fn.show_hide_form('HIDE');
    //                 }
				 }
				
			},false, btn_emp_save
		);
	}
	catch(err)
	{
		$.fn.log_error(arguments.callee.caller,err.message);
	}
};
$.fn.populate_hp_detail = function(data)
{
	try
	{
		var data 			= JSON.parse(data);
		
		ROW_ID 				= data.id;
		$('#dp_hp')     	.val('');//moment(data.holiday).format(UI_DATE_FORMAT)
		$('#txt_hp_desc')	.val(data.holiday_desc);
		$('#chk_hp_is_active').prop('checked', parseInt(data.is_active) ? true : false);
		$('#btn_hp_save')	.html('<i class="fa fa-check"></i>Update');
		
	}
	catch(err)
	{
		$.fn.log_error(arguments.callee.caller,err.message);
	}
};
$.fn.populate_employer_details = function(data)
{
	try
	{
		var data 				= JSON.parse(data);
		$.fn.show_hide_form('EDIT');
		$('#employer_id')		.val(data.id);
		$('#employer_name')		.val(data.employer_name);
		$('#employer_address')	.val(data.employer_address);
		$('#prefix')			.val(data.prefix);
		$('#mail_signature')	.val(data.mail_signature);
		$('#phone_no')			.val(data.phone_no);
		$('#website')			.val(data.website);
		$('#voucher_prefix')	.val(data.voucher_prefix);
		$('#voucher_suffix')	.val(data.voucher_suffix);
		$('#voucher_sequence')	.val(data.voucher_sequence);
		$.fn.change_switchery($('#is_active'),(parseInt(data.is_active) ? true : false));
		
		$.fn.init_crop();

		if(data.attachment)
		{
			$(".gambar").attr("src", data.attachment); 
		}
		if(data.is_logo == true)
		{
			$('#btn_remove_logo').show();
		}
		else
		{
			$('#btn_remove_logo').hide();
		}
		// $.fn.populate_fileupload(data,'name_card_attachment',true);

  //       if($("#name_card_attachment").html().length > 0) 
  //       {
  //           $('#browse_file_div').hide();
  //           $("#name_card_attachment").find('.col-sm-4').toggleClass('col-sm-4 col-sm-12');
  //       }
  //       else
  //       {
  //           $('#browse_file_div').show();
  //       }

  //       $.fn.init_upload_file();
	}
	catch(err)
	{
		$.fn.log_error(arguments.callee.caller,err.message);
	}
};