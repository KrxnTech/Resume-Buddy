import { useState, useEffect, useRef, useCallback } from "react";
import { stripMarkdownForSpeech } from "../utils/markdownParser";

export function useSpeech() {
  const [activeSpeechId, setActiveSpeechId] = useState(null);
  const [speechStatus, setSpeechStatus] = useState("idle"); // "idle" | "speaking" | "paused"
  const [isRecording, setIsRecording] = useState(false);

  const recognitionRef = useRef(null);
  const utteranceRef = useRef(null);
  const onEndCallbackRef = useRef(null);

  // Check Web Speech API support
  const isSpeechSynthesisSupported = typeof window !== "undefined" && "speechSynthesis" in window;
  const isRecognitionSupported =
    typeof window !== "undefined" &&
    ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);

  // Cancel any ongoing speech on unmount
  useEffect(() => {
    return () => {
      if (isSpeechSynthesisSupported) {
        window.speechSynthesis.cancel();
      }
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [isSpeechSynthesisSupported]);

  // Handle Text-To-Speech
  const speak = useCallback(
    (id, text, onEnd) => {
      if (!isSpeechSynthesisSupported || !text) {
        onEnd?.();
        return;
      }

      onEndCallbackRef.current = onEnd;

      // If clicking on the currently active speech item to pause/resume
      if (activeSpeechId === id && speechStatus === "speaking") {
        window.speechSynthesis.pause();
        setSpeechStatus("paused");
        return;
      } else if (activeSpeechId === id && speechStatus === "paused") {
        window.speechSynthesis.resume();
        setSpeechStatus("speaking");
        return;
      }

      // Starting a new speech playback
      window.speechSynthesis.cancel();

      const plainText = stripMarkdownForSpeech(text);
      if (!plainText) {
        onEnd?.();
        return;
      }

      const utterance = new SpeechSynthesisUtterance(plainText);
      utteranceRef.current = utterance;

      // Select best natural English voice if available
      const voices = window.speechSynthesis.getVoices();
      const englishVoice =
        voices.find(
          (v) =>
            v.lang.startsWith("en") &&
            (v.name.includes("Natural") ||
              v.name.includes("Google") ||
              v.name.includes("Samantha") ||
              v.name.includes("Daniel") ||
              v.name.includes("Alex") ||
              v.name.includes("Guy") ||
              v.name.includes("Arthur"))
        ) || voices.find((v) => v.lang.startsWith("en"));

      if (englishVoice) {
        utterance.voice = englishVoice;
      }

      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      utterance.onstart = () => {
        setActiveSpeechId(id);
        setSpeechStatus("speaking");
      };

      utterance.onend = () => {
        setActiveSpeechId(null);
        setSpeechStatus("idle");
        if (onEndCallbackRef.current) {
          const cb = onEndCallbackRef.current;
          onEndCallbackRef.current = null;
          cb();
        }
      };

      utterance.onerror = (err) => {
        console.warn("Speech synthesis error or canceled:", err);
        setActiveSpeechId(null);
        setSpeechStatus("idle");
        if (onEndCallbackRef.current) {
          const cb = onEndCallbackRef.current;
          onEndCallbackRef.current = null;
          cb();
        }
      };

      utterance.onpause = () => {
        setSpeechStatus("paused");
      };

      utterance.onresume = () => {
        setSpeechStatus("speaking");
      };

      window.speechSynthesis.speak(utterance);
    },
    [activeSpeechId, speechStatus, isSpeechSynthesisSupported]
  );

  const stopSpeech = useCallback(() => {
    if (isSpeechSynthesisSupported) {
      window.speechSynthesis.cancel();
    }
    setActiveSpeechId(null);
    setSpeechStatus("idle");
    onEndCallbackRef.current = null;
  }, [isSpeechSynthesisSupported]);

  // Handle Speech-To-Text (Voice Input)
  const startRecording = useCallback(
    (onTranscript, onError) => {
      if (!isRecognitionSupported) {
        onError?.("Voice input is not supported in this browser.");
        return;
      }

      // If speech synthesis is active, stop it before recording
      if (isSpeechSynthesisSupported) {
        window.speechSynthesis.cancel();
        setActiveSpeechId(null);
        setSpeechStatus("idle");
      }

      try {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognitionRef.current = recognition;

        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-US";

        recognition.onstart = () => {
          setIsRecording(true);
        };

        recognition.onresult = (event) => {
          let currentTranscript = "";
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              currentTranscript += event.results[i][0].transcript;
            }
          }
          if (currentTranscript) {
            onTranscript?.(currentTranscript);
          }
        };

        recognition.onerror = (event) => {
          console.warn("Speech recognition event error:", event.error);
          if (event.error !== "no-speech" && event.error !== "aborted") {
            onError?.(`Voice error: ${event.error}`);
          }
          setIsRecording(false);
        };

        recognition.onend = () => {
          setIsRecording(false);
        };

        recognition.start();
      } catch (err) {
        console.error("Failed to start speech recognition:", err);
        setIsRecording(false);
        onError?.("Unable to access microphone.");
      }
    },
    [isRecognitionSupported, isSpeechSynthesisSupported]
  );

  const stopRecording = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
  }, []);

  return {
    speak,
    stopSpeech,
    activeSpeechId,
    speechStatus,
    isSpeaking: (id) => (id ? activeSpeechId === id && speechStatus === "speaking" : speechStatus === "speaking"),
    isPaused: (id) => (id ? activeSpeechId === id && speechStatus === "paused" : speechStatus === "paused"),
    isSpeechSynthesisSupported,
    isRecognitionSupported,
    isRecording,
    startRecording,
    stopRecording,
  };
}
