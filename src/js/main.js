var sheetTemplate = '<div class="sheet">\
						<div class="head">\
							<div class="row">\
								<div class="remove">×</div>\
							</div>\
						</div>\
						<div class="body">\
							<div class="textarea" contenteditable="true"></div>\
						</div>\
					</div>';


$(function() {



	// ドロワーメニューライブラリ読み込み
	$(".drawer-handle").sidr({
		speed: 100,
		body: "section#toolbar"
	});

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

	$("#workspace").on("keydown", ".textarea", function(e){
		// $(this).designMode = "on";
		e = e || window.event;
		var keyCode = e.keyCode || e.which; 
		if (keyCode == 9){
			e.preventDefault();
			document.execCommand('styleWithCSS',true,null);
			document.execCommand('indent',true,null);
		}
	})


	$('[name=font-size]').on('change', function(){
		$('body').css('font-size', $(this).val());
	})
	$('[name=font-family]').on('change', function(){
		$('body').css('font-family', $(this).val());
	})
	$('[name=sheet-color]').on('change', function(){
		$('.sheet').css('background-color', $(this).val());
	})
});



// UTIL function ---------------------------

