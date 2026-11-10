'use strict';
const slides = [
  {src:'assets/slide-01.png',name:'Introdução',alt:'Slide 1: Web Services — histórico, funcionamento e exemplos práticos'},
  {src:'assets/slide-02.png',name:'O que são Web Services?',alt:'Slide 2: definição e elementos de Web Services'},
  {src:'assets/slide-03.png',name:'História e evolução',alt:'Slide 3: a evolução dos Web Services dos anos 1990 até hoje'},
  {src:'assets/slide-04.png',name:'Exemplos do cotidiano',alt:'Slide 4: cinco exemplos práticos de Web Services'},
  {src:'assets/slide-05.png',name:'Requisição e resposta',alt:'Slide 5: exemplo de requisição HTTP e resposta JSON'},
  {src:'assets/slide-06.png',name:'Código Node.js + Express',alt:'Slide 6: código de Web Service usando Node.js e Express'}
];
const img = document.querySelector('#slide-image');
const counter = document.querySelector('#slide-counter');
const caption = document.querySelector('#progress-caption');
const progress = document.querySelector('#progress');
const progressFill = document.querySelector('#progress-fill');
const dots = document.querySelector('#dots');
const prevButtons = [document.querySelector('#prev-btn'),document.querySelector('#prev-side')];
const nextButtons = [document.querySelector('#next-btn'),document.querySelector('#next-side')];
const fullscreenButton = document.querySelector('#fullscreen-btn');
let current = 0;

slides.forEach((slide,i)=>{
  const dot = document.createElement('button');
  dot.type='button';dot.className='dot';dot.title=`Ir para o slide ${i+1}: ${slide.name}`;
  dot.setAttribute('aria-label',`Ir para o slide ${i+1}`);
  dot.addEventListener('click',()=>showSlide(i));
  dots.appendChild(dot);
  if(i>0){const preloaded=new Image();preloaded.src=slide.src;}
});
function showSlide(index){
  if(index<0||index>=slides.length)return;
  current=index;
  const slide=slides[index];
  img.src=slide.src;img.alt=slide.alt;
  img.classList.remove('fade-in');void img.offsetWidth;img.classList.add('fade-in');
  counter.innerHTML=`${String(index+1).padStart(2,'0')} <span>/ ${String(slides.length).padStart(2,'0')}</span>`;
  caption.textContent=slide.name;
  progress.setAttribute('aria-valuenow',String(index+1));
  progressFill.style.width=`${((index+1)/slides.length)*100}%`;
  prevButtons.forEach(b=>b.disabled=index===0);
  nextButtons.forEach(b=>b.disabled=index===slides.length-1);
  [...dots.children].forEach((dot,i)=>{
    dot.classList.toggle('active',i===index);
    if(i===index)dot.setAttribute('aria-current','step');else dot.removeAttribute('aria-current');
  });
}
function previous(){showSlide(current-1)}
function next(){showSlide(current+1)}
prevButtons.forEach(b=>b.addEventListener('click',previous));
nextButtons.forEach(b=>b.addEventListener('click',next));
function toggleFullscreen(){
  if(document.fullscreenElement){document.exitFullscreen?.().catch(()=>{});}
  else{document.documentElement.requestFullscreen?.().catch(()=>{});}
}
fullscreenButton.addEventListener('click',toggleFullscreen);
document.addEventListener('fullscreenchange',()=>{
  const full=Boolean(document.fullscreenElement);
  document.body.classList.toggle('is-fullscreen',full);
  fullscreenButton.title=full?'Sair da tela cheia (F)':'Tela cheia (F)';
  fullscreenButton.setAttribute('aria-label',full?'Sair da tela cheia':'Ativar tela cheia');
});
document.addEventListener('keydown',event=>{
  if(event.altKey||event.ctrlKey||event.metaKey)return;
  const focused=document.activeElement;
  if(focused&&['INPUT','TEXTAREA','SELECT'].includes(focused.tagName))return;
  switch(event.key){
    case 'ArrowRight':case 'PageDown':case ' ':event.preventDefault();next();break;
    case 'ArrowLeft':case 'PageUp':event.preventDefault();previous();break;
    case 'Home':event.preventDefault();showSlide(0);break;
    case 'End':event.preventDefault();showSlide(slides.length-1);break;
    case 'f':case 'F':event.preventDefault();toggleFullscreen();break;
  }
});
let startX=null,startY=null;
const stage=document.querySelector('.stage');
stage.addEventListener('touchstart',e=>{if(e.touches.length!==1)return;startX=e.touches[0].clientX;startY=e.touches[0].clientY},{passive:true});
stage.addEventListener('touchend',e=>{
  if(startX===null||!e.changedTouches.length)return;
  const dx=e.changedTouches[0].clientX-startX,dy=e.changedTouches[0].clientY-startY;
  if(Math.abs(dx)>50&&Math.abs(dx)>Math.abs(dy)*1.3){dx<0?next():previous();}
  startX=startY=null;
},{passive:true});
showSlide(0);
