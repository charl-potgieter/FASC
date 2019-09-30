/*******************************************************************************************************************
/
/       Handles all reading and writing to / from the spreadsheet
/
/*******************************************************************************************************************/



/*--------------------------------------------------------------------------------------------------------------
/  Returns a populated SwimEvents object utilising data on tab EventDetails
---------------------------------------------------------------------------------------------------------------*/

function getSwimEvents() {
  
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var swimEventData = new objData;
  var swimEvent = new objSwimEvent;
  var swimEvents = new objSwimEvents;
  
  swimEventData.readDataFromSheet(ss.getSheetByName('EventDetails'));
  
  //Read rego headers to check if swim is being swum today
  var swimmerRegoHeaders = ss.getSheetByName('SwimmerRego').getRange('1:1').getValues()[0];
  

  //Create an object of all swim events
  swimEventData.dataArray.map(function(value){
    swimEvent = new objSwimEvent(value['Swim Code']);
    swimEvent.mastersSwimSeperately = value['Masters Swim Separately'];
    swimEvents.addSwimEvent(swimEvent);
    
    //Test if swim code is being swum today by checking if it exists in first row of swimmerRego tab
    swimEvent.swimmingToday = swimmerRegoHeaders.indexOf(value['Swim Code']) !== -1;
  });
  
  return swimEvents;

};




/*--------------------------------------------------------------------------------------------------------------
/  Returns a populated Swimmers object utilising data on tab SwimmerDetails
---------------------------------------------------------------------------------------------------------------*/


function getSwimmers() {
  
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var swimmerData = new objData;
  var swimmer = new objSwimmer;
  var swimmers = new objSwimmers;
  var surnameFirstName;
  
  swimmerData.readDataFromSheet(ss.getSheetByName('SwimmerRego'));

  //Create an object of all swimmers
  swimmerData.dataArray.map(function(value){
   surnameFirstName = value['Surname, First Name'];
   swimmer = new objSwimmer(surnameFirstName);
   swimmer.category = value['Category'];
   swimmers.addSwimmer(swimmer);
  });
  
  
  
  return swimmers;

};





/*--------------------------------------------------------------------------------------------------------------
/  Returns a populated Swims object utilising data on tab Rego
---------------------------------------------------------------------------------------------------------------*/

function getRegoSwims(swimEvents){

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var regoData = new objData;
  var swim  = new objSwim;
  var swims  = new objSwims;


  regoData.readDataFromSheet(ss.getSheetByName('SwimmerRego'));

  //regoSwimCodes = headers per SwimmerRego tab excluding first 4 field names (swimmer name, category and date of birth and age)
  var regoSwimCodes = regoData.headers().slice(4);

  // Get rego swims  based on data on tab SwimmerRego
  regoData.dataArray.map(function(value){
    regoSwimCodes.map(function(value2){
      if (value[value2] !== '') {
        swim  = new objSwim;
        swim.surnameFirstName = value['Surname, First Name'];
        swim.swimEvent = swimEvents.getSwimEvent(value2);
        swims.addSwim(swim);
      };
    });
    
  });

  return swims;
  
};










/*--------------------------------------------------------------------------------------------------------------
/  Adds base times (as recorded in Base Times sheet) to swimmer objects in Swimmers
---------------------------------------------------------------------------------------------------------------*/

function addStoredBaseTimesToSwimmers(swimmers, swimEvents){

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var baseTimeData = new objData;
  
  baseTimeData.readDataFromSheet(ss.getSheetByName('BaseTimes'));
  baseTimeData.dataArray.map(function(value){
    Logger.log(value['Surname, First Name']);
    swimmers.getSwimmer(value['Surname, First Name']).baseTimes[value['Swim Code']] = value['BaseTime'];
  });
  
  
  //Set base times  = TT where no times have been recorded
  swimmers.arrayOfSwimmers.map(function(value){
    swimEvents.arrayOfSwimEvents.map(function(value2){
      if (typeof value.baseTimes[value2.swimCode] === 'undefined') {
        value.baseTimes[value2.swimCode] = 'TT';
      };
    });
  });

  
};



/*--------------------------------------------------------------------------------------------------------------
/  Gets number of pool lanes available (from sheet SundryInputs)
---------------------------------------------------------------------------------------------------------------*/

function numberOfPoolLanes(){

  return SpreadsheetApp.getActiveSpreadsheet().getSheetByName('SundryInputs').getRange('NumberOfLanes').getValue()

};



/*--------------------------------------------------------------------------------------------------------------
/  Gets date of current swim (from sheet SundryInputs)
---------------------------------------------------------------------------------------------------------------*/

function dateOfTodaysSwim(){

  return SpreadsheetApp.getActiveSpreadsheet().getSheetByName('SundryInputs').getRange('DateOfSwim').getValue()

};



/*--------------------------------------------------------------------------------------------------------------
/  Writes heats to the spreadsheet
/  If parameter singleSheetWrite is set to true the heats are all written to one sheet
/  Otherwise one sheet per swimCode / ageGroup combo
---------------------------------------------------------------------------------------------------------------*/

function writeHeatsToSheet(heats, singleSheetWrite){

  var i;
  var j;
  var row;
  var heat;
  var MAX_LANES_IN_POOL = 8;    //this is simply for printing purposes unlike value on sudry inputs tab which restricts swimmer per heat)
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var handicap;
  var shtOutputName;
  var shtOutput;
  var insertSheetAt = 0;
  var swimDate = dateOfTodaysSwim();

  
  for (i = 1; i <= heats.numberOfHeats; i++) {
    
    //Get heat details and assign / create sheet for given heat
    heat  = heats.heatArray[i-1];
    
    switch(true) {
      case singleSheetWrite:
        shtOutputName = 'All';
        break;
      case heat.ageGroup === 'Masters' :
        shtOutputName = 'M' + heat.swimCode;
        break;
      default:
        shtOutputName = heat.swimCode;
    };
    
    
    
    if (!sheetExists('Heat_' + shtOutputName)) {
      row = 1;
      shtOutput =  ss.insertSheet(insertSheetAt);
      insertSheetAt++;
      shtOutput.setName('Heat_' + shtOutputName);
      setHeatSheetFormatting(shtOutput);
    };
      
    
    // Write heat header details for each lane
    writeHeatHeader(shtOutput, row);
    row++;
    for (j = 1; j <= MAX_LANES_IN_POOL; j++) {
      shtOutput.getRange(row, 1).setValue(swimDate);
      shtOutput.getRange(row, 2).setValue(heat.swimCode);
      shtOutput.getRange(row, 3).setValue(heat.ageGroup);
      shtOutput.getRange(row, 4).setValue(i);
      shtOutput.getRange(row, 5).setValue(j);
      if (j <= heat.numberOfSwimmers()) {
       shtOutput.getRange(row, 6).setValue(heat.arrayOfSwimmers[j-1].surnameFirstName);
       shtOutput.getRange(row, 7).setValue(heat.arrayOfSwimmers[j-1].baseTimes[heat.swimCode]);
       if (heat.arrayOfSwimmers[j-1].baseTimes[heat.swimCode] === 'TT') {
         handicap = 0;
       } else {
         handicap = heat.slowestHeatTime() - heat.arrayOfSwimmers[j-1].baseTimes[heat.swimCode];
       };
       shtOutput.getRange(row, 8).setValue(handicap);
      };
      row++;
    };   
   row++;
  }; 
    
};



/*--------------------------------------------------------------------------------------------------------------
/  Writes heat headers in given row and sheet
---------------------------------------------------------------------------------------------------------------*/

function writeHeatHeader(sht, row){

  var lastCol = sht.getMaxColumns()
  sht.getRange(row, 1).setValue('Date');
  sht.getRange(row, 2).setValue('Swim Code');
  sht.getRange(row, 3).setValue('Age Category');
  sht.getRange(row, 4).setValue('Heat');
  sht.getRange(row, 5).setValue('Lane');
  sht.getRange(row, 6).setValue('Surname, First Name');
  sht.getRange(row, 7).setValue('Base time');
  sht.getRange(row, 8).setValue('Go at');
  sht.getRange(row, 9).setValue('Place');
  sht.getRange(row, 10).setValue('Time Gross');
  sht.getRange(row, 1, 1, lastCol).setFontWeight('bold');
  sht.getRange(row, 1, 1, lastCol).setHorizontalAlignment('center');


  sht.getRange(row, 1, 1, lastCol).setWrapStrategy(SpreadsheetApp.WrapStrategy.WRAP)
  sht.getRange(row, 1, 1, lastCol).setVerticalAlignment('top');

};


/*--------------------------------------------------------------------------------------------------------------
/  Apply sundry sheet formatting
---------------------------------------------------------------------------------------------------------------*/

function setHeatSheetFormatting(sht) {
    
  sht.setColumnWidth(1, 85);
  sht.setColumnWidth(2, 72);
  sht.setColumnWidth(3, 72);
  sht.setColumnWidth(4, 72);
  sht.setColumnWidth(5, 72);
  sht.setColumnWidth(7, 72);
  sht.setColumnWidth(8, 72);
  sht.setColumnWidth(9, 72);
  sht.setColumnWidth(6, 220);
  
  sht.getRange("A:A").setNumberFormat('dd"-"mmm"-"yyyy');
  sht.getRange("G:H").setNumberFormat('#,##0')
  
  sht.getRange("A:A").setHorizontalAlignment('center');
  sht.getRange("B:B").setHorizontalAlignment('center');
  sht.getRange("C:C").setHorizontalAlignment('center');
  sht.getRange("D:D").setHorizontalAlignment('center');
  sht.getRange("E:E").setHorizontalAlignment('center');
  sht.getRange("G:G").setHorizontalAlignment('center');
 
  sht.getRange("A:Z").setFontSize(14);

};




/*--------------------------------------------------------------------------------------------------------------
/  Copy form responses per tab RegoFormResponses onto the SwimmerRego tab
---------------------------------------------------------------------------------------------------------------*/

function copyFormReponsestoRegoSheet(){

  

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var responses = new objData;
  var surnameFirstName;
  var firstNameSurname;
  var arrayOfSwimCodes;
  var regoTabSwimmerNames = ss.getSheetByName('SwimmerRego').getRange('A:A').getValues();
  var regoTabSwimCodes = ss.getSheetByName('SwimmerRego').getRange('1:1').getValues();
  var rowToWrite;
  var colToWrite;
  var swimCode;
  
  //Convert the array of array picked up from spreadsheet range to one dimensional arrays
  regoTabSwimmerNames = regoTabSwimmerNames.map(function(value){
    return value[0];
  });
  regoTabSwimCodes = regoTabSwimCodes[0];
  
  
  
  responses.readDataFromSheet(ss.getSheetByName('RegoFormResponses'));
  
  responses.dataArray.map(function(value){
    
    firstNameSurname = value['Swimmer first name and surname (capitalise first letters)'].trim();
    arrayOfSwimCodes = value['Select Swim'].split(', ');
    surnameFirstName = convertProperNametoSurnameCommmaFirstName(firstNameSurname);
    
    rowToWrite = regoTabSwimmerNames.indexOf(surnameFirstName) + 1;
    if (rowToWrite !==0) {
      arrayOfSwimCodes.map(function(value2){
        colToWrite = regoTabSwimCodes.indexOf(value2) + 1;
        if (colToWrite !== 0) {
          ss.getSheetByName('SwimmerRego').getRange(rowToWrite, colToWrite).setValue(1);
        };
      });
    }; 
  });
  
};

