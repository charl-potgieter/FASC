/* ----------------------------------------------------------------------------------------------------------------
/
/     Data object is an array of key / value pair objects
/     1 array = 1 data row
/     each row is an object of key value pairs with the key being the column header
/
 ------------------------------------------------------------------------------------------------------------------ */


var objData = function() {

  var self = this;
  
  self.dataArray = [];
  

  /*--------------------------------------------------------------------------------------------------------------
  /  Reads block of data from sht starting in cell A1
  ---------------------------------------------------------------------------------------------------------------*/

  self.readDataFromSheet  = function(sht){
     
    // Read data on sheet into an 2-D array
    var arr = sht.getDataRange().getValues();
     
    // Get header and remove header from array (automatically done by shift)
    var headers = arr.shift();
    
    //filter out blank rows
    arr = arr.filter(function(value){
      return arrayContainsData(value);
    });
    
    
    // map data into an array of key value pairs
    self.dataArray = arr.map(function(dataRow){
      
      //reduce each row of data to key-value pairs where the headers per 1st row of spreadsheet are the key
      var keyValuePairs  = dataRow.reduce(function(accumulator, currentValue, index){
        accumulator[headers[index]] = currentValue;
        return accumulator;
      }, {})  
        
        return keyValuePairs;
    });
   
  
  };
  
  
  
  /*--------------------------------------------------------------------------------------------------------------
  /  Writes data object to sht
  /  Any data existing data will be overwritten
  ---------------------------------------------------------------------------------------------------------------*/
  
  
  self.writeDataToSheet = function(sht){

    // Increase sheet size if required and clear sheet contents
    var rowsRequired = self.dataArray.length + 1;
    var columnsRequired = Object.keys(self.dataArray[0]).length;
    if (rowsRequired > sht.getMaxRows()){sht.insertRows(1, (rowsRequired - sht.getMaxRows()))};
    if (columnsRequired > sht.getMaxColumns()){sht.insertColumns(1, (columnsRequired - sht.getMaxColumns()))};
  
  
    //Write headers to first row
    var headers = [Object.keys(self.dataArray[0])];
    sht.getRange(1, 1, 1, headers[0].length).setValues(headers);
  
    //Get data as an 2D array of arrays
    var data = self.dataArray.map(function(keyValuePair){
      var arrDataRow = []
      for (var key in keyValuePair){
        arrDataRow.push(keyValuePair[key]);
        }
      return arrDataRow;
      });
    
    
     //Write data to spreadsheet
     sht.getRange(2, 1, data.length, data[0].length).setValues(data);
    
  
  };
  
  
  /*--------------------------------------------------------------------------------------------------------------
  /  Return data headers as an array
  ---------------------------------------------------------------------------------------------------------------*/
  
  self.headers = function() {
  
    var dataHeaders = [];
    var firstDataRow = self.dataArray[0];
    
    
    for (var key in firstDataRow) {
      if (firstDataRow.hasOwnProperty(key)) {
          dataHeaders.push(key);
      };
    };
  
    return dataHeaders;
  
  };
  

};

