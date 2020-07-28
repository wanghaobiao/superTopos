import VueRouter from 'vue-router'
import ProjectList from './components/page/databaseTools/project'
import tableManagement from './components/page/databaseTools/tableManagement'
import systemConfigParams from './components/page/systemConfig/params'
import orderManagement from './components/page/mallManagement/orderManagement'
import productTypes from './components/page/mallManagement/productTypes'
import Vue from 'vue'
import tools from './../src/components/util/util'

// 1、创建路由对象
var router = new VueRouter({
    routes: [
        { path: '/databaseTools/project', component: ProjectList },
        { path: '/databaseTools/tableManagement', component: tableManagement },
        { path: '/systemConfig/params', component: systemConfigParams },
        { path: '/mallManagement/orderManagement', component: orderManagement },
        { path: '/mallManagement/productTypes', component: productTypes },
        { path: '/', component: ProjectList }
    ]
})

// 2、把路由对象暴露出去
export default router