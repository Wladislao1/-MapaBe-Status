# MapaBe Status & Health Monitor 🟢

Witamy w repozytorium testowym projektu **[MapaBeskidu.pl](https://mapabeskidu.pl)**.
Ten kod operuje całkowicie poza serwerem OVH i ma za zadanie z zewnątrz monitorować stan strony internetowej, wydajność (Lighthouse) oraz wczesne wykrywanie awarii.

### Bieżący stan:
* **Uptime (Dostępność):** [![Uptime Monitor](https://github.com/Wladislao1/-MapaBe-Status/actions/workflows/uptime.yml/badge.svg)](https://github.com/Wladislao1/-MapaBe-Status/actions/workflows/uptime.yml)
* **Lighthouse (Wydajność):** [![Lighthouse CI](https://github.com/Wladislao1/-MapaBe-Status/actions/workflows/lighthouse.yml/badge.svg)](https://github.com/Wladislao1/-MapaBe-Status/actions/workflows/lighthouse.yml)

## Jak to działa?
1. **Uptime Monitor**: GitHub sprawdza adres `mapabeskidu.pl` co 30 minut. Jeśli strona zwróci błąd, plakietka u góry zaświeci się na czerwono.
2. **Lighthouse CI**: Codziennie o 3:00 w nocy automatyczny system Google renderuje stronę jak prawdziwy użytkownik na telefonie komórkowym i sprawdza jej prędkość ładowania oraz poprawność SEO. Wyniki są dostępne w zakładce **Actions**.

---
*Zbudowane w celu zapewnienia absolutnej stabilności mapy turystycznej.*
