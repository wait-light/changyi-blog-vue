import Vue from 'vue'
import VueRouter from 'vue-router'
import Aplayer from 'vue-aplayer'
import mavonEditor from 'mavon-editor' //MarkDown编辑器
import 'mavon-editor/dist/css/index.css'

Vue.use(mavonEditor)
Vue.use(VueRouter)
Vue.component("aplayer", Aplayer) //音乐播放组件
const routes = [{
    path: '/',
    name: 'home',
    redirect: '/index/1',
    component: () =>
        import('../components/home/Home.vue'),
    children: [{
        path: '/login',
        name: 'login',
        component: () =>
            import('../components/home/login_register/Login.vue') //登录组件
    },
    {
        path: '/register',
        name: 'register',
        component: () =>
            import('../components/home/login_register/register.vue') //注册组件
    },
    {
        path: '/modify_password',
        name: 'modify_password',
        component: () =>
            import('../components/home/login_register/modify_password.vue') //注册组件
    },
    {
        path: '/time',
        name: 'dateArticles',
        component: () =>
            import('../components/home/homeCompone/dateArticles.vue') //归档组件
    },
    {
        path: '/about',
        name: 'About',
        component: () =>
            import('../components/home/About.vue') //关于我
    },
    {
        path: '/index/:page',
        name: 'index',
        component: () =>
            import('../components/home/homeCompone/aritclelist.vue') //文章列表
    },
    {
        path: '/index/type/:type',
        name: 'type_index',
        component: () =>
            import('../components/home/homeCompone/aritclelist.vue') //文章列表
    },
    {
        path: '/index/tag/:tag',
        name: 'tag_index',
        component: () =>
            import('../components/home/homeCompone/aritclelist.vue') //文章列表
    },
    {
        path: '/index',
        redirect: '/index/1'

    },
    {
        path: '/artileDetai/:id',
        name: 'detai',
        component: () =>
            import('../components/home/homeCompone/articleDetail.vue') //文章详情
    },
    {
        path: '/friends',
        name: 'friends',
        component: () =>
            import('../components/home/homeCompone/friends.vue') //友链
    }
    ]
},
{
    path: '/admin',
    name: 'admin',
    component: () =>
        import('../components/admin/admin_home.vue'),
        redirect: '/admin/message',
    children: [{
        path: '/admin/article/add_edit',
        name: 'ariticle_add_edit',
        component: () =>
            import('../components/admin/admin_article_addArticle.vue')//文章编辑组件
    },
    {
        path: '/admin/message',
        name: 'admin_message',
        component: () =>
            import('../components/admin/admin_home_message.vue')//后台主页基本信息展示
    },
    {
        path: '/admin/article/edit/:id',
        name: 'ariticle_edit',
        component: () =>
            import('../components/admin/admin_article_addArticle.vue')//文章编辑组件
    },
    {
        path: '/admin/tags',
        name: 'admin_tags',
        component: () =>
            import('../components/admin/admin_tags.vue')//管理标签表
    },
    {
        path: '/admin/types',
        name: 'admin_types',
        component: () =>
            import('../components/admin/admin_types.vue')//管理类别表
    },
    {
        path: '/admin/article_list',
        name: 'articles',
        component: () =>
            import('../components/admin/admin_article_list.vue') //管理文章列表
    },
    {
        path: '/admin/users',
        name: 'users',
        component: () =>
            import('../components/admin/admin_users.vue') //管理用户列表
    },
    {
        path: '/admin/comments',
        name: 'admin_comments',
        component: () =>
            import('../components/admin/admin_commentlist.vue') //管理评论列表
    },
    {
        path: '/admin/setting_music',
        name: 'admin_setting_music',
        component: () =>
            import('../components/admin/admin_music_setting.vue') //管理音乐设定
    },
    {
        path: '/admin/setting_theme',
        name: 'admin_setting_theme',
        component: () =>
            import('../components/admin/admin_theme_setting.vue') //管理主题设定
    },
    {
        path: '/admin/setting_basic',
        name: 'admin_setting_basic',
        component: () =>
            import('../components/admin/admin_basic_setting.vue') //管理基本设定
    },
    {
        path: '/admin/about',
        name: 'admin_about',
        component: () =>
            import('../components/admin/admin_about.vue') //管理关于我
    },
    {
        path: '/admin/friends',
        name: 'admin_friends',
        component: () =>
            import('../components/admin/admin_friends.vue') //管理链接
    }]
}]

const router = new VueRouter({
    mode:"history",
    routes
})

router.beforeEach((to, from, next) => {
    if (to.fullPath.indexOf("admin") != -1) { //前往后台需要权限校验
        if (Vue.prototype.$basicConfig != undefined) {
            if (Vue.prototype.$basicConfig.user == "anonymousUser") {//权限不足，返回主页
                return next("/index/1")
            } else if (Vue.prototype.$basicConfig.user.userType >= 1) { //权限足够，放行
                return next()
            } else {
                return next("/index/1")
            }
        }
    }
    return next()
})

export default router