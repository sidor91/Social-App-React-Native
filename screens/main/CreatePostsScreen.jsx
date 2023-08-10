import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from 'react-native'
import { Camera } from 'expo-camera'
import { FontAwesome5 } from '@expo/vector-icons'
import { useState, useEffect, useRef } from 'react'
import * as Location from 'expo-location'
import { Feather } from '@expo/vector-icons'
import { storage, db } from '../../firebase/config'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { doc, setDoc, collection } from 'firebase/firestore'
import { useAuth } from '../../utilites/hooks/useAuth'

export default function CreatePostScreen({ navigation }) {
  const camera = useRef(null)
  const [photo, setPhoto] = useState(null)
  const [photoName, setPhotoName] = useState(null)
  const [permission, requestPermission] = Camera.useCameraPermissions()
  const [preview, setPreview] = useState(true)
  const [location, setLocation] = useState(null)
  const [locationError, setLocationError] = useState(null)
  const [cameraError, setCameraError] = useState(null)
  const [readyToPublish, setReadyToPublish] = useState(false)
  const { userId } = useAuth()
  console.log('Create post screen')
  
	const onKeyboardClose = () => {
    Keyboard.dismiss()
  }

  useEffect(() => {
    ;(async () => {
      try {
        const cameraPermission = await requestPermission()
        if (cameraPermission.status !== 'granted') {
          setCameraError('Permission to access camera was denied')
        }

        const locationPermission =
          await Location.requestForegroundPermissionsAsync()
        if (locationPermission.status !== 'granted') {
          setLocationError('Permission to access location was denied')
        }

        if (!location) {
          const { coords } = await Location.getCurrentPositionAsync({})
          const coordsObj = {
            latitude: coords.latitude,
            longitude: coords.longitude,
          }
          const reverseGeocodeLocation = await Location.reverseGeocodeAsync(
            coordsObj
          )
          const [{ city, country, street, streetNumber }] =
            reverseGeocodeLocation
          setLocation({ city, country, street, streetNumber, ...coordsObj })
        }
      } catch (error) {
        console.log(error.message)
      }
    })()
  }, [location])

  useEffect(() => {
    if (photo && location && photoName) setReadyToPublish(true)
  }, [photo, location, photoName])

  const takePhoto = async () => {
    try {
      if (preview) {
        const capture = await camera.current.takePictureAsync()
        setPhoto(capture.uri)
        camera.current.pausePreview()
        setPreview(false)
        return
      }
      camera.current.resumePreview()
      setPreview(true)
    } catch (error) {
      console.log(error.message)
    }
  }

  const uploadPhotoOnStorage = async () => {
	  const response = await fetch(photo)
    const file = await response.blob()
    const photoId = Date.now().toString()
    const storageRef = await ref(storage, `postImages/${photoId}`)
    const uploadedPhoto = await uploadBytes(storageRef, file)
    const photoURL = await getDownloadURL(ref(storage, `postImages/${photoId}`))
    return photoURL
  }

  const uploadPostOnServer = async () => {
    const photoURL = await uploadPhotoOnStorage()
    const docRef = doc(collection(db, 'posts'))

    const data = await setDoc(docRef, {
      photoURL,
      location,
      photoName,
      userId,
      likes: 0,
    })
  }

  const publishPhoto = async () => {
    await uploadPostOnServer()
    setLocation(null)
    setPhotoName(null)
    setPhoto(null)
    camera.current.resumePreview()
    setPreview(true)
    navigation.navigate('Home', {
      screen: 'Posts',
      params: { newPost: true },
    })
  }

  const goToThePostsPage = () => {
    navigation.navigate('Home', {
      screen: 'Posts',
    })
  }

  const handleDeletePress = () => {
    navigation.navigate('Home', {
      screen: 'Posts',
    })
    setLocation(null)
    setPhotoName(null)
    setPhoto(null)
    camera.current.resumePreview()
    setPreview(true)
  }

  return (
    <TouchableWithoutFeedback onPress={onKeyboardClose}>
      <View style={styles.container}>
        {!cameraError && (
          <>
            <Camera style={styles.camera} ref={camera}>
              {!preview && (
                <View styles={styles.photoContainer}>
                  <Image styles={styles.photo} source={{ uri: photo }} />
                </View>
              )}
              <TouchableOpacity
                style={[
                  styles.iconContainer,

                  !preview && styles.iconContainerWithOpacity,
                ]}
                onPress={takePhoto}
              >
                <FontAwesome5
                  name="camera"
                  size={24}
                  style={styles.icon}
                  color={!preview ? '#FFFFFF' : '#BDBDBD'}
                />
              </TouchableOpacity>
            </Camera>

            <Text style={{ ...styles.text, marginTop: 8 }}>Upload photo</Text>
            <TextInput
              style={[styles.text, styles.photoNameInput]}
              placeholder="Name a photo..."
              onChangeText={(value) => {
                setPhotoName(value)
              }}
              value={photoName}
            />
            <View style={styles.mapInputView}>
              <Feather
                style={styles.mapIcon}
                name="map-pin"
                size={24}
                color="#BDBDBD"
              />
              <TextInput
                style={[styles.text, styles.locationInput]}
                placeholder={
                  photo && !location ? 'Loading...Please wait' : 'Location'
                }
                editable={false}
                value={
                  photo && location && `${location.city}, ${location.country}`
                }
              />
            </View>
            <TouchableOpacity
              style={[styles.sendButton, { opacity: readyToPublish ? 1 : 0.7 }]}
              disabled={!readyToPublish}
              onPress={publishPhoto}
            >
              <Text
                style={
                  photo && !location
                    ? styles.buttonTextWhenLoading
                    : styles.sendButtonText
                }
              >
                Publish
              </Text>
              {photo && !location && (
                <ActivityIndicator animating={photo && !location} />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.trashIconContainer}
              onPress={handleDeletePress}
            >
              <Feather name="trash-2" size={24} color="#BDBDBD" />
            </TouchableOpacity>
          </>
        )}
        {cameraError && (
          <View style={{ marginTop: 32 }}>
            <Text>
              Permission to access camera was denied. Please go to the system
              settings, allow camera access and reload the app
            </Text>
            <TouchableOpacity
              style={styles.sendButton}
              onPress={goToThePostsPage}
            >
              <Text style={styles.sendButtonText}>To the Posts page</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
  },
  camera: {
    height: 240,
    width: '100%',
    marginTop: 32,
    backgroundColor: '#F6F6F6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderRadius: 8,
  },
  photoContainer: {
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 60,
    height: 60,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
  },
  iconContainerWithOpacity: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  photo: {
    height: '100%',
    width: '100%',
  },
  text: {
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
    color: '#BDBDBD',
  },
  photoNameInput: {
    marginTop: 32,
    borderBottomWidth: 1,
    borderColor: '#E8E8E8',
    height: 50,
    color: '#000',
  },
  locationInput: {
    color: '#000',
  },
  mapInputView: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: 16,
    position: 'relative',
    paddingLeft: 28,
    borderBottomWidth: 1,
    borderColor: '#E8E8E8',
    height: 50,
  },
  mapIcon: {
    position: 'absolute',
    top: 13,
    left: 0,
  },
  sendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF6C00',
    padding: 16,
    width: '100%',
    borderRadius: 100,
    marginTop: 32,
  },
  sendButtonText: {
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
    color: '#FFF',
  },
  buttonTextWhenLoading: {
    marginRight: 16,
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
    color: '#FFF',
  },
  trashIconContainer: {
    marginTop: 'auto',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: 22,
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
    height: 40,
    backgroundColor: '#F6F6F6',
    borderRadius: 20,
  },
})
