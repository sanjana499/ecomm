"use client";
import { useRef } from "react";
import { useParams } from "next/navigation";

export default function InvoiceViewerPage() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const params = useParams();
  const invoiceId = params.id; // this will match [id] from the route
  const pdfUrl = `/api/orders/invoice/${invoiceId}`;

  const handlePrint = () => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.focus();
      iframeRef.current.contentWindow.print();
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: 20 }}>
      <button
        onClick={handlePrint}
        style={{
          padding: "10px 20px",
          marginBottom: 10,
          background: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: 5,
          cursor: "pointer",
        }}
      >
        🖨️ Print Invoice
      </button>
      <a
        href={pdfUrl}
        download={`invoice_${invoiceId}.pdf`}
        style={{
          padding: "10px 20px",
          marginLeft: 10,
          background: "#2196F3",
          color: "white",
          borderRadius: 5,
          textDecoration: "none",
        }}
      >
        💾 Download PDF
      </a>
      <div style={{ marginTop: 20 }}>
        <iframe
          ref={iframeRef}
          src={pdfUrl}
          width="80%"
          height="600px"
          style={{ border: "1px solid #ccc" }}
        />
      </div>
    </div>
  );
}
