// Gestion des onglets
const tabs = document.querySelectorAll('.tab')
const webView = document.getElementById('web-view')
const fileExplorer = document.getElementById('file-explorer')

tabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    // Désactiver tous les onglets
    tabs.forEach((t) => t.classList.remove('active'))
    // Activer l'onglet cliqué
    tab.classList.add('active')

    // Masquer/Afficher les sections
    if (tab.dataset.url.startsWith('file://')) {
      webView.classList.add('hidden')
      fileExplorer.classList.remove('hidden')
    } else {
      webView.classList.remove('hidden')
      fileExplorer.classList.add('hidden')
      webView.src = tab.dataset.url
    }
  })
})

// Gestion de l'explorateur de fichiers
document.getElementById('open-folder').addEventListener('click', async () => {
  try {
    const dirHandle = await window.showDirectoryPicker()
    const filesList = document.getElementById('files-list')
    filesList.innerHTML = '' // Vider la liste

    for await (const entry of dirHandle.values()) {
      const fileItem = document.createElement('div')
      fileItem.className = 'file-item'
      fileItem.textContent = entry.name
      filesList.appendChild(fileItem)
    }
  } catch (err) {
    console.error("Erreur lors de l'ouverture du dossier :", err)
  }
})
