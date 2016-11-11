	
	var deplacementHorizontale = 204;
 	var deplacementVerticale = 36;
	var limitGauche = 0;
	var limiteDroite = 0;
	
	var enn;	
	var bout = false;
	var y = 0;
	var killTotalMove = 0;
	
	function goDepl(val){
		gstats['dBlockEnnemi'].style.left = (gstats['dBlockEnnemi'].offsetLeft + val)+ 'px';
	}

	//on déplace les ennemis
 	function moveEnemy(){	
		if(gstats.aGame){
			limiteDroite = gstats['dContainer'].offsetWidth;
			
			enn = gstats['dBlockEnnemi'];
			y = enn.offsetTop;

			if(killTotalMove != countLastKill && (countLastKill == 20 || countLastKill == 25 || countLastKill == 30 || countLastKill == 40 || countLastKill == 45)){
				deplacementHorizontale = deplacementHorizontale + (countLastKill);
				killTotalMove = countLastKill;
			}

			myObjet = getMaxBound();
			
			if (!bout){
				if((myObjet.maxRight + myObjet.maxRightID.offsetWidth) > limiteDroite){
					bout = true;
					enn.style.top = (y+deplacementVerticale)+ 'px'; 
				}
				else{
					goDepl(deplacementHorizontale);
				}
			}

			else {
				
				if((myObjet.maxLeft - myObjet.maxLeftID.offsetWidth)<limitGauche){
					bout = false;
					enn.style.top = (y+deplacementVerticale)+ 'px';
				}
				else{
					goDepl(-deplacementHorizontale);
				}	
			}
		}
 	}
 	


