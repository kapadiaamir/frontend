var StudentView = Backbone.View.extend({
    el: '#content', 
    render: function(options){
        var that = this; 
        that.student = new Student({"id": options.username});
        that.student.fetch({
            success: function(student){
                //console.log(student);
                console.log(student.attributes.student);
                var template = _.template($('#student-profile').html())({ student: student.attributes.student });
                that.$el.html(template); 
            }  
        })
    }
});

var studentView = new StudentView(); 