import { useState } from 'react';
import { Upload, Sparkles } from 'lucide-react';
import './index.css';

export default function App() {
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [textPrompt, setTextPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://api.remove.bg/v1.0/removebg', {
        method: 'POST',
        headers: {
          'X-Api-Key': 'YOUR_API_KEY',
        },
        body: JSON.stringify({
          image_url: 'https://fakeimg.pl/600x400/?text=' + encodeURIComponent(textPrompt),
          size: 'auto'
        })
      });

      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);
      setBackgroundImage(imageUrl);
    } catch (error) {
      console.error('Error generating background:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedImage(URL.createObjectURL(file));
    }
  };

  return (
    <div className="min-h-screen bg-white text-black flex flex-col items-center justify-center px-6 py-10 font-sans">
      <h1 className="text-4xl font-bold mb-6 tracking-tight">Layered.ai</h1>

      <div className="flex flex-col md:flex-row items-center gap-4 w-full max-w-4xl mb-6">
        <div className="flex items-center gap-2 w-full">
          <Upload className="text-gray-700" />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full text-sm border rounded px-4 py-2 cursor-pointer"
          />
        </div>

        <div className="flex items-center gap-2 w-full">
          <Sparkles className="text-gray-700" />
          <input
            type="text"
            placeholder="Type text to embed in background..."
            className="w-full px-4 py-2 border rounded text-black"
            value={textPrompt}
            onChange={(e) => setTextPrompt(e.target.value)}
          />
        </div>
      </div>

      <button
        onClick={handleGenerate}
        disabled={loading || !textPrompt.trim()}
        className="bg-black text-white px-8 py-3 rounded-xl hover:bg-gray-800 transition-all shadow-md"
      >
        {loading ? 'Generating...' : 'Generate Background'}
      </button>

      <div className="mt-10 w-full max-w-5xl flex flex-col items-center">
        {uploadedImage && (
          <div className="mb-6">
            <h2 className="text-lg font-medium mb-2">Uploaded Image:</h2>
            <img src={uploadedImage} alt="Uploaded" className="max-w-full h-auto rounded-xl shadow" />
          </div>
        )}

        {backgroundImage && (
          <div>
            <h2 className="text-lg font-medium mb-2">Generated Background:</h2>
            <img src={backgroundImage} alt="Generated background" className="max-w-full h-auto rounded-xl shadow-lg" />
          </div>
        )}
      </div>
    </div>
  );
    }
