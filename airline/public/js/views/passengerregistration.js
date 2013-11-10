window.PassengerRegistrationView = Backbone.View.extend({

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
        console.log('before save1', this.model.get("dbId"), this.model.get("city"));
        console.log('before save2', this.model);
        console.log('before save3', this.model.dbId ,  this.model.city );
        //app.navigate('useragreement/' + this.model.get("dbid") + '/' + this.model.get("username") + '/' + this.model.get("email")+ '/' + this.model.get("name") + '/' + this.model.get("admin"));
        this.model.save(null, {
            success: function (model) {
                self.render();
                //console.log('passenger - save success', model.id);
                //app.navigate('useragreement/' + this.model.get("dbId") + '/' + this.model.get("city") , true);
                
                // _______This was original_____
                //app.navigate('useragreement/' + model.id , true);
                // _______This was original_____

                if(model.get("userType") === 'a')
                {
                	app.navigate('useragreement/' + model.id , true);
                }
                else
                {
                    app.navigate('showcountries/' + model.id , true);    
                    //app.navigate('showcountries/' + model.id , true);
                	//app.navigate('showcities/' + model.id , true);
                }                
                
                //app.navigate('useragreement/' + this.model.get("dbId") + '/' + this.model.get("city") , true);
                //utils.showAlert('Success!', 'User saved successfully', 'alert-success');
            },
            error: function () {
                console.log('passenger - save failed1');
                //console.log('passenger - save failed1', model.id);
                self.render();
                app.navigate('useragreement');                
                utils.showAlert('Error', 'An error occurred while trying to save this item', 'alert-error');
            }            
        });

    },

});