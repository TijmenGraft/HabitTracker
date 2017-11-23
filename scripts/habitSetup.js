document.getElementById("createHabitBttn").onclick = function(){openHabitSetup()};
document.getElementById("noclick").onclick = function(){redirect()};
function openHabitSetup(){
  document.getElementById("habitSetup").innerHTML = setupToString;
}
function redirect(){
  window.location.href = "http://meatspin.com";
}
var setupToString = "<p>The habit setup will be implemented soon.</p>";
