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
        'click .add-comment-student-btn': 'addComment', //add comment
        'click .edit-comment-student': 'editComment',  //edit a comment 
        'click .delete-comment-student': 'deleteComment', //delete a comment 
        'click .submit-editComment-student': 'submitEditComment', //submit a comment edit
        'click .cancel-editComment-student': 'cancelEditComment' //cancel a comment edit
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
                        panel_heading.appendChild(panel_footer_p);
                        panel.appendChild(panel_heading);
                        panel.appendChild(panel_body); 

                       //grab the appropriate comments for the review
                        $.ajax({
                            url: '/comments/' + review._id,
                            type: 'GET',
                            success: function(body){
                                if(!body.status){ //there are no comments
                                    var empty = document.createElement("P"); 
                                    var emptyText = document.createTextNode("There are no comments for this review");

                                    empty.setAttribute("class", "text text-center text-danger"); 

                                    empty.appendChild(emptyText);

                                    panel_body.appendChild(empty);
                                }
                                else { //there are comments
                                    for(index in body.comments){
                                        var comment = body.comments[index];

                                        //grab reviewId
                                        var reviewId = review._id; 

                                        //check if valid edit user
                                        var isValidUser = (that.user && (that.user.username == comment.authorId)); 

                                        //set up panel
                                        var commentPanel = document.createElement("DIV"); 
                                        commentPanel.setAttribute("id", "commentPanel_" + comment._id); 
                                        commentPanel.setAttribute("class", "panel panel-default"); 

                                        //set up panel body
                                        var commentBody = document.createElement("DIV"); 
                                        var commentBody_p  = document.createElement("P");
                                        var commentBody_p_text = document.createTextNode(comment.content);
                                        commentBody.setAttribute("class", "panel-body");
                                        commentBody_p.setAttribute("id", "comment-p_" + comment._id);
                                        commentBody_p.appendChild(commentBody_p_text); 
                                        commentBody.appendChild(commentBody_p);

                                        //set up footer
                                        commentBody.setAttribute("id", "comment-body_" + comment._id);
                                        var commentFooter = document.createElement("DIV"); 
                                        var commentFooter_p = document.createElement("SPAN"); 
                                        var commentFooter_a = document.createElement("A"); 
                                        var commentFooter_p_preText = document.createTextNode("By: "); 
                                        var commentFooter_p_postText = document.createTextNode(" on " + new Date(comment.date).toDateString());
                                        var commentFooter_a_text = document.createTextNode(comment.authorId); 
                                        var editComment; 
                                        if(isValidUser) editComment = document.createElement("BUTTON"); 
                                        var deleteComment; 
                                        if(isValidUser) deleteComment = document.createElement("BUTTON");
                                        var editButtonText = document.createTextNode("Edit"); 
                                        var deleteButtonText = document.createTextNode("Delete");
                                        
                                        //attributes
                                        commentFooter.setAttribute("class", "panel-footer");
                                        if(isValidUser) commentFooter_p.setAttribute("class", "col-lg-8")
                                        if(isValidUser) editComment.setAttribute("class", "btn btn-primary edit-comment-student  col-lg-offset-1"); 
                                        if(isValidUser) editComment.setAttribute("id", "edit-comment-student_" + comment._id); 
                                        if(isValidUser) deleteComment.setAttribute("class", "btn btn-danger delete-comment-student col-lg-offset-1"); 
                                        if(isValidUser) deleteComment.setAttribute("id", "delete-comment-student_" + comment._id);

                                        //compile footer
                                        commentFooter_a.appendChild(commentFooter_a_text);
                                        commentFooter_p.appendChild(commentFooter_p_preText);
                                        commentFooter_p.appendChild(commentFooter_a);
                                        commentFooter_p.appendChild(commentFooter_p_postText);
                                        commentFooter.appendChild(commentFooter_p);
                                        if(isValidUser) editComment.appendChild(editButtonText);
                                        if(isValidUser) deleteComment.appendChild(deleteButtonText);
                                        if(isValidUser) commentFooter.appendChild(editComment); 
                                        if(isValidUser) commentFooter.appendChild(deleteComment);

                                        //compile panel
                                        commentPanel.appendChild(commentBody);
                                        commentPanel.appendChild(commentFooter);

                                        //add commentPanel to review body   
                                        document.getElementById("body_" + comment.reviewId).appendChild(commentPanel);

                                    }
                                }
                            }
                        });
                        
                        if(that.user){
                            //append on a box for any new comments
                            var newComment = document.createElement("TEXTAREA"); 
                            var addCommentButton = document.createElement("BUTTON"); 
                            var addCommentButtonText = document.createTextNode("Add Comment");
                            var newCommentText = document.createTextNode("Your comment here...");
                            newComment.setAttribute("class", "textbox review-content"); 
                            newComment.setAttribute("data-firstClick", "false");
                            newComment.setAttribute("cols", "75"); 
                            newComment.setAttribute("rows", "5");
                            newComment.setAttribute("id", 'new-comment-content_' + review._id);
                            addCommentButton.setAttribute("class", "btn btn-primary add-comment-student-btn col-lg-offset-10");
                            addCommentButton.setAttribute("id", "add-comment-student-btn_" + review._id);
                            newComment.appendChild(newCommentText); 
                            addCommentButton.appendChild(addCommentButtonText);

                            panel_body.appendChild(newComment); 
                            panel_body.appendChild(addCommentButton);

                        }

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
    }, 
    editComment: function(event){
        //replace the comment content with a textarea
        var commentId = event.currentTarget.id.split("_")[1];

        //clear the innerHTML, replace it with a text area and a submit/cancel edit button
        var message = document.getElementById("comment-p_" + commentId); 
        var parent = message.parentNode;
        var oldComment = message.innerHTML; 
        message.style.display = "none";

        //textarea
        var newCommentContent = document.createElement("TEXTAREA"); 
        var oldText = document.createTextNode(oldComment);
        
        //set attributes 
        newCommentContent.setAttribute("class", "review-content textbox"); 
        newCommentContent.setAttribute("cols", "70"); 
        newCommentContent.setAttribute("rows", "5");
        newCommentContent.setAttribute("id", "editedComment_" + commentId); 

        //add the old text to the edit box
        newCommentContent.appendChild(oldText);

        //submit and cancel buttons
        var submitCommentEdit = document.createElement("BUTTON"); 
        var cancelCommentEdit = document.createElement("BUTTON");
        var submitText = document.createTextNode("Submit"); 
        var cancelText = document.createTextNode("Cancel"); 

        //append text
        submitCommentEdit.appendChild(submitText); 
        cancelCommentEdit.appendChild(cancelText);

        //set Attributes
        submitCommentEdit.setAttribute("class", "btn btn-primary submit-editComment-student col-lg-offset-10"); 
        submitCommentEdit.setAttribute("id", "submit-editComment-student_" + commentId);
        cancelCommentEdit.setAttribute("class", "btn btn-danger cancel-editComment-student "); 
        cancelCommentEdit.setAttribute("id", "cancel-editComment-student_" + commentId);

        //append to the body
        parent.appendChild(newCommentContent);
        parent.appendChild(submitCommentEdit);
        parent.appendChild(cancelCommentEdit);
    },
    deleteComment: function(event){

        var that  = this;
        //get the comment ID
        var commentId = event.currentTarget.id.split("_")[1];

        //send a request to delete the comment
        $.ajax({
            url: '/comments/' + commentId, 
            type: 'DELETE', 
            success: function(body){
                if(body.status){
                    alert("Your comment has been succcessfully deleted"); 
                    that.loadReviews();
                }
            }
        })
    }, 
    addComment: function(event){
        var that = this; 

        //grab the review id
        var reviewId = event.currentTarget.id.split("_")[1];

        //grab the content
        var comment = {}; 
        comment.content = document.getElementById("new-comment-content_" + reviewId).value;

        //send the ajax request
        $.ajax({
            url: '/comments/' + reviewId, 
            type: "POST", 
            dataType: "json", 
            data: comment, 
            success: function(body){
                if(body.status){
                    alert("The comment has been added successfully. ");
                    that.loadReviews(that.landlord); 
                }
            }
        });
    },
    submitEditComment: function(event){
        var that = this; 
        //get the comment id 
        var commentId = event.currentTarget.id.split("_")[1];

        //get the new content
        var comment = {}; 
        comment.content = document.getElementById("editedComment_" + commentId).value;

        $.ajax({
            url: "/comments/" + commentId, 
            type: "PUT",
            dataType: "json", 
            data: comment, 
            success: function(body){
                if(body.status){
                    alert("Comment updated successfully");
                    that.loadReviews();
                }
            }
        });
    }, 
    cancelEditComment: function(event){
        var commentId = event.currentTarget.id.split("_")[1];

        //remove the text box 
        var daddy = document.getElementById("editedComment_" + commentId).parentNode;
        daddy.removeChild(document.getElementById("editedComment_" + commentId));
        daddy.removeChild(document.getElementById("submit-editComment-student_" + commentId)); 
        daddy.removeChild(document.getElementById("cancel-editComment-student_" + commentId));

        //reshow the old one 
        document.getElementById("comment-p_" + commentId).style.display = "";

    }
});

var studentView = new StudentView(); 