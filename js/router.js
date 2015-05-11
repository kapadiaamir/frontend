var Router = Backbone.Router.extend({
    routes: {
        '' : 'home',
        'landlords' : 'landlords',
        'students': 'students'
    }
});

var router = new Router(); 

router.on('route:home', function(){
    console.log("loading homepage"); 
});

router.on('route:landlords', function(){
    landlordList.render();
}); 

router.on('route:students', function(){
    studentList.render();;
});

Backbone.history.start({pushState: true}); 