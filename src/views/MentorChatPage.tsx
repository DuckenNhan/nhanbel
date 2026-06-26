import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Send,
  User,
  CheckCircle,
  Phone,
  Video,
  MoreVertical,
  Home,
  MapPin
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { formatCurrency } from '../utils/helpers';

interface MentorChatPageProps {
  onBack?: () => void;
}

interface Message {
  id: string;
  text: string;
  sender: 'mentor' | 'user';
  timestamp: Date;
}

interface PropertyContext {
  id: string;
  name: string;
  address: string;
  price: number;
}

interface LocationState {
  propertyContext?: PropertyContext;
}

const MentorChatPage: React.FC<MentorChatPageProps> = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [propertyContext, setPropertyContext] = useState<PropertyContext | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const mentorInfo = {
    name: 'Mentor Hoàng Cường',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100',
    status: 'Đang hoạt động',
    specialty: 'Tư vấn phòng trọ tại TP.HCM'
  };

  useEffect(() => {
    // Check for property context from navigation state
    const state = location.state as LocationState | undefined;
    if (state?.propertyContext) {
      setPropertyContext(state.propertyContext);

      // Add initial messages with property context
      const initialMessages: Message[] = [
        {
          id: '1',
          text: 'Chào bạn! Mình là Mentor hỗ trợ tìm trọ an toàn tại khu vực Sài Gòn (TP.HCM). Mình có thể giúp bạn kiểm tra thông tin chủ nhà và lọc ra các khu trọ an ninh nhất.',
          sender: 'mentor',
          timestamp: new Date(Date.now() - 60000 * 5)
        },
        {
          id: '2',
          text: 'Bạn đang ưu tiên tìm trọ ở quận nào và mức tài chính khoảng bao nhiêu để mình tư vấn nhé?',
          sender: 'mentor',
          timestamp: new Date(Date.now() - 60000 * 4)
        }
      ];

      // Add user's contextual message
      const userMessage: Message = {
        id: '3',
        text: `Chào Mentor, mình muốn tư vấn thêm về phòng trọ tại ${state.propertyContext.address}. Phòng này có an ninh và đúng giá không ạ?`,
        sender: 'user',
        timestamp: new Date(Date.now() - 60000 * 3)
      };

      // Add mentor's response
      const mentorResponse: Message = {
        id: '4',
        text: `Chào bạn, mình đã nhận được thông tin. Phòng tại ${state.propertyContext.address} này đã được quét 3D xác thực. Bạn muốn hỏi thêm về giờ giấc hay điện nước?`,
        sender: 'mentor',
        timestamp: new Date(Date.now() - 60000 * 2)
      };

      setMessages([...initialMessages, userMessage, mentorResponse]);
    } else {
      // Standard initial messages without property context
      setMessages([
        {
          id: '1',
          text: 'Chào bạn! Mình là Mentor hỗ trợ tìm trọ an toàn tại khu vực Sài Gòn (TP.HCM). Mình có thể giúp bạn kiểm tra thông tin chủ nhà và lọc ra các khu trọ an ninh nhất.',
          sender: 'mentor',
          timestamp: new Date(Date.now() - 60000 * 5)
        },
        {
          id: '2',
          text: 'Bạn đang ưu tiên tìm trọ ở quận nào và mức tài chính khoảng bao nhiêu để mình tư vấn nhé?',
          sender: 'mentor',
          timestamp: new Date(Date.now() - 60000 * 4)
        }
      ]);
    }
  }, [location.state]);

  useEffect(() => {
    // Auto scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  const generateMentorResponse = (userMessage: string): string => {
    const responses = [
      'Cảm ơn thông tin của bạn, mình đang check dữ liệu phòng phù hợp và sẽ gửi cho bạn ngay nhé!',
      'Ok, để mình tìm xem khu vực đó có phòng nào tốt không. Khoảng vài phút nữa mình trả lời nhé!',
      'Rất tốt! Khu vực này có nhiều phòng trọ an ninh. Mình sẽ lọc ra những phòng có chủ trọ uy tín và gửi bạn ngay.',
      'Mình hiểu rồi. Với mức giá đó, bạn có thể tìm được phòng khá tốt ở khu vực này. Để mình tư vấn chi tiết hơn...',
      'Đã nhận thông tin! Mình đang kết nối với chủ trọ ở khu vực bạn quan tâm. Chờ mình xíu nhé!'
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedText = inputText.trim();
    if (!trimmedText) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: trimmedText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');

    // Simulate mentor typing and response
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);

      const mentorResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateMentorResponse(trimmedText),
        sender: 'mentor',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, mentorResponse]);
    }, 1500 + Math.random() * 1000);
  };

  const handleCallClick = () => {
    showToast('Tính năng gọi điện sẽ sớm được cập nhật!', 'info');
  };

  const handleVideoClick = () => {
    showToast('Tính năng video call sẽ sớm được cập nhật!', 'info');
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-16 z-30 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <div className="flex items-center gap-4">
            {/* Back button */}
            <button
              onClick={handleBack}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </button>

            {/* Mentor info */}
            <div className="flex items-center gap-3 flex-1">
              <div className="relative">
                <img
                  src={mentorInfo.avatar}
                  alt={mentorInfo.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-blue-600"
                />
                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white" />
              </div>
              <div>
                <h1 className="font-semibold text-slate-900">{mentorInfo.name}</h1>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm text-green-600">{mentorInfo.status}</span>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-1">
              <button
                onClick={handleCallClick}
                className="p-2.5 hover:bg-blue-50 rounded-lg transition-colors text-slate-600 hover:text-blue-600"
              >
                <Phone className="w-5 h-5" />
              </button>
              <button
                onClick={handleVideoClick}
                className="p-2.5 hover:bg-blue-50 rounded-lg transition-colors text-slate-600 hover:text-blue-600"
              >
                <Video className="w-5 h-5" />
              </button>
              <button className="p-2.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-600">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 py-6">
          {/* Property Context Card */}
          {propertyContext && (
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
                  <Home className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-blue-600 font-medium mb-1">Bạn đang hỏi về phòng trọ này:</p>
                  <h3 className="font-semibold text-slate-900 mb-1">{propertyContext.name}</h3>
                  <p className="text-sm text-slate-600 flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {propertyContext.address}
                  </p>
                  <p className="text-blue-600 font-semibold mt-2">
                    {formatCurrency(propertyContext.price)}/tháng
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Mentor info card */}
          <div className="bg-white rounded-2xl p-4 mb-6 shadow-sm border border-slate-100">
            <div className="flex items-center gap-4">
              <img
                src={mentorInfo.avatar}
                alt={mentorInfo.name}
                className="w-16 h-16 rounded-xl object-cover"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="font-semibold text-slate-900">{mentorInfo.name}</h2>
                  <span className="flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                    <CheckCircle className="w-3 h-3" />
                    Đã xác thực
                  </span>
                </div>
                <p className="text-sm text-slate-500">{mentorInfo.specialty}</p>
                <p className="text-xs text-slate-400 mt-1">Thành viên từ 2024 • 4.9 sao (128 đánh giá)</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.sender === 'mentor' && (
                  <img
                    src={mentorInfo.avatar}
                    alt={mentorInfo.name}
                    className="w-8 h-8 rounded-full object-cover mr-2 flex-shrink-0"
                  />
                )}
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-md'
                      : 'bg-white text-slate-800 rounded-bl-md shadow-sm border border-slate-100'
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
                  <p
                    className={`text-xs mt-1.5 ${
                      message.sender === 'user' ? 'text-blue-200' : 'text-slate-400'
                    }`}
                  >
                    {formatTime(message.timestamp)}
                  </p>
                </div>
                {message.sender === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center ml-2 flex-shrink-0">
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex items-start gap-2">
                <img
                  src={mentorInfo.avatar}
                  alt={mentorInfo.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="bg-white rounded-2xl rounded-bl-md px-4 py-3 shadow-sm border border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                    <span className="text-sm text-slate-500">Mentor đang gõ...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>
      </main>

      {/* Input Area */}
      <footer className="bg-white border-t border-slate-200 sticky bottom-0">
        <form onSubmit={handleSendMessage} className="max-w-3xl mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Nhập tin nhắn..."
              className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-600 transition-all"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className={`p-3 rounded-xl transition-all ${
                inputText.trim()
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/25'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
      </footer>
    </div>
  );
};

export default MentorChatPage;
