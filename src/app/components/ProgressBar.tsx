import React, { useState, useRef } from 'react';

// Qui ti riporto la progress bar base (puoi mettere in un file separato)
export const ProgressBar: React.FC<{ progress: number }> = ({ progress }) => (
  <div style={{ height: 20, width: '100%', backgroundColor: '#e0e0de', borderRadius: 50, overflow: 'hidden' }}>
    <div style={{
      height: '100%',
      width: `${progress}%`,
      backgroundColor: '#007bff',
      transition: 'width 0.3s ease-in-out',
      textAlign: 'right',
      color: 'white',
      paddingRight: 10,
      fontWeight: 'bold',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
    }}>
      {progress}%
    </div>
  </div>
);