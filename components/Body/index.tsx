'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import styles from './Body.module.css';
import { FaArrowUp } from "react-icons/fa6";
import { RiLinkM } from "react-icons/ri";

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

const Body: React.FC = () => {
  const [chatContent, setChatContent] = useState('');
  const [fullText, setFullText] = useState('');
  const [typingFinished, setTypingFinished] = useState(false);

  useEffect(() => {
    const fetchLLMOutput = async () => {
      // Simulate fetching data from LLM
      const response = `<p>This is the output from ChatGPT, including code blocks and explanations.</p>
                        <pre><code>const example = 'code block';</code></pre>`;
      setFullText(response);
    };
    fetchLLMOutput();
  }, []);

  useEffect(() => {
    if (fullText) {
      let currentIndex = 0;
      const intervalId = setInterval(() => {
        if (currentIndex < fullText.length) {
          setChatContent((prev) => prev + fullText[currentIndex]);
          currentIndex++;
        } else {
          clearInterval(intervalId);
          setTypingFinished(true);
          setChatContent(fullText);
        }
      }, 10); // Adjust typing speed here
      return () => clearInterval(intervalId);
    }
  }, [fullText]);

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
        />
        <button className={styles.queryButton}>
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
