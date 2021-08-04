import VueRouter from 'vue-router'

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
            component: () => import('./components/page/databaseTools/project'),

        },
        {
            path: '/databaseTools/dataSource',
            name: 'dataSource',
            meta:{
                title: '数据库管理',
                requireAuth: false,
            },
            component: () => import('./components/page/databaseTools/dataSource'),

        },
        {
            path: '/databaseTools/dbManagement',
            name: 'dbManagement',
            meta:{
                title: '数据库管理',
                requireAuth: false,
            },
            component: () => import('./components/page/databaseTools/dbManagement'),

        },
        {   
            path: '/databaseTools/tableManagement',
            name: 'tableManagement',
            meta:{
                title: '表管理',
                requireAuth: false,
            },
            component: () => import('./components/page/databaseTools/tableManagement'),

        },
        {   
            path: '/systemConfig/params', 
            name: 'systemConfigParams',
            meta:{
                title: '系统参数',
                requireAuth: true,
            },
            component: () => import('./components/page/systemConfig/params'),
        },
        {   
            path: '/systemConfig/codeReserve', 
            name: 'systemConfigCodeReserve',
            meta:{
                title: '代码储备',
                requireAuth: true,
            },
            component: () => import('./components/page/systemConfig/codeReserve'),
        },
        {   
            path: '/topicManage/topicManage', 
            name: 'topicManageTopicManage',
            meta:{
                title: '题目管理',
                requireAuth: true,
            },
            component: () => import('./components/page/topicManage/topicManage'),
        },
        {   
            path: '/topicManage/topicTest', 
            name: 'topicManageTopicTest',
            meta:{
                title: '技能考核',
                requireAuth: true,
            },
            component: () => import('./components/page/topicManage/topicTest'),
        },
        {   
            path: '/userManagement/userManagement', 
            name: 'userManagement',
            meta:{
                title: '用户管理',
                requireAuth: true,
            },
            component: () => import('./components/page/userManagement/userManagement'),
        },
        {   
            path: '/mallManagement/orderManagement', 
            name: 'orderManagement',
            meta:{
                title: '订单管理',
                requireAuth: true,
            },
            component: () => import('./components/page/mallManagement/orderManagement'),
        },
        {   
            path: '/mallManagement/productTypes', 
            name: 'productTypes',
            meta:{
                title: '商品类型',
                requireAuth: true,
            },
            component: () => import('./components/page/mallManagement/productTypes'),
        },
            
        {   
            path: '/login/login', 
            name: 'login',
            meta:{
                title: '登陆',
                requireAuth: false,
                showNav: true
            },
            component: () => import('./components/page/login/login'),
        },
        {   
            path: '/login/main', 
            name: 'main',
            meta:{
                title: '首页',
                requireAuth: true,
                showNav: true
            },
            component: () => import('./components/page/login/main'),
        
        },
        {
            path:'*',
            redirect:'/databaseTools/tableManagement'
        }
     
    ]
})
export default router


