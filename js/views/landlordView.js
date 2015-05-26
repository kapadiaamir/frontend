var LandlordView = Backbone.View.extend({
    el: '#content', 
    render: function(options){
        var that = this; 
        that.landlord = new Landlord({"id": options.username});
        that.landlord.fetch({
            success: function(landlord){
                that.landlord = landlord.attributes.landlord;

                that.loadReviews(that.landlord);

                that.firstClick = false; 
 

                var template = _.template($("#landlord-profile").html())({'landlord': landlord});
                that.$el.html(template);
            }
        });

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

                        //add classes
                        review_row.setAttribute("class", "row"); 
                        review_title.setAttribute("class", "input input-text");
                        review_content = setAttribute("class", "review-content");

                        //set various attributes for title and content
                        review_title.setAttribute("type", "text");
                        review_title.setAttribute("id", "title");
                        review_title.setAttribute("placeholder", "Review Title");
                        review_content.setAttribute("type", "text");
                        review_content.setAttribute("id", "content");
                        review_content.setAttribute("cols", "50");
                        review_content.setAttribute("rows", "5"); 

                        //complile review form
                        review_content.appendChild(review_content_text);
                        review_row.appendChild(review_title);
                        review_row.appendChild(review_content);

                        //append children to createReview
                        createReview.appendChild(header_row);
                        createReview.appendChild(review_row);
                    }
                }
            }
        })
    }, 
    events: {
        'focus #content': 'clear', 
        'click #submit-review': 'sendReview'
    }, 
    clear: function(event){
        if(!this.firstClick) event.currentTarget.value = "";
        this.firstClick = true;
    }, 
    sendReview: function(event){

        //load data
        var review = {}; 
        review.title = document.getElementById("title").value; 
        review.content = document.getElementById("content").value; 
        review.landlordId = this.landlord.username; 
        review.studentId = this.user.username; 

        //validate data
        if(review.title.length == 0){
            alert("Must give your review a title.");
        }

        if(review.content.length == 0){
            alert("Must write a review!");
        }

        var submit_review_path = "/reviews";

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
                    console.log(body);
                }
            }
        }); 
    }
});

var landlordView = new LandlordView(); 