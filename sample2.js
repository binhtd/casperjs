/**
 * Created by binhtd on 25/08/2016.
 */
var links = [];
var casper = require("casper").create();

function getLinks(){
    var links = document.querySelectorAll("h3.r a");
    return Array.prototype.map.call(links, function(e){
       return e.getAttribute("href");
    });
}

casper.start("http://google.fr/", function(){
    //SERACH FOR CASPERJS FROM GOOGLE. form
    this.fill('form[action="/search"]', {q: 'casperjs'}, true);
});

casper.then(function(){
   //aggregate results for t he casperjs search
    links = this.evaluate(getLinks);
    //now search for phantomjs by filling the form again
    this.fill('form[action="/search"]', {q: "phantomjs"}, true);
});

casper.then(function() {
    //aggregate results for the phantomjs search
    links = links.concat(this.evaluate(getLinks));
});

casper.run(function(){
    //echo results in some pretty fashion
    this.echo(links.length + " link found:");
    this.echo(" - " + links.join("\n - " )).exit();
})
