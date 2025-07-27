const API_BASE_URL = 'http://localhost:5000';

export class ApiService {
  static async checkHealth() {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      return await response.json();
    } catch (error) {
      console.error('Health check failed:', error);
      return { status: 'error', error: error.message };
    }
  }

  static async colorizeImage(imageUri, referenceUri = null) {
    try {
      const formData = new FormData();
      
      // Add main image
      const imageResponse = await fetch(imageUri);
      const imageBlob = await imageResponse.blob();
      formData.append('image', imageBlob, 'image.jpg');
      
      // Add reference image if provided
      if (referenceUri) {
        const referenceResponse = await fetch(referenceUri);
        const referenceBlob = await referenceResponse.blob();
        formData.append('reference', referenceBlob, 'reference.jpg');
      }
      
      const response = await fetch(`${API_BASE_URL}/colorize`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Colorize image failed:', error);
      throw error;
    }
  }

  static async colorizeBatch(imageUris, referenceUri = null) {
    try {
      const formData = new FormData();
      
      // Add all images
      for (let i = 0; i < imageUris.length; i++) {
        const imageResponse = await fetch(imageUris[i]);
        const imageBlob = await imageResponse.blob();
        formData.append('images', imageBlob, `image_${i}.jpg`);
      }
      
      // Add reference image if provided
      if (referenceUri) {
        const referenceResponse = await fetch(referenceUri);
        const referenceBlob = await referenceResponse.blob();
        formData.append('reference', referenceBlob, 'reference.jpg');
      }
      
      const response = await fetch(`${API_BASE_URL}/colorize_batch`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Batch colorize failed:', error);
      throw error;
    }
  }

  static async getAvailableModels() {
    try {
      const response = await fetch(`${API_BASE_URL}/models`);
      return await response.json();
    } catch (error) {
      console.error('Get models failed:', error);
      return { models: [] };
    }
  }

  static async downloadImage(filename) {
    try {
      const response = await fetch(`${API_BASE_URL}/download/${filename}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.blob();
    } catch (error) {
      console.error('Download image failed:', error);
      throw error;
    }
  }

  // Utility method to convert base64 to blob
  static base64ToBlob(base64, mimeType = 'image/png') {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  }

  // Utility method to save base64 image to device
  static async saveBase64Image(base64Data, filename) {
    try {
      const blob = this.base64ToBlob(base64Data);
      
      // For web platform, create download link
      if (typeof window !== 'undefined') {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        return true;
      }
      
      // For React Native, you would use FileSystem here
      // This is a placeholder for the actual implementation
      return false;
    } catch (error) {
      console.error('Save image failed:', error);
      return false;
    }
  }
}

