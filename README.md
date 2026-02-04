# 🕵️ Smart Fake Review Detection System

## 🚀 Features
- Detects whether a product review is **Fake or Genuine**
- Uses **Machine Learning (NLP)** for text classification
- Displays **confidence score** for predictions
- Simple and user-friendly web interface
- Fast and lightweight inference

---

## 🧠 Tech Stack
- **Machine Learning:** Python, Scikit-learn
- **NLP:** TF-IDF Vectorization
- **Model:** Logistic Regression
- **Backend:** FastAPI
- **Frontend:** HTML, JavaScript
- **Storage:** Joblib (model persistence)
- **Environment:** Google Colab / Local

---

---

## ⚙️ How It Works
1. User enters a product review in the frontend
2. Review text is sent to the backend API
3. Text is cleaned and vectorized using TF-IDF
4. ML model predicts **Fake or Genuine**
5. Result with confidence score is returned to the user

---

## ▶️ How to Run the Project

### 1️⃣ Train the ML Model
- Open `training/train_model.ipynb` in Google Colab
- Run all cells to generate:
  - `model.pkl`
  - `vectorizer.pkl`

---

