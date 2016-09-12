/**
 * Created by binhtd on 12/09/2016.
 */
var gasHomeResult = require("gas-home.json"),
    gasBusinessResult =  require("gas-business.json"),
    electricHomeResult1 = require("electric-home1.json"),
    electricHomeResult2 = require("electric-home2.json"),
    electricBusinessResult1 = require("electric-business1.json"),
    electricBusinessResult2 = require("electric-business2.json"),
    totalDiscountColumn = 0,
    totalEarlyTerminationFee = 0,
    totalDisconnectionFee = 0,
    totalReconnectionFee = 0,
    totalAdditionalFeeInformation = 0,
    totalCreditCardPaymentProcessingFee = 0,
    totalOtherFee = 0,
    totalPaymentProcessingFee = 0,
    totalDirectDebitDishonourPaymentFee = 0,
    totalAccountEstablishmentFee = 0,
    totalChequeDishonourPaymentFee = 0,
    totalConnectionFee = 0,
    total100GreenPower = 0,
    total10GreenPower = 0,
    total20GreenPower = 0,
    total25GreenPower = 0,
    totalLatePaymentFee = 0,
    total50GreenPower = 0,
    resultArray = [gasHomeResult, gasBusinessResult, electricHomeResult1, electricHomeResult2, electricBusinessResult1, electricBusinessResult2];
    utils = require('utils'),
    fs = require('fs'),
    csvHeader = [ "html file name", "post code", "retailer", "offer name", "offer no", "price per year", "price per year include discount", "customer type",
    "fuel type", "distributor", "tariff type", "offer type", "release date", "contract term", "contract expiry eetails",
    "daily supply charge price", "first usage price", "second usage price", "third usage price", "fourth usage price", "fifth usage price", "balance usage price",
    "peak", "shoulder", "off peak", "direct debit only", "pay on time discount", "incentive", "green power", "cooling off period",
    "eligibility criteria", "full terms and conditions", "prices changes", "contract expiry", "avail to solar customers"];

function getTotalDiscountColumn(resultObjectArray, totalDiscountColumn) {
    var totalDiscountColumn = totalDiscountColumn;
    for (var i = 0; i < resultObjectArray.length; i++) {
        if (resultObjectArray[i]["discount"].length > totalDiscountColumn) {
            totalDiscountColumn = resultObjectArray[i]["discount"].length;
        }
    }

    return totalDiscountColumn;
}

function getTotalFeeColumnByColumnName(resultObjectArray, columnName, totalFeeColumnName) {
    var totalColumn = totalFeeColumnName;
    for (var i = 0; i < resultObjectArray.length; i++) {
        if (resultObjectArray[i]["fee"][columnName].length > totalColumn) {
            totalColumn = resultObjectArray[i]["fee"][columnName].length;
        }
    }

    return totalColumn;
}

function feeAddHeaderColumn(csvHeader, columnName, totalRepeatTime){
    for(var i=0; i<totalRepeatTime; i++){
        csvHeader.push(columnName + " description " + (i + 1));
        csvHeader.push(columnName + " value " + (i + 1));
    }

    return csvHeader;
}

function appendElementToEqualMaximumColumn(feeArray, totalColumn){
    for (var k= feeArray.length; k<totalColumn;k++){
        feeArray.push({ "feeDescription": "", "feePercentage": "" });
    }
}

for(var i=0; i<resultArray.length; i++){
    totalDiscountColumn = getTotalDiscountColumn(resultArray[i], totalDiscountColumn);
    totalEarlyTerminationFee = getTotalFeeColumnByColumnName(resultArray[i], "early termination fee", totalEarlyTerminationFee);
    totalDisconnectionFee = getTotalFeeColumnByColumnName(resultArray[i], "disconnection fee", totalDisconnectionFee);
    totalReconnectionFee = getTotalFeeColumnByColumnName(resultArray[i], "reconnection fee", totalReconnectionFee);
    totalAdditionalFeeInformation = getTotalFeeColumnByColumnName(resultArray[i], "additional fee information", totalAdditionalFeeInformation);
    totalCreditCardPaymentProcessingFee = getTotalFeeColumnByColumnName(resultArray[i], "credit card payment processing fee", totalCreditCardPaymentProcessingFee);
    totalOtherFee = getTotalFeeColumnByColumnName(resultArray[i], "other fee", totalOtherFee);
    totalPaymentProcessingFee = getTotalFeeColumnByColumnName(resultArray[i], "payment processing fee", totalPaymentProcessingFee);
    totalDirectDebitDishonourPaymentFee = getTotalFeeColumnByColumnName(resultArray[i], "direct debit dishonour payment fee", totalDirectDebitDishonourPaymentFee);
    totalAccountEstablishmentFee = getTotalFeeColumnByColumnName(resultArray[i], "account establishment fee", totalAccountEstablishmentFee);
    totalChequeDishonourPaymentFee = getTotalFeeColumnByColumnName(resultArray[i], "cheque dishonour payment fee", totalChequeDishonourPaymentFee);
    totalConnectionFee = getTotalFeeColumnByColumnName(resultArray[i], "connection fee", totalConnectionFee);
    total100GreenPower = getTotalFeeColumnByColumnName(resultArray[i], "100% greenpower", total100GreenPower);
    total10GreenPower = getTotalFeeColumnByColumnName(resultArray[i], "10% greenpower", total10GreenPower);
    total20GreenPower = getTotalFeeColumnByColumnName(resultArray[i], "20% greenpower", total20GreenPower);
    total25GreenPower = getTotalFeeColumnByColumnName(resultArray[i], "25% greenpower", total25GreenPower);
    totalLatePaymentFee = getTotalFeeColumnByColumnName(resultArray[i], "late payment fee", totalLatePaymentFee);
    total50GreenPower = getTotalFeeColumnByColumnName(resultArray[i], "50% greenpower", total50GreenPower);
}


for(var i=0; i<totalDiscountColumn; i++){
    csvHeader.push("discount percentage " + (i + 1));
    csvHeader.push("discount description " + (i + 1));
}

csvHeader = feeAddHeaderColumn(csvHeader, "early termination fee", totalEarlyTerminationFee);
csvHeader = feeAddHeaderColumn(csvHeader, "disconnection fee", totalDisconnectionFee);
csvHeader = feeAddHeaderColumn(csvHeader, "reconnection fee", totalReconnectionFee);
csvHeader = feeAddHeaderColumn(csvHeader, "additional fee information", totalAdditionalFeeInformation);
csvHeader = feeAddHeaderColumn(csvHeader, "credit card payment processing fee", totalCreditCardPaymentProcessingFee);
csvHeader = feeAddHeaderColumn(csvHeader, "other fee", totalOtherFee);
csvHeader = feeAddHeaderColumn(csvHeader, "payment processing fee", totalPaymentProcessingFee);
csvHeader = feeAddHeaderColumn(csvHeader, "direct debit dishonour payment fee", totalDirectDebitDishonourPaymentFee);
csvHeader = feeAddHeaderColumn(csvHeader, "account establishment fee", totalAccountEstablishmentFee);
csvHeader = feeAddHeaderColumn(csvHeader, "cheque dishonour payment fee", totalChequeDishonourPaymentFee);
csvHeader = feeAddHeaderColumn(csvHeader, "connection fee", totalConnectionFee);
csvHeader = feeAddHeaderColumn(csvHeader, "100% greenpower", total100GreenPower);
csvHeader = feeAddHeaderColumn(csvHeader, "10% greenpower", total10GreenPower);
csvHeader = feeAddHeaderColumn(csvHeader, "20% greenpower", total20GreenPower);
csvHeader = feeAddHeaderColumn(csvHeader, "25% greenpower", total25GreenPower);
csvHeader = feeAddHeaderColumn(csvHeader, "late payment fee", totalLatePaymentFee);
csvHeader = feeAddHeaderColumn(csvHeader, "50% greenpower", total50GreenPower);

for(var i=0; i<resultArray.length; i++){
    for (var j=0; j< resultArray[i].length; j++){

        for (var k= resultArray[i][j]["discount"].length; k<totalDiscountColumn;k++){
            resultArray[i][j]["discount"].push({
                "discountPercentage": "",
                "discountDescription": ""
            });
        }

        appendElementToEqualMaximumColumn(resultArray[i][j]["fee"]["early termination fee"], totalEarlyTerminationFee)
        appendElementToEqualMaximumColumn(resultArray[i][j]["fee"]["disconnection fee"], totalDisconnectionFee);
        appendElementToEqualMaximumColumn(resultArray[i][j]["fee"]["reconnection fee"], totalReconnectionFee);
        appendElementToEqualMaximumColumn(resultArray[i][j]["fee"]["additional fee information"], totalAdditionalFeeInformation);
        appendElementToEqualMaximumColumn(resultArray[i][j]["fee"]["credit card payment processing fee"], totalCreditCardPaymentProcessingFee);
        appendElementToEqualMaximumColumn(resultArray[i][j]["fee"]["other fee"], totalOtherFee);
        appendElementToEqualMaximumColumn(resultArray[i][j]["fee"]["payment processing fee"], totalPaymentProcessingFee);
        appendElementToEqualMaximumColumn(resultArray[i][j]["fee"]["direct debit dishonour payment fee"], totalDirectDebitDishonourPaymentFee);
        appendElementToEqualMaximumColumn(resultArray[i][j]["fee"]["account establishment fee"], totalAccountEstablishmentFee);
        appendElementToEqualMaximumColumn(resultArray[i][j]["fee"]["cheque dishonour payment fee"], totalChequeDishonourPaymentFee);
        appendElementToEqualMaximumColumn(resultArray[i][j]["fee"]["connection fee"], totalConnectionFee);
        appendElementToEqualMaximumColumn(resultArray[i][j]["fee"]["100% greenpower"], total100GreenPower);
        appendElementToEqualMaximumColumn(resultArray[i][j]["fee"]["10% greenpower"], total10GreenPower);
        appendElementToEqualMaximumColumn(resultArray[i][j]["fee"]["20% greenpower"], total20GreenPower);
        appendElementToEqualMaximumColumn(resultArray[i][j]["fee"]["25% greenpower"], total25GreenPower);
        appendElementToEqualMaximumColumn(resultArray[i][j]["fee"]["late payment fee"], totalLatePaymentFee);
        appendElementToEqualMaximumColumn(resultArray[i][j]["fee"]["50% greenpower"], total50GreenPower);
    }
}

var str = csvHeader.join("#") + "\n", line = "", feeObject = {};
for(var i=0; i<resultArray.length; i++){
    for (var j=0; j<resultArray[i].length; j++ ){
        line = "";

        line += resultArray[i][j]["htmlFileName"] + "#" + resultArray[i][j]["postCode"] + "#" + resultArray[i][j]["retailer"] + "#" +
                resultArray[i][j]["offerName"] + "#" + resultArray[i][j]["offerNo"] + "#" + resultArray[i][j]["pricePerYear"] + "#" +
                resultArray[i][j]["pricePerYearIncludeDiscount"] + "#" + resultArray[i][j]["customerType"] + "#" + resultArray[i][j]["fuelType"] + "#" +
                resultArray[i][j]["distributor"] + "#" + resultArray[i][j]["tariffType"] + "#" + resultArray[i][j]["offerType"] + "#" +
                resultArray[i][j]["releaseDate"] + "#" + resultArray[i][j]["contractTerm"] + "#" + resultArray[i][j]["contractExpiryDetails"] + "#" +
                resultArray[i][j]["dailySupplyChargePrice"] + "#" + resultArray[i][j]["firstUsagePrice"] + "#" + resultArray[i][j]["secondUsagePrice"] + "#" +
                resultArray[i][j]["thirdUsagePrice"] + "#" + resultArray[i][j]["fourthUsagePrice"] + "#" + resultArray[i][j]["fifthUsagePrice"] + "#" +
                resultArray[i][j]["balanceUsagePrice"] + "#" + resultArray[i][j]["peak"] + "#" + resultArray[i][j]["shoulder"] + "#" +
                resultArray[i][j]["offPeak"] + "#" + resultArray[i][j]["directDebitOnly"] + "#" + resultArray[i][j]["payOnTimeDiscount"] + "#" +
                resultArray[i][j]["incentive"] + "#" + resultArray[i][j]["greenPower"] + "#" + resultArray[i][j]["coolingOffPeriod"] + "#" +
                resultArray[i][j]["eligibilityCriteria"] + "#" + resultArray[i][j]["fullTermsAndConditions"] + "#" +
                resultArray[i][j]["pricesChanges"] + "#" + resultArray[i][j]["contractExpiry"] + "#" + resultArray[i][j]["availToSolarCustomers"] + "#";

        for(var k=0; k<resultArray[i][j]["discount"].length; k++){
            line += resultArray[i][j]["discount"][k]["discountPercentage"] + "#" + resultArray[i][j]["discount"][k]["discountDescription"] + "#"
        }

        for(var k=0; k<resultArray[i][j]["fee"]["early termination fee"].length; k++){
            line += resultArray[i][j]["fee"]["early termination fee"][k]["feeDescription"] + "#" + resultArray[i][j]["fee"]["early termination fee"][k]["feePercentage"] + "#"
        }

        for(var k=0; k<resultArray[i][j]["fee"]["disconnection fee"].length; k++){
            line += resultArray[i][j]["fee"]["disconnection fee"][k]["feeDescription"] + "#" + resultArray[i][j]["fee"]["disconnection fee"][k]["feePercentage"] + "#"
        }

        for(var k=0; k<resultArray[i][j]["fee"]["reconnection fee"].length; k++){
            line += resultArray[i][j]["fee"]["reconnection fee"][k]["feeDescription"] + "#" + resultArray[i][j]["fee"]["reconnection fee"][k]["feePercentage"] + "#"
        }

        for(var k=0; k<resultArray[i][j]["fee"]["additional fee information"].length; k++){
            line += resultArray[i][j]["fee"]["additional fee information"][k]["feeDescription"] + "#" + resultArray[i][j]["fee"]["additional fee information"][k]["feePercentage"] + "#"
        }

        for(var k=0; k<resultArray[i][j]["fee"]["credit card payment processing fee"].length; k++){
            line += resultArray[i][j]["fee"]["credit card payment processing fee"][k]["feeDescription"] + "#" + resultArray[i][j]["fee"]["credit card payment processing fee"][k]["feePercentage"] + "#"
        }

        for(var k=0; k<resultArray[i][j]["fee"]["other fee"].length; k++){
            line += resultArray[i][j]["fee"]["other fee"][k]["feeDescription"] + "#" + resultArray[i][j]["fee"]["other fee"][k]["feePercentage"] + "#"
        }

        for(var k=0; k<resultArray[i][j]["fee"]["payment processing fee"].length; k++){
            line += resultArray[i][j]["fee"]["payment processing fee"][k]["feeDescription"] + "#" + resultArray[i][j]["fee"]["payment processing fee"][k]["feePercentage"] + "#"
        }

        for(var k=0; k<resultArray[i][j]["fee"]["direct debit dishonour payment fee"].length; k++){
            line += resultArray[i][j]["fee"]["direct debit dishonour payment fee"][k]["feeDescription"] + "#" + resultArray[i][j]["fee"]["direct debit dishonour payment fee"][k]["feePercentage"] + "#"
        }

        for(var k=0; k<resultArray[i][j]["fee"]["account establishment fee"].length; k++){
            line += resultArray[i][j]["fee"]["account establishment fee"][k]["feeDescription"] + "#" + resultArray[i][j]["fee"]["account establishment fee"][k]["feePercentage"] + "#"
        }

        for(var k=0; k<resultArray[i][j]["fee"]["cheque dishonour payment fee"].length; k++){
            line += resultArray[i][j]["fee"]["cheque dishonour payment fee"][k]["feeDescription"] + "#" + resultArray[i][j]["fee"]["cheque dishonour payment fee"][k]["feePercentage"] + "#"
        }

        for(var k=0; k<resultArray[i][j]["fee"]["connection fee"].length; k++){
            line += resultArray[i][j]["fee"]["connection fee"][k]["feeDescription"] + "#" + resultArray[i][j]["fee"]["connection fee"][k]["feePercentage"] + "#"
        }

        for(var k=0; k<resultArray[i][j]["fee"]["100% greenpower"].length; k++){
            line += resultArray[i][j]["fee"]["100% greenpower"][k]["feeDescription"] + "#" + resultArray[i][j]["fee"]["100% greenpower"][k]["feePercentage"] + "#"
        }

        for(var k=0; k<resultArray[i][j]["fee"]["10% greenpower"].length; k++){
            line += resultArray[i][j]["fee"]["10% greenpower"][k]["feeDescription"] + "#" + resultArray[i][j]["fee"]["10% greenpower"][k]["feePercentage"] + "#"
        }

        for(var k=0; k<resultArray[i][j]["fee"]["20% greenpower"].length; k++){
            line += resultArray[i][j]["fee"]["20% greenpower"][k]["feeDescription"] + "#" + resultArray[i][j]["fee"]["20% greenpower"][k]["feePercentage"] + "#"
        }

        for(var k=0; k<resultArray[i][j]["fee"]["25% greenpower"].length; k++){
            line += resultArray[i][j]["fee"]["25% greenpower"][k]["feeDescription"] + "#" + resultArray[i][j]["fee"]["25% greenpower"][k]["feePercentage"] + "#"
        }

        for(var k=0; k<resultArray[i][j]["fee"]["late payment fee"].length; k++){
            line += resultArray[i][j]["fee"]["late payment fee"][k]["feeDescription"] + "#" + resultArray[i][j]["fee"]["late payment fee"][k]["feePercentage"] + "#"
        }

        for(var k=0; k<resultArray[i][j]["fee"]["50% greenpower"].length; k++){
            line += resultArray[i][j]["fee"]["50% greenpower"][k]["feeDescription"] + "#" + resultArray[i][j]["fee"]["50% greenpower"][k]["feePercentage"] + "#"
        }

        line.slice(0,line.length -1);
        str += line + "\n";
    }
}

fs.write('csv/parse_result.csv', str, 'w');
phantom.exit();