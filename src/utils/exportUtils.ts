
export const exportToCSV = <T extends Record<string, any>>(
    data: T[],
    filename: string,
    headersOptional?: (keyof T)[]
): void => {
    if (!data || data.length === 0) {
        console.warn('No data to export');
        return;
    }
    const headers = headersOptional || Object.keys(data[0]);
    const csvContent = [
        headers.join(','),
        ...data.map(row =>
            headers.map(header => {
                const value = row[header];
                if (value === null || value === undefined) return '';
                if (typeof value === 'object') return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
                if (typeof value === 'string') return `"${value.replace(/"/g, '""')}"`;
                return value;
            }).join(',')
        )
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
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
