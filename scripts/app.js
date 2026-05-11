/**
 * Initialise l'application Browser Classing.
 */
document.addEventListener('DOMContentLoaded', () => {
  // Vérifie si l'API File System Access est disponible
  if (!('showDirectoryPicker' in window)) {
    alert(
      "Votre navigateur ne supporte pas l'API File System Access. Essayez Chrome ou Edge. / Your browser does not support the File System Access API. Try Chrome or Edge.",
    )
    return
  }

  // Initialise l'explorateur de fichiers
  const fileExplorer = new FileExplorer()
})
