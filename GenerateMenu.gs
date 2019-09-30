function createFascMenu(){

  var fascMenu = SpreadsheetApp.getUi().createMenu('FASC')
  
  
  fascMenu.addItem('Update rego form', 'updateRegoForm');
  fascMenu.addItem('Capture form responses in rego sheet', 'captureFormResponses');
  fascMenu.addItem('Delete heat sheets', 'deleteHeatSheets');
  fascMenu.addItem('Generate heat sheets', 'generateHeatSheets');
  fascMenu.addToUi();
  
}
