<template>
    <div>
        <Row>
            <div style="float:left;margin-top:5px"  >
                <Button @click="btn_add_site">新增站点</Button>
            </div>
            <!-- 查询区域 -->
            <div class="select" style="margin-top:5px">
                <div style="width:300px;float:left">
                    <Form ref="select" :model="select" :rules="select_rules" label-position="left"  :label-width="100">
                        <Form-Item  prop="env" >
                            <Select v-model="env" placeholder="选择环境">
                                <Option v-for="env in env_list" :key="env" :value="env">{{ env }}</Option>
                            </Select>
                        </Form-Item>
                    </Form> 
                </div>
                <div>
                    <Button type="error" style="margin-bottom: 5px ;margin-right:5px;margin-left: 5px;"  @click="btn_select_site">查询</Button>
                </div>
            </div>
        </Row>
        <!-- 列表区域 -->
        <i-table border stripe  :columns="format" :data="show_list" height="730">
            <template slot-scope="{ row, index }" slot="action">
                <Button type="primary" style="margin-bottom: 5px;margin-right:5px;"  @click="btn_edit_site(index)">编辑</Button>
                <Button type="error" style="margin-bottom: 5px ;margin-right:5px"  @click="del_site(index)">删除</Button>
            </template>
        </i-table >
        <div style="text-align: center;margin-top: 10px;">
            <Page ref="page" :total="total" :page-size="pageSize"  @on-change="changePage" show-total/>
        </div>
        <!-- 新增站点模态框 -->
        <Modal v-model="show_add_site_modal" width="600">
            <p slot="header" style="color:#f60;text-align:center">
                <span>添加站点</span>
            </p>
            <div >
                <Form ref="site" :model="site" :rules="site_rules" label-position="left"  :label-width="100">
                    <Form-Item label="选择环境" prop="env">
                        <Select v-model="site.env">
                            <Option v-for="env in env_list" :key="env" :value="env">{{ env }}</Option>
                        </Select>
                    </Form-Item> 
                    <Form-Item label="名字:"  prop="name">
                        <Input type="text"  v-model="site.name" />
                    </Form-Item> 
                    <Form-Item label="链接:"  prop="link">
                            <Input type="text"  v-model="site.link" />
                    </Form-Item> 
                    <Form-Item label="账号:"  prop="account">
                        <Input type="text"  v-model="site.account" />
                    </Form-Item> 
                    <Form-Item label="密码:"  prop="password">
                            <Input type="text"  v-model="site.password" />
                    </Form-Item> 
                    <Form-Item label="描述:"  prop="description">
                        <Input type="textarea"  :autosize="{minRows: 2,maxRows: 5}"  v-model="site.description" />
                    </Form-Item> 
                </Form> 
            </div>
            <div slot="footer">
                <!-- site是 ref的值 -->
                <Button type="primary" size="large"  @click="submit_add_site('site')">提交</Button>
            </div>
        </Modal>
        <!-- 编辑站点模态框 -->
        <Modal v-model="show_edit_site_modal" width="600">
            <p slot="header" style="color:#f60;text-align:center">
               {{env_list}} {{ site_edit.env}} <span>编辑站点</span>
            </p>
            <div >
                <Form ref="site_edit" :model="site_edit" :rules="site_rules" label-position="left"  :label-width="100">
                    <Form-Item label="选择环境" prop="env">
                        <Select v-model="site_edit.env">
                            <template v-for="env in env_list" >
                                <Option  :key="env" :value="env" v-if="env === site_edit.env"  selected>{{ env }}</Option>
                                <Option :key="env" :value="env" v-else>{{ env }} </Option>
                            </template>
                         </Select>
                    </Form-Item> 
                    <Form-Item label="名字:"  prop="name">
                        <Input type="text"  v-model="site_edit.name" />
                    </Form-Item> 
                    <Form-Item label="链接:"  prop="link">
                            <Input type="text"  v-model="site_edit.link" />
                    </Form-Item> 
                    <Form-Item label="账号:"  prop="account">
                        <Input type="text"  v-model="site_edit.account" />
                    </Form-Item> 
                    <Form-Item label="密码:"  prop="password">
                            <Input type="text"  v-model="site_edit.password" />
                    </Form-Item> 
                    <Form-Item label="描述:"  prop="description">
                        <Input type="textarea"  :autosize="{minRows: 2,maxRows: 5}"  v-model="site_edit.description" />
                    </Form-Item> 
                </Form> 
            </div>
            <div slot="footer">
                <!-- site是 ref的值 -->
                <Button type="primary" size="large"  @click="submit_edit_site('site_edit')">提交</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
import axios from 'axios';
import {site_add,site_list,site_delete,site_update,get_env_name_list,list_by_env,get_site_by_env_name} from '@/api';

export default {
    data() {
        return {
            format: [
                {
                    title: '名字',key: 'name',
                    render: (h,params) => {
                        return h('div',[
                            h('a',{
                                style: {
                                    color: 'blue'
                                },
                                on: {
                                    click: ()=>{                  
                                        this.handleLink(params);
                                    }
                                }
                            },params.row.name)
                        ])
                    }
                },
                {
                    title: '环境',key: 'env'
                },
                {
                    title: '链接',key: 'link'
                },
                {
                    title: '账号',key: 'account'
                },
                {
                    title: '密码',key: 'password'
                },
                {
                    title: '描述',key: 'description',tooltip: true,ellipsis: true,
                },
                {
                    title: '创建时间',key: 'create_time'
                },
                {
                    title: '操作',slot: 'action',width: 400,align: 'center'
                }
            ],
            // 新增站点绑定
            site: {
                name: '',
                link: '',
                account: '',
                password: '',
                description: '账号1: \n密码1：',
                env: 'dev',
            },
            // 环境列表
            env_list: [],
            site_rules: {
                name:[
                    {required: true,message:"请输入站点名称",trigger: 'blur'},
                ],
                link:[
                    {required: true,message:"请输入站点链接地址",trigger: 'blur'},
                ],
            },
            show_add_site_modal: false,
            // 编辑数据
            site_edit: {
                name: '',
                link: '',
                account: '',
                password: '',
                description: '',
                env: '',
            },
            show_edit_site_modal:false,
            // 查询数据
            env: '',
            // 编辑数据
            show_list: [],
            // 分页
            total: 0,
            pageSize: 10,
        }
    },
    methods: {
        btn_select_site(){
            let env = this.env
            if(env =='' || env==null) {
                this.$Message.error("请先选择环境")
                return
            }
            let data = {"env":env}
            let url = list_by_env
            let method='post'
            axios({
                url:url,method:method,data:data
            }).then( (response) => {
                this.total_list = response.data
                this.total = response.data.length
                if(this.total < this.pageSize) {
                    this.show_list = this.total_list
                }else {
                    // 修改改数据之后显示回到第一页的bug，改为停留在当前页
                    let currentPage = this.$refs.page.currentPage
                    let _start = (currentPage-1) * this.pageSize
                    let _end = currentPage * this.pageSize
                    this.show_list = this.total_list.slice(_start,_end)
                }
            }).catch(function (error){
                console.log(error)
            })

        },
        handleLink(params){
            window.open(params.row.link,"_blank");
        },
        async submit_edit_site(name){
            // alert('submit')
            let validate = false
            this.$refs[name].validate((valid) => {
                if (valid) {
                    validate = true
                    console.log('表单数据验证成功!')
                } else {
                    this.$Message.error('表单数据验证失败!');
                    validate = false
                }
            })
            if(!validate) return
            let site = this.site_edit

            // 判断通过就继续
            console.log("继续更新")
            let url = site_update
            let method='post'
            let data = {'site':site}
            axios({
                url:url,method:method,data:data
            }).then( (response) => {
                let info = JSON.stringify(response.data)
                if(info.indexOf('ok') != -1) {
                    this.$Message.success('更新'+site.name+'成功')
                    this.show_edit_site_modal = false
                    this.refresh()
                }else {
                    alert("更新失败:",info)
                }
            }).catch(function (error){
                console.log(error)
            })
        },
        async btn_edit_site(index){
            await this.get_env()
            
            let site =  JSON.parse(JSON.stringify(this.show_list[index]))
            // 这里会有问题 引用
            // 这种操作方式会导致 site site_edit this.show_list[index]指向的内存相同
            // let site = this.show_list[index]
            // alert(JSON.stringify(site))
            this.site_edit = site
            this.show_edit_site_modal=true
        },
        // 获取环境列表
        async get_env(){
            let url = get_env_name_list
            let method='post'
            try {
                let response  = await axios({
                    url:url,method:method
                })
                console.log(response.data)
                this.env_list = response.data
            } catch (error) {
                console.error(error);
            }
        },
        async btn_add_site(){
            await this.get_env()
            this.show_add_site_modal = true
        },
        async checkUnique(site) {
            let site_name=site.name
            let env = site.env
            let data = {'name':site_name,'env':env}
            try {
                let response = await axios({
                    method: 'post',
                    url: get_site_by_env_name,
                    data: data
                })
                let info = response.data
                console.log(info)
                console.log(info.msg)
                if(info.msg == true) {
                    console.log("非唯一，不可插")
                    return false
                }else {
                    console.log("可插")
                    return true
                } 
            } catch (error) {
                console.error(error);
                return false
            }
        },
        async submit_add_site(name){
            // alert('submit')
            let validate = false
            this.$refs[name].validate((valid) => {
                if (valid) {
                    // this.$Message.success('表单数据验证成功!');
                    validate = true
                    console.log('表单数据验证成功!')
                } else {
                    this.$Message.error('表单数据验证失败!');
                    validate = false
                }
            })
            if(!validate) return
            let site = this.site

            // 判断联合主键  axios真麻烦 异步得改同步
            let checkPass  = await this.checkUnique(site)
            if(!checkPass){
                this.$Message.error(site.env+" "+site.name+" 已经存在")
                return   
            }
            // 判断通过就继续
            console.log("继续")
            let url = site_add
            let method='post'
            let data = {'site':site}
            axios({
                url:url,method:method,data:data
            }).then( (response) => {
                let info = JSON.stringify(response.data)
                if(info.indexOf('ok') != -1) {
                    this.$Message.success('添加'+site.name+'成功')
                    this.show_add_site_modal = false
                    this.refresh()
                }else {
                    alert("添加失败:",info)
                }
            }).catch(function (error){
                console.log(error)
            })

        },
        changePage(index) {
            let _start = (index -1) * this.pageSize
            let _end = index * this.pageSize
            this.show_list = this.total_list.slice(_start,_end)
        },
        del_site(index){
            let id = this.show_list[index].id
            let name = this.show_list[index].name
            let result = confirm("确定要删除"+name+"吗?")
            if(result == false) return 
            let url = site_delete
            let method='post'
            let data = {"id":id}
            axios({
                url:url,method:method,data:data,
            }).then( (response) => {
                let info = JSON.stringify(response.data)
                if(info.indexOf('ok') != -1) {
                    this.$Message.success('删除'+name+'成功')
                    this.refresh()
                }else {
                    alert("删除失败:",info)
                }
            }).catch(function (error){
                console.log(error)
            })

        },
        refresh() {
            this.get_env()
            let url = site_list
            let method='post'
            axios({
                url:url,method:method
            }).then( (response) => {
                this.total_list = response.data
                this.total = response.data.length
                if(this.total < this.pageSize) {
                    this.show_list = this.total_list
                }else {
                    // 修改改数据之后显示回到第一页的bug，改为停留在当前页
                    let currentPage = this.$refs.page.currentPage
                    let _start = (currentPage-1) * this.pageSize
                    let _end = currentPage * this.pageSize
                    this.show_list = this.total_list.slice(_start,_end)
                }
            }).catch(function (error){
                console.log(error)
            })
        }
    },
    mounted: function() {
        this.refresh();
    }
}
</script>
<style scoped>

</style>