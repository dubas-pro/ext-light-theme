define('dubas-light-theme:views/login', 'views/login', function (Dep) {

    return Dep.extend({

        // specify your custom template
        template: 'dubas-light-theme:login',

        // include the custom values in the standard "data" function which will provide the placeholder values to the template
        // the values for "logoSrc" and "showForgotPassword" are the standard values specified in the core login script
        data: function () {
            return{        
              logoSrc: this.getLogoSrc(),
              showForgotPassword: this.getConfig().get('passwordRecoveryEnabled'),
              applicationName: this.getConfig().get('applicationName')
           };          
        }

    });
});
