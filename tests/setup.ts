import { configure } from 'approvals';
import { Options } from 'approvals/lib/Core/Options';

// Global configuration of approval tests
configure({
  //reporters: ['diffmerge', 'clipboard'], // Use your favorite diff tools
  normalizeLineEndingsTo: '\n',
  appendEOL: true,
  errorOnStaleApprovedFiles: true,
  // @ts-ignore
  shouldIgnoreStaleApprovedFile: (file: string) => false,
  EOL: '\n'
});

// Extension of Jest to allow approval tests
expect.extend({
  toMatchApproval(received: any, options?: Partial<Options>) {
    const { approve } = require('approvals');
    approve(received, options);
    return { pass: true, message: () => 'Approved!' };
  }
});

// Declare type for TypeScript
declare global {
  namespace jest {
    interface Matchers<R> {
      toMatchApproval(options?: Partial<Options>): R;
    }
  }
}
