import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
  Dimensions,
  Platform
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ApiService } from './services/apiService';

const { width, height } = Dimensions.get('window');

export default function App() {
  const [selectedImages, setSelectedImages] = useState([]);
  const [colorizedImages, setColorizedImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentView, setCurrentView] = useState('select'); // 'select', 'colorize', 'result'
  const [apiStatus, setApiStatus] = useState('checking');

  useEffect(() => {
    loadSavedImages();
    checkApiHealth();
  }, []);

  const checkApiHealth = async () => {
    try {
      const health = await ApiService.checkHealth();
      setApiStatus(health.status === 'healthy' ? 'online' : 'offline');
    } catch (error) {
      setApiStatus('offline');
    }
  };

  const loadSavedImages = async () => {
    try {
      const saved = await AsyncStorage.getItem('colorizedImages');
      if (saved) {
        setColorizedImages(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading saved images:', error);
    }
  };

  const saveColorizedImages = async (images) => {
    try {
      await AsyncStorage.setItem('colorizedImages', JSON.stringify(images));
    } catch (error) {
      console.error('Error saving images:', error);
    }
  };

  const pickImages = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Sorry, we need camera roll permissions to make this work!');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 1,
      });

      if (!result.canceled && result.assets) {
        const newImages = result.assets.map(asset => ({
          id: Date.now() + Math.random(),
          uri: asset.uri,
          name: asset.fileName || `image_${Date.now()}.jpg`,
          type: 'image'
        }));
        setSelectedImages(prev => [...prev, ...newImages]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick images: ' + error.message);
    }
  };

  const pickDocuments = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/*', 'application/zip', 'application/x-zip-compressed'],
        multiple: true,
      });

      if (!result.canceled && result.assets) {
        const newFiles = result.assets.map(asset => ({
          id: Date.now() + Math.random(),
          uri: asset.uri,
          name: asset.name,
          type: asset.mimeType?.includes('zip') ? 'archive' : 'image'
        }));
        setSelectedImages(prev => [...prev, ...newFiles]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick documents: ' + error.message);
    }
  };

  const removeImage = (id) => {
    setSelectedImages(prev => prev.filter(img => img.id !== id));
  };

  const colorizeImages = async () => {
    if (selectedImages.length === 0) {
      Alert.alert('No Images', 'Please select some images first.');
      return;
    }

    if (apiStatus === 'offline') {
      Alert.alert('API Offline', 'The colorization service is currently offline. Please try again later.');
      return;
    }

    setIsLoading(true);
    setCurrentView('colorize');

    try {
      const imageUris = selectedImages.map(img => img.uri);
      
      if (imageUris.length === 1) {
        // Single image colorization
        const result = await ApiService.colorizeImage(imageUris[0]);
        
        if (result.success) {
          const colorized = [{
            ...selectedImages[0],
            colorizedUri: `data:image/png;base64,${result.colorized_image}`,
            timestamp: new Date().toISOString(),
            resultPath: result.result_path
          }];
          
          const updatedColorizedImages = [...colorizedImages, ...colorized];
          setColorizedImages(updatedColorizedImages);
          await saveColorizedImages(updatedColorizedImages);
        } else {
          throw new Error('Failed to colorize image');
        }
      } else {
        // Batch colorization
        const result = await ApiService.colorizeBatch(imageUris);
        
        if (result.success) {
          const colorized = result.results
            .filter(r => r.success)
            .map((r, index) => ({
              ...selectedImages[index],
              colorizedUri: `data:image/png;base64,${r.colorized_image}`,
              timestamp: new Date().toISOString(),
              resultPath: r.result_path
            }));
          
          const updatedColorizedImages = [...colorizedImages, ...colorized];
          setColorizedImages(updatedColorizedImages);
          await saveColorizedImages(updatedColorizedImages);
          
          if (result.processed_count < result.total_count) {
            Alert.alert(
              'Partial Success', 
              `${result.processed_count} out of ${result.total_count} images were successfully colorized.`
            );
          }
        } else {
          throw new Error('Failed to colorize images');
        }
      }
      
      setCurrentView('result');
      Alert.alert('Success', 'Images have been colorized!');
    } catch (error) {
      Alert.alert('Error', 'Failed to colorize images: ' + error.message);
      setCurrentView('select');
    } finally {
      setIsLoading(false);
    }
  };

  const clearAll = () => {
    setSelectedImages([]);
    setCurrentView('select');
  };

  const renderImageItem = (item, isColorized = false) => (
    <View key={item.id} style={styles.imageItem}>
      <Image 
        source={{ uri: isColorized ? item.colorizedUri : item.uri }} 
        style={styles.imagePreview}
        resizeMode="cover"
      />
      <Text style={styles.imageName} numberOfLines={1}>
        {item.name}
      </Text>
      {!isColorized && (
        <TouchableOpacity 
          style={styles.removeButton}
          onPress={() => removeImage(item.id)}
        >
          <Text style={styles.removeButtonText}>×</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderApiStatus = () => (
    <View style={[styles.statusBar, { backgroundColor: apiStatus === 'online' ? '#34C759' : '#FF3B30' }]}>
      <Text style={styles.statusText}>
        API Status: {apiStatus === 'online' ? '🟢 Online' : '🔴 Offline'}
      </Text>
      {apiStatus === 'checking' && <ActivityIndicator size="small" color="white" />}
    </View>
  );

  const renderSelectView = () => (
    <View style={styles.container}>
      {renderApiStatus()}
      <Text style={styles.title}>Manga Colorizer</Text>
      <Text style={styles.subtitle}>Select images or archives to colorize</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={pickImages}>
          <Text style={styles.buttonText}>📷 Pick Images</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button} onPress={pickDocuments}>
          <Text style={styles.buttonText}>📁 Pick Files (.cbz, .zip)</Text>
        </TouchableOpacity>
      </View>

      {selectedImages.length > 0 && (
        <View style={styles.selectedSection}>
          <Text style={styles.sectionTitle}>Selected Files ({selectedImages.length})</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageList}>
            {selectedImages.map(item => renderImageItem(item))}
          </ScrollView>
          
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={[styles.colorizeButton, { opacity: apiStatus === 'online' ? 1 : 0.5 }]} 
              onPress={colorizeImages}
              disabled={apiStatus !== 'online'}
            >
              <Text style={styles.colorizeButtonText}>🎨 Colorize Images</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.clearButton} onPress={clearAll}>
              <Text style={styles.clearButtonText}>Clear All</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {colorizedImages.length > 0 && (
        <View style={styles.historySection}>
          <Text style={styles.sectionTitle}>Recent Colorizations</Text>
          <TouchableOpacity 
            style={styles.viewHistoryButton}
            onPress={() => setCurrentView('result')}
          >
            <Text style={styles.viewHistoryButtonText}>View All ({colorizedImages.length})</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const renderColorizeView = () => (
    <View style={styles.container}>
      <Text style={styles.title}>Colorizing Images...</Text>
      <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />
      <Text style={styles.loadingText}>Processing {selectedImages.length} image(s)</Text>
      <Text style={styles.loadingSubtext}>Using Hugging Face AI Model</Text>
      <Text style={styles.loadingSubtext}>This may take a few moments</Text>
    </View>
  );

  const renderResultView = () => (
    <View style={styles.container}>
      <Text style={styles.title}>Colorized Images</Text>
      
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => setCurrentView('select')}
      >
        <Text style={styles.backButtonText}>← Back to Selection</Text>
      </TouchableOpacity>

      <ScrollView style={styles.resultList}>
        {colorizedImages.map(item => (
          <View key={item.id} style={styles.resultItem}>
            {renderImageItem(item, true)}
            <View style={styles.resultInfo}>
              <Text style={styles.timestamp}>
                {new Date(item.timestamp).toLocaleString()}
              </Text>
              <Text style={styles.resultPath}>
                Result: {item.resultPath}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );

  if (currentView === 'colorize') {
    return renderColorizeView();
  }

  if (currentView === 'result') {
    return renderResultView();
  }

  return renderSelectView();
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingHorizontal: 20,
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginBottom: 20,
  },
  statusText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginRight: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    flex: 0.45,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  selectedSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
  },
  imageList: {
    marginBottom: 20,
  },
  imageItem: {
    marginRight: 15,
    alignItems: 'center',
    position: 'relative',
  },
  imagePreview: {
    width: 80,
    height: 80,
    borderRadius: 10,
    backgroundColor: '#ddd',
  },
  imageName: {
    marginTop: 5,
    fontSize: 12,
    color: '#666',
    width: 80,
    textAlign: 'center',
  },
  removeButton: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#FF3B30',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  colorizeButton: {
    backgroundColor: '#34C759',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 10,
    flex: 0.7,
  },
  colorizeButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  clearButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    flex: 0.25,
  },
  clearButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
  },
  historySection: {
    marginTop: 20,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  viewHistoryButton: {
    backgroundColor: '#5856D6',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  viewHistoryButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  loader: {
    marginVertical: 50,
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#333',
    marginBottom: 10,
  },
  loadingSubtext: {
    textAlign: 'center',
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  backButton: {
    backgroundColor: '#8E8E93',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  backButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  resultList: {
    flex: 1,
  },
  resultItem: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  resultInfo: {
    marginLeft: 15,
    flex: 1,
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  resultPath: {
    fontSize: 10,
    color: '#999',
  },
});

