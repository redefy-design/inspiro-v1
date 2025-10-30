import fs from 'fs';
import path from 'path';

const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg'];

export default function handler(req, res) {
  const { folder } = req.query;
  
  if (!folder) {
    return res.status(400).json({ error: 'Folder path required' });
  }
  
  try {
    if (!fs.existsSync(folder)) {
      return res.status(404).json({ error: 'Folder not found' });
    }
    
    const files = fs.readdirSync(folder);
    const images = files
      .filter(file => {
        const ext = path.extname(file).toLowerCase();
        return IMAGE_EXTENSIONS.includes(ext);
      })
      .map(file => ({
        name: file,
        path: path.join(folder, file)
      }));
    
    res.status(200).json(images);
  } catch (error) {
    console.error('Error reading images:', error);
    res.status(500).json({ error: 'Failed to read images' });
  }
}