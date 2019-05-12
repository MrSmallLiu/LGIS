<template>
    <Tree :data="layerData" show-checkbox></Tree>
</template>
<script>
    export default {
        name: "LayerControl",
        data() {
            return {
                layerData: [{
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
                }]
            }
        },
        props: {
            viewer: null,
            selLayer: {
                Type: String
            }
        },
        watch: {
            selLayer(newValue) {
                if (newValue) {
                    console.log(this.viewer.imageryLayers.length)
                    //cl=this.viewer.imageryLayers.get_layers()
                    //更改底图，并且改变选择状态
                    this.changeLayer(newValue)
                }
            }
        },
        methods: {
            changeLayer: function (layerID) {
                this.viewer.imageryLayers.removeAll();
                switch (layerID) {
                    case "tdt":
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
                    case "gg":
                        let url =
                            "http://mt1.google.cn/vt/lyrs=s&hl=zh-CN&x={x}&y={y}&z={z}&s=Gali";
                        this.viewer.imageryLayers.addImageryProvider(
                            new window.Cesium.UrlTemplateImageryProvider({
                                url: url
                            })
                        );
                        break;
                    case "arcgis":
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