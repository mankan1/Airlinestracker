window.PassengerRegister = Backbone.View.extend({

    initialize:function () {
        this.render();
    },

    render:function () {
        $(this.el).html(this.template());
        return this;
    }

});

/*
window.PassengerRegister = Backbone.View.extend({

    initialize:function () {
        this.render();
    },

    render:function () {
        $(this.el).html(this.template(this.model.toJSON()));
        return this;        
    }

});*/