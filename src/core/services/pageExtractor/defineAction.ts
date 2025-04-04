import {clickElements} from "../interact/cs/interact";
import {sleep} from "../../utils/jsShorteners";


//TODO: currently for Claude artifacts, needs to be generalized
async function clickActClose(markdown: string | undefined, format: ((html: string) => string) | undefined, extractionTypeId: string, btns?: NodeListOf<any>) {
  // selector duplication with processMessage in ClaudeChat.js and contentSelector in ClaudeChat.json
  const pane = document.querySelector("body div.h-full.overflow-hidden.flex-1");

  for (const artifactBtn of btns?.values() ?? []) {
    const artifactName = artifactBtn.querySelector(".shrink.flex")?.textContent
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
  pane?.querySelector(`.text-sm.items-center.gap-2.flex > .active\\:scale-95.rounded-md.w-8.h-8.aria-expanded\\:text-text-100.aria-checked\\:text-text-100.aria-pressed\\:text-text-100.hover\\:text-text-100.aria-expanded\\:bg-bg-300.aria-checked\\:bg-bg-400.aria-pressed\\:bg-bg-400.hover\\:bg-bg-400.ease-\\[cubic-bezier\\(0\\.165\\,0\\.85\\,0\\.45\\,1\\)\\].duration-300.font-styrene.transition.border-transparent.text-text-300.disabled\\:drop-shadow-none.disabled\\:shadow-none.disabled\\:opacity-50.disabled\\:pointer-events-none.select-none.can-focus.shrink-0.relative.justify-center.items-center.inline-flex`)?.click(); // close artifact

  return markdown;
}

export async function defineAction(action: {
  type: any;
  selector?: string
}, markdown?: string, format?: (html: string) => string): Promise<string | void | null> {
  switch (action.type) {
    case "click":
      //@ts-ignore
      return clickElements(action.selector);
    case "click_act_close":
      let md = await clickActClose(markdown, format, `CAPTURE_ARTIFACT_CONTENT`, document.querySelectorAll('.font-claude-message button[aria-label]'));
      md = await clickActClose(md, format, "CAPTURE_INPUT_CONTENT", document.querySelectorAll('[data-testid=\"file-thumbnail\"]'));
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
