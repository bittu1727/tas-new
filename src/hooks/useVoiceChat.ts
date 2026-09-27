import { useState, useEffect, useRef, useCallback } from 'react';
import { sounds } from '../utils/audio';

export interface VoicePeerStatus {
  playerId: string;
  isMuted: boolean;
  isSpeaking: boolean;
  isDeafened: boolean;
}

export interface VoicePhraseEvent {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  text: string;
  phraseKey: string;
  timestamp: number;
}

export interface UseVoiceChatProps {
  socket: WebSocket | null;
  myPlayerId: string | null;
  roomCode?: string;
  language?: 'hi' | 'en';
}

export function useVoiceChat({
  socket,
  myPlayerId,
  roomCode,
  language = 'hi',
}: UseVoiceChatProps) {
  const [micPermission, setMicPermission] = useState<
    'idle' | 'requesting' | 'granted' | 'denied' | 'unsupported'
  >('idle');
  const [isMicOn, setIsMicOn] = useState(false);
  const [isDeafened, setIsDeafened] = useState(false);
  const [myVolume, setMyVolume] = useState(0); // 0 to 100
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speakingPeers, setSpeakingPeers] = useState<Record<string, boolean>>({});
  const [peerStatuses, setPeerStatuses] = useState<Record<string, VoicePeerStatus>>({});
  const [recentPhrase, setRecentPhrase] = useState<VoicePhraseEvent | null>(null);

  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const peerTimerRefs = useRef<Record<string, NodeJS.Timeout>>({});
  const isDeafenedRef = useRef(isDeafened);
  isDeafenedRef.current = isDeafened;

  // Cleanup on unmount or room leave
  useEffect(() => {
    return () => {
      stopMic();
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, [roomCode]);

  // Handle incoming voice websocket messages
  useEffect(() => {
    if (!socket) return;

    const handleMessage = (event: MessageEvent) => {
      try {
        const msg = JSON.parse(event.data);
        switch (msg.type) {
          case 'VOICE_CHUNK': {
            if (isDeafenedRef.current) return;
            const { senderId, audio } = msg.data;
            if (senderId && senderId !== myPlayerId) {
              // Highlight speaking peer
              setSpeakingPeers((prev) => ({ ...prev, [senderId]: true }));
              if (peerTimerRefs.current[senderId]) {
                clearTimeout(peerTimerRefs.current[senderId]);
              }
              peerTimerRefs.current[senderId] = setTimeout(() => {
                setSpeakingPeers((prev) => ({ ...prev, [senderId]: false }));
              }, 600);

              // Play audio chunk
              if (audio) {
                playReceivedAudioChunk(audio);
              }
            }
            break;
          }

          case 'PLAYER_VOICE_STATUS': {
            const { playerId, isMuted, isSpeaking: peerSpeaking, isDeafened: peerDeafened } = msg.data;
            if (playerId) {
              setPeerStatuses((prev) => ({
                ...prev,
                [playerId]: {
                  playerId,
                  isMuted,
                  isSpeaking: peerSpeaking,
                  isDeafened: peerDeafened,
                },
              }));
              if (peerSpeaking) {
                setSpeakingPeers((prev) => ({ ...prev, [playerId]: true }));
                if (peerTimerRefs.current[playerId]) {
                  clearTimeout(peerTimerRefs.current[playerId]);
                }
                peerTimerRefs.current[playerId] = setTimeout(() => {
                  setSpeakingPeers((prev) => ({ ...prev, [playerId]: false }));
                }, 600);
              }
            }
            break;
          }

          case 'VOICE_PHRASE': {
            if (isDeafenedRef.current) return;
            const phraseData: VoicePhraseEvent = msg.data;
            setRecentPhrase(phraseData);

            // Highlight sender as speaking
            if (phraseData.senderId) {
              setSpeakingPeers((prev) => ({ ...prev, [phraseData.senderId]: true }));
              setTimeout(() => {
                setSpeakingPeers((prev) => ({ ...prev, [phraseData.senderId]: false }));
              }, 2200);
            }

            // Speak phrase using SpeechSynthesis
            speakText(phraseData.text, language);
            break;
          }
        }
      } catch {
        // Non-JSON or other message
      }
    };

    socket.addEventListener('message', handleMessage);
    return () => {
      socket.removeEventListener('message', handleMessage);
    };
  }, [socket, myPlayerId, language]);

  // Decode and play received audio chunk
  const playReceivedAudioChunk = async (base64Audio: string) => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioCtx();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }

      // Convert base64 to array buffer
      const binaryString = atob(base64Audio);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const audioBuffer = await ctx.decodeAudioData(bytes.buffer);
      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(ctx.destination);
      source.start();
    } catch {
      // Audio playback fallback via Audio element
      try {
        const audio = new Audio(`data:audio/webm;base64,${base64Audio}`);
        audio.play().catch(() => {});
      } catch {
        // ignore
      }
    }
  };

  // Speak voice phrase using Web Speech API
  const speakText = (text: string, lang: 'hi' | 'en') => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      sounds.playCoinCollect();
      return;
    }

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      utterance.pitch = 1.1;
      utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-US';

      // Pick best matching voice if available
      const voices = window.speechSynthesis.getVoices();
      const match = voices.find((v) =>
        lang === 'hi' ? v.lang.includes('hi') : v.lang.includes('en')
      );
      if (match) utterance.voice = match;

      window.speechSynthesis.speak(utterance);
    } catch {
      sounds.playCardSnap();
    }
  };

  // Start microphone
  const startMic = async () => {
    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      setMicPermission('unsupported');
      return;
    }

    setMicPermission('requesting');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      mediaStreamRef.current = stream;
      setMicPermission('granted');
      setIsMicOn(true);
      sounds.playClick();

      // Audio analysis for volume meter & voice activity
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;

      // Monitor volume
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const checkVolume = () => {
        if (!mediaStreamRef.current) return;
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const avg = sum / dataArray.length;
        const normalized = Math.min(100, Math.round((avg / 128) * 100));
        setMyVolume(normalized);

        const speakingNow = normalized > 12;
        setIsSpeaking(speakingNow);

        animFrameRef.current = requestAnimationFrame(checkVolume);
      };
      checkVolume();

      // Setup MediaRecorder to stream chunks
      let mimeType = 'audio/webm;codecs=opus';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'audio/webm';
        if (!MediaRecorder.isTypeSupported(mimeType)) {
          mimeType = '';
        }
      }

      const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = async (e) => {
        if (e.data && e.data.size > 0 && socket && socket.readyState === WebSocket.OPEN) {
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64Data = (reader.result as string).split(',')[1];
            if (base64Data) {
              socket.send(
                JSON.stringify({
                  type: 'VOICE_CHUNK',
                  data: {
                    audio: base64Data,
                    volume: myVolume,
                  },
                })
              );
            }
          };
          reader.readAsDataURL(e.data);
        }
      };

      recorder.start(350); // Emit chunk every 350ms for low latency

      // Notify room
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(
          JSON.stringify({
            type: 'VOICE_STATUS',
            data: {
              isMuted: false,
              isSpeaking: false,
              isDeafened,
            },
          })
        );
      }
    } catch (err) {
      console.warn('Microphone access denied or error:', err);
      setMicPermission('denied');
      setIsMicOn(false);
    }
  };

  // Stop microphone
  const stopMic = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
      } catch {}
      mediaRecorderRef.current = null;
    }

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }

    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }

    setIsMicOn(false);
    setIsSpeaking(false);
    setMyVolume(0);

    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(
        JSON.stringify({
          type: 'VOICE_STATUS',
          data: {
            isMuted: true,
            isSpeaking: false,
            isDeafened,
          },
        })
      );
    }
  };

  // Toggle Mic
  const toggleMic = () => {
    sounds.playClick();
    if (isMicOn) {
      stopMic();
    } else {
      startMic();
    }
  };

  // Toggle Deafened (Mute incoming voice)
  const toggleDeafened = () => {
    sounds.playClick();
    setIsDeafened((prev) => {
      const next = !prev;
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(
          JSON.stringify({
            type: 'VOICE_STATUS',
            data: {
              isMuted: !isMicOn,
              isSpeaking,
              isDeafened: next,
            },
          })
        );
      }
      return next;
    });
  };

  // Send a quick voice line / phrase
  const sendVoicePhrase = (phraseKey: string, text: string) => {
    sounds.playClick();
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(
        JSON.stringify({
          type: 'VOICE_PHRASE',
          data: {
            phraseKey,
            text,
          },
        })
      );
    } else {
      // Local fallback for solo or testing
      speakText(text, language);
      setIsSpeaking(true);
      setTimeout(() => setIsSpeaking(false), 2000);
    }
  };

  return {
    isMicOn,
    isDeafened,
    micPermission,
    myVolume,
    isSpeaking,
    speakingPeers,
    peerStatuses,
    recentPhrase,
    startMic,
    stopMic,
    toggleMic,
    toggleDeafened,
    sendVoicePhrase,
  };
}
