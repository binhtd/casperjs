/**
 * Created by binhtd on 25/08/2016.
 */
var casper = require("casper").create();

casper.echo("Casper CLI passed args:");
require("utils").dump(casper.cli.args);

casper.echo("Casper CLI passed options:");
require("utils").dump(casper.cli.options);


casper.echo(casper.cli.has(0));
casper.echo(casper.cli.get(0));
casper.echo(casper.cli.has(3));
casper.echo(casper.cli.get(3));
casper.echo(casper.cli.has("foo"));
casper.echo(casper.cli.get("foo"));
casper.cli.drop("foo");
casper.echo(casper.cli.has("foo"));
casper.echo(casper.cli.get("foo"));


casper.start("http://domain.tld/page.html", function(){
   if (this.exists("h1.page-title")){
       this.echo("the heading exists");
   }
});

casper.run();

casper.exit();