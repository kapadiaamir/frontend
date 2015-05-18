var SignUpView = Backbone.View.extend({
    el: "#content", 
    render: function(){
        var template = _.template($("#sign-up-form").html()); 
        this.$el.html(template);
    }, 
    events: {
        'click #sign-up-button': 'signUp', 
        'change #type': 'typeChange'
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

        if(user.type == "student"){
            user.yearsAtCollege = document.getElementById("yearsAtCollege").value; 
            user.yearsOffCampus = document.getElementById("yearsOffCampus").value; 
            user.currentlyOffCampus = document.getElementById("currentlyOffCampus").value;
        }

        if(user.type == "landlord"){
            user.companyname = document.getElementById("companyname").value; 
            user.yearsInService = document.getElementById("yearsInService").value; 
        }

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
    },
    typeChange: function(event){
        console.log(event.currentTarget.value);
        var type = event.currentTarget.value; 

        if(type == "student"){
            document.getElementById("yearsOffCampus").style.display = "";
            document.getElementById("yearsAtCollege").style.display = "";
            document.getElementById("yearsOffCampus-label").style.display = "";
            document.getElementById("yearsAtCollege-label").style.display = "";
            document.getElementById("currentlyOffCampus-label").style.display = "";
            document.getElementById("currentlyOffCampus").style.display = "";
            document.getElementById("yearsInService").style.display = "none";
            document.getElementById("companyname").style.display = "none";
        }
        else if(type == "landlord"){
            document.getElementById("yearsOffCampus").style.display = "none";
            document.getElementById("yearsAtCollege").style.display = "none";
            document.getElementById("yearsOffCampus-label").style.display = "none";
            document.getElementById("yearsAtCollege-label").style.display = "none";
            document.getElementById("currentlyOffCampus-label").style.display = "none";
            document.getElementById("currentlyOffCampus").style.display = "none";
            document.getElementById("yearsInService").style.display = "";
            document.getElementById("companyname").style.display = "";
        }
        else{
            //do nothing 
            return false; 
        }
    }
})

var signUpView = new SignUpView();  