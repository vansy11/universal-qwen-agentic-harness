import sys
import json

try:
    from pypdf import PdfReader
except ImportError:
    print(json.dumps({"error": "pypdf is not installed. Run 'pip install pypdf' in your terminal."}))
    sys.exit(1)

def extract_text(file_path):
    """Extracts text from a local PDF file."""
    reader = PdfReader(file_path)
    text = ""
    for page in reader.pages:
        text += page.extract_text() + "\n\n"
    return text

if __name__ == "__main__":
    # Expects JSON input: {"file_path": "C:/path/to/document.pdf"}
    input_data = json.loads(sys.stdin.read())
    file_path = input_data.get("file_path")
    
    if not file_path:
        print(json.dumps({"error": "No file_path provided."}))
        sys.exit(1)
        
    try:
        extracted_text = extract_text(file_path)
        # Limit output to prevent context window explosion (e.g., first 50,000 characters)
        if len(extracted_text) > 50000:
            extracted_text = extracted_text[:50000] + "\n\n... [TRUNCATED: Text exceeds 50,000 characters]"
        print(json.dumps({"text": extracted_text}))
    except Exception as e:
        print(json.dumps({"error": str(e)}))
