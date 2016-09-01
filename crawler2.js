/**
 * Created by binhtd on 26/08/2016.
 */

var x = require('casper').selectXPath,
    fs = require('fs'),
    utils = require('utils'),
    url = 'https://compare.switchon.vic.gov.au',
    offerList = [],
    gasHomePostcodeList = [3011, 3953, 3179, 3141, 3199],
    electricHomePostcodeList = [3000, 3011, 3944, 3284, 3841],
    current = 0,
    end = 0;

var casper = require("casper").create({
    verbose: true,
    logLevel: "debug",
    waitTimeout: 2000000,
    stepTimeout: 2000000,
    pageSettings: {
        loadImages: false,
        loadPlugins: false,
        userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:23.0) Gecko/20130404 Firefox/23.0"
    }
});

casper.renderJSON = function(what) {
    return this.echo(JSON.stringify(what, null, '  '));
};

casper.saveJSON = function(what) {
    fs.write('json/parse_result.json', JSON.stringify(what, null, '  '), 'w');
};

casper.start(url);

//--------------------------------------------------------------------------------------------------------
//start parse for home gas
//end = gasHomePostcodeList.length;
//for (;current < end;) {
//    (function(cntr) {
//        casper.then(function() {
//            this.mouse.click("label[for='gas']");
//            this.mouse.click("label[for='home']");
//            this.mouse.click("label[for='home-shift']");
//            this.sendKeys("input[name='postcode']", casper.page.event.key.Enter , {keepFocus: true});
//            this.sendKeys("input[name='postcode']", gasHomePostcodeList[cntr] + "");
//            this.click("#postcode-btn");
//            this.capture("png" + gasHomePostcodeList[cntr] + ".png");
//
//            this.wait(5000, function() {
//                this.click("label[for='energy-concession-no']");
//                this.click("#disclaimer_chkbox");
//                this.click("#btn-proceed");
//            });
//
//            this.wait(5000, function() {
//                this.mouse.click("#select2-number_person-container");
//                this.mouse.click("#select2-number_person-results li:first-child");
//
//                this.mouse.click("#select2-number_room-container");
//                this.mouse.click("#select2-number_room-results li:first-child");
//
//                this.mouse.click("#spaceheat-appl-group input[value='none']");
//                this.mouse.click("#cloth-dryer-group label[for='dryer-no']");
//
//                this.mouse.click("#water-heating-group input[value='other']");
//
//                this.click(".profile-btn");
//            });
//
//            this.wait(5000, function() {
//                this.thenOpen("https://compare.switchon.vic.gov.au/service/offers", {
//                    method: 'get',
//                    headers: {
//                        'Content-Type': 'application/json',
//                        'Accept': 'application/json'
//                    }
//                });
//            });
//
//            this.wait(5000, function(){
//                var data = this.getPageContent().replace(/<\/?[^>]+(>|$)/g, ""),
//                    json = JSON.parse(data),
//                    offers = json["offersList"];
//
//                this.each(offers, function(self, offer){
//                    offerList.push(offer);
//                });
//
//                casper.thenOpen(url, function(){
//                });
//            });
//        });
//    })(current);
//    current++;
//}
//end parse for home gas
//--------------------------------------------------------------------------------------------------------


//--------------------------------------------------------------------------------------------------------
//start electricity home
//end = electricHomePostcodeList.length;
//for (;current < end;) {
//    (function(cntr) {
//        casper.then(function() {
//            this.mouse.click("label[for='electricity']");
//            this.mouse.click("label[for='home']");
//            this.mouse.click("label[for='home-here']");
//
//            this.mouse.click("#select2-retailer-container");
//            this.mouse.click("#select2-retailer-results li:nth-child(2)");
//
//
//            this.sendKeys("input[name='postcode']", casper.page.event.key.Enter , {keepFocus: true});
//            this.sendKeys("input[name='postcode']", electricHomePostcodeList[cntr] + "");
//            this.click("#postcode-btn");
//
//            this.wait(5000, function() {
//                this.click("label[for='energy-concession-no']");
//                this.click("label[for='upload-yes']");
//            });
//
//            this.wait(5000, function(){
//                this.evaluate(function(){
//                    $("select#file-provider").select2("val", "agl");
//                    $("#uploadFile").val("MyUsageData_06-05-2016.csv");
//                    //$("#terms").show();
//                });
//            });
//
//            this.wait(5000, function(){
//                this.page.uploadFile("#data-file-secondary input[name=fileupload]", "./MyUsageData_06-05-2016.csv");
//                this.evaluate(function(){
//                    $("#data-file-secondary input[name=fileupload]").trigger("fileuploadadd");
//                });
//            })
//
//            this.wait(100000,function(){
//                this.click("#disclaimer_chkbox");
//                this.click("#btn-proceed");
//            });
//
//            this.wait(100000, function(){
//                this.capture("png" + electricHomePostcodeList[cntr] + ".png");
//            });
//
//            this.wait(10000, function() {
//                this.thenOpen("https://compare.switchon.vic.gov.au/service/offers", {
//                    method: 'get',
//                    headers: {
//                        'Content-Type': 'application/json',
//                        'Accept': 'application/json'
//                    }
//                });
//            });
//
//            this.wait(10000, function(){
//                var data = this.getPageContent().replace(/<\/?[^>]+(>|$)/g, ""),
//                    json = JSON.parse(data),
//                    offers = json["offersList"];
//
//                this.each(offers, function(self, offer){
//                    offerList.push(offer);
//                });
//
//                casper.thenOpen(url, function(){
//                });
//            });
//        });
//    })(current);
//    current++;
//}
//end electricity home
//--------------------------------------------------------------------------------------------------------


casper.then(function(){
    casper.echo(offerList.length);
})
casper.run();