export interface NotificationData {
  appName: string;
  title: string;
  body: string;
  value: number;
  isMandatory?: boolean;
  penaltyTitle?: string;
  penaltyBody?: string;
  isPenalty?: boolean;
}

export const NOTIFICATIONS_DB: Record<string, NotificationData[]> = {
  "Szkoła": [
    { appName: "Gry", title: "Kup nowy skin", body: "Kup nowy skin do Valoranta na bazarku gier (-50zł)", value: -50 },
    { appName: "Szkoła", title: "Zrzutka klasowa", body: "Składka na prezent dla wychowawcy za ten rok (-20zł)", value: -20 },
    { appName: "Kino", title: "Randka w kinie", body: "Kino z sympatią - bilety i popcorn (-60zł)", value: -60 },
    { appName: "Sklep", title: "Przekąski", body: "Chipsy i energetyk po lekcjach (-15zł)", value: -15 },
    { appName: "Bilet", title: "Kontrola w MKP", body: "Ważny jednorazowy ulgowy (-3zł)", value: -3, isMandatory: true, penaltyTitle: "Złapał Cię kanar!", penaltyBody: "Kara za jazdę na gapę" },
    { appName: "Rodzina", title: "Kieszonkowe", body: "Tygodniówka od rodziców gotówką na biurku", value: 50 },
    { appName: "Rodzina", title: "Urodziny", body: "Koperta od babci z najlepszymi życzeniami", value: 100 },
    { appName: "Sklep", title: "Nowe buty", body: "Super modne sportowe sneakersy na jesień (-200zł)", value: -200 },
    { appName: "Abonament", title: "Spotify", body: "Opłata za odnowienie planu uczniowskiego (-10zł)", value: -10, isMandatory: true, penaltyTitle: "Blokada konta", penaltyBody: "Opłata deaktywacyjna i ryczałt" },
    { appName: "Szkoła", title: "Podręcznik", body: "Książka do języka angielskiego w liceum (-80zł)", value: -80, isMandatory: true, penaltyTitle: "Dodatkowy egzamin", penaltyBody: "Koszty płatnych poprawek przed rady" },
    { appName: "Znajomi", title: "Pizza na miastku", body: "Zrzutka na wielką margerite (-25zł)", value: -25 },
    { appName: "Praca", title: "Wyprowadzanie psa", body: "Zapłata od sąsiada za spacer z psem", value: 30 }
  ],
  "Studia": [
    { appName: "Kumpel", title: "Oddaj BLIKA", body: "Kumpel prosi o BLIKA na wczorajszego kebaba (-30zł)", value: -30 },
    { appName: "Bilet", title: "Bilet miesięczny", body: "Bilet miesięczny ulgowy MZK (-55zł)", value: -55, isMandatory: true, penaltyTitle: "Brak zniżki MZK", penaltyBody: "Grzywna po weryfikacji legitymacji" },
    { appName: "Znajomi", title: "Domówka", body: "Składka i prowrowiant na domówkę u Bartka (-80zł)", value: -80 },
    { appName: "Uczelnia", title: "Kserówki", body: "Wydruk i bindowanie skryptów przed sesją (-15zł)", value: -15 },
    { appName: "Praca", title: "Wypłata Gastro", body: "Zarobki z barmańskiej nocki z weekendu", value: 400 },
    { appName: "Klub", title: "Wejściówka", body: "Bilet wstępu na czwartkową imprezę studencką (-30zł)", value: -30 },
    { appName: "Restauracja", title: "Randka wegetariańska", body: "Kolacja w nowym barze ramen (-120zł)", value: -120 },
    { appName: "USOS", title: "Warunek", body: "Opłata za powtarzanie przedmiotu na 2 roku (-300zł)", value: -300, isMandatory: true, penaltyTitle: "Widmo skreślenia", penaltyBody: "Kosztowna decyzja dziekana" },
    { appName: "Akademik", title: "Czynsz u P. Jadzi", body: "Opłata za miejsce w zardzewiałym DS-ie (-500zł)", value: -500, isMandatory: true, penaltyTitle: "Brak meldunku", penaltyBody: "Kara karna administracyjna z odsetkami" },
    { appName: "Catering", title: "Pyszne, na kaca", body: "Podwójny burger z dowozem (-45zł)", value: -45 },
    { appName: "Stypendium", title: "Naukowe", body: "Za wyniki w nauce", value: 800 },
    { appName: "Abonament", title: "Netflix i Gym", body: "Opłaty miesięczne subskrypcji (-100zł)", value: -100, isMandatory: true, penaltyTitle: "Wyciek danych", penaltyBody: "Płatna subskrypcja ukrytych umów" }
  ],
  "Dorosłość": [
    { appName: "AGD", title: "Rata za pralkę", body: "Comiesięczna rata na pralko-suszarkę sprzętu (-150zł)", value: -150, isMandatory: true, penaltyTitle: "Komornik w domu!", penaltyBody: "Koszty firmy windykacyjnej" },
    { appName: "Dom", title: "Czynsz wynajmu", body: "Za kawalerkę obok centrum miasta (-1500zł)", value: -1500, isMandatory: true, penaltyTitle: "Nakaz eksmisji", penaltyBody: "Drastyczne rozwiązanie umowy!" },
    { appName: "US", title: "Podatek PIT", body: "Niedopłata podatku dochodowego za ubiegły rok (-500zł)", value: -500, isMandatory: true, penaltyTitle: "KAS", penaltyBody: "Dotkliwa grzywna skarbowa" },
    { appName: "Auto", title: "Ubezpieczenie OC", body: "Zapłata rocznego ubezpieczenia (-800zł)", value: -800, isMandatory: true, penaltyTitle: "Kary z UFG", penaltyBody: "Bezwzględna weryfikacja bazy pojazdów!" },
    { appName: "Praca", title: "Pensja z pracy", body: "Twoje wynagrodzenie za cały etat B2B/UoP", value: 4500 },
    { appName: "Spożywcze", title: "Wielkie zakupy", body: "Uzupełniona domowa lodówka na nadchodzący tydzień (-350zł)", value: -350 },
    { appName: "Mechanik", title: "Naprawa auta", body: "Wymiana rozrządu, stukanie w zawieszeniu (-1200zł)", value: -1200 },
    { appName: "Klinika", title: "Prywatny dentysta", body: "Leczenie kanałowe ropy i nagły stan zapalny (-600zł)", value: -600, isMandatory: true, penaltyTitle: "SOR Karetka", penaltyBody: "Opłata za prywatny ostry dyżur w weekend" },
    { appName: "PGE", title: "Rachunek za prąd", body: "Wyrównanie prądu za ostatnie sześć miesięcy (-250zł)", value: -250, isMandatory: true, penaltyTitle: "Zgasło światło", penaltyBody: "Ponoszenie kosztów wznowienia przesyłu prądu!" },
    { appName: "Bank", title: "Oprocentowanie", body: "Wpływ z tytułu zyskownych lokat i kont oszczędnościowych", value: 200 },
    { appName: "Wakacje", title: "Bilet Lotniczy", body: "Wylot na Maderę na city break (-900zł)", value: -900 },
    { appName: "Rodzina", title: "Chrzest i Wesele", body: "Pokaźna koperta wrzucona jako gość na imprezie (-1000zł)", value: -1000 },
    { appName: "Prezent", title: "Dla teściowej", body: "Prezent w ramach zapunktowania przed wigilią (-100zł)", value: -100 }
  ]
};
