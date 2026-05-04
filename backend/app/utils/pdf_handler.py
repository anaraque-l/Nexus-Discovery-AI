import fitz  # PyMuPDF

def extract_text_from_pdf(pdf_content: bytes) -> str:
    """Extrai texto de um arquivo PDF recebido em bytes."""
    text = ""
    with fitz.open(stream=pdf_content, filetype="pdf") as doc:
        for page in doc:
            text += page.get_text()
    return text