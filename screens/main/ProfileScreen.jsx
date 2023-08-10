import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  TouchableOpacity,
  FlatList,
} from 'react-native'
import { Ionicons, Feather } from '@expo/vector-icons'
import { useState, useEffect } from 'react'
import * as ImagePicker from 'expo-image-picker'
import { useAuth } from '../../utilites/hooks/useAuth'
import {
  collection,
  updateDoc,
  query,
  where,
  getDoc,
  doc,
  onSnapshot,
} from 'firebase/firestore'
import { getAuth, updateProfile, onAuthStateChanged } from 'firebase/auth'
import { db, storage, auth } from '../../firebase/config'
import { useDispatch } from 'react-redux'
import { signOutUser } from '../../redux/auth/authOperations'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { uriToBlob } from '../../utilites/uriToBlob'

export default function ProfileScreen({ navigation }) {
  const [photo, setPhoto] = useState(null)
  const [name, setName] = useState('')
  const [posts, setPosts] = useState([])
  const dispatch = useDispatch()
  const { userId: currentUserId } = useAuth()
  console.log('Profile Screen')


  useEffect(() => {
    ;(async () => {
      await onAuthStateChanged(auth, (user) => {
        if (user) {
          setPhoto(user.photoURL)
          setName(user.displayName)
        }
      })

      const q = await query(
        collection(db, 'posts'),
        where('userId', '==', currentUserId)
      )
      await onSnapshot(q, (querySnapshot) => {
        const serverPostsArr = []
        querySnapshot.forEach((doc) => {
          serverPostsArr.push({ ...doc.data(), id: doc.id })
        })
        setPosts(serverPostsArr)
      })
    })()
  }, [])

  const pickImage = async () => {
    try {
      if (!photo) {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        })
        if (!result.canceled) {
          const blobFile = await uriToBlob(result.assets[0].uri)
          const newPhotoId = Date.now().toString()
          const storageRef = ref(storage, `avatarImages/${newPhotoId}`)
          await uploadBytes(storageRef, blobFile)
          const newPhotoURL = await getDownloadURL(
            ref(storage, `avatarImages/${newPhotoId}`)
          )
          await updateProfile(auth.currentUser, {
            photoURL: newPhotoURL,
          })
          setPhoto(newPhotoURL)
        }
      } else {
        await updateProfile(auth.currentUser, {
          photoURL: '',
        })
        setPhoto(null)
      }
    } catch (error) {
      console.log(error.message)
    }
  }

  const uploadPhoto = async (photo) => {
    const response = await fetch(photo)
    const file = await response.blob()
    const newPhotoId = Date.now().toString()
    const storageRef = ref(storage, `avatarImages/${newPhotoId}`)
    await uploadBytes(storageRef, file)
    const newPhotoURL = await getDownloadURL(
      ref(storage, `avatarImages/${newPhotoId}`)
    )
    await updateProfile(auth.currentUser, {
      photoURL: newPhotoURL,
    })
    return newPhotoURL
  }

  const onLikeClick = async (id) => {
    const docRef = doc(db, 'posts', id)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      await updateDoc(docRef, {
        likes: docSnap.data().likes + 1,
      })
    }
  }

  return (
    <ImageBackground
      source={require('../../assets/wallpapers.png')}
      resizeMode="cover"
      style={styles.background}
    >
      <View style={styles.innerContainer}>
        <View style={styles.photoContainer}>
          {photo && <Image style={styles.photo} source={{ uri: photo }} />}
          <TouchableOpacity style={styles.addPhotoBtn} onPress={pickImage}>
            <Ionicons
              name="add-circle-outline"
              size={25}
              style={photo ? styles.removePhotoIcon : styles.addPhotoIcon}
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.logOutBtn}
          onPress={() => {
            dispatch(signOutUser())
          }}
        >
          <Feather
            name="log-out"
            size={24}
            style={{ marginRight: 10, color: '#BDBDBD' }}
          />
        </TouchableOpacity>
        <Text style={styles.formTitle}>{name}</Text>
        {posts && (
          <FlatList
            data={posts}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.postContiner}>
                <Image
                  style={styles.postPhoto}
                  source={{ uri: item.photoURL }}
                />
                <Text style={{ marginBottom: 8 }}>{item.photoName}</Text>
                <View style={styles.commentAndLocationContainer}>
                  <TouchableOpacity
                    style={{ flexDirection: 'row', alignItems: 'center' }}
                    onPress={() =>
                      navigation.navigate('Home', {
                        screen: 'Comments',
                        params: { postId: item.id },
                      })
                    }
                  >
                    <Feather
                      style={
                        item.comments
                          ? styles.commentsAndLikesIconsActive
                          : styles.commentsAndLikesIcons
                      }
                      name="message-circle"
                      size={24}
                      color="#BDBDBD"
                    />
                    <Text style={{ marginRight: 24 }}>
                      {item.comments ? item.comments.length : 0}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{ flexDirection: 'row', alignItems: 'center' }}
                    onPress={() => {
                      onLikeClick(item.id)
                    }}
                  >
                    <Feather
                      style={
                        item.likes
                          ? styles.commentsAndLikesIconsActive
                          : styles.commentsAndLikesIcons
                      }
                      name="thumbs-up"
                      size={24}
                      color="#FF6C00"
                    />
                    <Text style={{ marginRight: 24 }}>{item.likes}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{ flexDirection: 'row', alignItems: 'center' }}
                    onPress={() => {
                      item.location &&
                        navigation.navigate('Home', {
                          screen: 'Map',
                          params: { location: item.location },
                        })
                    }}
                  >
                    <Feather
                      style={{ marginRight: 4 }}
                      name="map-pin"
                      size={24}
                      color="#BDBDBD"
                    />
                    <Text style={styles.locationText}>
                      {item.location?.city}, {item.location?.country}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        )}
      </View>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  // container: {
  // 	flex: 1,
  // },
  background: {
    flex: 1,
  },
  innerContainer: {
    position: 'relative',
    // marginTop: "auto",
    flex: 1,
    marginTop: 147,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    // alignItems: "center",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },

  photoContainer: {
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: -60,
    backgroundColor: '#F6F6F6',
    width: 120,
    height: 120,
    borderRadius: 16,
  },
  photo: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
  addPhotoBtn: {
    position: 'absolute',
    top: 81,
    left: 108.5,
  },
  addPhotoIcon: {
    color: '#FF6C00',
  },
  logOutBtn: {
    position: 'absolute',
    top: 22,
    right: 16,
  },
  removePhotoIcon: {
    color: '#BDBDBD',
    transform: [{ rotate: '-45deg' }],
  },
  formTitle: {
    marginTop: 32,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: 33,
    fontFamily: 'Roboto-Medium',
    fontSize: 30,
  },
  postContiner: {
    width: '100%',
    borderRadius: 8,
  },
  postPhoto: {
    width: '100%',
    height: 240,
    marginBottom: 8,
    borderRadius: 8,
  },
  commentAndLocationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 34,
  },
  locationText: {
    textDecorationLine: 'underline',
  },
  commentsAndLikesIcons: {
    marginRight: 6,
    color: '#BDBDBD',
  },
  commentsAndLikesIconsActive: {
    marginRight: 6,
    color: '#FF6C00',
  },
})
