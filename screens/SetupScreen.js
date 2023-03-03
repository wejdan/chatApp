import {
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  View,
  PermissionsAndroid,
  TouchableWithoutFeedback,
} from 'react-native';
import React, {useState, useCallback, useRef} from 'react';
import {AuthenticatedUserContext} from '../contexts/AuthenticatedUserContext';
import {auth, database, storge} from '../firebase';
import {updateProfile} from 'firebase/auth';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Avatar} from 'react-native-paper';
import {ref, uploadBytesResumable, getDownloadURL} from 'firebase/storage';
import * as mime from 'mime';
import {
  collection,
  addDoc,
  setDoc,
  doc,
  orderBy,
  query,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import {signOut} from 'firebase/auth';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import RNFS from 'react-native-fs';
import Animated from 'react-native-reanimated';
const SetupScreen = ({navigation}) => {
  const [loading, setLoading] = useState(false);
  const [img, setImg] = useState(null);
  const [displayName, setDisplayName] = useState('');

  const openPicker = async mehod => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'App Camera Permission',
          message: 'App needs access to your camera ',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Camera permission given');
        let options = {
          title: 'Select Image',
          customButtons: [
            {
              name: 'customOptionKey',
              title: 'Choose Photo from Custom Option',
            },
          ],
          storageOptions: {
            skipBackup: true,
            path: 'images',
          },
        };

        const response = await mehod(options);

        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        } else if (response.customButton) {
          console.log('User tapped custom button: ', response.customButton);
        } else {
          console.log(response);
          console.log('img', response.assets[0].uri);
          // You can also display the image using data:
          // const source = { uri: 'data:image/jpeg;base64,' + response.data };
          setImg(response.assets[0]);
        }
      } else {
        alert('Camera permission denied');
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };
  const takePhotoFromCamera = () => {
    openPicker(launchImageLibrary);
  };
  const choosePhotoFromLibrary = () => {
    openPicker(launchCamera);
  };

  const uploadeImg = async () => {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function () {
        reject(new TypeError('Network request failed'));
      };
      xhr.responseType = 'blob';
      xhr.open('GET', img.uri, true);
      xhr.send(null);
    });

    //  const mimeType = mime.getType(img); // => 'application/pdf'
    const metadata = {
      contentType: img.type,
    };
    const uploadName = auth.currentUser.uid;
    console.log('uploadName', uploadName);

    const reference = ref(storge, `/photos/${uploadName}`);

    const uploadTask = await uploadBytesResumable(reference, blob, metadata);
    const url = await getDownloadURL(uploadTask.ref);

    return url;
  };
  const addUser = useCallback(
    url => {
      const userObj = {
        uid: auth.currentUser.uid,
        displayName,
        avatar: url,
      };
      // setMessages([...messages, msgObj]);
      const docRef = doc(database, 'users', auth.currentUser.uid);
      setDoc(docRef, userObj, {merge: true});
      // collection(database, 'users').doc(auth.currentUser.uid).set(userObj);
    },
    [displayName],
  );
  const onSave = async () => {
    if (displayName !== '' && img != '') {
      setLoading(true);

      const url = await uploadeImg();
      console.log('url', url);
      await updateProfile(auth.currentUser, {
        displayName: displayName,
        photoURL: url,
      });
      addUser(url);
      navigation.navigate('Home');
    }
  };
  return (
    <View style={styles.container}>
      <Animated.View
        style={{
          flex: 1,
          //     opacity: Animated.add(0.1, Animated.multiply(fall, 1.0)),
        }}>
        <View style={styles.whiteSheet} />
        <SafeAreaView style={styles.form}>
          <Text style={styles.title}>Profile</Text>

          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => {
                takePhotoFromCamera();
              }}>
              {img != null ? (
                <Avatar.Image size={180} source={{uri: 'file://' + img.uri}} />
              ) : (
                <Avatar.Icon
                  size={180}
                  icon="account"
                  style={{backgroundColor: '#5e5fba'}}
                />
              )}
            </TouchableOpacity>

            {/* <Text style={styles.email}>{user}</Text> */}
          </View>
          <TextInput
            placeholder="Display Name"
            value={displayName}
            onChangeText={text => setDisplayName(text)}
            autoCapitalize="none"
            autoFocus={true}
            style={styles.input}
          />

          <TouchableOpacity style={styles.button} onPress={onSave}>
            <Text style={{fontWeight: 'bold', color: '#fff', fontSize: 18}}>
              Save
            </Text>
            {loading && (
              <View style={{marginLeft: 10}}>
                <ActivityIndicator color="white" />
              </View>
            )}
          </TouchableOpacity>
          <View
            style={{
              marginTop: 20,
              flexDirection: 'row',
              alignItems: 'center',
              alignSelf: 'center',
            }}></View>
        </SafeAreaView>
      </Animated.View>
    </View>
  );
};

export default SetupScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  backImg: {
    position: 'absolute',
    width: '100%',
    height: 340,
    top: 0,
    resizeMode: 'cover',
  },
  header: {
    alignItems: 'center',
    marginTop: 50,
    marginBottom: 10,
  },
  whiteSheet: {
    width: '100%',
    height: '75%',
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 60,
  },
  form: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 30,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'orange',
    alignSelf: 'center',
    paddingBottom: 24,
  },
  input: {
    backgroundColor: '#F6F7FB',
    height: 58,
    marginBottom: 20,
    fontSize: 16,
    borderRadius: 10,
    padding: 12,
  },
  button: {
    backgroundColor: '#f57c00',
    height: 58,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
    flexDirection: 'row',
  },
});
