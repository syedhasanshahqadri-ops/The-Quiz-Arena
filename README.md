# The Quiz Arena — SHS

A responsive, installable MCQ game using the supplied palette:
- `#0F1C3F` deep navy
- `#526A87` steel blue
- `#D2B77E` champagne gold
- `#10131D` midnight

## Run locally
Open `index.html` in a browser. For full PWA/offline testing, serve the folder over localhost:
`python -m http.server 8000`
Then visit `http://localhost:8000`.

## Deploy to GitHub Pages
Upload the contents of this folder to the repository's publishing branch/root. This project uses relative asset paths and works from a GitHub Pages project subpath.

## Gameplay
Choose a standard on the first screen. The quiz begins immediately. A level advances only after a correct answer. Wrong answers keep the player on the same question and offer a retry. Correct answers trigger a confetti celebration. The included bank contains 12 questions per standard. The deck shuffles and cycles after all questions in that standard have been used, so play can continue indefinitely without repeating within a cycle.

## Offline / install
The service worker caches the app shell and bundled question bank after the first successful visit. Install is supported through the browser's own install menu where available. The app does not use a remote question-generation service.

## Custom questions
Edit `questions.js`. Each question needs `id`, `subject`, `question`, four `options`, zero-based `answer`, `explanation`, and `difficulty`.

## Notes
The supplied bank is an initial starter set, not an exhaustive curriculum or a claim of unlimited unique pre-written questions. Extend it by adding question objects to each standard.
