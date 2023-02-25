import React, {useState, useEffect, useLayoutEffect, useCallback} from 'react';
import {GiftedChat} from 'react-native-gifted-chat';
import colors from '../theme/colors';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {TouchableOpacity, Text} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {View, Image, StyleSheet} from 'react-native';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const navigation = useNavigation();
  const onSignOut = () => {};
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

  const onSend = msgs => {
    setMessages([...messages, ...msgs]);
  };
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
        _id: 1,
        avatar: 'https://i.pravatar.cc/300',
      }}
    />
  );
};

export default Chat;
