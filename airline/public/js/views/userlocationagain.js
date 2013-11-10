window.UserLocationAgainView = Backbone.View.extend({

    initialize:function () {
        this.render();
    },

    render:function () {
    	console.log('UserLocationAgain');
    	$(this.el).html(this.template(this.model.toJSON()));
        return this;
    }

});