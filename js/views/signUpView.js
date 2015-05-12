var SignUpView = Backbone.View.extend({
    el: "#content", 
    render: function(){
        var template = _.template($("#sign-up-form").html()); 
        this.$el.html(template);
    }, 
    events: {
        'submit .sign-up-form': 'signUp'
    }, 
    signUp: function(event){
        var userData = $(event.currentTarget).serializeObject(); 
        var user = userData.type == "student" ? new Student() : new Landlord(); 
        var path = userData.type += "s/";

        user.save(userData, {
            success: function(user){
                console.log(user);
                path += user.username;
                router.navigate(path, {trigger: true});
            }
        });

        return false; 
    }
})

var signUpView = new SignUpView();  