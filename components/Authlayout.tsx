"use client";

import { useEffect, useState, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { usePathname, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import PlanSelectionModal from "@/components/PlanSelectionModal";
import FooterWrapper from "@/components/shared/FooterWrapper";
import { Phone, PhoneOff, Mic, MicOff, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function AuthLayout({ 
  children,
  initialUserId,
  initialUserName,
  initialUserRole
}: { 
  children: React.ReactNode;
  initialUserId?: string | null;
  initialUserName?: string;
  initialUserRole?: string;
}) {
  const { isLoaded, isSignedIn, user } = useUser();
  const [userId, setUserId] = useState<string | null>(initialUserId || null);
  const [userName, setUserName] = useState<string>(initialUserName || "");
  const [userRole, setUserRole] = useState<string>(initialUserRole || "User");
  const [userTier, setUserTier] = useState<"freemium" | "premium" | "pro" | null>(null);
  const [showPrompt, setShowPrompt] = useState<boolean>(false);

  const [isSubdomain, setIsSubdomain] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const hostname = window.location.hostname;
      if (hostname.startsWith("docs.") || hostname.startsWith("resume.") || hostname.startsWith("games.")) {
        setIsSubdomain(true);
      }
    }
  }, []);

  const pathname = usePathname();
  const router = useRouter();
  const hideNavbar =
    (pathname.startsWith("/interview/") && pathname !== "/interview") ||
    pathname.startsWith("/user") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/onboarding") ||
    pathname.startsWith("/blogs") ||
    pathname.startsWith("/blog") ||
    pathname.startsWith("/documentation") ||
    pathname.startsWith("/games") ||
    [
      "/",
      "/sign-in",
      "/sign-up",
      "/forgot-password",
      "/verify-code",
      "/reset-password",
      "/about",
      "/contact",
    ].includes(pathname);

  const shouldShowNavbar = (!hideNavbar || (pathname === "/" && userId)) && !isSubdomain;

  // --- Call States ---
  const [activeCallDoc, setActiveCallDoc] = useState<any>(null);
  const [callTimer, setCallTimer] = useState(0);
  const [micMuted, setMicMuted] = useState(false);
  const [webRtcConnected, setWebRtcConnected] = useState(false);

  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteAudioRef = useRef<HTMLAudioElement | null>(null);
  const ringtoneRef = useRef<{ stop: () => void } | null>(null);
  const timerIntervalRef = useRef<any>(null);
  const webrtcCleanupRef = useRef<{ close: () => void } | null>(null);

  const isGivingInterview = pathname.startsWith("/interview/") && pathname !== "/interview";

  // --- 1. Sound Synthesis for Call Ringtones ---
  const startRingtone = (isIncoming: boolean) => {
    if (typeof window === "undefined") return null;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return null;
      const ctx = new AudioContextClass();
      
      const playTone = () => {
        try {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          
          if (isIncoming) {
            // Incoming chime melody
            osc.type = "sine";
            osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
            osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.15); // E5
            osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.3); // G5
            gain.gain.setValueAtTime(0.08, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + 1.2);
          } else {
            // Outgoing dialtone (440Hz + 480Hz)
            const osc2 = ctx.createOscillator();
            osc2.connect(gain);
            osc.type = "sine";
            osc.frequency.setValueAtTime(440, ctx.currentTime);
            osc2.type = "sine";
            osc2.frequency.setValueAtTime(480, ctx.currentTime);
            
            gain.gain.setValueAtTime(0.03, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + 1.5);
            osc2.start(ctx.currentTime);
            osc2.stop(ctx.currentTime + 1.5);
          }
        } catch (e) {
          console.error(e);
        }
      };

      playTone();
      const interval = setInterval(playTone, isIncoming ? 2000 : 3500);
      return {
        stop: () => {
          clearInterval(interval);
          ctx.close().catch(() => {});
        }
      };
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  // --- 2. Presence Heartbeat Effect ---
  useEffect(() => {
    if (!userId || !userName) return;

    const updateStatus = async (status: string) => {
      try {
        const { doc, setDoc, serverTimestamp } = await import("firebase/firestore");
        const { db } = await import("@/firebase/client");
        const userRef = doc(db, "users", userId);
        await setDoc(userRef, {
          lastActive: serverTimestamp(),
          status: status
        }, { merge: true });
      } catch (err) {
        console.error("Presence update error:", err);
      }
    };

    const status = isGivingInterview ? "interview" : "online";
    updateStatus(status);

    const interval = setInterval(() => {
      const status = isGivingInterview ? "interview" : "online";
      updateStatus(status);
    }, 6000);

    const handleVisibility = () => {
      if (document.visibilityState === "hidden") {
        updateStatus("offline");
      } else {
        const status = isGivingInterview ? "interview" : "online";
        updateStatus(status);
      }
    };

    const handleUnload = () => {
      updateStatus("offline");
    };

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("beforeunload", handleUnload);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, [userId, userName, isGivingInterview]);

  // --- 3. Call Listener Effect ---
  useEffect(() => {
    if (!userId || !userName) return;

    let unsubCaller: any;
    let unsubReceiver: any;

    const setupListeners = async () => {
      const { collection, query, where, onSnapshot } = await import("firebase/firestore");
      const { db } = await import("@/firebase/client");

      // Listen for outgoing calls placed by me
      const qCaller = query(
        collection(db, "calls"),
        where("caller", "==", userName)
      );

      unsubCaller = onSnapshot(qCaller, (snap) => {
        const active = snap.docs
          .map(d => ({ id: d.id, ...d.data() as any }))
          .find(c => c.status === "ringing" || c.status === "connected");
        if (active) {
          setActiveCallDoc(active);
        } else {
          // If no active call, verify if we had one and it just closed
          setActiveCallDoc((prev: any) => {
            if (prev && prev.caller === userName) return null;
            return prev;
          });
        }
      }, (err) => {
        console.error("Caller listener error:", err);
      });

      // Listen for incoming calls placed to me
      const qReceiver = query(
        collection(db, "calls"),
        where("receiver", "==", userName)
      );

      unsubReceiver = onSnapshot(qReceiver, (snap) => {
        const active = snap.docs
          .map(d => ({ id: d.id, ...d.data() as any }))
          .find(c => c.status === "ringing" || c.status === "connected");
        if (active) {
          setActiveCallDoc(active);
        } else {
          setActiveCallDoc((prev: any) => {
            if (prev && prev.receiver === userName) return null;
            return prev;
          });
        }
      }, (err) => {
        console.error("Receiver listener error:", err);
      });
    };

    setupListeners();

    return () => {
      if (unsubCaller) unsubCaller();
      if (unsubReceiver) unsubReceiver();
    };
  }, [userId, userName]);

  // --- 4. Call Handling & WebRTC Effect ---
  useEffect(() => {
    if (!activeCallDoc) {
      // Clean up WebRTC and ringtones
      if (webrtcCleanupRef.current) {
        webrtcCleanupRef.current.close();
        webrtcCleanupRef.current = null;
      }
      if (ringtoneRef.current) {
        ringtoneRef.current.stop();
        ringtoneRef.current = null;
      }
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
      setCallTimer(0);
      setWebRtcConnected(false);
      setMicMuted(false);
      return;
    }

    const { status, caller, receiver } = activeCallDoc;
    const isCaller = caller === userName;

    // Handle Ringing Tone
    if (status === "ringing") {
      if (!ringtoneRef.current) {
        ringtoneRef.current = startRingtone(!isCaller);
      }
    } else {
      if (ringtoneRef.current) {
        ringtoneRef.current.stop();
        ringtoneRef.current = null;
      }
    }

    // Handle Connection & WebRTC
    if (status === "connected") {
      setCallTimer(1);
      if (!timerIntervalRef.current) {
        timerIntervalRef.current = setInterval(() => {
          setCallTimer(prev => prev + 1);
        }, 1000);
      }

      if (!webrtcCleanupRef.current) {
        const initWebRTC = async () => {
          try {
            const { doc, updateDoc, onSnapshot, collection, addDoc } = await import("firebase/firestore");
            const { db } = await import("@/firebase/client");

            const configuration = {
              iceServers: [
                { urls: "stun:stun.l.google.com:19302" },
                { urls: "stun:stun1.l.google.com:19302" }
              ]
            };

            const peerConnection = new RTCPeerConnection(configuration);
            peerConnectionRef.current = peerConnection;

            peerConnection.onconnectionstatechange = () => {
              if (peerConnection.connectionState === "connected") {
                setWebRtcConnected(true);
              }
            };

            // Mic acquisition
            try {
              const localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
              localStreamRef.current = localStream;
              localStream.getTracks().forEach(t => peerConnection.addTrack(t, localStream));
            } catch (e) {
              console.error("Microphone acquire error:", e);
              toast.error("Could not access microphone.");
            }

            // Handle remote track playing
            peerConnection.ontrack = (event) => {
              if (event.streams && event.streams[0] && remoteAudioRef.current) {
                remoteAudioRef.current.srcObject = event.streams[0];
              }
            };

            // Exchange candidates
            peerConnection.onicecandidate = (event) => {
              if (event.candidate) {
                const candCol = collection(db, "calls", activeCallDoc.id, isCaller ? "callerCandidates" : "receiverCandidates");
                addDoc(candCol, event.candidate.toJSON());
              }
            };

            const callDocRef = doc(db, "calls", activeCallDoc.id);
            let unsubCall: any;
            let unsubCandidates: any;

            if (isCaller) {
              const offer = await peerConnection.createOffer();
              await peerConnection.setLocalDescription(offer);
              await updateDoc(callDocRef, { offer: { sdp: offer.sdp, type: offer.type } });

              unsubCall = onSnapshot(callDocRef, async (snap) => {
                const data = snap.data();
                if (data?.answer && !peerConnection.currentRemoteDescription) {
                  await peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
                }
              }, (err) => {
                console.error("WebRTC call doc listener error:", err);
              });

              const candCol = collection(db, "calls", activeCallDoc.id, "receiverCandidates");
              unsubCandidates = onSnapshot(candCol, (snap) => {
                snap.docChanges().forEach(async (change) => {
                  if (change.type === "added") {
                    try {
                      await peerConnection.addIceCandidate(new RTCIceCandidate(change.doc.data()));
                    } catch (e) { console.error(e); }
                  }
                });
              }, (err) => {
                console.error("WebRTC receiver candidate listener error:", err);
              });
            } else {
              unsubCall = onSnapshot(callDocRef, async (snap) => {
                const data = snap.data();
                if (data?.offer && !peerConnection.currentRemoteDescription) {
                  await peerConnection.setRemoteDescription(new RTCSessionDescription(data.offer));
                  const answer = await peerConnection.createAnswer();
                  await peerConnection.setLocalDescription(answer);
                  await updateDoc(callDocRef, { answer: { sdp: answer.sdp, type: answer.type } });
                }
              }, (err) => {
                console.error("WebRTC call doc listener error:", err);
              });

              const candCol = collection(db, "calls", activeCallDoc.id, "callerCandidates");
              unsubCandidates = onSnapshot(candCol, (snap) => {
                snap.docChanges().forEach(async (change) => {
                  if (change.type === "added") {
                    try {
                      await peerConnection.addIceCandidate(new RTCIceCandidate(change.doc.data()));
                    } catch (e) { console.error(e); }
                  }
                });
              }, (err) => {
                console.error("WebRTC caller candidate listener error:", err);
              });
            }

            webrtcCleanupRef.current = {
              close: () => {
                if (unsubCall) unsubCall();
                if (unsubCandidates) unsubCandidates();
                peerConnection.close();
                if (localStreamRef.current) {
                  localStreamRef.current.getTracks().forEach(t => t.stop());
                  localStreamRef.current = null;
                }
              }
            };
          } catch (err) {
            console.error("Failed to initialize WebRTC calling:", err);
          }
        };

        initWebRTC();
      }
    }
  }, [activeCallDoc, userName]);

  // --- 5. Call Interaction Handlers ---
  const handleAcceptCall = async () => {
    if (!activeCallDoc) return;
    try {
      const { doc, updateDoc } = await import("firebase/firestore");
      const { db } = await import("@/firebase/client");
      const callRef = doc(db, "calls", activeCallDoc.id);
      await updateDoc(callRef, { status: "connected" });
      toast.success("Call connected");
    } catch (e) {
      console.error(e);
      toast.error("Failed to accept call");
    }
  };

  const handleDeclineOrHangup = async () => {
    if (!activeCallDoc) return;
    try {
      const { doc, updateDoc } = await import("firebase/firestore");
      const { db } = await import("@/firebase/client");
      const callRef = doc(db, "calls", activeCallDoc.id);
      await updateDoc(callRef, { status: "ended" });
      setActiveCallDoc(null);
      toast.info("Call ended");
    } catch (e) {
      console.error(e);
      toast.error("Failed to end call");
    }
  };

  const handleToggleMute = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach(track => {
        track.enabled = micMuted;
      });
      setMicMuted(!micMuted);
    }
  };

  const formatTimer = (s: number) => {
    const min = Math.floor(s / 60).toString().padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${min}:${sec}`;
  };

  useEffect(() => {
    if (!isLoaded) return;

    if (isSignedIn && user) {
      setUserId(user.id);
      
      const fetchProfile = async () => {
        try {
          const { getUserProfile } = await import("@/lib/actions/auth.action");
          const result = await getUserProfile(user.id);

          if (result && result.success) {
            setUserName(result.name || user.fullName || user.firstName || "User");
            setUserRole(result.role || "User");
            const tier = result.tier;
            setUserTier(tier as any);
            
            const isPaymentPage = 
              pathname.startsWith("/payment/success") || 
              pathname.startsWith("/payment/cancel") || 
              pathname.startsWith("/api/payment");

            if (!isPaymentPage) {
              const isPremiumUser = tier === "premium" || tier === "pro";
              if (isPremiumUser) {
                localStorage.setItem(`seen_premium_modal_${user.id}`, "true");
                setShowPrompt(false);
              } else {
                const lastPromptTimeStr = localStorage.getItem(`plan_prompt_time_${user.id}`);
                if (!lastPromptTimeStr) {
                  setShowPrompt(true);
                } else {
                  const lastPromptTime = parseInt(lastPromptTimeStr, 10);
                  const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
                  if (Date.now() - lastPromptTime > thirtyDaysInMs) {
                    setShowPrompt(true);
                  }
                }
              }
            }
          } else {
            setUserName(user.fullName || user.firstName || "User");
            setUserRole("User");
          }
        } catch (error) {
          console.error("Failed to fetch user profile:", error);
          setUserName(user.fullName || user.firstName || "User");
          setUserRole("User");
        }
      };

      fetchProfile();
    } else {
      if (!initialUserId) {
        setUserId(null);
        setUserName("");
        setUserRole("User");
        setUserTier(null);
        setShowPrompt(false);
      }
    }
  }, [isLoaded, isSignedIn, user, initialUserId, pathname]);

  return (
    <>
      {shouldShowNavbar && (
        <Navbar userId={userId!} userName={userName || "User"} userRole={userRole} />
      )}
      {children}
      <FooterWrapper />
      {showPrompt && userId && !isSubdomain && (
        <PlanSelectionModal
          userId={userId}
          userTier={userTier}
          onCompleted={() => {
            localStorage.setItem(`plan_prompt_time_${userId}`, Date.now().toString());
            if (userTier === "premium" || userTier === "pro") {
              localStorage.setItem(`seen_premium_modal_${userId}`, "true");
            }
            setShowPrompt(false);
          }}
        />
      )}

      {/* Hidden audio element for remote stream */}
      <audio ref={remoteAudioRef} autoPlay playsInline className="hidden" />

      {/* Global Call Overlay (Floating Card at Bottom Right) */}
      {activeCallDoc && (
        <div className="fixed bottom-6 right-6 z-[9999] bg-zinc-950/85 backdrop-blur-xl border border-zinc-800 rounded-3xl p-6 shadow-2xl flex flex-col items-center gap-4 w-72 text-white transition-all font-mono">
          {/* Pulsing visual indicator */}
          <div className="relative size-16 flex items-center justify-center bg-zinc-900 border border-zinc-800 rounded-full">
            {activeCallDoc.status === "ringing" ? (
              <span className="absolute inset-0 rounded-full bg-emerald-500/10 border border-emerald-500/25 animate-ping" />
            ) : null}
            <span className="text-2xl">🎙️</span>
          </div>

          <div className="text-center">
            <h4 className="text-sm font-bold uppercase tracking-wider">
              {activeCallDoc.caller === userName ? activeCallDoc.receiver : activeCallDoc.caller}
            </h4>
            <p className="text-[10px] text-zinc-500 uppercase mt-1">
              {activeCallDoc.status === "ringing" ? (
                activeCallDoc.caller === userName ? "Calling..." : "Incoming Call..."
              ) : (
                `Connected • ${formatTimer(callTimer)}`
              )}
            </p>
          </div>

          {activeCallDoc.status === "connected" && !webRtcConnected && (
            <div className="flex items-center gap-1.5 text-[9px] text-zinc-500">
              <Loader2 className="size-3 animate-spin text-emerald-500" /> Connecting audio stream...
            </div>
          )}

          <div className="flex items-center justify-center gap-4 w-full">
            {activeCallDoc.status === "ringing" && activeCallDoc.receiver === userName ? (
              <>
                <button
                  onClick={handleAcceptCall}
                  className="size-11 rounded-full bg-emerald-600 hover:bg-emerald-500 border border-emerald-700 flex items-center justify-center text-white cursor-pointer transition-all shadow-md shadow-emerald-950/40"
                >
                  <Phone className="size-5" />
                </button>
                <button
                  onClick={handleDeclineOrHangup}
                  className="size-11 rounded-full bg-red-600 hover:bg-red-500 border border-red-700 flex items-center justify-center text-white cursor-pointer transition-all shadow-md shadow-red-950/40"
                >
                  <PhoneOff className="size-5" />
                </button>
              </>
            ) : (
              <>
                {activeCallDoc.status === "connected" && (
                  <button
                    onClick={handleToggleMute}
                    className={`size-10 rounded-full border flex items-center justify-center cursor-pointer transition-all ${
                      micMuted ? "bg-zinc-800 border-zinc-700 text-red-400" : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white"
                    }`}
                  >
                    {micMuted ? <MicOff className="size-4" /> : <Mic className="size-4" />}
                  </button>
                )}
                <button
                  onClick={handleDeclineOrHangup}
                  className="size-10 rounded-full bg-red-600 hover:bg-red-500 border border-red-700 flex items-center justify-center text-white cursor-pointer transition-all shadow-md shadow-red-950/40"
                >
                  <PhoneOff className="size-4" />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
