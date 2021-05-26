<template>

    <div id="app" :style="{width:screenSize.width+'px'}">
        <!--导航条-->
        <div  v-show="!$route.meta.showNav">
            <el-menu class="el-menu-demo" mode="horizontal" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
                <!-- <el-submenu index="1">
                    <template slot="title">数据库工具</template>
                    <el-menu-item index="1-1" @click="jump('/databaseTools/project')">项目管理</el-menu-item>
                    <el-menu-item index="1-2" @click="jumpForTable('tableManagement','DQ')">表结构管理</el-menu-item>
                    <!-- <el-menu-item index="1-3" @click="jumpForTable('tableManagement','LS')">表结构管理(历史)</el-menu-item>
                </el-submenu> -->
                <el-menu-item index="1" @click="jump('/databaseTools/project')">项目管理</el-menu-item>
                <el-menu-item index="2" @click="jumpForTable('tableManagement','DQ')">表结构管理</el-menu-item>
                <el-menu-item index="5" @click="jump('/systemConfig/codeReserve')">代码储备</el-menu-item>
                <el-submenu index="2">
                    <template slot="title">系统配置</template>
                    <el-menu-item index="2-1" @click="jump('/systemConfig/params')">参数管理</el-menu-item>
                    <el-menu-item index="2-2" @click="jump('/userManagement/userManagement')">用户管理</el-menu-item>
                </el-submenu>
                <!-- <el-submenu index="3">
                    <template slot="title">商场管理</template>
                    <el-menu-item index="3-1" @click="jump('/mallManagement/orderManagement')">订单管理</el-menu-item>
                    <el-menu-item index="3-2" @click="jump('/mallManagement/productTypes')">商品类型</el-menu-item>
                </el-submenu> -->
                <el-submenu index="3">
                    <template slot="title">技能储备</template>
                    <el-menu-item index="3-1" @click="jump('/topicManage/topicManage')">题目管理</el-menu-item>
                    <el-menu-item index="3-2" @click="jump('/topicManage/topicTest')">基础构建</el-menu-item></el-menu-item>
                </el-submenu>
                <el-submenu index="4">
                    <template slot="title">用户管理</template>
                    <el-menu-item index="4-1" @click="jump('/userManagement/userManagement')">用户管理</el-menu-item>
                </el-submenu>
                
            </el-menu>
        </div>
       

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
    /***************************************** 基础样式开始 *****************************************/

    a {
    text-decoration: none;
    }
    body .el-table th.gutter{
    display: table-cell!important;
    }
    .spacing {
        margin-bottom: 22px;
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
    /***************************************** 覆盖样式结束 *****************************************/
    

</style>