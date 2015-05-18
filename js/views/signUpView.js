var SignUpView = Backbone.View.extend({
    el: "#content", 
    render: function(){
        var template = _.template($("#sign-up-form").html()); 
        this.$el.html(template);
    }, 
    events: {
        'click #sign-up-button': 'signUp'
    }, 
    signUp: function(event){
        //load form variables and validate data
        var user = {} 
        user.type = document.getElementById("type").value;
        user.username = document.getElementById("username").value; 
        user.firstname = document.getElementById("firstname").value; 
        user.lastname = document.getElementById("lastname").value; 
        user.email = document.getElementById("email").value; 
        user.password = document.getElementById("password").value;
        user.yearsAtCollege = document.getElementById("yearsAtCollege").value; 
        user.yearsOffCampus = document.getElementById("yearsOffCampus").value; 
        user.currentlyOffCampus = document.getElementById("currentlyOffCampus").value; 



        //create path
        var path = "http://localhost/api/" + user.type + "s/register";
        console.log(path);

        //create ajax request
        var request = new XMLHttpRequest();
        request.open("POST", path, true);
        request.setRequestHeader("Content-type", "application/json");
        request.onreadystatechange = function(){
            var response = JSON.parse(request.responseText);

            if(request.status == 403){
                //error in registration
                alert("bad registration")
                return false; 
            }


            var userRoute = "/students/" + user.username; 

            console.log(userRoute);

            //good sign up -- redirect to profile page.
            router.navigate(userRoute, true);

            //return false; 

        };
        request.send(JSON.stringify(user));
    }
})

var signUpView = new SignUpView();  