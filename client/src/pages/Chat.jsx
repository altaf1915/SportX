import { Paperclip, Send } from "lucide-react";
import { useState } from "react";
import { api } from "../api/client";

const seedMessages = [
  ["Aarav", "Football tonight at Sky Turf?"],
  ["You", "Yes. I can bring one more player."],
  ["Nisha", "Typing indicators and read receipts are Socket.io-ready in the API."]
];

export default function Chat() {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState(seedMessages);
  const [notice, setNotice] = useState("");

  const send = async () => {
    const body = text.trim();
    if (!body) return;
    setMessages((current) => [...current, ["You", body]]);
    setText("");
    try {
      const { data } = await api.get("/chat/conversations");
      const first = data.conversations?.[0]?._id;
      if (first) await api.post(`/chat/conversations/${first}/messages`, { body });
      setNotice(first ? "Message sent to your latest conversation." : "Message saved locally. Start a conversation from a player profile to sync it.");
    } catch {
      setNotice("Message saved locally. Connect the API to sync conversations.");
    }
  };

  return (
    <div className="grid min-h-[70vh] gap-4 lg:grid-cols-[320px_1fr]">
      <aside className="glass rounded-2xl p-4">
        <h1 className="text-2xl font-black">Chats</h1>
        {["Football Squad", "Chess Ladder", "Running Club"].map((chat) => <div key={chat} className="mt-3 rounded-2xl bg-white/8 p-4 font-semibold">{chat}</div>)}
      </aside>
      <section className="glass flex rounded-2xl p-4">
        <div className="flex min-h-full w-full flex-col">
          <div className="border-b border-white/10 pb-4">
            <h2 className="text-xl font-black">Football Squad</h2>
            <p className="text-sm text-sportx-accent">Aarav is typing...</p>
          </div>
          <div className="flex-1 space-y-3 py-5">
            {messages.map(([from, body], index) => <div key={`${from}-${index}`} className={`max-w-xl rounded-2xl p-4 ${from === "You" ? "ml-auto bg-sportx-primary" : "bg-white/10"}`}><p className="text-xs text-white/55">{from}</p><p>{body}</p></div>)}
            {notice && <p className="text-center text-xs text-white/45">{notice}</p>}
          </div>
          <div className="flex gap-2">
            <button className="grid h-12 w-12 place-items-center rounded-xl border border-white/10 bg-white/8"><Paperclip size={18} /></button>
            <input onKeyDown={(event) => { if (event.key === "Enter") send(); }} className="flex-1 rounded-xl border border-white/10 bg-white/8 px-4 outline-none" value={text} onChange={(e) => setText(e.target.value)} placeholder="Message players" />
            <button onClick={send} className="premium-button grid h-12 w-12 place-items-center rounded-xl"><Send size={18} /></button>
          </div>
        </div>
      </section>
    </div>
  );
}
