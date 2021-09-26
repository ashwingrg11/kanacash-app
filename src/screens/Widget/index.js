import React from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import GenericView from '~/components/ui/GenericView';
import Header from '~/components/ui/Header';
import {WebView} from 'react-native-webview';
import Button from '~/components/ui/Button';
import * as api from '~/services/axios/Api';
import {WIDGET, WIDGET_STYLE} from '../../../config';
import {showToast} from '~/store/actions/ToastAction';
import {useDispatch} from 'react-redux';
import STATUS from '~/constants/widgetStatus';
import {syncUserSetting} from '~/store/actions/UserDetailsAction';

/**
 * @param {navigation} param
 * @param {route}
 * route.params.widgetType
 * Type of Widget to render
 * kyc, bank, card, tier, invoice
 */
// when get the success
// may be listen event ?
const injectScript = `
(function () {
  window.postMessage(document.getElementsByClassName("remit-msg-success"))
}());
`;

const STYLE_CSS = WIDGET_STYLE;
const WIDGET_URL = WIDGET;

export default function Widgets({route, navigation}) {
  // const webViewRef = React.useRef();
  const dispatch = useDispatch();
  const webviewRef = React.useRef(null);
  const {widgetType, onGoBack, bankId, cardId} = route.params;
  const [type] = React.useState(widgetType);
  const [widget, setWidget] = React.useState(undefined);
  const [completeState, setCompleteState] = React.useState(false);

  let BANK_ID = bankId ?? '';
  let CARD_ID = cardId ?? '';

  React.useEffect(() => {
    api.widgets().then(res => {
      setWidget(res.data);
    });
  }, []);

  const handleWebViewNavigationStateChange = newNavState => {
    // webview.stopLoading();
    // newNavState looks something like this:
    // {
    //   url?: string;
    //   title?: string;
    //   loading?: boolean;
    //   canGoBack?: boolean;
    //   canGoForward?: boolean;
    // }
    const {url} = newNavState;
    if (!url) {
      return;
    }
    // one way to handle a successful form submit is via query strings
    // do something if the user is verified
    if (url.includes('')) {
      // webview.stopLoading();
      // NavigationService.back();
      // navigation.navigate('DashboardStack');
    }
  };

  const onMessage = e => {
    // e.nativeEvent.data.type    = kyc || bank || tier
    // e.nativeEvent.data.status  = eventName
    // e.nativeEvent.data.message = additional message
    // "{"type":"BANK","status":"BANK_ADDED","message":"Sender bank added successfully"}"
    const webMessage = JSON.parse(e.nativeEvent.data);
    console.log('webMessage', webMessage);
    if (webMessage?.message) {
      if (
        webMessage.message == 'KYC REVIEW PENDING' ||
        webMessage.message == 'KYC VERIFIED.' ||
        webMessage.message == 'KYC VERIFIED' ||
        webMessage?.message.includes('success') ||
        webMessage?.message.includes('Success')
      ) {
        let status = webMessage?.status;
        let message = null;
        switch (status) {
          case STATUS.VERIFIED:
            message =
              'Your personal information has been verified successfully.';
            break;
          case STATUS.BANK_ADDED:
            message = 'Your bank has been added successfully.';
            break;
          case STATUS.CARD_ADDED:
            message = 'Your Debit card has been added successfully.';
            break;
          default:
            message = null;
        }
        if (message !== null) {
          dispatch(
            showToast({
              message: message,
              status: true,
            }),
          );
        }
        dispatch(syncUserSetting());
        setCompleteState(true);
        onGoBack && route.params.onGoBack({selected: true, widgetType});
        navigation.goBack();
      }
    }
  };

  const onPressContinue = () => {
    onGoBack && route.params.onGoBack({selected: true});
    navigation.goBack();
  };

  return (
    <GenericView
      backgroundColor="#fff"
      loading={widget === undefined}
      header={<Header title={`${type.toUpperCase()}`} backButtonVisible />}
      footer={
        completeState ? (
          <View style={styles.footerStyle}>
            <Button text="Continue" onPress={onPressContinue} />
          </View>
        ) : (
          <></>
        )
      }>
      {widget !== undefined && (
        <WebView
          style={{flex: 1}}
          injectedJavaScript={injectScript}
          ref={webviewRef}
          originWhitelist={['*']}
          source={{
            html: `
            <html lang="en">
              <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Document</title>
              </head>
              <body>
                <div id="widget-root"></div>
                <script
                  src='${WIDGET_URL}'
                  charset="utf-8"
                ></script>
                <script>
                  var config = {
                    elementId: 'widget-root',
                    senderId: '${widget.referenceId}',
                    width: '100%',
                    height: '200px',
                    type: '${type}',
                    locale: 'en',
                    multiStep: true,
                    stylesheet: '${STYLE_CSS}',
                    token: '${widget.token}',
                    bankId: '${BANK_ID}',
                    cardId: '${CARD_ID}'
                  }
                  var widget = new MachnetWidget(config);
                  widget.init();
                  document.getElementById('widget-iframe').height = '${Dimensions.get(
                    'window',
                  ).height - 150}';
                  window.addEventListener('message', function (e) {
                    window.ReactNativeWebView.postMessage(JSON.stringify(e.data))
                  });
                </script>
              </body>
            </html>`,
          }}
          onMessage={onMessage}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          onNavigationStateChange={handleWebViewNavigationStateChange}
          // do not store any data within the lifetime of the WebView.
          incognito
        />
      )}
    </GenericView>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rateWrapper: {
    marginBottom: 15,
  },
  boldText: {
    fontWeight: 'bold',
  },
  footerStyle: {
    alignItems: 'center',
  },
});
