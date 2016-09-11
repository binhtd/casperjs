/**
 * Created by binhtd on 26/08/2016.
 */

var x = require('casper').selectXPath,
    fs = require('fs'),
    utils = require('utils'),
    url = 'https://compare.switchon.vic.gov.au',
    offerList = [],

    gasHomePostcodeList = [3011, 3953, 3179, 3141, 3199],
    gasSmallBusinessPostcodeList = [3011, 3953, 3179, 3141, 3199],
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
    conditionalDiscount2 = "", conditionalDiscount2Percentage = "", conditionalDiscount2Applicableto = "",
    directDebitOnly = "", payOnTimeDiscount = "", incentive = "", greenPower = "", coolingOffPeriod = "", eligibilityCriteria = "", fullTermsAndConditions = "",
    pricesChanges = "", contractExpiry = "", availToSolarCustomers = "", discountArray = [], feeObject = {}, pricePerYear = "",
    pricePerYearIncludeDiscount = "";


var casper = require("casper").create({
    verbose: true,
    logLevel: "debug",
    waitTimeout: 300000000,
    stepTimeout: 300000000,
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

casper.getRandomInt = function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}


casper.formatString = function (containBetweenHtmlTag) {
    containBetweenHtmlTag = containBetweenHtmlTag.replace(/(\r\n|\n|\r)/gm, "");
    containBetweenHtmlTag = containBetweenHtmlTag.replace(/\s+/gm, " ");
    containBetweenHtmlTag = containBetweenHtmlTag.trim();

    return containBetweenHtmlTag;
};

casper.stripHtmlTag = function(str){
    return body.replace(/(<([^>]+)>)/ig, "");
};

casper.formatParagraphInsideFeeSection = function(str){
    var contentInsideEachParagraph = "";

    contentInsideEachParagraph = str.replace(/(\r\n|\n|\r)/gm, "");
    contentInsideEachParagraph = contentInsideEachParagraph.replace(/\s+/gm, " ");
    contentInsideEachParagraph = contentInsideEachParagraph.trim();
    contentInsideEachParagraph = contentInsideEachParagraph.replace(/(<([^>]+)>)/ig, "");

    return contentInsideEachParagraph;
}

casper.getFeeDiscountAmount = function(str){
    var feePercentageArray =  str.match(/(\$?\d+%?)/);

    return utils.isArray(feePercentageArray) && !utils.isNull(feePercentageArray[1]) ? feePercentageArray[1] : str;
}

casper.clickMoreOfferButton = function () {
    if (!casper.exists(x("//*/button[@class='btn more-offer-btn more-offer-btn-txt'][@disabled]"))) {
        casper.click(".more-offer-btn");
        casper.wait(1000, casper.clickMoreOfferButton);
    }
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
            if (utils.isArray(discountPercentageArray) && !utils.isNull(discountPercentageArray[1])) {
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
        contentInsideEachParagraph = "",
        feeIndex = 0,
        feeTitleHeaders = ["early termination fee", "disconnection fee", "reconnection fee", "additional fee information", "credit card payment processing fee",
            "other fee", "payment processing fee", "direct debit dishonour payment fee", "account establishment fee", "cheque dishonour payment fee", "connection fee",
            "100% greenpower", "10% greenpower", "20% greenpower", "25% greenpower", "late payment fee", "50% greenpower"],
        feeTitleHeaderContainOnlyDescription = ["additional fee information", "100% greenpower", "10% greenpower", "20% greenpower", "25% greenpower", "50% greenpower"],
        feeResultset = {
            "early termination fee":[],
            "disconnection fee": [],
            "reconnection fee": [],
            "additional fee information": [],
            "credit card payment processing fee": [],
            "other fee": [],
            "payment processing fee": [],
            "direct debit dishonour payment fee": [],
            "account establishment fee": [],
            "cheque dishonour payment fee": [],
            "connection fee": [],
            "100% greenpower": [],
            "10% greenpower": [],
            "20% greenpower": [],
            "25% greenpower": [],
            "late payment fee": [],
            "50% greenpower": []
        }, feeRecord = {};

    while (feeIndex < feeElements.length) {
        feeRecord = {"feeDescription" : "", "feePercentage" : ""};
        contentInsideEachParagraph = this.formatParagraphInsideFeeSection(feeElements[feeIndex]["text"]);

        if (feeTitleHeaders.toString().toLowerCase().indexOf(contentInsideEachParagraph.toLowerCase()) > 0){

            if ((feeIndex < feeElements.length -1) && (feeTitleHeaders.toString().toLowerCase().indexOf(this.formatParagraphInsideFeeSection(feeElements[feeIndex + 1]["text"])) < 0)){
                feeRecord["feeDescription"] = this.formatString( feeElements[feeIndex + 1]["text"]);
                feeIndex++;
            }

            if ( (feeIndex < feeElements.length -1) && (feeTitleHeaders.toString().toLowerCase().indexOf(this.formatParagraphInsideFeeSection(feeElements[feeIndex + 1]["text"])) < 0)){
                feeRecord["feePercentage"] = this.formatString( feeElements[feeIndex + 1]["text"]);
                feeIndex++;
                feeRecord["feePercentage"] = this.getFeeDiscountAmount(feeRecord["feePercentage"]);
            }

            if ((feeIndex < feeElements.length) && !/^(\$?[\d\.,]+%?)$/.test(feeRecord["feePercentage"])){
                feeRecord["feePercentage"] = this.getFeeDiscountAmount(feeRecord["feeDescription"]);
            }

            if ( (feeTitleHeaderContainOnlyDescription.toString().toLowerCase().indexOf(contentInsideEachParagraph.toLowerCase()) > 0) ||
                !/^(\$?[\d\.,]+%?)$/.test(feeRecord["feePercentage"])){
                feeRecord["feePercentage"] = "";
            }

            feeResultset[contentInsideEachParagraph.toLowerCase()].push(feeRecord);
        }
        feeIndex++;
    }

    return feeResultset;
}

casper.loadResults = function (postCodeValue, fuelTypeValue, typeBusiness) {
    var linkCount = this.getElementsInfo("ul.offer-list div.retailer-details a").length;
    this.repeat(linkCount, function () {
        try {
            // opens modal popup
            this.evaluate(function (index) {
                $("ul.offer-list div.retailer-details a")[index].click();
            }, moreOfferIndex);

            this.wait(5000, function () {
                var htmlFileName = '',
                    pricePerYearIncludeDiscountElement = this.getElementInfo(x("//*/div[@class='col-md-4']/div[@class='row section-separator-bottom']/p[contains(text(),'With conditional discounts')]/strong"));

                postCode = postCodeValue;
                retailer = this.exists("div.offerModalEmail div.col-md-8 h1") ? this.formatString(this.fetchText("div.offerModalEmail div.col-md-8 h1")) : "";
                offerName = this.exists("div.offerModalEmail div.col-md-8 span.HelveticaNeueLTStd-UltLt-Offer") ?
                    this.formatString(this.fetchText("div.offerModalEmail div.col-md-8 span.HelveticaNeueLTStd-UltLt-Offer")) : "";

                if (this.fetchText("div.offerModalEmail table.offer-detail-table tr:nth-child(1) td:nth-child(1)") == "Offer ID:") {
                    offerNo = this.formatString(this.fetchText("div.offerModalEmail table.offer-detail-table tr:nth-child(1) td:nth-child(2)"));
                }
                pricePerYear =  this.formatString(this.fetchText("span.currency-value"));
                pricePerYearIncludeDiscount = utils.isArray(pricePerYearIncludeDiscountElement) ? this.formatString(pricePerYearIncludeDiscountElement["text"]):"";

                htmlFileName = fuelTypeValue + '-' + typeBusiness+'-'  + postCodeValue + '-' + offerNo + '-' + this.getRandomInt(500000, 1200000);
                fs.write('html/' +  htmlFileName + '.html', this.getPageContent(), 'w');

                utils.dump("fuelType:"  + fuelTypeValue + ", typeBusiness:" + typeBusiness +", postCode :" + postCode + ", offerNo:" + offerNo + "");

                if (this.fetchText("div.offerModalEmail table.offer-detail-table tr:nth-child(2) td:nth-child(1)") == "Customer type:") {
                    customerType = this.formatString(this.fetchText("div.offerModalEmail table.offer-detail-table tr:nth-child(2) td:nth-child(2)"));
                }
                fuelType = fuelTypeValue;

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
                    'htmlFileName': htmlFileName,
                    'postCode': postCode,
                    'retailer': retailer,
                    'offerName': offerName,
                    'offerNo': offerNo,
                    'pricePerYear': pricePerYear,
                    'pricePerYearIncludeDiscount': pricePerYearIncludeDiscount,
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
                    'fourthUsagePrice': fourthUagePrice,
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

casper.uploadFileUntilSuccessful = function(){

    if (!this.visible("#disclaimer_chkbox")){
        this.page.uploadFile("#data-file-secondary input[name=fileupload]", "./MyUsageData_06-05-2016.csv");
        this.evaluate(function(){
            $("#data-file-secondary input[name=fileupload]").trigger("fileuploadadd");
        });

        this.waitForText("File was successfully uploaded",function(){
            casper.uploadFileUntilSuccessful();
        });

    }
};

casper.start();

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

//--------------------------------------------------------------------------------------------------------
//start electricity home
casper.thenOpen(url, function(){
    phantom.clearCookies();
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
                        this.loadResults(electricHomePostcodeList[cntr], "electric", "home");
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
//end electricity home
//--------------------------------------------------------------------------------------------------------

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
    this.saveJSON(offerList);
})
casper.run();