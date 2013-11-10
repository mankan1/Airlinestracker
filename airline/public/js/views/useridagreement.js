window.UserAgreementView = Backbone.View.extend({

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
        console.log('before save1', this.model.get("city"));
        //app.navigate('about/' + this.model.get("dbid") + '/' + this.model.get("username") + '/' + this.model.get("email")+ '/' + this.model.get("name") + '/' + this.model.get("admin"));
        this.model.save(null, {
            success: function (model) {
                self.render();
                console.log('model', model.get("userType"));
                console.log('airline - save success', model.id);
                
                if(model.get("userType") === 'a')
                {
                	app.navigate('useragreement/' + model.id , true);
                }
                else
                {
                	console.log('showcountries', model.attributes.name, model.attributes.email);
                	app.navigate('showcountries/' + model.id , true);    
                    //app.navigate('showcountries/' + model.id + '/' + model.attributes.name + '/' + model.attributes.email, true);                	
                }
                // _______This was original_____
                //app.navigate('useragreement/' + model.id , true);
                // _______This was original_____
                
                //app.navigate('showcities/' + model.id , true);
                //utils.showAlert('Success!', 'User saved successfully', 'alert-success');
            },
            error: function () {
                self.render();
                console.log('airline - save failed1');
                console.log('airline - save failed2', model.id);
                app.navigate('useragreement/' + model.id, false);            	
                utils.showAlert('Error', 'An error occurred while trying to delete this item', 'alert-error');
            }
        });
    },

});