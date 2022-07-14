/**
* @author  : Sancheev
* @version : 2.7
*
* @update_by    : Darus
* @updated_date : 9 Jan 2018
* @version      : 2.8
*/
var G_LADDA = [];
CURRENT_PATH = '../../';
var TASKS_ARRAY = [];
var HOLIDAYS = [];

$.fn.get_holidays_list = function ()
{
    try
    {
        var date = new Date();
        var data =
        {
            company_id: SESSIONS_DATA.company_id,
            year: date.getFullYear()
        };

        $.fn.fetch_data
            (
                $.fn.generate_parameter('get_holidays_list', data),
                function (return_data)
                {
                    var holiday_data = return_data.data;
                    if (holiday_data)
                    {
                        for (let holiday of holiday_data)
                        {
                            HOLIDAYS.push(holiday.holiday);
                        }
                    }
                }, true
            );
    }
    catch (err)
    {
        $.fn.log_error(arguments.callee.caller, err.message);
    }
};

$.fn.data_table_features = function ()
{
    try
    {
        table = $('#tbl_timesheet_list').DataTable({	
            bAutoWidth: false, 
            // aoColumns : [
            //     { sWidth: '12%' },
            //     { sWidth: '10%' },
            //     { sWidth: '15%' },
            //     { sWidth: '15%' },
            //     { sWidth: '10%' },
            //     { sWidth: '10%' },
            //     { sWidth: '12%' }
            // ],
            "searching": false,
            "paging": false,
            "info": false,
            "ordering": false,
            // "targets": 'no-sort',
            // "bSort": false,
            "order": [],
        });
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
        $('#tbl_timesheet_list').DataTable().destroy();
    }
    catch (err)
    {
        $.fn.log_error(arguments.callee.caller, err.message);
    }
};

$.fn.get_list = function (is_scroll) {
    try {
        var data =
        {
            start_index: is_scroll ? RECORD_INDEX : 0,
            limit: LIST_PAGE_LIMIT,
            emp_id: SESSIONS_DATA.emp_id,
            get_by_id: true
        };

        $.fn.fetch_data(
            $.fn.generate_parameter('get_timesheet_list', data),
            function(return_data) {
                if (return_data.data.list) {
                    var len = return_data.data.list.length;
                    if (return_data.data.rec_index)
                    {
                        RECORD_INDEX = return_data.data.rec_index;
                    }
                    if (return_data.code == 0 && len != 0)
                    {
                        $.fn.data_table_destroy();
                        $.fn.populate_list_form(return_data.data, is_scroll);
                        $.fn.data_table_features();
                        $('#btn_load_more').show();
                    }
                    else if (return_data.code == 1 || len == 0)
                    {
                        if (!is_scroll)
                        {
                            $('#btn_load_more').hide();
                            $.fn.data_table_destroy();
                            $('#tbl_timesheet_list tbody').empty().append
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
        );
    }
    catch (err) {
        $.fn.log_error(arguments.callee.caller, err.message);
    }
};

$.fn.populate_list_form = function (data, is_scroll) {
    try {
        let tbody = $("#tbl_timesheet_list tbody");
        let status = [
            '<span class="badge bg-soft-info text-info status p-1">Open</span>',           // 0
            '<span class="badge bg-soft-warning text-warning status p-1">Submitted</span>',   // 1
            '<span class="badge bg-soft-danger text-danger status p-1">Rejected</span>',      // 2
            '<span class="badge bg-soft-success text-success status p-1">Supervisor Approved</span>',  // 3
            '<span class="badge bg-soft-success text-success status p-1">Finance Approved</span>'  // 4
        ];

        let approval_status = [
            '<i class="fas fa-clock text-warning" aria-hidden="true"></i>',
            '<i class="fas fa-check-square text-success" aria-hidden="true"></i>'
        ];

        if (data.length !== 0) {
            if (!is_scroll) tbody.empty();

            if (data.rec_index) {
                RECORD_INDEX = data.rec_index;
            }

            data = data.list;
            for (let [idx, row] of data.entries()) {
                let from_date = moment(row.from_date);
                let to_date = moment(row.to_date);

                tbody.append(
                        `<tr class="timesheet" data-id="${row.id}" data-obj="${escape(JSON.stringify(row))}" data-mode="${Number(row.submit_status) !== 0 ? 1 : 2}">
                        <td class="name-col">${row.name}</td>
                        <td><span style="white-space: nowrap;">${from_date.format('D-MMM-YY')} --- ${to_date.format('D-MMM-YY')}</span></td>
                        <td>
                            ${status[row.submit_status]}
                            <div>
                                <span class="badge bg-soft-light text-dark p-1">Supervisor ${approval_status[row.sup_approved]}</span>
                            </div>
                            <div>
                                <span class="badge bg-soft-light text-dark p-1">Finance ${approval_status[row.finance_accepted]}</span>
                            </div>
                        </td>
                        <td class="action-col">
                            <div ${Number(row.submit_status) !== 0 ? 'style="display: none;"' : ''} class="button-group">
                                <button type="button" class="btn btn-xs btn-info waves-effect waves-light submit" data-id="${row.id}">
                                    <span class="btn-label"><i class="fas fa-paper-plane"></i></span>Submit
                                </button>
                                <button type="button" class="btn btn-xs btn-danger waves-effect waves-light delete" data-id="${row.id}">
                                    <span class="btn-label"><i class="fas fa-trash-alt"></i></span>Delete
                                </button>
                            </div>
                            <div ${Number(row.submit_status) === 0 ? 'style="display: none;"' : ''} class="button-group">
                                <button type="button" class="btn btn-xs btn-info waves-effect waves-light download" data-id="${row.id}">
                                    <span class="btn-label"><i class="fas fa-download"></i></span>Download
                                </button>
                            </div>
                        </td>
                    </tr>`
                );
            }

            /**
             * Bind click event to each row after all of them is rendered
             * @method
             * @param  {Event} event Click event
             */
            $('.timesheet').unbind().on('click', function (event) {
                event.preventDefault();
                $('.save-info span').html('');
                let obj = JSON.parse(unescape($(this).data('obj')));
                let mode = Number($(this).data('mode'));
                let id = $(this).data('id');

                $.fn.get_task_list(id, mode, obj);
            });

            $('button.submit').on('click', function (event) {
                event.preventDefault();
                event.stopPropagation();

                let timesheet_id = $(this).data('id');
                $.fn.submit_timesheet(timesheet_id);
            });

            $('button.delete').on('click', function (event) {
                event.preventDefault();
                event.stopPropagation();

                let timesheet_id = $(this).data('id');
                $.fn.delete_timesheet(timesheet_id);
            });

            $('button.download').on('click', function (event) {
                event.preventDefault();
                event.stopPropagation();

                let timesheet_id = $(this).data('id');
                window.open( appConfig.SERVER_URL + `services/modules/excel_format.php?module=timesheet&id=742`, '_blank');
            });

            $('.load-more').show();

        }
        else if (data.length == 0 && !is_scroll) {
            tbody.empty().append
                (
                    `<tr>
                    <td colspan="4">
                        <div class="list-placeholder">No records found!</div>
                    </td>
                </tr>`
                );
        }
        else if (data.length == 0) {
            tbody.append
                (
                    `<tr>
                    <td colspan="4">
                        <div class="list-placeholder">No More Records To Be Loaded</div>
                    </td>
                </tr>`
                );
        }

    }
    catch (e) {
        console.error("[DEBUG] | ", e.message);
        $.fn.log_error(arguments.callee.caller, e.message);
    }
}

$.fn.get_task_list = function (id, mode, obj)
{
    try
    {
        let data =
        {
            timesheet_id: id,
            emp_id: SESSIONS_DATA.emp_id,
            get_list: false
        };
        $.fn.fetch_data
            (
                $.fn.generate_parameter('get_timesheet_task_list', data),
                function (return_data)
                {
                    if (return_data)
                    {
                        if (mode == 2)
                        {
                            $("#btn_save_task").show(200);
                            $("#btn_save_task").data('timesheetid', data.timesheet_id);
                            $("#btn_save_task").data('data', obj);
                        }
                        $('#label_name').html(obj.name);
                        $('#label_month_year').html(`${obj.month} ${obj.year}`);
                        $('#label_location').html(obj.location);
                        $.fn.populate_task_list_detail(mode, return_data.data, obj.from_date, obj.to_date);
                    }
                }, false, '', false, true
            );
    }
    catch (err)
    {
        $.fn.log_error(arguments.callee.caller, err.message);
    }
};

/**
 * Function to populate the timesheet details - contain the logics to populate.
 * @method
 * @param  {Number} [mode=1]    Mode of viewing. 1 = View (After submit), 2 = Edit(Before submit). Defaulted to 1.
 * @param  {Array}  tasks       Array of tasks
 * @param  {String} from_date   from_date of a timesheet
 * @param  {String} to_date     to_date of a timesheet
 */
$.fn.populate_task_list_detail = function (mode = 1, tasks, from_date, to_date)
{
    try 
    {
        let tbody = $("#tbl_timesheet_tasks");
        tbody.empty();
        DELETE_TASKS = [];
        let end_date = moment(to_date).add(1, 'days');
        let task_date = '';
        let weekend = false;
        let date_head = true;
        let appt = false;
        let task_existed = false;
        let idx = 0;

        // First, loop through the start date and end date to generate timesheet details row.
        for (let start_date = moment(from_date); start_date.isBefore(end_date); start_date.add(1, 'days'))
        {
            date_head = true;
            task_existed = false;
            // Check weekend row. weekend row will have darker BG.
            if (start_date.day() == 6 || start_date.day() == 0) { weekend = true; }
            else { weekend = false; }

            if ($.inArray(start_date.format('YYYY-MM-DD'), HOLIDAYS) !== -1)
            {
                weekend = true;
            }

            // Second, loop through existing task data if there any, and populate it in correct row according to date
            for (let task of tasks)
            {
                // Check whether it was an appointment or not. Appointment row is not editable
                appt = false;

                task_date = moment(task.task_date);
                if (task_date.isSame(start_date))   // If task exist, insert details into the row
                {
                    if (mode == 1)
                    {
                        $.fn.add_view_row(false, weekend, date_head, start_date, task);
                        task_existed = true;
                    }
                    else if (mode == 2)     // Edit
                    {
                        if (appt)
                        {
                            $.fn.add_view_row(false, weekend, date_head, start_date, task);
                        }
                        else
                        {
                            $.fn.add_edit_row(false, weekend, date_head, idx, start_date, task);
                            task_existed = true;    // Task existed, to prevent from rendering empty row
                        }
                    }

                    if (date_head) { date_head = false; }
                    idx++;
                }
            }

            // If there's no existing data, then render empty row
            if (!task_existed)
            {
                if (mode == 1)          // View
                {
                    $.fn.add_view_row(true, weekend, date_head, start_date);
                }
                else if (mode == 2)     // Edit
                {
                    $.fn.add_edit_row(true, weekend, date_head, idx, start_date);
                }
                idx++;
            }
        }

        $('#btn_new').hide(200);
        $('.view-1').hide(200);
        $('.view-2').show(200);

    }
    catch (e) 
    {
        console.error("[DEBUG] | ", e.message);
        $.fn.log_error(arguments.callee.caller, e.message);
    }
}

/**
 * Append viewable only row into timesheet task details
 * @param  {Boolean}    [empty=true] Whether to insert empty row or not. If set to false, then the data parameter is required
 * @param  {Boolean}    [weekend=true] weekend row flag.
 * @param  {Boolean}    [date_head=true] Date head row flag.
 * @param  {Moment}     date Row Date. Must be Moment Object
 * @param  {Object}     data Row Data. Must be javascript object
 */
$.fn.add_view_row = function (empty = true, weekend = false, date_head = true, date, data)
{
    try
    {
        let tbody = $("#tbl_timesheet_tasks");

        if (empty)      // Insert empty view only row
        {
            tbody.append
                (
                    `<tr ${weekend ? 'style="background-color: #f7f8fa"' : ''}>
                    <td class="cell-shrink"><span">${date_head ? date.format("dddd, Do MMM") : ''}</span></td>
                    <td class="cell-shrink"></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>`
                );
        }
        else        // Insert row with Data
        {
            if (date && data)   // Make sure other parameter is supplied
            {
                let json_field = $.fn.get_json_string(data.json_field);
                let remarks = json_field.remarks != null ? json_field.remarks : '';
                let location = json_field.location != null ? json_field.location : '';
                tbody.append
                    (
                        `<tr ${weekend ? 'style="background-color: #f7f8fa"' : ''} data-date1="${date.format("YYYY-MM-DD")}">
                        <td class="cell-shrink">
                            <span">${date_head ? date.format("dddd, Do MMM") : ''}</span>
                            ${date_head ? '<br>Total Hours : <span class="total-hours"></span>' : ''}
                        </td>
                        <td class="cell-shrink">
                            <span class="txt_hours">${data.hours}</span>
                        </td>
                        <td><span>${data.task_type == 'admin' ? 'Administration' : data.task_name}</span></td>
                        <td><span>${data.sub_task_name}</span></td>
                        <td width="70"><span>${location}</span></td>
                        <td><span>${remarks}</span></td>
                    </tr>`
                    );

                let total_hours = 0;
                $("#tbl_timesheet_tasks tr[data-date1='" + date.format("YYYY-MM-DD") + "']").each(function (index) 
                {
                    total_hours += parseFloat($(this).find('.txt_hours').html());
                });
                $("#tbl_timesheet_tasks tr[data-date1='" + date.format("YYYY-MM-DD") + "']").first().find('.total-hours').html(total_hours);
            }
            else
            {
                // TODO: Handle error: Missing parameter
            }
        }
    } catch (e)
    {
        console.error("[DEBUG] | ", e.message);
        $.fn.log_error(arguments.callee.caller, e.message);
    }
}

/**
 * Append editable row into timesheet task details
 * @param  {Boolean} [empty=true]     Whether to insert empty row or not. If set to false, then the data parameter is required
 * @param  {Boolean} [weekend=false]  weekend row flag.
 * @param  {Boolean} [date_head=true] Date head row flag.
 * @param  {String}  id               Row id, used as row id
 * @param  {Moment}  date             Row Date. Must be Moment Object
 * @param  {Object}  data             Row Data. Must be javascript object
 */
$.fn.add_edit_row = function (empty = true, weekend = false, date_head = true, id, date, data)
{
    try
    {
        let tbody = $("#tbl_timesheet_tasks");
        let newCondition = $("#dynamicContent table tr").children().clone();
        if (empty)      // Insert empty row
        {
            tbody.append
                (
                    `<tr class="tasks" ${weekend ? 'style="background-color: #f7f8fa"' : ''} data-id="" id="${id}" data-date1="${date.format("YYYY-MM-DD")}" data-date="${date}">
                    <td class="cell-shrink">
                        <span>${date_head ? date.format("dddd, Do MMM") : ''}</span>
                        ${date_head ? '<br>Total Hours : <span class="total-hours">0</span>' : ''}
                    </td>
                    <td id="dynamic-${id}"></td>
                    <td class="p-1 py-2"><button type="button" class="btn btn-xs btn-primary btn_add_additional">
                            <i class="fa fa-plus fa-fw" aria-hidden="true"></i>
                        </button>
                    </td>
                </tr>`
                );

            $("#dynamic-" + id).replaceWith(newCondition);

            
            // if ($("#" + id).find(".dd_tasks").data('select2')) {
            //     $("#" + id).find(".dd_tasks").select2('destroy');
            // }
            $("#" + id).find(".dd_tasks").select2();

            
            // if ($("#" + id).find(".dd_sub_tasks").data('select2')) {
            //     $("#" + id).find(".dd_sub_tasks").select2('destroy');
            // }
            $("#" + id).find(".dd_sub_tasks").select2();
        }
        else            // Insert row with Data
        {
            let json_field = $.fn.get_json_string(data.json_field);
            let remarks = json_field.remarks != null ? json_field.remarks : '';
            let location = json_field.location != null ? json_field.location : '';
            tbody.append
                (
                    `<tr class="tasks" ${weekend ? 'style="background-color: #f7f8fa"' : ''} data-id="${data.id}" id="${id}" data-date1="${date.format("YYYY-MM-DD")}" data-date="${date}">
                    <td class="cell-shrink">
                        <span>${date_head ? date.format("dddd, Do MMM") : ''}</span>
                        ${date_head ? '<br>Total Hours : <span class="total-hours"></span>' : ''}
                    </td>
                    <td class="cell-shrink p-1 py-2">
                        <input type="text" class="form-control txt_hours" value="${data.hours}"/>
                    </td>
                    <td width="250" class="p-1 py-2">
                        <select onchange="$.fn.populate_sub_task($(this))" class="dd_tasks" style="width:100%;"></select>
                    </td>
                    <td width="250" class="p-1 py-2">
                        <select class="dd_sub_tasks" style="width:100%;"></select>
                    </td>
                    <td width="70" class="p-1 py-2"><input type="text" class="form-control txt_location" value="${location}"></td>
                    <td class="p-1 py-2"><input type="text" class="form-control txt_remarks" value="${remarks}"></td>
                    <td class="p-1 py-2">
                        <button type="button" class="btn btn-xs btn-primary ${date_head ? 'btn_add_additional' : 'btn_remove_additional'}">
                            <i class="fa fa-plus fa-fw" aria-hidden="true"></i>
                        </button>
                    </td>
                </tr>`
                );

            let total_hours = 0;
            $("#tbl_timesheet_tasks tr[data-date1='" + date.format("YYYY-MM-DD") + "']").each(function (index) 
            {
                total_hours += parseFloat($(this).find('.txt_hours').val());
            });
            $("#tbl_timesheet_tasks tr[data-date1='" + date.format("YYYY-MM-DD") + "']").first().find('.total-hours').html(total_hours);

            //populate tasks drop down as per the selection
            let dd_tasks = TASKS_ARRAY.tasks_drop_down;
            $("#" + id).find(".dd_tasks").empty().append(`<option value=""></option>`);
            if (dd_tasks)
            {
                for (let item of dd_tasks)
                {
                    let selected = '';

                    if (data.task_type != 'admin' && item.task_no == data.task_id)
                    {
                        selected = 'selected';
                    }

                    $("#" + id).find(".dd_tasks").append(`<option ${selected} value="${item.task_no}">${item.task_no} - ${item.task_title}</option>`);

                }
            }
            $("#" + id).find(".dd_tasks").append(`<option ${data.task_type == 'admin' ? 'selected' : ''} value="admin_tasks">Administration</option>`);
            $("#" + id).find(".dd_tasks").select2();

            //populate sub tasks as per the selection
            let sub_tasks = [];
            if (data.task_type == 'admin')
            {
                sub_tasks = TASKS_ARRAY['admin_tasks'];
            }
            else
            {
                sub_tasks = TASKS_ARRAY['default_tasks'];
            }

            $("#" + id).find(".dd_sub_tasks").empty().append(`<option value=""></option>`);
            // console.log(data);
            $.each(sub_tasks, function (key, value) 
            {
                let selected = '';
                if (data.sub_task_id == value['id'])
                {
                    selected = 'selected';
                }
                $("#" + id).find(".dd_sub_tasks").append(`<option ${selected} value="${value['id']}">${value['descr']}</option>`);
            });

            $("#" + id).find(".dd_sub_tasks").select2();
        }
    }
    catch (e) 
    {
        console.error("[DEBUG] | ", e.message);
        $.fn.log_error(arguments.callee.caller, e.message);
    }
}

$.fn.reset_form = function ()
{
    try 
    {
        $('#dp_date, #dp_date_to, #txt_loc').val('');
        DELETE_TASKS = [];
    } catch (e) 
    {
        $.fn.log_error(arguments.callee.caller, e.message);
    }
}

$.fn.create_timesheet = function ()
{
    try 
    {
        let is_valid = $('#form_new_timesheet').parsley().validate();
        if (is_valid)
        {
            G_LADDA[0].start();
            let data =
            {
                from_date: moment($('#dp_date').val(), 'D-MM-YYYY').format(),
                to_date: moment($('#dp_date_to').val(), 'D-MM-YYYY').format(),
                month: moment($('#dp_date_to').val(), 'D-MM-YYYY').format('MMMM'),
                year: moment($('#dp_date_to').val(), 'D-MM-YYYY').format('YYYY'),
                //location					: $('#txt_loc').val(),
                emp_id: SESSIONS_DATA.emp_id
            }

            $.fn.fetch_data
                (
                    $.fn.generate_parameter('validate_timesheet', data),
                    function (return_data)
                    {
                        // console.log(return_data);
                        if (return_data.code == 0)
                        {
                            $.fn.write_data
                                (
                                    $.fn.generate_parameter('add_edit_timesheet', data),
                                    function (return_data)
                                    {
                                        G_LADDA[0].stop();
                                        if (return_data.code == 0)
                                        {
                                            $('#modal_create_timesheet').modal('hide');
                                            $.fn.get_list(false);
                                        }
                                    }, false, G_LADDA[0]
                                );
                        }
                        else
                        {
                            G_LADDA[0].stop();
                        }
                    }
                );


        }
    }
    catch (e) 
    {
        $.fn.log_error(arguments.callee.caller, e.message);
    }
}

$.fn.save_edit_task = function (timesheet_id = '')
{
    try
    {
        let save_length = $('tr.tasks').length;
        let length_idx = 1;
        let data_array = [];

        $('tr.tasks').each
            (
                function ()
                {
                    let idx = $(this).prop('id');

                    let task_id = $(this).find('select.dd_tasks').val();
                    let sub_task_id = $(this).find('select.dd_sub_tasks').val();

                    let json_field = {
                        remarks: $(this).find('.txt_remarks').val(),
                        location: $(this).find('.txt_location').val(),
                    };
                    if (task_id && task_id !== '' && sub_task_id && sub_task_id !== '')
                    {
                        let data =
                        {
                            timesheet_id: timesheet_id,
                            task_date: $(this).data('date1'), //moment($(this).data('date')).format('YYYY-MM-DD'),
                            hours: $(this).find('.txt_hours').val(),
                            task_id: task_id,
                            sub_task_id: sub_task_id,
                            json_field: json_field,
                            emp_id: SESSIONS_DATA.emp_id,
                            id: $('#' + idx).data('id')
                        }
                        data_array.push(data);
                    }

                }
            );



        $.fn.write_data
            (
                $.fn.generate_parameter('add_edit_timesheet_task_batch', { tasks: data_array, delete_tasks: DELETE_TASKS }),
                function (return_data)
                {
                    if (return_data.code == 0)    // Success
                    {
                        $.fn.show_right_success_noty('Timesheet has been updated successfully');
                        $('.view-2').hide(200);
                        $('.view-1').show(200);
                        $('#btn_new').show(200);
                        $("#btn_save_task").hide(200);
                        $('.save-info span').html(`Last save on ${moment()}`);
                        G_LADDA[1].stop();
                    }
                }, false
            );
    }
    catch (err)
    {
        console.error("[DEBUG] | ", err.message);
        // $.fn.log_error(arguments.callee.caller,err.message);
    }
};

$.fn.submit_timesheet = function (timesheet_id)
{
    try
    {
        var data =
        {
            id: timesheet_id,
            emp_id: SESSIONS_DATA.emp_id
        };

        bootbox.confirm
            ({
                title: "Submit Confirmation",
                message: "Are you sure you want to submit this timesheet?.",
                buttons:
                {
                    cancel:
                    {
                        label: '<i class="fa fa-times"></i> NO'
                    },
                    confirm:
                    {
                        label: '<i class="fa fa-check"></i> YES'
                    }
                },
                callback: function (result)
                {
                    if (result == true)     // Users click 'YES'
                    {
                        $.fn.write_data
                            (
                                $.fn.generate_parameter('submit_timesheet', data),
                                function (return_data)
                                {
                                    if (return_data)
                                    {
                                        $.fn.get_list(false);
                                        $.fn.show_right_success_noty('Timeheet has been submitted successfully');
                                    }
                                }, false
                            );
                    }
                }
            });
    }
    catch (err)
    {
        $.fn.log_error(arguments.callee.caller, err.message);
    }
};

$.fn.delete_timesheet = function (timesheet_id)
{
    try
    {
        var data =
        {
            id: timesheet_id,
            emp_id: SESSIONS_DATA.emp_id
        };

        bootbox.confirm
            ({
                title: "Delete Confirmation",
                message: "Are you sure you want to delete this timesheet?.",
                buttons:
                {
                    cancel:
                    {
                        label: '<i class="fa fa-times"></i> NO'
                    },
                    confirm:
                    {
                        label: '<i class="fa fa-check"></i> YES'
                    }
                },
                callback: function (result)
                {
                    if (result == true)
                    {
                        $.fn.write_data
                            (
                                $.fn.generate_parameter('delete_timesheet', data),
                                function (return_data)
                                {
                                    if (return_data)
                                    {
                                        $.fn.get_list(false);
                                        $.fn.show_right_success_noty('Timesheet has been deleted successfully');
                                    }

                                }, false
                            );
                    }
                }
            });
    }
    catch (err)
    {
        $.fn.log_error(arguments.callee.caller, err.message);
    }
};

$.fn.prepare_form = function ()
{
    try
    {
        if (MODULE_ACCESS.create == 0)
        {
            $('#btn_new').hide();
            $('#btn_save').hide();
            $('#btn_cancel').hide();
        }

        let date_from = $('#dp_date').flatpickr({ 
            altInput: true,
            altFormat: "d-M-Y",
            dateFormat: "d-m-Y",
            onClose: function(selectedDates, dateStr, instance) {
                let minDate = dateStr;
                let sdate = new Date(selectedDates);
                let maxDate = new Date(sdate.getFullYear(), sdate.getMonth() + 1, 0);
                date_to.set('minDate', dateStr);
                date_to.set('maxDate', maxDate);
            },
        });

        let date_to = $('#dp_date_to').flatpickr({ 
            altInput: true,
            altFormat: "d-M-Y",
            dateFormat: "d-m-Y",
        });

        $('#form_new_timesheet').parsley(
            {
                classHandler: function(parsleyField) {              
                    return parsleyField.$element.closest(".errorContainer");
                },
                errorsContainer: function(parsleyField) {              
                    return parsleyField.$element.closest(".errorContainer");
                },
            }
        );

        G_LADDA[0] = Ladda.create(document.querySelector('#btn_create_timesheet'));
        G_LADDA[1] = Ladda.create(document.querySelector('#btn_save_task'));

        $.fn.get_holidays_list();
        $.fn.get_list(false);
        $.fn.populate_tasks_list();
    }
    catch (err)
    {
        $.fn.log_error(arguments.callee.caller, err.message);
    }
};

$.fn.populate_tasks_list = function ()
{
    try
    {
        let data =
        {
            emp_id: SESSIONS_DATA.emp_id,
        }

        $.fn.fetch_data
            (
                $.fn.generate_parameter('get_tasks_for_timesheet', data),
                function (return_data)
                {
                    TASKS_ARRAY = return_data.data;
                    if (return_data.data.tasks_drop_down)
                    {
                        $('.dd_tasks').empty().append(`<option value=""></option>`);
                        for (let item of return_data.data.tasks_drop_down)
                        {
                            $('.dd_tasks').append(`<option value="${item.task_no}">${item.task_no} - ${item.task_title}</option>`);
                        }
                        $('.dd_tasks').append(`<option value="admin_tasks">Administration</option>`);
                    }
                }, true
            );
    }
    catch (err)
    {
        $.fn.log_error(arguments.callee.caller, err.message);
    }
};

$.fn.add_additional = function (this_class)
{
    try
    {
        //destroy select2 before cloning
        this_class.parents("tr").find("select.dd_tasks").select2("destroy");
        this_class.parents("tr").find("select.dd_sub_tasks").select2("destroy");

        let current_row = this_class.parents("tr").clone();
        current_row.find("td:nth-child(1)").empty();

        current_row.attr("data-id", "");
        current_row.attr("id", $('#tbl_timesheet_tasks tr').length);
        current_row.find(".txt_hours").val('');
        current_row.find(".txt_location").val('');
        // current_row.find(".txt_location").val('');

        current_row.find(".btn_add_additional").toggleClass("btn_add_additional btn_remove_additional");
        current_row.find(".btn-primary").toggleClass("btn-primary btn-danger");
        current_row.find(".fa-plus").toggleClass("fa-plus fa-times");

        $(current_row).insertAfter(this_class.parents("tr"));

        // reinitialize select2
        $('.dd_tasks').select2();
        $('.dd_sub_tasks').select2();
    }
    catch (err)
    {
        $.fn.log_error(arguments.callee.caller, err.message);
    }
};

$.fn.calculate_total_hours = function (this_class)
{
    try
    {
        let date = this_class.parents('tr').attr('data-date1');
        let total_hours = 0;
        $("#tbl_timesheet_tasks tr[data-date1='" + date + "']").each(function (index) 
        {
            total_hours += parseFloat($(this).find('.txt_hours').val());
        });
        $("#tbl_timesheet_tasks tr[data-date1='" + date + "']").first().find('.total-hours').html(total_hours);
    }
    catch (err)
    {
        $.fn.log_error(arguments.callee.caller, err.message);
    }
};

$.fn.populate_sub_task = function (this_class)
{
    try
    {
        var sub_tasks = [];
        if (this_class.val() == 'admin_tasks')
        {
            sub_tasks = TASKS_ARRAY['admin_tasks'];
        }
        else
        {
            sub_tasks = TASKS_ARRAY['default_tasks'];
        }

        //empty subtask dropdown values and append options based on tasks
        this_class.parents('tr').find('.dd_sub_tasks').empty().append(`<option value=""></option>`);
        $.each(sub_tasks, function (key, value) 
        {
            this_class.parents('tr').find('.dd_sub_tasks').append(`<option value="${value['id']}">${value['descr']}</option>`);
        });

        this_class.parents('tr').find(".dd_sub_tasks").select2('destroy');
        this_class.parents('tr').find(".dd_sub_tasks").select2();
    }
    catch (err)
    {
        $.fn.log_error(arguments.callee.caller, err.message);
    }
};

$.fn.bind_command_events = function ()
{
    try
    {
        // Button to open modal for timesheet creation
        $('#btn_new').click(function (e)
        {
            e.preventDefault();
            $.fn.reset_form();
            $("#modal_create_timesheet").modal('show');
        });

        // Button for creating a timesheet
        $('#btn_create_timesheet').on('click', function (e) 
        {
            e.preventDefault();
            $.fn.create_timesheet();
        });

        // Button for going back to list of timesheet
        $('#btn_back_to_list').on('click', function (event) 
        {
            event.preventDefault();
            $('.view-2').hide(200);
            $('.view-1').show(200);
            $('#btn_new').show(200);
            $("#btn_save_task").hide(200);
        });

        // Button for saving the changes after finished updating the timesheet task
        $('#btn_save_task').click(function (e)
        {
            e.preventDefault();
            G_LADDA[1].start();
            let tsid = $(this).data('timesheetid');
            $.fn.save_edit_task(tsid);
        });

        $('#btn_load_more').on('click', function (event) 
        {
            event.preventDefault();
            $.fn.get_list(true);
        });

        $(document).on('click', '.btn_add_additional', function (e)
        {
            $.fn.add_additional($(this));
        });

        $(document).on('click', '.btn_remove_additional', function (e)
        {
            $(this).parents('tr').remove();
            DELETE_TASKS.push($(this).parents('tr').attr('data-id'));
        });

    }
    catch (err)
    {
        $.fn.log_error(arguments.callee.caller, err.message);
    }
};

$.fn.form_load = function ()
{
    try
    {
        // SESSIONS_DATA = JSON.parse($('#session_data').val());
        $.fn.prepare_form();
        $.fn.bind_command_events();
    }
    catch (err)
    {
        $.fn.log_error(arguments.callee.caller, err.message);
    }
};

// START of Document initialization
$(document).ready(function ()
{
    $.fn.form_load();
});
// END of Document initialization
