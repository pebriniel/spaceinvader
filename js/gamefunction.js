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

//on ajoute le tir du joueur
function weaponAdd(origin){
	if(gstats.aGame){
		var missile = document.querySelectorAll('.Missile')

		 if(missile.length < gstats.HeroWeaponMax){
			 console.log('dev');
			if(gstats.HeroWeapon == 1){
				var myWeap = document.createElement('div');

				myWeap.classList.add('Missile');
				myWeap.style.left = (origin.offsetLeft + (origin.offsetWidth/2)) + "PX";
				myWeap.style.top = (origin.offsetTop - 12)  + "PX";
				document.querySelectorAll('#container')[0].appendChild(myWeap);

				playSound('fire');
			}
			else if(gstats.HeroWeapon == 2){
				var myWeap = document.createElement('div');

				myWeap.classList.add('Missile');
				myWeap.style.left = (origin.offsetLeft ) + "PX";
				myWeap.style.top = (origin.offsetTop - 12)  + "PX";
				document.querySelectorAll('#container')[0].appendChild(myWeap);
				
				var myWeap2 = document.createElement('div');

				myWeap2.classList.add('Missile');
				myWeap2.style.left = (origin.offsetLeft + (origin.offsetWidth)) + "PX";
				myWeap2.style.top = (origin.offsetTop - 12)  + "PX";
				document.querySelectorAll('#container')[0].appendChild(myWeap2);
				
				
				playSound('fire');
			}
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
				missile[i].style.top = (posy - gstats.vHeroWeapon) + "px";
				destroy = false;
			}

			if(destroy || collision(missile[i]) || boundShield(missile[i], "JOUEUR")){
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

//on vérifie les collisions gauche/droite des ennemis
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
			stopSound("music");
		}
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
			 playSound('killPlayer');
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
		var container = document.getElementById('container');
		for( var i = 0; i < missile.length; i ++ ) {
			var posy = missile[i].offsetTop;
			
			if( posy <= (container.offsetHeight - missile[i].offsetHeight - 10)){
					missile[i].style.top= (posy + gstats.vEnnemiWeapon) + "px";
					destroy = false;
				}

				if(destroy || collisionVaisseau(missile[i]) || boundShield(missile[i], "ENNEMI")){
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

/* -- tout ce qui concerne les boucliers sont ici -- */
/* initialisation des boucliers */


var defaultShield = {
	posx: 150, //position x 
	posy: 300, //position y
	sx: 10, //taille des sprites
	sy: 10, //taille des sprites
	lx: 6, //nombre de colonne
	ly: 6, //nombre de ligne
	tableau: false
};

//nombre de shield;
var sh = new Array();
function initShield(){
	
	var shield = document.querySelectorAll('.shield');

	var a = new Array();
	for(var ligne = 0; ligne < defaultShield.ly; ligne ++){
		a.push(ligne);
		a[ligne] = new Array();
		for(var colonne = 0; colonne < defaultShield.lx; colonne ++){
			a[ligne].push(colonne);
			a[ligne][colonne] = new Array();
			a[ligne][colonne].display = true;
			a[ligne][colonne].pv = 10;
		}
	}
	
	defaultShield.tableau = new Array();
	defaultShield.tableau.push(a);
	
	//show add div
	for(var i = 0; i < shield.length; i ++){
		//position du wall
		wy = (gstats['dContainer'].offsetHeight * 70) / 100;
		wx = (gstats['dContainer'].offsetWidth * (25 * i)) / 100;
		
		shield[i].style.top = wy + "px";
		shield[i].style.left = (wx + 150) + "px";
		//on multiplie le nombre de ligne et la taille des sprites pour avoir la taille du mur en lui même
		shield[i].style.width = defaultShield['lx'] * defaultShield['sx']+"px";
		shield[i].style.height = defaultShield['ly'] * defaultShield['sy']+"px";
		//console.log(shield[i]);
		for(var y = 0; y < defaultShield['ly']; y ++){
			for(var x = 0; x < defaultShield['lx']; x ++){
				var wall = document.createElement('div');
				wall.classList.add('wall', 'wall-'+i+'-colonne-'+x);
		
				wall.style.top = (y * defaultShield.sy)+"px";
				wall.style.left = (x * defaultShield.sx)+"px";
				shield[i].appendChild(wall);
			}
		}
		
		
	}
}

function boundShield(elem, type){
	var shield = document.querySelectorAll('.shield');
	boundElem = elem.getBoundingClientRect();
	
	for(var u = 0; u < shield.length; u ++){
		var bound = shield[u].getBoundingClientRect();
		//on vérifie que les coordonnées correspondent...
		if(boundElem.left > bound.left && boundElem.left < (bound.left + bound.width) && 
			boundElem.top > bound.top  && boundElem.top < (bound.top + bound.height)){
			//coord = parseInt((bound.left - bound.left) + (10 * 5)) / elem.left;
			
			coord = parseInt(((boundElem.left + boundElem.width) - bound.left) / (defaultShield.lx * 2));
			console.log(coord);
			maxTop = 100000;
			maxBottom = 0;
			maxTopID = 0;
			maxBottomID = 0;
			if(coord < defaultShield.lx){
				 var wall = document.querySelectorAll('.wall-'+u+'-colonne-'+coord );
				//var wall2 = document.querySelectorAll('.wall-colonne-0')[0];
				 for(var i = 0; i < wall.length; i++){ //valeur 15 temporaire
					 var obj = wall[i].getBoundingClientRect();

					 if(type == "ENNEMI"){
						 if(wall[i].style.display != "none"){
							 if(maxTop > obj.top){
								maxTop = obj.top;
								maxTopID = wall[i];
								console.log("ok");
							}
						 }
					 }
					 if(type == "JOUEUR"){
						if(wall[i].style.display != "none"){
							if(maxBottom < obj.bottom){
								maxBottom = obj.bottom;
								maxBottomID = wall[i];
							}
						}
						
					 }
				}
				
				// if(maxBottom > obj.bottom){
					if(maxBottomID != 0){
						maxBottomID.style.display = "none";
						
						return true;
					}
					
					if(maxTopID != 0){
						maxTopID.style.display = "none";
						
						return true;
					}
				// }
				//.removeChild(maxBottomID);
				
				//return true;
			}
		}
	}
	
	return false;
}









//joueur 
function deplPlayer(dir){
	var joueur = document.getElementById('joueur');
	var widthCONTAINER = gstats['dContainer'].offsetWidth;
	var joueurv = joueur.offsetWidth;
		
	if(dir == "GAUCHE"){
		var i = joueur.offsetLeft;
		 if(i > 10){
			joueur.style.left = (i - gstats.vHero) + 'px';
		}
	}
	else{
		/* Pour la touche droite */
		 var i = joueur.offsetLeft;
		 if(i<(widthCONTAINER-(joueurv*1.3))){
			joueur.style.left = (i + gstats.vHero) + 'px';
		 }
	}
}

//les points de vie du joueur (on les caches);
function vie(_pv){
	if(typeof _pv !== 'undefined'){
		pv += _pv;
	}
	var vie1 = document.getElementById('vie-'+pv);
	vie1.style.display = "none";
}


