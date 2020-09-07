
<template>
    <div class="createCluster" style="width: 30%;height:40%;padding: 10px;margin: 5px">
        <div class="content">
            <Form ref="clusterForm" :model="clusterForm" :rules="rules">
                <FormItem prop="cluster_name">
                    <span>集群名称</span>
                    <Input v-model="clusterForm.cluster_name" placeholder="k8s_cs1" />
                </FormItem>
                <FormItem >
                    <span>配置文件</span>
                    <Upload action="" :before-upload="handleUpload">
                        <Button icon="ios-cloud-upload-outline">选择文件上传</Button>
                    </Upload>
                    <div v-if="clusterForm.file !== null">Upload file: {{ clusterForm.file.name }}</div>
                </FormItem>                
                
                <FormItem  prop="cluster_type">
                    <Select v-model="clusterForm.cluster_type" style="width:200px">
                        <Option v-for="item in cluster_type_list" :value="item" :key="item">{{ item }}</Option>
                    </Select>
                </FormItem>
            </Form>
            <Button @click="create_cluster('clusterForm')">创建</Button>
            <div v-if="file_path !== '' ">创建集群成功{{ file_path }}</div>
        </div>

    </div>
</template>

<script>
import axios from 'axios';
export default {
  name: 'CreateCluster',
//   props: {
//     msg: String
//   }
    data() {
        return {
            clusterForm: {
                cluster_name: '',
                file: null,
                cluster_type: '',
            },
            cluster_type_list: [
                '私有云',
                '阿里云',
                '华为云',
                '腾讯云',
                'Azure云',
                '靑云',
            ],
            file_path: '',
            rules: {
                cluster_name: [
                    {required: true,message:'请输入集群名称',trigger: 'blur'}
                ],
                cluster_type: [
                    {required: true,message: '请选择集群类型', trigger: 'blur'}
                ]
            },
        };
    },
    methods: {
        handleUpload (file) {
            this.clusterForm.file=file;
            return false;
        },

        create_cluster(name) {
            console.log(name)
            console.log(this.clusterForm.file)
            alert(this.clusterForm.cluster_name)
            let formData = new FormData();
            formData.append('cluster_config',this.clusterForm.file)
            formData.append('cluster_name',this.clusterForm.cluster_name)
            formData.append('cluster_type',this.clusterForm.cluster_type)
            axios({
                method: 'post',
                url: 'http://flask-admin:8081' + "/frontend_k8s"+"/cluster_create",
                data: formData,
                headers: {
                    'Content-Type': 'multipart/form-data;boundary = ' + new Date().getTime()
                }

            }).then( (response) => {
                if(response.data.msg == 'ok') {
                    let upload_file_path = response.data.file_path;
                    this.file_path = upload_file_path
                }else {
                    this.$message('创建集群失败')
                }
            }).catch(function (error){
                console.log(error)
            })

        }
    },

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
