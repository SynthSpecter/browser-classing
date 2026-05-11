/**
 * Fonctions pour afficher différents types de fichiers.
 * @description Renders different file types (text, images, etc.).
 */

// Fonction pour afficher du texte
function renderText(content) {
  return content
}

// Fonction pour afficher une image (à implémenter plus tard)
function renderImage(content) {
  // Pour l'instant, on retourne juste le nom de l'image
  return `[Image: ${content.name}]`
}

// Fonction pour afficher un fichier selon son type
function renderFile(file) {
  if (file.name.match(/\.(txt|md|json|xml|csv|html|css|js)$/i)) {
    return renderText(file)
  } else if (file.name.match(/\.(png|jpg|jpeg|gif|svg)$/i)) {
    return renderImage(file)
  } else {
    return `Type de fichier non supporté: ${file.name}`
  }
}
