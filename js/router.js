router.on('route:home', function(){
    console.log("loading homepage"); 
});

router.on('route:landlords', function(){
    landlordList.render();
}); 

router.on('route:landlord', function(username){
    console.log(username);
    landlordView.render();
});

router.on('route:students', function(){
    studentList.render();
});

router.on('route:student', function(username){
    console.log("router: " + username);
    studentView.render({'username': username});
});

router.on('route:signup', function(){
    signUpView.render();
});

Backbone.history.start({pushState: true}); 