var SearchView = Backbone.View.extend({
    el: '#content', 
    render: function(){
        var template = _.template($("#search-template").html());
        this.$el.html(template);
    }
});

var searchView = new SearchView();