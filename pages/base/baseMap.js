Page({

    /**
     * 页面的初始数据
     */
    data: {
        centerX: 0.0,
        centerY: 0.0,
        //可能我标识的地点和你所在区域比较远，缩放比例建议5;
        scale: 12,
        markers: [],
        controls: [{
            id: 1,
            iconPath: '/pages/img/myLocation.png',
            position: {
                left: 10,
                top: 10,
                width: 40,
                height: 40
            },
            clickable: true
        }],
        baseMapData: [],
    },

    /**
     * 标示点移动触发
     */
    regionchange(e) {},

    /**
     * 点击标识点触发
     */
    markertap(e) {},

    /**
     * control控件点击时间
     */
    controltap(e) {
        this.moveToLocation()
    },


    /**
     * 获取医院标识
     */
    getHospitalMarkers() {
        let op = this;
        let markers = [];
        for (let item of op.data.baseMapData) {
            let marker = this.createMarker(item);
            markers.push(marker)
        }
        return markers;
    },

    /**
     * 移动到自己位置
     */
    moveToLocation: function () {
        let mpCtx = wx.createMapContext("map");
        mpCtx.moveToLocation();
    },


    /**
     * 还有地图标识，可以在name上面动手
     */
    createMarker(point) {
        let latitude = point.latitude;
        let longitude = point.longitude;
        let marker = {
            iconPath: "/pages/img/location-control.png",
            id: point.id || 0,
            name: point.name || '',
            latitude: latitude,
            longitude: longitude,
            width: 30,
            height: 30,
            callout: {
                content: point.name,
                color: "#ffffff",
                fontSize: 12,
                padding: 5,
                borderRadius: 10,
                bgColor: "#10a7d8",
                display: "ALWAYS"
            }

        };
        return marker;
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function (e) {
        // 使用 wx.createMapContext 获取 map 上下文 
        this.mapCtx = wx.createMapContext('myMap')
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let op = this;
        let baseMapList = JSON.parse(options.baseMapData);
        let baseMapData = [];
        for (let i = 0; i < baseMapList.length; i++) {
            let oneBaseMapData = {};
            oneBaseMapData.id = baseMapList[i].id;
            oneBaseMapData.name = baseMapList[i].name;
            oneBaseMapData.longitude = baseMapList[i].longitude;
            oneBaseMapData.latitude = baseMapList[i].latitude;
            baseMapData.push(oneBaseMapData);
        }
        op.setData({
            baseMapData: baseMapData,
        })
        wx.getLocation({
            type: 'gcj02', //返回可以用于wx.openLocation的经纬度
            success: (res) => {
                let latitude = res.latitude;
                let longitude = res.longitude;
                let marker = op.createMarker(res);
                op.setData({
                    centerX: longitude,
                    centerY: latitude,
                    markers: op.getHospitalMarkers()
                })
            }
        });
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})