ABjection.js
============

simple javascript AB testing framework using Google Universal Analytics


USAGE
------------

    // You need to create a new custom dimension in your Google Universal Analytics account and replace the "dimension1"
    var abjection = new ABjection.Tester(ga, "dimension1");
    abjection.Experiment("ab-call-to-action", { default: "Try now", variant1: "Create an account" });

    // More advanced example using a function instead of a string
    abjection.Experiment("ab-button-color", { default: function() { this.style.color = "Red"; }, variant1: function(){ this.style.color = "Green"; }});

    // The code will be looking for any element with the class .ab-button-color or .ab-call-to-action to apply the variants.

