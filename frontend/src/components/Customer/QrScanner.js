import React from 'react';
import { useNavigate } from 'react-router-dom';

const QrScanner = () => {
  const navigate = useNavigate();

  // For now, we'll just have a button to simulate QR scanning
  const handleScanComplete = () => {
    navigate('/menu');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Scan QR Code
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Please scan the QR code on your table to view the menu
          </p>
        </div>
        <div className="mt-8 space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="aspect-w-1 aspect-h-1 bg-gray-100 rounded-lg overflow-hidden">
              {/* QR Scanner will be implemented here */}
              <div className="flex items-center justify-center h-64 bg-gray-200">
                <p className="text-gray-500">Camera Preview</p>
              </div>
            </div>
            <button
              onClick={handleScanComplete}
              className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Simulate Scan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QrScanner;
