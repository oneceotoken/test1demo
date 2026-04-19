/* Particle Engine — spark */
(function(){
"use strict";
var surfaces=document.querySelectorAll(".anim-bg");
if(!surfaces.length)return;
var mx=0.5,my=0.5;
document.addEventListener("mousemove",function(e){
  mx=e.clientX/window.innerWidth;
  my=e.clientY/window.innerHeight;
},{passive:true});

surfaces.forEach(function(el){
  var canvas=document.createElement("canvas");
  canvas.style.cssText="width:100%;height:100%;display:block;";
  el.appendChild(canvas);
  var ctx=canvas.getContext("2d");
  var W,H,dpr=Math.min(window.devicePixelRatio,2);
  var particles=[];
  var COUNT=120;
  var SPEED=1;
  var GLOW=0.6;
  var CONNECT=true;
  var INTERACT=true;
  var CDIST=60;
  var BASE=[250,204,21];

  function resize(){
    W=el.offsetWidth;H=el.offsetHeight;
    canvas.width=W*dpr;canvas.height=H*dpr;
    ctx.setTransform(dpr,0,0,dpr,0,0);
  }

  function spawn(){
    particles=[];
    for(var i=0;i<COUNT;i++){
      var r=1+Math.random()*3;
      particles.push({x:Math.random()*W,y:Math.random()*H,
        vx:(Math.random()-0.5)*0.5*SPEED,vy:(Math.random()-0.5)*0.5*SPEED,
        r:r,baseR:r,alpha:0.2+Math.random()*0.6,
        pulse:Math.random()*Math.PI*2,pulseSpeed:0.01+Math.random()*0.03});
    }
  }

  function draw(){
    ctx.clearRect(0,0,W,H);
    var grad=ctx.createLinearGradient(0,0,0,H);
    grad.addColorStop(0,"#0a0804");
    grad.addColorStop(1,"#141008");
    ctx.fillStyle=grad;ctx.fillRect(0,0,W,H);

    if(CONNECT&&CDIST>0){
      for(var i=0;i<particles.length;i++){
        for(var j=i+1;j<particles.length;j++){
          var dx=particles[i].x-particles[j].x,dy=particles[i].y-particles[j].y;
          var d=Math.sqrt(dx*dx+dy*dy);
          if(d<CDIST){
            ctx.strokeStyle="rgba("+BASE.join(",")+","+(1-d/CDIST)*0.15+")";
            ctx.lineWidth=0.5;
            ctx.beginPath();ctx.moveTo(particles[i].x,particles[i].y);
            ctx.lineTo(particles[j].x,particles[j].y);ctx.stroke();
          }
        }
      }
    }
    particles.forEach(function(p){
      p.pulse+=p.pulseSpeed;
      p.r=p.baseR*(0.8+Math.sin(p.pulse)*0.3);
      p.x+=p.vx;p.y+=p.vy;
      if(INTERACT){
        var dx=mx*W-p.x,dy=my*H-p.y;
        var d=Math.sqrt(dx*dx+dy*dy);
        if(d<150){var f=0.02*(1-d/150);p.vx+=dx*f;p.vy+=dy*f;}
      }
      p.vx*=0.99;p.vy*=0.99;
      if(p.x<-10)p.x=W+10;if(p.x>W+10)p.x=-10;
      if(p.y<-10)p.y=H+10;if(p.y>H+10)p.y=-10;
      if(GLOW>0.2){ctx.shadowBlur=p.r*4*GLOW;ctx.shadowColor="rgba("+BASE.join(",")+",0.6)";}
      ctx.beginPath();
      ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle="rgba("+BASE.join(",")+","+p.alpha+")";
      ctx.fill();ctx.shadowBlur=0;
    });
  }

  var vis=true;
  var obs=new IntersectionObserver(function(entries){
    entries.forEach(function(e){vis=e.isIntersecting;});
  },{threshold:0});
  obs.observe(el);

  function tick(){requestAnimationFrame(tick);if(!vis)return;draw();}
  resize();spawn();tick();
  window.addEventListener("resize",function(){resize();spawn();});
});
})();