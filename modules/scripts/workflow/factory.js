/** Script ACLs do not delete 
 read=nobody 
write=nobody
execute=authenticated 
  **/ 
 

/**
 * contains code to generate instance of different workflow types
 * should be used instead of directly invoking constructors
 * @module factory
 */

/**
 * create an instance of the given activity type, initialized
 * with the provided parameters
 * @function getActivityInstance
 * @param {Object} dto
 *	{String} type : the type of activity of which to create instances 
 *	{Object} initParams : other properties expected by the type's constructor (optional, depends on the targeted type)
 */
function getActivityInstance(dto) {
  
  if (!dto || !dto.type) {
    
    throw {
      	
      	"errorLocation":  "factory.getActivityInstance",
    	"errorCode": "Invalid_Parameter",
        "errorDetail": "dto cannot be null or empty and you need to specify the type of activity to create"
    }
  }
  
  var module = require(dto.type);
  var typeName = dto.type.substring(dto.type.lastIndexOf("/") + 1);
  var className = typeName[0].toUpperCase() + typeName.substring(1);
  return new module[className](dto.initParams);
}   							