import React from 'react';

const ErrorMessage = ({ message, onRetry }) => {
  return (
    <div className="text-center">
      <p className="text-red-600 mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700"
        >
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorMessage; 