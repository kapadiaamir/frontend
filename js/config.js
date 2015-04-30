$.ajaxPrefilter(function(options, originalOptions, jqXHR){
    options.url = "http://localhost/api" + options.url; 
});