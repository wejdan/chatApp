import {
  StyleSheet,
  ImageBackground,
  Text,
  View,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Image,
  ActivityIndicator,
} from 'react-native';
import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useLayoutEffect,
} from 'react';
import bg from '../assets/BG.png';
import Message from '../components/Message';
import {FlatList} from 'react-native';
import {ScrollView} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import ChatScreenHeader from '../components/ChatScreenHeader';
import InputBox from '../components/InputBox';
import uuid from 'react-native-uuid';
import md5 from 'md5';
import {
  collection,
  addDoc,
  orderBy,
  query,
  doc,
  updateDoc,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import {auth, database} from '../firebase';
const ChatScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {contact} = route.params;
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  console.log(contact);
  const getChat = () => {
    const list = [auth.currentUser.uid, contact.id];
    list.sort();
    const chatName = md5(list[0] + list[1]);
    return chatName;
  };

  useEffect(() => {
    navigation.setOptions({
      header: () => {
        return (
          <ChatScreenHeader
            name={contact.displayName}
            lastSeen={
              contact.isOnline ? 'Online' : `Last Seen at ${contact.lastSeen}`
            }
            profile={contact.avatar}
          />
        );
      },
    });
  }, [contact.displayName, contact.avatar, navigation]);
  const scrollViewRef = useRef();

  useLayoutEffect(() => {
    setLoading(true);
    const chatname = 'chat_' + getChat();

    const collectionRef = collection(database, chatname);
    const q = query(collectionRef, orderBy('createdAt'));
    const unsubscriber = onSnapshot(q, snapshot => {
      const data = snapshot.docs.map(doc => {
        return {
          _id: doc.id,
          createdAt: doc.data().createdAt.toDate(),
          text: doc.data().text,
          user: doc.data().user,
        };
      });
      setMessages(data);
      setLoading(false);
    });
    return unsubscriber;
  }, []);
  const updateUser = useCallback(text => {
    // setMessages([...messages, msgObj]);

    let docRef = doc(database, 'users', auth.currentUser.uid);

    updateDoc(docRef, {
      lastMessage: text,
    });
  }, []);
  const onSend = useCallback(msgs => {
    const chatname = 'chat_' + getChat();

    const msgObj = {
      _id: uuid.v4(),
      createdAt: new Date(),
      text: msgs,
      user: {
        _id: auth.currentUser.email,
        //   avatar: "'https://i.pravatar.cc/300'",
      },
    };
    // setMessages([...messages, msgObj]);
    addDoc(collection(database, chatname), msgObj);
    updateUser(msgs);
  }, []);
  return (
    <ImageBackground source={bg} style={styles.container}>
      {loading && (
        <View style={styles.cover}>
          <ActivityIndicator size="large" />
        </View>
      )}
      <ScrollView
        ref={scrollViewRef}
        onContentSizeChange={() => {
          scrollViewRef.current?.scrollToEnd();
        }}
        contentContainerStyle={styles.scroll}>
        {messages.map((msg, index) => {
          let previousId = index == 0 ? -1 : messages[index - 1].user._id;
          let nextId =
            index >= messages.length - 1 ? -1 : messages[index + 1].user._id;

          if (previousId != msg.user._id) {
            return (
              <View key={index}>
                <View style={styles.spacer} />
                <Message isEnd={msg.user._id != nextId} message={msg} />
              </View>
            );
          } else {
            return (
              <Message
                key={index}
                isEnd={msg.user._id != nextId}
                message={msg}
              />
            );
          }
        })}
      </ScrollView>
      {/* <FlatList
        data={messages}
        inverted
        style={{padding: 10}}
        ListFooterComponent={
          <View style={{height: 0, marginBottom: 50}}></View>
        }
        renderItem={item => <Message index={item.index} message={item.item} />}
      /> */}
      <InputBox onSend={onSend} />
    </ImageBackground>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  cover: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {flex: 1, justifyContent: 'flex-end'},
  scroll: {
    paddingBottom: 6,
    flexGrow: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  spacer: {marginVertical: 5},
});
