(() => {
  "use strict";
const ADVERBS_DATA = [
  { day: 1, words: [{ ur: "آہستہ", en: "Slowly" }, { ur: "جلدی", en: "Quickly" }, { ur: "خوشی سے", en: "Happily" }], paragraph: "He walked slowly in the garden. The birds flew quickly above him. He smiled happily at the bright morning." },
  { day: 2, words: [{ ur: "اداسی سے", en: "Sadly" }, { ur: "زور سے", en: "Loudly" }, { ur: "نرمی سے", en: "Softly" }], paragraph: "The boy spoke sadly about his lost toy. His sister called him loudly. He answered softly with a small smile." },
  { day: 3, words: [{ ur: "احتیاط سے", en: "Carefully" }, { ur: "بہادری سے", en: "Bravely" }, { ur: "آسانی سے", en: "Easily" }], paragraph: "She opened the box carefully. The cat looked bravely inside. Everything happened easily." },
  { day: 4, words: [{ ur: "مشکل سے / محنت سے", en: "Hard" }, { ur: "تیزی سے", en: "Fast" }, { ur: "دیر سے", en: "Late" }], paragraph: "He worked hard on his homework. The wind blew fast. He still finished it, though late in the evening." },
  { day: 5, words: [{ ur: "جلد / سویرے", en: "Early" }, { ur: "خاموشی سے", en: "Quietly" }, { ur: "ادب سے", en: "Politely" }], paragraph: "She woke up early today. She walked quietly to the kitchen. She greeted her mother politely." },
  { day: 6, words: [{ ur: "بدتمیزی سے", en: "Rudely" }, { ur: "صفائی سے", en: "Neatly" }, { ur: "بے ترتیبی سے", en: "Messily" }], paragraph: "The boy spoke rudely at first. Then he rewrote his note neatly. His teacher said he should not write messily again." },
  { day: 7, words: [{ ur: "غصے سے", en: "Angrily" }, { ur: "سکون سے", en: "Calmly" }, { ur: "گھبراہٹ سے", en: "Nervously" }], paragraph: "He shouted angrily when he lost the game. His friend talked calmly to him. Soon he laughed nervously." },
  { day: 8, words: [{ ur: "خوش دلی سے", en: "Cheerfully" }, { ur: "صبر سے", en: "Patiently" }, { ur: "نرمی سے", en: "Gently" }], paragraph: "The girl sang cheerfully. She waited patiently for her turn. The teacher spoke gently to her." },
  { day: 9, words: [{ ur: "ایمانداری سے", en: "Honestly" }, { ur: "ہمیشہ", en: "Always" }, { ur: "کبھی نہیں", en: "Never" }], paragraph: "He answered honestly in class. He always tries his best. He never lies." },
  { day: 10, words: [{ ur: "اکثر", en: "Often" }, { ur: "کبھی کبھی", en: "Sometimes" }, { ur: "کم ہی", en: "Rarely" }], paragraph: "She often visits her grandmother. She sometimes takes flowers. She rarely returns empty-handed." },
  { day: 11, words: [{ ur: "عمومًا", en: "Usually" }, { ur: "عام طور پر", en: "Normally" }, { ur: "روزانہ", en: "Daily" }], paragraph: "He is usually happy in school. He plays normally with his friends. He reads the newspaper daily." },
  { day: 12, words: [{ ur: "ہفتہ وار", en: "Weekly" }, { ur: "ماہانہ", en: "Monthly" }, { ur: "سالانہ", en: "Yearly" }], paragraph: "They meet weekly for games. Their library record is updated monthly. The festival happens yearly." },
  { day: 13, words: [{ ur: "یہاں", en: "Here" }, { ur: "وہاں", en: "There" }, { ur: "ہر جگہ", en: "Everywhere" }], paragraph: "Come here and sit. Put your bag there. Laughter filled the room everywhere." },
  { day: 14, words: [{ ur: "کہیں نہیں", en: "Nowhere" }, { ur: "اندر", en: "Inside" }, { ur: "باہر", en: "Outside" }], paragraph: "I looked nowhere else for the key. It was inside the drawer. We went outside to play after finding it." },
  { day: 15, words: [{ ur: "اوپر", en: "Up" }, { ur: "نیچے", en: "Down" }, { ur: "قریب", en: "Near" }], paragraph: "The kite went up in the sky. It soon came down. We stood near the trees to watch it." },
  { day: 16, words: [{ ur: "دور", en: "Far" }, { ur: "دور / الگ", en: "Away" }, { ur: "واپس", en: "Back" }], paragraph: "The school is far from home. My friend lives away from the city. We walked back before sunset." },
  { day: 17, words: [{ ur: "جلد ہی", en: "Soon" }, { ur: "بعد میں", en: "Later" }, { ur: "آج", en: "Today" }], paragraph: "He will finish the work soon. I will check it later. Let's meet today to discuss it." },
  { day: 18, words: [{ ur: "کل (گزرا ہوا)", en: "Yesterday" }, { ur: "کل (آنے والا)", en: "Tomorrow" }, { ur: "آج رات", en: "Tonight" }], paragraph: "We played cricket yesterday. We will study together tomorrow. Let's talk again tonight." },
  { day: 19, words: [{ ur: "بری طرح", en: "Badly" }, { ur: "اچھے سے", en: "Well" }, { ur: "بالکل صحیح", en: "Perfectly" }], paragraph: "He danced badly at first. Later he performed very well. The teacher said he did perfectly at the end." },
  { day: 20, words: [{ ur: "تقریبًا", en: "Almost" }, { ur: "ابھی / صرف", en: "Just" }, { ur: "صرف", en: "Only" }], paragraph: "The room was almost full. I had just arrived. Only two seats were left." },
  { day: 21, words: [{ ur: "بہت زیادہ", en: "Too" }, { ur: "بہت", en: "Very" }, { ur: "کافی", en: "Quite" }], paragraph: "The bag was too heavy. The road was very long. We were quite tired." },
  { day: 22, words: [{ ur: "حقیقت میں", en: "Really" }, { ur: "صاف طور پر", en: "Clearly" }, { ur: "ظاہر ہے", en: "Obviously" }], paragraph: "He explained the topic really well. I understood it clearly. The answer was obviously correct." },
  { day: 23, words: [{ ur: "ممکنہ طور پر", en: "Possibly" }, { ur: "غالبًا", en: "Probably" }, { ur: "شاید", en: "Maybe" }], paragraph: "It is possibly going to rain. It will probably be cold. Maybe we should stay home." },
  { day: 24, words: [{ ur: "اچانک", en: "Suddenly" }, { ur: "آہستہ آہستہ", en: "Gradually" }, { ur: "فورًا", en: "Immediately" }], paragraph: "The lights went off suddenly. They returned gradually after a minute. The children clapped immediately." },
  { day: 25, words: [{ ur: "آخرکار", en: "Finally" }, { ur: "حقیقت میں", en: "Actually" }, { ur: "حال ہی میں", en: "Recently" }], paragraph: "We finally reached home. She said she was actually not tired. We cleaned the room recently." },
  { day: 26, words: [{ ur: "پہلے ہی", en: "Already" }, { ur: "دوبارہ", en: "Again" }, { ur: "ایک بار", en: "Once" }], paragraph: "He had already eaten lunch. He asked for tea again. He drinks coffee once a day." },
  { day: 27, words: [{ ur: "دو بار", en: "Twice" }, { ur: "تین بار", en: "Thrice" }, { ur: "شاذ و نادر", en: "Seldom" }], paragraph: "She knocked twice on the door. Then she called thrice. She seldom gets no answer." },
  { day: 28, words: [{ ur: "خوش قسمتی سے", en: "Fortunately" }, { ur: "بدقسمتی سے", en: "Unfortunately" }, { ur: "سچ میں", en: "Honestly" }], paragraph: "We arrived fortunately before the rain. The match was unfortunately delayed. The coach spoke honestly about the problem." },
  { day: 29, words: [{ ur: "مہربانی سے", en: "Kindly" }, { ur: "خوبصورتی سے / نفاست سے", en: "Gracefully" }, { ur: "شرماتے ہوئے", en: "Bashfully" }], paragraph: "He spoke kindly to the lost child. She walked gracefully toward him. The child smiled bashfully." },
  { day: 30, words: [{ ur: "عجیب طور پر", en: "Strangely" }, { ur: "عام طور پر", en: "Normally" }, { ur: "مختصر طور پر", en: "Briefly" }], paragraph: "The room looked strangely quiet. Everything seemed normally arranged. He explained the plan briefly." },
];

const PREPOSITIONS_DATA = [
  { day: 1, words: [{ ur: "میں", en: "In" }, { ur: "پر", en: "On" }, { ur: "پر / کے پاس", en: "At" }], paragraph: "I am in the room. The book is on the table. I am at school today. She is at the door.", difficult: [{ en: "quiet", ur: "خاموش" }, { en: "safe", ur: "محفوظ" }, { en: "desk", ur: "میز" }] },
  { day: 2, words: [{ ur: "نیچے", en: "Under" }, { ur: "اوپر", en: "Over" }, { ur: "قریب", en: "Near" }], paragraph: "The cat sleeps under the table. The bird flies over the house. My house is near the park.", difficult: [{ en: "rolled", ur: "لڑھک گیا" }, { en: "bridge", ur: "پل" }, { en: "blanket", ur: "کمبل" }] },
  { day: 3, words: [{ ur: "سے دور", en: "Far from" }, { ur: "درمیان", en: "Between" }, { ur: "کے درمیان", en: "Among" }], paragraph: "The village is far from the city. The ball is between the chairs. She lives among friends.", difficult: [{ en: "village", ur: "گاؤں" }, { en: "parents", ur: "والدین" }, { en: "grass", ur: "گھاس" }] },
  { day: 4, words: [{ ur: "کی طرف / کو", en: "To" }, { ur: "سے", en: "From" }, { ur: "کے اندر", en: "Into" }], paragraph: "I go to school daily. I came from home early. The boy ran into the room.", difficult: [{ en: "gift", ur: "تحفہ" }, { en: "mistakes", ur: "غلطیاں" }, { en: "smoke", ur: "دھواں" }] },
  { day: 5, words: [{ ur: "سے باہر", en: "Out of" }, { ur: "آر پار", en: "Across" }, { ur: "اندر سے", en: "Through" }], paragraph: "The cat ran out of the house. We walked across the road. Light comes through the window.", difficult: [{ en: "pocket", ur: "جیب" }, { en: "forest", ur: "جنگل" }, { en: "practice", ur: "مشق" }] },
  { day: 6, words: [{ ur: "کے ذریعے", en: "By" }, { ur: "کے ساتھ", en: "With" }, { ur: "کے بغیر", en: "Without" }], paragraph: "I travel by bus. I go with my brother. I cannot live without water.", difficult: [{ en: "kindness", ur: "مہربانی" }, { en: "spoon", ur: "چمچ" }, { en: "goodbye", ur: "الوداع" }] },
  { day: 7, words: [{ ur: "سے پہلے", en: "Before" }, { ur: "کے بعد", en: "After" }, { ur: "کے دوران", en: "During" }], paragraph: "Wash your hands before eating. I rest after work. I stayed quiet during class.", difficult: [{ en: "sunrise", ur: "سورج نکلنا" }, { en: "prayer", ur: "نماز" }, { en: "journey", ur: "سفر" }] },
  { day: 8, words: [{ ur: "تک", en: "Till / Until" }, { ur: "سے اب تک", en: "Since" }, { ur: "کے لیے", en: "For" }], paragraph: "I waited until evening. I have lived here since 2015. I studied for two hours.", difficult: [{ en: "midnight", ur: "آدھی رات" }, { en: "childhood", ur: "بچپن" }, { en: "flowers", ur: "پھول" }] },
  { day: 9, words: [{ ur: "کے دوران", en: "During" }, { ur: "کے اندر", en: "Within" }, { ur: "سارے دوران", en: "Throughout" }], paragraph: "He slept during the movie. Finish the work within a week. She smiled throughout the day.", difficult: [{ en: "nervous", ur: "گھبرایا ہوا" }, { en: "returned", ur: "واپس آیا" }, { en: "focused", ur: "توجہ دی" }] },
  { day: 10, words: [{ ur: "پیچھے", en: "Behind" }, { ur: "سامنے", en: "In front of" }, { ur: "پاس", en: "Beside" }], paragraph: "The child hid behind the door. The school is in front of the park. I sat beside my friend.", difficult: [{ en: "hid", ur: "چھپ گیا" }, { en: "mirror", ur: "آئینہ" }, { en: "lamp", ur: "چراغ" }] },
  { day: 11, words: [{ ur: "بالکل پاس", en: "Next to" }, { ur: "اوپر", en: "Above" }, { ur: "نیچے", en: "Below" }], paragraph: "I sit next to my teacher. The picture hangs above the bed. The temperature fell below zero.", difficult: [{ en: "hangs", ur: "لٹکا ہوا" }, { en: "temperature", ur: "درجہ حرارت" }, { en: "lies", ur: "واقع ہے" }] },
  { day: 12, words: [{ ur: "کے ساتھ ساتھ", en: "Along" }, { ur: "ارد گرد", en: "Around" }, { ur: "کے خلاف", en: "Against" }], paragraph: "We walked along the river. Children played around the tree. The ladder leaned against the wall.", difficult: [{ en: "fence", ur: "باڑ" }, { en: "gathered", ur: "اکٹھے ہوئے" }, { en: "injustice", ur: "ناانصافی" }] },
  { day: 13, words: [{ ur: "جیسا", en: "Like" }, { ur: "کے طور پر", en: "As" }, { ur: "کے مطابق", en: "According to" }], paragraph: "He fights like a lion. She works as a teacher. According to the rules, phones are not allowed.", difficult: [{ en: "leader", ur: "رہنما" }, { en: "advice", ur: "مشورہ" }, { en: "allowed", ur: "اجازت ہے" }] },
  { day: 14, words: [{ ur: "کا / کی / کے", en: "Of" }, { ur: "کے ساتھ", en: "With" }, { ur: "کے بغیر", en: "Without" }], paragraph: "The color of the dress is blue. She spoke with confidence. Life is hard without peace.", difficult: [{ en: "honor", ur: "عزت" }, { en: "confidence", ur: "اعتماد" }, { en: "warning", ur: "انتباہ" }] },
  { day: 15, words: [{ ur: "کے ذریعے", en: "By" }, { ur: "استعمال کرتے ہوئے", en: "Using" }, { ur: "کے ذریعے", en: "Through" }], paragraph: "The letter was sent by post. He wrote the letter using a pen. We heard the news through TV.", difficult: [{ en: "experience", ur: "تجربہ" }, { en: "vegetables", ur: "سبزیاں" }, { en: "effort", ur: "کوشش" }] },
  { day: 16, words: [{ ur: "فی", en: "Per" }, { ur: "پر / کی رفتار سے", en: "At" }, { ur: "قیمت", en: "For" }], paragraph: "He earns money per day. The train arrived at noon. He bought the book for 500 rupees.", difficult: [{ en: "earns", ur: "کماتا ہے" }, { en: "speed", ur: "رفتار" }, { en: "price", ur: "قیمت" }] },
  { day: 17, words: [{ ur: "سے باہر", en: "Out of" }, { ur: "سے", en: "Off" }, { ur: "پر چڑھ کر", en: "Onto" }], paragraph: "We ran out of water. The bottle fell off the table. The cat jumped onto the roof.", difficult: [{ en: "stepped", ur: "قدم رکھا" }, { en: "paint", ur: "رنگ" }, { en: "stage", ur: "اسٹیج" }] },
  { day: 18, words: [{ ur: "کی طرف", en: "Toward(s)" }, { ur: "سے دور", en: "Away from" }, { ur: "آگے سے", en: "Past" }], paragraph: "He walked towards the door. He moved away from danger. We walked past the mosque.", difficult: [{ en: "owner", ur: "مالک" }, { en: "noise", ur: "شور" }, { en: "quickly", ur: "تیزی سے" }] },
  { day: 19, words: [{ ur: "اندر", en: "Inside" }, { ur: "باہر", en: "Outside" }, { ur: "کے نیچے", en: "Beneath" }], paragraph: "Stay inside the house. Children are playing outside. The treasure is hidden beneath the ground.", difficult: [{ en: "warm", ur: "گرم" }, { en: "cold", ur: "ٹھنڈا" }, { en: "stream", ur: "نالہ" }] },
  { day: 20, words: [{ ur: "سے آگے", en: "Beyond" }, { ur: "کے باوجود", en: "Despite" }, { ur: "کے علاوہ", en: "Except" }], paragraph: "The village lies beyond the hill. He smiled despite pain. Everyone came except Ali.", difficult: [{ en: "kindness", ur: "مہربانی" }, { en: "illness", ur: "بیماری" }, { en: "passed", ur: "کامیاب ہوئے" }] },
  { day: 21, words: [{ ur: "کے بارے میں", en: "Regarding" }, { ur: "کے متعلق", en: "Concerning" }, { ur: "کے بارے میں", en: "About" }], paragraph: "I spoke regarding the issue. She talked concerning her health. We talked about the movie.", difficult: [{ en: "issue", ur: "مسئلہ" }, { en: "safety", ur: "حفاظت" }, { en: "future", ur: "مستقبل" }] },
  { day: 22, words: [{ ur: "سے زیادہ", en: "Above" }, { ur: "سے کم", en: "Below" }, { ur: "کے خلاف", en: "Against" }], paragraph: "The temperature rose above normal. His score is below average. We voted against the plan.", difficult: [{ en: "average", ur: "اوسط" }, { en: "score", ur: "نمبر" }, { en: "cruelty", ur: "ظلم" }] },
  { day: 23, words: [{ ur: "کے ذریعے", en: "Via" }, { ur: "کے ساتھ ساتھ", en: "Alongside" }, { ur: "درمیان", en: "Amid" }], paragraph: "I sent the message via email. She walked alongside her mother. He stayed calm amid chaos.", difficult: [{ en: "parcel", ur: "پارسل" }, { en: "path", ur: "راستہ" }, { en: "chaos", ur: "افراتفری" }] },
  { day: 24, words: [{ ur: "سے پہلے", en: "Before" }, { ur: "کے بعد", en: "After" }, { ur: "تک", en: "Until" }], paragraph: "Think before acting. Rest after study. Wait until I return.", difficult: [{ en: "acting", ur: "عمل کرنا" }, { en: "success", ur: "کامیابی" }, { en: "return", ur: "واپس آنا" }] },
  { day: 25, words: [{ ur: "کے درمیان", en: "Among" }, { ur: "درمیان", en: "Between" }, { ur: "پاس", en: "Beside" }], paragraph: "She felt safe among friends. Sit between your parents. He stood beside me.", difficult: [{ en: "bloomed", ur: "کھلے" }, { en: "divided", ur: "تقسیم کیا" }, { en: "lamp", ur: "چراغ" }] },
  { day: 26, words: [{ ur: "نیچے", en: "Under" }, { ur: "اوپر", en: "Over" }, { ur: "اوپر", en: "Above" }], paragraph: "The dog slept under the tree. Clouds moved over the city. Stars shine above us.", difficult: [{ en: "cloth", ur: "کپڑا" }, { en: "fence", ur: "باڑ" }, { en: "shine", ur: "چمکنا" }] },
  { day: 27, words: [{ ur: "پیچھے", en: "Behind" }, { ur: "سے آگے", en: "Ahead of" }, { ur: "قریب", en: "Near" }], paragraph: "The child hid behind the door. He walked ahead of me. I live near the mosque.", difficult: [{ en: "mountains", ur: "پہاڑ" }, { en: "goal", ur: "مقصد" }, { en: "mosque", ur: "مسجد" }] },
  { day: 28, words: [{ ur: "سے دور", en: "Far from" }, { ur: "کی طرف", en: "Toward" }, { ur: "سے دور", en: "Away from" }], paragraph: "The town is far from here. He ran toward help. Stay away from danger.", difficult: [{ en: "war", ur: "جنگ" }, { en: "leads", ur: "جاتا ہے" }, { en: "noise", ur: "شور" }] },
  { day: 29, words: [{ ur: "کے حوالے سے", en: "With respect to" }, { ur: "کے باوجود", en: "In spite of" }, { ur: "کی وجہ سے", en: "Owing to" }], paragraph: "Changes were made with respect to rules. He smiled in spite of pain. The match was canceled owing to rain.", difficult: [{ en: "request", ur: "درخواست" }, { en: "succeeded", ur: "کامیاب ہوئے" }, { en: "canceled", ur: "منسوخ" }] },
  { day: 30, words: [{ ur: "سے تعلق رکھنے والا", en: "Belonging to" }, { ur: "کی خاطر", en: "For the sake of" }, { ur: "کے حق میں", en: "In favor of" }], paragraph: "This book is belonging to me. He worked hard for the sake of his family. They voted in favor of peace.", difficult: [{ en: "farmers", ur: "کسان" }, { en: "sacrificed", ur: "قربانی دی" }, { en: "justice", ur: "انصاف" }] },
];

const ADJECTIVES_DATA = [
  { day: 1, words: [{ en: "Big", ur: "بڑا", comp: "bigger", super: "biggest" }, { en: "Small", ur: "چھوٹا", comp: "smaller", super: "smallest" }, { en: "Tall", ur: "لمبا", comp: "taller", super: "tallest" }], paragraph: "The school has a big playground. My friend says his playground is bigger. But I think the city park is the biggest. We all play there happily. It feels fun to run in such a wide space." },
  { day: 2, words: [{ en: "Short", ur: "ٹھگنا", comp: "shorter", super: "shortest" }, { en: "Young", ur: "کم عمر", comp: "younger", super: "youngest" }, { en: "Old", ur: "بوڑھا / پرانا", comp: "older", super: "oldest" }], paragraph: "I wrote a short story yesterday. My friend wrote a shorter one. But our teacher's story was the shortest. We all enjoyed reading it. It made the class very happy." },
  { day: 3, words: [{ en: "Good", ur: "اچھا", comp: "better", super: "best" }, { en: "Bad", ur: "بُرا", comp: "worse", super: "worst" }, { en: "Kind", ur: "نرم دل", comp: "kinder", super: "kindest" }], paragraph: "Today was a good day at school. Tomorrow will be even better. But the holidays are always the best. We plan fun activities every year. It makes everyone excited." },
  { day: 4, words: [{ en: "Happy", ur: "خوش", comp: "happier", super: "happiest" }, { en: "Sad", ur: "اداس", comp: "sadder", super: "saddest" }, { en: "Angry", ur: "غصے والا", comp: "angrier", super: "angriest" }], paragraph: "I felt happy when I saw my friend. I became happier when she hugged me. But I was the happiest when she gave me a card. We sat and talked for a while. It was a lovely moment." },
  { day: 5, words: [{ en: "Hot", ur: "گرم", comp: "hotter", super: "hottest" }, { en: "Cold", ur: "ٹھنڈا", comp: "colder", super: "coldest" }, { en: "Warm", ur: "نیم گرم", comp: "warmer", super: "warmest" }], paragraph: "The morning was cold. Afternoon became colder. But night was the coldest. We wore jackets to stay warm. The air felt fresh." },
  { day: 6, words: [{ en: "Beautiful", ur: "خوبصورت", comp: "more beautiful", super: "most beautiful" }, { en: "Ugly", ur: "بدصورت", comp: "uglier", super: "ugliest" }, { en: "Clean", ur: "صاف", comp: "cleaner", super: "cleanest" }], paragraph: "My room looks clean today. My sister's room looks cleaner. But my mom keeps the kitchen the cleanest. It smells fresh every day. We all help her now." },
  { day: 7, words: [{ en: "Dirty", ur: "گندا", comp: "dirtier", super: "dirtiest" }, { en: "Soft", ur: "نرم", comp: "softer", super: "softest" }, { en: "Hard", ur: "سخت", comp: "harder", super: "hardest" }], paragraph: "My hands were dirty after playing. My shoes were even dirtier. But my clothes were the dirtiest. I washed everything carefully. Now I feel fresh again." },
  { day: 8, words: [{ en: "Fast", ur: "تیز", comp: "faster", super: "fastest" }, { en: "Slow", ur: "آہستہ", comp: "slower", super: "slowest" }, { en: "Strong", ur: "طاقتور", comp: "stronger", super: "strongest" }], paragraph: "The boy runs fast in the ground. His friend runs faster than him. But the captain is the fastest. Everyone cheers for them. Running makes the team strong." },
  { day: 9, words: [{ en: "Weak", ur: "کمزور", comp: "weaker", super: "weakest" }, { en: "Rich", ur: "امیر", comp: "richer", super: "richest" }, { en: "Poor", ur: "غریب", comp: "poorer", super: "poorest" }], paragraph: "She felt weak after the flu. She became weaker without rest. But she was the weakest in the morning. Her mother gave her soup. Slowly she felt better." },
  { day: 10, words: [{ en: "Easy", ur: "آسان", comp: "easier", super: "easiest" }, { en: "Difficult", ur: "مشکل", comp: "more difficult", super: "most difficult" }, { en: "Important", ur: "اہم", comp: "more important", super: "most important" }], paragraph: "The homework was easy today. Math problems were even easier. But reading was the easiest. I finished everything quickly. Now I can play." },
  { day: 11, words: [{ en: "Brave", ur: "بہادر", comp: "braver", super: "bravest" }, { en: "Honest", ur: "ایماندار", comp: "more honest", super: "most honest" }, { en: "Polite", ur: "باادب", comp: "politer", super: "politest" }], paragraph: "My teacher is kind to everyone. She becomes kinder when someone is sad. But she is the kindest to new students. They feel safe with her. I like her gentle nature." },
  { day: 12, words: [{ en: "Clever", ur: "چالاک", comp: "cleverer", super: "cleverest" }, { en: "Lazy", ur: "سست", comp: "lazier", super: "laziest" }, { en: "Active", ur: "سرگرم", comp: "more active", super: "most active" }], paragraph: "The turtle moves slow on the sand. Another turtle moves slower. But the baby turtle is the slowest. Still, it keeps trying. We clap when it reaches the water." },
  { day: 13, words: [{ en: "Quiet", ur: "خاموش", comp: "quieter", super: "quietest" }, { en: "Noisy", ur: "شور والا", comp: "noisier", super: "noisiest" }, { en: "Calm", ur: "پُرسکون", comp: "calmer", super: "calmest" }], paragraph: "The sky looked dark before the storm. It grew darker with thick clouds. But at night it became the darkest. We stayed inside safely. Soon the rain stopped." },
  { day: 14, words: [{ en: "Famous", ur: "مشہور", comp: "more famous", super: "most famous" }, { en: "Unknown", ur: "نامعلوم", comp: "more unknown", super: "most unknown" }, { en: "Busy", ur: "مصروف", comp: "busier", super: "busiest" }], paragraph: "He is strong for his age. His brother is stronger. But his cousin is the strongest. They all practice together. It makes them confident." },
  { day: 15, words: [{ en: "Free", ur: "فارغ", comp: "freer", super: "freest" }, { en: "Lucky", ur: "خوش قسمت", comp: "luckier", super: "luckiest" }, { en: "Unlucky", ur: "بدنصیب", comp: "unluckier", super: "unluckiest" }], paragraph: "He looked sad today. He became sadder when it started raining. But he felt the saddest when his friend left early. We all tried to cheer him up. Soon he started smiling again." },
  { day: 16, words: [{ en: "Early", ur: "جلد", comp: "earlier", super: "earliest" }, { en: "Late", ur: "دیر سے", comp: "later", super: "latest" }, { en: "Careful", ur: "محتاط", comp: "more careful", super: "most careful" }], paragraph: "The room looked bright in the morning. It became brighter when I opened the windows. But it was the brightest when the sun came out. The light filled every corner. It made the place beautiful." },
  { day: 17, words: [{ en: "Careless", ur: "لاپرواہ", comp: "more careless", super: "most careless" }, { en: "Helpful", ur: "مددگار", comp: "more helpful", super: "most helpful" }, { en: "Hopeful", ur: "پُرامید", comp: "more hopeful", super: "most hopeful" }], paragraph: "The test was difficult. The writing part was more difficult. But the science section was the most difficult. Still, I tried my best. I hope the result is good." },
  { day: 18, words: [{ en: "Hopeless", ur: "ناامید", comp: "more hopeless", super: "most hopeless" }, { en: "Faithful", ur: "وفادار", comp: "more faithful", super: "most faithful" }, { en: "Fearful", ur: "خوفزدہ", comp: "more fearful", super: "most fearful" }], paragraph: "He is rich because he works hard. His uncle is richer than him. But his grandfather is the richest in the family. They still live simply. Everyone respects them." },
  { day: 19, words: [{ en: "Powerful", ur: "طاقتور", comp: "more powerful", super: "most powerful" }, { en: "Peaceful", ur: "پُرامن", comp: "more peaceful", super: "most peaceful" }, { en: "Joyful", ur: "خوشی والا", comp: "more joyful", super: "most joyful" }], paragraph: "The room felt warm in winter. It became warmer when we closed the windows. But it was the warmest near the heater. We all sat together. It felt cozy and nice." },
  { day: 20, words: [{ en: "Cheerful", ur: "خوش مزاج", comp: "more cheerful", super: "most cheerful" }, { en: "Grateful", ur: "شکر گزار", comp: "more grateful", super: "most grateful" }, { en: "Respectful", ur: "ادب والا", comp: "more respectful", super: "most respectful" }], paragraph: "The family looked poor but cheerful. Their neighbours were even poorer. But the man across the street was the poorest. People helped him kindly. It made his life easier." },
  { day: 21, words: [{ en: "Generous", ur: "فیاض", comp: "more generous", super: "most generous" }, { en: "Curious", ur: "تجسس والا", comp: "more curious", super: "most curious" }, { en: "Serious", ur: "سنجیدہ", comp: "more serious", super: "most serious" }], paragraph: "The road is wide near our house. It becomes wider near the park. But the highway is the widest. Cars move smoothly there. We like travelling on it." },
  { day: 22, words: [{ en: "Ambitious", ur: "بلند حوصلہ", comp: "more ambitious", super: "most ambitious" }, { en: "Responsible", ur: "ذمہ دار", comp: "more responsible", super: "most responsible" }, { en: "Independent", ur: "خود مختار", comp: "more independent", super: "most independent" }], paragraph: "The alley is narrow. The street behind it is narrower. But the old lane is the narrowest. Only bikes can pass through it. We walk carefully there." },
  { day: 23, words: [{ en: "Confident", ur: "پُراعتماد", comp: "more confident", super: "most confident" }, { en: "Sensitive", ur: "حساس", comp: "more sensitive", super: "most sensitive" }, { en: "Creative", ur: "تخلیقی", comp: "more creative", super: "most creative" }], paragraph: "Our school is safe. The new building is safer. But the main hall is the safest. Teachers check everything daily. We feel protected." },
  { day: 24, words: [{ en: "Patient", ur: "صابر", comp: "more patient", super: "most patient" }, { en: "Impatient", ur: "بے صبر", comp: "more impatient", super: "most impatient" }, { en: "Generous", ur: "سخی", comp: "more generous", super: "most generous" }], paragraph: "The river is dangerous in the rain. It becomes more dangerous when the water rises. But storms make it the most dangerous. People stay away from it. Safety always comes first." },
  { day: 25, words: [{ en: "Polished", ur: "نفیس", comp: "more polished", super: "most polished" }, { en: "Accurate", ur: "درست", comp: "more accurate", super: "most accurate" }, { en: "Efficient", ur: "مؤثر", comp: "more efficient", super: "most efficient" }], paragraph: "I had a bad headache in the morning. It became worse after breakfast. By noon it felt the worst. So I took some rest. Soon I started feeling normal again." },
  { day: 26, words: [{ en: "Delicate", ur: "نازک", comp: "more delicate", super: "most delicate" }, { en: "Mysterious", ur: "پُر اسرار", comp: "more mysterious", super: "most mysterious" }, { en: "Obedient", ur: "فرمانبردار", comp: "more obedient", super: "most obedient" }], paragraph: "There is a tall tree near my house. Next to it stands another tree which is taller. But the one in the park is the tallest of all. Birds love sitting on it. I always watch them in the morning." },
  { day: 27, words: [{ en: "Intelligent", ur: "عقلمند", comp: "more intelligent", super: "most intelligent" }, { en: "Brilliant", ur: "ذہین", comp: "more brilliant", super: "most brilliant" }, { en: "Optimistic", ur: "پُرامید", comp: "more optimistic", super: "most optimistic" }], paragraph: "Our class has a young new student. His brother is younger than him. But their sister is the youngest in the family. They all walk to school together. Everyone greets them kindly." },
  { day: 28, words: [{ en: "Pessimistic", ur: "مایوس", comp: "more pessimistic", super: "most pessimistic" }, { en: "Courteous", ur: "مؤدب", comp: "more courteous", super: "most courteous" }], paragraph: "We live in an old house. The house next to ours is older. But the corner house is the oldest in the street. People say it has many stories. I like looking at its wooden doors." },
  { day: 29, words: [{ en: "Determined", ur: "پُرعزم", comp: "more determined", super: "most determined" }, { en: "Effortless", ur: "بے محنت", comp: "more effortless", super: "most effortless" }, { en: "Valuable", ur: "قیمتی", comp: "more valuable", super: "most valuable" }], paragraph: "The movie was funny. The cartoon was funnier. But the joke my friend told was the funniest. We laughed for many minutes. It made the day joyful." },
  { day: 30, words: [{ en: "Compassionate", ur: "ہمدرد", comp: "more compassionate", super: "most compassionate" }, { en: "Respectable", ur: "معزز", comp: "more respectable", super: "most respectable" }, { en: "Reliable", ur: "قابلِ بھروسا", comp: "more reliable", super: "most reliable" }], paragraph: "I have a small box for my pencils. My sister's box is smaller. But my baby brother has the smallest box. He keeps only one pencil inside. We all smile when he carries it proudly." },
];

const CONJUNCTIONS_DATA = [
  { day: 1, words: [{ ur: "اور", en: "And" }, { ur: "لیکن", en: "But" }, { ur: "یا", en: "Or" }], paragraph: "I like tea and I like coffee. Both drinks help me feel fresh. I wanted to go out, but it was raining. You can take a pen or a pencil. Choose one now.", difficult: [{ en: "fresh", ur: "تازہ" }, { en: "weather", ur: "موسم" }, { en: "useful", ur: "کارآمد" }] },
  { day: 2, words: [{ ur: "اس لیے", en: "So" }, { ur: "پھر بھی", en: "Yet" }, { ur: "کیونکہ", en: "For" }], paragraph: "It was very hot, so we drank cold water. He was tired, yet he finished his work. She was happy, for she passed the test.", difficult: [{ en: "relaxed", ur: "پرسکون" }, { en: "effort", ur: "کوشش" }, { en: "proud", ur: "فخر" }] },
  { day: 3, words: [{ ur: "جب", en: "When" }, { ur: "سے پہلے", en: "Before" }, { ur: "کے بعد", en: "After" }], paragraph: "I was smiling when I saw my friend. Wash your hands before you eat food. We played outside after school ended.", difficult: [{ en: "waved", ur: "ہاتھ ہلایا" }, { en: "habit", ur: "عادت" }, { en: "enjoyed", ur: "لطف اٹھایا" }] },
  { day: 4, words: [{ ur: "جبکہ", en: "While" }, { ur: "تک", en: "Until" }, { ur: "تب سے", en: "Since" }], paragraph: "I was reading while my sister was cooking. Wait here until I return. I have lived here since 2015.", difficult: [{ en: "quiet", ur: "خاموش" }, { en: "patient", ur: "صابر" }, { en: "safe", ur: "محفوظ" }] },
  { day: 5, words: [{ ur: "کیونکہ", en: "Because" }, { ur: "چونکہ", en: "As" }, { ur: "تاکہ", en: "So that" }], paragraph: "I stayed home because I was sick. As it was late, we left early. I study daily so that I can improve.", difficult: [{ en: "recover", ur: "صحت یاب ہونا" }, { en: "empty", ur: "خالی" }, { en: "confident", ur: "پراعتماد" }] },
  { day: 6, words: [{ ur: "اگر", en: "If" }, { ur: "جب تک نہیں", en: "Unless" }, { ur: "جب تک", en: "As long as" }], paragraph: "If you work hard, you will succeed. You will not pass unless you study. You can stay here as long as you are quiet.", difficult: [{ en: "succeed", ur: "کامیاب ہونا" }, { en: "seriously", ur: "سنجیدگی سے" }, { en: "disturb", ur: "پریشان کرنا" }] },
  { day: 7, words: [{ ur: "حالانکہ", en: "Although" }, { ur: "اگرچہ", en: "Though" }, { ur: "باوجود اس کے کہ", en: "Even though" }], paragraph: "Although it was raining, we played. He smiled though he was sad. Even though she was weak, she walked.", difficult: [{ en: "light", ur: "ہلکی" }, { en: "calm", ur: "پرسکون" }, { en: "admired", ur: "سراہا" }] },
  { day: 8, words: [{ ur: "دونوں...اور", en: "Both...and" }, { ur: "یا...یا", en: "Either...or" }, { ur: "نہ...نہ", en: "Neither...nor" }], paragraph: "Both Ali and Sara came early. You can either read or write. Neither he nor I was late.", difficult: [{ en: "pleased", ur: "خوش" }, { en: "activity", ur: "کام" }, { en: "calmly", ur: "سکون سے" }] },
  { day: 9, words: [{ ur: "نہ صرف...بلکہ", en: "Not only...but also" }, { ur: "چاہے...یا", en: "Whether...or" }, { ur: "کے بجائے", en: "Rather than" }], paragraph: "She is not only kind but also helpful. I will go whether it rains or not. I will walk rather than drive.", difficult: [{ en: "respected", ur: "معزز" }, { en: "prepared", ur: "تیار" }, { en: "active", ur: "متحرک" }] },
  { day: 10, words: [{ ur: "تاہم", en: "However" }, { ur: "لہذا", en: "Therefore" }, { ur: "مزید یہ کہ", en: "Moreover" }], paragraph: "It was cold. However, we went out. He was careless. Therefore, he failed. The book is easy. Moreover, it is interesting.", difficult: [{ en: "jackets", ur: "جیکٹس" }, { en: "careless", ur: "لاپرواہ" }, { en: "interesting", ur: "دلچسپ" }] },
  { day: 11, words: [{ ur: "جب کبھی", en: "Whenever" }, { ur: "ایک بار جب", en: "Once" }, { ur: "اسی دوران", en: "Meanwhile" }], paragraph: "Whenever I feel tired, I take a short rest. Once the bell rang, students went inside. I was cooking. Meanwhile, my brother cleaned the room.", difficult: [{ en: "relax", ur: "آرام کرنا" }, { en: "lesson", ur: "سبق" }, { en: "cleaned", ur: "صاف کیا" }] },
  { day: 12, words: [{ ur: "کیونکہ", en: "Since" }, { ur: "نتیجتاً", en: "As a result" }, { ur: "اس لیے", en: "Therefore" }], paragraph: "Since it was cold, we closed the window. He worked hard; as a result, he succeeded. The road was blocked; therefore, we took another way.", difficult: [{ en: "warmer", ur: "گرم" }, { en: "praised", ur: "تعریف کی" }, { en: "journey", ur: "سفر" }] },
  { day: 13, words: [{ ur: "بشرطیکہ", en: "Provided that" }, { ur: "اس شرط پر", en: "Providing that" }, { ur: "اس شرط پر کہ", en: "On condition that" }], paragraph: "You may go out provided that you finish homework. You can use my phone providing that you are careful. I will help you on condition that you try yourself.", difficult: [{ en: "freely", ur: "آزادی سے" }, { en: "delicate", ur: "نازک" }, { en: "depend", ur: "انحصار کرنا" }] },
  { day: 14, words: [{ ur: "جبکہ", en: "Whereas" }, { ur: "جبکہ", en: "While" }, { ur: "اس کے باوجود", en: "Nevertheless" }], paragraph: "Ali likes tea, whereas Ahmed likes coffee. I prefer reading, while my sister prefers drawing. It was difficult; nevertheless, we continued.", difficult: [{ en: "tastes", ur: "پسند" }, { en: "hobbies", ur: "مشغلے" }, { en: "option", ur: "انتخاب" }] },
  { day: 15, words: [{ ur: "تاکہ", en: "In order that" }, { ur: "ایسا نہ ہو کہ", en: "Lest" }, { ur: "تاکہ", en: "So that" }], paragraph: "She spoke loudly in order that everyone could hear. Walk slowly lest you fall. I saved money so that I could buy a book.", difficult: [{ en: "loudly", ur: "اونچی آواز میں" }, { en: "wet", ur: "گیلا" }, { en: "patience", ur: "صبر" }] },
  { day: 16, words: [{ ur: "ایسا کہ", en: "Such that" }, { ur: "لہذا", en: "Hence" }, { ur: "یوں", en: "Thus" }], paragraph: "The noise was loud such that no one could sleep. The shop was closed; hence, we returned home. He planned well; thus, the event succeeded.", difficult: [{ en: "disturbed", ur: "پریشان" }, { en: "choice", ur: "انتخاب" }, { en: "organized", ur: "منظم" }] },
  { day: 17, words: [{ ur: "سے", en: "Than" }, { ur: "جتنا...اتنا", en: "As...as" }, { ur: "اسی طرح", en: "Similarly" }], paragraph: "My bag is heavier than yours. She is as kind as her mother. He enjoys sports; similarly, his brother does too.", difficult: [{ en: "heavier", ur: "بھاری" }, { en: "kindness", ur: "مہربانی" }, { en: "active", ur: "متحرک" }] },
  { day: 18, words: [{ ur: "مزید برآں", en: "Furthermore" }, { ur: "اس کے علاوہ", en: "Additionally" }, { ur: "علاوہ ازیں", en: "Besides" }], paragraph: "The lesson was easy; furthermore, it was fun. She bought fruits; additionally, she bought milk. I don't want to go; besides, I am tired.", difficult: [{ en: "quickly", ur: "تیزی سے" }, { en: "basket", ur: "ٹوکری" }, { en: "tired", ur: "تھکا ہوا" }] },
  { day: 19, words: [{ ur: "تاہم", en: "However" }, { ur: "اس کے باوجود", en: "Nonetheless" }, { ur: "دوسری طرف", en: "On the other hand" }], paragraph: "The task was long; however, we finished it. He was nervous; nonetheless, he spoke well. I like summer; on the other hand, winter is calm.", difficult: [{ en: "teamwork", ur: "ٹیم ورک" }, { en: "nervous", ur: "گھبرایا ہوا" }, { en: "season", ur: "موسم" }] },
  { day: 20, words: [{ ur: "پھر", en: "Then" }, { ur: "اس کے بعد", en: "Afterward" }, { ur: "آخرکار", en: "Eventually" }], paragraph: "Finish your work, then you may play. We ate dinner. Afterward, we watched TV. The child kept trying. Eventually, he succeeded.", difficult: [{ en: "followed", ur: "مانا گیا" }, { en: "peacefully", ur: "سکون سے" }, { en: "patience", ur: "صبر" }] },
  { day: 21, words: [{ ur: "یقیناً", en: "Indeed" }, { ur: "حقیقت میں", en: "In fact" }, { ur: "یقیناً", en: "Certainly" }], paragraph: "The test was hard. Indeed, it challenged everyone. I thought he was weak. In fact, he was strong. You can certainly do better.", difficult: [{ en: "challenged", ur: "آزمایا" }, { en: "deceive", ur: "دھوکہ دینا" }, { en: "progress", ur: "ترقی" }] },
  { day: 22, words: [{ ur: "کے ساتھ ساتھ", en: "As well as" }, { ur: "اگرچہ", en: "Even if" }, { ur: "اگر", en: "In case" }], paragraph: "She sings as well as dances. I will try even if I fail. Take an umbrella in case it rains.", difficult: [{ en: "talent", ur: "صلاحیت" }, { en: "experience", ur: "تجربہ" }, { en: "prepared", ur: "تیار" }] },
  { day: 23, words: [{ ur: "جب تک", en: "So long as" }, { ur: "جیسے ہی", en: "As soon as" }, { ur: "جونہی...تو", en: "No sooner...than" }], paragraph: "You may stay so long as you follow rules. As soon as the rain stopped, children ran out. No sooner did he arrive than it started raining.", difficult: [{ en: "discipline", ur: "نظم و ضبط" }, { en: "laughter", ur: "ہنسی" }, { en: "strange", ur: "عجیب" }] },
  { day: 24, words: [{ ur: "کیونکہ", en: "Because" }, { ur: "حالانکہ", en: "Although" }, { ur: "اور", en: "And" }], paragraph: "I studied hard because I wanted to pass. Although it was difficult, I did not give up. I practiced daily and improved slowly." },
  { day: 25, words: [{ ur: "اگر", en: "If" }, { ur: "تاکہ", en: "So that" }, { ur: "تاہم", en: "However" }], paragraph: "If you read every day, your vocabulary will grow. Study well so that you feel confident. The test was tough; however, we all tried our best." },
  { day: 26, words: [{ ur: "لیکن", en: "But" }, { ur: "اس لیے", en: "So" }, { ur: "جب", en: "When" }], paragraph: "I wanted to play but I had homework. It was getting dark, so we went inside. When the bell rang, everyone stood up quietly." },
  { day: 27, words: [{ ur: "یا", en: "Or" }, { ur: "نہ...نہ", en: "Neither...nor" }, { ur: "کے بعد", en: "After" }], paragraph: "Would you like tea or juice? Neither Ali nor Sara was absent today. After the lesson ended, the teacher gave us a fun activity." },
  { day: 28, words: [{ ur: "چونکہ", en: "As" }, { ur: "لہذا", en: "Therefore" }, { ur: "جبکہ", en: "While" }], paragraph: "As the road was wet, we walked carefully. He studied well; therefore, he scored high marks. I was writing while my friend was drawing." },
  { day: 29, words: [{ ur: "دونوں...اور", en: "Both...and" }, { ur: "اگرچہ", en: "Even though" }, { ur: "مزید یہ کہ", en: "Moreover" }], paragraph: "Both the teacher and students enjoyed the trip. Even though it rained, we had fun. The park was beautiful; moreover, it was very peaceful." },
  { day: 30, words: [{ ur: "آخرکار", en: "Eventually" }, { ur: "حقیقت میں", en: "In fact" }, { ur: "پھر بھی", en: "Yet" }], paragraph: "He kept practicing. Eventually, he became the best player. In fact, everyone admired his dedication. The journey was long, yet he never complained." },
];

const PRONOUNS_DATA = [
  { day: 1, words: [{ ur: "میں", en: "I" }, { ur: "ہم", en: "We" }, { ur: "تم/آپ", en: "You" }], paragraph: "I am happy today because I finished my homework early and played a fun game outside. We are going to school together because we have an important test. You are my friend who always helps me in class." },
  { day: 2, words: [{ ur: "وہ (مذکر)", en: "He" }, { ur: "وہ (مؤنث)", en: "She" }, { ur: "یہ/وہ", en: "It" }], paragraph: "He is reading a storybook that he borrowed from the library and really enjoys every evening. She is cooking delicious food for her family because everyone is coming home early. It is raining outside, and the cool breeze is making the weather very pleasant." },
  { day: 3, words: [{ ur: "وہ لوگ", en: "They" }, { ur: "ہر کوئی", en: "Everyone" }, { ur: "کوئی شخص", en: "Someone" }], paragraph: "They are playing cricket in the park together because the weather is perfect for outdoor games. Everyone is ready for the trip, and they packed their bags carefully. Someone is knocking on the door loudly." },
  { day: 4, words: [{ ur: "کوئی بھی", en: "Anybody" }, { ur: "کوئی نہیں", en: "Nobody" }, { ur: "کوئی ایک", en: "Somebody" }], paragraph: "Anybody can join the drawing competition if they bring their art materials and follow the rules. Nobody knows the answer because the question was difficult. Somebody left their lunchbox in the classroom." },
  { day: 5, words: [{ ur: "کون، جو", en: "Who" }, { ur: "کیا", en: "What" }, { ur: "کون سا، جو", en: "Which" }], paragraph: "Who is coming with us to the museum trip tomorrow? What is making that strange noise outside the window? Which one is your bag because there are many bags on the table?" },
  { day: 6, words: [{ ur: "ہر ایک", en: "Each" }, { ur: "کوئی ایک (دو میں سے)", en: "Either" }, { ur: "کوئی بھی نہیں (دو میں سے)", en: "Neither" }], paragraph: "Each student received a colourful worksheet today which they must complete and submit by tomorrow. Either book will help you prepare for the test. Neither player won the match because bad weather forced everyone to stop." },
  { day: 7, words: [{ ur: "کوئی اور بھی", en: "Anybody else" }, { ur: "باقی سب", en: "Everyone else" }, { ur: "کچھ نہیں", en: "Nothing" }], paragraph: "Anybody else can join the group project if they are willing to work hard and share ideas. Everyone else is already seated in the hall, waiting patiently. Nothing is impossible if you work hard every day." },
  { day: 8, words: [{ ur: "سب", en: "All" }, { ur: "زیادہ تر", en: "Most" }, { ur: "چند", en: "Few" }], paragraph: "All are excited today because the teacher announced a surprise activity that everyone had been wanting. Most students completed their tasks on time. Few children stayed back after class to clean the board." },
  { day: 9, words: [{ ur: "کوئی ایک", en: "One" }, { ur: "زیادہ لوگ", en: "Many" }, { ur: "دیگر", en: "Others" }], paragraph: "One of the students raised his hand confidently because he knew the correct answer. Many people visited the park today since the weather was bright and sunny. Others left early because they had important work at home." },
  { day: 10, words: [{ ur: "دونوں", en: "Both" }, { ur: "کئی", en: "Several" }, { ur: "کچھ", en: "Some" }], paragraph: "Both brothers helped their mother prepare dinner and set the table for the whole family. Several children participated in the race and ran very fast. Some students enjoyed the science experiment because it involved colourful reactions." },
  { day: 11, words: [{ ur: "مجھے", en: "Me" }, { ur: "ہمیں", en: "Us" }, { ur: "آپ کو/تمہیں", en: "You (obj)" }], paragraph: "The teacher gave me extra time to complete my assignment because I was feeling unwell yesterday. Our coach encouraged us to practice daily so we can improve. I saw you at the library yesterday while you were reading." },
  { day: 12, words: [{ ur: "اسے (مذکر)", en: "Him" }, { ur: "اسے (مؤنث)", en: "Her" }, { ur: "اسے (چیز)", en: "It (obj)" }], paragraph: "The class selected him as the leader because he always speaks politely and helps everyone. We invited her to our group because she has creative ideas. Please place it on the shelf carefully so it does not fall." },
  { day: 13, words: [{ ur: "انہیں", en: "Them" }, { ur: "ہر کسی کو", en: "Everyone (obj)" }, { ur: "کسی کو", en: "Someone (obj)" }], paragraph: "I told them about the surprise quiz so they could prepare their lessons properly. The teacher instructed everyone to line up quietly. I heard someone calling my name loudly." },
  { day: 14, words: [{ ur: "کسی بھی کو", en: "Anybody (obj)" }, { ur: "کسی کو بھی نہیں", en: "Nobody (obj)" }, { ur: "کسی ایک کو", en: "Somebody (obj)" }], paragraph: "Do not trust anybody who spreads rumours because it can hurt people's feelings. I told nobody about the secret because I promised to keep it safe. I gave somebody my umbrella since it was raining heavily." },
  { day: 15, words: [{ ur: "جسکو، جسے", en: "Whom" }, { ur: "کیا (مفعول)", en: "What (obj)" }, { ur: "کون سا (مفعول)", en: "Which (obj)" }], paragraph: "Whom did you meet at the market when you went there to buy fresh fruits? I understand what you are trying to explain because your example made everything clear. Choose which you want to eat for lunch." },
  { day: 16, words: [{ ur: "ہر ایک کو", en: "Each (obj)" }, { ur: "کسی ایک کو", en: "Either (obj)" }, { ur: "کسی کو بھی نہیں", en: "Neither (obj)" }], paragraph: "I gave each child a small sticker as a reward for completing their work on time. Tell either of the helpers if you need anything. I chose neither of the bags because they were both too big." },
  { day: 17, words: [{ ur: "ہر کسی کو", en: "Everybody (obj)" }, { ur: "کسی اور کو", en: "Anybody else (obj)" }, { ur: "کچھ نہیں (مفعول)", en: "Nothing (obj)" }], paragraph: "The teacher thanked everybody for cooperating and helping make the class event successful. Did you call anybody else when you needed help? I want nothing from the shop today because I already bought everything I need." },
  { day: 18, words: [{ ur: "سب کو", en: "All (obj)" }, { ur: "زیادہ لوگوں کو", en: "Most (obj)" }, { ur: "چند کو", en: "Few (obj)" }], paragraph: "I invited all the children in the neighbourhood to join the fun weekend picnic. I helped most of my classmates understand the math problem using a simple method. I selected few participants for the competition because we had limited space." },
  { day: 19, words: [{ ur: "ایک کو", en: "One (obj)" }, { ur: "زیادہ لوگوں کو", en: "Many (obj)" }, { ur: "دوسروں کو", en: "Others (obj)" }], paragraph: "Please give one of those markers to me because mine has completely dried out. I taught many children how to fold paper boats that float beautifully on water. Tell others to come early tomorrow since we have an important activity planned." },
  { day: 20, words: [{ ur: "دونوں کو", en: "Both (obj)" }, { ur: "کئی لوگوں کو", en: "Several (obj)" }, { ur: "کچھ کو", en: "Some (obj)" }], paragraph: "I invited both cousins to my birthday party because they always make celebrations more fun. I told several classmates about the new schedule so they do not miss tomorrow's assembly. I gave some students extra notes to help them understand." },
  { day: 21, words: [{ ur: "میرا", en: "My" }, { ur: "ہمارا", en: "Our" }, { ur: "تمہارا/آپ کا", en: "Your (poss)" }], paragraph: "This is my bag which I decorated with stickers to make it colourful and unique. Our house is big and comfortable, and we always keep it clean. Your pencil case looks very neat because you arranged everything carefully inside it." },
  { day: 22, words: [{ ur: "اس کا (مذکر)", en: "His" }, { ur: "اس کی (مؤنث)", en: "Her (poss)" }, { ur: "اس کا (چیز)", en: "Its" }], paragraph: "This is his book which he reads every night because the story inspires him a lot. Her dress is very pretty because she chose bright colours that suit her perfectly. The cat licked its paw gently because it likes keeping itself clean." },
  { day: 23, words: [{ ur: "ان کا", en: "Their" }, { ur: "میرا (ملکیتی)", en: "Mine" }, { ur: "ہمارا (ملکیتی)", en: "Ours" }], paragraph: "Their car is new and shiny, and they drove it carefully on their first long trip. This pencil is mine because I bought it yesterday from the school stationery shop. The victory was ours because we worked hard as a team." },
  { day: 24, words: [{ ur: "تمہارا (ملکیتی)", en: "Yours" }, { ur: "اس کا (مؤنث ملکیتی)", en: "Hers" }, { ur: "اس کا (مذکر ملکیتی)", en: "His (poss)" }], paragraph: "This seat is yours because you reserved it before the class started this morning. The blue water bottle is hers, and she always keeps it filled throughout the day. The jacket is his, and he wears it every winter." },
  { day: 25, words: [{ ur: "ان کا (ملکیتی)", en: "Theirs" }, { ur: "کس کا", en: "Whose" }, { ur: "کسی کا", en: "One's" }], paragraph: "The house on the corner is theirs, and they have decorated it beautifully with lights. Whose pencil is this lying on the floor near the teacher's desk? It is one's duty to speak kindly to others." },
  { day: 26, words: [{ ur: "میرا اپنا", en: "My own" }, { ur: "تمہارا اپنا", en: "Your own" }, { ur: "ان کا اپنا", en: "Their own" }], paragraph: "This is my own work that I completed carefully without taking help from anyone. Do your own homework honestly so you can learn and become better every day. They created their own plan to finish the project before the deadline." },
  { day: 27, words: [{ ur: "ہمارا اپنا", en: "Our own" }, { ur: "اس کا اپنا (مذکر)", en: "His own" }, { ur: "اس کا اپنا (مؤنث)", en: "Her own" }], paragraph: "This is our own garden where we grow flowers that make the whole place smell wonderful. He has his own room which he keeps tidy and decorated with his favourite posters. She wrote her own story for the competition and added beautiful drawings." },
  { day: 28, words: [{ ur: "اس کا اپنا (چیز)", en: "Its own" }, { ur: "میرا (ملکیتی)", en: "Mine" }, { ur: "آپ کا (ملکیتی)", en: "Yours" }], paragraph: "The tree has its own charm because its leaves turn golden during the autumn season. That seat is mine because I kept my notebook there before class began. The idea was yours, and everyone appreciated how creative it was." },
  { day: 29, words: [{ ur: "اس کا (مؤنث ملکیتی)", en: "Hers" }, { ur: "ان کا (ملکیتی)", en: "Theirs" }, { ur: "ہمارا (ملکیتی)", en: "Ours" }], paragraph: "The scarf is hers, and she knitted it herself during the winter holidays. The project is theirs, and they worked together to make it the best in class. The mistake was ours, but we corrected it quickly and learned from the experience." },
  { day: 30, words: [{ ur: "کسی کا اپنا", en: "One's own" }, { ur: "کسی کا بھی", en: "Anybody's" }, { ur: "کسی کا نہیں", en: "Nobody's" }], paragraph: "One must follow one's own path in life and make choices that feel right and meaningful. This is not anybody's fault because the problem happened unexpectedly. The blame was nobody's since everyone did their work correctly." },
];

const COLLECTIVE_NOUNS_DATA = [
  { day: 1, words: [{ en: "Team", ur: "ٹیم" }, { en: "Herd", ur: "ریوڑ" }, { en: "Flock", ur: "غول" }], paragraph: "The team of players practiced hard on the field. A herd of cattle was grazing near the river. A flock of birds flew across the sky." },
  { day: 2, words: [{ en: "Pack", ur: "جھنڈ" }, { en: "Crowd", ur: "ہجوم" }, { en: "Group", ur: "گروہ" }], paragraph: "A pack of wolves roamed the forest at night. A crowd of people gathered in the market. A group of students studied together in the library." },
  { day: 3, words: [{ en: "Bundle", ur: "گٹھڑی" }, { en: "Class", ur: "جماعت" }, { en: "Army", ur: "فوج" }], paragraph: "A bundle of sticks lay near the house. The class of pupils listened carefully to the teacher. An army of soldiers marched along the road." },
  { day: 4, words: [{ en: "Swarm", ur: "جھرمٹ" }, { en: "Shoal", ur: "گروہ" }, { en: "Gang", ur: "گینگ" }], paragraph: "A swarm of bees buzzed around the flowers. A shoal of fish swam in the pond. A gang of thieves escaped through the streets." },
  { day: 5, words: [{ en: "Committee", ur: "کمیٹی" }, { en: "Choir", ur: "گروہ" }, { en: "Fleet", ur: "بیڑہ" }], paragraph: "The committee of members met to discuss the rules. A choir of singers performed beautifully on the stage. A fleet of ships sailed across the ocean." },
  { day: 6, words: [{ en: "Library", ur: "کتب خانہ" }, { en: "Range", ur: "قطار" }, { en: "Cluster", ur: "گچھا" }], paragraph: "The library of books was very large. A range of mountains was visible from the hilltop. A cluster of stars lit up the night sky." },
  { day: 7, words: [{ en: "Basket", ur: "ٹوکری" }, { en: "Pile", ur: "ڈھیر" }, { en: "Set", ur: "سیٹ" }], paragraph: "A basket of fruits was on the table. A pile of stones blocked the path. A set of tools was ready for repair work." },
  { day: 8, words: [{ en: "Staff", ur: "عملہ" }, { en: "Band", ur: "گروہ" }, { en: "Colony", ur: "آبادی" }], paragraph: "The staff of workers cleaned the office. A band of musicians played in the park. A colony of ants worked near the kitchen." },
  { day: 9, words: [{ en: "Nest", ur: "آشیانہ" }, { en: "Troop", ur: "جتھہ" }, { en: "Board", ur: "مجلس" }], paragraph: "A nest of eggs was hidden under the tree. A troop of monkeys jumped from branch to branch. The board of directors made an important decision." },
  { day: 10, words: [{ en: "Batch", ur: "گروپ" }, { en: "Deck", ur: "گڈی" }, { en: "Bunch", ur: "گچھا" }], paragraph: "A batch of cookies cooled on the rack. A deck of cards was spread on the table. A bunch of grapes hung from the vine." },
  { day: 11, words: [{ en: "Suit", ur: "جوڑا" }, { en: "Grove", ur: "جھنڈ" }, { en: "Heap", ur: "ڈھیر" }], paragraph: "A suit of clothes was neatly folded. A grove of trees provided shade. A heap of sand was ready for construction." },
  { day: 12, words: [{ en: "Galaxy", ur: "کہکشاں" }, { en: "String", ur: "ڈوری" }, { en: "Collection", ur: "مجموعہ" }], paragraph: "A galaxy of stars shone in the sky. A string of pearls lay in the box. A collection of stamps filled the album." },
  { day: 13, words: [{ en: "Host", ur: "مجمع" }, { en: "Huddle", ur: "گروہ" }, { en: "Orchard", ur: "باغ" }], paragraph: "A host of angels appeared in the story. A huddle of penguins stayed warm together. An orchard of fruit trees grew behind the farm." },
  { day: 14, words: [{ en: "Parliament", ur: "جھرمٹ" }, { en: "Bed", ur: "گچھا" }, { en: "Line", ur: "قطار" }], paragraph: "A parliament of owls sat in the trees at night. A bed of flowers bloomed in the garden. A line of cars waited at the signal." },
  { day: 15, words: [{ en: "Stack", ur: "ڈھیر" }, { en: "Crew", ur: "عملہ" }, { en: "Pod", ur: "جھنڈ" }], paragraph: "A stack of papers covered the desk. A crew of sailors worked on the ship. A pod of dolphins jumped in the sea." },
  { day: 16, words: [{ en: "Array", ur: "ترتیب" }, { en: "Bevy", ur: "غول" }, { en: "Batch", ur: "گروپ" }], paragraph: "An array of facts was written in the book. A bevy of girls played in the park. A batch of students completed the assignment together." },
  { day: 17, words: [{ en: "Troupe", ur: "گروہ" }, { en: "Convoy", ur: "قافلہ" }, { en: "Forest", ur: "جنگل" }], paragraph: "A troupe of dancers performed on the stage. A convoy of trucks moved along the highway. A forest of trees surrounded the village." },
  { day: 18, words: [{ en: "Pair", ur: "جوڑا" }, { en: "Stack", ur: "ڈھیر" }, { en: "Range", ur: "قطار" }], paragraph: "A pair of shoes was left near the door. A stack of chairs blocked the corner. A range of colors was painted on the wall." },
  { day: 19, words: [{ en: "Fleet", ur: "بیڑہ" }, { en: "Raffle", ur: "ٹولی" }, { en: "Cast", ur: "اداکاروں کا گروہ" }], paragraph: "A fleet of taxis waited at the station. A raffle of prizes was announced. A cast of actors acted in the play." },
  { day: 20, words: [{ en: "Circle", ur: "حلقہ" }, { en: "Pack", ur: "پیکٹ" }, { en: "Bundle", ur: "گٹھڑی" }], paragraph: "A circle of friends sat in the park. A pack of cards lay on the table. A bundle of clothes was ready for washing." },
  { day: 21, words: [{ en: "Suit", ur: "جوڑا" }, { en: "Panel", ur: "پینل" }, { en: "Band", ur: "گروہ" }], paragraph: "A suit of armour stood in the museum. A panel of judges evaluated the performance. A band of robbers ran away from the police." },
  { day: 22, words: [{ en: "Cluster", ur: "گچھا" }, { en: "Army", ur: "جھرمٹ" }, { en: "Flight", ur: "گروہ" }], paragraph: "A cluster of islands was seen from the boat. An army of ants carried food to the nest. A flight of steps led to the temple." },
  { day: 23, words: [{ en: "Pair", ur: "جوڑا" }, { en: "Column", ur: "قطار" }, { en: "Bunch", ur: "گچھا" }], paragraph: "A pair of birds sang on the branch. A column of smoke rose from the chimney. A bunch of keys lay on the table." },
  { day: 24, words: [{ en: "Suite", ur: "مجموعہ" }, { en: "Deck", ur: "ڈیک" }, { en: "Troop", ur: "جتھہ" }], paragraph: "A suite of rooms was decorated for guests. A deck of ships sailed together. A troop of dancers performed in the festival." },
  { day: 25, words: [{ en: "Series", ur: "سلسلہ" }, { en: "Cloud", ur: "بادل" }, { en: "Fleet", ur: "بیڑہ" }], paragraph: "A series of events happened in the town. A cloud of dust covered the road. A fleet of airplanes flew over the city." },
  { day: 26, words: [{ en: "Bunch", ur: "گچھا" }, { en: "Line", ur: "صف" }, { en: "Choir", ur: "گروہ" }], paragraph: "A bunch of bananas was on the market table. A line of soldiers stood at attention. A choir of angels sang in the story." },
  { day: 27, words: [{ en: "Crowd", ur: "ہجوم" }, { en: "Constellation", ur: "برج" }, { en: "Bundle", ur: "گٹھڑی" }], paragraph: "A crowd of fans cheered for the team. A constellation of stars was visible at night. A bundle of newspapers lay on the desk." },
  { day: 28, words: [{ en: "Gang", ur: "گروہ" }, { en: "Flock", ur: "غول" }, { en: "Batch", ur: "گروپ" }], paragraph: "A gang of laborers worked on the road. A flock of sheep grazed in the field. A batch of bread was fresh from the oven." },
  { day: 29, words: [{ en: "Array", ur: "صف" }, { en: "Pack", ur: "جھنڈ" }, { en: "Company", ur: "کمپنی" }], paragraph: "An array of lights decorated the hall. A pack of dogs ran through the street. A company of actors prepared for the show." },
  { day: 30, words: [{ en: "Group", ur: "گروپ" }, { en: "Team", ur: "ٹیم" }, { en: "Forest", ur: "جنگل" }], paragraph: "A group of islands appeared on the map. A team of doctors helped the patients. A forest of pines surrounded the village." },
];

const VERBS_DATA = [
  { day: 1, words: [{ en: "Go", ur: "جانا", v2: "went", v3: "gone" }, { en: "See", ur: "دیکھنا", v2: "saw", v3: "seen" }, { en: "Come", ur: "آنا", v2: "came", v3: "come" }], paragraph: "Every day I give food to the birds. Yesterday I gave them bread that was given by my sister. I go to the garden, and last evening I went there again. Many days have gone, but the birds still wait for me." },
  { day: 2, words: [{ en: "Eat", ur: "کھانا", v2: "ate", v3: "eaten" }, { en: "Drink", ur: "پینا", v2: "drank", v3: "drunk" }, { en: "Take", ur: "لینا", v2: "took", v3: "taken" }], paragraph: "I see a boy in the park. Yesterday I saw him playing, and I have seen him many times before. He comes to the park daily because he came with his father once and has come regularly since." },
  { day: 3, words: [{ en: "Write", ur: "لکھنا", v2: "wrote", v3: "written" }, { en: "Read", ur: "پڑھنا", v2: "read", v3: "read" }, { en: "Speak", ur: "بولنا", v2: "spoke", v3: "spoken" }], paragraph: "I write small notes every morning. Yesterday I wrote a long one, and today it is nicely written on my table. I speak softly to my friend, and yesterday I spoke kindly." },
  { day: 4, words: [{ en: "Give", ur: "دینا", v2: "gave", v3: "given" }, { en: "Get", ur: "پانا", v2: "got", v3: "gotten" }, { en: "Make", ur: "بنانا", v2: "made", v3: "made" }], paragraph: "I break old habits slowly. Yesterday I broke one more, and now many bad habits are broken. I choose a new routine because last week I chose a better path." },
  { day: 5, words: [{ en: "Do", ur: "کرنا", v2: "did", v3: "done" }, { en: "Have", ur: "رکھنا", v2: "had", v3: "had" }, { en: "Be", ur: "ہونا", v2: "was/were", v3: "been" }], paragraph: "Leaves fall from the tree every day. Yesterday many fell, and by morning all were fallen on the ground. Children draw pictures there; one boy drew a house." },
  { day: 6, words: [{ en: "Drive", ur: "چلانا", v2: "drove", v3: "driven" }, { en: "Ride", ur: "سواری کرنا", v2: "rode", v3: "ridden" }, { en: "Run", ur: "دوڑنا", v2: "ran", v3: "run" }], paragraph: "I often find peace in silence. Yesterday I found a quiet corner, and the same comfort is still found there today. I feel calm now, just like I felt yesterday." },
  { day: 7, words: [{ en: "Sing", ur: "گانا", v2: "sang", v3: "sung" }, { en: "Ring", ur: "بجنا", v2: "rang", v3: "rung" }, { en: "Swim", ur: "تیرنا", v2: "swam", v3: "swum" }], paragraph: "I meet my friend after school. Yesterday I met him again, and we have often met in the same place. I send him a message; last night I sent two." },
  { day: 8, words: [{ en: "Begin", ur: "شروع کرنا", v2: "began", v3: "begun" }, { en: "Choose", ur: "چننا", v2: "chose", v3: "chosen" }, { en: "Fly", ur: "اڑنا", v2: "flew", v3: "flown" }], paragraph: "I bring water for the plants. Yesterday I brought extra, and all bottles were brought back empty. Children catch butterflies, and one boy caught a colourful one." },
  { day: 9, words: [{ en: "Blow", ur: "پھونک مارنا", v2: "blew", v3: "blown" }, { en: "Grow", ur: "بڑھنا", v2: "grew", v3: "grown" }, { en: "Know", ur: "جاننا", v2: "knew", v3: "known" }], paragraph: "I teach my brother simple lessons. Yesterday I taught him maths, and those ideas are already taught to others. I think he learns fast." },
  { day: 10, words: [{ en: "Throw", ur: "پھینکنا", v2: "threw", v3: "thrown" }, { en: "Draw", ur: "بنانا", v2: "drew", v3: "drawn" }, { en: "Show", ur: "دکھانا", v2: "showed", v3: "shown" }], paragraph: "I hold my book tightly. Yesterday I held it during class, and it has been held carefully since. I hear birds singing; yesterday I heard louder sounds." },
  { day: 11, words: [{ en: "Build", ur: "تعمیر کرنا", v2: "built", v3: "built" }, { en: "Send", ur: "بھیجنا", v2: "sent", v3: "sent" }, { en: "Spend", ur: "خرچ کرنا", v2: "spent", v3: "spent" }], paragraph: "I run early every morning. Yesterday I ran faster, and many kilometres have been run this month. I stand near the gate; last evening I stood there long." },
  { day: 12, words: [{ en: "Lend", ur: "ادھار دینا", v2: "lent", v3: "lent" }, { en: "Bend", ur: "جھکنا", v2: "bent", v3: "bent" }, { en: "Learn", ur: "سیکھنا", v2: "learnt", v3: "learnt" }], paragraph: "I win small games with my sister. Yesterday I won, and many prizes have been won this week. I wear my jacket; yesterday I wore a red one." },
  { day: 13, words: [{ en: "Buy", ur: "خریدنا", v2: "bought", v3: "bought" }, { en: "Bring", ur: "لانا", v2: "brought", v3: "brought" }, { en: "Think", ur: "سوچنا", v2: "thought", v3: "thought" }], paragraph: "I become better at reading. Yesterday I became faster, and now a new level is reached. I bring my notebook; last night I brought two." },
  { day: 14, words: [{ en: "Catch", ur: "پکڑنا", v2: "caught", v3: "caught" }, { en: "Teach", ur: "پڑھانا", v2: "taught", v3: "taught" }, { en: "Fight", ur: "لڑنا", v2: "fought", v3: "fought" }], paragraph: "I cut paper for a craft. Yesterday I cut shapes, and today more designs are cut neatly. We feed the birds; yesterday we fed them." },
  { day: 15, words: [{ en: "Sleep", ur: "سونا", v2: "slept", v3: "slept" }, { en: "Keep", ur: "رکھنا", v2: "kept", v3: "kept" }, { en: "Weep", ur: "رونا", v2: "wept", v3: "wept" }], paragraph: "I hit the ball lightly. Yesterday I hit it harder, and many balls have been hit during the game. I keep score; last night I kept it accurate." },
  { day: 16, words: [{ en: "Meet", ur: "ملنا", v2: "met", v3: "met" }, { en: "Leave", ur: "چھوڑنا", v2: "left", v3: "left" }, { en: "Feel", ur: "محسوس کرنا", v2: "felt", v3: "felt" }], paragraph: "I read stories daily. Yesterday I read a long one, and many books are already read by me. The shop sells toys; yesterday it sold many." },
  { day: 17, words: [{ en: "Deal", ur: "معاملہ کرنا", v2: "dealt", v3: "dealt" }, { en: "Mean", ur: "مطلب ہونا", v2: "meant", v3: "meant" }, { en: "Dream", ur: "خواب دیکھنا", v2: "dreamt", v3: "dreamt" }], paragraph: "I sit on the bench every afternoon. Yesterday I sat under a tree, and many hours have been sat there this week. I speak politely; yesterday I spoke softly." },
  { day: 18, words: [{ en: "Stand", ur: "کھڑا ہونا", v2: "stood", v3: "stood" }, { en: "Understand", ur: "سمجھنا", v2: "understood", v3: "understood" }, { en: "Sit", ur: "بیٹھنا", v2: "sat", v3: "sat" }], paragraph: "I stand in line at school. Yesterday I stood quietly. Children swim in the pool; last year they swam daily. Teachers teach lessons; yesterday they taught math." },
  { day: 19, words: [{ en: "Hold", ur: "پکڑنا", v2: "held", v3: "held" }, { en: "Tell", ur: "بتانا", v2: "told", v3: "told" }, { en: "Sell", ur: "بیچنا", v2: "sold", v3: "sold" }], paragraph: "I tell my mother everything. Yesterday I told her good news. I think about my future; last night I thought deeply. I understand the work now." },
  { day: 20, words: [{ en: "Find", ur: "ڈھونڈنا", v2: "found", v3: "found" }, { en: "Bind", ur: "باندھنا", v2: "bound", v3: "bound" }, { en: "Ground", ur: "زمین پر اتارنا", v2: "grounded", v3: "grounded" }], paragraph: "I win small competitions. Yesterday I won, and many medals are won proudly. I write a story; last year I wrote many. Workers build new rooms." },
  { day: 21, words: [{ en: "Hear", ur: "سننا", v2: "heard", v3: "heard" }, { en: "Say", ur: "کہنا", v2: "said", v3: "said" }, { en: "Pay", ur: "ادا کرنا", v2: "paid", v3: "paid" }], paragraph: "I break a small stick while walking. Yesterday I broke another one. I bring water with me; yesterday I brought juice. Children catch the ball easily." },
  { day: 22, words: [{ en: "Lay", ur: "بچھانا", v2: "laid", v3: "laid" }, { en: "Lie", ur: "لیٹنا", v2: "lay", v3: "lain" }, { en: "Hide", ur: "چھپنا", v2: "hid", v3: "hidden" }], paragraph: "I choose a quiet place to read. Last week I chose another spot. I drive slowly on this road; yesterday I drove carefully. Leaves fall every day." },
  { day: 23, words: [{ en: "Bite", ur: "کاٹنا", v2: "bit", v3: "bitten" }, { en: "Steal", ur: "چوری کرنا", v2: "stole", v3: "stolen" }, { en: "Break", ur: "توڑنا", v2: "broke", v3: "broken" }], paragraph: "I often find good ideas in silence. Yesterday I found a great one. Birds fly over my house; yesterday they flew higher. Sometimes I forget my keys." },
  { day: 24, words: [{ en: "Fall", ur: "گرنا", v2: "fell", v3: "fallen" }, { en: "Forget", ur: "بھولنا", v2: "forgot", v3: "forgotten" }, { en: "Forgive", ur: "معاف کرنا", v2: "forgave", v3: "forgiven" }], paragraph: "I give time to my garden every morning. Yesterday I gave extra water. Trees grow tall here; last year they grew fast. I know this place well." },
  { day: 25, words: [{ en: "Freeze", ur: "جمنا", v2: "froze", v3: "frozen" }, { en: "Shake", ur: "ہلانا", v2: "shook", v3: "shaken" }, { en: "Wake", ur: "جاگنا", v2: "woke", v3: "woken" }], paragraph: "I leave home early each day. Yesterday I left even earlier. I make breakfast quickly; last night I made extra food. I meet my teacher at school." },
  { day: 26, words: [{ en: "Wear", ur: "پہننا", v2: "wore", v3: "worn" }, { en: "Tear", ur: "پھاڑنا", v2: "tore", v3: "torn" }, { en: "Swear", ur: "قسم کھانا", v2: "swore", v3: "sworn" }], paragraph: "I run around the field every morning. Yesterday I ran slower. I say kind words to my friend; last night I said sorry. I see clouds gathering." },
  { day: 27, words: [{ en: "Cost", ur: "قیمت ہونا", v2: "cost", v3: "cost" }, { en: "Cut", ur: "کاٹنا", v2: "cut", v3: "cut" }, { en: "Hit", ur: "مارنا", v2: "hit", v3: "hit" }], paragraph: "I send my homework online. Yesterday I sent it early. I sit near the window; yesterday I sat on the floor. I take my notebook everywhere." },
  { day: 28, words: [{ en: "Hurt", ur: "چوٹ دینا", v2: "hurt", v3: "hurt" }, { en: "Let", ur: "اجازت دینا", v2: "let", v3: "let" }, { en: "Put", ur: "رکھنا", v2: "put", v3: "put" }], paragraph: "I think about my plans daily. Yesterday I thought of a new idea. I throw the ball to my brother; last night I threw it higher. I write small poems." },
  { day: 29, words: [{ en: "Shut", ur: "بند کرنا", v2: "shut", v3: "shut" }, { en: "Set", ur: "مقرر کرنا", v2: "set", v3: "set" }, { en: "Bet", ur: "شرط لگانا", v2: "bet", v3: "bet" }], paragraph: "I wake up early every day. Yesterday I woke up later. I wear my school uniform; yesterday I wore a sweater. I win small prizes at school." },
  { day: 30, words: [{ en: "Light", ur: "جلانا", v2: "lit", v3: "lit" }, { en: "Stick", ur: "چپکانا", v2: "stuck", v3: "stuck" }, { en: "Strike", ur: "مارنا", v2: "struck", v3: "struck" }], paragraph: "I begin my work with a smile. Yesterday I began the task slowly. The wind blows softly today; yesterday it blew strongly. I bring books to class." },
];

const TENSES_DATA = {
  present: {
    simple: {
      name: "Present Simple / Indefinite", nameUr: "حال مطلق", formula: "Subject + V1 (s/es) + Object",
      items: [
        { title: "Morning Routine", para: "Ali wakes up early every morning. He goes for a walk in the park. Birds sing loudly and the air feels fresh. He drinks tea after the walk. Then he starts work. He loves this routine.", qs: ["What does Ali do in the morning?", "Where does he go?", "Does he like his routine?"] },
        { title: "School Day", para: "The school opens at 8 AM. Students wear uniforms. Teachers check homework daily. The bell rings on time. Lessons begin quickly. Everyone follows rules.", qs: ["When does school open?", "Who checks homework?", "Do students wear uniforms?"] },
        { title: "Father's Drive", para: "My father drives to work daily. Traffic moves slowly in the city. People honk a lot. He listens to the radio. He reaches office on time. He likes punctuality.", qs: ["How does he go to work?", "What does he listen to?", "Does he like being on time?"] },
        { title: "The Library", para: "The library opens at 9. Students borrow books. The librarian guides them. Silence remains there. Everyone respects rules. Reading improves knowledge.", qs: ["When does the library open?", "Who guides students?", "What improves knowledge?"] },
        { title: "My Sister Paints", para: "My sister paints beautifully. She uses bright colors. Her art expresses emotions. She practices daily. People admire her talent. She feels happy.", qs: ["What does she paint with?", "Who admires her?", "How does she feel?"] },
      ]
    },
    continuous: {
      name: "Present Continuous", nameUr: "حال جاری", formula: "Subject + is/am/are + V-ing + Object",
      items: [
        { title: "Kids Playing", para: "Right now, the kids are playing outside. The sun is shining. A cat is running behind a ball. Their mother is calling them for lunch. But they are not listening. They are enjoying the game.", qs: ["What are the kids doing?", "Who is calling them?", "Are they listening?"] },
        { title: "Baby Sleeping", para: "The baby is sleeping peacefully. The fan is moving slowly. Her mother is cooking dinner. Her father is watching TV silently. Nobody is making noise. The house is feeling calm.", qs: ["Who is sleeping?", "What is the mother doing?", "Is anyone making noise?"] },
        { title: "The Chef", para: "The chef is chopping vegetables. The soup is boiling. The aroma is spreading. Customers are waiting. The waiter is serving drinks. The restaurant is buzzing.", qs: ["What is the chef doing?", "Who is serving drinks?", "Are customers waiting?"] },
        { title: "Football Practice", para: "The team is practicing football. The coach is giving instructions. Fans are cheering. The goalkeeper is blocking shots. The striker is running fast. Everyone is sweating.", qs: ["What is the team doing?", "Who is blocking shots?", "Are fans cheering?"] },
        { title: "Baby Birds", para: "The baby birds are learning to fly. The mother is encouraging them. The nest is shaking. Leaves are falling. The sky is looking wide. It is an important moment.", qs: ["What are birds learning?", "Who is encouraging them?", "Is the nest stable?"] },
      ]
    },
    perfect: {
      name: "Present Perfect", nameUr: "حال مکمل", formula: "Subject + has/have + V3 + Object",
      items: [
        { title: "Homework Done", para: "She has finished her homework. She has cleaned her room too. Her brother has not woken up. Their mother has made breakfast. The school bus has arrived. She feels ready.", qs: ["What has she finished?", "Who has not woken up?", "Has the bus arrived?"] },
        { title: "New Skill", para: "I have learned a new skill. I have joined an online class. My friend has guided me. We have practiced together. I have improved. I feel confident.", qs: ["What have you learned?", "Who has guided you?", "Do you feel confident?"] },
        { title: "Tree Planting", para: "They have planted trees in school. The gardener has watered them. Students have promised to protect them. Birds have started coming. The area has turned green. It looks fresh.", qs: ["What have they planted?", "Who has watered them?", "Has the area turned green?"] },
        { title: "Saving Money", para: "He has saved money for a cycle. He has avoided extra spending. His friends have supported him. He has worked part-time. Now he has enough funds. He plans to buy it soon.", qs: ["What has he saved for?", "Who has supported him?", "Does he have enough money?"] },
        { title: "A Poem", para: "She has written a poem. She has expressed her feelings. The words have touched hearts. Her teacher has praised her. She has gained confidence. She wants to write more.", qs: ["What has she written?", "Who has praised her?", "What has she gained?"] },
      ]
    },
    perfectContinuous: {
      name: "Present Perfect Continuous", nameUr: "حال مکمل جاری", formula: "Subject + has/have been + V-ing + since/for",
      items: [
        { title: "Studying Hard", para: "Ahmed has been studying for three hours. He has been preparing for his exams. His mother has been bringing him tea. His sister has been helping him with notes. They have been working together since morning. He has been feeling more confident.", qs: ["How long has Ahmed been studying?", "Who has been helping him?", "How has he been feeling?"] },
        { title: "Rain All Day", para: "It has been raining since morning. The streets have been flooding slowly. People have been staying indoors. Children have been watching cartoons. The sky has been looking dark. Everyone has been waiting for the rain to stop.", qs: ["How long has it been raining?", "What have children been doing?", "What has the sky been looking like?"] },
        { title: "Garden Work", para: "The gardener has been planting flowers since sunrise. He has been watering the plants carefully. Butterflies have been flying around. The garden has been looking more beautiful. Neighbors have been admiring it. He has been working hard every day.", qs: ["What has the gardener been doing?", "How long has he been working?", "Who has been admiring the garden?"] },
        { title: "Learning English", para: "She has been learning English for two years. She has been reading storybooks daily. Her vocabulary has been improving. She has been writing short essays. Her teacher has been encouraging her. She has been feeling proud of her progress.", qs: ["How long has she been learning English?", "What has she been reading?", "How has her vocabulary been changing?"] },
        { title: "Building a House", para: "Workers have been building a house for six months. They have been working from early morning. The walls have been rising slowly. The owner has been visiting daily. Neighbors have been watching the progress. The house has been looking more complete each week.", qs: ["How long have workers been building?", "Who has been visiting daily?", "How has the house been looking?"] },
      ]
    }
  },
  past: {
    simple: {
      name: "Past Simple / Indefinite", nameUr: "ماضی مطلق", formula: "Subject + V2 + Object",
      items: [
        { title: "Grandmother's Visit", para: "Yesterday, Sara visited her grandmother. She carried fresh fruits in a basket. Her grandmother smiled happily. They talked for hours. Sara helped her in the kitchen. She returned at night.", qs: ["Who did Sara visit?", "What did she take with her?", "When did she return?"] },
        { title: "Lost Keys", para: "He lost his keys yesterday. He searched everywhere. His friend helped him. They found the keys under the sofa. He laughed with relief. He thanked his friend.", qs: ["What did he lose?", "Who helped him?", "Where did they find the keys?"] },
        { title: "Family Picnic", para: "The family planned a picnic. They packed food and games. They reached the park early. The kids played happily. Birds chirped around them. They enjoyed the day.", qs: ["What did they plan?", "What did kids do?", "Did they enjoy?"] },
        { title: "Broken Glass", para: "He broke the glass accidentally. He felt scared. His mother calmed him. They cleaned the floor. She forgave him. He learned to be careful.", qs: ["What did he break?", "Who calmed him?", "What did he learn?"] },
        { title: "Camping", para: "They camped near the river. They lit a fire. They cooked food. They sang songs. Stars glittered above. They slept under the sky.", qs: ["Where did they camp?", "What did they cook?", "Where did they sleep?"] },
      ]
    },
    continuous: {
      name: "Past Continuous", nameUr: "ماضی جاری", formula: "Subject + was/were + V-ing + Object",
      items: [
        { title: "Rainy Night", para: "It was raining heavily last night. The wind was blowing fast. People were closing their doors. The dog was barking loudly. I was reading a book near the window. It was a cozy evening.", qs: ["What was the weather like?", "What were people doing?", "What were you doing?"] },
        { title: "Trip to Murree", para: "They were traveling to Murree. The road was winding. Fog was covering the mountains. Kids were taking pictures. Parents were enjoying tea. It was an exciting trip.", qs: ["Where were they traveling?", "What was covering the mountains?", "Who was taking pictures?"] },
        { title: "Hall Decoration", para: "The students were decorating the hall. Balloons were hanging on walls. Music was playing. Teachers were helping. Volunteers were arranging chairs. Everyone was smiling.", qs: ["What were students doing?", "Who were helping?", "What was playing?"] },
        { title: "Grandmother's Story", para: "Grandmother was telling a story. Kids were listening carefully. The clock was ticking. The fire was crackling. The dog was resting. The moment was magical.", qs: ["Who was telling a story?", "Who were listening?", "Was the dog resting?"] },
        { title: "River Scene", para: "The river was flowing fast. The boat was moving slowly. The men were rowing. The waves were splashing. The sun was setting. The scene was peaceful.", qs: ["How was the river flowing?", "What were men doing?", "What was setting?"] },
      ]
    },
    perfect: {
      name: "Past Perfect", nameUr: "ماضی بعید", formula: "Subject + had + V3 + Object",
      items: [
        { title: "Movie Night", para: "Before the movie started, they had bought popcorn. They had found their seats. The lights had turned off. The audience had become silent. They had waited for ten minutes. Then the movie began.", qs: ["What had they bought?", "Had the lights turned off?", "How long had they waited?"] },
        { title: "Class Ready", para: "By the time the teacher came, the students had prepared. They had revised the lesson. The monitor had cleaned the board. Everyone had sat quietly. The class had settled. The teacher was impressed.", qs: ["What had students done?", "Who had cleaned the board?", "Had the class settled?"] },
        { title: "Storm Prep", para: "Before the storm came, people had stored food. They had closed windows. The children had returned home. Neighbors had warned each other. The town had prepared. Safety was the priority.", qs: ["What had people stored?", "Who had warned others?", "Had children returned home?"] },
        { title: "Match Day", para: "Before the match started, it had rained. The ground had become slippery. Workers had covered seats. Players had warmed up. The crowd had gathered. The game began smoothly.", qs: ["What had happened before the match?", "What had workers done?", "Had players warmed up?"] },
        { title: "Guest Party", para: "By the time guests arrived, the room had been decorated. The food had been served. Candles had been lit. Music had been set. Everything had been arranged. The party started perfectly.", qs: ["What had been decorated?", "Had food been served?", "Was music set before guests arrived?"] },
      ]
    },
    perfectContinuous: {
      name: "Past Perfect Continuous", nameUr: "ماضی بعید جاری", formula: "Subject + had been + V-ing + since/for",
      items: [
        { title: "Waiting for Bus", para: "They had been waiting for the bus for thirty minutes. The sun had been shining brightly. Children had been getting tired. Their mother had been fanning them. Finally the bus arrived. Everyone had been feeling relieved.", qs: ["How long had they been waiting?", "What had the sun been doing?", "Had children been getting tired?"] },
        { title: "Cooking All Day", para: "She had been cooking since morning for the guests. The kitchen had been smelling delicious. Her daughters had been helping her. They had been setting the table. The food had been getting ready slowly. Everyone had been working together.", qs: ["How long had she been cooking?", "Who had been helping her?", "What had they been setting?"] },
        { title: "Farmer's Work", para: "The farmer had been plowing the field since dawn. His sons had been carrying seeds. The oxen had been pulling the plow. Sweat had been dripping from their faces. They had been working without rest. By noon they had been feeling very tired.", qs: ["What had the farmer been doing?", "Who had been carrying seeds?", "How had they been feeling by noon?"] },
        { title: "Building Road", para: "Workers had been building the road for three months. Machines had been running day and night. Dust had been covering the area. People had been complaining about noise. The supervisor had been checking progress daily. The road had been getting smoother.", qs: ["How long had workers been building?", "What had been covering the area?", "Who had been checking progress?"] },
        { title: "Practicing Music", para: "He had been practicing the piano for two years before the concert. His teacher had been guiding him patiently. His fingers had been getting faster. His family had been encouraging him. He had been feeling nervous. But he had been improving every day.", qs: ["How long had he been practicing?", "Who had been guiding him?", "Had he been improving?"] },
      ]
    }
  },
  future: {
    simple: {
      name: "Future Simple / Indefinite", nameUr: "مستقبل مطلق", formula: "Subject + will/shall + V1 + Object",
      items: [
        { title: "Tomorrow's Plan", para: "I will wake up early tomorrow. I will go for a morning walk. I will drink fresh juice. I will study for two hours. My friend will come to visit me. We will play cricket in the evening.", qs: ["What will you do tomorrow morning?", "Who will visit?", "What will you play?"] },
        { title: "School Trip", para: "Our school will organize a trip next week. Students will visit the zoo. Teachers will guide everyone. We will see many animals. We will take pictures. It will be an exciting day.", qs: ["Where will students visit?", "Who will guide them?", "Will it be exciting?"] },
        { title: "New House", para: "My uncle will build a new house next year. He will choose a good location. Workers will start in spring. The house will have a big garden. The family will move in winter. Everyone will be happy.", qs: ["What will the uncle build?", "When will workers start?", "When will the family move?"] },
        { title: "Exam Preparation", para: "She will study hard for exams. She will revise all subjects. Her mother will help her. She will sleep early every night. She will eat healthy food. She will pass with good marks.", qs: ["What will she study for?", "Who will help her?", "Will she pass?"] },
        { title: "Rainy Season", para: "It will rain a lot next month. The rivers will rise. Farmers will plant new crops. Children will play in the puddles. The weather will feel cool. Everyone will enjoy the fresh air.", qs: ["What will happen next month?", "What will farmers do?", "How will the weather feel?"] },
      ]
    },
    continuous: {
      name: "Future Continuous", nameUr: "مستقبل جاری", formula: "Subject + will be + V-ing + Object",
      items: [
        { title: "This Time Tomorrow", para: "This time tomorrow, I will be sitting in the exam hall. My friends will be writing answers. The teacher will be watching us. Some students will be thinking hard. The clock will be ticking slowly. We will be trying our best.", qs: ["Where will you be sitting?", "What will friends be doing?", "Who will be watching?"] },
        { title: "Evening Party", para: "At 7 PM tonight, guests will be arriving. Mother will be serving snacks. Father will be greeting everyone. Children will be playing in the garden. Music will be playing softly. Everyone will be having a good time.", qs: ["What will guests be doing at 7 PM?", "Who will be serving snacks?", "Where will children be playing?"] },
        { title: "Train Journey", para: "By noon, we will be traveling on the train. The fields will be passing quickly. I will be looking out the window. My sister will be reading a book. Father will be sleeping. The journey will be feeling peaceful.", qs: ["What will you be doing by noon?", "What will your sister be doing?", "How will the journey be feeling?"] },
        { title: "School Function", para: "Next Friday, students will be performing on stage. Parents will be watching proudly. The principal will be giving a speech. Teachers will be managing the event. Cameras will be flashing. The hall will be echoing with claps.", qs: ["What will students be doing next Friday?", "Who will be giving a speech?", "What will be echoing in the hall?"] },
        { title: "Summer Holidays", para: "Next week, I will be visiting my village. I will be swimming in the river. My cousins will be playing with me. Grandmother will be cooking special food. We will be sitting under the trees. We will be enjoying every moment.", qs: ["Where will you be visiting?", "What will you be doing in the river?", "Who will be cooking special food?"] },
      ]
    },
    perfect: {
      name: "Future Perfect", nameUr: "مستقبل مکمل", formula: "Subject + will have + V3 + Object",
      items: [
        { title: "By Evening", para: "By evening, I will have finished my homework. Mother will have cooked dinner. Father will have returned from work. My sister will have cleaned her room. The sun will have set. We will have gathered for dinner.", qs: ["What will you have finished by evening?", "Who will have cooked dinner?", "Will the sun have set?"] },
        { title: "End of Year", para: "By December, she will have completed her course. She will have learned many new things. Her teacher will have given her a certificate. Her parents will have felt proud. She will have grown in confidence. She will have achieved her goal.", qs: ["What will she have completed by December?", "Who will have given her a certificate?", "What will she have achieved?"] },
        { title: "Before the Party", para: "Before the guests arrive, we will have decorated the room. We will have prepared all the food. The cake will have been placed on the table. The music will have been arranged. The chairs will have been set. Everything will have been ready.", qs: ["What will have been decorated?", "Will the cake have been placed?", "Will everything have been ready?"] },
        { title: "Marathon", para: "By next month, he will have trained for the marathon. He will have run many kilometres. His coach will have prepared him well. His stamina will have increased. His friends will have supported him. He will have become stronger.", qs: ["What will he have trained for?", "What will have increased?", "Who will have supported him?"] },
        { title: "School Project", para: "By Friday, the students will have submitted their projects. They will have researched their topics. They will have written detailed reports. The teacher will have reviewed them. Marks will have been given. Everyone will have done their best.", qs: ["What will students have submitted by Friday?", "Who will have reviewed them?", "Will marks have been given?"] },
      ]
    },
    perfectContinuous: {
      name: "Future Perfect Continuous", nameUr: "مستقبل مکمل جاری", formula: "Subject + will have been + V-ing + since/for",
      items: [
        { title: "Ten Years of Teaching", para: "By next year, my teacher will have been teaching for ten years. She will have been helping hundreds of students. She will have been working at the same school. Students will have been remembering her kindness. She will have been inspiring young minds. Her dedication will have been growing stronger.", qs: ["How long will the teacher have been teaching?", "What will she have been inspiring?", "Will her dedication have been growing?"] },
        { title: "Living Here", para: "By 2027, we will have been living in this city for five years. We will have been making new friends. The children will have been studying at the same school. Father will have been working at his office. We will have been enjoying the neighborhood. This place will have been feeling like home.", qs: ["How long will you have been living here?", "Where will children have been studying?", "How will this place have been feeling?"] },
        { title: "Learning Piano", para: "By the concert date, she will have been practicing piano for three years. Her fingers will have been getting stronger. She will have been performing at small events. Her confidence will have been building slowly. Her family will have been supporting her journey. She will have been improving every month.", qs: ["How long will she have been practicing?", "What will have been building slowly?", "Who will have been supporting her?"] },
        { title: "Building Bridge", para: "By next summer, workers will have been building the bridge for two years. Engineers will have been checking the design. Materials will have been arriving regularly. The river will have been flowing beneath. People will have been watching the progress. The bridge will have been getting closer to completion.", qs: ["How long will workers have been building?", "Who will have been checking the design?", "What will have been flowing beneath?"] },
        { title: "Growing Garden", para: "By spring, grandmother will have been growing her garden for forty years. Flowers will have been blooming every season. She will have been watering them daily. Birds will have been visiting the garden. The neighbors will have been admiring the colors. Her love for gardening will have been lasting a lifetime.", qs: ["How long will grandmother have been growing her garden?", "What will have been blooming?", "Who will have been admiring the colors?"] },
      ]
    }
  }
};

const VOCABULARY_DATA = [
  { day: 1, words: [{ en: "Brightly", ur: "چمکدار انداز میں", meaning: "In a bright, vivid way" }, { en: "Buzz (n)", ur: "بھنبھناہٹ", meaning: "A humming sound" }, { en: "Buzz (v)", ur: "بھنبھنانا", meaning: "To make a humming sound" }], paragraph: "The stars shone brightly in the night sky. A buzz of bees filled the garden. The whole market was buzzing with activity." },
  { day: 2, words: [{ en: "Chase (n)", ur: "تعاقب", meaning: "The act of pursuing" }, { en: "Chase (v)", ur: "پیچھے بھاگنا", meaning: "To run after someone" }, { en: "Chores", ur: "گھریلو کام", meaning: "Daily household tasks" }], paragraph: "The chase between the cat and mouse was exciting. The dog chased the ball across the park. After school, I help with chores at home." },
  { day: 3, words: [{ en: "Concerned", ur: "فکرمند", meaning: "Worried about something" }, { en: "Crowded", ur: "بھرا ہوا", meaning: "Full of people" }, { en: "Delighted", ur: "بہت خوش", meaning: "Very pleased and happy" }], paragraph: "Mother looked concerned when I came home late. The market was very crowded on Friday. She was delighted to receive the gift." },
  { day: 4, words: [{ en: "Firmly", ur: "مضبوطی سے", meaning: "In a strong, steady way" }, { en: "Harsh", ur: "سخت", meaning: "Severe or cruel" }, { en: "Huff and puff", ur: "ہانپنا", meaning: "To breathe heavily" }], paragraph: "He held the rope firmly with both hands. The winter wind was harsh and cold. After running up the hill, we were huffing and puffing." },
  { day: 5, words: [{ en: "Idle", ur: "فارغ، بے کام", meaning: "Not working or active" }, { en: "Load (n)", ur: "بوجھ", meaning: "Something heavy to carry" }, { en: "Load (v)", ur: "لادنا", meaning: "To put things onto" }], paragraph: "The idle boy sat doing nothing all day. The donkey carried a heavy load of wood. Workers loaded the truck with boxes." },
  { day: 6, words: [{ en: "Log (n)", ur: "لکڑی کا ٹکڑا", meaning: "A piece of wood" }, { en: "Log (v)", ur: "درج کرنا", meaning: "To record information" }, { en: "Nectar", ur: "رس، شہد", meaning: "Sweet juice from flowers" }], paragraph: "A thick log was burning in the fireplace. The teacher asked us to log our reading time. Bees collect nectar from flowers to make honey." },
  { day: 7, words: [{ en: "Observe", ur: "غور سے دیکھنا", meaning: "To watch carefully" }, { en: "Promptly", ur: "فوراً", meaning: "Quickly, without delay" }, { en: "Rushed", ur: "جلدی میں", meaning: "Done in a hurry" }], paragraph: "Scientists observe animals in the jungle. She promptly answered every question in class. He rushed to school because he was late." },
  { day: 8, words: [{ en: "Soak", ur: "بھگونا", meaning: "To make very wet" }, { en: "Sparkle (n)", ur: "چمک", meaning: "A bright shine" }, { en: "Sparkle (v)", ur: "چمکنا", meaning: "To shine brightly" }], paragraph: "The rain soaked our clothes completely. The sparkle of diamonds caught everyone's eye. Stars sparkle beautifully on clear nights." },
  { day: 9, words: [{ en: "Advance (n)", ur: "پیش قدمی", meaning: "Forward movement" }, { en: "Advance (v)", ur: "آگے بڑھنا", meaning: "To move forward" }, { en: "Apologize", ur: "معذرت کرنا", meaning: "To say sorry" }], paragraph: "Technology has made great advances in recent years. The soldiers advanced towards the fort. He apologized for breaking the glass." },
  { day: 10, words: [{ en: "Bullied", ur: "ستایا گیا", meaning: "Treated badly by someone" }, { en: "Cheer (n)", ur: "خوشی", meaning: "A shout of joy" }, { en: "Cheer (v)", ur: "حوصلہ بڑھانا", meaning: "To encourage someone" }], paragraph: "The small boy was bullied by older children. A loud cheer filled the stadium. Friends cheered him up when he felt sad." },
  { day: 11, words: [{ en: "Furious", ur: "شدید غصے میں", meaning: "Extremely angry" }, { en: "Grace (n)", ur: "نفاست", meaning: "Elegance and beauty" }, { en: "Grace (v)", ur: "سجاوٹ کرنا", meaning: "To decorate or adorn" }], paragraph: "Father was furious when the window broke. The dancer moved with grace across the stage. Beautiful flowers graced the dinner table." },
  { day: 12, words: [{ en: "Leaned", ur: "جھکا", meaning: "Tilted to one side" }, { en: "Marvel (n)", ur: "حیرت", meaning: "Something wonderful" }, { en: "Marvel (v)", ur: "حیران ہونا", meaning: "To feel amazed" }], paragraph: "The old tree leaned towards the river. The Taj Mahal is a marvel of architecture. We marveled at the beautiful sunset." },
  { day: 13, words: [{ en: "Radiant", ur: "چمکتا ہوا", meaning: "Shining brightly" }, { en: "Trivial", ur: "معمولی", meaning: "Unimportant, minor" }, { en: "Amazement", ur: "حیرانی", meaning: "Great surprise" }], paragraph: "Her radiant smile lit up the whole room. Do not waste time on trivial matters. He stared in amazement at the magic trick." },
  { day: 14, words: [{ en: "Boring", ur: "اکتا دینے والا", meaning: "Not interesting" }, { en: "Grabbed", ur: "پکڑ لیا", meaning: "Seized quickly" }, { en: "Kid (n)", ur: "بچہ", meaning: "A young child" }], paragraph: "The movie was so boring that I fell asleep. She grabbed her bag and ran to catch the bus. Every kid in the class loves story time." },
  { day: 15, words: [{ en: "Kid (v)", ur: "مذاق کرنا", meaning: "To joke with someone" }, { en: "Model (n)", ur: "نمونہ", meaning: "An example to follow" }, { en: "Model (v)", ur: "نمائش کرنا", meaning: "To display or show" }], paragraph: "He was only kidding when he said that. This painting is a model of fine art. She modeled the new school uniform for everyone." },
  { day: 16, words: [{ en: "Praise (n)", ur: "تعریف", meaning: "Words of approval" }, { en: "Praise (v)", ur: "تعریف کرنا", meaning: "To say good things" }, { en: "Tiniest", ur: "سب سے چھوٹا", meaning: "The very smallest" }], paragraph: "She received praise for her excellent work. Teachers always praise students who work hard. Even the tiniest ant carries food to its home." },
  { day: 17, words: [{ en: "Weary", ur: "تھکا ہوا", meaning: "Very tired" }, { en: "Witch", ur: "چڑیل", meaning: "A woman with magic" }, { en: "Wondered", ur: "سوچا", meaning: "Thought about something" }], paragraph: "The traveler was weary after the long journey. In the story, a witch lived in a dark forest. She wondered what surprise awaited her." },
  { day: 18, words: [{ en: "Arrested", ur: "گرفتار کیا", meaning: "Taken by police" }, { en: "Buried", ur: "دفن کیا", meaning: "Put underground" }, { en: "Escaped", ur: "بھاگ نکلا", meaning: "Got away from" }], paragraph: "The thief was arrested by the police. The treasure was buried under the old tree. The bird escaped from the cage and flew away." },
  { day: 19, words: [{ en: "Eventually", ur: "آخرکار", meaning: "Finally, in the end" }, { en: "Grief", ur: "غم", meaning: "Deep sadness" }, { en: "Mean (adj)", ur: "ظالم", meaning: "Cruel or unkind" }], paragraph: "He kept trying and eventually succeeded. Grief filled the family when the pet died. The mean boy refused to share his toys." },
  { day: 20, words: [{ en: "Miserly", ur: "کنجوس", meaning: "Unwilling to spend" }, { en: "Neighbour", ur: "پڑوسی", meaning: "Person living nearby" }, { en: "Recognized", ur: "پہچانا", meaning: "Identified someone" }], paragraph: "The miserly man never helped anyone. Our neighbour always greets us with a smile. She recognized her old friend in the crowd." },
  { day: 21, words: [{ en: "Yelled", ur: "چلایا", meaning: "Shouted loudly" }, { en: "Coincide", ur: "ایک ہی وقت پر ہونا", meaning: "To happen at same time" }, { en: "Community", ur: "برادری", meaning: "A group of people" }], paragraph: "He yelled to warn his friend about the car. The two holidays coincide this year. Our community works together to keep the street clean." },
  { day: 22, words: [{ en: "Dessert", ur: "میٹھا", meaning: "Sweet dish after meal" }, { en: "Exchange (n)", ur: "تبادلہ", meaning: "A trade or swap" }, { en: "Exchange (v)", ur: "بدلنا", meaning: "To swap one thing for another" }], paragraph: "We had ice cream for dessert after dinner. The exchange of gifts made everyone happy. Students exchanged books with each other." },
  { day: 23, words: [{ en: "Ignorance", ur: "لاعلمی", meaning: "Lack of knowledge" }, { en: "Justice", ur: "انصاف", meaning: "Fairness and right" }, { en: "Obedience", ur: "فرمانبرداری", meaning: "Following rules" }], paragraph: "Ignorance can lead to many mistakes. The judge delivered justice to the poor man. Children show obedience by listening to their parents." },
  { day: 24, words: [{ en: "Sacred", ur: "مقدس", meaning: "Holy and respected" }, { en: "Sacrifice (n)", ur: "قربانی", meaning: "Giving up something" }, { en: "Sacrifice (v)", ur: "قربان کرنا", meaning: "To give up for others" }], paragraph: "The mosque is a sacred place for Muslims. His sacrifice for the country is remembered. Parents sacrifice their comfort for their children." },
  { day: 25, words: [{ en: "Ties (n)", ur: "تعلقات", meaning: "Connections or bonds" }, { en: "Zeal", ur: "جوش", meaning: "Great enthusiasm" }, { en: "Beast", ur: "درندہ", meaning: "A large wild animal" }], paragraph: "Family ties keep us strong and united. She worked with great zeal on her project. The beast roared loudly in the jungle." },
  { day: 26, words: [{ en: "Crumb", ur: "ٹکڑا", meaning: "A tiny piece of bread" }, { en: "Fluff (n)", ur: "روئیں", meaning: "Soft fuzzy material" }, { en: "Fluff (v)", ur: "پھول دینا", meaning: "To make soft and puffy" }], paragraph: "The sparrow picked up a crumb from the ground. The pillow was full of soft white fluff. She fluffed the cushions before guests arrived." },
  { day: 27, words: [{ en: "Surf (n)", ur: "لہریں", meaning: "Sea waves" }, { en: "Surf (v)", ur: "لہروں پر چلنا", meaning: "To ride on waves" }, { en: "Thimble", ur: "انگوٹھے کی ٹوپی", meaning: "A small cap for sewing" }], paragraph: "The surf crashed against the rocks. People love to surf at the beach in summer. Grandmother always uses a thimble when sewing." },
  { day: 28, words: [{ en: "Graceful", ur: "بوقار", meaning: "Elegant and smooth" }, { en: "Striking", ur: "نمایاں", meaning: "Very noticeable" }, { en: "Thrill (n)", ur: "سنسنی", meaning: "A feeling of excitement" }], paragraph: "The swan moved in a graceful manner. Her striking dress caught everyone's attention. The thrill of winning the race was unforgettable." },
  { day: 29, words: [{ en: "Thrill (v)", ur: "سنسنی پیدا کرنا", meaning: "To excite someone" }, { en: "Poverty", ur: "غربت", meaning: "Being very poor" }, { en: "Ordinary", ur: "عام", meaning: "Normal, not special" }], paragraph: "The roller coaster ride thrilled the children. Poverty affects millions of people around the world. It was just an ordinary day at school." },
  { day: 30, words: [{ en: "Apologize", ur: "معافی مانگنا", meaning: "To say sorry" }, { en: "Admired", ur: "پسند کیا", meaning: "Respected or liked" }, { en: "Avail (v)", ur: "فائدہ اٹھانا", meaning: "To take advantage of" }], paragraph: "He apologized for arriving late to the meeting. Everyone admired her beautiful painting. Students should avail every opportunity to learn." },
  { day: 31, words: [{ en: "Bragging", ur: "شیخی بگھارنا", meaning: "Boasting about oneself" }, { en: "Disguise (n)", ur: "بھیس", meaning: "A mask or costume" }, { en: "Disguise (v)", ur: "چھپانا", meaning: "To hide true identity" }], paragraph: "Nobody likes a person who keeps bragging. The spy wore a disguise to hide his identity. She disguised herself as an old woman." },
  { day: 32, words: [{ en: "Envious", ur: "حسد کرنے والا", meaning: "Jealous of others" }, { en: "Evil (n)", ur: "برائی", meaning: "Wickedness" }, { en: "Evil (adj)", ur: "برا", meaning: "Morally bad" }], paragraph: "The envious boy was jealous of his friend's toy. Good always wins over evil in stories. The evil witch tried to trick the children." },
  { day: 33, words: [{ en: "Odd", ur: "عجیب", meaning: "Strange or unusual" }, { en: "Plumage", ur: "پر", meaning: "A bird's feathers" }, { en: "Recall (n)", ur: "یاد", meaning: "A memory" }], paragraph: "Something odd was happening in the forest. The peacock has the most beautiful plumage. I have no recall of that incident." },
  { day: 34, words: [{ en: "Recall (v)", ur: "یاد کرنا", meaning: "To remember" }, { en: "Remarks", ur: "تبصرے", meaning: "Comments or observations" }, { en: "Brink", ur: "کنارہ", meaning: "The very edge" }], paragraph: "Can you recall what happened yesterday? Her remarks about the project were helpful. The glass was on the brink of the table." },
  { day: 35, words: [{ en: "Crawl (n)", ur: "رینگنے کی حرکت", meaning: "Slow movement" }, { en: "Crawl (v)", ur: "رینگنا", meaning: "To move slowly on ground" }, { en: "Firelit", ur: "آگ سے روشن", meaning: "Lit by fire" }], paragraph: "Traffic slowed to a crawl during rush hour. The baby is learning to crawl across the floor. The firelit room felt warm and cozy." },
  { day: 36, words: [{ en: "None", ur: "کوئی نہیں", meaning: "Not any, zero" }, { en: "Prowl", ur: "چپکے پھرنا", meaning: "To move stealthily" }, { en: "Scout (n)", ur: "جاسوس", meaning: "Someone who watches" }], paragraph: "None of the students were absent today. The cat prowled silently through the garden. The scout reported enemy movements to the captain." },
  { day: 37, words: [{ en: "Scout (v)", ur: "تلاش کرنا", meaning: "To search for something" }, { en: "Solitude", ur: "تنہائی", meaning: "Being alone" }, { en: "Spy (n)", ur: "جاسوس", meaning: "A secret agent" }], paragraph: "He scouted the area for a good camping spot. She enjoys solitude while reading books. The spy delivered the secret message safely." },
  { day: 38, words: [{ en: "Spy (v)", ur: "جاسوسی کرنا", meaning: "To watch secretly" }, { en: "Astronaut", ur: "خلا باز", meaning: "A space traveler" }, { en: "Charcoal", ur: "کوئلہ", meaning: "Black carbon material" }], paragraph: "He spied on the birds from behind the bush. The astronaut floated inside the space station. We used charcoal to light the barbecue fire." },
  { day: 39, words: [{ en: "Giant (n)", ur: "دیو", meaning: "A very large being" }, { en: "Giant (adj)", ur: "بہت بڑا", meaning: "Extremely large" }, { en: "Glare (n)", ur: "تیز روشنی", meaning: "A strong bright light" }], paragraph: "In the story, a giant lived on top of a mountain. The giant wheel at the fair was exciting. The glare of the sun made it hard to see." },
  { day: 40, words: [{ en: "Glare (v)", ur: "گھورنا", meaning: "To stare angrily" }, { en: "Gravity", ur: "کشش ثقل", meaning: "Earth's pulling force" }, { en: "Limply", ur: "کمزوری سے", meaning: "Without strength" }], paragraph: "The teacher glared at the noisy students. Gravity keeps everything on the ground. The tired flowers hung limply in the heat." },
  { day: 41, words: [{ en: "Plain (adj)", ur: "سادہ", meaning: "Simple, not decorated" }, { en: "Powdery", ur: "سفوف جیسا", meaning: "Like fine dust" }, { en: "Sign (n)", ur: "نشان", meaning: "A symbol or mark" }], paragraph: "She wore a plain white dress to school. The powdery snow covered the mountains. The road sign showed the way to the village." },
  { day: 42, words: [{ en: "Sign (v)", ur: "دستخط کرنا", meaning: "To write one's name" }, { en: "Twinkling", ur: "ٹمٹماتا", meaning: "Shining with flickers" }, { en: "Wondered", ur: "سوچا", meaning: "Thought about deeply" }], paragraph: "Please sign this letter before sending it. The twinkling lights decorated the whole street. She wondered why the birds flew south in winter." },
  { day: 43, words: [{ en: "Apart", ur: "الگ", meaning: "Separated from each other" }, { en: "Cautiously", ur: "احتیاط سے", meaning: "Very carefully" }, { en: "Console (n)", ur: "کنٹرول پینل", meaning: "A control panel" }], paragraph: "The two friends live far apart now. She cautiously crossed the busy road. The pilot checked every button on the console." },
  { day: 44, words: [{ en: "Console (v)", ur: "تسلی دینا", meaning: "To comfort someone" }, { en: "Might (n)", ur: "طاقت", meaning: "Great power" }, { en: "Piece of cake", ur: "بہت آسان", meaning: "Something very easy" }], paragraph: "Her kind words consoled the crying child. The warrior fought with all his might. The test was a piece of cake for the clever student." },
  { day: 45, words: [{ en: "Smack (n)", ur: "تھپڑ", meaning: "A sharp hit" }, { en: "Smack (v)", ur: "زور سے مارنا", meaning: "To hit hard" }, { en: "Squeak (n)", ur: "چرچراہٹ", meaning: "A small high sound" }], paragraph: "The ball hit the wall with a loud smack. He smacked the table to get everyone's attention. The mouse made a tiny squeak and ran away." },
  { day: 46, words: [{ en: "Squeak (v)", ur: "چرچرانا", meaning: "To make a high sound" }, { en: "Steady", ur: "مستحکم", meaning: "Firm and stable" }, { en: "Dense", ur: "گھنا", meaning: "Thick and packed" }], paragraph: "The old door squeaked every time it opened. Keep your hand steady while drawing. The dense forest was full of tall trees." },
  { day: 47, words: [{ en: "Grief", ur: "غم", meaning: "Deep sadness or sorrow" }, { en: "Gurgling", ur: "بلبلاتی آواز", meaning: "A bubbling water sound" }, { en: "Moist", ur: "نم", meaning: "Slightly wet" }], paragraph: "Grief filled her heart when her friend moved away. The gurgling stream flowed through the valley. The cake was soft and moist inside." },
  { day: 48, words: [{ en: "Offence", ur: "بے عزتی", meaning: "An insult or wrong act" }, { en: "Pilgrimage", ur: "زیارت", meaning: "A holy journey" }, { en: "Rushed", ur: "جلدی کی", meaning: "Done in a hurry" }], paragraph: "He meant no offence by his words. Millions go on pilgrimage to Makkah every year. She rushed to finish her homework before dinner." },
  { day: 49, words: [{ en: "Wronged", ur: "ظلم کیا گیا", meaning: "Treated unfairly" }, { en: "Beneath", ur: "نیچے", meaning: "Under or below" }, { en: "Bough", ur: "شاخ", meaning: "A large tree branch" }], paragraph: "He felt wronged by the unfair decision. A treasure was hidden beneath the old house. The bird built its nest on a high bough." },
  { day: 50, words: [{ en: "Stand and stare", ur: "گھور کر دیکھنا", meaning: "To gaze in wonder" }, { en: "Wood (n)", ur: "لکڑی", meaning: "Timber from trees" }, { en: "Stare (v)", ur: "گھورنا", meaning: "To look for a long time" }], paragraph: "People stand and stare at the tall monument. The table was made of strong wood. It is not polite to stare at strangers." },
  { day: 51, words: [{ en: "Arena", ur: "میدان", meaning: "A place for games" }, { en: "Cheered", ur: "خوشی کا اظہار", meaning: "Shouted with joy" }, { en: "Growling", ur: "غرغراہٹ", meaning: "A deep angry sound" }], paragraph: "The arena was packed with excited fans. Everyone cheered when the team scored a goal. The growling dog scared the children away." },
  { day: 52, words: [{ en: "Mighty", ur: "طاقتور", meaning: "Very powerful" }, { en: "Pardon (n)", ur: "معافی", meaning: "Forgiveness" }, { en: "Pardon (v)", ur: "معاف کرنا", meaning: "To forgive someone" }], paragraph: "The mighty lion is called the king of the jungle. He begged for pardon after his mistake. Please pardon me for being late." },
  { day: 53, words: [{ en: "Patting", ur: "تھپتھپانا", meaning: "Tapping gently" }, { en: "Sentenced", ur: "سزا دی گئی", meaning: "Given punishment by court" }, { en: "Slave (n)", ur: "غلام", meaning: "A person owned by another" }], paragraph: "The child was patting the kitten softly. The criminal was sentenced to ten years. In old times, people kept slaves which was very cruel." },
  { day: 54, words: [{ en: "Slave (v)", ur: "غلام بنانا", meaning: "To force into slavery" }, { en: "Starved", ur: "بھوکا", meaning: "Extremely hungry" }, { en: "Choke (v)", ur: "دم گھٹنا", meaning: "To have trouble breathing" }], paragraph: "Powerful kings used to slave the weak people. The lost hikers were starved after two days. The thick smoke made everyone choke." },
  { day: 55, words: [{ en: "Down", ur: "نیچے", meaning: "In a lower position" }, { en: "Millionaire", ur: "کروڑ پتی", meaning: "A very wealthy person" }, { en: "Probably", ur: "ممکنہ طور پر", meaning: "Most likely" }, { en: "Weary", ur: "تھکا ہوا", meaning: "Very tired" }], paragraph: "The ball rolled down the hill quickly. The millionaire donated money to build a school. It will probably rain this afternoon. The weary travelers finally reached the village." },
];

const ADVERB_PHRASES_DATA = [
  { day: 1, words: [
    { en: "with confidence", ur: "اعتماد کے ساتھ", meaning: "She answered the question with confidence." },
    { en: "with ease", ur: "آسانی سے", meaning: "He passed the test with ease." },
    { en: "with difficulty", ur: "مشکل سے", meaning: "I found the house with difficulty." },
    { en: "with enthusiasm", ur: "جوش و خروش سے", meaning: "The children played with enthusiasm." },
    { en: "with care", ur: "احتیاط سے", meaning: "Please handle the glass with care." }
  ]},
  { day: 2, words: [
    { en: "with precision", ur: "درستگی سے", meaning: "The surgeon worked with precision." },
    { en: "with gusto", ur: "زوق و شوق سے", meaning: "He ate his dinner with gusto." },
    { en: "with hesitation", ur: "ہچکچاہٹ سے", meaning: "She agreed with hesitation." },
    { en: "with pride", ur: "فخر سے", meaning: "He showed me his medal with pride." },
    { en: "with reluctance", ur: "ناگواری سے", meaning: "He admitted his mistake with reluctance." }
  ]},
  { day: 3, words: [
    { en: "with a smile", ur: "مسکراہٹ کے ساتھ", meaning: "She welcomed us with a smile." },
    { en: "with determination", ur: "عزم کے ساتھ", meaning: "They fought with determination." },
    { en: "with a frown", ur: "ماتھے پر بل ڈال کر", meaning: "He read the letter with a frown." },
    { en: "in a hurry", ur: "جلدی میں", meaning: "She left in a hurry." },
    { en: "in a rush", ur: "جلدی میں", meaning: "Why are you always in a rush?" }
  ]},
  { day: 4, words: [
    { en: "in secret", ur: "خفیہ طور پر", meaning: "They met in secret." },
    { en: "in silence", ur: "خاموشی سے", meaning: "The class worked in silence." },
    { en: "in public", ur: "عوامی طور پر", meaning: "He rarely sings in public." },
    { en: "in private", ur: "نجی طور پر", meaning: "Can I talk to you in private?" },
    { en: "in anger", ur: "غصے میں", meaning: "He shouted in anger." }
  ]},
  { day: 5, words: [
    { en: "in jest", ur: "مذاق میں", meaning: "He only said it in jest." },
    { en: "in earnest", ur: "سنجیدگی سے", meaning: "The work began in earnest." },
    { en: "in detail", ur: "تفصیل سے", meaning: "Please explain it in detail." },
    { en: "in a panic", ur: "گھبراہٹ میں", meaning: "She ran in a panic." },
    { en: "in a daze", ur: "حیرت میں", meaning: "After the news, he walked around in a daze." }
  ]},
  { day: 6, words: [
    { en: "in a loud voice", ur: "اونچی آواز میں", meaning: "He called for help in a loud voice." },
    { en: "in a whisper", ur: "سرگوشی میں", meaning: "They spoke in a whisper." },
    { en: "in a friendly way", ur: "دوستانہ انداز میں", meaning: "He greeted me in a friendly way." },
    { en: "in a strange manner", ur: "عجیب انداز میں", meaning: "The man was behaving in a strange manner." },
    { en: "by accident", ur: "حادثاتی طور پر", meaning: "I broke the vase by accident." }
  ]},
  { day: 7, words: [
    { en: "by mistake", ur: "غلطی سے", meaning: "I took your bag by mistake." },
    { en: "by chance", ur: "اتفاق سے", meaning: "I met him by chance." },
    { en: "by design", ur: "جان بوجھ کر", meaning: "Was the delay by design or accident?" },
    { en: "by force", ur: "زبردستی", meaning: "They entered the house by force." },
    { en: "by hand", ur: "ہاتھ سے", meaning: "This sweater was made by hand." }
  ]},
  { day: 8, words: [
    { en: "by heart", ur: "ازبر", meaning: "I know all the lyrics by heart." },
    { en: "by luck", ur: "خوش قسمتی سے", meaning: "He passed by luck, not study." },
    { en: "by magic", ur: "جادو سے", meaning: "The rabbit appeared by magic." },
    { en: "like a professional", ur: "پیشہ ور کی طرح", meaning: "She handled the crisis like a professional." },
    { en: "like a child", ur: "بچے کی طرح", meaning: "He was crying like a child." }
  ]},
  { day: 9, words: [
    { en: "like a dream", ur: "خواب کی طرح", meaning: "The plan worked like a dream." },
    { en: "like magic", ur: "جادو کی طرح", meaning: "The pain disappeared like magic." },
    { en: "like clockwork", ur: "بہت باقاعدگی سے", meaning: "The train arrives like clockwork." },
    { en: "on purpose", ur: "جان بوجھ کر", meaning: "You did that on purpose!" },
    { en: "without hesitation", ur: "بلا تردد", meaning: "He agreed without hesitation." }
  ]},
  { day: 10, words: [
    { en: "in a nutshell", ur: "مختصراً", meaning: "That is the story, in a nutshell." },
    { en: "under pressure", ur: "دباؤ میں", meaning: "He works well under pressure." },
    { en: "at will", ur: "مرضی سے", meaning: "The birds come and go at will." },
    { en: "at full speed", ur: "پوری رفتار سے", meaning: "The car was going at full speed." },
    { en: "at a snail's pace", ur: "بہت آہستہ", meaning: "Traffic was moving at a snail's pace." }
  ]},
  { day: 11, words: [
    { en: "all of a sudden", ur: "اچانک", meaning: "All of a sudden, the lights went out." },
    { en: "out of spite", ur: "کینہ پروری سے", meaning: "She did not invite him out of spite." },
    { en: "free of charge", ur: "مفت", meaning: "Children eat here free of charge." },
    { en: "at home", ur: "گھر پر", meaning: "I stayed at home yesterday." },
    { en: "at the office", ur: "دفتر میں", meaning: "She is at the office right now." }
  ]},
  { day: 12, words: [
    { en: "in the city", ur: "شہر میں", meaning: "They live in the city." },
    { en: "in the garden", ur: "باغ میں", meaning: "The kids are playing in the garden." },
    { en: "on the table", ur: "میز پر", meaning: "Put the book on the table." },
    { en: "by the river", ur: "دریا کے کنارے", meaning: "We had a picnic by the river." },
    { en: "beside the road", ur: "سڑک کے کنارے", meaning: "They stopped beside the road." }
  ]},
  { day: 13, words: [
    { en: "under the bed", ur: "بستر کے نیچے", meaning: "The cat is hiding under the bed." },
    { en: "behind the curtain", ur: "پردے کے پیچھے", meaning: "Someone was hiding behind the curtain." },
    { en: "in front of the house", ur: "گھر کے سامنے", meaning: "A car stopped in front of the house." },
    { en: "among friends", ur: "دوستوں میں", meaning: "You are safe among friends." },
    { en: "near the coast", ur: "ساحل کے قریب", meaning: "The ship sank near the coast." }
  ]},
  { day: 14, words: [
    { en: "far from home", ur: "گھر سے دور", meaning: "He is studying far from home." },
    { en: "close to the station", ur: "اسٹیشن کے قریب", meaning: "The hotel is close to the station." },
    { en: "next to the window", ur: "کھڑکی کے پاس", meaning: "She sat next to the window." },
    { en: "inside the box", ur: "ڈبے کے اندر", meaning: "What is inside the box?" },
    { en: "outside the building", ur: "عمارت کے باہر", meaning: "Wait for me outside the building." }
  ]},
  { day: 15, words: [
    { en: "throughout the world", ur: "پوری دنیا میں", meaning: "This song is famous throughout the world." },
    { en: "across the street", ur: "سڑک کے پار", meaning: "He lives across the street." },
    { en: "around the corner", ur: "کونے کے آس پاس", meaning: "The shop is just around the corner." },
    { en: "beyond the hills", ur: "پہاڑیوں کے پرے", meaning: "The village lies beyond the hills." },
    { en: "down the road", ur: "سڑک پر آگے", meaning: "We walked down the road." }
  ]},
  { day: 16, words: [
    { en: "up the stairs", ur: "سیڑھیوں پر اوپر", meaning: "He ran up the stairs." },
    { en: "through the tunnel", ur: "سرنگ کے اندر سے", meaning: "The train passed through the tunnel." },
    { en: "towards the light", ur: "روشنی کی طرف", meaning: "The moth flew towards the light." },
    { en: "onto the roof", ur: "چھت پر", meaning: "The cat jumped onto the roof." },
    { en: "into the room", ur: "کمرے میں", meaning: "She came into the room." }
  ]},
  { day: 17, words: [
    { en: "out of the house", ur: "گھر سے باہر", meaning: "He went out of the house." },
    { en: "to the left", ur: "بائیں طرف", meaning: "Turn to the left at the corner." },
    { en: "to the right", ur: "دائیں طرف", meaning: "Look to the right before crossing." },
    { en: "straight ahead", ur: "سیدھا آگے", meaning: "Drive straight ahead for two miles." },
    { en: "from abroad", ur: "بیرون ملک سے", meaning: "She returned from abroad yesterday." }
  ]},
  { day: 18, words: [
    { en: "at noon", ur: "دوپہر میں", meaning: "Let us meet at noon." },
    { en: "at midnight", ur: "آدھی رات کو", meaning: "The train leaves at midnight." },
    { en: "at sunrise", ur: "سورج نکلتے وقت", meaning: "We woke up at sunrise." },
    { en: "at sunset", ur: "غروب آفتاب کے وقت", meaning: "The walkway closes at sunset." },
    { en: "at the moment", ur: "اس وقت", meaning: "At the moment, he is busy." }
  ]},
  { day: 19, words: [
    { en: "at the weekend", ur: "ہفتے کے آخر میں", meaning: "We go shopping at the weekend." },
    { en: "in the morning", ur: "صبح کے وقت", meaning: "I drink tea in the morning." },
    { en: "in the afternoon", ur: "دوپہر کے بعد", meaning: "The children nap in the afternoon." },
    { en: "in the evening", ur: "شام کے وقت", meaning: "We watch TV in the evening." },
    { en: "in the past", ur: "ماضی میں", meaning: "In the past, things were different." }
  ]},
  { day: 20, words: [
    { en: "in the future", ur: "مستقبل میں", meaning: "I want to be a doctor in the future." },
    { en: "during the week", ur: "ہفتے کے دوران", meaning: "I exercise during the week." },
    { en: "during the summer", ur: "گرمیوں کے دوران", meaning: "They travel during the summer." },
    { en: "during the meeting", ur: "میٹنگ کے دوران", meaning: "Please do not talk during the meeting." },
    { en: "a long time ago", ur: "بہت عرصہ پہلے", meaning: "A long time ago, there was a king." }
  ]},
  { day: 21, words: [
    { en: "once upon a time", ur: "ایک دفعہ کا ذکر ہے", meaning: "Once upon a time, there lived a princess." },
    { en: "the day before yesterday", ur: "پرسوں", meaning: "I met her the day before yesterday." },
    { en: "the other day", ur: "کچھ دن پہلے", meaning: "I saw him the other day." },
    { en: "just now", ur: "ابھی", meaning: "He left just now." },
    { en: "right now", ur: "اس وقت", meaning: "I am busy right now." }
  ]},
  { day: 22, words: [
    { en: "at once", ur: "فوراً", meaning: "Come here at once!" },
    { en: "in a minute", ur: "ایک منٹ میں", meaning: "I will be with you in a minute." },
    { en: "in a while", ur: "تھوڑی دیر میں", meaning: "We will eat in a while." },
    { en: "in no time", ur: "بہت جلدی", meaning: "He finished his homework in no time." },
    { en: "before long", ur: "جلد ہی", meaning: "Before long, it started to rain." }
  ]},
  { day: 23, words: [
    { en: "at any moment", ur: "کسی بھی لمحے", meaning: "The bus should arrive at any moment." },
    { en: "sooner or later", ur: "کبھی نہ کبھی", meaning: "Sooner or later, you will succeed." },
    { en: "later on", ur: "بعد میں", meaning: "I will tell you about it later on." },
    { en: "right away", ur: "فوراً", meaning: "I will call him right away." },
    { en: "straight away", ur: "فوراً", meaning: "She recognized me straight away." }
  ]},
  { day: 24, words: [
    { en: "as soon as possible", ur: "جتنی جلدی ہو سکے", meaning: "Please reply as soon as possible." },
    { en: "at the last minute", ur: "آخری لمحات میں", meaning: "He changed his mind at the last minute." },
    { en: "at the crack of dawn", ur: "علی الصبح", meaning: "They wake up at the crack of dawn." },
    { en: "for a while", ur: "تھوڑی دیر کے لیے", meaning: "Sit down for a while." },
    { en: "for a long time", ur: "ایک لمبے عرصے سے", meaning: "I have known him for a long time." }
  ]},
  { day: 25, words: [
    { en: "for the time being", ur: "فی الحال", meaning: "We can stay here for the time being." },
    { en: "since yesterday", ur: "کل سے", meaning: "I have not seen him since yesterday." },
    { en: "until tomorrow", ur: "کل تک", meaning: "The store is closed until tomorrow." },
    { en: "up to now", ur: "اب تک", meaning: "Up to now, everything is fine." },
    { en: "from dawn till dusk", ur: "صبح سے شام تک", meaning: "He works in the fields from dawn till dusk." }
  ]},
  { day: 26, words: [
    { en: "all day long", ur: "سارا دن", meaning: "It rained all day long." },
    { en: "throughout the year", ur: "سال بھر", meaning: "The museum is open throughout the year." },
    { en: "every day", ur: "ہر روز", meaning: "He goes for a walk every day." },
    { en: "every week", ur: "ہر ہفتے", meaning: "We have a meeting every week." },
    { en: "every month", ur: "ہر مہینے", meaning: "I get paid every month." }
  ]},
  { day: 27, words: [
    { en: "each morning", ur: "ہر صبح", meaning: "She jogs each morning." },
    { en: "each time", ur: "ہر بار", meaning: "Each time I see you, you look different." },
    { en: "once a week", ur: "ہفتے میں ایک بار", meaning: "We eat out once a week." },
    { en: "twice a month", ur: "مہینے میں دو بار", meaning: "I visit my parents twice a month." },
    { en: "three times a year", ur: "سال میں تین بار", meaning: "The company reports earnings three times a year." }
  ]},
  { day: 28, words: [
    { en: "on a daily basis", ur: "روزانہ کی بنیاد پر", meaning: "Exercise on a daily basis is healthy." },
    { en: "on occasion", ur: "کبھی کبھار", meaning: "He still plays golf on occasion." },
    { en: "from time to time", ur: "کبھی کبھی", meaning: "I like to go fishing from time to time." },
    { en: "now and then", ur: "کبھی کبھار", meaning: "We still chat now and then." },
    { en: "again and again", ur: "بار بار", meaning: "He made the same mistake again and again." }
  ]},
  { day: 29, words: [
    { en: "day after day", ur: "دن بہ دن", meaning: "She waited for news day after day." },
    { en: "most of the time", ur: "زیادہ تر وقت", meaning: "Most of the time, he is very quiet." },
    { en: "as a rule", ur: "عموماً", meaning: "As a rule, we do not accept returns." },
    { en: "more often than not", ur: "اکثر", meaning: "More often than not, she is late." },
    { en: "every so often", ur: "کبھی کبھار", meaning: "Every so often, a train goes by." }
  ]},
  { day: 30, words: [
    { en: "once in a while", ur: "کبھی کبھار", meaning: "It is good to treat yourself once in a while." },
    { en: "at times", ur: "کبھی کبھی", meaning: "At times, I wish I had a different job." },
    { en: "by far", ur: "سب سے زیادہ", meaning: "She is by far the best student." },
    { en: "at all", ur: "ذرا بھی", meaning: "I do not like spicy food at all." },
    { en: "in the least", ur: "ذرا بھی", meaning: "He was not surprised in the least." }
  ]},
  { day: 31, words: [
    { en: "to a great extent", ur: "بڑی حد تک", meaning: "Your success depends to a great extent on effort." },
    { en: "to a large degree", ur: "بڑی حد تک", meaning: "I agree with you to a large degree." },
    { en: "a great deal", ur: "بہت زیادہ", meaning: "He knows a great deal about cars." },
    { en: "very much", ur: "بہت زیادہ", meaning: "I enjoyed the concert very much." },
    { en: "so much", ur: "اتنا زیادہ", meaning: "I love you so much." }
  ]},
  { day: 32, words: [
    { en: "too much", ur: "بہت زیادہ", meaning: "You talk too much!" },
    { en: "far too", ur: "حد سے زیادہ", meaning: "It is far too cold to go outside." },
    { en: "quite a lot", ur: "کافی زیادہ", meaning: "He travels quite a lot for work." },
    { en: "as much as possible", ur: "جتنا ہو سکے", meaning: "Save money as much as possible." },
    { en: "a bit", ur: "تھوڑا سا", meaning: "Could you speak a bit louder?" }
  ]},
  { day: 33, words: [
    { en: "a little", ur: "تھوڑا سا", meaning: "I am a little tired today." },
    { en: "a little bit", ur: "تھوڑا سا", meaning: "This soup is a little bit salty." },
    { en: "just a bit", ur: "ذرا سا", meaning: "It is just a bit expensive for me." },
    { en: "to some extent", ur: "کسی حد تک", meaning: "I agree with you to some extent." },
    { en: "to a certain degree", ur: "ایک خاص حد تک", meaning: "The story is true to a certain degree." }
  ]},
  { day: 34, words: [
    { en: "kind of", ur: "تقریباً", meaning: "I am kind of busy right now." },
    { en: "sort of", ur: "کچھ کچھ", meaning: "That is sort of what I meant." },
    { en: "more or less", ur: "کم و بیش", meaning: "The work is more or less finished." },
    { en: "at least", ur: "کم از کم", meaning: "You should at least try." },
    { en: "at most", ur: "زیادہ سے زیادہ", meaning: "It will cost ten dollars at most." }
  ]},
  { day: 35, words: [
    { en: "in full", ur: "مکمل طور پر", meaning: "The debt was paid in full." },
    { en: "in part", ur: "جزوی طور پر", meaning: "The delay was caused in part by the weather." },
    { en: "for the most part", ur: "زیادہ تر", meaning: "For the most part, the movie was good." },
    { en: "up to a point", ur: "ایک حد تک", meaning: "I agree with you up to a point." },
    { en: "in addition", ur: "اس کے علاوہ", meaning: "He is smart. In addition, he is very kind." }
  ]},
  { day: 36, words: [
    { en: "first of all", ur: "سب سے پہلے", meaning: "First of all, let me introduce myself." },
    { en: "first and foremost", ur: "سب سے پہلے اور اہم", meaning: "First and foremost, we need to stay safe." },
    { en: "to begin with", ur: "شروع کرنے کے لیے", meaning: "To begin with, let us review last week's lesson." },
    { en: "last but not least", ur: "آخر میں لیکن اہمیت میں کم نہیں", meaning: "Last but not least, I want to thank my family." },
    { en: "above all", ur: "سب سے بڑھ کر", meaning: "He is brave, strong, and above all, honest." }
  ]},
  { day: 37, words: [
    { en: "what's more", ur: "مزید یہ کہ", meaning: "He is late, and what's more, he forgot his keys." },
    { en: "on top of that", ur: "اس کے علاوہ", meaning: "The car broke down. On top of that, it started to rain." },
    { en: "on the other hand", ur: "دوسری طرف", meaning: "He is rich, but on the other hand, he is not happy." },
    { en: "in contrast", ur: "اس کے برعکس", meaning: "The north is cold. In contrast, the south is warm." },
    { en: "on the contrary", ur: "اس کے برعکس", meaning: "It was not easy; on the contrary, it was very hard." }
  ]},
  { day: 38, words: [
    { en: "even so", ur: "پھر بھی", meaning: "It was raining; even so, we went out." },
    { en: "all the same", ur: "پھر بھی", meaning: "He has faults, but I like him all the same." },
    { en: "after all", ur: "آخر کار", meaning: "Do not be angry; he is just a child after all." },
    { en: "at the same time", ur: "ایک ہی وقت میں", meaning: "He is strict, but at the same time, fair." },
    { en: "despite that", ur: "اس کے باوجود", meaning: "It was expensive; despite that, we bought it." }
  ]},
  { day: 39, words: [
    { en: "in spite of that", ur: "اس کے باوجود", meaning: "He was tired; in spite of that, he finished the race." },
    { en: "as a result", ur: "نتیجتاً", meaning: "He did not study, and as a result, he failed." },
    { en: "as a consequence", ur: "نتیجے کے طور پر", meaning: "The factory closed; as a consequence, many lost jobs." },
    { en: "because of that", ur: "اس کی وجہ سے", meaning: "She was sick; because of that, she stayed home." },
    { en: "for that reason", ur: "اس وجہ سے", meaning: "He lied to me; for that reason, I do not trust him." }
  ]},
  { day: 40, words: [
    { en: "in that case", ur: "ایسی صورت میں", meaning: "You are hungry? In that case, let us eat now." },
    { en: "under the circumstances", ur: "ان حالات میں", meaning: "Under the circumstances, we did our best." },
    { en: "in fact", ur: "درحقیقت", meaning: "I thought it was hard; in fact, it was easy." },
    { en: "as a matter of fact", ur: "درحقیقت", meaning: "As a matter of fact, I know her brother." },
    { en: "in reality", ur: "حقیقت میں", meaning: "He seems calm, but in reality, he is nervous." }
  ]},
  { day: 41, words: [
    { en: "in truth", ur: "سچ میں", meaning: "In truth, I do not know the answer." },
    { en: "of course", ur: "یقیناً", meaning: "Of course, you can borrow my book." },
    { en: "for example", ur: "مثال کے طور پر", meaning: "Many animals, for example, dogs, are friendly." },
    { en: "for instance", ur: "مثال کے طور پر", meaning: "Take for instance the issue of pollution." },
    { en: "in other words", ur: "دوسرے الفاظ میں", meaning: "He is a bachelor; in other words, he is not married." }
  ]},
  { day: 42, words: [
    { en: "to put it simply", ur: "سادہ الفاظ میں", meaning: "To put it simply, we are out of money." },
    { en: "in general", ur: "عام طور پر", meaning: "In general, people here are friendly." },
    { en: "in particular", ur: "خاص طور پر", meaning: "I liked everything, in particular the music." },
    { en: "strictly speaking", ur: "سختی سے دیکھا جائے تو", meaning: "Strictly speaking, tomatoes are a fruit." },
    { en: "in the meantime", ur: "اس دوران", meaning: "The meeting is at 3. In the meantime, let us have lunch." }
  ]},
  { day: 43, words: [
    { en: "in the meanwhile", ur: "اس دوران", meaning: "In the meanwhile, I will clean the house." },
    { en: "at this point", ur: "اس موقع پر", meaning: "At this point, we cannot change the plan." },
    { en: "at this moment", ur: "اس وقت", meaning: "At this moment, he is in a meeting." },
    { en: "by the time", ur: "اس وقت تک", meaning: "By the time we arrived, the show had ended." },
    { en: "ever since", ur: "اس وقت سے", meaning: "He moved to London in 2020 and has lived there ever since." }
  ]},
  { day: 44, words: [
    { en: "specifically speaking", ur: "خاص طور پر بات کریں تو", meaning: "Specifically speaking, we need to cut costs by ten percent." },
    { en: "especially when", ur: "خاص طور پر جب", meaning: "I love ice cream, especially when it is hot." },
    { en: "purely by chance", ur: "بالکل اتفاق سے", meaning: "I met him purely by chance at the airport." },
    { en: "if nothing else", ur: "اگر کچھ نہیں تو", meaning: "If nothing else, it was a learning experience." },
    { en: "in terms of", ur: "کے لحاظ سے", meaning: "In terms of money, it was a bad deal." }
  ]},
  { day: 45, words: [
    { en: "as far as", ur: "جہاں تک", meaning: "As far as I know, he is honest." },
    { en: "how come", ur: "کیسے / کیوں", meaning: "How come you are late?" },
    { en: "sooner or later", ur: "کبھی نہ کبھی", meaning: "Sooner or later, the truth comes out." },
    { en: "on a weekly basis", ur: "ہفتہ وار بنیاد پر", meaning: "The rent is paid on a weekly basis." },
    { en: "as well as", ur: "اس کے ساتھ ساتھ", meaning: "She sings as well as dances." }
  ]},
];

const ENGLISH_OPPOSITES_DATA = [
  {
    "day": 1,
    "words": [
      {
        "en": "chase",
        "ur": "پیچھا کرنا",
        "opposite": "escape",
        "oppositeUr": "بچنا / فرار ہونا"
      },
      {
        "en": "concerned",
        "ur": "فکرمند",
        "opposite": "carefree",
        "oppositeUr": "بے فکر"
      },
      {
        "en": "crowded",
        "ur": "بھیڑ بھرا",
        "opposite": "empty",
        "oppositeUr": "خالی"
      }
    ],
    "paragraph": "I chased (پیچھا کیا) my little dog in the crowded (بھیڑ بھرا) park, but it managed to escape (بچ نکلا). I was concerned (فکرمند) but my friend felt carefree (بے فکر). Soon the park became empty (خالی)."
  },
  {
    "day": 2,
    "words": [
      {
        "en": "delighted",
        "ur": "خوش",
        "opposite": "sad",
        "oppositeUr": "اداس"
      },
      {
        "en": "firmly",
        "ur": "مضبوطی سے",
        "opposite": "loosely",
        "oppositeUr": "ڈھیلے طریقے سے"
      },
      {
        "en": "harsh",
        "ur": "سخت",
        "opposite": "gentle",
        "oppositeUr": "نرم"
      }
    ],
    "paragraph": "I was delighted (خوش) to see my friend and held his hand firmly (مضبوطی سے). The teacher was harsh (سخت) with the class but spoke in a gentle (نرم) way. The sad (اداس) faces slowly smiled."
  },
  {
    "day": 3,
    "words": [
      {
        "en": "idle",
        "ur": "سست",
        "opposite": "busy",
        "oppositeUr": "مصروف"
      },
      {
        "en": "observe",
        "ur": "مشاہدہ کرنا",
        "opposite": "ignore",
        "oppositeUr": "نظر انداز کرنا"
      },
      {
        "en": "promptly",
        "ur": "فوراً",
        "opposite": "slowly",
        "oppositeUr": "آہستہ"
      }
    ],
    "paragraph": "He was idle (سست) while I stayed busy (مصروف) all day. I tried to observe (مشاہدہ کرنا) him, but he ignored (نظر انداز کیا) me. I finished promptly (فوراً) while he worked slowly (آہستہ)."
  },
  {
    "day": 4,
    "words": [
      {
        "en": "sparkle",
        "ur": "چمکنا",
        "opposite": "dull",
        "oppositeUr": "بے رونق"
      },
      {
        "en": "affection",
        "ur": "محبت",
        "opposite": "hatred",
        "oppositeUr": "نفرت"
      },
      {
        "en": "brilliant",
        "ur": "ذہین",
        "opposite": "stupid",
        "oppositeUr": "بیوقوف"
      }
    ],
    "paragraph": "Stars sparkle (چمکتے ہیں) at night, but the sky looks dull (بے رونق) in fog. I feel affection (محبت) for my family, not hatred (نفرت). A brilliant (ذہین) child learns faster than a stupid (بیوقوف) one."
  },
  {
    "day": 5,
    "words": [
      {
        "en": "bullied",
        "ur": "ستایا گیا",
        "opposite": "encouraged",
        "oppositeUr": "حوصلہ دیا گیا"
      },
      {
        "en": "friendly",
        "ur": "دوستانہ",
        "opposite": "unfriendly",
        "oppositeUr": "غیر دوستانہ"
      },
      {
        "en": "grace",
        "ur": "نرمی",
        "opposite": "crude",
        "oppositeUr": "بدتمیز"
      }
    ],
    "paragraph": "The bullied (ستایا گیا) boy was encouraged (حوصلہ دیا گیا) by his teacher. His classmates were friendly (دوستانہ), not unfriendly (غیر دوستانہ). He showed grace (نرمی) and was not crude (بدتمیز)."
  },
  {
    "day": 6,
    "words": [
      {
        "en": "marvel",
        "ur": "حیرت کرنا",
        "opposite": "disregard",
        "oppositeUr": "نظر انداز کرنا"
      },
      {
        "en": "radiant",
        "ur": "چمکدار",
        "opposite": "dark",
        "oppositeUr": "تاریک"
      },
      {
        "en": "trivial",
        "ur": "معمولی",
        "opposite": "valuable",
        "oppositeUr": "قیمتی"
      }
    ],
    "paragraph": "I marvelled (حیران ہوا) at the radiant (چمکدار) sun, not the dark (تاریک) clouds. He did not disregard (نظر انداز کیا) small things. Even trivial (معمولی) moments can be valuable (قیمتی)."
  },
  {
    "day": 7,
    "words": [
      {
        "en": "closing",
        "ur": "بند ہونا",
        "opposite": "opening",
        "oppositeUr": "کھلنا"
      },
      {
        "en": "follow",
        "ur": "پیروی کرنا",
        "opposite": "lead",
        "oppositeUr": "رہنمائی کرنا"
      },
      {
        "en": "injustice",
        "ur": "ناانصافی",
        "opposite": "justice",
        "oppositeUr": "انصاف"
      }
    ],
    "paragraph": "The shop is closing (بند ہو رہی ہے) but another is opening (کھل رہی ہے). Good leaders lead (رہنمائی کرتے ہیں) and others follow (پیروی کرتے ہیں). There is no injustice (ناانصافی) where there is justice (انصاف)."
  },
  {
    "day": 8,
    "words": [
      {
        "en": "major",
        "ur": "اہم",
        "opposite": "minor",
        "oppositeUr": "چھوٹا"
      },
      {
        "en": "obedience",
        "ur": "فرمانبرداری",
        "opposite": "disobedience",
        "oppositeUr": "نافرمانی"
      },
      {
        "en": "sacred",
        "ur": "مقدس",
        "opposite": "cursed",
        "oppositeUr": "لعنت زدہ"
      }
    ],
    "paragraph": "This is a major (اہم) rule, not a minor (چھوٹا) one. Obedience (فرمانبرداری) brings peace but disobedience (نافرمانی) causes trouble. A sacred (مقدس) thing should never be cursed (لعنت زدہ)."
  },
  {
    "day": 9,
    "words": [
      {
        "en": "sunrise",
        "ur": "طلوع آفتاب",
        "opposite": "sunset",
        "oppositeUr": "غروب آفتاب"
      },
      {
        "en": "zeal",
        "ur": "جوش",
        "opposite": "indifference",
        "oppositeUr": "بے پروائی"
      },
      {
        "en": "escaped",
        "ur": "فرار ہو گیا",
        "opposite": "captured",
        "oppositeUr": "پکڑا گیا"
      }
    ],
    "paragraph": "We watched the sunrise (طلوع آفتاب) and later the sunset (غروب آفتاب). His zeal (جوش) was strong, not indifference (بے پروائی). The escaped (فرار ہوا) bird was finally captured (پکڑا گیا)."
  },
  {
    "day": 10,
    "words": [
      {
        "en": "eventually",
        "ur": "آخرکار",
        "opposite": "initially",
        "oppositeUr": "ابتدا میں"
      },
      {
        "en": "grief",
        "ur": "غم",
        "opposite": "joy",
        "oppositeUr": "خوشی"
      },
      {
        "en": "mean",
        "ur": "کنجوس",
        "opposite": "generous",
        "oppositeUr": "سخی"
      }
    ],
    "paragraph": "Initially (ابتدا میں) he felt nothing, but eventually (آخرکار) he felt grief (غم). Kind words brought joy (خوشی). A mean (کنجوس) person learns from a generous (سخی) one."
  },
  {
    "day": 11,
    "words": [
      {
        "en": "miserly",
        "ur": "کنجوس",
        "opposite": "extravagant",
        "oppositeUr": "فضول خرچ"
      },
      {
        "en": "picked",
        "ur": "چنا",
        "opposite": "threw",
        "oppositeUr": "پھینکا"
      },
      {
        "en": "recognised",
        "ur": "پہچانا",
        "opposite": "unidentified",
        "oppositeUr": "غیر شناخت شدہ"
      }
    ],
    "paragraph": "The miserly (کنجوس) man saved money, unlike the extravagant (فضول خرچ) one. I picked (چنا) a flower and threw (پھینکا) the waste away. She recognised (پہچانا) her friend in an unidentified (غیر شناخت شدہ) crowd."
  },
  {
    "day": 12,
    "words": [
      {
        "en": "yelled",
        "ur": "چیخا",
        "opposite": "whispered",
        "oppositeUr": "سرگوشی کی"
      },
      {
        "en": "addition",
        "ur": "جمع",
        "opposite": "subtraction",
        "oppositeUr": "تفریق"
      },
      {
        "en": "better",
        "ur": "بہتر",
        "opposite": "worse",
        "oppositeUr": "بدتر"
      }
    ],
    "paragraph": "He yelled (چیخا) loudly, but I whispered (سرگوشی کی). Addition (جمع) is easier than subtraction (تفریق). The better (بہتر) student tried harder than the worse (بدتر) one."
  },
  {
    "day": 13,
    "words": [
      {
        "en": "guide",
        "ur": "رہنمائی کرنا",
        "opposite": "misguide",
        "oppositeUr": "گمراہ کرنا"
      },
      {
        "en": "homework",
        "ur": "گھر کا کام",
        "opposite": "classwork",
        "oppositeUr": "کلاس کا کام"
      },
      {
        "en": "kid",
        "ur": "بچہ",
        "opposite": "adult",
        "oppositeUr": "بالغ"
      }
    ],
    "paragraph": "The guide (رہنما) helped us, but someone tried to misguide (گمراہ کرنا) us. Homework (گھر کا کام) felt harder than classwork (کلاس کا کام). The kid (بچہ) learned faster than the adult (بالغ)."
  },
  {
    "day": 14,
    "words": [
      {
        "en": "old-fashioned",
        "ur": "پرانے طرز کا",
        "opposite": "modern",
        "oppositeUr": "جدید"
      },
      {
        "en": "praise",
        "ur": "تعریف",
        "opposite": "blame",
        "oppositeUr": "الزام"
      },
      {
        "en": "rude",
        "ur": "بدتمیز",
        "opposite": "polite",
        "oppositeUr": "شائستہ"
      }
    ],
    "paragraph": "He likes old-fashioned (پرانے طرز کا) clothes, but she prefers modern (جدید) ones. I praise (تعریف کرتا ہوں) good work and never blame (الزام لگاتا ہوں). The rude (بدتمیز) boy later became polite (شائستہ)."
  },
  {
    "day": 15,
    "words": [
      {
        "en": "tiniest",
        "ur": "سب سے چھوٹا",
        "opposite": "biggest",
        "oppositeUr": "سب سے بڑا"
      },
      {
        "en": "weary",
        "ur": "تھکا ہوا",
        "opposite": "energetic",
        "oppositeUr": "توانا"
      },
      {
        "en": "beneath",
        "ur": "نیچے",
        "opposite": "above",
        "oppositeUr": "اوپر"
      }
    ],
    "paragraph": "The tiniest (سب سے چھوٹا) bird sat near the biggest (سب سے بڑا) tree. I felt weary (تھکا ہوا) but my friend stayed energetic (توانا). We rested beneath (نیچے) the tree while birds flew above (اوپر)."
  },
  {
    "day": 16,
    "words": [
      {
        "en": "crying",
        "ur": "رونا",
        "opposite": "laughing",
        "oppositeUr": "ہنسنا"
      },
      {
        "en": "day",
        "ur": "دن",
        "opposite": "night",
        "oppositeUr": "رات"
      },
      {
        "en": "down",
        "ur": "نیچے",
        "opposite": "up",
        "oppositeUr": "اوپر"
      }
    ],
    "paragraph": "The crying (روتا ہوا) baby soon started laughing (ہنسنا). The day (دن) slowly turned into night (رات). I looked down (نیچے دیکھا) and then climbed up (اوپر چڑھا)."
  },
  {
    "day": 17,
    "words": [
      {
        "en": "fright",
        "ur": "خوف",
        "opposite": "unafraid",
        "oppositeUr": "بے خوف"
      },
      {
        "en": "frightening",
        "ur": "خوفناک",
        "opposite": "pleasant",
        "oppositeUr": "خوشگوار"
      },
      {
        "en": "move",
        "ur": "حرکت کرنا",
        "opposite": "stand still",
        "oppositeUr": "ساکن رہنا"
      }
    ],
    "paragraph": "The fright (خوف) was strong but he was unafraid (بے خوف). The frightening (خوفناک) storm later became pleasant (خوشگوار). We moved forward while others stood still (ساکن رہے)."
  },
  {
    "day": 18,
    "words": [
      {
        "en": "tall",
        "ur": "لمبا",
        "opposite": "short",
        "oppositeUr": "چھوٹا"
      },
      {
        "en": "near",
        "ur": "قریب",
        "opposite": "far",
        "oppositeUr": "دور"
      },
      {
        "en": "poor",
        "ur": "غریب",
        "opposite": "rich",
        "oppositeUr": "امیر"
      }
    ],
    "paragraph": "The tall (لمبا) man helped the short (چھوٹا) child. The near (قریب) shop was better than the far (دور) one. The poor (غریب) family dreamed of becoming rich (امیر)."
  },
  {
    "day": 19,
    "words": [
      {
        "en": "sell",
        "ur": "بیچنا",
        "opposite": "buy",
        "oppositeUr": "خریدنا"
      },
      {
        "en": "mother",
        "ur": "ماں",
        "opposite": "father",
        "oppositeUr": "باپ"
      },
      {
        "en": "next",
        "ur": "اگلا",
        "opposite": "previous",
        "oppositeUr": "پچھلا"
      }
    ],
    "paragraph": "I decided to sell (بیچنا) old books and buy (خریدنا) new ones. My mother (ماں) advised me while my father (باپ) listened. The next (اگلا) child came after the previous (پچھلا) one."
  },
  {
    "day": 20,
    "words": [
      {
        "en": "trust",
        "ur": "بھروسا",
        "opposite": "distrust",
        "oppositeUr": "عدم اعتماد"
      },
      {
        "en": "avail",
        "ur": "فائدہ اٹھانا",
        "opposite": "conserve",
        "oppositeUr": "بچانا"
      },
      {
        "en": "blacker",
        "ur": "زیادہ کالا",
        "opposite": "whiter",
        "oppositeUr": "زیادہ سفید"
      }
    ],
    "paragraph": "I trust (بھروسا کرتا ہوں) my friend but distrust (اعتماد نہیں کرتا) strangers. We should avail (فائدہ اٹھانا) chances and conserve (بچانا) resources. The blacker (زیادہ کالا) clouds covered the whiter (زیادہ سفید) sky."
  },
  {
    "day": 21,
    "words": [
      {
        "en": "bragging",
        "ur": "شیخی مارنا",
        "opposite": "humble",
        "oppositeUr": "عاجز"
      },
      {
        "en": "different",
        "ur": "مختلف",
        "opposite": "same",
        "oppositeUr": "ایک جیسا"
      },
      {
        "en": "disguise",
        "ur": "بھیس بدلنا",
        "opposite": "reveal",
        "oppositeUr": "ظاہر کرنا"
      }
    ],
    "paragraph": "He kept bragging (شیخی مارتا رہا) but she stayed humble (عاجز رہی). People can be different (مختلف) yet some are the same (ایک جیسے). He tried to disguise (بھیس بدلنا) himself, but the truth was revealed (ظاہر ہو گیا)."
  },
  {
    "day": 22,
    "words": [
      {
        "en": "envious",
        "ur": "حسد کرنے والا",
        "opposite": "admiring",
        "oppositeUr": "تعریف کرنے والا"
      },
      {
        "en": "noticed",
        "ur": "محسوس کیا",
        "opposite": "ignored",
        "oppositeUr": "نظر انداز کیا"
      },
      {
        "en": "pleased",
        "ur": "خوش",
        "opposite": "displeased",
        "oppositeUr": "ناخوش"
      }
    ],
    "paragraph": "The envious (حسد کرنے والا) boy watched the admiring (تعریف کرنے والا) crowd. I noticed (محسوس کیا) the mistake, but others ignored (نظر انداز کیا) it. I felt pleased (خوش), not displeased (ناخوش)."
  },
  {
    "day": 23,
    "words": [
      {
        "en": "recall",
        "ur": "یاد کرنا",
        "opposite": "forget",
        "oppositeUr": "بھولنا"
      },
      {
        "en": "safe",
        "ur": "محفوظ",
        "opposite": "unsafe",
        "oppositeUr": "غیر محفوظ"
      },
      {
        "en": "hide",
        "ur": "چھپنا",
        "opposite": "show",
        "oppositeUr": "دکھانا"
      }
    ],
    "paragraph": "I recall (یاد کرتا ہوں) my childhood but sometimes forget (بھول جاتا ہوں) details. This place is safe (محفوظ), not unsafe (غیر محفوظ). He tried to hide (چھپنا) but we showed (دکھایا) him."
  },
  {
    "day": 24,
    "words": [
      {
        "en": "leisure",
        "ur": "فراغت",
        "opposite": "work",
        "oppositeUr": "کام"
      },
      {
        "en": "life",
        "ur": "زندگی",
        "opposite": "death",
        "oppositeUr": "موت"
      },
      {
        "en": "night",
        "ur": "رات",
        "opposite": "day",
        "oppositeUr": "دن"
      }
    ],
    "paragraph": "During leisure (فراغت) time, I rest, but work (کام) waits. Life (زندگی) is precious, unlike death (موت). Night (رات) always follows day (دن)."
  },
  {
    "day": 25,
    "words": [
      {
        "en": "closer",
        "ur": "زیادہ قریب",
        "opposite": "farther",
        "oppositeUr": "زیادہ دور"
      },
      {
        "en": "free",
        "ur": "آزاد",
        "opposite": "bound",
        "oppositeUr": "پابند"
      },
      {
        "en": "growling",
        "ur": "گرجنا",
        "opposite": "murmuring",
        "oppositeUr": "بڑبڑانا"
      }
    ],
    "paragraph": "My closer (زیادہ قریب) friend helped me, while the farther (زیادہ دور) one stayed away. I felt free (آزاد) inside though rules kept me bound (پابند). The dog was growling (گرجنا) while the cat was murmuring (بڑبڑانا)."
  },
  {
    "day": 26,
    "words": [
      {
        "en": "low",
        "ur": "نیچا",
        "opposite": "high",
        "oppositeUr": "اونچا"
      },
      {
        "en": "mighty",
        "ur": "طاقتور",
        "opposite": "weak",
        "oppositeUr": "کمزور"
      },
      {
        "en": "slave",
        "ur": "غلام",
        "opposite": "master",
        "oppositeUr": "آقا"
      }
    ],
    "paragraph": "The low (نیچی) hill stood before a high (اونچی) mountain. A mighty (طاقتور) ruler defeated the weak (کمزور) enemy. The slave (غلام) obeyed his master (آقا)."
  },
  {
    "day": 27,
    "words": [
      {
        "en": "dark",
        "ur": "اندھیرا",
        "opposite": "light",
        "oppositeUr": "روشن"
      },
      {
        "en": "far away",
        "ur": "بہت دور",
        "opposite": "near",
        "oppositeUr": "قریب"
      },
      {
        "en": "little",
        "ur": "تھوڑا",
        "opposite": "big",
        "oppositeUr": "بڑا"
      }
    ],
    "paragraph": "The room was dark (اندھیرا) but a light (روشن) came through the window. My house is not far away (بہت دور); it is near (قریب) the school. I had little (تھوڑا) food, but my brother had a big (بڑا) plate."
  },
  {
    "day": 28,
    "words": [
      {
        "en": "none",
        "ur": "کوئی نہیں",
        "opposite": "all",
        "oppositeUr": "سب"
      },
      {
        "en": "prowled",
        "ur": "آہستہ گھوما",
        "opposite": "brisk walk",
        "oppositeUr": "تیز چہل قدمی"
      },
      {
        "en": "solitude",
        "ur": "تنہائی",
        "opposite": "crowd",
        "oppositeUr": "ہجوم"
      }
    ],
    "paragraph": "There were none (کوئی نہیں) in the park at first, but soon all (سب) arrived. A cat prowled (آہستہ گھوما) while people took a brisk walk (تیز چہل قدمی). He enjoyed solitude (تنہائی) but the crowd (ہجوم) grew loud."
  },
  {
    "day": 29,
    "words": [
      {
        "en": "dropping down",
        "ur": "نیچے گرنا",
        "opposite": "rising up",
        "oppositeUr": "اوپر اٹھنا"
      },
      {
        "en": "fine",
        "ur": "باریک",
        "opposite": "coarse / rough",
        "oppositeUr": "کھردرا"
      },
      {
        "en": "giant",
        "ur": "بہت بڑا",
        "opposite": "tiny",
        "oppositeUr": "نہایت چھوٹا"
      }
    ],
    "paragraph": "Leaves were dropping down (نیچے گر رہے تھے) as the sun was rising up (اوپر اٹھ رہا تھا). This cloth feels fine (باریک), not coarse (کھردرا). A giant (بہت بڑا) tree stood near a tiny (نہایت چھوٹا) plant."
  },
  {
    "day": 30,
    "words": [
      {
        "en": "pure",
        "ur": "خالص",
        "opposite": "impure",
        "oppositeUr": "ناپاک"
      },
      {
        "en": "apart",
        "ur": "الگ",
        "opposite": "together",
        "oppositeUr": "اکٹھا"
      },
      {
        "en": "badly",
        "ur": "بری طرح",
        "opposite": "well",
        "oppositeUr": "اچھی طرح"
      }
    ],
    "paragraph": "Clean water is pure (خالص), not impure (ناپاک). We stayed apart (الگ) before working together (اکٹھا). He played badly (بری طرح) before learning to play well (اچھی طرح)."
  },
  {
    "day": 31,
    "words": [
      {
        "en": "Brave",
        "ur": "بہادر",
        "opposite": "Cowardly",
        "oppositeUr": "بزدل"
      },
      {
        "en": "Ancient",
        "ur": "قدیم",
        "opposite": "Modern",
        "oppositeUr": "جدید"
      },
      {
        "en": "Broad",
        "ur": "چوڑا",
        "opposite": "Narrow",
        "oppositeUr": "تنگ"
      }
    ]
  },
  {
    "day": 32,
    "words": [
      {
        "en": "Calm",
        "ur": "پرسکون",
        "opposite": "Noisy",
        "oppositeUr": "شور والا"
      },
      {
        "en": "Capture",
        "ur": "پکڑنا",
        "opposite": "Release",
        "oppositeUr": "چھوڑنا"
      },
      {
        "en": "Cheerful",
        "ur": "خوش مزاج",
        "opposite": "Gloomy",
        "oppositeUr": "اداس"
      }
    ]
  },
  {
    "day": 33,
    "words": [
      {
        "en": "Distant",
        "ur": "دور",
        "opposite": "Nearby",
        "oppositeUr": "قریب"
      },
      {
        "en": "Early",
        "ur": "جلد",
        "opposite": "Late",
        "oppositeUr": "دیر"
      },
      {
        "en": "Empty",
        "ur": "خالی",
        "opposite": "Full",
        "oppositeUr": "بھرا ہوا"
      }
    ]
  },
  {
    "day": 34,
    "words": [
      {
        "en": "Gentle",
        "ur": "نرم",
        "opposite": "Rough",
        "oppositeUr": "سخت"
      },
      {
        "en": "Huge",
        "ur": "بہت بڑا",
        "opposite": "Tiny",
        "oppositeUr": "بہت چھوٹا"
      },
      {
        "en": "Honest",
        "ur": "ایماندار",
        "opposite": "Dishonest",
        "oppositeUr": "بے ایمان"
      }
    ]
  },
  {
    "day": 35,
    "words": [
      {
        "en": "Import",
        "ur": "درآمد",
        "opposite": "Export",
        "oppositeUr": "برآمد"
      },
      {
        "en": "Kind",
        "ur": "مہربان",
        "opposite": "Cruel",
        "oppositeUr": "ظالم"
      },
      {
        "en": "Major",
        "ur": "اہم",
        "opposite": "Minor",
        "oppositeUr": "معمولی"
      }
    ]
  },
  {
    "day": 36,
    "words": [
      {
        "en": "Ordinary",
        "ur": "عام",
        "opposite": "Extraordinary",
        "oppositeUr": "غیر معمولی"
      },
      {
        "en": "Polite",
        "ur": "شائستہ",
        "opposite": "Rude",
        "oppositeUr": "بدتمیز"
      },
      {
        "en": "Rare",
        "ur": "نایاب",
        "opposite": "Common",
        "oppositeUr": "عام"
      }
    ]
  },
  {
    "day": 37,
    "words": [
      {
        "en": "Rigid",
        "ur": "سخت",
        "opposite": "Flexible",
        "oppositeUr": "لچکدار"
      },
      {
        "en": "Success",
        "ur": "کامیابی",
        "opposite": "Failure",
        "oppositeUr": "ناکامی"
      },
      {
        "en": "Timid",
        "ur": "ڈرپوک",
        "opposite": "Bold",
        "oppositeUr": "دلیر"
      }
    ]
  },
  {
    "day": 38,
    "words": [
      {
        "en": "Upward",
        "ur": "اوپر کی طرف",
        "opposite": "Downward",
        "oppositeUr": "نیچے کی طرف"
      },
      {
        "en": "Victory",
        "ur": "فتح",
        "opposite": "Defeat",
        "oppositeUr": "شکست"
      },
      {
        "en": "Visible",
        "ur": "نمایاں",
        "opposite": "Hidden",
        "oppositeUr": "چھپا ہوا"
      }
    ]
  },
  {
    "day": 39,
    "words": [
      {
        "en": "Wealthy",
        "ur": "مالدار",
        "opposite": "Poor",
        "oppositeUr": "غریب"
      },
      {
        "en": "Swift",
        "ur": "تیز",
        "opposite": "Slow",
        "oppositeUr": "سست"
      },
      {
        "en": "Wise",
        "ur": "عقل مند",
        "opposite": "Foolish",
        "oppositeUr": "احمق"
      }
    ]
  },
  {
    "day": 40,
    "words": [
      {
        "en": "Accept",
        "ur": "قبول کرنا",
        "opposite": "Reject",
        "oppositeUr": "رد کرنا"
      },
      {
        "en": "Increase",
        "ur": "بڑھانا",
        "opposite": "Decrease",
        "oppositeUr": "کم کرنا"
      },
      {
        "en": "Quiet",
        "ur": "خاموش",
        "opposite": "Loud",
        "oppositeUr": "اونچی آواز والا"
      }
    ]
  }
];

const ENGLISH_SENTENCE_DATA = [
  {
    "en": "Age doesn't matter.",
    "ur": "عمر سے کوئی فرق نہیں پڑتا۔"
  },
  {
    "en": "All four of us can comfortably sleep in the room.",
    "ur": "ہم چاروں کمرے میں آرام سے سو سکتے ہیں۔"
  },
  {
    "en": "Anyone can make a mistake.",
    "ur": "کوئی بھی غلطی کر سکتا ہے۔"
  },
  {
    "en": "Anything could happen.",
    "ur": "کچھ بھی ہو سکتا ہے۔"
  },
  {
    "en": "Are you all right?",
    "ur": "تم ٹھیک ہو؟"
  },
  {
    "en": "Are you angry with me?",
    "ur": "کیا آپ مجھ سے ناراض ہیں؟"
  },
  {
    "en": "Are you annoyed with me?",
    "ur": "کیا آپ مجھ سے ناراض ہیں؟"
  },
  {
    "en": "Are you going to attempt to pass the exam?",
    "ur": "کیا آپ امتحان پاس کرنے کی کوشش کرنے جا رہے ہیں؟"
  },
  {
    "en": "Are you kidding me?",
    "ur": "کیا تم مجھ سے مذاق کر رہے ہو؟"
  },
  {
    "en": "Are you married or unmarried?",
    "ur": "آپ شادی شدہ ہیں یا غیر شادی شدہ؟"
  },
  {
    "en": "Are you married?",
    "ur": "کیا آپ شادی شدہ ہیں؟"
  },
  {
    "en": "Are you out of your mind?",
    "ur": "کیا آپ اپنے دماغ سے باہر ہیں؟"
  },
  {
    "en": "Are you sure that he has gone through here.",
    "ur": "کیا آپ کو یقین ہے کہ وہ یہاں سے گزرا ہے۔"
  },
  {
    "en": "Aren't you ready yet?",
    "ur": "کیا تم ابھی تک تیار نہیں ہوئے؟"
  },
  {
    "en": "As a matter of fact, he is married.",
    "ur": "حقیقت میں، وہ شادی شدہ ہے۔"
  },
  {
    "en": "As of now, it will not happen.",
    "ur": "ابھی تک، ایسا نہیں ہوگا۔"
  },
  {
    "en": "At least you could tell me.",
    "ur": "کم از کم آپ مجھے بتا سکتے تھے۔"
  },
  {
    "en": "At the most he will go from there.",
    "ur": "زیادہ سے زیادہ وہ وہاں سے جائے گا۔"
  },
  {
    "en": "At the most it will take 5 minutes.",
    "ur": "زیادہ سے زیادہ اس میں 5 منٹ لگیں گے۔"
  },
  {
    "en": "But you didn't reply.",
    "ur": "لیکن آپ نے جواب نہیں دیا۔"
  },
  {
    "en": "By God's grace!",
    "ur": "خدا کے فضل سے!"
  },
  {
    "en": "By the grace of God.",
    "ur": "خدا کے فضل سے۔"
  },
  {
    "en": "Can I ask you something?",
    "ur": "کیا میں آپ سے کچھ پوچھ سکتا ہوں؟"
  },
  {
    "en": "Can I get some sugar?",
    "ur": "کیا میں کچھ چینی لے سکتا ہوں؟"
  },
  {
    "en": "Can I get your mobile number?",
    "ur": "کیا میں آپ کا موبائل نمبر حاصل کر سکتا ہوں؟"
  },
  {
    "en": "Can only fork a platform zone",
    "ur": "صرف پلیٹ فارم زون کو فورک کر سکتے ہیں۔"
  },
  {
    "en": "Can only run in platform zones",
    "ur": "صرف پلیٹ فارم زون میں چل سکتا ہے۔"
  },
  {
    "en": "Can you come some other time?",
    "ur": "کیا آپ کسی اور وقت آ سکتے ہیں؟"
  },
  {
    "en": "Can you fix it?",
    "ur": "کیا آپ اسے ٹھیک کر سکتے ہیں؟"
  },
  {
    "en": "Can you hear me?",
    "ur": "کیا آپ مجھے سن سکتے ہیں؟"
  },
  {
    "en": "Can you see me day after tomorrow?",
    "ur": "کیا آپ مجھے پرسوں مل سکتے ہیں؟"
  },
  {
    "en": "Can you speak English?",
    "ur": "کیا آپ انگریزی بول سکتے ہیں؟"
  },
  {
    "en": "Can you wait a few minutes?",
    "ur": "کیا آپ چند منٹ انتظار کر سکتے ہیں؟"
  },
  {
    "en": "Cloud is thundering.",
    "ur": "بادل گرج رہا ہے۔"
  },
  {
    "en": "Comb your hair.",
    "ur": "اپنے بالوں میں کنگھی کریں۔"
  },
  {
    "en": "Come to the point.",
    "ur": "بات پر آؤ۔"
  },
  {
    "en": "Despite my refusal, why are you going there?",
    "ur": "میرے انکار کے باوجود تم وہاں کیوں جا رہے ہو؟"
  },
  {
    "en": "Despite my refusal, you did this.",
    "ur": "میرے انکار کے باوجود تم نے یہ کام کیا۔"
  },
  {
    "en": "Dict doesn't have correct number of child signatures",
    "ur": "Dict میں بچوں کے دستخطوں کی صحیح تعداد نہیں ہے۔"
  },
  {
    "en": "Dict key type must be a single complete type",
    "ur": "Dict کلید کی قسم ایک مکمل قسم ہونی چاہیے۔"
  },
  {
    "en": "Dict missing closing brace",
    "ur": "Dict غائب بند تسمہ۔"
  },
  {
    "en": "Dict value type must be a single complete type",
    "ur": "Dict قدر کی قسم ایک واحد مکمل قسم ہونی چاہیے۔"
  },
  {
    "en": "Did the phone get disconnected?",
    "ur": "کیا فون منقطع ہو گیا؟"
  },
  {
    "en": "Did you do what I told you to do?",
    "ur": "کیا تم نے وہی کیا جو میں نے تمہیں کرنے کو کہا تھا؟"
  },
  {
    "en": "Did you feel bad?",
    "ur": "کیا آپ کو برا لگا؟"
  },
  {
    "en": "Did you get hurt?",
    "ur": "کیا آپ کو چوٹ لگی؟"
  },
  {
    "en": "Did you take my permission?",
    "ur": "کیا آپ نے میری اجازت لی؟"
  },
  {
    "en": "Did you understand?",
    "ur": "کیا آپ سمجھ گئے؟"
  },
  {
    "en": "Do I say one thing I was not feeling good there.",
    "ur": "کیا میں ایک بات کہوں مجھے وہاں اچھا نہیں لگ رہا تھا۔"
  },
  {
    "en": "Do I say one thing?",
    "ur": "ایک بات کہوں؟"
  },
  {
    "en": "Do whatever you want to do.",
    "ur": "تم جو کرنا چاہتے ہو کرو۔"
  },
  {
    "en": "Do you all agree with my ideas?",
    "ur": "کیا آپ سب میرے خیالات سے متفق ہیں؟"
  },
  {
    "en": "Do you have a mobile?",
    "ur": "کیا آپ کے پاس موبائل ہے؟"
  },
  {
    "en": "Do you have a pen?",
    "ur": "کیا آپ کے پاس قلم ہے؟"
  },
  {
    "en": "Do you know how to cook?",
    "ur": "کیا آپ کھانا پکانا جانتے ہیں؟"
  },
  {
    "en": "Do you know who I am?",
    "ur": "کیا تم جانتے ہو کہ میں کون ہوں؟"
  },
  {
    "en": "Do you like me?",
    "ur": "کیا تم مجھے پسند کرتے ہو؟"
  },
  {
    "en": "Do you need something?",
    "ur": "کیا آپ کو کچھ چاہیے؟"
  },
  {
    "en": "Do you recognize him?",
    "ur": "کیا تم اسے پہچانتے ہو؟"
  },
  {
    "en": "Do you understand?",
    "ur": "کیا تم سمجھتے ہو؟"
  },
  {
    "en": "Do you want anything else?",
    "ur": "کیا آپ کچھ اور چاہتے ہیں؟"
  },
  {
    "en": "Do you want to say something?",
    "ur": "کیا آپ کچھ کہنا چاہتے ہیں؟"
  },
  {
    "en": "Does it make any difference?",
    "ur": "کیا اس سے کوئی فرق پڑتا ہے؟"
  },
  {
    "en": "Don't be hasty.",
    "ur": "جلد بازی نہ کرو۔"
  },
  {
    "en": "Don't be scared.",
    "ur": "ڈرو مت۔"
  },
  {
    "en": "Don't be smart.",
    "ur": "ہوشیار نہ بنو۔"
  },
  {
    "en": "Don't be so greedy.",
    "ur": "اتنا لالچی مت بنو۔"
  },
  {
    "en": "Don't be too smart.",
    "ur": "زیادہ ہوشیار مت بنو۔"
  },
  {
    "en": "Don't bite your nails.",
    "ur": "اپنے ناخن نہ کاٹو۔"
  },
  {
    "en": "Don't embarrass me.",
    "ur": "مجھے شرمندہ مت کرو۔"
  },
  {
    "en": "Don't even think of touching this.",
    "ur": "اس کو چھونے کا سوچنا بھی نہیں۔"
  },
  {
    "en": "Don't favour me.",
    "ur": "مجھ پر احسان مت کرو۔"
  },
  {
    "en": "Don't forget to bring him.",
    "ur": "اسے لانا مت بھولنا۔"
  },
  {
    "en": "Don't get angry.",
    "ur": "غصہ نہ کرو۔"
  },
  {
    "en": "Don't hurt anyone.",
    "ur": "کسی کو تکلیف نہ دو۔"
  },
  {
    "en": "Don't jump on the bed.",
    "ur": "بستر پر نہ کودیں۔"
  },
  {
    "en": "Don't laugh too much.",
    "ur": "زیادہ مت ہنسو۔"
  },
  {
    "en": "Don't lie to me.",
    "ur": "مجھ سے جھوٹ مت بولو۔"
  },
  {
    "en": "Don't make a noise.",
    "ur": "شور مت کرو۔"
  },
  {
    "en": "Don't make a quarrel.",
    "ur": "جھگڑا نہ کرو۔"
  },
  {
    "en": "Don't make excuses.",
    "ur": "بہانے مت بناؤ۔"
  },
  {
    "en": "Don't make me angry.",
    "ur": "مجھے ناراض مت کرو۔"
  },
  {
    "en": "Don't regret later.",
    "ur": "بعد میں افسوس نہ کریں۔"
  },
  {
    "en": "Don't spoil your life.",
    "ur": "اپنی زندگی کو خراب نہ کریں۔"
  },
  {
    "en": "Don't stretch the matter further.",
    "ur": "معاملے کو مزید نہ بڑھاو۔"
  },
  {
    "en": "Don't take it to heart.",
    "ur": "اسے دل پر نہ لیں۔"
  },
  {
    "en": "Don't take out your anger on me.",
    "ur": "اپنا غصہ مجھ پر مت نکالو۔"
  },
  {
    "en": "Don't talk back.",
    "ur": "پیچھے کی بات نہ کرو۔"
  },
  {
    "en": "Don't talk nonsense",
    "ur": "فضول باتیں مت کرو۔"
  },
  {
    "en": "Don't threaten me.",
    "ur": "مجھے دھمکی مت دو۔"
  },
  {
    "en": "Don't try to be too smart.",
    "ur": "زیادہ ہوشیار بننے کی کوشش نہ کریں۔"
  },
  {
    "en": "Don't underestimate me.",
    "ur": "مجھے کم مت سمجھو۔"
  },
  {
    "en": "Don't worry, It's not a big deal.",
    "ur": "پریشان نہ ہوں، یہ کوئی بڑی بات نہیں ہے۔"
  },
  {
    "en": "Even then I will go there.",
    "ur": "تب بھی میں وہاں جاؤں گا۔"
  },
  {
    "en": "Everybody had slept when I arrived home.",
    "ur": "جب میں گھر پہنچا تو سب سو چکے تھے۔"
  },
  {
    "en": "Everyone was with me.",
    "ur": "سب میرے ساتھ تھے۔"
  },
  {
    "en": "Everyone will get a chance.",
    "ur": "سب کو موقع ملے گا۔"
  },
  {
    "en": "Everything is fine.",
    "ur": "سب کچھ ٹھیک ہے۔"
  },
  {
    "en": "Everything is ready.",
    "ur": "سب کچھ تیار ہے۔"
  },
  {
    "en": "Everything is useless.",
    "ur": "سب کچھ بیکار ہے۔"
  },
  {
    "en": "Everything will get better.",
    "ur": "سب کچھ بہتر ہو جائے گا۔"
  },
  {
    "en": "For How long have you been standing here?",
    "ur": "تم کتنے عرصے سے یہاں کھڑے ہو؟"
  },
  {
    "en": "For how long will you stay here?",
    "ur": "تم کب تک یہاں رہو گے؟"
  },
  {
    "en": "For the time being let him go.",
    "ur": "فی الحال اسے جانے دو۔"
  },
  {
    "en": "Forgive me if I had made any mistake accidentally.",
    "ur": "اگر مجھ سے غلطی سے کوئی غلطی ہو گئی ہو تو مجھے معاف کر دینا۔"
  },
  {
    "en": "From a specific point in time until now (past till now)",
    "ur": "وقت کے ایک خاص نقطہ سے اب تک (ماضی اب تک)۔"
  },
  {
    "en": "Further forward than someone or something else",
    "ur": "کسی سے یا کسی اور چیز سے آگے۔"
  },
  {
    "en": "Further forward than someone or something else.",
    "ur": "کسی سے یا کسی اور چیز سے آگے۔"
  },
  {
    "en": "Future already completed",
    "ur": "مستقبل پہلے ہی مکمل ہو چکا ہے۔"
  },
  {
    "en": "Future not completed",
    "ur": "مستقبل مکمل نہیں ہوا۔"
  },
  {
    "en": "Get away from me.",
    "ur": "مجھ سے دور ہو جاؤ۔"
  },
  {
    "en": "Getting current working directory failed",
    "ur": "موجودہ ورکنگ ڈائرکٹری حاصل کرنا ناکام ہوگیا۔"
  },
  {
    "en": "Go away from here.",
    "ur": "چلی جاؤ یہاں سے۔"
  },
  {
    "en": "Got a GDPR status:",
    "ur": "جی ڈی پی آر کی حیثیت حاصل کی:۔"
  },
  {
    "en": "Have a nice journey.",
    "ur": "آپ کا سفر اچھا ہو۔"
  },
  {
    "en": "Have another one.",
    "ur": "ایک اور ہے۔"
  },
  {
    "en": "Have you arranged to meet Ali this weekend?",
    "ur": "کیا تم نے اس ہفتے کے آخر میں علی سے ملنے کا انتظام کیا ہے؟"
  },
  {
    "en": "Have you ever been to Canada?",
    "ur": "کیا آپ کبھی کینیڈا گئے ہیں؟"
  },
  {
    "en": "Have you ever been to Islamabad?",
    "ur": "کیا آپ کبھی اسلام آباد گئے ہیں؟"
  },
  {
    "en": "Have you gone mad?",
    "ur": "کیا تم پاگل ہو گئے ہو؟"
  },
  {
    "en": "Have you got your license?",
    "ur": "کیا آپ کو اپنا لائسنس مل گیا ہے؟"
  },
  {
    "en": "He adapted himself to his new life.",
    "ur": "اس نے خود کو اپنی نئی زندگی میں ڈھال لیا۔"
  },
  {
    "en": "He adores his grandfather.",
    "ur": "وہ اپنے دادا سے پیار کرتا ہے۔"
  },
  {
    "en": "He advised applying at once.",
    "ur": "اس نے فوراً درخواست دینے کا مشورہ دیا۔"
  },
  {
    "en": "He always reneges from his own words.",
    "ur": "وہ ہمیشہ اپنی باتوں سے مکر جاتا ہے۔"
  },
  {
    "en": "He began to abuse.",
    "ur": "گالیاں دینے لگا۔"
  },
  {
    "en": "He began to pant.",
    "ur": "وہ ہانپنے لگا۔"
  },
  {
    "en": "He began to weep.",
    "ur": "وہ رونے لگا۔"
  },
  {
    "en": "He begins to beat.",
    "ur": "وہ مارنا شروع کر دیتا ہے۔"
  },
  {
    "en": "He called me privately.",
    "ur": "اس نے مجھے پرائیویٹ بلایا۔"
  },
  {
    "en": "He could be at home.",
    "ur": "وہ گھر پر ہوسکتا ہے۔"
  },
  {
    "en": "He did this at my behest.",
    "ur": "اس نے یہ میرے کہنے پر کیا۔"
  },
  {
    "en": "He didn't even call me.",
    "ur": "اس نے مجھے فون تک نہیں کیا۔"
  },
  {
    "en": "He doesn't deserve it.",
    "ur": "وہ اس کا مستحق نہیں ہے۔"
  },
  {
    "en": "He doesn't know how to speak English.",
    "ur": "اسے انگریزی بولنا نہیں آتی۔"
  },
  {
    "en": "He doesn't no how to read.",
    "ur": "اسے پڑھنا نہیں آتا۔"
  },
  {
    "en": "He fell down after feeling giddy.",
    "ur": "وہ چکرا کر گر پڑا۔"
  },
  {
    "en": "He got married.",
    "ur": "اس کی شادی ہو گئی۔"
  },
  {
    "en": "He has a headache.",
    "ur": "اس کے سر میں درد ہے۔"
  },
  {
    "en": "He has been missing since morning.",
    "ur": "وہ صبح سے لاپتہ ہے۔"
  },
  {
    "en": "He has financial problems.",
    "ur": "اسے مالی مسائل ہیں۔"
  },
  {
    "en": "He has gone to read.",
    "ur": "وہ پڑھنے گیا ہے۔"
  },
  {
    "en": "He has just gone.",
    "ur": "وہ ابھی گیا ہے۔"
  },
  {
    "en": "He has no right to ask.",
    "ur": "اسے پوچھنے کا کوئی حق نہیں۔"
  },
  {
    "en": "He is a farmer.",
    "ur": "وہ ایک کسان ہے۔"
  },
  {
    "en": "He is about 5 feet tall.",
    "ur": "اس کا قد تقریباً 5 فٹ ہے۔"
  },
  {
    "en": "He is always busy on his phone.",
    "ur": "وہ ہر وقت اپنے فون پر مصروف رہتا ہے۔"
  },
  {
    "en": "He is coming to me.",
    "ur": "وہ میرے پاس آ رہا ہے۔"
  },
  {
    "en": "He is compelled by his habit.",
    "ur": "وہ اپنی عادت سے مجبور ہے۔"
  },
  {
    "en": "He is downstairs.",
    "ur": "وہ نیچے ہے۔"
  },
  {
    "en": "He is engaged in playing cricket.",
    "ur": "وہ کرکٹ کھیلنے میں مصروف ہے۔"
  },
  {
    "en": "He is frightened.",
    "ur": "وہ خوفزدہ ہے۔"
  },
  {
    "en": "He is getting late.",
    "ur": "اسے دیر ہو رہی ہے۔"
  },
  {
    "en": "He is getting married.",
    "ur": "اس کی شادی ہو رہی ہے۔"
  },
  {
    "en": "He is getting spoiled.",
    "ur": "وہ خراب ہو رہا ہے۔"
  },
  {
    "en": "He is going through a very tough time.",
    "ur": "وہ بہت مشکل وقت سے گزر رہا ہے۔"
  },
  {
    "en": "He is highly good natured.",
    "ur": "وہ انتہائی نیک طبیعت ہے۔"
  },
  {
    "en": "He is jealous of my success.",
    "ur": "وہ میری کامیابی پر رشک کرتا ہے۔"
  },
  {
    "en": "He is my father.",
    "ur": "وہ میرا باپ ہے۔"
  },
  {
    "en": "He is no longer here.",
    "ur": "وہ اب یہاں نہیں ہے۔"
  },
  {
    "en": "He is not answering my call.",
    "ur": "وہ میری کال کا جواب نہیں دے رہا۔"
  },
  {
    "en": "He is not picking up my phone.",
    "ur": "وہ میرا فون نہیں اٹھا رہا ہے۔"
  },
  {
    "en": "He is not reliable.",
    "ur": "وہ قابل اعتبار نہیں ہے۔"
  },
  {
    "en": "He is on the way.",
    "ur": "وہ راستے میں ہے۔"
  },
  {
    "en": "He is optimistic person.",
    "ur": "وہ پر امید شخص ہے۔"
  },
  {
    "en": "He is playing mobile games.",
    "ur": "وہ موبائل گیمز کھیل رہا ہے۔"
  },
  {
    "en": "He is praiseworthy.",
    "ur": "وہ قابل تعریف ہے۔"
  },
  {
    "en": "He is taking a bath.",
    "ur": "وہ نہا رہا ہے۔"
  },
  {
    "en": "He is talking on the phone.",
    "ur": "وہ فون پر بات کر رہا ہے۔"
  },
  {
    "en": "He is upstairs.",
    "ur": "وہ اوپر ہے۔"
  },
  {
    "en": "He is very sluggish.",
    "ur": "وہ بہت سست ہے۔"
  },
  {
    "en": "He is worth praising.",
    "ur": "وہ قابل تعریف ہے۔"
  },
  {
    "en": "He just went out.",
    "ur": "وہ ابھی باہر چلا گیا۔"
  },
  {
    "en": "He kept watching.",
    "ur": "وہ دیکھتا رہا۔"
  },
  {
    "en": "He lost his ball at the door.",
    "ur": "اس نے دروازے پر اپنی گیند کھو دی۔"
  },
  {
    "en": "He must have gone by now.",
    "ur": "وہ اب تک چلا گیا ہوگا۔"
  },
  {
    "en": "He narrowly escaped falling.",
    "ur": "وہ گرنے سے بال بال بچ گیا۔"
  },
  {
    "en": "He sings very tunelessly.",
    "ur": "وہ بہت بے آواز گاتا ہے۔"
  },
  {
    "en": "He was embarrassed to admit making a mistake.",
    "ur": "وہ غلطی کا اعتراف کرتے ہوئے شرمندہ تھا۔"
  },
  {
    "en": "He was misleading me.",
    "ur": "وہ مجھے گمراہ کر رہا تھا۔"
  },
  {
    "en": "He was stammering.",
    "ur": "وہ لڑکھڑا رہا تھا۔"
  },
  {
    "en": "He was standing behind you.",
    "ur": "وہ تمہارے پیچھے کھڑا تھا۔"
  },
  {
    "en": "He went five minutes ago",
    "ur": "وہ پانچ منٹ پہلے گیا تھا۔"
  },
  {
    "en": "He will begin to weep.",
    "ur": "وہ رونا شروع کر دے گا۔"
  },
  {
    "en": "He will have to accept his mistake.",
    "ur": "اسے اپنی غلطی ماننی پڑے گی۔"
  },
  {
    "en": "Heat up the tea.",
    "ur": "چائے گرم کرو۔"
  },
  {
    "en": "Here is your money.",
    "ur": "یہ رہا آپ کا پیسہ۔"
  },
  {
    "en": "His tummy has bulged out.",
    "ur": "اس کا پیٹ پھول گیا ہے۔"
  },
  {
    "en": "How am I guilty?",
    "ur": "میں کیسے مجرم ہوں؟"
  },
  {
    "en": "How are you brother?",
    "ur": "بھائی کیسے ہیں آپ؟"
  },
  {
    "en": "How are you now?",
    "ur": "اب کیسی ہو؟"
  },
  {
    "en": "How can I help you?",
    "ur": "میں آپ کی مدد کیسے کر سکتا ہوں؟"
  },
  {
    "en": "How can you be so lazy?",
    "ur": "تم اتنے سست کیسے ہو سکتے ہو؟"
  },
  {
    "en": "How can you be so selfish?",
    "ur": "تم اتنے خود غرض کیسے ہو سکتے ہو؟"
  },
  {
    "en": "How come you lost money?",
    "ur": "آپ نے پیسے کیسے کھوئے؟"
  },
  {
    "en": "How dare you say like that?",
    "ur": "تمہاری ہمت کیسے ہوئی ایسے کہنے کی؟"
  },
  {
    "en": "How did he look a like?",
    "ur": "وہ کیسی لگ رہی تھی؟"
  },
  {
    "en": "How did it break?",
    "ur": "یہ کیسے ٹوٹا؟"
  },
  {
    "en": "How did it hurt?",
    "ur": "اسے کیسے تکلیف ہوئی؟"
  },
  {
    "en": "How did this pen get into my bag?",
    "ur": "یہ قلم میرے بیگ میں کیسے آیا؟"
  },
  {
    "en": "How did you come?",
    "ur": "آپ کیسے آئے؟"
  },
  {
    "en": "How did you do it?",
    "ur": "تم نے یہ کیسے کیا؟"
  },
  {
    "en": "How do you know?",
    "ur": "تم کیسے جانتے ہو؟"
  },
  {
    "en": "How does it matter?",
    "ur": "اس سے کیا فرق پڑتا ہے؟"
  },
  {
    "en": "How far is your home?",
    "ur": "آپ کا گھر کتنا دور ہے؟"
  },
  {
    "en": "How foolish he is!",
    "ur": "وہ کتنا بے وقوف ہے!"
  },
  {
    "en": "How is the weather today?",
    "ur": "آج موسم کیسا ہے؟"
  },
  {
    "en": "How is your study going on?",
    "ur": "آپ کی پڑھائی کیسی چل رہی ہے؟"
  },
  {
    "en": "How long have you been here?",
    "ur": "آپ یہاں کب سے ہیں؟"
  },
  {
    "en": "How long will I complete learning English?",
    "ur": "میں کب تک انگریزی سیکھنا مکمل کروں گا؟"
  },
  {
    "en": "How long will I recover?",
    "ur": "میں کب تک ٹھیک ہو جاؤں گا؟"
  },
  {
    "en": "How long will he be reading?",
    "ur": "وہ کب تک پڑھتا رہے گا؟"
  },
  {
    "en": "How long will it take?",
    "ur": "کتنا وقت لگے گا؟"
  },
  {
    "en": "How long will you take?",
    "ur": "آپ کو کتنا وقت لگے گا؟"
  },
  {
    "en": "How long will you wait?",
    "ur": "کب تک انتظار کرو گے؟"
  },
  {
    "en": "How many people are there?",
    "ur": "کتنے لوگ ہیں؟"
  },
  {
    "en": "How many people have come?",
    "ur": "کتنے لوگ آئے ہیں؟"
  },
  {
    "en": "How many people were there?",
    "ur": "کتنے لوگ تھے؟"
  },
  {
    "en": "How much do you earn?",
    "ur": "آپ کتنا کماتے ہیں؟"
  },
  {
    "en": "How much does a new fan cost?",
    "ur": "ایک نئے پنکھے کی قیمت کتنی ہے؟"
  },
  {
    "en": "How much does this cost?",
    "ur": "اس کی قیمت کتنی ہے؟"
  },
  {
    "en": "How much money do you have?",
    "ur": "آپ کے پاس کتنے پیسے ہیں؟"
  },
  {
    "en": "How much time will he take?",
    "ur": "وہ کتنا وقت لے گا؟"
  },
  {
    "en": "How often do you take food a day?",
    "ur": "آپ دن میں کتنی بار کھانا کھاتے ہیں؟"
  },
  {
    "en": "How old are you?",
    "ur": "آپ کی عمر کتنی ہے؟"
  },
  {
    "en": "How selfish you are!",
    "ur": "تم کتنے خود غرض ہو!"
  },
  {
    "en": "How will he find him?",
    "ur": "وہ اسے کیسے تلاش کرے گا؟"
  },
  {
    "en": "How will you go?",
    "ur": "آپ کیسے جائیں گے؟"
  },
  {
    "en": "How's the weather in your city?",
    "ur": "آپ کے شہر کا موسم کیسا ہے؟"
  },
  {
    "en": "I accept your apology.",
    "ur": "میں آپ کی معذرت قبول کرتا ہوں۔"
  },
  {
    "en": "I added a room to my house.",
    "ur": "میں نے اپنے گھر میں ایک کمرہ شامل کیا۔"
  },
  {
    "en": "I admire your confidence.",
    "ur": "میں آپ کے اعتماد کی تعریف کرتا ہوں۔"
  },
  {
    "en": "I admit my mistake.",
    "ur": "میں اپنی غلطی مانتا ہوں۔"
  },
  {
    "en": "I am 25 years old.",
    "ur": "میری عمر 25 سال ہے۔"
  },
  {
    "en": "I am a person of words.",
    "ur": "میں لفظوں کا آدمی ہوں۔"
  },
  {
    "en": "I am a teacher.",
    "ur": "میں ایک استاد ہوں۔"
  },
  {
    "en": "I am about to reach home.",
    "ur": "میں گھر پہنچنے ہی والا ہوں۔"
  },
  {
    "en": "I am alive only for you.",
    "ur": "میں صرف تمہارے لیے زندہ ہوں۔"
  },
  {
    "en": "I am asking this without any reason.",
    "ur": "میں یہ بلا وجہ پوچھ رہا ہوں۔"
  },
  {
    "en": "I am asking you something.",
    "ur": "میں تم سے کچھ پوچھ رہا ہوں۔"
  },
  {
    "en": "I am coming in a while.",
    "ur": "میں تھوڑی دیر میں آرہا ہوں۔"
  },
  {
    "en": "I am coming right there.",
    "ur": "میں وہیں آ رہا ہوں۔"
  },
  {
    "en": "I am doing nothing.",
    "ur": "میں کچھ نہیں کر رہا۔"
  },
  {
    "en": "I am feeling hungry.",
    "ur": "مجھے بھوک لگ رہی ہے۔"
  },
  {
    "en": "I am feeling sleepy.",
    "ur": "مجھے نیند آ رہی ہے۔"
  },
  {
    "en": "I am feeling suffocated here.",
    "ur": "مجھے یہاں گھٹن محسوس ہو رہی ہے۔"
  },
  {
    "en": "I am getting scared.",
    "ur": "میں ڈرتا جا رہا ہوں۔"
  },
  {
    "en": "I am having tea.",
    "ur": "میں چائے پی رہا ہوں۔"
  },
  {
    "en": "I am having to cook food.",
    "ur": "مجھے کھانا پکانا ہے۔"
  },
  {
    "en": "I am having to go every day.",
    "ur": "مجھے ہر روز جانا پڑتا ہے۔"
  },
  {
    "en": "I am in a hurry.",
    "ur": "میں جلدی میں ہوں۔"
  },
  {
    "en": "I am in my house.",
    "ur": "میں اپنے گھر میں ہوں۔"
  },
  {
    "en": "I am in office.",
    "ur": "میں دفتر میں ہوں۔"
  },
  {
    "en": "I am learning English these days.",
    "ur": "میں ان دنوں انگریزی سیکھ رہا ہوں۔"
  },
  {
    "en": "I am learning English.",
    "ur": "میں انگریزی سیکھ رہا ہوں۔"
  },
  {
    "en": "I am looking for a place to sit down.",
    "ur": "میں بیٹھنے کے لیے جگہ تلاش کر رہا ہوں۔"
  },
  {
    "en": "I am making breakfast.",
    "ur": "میں ناشتہ بنا رہی ہوں۔"
  },
  {
    "en": "I am not in mood to fight.",
    "ur": "میں لڑنے کے موڈ میں نہیں ہوں۔"
  },
  {
    "en": "I am not refusing.",
    "ur": "میں انکار نہیں کر رہا ہوں۔"
  },
  {
    "en": "I am not used to sleeping early.",
    "ur": "مجھے جلدی سونے کی عادت نہیں ہے۔"
  },
  {
    "en": "I am older than her.",
    "ur": "میں اس سے عمر میں بڑا ہوں۔"
  },
  {
    "en": "I am on your side.",
    "ur": "میں آپ کی طرف ہوں۔"
  },
  {
    "en": "I am proud of you.",
    "ur": "مجھے تم پر فخر ہے۔"
  },
  {
    "en": "I am saying something.",
    "ur": "میں کچھ کہہ رہا ہوں۔"
  },
  {
    "en": "I am sitting in the class.",
    "ur": "میں کلاس میں بیٹھا ہوں۔"
  },
  {
    "en": "I am taller than you.",
    "ur": "میں تم سے اونچا ہوں۔"
  },
  {
    "en": "I am very happy today.",
    "ur": "میں آج بہت خوش ہوں۔"
  },
  {
    "en": "I am very happy.",
    "ur": "میں بہت خوش ہوں۔"
  },
  {
    "en": "I am waiting for you.",
    "ur": "میں آپ کا انتظار کر رہا ہوں۔"
  },
  {
    "en": "I am watching the T.V.",
    "ur": "میں ٹی وی دیکھ رہا ہوں۔"
  },
  {
    "en": "I am working on a project.",
    "ur": "میں ایک پروجیکٹ پر کام کر رہا ہوں۔"
  },
  {
    "en": "I am working on it.",
    "ur": "میں اس پر کام کر رہا ہوں۔"
  },
  {
    "en": "I am your well-wisher.",
    "ur": "میں آپ کا خیر خواہ ہوں۔"
  },
  {
    "en": "I apologise for my mistake.",
    "ur": "میں اپنی غلطی کے لیے معذرت خواہ ہوں۔"
  },
  {
    "en": "I appreciate having a trouble with his supervisor.",
    "ur": "میں اس کے سپروائزر کے ساتھ پریشانی کی تعریف کرتا ہوں۔"
  },
  {
    "en": "I assure you Ali will be perfectly safe.",
    "ur": "میں آپ کو یقین دلاتا ہوں کہ علی بالکل محفوظ ہوں گے۔"
  },
  {
    "en": "I believe in your every decision.",
    "ur": "مجھے آپ کے ہر فیصلے پر یقین ہے۔"
  },
  {
    "en": "I call you in a while.",
    "ur": "میں آپ کو تھوڑی دیر میں کال کرتا ہوں۔"
  },
  {
    "en": "I called you twice.",
    "ur": "میں نے آپ کو دو بار فون کیا۔"
  },
  {
    "en": "I can't believe it.",
    "ur": "میں اس پر یقین نہیں کر سکتا۔"
  },
  {
    "en": "I can't find my mobile.",
    "ur": "مجھے اپنا موبائل نہیں مل رہا۔"
  },
  {
    "en": "I can't stand in the sun.",
    "ur": "میں دھوپ میں کھڑا نہیں ہو سکتا۔"
  },
  {
    "en": "I did as I was told.",
    "ur": "میں نے ویسا ہی کیا جیسا مجھے بتایا گیا تھا۔"
  },
  {
    "en": "I didn't expect it from you.",
    "ur": "مجھے تم سے اس کی امید نہیں تھی۔"
  },
  {
    "en": "I didn't mean it.",
    "ur": "میرا یہ مطلب نہیں تھا۔"
  },
  {
    "en": "I didn't see him.",
    "ur": "میں نے اسے نہیں دیکھا۔"
  },
  {
    "en": "I don't agree with you.",
    "ur": "میں آپ سے متفق نہیں ہوں۔"
  },
  {
    "en": "I don't believe.",
    "ur": "میں نہیں مانتا۔"
  },
  {
    "en": "I don't feel like waking up.",
    "ur": "مجھے جاگنا اچھا نہیں لگتا۔"
  },
  {
    "en": "I don't have any cash.",
    "ur": "میرے پاس کوئی نقدی نہیں ہے۔"
  },
  {
    "en": "I don't know anything about it.",
    "ur": "میں اس کے بارے میں کچھ نہیں جانتا۔"
  },
  {
    "en": "I don't need useless people.",
    "ur": "مجھے بیکار لوگوں کی ضرورت نہیں ہے۔"
  },
  {
    "en": "I don't need your sympathy.",
    "ur": "مجھے آپ کی ہمدردی کی ضرورت نہیں ہے۔"
  },
  {
    "en": "I don't think so.",
    "ur": "مجھے ایسا نہیں لگتا۔"
  },
  {
    "en": "I don't want this.",
    "ur": "میں یہ نہیں چاہتا۔"
  },
  {
    "en": "I don't want to be stuck in the middle.",
    "ur": "میں بیچ میں پھنسنا نہیں چاہتا۔"
  },
  {
    "en": "I don't want to bother you.",
    "ur": "میں تمہیں پریشان نہیں کرنا چاہتا۔"
  },
  {
    "en": "I fell on the road yesterday.",
    "ur": "میں کل سڑک پر گر گیا تھا۔"
  },
  {
    "en": "I forgot my mobile at your house.",
    "ur": "میں اپنا موبائل آپ کے گھر بھول گیا تھا۔"
  },
  {
    "en": "I forgot to ask him.",
    "ur": "میں اس سے پوچھنا بھول گیا۔"
  },
  {
    "en": "I get newspaper everyday.",
    "ur": "مجھے روزانہ اخبار ملتا ہے۔"
  },
  {
    "en": "I go there sometimes.",
    "ur": "میں کبھی کبھی وہاں جاتا ہوں۔"
  },
  {
    "en": "I hardly ever used to go there.",
    "ur": "میں شاید ہی کبھی وہاں جاتا تھا۔"
  },
  {
    "en": "I have been saying for a long time.",
    "ur": "میں کافی عرصے سے کہہ رہا ہوں۔"
  },
  {
    "en": "I have been there many times.",
    "ur": "میں وہاں کئی بار گیا ہوں۔"
  },
  {
    "en": "I have been working since morning.",
    "ur": "میں صبح سے کام کر رہا ہوں۔"
  },
  {
    "en": "I have done this all thoughtfully.",
    "ur": "میں نے یہ سب سوچ سمجھ کر کیا ہے۔"
  },
  {
    "en": "I have eaten food.",
    "ur": "میں نے کھانا کھا لیا ہے۔"
  },
  {
    "en": "I have financial problems.",
    "ur": "مجھے مالی مسائل ہیں۔"
  },
  {
    "en": "I have given up bad habits.",
    "ur": "میں نے بری عادتیں چھوڑ دی ہیں۔"
  },
  {
    "en": "I have got a job.",
    "ur": "مجھے نوکری مل گئی ہے۔"
  },
  {
    "en": "I have hardly ever gone there.",
    "ur": "میں شاید ہی کبھی وہاں گیا ہوں۔"
  },
  {
    "en": "I have known it.",
    "ur": "میں اسے جان چکا ہوں۔"
  },
  {
    "en": "I have never visited canada.",
    "ur": "میں کبھی کینیڈا نہیں گیا۔"
  },
  {
    "en": "I have no idea.",
    "ur": "مجھے کوئی اندازہ نہیں ہے۔"
  },
  {
    "en": "I have no other family besides my parents.",
    "ur": "میرے والدین کے علاوہ میرا کوئی خاندان نہیں ہے۔"
  },
  {
    "en": "I have no time.",
    "ur": "میرے پاس وقت نہیں ہے۔"
  },
  {
    "en": "I have not taken contract to go there.",
    "ur": "میں نے وہاں جانے کا ٹھیکہ نہیں لیا ہے۔"
  },
  {
    "en": "I have nothing to do with it.",
    "ur": "میرا اس سے کوئی تعلق نہیں ہے۔"
  },
  {
    "en": "I have passed the examination.",
    "ur": "میں نے امتحان پاس کر لیا ہے۔"
  },
  {
    "en": "I have recently met him.",
    "ur": "میں نے حال ہی میں اس سے ملاقات کی ہے۔"
  },
  {
    "en": "I have seen you somewhere.",
    "ur": "میں نے آپ کو کہیں دیکھا ہے۔"
  },
  {
    "en": "I have some urgent work.",
    "ur": "مجھے کچھ ضروری کام ہے۔"
  },
  {
    "en": "I have studied up to graduation.",
    "ur": "میں نے گریجویشن تک تعلیم حاصل کی ہے۔"
  },
  {
    "en": "I have to do it anyhow.",
    "ur": "مجھے یہ کسی بھی طرح کرنا ہے۔"
  },
  {
    "en": "I have to get recharged.",
    "ur": "مجھے ریچارج کروانا ہے۔"
  },
  {
    "en": "I have to get up early in the morning.",
    "ur": "مجھے صبح جلدی اٹھنا ہے۔"
  },
  {
    "en": "I have to go to market.",
    "ur": "مجھے بازار جانا ہے۔"
  },
  {
    "en": "I have to talk to you about something important.",
    "ur": "مجھے تم سے کچھ ضروری بات کرنی ہے۔"
  },
  {
    "en": "I have to talk to you privately.",
    "ur": "مجھے تم سے پرائیویٹ بات کرنی ہے۔"
  },
  {
    "en": "I have told him.",
    "ur": "میں نے اسے بتا دیا ہے۔"
  },
  {
    "en": "I have washed hands and came.",
    "ur": "میں ہاتھ دھو کر آیا ہوں۔"
  },
  {
    "en": "I helped him and what's more I gave him money also.",
    "ur": "میں نے اس کی مدد کی اور اس کے علاوہ میں نے اسے پیسے بھی دیئے۔"
  },
  {
    "en": "I hope you are safe and sound.",
    "ur": "مجھے امید ہے کہ آپ محفوظ اور صحت مند ہیں۔"
  },
  {
    "en": "I just made it.",
    "ur": "میں نے ابھی بنایا ہے۔"
  },
  {
    "en": "I kept calling her, but she didn't come.",
    "ur": "میں اسے پکارتا رہا لیکن وہ نہیں آئی۔"
  },
  {
    "en": "I kept reading whole night.",
    "ur": "میں رات بھر پڑھتا رہا۔"
  },
  {
    "en": "I knew you would obviously come.",
    "ur": "مجھے معلوم تھا کہ تم ضرور آؤ گے۔"
  },
  {
    "en": "I know everything about you.",
    "ur": "میں تمہارے بارے میں سب کچھ جانتا ہوں۔"
  },
  {
    "en": "I know everything.",
    "ur": "میں سب کچھ جانتا ہوں۔"
  },
  {
    "en": "I know how difficult it is to earn money.",
    "ur": "میں جانتا ہوں کہ پیسہ کمانا کتنا مشکل ہے۔"
  },
  {
    "en": "I know who you are?",
    "ur": "میں جانتا ہوں تم کون ہو؟"
  },
  {
    "en": "I know you didn't mean that, even then you should have thought at least once.",
    "ur": "میں جانتا ہوں کہ آپ کا یہ مطلب نہیں تھا، تب بھی آپ کو کم از کم ایک بار سوچنا چاہیے تھا۔"
  },
  {
    "en": "I liked your idea and adopted it.",
    "ur": "مجھے آپ کا خیال پسند آیا اور میں نے اسے اپنایا۔"
  },
  {
    "en": "I met Madeen in market.",
    "ur": "میں بازار میں مدین سے ملا۔"
  },
  {
    "en": "I need your help.",
    "ur": "مجھے آپ کی مدد کی ضرورت ہے۔"
  },
  {
    "en": "I recognized him at a glance.",
    "ur": "میں نے اسے ایک نظر میں پہچان لیا۔"
  },
  {
    "en": "I said get lost.",
    "ur": "میں نے کہا گم ہو جاؤ۔"
  },
  {
    "en": "I said to him very clearly.",
    "ur": "میں نے اسے بہت صاف صاف کہا۔"
  },
  {
    "en": "I saw with my own eyes.",
    "ur": "میں نے اپنی آنکھوں سے دیکھا۔"
  },
  {
    "en": "I shall be at home.",
    "ur": "میں گھر پر رہوں گا۔"
  },
  {
    "en": "I shall be ready.",
    "ur": "میں تیار رہوں گا۔"
  },
  {
    "en": "I shall have to go to Lahore.",
    "ur": "مجھے لاہور جانا ہے۔"
  },
  {
    "en": "I shall have to think for that.",
    "ur": "اس کے لیے مجھے سوچنا پڑے گا۔"
  },
  {
    "en": "I stood first in class.",
    "ur": "میں کلاس میں اول آیا۔"
  },
  {
    "en": "I think she will come by this way.",
    "ur": "مجھے لگتا ہے کہ وہ اس راستے سے آئے گی۔"
  },
  {
    "en": "I think you are fed up with your life.",
    "ur": "مجھے لگتا ہے کہ آپ اپنی زندگی سے تنگ آچکے ہیں۔"
  },
  {
    "en": "I think your phone is ringing.",
    "ur": "مجھے لگتا ہے کہ آپ کا فون بج رہا ہے۔"
  },
  {
    "en": "I thought you wouldn't come.",
    "ur": "میں نے سوچا کہ آپ نہیں آئیں گے۔"
  },
  {
    "en": "I told him to do that.",
    "ur": "میں نے اسے کہا کہ ایسا کرو۔"
  },
  {
    "en": "I tried again and again.",
    "ur": "میں نے بار بار کوشش کی۔"
  },
  {
    "en": "I used to bother him a lot.",
    "ur": "میں اسے بہت تنگ کرتا تھا۔"
  },
  {
    "en": "I used to go there.",
    "ur": "میں وہاں جاتا تھا۔"
  },
  {
    "en": "I wake up late in the morning.",
    "ur": "میں صبح دیر سے اٹھتا ہوں۔"
  },
  {
    "en": "I want my money.",
    "ur": "مجھے اپنے پیسے چاہیے۔"
  },
  {
    "en": "I want to buy something?",
    "ur": "میں کچھ خریدنا چاہتا ہوں؟"
  },
  {
    "en": "I want to get rid of him.",
    "ur": "میں اس سے جان چھڑانا چاہتا ہوں۔"
  },
  {
    "en": "I want to meet the manager.",
    "ur": "میں مینیجر سے ملنا چاہتا ہوں۔"
  },
  {
    "en": "I want to meet you privately.",
    "ur": "میں آپ سے پرائیویٹ ملنا چاہتا ہوں۔"
  },
  {
    "en": "I want to talk to you alone.",
    "ur": "میں تم سے اکیلے میں بات کرنا چاہتا ہوں۔"
  },
  {
    "en": "I was a bit busy.",
    "ur": "میں تھوڑا مصروف تھا۔"
  },
  {
    "en": "I was about to call you.",
    "ur": "میں آپ کو کال کرنے ہی والا تھا۔"
  },
  {
    "en": "I was about to go.",
    "ur": "میں جانے ہی والا تھا۔"
  },
  {
    "en": "I was about to say the same thing.",
    "ur": "میں بھی یہی کہنے والا تھا۔"
  },
  {
    "en": "I was admiring you.",
    "ur": "میں آپ کی تعریف کر رہا تھا۔"
  },
  {
    "en": "I was already late, on top of that I had stuck in the traffic.",
    "ur": "مجھے پہلے ہی دیر ہو چکی تھی، اس کے علاوہ میں ٹریفک میں پھنس گیا تھا۔"
  },
  {
    "en": "I was astonished by his ignorance.",
    "ur": "میں اس کی لاعلمی پر حیران تھا۔"
  },
  {
    "en": "I was aware of his intentions.",
    "ur": "میں اس کے ارادوں سے واقف تھا۔"
  },
  {
    "en": "I was born in January.",
    "ur": "میں جنوری میں پیدا ہوا تھا۔"
  },
  {
    "en": "I was getting very tensed.",
    "ur": "میں بہت پریشان ہو رہا تھا۔"
  },
  {
    "en": "I was sure that you would not come.",
    "ur": "مجھے یقین تھا کہ آپ نہیں آئیں گے۔"
  },
  {
    "en": "I was thinking about you",
    "ur": "میں تمہارے بارے میں سوچ رہا تھا۔"
  },
  {
    "en": "I went into coaching.",
    "ur": "میں کوچنگ میں چلا گیا۔"
  },
  {
    "en": "I went there once.",
    "ur": "میں ایک بار وہاں گیا تھا۔"
  },
  {
    "en": "I went to Karachi.",
    "ur": "میں کراچی گیا۔"
  },
  {
    "en": "I will always be grateful to you.",
    "ur": "میں ہمیشہ آپ کا شکر گزار رہوں گا۔"
  },
  {
    "en": "I will be back soon.",
    "ur": "میں جلد ہی واپس آؤں گا۔"
  },
  {
    "en": "I will come for sure.",
    "ur": "میں ضرور آؤں گا۔"
  },
  {
    "en": "I will come in a while.",
    "ur": "میں تھوڑی دیر میں آؤں گا۔"
  },
  {
    "en": "I will do it later.",
    "ur": "میں اسے بعد میں کروں گا۔"
  },
  {
    "en": "I will get his work done.",
    "ur": "میں اس کا کام کروا دوں گا۔"
  },
  {
    "en": "I will get late.",
    "ur": "مجھے دیر ہو جائے گی۔"
  },
  {
    "en": "I will get the kids from school.",
    "ur": "میں بچوں کو اسکول سے لاؤں گا۔"
  },
  {
    "en": "I will go and get water for you.",
    "ur": "میں جا کر تمہارے لیے پانی لاؤں گا۔"
  },
  {
    "en": "I will handle everything.",
    "ur": "میں سب کچھ سنبھال لوں گا۔"
  },
  {
    "en": "I will handle it.",
    "ur": "میں اسے سنبھال لوں گا۔"
  },
  {
    "en": "I will have to ask.",
    "ur": "مجھے پوچھنا پڑے گا۔"
  },
  {
    "en": "I will have to reach there by any means.",
    "ur": "مجھے کسی بھی طریقے سے وہاں پہنچنا پڑے گا۔"
  },
  {
    "en": "I will not spare him.",
    "ur": "میں اسے نہیں بخشوں گا۔"
  },
  {
    "en": "I will not talk to you.",
    "ur": "میں تم سے بات نہیں کروں گا۔"
  },
  {
    "en": "I will pay today.",
    "ur": "میں آج ادا کروں گا۔"
  },
  {
    "en": "I will slap you really hard.",
    "ur": "میں تمہیں بہت زور سے تھپڑ ماروں گا۔"
  },
  {
    "en": "I will think about it.",
    "ur": "میں اس کے بارے میں سوچوں گا۔"
  },
  {
    "en": "I will try my best.",
    "ur": "میں اپنی پوری کوشش کروں گا۔"
  },
  {
    "en": "I wish I had a lot of money.",
    "ur": "کاش میرے پاس بہت پیسہ ہوتا۔"
  },
  {
    "en": "I wish I were in Canada.",
    "ur": "کاش میں کینیڈا میں ہوتا۔"
  },
  {
    "en": "I wish I would have told her.",
    "ur": "کاش میں اسے بتا دیتا۔"
  },
  {
    "en": "I worked in a bank.",
    "ur": "میں ایک بینک میں کام کرتا تھا۔"
  },
  {
    "en": "I wrote it from the book.",
    "ur": "میں نے اسے کتاب سے لکھا ہے۔"
  },
  {
    "en": "I'm anti the abuse of drink and the hassle that it causes",
    "ur": "میں شراب کے غلط استعمال اور اس کی وجہ سے ہونے والی پریشانی کے خلاف ہوں۔"
  },
  {
    "en": "I'm going to market.",
    "ur": "میں بازار جا رہا ہوں۔"
  },
  {
    "en": "I'm just going to bed for two hours or so.",
    "ur": "میں صرف دو گھنٹے کے لیے سونے جا رہا ہوں۔"
  },
  {
    "en": "I've got to do this report by Monday",
    "ur": "مجھے یہ رپورٹ پیر تک کرنی ہے۔"
  },
  {
    "en": "IPv4 addresses cannot have a scope ID",
    "ur": "IPv4 پتوں میں اسکوپ ID نہیں ہو سکتی۔"
  },
  {
    "en": "If I had, I would give.",
    "ur": "میرے پاس ہوتا تو میں دیتا۔"
  },
  {
    "en": "If this goes on, what we will eat.",
    "ur": "اگر یہ چلتا رہا تو ہم کیا کھائیں گے۔"
  },
  {
    "en": "Is everything alright there?",
    "ur": "کیا وہاں سب کچھ ٹھیک ہے؟"
  },
  {
    "en": "Is someone there?",
    "ur": "وہاں کوئی ہے؟"
  },
  {
    "en": "Is there any other alternative?",
    "ur": "کیا کوئی اور متبادل ہے؟"
  },
  {
    "en": "Is there anything special?",
    "ur": "کیا کوئی خاص بات ہے؟"
  },
  {
    "en": "Is this your final decision?",
    "ur": "کیا یہ آپ کا آخری فیصلہ ہے؟"
  },
  {
    "en": "Isolate exited without result or error.",
    "ur": "الگ تھلگ بغیر نتیجہ یا غلطی کے باہر نکل گیا۔"
  },
  {
    "en": "It doesn't matter.",
    "ur": "اس سے کوئی فرق نہیں پڑتا۔"
  },
  {
    "en": "It happened by mistake.",
    "ur": "یہ غلطی سے ہوا۔"
  },
  {
    "en": "It has been raining since morning.",
    "ur": "صبح سے بارش ہو رہی ہے۔"
  },
  {
    "en": "It is going to rain today.",
    "ur": "آج بارش ہونے والی ہے۔"
  },
  {
    "en": "It is itching in my hand.",
    "ur": "میرے ہاتھ میں خارش ہو رہی ہے۔"
  },
  {
    "en": "It is just your illusion.",
    "ur": "یہ صرف تمہارا وہم ہے۔"
  },
  {
    "en": "It is still not too late.",
    "ur": "ابھی بھی زیادہ دیر نہیں ہوئی۔"
  },
  {
    "en": "It is the matter of everyday.",
    "ur": "یہ روزمرہ کا معاملہ ہے۔"
  },
  {
    "en": "It is the topic of concern.",
    "ur": "یہ تشویش کا موضوع ہے۔"
  },
  {
    "en": "It is their mutual decision.",
    "ur": "یہ ان کا باہمی فیصلہ ہے۔"
  },
  {
    "en": "It is their mutual matter.",
    "ur": "یہ ان کا باہمی معاملہ ہے۔"
  },
  {
    "en": "It is your illusion.",
    "ur": "یہ تمہارا وہم ہے۔"
  },
  {
    "en": "It is your mobile.",
    "ur": "یہ آپ کا موبائل ہے۔"
  },
  {
    "en": "It may rain today.",
    "ur": "آج بارش ہو سکتی ہے۔"
  },
  {
    "en": "It normally takes 20 minutes to get there.",
    "ur": "عام طور پر وہاں پہنچنے میں 20 منٹ لگتے ہیں۔"
  },
  {
    "en": "It really helps us and it shouldn't take you more than one minute.",
    "ur": "یہ واقعی ہماری مدد کرتا ہے اور اس میں آپ کو ایک منٹ سے زیادہ نہیں لگنا چاہئے۔"
  },
  {
    "en": "It seems to me she is telling a lie.",
    "ur": "مجھے لگتا ہے کہ وہ جھوٹ بول رہی ہے۔"
  },
  {
    "en": "It was blowing hard.",
    "ur": "یہ زور سے اڑا رہا تھا۔"
  },
  {
    "en": "It was drizzling.",
    "ur": "بوندا باندی ہو رہی تھی۔"
  },
  {
    "en": "It was thundering.",
    "ur": "گرج رہی تھی۔"
  },
  {
    "en": "It will be better for you.",
    "ur": "یہ آپ کے لیے بہتر رہے گا۔"
  },
  {
    "en": "It would be so kind of you.",
    "ur": "یہ آپ کی بہت مہربانی ہوگی۔"
  },
  {
    "en": "It's a big deal for me.",
    "ur": "یہ میرے لیے بہت بڑی بات ہے۔"
  },
  {
    "en": "It's a long story.",
    "ur": "یہ ایک لمبی کہانی ہے۔"
  },
  {
    "en": "It's a quarter past eight.",
    "ur": "ساڑھے آٹھ بجے ہیں۔"
  },
  {
    "en": "It's a quarter to eight.",
    "ur": "ساڑھے آٹھ بجے ہیں۔"
  },
  {
    "en": "It's against my pride.",
    "ur": "یہ میرے غرور کے خلاف ہے۔"
  },
  {
    "en": "It's all because of you.",
    "ur": "یہ سب تمہاری وجہ سے ہے۔"
  },
  {
    "en": "It's becoming dark.",
    "ur": "اندھیرا ہوتا جا رہا ہے۔"
  },
  {
    "en": "It's eight minutes to eight.",
    "ur": "آٹھ بجنے میں آٹھ منٹ ہیں۔"
  },
  {
    "en": "It's eight o'clock.",
    "ur": "آٹھ بج رہے ہیں۔"
  },
  {
    "en": "It's getting dark.",
    "ur": "اندھیرا ہو رہا ہے۔"
  },
  {
    "en": "It's good habit.",
    "ur": "اچھی عادت ہے۔"
  },
  {
    "en": "It's good thing.",
    "ur": "اچھی بات ہے۔"
  },
  {
    "en": "It's half past eight.",
    "ur": "ساڑھے آٹھ بجے ہیں۔"
  },
  {
    "en": "It's just your imagination.",
    "ur": "یہ صرف آپ کی تخیل ہے۔"
  },
  {
    "en": "It's Monday today.",
    "ur": "آج پیر ہے۔"
  },
  {
    "en": "It's morning now.",
    "ur": "ابھی صبح ہو گئی ہے۔"
  },
  {
    "en": "It's my mobile.",
    "ur": "یہ میرا موبائل ہے۔"
  },
  {
    "en": "It's no less than a miracle for me.",
    "ur": "یہ میرے لیے کسی معجزے سے کم نہیں۔"
  },
  {
    "en": "It's no use to  go there.",
    "ur": "وہاں جانے کا کوئی فائدہ نہیں۔"
  },
  {
    "en": "It's no use to ask him.",
    "ur": "اس سے پوچھنے کا کوئی فائدہ نہیں۔"
  },
  {
    "en": "It's no use to go there.",
    "ur": "وہاں جانے کا کوئی فائدہ نہیں۔"
  },
  {
    "en": "It's not a big deal for me.",
    "ur": "یہ میرے لیے کوئی بڑی بات نہیں ہے۔"
  },
  {
    "en": "It's not my fault.",
    "ur": "یہ میرا قصور نہیں ہے۔"
  },
  {
    "en": "It's not that I don't know anything, I know everything.",
    "ur": "ایسا نہیں ہے کہ میں کچھ نہیں جانتا، میں سب کچھ جانتا ہوں۔"
  },
  {
    "en": "It's quarter to three.",
    "ur": "تین بج رہے ہیں۔"
  },
  {
    "en": "It's raining heavily.",
    "ur": "تیز بارش ہو رہی ہے۔"
  },
  {
    "en": "It's six past ten.",
    "ur": "دس بج کر چھ بج رہے ہیں۔"
  },
  {
    "en": "It's Sunday today.",
    "ur": "آج اتوار ہے۔"
  },
  {
    "en": "It's ten past eight.",
    "ur": "دس بج کر آٹھ ہو گئے ہیں۔"
  },
  {
    "en": "It's three minutes past eight.",
    "ur": "آٹھ بج کر تین منٹ ہیں۔"
  },
  {
    "en": "It's very hot over there.",
    "ur": "وہاں بہت گرمی ہے۔"
  },
  {
    "en": "It's very hot today.",
    "ur": "آج بہت گرمی ہے۔"
  },
  {
    "en": "It's very kind of you.",
    "ur": "یہ آپ کی بہت مہربانی ہے۔"
  },
  {
    "en": "It's your duty.",
    "ur": "یہ آپ کا فرض ہے۔"
  },
  {
    "en": "Jack appears to be tired today.",
    "ur": "جیک آج تھکا ہوا لگتا ہے۔"
  },
  {
    "en": "Jewel & Ornament",
    "ur": "زیور اور زیور۔"
  },
  {
    "en": "Jewels & Ornaments",
    "ur": "زیورات اور زیورات۔"
  },
  {
    "en": "Dua, go there.",
    "ur": "دعا وہاں جاؤ۔"
  },
  {
    "en": "Keep it wherever you want.",
    "ur": "جہاں چاہو رکھ لو۔"
  },
  {
    "en": "Key not in map.",
    "ur": "کلید نقشے میں نہیں ہے۔"
  },
  {
    "en": "Learn English Online",
    "ur": "انگریزی آن لائن سیکھیں۔"
  },
  {
    "en": "Learning English is easy.",
    "ur": "انگریزی سیکھنا آسان ہے۔"
  },
  {
    "en": "Legal and Trading Terms",
    "ur": "قانونی اور تجارتی شرائط۔"
  },
  {
    "en": "Let him go whatever he wants to go?",
    "ur": "اسے جانے دو جو وہ جانا چاہتا ہے؟"
  },
  {
    "en": "Let him say his words first.",
    "ur": "اسے پہلے اپنی بات کہنے دو۔"
  },
  {
    "en": "Let me get ready.",
    "ur": "مجھے تیار ہونے دو۔"
  },
  {
    "en": "Let's say that you didn't have money.",
    "ur": "مان لیں کہ آپ کے پاس پیسے نہیں تھے۔"
  },
  {
    "en": "May I help you?",
    "ur": "کیا میں آپ کی مدد کر سکتا ہوں؟"
  },
  {
    "en": "May I know the reason?",
    "ur": "کیا میں وجہ جان سکتا ہوں؟"
  },
  {
    "en": "May I know your name?",
    "ur": "کیا میں آپ کا نام جان سکتا ہوں؟"
  },
  {
    "en": "May I say something now.",
    "ur": "اب میں کچھ کہوں۔"
  },
  {
    "en": "May I talk to you privately?",
    "ur": "کیا میں آپ سے پرائیویٹ بات کر سکتا ہوں؟"
  },
  {
    "en": "May be he has gone.",
    "ur": "ہو سکتا ہے وہ چلا گیا ہو۔"
  },
  {
    "en": "May be they have reached before us.",
    "ur": "ہو سکتا ہے وہ ہم سے پہلے پہنچ گئے ہوں۔"
  },
  {
    "en": "Maybe missing child type",
    "ur": "شاید بچے کی قسم غائب ہے۔"
  },
  {
    "en": "Meg acquired many new friends.",
    "ur": "میگ نے بہت سے نئے دوست حاصل کئے۔"
  },
  {
    "en": "Member name too long",
    "ur": "ممبر کا نام بہت لمبا ہے۔"
  },
  {
    "en": "Member name too short",
    "ur": "ممبر کا نام بہت چھوٹا ہے۔"
  },
  {
    "en": "Mend your ways.",
    "ur": "اپنے طریقے ٹھیک کریں۔"
  },
  {
    "en": "Mind your language.",
    "ur": "اپنی زبان کا خیال رکھیں۔"
  },
  {
    "en": "Mobile is kept on the table.",
    "ur": "موبائل میز پر رکھا ہوا ہے۔"
  },
  {
    "en": "My job was just to tell you.",
    "ur": "میرا کام صرف آپ کو بتانا تھا۔"
  },
  {
    "en": "My left eye is twitching.",
    "ur": "میری بائیں آنکھ کانپ رہی ہے۔"
  },
  {
    "en": "My mom has forbidden me to go out.",
    "ur": "میری امی نے مجھے باہر جانے سے منع کیا ہے۔"
  },
  {
    "en": "My pen got broken.",
    "ur": "میرا قلم ٹوٹ گیا۔"
  },
  {
    "en": "My phone is ringing.",
    "ur": "میرا فون بج رہا ہے۔"
  },
  {
    "en": "Nobody can stop me.",
    "ur": "مجھے کوئی نہیں روک سکتا۔"
  },
  {
    "en": "Nobody can take your place.",
    "ur": "تمہاری جگہ کوئی نہیں لے سکتا۔"
  },
  {
    "en": "Nobody else did it.",
    "ur": "کسی اور نے نہیں کیا۔"
  },
  {
    "en": "Nothing has happened so far.",
    "ur": "اب تک کچھ نہیں ہوا۔"
  },
  {
    "en": "One day you will have to be ashamed.",
    "ur": "ایک دن شرمندہ ہونا پڑے گا۔"
  },
  {
    "en": "Operate the machine.",
    "ur": "مشین چلائیں۔"
  },
  {
    "en": "Parking is strictly prohibited here.",
    "ur": "یہاں پارکنگ سختی سے منع ہے۔"
  },
  {
    "en": "Peel off the potatoes.",
    "ur": "آلو کو چھیل لیں۔"
  },
  {
    "en": "Pen is on the table.",
    "ur": "قلم میز پر ہے۔"
  },
  {
    "en": "Penn versus Princeton",
    "ur": "پین بمقابلہ پرنسٹن۔"
  },
  {
    "en": "People come from far and wide to see the Taj Mahal.",
    "ur": "تاج محل دیکھنے کے لیے لوگ دور دور سے آتے ہیں۔"
  },
  {
    "en": "Please come here.",
    "ur": "براہِ کرم یہاں آئیں۔"
  },
  {
    "en": "Please come in.",
    "ur": "پلیز اندر آجائیں۔"
  },
  {
    "en": "Please don't be sad.",
    "ur": "پلیز اداس نہ ہوں۔"
  },
  {
    "en": "Please don't be upset.",
    "ur": "پلیز پریشان نہ ہوں۔"
  },
  {
    "en": "Please don't embarrass me.",
    "ur": "پلیز مجھے شرمندہ نہ کریں۔"
  },
  {
    "en": "Please speak slowly.",
    "ur": "براہ کرم آہستہ بولیں۔"
  },
  {
    "en": "Please think before you speak.",
    "ur": "براہ کرم بولنے سے پہلے سوچ لیں۔"
  },
  {
    "en": "Put on the shoes.",
    "ur": "جوتے پہن لو۔"
  },
  {
    "en": "Put on your shoes.",
    "ur": "اپنے جوتے پہن لو۔"
  },
  {
    "en": "Sahil is my brother.",
    "ur": "ساحل میرا بھائی ہے۔"
  },
  {
    "en": "Dua, come here.",
    "ur": "دعا، ادھر آؤ۔"
  },
  {
    "en": "Reach there before the time.",
    "ur": "وقت سے پہلے وہاں پہنچ جاؤ۔"
  },
  {
    "en": "See you the day after tomorrow.",
    "ur": "پرسوں ملتے ہیں۔"
  },
  {
    "en": "See you tomorrow.",
    "ur": "کل ملتے ہیں۔"
  },
  {
    "en": "Sender contains non-unique bus name",
    "ur": "مرسل غیر منفرد بس نام پر مشتمل ہے۔"
  },
  {
    "en": "Serve the food.",
    "ur": "کھانا پیش کریں۔"
  },
  {
    "en": "She achieved remarkable results.",
    "ur": "اس نے شاندار نتائج حاصل کیے۔"
  },
  {
    "en": "She acknowledged receiving assistance.",
    "ur": "اس نے مدد حاصل کرنے کا اعتراف کیا۔"
  },
  {
    "en": "She announced her intention to retire.",
    "ur": "اس نے ریٹائر ہونے کے اپنے ارادے کا اعلان کیا۔"
  },
  {
    "en": "She approached him with a smile on her face.",
    "ur": "وہ چہرے پر مسکراہٹ لیے اس کے قریب آیا۔"
  },
  {
    "en": "She attends school at night.",
    "ur": "وہ رات کو اسکول جاتی ہے۔"
  },
  {
    "en": "She began to laugh.",
    "ur": "وہ ہنسنے لگی۔"
  },
  {
    "en": "She began to work.",
    "ur": "وہ کام کرنے لگی۔"
  },
  {
    "en": "She drove past the supermarket.",
    "ur": "وہ سپر مارکیٹ سے گزر گئی۔"
  },
  {
    "en": "She had to rest before dinner",
    "ur": "اسے رات کے کھانے سے پہلے آرام کرنا تھا۔"
  },
  {
    "en": "She herself said this to me.",
    "ur": "یہ بات اس نے خود مجھ سے کہی تھی۔"
  },
  {
    "en": "She is beautiful.",
    "ur": "وہ خوبصورت ہے۔"
  },
  {
    "en": "She is looking for a suitable boy.",
    "ur": "وہ ایک موزوں لڑکے کی تلاش میں ہے۔"
  },
  {
    "en": "She is making me fool.",
    "ur": "وہ مجھے بے وقوف بنا رہی ہے۔"
  },
  {
    "en": "She is married and what's more she has two kids.",
    "ur": "وہ شادی شدہ ہے اور اس کے دو بچے ہیں۔"
  },
  {
    "en": "She is washing the clothes.",
    "ur": "وہ کپڑے دھو رہی ہے۔"
  },
  {
    "en": "She looks like you.",
    "ur": "وہ آپ جیسی لگتی ہے۔"
  },
  {
    "en": "She pretends to be crying.",
    "ur": "وہ رونے کا بہانہ کرتی ہے۔"
  },
  {
    "en": "She suffered from sunstroke.",
    "ur": "وہ سن اسٹروک کا شکار تھی۔"
  },
  {
    "en": "She wants to speak something else.",
    "ur": "وہ کچھ اور بولنا چاہتی ہے۔"
  },
  {
    "en": "She was about to weep.",
    "ur": "وہ رونے ہی والی تھی۔"
  },
  {
    "en": "She was late so she started making excuses.",
    "ur": "اسے دیر ہو گئی تھی اس لیے وہ بہانے بنانے لگی۔"
  },
  {
    "en": "She went from here while crying.",
    "ur": "وہ روتی ہوئی یہاں سے چلی گئی۔"
  },
  {
    "en": "Shortly after their marriage they moved to Colorado",
    "ur": "اپنی شادی کے کچھ عرصے بعد وہ کولوراڈو چلے گئے۔"
  },
  {
    "en": "Shouldn't we buy one more?",
    "ur": "کیا ہمیں ایک اور نہیں خریدنا چاہئے؟"
  },
  {
    "en": "Shut up! You don't know anything.",
    "ur": "چپ رہو! تم کچھ نہیں جانتے۔"
  },
  {
    "en": "Since when have you been standing here?",
    "ur": "کب سے یہاں کھڑے ہو؟"
  },
  {
    "en": "Socket Event Handler",
    "ur": "ساکٹ ایونٹ ہینڈلر۔"
  },
  {
    "en": "Socket has been closed",
    "ur": "ساکٹ بند کر دیا گیا ہے۔"
  },
  {
    "en": "Someone has stolen my money.",
    "ur": "کسی نے میرا پیسہ چوری کیا ہے۔"
  },
  {
    "en": "Stay connected with us!",
    "ur": "ہمارے ساتھ جڑے رہیں!"
  },
  {
    "en": "Stop thinking about him.",
    "ur": "اس کے بارے میں سوچنا چھوڑ دو۔"
  },
  {
    "en": "Switch off the AC.",
    "ur": "اے سی بند کر دیں۔"
  },
  {
    "en": "Switch on the T.V.",
    "ur": "T.V آن کریں۔"
  },
  {
    "en": "Switch on the machine.",
    "ur": "مشین آن کریں۔"
  },
  {
    "en": "Take it outside.",
    "ur": "اسے باہر لے جاؤ۔"
  },
  {
    "en": "Take off the shoes.",
    "ur": "جوتے اتار دو۔"
  },
  {
    "en": "Take off your shoes.",
    "ur": "اپنے جوتے اتار دو۔"
  },
  {
    "en": "Tea is getting cold.",
    "ur": "چائے ٹھنڈی ہو رہی ہے۔"
  },
  {
    "en": "Tell me one thing.",
    "ur": "ایک بات بتاؤ۔"
  },
  {
    "en": "Tell me where to go!",
    "ur": "بتاؤ کہاں جانا ہے!"
  },
  {
    "en": "Telling a lie is a sin.",
    "ur": "جھوٹ بولنا گناہ ہے۔"
  },
  {
    "en": "That movie was scary.",
    "ur": "وہ فلم خوفناک تھی۔"
  },
  {
    "en": "That's the spirit!",
    "ur": "یہی روح ہے!"
  },
  {
    "en": "That's whom I am searching.",
    "ur": "اسی کو میں تلاش کر رہا ہوں۔"
  },
  {
    "en": "That's why I am asking you.",
    "ur": "اس لیے میں آپ سے پوچھ رہا ہوں۔"
  },
  {
    "en": "That's why I am going.",
    "ur": "اس لیے میں جا رہا ہوں۔"
  },
  {
    "en": "That's why I am learning English.",
    "ur": "اس لیے میں انگریزی سیکھ رہا ہوں۔"
  },
  {
    "en": "That's why I am speaking this.",
    "ur": "اس لیے میں یہ بات کر رہا ہوں۔"
  },
  {
    "en": "That's why I didn't invite you.",
    "ur": "اسی لیے میں نے آپ کو مدعو نہیں کیا۔"
  },
  {
    "en": "The ball bounced across the road.",
    "ur": "گیند سڑک کے پار اچھال گئی۔"
  },
  {
    "en": "The ball is Far from the box.",
    "ur": "گیند باکس سے بہت دور ہے۔"
  },
  {
    "en": "The ball is above the box.",
    "ur": "گیند باکس کے اوپر ہے۔"
  },
  {
    "en": "The ball is among the boxes.",
    "ur": "گیند خانوں کے درمیان ہے۔"
  },
  {
    "en": "The ball is behind the box.",
    "ur": "گیند باکس کے پیچھے ہے۔"
  },
  {
    "en": "The ball is below the brown box.",
    "ur": "گیند براؤن باکس کے نیچے ہے۔"
  },
  {
    "en": "The ball is between the boxes.",
    "ur": "گیند خانوں کے درمیان ہے۔"
  },
  {
    "en": "The ball is bouncing into the box.",
    "ur": "گیند باکس میں اچھال رہی ہے۔"
  },
  {
    "en": "The ball is bouncing onto the box.",
    "ur": "گیند باکس پر اچھال رہی ہے۔"
  },
  {
    "en": "The ball is bouncing over the box.",
    "ur": "گیند باکس کے اوپر اچھال رہی ہے۔"
  },
  {
    "en": "The ball is in front of the box.",
    "ur": "گیند باکس کے سامنے ہے۔"
  },
  {
    "en": "The ball is in the box.",
    "ur": "گیند باکس میں ہے۔"
  },
  {
    "en": "The ball is near the box.",
    "ur": "گیند باکس کے قریب ہے۔"
  },
  {
    "en": "The ball is next to the box.",
    "ur": "گیند باکس کے آگے ہے۔"
  },
  {
    "en": "The ball is on the box.",
    "ur": "گیند باکس پر ہے۔"
  },
  {
    "en": "The ball is rolling along the black line.",
    "ur": "گیند سیاہ لکیر کے ساتھ گھوم رہی ہے۔"
  },
  {
    "en": "The ball is rolling around the box.",
    "ur": "گیند باکس کے گرد گھوم رہی ہے۔"
  },
  {
    "en": "The ball is rolling away from the box.",
    "ur": "گیند باکس سے دور جا رہی ہے۔"
  },
  {
    "en": "The ball is rolling down the stairs.",
    "ur": "گیند سیڑھیوں سے نیچے گر رہی ہے۔"
  },
  {
    "en": "The ball is rolling off the box.",
    "ur": "گیند باکس سے باہر نکل رہی ہے۔"
  },
  {
    "en": "The ball is rolling through the hole in the tube.",
    "ur": "گیند ٹیوب کے سوراخ سے گھوم رہی ہے۔"
  },
  {
    "en": "The ball is rolling towards the box.",
    "ur": "گیند باکس کی طرف بڑھ رہی ہے۔"
  },
  {
    "en": "The ball is rolling under the box.",
    "ur": "گیند باکس کے نیچے گھوم رہی ہے۔"
  },
  {
    "en": "The ball is rolling up the stairs.",
    "ur": "گیند سیڑھیاں چڑھ رہی ہے۔"
  },
  {
    "en": "The ball is under the box.",
    "ur": "گیند باکس کے نیچے ہے۔"
  },
  {
    "en": "The chair is broken.",
    "ur": "کرسی ٹوٹ گئی ہے۔"
  },
  {
    "en": "The children go to bed at nine o'clock",
    "ur": "بچے نو بجے بستر پر چلے جاتے ہیں۔"
  },
  {
    "en": "The children went to school.",
    "ur": "بچے سکول گئے۔"
  },
  {
    "en": "The entire world knows him.",
    "ur": "ساری دنیا اسے جانتی ہے۔"
  },
  {
    "en": "The examination is going on.",
    "ur": "امتحان جاری ہے۔"
  },
  {
    "en": "The fan is blowing hot air.",
    "ur": "پنکھا گرم ہوا اڑا رہا ہے۔"
  },
  {
    "en": "The fan is too noisy.",
    "ur": "پنکھا بہت شور کر رہا ہے۔"
  },
  {
    "en": "The matter has become serious.",
    "ur": "معاملہ سنگین ہو گیا ہے۔"
  },
  {
    "en": "The null object does not have a",
    "ur": "null آبجیکٹ میں a نہیں ہے۔"
  },
  {
    "en": "The phone is ringing.",
    "ur": "فون بج رہا ہے۔"
  },
  {
    "en": "The power has gone off.",
    "ur": "بجلی چلی گئی ہے۔"
  },
  {
    "en": "The restaurant is open during the day",
    "ur": "ریستوراں دن کے وقت کھلا رہتا ہے۔"
  },
  {
    "en": "The show will run from 10 to 2",
    "ur": "شو 10 سے 2 تک چلے گا۔"
  },
  {
    "en": "The sky is overcast.",
    "ur": "آسمان ابر آلود ہے۔"
  },
  {
    "en": "The sun has not set.",
    "ur": "سورج غروب نہیں ہوا۔"
  },
  {
    "en": "The thing is that I don't want to go there.",
    "ur": "بات یہ ہے کہ میں وہاں نہیں جانا چاہتا۔"
  },
  {
    "en": "The train is coming.",
    "ur": "ٹرین آ رہی ہے۔"
  },
  {
    "en": "The type parameter is not nullable",
    "ur": "قسم کا پیرامیٹر کالعدم نہیں ہے۔"
  },
  {
    "en": "The water is dirty.",
    "ur": "پانی گندا ہے۔"
  },
  {
    "en": "Then at last he did my work.",
    "ur": "پھر آخر کار اس نے میرا کام کر دیا۔"
  },
  {
    "en": "There is a limit to everything.",
    "ur": "ہر چیز کی ایک حد ہوتی ہے۔"
  },
  {
    "en": "There is a very little chance.",
    "ur": "بہت کم موقع ہے۔"
  },
  {
    "en": "There is no need to go.",
    "ur": "جانے کی ضرورت نہیں ہے۔"
  },
  {
    "en": "There is no need to threaten him.",
    "ur": "اسے دھمکی دینے کی ضرورت نہیں۔"
  },
  {
    "en": "There is nothing like that I have hidden from you.",
    "ur": "ایسا کچھ نہیں ہے جو میں نے تم سے چھپایا ہو۔"
  },
  {
    "en": "There is nothing special.",
    "ur": "کوئی خاص بات نہیں ہے۔"
  },
  {
    "en": "These are mine.",
    "ur": "یہ میرے ہیں۔"
  },
  {
    "en": "These are my recent photos.",
    "ur": "یہ میری حالیہ تصاویر ہیں۔"
  },
  {
    "en": "These are tears of joy.",
    "ur": "یہ خوشی کے آنسو ہیں۔"
  },
  {
    "en": "They are addicted to alcohol.",
    "ur": "وہ شراب کے عادی ہیں۔"
  },
  {
    "en": "They began to run.",
    "ur": "وہ بھاگنے لگے۔"
  },
  {
    "en": "They had no right to torture me.",
    "ur": "انہیں مجھ پر تشدد کرنے کا کوئی حق نہیں تھا۔"
  },
  {
    "en": "Think about it.",
    "ur": "اس کے بارے میں سوچو۔"
  },
  {
    "en": "Think before you speak.",
    "ur": "بولنے سے پہلے سوچ لو۔"
  },
  {
    "en": "This cloth is of inferior quality.",
    "ur": "یہ کپڑا کمتر معیار کا ہے۔"
  },
  {
    "en": "This fan is useless.",
    "ur": "یہ پنکھا بیکار ہے۔"
  },
  {
    "en": "This is a good excuse.",
    "ur": "یہ ایک اچھا بہانہ ہے۔"
  },
  {
    "en": "This is an illegal act.",
    "ur": "یہ ایک غیر قانونی عمل ہے۔"
  },
  {
    "en": "This is my final warning to you.",
    "ur": "یہ آپ کو میری آخری وارننگ ہے۔"
  },
  {
    "en": "This is not fair.",
    "ur": "یہ منصفانہ نہیں ہے۔"
  },
  {
    "en": "This is not the purpose of my life.",
    "ur": "یہ میری زندگی کا مقصد نہیں ہے۔"
  },
  {
    "en": "This is not yours.",
    "ur": "یہ تمہارا نہیں ہے۔"
  },
  {
    "en": "This is our ancestral house.",
    "ur": "یہ ہمارا آبائی گھر ہے۔"
  },
  {
    "en": "This is pure water.",
    "ur": "یہ خالص پانی ہے۔"
  },
  {
    "en": "This is someone else.",
    "ur": "یہ کوئی اور ہے۔"
  },
  {
    "en": "This is something else.",
    "ur": "یہ کچھ اور ہے۔"
  },
  {
    "en": "This is what I wanted to listen.",
    "ur": "میں یہی سننا چاہتا تھا۔"
  },
  {
    "en": "This is what I wanted to say.",
    "ur": "میں یہی کہنا چاہتا تھا۔"
  },
  {
    "en": "This mobile is mine.",
    "ur": "یہ موبائل میرا ہے۔"
  },
  {
    "en": "This mobile is yours.",
    "ur": "یہ موبائل آپ کا ہے۔"
  },
  {
    "en": "This much anger is not good.",
    "ur": "اتنا غصہ اچھا نہیں ہے۔"
  },
  {
    "en": "This phone's touch is not working.",
    "ur": "اس فون کا ٹچ کام نہیں کر رہا ہے۔"
  },
  {
    "en": "This place is not suitable for living.",
    "ur": "یہ جگہ رہنے کے لیے موزوں نہیں ہے۔"
  },
  {
    "en": "This ticker was canceled:",
    "ur": "یہ ٹکر منسوخ کر دیا گیا:۔"
  },
  {
    "en": "Timer interface not supported.",
    "ur": "ٹائمر انٹرفیس تعاون یافتہ نہیں ہے۔"
  },
  {
    "en": "To hell your money.",
    "ur": "جہنم میں آپ کے پیسے۔"
  },
  {
    "en": "Today is holiday.",
    "ur": "آج چھٹی ہے۔"
  },
  {
    "en": "Ali accused me of lying.",
    "ur": "علی نے مجھ پر جھوٹ بولنے کا الزام لگایا۔"
  },
  {
    "en": "Madeen applied for a leave of absence.",
    "ur": "مدین نے غیر حاضری کی چھٹی کے لیے درخواست دی۔"
  },
  {
    "en": "Dua awoke at daybreak.",
    "ur": "دعا صبح کے وقت بیدار ہوئی۔"
  },
  {
    "en": "Ali baked some muffins.",
    "ur": "علی نے کچھ مفنز پکائے۔"
  },
  {
    "en": "Ali certainly attracted a lot of attention.",
    "ur": "علی نے یقینی طور پر بہت زیادہ توجہ مبذول کروائی۔"
  },
  {
    "en": "Tomorrow is my birthday.",
    "ur": "کل میری سالگرہ ہے۔"
  },
  {
    "en": "Too few elements",
    "ur": "بہت کم عناصر۔"
  },
  {
    "en": "Too many elements",
    "ur": "بہت زیادہ عناصر۔"
  },
  {
    "en": "Tree & their part",
    "ur": "درخت اور ان کا حصہ۔"
  },
  {
    "en": "Tree & their parts",
    "ur": "درخت اور ان کے حصے۔"
  },
  {
    "en": "Tried to show ad before available.",
    "ur": "دستیاب ہونے سے پہلے اشتہار دکھانے کی کوشش کی۔"
  },
  {
    "en": "Tried to show ad while already showing an ad.",
    "ur": "پہلے ہی اشتہار دکھاتے ہوئے اشتہار دکھانے کی کوشش کی۔"
  },
  {
    "en": "Try to understand.",
    "ur": "سمجھنے کی کوشش کریں۔"
  },
  {
    "en": "Wake me up early in the morning.",
    "ur": "مجھے صبح سویرے جگا دو۔"
  },
  {
    "en": "Was he arguing with you?",
    "ur": "کیا وہ آپ سے بحث کر رہا تھا؟"
  },
  {
    "en": "We aim to increase the speed of delivery.",
    "ur": "ہمارا مقصد ترسیل کی رفتار کو بڑھانا ہے۔"
  },
  {
    "en": "We are going to coaching.",
    "ur": "ہم کوچنگ کے لیے جا رہے ہیں۔"
  },
  {
    "en": "We are in a hurry.",
    "ur": "ہم جلدی میں ہیں۔"
  },
  {
    "en": "We arrived home late.",
    "ur": "ہم دیر سے گھر پہنچے۔"
  },
  {
    "en": "We arrived safe and sound.",
    "ur": "ہم صحیح سلامت پہنچ گئے۔"
  },
  {
    "en": "We didn't go there.",
    "ur": "ہم وہاں نہیں گئے۔"
  },
  {
    "en": "We have lost our way.",
    "ur": "ہم اپنا راستہ کھو چکے ہیں۔"
  },
  {
    "en": "We will manage somehow.",
    "ur": "ہم کسی نہ کسی طرح انتظام کر لیں گے۔"
  },
  {
    "en": "We will talk about this some other time.",
    "ur": "اس پر ہم کسی اور وقت بات کریں گے۔"
  },
  {
    "en": "We will win for sure.",
    "ur": "ہم یقینی طور پر جیتیں گے۔"
  },
  {
    "en": "Were you thinking about me?",
    "ur": "کیا تم میرے بارے میں سوچ رہے تھے؟"
  },
  {
    "en": "What a fragrance?",
    "ur": "کیا خوشبو ہے؟"
  },
  {
    "en": "What are you doing?",
    "ur": "کیا کر رہے ہو؟"
  },
  {
    "en": "What are you looking for?",
    "ur": "آپ کیا ڈھونڈ رہے ہیں؟"
  },
  {
    "en": "What are you reading?",
    "ur": "کیا پڑھ رہے ہو؟"
  },
  {
    "en": "What are you thinking?",
    "ur": "کیا سوچ رہے ہو؟"
  },
  {
    "en": "What are you trying to do?",
    "ur": "آپ کیا کرنے کی کوشش کر رہے ہیں؟"
  },
  {
    "en": "What became of my money?",
    "ur": "میرے پیسوں کا کیا ہوا؟"
  },
  {
    "en": "What brings you here?",
    "ur": "آپ کو یہاں کیا لایا ہے؟"
  },
  {
    "en": "What did he say to you?",
    "ur": "اس نے تم سے کیا کہا؟"
  },
  {
    "en": "What did you do?",
    "ur": "تم نے کیا کیا؟"
  },
  {
    "en": "What did you eat?",
    "ur": "کیا کھایا؟"
  },
  {
    "en": "What did you say?",
    "ur": "کیا کہا؟"
  },
  {
    "en": "What did you see?",
    "ur": "کیا دیکھا؟"
  },
  {
    "en": "What did you tell him?",
    "ur": "تم نے اسے کیا بتایا؟"
  },
  {
    "en": "What do you have?",
    "ur": "آپ کے پاس کیا ہے؟"
  },
  {
    "en": "What do you like?",
    "ur": "آپ کو کیا پسند ہے؟"
  },
  {
    "en": "What do you mean?",
    "ur": "آپ کا کیا مطلب ہے؟"
  },
  {
    "en": "What do you think I am?",
    "ur": "تمہیں کیا لگتا ہے میں ہوں؟"
  },
  {
    "en": "What do you think of yourself?",
    "ur": "آپ اپنے آپ کو کیا سمجھتے ہیں؟"
  },
  {
    "en": "What do you think?",
    "ur": "آپ کا کیا خیال ہے؟"
  },
  {
    "en": "What do you want to eat?",
    "ur": "آپ کیا کھانا چاہتے ہیں؟"
  },
  {
    "en": "What do you want?",
    "ur": "تم کیا چاہتے ہو؟"
  },
  {
    "en": "What does it mean?",
    "ur": "اس کا کیا مطلب ہے؟"
  },
  {
    "en": "What does she like?",
    "ur": "وہ کیا پسند کرتی ہے؟"
  },
  {
    "en": "What don't you have?",
    "ur": "آپ کے پاس کیا نہیں ہے؟"
  },
  {
    "en": "What gift have you brought for me?",
    "ur": "میرے لیے کیا تحفہ لائے ہو؟"
  },
  {
    "en": "What goes to see.",
    "ur": "کیا دیکھنے جاتا ہے۔"
  },
  {
    "en": "What happened next?",
    "ur": "آگے کیا ہوا؟"
  },
  {
    "en": "What happened that you denied?",
    "ur": "کیا ہوا کہ تم نے انکار کیا؟"
  },
  {
    "en": "What happened to you?",
    "ur": "تمہیں کیا ہوا؟"
  },
  {
    "en": "What have you done?",
    "ur": "تم نے کیا کیا ہے؟"
  },
  {
    "en": "What have you made?",
    "ur": "تم نے کیا بنایا ہے؟"
  },
  {
    "en": "What have you thought?",
    "ur": "تم نے کیا سوچا ہے؟"
  },
  {
    "en": "What is happening?",
    "ur": "کیا ہو رہا ہے؟"
  },
  {
    "en": "What is he doing?",
    "ur": "وہ کیا کر رہا ہے؟"
  },
  {
    "en": "What is his/her fault in it?",
    "ur": "اس میں اس کا کیا قصور؟"
  },
  {
    "en": "What is in your mind?",
    "ur": "آپ کے دماغ میں کیا ہے؟"
  },
  {
    "en": "What is my fault in it?",
    "ur": "اس میں میرا کیا قصور؟"
  },
  {
    "en": "What is the date today?",
    "ur": "آج کیا تاریخ ہے؟"
  },
  {
    "en": "What is the matter?",
    "ur": "کیا بات ہے؟"
  },
  {
    "en": "What is the reason?",
    "ur": "وجہ کیا ہے؟"
  },
  {
    "en": "What is the time?",
    "ur": "کیا وقت ہے؟"
  },
  {
    "en": "What is your fault in it?",
    "ur": "اس میں تمہارا کیا قصور؟"
  },
  {
    "en": "What is your loss in it?,",
    "ur": "اس میں تمہارا کیا نقصان ہے۔"
  },
  {
    "en": "What kind of question is this?",
    "ur": "یہ کس قسم کا سوال ہے؟"
  },
  {
    "en": "What should I do?",
    "ur": "میں کیا کروں؟"
  },
  {
    "en": "What time will you come tomorrow?",
    "ur": "کل کتنے بجے آؤ گے؟"
  },
  {
    "en": "What to do next?",
    "ur": "آگے کیا کرنا ہے؟"
  },
  {
    "en": "What type of movies do you like?",
    "ur": "آپ کو کس قسم کی فلمیں پسند ہیں؟"
  },
  {
    "en": "What was the need to go there?",
    "ur": "وہاں جانے کی کیا ضرورت تھی؟"
  },
  {
    "en": "What will happen by meeting?",
    "ur": "ملاقات سے کیا ہوگا؟"
  },
  {
    "en": "What would you like to have?",
    "ur": "آپ کیا حاصل کرنا چاہیں گے؟"
  },
  {
    "en": "What's going on?",
    "ur": "یہ کیا ہو رہا ہے؟"
  },
  {
    "en": "What's so special in her?",
    "ur": "اس میں کیا خاص بات ہے؟"
  },
  {
    "en": "What's so special in it?",
    "ur": "اس میں کیا خاص بات ہے؟"
  },
  {
    "en": "What's the rush, join us for dinner.",
    "ur": "کیا رش ہے، رات کے کھانے میں ہمارے ساتھ شامل ہوں۔"
  },
  {
    "en": "What's there to cry?",
    "ur": "رونے کی کیا بات ہے؟"
  },
  {
    "en": "What's there to shy?",
    "ur": "اس میں شرمانے کی کیا بات ہے؟"
  },
  {
    "en": "What's up these days?",
    "ur": "ان دنوں کیا ہو رہا ہے؟"
  },
  {
    "en": "What's wrong with you?",
    "ur": "آپ کے ساتھ کیا مسئلہ ہے؟"
  },
  {
    "en": "When are you coming back?",
    "ur": "تم کب واپس آ رہے ہو؟"
  },
  {
    "en": "When did I abuse him?",
    "ur": "میں نے کب اسے گالی دی؟"
  },
  {
    "en": "When did it happen?",
    "ur": "یہ کب ہوا؟"
  },
  {
    "en": "When did you come?",
    "ur": "تم کب آئے؟"
  },
  {
    "en": "When did you meet him last time?",
    "ur": "آپ اس سے آخری بار کب ملے تھے؟"
  },
  {
    "en": "When did you return from Canada?",
    "ur": "آپ کینیڈا سے کب واپس آئے؟"
  },
  {
    "en": "When do you get up at morning?",
    "ur": "آپ صبح کب اٹھتے ہیں؟"
  },
  {
    "en": "When have they gone?",
    "ur": "وہ کب گئے ہیں؟"
  },
  {
    "en": "When is your birthday?",
    "ur": "آپ کی سالگرہ کب ہے؟"
  },
  {
    "en": "When will I get my passport?",
    "ur": "مجھے اپنا پاسپورٹ کب ملے گا؟"
  },
  {
    "en": "When will he come?",
    "ur": "وہ کب آئے گا؟"
  },
  {
    "en": "When will the next train come?",
    "ur": "اگلی ٹرین کب آئے گی؟"
  },
  {
    "en": "When will you return the money?",
    "ur": "آپ پیسے کب واپس کریں گے؟"
  },
  {
    "en": "When will you return?",
    "ur": "کب لوٹو گے؟"
  },
  {
    "en": "Where are you from?",
    "ur": "آپ کہاں سے ہیں؟"
  },
  {
    "en": "Where did he read?",
    "ur": "اس نے کہاں پڑھا؟"
  },
  {
    "en": "Where did it hurt?",
    "ur": "کہاں تکلیف ہوئی؟"
  },
  {
    "en": "Where did you get it from?",
    "ur": "آپ کو یہ کہاں سے ملا؟"
  },
  {
    "en": "Where did you get my number from?",
    "ur": "آپ کو میرا نمبر کہاں سے ملا؟"
  },
  {
    "en": "Where did you go?",
    "ur": "کہاں گئے تھے؟"
  },
  {
    "en": "Where do you want to go?",
    "ur": "آپ کہاں جانا چاہتے ہیں؟"
  },
  {
    "en": "Where does this road go to?",
    "ur": "یہ سڑک کہاں جاتی ہے؟"
  },
  {
    "en": "Where has he gone?",
    "ur": "وہ کہاں چلا گیا ہے؟"
  },
  {
    "en": "Where has she gone?",
    "ur": "وہ کہاں چلی گئی ہے؟"
  },
  {
    "en": "Where have they gone?",
    "ur": "وہ کہاں گئے ہیں؟"
  },
  {
    "en": "Where have you come from?",
    "ur": "کہاں سے آئے ہو؟"
  },
  {
    "en": "Where have you to go?",
    "ur": "آپ نے کہاں جانا ہے؟"
  },
  {
    "en": "Where is he right now?",
    "ur": "وہ اس وقت کہاں ہے؟"
  },
  {
    "en": "Where is your attention?",
    "ur": "آپ کی توجہ کہاں ہے؟"
  },
  {
    "en": "Where were you?",
    "ur": "تم کہاں تھے؟"
  },
  {
    "en": "Where will you go now?",
    "ur": "اب کہاں جائیں گے؟"
  },
  {
    "en": "Whether you go or not, I will.",
    "ur": "تم جاؤ یا نہ جاؤ، میں جاؤں گا۔"
  },
  {
    "en": "Which city are you from?",
    "ur": "آپ کس شہر سے ہیں؟"
  },
  {
    "en": "Which city are you in?",
    "ur": "آپ کس شہر میں ہیں؟"
  },
  {
    "en": "Which college are you from?",
    "ur": "آپ کس کالج سے ہیں؟"
  },
  {
    "en": "Which doctor did you consult?",
    "ur": "آپ نے کس ڈاکٹر سے مشورہ کیا؟"
  },
  {
    "en": "Which one do you want?",
    "ur": "آپ کون سا چاہتے ہیں؟"
  },
  {
    "en": "Which soap do you use?",
    "ur": "آپ کون سا صابن استعمال کرتے ہیں؟"
  },
  {
    "en": "Who all are there?",
    "ur": "وہاں سب کون ہیں؟"
  },
  {
    "en": "Who all were with you?",
    "ur": "آپ کے ساتھ کون کون تھے؟"
  },
  {
    "en": "Who called him?",
    "ur": "اسے کس نے بلایا؟"
  },
  {
    "en": "Who do you want to meet?",
    "ur": "آپ کس سے ملنا چاہتے ہیں؟"
  },
  {
    "en": "Who gave you my number?",
    "ur": "آپ کو میرا نمبر کس نے دیا؟"
  },
  {
    "en": "Who has money?0",
    "ur": "کس کے پاس پیسہ ہے؟ 0۔"
  },
  {
    "en": "Who is at the door?",
    "ur": "دروازے پر کون ہے؟"
  },
  {
    "en": "Who is he to you?",
    "ur": "وہ آپ کے لیے کون ہے؟"
  },
  {
    "en": "Who is speaking?",
    "ur": "کون بول رہا ہے؟"
  },
  {
    "en": "Who wants to meet me?",
    "ur": "کون مجھ سے ملنا چاہتا ہے؟"
  },
  {
    "en": "Whom are you talking about?",
    "ur": "آپ کس کی بات کر رہے ہیں؟"
  },
  {
    "en": "Whom were you talking?",
    "ur": "کس سے بات کر رہے تھے؟"
  },
  {
    "en": "Whose is that house?",
    "ur": "وہ گھر کس کا ہے؟"
  },
  {
    "en": "Whose mobile is this?",
    "ur": "یہ کس کا موبائل ہے؟"
  },
  {
    "en": "Whose number is this.",
    "ur": "یہ کس کا نمبر ہے۔"
  },
  {
    "en": "Whose side are you on?",
    "ur": "آپ کس کی طرف ہیں؟"
  },
  {
    "en": "Whose turn is now?",
    "ur": "اب کس کی باری ہے؟"
  },
  {
    "en": "Why are you blushing?",
    "ur": "آپ شرما کیوں رہے ہیں؟"
  },
  {
    "en": "Why are you insisting unnecessarily?",
    "ur": "آپ غیر ضروری اصرار کیوں کر رہے ہیں؟"
  },
  {
    "en": "Why are you jealous of me?",
    "ur": "تم مجھ سے کیوں جلتے ہو؟"
  },
  {
    "en": "Why are you limping?",
    "ur": "کیوں لنگڑا رہے ہو؟"
  },
  {
    "en": "Why are you sad?",
    "ur": "تم اداس کیوں ہو؟"
  },
  {
    "en": "Why are you smiling?",
    "ur": "کیوں مسکرا رہے ہو؟"
  },
  {
    "en": "Why are you so angry?",
    "ur": "آپ اتنے غصے میں کیوں ہیں؟"
  },
  {
    "en": "Why are you so upset?",
    "ur": "تم اتنے پریشان کیوں ہو؟"
  },
  {
    "en": "Why are you standing?",
    "ur": "کیوں کھڑے ہو؟"
  },
  {
    "en": "Why are you walking backwards?",
    "ur": "پیچھے کیوں چل رہے ہو؟"
  },
  {
    "en": "Why did you agree to meet her in the first place?",
    "ur": "آپ نے پہلے اس سے ملنے کا اتفاق کیوں کیا؟"
  },
  {
    "en": "Why did you do this without asking me?",
    "ur": "تم نے مجھ سے پوچھے بغیر ایسا کیوں کیا؟"
  },
  {
    "en": "Why did you say that?",
    "ur": "تم نے ایسا کیوں کہا؟"
  },
  {
    "en": "Why didn't you apologize to her?",
    "ur": "تم نے اس سے معافی کیوں نہیں مانگی؟"
  },
  {
    "en": "Why do you always try to humiliate me?",
    "ur": "کیوں ہر وقت مجھے ذلیل کرنے کی کوشش کرتے ہو؟"
  },
  {
    "en": "Why do you snore so much?",
    "ur": "آپ اتنے خراٹے کیوں لیتے ہیں؟"
  },
  {
    "en": "Why had he to go?",
    "ur": "اسے کیوں جانا پڑا؟"
  },
  {
    "en": "Why have you done so?",
    "ur": "تم نے ایسا کیوں کیا ہے؟"
  },
  {
    "en": "Why were you looking for me?",
    "ur": "تم مجھے کیوں ڈھونڈ رہے تھے؟"
  },
  {
    "en": "Will you do one thing?",
    "ur": "ایک کام کرو گے؟"
  },
  {
    "en": "Would you like some tea?",
    "ur": "کیا آپ چائے پسند کریں گے؟"
  },
  {
    "en": "Would you please stand up?",
    "ur": "کیا آپ براہ مہربانی کھڑے ہو جائیں گے؟"
  },
  {
    "en": "Yes, I can hear you.",
    "ur": "ہاں، میں آپ کو سن سکتا ہوں۔"
  },
  {
    "en": "You are coward.",
    "ur": "تم بزدل ہو۔"
  },
  {
    "en": "You are egoistic.",
    "ur": "تم انا پرست ہو۔"
  },
  {
    "en": "You are everything for me.",
    "ur": "تم میرے لیے سب کچھ ہو۔"
  },
  {
    "en": "You are getting slimmer day by day.",
    "ur": "آپ دن بدن پتلے ہوتے جارہے ہیں۔"
  },
  {
    "en": "You are looking very happy, what is the matter?",
    "ur": "تم بہت خوش لگ رہی ہو، کیا بات ہے؟"
  },
  {
    "en": "You are my age.",
    "ur": "تم میری عمر کے ہو۔"
  },
  {
    "en": "You are my close friend.",
    "ur": "تم میرے قریبی دوست ہو۔"
  },
  {
    "en": "You are not reliable.",
    "ur": "آپ قابل اعتماد نہیں ہیں۔"
  },
  {
    "en": "You are responsible for that.",
    "ur": "آپ اس کے ذمہ دار ہیں۔"
  },
  {
    "en": "You are right up to some point.",
    "ur": "آپ کسی حد تک درست ہیں۔"
  },
  {
    "en": "You are so lazy.",
    "ur": "آپ بہت سست ہیں۔"
  },
  {
    "en": "You are so stubborn.",
    "ur": "تم بہت ضدی ہو۔"
  },
  {
    "en": "You are taking me wrong.",
    "ur": "آپ مجھے غلط لے رہے ہیں۔"
  },
  {
    "en": "You are very forgetful.",
    "ur": "تم بہت بھولے ہو۔"
  },
  {
    "en": "You ask too many questions.",
    "ur": "آپ بہت سارے سوالات پوچھتے ہیں۔"
  },
  {
    "en": "You begin to weep.",
    "ur": "آپ رونا شروع کر دیں۔"
  },
  {
    "en": "You can order anything at sitting home.",
    "ur": "آپ گھر بیٹھے کچھ بھی آرڈر کر سکتے ہیں۔"
  },
  {
    "en": "You can't escape from this.",
    "ur": "آپ اس سے بچ نہیں سکتے۔"
  },
  {
    "en": "You can't hide anything from me.",
    "ur": "تم مجھ سے کچھ چھپا نہیں سکتے۔"
  },
  {
    "en": "You did a good job.",
    "ur": "آپ نے اچھا کام کیا۔"
  },
  {
    "en": "You did it intentionally.",
    "ur": "تم نے جان بوجھ کر ایسا کیا۔"
  },
  {
    "en": "You did this deliberately.",
    "ur": "تم نے یہ جان بوجھ کر کیا۔"
  },
  {
    "en": "You didn't cater me the tea today.",
    "ur": "آج تم نے مجھے چائے نہیں پلائی۔"
  },
  {
    "en": "You didn't pick my call.",
    "ur": "تم نے میری کال نہیں اٹھائی۔"
  },
  {
    "en": "You don't need to take tension about anything.",
    "ur": "آپ کو کسی بھی چیز کے بارے میں ٹینشن لینے کی ضرورت نہیں ہے۔"
  },
  {
    "en": "You had no right on that thing.",
    "ur": "اس چیز پر تمہارا کوئی حق نہیں تھا۔"
  },
  {
    "en": "You had started.",
    "ur": "آپ نے شروع کر دیا تھا۔"
  },
  {
    "en": "You have been talking nonsense since morning.",
    "ur": "تم صبح سے فضول باتیں کر رہے ہو۔"
  },
  {
    "en": "You have cheap mentality.",
    "ur": "آپ سستی ذہنیت رکھتے ہیں۔"
  },
  {
    "en": "You have dialed the wrong number.",
    "ur": "آپ نے غلط نمبر ڈائل کیا ہے۔"
  },
  {
    "en": "You have done a great job.",
    "ur": "آپ نے بہت اچھا کام کیا ہے۔"
  },
  {
    "en": "You have made it your habit.",
    "ur": "تم نے اسے اپنی عادت بنا لیا ہے۔"
  },
  {
    "en": "You have no right on this.",
    "ur": "اس پر تمہارا کوئی حق نہیں ہے۔"
  },
  {
    "en": "You have nothing to say.",
    "ur": "آپ کے پاس کہنے کو کچھ نہیں ہے۔"
  },
  {
    "en": "You have screwed up everything.",
    "ur": "تم نے سب کچھ بگاڑ دیا ہے۔"
  },
  {
    "en": "You have started speaking more than enough.",
    "ur": "آپ نے ضرورت سے زیادہ بولنا شروع کر دیا ہے۔"
  },
  {
    "en": "You have to go.",
    "ur": "آپ کو جانا پڑے گا۔"
  },
  {
    "en": "You keep saying the same thing all the time.",
    "ur": "آپ ہر وقت ایک ہی بات کہتے رہتے ہیں۔"
  },
  {
    "en": "You need to attach your photo to the application form.",
    "ur": "آپ کو درخواست فارم کے ساتھ اپنی تصویر منسلک کرنے کی ضرورت ہے۔"
  },
  {
    "en": "You should be ashamed of yourself.",
    "ur": "آپ کو اپنے آپ پر شرم آنی چاہیے۔"
  },
  {
    "en": "You should be ashamed.",
    "ur": "تمہیں شرم آنی چاہیے۔"
  },
  {
    "en": "You should give up this habit.",
    "ur": "آپ کو یہ عادت چھوڑنی چاہیے۔"
  },
  {
    "en": "You should have done it much earlier.",
    "ur": "آپ کو یہ بہت پہلے کرنا چاہیے تھا۔"
  },
  {
    "en": "You should have patience.",
    "ur": "آپ کو صبر کرنا چاہیے۔"
  },
  {
    "en": "You should have stayed away from him.",
    "ur": "تمہیں اس سے دور رہنا چاہیے تھا۔"
  },
  {
    "en": "You should learn English and what's more you should practice also.",
    "ur": "آپ کو انگریزی سیکھنی چاہیے اور اس کے علاوہ آپ کو مشق بھی کرنی چاہیے۔"
  },
  {
    "en": "You should take medicines at the time.",
    "ur": "آپ کو اس وقت دوائیں لینا چاہئے۔"
  },
  {
    "en": "You shouldn't have gone there.",
    "ur": "تمہیں وہاں نہیں جانا چاہیے تھا۔"
  },
  {
    "en": "You surprised me.",
    "ur": "آپ نے مجھے حیران کر دیا۔"
  },
  {
    "en": "You will do nothing.",
    "ur": "تم کچھ نہیں کرو گے۔"
  },
  {
    "en": "You will have to handle everything.",
    "ur": "آپ کو سب کچھ سنبھالنا پڑے گا۔"
  },
  {
    "en": "You will never change.",
    "ur": "آپ کبھی نہیں بدلیں گے۔"
  },
  {
    "en": "You will regret later.",
    "ur": "بعد میں پچھتاؤ گے۔"
  },
  {
    "en": "You will soon adjust to living in a dormitory.",
    "ur": "آپ جلد ہی ہاسٹل میں رہنے کے لیے ایڈجسٹ ہو جائیں گے۔"
  },
  {
    "en": "You would have gone by now.",
    "ur": "آپ اب تک جا چکے ہوں گے۔"
  },
  {
    "en": "Your method was wrong.",
    "ur": "آپ کا طریقہ غلط تھا۔"
  },
  {
    "en": "Thank you very much.",
    "ur": "آپ کا بہت بہت شکریہ۔"
  },
  {
    "en": "See you again soon.",
    "ur": "جلد ہی دوبارہ ملیں گے۔"
  }
];


  window.HomeSchoolEnglishData = {
    ADVERBS_DATA,
    PREPOSITIONS_DATA,
    ADJECTIVES_DATA,
    CONJUNCTIONS_DATA,
    PRONOUNS_DATA,
    COLLECTIVE_NOUNS_DATA,
    VERBS_DATA,
    TENSES_DATA,
    VOCABULARY_DATA,
    ADVERB_PHRASES_DATA,
    ENGLISH_OPPOSITES_DATA,
    ENGLISH_SENTENCE_DATA,
  };
})();
