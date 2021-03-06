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
        'search': 'search',
        'landlords(/)' : 'landlords',
        'students(/)': 'students',
        'landlords/:username(/)': 'landlord',
        'students/:username(/)': 'student',
        'signup(/)': 'signup',
        'login(/)': 'login'
    }
});

var router = new Router(); 

$.ajaxSetup({
  statusCode: {
    401: function(){
      //redirect to login page
      router.navigate('/login', {trigger: true})
    }, 
    403: function(){
      alert("You are not allowed to do that!");
    }
  }
})

var logout = function(){
  $.ajax({
    url: '/logout', 
    type: 'GET',
    success: function(body){
      window.location.reload();
      alert("Logged out successfully"); 
    }
  })
}