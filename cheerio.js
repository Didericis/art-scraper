var https = require('https');
var cheerio = require('cheerio');

var requestOptions = {
    host: 'images.nga.gov',
    path: '/en/search/do_quick_search.html?q=&qw=%22Open%20Access%20Available%22'
};

console.log('Loading site...');
https.request(requestOptions, function(response){
    var str = '';
    
    console.log('Response code: ' + response.statusCode);

    response.on('data', function(chunk){
        str += chunk;
    });

    response.on('error', function(err){
        console.log(err);
    });

    response.on('end', function(){
        console.log(str);
    });
}).on('error', function(err){
    console.log(err);
}).end();

