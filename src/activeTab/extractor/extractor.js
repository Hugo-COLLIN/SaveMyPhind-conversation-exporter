import {exportPhindPair, exportPhindSearch, exportRandomPage} from "./extractPages";

import {getPhindPageTitle} from "./getters";

export async function catchContent() {
  const url = window.location.href;
  let markdownContent = "", title = "";
  switch (true) {
    case url.includes('www.phind.com/search'):
      markdownContent = await exportPhindSearch();
      title = getPhindPageTitle();
      break;
    case url.includes('www.phind.com/agent'):
      markdownContent = await exportPhindPair();
      title = getPhindPageTitle();
      break;
    default: {
      return null;
      // markdownContent = await exportRandomPage();
      // title = document.title;
    }
  }
  return {markdownContent, title};
}


export function catchAllThreads() {
  // for (let i = 0; i < document.querySelectorAll(".table-responsive tr").length; i++)
  // {
  //   document.querySelectorAll(".table-responsive tr")[i].click();
  //   document.addEventListener("DOMContentLoaded", async () => {
  //     console.log("loaded");
  //     alert(document.title)
  //     await catchContent();
  //     // catchContent();
  //   });
  // }

  // document.querySelectorAll(".table-responsive tr").forEach((link) => {
  //   link.click();
  //   console.log("clicked");
  //   //wait content is loaded
  //   document.addEventListener("DOMContentLoaded", () => {
  //     console.log("loaded");
  //     // catchContent();
  //   });
  // });

  // // Grab all the links
  // let links = Array.from(document.querySelectorAll(".table-responsive tr"));
  //
  // // Function to process each link
  // async function processLink(link) {
  //   return new Promise((resolve, reject) => {
  //     // Open link in a new window/tab
  //     let newWindow = window.open(link);
  //
  //     // When the new window loads, call `catchContent`
  //     newWindow.onload = async function() {
  //       try {
  //         await newWindow.catchContent();   // Should be defined in each new window
  //         newWindow.close();
  //         resolve();
  //       } catch(error) {
  //         reject(error);
  //       }
  //     }
  //   });
  // }
  //
  // // Function to process all links
  // async function processAllLinks() {
  //   for (let link of links) {
  //     console.log(`Processing ${link}...`);
  //     try {
  //       await processLink(link);
  //       console.log(`Done with ${link}`);
  //     } catch(error) {
  //       console.error(`Error with ${link}: ${error}`);
  //     }
  //   }
  //   console.log(`Done with all links!`);
  // }
  //
  // // Kick off the processing
  // processAllLinks();

  // // Get all the table rows
  // let rows = document.querySelectorAll(".table-responsive tr");
  //
  // for (let i = 0; i < rows.length; i++) {
  //   let row = rows[i];
  //
  //   // Get the URL related to the row
  //   // This will depend on your specific HTML structure
  //   let url = getURLFromRow(row);
  //
  //   // Navigate to the URL
  //   window.location.href = url;
  //
  //   // Wait for the page to load
  //   document.addEventListener("DOMContentLoaded", async () => {
  //     console.log("loaded");
  //     alert(document.title)
  //     await catchContent();
  //   });
  // }

  // Get all the table rows
  let rows = document.querySelectorAll(".table-responsive tr");

  // Add event listener to every row
  for (let i = 0; i < rows.length; i++) {
    let row = rows[i];

    // clicking event
    row.onclick = function () {
      // open a new window with the URL of your clicked item...
      let URL = "";  // You will need to determine how the URL is formed or where it is stored.

      let newTab = window.open(URL,'_blank');

      // Add a load event listener to the new window
      newTab.addEventListener('load', function () {
        let remote = newTab.window;

        // The code inside this will run once the new page has loaded
        remote.console.log("loaded");
        remote.alert(remote.document.title);

        // You can call your "catchContent" function here
        remote.catchContent();
      });
    }
  }

}


// pour i
// for (let i = 0; i < document.querySelectorAll(".table-responsive tr").length; i++)
// document.querySelectorAll(".table-responsive tr")[i].click();
// document.addEventListener("DOMContentLoaded", () => {
//   console.log("loaded");
//   catchContent();
// });

