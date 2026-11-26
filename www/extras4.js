/* Word Café extras 4: GRE-style questions and reading passages that use the words added in levels 51-55.
   Same formats as extras2.js and extras3.js (se, tc, ctx, passages). They are added to the lists in app.js when the app starts.
   A question only shows up after the player has learned every answer word in it. Passage ids continue from R10. */
window.WORD_CAFE_X4 = {
  se: [
    { s: "The mayor handed out free sweets to ____ the angry crowd outside the town hall.",
      o: ["propitiate", "placate", "provoke", "enrage", "harass", "lecture"], a: ["propitiate", "placate"],
      why: "Free sweets are meant to calm angry people: propitiate and placate. Provoke, enrage and harass would make them angrier. Lecture means to talk down to someone, which does not fit." },
    { s: "The ____ protest of the crowd could be heard three streets away.",
      o: ["vociferous", "strident", "muted", "hushed", "tacit", "placid"], a: ["vociferous", "strident"],
      why: "A protest heard three streets away is loud: vociferous and strident. Muted and hushed mean quiet, tacit means unspoken, and placid means calm." },
    { s: "The reviewer's ____ wit left the young author wounded for weeks.",
      o: ["caustic", "acerbic", "tender", "gentle", "jovial", "ornate"], a: ["caustic", "acerbic"],
      why: "Wit that wounds someone is sharp and bitter: caustic and acerbic. Tender and gentle are kind, jovial means cheerful, and ornate means richly decorated." },
    { s: "He could feel the ____ in her voice, even though she never raised it or said a single angry word.",
      o: ["reproach", "censure", "applause", "gratitude", "delight", "humour"], a: ["reproach", "censure"],
      why: "A quiet voice that still shows disappointment carries reproach or censure. Applause, gratitude and delight are warm feelings, and humour is not disapproval." },
    { s: "Medicine could only ____ the old man's pain, since nothing could remove its cause.",
      o: ["palliate", "mitigate", "cure", "aggravate", "exacerbate", "invite"], a: ["palliate", "mitigate"],
      why: "Medicine that makes pain less bad without removing the cause palliates or mitigates it. Cure would remove the cause, and aggravate and exacerbate mean to make worse." },
    { s: "The ____ guard did not even turn his head at the sudden noise.",
      o: ["stolid", "phlegmatic", "excitable", "volatile", "vivacious", "mercurial"], a: ["stolid", "phlegmatic"],
      why: "A guard who does not react at all is calm and unemotional: stolid and phlegmatic. Excitable, volatile and mercurial describe quick, strong reactions, and vivacious means lively." },
    { s: "At the formal dinner, his ____ remarks made everyone wince, and he spilled his soup as well.",
      o: ["gauche", "maladroit", "urbane", "polished", "jovial", "frugal"], a: ["gauche", "maladroit"],
      why: "Awkward remarks and spilled soup are socially clumsy: gauche and maladroit. Urbane and polished mean smooth and refined, jovial means cheerful, and frugal means careful with money." },
    { s: "Advertisements have become so ____ that you cannot walk down a street without seeing a dozen.",
      o: ["ubiquitous", "pervasive", "rare", "scarce", "obsolete", "ephemeral"], a: ["ubiquitous", "pervasive"],
      why: "Ads that you cannot avoid on any street are everywhere: ubiquitous and pervasive. Rare and scarce mean few, obsolete means out of use, and ephemeral means short-lived." },
    { s: "He thanked her with ____ praise, repeating it again and again until she begged him to stop.",
      o: ["profuse", "copious", "grudging", "scanty", "tacit", "austere"], a: ["profuse", "copious"],
      why: "Praise repeated again and again comes in large amounts: profuse and copious. Grudging and scanty mean given unwillingly or in small amounts, tacit means unspoken, and austere means plain and strict." },
    { s: "Filling in the forms by hand was an ____ task that took two full days.",
      o: ["onerous", "arduous", "trivial", "effortless", "jocular", "lucid"], a: ["onerous", "arduous"],
      why: "A task that takes two full days is heavy and tiring: onerous and arduous. Trivial and effortless mean easy, jocular means joking, and lucid means clear." },
    { s: "His ____, pretending friendship while he stole secrets, shocked everyone who had trusted him.",
      o: ["perfidy", "duplicity", "loyalty", "candor", "humility", "zeal"], a: ["perfidy", "duplicity"],
      why: "Pretending to be a friend while stealing secrets is deceit and betrayal: perfidy and duplicity. Loyalty and candor are honest qualities, humility means modesty, and zeal means eager energy." },
    { s: "The story that the town's founder crossed the river on the back of a swan is almost certainly ____.",
      o: ["apocryphal", "spurious", "authentic", "documented", "ornate", "jovial"], a: ["apocryphal", "spurious"],
      why: "A story that sounds like a fairy tale is probably not true: apocryphal and spurious. Authentic and documented mean proved real, ornate means richly decorated, and jovial means cheerful." }
  ],
  tc: [
    { text: "Nobody could trace the {1} that the old well was cursed, and the headman called the tale {2}, since no record anywhere mentioned a curse.",
      blanks: [
        { o: ["canard", "verdict", "tribute"], a: "canard", why: "A false story that spreads is a canard. A verdict is a decision, and a tribute is praise." },
        { o: ["apocryphal", "documented", "official"], a: "apocryphal", why: "A tale with no record behind it is apocryphal (probably untrue). Documented and official mean proved." } ] },
    { text: "Asked about the missing money, the treasurer began to {1}, giving vague answers that avoided the truth, a habit his critics called {2}.",
      blanks: [
        { o: ["prevaricate", "confess", "declare"], a: "prevaricate", why: "Giving vague answers to avoid the truth is prevaricating. To confess and to declare mean saying things openly." },
        { o: ["mendacity", "integrity", "candor"], a: "mendacity", why: "A habit of lying is mendacity. Integrity and candor are honest qualities." } ] },
    { text: "After the flood the old bridge was {1}, and the engineers warned that a quick repair might only {2} the danger without ending it.",
      blanks: [
        { o: ["precarious", "sturdy", "secure"], a: "precarious", why: "A bridge that engineers worry about is unsafe: precarious. Sturdy and secure mean safe and strong." },
        { o: ["palliate", "cure", "create"], a: "palliate", why: "A quick repair that eases a danger without ending it palliates it. Cure would end it, and create means to make." } ] },
    { text: "The new safety rules were so {1} that every task needed a signed form, and many workers called the extra checking an {2} burden.",
      blanks: [
        { o: ["stringent", "lax", "flexible"], a: "stringent", why: "Rules that need a signed form for every task are very strict: stringent. Lax and flexible mean loose." },
        { o: ["onerous", "trivial", "pleasant"], a: "onerous", why: "A heavy, tiring burden is onerous. Trivial means unimportant, and pleasant means enjoyable." } ] },
    { text: "The young chef cooked with such {1}, with so much style and confidence, that the crowd applauded, while his rival's loud boasting seemed only an {2} that fooled nobody.",
      blanks: [
        { o: ["panache", "clumsiness", "timidity"], a: "panache", why: "Style and confidence in doing something is panache. Clumsiness and timidity are the opposite." },
        { o: ["affectation", "necessity", "disability"], a: "affectation", why: "Behaviour put on to impress is an affectation. Necessity and disability describe real, unchosen things." } ] },
    { text: "The young diplomat felt {1} at the royal dinner, so he was glad of his {2} host, a man who loved to chat with everyone and made every guest feel at home.",
      blanks: [
        { o: ["gauche", "poised", "polished"], a: "gauche", why: "Feeling socially awkward is gauche. Poised and polished mean smooth and at ease." },
        { o: ["affable", "aloof", "haughty"], a: "affable", why: "A host who chats with everyone is friendly: affable. Aloof and haughty mean cold and proud." } ] },
    { text: "The critic's {1} review, full of bitter sarcasm, offended the director, who took {2} and would not speak to him for years.",
      blanks: [
        { o: ["caustic", "flattering", "tender"], a: "caustic", why: "Bitter sarcasm is caustic. Flattering and tender are kind." },
        { o: ["umbrage", "delight", "pride"], a: "umbrage", why: "To take umbrage is to feel offended. Delight and pride are pleasant feelings." } ] },
    { text: "The valley was so {1} that three crops a year were normal, and the {2} harvest left the markets {3} with fruit.",
      blanks: [
        { o: ["fecund", "barren", "arid"], a: "fecund", why: "Land that gives three crops a year is very fertile: fecund. Barren and arid mean nothing grows." },
        { o: ["prodigious", "meagre", "puny"], a: "prodigious", why: "A remarkably large harvest is prodigious. Meagre and puny mean small." },
        { o: ["replete", "devoid", "lacking"], a: "replete", why: "Markets filled with fruit are replete with it. Devoid and lacking mean having none." } ] },
    { text: "The old farmer, usually {1}, showed no surprise at the news, though his younger cousin, who had a {2} for gossip, could not stop talking about it.",
      blanks: [
        { o: ["stolid", "excitable", "anxious"], a: "stolid", why: "Showing no surprise fits a calm, unemotional person: stolid. Excitable and anxious describe people who react strongly." },
        { o: ["penchant", "dislike", "fear"], a: "penchant", why: "A strong liking for something is a penchant. Dislike and fear are the opposite." } ] },
    { text: "The senator's {1} behaviour, such as making faces at his opponents, disgraced the debate, and the {2} newspaper that backed him printed only a one-sided account.",
      blanks: [
        { o: ["puerile", "mature", "dignified"], a: "puerile", why: "Making faces during a debate is silly and childish: puerile. Mature and dignified describe adult behaviour." },
        { o: ["tendentious", "balanced", "neutral"], a: "tendentious", why: "A one-sided account is tendentious. Balanced and neutral mean fair." } ] }
  ],
  ctx: [
    { w: "sanction", s: "The council refused to sanction the new road.", q: "syn", a: "approve", d: ["punish", "delay", "design"],
      why: "Here sanction is a verb meaning to approve officially. It can also be a noun meaning a penalty." },
    { w: "sanction", s: "The country faced a heavy sanction for breaking the treaty.", q: "syn", a: "penalty", d: ["approval", "reward", "agreement"],
      why: "Here sanction is a noun meaning a penalty. It can also mean official approval." },
    { w: "fawn", s: "The courtiers fawn over the king whenever he enters.", q: "syn", a: "flatter", d: ["scold", "avoid", "admire"],
      why: "Here fawn is a verb: to flatter too much. As a noun it also means a young deer." },
    { w: "fawn", s: "A fawn stood still beside the stream.", q: "syn", a: "young deer", d: ["flatter", "hunter", "river"],
      why: "Here fawn is a noun: a young deer. As a verb it means to flatter." },
    { w: "anodyne", s: "Soft music was an anodyne after a stressful day.", q: "syn", a: "soother", d: ["irritant", "burden", "signal"],
      why: "Here anodyne is a noun: something that eases pain or stress. As an adjective it can mean bland." },
    { w: "anodyne", s: "The speech was so anodyne that nobody remembered a word of it.", q: "syn", a: "bland", d: ["angry", "brilliant", "long"],
      why: "Here anodyne is an adjective meaning bland and harmless. As a noun it means a soothing thing." },
    { w: "reproach", s: "She gave him a look of silent reproach.", q: "syn", a: "blame", d: ["praise", "welcome", "puzzle"],
      why: "Here reproach is a noun: blame or disappointment shown to someone. As a verb it means to show it." },
    { w: "reproach", s: "He did not reproach her for the mistake.", q: "syn", a: "criticize", d: ["thank", "reward", "copy"],
      why: "Here reproach is a verb: to show blame or disappointment. As a noun it means that blame." },
    { w: "obscure", s: "The poem's meaning is so obscure that experts still argue about it.", q: "syn", a: "unclear", d: ["famous", "lovely", "short"],
      why: "Here obscure means hard to understand. It can also mean little known." },
    { w: "obscure", s: "He was an obscure poet whom hardly anyone had heard of.", q: "syn", a: "unknown", d: ["unclear", "famous", "ancient"],
      why: "Here obscure means little known. It can also mean hard to understand." }
  ],
  passages: [
    { id: "R11", title: "The Cursed Well",
      text: "A {1} spread through the village that the old well was cursed, a false story that nobody could trace. The headman said the tale was {2}, because no record anywhere mentioned a curse. But the shopkeeper, who had started the rumour, began to {3} when he was asked about it, giving vague answers and changing the subject.",
      blanks: [
        { a: "canard", o: ["canard", "verdict", "tribute", "manifesto"], why: "A false story that spreads is a canard. A verdict is a decision, a tribute is praise, and a manifesto is a public statement of plans." },
        { a: "apocryphal", o: ["apocryphal", "documented", "verified", "official"], why: "A tale with no record behind it is apocryphal. Documented, verified and official mean proved." },
        { a: "prevaricate", o: ["prevaricate", "confess", "declare", "boast"], why: "Giving vague answers and changing the subject is prevaricating. Confess, declare and boast all mean saying things openly." } ] },
    { id: "R12", title: "The Hill Station",
      text: "Doctors advised the sick boy to move to the hills, where the air was {1}, clean and dry and good for the lungs. His father, who owned a small shop, found the weeks of travel an {2} burden, a heavy load on a thin purse. Still, the boy's {3} smile on the train, cheerful and without a care in the world, made the whole trip feel lighter.",
      blanks: [
        { a: "salubrious", o: ["salubrious", "noxious", "stale", "damp"], why: "Clean, dry air that is good for health is salubrious. Noxious, stale and damp describe air that harms or is unpleasant." },
        { a: "onerous", o: ["onerous", "trivial", "pleasant", "light"], why: "A heavy load is onerous. Trivial, pleasant and light describe easy things." },
        { a: "blithe", o: ["blithe", "anxious", "careful", "thoughtful"], why: "A cheerful smile without a care is blithe. Anxious, careful and thoughtful mean worrying about problems." } ] },
    { id: "R13", title: "The Rival Chefs",
      text: "The two chefs felt a deep {1} for each other, a dislike that neither of them could explain. At the festival, the younger one cooked with such {2}, with so much style and confidence, that the crowd applauded. The older chef, whose {3} remarks about the young man's food were bitter and full of sarcasm, left before the prize was given.",
      blanks: [
        { a: "antipathy", o: ["antipathy", "affinity", "devotion", "esteem"], why: "A deep dislike without a clear reason is antipathy. Affinity, devotion and esteem are warm feelings." },
        { a: "panache", o: ["panache", "clumsiness", "timidity", "reluctance"], why: "Style and confidence in doing something is panache. Clumsiness, timidity and reluctance are the opposite." },
        { a: "caustic", o: ["caustic", "flattering", "tender", "soothing"], why: "Bitter and sarcastic remarks are caustic. Flattering, tender and soothing are kind." } ] },
    { id: "R14", title: "The Long Debate",
      text: "The debate turned {1}, with neighbours shouting their objections at every point. One speaker was {2}, showing only the facts that supported his own side and ignoring the rest. The chairman offered a free hall for a second meeting to {3} the angry neighbours.",
      blanks: [
        { a: "vociferous", o: ["vociferous", "muted", "silent", "polite"], why: "Neighbours shouting their objections are vociferous. Muted and silent mean quiet, and polite is about manners, not loudness." },
        { a: "tendentious", o: ["tendentious", "balanced", "neutral", "objective"], why: "Showing only one side is tendentious. Balanced, neutral and objective mean fair." },
        { a: "propitiate", o: ["propitiate", "provoke", "insult", "defy"], why: "Offering a free hall to calm angry people propitiates them. Provoke, insult and defy would make them angrier." } ] }
  ]
};
