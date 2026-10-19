/** Shared visual contract for search results, filters and future verticals. */
exports.brand = Object.freeze({primary:'#0078d4',ink:'#172a3a',muted:'#536a7c',surface:'#ffffff',soft:'#eef6fc',border:'#dce5ec',font:'"Segoe UI", Arial, sans-serif',radius:'14px',focus:'#a95200'});
exports.brandStyle = function(theme) {
  const p = theme && theme.palette || {};
  const s = theme && theme.semanticColors || {};
  const color = (v, fallback) => typeof v === 'string' && /^#(?:[0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(v) ? v : fallback;
  return {'--m365-primary':color(p.themePrimary,exports.brand.primary),'--m365-ink':color(s.bodyText,exports.brand.ink),'--m365-muted':color(s.bodySubtext,exports.brand.muted),'--m365-surface':color(s.bodyBackground,exports.brand.surface),'--m365-soft':color(p.themeLighterAlt,exports.brand.soft),'--m365-border':color(s.variantBorder,exports.brand.border),'--m365-font':exports.brand.font,'--m365-radius':exports.brand.radius,'--m365-focus':exports.brand.focus};
};

