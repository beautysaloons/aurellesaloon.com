/* Aurelle Salon — behaviour & GSAP animation. Edit WHATSAPP_NUMBER below. */
(function(){
"use strict";
/* ===== SETTINGS: edit here ===== */
var WHATSAPP_NUMBER="15550001234"; // country code + number, digits only
var SALON_NAME="Aurelle Salon";
/* =============================== */
var $=function(s,c){return (c||document).querySelector(s)},$$=function(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s))};
var reduce=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
var header=$("header"),sticky=$("#sticky"),burger=$(".burger"),menu=$("#menu");

/* header + sticky CTA */
var ticking=false;
function onScroll(){var y=window.scrollY;header.classList.toggle("solid",y>40);
 var book=$("#book").getBoundingClientRect();
 sticky.classList.toggle("show",y>500&&!(book.top<innerHeight*.7&&book.bottom>0));ticking=false}
addEventListener("scroll",function(){if(!ticking){ticking=true;requestAnimationFrame(onScroll)}},{passive:true});onScroll();

/* mobile menu */
function toggleMenu(open){burger.setAttribute("aria-expanded",open);menu.classList.toggle("open",open)}
if(burger&&menu){burger.addEventListener("click",function(){toggleMenu(burger.getAttribute("aria-expanded")!=="true")});}
if(menu){$$("#menu a").forEach(function(a){a.addEventListener("click",function(){toggleMenu(false)})});}

/* pre-fill service from card links */
$$("[data-service]").forEach(function(a){a.addEventListener("click",function(){$("#service").value=a.dataset.service})});

/* booking form → WhatsApp */
var form=$("#bookForm"),dateEl=$("#date");
var t=new Date();dateEl.min=t.getFullYear()+"-"+String(t.getMonth()+1).padStart(2,"0")+"-"+String(t.getDate()).padStart(2,"0");
function fmtDate(v){var p=v.split("-");return new Date(p[0],p[1]-1,p[2]).toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric",year:"numeric"})}
function fmtTime(v){var p=v.split(":"),h=+p[0];return (h%12||12)+":"+p[1]+" "+(h<12?"AM":"PM")}
form.addEventListener("submit",function(e){e.preventDefault();var ok=true,d=new FormData(form);
 var rules={name:function(v){return v.trim().length>1||"Please enter your name"},phone:function(v){return /^[+\d][\d\s\-()]{6,}$/.test(v.trim())||"Enter a valid phone number"},service:function(v){return !!v||"Choose a service"},date:function(v){return !!v||"Pick a date"},time:function(v){return !!v||"Pick a time"}};
 Object.keys(rules).forEach(function(k){var r=rules[k](d.get(k)||""),el=$('[data-for="'+k+'"]');el.textContent=r===true?"":r;if(r!==true)ok=false});
 if(!ok){var f=$(".err:not(:empty)");if(f){var i=$("#"+f.dataset.for);i&&i.focus()}return}
 var msg="Hello "+SALON_NAME+"! I'd like to book an appointment.\n\n"+
  "*Name:* "+d.get("name").trim()+"\n*Phone:* "+d.get("phone").trim()+"\n*Service:* "+d.get("service")+
  "\n*Date:* "+fmtDate(d.get("date"))+"\n*Time:* "+fmtTime(d.get("time"))+
  (d.get("msg").trim()?"\n*Message:* "+d.get("msg").trim():"")+"\n\nPlease confirm availability. Thank you!";
 var url="https://wa.me/"+WHATSAPP_NUMBER+"?text="+encodeURIComponent(msg);
 var w=window.open(url,"_blank","noopener");if(!w)location.href=url});

/* animations */
if(!window.gsap){document.documentElement.classList.add("no-js");$("#curtain").style.display="none";$$("[data-reveal],[data-hero]").forEach(function(e){e.style.opacity=1})}
else if(!reduce && window.ScrollTrigger){
 gsap.registerPlugin(ScrollTrigger);
 var heroEls=$$("[data-hero]");gsap.set(heroEls,{opacity:0,y:28});
 var tl=gsap.timeline({defaults:{ease:"power3.out"}});
 /* page transition: curtain lifts, then hero settles in */
 tl.to("#curtain",{yPercent:-100,duration:1.1,delay:.55,ease:"power4.inOut",onComplete:function(){$("#curtain").style.display="none"}})
   .to(heroEls,{opacity:1,y:0,duration:1,stagger:.12},"-=.45");
 /* scroll reveals (batched for performance) */
 ScrollTrigger.batch("[data-reveal]",{start:"top 88%",once:true,
  onEnter:function(b){gsap.fromTo(b,{opacity:0,y:36},{opacity:1,y:0,duration:1,stagger:.1,ease:"power3.out",overwrite:true})}});
 /* subtle parallax + marquee (desktop & mobile safe: transform only) */
 gsap.to("#arch",{yPercent:-6,ease:"none",scrollTrigger:{trigger:".hero",start:"top top",end:"bottom top",scrub:.6}});
 var m=$("#marquee");gsap.to(m,{x:function(){return -m.scrollWidth/2},duration:38,ease:"none",repeat:-1});
 /* buttons intentionally have no magnetic/moving hover effect */
 /* FAQ open animation */
 $$("details").forEach(function(d){var p=$("p",d);d.addEventListener("toggle",function(){if(d.open)gsap.from(p,{opacity:0,y:-8,duration:.5,ease:"power2.out"})})});
} else {
 ["[data-hero]","[data-reveal]"].forEach(function(sel){$$(sel).forEach(function(e){e.style.opacity=1})});
 var curtain=$("#curtain");if(curtain)curtain.style.display="none";
}
})();

// Prevent native image dragging; selection is handled by the global stylesheet.
$$("img").forEach(function(img){img.setAttribute("draggable","false");img.addEventListener("dragstart",function(e){e.preventDefault()})});
