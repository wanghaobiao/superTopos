import VueRouter from 'vue-router'
import ProjectList from './components/page/databaseTools/project'
import tableManagement from './components/page/databaseTools/tableManagement'
import systemConfigParams from './components/page/systemConfig/params'
import orderManagement from './components/page/mallManagement/orderManagement'
import productTypes from './components/page/mallManagement/productTypes'
import userManagement from './components/page/userManagement/userManagement'
import login from './components/page/login/login'
import main from './components/page/login/main'
import Vue from 'vue'
import tools from './../src/components/util/util'

// 1、创建路由对象
var router = new VueRouter({
    routes: [
        { 
            path: '/databaseTools/project',
            name: 'projectList',
            meta:{
                title: '项目列表',
                requireAuth: true,
            },
            component: ProjectList 
        },
        {   
            path: '/databaseTools/tableManagement',
            name: 'tableManagement',
            meta:{
                title: '表管理',
                requireAuth: true,
            },
            component: tableManagement 
        },
        {   
            path: '/systemConfig/params', 
            name: 'systemConfigParams',
            meta:{
                title: '系统参数',
                requireAuth: true,
            },
            component: systemConfigParams 
        },
        {   
            path: '/userManagement/userManagement', 
            name: 'userManagement',
            meta:{
                title: '用户管理',
                requireAuth: true,
            },
            component: userManagement 
        },
        {   
            path: '/mallManagement/orderManagement', 
            name: 'orderManagement',
            meta:{
                title: '订单管理',
                requireAuth: true,
            },
            component: orderManagement },
        {   
            path: '/mallManagement/productTypes', 
            name: 'productTypes',
            meta:{
                title: '商品类型',
                requireAuth: true,
            },
            component: productTypes },
            
        {   
            path: '/login/login', 
            name: 'login',
            meta:{
                title: '登陆',
                requireAuth: false,
                showNav: true
            },
            component: login },
        {   
            path: '/login/main', 
            name: 'main',
            meta:{
                title: '首页',
                requireAuth: true,
                showNav: true
            },
            component: main 
        
        },
        {
            path:'*',
            redirect:'/databaseTools/project'
        }
     
    ]
})

// 2、把路由对象暴露出去
export default router