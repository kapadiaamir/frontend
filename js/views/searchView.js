var SearchView = Backbone.View.extend({
    el: '#content', 
    render: function(){
        var that = this; 
        var landlords = new Landlords(); 
        var students  = new Students();
        landlords.fetch({
            success: function(landlords){
                var landlordNameList = [];
                landlords = landlords.models[0].get('landlords');
                that.landlords = landlords; 
                for(landlord in landlords){
                    landlordNameList.push(landlords[landlord].companyname);
                }

                that.landlordNameList = landlordNameList;
                $("#q").autocomplete({
                    source: landlordNameList
                });
            }
        }); 

        students.fetch({
            success: function(students){

                var studentNameList = []; 
                students = students.models[0].get('students'); 

                that.students = students;

                for(student in students){
                    studentNameList.push(students[student].username);
                }

                that.studentNameList = studentNameList; 
            }
        });

        //load template out
        var template = _.template($("#search-template").html());
        this.$el.html(template);
    }, 
    events: {
        'search #q': 'search', 
        'change #search-btn': 'typeChange'
    }, 
    search: function(event){
        //get the type of user we're searching for 
        var type = document.getElementById("search-btn").value + "s"; 

        var users = this[type];
        var criteria = "";

        if(type == "landlords") criteria = "companyname";
        else criteria = "username";

        console.log(type);
        console.log(users);

        for(user in users){
            console.log((users[user])[criteria]);
            if((users[user])[criteria] == event.currentTarget.value){
                var path = "/" + type + "/" + users[user].username; 
                router.navigate(path, {trigger: true});
                return false; 
            }
        }

        //couldn't find user 
        alert("Invalid Company or Username");



    }, 
    typeChange: function(event){
        //need to load new source  
        var type = event.currentTarget.value; 


        if(type == "landlord"){
            $("#q").autocomplete({
                source: this.landlordNameList
            }); 
        }
        else{ //student
            $("#q").autocomplete({
                source: this.studentNameList
            });
        }
    }
});

var searchView = new SearchView();