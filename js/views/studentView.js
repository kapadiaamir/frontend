var StudentView = Backbone.View.extend({
    el: '#content', 
    render: function(options){
        var that = this; 
        that.student = new Student({"id": options.username});
        that.student.fetch({
            success: function(student){
                //console.log(student);
                var template = _.template($('#student-profile').html())({ student: student.attributes.student });
                that.$el.html(template); 
                that.loadReviews();
            }
        }); 
    }, 
    loadReviews: function(){
        var reviews = document.getElementById("reviews"); 
        console.log(reviews);
        var student_review_path = "/students/" + this.student.username + "/reviews"; 
        $.ajax({
            url: student_review_path, 
            type: 'GET', 
            success: function(body){ 
                if(body.status == false){ //student hasn't written any reviews
                    var p_message = document.createElement("P"); 
                    var p_message_text = document.createTextNode("This student has not written any reviews yet."); 

                    //add classes
                    p_message.setAttribute("class", "text text-danger"); 
                    
                    //append children             
                    p_message.appendChild(p_message_text); 
                    reviews.appendChild(p_message);
                }
                else { //student has reviews 
                    console.log(body);
                }
            }
        })
    }
});

var studentView = new StudentView(); 