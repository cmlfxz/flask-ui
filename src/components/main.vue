
<template>
    <div class="layout">
        <Layout>
            <Sider class="sidebar" ref="side1" hide-trigger collapsible :collapsed-width="78" v-model="isCollapsed">
                <!-- <Menu active-name="1" theme="dark" width="auto" :class="menuitemClasses"> --> 
                    <!-- :open-names="['app']"   -->
                    <Menu  ref="sideBarMenu"   :open-names="openNames"  :theme="theme2" width="auto" :active-name="activeMenuItem" @on-select="menuItemSelect" @on-open-change="openChange" :class="menuitemClasses"  accordion>
                    <Submenu name="post">
                        <template slot="title"> <Icon type="ios-book" /> 笔记</template>
                        <MenuItem name="postList" :to="{ name: 'postList'}">笔记列表</MenuItem>
                        <MenuItem name="postAdd" :to="{ name: 'postAdd'}">写笔记</MenuItem>
                    </Submenu>
                    <Submenu name="project">
                        <template slot="title"> <Icon type="ios-photos" /> 项目管理</template>
                        <MenuItem name="project" :to="{ name: 'project'}">项目配置</MenuItem>
                        <MenuItem name="createNamespace" :to="{ name: 'createNamespace'}">添加命名空间</MenuItem>
                        <MenuItem name="namespace" :to="{ name: 'namespace'}">命名空间管理</MenuItem>
                    </Submenu>

                    <Submenu name="cluster">
                        <template slot='title'><Icon type="ios-stats" />集群管理</template>
                        <MenuItem name="createCluster" :to="{ name: 'createCluster'}"> 创建集群 </MenuItem>
                        <MenuItem name="clusterList" :to="{ name: 'clusterList'}">  集群列表 </MenuItem>
                        <MenuItem name="clusterDetail" :to="{ name: 'clusterDetail'}">  集群详情 </MenuItem>
                        <MenuItem name="nodeDetail" :to="{ name: 'nodeDetail'}">  节点详情 </MenuItem>
                        <MenuItem name="nodeManage" :to="{ name: 'nodeManage'}">  节点管理 </MenuItem>
                        <MenuItem name="componentStatus" :to="{ name: 'componentStatus'}"> 组件状态 </MenuItem>
                        <MenuItem name="eventList" :to="{ name: 'eventList'}"> 事件列表 </MenuItem>
                        <MenuItem name="apiTest" :to="{ name: 'apiTest'}">  API测试 </MenuItem>
                    </Submenu>
                    <Submenu name="workload">
                        <template slot="title"><Icon type="ios-construct" />应用管理</template>
                        <MenuItem name="scan" :to="{ name: 'scan'}">项目速览</MenuItem>
                        <MenuItem name="deployment" :to="{ name: 'deployment' }">部署管理</MenuItem>
                        <MenuItem name="pod" :to="{ name: 'pod'}">Pod管理</MenuItem>
                        <MenuItem name="hpa" :to="{ name: 'hpa'}">hpa管理</MenuItem>
                        <MenuItem name="configMap" :to="{ name: 'configMap'}">配置管理</MenuItem>
                        <MenuItem name="secret" :to="{ name: 'secret'}">保密字典</MenuItem>
                        <MenuItem name="daemonSet" :to="{ name: 'daemonSet'}">守护应用</MenuItem>
                        <MenuItem name="statefulSet" :to="{ name: 'statefulSet'}">有状态应用</MenuItem>
                        <MenuItem name="networkPolicy" :to="{ name: 'networkPolicy'}">k8s网络策略</MenuItem>
                        <MenuItem name="istioPolicy" :to="{ name: 'istioPolicy'}">isito网络策略</MenuItem>
                    </Submenu>
                    <Submenu name="service">
                        <template slot="title"><Icon type="ios-snow" />服务管理</template>
                        <MenuItem name="gateway" :to="{ name: 'gateway'}">gateway管理</MenuItem>
                        <MenuItem name="ingress" :to="{ name: 'ingress'}">ingress管理</MenuItem>
                        <MenuItem name="service" :to="{ name: 'service'}">service管理</MenuItem>
                        <MenuItem name="virtualService" :to="{ name: 'virtualService'}">虚服务管理</MenuItem>
                        <MenuItem name="destinationRule" :to="{ name: 'destinationRule'}">路由规则管理</MenuItem>
                    </Submenu>
                    <Submenu name="storage">
                        <template slot="title"><Icon type="logo-buffer" />存储管理</template>
                        <MenuItem name="storageClass" :to="{ name: 'storageClass'}">存储类管理</MenuItem>
                        <MenuItem name="pv" :to="{ name: 'pv'}">PV管理</MenuItem>
                        <MenuItem name="pvc" :to="{ name: 'pvc'}">PVC管理</MenuItem>
                    </Submenu>
                    <Submenu name="task">
                        <template slot="title"><Icon type="ios-clock" />任务管理</template>
                        <MenuItem name="job" :to="{ name: 'job'}">批处理任务</MenuItem>
                        <MenuItem name="cronjob" :to="{ name: 'cronjob'}">定时任务</MenuItem>
                    </Submenu>
                    <Submenu name="auth">
                        <template slot="title"><Icon type="ios-clock" />权限管理</template>
                        <MenuItem name="serviceAccount" :to="{ name: 'serviceAccount'}">账号管理</MenuItem>
                        <MenuItem name="clusterRole" :to="{ name: 'clusterRole'}">集群角色</MenuItem>
                        <MenuItem name="clusterRoleBinding" :to="{ name: 'clusterRoleBinding'}">集群角色绑定</MenuItem>
                        <MenuItem name="role" :to="{ name: 'role'}">普通角色</MenuItem>
                        <MenuItem name="roleBinding" :to="{ name: 'roleBinding'}">普通角色绑定</MenuItem>
                    </Submenu>
                    <Submenu name="setting">
                        <template slot="title"><Icon type="md-settings" />系统配置</template>
                        <MenuItem name="env" :to="{ name: 'env'}">环境管理</MenuItem>
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
                        <template v-if="sharedState.clusterList.length != 0 && show_cluster_page_list.indexOf($route.name) != -1" >
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
                        <template v-if="sharedState.namespaceList.length != 0 && show_namespace_page_list.indexOf($route.name) != -1" >
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
                        <!-- {{ $route.name }} -->
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
                    <router-view v-if="isRouterAlive" ></router-view>
                </Content>
            </Layout>
        </Layout>
    </div>
</template>
<script>
    import store from '@/store';
    import axios from 'axios';
    import { get_cluster_name_list,get_namespace_name_list } from '@/api'
    export default {
        name: 'Home',
        data () {
            return {
                isCollapsed: false,
                username: '',
                theme2: 'light',
                sharedState: store.state,
                // 激活的左侧菜单栏
                activeMenuItem: '',
                // 激活的子菜单
                openNames:[],
                // 配置显示集群的页面
                show_cluster_page_list:['namespace','clusterDetail','nodeDetail','nodeManage','componentStatus','eventList','apiTest','storageClass','pv','pvc','deployment','scan',
                    'pod','hpa','configMap','secret','daemonSet','statefulSet','networkPolicy','istioPolicy','gateway','virtualService','destinationRule','ingress','service','job','cronjob','serviceAccount',
                    'clusterRole','clusterRoleBinding','role','roleBinding'
                ],
                // 配置显示命名空间的页面
                show_namespace_page_list:['eventList','apiTest','pvc','deployment','scan','pod','hpa','configMap','secret','daemonSet','statefulSet','networkPolicy','istioPolicy','gateway',
                    'virtualService','destinationRule','ingress','service','job','cronjob','serviceAccount','role','roleBinding'
                ],
                // 为了扔集群、命名空间改变可以刷新页面
                isRouterAlive: true,
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
            // 集群Select改变事件
            async changeCluster(){
                let cluster = this.sharedState.clusterName;
                if(cluster){
                    localStorage.setItem('currentCluster',cluster)
                    // 发射集群改变事件
                    // this.$bus.$emit('clusterChange')
                    // this.$router.go(0)
                    // 和 namespace下拉联动，其实是设置全局变量
                    let namespace_list  = await this.getNamespaceList(cluster)
                    // console.log('changeCluster 获取到的命名空间:',namespace_list)
                    if(namespace_list == null) {
                        alert('changeCluster 获取不到命名空间信息')
                        return
                    }else{
                        if(namespace_list.length > 0){
                            let currentNameSpace = localStorage.getItem('currentNameSpace')
                            // console.log('changeCluster 获取到的缓存命名空间:',currentNameSpace)
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
                    // 刷新页面
                    this.isRouterAlive = false
                    this.$nextTick(function () {
                        this.isRouterAlive = true
                    })

                }
                
            },
            // 命名空间改变事件
            changeNamespace(){
                // alert('ns change')
                let namespace = this.sharedState.namespace
                if(namespace){
                    localStorage.setItem('currentNameSpace',namespace)
                }
                // 发射命名空间改变事件
                // this.$bus.$emit('namespaceChange')
                // this.$router.go(0)
                // 刷新页面
                this.isRouterAlive = false
                this.$nextTick(function () {
                    this.isRouterAlive = true
                })
            },
            async  getClusterList() {
                try {
                    let response = await axios({
                        method: 'post',
                        url: get_cluster_name_list,
                    })
                    // console.log(response.data);
                    return response.data;
                } catch (error) {
                    console.error(error);
                    return null;
                }
            },

            async  getNamespaceList(cluster_name) {
                // console.log("请求命名空间:",cluster_name)
                try {
                    let response = await axios({
                        method: 'post',
                        url: get_namespace_name_list,
                        headers: {'cluster_name':cluster_name},
                    })
                    // console.log(response.data);
                    if(response.data.status==500) {
                        this.$Message.error('获取不到命名空间信息')
                        return null
                    }
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
                        alert('获取不到集群信息')
                        return
                    }else{
                        console.log('获取到集群信息为:',cluster_list)
                        if(cluster_list.length > 0){
                            // console.log("从后台获取到的第一个集群名称",cluster_list[0]);
                            localStorage.setItem('currentCluster',cluster_list[0])
                            // 要不要设置state
                            store.setClusterList(cluster_list)
                            store.setClusterName(cluster_list[0])
                            // console.log(' this.sharedState.clusterList:', this.sharedState.clusterList)
                            
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
            },
            async  local_init_cluster_ns(){
                let  cluster_list = await this.getClusterList()
                if(cluster_list == null) {
                    alert('local获取不到集群信息')
                    return
                }else{
                    // console.log('local获取到集群信息为:',cluster_list)
                    if(cluster_list.length > 0){
                        let currentCluster =localStorage.getItem('currentCluster')
                        if(currentCluster){
                            store.setClusterName(currentCluster)
                        }
                        store.setClusterList(cluster_list)
                        // console.log('local this.sharedState.clusterName:', this.sharedState.clusterName)
                        
                    }
                } 
                // 必须是当前缓存的集群
                let currentCluster = localStorage.getItem('currentCluster')
                if (currentCluster == '' || currentCluster==null) return
                let namespace_list  = await this.getNamespaceList(currentCluster)
                // console.log('local 获取到的命名空间:',namespace_list)
                // bug 后台返回异常 getNamespaceList 返回的不是null 而是{status: 500, 后台返回: null}
                if(namespace_list == null) {
                    alert('local 获取不到命名空间信息')
                    return
                }else{
                    if(namespace_list.length > 0){
                        let currentNameSpace = localStorage.getItem('currentNameSpace')
                        // console.log('local 获取到的缓存命名空间:',currentNameSpace)
                        if(currentNameSpace){
                            store.setNamespace(currentNameSpace)
                        }
                        store.setNamespaceList(namespace_list)
                    }
                }
            },
            // 左侧菜单栏选择事件
            menuItemSelect(name){
                // alert(name)
                // 设置选中的菜单项
                this.activeMenuItem = name
                // 并且保存到缓存
                localStorage.setItem("activeMenuItem",name)
            },
            // 子菜单选择事件
            openChange(name) {
                // alert(name)
                this.openNames=[name]
                localStorage.setItem("openNames",name)
            }

        },

        created: function() {
            // console.log('created')
            // 缓存初始化 应该是全局初始化
            this.init_cluster_ns()

        },
        mounted: function() {
            // console.log('mounted')
            // 重新设置左侧子菜单
            let openNames = localStorage.getItem("openNames")
            if(openNames){
                this.openNames= [openNames]
                this.$nextTick(()=>{
                    this.$refs.sideBarMenu.updateOpened();
                })
            }else{
                console.log("缓存没有保存激活子菜单项")
                 this.openNames = []
            }

            // console.log("mounted加载之后this.openNames:",this.openNames)
            // 重新设置左侧菜单栏的选中项
            let activeMenuItem = localStorage.getItem("activeMenuItem")
            // console.log("缓存的activeMenuItem:",activeMenuItem)
            if(activeMenuItem){
                this.activeMenuItem = activeMenuItem
                this.$nextTick(()=>{
                    this.$refs.sideBarMenu.updateActiveName();
                })
            }else{
                console.log("缓存没有保存激活菜单项")
                 this.activeMenuItem = ''
            }


            // let username = JSON.parse(localStorage.getItem('username'))
            let username = localStorage.getItem('username')
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
        /* font-weight: 500; */
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
    .sidebar {
        font-weight: 550;
        font-family:Arial, Helvetica, sans-serif;
    }
</style>
