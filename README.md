# <img alt="SaveMyPhind logo" src="./media/logo_128_cut.png" style="width:50px"> Save My Phind - AI Conversation Exporter
### 🚀 Export your Phind.com search threads into markdown files!
♨️ Now exports Phind "Pair Programming" threads!

👉 When you are on Phind, simply click on the extension icon. It will automatically export the thread you are currently on into a formatted markdown file.

😎 Why Save my Phind?
- To keep AI generated information offline,
- To share threads with others,
- To read and process in a knowledge base / note-taking app (like Obsidian).

🕰️ No annoying popup, no loss of time! 

✅ Enjoy!

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
### The project
Feel free to contribute to this project by forking it and making pull requests. You can also open an issue if you find a bug or have any suggestion.
However, you can't distribute this project without contacting me first. 

This project is licensed under the [SaveMyPhind License](LICENSE.md). Please check for more details.

### Libraries licenses
This project uses third-party libraries. See the [license list](licenses.txt) for more details about libraries' licenses.

<br>

## 🗺️ Roadmap
See the [CHANGELOG](CHANGELOG.md) file to see changes sorted by version.
### Features:
- [ ] Option page : choose subfolder to save files in (or custom download location)
- [ ] Add type (Phind Search, Phind Pair, ChatGPT) between date and title in filename + in header link
- [ ] Export tables into markdown (Turndown rule)
- [ ] Link to the downloaded file in the currently opened note in Obsidian
- [ ] Copy the last response to the clipboard when clicking on the extension icon (instead of the entire response)
  - Phind Search : click on the copy button
  - Phind Pair : export the last answer div
- [ ] Automatically download the conversation?
- [ ] Save ChatGPT conversations
- [ ] Make icon adapted to each site (Phind, ChatGPT, etc.)
- [ ] Export the "extra code or context" textarea content
- [ ] Export next search result pages (sources side panel)
- [ ] Automatically copy the last response to the clipboard (without clicking on the extension icon)?
- [x] Make Save my Phind available on Firefox
- [x] Export Phind Pair Programming conversations
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
- [ ] Make unit/e2e tests
- [x] Remove unused libraries
- [x] Divide code into modules
- [x] Use `npm` to manage dependencies
- [x] License list generation
- [x] Build automation
- [x] Comments + better code structuration
- [x] Update repo structure and README: extension focus
- [x] Add a license
- [x] Sanitize HTML code

### Bugs/Issues:
- [ ] Pair programmer: Line breaks in user questions (Phind uses spaces as line breaks)
- [ ] Fix bug "charAt not a function" on some specific threads
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
- [ ] ~~(Prevision) Fix browser alert "Do you want this site to open external application?"~~
