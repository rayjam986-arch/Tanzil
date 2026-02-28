import { useState, useEffect, useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

export interface PrayerTime {
  name: string;
  key: string;
  time: string;
}

interface AladhanTimings {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

interface AladhanDate {
  hijri: {
    day: string;
    weekday: { ar: string; en: string };
    month: { number: number; ar: string; en: string };
    year: string;
  };
  gregorian: {
    day: string;
    month: { number: number; en: string };
    year: string;
  };
}

interface AladhanResponse {
  data: {
    timings: AladhanTimings;
    date: AladhanDate;
  };
}

interface LocationState {
  latitude: number | null;
  longitude: number | null;
  city: string | null;
  country: string | null;
  status: 'idle' | 'loading' | 'granted' | 'denied' | 'manual';
}

const PRAYER_KEYS = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'] as const;

function parseTime(timeStr: string): Date {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const now = new Date();
  now.setHours(hours, minutes, 0, 0);
  return now;
}

function getNextPrayer(timings: AladhanTimings): { key: string; time: string; remaining: number } | null {
  const now = new Date();
  const prayerOrder = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'] as const;

  for (const key of prayerOrder) {
    const prayerTime = parseTime(timings[key]);
    const diff = prayerTime.getTime() - now.getTime();
    if (diff > 0) {
      return { key, time: timings[key], remaining: diff };
    }
  }

  const fajrTomorrow = parseTime(timings.Fajr);
  fajrTomorrow.setDate(fajrTomorrow.getDate() + 1);
  return { key: 'Fajr', time: timings.Fajr, remaining: fajrTomorrow.getTime() - now.getTime() };
}

function formatCountdown(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

async function fetchPrayerTimesByCoords(lat: number, lng: number, method: number): Promise<AladhanResponse> {
  const date = new Date();
  const dateStr = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
  const res = await fetch(
    `https://api.aladhan.com/v1/timings/${dateStr}?latitude=${lat}&longitude=${lng}&method=${method}`
  );
  if (!res.ok) throw new Error('Failed to fetch prayer times');
  return res.json();
}

async function fetchPrayerTimesByCity(city: string, country: string, method: number): Promise<AladhanResponse> {
  const date = new Date();
  const dateStr = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
  const res = await fetch(
    `https://api.aladhan.com/v1/timingsByCity/${dateStr}?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&method=${method}`
  );
  if (!res.ok) throw new Error('Failed to fetch prayer times');
  return res.json();
}

export function usePrayerTimes(method: number = 4) {
  const [location, setLocation] = useState<LocationState>({
    latitude: null, longitude: null, city: null, country: null, status: 'idle',
  });
  const [countdown, setCountdown] = useState('');
  const [nextPrayerKey, setNextPrayerKey] = useState<string | null>(null);

  const requestLocation = useCallback(() => {
    setLocation(prev => ({ ...prev, status: 'loading' }));
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          city: null, country: null,
          status: 'granted',
        });
      },
      () => {
        setLocation(prev => ({ ...prev, status: 'denied' }));
      },
      { enableHighAccuracy: false, timeout: 10000 }
    );
  }, []);

  const setManualCity = useCallback((city: string, country: string) => {
    setLocation({ latitude: null, longitude: null, city, country, status: 'manual' });
  }, []);

  const canFetch = (location.status === 'granted' && location.latitude !== null) || (location.status === 'manual' && location.city !== null);

  const { data, isLoading, error } = useQuery({
    queryKey: ['prayerTimes', location.latitude, location.longitude, location.city, location.country, method],
    queryFn: () => {
      if (location.status === 'manual' && location.city && location.country) {
        return fetchPrayerTimesByCity(location.city, location.country, method);
      }
      if (location.latitude !== null && location.longitude !== null) {
        return fetchPrayerTimesByCoords(location.latitude, location.longitude, method);
      }
      throw new Error('No location');
    },
    enabled: canFetch,
    staleTime: 1000 * 60 * 60,
    retry: 2,
  });

  const timings = data?.data?.timings;
  const dateInfo = data?.data?.date;

  const prayers: PrayerTime[] = useMemo(() => {
    if (!timings) return [];
    return PRAYER_KEYS.map(key => ({
      name: key.toLowerCase(),
      key,
      time: timings[key],
    }));
  }, [timings]);

  useEffect(() => {
    if (!timings) return;
    const update = () => {
      const next = getNextPrayer(timings);
      if (next) {
        setNextPrayerKey(next.key);
        setCountdown(formatCountdown(next.remaining));
      }
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [timings]);

  useEffect(() => {
    if (location.status === 'idle') {
      requestLocation();
    }
  }, [location.status, requestLocation]);

  return {
    prayers,
    nextPrayerKey,
    countdown,
    dateInfo,
    isLoading: isLoading || location.status === 'loading',
    error,
    locationStatus: location.status,
    requestLocation,
    setManualCity,
  };
}
