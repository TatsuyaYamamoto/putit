
$(function() {

	// ドロワーメニューライブラリ読み込み
	$(".drawer-handle").sidr({
		speed: 100,
		body: "section#toolbar"
	});

	$("#workspace").on("click", ".remove", function(){
		var sheetId = $(this).parents(".sheet").attr("sheet-id");
		$("#workspace").children('[sheet-id="' + sheetId + '"]').remove();
		$("#sheetList").children('[sheet-id="' + sheetId + '"]').remove();
	})
	$("#sheetList").on("click", ".remove", function(){
		var sheetId = $(this).parents(".sheetListItem").attr("sheet-id");
		$("#workspace").children('[sheet-id="' + sheetId + '"]').remove();
		$("#sheetList").children('[sheet-id="' + sheetId + '"]').remove();
	})



	$(".add").on("click", function(){

		var sheetId = getUUID();

		// シート追加
		$("#workspace").append(getSheet(sheetId));

		// シートリスト追加
		$("#sheetList").append(getSheetListItem(sheetId));

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

	// ドロワーメニュー -------------------

	$('[name=font-size]').on('change', function(){
		$('body').css('font-size', $(this).val());
	})
	$('[name=font-family]').on('change', function(){
		$('body').css('font-family', $(this).val());
	})
	$('[name=sheet-color]').on('change', function(){
		$('.sheet').css('background-color', $(this).val());
	})


	// ショートカット ---------------------

});



// Util function ---------------------------

function getSheet(sheetId){

	return	'<div class="sheet" sheet-id="' + sheetId + '">\
				<div class="head">\
					<div class="row">\
						<div class="remove"></div>\
					</div>\
				</div>\
				<div class="body">\
					<div class="textarea" contenteditable="true"></div>\
				</div>\
			</div>';
}

function getSheetListItem(sheetId){

	return 	'<li>\
				<div class="sheetListItem" sheet-id="' + sheetId + '">\
					<div class="remove">delete</div>\
				</div>\
			</li>';
}

function getUUID(){
    var S4 = function(){
    	return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}
