// Hiệu ứng hiện dần khi cuộn + đánh dấu mục menu đang xem
const els=document.querySelectorAll('.rv');
if('IntersectionObserver' in window){
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});
  els.forEach(el=>io.observe(el));
  const ls=[...document.querySelectorAll('.nav a')];
  const so=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)ls.forEach(l=>l.classList.toggle('on',l.getAttribute('href')==='#'+e.target.id))}),{rootMargin:'-45% 0px -50% 0px'});
  document.querySelectorAll('section[id]').forEach(s=>so.observe(s));
}else els.forEach(el=>el.classList.add('in'));
