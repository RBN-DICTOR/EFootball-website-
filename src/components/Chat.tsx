import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { ChatMessage, Profile } from '../types';

interface ChatProps {
  messages: ChatMessage[];
  profile: Profile;
  onSend: () => void;
}

export default function Chat({ messages, profile, onSend }: ChatProps) {
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!message.trim()) return;

    const { error } = await supabase.from('chat_messages').insert({
      user_id: profile.id,
      message: message.trim(),
    });

    if (!error) {
      setMessage('');
      onSend();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">
          <i className="fas fa-comments"></i>
          Live Chat
        </h2>
      </div>

      <div className="chat-container">
        <div className="chat-messages">
          {messages.map((msg) => (
            <div key={msg.id} className="message">
              <div>
                <span className="message-user">{msg.profile?.username || 'Unknown'}</span>
                <span className="message-time">
                  {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div className="message-text">{msg.message}</div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="chat-input">
          <input
            type="text"
            className="form-input"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
          />
          <button className="btn btn-secondary" onClick={handleSend}>
            <i className="fas fa-paper-plane"></i>
          </button>
        </div>
      </div>
    </div>
  );
}
