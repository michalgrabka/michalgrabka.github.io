/**** evolution simulator 09/2017****/
var  startTime = new Date()
	,dots 	=[]
	,fields =[]
	,hades 	=[]
	,evoltrigger = -3
	,mutationRate = 0.1
	,mutationGenes = ['aGen1A','sGen1A','aGen1B','sGen1B','aGen2A','sGen2A','aGen2B','sGen2B']
	,newFill
	,fldFill =  [23,21,19,17,15,14,17,14,10,05,00,00,00,00,00,06,09,12,15,17,
				22,21,18,15,15,17,18,19,16,06,03,00,00,00,03,09,12,15,16,17,
				21,19,16,14,16,19,20,20,16,07,04,00,00,03,09,12,12,15,16,17,
				18,17,16,14,17,20,22,21,16,07,04,00,03,05,09,09,12,15,16,16,
				15,15,14,13,18,21,22,21,16,11,05,00,03,07,08,09,12,15,19,20,
				11,10,12,14,19,22,22,21,16,11,06,00,05,09,09,09,12,15,20,21,
				08,09,10,13,19,23,23,21,19,15,07,02,06,09,10,11,12,17,21,21,
				08,10,10,21,23,25,25,23,18,11,06,03,07,08,10,11,16,20,23,15,
				07,07,19,22,23,25,23,23,16,09,06,05,08,10,12,15,20,24,22,12,
				06,07,15,18,21,23,21,21,16,11,10,05,09,12,15,19,25,23,14,10,
				00,07,14,15,17,23,23,21,22,19,15,15,17,19,22,24,23,20,15,10,
				00,00,00,10,12,21,21,22,20,16,17,17,18,18,19,19,19,15,10,07,
				00,00,06,09,15,21,22,21,21,19,18,20,20,19,17,16,14,07,06,06];
//startTime.setMinutes(startTime.getMinutes() - 59)
function startGame() {
	myObjects.fieldsConf();
	myObjects.dotsConf('R');
	hadesDisplay();
	myGameArea.start();
}
var myObjects = {
	fieldsConf : function(){
		
		var fldSize = 49;
		for (var k=0; k <= 12; k++){
			for (var i=0; i <= 19; i++){
				fields.push(new field(i*(fldSize+1),k*(fldSize+1),fldSize,fldSize,10*fldFill[(k*20)+i]))
			}
		}
	},
	dotsConf : function(){
			for (var k=0;k<=9; k++){
				var gen = 1,
					aGen1 = Math.round(Math.random() * 100 )/10000 * (Math.floor(Math.random()*2) == 1 ? 1 : -1),
					aGen2 = Math.round(Math.random() * 200 )/100,
					sGen1 = Math.round(Math.random() * 100 )/10000 * (Math.floor(Math.random()*2) == 1 ? 1 : -1),
					sGen2 = Math.round(Math.random() * 200 )/100,
					type = 'R',
					introduced = 0;
				this.dotGen(gen,aGen1,aGen2,sGen1,sGen2,type,introduced);
			}
				
		this.dotRevive();
	},
	dotGen : function(gen,aGen1,aGen2,sGen1,sGen2,type,introduced){
		this.gen = gen;
		this.aGen1 = aGen1;
		this.aGen2 = aGen2;
		this.sGen1 = sGen1;
		this.sGen2 = sGen2;
		this.type = type;
		this.introduced = introduced;
		var color = "blue",	x, y, radius = 20, hp, eat = 0, fit = 0;

		hades.push (new dot(color,x,y,radius,hp,eat,fit,gen,aGen1,aGen2,sGen1,sGen2,type,introduced))		
	},
	dotRevive : function(){
		while(dots.length < 3){		
			hades[0].x = Math.floor(Math.random() * 900) + 50
			hades[0].y = Math.floor(Math.random() * 550) + 50
			hades[0].hp = 100;
			hades[0].introduced++;
			hades[0].fit = 0;
			dots.push(hades[0]);
			hades.splice(0,1);
			evoltrigger++
		}
	}
}

var myGameArea = {
	canvas : document.createElement("canvas"),
	start : function() {
        this.canvas.width = 1000;
        this.canvas.height = 680;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
		var fCall = new constantEvents();
		this.interval3 = setInterval(fCall.growField, 10000); 
		this.interval2 = setInterval(fCall.oneSecUpdates, 1000); 
        this.interval1 = setInterval(updateGameArea, 20); 
		
        window.addEventListener('keydown', function (e) {
            e.preventDefault();
            myGameArea.keys = (myGameArea.keys || []);
            myGameArea.keys[e.keyCode] = (e.type == "keydown");
        })
        window.addEventListener('keyup', function (e) {
            myGameArea.keys[e.keyCode] = (e.type == "keydown");
        })
    },
    stop : function() {
        clearInterval(this.interval1);
		clearInterval(this.interval2);
		clearInterval(this.interval3);
    },    
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
	zoomIn : function(){
		var Page = document.getElementById('body');
		var zoom = parseInt(Page.style.zoom) + 1 +'%'
		Page.style.zoom = zoom;
		return false;
	},
	zoomOut : function(){
		var Page = document.getElementById("body");
		var zoom = parseInt(Page.style.zoom) - 1 +'%'
		Page.style.zoom = zoom;
		return false;
	},
	totalTime : function(){
		var diffSec = (new Date()-startTime) / 1000
		var timeMin = Math.floor((diffSec / 60 ) % 60); // minutes
		var timeSec = Math.floor(diffSec % 60); // seconds
		timeMin = ("00" + timeMin).substr(-2,2) 
		timeSec = ("00" + timeSec).substr(-2,2) 
		span = document.getElementById("q1");
		txt = document.createTextNode(timeMin+':'+timeSec);
		span.innerText = txt.textContent;
	},
	best : function(fit,gen,type,aGen1,aGen2,sGen1,sGen2){
		this.fit = fit;
		this.gen = gen;
		this.type = type;
		this.aGen1 = aGen1;
		this.aGen2 = aGen2;
		this.sGen1 = sGen1;
		this.sGen2 = sGen2;
		document.getElementById("bestFit").innerHTML = fit;
		document.getElementById("bestGen").innerHTML = gen;
		document.getElementById("bestType").innerHTML = type;
		document.getElementById("bestAGen1").innerHTML = aGen1;
		document.getElementById("bestAGen2").innerHTML = aGen2;
		document.getElementById("bestSGen1").innerHTML = sGen1;
		document.getElementById("bestSGen2").innerHTML = sGen2;
	}
}

function dot(color,x,y,radius,hp,eat,fit,gen,aGen1,aGen2,sGen1,sGen2,type,introduced) {
	this.speed = 0;
    this.angle = 0;
    this.moveAngle = 0;
    this.x = x;
    this.y = y;  
	this.radius = radius;
	this.hp = hp;
	this.fit = fit;
	this.gen = gen;
	this.aGen1 = aGen1;
	this.aGen2 = aGen2;
	this.sGen1 = sGen1;
	this.sGen2 = sGen2;
	this.type = type;
	this.introduced = introduced;
    this.update = function() {
        ctx = myGameArea.context;
        ctx.save();
        ctx.translate(this.x, this.y);
		this.stats()
        ctx.rotate(this.angle);
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, 2 * Math.PI, false);
		ctx.moveTo(0,-20)
		ctx.lineTo(0,0)
		ctx.fillStyle = color;
		ctx.fill();
		ctx.lineWidth = 2;
		ctx.strokeStyle = 'white';
		ctx.stroke();
		ctx.restore(); 
	}
	this.stats = function(){
		ctx.fillStyle = "rgba(0, 0, 0,0.6)";
		ctx.fillRect(-25,25,50,20)
		ctx.fillStyle = 'white';
		ctx.font = '10px Arial';
		ctx.fillText('hp: '+Math.round(this.hp),-20,33);
		ctx.fillText('g: '+this.gen+' f: '+this.fit,-20,43);
	}
    this.newPos = function() {
        this.angle += this.moveAngle * Math.PI / 180;
		this.x += this.speed * Math.sin(this.angle);
        this.y -= this.speed * Math.cos(this.angle);
	}
	this.collisionCheck = function(i){
			this.i = i
			var distX = Math.abs(this.x - fields[i].x-fields[i].w/2);
			var distY = Math.abs(this.y - fields[i].y-fields[i].h/2);
			if (distX > (fields[i].w/2 + this.radius)) {return;}
			if (distY > (fields[i].h/2 + this.radius)) {return;}
			if (distX <= (fields[i].w/2)) {return true;}
			if (distY <= (fields[i].h/2)) {return true;}
			var dx=distX-fields[i].w/2;
			var dy=distY-fields[i].h/2;
			if (dx*dx+dy*dy<=this.radius*this.radius) {return true;}
	}
	this.decrHpIncrFit = function(){
		this.hp--
		this.fit++
	}
	this.dotDie = function(k){
		this.k = k;
		if (this.hp <= 0){
			if (dots[k].fit > document.getElementById("bestFit").innerText) {
				myGameArea.best(dots[k].fit,dots[k].gen,dots[k].type,dots[k].aGen1,dots[k].aGen2,dots[k].sGen1,dots[k].sGen2)
			}
			hades.push(dots[k])
			dots.splice(k,1);
			myObjects.dotRevive();
			if (evoltrigger == 7){
				sortHadesByFit();
				evolution();
			}
			hadesDisplay(hades);
		}
	}
	this.setMove = function(i){
		this.i = i
		this.moveAngle = 0;
		this.speed = 0;
		var fieldCenterX = (fields[i].x - this.x) +25
		var fieldCenterY = (fields[i].y - this.y) +25
		var turn = Math.atan(fieldCenterX/fieldCenterY)+this.angle % (2*Math.PI)
		if (fieldCenterY<0) {turn -= Math.PI}
		if (Math.sin(turn) <= 0) {turn = -1} else {this.moveAngle = 1}
		this.moveAngle = (fields[i].fill*turn*-0.01)-1 //gen1 -0.01 do 0.01 gen2 -2 do 2
		var acceleration = Math.abs(fields[i].fill*0.01-2) //gen3 -0.01 do 0.01 gen4 -2 do 2
		this.speed = (Math.round(acceleration * 3) / 2).toFixed(1);
	}
}

function evolution(){
	
	hades.splice(1,2);
	var k = hades.length
	while(k--){
		hades[k].type = 'E'
	}
	var c1 = 1
		c2 = 2,
		c3 = 3,
		c4 = Math.floor(Math.random() *3+2)
	if (c4 == 2) {c2 = 4} else if (c4 == 3) {c3 = 4} //wybór powinien byc z góry - od 4
	//document.write(c1+' '+c2+' '+c3+' '+c4)
	this.typeA = 
	this.typeB = 'C'
	var introduced = 0

	var genA = Math.max(hades[c1].gen, hades[c2].gen) + 1
	this.aGen1A = Math.round(((hades[c1].aGen1 + hades[c2].aGen1)/2)*10000)/10000
	this.aGen2A = Math.round(((hades[c1].aGen2 + hades[c2].aGen2)/2)*100)/100
	this.sGen1A = Math.round(((hades[c1].sGen1 + hades[c2].sGen1)/2)*10000)/10000
	this.sGen2A = Math.round(((hades[c1].sGen2 + hades[c2].sGen2)/2)*100)/100
	var genB = Math.max(hades[c3].gen, hades[c4].gen) + 1
	this.aGen1B = Math.round(((hades[c3].aGen1 + hades[c4].aGen1)/2)*10000)/10000
	this.aGen2B = Math.round(((hades[c3].aGen2 + hades[c4].aGen2)/2)*100)/100
	this.sGen1B = Math.round(((hades[c3].sGen1 + hades[c4].sGen1)/2)*10000)/10000
	this.sGen2B = Math.round(((hades[c3].sGen2 + hades[c4].sGen2)/2)*100)/100
	//var asd = 'aGen1A'
	//document.getElementById("test").innerHTML = this[asd]
	/*document.getElementById("test2").innerHTML = hades[c2].aGen2
	document.getElementById("test3").innerHTML = aGen2A
	document.getElementById("test4").innerHTML = hades[c3].sGen2
	document.getElementById("test5").innerHTML = hades[c4].sGen2
	document.getElementById("test6").innerHTML = sGen2A*/
	
	if (mutationRate >= Math.random()) {
		var choosenGeneIndex = Math.floor(Math.random() * 8),
			choosenGeneName = mutationGenes[choosenGeneIndex];
		this[choosenGeneName] = mutate(choosenGeneIndex);
		this['type'+choosenGeneName.substr(5)] = 'M'
		document.getElementById("test").innerHTML = this[choosenGeneName]
		document.getElementById("test2").innerHTML = choosenGeneName
	}
	
	myObjects.dotGen(genA,aGen1A,aGen2A,sGen1A,sGen2A,typeA,introduced);
	myObjects.dotGen(genB,aGen1B,aGen2B,sGen1B,sGen2B,typeB,introduced);
	evoltrigger=0;
}

function mutate(i){
	this.i = i
	this.geneVal
	if (i<=3) {
		geneVal= Math.round(Math.random() * 100 )/10000 * (Math.floor(Math.random()*2) == 1 ? 1 : -1)
	} else {
		geneVal = Math.round(Math.random() * 200 )/100
	}
	return geneVal;
}



function field(x, y, w, h, fill, i){
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.fill = fill;
	
	this.update = function() {
		ctx = myGameArea.context;
		if (newFill != 0){ctx.fillStyle="rgb(0,"+newFill+",0)"} else {ctx.fillStyle="rgb(0,0,200)"};
		ctx.fillRect(x, y, w, h)
		ctx.fill()
	}
	this.decreaseField = function(k){
		this.k = k;
		if (dots[k].eat <10) {
			dots[k].eat++
		} 
		else if (this.fill > 1) {
				this.fill--
				dots[k].hp++
				dots[k].eat = 0;
		}
	}
}

function updateGameArea() {
	if (myGameArea.keys && myGameArea.keys[107]) {myGameArea.zoomIn()}
	if (myGameArea.keys && myGameArea.keys[109]) {myGameArea.zoomOut()}
	myGameArea.clear();
	
	for (var i in fields){
		var k = dots.length
		while(k--){
			
			if (dots[k].collisionCheck(i)){
				dots[k].setMove(i);
				fields[i].decreaseField(k);
			}
		}
		newFill = fields[i].fill
		fields[i].update();
	}
	var k = dots.length
	while (k--){
		/*dots[k].moveAngle = 0;
		dots[k].speed = 0;*/
		if (myGameArea.keys && myGameArea.keys[37]) {dots[k].moveAngle = -1; }
		if (myGameArea.keys && myGameArea.keys[39]) {dots[k].moveAngle = 1; }
		if (myGameArea.keys && myGameArea.keys[38]) {dots[k].speed= 1; }
		if (myGameArea.keys && myGameArea.keys[40]) {dots[k].speed= -1; }
		dots[k].hp -= dots[k].speed
		dots[k].newPos();
		if (dots[k].x <= 20 || dots[k].x >= 980 || dots[k].y <= 20 || dots[k].y >= 630) {
			dots[k].angle = dots[k].angle % (2*Math.PI) + Math.PI;
			dots[k].speed = 0.5
		}
		dots[k].update();
		dots[k].dotDie(k);
	}
}
/*
function setMove(i,k){
	this.i = i
	this.k = k
	this.a = 0;
	this.b = 0;
	dots[k].moveAngle = 0;
	dots[k].speed = 0;
	var a = (fields[i].x - dots[k].x) +25
	var b = (fields[i].y - dots[k].y) +25
	var c = Math.atan(a/b)+dots[k].angle % (2*Math.PI)
	var s
	if (b<0) {c -= Math.PI}
	if (Math.sin(c) <= 0) {c = -1} else {dots[k].moveAngle = 1}
	dots[k].moveAngle = (fields[i].fill*c*-0.01)-1 //gen1 -0.01 do 0.01 gen2 -2 do 2
	s = Math.abs(fields[i].fill*0.01-2) //gen3 -0.01 do 0.01 gen4 -2 do 2
	dots[k].speed = (Math.round(s * 3) / 2).toFixed(1);
}*/


function constantEvents(){
	this.growField = function() {
		for (var i in fields){
			if (fields[i].fill > 0 && fields[i].fill < 255) {fields[i].fill++}
		}
	}
	this.oneSecUpdates = function() {
		myGameArea.totalTime();
		var k = dots.length
		while(k--){
			dots[k].decrHpIncrFit();
			
		}
		var avField = 0;
		var i = fields.length
		while(i--){
			avField +=fields[i].fill
		}
		avFieldSpan = document.getElementById("avFld");
		txt = document.createTextNode(Math.floor(avField/260));
		avFieldSpan.innerText = txt.textContent;
	}
}

function hadesDisplay(){
	fit = document.getElementById("fit");
	gen = document.getElementById("gen");
	typ = document.getElementById("typ");
	itr = document.getElementById("itr");
	while (fit.firstChild) {
		fit.removeChild(fit.firstChild);
		gen.removeChild(gen.firstChild);
		typ.removeChild(typ.firstChild);
		itr.removeChild(itr.firstChild);
	}
	fit.appendChild(document.createTextNode('Fitness'));
	fit.appendChild(document.createElement("br"));
	gen.appendChild(document.createTextNode('Generation'));
	gen.appendChild(document.createElement("br"));
	typ.appendChild(document.createTextNode('Type'));
	typ.appendChild(document.createElement("br"))
	itr.appendChild(document.createTextNode('Introduced'));
	itr.appendChild(document.createElement("br"))
	var h = hades.length
    while (h--){
        fit.appendChild(document.createTextNode(hades[h].fit));
        fit.appendChild(document.createElement("br"));
		gen.appendChild(document.createTextNode(hades[h].gen));
        gen.appendChild(document.createElement("br"));
		typ.appendChild(document.createTextNode(hades[h].type));
        typ.appendChild(document.createElement("br"));
		itr.appendChild(document.createTextNode(hades[h].introduced));
        itr.appendChild(document.createElement("br"));
    }
}	
function sortHadesByFit() {
	hades.sort(function(a, b) {
		return parseFloat(a.fit) - parseFloat(b.fit);
	});
}


/*
generacja 10 do hades, gen = 1, ustawic licznik = 0
zabranie 3 z hades do dots licznik +3
1 dot umiera, wraca do hades, sortowanie hades po fit
zabranie 1 z hades do dots, licznik +1
powtarzać az licznik dojdzie do 10
gdy licznik 10, ewolucja na 7 w hades, licznik = 0
ewolucja krzyzuje pierwsze 4, tworzy 2, odrzuca 2*/

/*pierwsza ewolucja po wypuszczeniu 10, kolejne co 7. Może zrezygnować z naliczania evoltrigger dla pierwszych trzech, albo ustawić go na -2
sortowanie wyłacznie przed ewolucja
sortowanie hadesu zawsze wprowadzi zamieszanie. Można zrobić log odświeżany z każdą śmiercią. Może mieć dowolną dłuość. Można z niego pobrać top 1 fit
Moze dodac ID kropek ze zmiennej globalnej*/



