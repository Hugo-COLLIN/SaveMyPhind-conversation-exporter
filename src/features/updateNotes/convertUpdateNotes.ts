import showdown from "showdown";
import {getUpdates} from "./formatUpdateNotes";

export async function convertUpdateNotes() {
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
    updateDetailsList.push({title, description});
  }
  return updateDetailsList;
}
