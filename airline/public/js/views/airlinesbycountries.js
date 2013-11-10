window.AirListView = Backbone.View.extend({

    initialize: function () {
        this.render();
    },

    render: function () {
    	var i = 0
        var airs = this.model.models;
    	console.log('passed id ', airs[0].id);
    	var airId = airs[0].id.split("-");
    	console.log('real id ', airId[0]);
        var len = airs.length;
        console.log('Countries length', airs, len, this.options.country);
        var startPos = (this.options.page - 1) * 8;
        var endPos = Math.min(startPos + 8, len);

        $(this.el).html('<ul class="thumbnails"></ul>');

        for (i = startPos; i < endPos; i++) {
            $('.thumbnails', this.el).append(new AirlinesByCountriesListItemView({model: airs[i], country : this.options.country}).render().el);
        }

        $(this.el).append(new CityPaginator({model: this.model, id : airId[0], country: this.options.country, page: this.options.page}).render().el);

        return this;
    }
});

window.AirlinesByCountriesListItemView = Backbone.View.extend({

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
