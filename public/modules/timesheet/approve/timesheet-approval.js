/**
 * Script for timesheetInfo.php
 * @author: Darus
 */

var CURRENT_PATH = '../../';
var TASK_LIST_PAGE_LIMIT = 10000;
var G_LADDA = [];
var IS_APPROVED = '';

$.fn.data_table_features = function (table_id) {
    try {
        if (!$.fn.dataTable.isDataTable('#' + table_id)) {
            table = $('#' + table_id).DataTable
                ({
                    bAutoWidth: false, 
                    aoColumns : [
                        { sWidth: '15%' },
                        { sWidth: '15%' },
                        { sWidth: '20%' },
                        { sWidth: '10%' },
                        { sWidth: '15%' },
                        { sWidth: '10%' },
                        { sWidth: '15%' }
                    ],
                    "searching": false,
                    "paging": false,
                    "info": false,
                    "order": []
                });
        }
    }
    catch (err) {
        $.fn.log_error(arguments.callee.caller, err.message);
    }
};

$.fn.data_table_destroy = function (table_id) {
    try {
        if ($.fn.dataTable.isDataTable('#' + table_id)) {
            $('#' + table_id).DataTable().destroy();
        }
    }
    catch (err) {
        $.fn.log_error(arguments.callee.caller, err.message);
    }
};

$.fn.get_employee_list = function () {
    try {
        data =
        {
            emp_id: SESSIONS_DATA.emp_id,
            is_sup: true
        }

        if (SESSIONS_DATA.access_level == 59 || SESSIONS_DATA.super_admin == 1) {
            data.is_sup = false;
        }

        $.fn.fetch_data
            (
                $.fn.generate_parameter('get_timesheet_emp', data),
                function (return_data) {
                    if (return_data.code == 0) {
                        $('#dd_employee').empty().append(`<option value=""></option>`);

                        for (let item of return_data.data) {
                            $('#dd_employee').append(`<option value="${item.id}">${item.name}</option>`);
                        }

                        $('#dd_employee').select2({ placeholder: "Please Select" });
                    }
                },
                true
            );
    }
    catch (e) {
        $.fn.log_error(arguments.callee.caller, e.message);
    }
}

$.fn.get_list = function (is_scroll = false, pending_data = false) {
    try {
        $('#div_load_more').show();
        $.fn.show_list_view();

        let datemonth = moment($('#dp_month').val(), 'MMM-YYYY');

        if (pending_data) {
            var data = pending_data;
        }
        else {
            var data =
            {
                start_index: 0,
                limit: LIST_PAGE_LIMIT,
                emp_id: SESSIONS_DATA.emp_id,
                access_level: SESSIONS_DATA.access_level,
                is_admin: SESSIONS_DATA.is_admin,
                year: datemonth.format('YYYY'),
                month: datemonth.format('M'),
                is_approved: IS_APPROVED
            };

            if (is_scroll) {
                data.start_index = RECORD_INDEX;
            }

            data = $.fn.search_filters(data);
        }

        $.fn.fetch_data
            (
                $.fn.generate_parameter('get_timesheetinfo_list', data),
                function (return_data) {
                    $.fn.populate_list(return_data, is_scroll);
                }
            );
    }
    catch (e) {
        $.fn.log_error(arguments.callee.caller, e.message);
    }
}

$.fn.populate_list = function (data, is_scroll) {
    try {
        if (data.code == 0) {
            data = data.data;
            if (is_scroll == false) {
                $('#timesheet_list_view tbody').empty();
                $('#badge_pending_sup').html(data.count.pending_supervisor_approval);
                $('#badge_pending_finance').html(data.count.pending_finance_approval);
                // $('#badge_total').html(data.count.total_count);
            }

            let data_val = '';
            let status = [
                '<i class="fas fa-clock text-warning" aria-hidden="true"></i>',
                '<i class="fas fa-check-square text-success" aria-hidden="true"></i>'
            ];

            if (data.rec_index) {
                RECORD_INDEX = data.rec_index;
            }

            data = data.list;
            for (let i = 0; i < data.length; i++) {
                data_val = data[i];
                let created_date = '';
                if (data_val.created_date) {
                    created_date = moment(data_val.created_date).format('D-MMM-YYYY h:mm A');
                }
                let from_date = moment(data_val.from_date);
                let to_date = moment(data_val.to_date);
                $('#timesheet_list_view tbody').append
                    (`
                     <tr>
                         <td>
                             <span>${data_val.name} - ${data_val.employer_name}</span>
                         </td>
                         <td><span style="white-space: nowrap;">${from_date.format('D-MMM-YY')} --- ${to_date.format('D-MMM-YY')}</span></td>
                         <td>
                             <span>${created_date ? created_date : data_val.created_date}</span>
                         </td>
                         <! -- <td>
                             <span>${data_val.location}</span>
                         </td> -- >
                         <td>
                             <div>
                                 <span class="badge bg-soft-info text-dark p-1">Supervisor ${status[data_val.sup_approved]}</span>
                             </div>
                             <div>
                                 <span class="badge bg-soft-info text-dark p-1">Finance ${status[data_val.finance_accepted]}</span>
                             </div>
                         </td>
                         <td>
                            <a class="btn-view-task btn btn-success btn-xs waves-effect waves-light" data-toggle="tooltip" data-placement="left" title="View Details" href="javascript:void(0)" data-id="${data_val.id}" data-approved="${escape(JSON.stringify(data_val))}"><i class="fas fa-sign-in-alt"></i></a>
                         </td>
                     </tr>
                 `);
            };

            $('.load-more').show();
            $('.btn-view-task').unbind().on('click', function (e) {
                e.preventDefault();

                let item_data = JSON.parse(unescape($(this).data('approved')));

                let data =
                {
                    id: $(this).data('id'),
                    sup_approved: item_data.sup_approved,
                    finance_accepted: item_data.finance_accepted,
                    supervisor_id: item_data.supervisor_id,
                };

                $.fn.show_task_view(data);
            });
        }
        else {
            if (is_scroll == false) {
                $('#badge_pending_sup').html(0);
                $('#badge_pending_finance').html(0);
                $('#badge_total').html(0);
                $('.load-more').hide();
                $('#timesheet_list_view tbody').empty().append
                    (`
                     <tr>
                         <td colspan="5">
                             <div class="list-placeholder">No record found for this month</div>
                         </td>
                     </tr>
                 `);
            }
            else {
                $('.load-more').hide();
                $('#timesheet_list_view tbody').append
                    (`
                     <tr>
                         <td colspan="5">
                             <div class="list-placeholder">No More Records To Be Loaded</div>
                         </td>
                     </tr>
                 `);
            }
        }
    }
    catch (e) {
        $.fn.log_error(arguments.callee.caller, e.message);
    }
}

$.fn.get_task_list = function (id, is_scroll, callback) {
    try {
        var data =
        {
            timesheet_id: id,
            start_index: 0,
            limit: TASK_LIST_PAGE_LIMIT,
            emp_id: SESSIONS_DATA.emp_id
        };

        if (is_scroll) {
            data.start_index = RECORD_INDEX;
        }

        $.fn.fetch_data
            (
                $.fn.generate_parameter('get_timesheet_task_list', data),
                function (return_data) {
                    if (return_data) {
                        if (return_data.data.list) {
                            if (return_data.data.rec_index) {
                                RECORD_INDEX = return_data.data.rec_index;
                            }
                            $.fn.data_table_destroy('list_task');
                            $.fn.populate_task_view(return_data.data);
                            $.fn.data_table_features('list_task');
                        }
                        else {
                            if (!is_scroll) {
                                $('#list_task tbody').empty().append
                                    (`
                                 <tr>
                                     <td colspan="5">
                                         <div class="list-placeholder">The task list is empty!</div>
                                     </td>
                                 </tr>
                             `);
                            }
                        }
                        callback();
                    }
                }, true
            );
    } catch (e) {
        $.fn.log_error(arguments.callee.caller, e.message);
    }
}

$.fn.populate_task_view = function (result, is_scroll = false) {
    try {
        if (!is_scroll) {
            $('#list_task tbody').empty();
        }

        let date_array = [];
        let total_hours = total_amount = 0;
        let data = result.list;
        let hourly_salary = result.salary_details.hourly_salary;
        let currency = result.currency;

        let min_working_days_in_month = result.salary_details.min_working_days_in_month;
        let number_of_days = result.salary_details.number_of_days;
        for (let row of data) {
            let idx = $.inArray(row.task_date, date_array);
            let date_head = false;
            if (idx == -1) {
                date_head = true;
                date_array.push(row.task_date);
            }

            let chargeable_amount = row.is_chargeable == 1 ? (row.hours * hourly_salary).toFixed(2) : 0;
            total_hours += parseInt(row.hours);
            total_amount += parseFloat(chargeable_amount);

            let json_field = $.fn.get_json_string(row.json_field);
            let remarks = json_field.remarks != null ? json_field.remarks : '';
            let location = json_field.location != null ? json_field.location : '';

            $('#list_task tbody').append
                (`
                 <tr data-date="${row.task_date}">
                     <td class="cell-shrink">
                         <span">${date_head ? row.task_date : ''}</span>
                         ${date_head ? '<br>Total Hours : <span class="total-hours"></span>' : ''}
                     </td>
                     <td><span>${row.task_type == 'admin' ? 'Administration Tasks' : row.task_name}</span></td>
                     <td><span>${row.sub_task_name}</span></td>
                     <td><span>${location}</span></td>
                     <td><span>${remarks}</span></td>
                     <td><span class="txt_hours">${row.hours}</span></td>
                     <td><span>${chargeable_amount}</span></td>
                 </tr>
             `);

            let tot_hours = 0;
            $("#list_task tbody tr[data-date='" + row.task_date + "']").each(function (index) {
                tot_hours += parseInt($(this).find('.txt_hours').html());
            });
            $("#list_task tbody tr[data-date='" + row.task_date + "']").first().find('.total-hours').html(tot_hours);
        }

        $('#total_hours').html(total_hours);
        $('#total_amount').html(currency + ' ' + total_amount.toFixed(2));

        if (total_hours < min_working_days_in_month * number_of_days) {
            $('#total_hours').parents('tr').css('background-color', '#f1c40f');
            $('#min_wh_error').html(`This timesheet doesn't meet the requirement, minimum working hours of ${min_working_days_in_month} per day`);
        }
        else {
            $('#total_hours').parents('tr').css('background-color', '');
            $('#min_wh_error').html('');
        }
    }
    catch (e) {
        $.fn.log_error(arguments.callee.caller, e.message);
    }
}

$.fn.show_task_view = function (data) {
    try {
        $('#div_load_more').hide();
        $.fn.get_task_list(data.id, false, function () {
            $('#timesheet_list_view_container').hide(400);
            $('#btn_list_pending_sup').hide(400);
            $('#btn_list_pending_finance').hide(400);
            $('#searchPanel').hide();
            $('#btn_search').hide();
            $('#timesheet_task_view').show(400);
            $('#btn_back_task').show(400);
            $('#btn_approve_timesheet').data('id', data.id);

            if (data.supervisor_id == SESSIONS_DATA.emp_id && data.sup_approved == 0) {
                $('#footer_task').show(400);
                $('#btn_approve_timesheet').removeData('finance');
                $('#btn_approve_timesheet').html('<i class="fa fa-check me-1"></i>Approve');
                $('#btn_disapprove_timesheet').html('<i class="fas fa-times me-1"></i>Disapprove');
            }
            else if (SESSIONS_DATA.is_admin == 1 && data.sup_approved == 1 && data.finance_accepted == 0) {
                $('#footer_task').show(400);
                $('#btn_approve_timesheet').data('finance', true);
                $('#btn_approve_timesheet').html('<i class="fa fa-check me-1"></i>Accept');
                $('#btn_disapprove_timesheet').html('<i class="fas fa-times me-1"></i>Decline');
            }
            else {
                $('#footer_task').hide(400);
            }



        });

    }
    catch (e) {
        $.fn.log_error(arguments.callee.caller, e.message);
    }
}

$.fn.show_list_view = function () {
    try {
        $('#timesheet_list_view_container').show(400);
        $('#btn_list_pending_sup').show(400);
        $('#btn_list_pending_finance').show(400);
        // $('#btn_search').show();
        $('#timesheet_task_view').hide(400);
        $('#footer_task').hide(400);
        $('#btn_back_task').hide(400);
        $('#btn_approve_timesheet').removeData('id');
    } catch (e) {
        $.fn.log_error(arguments.callee.caller, e.message);
    }
}

$.fn.approve_timesheet = function (id) {
    try {

        var data =
        {
            id: id,
            emp_id: SESSIONS_DATA.emp_id
        };

        $.fn.fetch_data
            (
                $.fn.generate_parameter('approve_timesheet', data),
                function (return_data) {
                    if (return_data) {
                        if (return_data.code == 0) {
                            $.fn.show_list_view();
                            $.fn.get_list();
                        }
                    }
                }, true
            );
    }
    catch (e) {
        $.fn.log_error(arguments.callee.caller, e.message);
    }
};

$.fn.reject_timesheet = function (id, by_finance) {
    try {
        var data =
        {
            id: id,
            emp_id: SESSIONS_DATA.emp_id
        };

        if (by_finance) {
            data.rejector = "Finance";
        }
        else {
            data.rejector = "your supervisor"
        }

        $.fn.fetch_data
            (
                $.fn.generate_parameter('reject_timesheet', data),
                function (return_data) {
                    if (return_data) {
                        if (return_data.code == 0) {
                            $.fn.show_list_view();
                            $.fn.get_list();
                        }
                    }
                }, true
            );
    } catch (e) {
        $.fn.log_error(arguments.callee.caller, e.message);
    }
};

$.fn.accept_timesheet = function (id) {
    try {

        var data =
        {
            id: id,
            emp_id: SESSIONS_DATA.emp_id
        };

        $.fn.fetch_data
            (
                $.fn.generate_parameter('accept_timesheet', data),
                function (return_data) {
                    if (return_data) {
                        if (return_data.code == 0) {
                            $.fn.show_list_view();
                            $.fn.get_list();
                        }
                    }
                }, true
            );
    }
    catch (e) {
        $.fn.log_error(arguments.callee.caller, e.message);
    }
}

$.fn.search_filters = function (data) {
    try {
        let chk1 = $('#chk_sup_approved').is(':checked');
        let chk2 = $('#chk_finance_approved').is(':checked')
        // let chk1 = false;
        // let chk2 = true;

        // Check first, just to be safe
        if ($('#dd_employee').val()) {
            data.employee_id = $('#dd_employee').val();
        }


        else if ($('#from_date').val()) {
            data.date_from = $('#from_date').val();
        }
        else if ($('#to_date').val()) {
            data.date_to = $('#to_date').val();
        }
        else if (chk1 == true) {
            data.sup_approved = true;
        }
        else if (chk2 == true) {
            data.fin_approved = true;
        }

        return data;
    }
    catch (e) {
        $.fn.log_error(arguments.callee.caller, e.message);
    }
}

$.fn.reset_filters = function () {
    try {
        $('#dd_employee').val('').change();
        IS_APPROVED = '';
        $('#dp_month').val('');
    } catch (e) {
        $.fn.log_error(arguments.callee.caller, e.message);
    }
}
//------------------------------------------------------------------------------
$.fn.prepare_form = function () {
    try {
        $('#dp_month').flatpickr({
            defaultDate: "today",
            plugins: [
                new monthSelectPlugin({
                    shorthand: true, //defaults to false
                    dateFormat: "F-Y", //defaults to "F Y"
                    altFormat: "F-Y", //defaults to "F Y"
                })
            ]
        });

        $.fn.get_list(false);
        $.fn.get_employee_list();

        $('#form_search_timesheet').parsley(
            {
                classHandler: function (parsleyField) {
                    return parsleyField.$element.closest(".errorContainer");
                },
                errorsContainer: function (parsleyField) {
                    return parsleyField.$element.closest(".errorContainer");
                },
            }
        );

        G_LADDA[0] = Ladda.create(document.querySelector('#btn_search_action'));
    }
    catch (e) {
        $.fn.log_error(arguments.callee.caller, e.message);
    }
};

$.fn.bind_command_events = function () {
    try {
        $("#btn_back_task").on('click', function (e) {
            e.preventDefault();
            $('#div_load_more').show();
            $('#btn_search').show();
            $.fn.show_list_view();
        });

        $('#btn_approve_timesheet').on('click', function (e) {
            e.preventDefault();

            let id = $(this).data('id');
            let fin = $(this).data('finance');

            if (fin) {
                $.fn.accept_timesheet(id);
            }
            else {
                $.fn.approve_timesheet(id);
            }
        });

        $('#btn_disapprove_timesheet').on('click', function (e) {
            e.preventDefault();

            let id = $('#btn_approve_timesheet').data('id');
            let fin = $('#btn_approve_timesheet').data('finance');
            $.fn.reject_timesheet(id, fin);
        });

        $('#btn_load_more').on('click', function (e) {
            e.preventDefault();
            $.fn.get_list(true);
        });

        // $('#btn_search, #btn_list_total').on('click', function(e) 
        // {
        //     e.preventDefault();
        //     IS_APPROVED = '';
        //     var pending_data    =
        //     {
        //         is_approved     : IS_APPROVED,
        //         emp_id          : SESSIONS_DATA.emp_id,
        //         access_level    : SESSIONS_DATA.access_level,
        //     };
        //     $.fn.get_list(false, pending_data);
        // });

        $('#btn_search').click(function () {
            $('#searchPanel').show();
            $('#btn_search').hide();
        });

        $('#btn_close_search').click(function () {
            $('#searchPanel').hide();
            $('#btn_search').show();
        });

        $('#btn_search_action').on('click', function (e) {
            e.preventDefault();
            $.fn.get_list();
        });

        $('#btn_list_pending_finance').on('click', function (e) {
            e.preventDefault();
            IS_APPROVED = 'finance_accepted';
            var pending_data =
            {
                is_approved: IS_APPROVED,
                emp_id: SESSIONS_DATA.emp_id,
                access_level: SESSIONS_DATA.access_level,
                is_admin: SESSIONS_DATA.is_admin,
            };
            $.fn.get_list(false, pending_data);
        });

        $('#btn_list_pending_sup').on('click', function (e) {
            e.preventDefault();
            IS_APPROVED = 'sup_approved';
            var pending_data =
            {
                is_approved: IS_APPROVED,
                emp_id: SESSIONS_DATA.emp_id,
                access_level: SESSIONS_DATA.access_level,
                is_admin: SESSIONS_DATA.is_admin,
            };
            $.fn.get_list(false, pending_data);
        });

        $('#btn_reset').on('click', function (e) {
            e.preventDefault();
            $.fn.reset_filters();
        });

        $('#dd_employee').change(function (e) {
            e.preventDefault();
            $.fn.get_list();
        });
    }
    catch (e) {
        $.fn.log_error(arguments.callee.caller, e.message);
    }
};

$.fn.form_load = function () {
    try {
        //  SESSIONS_DATA = JSON.parse($('#session_data').val());
        $.fn.prepare_form();
        $.fn.bind_command_events();
    }
    catch (e) {
        $.fn.log_error(arguments.callee.caller, e.message);
    }
};

$(document).ready(function () {
    $.fn.form_load();
});
