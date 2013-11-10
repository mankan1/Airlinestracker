window.CountryView = Backbone.View.extend({

    initialize:function () {
    	console.log('CV-init');
        this.render();
    },

    render:function () {
        $(this.el).html(this.template());
        return this;
    }

});