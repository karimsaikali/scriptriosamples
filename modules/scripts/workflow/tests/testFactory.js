/** Script ACLs do not delete 
 read=nobody 
write=nobody
execute=authenticated 
  **/ 
 var factory = require("workflow/factory");

var dto = {
  "type": "workflow/humanActivityDefinition",
  "initParams": {
    "name": "a6",
  	"startCondition": "a5_done",
  	"title": "Your a6 task"
  }
};

try {
	return factory.getActivityInstance(dto);
}catch(exception) {
  return exception;
}   							