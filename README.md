# 🤖 RSS → Social Post Pipeline (Agentic)

An automated n8n workflow that reads tech news from an RSS feed, uses a local LLM (via Ollama) to generate social media content, and saves the output to a Notion database.

---

## 📌 What It Does

1. **Polls TechCrunch RSS** every minute (or at 6 AM daily)
2. **Extracts and cleans** the article title, URL, and content
3. **Sends the article to an AI Agent** powered by Llama 3 (via Ollama) to reason and generate:
   - 3 key bullet-point takeaways
   - A tweet (max 280 characters)
   - A LinkedIn hook (2–3 sentences)
4. **Parses the structured JSON** output from the agent
5. **Saves everything to Notion** in a structured database page
6. **Workflow Demo**: https://1drv.ms/v/c/a4ea6965127121c5/IQDbsUnFYwb9QpICVrf9z9bgAeM0yJC7z1-MXuWJodx7boI?e=WBexZD
7. **Workflow Images**:https://1drv.ms/i/c/a4ea6965127121c5/IQC7hBJ3mT-4SIclUBRf0QpGAZtSDJ_CZZ9hI2O4dJgN5Mc?e=dJQZwg , https://1drv.ms/i/c/a4ea6965127121c5/IQCOUx3ntSHbQIc-GJ64UHodAYMvwa_PgIGzUj6sCByyrkU?e=R6d96J

---

## 🧱 Workflow Architecture

```
RSS Feed Trigger
      ↓
Code (normalize fields)
      ↓
Code (truncate content to 3000 chars)
      ↓
AI Agent (LangChain) ← Ollama Chat Model (llama3)
      ↓
Code (parse JSON output)
      ↓
Notion (Create database page)
```

---

## 🛠️ Nodes Used

| Node | Purpose |
|------|---------|
| `RSS Feed Trigger` | Polls TechCrunch feed on a schedule |
| `Code in JavaScript` | Normalizes title, URL, content fields |
| `Code in JavaScript1` | Truncates content to 3000 characters |
| `AI Agent` (LangChain) | Reasons step-by-step and generates JSON social content |
| `Ollama Chat Model` | Local LLM backend (llama3 at temperature 0.4) |
| `Code in JavaScript2` | Parses and validates JSON from agent output |
| `Notion` | Creates a new page in the AI Content database |

---

## ⚙️ Prerequisites

- [n8n](https://n8n.io/) (self-hosted or cloud)
- [Ollama](https://ollama.com/) running locally with `llama3` pulled
  ```bash
  ollama pull llama3
  ```
- Ollama accessible at `http://host.docker.internal:11434` (default for Docker setups)
- A Notion integration with access to a database containing these properties:
  - `Name` (title)
  - `URL` (url)
  - `Bullets` (rich_text)
  - `Tweet` (rich_text)
  - `LinkedIn` (rich_text)

---

## 🚀 Setup Instructions

1. **Import the workflow** into n8n by uploading `RSS-social-post-pipeline-agentic.json`
2. **Connect your Notion account** in the Notion node credentials
3. **Update the Notion Database ID** in the "Create a database page" node to match your own database
4. **Ensure Ollama is running** and the `llama3` model is available
5. **Activate the workflow** — it will start polling the RSS feed automatically

---

## 📤 Output (Notion Page)

Each article produces a Notion page with:

- **Name** — Article title
- **URL** — Link to the original article
- **Bullets** — 3 key takeaways
- **Tweet** — Ready-to-post tweet (≤ 280 chars)
- **LinkedIn** — Professional hook for LinkedIn

---

## 👩‍💻 Author

**M. Srivalli** — VNR Agentic Training Project  
GitHub: [@M-Srivalli](https://github.com/M-Srivalli)
