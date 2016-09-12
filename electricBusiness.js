/**
 * Created by binhtd on 9/12/16.
 */

phantom.injectJs('crawlerCommon.js');

casper.start();
electricSmallBusinessPostcodeList = [3000, 3011, 3944, 3284, 3841];
//--------------------------------------------------------------------------------------------------------
//start electricity small business
casper.thenOpen(url, function(){
    phantom.clearCookies();
    current = 0;
    end = electricSmallBusinessPostcodeList.length;
    for (;current < end;) {
        (function(cntr) {
            casper.then(function() {
                this.mouse.click("label[for='electricity']");
                this.mouse.click("label[for='small-business']");

                this.mouse.click("#select2-retailer-container");
                this.mouse.click("#select2-retailer-results li:nth-child(2)");


                this.sendKeys("input[name='postcode']", casper.page.event.key.Enter , {keepFocus: true});
                this.sendKeys("input[name='postcode']", electricSmallBusinessPostcodeList[cntr] + "");
                this.click("#postcode-btn");


                this.wait(5000, function(){
                    this.evaluate(function(){
                        $("select#file-provider").select2("val", "agl");
                        $("#uploadFile").val("MyUsageData_06-05-2016.csv");
                    });
                });

                this.wait(5000, function(){
                });

                this.then(function(){
                    this.uploadFileUntilSuccessful();
                });

                this.waitUntilVisible("#disclaimer_chkbox", function(){
                    this.click("#disclaimer_chkbox");
                    this.click("#btn-proceed");

                    this.waitUntilVisible("#btn-new-energy", function () {
                        //click until more offer button disabled
                        this.clickMoreOfferButton();
                    });

                    moreOfferIndex = 0;
                    casper.then(function () {
                        this.loadResults(electricSmallBusinessPostcodeList[cntr], "electric", "business");
                    });

                    //reopen starting url before continue loop
                    casper.thenOpen(url, function(){
                    });
                });
            });
        })(current);
        current++;
    }
});

//end electricity small business
//--------------------------------------------------------------------------------------------------------

casper.then(function () {
    this.saveJSON(offerList, 'electric-business');
})
casper.run();