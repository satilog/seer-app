'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import styles from './Body.module.css';
import { FaArrowUp } from "react-icons/fa6";
import { RiLinkM } from "react-icons/ri";

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

export const backendUrl = 'http://127.0.0.1:5000';

const Body: React.FC = () => {
  const [chatContent, setChatContent] = useState('');
  const [fullText, setFullText] = useState('');
  const [typingFinished, setTypingFinished] = useState(false);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const fetchLLMOutput = async () => {
      console.log("fetchLLMOutput called");
      // @ts-ignore
      chrome.tabs.query({ active: true, currentWindow: true }, async function (tabs) {
        if (tabs.length === 0) {
          console.error("No active tabs found.");
          return;
        }
        const currentUrl = tabs[0].url;
        console.log("Current tab URL:", currentUrl);

        try {
          const response = await fetch(`${backendUrl}/crawl`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ start_url: currentUrl }),
          });
          const data = await response.json();
          console.log("Response from backend:", data);

          // Assuming the response contains HTML content
          setFullText(data.responseText);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      });

      // Simulate fetching data from LLM
      const simulatedResponse = `<p>This is the output from ChatGPT, including code blocks and explanations.</p>
                        <pre><code>const example = 'code block';</code></pre>`;
      setFullText(simulatedResponse);
    };

    fetchLLMOutput();
  }, []);

  // useEffect(() => {
  //   if (fullText) {
  //     setChatContent(''); // Reset chat content before typing
  //     let currentIndex = 0;
  //     const intervalId = setInterval(() => {
  //       if (currentIndex < fullText.length) {
  //         setChatContent((prev) => prev + fullText[currentIndex]);
  //         currentIndex++;
  //       } else {
  //         clearInterval(intervalId);
  //         setTypingFinished(true);
  //       }
  //     }, 10); // Adjust typing speed here
  //     return () => clearInterval(intervalId);
  //   }
  // }, [fullText]);

  const handleQuerySubmit = async () => {
    if (!query) return;

    try {
      const response = await fetch(`${backendUrl}/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });
      const data = await response.json();
      console.log("Response from backend:", data);
      setFullText(data.answer); // Update fullText with the new response
      setChatContent(data.answer); // Update chat content with the new response
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  return (
    <div className={styles.body}>
      <div className={styles.sections}>
        <Section
          title="25 links visited"
          description="Click to view links"
        />
      </div>
      <div className={styles.chatBody}>
        {typingFinished ? (
          <ReactQuill
            value={chatContent}
            readOnly={true}
            theme="bubble"
            className="quill"
          />
        ) : (
          <div
            className={styles.chatContent}
            dangerouslySetInnerHTML={{ __html: chatContent }}
          />
        )}
      </div>
      <div className={styles.queryWrapper}>
        <input
          className={styles.queryInput}
          placeholder="Enter your query here"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={handleQuerySubmit} className={styles.queryButton}>
          <FaArrowUp color="#f0933f" size={20} />
        </button>
      </div>
    </div>
  );
};

const Section: React.FC<{
  icon?: string;
  title: string;
  description: string;
  active?: boolean;
}> = ({ title, description, active }) => {
  return (
    <div className={`${styles.section} ${active ? styles.active : ''}`}>
      <div className={styles.iconWrapper}>
        <RiLinkM strokeWidth={0.5} color="#f0933f" size={20} />
      </div>
      <div className={styles.sectionTextWrapper}>
        <div className={styles.sectionTitle}>{title}</div>
        <div className={styles.sectionDescription}>{description}</div>
      </div>
    </div>
  );
};

export default Body;
