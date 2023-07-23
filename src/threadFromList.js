import {main} from "./main";

function threadFromList(index) {
  main().then(r =>{
    console.log("main done");
    document.querySelectorAll('.table-responsive tr')[index].click();
  });

}