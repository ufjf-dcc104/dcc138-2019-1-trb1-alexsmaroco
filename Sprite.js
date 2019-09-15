function Sprite(params = {}) {
    var exemplo = {
        g: 0,
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        ax: 0,
        ay: 0,
        am: 0,
        width: 32,
        height: 32,
        angle: 0,
        vang: 0,
        color: "blue",
        cooldown: 0,
        comportar: undefined,
        scene: undefined
    }
    Object.assign(this, exemplo, params);
}
Sprite.prototype = new Sprite();
Sprite.prototype.constructor = Sprite;

Sprite.prototype.desenhar = function (ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle*2*Math.PI/360);
    ctx.fillStyle = this.color;
    ctx.fillRect(-this.width/2, -this.height/2, this.width,this.height)
    ctx.fill();
    ctx.strokeStyle = "black";
    ctx.strokeRect(-this.width/2, -this.height/2, this.width, this.height);
    ctx.restore();
  };

Sprite.prototype.mover = function (dt) {
    this.a = this.a + this.va*dt;

    this.vx = this.vm*Math.cos(this.a);
    this.vy = this.vm*Math.sin(this.a);

    this.x = this.x + this.vx*dt;
    this.y = this.y + this.vy*dt;

    this.cooldown = this.cooldown -dt;
}

Sprite.prototype.colidiuCom = function(alvo){
    if(alvo.x+alvo.w/2 < this.x-this.w/2) return false;
    if(alvo.x-alvo.w/2 > this.x+this.w/2) return false;

    if(alvo.y+alvo.h/2 < this.y-this.h/2) return false;
    if(alvo.y-alvo.h/2 > this.y+this.h/2) return false;

    return true;
}