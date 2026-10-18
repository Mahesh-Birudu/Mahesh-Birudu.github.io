# Adding a project to the portfolio

The homepage carousel reads `projects.js`. Add an object to `window.portfolioProjects`; the slide count and navigation update automatically. No framework or package installation is needed.

```js
{
  title: 'Your project name',
  category: 'PERSONAL PROJECT · SOURCE & DEMO',
  summary: 'What the project does and why it matters.',
  tags: ['SPFx', 'TypeScript'],
  image: 'your-project-poster.png',
  imageAlt: 'A clear description of the screenshot',
  page: 'your-project.html',
  github: 'https://github.com/YOUR-NAME/YOUR-REPOSITORY',
  version: '1.0.0',
  video: {src: 'your-project.mp4', poster: 'your-project-poster.png', captions: 'your-project.vtt'},
  demoNote: 'Synthetic data demonstration'
}
```

Upload the referenced image, project page, MP4 and VTT to the repository root, together with the edited `projects.js`. Omit `video` when there is no video and omit `github` when code is not public. Use synthetic data in public screenshots and demos. Enterprise engagements must not include confidential client code or data.

The carousel supports touch scrolling, arrow buttons and Left/Right keys when its region is focused. Smooth scrolling respects the visitor's reduced-motion setting. It does not auto-advance or auto-play video. The video dialog closes with its Close button or Escape and returns focus to its trigger.

Main files: `index.html`, `portfolio-v2.css`, `portfolio-v2.js`, `projects.js`, `mahesh-portrait.png`. The existing project showcase, setup guide and source archive remain at their previous URLs. Content Security Policy and referrer protections are retained.

Portrait: edited from the owner's supplied photograph with a navy suit and balanced studio lighting. AI editing aims to preserve facial identity but is not pixel-identical to the original.
