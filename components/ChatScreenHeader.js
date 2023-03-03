import {StyleSheet, Text, Image, View} from 'react-native';
import React from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ChatScreenHeader = ({profile, name, lastSeen}) => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Ionicons
          name="chevron-back-sharp"
          size={24}
          color="royalblue"
          onPress={() => navigation.goBack()}
        />

        <Image
          source={{
            uri: profile,
          }}
          style={styles.img}
        />
        <View>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.subTitle}>{lastSeen}</Text>
        </View>
      </View>
      <View style={styles.row}>
        <Ionicons
          name="call-outline"
          size={24}
          color="royalblue"
          style={{marginRight: 15}}
        />
        <Ionicons name="videocam-outline" size={24} color="royalblue" />
      </View>
    </View>
  );
};

export default ChatScreenHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#f6f6f6',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 5,
    paddingHorizontal: 10,
  },
  img: {
    width: 50,
    height: 50,
    marginRight: 15,
    borderRadius: 40,
    marginLeft: 10,
  },
  row: {flexDirection: 'row', alignItems: 'center'},
  name: {fontWeight: 'bold', color: 'black', fontSize: 18},
  subTitle: {fontSize: 12},
});
