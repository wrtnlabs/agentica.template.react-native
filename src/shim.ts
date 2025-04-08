import 'react-native-polyfill-globals/auto';
import '@azure/core-asynciterator-polyfill';
import {fetch} from 'expo/fetch';

(() => {
  globalThis.fetch = fetch as any;
})();
