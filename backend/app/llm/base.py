from abc import ABC, abstractmethod
from pydantic import BaseModel

class Message(BaseModel):
    role: str
    content: str

class LLMClient(ABC):
    @abstractmethod
    def generate(self, messages: list[Message]) -> str:
        pass