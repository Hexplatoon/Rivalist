import React, { useEffect, useRef, useState } from "react";
import * as monaco from "monaco-editor";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function CSSBattleClone() {
  const htmlEditorRef = useRef(null);
  const cssEditorRef = useRef(null);
  const htmlMonacoRef = useRef(null);
  const cssMonacoRef = useRef(null);

  const [htmlCode, setHtmlCode] = useState(`<div class="box"></div>`);
  const [cssCode, setCssCode] = useState(`.box {
  width: 100px;
  height: 100px;
  background: #dd6b4d;
}`);

  const [isLoading, setIsLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  useEffect(() => {
    if (htmlEditorRef.current && !htmlMonacoRef.current) {
      htmlMonacoRef.current = monaco.editor.create(htmlEditorRef.current, {
        value: htmlCode,
        language: "html",
        theme: "vs-dark",
        automaticLayout: true,
        minimap: { enabled: false },
      });

      htmlMonacoRef.current.onDidChangeModelContent(() => {
        setHtmlCode(htmlMonacoRef.current.getValue());
      });
    }

    if (cssEditorRef.current && !cssMonacoRef.current) {
      cssMonacoRef.current = monaco.editor.create(cssEditorRef.current, {
        value: cssCode,
        language: "css",
        theme: "vs-dark",
        automaticLayout: true,
        minimap: { enabled: false },
      });

      cssMonacoRef.current.onDidChangeModelContent(() => {
        setCssCode(cssMonacoRef.current.getValue());
      });
    }

    return () => {
      htmlMonacoRef.current?.dispose();
      cssMonacoRef.current?.dispose();
    };
  }, []);

  useEffect(() => {
    const iframe = document.getElementById("preview-frame");
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    iframeDoc.open();
    iframeDoc.write(`
      <style>${cssCode}</style>
      ${htmlCode}
    `);
    iframeDoc.close();
  }, [htmlCode, cssCode]);

  const handleSubmit = async () => {
    setIsLoading(true);
    setSubmitStatus(null);
    try {
      const response = await fetch("https://your-backend-api.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ html: htmlCode, css: cssCode }),
      });

      if (!response.ok) throw new Error("Submission failed");
      const result = await response.json();
      setSubmitStatus({ success: true, message: "Submission successful!" });
      console.log("Backend response:", result);
    } catch (error) {
      setSubmitStatus({
        success: false,
        message: "Submission failed. Please try again.",
      });
      console.error("Error submitting code:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 mt-6 h-[90vh] w-full overflow-hidden bg-background text-white font-mono">
      <div className="grid grid-cols-3 gap-4 h-full">
        {/* Editor Panel */}
        <Card className="bg-gray-800 flex flex-col overflow-hidden">
          <CardContent className="flex-1 flex flex-col p-2">
            <div className="text-sm text-white/80 mb-1">HTML</div>
            <div ref={htmlEditorRef} className="flex-1 border border-gray-600 rounded-md" />
            <div className="text-sm text-white/80 my-1">CSS</div>
            <div ref={cssEditorRef} className="flex-1 border border-gray-600 rounded-md" />
            <Button
              className="mt-2"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? "Submitting..." : "Submit"}
            </Button>
            {submitStatus && (
              <div className={`mt-2 text-sm p-2 rounded-md ${submitStatus.success ? "bg-green-700" : "bg-red-700"}`}>
                {submitStatus.message}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Live Preview */}
        <Card className="bg-gray-800 overflow-hidden">
          <CardContent className="p-2 h-full flex flex-col">
            <div className="text-sm text-white/80 mb-1">Live Preview</div>
            <iframe
              id="preview-frame"
              className="flex-1 rounded-md border border-white bg-white"
              title="Live Preview"
            />
          </CardContent>
        </Card>

        {/* Target Design */}
        <Card className="bg-gray-800 overflow-hidden">
          <CardContent className="p-2 h-full flex flex-col">
            <div className="text-sm text-white/80 mb-1">Target</div>
            <img
              src="https://via.placeholder.com/150"
              alt="Target"
              className="w-full h-48 object-contain border border-white rounded-md"
            />
            <div className="flex gap-2 mt-4 justify-between">
              <div className="flex-1 text-center p-2 rounded-md border border-gray-600 font-bold cursor-pointer hover:bg-white/20 hover:text-teal-400">
                Color 1
              </div>
              <div className="flex-1 text-center p-2 rounded-md border border-gray-600 font-bold cursor-pointer hover:bg-white/20 hover:text-teal-400">
                Color 2
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default CSSBattleClone;
