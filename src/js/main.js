
$(function() {

	// ドロワーメニューイベント
	$(".drawer-handle").sidr({
		speed: 100,
		body: "section#toolbar"
	});

	// 削除ボタン
	$("#workspace").on("click", ".delete", function(){
		var sheetId = $(this).parents(".sheet").attr("sheet-id");
		$("#workspace").children('[sheet-id="' + sheetId + '"]').remove();
		$("#sheetList").children('[sheet-id="' + sheetId + '"]').remove();
	})

	// 削除ボタン
	$("#sheetList").on("click", ".delete", function(){
		var sheetId = $(this).parents(".sheetListItem").attr("sheet-id");
		$("#workspace").children('[sheet-id="' + sheetId + '"]').remove();
		$("#sheetList").children('[sheet-id="' + sheetId + '"]').remove();
	})

	// シートリストアイテムのdeleteボタンを表示させる
	$("#sidr").on("click", ".deleteAttache", function(){
		$(".sheetListItem").append('<div class="delete">delete</div>');
	})

	// シート内のテキストとsheetListItem内のテキストを同期させる
	// 同期させる文字は"10文字以下""1行目のみ"
	$("#workspace").on("keyup", ".textarea", function(){
		var sheetId = $(this).parents(".sheet").attr("sheet-id");
		var text = $(this).text();
		if(text.length > 10) text = text.substr(0, 10) + "...";
		$("#sheetList")
			.find('[sheet-id="' + sheetId + '"] > .title')
			.text(text);		
	})

	// シート追加ボタン
	$(".add").on("click", function(){
		addSheet(getUUID());
	})


	// 右クリック操作 -------------------
	$("#workspace").contextmenu({
    delegate: ".sheet",
    menu: [
        {title: "Copy", cmd: "copy", uiIcon: "ui-icon-copy"},
        {title: "Delete", cmd: "delete", uiIcon: "ui-icon-trash"},
        {title: "Lock", cmd: "lock", uiIcon: "ui-icon-pin-s"},
    ],
    select: function(event, ui) {
        var selectedSheetId = ui.target.parents(".sheet").attr("sheet-id");
        switch(ui.cmd){
        	case "copy":
        		var text = $('[sheet-id="' + selectedSheetId + '"]').find(".textarea").text();
        		var addSheetId = getUUID()
        		addSheet(addSheetId);
        		$('[sheet-id="' + addSheetId + '"] >> .textarea').text(text);
				if(text.length > 10){
					text = text.substr(0, 10) + "...";
				}
				$("#sheetList")
					.find('[sheet-id="' + addSheetId + '"] > .title')
					.text(text);
        		break;

        	case "delete":
				$("#workspace").children('[sheet-id="' + selectedSheetId + '"]').remove();
				$("#sheetList").children('[sheet-id="' + selectedSheetId + '"]').remove();
        		break;

        	case "lock":
        		break;
        }
    }
});


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



// 共通機能 -----------------

function addSheet(sheetId){

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
}

// Util function ---------------------------

function getSheet(sheetId){

	return	'<div class="sheet" sheet-id="' + sheetId + '">\
				<div class="head">\
					<div class="row">\
						<div class="delete ui-icon ui-icon-closethick"></div>\
						<div class="lock ui-icon ui-icon-pin-w">a</div>\
					</div>\
				</div>\
				<div class="body">\
					<div class="textarea" contenteditable="true"></div>\
				</div>\
			</div>';
}

function getSheetListItem(sheetId){

	return 	'<li class="sheetListItem" sheet-id="' + sheetId + '">\
				<div class="title"></div>\
			</li>';
}

function getUUID(){
    var S4 = function(){
    	return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}
