// pages/pdf.js
"use client";
import React, { useState } from 'react';
import Modal from 'react-modal';
import { PDFViewer } from '@react-pdf/renderer';
import PDFDocument from './PDFDocument';

// Set app element for react-modal

const PDFPage = ({purchaseAgreement}) => {
  const [isModalOpen, setIsModalOpen] = useState(true);

  const closeModal = () => setIsModalOpen(false);

  return (
    <Modal
      isOpen={isModalOpen}
      onRequestClose={closeModal}
      contentLabel="PDF Modal"
      style={{
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
        content: {
          width: '80%',
          height: '80%',
          margin: 'auto',
        },
      }}
    >
      <div style={{ width: '100%', height: '100%', display: "flex", zIndex: "1000" }}>
        <PDFViewer width="100%" height="100%">
          <PDFDocument purchaseAgreement={purchaseAgreement}/>
        </PDFViewer>
      </div>
    </Modal>
  );
};

export default PDFPage;
