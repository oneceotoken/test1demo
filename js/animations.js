/* Scroll Animations */
(function(){
"use strict";
// Safety: dismiss preloader after 5s even if GSAP fails to load
var _safetyTimer=setTimeout(function(){var p=document.getElementById("preloader");if(p&&!p.classList.contains("done"))p.classList.add("done");},5000);
function init(){
  if(typeof gsap==="undefined"||typeof ScrollTrigger==="undefined"){setTimeout(init,100);return;}
  clearTimeout(_safetyTimer);
  gsap.registerPlugin(ScrollTrigger);

  // Preloader
  var fill=document.getElementById("preloaderFill");
  var pre=document.getElementById("preloader");
  if(fill){
    gsap.to(fill,{width:"100%",duration:1.2,ease:"power2.inOut",onComplete:function(){
      if(pre)pre.classList.add("done");
      revealHero();
    }});
  } else { revealHero(); }

  function revealHero(){
    gsap.to(".hero .line-inner",{yPercent:0,duration:1,stagger:0.12,ease:"expo.out",delay:0.2});
    gsap.to(".hero-sub",{opacity:1,y:0,duration:0.8,delay:0.6,ease:"power2.out"});
    gsap.to(".hero-actions",{opacity:1,y:0,duration:0.8,delay:0.8,ease:"power2.out"});
  }

  // Set initial states
  gsap.set(".line-inner",{yPercent:110});
  gsap.set(".hero-sub",{opacity:0,y:20});
  gsap.set(".hero-actions",{opacity:0,y:20});
  gsap.set(".reveal-up",{opacity:0,y:40});

  // Section heading reveals
  document.querySelectorAll(".section-heading .line-inner").forEach(function(el){
    ScrollTrigger.create({
      trigger:el.closest(".section"),
      start:"top 80%",
      onEnter:function(){gsap.to(el,{yPercent:0,duration:0.9,ease:"expo.out"});}
    });
  });

  // Reveal-up elements
  document.querySelectorAll(".reveal-up").forEach(function(el){
    ScrollTrigger.create({
      trigger:el,
      start:"top 85%",
      onEnter:function(){gsap.to(el,{opacity:1,y:0,duration:0.8,ease:"power2.out"});}
    });
  });

  // Smooth scroll
  if(typeof Lenis!=="undefined"){
    var lenis=new Lenis({lerp:0.1,smoothWheel:true});
    lenis.on("scroll",ScrollTrigger.update);
    gsap.ticker.add(function(t){lenis.raf(t*1000);});
    gsap.ticker.lagSmoothing(0);
    ScrollTrigger.refresh();
  }
}
if(document.readyState==="loading"){document.addEventListener("DOMContentLoaded",init);}else{init();}
})();