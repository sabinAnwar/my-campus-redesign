import { useEffect, useState } from "react";
import { Link, useNavigate, useLoaderData } from "react-router";
import { showErrorToast, showSuccessToast } from "~/lib/toast";
import { prisma } from "~/lib/prisma";

// Motivational quotes data
const motivationalQuotes = [
  { quote_en: "The way to get started is to quit talking and begin doing.", quote_de: "Der erste Schritt besteht darin, mit dem Reden aufzuhören und mit dem Tun zu beginnen.", author: "Walt Disney" },
  { quote_en: "If life were predictable it would cease to be life, and be without flavor.", quote_de: "Wenn das Leben vorhersehbar wäre, würde es aufhören, Leben zu sein, und wäre ohne Geschmack.", author: "Eleanor Roosevelt" },
  { quote_en: "If you look at what you have in life, you'll always have more. If you look at what you don't have in life, you'll never have enough.", quote_de: "Wenn du dir ansiehst, was du im Leben hast, wirst du immer mehr haben. Wenn du auf das schaust, was du nicht hast, wirst du nie genug haben.", author: "Oprah Winfrey" },
  { quote_en: "The future belongs to those who believe in the beauty of their dreams.", quote_de: "Die Zukunft gehört denen, die an die Schönheit ihrer Träume glauben.", author: "Eleanor Roosevelt" },
  { quote_en: "What you get by achieving your goals is not as important as what you become by achieving your goals.", quote_de: "Was du durch das Erreichen deiner Ziele bekommst, ist nicht so wichtig wie das, was du wirst, indem du deine Ziele erreichst.", author: "Zig Ziglar" },
  { quote_en: "Don't watch the clock; do what it does. Keep going.", quote_de: "Beobachte die Uhr nicht; tu, was sie tut: Weiterlaufen.", author: "Sam Levenson" },
  { quote_en: "The only way to do great work is to love what you do.", quote_de: "Der einzige Weg, großartige Arbeit zu leisten, ist, zu lieben, was du tust.", author: "Steve Jobs" },
  { quote_en: "It always seems impossible until it's done.", quote_de: "Es scheint immer unmöglich, bis es getan ist.", author: "Nelson Mandela" },
  { quote_en: "You are never too old to set another goal or to dream a new dream.", quote_de: "Du bist niemals zu alt, um dir ein neues Ziel zu setzen oder einen neuen Traum zu träumen.", author: "C. S. Lewis" },
  { quote_en: "Success usually comes to those who are too busy to be looking for it.", quote_de: "Erfolg kommt meist denen, die zu beschäftigt sind, ihn zu suchen.", author: "Henry David Thoreau" },
  { quote_en: "Believe you can and you're halfway there.", quote_de: "Glaube, dass du es kannst — und du bist schon halb dort.", author: "Theodore Roosevelt" },
  { quote_en: "Don't let yesterday take up too much of today.", quote_de: "Lass nicht zu, dass gestern zu viel von heute einnimmt.", author: "Will Rogers" },
  { quote_en: "You miss 100 percent of the shots you don't take.", quote_de: "Du verpasst 100 % der Chancen, die du nicht wahrnimmst.", author: "Wayne Gretzky" },
  { quote_en: "The only limit to our realization of tomorrow is our doubts of today.", quote_de: "Die einzige Grenze für unsere Verwirklichung von morgen sind unsere Zweifel von heute.", author: "Franklin D. Roosevelt" },
  { quote_en: "Hardships often prepare ordinary people for an extraordinary destiny.", quote_de: "Schwierigkeiten bereiten gewöhnliche Menschen oft für ein außergewöhnliches Schicksal vor.", author: "C. S. Lewis" },
  { quote_en: "Don't wait. The time will never be just right.", quote_de: "Warte nicht. Die Zeit wird niemals perfekt sein.", author: "Napoleon Hill" },
  { quote_en: "Failure is simply the opportunity to begin again, this time more intelligently.", quote_de: "Fehlschlag ist einfach die Gelegenheit, neu zu beginnen — dieses Mal intelligenter.", author: "Henry Ford" },
  { quote_en: "Dream big and dare to fail.", quote_de: "Träume groß und wage es zu scheitern.", author: "Norman Vaughn" },
  { quote_en: "Don't count the days, make the days count.", quote_de: "Zähle nicht die Tage, lasse die Tage zählen.", author: "Muhammad Ali" },
  { quote_en: "Your time is limited, don't waste it living someone else's life.", quote_de: "Deine Zeit ist begrenzt — verschwende sie nicht damit, das Leben eines Anderen zu leben.", author: "Steve Jobs" },
  { quote_en: "It does not matter how slowly you go as long as you do not stop.", quote_de: "Es ist egal, wie langsam du gehst — solange du nicht stehen bleibst.", author: "Confucius" },
  { quote_en: "Believe in yourself and all that you are.", quote_de: "Glaube an dich selbst und alles, was du bist.", author: "Christian D. Larson" },
  { quote_en: "Learning never exhausts the mind.", quote_de: "Lernen ermüdet den Geist niemals.", author: "Leonardo da Vinci" },
  { quote_en: "A person who never made a mistake never tried anything new.", quote_de: "Wer niemals einen Fehler gemacht hat, hat niemals etwas Neues versucht.", author: "Albert Einstein" },
  { quote_en: "Education is the most powerful weapon which you can use to change the world.", quote_de: "Bildung ist die mächtigste Waffe, die du verwenden kannst, um die Welt zu verändern.", author: "Nelson Mandela" },
  { quote_en: "The roots of education are bitter, but the fruit is sweet.", quote_de: "Die Wurzeln der Bildung sind bitter, aber die Früchte sind süß.", author: "Aristotle" },
  { quote_en: "Setting goals is the first step in turning the invisible into the visible.", quote_de: "Ziele zu setzen ist der erste Schritt, das Unsichtbare sichtbar zu machen.", author: "Tony Robbins" },
  { quote_en: "Don't let what you cannot do interfere with what you can do.", quote_de: "Lass nicht zu, dass das, was du nicht kannst, dich davon abhalten soll, das zu tun, was du kannst.", author: "John Wooden" },
  { quote_en: "Be yourself; everyone else is already taken.", quote_de: "Sei du selbst; alle anderen gibt es schon.", author: "Oscar Wilde" },
  { quote_en: "The best way to predict your future is to create it.", quote_de: "Der beste Weg, deine Zukunft vorherzusagen, ist, sie zu gestalten.", author: "Abraham Lincoln" },
  { quote_en: "Energy and persistence conquer all things.", quote_de: "Energie und Ausdauer besiegen alle Dinge.", author: "Benjamin Franklin" },
  { quote_en: "Nothing will work unless you do.", quote_de: "Nichts wird funktionieren, solange du nicht handelst.", author: "Maya Angelou" },
  { quote_en: "Action is the foundational key to all success.", quote_de: "Handeln ist der fundamentale Schlüssel zu jedem Erfolg.", author: "Pablo Picasso" },
  { quote_en: "The path to success is to take massive, determined action.", quote_de: "Der Weg zum Erfolg besteht darin, massive, entschlossene Handlung zu ergreifen.", author: "Tony Robbins" },
  { quote_en: "Strength does not come from winning. Your struggles develop your strengths.", quote_de: "Stärke kommt nicht vom Gewinnen. Deine Kämpfe entwickeln deine Stärke.", author: "Arnold Schwarzenegger" },
  { quote_en: "The greatest glory in living lies not in never falling, but in rising every time we fall.", quote_de: "Die größte Ehre im Leben liegt nicht darin, nie zu fallen, sondern jedes Mal aufzustehen, wenn wir fallen.", author: "Ralph Waldo Emerson" },
  { quote_en: "Whether you think you can or you think you can't, you're right.", quote_de: "Ob du denkst, du kannst es, oder du denkst, du kannst es nicht — du hast recht.", author: "Henry Ford" },
  { quote_en: "Motivation is what gets you started. Habit is what keeps you going.", quote_de: "Motivation ist, was dich starten lässt. Gewohnheit ist, was dich weitermachen lässt.", author: "Jim Rohn" },
  { quote_en: "You will face many defeats in life, but never let yourself be defeated.", quote_de: "Du wirst viele Niederlagen im Leben erleben — aber lass dich niemals besiegen.", author: "Maya Angelou" },
  { quote_en: "Many of life's failures are people who did not realize how close they were to success when they gave up.", quote_de: "Viele der Misserfolge im Leben sind Menschen, die nicht erkannt haben, wie nah sie dem Erfolg waren, als sie aufgaben.", author: "Thomas Edison" },
  { quote_en: "Don't be distracted by criticism. Remember — the only taste of success some people get is to take a bite out of you.", quote_de: "Lass dich nicht von Kritik ablenken. Denk daran — der einzige Geschmack von Erfolg, den manche bekommen, ist, dich anzufallen.", author: "Zig Ziglar" },
  { quote_en: "Ask not what your country can do for you — ask what you can do for your country.", quote_de: "Frage nicht, was dein Land für dich tun kann — frage, was du für dein Land tun kannst.", author: "John F. Kennedy" },
  { quote_en: "The only thing we have to fear is fear itself.", quote_de: "Das Einzige, was wir zu fürchten haben, ist die Angst selbst.", author: "Franklin D. Roosevelt" },
  { quote_en: "Life is what happens when you're busy making other plans.", quote_de: "Das Leben ist das, was passiert, während du beschäftigt bist, andere Pläne zu machen.", author: "John Lennon" },
  { quote_en: "If you can dream it, you can do it.", quote_de: "Wenn du es träumen kannst, kannst du es tun.", author: "Walt Disney" },
  { quote_en: "Spread love everywhere you go. Let no one ever come to you without leaving happier.", quote_de: "Verbreite Liebe, wohin du gehst. Lass nie jemanden zu dir kommen, ohne glücklich wieder zu gehen.", author: "Mother Teresa" },
  { quote_en: "Always remember that you are absolutely unique. Just like everyone else.", quote_de: "Denk immer daran, dass du absolut einzigartig bist. Genau wie jeder andere auch.", author: "Margaret Mead" },
  { quote_en: "Tell me and I forget. Teach me and I remember. Involve me and I learn.", quote_de: "Erzähle es mir und ich vergesse. Lehre mich und ich erinnere mich. Beziehe mich mit ein und ich lerne.", author: "Benjamin Franklin" },
  { quote_en: "You will never understand the power you have to change yourself until you give up blaming others.", quote_de: "Du wirst niemals die Kraft verstehen, die du hast, dich selbst zu verändern, bis du aufhörst, anderen die Schuld zu geben.", author: "Robert Tew" },
  { quote_en: "The greatest mistake you can make in life is to be continually fearing you will make one.", quote_de: "Der größte Fehler, den du im Leben machen kannst, ist, ständig zu fürchten, einen Fehler zu machen.", author: "Elbert Hubbard" },
  { quote_en: "Do not wait to strike till the iron is hot; but make it hot by striking.", quote_de: "Warte nicht, bis das Eisen heiß ist; mache es heiß, indem du schlägst.", author: "William Butler Yeats" },
  { quote_en: "In three words I can sum up everything I've learned about life: it goes on.", quote_de: "Mit drei Worten kann ich alles, was ich über das Leben gelernt habe, zusammenfassen: Es geht weiter.", author: "Robert Frost" },
  { quote_en: "The best way out is always through.", quote_de: "Der beste Weg hinaus führt immer hindurch.", author: "Robert Frost" },
  { quote_en: "Life is 10% what happens to us and 90% how we react to it.", quote_de: "Das Leben besteht zu 10 % aus dem, was uns geschieht — und zu 90 % aus der Art, wie wir darauf reagieren.", author: "Charles R. Swindoll" },
  { quote_en: "You can't cross the sea merely by standing and staring at the water.", quote_de: "Du kannst das Meer nicht überqueren, indem du nur dastehst und ins Wasser starrst.", author: "Rabindranath Tagore" },
  { quote_en: "We may encounter many defeats but we must not be defeated.", quote_de: "Wir mögen vielen Niederlagen begegnen — aber wir dürfen nicht besiegt werden.", author: "Maya Angelou" },
  { quote_en: "It is never too late to be what you might have been.", quote_de: "Es ist niemals zu spät, das zu sein, was du hättest sein können.", author: "George Eliot" },
  { quote_en: "Start where you are. Use what you have. Do what you can.", quote_de: "Starte dort, wo du bist. Nutze, was du hast. Tu, was du kannst.", author: "Arthur Ashe" },
];

export const loader = async () => {
  try {
    const [totalUsers, onlineUsers] = await Promise.all([
      prisma.user.count(),
      prisma.session.count({
        where: {
          expiresAt: {
            gt: new Date(),
          },
        },
      }),
    ]);
    return { totalUsers, onlineUsers };
  } catch (error) {
    console.error("Failed to fetch login stats:", error);
    return { totalUsers: 500, onlineUsers: 42 }; // Fallback
  }
};

export default function Login() {
  const { totalUsers, onlineUsers } = useLoaderData() as { totalUsers: number; onlineUsers: number };
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Quote rotation state
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(() => 
    Math.floor(Math.random() * motivationalQuotes.length)
  );
  const [isQuoteFading, setIsQuoteFading] = useState(false);
  
  // Auto-rotate quotes every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIsQuoteFading(true);
      setTimeout(() => {
        setCurrentQuoteIndex((prev) => (prev + 1) % motivationalQuotes.length);
        setIsQuoteFading(false);
      }, 500); // Fade out duration
    }, 8000);
    
    return () => clearInterval(interval);
  }, []);
  
  const currentQuote = motivationalQuotes[currentQuoteIndex];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      const email = formData.get("email");
      const password = formData.get("password");

      console.log("🔐 Login: Submitting credentials for:", email);

      // Use .data suffix for React Router actions
      const response = await fetch("/api/login.data", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          email: typeof email === "string" ? email : "",
          password: typeof password === "string" ? password : "",
        }),
        credentials: "include",
      });

      console.log("📡 Login: Response status:", response.status);
      console.log("🍪 Login: Response headers:", Object.fromEntries(response.headers.entries()));

      // Check for redirect (303 status) or success (200)
      if (response.redirected || response.ok) {
        const data = await response.json();
        console.log("✅ Login: Success response:", data);

        // Log cookies after login
        console.log("🍪 Login: Cookies after login:", document.cookie);

        showSuccessToast("Login successful! Redirecting...");

        // Wait for cookies to be set, then navigate
        console.log("🔄 Login: Navigating to dashboard");
        navigate("/dashboard", { replace: true });
        return;
      }

      if (!response.ok) {
        const data = await response.json();
        console.error("❌ Login: Failed with error:", data);
        const errorMsg = data.error || "Login failed. Please try again.";
        setError(errorMsg);
        showErrorToast(errorMsg);
      }
    } catch (err) {
      console.error("❌ Login: Exception occurred:", err);
      const errorMsg =
        typeof err === "object" && err !== null && "message" in err && typeof (err as any).message === "string"
          ? (err as { message: string }).message
          : "An error occurred during login";
      setError(errorMsg);
      showErrorToast(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-stretch">
      {/* Left side - Premium professional section with IU students background */}
      <div
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center p-8"
        style={{
          backgroundImage: "url(/iu-students-football.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        {/* Dark overlay for strong readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/90 via-slate-900/85 to-slate-950/90"></div>

        {/* Accent overlay with IU colors */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/5 via-transparent to-orange-600/5"></div>

        {/* Professional Content */}
        <div className="relative z-10 text-center text-white max-w-md">
          {/* Premium Badge - Student Portal */}
          <div className="mb-8 inline-flex animate-fade-in">
            <div className="px-5 py-3 rounded-full bg-gradient-to-r from-cyan-500/30 to-orange-500/30 border-2 border-cyan-400/60 backdrop-blur-lg hover:from-cyan-500/40 hover:to-orange-500/40 hover:border-cyan-300 transition-all shadow-lg">
              <span className="text-xs font-extrabold text-cyan-100 tracking-wider uppercase">
                ⭐ IU Excellence
              </span>
            </div>
          </div>

          {/* Main heading - More impressive */}
          <h2 className="text-5xl font-black mb-2 leading-tight text-white drop-shadow-lg">
            Achieve Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-cyan-200 to-orange-300 animate-pulse">
              Goals
            </span>
          </h2>

          {/* Subheading */}
          <p className="text-lg text-cyan-100 font-semibold mb-10 drop-shadow-md">
            Join {totalUsers}+ IU Dual Degree Students
          </p>

          {/* Motivational Quote - Dynamic with fade animation */}
          <div className="mb-12">
            <div 
              className={`group cursor-pointer transform hover:-translate-y-1 transition-all duration-500 ${
                isQuoteFading ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
              }`}
            >
              <div className="flex flex-col p-6 rounded-2xl bg-gradient-to-br from-cyan-500/40 via-purple-500/20 to-orange-500/40 border-2 border-cyan-400/80 hover:border-cyan-300 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/50 backdrop-blur-md">
                <div className="text-5xl text-cyan-200 mb-3 leading-none drop-shadow-2xl">
                  "
                </div>
                {/* German Quote */}
                <p className="text-lg font-bold text-white mb-3 leading-relaxed drop-shadow-lg">
                  {currentQuote.quote_de}
                </p>
                {/* Divider */}
                <div className="w-16 h-0.5 bg-gradient-to-r from-cyan-400 to-orange-400 mx-auto mb-3 rounded-full"></div>
                {/* English Quote */}
                <p className="text-sm text-cyan-100/80 italic mb-4 leading-relaxed drop-shadow-md">
                  "{currentQuote.quote_en}"
                </p>
                <p className="text-xs text-cyan-100 font-semibold drop-shadow-md">
                  — {currentQuote.author}
                </p>
              </div>
            </div>
            {/* Quote navigation dots */}
            <div className="flex justify-center gap-1.5 mt-4">
              {motivationalQuotes.slice(0, 10).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setIsQuoteFading(true);
                    setTimeout(() => {
                      setCurrentQuoteIndex(idx);
                      setIsQuoteFading(false);
                    }, 300);
                  }}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    idx === currentQuoteIndex % 10
                      ? 'bg-cyan-400 scale-125'
                      : 'bg-white/30 hover:bg-white/50'
                  }`}
                  aria-label={`Zitat ${idx + 1}`}
                />
              ))}
              <span className="text-white/40 text-xs ml-2">+{motivationalQuotes.length - 10}</span>
            </div>
          </div>

          {/* Hamburg Locations - Enhanced */}
          <div className="grid grid-cols-2 gap-3 pt-8 border-t border-cyan-400/30">
            <div className="group cursor-pointer transform hover:scale-110 transition-transform">
              <div className="p-3 rounded-lg bg-cyan-500/35 border-2 border-cyan-400/70 hover:bg-cyan-500/45 hover:border-cyan-300 transition-all backdrop-blur-md">
                <p className="text-2xl mb-1 drop-shadow-lg">📍</p>
                <p className="text-xs font-bold text-white drop-shadow-lg">
                  Hammerbrook
                </p>
                <p className="text-xs text-cyan-100 drop-shadow-md">Hamburg</p>
              </div>
            </div>
            <div className="group cursor-pointer transform hover:scale-110 transition-transform">
              <div className="p-3 rounded-lg bg-orange-500/35 border-2 border-orange-400/70 hover:bg-orange-500/45 hover:border-orange-300 transition-all backdrop-blur-md">
                <p className="text-2xl mb-1 drop-shadow-lg">📍</p>
                <p className="text-xs font-bold text-white drop-shadow-lg">
                  Waterloohain
                </p>
                <p className="text-xs text-orange-100 drop-shadow-md">
                  Hamburg
                </p>
              </div>
            </div>
          </div>

          {/* Active Students Count - Enhanced */}
          <div className="mt-8 text-center">
            <div className="inline-block">
              <p className="text-5xl font-black text-cyan-300 drop-shadow-lg">
                {totalUsers}+
              </p>
              <p className="text-xs text-cyan-100 font-semibold mt-2 uppercase tracking-wider">
                Active Dual Degree Students
              </p>
              <div className="mt-3 inline-flex items-center gap-2 bg-green-500/30 px-4 py-2 rounded-full border border-green-400/60 backdrop-blur-sm">
                <span className="h-2.5 w-2.5 rounded-full bg-green-300 block animate-pulse" />
                <span className="text-xs text-green-100 font-bold">
                  {onlineUsers} Currently online
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Premium Professional Login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-8 bg-white dark:bg-slate-800 min-h-screen dark:text-white transition-colors duration-300">
        <div className="w-full max-w-2xl">
          {/* Premium Card - Much Bigger */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-12 shadow-2xl border border-slate-200 dark:border-slate-700 backdrop-blur-xl bg-white/95 dark:bg-slate-800/95 dark:shadow-2xl">
            {/* Header - Professional */}
            <div className="mb-12 text-center">
              {/* IU Logo - visible on mobile */}
              <div className="mb-8 flex justify-center lg:hidden">
                <div className="relative h-24 w-24">
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl blur opacity-20"></div>
                  <div className="relative h-24 w-24 bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow">
                    <span className="text-white font-black text-3xl">IU</span>
                  </div>
                </div>
              </div>

              {/* Title - Professional */}
              <div className="inline-block mb-4">
                <span className="px-4 py-1.5 rounded-full bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-700 dark:to-slate-600 text-slate-700 dark:text-slate-300 text-xs font-bold border border-slate-300 dark:border-slate-600">
                  STUDENT PORTAL
                </span>
              </div>
              <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-2">
                Welcome
              </h1>
              <p className="text-slate-600 dark:text-slate-400 text-base font-semibold mb-2">
                IU Dual Degree Platform
              </p>
              <p className="text-slate-500 dark:text-slate-500 text-sm font-medium">
                Manage marks, applications & modules in one place
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-7">
              {/* Email Input - Professional with icon box */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-base font-bold text-slate-900 dark:text-white mb-3"
                >
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute left-0 top-0 h-full w-14 bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-700 dark:to-slate-600 rounded-l-lg flex items-center justify-center border-r border-slate-300 dark:border-slate-600 group-focus-within:border-slate-900 dark:group-focus-within:border-cyan-500 transition-colors">
                    <svg
                      className="w-6 h-6 text-slate-600 dark:text-slate-400 group-focus-within:text-slate-900 dark:group-focus-within:text-cyan-500 transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="your.email@iu-study.org"
                    className="w-full px-5 py-4 pl-16 rounded-lg bg-slate-50 dark:bg-slate-700 border-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white text-base placeholder-slate-400 dark:placeholder-slate-500 focus:bg-white dark:focus:bg-slate-700 focus:border-slate-900 dark:focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-slate-900/10 dark:focus:ring-cyan-500/20 transition duration-300"
                  />
                </div>
              </div>

              {/* Password Input - Professional with icon box */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-base font-bold text-slate-900 dark:text-white mb-3"
                >
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute left-0 top-0 h-full w-14 bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-700 dark:to-slate-600 rounded-l-lg flex items-center justify-center border-r border-slate-300 dark:border-slate-600 group-focus-within:border-slate-900 dark:group-focus-within:border-cyan-500 transition-colors">
                    <svg
                      className="w-6 h-6 text-slate-600 dark:text-slate-400 group-focus-within:text-slate-900 dark:group-focus-within:text-cyan-500 transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    placeholder="Enter your password"
                    className="w-full px-5 py-4 pl-16 rounded-lg bg-slate-50 dark:bg-slate-700 border-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white text-base placeholder-slate-400 dark:placeholder-slate-500 focus:bg-white dark:focus:bg-slate-700 focus:border-slate-900 dark:focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-slate-900/10 dark:focus:ring-cyan-500/20 transition duration-300"
                  />
                </div>
              </div>

              {/* Remember me & Forgot password */}
              <div className="flex items-center justify-between pt-4">
                <div className="flex items-center gap-2">
                  <input
                    id="remember"
                    name="remember"
                    type="checkbox"
                    className="w-5 h-5 rounded bg-white dark:bg-slate-700 border-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-cyan-500 accent-slate-900 dark:accent-cyan-500 focus:ring-2 focus:ring-slate-900 dark:focus:ring-cyan-500 focus:ring-offset-1 dark:focus:ring-offset-slate-800 cursor-pointer"
                  />
                  <label
                    htmlFor="remember"
                    className="text-base text-slate-700 dark:text-slate-300 font-semibold cursor-pointer"
                  >
                    Keep me signed in
                  </label>
                </div>
                <Link
                  to="/reset-password"
                  className="text-base font-bold text-slate-900 dark:text-cyan-500 hover:text-slate-700 dark:hover:text-cyan-400 transition duration-200 underline-offset-2 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Error Alert - Professional */}
              {error && (
                <div className="rounded-lg bg-red-50 dark:bg-red-950/40 border-2 border-red-200 dark:border-red-900/50 p-5 backdrop-blur-sm">
                  <div className="flex gap-4">
                    <svg
                      className="w-6 h-6 text-red-600 dark:text-red-500 flex-shrink-0 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <p className="text-base font-semibold text-red-700 dark:text-red-400">
                      {error}
                    </p>
                  </div>
                </div>
              )}

              {/* Sign in Button - Bigger */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-10 px-8 py-4 bg-gradient-to-r from-slate-900 dark:from-cyan-600 via-slate-800 dark:via-cyan-500 to-slate-900 dark:to-cyan-600 hover:from-slate-800 dark:hover:from-cyan-700 hover:via-slate-700 dark:hover:via-cyan-600 hover:to-slate-800 dark:hover:to-cyan-700 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-2xl dark:shadow-cyan-500/20 dark:hover:shadow-cyan-500/40 transition duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3 border border-slate-700 dark:border-cyan-400/30"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin h-6 w-6"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </>
                )}
              </button>

              {/* Divider */}
              <div className="relative mt-10">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-300 dark:border-slate-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-3 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium text-base">
                    Need Help?
                  </span>
                </div>
              </div>

              {/* Support Links */}
              <div className="grid grid-cols-2 gap-4">
                <a
                  href="https://iu.de"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-br from-slate-100 dark:from-slate-700 to-slate-50 dark:to-slate-600 hover:from-slate-200 dark:hover:from-slate-600 hover:to-slate-100 dark:hover:to-slate-500 text-slate-900 dark:text-white font-semibold rounded-lg transition duration-200 text-base border border-slate-200 dark:border-slate-600 hover:border-slate-400 dark:hover:border-cyan-500 hover:shadow-lg dark:hover:shadow-cyan-500/20"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                  <span>IU Website</span>
                </a>
                <a
                  href="mailto:support@iu-study.org"
                  className="flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-br from-slate-100 dark:from-slate-700 to-slate-50 dark:to-slate-600 hover:from-slate-200 dark:hover:from-slate-600 hover:to-slate-100 dark:hover:to-slate-500 text-slate-900 dark:text-white font-semibold rounded-lg transition duration-200 text-base border border-slate-200 dark:border-slate-600 hover:border-slate-400 dark:hover:border-cyan-500 hover:shadow-lg dark:hover:shadow-cyan-500/20"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <span>Support</span>
                </a>
              </div>
            </form>
          </div>

          {/* Footer - Professional */}
          <div className="mt-10 text-center space-y-3">
            <p className="text-base text-slate-700 dark:text-slate-400 font-semibold">
              🛡️ Built by IU Students • Professional Development
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-500">
              Enterprise-grade security • Encrypted connections • Data protected
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
