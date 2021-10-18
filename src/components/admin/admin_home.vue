<template>
    <div class="basic_vertical_box">
        <div style="min-width: 1200px;">
            <div class="admin_header">
                <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal">
                    <el-menu-item index="1" @click="$toWhere('/admin')">首页</el-menu-item>
                    <el-menu-item index="2" @click="$toWhere('/index/1')">前台首页</el-menu-item>
                </el-menu>
            </div>
            <div class="admin_mainer">
                <el-row>
                    <el-col :xs="8" :sm="6" :md="4" :lg="3" class="admin_sider">
                        <el-menu default-active="1">
                            <el-submenu index="0">
                                <template slot="title">
                                    <i class="el-icon-setting"></i>
                                    <span>系统设置</span>
                                </template>
                                <el-menu-item index="0-1" @click="$toWhere('/admin/setting_music')">音乐播放器设置</el-menu-item>
                                <el-menu-item index="0-2" @click="$toWhere('/admin/setting_theme')">主题设置</el-menu-item>
                                <el-menu-item index="0-3" @click="$toWhere('/admin/setting_basic')">基本设置</el-menu-item>
                                <el-menu-item index="0-3" @click="$toWhere('/admin/about')">关于我</el-menu-item>
                            </el-submenu>
                            <el-submenu index="1">
                                <template slot="title">
                                    <i class="el-icon-s-order"></i>
                                    <span>文章管理</span>
                                </template>
                                <el-menu-item index="1-1" @click="$toWhere('/admin/article/add_edit')">添加文章</el-menu-item>
                                <el-menu-item index="1-2" @click="$toWhere('/admin/article_list')">文章列表</el-menu-item>
                            </el-submenu>
                            <el-menu-item index="4" @click="$toWhere('/admin/comments')">
                                <i class="el-icon-s-comment"></i>
                                <span slot="title">评论管理</span>
                            </el-menu-item>
                            <el-menu-item index="3" @click="$toWhere('/admin/users')">
                                <i class="el-icon-user"></i>
                                <span slot="title">用户管理</span>
                            </el-menu-item>
                            <el-submenu index="7">
                                <template slot="title">
                                    <i class="el-icon-collection-tag"></i>
                                    <span>标签/类别</span>
                                </template>
                                <el-menu-item index="7-1" @click="$toWhere('/admin/types')">类别</el-menu-item>
                                <el-menu-item index="7-2" @click="$toWhere('/admin/tags')">标签</el-menu-item>
                            </el-submenu>
                            <!-- <el-menu-item index="5">
                                <i class="el-icon-document"></i>
                                <span slot="title">留言管理</span>
                            </el-menu-item> -->
                            <el-menu-item index="8" @click="$toWhere('/admin/friends')">
                                <i class="el-icon-magic-stick"></i>
                                <span slot="title">友情链接</span>
                            </el-menu-item>
                            <!-- <el-menu-item index="6">
                                <i class="el-icon-document"></i>
                                <span slot="title">反馈</span>
                            </el-menu-item> -->
                        </el-menu>
                    </el-col>
                    <el-col :xs="16" :sm="18" :md="20" :lg="21" class="admin_mainer_container">
                        <router-view></router-view>
                    </el-col>
                </el-row>
            </div>
            <div class="admin_footer">
    
            </div>
        </div>
        
    </div>
</template>
<script>
    export default {
        data() {
            return {
                activeIndex: '1'
            };
        }
    }
</script>