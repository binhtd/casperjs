/**
 * Created by binhtd on 26/08/2016.
 */

var x = require('casper').selectXPath,
    fs = require('fs'),
    utils = require('utils'),
    url = 'https://compare.switchon.vic.gov.au',
    offerList = [],
    gasHomePostcodeList = [3011],
//gasHomePostcodeList = [3011, 3953, 3179, 3141, 3199],
    gasSmallBusinessPostcodeList = [3011, 3953, 3179, 3141, 3199]
electricHomePostcodeList = [3000, 3011, 3944, 3284, 3841],
    electricSmallBusinessPostcodeList = [3000, 3011, 3944, 3284, 3841],
    current = 0, end = 0, moreOfferIndex = 0,

    postCode = "", frequency = "", guaranteedDiscounts = "", discountPercent2 = "",
    discountApplicability2 = "", exitFee1Year = "", exitFee2Year = "", contributionFee1 = "", contributionFee2 = "",
    retailer = "", offerName = "", offerNo = "", customerType = "", fuelType = "", distributor = "", tariffType = "",
    offerType = "", releaseDate = "", contractTerm = "", contractExpiryDetails = "", billFrequency = "" , allUsagePrice = "",
    dailySupplyChargePrice = "", firstUsagePrice = "", secondUsagePrice = "", thirdUsagePrice = "", fourthUagePrice = "",
    fifthUsagePrice = "", balanceUsagePrice = "", firstStep = "", secondStep = "", thirdStep = "", fourthStep = "", fifthStep = "",
    offPeakControlledLoad1AllControlledLoad1ALLUSAGEPrice = "", offPeakControlledLoad1AllControlledLoad1DailySupplyChargePrice = "",
    offPeakControlledLoad2AllControlledLoad1ALLUSAGEPrice = "", offPeakControlledLoad2AllControlledLoad1DailySupplyChargePrice = "",
    conditionalDiscount = "", discountPercent = "", discountApplicableTo = "", areThesePricesFixed = "", eligibilityCriteria = "",
    chequeDishonourPaymentFee = "", directDebitDishonourPaymentFee = "", paymentProcessingFee = "", disconnectionFee = "", reconnectionFee = "",
    otherFee1 = "", latePaymentFee = "", creditCardPaymentProcessingFee = "", otherFee2 = "", voluntaryFiT = "", greenPowerOption = "", incentives = "",
    peak = "", shoulder = "", offPeak = "", peakSummer = "", peakWinter = "", peakFirstUsagePrice = "", peakSecondUsagePrice = "", peakThirdUsagePrice = "",
    peakFourthUsagePrice = "", peakFifthUsagePrice = "", peakBalancePrice = "", summerMonthlyDemand = "", winterMonthlyDemand = "", additionalMonthlyDemand = "",
    conditionalDiscount2 = "", conditionalDiscount2Percentage = "", conditionalDiscount2Applicableto = "";

var casper = require("casper").create({
    //verbose: true,
    //logLevel: "debug",
    waitTimeout: 2000000,
    stepTimeout: 2000000,
    pageSettings: {
        loadImages: false,
        loadPlugins: false,
        userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:23.0) Gecko/20130404 Firefox/23.0"
    }
});

casper.renderJSON = function (what) {
    return this.echo(JSON.stringify(what, null, '  '));
};

casper.saveJSON = function (what) {
    fs.write('json/parse_result.json', JSON.stringify(what, null, '  '), 'w');
};

casper.clickMoreOfferButton = function () {
    if (!casper.exists(x("//*/button[@class='btn more-offer-btn more-offer-btn-txt'][@disabled]"))) {
        casper.click(".more-offer-btn");
        casper.wait(5000, casper.clickMoreOfferButton);
    }
};

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
        tariffDetailsHtml = this.formatString(tariffDetailElement["html"]);
        matches = tariffDetailElementPattern.exec(tariffDetailsHtml);

        if (utils.isArray(matches) && (matches.length>1)){
            return matches[1];
        }

    } catch (err) {
        console.log(err);
    } finally {

    }

    return "";
};

casper.getBalance = function (tariffDetailElementPattern, tariffDetailElements) {
    var matches = [], tariffDetailsHtml = "";
    try {
        for (var i = 0; i < tariffDetailElements.length; i++) {
            tariffDetailsHtml = this.formatString(tariffDetailElements[i]["html"]);
            matches = tariffDetailElementPattern.exec(tariffDetailsHtml);

            if (utils.isArray(matches) && (matches.length>1)){
                return matches[1];
            }
        }
    }
    catch(err){
        console.log(err);
    }
    return "";
};

casper.getPeak = function (tariffDetailElementPattern, tariffDetailElements) {
    var matches = [], tariffDetailsHtml = "";
    for (var i = 0; i < tariffDetailElements.length; i++) {
        tariffDetailsHtml = this.formatString(tariffDetailElements[i]["html"]);
        matches = tariffDetailElementPattern.exec(tariffDetailsHtml);

        if (utils.isArray(matches) && (matches.length>1)){
            return matches[1];
        }
    }

    return "";
};

casper.getShoulder = function (tariffDetailElementPattern, tariffDetailElements) {
    var matches = [], tariffDetailsHtml = "";
    for (var i = 0; i < tariffDetailElements.length; i++) {
        tariffDetailsHtml = this.formatString(tariffDetailElements[i]["html"]);
        matches = tariffDetailElementPattern.exec(tariffDetailsHtml);

        if (utils.isArray(matches) && (matches.length>1)){
            return matches[1];
        }
    }

    return "";
};

casper.getOffpeak = function (tariffDetailElementPattern, tariffDetailElements) {
    var matches = [], tariffDetailsHtml = "";
    for (var i = 0; i < tariffDetailElements.length; i++) {
        tariffDetailsHtml = this.formatString(tariffDetailElements[i]["html"]);
        matches = tariffDetailElementPattern.exec(tariffDetailsHtml);

        if (utils.isArray(matches) && (matches.length>1)){
            return matches[1];
        }
    }

    return "";
};

casper.start(url);

//--------------------------------------------------------------------------------------------------------
//start parse for gas home
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

            this.wait(15000, function () {
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
            casper.then(function loadResults() {
                var linkCount = this.getElementsInfo("ul.offer-list div.retailer-details a").length;
                this.repeat(linkCount, function () {
                    try {
                        // opens modal popup
                        this.evaluate(function (index) {
                            $("ul.offer-list div.retailer-details a")[index].click();
                        }, moreOfferIndex);

                        this.wait(5000, function () {
                            postCode = gasHomePostcodeList[cntr];
                            retailer = this.exists("div.offerModalEmail div.col-md-8 h1") ? this.formatString(this.fetchText("div.offerModalEmail div.col-md-8 h1")) : "";
                            offerName = this.exists("div.offerModalEmail div.col-md-8 span.HelveticaNeueLTStd-UltLt-Offer") ?
                                this.formatString(this.fetchText("div.offerModalEmail div.col-md-8 span.HelveticaNeueLTStd-UltLt-Offer")) : "";

                            if (this.fetchText("div.offerModalEmail table.offer-detail-table tr:nth-child(1) td:nth-child(1)") == "Offer ID:") {
                                offerNo = this.formatString(this.fetchText("div.offerModalEmail table.offer-detail-table tr:nth-child(1) td:nth-child(2)"));
                            }

                            if (this.fetchText("div.offerModalEmail table.offer-detail-table tr:nth-child(2) td:nth-child(1)") == "Customer type:") {
                                customerType = this.formatString(this.fetchText("div.offerModalEmail table.offer-detail-table tr:nth-child(2) td:nth-child(2)"));
                            }
                            fuelType = "gas";

                            if (this.fetchText("div.offerModalEmail table.offer-detail-table tr:nth-child(3) td:nth-child(1)") == "Distributor:") {
                                distributor = this.formatString(this.fetchText("div.offerModalEmail table.offer-detail-table tr:nth-child(3) td:nth-child(2)"));
                            }

                            if (this.fetchText("div.offerModalEmail table.offer-detail-table tr:nth-child(4) td:nth-child(1)") == "Rate type:") {
                                tariffType = this.formatString(this.fetchText("div.offerModalEmail table.offer-detail-table tr:nth-child(4) td:nth-child(2)"));
                            }

                            if (this.fetchText("div.offerModalEmail table.offer-detail-table tr:nth-child(5) td:nth-child(1)") == "Offer type:") {
                                offerType = this.formatString(this.fetchText("div.offerModalEmail table.offer-detail-table tr:nth-child(5) td:nth-child(2)"));
                            }

                            if (this.fetchText("div.offerModalEmail table.offer-detail-table tr:nth-child(6) td:nth-child(1)") == "Release date:") {
                                releaseDate = this.formatString(this.fetchText("div.offerModalEmail table.offer-detail-table tr:nth-child(6) td:nth-child(2)"));
                            }

                            if (this.fetchText("div.view-offer-section2 div.table-responsive table.contract-table tr:nth-child(1) td:nth-child(1)") == "Select contract term:") {
                                contractTerm = this.formatString(this.fetchText("div.view-offer-section2 div.table-responsive table.contract-table tr:nth-child(1) td:nth-child(2) button"));
                            }

                            if (this.fetchText("div.view-offer-section2 div.table-responsive table.contract-table tr:nth-child(6) td:nth-child(1)") == "Contract expiry details") {
                                contractExpiryDetails = this.formatString(this.fetchText("div.view-offer-section2 div.table-responsive table.contract-table tr:nth-child(6) td:nth-child(2)"));
                            }
                            var dailySupplyChargePriceElementValue = this.getElementInfo("div.tariff-details div.supply-charge div:nth-child(2) p"),
                                dailySupplyChargePriceElementText = this.getElementInfo("div.tariff-details div.supply-charge div:nth-child(1) p");

                            if (!utils.isNull(dailySupplyChargePriceElementValue) && !utils.isNull(dailySupplyChargePriceElementText) && (dailySupplyChargePriceElementText["text"] == "Supply charges")) {
                                dailySupplyChargePrice = this.formatString(dailySupplyChargePriceElementValue["text"]);
                            }

                            var tariffDetailElements = this.getElementsInfo("div.view-offer-section2 div.col-md-4 div.offer-rate-header+div div.tariff-details div.line-separator"),
                                firstUsagePricePattern = /.+?<p>First.+?<strong>(.+?)<\/strong>/im,
                                nextUsagePricePattern = /.+?<p>Next.+?<strong>(.+?)<\/strong>/im,
                                balanceUsagePricePattern = /.+?<p>Balance.+?<strong>(.+?)<\/strong>/im,
                                peakPattern = /.+?<p>All consumption.+?<strong>(.+?)<\/strong>/im,
                                shoulderPattern = /.+?Shoulder.+?<p>All consumption.+?<strong>(.+?)<\/strong>/im,
                                offPeakPattern = /.+?Off-peak.+?<p>All consumption.+?<strong>(.+?)<\/strong>/im;


                            if (!utils.isNull(tariffDetailElements[0]) && (!utils.isUndefined(tariffDetailElements[0]))) {
                                firstUsagePrice = this.getUsagePrice(firstUsagePricePattern, tariffDetailElements[0]);
                            }

                            if (!utils.isNull(tariffDetailElements[1]) && (!utils.isUndefined(tariffDetailElements[1]))) {
                                secondUsagePrice = this.getUsagePrice(nextUsagePricePattern, tariffDetailElements[1]);
                            }


                            if (!utils.isNull(tariffDetailElements[2]) && (!utils.isUndefined(tariffDetailElements[2]))) {
                                thirdUsagePrice = this.getUsagePrice(nextUsagePricePattern, tariffDetailElements[2]);
                            }

                            if (!utils.isNull(tariffDetailElements[3]) && (!utils.isUndefined(tariffDetailElements[3]))) {
                                fourthUagePrice = this.getUsagePrice(nextUsagePricePattern, tariffDetailElements[3]);
                            }

                            if (!utils.isNull(tariffDetailElements[4]) && (!utils.isUndefined(tariffDetailElements[4]))) {
                                fifthUsagePrice = this.getUsagePrice(nextUsagePricePattern, tariffDetailElements[4]);
                            }

                            balanceUsagePrice = this.getBalance(balanceUsagePricePattern, tariffDetailElements);
                            peak = this.getPeak(peakPattern, tariffDetailElements);

                            tariffDetailElements = this.getElementsInfo("div.view-offer-section2 div.tariff-details div.tariff-separator");
                            shoulder = this.getShoulder(shoulderPattern, tariffDetailElements);
                            offPeak = this.getShoulder(offPeakPattern, tariffDetailElements);

                            offerList.push({
                                'postCode': postCode,
                                'retailer': retailer,
                                'offerName': offerName,
                                'offerNo': offerNo,
                                'customerType': customerType,
                                'fuelType': fuelType,
                                'distributor': distributor,
                                'tariffType': tariffType,
                                'offerType': offerType,
                                'releaseDate': releaseDate,
                                'contractTerm': contractTerm,
                                'contractExpiryDetails': contractExpiryDetails,
                                'dailySupplyChargePrice': dailySupplyChargePrice,
                                'firstUsagePrice': firstUsagePrice,
                                'secondUsagePrice': secondUsagePrice,
                                'thirdUsagePrice': thirdUsagePrice,
                                'fourthUagePrice': fourthUagePrice,
                                'fifthUsagePrice': fifthUsagePrice,
                                'balanceUsagePrice': balanceUsagePrice,
                                'peak': peak,
                                'shoulder': shoulder,
                                'offPeak': offPeak
                            });
                        });

                        // close modal popup
                        if (this.exists('button.close')) {
                            this.click('button.close');
                        }
                    } catch (err) {
                        console.log(err);
                    } finally {
                        moreOfferIndex++;
                    }
                });

            });

            //this.evaluate(function(viewOfferIndex) {
            //    $("ul.offer-list div.retailer-details a")[0].click();
            //
            //    this.wait(10000, function(){
            //        this.capture("png-gas-home" + 0 + ".png", {
            //            top: 0,
            //            left: 0,
            //            width: 1024,
            //            height: 5000
            //        });
            //    });
            //});

            //this.then(function(){
            //    var linkCount = this.getElementsInfo('ul.offer-list div.retailer-details a').length,
            //        offerIndex = 0;
            //
            //    for (;offerIndex < linkCount; offerIndex++) {
            //        this.evaluate(function(viewOfferIndex){
            //            $("ul.offer-list div.retailer-details a")[viewOfferIndex].click();
            //
            //            this.wait(10000, function(){
            //                this.capture("png-gas-home" + viewOfferIndex + ".png", {
            //                    top: 0,
            //                    left: 0,
            //                    width: 1024,
            //                    height: 5000
            //                });
            //            });
            //        }, offerIndex);
            //    }
            //
            //    //this.click('div.modal-dialog button.close'); // close modal popup
            //    //this.exit();
            //});

            //this.then(function(){
            //    this.capture("png-gas-home" + gasHomePostcodeList[cntr] + ".png");
            //});

            //this.wait(30000, function() {
            //    this.thenOpen("https://compare.switchon.vic.gov.au/service/offers", {
            //        method: 'get',
            //        headers: {
            //            'Content-Type': 'application/json',
            //            'Accept': 'application/json'
            //        }
            //    });
            //});
            //
            //this.wait(15000, function(){
            //    var data = this.getPageContent().replace(/<\/?[^>]+(>|$)/g, ""),
            //        json = JSON.parse(data),
            //        offers = json["offersList"];
            //
            //    this.each(offers, function(self, offer){
            //        offerList.push(offer);
            //    });
            //
            //    casper.thenOpen(url, function(){
            //    });
            //});
        });
    })(current);
    current++;
}
//end parse for gas home
//--------------------------------------------------------------------------------------------------------

//--------------------------------------------------------------------------------------------------------
//start parse for gas small business
//current = 0;
//end = gasSmallBusinessPostcodeList.length;
//for (;current < end;) {
//    (function(cntr) {
//        casper.then(function() {
//            this.mouse.click("label[for='gas']");
//            this.mouse.click("label[for='small-business']");
//
//            this.mouse.click("#select2-retailer-container");
//            this.mouse.click("#select2-retailer-results li:nth-child(2)");
//
//            this.sendKeys("input[name='postcode']", casper.page.event.key.Enter , {keepFocus: true});
//            this.sendKeys("input[name='postcode']", gasSmallBusinessPostcodeList[cntr] + "");
//            this.click("#postcode-btn");
//
//            this.wait(10000, function() {
//                this.click("#disclaimer_chkbox");
//                this.click("#btn-proceed");
//            });
//
//            this.wait(15000, function() {
//                this.sendKeys("#gas-start-date", "8/1/2016");
//                this.sendKeys("#gas-end-date", "8/2/2016");
//                this.sendKeys("#gas-usage", "50");
//                this.click(".profile-btn");
//            });
//
//            this.wait(15000, function(){
//                this.capture("png-gas-smallbusiness" + gasSmallBusinessPostcodeList[cntr] + ".png");
//            });
//
//            this.wait(30000, function() {
//                this.thenOpen("https://compare.switchon.vic.gov.au/service/offers", {
//                    method: 'get',
//                    headers: {
//                        'Content-Type': 'application/json',
//                        'Accept': 'application/json'
//                    }
//                });
//            });
//
//            this.wait(15000, function(){
//                var data = this.getPageContent().replace(/<\/?[^>]+(>|$)/g, ""),
//                    json = JSON.parse(data),
//                    offers = json["offersList"];
//
//                this.each(offers, function(self, offer){
//                    offerList.push(offer);
//                });
//
//                casper.thenOpen(url, function(){
//                });
//            });
//        });
//    })(current);
//    current++;
//}
//end parse for gas small business
//--------------------------------------------------------------------------------------------------------

//--------------------------------------------------------------------------------------------------------
//start electricity home
//current = 0;
//end = electricHomePostcodeList.length;
//for (;current < end;) {
//    (function(cntr) {
//        casper.then(function() {
//            this.mouse.click("label[for='electricity']");
//            this.mouse.click("label[for='home']");
//            this.mouse.click("label[for='home-here']");
//
//            this.mouse.click("#select2-retailer-container");
//            this.mouse.click("#select2-retailer-results li:nth-child(2)");
//
//
//            this.sendKeys("input[name='postcode']", casper.page.event.key.Enter , {keepFocus: true});
//            this.sendKeys("input[name='postcode']", electricHomePostcodeList[cntr] + "");
//            this.click("#postcode-btn");
//
//            this.wait(5000, function() {
//                this.click("label[for='energy-concession-no']");
//                this.click("label[for='upload-yes']");
//            });
//
//            this.wait(5000, function(){
//                this.evaluate(function(){
//                    $("select#file-provider").select2("val", "agl");
//                    $("#uploadFile").val("MyUsageData_06-05-2016.csv");
//                });
//            });
//
//            this.wait(5000, function(){
//                this.page.uploadFile("#data-file-secondary input[name=fileupload]", "./MyUsageData_06-05-2016.csv");
//                this.evaluate(function(){
//                    $("#data-file-secondary input[name=fileupload]").trigger("fileuploadadd");
//                });
//            })
//
//            this.wait(100000,function(){
//                this.click("#disclaimer_chkbox");
//                this.click("#btn-proceed");
//            });
//
//            this.wait(100000, function(){
//                this.capture("png-electricity-home" + electricHomePostcodeList[cntr] + ".png");
//            });
//
//            this.wait(10000, function() {
//                this.thenOpen("https://compare.switchon.vic.gov.au/service/offers", {
//                    method: 'get',
//                    headers: {
//                        'Content-Type': 'application/json',
//                        'Accept': 'application/json'
//                    }
//                });
//            });
//
//            this.wait(10000, function(){
//                var data = this.getPageContent().replace(/<\/?[^>]+(>|$)/g, ""),
//                    json = JSON.parse(data),
//                    offers = json["offersList"];
//
//                this.each(offers, function(self, offer){
//                    offerList.push(offer);
//                });
//
//                casper.thenOpen(url, function(){
//                });
//            });
//        });
//    })(current);
//    current++;
//}
//end electricity home
//--------------------------------------------------------------------------------------------------------


//--------------------------------------------------------------------------------------------------------
//start electricity small business
//current = 0;
//end = electricSmallBusinessPostcodeList.length;
//for (;current < end;) {
//    (function(cntr) {
//        casper.then(function() {
//            this.mouse.click("label[for='electricity']");
//            this.mouse.click("label[for='small-business']");
//
//            this.mouse.click("#select2-retailer-container");
//            this.mouse.click("#select2-retailer-results li:nth-child(2)");
//
//
//            this.sendKeys("input[name='postcode']", casper.page.event.key.Enter , {keepFocus: true});
//            this.sendKeys("input[name='postcode']", electricSmallBusinessPostcodeList[cntr] + "");
//            this.click("#postcode-btn");
//
//
//            this.wait(5000, function(){
//                this.evaluate(function(){
//                    $("select#file-provider").select2("val", "agl");
//                    $("#uploadFile").val("MyUsageData_06-05-2016.csv");
//                });
//            });
//
//            this.wait(5000, function(){
//                this.page.uploadFile("#data-file-secondary input[name=fileupload]", "./MyUsageData_06-05-2016.csv");
//                this.evaluate(function(){
//                    $("#data-file-secondary input[name=fileupload]").trigger("fileuploadadd");
//                });
//            })
//
//            this.wait(100000,function(){
//                this.click("#disclaimer_chkbox");
//                this.click("#btn-proceed");
//            });
//
//            this.wait(100000, function(){
//                this.capture("png-electricity-smallbusiness" + electricSmallBusinessPostcodeList[cntr] + ".png");
//            });
//
//            this.wait(10000, function() {
//                this.thenOpen("https://compare.switchon.vic.gov.au/service/offers", {
//                    method: 'get',
//                    headers: {
//                        'Content-Type': 'application/json',
//                        'Accept': 'application/json'
//                    }
//                });
//            });
//
//            this.wait(10000, function(){
//                var data = this.getPageContent().replace(/<\/?[^>]+(>|$)/g, ""),
//                    json = JSON.parse(data),
//                    offers = json["offersList"];
//
//                this.each(offers, function(self, offer){
//                    offerList.push(offer);
//                });
//
//                casper.thenOpen(url, function(){
//                });
//            });
//        });
//    })(current);
//    current++;
//}
//end electricity small business
//--------------------------------------------------------------------------------------------------------

casper.then(function () {
    var str = "";

    for (var i = 0; i < offerList.length; i++) {
        str += JSON.stringify(offerList[i], null, ' ');
    }

    fs.write('json/parse_result.json', str, 'w');
})
casper.run();