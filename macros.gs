

function FreezePanes() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  //spreadsheet.getRange('2:2').activate();
  spreadsheet.getActiveSheet().setFrozenRows(1);
};






function UnfreezePanes() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  //spreadsheet.getRange('A3').activate();
  spreadsheet.getActiveSheet().setFrozenRows(0);
};

function InsertRowBelow() {
  var spreadsheet = SpreadsheetApp.getActive();
  spreadsheet.getRange('1:1').activate();
  spreadsheet.getActiveSheet().insertRowsAfter(spreadsheet.getActiveRange().getLastRow(), 1);
  spreadsheet.getActiveRange().offset(spreadsheet.getActiveRange().getNumRows(), 0, 1, spreadsheet.getActiveRange().getNumColumns()).activate();
};
