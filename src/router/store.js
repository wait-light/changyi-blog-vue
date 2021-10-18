import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
// 动画时间
const ANIMATION_DURATION_MAX = 1000;
const ANIMATION_DURATION_MID = 400;
const ANIMATION_DURATION_SMALL = 100;
const store = new Vuex.Store({
  state: {
    title: {
      style: {
        "position": "relative",
        "height": "100vh",
        "width": "100%",
        "background-repeat": "no-repeat",
        "background-position": "center",
        "background-size": "cover",
        "border-radius": " 0.5rem",
        "background-image": "url('https://w.wallhaven.cc/full/g7/wallhaven-g7zl1e.jpg')",
      },
      content: "",
      text: "",
      textColor:"white",
      downButton: {
        anotherOpen:true,
        open: true,
        func:Function,
        data:""
      },
    },
    mainer: {
      additional:0,
      style: {
        "margin-top": "0"
      }
    }
  },
  mutations: {
    //传入 key：value更改title.style
    changteStyle(state, newStyle) {
      state.title.style[newStyle.key] = newStyle.value
    },
    changeContent(state, newContent) {
      state.title.content = newContent;
    },
    changeText(state, newText) {
      state.title.text = newText;
    },
    //开关向下按钮
    openOrCloseButton(state,openOrClose){
      state.title.downButton.open = openOrClose
    },
    //出发按钮点击事件
    clickButton(state) {
      if(state.title.downButton.func){
        state.title.downButton.func(state.title.downButton.data)
      }
    },
    //更改点击事件
    changeDownButton(state,buttonResouce){
      if(buttonResouce.fun){
        state.title.downButton.func = buttonResouce.fun
      }
      if(buttonResouce.data){
        state.title.downButton.data = buttonResouce.data
      }
    },
     //传入 key：value更改title.style
    changeMainerStyle(state,newStyle){
      state.mainer.style[newStyle.key] = newStyle.value
    }
  },
  actions: {
    //滑动窗口到指定位置
    scrollTo({ commit, state }, target) {
      //数据检测，必须要有参数x,y,数据大于0
      if (target.x >= 0 && target.y >= 0) {
        let x = window.scrollX;
        let y = window.scrollY;
        let speedY = (target.y - y) / ANIMATION_DURATION_MID * 5;
        let speedX = (target.x - x) / ANIMATION_DURATION_MID * 5;
        let theXDirection = speedX > 0;
        let yDirection = speedY > 0;
        var interval = setInterval(() => {
          window.scrollTo(x += speedX, y += speedY)
          let count = 0;
          if (theXDirection && x >= target.x) {
            count++;
          } else if (!theXDirection && x <= target.x) {
            count++
          }
          if (yDirection && y >= target.y) {
            count++;
          } else if (!yDirection && y <= target.y) {
            count++
          }
          //到达目的地，停止
          if (count == 2) {
            clearInterval(interval)
          }
        }, 5)
      }
    }
  }
})
export default store