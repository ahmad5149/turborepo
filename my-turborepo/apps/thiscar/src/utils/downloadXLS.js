import * as XLSX from 'xlsx';

export const downloadXLS = (data, headers, filename) => {
    // Add headers to the data
    const dataWithHeaders = [headers,...data];

    // Convert data to worksheet
    const ws = XLSX.utils.aoa_to_sheet(dataWithHeaders);
    const boldStyle = { font: { bold: true } };

    // Create workbook and add the worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    // Generate XLS file and trigger download
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename + '.xlsx';
    a.click();
    URL.revokeObjectURL(url);
};

