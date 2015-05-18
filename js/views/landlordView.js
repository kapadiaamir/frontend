var LandlordView = Backbone.Model.extend({
    el: "#content", 
    render: function(options){
        this.$el.html("user goes here! " + options.username);
    }
});

var landlordView = new LandlordView(); 