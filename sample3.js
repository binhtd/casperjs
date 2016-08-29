/**
 * Created by binhtd on 25/08/2016.
 */
//var casper = require("casper").create();
//
//casper.echo("Casper CLI passed args:");
//require("utils").dump(casper.cli.args);
//
//casper.echo("Casper CLI passed options:");
//require("utils").dump(casper.cli.options);
//
//
//casper.echo(casper.cli.has(0));
//casper.echo(casper.cli.get(0));
//casper.echo(casper.cli.has(3));
//casper.echo(casper.cli.get(3));
//casper.echo(casper.cli.has("foo"));
//casper.echo(casper.cli.get("foo"));
//casper.cli.drop("foo");
//casper.echo(casper.cli.has("foo"));
//casper.echo(casper.cli.get("foo"));
//
//
//casper.start("http://domain.tld/page.html", function(){
//   if (this.exists("h1.page-title")){
//       this.echo("the heading exists");
//   }
//});
//
//casper.run();
//
//casper.exit();
//
//
//casper.then(function() {
//    links = this.evaluate(getLinks);
//    var j = 0;
//    this.eachThen(links,function(response){
//        j++;
//        if(j >= maxLinks) return;
//
//        this.thenOpen(response.data, function writeOnJson() {
//
//            var objectsCount = this.evaluate(function(){
//                return __utils__.findAll('.list .quote p').length;
//            });
//
//            var objects = this.evaluate(function(){
//                return __utils__.findAll('.list .quote p');
//            });
//
//            quotes = new Array();
//            if(objectsCount != undefined) {
//                for(i = 0; i < objectsCount; i++) {
//                    if(objects[i] != null) {
//                        var quote = new Quote(objects[i]['innerText']);
//                        quotes.push(quote);
//                    }
//                }
//            }
//        });
//    });
//
//});

//var coupons = [[1, 2], [2, 3], [3, 4]]; // fake values for testing
//var casper = require('casper').create();
//casper.start();
//
//casper.then(function() {
//    this.eachThen(coupons, function(response) {
//        console.log(JSON.stringify(response.data));
//    });
//});
//
//casper.run();


var casper = require('casper').create({
        waitTimeout: 300000 //new maximum timeout
        // pageSettings: {
        //   loadImages:  false // disable to load img
        // }
    }),
    x = require('casper').selectXPath;
var page = require('webpage').create();
var gasHomePostcodeList = [3011, 3953, 3179, 3141, 3199];

casper.start('https://www.google..com/', function() {
});

casper.then(function() {
    var current = 0;
    var end = gasHomePostcodeList.length - 1;

    for (;current < end;) {

        (function(cntr) {
            casper.then(function() {
                this.echo('casper.async: '+ gasHomePostcodeList[cntr]);
                // here we can download stuff
            });
        })(current);

        current++;

    }

});

//casper.then(function() {
//    var current = 5;
//    while (current > 1) {
//
//        (function(cntr){
//            casper.then(function(){
//                this.echo('casper.async: '+cntr);
//            });
//        })(current);
//
//        current--;
//    }
//});



casper.run();