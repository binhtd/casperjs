/**
 * Created by binhtd on 25/08/2016.
 */

var casper = require("casper").create({
   waitTimeout: 10000,
    stepTimeout:10000,
    verbose: true,
    pageSettings: {
        WebSecurityEnable: false
    },
    onWaitTimeout: function() {
        this.echo ("** Wait-TimeOut**");
    },
    onStepTimeout: function(){
        this.echo("** Step-TimeOut");
    }
});

casper.start();
casper.open("http://techmeme.com");


casper.then(function(){
    //logic here
    this.test.assertExists("#topcol1");

    this.waitForSelector("#topcol1",
        function pass(){
            console.log("Continue");
        },
        function fail(){
            this.die("Did not load element... something is wrong");
        }
    );

    var links = this.evaluate( function(){
        var results = [];
        var elts = document.getElementsByClassName("ii");

        for (var i=0; i< elts.length; i++){
            var link = elts[i].getElementsByTagName("a")[0].getAttribute("href");
            var headline = elts[i].firstChild.textContent;
            results.push({link: link, headline: headline});
        }

        return results;
    });

    console.log("There were " + links.length + " stories");

    for (var i=0; i< links.length; i++){
        console.log(links[i].headline);
    }
});
//start your script
casper.run();