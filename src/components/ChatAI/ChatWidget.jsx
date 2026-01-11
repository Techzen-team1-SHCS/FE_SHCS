import { useState, useEffect, useRef } from "react";
import ReactMarkdown from 'react-markdown';
import { Link } from 'react-router-dom';

const ChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Chào bạn 👋 — mình có thể giúp gì?", sender: "bot", isTyping: false, type: "text" }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isBotTyping, setIsBotTyping] = useState(false);
  const chatBodyRef = useRef(null);
  const eventSourceRef = useRef(null);

  // Tự động cuộn xuống tin nhắn mới nhất
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);

  // Hủy kết nối khi component unmount
  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, []);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isBotTyping) return;

    // 🧑‍💻 Thêm tin nhắn của user
    const newUserMessage = {
      id: Date.now(),
      text: inputValue,
      sender: "user",
      isTyping: false,
      type: "text"
    };
    setMessages(prev => [...prev, newUserMessage]);

    const userMessage = inputValue;
    setInputValue("");

    // 🤖 Tạo tin nhắn bot với typing animation
    const botMsgId = Date.now() + 1;
    setMessages(prev => [
      ...prev,
      { id: botMsgId, text: "", sender: "bot", isTyping: true, type: "text" }
    ]);
    setIsBotTyping(true);

    // ⚠️ SSE chỉ hỗ trợ GET → gửi message qua query string
   const url = `${import.meta.env.VITE_API_URL}/auth/chat/stream?message=${encodeURIComponent(userMessage)}`;
    // Đóng kết nối cũ nếu có
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    const eventSource = new EventSource(url);
    eventSourceRef.current = eventSource;

    let isFirstChunk = true;

    // 🔴 Nhận từng chunk realtime
    eventSource.onmessage = (e) => {
      const chunk = e.data;
      
      if (isFirstChunk) {
        // Xóa typing animation khi có dữ liệu đầu tiên
        setMessages(prev =>
          prev.map(msg =>
            msg.id === botMsgId
              ? { ...msg, text: chunk, isTyping: false }
              : msg
          )
        );
        isFirstChunk = false;
      } else {
        // Thêm chunk vào tin nhắn hiện tại
        setMessages(prev =>
          prev.map(msg =>
            msg.id === botMsgId
              ? { ...msg, text: msg.text + chunk }
              : msg
          )
        );
      }
    };

    // ❌ Nếu lỗi hoặc kết thúc → đóng kết nối
    eventSource.onerror = () => {
      eventSource.close();
      setIsBotTyping(false);
      
      // Cập nhật tin nhắn cuối cùng
      setMessages(prev =>
        prev.map(msg =>
          msg.id === botMsgId
            ? { ...msg, isTyping: false }
            : msg
        )
      );
    };
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const sampleQuestions = [
    "Khách sạn ở Đà Nẵng",
    "Khách sạn giá rẻ dưới 1 triệu",
    "Khách sạn 5 sao tốt nhất",
    "Khách sạn có hồ bơi",
    "Gợi ý khách sạn cho gia đình",
    "Khách sạn view biển đẹp"
  ];

  const handleSampleQuestion = (question) => {
    setInputValue(question);
  };

  // Component hiển thị typing animation
  const TypingIndicator = () => (
    <div className="typing-indicator">
      <span className="dot"></span>
      <span className="dot"></span>
      <span className="dot"></span>
    </div>
  );

  // Hàm parse message để tách khách sạn
  const parseHotelCards = (text) => {
    // Tách các khách sạn từ text
    const lines = text.split('\n');
    const hotelCards = [];
    let currentHotel = null;
    let introText = [];

    for (let line of lines) {
      // Phát hiện khách sạn mới (có **Tên KS**)
      if (line.includes('**') && (line.includes('Khách sạn') || line.includes('KS'))) {
        if (currentHotel) {
          hotelCards.push({ ...currentHotel, type: 'hotel' });
        }
        
        // Extract tên khách sạn từ markdown
        const nameMatch = line.match(/\*\*(.*?)\*\*/);
        const name = nameMatch ? nameMatch[1] : line;
        
        currentHotel = {
          name: name.replace('Khách sạn', '').replace('KS', '').trim(),
          description: [],
          details: []
        };
      } 
      // Thông tin khách sạn
      else if (currentHotel) {
        if (line.includes('📍') || line.includes('💰') || line.includes('⭐') || line.includes('✨')) {
          currentHotel.details.push(line);
        } else if (line.trim()) {
          currentHotel.description.push(line);
        }
      }
      // Text thường
      else if (line.trim() && !line.startsWith('###') && !line.startsWith('---')) {
        introText.push(line);
      }
    }

    // Thêm khách sạn cuối
    if (currentHotel) {
      hotelCards.push({ ...currentHotel, type: 'hotel' });
    }

    return {
      intro: introText.join('\n'),
      hotels: hotelCards
    };
  };

  // Tạo ID từ tên khách sạn (giả lập, BE nên trả về hotelId)
  const generateHotelId = (name) => {
    return name.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  // Component Hotel Card
  const HotelCard = ({ hotel }) => {
    const hotelId = generateHotelId(hotel.name);
    
    return (
      <div className="hotel-card">
        <div className="hotel-card-header">
          <div className="hotel-avatar">
            <img src="https://cdn-icons-png.flaticon.com/512/619/619005.png" alt="Hotel" />
          </div>
          <div className="hotel-title">
            <Link to={`/hotel/${hotelId}`} className="hotel-link">
              <h3>{hotel.name}</h3>
            </Link>
            <div className="hotel-actions">
              <button className="btn-view" onClick={() => window.open(`/hotel/${hotelId}`, '_blank')}>
                👁️ Xem
              </button>
              <button className="btn-book" onClick={() => window.open(`/hotel/${hotelId}?tab=booking`, '_blank')}>
                📅 Đặt ngay
              </button>
            </div>
          </div>
        </div>
        
        <div className="hotel-card-content">
          {hotel.details.map((detail, idx) => (
            <div key={idx} className="hotel-detail">
              {detail.includes('📍') && <span className="icon">📍</span>}
              {detail.includes('💰') && <span className="icon">💰</span>}
              {detail.includes('⭐') && <span className="icon">⭐</span>}
              {detail.includes('✨') && <span className="icon">✨</span>}
              <span className="detail-text">{detail}</span>
            </div>
          ))}
          
          {hotel.description.length > 0 && (
            <div className="hotel-description">
              {hotel.description.map((desc, idx) => (
                <p key={idx}>{desc}</p>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Render message theo type
  const renderMessage = (message) => {
    if (message.sender === 'bot' && message.isTyping) {
      return <TypingIndicator />;
    }

    if (message.sender === 'bot' && message.text) {
      const { intro, hotels } = parseHotelCards(message.text);
      
      return (
        <div className="bot-message-content">
          {intro && intro.trim() && (
            <div className="message-intro">
              <ReactMarkdown>{intro}</ReactMarkdown>
            </div>
          )}
          
          {hotels.length > 0 && (
            <div className="hotels-container">
              <h4 className="hotels-title">🏨 Khách sạn đề xuất:</h4>
              <div className="hotels-grid">
                {hotels.map((hotel, idx) => (
                  <HotelCard key={idx} hotel={hotel} />
                ))}
              </div>
            </div>
          )}
          
          {/* Nếu không parse được hotel, hiển thị markdown bình thường */}
          {hotels.length === 0 && intro && (
            <ReactMarkdown>{message.text}</ReactMarkdown>
          )}
        </div>
      );
    }

    // User message
    return message.text;
  };

  return (
    <>
      {/* Nút Chat với hiệu ứng */}
      <div 
        className={`chat-icon ${open ? 'open' : ''}`} 
        onClick={() => setOpen(!open)}
        title="Mở hộp chat"
      >
        <div className="chat-icon-inner">
          <img src="https://cdn-icons-png.flaticon.com/512/4711/4711986.png" alt="AI Assistant" />
        </div>
        <span className="chat-pulse"></span>
      </div>

      {/* Khung Chat */}
      {open && (
        <div className="chat-box">
          <div className="chat-header">
            <div className="chat-header-info">
              <div className="chat-avatar">
                <img src="https://cdn-icons-png.flaticon.com/512/4711/4711986.png" alt="AI Assistant" />
              </div>
              <div className="chat-title">
                <h3>Trợ lý Khách sạn AI</h3>
                <p>{isBotTyping ? 'Đang nhập...' : 'Đang trực tuyến'}</p>
              </div>
            </div>
            <button className="chat-close" onClick={() => setOpen(false)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          <div className="chat-body" ref={chatBodyRef}>
            {/* Lời chào ban đầu */}
            <div className="msg bot welcome">
              <div className="msg-content">
                <div className="msg-text">
                  <strong>🏨 Chào bạn! 👋</strong>
                  <p>Tôi là trợ lý AI chuyên về khách sạn Việt Nam. Tôi có thể giúp bạn tìm khách sạn phù hợp!</p>
                  <p className="hint-text">💡 <strong>Gợi ý:</strong> Hỏi theo địa điểm, giá cả, tiện nghi...</p>
                </div>
                <div className="msg-time">Bây giờ</div>
              </div>
            </div>

            {/* Tin nhắn */}
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`msg ${message.sender} ${message.sender === 'bot' ? 'fade-in' : 'slide-in'}`}
              >
                <div className="msg-content">
                  <div className="msg-text">
                    {renderMessage(message)}
                  </div>
                  <div className="msg-time">
                    {message.sender === 'user' || !message.isTyping ? 
                      new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 
                      'Đang nhập...'}
                  </div>
                </div>
              </div>
            ))}

            {/* Câu hỏi mẫu */}
            <div className="sample-questions">
              <p><strong>💬 Bạn có thể hỏi:</strong></p>
              <div className="questions-container">
                {sampleQuestions.map((question, index) => (
                  <button 
                    key={index} 
                    className="question-chip"
                    onClick={() => handleSampleQuestion(question)}
                    disabled={isBotTyping}
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="chat-footer">
            <div className="input-container">
              <input 
                type="text" 
                placeholder="Nhập câu hỏi về khách sạn..." 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isBotTyping}
              />
              <button 
                className="send-btn" 
                onClick={handleSendMessage}
                disabled={inputValue.trim() === "" || isBotTyping}
              >
                {isBotTyping ? (
                  <div className="sending-dots">
                    <span className="sending-dot"></span>
                    <span className="sending-dot"></span>
                    <span className="sending-dot"></span>
                  </div>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </button>
            </div>
            <p className="chat-hint">
              {isBotTyping ? 'AI đang trả lời...' : 'Nhấn Enter để gửi, Shift+Enter để xuống dòng'}
            </p>
          </div>
        </div>
      )}

      <style jsx>{`
        /* Biến CSS */
        :root {
          --primary-color: #4361ee;
          --primary-light: #4895ef;
          --secondary-color: #3a0ca3;
          --bot-color: #f0f4ff;
          --user-color: #4361ee;
          --text-color: #333;
          --light-text: #6c757d;
          --border-radius: 16px;
          --shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          --card-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          --transition: all 0.3s ease;
        }

        /* Nút Chat */
        .chat-icon {
          position: fixed;
          bottom: 30px;
          right: 30px;
          width: 70px;
          height: 70px;
          background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 8px 25px rgba(67, 97, 238, 0.4);
          z-index: 1000;
          transition: var(--transition);
          overflow: hidden;
        }

        .chat-icon:hover {
          transform: scale(1.1);
          box-shadow: 0 12px 30px rgba(67, 97, 238, 0.5);
        }

        .chat-icon.open {
          transform: rotate(360deg) scale(0.9);
        }

        .chat-icon-inner {
          width: 55px;
          height: 55px;
          background: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 5px;
        }

        .chat-icon-inner img {
          width: 35px;
          height: 35px;
          object-fit: contain;
        }

        .chat-pulse {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: var(--primary-color);
          animation: pulse 2s infinite;
          z-index: -1;
        }

        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 0.8;
          }
          100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }

        /* Khung Chat */
        .chat-box {
          position: fixed;
          bottom: 120px;
          right: 30px;
          width: 420px; /* Rộng hơn để chứa card */
          height: 600px;
          background: white;
          border-radius: var(--border-radius);
          box-shadow: var(--shadow);
          display: flex;
          flex-direction: column;
          z-index: 999;
          overflow: hidden;
          animation: slideUp 0.4s ease-out;
          border: 1px solid rgba(0, 0, 0, 0.05);
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Header */
        .chat-header {
          background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
          color: white;
          padding: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-shrink: 0;
        }

        .chat-header-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .chat-avatar {
          width: 45px;
          height: 45px;
          background: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 5px;
        }

        .chat-avatar img {
          width: 30px;
          height: 30px;
          object-fit: contain;
        }

        .chat-title h3 {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
        }

        .chat-title p {
          margin: 3px 0 0;
          font-size: 13px;
          opacity: 0.9;
        }

        .chat-close {
          background: rgba(255, 255, 255, 0.2);
          border: none;
          color: white;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: var(--transition);
        }

        .chat-close:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: rotate(90deg);
        }

        /* Body */
        .chat-body {
          flex: 1;
          padding: 20px;
          overflow-y: auto;
          background: #f9fafc;
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        /* Tin nhắn */
        .msg {
          max-width: 100%;
          display: flex;
          animation-duration: 0.3s;
          animation-fill-mode: both;
        }

        .msg.bot {
          align-self: flex-start;
          animation-name: fadeInLeft;
        }

        .msg.user {
          align-self: flex-end;
          animation-name: fadeInRight;
          max-width: 80%;
        }

        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .msg-content {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .msg.bot .msg-content {
          align-items: flex-start;
          width: 100%;
        }

        .msg.user .msg-content {
          align-items: flex-end;
        }

        .msg-text {
          padding: 14px 18px;
          border-radius: 20px;
          font-size: 14px;
          line-height: 1.6;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }

        .msg.bot .msg-text {
          background: var(--bot-color);
          color: var(--text-color);
          border-bottom-left-radius: 5px;
          width: 100%;
          padding: 16px;
        }

        .msg.user .msg-text {
          background: var(--user-color);
          color: white;
          border-bottom-right-radius: 5px;
        }

        .msg.welcome .msg-text {
          background: white;
          border: 1px solid #e9ecef;
          box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05);
        }

        .msg.welcome .msg-text p {
          margin: 8px 0 0;
          color: var(--light-text);
          font-weight: normal;
        }

        .msg.welcome .hint-text {
          margin-top: 10px;
          padding: 8px 12px;
          background: #f0f9ff;
          border-radius: 10px;
          border-left: 3px solid var(--primary-color);
        }

        .msg-time {
          font-size: 11px;
          color: var(--light-text);
          padding: 0 5px;
          margin-top: 4px;
        }

        /* Bot Message Content */
        .bot-message-content {
          width: 100%;
        }

        .message-intro {
          margin-bottom: 16px;
          line-height: 1.6;
        }

        .message-intro :global(p) {
          margin: 8px 0;
        }

        /* Hotels Container */
        .hotels-container {
          margin-top: 12px;
        }

        .hotels-title {
          font-size: 15px;
          font-weight: 600;
          color: var(--primary-color);
          margin: 0 0 12px 0;
          padding-bottom: 8px;
          border-bottom: 2px solid var(--bot-color);
        }

        .hotels-grid {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        /* Hotel Card */
        .hotel-card {
          background: white;
          border-radius: 12px;
          box-shadow: var(--card-shadow);
          border: 1px solid #e9ecef;
          overflow: hidden;
          transition: var(--transition);
          margin: 4px 0;
        }

        .hotel-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
          border-color: var(--primary-light);
        }

        .hotel-card-header {
          display: flex;
          align-items: center;
          padding: 14px 16px;
          background: linear-gradient(135deg, #f8f9ff, #ffffff);
          border-bottom: 1px solid #f1f3f9;
        }

        .hotel-avatar {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, var(--primary-light), var(--primary-color));
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 12px;
          flex-shrink: 0;
        }

        .hotel-avatar img {
          width: 22px;
          height: 22px;
          filter: brightness(0) invert(1);
        }

        .hotel-title {
          flex: 1;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .hotel-link {
          text-decoration: none;
          color: var(--secondary-color);
        }

        .hotel-link h3 {
          margin: 0;
          font-size: 16px;
          font-weight: 700;
          transition: var(--transition);
        }

        .hotel-link:hover h3 {
          color: var(--primary-color);
          text-decoration: underline;
        }

        .hotel-actions {
          display: flex;
          gap: 8px;
        }

        .btn-view, .btn-book {
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          transition: var(--transition);
          border: none;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .btn-view {
          background: #f0f4ff;
          color: var(--primary-color);
          border: 1px solid var(--primary-light);
        }

        .btn-view:hover {
          background: var(--primary-light);
          color: white;
        }

        .btn-book {
          background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
          color: white;
        }

        .btn-book:hover {
          transform: scale(1.05);
          box-shadow: 0 4px 12px rgba(67, 97, 238, 0.3);
        }

        /* Hotel Card Content */
        .hotel-card-content {
          padding: 16px;
        }

        .hotel-detail {
          display: flex;
          align-items: flex-start;
          margin-bottom: 8px;
          font-size: 13px;
          line-height: 1.5;
        }

        .icon {
          margin-right: 8px;
          font-size: 14px;
          flex-shrink: 0;
          margin-top: 1px;
        }

        .detail-text {
          flex: 1;
          color: var(--text-color);
        }

        .hotel-description {
          margin-top: 12px;
          padding-top: 12px;
          border-top: 1px dashed #e9ecef;
        }

        .hotel-description p {
          margin: 6px 0;
          font-size: 13px;
          color: var(--light-text);
          line-height: 1.5;
        }

        /* Typing Animation */
        .typing-indicator {
          display: flex;
          align-items: center;
          height: 24px;
        }

        .typing-indicator .dot {
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: #a3a3a3;
          margin: 0 2px;
          animation: typing 1.4s infinite ease-in-out;
        }

        .typing-indicator .dot:nth-child(1) { animation-delay: -0.32s; }
        .typing-indicator .dot:nth-child(2) { animation-delay: -0.16s; }

        @keyframes typing {
          0%, 80%, 100% { 
            transform: scale(0.8);
            opacity: 0.5;
          }
          40% { 
            transform: scale(1);
            opacity: 1;
          }
        }

        /* Sending dots animation */
        .sending-dots {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 3px;
        }

        .sending-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: white;
          animation: sending 1.4s infinite ease-in-out;
        }

        .sending-dot:nth-child(1) { animation-delay: -0.32s; }
        .sending-dot:nth-child(2) { animation-delay: -0.16s; }

        @keyframes sending {
          0%, 80%, 100% { 
            transform: scale(0.8);
            opacity: 0.5;
          }
          40% { 
            transform: scale(1);
            opacity: 1;
          }
        }

        /* Câu hỏi mẫu */
        .sample-questions {
          margin-top: 10px;
          padding-top: 15px;
          border-top: 1px solid #e9ecef;
        }

        .sample-questions p {
          font-size: 13px;
          color: var(--light-text);
          margin-bottom: 10px;
        }

        .questions-container {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .question-chip {
          background: white;
          border: 1px solid #e9ecef;
          border-radius: 15px;
          padding: 8px 14px;
          font-size: 12px;
          color: var(--text-color);
          cursor: pointer;
          transition: var(--transition);
          white-space: nowrap;
        }

        .question-chip:hover:not(:disabled) {
          background: var(--bot-color);
          border-color: var(--primary-light);
          transform: translateY(-1px);
        }

        .question-chip:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* Footer */
        .chat-footer {
          padding: 20px;
          background: white;
          border-top: 1px solid #f1f3f9;
          flex-shrink: 0;
        }

        .input-container {
          display: flex;
          gap: 10px;
          margin-bottom: 10px;
        }

        .chat-footer input {
          flex: 1;
          padding: 15px 20px;
          border: 1px solid #e9ecef;
          border-radius: 30px;
          font-size: 14px;
          outline: none;
          transition: var(--transition);
          background: #f9fafc;
        }

        .chat-footer input:focus {
          border-color: var(--primary-light);
          background: white;
          box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.1);
        }

        .chat-footer input:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .send-btn {
          width: 50px;
          height: 50px;
          background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
          color: white;
          border: none;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: var(--transition);
          flex-shrink: 0;
        }

        .send-btn:hover:not(:disabled) {
          transform: scale(1.05);
          box-shadow: 0 5px 15px rgba(67, 97, 238, 0.3);
        }

        .send-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .chat-hint {
          font-size: 11px;
          color: var(--light-text);
          text-align: center;
          margin: 0;
          opacity: 0.8;
        }

        /* Responsive */
        @media (max-width: 480px) {
          .chat-box {
            width: 95vw;
            height: 80vh;
            bottom: 100px;
            right: 2.5vw;
            left: 2.5vw;
          }
          
          .chat-icon {
            bottom: 20px;
            right: 20px;
          }
          
          .msg.user {
            max-width: 85%;
          }
          
          .hotel-actions {
            flex-direction: column;
            gap: 4px;
          }
          
          .btn-view, .btn-book {
            padding: 4px 8px;
            font-size: 11px;
          }
        }

        /* Thanh cuộn tùy chỉnh */
        .chat-body::-webkit-scrollbar {
          width: 6px;
        }

        .chat-body::-webkit-scrollbar-track {
          background: transparent;
        }

        .chat-body::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 10px;
        }

        .chat-body::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }

        /* Markdown styling */
        .msg-text :global(h1, h2, h3, h4) {
          margin: 16px 0 8px;
          color: #3a0ca3;
        }

        .msg-text :global(ul, ol) {
          margin: 8px 0;
          padding-left: 20px;
        }

        .msg-text :global(li) {
          margin: 4px 0;
        }

        .msg-text :global(p) {
          margin: 8px 0;
          line-height: 1.5;
        }

        .msg-text :global(strong) {
          color: #3a0ca3;
          font-weight: 600;
        }

        .msg-text :global(code) {
          background: #f1f3f9;
          padding: 2px 6px;
          border-radius: 4px;
          font-family: monospace;
        }

        .msg-text :global(blockquote) {
          border-left: 3px solid #4361ee;
          margin: 8px 0;
          padding-left: 12px;
          color: #666;
        }
      `}</style>
    </>
  );
};

export default ChatWidget;