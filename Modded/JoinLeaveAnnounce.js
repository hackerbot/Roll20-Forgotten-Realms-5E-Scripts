/*
global on _ playerIsGM sendChat
---CLOUD9 ERROR CLEARING---
*/
// By: DXWarlock
//Script: Simple Join/Part Greeter
//Roll20 Thread: https://app.roll20.net/forum/post/2184135/script-simple-join-slash-part-greeter/#post-2184135
//Roll20 Contact: https://app.roll20.net/users/262130
//Added datetime, Switch to 5E Template (Idea by Benson Y.), Modded by NinhJa
var DXGREET = DXGREET || (function() {
    'use strict';
    var Greet = function(obj) {
            var name = obj.get("_displayname");
            var isGM = "";
            // start mod
            var currentdate = new Date()
            var datetime = currentdate.getDate() + "/"
                            + (currentdate.getMonth()+1)  + "/" 
                            + currentdate.getFullYear() + " @ "  
                            + (currentdate.getHours()-2) + ":"  
                            + currentdate.getMinutes() + ":" 
                            + currentdate.getSeconds(); //end mod
            if(playerIsGM(obj.id) === true) {
                isGM = " (GM)";
            }
            if(obj.get("_online") == true) {
                setTimeout(function() { //start mod
                    sendChat('', "&{template:5eDefault} {{title=Hello " + name + isGM + "}} {{subheader=Forgotten Realms 5E}} {{weapon=1}} {{rollname=Joined}} {{roll=" + datetime + "}}");
                }, 3000);
            }
            if(obj.get("_online") == false) {
                setTimeout(function() {
                    sendChat('', "&{template:5eDefault} {{title=Goodbye " + name + isGM + "}} {{subheader=Forgotten Realms 5E}} {{spell=1}} {{rollname=Left}} {{roll=" + datetime + "}}");
                }, 500); //end mod
            }
        },
        registerEventHandlers = function() {
            on('change:player:_online', Greet);
        };
    return {
        RegisterEventHandlers: registerEventHandlers
    };
}());
on('ready', function() {
    'use strict';
    DXGREET.RegisterEventHandlers();
});