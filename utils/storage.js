import AsyncStorage from '@react-native-async-storage/async-storage';

export class StorageManager {
  static KEYS = {
    COLORIZED_IMAGES: 'colorizedImages',
    USER_PREFERENCES: 'userPreferences',
    PROCESSING_HISTORY: 'processingHistory',
    FAVORITES: 'favorites'
  };

  // Colorized Images Management
  static async saveColorizedImages(images) {
    try {
      await AsyncStorage.setItem(this.KEYS.COLORIZED_IMAGES, JSON.stringify(images));
      return true;
    } catch (error) {
      console.error('Error saving colorized images:', error);
      return false;
    }
  }

  static async getColorizedImages() {
    try {
      const data = await AsyncStorage.getItem(this.KEYS.COLORIZED_IMAGES);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting colorized images:', error);
      return [];
    }
  }

  static async addColorizedImage(image) {
    try {
      const existingImages = await this.getColorizedImages();
      const updatedImages = [image, ...existingImages];
      await this.saveColorizedImages(updatedImages);
      return true;
    } catch (error) {
      console.error('Error adding colorized image:', error);
      return false;
    }
  }

  static async removeColorizedImage(imageId) {
    try {
      const existingImages = await this.getColorizedImages();
      const filteredImages = existingImages.filter(img => img.id !== imageId);
      await this.saveColorizedImages(filteredImages);
      return true;
    } catch (error) {
      console.error('Error removing colorized image:', error);
      return false;
    }
  }

  // User Preferences Management
  static async saveUserPreferences(preferences) {
    try {
      await AsyncStorage.setItem(this.KEYS.USER_PREFERENCES, JSON.stringify(preferences));
      return true;
    } catch (error) {
      console.error('Error saving user preferences:', error);
      return false;
    }
  }

  static async getUserPreferences() {
    try {
      const data = await AsyncStorage.getItem(this.KEYS.USER_PREFERENCES);
      return data ? JSON.parse(data) : {
        coloringQuality: 'high',
        autoSave: true,
        notifications: true,
        theme: 'light'
      };
    } catch (error) {
      console.error('Error getting user preferences:', error);
      return {
        coloringQuality: 'high',
        autoSave: true,
        notifications: true,
        theme: 'light'
      };
    }
  }

  // Processing History Management
  static async addToProcessingHistory(entry) {
    try {
      const history = await this.getProcessingHistory();
      const newEntry = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        ...entry
      };
      const updatedHistory = [newEntry, ...history.slice(0, 49)]; // Keep last 50 entries
      await AsyncStorage.setItem(this.KEYS.PROCESSING_HISTORY, JSON.stringify(updatedHistory));
      return true;
    } catch (error) {
      console.error('Error adding to processing history:', error);
      return false;
    }
  }

  static async getProcessingHistory() {
    try {
      const data = await AsyncStorage.getItem(this.KEYS.PROCESSING_HISTORY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting processing history:', error);
      return [];
    }
  }

  static async clearProcessingHistory() {
    try {
      await AsyncStorage.removeItem(this.KEYS.PROCESSING_HISTORY);
      return true;
    } catch (error) {
      console.error('Error clearing processing history:', error);
      return false;
    }
  }

  // Favorites Management
  static async addToFavorites(imageId) {
    try {
      const favorites = await this.getFavorites();
      if (!favorites.includes(imageId)) {
        const updatedFavorites = [...favorites, imageId];
        await AsyncStorage.setItem(this.KEYS.FAVORITES, JSON.stringify(updatedFavorites));
      }
      return true;
    } catch (error) {
      console.error('Error adding to favorites:', error);
      return false;
    }
  }

  static async removeFromFavorites(imageId) {
    try {
      const favorites = await this.getFavorites();
      const updatedFavorites = favorites.filter(id => id !== imageId);
      await AsyncStorage.setItem(this.KEYS.FAVORITES, JSON.stringify(updatedFavorites));
      return true;
    } catch (error) {
      console.error('Error removing from favorites:', error);
      return false;
    }
  }

  static async getFavorites() {
    try {
      const data = await AsyncStorage.getItem(this.KEYS.FAVORITES);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting favorites:', error);
      return [];
    }
  }

  static async isFavorite(imageId) {
    try {
      const favorites = await this.getFavorites();
      return favorites.includes(imageId);
    } catch (error) {
      console.error('Error checking if favorite:', error);
      return false;
    }
  }

  // General Storage Operations
  static async clearAllData() {
    try {
      await AsyncStorage.multiRemove([
        this.KEYS.COLORIZED_IMAGES,
        this.KEYS.USER_PREFERENCES,
        this.KEYS.PROCESSING_HISTORY,
        this.KEYS.FAVORITES
      ]);
      return true;
    } catch (error) {
      console.error('Error clearing all data:', error);
      return false;
    }
  }

  static async getStorageInfo() {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const stores = await AsyncStorage.multiGet(keys);
      
      let totalSize = 0;
      const info = {};
      
      stores.forEach(([key, value]) => {
        const size = new Blob([value]).size;
        totalSize += size;
        info[key] = {
          size: size,
          itemCount: value ? JSON.parse(value).length || 1 : 0
        };
      });
      
      return {
        totalSize,
        stores: info,
        keyCount: keys.length
      };
    } catch (error) {
      console.error('Error getting storage info:', error);
      return null;
    }
  }
}

