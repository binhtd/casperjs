/**
 * Created by binhtd on 26/08/2016.
 */
//filename: server.js

//define ip and port to web service
var ip_server = '127.0.0.1:8585';

//includes web server modules
var server = require('webserver').create();

//start web server
var service = server.listen(ip_server, function(request, response) {
    var links = [];
    var casper = require('casper').create();

    function getLinks() {
        var rows = document.querySelectorAll('table#jobs tr[id^="job"]');
        var jobs = [];

        require("utils").dump(rows);

        for (var i = 0, row; row = rows[i]; i++) {
            require('utils').dump(row.cells[1]);
            require('utils').dump(row.cells[2]);
            var a = row.cells[1].querySelectorAll('a[href*="jobdetail.ftl?job="]');
            var l = row.cells[2].querySelectorAll('span');
            var job = {};

            job['title'] = a.innerText;
            job['url'] = a.getAttribute('href');
            job['location'] = l.innerText;
            jobs.push(job);
        }

        return jobs;
    }

    casper.start('https://l3com.taleo.net/careersection/l3_ext_us/jobsearch.ftl', function() {
        // search for 'casperjs' from google form
        //this.fill('form[action="/search"]', { q: "casperjs" }, true);
    });

    casper.then(function() {
        // aggregate results for the 'casperjs' search
            links = this.evaluate(getLinks);
    });

    casper.run(function() {
        response.statusCode = 200;

        //sends results as JSON object
        response.write(JSON.stringify(links, null, null));
        response.close();
    });
});
console.log('Server running at http://' + ip_server+'/');
