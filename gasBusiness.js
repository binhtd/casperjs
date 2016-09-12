/**
 * Created by binhtd on 9/12/16.
 */


phantom.injectJs('crawlerCommon.js');
//--------------------------------------------------------------------------------------------------------
//start parse for gas small business
casper.thenOpen(url, function(){
    phantom.clearCookies();
    current = 0;
    end = gasSmallBusinessPostcodeList.length;
    for (;current < end;) {
        (function(cntr) {
            casper.then(function() {
                this.mouse.click("label[for='gas']");
                this.mouse.click("label[for='small-business']");

                this.mouse.click("#select2-retailer-container");
                this.mouse.click("#select2-retailer-results li:nth-child(2)");

                this.sendKeys("input[name='postcode']", casper.page.event.key.Enter , {keepFocus: true});
                this.sendKeys("input[name='postcode']", gasSmallBusinessPostcodeList[cntr] + "");
                this.click("#postcode-btn");

                this.wait(10000, function() {
                    this.click("#disclaimer_chkbox");
                    this.click("#btn-proceed");
                });

                this.wait(30000, function() {
                    this.sendKeys("#gas-start-date", "8/1/2016");
                    this.sendKeys("#gas-end-date", "8/2/2016");
                    this.sendKeys("#gas-usage", "50");
                    this.click(".profile-btn");
                });

                this.wait(5000, function () {
                    //click until more offer button disabled
                    this.clickMoreOfferButton();
                });

                moreOfferIndex = 0;
                casper.then(function () {
                    this.loadResults(gasSmallBusinessPostcodeList[cntr], "gas", "business");
                });

                //reopen starting url before continue loop
                casper.thenOpen(url, function(){
                });
            });
        })(current);
        current++;
    }
});
//end parse for gas small business
//--------------------------------------------------------------------------------------------------------

casper.then(function () {
    this.saveJSON(offerList, 'gas-business');
})
casper.run();