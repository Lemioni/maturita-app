import React, { useEffect, useRef, useState } from 'react';
import { renderAsync } from 'docx-preview';
import { FaTimes, FaDownload, FaExclamationCircle } from 'react-icons/fa';

const FilePreviewModal = ({ fileUrl, fileName, onClose }) => {
    const containerRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadFile = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await fetch(fileUrl);
                if (!response.ok) throw new Error('Failed to load file');

                const blob = await response.blob();

                if (containerRef.current) {
                    containerRef.current.innerHTML = ''; // Clear previous
                    await renderAsync(blob, containerRef.current, undefined, {
                        inWrapper: false,
                        ignoreWidth: false,
                        ignoreHeight: false,
                        ignoreFonts: false,
                        breakPages: true,
                        debug: false,
                        experimental: false,
                        className: 'docx-viewer',
                        useBase64URL: true
                    });
                }
            } catch (err) {
                console.error("Preview error:", err);
                setError("Nepodařilo se zobrazit náhled souboru. Zkuste jej stáhnout.");
            } finally {
                setLoading(false);
            }
        };

        if (fileUrl && fileUrl.endsWith('.docx')) {
            loadFile();
        } else {
            setLoading(false);
            setError("Náhled je dostupný pouze pro soubory .docx (Word). Ostatní soubory (.odt) je nutné stáhnout.");
        }
    }, [fileUrl]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-white text-gray-900 rounded-xl w-full max-w-5xl h-[90vh] flex flex-col shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gray-50">
                    <h3 className="font-semibold text-lg truncate pr-4" title={fileName}>
                        Náhled: {fileName}
                    </h3>
                    <div className="flex gap-2">
                        <a
                            href={fileUrl}
                            download
                            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Stáhnout"
                        >
                            <FaDownload className="w-5 h-5" />
                        </a>
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Zavřít"
                        >
                            <FaTimes className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-auto p-8 bg-gray-100 relative">
                    {loading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-100/80 z-10">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        </div>
                    )}

                    {error ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-500 gap-4">
                            <FaExclamationCircle className="w-12 h-12 text-red-500" />
                            <p className="text-lg font-medium">{error}</p>
                            <a
                                href={fileUrl}
                                download
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Stáhnout soubor
                            </a>
                        </div>
                    ) : (
                        <div
                            ref={containerRef}
                            className="bg-white shadow-lg min-h-full p-8 mx-auto docx-content max-w-[21cm]"
                            style={{ minHeight: '100%' }}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default FilePreviewModal;
