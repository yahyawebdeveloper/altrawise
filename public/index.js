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


$(document).ready(function () 
{
	try
	{
		let SESSIONS_DATA = $.jStorage.get('session_data');
		
		if(SESSIONS_DATA) {
			//set logo
			$('.logo img').each(function(e) {
				$(this).attr('src', $.jStorage.get('session_data').logo_path);
			});

			//set current user display name
			$('#users_name').html(`${$.jStorage.get('session_data').name} <i class="mdi mdi-chevron-down"></i> `);

			//set profile pic
			$('#profile-pic').attr('src', $.jStorage.get('session_data').profile_pic_path);

			//navigation access
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
			if(users_access == 0 || users_access.view == 0) {
				// $('#hr_li').hide();
				$('#mn_users').hide();
			}

			//CRM
			let stake_holders = $('#mn_stake_holders').attr('href');
			let stake_holders_access = $.fn.get_accessibility($.fn.get_page_name(stake_holders));
			if(stake_holders_access == 0 || stake_holders_access.view == 0) {
				// $('#hr_li').hide();
				$('#crm_li').hide();
			}

			//Operations
			let my_task = $('#mn_mytask').attr('href');
			let my_task_access = $.fn.get_accessibility($.fn.get_page_name(my_task));
			let task_scheduling = $('#mn_task_scheduling').attr('href');
			let task_scheduling_access = $.fn.get_accessibility($.fn.get_page_name(task_scheduling));
			let task_template = $('#mn_task_template').attr('href');
			let task_template_access = $.fn.get_accessibility($.fn.get_page_name(task_template));
			if(my_task_access == 0 || my_task_access.view == 0) {
				$('#mn_mytask').hide();
			} 
			if(task_scheduling_access == 0 || task_scheduling_access.view == 0) {
				$('#mn_task_scheduling').hide();
			}
			if(task_template_access == 0 || task_template_access.view == 0) {
				$('#mn_task_template').hide();
			}
			if((my_task_access == 0 || my_task_access.view == 0) && (task_scheduling_access == 0 || task_scheduling_access.view == 0) && (task_template_access == 0 || task_template_access.view == 0)) {
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
				route_url = "dashboard";
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
			.on("/", () => { //dashboard route
				$.fn.load_form('./modules/dashboard.html');
			}, { before: middleware })
			.on("/signout", () => { //signout route
				$.fn.user_logout();
			})
			.on("/users", () => { //users route
				$.fn.load_form('./modules/users.html');
			}, { before: middleware })
			// .on("/quotation", () => { //quotation route
			// 	$.fn.load_form('./modules/quote.html');
			// })
			.on("/task/my-task", () => { //task route
				$.fn.load_form('./modules/my-task.html');
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
			.on("/documents/outbound-documents", () => { //outbound documents route
				$.fn.load_form('./modules/documents/documents.html');
			}, { before: middleware })
			.on("/documents/document-archiving", () => { //document archiving route
				$.fn.load_form('./modules/documents/document_archiving.html');
			}, { before: middleware })
			.on("/payment-voucher", () => { //payment voucher route
				$.fn.load_form('./modules/payment-voucher.html')
			}, { before: middleware })
			.on("/service-request", () => { //service request route
				$.fn.load_form('./modules/service-request.html')
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
			.notFound(() => { // not found route - display 404 page
				console.log('404');
			})
			.resolve();

		//store router in a global variable
		ROUTE = router;
			
		//store current route in a global variable
		CURRENT_ROUTE = router.current[0];
		
	}
	catch (err)
	{
		// console.log(err);
		$.fn.log_error(arguments.callee.caller, err.message);
	}
});
