# Teams presence

`usePresence` calls the PnPjs-backed `ProfileService.getPresence(profile.id)` once the profile is loaded, and refreshes every 60 seconds while the document is visible. Cleanup clears the timer and prevents stale responses from updating an unmounted component. One hook state feeds both `PresenceBadge` instances in the card and popup.

`Available` is online; `Offline` is offline or appear offline. Busy, do not disturb, idle, away, meeting, call, presenting and focusing have separate labels. Missing consent, throttling, unsupported accounts and unknown availability display **Presence unavailable**, never a fabricated offline status.

The production Graph scope is `Presence.Read.All`, subject to administrator approval. No environment IDs or credentials are required in source. The mock provider returns fictional presence values in the public demo.
