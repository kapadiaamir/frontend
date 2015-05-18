var StudentView = Backbone.View.extend({
    el: '#content', 
    render: function(options){
        console.log(options)
        this.$el.html("user goes here! " + options.username);
    }
});

var studentView = new StudentView(); 