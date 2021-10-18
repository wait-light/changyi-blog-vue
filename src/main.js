import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import router from './router/index'
import store from './router/store'
import './plugins/element.js'
import Qs from 'qs' //json化组件
import 'element-ui/lib/theme-chalk/display.css'; //引入 Element-ui 基于断点的隐藏类
import 'default-passive-events' //处理Added non-passive event listener to a scroll-blocking 错误
const debug = false;
const headers = {
    "content-type": "application/x-www-form-urlencoded;charset=UTF-8;"
}
async function multiPost(url, data, outData, isMessageTip, tipTime) {
    await Vue.axios.post(url, data, {
        "headers": {
            "content-type": "multipart/form-data;"
        }
    }).then((result) => {
        //返回获取的数据
        if (outData != undefined) {
            outData.data = result;
            outData.success = true;
        }
        if (isMessageTip != undefined && isMessageTip) { //是否开启提示框
            thisVue.$notify({
                title: '提示',
                message: result.data.message,
                duration: tipTime != undefined ? tipTime : 1000,
                type: 'success'
            });
        }
        if (debug) { //是否开启debug模式
            console.log(new Date() + " : 发送的Json数据：")
            console.log(JSON.stringify(data))
            console.log(new Date() + " : 返回的结果：")
            console.log(result)
        }
        return result;
    }).catch((err) => {
        //返回获取的数据
        if (outData != undefined) {
            outData.data = err;
            outData.success = false;
        }
        if (isMessageTip != undefined && isMessageTip) {
            thisVue.$notify({
                title: '提示',
                message: err,
                duration: tipTime != undefined ? tipTime : 1000,
                type: 'warning'
            });
        }
        if (debug) {
            console.log(err)
        }
    });
}

async function jsonPost(url, data, outData, isMessageTip, tipTime) {
    await Vue.axios.post(url, JSON.stringify(data), {
        "headers": {
            "content-type": "application/json;charset=UTF-8;"
        }
    }).then((result) => {
        //返回获取的数据
        if (outData != undefined) {
            outData.data = result;
            outData.success = true;
        }
        if (isMessageTip != undefined && isMessageTip) { //是否开启提示框
            thisVue.$notify({
                title: '提示',
                message: result.data.message,
                duration: tipTime != undefined ? tipTime : 1000,
                type: 'success'
            });
        }
        if (debug) { //是否开启debug模式
            console.log(new Date() + " : 发送的Json数据：")
            console.log(JSON.stringify(data))
            console.log(new Date() + " : 返回的结果：")
            console.log(result)
        }
        return result;
    }).catch((err) => {
        //返回获取的数据
        if (outData != undefined) {
            outData.data = err;
            outData.success = false;
        }
        if (isMessageTip != undefined && isMessageTip) {
            thisVue.$notify({
                title: '提示',
                message: err,
                duration: tipTime != undefined ? tipTime : 1000,
                type: 'warning'
            });
        }
        if (debug) {
            console.log(err)
        }
    });
}

async function basicPost(url, data, outData, isMessageTip, tipTime) {
    await Vue.axios.post(url, Qs.stringify(data), { headers }).then((result) => {
        //返回获取的数据
        if (outData != undefined) {
            outData.data = result;
            outData.success = true;
        }
        if (isMessageTip != undefined && isMessageTip) { //是否开启提示框
            thisVue.$notify({
                title: '提示',
                message: result.data.message,
                duration: tipTime != undefined ? tipTime : 1000,
                type: 'success'
            });
        }
        if (debug) { //是否开启debug模式

            console.log(new Date() + " : 发送的Json数据：")
            console.log(Qs.stringify(data))
            console.log(new Date() + " : 返回的结果：")
            console.log(result)
        }
        return result;
    }).catch((err) => {
        //返回获取的数据
        if (outData != undefined) {
            outData.data = err;
            outData.success = false;
        }
        if (isMessageTip != undefined && isMessageTip) {
            thisVue.$notify({
                title: '提示',
                message: err,
                duration: tipTime != undefined ? tipTime : 1000,
                type: 'warning'
            });
        }
        if (debug) {
            console.log(err)
        }
    });
}
//时间格式化
Date.prototype.format = function (value) {
    if (null != value && "" != value) {
        var date = new Date(value);
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        if (m < 10) {
            m = "0" + m;
        }
        var d = date.getDate();
        if (d < 10) {
            d = "0" + d;
        }
        return y + '年' + m + '月' + d + '日';
    } else {
        return "";
    }
}

Date.prototype.format_maxMouth = function (value) {
    if (null != value && "" != value) {
        var date = new Date(value);
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        if (m < 10) {
            m = "0" + m;
        }
        var d = date.getDate();
        if (d < 10) {
            d = "0" + d;
        }
        return y + '年' + m + '月';
    } else {
        return "";
    }
}
function link(url) {
    if (debug) {
        console.log("前往的地址：" + url)
        console.log("当前的地址：" + thisVue.$route.path)
    }
    if (thisVue.$route.path == url) {
        location.reload();
        return;
    }
    router.push(url);
}

async function basicConfigGet() {
    await basicPost("/common/basicMessage", "", temData).then(() => {
        if (temData.success) {
            temData = temData.data.data.data;
            Vue.prototype.$basicConfig = temData;
            Vue.prototype.$tagsMap = toMap("id", temData.tags);
            Vue.prototype.$typesMap = toMap("id", temData.types);
            for (let index = 0; index < temData.map.length; index++) {
                if(temData.map[index].values){
                    temData.map[index].values = JSON.parse( temData.map[index].values)
                }
            }
        } else {
            thisVue.$notify({
                title: '提示',
                message: "获取系统基础信息失败",
                type: 'error'
            });
        }
    })
}
let temData = {}

//以values下的keyName作为Key值,values作value。
function toMap(keyName, values) {
    var map = new Map();
    for (let index = 0; index < values.length; index++) {
        const element = values[index];
        map.set(element[keyName], element);
    }
    return map;
}
Vue.prototype.$toWhere = link;
Vue.prototype.$color = ["", "success", "info", "warning", "danger"]
Vue.config.productionTip = true
Vue.prototype.$basicPost = basicPost
Vue.prototype.$jsonPost = jsonPost
Vue.prototype.$multiPost = multiPost
Vue.prototype.$basicConfigGet = basicConfigGet
let thisVue = new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')