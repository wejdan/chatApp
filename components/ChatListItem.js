import {Image, StyleSheet, Text, Pressable, View} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';

import moment from 'moment';
const ChatListItem = ({user}) => {
  const {displayName, avatar} = user;

  const navigation = useNavigation();
  // const [lastMessage, setLastMessage] = useState({text: '', createdAt: ''});
  // const getChat = useCallback(() => {
  //   const list = [auth.currentUser.uid, user.id];
  //   list.sort();
  //   const chatName = md5(list[0] + list[1]);
  //   return chatName;
  // }, [user.id]);

  // useLayoutEffect(() => {
  //   const chatname = 'chat_' + getChat();

  //   const collectionRef = collection(database, chatname);
  //   const q = query(collectionRef, orderBy('createdAt', 'desc'), limit(1));
  //   const unsubscriber = onSnapshot(q, snapshot => {
  //     const data = snapshot.docs.map(doc => {
  //       const d = doc.data().createdAt.toDate();
  //       const formatteddatestr = moment(d).format('LT');
  //       return {
  //         _id: doc.id,
  //         createdAt: formatteddatestr,
  //         text: doc.data().text,
  //         user: doc.data().user,
  //       };
  //     });
  //     if (data.length) {
  //       setLastMessage(data[0]);
  //     }
  //   });
  //   return unsubscriber;
  // }, []);
  return (
    <Pressable
      style={styles.container}
      onPress={() => {
        navigation.navigate('Chat', {
          contact: {
            id: user.id,
            displayName: user.displayName,
            avatar: user.avatar,
            isOnline: user.isOnline,
            lastSeen: user.lastSeen,
          },
        });
      }}>
      <Image source={{uri: avatar}} style={styles.img} />
      <View style={styles.content}>
        <View style={styles.stretch}>
          <Text style={styles.displayName}>{displayName}</Text>
          <Text style={styles.lastmessage}>{user.lastmessage.text}</Text>
        </View>
        <View style={styles.time}>
          <Text style={styles.timeText}>
            {user.lastmessage.text &&
              moment(user.lastmessage.createdAt).format('LT')}
          </Text>
          {/* <View
            style={{
              width: 20,
              height: 20,
              borderRadius: 10,
              backgroundColor: '#3478f5',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={{color: 'white', fontSize: 10}}>2</Text>
          </View> */}
        </View>
      </View>
    </Pressable>
  );
};

export default ChatListItem;

const styles = StyleSheet.create({
  container: {
    marginVertical: 5,
    flexDirection: 'row',
    alignItems: 'stretch',
    height: 70,
    paddingHorizontal: 20,
  },
  img: {
    width: 60,
    aspectRatio: 1,
    borderRadius: 30,
    marginRight: 10,
  },
  content: {
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    flex: 1,
    flexDirection: 'row',
    //   alignItems: 'center',
    paddingBottom: 10,
  },
  time: {
    justifyContent: 'flex-end',
  },
  timeText: {color: '#3478f5', fontSize: 12, marginBottom: 3},
  displayName: {fontWeight: 'bold', color: 'black', fontSize: 20},
  lastmessage: {color: '#8b8a8f'},
  stretch: {flex: 1},
});
