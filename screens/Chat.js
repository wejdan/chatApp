import React, {useState, useEffect, useLayoutEffect, useCallback} from 'react';

import {GiftedChat} from 'react-native-gifted-chat';
import colors from '../theme/colors';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {TouchableOpacity, Text} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {
  collection,
  addDoc,
  orderBy,
  query,
  onSnapshot,
} from 'firebase/firestore';
import {signOut} from 'firebase/auth';
import {auth, database} from '../firebase';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const navigation = useNavigation();
  const onSignOut = () => {
    signOut(auth).catch(error => console.log('Error logging out: ', error));
  };
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={{
            marginRight: 10,
          }}
          onPress={onSignOut}>
          <AntDesign
            name="logout"
            size={24}
            color={colors.gray}
            style={{marginRight: 10}}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);
  const onSend = useCallback(msgs => {
    console.log(msgs);
    setMessages(previousMessages => GiftedChat.append(previousMessages, msgs));
    const {_id, createdAt, text, user} = msgs[0];
    addDoc(collection(database, 'chats'), {
      _id,
      createdAt,
      text,
      user,
    });
  }, []);
  useLayoutEffect(() => {
    const collectionRef = collection(database, 'chats');
    const q = query(collectionRef, ref => ref.orderBy('createdAt', 'desc'));
    const unsubscriber = onSnapshot(q, snapshot => {
      console.log(snapshot.docs);
      const data = snapshot.docs.map(doc => {
        return {
          _id: doc.id,
          createdAt: doc.data().createdAt.toDate(),
          text: doc.data().text,
          user: doc.data().user,
        };
      });
      setMessages(data);
    });
    return unsubscriber;
  }, []);
  return (
    <GiftedChat
      messages={messages}
      showAvatarForEveryMessage={false}
      showUserAvatar={false}
      onSend={messages => onSend(messages)}
      messagesContainerStyle={{
        backgroundColor: '#fff',
      }}
      textInputStyle={{
        backgroundColor: '#fff',
        borderRadius: 20,
      }}
      user={{
        _id: auth?.currentUser?.email,
        avatar: 'https://i.pravatar.cc/300',
      }}
    />
  );
};

export default Chat;
