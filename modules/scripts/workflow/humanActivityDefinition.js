/** Script ACLs do not delete 
 read=nobody 
write=nobody
execute=authenticated 
  **/ 
 var activityDefinitionModule = require("workflow/activityDefinition");
var resolver = require("workflow/resolver");

var types = {
  
  "EMAIL": "email",
  "WORKLIST": "worklist"
};

/**
 * @class HumanActivityDefinition
 * @constructor HumanActivityDefinition
 * @param {Object} dto : initialization parameters (@see ActivityDefinition)
 *	{String} title : the activity's title, to be used when displayed to human actors (optional, defaults to the name)
 *	{String} type :  the type of human activity (optional, defaults to types.EMAIL) -> one of the values defined in 'types'
 * 	{Array} objectNames : (optional) the fully qualified name of the objects that could be required by the activity during the process' execution
 *	with the names of the object's properties that can be edited. Note: these objects should have a flat structure (one-level graph)
 *	eg: [
 *			{
 *				"name": "storage.global.myObject",
 *				"editable": ["prop1", "prop4"] // the name of the properties than can be edited by the end user
 *			},
 *			{
 *              "name": "storage.global.workflow[processId].someObject"], // Note that processId is a predefined variable to use as is
 *				"editable": ["propa", "propb", "propc"]
 *			}
 *		]
 */
function HumanActivityDefinition(dto) {
  
  activityDefinitionModule.ActivityDefinition.call(this, dto);
  this.type = dto.type ? dto.type : types.EMAIL; // default type of human activities, impacts how the task is sent to the actor
  this.objectNames = dto.objectNames ? dto.objectNames : [];
  this.title = dto.title ? dto.title : this.name;
}

// Extend ActivityDefinition
HumanActivityDefinition.prototype = new activityDefinitionModule.ActivityDefinition({"name": "temporary"});
HumanActivityDefinition.prototype.constructor = HumanActivityDefinition;

/**
 * @method execute
 * @see ActivityDefinition.execute
 * @params {Object} same parameters as ActivityDefinition plus the following
 */
HumanActivityDefinition.prototype.execute = function(params) {
  
  activityDefinitionModule.ActivityDefinition.prototype.execute.call(this);
  var handleParams = {
    
    "objectNames": this.objectNames,
    "processId": params.processId
  };
  
  this._handle(handleParams);
};

HumanActivityDefinition.prototype._handle = function(params) {
  
	var handler = require("workflow/" + this.type + "TaskHandler");
  	if (!handler) {
      
       throw {
      
        "errorCode": "No_Task_Handler",
        "errorDetail": "humanActivityDefinition : Cannot find a handler for task type " + this.type
      }
    }
  
  	var content = handler.build(params);
  	var sendParams = {
      
  		"to": resolver.findRecipients({"activityName": this.name}),
      	"content": content
    };
  
  	handler.send(sendParams);
};   							