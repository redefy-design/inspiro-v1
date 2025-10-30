import { useState, useEffect } from 'react';

export default function Sidebar({ onFolderSelect, selectedFolder }) {
  const [folders, setFolders] = useState([]);
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    fetch('/api/folders')
      .then(res => res.json())
      .then(data => setFolders(data))
      .catch(err => console.error('Error loading folders:', err));
  }, []);

  const toggleExpand = (path) => {
    setExpanded(prev => ({ ...prev, [path]: !prev[path] }));
  };

  const FolderTree = ({ folder, depth = 0 }) => {
    const hasChildren = folder.children && folder.children.length > 0;
    const isExpanded = expanded[folder.path];
    const isSelected = selectedFolder === folder.path;

    return (
      <div style={{ marginLeft: depth * 16 }}>
        <div
          onClick={() => onFolderSelect(folder.path)}
          className={'cursor-pointer p-2 rounded transition-colors ' + (isSelected ? 'bg-blue-600 text-white font-semibold' : 'text-gray-300 hover:bg-gray-700')}
        >
          {hasChildren && (
            <span
              onClick={(e) => {
                e.stopPropagation();
                toggleExpand(folder.path);
              }}
              className="inline-block w-4 mr-1"
            >
              {isExpanded ? '▼' : '▶'}
            </span>
          )}
          📁 {folder.name}
        </div>
        {isExpanded && hasChildren && (
          <div>
            {folder.children.map((child, idx) => (
              <FolderTree key={idx} folder={child} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-64 h-screen bg-gray-900 border-r border-gray-700 overflow-y-auto">
      <div className="p-4 bg-gray-800 text-white font-bold border-b border-gray-700">
        Inspiro
      </div>
      <div className="p-2">
        {folders.map((folder, idx) => (
          <FolderTree key={idx} folder={folder} />
        ))}
      </div>
    </div>
  );
}