/*
--- OTHERS ---
 */

/**
 * @description - Wait the corresponding time
 * @param ms time to wait in milliseconds
 * @returns {Promise<unknown>}
 */
export function sleep(ms: number | undefined): Promise<unknown> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * @description - Call the function of the object -
 * if the function is not found, return an error
 * Supports async functions
 * @param object object where the function is
 * @param funcToCall function to call
 * @param args
 */
export function dynamicCall(object: { [x: string]: (arg0: any) => any; }, funcToCall: string | number, ...args: any[]) {
  return typeof object[funcToCall] === 'function' ?
    // @ts-ignore TODO
    object[funcToCall](...args)
    : () => {
    console.error(`Function ${funcToCall} not found`);
    return null;
  };
}

/**
 * @description - Execute the function safely - enable to continue execution if an error is thrown
 * <!> WARNING: Don't add await in front of the function passed as parameter
 * @returns {function(...[*]=)}
 * @param action
 * @param catchAction
 */
export async function safeExecute(action: any, catchAction?: (error: any) => void): Promise<void> {
  async function executeAction() {
    switch (typeof action) {
      case 'function':
        // @ts-ignore TODO
        return await action();
      default:
        // console.log("Action to execute:", action);
        return await action;
    }
  }

  // if (APP_MODE === 'dev') {
  //   return await executeAction();
  // }
  try {
    return await executeAction();
  } catch (error: any) {
    catchAction
      // @ts-ignore TODO
      ? catchAction(error)
      : console.error(error.stack ?? error.message ?? error); // "Error caught:", error.message,
  }
}
