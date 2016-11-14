var listMonstre = new Array();

function Monstre(display){
	this.display = display;
}

//console.log("dev"+String.fromCharCode(13));

var vscore = 0;
var score_data ={0:100,1:80,2:60,3:40, 4:20, 5:10};
var variableNav; //pour le local storage;

var gstats = {
	'dLoading' : false,
	'dContainer' : false,
	'dBlockEnnemi' : false,
	
	'aMenu' : false, /* action du joueur pour le menu */
	'dMenu' : false, /* div du menu */
	
	'aGame' : false, /* action du joueur dans le jeu */
	'dGame' : false, /* div de la partie */
	
	'aOption': false,
	'dOption' : false,
	'aOptionKey' : false,
	'dOptionKey' : false,
	'aOptionKeyCustom' : false,
	
	'aPause' : false, /* action du joueur dans la pause */
	'dPause' : false, /* div de la pause */
	
	'aOver' : false, /* action du joueur dans le game over */
	'dOver' : false, /* div du gamer ove */	
	
	'dScoreScreen' : false, //écran des scores/victoires
	'aScore' : false, //action de l'écran des scores/victoires
	
	'GameInit' : false, //si le jeu est déjà initialisé
	'dScore' : false, //div des scores dans le jeu
	
	'stor': false,
	'skin' : 'classic', //gestion des skins
	
	'playSound': true,
	
	'vHero': 30, //vitesse du héro 
	'vHeroWeapon': 10, //vitesse du tir du héro
	'HeroWeaponMax' : 4,
	'HeroWeapon' : 2,
	
	'vEnnemi': 30, //vitesse du héro
	'vEnnemiWeapon': 13 //vitesse du héro
};

pv = 3;

var vKey = {
	'Q' : 81,
	'D' : 68,
	'ENTRER' : 13,
	'GAUCHE' : 37,
	'DROITE' : 39, 
	'PAUSE' : 80,
	'SPACE' : 32,
	'ESCAPE' : 27
};

var interval = {
	'moveEnemy' : false,
	'weaponMove' : false,
	'shootEnnemy' : false,
	'shootEnnemyMove' : false,
	'conditionVictoire' : false,
	'conditionDefaite' : false,
	'gameBackground' : false
};

var countLastKill = 0;