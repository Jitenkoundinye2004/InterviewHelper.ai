import React, { useState, useRef, useEffect } from "react";
import { User, Bot, Mic, MicOff, StopCircle, ArrowUp, Volume2, VolumeX } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ChatInterface = ({ conversation, onSendMessage, isSending, isEnding }) => {
    const [input, setInput] = useState("");
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [voiceParams, setVoiceParams] = useState(null);

    const messagesEndRef = useRef(null);
    const recognitionRef = useRef(null);
    const synthRef = useRef(window.speechSynthesis);
    const lastSpokenIndexRef = useRef(-1);
    const silenceTimerRef = useRef(null);
    const currentTranscriptRef = useRef("");

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [conversation, isListening]);

    // Initialize TTS voice
    useEffect(() => {
        const loadVoices = () => {
            const voices = synthRef.current.getVoices();
            // Prefer a natural sounding English voice
            const preferredVoice = voices.find(v => v.lang.includes('en') && (v.name.includes('Google') || v.name.includes('Samantha'))) || voices[0];
            setVoiceParams(preferredVoice);
        };

        loadVoices();
        if (speechSynthesis.onvoiceschanged !== undefined) {
            speechSynthesis.onvoiceschanged = loadVoices;
        }

        return () => {
            synthRef.current.cancel();
        };
    }, []);

    // Text to Speech for new AI messages
    useEffect(() => {
        if (conversation.length === 0 || !voiceParams) return;
        
        const lastIndex = conversation.length - 1;
        const lastMessage = conversation[lastIndex];
        
        // Speak if it's a new AI message that we haven't spoken yet
        if (lastMessage && 
            lastMessage.role === 'ai' && 
            !isListening && 
            lastSpokenIndexRef.current < lastIndex) {
            speak(lastMessage.content);
            lastSpokenIndexRef.current = lastIndex;
        }
    }, [conversation, isListening, voiceParams]);

    // Better logic for speaking:
    // When conversation length changes, if the new item is AI -> Speak it.
    // ALSO check if the item *before* it (User) has feedback we haven't spoken? 
    // Hard to track "spoken" state without extra props.
    // Let's just speak the LAST message if it's AI. 
    // And if we just added a user message with feedback, we might want to speak that too?
    // The previous implementation splits User answer and AI next question. 
    // The feedback is on the USER object. 
    // Let's modify the useEffect to look at the latest updates. (Simplification: just speak AI text for now as requested "when ai give the ans").

    const speak = (text) => {
        if (!text || !voiceParams) return;

        // Cancel current speech
        synthRef.current.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = voiceParams;
        utterance.rate = 1;
        utterance.pitch = 1;

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);

        synthRef.current.speak(utterance);
    };

    const stopSpeaking = () => {
        synthRef.current.cancel();
        setIsSpeaking(false);
    };

    const startListening = () => {
        stopSpeaking(); // Stop AI from talking if user wants to speak

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert("Your browser does not support voice input. Please use Chrome, Edge or Safari.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = true;
        recognition.continuous = true;

        recognition.onstart = () => setIsListening(true);

        recognition.onresult = (event) => {
            const currentTranscript = Array.from(event.results)
                .map(result => result[0].transcript)
                .join('');
            setInput(currentTranscript);
            currentTranscriptRef.current = currentTranscript;

            // Reset the silence timer every time user speaks
            if (silenceTimerRef.current) {
                clearTimeout(silenceTimerRef.current);
            }

            // Start a new timer - if user is silent for 2.5 seconds, auto-stop
            silenceTimerRef.current = setTimeout(() => {
                if (recognitionRef.current) {
                    recognitionRef.current.stop();
                }
            }, 2500);
        };

        recognition.onerror = (event) => {
            console.error("Speech error", event);
            setIsListening(false);
            if (silenceTimerRef.current) {
                clearTimeout(silenceTimerRef.current);
            }
        };

        recognition.onend = () => {
            setIsListening(false);
            if (silenceTimerRef.current) {
                clearTimeout(silenceTimerRef.current);
            }
            // Auto-send the message when user stops speaking
            const transcript = currentTranscriptRef.current;
            if (transcript.trim()) {
                onSendMessage(transcript);
                setInput("");
                currentTranscriptRef.current = "";
            }
        };

        recognitionRef.current = recognition;
        recognition.start();
    };

    const stopListening = () => {
        if (silenceTimerRef.current) {
            clearTimeout(silenceTimerRef.current);
        }
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
    };

    const toggleListening = () => {
        if (isListening) {
            stopListening();
        } else {
            setInput("");
            currentTranscriptRef.current = "";
            startListening();
        }
    };

    const handleSend = () => {
        if (!input.trim() || isSending) return;
        stopListening();
        stopSpeaking();
        onSendMessage(input);
        setInput("");
    };

    return (
        <div className="flex flex-col h-screen bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden shadow-sm relative">
            {/* Messages Area */}
            <div className={`flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 space-y-6 ${isListening ? 'opacity-50 blur-sm' : ''} transition-all`}>
                <AnimatePresence initial={false}>
                    {conversation.map((msg, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex items-start gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                        >
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === "user" ? "bg-blue-600 text-white" : "bg-emerald-600 text-white"
                                }`}>
                                {msg.role === "user" ? <User size={16} /> : <Bot size={16} />}
                            </div>

                            <div className={`space-y-2 max-w-[85%] sm:max-w-[75%]`}>
                                <div className={`p-4 rounded-2xl text-base leading-relaxed shadow-sm ${msg.role === "user"
                                    ? "bg-blue-600 text-white rounded-tr-none"
                                    : "bg-white text-gray-800 border border-gray-100 rounded-tl-none"
                                    }`}>
                                    <div className="flex justify-between items-start gap-2">
                                        <p className="whitespace-pre-wrap">{msg.content}</p>
                                        {msg.role === 'ai' && (
                                            <button
                                                onClick={() => isSpeaking ? stopSpeaking() : speak(msg.content)}
                                                className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 hover:text-blue-600 transition-colors flex-shrink-0 mt-0.5"
                                                title={isSpeaking ? "Stop Speaking" : "Read Aloud"}
                                            >
                                                {isSpeaking ? <VolumeX size={16} /> : <Volume2 size={16} />}
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {msg.feedback && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        className="text-sm bg-yellow-50 text-gray-800 p-3 rounded-xl border border-yellow-100"
                                    >
                                        <span className="font-semibold text-yellow-700 block mb-1">Feedback ({msg.rating}/10):</span>
                                        {msg.feedback}
                                    </motion.div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {isSending && (
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center flex-shrink-0">
                            <Bot size={16} />
                        </div>
                        <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm flex items-center gap-2">
                            <div className="flex space-x-1">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* AI Speaking Indicator */}
            {isSpeaking && !isListening && (
                <div className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur border border-blue-100 px-4 py-2 rounded-full shadow-lg flex items-center gap-3 animate-pulse">
                    <Volume2 className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">AI is speaking...</span>
                    <button onClick={stopSpeaking} className="p-1 hover:bg-gray-100 rounded-full">
                        <StopCircle className="w-4 h-4 text-gray-500" />
                    </button>
                </div>
            )}

            {/* Central Control Area */}
            <div className="p-6 bg-white border-t border-gray-100 flex flex-col items-center justify-center gap-6 relative z-10 shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.05)]">

                {/* Transcript Preview */}
                <AnimatePresence>
                    {(input || isListening) && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="w-full max-w-2xl text-center"
                        >
                            <p className="text-lg text-gray-700 font-medium leading-relaxed">
                                {input || "Listening..."}
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Main Button */}
                <div className="flex items-center gap-4">
                    {/* Send Button Slot (Fixed width for alignment) */}
                    <div className="w-12 h-12 flex items-center justify-center flex-shrink-0">
                        <AnimatePresence>
                            {input && !isListening && (
                                <motion.button
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0, opacity: 0 }}
                                    onClick={handleSend}
                                    disabled={isSending}
                                    className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all hover:scale-105"
                                    title="Send Answer"
                                >
                                    <ArrowUp className="w-6 h-6" />
                                </motion.button>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Mic Button */}
                    <button
                        onClick={toggleListening}
                        disabled={isSending || isEnding}
                        className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 ${isListening
                            ? "bg-red-500 text-white shadow-xl shadow-red-200 scale-110"
                            : "bg-blue-600 text-white shadow-xl shadow-blue-200 hover:bg-blue-700 hover:scale-105"
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                        {isListening ? (
                            <>
                                <MicOff className="w-10 h-10" />
                                <span className="absolute -inset-2 rounded-full border-2 border-red-500 animate-ping"></span>
                            </>
                        ) : (
                            <Mic className="w-10 h-10" />
                        )}
                    </button>

                    {/* Right Placeholder Slot (Match Left Slot) */}
                    <div className="w-12 h-12 flex-shrink-0" />
                </div>

                <div className="text-base text-gray-500 font-medium">
                    {isListening ? "Tap to stop" : "Tap to speak"}
                </div>

            </div>
        </div>
    );
};

export default ChatInterface;
