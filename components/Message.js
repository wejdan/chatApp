import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Svg, Path} from 'react-native-svg';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import {auth, database} from '../firebase';

dayjs.extend(relativeTime);
const d =
  'M6.18.24A1.85,1.85,0,0,1,6.7,1,45.42,45.42,0,0,0,29.3,21.56C19.27,22.47.47,19-.33,17.27s.14-10,.21-15A6.42,6.42,0,0,1,0,.47C.2-.09.68,0,1.19,0c1.33-.07,2.67-.07,4,0a1.8,1.8,0,0,1,.95.22Z';
const Message = ({message, isEnd}) => {
  const isMyMessage = message.user._id == auth.currentUser.email;
  return (
    <View
      style={{
        backgroundColor: isMyMessage ? '#DCF8C5' : 'white',
        alignSelf: isMyMessage ? 'flex-end' : 'flex-start',
        marginBottom: 3,
        paddingTop: 10,
        paddingBottom: 5,
        paddingHorizontal: 12,
        borderRadius: 12,
        marginHorizontal: 5,
        maxWidth: '80%',
        //   marginHorizontal: 8,
      }}>
      {isEnd && (
        <View
          style={{
            position: 'absolute',
            bottom: -10,
            right: isMyMessage ? -30 : undefined,
            left: isMyMessage == 0 ? -30 : undefined,
            transform: [{scaleX: isMyMessage == 0 ? -1 : 1}],
          }}>
          <Svg height="30" width="40">
            <Path d={d} fill={isMyMessage ? '#DCF8C5' : 'white'} />
          </Svg>
        </View>
      )}
      <Text>{message.text}</Text>
      {/* <Text style={styles.time}>{dayjs(message.createdAt).fromNow(true)}</Text> */}
    </View>
  );
};

export default Message;

const styles = StyleSheet.create({
  myArraow: {
    // backgroundColor: 'black',
    position: 'absolute',
    bottom: -10,
    right: -30,
  },
  time: {
    alignSelf: 'flex-end',
    color: 'grey',
    fontSize: 10,
  },
  otherArrow: {
    // backgroundColor: '#DCF8C5',
    // position: 'absolute',
    position: 'absolute',
    bottom: -10,
    left: -30,
  },
  mask: {
    // backgroundColor: '#DCF8C5',
    //position: 'absolute',
    borderRadius: 20,
    //  backgroundColor: 'transparent',
    backgroundColor: 'rgba(0, 0, 0, 0)',
    width: 30,
    height: 30,
  },
  rightArrow: {
    position: 'absolute',
    backgroundColor: '#DCF8C5',
    //  backgroundColor: 'red',
    width: 20,
    height: 25,
    bottom: 0,
    borderBottomLeftRadius: 25,
    right: -10,
  },

  rightArrowOverlap: {
    position: 'absolute',
    backgroundColor: 'white',
    //  backgroundColor: 'red',
    width: 20,
    height: 35,
    bottom: 3,
    borderBottomLeftRadius: 18,
    right: -20,
  },
});
