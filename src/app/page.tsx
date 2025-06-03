'use client';

import { useEffect, useState } from 'react';
import socket from '@/lib/socket';

export default function Home() {
  const [connected, setConnected] = useState(false);
  const [started, setStarted] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    socket.on('partnerFound', () => {
      console.log('🎉 Partner found!');
      setConnected(true);
      setMessages(['Partner connected']);
    });

    socket.on('message', (msg: string) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on('partnerLeft', () => {
      setConnected(false);
      setMessages((prev) => [...prev, 'Partner disconnected']);
    });

    return () => {
      socket.off('partnerFound');
      socket.off('message');
      socket.off('partnerLeft');
    };
  }, []);

  const startChat = () => {
    socket.connect();
    console.log('Starting chat...');
    setStarted(true);
  };

  const stopChat = () => {
    socket.disconnect();
    setStarted(false);
    setConnected(false);
    setMessages([]);
    console.log('Chat stopped.');
  };

  const sendMessage = () => {
    if (input.trim()) {
      socket.emit('message', input);
      setMessages((prev) => [...prev, `You: ${input}`]);
      setInput('');
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-tr from-purple-100 to-white p-6 flex flex-col items-center justify-start">
      <header className="w-full flex justify-between items-center max-w-4xl mx-auto mb-6">
        <h1 className="text-3xl font-bold text-purple-700">💬 Ramble</h1>
        <div className="space-x-3">
          {!started && (
            <button
              onClick={startChat}
              className="px-5 py-2 bg-purple-600 text-white rounded-lg shadow-md hover:bg-purple-700 transition"
            >
              Start Chat
            </button>
          )}
          {started && (
            <button
              onClick={stopChat}
              className="px-5 py-2 bg-gray-300 text-gray-800 rounded-lg shadow-md hover:bg-gray-400 transition"
            >
              Stop Chat
            </button>
          )}
        </div>
      </header>

      <section className="text-center mb-10">
        <h2 className="text-4xl font-semibold text-gray-800 mb-2">
          Talk to strangers, instantly.
        </h2>
        <p className="text-gray-600">Anonymous. Real-time. Refreshing.</p>
      </section>

      {started && (
        <>
          <div className="w-full max-w-2xl bg-white border rounded-xl p-6 shadow-inner h-64 overflow-y-auto mb-4">
            {messages.map((msg, idx) => (
              <div key={idx} className="mb-1 text-gray-800">
                {msg}
              </div>
            ))}
          </div>

          <div className="flex space-x-2 max-w-2xl w-full">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-grow border rounded-lg px-4 py-2"
              disabled={!connected}
              placeholder={connected ? 'Type your message…' : 'Waiting for partner...'}
            />
            <button
              onClick={sendMessage}
              disabled={!connected}
              className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition"
            >
              Send
            </button>
          </div>
        </>
      )}
    </main>
  );
}
