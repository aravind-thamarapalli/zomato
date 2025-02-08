const vision = require('@google-cloud/vision');

const client = new vision.ImageAnnotatorClient();

const imageSearchHandler = async (req, res) => {
  try {
    const { imageUrl } = req.query;
    if (!imageUrl) {
      return res.status(400).json({ error: "Image URL is required" });
    }

    const [result] = await client.labelDetection(imageUrl);
    const labels = result.labelAnnotations.map(label => label.description);

    res.json({ labels });
  } catch (error) {
    console.error("Error processing image:", error);
    res.status(500).json({ error: "Error processing image" });
  }
};

module.exports = { imageSearchHandler };
