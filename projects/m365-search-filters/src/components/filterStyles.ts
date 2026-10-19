/** Only our own namespace is styled; no PnP or SharePoint internal selectors. */
export const filterStyles = `
.m365-filters-root{font-family:var(--m365-font);font-size:14px;line-height:1.5;color:var(--m365-ink);min-width:0}
.m365-filters-root *{box-sizing:border-box}.m365-filters-root button,.m365-filters-root input{font:inherit}
.m365-filters-desktop,.m365-filters-dialog{background:var(--m365-surface);border:1px solid var(--m365-border);border-radius:var(--m365-radius);padding:20px;box-shadow:0 4px 24px #102b3c0a;color:var(--m365-ink)}
.m365-filters-header{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:14px}.m365-filters-header h2{margin:2px 0 0;font-size:20px;letter-spacing:-.3px;display:flex;align-items:center;gap:8px}
.m365-filters-eyebrow{font-size:10px;font-weight:600;letter-spacing:1.4px;color:var(--m365-muted);margin:0}
.m365-filters-link{border:0;background:transparent;color:var(--m365-primary);font-weight:600;cursor:pointer;padding:8px 0;white-space:nowrap}.m365-filters-link:disabled{color:var(--m365-muted);opacity:.6;cursor:default}
.m365-filters-badge{display:inline-flex;align-items:center;justify-content:center;min-width:22px;height:22px;border-radius:50%;background:var(--m365-surface);color:var(--m365-primary);font-size:11px;margin-left:8px;padding:0 5px}
.m365-filters-groups{display:grid;gap:10px}.m365-filters-section{background:var(--m365-soft);border:1px solid var(--m365-border);border-radius:10px;overflow:hidden}
.m365-filters-heading{width:100%;border:0;background:transparent;display:flex;align-items:center;justify-content:space-between;gap:8px;padding:14px;text-align:left;color:var(--m365-ink);font-weight:600!important;cursor:pointer}
.m365-filters-heading svg{flex-shrink:0;transition:transform .18s ease}.m365-filters-options{padding:0 14px 13px}.m365-filters-options[hidden]{display:none}
.m365-filters-values{max-height:250px;overflow:auto;scrollbar-width:thin;padding:3px}.m365-filters-option{display:flex;align-items:center;gap:9px;padding:7px 0;cursor:pointer;min-height:36px}.m365-filters-option input{accent-color:var(--m365-primary);width:16px;height:16px;flex:0 0 16px;margin:0;cursor:inherit}.m365-filters-option-name{overflow-wrap:anywhere;flex:1}.m365-filters-count{font-size:12px;color:var(--m365-muted);font-variant-numeric:tabular-nums}.m365-filters-option.is-disabled{opacity:.55}
.m365-filters-search{width:100%;background:var(--m365-surface);color:var(--m365-ink);border:1px solid var(--m365-border);border-radius:6px;padding:9px 10px;margin-bottom:6px;min-width:0}
.m365-filters-chips{display:flex;flex-wrap:wrap;gap:6px}.m365-filters-chips:not(:empty){margin-bottom:16px}.m365-filters-chip{border:1px solid var(--m365-border);background:var(--m365-soft);color:var(--m365-ink);border-radius:20px;padding:5px 9px;display:flex;gap:8px;align-items:center;cursor:pointer;font-size:12px!important;text-align:left;overflow-wrap:anywhere;max-width:100%}
.m365-filters-footer{padding-top:16px}.m365-filters-footer p,.m365-filters-empty{font-size:12px;color:var(--m365-muted);margin:0 0 10px}.m365-filters-primary,.m365-filters-mobile-trigger{border:0;border-radius:7px;background:var(--m365-primary);color:#fff;padding:11px 16px;font-weight:600!important;cursor:pointer;width:100%}.m365-filters-primary:disabled{opacity:.45;cursor:default}
.m365-filters-root button:focus-visible,.m365-filters-root input:focus-visible{outline:2px solid var(--m365-focus);outline-offset:3px}.m365-filters-mobile-trigger{display:none}
.m365-filters-dialog{position:fixed;inset:0 0 0 auto;margin:0;max-height:100dvh;height:100dvh;max-width:100vw;width:min(380px,100vw);border-radius:16px 0 0 16px;overflow:auto;padding-top:52px}.m365-filters-dialog::backdrop{background:#102b3c66}.m365-filters-close{position:absolute;right:16px;top:10px;background:var(--m365-soft);border:1px solid var(--m365-border);border-radius:50%;width:30px;height:30px;color:var(--m365-ink);font-size:22px!important;cursor:pointer}
@media(max-width:760px){.m365-filters-desktop{display:none}.m365-filters-mobile-trigger{display:block;width:auto;min-width:120px}}
@media(prefers-reduced-motion:reduce){.m365-filters-root *{transition:none!important}}
@media(forced-colors:active){.m365-filters-section,.m365-filters-chip,.m365-filters-primary{border:1px solid ButtonText}.m365-filters-option input{forced-color-adjust:auto}}
`;
