/** Script ACLs do not delete 
 read=nobody 
write=nobody
execute=authenticated 
  **/ 
 /**
 * this module knows how to build and send human task for the email channel
 * Note: convention is to name builders as follows: taskTypeTaskBuilder, e.g emailTaskBuilder
 * @module emailTaskHandler
 *

/**
 * @function buildTask 
 * @param {Object} params :  
 *	{String} title : the activity's title, to be used when displayed to human actors
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
 *	{String} processId : the identier of the process instance to which the corresponding activity instance belong
 * @return {String} the HTML form to send by email
 */
function buildTask(params) {
  
  if (!params || !params.processId) {
    
    throw {
      
      "errorCode": "Invalid_Parameter",
      "errorDetail": "emailTaskHandler : cannot build the content of a task without a process id"
    }
  }
  
  var formStr = "<form action='https://api.scriptr.io/workflow/tests/dummy' method='post'>";
  formStr += "<table align='center'>";
  formStr += "<tr><th colspan='2'><h2>" + params.title + "</h2></th><tr>";
  if (params.objectNames && params.objectNames.length > 0) {
    
    for (var i = 0; i < params.objectNames.length; i++) {
      
    	var currentObject = eval(params.objectNames[i].name);
      if (currentObject) {
          
          var keys = Object.keys(currentObject);
          formStr += "<tr><td colspan='2'><b>" + params.objectNames[i].name + "</b></td></tr>"; 
          for (var j = 0; j < keys.length; j++) {
          	
            var readonly = (params.objectNames[i].editable.indexOf(keys[j]) > -1) ? "" : "readonly";
            formStr += "<tr>";
            formStr += "<td><label>" + keys[j] + "</label></td>";
          	formStr += "<td><input type='text' name='" + keys[j] + "' id='" + keys[j] + "' value='" + currentObject[keys[j]] + "' " + readonly + "></td>";
            formStr += "</tr>";
          }
        }
    }
  }
  
  formStr += "<tr>";
  formStr += "<td align='center'><input type='radio' name='status' id='status' value='done'>Done</input></td>";
  formStr += "<td align='center'><input type='radio' name='status' id='status' value='cancel'>Cancel</input></td>";
  formStr += "<tr><td colspan='2' align='center'><input type='submit' value='Submit'/></td></tr>";
  formStr += "<input type='hidden' name='auth_token' id='auth_token' value='RzM1RkYwQzc4Mg=='/>"
  formStr += "<input type='hidden' name='processId' id='processId' value='" + params.processId + "'/>"
  formStr += "</table></form>";
  return formStr;
}

/**
 * email a task to the given recipient 
 * @function sendTask
 * @param {Object} params
 * 	{String} to : the task's recipient -> recipient's email address
 *	{String} title:  the task's title -> the email's subject (optional)
 *	{String} content : the task's content -> the email's body
 */
function sendTask(parms) {
  
  if (!params || !params.to) {
    
    throw {
      
      "errorCode": "Invalid_Parameter",
      "errorDetail": "emailTaskHandler : cannot send a task using undefined recipient"
    }
  }
  
  sendMail(params.to, params.from, params.subject, params.body)
}   							