import React, { useState } from 'react';
import './SavingFile.css';

const SavingFile = ({ isOpen, onClose, onDownload }) => {
  const [fileName, setFileName] = useState('');
  const [fileType, setFileType] = useState('txt');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onDownload(fileName, fileType);
    onClose(); // Close the modal after download
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2 className="modal-title">Save Translated Text</h2>
        <form onSubmit={handleSubmit} className="modal-form">
          <label className="modal-label">
            File Name:
            <input
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              required
              className="modal-input"
            />
          </label>
          <label className="modal-label">
            File Type:
            <select
              value={fileType}
              onChange={(e) => setFileType(e.target.value)}
              className="modal-select"
            >
              <option value="txt">Text (.txt)</option>
              <option value="pdf">PDF (.pdf)</option>
            </select>
          </label>
          <div className="modal-buttons">
            <button type="submit" className="modal-button">Download</button>
            <button type="button" onClick={onClose} className="modal-button cancel">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SavingFile;
