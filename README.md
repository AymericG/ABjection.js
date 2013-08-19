ABjection.js
============

simple javascript AB testing framework using Google Universal Analytics


SAMPLE USAGE
============

var abjection = new ABjection.Tester(ga, "dimension1");
abjection.Experiment("ab-call-to-action", { default: "Try now", variant1: "Create an account" });

// You need to add the custom dimension in your Google Analytics account and replace the "dimension1"

// More advanced example using a function instead of a string
abjection.Experiment("ab-button-color", { default: function() { this.style.color = "Red"; }, variant1: function(){ this.style.color = "Green"; }});

// You need to add the class .ab-button-color or .ab-call-to-action to the element in the page

