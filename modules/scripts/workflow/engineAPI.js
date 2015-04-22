/** Script ACLs do not delete 
 read=nobody 
write=nobody
execute=authenticated 
  **/ 
 /**
 * this api should be called by any external entity in order to push an event in to the workflow engine
 * for a given process, and optionnally update the process's data
 * @module engineAPI
 * @param {String} processId : the identifier of the process instance that needs to be activated
 * @param {String} event : the name of the event to be fired by the engine towards the process instance
 * @param {Object} processData : (optional) any data to update/create in the process instance (contained in the process.data property)
 * @param {Object} data : {optional} any data to update/create in store.global
 */
var common = require("workflow/common");
var processModule = require("workflow/process");
var util = require("workflow/util");
var engine = require("workflow/engine");

try {
  
  var processId = request.parameters.processId;
  var event = request.parameters.event;
  var processData = request.parameters.processData;
  var globalData = request.parameters.globalData;

  if (!processId) {

    throw {
      "errorCode": "Invalid_Parameter",
      "errorDetail": "You need to pass a value for the processId parameter"
    }
  }
  
  if (!event) {

    throw {
      "errorCode": "Invalid_Parameter",
      "errorDetail": "You need to pass a value for the event parameter"
    }
  }
  
  // load the process instance
  var process =  storage.global.workflow[processId];
  
  // update the process' data if any
  if (processData) {
   util.mergeXtoY(processData, process.data);
  }
  
  // update the global store's data if any
  if (globalData) {
    util.mergeXtoY(globalData, storage.global);
  }
  
  var processEvent = {
    "processId": processId,
    "name": event
  };
  
  engine.addEvent(processEvent);
}catch(exception) {
  return exception;
}   							