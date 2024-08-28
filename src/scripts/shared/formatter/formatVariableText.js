export async function replaceVariables(content, variables) {
  let processedContent = content;

  // Search for all placeholders in ${VARIABLE_NAME}
  const variablePattern = /\$\{([^\}]+)\}/g;
  let match;

  while ((match = variablePattern.exec(content)) !== null) {
    const fullMatch = match[0];
    const variablePath = match[1].split('.'); // Divides the variable path into segments

    let variableValue = variables;
    // Iterate through each segment to access the nested value
    for (let i = 1; i < variablePath.length; i++) {
      const segment = variablePath[i];
      if (variableValue[segment] !== undefined) {
        variableValue = variableValue[segment];
      } else {
        // If a segment does not exist, the value of the variable remains undefined
        variableValue = undefined;
        break;
      }
    }

    if (variableValue !== undefined) {
      // Replace the placeholder with the value of the variable
      processedContent = processedContent.replace(fullMatch, variableValue);
    }
  }

  return processedContent;
}

export function replaceLocalPath(content) { //TODO: path parameter
  return content.replace(/src="files\/(.*?)"/g, (match, path) => `src="${chrome.runtime.getURL(`../files/${path}`)}"`);
}
