const xfilters = {
    
	//定义全局的过滤器
	paramFilter: function(value, arg1) {
		return arg1[value];
    },
    //参数格式化 
	paramsFmt: function(code,paramsName) {
		if (code == null || code == undefined || code == '') {
            return '';
        }
        if(window.sessionStorage.filterParams != undefined){
            var filterParams = JSON.parse(window.sessionStorage.filterParams);
            var name = filterParams[paramsName][code];  
            return  name;
        }else{
            return code;
        }
        
	},
	//日期格式化
	dateFormat: function(date) {
		if ( date == null || date == undefined || date == '') {
			return date;
		} else {
			if(date.length > 9){
				return date.substring(0, 10);
			}else{
				return date;
			}
			
		}
	},
	// 数字除以一万
	converTenThousand: function(s ) {
		if (s == null || s == undefined || s == '') {
			return 0;
		}
		return s / 10000;
	},
	/* 内容截取多余的追加...	
	data  要截取的字符串
	index   截止的下标 */
	titleSub: function(date, index) {
		if (date == null || date == undefined || date == '' || date.length == undefined) {
			return date;
		} else {
			if (date.length <= index) {
				return date;
			} else {
				return date.substring(0, index) + "...";
			}
		}
	},
	/* 内容截取去除中间
	data  要截取的字符串
	index   截止的长度 */
	middleSub: function(data, subLength) {
		if (data == null || data == undefined || data == '') {
			return data;
		}
		var dataLength = data.length;
		if (data == null || data == undefined || data == '') {
			return data;
		} else {
			if (dataLength <= subLength) {
				return data;
			} else {
				var surplusLength = dataLength - subLength;
				subLength = surplusLength / 2;
				return data.substring(0, subLength) + "..." + data.substring(surplusLength + subLength, dataLength);
			}
		}
	},
	/* 内容截取
	data  要截取的字符串
	index   截止的下标 
	*/
	textSub: function(date, index) {
		if (date == null || date == undefined || date == '') {
			return date;
		} else {
			if (date.length <= index) {
				return date;
			} else {
				return date.substring(0, index);
			}
		}
	},
	//时间的截取
	timeFormat: function(date) {
		if (date == null || date == undefined || date == '') {
			return date;
		} else {
			return date.substring(10, 19);
		}
	},
	//根据请假类型显示什么日期 
	getDateTypeByLeaveType: function(name) {
		if (name == null || name == undefined || name == '') {
			return '';
		}
		if ((name.indexOf("流产假") != -1) || (name.indexOf("产假") != -1 || name.indexOf("哺乳假") != -1 || name.indexOf("婚假") !=
				-1 || name.indexOf("护理假") != -1)) {
			if (name.indexOf("婚假") != -1) {
				return '结婚日期';
			} else {
				return '出生日期';
			}
		}
	},
	// 数字格式化
	toThousands: function(s , n) {
		if (s == null || s == undefined || s == '') {
			return '0';
		}
		s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";  
		var l = s.split(".")[0].split("").reverse(), r = s.split(".")[1];  
		var t = "";  
		for (var i = 0; i < l.length; i++) {  
			t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");  
		}  
		var num = ""+t.split("").reverse().join("")  + (r == undefined ? '' : ("." + r));
		return num == 'NaN' ? 0 : num.replace('-,','-');
	},
	// 字符串替换  
	replace: function(params , ref, replace,suffix) {
		if(params == ref){
			return replace;
		}else{
			return params + suffix;
		}
	},
	// 名字格式化 让名字只显示两个字 规则 三个字以上  只显示后两个
	nameFmt: function(name) {
		if (name == null || name == undefined || name == '') {
			return '';
		}
		if(name.length <= 2){
			return name;
		}else{
			return name.substr(name.length-2);
		}
	},
	// 附件标识图片格式化
	attTypeSrcFmt: function(type) {
		var textSrc = "/static/main/upload/txt.png";
		var imgSrc = "/static/main/upload/img.png";
		var excelSrc = "/static/main/upload/excel.png";
		var wordSrc = "/static/main/upload/word.png";
		var rarSrc = "/static/main/upload/rar.png";
		var zipSrc = "/static/main/upload/zip.png";
		var pptSrc = "../../../static/main/upload/ppt.png";
		var fileSrc = "../../../static/main/upload/file.png";
		var src = '';
		if(type == 'xls' || type == 'xlsx'){
			return excelSrc;
		}else if(type == 'doc' || type == 'docx'){
			return wordSrc;
		}else if(type == 'jpg' || type == 'png'){
			return imgSrc;
		}else if(type == 'txt'){
			return textSrc;
		}else if(type == 'rar'){
			return rarSrc;
		}else if(type == 'zip'){
			return zipSrc;
		}else if(type == 'ppt'){
			return pptSrc;
		}else{
			return fileSrc;
		}
	},
	// //手机隐藏中间五位
	// mobileFilter: function(val){
	// 	var n = val.split(';');
	// 	if(n.length>1){
	// 		var str = '';
	// 		for (let index = 0; index < n.length; index++) {
	// 			str += n[index].substring(0,3)+"*****"+n[index].substring(n[index].length-3)+' ';
	// 		}
	// 		return str;
	// 	}else{
	// 		return n[0].substring(0,3)+"*****"+n[0].substring(n[0].length-3);
	// 	}
	// },
	// //身份证号码隐藏中间12位
	// idCardFilter: function(val){
	// 	var reg = /^(.{3}).*(.{3})$/;
	// 	return val.replace(reg,'$1************$2');
	// },

	//手机、身份证隐码过滤
	Cryptography: function(val,name){
		if(name == "mobile"){
			if(val == null || val == '' || val == undefined){
				return '';
			}
			val = val.replace( /[\u3002\uff1b\uff0c\uff1a\u201c\u201d\uff08\uff09\u3001\uff1f\u300a\u300b]/g,';');
			var n = val.split(';');
			if(n.length>1){
				var str = '';
				for (let index = 0; index < n.length; index++) {
					str += n[index].substring(0,3)+"*****"+n[index].substring(n[index].length-3)+' ';
				}
				return str;
			}else{
				return n[0].substring(0,3)+"*****"+n[0].substring(n[0].length-3);
			}
		}else if(name == "idCard"){
			if(val == null || val == '' || val == undefined){
				return '';
			}
			var reg = /^(.{3}).*(.{3})$/;
			return val.replace(reg,'$1************$2');
		}
	}
}
export default xfilters;
