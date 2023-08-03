async function getUpdates() {
  const response = await fetch(chrome.runtime.getURL('assets/updateNotes.md'));
  const markdown = (await response.text()).replaceAll('\r\n', '\n');
  // console.log(markdown);
  const sections = markdown.split('\n# ').slice(1); // split on level 2 headers and remove the first empty section
  const content = sections[0].substring(sections[0].indexOf("\n")).trim();
  // console.log(content.split('\n\n'));
  return content.split('\n\n');
}

export async function getUpdatesData() {
  const updates = await getUpdates();

  const updateDetailsList = [];
  for (const update of updates) {
    const [title, ...descriptionParts] = update.split('\n');
    const description = descriptionParts.join('\n');
    updateDetailsList.push({ title, description });
    // const innerDiv = createModalTextGroup(title, description);
    // modalBodyDiv.appendChild(innerDiv);
  }
  console.log(updateDetailsList)
  return updateDetailsList;
}