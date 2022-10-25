import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
const socket = io("http://localhost:5000/");

function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const navigate = useNavigate();

  const onSubmit = (e) => {
    e.preventDefault();
    socket.emit(
      "send-message",
      { message, user: localStorage.getItem("userId") },
      () => setMessage("")
    );
  };
  const fetchMessages = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/v1/message/messages"
      );
      setMessages(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchMessages();
    if (!localStorage.getItem("token")) {
      navigate("login");
    }
  }, []);
  useEffect(() => {
    socket.on("message", (data) => {
      setMessages((msg) => [data, ...msg]);
    });
    socket.on("message-deleted", (data) => {
      fetchMessages();
    });
    return () => {
      socket.off("message");
      socket.off("message-deleted");
    };
  }, []);

  const onDeleteMessage = (id) => {
    socket.emit("delete-message", { id });
  };

  return (
    <div className="App">
      <input value={message} onChange={(e) => setMessage(e.target.value)} />
      <button onClick={onSubmit}>Send</button>
      <div>
        {messages.map((item, index) => (
          <div style={{ display: "flex" }}>
            <p key={index}>{item.message}</p>
            {localStorage.getItem("userId") ===
              (item.user?._id || item.user) && (
              <p
                style={{ marginLeft: "50px", color: "red" }}
                onClick={() => onDeleteMessage(item._id)}
              >
                Delete
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
