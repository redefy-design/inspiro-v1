import fs from 'fs';
import path from 'path';
import { FOLDERS } from '../../config/folders';

const MAX_DEPTH = 3;

function scanDirectory(dirPath, depth = 0) {
  if (depth >= MAX_DEPTH) return [];
  
  try {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    const folders = [];
    
    for (const entry of entries) {
      if (entry.isDirectory() && !entry.name.startsWith('.')) {
        const fullPath = path.join(dirPath, entry.name);
        folders.push({
          name: entry.name,
          path: fullPath,
          children: scanDirectory(fullPath, depth + 1)
        });
      }
    }
    
    return folders;
  } catch (error) {
    console.error(`Error scanning ${dirPath}:`, error);
    return [];
  }
}

export default function handler(req, res) {
  try {
    const folderStructure = FOLDERS.map(folder => ({
      name: folder.name,
      path: folder.path,
      children: scanDirectory(folder.path, 1)
    }));
    
    res.status(200).json(folderStructure);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read folders' });
  }
}