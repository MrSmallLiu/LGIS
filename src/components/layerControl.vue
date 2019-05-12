<template>
    <Tree :data="layerData" show-checkbox v-on:on-check-change="layerCheckChange"></Tree>
</template>
<script>
    import {
        mapGetters,
        mapMutations
    } from "vuex";
    export default {
        name: "LayerControl",
        data() {
            return {
                // layerData: []
            };
        },
        mounted: function () {
            // this.layerData = [];
        },

        computed: {
            // layerData: {
            //   get: function() {
            //     return this.GetLayerTreeData;
            //   },
            //   set: function(value) {
            //     console.log("value", value);
            //     // debugger;
            //     this.SetLayerTreeData(value);
            //   }
            // }
        },
        props: {
            viewer: null,
            selLayer: {
                Type: String
            },
            layerData: {
                Type: Array
            }
        },
        watch: {
            selLayer(newValue) {
                if (newValue) {
                    // console.log(this.viewer.imageryLayers.length);
                    //cl=this.viewer.imageryLayers.get_layers()
                    //更改底图，并且改变选择状态
                    this.changeLayer(newValue);
                }
            }
        },
        methods: {
            changeLayer: function (layerID) {
                //   console.log(this.GetLayerTreeData);
                if(layerID!="tdt" ||layerID!="gg"|| layerID!="arcgis"){
                    return
                }
                this.viewer.imageryLayers.removeAll();
                switch (layerID) {
                    case "天地图底图":
                        this.viewer.imageryLayers.addImageryProvider(
                            new window.Cesium.WebMapTileServiceImageryProvider({
                                url: "http://t0.tianditu.com/vec_w/wmts?tk=2aa7f0081af9c7cf6c6a60d20335dd99&service=wmts&request=GetTile&version=1.0.0&LAYER=vec&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles",
                                //url:"http://t0.tianditu.com/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles",
                                layer: "tdtBasicLayer",
                                style: "default",
                                format: "image/jpeg",
                                tileMatrixSetID: "GoogleMapsCompatible",
                                show: false,
                                maximumLevel: 16
                            })
                        );
                        break;
                    case "谷歌底图":
                        let url =
                            "http://mt1.google.cn/vt/lyrs=s&hl=zh-CN&x={x}&y={y}&z={z}&s=Gali";
                        this.viewer.imageryLayers.addImageryProvider(
                            new window.Cesium.UrlTemplateImageryProvider({
                                url: url
                            })
                        );
                        break;
                    case "ArcGIS底图":
                        this.viewer.imageryLayers.addImageryProvider(
                            new window.Cesium.ArcGisMapServerImageryProvider({
                                url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer",
                                enablePickFeatures: false
                            })
                        );
                        break;
                    default:
                        break;
                }
                this.viewer.imageryLayers.addImageryProvider(new Cesium.WebMapTileServiceImageryProvider({
                    url: "http://t0.tianditu.gov.cn/cva_w/wmts?tk=2aa7f0081af9c7cf6c6a60d20335dd99&service=wmts&request=GetTile&version=1.0.0&LAYER=cva&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles",
                    layer: "tdtAnnoLayer",
                    style: "default",
                    format: "image/jpeg",
                    tileMatrixSetID: "GoogleMapsCompatible",
                    show: false
                }));
            }
        }
    };
</script>