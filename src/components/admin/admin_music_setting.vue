<template>
    <div>
        <div class="admin_setting_box">
            <el-form ref="form" :model="music" label-width="120px">
                <el-form-item label="音乐开关">
                    <el-switch v-model="music.open">
                    </el-switch>
                </el-form-item>
                <el-form-item label="自动播放">
                    <el-switch v-model="music.autoplay">
                    </el-switch>
                </el-form-item>
                <el-form-item label="最小型样式">
                    <el-switch v-model="music.mini">
                    </el-switch>
                </el-form-item>
                <el-form-item label="列表可选">
                    <el-switch v-model="music.listFolded">
                    </el-switch>
                </el-form-item>
                <el-form-item label="歌曲列表">
                    <el-select v-model="listIndex" style="width: 300px;" placeholder="请选择要操作的歌曲">
                        <div slot="prefix">{{listIndex + 1}}</div>
                        <el-option v-for="(m,index) in music.list" :label="m.title" :value="index"></el-option>
                    </el-select>
                    <el-button style="margin-left: 10px;" type="success" @click="prepareAdd">添加</el-button>
                    <template>
                        <el-popconfirm title="这是一段内容确定删除吗？" @onConfirm="deleteMusic">
                            <el-button style="margin-left: 10px;"  slot="reference" type="danger">删除</el-button>
                        </el-popconfirm>
                    </template>
                    <el-button style="margin-left: 10px;" type="warning" @click="prepareEditMusic">修改</el-button>
                    <el-button v-if="listIndex !=0" style="margin-left: 10px;" @click="makeUp" type="primary">上移</el-button>
                    <el-button v-if="listIndex != (music.list.length-1)" @click="makeDown" style="margin-left: 10px;" type="info">下移</el-button>
                </el-form-item>
            </el-form>
            <el-dialog :visible.sync="dialogVisible" width="30%">
                <el-form ref="form" :model="addMusic" label-width="80px">
                    <el-form-item label="名称">
                        <el-input v-model="addMusic.title" placeholder="输入歌曲名称"></el-input>
                    </el-form-item>
                    <el-form-item label="演唱者">
                        <el-input v-model="addMusic.artist" placeholder="输入演唱者名称"></el-input>
                    </el-form-item>
                    <el-form-item label="音乐地址">
                        <el-input v-model="addMusic.src" placeholder="输入音乐地址"></el-input>
                    </el-form-item>
                    <el-form-item label="图片地址">
                        <el-input v-model="addMusic.pic" placeholder="输入图片地址"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button v-if="editIndex == -1 " type="primary" @click="realAdd">添加</el-button>
                    <el-button v-if="editIndex != -1" type="primary" @click="editMusic">修改</el-button>
                </span>
            </el-dialog>
        </div>
        <div style="margin-left: 120px;"  v-loading="loading" element-loading-text="保存中">
            <el-button type="primary" @click="saveConfig">保存设置</el-button>
        </div>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                loading:false,
                listIndex: 0,
                editIndex: -1,
                addMusic: {
                    title: '',
                    artist: '',
                    src: '',
                    pic: ''
                },
                dialogVisible: false,
                music: {
                    //第一首歌
                    current_music: {},
                    //自动播放
                    autoplay: false,
                    //最小型
                    mini: false,
                    //播放列表
                    list: [{
                        title: '亲爱的旅人啊（翻自 木村弓）',
                        artist: '周深',
                        src: 'http://music.163.com/song/media/outer/url?id=1371939273.mp3',
                        pic: 'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=271933436,4028810263&fm=26&gp=0.jpg'
                    }],
                    //列表可选择
                    listFolded: true,
                    //是否开启播放器
                    open: false,
                    float:true,
                    listmaxheight:'96px'
                },
            }
        },
        methods: {
            prepareEditMusic() {
                this.editIndex = this.listIndex;
                this.addMusic = this.music.list[this.editIndex]
                this.dialogVisible = true
            },
            editMusic() {
                this.music.list[this.editIndex] = this.addMusic;
                this.dialogVisible = false;
            },
            deleteMusic() {
                if (this.music.list.length <= 1) {
                    this.$message({
                        type: 'warning',
                        message: "最后一首不允许删除"
                    });
                    return;
                } else {
                    this.music.list.splice(this.listIndex,1);
                    this.listIndex = 0
                }
            },
            prepareAdd() {
                this.addMusic.title = ""
                this.addMusic.artist = ""
                this.addMusic.src = ""
                this.addMusic.pic = ""
                this.editIndex = -1;
                this.dialogVisible = true
            },
            realAdd() {
                if (this.addMusic.title && this.addMusic.artist && this.addMusic.src && this.addMusic.pic) {
                    this.music.list.push(this.addMusic)
                    this.dialogVisible = false
                } else {
                    this.$message({
                        type: 'warning',
                        message: "请完善信息"
                    });
                    return;
                }

            },
            async saveConfig(){
                let data = {}
                this.loading = true
                await this.$basicPost("/superAdmin/setMap",{key:"music",value:JSON.stringify(this.music)},data)
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
            makeDown(){
                let tem = this.music.list[this.listIndex];
                this.music.list[this.listIndex] = this.music.list[this.listIndex+1];
                this.music.list[this.listIndex + 1 ] = tem;
                this.music.current_music = this.music.list[0]
                this.listIndex++;
            },
            makeUp(){
                let tem = this.music.list[this.listIndex];
                this.music.list[this.listIndex] = this.music.list[this.listIndex-1];
                this.music.list[this.listIndex - 1 ] = tem;
                this.music.current_music = this.music.list[0]
                this.listIndex--;
            }
        },
        mounted() {
            let obj = (this.$basicConfig.map.find(k => k.key == "music")).values
            if (obj) {
                this.music = obj;
                this.music.current_music = this.music.list[0]
            }
        },
    }
</script>