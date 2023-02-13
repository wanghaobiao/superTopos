<template>
    <div id="app" :style="{width:screenSize.width+'px'}">
        <!--导航条-->
        <dv-border-box-13 style="height: 60px;background-color: #282c34;color: #fff; z-index: 11" v-show="!$route.meta.showNav">
            <el-menu class="elmenu" :default-active="activeIndex" mode="horizontal" background-color="rgba(165, 42, 42, 0)" text-color="#fff" active-text-color="#ffd04b" >
                <!-- <el-submenu index="1">
                    <template slot="title">数据库工具</template>
                    <el-menu-item index="1-1" @click="jump('/databaseTools/project')">项目管理</el-menu-item>
                    <el-menu-item index="1-2" @click="jumpForTable('tableManagement','DQ')">表结构管理</el-menu-item>
                    <el-menu-item index="1-3" @click="jumpForTable('tableManagement','LS')">表结构管理(历史)</el-menu-item>
                </el-submenu> -->
                <el-menu-item index="1" @click="jump('/databaseTools/project')" class="border-radius-5 el-menu-x" >项目管理</el-menu-item>
                <el-menu-item index="2" @click="jumpForTable('tableManagement','DQ')" class="el-menu-x">项目结构管理</el-menu-item>
                <el-menu-item index="6" @click="jump('/databaseTools/dataSource')" class="el-menu-x">数据库管理</el-menu-item>
                <el-menu-item index="7" @click="jump('/databaseTools/dbManagement')" class="el-menu-x">数据库逆向</el-menu-item>
                <el-menu-item index="3" @click="jump('/systemConfig/codeReserve')" class="el-menu-x">代码储备</el-menu-item>
                <el-menu-item index="5" @click="jump('/systemConfig/params')" class="el-menu-x">参数管理</el-menu-item>
                <!--                <el-menu-item index="4" @click="jump('/topicManage/topicManage')">题目管理</el-menu-item>-->
                <!--                <el-menu-item index="5" @click="jump('/topicManage/topicTest')">基础构建</el-menu-item>-->
<!--                <el-submenu index="2">
                    <template slot="title">系统配置</template>
                    <el-menu-item index="2-1" @click="jump('/systemConfig/params')">参数管理</el-menu-item>
                    <el-menu-item index="2-2" @click="jump('/userManagement/userManagement')">用户管理</el-menu-item>
                </el-submenu>-->
            </el-menu>
<!--            <div class="card"></div>-->
            <div class="breathe-btn"></div>

        </dv-border-box-13>
        <router-view :style="{'margin-top':  !$route.meta.showNav ? '8px' : '0px'}" class="router-view"></router-view>
    </div>


</template>
<script>
    export default {
        created() {
            this.refreshScreenSize();
            this.search();
            this.screenSize = this.screenSize;

        },
        data() {
            return {
                activeIndex:'2',
                pages: [],
                menuData:[],
                screenSize:{}
            };
        },
        methods: {
            jump(routerUrl){
                this.$router.push(routerUrl);
            },
            jumpForTable(routerName,projectType){
                //this.$router.push({path : '/databaseTools/tableManagement' ,params : {'projectType':projectType}});
                this.$router.push({path : '/databaseTools/tableManagement' ,params : {'projectType':projectType}});
            },
            //执行搜索
            search() {
                this.getHttp(
                    "/api/project/findAll"
                ).then(result => {
                    this.menuData = result.content;

                });
            },

        }
    };
</script>







<style>
/*resize*/
body,div,dl,dt,dd,ul,ol,li,h1,h2,h3,h4,h5,h6,form,input,textarea,p,th,td,menu {
    margin:0;
    padding:0;
}
body {
    -webkit-text-size-adjust:none;
    font-family:Arial,Helvetica,sans-serif;
}
img {
    border:none;
}
ol,ul {
    list-style:none;
}
em {
    font-style:normal;
}
a {
    text-decoration:none;
}
.clearfix {
    #zoom:1;
}
.clearfix:after {
    content:' ';
    display:block;
    height:0;
    clear:both;
    color:#fff;
}
body {
    background:#333;
}
.breathe-btn {
    z-index: 999;
    position:relative;
    margin-left: 4px;
    width:calc(100% - 8px);
    height:3px;
    margin:-3px auto;
    line-height:40px;
    border:1px solid #495e9b;
    border-radius:5px;
    color:#fff;
    font-size:20px;
    text-align:center;
    cursor:pointer;
    box-shadow:0 1px 2px rgba(0,0,0,.3);
    overflow:hidden;
    background-image:-webkit-gradient(linear,left top,left bottom,from(#6789e8),to(#495e9b));
    -webkit-animation-timing-function:ease-in-out;
    -webkit-animation-name:breathe;
    -webkit-animation-duration:2700ms;
    -webkit-animation-iteration-count:infinite;
    -webkit-animation-direction:alternate;
}
@keyframes breathe {
    0% {
        opacity:.2;
        box-shadow:0 1px 2px rgba(255,255,255,0.1);
    }
    100% {
        opacity:1;
        border:1px solid #495e9b;
        box-shadow:0 1px 30px #495e9b;
    }
}
.card {
    margin-top: -6px;
    margin-left: 3px;
    width: calc(100% - 6px);
    height: 5px;
    z-index: -10;
    background: #282c34;
    position: relative;
    display: flex;
    place-content: center;
    place-items: center;
    overflow: hidden;
    border-radius: 20px;
}

.card h2 {
    z-index: 1;
    color: white;
    font-size: 2em;
}

.card::before {
    content: '';
    position: absolute;
    width: 100%;
    background-image: linear-gradient(180deg, #282c34, #517bf6);
    /*background-image: linear-gradient(180deg, rgb(0, 183, 255), rgb(255, 48, 255));*/
    height: 2000px;
    animation: rotBGimg 4s linear infinite;
    transition: all 0.2s linear;
}

@keyframes rotBGimg {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}

.card::after {
    content: '';
    position: absolute;
    background: #07182E;
;
    inset: 5px;
    border-radius: 15px;
}
/* .card:hover:before {
  background-image: linear-gradient(180deg, rgb(81, 255, 0), purple);
  animation: rotBGimg 3.5s linear infinite;
} */


/********************************************************动画开始********************************************************/


/********************************************************动画结束********************************************************/
.el-menu-x {
    background-color: rgba(246, 243, 243, 0.01) !important;;
    border-bottom-color: rgba(255, 208, 75, 0) !important;;

}
body {
    background-color: #282c34;
}
.el-popover{
  background: #282c34 !important;
  border: 1px solid #282c34;
}
.el-menu.el-menu--horizontal {
    border-bottom: solid 0px #e6e6e6;
}
.el-menu--horizontal {
    border-right: none;
    border-bottom: 0px solid #e6e6e6;
}
.el-submenu__title:hover{
    background-color: rgb(255, 255, 255, 0) !important;
}
.el-menu-item:hover {
    background-color: rgb(255, 255, 255, 0) !important;
}

.el-menu-demo{
    border-radius: 10px;
}
.dvBox13 {
    height: 30px;
}
.atooltip.el-tooltip__popper[x-placement^="top"] .popper__arrow {
    border-top-color: pink;
}
.atooltip.el-tooltip__popper[x-placement^="top"] .popper__arrow:after {
    border-top-color: pink;
}
.atooltip {
    background: pink !important;
}

.router-view{
    margin: 0px;
}
/***************************************** 基础样式开始 *****************************************/
.text-align-center{
    text-align: center;
}
.margin-top-22{
    margin-top: 22px;
}
.margin-top-10{
    margin-top: 10px;
}
.text-align-right{
    text-align: right;
}
.height-100{
    height: 100%;
}
.border-2-495e9b{
    border: 2px solid #495e9b;
}
.border-radius-5{
    border-radius: 5px;
}
/***************************************** 基础样式开始 *****************************************/

a {
    text-decoration: none;
}
body .el-table th.gutter{
    display: table-cell!important;
}
.spacing {
    margin-bottom: 11px;
}
.save-spacing{
    text-align: right;
    padding-top:  13px;
}
/* 分页样式  */
.pagination{
    margin-top: 10px;
    margin-bottom: 10px;
    text-align: right;
}
/***************************************** dialog样式开始 *****************************************/

.dialog .el-dialog__header {
    background-color: #282c34;
}

.dialog .el-dialog__title {
    line-height: 24px;
    font-size: 18px;
    color: #fff;
}

/*body背景色*/
.dialog .el-dialog__body {
    background-color: #282c34;
}

.dialog .el-dialog__footer {
    background-color: #282c34;
}
.view-dialog .el-dialog__header {
    background-color: #282c34;
}

.view-dialog .el-dialog__title {
    line-height: 24px;
    font-size: 18px;
    color: #fff;
}

/*body背景色*/
.view-dialog .el-dialog__body {
    background-color: #282c34;
}

.view-dialog .el-dialog__footer {
    background-color: #282c34;
}

/***************************************** dialog样式结束 *****************************************/
/***************************************** 详情样式开始 *****************************************/
.el-table .warning-row {
    background: #F5F7FA;
}
.el-table .edit-row {
    background: #ffffff;
}
/* 详情宽度 */
.view-dialog{
    width: 80%;
}
/* 详情明细 */
.tb-edit .el-input {
    display: none
}
.tb-edit .edit-row .el-input {
    display: block
}
.tb-edit .edit-row .el-input+span {
    display: none
}
.tb-edit .el-select {
    display: none
}
.tb-edit .edit-row .el-select {
    display: block
}
.tb-edit .edit-row .el-select+span {
    display: none
}

/***************************************** 详情样式结束 *****************************************/
/***************************************** 覆盖样式开始 *****************************************/
/* table鼠标悬停颜色 */
.el-table--enable-row-hover .el-table__body tr:hover>td{
    background-color: rgb(53 67 108) !important;
}

/* table鼠标悬停颜色 */
.el-table__body tr:hover>td{
    background-color: rgb(53 67 108) !important;
}
/* table鼠标悬停颜色 */
.el-table--striped .el-table__body tr.el-table__row--striped.current-row td, .el-table__body tr.current-row>td, .el-table__body tr.hover-row.current-row>td, .el-table__body tr.hover-row.el-table__row--striped.current-row>td, .el-table__body tr.hover-row.el-table__row--striped>td, .el-table__body tr.hover-row>td {
    background-color: rgb(53 67 108) !important;
}

/* table鼠标选中颜色 */
.el-table--striped .el-table__body tr.el-table__row--striped.current-row td, .el-table__body tr.current-row>td {
    color: #fff;
    background-color: rgb(53 67 108) !important;
}
.dialog-button {
    padding: 10px ;
    text-align: right;
    box-sizing: border-box;
}
.el-table__fixed-right{
    height: 100% !important;
}

/* 按钮样式 */
.el-button {
    display: inline-block;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    -webkit-appearance: none;
    text-align: center;
    box-sizing: border-box;
    outline: 0;
    margin: 0;
    transition: .1s;
    font-weight: 500;
    padding: 12px 20px;
    font-size: 14px;
    border-radius: 5px;
}

.el-form-item__label {
    text-align: right;
    float: left;
    font-size: 14px;
    color: #ffffff;
    line-height: 40px;
    padding: 0 12px 0 0;
    box-sizing: border-box;
}
/***************************************** 覆盖样式结束 *****************************************/
/***************************************** 修改滚动条开始 *****************************************/
div::-webkit-scrollbar{
    width:4px;
    height:5px;
    /**/
}
div::-webkit-scrollbar-track{
    margin-top: 18px;
    margin-bottom: 18px;
    background: rgb(239, 239, 239);
    border-radius:2px;
}
div::-webkit-scrollbar-thumb{
    background: #495e9b;
    border-radius:10px;
}
div::-webkit-scrollbar-thumb:hover{
    background: #333;
}
div::-webkit-scrollbar-corner{
    background: #179a16;
}
/***************************************** 修改滚动条结束 *****************************************/
/***************************************** 修改表格的默认样式开始 *****************************************/
.el-table {
    background-color: #282c34;
}
.el-table td{
    padding-top: 5px;
    padding-bottom: 5px;
    border-right: 1px solid #495e9b;
    border-bottom: 1px solid #495e9b;
}
.el-table th.is-leaf{
    border-bottom: 1px solid #495e9b;
    border-right: 1px solid #495e9b;
}
.el-table--border{
    border: 1px solid #495e9b;
}
.el-table--border::after,
.el-table--group::after,
.el-table::before,
.el-table__fixed:before,
.el-table__fixed-right:before {
    background-color: transparent;
}

.el-input.is-disabled .el-input__inner {
    background-color: rgb(53 67 108);
    border-color: #495e9b;
    color: #C0C4CC;
    cursor: not-allowed;
}
.el-input .el-input__inner {
    background-color: rgb(53 67 108);
    border-color: #495e9b;
    color: #C0C4CC;
    cursor: not-allowed;
}
.el-select .el-input__inner {
    background-color: rgb(53 67 108);
    border-color: #495e9b;
    color: #C0C4CC;
    cursor: not-allowed;
}
/***************************************** 修改表格的默认样式结束 *****************************************/
/***************************************** 修改按钮默认样式开始 *****************************************/
.el-button--primary.is-plain {
    color: white;
    background: #495e9b;
    border-color: #4d79fb;
}
.el-button--success.is-plain {
    color: white;
    background: #0f4e28;
    border-color: #1e703f;
}
.el-button--danger.is-plain {
    color: white;
    background: #af2e2e;
    border-color: #d13b3b;
}
.el-button--warning.is-plain {
    color: white;
    background: #c78323;
    border-color: #f9bb5c;
}

.el-button--primary {
    color: white;
    background: #495e9b;
    border-color: #4d79fb;
}
.el-button--success {
    color: white;
    background: #0f4e28;
    border-color: #1e703f;
}
.el-button--danger {
    color: white;
    background: #af2e2e;
    border-color: #d13b3b;
}
.el-button--warning {
    color: white;
    background: #c78323;
    border-color: #f9bb5c;
}
.cancel-but {
    color: white;
    background: #ff7657;
    border-color: #ff5f3a;
}
.cancel-but:hover {
    color: white;
    background: #ff5937;
    border-color: #ff5f3a;
}

/***************************************** 修改按钮默认样式结束 *****************************************/
/***************************************** 修改分页默认样式开始 *****************************************/
.el-pagination.is-background .btn-next.disabled, .el-pagination.is-background .btn-next:disabled, .el-pagination.is-background .btn-prev.disabled, .el-pagination.is-background .btn-prev:disabled, .el-pagination.is-background .el-pager li.disabled {
    color: white;
}

.el-pagination.is-background .btn-next, .el-pagination.is-background .btn-prev, .el-pagination.is-background .el-pager li {
    margin: 0 5px;
    background-color: #495e9b;
    color: white;
    min-width: 30px;
    border-radius: 2px;
}

.el-pagination.is-background .el-pager li:not(.disabled).active {
    background-color: #495e9b;
    color: #fff;
}


.el-checkbox__inner {
    display: inline-block;
    position: relative;
    border: 1px solid #2752b7;
    border-radius: 2px;
    box-sizing: border-box;
    width: 14px;
    height: 14px;
    background-color: #000;
    z-index: 1;
    transition: border-color .25s cubic-bezier(.71,-.46,.29,1.46),background-color .25s cubic-bezier(.71,-.46,.29,1.46);
}
/***************************************** 修改分页默认样式结束 *****************************************/
/***************************************** 修改单选框默认样式开始 *****************************************/
.el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner {
    background-color: rgb(53 67 108);
    border-color: #409EFF;
}

/***************************************** 修改单选框默认样式结束 *****************************************/

</style>
