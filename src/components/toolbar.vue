<template>
  <div class="layout">
    <Layout :style="{height: '100%'}">
      <Header>
        <Menu active-name="tdt" mode="horizontal" theme="dark" v-on:on-select="toolbarChange">
          <div class="layout-logo"></div>
          <div class="layout-nav">
            <Submenu name="baselayerChange" style="font-size:16px">
              <template slot="title">
                <Icon type="logo-buffer" size="28"/>底图切换
              </template>
              <MenuItem name="天地图底图">天地图</MenuItem>
              <MenuItem name="谷歌底图">谷歌</MenuItem>
              <MenuItem name="ArcGIS底图">ArcGIS Online</MenuItem>
            </Submenu>
            <Submenu name="addLayer" style="font-size:16px">
              <template slot="title">
                <Icon type="logo-buffer" size="28"/>添加图层
              </template>
              <MenuItem name="OSGB">倾斜摄影模型</MenuItem>
              <MenuItem name="DEM">DEM</MenuItem>
            </Submenu>
            <Submenu name="addGraphic" style="font-size:16px">
              <template slot="title">
                <Icon type="logo-buffer" size="28"/>标绘
              </template>
              <MenuItem name="point">标点</MenuItem>
              <MenuItem name="line">标线</MenuItem>
              <MenuItem name="polygon">标面</MenuItem>
              <MenuItem name="clear">清除</MenuItem>
            </Submenu>
            <MenuItem name="clearPrimitive">
              <Icon type="md-refresh" size="28"/>还原
            </MenuItem>
          </div>
        </Menu>
      </Header>
      <Layout>
        <Sider hide-trigger :style="{background: '#fff'}">
          <LayerControl
            style="width:200px;overflow:auto"
            :layerData="layerTreeData"
            :selLayer="selLayer"
            :viewer="viewer"
          ></LayerControl>
        </Sider>
        <Layout>
          <Content :style="{height: '100%',  background: '#fff'}">
            <div id="mapContent" style="height:100%"></div>
          </Content>
        </Layout>
      </Layout>
    </Layout>
    <Modal v-model="osgbModal_is" title="添加倾斜摄影模型" width="560" @on-ok="osgbAdd">
      <!-- <p>After you click ok, the dialog box will close in 2 seconds.</p> -->
      <div>
        OSGB地址:
        <Input v-model="osgbUrl" placeholder="请输入OSGB瓦片地址" clearable style="width: 240px"/>
      </div>
      <div style="margin-top:18px;">
        OSGB位置:
        <Input v-model="osgbLon" placeholder="请输入OSGB经度" clearable style="width: 100px"/>
        <Input v-model="osgbLat" placeholder="请输入OSGB纬度" clearable style="width: 100px"/>
        <Input v-model="osgbHeight" placeholder="请输入OSGB高度" clearable style="width: 100px"/>
      </div>
    </Modal>
    <Modal v-model="demModal_is" title="添加DEM" width="560" @on-ok="demAdd">
      <!-- <p>After you click ok, the dialog box will close in 2 seconds.</p> -->
      <div>
        DEM地址:
        <Input v-model="osgbUrl" placeholder="请输入DEM瓦片地址" clearable style="width: 240px"/>
      </div>
      <div style="margin-top:18px;">
        OSGB位置:
        <Input v-model="osgbLon" placeholder="请输入DEM经度" clearable style="width: 100px"/>
        <Input v-model="osgbLat" placeholder="请输入DEM纬度" clearable style="width: 100px"/>
        <Input v-model="osgbHeight" placeholder="请输入DEM高度" clearable style="width: 100px"/>
      </div>
    </Modal>
  </div>
</template>
<script>
import LayerControl from "./layerControl.vue";
import draw from "../common/js/draw";
export default {
  name: "Home",
  components: {
    LayerControl
  },
  props: {},
  data() {
    return {
      viewer: null,
      osgbModal_is: false, //倾斜摄影模型的对话框
      demModal_is: false,
      // osgbModalLoading_is: true, //倾斜摄影模型是否异步
      osgbUrl: "http://127.0.0.1:8081/tiles/tileset.json",
      osgbLon: 116.398207,
      osgbLat: 39.907155,
      osgbHeight: -150,
      selLayer: "天地图底图",
      layerTreeData: [
        {
          title: "底图",
          expand: true,
          children: [
            {
              title: "天地图底图",
              checked: true
            },
            {
              title: "注记",
              checked: true
            }
          ]
        }
      ],
      drawType: null
    };
  },
  mounted: function() {
    window.Cesium.Ion.defaultAccessToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI1YWNkNjZiZC0wYjQ1LTQ4NjQtYTM5OC1lYzhlYmY0MWZlNzQiLCJpZCI6NjE2Mywic2NvcGVzIjpbImFzciIsImdjIl0sImlhdCI6MTU0NTQ2MDQ4MH0.1C-TB8mSOxn_eUDi_S76XqpmnpPqXFsT9q5dsIEAtVE";
    this.viewer = new window.Cesium.Viewer("mapContent", {
      imageryProvider: new window.Cesium.WebMapTileServiceImageryProvider({
        url:
          "http://t0.tianditu.gov.cn/img_w/wmts?tk=2aa7f0081af9c7cf6c6a60d20335dd99&service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles",
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
      // terrainProvider: window.Cesium.createWorldTerrain()
    });
    this.$store.commit("setViewer", this.viewer);
    // console.log(this.$store.state.viewer)
    //     //this.$store.state.viewer = this.viewer;
    //     //console.log(this.$store.state.newslist)
    this.viewer._cesiumWidget._creditContainer.style.display = "none";
    this.viewer.camera.flyTo({
      destination: window.Cesium.Cartesian3.fromDegrees(116, 39, 8000000)
    });
  },
  methods: {
    toolbarChange: function(layerID) {
      // this.layerTreeData = [
      //   {
      //     title: "底图",
      //     expand: true,
      //     children: [
      //       {
      //         title: layerID,
      //         checked: true
      //       },
      //       {
      //         title: "注记",
      //         checked: true
      //       }
      //     ]
      //   }
      // ];
      this.selLayer = layerID;
      //判断选择的是否是标绘
      if (
        layerID == "point" ||
        layerID == "line" ||
        layerID == "polygon" ||
        layerID == "clear"
      ) {
        this.drawType = layerID;
      }
      if (layerID == "OSGB") {
        this.osgbModal_is = true;
      }
      if (layerID == "DEM") {
        this.demModal_is = true;
      }
      if ((layerID = "clearPrimitive")) {
        this.removeAllPrimitive();
      }
    },
    layerTreeChange(data) {
      this.layerTreeData = data;
    },
    osgbAdd() {
      this.osgbModal_is = false;
      let tileset = new window.Cesium.Cesium3DTileset({
        url: this.osgbUrl
      });
      // debugger;
      this.viewer.scene.primitives.add(tileset);
      let that = this;
      tileset.readyPromise.then(function() {
        let position = window.Cesium.Cartesian3.fromDegrees(
          that.osgbLon,
          that.osgbLat,
          that.osgbHeight
        );
        let mat = window.Cesium.Transforms.eastNorthUpToFixedFrame(position);
        let rotationX = window.Cesium.Matrix4.fromRotationTranslation(
          window.Cesium.Matrix3.fromRotationZ(window.Cesium.Math.toRadians(0))
        );
        window.Cesium.Matrix4.multiply(mat, rotationX, mat);
        tileset._root.transform = mat;
        that.viewer.camera.flyTo({
          destination: window.Cesium.Cartesian3.fromDegrees(
            that.osgbLon,
            that.osgbLat,
            that.osgbHeight + 1000
          )
        });
      });
    },
    demAdd() {
      this.demModal_is = false;
      let tileset = new window.Cesium.Cesium3DTileset({
        url: this.osgbUrl
      });
      // debugger;
      this.viewer.scene.primitives.add(tileset);
      let that = this;
      tileset.readyPromise.then(function() {
        let position = window.Cesium.Cartesian3.fromDegrees(
          that.osgbLon,
          that.osgbLat,
          that.osgbHeight
        );
        let mat = window.Cesium.Transforms.eastNorthUpToFixedFrame(position);
        let rotationX = window.Cesium.Matrix4.fromRotationTranslation(
          window.Cesium.Matrix3.fromRotationZ(window.Cesium.Math.toRadians(0))
        );
        window.Cesium.Matrix4.multiply(mat, rotationX, mat);
        tileset._root.transform = mat;
        that.viewer.camera.flyTo({
          destination: window.Cesium.Cartesian3.fromDegrees(
            that.osgbLon,
            that.osgbLat,
            that.osgbHeight + 1000
          )
        });
      });
    },
    removeAllPrimitive() {
      this.viewer.scene.primitives.removeAll();
      this.viewer.camera.flyTo({
        destination: window.Cesium.Cartesian3.fromDegrees(116, 39, 8000000)
      });
    }
  },
  watch: {
    drawType(newValue) {
      switch (newValue) {
        case "point":
          draw.drawPoint(this.$store.state.viewer, function() {});
          break;
        case "line":
          draw.drawLineString(this.$store.state.viewer, function() {});
          break;
        case "polygon":
          draw.drawPolygon(this.$store.state.viewer, function() {});
          break;
        case "clear":
          draw.clearHandle(this.$store.state.viewer);
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
  width: 580px;
  margin: 0 auto;
  margin-right: 20px;
}
</style>