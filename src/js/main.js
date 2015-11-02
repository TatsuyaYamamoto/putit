
$(function() {

	// ドロワーメニューイベント
	$(".drawer-handle").sidr({
		speed: 100,
		body: "section#toolbar"
	});

	// 削除ボタン
	$("#workspace").on("click", ".delete", function(){
		var selectedSheetId = $(this).parents(".sheet").attr("sheet-id");
		deleteSheet(selectedSheetId);
	})

	// 削除ボタン
	$("#sheetList").on("click", ".delete", function(){
		var selectedSheetId = $(this).parents(".sheetListItem").attr("sheet-id");
		deleteSheet(selectedSheetId);
	})

	// コピーボタン
	$("#sheetList").on("click", ".copy", function(){
		var selectedSheetId = $(this).parents(".sheetListItem").attr("sheet-id");
		copySheet(selectedSheetId);
	})

	// ロック
	$("#workspace").on("click", ".lock", function(){
		var selectedSheetId = $(this).parents(".sheet").attr("sheet-id");
		lockSheet(selectedSheetId);
	})
	// アンロック
	$("#workspace").on("click", ".unlock", function(){
		var selectedSheetId = $(this).parents(".sheet").attr("sheet-id");
		unlockSheet(selectedSheetId);
	})


	// シートリストアイテムのdeleteボタンを表示させる
	$("#sidr").on("click", ".attacheMenu", function(){
		$(".sheetListItem .copy").each(function(i, elem) {
			$(elem).css('display', 'inline-block')
		});
		$(".sheetListItem .lock").each(function(i, elem) {
			$(elem).css('display', 'inline-block')
		});
		$(".sheetListItem .delete").each(function(i, elem) {
			$(elem).css('display', 'inline-block')
		});
	})

	// シート内のテキストとsheetListItem内のテキストを同期させる
	// 同期させる文字は"10文字以下""1行目のみ"
	$("#workspace").on("keyup", ".textarea", function(){
		var selectedSheetId = $(this).parents(".sheet").attr("sheet-id");
		updateSheet(selectedSheetId);
		setNow(selectedSheetId)
	})

	// シート追加ボタン
	$(".add").on("click", function(){
		var sheetId = addSheet();
		setNow(sheetId)
	})


	// 右クリック操作 -------------------
	$("#workspace").contextmenu({
	    delegate: ".sheet",
	    menu: [
	        {title: "Copy", cmd: "copy", uiIcon: "ui-icon-copy"},
	        {title: "Delete", cmd: "delete", uiIcon: "ui-icon-trash"},
	        {title: "Lock/Unlock", cmd: "lock", uiIcon: "ui-icon-pin-s"},
	    ],
	    beforeOpen: function(event, ui) {
	    	for ( var n in ui.target.cmd ) {
	    		console.log(n)

			}
		},
	    select: function(event, ui) {
	        var selectedSheetId = ui.target.parents(".sheet").attr("sheet-id");
	        switch(ui.cmd){
	        	case "copy":
					copySheet(selectedSheetId);
	        		break;

	        	case "delete":
					deleteSheet(selectedSheetId);
	        		break;

	        	case "lock":
	        		var $target = $("#workspace").children('[sheet-id="' + selectedSheetId + '"]').find(".lock");
	        		$target.is('*')
			        	?lockSheet(selectedSheetId)
			        	:unlockSheet(selectedSheetId);
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
function setNow(sheetId){
	var now = dateFormat.format(new Date(), 'MM/dd hh:mm');
	$('[sheet-id="' + sheetId + '"] >> .MMddhhmm').text(now);
}


function addSheet(){

	var sheetId = getUUID()
	// シート追加
	$("#workspace").append(getSheet(sheetId));
	// シートリスト追加
	$("#sheetList").append(getSheetListItem(sheetId));
	// 機能付与
	$(".sheet .body").resizable({ autoHide : true });

	$(".sheet").draggable({
					disabled: false,
					handle : '.head',
					scroll : false,
					stack : ".sheet"
				})
	return sheetId;
}

function lockSheet(sheetId){

	$sheet = $("#workspace").children('[sheet-id="' + sheetId + '"]');

	$sheet.find(".lock")
		.removeClass("ui-icon-pin-w")
		.addClass("ui-icon-pin-s")
		.removeClass("lock")
		.addClass("unlock")

	$sheet.find(".delete").hide();
	$sheet.find(".textarea").attr("contenteditable","false");
	$sheet.find(".body").resizable('disable');
	$sheet.draggable('disable');
}
function unlockSheet(sheetId){

	$sheet = $("#workspace").children('[sheet-id="' + sheetId + '"]');

	$sheet.find(".unlock")	
		.removeClass("ui-icon-pin-s")
		.addClass("ui-icon-pin-w")
		.removeClass("unlock")
		.addClass("lock")

	$sheet.find(".delete").show();

	$sheet.find(".textarea").attr("contenteditable","true")
	$sheet.find(".body").resizable('enable');
	$sheet.draggable('enable');
}


function deleteSheet(sheetId){
	$("#workspace").children('[sheet-id="' + sheetId + '"]').remove();
	$("#sheetList").children('[sheet-id="' + sheetId + '"]').remove();
}

function copySheet(sheetId){
	var text = $('[sheet-id="' + sheetId + '"]').find(".textarea").text();
	var addSheetId = addSheet();
	$('[sheet-id="' + addSheetId + '"] >> .textarea').text(text);
	if(text.length > 10) text = text.substr(0, 10) + "...";
	$("#sheetList")
		.find('[sheet-id="' + addSheetId + '"] > .title')
		.text(text);
}

function updateSheet(sheetId){

	var text = $('[sheet-id="' + sheetId + '"]').find(".textarea").text();
	if(text.length > 10) text = text.substr(0, 10) + "...";
	$("#sheetList")
		.find('[sheet-id="' + sheetId + '"] > .title')
		.text(text);
}

// Util function ---------------------------
function getSheet(sheetId){

	return	'<div class="sheet" sheet-id="' + sheetId + '">\
				<div class="head">\
					<div class="delete icon ui-icon ui-icon-closethick"></div>\
					<div class="lock icon ui-icon ui-icon-pin-w">a</div>\
				</div>\
				<div class="body">\
					<div class="textarea" contenteditable="true"></div>\
				</div>\
			</div>';
}

function getSheetListItem(sheetId){

	return 	'<li class="sheetListItem" sheet-id="' + sheetId + '">\
				<div class="title"></div>\
				<div class="date">last update date : <span class="MMddhhmm">a</span></div>\
				<div class="copy">Copy</div>\
				<div class="lock">Lock</div>\
				<div class="delete">Delete</div>\
			</li>';
}

function getUUID(){
    var S4 = function(){
    	return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}

dateFormat = {
  fmt : {
    "yyyy": function(date) { return date.getFullYear() + ''; },
    "MM": function(date) { return ('0' + (date.getMonth() + 1)).slice(-2); },
    "dd": function(date) { return ('0' + date.getDate()).slice(-2); },
    "hh": function(date) { return ('0' + date.getHours()).slice(-2); },
    "mm": function(date) { return ('0' + date.getMinutes()).slice(-2); },
    "ss": function(date) { return ('0' + date.getSeconds()).slice(-2); }
  },
  format:function dateFormat (date, format) {
    var result = format;
    for (var key in this.fmt)
      result = result.replace(key, this.fmt[key](date));
    return result;
  }
};
