/**
 * Created by binhtd on 9/12/16.
 */

phantom.injectJs('crawlerCommon.js');

//--------------------------------------------------------------------------------------------------------
//start parse for gas home
casper.thenOpen(url, function(){
    phantom.clearCookies();
    end = gasHomePostcodeList.length;
    for (; current < end;) {
        (function (cntr) {
            casper.then(function () {
                this.mouse.click("label[for='gas']");
                this.mouse.click("label[for='home']");
                this.mouse.click("label[for='home-shift']");
                this.sendKeys("input[name='postcode']", casper.page.event.key.Enter, {keepFocus: true});
                this.sendKeys("input[name='postcode']", gasHomePostcodeList[cntr] + "");
                this.click("#postcode-btn");

                this.wait(5000, function () {
                    this.click("label[for='energy-concession-no']");
                    this.click("#disclaimer_chkbox");
                    this.click("#btn-proceed");
                });

                this.wait(30000, function () {
                    this.mouse.click("#select2-number_person-container");
                    this.mouse.click("#select2-number_person-results li:first-child");

                    this.mouse.click("#select2-number_room-container");
                    this.mouse.click("#select2-number_room-results li:first-child");

                    this.mouse.click("#spaceheat-appl-group input[value='none']");
                    this.mouse.click("#cloth-dryer-group label[for='dryer-no']");

                    this.mouse.click("#water-heating-group input[value='other']");

                    this.click(".profile-btn");
                });

                this.wait(15000, function () {
                    //click until more offer button disabled
                    this.clickMoreOfferButton();
                });

                moreOfferIndex = 0;
                casper.then(function () {
                    this.loadResults(gasHomePostcodeList[cntr], "gas", "home");
                });

                //reopen starting url before continue loop
                casper.thenOpen(url, function(){
                });
            });
        })(current);
        current++;
    }
});
//end parse for gas home
//--------------------------------------------------------------------------------------------------------

casper.then(function () {
    this.saveJSON(offerList, 'gas-home');
})
casper.run();