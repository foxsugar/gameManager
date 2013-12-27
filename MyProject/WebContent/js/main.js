$(document).ready(function(){
	$('#menu').accordion({    
		onSelect:function(title,index){
			if(index == 0){
				addStaticDb();
			}
		}
	});
	/**
	 * 静态数据切换处理
	 */
	$('#tabs').tabs({
		 onSelect:function(title,index){
			 //dgId = "#"+$('#tabs').tabs('getSelected').find(".datagrid-view:first").children("table").attr("id");
			// dgId = "#"+$('#tabs').tabs('getSelected').find(".datagrid-view:first").children("table").attr("id");
			 //console.log($(dgId).datagrid('endEdit',index_dg));
			 if(nowTitle != title){
				 initRow();
			 }
			 nowTitle = title;
		 },
		 onLoad:function(){
			 initRow();
		} 
	});
	/**
	 * 静态导航
	 */
	$(".staticDb").live("click",function(){
		//var title = $(this).text();
		var title = $(this).attr("rel");
		var url = $(this).attr("url");
		selectTab(title, url);
	});
});
function selectTab(title,url){
	if($('#tabs').tabs('exists',title)){
		$('#tabs').tabs('select', title);
	}else{
		$('#tabs').tabs('add',{
			title:title,
			href:formatUrl(url),
			closable:true,
			extractor:function(data){
				data = $.fn.panel.defaults.extractor(data);
				var tmp = $('<div></div>').html(data);
				data = tmp.find('#content').html();
				tmp.remove();
				return data;
			}
		});
	}
}
function searchResult(_this,prex,tarId){
	if(tarId != undefined){
		dgId = tarId;
	}
	var cur_url = formatUrl($(_this).attr("cur_url"));//当前的url/返回的url
	var search_url = formatUrl($(_this).attr("search_url"));//查询url
	if($(_this).attr("search_url") == undefined){
		search_url = cur_url;
	}else if($(_this).attr("cur_url") == undefined){
		cur_url = search_url;
	}
	var parameters = "?";
	var inputs = $(_this).parent().find("input[name^='"+prex+"']");
	if(inputs.length>0){
		for(var i= 0;i < inputs.length;i++){
			if(i > 0){
				parameters += "&";
			}
			parameters += inputs.eq(i).attr("name") + "="+ encodeURI(inputs.eq(i).val(),"UTF-8") ;
		}
	}
	var selects = $(_this).parent().find("select[name^='"+prex+"']");
	if(selects.length == 0){
		selects = $(_this).parent().find("select[comboname^='"+prex+"']");
	}
	if(selects.length > 0){
		for(var i= 0;i < selects.length;i++){
			if(selects.eq(i).is(":hidden")){
				continue;
			}
			if(i > 0 || inputs.length > 0){
				parameters += "&";
			}
			parameters += selects.eq(i).attr("name") + "="+encodeURI(selects.eq(i).val(),"UTF-8");
		}
	}
	$(dgId).datagrid({
		url:search_url+parameters,
		pageNumber:1,
		loader:myLoader
	});
	if($(_this).parent().find(".static_db_back").length <= 0){
		$('<a href="#" class="easyui-linkbutton static_db_back"></a>').appendTo($(_this).parent());
		$(_this).parent().find(".static_db_back").linkbutton({
			iconCls: 'icon-back',
			text:'返回',
			plain:true
		});
		$(_this).parent().find(".static_db_back").bind('click',function(){
			$(dgId).datagrid({
				url:cur_url
			});
			$("#character_name").val("");
			$("#character_level").val("");
			$(this).remove();
		});
	}
	$(_this).focus();
}


/**
 * 获得项目绝对url
 * @returns
 */
function formatUrl(url){
	if(url == undefined){
		return undefined;
	}
	var basePath = $(":input[name='basePath']").eq(0).val();
	if(dataValidation.isURL(url) && url.search(/http/) != -1){
		return url;
	}else if(url.charAt(0) == '/'){
		return basePath+ url;
	}else{
		return basePath+"/"+ url;
	}
}
//////function
function addStaticDb(){
	$("#staticDb").html("");
	$.get(formatUrl("/db/getAlltable"),function(json){
		$(json).each(function(){
			if(this.comment !=  ""){
				var comment = this.comment;
				if(comment.length > 5){
					comment = comment.substring(0,5) + "...";
				}
				$('<a class="staticDb" title="'+this.comment+'('+this.name+')" url="db/getTable/'+this.name+'" rel="'+this.comment+'">'+comment+'</a>').appendTo($("#staticDb"));
			}else{
				$('<a class="staticDb" title="'+this.name+'" url="db/getTable/'+this.name+'" rel="'+this.name+'">'+this.name+'</a>').appendTo($("#staticDb"));
			}
		});
	});
} 
	/*$(dgId).datagrid({
		iconCls: 'icon-edit',
		singleSelect: true,
		remoteSort:false,
		rownumbers:true,
		url:url,
		onClickRow: onClickRow,
		pagination:true,
		loadFilter:pagerFilter,
		pageSize:10,
		rowStyler: rowStyler,
		onHeaderContextMenu:onHeaderContextMenu,
		onSortColumn:onSortColumn
	});*/

/**
 * 静态数据table有关代码
 */
var dgId;
var nowTitle;
var editIndexMap = new Map();
function endEditing(){
	if (editIndexMap.get(dgId) == undefined){return true;};
	if ($(dgId).datagrid('validateRow', editIndexMap.get(dgId))){
		$(dgId).datagrid('endEdit', editIndexMap.get(dgId));
		editIndexMap.put(dgId,undefined);
		return true;
	} else {
		return false;
	}
}
function initRow(){//初始化
	dgId = "#"+$('#tabs').tabs('getSelected').find(".datagrid-view:first").children("table").attr("id");
	 refreshRow();
}
function refreshRow(){//刷新
	if(dgId == "#undefined"){
		return;
	}
	dgId = "#"+$('#tabs').tabs('getSelected').find(".datagrid-view:first").children("table").attr("id");
	var size = $(dgId).datagrid('getRows').length;
	for(var i = 0; i < size;i++){
		if ($(dgId).datagrid('validateRow', i)){
			$(dgId).datagrid('endEdit', i);
		} 
	}
	rowStyler(editIndexMap.get(dgId), $(dgId).datagrid('selectRow', editIndexMap.get(dgId)));
}
function onClickRow(index){//点击事件处理
	dgId = "#"+$(this).parent().children("table").attr("id");
	if (editIndexMap.get(dgId) != index){
		if (endEditing()){
			$(dgId).datagrid('selectRow', index)
					.datagrid('beginEdit', index);
			 editIndexMap.put(dgId,index);
		} else {
			$(dgId).datagrid('selectRow', editIndexMap.get(dgId));
		}
	}else{
		editIndexMap.put(dgId,-1);
		$(dgId).datagrid('selectRow', index)
		.datagrid('beginEdit', index);
		refreshRow();
	}
}
function appendData(){//增加table
	if (endEditing()){
		$(dgId).datagrid('appendRow',{});
		editIndexMap.put(dgId,$(dgId).datagrid('getRows').length-1);
		$(dgId).datagrid('selectRow', editIndexMap.get(dgId))
				.datagrid('beginEdit',  editIndexMap.get(dgId));
	}
}
function modifyData(){
	var row = $(dgId).datagrid('getSelected');
	//updateTab('equipment/toUpdateEquipment?id='+row.id);
	openNewWindow('equipment/toUpdateEquipment?id='+row.id, "修改装备信息");
}
function removeSingleData(_){//单选移除table
	var row = $(dgId).datagrid('getSelected');
	if(row == null){
		return;
	}else if(row.id == undefined){
		$(dgId).datagrid('cancelEdit', editIndexMap.get(dgId))
		.datagrid('deleteRow', editIndexMap.get(dgId));
		editIndexMap.put(dgId,undefined);
		$(dgId).datagrid('acceptChanges');
		return;
	}
	if(confirm("确认删除id为"+(row.id)+"的数据吗？")){
		$.get(formatUrl($(_).attr("delurl")),{id:row.id},function(data){
			if(data.status == 'succ'){
				appendTip("数据删除成功!");
				$(dgId).datagrid('cancelEdit', editIndexMap.get(dgId))
				.datagrid('deleteRow', $(dgId).datagrid('getRowIndex',row));
				editIndexMap.put(dgId,undefined);
				$(dgId).datagrid('acceptChanges');
			}else{
				var data = eval('(' + data + ')');
				appendTip(data.error);
			}
		});
	}
}
/**
 * 添加错误提示
 * @param tip
 */
function appendError(tip){
	$.messager.alert('错误信息',tip);
	/*
	var obj = $("body").find(".tipMsg:first");
	if(obj.length > 0){
		obj[0].remove();
	}
	obj = $('<div class="tipMsg" >'+tip+'</div>');
	obj.insertBefore($(dgId).datagrid('getPanel'));
	obj.delay(5000).fadeOut(1000,function(){
		obj.remove();
	});*/
}
/**
 * 添加提示
 * @param tip
 */
function appendTip(tip){
	$.messager.show({
		title:'提示',
		msg:tip,
		showType:'fade',
		style:{
			right:'',
			bottom:''
		}
	});
	/*
	var obj = $("body").find(".tipMsg:first");
	if(obj.length > 0){
		obj[0].remove();
	}
	obj = $('<div class="tipMsg" >'+tip+'</div>');
	obj.insertBefore($(dgId).datagrid('getPanel'));
	obj.delay(5000).fadeOut(1000,function(){
		obj.remove();
	});*/
}
/**
 * 行样式
 * @param index
 * @param row
 * @returns {String}
 */
function rowStyler(index,row){
	var rows = $(dgId).datagrid('getChanges');
	var background = '';
	$(rows).each(function(){
		if(this.id == row.id){
			background ='background: none repeat scroll 0 0 #ffcc00;';
		}
	});
	return background;
}
/**
 * 列样式
 * @param value
 * @param row
 * @param index
 */
function cellStyler(value,row,index){
	if (value == '(无数据)'){
		return 'color:red;';
	}
	if (value == '(数据格式错误)'){
		return 'background-color:red;';
	}
}
$(".static_db_save").live("click",function(){//保存table--将json对象传到后台处理
	refreshRow();
	if($(this).linkbutton("options").disabled){
		return
	}
	if (endEditing()){
		var rows = $(dgId).datagrid('getChanges');
		if(rows.length > 0){
			//数据去除空数据
			for(var i in rows){
				var allIsEmpty = true;
				for(var t in rows[i]){
					if(rows[i][t] == "(数据格式错误)"){
						return;
					}else if(rows[i][t] != ""){
						allIsEmpty = false;
					}
				}
				if(allIsEmpty){
					appendTip("<b>空数据</b>不能提交,请修改后再提交!");
					return;
				}
			}
			if(rows.length <= 0 || !confirm(rows.length+' 条数据将要被修改')){
				return
			}
			var json = $.toJSON(rows);
			json = encodeURI(json);
			var linkbutton = $(this);
			linkbutton.linkbutton("disable");
			$.ajax({
			   type: "POST",
			   url: formatUrl(linkbutton.attr("saveurl")),
			   data: json,
			   success: function(data){
				   if(data.status == 'succ'){
					   appendTip("数据保存成功");
					   refreshTable(linkbutton.attr("cur_url"));
					   $(dgId).datagrid('acceptChanges');
				   }else{
					   appendTip(data);
				   }
				   linkbutton.linkbutton("enable");
			   }
			});
		}
	}
	refreshRow();
});
/**
 * 刷新table
 * @param url
 */
function refreshTable(url){
	refreshRow();
	 $(dgId).datagrid("reload");
	 reject();
}
function reject(){
	refreshRow();
	$(dgId).datagrid('rejectChanges');
	$(dgId).datagrid('acceptChanges');
}
function getChanges(){
	refreshRow();
	var rows = $(dgId).datagrid('getChanges');
	appendTip(rows.length+"条数据将要被修改");
	return rows;
}
function onHeaderContextMenu(e,field){
	e.preventDefault();
	 var grid = $(this);/* grid本身 */  
	     var headerContextMenu = this.headerContextMenu;/* gri N单对象 */  
	     if (!headerContextMenu) {  
	        var tmenu = $('<div style="width:100px;"></div>').appendTo('body');  
        var fields = grid.datagrid('getColumnFields');  
	         for ( var i = 0; i < fields.length; i++) {  
	             var fildOption = grid.datagrid('getColumnOption', fields[i]);  
	             if(fields[i] == 'id'){
	            	 continue;
	             }
	             if (!fildOption.hidden) {  
	                 $('<div iconCls="icon-ok" field="' + fields[i] + '"/>').html(fildOption.title).appendTo(tmenu);  
	             } else {  
	                 $('<div iconCls="icon-empty" field="' + fields[i] + '"/>').html(fildOption.title).appendTo(tmenu);  
	            }  
	         }  
	         headerContextMenu = this.headerContextMenu = tmenu.menu({  
	             onClick : function(item) {  
	                 var field = $(item.target).attr('field');  
	                 if (item.iconCls == 'icon-ok') {  
	                     grid.datagrid('hideColumn', field);  
	                    $(this).menu('setIcon', {  
	                         target : item.target,  
	                         iconCls : 'icon-empty'  
	                     });  
	                 } else {  
	                     grid.datagrid('showColumn', field);  
	                     $(this).menu('setIcon', {  
	                         target : item.target,  
	                         iconCls : 'icon-ok'  
	                     });  
	                 }  
	             }  
	         });  
	     }  
	     headerContextMenu.menu('show', {  
	         left : e.pageX,  
	         top : e.pageY  
	     });  
}

function onSortColumn(sort,order){
}
function sorter(a,b){
	if(dataValidation.isNumOrFloat(a) && dataValidation.isNumOrFloat(b)){
		return a - b;
	}else{
		if ($.trim(a).length == $.trim(b).length){
			for(var i = 0;i<$.trim(a).length;i++ ){
				if($.trim(a).charAt(i) != $.trim(b).charAt(i)){
					return $.trim(a).charCodeAt(i)- $.trim(b).charCodeAt(i);
				}
			}
			return 0;
		} else {  
			return ($.trim(a).length>$.trim(b).length?1:-1);  
		} 
	}
}
function onRowContextMenu(e, rowIndex, rowData){
	e.preventDefault(); 
	dgId = "#"+$(this).parent().children("table").attr("id");
	$(dgId).datagrid("selectRow",rowIndex);
	var mm = dgId.replace("dg","mm");
	  $(mm).menu('show', {
	      left:e.pageX,
	      top:e.pageY
	  });	
}
function onRowContextMenuAutoMenu(e, rowIndex, rowData){
	e.preventDefault(); 
	$(dgId).datagrid("selectRow",rowIndex);
	var mm = dgId.replace("dg","mm");
	var row = $(dgId).datagrid("getSelected");
	var status = row.is_freeze;
	if(status == 0){
		status = "冻结";
	}else{
		status = "解冻";
	}
	var item = $(mm).menu('findItem', "freeze");  
	if(item == null){
		item = $(mm).menu('findItem', "冻结");
		if(item == null){
			item = $(mm).menu('findItem', "解冻");
		}
	}
	$(mm).menu('setText', {
		target: item.target,  // the parent item element
		text: status
	});
	 $(mm).menu('show', {
	      left:e.pageX,
	      top:e.pageY
	  });
}
/**
 * 静态数据的分页
 */
function pagerFilter(data){
	if (typeof data.length == 'number' && typeof data.splice == 'function'){	// is array
		data = {
			total: data.length,
			rows: data
		};
	}
	var dg = $(this);
	var opts = dg.datagrid('options');
	var pager = dg.datagrid('getPager');
	pager.pagination({
		onSelectPage:function(pageNum, pageSize){
			opts.pageNumber = pageNum;
			opts.pageSize = pageSize;
			pager.pagination('refresh',{
				pageNumber:pageNum,
				pageSize:pageSize
			});
			dg.datagrid('loadData',data);
		}
	});
	if (!data.originalRows){
		data.originalRows = (data.rows);
	}
	var start = (opts.pageNumber-1)*parseInt(opts.pageSize);
	var end = start + parseInt(opts.pageSize);
	data.rows = (data.originalRows.slice(start, end));
	return data;
}
$.extend($.fn.datagrid.defaults.editors, {
	date: {
	    init: function(container, options){
		    var input = $('<input type="text" class="datagrid-editable-input">').appendTo(container);
		    return input;
	    },
	    destroy: function(target){
	    	$(target).remove();
	    },
	    getValue: function(target){
	    	if($(target).val() != "null" && $(target).val() != "(无数据)" && !dataValidation.isDate($(target).val())){
	    		$(target).val("(数据格式错误)");
	    	}	
	    	return $(target).val();
	    },
	    setValue: function(target, value){
	    	if(value=="(数据格式错误)"){
	    		value = "";
	    	}
	    	$(target).val(value);
	    },
	    resize: function(target, width){
	    	$(target)._outerWidth(width);
	    }
    },
    number:{
    	init: function(container, options){
		    var input = $('<input type="text" class="datagrid-editable-input">').appendTo(container);
		    return input;
	    },
	    destroy: function(target){
	    	$(target).remove();
	    },
	    getValue: function(target){
	    	var num = $(target).val().replace(".0","");
	    	if(num != "null" && num != "(无数据)" && !dataValidation.isNum(num)){
	    		$(target).val("(数据格式错误)");
	    	}
	    	return num;
	    },
	    setValue: function(target, value){
	    	if(value=="(数据格式错误)"){
	    		value = "";
	    	}
	    	$(target).val(value);
	    },
	    resize: function(target, width){
	    	$(target)._outerWidth(width);
	    }
    },
    double:{
    	init: function(container, options){
		    var input = $('<input type="text" class="datagrid-editable-input">').appendTo(container);
		    return input;
	    },
	    destroy: function(target){
	    	$(target).remove();
	    },
	    getValue: function(target){
	    	if($(target).val() != "null" && $(target).val() != "(无数据)" && !dataValidation.isDouble($(target).val())){
	    		$(target).val("(数据格式错误)");
	    	}	
	    	return $(target).val();
	    },
	    setValue: function(target, value){
	    	if(value=="(数据格式错误)"){
	    		value = "";
	    	}
	    	$(target).val(value);
	    },
	    resize: function(target, width){
	    	$(target)._outerWidth(width);
	    }
    },
    boolean:{
    	init: function(container, options){
		    var input = $('<input type="text" class="datagrid-editable-input">').appendTo(container);
		    return input;
	    },
	    destroy: function(target){
	    	$(target).remove();
	    },
	    getValue: function(target){
	    	if($(target).val() != "null" && $(target).val() != "(无数据)" && !dataValidation.isBoolean($(target).val())){
	    		$(target).val("(数据格式错误)");
	    	}	
	    	return $(target).val();
	    },
	    setValue: function(target, value){
	    	if(value=="(数据格式错误)"){
	    		value = "";
	    	}
	    	$(target).val(value);
	    },
	    resize: function(target, width){
	    	$(target)._outerWidth(width);
	    }
    }
 });
/**
 * 打开一个新的tab
 * @param title
 * @param url
 */
function addNewTab(title,url){
	if($('#tabs').tabs('exists',title)){
		$('#tabs').tabs('select', title);
	}else{
		$('#tabs').tabs('add',{
			title:title,
			href:formatUrl(url),
			closable:true,
			extractor:function(data){
				data = $.fn.panel.defaults.extractor(data);
				var tmp = $('<div></div>').html(data);
				data = tmp.find('#content').html();
				tmp.remove();
				return data;
			}
		});
	}
}
/**
 * 在当前的tab中重新加载数据
 */
function updateTab(url){
	var tab = $('#tabs').tabs('getSelected');  // get selected panel
	$('#tabs').tabs('update', {
		tab: tab,
		options: {
			title: this.title,
			href: formatUrl(url) // the new content URL
		}
	});
}
function myLoader(param,success,error){
		var that = $(this);
	    var opts = that.datagrid("options");  
	    if (!opts.url) {  
	        return false;  
	    }  
	    $.ajax({  
            type : opts.method,  
            url : opts.url,  
            data : param,  
            dataType : "json",  
            success : function (data) {  
                success(bulidData(data));  
            },  
            error : function () {  
                error.apply(this, arguments);  
            }  
        });  
	      
	    function bulidData(data) {
	        var temp = $.extend({},data);  
	        var rows = data.rows; 
	        if(rows == undefined){
	        	for(var i in temp){
	        		appendTip(temp[i]);
	        	}
	        	return [];
	        }
	        return temp;  
	    } 
}

/**
 * 日期格式化
 * @param date
 * @returns {String}
 */
function myformatter(date){
    var y = date.getFullYear();
    var m = date.getMonth()+1;
    var d = date.getDate();
	var hh = date.getHours();
	var mm = date.getMinutes();
	var ss = date.getSeconds();		
    return y+'-'+(m<10?('0'+m):m)+'-'+(d<10?('0'+d):d)+" "+(hh<10?('0'+hh):hh)+":"+(mm<10?('0'+mm):mm)+":"+(ss<10?('0'+ss):ss);
}
function myparser(s){
    if (!s) return new Date();
    var ss = (s.split('-'));
    var y = parseInt(ss[0],10);
    var m = parseInt(ss[1],10);
    var d = parseInt(ss[2],10);
    if (!isNaN(y) && !isNaN(m) && !isNaN(d)){
        return new Date(y,m-1,d);
    } else {
        return new Date();
    }
}

function closeWindow(targetId){
	var rows = $(targetId).datagrid("getSelections");
	$(targetId).datagrid('acceptChanges');
	var value = "";
	var j = 0;
	for(var i in rows){
		if($.trim(rows[i].num) == '' || rows[i].num == 0){
			rows[i].num = 1;
		}
		if(j > 0){
			value += ";";
		}
		value += rows[i].item_no + ","+rows[i].num;
		j++;
	}
	window.returnValue = value;
	window.close();
}
function itemView(itemType,itemNo){
	openNewWindow("db/getItemEntity/"+itemType+"/"+itemNo,"道具静态信息");
}
function openNewWindow(url,title){
	var div = $("#temp");
	if(div.length <= 0 ){
		div = $("<div>",{id:"temp"});
		div.appendTo("body");
	}
	div.window({
		width:800,
		height:600,
		title:title,
		collapsible:false,
		minimizable:false,
		maximizable:false,
		modal:true,
		href:formatUrl(url)
	});
}
function openDialog(url){
	return window.showModalDialog(formatUrl(url),"dialogWidth=200px;dialogHeight=100px;status:no;location:no;menubar:no");
}
//导入数据相关
function importDB(tableName){
	dgId = "#"+$('#tabs').tabs('getSelected').find(".datagrid-view:first").children("table").attr("id");
	$(dgId.replace("dg","ff")).form('submit',{
		 success:function(data){
			 $(dgId.replace("dg","ff")).children("input:first").val("");
			 openNewWindow("importDb?tableName="+tableName+"&fileName="+data, "批量导入");
		}
	});
}
//导入数据进度条
function progressbar(){
	var progressbar = $("#progressbar");
	if(progressbar.length <= 0 ){
		progressbar = $("<div>",{id:"progressbar",width:"400px"});
		progressbar.appendTo($(dgId.replace("dg", "tb")));
	}
	progressbar.progressbar({value:0});
	return progressbar;
}
