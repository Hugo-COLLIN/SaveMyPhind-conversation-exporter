import {main} from "./main";

export function threadFromList(index) {
  main().then(r =>{
    console.log("main done");
    document.querySelectorAll('.table-responsive tr')[index].click();
  });

}