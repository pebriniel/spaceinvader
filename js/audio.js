var sounds = new Array();
var soundSource = new Array();

// Fix up prefixing
window.AudioContext = window.AudioContext || window.webkitAudioContext;
var context = new AudioContext();

function onError(){ console.log('erreur');  }

function loadSound(file, key) {
	var request = new XMLHttpRequest();
	request.open('GET', file, true);
	request.responseType = 'arraybuffer';
	
	// Decode asynchronously
	request.onload = function() {
		context.decodeAudioData(request.response, function(buffer) {
			sounds[key] = buffer;
		}, (function(){ 
				console.log('erreur');
				
			})); 
	}

	request.send();	
}

function playSound(key, loop){
	if(gstats.playSound){
		var source = context.createBufferSource(); // creates a sound source
		source.buffer = sounds[key];                    // tell the source which sound to play
		source.connect(context.destination);  
		source.loop = loop;
		source.start(0);                           // play the source now
														// note: on older systems, may have to use deprecated noteOn(time);
		if(loop){
			soundSource[key] = source;
		}
	}
}

function stopSound(key, all){
	if(gstats.playSound){
		if(all === 'undefined'){
			soundSource[key].stop();
		}
		else{
			for(i in soundSource){
				soundSource[i].stop();
			}
		}
	}
}	