<template>
    <div>
        <div class="admin_setting_box">
            <el-form ref="form" :model="backgrounds" label-width="120px">
                <el-form-item label="主页壁纸">
                    <el-input placeholder="请输入内容" v-model="backgrounds.indexBackground" clearable>
                    </el-input>
                </el-form-item>

                <el-form-item label="归档壁纸">
                    <el-input placeholder="请输入内容" v-model="backgrounds.dateBackground" clearable>
                    </el-input>
                </el-form-item>
                <el-form-item label="友链壁纸">
                    <el-input placeholder="请输入内容" v-model="backgrounds.friendsBackground" clearable>
                    </el-input>
                </el-form-item>
                <el-form-item label="关于我壁纸">
                    <el-input placeholder="请输入内容" v-model="backgrounds.aboutMeBackground" clearable>
                    </el-input>
                </el-form-item>
                <el-form-item label="文章默认壁纸">
                    <el-input placeholder="请输入内容" v-model="backgrounds.articleDefultBackground" clearable>
                    </el-input>
                </el-form-item>
                <el-form-item label="主页页头">
                    <el-input placeholder="请输入内容" v-model="backgrounds.indexText" clearable>
                    </el-input>
                </el-form-item>
                <el-form-item label="归档页头">
                    <el-input placeholder="请输入内容" v-model="backgrounds.dateText" clearable>
                    </el-input>
                </el-form-item>
                <el-form-item label="友链页头">
                    <el-input placeholder="请输入内容" v-model="backgrounds.friendsText" clearable>
                    </el-input>
                </el-form-item>
                <el-form-item label="关于我页头">
                    <el-input placeholder="请输入内容" v-model="backgrounds.aboutMeText" clearable>
                    </el-input>
                </el-form-item>
                <el-form-item label="自动打字机特效">
                    <el-switch v-model="backgrounds.autoTypingSpecialEffects" active-color="#13ce66">
                    </el-switch>
                </el-form-item>
                <!-- <el-form-item label="主题选择">
                    <el-select v-model="themeIndex" placeholder="请选择">
                        <el-option v-for="(item,index) in theme.list" :key="index" :label="item.name" :value="index">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="壁纸地址">
                    <el-input placeholder="请输入内容" v-model="theme.background_style['background-image']" clearable>
                    </el-input>
                </el-form-item>
                <el-form-item label="壁纸填充模式">
                    <el-select v-model="theme.background_style['background-size']" placeholder="请选择">
                        <el-option key="1" label="覆盖" value="cover">
                        </el-option>
                        <el-option key="2" label="包含" value="contain">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="壁纸重复模式">
                    <el-select v-model="theme.background_style['background-repeat']" placeholder="请选择">
                        <el-option key="1" label="重复" value="repeat">
                        </el-option>
                        <el-option key="2" label="水平重复" value="repeat-x">
                        </el-option>
                        <el-option key="3" label="垂直重复" value="repeat-y">
                        </el-option>
                        <el-option key="4" label="不重复" value="no-repeat">
                        </el-option>
                    </el-select>
                </el-form-item> -->
            </el-form>
        </div>
        <div style="margin-left: 120px;margin-top: 80px;" v-loading="loading" element-loading-text="保存中">
            <el-button type="primary" @click="saveConfig">保存设置</el-button>
        </div>
    </div>
</template>
<script>
    import Qs from 'qs' //json化组件
    export default {
        data() {
            return {
                loading: false,
                themeIndex: 0,
                size_style_index: 0,
                dialogVisible: false,
                backgrounds: {
                    indexBackground: "https://tva4.sinaimg.cn/large/008c2CqBly1glez5j8jf9j33uw2kle82.jpg",
                    indexText: "主页",
                    dateBackground: "https://tva1.sinaimg.cn/large/008c2CqBly1glezado8ikj32yo1o0hdt.jpg",
                    dateText: "归档",
                    friendsBackground: "https://tvax1.sinaimg.cn/large/008c2CqBly1glehwisprej31hc0u0u0y.jpg",
                    friendsText: "朋友们",
                    aboutMeBackground: "https://tva4.sinaimg.cn/large/008c2CqBly1glei1odrjhj30xc0irkbc.jpg",
                    aboutMeText: "关于我",
                    articleDefultBackground: "https://tva2.sinaimg.cn/large/008c2CqBly1gleducrpgyj311i1kyqg6.jpg",
                    // 自动打字机特效
                    autoTypingSpecialEffects: false
                }
                // theme: {
                //     //当前主题
                //     current_theme: {},
                //     background_style: {
                //         "background-image": "https://w.wallhaven.cc/full/2e/wallhaven-2em38y.jpg",
                //         "background-size": "contain",
                //         "background-repeat": "repeat",
                //     },
                //     //主题列表
                //     list: [{
                //         name: '圆',
                //         src: './assets/theme/circle/circle_theme.css',
                //         font_src: './assets/theme/font/default_font/iconfont.css'
                //     }]
                // }
            }
        },
        methods: {
            async saveConfig() {
                let data = {}
                this.loading = true
                // this.theme.current_theme = this.theme.list[Number.parseInt(this.themeIndex)]
                // let temurl = this.theme.background_style["background-image"];
                // this.theme.background_style["background-image"] = `url('${this.theme.background_style["background-image"]}')`;
                await this.$basicPost("/superAdmin/setMap", { key: "indexsettings", value: JSON.stringify(this.backgrounds) }, data)
                if (data.success && data.data.data.code == 200) {
                    this.$message({
                        type: 'success',
                        message: data.data.data.message
                    });
                } else {
                    this.$message({
                        type: 'warning',
                        message: data.data.data.code == 600 ? data.data.data.message : "设置失败"
                    });
                }
                // this.theme.background_style["background-image"] = temurl;
                this.loading = false
            }
        },
        mounted() {
            let obj = (this.$basicConfig.map.find(k => k.key == "indexsettings"))
            if(obj && obj.values){
                obj = obj.values
            }
            if (obj) {
                this.backgrounds = obj;
            }
        },
    }
</script>