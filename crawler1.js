/**
 * Scrape job title, url, and location from Taleo jobs page at https://l3com.taleo.net/careersection/l3_ext_us/jobsearch.ftl
 *
 * Usage: $ casperjs scraper.js
 */
var casper = require("casper").create({
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

// Return the current page by looking for the disabled page number link in the pager
function getSelectedPage() {
    var el = document.querySelector('li[class="navigation-link-disabled"]');
    return parseInt(el.textContent);
}

function getJobs() {
    var rows = document.querySelectorAll('table#jobs tr[id^="job"]');
    var jobs = [];

    for (var i = 0, row; row = rows[i]; i++) {
        var a = row.cells[1].querySelector('a[href*="jobdetail.ftl?job="]');
        var l = row.cells[2].querySelector('span');
        var job = {};

        job['title'] = a.innerText;
        job['url'] = a.getAttribute('href');
        job['location'] = l.innerText;
        jobs.push(job);
    }

    return jobs;
}

var processPage = function() {
    jobs = this.evaluate(getJobs);
    require('utils').dump(jobs);

    if (currentPage >= 3 || !this.exists("table#jobs")) {
        return terminate.call(casper);
    }

    currentPage++;

    this.thenClick("div#jobPager a#next").then(function() {
        this.waitFor(function() {
            return currentPage === this.evaluate(getSelectedPage);
        }, processPage, terminate);
    });
};

casper.start(url);
casper.then(function(){
    casper.waitForSelector('table#jobs tr[id^="job"]', processPage, terminate);
});

casper.run();
