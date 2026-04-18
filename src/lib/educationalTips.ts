export interface EducationalTip {
  icon: string;
  text: string;
}

type Action = "accept" | "reject" | "expire";

// Tips organized by appName/category and action taken
const TIPS_DB: Record<string, Partial<Record<Action, EducationalTip[]>>> = {
  // ===== SZKOŁA =====
  "Gry": {
    accept: [
      { icon: "🎮", text: "Mikrotransakcje w grach to nowoczesna pułapka — wydatki 50 zł/msc to 600 zł rocznie. Z PKO Junior możesz ustawić limity." },
      { icon: "💡", text: "Zanim kupisz skin, zadaj sobie pytanie: czy za miesiąc nadal będzie mi się podobał?" },
    ],
    reject: [
      { icon: "👏", text: "Dobra decyzja! Odmówienie impulsowego zakupu to jeden z najtrudniejszych nawyków finansowych." },
    ],
  },
  "Szkoła": {
    accept: [
      { icon: "📚", text: "Inwestycja w edukację to jedna z najlepszych inwestycji — zwraca się wielokrotnie w przyszłej karierze." },
      { icon: "🏫", text: "Zrzutki klasowe to Twoje pierwsze doświadczenie z finansami grupowymi — ważna umiejętność na przyszłość." },
    ],
    reject: [
      { icon: "⚠️", text: "Oszczędzanie na edukacji rzadko się opłaca — brak materiałów utrudnia naukę i może kosztować więcej." },
    ],
  },
  "Kino": {
    accept: [
      { icon: "🎬", text: "Rozrywka jest ważna, ale planuj ją w budżecie! Z PKO możesz założyć osobne konto na przyjemności." },
    ],
    reject: [
      { icon: "💪", text: "Odmówienie droższej rozrywki to znak dojrzałości finansowej. Są tańsze alternatywy!" },
    ],
  },
  "Sklep": {
    accept: [
      { icon: "🛒", text: "Małe codzienne wydatki sumują się szybko. 15 zł dziennie to ponad 5400 zł rocznie!" },
      { icon: "👟", text: "Zasada 30 dni: chcesz coś drogiego? Odczekaj miesiąc. Jeśli nadal chcesz — kup." },
    ],
    reject: [
      { icon: "📊", text: "PKO Tip: Sprawdź historię transakcji w aplikacji IKO — zobacz, ile wydajesz na drobne zakupy." },
    ],
  },
  "Bilet": {
    accept: [
      { icon: "🚌", text: "Terminowe opłaty za transport to podstawa. Z PKO możesz ustawić automatyczne przelewy cykliczne." },
    ],
    reject: [
      { icon: "🚨", text: "Uwaga! Mandat za brak biletu to wielokrotność jego ceny. Obowiązkowe opłaty zawsze się opłaca płacić." },
    ],
    expire: [
      { icon: "⏰", text: "Zignorowany rachunek nie znika — wraca z odsetkami. W PKO możesz ustawić przypomnienia o płatnościach." },
    ],
  },
  "Rodzina": {
    accept: [
      { icon: "👨‍👩‍👧", text: "Dochody od rodziny to prezent — mądrze zarządzaj nimi. Z PKO Junior możesz zacząć oszczędzać od teraz." },
      { icon: "🎁", text: "Pieniądze z okazji to szansa na oszczędności. Odłóż choćby 30% na przyszłość!" },
    ],
  },
  "Abonament": {
    accept: [
      { icon: "📱", text: "Subskrypcje to ciche obciążenie budżetu. 10 zł tu, 30 zł tam — sprawdź, ile płacisz sumarycznie." },
      { icon: "🔄", text: "PKO Tip: W aplikacji IKO możesz wychwycić powtarzające się płatności i zdecydować, które zostawić." },
    ],
    reject: [
      { icon: "✂️", text: "Audit subskrypcji — to jedna z najszybszych metod oszczędzania. Każde anulowanie to czysty zysk." },
    ],
  },
  "Znajomi": {
    accept: [
      { icon: "🍕", text: "Wydatki społeczne to ważna część życia, ale ustalaj z góry budżet na wyjścia z paczką." },
    ],
    reject: [
      { icon: "🤝", text: "Odmawianie nie znaczy bycie skąpym — to świadome zarządzanie priorytetami finansowymi." },
    ],
  },
  "Praca": {
    accept: [
      { icon: "💼", text: "Zarabianie własnych pieniędzy to najlepsza lekcja finansowa. Z PKO możesz otworzyć konto oszczędnościowe na cele." },
      { icon: "💪", text: "Każdy zarobiony złotówka uczy wartości pracy. Planuj, ile z wypłaty odłożysz!" },
    ],
  },

  // ===== STUDIA =====
  "Kumpel": {
    accept: [
      { icon: "📲", text: "BLIK to wygoda, ale pilnuj, komu pożyczasz. W PKO możesz ustawić limity BLIK w IKO." },
    ],
    reject: [
      { icon: "🤔", text: "Odmawianie pożyczek znajomym jest trudne, ale chroni Twój budżet i relacje." },
    ],
  },
  "Uczelnia": {
    accept: [
      { icon: "🎓", text: "Inwestycja w naukę to fundament przyszłych zarobków. Warto planować te wydatki." },
    ],
  },
  "Klub": {
    accept: [
      { icon: "🎉", text: "Imprezowanie to część studenckiego życia — ale ustal tygodniowy limit na rozrywkę." },
    ],
    reject: [
      { icon: "🧠", text: "Świadoma rezygnacja z imprez dla budżetu? To dojrzałość finansowa w praktyce!" },
    ],
  },
  "Restauracja": {
    accept: [
      { icon: "🍜", text: "Jedzenie na mieście vs gotowanie w domu — różnica to nawet 1000 zł miesięcznie." },
    ],
    reject: [
      { icon: "🏠", text: "Gotowanie w domu to oszczędność 60-70% kosztów jedzenia. Prosty przepis = pełny portfel." },
    ],
  },
  "USOS": {
    accept: [
      { icon: "📋", text: "Warunkowe to bolesny wydatek, ale inwestycja w ukończenie studiów. Zaplanuj go w budżecie." },
    ],
    expire: [
      { icon: "🚫", text: "Ignorowanie opłat uczelnianych może oznaczać skreślenie z listy studentów — konsekwencje rosną!" },
    ],
  },
  "Akademik": {
    accept: [
      { icon: "🏠", text: "Czynsz to największy stały wydatek. Zawsze płać na czas — opóźnienia generują karne odsetki." },
    ],
    expire: [
      { icon: "⚠️", text: "Brak terminowej płatności czynszu = ryzyko eksmisji i negatywny wpis w BIK." },
    ],
  },
  "Catering": {
    accept: [
      { icon: "🍔", text: "Zamawianie jedzenia z dostawą to średnio 3× drożej niż gotowanie. Planuj posiłki!" },
    ],
    reject: [
      { icon: "🥗", text: "Meal prep oszczędza czas i pieniądze — to nawyk zamożnych ludzi, nie tylko oszczędnych." },
    ],
  },
  "Stypendium": {
    accept: [
      { icon: "🏆", text: "Stypendium to nagroda za ciężką pracę! Odłóż część — fundusz awaryjny buduje się latami." },
    ],
  },

  // ===== DOROSŁOŚĆ =====
  "AGD": {
    accept: [
      { icon: "🔧", text: "Raty to zobowiązanie — PKO oferuje kalkulatory rat, żebyś wiedział, ile naprawdę płacisz." },
    ],
    expire: [
      { icon: "⚖️", text: "Niespłacone raty trafiają do windykacji i negatywnie wpływają na Twoją zdolność kredytową w BIK." },
    ],
  },
  "Dom": {
    accept: [
      { icon: "🏠", text: "Czynsz to zwykle 25-35% dochodu. Więcej? Szukaj tańszej opcji. Z PKO sprawdzisz oferty kredytów hipotecznych." },
    ],
    expire: [
      { icon: "🚪", text: "Brak płatności czynszu prowadzi do eksmisji i niszczenia historii kredytowej." },
    ],
  },
  "US": {
    accept: [
      { icon: "🏛️", text: "Podatki to obowiązek każdego obywatela. PKO pomaga w rozliczeniu PIT przez e-Urząd Skarbowy." },
    ],
    expire: [
      { icon: "⚖️", text: "Zaległości podatkowe rosną szybko — odsetki naliczane są każdego dnia!" },
    ],
  },
  "Auto": {
    accept: [
      { icon: "🚗", text: "OC to obowiązkowe ubezpieczenie. Bez niego UFG naliczy karę nawet kilku tysięcy złotych." },
    ],
    expire: [
      { icon: "🚨", text: "Brak OC = automatyczna kara od UFG. To jedna z najdroższych kar administracyjnych w Polsce." },
    ],
  },
  "Spożywcze": {
    accept: [
      { icon: "🛒", text: "Lista zakupów zmniejsza wydatki o 20-30%. Planuj posiłki na tydzień w aplikacji IKO PKO." },
    ],
    reject: [
      { icon: "⚠️", text: "Jedzenie to podstawa — oszczędzanie tu musi mieć granice. Zdrowie > pieniądze." },
    ],
  },
  "Mechanik": {
    accept: [
      { icon: "🔧", text: "Regularne przeglądy auta kosztują mniej niż nagłe naprawy. Fundusz awaryjny się tu opłaca." },
    ],
  },
  "Klinika": {
    accept: [
      { icon: "🏥", text: "Zdrowie to inwestycja #1. PKO oferuje ubezpieczenia zdrowotne — sprawdź ofertę w IKO." },
    ],
    expire: [
      { icon: "🚑", text: "Zaniedbanie zdrowia zawsze kosztuje więcej — przewlekłe choroby to wieloletnie wydatki." },
    ],
  },
  "PGE": {
    accept: [
      { icon: "⚡", text: "Rachunki za media to stały wydatek. PKO Zlecenie Stałe gwarantuje, że nigdy nie zapomnisz." },
    ],
    expire: [
      { icon: "🔌", text: "Brak płatności za prąd = odcięcie dostawy + koszt ponownego podłączenia." },
    ],
  },
  "Bank": {
    accept: [
      { icon: "🏦", text: "Odsetki od lokat w PKO to pasywny dochód — Twoje pieniądze pracują, gdy Ty śpisz!" },
    ],
  },
  "Wakacje": {
    accept: [
      { icon: "✈️", text: "Wakacje to ważna regeneracja, ale planuj je z wyprzedzeniem — early booking = duże oszczędności." },
    ],
    reject: [
      { icon: "🏖️", text: "Rezygnacja z wakacji to krótkoterminowa oszczędność, ale pamiętaj o work-life balance!" },
    ],
  },
  "Prezent": {
    accept: [
      { icon: "🎀", text: "Prezenty to wydatki społeczne — w grudniu warto mieć osobny fundusz na świąteczne zakupy." },
    ],
  },

  // ===== KARY =====
  "KARA!": {
    accept: [
      { icon: "💸", text: "Kary finansowe to najdroższa lekcja. W PKO możesz ustawić automatyczne przelewy, żeby ich unikać." },
      { icon: "📉", text: "Każda kara to pieniądze, które mogłeś zainwestować. Terminowość = oszczędność." },
    ],
  },

  // ===== GENERYCZNE FALLBACKI =====
  "_default": {
    accept: [
      { icon: "💰", text: "Każda decyzja finansowa to wybór — to, na co wydajesz, mówi o Twoich priorytetach." },
      { icon: "📊", text: "PKO Tip: Regularnie przeglądaj historię transakcji w IKO — świadomość wydatków to pierwszy krok." },
      { icon: "🧮", text: "Zasada 50/30/20: 50% na potrzeby, 30% na zachcianki, 20% na oszczędności." },
    ],
    reject: [
      { icon: "🛡️", text: "Każde 'nie' na wydatek to 'tak' na Twoje oszczędności. Budujesz poduszkę finansową!" },
      { icon: "💪", text: "Samodyscyplina finansowa to supermoc — rozwijasz nawyk, który procentuje latami." },
    ],
    expire: [
      { icon: "⏰", text: "Odkładanie decyzji finansowych 'na później' to też decyzja — często najdroższa." },
      { icon: "📋", text: "W prawdziwym życiu nieopłacone rachunki generują odsetki. Reaguj na czas!" },
    ],
  },
};

/**
 * Get a contextual educational tip based on the notification category and action taken.
 */
export function getRandomTip(appName: string, action: Action): EducationalTip | null {
  // Try category-specific tip first
  const categoryTips = TIPS_DB[appName]?.[action];
  if (categoryTips && categoryTips.length > 0) {
    return categoryTips[Math.floor(Math.random() * categoryTips.length)];
  }

  // Fall back to default tips
  const defaultTips = TIPS_DB["_default"]?.[action];
  if (defaultTips && defaultTips.length > 0) {
    return defaultTips[Math.floor(Math.random() * defaultTips.length)];
  }

  return null;
}

/**
 * Get a completely random educational tip from the entire database.
 */
export function getAnyRandomTip(): EducationalTip {
  const allTips: EducationalTip[] = [];
  for (const appName in TIPS_DB) {
    const actions = TIPS_DB[appName];
    if (actions.accept) allTips.push(...actions.accept);
    if (actions.reject) allTips.push(...actions.reject);
    if (actions.expire) allTips.push(...actions.expire);
  }
  return allTips[Math.floor(Math.random() * allTips.length)];
}
