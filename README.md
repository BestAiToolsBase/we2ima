# We2Ima (WeChat Favorites to ima Copilot)

[简体中文](./README_zh.md) | English

**This tool is a desktop automation tool designed to help users import articles from their WeChat Favorites into the ima knowledge base. When using it, you must comply with the software's "User Agreement". Please do NOT use it for any 'non-personal purposes' or any 'illegal scenarios'!**

**We2Ima** is an automation tool designed to automatically import your WeChat Favorites content into an AI knowledge base ([Tencent ima.copilot](https://ima.qq.com/)). It breaks the information silo of WeChat, transforming your "read later" collection into a structured, AI-powered personal knowledge system.

> **Note:** This repository is currently in the "Pre-heating" phase. We are sharing the project's vision and feature set. Core code will be released in stages.

---

## Why was it developed?
- Do you have a habit of saving **good articles/potentially useful information**? Especially when reading WeChat Official Account articles.
- Are your [WeChat Favorites] just **gathering dust**? Have you never actually read the articles you saved, let alone remembered which article contained that piece of information when you needed it?

Now you have a solution!
- Import the contents of your [WeChat Favorites] into the Tencent ima knowledge base ([ima.copilot](https://ima.qq.com/)) to use as your personal knowledge base.
- You can perform Q&A based on a "single article, partial knowledge base, or entire knowledge base". When you can't remember which article contained the information you read before, simply open the [ima knowledge base] and ask. Let AI help you search based on your saved content. Efficiency Up++ 10x, say goodbye to the embarrassment of the "information black hole"!

---

## 🌟 Why We2Ima?

WeChat is one of the largest content ecosystems, but its content is often trapped in a "closed loop." 
- **The Problem:** Saving articles to "Favorites" often leads to them being forgotten. Manual copy-pasting to AI tools is tedious and slow.
- **The Solution:** We2Ima automates the entire process, simulating human behavior to "read" and "import" your articles into your AI co-pilot efficiently and safely.

## 🚀 Key Features

- **🤖 Intelligent UI Automation**: Built on GUI automation. It doesn't just do simple "clicks"; it simulates human mouse operation behavior to ensure compatibility and safety.
- **🧠 Deep ima Integration**: Specifically optimized for Tencent's ima.copilot, including automated menu interaction and state monitoring.
- **🔄 Smart Syncing Modes**:
  - **Incremental Scan**: Only sync articles added since your last run.
  - **Date Range Mode**: Focus on specific time periods.
  - **Skip Imported**: Intelligent duplicate detection using SQLite-based history management.
- **📅 Date Normalization**: Automatically converts WeChat's relative dates ("Today", "Yesterday", "3 days ago") into absolute standard formats for precise tracking.
- **🛡️ Simulate Human Mouse Operations**: Features random reading behaviors, idle patterns, and configurable speed to mimic real user interaction.
- **🖥️ Modern GUI**: A clean, intuitive interface supporting Dark Mode and System Tray operations.
- **🌐 Multilingual Support**: Fully localized in English and Simplified Chinese.

## 📅 Roadmap

- [x] **Phase 1: Project Concept & Architecture** (Completed)
- [x] **Phase 2: Full-featured GUI & Core Automation** (Completed - Internal)
- [ ] **Phase 3: Repository Warm-up** (Current)
- [ ] **Phase 4: Partial Open Source** (Core UI & Data Management)
- [ ] **Phase 5: Full Open Source & Community Beta**

## ⚠️ Disclaimer

This tool is for personal knowledge management and educational purposes only. It is an independent project and is not affiliated with, authorized, maintained, sponsored, or endorsed by WeChat (Tencent) or the ima team. 

- Use this tool at your own risk. 
- Please respect the Terms of Service of WeChat and the content creators.
- Do not use this tool for high-frequency data scraping or any commercial purposes that violate platform policies.

---

## 🤝 Contact & Support

If you are interested in this project or have any suggestions, feel free to open an Issue or follow the repository for updates.

---

*Transform Your WeChat Favorites into ima Knowledge Base*

