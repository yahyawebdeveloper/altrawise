/**
 * @author Syed Anees
 * @module Client Portal
 * @description Client portal UI
 * @date 04-05-2022
 */

$(document).ready(function() {
    try {
        
        if($.jStorage.get('client_token') == null) {
            window.location.href = 'login.html';
        }

        TOKEN = $.jStorage.get('client_token');
        SESSIONS_DATA = $.jStorage.get('client_session_data');

        // console.log(SESSIONS_DATA);
        // console.log(TOKEN);

        // Initial Navigo
		var root = '/wta/public/client/';
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

        router
			.on("/", () => { //dashboard route
				$.fn.load_form('../client/modules/dashboard.html');
			})
            .on("/tasks", () => { //dashboard route
				$.fn.load_form('../client/modules/tasks/tasks.html');
			})
			.on({
				"/task/:id" : {
					as: "task/details",
					uses: () => {
						$.fn.load_form('../client/modules/tasks/task-details.html');
					}
				}
			})
			.on("/signout", () => { //signout route
				$.fn.user_logout();
			})
			.notFound(() => { // not found route - display 404 page
				console.log('404');
			})
			.resolve();

		//store router in a global variable
		ROUTE = router;
			
		//store current route in a global variable
		CURRENT_ROUTE = router.current[0];
    } catch(err) {
        console.log(err);
    }
});