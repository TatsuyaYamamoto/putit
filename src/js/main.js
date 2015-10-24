
$(function() {

	$(".sheet").find(".body").resizable();

	$(".sheet").find(".head")
		.on("mousedown", function(){
			$(this).parent().draggable({disabled: false});
		}).on("mouseup", function(){
			$(this).parent().draggable({disabled: true});
		})
});




