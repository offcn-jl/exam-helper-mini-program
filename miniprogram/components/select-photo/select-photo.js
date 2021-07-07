Component({
    properties: {
        src: { value: "", type: String },
        bgColor: { value: "", type: String }
    },
    data: {},
    methods: {
        pickPhoto: function () {
            const _this = this;
            wx.chooseImage({
                count: 1,
                sizeType: ["original"],
                sourceType: ["album"],
                success: function (e) {
                    _this.triggerEvent("pickPhoto", e.tempFilePaths[0]);
                }
            });
        }
    }
});