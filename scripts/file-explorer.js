/**
 * Classe FileExplorer
 * @class
 * @description Gère la navigation dans les fichiers/dossiers locaux.
 */
class FileExplorer {
  constructor() {
    this.currentDirectory = null
    this.currentPath = []
    this.fileListElement = document.getElementById('file-list')
    this.currentPathElement = document.getElementById('current-path')

    // Écouteurs pour les boutons
    document
      .getElementById('back-btn')
      .addEventListener('click', () => this.goBack())
    document
      .getElementById('close-viewer-btn')
      .addEventListener('click', () => {
        document.getElementById('file-viewer').classList.add('hidden')
      })

    // Démarre avec le répertoire racine
    this.listFiles()
  }

  /**
   * Liste les fichiers/dossiers du répertoire actuel.
   */
  async listFiles() {
    try {
      // Utilise l'API File System Access pour sélectionner un dossier
      if (!this.currentDirectory) {
        this.currentDirectory = await window.showDirectoryPicker()
        this.currentPath = []
      }

      this.fileListElement.innerHTML = ''
      this.updatePathDisplay()

      // Liste les entrées du dossier
      for await (const entry of this.currentDirectory.values()) {
        const itemElement = document.createElement('div')
        itemElement.className = `file-item ${entry.kind}`
        itemElement.textContent = entry.name

        if (entry.kind === 'directory') {
          itemElement.addEventListener('click', () => this.openDirectory(entry))
        } else {
          itemElement.addEventListener('click', () => this.openFile(entry))
        }

        this.fileListElement.appendChild(itemElement)
      }
    } catch (error) {
      console.error('Erreur lors de la liste des fichiers :', error)
      this.fileListElement.innerHTML =
        '<p style="color: var(--neon-pink);">Erreur : Impossible de lister les fichiers. / Error: Cannot list files.</p>'
    }
  }

  /**
   * Ouvre un dossier.
   * @param {FileSystemDirectoryHandle} directory - Le dossier à ouvrir.
   */
  async openDirectory(directory) {
    this.currentPath.push(directory.name)
    this.currentDirectory = directory
    await this.listFiles()
  }

  /**
   * Retourne au dossier parent.
   */
  async goBack() {
    if (this.currentPath.length > 0) {
      this.currentPath.pop()
      // Remonte d'un niveau (simplifié : on reliste le dossier parent)
      // Note : L'API File System Access ne permet pas facilement de remonter,
      // donc on réinitialise à la racine pour l'instant.
      this.currentDirectory = await window.showDirectoryPicker()
      await this.listFiles()
    }
  }

  /**
   * Ouvre un fichier.
   * @param {FileSystemFileHandle} file - Le fichier à ouvrir.
   */
  async openFile(file) {
    try {
      const fileData = await file.getFile()
      const content = await this.readFile(fileData)

      // Affiche le contenu dans le viewer
      const viewer = document.getElementById('file-viewer')
      const viewerTitle = document.getElementById('viewer-title')
      const fileContent = document.getElementById('file-content')

      viewerTitle.textContent = file.name
      fileContent.textContent = content

      viewer.classList.remove('hidden')
    } catch (error) {
      console.error("Erreur lors de l'ouverture du fichier :", error)
      alert("Erreur lors de l'ouverture du fichier. / Error opening file.")
    }
  }

  /**
   * Lit le contenu d'un fichier.
   * @param {File} file - Le fichier à lire.
   * @returns {Promise<string>} - Contenu du fichier (texte).
   */
  async readFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.onerror = () => reject(reader.error)
      reader.readAsText(file)
    })
  }

  /**
   * Met à jour l'affichage du chemin actuel.
   */
  updatePathDisplay() {
    const path =
      this.currentPath.length > 0 ? `/${this.currentPath.join('/')}` : '/'
    this.currentPathElement.textContent = `Chemin actuel: ${path} / Current path: ${path}`
  }
}
