import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
} from 'react-native'
import { useState, useEffect } from 'react'
import { Feather } from '@expo/vector-icons'
import { useAuth } from '../../../utilites/hooks/useAuth'
import { collection, onSnapshot, query, where } from 'firebase/firestore'
import { db, auth } from '../../../firebase/config'
import { onAuthStateChanged } from 'firebase/auth'

export default function PostsScreen({ route, navigation }) {
  const [posts, setPosts] = useState([])
	const [userPhoto, setUserPhoto] = useState(null)
	const [userEmail, setUserEmail] = useState('')
  const [userName, setUserName] = useState('')
  const { userId: currentUserId } = useAuth()
  console.log('Posts screen')

  useEffect(() => {
    ;(async () => {
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

      onAuthStateChanged(auth, (user) => {
        if (user) {
          setUserPhoto(user.photoURL)
			setUserName(user.displayName)
			setUserEmail(user.email)
        }
      })
    })()
  }, [])

  return (
    <View style={styles.container}>
      <View style={styles.userDataContainer}>
        <View style={styles.userPhotoConteiner}>
          {userPhoto && <Image style={styles.userPhoto} src={userPhoto} />}
        </View>
        <View style={styles.userCredentialsContainer}>
          <Text style={styles.userNickname}>{userName}</Text>
          <Text style={styles.userEmail}>{userEmail}</Text>
        </View>
      </View>
      {posts && (
        <FlatList
          data={posts}
          renderItem={({ item }) => (
            <View style={styles.postContiner} key={item.id}>
              <Image style={styles.postPhoto} source={{ uri: item.photoURL }} />
              <Text style={{ marginBottom: 8 }}>{item.photoName}</Text>
              <View style={styles.commentAndLocationContainer}>
                <TouchableOpacity
                  style={{ flexDirection: 'row', alignItems: 'center' }}
                  onPress={() =>
                    navigation.navigate('Comments', {
                      postId: item.id,
                      photo: item.photoURL,
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
                  <Text style={{ marginRight: 49 }}>
                    {item.comments ? item.comments.length : 0}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ flexDirection: 'row', alignItems: 'center' }}
                  onPress={() => {
                    item.location &&
                      navigation.navigate('Map', { location: item.location })
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
          keyExtractor={(item) => item.id}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: '#ffffff',
  },
  userDataContainer: {
    marginVertical: 32,
    height: 60,
    flexDirection: 'row',
  },
  userPhoto: {
    borderRadius: 16,
    width: 60,
    height: 60,
  },
  userPhotoConteiner: {
    width: 60,
    borderRadius: 16,
    backgroundColor: '#F6F6F6',
  },
  userCredentialsContainer: {
    marginLeft: 8,
    justifyContent: 'center',
  },
  userNickname: {
    color: '#212121',
    fontFamily: 'Roboto-Medium',
    fontSize: 13,
  },
  userEmail: {
    color: 'rgba(33, 33, 33, 0.80)',
    fontFamily: 'Roboto-Regular',
    fontSize: 11,
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
