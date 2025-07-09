import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import ExcelJS from "exceljs";

export function exportExcel(header: any, body: any, filename: any) {
  const sheetData = [header, ...body]
  const worksheet = XLSX.utils.aoa_to_sheet(sheetData)
  
  // Auto-fit column widths
  const colWidths = header.map((h: string, i: number) => {
      const maxLength = Math.max(
          h.length,
          ...body.map((row: any[]) => String(row[i] || '').length)
      );
      return { wch: Math.min(Math.max(maxLength + 2, 10), 30) };
  });
  worksheet['!cols'] = colWidths;
  
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Data')
  const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
  })

  const res = new Blob([excelBuffer], {
      type: 'application/octet-stream',
  })
  saveAs(res, filename)
}

export function exportExcelWithWorksheet(worksheet: any, data: any, filename: any) {
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data')
    const excelBuffer = XLSX.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
    })

    const blob = new Blob([excelBuffer], {
        type: 'application/octet-stream',
    })
    saveAs(blob, filename)
}

export function exportExcelWithTitle(title: string, header: any[], body: any[], filename: string) {
  const sheetData = [
    [title],
    header,
    ...body,
  ]
  
  const worksheet = XLSX.utils.aoa_to_sheet(sheetData)

  // Merge judul
  worksheet['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: header.length - 1 } }
  ]

  // Set tinggi baris judul
  worksheet['!rows'] = [{ hpt: 30 }]
  const MAX_COL_WIDTH = 30;

  // Hitung lebar tiap kolom berdasarkan data (title + header + body)
  const colsWidth = []

  for (let colIdx = 0; colIdx < header.length; colIdx++) {
  if (colIdx === 0) {
    // Kolom No fixed kecil, misal 5 (cukup untuk nomor sampai 99999)
    colsWidth.push({ wch: 5 }) 
  } else {
    // Kolom lain disesuaikan otomatis
    const maxLength = sheetData.reduce((max, row) => {
      const cell = row[colIdx]
      if (cell == null) return max
      const length = cell.toString().length
      return length > max ? length : max
    }, 10)
    colsWidth.push({ wch: Math.min(maxLength + 2, MAX_COL_WIDTH) })
  }
}

  worksheet['!cols'] = colsWidth

  // Buat workbook dan simpan
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Data')

  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array', cellStyles: true })
  const blob = new Blob([excelBuffer], { type: 'application/octet-stream' })
  saveAs(blob, filename)
}

export async function exportExcelMandor(headers: string[], data: any[][], filename: string, titleRows: string[][] = [], unitKebun: string = "") {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Mandor Presensi");

  let currentRowIndex = 1;

  // Add title rows if provided
  if (titleRows.length > 0) {
    titleRows.forEach((titleRow, index) => {
      if (titleRow[0] && titleRow[0].trim() !== '') { // Skip empty rows
        const row = worksheet.addRow([titleRow[0]]);
        
        // Merge cells across all columns for title
        const lastColumn = String.fromCharCode(65 + 13); // Column N (14 columns total)
        worksheet.mergeCells(`A${currentRowIndex}:${lastColumn}${currentRowIndex}`);
        
        const cell = worksheet.getCell(`A${currentRowIndex}`);
        cell.value = titleRow[0];
        cell.font = { bold: true, size: 12 };
        cell.alignment = { vertical: "middle", horizontal: "center" };
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFFFFFFF" }, // White background
        };
        
        currentRowIndex++;
      } else {
        // Add empty row for spacing
        worksheet.addRow([]);
        currentRowIndex++;
      }
    });

    // Add one more empty row as separator
    worksheet.addRow([]);
    currentRowIndex++;
  }

  // Create multi-row header
  const header1 = ["Afd", "Mandor", "Luas (Ha)", "Jumlah Pohon Seluruh", "Jumlah Pohon Dideres", "HK", "", "", "HK", "", "", "HK", "", ""];
  const header2 = ["", "", "", "", "", "RKAP", "", "", "Realisasi", "", "", "Persentase (%)", "", ""];
  const header3 = ["", "", "", "", "", "Hi", "Sd Hi", "Sd Bi", "Hi", "Sd Hi", "Sd Bi", "Hi", "Sd Hi", "Sd Bi"];

  worksheet.addRow(header1);
  worksheet.addRow(header2);
  worksheet.addRow(header3);

  const headerStartRow = currentRowIndex;
  const headerEndRow = currentRowIndex + 2;

  // Merge cells for multi-row header
  worksheet.mergeCells(`A${headerStartRow}:A${headerEndRow}`);
  worksheet.mergeCells(`B${headerStartRow}:B${headerEndRow}`);
  worksheet.mergeCells(`C${headerStartRow}:C${headerEndRow}`);
  worksheet.mergeCells(`D${headerStartRow}:D${headerEndRow}`);
  worksheet.mergeCells(`E${headerStartRow}:E${headerEndRow}`);

  worksheet.mergeCells(`F${headerStartRow}:N${headerStartRow}`);

  worksheet.mergeCells(`F${headerStartRow + 1}:H${headerStartRow + 1}`);
  worksheet.mergeCells(`I${headerStartRow + 1}:K${headerStartRow + 1}`);
  worksheet.mergeCells(`L${headerStartRow + 1}:N${headerStartRow + 1}`);

  // Header styling
  [headerStartRow, headerStartRow + 1, headerStartRow + 2].forEach((i) => {
    const row = worksheet.getRow(i);
    row.eachCell((cell) => {
      cell.font = { bold: true };
      cell.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFCEE2F3" }, // Light blue
      };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });
  });

  // Set column width dengan lebar yang berbeda sesuai kebutuhan
  const columnWidths = [
    8,   // A - Afd
    15,  // B - Mandor
    10,  // C - Luas (Ha)
    12,  // D - Jumlah Pohon Seluruh
    12,  // E - Jumlah Pohon Dideres
    8,   // F - RKAP Hi
    8,   // G - RKAP Sd Hi
    8,   // H - RKAP Sd Bi
    8,   // I - Realisasi Hi
    8,   // J - Realisasi Sd Hi
    8,   // K - Realisasi Sd Bi
    8,   // L - Persentase Hi (%)
    8,   // M - Persentase Sd Hi (%)
    8    // N - Persentase Sd Bi (%)
  ];

  columnWidths.forEach((width, index) => {
    worksheet.getColumn(index + 1).width = width;
  });

  // Update row index after headers
  currentRowIndex = headerEndRow + 1;

  // Add data rows and subtotal per Afdeling
  let currentAfdeling = "";
  let afdelingBuffer: any[][] = [];
  let grandTotalData: number[] = Array(header1.length).fill(0); // Array untuk menyimpan grand total
  let grandTotalRkap = { hi: 0, sdHi: 0, sdBi: 0 }; // Untuk akumulasi RKAP
  let grandTotalRealisasi = { hi: 0, sdHi: 0, sdBi: 0 }; // Untuk akumulasi Realisasi

  const flushAfdelingSubtotal = () => {
    if (afdelingBuffer.length === 0) return;
  
    const sumRow = Array(header1.length).fill("");
    sumRow[0] = `Afdeling ${currentAfdeling}`;
  
    for (let col = 2; col < header1.length; col++) {
      let total = 0;
      let valid = true;
    
      // Untuk kolom Persentase (L=12, M=13, N=14 -> index 11,12,13)
      if (col >= 11 && col <= 13) {
        const idxOffset = col - 11; // 0:Hi, 1:Sd Hi, 2:Sd Bi
        const rkapCol = 5 + idxOffset; // 5:Hi, 6:Sd Hi, 7:Sd Bi
        const realisasiCol = 8 + idxOffset; // 8:Hi, 9:Sd Hi, 10:Sd Bi
    
        let totalRkap = 0;
        let totalRealisasi = 0;
    
        for (let row of afdelingBuffer) {
          const rkap = parseFloat(String(row[rkapCol]).replace(",", "."));
          const realisasi = parseFloat(String(row[realisasiCol]).replace(",", "."));
    
          if (!isNaN(rkap)) totalRkap += rkap;
          if (!isNaN(realisasi)) totalRealisasi += realisasi;
        }
    
        if (totalRkap > 0) {
          const persen = (totalRealisasi / totalRkap) * 100;
          sumRow[col] = parseFloat(persen.toFixed(1));
        } else {
          sumRow[col] = 0; // Jika RKAP nol
        }

        // Tambahkan ke grand total RKAP dan Realisasi berdasarkan jenis
        if (idxOffset === 0) { // Hi
          grandTotalRkap.hi += totalRkap;
          grandTotalRealisasi.hi += totalRealisasi;
        } else if (idxOffset === 1) { // Sd Hi
          grandTotalRkap.sdHi += totalRkap;
          grandTotalRealisasi.sdHi += totalRealisasi;
        } else if (idxOffset === 2) { // Sd Bi
          grandTotalRkap.sdBi += totalRkap;
          grandTotalRealisasi.sdBi += totalRealisasi;
        }
      } else {
        for (let row of afdelingBuffer) {
          const value = parseFloat(String(row[col]).replace(",", "."));
          if (!isNaN(value)) total += value;
          else valid = false;
        }
    
        if (valid) {
          sumRow[col] = parseFloat(total.toFixed(1));
          // Tambahkan ke grand total
          grandTotalData[col] += total;
        }
      }
    }
    
    const sumExcelRow = worksheet.addRow(sumRow);
    const rowNumber = sumExcelRow.number;
  
    // Merge kolom A dan B
    worksheet.mergeCells(`A${rowNumber}:B${rowNumber}`);
    const mergedCell = worksheet.getCell(`A${rowNumber}`);
    mergedCell.value = `Afdeling ${currentAfdeling}`;
    mergedCell.alignment = { vertical: "middle", horizontal: "center" };
    mergedCell.font = { bold: true };
    mergedCell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFCEE2F3" },
    };
    mergedCell.border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
  
    // Warnai dan beri border kolom lainnya (C dst)
    for (let i = 1; i <= header1.length; i++) {
      const cell = sumExcelRow.getCell(i);
      cell.font = { bold: true };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFCEE2F3" },
      };
      cell.alignment = { vertical: "middle", horizontal: "center" };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    }
  
    afdelingBuffer = [];
    currentRowIndex++;
  };

  data.forEach((row) => {
    const afdeling = row[0];
    if (afdeling !== currentAfdeling) {
      flushAfdelingSubtotal();
      currentAfdeling = afdeling;
    }

    const excelRow = worksheet.addRow(row);
    excelRow.alignment = { vertical: "middle", horizontal: "center" };
    excelRow.eachCell((cell) => {
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });

    afdelingBuffer.push(row);
    currentRowIndex++;
  });

  flushAfdelingSubtotal(); // flush last afdeling

  // Add Grand Total Row (Warna Kuning)
  const grandTotalRow = Array(header1.length).fill("");
  grandTotalRow[0] = `Unit ${unitKebun}`;

  // Hitung grand total untuk setiap kolom
  for (let col = 2; col < header1.length; col++) {
    // Untuk kolom Persentase (L=12, M=13, N=14 -> index 11,12,13)
    if (col >= 11 && col <= 13) {
      const idxOffset = col - 11; // 0:Hi, 1:Sd Hi, 2:Sd Bi
      
      let totalRkap = 0;
      let totalRealisasi = 0;
      
      if (idxOffset === 0) { // Hi
        totalRkap = grandTotalRkap.hi;
        totalRealisasi = grandTotalRealisasi.hi;
      } else if (idxOffset === 1) { // Sd Hi
        totalRkap = grandTotalRkap.sdHi;
        totalRealisasi = grandTotalRealisasi.sdHi;
      } else if (idxOffset === 2) { // Sd Bi
        totalRkap = grandTotalRkap.sdBi;
        totalRealisasi = grandTotalRealisasi.sdBi;
      }

      if (totalRkap > 0) {
        const persen = (totalRealisasi / totalRkap) * 100;
        grandTotalRow[col] = parseFloat(persen.toFixed(1));
      } else {
        grandTotalRow[col] = 0;
      }
    } else {
      grandTotalRow[col] = parseFloat(grandTotalData[col].toFixed(1));
    }
  }

  const grandTotalExcelRow = worksheet.addRow(grandTotalRow);
  const grandTotalRowNumber = grandTotalExcelRow.number;

  // Merge kolom A dan B untuk Grand Total
  worksheet.mergeCells(`A${grandTotalRowNumber}:B${grandTotalRowNumber}`);
  const grandTotalMergedCell = worksheet.getCell(`A${grandTotalRowNumber}`);
  grandTotalMergedCell.value = `Unit ${unitKebun}`;
  grandTotalMergedCell.alignment = { vertical: "middle", horizontal: "center" };
  grandTotalMergedCell.font = { bold: true };
  grandTotalMergedCell.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFFFF2CC" }, // Yellow background
  };
  grandTotalMergedCell.border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };

  // Style untuk kolom lainnya di Grand Total (warna kuning)
  for (let i = 1; i <= header1.length; i++) {
    const cell = grandTotalExcelRow.getCell(i);
    cell.font = { bold: true };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFFFF2CC" }, // Yellow background
    };
    cell.alignment = { vertical: "middle", horizontal: "center" };
    cell.border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
  }

  // Export file
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  saveAs(blob, filename);
}

