import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const project=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const showcase=path.resolve(project,'../../portfolio/projects/m365-profile-cards');
const old=fs.readFileSync(path.join(showcase,'demo.html'),'utf8');
const csp=old.match(/<meta http-equiv="Content-Security-Policy"[^>]*>/)?.[0];
if(!csp)throw new Error('Existing public demo CSP missing');
let html=fs.readFileSync(path.join(project,'preview/dist/index.html'),'utf8');
html=html.replace('<head>','<head>'+csp+'<meta name="referrer" content="no-referrer">').replaceAll('LOCAL REVIEW','PUBLIC DEMO').replace('Microsoft 365 profile cards · Local review','Microsoft 365 Profile Cards · React Demo').replace('src="preview.js"','src="/projects/m365-profile-cards/demo.js?v=1.3.0"');
fs.writeFileSync(path.join(showcase,'demo.html'),html);
fs.copyFileSync(path.join(project,'preview/dist/preview.js'),path.join(showcase,'demo.js'));
fs.copyFileSync(path.join(project,'sharepoint/solution/m365-profile-cards.sppkg'),path.join(showcase,'downloads/m365-profile-cards.sppkg'));
fs.copyFileSync(path.join(project,'templates/profile-cards.html'),path.join(showcase,'downloads/profile-cards.html'));
console.log('Updated synthetic demo, Handlebars download and SPPKG 1.3.0.0');
