$(function() {

	// ローカルストレージのdataをロードする
	load();

	// 操作後にシステムの状態をローカルストレージに保存する
	$("body").on("mouseup keyup", function(){
		save()
	})


	/* シート内イベント */
	// 削除ボタン
	$("#workspace").on("click", ".delete", function(){
		var selectedSheetId = $(this).parents(".sheet").attr("sheet-id");
		deleteSheet(selectedSheetId);
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
	// シート内のテキストとsheetListItem内のテキストを同期させる
	// 同期させる文字は"10文字以下""1行目のみ"
	$("#workspace").on("keyup", ".textarea", function(){
		var selectedSheetId = $(this).parents(".sheet").attr("sheet-id");
		updateSheet(selectedSheetId);
		setNow(selectedSheetId)
	})

	/* ドロワーメニューイベント */
	// シートリストアイテムをクリック
	// シートを最前面に表示する
	$("#sheetList").on("click", ".sheetListItem", function(){
		var selectedSheetId = $(this).attr("sheet-id");
		toForeground(selectedSheetId)
	})
	$('[name=font-size]').on('change', function(){
		$('body').css('font-size', $(this).val());
	})
	$('[name=font-family]').on('change', function(){
		$('body').css('font-family', $(this).val());
	})

	/* ツールバーアイコン */
	// シート追加ボタン
	$(".add").on("click", function(){
		var addSheetId = getUUID();
		addSheet(addSheetId);
		toForeground(addSheetId)
		setNow(addSheetId)
	})
	// ドロワーメニュー
	$(".drawer-handle").sidr({
		speed: 100,
		body: "section#toolbar"
	});

	/* コンテキストメニュー */
	$("#workspace").contextmenu({
	    delegate: ".sheet",
	    menu: [
	        {title: "Copy", cmd: "copy", uiIcon: "ui-icon-copy"},
	        {title: "Delete", cmd: "delete", uiIcon: "ui-icon-trash"},
	        {title: "Lock/Unlock", cmd: "lock", uiIcon: "ui-icon-pin-s"},
            {title: "----"},
	        {title: "font-family", children: [
	            {title: "arial", action: function(){
					ui.target.parents(".sheet").css('font-family', "arial");
	            }},
	            {title: "CenturyGothic", action: function(){
					ui.target.parents(".sheet").css('font-family', "Century Gothic");
	            }},
	            {title: "Meiryo", action: function(){
					ui.target.parents(".sheet").css('font-family', "Meiryo");
	            }},
	            {title: "HiraginoMarugoPro", action: function(){
					ui.target.parents(".sheet").css('font-family', "Hiragino Maru Gothic Pro");
	            }},
            ]},
            {title: "----"},
	        {title: "font-size", children: [
	            {title: "small", action: function(event, ui){
					ui.target.parents(".sheet").css('font-size', "small");
	            }},
	            {title: "medium", action: function(event, ui){
					ui.target.parents(".sheet").css('font-size', "medium");
	            }},
	            {title: "x-large", action: function(event, ui){
					ui.target.parents(".sheet").css('font-size', "x-large");
	            }}
            ]}
	    ],
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

	/* シート<-->シートリストアイテム間のtextの同期 */
	$("#workspace").on("mousedown", ".sheet", function(){
		var selectedSheetId = $(this).attr("sheet-id");
		toForeground(selectedSheetId);
	})
});



// 共通機能 -----------------
function toForeground(sheetId){
	var numberOfSheets = $("#workspace .sheet").length
	$("#workspace").children('[sheet-id="' + sheetId + '"]').css("z-index", numberOfSheets);

	var sheets = []
	$(".sheet").each(function(i){
		sheets[i] = {
			obj: this,
			zIndex: $(this).css("z-index"),
		}
	})

	sheets.sort(function compareNumbers(a, b) {
		return a.zIndex - b.zIndex;
	});

	sheets.forEach(function(value,index){
		$(value.obj).css("z-index", index)
	});
}

function setNow(sheetId){
	var now = dateFormat(new Date(), 'MM/dd hh:mm');
	$('[sheet-id="' + sheetId + '"] .MMddhhmm').text(now);
}


// シート操作 ----------------------------------------------
function addSheet(sheetId){

	// シート追加
	$("#workspace").prepend(getSheet(sheetId));
	// シートリスト追加
	$("#sheetList").prepend(getSheetListItem(sheetId));
	// 機能付与
	$(".sheet .body").resizable({ autoHide : true });
	$(".sheet").draggable({
					disabled: false,
					handle : '.head',
					scroll : false
				})
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
	var addSheetId = getUUID();
	addSheet(addSheetId);
	$('[sheet-id="' + addSheetId + '"] .textarea').text(text);
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

// システム情報の保存機能 ---------------------------------------
function load(){
	var data = JSON.parse(localStorage.getItem("PutitData"))
	if(data !==null){
		$('[name=font-family]').val(data.config.fontFamily);
		$('body').css('font-family', data.config.fontFamily);
		$('[name=font-size]').val(data.config.fontSize);
		$('body').css('font-size', data.config.fontSize);

		data.sheets.forEach(function(sheet,index){
			addSheet(sheet.id);
			$("#workspace").children('[sheet-id="' + sheet.id + '"]')
				.css("top", sheet.top)
				.css("left", sheet.left)
				.css("z-index", sheet.zIndex)
				.find(".textarea")
					.html(sheet.text);
			$('#sheetList [sheet-id="' + sheet.id + '"] .MMddhhmm').text(sheet.lastUpdate);
			updateSheet(sheet.id);
		})
	}
}

function save(){

	console.log("saved!")
	var data = {
		config: {
			fontFamily: $('[name=font-family] option:selected').val(),
			fontSize: $('[name=font-size] option:selected').val()
		},
		sheets: []
	}

	$(".sheet").each(function(i){
		var sheetId = $(this).attr("sheet-id");
		var sheet = {
			id: sheetId,
			text: $(this).find(".textarea").html(),
			zIndex: $(this).css("z-index"),
			top: $(this).css("top"),
			left: $(this).css("left"),
			lastUpdate: $('#sheetList [sheet-id="' + sheetId + '"] .MMddhhmm').text(),
			isLock: $(this).find(".unlock").is('*')?true:false
		}
		data.sheets.push(sheet);
	})
	localStorage.setItem("PutitData", JSON.stringify(data))
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
				<div class="date">last update date : <span class="MMddhhmm"></span></div>\
			</li>';
}

function getUUID(){
    var S4 = function(){
    	return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}


function dateFormat (date, format) {
	var result = format;
	for (var key in _fmt)
		result = result.replace(key, _fmt[key](date));
	return result;
}

var _fmt = {
	"yyyy": function(date) { return date.getFullYear() + ''; },
	"MM": function(date) { return ('0' + (date.getMonth() + 1)).slice(-2); },
	"dd": function(date) { return ('0' + date.getDate()).slice(-2); },
	"hh": function(date) { return ('0' + date.getHours()).slice(-2); },
	"mm": function(date) { return ('0' + date.getMinutes()).slice(-2); },
	"ss": function(date) { return ('0' + date.getSeconds()).slice(-2); }
}
