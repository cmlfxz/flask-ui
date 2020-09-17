<template>
    <div>
        <h2>Deployment</h2>
        <i-table border stripe  :columns="deployment" :data="deployment_list" :height="height"></i-table >
        <h2>Service</h2>
        <i-table border stripe  :columns="service" :data="service_list"  :height="height"></i-table >
        <h2>DestinationRule</h2>
        <i-table border stripe  :columns="destination_rule" :data="destination_rule_list"  :height="height"></i-table >
        <h2>VirtualService</h2>
        <i-table border stripe  :columns="virtual_service" :data="virtual_service_list" :height="height" ></i-table >
        <h2>Gateway</h2>
        <i-table border stripe  :columns="gateway" :data="gateway_list"  :height="height"></i-table >
        <h2>Ingress</h2>
        <i-table border stripe  :columns="ingress" :data="ingress_list" :height="height" ></i-table >
        <h2>DaemonSet</h2>
        <i-table border stripe  :columns="daemonset" :data="daemonset_list" :height="height"></i-table >
        <h2>StatefulSet</h2>
        <i-table border stripe  :columns="statefulset" :data="statefulset_list"  :height="height"></i-table >
    </div>
</template>

<script>
import axios from 'axios';
import { get_deployment_list,get_daemonset_list,get_statefulset_list,get_service_list,get_destination_rule_list,get_virtual_service_list,get_ingress_list,get_gateway_list} from  '@/api'
// import store from '@/store'

export default {
    data() {
        return {
            height: "800",
            deployment: [
                {
                    title: '名字',key: 'name'
                },
                {
                    title: '命名空间',key: 'namespace'
                },
                {
                    title: 'info',key: 'info',
                    render: (h, params) => {
                        return h('div', [
                            h('pre', JSON.stringify(params.row.info,undefined,4))
                        ]);
                    }
                }
            ],
            daemonset: [
                {
                    title: '名字',key: 'name'
                },
                {
                    title: '命名空间',key: 'namespace'
                },
                {
                    title: '标签',key: 'labels',width:400,
                    render: (h, params) => {
                        return h('div', [
                            h('pre', JSON.stringify(params.row.labels,undefined,4))
                        ]);
                    }
                },
                {
                    title: '状态',key: 'status',width: 350,
                    render: (h, params) => {
                        return h('div', [
                            h('pre', JSON.stringify(params.row.status,undefined,4))
                        ]);
                    }
                },
                {
                    title: '亲和性',key: 'affinity',
                    render: (h, params) => {
                        return h('div', [
                            h('pre', JSON.stringify(params.row.affinity,undefined,4))
                        ]);
                    }
                },
                {
                    title: '容器',key: 'containers',
                },
                {
                    title: 'host_network',key: 'host_network'
                },
                {
                    title: '创建时间',key: 'create_time'
                },
            ],
            statefulset: [
                {
                    title: '名字',key: 'name'
                },
                {
                    title: '命名空间',key: 'namespace'
                },
                {
                    title: 'info',key: 'labels',width:400,
                    render: (h, params) => {
                        return h('div', [
                            h('pre', JSON.stringify(params.row.info,undefined,4))
                        ]);
                    }
                },
                {
                    title: '容器列表',key: 'container_list',width: 600,
                    render: (h, params) => {
                        return h('div', [
                            h('pre', JSON.stringify(params.row.container_list,undefined,4))
                        ]);
                    }
                },
                {
                    title: 'PVC列表',key: 'pvc_list',
                    render: (h, params) => {
                        return h('div', [
                            h('pre', JSON.stringify(params.row.pvc_list,undefined,4))
                        ]);
                    }
                },
                {
                    title: '创建时间',key: 'create_time'
                },
            ],

            service: [
                {
                    title: '名字',key: 'name'
                },
                {
                    title: '命名空间',key: 'namespace'
                },
                {
                    title: '服务类型',key: 'service_type',
                },
                {
                    title: '端口组',key: 'ports',width:300,
                    render: (h, params) => {
                        return h('div', [
                            h('pre', JSON.stringify(params.row.ports,undefined,4))
                        ]);
                    }
                },
                {
                    title: '端点',key: 'internal_endpoints',width:400,
                    render: (h, params) => {
                        return h('div', [
                            h('pre', JSON.stringify(params.row.internal_endpoints,undefined,4))
                        ]);
                    }
                },
                {
                    title: '标签',key: 'labels',width:300,
                    render: (h, params) => {
                        return h('div', [
                            h('pre', JSON.stringify(params.row.labels,undefined,4))
                        ]);
                    }
                },
                {
                    title: '集群IP',key: 'cluster_ip'
                },
                {
                    title: '选择器',key: 'selector',
                },
                {
                    title: '创建时间',key: 'create_time'
                },
            ],
            destination_rule: [
                {
                    title: '名字',key: 'name'
                },
                {
                    title: '命名空间',key: 'namespace'
                },
                {
                    title: 'host',key: 'host',
                },
                {
                    title: '子集',key: 'subsets',width:300,
                    render: (h, params) => {
                        return h('div', [
                            h('pre', JSON.stringify(params.row.subsets,undefined,4))
                        ]);
                    }
                },
                {
                    title: '流量分发策略',key: 'trafficPolicy',
                },
                {
                    title: '创建时间',key: 'create_time'
                },

            ],

            virtual_service: [
                {
                    title: '名字',key: 'name'
                },
                {
                    title: '命名空间',key: 'namespace'
                },
                {
                    title: 'gateways',key: 'gateways',
                },
                {
                    title: 'hosts',key: 'hosts',
                },
                {
                    title: 'http',key: 'http',width:500,
                    render: (h, params) => {
                        return h('div', [
                            h('pre', JSON.stringify(params.row.http,undefined,4))
                        ]);
                    }
                },
                {
                    title: '创建时间',key: 'create_time'
                },
            ],
            ingress: [
                {
                    title: '名字',key: 'name'
                },
                {
                    title: '命名空间',key: 'namespace'
                },
                {
                    title: '域名列表',key: 'domain_list',
                },
                {
                    title: 'rule',key: 'rule',width:500,
                    render: (h, params) => {
                        return h('div', [
                            h('pre', JSON.stringify(params.row.rule,undefined,4))
                        ]);
                    }
                },
                {
                    title: 'tls',key: 'tls',width:500,
                    render: (h, params) => {
                        return h('div', [
                            h('pre', JSON.stringify(params.row.tls,undefined,4))
                        ]);
                    }
                },
                {
                    title: '创建时间',key: 'create_time'
                },
            ],

            gateway: [
                {
                    title: '名字',key: 'name'
                },
                {
                    title: '命名空间',key: 'namespace'
                },
                {
                    title: 'selector',key: 'selector',
                },
                {
                    title: 'servers',key: 'servers',width:400,
                    render: (h, params) => {
                        return h('div', [
                            h('pre', JSON.stringify(params.row.servers,undefined,4))
                        ]);
                    }
                },
                {
                    title: '域名列表',key: 'domain_list',
                },
                {
                    title: '创建时间',key: 'create_time'
                },
            ],
            deployment_list:[],
            daemonset_list:[],
            statefulset_list:[],
            service_list:[],
            destination_rule_list:[],
            virtual_service_list:[],
            ingress_list:[],
            gateway_list:[],      
        }
    },
    methods: {
        async getObjList(url){
            let cluster = localStorage.getItem('currentCluster')
            let namespace = localStorage.getItem('currentNameSpace')
            if(cluster && namespace && namespace !='all' ){
                let headers = {"cluster_name": cluster}
                let data = {"namespace": namespace}
                try {
                    let response = await axios({
                        method: 'post',
                        url: url,
                        data: data,
                        headers: headers,
                    })
                    // console.log(response.data);
                    return response.data;
                } catch (error) {
                    console.error(error);
                    return null;
                }
            }
        },
        async refresh(){

            let deployment_list  = await this.getObjList(get_deployment_list)
            if(deployment_list){
                this.deployment_list = deployment_list
            }
            let daemonset_list  = await this.getObjList(get_daemonset_list)
            if(daemonset_list){
                this.daemonset_list = daemonset_list
            }
            let statefulset_list  = await this.getObjList(get_statefulset_list)
            if(statefulset_list){
                this.statefulset_list = statefulset_list
            }
            let service_list  = await this.getObjList(get_service_list)
            if(service_list){
                this.service_list = service_list
            }
            let destination_rule_list  = await this.getObjList(get_destination_rule_list)
            if(destination_rule_list){
                this.destination_rule_list = destination_rule_list
            }
            let virtual_service_list  = await this.getObjList(get_virtual_service_list)
            if(virtual_service_list){
                this.virtual_service_list = virtual_service_list
            }
            let ingress_list  = await this.getObjList(get_ingress_list)
            if(ingress_list){
                this.ingress_list = ingress_list
            }
            let gateway_list  = await this.getObjList(get_gateway_list)
            if(gateway_list){
                this.gateway_list = gateway_list
            }

        }
    },
    mounted: function() {
        this.refresh();
        // this.$bus.$on('clusterChange', ()=> {
        //     console.log("集群改变触发了scan更新")
        //     this.refresh()
        // })
        // this.$bus.$on('namespaceChange', ()=> {
        //     console.log("命名空间改变触发了scan更新")
        //     this.refresh()
        // })
    }
}
</script>
<style scoped>

</style>