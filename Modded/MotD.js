// Github:   https://github.com/shdwjk/Roll20API/blob/master/MotD/MotD.js
// By:       The Aaron, Arcane Scriptomancer
// Contact:  https://app.roll20.net/users/104025/the-aaron

var MotD = MotD || (function() {
    'use strict';

    var version = 0.1,
		motdNoteId,
		motdNoteName = 'MotD Note',
		motdText,

	fixedCreateObj = (function () {
		return function () {
			var obj = createObj.apply(this, arguments);
			if (obj && !obj.fbpath) {
				obj.fbpath = obj.changed._fbpath.replace(/([^\/]*\/){4}/, "/");
			}
			return obj;
		};
	}()),

	loadMotDNote = function (text) {
		motdText=text;
	},

	createMotDNote = function() {
		var motdNote = fixedCreateObj('handout',{
			name: motdNoteName
		});
		motdText='<b>Welcome to Forgotten Realms 5E! We hope that you will enjoy your stay :)</b>\
                    - Spectate Live Game: https://goo.gl/9ysEDJ\
                    - Past Session Playlist: https://goo.gl/IxuE4M\
                    - New Player Instructions: https://goo.gl/r7XNAH';
		motdNote.set('notes',motdText);
		motdNoteId = motdNote.id;
	},

	checkInstall = function(callback) {
		var motdNote = filterObjs(function(o){
			return ( 'handout' === o.get('type') && motdNoteName === o.get('name') && false === o.get('archived'));
		})[0];
		if(motdNote) {
			motdNoteId = motdNote.id;
			motdNote.get('notes',function(n) {
				loadMotDNote(n);
				callback();
			});
		} else {
			createMotDNote();
			callback();
		}
	},

	handlePlayerLogin = function(obj,prev) {
        if( true === obj.get('online') && false === prev._online ) {
            setTimeout(function(){
				var who=obj.get('displayname').split(/\s/)[0];
    		    sendChat('MotD','/w '+who+' '
					+motdText.replace(/%%NAME%%/g,obj.get('displayname'))
				);
            },10000);
        }
	},

	handleNoteChange = function(obj,prev) {
		if(obj.id === motdNoteId) {
			obj.get('notes',function(n) {
				loadMotDNote(n);
			});
		}
	},
	handleNoteDestroy = function(obj) {
		if(obj.id === motdNoteId) {
			createMotDNote();
		}
	},

	registerEventHandlers = function() {
		on('change:player:_online', handlePlayerLogin);
		on('change:handout', handleNoteChange);
		on('destroy:handout', handleNoteDestroy);
	};

	return {
		CheckInstall: checkInstall,
		RegisterEventHandlers: registerEventHandlers
	};
}());

on('ready',function() {
	'use strict';

	MotD.CheckInstall(function(){
		MotD.RegisterEventHandlers();
	});
});