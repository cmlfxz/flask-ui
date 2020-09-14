<template>
    <div>
        <br>
        <!-- {{allData}} -->
        <br>
        <!-- {{unscheduleData}}         -->
        <Row>

            <i-col span="4">
                <div id="cpu-pie" style="height: 400px"></div>
            </i-col>
            <i-col span="4">
                <div id="memory-pie" style="height: 400px"></div>
            </i-col>
            <i-col span="4">
                <div id="pod-pie" style="height: 400px"></div>
            </i-col>
        </Row>

        <h3>可调度节点(worker)</h3>
        <i-table  :loading="loading" :columns="format" :data="scheduleData"></i-table >
        <br>
        <h3>所有节点</h3>
        <i-table  :loading="loading"  :columns="format" :data="allData"></i-table >
        <br>


        <h3>不可调度节点(master)</h3>
        <i-table  :loading="loading"  :columns="format" :data="unscheduleData"></i-table >
    </div>

</template>

<script>
import axios from 'axios';
import store from '@/store'
import echarts from 'echarts'
export default {

    name:'ClusterDetail',
    data() {
        return {
            loading: true,
            sharedState: store.state,
            format: [
                {
                    title: 'cpu总核数',
                    key: 'cpu_total'
                },
                {
                    title: 'cpu使用核数',
                    key: 'cpu_usage'
                },
                {
                    title: 'cpu使用率',
                    key: 'cpu_usage_percent',

                },
                {
                    title: '内存总数',
                    key: 'memory_total'
                },
                {
                    title: '内存使用量',
                    key: 'memory_usage'
                },
                {
                    title: '内存使用率',
                    key: 'memory_usage_percent'
                },
                {
                    title: 'pod总数',
                    key: 'pod_total',

                },
                {
                    title: 'pod使用量',
                    key: 'pod_usage'
                },
                {
                    title: 'pod使用率',
                    key: 'pod_usage_percent',

                },
                {
                    title: 'disk',
                    key: 'disk'
                },
            ],
            scheduleData: [],
            allData: [],
            unscheduleData: [],
        }
    },
    methods: {
        async get_cluster_data(cluster,stat_type){
            try {
                let response = await axios({
                    method: 'post',
                    url: 'http://flask-gateway:8000' + "/k8s"+"/get_cluster_stats",
                    headers: {"cluster_name":cluster},
                    data:{"stat_type":stat_type},
                })
                // console.log(response.data);
                return response.data;
            } catch (error) {
                console.error(error);
                return null;
            }
        },
        add_chart(data) {
            let cluster_data = data[0]
            // let cpu_total = cluster_data.cpu_total
            // let cpu_usage = cluster_data.cpu_usage
            let cpu_usage_percent = cluster_data.cpu_usage_percent
            let cpu_available_percent = 100 -cpu_usage_percent

            // let memory_total = cluster_data.memory_total
            // let memory_usage = cluster_data.memory_usage
            let memory_usage_percent = cluster_data.memory_usage_percent
            let memory_available_percent = 100 -memory_usage_percent

            // let pod_total = cluster_data.pod_total
            // let pod_usage = cluster_data.pod_usage
            let pod_usage_percent = cluster_data.pod_usage_percent
            let pod_available_percent = 100 -pod_usage_percent

            // console.log(cpu_total,cpu_usage,cpu_usage_percent,cpu_available_percent,
            //             memory_total,memory_usage,memory_usage_percent,memory_available_percent,
            //             pod_total,pod_usage,pod_usage_percent,pod_available_percent)

            let cpu_pie = echarts.init(document.getElementById('cpu-pie'))
            cpu_pie.setOption({
                title: {
                    text: '集群CPU概况',
                    subtext: '',
                    x: 'center',
                },
                tooltip: {
                    trigger: 'item',
                    // a ==> serias.name b=>data: ['使用','剩余']
                    formatter: "{a} <br/>{b} {c}% "   
                },
                legend: {
                    orient: 'vertical',
                    bottom: 'bottom',
                    data: ['使用','剩余']
                },
                //饼图中各模块的颜色
                color: ['#32dadd', '#b6a2de'],
                series : [
                    {
                        name: 'CPU',
                        type: 'pie',
                        radius : '55%',
                        center: ['50%', '60%'],
                        data:[
                            {name:'使用', value: cpu_usage_percent},
                            {name:'剩余', value: cpu_available_percent},
                        ],
                        itemStyle: {
                            normal: {
                                label: {
                                    show: true,//饼图上是否出现标注文字 标注各模块代表什么  默认是true
                                    position: 'inner',//控制饼图上标注文字相对于饼图的位置  默认位置在饼图外
                                },
                                labelLine: {
                                    show: false//官网demo里外部标注上的小细线的显示隐藏    默认显示
                                }
                            }
                        }
                    }
                ],
            })
            let memory_pie = echarts.init(document.getElementById('memory-pie'))
            memory_pie.setOption({
                title: {
                    text: '集群内存概况',
                    subtext: '',
                    x: 'center',
                },
                tooltip: {
                    trigger: 'item',
                    // a ==> serias.name b=>data: ['使用','剩余']
                    formatter: "{a} <br/>{b} {c}% "   
                },
                legend: {
                    orient: 'vertical',
                    bottom: 'bottom',
                    data: ['使用','剩余']
                },
                //饼图中各模块的颜色
                color: ['#32dadd', '#b6a2de'],
                series : [
                    {
                        name: '内存',
                        type: 'pie',
                        radius : '55%',
                        center: ['50%', '60%'],
                        data:[
                            {name:'使用', value: memory_usage_percent},
                            {name:'剩余', value: memory_available_percent},
                        ],
                        itemStyle: {
                            normal: {
                                label: {
                                    show: true,//饼图上是否出现标注文字 标注各模块代表什么  默认是true
                                    position: 'inner',//控制饼图上标注文字相对于饼图的位置  默认位置在饼图外
                                },
                                labelLine: {
                                    show: false//官网demo里外部标注上的小细线的显示隐藏    默认显示
                                }
                            }
                        }
                    }
                ],
            })


            let pod_pie = echarts.init(document.getElementById('pod-pie'))
            pod_pie.setOption({
                title: {
                    text: '集群Pod概况',
                    subtext: '',
                    x: 'center',
                },
                tooltip: {
                    trigger: 'item',
                    // a ==> serias.name b=>data: ['使用','剩余']
                    formatter: "{a} <br/>{b} {c}% "   
                },
                legend: {
                    orient: 'vertical',
                    bottom: 'bottom',
                    data: ['使用','剩余']
                },
                //饼图中各模块的颜色
                color: ['#32dadd', '#b6a2de'],
                series : [
                    {
                        name: 'POD',
                        type: 'pie',
                        radius : '55%',
                        center: ['50%', '60%'],
                        data:[
                            {name:'使用', value: pod_usage_percent},
                            {name:'剩余', value: pod_available_percent},
                        ],
                        itemStyle: {
                            normal: {
                                label: {
                                    show: true,//饼图上是否出现标注文字 标注各模块代表什么  默认是true
                                    position: 'inner',//控制饼图上标注文字相对于饼图的位置  默认位置在饼图外
                                },
                                labelLine: {
                                    show: false//官网demo里外部标注上的小细线的显示隐藏    默认显示
                                }
                            }
                        }
                    }
                ],
            })
        },
        async refresh(){
            // 从页面共享获取集群
            
            // let cluster = this.sharedState.clusterName;
            let that = this
            let cluster = localStorage.getItem('currentCluster')
            console.log("refresh cluster:",cluster)
            if (cluster) {
                // 获取可调度节点数据
                let schedule_data = await that.get_cluster_data(cluster,'schedule')
                console.log("schedule_data:",schedule_data)
                that.scheduleData = schedule_data
                if(schedule_data){
                    that.add_chart(schedule_data)
                }
                let all_data = await that.get_cluster_data(cluster,'all')
                console.log("all_data:",all_data)
                that.allData = all_data

                let unschedule_data = await that.get_cluster_data(cluster,'unschedule')
                console.log("unschedule_data:",unschedule_data)
                that.unscheduleData = unschedule_data

                that.loading=false
            }

        },


    },
    mounted: function(){
        // 如何封装
        // 显示集群 namespace的页面应该在 home公共部分
        // 命名空间改变 设置cookie
        // 集群改变 设置cookie 还得跟命名空间联动
        // 获取命名空间/集群名称
        // 根据cookie 设置当前页面的namespace 和 集群
        // 实际业务部分
        this.refresh() 
        // this.$bus.$on('clusterChange', ()=> {
        //     console.log("集群改变触发了集群详情更新")
        //     this.refresh()
        // })
    }

}
</script>

<style scoped>

</style>