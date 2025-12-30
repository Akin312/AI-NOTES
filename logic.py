import requests
import os



API_URL = "https://openrouter.ai/api/v1/chat/completions"

def akilli_duzenle(text, mode="normal"):
    api_key = os.getenv("OPENROUTER_API_KEY")
    if not api_key:
        return "Sunucu hatası: API anahtarı bulunamadı."

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }

    # 👉 Özet modu talimatı
    if mode == "kisa":
        instruction = (
            "Metni kısaca özetle. En önemli fikirleri koru ama gereksiz cümleleri çıkar. "
            "Sade ve kısa yaz."
        )
    elif mode == "detayli":
        instruction = (
            "Metni anlamını bozmadan daha açıklayıcı ve ayrıntılı şekilde yeniden yaz. "
            "Akıcı olsun ama çok uzatma."
        )
    else:  # normal
        instruction = (
            "Metni anlamını bozmadan sade, akıcı ve düzgün Türkçe ile yeniden yaz."
        )

    payload = {
        "model": "meta-llama/llama-3-8b-instruct",
        "temperature": 0.0,
        "messages": [
            {
                "role": "system",
                "content": (
                    "Sen sadece TÜRKÇE yazan bir metin düzeltme ve özetleme asistanısın. "
                    "Saçma kelimeler üretme. Çıktıda sadece düzenlenmiş metni ver."
                ),
            },
            {
                "role": "user",
                "content": (
                    f"{instruction}\n\n"
                    f"Metin:\n{text}"
                ),
            },
        ],
    }



    res = requests.post(
    "https://openrouter.ai/api/v1/chat/completions",
    headers=headers,
    json=payload,
    timeout=25   # en fazla 25 sn bekle
)


    print("STATUS:", res.status_code)
    print("RAW:", res.text)

    data = res.json()

    return data["choices"][0]["message"]["content"]

if __name__ == "__main__":
    sonuc = akilli_duzenle("Bugün okulda çok yoruldum. Eve gelince dinlendim, sonra ders çalıştım.")
    print("SONUC:", sonuc)

