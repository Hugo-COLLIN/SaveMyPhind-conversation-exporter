## Libraries
This project uses the following third-party libraries:

- DOMPurify: Licensed under the Apache License, Version 2.0 or the Mozilla Public License Version 2.0. See js/libs/purify_license.txt for details.
- Turndown: Licensed under the MIT License. See js/libs/turndown_license.txt for details.
- Showdown: Licensed under the MIT License. See js/libs/showdown_license.txt for details.

## Roadmap
### Features :
-[ ] Make a Firefox extension (multi-browser development approach ?)
-[ ] Reduce file title length and move the next as the subtitle
```md
# My title...
### ... is too long
```
-[x] Export source links
-[x] Link to the Phind original search on the file top

### Bugs :
-[ ] Code is not correctly formatted when converting Html to md 
-[x] Inconsistent spaces between questions and answers
-[x] Fix bug "AI Answer" with user question
-[x] File title is the last followup question (= tab title)
     => title taken from search bar

### Security :
-[x] Sanitize HTML code

