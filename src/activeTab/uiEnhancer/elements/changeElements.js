export function btnBarAllInline(topBtnsGroup) {
  const btns = topBtnsGroup.nextElementSibling.querySelectorAll("button")
  if (btns.length !== 0) {
    const nextElt = topBtnsGroup.nextElementSibling;
    nextElt.style.display = "inline";
    nextElt.style.marginRight = "0.5rem";
    btns.forEach(elt => {
      elt.classList.remove("mb-4", "mb-3");
      elt.classList.add("mt-1");
    });
  }
}