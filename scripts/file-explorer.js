/**
 * Classe FileExplorer
 * Gère la navigation dans les fichiers/dossiers via le backend.
 */
class FileExplorer {
  constructor() {
    this.currentPath = '/' // Chemin racine par défaut (sera mis à jour par le backend)
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

    // Charge le dossier racine au démarrage
    this.listFiles('.')
  }

  /**
   * Liste les fichiers/dossiers du répertoire actuel.
   * @param {string} path - Chemin du dossier à lister.
   */
  async listFiles(path) {
    try {
      const response = await fetch(
        `/api/files?path=${encodeURIComponent(path)}`,
      )
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`)
      }
      const files = await response.json()

      this.fileListElement.innerHTML = ''
      this.currentPath = path
      this.updatePathDisplay()

      files.forEach((file) => {
        const itemElement = document.createElement('div')
        itemElement.className = `file-item ${file.isDirectory ? 'directory' : 'file'}`
        itemElement.textContent = file.name

        if (file.isDirectory) {
          itemElement.addEventListener('click', () =>
            this.openDirectory(file.path),
          )
        } else {
          itemElement.addEventListener('click', () => this.openFile(file.path))
        }

        this.fileListElement.appendChild(itemElement)
      })
    } catch (error) {
      console.error('Erreur:', error)
      this.fileListElement.innerHTML = `
                <p style="color: var(--neon-pink);">
                    ❌ Erreur: Impossible de lister les fichiers. /
                    Error: Cannot list files.
                </p>
            `
    }
  }

  /**
   * Ouvre un dossier.
   * @param {string} path - Chemin du dossier.
   */
  openDirectory(path) {
    this.listFiles(path)
  }

  /**
   * Retourne au dossier parent.
   */
  goBack() {
    if (this.currentPath !== '.' && this.currentPath !== '/') {
      // Utilise path.dirname pour remonter d'un niveau (simulé côté client)
      const parentPath =
        this.currentPath.split('/').slice(0, -1).join('/') || '/'
      this.listFiles(parentPath)
    }
  }

  /**
   * Ouvre un fichier.
   * @param {string} filePath - Chemin du fichier.
   */
  async openFile(filePath) {
    try {
      const response = await fetch(
        `/api/file?path=${encodeURIComponent(filePath)}`,
      )
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`)
      }
      const data = await response.json()

      const viewer = document.getElementById('file-viewer')
      const viewerTitle = document.getElementById('viewer-title')
      const fileContent = document.getElementById('file-content')

      viewerTitle.textContent = data.name
      fileContent.textContent = data.content

      viewer.classList.remove('hidden')
    } catch (error) {
      console.error('Erreur:', error)
      alert(
        `Erreur: Impossible d'ouvrir le fichier. / Error: Cannot open file.`,
      )
    }
  }

  /**
   * Met à jour l'affichage du chemin actuel.
   */
  updatePathDisplay() {
    const displayPath = this.currentPath === '.' ? '/' : this.currentPath
    this.currentPathElement.textContent = `Chemin actuel: ${displayPath} / Current path: ${displayPath}`
  }
}
