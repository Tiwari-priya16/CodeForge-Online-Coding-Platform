import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import ReactMarkdown from "react-markdown";
import axiosClient from "../utils/axiosClient";
import { Send, Bot, User, Loader2 } from 'lucide-react';

function ChatAi({ problem }) {
    const [messages, setMessages] = useState([
        {
            role: 'model',
            parts: [{ text: `Hello! I'm your AI DSA Tutor. I can help you with hints, edge cases, or code reviews for **${problem?.title || 'this problem'}**. How can I assist you?` }]
        }
    ]);
    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    const onSubmit = async (data) => {
        const userPrompt = data.message.trim();
        if (!userPrompt) return;

        const userMsg = { role: 'user', parts: [{ text: userPrompt }] };
        const updatedMessages = [...messages, userMsg];

        setMessages(updatedMessages);
        reset();
        setLoading(true);

        try {
            const response = await axiosClient.post("/ai/chat", {
                messages: updatedMessages,
                title: problem?.title,
                description: problem?.description,
                testCases: problem?.visibleTestCases,
                startCode: problem?.startCode
            });

            setMessages(prev => [
                ...prev,
                { role: 'model', parts: [{ text: response.data.message || "I couldn't generate a response. Please try again." }] }
            ]);
        } catch (error) {
            console.error("API Error:", error);
            setMessages(prev => [
                ...prev,
                { role: 'model', parts: [{ text: "⚠️ Network error or AI service busy. Please try again." }] }
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full max-h-[78vh] bg-base-100 rounded-xl overflow-hidden border border-base-200">
            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs leading-relaxed select-text">
                {messages.map((msg, index) => (
                    <div 
                        key={index} 
                        className={`flex gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                    >
                        {/* Avatar */}
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === "user" ? "bg-primary text-primary-content" : "bg-neutral text-neutral-content"}`}>
                            {msg.role === "user" ? <User size={14} /> : <Bot size={14} />}
                        </div>

                        {/* Bubble */}
                        <div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 ${msg.role === "user" ? "bg-primary text-primary-content font-medium rounded-tr-none" : "bg-base-200 text-base-content rounded-tl-none border border-base-300"}`}>
                            <ReactMarkdown
                                components={{
                                    p: ({ node, ...props }) => <p className="mb-1.5 last:mb-0" {...props} />,
                                    strong: ({ node, ...props }) => <strong className="font-bold text-primary" {...props} />,
                                    code: ({ node, ...props }) => <code className="bg-base-300 px-1.5 py-0.5 rounded font-mono text-[11px]" {...props} />,
                                    ul: ({ node, ...props }) => <ul className="list-disc list-inside my-1 space-y-1" {...props} />,
                                    ol: ({ node, ...props }) => <ol className="list-decimal list-inside my-1 space-y-1" {...props} />
                                }}
                            >
                                {msg.parts[0].text}
                            </ReactMarkdown>
                        </div>
                    </div>
                ))}

                {/* AI Thinking Indicator */}
                {loading && (
                    <div className="flex gap-2.5 items-center text-xs text-base-content/60 italic">
                        <div className="w-7 h-7 rounded-full bg-neutral text-neutral-content flex items-center justify-center">
                            <Bot size={14} />
                        </div>
                        <div className="flex items-center gap-1.5 bg-base-200 px-3 py-2 rounded-2xl border border-base-300">
                            <Loader2 size={13} className="animate-spin text-primary" />
                            <span>Thinking & analyzing problem...</span>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Sticky Form Bar */}
            <form
                onSubmit={handleSubmit(onSubmit)} 
                className="p-3 bg-base-200/80 border-t border-base-300 flex items-center gap-2"
            >
                <input
                    placeholder="Ask for a hint, code review, or approach..."
                    className="input input-sm input-bordered flex-1 bg-base-100 rounded-lg text-xs"
                    autoComplete="off"
                    {...register("message", { required: true, minLength: 1 })}
                />
                <button
                    type="submit"
                    className="btn btn-sm btn-primary gap-1"
                    disabled={loading || errors.message}
                >
                    {loading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                </button>
            </form>
        </div>
    );
}

export default ChatAi;
