# Strategia Synergii: MapaBeskidu.pl x SummitGo.pl

## 1. Wizja: Uzupe³nienie, a nie konkurencja

**SummitGo** to doskona³a aplikacja mobilna skupiona na *wykonaniu* (tu i teraz) oraz *grywalizacji*. G³ówny ciê¿ar SummitGo to:
* Zdobywanie szczytów, AR (Summit Lens)
* Bezpieczny powrót i tracking
* Punkty XP i personalne questy

**MapaBeskidu.pl** obiera kierunek jako potê¿ny **Hub Wiedzy, Planowania i Spo³ecznoœci**. Nie bêdziemy wdra¿aæ punktów XP ani rywalizowaæ o czas spêdzony w naszej aplikacji na szlaku. Zamiast tego oferujemy to, czego SummitGo nie ma:
* **Ogromna baza danych:** (47k POI), warstwy historyczne, mapy zaborów.
* **Community Alerty:** Zg³aszane na ¿ywo zwalone drzewa, powodzie, trudnoœci na szlaku.
* **Duch Beskidu (RAG AI):** Oparty na LLM wirtualny przewodnik znaj¹cy lokalne legendy.

### Jak zyskuj¹ obie strony?
* **Dla SummitGo:** Darmowe zasilenie ich aplikacji w alerty bezpieczeñstwa i ciekawostki historyczne (co uatrakcyjni ich Questy i system Bezpiecznego Powrotu).
* **Dla MapaBeskidu:** Linkowanie zwrotne, ruch i budowa wizerunku centralnego wêz³a danych (Wikipedia gór).

---

## 2. Projekt Publicznego API (Dla partnerów B2B / SummitGo)

Poni¿sze API pozwala na obustronn¹ integracjê. Zosta³o zaprojektowane zgodnie z REST. 

### Autoryzacja
API publiczne wymaga nag³ówka: Authorization: Bearer <PARTNER_TOKEN>. Dla SummitGo wygenerowany zostanie dedykowany token.

---

### Endpoint 1: Pobieranie aktywnych alertów z trasy
Wykorzystywane przez funkcjê **"Bezpieczny Powrót"** w SummitGo do ostrzegania u¿ytkowników o zg³oszonych przez spo³ecznoœæ MapaBeskidu niebezpieczeñstwach (np. niedŸwiedŸ, zerwany most).

* **URL:** /api/public/v1/alerts/active
* **Metoda:** GET
* **Parametry (Query):**
  * lat / lon (float) - œrodek promienia
  * adius_km (float) - promieñ wyszukiwania
* **OdpowiedŸ (200 OK - GeoJSON):**
`json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": { "type": "Point", "coordinates": [19.0123, 49.6543] },
      "properties": {
        "id": "alert-104",
        "type": "danger",
        "description": "Zwalone drzewa po wczorajszej burzy, szlak zablokowany.",
        "reportedAt": "2026-09-02T14:30:00Z",
        "upvotes": 12,
        "source": "MapaBeskidu.pl"
      }
    }
  ]
}
`

---

### Endpoint 2: Generator Ciekawostek Historycznych (Duch Beskidu)
U¿ywane, gdy u¿ytkownik SummitGo "zdobêdzie szczyt". Aplikacja mo¿e zapytaæ Ducha Beskidu o unikaln¹ legendê lub fakt historyczny dotycz¹cy tego miejsca.

* **URL:** /api/public/v1/kronikarz/generate-trivia
* **Metoda:** POST
* **Body:**
`json
{
  "location_name": "Babia Góra",
  "coordinates": [19.5298, 49.5733],
  "context": "U¿ytkownik w³aœnie zdoby³ szczyt po 4 godzinach wspinaczki."
}
`
* **OdpowiedŸ (200 OK):**
`json
{
  "trivia": "Gratulacje, wêdrowcze! Stoisz na szczycie Diablaka. Zwa¿ jednak, ¿e dawne kroniki g³osz¹, i¿ to sam diabe³ rozsypa³ tu g³azy, próbuj¹c zbudowaæ zamek... Uwa¿aj na wiatr, który czêsto tu hula!",
  "credit": "Generowane przez Ducha Beskidu (MapaBeskidu.pl)"
}
`

---

### Endpoint 3: Baza Historycznych POI do Questów
Pobiera historyczne punkty w danym rejonie, które SummitGo mo¿e osadziæ jako "Z³ote punkty / Tajne Questy" na swojej mapie.

* **URL:** /api/public/v1/poi/historical
* **Metoda:** GET
* **OdpowiedŸ:** Tablica z danymi o dawnych o³tarzach, schronach bojowych z II WŒ, opuszczonych wioskach wo³oskich. Zawsze z atrybucj¹ do MapaBeskidu.pl.
