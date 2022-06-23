function exportTable2PDF(title,tableId,orientation){

    var doc = new jsPDF(orientation, 'pt', 'a4');

    var htmlcontent = $('#'+tableId+'').html();
    var $jQueryObject = $($.parseHTML(htmlcontent));
    $jQueryObject.find(".ng-hide").remove();
    $jQueryObject.find(".text-danger").remove();
    $jQueryObject.find(".collapse").remove();

    var i = 0;
    var columns = [],
        rows = [],
        ignoreColumn = [];

    $jQueryObject.find('tr').each(function() {
         if(i==0) {
            var k = 0, m = 0, n = 0;
             $(this).find('th').each(function (index, data) {
                 if($(this).attr('id') != "ignorePdf"){
                    columns[k] = $(this)[0].innerText.trim();
                     k++;
                 }
                 else{
                    ignoreColumn[m] = n;
                    m++;
                 }
                 n++;
             });
         }
         else{
             var l = 0, q = 0;
             var rowData = [];
             //$(this).filter(':visible').find('td').each(function(index,data) {
             $(this).find('td').each(function(index,data) {
                 if(ignoreColumn.indexOf(q) == -1){
                    rowData[l] = $(this)[0].innerText.trim();
                    l++;
                 }
                 q++;
             });
             if(l > 0) {
                 rows[i - 1] = rowData;
             }
             if(l == 0){
                 i = i - 1;
             }
         }
         i++;
     });

    var dateObj = new Date();
    var currentDate = dateObj.getDate()+"/"+(dateObj.getMonth() + 1)+"/"+dateObj.getFullYear();

    doc.autoTable(columns, rows, {
        theme: 'striped',
        margin: {top: 60},
        styles: {overflow: 'linebreak'},
        bodyStyles: {valign: 'top'},
        beforePageContent: function(data) {
            doc.text(title, 40, 50);
        },
        afterPageContent: function(data) {
            doc.text(currentDate, 40, doc.internal.pageSize.height - 30);
        }
    });
    doc.save(title.trim()+".pdf");
}
function exportTable2CSV(title,tableId){

    var clean_text = function(text){
        text = text.replace(/"/g, '""');
        return '"'+text+'"';
    };

    var htmlcontent = $('#'+tableId+'').html();
    var $jQueryObject = $($.parseHTML(htmlcontent));
    $jQueryObject.find(".ng-hide").remove();
    $jQueryObject.find(".text-danger").remove();
    $jQueryObject.find(".collapse").remove();

    var i = 0;
    var rows = [],
        ignoreColumn = [];
    rows[0] = title;
    rows[1] = "";
    $jQueryObject.find('tr').each(function() {
        if(i==0) {
            var k = 0, m = 0, n = 0;
            var columnData = [];
            $(this).find('th').each(function (index, data) {
                if($(this).attr('id') != "ignorePdf"){
                    columnData[k] = clean_text($(this)[0].innerText.trim());
                    k++;
                }
                else{
                    ignoreColumn[m] = n;
                    m++;
                }
                n++;
            });
            columnData = columnData.join(",");
            rows[2] = columnData;
        }
        else{
            var l = 0, q = 0;
            var rowData = [];
            $(this).find('td').each(function(index,data) {
                if(ignoreColumn.indexOf(q) == -1){
                    rowData[l] = clean_text($(this)[0].innerText.trim());
                    l++;
                }
                q++;
            });
            if(l > 0) {
                rowData = rowData.join(",");
                rows[i+2] = rowData;
            }
            if(l == 0){
                i = i - 1;
            }
        }
        i++;
    });

    rows = rows.join("\n");

    var csv = rows;
    var uri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
    var download_link = document.createElement('a');
    download_link.href = uri;
    var ts = new Date().getTime();
    if(title==""){
        download_link.download = ts+".csv";
    } else {
        download_link.download = title+"-"+ts+".csv";
    }
    document.body.appendChild(download_link);
    download_link.click();
    document.body.removeChild(download_link);


}
$.fn.get_everything_at_once_altrawise = function (data, details = false) {
  try {
    $.fn.fetch_data(
      $.fn.generate_parameter("get_everything_at_once_altrawise", data),
      function (return_data) {
        if (return_data) {
          var allData = return_data.data;
          var allDataArray;
          for (let i = 0; i < allData.length; i++) {
            allDataArray = JSON.parse(allData[i]);
            window[data[i].func](allDataArray.data, details);
          }
        }
      },
      true
    );
  } catch (err) {
    // console.log(err.message);
    $.fn.log_error(arguments.callee.caller,err.message);
  }
};
function get_attendance_reports_employee(rowData = false) {
	try {
	  let row = "<option value=''>All</option>";
	  if (rowData) {
		for (var i = 0; i < rowData.length; i++) {
		  let jsval = escape(JSON.stringify(rowData[i]));
		  row += `<option data-val="${jsval}" value=${rowData[i].id}>
							   ${rowData[i].desc}
						   </option>`;
		}
		$("#dd_employee").html(row);
		$("#dd_employee").select2();
	  }
	} catch (err) {
	  // console.log(err.message);
	  $.fn.log_error(arguments.callee.caller,err.message);
	}
  }
$.fn.get_report_list = function ()
{
    try
    {
        let total_claim = 0;
        let datemonth = moment($('#dp_month').val(), 'MMM-YYYY');
        let data =
        {
            year: datemonth.format('YYYY'),
            month: datemonth.format('M'),
            emp_id: $("#dd_employee").val()
        }

        $.fn.fetch_data
            (
                $.fn.generate_parameter('get_timesheet_attendance_report', data),
                function (return_data)
                {
                    $('#title_month_year').html(datemonth.format('MMMM YYYY'));
                    if (return_data.data)
                    {
                        $('#tbody').empty();
                        let row = '';
                        data = return_data.data;
                        for (var i = 0; i < data.length; i++)
                        {
                            row += `<tr id="TR_ROW_${i}" style="cursor: pointer;"
									onclick="$.fn.populate_detail_form(unescape( $(this).closest('tr').attr('data-value')),this )"
									data-value="${escape(JSON.stringify(data[i]))}">
									
									<td>${data[i].name}</td>
									<td>${data[i].medical_leave}</td>
									<td>${data[i].annual_leave}</td> 
									<td>${data[i].unpaid_leave}</td> 
									<td>${data[i].no_show}</td> 
									<td>${data[i].claims.split(',').join('')}</td>
									<td>${data[i].claims_total}</td>
									<td>${data[i].remarks}</td>
								</tr>`;
                            total_claim += Number(data[i].claims_total);
                        }
                        row += `<tr>
								<td colspan=8 style="text-align:right">Total Claim : ${total_claim.toFixed(2)}</td>
							</tr>`;


                        $('#tbody').append(row);
                    }

                }, true
            );
    }
    catch (e)
    {
        //    	console.log(e.message);
        $.fn.log_error(arguments.callee.caller, e.message);
    }
};
$.fn.bind_command_events = function()
 {	
	 try
	 {
		$('#showSearchDiv').on('click', function (e)
        {
            e.preventDefault();
            $('#searchDiv').show();
			$("#showSearchDiv").hide();
        });
		$('#closeSearch').on('click', function (e)
        {
            e.preventDefault();
            $('#searchDiv').hide();
			$("#showSearchDiv").show();
        });
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
		$("#searchDiv").hide();
		let params = {
			emp_id:SESSIONS_DATA.emp_id
		}
		let data = [
			{ func: "get_attendance_reports_employee", params: params },
		];
		$.fn.get_everything_at_once_altrawise(data);
		var startdate = moment();
		$('#dp_month').val(startdate.format("MMM-YYYY"));
		$("#dp_month").flatpickr({
		 plugins: [new monthSelectPlugin({
			  shorthand: true,
			 dateFormat: "M-Y", //defaults to "F Y"
          altFormat: "F Y", //defaults to "F Y"
		 })],
		});
		$("#dd_employee").select2();
		$.fn.get_report_list();
	 }
	 catch(err)
	 {
		 console.log(err);
		 //$.fn.log_error(arguments.callee.caller,err.message);
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
 
