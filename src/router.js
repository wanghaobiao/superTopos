import VueRouter from 'vue-router'
import AddBlog from './components/addBlog'
import UpdateBlog from './components/updateBlog'
import ProjectList from './components/project'
import systemConfigParams from './components/page/systemConfig/params'
import HomeBlog from './components/HomeBlog'
import Test from './components/test'
import Vue from 'vue'
import tools from './../src/components/util/util'

// 1、创建路由对象
var router = new VueRouter({
    routes: [
        { path: '/project', component: ProjectList },
        { path: '/systemConfig/params', component: systemConfigParams },
        { path: '/test', component: Test },
        { path: '/addBlog', component: AddBlog },
        { path: '/updateBlog/:id', component: UpdateBlog },
        { path: '/', component: HomeBlog }
    ]
})

// 2、把路由对象暴露出去
export default router