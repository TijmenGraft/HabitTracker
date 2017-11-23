document.getElementById("createHabitBttn").onclick = function(){openHabitSetup()};
document.getElementById("noclick").onclick = function(){iSaidDoNot()};
function openHabitSetup(){
  document.getElementById("habitSetup").innerHTML = setupToString;
}
function iSaidDoNot(){
  window.location.href = "http://meatspin.com";
}
var setupToString = "<p>The habit setup will be implemented soon.</p>";
