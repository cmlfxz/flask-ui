
<template>
    <div class="layout">
        <Layout>
            <Sider ref="side1" hide-trigger collapsible :collapsed-width="78" v-model="isCollapsed">
                <!-- <Menu active-name="1" theme="dark" width="auto" :class="menuitemClasses"> -->
                <Menu :open-names="['app']" :theme="theme2" width="auto" :class="menuitemClasses">
                    <Submenu name="cluster">
                        <template slot='title'><Icon type="ios-paper" />集群管理</template>
                        <MenuItem name="cluster-1"><router-link :to="{ name: 'createCluster'}"> 创建集群 </router-link></MenuItem>
                        <MenuItem name="cluster-2"><router-link :to="{ name: 'clusterList'}"> 集群列表 </router-link></MenuItem>
                        <MenuItem name="cluster-3"><router-link :to="{ name: 'clusterDetail'}"> 集群详情 </router-link></MenuItem>
                        <MenuItem name="cluster-4"><router-link :to="{ name: 'nodeDetail'}"> 节点详情 </router-link></MenuItem>
                        <MenuItem name="cluster-5"><router-link :to="{ name: 'nodeManage'}"> 节点管理 </router-link></MenuItem>
                        <MenuItem name="cluster-6"><router-link :to="{ name: 'componentStatus'}"> 组件状态 </router-link></MenuItem>
                        <MenuItem name="cluster-7"><router-link :to="{ name: 'eventList'}"> 事件列表 </router-link></MenuItem>
                        <MenuItem name="cluster-8"><router-link :to="{ name: 'apiTest'}"> API测试 </router-link></MenuItem>
                    </Submenu>
                    <Submenu name="project">
                        <template slot="title"><Icon type="ios-people" />项目管理</template>
                        <MenuItem name="project-1" :to="{ name: 'project'}">项目配置</MenuItem>
                        <MenuItem name="project-2" :to="{ name: 'createNamespace'}">添加命名空间</MenuItem>
                        <MenuItem name="project-3" :to="{ name: 'namespace'}">命名空间管理</MenuItem>
                    </Submenu>
                    <Submenu name="app">
                        <template slot="title"><Icon type="ios-people" />应用管理</template>
                        <MenuItem name="app-1" :to="{ name: 'scan'}">项目速览</MenuItem>
                        <MenuItem name="app-2" :to="{ name: 'deployment' }">部署管理</MenuItem>
                        <MenuItem name="app-3" :to="{ name: 'pod'}">Pod管理</MenuItem>
                        <MenuItem name="app-10" :to="{ name: 'hpa'}">hpa管理</MenuItem>
                        <MenuItem name="app-4" :to="{ name: 'configMap'}">配置管理</MenuItem>
                        <MenuItem name="app-5" :to="{ name: 'secret'}">保密字典</MenuItem>
                        <MenuItem name="app-6" :to="{ name: 'daemonSet'}">守护应用</MenuItem>
                        <MenuItem name="app-7" :to="{ name: 'statefulSet'}">有状态应用</MenuItem>
                        <MenuItem name="app-8" :to="{ name: 'networkPolicy'}">k8s网络策略</MenuItem>
                        <MenuItem name="app-9" :to="{ name: 'istioPolicy'}">isito网络策略</MenuItem>
                    </Submenu>
                    <Submenu name="service">
                        <template slot="title"><Icon type="ios-people" />服务管理</template>
                        <MenuItem name="service-1" :to="{ name: 'gateway'}">gateway管理</MenuItem>
                        <MenuItem name="service-2" :to="{ name: 'ingress'}">ingress管理</MenuItem>
                        <MenuItem name="service-3" :to="{ name: 'service'}">service管理</MenuItem>
                        <MenuItem name="service-4" :to="{ name: 'virtualService'}">虚服务管理</MenuItem>
                        <MenuItem name="service-5" :to="{ name: 'destinationRule'}">路由规则管理</MenuItem>
                    </Submenu>
                    <Submenu name="storage">
                        <template slot="title"><Icon type="ios-people" />存储管理</template>
                        <MenuItem name="storage-1" :to="{ name: 'storageClass'}">存储类管理</MenuItem>
                        <MenuItem name="storage-2" :to="{ name: 'pv'}">PV管理</MenuItem>
                        <MenuItem name="storage-3" :to="{ name: 'pvc'}">PVC管理</MenuItem>
                    </Submenu>
                    <Submenu name="task">
                        <template slot="title"><Icon type="ios-people" />任务管理</template>
                        <MenuItem name="task-1" :to="{ name: 'job'}">批处理任务</MenuItem>
                        <MenuItem name="task-2" :to="{ name: 'cronjob'}">定时任务</MenuItem>
                    </Submenu>
                    <Submenu name="setting">
                        <template slot="title"><Icon type="ios-people" />系统配置</template>
                        <MenuItem name="setting-1" :to="{ name: 'env'}">环境管理</MenuItem>
                    </Submenu>
                </Menu>
            </Sider>
            <Layout>
                <Header :style="{padding: 0}" class="layout-header-bar">
                    <div style="float: left;margin: 0 20px;" >
                    <!-- 增加header -->
                    <!-- {{ sharedState.clusterName }}
                    {{ sharedState.namespace }} -->
                    <!-- {{ sharedState.clusterList }}
                    {{ sharedState.namespaceList }} -->
                    <template v-if="sharedState.clusterList.length != 0" >
                        <!-- model应该绑定啥?  全局变量-->
                        <span>集群: </span>
                        <Select  v-model="sharedState.clusterName" style="width:200px;margin-right: 10px" @on-change="changeCluster()">
                            <template v-for="cluster in sharedState.clusterList" >
                                <!-- state的集群名字和localStorage的名字相等 ，则选上 -->
                                <Option  :key="cluster" :value="cluster" v-if="cluster === 'sharedState.clusterName' "  selected>{{ cluster }}</Option>
                                <Option :key="cluster" :value="cluster" v-else>{{ cluster }} </Option>
                            </template>
                        </Select>
                    </template>
                    <template v-if="sharedState.namespaceList.length != 0" >
                        <span>命名空间: </span>
                        <Select v-model="sharedState.namespace" style="width:300px" @on-change="changeNamespace()">
                            <template v-for="namespace in sharedState.namespaceList" >
                                <!-- state的集群名字和localStorage的名字相等 ，则选上 -->
                                <Option  :key="namespace" :value="namespace" v-if="namespace === 'sharedState.namespace' "  selected>{{ namespace }}</Option>
                                <Option :key="namespace" :value="namespace" v-else>{{ namespace }} </Option>
                            </template>
                            <Option value="all">all</Option>
                        </Select>
                    </template>
                    </div>
                    <!-- <Icon @click.native="collapsedSider" :class="rotateIcon" :style="{margin: '0 20px'}" type="md-menu" size="24"></Icon> -->
                    <div class="header-right">
                        <Dropdown>
                            <a href="javascript:void(0)">
                                {{ username }}
                                <Icon type="ios-arrow-down"></Icon>
                            </a>
                            <DropdownMenu slot="list">
                                <DropdownItem><a @click="logout">退出</a></DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                </Header>
                <Content :style="{margin: '20px', background: '#fff', minHeight: '841px'}">
                    <router-view></router-view>
                </Content>
            </Layout>
        </Layout>
    </div>
</template>
<script>
    import store from '@/store';
    import axios from 'axios';
    export default {
        name: 'Home',
        data () {
            return {
                isCollapsed: false,
                username: '',
                theme2: 'light',
                sharedState: store.state,
            }
        },
        computed: {
            rotateIcon () {
                return [
                    'menu-icon',
                    this.isCollapsed ? 'rotate-icon' : ''
                ];
            },
            menuitemClasses () {
                return [
                    'menu-item',
                    this.isCollapsed ? 'collapsed-menu' : ''
                ]
            }
        },


        methods: {
            collapsedSider () {
                this.$refs.side1.toggleCollapse();
            },
            logout() {
                localStorage.removeItem("username");
                this.$router.push('/login')
            },
            async changeCluster(){
                let cluster = this.sharedState.clusterName;
                if(cluster){
                    localStorage.setItem('currentCluster',cluster)
                    // 和 namespace下拉联动，其实是设置全局变量
                    let namespace_list  = await this.getNamespaceList(cluster)
                    console.log('changeCluster 获取到的命名空间:',namespace_list)
                    if(namespace_list == null) {
                        console.log('changeCluster 获取不到命名空间信息')
                        return
                        // do anything ?
                    }else{
                        if(namespace_list.length > 0){
                            let currentNameSpace = localStorage.getItem('currentNameSpace')
                            console.log('changeCluster 获取到的缓存命名空间:',currentNameSpace)
                            // bug && currentNameSpace != 'all all 决定不加入 namespace_list
                            if(namespace_list.indexOf(currentNameSpace) != -1  || currentNameSpace ==='all'){
                                // 缓存的ns在ns列表中
                                store.setNamespace(currentNameSpace)
                            }else {
                                // 当前集群没有缓存的命名空间怎么办,以列表第一个作为缓存
                                localStorage.setItem('currentNameSpace',namespace_list[0])
                                store.setNamespace(namespace_list[0])
                            }
                            store.setNamespaceList(namespace_list)
                        }
                    }

                }
                
            },
            changeNamespace(){
                // alert('ns change')
                let namespace = this.sharedState.namespace
                if(namespace){
                    localStorage.setItem('currentNameSpace',namespace)
                }
            },
            async  getClusterList() {
                try {
                    let response = await axios({
                        method: 'post',
                        url: 'http://flask-admin:8081' + "/frontend_k8s"+"/get_cluster_name_list",
                    })
                    // console.log(response.data);
                    return response.data;
                } catch (error) {
                    console.error(error);
                    return null;
                }
            },

            async  getNamespaceList(cluster_name) {
                console.log("请求命名空间:",cluster_name)
                try {
                    let response = await axios({
                        method: 'post',
                        url: 'http://flask-gateway:8000' + "/k8s"+"/get_namespace_name_list",
                        headers: {'cluster_name':cluster_name},
                    })
                    // console.log(response.data);
                    return response.data;
                } catch (error) {
                    console.error(error);
                    return null;
                }
            },
            async init_cluster_ns(){
                // console.log(1)
                let currentCluster = localStorage.getItem('currentCluster')
                let currentNameSpace = localStorage.getItem('currentNameSpace')
                console.log("缓存的集群:",currentCluster,"缓存的命名空间:",currentNameSpace)
                if(currentCluster == '' || currentCluster==null) {
                    let  cluster_list = await this.getClusterList()
                    console.log("cluster_sss:",cluster_list)
                    if(cluster_list == null) {
                        console.log('获取不到集群信息')
                        return
                        // do anything ?
                    }else{
                        console.log('获取到集群信息为:',cluster_list)
                        if(cluster_list.length > 0){
                            console.log("从后台获取到的第一个集群名称",cluster_list[0]);
                            localStorage.setItem('currentCluster',cluster_list[0])
                            // 要不要设置state
                            store.setClusterList(cluster_list)
                            store.setClusterName(cluster_list[0])
                            console.log(' this.sharedState.clusterList:', this.sharedState.clusterList)
                            
                        }
                    } 
                }
                // console.log(2)
                if(currentNameSpace == '' || currentNameSpace == null) {
                    console.log("localStorage.currentNameSpace:",currentNameSpace)
                    // 获取命名空间的名称 bug 因为axios是异步，已经改为同步
                    let currentCluster = localStorage.getItem('currentCluster')
                    console.log('获取命名空间先获取集群缓存: ',currentCluster)
                    if (currentCluster == '' || currentCluster==null) return
                    // 从后台获取
                    let namespace_list  = await this.getNamespaceList(currentCluster)
                    console.log('获取到的命名空间:',namespace_list)
                    if(namespace_list == null) {
                        console.log('获取不到命名空间信息')
                        return
                        // do anything ?
                    }else{
                        console.log('获取到命名空间信息为:',namespace_list)
                        if(namespace_list.length > 0){
                            console.log("从后台获取到的第一个命名空间名称",namespace_list[0]);
                            localStorage.setItem('currentNameSpace',namespace_list[0])
                            // 要不要设置state
                            store.setNamespaceList(namespace_list)
                            store.setNamespace(namespace_list[0])
                        }
                    }
                }
                // console.log(3)
            },
            async  local_init_cluster_ns(){
                let  cluster_list = await this.getClusterList()
                if(cluster_list == null) {
                    console.log('local获取不到集群信息')
                    return
                }else{
                    console.log('local获取到集群信息为:',cluster_list)
                    if(cluster_list.length > 0){
                        let currentCluster =localStorage.getItem('currentCluster')
                        if(currentCluster){
                            store.setClusterName(currentCluster)
                        }
                        store.setClusterList(cluster_list)
                        console.log('local this.sharedState.clusterName:', this.sharedState.clusterName)
                        
                    }
                } 
                // 必须是当前缓存的集群
                let currentCluster = localStorage.getItem('currentCluster')
                if (currentCluster == '' || currentCluster==null) return
                let namespace_list  = await this.getNamespaceList(currentCluster)
                console.log('local 获取到的命名空间:',namespace_list)
                if(namespace_list == null) {
                    console.log('local 获取不到命名空间信息')
                    return
                }else{
                    if(namespace_list.length > 0){
                        let currentNameSpace = localStorage.getItem('currentNameSpace')
                        console.log('local 获取到的缓存命名空间:',currentNameSpace)
                        if(currentNameSpace){
                            store.setNamespace(currentNameSpace)
                        }
                        store.setNamespaceList(namespace_list)
                    }
                }
            }

        },
        created: function() {
            console.log('created')
            // 缓存初始化 应该是全局初始化
            this.init_cluster_ns()

        },
        mounted: function() {
            console.log('mounted')
            let username = JSON.parse(localStorage.getItem('username'))
            if(username) {
                this.username = username
            }else {
                this.username = '匿名'
            }
            // 获取集群列表，从localStorage设置选中项，每次都执行
            this.local_init_cluster_ns()

        },
    }
</script>

<style scoped>
    .layout{
        border: 1px solid #d7dde4;
        background: #f5f7f9;
        position: relative;
        border-radius: 4px;
        overflow: hidden;
    }
    .layout-header-bar{
        background: #fff;
        box-shadow: 0 1px 1px rgba(0,0,0,.1);
    }
    .layout-logo-left{
        width: 90%;
        height: 30px;
        background: #5b6270;
        border-radius: 3px;
        margin: 15px auto;
    }
    .menu-icon{
        transition: all .3s;
    }
    .rotate-icon{
        transform: rotate(-90deg);
    }
    .menu-item span{
        display: inline-block;
        overflow: hidden;
        width: 69px;
        text-overflow: ellipsis;
        white-space: nowrap;
        vertical-align: bottom;
        transition: width .2s ease .2s;
    }
    .menu-item i{
        transform: translateX(0px);
        transition: font-size .2s ease, transform .2s ease;
        vertical-align: middle;
        font-size: 16px;
    }
    .collapsed-menu span{
        width: 0px;
        transition: width .2s ease;
    }
    .collapsed-menu i{
        transform: translateX(5px);
        transition: font-size .2s ease .2s, transform .2s ease .2s;
        vertical-align: middle;
        font-size: 22px;
    }
    .header-right {
        position: absolute;
        right: 0;
        margin-right: 25px;
    }
</style>
