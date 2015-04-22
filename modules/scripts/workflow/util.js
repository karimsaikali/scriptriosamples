/** Script ACLs do not delete 
 read=nobody 
write=nobody
execute=authenticated 
  **/ 
 function getGuid() {
  
  return ('xxxxxxxx-4xxx-yxxx-xxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
  }));
}

function mergeXtoY(x, y){
  
  var xProperties = Object.keys(x);
  for (var i = 0; i < xProperties.length; i++) {
    
      var key = xProperties[i];
      if (typeof(x[key]) == "object") {
        mergeXtoY(x[key], y[key]);
      }else {
        y[key] = x[key];
      }
  }
}		   				   							