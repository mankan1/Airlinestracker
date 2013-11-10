window.UserLocationView = Backbone.View.extend({

    initialize:function () {
        this.render();
    },

    render:function () {
    	console.log('USerLocation');
    	$(this.el).html(this.template(this.model.toJSON()));
        return this;
    }

});