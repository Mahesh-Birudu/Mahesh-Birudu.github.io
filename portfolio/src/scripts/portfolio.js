'use strict';
const year = document.getElementById('year'); if (year) year.textContent = String(new Date().getFullYear());
const menu = document.querySelector('.menu-toggle'), nav = document.getElementById('site-nav');
menu.addEventListener('click', () => { const open = menu.getAttribute('aria-expanded') !== 'true'; menu.setAttribute('aria-expanded', String(open)); nav.classList.toggle('is-open', open); });
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => { menu.setAttribute('aria-expanded', 'false'); nav.classList.remove('is-open'); }));
const track = document.getElementById('project-track'), projects = window.portfolioProjects || [], prev = document.getElementById('project-prev'), next = document.getElementById('project-next');
const counter = document.getElementById('project-counter');
const node = (tag, className, text) => { const el = document.createElement(tag); if (className) el.className = className; if (text) el.textContent = text; return el; };
const safeLink = value => { try { const url = new URL(value, location.href); return (url.protocol === 'https:' || url.origin === location.origin) ? url.href : undefined; } catch { return undefined; } };
projects.forEach((project, index) => {
  const card = node('article', 'project-slide'); card.setAttribute('role', 'group'); card.setAttribute('aria-roledescription', 'slide'); card.setAttribute('aria-label', `${index + 1} of ${projects.length}: ${project.title}`);
  const visual = node('div', 'project-visual');
  if (project.image) { const image = node('img'); image.src = safeLink(project.image); image.alt = project.imageAlt || ''; image.loading = 'lazy'; visual.append(image); const badge = node('span', 'visual-badge', project.version ? 'WORKING DEMO / ' + project.version : 'PROJECT PREVIEW'); visual.append(badge); }
  else { visual.classList.add('diagram-visual'); visual.append(node('span', 'diagram-label', 'SOLUTION FLOW')); (project.diagram || []).forEach((label, i) => { visual.append(node('div', 'diagram-step', label)); if (i < project.diagram.length - 1) visual.append(node('span', 'diagram-arrow', '↓')); }); }
  const content = node('div', 'project-content'); content.append(node('p', 'eyebrow', project.category), node('h3', '', project.title), node('p', 'project-summary', project.summary));
  const tags = node('div', 'tags'); (project.tags || []).forEach(tag => tags.append(node('span', '', tag))); content.append(tags);
  const links = node('div', 'project-links');
  for (const [key, label] of [['page', 'Explore project ↗'], ['github', 'GitHub ↗']]) { const href = safeLink(project[key]); if (project[key] && href) { const a = node('a', key === 'page' ? 'button small' : 'quiet-link', label); a.href = href; if (key === 'github') { a.target = '_blank'; a.rel = 'noopener noreferrer'; } if (key === 'page') { a.textContent=''; a.append(node('span','','Explore project'),document.querySelector('.hero-actions .button svg').cloneNode(true)); } if (key === 'github') { a.textContent = ''; a.append(document.querySelector('.contact-links a[href*="github.com"] svg').cloneNode(true), node('span', '', 'GitHub')); } links.append(a); } }
  if (project.video) { const button = node('button', 'video-trigger', 'Watch demo'); button.type = 'button'; const play = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); play.setAttribute('viewBox','0 0 24 24'); play.setAttribute('class','ui-icon'); play.setAttribute('aria-hidden','true'); const playPath=document.createElementNS('http://www.w3.org/2000/svg','path'); playPath.setAttribute('fill','currentColor'); playPath.setAttribute('d',"M7.60846 4.61489C7.1087 4.34296 6.5 4.70472 6.5 5.27368V18.726C6.5 19.2949 7.1087 19.6567 7.60846 19.3848L19.97 12.6586C20.4921 12.3746 20.4921 11.6251 19.97 11.341L7.60846 4.61489ZM5 5.27368C5 3.56682 6.82609 2.48151 8.32538 3.2973L20.687 10.0235C22.2531 10.8756 22.2531 13.124 20.687 13.9762L8.32538 20.7024C6.82609 21.5181 5 20.4328 5 18.726V5.27368Z"); play.append(playPath); button.prepend(play); button.addEventListener('click', event => openVideo(event, project)); links.append(button); }
  if (project.note) content.append(node('p', 'client-note', project.note)); content.append(links); card.append(visual, content); track.append(card);
});
let current = 0;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const update = () => { const children = [...track.children]; current = children.reduce((best, el, i) => Math.abs(el.getBoundingClientRect().left - track.getBoundingClientRect().left) < Math.abs(children[best].getBoundingClientRect().left - track.getBoundingClientRect().left) ? i : best, 0); counter.textContent = `${String(current + 1).padStart(2, '0')} / ${String(projects.length).padStart(2, '0')}`; prev.disabled = current === 0; next.disabled = current >= projects.length - 1; };
const go = delta => { const index = Math.max(0, Math.min(projects.length - 1, current + delta)); const card = track.children[index]; if (card) track.scrollTo({left: track.scrollLeft + card.getBoundingClientRect().left - track.getBoundingClientRect().left, behavior: reducedMotion.matches ? 'auto' : 'smooth'}); };
prev.addEventListener('click', () => go(-1)); next.addEventListener('click', () => go(1));
track.addEventListener('keydown', e => { if (e.target === track && ['ArrowLeft','ArrowRight'].includes(e.key)) { e.preventDefault(); go(e.key === 'ArrowRight' ? 1 : -1); } });
let scrollFrame; track.addEventListener('scroll', () => { cancelAnimationFrame(scrollFrame); scrollFrame = requestAnimationFrame(update); }, {passive:true}); window.addEventListener('resize', update); update();
const dialog = document.getElementById('demo-dialog'), video = document.getElementById('project-video'); let videoTrigger;
function openVideo(event, project) { videoTrigger = event.currentTarget; document.getElementById('demo-title').textContent = project.title; video.querySelector('source').src = safeLink(project.video.src); video.poster = safeLink(project.video.poster || project.image) || ''; const track = video.querySelector('track'); const captions = project.video.captions && safeLink(project.video.captions); if (captions) track.src = captions; else track.removeAttribute('src'); dialog.querySelector('.video-note').textContent = project.demoNote || 'Project demonstration'; video.load(); dialog.showModal(); }
document.getElementById('close-demo').addEventListener('click', () => dialog.close()); dialog.addEventListener('close', () => { video.pause(); videoTrigger?.focus(); });
dialog.addEventListener('click', e => { if (e.target === dialog) { const r = dialog.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dialog.close(); } });


