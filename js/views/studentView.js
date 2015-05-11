var StudentList = Backbone.View.extend({
    el: '#content', 
    render: function(){
        var that = this; 
        var students = new Students(); 
        students.fetch({
            success: function(students){
                console.log(students.models[0].get('students'));
                
                var template = _.template($('#student-list-template').html())({ students: students.models[0].get('students')});
                that.$el.html(template);
            }
        });
    }
}); 

var studentList = new StudentList(); 