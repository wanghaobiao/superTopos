<template>
    <div id="app">
        <!--导航条-->
        <el-menu class="el-menu-demo" mode="horizontal"
                 background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
            <el-submenu index="1">
                <template slot="title">数据库工具</template>
                <el-menu-item index="/projectList"><router-link to="/projectList">项目管理</router-link></el-menu-item>
                <el-menu-item index="/demo/group/index">表结构管理</el-menu-item>
            </el-submenu>
            <el-submenu index="2">
                <template slot="title">我的工作台</template>
                <el-menu-item index="/demo/index">列表</el-menu-item>
                <el-menu-item index="/demo/group/index">分组</el-menu-item>
            </el-submenu>
            <el-menu-item index="3"><router-link to="/test">处理中心</router-link></el-menu-item>
        </el-menu>
        <br>
        <router-view></router-view>

    </div>
</template>

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
    .tb-edit .el-input {
        display: none
    }
    .tb-edit .current-row .el-input {
        display: block
    }
    .tb-edit .current-row .el-input+span {
        display: none
    }
    .tb-edit .el-select {
        display: none
    }
    .tb-edit .current-row .el-select {
        display: block
    }
    .tb-edit .current-row .el-select+span {
        display: none
    }
    .test{
        color: red;
    }

</style>