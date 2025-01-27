import {clickElements} from "../../../core/services/interact/cs/interact";
import {sleep} from "../../../core/utils/jsShorteners";


//TODO: currently for Claude artifacts, needs to be generalized
async function clickActClose(markdown: string | undefined, format: ((html: string) => string) | undefined, extractionTypeId: string, btns?: NodeListOf<any>) {
  // selector duplication with processMessage in ClaudeChat.js and contentSelector in ClaudeChat.json
  const pane = document.querySelector("div.fixed.flex");

  for (const artifactBtn of btns?.values() ?? []) {
    const artifactName = artifactBtn.querySelector(".break-words")?.textContent
    // console.log(artifactName)
    // @ts-ignore
    artifactBtn.click();
    await sleep(100);
    // @ts-ignore
    document.querySelector("[data-testid=\"undefined-code\"][data-state=\"off\"]")?.click() && await sleep(100); // Click on 'Code' button if it exists and is off
    let artifactContent;
    let i = 0;
    while (!artifactContent && i < 10) {
      artifactContent = pane?.querySelector(".code-block__code, .font-claude-message, .break-all");
      i++
      if (!artifactContent) console.log("Waiting for artifact content", i);
      await sleep(100);
    }

    if (pane?.querySelector(".code-block__code, .break-all")) {
      if (pane?.querySelector(".break-all")) {
        const code = document.createElement("code");
        code.innerHTML = artifactContent?.outerHTML ?? "";
        artifactContent = code;
      }
      const pre = document.createElement("pre");
      pre.innerHTML = artifactContent?.outerHTML ?? "";
      artifactContent = pre;
    }

    const artifactExportName = artifactBtn.querySelector(".text-center")?.textContent == "pasted"
      ? "Pasted Content"
      : artifactName;

    markdown = markdown?.replace(`{{@${extractionTypeId}:${artifactName}}}`, `---\n**${artifactExportName ?? "Artifact"}:**\n` + (format?.(artifactContent?.outerHTML ?? "") ?? "") + "\n---");
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
      let md = await clickActClose(markdown, format, `CAPTURE_ARTIFACT_CONTENT`, document.querySelectorAll('.font-claude-message button[aria-label="Preview contents"]'));
      md = await clickActClose(md, format, "CAPTURE_INPUT_CONTENT", document.querySelectorAll('[data-test-render-count] button[data-testid]'));
      return md;
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
