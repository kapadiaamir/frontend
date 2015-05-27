var LandlordList = Backbone.View.extend({
    el: '#content', 
    render: function(){
        var that = this; 
        var landlords = new Landlords(); 
        landlords.fetch({
            success: function(landlords){
                var template = _.template($('#landlord-list-template').html())({ landlords: landlords.models[0].get('landlords')});
                that.$el.html(template);

                $.ajax({
                    'url': '/currentUser', 
                    'type': 'GET', 
                    'success': function(body){
                        if(body.status == true){
                            that.user = body.user;
                            document.getElementById("logout").style.display = "";
                        }
                    }
                });
            }
        });
    }
}); 

var landlordList = new LandlordList(); 