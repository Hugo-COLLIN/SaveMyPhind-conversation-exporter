export function btnBarAllInline(topBtnsGroup) {
  const btns = topBtnsGroup.nextElementSibling.querySelectorAll("button")
  if (btns.length !== 0) {
    topBtnsGroup.nextElementSibling.style.display = "inline";
    btns.forEach(elt => {
      elt.classList.remove("mb-4", "mb-3");
      elt.classList.add("mr-2", "mt-1");
    })
  }
}