import json
import os
from dataclasses import dataclass

from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI


class TaskClassifierError(Exception):
    pass


class TaskClassifierUnavailableError(TaskClassifierError):
    pass


@dataclass
class TaskClassificationResult:
    suggested_category_id: int
    confidence: float
    reason: str
    provider: str
    model: str


class LangChainTaskClassifier:
    def __init__(self):
        self.provider = os.getenv("LLM_PROVIDER", "").strip().lower() or "gemini"
        self.model = os.getenv("GEMINI_MODEL", "").strip() or "gemini-2.5-flash"
        self.api_key = (
            os.getenv("GEMINI_API_KEY", "").strip()
            or os.getenv("GOOGLE_API_KEY", "").strip()
        )

    def classify_task(self, title, description, categories):
        if self.provider != "gemini":
            raise TaskClassifierUnavailableError("Proveedor LLM no soportado.")

        if not self.api_key:
            raise TaskClassifierUnavailableError("GEMINI_API_KEY no configurada.")

        if not categories:
            raise TaskClassifierError("No hay categorias disponibles para clasificar.")

        categories_payload = [
            {"category_id": category["category_id"], "description": category["description"]}
            for category in categories
        ]
        category_ids = {category["category_id"] for category in categories_payload}

        prompt = ChatPromptTemplate.from_messages(
            [
                (
                    "system",
                    (
                        "Eres un clasificador de tareas. Debes elegir exactamente una categoria "
                        "del listado. Responde solo JSON valido con estas claves: "
                        "suggested_category_id (int), confidence (float entre 0 y 1), reason (string breve)."
                    ),
                ),
                (
                    "human",
                    (
                        "Categorias disponibles:\n{categories}\n\n"
                        "Titulo: {title}\n"
                        "Descripcion: {description}\n\n"
                        "Elige la categoria mas adecuada."
                    ),
                ),
            ]
        )

        llm = ChatGoogleGenerativeAI(
            model=self.model,
            temperature=0,
            google_api_key=self.api_key,
        )
        chain = prompt | llm | StrOutputParser()

        try:
            raw_response = chain.invoke(
                {
                    "categories": json.dumps(categories_payload, ensure_ascii=True),
                    "title": title,
                    "description": description or "",
                }
            )
            parsed = self._parse_json(raw_response)
        except Exception as exc:
            raise TaskClassifierUnavailableError("No se pudo obtener respuesta valida de IA.") from exc

        suggested_category_id = parsed.get("suggested_category_id")
        confidence = parsed.get("confidence", 0.0)
        reason = str(parsed.get("reason", "")).strip()

        try:
            suggested_category_id = int(suggested_category_id)
        except (TypeError, ValueError) as exc:
            raise TaskClassifierError("La IA devolvio una categoria invalida.") from exc

        if suggested_category_id not in category_ids:
            raise TaskClassifierError("La IA devolvio una categoria fuera del listado.")

        try:
            confidence = float(confidence)
        except (TypeError, ValueError):
            confidence = 0.0
        confidence = max(0.0, min(1.0, confidence))

        if not reason:
            reason = "Categoria sugerida segun el contenido de la tarea."

        return TaskClassificationResult(
            suggested_category_id=suggested_category_id,
            confidence=confidence,
            reason=reason,
            provider=self.provider,
            model=self.model,
        )

    @staticmethod
    def _parse_json(raw_response):
        text = str(raw_response).strip()

        if text.startswith("```"):
            lines = text.splitlines()
            if len(lines) >= 3:
                text = "\n".join(lines[1:-1]).strip()

        start_idx = text.find("{")
        end_idx = text.rfind("}")
        if start_idx != -1 and end_idx != -1 and end_idx > start_idx:
            text = text[start_idx : end_idx + 1]

        return json.loads(text)
