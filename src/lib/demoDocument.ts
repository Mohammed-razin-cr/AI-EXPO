import type { DocumentRequest } from '../types';
export async function createDemoDocument(doc:DocumentRequest) {
 if (doc.status !== 'ready') throw new Error('This document is not ready yet.');
 const { jsPDF } = await import('jspdf');
 const pdf = new jsPDF();
 pdf.setTextColor(150,70,50); pdf.setFontSize(13);
 pdf.text('SAMPLE ONLY - NOT AN OFFICIAL CAMPUS DOCUMENT',20,22);
 pdf.setTextColor(30,55,40); pdf.setFontSize(21);
 const title = pdf.splitTextToSize(doc.title,170);
 pdf.text(title,20,42);
 let y = 42+title.length*9;
 pdf.setFontSize(11);
 for (const line of ['Reference: '+doc.refCode,'Student: '+doc.studentName,'Roll number: '+doc.rollNo,'Document type: '+doc.type,'Requested: '+doc.submittedAt,'Purpose: '+doc.purpose,'Demo status: '+doc.status]) {
   const lines=pdf.splitTextToSize(line,170);
   for(const part of lines) { if(y>260){pdf.addPage();y=25;}pdf.text(part,20,y);y+=7; } y+=4;
 }
 pdf.setFontSize(10);pdf.setTextColor(100);
 pdf.text(pdf.splitTextToSize('Generated from local demo records. This file does not certify enrollment, grades, identity, permission or eligibility. No registrar signature or institutional verification is attached.',170),20,Math.min(y+10,260));
 return pdf.output('blob');
}
