if (!window.location.origin)
	window.location.origin = window.location.protocol + '//' + window.location.host;

var directory_path = "/altrawise/";
var controller_URL = '../services/services.php';
var services_URL = window.location.origin + `${directory_path}services/services.php`;
var upload_file_path = window.location.origin + `${directory_path}services/upload_fu/endpoint.php`;
var redirect_mainpage = window.location.origin + `${directory_path}public/index.html`;
var CURRENT_PATH = './';
var loading_image = "<img src='" + CURRENT_PATH + "assets/js/custom/busy.gif'/>";
var BLOCKUI_CSS = { border: 'none', padding: '15px', backgroundColor: '#000', '-webkit-border-radius': '10px', '-moz-border-radius': '10px', opacity: .5, color: '#fff' };
var TOKEN = '';
var SESSIONS_DATA = '';
var MODULE_ACCESS = '';
var LIST_PAGE_LIMIT = 10;
var TRANS_TIME = 400;
var file_uploader = '';
var CURRENT_PAGE = '';
var FILE_UPLOAD_PATH= '';
var SERVER_DATE_FORMAT = 'YYYY-MM-D';
var UPLOADED_SCHEDULED_DATA = '';
var TASK_ID = '';
var CURRENT_ROUTE = '';
var ROUTE = '';

$.fn.fetch_data_for_table_v2 = function (param, call_back, is_scroll, table_id, show_block_ui, btn_ladda, call_type, silent_mode)
{
	try
	{
		var sync_type = true;

		if (call_type == false)
			sync_type = call_type;
		
		silent_mode = !!silent_mode;
		
		$.ajax
			({
				type: "POST",
				dataType: 'json',
				contentType: 'application/json',
				url: services_URL,
				data: param,
				async: sync_type,
				success: function (data)
				{
					
					if ($.fn.is_success(data.code) == false)
					{
						
						if (silent_mode == false)
						{
							$.fn.handle_return_error_msg(data);
						}
						$('#' + table_id + ' #table_list-loader').remove();
						if (!is_scroll)
						{
							$('#div_load_more').hide();
							$('#' + table_id + ' > tbody').empty();
							let no_record = '<tr><td colspan="' + $("#" + table_id).find('tr')[0].cells.length + '"><div class="list-placeholder" style="text-align:center;">No Records Found</div></td></tr>';
							$('#' + table_id + ' tbody').append(no_record);
						}
						else if (is_scroll)
						{

							$('#div_load_more').hide();
							let no_record = '<tr><td colspan="' + $("#" + table_id).find('tr')[0].cells.length + '"><div class="list-placeholder" style="text-align:center;">No More Records To Be Loaded</div></td></tr>';
							$('#' + table_id + ' tbody').append(no_record);
							//                            console.log(no_record);
						}
					}
					else if(data.data)
					{
						
						if ( data.data.list !== undefined && data.data.list.length !== 0)
						{
							if ($.isFunction($.fn.data_table_destroy)) $.fn.data_table_destroy();
							$('#' + table_id + ' #table_list-loader').remove();
							call_back(data.data, is_scroll);
							if ($.isFunction($.fn.data_table_features)) $.fn.data_table_features();

						}
						else
						{
							call_back(data.data);
							if (!is_scroll)
							{
								$('#div_load_more').hide();
								$('#' + table_id + '  tbody').empty();
								let no_record = '<tr><td colspan="' + $("#" + table_id).find('tr')[0].cells.length + '"><div class="list-placeholder" style="text-align:center;">No Records Found</div></td></tr>';
								$('#' + table_id + ' tbody').append(no_record);
							}
							else if (is_scroll)
							{
								
								$('#div_load_more').hide();
								$('#' + table_id + ' #table_list-loader').remove();
								let no_record = `<a class='list-group-item appt_item'><div class='row' style="text-align:center"><strong>No More Records To Be Loaded</strong></div></a>`;
								$('#' + table_id).after(no_record);
								//	                            console.log('here');
							}
						}
					}
				},
				error: function ()
				{
					Ladda.stopAll();
					$.unblockUI();
					alert('Resource is not available. Please try again later. One or more of the services on which we depend is unavailable. Please try again later after the service has had a chance to recover.');
				},
				beforeSend: function ()
				{
					if (show_block_ui == true)
					{
						$.blockUI({ message: "<div class='circle'/><div class='circle1'/>  Just a moment...", css: BLOCKUI_CSS });
					}
					let progress = '<tr id="table_list-loader"><td colspan="' + $("#" + table_id).find('tr')[0].cells.length + '"><div class="list-loader"><div class="spinner"></div><span>Fetching Data...</span></div></td></tr>';
					$('#' + table_id + ' > tbody').append(progress);

				},
				complete: function ()
				{
					if (btn_ladda)
						btn_ladda.stop();

					$.unblockUI();
				}
			});
	}
	catch (err)
	{
		// console.log(err.message);
		$.fn.log_error(arguments.callee.caller, err.message);
	}
};

$.fn.populate_upload_schedule = function (data)
{
    try 
    {
		
    	$('#tbl_upload_body').empty();
		if (data.length > 0) // check if there is any data, precaution
		{
			let row			= '';
			let start_date	= '';
			let expiry_date = '';
			let status_icon	= '';
			for(var i = 0; i < data.length; i++)
			{
				start_date 	= moment(data[i].start_date, 'YYYY-MM-DD H:i').format('D-MMM-YYYY H:mm A');
				status_icon	= '<i class="fa fa-check-circle text-warning"></i>';
				
				if(data[i].expiry_date != "NULL" && data[i].expiry_date != null)
				{
					expiry_date = moment(data[i].expiry_date, 'YYYY-MM-DD H:i').format('D-MMM-YYYY H:mm A');
				}
				else
				{
					expiry_date = '';
				}
				
				if(data[i].status == false)
				{
					status_icon = '<i class="fa fa-times-circle text-danger"></i>';
				}
				if(data[i].result == true)
				{
					status_icon = '<i class="fa fa-check-circle text-success"></i>';
				}
				
				row += `<tr class="timesheet" data-value='${escape(JSON.stringify(data[i]))}'>
			                <td>${status_icon}</td>
			                <td>${data[i].title}</td>
			                <td>${data[i].company_name}</td>
			                <td>${data[i].task_type_name}</td>
			                <td>${data[i].schedule_type}</td>
			                <td>${data[i].priority_name}</td>
			                <td><span style="white-space: nowrap;">${start_date}</span></td>
			                <td><span style="white-space: nowrap;">${expiry_date}</span></td>             
			            </tr>`;
			}
			$('#tbl_upload_body').append(row);
		}
    	$('#upload_modal').modal('show');
    } 
    catch (e) 
    {
        $.fn.log_error(arguments.callee.caller, e.message);
    }
}

$.fn.fetch_data_for_list = function (param, call_back, is_scroll, list_id, show_block_ui, btn_ladda, call_type, silent_mode)
{
	try
	{
		var sync_type = true;

		if (call_type == false)
			sync_type = call_type;

		silent_mode = !!silent_mode;

		$.ajax
			({
				type: "POST",
				dataType: 'json',
				contentType: 'application/json',
				url: services_URL,
				data: param,
				async: sync_type,
				success: function (data)
				{
					if ($.fn.is_success(data.code) == false)
					{
						if (silent_mode == false)
						{
							$.fn.handle_return_error_msg(data);
						}
						$('#' + list_id + ' .list-loader').remove();
						if (!is_scroll)
						{
							$('#div_load_more').hide();
							$('#' + list_id).empty();
							$('#' + list_id).append(`<a class='list-group-item appt_item'><div class='row style="text-align:center"><strong>No Records Found</strong></div></a>`);
						}
						else if (is_scroll)
						{
							$('#div_load_more').hide();
							$('#' + list_id).append(`<a class='list-group-item appt_item'><div class='row' style="text-align:center"><strong>No More Records To Be Loaded</strong></div></a>`);
						}
					}
					else
					{
						if (data.data.list.length !== 0)
						{
							$('#' + list_id + ' .list-loader').parent().remove();
							call_back(data.data, is_scroll, 1);
							if ($.isFunction($.fn.data_table_features)) $.fn.data_table_features();
						}
						else
						{
							if (!is_scroll)
							{
								$('#div_load_more').hide();
								$('#' + list_id).empty();
								$('#' + list_id).append(`<a class='list-group-item appt_item'><div class='row' style="text-align:center"><strong>No Records Found</strong></div></a>`);
							}
							else if (is_scroll)
							{

								$('#div_load_more').hide();
								$('#' + list_id + ' .list-loader').parent().remove();
								$('#' + list_id).append(`<a class='list-group-item appt_item'><div class='row' style="text-align:center"><strong>No More Records To Be Loaded</strong></div></a>`);
							}
						}
					}
				},
				error: function ()
				{
					Ladda.stopAll();
					$.unblockUI();
					
					$('#' + list_id + ' > .list-group-item').eq(0).append(`Resource is not available. Please try again later. One or more of the services on which we depend is unavailable. Please try again later after the service has had a chance to recover.`);
					$('#' + list_id + ' .list-loader').remove();
				},
				beforeSend: function ()
				{
					if (show_block_ui == true)
					{
						$.blockUI({ message: "<div class='circle'/><div class='circle1'/>  Just a moment...", css: BLOCKUI_CSS });
					}
					$('#' + list_id).append(`<div class="list-group-item"><div class="list-loader"><div class="spinner"></div><span>Fetching Data...</span></div></div>`);

				},
				complete: function ()
				{
					if (btn_ladda)
						btn_ladda.stop();

					$.unblockUI();
				}
			});
	}
	catch (err)
	{
		$.fn.log_error(arguments.callee.caller, err.message);
	}
};

$.fn.populate_fileupload = function (data, file_container, clear = false)
{
	try
	{
		
		if (data)
		{
			if (data.attachment)
			{
				if (clear)
				{
					$('#' + file_container).empty();
				}
				for (let i = 0; i < data.attachment.length; i++)
				{
					let btn_delete = `<a href class="delete" data-value="${encodeURIComponent(data.attachment[i].deleteFileParams)}">
	        							<i class="mdi mdi-delete customized" aria-hidden="true" title="Delete file"></i>
	            					  </a>`;

					// IF not owner
					if (SESSIONS_DATA.emp_id != Number(data.attachment[i].created_by))
					{
						btn_delete = '';
					}
					$('#' + file_container).append
						(
							$('<div class="list-group-item alert alert-light" style="float:left;margin-bottom:0;"></div>')
								.addClass('file-upload')
								.append(`<div class="col-sm-12">
	                                <a href class="link-view-file" data-id="${data.attachment[i].uuid}">${data.attachment[i].name}</a>${btn_delete}</div>`)
						);
				}

				$('.file-upload .delete').unbind().on('click', function (event)
				{
					event.preventDefault();

					var this_file = $(this);
					var data_val = JSON.parse(decodeURIComponent($(this).attr('data-value')));
					bootbox.confirm
						({
							title: "Delete Confirmation",
							message: "Are you sure to delete this attachment?.",
							buttons:
							{
								cancel:
								{
									label: '<i class="fa fa-times"></i> Cancel'
								},
								confirm:
								{
									label: '<i class="fa fa-check"></i> Yes'
								}
							},
							callback: function (result)
							{
								if (result == true)
								{
									$.fn.delete_fileupload(data_val, function ()
									{
										this_file.parents('.file-upload').remove();
									});
								}
							}
						});

				});

				$('.link-view-file').unbind().on('click', function (event)
				{
					event.preventDefault();
					$.fn.open_page($(this).data('id'), window.location.origin + `${directory_path}public/download.php`);
				});
			}
		}
	}
	catch (err)
	{
		// console.log(err.message);
		$.fn.log_error(arguments.callee.caller,err.message);
	}
};

$.fn.open_page = function (id, page, open_type = "_blank")
{
	try 
	{
		if (id != '' && page != '')
		{
			window.open(page + "?id=" + id + "&method=details", open_type);
		}
	}
	catch (e)
	{
		$.fn.log_error(arguments.callee.caller, e.message);
	}
}

$.fn.delete_fileupload = function (param, callback)
{
	try
	{
		let data =
		{
			id: param.id,
			// primary_id: param.primary_id,
			emp_id: SESSIONS_DATA.emp_id,
			// filename: param.filename,
			// module_id: param.module_id
		}

		$.fn.write_data(
			$.fn.generate_parameter('delete_files', data),
			function (return_data)
			{
				if (return_data.code == 0)
				{
					callback();
				}
			}, true
		);
	}
	catch (e)
	{
		$.fn.log_error(arguments.callee.caller, e.message);
	}
}

$.fn.generate_parameter = function (method, data, additional_param)
{
	try
	{
		var param =
		{
			token: $.jStorage.get('token'),
			method: method,
			data: data,
			module_id: MODULE_ACCESS.module_id,
			ajax: true
		};

		if (additional_param)
		{
			var jsonStrAr = JSON.stringify(additional_param).replace('{', '').replace('}', '').split('","');
			for (var v = 0; v < jsonStrAr.length; v++)
			{
				var m = jsonStrAr[v].split(':');
				param[m[0].replace(/"/g, '')] = m[1].replace(/"/g, '');
			}
		}

		return JSON.stringify(param);
	}
	catch (err)
	{
		$.fn.log_error(arguments.callee.caller, err.message);
	}
};

$.fn.show_noty = function (title, text, type, hide)
{
	$.pnotify
		({
			title: title,
			text: text,
			type: type,
			hide: hide
		});
};

$.fn.show_right_success_noty = function (text)
{
	$.toast(
	{   
		heading : "SUCCESS",
		text    : text,
		position: "top-right",
		loaderBg: "#43a8bf",
		icon    : "success",
		bgColor : "#4fc6e1"

	});
};

$.fn.show_right_error_noty = function (text)
{
	$.toast(
	{   
		heading : "Opsss",
		text    : text,
		position: "top-right",
		loaderBg: "#c14456",
		icon    : "danger",
		bgColor : "#ee5f5b"

	});
};

// Start All shared ajax calls
$.fn.handle_return_error_msg = function (data)
{
	try
	{
		var error_msg = 'ERROR RECEIVED NULL';
		if (data.msg != null)
			error_msg = data.msg;
		else if (data.msg)
			error_msg = data.msg;

		$.fn.show_right_error_noty(error_msg);
	}
	catch (err)
	{
		$.fn.log_error(arguments.callee.caller, err.message);
	}
};

$.fn.fetch_data = function (param, call_back, show_block_ui, btn_ladda, call_type)
{
	try
	{
		var sync_type = true;

		if (call_type == false)
			sync_type = call_type;

		$.ajax
			({
				type: "POST",
				dataType: 'json',
				contentType: 'application/json',
				url: services_URL,
				data: param,
				async: sync_type,
				success: function (data)
				{
					if ($.fn.is_success(data.code) == false)
					{
						$.fn.handle_return_error_msg(data);
					}
					call_back(data);
				},
				error: function (edata)
				{
					Ladda.stopAll();
					$.unblockUI();
					// console.log(edata);
					alert('Resource is not available. Please try again later. One or more of the services on which we depend is unavailable. Please try again later after the service has had a chance to recover.');
				},
				beforeSend: function ()
				{
					if (show_block_ui == true)
					{
						$.blockUI({ message: "<div class='circle'></div><div class='circle1'></div>Just a moment...", css: BLOCKUI_CSS });
					}
				},
				complete: function ()
				{
					if (btn_ladda)
						btn_ladda.stop();

					$.unblockUI();
				}
			});
	}
	catch (err)
	{
		$.fn.log_error(arguments.callee.caller, err.message);
	}
};

$.fn.write_data = function (param, call_back, show_block_ui, btn_ladda, call_type)
{
	try
	{
		var sync_type = true;

		if (call_type == false)
			sync_type = call_type;

		$.ajax
			({
				type: "POST",
				dataType: 'json',
				contentType: 'application/json',
				url: services_URL,
				data: param,
				async: sync_type,
				success: function (data)
				{
					if ($.fn.is_success(data.code) == false)
					{
						$.fn.handle_return_error_msg(data);
						call_back(data);
					}
					else
						call_back(data);
				},
				error: function ()
				{
					Ladda.stopAll();
					$.unblockUI();
					alert('Resource is not available. Please try again later. One or more of the services on which we depend is unavailable. Please try again later after the service has had a chance to recover.');
				},
				beforeSend: function ()
				{
					if (show_block_ui == true)
					{
						$.blockUI({ message: "<div class='circle'/><div class='circle1'/>   Just a moment...", css: BLOCKUI_CSS });
					}
				},
				complete: function ()
				{
					if(btn_ladda) {
						btn_ladda.stop();
					}

					$.unblockUI();
				}
			});
	}
	catch (err)
	{
		$.fn.log_error(arguments.callee.caller, err.message);
	}
};
// End All shared ajax calls

// START Shared function
$.fn.log_error = function (routine_name, error_msg)
{
	Ladda.stopAll();
	$.unblockUI();
	alert('Error Occur at : ' + routine_name + ' with error msg : ' + error_msg, $.jStorage.get('app_name'));
	// console.log(error_msg,'Error Occur at : ' + routine_name + ' with error msg : ' + error_msg, $.jStorage.get('app_name'));
};

$.fn.is_success = function (code)
{
	if (code == '0')
		return true;
	else
		return false;

};
// END Shared function

$.fn.get_json_string = function (data) 
{
	try 
	{
		var json_data = false;
		json_data = JSON.parse(data);
		if (json_data == null)
		{
			return false;
		}
	}
	catch (e) 
	{
		return false;
	}
	return json_data;
};

// not used for now, can be removed
$.fn.start_activity_loader = function ()
{
	if ($('body').find('#resultLoading').attr('id') != 'resultLoading')
	{
		$('body').append('<div id="resultLoading" style="display:none"><div><img src="ajax-loader.gif"><div>' + loading_text + '</div></div><div class="bg"></div></div>');
	}

	$('#resultLoading').css
		({
			'width': '100%',
			'height': '100%',
			'position': 'fixed',
			'z-index': '10000000',
			'top': '0',
			'left': '0',
			'right': '0',
			'bottom': '0',
			'margin': 'auto'
		});

	$('#resultLoading .bg').css
		({
			'background': '#000000',
			'opacity': '0.7',
			'width': '100%',
			'height': '100%',
			'position': 'absolute',
			'top': '0'
		});

	$('#resultLoading>div:first').css
		({
			'width': '250px',
			'height': '75px',
			'text-align': 'center',
			'position': 'fixed',
			'top': '0',
			'left': '0',
			'right': '0',
			'bottom': '0',
			'margin': 'auto',
			'font-size': '16px',
			'z-index': '10',
			'color': '#ffffff'

		});

	$('#resultLoading .bg').height('100%');
	$('#resultLoading').fadeIn(300);

	$('body').css('cursor', 'wait');
};

$.fn.start_activity_loader = function ()
{
	$('#resultLoading .bg').height('100%');
	$('#resultLoading').fadeOut(300);
	$('body').css('cursor', 'default');
};

$.fn.set_accessibility = function ()
{
	try
	{
		// var local_access = $.jStorage.get('access');
		// for (var i=0;i < local_access.length;i++)
		// {		
		// switch (local_access[i].caMainModule)
		// {
		// case 'NSW':
		// local_access[i].caSubMenuLvl1;		
		// break;							
		// }			
		// }			
	}
	catch (err)
	{
		$.fn.log_error(arguments.callee.caller, err.message);
	}
};

//START of file upload
$.fn.intialize_upload = function (ext, itemLimit, sizeLimit, add_param, get_file_param)
{
	try
	{	
		let validation = {};
		let param = {
			element: document.getElementById("fine-uploader_quotation"),
			template: 'qq-template-manual-trigger',
			request: {
				endpoint: upload_file_path
			},
			thumbnails: {
				placeholders: {
					waitingPath: './assets/js/custom/fineuploader/placeholders/waiting-generic.png',
					notAvailablePath: './assets/js/custom/fineuploader/placeholders/not_available-generic.png'
				}
			},
			deleteFile: {
				enabled: true,
				forceConfirm: true,
				endpoint: upload_file_path,
			},
			autoUpload: false,
			debug: false,
			callbacks: {
				onSubmit: function (id, fileName)
				{
					// Extend the default parameters for all files
					// with the parameters for _this_ file.
					// qq.extend is part of a myriad of Fine Uploader
					// utility functions and cross-browser shims
					// found in client/js/util.js in the source.
					let p = JSON.parse($.fn.generate_parameter('add_files'));
					let data =
					{
						url: services_URL,
						primary_id: add_param.p_id,
						secondary_id: add_param.s_id,
						module_id: add_param.mod_id,
						emp_id: $.jStorage.get('session_data').emp_id
					};
					qq.extend(p, data);
					this.setParams(p);
				},
				onSubmitDelete: function (id)
				{
					this.setDeleteFileParams(
						{
							filename: this.getName(id),
							token: $.jStorage.get('token'),
							method: "delete_files",
							emp_id: $.jStorage.get('session_data').emp_id,
							url: services_URL
						}, id);
				},
				onSessionRequestComplete: function (id, name, responseJSON)
				{
					id.forEach((item, index) =>
					{
						var serverPathToFile = item.thumbnailUrl,
							$fileItem = this.getItemByFileId(index);
						if (responseJSON.status == 200)
						{
							$($fileItem).find(".qq-download-option") /** Custom Anchor tag added to Template **/
								.attr("href", serverPathToFile)
								.removeClass("qq-hide");
						}
					});
				},
				onComplete: function (id, name, responseJSON, xhr)
				{
					var serverPathToFile = responseJSON.url,
						$fileItem = this.getItemByFileId(id);
					if (responseJSON.success)
					{
						$($fileItem).find(".qq-download-option") /** Custom Anchor tag added to Template **/
							.attr("href", serverPathToFile)
							.removeClass("qq-hide");
					}
				}
			}

		};

		if (get_file_param)
		{
			let t = $.fn.generate_parameter("get_files", get_file_param);
			param.session = {};
			param.session.endpoint = `${upload_file_path}?param=` + encodeURIComponent(t);
		}
		if (ext)
		{
			validation.allowedExtensions = ext;
		}
		if (itemLimit)
		{
			validation.itemLimit = itemLimit;
		}
		if (sizeLimit)
		{
			validation.sizeLimit = sizeLimit;
		}
		if (validation != '')
		{
			param.validation = validation;
		}

		file_uploader = new qq.FineUploader(param);
	}
	catch (err)
	{
		$.fn.log_error(arguments.callee.caller, err.message);
	}
};

//END of file upload

//is current user is admin
$.fn.is_admin = function() {
	let SESSIONS_DATA = $.jStorage.get('session_data');
	if(SESSIONS_DATA.is_admin) {
		return 1;
	}
	return 0;
}

//is current user is super admin
$.fn.is_super_admin = function() {
	let SESSIONS_DATA = $.jStorage.get('session_data');
	if(SESSIONS_DATA.super_admin) {
		return 1;
	}
	return 0;
}


$.fn.isUndefined = function (x) 
{
	return x == null && x !== null;
};

$.fn.is_session_active = function ()
{
	if ($.jStorage.get('token') == null)
		window.location.href = 'login.html';
};

$.fn.clear_active_session = function ()
{
	$.removeData(document.body, "scheme");
	$.jStorage.flush();
};

$.fn.user_logout = function ()
{
	$.fn.clear_active_session();
	$.fn.is_session_active();
};

$.fn.load_form = function (url)
{
	try
	{	
		$('#content_div').load
			(
				url +'?rndm=' + Math.round(+new Date() / 1000),{},		
				function (responseText, statusText, xhr)
				{	
					if (statusText == 'success')
					{
						$(this).hide().fadeIn('slow');
						$('#main_container_div').show();
					}
				}
			);

		let urlJS = url.replace('.html', '.js');

		$.getScript(urlJS);
	}
	catch (err)
	{
		$.fn.log_error(arguments.callee.caller, err.message);
	}
};

$.fn.set_language = function (lang)
{
	try
	{
		$.i18n.properties
			({
				name: 'ApplicationMessages',
				path: '../public/language/',
				mode: 'map',
				language: lang,
				callback: function () 
				{
					$('body *:not(script, style, noscript)').each(function () 
					{
						var id = $(this).attr('id');
						var rn = $(this).attr('rn');

						if (id)
						{
							if (rn)
							{

								if (id.substring(0, 2) == 'CP') 		//special cases for the collapsible panel			    							    			
									$('#' + id + '_title').text($.i18n.prop(rn));
								else
									$('#' + id).text($.i18n.prop(rn));
							}
						}
					});
				}
			});
		// $.fn.re_label_table_header();
	}
	catch (err)
	{
		$.fn.log_error(arguments.callee.caller, err.message);
	}
};

$.fn.imposeMaxLength = function (obj, MaxLen)
{
	MaxLen--;
	if (obj.value.length > MaxLen)
	{
		obj.value = obj.value.substring(0, MaxLen);
		// alert( 'Textarea value can only be 255 characters in length.' );
		return false;
	}
	else
	{
		// countfield.value = maxlimit - field.value.length;
	}
};

$.fn.limit_text = function (field, maxlen) 
{
	if (field.value.length > maxlen)
	{
		while (field.value.length > maxlen)
		{
			field.value = field.value.replace(/.$/, '');
		}
		$.fn.show_noty($.i18n.prop('msg_word_count_exceeded'));
	}
};

$.fn.disable_keys = function (param)
{
	if (param == 'decimalOnly')
	{
		$('.decimalOnly').keypress(function (event) 
		{

			if (event.keyCode == 8 || event.keyCode == 37 || event.keyCode == 39 || event.keyCode == 46
				// || event.which == 8 || event.which == 37   || event.which == 39   || event.which == 46
			)
				return true;
			else if ((event.which != 46 || $(this).val().indexOf('.') != -1) && (event.which < 48 || event.which > 57))
				event.preventDefault();
		});
	}
	if (param == 'quote')
	{
		$('.no_quote').keypress(function (event) 
		{
			if (event.which == 34 || event.which == 39 || event.keyCode == 34 || event.keyCode == 39)
				event.preventDefault();
		});
	}
	if (param == 'backspaceOnly')
	{
		$('.backspaceOnly').keypress(function (event) 
		{
			if (event.which === 8)
				return true;
			else
				event.preventDefault();
		});
	}

	if (param == 'inv_special_character')
	{
		$('.inv_special_character').keypress(function (event) 
		{
			if (event.which == 96 || event.which == 126 || event.which == 94)
				event.preventDefault();
		});
	}

};

$.fn.populate_dd = function (obj_id, data, empty_it = true, is_search = false, select_or_all = true)
{
	try
	{	
		if (empty_it)
		{
			$('#' + obj_id).empty();
		}
		if (select_or_all)
		{
			if (is_search)
			{
				$('#' + obj_id).append(`<option value="">All</option>`);
			}
			else
			{
				$('#' + obj_id).append(`<option value="">Select</option>`);
			}
		}

		if (data)
		{
			for (let item of data)
			{
				$('#' + obj_id).append(`<option value="${item.id}" data-value="">${item.descr}</option>`);
			}

		}
		$('#' + obj_id).val('').change();
	}
	catch (err)
	{
		// console.log(err.message);
		$.fn.log_error(arguments.callee.caller, err.message);
	}
};

$.fn.get_encrypt_password = function (password, salt, pbkdf2_rounds, rnd)
{

	var pwmd5 = calcMD5(salt + $.trim(password));

	if (pbkdf2_rounds > 0)
	{
		pwmd5 = sjcl.codec.hex.fromBits(sjcl.misc.pbkdf2(sjcl.codec.hex.toBits(pwmd5), salt, pbkdf2_rounds));
	}

	return calcMD5(rnd + pwmd5);

}

$.fn.get_accessibility = function (module_id)
{
	
	SESSIONS_DATA = $.jStorage.get('session_data');
	
	if(SESSIONS_DATA) {
		let access = SESSIONS_DATA.access;

		for (i = 0; i < access.length; i++)
		{
			if (parseInt(access[i].module_id) == parseInt(module_id))
			{
				return access[i];
			}
		}
	}

	if (module_id == -1)
	{
		return -1;
	}
	return 0;
};

$.fn.get_page_name = function (route_name) {
	// let page = window.location.pathname.split("/").pop();
	// let module = window.location.pathname.split("/").slice(-2)[0].trim();

	// console.log(window.location.pathname);
	// console.log(module);
	// console.log(page);

	// TimeMe.initialize({
	// 	currentPageName: page, // current page
	// 	idleTimeoutInSeconds: 30 // seconds
	// });
	// CURRENT_PAGE = page;

	switch (route_name.toLowerCase())
	{
		
		//documents module
		case 'documents_module':
			return 1;
			break;
		case 'claims/submissions':
			return 111;
			break;
		case 'claims/documents-approval':
			return 112;
			break;
		case 'claims/document-reports':
			return 113;
			break;	
		
		case 'documents/outbound-documents':
			return 114;
			break;	
		
		case 'documents/document-archiving':
			return 115;
			break;
		
		//control panel or settings or utilities module
		case 'settings_module':
		case 'controlpanel':
			return 2;
			break;
		case 'controlpanel/email':
			return 21;
			break;
		case 'settings/configuration':
			return 22;
			break;

		//tasks module
		case 'task_module':
			return 3;
			break;
		case 'task/my-task':
			return 31;
			break;
		case 'task/scheduling':
			return 32;
			break;
		case 'task/template':
			return 33;
			break;
		case 'task/dashboard':
			return 34;
			break;
		case 'task/report':
			return 35;
			break;
		case 'task/new':
			return 36;
			break;
		
		//communication module
		case 'communications_module':
			return 4;
			break;
		case 'comm/my-communications':
			return 41;
			break;
		case 'comm/report':
			return 42;
			break;
		
		//chat module
		case 'chat':
			return 5;
			break;

		//service request module
		case "service-request":
			return 6;
			break;

		//faq module
		case 'faqs_module':
			return 7;
			break;
		case 'faqs':
			return 71;
			break;
		case 'faqs/approval':
			return 72;
			break;
		case 'faqs/report':
			return 73;
			break;
		
		//users module
		case 'employees_module':
		case 'users_module':
			return 8;
			break;
		case 'users':
			return 81;
			break;
		case 'users/users-history-report':
			return 82;
			break;
		case 'users/users-track':
			return 83;
			break;

		//contract module	
		case 'contract':
			return 9;
			break;

		//attendance module
		case 'attendance_module':
			return 10;
			break;
		case 'attendance/list':
			return 101;
			break;
		case 'attendance/reports':
			return 102;
			break;
		case 'attendance/tracker':
			return 103;
			break;
		case 'attendance/summary':
			return 104;
			break;

		//job module
		case 'job':
			return 11;
			break;

		//timesheet module
		case 'timesheet_module':
			return 12;
			break;
		case 'timesheet':
			return 121;
			break;
		case 'timesheet/approval':
			return 122;
			break;

		//leave module
		case 'leaves_module':
			return 13;
			break;
		case 'leaves':
			return 131;
			break;
		case 'leaves/approval':
			return 132;
			break;
		case 'leave/report':
			return 133;
			break;
		

		//notification module
		case 'notifications_module':
			return 14;
			break;
		case 'notification/list':
			return 141;
			break;
		case 'notification/report':
			return 142;
			break;

		//stake holders module
		case 'stake_holders_module':
			return 15;
			break;
		case 'stake-holders/register':
			return 151;
			break;
		case 'stake-holders':
			return 152;
			break;

		//assets module
		case "assets":
			return 16;
			break;

		//meetings module
		case 'meetings_module':
			return 17;
			break;
		case 'meetings':
			return 171;
			break;
		case 'meetings/summary':
			return 172;
			break;
		
		//payment voucher module
		case "payment-voucher":
			return 18;
			break;

		//dashboard module
		case 'dashboard':
			return 19;
			break;
		case 'dashboard/admin':
			return 191;
			break;
		case 'dashboard/user':
			return 192;
			break;

		//profile
		case 'profile':
		case 'help':
			return -1;
		default:
			return 0;
	}
};

$(document).ready(function () 
{
	try
	{

		$.fn.set_language('en');
		// $.fn.is_session_active();
		$.fn.set_accessibility();
		// $.set_file_upload_properties();

	}
	catch (err)
	{
		// console.log(err.message);
		$.fn.log_error(arguments.callee.caller, err.message);
	}
});

//START of file upload
$.fn.intialize_fileupload = function (file_obj, files_container, file_name_func)
{
	try
	{
		
		$('#'+files_container).html('');
		
		$('#'+file_obj).fileupload({
			url: upload_file_path,
			dataType: 'json',
			autoUpload: false,
			acceptFileTypes: /(\.|\/)(pdf)$/i,
			maxFileSize: undefined,
			disableImageResize: /Android(?!.*Chrome)|Opera/.test(window.navigator.userAgent),
			previewMaxWidth: 80,
			previewMaxHeight: 80,
			previewCrop: true,
			filesContainer: '#' + files_container
		});
		
		$('#'+file_obj).bind('fileuploadsubmit', function (event, data) {
			
			let filename = '';
			if ($.isFunction(file_name_func))
			{
				filename = file_name_func(data.files[0].name);
			}
			else
			{
				filename = data.files[0].name;
			}
			
			let p = JSON.parse($.fn.generate_parameter('add_files'));

			data.formData =
			{
				...p, //concat add files fields with the below fields
				upload_path: FILE_UPLOAD_PATH,
				file_name: filename,
				url: services_URL, 
				overwrite: true,
				qquuid: '',
				id: '',
				primary_id: '',
				secondary_id: '',
				module_id : MODULE_ACCESS.module_id,
				emp_id : $.jStorage.get('session_data').emp_id //current user id
			}
		});

		$('#'+file_obj).bind('fileuploadadd', function(e, data) {
			let scheduleUploadCheck = data.fileInput[0].id;
			if( scheduleUploadCheck == 'fileupload_schedule'){
				bootbox.confirm("Are you sure to upload this file " + data.files[0].name, function(result) 
				{
					if(result == true)
					{
						if (data.submit)
						{
							data.submit();
							let doc_data =
							{
								filename 	: data.files[0].name.trim(),
								emp_id   	: SESSIONS_DATA.emp_id
							}

							$.fn.write_data
							(
								$.fn.generate_parameter('get_schedule_upload', doc_data),
								function(return_data)
								{
									if(return_data.data)
									{
										// console.log(return_data);
										UPLOADED_SCHEDULED_DATA = return_data.data;
										$.fn.populate_upload_schedule(return_data.data);
										$('#btn_add_upload_batch').show();
									}
								}, true
							);
						}
					}
				});
			}
			else if( scheduleUploadCheck == 'fileupload_ph'){
				bootbox.confirm("Are you sure to upload this file " + data.files[0].name, function(result) 
				{
					if(result == true)
					{
						if (data.submit)
						{
							data.submit();
							let doc_data =
							{
								filename 	: data.files[0].name.trim(),
								emp_id   	: SESSIONS_DATA.emp_id
							}

							$.fn.write_data
							(
								$.fn.generate_parameter('get_public_holiday_upload', doc_data),
								function(return_data)
								{
									if(return_data.data)
									{
										
										$('#btn_add_upload_batch').show();
	                                	UPLOADED_PH_DATA = return_data.data;
	                                	$.fn.populate_uploaded_holiday(return_data.data);
									}
								}, true
							);
						}
					}
				});
			}
			var $files = $('#'+ files_container);
			$.each(data.files, function (index, file)
			{
				var reader = new FileReader();
				reader.onload = function (e)
				{
					$('#'+file_obj).attr('src', e.target.result);
				};
				reader.readAsDataURL(file);
				$files.data(data);
			});
		});

	}
	catch (err)
	{
		$.fn.log_error(arguments.callee.caller, err.message);
	}
};

$.fn.upload_file = function (file_container, field, field_val, attachment_data, call_back, return_if_filename_differ = false, progress_btn = false)
{
	try
	{
		let total_files = $('#' + file_container + ' .file-upload.new').length;
		let total_completed = 0;
		let total_succeed = 0;
		let failed_file = [];
		let attachment = [];

		//        if(field_val)
		//        {
		//        	$('#' + file_container).data(field,field_val);
		//        }

		//        let attachment_data =   
		//        {
		//            id          	: '',
		//            primary_id  	: field_val,
		//            secondary_id	: '',
		//            module_id   	: MODULE_ACCESS.module_id,
		//            filename    	: '',
		//            filesize    	: "0",
		//            json_field  	: {},
		//            emp_id      	: SESSIONS_DATA.emp_id
		//        }
		//        ATTACH_SERVICE_DATA = $.fn.generate_parameter('add_attachment', attachment_data,{service_url : encodeURIComponent('http://localhost/code/Projects/mspdoc/services/services.php')});


		$('#' + file_container + ' .file-upload.new').each(function (index)
		{
			let data = $(this).data('data');
			let fn = $(this)[0].innerText.trim();

			// console.log(data);
			// console.log(data.submit);
			// console.log(data.submit().status);

			if (data.submit)
			{
				data.submit();
				// console.log(data);
				// let sub = data.submit();
				// let response = data.response();

				// if(response.textStatus == "success") {
				// 	total_succeed++;
				// 	total_completed++;
				// }else {
				// 	failed_file.push(data.files[0].name);
				// }
				
				// console.log($.fn.generate_parameter('add_files', attachment_data));
				// console.log($.fn.generate_parameter('add_files', data));
				if(attachment_data) {
					attachment_data.filename = data.files[0].name.trim();
					attachment_data.filesize = data.files[0].size;
					$.fn.write_data(
						$.fn.generate_parameter('add_files', attachment_data), 
						function(return_data) {
							if(return_data.code == 0) {
								total_succeed++;
								total_completed++;
								if(return_data.data) {
									attachment.push(return_data.data[0]);
								}
								
							}
							let attachment_data_f = [];
                        	attachment_data_f.attachment = attachment;
							if (typeof call_back === "function") {
								if (progress_btn) { progress_btn.stop(); }
								call_back(total_files, total_succeed, data.files[0].name.trim(), attachment_data_f);
								return;
							}
						}, false, false, true
					);
				}
				
				
				// data.submit().success(function (result, textStatus)
				// {
				// 	total_succeed++;
				// 	if (return_if_filename_differ)
				// 	{
				// 		if (fn.trim() != result.files[0].name.trim())
				// 		{
				// 			if (attachment_data)
				// 			{
				// 				attachment_data.filename = result.files[0].name.trim();
				// 				$.fn.write_data
				// 					(
				// 						$.fn.generate_parameter('add_attachment', attachment_data),
				// 						function (return_data)
				// 						{
				// 							if ($.isFunction(call_back))
				// 							{
				// 								if (progress_btn) { progress_btn.stop(); }
				// 								call_back(total_files, total_succeed, result.files[0].name.trim(), return_data.data);
				// 								return;
				// 							}
				// 						}
				// 					), false, false, true;
				// 			}
				// 			// if ($.isFunction(call_back))
				// 			// {
				// 			// 	if (progress_btn) { progress_btn.stop(); }
				// 			// 	call_back(total_files, total_succeed, result.files[0].name.trim(), []);
				// 			// }
				// 		}
				// 	}
				// 	else
				// 	{
				// 		if (attachment_data)
				// 		{
				// 			attachment_data.filename = result.files[0].name.trim();
				// 			$.fn.write_data
				// 				(
				// 					$.fn.generate_parameter('add_attachment', attachment_data),
				// 					function (return_data)
				// 					{
				// 						if ($.isFunction(call_back))
				// 						{
				// 							if (progress_btn) { progress_btn.stop(); }
				// 							call_back(total_files, total_succeed, result.files[0].name.trim(), return_data.data);
				// 						}
				// 						return;
				// 					}
				// 				), false, false, true;
				// 		}
				// 		// if ($.isFunction(call_back))
				// 		// {
				// 		// 	if (progress_btn) { progress_btn.stop(); }
				// 		// 	call_back(total_files, total_succeed, result.files[0].name.trim(), []);
				// 		// }
				// 	}
				// })
				// 	.complete(function (result, textStatus)
				// 	{
				// 		total_completed = 1;
				// 	})
				// 	.error(function (result, textStatus)
				// 	{
				// 		failed_file.push(result.files[0].name);
				// 	});
			}
		});

		if (total_completed == total_files && total_succeed != total_files) {
			let msg = "Failed to upload some file ...";
			console.error("Upload Error - ", msg);
		}else if (total_completed == total_files && total_succeed == 0) {
			let msg = "Failed to upload all file";
			console.error("Upload Error - ", msg);
		}
	}
	catch (e)
	{
		// console.log(e.message);
		$.fn.log_error(arguments.callee.caller, e.message);
	}
};
