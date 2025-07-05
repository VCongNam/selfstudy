import { Document, Page, pdfjs } from 'react-pdf';
import { useState } from 'react';
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.mjs';

export default function PDFViewer({ fileUrl }) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setPageNumber(1);
  }

  return (
    <div className="flex flex-col items-center w-full h-full">
      <div className="bg-white rounded shadow p-2 w-full max-h-[80vh] overflow-auto">
        <Document
          file={fileUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={<div className="text-center text-gray-500">Đang tải PDF...</div>}
        >
          <Page pageNumber={pageNumber} width={400} />
        </Document>
      </div>
      {numPages && (
        <div className="flex items-center justify-center gap-2 mt-2">
          <button
            onClick={() => setPageNumber(p => Math.max(1, p - 1))}
            disabled={pageNumber <= 1}
            className="px-2 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Trang trước
          </button>
          <span>
            Trang {pageNumber} / {numPages}
          </span>
          <button
            onClick={() => setPageNumber(p => Math.min(numPages, p + 1))}
            disabled={pageNumber >= numPages}
            className="px-2 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Trang sau
          </button>
        </div>
      )}
    </div>
  );
} 