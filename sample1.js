//var casper = require('casper').create();
//
//casper.start('http://casperjs.org/', function() {
//    this.echo(this.getTitle());
//});
//
//casper.thenOpen('http://phantomjs.org', function() {
//    this.echo(this.getTitle());
//});
//
//casper.run();

var casper = require("casper").create(),
    utils = require('utils');


casper.formatString = function (containBetweenHtmlTag) {
    containBetweenHtmlTag = containBetweenHtmlTag.replace(/(\r\n|\n|\r)/gm, "");
    containBetweenHtmlTag = containBetweenHtmlTag.replace(/\s+/gm, " ");
    containBetweenHtmlTag = containBetweenHtmlTag.trim();

    return containBetweenHtmlTag;
};

casper.getUsagePrice = function (tariffDetailElementPattern, tariffDetailElement) {
    var matches = [],
        tariffDetailsHtml = "";
    try{
        tariffDetailsHtml = casper.formatString(tariffDetailElement);

        require('utils').dump(tariffDetailElement);
        matches = tariffDetailElementPattern.exec(tariffDetailsHtml);

        require('utils').dump(matches);
        if (utils.isArray(matches) && (matches.length>1)){
            return matches[1];
        }

    } catch (err) {
        console.log(err);
    } finally {

    }

    return "";
};

casper.getValue = function(pattern, str){
    var matches = pattern.exec(str);

    return matches[1];
};

var pattern = /.+?<p>Next.+?<strong>(.+?)<\/strong>/gim;
var str = '<div class=\"col-md-6 col-sm-6 col-xs-6\"> <p>Next 73000 MJ</p> </div> <div class=\"col-md-6 col-sm-6 col-xs-6 value\"> <p> <strong>1.24 ¢/MJ</strong> </p> </div>';

var number = casper.getUsagePrice(pattern, str);
require('utils').dump(number);


//var matches = pattern.exec(str);
//require('utils').dump(matches);


