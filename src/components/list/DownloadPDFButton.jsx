import React from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import DownloadToDos from "./DownloadToDos.jsx";

const DownloadPDFButton = ({ groupedEntries }) => {
    return (
        <PDFDownloadLink
            document={<DownloadToDos groupedEntries={groupedEntries || {}} listTitle="Weekly To-Do List" />}
            fileName="weekly-todo-list.pdf"
            className="inline-block rounded-lg bg-[#EBB537] px-3 py-2 font-bold text-white text-center"
        >
            {({ loading }) => (loading ? 'Preparing PDF...' : 'Download PDF')}
        </PDFDownloadLink>
    );
};

export default DownloadPDFButton;