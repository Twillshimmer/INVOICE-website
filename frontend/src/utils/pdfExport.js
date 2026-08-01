import html2canvas from "html2canvas";
import jsPDF from "jspdf";

// Renders the given DOM node into a crisp, single/multi-page A4 PDF and
// triggers a download. Uses a high scale factor so the logo and text stay
// sharp even when the invoice is zoomed in on paper.
export async function downloadInvoicePDF(node, filename = "invoice.pdf") {
  if (!node) throw new Error("No invoice element found to export.");

  const canvas = await html2canvas(node, {
    scale: 2.5,
    useCORS: true,
    backgroundColor: "#ffffff",
    logging: false,
    windowWidth: node.scrollWidth,
    windowHeight: node.scrollHeight,
  });

  const imgData = canvas.toDataURL("image/png", 1.0);

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "pt",
    format: "a4",
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  const imgWidth = pageWidth;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  let heightLeft = imgHeight;
  let position = 0;

  pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight, "", "FAST");
  heightLeft -= pageHeight;

  // Add extra pages if the invoice content overflows a single A4 page
  while (heightLeft > 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight, "", "FAST");
    heightLeft -= pageHeight;
  }

  pdf.save(filename);
}
