import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),dist=path.join(root,'dist');if(path.dirname(dist)!==root||path.basename(dist)!=='dist')throw new Error('Invalid build directory');fs.rmSync(dist,{recursive:true,force:true});fs.mkdirSync(dist,{recursive:true});fs.cpSync(path.join(root,'public'),dist,{recursive:true});
const routes={'portfolio-v2.css':'/assets/styles/portfolio.css','project-detail.css':'/assets/styles/project.css','portfolio-v2.js':'/assets/scripts/portfolio.js','projects.js':'/assets/scripts/projects.js','mahesh-portrait.png':'/assets/images/mahesh-portrait.png','Maheshbabu_SharePoint_CV.docx':'/assets/documents/resume.docx','m365-profile-cards.html':'/projects/m365-profile-cards/','profile-cards-demo.html':'/projects/m365-profile-cards/demo.html','profile-cards-demo.js':'/projects/m365-profile-cards/demo.js','profile-cards-demo.mp4':'/projects/m365-profile-cards/media/demo.mp4','profile-cards-demo-poster.png':'/projects/m365-profile-cards/media/poster.png','profile-cards-demo.vtt':'/projects/m365-profile-cards/media/captions.vtt','m365-profile-cards-source.zip':'/projects/m365-profile-cards/downloads/source.zip','m365-profile-cards.sppkg':'/projects/m365-profile-cards/downloads/m365-profile-cards.sppkg','profile-cards.html':'/projects/m365-profile-cards/downloads/profile-cards.html','index.html':'/'};
function rewrite(s){for(const[from,to]of Object.entries(routes))for(const q of ['"',"'"])s=s.split(q+from).join(q+to);return s;}
function out(name,s){const file=path.join(dist,name);fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,rewrite(s));}
function render(name){return fs.readFileSync(path.join(root,'src/pages',name),'utf8').replace(/\{\{> (\w+)\}\}/g,(_,part)=>fs.readFileSync(path.join(root,'src/components',part+'.html'),'utf8'));}
out('index.html',render('index.html'));out('projects/m365-profile-cards/index.html',render('m365-profile-cards.html'));
for(const[from,to]of [['styles/portfolio.css','assets/styles/portfolio.css'],['styles/project.css','assets/styles/project.css'],['scripts/portfolio.js','assets/scripts/portfolio.js'],['scripts/projects.js','assets/scripts/projects.js']])out(to,fs.readFileSync(path.join(root,'src',from),'utf8'));
out('projects/m365-profile-cards/demo.html',fs.readFileSync(path.join(root,'public/projects/m365-profile-cards/demo.html'),'utf8').replace('Microsoft 365 profile cards · Local review','Microsoft 365 Profile Cards · React Demo'));
out('404.html','<!doctype html><html lang="en"><meta name="viewport" content="width=device-width"><title>Page not found</title><body><h1>Page not found</h1><a href="/">Return to portfolio</a></body></html>');

// Keep historical public URLs usable; generated compatibility assets are not source copies.
for(const [from,to] of Object.entries(routes)){
  if(from==='index.html')continue;
  const target=path.join(dist,to);
  if(from.endsWith('.html')&&to.endsWith('/')){
    out(from,'<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><meta http-equiv="Content-Security-Policy" content="default-src &apos;none&apos;; base-uri &apos;none&apos;"><meta http-equiv="refresh" content="0;url='+to+'"><link rel="canonical" href="'+to+'"><title>Project moved</title></head><body><a href="'+to+'">Open project</a></body></html>');
  }else fs.copyFileSync(target,path.join(dist,from));
}
fs.writeFileSync(path.join(dist,'.nojekyll'),'');
fs.writeFileSync(path.join(dist,'robots.txt'),'User-agent: *\nAllow: /\n');
console.log('Built clean GitHub Pages artifact in dist/');
