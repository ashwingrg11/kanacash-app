import React, {useState, useEffect, Fragment} from 'react';
import {
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  SafeAreaView,
  PermissionsAndroid,
  Platform,
  Alert,
  Dimensions,
} from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import {WebView} from 'react-native-webview';
import {RegularText} from '~/components/ui/Text';
import {PrintIcon, CloseIcon} from '~/components/ui/Icon';
import * as api from '~/services/axios/Api';
import Button from '~/components/ui/Button';
import {useDispatch} from 'react-redux';
import {WIDGET, WIDGET_STYLE} from '../../../../config';
import {showToast} from '~/store/actions/ToastAction';

const injectScript = `
(function () {
  var payload = { url: downloadUrl };
  window.postMessage(JSON.stringify(payload));
}());
`;

const wid_height = Dimensions.get('window').height - 150;

export default function Invoice({transactionId}) {
  const dispatch = useDispatch();
  const [modalVisible, setModalVisible] = useState(false);
  const [widget, setWidget] = React.useState(undefined);
  const [downloadState, setDownloadState] = useState(false);

  useEffect(() => {
    let cleanup;
    if (modalVisible) {
      cleanup = api.widgets().then(res => {
        setWidget(res.data);
      });
    }
    return () => {
      cleanup;
    };
  }, [modalVisible]);

  const onMessage = e => {
    console.log(e);
  };

  const onDownloadError = error => {
    setDownloadState(false);
    Alert.alert(error.message);
    console.log('The file saved to ERROR', error.message);
  };

  // Main function to download the image
  const downloadInvoice = () => {
    setDownloadState(true);
    try {
      api.downloadTransactionInvoice(transactionId).then(res => {
        // To add the time suffix in filename
        let date = new Date();
        let invoice_URL = res.data.invoice;
        let ext = '.' + 'pdf';
        const {config, fs} = RNFetchBlob;
        const dirToSave =
          Platform.OS == 'ios' ? fs.dirs.DocumentDir : fs.dirs.DownloadDir;
        const fileName =
          '/invoice_' +
          Math.floor(date.getTime() + date.getSeconds() / 2) +
          ext;
        const path = dirToSave + fileName;

        const configFB = {
          fileCache: true,
          useDownloadManager: true,
          notification: true,
          mediaScannable: true,
          title: fileName,
          path: path,
        };

        const configOptions = Platform.select({
          ios: {
            fileCache: configFB.fileCache,
            title: configFB.title,
            path: configFB.path,
            appendExt: 'pdf',
          },
          android: configFB,
        });

        config(configOptions)
          .fetch('GET', invoice_URL)
          .then(rnRes => {
            setModalVisible(false);
            setDownloadState(false);
            if (Platform.OS === 'ios') {
              RNFetchBlob.fs.writeFile(path, rnRes.data, 'base64');
              RNFetchBlob.ios.previewDocument(path);
              RNFetchBlob.ios.openDocument(path);
            }
            dispatch(
              showToast({
                message: 'Receipt has been successfully downloaded.',
              }),
            );
          })
          .catch(error => {
            setDownloadState(false);
            onDownloadError(error);
          });
      });
    } catch (error) {
      setDownloadState(false);
      onDownloadError(error);
    }
  };

  const getExtention = filename => {
    // To get the file extension
    return /[.]/.exec(filename) ? /[^.]+$/.exec(filename) : undefined;
  };

  const onDownloadInvoice = () => {
    //Function to check the platform
    //If iOS the start downloading
    //If Android then ask for runtime permission
    if (Platform.OS === 'ios') {
      downloadInvoice();
    } else {
      try {
        PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission Required',
            message: 'App needs access to your storage to download Photos',
          },
        ).then(granted => {
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            //Once user grant the permission start downloading
            console.log('Storage Permission Granted.');
            downloadInvoice();
          } else {
            //If permission denied then show alert 'Storage Permission
            // Not Granted'
            Alert.alert('permission denied, Failed to download invoice');
          }
        });
      } catch (err) {
        //To handle permission related issue
        console.log('error', err);
      }
    }
  };

  return (
    <View>
      <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
        <View style={[styles.rowGroup, styles.printIcon]}>
          <PrintIcon />
          <RegularText text="  Receipt" />
        </View>
      </TouchableOpacity>
      {modalVisible && (
        <Modal
          animationType="fade"
          // transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}>
          <SafeAreaView style={styles.full}>
            <View style={styles.closeIcon}>
              <TouchableOpacity
                style={styles.closeBtn}
                onPress={() => {
                  setModalVisible(!modalVisible);
                }}>
                <CloseIcon size={34} color={'#ED1C24'} />
              </TouchableOpacity>
            </View>
            {widget !== undefined && (
              <Fragment>
                <View style={[styles.modalView]}>
                  <WebView
                    renderError={errorName => <RegularText text={errorName} />}
                    domStorageEnabled
                    incognito
                    injectedJavaScript={injectScript}
                    originWhitelist={['*']}
                    useWebKit
                    onFileDownload={({nativeEvent}) => {
                      const {downloadUrl} = nativeEvent;
                      console.log('downloadUrl', downloadUrl);
                      console.warn('downloadUrl', downloadUrl);
                    }}
                    source={{
                      html: `<html lang="en">
                    <head>
                      <meta charset="UTF-8" />
                      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                      <title>Document</title>
                    </head>
                    <body>
                      <div id="widget-root"></div>
                      <script
                        src='${WIDGET}'
                        charset="utf-8"
                      ></script>
                      <script>
                        var widget = new MachnetWidget({
                          elementId: 'widget-root',
                          senderId: '${widget.referenceId}',
                          width: '100%',
                          height: '${wid_height}px',
                          type: 'invoice',
                          locale: 'en',
                          multiStep: true,
                          stylesheet: '${WIDGET_STYLE}',
                          token: '${widget.token}',
                          transactionId: "${transactionId}"
                        });
                        widget.init();
                        document.getElementById('widget-iframe').height = '97%';
                        document.getElementById("download").addEventListener('click', function (e) {
                          window.ReactNativeWebView.postMessage(JSON.stringify(e))
                        });
                      </script>
                    </body>
                  </html>`,
                    }}
                    onMessage={onMessage}
                    javaScriptEnabled={true}
                    startInLoadingState={true}
                  />
                </View>
                <View style={styles.btnDownload}>
                  <Button
                    text={downloadState ? 'Downloading...' : 'Download Invoice'}
                    style={styles.loginBtn}
                    disabled={downloadState}
                    onPress={() => onDownloadInvoice(transactionId)}
                  />
                </View>
              </Fragment>
            )}
          </SafeAreaView>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  full: {
    flex: 1,
  },
  rowGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  printIcon: {},
  modalView: {
    width: '100%',
    // height: '85%',
    flex: 1,
    justifyContent: 'center',
  },
  openButton: {
    backgroundColor: '#F194FF',
    borderRadius: 3,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  closeIcon: {
    alignItems: 'flex-end',
    // height: '5%',
  },
  closeBtn: {
    paddingHorizontal: 10,
    paddingTop: 5,
  },
  btnDownload: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 5,
  },
});
