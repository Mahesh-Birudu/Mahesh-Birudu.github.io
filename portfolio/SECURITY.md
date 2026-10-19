# Security policy

The portfolio is a public, static GitHub Pages site. Public demos use synthetic profiles; the production SPFx solution authenticates inside SharePoint. The portfolio has no login, database, payment form or tenant API connection.

Please report security concerns privately to the contact email displayed on the portfolio. Do not post credentials or employee data in public issues. Include the affected URL and a minimal non-destructive reproduction. This project does not authorize testing against Microsoft 365 tenants or third-party services.

The public pages use a restrictive meta Content Security Policy: same-origin JavaScript and media, no network API calls, no plugins, no forms, no base URL overrides, and only the existing Google font services. Inline styling remains enabled for the current template. Referrer information is suppressed. New-tab links use noopener/noreferrer.

GitHub Pages manages HTTP response headers. A meta policy cannot supply server-only protections such as frame-ancestors or X-Frame-Options; those require hosting/CDN support. These measures reduce risk and do not guarantee immunity from attacks. Keep GitHub account authentication secure and do not publish credentials. Dependencies in the downloadable legacy SPFx source need separate maintenance; the public portfolio does not execute the SPFx build dependencies.
