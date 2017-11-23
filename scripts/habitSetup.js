document.getElementById("createHabitBttn").onclick = function(){openHabitSetup()};
document.getElementById("noclick").onclick = function(){iSaidDoNot()};
function openHabitSetup(){
  document.getElementById("habitSetup").innerHTML = setupToString;
}
function iSaidDoNot(){
  window.location.redirect("http://www.telegraaf.nl");
}
var setupToString = "<p>The habit setup will be implemented soon.</p>";
