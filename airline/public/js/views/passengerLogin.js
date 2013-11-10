window.PassengerLogin = Backbone.View.extend({

    initialize:function () {
        this.render();
    },

    render:function () {
        $(this.el).html(this.template());
        return this;
    }

});

/*window.PassengerLogin = Backbone.View.extend({

    initialize:function () {
        this.render();
    },

    render:function () {
//        $(this.el).html(this.template(this.model.toJSON()));
        $(this.el).html(this.template());
        return this;        
    }

});*/

