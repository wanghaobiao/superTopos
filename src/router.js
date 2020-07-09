import VueRouter from 'vue-router'
import AddBlog from './components/addBlog'
import UpdateBlog from './components/updateBlog'
import ProjectList from './components/projectList'
import HomeBlog from './components/HomeBlog'

// 1、创建路由对象
var router = new VueRouter({
    routes: [
        { path: '/projectList', component: ProjectList },
        { path: '/addBlog', component: AddBlog },
        { path: '/updateBlog/:id', component: UpdateBlog },
        { path: '/', component: HomeBlog }
    ]
})

// 2、把路由对象暴露出去
export default router