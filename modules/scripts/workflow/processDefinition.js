/** Script ACLs do not delete 
 read=nobody 
write=nobody
execute=authenticated 
  **/ 
 var engine = require("workflow/engine");
var processModule = require("workflow/process");
var common = require("workflow/common");

/**
 * define a new process structure
 * @class ProcessDefinition
 * @constructor ProcessDefinition
 * @param {Object} dto : parameters to initialize the process definition instance
 *	{String} name : the name of the new process definition (mandatory)
 */
function ProcessDefinition(dto) {
  
  if (!dto || !dto.name) {
    
    throw {
     
      "errorCode": "Invalid_Parameter",
      "errorDetail": "ProcessDefinition.constructor. dto cannot be null or empty"
    }
  }
  
  this.name = dto.name;
  this.activityDefinitions = {};
  this.persist(); // immediately persist the process definition 
}

/**
 * @method addActivityDefinition
 * @param {Object} activityDef : an instance of ActivityDefinition, to add to the current process definition
 */
ProcessDefinition.prototype.addActivityDefinition = function(activityDef) {
  
  if (activityDef) {
  	this.activityDefinitions[activityDef.name] = activityDef;
  }
 
  this.persist();
};

/**
 * @method removeActivityDefinition
 * @param {String} activityDefName : the name of an ActivityDefinition, to remove from the current process definition
 */
ProcessDefinition.prototype.removeActivityDefinition = function(activityDefName) { 
  
	if (this.activityDefinitions[activityDefName]) {
      delete this.activityDefinitions[activityDefName];
    }
};

/**
 * create a new instance of Processs, based on this definition
 * @method start
 * @return {String} the identifier of the new process instance
 */
ProcessDefinition.prototype.start = function() {
  
  var dto = {
  	"processDefinitionName": this.name  
  };
  
  var processInstance = new processModule.Process(dto);
  var processId = processInstance.id;
  var queueName = common.eventQueuePrefix +  this.id;
  var startEvent = {
    
  	"processId": processId,
    "name": "start"
  };
  
  engine.addEvent(startEvent);
  return processId;
};

ProcessDefinition.prototype.persist = function() {
  storage.global.workflow[this.name] = this;
};   				   				   				   				   							