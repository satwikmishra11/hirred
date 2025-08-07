import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { analyzeResumeWithAI } from "@/api/apiAI";
import { BarLoader } from "react-spinners";
import MDEditor from "@uiw/react-md-editor";
import pdfParse from "pdf-parse";

const ResumeAnalyzer = () => {
  const [resumeText, setResumeText] = useState("");
  const [analysisResult, setAnalysisResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const typedArray = new Uint8Array(e.target.result);
          const pdf = await pdfParse(typedArray);
          setResumeText(pdf.text);
        } catch (error) {
          setError(
            "Failed to parse PDF. Please ensure it's a valid PDF file and try again."
          );
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const handleAnalyzeClick = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await analyzeResumeWithAI(resumeText);
      setAnalysisResult(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="gradient-title font-extrabold text-5xl sm:text-7xl text-center pb-8">
        AI Resume Analyzer
      </h1>
      <div className="flex flex-col gap-6">
        <div>
          <label
            htmlFor="resume-upload"
            className="block text-lg font-medium mb-2"
          >
            Upload your resume (PDF)
          </label>
          <Input id="resume-upload" type="file" onChange={handleFileChange} accept=".pdf" />
        </div>
        <div>
          <label
            htmlFor="resume-text"
            className="block text-lg font-medium mb-2"
          >
            Or paste your resume text here
          </label>
          <Textarea
            id="resume-text"
            rows={15}
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            placeholder="Paste your resume content here..."
          />
        </div>
        <Button onClick={handleAnalyzeClick} disabled={loading || !resumeText}>
          {loading ? "Analyzing..." : "Analyze Resume"}
        </Button>
        {loading && <BarLoader width={"100%"} color="#36d7b7" />}
        {error && <p className="text-red-500">{error}</p>}
        {analysisResult && (
          <div className="mt-6">
            <h2 className="text-3xl font-bold mb-4">Analysis Results</h2>
            <MDEditor.Markdown
              source={analysisResult}
              className="bg-transparent sm:text-lg"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeAnalyzer;
