// export function isEmojiSupported() {
//   const trinidad = String.fromCodePoint(0x1F1F9, 0x1F1F9);
//   const hammerpick = String.fromCodePoint(0x2692);
//
//   function getWidth(s) {
//     const n = document.body.appendChild(document.createElement("span"));
//     n.appendChild(document.createTextNode(s));
//     const w = n.offsetWidth;
//     n.parentNode.removeChild(n);
//     return w;
//   }
//
//   return getWidth(trinidad) === getWidth(hammerpick);
// }

// Seems it returns true even if the browser doesn't support emojis
export function isEmojiSupported() {
  const alpha = String.fromCodePoint(0x1F1F9, 0x1F1F9);
  const beta = String.fromCodePoint(0x2692);

  function areEmojisEqual(emoji1: string, emoji2: string) {
    // Compare lengths of normalized strings (in Unicode)
    return emoji1.normalize() === emoji2.normalize();
  }

  return !areEmojisEqual(alpha, beta);
}
