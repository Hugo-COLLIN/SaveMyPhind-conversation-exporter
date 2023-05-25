# Save My Phind 
### Conversation exporter for the AI search engine Phind.com

## Chrome extension
### How to install?
Simply go to the Chrome Web Store and click on the install button : [click here](https://chrome.google.com/webstore/detail/save-my-phind/agklnagmfeooogcppjccdnoallkhgkod)

You can also install it manually following these steps:
1. Download the latest version : on GitHub, click on Releases (in the right side menu), go on the latest version and download the `save-my-phind_x.y.z.crx` file.
2. Go on chrome://extensions (or \[yourChromiumBasedBrowser]://extensions), then drag and drop the .crx file on the page.
3. Click on "Add extension" in the appearing popup window.
4. You're done!

### How to use?
1. Go to a Phind search thread.
2. Click on the extension icon.
3. It will automatically download a structured markdown file containing the conversation.

___
## Roadmap
### Features:
- [ ] Model name instead of "AI Answer" (e.g. "GPT-3.5 Answer", "Phind Answer")
- [ ] Citation numbers next to the source links (numbered list)
- [ ] ~~Export to different file types? (PDF, Word, etc.)~~
- [ ] Make a Firefox extension (multi-browser development approach?)
- [ ] Reduce file title length and move the next as the subtitle
```md
# My title...
### ... is too long
```
- [x] Code type (language) specified in codeblocks (👍 Thanks to @nhuhoang0701)
- [x] Include AI response quotes after the response
- [x] Export source links
- [x] Link to the Phind original search on the file top
- [x] Export conversation to markdown

### Security and maintenance:
- [ ] Use the Phind (official/unofficial?) API instead of scraping the HTML?
- [ ] Comment code
- [ ] Remove unused libraries
- [x] Sanitize HTML code

### Bugs:
- [ ] Make extension icon with transparent background
- [ ] Special characters in title are not correctly formatted (e.g. "\n" should be "\\n")
- [ ] Long user question are cut off in the middle so are not entirely exported
  => temporary solution: drop the question by using "v" button before exporting.
- [x] Fix broken quotes links
- [x] Fix bug not exporting correctly (AI begins with backtite?, citations so the HTML structure is different?)
  https://www.phind.com/search?cache=3dc3a9e2-6841-4ca0-9110-8ee9b11c327b
- [x] Icons instead of sources
- [x] Code is not correctly formatted when converting Html to md
- [x] Not longer exporting AI answers and source links
  => stronger CSS selectors (try not to use styling classes)
- [x] Inconsistent spaces between questions and answers
- [x] Fix bug "AI Answer" with user question
- [x] File title is the last followup question (= tab title)
  => title taken from search bar

