import { Parser } from 'json2csv';

export const exportTransactionsToCSV = (transactions) => {
  try {
    const fields = [
      { label: 'Type', value: 'type' },
      { label: 'Category', value: 'category' },
      { label: 'Amount', value: 'amount' },
      { label: 'Description', value: 'description' },
      { label: 'Date', value: (row) => new Date(row.date).toLocaleDateString() },
    ];
    
    const parser = new Parser({ fields });
    const csv = parser.parse(transactions);
    
    // Create blob and download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `transactions_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Error exporting CSV:', error);
    throw error;
  }
};

export const exportReportToCSV = (reportData) => {
  try {
    const data = [
      { Metric: 'Total Income', Value: reportData.totalIncome },
      { Metric: 'Total Expenses', Value: reportData.totalExpenses },
      { Metric: 'Balance', Value: reportData.balance },
      { Metric: 'Transaction Count', Value: reportData.transactionCount },
    ];
    
    const parser = new Parser({ fields: ['Metric', 'Value'] });
    const csv = parser.parse(data);
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `monthly_report_${reportData.year}_${reportData.month}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Error exporting report CSV:', error);
    throw error;
  }
};
