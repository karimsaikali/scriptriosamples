/** Script ACLs do not delete 
 read=nobody 
write=nobody
execute=anonymous 
  **/ 
 try {
  
  var common = require("workflow/common");
  var processDefinitionModule = require("workflow/processDefinition");
  var activityDefinitionModule = require("workflow/activityDefinition");
  var humandActivityDefinitionModule = require("workflow/humandActivityDefintion");
  var engine = require("workflow/engine");
  
  // initialize engine
  engine.init();
  
  // create a simple process definition
  var dto = {
    "name": "SimpleProcess"
  };

  var simpleProcessDef = new processDefinitionModule.ProcessDefinition(dto);

  // create a new activity definition a1
  var a1Dto = {
      "name": "a1",
      "startCondition": "start"
  };

  var activity1Def = new activityDefinitionModule.ActivityDefinition(a1Dto);
  
  // override the execute method of the activity1Def 
  activity1Def.execute =  function(params) {
    console.log(JSON.stringify(this));
    console.log(this.name + " is executing");
  }

  // add the activity definition to the process definition
  simpleProcessDef.addActivityDefinition(activity1Def);
  
  // create a new activity definition a2
  var a2Dto = {
      "name": "a2",
      "startCondition": "a1_" +  common.DONE
  };

   var activity2Def = new activityDefinitionModule.ActivityDefinition(a2Dto);
  
  // override the execute method of the activity1Def 
  activity2Def.execute =  function(params) {
    console.log(JSON.stringify(this));
    console.log(this.name + " is executing");
  }

  // add the activity definition to the process definition
  simpleProcessDef.addActivityDefinition(activity2Def);
  
  // create a new activity definition a3
  var a3Dto = {
      "name": "a3",
      "startCondition": "a1_" +  common.DONE
  };

   var activity3Def = new activityDefinitionModule.ActivityDefinition(a3Dto);
  
  // override the execute method of the activity1Def 
  activity3Def.execute =  function(params) {
    console.log(JSON.stringify(this));
    console.log(this.name + " is executing");
  }
  
  // add the activity definition to the process definition
  simpleProcessDef.addActivityDefinition(activity3Def);
  
  // create a new activity definition a4
  var a4Dto = {
      "name": "a4",
      "startCondition": "a2_" +  common.DONE + " && " + "a3_" +  common.DONE,
      "iterations": 3
  };

  var activity4Def = new activityDefinitionModule.ActivityDefinition(a4Dto);
  
  // override the execute method of the activity1Def 
  activity4Def.execute =  function(params) {
    console.log(JSON.stringify(this));
    console.log(this.name + " is executing");
    storage.global.workflow[params.processId].data.x = 5;
  }

  // add the activity definition to the process definition
  simpleProcessDef.addActivityDefinition(activity4Def);
  
  // create a new activity definition a5
  var a5Dto = {
      "name": "a5",
      "startCondition": "a4_" +  common.DONE,
      "filter": "storage.global.workflow[processId].data.x == 5"
  };
  var activity5Def = new activityDefinitionModule.ActivityDefinition(a5Dto);
  
  // override the execute method of the activity1Def 
  activity5Def.execute =  function(params) {
    console.log(JSON.stringify(this));
    console.log(this.name + " is executing");
  }

  // add the activity definition to the process definition
  simpleProcessDef.addActivityDefinition(activity5Def);
  
  // create a new human activity definition a6
  var a6Dto = {
      "name": "a6",
      "startCondition": "a5_" +  common.DONE,
 	  "title": "Your a6 task"
  };
  var activity6Def = new humandActivityDefintionModule.HumandActivityDefintion(a6Dto);
  
   // add the activity definition to the process definition
  simpleProcessDef.addActivityDefinition(activity6Def);
  
  console.log(JSON.stringify(storage.global.workflow[dto.name]));
  var pid = simpleProcessDef.start();
}catch(exception) {
  return exception;
}    				   				   				   							