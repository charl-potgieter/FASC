/*--------------------------------------------------------------------------------------------------------------
/ Returns unique items in array - maybe get rid of above Array.prototype
/ This function only works for simple values (wont work to on an array of arrays for example)
/ Adapted from here : https://medium.com/front-end-hacking/getting-unique-values-in-javascript-arrays-17063080f836
--------------------------------------------------------------------------------------------------------------- */

function uniqueArrayOfValues(arr){

  var uniqueValues = arr.filter(function(value, index, self){
    return self.indexOf(value) === index;
  });
    
 return uniqueValues;
 
};



/*--------------------------------------------------------------------------------------------------------------
/ Delete sheet shtName sheet if it exists
---------------------------------------------------------------------------------------------------------------*/

function deleteSheet(shtName){

  ss = SpreadsheetApp.getActiveSpreadsheet();

  if (ss.getSheetByName(shtName) != null){
    ss.deleteSheet(ss.getSheetByName(shtName))
  }; 

};





/*--------------------------------------------------------------------------------------------------------------
/ Returns an array of sheet names
---------------------------------------------------------------------------------------------------------------*/

function sheetNames() {

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var shts = ss.getSheets();
  
  var shtnames = shts.map(function(value){
    return value.getSheetName();
  });
 
 return shtnames;
  
};


/*--------------------------------------------------------------------------------------------------------------
/ Returns true if sheet name exists, otherwise false
---------------------------------------------------------------------------------------------------------------*/

function sheetExists(shtName){

  if (sheetNames().indexOf(shtName) === -1) {
    return false;
  } else {
    return true;
  };
  
};



/*--------------------------------------------------------------------------------------------------------------
/ Returns true if array contains data otherwise false
---------------------------------------------------------------------------------------------------------------*/

function arrayContainsData(arr){

  var containsData = false;
  
  arr.map(function(value){
    if (value !== '') {
      containsData = true
    };
  });
  
  return containsData;

};



/*--------------------------------------------------------------------------------------------------------------
/ Converts string in Firstname<space>Surname format into Surname, Firstname
---------------------------------------------------------------------------------------------------------------*/

function convertProperNametoSurnameCommmaFirstName(properName){
  
  var positionOfSpace = properName.search(' ');
  var firstName = properName.substring(0, positionOfSpace);
  var surname = properName.substring(positionOfSpace+1, properName.length);
  
  return (surname + ', ' + firstName);
  
};
