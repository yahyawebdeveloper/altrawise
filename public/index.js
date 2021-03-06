/**
 * @author Jamal
 * @date 9-Apr-2012
 * @Note = Please do not apply Ctr-Alt-Format for better readable codes
 *         Please follow the indentation
 *         Please follow the naming convention
 */

 var upload_section = '';

 $(window).on('beforeunload', function ()
 {
	 // Temporary disable
	 // $.fn.signout_application();
	 // $.fn.user_logout();	
 });
 
 $('#test').click(function ()
 {
	$('#change_pwd_modal').modal('show');
 });
 var btn_update_pass;
	$.fn.toggle_reveal = function (btn, node_id)
	{
		try 
		{
			var type = $('#' + node_id).attr('type');

			if (type == 'text')
			{
				$('#' + node_id).attr('type', 'password');
				btn.innerText = 'show';
			}
			else if (type == 'password')
			{
				$('#' + node_id).attr('type', 'text');
				btn.innerText = 'hide';
			}
		}
		catch (e) 
		{
			$.fn.log_error(arguments.callee.caller, e.message);
		}
	}
	$.fn.logoff_progress = function () 
	{
		var percent = 0;
		var notice = $.pnotify
			({
				title: "Please wait we complete the progress",
				type: 'info',
				icon: 'fa fa-spin fa-refresh',
				hide: false,
				closer: false,
				sticker: false,
				opacity: 0.75,
				shadow: false,
				width: "300px"
			});
	
		setTimeout(function () 
		{
			notice.pnotify
				({
					title: false
				});
			var interval = setInterval(function () 
			{
				percent += 2;
				var options =
				{
					text: percent + "% complete."
				};
				if (percent == 80) options.title = "Almost There";
				if (percent >= 100) 
				{
					window.clearInterval(interval);
					options.title = "Done!";
					options.type = "success";
					options.hide = true;
					options.closer = true;
					options.sticker = true;
					options.icon = 'fa fa-check';
					options.opacity = 1;
					options.shadow = true;
					options.width = $.pnotify.defaults.width;
					window.location = CURRENT_PATH + "logout.php";
				}
				notice.pnotify(options);
			}, 60);
		}, 1000);
	}
 $(document).ready(function () 
 {
	 try
	 {
		 let SESSIONS_DATA = $.jStorage.get('session_data');
		 
		 if(SESSIONS_DATA) {
			 //set logo
			
			 $('.logo1 img1').each(function(e) {
				 $(this).attr('src', $.jStorage.get('session_data').logo_path);
			 });
 
			 //set current user display name
			 $('#users_name').html(`${$.jStorage.get('session_data').name} <i class="mdi mdi-chevron-down"></i> `);
 
			 //set profile pic
			 $('#profile-pic').attr('src', $.jStorage.get('session_data').profile_pic_path);
 
			 //navigation access
			 //documents
			 let submission = $('#mn_submit').attr('href');
			 let submission_access = $.fn.get_accessibility($.fn.get_page_name(submission));
			 if(submission_access == 0 || submission_access.view == 0) {
				 $('#document_managment_li').hide();
			 }
			 
			 let claim_approval = $('#mn_claim_approval').attr('href');
			 let claim_approval_access = $.fn.get_accessibility($.fn.get_page_name(claim_approval));
			 if(claim_approval_access == 0 || claim_approval_access.view == 0) {
				 $('#document_managment_li').hide();
			 }
			 
			 let reports = $('#mn_reports').attr('href');
			 let reports_access = $.fn.get_accessibility($.fn.get_page_name(reports));
			 if(reports_access == 0 || reports_access.view == 0) {
				 $('#document_managment_li').hide();
			 }
			 
			 //document managment
			 let outbound_documents = $('#mn_outbound_documents').attr('href');
			 let outbound_documents_access = $.fn.get_accessibility($.fn.get_page_name(outbound_documents));
			 if(outbound_documents_access == 0 || outbound_documents_access.view == 0) {
				 $('#document_managment_li').hide();
			 }
 
			 //document archiving
			 let document_archiving = $('#mn_document_archiving').attr('href');
			 let document_archiving_access = $.fn.get_accessibility($.fn.get_page_name(document_archiving));
			 if(document_archiving_access == 0 || document_archiving_access.view == 0) {
				 $('#document_managment_li').hide();
			 }
			 
 
			 
			 //HR
			 let users = $('#mn_users').attr('href');
			 let users_access = $.fn.get_accessibility($.fn.get_page_name(users));
			 let leaves_list = $('#mn_leave_list').attr('href');
			 let leaves_list_access = $.fn.get_accessibility($.fn.get_page_name(leaves_list));
			 let leaves_approval = $('#mn_leave_approval').attr('href');
			 let leaves_approval_access = $.fn.get_accessibility($.fn.get_page_name(leaves_approval));
			 let leaves_report = $('#mn_leave_report').attr('href');
			 let leaves_report_access = $.fn.get_accessibility($.fn.get_page_name(leaves_report));

			 let timesheet = $('#mn_timesheet').attr('href');
			 let timesheet_access = $.fn.get_accessibility($.fn.get_page_name(timesheet));
			 let timesheet_approval = $('#mn_timesheet_approval').attr('href');
			 let timesheet_approval_access = $.fn.get_accessibility($.fn.get_page_name(timesheet_approval));

			 if((timesheet_access == 0 || timesheet_access.view == 0 ) && (timesheet_approval_access == 0 || timesheet_approval_access.view == 0)) {
				$('#timesheet_li').hide();
				// $('#mn_timesheet').hide();
			 }

			 if(timesheet_access == 0 || timesheet_access.view == 0) {
				// $('#timesheet_li').hide();
				$('#mn_timesheet').hide();
			 }

			 if(timesheet_approval_access == 0 || timesheet_approval_access.view == 0) {
				// $('#timesheet_li').hide();
				$('#mn_timesheet_approval').hide();
			 }

			 if(users_access == 0 || users_access.view == 0) {
				 // $('#hr_li').hide();
				 $('#mn_users').hide();
			 }
			
			  if((leaves_list_access == 0 || leaves_list_access.view == 0) && (leaves_approval_access == 0 || leaves_approval_access.view == 0)  && (leaves_report_access == 0 || leaves_report_access.view == 0 )
				&& (users_access == 0 || users_access.view == 0)
				&& (timesheet_access == 0 || timesheet_access.view == 0 ) && (timesheet_approval_access == 0 || timesheet_approval_access.view == 0)) {
				 $('#hr_li').hide();
			 }
 
			 //CRM
			 let stake_holders = $('#mn_stake_holders').attr('href');
			 let stake_holders_access = $.fn.get_accessibility($.fn.get_page_name(stake_holders));
			 if(stake_holders_access == 0 || stake_holders_access.view == 0) {
				 // $('#hr_li').hide();
				 $('#crm_li').hide();
			 }

			 let asset_check = $('#mn_assets').attr('href');
			 let asset_access = $.fn.get_accessibility($.fn.get_page_name(asset_check));
			 
			 if(asset_access == 0 || asset_access.view == 0) {
				 $('#crm_li').hide();
			 }

			 let meeting_list = $('#mn_meeting_list').attr('href');
			 let meeting_list_access = $.fn.get_accessibility($.fn.get_page_name(meeting_list));
			 if(meeting_list_access == 0 || meeting_list_access.view == 0) {
				 $('#crm_li').hide();
			 }

			 let meeting_summary_list = $('#mn_meeting_summary').attr('href');
			 let meeting_summary_access = $.fn.get_accessibility($.fn.get_page_name(meeting_summary_list));
			 if(meeting_summary_access == 0 || meeting_summary_access.view == 0) {
				 $('#crm_li').hide();
			 }
 
			 //Operations
			 let my_task = $('#mn_mytask').attr('href');
			 let my_task_access = $.fn.get_accessibility($.fn.get_page_name(my_task));
			 let task_scheduling = $('#mn_task_scheduling').attr('href');
			 let task_scheduling_access = $.fn.get_accessibility($.fn.get_page_name(task_scheduling));
			 let task_template = $('#mn_task_template').attr('href');
			 let task_template_access = $.fn.get_accessibility($.fn.get_page_name(task_template));
			 let faq_list = $('#mn_faq_list').attr('href');
			 let faq_list_access = $.fn.get_accessibility($.fn.get_page_name(faq_list));
			 let faq_approval = $('#mn_faq_approval').attr('href');
			 let faq_approval_access = $.fn.get_accessibility($.fn.get_page_name(faq_approval));
			 let faq_report = $('#mn_faq_report').attr('href');
			 let faq_report_access = $.fn.get_accessibility($.fn.get_page_name(faq_report));
			 if(my_task_access == 0 || my_task_access.view == 0) {
				 $('#mn_mytask').hide();
			 } 
			 if(task_scheduling_access == 0 || task_scheduling_access.view == 0) {
				 $('#mn_task_scheduling').hide();
			 }
			 if(task_template_access == 0 || task_template_access.view == 0) {
				 $('#mn_task_template').hide();
			 }
			 if((my_task_access == 0 || my_task_access.view == 0) && (task_scheduling_access == 0 || task_scheduling_access.view == 0) && (task_template_access == 0 || task_template_access.view == 0) 
			 && (faq_list_access == 0 || faq_list_access.view == 0) && (faq_approval_access == 0 || faq_approval_access.view == 0)  && (faq_report_access == 0 || faq_report_access.view == 0)) {
				 $('#operation_li').hide();
			 }
 
			 //Utilities
			 let configuration = $('#mn_configuration').attr('href');
			 let configuration_access = $.fn.get_accessibility($.fn.get_page_name(configuration));
			 if(configuration_access == 0 || configuration_access.view == 0) {
				 $('#utilities_li').hide();
			 }
 
			 //Payment Voucher
			 let paymentVoucher = $('#mn_payment_voucher').attr('href');
			 let payment_voucher_access = $.fn.get_accessibility($.fn.get_page_name(paymentVoucher));
			 if(payment_voucher_access == 0 || payment_voucher_access.view == 0) {
				 $('#payment_voucher_li').hide();
			 }

			 //service request
			let serviceRequest = $('#mn_service_request').attr('href');
			let service_request_access = $.fn.get_accessibility($.fn.get_page_name(serviceRequest));
			if(service_request_access == 0 || service_request_access.view == 0) {
				$('#operation_li').hide();
			}

			 //onBoarding
			 let onBoarding = $('#mn_onboarding').attr('href');
			 let onboarding_access = $.fn.get_accessibility($.fn.get_page_name(onBoarding));
			 if(onboarding_access == 0 || onboarding_access.view == 0) {
				 $('#operation_li').hide();
			 }
			 
			//admindashboard
			if(SESSIONS_DATA.is_admin==0)
			{
				$('#admin_dash_li').hide();
				$('#admin_user_dash_li').hide();
			}
			if(SESSIONS_DATA.is_admin==1)
			{
				$('#user_dash_li').hide();
			}
		 }
		 
 
		 // Initial Navigo
		 var root = '/altrawise/public/';
		 var useHash = true; // Defaults to: false
		 var hash = '#!'; // Defaults to: '#'
		 var router = new Navigo(root, false);
 
		 router.hooks({
			 before(done) {
				 $('#sidebar-menu .menuitem-active').removeClass('menuitem-active');
				 $('#sidebar-menu .collapse').removeClass('show');
				 done();
			 },
			 after(match) {
				 let el = $(`[href="${match.url}"]`);
				 let p_li = el.parent().closest('li');
 
				 //add active class to parent li
				 p_li.addClass('menuitem-active');
				 if(p_li.parents('div.collapse').length > 0) {
					 p_li.parents('div.collapse').addClass('show');
				 }
			 },
			 already: function() {
				 window.location.reload();
			 }
		 });
 
		 const middleware = (done, match) => {
			 let route_url = match.url;
			
			 //if root index - dashboard
			
			 if(route_url == "") { //for dashboard module - default route url is empty
				/*if(SESSIONS_DATA.is_admin==1)
				{route_url = "dashboard/admin";}
				else
				{route_url = "dashboard/user";}*/
				route_url = "profile";
			 }
			
			 //get module access based on route url
			 let module_access = $.fn.get_accessibility($.fn.get_page_name(route_url));
			 
			 MODULE_ACCESS = module_access;
			
			 //if user can't view redirect to login page
			 if (module_access == 0 || module_access.view == 0) {
				 done(false);
				 
				window.location.href = root + 'login.html';
			 }
			 
			 done(true); //if have access - proceed
			
		 };
 
		 const namedMiddleware = (done, match) => {
			 let route_name = match.route.name;
			 
			 //get module access based on route url
			 let module_access = $.fn.get_accessibility($.fn.get_page_name(route_name));
			 MODULE_ACCESS = module_access;
	
			 //if user can't view redirect to login page
			 if (module_access == 0 || module_access.view == 0) {
				 done(false);
				 window.location.href = root + 'login.html';
			 }
			 
			 done(true); //if have access - proceed
		 };
		
		
		 router
		
			/*.on("/", () => { 
				if(SESSIONS_DATA.is_admin==1){
				$.fn.load_form('./modules/dashboard/admin_dash.html');
				}else
				{$.fn.load_form('./modules/dashboard/user_dash.html');}
			}, { before: middleware })*/

			.on("/dashboard/admin", () => { //admin dashboard route
				$.fn.load_form('./modules/dashboard/admin_dash.html');
			}, { before: middleware })
			.on("/dashboard/user", () => { //user dashboard route
				$.fn.load_form('./modules/dashboard/user_dash.html');
			}, { before: middleware })
			.on("/", () => { //user dashboard route
				$.fn.load_form('./modules/profile/profile.html');
			}, { before: middleware })
		    
			 .on("/signout", () => { //signout route
				 $.fn.user_logout();
			 })
			 .on("/users", () => { //users route
				 $.fn.load_form('./modules/users.html');
			 }, { before: middleware })
			  .on("/users/users-history-report", () => { //users-history route
				 $.fn.load_form('./modules/users/users-history-report.html');
			 }, { before: middleware })
			 .on("/users/users-track", () => { //users-history route
				 $.fn.load_form('./modules/users/users-track.html');
			 }, { before: middleware })
			 .on({
				"/users/users-track/:user_id/:date" : {
					as: "users/users-track",
					uses: () => {
						$.fn.load_form('./modules/users/users-track.html');
					},
					hooks : {
						before : namedMiddleware
					}
				}
			})
			 // .on("/quotation", () => { //quotation route
			 // 	$.fn.load_form('./modules/quote.html');
			 // })
			 .on("/task/my-task", () => { //task route
				 $.fn.load_form('./modules/my-task.html');
			 }, { before: middleware })
			  .on("/comm/my-communications", () => { //my-communications route
				 $.fn.load_form('./modules/comm/my-communications.html');
			 }, { before: middleware })
			  .on("/attendance/list", () => { //attendance route
				 $.fn.load_form('./modules/attendance/list.html');
			 }, { before: middleware })
			  .on("/attendance/reports", () => { //attendance route
				 $.fn.load_form('./modules/attendance/reports.html');
			 }, { before: middleware })
			  .on("/attendance/tracker", () => { //attendance route
				 $.fn.load_form('./modules/attendance/tracker.html');
			 }, { before: middleware })
			 .on("/attendance/summary", () => { //attendance route
				 $.fn.load_form('./modules/attendance/summary.html');
			 }, { before: middleware })
			 .on("/comm/report", () => { //my-communications->Report route
				 $.fn.load_form('./modules/comm/report.html');
			 }, { before: middleware })
			 .on("/task/scheduling", () => { //scheduling route
				 $.fn.load_form('./modules/task_admin.html');
			 }, { before: middleware })
			 .on("/task/template", () => { //template route
				 $.fn.load_form('./modules/task_template.html');
			 }, { before: middleware })
			 .on("/settings/configuration", () => { //configuration route
				 $.fn.load_form('./modules/configuration.html')
			 }, { before: middleware })
			 .on("/stake-holders", () => { //CRM route
				 $.fn.load_form('./modules/crm-stack-holders-listing.html')
			 }, { before: middleware })
			  .on("/stake-holders-register", () => { //CRM Register route
				 $.fn.load_form('./modules/CRM/register.html')
			 }, { before: middleware })
			 .on("/documents/outbound-documents", () => { //outbound documents route
				 $.fn.load_form('./modules/documents/documents.html');
			 }, { before: middleware })
			 .on("/documents/document-archiving", () => { //document archiving route
				 $.fn.load_form('./modules/documents/document_archiving.html');
			 }, { before: middleware })
			 .on("/claims/submissions", () => { //submissions route
				 $.fn.load_form('./modules/claims/submissions.html');
			 }, { before: middleware })
			 .on("/claims/documents-approval", () => { //documents approval route
				 $.fn.load_form('./modules/claims/documents_approval.html');
			 }, { before: middleware })
			 .on("/claims/document-reports", () => { //document reports route
				 $.fn.load_form('./modules/claims/document_reports.html');
			 }, { before: middleware })
			 .on("/payment-voucher", () => { //payment voucher route
				 $.fn.load_form('./modules/payment-voucher.html')
			 }, { before: middleware })
			 .on("/assets/asset", () => { //assets route
				$.fn.load_form('./modules/assets/asset.html')
			}, { before: middleware })
			.on("/meetings", () => { //meeting route
				$.fn.load_form('./modules/meetings/meetings.html')
			}, { before: middleware })
			.on("/meetings/summary", () => { //meeting route
				$.fn.load_form('./modules/meetings/meeting_client_summary.html')
			}, { before: middleware })
			.on("/service-request", () => { //service request route
				$.fn.load_form('./modules/service-request.html')
			}, { before: middleware })
			.on("/contract", () => {
				$.fn.load_form('./modules/contract.html')
			}, { before: middleware })
			 .on("faqs", () => { //faq route
				 $.fn.load_form('./modules/faq/faq_list.html')
			 }, { before: middleware })
			 .on("/faqs/approval", () => { //faq route
				 $.fn.load_form('./modules/faq/faq_approval.html')
			 }, { before: middleware })
			 .on("/faqs/report", () => { //faq route
				 $.fn.load_form('./modules/faq/faq_report.html')
			 }, { before: middleware })
			 .on("leaves", () => { //faq route
				 $.fn.load_form('./modules/leave/leave.html')
			 }, { before: middleware })
			 .on("/leaves/approval", () => { //faq route
				 $.fn.load_form('./modules/leave/leave_info.html')
			 }, { before: middleware })
			 .on("/leave/report", () => { //faq route
				 $.fn.load_form('./modules/leave/leave_report.html')
			 }, { before: middleware })
			 .on({
				 "/documents/outbound-documents/:action/:id" : {
					 as: "documents/outbound-documents",
					 uses: () => {
						 $.fn.load_form('./modules/documents/documents.html');
					 },
					 hooks : {
						 before : namedMiddleware
					 }
				 }
			 })
			 .on({
				 "/documents/outbound-documents/:id" : {
					 as: "documents/outbound-documents",
					 uses: () => {
						 $.fn.load_form('./modules/documents/documents.html');
					 },
					 hooks : {
						 before : namedMiddleware
					 }
				 }
			 })
			 .on("/user/document/:key/:id", ({data}) => { //user document verification
				 //hide dom elements
				 $('.navbar-custom').hide();
				 $('.left-side-menu').hide();
				 $('.footer').hide();
				 $.fn.load_form('./user/document.html');
			 })
			 .on("/timesheet", () => { //timesheet
					$.fn.load_form('./modules/timesheet/list/timesheet.html')
			 }, { before: middleware })
			 .on("/timesheet/approval", () => { //timesheet approval
				$.fn.load_form('./modules/timesheet/approve/timesheet-approval.html')
		 }, { before: middleware })
			 .notFound(() => { // not found route - display 404 page
				 console.log('404');
			 })
			 .resolve();
 
		 //store router in a global variable
		 ROUTE = router;
			 
		 //store current route in a global variable
		 CURRENT_ROUTE = router.current[0];
	    
		 /** FOOTER CHANGE PASSWORD  */
		 
		 $.fn.password_check('txt_new_pwd');

        $('#change_pwd_form').parsley
            ({
                successClass: 'has-success',
                errorClass: 'has-error',
                errors:
                {
                    classHandler: function (ele)
                    {
                        return $(ele).closest('.form-group');
                    },
                    errorsWrapper: '<ul class=\"help-block list-unstyled\"></ul>',
                    errorElem: '<li></li>'
                }
            });

        $('#change_pwd_modal').on('show.bs.modal', function (e)
        {
            var button = $(e.relatedTarget);
            var initial_pswd = button.data('initial');

            $('#btn_update_pwd').data('initial', initial_pswd);

            if (initial_pswd == true)
            {
                $('#btn_cancel_pwd_change').hide();
            }
            else if (initial_pswd == false)
            {
                $('#btn_cancel_pwd_change').show();
            }
        });

        $('#btn_update_pwd').on('click', function (e)
        {
            e.preventDefault();
            btn_update_pass = Ladda.create(this);
            btn_update_pass.start();
            if ($('#change_pwd_form').parsley('validate') == false)
            {
                btn_update_pass.stop();
                return;
            }
            else
            {
                var initial_pswd = $(this).data('initial');
                var old_pwd = $('#txt_current_pwd').val();
                var new_pwd = $('#txt_new_pwd').val();
                var confirm_pwd = $('#txt_confirm_pwd').val();

                var data =
                {
                    emp_id: SESSIONS_DATA.emp_id,
                    old_pwd: old_pwd,
                    new_pwd: new_pwd,
                    email: SESSIONS_DATA.office_email,
                    chat_user_id: SESSIONS_DATA.chat_user_id
                }

                if (confirm_pwd !== new_pwd)
                {
                    // TODO: Throw error password not Matched
                    $.pnotify
                        ({
                            title: 'Error',
                            type: 'error',
                            text: `Password not matched`
                        });
                }
                else
                {
                    (
                        $.fn.fetch_data
                            (
                                $.fn.generate_parameter('change_password', data),
                                function (return_data)
                                {
                                    $('#div_response').empty();
                                    if (return_data.code == 1)
                                    {
                                        console.error("[ERROR] Failed to change password", return_data);
                                    }
                                    else
                                    {
                                        let class_name = "alert alert-dismissable alert-success";
                                        let title = "<strong>Well done!</strong> Portal password successfully updated.";

                                        if (return_data.data.portal != 1)
                                        {
                                            class_name = "alert alert-dismissable alert-danger";
                                            title = "<strong>Oh snap!</strong> Updating Portal password Failed, contact Administrator."
                                        }
                                        $('#div_response').append
                                            (`<div class="${class_name}">${title}
                    			<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
                    		</div>`);


                                        class_name = "alert alert-dismissable alert-success";
                                        title = "<strong>Well done!</strong> Email password successfully updated.";
                                        if (return_data.data.email != 1)
                                        {
                                            class_name = "alert alert-dismissable alert-danger";
                                            title = "<strong>Oh snap!</strong> Updating Email password Failed, contact Administrator."
                                        }
                                        $('#div_response').append
                                            (`<div class="${class_name}">${title}
                    			<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
                    		</div>`);


                                        class_name = "alert alert-dismissable alert-success";
                                        title = "<strong>Well done!</strong> Chat password successfully updated";
                                        if (return_data.data.chat != 1)
                                        {
                                            class_name = "alert alert-dismissable alert-danger";
                                            title = "<strong>Oh snap!</strong> Updating Chat password Failed, contact Administrator."
                                        }
                                        $('#div_response').append
                                            (`<div class="${class_name}">${title}
                    			<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
                    		</div>`);



                                        $('#div_footer').hide();
                                        $.fn.logoff_progress();
                                    }
                                }, false, btn_update_pass
                            )
                    )
                }
            }
        });

        if (SESSIONS_DATA.initial_pswd == 1)
        {
            $('#change_pwd_modal').modal
                ({
                    backdrop: 'static',
                    keyboard: false
                });

            $('#btn_cancel_pwd_change').hide();
        } 
	 }
	 catch (err)
	 {
		 // console.log(err);
		 $.fn.log_error(arguments.callee.caller, err.message);
	 }
 });
 
