var webdriver = require('selenium-webdriver');

var driver = new webdriver.Builder().

withCapabilities(webdriver.Capabilities.chrome()).build();

driver.get('https://images.nga.gov/en/search/do_quick_search.html?q=&qw=%22Open%20Access%20Available%22');
driver.findElements(webdriver.By.css('.damDownloadLink > .downloadIcon')).then(function(btns){
    btns.forEach(function(btn, i){
        if (i==0) {
            btn.click().then(function(){
                console.log('Done clicking button');
            });
        }
    });
});

driver.quit();
