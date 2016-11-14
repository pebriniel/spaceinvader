	
	var deplacementHorizontale = 204;
 	var deplacementVerticale = 36;
	
	var bout = false;
	var killTotalMove = 0;
	
	function goDepl(val){
		gstats['dBlockEnnemi'].style.left = (gstats['dBlockEnnemi'].offsetLeft + val)+ 'px';
	}
	
	//on déplace les ennemis
 	function moveEnemy(){	
		if(gstats.aGame){
			var limitGauche = 0;
			var limiteDroite = gstats['dContainer'].offsetWidth;
			
			var blockEnnemi = gstats['dBlockEnnemi'];
			var blockEnnemiTop = blockEnnemi.offsetTop;

			if(killTotalMove != countLastKill && (countLastKill == 20 || countLastKill == 25 || countLastKill == 30 || countLastKill == 40 || countLastKill == 45)){
				deplacementHorizontale = deplacementHorizontale + (countLastKill);
				killTotalMove = countLastKill;
			}

			myObjet = getMaxBound();
			
			if (!bout){
				if((myObjet.maxRight + myObjet.maxRightID.offsetWidth) > limiteDroite){
					bout = true;
					blockEnnemi.style.top = (blockEnnemiTop + deplacementVerticale)+ 'px'; 
				}
				else{
					goDepl(deplacementHorizontale);
				}
			}

			else {
				
				if((myObjet.maxLeft - myObjet.maxLeftID.offsetWidth)<limitGauche){
					bout = false;
					blockEnnemi.style.top = (blockEnnemiTop + deplacementVerticale)+ 'px';
				}
				else{
					goDepl(-deplacementHorizontale);
				}	
			}
		}
 	}
 	


