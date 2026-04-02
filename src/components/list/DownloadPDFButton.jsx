import React from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import DownloadToDos from "./DownloadToDos.jsx";

const DownloadPDFButton = ({ groupedEntries }) => {
    return (
        <PDFDownloadLink
            document={<DownloadToDos groupedEntries={groupedEntries} />}
            fileName="weekly-todo-list.pdf"
        >
            {({ loading }) =>
                loading ? "Preparing PDF..." : "Download Weekly List"
            }
        </PDFDownloadLink>
    );
};

export default DownloadPDFButton;