$.ajaxPrefilter(function(options, originalOptions, jqXHR){
    options.url = "http://localhost/api" + options.url; 
});

$.fn.serializeObject = function() {
      var o = {};
      var a = this.serializeArray();
      $.each(a, function() {
          if (o[this.name] !== undefined) {
              if (!o[this.name].push) {
                  o[this.name] = [o[this.name]];
              }
              o[this.name].push(this.value || '');
          } else {
              o[this.name] = this.value || '';
          }
      });
      return o;
};

var Router = Backbone.Router.extend({
    routes: {
        '' : 'home',
        'landlords' : 'landlords',
        'students': 'students',
        'landlords/:username': 'landlord',
        'students/:username': 'student',
        'signup': 'signup',
        'login': 'login'
    }
});

var router = new Router(); 