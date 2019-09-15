function Scene(params) {
    var exemplo ={
        sprites: [],
        meteoros: [],
        predios: [],
        tiros: [],
        toRemove: [],
        ctx: null,
        w: 300,
        h: 300,
        placar: 0,
        level: 1,
        multMeteoros: 5,
        qtdMeteoros: 0,
        background: undefined
    }
    Object.assign(this, exemplo, params);
}

Scene.prototype = new Scene();
Scene.prototype.constructor = Scene;

Scene.prototype.init = function() {
    this.qtdMeteoros = this.level*this.multMeteoros;
    var hconst = 80;
    var h1 = 48+hconst*Math.random();
    this.predios.push(new Sprite({color: "blue", x: this.w*0.1, y: this.h-h1/2, vida: 100, width: 32, height: h1, scene: this}));
    h1 = 48+hconst*Math.random();
    this.predios.push(new Sprite({color: "green", x: this.w*0.3, y: this.h-h1/2, vida: 100, width: 32, height: h1, scene: this}));
    h1 = 48+hconst*Math.random();
    this.predios.push(new Sprite({color: "grey", x: this.w*0.7, y: this.h-h1/2, vida: 100, width: 32, height: h1, scene: this}));
    h1 = 48+hconst*Math.random();
    this.predios.push(new Sprite({color: "purple", x: this.w*0.85, y: this.h-h1/2, vida: 100, width: 32, height: h1, scene: this}));
}

Scene.prototype.nextLevel = function() {
    level++;
    this.qtdMeteoros = this.level*this.multMeteoros;
}

Scene.prototype.adicionarSprite = function(sprite){
    sprite.scene = this;
    this.sprites.push(sprite);
};

Scene.prototype.addMeteoro = function(sprite) {
    sprite.scene = this;
    this.meteoros.push(sprite);
}

Scene.prototype.addTiro = function(sprite) {
    sprite.scene = this;
    this.tiros.push(sprite);
}

Scene.prototype.desenhar = function(){
    this.ctx.drawImage(this.background, 0, 0, this.w, this.h);
    for(var i = 0; i<this.sprites.length; i++){
        this.sprites[i].desenhar(this.ctx);
    }
    for(var i = 0; i<this.predios.length; i++){
        this.predios[i].desenhar(this.ctx);
    }
    for(var i = 0; i<this.meteoros.length; i++){
        this.meteoros[i].desenhar(this.ctx);
    }
    for(var i = 0; i<this.tiros.length; i++){
        this.tiros[i].desenhar(this.ctx);
    }
};

Scene.prototype.mover = function(dt){
    for(var i = 0; i<this.sprites.length; i++){
        this.sprites[i].mover(dt);
    }
    for(var i = 0; i<this.tiros.length; i++){
        this.tiros[i].moverAng(dt);
    }
    for(var i = 0; i<this.meteoros.length; i++){
        this.meteoros[i].mover(dt);
    }
    
};

Scene.prototype.comportar = function(){
    for(var i = 0; i<this.sprites.length; i++){
        if(this.sprites[i].comportar){
            this.sprites[i].comportar();
        }
    }  
};


Scene.prototype.limpar = function(){
    this.ctx.clearRect(0,0, this.w, this.h);
}

Scene.prototype.checaColisao = function(){
    for(var i = 0; i < this.meteoros.length; i++) {
        for(var j = 0; j < this.tiros.length; j++) {
            if(this.meteoros[i].colidiuCom(this.tiros[j])) {
                this.meteoros[i] = this.meteoros[this.meteoros.length-1];
                this.meteoros.splice(this.meteoros.length-1, 1);
                this.tiros[j] = this.tiros[this.tiros.length-1];
                this.tiros.splice(this.tiros.length-1, 1);
            }
        }
        for(var k = 0; k < this.predios.length; k++) {
            if(this.meteoros[i].colidiuCom(this.predios[k])) {
                this.predios[k].vida-= 25*this.meteoros[i].size;
                if(this.predios[k].vida <= 0) {
                    this.predios.splice(i,1);
                }
                this.meteoros[i] = this.meteoros[this.meteoros.length-1];
                this.meteoros.splice(this.meteoros.length-1, 1);
            }
        }
    }
};


Scene.prototype.desenharInfo = function() {
    this.ctx.fillText("Level: " + this.level, 0,10);
    this.ctx.fillText("Meteoros restantes: " + this.meteoros, 100,10);
    this.ctx.fillText("Pontos: " + this.placar, 0,20);
    this.ctx.fillText("Vida: ", 60, 20);
    var cont = 0;
    ctx.save();
	for(var i = 0; i < this.sprites.length; i++) {
        if(this.sprites[i].tipo === "predio") {
            this.ctx.fillStyle = this.sprites[i].color;
            this.ctx.fillText(" " + this.sprites[i].color + ": " + this.sprites[i].vida, 30+60*cont, 20);
            cont++;
        }
    }
    ctx.restore();
}

Scene.prototype.passo = function(dt){
    this.limpar();
    this.comportar();
    this.mover(dt);
    this.desenhar();
    // this.checaColisao();
    this.desenharInfo();
}