import Vue from 'vue'
import Vuex from 'vuex'
// 修改state时在console打印，便于调试
import createLogger from 'vuex/dist/logger'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

const state = {
    layerTreeData: [{
        title: "底图",
        expand: true,
        children: [{
                title: "底图"
            },
            {
                title: "注记"
            }
        ]
    }, {
        title: "自定义图层",
        expand: true,
        children: [{
                title: "WMTS"
            },
            {
                title: "OSGB"
            }
        ]
    }],
    viewer:Object
}
const getters = {
    GetLayerTreeData: state => state.layerTreeData
}
const mutations = {
    SetLayerTreeData: (state, data) => {
        state.layerTreeData = data;
    },
    setViewer:(state,viewer) => {
        state.viewer=viewer
    }
}
// const actions = {}

export default new Vuex.Store({
    state,
    getters,
    mutations,
    // actions,
    // 严格模式，非法修改state时报错
    strict: false,
    plugins: debug ? [createLogger()] : []
})