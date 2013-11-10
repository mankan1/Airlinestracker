window.ShowCitiesListView = Backbone.View.extend({

    initialize: function () {
        this.render();
    },

    render: function () {
        var cities = this.model.models;
        var len = cities.length;

        console.log( 'country : ', this.options.country);
        
        var startPos = (this.options.page - 1) * 8;
        var endPos = Math.min(startPos + 8, len);

        $(this.el).html('<ul class="thumbnails"></ul>');

        console.log( 'cities : , id : ', cities , this.options.id, 'len : ', len);
        
        for (var i = startPos; i < endPos; i++) {
            $('.thumbnails', this.el).append(new ShowCitiesListItemView({model: cities[i],  id : this.options.id}).render().el);
        }

        $(this.el).append(new PassCityPaginator({model: this.model, country : this.options.country, id : this.options.id, page: this.options.page}).render().el);

        return this;
    }
});

window.ShowCitiesListItemView = Backbone.View.extend({

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
