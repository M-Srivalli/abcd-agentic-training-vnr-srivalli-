import { useState } from "react";
import axios from "axios";

function App() {
  const [review, setReview] = useState("");
  const [result, setResult] = useState(null);

  const submitReview = async () => {
    const res = await axios.post("http://localhost:5001/check-review", {
      review,
    });
    setResult(res.data);
  };

  return (
    <div style={{ padding: "40px" }}>
      <h2>Fake Review Detection System</h2>

      <textarea
        rows="5"
        cols="50"
        placeholder="Paste product review here"
        value={review}
        onChange={(e) => setReview(e.target.value)}
      />

      <br /><br />
      <button onClick={submitReview}>Check Review</button>

      {result && (
        <div>
          <h3>{result.prediction}</h3>
          <p>Confidence: {result.confidence}</p>
        </div>
      )}
    </div>
  );
}

export default App;