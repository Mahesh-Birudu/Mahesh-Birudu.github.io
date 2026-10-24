# Stock module

config.ts: company settings and validation.
stockService.ts: reference IBM feed and normalized company API response adapter.
StockConfiguration.tsx: site-owner configuration form.
StockPanel.tsx: reusable chart and drawer, rendered outside the Microsoft suite DOM through a body portal.

Company feeds must return the JSON contract documented in the project README. Use a server-side proxy for private provider keys and provider-specific mapping. No customer feed is configured by default.
