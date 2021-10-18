<template>
    <div>
        <div class="admin_setting_box">
            <el-form ref="form" :model="setting" label-width="120px">
                <el-form-item label="博客名称">
                    <el-input placeholder="请输入内容" v-model="setting.name" clearable>
                    </el-input>
                </el-form-item>
            </el-form>
        </div>
        <div style="margin-left: 120px;" v-loading="loading" element-loading-text="保存中">
            <el-button type="primary" @click="saveConfig">保存设置</el-button>
        </div>
    </div>
</template>
<script>
    import Qs from 'qs' //json化组件
    export default {
        data() {
            return {
                loading:false,
                setting:{
                    name:"XX", //博客名称
                }
            }
        },
        methods: {
            async saveConfig(){
                let data = {}
                this.loading = true
                await this.$basicPost("/superAdmin/setMap",{key:"setting",value:JSON.stringify(this.setting)},data)
                if(data.success && data.data.data.code ==200){
                    this.$message({
                        type: 'success',
                        message:data.data.data.message
                    });
                }else{
                    this.$message({
                        type: 'warning',
                        message:data.data.data.code ==600?data.data.data.message:"设置失败"
                    });
                }
                this.loading = false
            },
        },
        mounted() {
            let obj = (this.$basicConfig.map.find(k => k.key == "setting")).values
            if (obj) {
                this.setting = obj;
            }
        },
    }
</script>