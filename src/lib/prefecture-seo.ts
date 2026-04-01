/**
 * 都道府県ごとのSEO用テキストデータ
 * 外国人投資家向けに、各都道府県の魅力・投資ポイントを英語で記述
 */

export interface PrefectureSeoData {
  slug: string;
  nameEn: string;
  nameJa: string;
  region: string;
  description: string;
  highlights: string[];
  investmentPoints: string[];
}

export const PREFECTURE_SEO_DATA: Record<string, PrefectureSeoData> = {
  hokkaido: {
    slug: "hokkaido",
    nameEn: "Hokkaido",
    nameJa: "北海道",
    region: "Northern Japan",
    description:
      "Hokkaido is Japan's northernmost island, famous for world-class skiing in Niseko, fresh seafood, and vast natural landscapes. Its growing international community, especially around ski resort areas, makes it a prime destination for vacation rental investment.",
    highlights: [
      "World-class powder snow at Niseko, Furano, and Rusutsu",
      "Affordable land prices compared to mainland Japan",
      "Growing international expat community",
      "Cool summers — ideal escape from tropical heat",
    ],
    investmentPoints: [
      "Niseko area properties appreciate 5-10% annually",
      "Strong Airbnb demand during ski season (Dec-Mar)",
      "Summer tourism growing with cycling and outdoor activities",
      "Sapporo offers urban amenities with lower costs than Tokyo",
    ],
  },
  aomori: {
    slug: "aomori",
    nameEn: "Aomori",
    nameJa: "青森県",
    region: "Tohoku",
    description:
      "Aomori is located at the northern tip of Honshu, known for its apple orchards, the famous Nebuta Festival, and stunning nature including Shirakami Mountains (UNESCO World Heritage). Very affordable akiya properties.",
    highlights: [
      "Famous Nebuta Festival attracts millions annually",
      "Shirakami Mountains UNESCO World Heritage Site",
      "Japan's top apple-producing prefecture",
      "Shinkansen access to Tokyo (3 hours)",
    ],
    investmentPoints: [
      "Extremely affordable properties — many under ¥1M",
      "Festival tourism creates seasonal rental demand",
      "Agricultural land available at low prices",
      "Aomori city has modern infrastructure",
    ],
  },
  iwate: {
    slug: "iwate",
    nameEn: "Iwate",
    nameJa: "岩手県",
    region: "Tohoku",
    description:
      "Iwate is one of Japan's largest prefectures, offering dramatic coastlines, the historic Hiraizumi temples (UNESCO), and the charming castle town of Morioka. Spacious properties at very affordable prices.",
    highlights: [
      "Hiraizumi — UNESCO World Heritage temples",
      "Beautiful Sanriku coastline",
      "Morioka — charming castle town with great food",
      "Large lots available at low cost",
    ],
    investmentPoints: [
      "Very affordable compared to national average",
      "Shinkansen connects Morioka to Tokyo in 2 hours",
      "Growing ecotourism and rural tourism interest",
      "Large land parcels ideal for retreat/guesthouse projects",
    ],
  },
  miyagi: {
    slug: "miyagi",
    nameEn: "Miyagi",
    nameJa: "宮城県",
    region: "Tohoku",
    description:
      "Miyagi is the economic hub of the Tohoku region, centered around Sendai — Japan's 'City of Trees.' Known for Matsushima Bay (one of Japan's three most scenic views) and excellent cuisine including gyutan (beef tongue).",
    highlights: [
      "Sendai — largest city in Tohoku with urban amenities",
      "Matsushima Bay — one of Japan's top 3 scenic spots",
      "1.5 hours to Tokyo by Shinkansen",
      "Vibrant food culture",
    ],
    investmentPoints: [
      "Sendai suburban properties offer good rental yields",
      "Tourism infrastructure well-developed",
      "University city with student rental demand",
      "Post-reconstruction growth opportunities",
    ],
  },
  akita: {
    slug: "akita",
    nameEn: "Akita",
    nameJa: "秋田県",
    region: "Tohoku",
    description:
      "Akita is known for its hot springs, beautiful Tazawako lake, and the famous Kanto Festival. One of the most affordable places to buy property in Japan, with many free akiya available.",
    highlights: [
      "Lake Tazawa — Japan's deepest lake",
      "Nyuto Onsen — rustic hot spring retreats",
      "Famous Kamakura snow festivals in Yokote",
      "Some of the lowest property prices in Japan",
    ],
    investmentPoints: [
      "Multiple free (¥0) properties available",
      "Generous municipal renovation subsidies",
      "Hot spring area properties for tourism",
      "Ultra-low cost of living",
    ],
  },
  yamagata: {
    slug: "yamagata",
    nameEn: "Yamagata",
    nameJa: "山形県",
    region: "Tohoku",
    description:
      "Yamagata offers stunning mountain scenery, famous Zao Onsen with its 'snow monsters,' cherry production (Japan's largest), and Dewa Sanzan — sacred mountains attracting spiritual tourists year-round.",
    highlights: [
      "Zao Onsen — famous ski resort and snow monsters",
      "Ginzan Onsen — iconic traditional hot spring town",
      "Japan's largest cherry (sakuranbo) producer",
      "Sacred Dewa Sanzan mountains",
    ],
    investmentPoints: [
      "Ski resort area properties for seasonal rentals",
      "Ginzan Onsen tourism driving area interest",
      "Affordable farmhouse properties with land",
      "Growing agritourism opportunities",
    ],
  },
  fukushima: {
    slug: "fukushima",
    nameEn: "Fukushima",
    nameJa: "福島県",
    region: "Tohoku",
    description:
      "Fukushima is Japan's third-largest prefecture with diverse landscapes from coastal areas to ski resorts. Known for Aizu-Wakamatsu castle town, sake brewing, and surprisingly affordable real estate.",
    highlights: [
      "Aizu-Wakamatsu — historic samurai castle town",
      "Bandai-Asahi National Park",
      "Award-winning sake breweries",
      "Diverse climate zones and landscapes",
    ],
    investmentPoints: [
      "Among the most affordable properties in Japan",
      "Improving reputation attracting new interest",
      "Castle town tourism for Airbnb potential",
      "Ski resorts in Urabandai area",
    ],
  },
  ibaraki: {
    slug: "ibaraki",
    nameEn: "Ibaraki",
    nameJa: "茨城県",
    region: "Kanto",
    description:
      "Ibaraki is conveniently located north of Tokyo, offering easy access to the capital while maintaining affordable property prices. Home to Tsukuba Science City, Hitachi Seaside Park, and beautiful Pacific coastline.",
    highlights: [
      "Tsukuba Express — direct link to Tokyo (45 min)",
      "Hitachi Seaside Park — iconic flower fields",
      "Pacific coast surfing and beach culture",
      "Tsukuba Science City and university",
    ],
    investmentPoints: [
      "Commuter-belt properties at fraction of Tokyo prices",
      "Growing Tsukuba area with tech industry demand",
      "Coastal properties for vacation rentals",
      "Good highway access to Narita Airport",
    ],
  },
  tochigi: {
    slug: "tochigi",
    nameEn: "Tochigi",
    nameJa: "栃木県",
    region: "Kanto",
    description:
      "Tochigi is home to Nikko, one of Japan's most famous UNESCO World Heritage Sites. The prefecture offers beautiful mountains, hot springs, and affordable properties within easy reach of Tokyo.",
    highlights: [
      "Nikko — UNESCO World Heritage shrines and temples",
      "Kinugawa Onsen — popular hot spring resort",
      "Nasu Highlands — upscale resort area",
      "Strawberry capital of Japan",
    ],
    investmentPoints: [
      "Nikko tourism drives vacation rental demand",
      "Nasu area popular with wealthy Tokyo residents",
      "Shinkansen access (Utsunomiya to Tokyo: 50 min)",
      "Affordable compared to neighboring Saitama/Tokyo",
    ],
  },
  gunma: {
    slug: "gunma",
    nameEn: "Gunma",
    nameJa: "群馬県",
    region: "Kanto",
    description:
      "Gunma is famous for its hot springs, including Kusatsu — rated Japan's best onsen for over 20 years. Mountain retreats and affordable properties make it attractive for both living and investment.",
    highlights: [
      "Kusatsu Onsen — Japan's #1 hot spring",
      "Minakami — adventure sports and nature",
      "Ikaho Onsen — historic stone-step hot spring town",
      "Multiple ski resorts in winter",
    ],
    investmentPoints: [
      "Free (¥0) properties available in rural areas",
      "Hot spring town properties for tourism business",
      "2 hours from Tokyo by car or train",
      "Growing adventure tourism market",
    ],
  },
  saitama: {
    slug: "saitama",
    nameEn: "Saitama",
    nameJa: "埼玉県",
    region: "Kanto",
    description:
      "Saitama borders Tokyo and serves as a major bedroom community. The prefecture offers convenient access to central Tokyo with significantly lower property prices, making it ideal for rental investment.",
    highlights: [
      "Direct train access to central Tokyo (20-40 min)",
      "Kawagoe — 'Little Edo' historic district",
      "Major shopping and entertainment facilities",
      "Large parks and nature areas",
    ],
    investmentPoints: [
      "Commuter demand ensures stable rental income",
      "30-50% cheaper than equivalent Tokyo properties",
      "Kawagoe tourism growing with foreign visitors",
      "New transit developments increasing property values",
    ],
  },
  chiba: {
    slug: "chiba",
    nameEn: "Chiba",
    nameJa: "千葉県",
    region: "Kanto",
    description:
      "Chiba offers diverse opportunities from Tokyo-adjacent commuter towns to rural Boso Peninsula beach properties. Home to Narita Airport and Tokyo Disneyland, with strong tourism infrastructure.",
    highlights: [
      "Narita International Airport location",
      "Boso Peninsula — surfing and beach lifestyle",
      "Tokyo Disneyland and Disneysea",
      "Easy Tokyo commute from western Chiba",
    ],
    investmentPoints: [
      "Airport proximity benefits short-term rentals",
      "Beach properties on Boso Peninsula at low cost",
      "Strong commuter rental market in west Chiba",
      "Surfing culture attracting international buyers",
    ],
  },
  tokyo: {
    slug: "tokyo",
    nameEn: "Tokyo",
    nameJa: "東京都",
    region: "Kanto",
    description:
      "Tokyo, Japan's capital, occasionally has akiya properties in its western mountainous areas (Okutama, Akiruno). These offer rare opportunities to own property in Tokyo prefecture at a fraction of central city prices.",
    highlights: [
      "Tokyo address prestige",
      "Okutama — nature retreats within Tokyo",
      "Excellent public transportation network",
      "World-class dining, culture, and entertainment",
    ],
    investmentPoints: [
      "Tokyo-address properties for status-conscious investors",
      "Western Tokyo (Tama area) more affordable",
      "Strong rental demand across all areas",
      "Long-term appreciation potential",
    ],
  },
  kanagawa: {
    slug: "kanagawa",
    nameEn: "Kanagawa",
    nameJa: "神奈川県",
    region: "Kanto",
    description:
      "Kanagawa is home to Yokohama (Japan's 2nd largest city), historic Kamakura, and relaxing Hakone hot springs. From urban to coastal to mountain properties, Kanagawa offers diverse investment opportunities.",
    highlights: [
      "Kamakura — historic temples and beach culture",
      "Hakone — famous hot spring resort near Mt. Fuji",
      "Yokohama — cosmopolitan port city",
      "Enoshima and Shonan coast lifestyle",
    ],
    investmentPoints: [
      "Kamakura/Shonan coastal properties for vacation rentals",
      "Hakone tourism ensures strong seasonal demand",
      "Yokohama suburban properties for commuters",
      "International community well-established",
    ],
  },
  niigata: {
    slug: "niigata",
    nameEn: "Niigata",
    nameJa: "新潟県",
    region: "Chubu",
    description:
      "Niigata is Japan's snow country and rice bowl, known for world-class sake, powder snow skiing, and Sado Island. Affordable properties with strong seasonal tourism potential.",
    highlights: [
      "Japan's premier rice and sake region",
      "Yuzawa/Myoko ski resorts — Tokyo's closest powder",
      "Sado Island — unique cultural heritage",
      "Echigo-Yuzawa — 70 min from Tokyo by Shinkansen",
    ],
    investmentPoints: [
      "Ski resort properties for seasonal Airbnb",
      "Yuzawa area accessible from Tokyo (70 min)",
      "Affordable large properties in rural areas",
      "Growing food tourism and sake tourism",
    ],
  },
  toyama: {
    slug: "toyama",
    nameEn: "Toyama",
    nameJa: "富山県",
    region: "Chubu",
    description:
      "Toyama faces the Sea of Japan and backs onto the Japanese Alps. Known for the Tateyama Alpine Route, fresh seafood, and a compact livable city. Free akiya programs available.",
    highlights: [
      "Tateyama Alpine Route — iconic snow wall",
      "Fresh sushi from Toyama Bay",
      "Compact, well-planned Toyama city",
      "Gokayama UNESCO World Heritage village",
    ],
    investmentPoints: [
      "Free (¥0) properties available",
      "Hokuriku Shinkansen to Tokyo (2 hours)",
      "Growing tourism with Alpine Route visitors",
      "Affordable city living with excellent amenities",
    ],
  },
  ishikawa: {
    slug: "ishikawa",
    nameEn: "Ishikawa",
    nameJa: "石川県",
    region: "Chubu",
    description:
      "Ishikawa is home to Kanazawa, often called 'Little Kyoto' for its preserved samurai and geisha districts. Traditional machiya townhouses and stunning Kenrokuen garden attract year-round tourism.",
    highlights: [
      "Kanazawa — preserved Edo-era districts",
      "Kenrokuen — one of Japan's three great gardens",
      "Omicho Market — fresh seafood paradise",
      "Traditional crafts: gold leaf, Kutani pottery, lacquerware",
    ],
    investmentPoints: [
      "Machiya properties for premium guesthouse conversion",
      "Tourism surged after Hokuriku Shinkansen opening",
      "Cultural tourism ensures year-round demand",
      "Kanazawa real estate still undervalued vs. Kyoto",
    ],
  },
  fukui: {
    slug: "fukui",
    nameEn: "Fukui",
    nameJa: "福井県",
    region: "Chubu",
    description:
      "Fukui is ranked among Japan's happiest prefectures, known for Tojinbo cliffs, Eihei-ji Zen temple, and dinosaur museums. Quietly affordable with strong community spirit.",
    highlights: [
      "Consistently ranked Japan's happiest prefecture",
      "Eihei-ji — major Zen Buddhist temple",
      "Tojinbo cliffs — dramatic Sea of Japan coastline",
      "Japan's largest dinosaur museum",
    ],
    investmentPoints: [
      "Free (¥0) properties available",
      "Hokuriku Shinkansen extension (2024) boosts access",
      "Very affordable with high quality of life",
      "Growing interest from remote workers",
    ],
  },
  yamanashi: {
    slug: "yamanashi",
    nameEn: "Yamanashi",
    nameJa: "山梨県",
    region: "Chubu",
    description:
      "Yamanashi is the gateway to Mt. Fuji, home to the famous Fuji Five Lakes. Wine country, fruit orchards, and stunning mountain scenery make it popular with both tourists and residents.",
    highlights: [
      "Mt. Fuji views — iconic Japan landscape",
      "Fuji Five Lakes — popular resort area",
      "Japan's premier wine region (Koshu grape)",
      "Excellent fruit: grapes, peaches, cherries",
    ],
    investmentPoints: [
      "Fuji Five Lakes tourism for vacation rentals",
      "1.5 hours from Tokyo by train/car",
      "Wine tourism growing internationally",
      "Popular with remote workers seeking nature",
    ],
  },
  nagano: {
    slug: "nagano",
    nameEn: "Nagano",
    nameJa: "長野県",
    region: "Chubu",
    description:
      "Nagano, host of the 1998 Winter Olympics, is Japan's premier mountain destination. Hakuba's world-class skiing, Karuizawa's upscale retreats, and countless hot springs make it a top investment area.",
    highlights: [
      "Hakuba — world-class ski resort with international community",
      "Karuizawa — Japan's premier highland retreat",
      "Matsumoto Castle — one of Japan's finest original castles",
      "Japanese Alps — hiking, climbing, hot springs",
    ],
    investmentPoints: [
      "Hakuba properties appreciate with growing tourism",
      "Strong Airbnb demand in ski season and summer",
      "Karuizawa attracts wealthy Tokyo residents",
      "Multiple Shinkansen stations for easy access",
    ],
  },
  gifu: {
    slug: "gifu",
    nameEn: "Gifu",
    nameJa: "岐阜県",
    region: "Chubu",
    description:
      "Gifu is known for the UNESCO village of Shirakawa-go, historic Takayama (Japan's 'Little Kyoto'), and traditional cormorant fishing. Affordable properties in areas with strong tourism appeal.",
    highlights: [
      "Shirakawa-go — UNESCO World Heritage thatched-roof village",
      "Takayama — beautifully preserved Edo-era town",
      "Gero Onsen — one of Japan's top three hot springs",
      "Traditional cormorant fishing on Nagara River",
    ],
    investmentPoints: [
      "Free (¥0) properties available in rural areas",
      "Takayama tourism drives accommodation demand",
      "Shirakawa-go area attracts international tourists",
      "Central Japan location with good highway access",
    ],
  },
  shizuoka: {
    slug: "shizuoka",
    nameEn: "Shizuoka",
    nameJa: "静岡県",
    region: "Chubu",
    description:
      "Shizuoka sits between Tokyo and Nagoya, offering iconic Mt. Fuji views, Izu Peninsula beaches and hot springs, and Hamamatsu's music culture. Year-round mild climate with diverse property options.",
    highlights: [
      "Mt. Fuji — seen from multiple Shizuoka locations",
      "Izu Peninsula — beaches, onsen, and resort culture",
      "Atami — revitalized hot spring resort town",
      "Green tea capital of Japan",
    ],
    investmentPoints: [
      "Izu/Atami properties for vacation rental business",
      "Shinkansen access to Tokyo (1 hour) and Osaka",
      "Atami renaissance creating property appreciation",
      "Year-round mild climate attracts retirees",
    ],
  },
  aichi: {
    slug: "aichi",
    nameEn: "Aichi",
    nameJa: "愛知県",
    region: "Chubu",
    description:
      "Aichi is Japan's industrial heartland, centered around Nagoya — the country's 4th largest city. Toyota's hometown offers strong economic fundamentals with more affordable real estate than Tokyo or Osaka.",
    highlights: [
      "Nagoya — Japan's 4th largest metro area",
      "Nagoya Castle and historic districts",
      "Central location between Tokyo and Osaka",
      "Strong economy anchored by Toyota and manufacturing",
    ],
    investmentPoints: [
      "Strong rental demand from corporate housing",
      "More affordable than Tokyo/Osaka equivalents",
      "Excellent Shinkansen connectivity",
      "Industrial economy provides stable employment base",
    ],
  },
  mie: {
    slug: "mie",
    nameEn: "Mie",
    nameJa: "三重県",
    region: "Kansai",
    description:
      "Mie is home to Ise Grand Shrine, Japan's most sacred Shinto site, and the pearl island of Mikimoto. Coastal properties and spiritual tourism create unique investment opportunities.",
    highlights: [
      "Ise Grand Shrine — Japan's holiest shrine",
      "Toba and Shima — pearl cultivation and marine cuisine",
      "Ise-Shima National Park coastline",
      "Suzuka Circuit — Formula 1 venue",
    ],
    investmentPoints: [
      "Ise shrine tourism (8M+ visitors/year) drives demand",
      "Coastal properties at affordable prices",
      "Toba/Shima resort area for vacation rentals",
      "Improving access with highway developments",
    ],
  },
  shiga: {
    slug: "shiga",
    nameEn: "Shiga",
    nameJa: "滋賀県",
    region: "Kansai",
    description:
      "Shiga surrounds Lake Biwa, Japan's largest and oldest lake. Close to Kyoto with significantly lower property prices. Growing popularity with remote workers and outdoor enthusiasts.",
    highlights: [
      "Lake Biwa — Japan's largest lake, water sports paradise",
      "Hikone Castle — National Treasure",
      "15 minutes to Kyoto by train",
      "Outdoor activities: kayaking, cycling, skiing",
    ],
    investmentPoints: [
      "Kyoto commuter belt at 50-70% lower prices",
      "Lake-view properties for vacation rentals",
      "Growing remote worker migration from Kyoto/Osaka",
      "Outdoor tourism infrastructure developing",
    ],
  },
  kyoto: {
    slug: "kyoto",
    nameEn: "Kyoto",
    nameJa: "京都府",
    region: "Kansai",
    description:
      "Kyoto, Japan's ancient capital, is the cultural heart of the nation. Traditional machiya townhouses, UNESCO temples, and year-round tourism create premium investment opportunities, especially for Airbnb.",
    highlights: [
      "17 UNESCO World Heritage Sites",
      "Traditional machiya townhouses available",
      "Year-round international tourism (50M+ visitors)",
      "Japanese cultural capital — tea ceremony, geisha, zen gardens",
    ],
    investmentPoints: [
      "Machiya properties command premium nightly rates",
      "Year-round tourism ensures consistent occupancy",
      "Cultural experience Airbnb listings outperform hotels",
      "Strong property appreciation in central areas",
    ],
  },
  osaka: {
    slug: "osaka",
    nameEn: "Osaka",
    nameJa: "大阪府",
    region: "Kansai",
    description:
      "Osaka is Japan's food capital and third-largest city, known for street food, vibrant nightlife, and a welcoming, entrepreneurial culture. Strong rental demand and tourism make it attractive for investors.",
    highlights: [
      "Japan's food capital — takoyaki, okonomiyaki, ramen",
      "Vibrant Dotonbori and Shinsekai districts",
      "Osaka Castle and historic sites",
      "Kansai International Airport hub",
    ],
    investmentPoints: [
      "Expo 2025 and IR development boosting values",
      "Strong short-term rental demand in Namba/Shinsaibashi",
      "More affordable than Tokyo with similar rental yields",
      "Growing international tourism numbers",
    ],
  },
  hyogo: {
    slug: "hyogo",
    nameEn: "Hyogo",
    nameJa: "兵庫県",
    region: "Kansai",
    description:
      "Hyogo spans from cosmopolitan Kobe to rural Tajima, offering diverse property options. Kobe's international port culture, Arima Onsen, and Himeji Castle attract steady tourism.",
    highlights: [
      "Himeji Castle — Japan's most magnificent castle (UNESCO)",
      "Kobe — cosmopolitan port city with Kobe beef",
      "Arima Onsen — one of Japan's oldest hot springs",
      "Awaji Island — resort and nature destination",
    ],
    investmentPoints: [
      "Kobe properties more affordable than Osaka/Kyoto",
      "Himeji area tourism for accommodation business",
      "Awaji Island developing as resort destination",
      "Strong Kansai region connectivity",
    ],
  },
  nara: {
    slug: "nara",
    nameEn: "Nara",
    nameJa: "奈良県",
    region: "Kansai",
    description:
      "Nara, Japan's first permanent capital, offers ancient temples, friendly deer, and a quieter alternative to Kyoto. Significantly more affordable while being just 30 minutes from Osaka.",
    highlights: [
      "Ancient capital with 1,300+ years of history",
      "Todai-ji Temple — world's largest wooden building",
      "Famous friendly deer in Nara Park",
      "30 minutes to Osaka, 45 minutes to Kyoto",
    ],
    investmentPoints: [
      "Significantly cheaper than Kyoto with similar cultural appeal",
      "Growing tourism as Kyoto gets overcrowded",
      "Kominka properties available at low prices",
      "Strong appreciation potential as day-trip tourists become overnight visitors",
    ],
  },
  wakayama: {
    slug: "wakayama",
    nameEn: "Wakayama",
    nameJa: "和歌山県",
    region: "Kansai",
    description:
      "Wakayama offers the sacred Kumano Kodo pilgrimage trails, beautiful coastline, and world-class surfing. Affordable seaside properties with growing spiritual and adventure tourism.",
    highlights: [
      "Kumano Kodo — UNESCO World Heritage pilgrimage trail",
      "Koyasan — sacred Buddhist mountain monastery",
      "Beautiful Pacific coastline with surfing",
      "Shirahama — famous white sand beach resort",
    ],
    investmentPoints: [
      "Kumano Kodo tourism growing internationally",
      "Affordable coastal properties near beaches",
      "Koyasan temple lodging demand",
      "Nanki-Shirahama airport improving access",
    ],
  },
  tottori: {
    slug: "tottori",
    nameEn: "Tottori",
    nameJa: "鳥取県",
    region: "Chugoku",
    description:
      "Tottori is Japan's least populated prefecture, offering incredible value. Famous for sand dunes, fresh crab, and a quiet lifestyle. Actively welcomes newcomers with generous subsidies.",
    highlights: [
      "Tottori Sand Dunes — unique desert landscape",
      "Japan's freshest and best Matsuba crab",
      "Least crowded prefecture in Japan",
      "Generous relocation and renovation subsidies",
    ],
    investmentPoints: [
      "Among the cheapest properties in all of Japan",
      "Municipal programs offer free properties + subsidies",
      "Growing digital nomad interest for remote work",
      "Clean air, water, and relaxed lifestyle attracting new residents",
    ],
  },
  shimane: {
    slug: "shimane",
    nameEn: "Shimane",
    nameJa: "島根県",
    region: "Chugoku",
    description:
      "Shimane is home to Izumo Grand Shrine, one of Japan's most important Shinto sites. World-class Adachi Museum of Art and the historic Iwami Ginzan silver mine (UNESCO) attract cultural tourists.",
    highlights: [
      "Izumo Taisha — one of Japan's oldest and most sacred shrines",
      "Adachi Museum of Art — world's best Japanese garden (20 years running)",
      "Iwami Ginzan — UNESCO World Heritage silver mine",
      "Quiet, spiritual atmosphere",
    ],
    investmentPoints: [
      "Very affordable property prices",
      "Spiritual tourism for accommodation business",
      "Undiscovered destination gaining international attention",
      "Quality of life ranked high nationally",
    ],
  },
  okayama: {
    slug: "okayama",
    nameEn: "Okayama",
    nameJa: "岡山県",
    region: "Chugoku",
    description:
      "Okayama is called the 'Land of Sunshine' for its mild climate and low rainfall. Historic Kurashiki district, Korakuen garden, and excellent fruit make it a pleasant and affordable place to invest.",
    highlights: [
      "Best weather in Japan — 'Land of Sunshine'",
      "Kurashiki — beautifully preserved canal district",
      "Korakuen — one of Japan's three great gardens",
      "Famous for white peaches and Muscat grapes",
    ],
    investmentPoints: [
      "Mild climate attracts retirees and remote workers",
      "Kurashiki tourism for guesthouse conversion",
      "Shinkansen access to Osaka (45 min) and Hiroshima (40 min)",
      "Affordable compared to Kansai cities",
    ],
  },
  hiroshima: {
    slug: "hiroshima",
    nameEn: "Hiroshima",
    nameJa: "広島県",
    region: "Chugoku",
    description:
      "Hiroshima is a vibrant city of peace, known worldwide for its Peace Memorial (UNESCO). Nearby Miyajima island with its floating torii gate is one of Japan's most iconic sights.",
    highlights: [
      "Hiroshima Peace Memorial — UNESCO World Heritage",
      "Miyajima — iconic floating torii gate",
      "Onomichi — charming hillside port town",
      "Setouchi Islands — art and cycling paradise",
    ],
    investmentPoints: [
      "Strong international tourism ensures rental demand",
      "Onomichi gaining popularity as creative destination",
      "Setouchi art tourism growing rapidly",
      "Affordable properties in suburban and island areas",
    ],
  },
  yamaguchi: {
    slug: "yamaguchi",
    nameEn: "Yamaguchi",
    nameJa: "山口県",
    region: "Chugoku",
    description:
      "Yamaguchi sits at the western tip of Honshu, featuring the picturesque Kintaikyo Bridge, historic Hagi castle town, and karst landscapes. Affordable properties with untapped tourism potential.",
    highlights: [
      "Kintaikyo Bridge — iconic wooden arch bridge",
      "Hagi — beautifully preserved samurai town",
      "Akiyoshido — Japan's largest limestone cave",
      "Shimonoseki — gateway to Kyushu, fugu (pufferfish) capital",
    ],
    investmentPoints: [
      "Affordable properties in historic Hagi area",
      "Shimonoseki growing as tourism gateway",
      "Undiscovered destination with appreciation potential",
      "Good highway and rail connectivity",
    ],
  },
  tokushima: {
    slug: "tokushima",
    nameEn: "Tokushima",
    nameJa: "徳島県",
    region: "Shikoku",
    description:
      "Tokushima is famous for the Awa Odori dance festival and dramatic Iya Valley. The prefecture offers stunning mountain scenery, whitewater rafting, and some of the cheapest properties in Japan.",
    highlights: [
      "Awa Odori — Japan's largest dance festival",
      "Iya Valley — dramatic vine bridges and gorges",
      "Naruto whirlpools — natural wonder",
      "Shikoku 88 Temple Pilgrimage starting area",
    ],
    investmentPoints: [
      "Free (¥0) properties available in mountain villages",
      "Iya Valley tourism growing with adventure travelers",
      "Extremely affordable property prices",
      "Growing interest from digital nomads and artists",
    ],
  },
  kagawa: {
    slug: "kagawa",
    nameEn: "Kagawa",
    nameJa: "香川県",
    region: "Shikoku",
    description:
      "Kagawa is Japan's smallest prefecture but packed with attractions: Naoshima art island, Ritsurin Garden, and the best udon noodles in Japan. Setouchi art tourism drives growing demand.",
    highlights: [
      "Naoshima — world-famous art island",
      "Setouchi Triennale — international art festival",
      "Ritsurin Garden — Edo-period masterpiece",
      "Sanuki udon — Japan's best noodles",
    ],
    investmentPoints: [
      "Art island tourism creating accommodation demand",
      "Setouchi Triennale drives triennial tourism spikes",
      "Compact size means easy property management",
      "Affordable island properties available",
    ],
  },
  ehime: {
    slug: "ehime",
    nameEn: "Ehime",
    nameJa: "愛媛県",
    region: "Shikoku",
    description:
      "Ehime is home to Matsuyama, Shikoku's largest city, and the iconic Dogo Onsen — Japan's oldest hot spring, inspiration for the Spirited Away bathhouse. Mild climate and citrus groves.",
    highlights: [
      "Dogo Onsen — Japan's oldest hot spring (3,000 years)",
      "Matsuyama Castle — hilltop castle overlooking the city",
      "Shimanami Kaido — world-famous cycling route",
      "Citrus capital of Japan",
    ],
    investmentPoints: [
      "Shimanami Kaido cycling tourism growing rapidly",
      "Dogo Onsen area for guesthouse business",
      "Matsuyama offers urban amenities at affordable prices",
      "Mild climate attracts retirees",
    ],
  },
  kochi: {
    slug: "kochi",
    nameEn: "Kochi",
    nameJa: "高知県",
    region: "Shikoku",
    description:
      "Kochi faces the Pacific Ocean with dramatic coastline, clear rivers, and a free-spirited culture. Known for bonito (katsuo) cuisine, Sunday markets, and Shimanto River — Japan's last clear stream.",
    highlights: [
      "Shimanto River — Japan's last clear stream",
      "Pacific coastline with surfing",
      "Famous Yosakoi Festival",
      "Free-spirited, welcoming local culture",
    ],
    investmentPoints: [
      "Free (¥0) properties available",
      "Surfing and outdoor tourism growing",
      "Very affordable coastal properties",
      "Warm climate and relaxed lifestyle attracting remote workers",
    ],
  },
  fukuoka: {
    slug: "fukuoka",
    nameEn: "Fukuoka",
    nameJa: "福岡県",
    region: "Kyushu",
    description:
      "Fukuoka is Japan's fastest-growing major city, known for its startup culture, incredible food (Hakata ramen, yatai food stalls), and proximity to Asia. A rising star for property investment.",
    highlights: [
      "Japan's fastest-growing major city",
      "Hakata ramen and yatai food stall culture",
      "Gateway to Asia — close to Seoul, Shanghai, Taipei",
      "Startup-friendly with government support",
    ],
    investmentPoints: [
      "Rising property values in central Fukuoka",
      "Strong rental demand from domestic migration",
      "Growing international tourism from Asia",
      "More affordable than Tokyo/Osaka with similar lifestyle",
    ],
  },
  saga: {
    slug: "saga",
    nameEn: "Saga",
    nameJa: "佐賀県",
    region: "Kyushu",
    description:
      "Saga is known for Arita and Imari porcelain (400+ year tradition), hot spring resorts, and international balloon fiesta. One of Japan's most affordable and overlooked prefectures.",
    highlights: [
      "Arita/Imari — world-famous porcelain tradition",
      "Takeo and Ureshino Onsen — historic hot springs",
      "International Balloon Fiesta",
      "Fresh Saga beef and seafood",
    ],
    investmentPoints: [
      "Free (¥0) properties available",
      "Extremely affordable living costs",
      "Close to Fukuoka (30 min by train)",
      "Growing pottery tourism for cultural visitors",
    ],
  },
  nagasaki: {
    slug: "nagasaki",
    nameEn: "Nagasaki",
    nameJa: "長崎県",
    region: "Kyushu",
    description:
      "Nagasaki has a unique blend of Japanese, Chinese, and European cultures from centuries of international trade. Dramatic hillside city views, Gunkanjima, and UNESCO churches attract diverse tourists.",
    highlights: [
      "Unique multicultural heritage and architecture",
      "Gunkanjima (Battleship Island) — UNESCO site",
      "Hidden Christian Sites — UNESCO World Heritage",
      "Huis Ten Bosch — Dutch-themed resort",
    ],
    investmentPoints: [
      "Free (¥0) properties on outer islands",
      "Growing cruise ship tourism",
      "Unique architecture for guesthouse conversion",
      "Affordable hillside properties with harbor views",
    ],
  },
  kumamoto: {
    slug: "kumamoto",
    nameEn: "Kumamoto",
    nameJa: "熊本県",
    region: "Kyushu",
    description:
      "Kumamoto features the magnificent Kumamoto Castle, Aso — the world's largest volcanic caldera, and the cute Kumamon mascot. Growing tourism and urban development post-earthquake reconstruction.",
    highlights: [
      "Kumamoto Castle — one of Japan's finest castles",
      "Mt. Aso — world's largest volcanic caldera",
      "Kumamon — Japan's most famous mascot character",
      "Hot springs throughout the prefecture",
    ],
    investmentPoints: [
      "Free (¥0) properties in rural areas",
      "Post-reconstruction growth in Kumamoto city",
      "Aso tourism for accommodation business",
      "TSMC semiconductor factory bringing economic boom",
    ],
  },
  oita: {
    slug: "oita",
    nameEn: "Oita",
    nameJa: "大分県",
    region: "Kyushu",
    description:
      "Oita is Japan's hot spring capital, with Beppu producing more onsen water than anywhere else in Japan. Yufuin is one of the country's most charming hot spring towns.",
    highlights: [
      "Beppu — Japan's #1 hot spring city (2,000+ springs)",
      "Yufuin — charming artsy hot spring town",
      "Hell Tour (Jigoku Meguri) — unique geothermal sites",
      "Fresh seafood from Bungo Channel",
    ],
    investmentPoints: [
      "Hot spring tourism ensures year-round demand",
      "Beppu/Yufuin properties for ryokan-style Airbnb",
      "Growing international tourism from Asia",
      "Strong onsen-town guesthouse business potential",
    ],
  },
  miyazaki: {
    slug: "miyazaki",
    nameEn: "Miyazaki",
    nameJa: "宮崎県",
    region: "Kyushu",
    description:
      "Miyazaki is Japan's tropical paradise, known for surfing, mythology, and warm climate. The Takachiho Gorge is one of Japan's most spectacular natural wonders. Growing as a digital nomad destination.",
    highlights: [
      "Takachiho Gorge — mythological natural wonder",
      "Excellent surfing on Pacific coastline",
      "Warm, subtropical climate year-round",
      "Japanese mythology origin stories",
    ],
    investmentPoints: [
      "Free (¥0) properties in rural mountain areas",
      "Surfing tourism growing with international visitors",
      "Very affordable compared to national average",
      "Warm climate attracts retirees and remote workers",
    ],
  },
  kagoshima: {
    slug: "kagoshima",
    nameEn: "Kagoshima",
    nameJa: "鹿児島県",
    region: "Kyushu",
    description:
      "Kagoshima is the 'Naples of Japan,' dominated by the active Sakurajima volcano. Subtropical climate, black pork cuisine, and Yakushima's ancient forests (UNESCO) make it a unique destination.",
    highlights: [
      "Sakurajima — active volcano visible from the city",
      "Yakushima — UNESCO ancient cedar forests",
      "Subtropical climate — warm year-round",
      "Famous Kagoshima black pork and shochu",
    ],
    investmentPoints: [
      "Free (¥0) properties available",
      "Yakushima tourism for eco-lodge potential",
      "Warm climate attracts retirees from colder regions",
      "Affordable properties with dramatic natural settings",
    ],
  },
  okinawa: {
    slug: "okinawa",
    nameEn: "Okinawa",
    nameJa: "沖縄県",
    region: "Okinawa",
    description:
      "Okinawa is Japan's tropical island chain, offering crystal-clear waters, unique Ryukyu culture, and US military base proximity creating international community. Japan's most popular beach destination.",
    highlights: [
      "Crystal-clear tropical waters and coral reefs",
      "Unique Ryukyu Kingdom culture and cuisine",
      "US military presence creates international community",
      "Year-round warm climate — Japan's Hawaii",
    ],
    investmentPoints: [
      "Strong vacation rental demand year-round",
      "Growing international tourism from Asia",
      "Resort-area properties appreciate steadily",
      "Unique cultural properties for premium Airbnb listings",
    ],
  },
};

/**
 * スラッグからSEOデータを取得。存在しない場合はジェネリックデータを返す
 */
export function getPrefectureSeoData(
  slug: string,
  displayName: string,
  propertyCount: number
): PrefectureSeoData {
  const data = PREFECTURE_SEO_DATA[slug];
  if (data) return data;

  // フォールバック: ジェネリックデータ
  return {
    slug,
    nameEn: displayName,
    nameJa: "",
    region: "Japan",
    description: `Discover affordable akiya (abandoned houses) in ${displayName}, Japan. Browse ${propertyCount} properties with detailed information, prices, and investment metrics.`,
    highlights: [
      "Affordable property prices",
      "Unique Japanese architecture",
      "Growing foreign buyer interest",
      "Municipal support programs available",
    ],
    investmentPoints: [
      "Low entry cost compared to Western real estate",
      "Potential for renovation and value increase",
      "Rental income opportunities",
      "No foreign ownership restrictions in Japan",
    ],
  };
}
