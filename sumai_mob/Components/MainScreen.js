import 'react-native-gesture-handler';
import * as React from 'react';
import { WebView } from 'react-native-webview';

export default function App() {
  return (
    <WebView
      source={{uri: 'http://211.192.112.2'}}
    />
  );
}