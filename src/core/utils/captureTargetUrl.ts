export function captureTargetUrl(selecteurElement: { click: () => void; }) {
  // Stocker l'URL capturée
  let urlCapturee = null;

  // Créer un proxy pour window.open
  const openOriginal = window.open;
  window.open = function (url, target) {
    // Intercepter et stocker l'URL
    urlCapturee = url;

    // Ne pas ouvrir réellement le nouvel onglet
    console.log('URL interceptée :', urlCapturee);

    // Restaurer la méthode originale immédiatement
    window.open = openOriginal;

    return null;
  };
  console.log(window.open)

  // @ts-ignore
  const eventHandlers = getEventListeners(selecteurElement)
  eventHandlers.click.forEach((evt: { listener: { (this: Window, ev: MouseEvent): any; (): null; }; }) => {
    console.log(evt)
    removeEventListener('click', evt.listener)
    evt.listener = () => null
  })
  console.log(eventHandlers)
  selecteurElement.click();
  throw new Error("stop")
}
