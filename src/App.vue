<template>
    <div id="app">
        <!--导航条-->
        <el-menu class="el-menu-demo" mode="horizontal"
                 background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
            <el-submenu index="1">
                <template slot="title">数据库工具</template>
                <el-menu-item index="1-1" @click="jump('/databaseTools/project')">项目管理</el-menu-item>
                <el-menu-item index="1-2" @click="jump('/databaseTools/tableManagement')">表结构管理</el-menu-item>
            </el-submenu>
            <el-submenu index="2">
                <template slot="title">系统配置</template>
                <el-menu-item index="2-1" @click="jump('/systemConfig/params')">参数管理</el-menu-item>
            </el-submenu>
            <el-menu-item index="3">处理中心</el-menu-item>
        </el-menu>
        <br>
        <router-view></router-view>

    </div>
</template>
<script>
    export default {
        data() {
            return {
            };
        },
        methods: {
           jump(routerUrl){
                this.$router.push(routerUrl);
           }
        }
    };
</script>
<style>
    a {
    text-decoration: none;
    }
    body .el-table th.gutter{
    display: table-cell!important;
    }
    .spacing {
        margin-bottom: 10px;
    }
    /***************************************** 详情样式开始 *****************************************/
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
    /***************************************** 覆盖样式结束 *****************************************/
    

</style>