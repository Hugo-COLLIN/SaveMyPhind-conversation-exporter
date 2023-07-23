import {welcome} from "./activeTab/welcome/welcome";
import {catchContent} from "./activeTab/extractor/extractor";
import {exporter} from "./activeTab/exporter/exporter";
import {sleep} from "./activeTab/utils/utils";

export async function threadFromList(index) {
  if (document.URL.includes("phind.com")) {
    await welcome();
    const caught = await catchContent();
    if (caught !== null) {
      await exporter(caught.markdownContent, caught.title);
      console.log("Export done!")
    }
  }
  console.log("main done");
}

export async function clickOnListElt(index) {
  let list = document.querySelectorAll('.table-responsive tr');
  while (list.length === 0) {
    console.log("waiting for list")
    await sleep(1000);
    list = document.querySelectorAll('.table-responsive tr');
  }
  list[index].click();
}