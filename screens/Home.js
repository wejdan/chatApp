import React, {
  useEffect,
  useLayoutEffect,
  useContext,
  useState,
  useCallback,
} from 'react';
import {
  View,
  ActivityIndicator,
  StyleSheet,
  Alert,
  Pressable,
} from 'react-native';
import {signOut} from 'firebase/auth';

import {useNavigation} from '@react-navigation/native';
import colors from '../theme/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import {auth, database} from '../firebase';
import md5 from 'md5';

import {
  collection,
  orderBy,
  query,
  onSnapshot,
  limit,
  getDocs,
  updateDoc,
  doc,
} from 'firebase/firestore';
import ChatListItem from '../components/ChatListItem';
import {dateFormatter} from '../utils/helper';

const Home = () => {
  const navigation = useNavigation();

  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(false);
  React.useEffect(
    () =>
      navigation.addListener('beforeRemove', e => {
        e.preventDefault();
      }),
    [navigation],
  );
  const updateLastSeen = useCallback(async () => {
    let docRef = doc(database, 'users', auth.currentUser.uid);

    await updateDoc(docRef, {
      lastSeen: new Date(),
      isOnline: false,
    });
    signOut(auth);
  }, []);
  const onLogOut = () => {
    Alert.alert('Log Out', 'Are you sure you want to logout?', [
      {text: "Don't leave", style: 'cancel', onPress: () => {}},
      {
        text: 'Logout',
        style: 'destructive',

        onPress: () => {
          updateLastSeen();
        },
      },
    ]);
  };
  const getChat = userId => {
    const list = [auth.currentUser.uid, userId];
    list.sort();
    const chatName = md5(list[0] + list[1]);
    return chatName;
  };
  const getLastMessage = async chatname => {
    let lastMessage;

    const collectionRef = collection(database, 'chat_' + chatname);
    const q = query(collectionRef, orderBy('createdAt', 'desc'), limit(1));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(doc => {
      // doc.data() is never undefined for  doc snapshots

      lastMessage = doc.data();
      lastMessage.createdAt = doc.data().createdAt.toDate();
    });
    if (lastMessage == undefined) {
      lastMessage = {text: '', createdAt: new Date(0)};
    }
    return lastMessage;
  };

  useEffect(() => {
    navigation.setOptions({
      title: `${auth.currentUser.email}`,
      headerRight: () => (
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Pressable
            onPress={() => {
              navigation.navigate('ProfileScreen');
            }}>
            <Ionicons
              name="ios-settings-sharp"
              size={24}
              color="royalblue"
              style={{marginLeft: 15}}
            />
          </Pressable>
          <SimpleLineIcons
            onPress={onLogOut}
            name="logout"
            size={24}
            //   color={colors.gray}
            style={{marginLeft: 15}}
          />
        </View>
      ),
    });
  }, [navigation]);

  useLayoutEffect(() => {
    setLoading(true);
    const collectionRef = collection(database, 'users');
    const q = query(collectionRef);
    const unsubscriber = onSnapshot(q, async snapshot => {
      let data = [];
      await Promise.all(
        snapshot.docs.map(async doc => {
          const userId = doc.data().uid;

          if (userId != auth.currentUser.uid) {
            const chatName = getChat(userId);
            const lastmessage = await getLastMessage(chatName);

            //   const d = doc.data().lastSeen.toDate();
            const formatteddatestr = dateFormatter(doc.data().lastSeen);
            data.push({
              id: doc.data().uid,
              displayName: doc.data().displayName,
              avatar: doc.data().avatar,
              isOnline: doc.data().isOnline,
              lastSeen: formatteddatestr,
              lastmessage,
            });
          }
        }),
      );
      data.sort(function (a, b) {
        return b.lastmessage.createdAt - a.lastmessage.createdAt;
      });
      setUsersList(data);
      setLoading(false);
    });
    return unsubscriber;
  }, [navigation]);

  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.cover}>
          <ActivityIndicator size="large" />
        </View>
      )}
      {usersList.map((userItem, i) => {
        if (userItem.uid == auth.currentUser.uid) {
          return;
        }
        return <ChatListItem user={userItem} key={i} />;
      })}
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: '#fff',
  },
  chatButton: {
    backgroundColor: colors.primary,
    height: 50,
    width: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.9,
    shadowRadius: 8,
    marginRight: 20,
    marginBottom: 50,
  },
  cover: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
