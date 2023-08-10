import { useState } from 'react'
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  Image,
  Pressable,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ImageBackground,
  Keyboard,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import { useDispatch } from 'react-redux'
import { signupUser } from '../../redux/auth/authOperations'
import * as ImagePicker from 'expo-image-picker'
import { storage } from '../../firebase/config'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { useAuth } from '../../utilites/hooks/useAuth'
import { Formik } from 'formik'
import * as Yup from 'yup'

const initialCredentials = {
  login: '',
  email: '',
  password: '',
}

export default function RegistrationScreen() {
  const [photo, setPhoto] = useState(null)
  const [isPasswordSecured, setIsPasswordSecured] = useState(true)
  const [isKeyboardShown, setisKeyboardShown] = useState(false)
  const [isLoginActive, setIsLoginActive] = useState(false)
  const [isEmailActive, setIsEmailActive] = useState(false)
  const [isPasswordActive, setIsPasswordActive] = useState(false)
  const dispatch = useDispatch()
  const navigation = useNavigation()
  const { isLoading, isLoginFailed } = useAuth()
  console.log('Register Screen')

  const pickImage = async () => {
    if (!photo) {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      })

      if (!result.canceled) {
        setPhoto(result.assets[0].uri)
      }
    } else {
      setPhoto(null)
    }
  }

  const togglePasswordSecure = () => {
    setIsPasswordSecured(!isPasswordSecured)
  }

  const handleBlur = () => {
    setisKeyboardShown(false)
  }

  const onKeyboardClose = () => {
    Keyboard.dismiss()
  }

  const submitForm = async (values) => {
    if (photo) {
      const response = await fetch(photo)
      const file = await response.blob()
      const photoId = Date.now().toString()
      const storageRef = await ref(storage, `avatarImages/${photoId}`)
      await uploadBytes(storageRef, file)
      const photoURL = await getDownloadURL(
        ref(storage, `avatarImages/${photoId}`)
      )
      dispatch(signupUser({ ...values, photo: photoURL }))
      return
    } else {
      dispatch(signupUser({ ...values, photo }))
    }
  }

  let userSchema = Yup.object({
    login: Yup.string().required('Required'),
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string()
      .min(6, 'The password should be at least 6 symbols long')
      .required('Required'),
  })

  return (
    <TouchableWithoutFeedback onPress={onKeyboardClose}>
      <View style={styles.container}>
        <ImageBackground
          source={require('../../assets/wallpapers.png')}
          resizeMode="cover"
          style={styles.background}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.innerContainer}
          >
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
            <Text style={styles.formTitle}>Registration</Text>
            <Formik
              initialValues={initialCredentials}
              validationSchema={userSchema}
              onSubmit={submitForm}
            >
              {({
                values,
                errors,
                touched,
                handleSubmit,
                handleChange,
                setFieldTouched,
                isValid,
              }) => (
                <>
                  <View style={styles.form}>
                    <TextInput
                      style={[
                        styles.input,
                        isLoginActive && styles.inputActive,
                      ]}
                      selectionColor="#FF6C00"
                      onChangeText={handleChange('login')}
                      onFocus={() => {
                        setisKeyboardShown(true)
                        setIsLoginActive(true)
                        setFieldTouched('login', false)
                      }}
                      onBlur={(e) => {
                        setIsLoginActive(false)
                        handleBlur()
                        setFieldTouched('login')
                      }}
                      value={values.login}
                      placeholder="Login"
                    />
                    {errors.login && touched.login && (
                      <Text style={{ color: 'red' }}>{errors.login}</Text>
                    )}
                    <TextInput
                      style={[
                        styles.input,
                        isEmailActive && styles.inputActive,
                      ]}
                      autoCapitalize="none"
                      onChangeText={handleChange('email')}
                      onFocus={() => {
                        setisKeyboardShown(true)
                        setIsEmailActive(true)
                        setFieldTouched('email', false)
                      }}
                      onBlur={(e) => {
                        setIsEmailActive(false)
                        handleBlur()
                        setFieldTouched('email')
                      }}
                      value={values.email}
                      inputMode="email"
                      placeholder="Email"
                      selectionColor="#FF6C00"
                    />
                    {errors.email && touched.email && (
                      <Text style={{ color: 'red' }}>{errors.email}</Text>
                    )}
                    <View
                      style={[
                        styles.passwordContainer,
                        isPasswordActive && styles.passwordContainerActive,
                      ]}
                    >
                      <TextInput
                        style={[
                          styles.passwordInput,
                          isPasswordActive && styles.passwordContainerActive,
                        ]}
                        autoCapitalize="none"
                        onChangeText={handleChange('password')}
                        onFocus={() => {
                          setisKeyboardShown(true)
                          setIsPasswordActive(true)
                          setFieldTouched('password', false)
                        }}
                        onBlur={(e) => {
                          setIsPasswordActive(false)
                          handleBlur()
                          setFieldTouched('password')
                        }}
                        value={values.password}
                        placeholder="Password"
                        secureTextEntry={isPasswordSecured}
                        selectionColor="#FF6C00"
                      />
                      <Pressable>
                        <Text
                          style={styles.verifyButtonText}
                          onPress={togglePasswordSecure}
                          styles={styles.haveAccountText}
                        >
                          {isPasswordSecured ? 'Show' : 'Hide'}
                        </Text>
                      </Pressable>
                    </View>
                    {errors.password && touched.password && (
                      <Text style={{ color: 'red' }}>{errors.password}</Text>
                    )}
                  </View>

                  {isLoginFailed && (
                    <Text style={styles.errorText}>
                      Something went wrong, pease try again
                    </Text>
                  )}
                  <TouchableOpacity
                    style={[styles.button, { opacity: isValid ? 1 : 0.7 }]}
                    onPress={handleSubmit}
                    disabled={!isValid}
                  >
                    <Text
                      style={
                        isLoading
                          ? styles.buttonTextWhenLoading
                          : styles.buttonText
                      }
                    >
                      Sign up
                    </Text>
                    {isLoading && <ActivityIndicator animating={isLoading} />}
                  </TouchableOpacity>
                </>
              )}
            </Formik>
            <View
              style={{
                flexDirection: 'row',
                marginBottom: isKeyboardShown ? -1 : 78,
              }}
            >
              <Text style={styles.haveAccountText}>
                Already have an account?{' '}
              </Text>
              <Pressable onPress={() => navigation.navigate('Login')}>
                <Text
                  style={{
                    ...styles.haveAccountText,
                    textDecorationLine: 'underline',
                  }}
                >
                  Login
                </Text>
              </Pressable>
            </View>
          </KeyboardAvoidingView>
        </ImageBackground>
      </View>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  innerContainer: {
    marginTop: 'auto',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    alignItems: 'center',
    position: 'relative',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  photoContainer: {
    position: 'absolute',
    backgroundColor: '#F6F6F6',
    width: 120,
    height: 120,
    top: -60,
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
  formTitle: {
    marginTop: 92,
    marginBottom: 17,
    fontFamily: 'Roboto-Medium',
    fontSize: 30,
  },
  form: {
    marginBottom: 43,
    width: '100%',
  },
  input: {
    fontFamily: 'Roboto-Regular',
    color: '#000',
    height: 50,
    marginTop: 16,
    paddingHorizontal: 16,
    width: '100%',
    fontSize: 16,
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: 8,
    backgroundColor: '#F6F6F6',
    borderColor: '#E8E8E8',
  },
  inputActive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FF6C00',
  },
  passwordContainer: {
    height: 50,
    borderWidth: 1,
    paddingHorizontal: 16,
    marginTop: 16,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: 8,
    backgroundColor: '#F6F6F6',
    borderColor: '#E8E8E8',
  },
  passwordContainerActive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FF6C00',
  },
  passwordInput: {
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
    width: '85%',
    color: '#000',
  },
  verifyButtonText: {
    fontFamily: 'Roboto-Regular',
    color: '#1B4371',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF6C00',
    padding: 16,
    width: '100%',
    borderRadius: 100,
    marginBottom: 16,
  },
  buttonText: {
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
  haveAccountText: {
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
    color: '#1B4371',
  },
  removePhotoIcon: {
    color: '#BDBDBD',
    transform: [{ rotate: '-45deg' }],
  },
  errorText: {
    marginHorizontal: 'auto',
    marginBottom: 8,
    color: 'red',
  },
})
