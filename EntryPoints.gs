/*--------------------------------------------------------------------------------------------------------------
/  Creates FASC menu and deletes SwimSummary sheet if it exists
---------------------------------------------------------------------------------------------------------------*/

function onOpen() {

  createFascMenu();
  deleteSheet('SwimSummary');
      
};





/*--------------------------------------------------------------------------------------------------------------
/  Generates heat sheets
---------------------------------------------------------------------------------------------------------------*/

function generateHeatSheets(){

  //Read data for swim Events, Swimmers and Swims
  var swimEvents = getSwimEvents();
  var swimmers = getSwimmers();
  var swims = getRegoSwims(swimEvents);
  var heats = new objHeats;
  addStoredBaseTimesToSwimmers(swimmers, swimEvents);


  // Add rego swims to swimmers
  swims.arrayOfSwims.map(function(value){
    swimmers.getSwimmer(value.surnameFirstName).addRegoSwim(value);
  });

  heats.swimmers = swimmers;
  heats.swimEvents = swimEvents;
  
  heats.organiseSwimmersIntoHeats();
  deleteHeatSheets();
  
  //Write heats to seperate tab for each category
  writeHeatsToSheet(heats);
  
  //Write all heats to a single tab
  writeHeatsToSheet(heats, true);


};





/*--------------------------------------------------------------------------------------------------------------
/  Delete Heat Sheets
---------------------------------------------------------------------------------------------------------------*/

function deleteHeatSheets(){

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var shts = ss.getSheets()
  var sheetName  = '';
  
  shts.map(function(value){
    var sheetName = value.getSheetName();
    if (sheetName.slice(0, 5) === 'Heat_') {
      ss.deleteSheet(value);
    }
  });

};





/*--------------------------------------------------------------------------------------------------------------
/  Generate Rego Form
---------------------------------------------------------------------------------------------------------------*/


function updateRegoForm(){

  
  //Issue warning and exit function if user selects cancel
  var response = Browser.msgBox('This will delete all existing rego captured from forms in this spreadsheet. Only do ' +
                                'this if you are starting a data capture form for a new week and don\'t need to generate heat sheets from existing data.  ' + 
                                'Do you want to continue?'  , Browser.Buttons.OK_CANCEL);
  
  if (response === 'cancel') {
    return;
  };




  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var regoForm = FormApp.openById('1_s9ulmLGFD66LtZOI_k80T5lTu8V-PZkrMg7MWT5RbY');
  //var checkBox;
  var textBox
  var todaysSwimCodes = [];
  var swimmers = getSwimmers();
  var swimEvents = getSwimEvents();
  var nameRegex  =''
  var regoFormSheet = ss.getSheetByName('RegoFormResponses')
  var FORM_RESPONSE_ROWS_NEEDED = 20000; 
 
 
  //Set form description using text from SundyInputs tab, eg only swim one of the longer
  //distance swim lenths.
  regoForm.setDescription(ss.getSheetByName('SundryInputs').getRange('CommentsForForm').getValue());
 

  //Delete all rows (except headers) of tab RegoFormResponses and then add new rows
  //This ensures new form capture happens at the start of the sheet
  regoFormSheet.setFrozenRows(0);
  if (regoFormSheet.getMaxRows() > 1) {
    regoFormSheet.deleteRows(2, regoFormSheet.getMaxRows() -1);
  };
  regoFormSheet.insertRowsAfter(1, (FORM_RESPONSE_ROWS_NEEDED - regoFormSheet.getMaxRows()));
  regoFormSheet.setFrozenRows(1);

 
 
 
 
  
  //Get array of swim codes being swum today  
  swimEvents.arrayOfEventsSwumToday().map(function(value){
    todaysSwimCodes.push(value['swimCode']);
  });
  
  
  //Set swim codes as choices on first check box on form
  //Need to cast the generic item type into a CheckBox item via item interface (.asCheckboxItem())
  //https://developers.google.com/apps-script/reference/forms/item  
  var checkBoxesOnForm = regoForm.getItems(FormApp.ItemType.CHECKBOX)
  var FirstCheckBoxOnForm = checkBoxesOnForm[0].asCheckboxItem()
  FirstCheckBoxOnForm.setChoiceValues(todaysSwimCodes);
  

  //Create a regex expression for filling name on form
  var swimmerProperNames = swimmers.getSwimmerProperNames();
  for (i=0; i<swimmerProperNames.length; i++) {
    if (i === 0) {
      nameRegex = '(' + swimmerProperNames[i] + '|';
    } else if (i === (swimmerProperNames.length-1)) {
      nameRegex = nameRegex + swimmerProperNames[i] + ')';
    } else {
      nameRegex = nameRegex + swimmerProperNames[i] + '|';
    };
  };
  

  //Set name regex validation on first text box
  //Need to cast the generic item type into a CheckBox item via item interface (.asTextItem())
  //https://developers.google.com/apps-script/reference/forms/item  
  var TextBoxesOnForm = regoForm.getItems(FormApp.ItemType.TEXT)
  var firstTextBoxOnForm = TextBoxesOnForm[0].asTextItem()
  
  var textValidation = FormApp.createTextValidation()
    .setHelpText('Enter a registered swimmer name')
    .requireTextContainsPattern(nameRegex)
    .build();

  firstTextBoxOnForm.setValidation(textValidation)
  
  
  
  firstTextBoxOnForm.setValidation(textValidation)
  


};



/*--------------------------------------------------------------------------------------------------------------
/  Capture Form responses on SwimmerRego tab
---------------------------------------------------------------------------------------------------------------*/

function captureFormResponses(){



  copyFormReponsestoRegoSheet();
  
  

};
