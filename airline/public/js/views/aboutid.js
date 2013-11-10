window.AboutIdView = Backbone.View.extend({

    initialize: function () {
        this.render();
    },

    render: function () {
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    },

    events: {
        "click .save"   : "beforeSave",
    },

    beforeSave: function () {
    	var self = this;
    	var check = this.model.validateAll();
        if (check.isValid === false) {
            utils.displayValidationErrors(check.messages);
            return false;
        };
        this.saveUser();
        return false;
    },

    saveUser: function () {
    	var self = this;
        console.log('before save', this.model.get("username"));
        //app.navigate('about/' + this.model.get("dbid") + '/' + this.model.get("username") + '/' + this.model.get("email")+ '/' + this.model.get("name") + '/' + this.model.get("admin"));
        this.model.save(null, {
            success: function (model) {
                self.render();
                app.navigate('useragreement/' + model.id, true);
                utils.showAlert('Success!', 'User saved successfully', 'alert-success');
            },
            error: function () {
                utils.showAlert('Error', 'An error occurred while trying to delete this item', 'alert-error');
            }
        });
    },

});