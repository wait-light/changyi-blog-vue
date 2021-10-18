<template>
    <div>
        <el-tag @close="handleClose(tag)" :closable="true" class="admin_tags" :key="tag.id"
            :type="colorType[Math.round(Math.random()*(colorType.length-1))]" v-for="tag in tags" effect="plain">
            {{tag.name}}
        </el-tag>
        <el-input style="width: 200px;" class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" size="small"
            @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm">
        </el-input>
        <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 添加标签</el-button>
    </div>
</template>
<script>
    //直接由admin_tags.vue 换接口而改造
    export default {
        data() {
            return {
                colorType: ['', 'info', 'success', 'danger', 'warning'],
                tags: [],
                inputVisible: false,
                inputValue:""
            };
        },
        methods: {
            getTags() {
                this.tags = this.$basicConfig.types;
            },
            handleClose(tag) {
                this.$confirm('此操作将永久删除该类别（若是此类别存有文章，无法删除）, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    if (this.deletTag(tag.id)) {
                        this.tags.splice(this.tags.indexOf(tag), 1);//成功则从前端也删除显示
                    }
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            async deletTag(id) {
                let data = {}
                await this.$basicPost("/superAdmin/deleteType", { id }, data);
                if (data.success && data.data.data.code ==200) {
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    return true;
                } else {
                    this.$message({
                        type: 'warning',
                        message: data.data.data.code==600?data.data.data.message:"删除失败"
                    });
                    return false;
                }
            },
            handleInputConfirm() {
                let inputValue = this.inputValue;
                if (inputValue) {
                    if(this.addTag(inputValue)){
                        this.getTags();
                    }
                }
                this.inputVisible = false;
                this.inputValue = '';
            },
            showInput() {
                this.inputVisible = true;
                this.$nextTick(_ => {
                    this.$refs.saveTagInput.$refs.input.focus();
                });
            },
            async addTag(name){
                let data = {};
                await this.$basicPost("/admin/addType",{name},data);
                if(data.success &&data.data.data.code == 200){
                    this.$message({
                        type: 'success',
                        message:data.data.data.message
                    });
                    await this.$basicConfigGet()
                    return true;
                }else{
                    this.$message({
                        type: 'warning',
                        message: data.data.data.code==600?data.data.data.message:'添加失败!'
                    });
                    return false;
                }
            }

        },
        async mounted() {
            this.getTags();
        },
    }
</script>