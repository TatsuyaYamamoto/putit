
$(function() {

	$(".sheet").find(".body").resizable();
	$("#workspace").on("click", ".remove", function(){
		$(this).parents(".sheet").remove();
	})

	$(".sheet").find(".head")
		.on("mousedown", function(){
			$(this).parent().draggable({disabled: false});
		}).on("mouseup", function(){
			$(this).parent().draggable({disabled: true});
		})
});




