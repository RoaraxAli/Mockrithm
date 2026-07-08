"use client"

import { useState, useEffect, useRef } from "react"
import { getCurrentUser } from "@/lib/actions/auth.action"
import { useUser } from "@clerk/nextjs"
import { Mic, MicOff, Volume2, VolumeX, MessageSquare, Sparkles, RefreshCw, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import MagicRings from "@/components/MagicRings"

export default function MicCheckPage() {
  const { isLoaded, user } = useUser()
  
  // STT Engine State
  const [selectedStt, setSelectedStt] = useState<"browser" | "whisper-v3" | "whisper-turbo">("whisper-turbo");
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("selectedStt");
      if (saved === "browser" || saved === "whisper-v3" || saved === "whisper-turbo") {
        setSelectedStt(saved);
      }
    }
  }, []);

  const handleSttChange = (val: "browser" | "whisper-v3" | "whisper-turbo") => {
    setSelectedStt(val);
    if (typeof window !== "undefined") {
      localStorage.setItem("selectedStt", val);
    }
  };

  // Audio state
  const [isActive, setIsActive] = useState(false)
  const [isLoopback, setIsLoopback] = useState(false)
  const [volume, setVolume] = useState(0)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  
  // Speech recognition state
  const [transcript, setTranscript] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [useSimulation, setUseSimulation] = useState(false)

  // Audio nodes refs
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null)
  const loopbackRef = useRef<AudioDestinationNode | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const rafRef = useRef<number | null>(null)

  // Speech Recognition ref
  const recognitionRef = useRef<any>(null)

  // Simulation interval ref
  const simulationIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopAudioCheck()
      stopSimulation()
    };
  }, [])

  // Handle loopback toggle
  useEffect(() => {
    if (!isActive || !audioContextRef.current || !sourceRef.current) return;
    
    if (isLoopback) {
      // Connect source to speakers
      sourceRef.current.connect(audioContextRef.current.destination)
    } else {
      // Disconnect source from speakers, but keep connected to analyser
      try {
        sourceRef.current.disconnect(audioContextRef.current.destination)
      } catch (e) {
        // Safe catch if not connected
      }
    }
  }, [isLoopback, isActive])

  // Start Audio Check and Visualizer
  const startAudioCheck = async () => {
    setErrorMsg(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream

      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
      const audioContext = new AudioContextClass()
      audioContextRef.current = audioContext

      const analyser = audioContext.createAnalyser()
      analyser.fftSize = 256
      analyserRef.current = analyser

      const source = audioContext.createMediaStreamSource(stream)
      sourceRef.current = source
      source.connect(analyser)

      if (isLoopback) {
        source.connect(audioContext.destination)
      }

      setIsActive(true)

      // Start volume meter animation loop
      const bufferLength = analyser.frequencyBinCount
      const dataArray = new Uint8Array(bufferLength)

      const updateVolume = () => {
        if (!analyserRef.current) return
        analyserRef.current.getByteFrequencyData(dataArray)
        
        // Calculate average volume level
        let total = 0
        for (let i = 0; i < bufferLength; i++) {
          total += dataArray[i]
        }
        const average = total / bufferLength
        
        // Map average volume to percentage (max value typically around 180-200)
        const percent = Math.min(100, Math.round((average / 140) * 100))
        setVolume(percent)
        
        rafRef.current = requestAnimationFrame(updateVolume)
      }
      updateVolume()

      // Start Speech Recognition
      startSpeechRecognition()

    } catch (err: any) {
      console.error("Audio check permission denied or error:", err)
      setErrorMsg("Unable to access microphone. Please verify site permissions in your browser.")
    }
  }

  // Stop Audio Check
  const stopAudioCheck = () => {
    setIsActive(false)
    setVolume(0)
    
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }

    if (recognitionRef.current) {
      recognitionRef.current.stop()
      recognitionRef.current = null
    }
    setIsListening(false)

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }

    if (sourceRef.current) {
      sourceRef.current.disconnect()
      sourceRef.current = null
    }

    if (audioContextRef.current) {
      audioContextRef.current.close()
      audioContextRef.current = null
    }
  }

  // Start Speech Recognition
  const startSpeechRecognition = () => {
    const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognitionClass) {
      setUseSimulation(true)
      return
    }

    try {
      const recognition = new SpeechRecognitionClass()
      recognition.continuous = true
      recognition.interimResults = true
      recognition.lang = "en-US"

      recognition.onstart = () => {
        setIsListening(true)
      }

      recognition.onresult = (event: any) => {
        let finalTranscript = ""
        let interimTranscript = ""
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript
          } else {
            interimTranscript += event.results[i][0].transcript
          }
        }
        if (finalTranscript || interimTranscript) {
          setTranscript((prev) => {
            const current = finalTranscript + interimTranscript
            if (prev.endsWith(current) || current.startsWith(prev)) {
              return current
            }
            return prev + " " + current
          })
        }
      }

      recognition.onerror = (event: any) => {
        console.warn("Speech recognition error:", event.error)
        if (event.error === "not-allowed") {
          setUseSimulation(true)
        }
      }

      recognition.onend = () => {
        setIsListening(false)
      }

      recognitionRef.current = recognition
      recognition.start()

    } catch (e) {
      console.error("Failed to start speech recognition:", e)
      setUseSimulation(true)
    }
  }

  // Simulate Speech to Text Fallback
  const startMockSimulation = () => {
    stopSimulation()
    setTranscript("")
    setIsListening(true)

    const mockPhrases = [
      "Hello, testing audio pipeline.",
      "Checking latency, response looks good.",
      "I am preparing for a Software Engineering Interview.",
      "Using the STAR method to structure my answer.",
      "Pacing is currently 130 words per minute, which is optimal.",
      "Mockrithm AI is listening and scoring my response."
    ]

    let phraseIndex = 0
    let charIndex = 0
    let currentText = ""

    const typeChar = () => {
      if (phraseIndex >= mockPhrases.length) {
        stopSimulation()
        return
      }

      const phrase = mockPhrases[phraseIndex]
      if (charIndex < phrase.length) {
        currentText += phrase[charIndex]
        setTranscript(currentText)
        charIndex++
        
        // Simulating volume pulses when speaking
        setVolume(Math.floor(Math.random() * 40) + 30)
        
        simulationIntervalRef.current = setTimeout(typeChar, Math.floor(Math.random() * 80) + 40)
      } else {
        // Pause between phrases
        phraseIndex++
        charIndex = 0
        currentText += " "
        setVolume(0)
        simulationIntervalRef.current = setTimeout(typeChar, 1500)
      }
    }

    typeChar()
  }

  const stopSimulation = () => {
    if (simulationIntervalRef.current) {
      clearTimeout(simulationIntervalRef.current)
      simulationIntervalRef.current = null
    }
    setIsListening(false)
    setVolume(0)
  }

  const resetTranscript = () => {
    setTranscript("")
  }

  return (
    <div className="w-full flex flex-col font-mona-sans relative z-10 gap-8 animate-fadeIn">
      
      {/* Header section */}
      <div className="flex flex-col gap-2">
        <span className="w-fit text-[9px] font-black tracking-widest uppercase text-purple-400 bg-purple-950/20 px-3 py-1 rounded-full border border-purple-900/30">
          Hardware Diagnosis
        </span>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white uppercase">
          Mic Check & Audio Setup
        </h1>
        <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
          Verify your microphone latency, loopback levels, and speech-to-text clarity.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch mt-2">
        
        {/* Left Side: Level visualizer and MagicRings container */}
        <div className="flex flex-col gap-6 items-center w-full">
          
          <div 
            className="w-full aspect-[4/3] min-h-[300px] max-h-[360px] md:h-[400px] relative border border-zinc-900 bg-zinc-950/40 rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between p-5 sm:p-8"
          >
            {/* Background Magic Rings */}
            <div className="absolute inset-0 z-0 opacity-60">
              <MagicRings
                color="#A855F7"
                colorTwo="#6366F1"
                ringCount={6}
                speed={1}
                attenuation={10}
                lineThickness={2}
                baseRadius={0.35}
                radiusStep={0.1}
                scaleRate={0.1}
                opacity={1}
                blur={0}
                noiseAmount={0.1}
                rotation={0}
                ringGap={1.5}
                fadeIn={0.7}
                fadeOut={0.5}
                followMouse={false}
                mouseInfluence={0.2}
                hoverScale={1.2}
                parallax={0.05}
                clickBurst={false}
              />
            </div>

            {/* Controls overlay */}
            <div className="relative z-10 w-full flex justify-between items-start">
              <div className="flex flex-col">
                <span className="text-[10px] font-mono font-bold tracking-widest text-zinc-500 uppercase">Input Level</span>
                <span className="text-lg font-mono font-black text-white">{volume}%</span>
              </div>
              
              <div className="flex items-center gap-2 bg-zinc-900/60 border border-zinc-800/80 rounded-full px-3 py-1.5 backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isActive ? "bg-purple-500" : "bg-zinc-600"}`} />
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${isActive ? "bg-purple-500" : "bg-zinc-600"}`} />
                </span>
                <span className="text-[9px] font-bold tracking-widest text-zinc-350 uppercase font-mono">
                  {isActive ? "Streaming" : "Standby"}
                </span>
              </div>
            </div>

            {/* Central Circle Button Indicator */}
            <div className="relative z-10 mx-auto my-auto flex flex-col items-center gap-4">
              <button
                onClick={isActive ? stopAudioCheck : startAudioCheck}
                className={`size-28 rounded-full border flex items-center justify-center transition-all duration-500 shadow-2xl relative group cursor-pointer ${
                  isActive 
                    ? "bg-purple-500/10 border-purple-500/50 shadow-purple-500/20 hover:bg-purple-500/20" 
                    : "bg-zinc-900/40 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/80"
                }`}
              >
                {/* Pulse rings */}
                {isActive && (
                  <>
                    <span className="absolute inset-0 rounded-full border border-purple-500/30 animate-ping-slow" />
                    <span className="absolute -inset-4 rounded-full border border-purple-500/10" />
                  </>
                )}
                {isActive ? (
                  <Mic className="size-10 text-purple-400 group-hover:scale-105 transition-transform" />
                ) : (
                  <MicOff className="size-10 text-zinc-500 group-hover:scale-105 transition-transform" />
                )}
              </button>
              
              <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-zinc-400">
                {isActive ? "Click to stop mic test" : "Click to check audio"}
              </span>
            </div>

            {/* Bottom Level Meter */}
            <div className="relative z-10 w-full flex flex-col gap-2">
              <div className="w-full h-2.5 bg-zinc-950/80 border border-zinc-900 rounded-full overflow-hidden p-[2px]">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-75 shadow-[0_0_10px_rgba(168,85,247,0.5)]"
                  style={{ width: `${volume}%` }}
                />
              </div>
              <div className="flex justify-between text-[7.5px] font-mono font-bold text-zinc-650 uppercase tracking-widest px-1">
                <span>0dB</span>
                <span>Normal Range</span>
                <span>Peak</span>
              </div>
            </div>

          </div>

          {errorMsg && (
            <div className="w-full max-w-full p-4 border border-red-950 bg-red-950/20 rounded-2xl text-xs text-red-400 text-center font-semibold">
              {errorMsg}
            </div>
          )}

          {/* Discord-style Loopback Toggle Switch Card */}
          <div className="w-full max-w-full p-6 backdrop-blur-xl bg-zinc-950/30 border border-zinc-900 rounded-2xl flex items-center justify-between gap-6">
            <div className="flex flex-col gap-1.5 flex-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-white flex items-center gap-1.5">
                {isLoopback ? <Volume2 className="size-4 text-purple-400" /> : <VolumeX className="size-4 text-zinc-500" />}
                Hear Myself Loopback
              </span>
              <p className="text-[10.5px] text-zinc-450 leading-relaxed font-semibold">
                Directly route microphone input back into your headphones to verify voice echo, clarify vocal tones, and evaluate connection delays.
              </p>
            </div>

            <button
              onClick={() => setIsLoopback(!isLoopback)}
              disabled={!isActive}
              className={`w-12 h-6.5 rounded-full p-1 cursor-pointer transition-all duration-300 flex items-center border ${
                isLoopback 
                  ? "bg-purple-600 border-purple-500 justify-end" 
                  : "bg-zinc-900 border-zinc-800 justify-start disabled:opacity-40 disabled:cursor-not-allowed"
              }`}
            >
              <span className="size-4.5 rounded-full bg-white shadow-md" />
            </button>
          </div>

        </div>

        {/* Right Side: Speech to text card */}
        <div className="flex flex-col w-full">
          
          <div className="w-full h-full p-5 sm:p-6 backdrop-blur-xl bg-zinc-950/30 border border-zinc-900 rounded-3xl flex flex-col justify-between gap-6 min-h-[360px] md:min-h-[400px]">
            
            {/* Header info */}
            <div className="flex items-center justify-between border-b border-zinc-900 pb-4 gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <MessageSquare className="size-4.5 text-indigo-400" />
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-200 block leading-tight">Transcription test</span>
                  <span className="text-[8.5px] font-mono font-bold uppercase tracking-wider text-zinc-500">Speech Engine Settings</span>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="flex flex-col gap-0.5">
                  <label className="text-[7.5px] font-mono font-bold uppercase tracking-wider text-zinc-550">Engine select</label>
                  <select
                    value={selectedStt}
                    onChange={(e) => handleSttChange(e.target.value as any)}
                    className="bg-zinc-900 border border-zinc-800 text-[9px] text-zinc-300 rounded px-2 py-0.5 font-mono font-bold outline-none focus:border-zinc-700 cursor-pointer"
                  >
                    <option value="whisper-turbo">Whisper Turbo</option>
                    <option value="whisper-v3">Whisper V3</option>
                    <option value="browser">Web Speech</option>
                  </select>
                </div>

                {isListening && (
                  <span className="text-[8.5px] font-bold text-indigo-400 animate-pulse font-mono uppercase">
                    Listening...
                  </span>
                )}
              </div>
            </div>

            {/* Transcript screen */}
            <div className="flex-1 w-full bg-black/40 border border-zinc-900/60 rounded-2xl p-5 overflow-y-auto min-h-[180px] max-h-[240px] relative group">
              {transcript ? (
                <p className="text-xs text-zinc-300 leading-relaxed font-semibold font-mono animate-fadeIn whitespace-pre-wrap">
                  {transcript}
                </p>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 gap-2">
                  <Sparkles className="size-6 text-zinc-700 animate-pulse" />
                  <p className="text-[10.5px] text-zinc-500 font-bold uppercase tracking-wider">
                    {isActive 
                      ? "Start speaking to test transcription pipeline" 
                      : "Start audio check to begin speech test"
                    }
                  </p>
                </div>
              )}
            </div>

            {/* Controls bottom */}
            <div className="flex items-center justify-between border-t border-zinc-900 pt-4 gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={resetTranscript}
                disabled={!transcript}
                className="border-zinc-800 hover:border-zinc-700 bg-zinc-950/40 text-zinc-400 hover:text-white font-bold text-[9px] uppercase tracking-wider h-9 px-4 rounded-xl cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <RefreshCw className="size-3 mr-1.5" /> Clear logs
              </Button>

              {useSimulation && !isActive && (
                <Button
                  size="sm"
                  onClick={isListening ? stopSimulation : startMockSimulation}
                  className="bg-indigo-600 hover:bg-indigo-500 border border-indigo-500 hover:border-indigo-400 text-white font-extrabold text-[9px] uppercase tracking-widest h-9 px-5 rounded-xl cursor-pointer flex items-center gap-1.5 shadow-[0_0_15px_rgba(99,102,241,0.2)]"
                >
                  <Play className="size-3 fill-white" />
                  {isListening ? "Stop Sim" : "Simulate speech"}
                </Button>
              )}
            </div>

          </div>

        </div>

      </div>

    </div>
  )
}
