import { useState, useEffect, useCallback } from 'react';

const KAABA_LAT = 21.4225;
const KAABA_LNG = 39.8262;

function toRad(deg: number) { return (deg * Math.PI) / 180; }
function toDeg(rad: number) { return (rad * 180) / Math.PI; }

function calcQiblaAngle(lat: number, lng: number): number {
  const phiK = toRad(KAABA_LAT);
  const lambdaK = toRad(KAABA_LNG);
  const phi = toRad(lat);
  const lambda = toRad(lng);
  const dLambda = lambdaK - lambda;
  const y = Math.sin(dLambda);
  const x = Math.cos(phi) * Math.tan(phiK) - Math.sin(phi) * Math.cos(dLambda);
  let angle = toDeg(Math.atan2(y, x));
  return (angle + 360) % 360;
}

interface QiblaState {
  qiblaAngle: number | null;
  compassHeading: number | null;
  error: string | null;
  loading: boolean;
  supported: boolean;
}

export function useQibla() {
  const [state, setState] = useState<QiblaState>({
    qiblaAngle: null,
    compassHeading: null,
    error: null,
    loading: true,
    supported: true,
  });

  const handleOrientation = useCallback((e: DeviceOrientationEvent) => {
    // webkitCompassHeading for iOS, alpha for Android
    const heading = (e as any).webkitCompassHeading ?? (e.alpha != null ? (360 - e.alpha) % 360 : null);
    if (heading != null) {
      setState(prev => ({ ...prev, compassHeading: heading }));
    }
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) {
      setState(prev => ({ ...prev, error: 'geo', loading: false }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const angle = calcQiblaAngle(pos.coords.latitude, pos.coords.longitude);
        setState(prev => ({ ...prev, qiblaAngle: angle, loading: false }));
      },
      () => {
        setState(prev => ({ ...prev, error: 'geo', loading: false }));
      }
    );
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const hasOrientation = 'DeviceOrientationEvent' in window;
    if (!hasOrientation) {
      setState(prev => ({ ...prev, supported: false }));
      return;
    }

    // iOS 13+ requires permission
    const DOE = DeviceOrientationEvent as any;
    if (typeof DOE.requestPermission === 'function') {
      DOE.requestPermission().then((perm: string) => {
        if (perm === 'granted') {
          window.addEventListener('deviceorientation', handleOrientation, true);
        } else {
          setState(prev => ({ ...prev, supported: false }));
        }
      }).catch(() => {
        setState(prev => ({ ...prev, supported: false }));
      });
    } else {
      window.addEventListener('deviceorientation', handleOrientation, true);
    }

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation, true);
    };
  }, [handleOrientation]);

  const rotation = state.qiblaAngle != null && state.compassHeading != null
    ? (state.qiblaAngle - state.compassHeading + 360) % 360
    : null;

  return { ...state, rotation };
}
