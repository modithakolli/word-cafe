/* Word Café data, batch 7: levels 46-50 (50 words). Same rules as data.js.
   10 groups (5 words each). Level 46 pairs group 0 with group 5, level 47 pairs 1 with 6, and so on.
   These words were picked because they appear in many GRE word lists. */
window.WORD_CAFE7 = {
  levels: [
    { id: "L46", title: "Rants and Fakes", blurb: "Angry speeches, flattery and false faces." },
    { id: "L47", title: "Better, Worse, No", blurb: "Words about change, and about refusing." },
    { id: "L48", title: "Calm and Clear Thinking", blurb: "Sleepy calm, and ideas that need proof." },
    { id: "L49", title: "Hard Roads, Kind Hearts", blurb: "Difficult things and gentle manners." },
    { id: "L50", title: "Causes and Views", blurb: "What starts things, and how people see them." }
  ],
  groups: [
    {
      title: "Angry Words", blurb: "Long speeches that attack.", id: "G091", cluster: "rant",
      words: [
        { w: "diatribe", m: "A long, bitter speech or text that attacks someone or something.", ex: "The newspaper printed a diatribe against the new tax.",
          tip: "Greek dia + tribein = 'rub away'. A diatribe rubs a person away with long, harsh words, like a very long bitter post.", fam: "diatribes",
          s: "Her blog post was a long, bitter ____ against the city council, listing every mistake of the last ten years.", d: ["platitude", "approbation", "opprobrium"],
          why: "Diatribe = a long, bitter attack in speech or writing. A blog post that lists every mistake is that. A platitude is a dull common saying, approbation is approval, and opprobrium is public shame." },
        { w: "tirade", m: "A long, angry outburst of words.", ex: "The coach let out a tirade after the lost match.",
          tip: "Think TIRED: after a tirade the speaker is tired from shouting. Picture a driver in a traffic jam who shouts for five minutes.", fam: "tirades",
          s: "Without warning, the angry coach let loose a ____ of shouted insults at the referee, then stormed off the field.", d: ["eulogy", "platitude", "approbation"],
          why: "Tirade = a sudden, long, angry outburst, usually spoken. 'Without warning' and 'shouted insults' show a heated outburst. A eulogy is a speech of praise, a platitude is a dull saying, and approbation is approval." },
        { w: "harangue", m: "To lecture a group in a loud, forceful way.", ex: "The manager would harangue the staff every Monday.",
          tip: "HARANGUE sounds like HANG + ANGRY: someone stands over a crowd and talks at them angrily for a long time.", fam: "harangues, harangued",
          s: "The captain stood before the tired team and began to ____ them for an hour, scolding them and urging them to train harder.", d: ["impugn", "eschew", "gainsay"],
          why: "Harangue = to lecture a group loudly and forcefully, to scold or push them. The captain talks at the team for an hour. Impugn is to question honesty, eschew is to avoid, and gainsay is to deny." },
        { w: "impugn", m: "To attack or question the truth or honesty of someone.", ex: "He tried to impugn her honesty with a false story.",
          tip: "PUGN is the root of 'pugilist' (a boxer). To impugn is to punch someone's honesty with words.", fam: "impugned, impugning",
          s: "The lawyer tried to ____ the witness's honesty by showing that he had already lied under oath twice.", d: ["harangue", "eschew", "abjure"],
          why: "Impugn = to attack or question someone's honesty or a claim. The lawyer wants people to doubt the witness. Harangue is to lecture a crowd, eschew is to avoid, and abjure is to give up." },
        { w: "opprobrium", m: "Public shame and strong blame.", ex: "He faced public opprobrium after the cheating scandal.",
          tip: "Latin probrum = disgrace. Think of a viral video that brings you public shame: the comments are pure opprobrium.", fam: "opprobrious",
          s: "After the cheating scandal, he lived under the ____ of his neighbours: shame and disgrace followed him everywhere.", d: ["tirade", "approbation", "platitude"],
          why: "Opprobrium = public shame and blame that follows a person. 'Shame and disgrace followed him' is the clue. A tirade is one angry speech, approbation is approval, and a platitude is a dull saying." }
      ]
    },
    {
      title: "Smooth Talk and Fakes", blurb: "Flattery, tricks and empty words.", id: "G092", cluster: "fake",
      words: [
        { w: "sycophant", m: "A person who flatters the powerful to get something.", ex: "The sycophant laughed at every joke the boss made.",
          tip: "SYCOPHANT sounds like 'sick-o fan': a fan so sick with admiration that he praises the boss for everything.", fam: "sycophantic, sycophancy",
          s: "The new manager was surrounded by a ____ who agreed with every idea and praised every decision, hoping for a promotion.", d: ["dupe", "misanthrope", "pedestrian"],
          why: "Sycophant = a person who flatters the powerful to gain something. Agreeing with everything to get a promotion is that. A dupe is a tricked person, a misanthrope dislikes people, and pedestrian means dull." },
        { w: "glib", m: "Speaking in a smooth, easy way, but not sincere or deep.", ex: "His glib answer sounded good but said nothing.",
          tip: "GLIB sounds like GLIDE + LIP: words slide off the lip smoothly, with no real thought behind them.", fam: "glibly, glibness",
          s: "The salesman had a ____ answer for every question, smooth and fast, but when we checked, none of it was true or deep.", d: ["artless", "contrite", "solicitous"],
          why: "Glib = smooth and quick but not sincere or deep. The answers were fast but empty. Artless means natural and honest, contrite means truly sorry, and solicitous means caring." },
        { w: "dissemble", m: "To hide your true feelings or plans behind a false face.", ex: "She tried to dissemble, smiling while she felt angry.",
          tip: "DIS-SEMBLE: your face does not RESEMBLE the truth. You pretend to feel one thing while you feel another.", fam: "dissembler, dissembling",
          s: "Though he was furious about the news, he managed to ____ by smiling and thanking everyone calmly.", d: ["emulate", "foment", "impugn"],
          why: "Dissemble = to hide what you really feel by pretending. He is furious but shows a smile. Emulate is to copy, foment is to stir up trouble, and impugn is to attack someone's honesty." },
        { w: "platitude", m: "A dull, overused remark that sounds wise but says little.", ex: "'Everything happens for a reason' is a platitude.",
          tip: "French plat = flat. A platitude is a flat plate of food with nothing special: a saying so used that it has no taste left.", fam: "platitudes, platitudinous",
          s: "'Time heals all wounds' is a ____: true enough, but so often repeated that it comforts nobody.", d: ["diatribe", "opprobrium", "approbation"],
          why: "Platitude = a flat, overused saying. 'So often repeated that it comforts nobody' is the clue. A diatribe is a long bitter attack, opprobrium is public shame, and approbation is approval." },
        { w: "dupe", m: "To trick someone; or a person who is tricked.", ex: "The fake email tried to dupe people into sharing their passwords.",
          tip: "Think of a scam call: the scammer wants to DUPE you, and if it works, you become the DUPE.", fam: "duped, dupes",
          s: "The scam call tried to ____ elderly people into giving away their bank codes by pretending to be from the bank.", d: ["harangue", "emulate", "engender"],
          why: "Dupe = to trick someone. Pretending to be the bank is a trick. Harangue is to lecture loudly, emulate is to copy, and engender is to cause a feeling." }
      ]
    },
    {
      title: "Better and Worse", blurb: "Making things grow, shrink, improve or get worse.", id: "G093", cluster: "improve",
      words: [
        { w: "immutable", m: "Never changing; impossible to change.", ex: "The law of gravity is immutable.",
          tip: "IM-MUTABLE = cannot MUTATE. Think of a character in a story who can never change, whatever happens.", fam: "immutably, mutable",
          s: "Some people think that character is ____, fixed at birth and impossible to change, however hard a person tries.", d: ["amenable", "disparate", "pragmatic"],
          why: "Immutable = cannot be changed. 'Fixed at birth and impossible to change' is the clue. Amenable means easy to persuade, disparate means very different, and pragmatic means practical." },
        { w: "ameliorate", m: "To make a bad situation better.", ex: "New medicine helped ameliorate his pain.",
          tip: "Latin melior = better. To ameliorate is to make things 'more better', like adding a softer pillow to a hard bed.", fam: "amelioration",
          s: "The city built free clinics to ____ the health problems of its poorest areas, making conditions a little better each year.", d: ["exacerbate", "foment", "engender"],
          why: "Ameliorate = to make a bad situation better. The clinics improve conditions. Exacerbate does the opposite (worse), foment means to stir up trouble, and engender means to cause." },
        { w: "exacerbate", m: "To make a bad situation worse.", ex: "Scratching the rash will only exacerbate it.",
          tip: "Same root as ACERBIC (sharp, bitter). To exacerbate is to make something bad more sharp and painful, like scratching an itch.", fam: "exacerbation",
          s: "Shouting at the frightened child will only ____ the problem, leaving him more upset than before.", d: ["ameliorate", "attenuate", "gainsay"],
          why: "Exacerbate = to make a bad thing worse. 'More upset than before' shows it got worse. Ameliorate makes it better, attenuate makes it weaker, and gainsay means to deny." },
        { w: "attenuate", m: "To make weaker, thinner or less strong.", ex: "Thick walls attenuate the sound of the street.",
          tip: "TENUOUS = thin. To attenuate is to make thin and weak, like adding water to strong juice until the taste fades.", fam: "attenuation, attenuated",
          s: "Heavy curtains and thick walls ____ the noise from the road, so only a faint hum reaches the bedroom.", d: ["augment", "exacerbate", "foment"],
          why: "Attenuate = to make weaker. Only a faint hum is left. Augment means to add more, exacerbate makes things worse, and foment means to stir up." },
        { w: "augment", m: "To make larger by adding more.", ex: "He took an evening job to augment his income.",
          tip: "Think of 'augmented reality': extra things are added to what you see. To augment is to add and make bigger.", fam: "augmentation, augmented",
          s: "She took a weekend tutoring job to ____ her small salary, adding a little extra to cover her rent.", d: ["attenuate", "eschew", "dissemble"],
          why: "Augment = to make bigger by adding. The tutoring adds money to her salary. Attenuate means to weaken, eschew means to avoid, and dissemble means to hide your feelings." }
      ]
    },
    {
      title: "Against and Away", blurb: "Hostile, agreeable, and giving things up.", id: "G094", cluster: "oppose",
      words: [
        { w: "inimical", m: "Unfriendly or harmful, like an enemy.", ex: "Smoke is inimical to your health.",
          tip: "IN-IMICAL: not AMICABLE. Latin inimicus = enemy. A thing that acts like an enemy to something else.", fam: "inimically",
          s: "Years of dust and damp were ____ to the old paintings, slowly eating away the colours.", d: ["amenable", "artless", "solicitous"],
          why: "Inimical = harmful, acting like an enemy. Dust and damp eat the colours, so they harm the paintings. Amenable means willing to agree, artless means natural, and solicitous means caring." },
        { w: "amenable", m: "Willing to listen or agree; easy to persuade.", ex: "The shopkeeper was amenable to a lower price.",
          tip: "AMEN-able: you say 'AMEN' (yes) easily. An amenable person agrees without a big fight.", fam: "amenability",
          s: "I thought the stubborn old landlord would refuse, but he proved ____ to our request and agreed to lower the rent.", d: ["inimical", "immutable", "opaque"],
          why: "Amenable = willing to agree. He agreed to lower the rent. Inimical means hostile, immutable means unchangeable, and opaque means hard to see through." },
        { w: "abjure", m: "To promise, in a serious way, to give something up for good.", ex: "At the ceremony, the knight swore to abjure violence.",
          tip: "AB-JURE: swear AWAY (jury = swearing). You swear a solemn oath to give up a habit or belief.", fam: "abjured, abjuration",
          s: "At the ceremony the knight swore to ____ violence for the rest of his life, promising before everyone never to fight again.", d: ["gainsay", "impugn", "augment"],
          why: "Abjure = to promise solemnly to give something up. He swore an oath before everyone. Gainsay means to deny, impugn means to attack honesty, and augment means to add more." },
        { w: "eschew", m: "To keep away from something on purpose.", ex: "She chose to eschew sugar and fried food.",
          tip: "ESCHEW sounds like a sneeze, 'ess-CHOO!': you turn your head away on purpose. You avoid it.", fam: "eschewed, eschewing",
          s: "To protect his voice before the concert, the singer chose to ____ ice-cream, cold drinks and shouting, avoiding them all week.", d: ["gainsay", "foment", "dupe"],
          why: "Eschew = to avoid something on purpose. He stays away from things that harm his voice. Gainsay means to deny, foment means to stir up trouble, and dupe means to trick." },
        { w: "gainsay", m: "To say that something is not true; to deny or argue against.", ex: "No one could gainsay her skill.",
          tip: "GAIN-SAY: old English 'gain' = against. To say AGAINST something. 'There is no gainsaying it' = nobody can deny it.", fam: "gainsaid, gainsaying",
          s: "Nobody could ____ the evidence: the video, the receipts and three witnesses all showed that he was there.", d: ["abjure", "eschew", "emulate"],
          why: "Gainsay = to deny or argue against. Nobody could deny the evidence. Abjure means to swear off, eschew means to avoid, and emulate means to copy." }
      ]
    },
    {
      title: "Calm and Sleepy", blurb: "Quiet minds, easy days and hopeful hearts.", id: "G095", cluster: "sleepy",
      words: [
        { w: "phlegmatic", m: "Calm and slow to get excited or upset.", ex: "The phlegmatic driver stayed calm in the traffic jam.",
          tip: "PHLEGM is slow, thick stuff. Old doctors thought people full of phlegm were slow and calm. A phlegmatic person never panics.", fam: "phlegmatically",
          s: "While everyone else panicked at the fire alarm, the ____ clerk finished his tea and calmly walked out.", d: ["impetuous", "gregarious", "contrite"],
          why: "Phlegmatic = calm and not easily excited. He stays calm while everyone panics. Impetuous means rash, gregarious means sociable, and contrite means sorry." },
        { w: "soporific", m: "Making you feel sleepy.", ex: "The soporific lecture sent half the class to sleep.",
          tip: "Latin sopor = deep sleep. A soporific talk is 'so poor' that it puts you to sleep. A bedtime story can be soporific.", fam: "soporifics",
          s: "The speaker's flat voice and endless slides were so ____ that three students were asleep within ten minutes.", d: ["arduous", "fastidious", "impetuous"],
          why: "Soporific = making you sleepy. Students fall asleep, so the talk had a sleepy effect. Arduous means hard and tiring, fastidious means picky, and impetuous means rash." },
        { w: "sanguine", m: "Hopeful and cheerful, even when things look bad.", ex: "She stayed sanguine about the exam despite the hard questions.",
          tip: "Latin sanguis = blood. Old doctors thought people with plenty of red blood were cheerful and hopeful.", fam: "sanguinely",
          s: "Even after three failed attempts, Neha stayed ____ and cheerfully told everyone that a better offer was surely coming.", d: ["phlegmatic", "contrite", "tortuous"],
          why: "Sanguine = hopeful and cheerful. She stays positive after failing. Phlegmatic means calm but not necessarily hopeful, contrite means sorry, and tortuous means twisting." },
        { w: "bucolic", m: "Peaceful and typical of the countryside.", ex: "They moved to a bucolic village with green fields.",
          tip: "Greek bous = cow. Cows in a green field: a bucolic picture of country life.", fam: "bucolically",
          s: "After years in a noisy city, they moved to a ____ village of green fields, grazing cows and one tiny post office.", d: ["quotidian", "recondite", "pedestrian"],
          why: "Bucolic = peaceful and of the countryside. Fields and cows are the clue. Quotidian means daily, recondite means hard to understand, and pedestrian means dull." },
        { w: "quotidian", m: "Happening every day; ordinary.", ex: "She wrote poems about quotidian things like making tea.",
          tip: "QUOTidian has 'QUOTE a DAY' inside it: every day, the same daily routine.", fam: "quotidian life",
          s: "The novel finds beauty in ____ moments: buying bread, waiting for the bus, and washing the same cups every morning.", d: ["bucolic", "opaque", "derivative"],
          why: "Quotidian = of every day, ordinary. Bread, the bus and the same cups are daily things. Bucolic means countryside, opaque means hard to see through, and derivative means copied." }
      ]
    },
    {
      title: "Ideas and Proof", blurb: "Practical, tested, beautiful, copied and different.", id: "G096", cluster: "idea",
      words: [
        { w: "pragmatic", m: "Practical; thinking about what works, not perfect ideas.", ex: "A pragmatic cook uses what is already in the fridge.",
          tip: "Greek pragma = deed. A pragmatic person asks 'Does it work?' and not 'Is it perfect?'", fam: "pragmatism, pragmatically",
          s: "The ____ mayor did not care about grand plans; she fixed the potholes first because that was what voters needed and she could afford.", d: ["quixotic", "aesthetic", "recondite"],
          why: "Pragmatic = practical, focused on what works. Fixing potholes she can afford is practical. Quixotic means noble but unrealistic, aesthetic is about beauty, and recondite means hard to understand." },
        { w: "empirical", m: "Based on experiments and what you can observe, not just theory.", ex: "The doctor wanted empirical proof that the drug worked.",
          tip: "Greek empeiria = experience. Empirical = learned by experience: you test it, measure it, and see.", fam: "empirically, empiricism",
          s: "Scientists did not trust the theory until it was supported by ____ evidence: measurements taken in real experiments.", d: ["aesthetic", "pragmatic", "derivative"],
          why: "Empirical = based on observation and experiments. 'Measurements taken in real experiments' is the clue. Aesthetic is about beauty, pragmatic means practical, and derivative means copied." },
        { w: "aesthetic", m: "About beauty and good taste.", ex: "The room was cheap but had a real aesthetic charm.",
          tip: "Think of an Instagram 'aesthetic': a style chosen for how it looks and feels, not for how useful it is.", fam: "aesthetics, aesthetically",
          s: "The architect chose the stone not for strength or cost but for its ____ value: the way its warm colour pleased the eye.", d: ["empirical", "pragmatic", "disparate"],
          why: "Aesthetic = about beauty. The stone is chosen for how it looks. Empirical is about evidence, pragmatic is about what works, and disparate means very different." },
        { w: "derivative", m: "Copied from something else; not original.", ex: "The film felt derivative, like a copy of an older movie.",
          tip: "DERIVATIVE = derived from another thing. A movie whose story is 'derived' from another movie: a copy of a copy.", fam: "derive, derivation",
          s: "Critics said the band's new album was ____: every song sounded like a weaker copy of their favourite old group.", d: ["quixotic", "disparate", "empirical"],
          why: "Derivative = copied from something else, not original. Every song copies an old group. Quixotic means noble but unrealistic, disparate means very different, and empirical means based on evidence." },
        { w: "disparate", m: "So different that they cannot be compared.", ex: "The two brothers have disparate tastes.",
          tip: "DIS-PARATE: not a PAIR. Things so different that they could never make a pair.", fam: "disparity",
          s: "The club brought together ____ people: a farmer, a lawyer, a dancer and a teenager, with almost nothing in common.", d: ["derivative", "pragmatic", "phlegmatic"],
          why: "Disparate = very different from each other. A farmer, a lawyer, a dancer and a teenager have almost nothing in common. Derivative means copied, pragmatic means practical, and phlegmatic means calm." }
      ]
    },
    {
      title: "Hard and Hidden", blurb: "Tiring roads, twisting paths and unclear things.", id: "G097", cluster: "hard",
      words: [
        { w: "arduous", m: "Needing a lot of effort; hard and tiring.", ex: "The arduous climb took six hours.",
          tip: "Latin arduus = steep. An arduous task is like climbing a steep hill with a heavy bag.", fam: "arduously",
          s: "The ____ climb to the temple took six hours in the hot sun, and everyone arrived completely exhausted.", d: ["spurious", "opaque", "recondite"],
          why: "Arduous = needing great effort, hard and tiring. Six hours in the hot sun, ending exhausted, is the clue. Spurious means false, opaque means hard to see through, and recondite means hard to understand." },
        { w: "tortuous", m: "Full of twists and turns; or very complicated.", ex: "We followed a tortuous mountain road.",
          tip: "TORT = twist (contort, torture). A tortuous road twists like a snake. Do not mix it with 'torturous' (painful).", fam: "tortuously",
          s: "The ____ road twisted back and forth along the cliff, bending left, then right, then left again every few metres.", d: ["arduous", "opaque", "spurious"],
          why: "Tortuous = full of twists and turns. The road bends left, right, left again. Arduous means hard work, opaque means hard to see through, and spurious means false." },
        { w: "opaque", m: "Impossible to see through; hard to understand.", ex: "The glass was opaque, so nobody could see inside.",
          tip: "OPAQUE: think 'OPEN? NAH.' You cannot see through it. Opaque glass blocks light, and opaque writing blocks meaning.", fam: "opacity",
          s: "The company's accounts were so ____ that even the auditors could not see where the money had gone.", d: ["spurious", "arduous", "aesthetic"],
          why: "Opaque = cannot be seen through, hard to understand. The auditors could not see where the money went. Spurious means false, arduous means tiring, and aesthetic is about beauty." },
        { w: "recondite", m: "Hard to understand; known only to a few experts.", ex: "He loves recondite facts about old maps.",
          tip: "Latin recondere = to hide away. Recondite knowledge is hidden deep, like a secret book that only a few people have read.", fam: "reconditely",
          s: "The lecture was full of ____ details about ancient grammar, interesting only to the three experts in the room.", d: ["opaque", "bucolic", "quotidian"],
          why: "Recondite = deep and known only to experts. 'Only the three experts' is the clue. Opaque means hard to see through, bucolic means countryside, and quotidian means daily." },
        { w: "spurious", m: "Not real; looking true but false.", ex: "He gave a spurious excuse that nobody believed.",
          tip: "SPURIOUS sounds like 'spoofy': a spoof looks real but is fake. A spurious claim looks true and is not.", fam: "spuriously",
          s: "The report claimed that ice-cream sales cause drowning, a ____ link: in fact both simply rise when the weather is hot.", d: ["tortuous", "aesthetic", "immutable"],
          why: "Spurious = looks true but is false. Ice-cream does not cause drowning; hot weather causes both. Tortuous means twisting, aesthetic is about beauty, and immutable means unchangeable." }
      ]
    },
    {
      title: "Manners and Feelings", blurb: "Sorry, caring, natural, picky and friendly.", id: "G098", cluster: "manner",
      words: [
        { w: "contrite", m: "Truly sorry for doing wrong.", ex: "The contrite boy returned the toy and apologized.",
          tip: "Latin contritus = ground down (like grinding spice). Guilt grinds a contrite person down until they are truly sorry.", fam: "contrition, contritely",
          s: "The ____ driver visited the injured cyclist every day and begged to be forgiven, truly ashamed of what he had done.", d: ["gregarious", "phlegmatic", "fastidious"],
          why: "Contrite = truly sorry and ashamed. Begging forgiveness is the clue. Gregarious means sociable, phlegmatic means calm, and fastidious means picky." },
        { w: "solicitous", m: "Showing care and concern for someone's comfort.", ex: "The solicitous nurse kept asking if he was warm enough.",
          tip: "A SOLICITOUS waiter keeps asking 'Is everything fine? Do you need anything?' It sounds like 'sol-ISSIT-ous?'", fam: "solicitude, solicitously",
          s: "The ____ host kept asking whether the guests were warm enough, hungry enough and comfortable enough.", d: ["contrite", "fastidious", "gregarious"],
          why: "Solicitous = caring about someone's comfort. The host keeps checking on the guests. Contrite means sorry, fastidious means picky, and gregarious means sociable." },
        { w: "artless", m: "Natural and honest, without tricks.", ex: "The child gave an artless smile.",
          tip: "ARTLESS = without ART (tricks). No hidden plan and no pretending, like a small child telling the plain truth.", fam: "artlessly, artlessness",
          s: "Her ____ answer, simple and honest, with no trace of a hidden plan, charmed the interviewers.", d: ["glib", "fastidious", "derivative"],
          why: "Artless = natural and honest, with no tricks. 'No trace of a hidden plan' is the clue. Glib is smooth but not sincere, fastidious means picky, and derivative means copied." },
        { w: "fastidious", m: "Very careful about details; hard to please.", ex: "He is fastidious about keeping his desk neat.",
          tip: "Latin fastidium = disgust. A fastidious person is disgusted very fast: one crumb on the table and they cannot sit.", fam: "fastidiously",
          s: "The ____ chef rejected the plate twice because one carrot was cut slightly thicker than the others.", d: ["artless", "solicitous", "sanguine"],
          why: "Fastidious = very careful about small details, hard to please. Rejecting a plate for one thick carrot is the clue. Artless means natural, solicitous means caring, and sanguine means hopeful." },
        { w: "gregarious", m: "Liking to be with other people; sociable.", ex: "A gregarious person makes friends fast.",
          tip: "Latin grex = flock. A gregarious person is like a sheep that loves to stay with the flock.", fam: "gregariously",
          s: "She loves parties, group trips and chatting with strangers; she is the most ____ person in the office.", d: ["phlegmatic", "contrite", "artless"],
          why: "Gregarious = loves company, sociable. Parties and strangers are the clue. Phlegmatic means calm, contrite means sorry, and artless means natural." }
      ]
    },
    {
      title: "Causing and Copying", blurb: "What starts things, and what we copy.", id: "G099", cluster: "cause",
      words: [
        { w: "engender", m: "To cause a feeling or a situation to begin.", ex: "Kind words engender trust.",
          tip: "EN-GENDER sounds like GENERATE: to give birth to something, like a feeling or a problem.", fam: "engendered",
          s: "A fair and open process will ____ trust among the staff, slowly giving rise to loyalty.", d: ["foment", "emulate", "abjure"],
          why: "Engender = to cause something to begin. A fair process gives rise to trust. Foment means to stir up trouble on purpose, emulate means to copy, and abjure means to give up." },
        { w: "foment", m: "To stir up trouble or anger on purpose.", ex: "The spy tried to foment a rebellion.",
          tip: "Think FERMENT: stir a pot until it bubbles over. To foment is to stir up trouble until it boils.", fam: "fomented, fomentation",
          s: "Rival newspapers tried to ____ anger among the voters by printing false stories on purpose, hoping for riots.", d: ["emulate", "ameliorate", "abjure"],
          why: "Foment = to stir up trouble on purpose. False stories printed on purpose, hoping for riots, is the clue. Emulate means to copy, ameliorate means to improve, and abjure means to give up." },
        { w: "emulate", m: "To copy someone you admire, trying to equal them.", ex: "Young players emulate their football heroes.",
          tip: "E-MULATE: like a student who copies the topper's study habits to score as high as the topper.", fam: "emulation",
          s: "Little Arjun practises for hours every day, hoping to ____ his hero, the great batsman, and one day play as well.", d: ["foment", "dupe", "impugn"],
          why: "Emulate = to copy someone you admire, to equal them. Arjun wants to play as well as his hero. Foment means to stir up trouble, dupe means to trick, and impugn means to attack honesty." },
        { w: "fortuitous", m: "Happening by chance, often with a lucky result.", ex: "Our meeting at the station was fortuitous.",
          tip: "FORTUITOUS has FORTUNE inside: it happened by chance. A lucky accident, not a plan.", fam: "fortuitously",
          s: "It was a ____ meeting: neither of us had planned to be at the station, yet we ran into each other by pure chance.", d: ["impetuous", "artless", "amenable"],
          why: "Fortuitous = happening by chance. 'Neither of us had planned' and 'pure chance' are the clues. Impetuous means rash, artless means natural, and amenable means willing to agree." },
        { w: "impetuous", m: "Acting quickly without thinking.", ex: "His impetuous decision to quit cost him the job.",
          tip: "IMPETUS = a rush forward. An impetuous person rushes in like a bull and thinks later.", fam: "impetuosity, impetuously",
          s: "Ravi is ____: he bought a motorbike on the spot, without asking the price or checking any other shop.", d: ["fastidious", "phlegmatic", "solicitous"],
          why: "Impetuous = acting fast without thinking. He bought on the spot without checking. Fastidious means picky, phlegmatic means calm, and solicitous means caring." }
      ]
    },
    {
      title: "Views and People", blurb: "Praise, hate, big dreams and plain ideas.", id: "G100", cluster: "view",
      words: [
        { w: "approbation", m: "Approval and praise.", ex: "The teacher nodded in approbation.",
          tip: "APPROBATION = APPROVE + -ATION. Think of a crowd nodding and clapping: that warm approval is approbation.", fam: "approbatory",
          s: "The crowd's loud cheers showed their warm ____ of the mayor's plan, and no one spoke against it.", d: ["opprobrium", "diatribe", "tirade"],
          why: "Approbation = approval and praise. Cheers and no one speaking against it is the clue. Opprobrium is public shame, and a diatribe and a tirade are angry attacks." },
        { w: "misanthrope", m: "A person who dislikes and avoids other people.", ex: "The misanthrope lived alone in the hills.",
          tip: "Greek misos = hate, anthropos = human. A misanthrope hates humans, like someone who turns off the lights when guests knock.", fam: "misanthropic, misanthropy",
          s: "A true ____ lives alone on a hill and refuses every invitation, because he dislikes people and avoids them.", d: ["sycophant", "advocate", "dupe"],
          why: "Misanthrope = a person who dislikes and avoids people. Living alone and refusing invitations is the clue. A sycophant flatters the powerful, an advocate supports a cause, and a dupe is a tricked person." },
        { w: "quixotic", m: "Full of noble ideas that are not practical.", ex: "His quixotic plan was to end all traffic by painting arrows.",
          tip: "Don QUIXOTE fought windmills because he thought they were giants. Quixotic = noble dreams that do not fit real life.", fam: "quixotically",
          s: "Her ____ plan to end all poverty with one small charity was noble and kind, but nobody thought it could work.", d: ["pragmatic", "empirical", "fastidious"],
          why: "Quixotic = full of noble ideas that are not practical. Noble and kind but unlikely to work is the clue. Pragmatic is the opposite (practical), empirical means based on evidence, and fastidious means picky." },
        { w: "advocate", m: "To publicly support an idea; or a person who does.", ex: "She will advocate free school meals for all children.",
          tip: "AD-VOCATE: VOC = voice (vocal). To advocate is to lend your voice to a cause, like a lawyer speaking for a client.", fam: "advocacy, advocated",
          s: "Every week the group writes to the minister to ____ free school meals for all children.", d: ["gainsay", "abjure", "impugn"],
          why: "Advocate = to publicly support an idea. Writing every week for free meals is support. Gainsay means to deny, abjure means to give up, and impugn means to attack honesty." },
        { w: "pedestrian", m: "Dull and ordinary; lacking imagination.", ex: "The film had a pedestrian plot.",
          tip: "A pedestrian walks on foot, slowly, with no wings. A pedestrian idea only walks along: nothing to make anyone look up.", fam: "pedestrians",
          s: "The film had good actors but a ____ story that never surprised anyone: you could guess every scene before it came.", d: ["quixotic", "bucolic", "aesthetic"],
          why: "Pedestrian (adjective) = dull and ordinary. A story you can predict is dull. Quixotic means noble but unrealistic, bucolic means countryside, and aesthetic is about beauty." }
      ]
    }
  ],
  puzzles: [
    { id: "Q046", cat: "Ratio", q: "A bag has red and blue marbles in the ratio 3 : 5. There are 40 marbles in all. How many are red?", opts: ["12", "15", "20", "25"], ans: 1,
      why: "3 + 5 = 8 parts. 40 / 8 = 5 marbles per part. Red is 3 parts: 3 x 5 = 15." },
    { id: "Q047", cat: "Average", q: "The average of five numbers is 12. A sixth number is added and the average becomes 14. What is the sixth number?", opts: ["14", "20", "24", "26"], ans: 2,
      why: "Five numbers add to 5 x 12 = 60. Six numbers add to 6 x 14 = 84. The sixth number is 84 - 60 = 24." },
    { id: "Q048", cat: "Quantity comparison", q: "x is a positive integer.  Quantity A: x squared.  Quantity B: x.  Which is true?", opts: ["A is greater", "B is greater", "They are equal", "Cannot be decided"], ans: 3,
      why: "If x = 1, both are 1, so they are equal. If x = 2, A is 4 and B is 2, so A is greater. Two different results means it cannot be decided." },
    { id: "Q049", cat: "Probability", q: "A fair die is rolled once. What is the probability of getting a number greater than 4?", opts: ["1/6", "1/3", "1/2", "2/3"], ans: 1,
      why: "Only 5 and 6 are greater than 4. That is 2 outcomes out of 6, which is 2/6 = 1/3." },
    { id: "Q050", cat: "Speed", q: "A train travels 150 km in 2.5 hours. At the same speed, how far does it travel in 4 hours?", opts: ["200 km", "220 km", "240 km", "260 km"], ans: 2,
      why: "Speed = 150 / 2.5 = 60 km per hour. In 4 hours: 60 x 4 = 240 km." }
  ]
};

// The groups above are written in teaching order. Levels pair group j with group 5+j, so put them in
// that order: level 46 = Angry Words + Smooth Talk, 47 = Better and Worse + Against and Away,
// 48 = Calm and Sleepy + Ideas and Proof, 49 = Hard and Hidden + Manners, 50 = Causing + Views.
window.WORD_CAFE7.groups = [0, 2, 4, 6, 8, 1, 3, 5, 7, 9].map(function (i) { return window.WORD_CAFE7.groups[i]; });
