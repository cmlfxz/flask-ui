// const router = new VueRouter({
//     routes: [

//     ]

// })
// main.js import 会进入这里找routes 这个文件太多内容 可以分担给routers.js 再从routers.js 引入
import Vue from 'vue'
import VueRouter from 'vue-router';
import Home from  '../components/home.vue';
import LoginForm from '../components/flask-login.vue';
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
                component: ClusterList,
            },
            {
                path: '/k8s/cluster/clusterDetail',
                name: 'clusterDetail',
                component: resolve=>{require(['@/components/k8s/cluster/clusterDetail'],resolve);},
            },
            {
                path: '/k8s/cluster/nodeDetail',
                name: 'nodeDetail',
                component: resolve=>{require(['@/components/k8s/cluster/nodeDetail'],resolve);},
            },
            {
                path: '/k8s/cluster/nodeManage',
                name: 'nodeManage',
                component: resolve=>{require(['@/components/k8s/cluster/nodeManage'],resolve);},
            },
            {
                path: '/k8s/cluster/componentStatus',
                name: 'componentStatus',
                component: resolve=>{require(['@/components/k8s/cluster/componentStatus'],resolve);},
            },
            {
                path: '/k8s/cluster/eventList',
                name: 'eventList',
                component: resolve=>{require(['@/components/k8s/cluster/eventList'],resolve);},
            },
            {
                path: '/k8s/cluster/apiTest',
                name: 'apiTest',
                component: resolve=>{require(['@/components/k8s/cluster/apiTest'],resolve);},
            },
            //storage
            {
                path: '/k8s/storage/storageClass',
                name: 'storageClass',
                component: resolve=>{require(['@/components/k8s/storage/storageClass'],resolve);},
            }, 
            {
                path: '/k8s/storage/pv',
                name: 'pv',
                component: resolve=>{require(['@/components/k8s/storage/pv'],resolve);},
            }, 
            {
                path: '/k8s/storage/pvc',
                name: 'pvc',
                component: resolve=>{require(['@/components/k8s/storage/pvc'],resolve);},
            }, 
            // project
            {
                path: '/k8s/project/project',
                name: 'project',
                component: resolve=>{require(['@/components/k8s/project/project'],resolve);},
            }, 
            {
                path: '/k8s/project/namespace',
                name: 'namespace',
                component: resolve=>{require(['@/components/k8s/project/namespace'],resolve);},
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