"use client"

import { useRef } from "react";
import React, { useState } from 'react';

type FileItem =
  {
    name: string;
    size: number;
  }

const formatSize = (size: number) => {
  // Formatta in KB / MB ecc.
  if (size >= 1_000_000) return (size / 1_000_000).toFixed(2) + ' MB';
  if (size >= 1_000) return (size / 1_000).toFixed(1) + ' KB';
  return size + ' B';
};


export default function Home() {

  const [items, setItems] = useState<FileItem[]>([])
  // const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
  //   setSelectedValue(event.target.value);
  //   console.log('Hai selezionato:', event.target.value);
  // };

  {/** const FileListView: React.FC = () => {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          <th style={{ textAlign: 'left', borderBottom: '1px solid #ccc' }}>Nome file</th>
          <th style={{ textAlign: 'right', borderBottom: '1px solid #ccc' }}>Dimensione</th>
        </tr>
      </thead>
      <tbody>
        {fileList.map((file, index) => (
          <tr key={index}>
            <td style={{ padding: '8px 4px' }}>{file.name}</td>
            <td style={{ padding: '8px 4px', textAlign: 'right' }}>{formatSize(file.size)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
 */  }

  const ListView: React.FC = () => {
    const itemList = items.map((item, index) => (
      <tr>

        <td>{item.name}</td>
        <td> {formatSize(item.size)}</td>
      </tr>
    ));
    return (
      <div>
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <tr>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #ccc' }}>File Name</th>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #ccc' }}>File Size</th>
          </tr>
          {itemList}</table>
      </div>
    );
  }

  const fileUploader = useRef<HTMLInputElement>(null);


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setItems([...items, { name: file.name, size: file.size }])


    }

  }
  function onBrowseButtonClicked() {
    fileUploader.current?.click();
  }

  return (
    <div className="grid flex justify-center m-50 gap-10">

      <p className="font-sans text-xl">Selezionare i files da comprimere nell'archivio:</p>
      <p></p>
      <ListView />
      <input className="hidden" type="file" onChange={handleFileChange} ref={fileUploader} />
      <button className="font-sans text-lg font-bold border-2 border-double h-8 w-full bg-yellow-200 hover:bg-red-200"
        onClick={onBrowseButtonClicked}>Browse File...</button>



    </div>
  );
}