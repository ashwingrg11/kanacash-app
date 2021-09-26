import React from 'react';
import {View, ActivityIndicator, StyleSheet, SafeAreaView} from 'react-native';
import {useSelector} from 'react-redux';
import {RegularText} from '~/components/ui/Text';

const Loader = () => {
  const loaderState = useSelector(state => state.loader);
  return loaderState ? (
    <SafeAreaView style={styles.container}>
      <View style={styles.loaderView}>
        <View style={styles.loaderStyle}>
          <ActivityIndicator size="large" color="#fff" />
          <RegularText text="Please wait..." style={styles.loaderText} />
        </View>
      </View>
    </SafeAreaView>
  ) : null;
};

export default Loader;

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.44)',
    marginTop: -100,
    marginBottom: -100,
    zIndex: 9,
  },
  loaderView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderStyle: {
    width: '60%',
    height: '20%',
    backgroundColor: '#2e333b',
    elevation: 20,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderText: {
    color: '#fff',
    fontSize: 18,
    marginTop: 20,
  },
});
