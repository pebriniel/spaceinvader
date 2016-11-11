
//on change la valeur des variables contenu dans gstats
function gstats_modif(key, val = null){
	if(val == null){
		for(i in key){ (gstats[key[i]]) ? gstats[key[i]] = false : gstats[key[i]] = true; }
	}
	else{
		for(i in key){ gstats[key[i]] = val; }
	}
}

//on cache/affiche les div contenu dans gstats
function dstats_toggle(key){
	for(i in key){ (gstats[key[i]].style.display == "block") ? gstats[key[i]].style.display = "none" : gstats[key[i]].style.display = "block"; }
}


var bg = 100; //animation du background

//on initialise le jeu 
function initGame(){
	
	//on active le menu
	gstats_modif(Array("aMenu"));

	//on récupère toutes les divs qui nous intéresse
	gstats.dOptionKey = document.querySelectorAll("#option-select-touch")[0];
	gstats.dOption = document.querySelectorAll("#option")[0];
	gstats.dLoading = document.querySelectorAll("#loading")[0];
	gstats.dContainer = document.querySelectorAll("#container")[0];
	gstats.dBlockEnnemi = document.querySelectorAll("#blockennemi")[0];
	gstats.dMenu = document.querySelectorAll("#ecranStart")[0];
	gstats.dGame = document.querySelectorAll("#container")[0];
	gstats.dPause = document.querySelectorAll("#pause")[0];
	gstats.dOver = document.querySelectorAll("#gameOver")[0];
	gstats.dScore = document.querySelectorAll("#score")[0];
			
	//on cache toutes le sdivs qui nous intéresse
	gstats.dOption.style.display = "none";
	gstats.dOptionKey.style.display = "none";
	gstats.dLoading.style.display = "none";
	gstats.dOver.style.display = "none";
	gstats.dGame.style.display = "none";
	gstats.dPause.style.display = "none";
	gstats.dMenu.style.display = "block";

	//on initi le storage
	gstats.stor = new storage();
	if(k = gstats.stor.StorageLect('key')){
		vKey = k;
		var htouch = document.querySelectorAll('.touch-GAUCHE')[0];
			htouch.innerHTML = String.fromCharCode(vKey['GAUCHE']);
			htouch = document.querySelectorAll('.touch-DROITE')[0];
			htouch.innerHTML = String.fromCharCode(vKey['DROITE']);
			htouch = document.querySelectorAll('.touch-SPACE')[0];
			htouch.innerHTML = String.fromCharCode(vKey['SPACE']);
			
	}
	else{
		gstats.stor.StorageEcrit('key', vKey);
	}
	
	if(k = gstats.stor.StorageLect('highScore')){
		var htouch = document.querySelectorAll('.highscore');
			for(var i = 0; i < htouch.length; i ++){
				htouch[i].innerHTML = k['score'];
			}
	}
	
	initMenuSelectSkin(); //on initialise le menu de choix des skins
	loadSkin(); //on charge le skin 
	changeSkinHero(); //on charge le skin pour le héro
	
	loadSound('sound/music.mp3', 'music');
	loadSound('sound/shoot.wav', 'fire');
	loadSound('sound/invaderkilled.wav', 'killEnnemi');
	loadSound('sound/explosion.wav', 'killPlayer');

	
	$.click('.option', (function(){
		gstats_modif(Array('aMenu', 'aOption'));
		dstats_toggle(Array('dOption', 'dMenu'));
	}));
		
	$.click('.newgame', (function(e){ 
		gstats_modif(Array('aMenu', 'aGame'));
		dstats_toggle(Array('dGame', 'dMenu')); 
	}));
	
	$.click('.touch-assign', (function(e){ config_touche_option(this, e); }) );
	
	//gyro();
	ui();
	
}

function ui(){		
		//si on est dans le menu principal
	$.key('html', (function(e){
		if(gstats.aMenu){
			//si on appuie sur la touche entrer
			if(e.keyCode == vKey['ENTRER']){
				gstats_modif(Array('aMenu', 'aGame'));
				dstats_toggle(Array('dGame', 'dMenu'));
			}
			
		}
		else if(gstats.aOver){
			if(e.keyCode == vKey['ENTRER']){
				gstats_modif(Array('aGame', 'aOver'));
				dstats_toggle(Array('dOver', 'dGame'));
				//gstats_modif(Array('aMenu'));
				
			}				
		}
		else if(gstats.aOption){
			_option(e);
		}
		else if(gstats.aPause){
			if(e.keyCode == vKey['PAUSE']){
				gstats_modif(Array('aPause', 'aGame'));	
				dstats_toggle(Array('dPause', 'dGame'));
			}
		}
		else if(gstats.aGame){
			gstats.dOver.style.display = "none";
			gstats.dPause.style.display = "none";
			gstats.dMenu.style.display = "none";
			gstats.dOption.style.display = "none";
			gstats.dGame.style.display = "block";
			_game(e);
			game(e);
		}
		
		if(e.keyCode == vKey["ESCAPE"]){
			gstats.aMenu = true; 
			gstats_modif(Array('aPause', 'aGame', 'aOver', 'aOption', 'aOptionKey'), false);	
			//_gameDestruct(true); à réactiver en temps voulu
			gstats.dOver.style.display = "none";
			gstats.dPause.style.display = "none";
			gstats.dMenu.style.display = "block	";
			gstats.dOption.style.display = "none";
			gstats.dOptionKey.style.display = "none";
			gstats.dGame.style.display = "none";
		}
	}));

}

function _game(e){
	
	if(!gstats.GameInit){
		initEnnemy();
		initShield();
		gstats.GameInit = true;
		
		//déplacement du background
		interval['gameBackground'] = setInterval((function(){
			bg = bg + 10;
			gstats['dContainer'].style.backgroundPosition = "0 "+bg+"px";
		}), 45);
		
		interval['moveEnemy'] = setInterval(moveEnemy, 100);
		interval['weaponMove'] = setInterval(weaponMove, 10);
		interval['shootEnnemy'] = setInterval(shootEnnemy, 800);
		interval['shootEnnemyMove'] = setInterval(shootEnnemyMove, 50);
		interval['conditionVictoire'] = setInterval(conditionVictoire, 50);
		interval['conditionDefaite'] = setInterval(conditionDefaite, 50);
		//playSound('music', true);
		
		gstats.aGame = true;
	}

}



function game(e){

		var joueur = document.getElementById('joueur');
		var widthCONTAINER = gstats['dContainer'].offsetWidth;
		var joueurv= joueur.offsetWidth;
	  	  
		/*var landscapeOrientation = window.innerWidth/window.innerHeight > 1;
		if ( landscapeOrientation) {
			vx = vx + ay;
			vy = vy + ax;
		// }*/
	  
		//conditionVictoire();
		var vitesse = 30;
			 if(e.keyCode == vKey['GAUCHE'] || e.keyCode == vKey['Q'])
			 {
				 /* Pour la touche gauche */
				 var i = joueur.offsetLeft;
				 if(i>10){
					joueur.style.left = (i - vitesse) + 'px';
				}
			 }
			 else if(e.keyCode == vKey['DROITE'] || e.keyCode == vKey['D'])
			 {
				 /* Pour la touche droite */
				 var i = joueur.offsetLeft;
				 if(i<(widthCONTAINER-(joueurv*1.3))){
					joueur.style.left = (i + vitesse) + 'px';
				 }
			 }
			 
			 if(e.keyCode == vKey['SPACE']){
				 weaponAdd(joueur);
			 }
			else if(e.keyCode == vKey['PAUSE']){
				gstats_modif(Array('aPause', 'aGame'));
				dstats_toggle(Array('dPause', 'dGame'));
			}
			
			var landscapeOrientation = window.innerWidth/window.innerHeight > 1;
				if ( landscapeOrientation) {
				}
}


//fonction temporaire ?
function gyro(){
	
	if(gstats['aGame']){
		window.ondeviceorientation = function(event) {
			beta = Math.round(event.beta);
			joueur.style.left = event.beta;
		};
	}
	
	/*if (window.DeviceMotionEvent != undefined) {
		window.ondevicemotion = function(e) {
			ax = event.accelerationIncludingGravity.x * 5;
			ay = event.accelerationIncludingGravity.y * 5;
		
		}
	}*/
}

function _option(e){
	if(gstats.aOption){
		if(gstats.aOptionKey){
			var touch = e.keyCode;
			gstats.dOptionKey.style.display = "none";
			vKey[gstats.aOptionKeyCustom] = touch;
			
			var htouch = document.querySelectorAll('.touch-'+gstats.aOptionKeyCustom)[0];
			htouch.innerHTML = String.fromCharCode(touch);
			gstats.aOptionKey = false;
			gstats.stor.StorageEcrit('key', vKey);
		}
	}
}

//fonction pour permettre à utilisateur de configurer touche
function config_touche_option(elem, e){
	gstats.dOptionKey.style.display = "block"; 
	gstats.aOptionKeyCustom = elem.dataset.touch;
	gstats.aOptionKey = true;
	
}

function _gameDestruct(resetAll = true){
	//il faut encore supprimer les bullets, remettre a sa position les ennemis ainsi que les scores
	gstats.GameInit = false;
	
	for(i in interval){ clearInterval(interval[i]); }
	interval.length = 0;
	
	var x = document.querySelectorAll('#blockennemi')[0];
	x.style.top = "30px";
	x.style.left = "5px";
	
	x = document.querySelectorAll('.ennemy');
	for(var i = 0; i < x.length; i ++){ 
		removeDiv('dBlockEnnemi', x[i]); 
	}
	
	x = document.querySelectorAll('.Missile');
	for(var i = 0; i < x.length; i ++){ 
		removeDiv('dContainer', x[i]); 
	}
	
	x = document.querySelectorAll('.missileEnnemy');
	for(var i = 0; i < x.length; i ++){ 
		removeDiv('dContainer', x[i]); 
	}
	
	listMonstre = new Array();
	
	if(!resetAll){
		gstats_modif(Array('aGame'));
		killTotalMove = 0;
		countLastKill = 0;
		victoire = 0;
		_game();
	}
	else{
		pv = 3;
		var pdv = document.querySelectorAll('.pv');
		
		for(var i = 0; i < pdv.length; i ++){ 
			pdv[i].style.display = "inline-block"; 
		}
		
		//gstats_modif(Array('aOver'));
		gstats.dGame.style.display = "none";
	}
	
	
		var sscore = 0;		
		if(sscore = gstats.stor.StorageLect('highScore')){
			
			if(sscore != 'null'){
				sscore = 0;
			}
			
			if(vscore > sscore){
				gstats.stor.StorageEcrit('highScore', {'score': vscore});
				sscore = vscore;
			}
		}
		else{
			gstats.stor.StorageEcrit('highScore', {'score': vscore});
			sscore = vscore;
		}
		
		x = document.querySelectorAll('.ui-score')[0];
		x.innerHTML = vscore;
		
		x = document.querySelectorAll('.highscore')[0];
		x.innerHTML = sscore;
		
		victoire = 0;
	

	//stopSound('music');
	
}

