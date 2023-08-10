import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Platform,
  Keyboard,
} from 'react-native'
import { useState, useEffect } from 'react'
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  onSnapshot,
} from 'firebase/firestore'
import { Ionicons } from '@expo/vector-icons'
import moment from 'moment'
import { onAuthStateChanged } from 'firebase/auth'
import { db, auth } from '../../../firebase/config'
import { useAuth } from '../../../utilites/hooks/useAuth'

export default function CommentsScreen({ route }) {
	const [userPhoto, setUserPhoto] = useState(null)
  const [isKeyboardShown, setisKeyboardShown] = useState(false)
  const [image, setImage] = useState(null)
  const [allComments, setAllComments] = useState([])
  const [comment, setComment] = useState('')
	const { postId } = route.params
	const { userId } = useAuth();
  console.log('CommentsScreen')

  useEffect(() => {
    ;(async () => {
      if (!image) {
        const docRef = doc(db, 'posts', postId)
        const docSnap = await getDoc(docRef)
        setImage(docSnap.data().photoURL)
	  }
		
		onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserPhoto(user.photoURL)
      }
    })

      await onSnapshot(doc(db, 'posts', postId), (doc) => {
        if (doc.data().comments) {
          setAllComments(doc.data().comments)
        }
      })
    })()
  }, [])

  onCommentCreate = async () => {
    const docRef = doc(db, 'posts', postId)
    const date = moment().format('DD MMMM, YYYY | HH:mm')

    await updateDoc(docRef, {
      comments: arrayUnion({ comment, userId, date }),
    })
    setComment('')
  }

  const onKeyboardClose = () => {
    Keyboard.dismiss()
  }

  return (
    <TouchableWithoutFeedback onPress={onKeyboardClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.conrainer}
      >
        <View style={styles.postContiner}>
          {image && <Image style={styles.postPhoto} source={{ uri: image }} />}
        </View>
        {allComments.length > 0 && (
          <FlatList
            data={allComments}
            renderItem={({ item }) => (
              <View style={styles.commentContainer}>
                <View style={styles.currentUserComment}>
                  <Text style={styles.commentText}>{item.comment}</Text>
                  <Text style={styles.commentDate}>{item.date}</Text>
                </View>
                <View style={styles.currentUserPhotoContainer}>
                  <Image
                    style={styles.currentUserPhoto}
                    source={{ uri: userPhoto }}
                  />
                </View>
              </View>
            )}
          />
        )}
        <View
          style={[
            styles.inputContainer,
            { marginBottom: isKeyboardShown ? 110 : 16 },
          ]}
        >
          <TextInput
            multiline={true}
            numberOfLines={7}
            style={styles.input}
            value={comment}
            placeholder="Comment..."
            onChangeText={(e) => {
              setComment(e)
            }}
            onFocus={() => {
              setisKeyboardShown(true)
            }}
            onBlur={() => {
              setisKeyboardShown(false)
            }}
          />
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={onCommentCreate}
          >
            <Ionicons
              style={styles.icon}
              name="arrow-up-circle"
              size={34}
              color="#FF6C00"
            />
          </TouchableOpacity>
        </View>
        {/* </View> */}
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  conrainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 32,
    // paddingBottom: 16,
    backgroundColor: '#ffffff',
  },
  postContiner: {
    width: '100%',
    height: 240,
    backgroundColor: '#E8E8E8;',
    borderRadius: 8,
    marginBottom: 8,
  },
  postPhoto: {
    width: '100%',
    height: 240,
    borderRadius: 8,
  },
  commentContainer: { flexDirection: 'row', marginTop: 24, marginLeft: 'auto' },
  currentUserComment: {
    // width:"max-content",
    // flexDirection: "row",
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
    flex: 1,
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
  },
  commentText: {
    marginBottom: 8,
    fontFamily: 'Roboto-Regular',
    fontSize: 13,
    width: '100%',
    color: '#212121',
  },
  commentDate: {
    fontFamily: 'Roboto-Regular',
    fontSize: 10,
    color: '#BDBDBD',
  },
  currentUserPhotoContainer: {
    width: 28,
    height: 28,
    borderRadius: 28,
    marginLeft: 16,
    backgroundColor: '#E8E8E8',
  },
  currentUserPhoto: {
    width: '100%',
    height: '100%',
    borderRadius: 28,
  },
  inputContainer: {
    position: 'relative',
    marginTop: 'auto',
    width: '100%',
    height: 50,
    borderRadius: 100,
  },
  input: {
    borderWidth: 1,
    paddingVertical: 16,
    paddingLeft: 16,
    paddingRight: 44,
    borderColor: '#E8E8E8',
    borderRadius: 100,
    height: '100%',
    width: '100%',
  },
  iconContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
})
