import os
from typing import Any, Dict

import requests


def send_to_grok(prompt: str) -> str:
    """Send a prompt to Grok/Groq-compatible API and return plain text explanation."""
    api_key = os.getenv("GROK_API_KEY", "").strip()
    api_url = os.getenv("GROK_API_URL", "").strip()

    if not api_key or not api_url:
        return "Grok configuration missing. Set GROK_API_KEY and GROK_API_URL in environment variables."

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }

    payload: Dict[str, Any] = {
        "model": os.getenv("GROK_MODEL", "llama-3.1-8b-instant"),
        "messages": [
            {
                "role": "system",
                "content": "You are a telecom and digital forensics analyst. Explain findings clearly and briefly.",
            },
            {"role": "user", "content": prompt},
        ],
        "temperature": 0.2,
    }

    try:
        response = requests.post(api_url, headers=headers, json=payload, timeout=30)
        response.raise_for_status()
        data = response.json()

        choices = data.get("choices", [])
        if choices and "message" in choices[0]:
            return choices[0]["message"].get("content", "No explanation returned.")

        if "explanation" in data:
            return str(data["explanation"])

        if "text" in data:
            return str(data["text"])

        return "Explanation generated, but response format was unexpected."
    except requests.RequestException as exc:
        return f"Failed to fetch Grok explanation: {exc}"
