/**
 * Created by binhtd on 26/08/2016.
 */

var casper = require("casper").create({
    waitTimeout: 10000,
    stepTimeout:10000,
    pageSettings: {
        loadImages: false,//The script is much faster when this field is set to false
        loadPlugins: false,
        userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:23.0) Gecko/20130404 Firefox/23.0"
    }
});

var url = 'https://compare.switchon.vic.gov.au';
var currentPage = 1;
var jobs = [];

var terminate = function() {
    this.echo("Exiting..").exit();
};


var processPage = function() {
    jobs = this.evaluate(getJobs);
    require('utils').dump(jobs);

    if (currentPage >= 3 || !this.exists("table#jobs")) {
        return terminate.call(casper);
    }
};

casper.start(url);
casper.then(function(){
    this.mouse.click("label[for='gas']");
    this.mouse.click("label[for='home']");
    this.mouse.click("label[for='home-shift']");
    this.sendKeys("input[name='postcode']", casper.page.event.key.Enter , {keepFocus: true});
    this.sendKeys("input[name='postcode']", "3011");
    this.click("#postcode-btn");
});


casper.wait(10000, function() {
    this.click("label[for='energy-concession-no']");
    this.click("#disclaimer_chkbox");
    this.click("#btn-proceed");
});

casper.wait(10000, function() {
    this.mouse.click("#select2-number_person-container");
    this.mouse.click("#select2-number_person-results");


    this.mouse.click("#select2-number_room-container");
    this.mouse.click("#select2-number_room-results");

    this.mouse.click("#spaceheat-appl-group input[value='none']");
    this.mouse.click("#cloth-dryer-group label[for='dryer-no']");

    this.mouse.click("#water-heating-group input[value='other']");

    this.click(".profile-btn");
});

casper.wait(10000, function() {
    casper.capture("vic.png");
});

casper.run();
