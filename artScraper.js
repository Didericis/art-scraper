var webdriver = require('selenium-webdriver');
var fs = require('fs');
var path = require('path');
var statusBar = require('status-bar');
var until = webdriver.until;

var artInfo = {};
var driver = new webdriver.Builder().withCapabilities(webdriver.Capabilities.chrome()).build();
var startingNum = 18392;
var numDownloaded = 0;
var numParsed = 0;
var numToDownload = 20;
var downloadPath = '/Users/eric/Downloads/';
var saveName = 'artfunkelImport.json';
var savePath = path.join(downloadPath, saveName);
var promiseChain;
var bar = createStatusBar();

function main(){
    for (var artID=startingNum; artID<(startingNum+numToDownload); artID++) {
        if (!promiseChain) {
            promiseChain = getArtPromise(artID);
        } else {
            promiseChain = promiseChain.then(getArtCallback(artID));
        }
    }
    promiseChain.then(function(){
        save();
        bar.cancel();
        console.log('Done!');
    });
}

function createStatusBar(){
    return statusBar.create({ 
        total: 1 
    }).on('render', function(){
        var percentage = numParsed / numToDownload;
        process.stdout.write(
            ' Downloaded: ' + numDownloaded + ' [' +
            this.format.progressBar(percentage) + '] ' +
            this.format.percentage(percentage));
        process.stdout.cursorTo(0);
    });    
}

function save(){
    fs.writeFile(savePath, JSON.stringify(artInfo, null, 4));    
}

function getArtCallback(artID){
    var _artID = artID;

    return function(){
        return getArtPromise(_artID);        
    };
}

function getArtPromise(artID){
    var _artID = artID;
    var _artAttributes;
    numParsed += 1;

    return driver.get(getURL(_artID)).then(function(){
        return getAllArtAttributes();
    }).then(function(artAttributes){
        _artAttributes = artAttributes;
        return driver.findElement(webdriver.By.css('.iconDownloadComp'));
    }).then(function(link){
        var watcher = fs.watch(downloadPath, function(event, fileName){
            if (path.extname(fileName) === '.jpg') {
                _artAttributes.fileName = fileName;
                artInfo[_artID] = _artAttributes;
                numDownloaded += 1;
                if ((numDownloaded % 10) == 0) {
                    save();
                }
                watcher.close();
            }
        });
        return link.click();
    }).thenCatch(function(error){
        //Do nothing
    });    
}

function getURL(num){
    return 'https://images.nga.gov/?service=asset&action=show_zoom_window_popup&language=en&asset=' + num + '&location=grid';
}

function getAllArtAttributes(){
    var promiseChain;
    var artAttributes = {};
    var artAttributeLabels = ['Artist', 'Artist Info', 'Title', 'Dated', 'Classification', 'Medium', 'Dimensions', 'Accession No', 'Credit', 'Image Use'];

    artAttributeLabels.forEach(function(label, i){
        if (!promiseChain) {
            promiseChain = getArtAttribute(label);
        } else {
            promiseChain = promiseChain.then(function(result){
                artAttributes[result.label] = result.value;
                return getArtAttribute(label);
            });
        }
    });

    return promiseChain.then(function(result){
        artAttributes[result.label] = result.value;
        return new Promise(function(resolve, reject){
            resolve(artAttributes);
        });
    });
}

function getArtAttribute(attrName){
    return new Promise(function(resolve, reject){
        driver.findElement({xpath: '//dt[contains(text(), "' + attrName + '")]/following-sibling::dd[1]'}).then(function(attrElement){
            return attrElement.getAttribute('textContent');
        }).then(function(value){
            resolve({
                label: attrName, 
                value: value
            });
        });
    });
}