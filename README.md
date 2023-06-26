# <img alt="SaveMyPhind logo" src="img/logo_128_cut.png" style="width:50px"> Save My Phind - AI Conversation Exporter
### 🚀 Export your Phind.com search threads into markdown files!
👉 When you are on a Phind thread, simply click on the extension icon. It will automatically export the thread you are currently on into a formatted markdown file.

✅ Useful if you want to:
- Keep valuable generated information offline
- Share threads content with others
- Read them in a note-taking app like Obsidian

🕰️ No annoying popup, no loss of time! Enjoy!

✏️ Please note that this project is not affiliated with Phind.com and is not an official extension.

<br>

## ❓ Extension usage
### How to install?
Simply go to the Chrome Web Store and click on the install button: 
#### [⏩click here to install Save My Phind](https://chrome.google.com/webstore/detail/save-my-phind/agklnagmfeooogcppjccdnoallkhgkod)
<br>

You can also install it manually following these steps:
1. On GitHub, click on Releases (in the right side menu), go on the latest version and download the `save-my-phind_x.y.z.crx` file.
2. Go on `chrome://extensions` (or `[yourChromiumBasedBrowser]://extensions`), then enable "Developer mode" (toggle on the top right) and reload the page.
3. Drag and drop the .crx file on the page, then click on "Add extension" in the appearing popup window.

✅ You're done!

### How to use?
Simple!
1. Go to a Phind search thread.
2. Click on the extension icon. 

👉 It will automatically download a structured markdown file containing the conversation.

<br>

## 🪶 Contribution and usages
### Copyrigth notice
Feel free to contribute to this project by forking it and making pull requests. You can also open an issue if you find a bug or have any suggestion.
However, you can't distribute this project without contacting me first. Please see the [LICENSE](LICENSE.md) file for more details.

### Libraries
This project uses the following third-party libraries:
- DOMPurify: Licensed under the Apache License Version 2.0 or the Mozilla Public License Version 2.0. See the [DOMPurify Licence](js/libs/purify_license.txt) for details.
- Turndown: Licensed under the MIT License. See the [Turndown Licence](js/libs/turndown_license.txt) for details.
- Showdown: Licensed under the MIT License. See the [Showdown Licence](js/libs/showdown_license.txt) for details.

<br>

## 🗺️ Roadmap
See the [CHANGELOG](CHANGELOG.md) file to see changes sorted by version.
### Features:
- [ ] Make a Firefox extension (multi-browser development approach?)
- [ ] Export tables into markdown tables
- [ ] Link to the downloaded file in the currently opened note in Obsidian
- [ ] Export the "extra code or context" textarea content
- [ ] Save ChatGPT conversations
- [ ] Make icon adapted to each site (Phind, ChatGPT, etc.)
- [ ] Export next search result pages (sources side panel)
- [ ] ~~Export to different file types? (PDF, Word, etc.)~~
- [x] Title stops at the first line break (and ending whitespaces are removed)
- [x] Copy to clipboard when clicking on the extension icon (in addition to file download)
- [x] Reduce file title length and move the next as the subtitle
```md
# My title...
### ... is too long
```
- [x] Export complete user questions unfolding and refolding them (Unfold user questions before exporting and refold them after)
- [x] Model name instead of "AI Answer" (e.g. "GPT-3.5 Answer", "Phind Answer")
- [x] Source numbers next to the source links (numbered list corresponding to citations)
- [x] Export question above sources
- [x] Code type (language) specified in codeblocks (👍 Thanks to @nhuhoang0701)
- [x] Include AI response quotes after the response
- [x] Export source links
- [x] Link to the Phind original search on the file top
- [x] Export conversation to markdown

### Security and maintenance:
- [ ] Use the Phind (official/unofficial?) API instead of scraping the HTML?
- [~] Comment code
- [ ] Make unit/e2e tests
- [ ] Remove unused libraries
- [x] Update repo structure and README: extension focus
- [x] Add a license
- [x] Sanitize HTML code

### Bugs/Issues:
- [ ] Make extension icon with transparent background
- [x] Too long file names can cause issues with OS or Git (cf. Reduce title length feature)
- [x] Import line breaks in user questions and search bar (Phind uses spaces as line breaks)
- [x] Long user question are cut off in the middle so are not entirely exported
- [x] Special characters in title are not correctly formatted (e.g. "\n" should be "\\n")
- [x] Fix broken quotes links
- [x] Fix bug not exporting correctly (AI begins with backtick?, citations so the HTML structure is different?)
- [x] Icons instead of sources
- [x] Code is not correctly formatted when converting Html to md
- [x] Not longer exporting AI answers and source links
  => stronger CSS selectors (try not to use styling classes)
- [x] Inconsistent spaces between questions and answers
- [x] Fix bug "AI Answer" with user question
- [x] File title is the last followup question (= tab title)
  => title taken from search bar
