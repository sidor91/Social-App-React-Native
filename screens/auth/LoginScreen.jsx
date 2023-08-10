import { useState } from 'react'
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  Pressable,
  TouchableOpacity,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  ImageBackground,
  ActivityIndicator,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useDispatch } from 'react-redux'
import { signInUser } from '../../redux/auth/authOperations'
import { useAuth } from '../../utilites/hooks/useAuth'
import { Formik } from 'formik'
import * as Yup from 'yup'

const initialCredentials = {
  email: '',
  password: '',
}

export default function LoginScreen() {
  const [isPasswordSecured, setIsPasswordSecured] = useState(true)
  const [isKeyboardShown, setisKeyboardShown] = useState(false)
  const [isEmailActive, setIsEmailActive] = useState(false)
  const [isPasswordActive, setIsPasswordActive] = useState(false)
  const { isLoading, isLoginFailed } = useAuth()
  const dispatch = useDispatch()
  console.log('Login Screen')

  const navigation = useNavigation()

  const togglePasswordSecure = () => {
    setIsPasswordSecured(!isPasswordSecured)
  }

  const handleBlur = () => {
    setisKeyboardShown(false)
  }

  const onKeyboardClose = () => {
    Keyboard.dismiss()
  }

  submitForm = (values) => {
    dispatch(signInUser({ email: values.email, password: values.password }))
  }

  let userSchema = Yup.object({
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
            behavior={Platform.OS === 'ios' && 'padding'}
            style={styles.innerContainer}
          >
            <Text style={styles.formTitle}>Login</Text>
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
                        isEmailActive && styles.inputActive,
                      ]}
                      onChangeText={handleChange('email')}
                      onFocus={() => {
                        setisKeyboardShown(true)
                        setIsEmailActive(true)
                        setFieldTouched('email', false)
                      }}
                      onBlur={() => {
                        setIsEmailActive(false)
                        handleBlur()
                        setFieldTouched('email')
                      }}
                      autoCapitalize="none"
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
                        onChangeText={handleChange('password')}
                        onFocus={() => {
                          setisKeyboardShown(true)
                          setIsPasswordActive(true)
                          setFieldTouched('password', false)
                        }}
                        onBlur={() => {
                          setIsPasswordActive(false)
                          handleBlur()
                          setFieldTouched('password')
                        }}
                        autoCapitalize="none"
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
                      Login
                    </Text>
                    {isLoading && <ActivityIndicator animating={isLoading} />}
                  </TouchableOpacity>
                </>
              )}
            </Formik>
            <View
              style={{
                flexDirection: 'row',
                marginBottom: isKeyboardShown ? -1 : 144,
              }}
            >
              <Text style={styles.haveAccountText}>
                Don't have an account?{' '}
              </Text>
              <Pressable onPress={() => navigation.navigate('Registration')}>
                <Text
                  style={{
                    ...styles.haveAccountText,
                    textDecorationLine: 'underline',
                  }}
                >
                  Register
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
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  form: {
    marginTop: 'auto',
    marginBottom: 43,
    width: '100%',
  },
  formTitle: {
    marginTop: 32,
    marginBottom: 17,
    fontFamily: 'Roboto-Medium',
    fontSize: 30,
  },
  input: {
    fontFamily: 'Roboto-Regular',
    color: '#000',
    height: 50,
    paddingHorizontal: 16,
    width: '100%',
    fontSize: 16,
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: 8,
    marginTop: 16,
    backgroundColor: '#F6F6F6',
    borderColor: '#E8E8E8',
  },
  inputActive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FF6C00',
  },
  passwordContainer: {
    marginTop: 16,
    height: 50,
    borderWidth: 1,
    paddingHorizontal: 16,
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
  errorText: {
    marginHorizontal: 'auto',
    marginBottom: 8,
    color: 'red',
  },
})
