"use client"


import {
  BlobReader,
  BlobWriter,
  ZipWriter,
} from "@zip.js/zip.js";

import { useRef } from "react";
import React, { useState } from 'react';
import { Button } from "./components/Button";
import { ProgressBar } from './components/ProgressBar'

type FileItem =
  {
    name: string;
    size: number;

    byteArray: ArrayBuffer;
  }

const formatSize = (size: number) => {
  // Formatta in KB / MB ecc.
  if (size >= 1_000_000) return (size / 1_000_000).toFixed(2) + ' MB';
  if (size >= 1_000) return (size / 1_000).toFixed(1) + ' KB';
  return size + ' B';
};

export default function Home() {

  const [items, setItems] = useState<FileItem[]>([])
  const [elaboratedSize, setElaboratedSize] = useState(0);
  const [totalSize, setTotalSize] = useState(0);
  const [showProgress, setShowProgress] = useState(false);

  const ListView: React.FC = () => {
    const itemList = items.map((item, index) => (
      <tr>
        <td className="py-2">{item.name}</td>
        <td className="py-2"> {formatSize(item.size)}</td>
      </tr>
    ));
    return (
      <div className="mt-6 mb-6"> {/* <-- spazio sopra e sotto */}
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 border-separate border-spacing-y-2">
          <thead>
            <tr>
              <th style={{ textAlign: 'left', borderBottom: '1px solid #ccc' }}>File Name</th>
              <th style={{ textAlign: 'left', borderBottom: '1px solid #ccc' }}>File Size</th>
            </tr>
          </thead>
          <tbody>
            {itemList}
          </tbody>
        </table>
      </div>
    );
  }

  const fileUploader = useRef<HTMLInputElement>(null);


  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;

    if (!fileList || fileList.length == 0) {
      alert("Please select at least one file!");
      return;
    }

    const newItems = await Promise.all(
      Array.from(fileList).map(async (file) => {
        const arrayBuffer = await file.arrayBuffer()

        return {
          name: file.name,
          size: file.size,
          byteArray: arrayBuffer,
        };
      }
      ))

    setItems(prevItems => [...prevItems, ...newItems]);
  }

  async function createZIPThread() {
    const zipWriter = new ZipWriter(new BlobWriter("application/zip"));

    const files = items

    setTotalSize(items.reduce((pV, cV) => cV.size + pV, 0))

    for (const file of files) {
      const arrayBufferLike: ArrayBufferLike = file.byteArray;
      const uint8 = new Uint8Array(arrayBufferLike);
      const fileBlob = new Blob([uint8], { type: 'application/octet-stream' });

      await zipWriter.add(file.name, new BlobReader(fileBlob));
      setElaboratedSize((prev) => prev + file.size);
    }

    return zipWriter.close();
  }

  function onClearFilesButtonClicked() {
    setItems([]);
    alert("Files List Cleared");
  }

  function onBrowseButtonClicked() {
    fileUploader.current?.click();
  }


  function downloadFile(blob: any) {
    const a = document.createElement("a");
    a.download = "test.zip"
    a.href = URL.createObjectURL(blob)
    a.textContent = "Downloadfi"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }


  async function onMakeZIPButtonClicked() {
    const zipThread = createZIPThread();
    setShowProgress(true)
    const zippedFile = await zipThread
    setShowProgress(false)
    downloadFile(zippedFile);
    setItems([])
    setTotalSize(0)
    setElaboratedSize(0)
  }

  return (
    <div className="grid flex justify-center m-50 gap-5">

      <p className="font-sans text-xl">Select the files to compress into the archive:</p>
      <p></p>
      <ListView />
      <input className="hidden" type="file" multiple onChange={handleFileChange} ref={fileUploader} />

      <Button onButtonClicked={onClearFilesButtonClicked} btnText="Clear Files" />
      <Button onButtonClicked={onBrowseButtonClicked} btnText="Browse File..." />
      <Button onButtonClicked={onMakeZIPButtonClicked} btnText="Make ZIP" disabled={items.length === 0} />


      { showProgress && <ProgressBar progress={elaboratedSize / totalSize * 100} />}

    </div>
  );
}