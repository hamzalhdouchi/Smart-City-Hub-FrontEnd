/**
 * Exports an array of objects to a CSV file.
 * 
 * @param data Array of objects to export
 * @param filename Name of the file to download (without extension)
 * @param headersOptional Optional array of headers (keys) to include. If not provided, all keys from the first object are used.
 */
export const exportToCSV = <T extends Record<string, any>>(
    data: T[],
    filename: string,
    headersOptional?: (keyof T)[]
): void => {
    if (!data || data.length === 0) {
        console.warn('No data to export');
        return;
    }

    // Determine headers
    const headers = headersOptional || Object.keys(data[0]);

    // Create CSV content
    const csvContent = [
        // Header row
        headers.join(','),
        // Data rows
        ...data.map(row =>
            headers.map(header => {
                const value = row[header];
                // Handle different value types
                if (value === null || value === undefined) return '';
                if (typeof value === 'object') return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
                if (typeof value === 'string') return `"${value.replace(/"/g, '""')}"`;
                return value;
            }).join(',')
        )
    ].join('\n');

    // Create a Blob
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

    // Create a link and trigger download
    const link = document.createElement('a');
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `${filename}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};
