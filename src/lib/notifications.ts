export interface ChainEvent {
  delayMs: number; // How long after the user action to spawn this event
  condition: "accepted" | "rejected";
  notification: Omit<NotificationData, "chainEvents">;
}

export interface NotificationData {
  appName: string;
  title: string;
  body: string;
  value: number;
  energyEffect: number;
  isMandatory?: boolean;
  penaltyTitle?: string;
  penaltyBody?: string;
  isPenalty?: boolean;
  chainEvents?: ChainEvent[];
}

export const NOTIFICATIONS_DB: Record<string, NotificationData[]> = {
  "Szkoła": [
    // === Wydatki opcjonalne ===
    { appName: "Gry", title: "Kup nowy skin", body: "Kup nowy skin do Valoranta na bazarku gier (-50zł)", value: -50, energyEffect: 15 },
    { appName: "Gry", title: "Battle Pass", body: "Nowy sezon w Fortnite — wykup przepustkę (-40zł)", value: -40, energyEffect: 12 },
    { appName: "Gry", title: "Doładowanie Steam", body: "Wyprzedaż letnia! Twoja lista życzeń czeka (-80zł)", value: -80, energyEffect: 20 },
    { appName: "Kino", title: "Randka w kinie", body: "Kino z sympatią - bilety i popcorn (-60zł)", value: -60, energyEffect: 20 },
    { appName: "Kino", title: "Premiera Marvela", body: "Nowy film w IMAX z kumplami (-45zł)", value: -45, energyEffect: 18 },
    { appName: "Sklep", title: "Przekąski", body: "Chipsy i energetyk po lekcjach (-15zł)", value: -15, energyEffect: 10 },
    { 
      appName: "Sklep", title: "Nowe buty", body: "Super modne sportowe sneakersy na jesień (-200zł)", value: -200, energyEffect: 25,
      chainEvents: [
        {
          delayMs: 15000,
          condition: "accepted",
          notification: { appName: "Znajomi", title: "Ale fajne kicksy!", body: "Koledzy w szkole zazdroszczą Ci nowych butów", value: 0, energyEffect: 15 }
        }
      ]
    },
    { appName: "Sklep", title: "Ubrania online", body: "Bluza z limitowanej kolekcji ulubionej marki (-120zł)", value: -120, energyEffect: 18 },
    { appName: "Sklep", title: "Słuchawki BT", body: "Bezprzewodowe słuchawki do telefonu (-90zł)", value: -90, energyEffect: 15 },
    { appName: "Znajomi", title: "Pizza na miastku", body: "Zrzutka na wielką margerite (-25zł)", value: -25, energyEffect: 15 },
    { appName: "Znajomi", title: "Paintball", body: "Wyjście na paintball z klasą (-70zł)", value: -70, energyEffect: 22 },
    { appName: "Znajomi", title: "Escape room", body: "Nowy escape room w centrum — idziesz? (-35zł)", value: -35, energyEffect: 15 },
    // === Wydatki obowiązkowe ===
    { appName: "Szkoła", title: "Zrzutka klasowa", body: "Składka na prezent dla wychowawcy za ten rok (-20zł)", value: -20, energyEffect: -10 },
    { appName: "Szkoła", title: "Podręcznik", body: "Książka do języka angielskiego w liceum (-80zł)", value: -80, energyEffect: -15, isMandatory: true, penaltyTitle: "Dodatkowy egzamin", penaltyBody: "Koszty płatnych poprawek przed rady" },
    { appName: "Szkoła", title: "Wycieczka szkolna", body: "Wpłata na wycieczkę do Krakowa (-150zł)", value: -150, energyEffect: -10, isMandatory: true, penaltyTitle: "Brak zwrotu zaliczki", penaltyBody: "Rezygnacja po terminie — wpłata przepada" },
    { appName: "Bilet", title: "Kontrola w MKP", body: "Ważny jednorazowy ulgowy (-3zł)", value: -3, energyEffect: -5, isMandatory: true, penaltyTitle: "Złapał Cię kanar!", penaltyBody: "Kara za jazdę na gapę" },
    { appName: "Abonament", title: "Spotify", body: "Opłata za odnowienie planu uczniowskiego (-10zł)", value: -10, energyEffect: 10, isMandatory: true, penaltyTitle: "Blokada konta", penaltyBody: "Opłata deaktywacyjna i ryczałt" },
    { appName: "Abonament", title: "Karta na siłkę", body: "Miesięczny karnet na siłownię (-60zł)", value: -60, energyEffect: 20, isMandatory: true, penaltyTitle: "Kara za brak wypowiedzenia", penaltyBody: "Automatyczne naliczenie kolejnego miesiąca" },
    // === Przychody ===
    { appName: "Rodzina", title: "Kieszonkowe", body: "Tygodniówka od rodziców gotówką na biurku", value: 50, energyEffect: 5 },
    { appName: "Rodzina", title: "Urodziny", body: "Koperta od babci z najlepszymi życzeniami", value: 100, energyEffect: 10 },
    { appName: "Rodzina", title: "Komunia kuzyna", body: "Babcia dała Ci na 'przyszłość' przy okazji", value: 80, energyEffect: 5 },
    { appName: "Praca", title: "Wyprowadzanie psa", body: "Zapłata od sąsiada za spacer z psem", value: 30, energyEffect: -20 },
    { appName: "Praca", title: "Korepetycje", body: "Uczysz młodszego sąsiada matematyki", value: 60, energyEffect: -15 },
    { appName: "Praca", title: "Sprzedaż na OLX", body: "Stare gry i ubrania znalazły nowych właścicieli", value: 90, energyEffect: -5 },
  ],
  "Studia": [
    // === Wydatki opcjonalne ===
    { 
      appName: "Kumpel", title: "Oddaj BLIKA", body: "Kumpel prosi o BLIKA na wczorajszego kebaba (-30zł)", value: -30, energyEffect: -5,
      chainEvents: [
        {
          delayMs: 25000,
          condition: "accepted",
          notification: { appName: "Kumpel", title: "Zwrot długu", body: "Ziomek oddaje Ci kasę z nawiązką! (+35zł)", value: 35, energyEffect: 5 }
        }
      ]
    },
    { appName: "Kumpel", title: "Pożyczka na czynsz", body: "Współlokator: 'Oddaj, jak wpłynie stypendium' (-200zł)", value: -200, energyEffect: -10 },
    { 
      appName: "Znajomi", title: "Domówka", body: "Składka i prowiant na domówkę u Bartka (-80zł)", value: -80, energyEffect: 25,
      chainEvents: [
        {
          delayMs: 20000,
          condition: "accepted",
          notification: { appName: "Znajomi", title: "Zniszczony dywan", body: "Zrzutka za szkodę wyrządzoną u Bartka (-30zł)", value: -30, energyEffect: -15 }
        }
      ]
    },
    { appName: "Znajomi", title: "Wyjazd integracyjny", body: "Weekend w górach z rokiem (-250zł)", value: -250, energyEffect: 30 },
    { 
      appName: "Klub", title: "Wejściówka", body: "Bilet wstępu na czwartkową imprezę studencką (-30zł)", value: -30, energyEffect: 20,
      chainEvents: [
        {
          delayMs: 15000,
          condition: "accepted",
          notification: { appName: "Catering", title: "Jedzenie na gastro", body: "Po imprezie głód wygrywa - Kebab 24/7 (-45zł)", value: -45, energyEffect: 10 }
        }
      ]
    },
    { appName: "Klub", title: "Drinks w barze", body: "Kolejka drinków dla całej paczki (-75zł)", value: -75, energyEffect: 25 },
    { appName: "Restauracja", title: "Randka wegetariańska", body: "Kolacja w nowym barze ramen (-120zł)", value: -120, energyEffect: 30 },
    { appName: "Restauracja", title: "Sushi z okazji", body: "Zdany egzamin — trzeba to uczcić! (-90zł)", value: -90, energyEffect: 25 },
    { appName: "Catering", title: "Pyszne, na kaca", body: "Podwójny burger z dowozem (-45zł)", value: -45, energyEffect: 15 },
    { appName: "Catering", title: "Tygodniowy meal-box", body: "Zdrowe posiłki na cały tydzień z dostawą (-180zł)", value: -180, energyEffect: 10 },
    { appName: "Uczelnia", title: "Kserówki", body: "Wydruk i bindowanie skryptów przed sesją (-15zł)", value: -15, energyEffect: -15 },
    { appName: "Uczelnia", title: "Konferencja IT", body: "Bilet studencki na lokalny meetup technologiczny (-50zł)", value: -50, energyEffect: -10 },
    { appName: "Sklep", title: "Nowy plecak", body: "Stary się rozleciał — czas na nowy (-130zł)", value: -130, energyEffect: 5 },
    // === Wydatki obowiązkowe ===
    { appName: "Bilet", title: "Bilet miesięczny", body: "Bilet miesięczny ulgowy MZK (-55zł)", value: -55, energyEffect: -10, isMandatory: true, penaltyTitle: "Brak zniżki MZK", penaltyBody: "Grzywna po weryfikacji legitymacji" },
    { appName: "USOS", title: "Warunek", body: "Opłata za powtarzanie przedmiotu na 2 roku (-300zł)", value: -300, energyEffect: -50, isMandatory: true, penaltyTitle: "Widmo skreślenia", penaltyBody: "Kosztowna decyzja dziekana" },
    { appName: "Akademik", title: "Czynsz u P. Jadzi", body: "Opłata za miejsce w zardzewiałym DS-ie (-500zł)", value: -500, energyEffect: -20, isMandatory: true, penaltyTitle: "Brak meldunku", penaltyBody: "Kara karna administracyjna z odsetkami" },
    { appName: "Akademik", title: "Kaucja za pokój", body: "Zwrotna kaucja za nowy pokój w akademiku (-400zł)", value: -400, energyEffect: -15, isMandatory: true, penaltyTitle: "Utrata miejsca", penaltyBody: "Pokój dostaje ktoś inny — szukasz stancji" },
    { appName: "Abonament", title: "Netflix i Gym", body: "Opłaty miesięczne subskrypcji (-100zł)", value: -100, energyEffect: 15, isMandatory: true, penaltyTitle: "Wyciek danych", penaltyBody: "Płatna subskrypcja ukrytych umów" },
    { appName: "Abonament", title: "Telefon na raty", body: "Rata za nowego iPhone'a z operatorem (-85zł)", value: -85, energyEffect: -5, isMandatory: true, penaltyTitle: "Windykacja operatora", penaltyBody: "Zaległość trafia do BIK" },
    // === Przychody ===
    { appName: "Praca", title: "Wypłata Gastro", body: "Zarobki z barmańskiej nocki z weekendu", value: 400, energyEffect: -40 },
    { appName: "Praca", title: "Freelance design", body: "Zapłata za projekt logo dla znajomego firmy", value: 300, energyEffect: -25 },
    { appName: "Praca", title: "Korepetycje online", body: "Uczysz 3 osoby angielskiego przez Zoom", value: 250, energyEffect: -20 },
    { appName: "Stypendium", title: "Naukowe", body: "Za wyniki w nauce", value: 800, energyEffect: 20 },
    { appName: "Stypendium", title: "Socjalne", body: "Dofinansowanie z uczelni na podstawie dochodu", value: 600, energyEffect: 10 },
    { appName: "Rodzina", title: "Przelew od rodziców", body: "Comiesięczne wsparcie na życie na studiach", value: 500, energyEffect: 5 },
  ],
  "Dorosłość": [
    // === Wydatki opcjonalne ===
    { appName: "Spożywcze", title: "Wielkie zakupy", body: "Uzupełniona domowa lodówka na nadchodzący tydzień (-350zł)", value: -350, energyEffect: -15 },
    { appName: "Spożywcze", title: "Zakupy premium", body: "Bio, eko, organic — zdrowe jedzenie ma swoją cenę (-500zł)", value: -500, energyEffect: 10 },
    { 
      appName: "Mechanik", title: "Naprawa auta", body: "Wymiana rozrządu, stukanie w zawieszeniu (-1200zł)", value: -1200, energyEffect: -40,
      chainEvents: [
        {
          delayMs: 22000,
          condition: "rejected",
          notification: { appName: "Mechanik", title: "Awaria na A4!", body: "Laweta i mechanik poza miastem zrujnowali portfel (-2500zł)", value: -2500, energyEffect: -80, isMandatory: true }
        }
      ]
    },
    { appName: "Mechanik", title: "Przegląd techniczny", body: "Roczny przegląd i wymiana oleju (-400zł)", value: -400, energyEffect: -10 },
    { appName: "Wakacje", title: "Bilet Lotniczy", body: "Wylot na Maderę na city break (-900zł)", value: -900, energyEffect: 60 },
    { appName: "Wakacje", title: "All-inclusive Turcja", body: "Tydzień w hotelu z widokiem na morze (-3500zł)", value: -3500, energyEffect: 50 },
    { appName: "Rodzina", title: "Chrzest i Wesele", body: "Pokaźna koperta wrzucona jako gość na imprezie (-1000zł)", value: -1000, energyEffect: -20 },
    { appName: "Prezent", title: "Dla teściowej", body: "Prezent w ramach zapunktowania przed wigilią (-100zł)", value: -100, energyEffect: -15 },
    { appName: "Prezent", title: "Rocznica", body: "Restauracja + pierścionek na rocznicę ślubu (-800zł)", value: -800, energyEffect: 30 },
    { appName: "Restauracja", title: "Firmowa kolacja", body: "Networking przy dobrej kuchni z klientem (-250zł)", value: -250, energyEffect: 15 },
    { appName: "Sklep", title: "Meble do salonu", body: "Nowa kanapa i stolik kawowy (-2500zł)", value: -2500, energyEffect: 10 },
    { appName: "Sklep", title: "Laptop do pracy", body: "Narzędzie pracy — MacBook Pro (-6000zł)", value: -6000, energyEffect: -30 },
    { appName: "Abonament", title: "Pakiet premium", body: "Netflix + Spotify + iCloud razem (-80zł)", value: -80, energyEffect: 10 },
    // === Wydatki obowiązkowe ===
    { appName: "AGD", title: "Rata za pralkę", body: "Comiesięczna rata na pralko-suszarkę sprzętu (-150zł)", value: -150, energyEffect: -20, isMandatory: true, penaltyTitle: "Komornik w domu!", penaltyBody: "Koszty firmy windykacyjnej" },
    { appName: "Dom", title: "Czynsz wynajmu", body: "Za kawalerkę obok centrum miasta (-1500zł)", value: -1500, energyEffect: -30, isMandatory: true, penaltyTitle: "Nakaz eksmisji", penaltyBody: "Drastyczne rozwiązanie umowy!" },
    { appName: "Dom", title: "Rata kredytu", body: "Rata kredytu hipotecznego w PKO Bank Polski (-2200zł)", value: -2200, energyEffect: -35, isMandatory: true, penaltyTitle: "Wpis do BIK", penaltyBody: "Utrata zdolności kredytowej na lata!" },
    { appName: "US", title: "Podatek PIT", body: "Niedopłata podatku dochodowego za ubiegły rok (-500zł)", value: -500, energyEffect: -50, isMandatory: true, penaltyTitle: "KAS", penaltyBody: "Dotkliwa grzywna skarbowa" },
    { appName: "US", title: "Składka ZUS", body: "Obowiązkowa składka zdrowotna i społeczna (-1400zł)", value: -1400, energyEffect: -40, isMandatory: true, penaltyTitle: "Egzekucja komornicza", penaltyBody: "ZUS nie odpuszcza — zajęcie konta!" },
    { appName: "Auto", title: "Ubezpieczenie OC", body: "Zapłata rocznego ubezpieczenia (-800zł)", value: -800, energyEffect: -30, isMandatory: true, penaltyTitle: "Kary z UFG", penaltyBody: "Bezwzględna weryfikacja bazy pojazdów!" },
    { appName: "Klinika", title: "Prywatny dentysta", body: "Leczenie kanałowe ropy i nagły stan zapalny (-600zł)", value: -600, energyEffect: -50, isMandatory: true, penaltyTitle: "SOR Karetka", penaltyBody: "Opłata za prywatny ostry dyżur w weekend" },
    { appName: "PGE", title: "Rachunek za prąd", body: "Wyrównanie prądu za ostatnie sześć miesięcy (-250zł)", value: -250, energyEffect: -25, isMandatory: true, penaltyTitle: "Zgasło światło", penaltyBody: "Ponoszenie kosztów wznowienia przesyłu prądu!" },
    { appName: "PGE", title: "Rachunek za gaz", body: "Sezon grzewczy — wyrównanie za ogrzewanie (-600zł)", value: -600, energyEffect: -20, isMandatory: true, penaltyTitle: "Odcięcie gazu", penaltyBody: "Koszt ponownego otwarcia instalacji" },
    // === Przychody ===
    { appName: "Praca", title: "Pensja z pracy", body: "Twoje wynagrodzenie za cały etat B2B/UoP", value: 4500, energyEffect: -60 },
    { appName: "Praca", title: "Premia kwartalna", body: "Bonus za osiągnięcie targetów w Q2", value: 2000, energyEffect: 15 },
    { 
      appName: "Praca", title: "Nadgodziny", body: "Dodatkowe godziny w projekcie specjalnym", value: 1200, energyEffect: -50,
      chainEvents: [
        {
          delayMs: 18000,
          condition: "accepted",
          notification: { appName: "Klinika", title: "Przemęczenie", body: "Leki i kroplówki wzmacniające z powodu przepracowania (-400zł)", value: -400, energyEffect: 20 }
        }
      ]
    },
    { appName: "Bank", title: "Oprocentowanie", body: "Wpływ z tytułu zyskownych lokat i kont oszczędnościowych", value: 200, energyEffect: 10 },
    { appName: "Bank", title: "Zwrot podatku", body: "Nadpłata PIT wróciła na Twoje konto PKO!", value: 800, energyEffect: 15 },
    { appName: "Bank", title: "Cashback", body: "Zwrot za zakupy kartą PKO w programie lojalnościowym", value: 50, energyEffect: 5 },
  ]
};
