$(document).ready(function(){
	$(".delete-turtle").on("click", deleteUser);
});

function deleteUser() {
	var confirmation = confirm('are you sure you want to delete?');

	var id = $(this).data('id');

	if(confirmation) {
		$.ajax({
			url: '/turtles/delete/' + id,
			type: 'DELETE'
		})
		.done(function(response) {
			console.log("ajax success");
		})
		.fail(function() {
			console.log("ajax error");
		})
		.always(function() {
			console.log("ajax complete");
			window.location.replace('/');

		});
		
	} else {
		return false;
	}
}