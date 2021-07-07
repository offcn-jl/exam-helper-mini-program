Component({
    properties: {
        config: { value: null, type: Object }
    },
    data: {},
    methods: {
        choose: function () {
            this.triggerEvent("chooseConfig", this.properties.config);
        }
    }
});