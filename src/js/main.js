var sheetTemplate = 	'<div class="sheet">' +
							'<div class="head">' +
								'<div class="row">' +
									'<div class="remove">×</div>' +
								'</div>' +
							'</div>' +
							'<div class="body">' +
								'<div class="textarea" contenteditable="true"></div>' +
							'</div>' +
						'</div>';


$(function() {

	$("#workspace").on("click", ".remove", function(){
		$(this).parents(".sheet").remove();
	})


	$(".add").on("click", function(){
		// シート追加
		$("#workspace").prepend(sheetTemplate);

		// 機能付与
		$(".sheet").find(".body").resizable();

		$(".sheet").find(".head")
			.on("mousedown", function(){
				$(this).parent().draggable({disabled: false,
				stack: ".sheet"});
			}).on("mouseup", function(){
				$(this).parent().draggable({disabled: true});
			})
	})


});




