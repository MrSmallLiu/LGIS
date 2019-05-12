<template>
  <div class="layout">

    <Layout :style="{height: '100%'}">
      <Header>
        <Menu active-name="tdt" mode="horizontal" theme="dark" v-on:on-select="getSelName">
          <div class="layout-logo"></div>
          <div class="layout-nav">
            <Submenu name="baselayerChange" style="font-size:16px">
              <template slot="title">
                <Icon type="logo-buffer" size='28' />底图切换
              </template>
              <MenuItem name="tdt">天地图</MenuItem>
              <MenuItem name="gg">谷歌</MenuItem>
              <MenuItem name="arcgis">ArcGIS Online</MenuItem>
            </Submenu>
          </div>
        </Menu>
      </Header>
      <Layout>
       <Sider hide-trigger :style="{background: '#fff'}"> 
        <LayerControl style="width:200px;overflow:auto" :selLayer="selLayer" :viewer="viewer"></LayerControl>
         </Sider> 
        <Layout>
          <Content :style="{height: '100%',  background: '#fff'}">
            <div id="mapContent" style="height:100%">
            </div>
          </Content>
        </Layout>
      </Layout>
    </Layout>

  </div>
</template>
<script>
  import LayerControl from "./layerControl.vue";
  export default {
    name: "Home",
    components: {
      LayerControl
    },
    props: {},
    data() {
      return {
        viewer: null,
        selLayer: "tdt"
      };
    },
    mounted: function () {
      this.viewer = new window.Cesium.Viewer("mapContent", {
        imageryProvider: new window.Cesium.WebMapTileServiceImageryProvider({
          url: "http://t0.tianditu.gov.cn/img_w/wmts?tk=2aa7f0081af9c7cf6c6a60d20335dd99&service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles",
          layer: "tdtBasicLayer",
          style: "default",
          format: "image/jpeg",
          tileMatrixSetID: "GoogleMapsCompatible",
          show: false,
          maximumLevel: 16
        }),
        homeButton: false,
        navigationHelpButton: false,
        timeline: false,
        animation: false,
        sceneModePicker: false,
        baseLayerPicker: false,
        geocoder: false,
        fullscreenButton: false,
        navigationInstructionsInitiallyVisible: false
      });

      this.viewer._cesiumWidget._creditContainer.style.display = "none";
    },
    methods: {
      getSelName: function (layerID) {
        this.selLayer = layerID;
      }
    }
  };
</script>
<style scoped>
  .baseLayerChangeClass {
    width: 50px;
  }

  .layout {
    border: 1px solid #d7dde4;
    background: #f5f7f9;
    position: relative;
    border-radius: 4px;
    overflow: hidden;
    height: 100%;
  }

  .layout-logo {
    width: 100px;
    height: 30px;
    background: #5b6270;
    border-radius: 3px;
    float: left;
    position: relative;
    top: 15px;
    left: 20px;
  }

  .layout-nav {
    width: 420px;
    margin: 0 auto;
    margin-right: 20px;
  }
</style>