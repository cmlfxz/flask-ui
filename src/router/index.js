// const router = new VueRouter({
//     routes: [

//     ]

// })
// main.js import 会进入这里找routes 这个文件太多内容 可以分担给routers.js 再从routers.js 引入
import Vue from 'vue'
import VueRouter from 'vue-router';
import Main from  '../components/main.vue';
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
    {
        path: '/',
        name: '_home',
        redirect: '/home',
        component: Main,
        children: [

            {
                path: '/home',
                name: 'home',
                component: resolve=>{require(['@/components/post/postList'],resolve);},
                // component: resolve=>{require(['@/components/k8s/cluster/eventList'],resolve);},
                // component: () =>import ('@/components/k8s/cluster/clusterDetail.vue'),
                meta: {
                    isLogin: true,
                    title: '首页'
                },
            },
            // link
            {
                path: '/siteManage',
                name: 'siteManage',
                component:resolve=>{require(['@/components/link/siteManage'],resolve);}
            },
            // post
            {
                path: '/postAdd',
                name: 'postAdd',
                component: () =>import ('@/components/post/postAdd.vue'),
            },
            {
                path: '/postEdit',
                name: 'postEdit',
                component: () =>import ('@/components/post/postEdit.vue'),
            },
            {
                path: '/postList',
                name: 'postList',
                component: () =>import ('@/components/post/postList.vue'),
            },
            {
                path: '/postDetail',
                name: 'postDetail',
                component: () =>import ('@/components/post/postDetail.vue'),
            },
            // auth 
            {
                path: '/serviceAccount',
                name: 'serviceAccount',
                component:resolve=>{require(['@/components/k8s/auth/serviceAccount'],resolve);}
            },
            {
                path: '/clusterRole',
                name: 'clusterRole',
                component:resolve=>{require(['@/components/k8s/auth/clusterRole'],resolve);}
            },
            {
                path: '/clusterRoleDetail',
                name: 'clusterRoleDetail',
                component:resolve=>{require(['@/components/k8s/auth/clusterRoleDetail'],resolve);}
            },
            {
                path: '/clusterRoleBinding',
                name: 'clusterRoleBinding',
                component:resolve=>{require(['@/components/k8s/auth/clusterRoleBinding'],resolve);}
            },
            {
                path: '/role',
                name: 'role',
                component:resolve=>{require(['@/components/k8s/auth/role'],resolve);}
            },
            {
                path: '/roleDetail',
                name: 'roleDetail',
                component:resolve=>{require(['@/components/k8s/auth/roleDetail'],resolve);}
            },
            {
                path: '/roleBinding',
                name: 'roleBinding',
                component:resolve=>{require(['@/components/k8s/auth/roleBinding'],resolve);}
            },
            // cluster
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
                path: '/k8s/project/createNamespace',
                name: 'createNamespace',
                component: resolve=>{require(['@/components/k8s/project/createNamespace'],resolve);},
            }, 
            {
                path: '/k8s/project/namespace',
                name: 'namespace',
                component: resolve=>{require(['@/components/k8s/project/namespace'],resolve);},
            }, 
            // workload
            {
                path: '/k8s/workload/deployment',
                name: 'deployment',
                // component: resolve=>{require(['@/components/k8s/workload/deployment'],resolve);},
                component: () => import ('@/components/k8s/workload/deployment.vue')
            }, 
            {
                path: '/k8s/workload/deploymentDetail',
                name: 'deploymentDetail',
                component: resolve=>{require(['@/components/k8s/workload/deploymentDetail'],resolve);},
            }, 
            {
                path: '/k8s/workload/scan',
                name: 'scan',
                component: resolve=>{require(['@/components/k8s/workload/scan'],resolve);},
            }, 
            {
                path: '/k8s/workload/pod',
                name: 'pod',
                component: resolve=>{require(['@/components/k8s/workload/pod'],resolve);},
            }, 
            {
                path: '/k8s/workload/podDetail',
                name: 'podDetail',
                component: resolve=>{require(['@/components/k8s/workload/podDetail'],resolve);},
            }, 
            {
                path: '/k8s/workload/hpa',
                name: 'hpa',
                component: resolve=>{require(['@/components/k8s/workload/hpa'],resolve);},
            }, 
            {
                path: '/k8s/config/configMap',
                name: 'configMap',
                component: resolve=>{require(['@/components/k8s/config/configMap'],resolve);},
            }, 
            {
                path: '/k8s/config/configMapDetail',
                name: 'configMapDetail',
                component: resolve=>{require(['@/components/k8s/config/configMapDetail'],resolve);},
            }, 
            {
                path: '/k8s/config/secret',
                name: 'secret',
                component: resolve=>{require(['@/components/k8s/config/secret'],resolve);},
            }, 
            {
                path: '/k8s/config/secretDetail',
                name: 'secretDetail',
                component: resolve=>{require(['@/components/k8s/config/secretDetail'],resolve);},
            }, 
            {
                path: '/k8s/workload/daemonSet',
                name: 'daemonSet',
                component: resolve=>{require(['@/components/k8s/workload/daemonSet'],resolve);},
            }, 
            {
                path: '/k8s/workload/statefulSet',
                name: 'statefulSet',
                component: resolve=>{require(['@/components/k8s/workload/statefulSet'],resolve);},
            }, 
            {
                path: '/k8s/security/networkPolicy',
                name: 'networkPolicy',
                component: resolve=>{require(['@/components/k8s/security/networkPolicy'],resolve);},
            }, 
            {
                path: '/k8s/security/istioPolicy',
                name: 'istioPolicy',
                component: resolve=>{require(['@/components/k8s/security/istioPolicy'],resolve);},
            }, 
            // servie 
            {
                path: '/k8s/istio/gateway',
                name: 'gateway',
                component: resolve=>{require(['@/components/k8s/istio/gateway'],resolve);},
            }, 
            {
                path: '/k8s/istio/virtualService',
                name: 'virtualService',
                component: resolve=>{require(['@/components/k8s/istio/virtualService'],resolve);},
            }, 
            {
                path: '/k8s/istio/destinationRule',
                name: 'destinationRule',
                component: resolve=>{require(['@/components/k8s/istio/destinationRule'],resolve);},
            }, 
            {
                path: '/k8s/service/ingress',
                name: 'ingress',
                component: resolve=>{require(['@/components/k8s/service/ingress'],resolve);},
            }, 
            {
                path: '/k8s/service/service',
                name: 'service',
                component: resolve=>{require(['@/components/k8s/service/service'],resolve);},
            }, 
            // task
            {
                path: '/k8s/task/job',
                name: 'job',
                component: resolve=>{require(['@/components/k8s/task/job'],resolve);},
            }, 
            {
                path: '/k8s/task/cronjob',
                name: 'cronjob',
                component: resolve=>{require(['@/components/k8s/task/cronjob'],resolve);},
            }, 
            // setting
            {
                path: '/setting/env',
                name: 'env',
                component: resolve=>{require(['@/components/setting/env'],resolve);},
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
    // console.log(to.meta.title+to.meta.isLogin)
    // bug错误，加入用户第一次登陆，这里会出现一直跳转到login
    console.log("to.name:",to.name)
    let username = localStorage.getItem('username')
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