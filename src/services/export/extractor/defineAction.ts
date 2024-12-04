import {clickElements} from "../../interact/cs/interact";
import {sleep} from "../../../utils/jsShorteners";


//TODO: currently for Claude artifacts, needs to be genericized
async function clickActClose(markdown: string | undefined, format: ((html: string) => string) | undefined) {
  const pane = document.querySelector("div.fixed.flex");
  const btns = document.querySelectorAll('.font-claude-message button');

  // selector duplication with processMessage in ClaudeChat.js and ClaudeChat.json
  for (const artifactBtn of btns) {
    // @ts-ignore
    artifactBtn.click();
    await sleep(100);
    // @ts-ignore
    document.querySelector("[data-testid=\"undefined-code\"][data-state=\"off\"]")?.click() && await sleep(100); // Click on 'Code' button if it exists and is off
    let artifactContent;
    let i = 0;
    while (!artifactContent && i < 10) {
      artifactContent = pane?.querySelector(".code-block__code, .font-claude-message");
      await sleep(100);
    }
    markdown = markdown?.replace("{{@CAPTURE_ARTIFACT_CONTENT}}", format?.(artifactContent?.outerHTML ?? "") ?? "");
  }

  // @ts-ignore
  pane?.querySelector(".justify-end > button")?.click(); // close artifact

  return markdown;
}

export async function defineAction(action: {
  type: any;
  selector?: string
}, markdown?: string, format?: (html: string) => string): Promise<string | void | null> {
  switch (action.type) {
    case "click":
      return clickElements(action.selector);
    case "click_act_close":
      return await clickActClose(markdown, format);
    // case "scroll":
    //   return scrollElements;
    // case "type":
    //   return typeElements;
    // case "wait":
    //   return wait;
    default:
      return null;
  }
}
