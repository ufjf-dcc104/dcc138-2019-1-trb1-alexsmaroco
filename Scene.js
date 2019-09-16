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
        level: 0,
        multMeteoros: 5,
        qtdMeteoros: 0,
        cooldownMeteoro: 1.5,
        normaVelocidade: 60,
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
    this.cooldownMeteoro-=dt;
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
    for(var i = 0; i < this.meteoros.length; i++) {
        if(this.meteoros[i].comportar) {
            this.meteoros[i].comportar();
        }
    }
};


Scene.prototype.limpar = function(){
    this.ctx.clearRect(0,0, this.w, this.h);
}


// Verifica e trata possíveis colisões
Scene.prototype.checaColisao = function(){
    for(var i = this.meteoros.length-1; i >= 0; i--) {
        for(var k = 0; k < this.predios.length; k++) {
            if(this.meteoros[i].colidiuCom(this.predios[k])) {
                this.predios[k].vida-= 25*this.meteoros[i].size;
                if(this.predios[k].vida <= 0) {
                    this.predios.splice(k,1);
                }
                this.meteoros.splice(i, 1);
            }
        }
        for(var j = this.tiros.length-1; j >= 0; j--) {
            if(this.meteoros[i].colidiuCom(this.tiros[j])) {
                this.meteoros.splice(i, 1);
                this.tiros.splice(j, 1);
                this.placar++;
            }
        }
    }
};

// Exibe informações ao jogador
Scene.prototype.desenharInfo = function() {
    ctx.save();
    this.ctx.fillStyle = "white";
    this.ctx.font = "12px Georgia";
    this.ctx.fillText("Level: " + this.level, 0,10);
    this.ctx.fillText("Meteoros restantes: " + this.qtdMeteoros, 80,10);
    this.ctx.fillText("Pontos: " + this.placar, 0,25);
	for(var i = 0; i < this.predios.length; i++) {
        //this.ctx.fillText(" " + this.predios[i].color + ": " + this.predios[i].vida, 120+70*i, 25);
        this.ctx.fillText(""+this.predios[i].vida+"hp", this.predios[i].x-this.predios[i].width/2, this.predios[i].y);
    }
    ctx.restore();
}

// Ajusta a passagem de nivel
Scene.prototype.proximoLevel = function() {
    this.level++;
    this.qtdMeteoros = this.level * this.multMeteoros;
    this.cooldownMeteoro = 4;
}

// Faz meteoros 'baterem' na parede e inverter a direção
function ficarNoMapa(w, h) {
    return function() {
        if(this.x+this.width/2 >= w || this.x-this.width/2 <= 0) {
            this.vx = -1*this.vx;
        }
    }
}

// Gera meteoros
Scene.prototype.spawnMeteoro = function() {
    if(this.cooldownMeteoro <= 0) {
        var vx = 50-10*Math.random();
        var xIni = 15 + (0.8*this.w)*Math.random();
        if(xIni > this.w/2) { if(Math.random() > 0.5) vx = -1*vx; }
        var meteoro = new Sprite({
            x: xIni, y: -30,
            width: 20, height: 20,
            vx: vx, vy: Math.sqrt(this.normaVelocidade*this.normaVelocidade-vx*vx),
            scene: this, angle: 90, color: "red", size: 1,
            comportar: ficarNoMapa(this.w, this.h),
        });
        this.meteoros.push(meteoro);
        this.cooldownMeteoro = 2;
        this.qtdMeteoros--;
    }
}

// Remove objetos fora da area do jogo
Scene.prototype.clearOOB = function() {
    for(var i = 0; i < this.tiros.length; i++) {
        if(this.tiros[i].x < -100 || this.tiros[i].y < -100 || this.tiros[i] > this.w+100) {
            this.tiros.splice(i, 1);
        }
    }
    for(var i = 0; i < this.meteoros.length; i++) {
        if(this.meteoros[i].y > this.h+100) {
            this.meteoros.splice(i, 1);
        }
    }
}

Scene.prototype.passo = function(dt) {
    this.clearOOB();
    this.limpar();
    this.comportar();
    this.spawnMeteoro();
    this.mover(dt);
    this.desenhar();
    this.checaColisao();
    this.desenharInfo();
}