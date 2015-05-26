var StudentView = Backbone.View.extend({
    el: '#content', 
    render: function(options){
        var that = this; 
        that.student = new Student({"id": options.username});
        that.student.fetch({
            success: function(student){
                //console.log(student);
                that.student = student.attributes.student; 
                var template = _.template($('#student-profile').html())({ student: that.student});
                that.$el.html(template); 
                that.loadReviews();
            }
        }); 
    }, 
    loadReviews: function(){
        var reviews = document.getElementById("reviews"); 
        console.log(reviews);
        var student_review_path = "/students/" + this.student.username + "/reviews"; 
        console.log(student_review_path);
        $.ajax({
            url: student_review_path, 
            type: 'GET', 
            success: function(body){ 
                console.log(body); 
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
                    /* 
                    <div class="panel panel-default">
                        <div class="panel-heading">
                            <h3 class="panel-title"> title </h3>
                        </div>
                        <div class="panel-body">
                            content
                        </div>
                        <div class="panel-footer">
                            <p class="footer-string">By: <a href="username">username</a> on #date# </p>
                        </div>
                    </div>
                    */ 
                    
                    //for each review, create a panel and appendChild it to reviews
                    for(index in body.reviews){
                        var review = body.reviews[index]; 

                        var landlord_path = "/landlords/" + review.landlordId; 

                        //create panel and interior elements
                        var panel = document.createElement("DIV");
                        var panel_heading = document.createElement("DIV");
                        var panel_title = document.createElement("H3"); 
                        var panel_body = document.createElement("DIV"); 
                        var panel_footer = document.createElement("DIV"); 
                        var panel_footer_p = document.createElement("P");
                        var panel_footer_userlink = document.createElement("A");

                        var panel_title_text = document.createTextNode(review.title);
                        var panel_body_text = document.createTextNode(review.content);
                        var panel_footer_pre_text = document.createTextNode("For: ");
                        var panel_footer_username_text = document.createTextNode(review.landlordId); 
                        var panel_footer_post_text = document.createTextNode(" on " + new Date(review.date).toDateString());

                        //add attributes
                        panel.setAttribute("class", "panel panel-default col-lg-8 col-lg-offset-2 text-left"); 
                        panel_heading.setAttribute("class", "panel-heading"); 
                        panel_title.setAttribute("class", "panel-title"); 
                        panel_body.setAttribute("class", "panel-body"); 
                        panel_footer.setAttribute("class", "panel-footer text-center"); 
                        panel_footer_p.setAttribute("class", "footer_string"); 
                        panel_footer_userlink.setAttribute("href", landlord_path); 

                        //add text nodes
                        panel_title.appendChild(panel_title_text);
                        panel_body.appendChild(panel_body_text);
                        panel_footer_p.appendChild(panel_footer_pre_text); 
                        panel_footer_userlink.appendChild(panel_footer_username_text);
                        panel_footer_p.appendChild(panel_footer_userlink);
                        panel_footer_p.appendChild(panel_footer_post_text);

                        //scale in children 
                        panel_heading.appendChild(panel_title); 
                        panel_footer.appendChild(panel_footer_p);
                        panel.appendChild(panel_heading);
                        panel.appendChild(panel_body); 
                        panel.appendChild(panel_footer);

                        reviews.appendChild(panel);
                    }
                }
            }
        });
    }
});

var studentView = new StudentView(); 