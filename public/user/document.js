var btn_save; EMP_ID='';
var btn_comments_reply,btn_generate_otp,btn_validate_otp, btn_verify_document, btn_start_verify;
var DOC_NO = '';
CURRENT_PATH	= '../';
var CODE_TRIGGERED = false;
MODULE_ID = 114;
CONTRACT_ID		= ''; 
var FILE_UPLOAD_PATH        = ''; //file upload mandatory field
var ROUTE_DATA = '';
var SECRET_KEY = '';
var APPROVAL_ID = '';
var VERIFY_ACCESS = false;
var UI_DATE_FORMAT = 'DD-MMM-YYYY';

$.fn.reset_form = function(form)
{
	try
	{
		if(form == 'comments_form')
        {			
        	$("#files_reply")  	.empty();
            $('#txt_reply')     .val('');
            $('#div_reply')		.empty();
        }

	}
	catch(err)
	{
		$.fn.log_error(arguments.callee.caller,err.message);
	}
};

$.fn.populate_detail_form = function(data)
{
	try
	{	
		DOC_NO = data.user_document.doc_no;

		let doc_d = data.user_document;
		let approv_d = data.current_approval;
		let approv_all = data.approvals;

		//update the view time before the verification
		if(approv_d.is_verified == 0) {
			let v_data	= {
				id			: APPROVAL_ID,
			};

			$.fn.write_data (
				$.fn.generate_parameter('update_view_time_doc', v_data),
				function(return_data) {
					console.log(return_data);
				}, false, '', true
			);
		}

		//populate input fields
		$('#txt_emp_id').val(approv_d.user_id);
		$('#txt_email_id').val(approv_d.email);
		$('#txt_name').val(approv_d.name);
		$('#txt_doc_no').val(doc_d.doc_no);
		$('#txt_mobile_no').val(approv_d.mobile_no);
		$('#txt_id').val(APPROVAL_ID);
		$('#doc_verify_method').val(doc_d.verification_type);

		//populate data
		$('.approval-name').html(approv_d.name);
		$('.avatar-initials').attr('data-name', approv_d.name);
		$('#td_doc_no').html(doc_d.doc_no);
		$('#td_doc_title').html(doc_d.title);
		$('#td_doc_category').html(doc_d.category_name);
		$('#td_employer_name').html(doc_d.employer_name);
		$('#td_doc_date').html(doc_d.doc_date);
		$('#td_due_date').html(doc_d.due_date);
		

		getInitials();

		//populate attachments
		let documents = data.documents;
		if(documents.length > 0) {
			let col = '';
			
			for(let i=0; i < documents.length; i++) {
				let file_name = documents[i].name;
				let fileExtension = file_name.split('.').pop();
				

				col += `<div class="col-xl-4">
				<div class="card mb-1 shadow-none border">
					<div class="p-2">
					<div class="row align-items-center">
						<div class="col-auto">
						<div class="avatar-sm">
							<span
							class="avatar-title ${(() => {
								switch (fileExtension) {
									case 'pdf':
										return  `bg-soft-primary text-primary`;
									case 'doc':
										return  `bg-soft-success text-success`;
									case 'docx':
										return  `bg-soft-success text-success`;
									case 'xls':
										return  `bg-secondary`;
									case 'xlsx':
										return  `bg-secondary`;
									default :
									return  `bg-soft-primary text-primary`;
								}
							})() } rounded"
							>
							.${fileExtension}
							</span>
						</div>
						</div>
						<div class="col ps-0">
						<a href class="text-muted fw-bold link-view-file" data-id="${documents[i].uuid}"
							>${documents[i].name}</a
						>
						</div>
						<div class="col-auto">
						<!-- Button -->
						<a
							href class="btn btn-link btn-lg text-muted link-view-file" data-id="${documents[i].uuid}"
						>
							<i class="dripicons-download"></i>
						</a>
						</div>
					</div>
					</div>
				</div>
				<input type="hidden" id="attachment_id" value="${documents[i].uuid}"/>
				</div>`
			}
			$('#attachments_container').append(col);

			$('.link-view-file').unbind().on('click', function (event) {
				event.preventDefault();
				$.fn.open_page($(this).data('id'), window.location.origin + `${directory_path}public/download.php`);
			});
		}

		//populate verifiers
		if(doc_d.is_show_verifiers == 1 && approv_all.length > 0) {
			$('#list_verifiers_container').show();
			let veri_list = ''
			for(let j=0; j<approv_all.length; j++) {
				veri_list += `<div class="inbox-item">
				
				<a href="javascript:void(0)" class="inbox-item-author">
					<i class="fa  ${(() => {
						if(approv_all[j].is_verified == 1) {
							return `fa-check-square text-success`;
						}else {
							return `fa-square`;
						}
					})()}"></i>&nbsp;&nbsp;${approv_all[j].name} ${(() => {
						if(approv_all[j].is_verified == 1) {
							return `(verified)`;
						}else {
							return ``;
						}
					})()}
				</a>
				
				</div>`;
			}
			$('#verifier_container').append(veri_list);
		}else {
			$('#list_verifiers_container').hide();
			$('.inbox-rightbar').css({ 'margin-left' : '0px', 'border-left' : 'none'});
		}

		//verify btn
		if(approv_d.is_verified != 1) {
			$('#btn_verify_container').show();
		}else {
			$('#btn_verify_container').hide();
		}
		
		//get comments
		$.fn.get_user_doc_comments_list();
		
	}
	catch(err)
	{
		$.fn.log_error(arguments.callee.caller,err.message);
	}
};

$.fn.generate_digital_signature = function()
{
	try
	{		
		var data	=
		{
			attachment_id	: $('#attachment_id').val()
		};
		
		$.fn.write_data
		(
			$.fn.generate_parameter('generate_digital_signature', data),
			function(return_data)
			{
				if(return_data.data)
				{
					$('#Parameter1').attr('value', return_data.data.Parameter1);
					$('#Parameter2').attr('value', return_data.data.Parameter2);
					$('#Parameter3').attr('value', return_data.data.Parameter3);

					$('#signForm').submit();
				}

			},false, btn_start_verify
		);

		
	}
	catch(err)
	{
		$.fn.log_error(arguments.callee.caller,err.message);
	}
};

$.fn.generate_otp_document = function()
{
	try
	{		
			var data	=
			{
				mobile_no	: $('#txt_mobile_no').val(),
				id			: $('#txt_id').val(),
			};
			
			$.fn.write_data
			(
				$.fn.generate_parameter('generate_otp_document', data),
				function(return_data)
				{
					if(return_data.data)
					{
						$.fn.show_right_success_noty('OTP sent to your mobile number successfully');
						$('#btn_start_verify').hide();
						$('.after_otp').show();
					}

				},false, btn_start_verify
			);

		
	}
	catch(err)
	{
		$.fn.log_error(arguments.callee.caller,err.message);
	}
};

$.fn.resend_otp = function()
{
	try
	{		
			var data	=
			{
				mobile_no	: $('#txt_mobile_no').val(),
				id			: $('#txt_id').val(),
			};
			
			$.fn.write_data
			(
				$.fn.generate_parameter('generate_otp_document', data),
				function(return_data)
				{
					if(return_data.data)
					{
						$.fn.show_right_success_noty('OTP resent to your mobile number successfully');
					}

				},false, btn_resend_otp
			);

		
	}
	catch(err)
	{
		$.fn.log_error(arguments.callee.caller,err.message);
	}
};

// $.fn.validate_otp_document = function()
// {
// 	try
// 	{		
// 			var data	=
// 			{
// 				mobile_no	: $('#txt_mobile_no').val(),
// 				id			: $('#txt_id').val(),
// 			};
			
// 			$.fn.write_data
// 			(
// 				$.fn.generate_parameter('validate_otp_document', data),
// 				function(return_data)
// 				{
// 					if(return_data.data)
// 					{
// 						$.fn.show_right_success_noty('OTP verified successfully');
// 						$('#btn_verify_document').removeAttr('disabled');
// 					}
// 					else
// 					{
// 						$.fn.show_right_error_noty('OTP is not valid/expired');
// 					}

// 				},false, btn_validate_otp
// 			);

		
// 	}
// 	catch(err)
// 	{
// 		$.fn.log_error(arguments.callee.caller,err.message);
// 	}
// };

$.fn.verify_document = function()
{
	try
	{		
			if($('#doc_verify_method').val() == 475 && $('#txt_otp').val() == '') //otp
			{
				$.fn.show_right_error_noty('OTP is required to validate the document');
				btn_verify_document.stop();
				return false;
			}

			var data	=
			{
				id		: $('#txt_id').val(),
				otp     : $('#txt_otp').val(),
				doc_no  : $('#txt_doc_no').val()
			};
			
			$.fn.write_data
			(
				$.fn.generate_parameter('verify_document', data),
				function(return_data)
				{
					if(return_data.data)
					{
						$.fn.show_right_success_noty('Document verified successfully');
						setTimeout(function(){ location.reload(); }, 2000);
					}
					else
					{
						$.fn.show_right_error_noty('OTP is not valid/expired');
					}

				},false, btn_verify_document
			);

		
	}
	catch(err)
	{
		$.fn.log_error(arguments.callee.caller,err.message);
	}
};

$.fn.get_user_doc_comments_list = function ()
{
	try
	{
		$.fn.fetch_data (
		    $.fn.generate_parameter('get_user_doc_comments_list', {doc_no : DOC_NO}),
		    function(return_data)
		    {
				console.log(return_data);
		    	if(return_data.data)
				{
		    		$.fn.populate_comments_list(return_data.data);
				}
		    }, false, '', true
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
        // let photo		= 	CURRENT_PATH + '/assets/img/profile_default.jpg';

        // if(row_data.emp_photo)
        // {
        //     photo = SESSIONS_DATA.filepath + 'photos/' + row_data.emp_id  + '/' + row_data.emp_photo;
        // }

        let date = moment(row_data.created_date).format(UI_DATE_FORMAT + " h:ma");

        // row += `<ul class="panel-comments">
        //             <li>
        //                 <img src="${photo}" alt="profile">
        //                 <div class="content">
        //                     <span class="commented"><a href="#">${row_data.name ? row_data.name : row_data.created_by_email}</a> enquired on <a href="#">${date}</a></span>
        //                     ${row_data.descr} <br/><br/>
        //                     <div id="${'comment-'+COMMENT_ID}"></div>
        //                 </div>
        //             </li>
        //         </ul>`;
		
		row = `<div class="d-flex align-items-start mb-3">
				<div style="margin-right:0.75rem" class="avatar-initials small" width="30" height="30" data-name="Sayersilan" ></div>
				<div class="w-100">
					<h5 class="mt-0">
					<a href="contacts-profile.html" class="text-reset">
					${row_data.name ? row_data.name : row_data.created_by_email}
					</a> enquired on <small class="text-muted">${date}</small>
					</h5>
					${row_data.descr}
					<div id="${'comment-'+COMMENT_ID}"></div>
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
		getInitials();

    }
    catch (e)
    {
        $.fn.log_error(arguments.callee.caller, e.message);
    }
}

$.fn.change_switchery = function(obj, checked) 
{	
	if(obj.is(':checked') != checked)
	{
		CODE_TRIGGERED = true;
		obj.parent().find('.switchery').trigger('click');
	}
}

$.fn.initiate_upload_file = function()
{
	$.fn.intialize_fileupload('fileupload_reply','files_reply');

	//update hidden text to perform validation
	$("body").on('DOMSubtreeModified', "#files_candidate", function() 
	{	
		let status = false;
		$("#files_candidate .file-upload").each(function( index ) 
		{
			status = true;
			return false;
		});
		if(status)
			$('#hidden_filename_candidate').val('true');
		else
			$('#hidden_filename_candidate').val('');
	});

	$("body").on('DOMSubtreeModified', "#files_signed", function() 
	{	
		let status = false;
		$("#files_signed .file-upload").each(function( index ) 
		{
			status = true;
			return false;
		});
		if(status)
			$('#hidden_filename_signed').val('true');
		else
			$('#hidden_filename_candidate').val('');
	});
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
    		doc_no	    : DOC_NO,
    		comments    : $('#txt_reply').val().replace(/(?:\r\n|\r|\n)/g,'<br/>'),
			created_by_email : $('#txt_email_id').val(),
			created_by_name : $('#txt_name').val(),
    		emp_id      : $('#txt_emp_id').val(),
        }

        $.fn.write_data
        (
            $.fn.generate_parameter('add_edit_user_doc_comments', data),
            function(return_data)
            {
                if (return_data.data.details)  // NOTE: Success
                {
                	let COMMENT_ID		= return_data.data.details.id;
                	FILE_UPLOAD_PATH = `../files/${MODULE_ACCESS.module_id}/${DOC_NO}/`;
                	let attachment_data =   
                    {
                        id          	: '',
                        primary_id  	: DOC_NO,
                        secondary_id	: COMMENT_ID,
                        module_id   	: MODULE_ID,
                        filename    	: '',
                        filesize    	: "0",
                        json_field  	: {},
                        emp_id      	: $('#txt_emp_id').val()
                    };
                	
					$.fn.populate_comment_row(return_data.data.details);
                	
					if($('#files_reply .file-upload.new').length > 0)
                    {   
                        $.fn.upload_file('files_reply','contract_no',DOC_NO,
                        attachment_data,function(total_files, total_success,filename, attach_return_data)
                        {
                        	if(total_files == total_success)
                            {   
                                $('#txt_reply').val('');
                                btn_comments_reply.stop();
                                $.fn.populate_fileupload(attach_return_data,'comment-'+COMMENT_ID, true);
                            }
                        },false);
                    }
                    else
                    {	
                    	$('#txt_reply')     .val('');
                    	btn_comments_reply.stop();
						// $.fn.populate_comment_row(return_data.data.details);
                    }
                }
            },false
        );
    } 
    catch (e) 
    {
        $.fn.log_error(arguments.callee.caller, e.message);
    }
}

$.fn.toggle_verifiers = function ()
{
    try
    {	
		$('#verifiers_div').slideToggle('fast', function() 
		{
			if ($('#verifiers_div').is(':hidden')) 
			{
				$('#btn_toggle_verifiers').html(`<i class="fa fa-chevron-circle-up"></i>&nbsp; Show Verifiers`);
			} 
			else 
			{
				$('#btn_toggle_verifiers').html(`<i class="fa fa-chevron-circle-down"></i>&nbsp; Hide Verifiers`);
			}
		});	
	} 
    catch (e) 
    {
        $.fn.log_error(arguments.callee.caller, e.message);
    }
}

$.fn.reset_upload_form = function()
{
	$('#files').html('');
	$('#files_signed').html('');
	$('#files_candidate').html('');
};

//avatar
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

//outbound document initial data - accessibility
$.fn.get_document_initial_data = function (data) {
	try {
		// let key = data.key;
		// let id = data.id;

		// if(key == '' || id == '') {
		// 	return false;
		// }

		$.fn.fetch_data(
			$.fn.generate_parameter('get_document_initial_data', data),
			function(return_data) {
				let r_data = return_data.data;
				if(r_data.current_approval == false || r_data.user_document == false) {
					$('#doc_details').hide();
					$('#error_container').show();
					VERIFY_ACCESS = false;
				}else {
					$('#doc_details').show();
					$('#error_container').hide();
					VERIFY_ACCESS = true;

					$.fn.populate_detail_form(r_data);

					
				}
				
			}, true, '', true
		);
		
		
	}catch (e) {
		$.fn.log_error(arguments.callee.caller, e.message);
	}	
}

$.fn.prepare_form = function()
{
	try
	{	
		
		ROUTE_DATA = CURRENT_ROUTE.data;
		SECRET_KEY = ROUTE_DATA.key;
		APPROVAL_ID = ROUTE_DATA.id;
		$.fn.get_document_initial_data(ROUTE_DATA);

		getInitials();
		
		$('.after_otp').hide();
		$.fn.reset_form('comments_form');
    	$.fn.initiate_upload_file();
		// $('#date_of_birth,#marriage_date,#ep_expiry_date').datepicker({dateFormat: 'dd-mm-yy'});

		// $('.populate').select2();

		// $('#wizard').stepy({titleClick: true, block: true, validate: true});

	    //Add Wizard Compability - see docs
	    // $('.stepy-navigator').wrapInner('<div class="pull-right"></div>');

	    //Make Validation Compability - see docs
	    // $('#wizard').validate({
	    //     errorClass: "help-block",
	    //     validClass: "help-block",
	    //     highlight: function(element, errorClass,validClass) {
	    //        $(element).parent('.form-group').addClass("has-error");
	    //     },
	    //     unhighlight: function(element, errorClass,validClass) {
	    //         $(element).parent('.form-group').removeClass("has-error");
	    //     }
	    //  });

	    // $('#wizard-step-0 .stepy-navigator').append($('#acceptOffer').html());

	    // let elems = Array.prototype.slice.call(document.querySelectorAll('.js-switch'));
        // $('.js-switch').each(function() 
        // {
        //     new Switchery($(this)[0], $(this).data());
        // });

        

		let search_params = new URLSearchParams(window.location.search);
		let status = search_params.get('status');
		if (status == 'verified')
		{	
			$.fn.show_right_success_noty('Document Verified Successfully');
		}
	}
	catch(err)
	{
		$.fn.log_error(arguments.callee.caller,err.message);
	}
};

$.fn.bind_command_events = function()
{
	try
	{	
		// $('#chk_status').on('change', function(e) 
		// {
        // 	e.preventDefault(); 
        //     $(this).is(':checked') ? $('#lbl_status').html('ACCEPT') : $('#lbl_status').html('DECLINE');
            
        //     if($(this). prop("checked"))
	    //     {
	    //         $('#commentsContainer').css("opacity", 0);
	    //         $(this).parents('.stepy-navigator').find('.btn_next').show();
	    //         $(this).parents('.stepy-navigator').find('.btn_save_container').hide();
	    //     }
	    //     else
	    //     {
	    //         $('#commentsContainer').css("opacity", 1);
	    //         $(this).parents('.stepy-navigator').find('.btn_next').hide();
	    //         $(this).parents('.stepy-navigator').find('.btn_save_container').show();
	    //     }

    	// });

		// $('#btn_save').click( function(e)
		// {	
		// 	e.preventDefault();
		// 	// alert($(this).parents('form').attr('validateStatus'));
		// 	if($(this).parents('form').attr('validateStatus') == 'true')
		// 	{
		// 		btn_save = Ladda.create(this);
		// 		btn_save.start();
		// 		$.fn.save_edit_form();
		// 	}
			
		// });

		// $('.btn_save_decline').click( function(e)
		// {
		// 	e.preventDefault();
			
		// 	bootbox.confirm
        //     ({
        //         title	: "DECLINE OFFER",
        //         message	: "Are you sure want to decline the offer?",
        //         buttons	:
        //         {
        //             cancel:
        //             {
        //                 label: '<i class="fa fa-times"></i> Cancel'
        //             },
        //             confirm:
        //             {
        //                 label: '<i class="fa fa-check"></i> Confirm'
        //             }
        //         },
        //         callback: function (result)
        //         {
        //             if (result == true)
        //             {
        //             	$.fn.decline_offer();

		// 				$('#wizard').fadeOut();
		// 				$('#wizard-header').fadeOut();
		// 				$('.decline-message').fadeIn();
        //             }
		// 		}
        //     });

				
		// });

		$('#btn_reply').on('click', function(e) 
        {
        	e.preventDefault();
            btn_comments_reply = Ladda.create(this);
        	btn_comments_reply.start();
            $.fn.add_edit_comment_reply();
        });

		$('#btn_start_verify').on('click', function(e) 
        {
        	e.preventDefault();
			btn_start_verify = Ladda.create(this);
        	btn_start_verify.start();

			//check config setting and verify accordingly
			let doc_verify_method = $('#doc_verify_method').val();
			if(doc_verify_method == 474) //digital
			{
				$.fn.generate_digital_signature();
			}
			else if(doc_verify_method == 475) //otp
			{
				$.fn.generate_otp_document();
			}
			else
			{
				$.fn.verify_document();
			}
		});

		$('#btn_resend_otp').on('click', function(e) 
        {
			e.preventDefault();
			btn_resend_otp = Ladda.create(this);
        	btn_resend_otp.start();
			$.fn.resend_otp();
		});	

		$('#btn_verify_document').on('click', function(e) 
        {
        	e.preventDefault();
			btn_verify_document = Ladda.create(this);
        	btn_verify_document.start();
			$.fn.verify_document();
        });

		$('#btn_toggle_verifiers').on('click', function(e) 
        {	
			e.preventDefault();
			$.fn.toggle_verifiers();
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

$(document).ready(function()
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