export async function replaceVariables(content, variables) {
  let processedContent = content;

  // Recherche de tous les placeholders dans le format ${VARIABLE_NAME}
  const variablePattern = /\$\{([^\}]+)\}/g;
  let match;

  while ((match = variablePattern.exec(content)) !== null) {
    const fullMatch = match[0];
    const variablePath = match[1].split('.'); // Divise le chemin d'accès de la variable en segments

    let variableValue = variables;
    // console.log(variables)
    // console.log(variablePath)
    // console.log(variablePath.split('.')[1])
    // Itère à travers chaque segment du chemin pour accéder à la valeur imbriquée
    for (let i = 1; i < variablePath.length; i++) {
      const segment = variablePath[i];
      if (variableValue[segment] !== undefined) {
        variableValue = variableValue[segment];
      } else {
        // Si un segment n'existe pas, la valeur de la variable reste indéfinie
        variableValue = undefined;
        break;
      }
    }

    if (variableValue !== undefined) {
      // Remplacer le placeholder par la valeur de la variable
      processedContent = processedContent.replace(fullMatch, variableValue);
    }
  }

  return processedContent;
}

export function replaceLocalPath(content) { //TODO: path parameter
  return content.replace(/src="assets\/(.*?)"/g, (match, path) => `src="${chrome.runtime.getURL(`assets/${path}`)}"`);
}
