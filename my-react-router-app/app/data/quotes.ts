/**
 * Motivational Quotes for IU Student Plattform
 * Each quote has German (quote_de), English (quote_en) versions and author
 */

export interface Quote {
  quote_en: string;
  quote_de: string;
  author: string;
}

export const MOTIVATIONAL_QUOTES: Quote[] = [
  // === Inspiration & Beginnings ===
  { quote_en: "The way to get started is to quit talking and begin doing.", quote_de: "Der erste Schritt besteht darin, mit dem Reden aufzuhören und mit dem Tun zu beginnen.", author: "Walt Disney" },
  { quote_en: "Don't wait. The time will never be just right.", quote_de: "Warte nicht. Die Zeit wird niemals perfekt sein.", author: "Napoleon Hill" },
  { quote_en: "Start where you are. Use what you have. Do what you can.", quote_de: "Starte dort, wo du bist. Nutze, was du hast. Tu, was du kannst.", author: "Arthur Ashe" },
  
  // === Dreams & Goals ===
  { quote_en: "The future belongs to those who believe in the beauty of their dreams.", quote_de: "Die Zukunft gehört denen, die an die Schönheit ihrer Träume glauben.", author: "Eleanor Roosevelt" },
  { quote_en: "Dream big and dare to fail.", quote_de: "Träume groß und wage es zu scheitern.", author: "Norman Vaughn" },
  { quote_en: "If you can dream it, you can do it.", quote_de: "Wenn du es träumen kannst, kannst du es tun.", author: "Walt Disney" },
  { quote_en: "The best way to predict your future is to create it.", quote_de: "Der beste Weg, deine Zukunft vorherzusagen, ist, sie zu gestalten.", author: "Abraham Lincoln" },
  { quote_en: "Setting goals is the first step in turning the invisible into the visible.", quote_de: "Ziele zu setzen ist der erste Schritt, das Unsichtbare sichtbar zu machen.", author: "Tony Robbins" },
  
  // === Success & Achievement ===
  { quote_en: "Success usually comes to those who are too busy to be looking for it.", quote_de: "Erfolg kommt meist denen, die zu beschäftigt sind, ihn zu suchen.", author: "Henry David Thoreau" },
  { quote_en: "What you get by achieving your goals is not as important as what you become by achieving your goals.", quote_de: "Was du durch das Erreichen deiner Ziele bekommst, ist nicht so wichtig wie das, was du wirst, indem du deine Ziele erreichst.", author: "Zig Ziglar" },
  { quote_en: "The only way to do great work is to love what you do.", quote_de: "Der einzige Weg, großartige Arbeit zu leisten, ist, zu lieben, was du tust.", author: "Steve Jobs" },
  { quote_en: "Action is the foundational key to all success.", quote_de: "Handeln ist der fundamentale Schlüssel zu jedem Erfolg.", author: "Pablo Picasso" },
  
  // === Perseverance & Resilience ===
  { quote_en: "It always seems impossible until it's done.", quote_de: "Es scheint immer unmöglich, bis es getan ist.", author: "Nelson Mandela" },
  { quote_en: "Don't watch the clock; do what it does. Keep going.", quote_de: "Beobachte die Uhr nicht; tu, was sie tut: Weiterlaufen.", author: "Sam Levenson" },
  { quote_en: "It does not matter how slowly you go as long as you do not stop.", quote_de: "Es ist egal, wie langsam du gehst — solange du nicht stehen bleibst.", author: "Confucius" },
  { quote_en: "The best way out is always through.", quote_de: "Der beste Weg hinaus führt immer hindurch.", author: "Robert Frost" },
  { quote_en: "Energy and persistence conquer all things.", quote_de: "Energie und Ausdauer besiegen alle Dinge.", author: "Benjamin Franklin" },
  
  // === Self-Belief ===
  { quote_en: "Believe you can and you're halfway there.", quote_de: "Glaube, dass du es kannst — und du bist schon halb dort.", author: "Theodore Roosevelt" },
  { quote_en: "Believe in yourself and all that you are.", quote_de: "Glaube an dich selbst und alles, was du bist.", author: "Christian D. Larson" },
  { quote_en: "Be yourself; everyone else is already taken.", quote_de: "Sei du selbst; alle anderen gibt es schon.", author: "Oscar Wilde" },
  { quote_en: "Whether you think you can or you think you can't, you're right.", quote_de: "Ob du denkst, du kannst es, oder du denkst, du kannst es nicht — du hast recht.", author: "Henry Ford" },
  
  // === Learning & Growth ===
  { quote_en: "Learning never exhausts the mind.", quote_de: "Lernen ermüdet den Geist niemals.", author: "Leonardo da Vinci" },
  { quote_en: "A person who never made a mistake never tried anything new.", quote_de: "Wer niemals einen Fehler gemacht hat, hat niemals etwas Neues versucht.", author: "Albert Einstein" },
  { quote_en: "Education is the most powerful weapon which you can use to change the world.", quote_de: "Bildung ist die mächtigste Waffe, die du verwenden kannst, um die Welt zu verändern.", author: "Nelson Mandela" },
  { quote_en: "Tell me and I forget. Teach me and I remember. Involve me and I learn.", quote_de: "Erzähle es mir und ich vergesse. Lehre mich und ich erinnere mich. Beziehe mich mit ein und ich lerne.", author: "Benjamin Franklin" },
  { quote_en: "The roots of education are bitter, but the fruit is sweet.", quote_de: "Die Wurzeln der Bildung sind bitter, aber die Früchte sind süß.", author: "Aristotle" },
  
  // === Failure & Mistakes ===
  { quote_en: "Failure is simply the opportunity to begin again, this time more intelligently.", quote_de: "Fehlschlag ist einfach die Gelegenheit, neu zu beginnen — dieses Mal intelligenter.", author: "Henry Ford" },
  { quote_en: "Many of life's failures are people who did not realize how close they were to success when they gave up.", quote_de: "Viele der Misserfolge im Leben sind Menschen, die nicht erkannt haben, wie nah sie dem Erfolg waren, als sie aufgaben.", author: "Thomas Edison" },
  { quote_en: "The greatest mistake you can make in life is to be continually fearing you will make one.", quote_de: "Der größte Fehler, den du im Leben machen kannst, ist, ständig zu fürchten, einen Fehler zu machen.", author: "Elbert Hubbard" },
  
  // === Strength & Challenges ===
  { quote_en: "Hardships often prepare ordinary people for an extraordinary destiny.", quote_de: "Schwierigkeiten bereiten gewöhnliche Menschen oft für ein außergewöhnliches Schicksal vor.", author: "C. S. Lewis" },
  { quote_en: "Strength does not come from winning. Your struggles develop your strengths.", quote_de: "Stärke kommt nicht vom Gewinnen. Deine Kämpfe entwickeln deine Stärke.", author: "Arnold Schwarzenegger" },
  { quote_en: "The greatest glory in living lies not in never falling, but in rising every time we fall.", quote_de: "Die größte Ehre im Leben liegt nicht darin, nie zu fallen, sondern jedes Mal aufzustehen, wenn wir fallen.", author: "Ralph Waldo Emerson" },
  { quote_en: "We may encounter many defeats but we must not be defeated.", quote_de: "Wir mögen vielen Niederlagen begegnen — aber wir dürfen nicht besiegt werden.", author: "Maya Angelou" },
  
  // === Time & Life ===
  { quote_en: "Your time is limited, don't waste it living someone else's life.", quote_de: "Deine Zeit ist begrenzt — verschwende sie nicht damit, das Leben eines Anderen zu leben.", author: "Steve Jobs" },
  { quote_en: "Don't let yesterday take up too much of today.", quote_de: "Lass nicht zu, dass gestern zu viel von heute einnimmt.", author: "Will Rogers" },
  { quote_en: "Don't count the days, make the days count.", quote_de: "Zähle nicht die Tage, lasse die Tage zählen.", author: "Muhammad Ali" },
  { quote_en: "Life is what happens when you're busy making other plans.", quote_de: "Das Leben ist das, was passiert, während du beschäftigt bist, andere Pläne zu machen.", author: "John Lennon" },
  { quote_en: "In three words I can sum up everything I've learned about life: it goes on.", quote_de: "Mit drei Worten kann ich alles, was ich über das Leben gelernt habe, zusammenfassen: Es geht weiter.", author: "Robert Frost" },
  { quote_en: "Life is 10% what happens to us and 90% how we react to it.", quote_de: "Das Leben besteht zu 10 % aus dem, was uns geschieht — und zu 90 % aus der Art, wie wir darauf reagieren.", author: "Charles R. Swindoll" },
  { quote_en: "It is never too late to be what you might have been.", quote_de: "Es ist niemals zu spät, das zu sein, was du hättest sein können.", author: "George Eliot" },
  
  // === Action & Motivation ===
  { quote_en: "Nothing will work unless you do.", quote_de: "Nichts wird funktionieren, solange du nicht handelst.", author: "Maya Angelou" },
  { quote_en: "The path to success is to take massive, determined action.", quote_de: "Der Weg zum Erfolg besteht darin, massive, entschlossene Handlung zu ergreifen.", author: "Tony Robbins" },
  { quote_en: "Motivation is what gets you started. Habit is what keeps you going.", quote_de: "Motivation ist, was dich starten lässt. Gewohnheit ist, was dich weitermachen lässt.", author: "Jim Rohn" },
  { quote_en: "Do not wait to strike till the iron is hot; but make it hot by striking.", quote_de: "Warte nicht, bis das Eisen heiß ist; mache es heiß, indem du schlägst.", author: "William Butler Yeats" },
  { quote_en: "You can't cross the sea merely by standing and staring at the water.", quote_de: "Du kannst das Meer nicht überqueren, indem du nur dastehst und ins Wasser starrst.", author: "Rabindranath Tagore" },
];

/**
 * Get a random quote
 */
export const getRandomQuote = (): Quote => {
  const index = Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length);
  return MOTIVATIONAL_QUOTES[index];
};

/**
 * Get quote by index (wraps around)
 */
export const getQuoteByIndex = (index: number): Quote => {
  return MOTIVATIONAL_QUOTES[index % MOTIVATIONAL_QUOTES.length];
};

export default MOTIVATIONAL_QUOTES;
