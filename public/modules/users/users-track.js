var RECORD_INDEX = 0;
var btn_search;
if(CURRENT_ROUTE.data){
				var user_id = CURRENT_ROUTE.data.user_id;
				var date = CURRENT_ROUTE.data.date;
			}

$.fn.get_list = function ()
{
    try
    {
        var data =
        {
            employee_id: $('#dd_employee').val(),
            from_date: $('#from_date').val(),
            to_date: $('#to_date').val(),
            emp_id: SESSIONS_DATA.emp_id
        };

        $.fn.fetch_data
            (
                $.fn.generate_parameter('get_employee_track', data),
                function (return_data)
                {
                    if (return_data)
                    {
                        $.fn.populate_list(return_data.data);
                    }
                }, true, btn_search
            );
    }
    catch (err)
    {
        $.fn.log_error(arguments.callee.caller, err.message);
    }
};

$.fn.populate_list = function (data)
{
    try
    {
        if (data)
        {
            let row = '';
            $('#div_gallery').empty();
            for (var i = 0; i < data.length; i++)
            {
                row += `<li class="mix architecture mix_all" data-name="${data[i].name}">
							<a href="${data[i].filename}" target="_blank" title="${data[i].name}" created_by="${data[i].created_by}">
                            	<img src="${data[i].thumbnail}">
                            </a>
                            <h4>${data[i].name}</h4>
                        </li>`;

            }
            row += `<li class="gap"></li>`;
            $('#div_gallery').html(row);

            $('.gallery').mixitup({ onMixEnd: function () { } });
        }
    }
    catch (err)
    {
        //		console.log(err.message);
        $.fn.log_error(arguments.callee.caller, err.message);
    }

};
function get_users_tracker_employee(rowData = false) {
	try {
	  let row = "<option value='ALL'>All</option>";
	  if (rowData) {
		for (var i = 0; i < rowData.length; i++) {
		  let jsval = escape(JSON.stringify(rowData[i]));
		  row += `<option data-val="${jsval}" value=${rowData[i].id}>
							   ${rowData[i].desc}
						   </option>`;
		}
		$("#dd_employee").html(row);
		$("#dd_employee").select2();
		if (user_id != null)
        {
			
            $('#dd_employee').val(user_id).change();
			$.fn.get_list();
        }

        
	  }
	} catch (err) {
	  // console.log(err.message);
	  $.fn.log_error(arguments.callee.caller,err.message);
	}
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
$.fn.bind_command_events = function()
 {	
	 try
	 {
		 $('#btn_go_grid').click(function (e)
        {
            e.preventDefault();
            $('#btn_go_list').removeClass('active');
            $(this).addClass('active');
            var delay = setTimeout(function ()
            {
                $('.gallery').mixitup('toGrid');
                $('.gallery').removeClass('full-width');
            });
        });

        $('#btn_go_list').click(function (e)
        {
            e.preventDefault();
            $('.gallery').mixitup('toList');
            $(this).addClass('active');
            var delay = setTimeout(function ()
            {
                $('.gallery').addClass('full-width');
                $('#btn_go_grid').removeClass('active');
            });
        });
		$('#btn_search').click(function (e)
        {
            e.preventDefault();
            RECORD_INDEX = 0;
            btn_search = Ladda.create(this);
            btn_search.start();
            $.fn.get_list();
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
		 let params = {
			emp_id:SESSIONS_DATA.emp_id
		}
		let data = [
			{ func: "get_users_tracker_employee", params: params },
		];
		$.fn.get_everything_at_once_altrawise(data);
		if( date ){
			var startdate = moment(date);
			var enddate = moment(startdate).add(1, 'day');
		}
		else{
			var startdate = moment(new Date()).subtract(1, 'day');
			var enddate =   moment(new Date());
			
		}
		$('#from_date').val(startdate.format("YYYY-MM-DD"));
		$('#to_date').val(enddate.format("YYYY-MM-DD"));
		$("#doc_search_date").trigger("change");
			
		
		
		$("#doc_search_date").flatpickr({
			mode:"range",
			altFormat: "d-M-Y",
			dateFormat: "d-M-Y",
			defaultDate: [startdate.format("DD-MMM-YYYY"),enddate.format("DD-MMM-YYYY")],
			onChange:function(selectedDates){
				var _this=this;
				
				var dateArr=selectedDates.map(function(date){return _this.formatDate(date,'Y-m-d');});
				$('#from_date').val(dateArr[0]);
				$('#to_date').val(dateArr[1]);
			},
		});
		 $('.popup-gallery').magnificPopup({
            delegate: 'a',
            type: 'image',
            tLoading: 'Loading image #%curr%...',
            mainClass: 'mfp-img-mobile',
            gallery: {
                enabled: true,
                navigateByImgClick: true,
                preload: [0, 1] // Will preload 0 - before current, and 1 after the current image
            },
            image: {
                tError: '<a href="%url%">The image #%curr%</a> could not be loaded.',
                titleSrc: function (item)
                {
                    return item.el.attr('title') + '<small>' + item.el.attr('created_by') + '</small>';
                }
            }
        });	
		$.fn.get_list();
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
 
