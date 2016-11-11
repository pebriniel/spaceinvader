//on initialise les ennemis en les affichant tous
function initEnnemy(){
	var nb = 0;
	
	for (var ligne = 0; ligne < 5; ligne++){
		for (var colonne = 0; colonne < 12; colonne++){
			var myDiv = document.createElement("div");

			myDiv.classList.add('ennemy', 'ennemy-'+gstats.skin+'-'+ligne, 'en-'+ligne+'-'+colonne, 'ennemy-'+ligne, 'colenemy-'+colonne);
			myDiv.dataset.score = ligne;
			myDiv.dataset.id = nb;
			myDiv.style.padding = "2.43%";
			myDiv.style.left = colonne * 8.53 + "%";
			myDiv.style.top = ligne * 28 + "%";
			document.querySelectorAll('#blockennemi')[0].appendChild(myDiv);
			
			listMonstre.push(new Monstre(true));
			nb ++;
		}
	}
}

function initShield(){
	var shield = document.querySelectorAll('.shield');
	
	for(var i = 0; i < shield.length; i ++){
		
	}
}

//on ajoute le tir du joueur
function weaponAdd(origin){
	if(gstats.aGame){
		var missile = document.querySelectorAll('.Missile')

		 if(missile.length < 2){
			  var myWeap = document.createElement('div');

			  myWeap.classList.add('Missile');
			  myWeap.style.left = (origin.offsetLeft + (origin.offsetWidth/2)) + "PX";
			  myWeap.style.top = (origin.offsetTop - 12)  + "PX";
			  document.querySelectorAll('#container')[0].appendChild(myWeap);
		 }
	}
}

//on supprime le tir du joueur
function removeDiv(key, elem){
	gstats[key].removeChild(elem);
}

//on déplace le tir du joueur
function weaponMove(){
	if(gstats.aGame){ //on vérifie que le jeu soit lancé
		var destroy = true;
		var missile = document.querySelectorAll(".Missile");
		for( var i = 0; i < missile.length; i ++ ) {
			var posy = missile[i].offsetTop;
			if( posy >= 0){
				missile[i].style.top = (posy - 10) + "px";
				destroy = false;
			}

			if(destroy || collision(missile[i])){
				removeDiv('dContainer', missile[i]);
				//weaponRemove(missile[i]);
				
				if(destroy){
					if(vscore > 0){
						score(-5);
					}
				}
			}
		}
		scoreShow();
	}
}

//collision entre le tir du joueur et les ennemis
function collision(e){
	if(gstats.aGame){
		var contentTop = gstats['dBlockEnnemi'].offsetTop;
		var contentLeft = gstats['dBlockEnnemi'].offsetLeft;

		var allEnnemy = document.querySelectorAll(".ennemy");
		var bulletX = e.offsetLeft;
		var bulletY = e.offsetTop;

		var bulletHeight = e.offsetHeight;
		for (var x = 0; x < allEnnemy.length; x ++){
			var EnSize = allEnnemy[x].offsetWidth;
			var EnnemyX = allEnnemy[x].offsetLeft + contentLeft;
			var EnnemyY = allEnnemy[x].offsetTop + contentTop;
			if( (bulletX > EnnemyX && bulletX < (EnnemyX + EnSize)) && (bulletY  > EnnemyY && (bulletY + bulletHeight) < (EnnemyY + EnSize))   ){
				allEnnemy[x].style.display = "none";
				listMonstre[allEnnemy[x].dataset.id].display = false;
				playSound('killEnnemi');
				score(score_data[allEnnemy[x].dataset.score]);
				return true;
			}
		}
	}
	
	return false;
}

  
  //gestion des scores 
function score(val){ vscore += val; }
function scoreShow(){ gstats.dScore.innerHTML = vscore; }

function getMaxBound(){
	
	juennemi = document.getElementsByClassName('ennemy');
	
	myObj = {};
	myObj.maxRight = 0;
	myObj.maxRightID = 0;
	myObj.maxLeft = 1000000;
	myObj.maxLeftID = 0;
	myObj.maxTop = 0;
	myObj.maxTopID = 0;
	myObj.maxBottom = 0;
	myObj.maxBottomID = 0;
	
	for(var i = 0; i < juennemi.length; i++){
		var obj = juennemi[i].getBoundingClientRect();

		if(juennemi[i].style.display != "none"){
			if(myObj.maxLeft > obj.left){
				myObj.maxLeft = obj.left;
				myObj.maxLeftID = juennemi[i];
			}
			
			if(myObj.maxRight < obj.right){
				myObj.maxRight = obj.right;
				myObj.maxRightID = juennemi[i];
			}

			if(parseInt(obj.top) > myObj.maxTop){
				myObj.maxTop = obj.top;
				myObj.maxTopID = juennemi[i];
			}
		}
	}
	
	return myObj;
}

//la condition de vitoire
function conditionVictoire(){
	if(gstats.aGame){ //on vérifie que le jeu soit lancé	
		var nbMort = 0;
		
		for(var i = 0; i < listMonstre.length; i ++){
			if(!listMonstre[i].display){
				nbMort ++;
			}
		}
		
		countLastKill = nbMort;
		if(nbMort == listMonstre.length){
		//if(nbMort == 1){
			_gameDestruct(false);
			//stopSound("music");
		}
	}
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

//on vérifie que les ennemis ne touche pas la ligne virtuel OU que le nombre de pv n'est pas égal à 0 
function conditionDefaite(){
	if(gstats.aGame){
		var top = getMaxBound()['maxTop'];
		var lignevirtuel = (gstats['dContainer'].offsetHeight * 85) / 100; // (100 * container.offsetHeight) / 100 ;

		if (top >= lignevirtuel || pv == 0){
			gstats_modif(Array('aGame', 'aOver'));
			dstats_toggle(Array('dGame', 'dOver'));
			_gameDestruct();
		}
	}
}


// Fonction qui fait tiré les ennemis //

function shootEnnemy(){
	if(gstats.aGame){
		var blockEnnemy = document.getElementById('blockennemi');
		var shootEnnemy = document.createElement('div');

		var shootrndCol= Math.floor(Math.random() * (11 - 1) + 1);
		var ennemy = document.getElementsByClassName('colenemy-'+ shootrndCol);
		var result, resultBound;

		var topVirtuel = 0;
		for(var i = 0; i < ennemy.length; i++){
			var obj = ennemy[i].getBoundingClientRect();
			
			if(parseInt(obj.top) > topVirtuel){
				result = ennemy[i];
				resultBound = obj;
			}		
		}
	
		if(listMonstre[shootrndCol].display){
			shootEnnemy.classList.add('missileEnnemy');
			shootEnnemy.style.left = (result.offsetLeft + blockEnnemy.offsetLeft + 10) + "px";
			shootEnnemy.style.top = (result.offsetTop + blockEnnemy.offsetTop - 12)  + "px";
			document.getElementById('container').appendChild(shootEnnemy);
			
			boucle = false;
		}
	}
}


// Tir des ennemis
function shootEnnemyMove(){
	if(gstats.aGame){ //on vérifie que le jeu soit lancé
		var destroy = true;
		var missile = document.querySelectorAll(".missileEnnemy");
		var container=document.getElementById('container');
		for( var i = 0; i < missile.length; i ++ ) {
				var posy = missile[i].offsetTop;
			if( posy <= (container.offsetHeight - missile[i].offsetHeight - 10)){
					missile[i].style.top= (posy + 10) + "px";
					destroy = false;
				}

				if(destroy || collisionVaisseau(missile[i])){
					removeDiv('dContainer', missile[i]);
				}
			}

	}
}

function collisionVaisseau(elem){
	if(gstats.aGame){
		var collision = false;
		var joueur = document.getElementById('joueur').getBoundingClientRect();
		elem = elem.getBoundingClientRect();
		
		if(elem.left>=joueur.left && elem.left <= (joueur.left + joueur.width ) && elem.top>=joueur.top && elem.top<=(joueur.top + joueur.height))	{
			vie(-1);
			collision = true;
		}

		return collision;
	}
}

function vie(_pv = ''){
	if(_pv != ''){
		pv += _pv;
	}
	var vie1 = document.getElementById('vie-'+pv);
	vie1.style.display="none";
}