import { build } from 'esbuild';
import Handlebars from 'handlebars';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { people } from '../preview/fixtures';
async function main(): Promise<void> {
Handlebars.registerHelper('JSONstringify', value => JSON.stringify(value || {}));
const raw = await readFile('templates/profile-cards.html', 'utf8');
const template = raw.match(/<content id="data-content">([\s\S]*?)<\/content>/)![1];
const html = Handlebars.compile(template)({ data: { items: people.map(p => ({ AccountName: p.id, PreferredName: p.displayName, JobTitle: p.jobTitle, WorkEmail: p.mail, Company: p.companyName })) } });
await mkdir('preview/dist', { recursive: true });
await writeFile('preview/dist/index.html', `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Microsoft 365 profile cards · Local review</title><style>body{margin:0;background:#f4f4f2;font:16px 'Segoe UI',Arial;color:#143248}main{max-width:1180px;margin:auto;padding:48px 24px}h1{font-size:36px;letter-spacing:-1px;margin:8px 0 12px}.note{color:#4d6676;max-width:760px;line-height:1.7}.badge{font-size:11px;letter-spacing:2px;color:#086eaa}.review{margin:28px 0 16px;padding:16px 20px;background:white;border:1px solid #d7e4ec;border-radius:8px;font-size:13px;line-height:1.7}</style></head><body><main><div class="badge">LOCAL REVIEW · SYNTHETIC DATA</div><h1>Team Directory</h1><p class="note">An SPFx component for PnP Modern Search. Compact directory cards with a branded profile panel. Select a photo or name to see full details.</p><div class="review">Review cases: complete profile · no photo · missing fields · access denied. This preview uses the production React components and the actual Handlebars template, with a mock directory provider.</div>${html}</main><script src="preview.js"></script></body></html>`);
await build({entryPoints:['preview/main.ts'],bundle:true,outfile:'preview/dist/preview.js',format:'iife',target:'es2020',minify:true,define:{'process.env.NODE_ENV':'"production"'}});
console.log('Preview built: preview/dist/index.html');
}
void main().catch(error => { console.error(error); process.exitCode = 1; });
