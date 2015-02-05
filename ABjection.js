/*
SAMPLE USAGE:

var abjection = new ABjection.Tester(ga, "dimension1");
abjection.Experiment("ab-call-to-action", { default: "Try now", variant1: "Create an account" });

// You need to add the custom dimension in your Google Analytics account and replace the "dimension1"

// More advanced example using a function instead of a string
abjection.Experiment("ab-button-color", { default: function() { this.style.color = "Red"; }, variant1: function(){ this.style.color = "Green"; }});

// You need to add the class .ab-button-color or .ab-call-to-action to the element in the page

*/


var ABjection = {};
ABjection.Utils = {

    Log: function(message){
        if (console && console.log)
        {
            console.log(message);
        }
    },

    Size: function(obj) {
        var size = 0, key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) size++;
        }
        return size;
    },

    PropertyByIndex: function(obj, index)
    {
        var i = 0;
        for (var property in obj)
        {
            if (i == index)
            {
                return property;
            }
            i++;
        }
        return null;
    },

    GetRootDomain: function(){
        if (location.host == ""){
            this.Log("No location.host available");
            return null;
        }
        var parts = location.host.split('.').reverse();
        if (parts.length < 2)
        {
            return null;
        }
        return parts[1] + '.' + parts[0];
    }
};


ABjection.CookieStorage = function(domain){

    this.Get = function(name)
    {
        var nameEQ = name + "=";
        var cookieParts = document.cookie.split(';');
        for (var i = 0; i < cookieParts.length; i++) 
        {
            var c = cookieParts[i];
            while (c.charAt(0)==' ') 
            {   
                c = c.substring(1, c.length);
            }
            if (c.indexOf(nameEQ) == 0) 
            {
                return c.substring(nameEQ.length, c.length);
            }
        }
        return null;
    };

    this.Set = function(name, value)
    {
        var cookie = name + "=" + value + "; path=/";
        if (domain)
        {
            cookie += ";domain=" + domain;
        }
        ABjection.Utils.Log("Saving cookie " + cookie);
        document.cookie = cookie;
    };

};

ABjection.Tester = function(ga, dimensionId, domain){ 
 
    var abUtils = ABjection.Utils; 
    var cookieStorage = new ABjection.CookieStorage(abUtils.GetRootDomain());

    var canUse = true;
    if (!document.getElementsByClassName)
    {
        canUse = false;
        abUtils.Log("Cannot use ABjection with this browser: missing getElementsByClassName method.");
    }

    var pickVariation = function(experimentName, variations){
        var variationName = cookieStorage.Get("ABjection_" + experimentName);
        if (variationName && variations[variationName])
        {
            abUtils.Log("Found variation in cookie: " + variationName);
            
            return variationName;
        }

        var variationIndex = Math.floor(Math.random() * abUtils.Size(variations));
        variationName = abUtils.PropertyByIndex(variations, variationIndex);

        cookieStorage.Set("ABjection_" + experimentName, variationName);
        return variationName;
    };

    var execute = function(experimentName, variation){
		var elements = document.getElementsByClassName(experimentName);
		for (var j = 0; j < elements.length; j++) {
			if (typeof(variation) == "function")
			{
				variation.call(elements[j]);
			}
			else
			{
				elements[j].innerHTML = variation;
			}
		}
    };

    this.Experiment = function(experimentName, variations){
        if (!canUse) return;

        var variationName = pickVariation(experimentName, variations);
        var variation = variations[variationName];

        ga("set", dimensionId, experimentName + "_" + variationName);

        execute(experimentName, variation);
        return this;
    };


};