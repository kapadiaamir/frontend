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

        $.ajax({
            url: '/currentUser', 
            type: 'GET', 
            success: function(body){
                if(body.status){
                    that.user = body.user;
                    document.getElementById("logout").style.display = "";
                }
                else{ 
                    that.user = false; 
                }
            }
        });
    },
    events: { 
        'click .editbtn-student': 'editReview', 
        'click .deletebtn-student': 'deleteReview',
        'click .cancel-edit-student': 'cancelEdit', 
        'click .submit-edit-student': 'submitEdit', 
    }, 
    loadReviews: function(){
        var reviews = document.getElementById("reviews"); 
        var that = this;
        var student_review_path = "/students/" + this.student.username + "/reviews"; 
        console.log(student_review_path);
        $.ajax({
            url: student_review_path, 
            type: 'GET', 
            success: function(body){ 
                while(reviews.firstChild){
                    reviews.removeChild(reviews.firstChild);
                }

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
                    //for each review, create a panel and appendChild it to reviews
                    for(index in body.reviews){
                        var review = body.reviews[index];

                        var landlord_path = "/landlords/" + review.landlordId; 

                        var isStudent = that.user.type == "student"? true : false; 
                        isStudent = (isStudent && (that.user.username == review.studentId)) ? true : false; 

                        //create panel and interior elements
                        var panel = document.createElement("DIV");
                        var panel_heading = document.createElement("DIV");
                        var panel_title = document.createElement("H3"); 
                        var panel_body = document.createElement("DIV"); 
                        var panel_body_p = document.createElement("P");
                        var panel_footer = document.createElement("DIV"); 
                        var panel_footer_p = document.createElement("P");
                        var panel_footer_userlink = document.createElement("A");
                        var edit_button; 
                        if(isStudent) edit_button = document.createElement("BUTTON"); 
                        var delete_button;
                        if(isStudent) delete_button = document.createElement("BUTTON");

                        var panel_title_text = document.createTextNode(review.title);
                        var panel_body_text = document.createTextNode(review.content);
                        var panel_footer_pre_text = document.createTextNode("For: ");
                        var panel_footer_username_text = document.createTextNode(review.landlordId); 
                        var panel_footer_post_text = document.createTextNode(" on " + new Date(review.date).toDateString());
                        var edit_button_text; 
                        if(isStudent) edit_button_text = document.createTextNode("Edit");
                        var delete_button_text;
                        if(isStudent) delete_button_text = document.createTextNode("Delete");


                        //add attributes
                        panel.setAttribute("class", "panel panel-default col-lg-8 col-lg-offset-2 text-left"); 
                        panel_heading.setAttribute("class", "panel-heading row"); 
                        panel_title.setAttribute("class", "panel-title col-lg-8"); 
                        panel_title.setAttribute("id", "title_" + review._id);
                        panel_body.setAttribute("class", "panel-body"); 
                        panel_body_p.setAttribute("id", "body_" + review._id);
                        panel_footer.setAttribute("class", "panel-footer text-center"); 
                        panel_footer_p.setAttribute("class", "footer_string"); 
                        panel_footer_userlink.setAttribute("href", landlord_path); 
                        if(isStudent) edit_button.setAttribute("class", "btn btn-primary editbtn-student col-lg-1 col-lg-offset-2");
                        if(isStudent) edit_button.setAttribute("id", "edit_" + review._id);
                        if(isStudent) delete_button.setAttribute("class", "btn btn-danger deletebtn-student col-lg-1 ");
                        if(isStudent) delete_button.setAttribute("id", "delete_" + review._id);
                        panel.setAttribute("id", review._id);

                        //add text nodes
                        panel_title.appendChild(panel_title_text);
                        panel_body_p.appendChild(panel_body_text);
                        panel_footer_p.appendChild(panel_footer_pre_text); 
                        panel_footer_userlink.appendChild(panel_footer_username_text);
                        panel_footer_p.appendChild(panel_footer_userlink);
                        panel_footer_p.appendChild(panel_footer_post_text);
                        if(isStudent) edit_button.appendChild(edit_button_text);
                        if(isStudent) delete_button.appendChild(delete_button_text);

                        //scale in children 
                        panel_heading.appendChild(panel_title); 
                        if(isStudent) panel_heading.appendChild(edit_button);
                        if(isStudent) panel_heading.appendChild(delete_button);

                        panel_body.appendChild(panel_body_p);
                        panel_footer.appendChild(panel_footer_p);
                        panel.appendChild(panel_heading);
                        panel.appendChild(panel_body); 
                        panel.appendChild(panel_footer);

                        reviews.appendChild(panel);
                    }
                }
            }
        });
    }, 
    editReview: function(event){
        //get the review Id to edit
        var btn = event.currentTarget; 
        btn.style.display = "none";
        var reviewId = btn.id.split("_")[1];

        console.log("student view pitches.");

        //get the elements to remove and replace with input fields
        var title = document.getElementById("title_" + reviewId); 
        var body  = document.getElementById("body_" + reviewId);

        //get parents
        var titleParent = title.parentNode; 
        var bodyParent = body.parentNode; 

        //grab old text
        var title_old_text = title.innerHTML; 
        var body_old_text = body.innerHTML; 

        //hide the old title and body
        title.style.display = "none";
        body.style.display = "none";

        //create title and body inputs
        var title_input = document.createElement("INPUT"); 
        var body_input = document.createElement("TEXTAREA"); 
        var submit_edit = document.createElement("BUTTON"); 
        var cancel_edit = document.createElement("BUTTON"); 
        var button_row = document.createElement("DIV");
        var input_row = document.createElement("DIV"); 

        //create text nodes for body and button
        var body_input_text = document.createTextNode(body_old_text); 
        var submit_edit_text = document.createTextNode("Submit Edit"); 
        var cancel_edit_text = document.createTextNode("Cancel Edit");

        //set attributes
        title_input.setAttribute("class", "input input-text");
        title_input.setAttribute("id", "edit-title_" + reviewId); 
        title_input.setAttribute("value", title_old_text);
        body_input.setAttribute("id", "edit-body_" + reviewId);
        body_input.setAttribute("class", "review-content col-lg-12");
        body_input.setAttribute("cols", "75");
        body_input.setAttribute("rows", "5");
        button_row.setAttribute("class", "row");
        input_row.setAttribute("class", "row"); 
        submit_edit.setAttribute("id", "submit-edit_" + reviewId);
        cancel_edit.setAttribute("id", "cancel-edit_" + reviewId);
        submit_edit.setAttribute("class", "submit-edit-student btn btn-primary col-lg-2 col-lg-offset-1");
        cancel_edit.setAttribute("class", "cancel-edit-student btn btn-danger col-lg-2 col-lg-offset-7");

        //button texts
        submit_edit.appendChild(submit_edit_text); 
        cancel_edit.appendChild(cancel_edit_text);

        //add children to screen
        titleParent.appendChild(title_input); 
        body_input.appendChild(body_input_text);
        input_row.appendChild(body_input);
        bodyParent.appendChild(input_row);
        button_row.appendChild(cancel_edit);
        button_row.appendChild(submit_edit);
        bodyParent.appendChild(button_row);
    }, 
    deleteReview: function(event){
        //get reviewId
        var reviewId = event.currentTarget.id.split("_")[1];
        var that = this;
        //send delete request
        $.ajax({
            url: "/reviews/" + reviewId,
            type: "DELETE", 
            success: function(body){
                that.loadReviews();
            }
        });
    },
    submitEdit: function(event){

        var that = this;
        //grab the review id
        var reviewId = event.currentTarget.id.split("_")[1];

        //get the updated title and body
        var review = {}; 
        review.title = document.getElementById("edit-title_" + reviewId).value;
        review.content = document.getElementById("edit-body_" + reviewId).value;

        $.ajax({
            url: "/reviews/" + reviewId, 
            type: "PUT", 
            dataType: 'json', 
            data: review,
            success: function(body){
                if(body.status == false){
                    alert("Fuck. An error occured!");
                }
                else{
                    alert("Review Updated Successfully");
                    that.loadReviews();
                }
            }
        });
        
    },  
    cancelEdit: function(event){
        //grab the review id 
        var reviewId = event.currentTarget.id.split("_")[1];
        event.currentTarget.parentNode.removeChild(event.currentTarget);
        document.getElementById("submit-edit_" + reviewId).parentNode.removeChild(document.getElementById("submit-edit_" + reviewId));

        var editTitle = document.getElementById("edit-title_" + reviewId);
        var editBody = document.getElementById("edit-body_" + reviewId);

        editTitle.parentNode.removeChild(editTitle);
        editBody.parentNode.removeChild(editBody);

        document.getElementById("edit_" + reviewId).style.display = "";

        document.getElementById("title_" + reviewId).style.display = ""; 
        document.getElementById("body_" + reviewId).style.display = "";




    }
});

var studentView = new StudentView(); 