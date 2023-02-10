<template>
    <div id="app" :style="{width:screenSize.width+'px'}">
        <!--导航条-->
        <dv-border-box-13 style="height: 60px;background-color: #282c34;color: #fff; z-index: 11">
            <el-menu class="elmenu"  mode="horizontal" background-color="rgba(165, 42, 42, 0)" text-color="#fff" active-text-color="#ffd04b" >
                <!-- <el-submenu index="1">
                    <template slot="title">数据库工具</template>
                    <el-menu-item index="1-1" @click="jump('/databaseTools/project')">项目管理</el-menu-item>
                    <el-menu-item index="1-2" @click="jumpForTable('tableManagement','DQ')">表结构管理</el-menu-item>
                    <el-menu-item index="1-3" @click="jumpForTable('tableManagement','LS')">表结构管理(历史)</el-menu-item>
                </el-submenu> -->
                <el-menu-item index="1" @click="jump('/databaseTools/project')" class="border-radius-5" >项目管理</el-menu-item>
                <el-menu-item index="2" @click="jumpForTable('tableManagement','DQ')">项目结构管理</el-menu-item>
                <el-menu-item index="6" @click="jump('/databaseTools/dataSource')">数据库管理</el-menu-item>
                <el-menu-item index="7" @click="jump('/databaseTools/dbManagement')">数据库逆向</el-menu-item>
                <el-menu-item index="3" @click="jump('/systemConfig/codeReserve')">代码储备</el-menu-item>
                <!--                <el-menu-item index="4" @click="jump('/topicManage/topicManage')">题目管理</el-menu-item>-->
                <!--                <el-menu-item index="5" @click="jump('/topicManage/topicTest')">基础构建</el-menu-item>-->
                <el-submenu index="2">
                    <template slot="title">系统配置</template>
                    <el-menu-item index="2-1" @click="jump('/systemConfig/params')">参数管理</el-menu-item>
                    <!--                    <el-menu-item index="2-2" @click="jump('/userManagement/userManagement')">用户管理</el-menu-item>-->
                </el-submenu>
            </el-menu>
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

body {
    background-color: #282c34;
}
.el-popover{
  background: #282c34 !important;
  border: 1px solid #282c34;
}
.el-menu--horizontal {
    border-right: none;
    border-bottom: solid 0px #e6e6e6;
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
.border-2-adadad{
    border: 2px solid #adadad;
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
    padding-top:  22px;
}
/* 分页样式  */
.pagination{
    margin-top: 10px;
    margin-bottom: 10px;
    text-align: right;
}
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
    background-color: rgb(108, 184, 250) !important;
}
/* table鼠标选中颜色 */
.el-table--striped .el-table__body tr.el-table__row--striped.current-row td, .el-table__body tr.current-row>td {
    color: #fff;
    background-color: rgb(108, 184, 250) !important;
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
/***************************************** 覆盖样式结束 *****************************************/
/***************************************** 修改滚动条开始 *****************************************/
div::-webkit-scrollbar{
    width:4px;
    height:10px;
    /**/
}
div::-webkit-scrollbar-track{
    margin-top: 18px;
    margin-bottom: 18px;
    background: rgb(239, 239, 239);
    border-radius:2px;
}
div::-webkit-scrollbar-thumb{
    background: #adadad;
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
    background-color: #141414;
    border-color: #4c4d4f;
    color: #C0C4CC;
    cursor: not-allowed;
}
.el-input .el-input__inner {
    background-color: #141414;
    border-color: #4c4d4f;
    color: #C0C4CC;
    cursor: not-allowed;
}
.el-select .el-input__inner {
    background-color: #141414;
    border-color: #4c4d4f;
    color: #C0C4CC;
    cursor: not-allowed;
}
/***************************************** 修改表格的默认样式结束 *****************************************/

</style>
