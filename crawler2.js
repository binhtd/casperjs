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
    gasSmallBusinessPostcodeList = [],
    //gasSmallBusinessPostcodeList = [3011, 3953, 3179, 3141, 3199]
    electricHomePostcodeList = []
//electricHomePostcodeList = [3000, 3011, 3944, 3284, 3841],
    electricSmallBusinessPostcodeList = [],
    //electricSmallBusinessPostcodeList = [3000, 3011, 3944, 3284, 3841],
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
    conditionalDiscount2 = "", conditionalDiscount2Percentage = "", conditionalDiscount2Applicableto = "",
    directDebitOnly = "", payOnTimeDiscount = "", incentive = "", greenPower = "", coolingOffPeriod = "", eligibilityCriteria = "", fullTermsAndConditions = "",
    pricesChanges = "", contractExpiry = "", availToSolarCustomers = "", discountArray = [], feeObject = {};


var casper = require("casper").create({
    verbose: true,
    logLevel: "debug",
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
    try {
        tariffDetailsHtml = this.formatString(tariffDetailElement["html"]);
        matches = tariffDetailElementPattern.exec(tariffDetailsHtml);

        if (utils.isArray(matches) && (matches.length > 1)) {
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

            if (utils.isArray(matches) && (matches.length > 1)) {
                return matches[1];
            }
        }
    }
    catch (err) {
        console.log(err);
    }
    return "";
};

casper.getPeak = function (tariffDetailElementPattern, tariffDetailElements) {
    var matches = [], tariffDetailsHtml = "";
    for (var i = 0; i < tariffDetailElements.length; i++) {
        tariffDetailsHtml = this.formatString(tariffDetailElements[i]["html"]);
        matches = tariffDetailElementPattern.exec(tariffDetailsHtml);

        if (utils.isArray(matches) && (matches.length > 1)) {
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

        if (utils.isArray(matches) && (matches.length > 1)) {
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

        if (utils.isArray(matches) && (matches.length > 1)) {
            return matches[1];
        }
    }

    return "";
};

casper.getDiscounts = function () {
    var discountFeeIndex = 0,
        discountFeeElements = [],
        discountPercentageArray = [],
        discountRecord = {"discountPercentage":"", "discountDescription":""},
        discountResultset = [],
        discountFeeElements = this.getElementsInfo(x("//*/span[contains(text(),'Discounts and fees')]/../../following-sibling::div/div/span[contains(text(),'Discounts:')]/../p"));

    while (discountFeeIndex < discountFeeElements.length) {
        if (!utils.isNull(discountFeeElements[discountFeeIndex])) {
            discountRecord["discountPercentage"] = this.fetchText(x('//*/span[contains(text(),"Discounts and fees")]/../../following-sibling::div/div/span[contains(text(),"Discounts:")]/../p[' + (discountFeeIndex+1) + ']'));
            discountRecord["discountPercentage"] = this.formatString(discountRecord["discountPercentage"]);
            discountPercentageArray = discountRecord["discountPercentage"].match(/(\$?\d+%?)/);

            if (!utils.isNull(discountPercentageArray[1])) {
                discountRecord["discountPercentage"] = discountPercentageArray[1];
            }
        }

        if (!utils.isNull(discountFeeElements[discountFeeIndex + 1])) {
            discountRecord["discountDescription"] = this.fetchText(x('//*/span[contains(text(),"Discounts and fees")]/../../following-sibling::div/div/span[contains(text(),"Discounts:")]/../p[' + (discountFeeIndex + 2) + ']'));
        }

        discountResultset.push(discountRecord);
        discountFeeIndex += 2;
    }

    return discountResultset;
};

casper.getFees = function () {
    var feeElements = this.getElementsInfo(x("//*/div[@class='col-md-6']/span[@class='sub-header'][text()='Fees']/../p")),
        feeIndex = 0,
        feeTitleHeaders = ["Early termination fee", "Disconnection fee", "Reconnection fee", "Additional Fee Information", "Credit card payment processing fee",
            "other fee", "payment processing fee", "Direct debit dishonour payment fee", "Account establishment fee", "Cheque dishonour payment fee", "Connection fee",
            "100% GreenPower", "10% GreenPower", "20% GreenPower", "25% GreenPower", "Late payment fee", "50% GreenPower"],
        feeResultset = {
            "Early termination fee":[],
            "Disconnection fee": [],
            "Reconnection fee": [],
            "Additional Fee Information": [],
            "Credit card payment processing fee": [],
            "other fee": [],
            "payment processing fee": [],
            "Direct debit dishonour payment fee": [],
            "Account establishment fee": [],
            "Cheque dishonour payment fee": [],
            "Connection fee": [],
            "100% GreenPower": [],
            "10% GreenPower": [],
            "20% GreenPower": [],
            "25% GreenPower": [],
            "Late payment fee": [],
            "50% GreenPower": [],
        }, pattern, feeRecord = {}, feePercentageArray = [], isChangedInsideCheckingTitleHeader = false;

    while (feeIndex < feeElements.length) {
        feeRecord = {"feeDescription" : "", "feePercentage" : ""};
        for (var i = 0; i < feeTitleHeaders.length; i++) {
            pattern = new RegExp(feeTitleHeaders[i], "i");

            if (!utils.isNull(feeElements[feeIndex]) && !utils.isNull(feeElements[feeIndex]["html"]) && pattern.test( this.formatString(feeElements[feeIndex]["html"]))) {
                //utils.dump("inside if 1");
                isChangedInsideCheckingTitleHeader = true;
                if (!utils.isNull(feeElements[feeIndex+1])){
                    feeRecord["feeDescription"] = this.formatString(this.fetchText(x("//*/div[@class='col-md-6']/span[@class='sub-header'][text()='Fees']/../p[" + (feeIndex + 2) + "]")));
                }

                if ( (["Additional Fee Information", "100% GreenPower", "10% GreenPower", "20% GreenPower", "25% GreenPower", "50% GreenPower"].indexOf(feeTitleHeaders[i]) < 0) && !utils.isNull(feeElements[feeIndex+2])) {
                    feeRecord["feePercentage"] = this.formatString(this.fetchText(x("//*/div[@class='col-md-6']/span[@class='sub-header'][text()='Fees']/../p[" + (feeIndex + 3) + "]")));
                    feePercentageArray = feeRecord["feePercentage"].match(/(\$?\d+%?)/);

                    if (utils.isArray(feePercentageArray) && !utils.isNull(feePercentageArray[1])) {
                        feeRecord["feePercentage"] = feePercentageArray[1];
                    }

                    feeIndex += 3;
                } else {
                    feeIndex += 2;
                }

                //utils.dump("feeIndex:" + feeIndex);
                feeResultset[feeTitleHeaders[i]].push(feeRecord);
                break;
            }

            if (!isChangedInsideCheckingTitleHeader && (i==feeTitleHeaders.length-1)){
                feeIndex++;
            }
        }

        if (!isChangedInsideCheckingTitleHeader){
            //utils.dump("inside if 4");
            feeIndex++;
            isChangedInsideCheckingTitleHeader = false;
        }
    }

    return feeResultset;
}

casper.loadResults = function (postCodeValue, fuealTypeValue) {
    var linkCount = this.getElementsInfo("ul.offer-list div.retailer-details a").length;
    this.repeat(linkCount, function () {
        try {
            // opens modal popup
            this.evaluate(function (index) {
                $("ul.offer-list div.retailer-details a")[index].click();
            }, moreOfferIndex);

            this.wait(5000, function () {
                postCode = postCodeValue;
                retailer = this.exists("div.offerModalEmail div.col-md-8 h1") ? this.formatString(this.fetchText("div.offerModalEmail div.col-md-8 h1")) : "";
                offerName = this.exists("div.offerModalEmail div.col-md-8 span.HelveticaNeueLTStd-UltLt-Offer") ?
                    this.formatString(this.fetchText("div.offerModalEmail div.col-md-8 span.HelveticaNeueLTStd-UltLt-Offer")) : "";

                if (this.fetchText("div.offerModalEmail table.offer-detail-table tr:nth-child(1) td:nth-child(1)") == "Offer ID:") {
                    offerNo = this.formatString(this.fetchText("div.offerModalEmail table.offer-detail-table tr:nth-child(1) td:nth-child(2)"));
                }

                utils.dump(offerNo);

                if (this.fetchText("div.offerModalEmail table.offer-detail-table tr:nth-child(2) td:nth-child(1)") == "Customer type:") {
                    customerType = this.formatString(this.fetchText("div.offerModalEmail table.offer-detail-table tr:nth-child(2) td:nth-child(2)"));
                }
                fuelType = fuealTypeValue;

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


                firstUsagePrice = "";
                if (!utils.isNull(tariffDetailElements[0]) && (!utils.isUndefined(tariffDetailElements[0]))) {
                    firstUsagePrice = this.getUsagePrice(firstUsagePricePattern, tariffDetailElements[0]);
                }

                secondUsagePrice = "";
                if (!utils.isNull(tariffDetailElements[1]) && (!utils.isUndefined(tariffDetailElements[1]))) {
                    secondUsagePrice = this.getUsagePrice(nextUsagePricePattern, tariffDetailElements[1]);
                }

                thirdUsagePrice = "";
                if (!utils.isNull(tariffDetailElements[2]) && (!utils.isUndefined(tariffDetailElements[2]))) {
                    thirdUsagePrice = this.getUsagePrice(nextUsagePricePattern, tariffDetailElements[2]);
                }

                fourthUagePrice = "";
                if (!utils.isNull(tariffDetailElements[3]) && (!utils.isUndefined(tariffDetailElements[3]))) {
                    fourthUagePrice = this.getUsagePrice(nextUsagePricePattern, tariffDetailElements[3]);
                }

                fifthUsagePrice = "";
                if (!utils.isNull(tariffDetailElements[4]) && (!utils.isUndefined(tariffDetailElements[4]))) {
                    fifthUsagePrice = this.getUsagePrice(nextUsagePricePattern, tariffDetailElements[4]);
                }

                balanceUsagePrice = this.getBalance(balanceUsagePricePattern, tariffDetailElements);
                peak = this.getPeak(peakPattern, tariffDetailElements);

                tariffDetailElements = this.getElementsInfo("div.view-offer-section2 div.tariff-details div.tariff-separator");
                shoulder = this.getShoulder(shoulderPattern, tariffDetailElements);
                offPeak = this.getShoulder(offPeakPattern, tariffDetailElements);

                directDebitOnly = this.fetchText(x('//*/i[@class="material-icons debit-img"]/../following-sibling::td')).match(/^(not|no)/i) ? "No" : "Yes";
                payOnTimeDiscount = this.fetchText(x('//*/table[@class="table offer-feature-table"]/*/tr[2]/td[2]')).match(/^(not|no)/i) ? "No" : "Yes";
                incentive = this.fetchText(x('//*/table[@class="table offer-feature-table"]/*/tr[3]/td[2]')).match(/^(not|no)/i) ? "No" : "Yes";
                greenPower = this.formatString(this.fetchText(x('//*/table[@class="table offer-feature-table"]/*/tr[3]/td[2]')));

                coolingOffPeriod =  this.formatString(this.fetchText(x('//*/table[@class="table table-striped contract-table"]/*/tr[2]/td[2]')));
                eligibilityCriteria = this.formatString(this.fetchText(x('//*/table[@class="table table-striped contract-table"]/*/tr[3]/td[2]')));
                fullTermsAndConditions = this.formatString(this.fetchText(x('//*/table[@class="table table-striped contract-table"]/*/tr[4]/td[2]')));
                pricesChanges = this.formatString(this.fetchText(x('//*/table[@class="table table-striped contract-table"]/*/tr[5]/td[2]')));
                contractExpiry = this.formatString(this.fetchText(x('//*/table[@class="table table-striped contract-table"]/*/tr[6]/td[2]')));
                availToSolarCustomers = this.formatString(this.fetchText(x('//*/table[@class="table table-striped contract-table"]/*/tr[8]/td[2]')));

                discountArray = this.getDiscounts();
                feeObject = this.getFees();

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
                    'offPeak': offPeak,
                    'directDebitOnly': directDebitOnly,
                    'payOnTimeDiscount': payOnTimeDiscount,
                    'incentive': incentive,
                    'greenPower': greenPower,
                    'coolingOffPeriod': coolingOffPeriod,
                    'eligibilityCriteria': eligibilityCriteria,
                    'fullTermsAndConditions': fullTermsAndConditions,
                    'pricesChanges': pricesChanges,
                    'contractExpiry': contractExpiry,
                    'availToSolarCustomers': availToSolarCustomers,
                    'discount': discountArray,
                    'fee': feeObject
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

}

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
            casper.then(function () {
                this.loadResults(gasHomePostcodeList[cntr], "gas");
            });
        });
    })(current);
    current++;
}
//end parse for gas home
//--------------------------------------------------------------------------------------------------------

//--------------------------------------------------------------------------------------------------------
//start parse for gas small business
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

            this.wait(15000, function() {
                this.sendKeys("#gas-start-date", "8/1/2016");
                this.sendKeys("#gas-end-date", "8/2/2016");
                this.sendKeys("#gas-usage", "50");
                this.click(".profile-btn");
            });

            this.wait(15000, function () {
                //click until more offer button disabled
                this.clickMoreOfferButton();
            });

            moreOfferIndex = 0;
            casper.then(function () {
                this.loadResults(gasSmallBusinessPostcodeList[cntr], "gas");
            });
        });
    })(current);
    current++;
}
//end parse for gas small business
//--------------------------------------------------------------------------------------------------------

//--------------------------------------------------------------------------------------------------------
//start electricity home
current = 0;
end = electricHomePostcodeList.length;
for (;current < end;) {
    (function(cntr) {
        casper.then(function() {
            this.mouse.click("label[for='electricity']");
            this.mouse.click("label[for='home']");
            this.mouse.click("label[for='home-here']");

            this.mouse.click("#select2-retailer-container");
            this.mouse.click("#select2-retailer-results li:nth-child(2)");


            this.sendKeys("input[name='postcode']", casper.page.event.key.Enter , {keepFocus: true});
            this.sendKeys("input[name='postcode']", electricHomePostcodeList[cntr] + "");
            this.click("#postcode-btn");

            this.wait(5000, function() {
                this.click("label[for='energy-concession-no']");
                this.click("label[for='upload-yes']");
            });

            this.wait(5000, function(){
                this.evaluate(function(){
                    $("select#file-provider").select2("val", "agl");
                    $("#uploadFile").val("MyUsageData_06-05-2016.csv");
                });
            });

            this.wait(5000, function(){
                this.page.uploadFile("#data-file-secondary input[name=fileupload]", "./MyUsageData_06-05-2016.csv");
                this.evaluate(function(){
                    $("#data-file-secondary input[name=fileupload]").trigger("fileuploadadd");
                });
            })

            this.wait(100000,function(){
                this.click("#disclaimer_chkbox");
                this.click("#btn-proceed");
            });

            this.wait(100000, function () {
                //click until more offer button disabled
                this.clickMoreOfferButton();
            });

            moreOfferIndex = 0;
            casper.then(function () {
                this.loadResults(electricHomePostcodeList[cntr], "electric");
            });
        });
    })(current);
    current++;
}
//end electricity home
//--------------------------------------------------------------------------------------------------------


//--------------------------------------------------------------------------------------------------------
//start electricity small business
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
                this.page.uploadFile("#data-file-secondary input[name=fileupload]", "./MyUsageData_06-05-2016.csv");
                this.evaluate(function(){
                    $("#data-file-secondary input[name=fileupload]").trigger("fileuploadadd");
                });
            })

            this.wait(100000,function(){
                this.click("#disclaimer_chkbox");
                this.click("#btn-proceed");
            });

            this.wait(100000, function () {
                //click until more offer button disabled
                this.clickMoreOfferButton();
            });

            moreOfferIndex = 0;
            casper.then(function () {
                this.loadResults(electricSmallBusinessPostcodeList[cntr], "electric");
            });
        });
    })(current);
    current++;
}
//end electricity small business
//--------------------------------------------------------------------------------------------------------

casper.then(function () {
    this.saveJSON(offerList);
})
casper.run();