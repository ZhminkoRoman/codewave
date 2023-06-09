import React, {useEffect, useMemo, useState} from 'react';
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
  const [tilesCount, setTilesCount] = useState<number>(0);
  const [levelLoaded, setLevelLoaded] = useState(false);
  const [levelProperties, setLevelProperties] = useState<{
    level: number;
    counter: number;
    columns: number;
    rows: number;
    totalTiles: number;
  }>({
    level: 1,
    counter: 0,
    columns: 0,
    rows: 0,
    totalTiles: 0,
  });

  useEffect(() => {
    // console.log('LEVEL subscribe');
    const levelSubscription = levelProperties$.subscribe(propss =>
      setLevelProperties(propss)
    );

    return () => {
      // console.log('LEVEL unsubscribe');
      levelSubscription.unsubscribe();
    };
  }, []);

  const columns = useMemo(() => {
    return 8;
  }, []);

  const rows = useMemo(() => {
    return 8;
  }, []);

  const totalTiles = useMemo(() => {
    return columns * rows;
  }, [columns, rows]);

  useEffect(() => {
    // console.log('LEVEL next');
    levelProperties$.next({
      level: 1,
      counter: tilesCount,
      columns,
      rows,
      totalTiles,
    });
  }, [columns, rows, tilesCount, totalTiles]);

  useEffect(() => {
    if (
      levelProperties$.value.columns &&
      levelProperties$.value.rows &&
      levelProperties$.value.totalTiles
    ) {
      setLevelLoaded(true);
    }
  }, []);

  if (!levelLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <>
        <View style={styles.counter}>
          <Text style={{color: '#fff', fontWeight: '700'}}>
            Count: {levelProperties.counter}
          </Text>
        </View>
        {levelProperties.counter === 0 ? (
          <Field
            columns={levelProperties.columns}
            rows={levelProperties.rows}
            totalTiles={levelProperties.totalTiles}
            handleTilesChange={(value: number) => setTilesCount(value)}
          />
        ) : null}
      </>
    </GestureHandlerRootView>
  );
}
