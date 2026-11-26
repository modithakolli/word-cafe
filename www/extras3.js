/* Word Café extras 3: GRE-style questions that use the words added in levels 46-50.
   Same formats as extras2.js (se, tc, ctx). These are added to the lists in extras2.js when the app starts.
   A question only shows up after the player has learned every answer word in it. */
window.WORD_CAFE_X3 = {
  se: [
    { s: "After losing the vote, the senator launched into a ____ against his rivals that lasted twenty minutes and ended only when the microphone was switched off.",
      o: ["diatribe", "tirade", "approbation", "encomium", "platitude", "eulogy"], a: ["diatribe", "tirade"],
      why: "A long, angry speech that attacks rivals is a diatribe or a tirade. Approbation, encomium and eulogy are all about praise, the opposite. A platitude is a dull, common saying, not an attack." },
    { s: "The new drainage system should ____ the flooding that has damaged the town every spring.",
      o: ["ameliorate", "mitigate", "exacerbate", "foment", "engender", "abjure"], a: ["ameliorate", "mitigate"],
      why: "A drainage system that makes flooding less bad will ameliorate or mitigate it. Exacerbate means to make worse, foment means to stir up trouble, engender means to cause, and abjure means to give up." },
    { s: "His ____ decision to sell the shop after one bad week surprised everyone who knew how careful he usually was.",
      o: ["impetuous", "precipitate", "circumspect", "prudent", "soporific", "bucolic"], a: ["impetuous", "precipitate"],
      why: "A fast decision made without thinking is impetuous or precipitate. The word 'careful' sets up a contrast, so circumspect and prudent (both careful) do not fit. Soporific means sleepy and bucolic means of the countryside." },
    { s: "Her poems turn ____ details, such as washing cups and waiting for buses, into something beautiful.",
      o: ["quotidian", "mundane", "arcane", "esoteric", "sanguine", "fortuitous"], a: ["quotidian", "mundane"],
      why: "Washing cups and waiting for buses are everyday, ordinary things: quotidian and mundane. Arcane and esoteric mean known only to a few. Sanguine means hopeful, and fortuitous means by chance." },
    { s: "The claim that the phases of the moon change the stock market is ____: no study has ever shown a real link.",
      o: ["spurious", "fallacious", "empirical", "cogent", "aesthetic", "immutable"], a: ["spurious", "fallacious"],
      why: "A claim with no real support is false: spurious and fallacious. Empirical and cogent mean supported by evidence or convincing, the opposite. Aesthetic is about beauty, and immutable means unchangeable." },
    { s: "The professor's lecture on ancient grammar was so ____ that only a handful of specialists could follow it.",
      o: ["recondite", "abstruse", "lucid", "cogent", "bucolic", "quotidian"], a: ["recondite", "abstruse"],
      why: "A lecture that only a few specialists can follow is deep and hard to understand: recondite and abstruse. Lucid and cogent mean clear, the opposite. Bucolic means of the countryside, and quotidian means daily." },
    { s: "Years of heavy smoking proved ____ to his health, and his doctor warned him that the damage was growing.",
      o: ["inimical", "deleterious", "beneficial", "helpful", "amenable", "artless"], a: ["inimical", "deleterious"],
      why: "Smoking that damages health is harmful: inimical and deleterious. Beneficial and helpful mean good for you, the opposite. Amenable means willing to agree, and artless means natural and honest." },
    { s: "The video, the receipts and three witnesses all agreed, so nobody in court could ____ the facts.",
      o: ["gainsay", "refute", "corroborate", "validate", "emulate", "dupe"], a: ["gainsay", "refute"],
      why: "When all the proof agrees, nobody can deny or disprove the facts: gainsay and refute. Corroborate and validate mean to support, which would not fit 'could not'. Emulate means to copy, and dupe means to trick." },
    { s: "He left the courtroom in ____, his name now a symbol of shame in the town.",
      o: ["opprobrium", "ignominy", "approbation", "renown", "lassitude", "hubris"], a: ["opprobrium", "ignominy"],
      why: "A name that is a symbol of shame goes with public disgrace: opprobrium and ignominy. Approbation and renown are about praise and fame, the opposite. Lassitude means tiredness, and hubris means too much pride." },
    { s: "The usually stubborn mule proved surprisingly ____ and followed the boy home without a fight.",
      o: ["amenable", "tractable", "intractable", "obdurate", "quixotic", "spurious"], a: ["amenable", "tractable"],
      why: "A stubborn animal that follows without a fight is easy to guide: amenable and tractable. Intractable and obdurate mean stubborn, which the 'surprisingly' contrasts with. Quixotic means noble but unrealistic, and spurious means false." },
    { s: "She is ____ about her notes, checking every date and every spelling twice before she hands them in.",
      o: ["fastidious", "meticulous", "slipshod", "negligent", "bucolic", "soporific"], a: ["fastidious", "meticulous"],
      why: "Checking every date and spelling twice shows great care about details: fastidious and meticulous. Slipshod and negligent mean careless, the opposite. Bucolic and soporific do not describe working habits." },
    { s: "While the other pilots shouted, the ____ captain checked each dial and reported the fault in a flat, unhurried voice.",
      o: ["phlegmatic", "placid", "impetuous", "mercurial", "truculent", "effusive"], a: ["phlegmatic", "placid"],
      why: "A calm, unhurried captain in a crisis is phlegmatic or placid. Impetuous (rash) and mercurial (quickly changing) are the opposite of calm. Truculent means ready to fight, and effusive means gushing." }
  ],
  tc: [
    { text: "The critic called the film {1}, since every scene copied an older movie, and the dull, ordinary story was so {2} that he could guess every ending.",
      blanks: [
        { o: ["derivative", "quixotic", "empirical"], a: "derivative", why: "Copying older movies is derivative. Quixotic means noble but unrealistic, and empirical means based on evidence." },
        { o: ["pedestrian", "bucolic", "recondite"], a: "pedestrian", why: "A dull, ordinary, predictable story is pedestrian. Bucolic means of the countryside, and recondite means hard to understand." } ] },
    { text: "A true {1} avoids crowds and parties, while his {2} sister makes friends wherever she goes.",
      blanks: [
        { o: ["misanthrope", "sycophant", "advocate"], a: "misanthrope", why: "A person who avoids people is a misanthrope. A sycophant flatters the powerful, and an advocate supports a cause." },
        { o: ["gregarious", "fastidious", "phlegmatic"], a: "gregarious", why: "The word 'while' shows a contrast, and she makes friends everywhere, so she is gregarious (sociable). Fastidious means picky, and phlegmatic means calm." } ] },
    { text: "Years of damp air were {1} to the old library, so the staff asked for money to {2} the damage. A {3} donor paid the whole bill without being asked.",
      blanks: [
        { o: ["inimical", "amenable", "immutable"], a: "inimical", why: "Damp air that harms the books is inimical to them. Amenable means willing to agree, and immutable means unchangeable." },
        { o: ["ameliorate", "exacerbate", "foment"], a: "ameliorate", why: "Money is asked for to make the damage better: ameliorate. Exacerbate means to make worse, and foment means to stir up trouble." },
        { o: ["munificent", "fastidious", "phlegmatic"], a: "munificent", why: "Paying a whole bill without being asked is very generous: munificent. Fastidious means picky, and phlegmatic means calm." } ] },
    { text: "Nobody could {1} the facts, yet the minister gave a {2} reply, smooth and quick, that dodged every question.",
      blanks: [
        { o: ["gainsay", "emulate", "abjure"], a: "gainsay", why: "To gainsay is to deny. Emulate means to copy, and abjure means to swear to give something up." },
        { o: ["glib", "artless", "contrite"], a: "glib", why: "A smooth, quick answer with no real substance is glib. Artless means natural and honest, and contrite means truly sorry." } ] },
    { text: "The new rule was meant to {1} trust between staff and managers, but its {2} wording only confused everyone, and soon some staff began to {3} ill feeling on purpose.",
      blanks: [
        { o: ["engender", "abjure", "gainsay"], a: "engender", why: "To engender is to cause something to begin, such as trust. Abjure means to give up, and gainsay means to deny." },
        { o: ["opaque", "aesthetic", "bucolic"], a: "opaque", why: "Wording that confuses people is hard to understand: opaque. Aesthetic is about beauty, and bucolic is about the countryside." },
        { o: ["foment", "ameliorate", "emulate"], a: "foment", why: "Stirring up ill feeling on purpose is foment. Ameliorate means to make better, and emulate means to copy." } ] },
    { text: "After years in a noisy city, he longed for a {1} village of green fields, and he wanted to leave behind his {2} routine of buses and offices.",
      blanks: [
        { o: ["bucolic", "recondite", "spurious"], a: "bucolic", why: "A village of green fields is bucolic. Recondite means hard to understand, and spurious means false." },
        { o: ["quotidian", "aesthetic", "immutable"], a: "quotidian", why: "A routine of every day is quotidian. Aesthetic is about beauty, and immutable means unchangeable." } ] },
    { text: "Many people were {1} about the new diet, but when scientists ran an {2} test, measuring real people for a year, the claimed benefit proved {3}.",
      blanks: [
        { o: ["sanguine", "contrite", "phlegmatic"], a: "sanguine", why: "Hopeful and cheerful about something is sanguine. Contrite means sorry, and phlegmatic means calm." },
        { o: ["empirical", "aesthetic", "derivative"], a: "empirical", why: "A test that measures real people is empirical (based on observation). Aesthetic is about beauty, and derivative means copied." },
        { o: ["spurious", "immutable", "tortuous"], a: "spurious", why: "A benefit that turns out not to be real is spurious. Immutable means unchangeable, and tortuous means full of twists." } ] },
    { text: "The boy felt {1} about breaking the window and begged for forgiveness, while the {2} teacher, who noticed every small detail, made sure that every piece of glass was swept away.",
      blanks: [
        { o: ["contrite", "gregarious", "impetuous"], a: "contrite", why: "Feeling truly sorry and asking forgiveness is contrite. Gregarious means sociable, and impetuous means rash." },
        { o: ["fastidious", "artless", "quixotic"], a: "fastidious", why: "Noticing every small detail is fastidious. Artless means natural, and quixotic means noble but unrealistic." } ] },
    { text: "Her {1} plan to give every child a laptop was noble but impossible to pay for, so the {2} treasurer suggested a smaller plan that could really work.",
      blanks: [
        { o: ["quixotic", "pragmatic", "empirical"], a: "quixotic", why: "A noble plan that cannot work in real life is quixotic. Pragmatic means practical, and empirical means based on evidence." },
        { o: ["pragmatic", "quixotic", "derivative"], a: "pragmatic", why: "A treasurer who suggests a plan that can really work is practical: pragmatic. Quixotic means unrealistic, and derivative means copied." } ] },
    { text: "The lecture was so {1} that half the audience fell asleep, its {2} details about ancient grammar interested only a few, and the long, {3} argument twisted and turned until nobody knew where it was going.",
      blanks: [
        { o: ["soporific", "quotidian", "bucolic"], a: "soporific", why: "A talk that makes people fall asleep is soporific. Quotidian means daily, and bucolic is about the countryside." },
        { o: ["recondite", "derivative", "pedestrian"], a: "recondite", why: "Details that interest only a few experts are recondite. Derivative means copied, and pedestrian means dull." },
        { o: ["tortuous", "arduous", "immutable"], a: "tortuous", why: "An argument that twists and turns is tortuous. Arduous means tiring, and immutable means unchangeable." } ] }
  ],
  ctx: [
    { w: "advocate", s: "The group will advocate lower bus fares at the council meeting.", q: "syn", a: "support", d: ["supporter", "oppose", "ignore"],
      why: "Here advocate is a verb: to support an idea in public. As a noun it means the person who does it." },
    { w: "advocate", s: "She was a lifelong advocate for children's rights.", q: "syn", a: "supporter", d: ["support", "critic", "teacher"],
      why: "Here advocate is a noun: a person who supports a cause. As a verb it means to support." },
    { w: "pedestrian", s: "The movie had a pedestrian plot that surprised nobody.", q: "syn", a: "dull", d: ["walking", "careful", "rare"],
      why: "Here pedestrian is an adjective meaning dull and ordinary. As a noun it means a person who walks." },
    { w: "pedestrian", s: "A pedestrian must wait for the green light before crossing.", q: "syn", a: "walker", d: ["dull", "driver", "rider"],
      why: "Here pedestrian is a noun: a person on foot. As an adjective it means dull." },
    { w: "dupe", s: "The email tried to dupe people into clicking a fake link.", q: "syn", a: "trick", d: ["victim", "warn", "copy"],
      why: "Here dupe is a verb: to trick someone. As a noun it means the person who was tricked." },
    { w: "dupe", s: "He was the dupe of a clever thief and never saw the trick coming.", q: "syn", a: "victim", d: ["trick", "hero", "friend"],
      why: "Here dupe is a noun: a person who is tricked. As a verb it means to trick." }
  ]
};
