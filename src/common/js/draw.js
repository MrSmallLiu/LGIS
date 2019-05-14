class draw{
 drawPoint=function (viewer, callback) {

    var _this = this;
    _this.viewer=viewer
    //坐标存储
    var positions = [];
    var handler = new Cesium.ScreenSpaceEventHandler(_this.viewer.scene.canvas);

    //单击鼠标左键画点
    handler.setInputAction(function (movement) {
        var cartesian = _this.viewer.scene.camera.pickEllipsoid(movement.position, _this.viewer.scene.globe.ellipsoid);
        positions.push(cartesian);
        _this.viewer.entities.add({
            position: cartesian,
            point: {
                color: Cesium.Color.RED,
                pixelSize: 5,
                heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
            }
        });
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    //单击鼠标右键结束画点
    handler.setInputAction(function (movement) {
        handler.destroy();

        callback(positions);
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);

};
drawLineString= function (viewer,callback) {
        var _this = this;
        _this.viewer=viewer
        var PolyLinePrimitive = (function () {
            function _(positions) {
                this.options = {
                    polyline: {
                        show: true,
                        positions: [],
                        material: Cesium.Color.RED,
                        width: 3
                    }
                };
                this.positions = positions;
                this._init();
            }

            _.prototype._init = function () {
                var _self = this;
                var _update = function () {
                    return _self.positions;
                };
                //实时更新polyline.positions
                this.options.polyline.positions = new Cesium.CallbackProperty(_update, false);
                _this.viewer.entities.add(this.options);
            };
            return _;
        })();

        var handler = new Cesium.ScreenSpaceEventHandler(_this.viewer.scene.canvas);
        var positions = [];
        var poly = undefined;
        //鼠标左键单击画点
        handler.setInputAction(function (movement) {
            var cartesian = _this.viewer.scene.camera.pickEllipsoid(movement.position, _this.viewer.scene.globe.ellipsoid);
            if (positions.length == 0) {
                positions.push(cartesian.clone());
            }
            positions.push(cartesian);
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
        //鼠标移动
        handler.setInputAction(function (movement) {
            var cartesian = _this.viewer.scene.camera.pickEllipsoid(movement.endPosition, _this.viewer.scene.globe.ellipsoid);
            if (positions.length >= 2) {
                if (!Cesium.defined(poly)) {
                    poly = new PolyLinePrimitive(positions);
                } else {
                    if (cartesian != undefined) {
                        positions.pop();
                        cartesian.y += (1 + Math.random());
                        positions.push(cartesian);
                    }
                }
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        //单击鼠标右键结束画线
        handler.setInputAction(function (movement) {
            handler.destroy();
            callback(positions);
        }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    };
    drawPolygon= function (viewer,callback) {
        var _this = this;
        _this.viewer=viewer
        var PolygonPrimitive = (function () {
            function _(positions) {
                this.options = {
                    name: '多边形',
                    polygon: {
                        hierarchy: [],
                        perPositionHeight: true,
                        material: Cesium.Color.RED.withAlpha(0.4)
                    }
                };
                this.hierarchy = positions;
                this._init();
            }

            _.prototype._init = function () {
                var _self = this;
                var _update = function () {
                    return _self.hierarchy;
                };
                //实时更新polygon.hierarchy
                this.options.polygon.hierarchy = new Cesium.CallbackProperty(_update, false);
                _this.viewer.entities.add(this.options);
            };
            return _;
        })();

        var handler = new Cesium.ScreenSpaceEventHandler(_this.viewer.scene.canvas);
        var positions = [];
        var poly = undefined;

        //鼠标单击画点
        handler.setInputAction(function (movement) {
            var cartesian = _this.viewer.scene.camera.pickEllipsoid(movement.position, _this.viewer.scene.globe.ellipsoid);
            if (positions.length == 0) {
                positions.push(cartesian.clone());
            }
            positions.push(cartesian);
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
        //鼠标移动
        handler.setInputAction(function (movement) {
            var cartesian = _this.viewer.scene.camera.pickEllipsoid(movement.endPosition, _this.viewer.scene.globe.ellipsoid);
            if (positions.length >= 2) {
                if (!Cesium.defined(poly)) {
                    poly = new PolygonPrimitive(positions);
                } else {
                    if (cartesian != undefined) {
                        positions.pop();
                        cartesian.y += (1 + Math.random());
                        positions.push(cartesian);
                    }
                }
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        //鼠标右键单击结束绘制
        handler.setInputAction(function (movement) {
            handler.destroy();
            callback(positions);
        }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    };
    drawRect= function (viewer,callback) {
        let _self = this;
        _self.viewer=viewer
        let pointsArr = [];
        _self.shape = {
            points: [],
            rect: null,
            entity: null
        };
        var tempPosition;
        var handle = new Cesium.ScreenSpaceEventHandler(_self.viewer.scene.canvas);
        //鼠标左键单击画点
        handle.setInputAction(function (click) {
            tempPosition = _self.getPointFromWindowPoint(click.position);
            //选择的点在球面上
            if (tempPosition) {
                if (_self.shape.points.length == 0) {
                    pointsArr.push(tempPosition);
                    _self.shape.points.push(_self.viewer.scene.globe.ellipsoid.cartesianToCartographic(tempPosition));
                    _self.shape.rect = Cesium.Rectangle.fromCartographicArray(_self.shape.points);
                    _self.shape.rect.east += 0.000001;
                    _self.shape.rect.north += 0.000001;
                    _self.shape.entity = _self.viewer.entities.add({
                        rectangle: {
                            coordinates: _self.shape.rect,
                            material: Cesium.Color.BLACK.withAlpha(0.4),
                            outline: true,
                            outlineWidth: 2,
                            outlineColor: Cesium.Color.RED,
                            height: 0
                        }
                    });
                    _self.bufferEntity = _self.shape.entity;
                }
                else {
                    handle.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
                    handle.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
                    callback(pointsArr);
                }
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
        //鼠标移动
        handle.setInputAction(function (movement) {
            if (_self.shape.points.length == 0) {
                return;
            }
            var moveEndPosition = _self.getPointFromWindowPoint(movement.endPosition);
            //选择的点在球面上
            if (moveEndPosition) {
                pointsArr[1] = moveEndPosition;
                _self.shape.points[1] = _self.viewer.scene.globe.ellipsoid.cartesianToCartographic(moveEndPosition);
                _self.shape.rect = Cesium.Rectangle.fromCartographicArray(_self.shape.points);
                if (_self.shape.rect.west == _self.shape.rect.east)
                    _self.shape.rect.east += 0.000001;
                if (_self.shape.rect.south == _self.shape.rect.north)
                    _self.shape.rect.north += 0.000001;
                _self.shape.entity.rectangle.coordinates = _self.shape.rect;
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    };
    clearHandle=function (viewer) {

        //移除所有实体Entity
        this.viewer.entities.removeAll();
        this.viewer=viewer
        //移除cesium加载的ImageryLayer
        for (var i = 0; i < this.removeImageryLayers.length; i++) {
            this.viewer.imageryLayers.remove(this.removeImageryLayers[i]);
        }
    };
}
export default new draw()
