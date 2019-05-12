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
              <MenuItem name="天地图底图">天地图</MenuItem>
              <MenuItem name="谷歌底图">谷歌</MenuItem>
              <MenuItem name="ArcGIS底图">ArcGIS Online</MenuItem>
            </Submenu>
            <Submenu name="addLayer" style="font-size:16px">
              <template slot="title">
                <Icon type="logo-buffer" size='28' />添加图层
              </template>
              <MenuItem name="WMTS">WMTS</MenuItem>
              <MenuItem name="OSGB">倾斜摄影</MenuItem>
            </Submenu>
            <Submenu name="addGraphic" style="font-size:16px">
              <template slot="title">
                <Icon type="logo-buffer" size='28' />标绘
              </template>
              <MenuItem name="point" >标点</MenuItem>
              <MenuItem name="line">标线</MenuItem>
              <MenuItem name="polygon">标面</MenuItem>
              <MenuItem name="clear">清除</MenuItem>
            </Submenu>
          </div>


        </Menu>
      </Header>
      <Layout>
        <Sider hide-trigger :style="{background: '#fff'}">
          <LayerControl style="width:200px;overflow:auto" v-on:layerTreeChange="layerTreeChange" :layerData="layerTreeData"
            :selLayer="selLayer" :viewer="viewer"></LayerControl>
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
  // import draw from "../common/js/draw"
  export default {
    name: "Home",
    components: {
      LayerControl
    },
    props: {},
    data() {
      return {
        viewer: null,
        selLayer: "天地图底图",
        layerTreeData: [{
          title: "底图",
          expand: true,
          children: [{
              title: "天地图底图",
              checked: true
            },
            {
              title: "注记",
              checked: true
            }
          ]
        }],
          drawType:null
      };
    },
    mounted: function () {
      window.Cesium.Ion.defaultAccessToken =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI1YWNkNjZiZC0wYjQ1LTQ4NjQtYTM5OC1lYzhlYmY0MWZlNzQiLCJpZCI6NjE2Mywic2NvcGVzIjpbImFzciIsImdjIl0sImlhdCI6MTU0NTQ2MDQ4MH0.1C-TB8mSOxn_eUDi_S76XqpmnpPqXFsT9q5dsIEAtVE'
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
        navigationInstructionsInitiallyVisible: false,
        // terrainProvider: window.Cesium.createWorldTerrain()
      });
      this.$store.commit('setViewer',this.viewer)
    // console.log(this.$store.state.viewer)
    //     //this.$store.state.viewer = this.viewer;
    //     //console.log(this.$store.state.newslist)
      this.viewer._cesiumWidget._creditContainer.style.display = "none";
      this.viewer.camera.flyTo({
        destination: window.Cesium.Cartesian3.fromDegrees(116, 39, 8000000)
      })
    },
    methods: {
      getSelName: function (layerID) {
        this.layerTreeData = [{
          title: "底图",
          expand: true,
          children: [{
              title: layerID,
              checked: true
            },
            {
              title: "注记",
              checked: true
            }
          ]
        }]
        this.selLayer = layerID;
        //判断选择的是否是标绘
       if( layerID=="point" || layerID=="line"|| layerID=="polygon" ||layerID=="clear"){
           this.drawType=layerID;
       }
      },
      layerTreeChange(data) {
        this.layerTreeData = data;
      }
    },
    watch:{
        drawType(newValue){
            switch (newValue){
                case "point":draw.drawPoint(this.$store.state.viewer,function () {
            });
                break;
                case "line":draw.drawLineString(this.$store.state.viewer,function () {
                });
                    break;
                case "polygon":draw.drawPolygon(this.$store.state.viewer,function () {
                });
                    break;
                case "clear":draw.clearHandle(this.$store.state.viewer);
                    break;
            }

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
    width: 520px;
    margin: 0 auto;
    margin-right: 20px;
  }
</style>