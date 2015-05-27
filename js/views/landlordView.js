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

                that.loadReviews(that.landlord);
            
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
                    }
                });
            }
        });
    }, 
    events: {
        'focus #review-content': 'clear', 
        'click #submit-review': 'sendReview', 
        'click .editbtn': 'editReview'
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
        $.ajax({
            url: reviewPath, 
            type: 'GET',
            success: function(body){

                //load review dom object
                var do_reviews = document.getElementById("reviews");
                
                console.log(body);

                while(do_reviews.firstChild){
                    do_reviews.removeNode(do_reviews.firstChild);
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
                    console.log("have reviews");
                   //for each review, create a panel and appendChild it to reviews
                    for(index in body.reviews){
                        var review = body.reviews[index]; 

                        var student_path = "/students/" + review.studentId; 

                        //create panel and interior elements
                        var panel = document.createElement("DIV");
                        var panel_heading = document.createElement("DIV");
                        var panel_title = document.createElement("H3"); 
                        var panel_body = document.createElement("DIV"); 
                        var panel_footer = document.createElement("DIV"); 
                        var panel_footer_p = document.createElement("P");
                        var panel_footer_userlink = document.createElement("A");
                        var edit_button = document.createElement("BUTTON"); 

                        var panel_title_text = document.createTextNode(review.title);
                        var panel_body_text = document.createTextNode(review.content);
                        var panel_footer_pre_text = document.createTextNode("By: ");
                        var panel_footer_username_text = document.createTextNode(review.studentId); 
                        var panel_footer_post_text = document.createTextNode(" on " + new Date(review.date).toDateString());
                        var edit_button_text = document.createTextNode("Edit");

                        //add attributes
                        panel.setAttribute("class", "panel panel-default col-lg-8 col-lg-offset-2 text-left"); 
                        panel_heading.setAttribute("class", "panel-heading col-lg-12"); 
                        panel_title.setAttribute("class", "panel-title col-lg-10"); 
                        panel_title.setAttribute("id", "title_" + review._id);
                        panel_body.setAttribute("class", "panel-body"); 
                        panel_body.setAttribute("id", "body_" + review._id);
                        panel_footer.setAttribute("class", "panel-footer text-center"); 
                        panel_footer_p.setAttribute("class", "footer_string"); 
                        panel_footer_userlink.setAttribute("href", student_path); 
                        edit_button.setAttribute("class", "btn btn-primary editbtn col-lg-1");
                        edit_button.setAttribute("id", "edit_" + review._id);
                        panel.setAttribute("id", review._id);

                        //add text nodes
                        panel_title.appendChild(panel_title_text);
                        panel_body.appendChild(panel_body_text);
                        panel_footer_p.appendChild(panel_footer_pre_text); 
                        panel_footer_userlink.appendChild(panel_footer_username_text);
                        panel_footer_p.appendChild(panel_footer_userlink);
                        panel_footer_p.appendChild(panel_footer_post_text);
                        edit_button.appendChild(edit_button_text);

                        //scale in children 
                        panel_heading.appendChild(panel_title); 
                        panel_heading.appendChild(edit_button);
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
        var reviewId = btn.id.split("_")[1];

        //get the elements to remove and replace with input fields
        var title = document.getElementById("title_" + reviewId); 
        var body  = document.getElementById("body_" + reviewId);

        title.style.display = "none";
        body.style.display = "none";




    }
});

var landlordView = new LandlordView(); 