
<template>
  <div class="home">
    <el-container style="height: 929px; border: 1px solid #eee" >
        <!--左侧-->
        <el-aside :class="collapsed?'aside-collapse':'aside-expand'" width="collapsed?'65px':'220px'">
            <el-menu :default-openeds="['1', '3']">
                <el-submenu index="1">
                    <template slot="title"><i class="el-icon-message"></i>导航一</template>
                    <el-menu-item-group>
                    <template slot="title">分组一</template>
                    <el-menu-item index="1-1">选项1</el-menu-item>
                    <el-menu-item index="1-2">选项2</el-menu-item>
                    </el-menu-item-group>
                    <el-menu-item-group title="分组2">
                    <el-menu-item index="1-3">选项3</el-menu-item>
                    </el-menu-item-group>
                    <el-submenu index="1-4">
                    <template slot="title">选项4</template>
                    <el-menu-item index="1-4-1">选项4-1</el-menu-item>
                    </el-submenu>
                </el-submenu>
            </el-menu>
        </el-aside>
        <!--右侧-->
        <el-container>
            <el-header class="header">
                <el-button style="margin-left:1px;" @click="collapse"><i :class="collapsed?'el-icon-d-arrow-right':'el-icon-d-arrow-left'"></i></el-button>
            <!-- <el-dropdown>
                <i class="el-icon-setting" style="margin-right: 15px"></i>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item>查看</el-dropdown-item>
                    <el-dropdown-item>新增</el-dropdown-item>
                    <el-dropdown-item>删除</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
            <span>王小虎</span> -->
            </el-header> 
            
            <el-main>
            </el-main>
        </el-container>
    </el-container>
  </div>
</template>

<script>
// import axios from 'axios';
export default {
    name: 'Home',
    data() {
      return {
          collapsed: false,
      }
    },
    methods: {
        collapse: function() {
            let collapse = !this.collapsed;
            this.collapsed = !this.collapsed;
            console.log(collapse);
            localStorage.setItem('collapsed',collapse);
        }
    },

};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
    /* .style {
        padding-left: 0px;
    } */
    /* .el-submenu__title {
        padding-left: 0;
        padding: 0;
    }
    .el-submenu .el-menu-item {
        padding: 0;
    } */
    .aside-expand, .aside-collapse {
        /* background-color:#031529; */
        width: 260px;
        height: 100%;

        overflow-y: auto;
    }
    .aside-collapse {
        width: 65px;
        overflow: inherit;
    } 
    .el-header {
        background-color: #B3C0D1;
        color: #333;
        line-height: 60px;
    }

    .el-aside {
        color: #333;
    }

</style>
