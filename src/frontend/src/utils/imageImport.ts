export async function validateImageFile(file: File): Promise<string> {
  const validTypes = ['image/png', 'image/jpeg', 'image/svg+xml'];

  if (!validTypes.includes(file.type)) {
    throw new Error('Invalid file type. Please upload PNG, JPG, or SVG.');
  }

  if (file.size > 5 * 1024 * 1024) {
    throw new Error('File too large. Maximum size is 5MB.');
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === 'string') {
        resolve(result);
      } else {
        reject(new Error('Failed to read file'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}
