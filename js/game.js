
//on change la valeur des variables contenu dans gstats
function gstats_modif(key, val){
	//si aucune valeur n'est donnée à val
	if(typeof val === 'undefined'){
		//on switch entre false et true les variables
		for(i in key){ (gstats[key[i]]) ? gstats[key[i]] = false : gstats[key[i]] = true; }
	}
	else{
		//si val possède une valeur on l'applique à toutes les clés voulu
		for(i in key){ gstats[key[i]] = val; }
	}
}

//on cache/affiche les div contenu dans gstats
function dstats_toggle(key){
	//on cache toutes les divs contenu dans l'array key
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
	//si la clé "key_custom" existe dans le local storage du navigateur de l'utilisateur
		s = gstats.stor.StorageLect('key_sound');
		if(s != 'null'){
			document.getElementsByName('sound-btn')[0].checked = s;
			gstats.playSound = s;
		}
	
	if(k = gstats.stor.StorageLect('key_custom')){
		vKey = k;
		//on affiche toutes les touches sélectionné par le joueur dans chacune des divs 
		var htouch = document.querySelectorAll('.touch-GAUCHE')[0];
			htouch.innerHTML = String.fromCharCode(vKey['GAUCHE']);
			htouch = document.querySelectorAll('.touch-DROITE')[0];
			htouch.innerHTML = String.fromCharCode(vKey['DROITE']);
			htouch = document.querySelectorAll('.touch-SPACE')[0];
			htouch.innerHTML = String.fromCharCode(vKey['SPACE']);
			
	}
	//si la clé "key_custom" n'existe pas, on l'initie et la crée avec les valeurs par defaults
	else{
		gstats.stor.StorageEcrit('key_custom', vKey);
	}
	
	//on récupère les highScore de l'utilsiateur
	if(k = gstats.stor.StorageLect('highScore')){
		//on récupère toutes les divs "highscore" existante pour leur assigner les scores enregistrés
		var htouch = document.querySelectorAll('.highscore');
			for(var i = 0; i < htouch.length; i ++){
				htouch[i].innerHTML = k['score'];
			}
	}
	
	initMenuSelectSkin(); //on initialise le menu de choix des skins
	loadSkin(); //on charge le skin 
	changeSkinHero(); //on charge le skin pour le héro
	
	//on charge tous les sons du jeu
	loadSound('sound/music.mp3', 'music'); //la musique
	loadSound('sound/shoot.wav', 'fire'); //quand le joueur tir
	loadSound('sound/invaderkilled.wav', 'killEnnemi'); //quand un ennemi se fait touché
	loadSound('sound/explosion.wav', 'killPlayer'); //quand le joueur perds

	
	//la touche qui active les options aux clique de l'utilisateur
	$.click('.option', (function(){
		//on modifie la variable Action Menu (false) et Action Option (true)
		gstats_modif(Array('aMenu', 'aOption'));
		//on affiche les variables div Option (block) et div Menu (none)
		dstats_toggle(Array('dOption', 'dMenu'));
	}));
		
	//la touche qui execute une nouvelle partie au clique
	$.click('.newgame', (function(e){ 
		gstats_modif(Array('aMenu', 'aGame'));
		dstats_toggle(Array('dGame', 'dMenu')); 
	}));
	
	
	//le bouton d'activation/désactivation du son
	$.click('.checkboxThree', (function(){
		var btn = document.getElementsByName('sound-btn')[0];
		gstats.playSound = btn.checked;
		gstats.stor.StorageEcrit('key_sound', btn.checked);
	}));
	//touche qui permet d'initier le menu de sélection des nouvelles touches dans les options
	$.click('.touch-assign', (function(e){ config_touche_option(this, e); }) );
	
	//event qui s'occupe du détecteur de mouvement (pour smartphone/tablette)
	if(window.DeviceOrientationEvent) {
		window.addEventListener("devicemotion", gyro, false);
	} else {
		//console.log("Le navigateur ne supporte pas l'événement deviceorientation");
	}
	
	$.click('#ecranStart', (function(ev) {
		if(gstats.aMenu){	
			gstats_modif(Array('aMenu', 'aGame'));
			dstats_toggle(Array('dGame', 'dMenu'));
			_game();
		}
	}));
	
	//gstats.dMenu.addEventListener('touchstart', (function(ev) {
	$.click('#container', (function(ev) {
		if(gstats.aGame){
			weaponAdd(joueur);
		}
	}), false);
	
	$.click('#gameOver', (function(ev) {
		gstats_modif(Array('aGame', 'aOver'));
		dstats_toggle(Array('dOver', 'dGame'));
		//gstats_modif(Array('aMenu'));
	}
	));
	//on execute l'interface principal !
	ui();
	
}

function ui(){		
	//l'interface clavier/utiisateur principal
	$.key('html', (function(e){
		//si le menu est activé
		if(gstats.aMenu){
			//et que l'on appuie sur "entrer" on lance le jeu
			if(e.keyCode == vKey['ENTRER']){
				gstats_modif(Array('aMenu', 'aGame'));
				dstats_toggle(Array('dGame', 'dMenu'));
			}
			
		}
		//si on est dans le menu Game Over 
		else if(gstats.aOver){
			//et que l'on appuie enretrer on relance le jeu
			if(e.keyCode == vKey['ENTRER']){
				gstats_modif(Array('aGame', 'aOver'));
				dstats_toggle(Array('dOver', 'dGame'));
				//gstats_modif(Array('aMenu'));
				
			}				
		}
		//si on est dans le menu "option"
		else if(gstats.aOption){
			//on y execute la fonction associé
			_option(e);
		}
		//si on est dans le menu pause
		else if(gstats.aPause){
			//et que l'on appuie "pause" on active/désactive la pause
			if(e.keyCode == vKey['PAUSE']){
				gstats_modif(Array('aPause', 'aGame'));	
				dstats_toggle(Array('dPause', 'dGame'));
			}
		}
		//si on est en jeu
		else if(gstats.aGame){
			//on cache toutes les divs inutiles
			gstats.dOver.style.display = "none";
			gstats.dPause.style.display = "none";
			gstats.dMenu.style.display = "none";
			gstats.dOption.style.display = "none";
			gstats.dGame.style.display = "block";
			//on lance la fonction qui initie le jeu
			_game(e);
			//game est la fonction principal d'evenement du jeu
			game(e);
		}
		
		//quelque soit l'état du jeu (jeu, option, menu etc.)
		//et que l'on appuie sur la touche échap
		//on retourne au menu principal 
		if(e.keyCode == vKey["ESCAPE"]){
			//on active le menu
			gstats.aMenu = true;
			//on désactive tous les autres écrans du jeu
			gstats_modif(Array('aPause', 'aGame', 'aOver', 'aOption', 'aOptionKey'), false);	
			//_gameDestruct(true); à réactiver en temps voulu 
			
			//on cache tout...
			gstats.dOver.style.display = "none";
			gstats.dPause.style.display = "none";
			gstats.dMenu.style.display = "block	"; //sauf celle-ci qui est l'écran du menu principal
			gstats.dOption.style.display = "none";
			gstats.dOptionKey.style.display = "none";
			gstats.dGame.style.display = "none";
		}
	}));

}

//on initie le jeu avec cette fonction
function _game(e){
	
	//si le jeu n'est pas déjà initié
	if(!gstats.GameInit){
		//on génère tous les ennemis
		initEnnemy();
		
		//on initie les boucliers 
		initShield();
		
		//on dit que le jeu est initisé
		gstats.GameInit = true;
		
		//déplacement du background
		interval['gameBackground'] = setInterval((function(){
			bg = bg + 10;
			gstats['dContainer'].style.backgroundPosition = "0 "+bg+"px";
		}), 45);
		
		//tous les setInterval
		interval['moveEnemy'] = setInterval(moveEnemy, 100);
		interval['weaponMove'] = setInterval(weaponMove, 20);
		interval['shootEnnemy'] = setInterval(shootEnnemy, 800);
		interval['shootEnnemyMove'] = setInterval(shootEnnemyMove, 60);
		interval['conditionVictoire'] = setInterval(conditionVictoire, 50);
		interval['conditionDefaite'] = setInterval(conditionDefaite, 50);
		playSound('music', true); //execution de la musique
		
		gstats.aGame = true; 
	}

}


//la fonction principal qui gère l'interaction entre le script et le joueur
function game(e){

		//on récupère l'élément joueur
		var joueur = document.getElementById('joueur');
		
		
			//si nous appuyons sur la touche gauche ou la touche Q
			 if(e.keyCode == vKey['GAUCHE'] || e.keyCode == vKey['Q']){
				deplPlayer("GAUCHE"); //on déplace le héro sur la gauche
			 }
			 //si nous appuyons sur la touche droite ou D
			 else if(e.keyCode == vKey['DROITE'] || e.keyCode == vKey['D']){
				 deplPlayer("DROITE"); //on déplace le héro sur la droite
			 }
			 
			 //si on appuie sur la touche espace
			 if(e.keyCode == vKey['SPACE']){
				 weaponAdd(joueur);
			 }
			 //si on appuie sur "pause"
			else if(e.keyCode == vKey['PAUSE']){
				gstats_modif(Array('aPause', 'aGame'));
				dstats_toggle(Array('dPause', 'dGame'));
			}
}


//fonction temporaire ?
function gyro(){

	var y = event.accelerationIncludingGravity.y;
	var landscapeOrientation = window.innerWidth/window.innerHeight > 1;
	
	//inutilsé, si on est en paysage ou non, on active/désactive le jeu
	if ( landscapeOrientation) {
		//si c'est le jeu qui est activé
		if(gstats.aGame){
			//si le mobile penche sur la gauche
			if(y < -2){
				//on déplace le héro à gauche
				deplPlayer("GAUCHE");
			}
			//si il penche à droite
			else if(y > 2){
				//le héro va à droite
				deplPlayer("DROITE");
			}
		}
	}
	else{
		//on affiche une div qui indique à l'utilisateur de passer en mode paysage...
		
	}
}

function _option(e){
	if(gstats.aOption){
		//customisation des touches
		if(gstats.aOptionKey){
			var touch = e.keyCode;
			gstats.dOptionKey.style.display = "none";
			vKey[gstats.aOptionKeyCustom] = touch;
			
			var htouch = document.querySelectorAll('.touch-'+gstats.aOptionKeyCustom)[0];
			htouch.innerHTML = String.fromCharCode(touch);
			gstats.aOptionKey = false;
			gstats.stor.StorageEcrit('key_custom', vKey);
		}
	}
}

//fonction pour permettre à utilisateur de configurer touche
function config_touche_option(elem, e){
	gstats.dOptionKey.style.display = "block"; 
	gstats.aOptionKeyCustom = elem.dataset.touch;
	gstats.aOptionKey = true;
	
}


//on détruit le jeu
function _gameDestruct(resetAll){
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
	
	if(typeof resetAll !== 'undefined'){
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
	

	stopSound('music');
	
}


//gestion des skins 
function loadSkin(){
	var lect = gstats.stor.StorageLect('skin');
	
	if(lect != null){
		gstats.skin = lect['skin'];
	}
}

//quand le joueur selectionne un skin
function initMenuSelectSkin(){
	$.click(".item-skin", (function(e){
		gstats.skin = this.dataset.skin;
		gstats.stor.StorageEcrit('skin', {skin:gstats.skin});
		changeSkinHero();
	}));
}

//on change le skin du héro
function changeSkinHero(){
	var hero = document.getElementById("joueur");
	hero.classList.add('hero-'+gstats.skin);
}


//gestion de session storage (on sauvegarde les stats, les skins etc du joueur)
function storage(){
	this.StorageLect = function(key){
		var monobjet_json = sessionStorage.getItem(key);
		return(JSON.parse(monobjet_json));
	}
	
	this.StorageEcrit = function(key, val){
		sessionStorage.setItem(key, JSON.stringify(val));
	}
}