var swiftKey = 'd84c5aeb-f5dc-4a24-8f63-4e56856defb3';
var deliveryUrl = 'https://app.getswift.co/api/v2/deliveries';
var driverUrl = 'https://app.getswift.co/api/v2/drivers?apiKey='+swiftKey+'&filter=OnlineNow';

var swift = {};

swift.listDrivers = function(needle, cb) {
    needle.get(driverUrl, function(error, response) {
        if(!error && response.statusCode == 200) {
          cb(response.body);
        }
    });
}

swift.bookJob = function(rest, data, cb) {

    //pickupTime: "2016-11-30T15:51:34.9962121+00:00"
    if(data.extraHelp == false) {
        data.extraHelp = '1 Man Job';
    } else {
        data.extraHelp = '2 Man Job';
    }



    var dateSplit = data.jobDate.split('-');
    var year = dateSplit[2];
    var month = dateSplit[1];
    var day = dateSplit[0];
    var delItems = [];
    var dropArrKeyMax = data.extraDropObj.length-1;
    if(data.extraDropCount > 0) {
      var dropNotice = ' extra drop offs required, ';
    } else {
      var dropNotice = '';
    }

    for(key in data.extraDropObj) {
      //console.log(data.extraDropObj[key]);
      if(key < 1) {
        delItems.push({"quantity": parseInt(key)+1, "description": 'Door Number: '+data.address.start_location.number+', '+
        'Postcode: '+data.address.start_location.name.formatted_address});
      } else {
        delItems.push({"quantity": parseInt(key)+1, "description": 'Door Number: '+data.extraDropObj[key].doorNumber+', '+
        'Postcode: '+data.extraDropObj[key].postcode.formatted_address});
      }
    }


    /*delItems.push({"quantity": data.itemBoxes[0].qty, "description": 'Small Items'});
    delItems.push({"quantity": data.itemBoxes[1].qty, "description": 'Medium Items'});
    delItems.push({"quantity": data.itemBoxes[2].qty, "description": 'Large Items'});*/


console.log(delItems);
    // ref: day, date, timeslot, price-deposit, porter

    var swiftObj = {
      "apiKey": swiftKey,
      "booking": {
        "reference": data.van+', '+data.jobDate+',('+data.jobStartTime+'),£'+data.estiCalc+','+data.extraHelp,
        "deliveryInstructions": 'Load Time: '+data.loadTimeQty+' mins, '+dropNotice+data.instructions+', '+data.extraHelp,
        "itemsRequirePurchase": false,
        "items": delItems,
        "pickupTime": '20'+year+'-'+month+'-'+day+'T'+data.jobStartTime.split('-')[0],
        "pickupDetail": {
          "name": data.name,
          "phone": data.number,
          "email": data.email,
          //"description": "sample string 4",
          //"addressComponents": "sample string 5",
          "address": data.address.start_location.number+', '+data.address.start_location.name.formatted_address,
          "additionalAddressDetails": {
            //"stateProvince": "sample string 1",
            //"country": "sample string 2",
            //"suburbLocality": "sample string 3",
            //"postcode": "sample string 4",
            "latitude": data.address.start_location.lat,
            "longitude": data.address.start_location.lng
          }
        },
        //"dropoffWindow": {
          //"earliestTime": "2016-11-30T15:51:34.9962121+00:00",
          //"latestTime": "2016-11-30T15:51:34.9962121+00:00"
        //},
        "dropoffDetail": {
          "name": data.name,
          "phone": data.number,
          "email": data.email,
          //"description": "sample string 4",
          //"addressComponents": "sample string 5",
          "address": data.extraDropObj[dropArrKeyMax].doorNumber+', '+data.extraDropObj[dropArrKeyMax].postcode.formatted_address,
          "additionalAddressDetails": {
            //"stateProvince": "sample string 1",
            //"country": "sample string 2",
            //"suburbLocality": "sample string 3",
            //"postcode": "sample string 4",
            "latitude": data.extraDropObj[dropArrKeyMax].lat,
            "longitude": data.extraDropObj[dropArrKeyMax].lng
          }
        },
        "customerFee": data.estiCalc,
        "customerReference": data.email,
        //"tax": 1.0,
        //"taxInclusivePrice": false,
        //"tip": 1.0,
        "driverFeePercentage": 100,
        //"driverMatchCode": "sample string 7",
        //"deliverySequence": 8,
        /*"webhooks": [
          {
            "eventName": "sample string 1",
            "url": "sample string 2"
          },
          {
            "eventName": "sample string 1",
            "url": "sample string 2"
          }
        ]*/
      }
  }


    rest.post(deliveryUrl, {data: swiftObj}).on('complete', function(data, response) {
      //console.log(response);
        cb(response);
    });
}

module.exports = swift;
