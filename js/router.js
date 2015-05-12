var Router = Backbone.Router.extend({
    routes: {
        '' : 'home',
        'landlords' : 'landlords',
        'students': 'students',
        'landlords/:username': 'landlord',
        'students/:username': 'student',
        'signup': 'signup'
    }
});

var router = new Router(); 

router.on('route:home', function(){
    console.log("loading homepage"); 
});

router.on('route:landlords', function(){
    landlordList.render();
}); 

router.on('route:landlord', function(username){
    console.log(username);
});

router.on('route:students', function(){
    studentList.render();
});

router.on('route:student', function(username){
    console.log(username);
});

router.on('route:signup', function(){
    signUpView.render();
});

Backbone.history.start({pushState: true}); 