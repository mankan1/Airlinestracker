window.AirlinesListView = Backbone.View.extend({

    initialize: function () {
        this.render();
    },

    render: function () {
        var airlines = this.model.models;
        var len = airlines.length;
        
        console.log( 'airlines : ', airlines , 'len : ', len);
        console.log( 'cityname : ', airlines[0]);
        
        var startPos = (this.options.page - 1) * 8;
        var endPos = Math.min(startPos + 8, len);

        $(this.el).html('<ul class="thumbnails"></ul>');

        for (var i = startPos; i < endPos; i++) {
            $('.thumbnails', this.el).append(new AirlinesListItemView({model: airlines[i],country: this.options.country}).render().el);
        }

        $(this.el).append(new Paginator({model: this.model, country: this.options.country, page: this.options.page}).render().el);

        return this;
    }
});

window.AirlinesListItemView = Backbone.View.extend({

    tagName: "li",

    initialize: function () {
        this.model.bind("change", this.render, this);
        this.model.bind("destroy", this.close, this);
    },

    render: function () {
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    }

});
