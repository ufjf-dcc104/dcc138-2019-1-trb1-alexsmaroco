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
        scene: undefined,
        tipo: undefined
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
    this.vx = this.vx + this.ax*dt;
    this.vy = this.vy + (this.ay+this.g)*dt;
    this.x = this.x + this.vx*dt;
    this.y = this.y + this.vy*dt;
    if(this.minAngle && this.maxAngle) {
      if(this.angle <= this.minAngle) this.angle = this.minAngle;
      if(this.angle >= this.maxAngle) this.angle = this.maxAngle;
      this.angle = this.angle + this.vang*dt;
    }
    if(this.cooldown>0) {
      this.cooldown -= dt;
    }
}

Sprite.prototype.moverAng = function (dt) {
  //this.angle = this.angle + this.vang*dt;
  this.ax = this.am*Math.cos(Math.PI*this.angle/180);
  this.ay = this.am*Math.sin(Math.PI*this.angle/180);
  this.vx = this.vx + this.ax*dt;
  this.vy = this.vy + (this.ay+this.g)*dt;
  this.x = this.x + this.vx*dt;
  this.y = this.y + this.vy*dt;
};

Sprite.prototype.colidiuCom = function(alvo){
    if(alvo.x+alvo.w/2 < this.x-this.w/2) return false;
    if(alvo.x-alvo.w/2 > this.x+this.w/2) return false;

    if(alvo.y+alvo.h/2 < this.y-this.h/2) return false;
    if(alvo.y-alvo.h/2 > this.y+this.h/2) return false;

    return true;
}