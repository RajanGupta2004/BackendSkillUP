import { useEffect, useRef, useState } from "react";
import {
  Send,
  Phone,
  Video,
  MoreVertical,
  Paperclip,
  Smile,
  Mic,
  Search,
  Users,
  Plus,
  X,
  UserPlus,
} from "lucide-react";
import { connectWS } from "../webSockect";

export default function WhatsAppInterface() {
  const sockect = useRef();
  const [selectedChat, setSelectedChat] = useState(0);
  const [newMessage, setNewMessage] = useState("");
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);

  const [messages, setMessages] = useState({
    0: [
      {
        id: 1,
        text: "Hey! How are you doing?",
        sent: false,
        time: "10:30 AM",
        status: "read",
        sender: "Sarah Johnson",
      },
      {
        id: 2,
        text: "I'm doing great! Just finished my morning workout 💪",
        sent: true,
        time: "10:32 AM",
        status: "read",
      },
      {
        id: 3,
        text: "That's awesome! What kind of workout did you do?",
        sent: false,
        time: "10:33 AM",
        status: "read",
        sender: "Sarah Johnson",
      },
      {
        id: 4,
        text: "Just some cardio and weight training. Feeling energized!",
        sent: true,
        time: "10:35 AM",
        status: "delivered",
      },
    ],
    1: [
      {
        id: 1,
        text: "Don't forget about the meeting tomorrow",
        sent: false,
        time: "9:15 AM",
        status: "read",
        sender: "Mike Wilson",
      },
      {
        id: 2,
        text: "Thanks for the reminder! What time again?",
        sent: true,
        time: "9:20 AM",
        status: "read",
      },
      {
        id: 3,
        text: "10 AM sharp. Conference room B",
        sent: false,
        time: "9:21 AM",
        status: "read",
        sender: "Mike Wilson",
      },
    ],
    2: [
      {
        id: 1,
        text: "Pizza tonight? 🍕",
        sent: false,
        time: "7:45 PM",
        status: "read",
        sender: "Emma Davis",
      },
      {
        id: 2,
        text: "Always yes to pizza! Where should we order from?",
        sent: true,
        time: "7:46 PM",
        status: "read",
      },
    ],
    3: [
      {
        id: 1,
        text: "Welcome to Team Alpha! 🎉",
        sent: false,
        time: "Yesterday",
        status: "read",
        sender: "Admin",
        isSystem: true,
      },
      {
        id: 2,
        text: "Great job everyone on the project!",
        sent: false,
        time: "Yesterday",
        status: "read",
        sender: "John Smith",
      },
      {
        id: 3,
        text: "Thanks John! Couldn't have done it without the team",
        sent: false,
        time: "Yesterday",
        status: "read",
        sender: "Lisa Chen",
      },
      {
        id: 4,
        text: "Agreed! Amazing teamwork 👏",
        sent: true,
        time: "Yesterday",
        status: "read",
      },
    ],
    4: [
      {
        id: 1,
        text: "Hey family! How's everyone doing?",
        sent: false,
        time: "2 hours ago",
        status: "read",
        sender: "Mom",
      },
      {
        id: 2,
        text: "All good here! Just got back from school",
        sent: false,
        time: "2 hours ago",
        status: "read",
        sender: "Alex",
      },
      {
        id: 3,
        text: "Busy day at work but good! Miss you all ❤️",
        sent: true,
        time: "1 hour ago",
        status: "read",
      },
      {
        id: 4,
        text: "We should plan a family dinner soon",
        sent: false,
        time: "1 hour ago",
        status: "read",
        sender: "Dad",
      },
    ],
  });

  const availableUsers = [
    {
      id: "user1",
      name: "Sarah Johnson",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b332c144?w=50&h=50&fit=crop&crop=face",
    },
    {
      id: "user2",
      name: "Mike Wilson",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face",
    },
    {
      id: "user3",
      name: "Emma Davis",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face",
    },
    {
      id: "user4",
      name: "John Smith",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face",
    },
    {
      id: "user5",
      name: "Lisa Chen",
      avatar:
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=50&h=50&fit=crop&crop=face",
    },
    {
      id: "user6",
      name: "Alex Johnson",
      avatar:
        "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=50&h=50&fit=crop&crop=face",
    },
  ];

  const [contacts, setContacts] = useState([
    {
      id: 0,
      name: "Sarah Johnson",
      lastMessage: "Just some cardio and weight training. Feeling energized!",
      time: "10:35 AM",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b332c144?w=50&h=50&fit=crop&crop=face",
      online: true,
      unread: 0,
      type: "individual",
    },
    {
      id: 1,
      name: "Mike Wilson",
      lastMessage: "10 AM sharp. Conference room B",
      time: "9:21 AM",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face",
      online: false,
      unread: 0,
      type: "individual",
    },
    {
      id: 2,
      name: "Emma Davis",
      lastMessage: "Always yes to pizza! Where should we order from?",
      time: "7:46 PM",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face",
      online: true,
      unread: 2,
      type: "individual",
    },
    {
      id: 3,
      name: "Team Alpha",
      lastMessage: "Agreed! Amazing teamwork 👏",
      time: "Yesterday",
      avatar:
        "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=50&h=50&fit=crop&crop=face",
      online: false,
      unread: 0,
      type: "group",
      members: [
        {
          name: "John Smith",
          avatar:
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face",
        },
        {
          name: "Lisa Chen",
          avatar:
            "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=50&h=50&fit=crop&crop=face",
        },
        {
          name: "You",
          avatar:
            "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50&h=50&fit=crop&crop=face",
        },
      ],
      memberCount: 3,
    },
    {
      id: 4,
      name: "Family Group",
      lastMessage: "We should plan a family dinner soon",
      time: "1 hour ago",
      avatar:
        "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=50&h=50&fit=crop&crop=face",
      online: false,
      unread: 1,
      type: "group",
      members: [
        {
          name: "Mom",
          avatar:
            "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=50&h=50&fit=crop&crop=face",
        },
        {
          name: "Dad",
          avatar:
            "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=50&h=50&fit=crop&crop=face",
        },
        {
          name: "Alex",
          avatar:
            "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=50&h=50&fit=crop&crop=face",
        },
        {
          name: "You",
          avatar:
            "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50&h=50&fit=crop&crop=face",
        },
      ],
      memberCount: 4,
    },
  ]);

  const sendMessage = () => {
    if (newMessage.trim()) {
      const newMsg = {
        id: Date.now(),
        text: newMessage,
        sent: true,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        status: "sent",
      };

      setMessages((prev) => ({
        ...prev,
        [selectedChat]: [...(prev[selectedChat] || []), newMsg],
      }));

      // Update last message in contacts
      setContacts((prev) =>
        prev.map((contact) =>
          contact.id === selectedChat
            ? { ...contact, lastMessage: newMessage, time: newMsg.time }
            : contact
        )
      );

      setNewMessage("");
    }
  };

  const createGroup = () => {
    if (newGroupName.trim() && selectedMembers.length > 0) {
      const newGroup = {
        id: contacts.length,
        name: newGroupName,
        lastMessage: "Group created",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        avatar:
          "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=50&h=50&fit=crop&crop=face",
        online: false,
        unread: 0,
        type: "group",
        members: selectedMembers.map((id) =>
          availableUsers.find((user) => user.id === id)
        ),
        memberCount: selectedMembers.length + 1, // +1 for current user
      };

      setContacts((prev) => [...prev, newGroup]);
      setMessages((prev) => ({
        ...prev,
        [newGroup.id]: [
          {
            id: 1,
            text: `Group "${newGroupName}" created`,
            sent: false,
            time: newGroup.time,
            status: "read",
            sender: "System",
            isSystem: true,
          },
        ],
      }));

      setShowGroupModal(false);
      setNewGroupName("");
      setSelectedMembers([]);
      setSelectedChat(newGroup.id);
    }
  };

  const toggleMemberSelection = (userId) => {
    setSelectedMembers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  useEffect(() => {
    sockect.current = connectWS();

    sockect.current.on("connect", () => {
      sockect.current.emit("joinRoom", "Rajan");
    });
  }, []);

  const currentContact = contacts[selectedChat];
  const currentMessages = messages[selectedChat] || [];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-1/3 bg-white border-r border-gray-300 flex flex-col">
        {/* Header */}
        <div className="bg-gray-200 p-4 flex items-center justify-between border-b border-gray-300">
          <div className="flex items-center space-x-3">
            <img
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop&crop=face"
              alt="Profile"
              className="w-10 h-10 rounded-full"
            />
            <h1 className="text-lg font-semibold text-gray-800">Chats</h1>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowGroupModal(true)}
              className="p-2 hover:bg-gray-300 rounded-full"
              title="New Group"
            >
              <Users className="w-5 h-5 text-gray-600" />
            </button>
            <MoreVertical className="w-5 h-5 text-gray-600 cursor-pointer" />
          </div>
        </div>

        {/* Search */}
        <div className="p-3 bg-gray-50 border-b border-gray-200">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-gray-500" />
            <input
              type="text"
              placeholder="Search or start new chat"
              className="w-full pl-10 pr-3 py-2 bg-white rounded-lg border border-gray-300 focus:outline-none focus:border-green-500"
            />
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              onClick={() => setSelectedChat(contact.id)}
              className={`flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 ${
                selectedChat === contact.id
                  ? "bg-green-50 border-green-200"
                  : ""
              }`}
            >
              <div className="relative">
                <img
                  src={contact.avatar}
                  alt={contact.name}
                  className="w-12 h-12 rounded-full"
                />
                {contact.type === "group" && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-600 rounded-full flex items-center justify-center">
                    <Users className="w-2.5 h-2.5 text-white" />
                  </div>
                )}
                {contact.type === "individual" && contact.online && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>
              <div className="ml-3 flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {contact.name}
                  </h3>
                  <span className="text-xs text-gray-500">{contact.time}</span>
                </div>
                <div className="flex items-center">
                  <p className="text-sm text-gray-600 truncate flex-1">
                    {contact.lastMessage}
                  </p>
                  {contact.type === "group" && (
                    <span className="text-xs text-gray-500 ml-1">
                      ({contact.memberCount})
                    </span>
                  )}
                </div>
              </div>
              {contact.unread > 0 && (
                <div className="ml-2 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {contact.unread}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-gray-200 p-4 flex items-center justify-between border-b border-gray-300">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <img
                src={currentContact.avatar}
                alt={currentContact.name}
                className="w-10 h-10 rounded-full"
              />
              {currentContact.type === "group" && (
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-600 rounded-full flex items-center justify-center">
                  <Users className="w-2.5 h-2.5 text-white" />
                </div>
              )}
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">
                {currentContact.name}
              </h2>
              <p className="text-sm text-gray-600">
                {currentContact.type === "group"
                  ? `${currentContact.memberCount} members`
                  : currentContact.online
                  ? "Online"
                  : "Last seen recently"}
              </p>
            </div>
          </div>
          <div className="flex space-x-4">
            <Video className="w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-800" />
            <Phone className="w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-800" />
            {currentContact.type === "group" && (
              <button
                onClick={() => setShowMembersModal(true)}
                className="p-1 hover:bg-gray-300 rounded"
              >
                <Users className="w-5 h-5 text-gray-600" />
              </button>
            )}
            <MoreVertical className="w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-800" />
          </div>
        </div>

        {/* Messages */}
        <div
          className="flex-1 overflow-y-auto p-4 bg-gray-50"
          style={{
            backgroundImage:
              'url(\'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="%23000" opacity="0.02"/><circle cx="75" cy="75" r="1" fill="%23000" opacity="0.02"/><circle cx="50" cy="10" r="0.5" fill="%23000" opacity="0.01"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>\')',
          }}
        >
          <div className="space-y-3">
            {currentMessages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sent ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.isSystem
                      ? "bg-yellow-100 text-yellow-800 text-center text-sm mx-auto"
                      : message.sent
                      ? "bg-green-500 text-white rounded-br-none"
                      : "bg-white text-gray-900 rounded-bl-none shadow-sm"
                  }`}
                >
                  {!message.sent &&
                    !message.isSystem &&
                    currentContact.type === "group" && (
                      <p className="text-xs font-semibold text-green-600 mb-1">
                        {message.sender}
                      </p>
                    )}
                  <p className="text-sm">{message.text}</p>
                  <div
                    className={`flex items-center justify-end mt-1 space-x-1 ${
                      message.isSystem
                        ? "text-yellow-600"
                        : message.sent
                        ? "text-green-100"
                        : "text-gray-500"
                    }`}
                  >
                    <span className="text-xs">{message.time}</span>
                    {message.sent && !message.isSystem && (
                      <div className="flex">
                        <div
                          className={`w-3 h-3 ${
                            message.status === "read"
                              ? "text-blue-300"
                              : "text-green-200"
                          }`}
                        >
                          <svg viewBox="0 0 16 15" fill="currentColor">
                            <path d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.87a.32.32 0 0 1-.484.033l-.358-.325a.319.319 0 0 0-.484.032l-.378.483a.418.418 0 0 0 .036.541l1.32 1.266c.143.14.361.125.484-.033l6.272-8.048a.366.366 0 0 0-.064-.512zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.87a.32.32 0 0 1-.484.033L1.891 7.769a.319.319 0 0 0-.484.032l-.378.483a.418.418 0 0 0 .036.541l3.132 3.006c.143.14.361.125.484-.033l5.272-6.048a.366.366 0 0 0-.064-.512z" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Message Input */}
        <div className="bg-gray-100 p-4 border-t border-gray-300">
          <div className="flex items-center space-x-2">
            <Paperclip className="w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-800" />
            <div className="flex-1 relative">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                placeholder={`Message ${
                  currentContact.type === "group"
                    ? currentContact.name
                    : currentContact.name
                }`}
                className="w-full px-4 py-2 pr-10 rounded-full border border-gray-300 focus:outline-none focus:border-green-500"
              />
              <Smile className="w-5 h-5 absolute right-3 top-2.5 text-gray-600 cursor-pointer hover:text-gray-800" />
            </div>
            {newMessage.trim() ? (
              <Send
                onClick={sendMessage}
                className="w-5 h-5 text-green-600 cursor-pointer hover:text-green-700"
              />
            ) : (
              <Mic className="w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-800" />
            )}
          </div>
        </div>
      </div>

      {/* New Group Modal */}
      {showGroupModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-h-96 overflow-hidden">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">New Group</h3>
              <button onClick={() => setShowGroupModal(false)}>
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <input
              type="text"
              placeholder="Group name"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-green-500"
            />

            <h4 className="text-sm font-medium text-gray-700 mb-3">
              Add members:
            </h4>
            <div className="max-h-40 overflow-y-auto space-y-2">
              {availableUsers.map((user) => (
                <div
                  key={user.id}
                  onClick={() => toggleMemberSelection(user.id)}
                  className={`flex items-center p-2 rounded cursor-pointer ${
                    selectedMembers.includes(user.id)
                      ? "bg-green-100"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 rounded-full mr-3"
                  />
                  <span className="text-sm">{user.name}</span>
                  {selectedMembers.includes(user.id) && (
                    <div className="ml-auto w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-end space-x-3 mt-4">
              <button
                onClick={() => setShowGroupModal(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
              >
                Cancel
              </button>
              <button
                onClick={createGroup}
                disabled={!newGroupName.trim() || selectedMembers.length === 0}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Group
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Group Members Modal */}
      {showMembersModal && currentContact.type === "group" && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">{currentContact.name}</h3>
              <button onClick={() => setShowMembersModal(false)}>
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="text-center mb-4">
              <img
                src={currentContact.avatar}
                alt={currentContact.name}
                className="w-20 h-20 rounded-full mx-auto mb-2"
              />
              <p className="text-sm text-gray-600">
                {currentContact.memberCount} members
              </p>
            </div>

            <div className="space-y-3">
              {currentContact.members?.map((member, index) => (
                <div key={index} className="flex items-center p-2">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <div className="flex-1">
                    <p className="font-medium">{member.name}</p>
                    {member.name === "You" && (
                      <p className="text-sm text-gray-500">You</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center mt-4">
              <button
                onClick={() => setShowMembersModal(false)}
                className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
