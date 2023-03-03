import {StyleSheet, Text, TextInput, Pressable, View} from 'react-native';
import React, {useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {auth, database} from '../firebase';

const InputBox = ({onSend}) => {
  const [newMessage, setNewMessage] = useState('');

  return (
    <View style={styles.container}>
      <Ionicons name="md-add-outline" size={24} color="royalblue" />
      <TextInput
        onChangeText={setNewMessage}
        value={newMessage}
        style={styles.input}
      />
      <Pressable
        onPress={() => {
          onSend(newMessage);
          setNewMessage('');
        }}
        style={styles.send}>
        <Ionicons name="md-send" size={24} color="white" />
      </Pressable>
    </View>
  );
};

export default InputBox;

const styles = StyleSheet.create({
  container: {
    //  marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#f6f6f6',
    padding: 5,
    borderTopColor: '#d8d5d5',
    bordeToprWidth: StyleSheet.hairlineWidth,
  },
  input: {
    backgroundColor: 'white',
    flex: 1,
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginHorizontal: 10,
    borderColor: '#d8d5d5',
    borderWidth: StyleSheet.hairlineWidth,
  },
  send: {
    borderRadius: 25,
    padding: 7,
    backgroundColor: 'royalblue',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
