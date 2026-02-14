import { useState, useEffect } from 'react';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';

export interface NetworkStatus {
  isConnected: boolean;
  isInternetReachable: boolean | null;
  type: string | null;
  isOffline: boolean;
}

export function useNetworkStatus() {
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>({
    isConnected: true,
    isInternetReachable: null,
    type: null,
    isOffline: false,
  });

  useEffect(() => {
    // Get initial network state
    NetInfo.fetch().then(state => {
      updateNetworkStatus(state);
    });

    // Subscribe to network state updates
    const unsubscribe = NetInfo.addEventListener(state => {
      updateNetworkStatus(state);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const updateNetworkStatus = (state: NetInfoState) => {
    setNetworkStatus({
      isConnected: state.isConnected ?? false,
      isInternetReachable: state.isInternetReachable,
      type: state.type,
      isOffline: !state.isConnected || state.isInternetReachable === false,
    });
  };

  return networkStatus;
}
