import React, { useState } from 'react';
import './Translate.css';
import SavingFile from './SavingFile';
import { jsPDF } from "jspdf";
import './LICENSE-normal';


const addFontToJsPDF = () => {
  jsPDF.API.events.push(["addFonts", function () {
    this.addFileToVFS('Roboto-Black-normal.ttf', fontBase64);
    this.addFont('Roboto-Black-normal.ttf', 'Roboto-Black', 'normal');
  }]);
};

const TranslateForm = () => {
  const [originalText, setOriginalText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [sourceLanguage] = useState('en'); // Setează limba sursă automat la 'en'
  const [targetLanguage, setTargetLanguage] = useState('ro');

  const languages = {
    ro: 'Romanian',
    fr: 'French',
    de: 'German',
    es: 'Spanish',
    it: 'Italian',
    bu: 'Bulgarian',
    et: 'Estonian',
    ru: 'Russian',
    zh: 'Chinese',
    ja: 'Japanese',
    ko: 'Korean',
    ar: 'Arabic',
    he: 'Hebrew',
    hi: 'Hindi',
    tr: 'Turkish',
    sv: 'Swedish',
    pl: 'Polish',
    nl: 'Dutch',
    pt: 'Portuguese',
    fi: 'Finnish',
    no: 'Norwegian',
    da: 'Danish'
  };

  const saveHistory = (original, translated) => {
    const history = JSON.parse(localStorage.getItem('translationHistory') || '[]');
    history.push({
      original,
      translated,
      sourceLanguage,
      targetLanguage,
      date: new Date().toISOString()
    });
    localStorage.setItem('translationHistory', JSON.stringify(history));
  };

  const handleTranslate = async () => {
    setError('');
    try {
      const response = await fetch('http://localhost:3000/translateform', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: originalText, source: sourceLanguage, target: targetLanguage })
      });
      const data = await response.json();
      if (response.ok) {
        setTranslatedText(data.translatedText);
        saveHistory(originalText, data.translatedText);
        saveLanguageData(sourceLanguage, targetLanguage);
      } else {
        throw new Error(data.error || 'Failed to translate');
      }
    } catch (error) {
      console.error('Translation error:', error);
      setError('Failed to translate. Please try again.');
    }
  };

  const saveLanguageData = (source, target) => {
    const stats = JSON.parse(localStorage.getItem('languageStats') || '{}');
    if (source !== 'en') {
      if (stats[source]) {
        stats[source] += 1;
      } else {
        stats[source] = 1;
      }
    }
    if (target !== 'en') {
      if (stats[target]) {
        stats[target] += 1;
      } else {
        stats[target] = 1;
      }
    }
    localStorage.setItem('languageStats', JSON.stringify(stats));
  };

  const handleDownload = (fileName, fileType) => {
    const doc = new jsPDF();
    doc.setFont('Roboto-Black', 'normal');

    if (fileType === 'pdf') {
      const lines = doc.splitTextToSize(translatedText, 180); // 180 is the max width of text lines
      let cursorY = 10; // Initial vertical cursor position
      lines.forEach(line => {
        if (cursorY + 10 > doc.internal.pageSize.getHeight() - 10) { // Check if the cursor is near the page bottom
          doc.addPage(); // Add a new page
          cursorY = 10; // Reset the cursor position
        }
        doc.text(line, 10, cursorY); // Draw the text line at the current cursor position
        cursorY += 10; // Move the cursor down
      });
      doc.save(`${fileName}.pdf`);
    } else {
      const blob = new Blob([translatedText], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${fileName}.txt`;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      try {
        const response = await fetch('http://localhost:3000/upload', {
          method: 'POST',
          body: formData
        });
        const data = await response.json();
        if (response.ok) {
          setOriginalText(data.text);
        } else {
          throw new Error(data.error || 'Failed to process file');
        }
      } catch (error) {
        console.error('Upload error:', error);
        setError('Failed to upload. Please try again.');
      }
    } else {
      setError("No file selected or unsupported file type.");
    }
  };

  const handleSaveAs = () => {
    setShowModal(true);
  };

  return (
    <div className="translate-form">
      <div className="language-select">
        <select className="dropdown" value={sourceLanguage} disabled>
          <option value="en">English</option>
        </select>
        <span>→</span>
        <select className="dropdown" value={targetLanguage} onChange={(e) => setTargetLanguage(e.target.value)}>
          {Object.entries(languages).map(([code, name]) => (
            <option key={code} value={code}>{name}</option>
          ))}
        </select>
        <label className="icon-upload">
          📁<input type="file" style={{ display: 'none' }} accept=".txt, .jpg, .png, application/pdf, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" onChange={handleFileUpload} />
        </label>
      </div>
      <textarea
        className="text-area"
        placeholder="Enter text to translate or upload a file"
        value={originalText}
        onChange={(e) => setOriginalText(e.target.value)}
      />
      {error && <p className="error-message">{error}</p>}
      <button className="flip-button" onClick={handleTranslate}>Translate</button>
      {translatedText && (
        <>
          <textarea
            className="text-area"
            value={translatedText}
            readOnly
          />
          <button className="flip-button" onClick={handleSaveAs}>Save as...</button>
        </>
      )}
      <SavingFile isOpen={showModal} onClose={() => setShowModal(false)} onDownload={handleDownload} />
    </div>
  );
};

export default TranslateForm;
