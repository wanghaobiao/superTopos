import Vue from 'vue'
import global from './global'
import request from 'axios'
Vue.prototype.screenHeight =  ''//屏幕高度
Vue.prototype.screenWidth = ''//屏幕宽度
Vue.prototype.screenSize = {}//屏幕尺寸


/**********************滑动分页的公共方法开始*********************/
Vue.prototype.onLoad = function(_this) {
    this.postData(_this.pageLoad.url,_this.pageParams).then(response => {
        var data = response.data;
        if (data.code == 200) {
            var list = response.data.data;
            _this.pageLoad.list = this.pageLoad.list.concat(list);
            _this.pageLoad.loading = false;
            if(_this.pageParams.pageNo == 1){
                _this.eventName = "load";
            }
            _this.pageParams.pageNo = this.pageParams.pageNo + 1;

            if(list.length != _this.pageParams.pageNum){
                _this.pageLoad.finished = true;
            }

        }
    })
}
Vue.prototype.onRefresh = function(_this) {

    _this.pageParams.pageNo = 1;
    _this.pageParams.pageNum = 10;
    _this.pageLoad.finished = false;
    _this.pageLoad.loading = true;
    _this.pageLoad.list = [];
    if (_this.pageLoad.refreshing) {
        _this.pageLoad.refreshing = false;
    }
    _this.onLoad(_this);
}
//分页必须调用的方法
Vue.prototype.handleSizeChange = function(val) {

},
/**********************滑动分页的公共方法结束*********************/


/**********************http访问方法开始*********************/

Vue.prototype.getHttp = function(url,data) {
    return new Promise((resolve) => {
        this.$axios.get(url).then(result => {
            this.resultDealWith(result,resolve);
        }, (response) => {
        })
    });
}


Vue.prototype.postHttp = function(url,data) {
    return new Promise((resolve) => {
        this.$axios.post(url,data).then(result => {
            this.resultDealWith(result,resolve);
        }, (response) => {
        })
    });
}

Vue.prototype.resultDealWith = function(result,resolve) {
    if(this.isEmpty(result.code)){
        resolve(result);
    }else if(result.code == 200){
        if(this.isNotEmpty(result.message)){
            this.$message.success( result.message);
            resolve({code : 200});
        }else{
            resolve(result.data);
        }
    }else if(result.code == 308){
        this.$message.warning( result.message);
    }else if(result.code == 402){
        this.$router.push("/login/login");
    }else if(result.code == 505){
        this.$message.error( result.message);
        console.error(JSON.stringify(result.errorMag));
        resolve({code : 505});
    }

}
/**********************http访问方法结束*********************/
/**
 * Created by Schon on 2018/9/13 0013.
 */
//设置cookie
Vue.prototype.setCookie = function (key,value){
    var exdate = new Date(); //获取时间
    exdate.setTime(exdate.getTime() + 1 * 60 * 60 * 1000 ); //保存的天数，我这里写的是1小时
    //字符串拼接cookie
    window.document.cookie = key + "=" + value + ";path=/;expires=" + exdate.toGMTString();
};
//读取cookie
Vue.prototype.getCookie = function (param){
    var c_param = '';
    if (document.cookie.length > 0) {
      var arr = document.cookie.split('; '); //这里显示的格式需要切割一下自己可输出看下
      for (var i = 0; i < arr.length; i++) {
        var arr2 = arr[i].split('='); //再次切割
        //判断查找相对应的值
        if (arr2[0] == param) {
          c_param = arr2[1];
          //保存到保存数据的地方
        }
      }
      return c_param;
    }
};
// 清除所有的cookie
Vue.prototype.delCookie= function() {
    var cookies = document.cookie.split(";");
    for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i];
      var eqPos = cookie.indexOf("=");
      var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie =
        name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    }
    if (cookies.length > 0) {
      for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        var domain = location.host.substr(location.host.indexOf("."));
        document.cookie =
          name +
          "=;expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=" +
          domain;
      }
    }
  }
  

/**********************缓存的公共方法开始*********************/
//刷新缓存
Vue.prototype.refreshParams = function (message){
    this.getHttp("/api/params/refreshParams").then(result => {
        window.sessionStorage.filterParams = JSON.stringify(result.filterParams);
        window.sessionStorage.optionsParams = JSON.stringify(result.optionsParams);
        window.sessionStorage.optionsBaseParams = JSON.stringify(result.optionsBaseParams);
        if(this.isNotEmpty(message)){
            this.$message.success( message);
        }
    });
}
//获取缓存
Vue.prototype.getOptions = function (paramsName){
    if(window.sessionStorage.optionsParams){
        var optionsParams = JSON.parse(window.sessionStorage.optionsParams);
        return optionsParams[paramsName];
    }
    return '';

}

//获取缓存
Vue.prototype.getBaseOptions = function (){
    var optionsBaseParams = JSON.parse(window.sessionStorage.optionsBaseParams);
    return optionsBaseParams;
}

//获取缓存
Vue.prototype.getParams = function (){
    this.getHttp("/api/params/getParams").then(result => {
        window.sessionStorage.filterParams = JSON.stringify(result.filterParams);
        window.sessionStorage.optionsParams = JSON.stringify(result.optionsParams);
        window.sessionStorage.optionsBaseParams = JSON.stringify(result.optionsBaseParams);
    });
}
/**********************缓存的公共方法结束*********************/

/**********************云之家相关方法开始*********************/

//从云之家获取openId
Vue.prototype.userInfoInit = function (){
    if(this.isNotEmpty(global.localOpenId)){
        setStore({
            name: 'access_token',
            content: global.localOpenId,
            type: 'access_token'
        });

        global.userInfo.openId = global.localOpenId;
        this.getData("/mas/overview/getUserInfo", {openId:global.localOpenId}).then(value => {
            console.log('当前登陆人=====>'+JSON.stringify(global.userInfo));
            global.userInfo = value.data.userInfo;
        });
    }else{
        var _this = this;
        qing.ready(function () {
            qing.call('getPersonInfo', {
                success : function(res){
                    var openId = res.data.openId;
                    setStore({
                        name: 'access_token',
                        content: openId,
                        type: 'access_token'
                    });
                    global.userInfo.openId = openId;
                    _this.getData("/mas/overview/getUserInfo", {openId:openId}).then(value => {
                        global.userInfo = value.data.userInfo;
                        if(_this.isEmpty(global.userInfo) || (_this.isNotEmpty(global.userInfo) && _this.isEmpty(global.userInfo.id))){
                            return;
                        }
                    });
                }
            });
        })
    }
}
/**********************云之家相关方法结束*********************/
Vue.prototype.copy = function (data) {
    let url = data
    let oInput = document.createElement('input')
    oInput.value = url
    document.body.appendChild(oInput)
    oInput.select() // 选择对象
    document.execCommand("Copy") // 执行浏览器复制命令
    this.$message({
        message: '复制成功',
        type: 'success'
    })
    oInput.remove()
},
//JSON转url
 Vue.prototype.jsonToUrl = function (data) {
    return Object.keys(data).map(function (key) {
        return encodeURIComponent(key) + "=" + encodeURIComponent(data[key]);
    }).join("&");

},
//list 提取
Vue.prototype.listExtract = function (listPararm,column) {
    var arr = [];
    for (var i = 0; i < listPararm.length; i++) {
        var value = listPararm[i][column];
        arr.push(value);
    }
    return arr;
},
//list 提取
Vue.prototype.toComma = function (arr) {
    var commaStr = "";
    for (var i = 0; i < arr.length; i++) {
        var value = arr[i];
        if(commaStr != ""){
            commaStr += ",";
        }
        commaStr += value;
    }
    return commaStr;
},
//判断是否为数字
Vue.prototype.isNumber = function (param) {
    return !isNaN(parseInt(param));
}
//判断为空
Vue.prototype.isEmpty = function (param) {
    param = param == 0 ? param + '' : param;
    if (param == null || param == undefined || param == '' || JSON.stringify(param) == "{}") {
        return true;
    } else {
        return false;
    }
}
//判断不为空
Vue.prototype.isNotEmpty = function (param) {
    param = param == 0 ? param + '' : param;
    if (param == null || param == undefined || param == '' || param == ' ') {
        return false;
    } else {
        return true;
    }
}
//手机格式验证
Vue.prototype.isPhoneFmt = function (param) {
    var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
    if (!myreg.test(param)) {
        return false;
    } else {
        return true;
    }
}
//邮箱格式验证
Vue.prototype.isEmailFmt = function (email) {
    var reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
    if (reg.test(email)) {
        return true;
    } else {
        return false;
    }
}
//身份证格式验证
Vue.prototype.isIdCardFmt = function (code) {
    var city = {
        11: "北京",
        12: "天津",
        13: "河北",
        14: "山西",
        15: "内蒙古",
        21: "辽宁",
        22: "吉林",
        23: "黑龙江 ",
        31: "上海",
        32: "江苏",
        33: "浙江",
        34: "安徽",
        35: "福建",
        36: "江西",
        37: "山东",
        41: "河南",
        42: "湖北 ",
        43: "湖南",
        44: "广东",
        45: "广西",
        46: "海南",
        50: "重庆",
        51: "四川",
        52: "贵州",
        53: "云南",
        54: "西藏 ",
        61: "陕西",
        62: "甘肃",
        63: "青海",
        64: "宁夏",
        65: "新疆",
        71: "台湾",
        81: "香港",
        82: "澳门",
        91: "国外 "
    };
    var tip = "";
    var pass = true;
    //验证身份证格式（6个地区编码，8位出生日期，3位顺序号，1位校验位）
    if (!code || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(code)) {
        tip = "身份证号格式错误";
        pass = false;
    } else if (!city[code.substr(0, 2)]) {
        tip = "地址编码错误";
        pass = false;
    } else {
        //18位身份证需要验证最后一位校验位
        if (code.length == 18) {
            code = code.split('');
            //∑(ai×Wi)(mod 11)
            //加权因子
            var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
            //校验位
            var parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
            var sum = 0;
            var ai = 0;
            var wi = 0;
            for (var i = 0; i < 17; i++) {
                ai = code[i];
                wi = factor[i];
                sum += ai * wi;
            }
            var last = parity[sum % 11];
            if (parity[sum % 11] != code[17]) {
                tip = "校验位错误";
                pass = false;
            }
        }
    }
    //if(!pass) alert(tip);
    return pass;
}
//拨打电话
Vue.prototype.makePhoneCall = function (phone) {
    /*uni.makePhoneCall({
        phoneNumber: phone,
        success: () => {
            console.log("成功拨打电话")
        }
    })*/
},
    //根据身份证号获取出生日期
    Vue.prototype.getBirthdayByIdCard = function (psidno) {
        var birthdayno, birthdaytemp
        if (psidno.length == 18) {
            birthdayno = psidno.substring(6, 14)
        } else if (psidno.length == 15) {
            birthdaytemp = psidno.substring(6, 12)
            birthdayno = "19" + birthdaytemp
        } else {
            alert("错误的身份证号码，请核对！")
            return false
        }
        var birthday = birthdayno.substring(0, 4) + "-" + birthdayno.substring(4, 6) + "-" + birthdayno.substring(6, 8)
        return birthday
    }
//根据身份证号获取性别
Vue.prototype.getGenderByIdCard = function (psidno) {
    var sexno, sex
    if (psidno.length == 18) {
        sexno = psidno.substring(16, 17)
    } else if (psidno.length == 15) {
        sexno = psidno.substring(14, 15)
    } else {
        alert("错误的身份证号码，请核对！")
        return false
    }
    var tempid = sexno % 2;
    if (tempid == 0) {
        sex = '2'
    } else {
        sex = '1'//男
    }
    return sex
}
//null转空字符串
Vue.prototype.nullToEmptyStr = function (param) {
    if (this.isEmpty(param)) {
        return param;
    } else {
        return JSON.parse(JSON.stringify(param).replace(/null/g, "\"\"").replace(/"sic":"",/g, "").replace(/"cu":"",/g, ""));
    }
}
//null转空JSON空
Vue.prototype.nullToEmptyJSON = function (param) {
    if (this.isEmpty(param)) {
        return param;
    } else {
        return JSON.parse(JSON.stringify(param).replace(/null/g, "{}"));
    }
}
//空字符串转null
Vue.prototype.emptyNullToStr = function (param) {
    return JSON.parse(JSON.stringify(param).replace(/""/g, null));
}
//时间计算 两个日期之间的天数
Vue.prototype.countDays = function (start, end) {
    start = start.replace(/-/g, "/");
    var startdate = new Date(start);
    end = end.replace(/-/g, "/");
    var enddate = new Date(end);
    var time = enddate.getTime() - startdate.getTime();
    var days = parseInt(time / (1000 * 60 * 60 * 24));
    return days;
}
//清除vue组件缓存
Vue.prototype.clearCache = function (_this) {
    let vnode = _this.$vnode
    let parentVnode = vnode && vnode.parent;
    if (parentVnode && parentVnode.componentInstance && parentVnode.componentInstance.cache) {
        var key = vnode.key == null
        ? vnode.componentOptions.Ctor.cid + (vnode.componentOptions.tag ? `::${vnode.componentOptions.tag}` : '')
        : vnode.key;
        var cache = parentVnode.componentInstance.cache;
        var keys  = parentVnode.componentInstance.keys;

        if (cache[key]) {
            _this.$destroy()
        // remove key
        if (keys.length) {
            var index = keys.indexOf(key)
            if (index > -1) {
                keys.splice(index, 1)
            }
        }
        cache[key] = null
        }
    }
}
/*日期加减
* date 日期 格式 yyyy-MM-dd
* conut 天数 正值加负值减
* 返回的日期 格式 yyyy-MM-dd
* */
Vue.prototype.daysAddAndSubtract = function (date, count) {
    var date = new Date(date);
    var now = new Date(date.getTime() + 24 * 60 * 60 * 1000 * count);
    return now.getFullYear() + "-" + ((now.getMonth() + 1) < 10 ? "0" : "") + (now.getMonth() + 1) + "-" + (now.getDate() < 10 ? "0" : "") + now.getDate();
}
//异常返回JSON处理
Vue.prototype.errorJSONformat = function (returnData) {
    if (returnData.message != undefined) {
        return returnData;
    } else {
        return JSON.parse(JSON.stringify(returnData).substring(0, JSON.stringify(returnData).indexOf('}{') + 1).replace("\"{", "{").replace(/[\\]/g, ''));
    }
}
//参数转义
Vue.prototype.urlEncodeURIComponent = function (param) {
    if (param == null || param == undefined || param == '') {
        return '';
    } else {
        param = param.replace(/\%/g, "%25");
        param = param.replace(/\+/g, "%2B");
        param = param.replace(/\ /g, "%20");
        param = param.replace(/\//g, "%2F");
        param = param.replace(/\?/g, "%3F");
        param = param.replace(/\#/g, "%23");
        param = param.replace(/\&/g, "%26");
        param = param.replace(/\=/g, "%3D");
        param = param.replace(/\!/g, "%21");
        return param;
    }


}
 //上移
 Vue.prototype.upIndex = function (arr,index)
 {
    var temp;
    if(index<1||index>arr.length-1){
        return arr;
    }
    temp = arr[index-1];
    arr = arr.copyWithin(index-1,index,index+1);//target, start, end
    arr[index] = temp;
    return arr; 
 }
 //下移
 Vue.prototype.downIndex = function (arr,index){
     var temp;
     if(index<0||index>arr.length-1){
        return arr;
     }
     temp = arr[index+1];
     arr = arr.copyWithin(index+1,index,index+1);
     arr[index] = temp;
     return arr; 
 }
//删除数组中指定的元素
Vue.prototype.removeByValue = function (arr, val) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] == val) {
            arr.splice(i, 1);
        }
    }
    return arr;
}
//页面跳转
Vue.prototype.toPage = function (url) {
    this.$router.push({path: url})
}
//刷新个人信息缓存
Vue.prototype.personInitByOpenId = function () {
    Toast.loading({message: '个人信息读取中',forbidClick: true,});
    this.$api.getData("/ehrApp/person/getPersonInfo", {openId: global.userInfo.openId}).then(value => {
        global.personInfo = value.data.perinfo;
    });
}

//申请历史云之家右上角初始化
Vue.prototype.applicationHistoryPop = function (mark) {
    var _this = this;
    qing.call('createPop', {
        'popTitle': '申请历史',
        'popTitleCallBackId': 'applicationHistory',
        'items': [],
        'menuList': [],
        'shareData': {},
        'success': function (resp) {
            if (resp.success == true || resp.success == 'true') {
                var callBackId = resp.data ? resp.data.callBackId : '';
                if (callBackId == 'applicationHistory') {
                    var url = '/pages/employeeService/applicationHistory/applicationHistory?mark=' + _this.urlEncodeURIComponent(mark);
                    if (mark == '出差') {
                        url += '&backURL=/pages/employeeService/evectionManagerBill/addPage?backURL=/pages/index/index'
                    } else if (mark == '加班') {
                        url += '&backURL=/pages/employeeService/appextraWork/addPage?backURL=/pages/index/index'
                    } else if (mark == '调休') {
                        url += '&backURL=/pages/employeeService/daysOff/addPage?backURL=/pages/index/index'
                    } else if (mark == '请假') {
                        url += '&backURL=/pages/employeeService/applicationLeave/addPage?backURL=/pages/index/index'
                    } else if (mark == '销假') {
                        url += '&backURL=/pages/employeeService/revocationLeave/addPage?backURL=/pages/index/index'
                    } else if (mark == '') {
                        url += '&backURL=/pages/index/index'
                    }
                    this.$router.push({ path: url })
                }
            }
        },
    });
}
//自定义云之家右上角初始化
Vue.prototype.customPop = function (popTitle, url) {
    var _this = this;
    qing.call('createPop', {
        'popTitle': popTitle,
        'popTitleCallBackId': 'applicationHistory',
        'items': [],
        'menuList': [],
        'shareData': {},
        'success': function (resp) {
            if (resp.success == true || resp.success == 'true') {
                var callBackId = resp.data ? resp.data.callBackId : '';
                if (callBackId == 'applicationHistory') {
                    this.$router.push({ path: url })
                }
            }
        },
    });
}
//申请历史云之家右上角为空
Vue.prototype.emptyPop = function () {
    var _this = this;
    qing.call('createPop', {
        'popTitle': ' ',
        'popTitleCallBackId': '',
        'items': [],
        'menuList': [],
        'shareData': {},
        'success': function (resp) {
            if (resp.success == true || resp.success == 'true') {
                var callBackId = resp.data ? resp.data.callBackId : '';
                if (callBackId == 'applicationHistory') {
                }
            }
        },
    });
}
/**
 * 云之家右上角初始化
 * title   右上角名称
 * backId   唯一id
 * url   要跳转的url
 **/
Vue.prototype.initPop = function (title, backId, url) {
    var _this = this;
    qing.call('createPop', {
        'popTitle': title,
        'popTitleCallBackId': backId,
        'items': [],
        'menuList': [],
        'shareData': {},
        'success': function (resp) {
            if (resp.success == true || resp.success == 'true') {
                var callBackId = resp.data ? resp.data.callBackId : '';
                if (callBackId == backId) {
                    this.$router.push({ path: url })
                }
            }
        },
    });
}
//详情的弹框
Vue.prototype.popView = function (data) {
    if (this.isEmpty(data)) {
        return;
    }
    Dialog.alert({
        message: data,
    }).then(() => {
        // on close
    });
}
//获取当前日期
Vue.prototype.getShortNowDate = function () {
    var now = new Date();
    return now.getFullYear() + "-" + ((now.getMonth() + 1) < 10 ? "0" : "") + (now.getMonth() +
        1) + "-" + (now.getDate() < 10 ? "0" : "") + now.getDate();
}
//获取当前日期
Vue.prototype.getLongNowDate = function () {
    var now = new Date();
    return now.getFullYear() + "-" + ((now.getMonth() + 1) < 10 ? "0" : "") + (now.getMonth() +
        1) + "-" + (now.getDate() < 10 ? "0" : "") + now.getDate() + ' 00:00:00';
}

//日期转字符串
Vue.prototype.dateToStr = function (now) {
    return now.getFullYear() + "-" + ((now.getMonth() + 1) < 10 ? "0" : "") + (now.getMonth() +
        1) + "-" + (now.getDate() < 10 ? "0" : "") + now.getDate();
}
//获取这周的周一
Vue.prototype.getFirstDayOfWeek = function () {
    var date = new Date();
    var weekday = date.getDay()||7; //获取星期几,getDay()返回值是 0（周日） 到 6（周六） 之间的一个整数。0||7为7，即weekday的值为1-7
    date.setDate(date.getDate()-weekday+1);//往前算（weekday-1）天，年份、月份会自动变化
    return this.dateToStr(date);
}

//获取当月第一天
Vue.prototype.getFirstDayOfMonth  = function () {
    var date = new Date();
    date.setDate(1);
    return this.dateToStr(date);
}


//获取当年第一天
Vue.prototype.getFirstDayOfYear  = function () {
    var date = new Date();
    date.setDate(1);
    date.setMonth(0);
    return this.dateToStr(date);
}
//权限验证
Vue.prototype.permissionVerify = function () {
    if (this.isEmpty(global.userInfo.openId)) {
        this.$router.push({ path:  '/common/forbidden/请前往云之家打开此链接' })
        return;
    }
    if (this.isEmpty(global.userInfo.userId)) {
        this.$router.push({ path:  '/common/forbidden/未查到您云之家对应的银城账号' })
        return;
    }
}
//云之间返回事件
Vue.prototype.defback = function (url) {
    if (url == null || url == undefined || url == '') {
        return;
    }
    var _this = this;
    qing.call('defback', {
        success: function () {
            this.$router.push({ path: url })
            /* _this.$router.push({
                path: url,
            }) */
        }
    });
}
//select的参数格式化  传入格式必须为 [{name:'',id:''}]
Vue.prototype.paramCacheSheetFmt = function (dataList) {
    if (dataList == null || dataList == undefined || dataList == '') {
        return {data: {}};
    }
    var itemList = [];
    var itemIndex = {};
    var pickerList = [];
    var data = {};
    for (var i = 0; i < dataList.length; i++) {
        var item = dataList[i];
        var id = item.id;
        var name = item.name;
        itemList.push(name);
        itemIndex[i] = id;
        data[id] = name;
        pickerList.push({label: name, value: id});
    }
    return {
        itemList: itemList,
        itemIndex: itemIndex,
        data: data,
        pickerList: pickerList,
    }
}
//跳转外部链接
Vue.prototype.jumpOutLinks = function (url, urlName) {
    qing.call('gotoLightApp', {
        appName: urlName,
        urlParam: url
    });
}
//刷新屏幕尺寸缓存
Vue.prototype.refreshScreenSize = function () {

    this.screenHeight = (document.documentElement.clientHeight || document.body.clientHeight) - 130;
    this.screenWidth = (document.documentElement.clientWidth || document.body.clientWidth) - 18;
    this.screenSize = {width:this.screenWidth,height: this.screenHeight};
}
//去异常页面
Vue.prototype.goError = function (msg) {
    this.$router.push({ path:  '/pages/employeeService/common/forbidden?msg=' + msg })
}
//云之家页面标题初始化
Vue.prototype.titleInit = function (title) {
    qing.call('setWebViewTitle', {'title': title});
}
//下载附件
Vue.prototype.windowOpen = function (url) {
    console.log(JSON.stringify(url));
    window.open(url);
}
//获取附件列表
Vue.prototype.getAttListByBillId = function (billId, dataName, _this) {
    Toast.loading({message: '数据加载中',forbidClick: true,});
    this.$api.getData("/ehrApp/commonCrm/getAttListByBillId", {
        id: billId
    }).then(value => {
        if (value.data.code != 200) {
            var errorJSON = _this.errorJSONformat(value.data);
            //Toast.fail(errorJSON.message);
            console.error(JSON.stringify(errorJSON.data));
        } else {
            for (var i = 0; i < value.data.list.length; i++) {
                var item = value.data.list[i];
                _this[dataName].push({
                    id: item.id,
                    name: item.name,
                    type: item.type,
                    data: this.mainUrl() + '/systemController/showOrDownByurl?attId=' + item.id,
                    downloadPath: this.mainUrl() + '/ehrApp/commonCrm/showOrDownByurl?bizType=&attId=' + item.id + '&down=1',
                    //src:this.verifyFile(item.type).src,
                });

            }
        }
        global
    });
}
//获取系统参数
Vue.prototype.getSysPrmsValue = function (sysParam, _this) {
    _this.$api.postData("/ehrApp/commonCrm/getSysPrmsValue", _this[sysParam]).then(value => {
        _this.sysParam = value.data;
        _this.sysParam = Object.assign({}, _this.sysParam);
    });
}
//组长本页面的返回地址
Vue.prototype.backUrlSplicer = function (thisURL, backURL, paramName, _this) {
    _this[paramName] = 'backURL=' + _this.urlEncodeURIComponent(thisURL + (_this.isEmpty(backURL) ? '' : '?backURL=' + backURL));
}
