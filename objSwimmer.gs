var objSwimmer = function(surnameFirstName) {


  //-------------------------------------------------------------------------------------------------------------
  //  Sundry class properties
  //-------------------------------------------------------------------------------------------------------------
  
  var self = this;
  self.surnameFirstName = surnameFirstName;
  self.category = '';
  var historicSwims = [];    // Aray of swim objects swum by swimmer
  var regoSwims = [] // Aray of swim objects for which swimmer is registered
  self.baseTimes = {} //Key value pair of base times where key is a swimcode.
  

  //-------------------------------------------------------------------------------------------------------------
  //  Add swim object to swimmer to record historic swims
  //-------------------------------------------------------------------------------------------------------------

  self.addSwim = function (swim){
    historicSwims.push(swim);
  };


  //-------------------------------------------------------------------------------------------------------------
  //  Add swim object to swimmer to record rego swims (being swum today)
  //-------------------------------------------------------------------------------------------------------------

  self.addRegoSwim = function (swim){
    regoSwims.push(swim);
  };



  //-------------------------------------------------------------------------------------------------------------
  //  Get an array of swimCodes for which the swimmer is registered to swim today eg. [BK100, FR50]
  //-------------------------------------------------------------------------------------------------------------
  
  self.swimCodesRegistered = function(){
    
    var events = regoSwims.map(function(value){
      return value.swimEvent.swimCode;
    });

    events = uniqueArrayOfValues(events);
    return events;
  
  };
  

  //-------------------------------------------------------------------------------------------------------------
  //  returns swimmer name in First name <space> Surname format
  //-------------------------------------------------------------------------------------------------------------
  
    self.properName = function(){
  
    var positionOfComma = self.surnameFirstName.search(',');
    var surname = self.surnameFirstName.substring(0, positionOfComma);
    var firstName = self.surnameFirstName.substring(positionOfComma+2, self.surnameFirstName.length);
    
    return (firstName + ' ' + surname);
  
    };

  
  

};
