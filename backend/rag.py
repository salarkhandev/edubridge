from langchain_ollama import OllamaEmbeddings
from langchain_chroma import Chroma
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.documents import Document

class RAGPipeline:
    def __init__(self):
        self.embeddings = OllamaEmbeddings(model="nomic-embed-text")
        self.vectorstore = Chroma(
            persist_directory="./chroma_db",
            embedding_function=self.embeddings
        )
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=500,
            chunk_overlap=50
        )

    def ingest(self, file_path: str, filename: str) -> int:
        text = ""
        if filename.lower().endswith(".pdf"):
            try:
                import pymupdf
                doc = pymupdf.open(file_path)
                for page in doc:
                    text += page.get_text()
                doc.close()
            except:
                try:
                    from pypdf import PdfReader
                    reader = PdfReader(file_path)
                    for page in reader.pages:
                        text += page.extract_text() or ""
                except:
                    return 0
        else:
            try:
                with open(file_path, "r", encoding="utf-8") as f:
                    text = f.read()
            except:
                return 0

        if not text.strip():
            return 0

        docs = [Document(page_content=text, metadata={"source": filename})]
        chunks = self.text_splitter.split_documents(docs)
        if chunks:
            self.vectorstore.add_documents(chunks)
        return len(chunks)

    def search(self, query: str, k: int = 3) -> str:
        try:
            results = self.vectorstore.similarity_search(query, k=k)
            if not results:
                return ""
            return "\n\n".join([doc.page_content for doc in results])
        except:
            return ""