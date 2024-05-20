import {Extractor} from "./Extractor";
import {
  filter_backslashAngleBracketsNotInBackticks_Phind,
  filter_formatLinks_Phind,
  filter_preserveLineBreaksInPre_Phind,
  replacement_backslashAngleBracketsNotInBackticks_Phind,
  replacement_formatLinks_Phind,
  replacement_preserveLineBreaksInPre_Phind
} from "../rules/rules";

// export const turndown = {
//   rules: {
//     preserveLineBreaksInPre: {
//       filter: filter_preserveLineBreaksInPre_Phind(),
//       replacement: replacement_preserveLineBreaksInPre_Phind()
//     },
//     formatLinks: {
//       filter: filter_formatLinks_Phind(),
//       replacement: replacement_formatLinks_Phind()
//     },
//     backslashAngleBracketsNotInBackticks: {
//       filter: filter_backslashAngleBracketsNotInBackticks_Phind(),
//       replacement: replacement_backslashAngleBracketsNotInBackticks_Phind(),
//     }
//   }
// }

export default class ExtractorPhind extends Extractor {
}
