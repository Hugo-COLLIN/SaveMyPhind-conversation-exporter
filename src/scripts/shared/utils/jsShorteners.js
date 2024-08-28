/*
--- OTHERS ---
 */

/**
 * @description - Wait the corresponding time
 * @param ms time to wait in milliseconds
 * @returns {Promise<unknown>}
 */
export function sleep(ms) {
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
export function dynamicCall(object, funcToCall, ...args) {
  return typeof object[funcToCall] === 'function' ?
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
export async function safeExecute(action, catchAction = null) {
  if (APP_MODE === 'dev') {
    // console.log("Action to execute:", action);
    return await action;
  }
  try {
    return await action;
  } catch (error) {
    catchAction
      ? catchAction(error)
      : console.error(error.stack ?? error.message ?? error); // "Error caught:", error.message,
  }
}
