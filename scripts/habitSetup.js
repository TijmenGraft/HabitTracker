document.getElementById("createHabitBttn").onclick = function(){openHabitSetup()};
document.getElementById("noclick").onclick = function(){redirectButton()};
function openHabitSetup(){
  document.getElementById("habitSetup").innerHTML = setupToString;
}
function redirectButton(){
  document.write("redirecting...");
  var referLink = document.createElement("a");
  referLink.href = "http://www.telegraaf.nl";
  document.body.appendChild(referLink);
  referLink.click();
var setupToString = "<p>The habit setup will be implemented soon.</p>";
