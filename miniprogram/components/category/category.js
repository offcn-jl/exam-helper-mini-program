Component({
    properties: {
        category: { type: Object, value: {} },
        currentCategory: { type: Object, value: {} }
    },
    data: {},
    methods: {
        choose: function () {
            this.triggerEvent("choose", this.data.category);
        }
    }
});