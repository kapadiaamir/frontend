var LandlordView = Backbone.View.extend({
    el: '#content', 
    render: function(options){
        var that = this; 
        that.landlord = new Landlord({"id": options.username});
        that.landlord.fetch({
            success: function(landlord){
                that.landlord = landlord.attributes.landlord;

                //console.log(that.landlord);
                that.firstClick = false; 
 
                var template = _.template($("#landlord-profile").html())({'landlord': that.landlord});
                that.$el.html(template);
            
                $.ajax({
                    url: '/currentUser', 
                    type: "GET", 
                    success: function(body){

                        //console.log(body);
                        var createReview = document.getElementById("create-review");
                        if(body.status == false){

                            that.user = false; 
                            //create log in message
                            var p_message = document.createElement("P"); 
                            p_message.setAttribute("class", "text text-danger size-1-5");

                            var log_in_link = document.createElement("A"); 
                            var log_in_link_text = document.createTextNode("Log in"); 
                            log_in_link.setAttribute("href", "/login");
                            log_in_link.appendChild(log_in_link_text);

                            //add to p
                            p_message_text = document.createTextNode(" to write a review");    
                            p_message.appendChild(log_in_link);
                            p_message.appendChild(p_message_text);

                            //add to div
                            createReview.appendChild(p_message);
                        }

                        if(body.status == true){
                            that.user = body.user; 

                            //enable a log out button
                            document.getElementById("logout").style.display = "";  

                            if(that.user.type == "landlord"){ //logged in user is a landlord
                                //write error message
                                var p_message = document.createElement("P"); 
                                p_message.setAttribute("class", "text text-danger size-1-5"); 
                                var p_message_text = document.createTextNode("Only student accounts can write reviews.");

                                //append text
                                p_message.appendChild(p_message_text);
                                createReview.appendChild(p_message);
                            }
                            else if(that.user.type == "student"){
                                //create header
                                var header_row = document.createElement("DIV"); 
                                var header_size_div = document.createElement("DIV"); 
                                var header = document.createElement("H2"); 
                                var header_text = document.createTextNode("Write a Review:");

                                //add classes
                                header_row.setAttribute("class", "row");
                                header_size_div.setAttribute("class", "col-lg-12");
                                header.setAttribute("class", "scarlet");

                                //complile header
                                header.appendChild(header_text);
                                header_size_div.appendChild(header);
                                header_row.appendChild(header_size_div);

                                //create review form
                                var review_row = document.createElement("DIV");
                                var review_title = document.createElement("INPUT");
                                var review_content = document.createElement("TEXTAREA");
                                var review_content_text = document.createTextNode("Your Review Goes Here...");
                                var review_button = document.createElement("BUTTON"); 
                                var button_row = document.createElement("DIV"); 
                                var review_button_text = document.createTextNode("Submit Review");

                                //add classes
                                review_row.setAttribute("class", "row"); 
                                review_title.setAttribute("class", "input input-text");
                                review_content.setAttribute("class", "review-content");
                                review_button.setAttribute("class", "btn btn-primary size-1-5");
                                button_row.setAttribute("class", "row"); 

                                //set various attributes for title and content
                                review_title.setAttribute("type", "text");
                                review_title.setAttribute("id", "title");
                                review_title.setAttribute("placeholder", "Review Title");
                                review_content.setAttribute("type", "text");
                                review_content.setAttribute("id", "review-content");
                                review_content.setAttribute("cols", "50");
                                review_content.setAttribute("rows", "5"); 
                                review_button.setAttribute("id", "submit-review");

                                //complile review form
                                review_content.appendChild(review_content_text);
                                review_button.appendChild(review_button_text);
                                review_row.appendChild(review_title);
                                review_row.appendChild(review_content);
                                button_row.appendChild(review_button);

                                //append children to createReview
                                createReview.appendChild(header_row);
                                createReview.appendChild(review_row);
                                createReview.appendChild(button_row);
                            }
                        }
                        that.loadReviews(that.landlord);
                    }
                });
            }
        });
    }, 
    events: {
        'focus #review-content': 'clear', 
        'click #submit-review': 'sendReview', 
        'click .editbtn': 'editReview', 
        'click .cancel-edit': 'cancelEdit', 
        'click .submit-edit': 'submitEdit'
    }, 
    clear: function(event){
        if(!this.firstClick) event.currentTarget.value = "";
        this.firstClick = true;
    }, 
    sendReview: function(event){

        //console.log(document.getElementById("title").value);
        //load data
        var review = {}; 
        review.title = document.getElementById("title").value; 
        //console.log(review.title);
        review.content = document.getElementById("review-content").value; 
        review.landlordId = this.landlord.username; 
        review.studentId = this.user.username; 

        //validate data
        if(review.title.length == 0){
            alert("Must give your review a title.");
        }

        if(review.content.value == 0){
            alert("Must write a review!");
        }

        var submit_review_path = "/reviews";

        console.log(review);

        //ajax request
        
        $.ajax({
            'url': submit_review_path, 
            'type': 'POST', 
            'dataType': 'json', 
            'data': review, 
            'success': function(body){
                if(body.status == false){
                    //error occured
                    alert("There was an error submitting your reivew.");
                }
                else{ //success
                    alert("Review submitted successfully");
                    document.getElementById("title").value = ""; 
                    document.getElementById("review-content").value = "Your Review Goes Here...";
                }
            }   
        });

        //refresh reviews from server
        this.loadReviews(this.landlord);
    },
    loadReviews: function(landlord){
        //load reviews for landlord
        var reviewPath = "/landlords/" + landlord.username + "/reviews";
        var that = this; 
        $.ajax({
            url: reviewPath, 
            type: 'GET',
            success: function(body){

                //load review dom object
                var do_reviews = document.getElementById("reviews");
                
                console.log(body);

                while(do_reviews.firstChild){
                    do_reviews.removeChild(do_reviews.firstChild);
                }
                if(body.status == false){ //no reviews

                    //create message
                    var message = body.message; 
                    var p_message = document.createElement("P");
                    p_message.setAttribute("class", "text text-danger");
                    var p_message_text = document.createTextNode(message);

                    //add to screen
                    p_message.appendChild(p_message_text);
                    do_reviews.appendChild(p_message);
                }
                else{ //landlord has reviews
                   //for each review, create a panel and appendChild it to reviews
                    for(index in body.reviews){
                        var review = body.reviews[index]; 

                        var student_path = "/students/" + review.studentId; 

                        //check if user is the student
                        var isStudent = that.user.type == "student" ? true : false; 
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
                        var panel_footer_pre_text = document.createTextNode("By: ");
                        var panel_footer_username_text = document.createTextNode(review.studentId); 
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
                        panel_footer_userlink.setAttribute("href", student_path); 
                        if(isStudent) edit_button.setAttribute("class", "btn btn-primary editbtn col-lg-1 col-lg-offset-2");
                        if(isStudent) edit_button.setAttribute("id", "edit_" + review._id);
                        if(isStudent) delete_button.setAttribute("class", "btn btn-danger deletebtn col-lg-1"); 
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

                        //add panel to reviews
                        do_reviews.appendChild(panel);
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
        submit_edit.setAttribute("class", "submit-edit btn btn-primary col-lg-2 col-lg-offset-1");
        cancel_edit.setAttribute("class", "cancel-edit btn btn-danger col-lg-2 col-lg-offset-7");

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
                    that.loadReviews(that.landlord);
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

var landlordView = new LandlordView(); 