# Microsoft 365 Profile Cards — React source and setup

Version **1.2.0**. Browse the actual [SPFx source folder](projects/m365-profile-cards/) rather than a source ZIP:

- [React components](projects/m365-profile-cards/src/components/): ProfileCard, ProfileDetailsDialog, PresenceBadge, ProfilePhoto.
- [React hooks](projects/m365-profile-cards/src/hooks/): useProfile and usePresence.
- [PnPjs service](projects/m365-profile-cards/src/services/ProfileService.ts).
- [Registered web component](projects/m365-profile-cards/src/webComponents/ProfileCardWebComponent.ts).
- [PnP library registration](projects/m365-profile-cards/src/libraries/profileCards/ProfileCardsLibrary.ts).
- [Upload-ready Handlebars](projects/m365-profile-cards/templates/profile-cards.html).
- [Dependencies/build commands](projects/m365-profile-cards/README.md), [setup](projects/m365-profile-cards/docs/SETUP.md), [architecture](projects/m365-profile-cards/docs/ARCHITECTURE.md), [presence](projects/m365-profile-cards/docs/TEAMS-PRESENCE.md) and [validation](projects/m365-profile-cards/VALIDATION.md).

## Usage

```handlebars
<m365-profile-details
  data-user-id="{{item.AccountName}}"
  data-theme-variant="{{JSONstringify @root.theme}}">
</m365-profile-details>
```

PnP resolves these attributes into React props. React renders the card and popup, and manages loading, errors, photo fallback and Teams presence. PnPjs calls Graph using the SPFx ServiceScope. There are no `js-profile-*` span hooks or class-based data hydration in this version.

## Installation

1. Build and deploy [version 1.2.0.0 package](m365-profile-cards.sppkg); update the site app if needed.
2. Review Graph `User.Read.All`, `ProfilePhoto.Read.All`, `Presence.Read.All` approvals.
3. Upload [profile-cards.html](profile-cards.html) into Site Assets.
4. Configure PnP Search Results with SharePoint Search / Local People Results and select `AccountName`; use `{searchTerms}` or a default `*` query.
5. Enable library `e425e0ca-e11c-45c6-80b2-94c5e6b035ae`, select Custom layout and set External template URL to your file. Keep the built-in library enabled.
6. Test and publish. The old `m365-profile-card` tag is a compatibility alias; its internal child markup is replaced by React.

## Demo and downloads

- [Interactive React demo](https://mahesh-birudu.github.io/profile-cards-demo.html): production React UI with fictional profiles and simulated Teams states.
- [Captioned visual walkthrough](https://mahesh-birudu.github.io/profile-cards-demo.mp4): earlier 1.1.0 visuals; the interactive demo is current 1.2.0.
- [Source ZIP](m365-profile-cards-source.zip), [SPFx package](m365-profile-cards.sppkg), [template](profile-cards.html).

Public hosting serves synthetic data. Live profiles require SharePoint, signed-in context and administrator-approved Graph scopes. No passwords, secrets or tenant IDs belong in source.
