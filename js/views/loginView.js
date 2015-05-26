var LoginView = Backbone.View.extend({
    el: "#content", 
    render: function(){
    	console.log("log in page rendering");
        var template = _.template($("#log-in-page").html()); 
        this.$el.html(template);
    }, 
    events: {
        'click #login-button': 'logIn'
    }, 
    logIn: function(event){
        console.log("logging in...");
        //grab form inputs
        var user = {}; 
        user.username = document.getElementById("username").value; 
        user.password = document.getElementById("password").value; 

        //validate data
        if(user.username.length == 0 || user.password.length == 0) alert("Invalid username"); 

        //create path
        var type = document.getElementById("type").value; 

        var path = "/" + type + "s/login";

        //send login request
        $.ajax({
            'url': path, 
            'type': 'POST', 
            'dataType': 'json', 
            'data': user,
            success: function(body){
                //should be success
                router.navigate("/search", {trigger: true});
            }
        });
    }
});

var loginView = new LoginView(); 