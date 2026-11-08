
import { useState } from "react";
import { Link } from "react-router-dom";
import "../Dashboard.css";

export default function Chat() {
  const [active, setActive] = useState(0);
  const [message, setMessage] = useState("");

  const [chats, setChats] = useState([
    {
      name: "Provider name",
      service: "Fan installation",
      booking: "BK-0001",
      messages: [
        { text: "Hello! I received your request for fan installation. Is tomorrow 10:00 AM fine?", time: "9:12 AM", mine: false },
        { text: "Yes, that works. The ceiling is about 10 feet high.", time: "9:15 AM", mine: true },
        { text: "Noted. I will bring a ladder. See you tomorrow.", time: "9:16 AM", mine: false },
      ],
    },
    {
      name: "Provider name",
      service: "Deep cleaning",
      booking: "BK-0000",
      messages: [{ text: "Your cleaning booking is confirmed.", time: "Yesterday", mine: false }],
    },
  ]);

  const currentChat = chats[active];

  const sendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setChats((prev) => prev.map((chat, i) =>
      i === active
        ? { ...chat, messages: [...chat.messages, { text: message.trim(), time: "Now", mine: true }] }
        : chat
    ));
    setMessage("");
  };

  return (
    <div className="dash-page chat-page">
      <header className="dash-navbar">
        <Link to="/" className="dash-logo"><span /> Nearlink</Link>
        <nav>
          <Link to="/customer-dashboard">Customer</Link>
          <Link to="/provider-dashboard">Provider</Link>
          <Link to="/admin">Admin</Link>
          <span className="avatar" />
          <Link className="outline-btn" to="/login">Log out</Link>
        </nav>
      </header>

      <main className="chat-layout">
        <aside className="chat-list dash-card">
          <h3>Messages</h3>
          <input placeholder="Search" />
          {chats.map((chat, i) => (
            <button className={`chat-contact ${active === i ? "selected" : ""}`} key={chat.booking} onClick={() => setActive(i)}>
              <span className="avatar" />
              <span><strong>{chat.name}</strong><small>{chat.service} · {chat.booking}</small></span>
            </button>
          ))}
        </aside>

        <section className="chat-window dash-card">
          <div className="chat-header">
            <span className="avatar" />
            <div><strong>{currentChat.name} <span className="status-pill">Verified</span></strong><small>Usually replies within an hour</small></div>
            <Link className="outline-btn" to="/provider/1">View profile</Link>
          </div>

          <div className="messages-area">
            <p className="chat-date">Today · Booking {currentChat.booking}</p>
            {currentChat.messages.map((m, i) => (
              <div className={`message-row ${m.mine ? "mine" : ""}`} key={i}>
                <div className="message-bubble">{m.text}<small>{m.time}</small></div>
              </div>
            ))}
          </div>

          <form className="message-form" onSubmit={sendMessage}>
            <input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type a message" />
            <button className="primary-btn">Send</button>
          </form>
        </section>

        <aside className="booking-info dash-card">
          <h3>Booking {currentChat.booking}</h3>
          <p>{currentChat.service}<br />Tomorrow, 10:00 AM<br />Payment: Cash</p>
          <span className="status-pill warning">Accepted</span>
          <Link className="primary-btn full-btn" to="/customer-dashboard">View booking</Link>
          <button className="outline-btn full-btn">Reschedule</button>
          <button className="outline-btn full-btn">Report a problem</button>
          <p className="safe-note">Keep chats and payments on Nearlink so your booking stays protected.</p>
        </aside>
      </main>

      <footer className="chat-footer">
        <strong>Nearlink · Trusted local services</strong>
        <span>About · Contact · Privacy Policy · Terms</span>
      </footer>
    </div>
  );
}
