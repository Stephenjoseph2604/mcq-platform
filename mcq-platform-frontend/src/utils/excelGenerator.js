import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export const generateQuizReportExcel = (quizReport) => {
  if (!quizReport?.quiz || !quizReport?.submissions) {
    throw new Error('Invalid quiz report data');
  }

  const { quiz, totalSubmissions, submissions } = quizReport;
  
  // Get all unique categories across all submissions
  const allCategories = Array.from(
    new Set(submissions.flatMap(s => s.categories.map(c => c.categoryName)))
  ).sort();

  // Create workbook
  const wb = XLSX.utils.book_new();
  
  // Create worksheet
  const wsData = [];
  
  // Header Row 1: Quiz Title
  wsData.push([
    { v: quiz.title, t: 's', s: headerTitleStyle },
    null, null, null, null, null, null
  ]);
  
  // Header Row 2: Total Submissions
  wsData.push([
    { v: `Total Submissions: ${totalSubmissions}`, t: 's', s: headerSubtitleStyle },
    null, null, null, null, null, null
  ]);
  
  // Empty row
  wsData.push([]);
  
  // Table Headers
  const headers = ['S.No', 'Student Name', 'Department', ...allCategories.map(cat => `${cat} (%)`), 'Total Questions', 'Total Score', 'Overall %'];
  wsData.push(headers.map(h => ({ v: h, t: 's', s: tableHeaderStyle })));
  
  // Table Rows
  submissions.forEach((submission, index) => {
    const row = [
      index + 1,
      submission.student.name,
      submission.student.department,
      ...allCategories.map(catName => {
        const cat = submission.categories.find(c => c.categoryName === catName);
        return cat ? cat.percentage?.toFixed(1) || 0 : 0;
      }),
      submission.categories.reduce((sum, cat) => sum + cat.totalQuestions, 0),
      submission.attempt.totalScore,
      submission.attempt.percentage?.toFixed(1) || 0
    ];
    wsData.push(row.map((cell, idx) => ({
      v: cell,
      t: typeof cell === 'number' ? 'n' : 's',
      s: idx < 3 ? tableDataStyle : tableNumberStyle
    })));
  });
  
  // Create worksheet
  const ws = XLSX.utils.aoa_to_sheet(wsData);
  
  // Auto-fit columns
  const colWidths = [
    { wch: 6 }, // S.No
    { wch: 20 }, // Student Name
    { wch: 18 }, // Department
    ...allCategories.map(() => ({ wch: 12 })), // Categories
    { wch: 14 }, // Total Questions
    { wch: 12 }, // Total Score
    { wch: 12 }  // Overall %
  ];
  ws['!cols'] = colWidths;
  
  // Add to workbook
  XLSX.utils.book_append_sheet(wb, ws, 'Quiz Report');
  
  // Generate filename
  const filename = `${quiz.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_report_${new Date().toISOString().split('T')[0]}.xlsx`;
  
  // Write and download
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([wbout], { type: 'application/octet-stream' });
  saveAs(blob, filename);
};

// Styles
const headerTitleStyle = {
  font: { name: 'Calibri', sz: 16, bold: true, color: { rgb: 'FFFFFF' } },
  fill: { fgColor: { rgb: '4472C4' } },
  alignment: { horizontal: 'center', vertical: 'center' }
};

const headerSubtitleStyle = {
  font: { name: 'Calibri', sz: 12, bold: true, color: { rgb: 'FFFFFF' } },
  fill: { fgColor: { rgb: '70AD47' } },
  alignment: { horizontal: 'center', vertical: 'center' }
};

const tableHeaderStyle = {
  font: { name: 'Calibri', sz: 11, bold: true, color: { rgb: 'FFFFFF' } },
  fill: { fgColor: { rgb: '5B9BD5' } },
  alignment: { horizontal: 'center', vertical: 'center' },
  border: { top: { style: 'thin', color: { rgb: '000000' } }, 
           bottom: { style: 'thin', color: { rgb: '000000' } },
           left: { style: 'thin', color: { rgb: '000000' } },
           right: { style: 'thin', color: { rgb: '000000' } } }
};

const tableDataStyle = {
  font: { name: 'Calibri', sz: 11 },
  alignment: { horizontal: 'left', vertical: 'center' },
  border: { top: { style: 'thin', color: { rgb: 'D9D9D9' } },
           bottom: { style: 'thin', color: { rgb: 'D9D9D9' } },
           left: { style: 'thin', color: { rgb: 'D9D9D9' } },
           right: { style: 'thin', color: { rgb: 'D9D9D9' } } }
};

const tableNumberStyle = {
  font: { name: 'Calibri', sz: 11, bold: true },
  fill: { fgColor: { rgb: 'F2F2F2' } },
  alignment: { horizontal: 'center', vertical: 'center' },
  border: { top: { style: 'thin', color: { rgb: 'D9D9D9' } },
           bottom: { style: 'thin', color: { rgb: 'D9D9D9' } },
           left: { style: 'thin', color: { rgb: 'D9D9D9' } },
           right: { style: 'thin', color: { rgb: 'D9D9D9' } } }
};
