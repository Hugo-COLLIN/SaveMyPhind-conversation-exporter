## Libraries
This project uses the following third-party libraries:

- DOMPurify: Licensed under the Apache License, Version 2.0 or the Mozilla Public License Version 2.0. See js/libs/purify_license.txt for details.
- Turndown: Licensed under the MIT License. See js/libs/turndown_license.txt for details.
- Showdown: Licensed under the MIT License. See js/libs/showdown_license.txt for details.

## Roadmap
Features :
-[ ] Reduce file title length and move the next as the subtitle
```md
# My title...
### ... is too long
```
-[x] Export source links
-[x] Link to the Phind original search on the file top


  Security :
-[x] Sanitize HTML code


  Problems :
-[ ] Code is not correctly formatted when converting Html to md 
-[x] Inconsistent spaces between questions and answers