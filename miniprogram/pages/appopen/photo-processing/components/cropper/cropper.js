Component({
    properties: {
        imgSrc: { type: String },
        height: { type: Number, value: 200 },
        width: { type: Number, value: 200 },
        realHeight: { type: Number, value: 200 },
        realWidth: { type: Number, value: 200 },
        min_width: { type: Number, value: 100 },
        min_height: { type: Number, value: 100 },
        max_width: { type: Number, value: 300 },
        max_height: { type: Number, value: 300 },
        disable_width: { type: Boolean, value: false },
        disable_height: { type: Boolean, value: false },
        disable_ratio: { type: Boolean, value: false },
        export_scale: { type: Number, value: 3 },
        quality: { type: Number, value: 1 },
        cut_top: { type: Number, value: null },
        cut_left: { type: Number, value: null },
        canvas_top: { type: Number, value: null },
        canvas_left: { type: Number, value: null },
        img_width: { type: Number, value: null },
        img_height: { type: Number, value: null },
        scale: { type: Number, value: 1 },
        angle: { type: Number, value: 0 },
        min_scale: { type: Number, value: .5 },
        max_scale: { type: Number, value: 3 },
        disable_rotate: { type: Boolean, value: true },
        limit_move: { type: Boolean, value: false }
    },
    data: {
        el: "image-cropper",
        info: wx.getSystemInfoSync(),
        MOVE_THROTTLE: null,
        MOVE_THROTTLE_FLAG: true,
        INIT_IMGWIDTH: 0,
        INIT_IMGHEIGHT: 0,
        TIME_BG: null,
        TIME_CUT_CENTER: null,
        _touch_img_relative: [{
            x: 0,
            y: 0
        }],
        _flag_cut_touch: false,
        _hypotenuse_length: 0,
        _flag_img_endtouch: false,
        _flag_bright: true,
        _canvas_overflow: true,
        _canvas_width: 200,
        _canvas_height: 200,
        origin_x: .5,
        origin_y: .5,
        _cut_animation: false,
        _img_top: wx.getSystemInfoSync().windowHeight / 2,
        _img_left: wx.getSystemInfoSync().windowWidth / 2,
        watch: {
            width: function (t, a) {
                t < a.data.min_width && a.setData({
                    width: a.data.min_width
                }), a._computeCutSize();
            },
            height: function (t, a) {
                t < a.data.min_height && a.setData({
                    height: a.data.min_height
                }), a._computeCutSize();
            },
            angle: function (t, a) {
                a._moveStop(), a.data.limit_move && a.data.angle % 90 && a.setData({
                    angle: 90 * Math.round(a.data.angle / 90)
                });
            },
            _cut_animation: function (t, a) {
                clearTimeout(a.data._cut_animation_time), t && (a.data._cut_animation_time = setTimeout(function () {
                    a.setData({
                        _cut_animation: false
                    });
                }, 300));
            },
            limit_move: function (t, a) {
                t && (a.data.angle % 90 && a.setData({
                    angle: 90 * Math.round(a.data.angle / 90)
                }), a._imgMarginDetectionScale(), !a.data._canvas_overflow && a._draw());
            },
            canvas_top: function (t, a) {
                a._canvasDetectionPosition();
            },
            canvas_left: function (t, a) {
                a._canvasDetectionPosition();
            },
            imgSrc: function (t, a) {
                a.pushImg();
            },
            cut_top: function (t, a) {
                a._cutDetectionPosition(), a.data.limit_move && !a.data._canvas_overflow && a._draw();
            },
            cut_left: function (t, a) {
                a._cutDetectionPosition(), a.data.limit_move && !a.data._canvas_overflow && a._draw();
            }
        },
        showTips: true
    },
    attached: function () {
        this.data.info = wx.getSystemInfoSync(), this._watcher(), this.data.INIT_IMGWIDTH = this.data.img_width,
            this.data.INIT_IMGHEIGHT = this.data.img_height, this.setData({
                _canvas_height: this.data.height,
                _canvas_width: this.data.width
            }), this._initCanvas(), this.data.imgSrc && (this.data.imgSrc = this.data.imgSrc),
            this._initImageSize(), this._computeCutSize(), this._cutDetectionPosition(), this._canvasDetectionPosition(),
            this.triggerEvent("load", {
                cropper: this
            });
    },
    methods: {
        upload: function () {
            var t = this;
            wx.chooseImage({
                count: 1,
                sizeType: ["original", "compressed"],
                sourceType: ["album", "camera"],
                success: function (a) {
                    var i = a.tempFilePaths[0];
                    t.pushImg(i), wx.showLoading({
                        title: "加载中..."
                    });
                }
            });
        },
        getImg: function (t) {
            var a = this;
            this._draw(function () {
                wx.canvasToTempFilePath({
                    width: a.data.width * a.data.export_scale,
                    height: Math.round(a.data.height * a.data.export_scale),
                    destWidth: a.data.width * a.data.export_scale,
                    destHeight: Math.round(a.data.height) * a.data.export_scale,
                    fileType: "jpg",
                    quality: a.data.quality,
                    canvasId: a.data.el,
                    success: function (i) {
                        t({
                            url: i.tempFilePath,
                            width: a.data.width * a.data.export_scale,
                            height: a.data.height * a.data.export_scale
                        });
                    }
                }, a);
            });
        },
        setTransform: function (t) {
            if (t) {
                this.data.disable_rotate || this.setData({
                    angle: t.angle ? this.data.angle + t.angle : this.data.angle
                });
                var a = this.data.scale;
                t.scale && (a = (a = (a = this.data.scale + t.scale) <= this.data.min_scale ? this.data.min_scale : a) >= this.data.max_scale ? this.data.max_scale : a),
                    this.data.scale = a;
                var i = this.data.cut_left, h = this.data.cut_top;
                t.cutX && (this.setData({
                    cut_left: i + t.cutX
                }), this.data.watch.cut_left(null, this)), t.cutY && (this.setData({
                    cut_top: h + t.cutY
                }), this.data.watch.cut_top(null, this)), this.data._img_top = t.y ? this.data._img_top + t.y : this.data._img_top,
                    this.data._img_left = t.x ? this.data._img_left + t.x : this.data._img_left, this._imgMarginDetectionScale(),
                    this._moveDuring(), this.setData({
                        scale: this.data.scale,
                        _img_top: this.data._img_top,
                        _img_left: this.data._img_left
                    }), !this.data._canvas_overflow && this._draw(), this._moveStop();
            }
        },
        setCutXY: function (t, a) {
            this.setData({
                cut_top: a,
                cut_left: t
            });
        },
        setCutSize: function (t, a) {
            this.setData({
                width: t,
                height: a
            }), this._computeCutSize();
        },
        setCutCenter: function () {
            var t = .5 * (this.data.info.windowHeight - this.data.height), a = .5 * (this.data.info.windowWidth - this.data.width);
            this.setData({
                _img_top: this.data._img_top - this.data.cut_top + t,
                cut_top: t,
                _img_left: this.data._img_left - this.data.cut_left + a,
                cut_left: a
            });
        },
        _setCutCenter: function () {
            var t = .5 * (this.data.info.windowHeight - this.data.height), a = .5 * (this.data.info.windowWidth - this.data.width);
            this.setData({
                cut_top: t,
                cut_left: a
            });
        },
        setWidth: function (t) {
            this.setData({
                width: t
            }), this._computeCutSize();
        },
        setHeight: function (t) {
            this.setData({
                height: t
            }), this._computeCutSize();
        },
        setDisableRotate: function (t) {
            this.data.disable_rotate = t;
        },
        setLimitMove: function (t) {
            this.setData({
                _cut_animation: true,
                limit_move: !!t
            });
        },
        imgReset: function () {
            this.setData({
                scale: 1,
                angle: 0,
                _img_top: wx.getSystemInfoSync().windowHeight / 2,
                _img_left: wx.getSystemInfoSync().windowWidth / 2
            });
        },
        pushImg: function (t) {
            var a = this;
            t ? this.setData({
                imgSrc: t
            }) : this.data.imgSrc && wx.getImageInfo({
                src: this.data.imgSrc,
                success: function (t) {
                    a.data.imageObject = t, -1 == a.data.imgSrc.search(/tmp/) && a.setData({
                        imgSrc: t.path
                    }), a._imgComputeSize(), a.data.limit_move && a._imgMarginDetectionScale(), a._draw();
                },
                fail: function (t) {
                    a.setData({
                        imgSrc: ""
                    });
                }
            });
        },
        imageLoad: function (t) {
            var a = this;
            setTimeout(function () {
                a.triggerEvent("imageload", a.data.imageObject);
            }, 1e3);
        },
        setScale: function (t) {
            t && (this.setData({
                scale: t
            }), !this.data._canvas_overflow && this._draw());
        },
        setAngle: function (t) {
            t && (this.setData({
                _cut_animation: true,
                angle: t
            }), this._imgMarginDetectionScale(), !this.data._canvas_overflow && this._draw());
        },
        _initCanvas: function () {
            this.data.ctx || (this.data.ctx = wx.createCanvasContext("image-cropper", this));
        },
        _initImageSize: function () {
            if (this.data.INIT_IMGWIDTH && "string" == typeof this.data.INIT_IMGWIDTH && -1 != this.data.INIT_IMGWIDTH.indexOf("%")) {
                var t = this.data.INIT_IMGWIDTH.replace("%", "");
                this.data.INIT_IMGWIDTH = this.data.img_width = this.data.info.windowWidth / 100 * t;
            }
            if (this.data.INIT_IMGHEIGHT && "string" == typeof this.data.INIT_IMGHEIGHT && -1 != this.data.INIT_IMGHEIGHT.indexOf("%")) {
                var a = this.data.img_height.replace("%", "");
                this.data.INIT_IMGHEIGHT = this.data.img_height = this.data.info.windowHeight / 100 * a;
            }
        },
        _cutDetectionPosition: function () {
            var t = this, a = function () {
                t.data.cut_top < 0 && t.setData({
                    cut_top: 0
                }), t.data.cut_top > t.data.info.windowHeight - t.data.height && t.setData({
                    cut_top: t.data.info.windowHeight - t.data.height
                });
            }, i = function () {
                t.data.cut_left < 0 && t.setData({
                    cut_left: 0
                }), t.data.cut_left > t.data.info.windowWidth - t.data.width && t.setData({
                    cut_left: t.data.info.windowWidth - t.data.width
                });
            };
            null == this.data.cut_top && null == this.data.cut_left ? this._setCutCenter() : null != this.data.cut_top && null != this.data.cut_left ? (a(),
                i()) : null != this.data.cut_top && null == this.data.cut_left ? (a(), this.setData({
                    cut_left: (this.data.info.windowWidth - this.data.width) / 2
                })) : null == this.data.cut_top && null != this.data.cut_left && (i(), this.setData({
                    cut_top: (this.data.info.windowHeight - this.data.height) / 2
                }));
        },
        _canvasDetectionPosition: function () {
            null == this.data.canvas_top && null == this.data.canvas_left ? (this.data._canvas_overflow = false,
                this.setData({
                    canvas_top: -5e3,
                    canvas_left: -5e3
                })) : null != this.data.canvas_top && null != this.data.canvas_left ? this.data.canvas_top < -this.data.height || this.data.canvas_top > this.data.info.windowHeight ? this.data._canvas_overflow = true : this.data._canvas_overflow = false : null != this.data.canvas_top && null == this.data.canvas_left ? this.setData({
                    canvas_left: 0
                }) : null == this.data.canvas_top && null != this.data.canvas_left && (this.setData({
                    canvas_top: 0
                }), this.data.canvas_left < -this.data.width || this.data.canvas_left > this.data.info.windowWidth ? this.data._canvas_overflow = true : this.data._canvas_overflow = false);
        },
        _imgMarginDetectionPosition: function (t) {
            if (this.data.limit_move) {
                var a = this.data._img_left, i = this.data._img_top, h = (t = t || this.data.scale,
                    this.data.img_width), e = this.data.img_height;
                this.data.angle / 90 % 2 && (h = this.data.img_height, e = this.data.img_width),
                    a = this.data.cut_left + h * t / 2 >= a ? a : this.data.cut_left + h * t / 2, a = this.data.cut_left + this.data.width - h * t / 2 <= a ? a : this.data.cut_left + this.data.width - h * t / 2,
                    i = this.data.cut_top + e * t / 2 >= i ? i : this.data.cut_top + e * t / 2, i = this.data.cut_top + this.data.height - e * t / 2 <= i ? i : this.data.cut_top + this.data.height - e * t / 2,
                    this.setData({
                        _img_left: a,
                        _img_top: i,
                        scale: t
                    });
            }
        },
        _imgMarginDetectionScale: function () {
            if (this.data.limit_move) {
                var t = this.data.scale, a = this.data.img_width, i = this.data.img_height;
                this.data.angle / 90 % 2 && (a = this.data.img_height, i = this.data.img_width),
                    a * t < this.data.width && (t = this.data.width / a), i * t < this.data.height && (t = Math.max(t, this.data.height / i)),
                    this._imgMarginDetectionPosition(t);
            }
        },
        _setData: function (t) {
            var a = {};
            for (var i in t) this.data[i] != t[i] && (a[i] = t[i]);
            return this.setData(a), a;
        },
        _imgComputeSize: function () {
            var t = this.data.img_width, a = this.data.img_height;
            this.data.INIT_IMGHEIGHT || this.data.INIT_IMGWIDTH ? this.data.INIT_IMGHEIGHT && !this.data.INIT_IMGWIDTH ? t = this.data.imageObject.width / this.data.imageObject.height * this.data.INIT_IMGHEIGHT : !this.data.INIT_IMGHEIGHT && this.data.INIT_IMGWIDTH && (a = this.data.imageObject.height / this.data.imageObject.width * this.data.INIT_IMGWIDTH) : (t = this.data.imageObject.width) / (a = this.data.imageObject.height) > this.data.width / this.data.height ? (a = this.data.height,
                t = this.data.imageObject.width / this.data.imageObject.height * a) : (t = this.data.width,
                    a = this.data.imageObject.height / this.data.imageObject.width * t), this.setData({
                        img_width: t,
                        img_height: a
                    });
        },
        _computeCutSize: function () {
            this.data.width > this.data.info.windowWidth ? this.setData({
                width: this.data.info.windowWidth
            }) : this.data.width + this.data.cut_left > this.data.info.windowWidth && this.setData({
                cut_left: this.data.info.windowWidth - this.data.cut_left
            }), this.data.height > this.data.info.windowHeight ? this.setData({
                height: this.data.info.windowHeight
            }) : this.data.height + this.data.cut_top > this.data.info.windowHeight && this.setData({
                cut_top: this.data.info.windowHeight - this.data.cut_top
            }), !this.data._canvas_overflow && this._draw();
        },
        _start: function (t) {
            if (this.data._flag_img_endtouch = false, 1 == t.touches.length) this.data._touch_img_relative[0] = {
                x: t.touches[0].clientX - this.data._img_left,
                y: t.touches[0].clientY - this.data._img_top
            }; else {
                var a = Math.abs(t.touches[0].clientX - t.touches[1].clientX), i = Math.abs(t.touches[0].clientY - t.touches[1].clientY);
                this.data._touch_img_relative = [{
                    x: t.touches[0].clientX - this.data._img_left,
                    y: t.touches[0].clientY - this.data._img_top
                }, {
                    x: t.touches[1].clientX - this.data._img_left,
                    y: t.touches[1].clientY - this.data._img_top
                }], this.data._hypotenuse_length = Math.sqrt(Math.pow(a, 2) + Math.pow(i, 2));
            }
            !this.data._canvas_overflow && this._draw();
        },
        _move_throttle: function () {
            var t = this;
            if ("android" == this.data.info.platform) return clearTimeout(this.data.MOVE_THROTTLE),
                this.data.MOVE_THROTTLE = setTimeout(function () {
                    t.data.MOVE_THROTTLE_FLAG = true;
                }, 25), this.data.MOVE_THROTTLE_FLAG;
            this.data.MOVE_THROTTLE_FLAG = true;
        },
        _move: function (t) {
            if (!this.data._flag_img_endtouch && this.data.MOVE_THROTTLE_FLAG) {
                if (this.data.MOVE_THROTTLE_FLAG = false, this._move_throttle(), this._moveDuring(),
                    1 == t.touches.length) {
                    var a = t.touches[0].clientX - this.data._touch_img_relative[0].x, i = t.touches[0].clientY - this.data._touch_img_relative[0].y;
                    this.data._img_left = a, this.data._img_top = i, this._imgMarginDetectionPosition(),
                        this.setData({
                            _img_left: this.data._img_left,
                            _img_top: this.data._img_top
                        });
                } else {
                    var h = Math.abs(t.touches[0].clientX - t.touches[1].clientX), e = Math.abs(t.touches[0].clientY - t.touches[1].clientY), s = Math.sqrt(Math.pow(h, 2) + Math.pow(e, 2)), d = this.data.scale * (s / this.data._hypotenuse_length), _ = 0;
                    d = (d = d <= this.data.min_scale ? this.data.min_scale : d) >= this.data.max_scale ? this.data.max_scale : d,
                        this.data.scale = d, this._imgMarginDetectionScale();
                    var n = [{
                        x: t.touches[0].clientX - this.data._img_left,
                        y: t.touches[0].clientY - this.data._img_top
                    }, {
                        x: t.touches[1].clientX - this.data._img_left,
                        y: t.touches[1].clientY - this.data._img_top
                    }];
                    if (!this.data.disable_rotate) {
                        var o = 180 / Math.PI * Math.atan2(n[0].y, n[0].x) - 180 / Math.PI * Math.atan2(this.data._touch_img_relative[0].y, this.data._touch_img_relative[0].x), c = 180 / Math.PI * Math.atan2(n[1].y, n[1].x) - 180 / Math.PI * Math.atan2(this.data._touch_img_relative[1].y, this.data._touch_img_relative[1].x);
                        0 != o ? _ = o : 0 != c && (_ = c);
                    }
                    this.data._touch_img_relative = n, this.data._hypotenuse_length = Math.sqrt(Math.pow(h, 2) + Math.pow(e, 2)),
                        this.setData({
                            angle: this.data.angle + _,
                            scale: this.data.scale
                        });
                }
                !this.data._canvas_overflow && this._draw();
            }
        },
        _end: function (t) {
            this.data._flag_img_endtouch = true, this._moveStop();
        },
        crop: function () {
            var t = this;
            this.data.imgSrc ? (wx.showLoading({
                title: "裁剪中.."
            }), this._draw(function () {
                wx.canvasToTempFilePath({
                    width: t.data.width * t.data.export_scale,
                    height: Math.round(t.data.height * t.data.export_scale),
                    destWidth: t.data.width * t.data.export_scale,
                    destHeight: Math.round(t.data.height) * t.data.export_scale,
                    fileType: "jpg",
                    quality: t.data.quality,
                    canvasId: t.data.el,
                    success: function (a) {
                        wx.hideLoading(), t.triggerEvent("tapcrop", {
                            url: a.tempFilePath,
                            width: t.data.width * t.data.export_scale,
                            height: t.data.height * t.data.export_scale
                        });
                    },
                    fail: function (t) {
                        console.log(t);
                    }
                }, t);
            })) : this.upload();
        },
        cancel: function () {
            this.triggerEvent("tapcancel");
        },
        _draw: function (t) {
            var a = this;
            if (this.data.imgSrc) {
                var i = function () {
                    var i = a.data.img_width * a.data.scale * a.data.export_scale, h = a.data.img_height * a.data.scale * a.data.export_scale, e = a.data._img_left - a.data.cut_left, s = a.data._img_top - a.data.cut_top;
                    a.data.ctx.translate(e * a.data.export_scale, s * a.data.export_scale), a.data.ctx.rotate(a.data.angle * Math.PI / 180),
                        a.data.ctx.drawImage(a.data.imgSrc, -i / 2, -h / 2, i, h), a.data.ctx.draw(false, function () {
                            t && t();
                        });
                };
                this.data.ctx.width != this.data.width || this.data.ctx.height != this.data.height ? this.setData({
                    _canvas_height: this.data.height,
                    _canvas_width: this.data.width
                }, function () {
                    setTimeout(function () {
                        i();
                    }, 40);
                }) : i();
            }
        },
        _cutTouchMove: function (t) {
            var a = this;
            if (this.data._flag_cut_touch && this.data.MOVE_THROTTLE_FLAG) {
                if (this.data.disable_ratio && (this.data.disable_width || this.data.disable_height)) return;
                this.data.MOVE_THROTTLE_FLAG = false, this._move_throttle();
                var i = this.data.width, h = this.data.height, e = this.data.cut_top, s = this.data.cut_left, d = function () {
                    i = i <= a.data.max_width ? i >= a.data.min_width ? i : a.data.min_width : a.data.max_width,
                        h = h <= a.data.max_height ? h >= a.data.min_height ? h : a.data.min_height : a.data.max_height;
                }, _ = function () {
                    return (i > a.data.max_width || i < a.data.min_width || h > a.data.max_height || h < a.data.min_height) && a.data.disable_ratio ? (d(),
                        false) : (d(), true);
                };
                switch (h = this.data.CUT_START.height + (this.data.CUT_START.corner > 1 && this.data.CUT_START.corner < 4 ? 1 : -1) * (this.data.CUT_START.y - t.touches[0].clientY),
                this.data.CUT_START.corner) {
                    case 1:
                        if (i = this.data.CUT_START.width + this.data.CUT_START.x - t.touches[0].clientX,
                            this.data.disable_ratio && (h = i / (this.data.width / this.data.height)), !_()) return;
                        s = this.data.CUT_START.cut_left - (i - this.data.CUT_START.width);
                        break;
                    case 2:
                        if (i = this.data.CUT_START.width + this.data.CUT_START.x - t.touches[0].clientX,
                            this.data.disable_ratio && (h = i / (this.data.width / this.data.height)), !_()) return;
                        e = this.data.CUT_START.cut_top - (h - this.data.CUT_START.height), s = this.data.CUT_START.cut_left - (i - this.data.CUT_START.width);
                        break;
                    case 3:
                        if (i = this.data.CUT_START.width - this.data.CUT_START.x + t.touches[0].clientX,
                            this.data.disable_ratio && (h = i / (this.data.width / this.data.height)), !_()) return;
                        e = this.data.CUT_START.cut_top - (h - this.data.CUT_START.height);
                        break;
                    case 4:
                        if (i = this.data.CUT_START.width - this.data.CUT_START.x + t.touches[0].clientX,
                            this.data.disable_ratio && (h = i / (this.data.width / this.data.height)), !_()) return;
                }
                this.data.disable_width || this.data.disable_height ? this.data.disable_width ? this.data.disable_height || this.setData({
                    height: h,
                    cut_top: e
                }) : this.setData({
                    width: i,
                    cut_left: s
                }) : this.setData({
                    width: i,
                    cut_left: s,
                    height: h,
                    cut_top: e
                }), this._imgMarginDetectionScale();
            }
        },
        _cutTouchStart: function (t) {
            this.setData({
                showTips: false
            });
            var a = t.touches[0].clientX, i = t.touches[0].clientY, h = this.data.cut_top + this.data.height - 30, e = this.data.cut_top + this.data.height + 20, s = this.data.cut_left + this.data.width - 30, d = this.data.cut_left + this.data.width + 30, _ = this.data.cut_top - 30, n = this.data.cut_top + 30, o = this.data.cut_left + this.data.width - 30, c = this.data.cut_left + this.data.width + 30, u = this.data.cut_top - 30, l = this.data.cut_top + 30, g = this.data.cut_left - 30, m = this.data.cut_left + 30, r = this.data.cut_top + this.data.height - 30, f = this.data.cut_top + this.data.height + 30, w = this.data.cut_left - 30, T = this.data.cut_left + 30;
            a > s && a < d && i > h && i < e ? (this._moveDuring(), this.data._flag_cut_touch = true,
                this.data._flag_img_endtouch = true, this.data.CUT_START = {
                    width: this.data.width,
                    height: this.data.height,
                    x: a,
                    y: i,
                    corner: 4
                }) : a > o && a < c && i > _ && i < n ? (this._moveDuring(), this.data._flag_cut_touch = true,
                    this.data._flag_img_endtouch = true, this.data.CUT_START = {
                        width: this.data.width,
                        height: this.data.height,
                        x: a,
                        y: i,
                        cut_top: this.data.cut_top,
                        cut_left: this.data.cut_left,
                        corner: 3
                    }) : a > g && a < m && i > u && i < l ? (this._moveDuring(), this.data._flag_cut_touch = true,
                        this.data._flag_img_endtouch = true, this.data.CUT_START = {
                            width: this.data.width,
                            height: this.data.height,
                            cut_top: this.data.cut_top,
                            cut_left: this.data.cut_left,
                            x: a,
                            y: i,
                            corner: 2
                        }) : a > w && a < T && i > r && i < f && (this._moveDuring(), this.data._flag_cut_touch = true,
                            this.data._flag_img_endtouch = true, this.data.CUT_START = {
                                width: this.data.width,
                                height: this.data.height,
                                cut_top: this.data.cut_top,
                                cut_left: this.data.cut_left,
                                x: a,
                                y: i,
                                corner: 1
                            });
        },
        _cutTouchEnd: function (t) {
            this._moveStop(), this.data._flag_cut_touch = false;
        },
        _moveStop: function () {
            var t = this;
            clearTimeout(this.data.TIME_CUT_CENTER), this.data.TIME_CUT_CENTER = setTimeout(function () {
                t.data._cut_animation || t.setData({
                    _cut_animation: true
                }), t.setCutCenter();
            }, 1e3), clearTimeout(this.data.TIME_BG), this.data.TIME_BG = setTimeout(function () {
                t.data._flag_bright && t.setData({
                    _flag_bright: false
                });
            }, 2e3);
        },
        _moveDuring: function () {
            clearTimeout(this.data.TIME_CUT_CENTER), clearTimeout(this.data.TIME_BG), this.data._flag_bright || this.setData({
                _flag_bright: true
            });
        },
        _watcher: function () {
            var t = this;
            Object.keys(this.data).forEach(function (a) {
                t._observe(t.data, a, t.data.watch[a]);
            });
        },
        _observe: function (t, a, i) {
            var h = this, e = t[a];
            Object.defineProperty(t, a, {
                configurable: true,
                enumerable: true,
                set: function (t) {
                    e = t, i && i(e, h);
                },
                get: function () {
                    if (e && -1 != "_img_top|img_left||width|height|min_width|max_width|min_height|max_height|export_scale|cut_top|cut_left|canvas_top|canvas_left|img_width|img_height|scale|angle|min_scale|max_scale".indexOf(a)) {
                        var t = parseFloat(parseFloat(e).toFixed(3));
                        return "string" == typeof e && -1 != e.indexOf("%") && (t += "%"), t;
                    }
                    return e;
                }
            });
        },
        _preventTouchMove: function () { }
    }
});