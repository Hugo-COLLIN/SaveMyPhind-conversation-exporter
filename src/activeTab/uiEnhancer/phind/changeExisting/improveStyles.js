import {waitAppears} from "../../interactDOM/interactDOM";

function modifyingStyle() {
  document.querySelector(".row > .col-lg-2 > div").style.minWidth = "11em";
  const thread = document.querySelector(".row > .col-lg-8.mt-8");
  if (thread !== null) {
    thread.classList.add("mx-3");
    const bar = document.querySelector(".col-lg-8.col-md-12");
    if (bar !== null) bar.classList.add("mx-3");
  }

  // Remove space between buttons in left side menu
  waitAppears(".col-lg-2 > div > div > table").then((elt) => {
    document.querySelectorAll(".col-lg-2 > div > div > table").forEach((elt) => {
      elt.classList.add("mb-0");
    });
  });
  waitAppears(".col-lg-2 > div > div > table.mb-7").then((elt) => {
    if (!elt) return;
    elt.classList.remove("mb-7");
  });
}