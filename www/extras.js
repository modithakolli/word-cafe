/* Word Café extras: look-alike words (Confusables) and reading passages.
   Confusable: { s: sentence with ____, o: [two options], a: right option, why: reason }
   Passage: text uses {1} {2} {3} for blanks. Each blank has 4 options "o", the answer "a", and a reason. */
window.WORD_CAFE_X = {
  confusables: [
    { s: "Before the book was printed, an official had to ____ three pages that the government did not like.", o: ["censor", "censure"], a: "censor",
      why: "To censor = to cut or ban parts of a text. To censure = to criticize strongly. Here pages are cut, so it is censor." },
    { s: "The committee voted to ____ the manager for hiding the loss, but it did not remove him from the job.", o: ["censure", "censor"], a: "censure",
      why: "Censure = strong, formal disapproval. The committee criticizes him but does not cut or ban anything, so it is censure." },
    { s: "Our school has three ____ groups, each studying a completely separate topic.", o: ["discrete", "discreet"], a: "discrete",
      why: "Discrete = separate and distinct. Discreet = careful and private. The groups are separate, so it is discrete. (Memory trick: the two E's in discrEEt are together, like a secret kept close.)" },
    { s: "A good doctor is ____ about her patients' illnesses and never talks about them in public.", o: ["discreet", "discrete"], a: "discreet",
      why: "Discreet = careful about what you say, keeping things private. She never talks about patients, so it is discreet." },
    { s: "From the smoke coming out of the kitchen, we can ____ that someone is cooking.", o: ["infer", "imply"], a: "infer",
      why: "The listener or reader infers (works out a conclusion from clues). The speaker or writer implies (hints). We are working out a conclusion from smoke, so it is infer." },
    { s: "When he said, 'Nice of you to come on time for once,' he meant to ____ that she is often late.", o: ["imply", "infer"], a: "imply",
      why: "To imply = to hint at something without saying it. The speaker is hinting, so it is imply." },
    { s: "A good teacher knows how to ____ answers from even the shyest students.", o: ["elicit", "illicit"], a: "elicit",
      why: "Elicit (verb) = to draw out a reaction or answer. Illicit (adjective) = not allowed by law. Here we need a verb that draws out answers." },
    { s: "The police arrested the gang for selling ____ goods in the night market.", o: ["illicit", "elicit"], a: "illicit",
      why: "Illicit = illegal or not allowed. The goods are sold against the law, so it is illicit." },
    { s: "A judge must be ____: she should gain nothing, either way, from the result of the case.", o: ["disinterested", "uninterested"], a: "disinterested",
      why: "Disinterested = fair, with no personal gain at stake. Uninterested = not caring. A judge must be fair, so it is disinterested." },
    { s: "He yawned and looked at his phone all through the lecture because he was ____ in the topic.", o: ["uninterested", "disinterested"], a: "uninterested",
      why: "Uninterested = not interested, bored. Yawning and looking at the phone shows boredom, so it is uninterested." },
    { s: "The ____ official took money from every contractor before signing any contract.", o: ["venal", "venial"], a: "venal",
      why: "Venal = willing to be bribed, corrupt for money. Venial = small and easy to forgive (like a minor fault). Taking bribes is venal." },
    { s: "The law will ____ the use of plastic bags in the market from January.", o: ["proscribe", "prescribe"], a: "proscribe",
      why: "Proscribe = to forbid. Prescribe = to order as a treatment or rule (a doctor prescribes medicine). The law forbids bags, so it is proscribe." },
    { s: "The doctor will ____ rest and plenty of water for the next three days.", o: ["prescribe", "proscribe"], a: "prescribe",
      why: "Prescribe = to order as a treatment. The doctor orders rest and water, so it is prescribe." },
    { s: "Drivers who ____ the traffic rules put everyone in danger.", o: ["flout", "flaunt"], a: "flout",
      why: "Flout = to openly ignore a rule. Flaunt = to show off. Ignoring rules is flout." },
    { s: "She likes to ____ her new car by parking it right in front of the office window.", o: ["flaunt", "flout"], a: "flaunt",
      why: "Flaunt = to show off proudly. She is showing off her car, so it is flaunt." },
    { s: "The new facts ____ against his claim, so most people no longer believe it.", o: ["militate", "mitigate"], a: "militate",
      why: "Militate against = to be strong evidence against something. Mitigate = to make something less severe. Facts that work against a claim militate." },
    { s: "Planting more trees will help ____ the summer heat in the city.", o: ["mitigate", "militate"], a: "mitigate",
      why: "Mitigate = to make something bad less severe. Trees make the heat less severe, so it is mitigate." },
    { s: "Her story was ____: it had dates, names and three witnesses who agreed.", o: ["credible", "credulous"], a: "credible",
      why: "Credible = believable. Credulous = too ready to believe. A story with witnesses is believable, so it is credible." },
    { s: "A ____ listener will believe any rumour, even one with no proof at all.", o: ["credulous", "credible"], a: "credulous",
      why: "Credulous = too ready to believe things. A person who believes any rumour is credulous. Credible describes a story or source, not a believer." },
    { s: "The road up the mountain was long and ____, turning back on itself again and again.", o: ["tortuous", "torturous"], a: "tortuous",
      why: "Tortuous = full of twists and turns. Torturous = causing great pain. The road twists, so it is tortuous." }
  ],
  passages: [
    { id: "R01", title: "The Wedding Speeches",
      text: "The wedding dinner had two speeches. The first, from the bride's father, was {1}: just three sentences, yet half the guests wiped their eyes. The second, from an uncle, was so {2} that he repeated every point four times and was still going when dessert arrived. Even the {3} cousin, who usually chatters through every event, was quietly checking his phone.",
      blanks: [
        { a: "pithy", o: ["pithy", "prolix", "verbose", "garrulous"], why: "Three short sentences that made guests cry is short and full of meaning, which is pithy. Prolix, verbose and garrulous all mean using too many words." },
        { a: "verbose", o: ["verbose", "laconic", "pithy", "terse"], why: "Repeating every point four times is using more words than needed, which is verbose. Laconic, pithy and terse all mean using few words." },
        { a: "garrulous", o: ["garrulous", "laconic", "taciturn", "reticent"], why: "A cousin who usually chatters is garrulous. Laconic, taciturn and reticent describe people who say little." }
      ] },
    { id: "R02", title: "The Cricket Final",
      text: "After the final, some online users began to {1} the captain, falsely claiming he had thrown the match. His lawyer called the claims pure {2}, a false statement meant to ruin his name, and promised to sue. A week later, when the truth came out, the same people began to {3} him as a hero.",
      blanks: [
        { a: "vilify", o: ["vilify", "laud", "extol", "placate"], why: "Saying terrible, false things to make him look evil is vilify. Laud and extol mean to praise, and placate means to calm an angry person." },
        { a: "calumny", o: ["calumny", "largess", "encomium", "eulogy"], why: "A false statement meant to hurt a name is calumny. Largess is generous giving, and an encomium or a eulogy is a speech of praise." },
        { a: "laud", o: ["laud", "vilify", "spurn", "deride"], why: "Treating him as a hero means praising him, which is laud. Vilify, spurn and deride mean the opposite." }
      ] },
    { id: "R03", title: "Rohan's Money",
      text: "Rohan grew up without much money, which taught him to be {1}: he saved every coin and repaired what others threw away, though he never turned a guest away. His cousin was the opposite, a {2} young man who spent his whole inheritance in a year. Years later, when Rohan became rich, he was {3}, paying for a new school in his village without asking for any thanks.",
      blanks: [
        { a: "frugal", o: ["frugal", "miserly", "prodigal", "destitute"], why: "Saving coins sensibly but still welcoming guests is frugal. Miserly would mean mean even to guests, and prodigal means wasteful." },
        { a: "prodigal", o: ["prodigal", "frugal", "munificent", "miserly"], why: "Spending a whole inheritance in a year is wasteful, which is prodigal." },
        { a: "munificent", o: ["munificent", "frugal", "miserly", "prodigal"], why: "Paying for a whole school with no thanks wanted is very generous, which is munificent." }
      ] },
    { id: "R04", title: "The Old Neighbours",
      text: "For thirty years the two neighbours shared a wall and a bitter {1} over a tiny strip of land, an old anger that neither would let go. When a flood hit both houses, the old man brought tea to his rival, a kind act that helped {2} his anger. The government also promised money to {3} the damage from the flood.",
      blanks: [
        { a: "enmity", o: ["enmity", "largess", "adversity", "travail"], why: "A bitter, lasting hatred between two people is enmity. Largess is generous giving, adversity is hard times, and travail is hard work." },
        { a: "placate", o: ["placate", "mitigate", "decimate", "spurn"], why: "Making an angry person calmer is placate. Mitigate is for reducing damage, decimate means to destroy a large part, and spurn means to refuse." },
        { a: "mitigate", o: ["mitigate", "placate", "fester", "putrefy"], why: "Money that makes the damage less severe is mitigate. Placate calms people, and fester and putrefy mean getting worse or rotting." }
      ] },
    { id: "R05", title: "The King's Court",
      text: "The king was an {1} ruler who made every decision alone. His ministers, {2} in every meeting, nodded at each of his words and laughed at his jokes, hoping for favours. Only one young clerk had the {3} to tell him that the new tax was unfair.",
      blanks: [
        { a: "autocratic", o: ["autocratic", "docile", "tacit", "frugal"], why: "Making every decision alone is autocratic. Docile means easy to manage, tacit means unspoken, and frugal means careful with money." },
        { a: "obsequious", o: ["obsequious", "brazen", "reticent", "droll"], why: "Nodding and laughing to win favours is obsequious. Brazen means shameless, reticent means unwilling to speak, and droll means quietly funny." },
        { a: "temerity", o: ["temerity", "largess", "penury", "hubris"], why: "Having the nerve to tell the king is temerity. Largess is generous giving, penury is poverty, and hubris is too much pride." }
      ] },
    { id: "R06", title: "The Village Library",
      text: "The village library was {1}: only three visitors a week and a leaking roof. But a {2} young librarian refused to give up and wrote to every donor for a year. Soon the number of readers began to {3}, and the library, now a lively place, won an award for its work.",
      blanks: [
        { a: "moribund", o: ["moribund", "latent", "tacit", "covert"], why: "Almost dead, with almost no visitors, is moribund. Latent means hidden, tacit means unspoken, and covert means secret." },
        { a: "tenacious", o: ["tenacious", "headstrong", "obdurate", "docile"], why: "Not giving up and writing to every donor, in a good way, is tenacious. Headstrong and obdurate sound negative, and docile means easy to manage." },
        { a: "burgeon", o: ["burgeon", "dwindle", "wane", "fester"], why: "Readers growing quickly is burgeon. Dwindle and wane mean getting smaller, and fester means getting worse." }
      ] }
  ]
};
