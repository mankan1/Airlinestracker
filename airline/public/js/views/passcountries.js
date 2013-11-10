window.ShowCountriesListView = Backbone.View.extend({

    initialize: function () {
        this.render();
    },

    render: function () {
        var countries = this.model.models;
        var len = countries.length;
        
        var startPos = (this.options.page - 1) * 8;
        var endPos = Math.min(startPos + 8, len);

        $(this.el).html('<ul class="thumbnails"></ul>');

        console.log( 'countries : ', countries , 'id :', this.options.id, 'len : ', len);
        
        for (var i = startPos; i < endPos; i++) {
            $('.thumbnails', this.el).append(new ShowCountriesListItemView({model: countries[i],  id : this.options.id}).render().el);
        }

        $(this.el).append(new PassCountryPaginator({model: this.model, id : this.options.id, page: this.options.page}).render().el);

        return this;
    }
});

window.ShowCountriesListItemView = Backbone.View.extend({

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
