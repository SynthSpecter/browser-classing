const express = require('express')
const fs = require('fs')
const path = require('path')
const app = express()
const PORT = 3000

// Middleware pour servir les fichiers statiques
app.use(express.static('.'))

// API pour lister les fichiers d'un dossier
app.get('/api/files', (req, res) => {
  const dirPath = req.query.path || process.cwd() // Par défaut : dossier courant du serveur
  try {
    const files = fs
      .readdirSync(dirPath)
      .map((file) => {
        const fullPath = path.join(dirPath, file)
        try {
          const stats = fs.statSync(fullPath)
          return {
            name: file,
            path: fullPath,
            isDirectory: stats.isDirectory(),
            size: stats.size,
            modified: stats.mtime.toISOString(),
          }
        } catch (error) {
          return {
            name: file,
            path: fullPath,
            isDirectory: false,
            error: 'Impossible de lire les infos',
          }
        }
      })
      .sort((a, b) => {
        // Les dossiers d'abord, puis les fichiers (tri alphabétique)
        if (a.isDirectory && !b.isDirectory) return -1
        if (!a.isDirectory && b.isDirectory) return 1
        return a.name.localeCompare(b.name)
      })

    res.json(files)
  } catch (error) {
    res
      .status(500)
      .json({ error: `Impossible de lister le dossier: ${error.message}` })
  }
})

// API pour lire un fichier texte
app.get('/api/file', (req, res) => {
  const filePath = req.query.path
  try {
    // Vérifie que le fichier est dans le dossier du projet (sécurité)
    if (!filePath.startsWith(process.cwd())) {
      return res.status(403).json({ error: 'Accès interdit' })
    }

    const content = fs.readFileSync(filePath, 'utf8')
    res.json({ content, name: path.basename(filePath) })
  } catch (error) {
    res
      .status(500)
      .json({ error: `Impossible de lire le fichier: ${error.message}` })
  }
})

// Démarre le serveur
app.listen(PORT, () => {
  console.log(`✅ Serveur démarré sur http://localhost:${PORT}`)
  console.log(`   Ouvrez cette URL dans votre navigateur.`)
})
