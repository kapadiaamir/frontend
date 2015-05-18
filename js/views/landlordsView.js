var LandlordList = Backbone.View.extend({
    el: '#content', 
    render: function(){
        var that = this; 
        var landlords = new Landlords(); 
        landlords.fetch({
            success: function(landlords){
                console.log(landlords.models[0].get('landlords'));
                
                var template = _.template($('#landlord-list-template').html())({ landlords: landlords.models[0].get('landlords')});
                that.$el.html(template);
            }
        });
    }
}); 

var landlordList = new LandlordList(); 