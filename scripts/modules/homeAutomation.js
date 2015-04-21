/** Script ACLs do not delete 
 read=nobody 
write=nobody
execute=anonymous 
  **/ 
 function HomeAutomationManager() {
  this.rooms = [
    {"master": {"temperature": 22, "light": false}}, 
    {"kids": {"temperature": 22, "light": false}}, 
    {"living": {"temperature": 22, "light": false}}
  ];
  this.doors = [{"font":false}, {"garage":false}];
}

HomeAutomationManager.prototype.getReport = function() {
  return "Rooms: " + "\n" +  JSON.stringify(this.rooms) + "\nDoors:\n" + JSON.stringify(this.doors);
}   							