import * as FileSystem from 'expo-file-system';
import { unzip } from 'react-native-zip-archive';

export class FileHandler {
  static async extractImagesFromArchive(archiveUri, archiveName) {
    try {
      // Create a temporary directory for extraction
      const tempDir = `${FileSystem.documentDirectory}temp_extract_${Date.now()}/`;
      await FileSystem.makeDirectoryAsync(tempDir, { intermediates: true });

      // Extract the archive
      await unzip(archiveUri, tempDir);

      // Find all image files in the extracted directory
      const extractedImages = await this.findImagesInDirectory(tempDir);
      
      return extractedImages.map(imagePath => ({
        id: Date.now() + Math.random(),
        uri: imagePath,
        name: imagePath.split('/').pop(),
        type: 'image',
        source: archiveName
      }));
    } catch (error) {
      console.error('Error extracting archive:', error);
      throw new Error(`Failed to extract ${archiveName}: ${error.message}`);
    }
  }

  static async findImagesInDirectory(directoryPath) {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
    const images = [];

    try {
      const items = await FileSystem.readDirectoryAsync(directoryPath);
      
      for (const item of items) {
        const itemPath = `${directoryPath}${item}`;
        const info = await FileSystem.getInfoAsync(itemPath);
        
        if (info.isDirectory) {
          // Recursively search subdirectories
          const subImages = await this.findImagesInDirectory(itemPath + '/');
          images.push(...subImages);
        } else {
          // Check if it's an image file
          const extension = item.toLowerCase().substring(item.lastIndexOf('.'));
          if (imageExtensions.includes(extension)) {
            images.push(itemPath);
          }
        }
      }
    } catch (error) {
      console.error('Error reading directory:', error);
    }

    return images;
  }

  static async copyFileToDocuments(sourceUri, fileName) {
    try {
      const destinationUri = `${FileSystem.documentDirectory}${fileName}`;
      await FileSystem.copyAsync({
        from: sourceUri,
        to: destinationUri
      });
      return destinationUri;
    } catch (error) {
      console.error('Error copying file:', error);
      throw error;
    }
  }

  static async cleanupTempFiles() {
    try {
      const documentDir = FileSystem.documentDirectory;
      const items = await FileSystem.readDirectoryAsync(documentDir);
      
      for (const item of items) {
        if (item.startsWith('temp_extract_')) {
          const tempPath = `${documentDir}${item}`;
          await FileSystem.deleteAsync(tempPath, { idempotent: true });
        }
      }
    } catch (error) {
      console.error('Error cleaning up temp files:', error);
    }
  }

  static getFileExtension(fileName) {
    return fileName.toLowerCase().substring(fileName.lastIndexOf('.'));
  }

  static isImageFile(fileName) {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
    const extension = this.getFileExtension(fileName);
    return imageExtensions.includes(extension);
  }

  static isArchiveFile(fileName) {
    const archiveExtensions = ['.zip', '.cbz', '.rar', '.cbr'];
    const extension = this.getFileExtension(fileName);
    return archiveExtensions.includes(extension);
  }

  static async getFileSize(uri) {
    try {
      const info = await FileSystem.getInfoAsync(uri);
      return info.size;
    } catch (error) {
      console.error('Error getting file size:', error);
      return 0;
    }
  }

  static formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

