exports.getImageAnalysisMessage = (analysis) => {
    if (!analysis) {
      return "Sorry, I couldn't detect anything in the image.";
    }
    return `I have detected ${analysis}. Please note that this is an AI-generated prediction. Consult a dermatologist for an accurate diagnosis.`;
  };
  