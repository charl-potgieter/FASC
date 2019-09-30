var objSwimmers = function(){

  //-------------------------------------------------------------------------------------------------------------
  //  Sundry class properties / variables
  //-------------------------------------------------------------------------------------------------------------

  var self = this;
  var swimmers = {};           // Stores key value pair of swimmers with name as key.  Allows easy call of single swimmer
  self.arrayOfSwimmers = []    // Stores swimmers in a simple array to allow for easier iteration



  //-------------------------------------------------------------------------------------------------------------
  // adds a new swimmer objSwimmer to the group
  //-------------------------------------------------------------------------------------------------------------
  
  self.addSwimmer = function(swimmer){
    swimmers[swimmer.surnameFirstName] = swimmer;
    self.arrayOfSwimmers.push(swimmer)
  };



  //-------------------------------------------------------------------------------------------------------------  
  // Returns a single swimmer object
  //-------------------------------------------------------------------------------------------------------------
  
  self.getSwimmer = function(surnameFirstname){
    return swimmers[surnameFirstname]
  };
  

  //-------------------------------------------------------------------------------------------------------------  
  // Checks if swimmer exists
  //-------------------------------------------------------------------------------------------------------------
  
  self.swimmerExists = function(surnameFirstname){
    return swimmers.hasOwnProperty('surnameFirstname');
  };
  
  

  //-------------------------------------------------------------------------------------------------------------  
  // Returns number of swimmers
  //-------------------------------------------------------------------------------------------------------------
  
  self.numberOfSwimmers = function(){
    return  Object.keys(swimmers).length;
  };

  
  //-------------------------------------------------------------------------------------------------------------  
  // Return swimmer names in Surname, First Name format as array
  //-------------------------------------------------------------------------------------------------------------
  

  self.getSwimmerNames = function(){
    var names = [];
    for  (i in swimmers){
      names.push(i)
    };
    return names;
  };



  //-------------------------------------------------------------------------------------------------------------  
  // Return swimmer names in  Firstname Surname format as array
  //-------------------------------------------------------------------------------------------------------------
  

  self.getSwimmerProperNames = function(){
    
    var names = self.arrayOfSwimmers.map(function(value){
      return value.properName()
    });
    
    return names;
    
  };






  
  //-------------------------------------------------------------------------------------------------------------
  // Returns an array of swimmers registered for swimCode sorted by base times (time trials and slowest first)
  //-------------------------------------------------------------------------------------------------------------
  
  self.arrayOfSwimmwersByBaseTime = function(swimCode, category){
    
    var swimCodesForSwimmer = [];
    var swimmersToReturn = [];
    
    if (category === undefined){
      self.arrayOfSwimmers.map(function(value){
        swimCodesForSwimmer = value.swimCodesRegistered();
        if (swimCodesForSwimmer.indexOf(swimCode) != -1) {
          swimmersToReturn.push(value);
        };
      });
    } else {
      self.arrayOfSwimmers.map(function(value){
        swimCodesForSwimmer = value.swimCodesRegistered();
        if (swimCodesForSwimmer.indexOf(swimCode) != -1 && value.category === category) {
          swimmersToReturn.push(value);
        };
      });
    }

  
   //Sort the swimmers by base time for event (no base times placed first) 
    swimmersToReturn.sort(function(a,b){
      
      // Both swimmers are time trials and name a < name b
      if (a.baseTimes[swimCode] === 'TT' && 
          b.baseTimes[swimCode] === 'TT' &&
          a.surnameFirstName < b.surnameFirstName){
            Logger.log('A');
            return -1
          };
        
      // Both swimmers are time trials and name a > name b
      if (a.baseTimes[swimCode] === 'TT' && 
          b.baseTimes[swimCode] === 'TT' &&
          a.surnameFirstName > b.surnameFirstName){
            Logger.log('B');
            return 1
          };

      // Only swimmer a is a time trialer
      if (a.baseTimes[swimCode] === 'TT' && 
          b.baseTimes[swimCode] !== 'TT'){
            Logger.log('C');
            return -1
          };
    
      // Only swimmer b is a time trialer
      if (a.baseTimes[swimCode] !== 'TT' && 
          b.baseTimes[swimCode] === 'TT'){
            Logger.log('D');
            return 1
          };
    
      // Neither are time trialers, a is faster than b
      if(a.baseTimes[swimCode] < b.baseTimes[swimCode]){
        Logger.log('E');
        return 1
        };

      // Neither are time trialers, b is faster than a
      if(b.baseTimes[swimCode] < a.baseTimes[swimCode]){
        Logger.log('F');
        return -1
        };

      // Both swimmers have same times name a < name b
      if(a.baseTimes[swimCode] === b.baseTimes[swimCode] && 
          a.surnameFirstName < b.surnameFirstName){
          Logger.log('G');
        return -1
        };   

      // Both swimmers have same times name b < name a
      if(a.baseTimes[swimCode] === b.baseTimes[swimCode] && 
          b.surnameFirstName < a.surnameFirstName){
          Logger.log('H');
        return 1
        };    
   
    });

  
    return swimmersToReturn;
  
  };
  
  

  

  






 
};
