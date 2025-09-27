import React, { useState, useRef, useEffect } from "react";
import { Send, User } from "lucide-react";
import { connectWS } from "../webSockect";

export default function ChatApp() {
  const [userName, setUserName] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  console.log("messages", messages);

  const sockect = useRef();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    sockect.current = connectWS();

    sockect.current.on("connect", () => {
      sockect.current.on("roomNotice", (userName) => {
        console.log(`${userName} is join the group.....`);
      });
    });

    sockect.current.on("chatMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });
  }, []);

  const handleUserNameSubmit = () => {
    if (userName.trim()) {
      setIsLoggedIn(true);
    }
    sockect.current.emit("joinRoom", userName);
  };

  const handleMessageSubmit = () => {
    if (newMessage.trim()) {
      const message = {
        id: Date.now(),
        text: newMessage,
        sender: userName,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages([...messages, message]);
      sockect.current.emit("chatMessage", message);
      setNewMessage("");
    }
  };

  const handleUserNameKeyPress = (e) => {
    if (e.key === "Enter") {
      handleUserNameSubmit();
    }
  };

  const handleMessageKeyPress = (e) => {
    if (e.key === "Enter") {
      handleMessageSubmit();
    }
  };

  // Username entry screen
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="bg-blue-100 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
              <User className="w-10 h-10 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Welcome to Chat
            </h1>
            <p className="text-gray-600">Enter your name to start chatting</p>
          </div>

          <div className="space-y-6">
            <div>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                onKeyPress={handleUserNameKeyPress}
                placeholder="Enter your name"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-lg"
                autoFocus
              />
            </div>
            <button
              onClick={handleUserNameSubmit}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 text-lg"
            >
              Start Chatting
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main chat interface
  return (
    <div className="h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 rounded-full p-2">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-800">Chat Room</h2>
              <p className="text-sm text-gray-600">Logged in as {userName}</p>
            </div>
          </div>
          <button
            onClick={() => {
              setIsLoggedIn(false);
              setMessages([]);
              setUserName("");
            }}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-20">
            <p className="text-lg">No messages yet</p>
            <p className="text-sm">Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => {
            const isOwnMessage = message.sender === userName;

            return (
              <div
                key={message.id}
                className={`flex ${
                  isOwnMessage ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm ${
                    isOwnMessage
                      ? "bg-blue-600 text-white rounded-br-md"
                      : "bg-white text-gray-700 border border-gray-100 rounded-bl-md"
                  }`}
                >
                  {!isOwnMessage && (
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="bg-gray-300 rounded-full p-1 flex-shrink-0">
                        <User className="w-3 h-3 text-gray-600" />
                      </div>
                      <span className="font-semibold text-xs text-gray-600">
                        {message.sender}
                      </span>
                    </div>
                  )}

                  <p className="text-sm leading-relaxed">{message.text}</p>

                  <div
                    className={`mt-2 text-xs ${
                      isOwnMessage ? "text-blue-100" : "text-gray-500"
                    }`}
                  >
                    {message.timestamp}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex items-center space-x-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleMessageKeyPress}
            placeholder="Type your message..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:border-blue-500 focus:outline-none"
          />
          <button
            onClick={handleMessageSubmit}
            disabled={!newMessage.trim()}
            className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
