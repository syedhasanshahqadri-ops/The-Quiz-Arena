# The Quiz Arena

Installable, offline-capable MCQ quiz game with five standards (Standard-01 to Standard-05), 200 questions each.

Palette: #FF6B35 #F7B32B #F25F5C #FFE8C2 #FFF9F0 #0077B6 #00B4D8 #90E0EF #CAF0F8 #F1FAFE (dark theme uses deep blues derived from #0077B6).

## Run locally
`python -m http.server 8000` then open http://localhost:8000 (the service worker needs http, not file://).

## Deploy
Upload the folder contents to the GitHub Pages branch. All paths are relative.

## Rules
Each standard unlocks after the previous one is fully solved. A wrong answer brings a different question and the missed one returns a few questions later. Every 10 solved questions clears a level and earns stars.
