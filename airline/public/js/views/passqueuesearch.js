window.PassQueueSearch = Backbone.View.extend({

    initialize: function () {
        this.render();
    },

    render: function () {
        var users = this.model.models;
        var len = users.length;
        
        var startPos = (this.options.page - 1) * 8;
        var endPos = Math.min(startPos + 8, len);

        $(this.el).html('<ul class="thumbnails"></ul>');

        console.log( 'users : ', users[0] , 'len : ', len);
                
        for (var i = startPos; i < endPos; i++) {
            $('.thumbnails', this.el).append(new PassQueueSearchItemView({model: users[i]}).render().el);
        }
        
        $(this.el).append(new PassQueuePaginator({model: this.model, page: this.options.page}).render().el);

        return this;
    }
});

window.PassQueueSearchItemView = Backbone.View.extend({

    tagName: "li",

    initialize: function () {
        this.model.bind("change", this.render, this);
        this.model.bind("destroy", this.close, this);
    },

    render: function () {    	
    	console.log('one');
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    }

});
