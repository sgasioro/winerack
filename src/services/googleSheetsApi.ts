const SPREADSHEET_ID = '1vsa1e17-Xq4MDJlWaFPG-cfkhgJL7oyyxVLRJfSppNo';
const SHEET_GID = '0'; // Get this from the sheet URL

export const fetchWines = async () => {
  const csvUrl = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/export?format=csv&gid=${SHEET_GID}`;
  
  try {
    const response = await fetch(csvUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch data from Google Sheets');
    }
    
    const csvText = await response.text();
    const rows = csvText.split('\n').slice(1); // Remove header row
    
    return rows
      .filter(row => row.trim()) // Remove empty rows
      .map((row, index) => {
        const columns = row.split(',').map(col => col.replace(/"/g, '').trim());
        return {
          id: index + 1,
          Location: columns[0] || '',
          Rating: columns[1] || '',
          Vintage: columns[2] || '',
          Winery: columns[3] || '',
          Grape: columns[4] || '',
          Style: columns[5] || '',
          Name: columns[6] || '',
          Region: columns[7] || '',
          Helper: columns[8] || '',
          Price: columns[9] || '',
          Consumed: columns[10] || '',
          Date_Consumed: columns[11] || '',
          Notes: columns[12] || '',
        };
      });
  } catch (error) {
    console.error('Error fetching wine data:', error);
    return [];
  }
};