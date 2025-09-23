"use client"

import {
  BlobReader,
  BlobWriter,
  TextReader,
  TextWriter,
  ZipReader,
  ZipWriter,
} from "@zip.js/zip.js";

import { useRef } from "react";
import React, { useState } from 'react';
import { Button } from "./components/Button";

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
        // const uint8Array = new Uint8Array(arrayBuffer);

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

    //const totalFilesSizes = files.reduce((sum, f) => sum + f.size, 0);

    //let totalBytesWritten = 0;

    await Promise.all(
      files.map(async (file) => {

        const arrayBufferLike: ArrayBufferLike = file.byteArray;
        const uint8 = new Uint8Array(arrayBufferLike);

        const fileBlob = new Blob([uint8], { type: 'application/octet-stream' });

        zipWriter.add(file.name, new BlobReader(fileBlob));
      })
    )

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
    const zippedFile = createZIPThread();
    downloadFile(zippedFile);

  }

  return (
    <div className="grid flex justify-center m-50 gap-5">

      <p className="font-sans text-xl">Select the files to compress into the archive:</p>
      <p></p>
      <ListView />
      <input className="hidden" type="file" multiple onChange={handleFileChange} ref={fileUploader} />

      <Button onButtonClicked={onClearFilesButtonClicked} btnText="Clear Files" />
      <Button onButtonClicked={onBrowseButtonClicked} btnText="Browse File..." />
      <Button onButtonClicked={onMakeZIPButtonClicked} btnText="Make ZIP" />

    </div>
  );
}