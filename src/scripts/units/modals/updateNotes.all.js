import showdown from "showdown";

async function getUpdates() {
  const response = await fetch(chrome.runtime.getURL('assets/updateNotes.md'));
  const markdown = (await response.text()).replaceAll('\r\n', '\n');
  const sections = markdown.split('\n# ').slice(1); // split on level 2 headers and remove the first empty section
  const content = sections[0].substring(sections[0].indexOf("\n")).trim();
  return content.split('\n\n');
}

export async function getUpdatesData() {
  const converter = new showdown.Converter({
      extensions: [
        function () {
          return [
            {
              type: 'output',
              regex: /<p>(.*?)<\/p>/g,
              replace: '$1'
            }
          ];
        }
      ]
    });

  const updates = await getUpdates();

  const updateDetailsList = [];
  for (const update of updates) {
    const [title, ...descriptionParts] = update.split('\n');
    const mdDescriptionParts = descriptionParts.map((desc) => converter.makeHtml(desc));
    const description = mdDescriptionParts.join('\n');
    updateDetailsList.push({ title, description });
  }
  return updateDetailsList;
}
