from flask import Flask, request, jsonify
import pickle
import re

app = Flask(__name__)

model = pickle.load(open("model.pkl", "rb"))
vectorizer = pickle.load(open("vectorizer.pkl", "rb"))

def clean_text(text):
    text = text.lower()
    text = re.sub(r"[^a-z\s]", "", text)
    return text

@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()
    review = clean_text(data["review"])

    vectorized = vectorizer.transform([review])
    prediction = model.predict(vectorized)[0]
    confidence = model.predict_proba(vectorized)[0].max()

    return jsonify({
        "prediction": "Fake Review" if prediction == 1 else "Genuine Review",
        "confidence": round(float(confidence), 2)
    })

if __name__ == "__main__":
    app.run(port=5000, debug=True)