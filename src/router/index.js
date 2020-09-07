// const router = new VueRouter({
//     routes: [

//     ]

// })
// main.js import 会进入这里找routes 这个文件太多内容 可以分担给routers.js 再从routers.js 引入
import Vue from 'vue'
import VueRouter from 'vue-router';
import Home from  '../components/home.vue';
import LoginForm from '../components/login.vue';
import CreateCluster from  '../components/k8s/cluster/createCluster.vue'
import ClusterList from  '../components/k8s/cluster/clusterList.vue'

Vue.use(VueRouter);

// 解决多次点击 路由重复 bug
const originalReplace = VueRouter.prototype.replace;
VueRouter.prototype.replace = function replace(location) {
    return originalReplace.call(this, location).catch(err => err);
};

const routes = [
    {
        path: '/login',
        name: 'login',
        component: LoginForm,
        meta: {
            isLogin: true,
            title: '登录'
        }
    },
    // {
    //     path: '/home',
    //     name: 'home',
    //     component: Home
    // },
    {
        path: '/',
        redirect: '/home'
    },
    {
        path: '/home',
        name: 'home',
        component: Home,
        meta: {
            isLogin: true,
            title: '首页'
        },
        children: [
            {
                path: '/createCluster',
                name: 'createCluster',
                // component:resolve=>{require(['@/components/k8s/cluster/createCluster'],resolve);}
                component: CreateCluster,
            },
            {
                path: '/k8s/cluster/clusterList',
                name: 'clusterList',
                // component:resolve=>{require(['@/components/k8s/cluster/createCluster'],resolve);}
                component: ClusterList,
            },
            {
                path: '/k8s/cluster/clusterDetail',
                name: 'clusterDetail',
                component: resolve=>{require(['@/components/k8s/cluster/clusterDetail'],resolve);},
                // component: ClusterList,
            },
        ]
      },
]

const router = new VueRouter({
    routes,
    // mode: 'history'
})

router.beforeEach((to,from,next) => {
    // 先从localStorage获取username
    // console.log(to+from+next)
    console.log(to.meta.title+to.meta.isLogin)
    let username = JSON.parse(localStorage.getItem('username'))
    next();
    console.log("username is : "+username);
    if(username  === null) {
        next({path:'/login'});
    }else{
        next();
    }
})

// export default routes 
export default router