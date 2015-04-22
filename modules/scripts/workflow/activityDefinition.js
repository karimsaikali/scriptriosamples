/** Script ACLs do not delete 
 read=nobody 
write=nobody
execute=authenticated 
  **/ 
 /**
 * @class ActivityDefinition
 * @constructor ActivityDefinition
 * @param {Object} dto
 * 	{String} name : the name of the Activity
 *	{String} startCondition : the condition to be verified in order to trigger an instance of this activity.
 *	start conditions can contain:
 * 	- one event or a combination of events using either & or || but not both
 * 	ex: "endOfA1 && endOfA2" (join on two activities), "endOfA1 || someEvent"
 * 	{String} filter : an optional condition to be verified to start the activity. This condition
 *	is a logical expression that manipulates objets in the store
 *	ex: "storage.global.worfklow[processessId].reservation.quantity > 5". NOTE: "processId" is automatically defined by the framework
 *	{Numeric} iterations: set this to the number of times you need the instances of this activity to execute - sequentially (optional,
 * 	cannot be used in combination to iterateWhile)
 *	{String} iterateWhile: set this to a condition that will cause the activity instance to execute n times sequentially, until
 * 	the condition is not verified anymore (optional, cannot be used in combination to iterations). The condition should evaluate
 *  the value of global store objects and/or global store objects properties:
 *  example: storage.global.registration.name == "x" &&  storage.global.n > 10
 */
function ActivityDefinition(dto) {

  if (!dto || (!dto.name)) {
    
  	throw {
      
      	"errorCode": "Invalid_Parameter",
        "errorDetail": "ActivityDefinition.constructor. dto cannot be null or empty"
    }
  }
  
  this.name = dto.name;
  this.startCondition = dto.startCondition ? dto.startCondition.trim() : "";
  this.filter = dto.filter ? dto.filter.trim() : "";
  this.iterations = dto.iterations;
  this.iterateWhile = dto.iterateWhile;
}

/**
 * persist the current activity definition instance into the global store
 * @method persist
 */
ActivityDefinition.prototype.persist = function() {
  storage.global.workflow[this.name] = this;
}

/**
 * verify that the start condition needed to start the activity instance related to this \
 * definition is met
 * @method startConditionMet
 * @param {Array} events:  the array of events fired for the current process
 * @param {String} processId : the id of the process to which belongs the activity instance invoking the execute method 
 */
ActivityDefinition.prototype.startConditionMet = function(events, processId) {

  var all = true;
  var eventArray = this.startCondition.split(" ");
  var isUsingStore = this.startCondition.indexOf(".") > -1;
  var operator = eventArray.indexOf("&&") > -1 ? "&&" : eventArray.indexOf("||") > -1 ? "||" : "";
  if (isUsingStore) {    
    return eval(this.startCondition);
  }else {
    
    if (operator) {

      for (var i = 0; i < eventArray.length; i++) {

        var evt = eventArray[i];
        if (evt != "&&" && evt != "||") {         
          all = (operator == "&&") ? events.indexOf(evt) > -1 && all : events.indexOf(evt) > -1 || all; 
        }
      }
      
      if (this.filter) {
        return all && eval(this.filter);
      }
		
      return all;
    }else {

      var found = false;
      for (var i = 0; i < events.length && !found; i++) {

        var evt = events[i];
        found = events[i] == this.startCondition;
      }

      if (this.filter) {
        return found && eval(this.filter);
      }
      
      return found;
    }
  }
};

/**
 * this method should be overriden by sub-classes or by instance of ActivityDefinition (extension)
 * @method execute
 * @param {Object} params : some bespoke execution parameters. By default, on contains the process id
 *	{String} processId : the id of the process to which belongs the activity instance invoking the execute method 
 */
ActivityDefinition.prototype.execute = function(params) {
  
};   				   				   				   				   				   							