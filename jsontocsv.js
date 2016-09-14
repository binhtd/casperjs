/**
 * Created by binhtd on 12/09/2016.
 */
var parseResult = require("json/parse_result.json"),
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
    resultArray = [parseResult];
    utils = require('utils'),
    fs = require('fs'),
    csvHeader = [ "HTML file name", "Postcode", "Retailer", "Offer Name", "Offer No.", "Customer type",
    "Fuel type", "Distributor(s)", "Tariff type", "Offer type", "Release Date", "Contract term", "Contract expiry details",
    "Daily supply charge Price (exc. GST)", "First usage Price (exc. GST)", "Second usage Price (exc. GST)", "Third Usage Price (exc. GST)", "Fourth Uage Price (exc. GST)",
    "Fifth Usage Price (exc. GST)", "Balance Usage Price", "Peak", "Shoulder", "Off Peak", "Direct debit only", "Pay on time discount", "Incentive", "Green power", "Cooling off period",
    "Eligibility criteria", "Full terms and conditions", "Prices changes", "Contract expiry", "Avail to solar customers"];

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

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function feeAddHeaderColumn(csvHeader, columnName, totalRepeatTime){
    for(var i=0; i<totalRepeatTime; i++){
        csvHeader.push(capitalizeFirstLetter(columnName) + " description " + (i + 1));
        csvHeader.push(capitalizeFirstLetter(columnName) + " value " + (i + 1));
    }

    return csvHeader;
}

function appendElementToEqualMaximumColumn(feeArray, totalColumn){
    for (var k= feeArray.length; k<totalColumn;k++){
        feeArray.push({ "feeDescription": "", "feePercentage": "" });
    }
}

function getFeeRowLine(rowData){
    var line = "";
    for(var k=0; k<rowData.length; k++){
        line += rowData[k]["feeDescription"] + "#" + rowData[k]["feePercentage"] + "#"
    }

    return line;
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
    csvHeader.push("Discount percentage " + (i + 1));
    csvHeader.push("Discount description " + (i + 1));
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

var str = csvHeader.join("#") + "\n",
    line = "",
    feeArrayHeaderTitle = ["early termination fee", "disconnection fee", "reconnection fee", "additional fee information", "credit card payment processing fee", "other fee", "payment processing fee", "direct debit dishonour payment fee",
        "account establishment fee", "cheque dishonour payment fee", "connection fee", "100% greenpower", "10% greenpower", "20% greenpower", "25% greenpower", "late payment fee", "50% greenpower"];
for(var i=0; i<resultArray.length; i++){
    for (var j=0; j<resultArray[i].length; j++ ){
        line = "";

        line += resultArray[i][j]["htmlFileName"] + "#" + resultArray[i][j]["postCode"] + "#" + resultArray[i][j]["retailer"] + "#" +
                resultArray[i][j]["offerName"] + "#" + resultArray[i][j]["offerNo"] + "#" + resultArray[i][j]["customerType"] + "#" + resultArray[i][j]["fuelType"] + "#" +
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
            line += resultArray[i][j]["discount"][k]["discountPercentage"] + "#" + resultArray[i][j]["discount"][k]["discountDescription"] + "#";
        }

        for (var k=0; k< feeArrayHeaderTitle.length; k++){
            line += getFeeRowLine(resultArray[i][j]["fee"][feeArrayHeaderTitle[k]]);
        }

        line.slice(0,line.length -1);
        str += line + "\n";
    }
}

fs.write('csv/parse_result.csv', str, 'w');
phantom.exit();