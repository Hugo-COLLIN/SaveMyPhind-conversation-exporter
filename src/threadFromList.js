import {welcome} from "./activeTab/welcome/welcome";
import {catchContent} from "./activeTab/extractor/extractor";
import {exporter} from "./activeTab/exporter/exporter";

export async function threadFromList(index) {
  if (document.URL.includes("phind.com")) {
    await welcome();
    const caught = await catchContent();
    if (caught !== null) {
      await exporter(caught.markdownContent, caught.title);
      console.log("Export done!")
    }
  }
  // main().then(r =>{
  console.log("main done");
  document.querySelectorAll('.table-responsive tr')[index].click();
  // });

}