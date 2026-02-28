import { useState, useRef, useCallback, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { RECITERS, getReciterById, type Reciter } from '@/data/reciters';

const QURAN_API = 'https://api.quran.com/api/v4';

interface VerseTimestamp {
  verse_key: string;
  timestamp_from: number;
  timestamp_to: number;
}

interface AudioFileData {
  audioUrl: string;
  timestamps: VerseTimestamp[];
}

async function fetchAudioFile(reciter: Reciter, chapterNumber: number): Promise<AudioFileData> {
  if (reciter.apiSource === 'mp3quran' && reciter.server) {
    // Direct MP3 link from mp3quran.net (3-digit surah number)
    const surahStr = chapterNumber.toString().padStart(3, '0');
    return {
      audioUrl: `${reciter.server}${surahStr}.mp3`,
      timestamps: [],
    };
  }

  // quran.com API with timestamps
  const res = await fetch(
    `${QURAN_API}/chapter_recitations/${reciter.id}/${chapterNumber}`
  );
  if (!res.ok) throw new Error('Failed to fetch audio');
  const data = await res.json();
  const af = data.audio_file;
  return {
    audioUrl: af.audio_url,
    timestamps: af.verse_timings || af.timestamps || [],
  };
}

export function useQuranAudio(chapterNumber: number) {
  const [reciterId, setReciterId] = useState(7); // Default: Al-Afasy
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentVerseKey, setCurrentVerseKey] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const rafRef = useRef<number>();

  const reciter = getReciterById(reciterId) || RECITERS[0];

  const { data: audioData, isLoading } = useQuery({
    queryKey: ['quran-audio', reciterId, chapterNumber],
    queryFn: () => fetchAudioFile(reciter, chapterNumber),
    staleTime: 1000 * 60 * 60,
  });

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
        audioRef.current = null;
      }
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Reset when reciter or chapter changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
      audioRef.current = null;
    }
    setIsPlaying(false);
    setCurrentVerseKey(null);
    setProgress(0);
    setDuration(0);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  }, [reciterId, chapterNumber]);

  const trackProgress = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !audioData) return;

    const currentMs = audio.currentTime * 1000;
    setProgress(audio.currentTime);
    setDuration(audio.duration || 0);

    // Find current verse from timestamps (only for quran.com reciters)
    if (audioData.timestamps.length > 0) {
      const ts = audioData.timestamps;
      let foundKey: string | null = null;
      for (const t of ts) {
        if (currentMs >= t.timestamp_from && currentMs < t.timestamp_to) {
          foundKey = t.verse_key;
          break;
        }
      }
      setCurrentVerseKey(foundKey);
    }

    if (!audio.paused) {
      rafRef.current = requestAnimationFrame(trackProgress);
    }
  }, [audioData]);

  const play = useCallback(async () => {
    if (!audioData) return;

    if (!audioRef.current || audioRef.current.src !== audioData.audioUrl) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
      const audio = new Audio(audioData.audioUrl);
      audio.addEventListener('ended', () => {
        setIsPlaying(false);
        setCurrentVerseKey(null);
        setProgress(0);
      });
      audio.addEventListener('loadedmetadata', () => {
        setDuration(audio.duration || 0);
      });
      audioRef.current = audio;
    }

    try {
      await audioRef.current.play();
      setIsPlaying(true);
      rafRef.current = requestAnimationFrame(trackProgress);
    } catch (e) {
      console.error('Audio playback failed:', e);
    }
  }, [audioData, trackProgress]);

  const pause = useCallback(() => {
    audioRef.current?.pause();
    setIsPlaying(false);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  }, []);

  const togglePlay = useCallback(() => {
    if (isPlaying) pause();
    else play();
  }, [isPlaying, play, pause]);

  const seekToVerse = useCallback((verseKey: string) => {
    if (!audioData) return;
    const ts = audioData.timestamps.find(t => t.verse_key === verseKey);
    if (ts && audioRef.current) {
      audioRef.current.currentTime = ts.timestamp_from / 1000;
      if (!isPlaying) play();
    } else if (ts) {
      play().then(() => {
        if (audioRef.current) {
          audioRef.current.currentTime = ts.timestamp_from / 1000;
        }
      });
    }
  }, [audioData, isPlaying, play]);

  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setProgress(time);
    }
  }, []);

  return {
    reciterId,
    setReciterId,
    isPlaying,
    togglePlay,
    currentVerseKey,
    progress,
    duration,
    seek,
    seekToVerse,
    isLoading,
    reciters: RECITERS,
  };
}
