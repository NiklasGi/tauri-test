import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";
import "./App.css";
import { Button } from "./components/ui/button";

function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");
  const [pdfText, setPdfText] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
    setGreetMsg(await invoke("greet", { name }));
  }

  async function handleReadPdf() {
    try {
      const selectedPath = await open();

      if (!selectedPath) return; // User canceled

      setIsLoading(true);

      const text = await invoke<string>("extract_pdf_text", { 
        filePath: selectedPath 
      });
      
      setPdfText(text);
    } catch (error) {
      console.error(error);
      setPdfText(`Error: ${error}`);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main>
      <h1>Welcome to Tauri + React</h1>
      <Button onClick={handleReadPdf}>Get PDF Text</Button>
      <form
        className="row"
        onSubmit={(e) => {
          e.preventDefault();
          greet();
        }}
      >
        <input
          id="greet-input"
          onChange={(e) => setName(e.currentTarget.value)}
          placeholder="Enter a name..."
        />
        <Button type="submit">Greet</Button>
      </form>
      <p>{greetMsg}</p>
      {isLoading ? <p>Loading PDF text...</p> : <p>{pdfText}</p>}
    </main>
  );
}

export default App;
