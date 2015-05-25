var SearchView = Backbone.View.extend({
    el: '#content', 
    render: function(){
        var that = this; 
        var landlords = new Landlords(); 
        landlords.fetch({
            success: function(landlords){
                var landlordNameList = [];
                landlords = landlords.models[0].get('landlords');
                for(landlord in landlords){
                    landlordNameList.push(landlords[landlord].companyname);
                }
                $("#q").autocomplete({
                    source: landlordNameList
                });
            }
        }); 
        var template = _.template($("#search-template").html());
        this.$el.html(template);
    }, 
    events: {
        'search #q': 'search'
    }, 
    search: function(event){
        alert("search activated!");
        console.log(event.currentTarget);
    }
});

var searchView = new SearchView();