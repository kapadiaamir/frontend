var LoginView = Backbone.View.extend({
    el: "#content", 
    render: function(){
    	console.log("log in page rendering");
        var template = _.template($("#log-in-page").html()); 
        this.$el.html(template);
    }, 
    events: {
        
    }
});

var loginView = new LoginView(); 