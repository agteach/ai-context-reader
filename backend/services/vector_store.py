from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import HuggingFaceEmbeddings
import os

class VectorStoreManager:
    def __init__(self):
        self.embeddings = HuggingFaceEmbeddings(
            model_name="all-MiniLM-L6-v2"
        )
        self.stores = {}

    def create_index(self, chunks, doc_id):
        vector_store = FAISS.from_documents(chunks, self.embeddings)
        self.stores[doc_id] = vector_store
        return doc_id

    def get_relevant_context(self, doc_id, query):
        if doc_id not in self.stores:
            return ""
        
        docs = self.stores[doc_id].similarity_search(query, k=3)
        return "
".join([doc.page_content for doc in docs])