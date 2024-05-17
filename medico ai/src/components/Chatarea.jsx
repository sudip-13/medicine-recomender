"use client";

import { GoogleGenerativeAI } from "@google/generative-ai";
import Markdown from "react-markdown";
import { useState, useEffect, useRef } from "react";
import { Send, Trash } from "lucide-react";
import Image from "next/image";
import DoctorCard from "./DoctorCard";

const ChatArea = () => {
  const messagesEndRef = useRef(null);
  const [input, setinput] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([
    {
      role: "model",
      parts: "Great to meet you. Im Medico, your chatbot.",
      doctor: null
    },
  ]);
  const [apiRes, setApiRes] = useState("");
  const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_APIKEY);
  const [chat, setchat] = useState(null);
  const [doctorDetails, setDoctor] = useState(null);

  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [history]);
  useEffect(() => {
    // the moment I felt , Im the GOD !
    if (!chat) {
      setchat(
        model.startChat({
          generationConfig: {
            maxOutputTokens: 400,
          },
        })
      );
    }
  }, [chat, model]);

  async function chatting() {
    setLoading(true);
    setHistory((oldHistory) => [
      ...oldHistory,
      {
        role: "user",
        parts: input,
      },
      {
        role: "model",
        parts: "Thinking...",
      },
    ]);
    //setinput("");
    console.log(input)
    try {

      // const res = await fetch('http://127.0.0.1:5000/predict', {
      //   method: 'POST',
      //   // headers: {
      //   //   'Content-Type': 'application/json'
      //   // },

      //   body: { symptoms: input }
      // })

      // const response = await res.json();
      // console.log(response)
      const res = await fetch('http://127.0.0.1:5000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ symptoms: input })
      });

      if (!res.ok) {
        const errorText = await res.text(); // Read the response text (which might be HTML)
        console.error(`Error ${res.status}: ${errorText}`);
        throw new Error(`Server responded with ${res.status}`);
      }

      try {
        const data = await res.json(); // Try parsing the response as JSON
        console.log(data)
        setApiRes(data.dis_des);
        setDoctor(await getRemonnedDoctor(data.predicted_disease));
      } catch (error) {
        console.error('Failed to parse JSON response:', error);
      }
      setLoading(false);
      
    } catch (error) {
      setHistory((oldHistory) => {
        const newHistory = oldHistory.slice(0, oldHistory.length - 1);
        newHistory.push({
          role: "model",
          parts: "Oops! Something went wrong.",
        });
        return newHistory;
      });
      setLoading(false);
      console.log(error);
      alert("Oops! Something went wrong.");
    }
  }

  const getRemonnedDoctor = async (disease)=>{
    try {
      const res = await fetch('http://localhost:5173/getDoctor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ disease})
      })
      const response = await res.json();
      console.log(response)
      return response
    } catch (e) {
      console.log(e)
      
    }
  }
  console.log(history)

  useEffect(()=>{
    setHistory((oldHistory) => {
      const newHistory = oldHistory.slice(0, oldHistory.length - 1);
      newHistory.push({
        role: "model",
        parts: apiRes,
        doctor: doctorDetails
      });
      return newHistory;
    });

  }, [doctorDetails])

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      chatting();
    }
  }

  function reset() {
    setHistory([
      {
        role: "model",
        parts: "Great to meet you. I am Medico, your chatbot.",
      },
    ]);
    setinput("");
    setchat(null);
  }

  return (
    <div className="relative flex px-2 justify-center max-w-3xl min-h-dvh w-full pt-6 bg-gray-900 rounded-t-3xl max-h-screen shadow shadow-slate-900">
      <div className="flex text-sm md:text-base flex-col pt-10 pb-16 w-full flex-grow flex-1 rounded-3xl shadow-md overflow-y-auto">
        {history.map((item, index) => (
          <div
            key={index}
            className={`chat ${item.role === "model" ? "chat-start" : "chat-end"
              }`}
          >
            <div className="chat-image avatar">
              <div className="w-6 md:w-10 rounded-full">
                <Image
                  alt="o"
                  src={item.role === "model" ? "/geminis.jpeg" : "/user.jpg"}
                  width={50}
                  height={50}
                />
              </div>
            </div>
            <div className="chat-header mx-2 font-semibold opacity-80">
              {item.role === "model" ? "Medico" : "You"}
            </div>
            <div
              className={`chat-bubble font-medium ${item.role === "model" ? "chat-bubble-primary" : ""
                }`}
            >
              <Markdown>{item.parts}</Markdown>
              {item.doctor && <DoctorCard doctor={item.doctor}/>}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="absolute px-2 bottom-2 w-full flex gap-1">
        <button
          className="btn btn-outline shadow-md btn-error rounded-3xl backdrop-blur"
          title="send"
          onClick={reset}
        >
          <Trash />
        </button>
        <textarea
          type="text"
          value={input}
          required
          rows={1}
          onKeyDown={handleKeyDown}
          onChange={(e) => setinput(e.target.value)}
          placeholder="Start Chatting..."
          className="textarea backdrop-blur textarea-primary w-full mx-auto bg-opacity-60 font-medium shadow rounded-3xl"
        />
        <button
          className={`btn rounded-3xl shadow-md ${loading
            ? "btn-accent cursor-wait pointer-events-none"
            : "btn-primary"
            }`}
          title="send"
          onClick={chatting}
        >
          {loading ? (
            <span className="loading loading-spinner loading-sm"></span>
          ) : (
            <Send />
          )}
        </button>
      </div>
    </div>
  );
};

export default ChatArea;
