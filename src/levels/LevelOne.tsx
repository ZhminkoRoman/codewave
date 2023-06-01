import React, {useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {GestureHandlerRootView} from 'react-native-gesture-handler';
import Field from '../components/Field/Field';
import {levelProperties$} from '../utils/utils';

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: '#101831',
    backgroundColor: '#0d0221',
    // backgroundColor: '#1B2853',
    // backgroundColor: '#2b394b',
    // backgroundColor: '#002232',
    color: '#ffffff',
  },
  image: {
    flex: 1,
    width: '100%',
    resizeMode: 'cover',
    alignItems: 'center',
    justifyContent: 'center',
  },
  counter: {
    display: 'flex',
    width: '75%',
    // backgroundColor: '#1B2853',
    // shadowColor: '#1B2853',
    // shadowOffset: {
    //   width: 0,
    //   height: 0,
    // },
    // shadowOpacity: 1,
    // shadowRadius: 10,
    marginBottom: 20,
    padding: 5,
  },
});

export default function LevelOne() {
  useEffect(() => {
    levelProperties$.subscribe();

    return () => levelProperties$.unsubscribe();
  }, []);
  return (
    <GestureHandlerRootView style={styles.container}>
      <>
        <View style={styles.counter}>
          <Text style={{color: '#fff', fontWeight: '700'}}>
            Count: {levelProperties$.value.counter}
          </Text>
        </View>
        <Field columns={8} rows={8} tilesCount={64} />
      </>
    </GestureHandlerRootView>
  );
}
