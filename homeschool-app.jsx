import { useState, useEffect, useRef, useCallback } from "react";

const STORE_KEY = "homeschool_state";
const loadState = () => { try { const r = localStorage.getItem(STORE_KEY); return r ? JSON.parse(r) : null; } catch { return null; } };
const saveState = (s) => { try { localStorage.setItem(STORE_KEY, JSON.stringify(s)); } catch {} };

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

const SUBJECTS = [
  { id: "math", name: "Math", nameUr: "ریاضی", icon: "📐", color: "#FF6B35" },
  { id: "science", name: "Science", nameUr: "سائنس", icon: "🔬", color: "#06D6A0" },
  { id: "english", name: "English", nameUr: "انگریزی", icon: "📖", color: "#118AB2" },
  { id: "social", name: "Social Studies", nameUr: "معاشرتی علوم", icon: "🌍", color: "#7B2D8E" },
  { id: "urdu", name: "Urdu", nameUr: "اردو", icon: "✍️", color: "#E63946" },
];
const GRADES = Array.from({ length: 10 }, (_, i) => ({ id: i + 1, name: "Grade " + (i + 1), nameUr: "جماعت " + (i + 1) }));

// ─── Seed DB from inline constants on first load ───
(async function(){try{await window.seedHomeSchoolDB({
  ADVERBS:ADVERBS_DATA, PREPOSITIONS:PREPOSITIONS_DATA, ADJECTIVES:ADJECTIVES_DATA,
  CONJUNCTIONS:CONJUNCTIONS_DATA, PRONOUNS:PRONOUNS_DATA, COLLECTIVE_NOUNS:COLLECTIVE_NOUNS_DATA,
  VERBS:VERBS_DATA, TENSES:TENSES_DATA, VOCABULARY:VOCABULARY_DATA,
  QUIZ_POOLS:null, MATH_CHAPTERS:null
});}catch(e){console.log("DB seed skipped:",e);}})();
const BADGES = [
  { id: "first_quiz", name: "First Steps", icon: "🌟", desc: "Complete your first quiz" },
  { id: "streak_3", name: "On Fire!", icon: "🔥", desc: "3-day streak" },
  { id: "streak_7", name: "Unstoppable", icon: "⚡", desc: "7-day streak" },
  { id: "perfect", name: "Perfect Score", icon: "💎", desc: "Score 100% on a quiz" },
  { id: "five_quizzes", name: "Scholar", icon: "🎓", desc: "Complete 5 quizzes" },
  { id: "ten_quizzes", name: "Bookworm", icon: "📚", desc: "Complete 10 quizzes" },
  { id: "all_subjects", name: "Renaissance", icon: "🏆", desc: "Quiz in all 5 subjects" },
  { id: "speed_demon", name: "Speed Demon", icon: "🚀", desc: "Finish a quiz in under 30s" },
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

function buildSentenceDayBlocks(items, size = 10) {
  const blocks = [];
  for (let i = 0; i < items.length; i += size) {
    blocks.push({
      day: blocks.length + 1,
      items: items.slice(i, i + size).map(item => ({ ...item }))
    });
  }
  return blocks;
}

function chunkDays(days, size = 5, maxDay = null) {
  const filtered = maxDay ? days.filter(day => day.day <= maxDay) : days.slice();
  const chunks = [];
  for (let i = 0; i < filtered.length; i += size) chunks.push(filtered.slice(i, i + size));
  return chunks;
}

function getDayRangeLabel(chunk) {
  return `Days ${chunk[0].day} to ${chunk[chunk.length - 1].day}`;
}

function flattenDayWords(days, maxDay, mapper) {
  const flat = [];
  (maxDay ? days.filter(day => day.day <= maxDay) : days).forEach(day => {
    (day.words || []).forEach((word, idx) => flat.push(mapper ? mapper(day, word, idx) : { day: day.day, ...word }));
  });
  return flat;
}

function buildDayExamples(days, formatter, maxDay = null) {
  return chunkDays(days, 5, maxDay).map(chunk => `${getDayRangeLabel(chunk)}: ${chunk.map(day => `Day ${day.day} — ${formatter(day)}`).join(" | ")}`);
}

function uniquePool(values, skipValue) {
  return values.filter((value, index) => value && value !== skipValue && values.indexOf(value) === index);
}

function buildChoices(correct, pool, seed) {
  const distractors = [];
  const base = uniquePool(pool, correct);
  for (let i = 0; i < base.length && distractors.length < 3; i++) {
    const candidate = base[(seed + i * 3) % base.length];
    if (candidate !== correct && !distractors.includes(candidate)) distractors.push(candidate);
  }
  const options = [correct, ...distractors];
  while (options.length < 4 && base.length) {
    const candidate = base[(seed + options.length * 5) % base.length];
    if (!options.includes(candidate)) options.push(candidate);
  }
  const rotation = seed % options.length;
  return options.slice(rotation).concat(options.slice(0, rotation));
}

function buildLanguageExercises(entries, fillPrompt, answerFn, answerPool, matchPrompt, fillHeader = "Fill in the blanks:") {
  const sample = entries.slice(0, 10);
  const fill = {
    q: fillHeader,
    parts: sample.map((entry, idx) => fillPrompt(entry, idx)),
    ans: sample.map(entry => answerFn(entry))
  };
  const tf = {
    q: "True or False:",
    parts: sample.map((entry, idx) => {
      const alt = sample[(idx + 1) % sample.length];
      const shown = idx % 2 === 0 ? answerFn(entry) : answerFn(alt);
      return `${matchPrompt ? matchPrompt(entry) : entry.label}: ${shown}`;
    }),
    ans: sample.map((entry, idx) => idx % 2 === 0 ? "True" : "False")
  };
  const match = {
    q: "Match the columns:",
    parts: sample.map(entry => matchPrompt ? matchPrompt(entry) : entry.label),
    ans: sample.map(entry => answerFn(entry))
  };
  return [fill, tf, match];
}

function buildLanguageQuiz(entries, count, questionFn, answerFn, optionPoolFn) {
  const quiz = [];
  const answerPool = optionPoolFn(entries);
  for (let i = 0; i < count; i++) {
    const entry = entries[i % entries.length];
    const correct = answerFn(entry, i);
    const options = buildChoices(correct, answerPool, i + entry.day);
    quiz.push({ q: questionFn(entry, i), a: options, c: options.indexOf(correct) });
  }
  return quiz;
}

function buildWordDayLessons(days, maxDay = 30) {
  const filtered = maxDay ? days.filter(day => day.day <= maxDay) : days.slice();
  return filtered.map(day => ({
    day: day.day,
    words: (day.words || []).map(word => ({ ...word })),
    paragraph: day.paragraph,
    difficult: day.difficult
  }));
}

function buildPairDayLessons(items) {
  return items.map(item => ({
    day: item.day,
    pairs: [{ left: item.word, right: item.opposite }]
  }));
}

function buildDayRangeExerciseGroups(days, maxDay, mapper, fillPrompt, answerFn, matchPrompt, fillHeader) {
  return chunkDays(days, 5, maxDay).map(chunk => {
    const entries = flattenDayWords(chunk, null, mapper);
    return {
      label: getDayRangeLabel(chunk),
      exercises: buildLanguageExercises(entries, fillPrompt, answerFn, entries.map(entry => answerFn(entry)), matchPrompt, fillHeader)
    };
  });
}

function buildDayRangeQuizGroups(days, maxDay, mapper, count, questionFn, answerFn, optionPoolFn) {
  return chunkDays(days, 5, maxDay).map(chunk => {
    const entries = flattenDayWords(chunk, null, mapper);
    return {
      label: getDayRangeLabel(chunk),
      questions: buildLanguageQuiz(entries, count, questionFn, answerFn, optionPoolFn || (list => list.map(entry => answerFn(entry))))
    };
  });
}

function buildBasicWordSubsection(title, description, days, maxDay = 30) {
  return {
    t: title,
    c: description,
    lessonLabel: "📅 Days",
    dayLessons: buildWordDayLessons(days, maxDay),
    exerciseGroups: buildDayRangeExerciseGroups(
      days,
      maxDay,
      (day, word) => ({ day: day.day, label: word.en, answer: word.ur }),
      entry => `${entry.label} = ___`,
      entry => entry.answer,
      entry => entry.label,
      "Fill in the blanks with correct meaning:"
    ),
    quizGroups: buildDayRangeQuizGroups(
      days,
      maxDay,
      (day, word) => ({ day: day.day, label: word.en, answer: word.ur }),
      20,
      entry => `What is the Urdu meaning of "${entry.label}"?`,
      entry => entry.answer,
      list => list.map(entry => entry.answer)
    )
  };
}

function buildAdjectiveSubsection(days) {
  return {
    t: "Adjectives",
    c: "Learn adjectives through textbook-style day groups, with focus on positive, comparative, and superlative forms.",
    lessonLabel: "📅 Days",
    dayLessons: buildWordDayLessons(days, 30),
    exerciseGroups: chunkDays(days, 5, 30).map(chunk => {
      const entries = flattenDayWords(chunk, null, (day, word) => ({ day: day.day, label: word.en, comp: word.comp, super: word.super }));
      return {
        label: getDayRangeLabel(chunk),
        exercises: [
          { q: "Fill in the blanks:", parts: entries.slice(0, 10).map(entry => `Comparative of "${entry.label}" is ___`), ans: entries.slice(0, 10).map(entry => entry.comp) },
          { q: "True or False:", parts: entries.slice(0, 10).map((entry, idx) => `${entry.label}: ${idx % 2 === 0 ? entry.super : entries[(idx + 1) % entries.length].super}`), ans: entries.slice(0, 10).map((entry, idx) => idx % 2 === 0 ? "True" : "False") },
          { q: "Match the columns:", parts: entries.slice(0, 10).map(entry => entry.label), ans: entries.slice(0, 10).map(entry => `${entry.comp} / ${entry.super}`) }
        ]
      };
    }),
    quizGroups: chunkDays(days, 5, 30).map(chunk => {
      const entries = flattenDayWords(chunk, null, (day, word) => ({ day: day.day, label: word.en, comp: word.comp, super: word.super }));
      return {
        label: getDayRangeLabel(chunk),
        questions: buildLanguageQuiz(entries, 20, (entry, idx) => idx % 2 === 0 ? `What is the comparative form of "${entry.label}"?` : `What is the superlative form of "${entry.label}"?`, (entry, idx) => idx % 2 === 0 ? entry.comp : entry.super, list => list.flatMap(entry => [entry.comp, entry.super]))
      };
    })
  };
}

function buildVerbSubsection(days) {
  return {
    t: "Verbs",
    c: "Study present, past, and past participle verb forms in 5-day textbook-style lesson blocks.",
    lessonLabel: "📅 Days",
    dayLessons: buildWordDayLessons(days, 30),
    exerciseGroups: chunkDays(days, 5, 30).map(chunk => {
      const entries = flattenDayWords(chunk, null, (day, word) => ({ day: day.day, label: word.en, v2: word.v2, v3: word.v3 }));
      return {
        label: getDayRangeLabel(chunk),
        exercises: [
          { q: "Fill in the blanks:", parts: entries.slice(0, 10).map(entry => `Past form of "${entry.label}" is ___`), ans: entries.slice(0, 10).map(entry => entry.v2) },
          { q: "True or False:", parts: entries.slice(0, 10).map((entry, idx) => `${entry.label}: ${idx % 2 === 0 ? entry.v3 : entries[(idx + 1) % entries.length].v3}`), ans: entries.slice(0, 10).map((entry, idx) => idx % 2 === 0 ? "True" : "False") },
          { q: "Match the columns:", parts: entries.slice(0, 10).map(entry => entry.label), ans: entries.slice(0, 10).map(entry => `${entry.v2} / ${entry.v3}`) }
        ]
      };
    }),
    quizGroups: chunkDays(days, 5, 30).map(chunk => {
      const entries = flattenDayWords(chunk, null, (day, word) => ({ day: day.day, label: word.en, v2: word.v2, v3: word.v3 }));
      return {
        label: getDayRangeLabel(chunk),
        questions: buildLanguageQuiz(entries, 20, (entry, idx) => idx % 2 === 0 ? `What is the past form of "${entry.label}"?` : `What is the past participle of "${entry.label}"?`, (entry, idx) => idx % 2 === 0 ? entry.v2 : entry.v3, list => list.flatMap(entry => [entry.v2, entry.v3]))
      };
    })
  };
}

function buildVocabularyMeaningSubsection() {
  return {
    t: "Words Meanings",
    c: "Build word power through day-wise textbook review blocks, keeping Urdu meanings for tests and English meanings as lesson support.",
    lessonLabel: "📅 Days",
    dayLessons: buildWordDayLessons(VOCABULARY_DATA, 30),
    exerciseGroups: buildDayRangeExerciseGroups(
      VOCABULARY_DATA,
      30,
      (day, word) => ({ day: day.day, label: word.en, answer: word.ur, reference: word.meaning }),
      entry => `${entry.label} = ___`,
      entry => entry.answer,
      entry => entry.label,
      "Fill in the blanks with correct meaning:"
    ),
    quizGroups: buildDayRangeQuizGroups(
      VOCABULARY_DATA,
      30,
      (day, word) => ({ day: day.day, label: word.en, answer: word.ur, reference: word.meaning }),
      20,
      entry => `What is the Urdu meaning of "${entry.label}"?`,
      entry => entry.answer,
      list => list.map(entry => entry.answer)
    )
  };
}

function buildOppositesSubsection() {
  return {
    t: "Words Opposites",
    c: "Learn common opposite words in meaningful 5-day review blocks, so students can connect vocabulary with contrast.",
    lessonLabel: "📅 Days",
    dayLessons: buildWordDayLessons(ENGLISH_OPPOSITES_DATA, null),
    exerciseGroups: buildDayRangeExerciseGroups(
      ENGLISH_OPPOSITES_DATA,
      null,
      (day, word) => ({ day: day.day, label: word.en, answer: word.opposite }),
      entry => `Opposite of "${entry.label}" is ___`,
      entry => entry.answer,
      entry => entry.label
    ),
    quizGroups: buildDayRangeQuizGroups(
      ENGLISH_OPPOSITES_DATA,
      null,
      (day, word) => ({ day: day.day, label: word.en, answer: word.opposite }),
      20,
      entry => `What is the opposite of "${entry.label}"?`,
      entry => entry.answer,
      list => list.map(entry => entry.answer)
    )
  };
}

function buildVocabularyCollectiveNounsSubsection() {
  return {
    t: "Collective Nouns",
    c: "Review collective nouns in day-wise lesson cards, keeping each day's words and paragraph together for textbook-style study.",
    lessonLabel: "📅 Days",
    dayLessons: buildWordDayLessons(COLLECTIVE_NOUNS_DATA, 30),
    exerciseGroups: buildDayRangeExerciseGroups(
      COLLECTIVE_NOUNS_DATA,
      30,
      (day, word) => ({ day: day.day, label: word.en, answer: word.ur }),
      entry => `${entry.label} = ___`,
      entry => entry.answer,
      entry => entry.label,
      "Fill in the blanks with correct meaning:"
    ),
    quizGroups: buildDayRangeQuizGroups(
      COLLECTIVE_NOUNS_DATA,
      30,
      (day, word) => ({ day: day.day, label: word.en, answer: word.ur }),
      20,
      entry => `What is the Urdu meaning of "${entry.label}"?`,
      entry => entry.answer,
      list => list.map(entry => entry.answer)
    )
  };
}

function buildEnglishVocabularySubs() {
  return [
    buildVocabularyMeaningSubsection(),
    buildOppositesSubsection(),
    buildVocabularyCollectiveNounsSubsection()
  ];
}

function buildEnglishPartsOfSpeechSubs() {
  return [
    buildBasicWordSubsection("Adverbs", "Study adverbs in 5-day blocks and connect each English adverb with its Urdu meaning and usage.", ADVERBS_DATA, 30),
    buildBasicWordSubsection("Prepositions", "Study prepositions in grouped day ranges and review how each one connects ideas of place, time, or movement.", PREPOSITIONS_DATA, 30),
    buildAdjectiveSubsection(ADJECTIVES_DATA),
    buildBasicWordSubsection("Conjunctions", "Review conjunctions in day-wise groups and learn how they join words, phrases, and clauses.", CONJUNCTIONS_DATA, 30),
    buildBasicWordSubsection("Pronouns", "Practice pronouns in 5-day textbook review blocks and connect each English pronoun with its Urdu meaning.", PRONOUNS_DATA, 30),
    buildBasicWordSubsection("Collective Nouns", "Review collective nouns in grouped day ranges and connect the English term with its Urdu meaning.", COLLECTIVE_NOUNS_DATA, 30),
    buildVerbSubsection(VERBS_DATA)
  ];
}

function buildEnglishSentenceSubsection(dayBlock) {
  const entries = dayBlock.items.map((item, idx) => ({
    day: dayBlock.day * 100 + idx + 1,
    label: item.en,
    answer: item.ur
  }));
  return {
    t: `Sentences Day ${dayBlock.day}`,
    c: "Read ten daily-use English sentences with Urdu translations. Practice only this day's sentences in the exercises and quiz.",
    examplesLabel: "🗣️ Sentences",
    sentencePairs: dayBlock.items.map(item => ({ ...item })),
    exercises: buildLanguageExercises(
      entries,
      entry => `${entry.label} = ___`,
      entry => entry.answer,
      entries.map(entry => entry.answer),
      entry => entry.label,
      "Fill in the blanks with correct Urdu translation:"
    ),
    quiz: buildLanguageQuiz(
      entries,
      20,
      entry => `What is the Urdu translation of "${entry.label}"?`,
      entry => entry.answer,
      list => list.map(entry => entry.answer)
    )
  };
}

function buildEnglishSentencesSubs() {
  return buildSentenceDayBlocks(ENGLISH_SENTENCE_DATA, 10).map(buildEnglishSentenceSubsection);
}

function getLessons(subject, grade) {
  const g = grade;
  const L = {
    math: g <= 3 ? [
      { title: "Counting & Numbers", content: "Learn to count from " + (g === 1 ? "1 to 100" : g === 2 ? "100 to 1000" : "1000 to 10000") + ". Practice skip counting. Understand place value.", key: "counting" },
      { title: "Addition & Subtraction", content: "Practice adding and subtracting " + (g === 1 ? "single" : g === 2 ? "double" : "triple") + "-digit numbers. Learn carrying and borrowing.", key: "add_sub" },
      { title: "Shapes & Patterns", content: "Identify basic shapes: circles, squares, triangles. Recognize and extend patterns.", key: "shapes" },
    ] : g === 5 ? [
      { title: "Whole Numbers", content: "Place value up to millions and beyond. Expanded form of numbers. Comparing and ordering numbers. Rounding numbers to nearest 10, 100, 1000. Number lines.", key: "whole_numbers", hasMathSub: true, subs: [
        {t:"Place Value", c:"Every digit in a number has a place value based on its position. The farther left a digit is, the greater its value.", svgType:"placeValue", svgData:{number:"5,432,187"},
         examples:[
           "In 5,432,187 — 5 is in the Millions place (5,000,000)",
           "4 is in the Hundred-Thousands place (400,000)",
           "3 is in the Ten-Thousands place (30,000)",
           "2 is in the Thousands place (2,000)",
           "1 is in the Hundreds place (100)",
           "8 is in the Tens place (80)",
           "7 is in the Ones place (7)"
         ],
         exercises:[
           {q:"Write the place value of the underlined digit:", parts:["[4]52,301 → ?","7,[8]21,456 → ?","1,234,[5]67 → ?","[9],000,000 → ?","56,7[8]9 → ?","3,4[5]6,789 → ?"], ans:["400,000","800,000","500","9,000,000","80","50,000"]},
           {q:"What is the value of digit 6 in each number?", parts:["6,543,210","1,265,000","45,600","3,456","890,006","162,345"], ans:["6,000,000","60,000","600","6","6","60,000"]},
           {q:"Which digit is in the ten-thousands place?", parts:["4,523,100","789,654","12,345,678","56,789","901,234","3,456,789"], ans:["2","8","4","5","0","5"]},
           {q:"Write the number in which 7 is in the given place:", parts:["7 in ones place","7 in tens place","7 in hundreds place","7 in thousands place","7 in ten-thousands place","7 in hundred-thousands place"], ans:["___7","__7_","_7__","7,___","_7_,___","7__,___"]},
           {q:"True or False:", parts:["In 45,678 the digit 4 is in ten-thousands place","In 123,456 the digit 3 is in hundreds place","In 9,876,543 the digit 8 is in millions place","In 500,000 the digit 5 is in hundred-thousands place","The ones place is always the leftmost digit"], ans:["True","False — it's in thousands","False — it's in hundred-thousands","True","False — it's the rightmost"]}
         ],
         wordProblems:[
           "Pakistan's population is about 240,000,000. What is the place value of 2 in this number?",
           "A library has 123,456 books. What is the place value of 3 in this number?",
           "The distance from Earth to Moon is about 384,400 km. What digit is in the ten-thousands place?",
           "Ali's father earns Rs 250,000 per month. What is the place value of 5?",
           "A school collected 45,678 bottle caps. What is the value of the digit 4?"
         ],
         quiz:[
           {q:"What is the place value of 3 in 4,356,789?",a:["3,000","30,000","300,000","3,000,000"],c:2},
           {q:"Which digit is in the millions place in 7,654,321?",a:["1","4","6","7"],c:3},
           {q:"The value of 8 in 180,000 is:",a:["8,000","80,000","800","8"],c:1},
           {q:"In 9,123,456 — what place is digit 1 in?",a:["Millions","Hundred-thousands","Ten-thousands","Thousands"],c:1},
           {q:"How many zeros in one million?",a:["5","6","7","8"],c:1},
           {q:"The place value of 0 in 504,321 is:",a:["0","4,000","40,000","None"],c:0},
           {q:"Which number has 5 in the ten-thousands place?",a:["5,234","52,340","523,400","500"],c:1},
           {q:"300,000 in words is:",a:["Thirty thousand","Three hundred thousand","Three million","Three billion"],c:1}
         ]
        },
        {t:"Expanded Form", c:"Expanded form shows the value of each digit separately, added together.", svgType:"expandedForm", svgData:{number:"4,523", parts:["4,000","500","20","3"]},
         examples:[
           "4,523 = 4,000 + 500 + 20 + 3",
           "56,789 = 50,000 + 6,000 + 700 + 80 + 9",
           "123,456 = 100,000 + 20,000 + 3,000 + 400 + 50 + 6",
           "900,000 = 900,000 + 0 + 0 + 0 + 0 + 0",
           "345,678 = 300,000 + 40,000 + 5,000 + 600 + 70 + 8",
           "1,050,000 = 1,000,000 + 50,000"
         ],
         exercises:[
           {q:"Write in expanded form:", parts:["7,891","34,567","123,000","505,050","89,012","678,901","1,234,567","40,008"], ans:["7,000+800+90+1","30,000+4,000+500+60+7","100,000+20,000+3,000","500,000+5,000+50","80,000+9,000+10+2","600,000+70,000+8,000+900+1","1,200,000+30,000+4,000+500+60+7","40,000+8"]},
           {q:"Write in standard form:", parts:["6,000+400+30+2","50,000+3,000+200+10+5","100,000+40,000+500+60","900,000+8,000+7","20,000+300+4","300,000+50,000+1,000+200+30+4"], ans:["6,432","53,215","140,560","908,007","20,304","351,234"]},
           {q:"Fill in the blanks:", parts:["4,567 = 4,000 + ___ + 60 + 7","23,456 = 20,000 + ___ + 400 + 56","150,000 = ___ + 50,000","78,901 = 70,000 + 8,000 + ___ + 1","505,005 = 500,000 + ___ + 5"], ans:["500","3,000","100,000","900","5,000"]},
           {q:"True or False:", parts:["4,523 = 4,000 + 500 + 20 + 3","7,890 = 7,000 + 800 + 9","10,000 = 1,000 + 0,000","56,070 = 50,000 + 6,000 + 70","99,999 = 90,000 + 9,000 + 900 + 90 + 9"], ans:["True","False — should be +90","False — 10,000 is standard","True","True"]}
         ],
         wordProblems:[
           "A farmer has 12,345 mangoes. Write this number in expanded form.",
           "The price of a car is Rs 567,890. Write in expanded form.",
           "A village has 23,045 people. Show in expanded form. Why is there no thousands term?",
           "A school raised Rs 105,000 for charity. Write in expanded form.",
           "The height of K2 is 8,611 meters. Write in expanded form."
         ],
         quiz:[
           {q:"Expanded form of 3,456 is:",a:["3+4+5+6","3,000+400+50+6","3,456+0","30+40+50+6"],c:1},
           {q:"Standard form of 50,000+6,000+200+30+1:",a:["5,623","56,231","50,631","5,06,231"],c:1},
           {q:"Which is the expanded form of 10,050?",a:["10,000+50","1,000+50","10,000+500","100+50"],c:0},
           {q:"Fill in: 78,_02 = 70,000+8,000+___+2",a:["0","100","200","9"],c:0},
           {q:"How many terms in expanded form of 40,008?",a:["2","3","4","5"],c:0},
           {q:"900,000+50,000+3,000+400+20+1 = ?",a:["9,53,421","95,3421","9,05,321","90,53,421"],c:0},
           {q:"Expanded form of 100,000 has how many non-zero terms?",a:["1","5","6","0"],c:0},
           {q:"Which number has expanded form: 20,000+5,000+60+3?",a:["2,563","25,630","25,063","20,563"],c:2}
         ]
        },
        {t:"Comparing & Ordering", c:"To compare numbers, check digit count first. If same, compare from left to right. Use > (greater), < (less), = (equal).", svgType:"compare", svgData:{num1:5432, num2:4999},
         examples:[
           "5,432 > 4,999 — because 5 thousands > 4 thousands",
           "12,345 < 12,456 — same up to hundreds, then 3 < 4",
           "99,999 < 100,000 — 5 digits < 6 digits",
           "5,678 = 5,678 — same number",
           "Order: 4,521 < 5,123 < 5,234 < 6,001 < 6,100",
           "67,890 > 67,809 — tens place: 9 > 0"
         ],
         exercises:[
           {q:"Write >, < or = :", parts:["4,567 ___ 4,576","12,345 ___ 12,345","99,999 ___ 100,000","56,789 ___ 56,798","123,456 ___ 123,465","45,000 ___ 44,999","8,901 ___ 9,001","333,333 ___ 333,333"], ans:["<",  "=","<","<","<",">","<","="]},
           {q:"Arrange in ascending order (smallest to largest):", parts:["5,432; 3,210; 4,567; 1,234","45,678; 43,210; 45,123; 44,000","100,000; 99,999; 100,001; 98,765","7,890; 7,980; 7,809; 7,908","23,456; 24,356; 23,465; 24,365"], ans:["1,234 < 3,210 < 4,567 < 5,432","43,210 < 44,000 < 45,123 < 45,678","98,765 < 99,999 < 100,000 < 100,001","7,809 < 7,890 < 7,908 < 7,980","23,456 < 23,465 < 24,356 < 24,365"]},
           {q:"Arrange in descending order (largest to smallest):", parts:["6,543; 5,678; 7,890; 4,321","34,567; 35,467; 34,657; 35,476","250,000; 245,000; 255,000; 249,999"], ans:["7,890 > 6,543 > 5,678 > 4,321","35,476 > 35,467 > 34,657 > 34,567","255,000 > 250,000 > 249,999 > 245,000"]},
           {q:"Write the greatest and smallest number using digits:", parts:["3, 7, 1, 5","9, 0, 4, 6, 2","8, 3, 5, 1, 0","6, 6, 2, 2","5, 0, 0, 5, 0"], ans:["Greatest: 7,531 Smallest: 1,357","Greatest: 96,420 Smallest: 20,469","Greatest: 85,310 Smallest: 10,358","Greatest: 6,622 Smallest: 2,266","Greatest: 55,000 Smallest: 5,005"]}
         ],
         wordProblems:[
           "Ali scored 45,678 points and Sara scored 45,768 points. Who scored more?",
           "Three cities have populations: Lahore 1,1,200,000; Karachi 1,4900,000; Islamabad 1100,000. Arrange from largest to smallest.",
           "A factory produced 23,456 items in January and 23,465 in February. Which month had more production?",
           "The heights of three mountains are: 8,611m, 8,586m, 8,516m. Arrange in ascending order.",
           "Two shops earned Rs 567,890 and Rs 567,980. Which shop earned more?"
         ],
         quiz:[
           {q:"Which is greater: 45,678 or 45,876?",a:["45,678","45,876","Equal","Cannot tell"],c:1},
           {q:"Arrange ascending: 7,890; 7,089; 7,908",a:["7,890; 7,089; 7,908","7,089; 7,890; 7,908","7,908; 7,890; 7,089","7,089; 7,908; 7,890"],c:1},
           {q:"The smallest 5-digit number is:",a:["99,999","10,000","10,001","00,001"],c:1},
           {q:"Which symbol: 123,456 ___ 132,456",a:[">","<","=","≠"],c:1},
           {q:"Greatest number from digits 4,0,8,2:",a:["8,420","8,402","8,240","8,042"],c:0},
           {q:"Which is the largest? 99,999; 100,000; 98,765",a:["99,999","100,000","98,765","All equal"],c:1},
           {q:"Descending order of 345, 543, 354, 435:",a:["543>435>354>345","543>435>345>354","345<354<435<543","435>543>354>345"],c:0},
           {q:"Smallest number with digits 5,5,0,0:",a:["5,500","5,050","5,005","55"],c:2}
         ]
        },
        {t:"Rounding Numbers", c:"Rounding makes numbers simpler. Look at the digit to the right of the place you're rounding to. If 5 or more → round up. If less than 5 → round down.", svgType:"rounding", svgData:{number:4567,place:"100",result:4600,direction:"up"},
         examples:[
           "4,567 rounded to nearest 10 → 4,570 (7≥5, round up)",
           "4,567 rounded to nearest 100 → 4,600 (6≥5, round up)",
           "4,567 rounded to nearest 1,000 → 5,000 (5≥5, round up)",
           "3,421 rounded to nearest 10 → 3,420 (1<5, round down)",
           "3,421 rounded to nearest 100 → 3,400 (2<5, round down)",
           "3,421 rounded to nearest 1,000 → 3,000 (4<5, round down)",
           "7,850 rounded to nearest 100 → 7,900 (5≥5, round up)",
           "99,950 rounded to nearest 100 → 100,000"
         ],
         exercises:[
           {q:"Round to the nearest 10:", parts:["4,563","7,895","1,234","9,998","456","12,345","67,891","50,005"], ans:["4,560","7,900","1,230","10,000","460","12,350","67,890","50,010"]},
           {q:"Round to the nearest 100:", parts:["4,567","7,850","1,234","9,950","3,456","12,345","67,891","99,960"], ans:["4,600","7,900","1,200","10,000","3,500","12,300","67,900","100,000"]},
           {q:"Round to the nearest 1,000:", parts:["4,567","7,500","1,234","9,500","23,456","67,891","1,45,678","5,00,500"], ans:["5,000","8,000","1,000","10,000","23,000","68,000","1,46,000","5,01,000"]},
           {q:"True or False:", parts:["4,567 rounded to nearest 10 is 4,570","8,945 rounded to nearest 100 is 8,900","12,500 rounded to nearest 1,000 is 13,000","99,999 rounded to nearest 10 is 100,000","5,555 rounded to nearest 100 is 5,600"], ans:["True","False — should be 8,900... wait, 4<5 so 8,900 is correct. True","True","False — it's 100,000. True","True"]}
         ],
         wordProblems:[
           "A school has 1,267 students. Round to the nearest hundred for the report.",
           "The cost of a laptop is Rs 78,450. Round to the nearest thousand.",
           "A marathon is 42,195 meters. Round to the nearest 100 meters.",
           "A city has 345,678 people. Round to the nearest ten-thousand.",
           "Ali drove 567 km. Round to nearest 10 km."
         ],
         quiz:[
           {q:"4,567 rounded to nearest 100 is:",a:["4,500","4,600","4,570","5,000"],c:1},
           {q:"Round 8,945 to nearest 1,000:",a:["8,000","9,000","8,900","8,950"],c:1},
           {q:"Round 12,500 to nearest 1,000:",a:["12,000","13,000","12,500","10,000"],c:1},
           {q:"Which rounds to 5,000?",a:["5,600","4,400","4,501","5,500"],c:2},
           {q:"Round 99,950 to nearest 100:",a:["99,900","100,000","99,000","99,950"],c:1},
           {q:"7,350 rounded to nearest 10:",a:["7,400","7,350","7,360","7,300"],c:1},
           {q:"What is 45,678 rounded to nearest 10,000?",a:["40,000","50,000","45,000","46,000"],c:1},
           {q:"Round 999 to nearest 100:",a:["900","990","1,000","1,100"],c:2}
         ]
        },
        {t:"Number Lines", c:"A number line is a straight line with numbers placed at equal intervals. It helps visualize number positions, addition, subtraction, and comparing.", svgType:"numberLine", svgData:{min:0,max:100,marks:[0,10,20,30,40,50,60,70,80,90,100],highlight:[25,50,75]},
         examples:[
           "On a 0 to 100 line, 50 is exactly in the middle",
           "On a 0 to 1000 line, 250 is one-quarter of the way",
           "Numbers increase to the right, decrease to the left",
           "The distance between 30 and 50 is 20 units",
           "To add 3+4 on a number line: start at 3, jump 4 to the right → land on 7",
           "To subtract 8-3: start at 8, jump 3 to the left → land on 5"
         ],
         exercises:[
           {q:"Mark these numbers on a 0 to 100 number line:", parts:["25","50","75","10","90","33","67","5"], ans:["¼ of the way","½ way","¾ of the way","1/10 of the way","near the end","⅓ of the way","⅔ of the way","very near 0"]},
           {q:"What number is halfway between:", parts:["0 and 100","20 and 40","100 and 200","50 and 150","0 and 1,000","400 and 600"], ans:["50","30","150","100","500","500"]},
           {q:"Which is closer to 50 on a number line?", parts:["45 or 60","30 or 55","48 or 53","10 or 80","49 or 52","25 or 70"], ans:["45 (5 away vs 10)","55 (5 away vs 20)","48 (2 away vs 3)","Neither — both 40 away","49 (1 away vs 2)","25 (25 away vs 20) → 70"]},
           {q:"Find the missing number on the number line:", parts:["0, 10, 20, __, 40, 50","0, 25, 50, __, 100","100, 200, __, 400, 500","0, 5, __, 15, 20","1000, 2000, __, 4000, 5000"], ans:["30","75","300","10","3000"]}
         ],
         wordProblems:[
           "On a road from City A (0 km) to City B (100 km), a petrol station is at the halfway point. At what km is it?",
           "A thermometer shows 0°C to 50°C. If the temperature is halfway, what is it?",
           "On a ruler from 0 to 30 cm, where would you mark 15 cm?",
           "Ali walked from 0 to 200 meters. He stopped after covering three-quarters. How far did he walk?",
           "A number line shows 0 to 1,000. Where would 333 be approximately?"
         ],
         quiz:[
           {q:"What number is halfway between 0 and 100?",a:["25","50","75","100"],c:1},
           {q:"On a number line, which is farther from 50?",a:["45","55","30","48"],c:2},
           {q:"What is halfway between 200 and 400?",a:["250","300","350","400"],c:1},
           {q:"Missing: 0, 250, 500, ___, 1000",a:["600","700","750","800"],c:2},
           {q:"On a 0 to 1000 line, 100 is at:",a:["One-half","One-quarter","One-tenth","One-fifth"],c:2},
           {q:"Numbers increase in which direction on a number line?",a:["Left","Right","Up","Down"],c:1},
           {q:"Distance between 30 and 80 on number line:",a:["30","50","80","110"],c:1},
           {q:"Which number is closest to 0 on a number line?",a:["99","50","12","1"],c:3}
         ]
        }
      ] },
      { title: "Addition & Subtraction", content: "Multi-digit addition and subtraction. Carrying and borrowing techniques. Estimation of sums and differences. Word problems.", key: "add_sub5", hasMathSub: true, subs: [
        {t:"Multi-digit Addition", c:"When adding large numbers, line up the digits by place value. Start from the ones column. If a column adds to 10 or more, carry the extra to the next column.", svgType:"columnAdd", svgData:{num1:4567,num2:3845,result:8412},
         examples:[
           "4,567 + 3,845 = 8,412",
           "12,345 + 7,655 = 20,000",
           "56,789 + 43,211 = 100,000",
           "1,234 + 5,678 = 6,912",
           "99,999 + 1 = 100,000",
           "345 + 2,655 = 3,000",
           "8,050 + 1,950 = 10,000"
         ],
         exercises:[
           {q:"Add the following:", parts:["4,567 + 3,845","12,345 + 7,655","56,789 + 43,211","23,456 + 34,567","1,234 + 8,766","45,678 + 54,322","99,001 + 999","67,890 + 32,110"], ans:["8,412","20,000","100,000","58,023","10,000","100,000","100,000","100,000"]},
           {q:"Find the sum:", parts:["345 + 2,655","8,050 + 1,950","15,000 + 25,000","4,321 + 5,679","78,654 + 11,346","234 + 5,766"], ans:["3,000","10,000","40,000","10,000","90,000","6,000"]},
           {q:"Fill in the missing number:", parts:["4,567 + ___ = 10,000","___ + 3,456 = 8,000","25,000 + ___ = 50,000","___ + 45,678 = 100,000","1,234 + ___ = 5,000"], ans:["5,433","4,544","25,000","54,322","3,766"]},
           {q:"True or False:", parts:["4,567 + 3,845 = 8,412","12,345 + 7,655 = 19,000","99,999 + 1 = 100,000","50,000 + 50,000 = 100,000","1,234 + 5,678 = 6,812"], ans:["True","False — it's 20,000","True","True","False — it's 6,912"]}
         ],
         wordProblems:[
           "A school has 12,345 boys and 11,678 girls. How many students are there in total?",
           "Ali saved Rs 4,567 in January and Rs 3,845 in February. How much did he save in total?",
           "A factory produced 56,789 items in March and 43,211 in April. Find the total production.",
           "Town A has 34,567 people and Town B has 45,433 people. What is the combined population?",
           "A farmer harvested 8,050 kg of wheat and 1,950 kg of rice. Find the total harvest."
         ],
         quiz:[
           {q:"4,567 + 3,845 = ?",a:["7,412","8,312","8,412","8,512"],c:2},
           {q:"12,345 + 7,655 = ?",a:["19,000","20,000","21,000","19,900"],c:1},
           {q:"99,999 + 1 = ?",a:["99,000","100,000","100,001","99,999"],c:1},
           {q:"What is 56,789 + 43,211?",a:["99,000","100,000","99,900","100,100"],c:1},
           {q:"4,567 + ___ = 10,000",a:["5,433","5,333","5,543","6,433"],c:0},
           {q:"Which sum equals 100,000?",a:["45,678 + 54,322","45,678 + 55,322","44,678 + 54,322","45,678 + 54,222"],c:0},
           {q:"1,234 + 5,678 = ?",a:["6,812","6,912","7,012","6,902"],c:1},
           {q:"25,000 + 25,000 = ?",a:["40,000","45,000","50,000","55,000"],c:2}
         ]
        },
        {t:"Carrying & Borrowing", c:"Carrying happens in addition when a column adds to 10 or more. Borrowing happens in subtraction when the top digit is smaller than the bottom digit. You take 1 from the next column.", svgType:"columnSub", svgData:{num1:7003,num2:2458,result:4545},
         examples:[
           "478 + 356: ones 8 + 6 = 14, write 4 carry 1. Tens 7 + 5 + 1 = 13, write 3 carry 1. Hundreds 4 + 3 + 1 = 8. Answer: 834",
           "7,003 - 2,458: borrow across zeros. 3 can't subtract 8, borrow from thousands. Answer: 4,545",
           "5,000 - 1,234: borrow from 5. Answer: 3,766",
           "9,100 - 4,567: borrow step by step. Answer: 4,533",
           "6,204 - 3,578: borrow across the 0. Answer: 2,626",
           "800 - 367: borrow twice. Answer: 433"
         ],
         exercises:[
           {q:"Subtract (practice borrowing):", parts:["7,003 - 2,458","5,000 - 1,234","9,100 - 4,567","6,204 - 3,578","800 - 367","10,000 - 4,567","3,001 - 1,456","8,000 - 2,999"], ans:["4,545","3,766","4,533","2,626","433","5,433","1,545","5,001"]},
           {q:"Add with carrying:", parts:["4,789 + 6,345","8,967 + 3,456","5,555 + 4,445","7,896 + 2,345","9,876 + 5,678","3,999 + 6,001"], ans:["11,134","12,423","10,000","10,241","15,554","10,000"]},
           {q:"Fill in the blank:", parts:["10,000 - ___ = 4,567","___ - 3,456 = 2,544","8,000 - ___ = 3,765","___ - 1,999 = 5,001","5,000 - ___ = 2,350"], ans:["5,433","6,000","4,235","7,000","2,650"]},
           {q:"True or False:", parts:["7,003 - 2,458 = 4,545","5,000 - 1,234 = 3,866","10,000 - 4,567 = 5,433","800 - 367 = 433","9,100 - 4,567 = 4,633"], ans:["True","False — it's 3,766","True","True","False — it's 4,533"]}
         ],
         wordProblems:[
           "A shopkeeper had Rs 10,000. He spent Rs 4,567 on supplies. How much money is left?",
           "A water tank holds 8,000 liters. 2,999 liters were used. How many liters remain?",
           "A school had 5,000 notebooks. They distributed 3,765 to students. How many are left?",
           "Ali had 7,003 stamps. He gave 2,458 to his friend. How many stamps does Ali have now?",
           "A bus can carry 60 passengers. If 47 are on board, how many more can get on?"
         ],
         quiz:[
           {q:"7,003 - 2,458 = ?",a:["4,445","4,545","4,645","4,555"],c:1},
           {q:"5,000 - 1,234 = ?",a:["3,866","3,766","3,676","3,776"],c:1},
           {q:"10,000 - 4,567 = ?",a:["5,433","5,333","5,533","6,433"],c:0},
           {q:"When do you need to borrow?",a:["Top digit is bigger","Top digit is smaller","Digits are equal","Never"],c:1},
           {q:"800 - 367 = ?",a:["433","443","533","333"],c:0},
           {q:"What is carrying?",a:["Moving digits left","Writing extra when sum ≥ 10","Removing zeros","Skipping columns"],c:1},
           {q:"9,100 - 4,567 = ?",a:["4,433","4,533","4,633","4,333"],c:1},
           {q:"6,204 - 3,578 = ?",a:["2,626","2,726","2,526","3,626"],c:0}
         ]
        },
        {t:"Estimation", c:"Estimation means finding an approximate answer quickly. Round each number to the nearest thousand or hundred first, then add or subtract. It helps you check if your exact answer makes sense.", svgType:"estimation", svgData:{num1:4892,num2:3107,op:"+",rounded1:5000,rounded2:3000,estimate:8000,exact:7999},
         examples:[
           "4,892 + 3,107 ≈ 5,000 + 3,000 = 8,000 (exact: 7,999)",
           "7,823 - 2,198 ≈ 8,000 - 2,000 = 6,000 (exact: 5,625)",
           "12,456 + 8,544 ≈ 12,000 + 9,000 = 21,000 (exact: 21,000)",
           "9,876 - 4,321 ≈ 10,000 - 4,000 = 6,000 (exact: 5,555)",
           "45,678 + 23,456 ≈ 46,000 + 23,000 = 69,000 (exact: 69,134)",
           "6,500 - 3,499 ≈ 7,000 - 3,000 = 4,000 (exact: 3,001)"
         ],
         exercises:[
           {q:"Estimate by rounding to nearest thousand:", parts:["4,567 + 3,456","8,901 - 2,345","12,678 + 7,345","9,500 - 4,499","6,789 + 3,211","15,432 - 8,567"], ans:["5,000 + 3,000 = 8,000","9,000 - 2,000 = 7,000","13,000 + 7,000 = 20,000","10,000 - 4,000 = 6,000","7,000 + 3,000 = 10,000","15,000 - 9,000 = 6,000"]},
           {q:"Estimate by rounding to nearest hundred:", parts:["456 + 345","891 - 234","1,267 + 734","950 - 449","678 + 321"], ans:["500 + 300 = 800","900 - 200 = 700","1,300 + 700 = 2,000","1,000 - 400 = 600","700 + 300 = 1,000"]},
           {q:"Is the estimate reasonable? (Yes/No):", parts:["4,567 + 3,456 ≈ 8,000 (exact: 8,023)","8,901 - 2,345 ≈ 7,000 (exact: 6,556)","99 + 99 ≈ 200 (exact: 198)","5,000 - 1 ≈ 4,000 (exact: 4,999)","12,345 + 12,345 ≈ 24,000 (exact: 24,690)"], ans:["Yes","Yes","Yes","No — 5,000 is closer","Yes"]}
         ],
         wordProblems:[
           "A shop earned Rs 4,567 on Monday and Rs 3,456 on Tuesday. Estimate the total earnings.",
           "A tank had 8,901 liters. 2,345 liters were used. Estimate how much is left.",
           "Ali has 12,678 marbles and Sara has 7,345. Estimate how many they have together.",
           "A school has 9,500 books. 4,499 were borrowed. Estimate how many are in the library.",
           "Two trucks carried 45,678 kg and 23,456 kg. Estimate the total weight."
         ],
         quiz:[
           {q:"Estimate: 4,567 + 3,456 ≈ ?",a:["7,000","8,000","9,000","6,000"],c:1},
           {q:"Estimate: 8,901 - 2,345 ≈ ?",a:["5,000","6,000","7,000","8,000"],c:2},
           {q:"Why do we estimate?",a:["To get exact answers","To check if answers make sense","To skip problems","To round numbers"],c:1},
           {q:"Estimate: 12,678 + 7,345 ≈ ?",a:["19,000","20,000","21,000","18,000"],c:1},
           {q:"Round 4,567 to nearest thousand:",a:["4,000","5,000","4,500","4,600"],c:1},
           {q:"Estimate: 9,876 - 4,321 ≈ ?",a:["5,000","6,000","7,000","4,000"],c:1},
           {q:"Which is the best estimate for 456 + 345?",a:["700","800","900","1,000"],c:1},
           {q:"Estimate: 99,500 + 500 ≈ ?",a:["99,000","100,000","101,000","99,500"],c:1}
         ]
        },
        {t:"Word Problems", c:"Word problems test your ability to identify which operation to use. Key words: 'total', 'sum', 'altogether', 'combined' mean addition. 'Remaining', 'left', 'difference', 'less' mean subtraction.",
         examples:[
           "Ali had 2,350 marbles. He gave 1,175 to his friend. How many are left? 2,350 - 1,175 = 1,175",
           "A library has 5,678 English books and 4,322 Urdu books. Total books? 5,678 + 4,322 = 10,000",
           "A farmer harvested 12,456 kg of wheat. He sold 8,234 kg. How much is left? 12,456 - 8,234 = 4,222",
           "Shop A earned Rs 34,567 and Shop B earned Rs 45,433. Combined earnings? 34,567 + 45,433 = 80,000",
           "A tank has 8,000 liters. 3,567 liters leak out. How much remains? 8,000 - 3,567 = 4,433",
           "Sara scored 456 in Term 1 and 544 in Term 2. What is her total? 456 + 544 = 1,000"
         ],
         exercises:[
           {q:"Solve each word problem:", parts:[
             "A school has 12,345 boys and 11,678 girls. Find the total students.",
             "Ali has Rs 50,000. He buys a phone for Rs 34,567. How much money is left?",
             "Two trains carried 23,456 and 34,567 passengers. How many passengers altogether?",
             "A city had 100,000 trees. 34,567 were cut down. How many remain?",
             "A factory made 45,678 items in January and 54,322 in February. Find the total.",
             "Sara had 8,000 stickers. She gave away 2,345 and lost 1,234. How many does she have?"
           ], ans:["24,023","15,433","58,023","65,433","100,000","4,421"]},
           {q:"Which operation? Write + or -:", parts:[
             "Ali earned Rs 5,000 and then spent Rs 2,345.",
             "Two classes have 45 and 38 students. Total?",
             "A pool has 10,000 liters. 3,456 evaporated.",
             "Sara collected 234 shells. Her sister collected 345. How many altogether?",
             "A shop had 5,000 items. 1,234 were sold."
           ], ans:["- (subtraction)","+ (addition)","- (subtraction)","+ (addition)","- (subtraction)"]}
         ],
         wordProblems:[
           "A village has 23,456 men, 24,567 women, and 12,345 children. What is the total population?",
           "Ali had Rs 100,000. He spent Rs 34,567 on furniture and Rs 23,456 on electronics. How much is left?",
           "A school collected 45,678 bottles for recycling in March and 34,322 in April. How many bottles in total?",
           "A farmer had 25,000 kg of grain. He sold 12,345 kg and used 5,678 kg at home. How much remains?",
           "Three friends saved Rs 12,345, Rs 23,456, and Rs 14,199. What is their combined savings?"
         ],
         quiz:[
           {q:"Ali had 2,350 marbles, gave 1,175. How many left?",a:["1,075","1,175","1,275","1,375"],c:1},
           {q:"5,678 + 4,322 = ?",a:["9,000","10,000","9,900","10,100"],c:1},
           {q:"'How many are left?' means:",a:["Addition","Subtraction","Multiplication","Division"],c:1},
           {q:"100,000 - 34,567 = ?",a:["65,433","66,433","64,433","65,333"],c:0},
           {q:"'Altogether' means:",a:["Subtract","Add","Multiply","Divide"],c:1},
           {q:"12,456 - 8,234 = ?",a:["4,222","4,122","4,322","3,222"],c:0},
           {q:"A school has 12,345 + 11,678 students. Total?",a:["23,023","24,023","24,123","23,923"],c:1},
           {q:"50,000 - 34,567 = ?",a:["15,433","16,433","15,333","14,433"],c:0}
         ]
        }
      ] },
      { title: "Multiplication & Division", content: "Multiplication of large numbers. Long division step by step. Multiplication tables. Estimation. Word problems.", key: "mult_div5", hasMathSub: true, subs: [
        {t:"Large Multiplication", c:"To multiply large numbers, break them into parts. Multiply by ones digit first, then tens digit, then add. Always line up digits carefully by place value.",
         examples:[
           "234 × 6 = 1,404",
           "234 × 50 = 11,700",
           "234 × 56 = 1,404 + 11,700 = 13,104",
           "456 × 23 = 456 × 3 + 456 × 20 = 1,368 + 9,120 = 10,488",
           "125 × 40 = 5,000 (multiply by 4, then add a zero)",
           "300 × 50 = 15,000 (3 × 5 = 15, then add three zeros)",
           "999 × 9 = 8,991"
         ],
         exercises:[
           {q:"Multiply:", parts:["234 × 56","456 × 23","125 × 40","678 × 15","345 × 67","999 × 9","500 × 80","123 × 45"], ans:["13,104","10,488","5,000","10,170","23,115","8,991","40,000","5,535"]},
           {q:"Multiply by 10, 100, 1000:", parts:["456 × 10","456 × 100","456 × 1,000","78 × 10","78 × 100","78 × 1,000"], ans:["4,560","45,600","456,000","780","7,800","78,000"]},
           {q:"Fill in the blank:", parts:["234 × ___ = 1,404","___ × 50 = 5,000","300 × ___ = 15,000","___ × 9 = 8,991","125 × ___ = 5,000"], ans:["6","100","50","999","40"]},
           {q:"True or False:", parts:["456 × 0 = 0","456 × 1 = 456","300 × 50 = 1,500","999 × 9 = 8,991","125 × 8 = 1,000"], ans:["True","True","False — it's 15,000","True","True"]}
         ],
         wordProblems:[
           "A box contains 234 pencils. How many pencils are in 56 boxes?",
           "A farmer plants 125 seeds in each row. He has 40 rows. How many seeds in total?",
           "Each student pays Rs 456 for a trip. If 23 students go, what is the total cost?",
           "A factory produces 678 items per day. How many in 15 days?",
           "A book has 345 pages. How many pages in 67 copies?"
         ],
         quiz:[
           {q:"234 × 56 = ?",a:["12,104","13,104","13,204","14,104"],c:1},
           {q:"456 × 10 = ?",a:["456","4,560","45,600","4,506"],c:1},
           {q:"Any number × 0 = ?",a:["That number","1","0","Undefined"],c:2},
           {q:"125 × 8 = ?",a:["900","950","1,000","1,100"],c:2},
           {q:"300 × 50 = ?",a:["1,500","15,000","150,000","150"],c:1},
           {q:"Fill: ___ × 9 = 8,991",a:["899","999","989","998"],c:1},
           {q:"456 × 100 = ?",a:["4,560","45,600","456,000","456"],c:1},
           {q:"678 × 15 = ?",a:["10,070","10,170","10,270","9,170"],c:1}
         ]
        },
        {t:"Long Division", c:"Long division has 4 steps that repeat: Divide, Multiply, Subtract, Bring down. Keep repeating until no digits are left to bring down.",
         examples:[
           "846 ÷ 3 = 282 (3 into 8 = 2r2, bring down 4 = 24, 3 into 24 = 8, bring down 6, 3 into 6 = 2)",
           "1,245 ÷ 5 = 249 (5 into 12 = 2r2, bring down 4 = 24, 5 into 24 = 4r4, bring down 5 = 45, 5 into 45 = 9)",
           "7,200 ÷ 8 = 900",
           "5,040 ÷ 7 = 720",
           "9,999 ÷ 9 = 1,111",
           "4,368 ÷ 4 = 1,092",
           "6,125 ÷ 5 = 1,225"
         ],
         exercises:[
           {q:"Divide:", parts:["846 ÷ 3","1,245 ÷ 5","7,200 ÷ 8","5,040 ÷ 7","9,999 ÷ 9","4,368 ÷ 4","6,125 ÷ 5","3,648 ÷ 6"], ans:["282","249","900","720","1,111","1,092","1,225","608"]},
           {q:"Divide with remainder:", parts:["847 ÷ 3","100 ÷ 7","250 ÷ 8","1,000 ÷ 3","503 ÷ 2","999 ÷ 4"], ans:["282 r1","14 r2","31 r2","333 r1","251 r1","249 r3"]},
           {q:"Fill in the blank:", parts:["___ ÷ 5 = 249","846 ÷ ___ = 282","___ ÷ 9 = 1,111","7,200 ÷ ___ = 900","___ ÷ 7 = 720"], ans:["1,245","3","9,999","8","5,040"]},
           {q:"True or False:", parts:["846 ÷ 3 = 282","1,245 ÷ 5 = 259","Any number ÷ 1 = that number","0 ÷ 5 = 0","100 ÷ 0 = 0"], ans:["True","False — it's 249","True","True","False — can't divide by zero"]}
         ],
         wordProblems:[
           "846 students are divided into 3 equal groups. How many students in each group?",
           "A farmer has 1,245 apples to pack in bags of 5. How many bags are needed?",
           "Rs 7,200 is shared equally among 8 workers. How much does each get?",
           "5,040 books are placed on 7 shelves equally. How many books per shelf?",
           "A rope 6,125 cm long is cut into 5 equal pieces. How long is each piece?"
         ],
         quiz:[
           {q:"846 ÷ 3 = ?",a:["272","282","292","262"],c:1},
           {q:"1,245 ÷ 5 = ?",a:["259","239","249","229"],c:2},
           {q:"The 4 steps of long division are:",a:["Add, Subtract, Multiply, Divide","Divide, Multiply, Subtract, Bring down","Bring down, Add, Multiply, Divide","Subtract, Divide, Add, Bring down"],c:1},
           {q:"7,200 ÷ 8 = ?",a:["800","850","900","950"],c:2},
           {q:"Can you divide by zero?",a:["Yes, answer is 0","Yes, answer is 1","No, it's undefined","Yes, answer is infinity"],c:2},
           {q:"9,999 ÷ 9 = ?",a:["1,111","1,011","1,101","1,110"],c:0},
           {q:"847 ÷ 3 = ?",a:["282","282 r1","283","281 r2"],c:1},
           {q:"5,040 ÷ 7 = ?",a:["700","710","720","730"],c:2}
         ]
        },
        {t:"Multiplication Tables", c:"Knowing tables from 1 to 12 by heart makes math much faster. Quick tricks help you remember them easily.",
         examples:[
           "×2 table: just double the number (7 × 2 = 14)",
           "×5 table: always ends in 0 or 5 (5, 10, 15, 20, 25...)",
           "×9 trick: tens go up, ones go down (9, 18, 27, 36, 45, 54, 63, 72, 81, 90)",
           "×10 table: add a zero (7 × 10 = 70)",
           "×11 table (up to 9): repeat the digit (7 × 11 = 77)",
           "×4 table: double the ×2 answer (7 × 4 = 7 × 2 × 2 = 28)"
         ],
         exercises:[
           {q:"Fill in quickly:", parts:["7 × 8 =","6 × 9 =","8 × 12 =","9 × 7 =","11 × 6 =","12 × 5 =","4 × 8 =","3 × 12 =","7 × 7 =","8 × 9 ="], ans:["56","54","96","63","66","60","32","36","49","72"]},
           {q:"What × what = ?", parts:["___ × 7 = 56","___ × 9 = 108","___ × 8 = 96","___ × 6 = 72","___ × 5 = 60","___ × 11 = 132"], ans:["8","12","12","12","12","12"]},
           {q:"True or False:", parts:["7 × 8 = 56","6 × 9 = 56","12 × 12 = 144","8 × 7 = 7 × 8","9 × 6 = 52"], ans:["True","False — it's 54","True","True — multiplication is commutative","False — it's 54"]}
         ],
         wordProblems:[
           "A carton has 12 eggs. How many eggs in 8 cartons?",
           "Each row has 9 chairs. There are 7 rows. How many chairs?",
           "Ali reads 6 pages every day. How many pages in 11 days?",
           "A bus makes 5 trips daily. How many trips in 12 days?",
           "Each packet has 8 biscuits. How many biscuits in 9 packets?"
         ],
         quiz:[
           {q:"7 × 8 = ?",a:["54","56","58","48"],c:1},
           {q:"6 × 9 = ?",a:["52","54","56","64"],c:1},
           {q:"12 × 12 = ?",a:["124","134","144","154"],c:2},
           {q:"×9 trick: 9 × 7 — tens digit is:",a:["5","6","7","8"],c:1},
           {q:"Any number × 1 = ?",a:["0","1","That number","10"],c:2},
           {q:"8 × 9 = ?",a:["63","72","81","64"],c:1},
           {q:"Which equals 96?",a:["8 × 11","8 × 12","9 × 12","7 × 12"],c:1},
           {q:"11 × 7 = ?",a:["67","77","87","78"],c:1}
         ]
        },
        {t:"Estimation in Multiplication", c:"Round numbers before multiplying for a quick estimate. This helps check if your exact answer is reasonable.",
         examples:[
           "48 × 31 ≈ 50 × 30 = 1,500 (exact: 1,488)",
           "198 × 5 ≈ 200 × 5 = 1,000 (exact: 990)",
           "67 × 42 ≈ 70 × 40 = 2,800 (exact: 2,814)",
           "312 × 9 ≈ 300 × 9 = 2,700 (exact: 2,808)",
           "495 × 21 ≈ 500 × 20 = 10,000 (exact: 10,395)",
           "89 × 11 ≈ 90 × 10 = 900 (exact: 979)"
         ],
         exercises:[
           {q:"Estimate by rounding:", parts:["48 × 31","198 × 5","67 × 42","312 × 9","495 × 21","89 × 11","52 × 19","203 × 48"], ans:["50×30 = 1,500","200×5 = 1,000","70×40 = 2,800","300×9 = 2,700","500×20 = 10,000","90×10 = 900","50×20 = 1,000","200×50 = 10,000"]},
           {q:"Is the estimate reasonable?", parts:["48 × 31 ≈ 1,500 (exact 1,488)","198 × 5 ≈ 1,000 (exact 990)","67 × 42 ≈ 2,800 (exact 2,814)","89 × 11 ≈ 900 (exact 979)","495 × 21 ≈ 10,000 (exact 10,395)"], ans:["Yes","Yes","Yes","Yes","Yes"]}
         ],
         wordProblems:[
           "A shop sells about 48 items daily. Estimate sales for 31 days.",
           "Each ticket costs Rs 198. Estimate the cost of 5 tickets.",
           "A bus carries about 67 passengers. Estimate passengers in 42 trips.",
           "A worker earns Rs 312 per day. Estimate earnings for 9 days.",
           "A school has 495 students. Each needs about 21 notebooks. Estimate total notebooks needed."
         ],
         quiz:[
           {q:"Estimate: 48 × 31 ≈ ?",a:["1,200","1,500","1,800","2,000"],c:1},
           {q:"Estimate: 198 × 5 ≈ ?",a:["800","900","1,000","1,100"],c:2},
           {q:"Why estimate multiplication?",a:["To get exact answer","To check if answer is reasonable","To skip calculation","To round numbers"],c:1},
           {q:"Estimate: 67 × 42 ≈ ?",a:["2,400","2,600","2,800","3,000"],c:2},
           {q:"Estimate: 495 × 21 ≈ ?",a:["8,000","9,000","10,000","11,000"],c:2},
           {q:"Round 312 to nearest hundred:",a:["300","310","320","400"],c:0},
           {q:"Estimate: 89 × 11 ≈ ?",a:["800","900","1,000","1,100"],c:1},
           {q:"Estimate: 52 × 19 ≈ ?",a:["800","900","1,000","1,100"],c:2}
         ]
        },
        {t:"Word Problems", c:"Read carefully. 'Each', 'per', 'every' often mean multiplication. 'Shared equally', 'divided into', 'split' mean division.",
         examples:[
           "A shop sells 45 packets daily. In 30 days: 45 × 30 = 1,350 packets",
           "Rs 7,200 shared among 8 workers: 7,200 ÷ 8 = Rs 900 each",
           "12 boxes with 24 items each: 12 × 24 = 288 items total",
           "1,245 sweets for 5 children equally: 1,245 ÷ 5 = 249 each",
           "A car travels 65 km per hour for 8 hours: 65 × 8 = 520 km",
           "4,368 students in 4 houses equally: 4,368 ÷ 4 = 1,092 per house"
         ],
         exercises:[
           {q:"Solve:", parts:[
             "A shop sells 45 packets daily. How many in 30 days?",
             "Rs 7,200 is shared equally among 8 workers. How much each?",
             "12 boxes with 24 items each. Total items?",
             "1,245 sweets divided among 5 children equally. How many each?",
             "A car travels 65 km per hour for 8 hours. Total distance?",
             "4,368 students divided into 4 houses equally. How many per house?"
           ], ans:["1,350","900","288","249","520","1,092"]},
           {q:"Which operation? × or ÷:", parts:[
             "15 bags with 12 oranges each. Total oranges?",
             "Rs 5,000 shared among 4 friends.",
             "A train makes 6 trips daily for 25 days.",
             "846 books placed equally on 3 shelves.",
             "Each child gets 8 sweets from 96 total."
           ], ans:["× (multiply)","÷ (divide)","× (multiply)","÷ (divide)","÷ (divide)"]}
         ],
         wordProblems:[
           "A baker makes 125 rotis per hour. How many in 8 hours?",
           "9,999 pencils are packed equally into 9 boxes. How many per box?",
           "A school bus makes 3 trips daily carrying 45 students each. How many students travel daily?",
           "A farmer has 5,040 mangoes to fill 7 crates equally. How many per crate?",
           "Each classroom has 6 rows with 8 desks. The school has 12 classrooms. How many desks total?"
         ],
         quiz:[
           {q:"45 × 30 = ?",a:["1,250","1,350","1,450","1,550"],c:1},
           {q:"7,200 ÷ 8 = ?",a:["800","850","900","950"],c:2},
           {q:"'Shared equally' means:",a:["Add","Subtract","Multiply","Divide"],c:3},
           {q:"12 × 24 = ?",a:["278","288","298","268"],c:1},
           {q:"'Each' and 'per' usually mean:",a:["Addition","Subtraction","Multiplication","Division"],c:2},
           {q:"1,245 ÷ 5 = ?",a:["239","249","259","229"],c:1},
           {q:"65 × 8 = ?",a:["500","510","520","530"],c:2},
           {q:"4,368 ÷ 4 = ?",a:["1,082","1,092","1,102","992"],c:1}
         ]
        }
      ] },
      { title: "Factors & Multiples", content: "Factors, multiples, prime and composite numbers, LCM, HCF, divisibility rules.", key: "factors", hasMathSub: true, subs: [
        {t:"Factors & Multiples", c:"Factors divide evenly into a number. Multiples are what you get when you multiply a number.",
         examples:["Factors of 12: 1, 2, 3, 4, 6, 12","Factors of 20: 1, 2, 4, 5, 10, 20","Multiples of 4: 4, 8, 12, 16, 20, 24...","Multiples of 7: 7, 14, 21, 28, 35...","Every number is a factor of itself","1 is a factor of every number"],
         exercises:[{q:"List all factors:", parts:["18","24","36","48","60","100"], ans:["1,2,3,6,9,18","1,2,3,4,6,8,12,24","1,2,3,4,6,9,12,18,36","1,2,3,4,6,8,12,16,24,48","1,2,3,4,5,6,10,12,15,20,30,60","1,2,4,5,10,20,25,50,100"]},{q:"List first 5 multiples:", parts:["6","8","9","11","12","15"], ans:["6,12,18,24,30","8,16,24,32,40","9,18,27,36,45","11,22,33,44,55","12,24,36,48,60","15,30,45,60,75"]},{q:"True or False:", parts:["7 is a factor of 49","5 is a factor of 23","36 is a multiple of 9","15 is a multiple of 4","1 is a factor of every number"], ans:["True","False","True","False","True"]}],
         wordProblems:["Ali has 24 sweets to share equally. What are the possible group sizes?","A number is a multiple of both 4 and 6. What is the smallest such number?","Is 56 a multiple of 7? How do you check?","List all factors of 30 that are also factors of 45.","A teacher wants to arrange 36 students in equal rows. What are the options?"],
         quiz:[{q:"Factors of 18:",a:["1,2,3,6,9,18","1,2,3,9,18","1,2,6,9,18","1,3,6,9,18"],c:0},{q:"3rd multiple of 7:",a:["14","21","28","35"],c:1},{q:"Is 5 a factor of 35?",a:["Yes","No","Sometimes","Only if even"],c:0},{q:"How many factors does 12 have?",a:["4","5","6","7"],c:2},{q:"Which is NOT a multiple of 6?",a:["12","18","22","30"],c:2},{q:"Factors of a prime number:",a:["1 only","1 and itself","Many","None"],c:1},{q:"First common multiple of 3 and 4:",a:["6","8","12","24"],c:2},{q:"Is 1 a factor of 100?",a:["Yes","No","Only for odd","Only for even"],c:0}]
        },
        {t:"Prime & Composite", c:"A prime number has exactly 2 factors: 1 and itself. A composite number has more than 2 factors. 1 is neither prime nor composite.",
         examples:["Primes up to 20: 2, 3, 5, 7, 11, 13, 17, 19","Composites up to 20: 4, 6, 8, 9, 10, 12, 14, 15, 16, 18, 20","2 is the only even prime number","1 is neither prime nor composite","9 = 3 × 3, so 9 is composite","Every even number greater than 2 is composite"],
         exercises:[{q:"Prime or Composite?", parts:["7","12","23","15","29","27","31","49","51","2"], ans:["Prime","Composite","Prime","Composite","Prime","Composite","Prime","Composite","Composite","Prime"]},{q:"List all primes between:", parts:["1 and 10","10 and 20","20 and 30","30 and 50"], ans:["2,3,5,7","11,13,17,19","23,29","31,37,41,43,47"]},{q:"True or False:", parts:["All prime numbers are odd","1 is a prime number","Every composite number has more than 2 factors","2 is the smallest prime","91 is prime"], ans:["False — 2 is even and prime","False","True","True","False — 91 = 7 × 13"]}],
         wordProblems:["Is the number of days in a week (7) prime or composite?","Ali says 51 is prime. Is he correct? Explain.","List all prime numbers between 40 and 60.","Can a prime number end in 0? Why or why not?","How many prime numbers are there between 1 and 30?"],
         quiz:[{q:"Which is prime?",a:["9","15","23","21"],c:2},{q:"2 is:",a:["Composite","Neither","The only even prime","Odd prime"],c:2},{q:"Is 1 prime?",a:["Yes","No","Sometimes","Only in math"],c:1},{q:"Factors of a prime:",a:["Only 1","Only itself","1 and itself","Many"],c:2},{q:"Which is composite?",a:["7","11","15","13"],c:2},{q:"Primes between 10 and 20:",a:["11,13,17,19","11,13,15,17","10,12,14,16","11,12,13,17"],c:0},{q:"Is 49 prime?",a:["Yes","No — it's 7×7","No — it's 6×8","Yes — odd numbers are prime"],c:1},{q:"Smallest prime number:",a:["0","1","2","3"],c:2}]
        },
        {t:"LCM", c:"LCM (Least Common Multiple) is the smallest number that is a multiple of two or more numbers.",
         examples:["LCM(4,6): Multiples of 4: 4,8,12,16... Multiples of 6: 6,12,18... LCM = 12","LCM(3,5) = 15","LCM(6,8) = 24","LCM(10,15) = 30","LCM(2,3,4) = 12","If one number is a multiple of the other, LCM = the larger number. LCM(4,12) = 12"],
         exercises:[{q:"Find the LCM:", parts:["4 and 6","3 and 5","6 and 8","10 and 15","8 and 12","5 and 7","9 and 12","2, 3 and 5"], ans:["12","15","24","30","24","35","36","30"]},{q:"True or False:", parts:["LCM(4,6) = 12","LCM(5,10) = 10","LCM(3,7) = 21","LCM(8,12) = 48","LCM is always ≥ the larger number"], ans:["True","True","True","False — it's 24","True"]}],
         wordProblems:["Two bells ring every 4 and 6 minutes. After how many minutes will they ring together?","Ali visits a shop every 3 days, Sara every 5 days. If both visit today, when will they visit together again?","Bus A comes every 10 minutes, Bus B every 15 minutes. When will both come at the same time?","Find the smallest number divisible by both 8 and 12.","Three lights blink every 2, 3, and 5 seconds. When do all three blink together?"],
         quiz:[{q:"LCM(4,6) = ?",a:["10","12","18","24"],c:1},{q:"LCM(3,5) = ?",a:["8","10","15","30"],c:2},{q:"LCM(5,10) = ?",a:["5","10","15","50"],c:1},{q:"LCM stands for:",a:["Largest Common Multiple","Least Common Multiple","Last Common Multiple","Lower Common Multiple"],c:1},{q:"LCM(6,8) = ?",a:["14","24","48","6"],c:1},{q:"LCM(2,3,4) = ?",a:["6","12","24","8"],c:1},{q:"LCM is always ___ the larger number",a:["Less than","Equal to or greater than","Equal to","Smaller than"],c:1},{q:"LCM(7,7) = ?",a:["1","7","14","49"],c:1}]
        },
        {t:"HCF", c:"HCF (Highest Common Factor) is the largest number that divides two or more numbers evenly.",
         examples:["HCF(12,18): Factors of 12: 1,2,3,4,6,12. Factors of 18: 1,2,3,6,9,18. Common: 1,2,3,6. HCF = 6","HCF(8,20) = 4","HCF(15,25) = 5","HCF(24,36) = 12","HCF(7,13) = 1 (co-prime numbers)","HCF is always ≤ the smaller number"],
         exercises:[{q:"Find the HCF:", parts:["12 and 18","8 and 20","15 and 25","24 and 36","14 and 21","30 and 45","16 and 24","7 and 13"], ans:["6","4","5","12","7","15","8","1"]},{q:"True or False:", parts:["HCF(12,18) = 6","HCF(7,13) = 1","HCF is always ≤ the smaller number","HCF(10,10) = 10","HCF(5,15) = 15"], ans:["True","True","True","True","False — it's 5"]}],
         wordProblems:["Divide 24 boys and 36 girls into equal groups with no one left. What is the largest group size?","A rope 18m and another 24m are cut into equal pieces (longest possible). How long is each piece?","Find the HCF of 30 and 45. Use it to simplify 30/45.","Two numbers have HCF 1. What are they called?","Ali has 16 red and 24 blue marbles. He makes equal groups with same number of each color. What's the max per group?"],
         quiz:[{q:"HCF(12,18) = ?",a:["3","6","9","12"],c:1},{q:"HCF(8,20) = ?",a:["2","4","8","10"],c:1},{q:"HCF stands for:",a:["Highest Common Factor","Highest Common Fraction","Half Common Factor","High Count Factor"],c:0},{q:"HCF(7,13) = ?",a:["1","7","13","91"],c:0},{q:"HCF is always ___ the smaller number",a:["Greater than","Equal to or less than","Greater than or equal to","None"],c:1},{q:"HCF(24,36) = ?",a:["6","8","12","24"],c:2},{q:"Co-prime means HCF = ?",a:["0","1","Both numbers","Undefined"],c:1},{q:"HCF(15,25) = ?",a:["3","5","10","15"],c:1}]
        },
        {t:"Divisibility Rules", c:"Quick ways to check if a number divides evenly without doing full division.",
         examples:["By 2: last digit is even (0,2,4,6,8)","By 3: sum of digits divisible by 3. Example: 345 → 3+4+5 = 12 → 12÷3 = 4 ✓","By 5: ends in 0 or 5","By 9: sum of digits divisible by 9. Example: 729 → 7+2+9 = 18 → 18÷9 = 2 ✓","By 10: ends in 0","By 4: last two digits divisible by 4. Example: 1,324 → 24÷4 = 6 ✓"],
         exercises:[{q:"Divisible by 2?", parts:["456","123","890","347","1,000","5,671"], ans:["Yes","No","Yes","No","Yes","No"]},{q:"Divisible by 3?", parts:["345","124","999","250","612","805"], ans:["Yes (3+4+5=12)","No (1+2+4=7)","Yes (9+9+9=27)","No (2+5+0=7)","Yes (6+1+2=9)","No (8+0+5=13)"]},{q:"Divisible by 5?", parts:["345","124","990","251","1,000","5,673"], ans:["Yes","No","Yes","No","Yes","No"]},{q:"Divisible by 9?", parts:["729","345","918","250","999","123"], ans:["Yes (18)","No (12)","Yes (18)","No (7)","Yes (27)","No (6)"]}],
         wordProblems:["Is 4,356 divisible by 3? Show your working.","A number ends in 0. Which numbers is it definitely divisible by?","Can a number be divisible by both 2 and 5? Give an example.","Is 7,245 divisible by 9? Use the divisibility rule.","Ali has 345 sweets. Can he share them equally among 5 friends?"],
         quiz:[{q:"Divisibility rule for 3:",a:["Last digit is 3","Sum of digits ÷ 3","Ends in 0 or 3","Last two digits ÷ 3"],c:1},{q:"Is 456 divisible by 2?",a:["Yes","No"],c:0},{q:"345 divisible by 5?",a:["Yes","No"],c:0},{q:"Rule for 10:",a:["Ends in 0","Ends in 5","Sum of digits = 10","Even number"],c:0},{q:"Is 729 divisible by 9?",a:["Yes (7+2+9=18)","No","Yes (7+2+9=17)","Cannot tell"],c:0},{q:"Divisible by both 2 and 5:",a:["Must end in 0","Must end in 5","Must be odd","Must end in 2"],c:0},{q:"Is 124 divisible by 3?",a:["Yes","No (1+2+4=7)","Yes (1+2+4=6)","Cannot tell"],c:1},{q:"Rule for 4:",a:["Last digit ÷ 4","Last 2 digits ÷ 4","Sum ÷ 4","Ends in 4"],c:1}]
        }
      ] },
      { title: "Fractions", content: "Proper/improper fractions, mixed numbers, equivalent fractions, simplifying, operations.", key: "fractions5", hasMathSub: true, subs: [
        {t:"Proper & Improper", c:"Proper fraction: numerator < denominator (less than 1). Improper fraction: numerator ≥ denominator (≥ 1).",
         examples:["Proper: 3/4, 2/5, 1/8, 5/12","Improper: 7/4, 5/3, 9/2, 12/5","5/5 = 1 (equal parts = whole)","At the boundary: 4/4 = 1, 8/8 = 1"],
         exercises:[{q:"Classify as Proper or Improper:", parts:["3/7","9/4","5/5","2/11","15/8","7/12","6/6","11/3"], ans:["Proper","Improper","Improper (=1)","Proper","Improper","Proper","Improper (=1)","Improper"]}],
         wordProblems:["Ali ate 3 slices of a pizza cut into 8 pieces. Write as a fraction. Is it proper or improper?","Sara has 7/4 of a cake. Is this more or less than one whole cake?","Write five proper fractions with denominator 10."],
         quiz:[{q:"3/7 is:",a:["Proper","Improper","Mixed","None"],c:0},{q:"Which is improper?",a:["3/8","5/9","9/4","2/7"],c:2},{q:"5/5 equals:",a:["0","1","5","1/5"],c:1},{q:"Proper fraction is always:",a:["Greater than 1","Less than 1","Equal to 1","Greater than 0"],c:1},{q:"11/3 is:",a:["Proper","Improper","Mixed","Zero"],c:1},{q:"Which is proper?",a:["7/4","9/2","3/8","5/3"],c:2}]
        },
        {t:"Mixed Numbers", c:"A mixed number has a whole part and a fraction: 2¾. Convert improper → mixed by dividing. Convert mixed → improper by multiplying and adding.",
         examples:["7/4 = 1¾ (7÷4 = 1 remainder 3)","11/3 = 3⅔ (11÷3 = 3 remainder 2)","2¾ = (2×4+3)/4 = 11/4","5½ = (5×2+1)/2 = 11/2"],
         exercises:[{q:"Convert to mixed number:", parts:["7/4","11/3","9/2","15/4","13/5","17/6"], ans:["1¾","3⅔","4½","3¾","2⅗","2⅚"]},{q:"Convert to improper fraction:", parts:["2¾","3½","1⅔","4¼","5⅗","2⅚"], ans:["11/4","7/2","5/3","17/4","28/5","17/6"]}],
         wordProblems:["Ali has 11/4 meters of rope. Write as a mixed number.","Sara baked 3½ dozen cookies. How many dozens is that as an improper fraction?","A jug holds 7/2 liters. Express as a mixed number."],
         quiz:[{q:"7/4 as mixed:",a:["1¼","1½","1¾","2¼"],c:2},{q:"2¾ as improper:",a:["8/4","9/4","10/4","11/4"],c:3},{q:"11/3 as mixed:",a:["3⅓","3½","3⅔","4⅓"],c:2},{q:"3½ as improper:",a:["5/2","6/2","7/2","8/2"],c:2},{q:"15/4 as mixed:",a:["3¼","3½","3¾","4¼"],c:2},{q:"To convert mixed → improper:",a:["Add","Multiply whole by denom, add numer","Subtract","Divide"],c:1}]
        },
        {t:"Equivalent Fractions", c:"Fractions that look different but have the same value. Multiply or divide both parts by the same number.",
         examples:["1/2 = 2/4 = 3/6 = 4/8 = 5/10","2/3 = 4/6 = 6/9 = 8/12","3/4 = 6/8 = 9/12 = 12/16"],
         exercises:[{q:"Find equivalent fractions:", parts:["1/2 = ?/6","2/3 = ?/9","3/4 = ?/12","1/5 = ?/20","4/5 = ?/15","2/7 = ?/14"], ans:["3/6","6/9","9/12","4/20","12/15","4/14"]},{q:"Are these equivalent? (Yes/No):", parts:["2/4 and 3/6","1/3 and 3/8","4/6 and 6/9","5/10 and 3/6"], ans:["Yes (both = 1/2)","No","Yes (both = 2/3)","Yes (both = 1/2)"]}],
         wordProblems:["Ali ate 2/4 of a pizza and Sara ate 3/6. Did they eat the same amount?","Find three fractions equivalent to 3/5.","Is 4/8 the same as 1/2? Prove it."],
         quiz:[{q:"1/2 = ?/8",a:["2","3","4","5"],c:2},{q:"2/3 = 6/?",a:["6","8","9","12"],c:2},{q:"Which equals 3/4?",a:["6/9","8/12","9/16","6/8"],c:3},{q:"Are 2/4 and 1/2 equivalent?",a:["Yes","No"],c:0},{q:"4/6 simplified:",a:["2/4","2/3","3/4","1/2"],c:1},{q:"To make equivalent fractions:",a:["Add same number","Multiply both by same number","Subtract","Divide top only"],c:1}]
        },
        {t:"Simplifying", c:"Divide both numerator and denominator by their HCF to get the simplest form.",
         examples:["8/12: HCF(8,12) = 4 → 8÷4/12÷4 = 2/3","6/9: HCF = 3 → 2/3","15/25: HCF = 5 → 3/5","10/10 = 1","20/30: HCF = 10 → 2/3"],
         exercises:[{q:"Simplify:", parts:["8/12","6/9","15/25","10/20","4/16","12/18","9/27","20/30","14/21","25/100"], ans:["2/3","2/3","3/5","1/2","1/4","2/3","1/3","2/3","2/3","1/4"]}],
         wordProblems:["Simplify 24/36 and explain your steps.","Ali scored 15 out of 25. Write as a simplified fraction.","A class has 12 boys out of 30 students. Simplify the fraction of boys."],
         quiz:[{q:"8/12 simplified:",a:["4/6","2/3","2/4","4/8"],c:1},{q:"15/25 simplified:",a:["3/5","5/3","1/5","5/25"],c:0},{q:"To simplify, divide by:",a:["LCM","HCF","Sum","Difference"],c:1},{q:"6/9 simplified:",a:["3/9","2/9","2/3","3/6"],c:2},{q:"10/20 simplified:",a:["1/2","5/10","2/4","1/10"],c:0},{q:"Which is already simplest?",a:["4/8","6/9","3/7","10/15"],c:2}]
        },
        {t:"Add & Subtract Fractions", c:"Same denominator: add/subtract numerators. Different denominators: find LCM first, make equivalent, then operate.",
         examples:["2/7 + 3/7 = 5/7","1/3 + 1/4 = 4/12 + 3/12 = 7/12","5/6 - 1/6 = 4/6 = 2/3","3/4 - 1/3 = 9/12 - 4/12 = 5/12"],
         exercises:[{q:"Add:", parts:["2/7 + 3/7","1/4 + 2/4","1/3 + 1/6","2/5 + 1/3","3/8 + 1/4","1/2 + 1/3"], ans:["5/7","3/4","3/6 = 1/2","6/15+5/15 = 11/15","3/8+2/8 = 5/8","3/6+2/6 = 5/6"]},{q:"Subtract:", parts:["5/7 - 2/7","3/4 - 1/4","5/6 - 1/3","3/4 - 1/3","7/8 - 1/2","2/3 - 1/4"], ans:["3/7","2/4 = 1/2","5/6 - 2/6 = 3/6 = 1/2","9/12 - 4/12 = 5/12","7/8 - 4/8 = 3/8","8/12 - 3/12 = 5/12"]}],
         wordProblems:["Ali ate 1/4 of a cake and Sara ate 1/3. How much did they eat together?","A tank is 3/4 full. 1/3 is used. How much is left?","Ali walked 2/5 km and then 1/3 km more. Total distance?"],
         quiz:[{q:"2/7 + 3/7 = ?",a:["5/7","5/14","6/7","1"],c:0},{q:"1/3 + 1/4 = ?",a:["2/7","2/12","7/12","1/7"],c:2},{q:"5/6 - 1/6 = ?",a:["4/6","4/12","2/3","Both A and C"],c:3},{q:"Same denominator: add the:",a:["Denominators","Numerators","Both","Neither"],c:1},{q:"3/4 - 1/3 = ?",a:["2/1","5/12","1/6","4/12"],c:1},{q:"Different denominators → find:",a:["HCF","LCM","Sum","Product"],c:1}]
        },
        {t:"Multiply Fractions", c:"Multiply numerators together and denominators together. Simplify the result.",
         examples:["2/3 × 4/5 = 8/15","1/2 × 3/4 = 3/8","5/6 × 3/10 = 15/60 = 1/4","Any fraction × 1 = itself","Any fraction × 0 = 0"],
         exercises:[{q:"Multiply:", parts:["2/3 × 4/5","1/2 × 3/4","5/6 × 3/10","2/5 × 5/8","3/7 × 7/9","4/5 × 1/2"], ans:["8/15","3/8","15/60 = 1/4","10/40 = 1/4","21/63 = 1/3","4/10 = 2/5"]}],
         wordProblems:["Ali has 3/4 of a pizza. He eats 1/2 of it. How much pizza did he eat?","A recipe needs 2/3 cup of sugar. If making half the recipe, how much sugar?","A field is 5/6 km long. A farmer plows 3/10 of it. How much was plowed?"],
         quiz:[{q:"2/3 × 4/5 = ?",a:["6/8","8/15","8/8","6/15"],c:1},{q:"1/2 × 3/4 = ?",a:["4/6","3/8","3/6","4/8"],c:1},{q:"To multiply fractions:",a:["Cross multiply","Top × top, bottom × bottom","Add","Find LCM"],c:1},{q:"5/6 × 3/10 = ?",a:["8/16","15/60","2/16","1/2"],c:1},{q:"Any fraction × 0 = ?",a:["That fraction","1","0","Undefined"],c:2},{q:"3/4 × 4/3 = ?",a:["12/12 = 1","7/7","1/1","9/16"],c:0}]
        }
      ] },
      { title: "Decimals", content: "Decimal place value, fraction-decimal conversion, operations, comparing.", key: "decimals5", hasMathSub: true, subs: [
        {t:"Decimal Place Value", c:"The decimal point separates wholes from parts. Tenths = 1/10, Hundredths = 1/100, Thousandths = 1/1000.",
         examples:["3.47: 3 ones, 4 tenths, 7 hundredths","0.5 = 5 tenths = 5/10 = 1/2","0.25 = 25 hundredths = 25/100 = 1/4","12.08: 1 ten, 2 ones, 0 tenths, 8 hundredths"],
         exercises:[{q:"Write the place value of the underlined digit:", parts:["3.[4]7","0.[2]5","12.0[8]","5.6[3]","0.[9]1","100.[0]5"], ans:["4 tenths","2 tenths","8 hundredths","3 hundredths","9 tenths","0 tenths"]}],
         wordProblems:["A pencil costs Rs 12.50. What does the 5 represent?","Ali ran 3.75 km. Break down each digit's value.","The temperature is 36.8°C. What place is the 8 in?"],
         quiz:[{q:"In 3.47, the 4 is in:",a:["Ones","Tenths","Hundredths","Thousands"],c:1},{q:"0.25 = ?",a:["25/10","25/100","25/1000","2/5"],c:1},{q:"Tenths place is ___ decimal point:",a:["Before","1st after","2nd after","3rd after"],c:1},{q:"12.08: the 8 is in:",a:["Tenths","Hundredths","Ones","Tens"],c:1},{q:"0.5 as fraction:",a:["5/100","5/10","5/1000","1/5"],c:1},{q:"How many decimal places in 3.456?",a:["1","2","3","4"],c:2}]
        },
        {t:"Fractions ↔ Decimals", c:"Fraction to decimal: divide numerator by denominator. Decimal to fraction: use place value then simplify.",
         examples:["1/2 = 0.5","1/4 = 0.25","3/4 = 0.75","1/5 = 0.2","0.6 = 6/10 = 3/5","0.125 = 125/1000 = 1/8"],
         exercises:[{q:"Convert fraction to decimal:", parts:["1/2","1/4","3/4","1/5","2/5","3/8","7/10","1/8"], ans:["0.5","0.25","0.75","0.2","0.4","0.375","0.7","0.125"]},{q:"Convert decimal to fraction:", parts:["0.5","0.25","0.75","0.6","0.8","0.125","0.04","0.9"], ans:["1/2","1/4","3/4","3/5","4/5","1/8","1/25","9/10"]}],
         wordProblems:["Ali ate 3/4 of a pizza. Express as a decimal.","A bottle is 0.75 liters. Express as a fraction.","Sara scored 7/10 on a test. What decimal is that?"],
         quiz:[{q:"1/4 as decimal:",a:["0.4","0.25","0.14","0.75"],c:1},{q:"0.6 as fraction:",a:["6/100","3/5","6/5","1/6"],c:1},{q:"3/4 as decimal:",a:["0.34","0.43","0.75","0.80"],c:2},{q:"0.125 as fraction:",a:["1/8","1/4","1/5","1/125"],c:0},{q:"1/5 as decimal:",a:["0.5","0.15","0.2","0.25"],c:2},{q:"0.9 as fraction:",a:["9/100","1/9","9/10","90/10"],c:2}]
        },
        {t:"Add & Subtract Decimals", c:"Line up decimal points vertically. Add trailing zeros if needed. Then add or subtract normally.",
         examples:["3.45 + 2.70 = 6.15","10.00 - 4.56 = 5.44","0.5 + 0.25 = 0.75","7.8 - 3.45 = 7.80 - 3.45 = 4.35"],
         exercises:[{q:"Add:", parts:["3.45 + 2.7","0.5 + 0.25","12.34 + 5.66","8.9 + 1.1","0.75 + 0.25","45.67 + 4.33"], ans:["6.15","0.75","18.00","10.0","1.00","50.00"]},{q:"Subtract:", parts:["10.00 - 4.56","7.8 - 3.45","5.00 - 2.75","9.5 - 0.75","100.00 - 45.67","3.4 - 1.85"], ans:["5.44","4.35","2.25","8.75","54.33","1.55"]}],
         wordProblems:["Ali bought items for Rs 45.50 and Rs 23.75. What is the total?","Sara had Rs 100.00. She spent Rs 67.85. How much is left?","Two ropes are 3.45m and 2.7m long. What is their total length?"],
         quiz:[{q:"3.45 + 2.7 = ?",a:["5.15","6.15","6.25","5.75"],c:1},{q:"10.00 - 4.56 = ?",a:["5.44","5.54","6.44","5.34"],c:0},{q:"Key rule for adding decimals:",a:["Line up last digits","Line up decimal points","Line up first digits","No rule"],c:1},{q:"0.5 + 0.25 = ?",a:["0.30","0.75","0.70","1.00"],c:1},{q:"7.8 - 3.45 = ?",a:["4.35","4.45","3.35","4.25"],c:0},{q:"5.00 - 2.75 = ?",a:["2.25","2.75","3.25","2.35"],c:0}]
        },
        {t:"Comparing Decimals", c:"Compare digit by digit from left. Add trailing zeros to make lengths equal. The first different digit determines which is larger.",
         examples:["0.5 > 0.45 (compare: 0.50 vs 0.45, tenths 5 > 4)","3.14 < 3.2 (compare: 3.14 vs 3.20, tenths 1 < 2)","0.30 = 0.3 (trailing zeros don't change value)","7.891 > 7.89 (7.891 vs 7.890)"],
         exercises:[{q:"Write > , < or = :", parts:["0.5 ___ 0.45","3.14 ___ 3.2","0.30 ___ 0.3","7.89 ___ 7.9","1.05 ___ 1.50","0.99 ___ 1.0","2.500 ___ 2.5","4.56 ___ 4.560"], ans:[">","<","=","<","<","<","=","="]},{q:"Arrange in ascending order:", parts:["0.5, 0.45, 0.55, 0.4","3.14, 3.2, 3.09, 3.15","1.1, 1.01, 1.10, 0.99"], ans:["0.4, 0.45, 0.5, 0.55","3.09, 3.14, 3.15, 3.2","0.99, 1.01, 1.1, 1.10"]}],
         wordProblems:["Ali ran 3.14 km and Sara ran 3.2 km. Who ran farther?","Which is heavier: 0.5 kg or 0.45 kg?","Arrange these prices from cheapest: Rs 9.99, Rs 10.00, Rs 9.90, Rs 10.01"],
         quiz:[{q:"0.5 vs 0.45:",a:["0.5 < 0.45","0.5 > 0.45","Equal","Cannot compare"],c:1},{q:"3.14 vs 3.2:",a:["3.14 > 3.2","3.14 < 3.2","Equal","Cannot compare"],c:1},{q:"0.30 vs 0.3:",a:["0.30 > 0.3","0.30 < 0.3","Equal","0.30 is bigger"],c:2},{q:"To compare decimals:",a:["Count digits","Line up decimal points, compare left to right","Always pick longer number","Ignore decimals"],c:1},{q:"Which is largest?",a:["0.9","0.99","0.09","0.909"],c:1},{q:"0.99 vs 1.0:",a:["0.99 > 1.0","Equal","0.99 < 1.0","Cannot tell"],c:2}]
        }
      ] },
      { title: "Ratio & Percentage", content: "Simple ratios, converting to fractions, basic percentages, real-life problems.", key: "ratio5", hasMathSub: true, subs: [
        {t:"Simple Ratios", c:"A ratio compares two quantities. Written as a:b. Order matters. Can be simplified like fractions.",
         examples:["2 boys, 3 girls → ratio 2:3","4:6 simplified = 2:3 (divide both by 2)","10:15 = 2:3","Ratio of 8 to 12 = 8:12 = 2:3"],
         exercises:[{q:"Write the ratio and simplify:", parts:["6 boys to 9 girls","10 red to 15 blue","8 cats to 12 dogs","20 apples to 30 oranges","4 to 4","100 to 50"], ans:["6:9 = 2:3","10:15 = 2:3","8:12 = 2:3","20:30 = 2:3","4:4 = 1:1","100:50 = 2:1"]}],
         wordProblems:["A class has 15 boys and 20 girls. Find the ratio of boys to girls in simplest form.","Mix paint in ratio 2:5. If you use 6 cups of color A, how many cups of color B?","A recipe uses flour and sugar in ratio 3:1. If you use 9 cups of flour, how much sugar?"],
         quiz:[{q:"Ratio of 6 to 9 simplified:",a:["6:9","3:2","2:3","1:3"],c:2},{q:"10:15 = ?",a:["5:3","2:3","3:2","1:3"],c:1},{q:"Order matters in ratio?",a:["Yes","No","Sometimes","Never"],c:0},{q:"4:4 simplified:",a:["4:4","2:2","1:1","0:0"],c:2},{q:"Ratio 2:5, total parts:",a:["3","5","7","10"],c:2},{q:"20:30 simplified:",a:["2:3","4:6","10:15","1:3"],c:0}]
        },
        {t:"Ratio to Fraction", c:"In ratio a:b, fraction of first = a/(a+b), fraction of second = b/(a+b).",
         examples:["Ratio 2:3 → first part = 2/5, second = 3/5","10 sweets in ratio 2:3 → group A = 4, group B = 6","Ratio 1:4 → first = 1/5 = 20%, second = 4/5 = 80%"],
         exercises:[{q:"Convert ratio to fractions:", parts:["2:3","1:4","3:7","5:5","1:1","4:1"], ans:["2/5 and 3/5","1/5 and 4/5","3/10 and 7/10","5/10=1/2 and 1/2","1/2 and 1/2","4/5 and 1/5"]},{q:"Divide the amount by ratio:", parts:["Rs 100 in ratio 2:3","40 sweets in ratio 3:5","60 marks in ratio 1:2","Rs 500 in ratio 4:1"], ans:["Rs 40 and Rs 60","15 and 25","20 and 40","Rs 400 and Rs 100"]}],
         wordProblems:["Ali and Sara share Rs 200 in ratio 3:2. How much does each get?","A rope is cut in ratio 2:5. Total length is 70 cm. Find each piece.","Paint is mixed in ratio 1:3. If total is 8 liters, how much of each color?"],
         quiz:[{q:"Ratio 2:3, first fraction:",a:["2/3","3/5","2/5","3/2"],c:2},{q:"Rs 100 in ratio 2:3:",a:["Rs 20 and Rs 30","Rs 40 and Rs 60","Rs 50 and Rs 50","Rs 60 and Rs 40"],c:1},{q:"Ratio 1:4, total parts:",a:["3","4","5","14"],c:2},{q:"40 sweets in ratio 3:5:",a:["15 and 25","20 and 20","24 and 16","12 and 28"],c:0},{q:"Ratio 1:1 means:",a:["Unequal","Equal shares","First gets more","Second gets more"],c:1},{q:"Ratio 4:1, first fraction:",a:["1/4","4/5","1/5","4/1"],c:1}]
        },
        {t:"Basic Percentages", c:"Percent = per hundred. 50% = 50/100 = 1/2. Key percentages: 25% = 1/4, 50% = 1/2, 75% = 3/4, 100% = whole.",
         examples:["50% of 200 = 100","25% of 80 = 20","10% of 500 = 50","75% of 40 = 30","100% of anything = itself","1% of 300 = 3"],
         exercises:[{q:"Find:", parts:["50% of 200","25% of 80","10% of 500","75% of 40","20% of 150","5% of 1,000","100% of 45","1% of 600"], ans:["100","20","50","30","30","50","45","6"]},{q:"Convert to percentage:", parts:["1/2","1/4","3/4","1/5","2/5","1/10","3/10","7/10"], ans:["50%","25%","75%","20%","40%","10%","30%","70%"]}],
         wordProblems:["Ali scored 75 out of 100. What percentage?","A shirt costs Rs 800. There is a 25% discount. How much do you save?","50% of students in a class of 40 are girls. How many girls?","A test has 20 questions. Sara got 80% correct. How many did she get right?","10% of 500 students were absent. How many were present?"],
         quiz:[{q:"50% of 200:",a:["50","100","150","200"],c:1},{q:"25% = ?",a:["1/2","1/3","1/4","1/5"],c:2},{q:"10% of 500:",a:["5","50","500","0.5"],c:1},{q:"75% of 40:",a:["10","20","30","35"],c:2},{q:"100% means:",a:["Nothing","Half","The whole thing","Double"],c:2},{q:"1% of 600:",a:["0.6","6","60","600"],c:1},{q:"What % is 1/2?",a:["25%","50%","75%","100%"],c:1},{q:"20% of 150:",a:["20","25","30","35"],c:2}]
        },
        {t:"Real-life Problems", c:"Percentages are used in discounts, marks, tax, tips, and everyday calculations.",
         examples:["25% discount on Rs 800: save Rs 200, pay Rs 600","Ali scored 45/50: percentage = (45/50)×100 = 90%","Tax of 10% on Rs 1,000: tax = Rs 100, total = Rs 1,100","Tip of 15% on Rs 500: tip = Rs 75"],
         exercises:[{q:"Solve:", parts:["25% discount on Rs 1,200. How much do you pay?","Ali scored 36/40. What percentage?","10% tax on Rs 2,500. Total amount?","A class of 50 has 80% attendance. How many present?","Price increased by 20% from Rs 500. New price?"], ans:["Rs 900","90%","Rs 2,750","40","Rs 600"]}],
         wordProblems:["A shopkeeper gives 15% discount on Rs 2,000. Find the selling price.","Sara scored 72 out of 80. What is her percentage?","A town's population grew by 10% from 50,000. What is the new population?","Ali saves 25% of his Rs 4,000 salary. How much does he save?","A TV costs Rs 30,000 with 5% tax. What is the total price?"],
         quiz:[{q:"25% discount on Rs 1,200:",a:["Pay Rs 800","Pay Rs 900","Pay Rs 1,000","Pay Rs 300"],c:1},{q:"Score 36/40 = ?%",a:["80%","85%","90%","95%"],c:2},{q:"10% tax on Rs 2,500:",a:["Rs 250 tax","Rs 25 tax","Rs 2,500 tax","Rs 500 tax"],c:0},{q:"80% of 50:",a:["35","40","45","50"],c:1},{q:"Price Rs 500 + 20%:",a:["Rs 520","Rs 550","Rs 600","Rs 700"],c:2},{q:"15% of Rs 2,000:",a:["Rs 200","Rs 250","Rs 300","Rs 350"],c:2}]
        }
      ] },
      { title: "Measurement", content: "Length, mass, capacity, unit conversions, time, temperature.", key: "measurement5", hasMathSub: true, subs: [
        {t:"Length, Mass, Capacity", c:"Length: mm, cm, m, km. Mass: g, kg. Capacity: mL, L. Use the right unit for each situation.",
         examples:["A pencil is about 15 cm long","A road is measured in km","A bag of flour weighs 1 kg = 1,000 g","A medicine spoon holds about 5 mL","A water bottle holds about 500 mL = 0.5 L","Your height is measured in cm or m"],
         exercises:[{q:"Choose the best unit (mm/cm/m/km/g/kg/mL/L):", parts:["Length of a book","Distance to school","Weight of an apple","Water in a pool","Thickness of a coin","Weight of a car","Medicine dose","Length of a football field"], ans:["cm","km","g","L","mm","kg","mL","m"]}],
         wordProblems:["Ali's book is 25 cm long and 18 cm wide. What unit is used?","A truck carries 5,000 kg. Express in a larger unit.","A recipe needs 250 mL of milk. How many such cups make 1 L?","The school is 2 km away. Express in meters.","A tablet weighs 500 mg. How many tablets make 1 g?"],
         quiz:[{q:"Best unit for road length:",a:["cm","m","km","mm"],c:2},{q:"1 kg = ?",a:["10 g","100 g","1,000 g","10,000 g"],c:2},{q:"1 L = ?",a:["10 mL","100 mL","1,000 mL","10,000 mL"],c:2},{q:"Height measured in:",a:["km","mm","cm or m","mL"],c:2},{q:"Medicine dose in:",a:["L","kg","mL","km"],c:2},{q:"A car's weight in:",a:["g","mg","kg","cm"],c:2}]
        },
        {t:"Unit Conversions", c:"Bigger to smaller: multiply. Smaller to bigger: divide. Key: 1 km=1000m, 1 m=100cm, 1 kg=1000g, 1 L=1000mL.",
         examples:["3.5 km = 3,500 m (×1,000)","250 cm = 2.5 m (÷100)","2 kg 500 g = 2,500 g","750 mL = 0.75 L (÷1,000)","4 m 50 cm = 450 cm","1.5 L = 1,500 mL"],
         exercises:[{q:"Convert:", parts:["3.5 km to m","250 cm to m","2 kg 500 g to g","750 mL to L","4 m 50 cm to cm","1.5 L to mL","5,000 m to km","3,200 g to kg"], ans:["3,500 m","2.5 m","2,500 g","0.75 L","450 cm","1,500 mL","5 km","3.2 kg"]}],
         wordProblems:["A rope is 3 m 45 cm long. Express in cm only.","Ali walked 2.5 km. How many meters is that?","A jug holds 1.5 L. How many 250 mL cups can it fill?","A parcel weighs 3 kg 200 g. Express in grams.","The distance is 4,500 m. Express in km."],
         quiz:[{q:"3.5 km = ? m",a:["350","3,500","35,000","35"],c:1},{q:"250 cm = ? m",a:["25","2.5","0.25","250"],c:1},{q:"Bigger → smaller:",a:["Divide","Multiply","Subtract","Add"],c:1},{q:"750 mL = ? L",a:["7.5","75","0.75","0.075"],c:2},{q:"1 m = ? cm",a:["10","100","1,000","1"],c:1},{q:"5,000 g = ? kg",a:["50","500","5","0.5"],c:2}]
        },
        {t:"Time", c:"1 hour = 60 minutes. 1 minute = 60 seconds. 1 day = 24 hours. Carry over when minutes exceed 60.",
         examples:["2 hr 45 min + 1 hr 30 min = 4 hr 15 min","3 hr 20 min - 1 hr 50 min = 1 hr 30 min","90 minutes = 1 hr 30 min","2.5 hours = 2 hr 30 min","From 9:15 AM to 11:45 AM = 2 hr 30 min"],
         exercises:[{q:"Add:", parts:["2 hr 45 min + 1 hr 30 min","3 hr 50 min + 2 hr 25 min","5 hr 40 min + 1 hr 35 min","45 min + 30 min"], ans:["4 hr 15 min","6 hr 15 min","7 hr 15 min","1 hr 15 min"]},{q:"Subtract:", parts:["5 hr 30 min - 2 hr 45 min","3 hr 20 min - 1 hr 50 min","10 hr 00 min - 4 hr 35 min","2 hr 15 min - 55 min"], ans:["2 hr 45 min","1 hr 30 min","5 hr 25 min","1 hr 20 min"]},{q:"Convert:", parts:["90 min to hr and min","150 min to hr and min","2.5 hr to min","3 hr 15 min to min"], ans:["1 hr 30 min","2 hr 30 min","150 min","195 min"]}],
         wordProblems:["A movie starts at 2:30 PM and lasts 2 hr 15 min. When does it end?","Ali studied from 4:45 PM to 7:00 PM. How long did he study?","A train journey takes 5 hr 40 min. It departs at 8:20 AM. When does it arrive?","Sara slept at 9:30 PM and woke at 6:15 AM. How long did she sleep?","A recipe takes 1 hr 45 min. Ali started at 3:30 PM. When will it be done?"],
         quiz:[{q:"2 hr 45 min + 1 hr 30 min:",a:["3 hr 75 min","4 hr 15 min","4 hr 75 min","3 hr 15 min"],c:1},{q:"90 min = ?",a:["1 hr","1 hr 20 min","1 hr 30 min","2 hr"],c:2},{q:"1 hour = ? seconds",a:["60","360","600","3,600"],c:3},{q:"3 hr 20 min - 1 hr 50 min:",a:["1 hr 30 min","2 hr 30 min","1 hr 70 min","2 hr 10 min"],c:0},{q:"2.5 hours = ?",a:["2 hr 5 min","2 hr 50 min","2 hr 30 min","2 hr 25 min"],c:2},{q:"1 day = ? hours",a:["12","20","24","48"],c:2}]
        },
        {t:"Temperature", c:"Measured in degrees Celsius (°C). Water freezes at 0°C, boils at 100°C. Body temperature ≈ 37°C.",
         examples:["Water freezes at 0°C","Water boils at 100°C","Normal body temperature: 37°C","Hot summer day: 40°C to 45°C","Cold winter day: 0°C to 10°C","Room temperature: about 25°C"],
         exercises:[{q:"Arrange from coldest to hottest:", parts:["25°C, 0°C, 100°C, 37°C","40°C, 10°C, 25°C, 5°C","-5°C, 0°C, 10°C, -10°C"], ans:["0, 25, 37, 100","5, 10, 25, 40","-10, -5, 0, 10"]},{q:"What temperature would you expect?", parts:["Ice cream","Boiling water","A nice spring day","Inside a freezer","Hot tea"], ans:["About -5°C to 0°C","100°C","About 20°C to 25°C","About -18°C","About 60°C to 70°C"]}],
         wordProblems:["The morning temperature is 15°C. By afternoon it rises 12°C. What is the afternoon temperature?","Water is at 80°C. How many more degrees to reach boiling point?","Ali has a fever of 39°C. How much above normal (37°C)?","The temperature dropped from 25°C to 8°C. By how many degrees?","Is -5°C hotter or colder than 0°C?"],
         quiz:[{q:"Water freezes at:",a:["10°C","0°C","100°C","-10°C"],c:1},{q:"Body temperature:",a:["25°C","30°C","37°C","40°C"],c:2},{q:"Water boils at:",a:["50°C","80°C","100°C","120°C"],c:2},{q:"Hot summer day:",a:["10°C","25°C","40°C","0°C"],c:2},{q:"Room temperature:",a:["10°C","25°C","37°C","50°C"],c:1},{q:"-5°C is ___ than 0°C:",a:["Hotter","Colder","Same","Cannot tell"],c:1}]
        }
      ] },
      { title: "Geometry", content: "Lines, angles, parallel/perpendicular, 2D and 3D shapes.", key: "geometry5", hasMathSub: true, subs: [
        {t:"Lines & Angles", c:"Line: infinite both ways. Ray: one endpoint. Segment: two endpoints. Angles: right=90°, acute<90°, obtuse>90°, straight=180°.",
         examples:["Right angle = 90° (like corner of a book)","Acute angle: 30°, 45°, 60° (sharp, less than 90°)","Obtuse angle: 120°, 150° (wide, between 90° and 180°)","Straight angle = 180° (flat line)","Full rotation = 360°"],
         exercises:[{q:"Classify the angle:", parts:["45°","90°","120°","180°","60°","150°","89°","91°"], ans:["Acute","Right","Obtuse","Straight","Acute","Obtuse","Acute","Obtuse"]},{q:"True or False:", parts:["A right angle is exactly 90°","An acute angle can be 100°","A straight angle is 180°","An obtuse angle is less than 90°","All angles in a square are right angles"], ans:["True","False","True","False","True"]}],
         wordProblems:["The hands of a clock at 3:00 form what type of angle?","A door opened halfway (90°) forms what angle?","What type of angle does the letter V make?","Two roads meet at 120°. What type of angle?","How many degrees does the minute hand move in 1 hour?"],
         quiz:[{q:"Right angle:",a:["45°","90°","180°","360°"],c:1},{q:"Acute angle is:",a:["= 90°","< 90°","> 90°","= 180°"],c:1},{q:"Obtuse angle range:",a:["0° to 90°","90° to 180°","180° to 360°","Exactly 90°"],c:1},{q:"Straight angle:",a:["90°","180°","270°","360°"],c:1},{q:"Clock at 3:00 shows:",a:["Acute","Right","Obtuse","Straight"],c:1},{q:"Full rotation:",a:["90°","180°","270°","360°"],c:3}]
        },
        {t:"Parallel & Perpendicular", c:"Parallel lines never meet (like train tracks). Perpendicular lines meet at 90° (like a plus sign).",
         examples:["Train tracks are parallel","The corner of a room: walls meet at 90° (perpendicular)","The letter H has parallel vertical lines","A plus sign (+) shows perpendicular lines","Opposite edges of a ruler are parallel"],
         exercises:[{q:"Parallel or Perpendicular?", parts:["Train tracks","Corner of a book","Floor and wall","Opposite sides of a rectangle","The letter T","The letter Z (top and bottom lines)"], ans:["Parallel","Perpendicular","Perpendicular","Parallel","Perpendicular","Parallel"]},{q:"True or False:", parts:["Parallel lines meet at infinity","Perpendicular lines form 90°","A square has both parallel and perpendicular lines","Two lines can be both parallel and perpendicular"], ans:["They never meet","True","True","False"]}],
         wordProblems:["Name 3 examples of parallel lines you see in daily life.","Name 3 examples of perpendicular lines around you.","Are the two rails of a railway track parallel or perpendicular?","Is the crossbar of a goal post perpendicular to the posts?","In the letter E, which lines are parallel?"],
         quiz:[{q:"Parallel lines:",a:["Meet at 90°","Never meet","Cross once","Meet at 180°"],c:1},{q:"Perpendicular angle:",a:["45°","60°","90°","180°"],c:2},{q:"Train tracks are:",a:["Perpendicular","Parallel","Neither","Both"],c:1},{q:"Symbol for parallel:",a:["⊥","||","=","≠"],c:1},{q:"Symbol for perpendicular:",a:["⊥","||","=","∠"],c:0},{q:"A square has:",a:["Only parallel","Only perpendicular","Both","Neither"],c:2}]
        },
        {t:"2D Shapes", c:"Flat shapes with length and width. Key properties: sides, angles, symmetry.",
         examples:["Square: 4 equal sides, 4 right angles","Rectangle: opposite sides equal, 4 right angles","Triangle: 3 sides, angles sum = 180°","Circle: no sides, no corners, one curved edge","Pentagon: 5 sides, Hexagon: 6 sides, Octagon: 8 sides"],
         exercises:[{q:"Name the shape:", parts:["4 equal sides, 4 right angles","3 sides","No corners, round","5 sides","Opposite sides equal, 4 right angles","8 sides"], ans:["Square","Triangle","Circle","Pentagon","Rectangle","Octagon"]},{q:"How many sides?", parts:["Triangle","Square","Pentagon","Hexagon","Octagon","Circle"], ans:["3","4","5","6","8","0 (curved)"]}],
         wordProblems:["A stop sign is what shape? How many sides does it have?","A clock face is what shape?","Name all quadrilaterals (4-sided shapes) you know.","Can a triangle have two right angles? Why not?","What shape has the most lines of symmetry?"],
         quiz:[{q:"Square has ___ equal sides:",a:["2","3","4","5"],c:2},{q:"Triangle angles sum:",a:["90°","180°","270°","360°"],c:1},{q:"Circle has ___ corners:",a:["1","2","4","0"],c:3},{q:"Hexagon sides:",a:["5","6","7","8"],c:1},{q:"Rectangle vs square:",a:["Same thing","Rectangle has all equal sides","Square has all equal sides","Neither has right angles"],c:2},{q:"Stop sign shape:",a:["Pentagon","Hexagon","Heptagon","Octagon"],c:3}]
        },
        {t:"3D Shapes", c:"Shapes with length, width, and height. They have faces, edges, and vertices (corners).",
         examples:["Cube: 6 square faces, 12 edges, 8 vertices (dice)","Cuboid: 6 rectangular faces (box, brick)","Sphere: perfectly round, 0 faces, 0 edges (ball)","Cylinder: 2 circular faces, 1 curved surface (can)","Cone: 1 circular base, 1 vertex at top (ice cream cone)","Pyramid: triangular faces meeting at a point"],
         exercises:[{q:"Name the 3D shape:", parts:["A dice","A football","A tin can","An ice cream cone","A brick","An Egyptian structure"], ans:["Cube","Sphere","Cylinder","Cone","Cuboid","Pyramid"]},{q:"Count faces, edges, vertices:", parts:["Cube","Cuboid","Cylinder","Cone","Sphere"], ans:["6 faces, 12 edges, 8 vertices","6, 12, 8","3 surfaces (2 flat + 1 curved), 2 edges, 0 vertices","2 surfaces (1 flat + 1 curved), 1 edge, 1 vertex","1 curved surface, 0 edges, 0 vertices"]}],
         wordProblems:["What 3D shape is a tennis ball?","A Toblerone box is what shape?","How is a cube different from a cuboid?","Name 3 objects shaped like a cylinder.","A party hat is what 3D shape?"],
         quiz:[{q:"Cube has ___ faces:",a:["4","6","8","12"],c:1},{q:"Sphere has ___ edges:",a:["0","1","2","4"],c:0},{q:"Cylinder looks like:",a:["A ball","A box","A can","A cone"],c:2},{q:"Cone has ___ vertex:",a:["0","1","2","3"],c:1},{q:"Cuboid faces:",a:["4 rectangles","6 rectangles","6 squares","8 rectangles"],c:1},{q:"Pyramid base shape:",a:["Always circle","Always square","Can vary","Always triangle"],c:2}]
        }
      ] },
      { title: "Perimeter, Area & Volume", content: "Perimeter of shapes, area of rectangles/squares, volume of cubes/cuboids, word problems.", key: "pav5", hasMathSub: true, subs: [
        {t:"Perimeter", c:"Perimeter = total distance around a shape. Add all sides.",
         examples:["Square (side 5cm): P = 4 × 5 = 20 cm","Rectangle (8×5cm): P = 2×(8+5) = 26 cm","Triangle (3,4,5cm): P = 3+4+5 = 12 cm","Regular pentagon (side 6cm): P = 5 × 6 = 30 cm"],
         exercises:[{q:"Find the perimeter:", parts:["Square, side 7 cm","Rectangle, 12 cm × 5 cm","Triangle, sides 6, 8, 10 cm","Square, side 15 m","Rectangle, 20 m × 10 m","Equilateral triangle, side 9 cm"], ans:["28 cm","34 cm","24 cm","60 m","60 m","27 cm"]}],
         wordProblems:["A garden is 25 m × 15 m. Find the perimeter. If fencing costs Rs 50/m, find total cost.","A square park has side 100 m. Ali runs around it 3 times. How far does he run?","A picture frame is 30 cm × 20 cm. How much border strip is needed?","A triangular field has sides 45 m, 60 m, and 75 m. Find its perimeter.","A room is 6 m × 4 m. Find the perimeter. If skirting costs Rs 120/m, find total cost."],
         quiz:[{q:"Square side 7, perimeter:",a:["14","21","28","49"],c:2},{q:"Rectangle 12×5, perimeter:",a:["17","34","60","120"],c:1},{q:"Perimeter formula for rectangle:",a:["l × w","2(l+w)","l + w","4 × side"],c:1},{q:"Equilateral triangle side 9:",a:["18","27","36","45"],c:1},{q:"Perimeter measures:",a:["Inside space","Distance around","Volume","Weight"],c:1},{q:"Square side 15m, P:",a:["30 m","45 m","60 m","225 m"],c:2}]
        },
        {t:"Area", c:"Area = space inside a shape. Measured in square units (cm², m²).",
         examples:["Square (side 5): A = 5 × 5 = 25 cm²","Rectangle (8×5): A = 8 × 5 = 40 cm²","A room 6 m × 4 m = 24 m²","Square (side 10): A = 100 cm²"],
         exercises:[{q:"Find the area:", parts:["Square, side 6 cm","Rectangle, 10 × 4 cm","Square, side 12 m","Rectangle, 15 × 8 m","Square, side 25 cm","Rectangle, 100 × 50 m"], ans:["36 cm²","40 cm²","144 m²","120 m²","625 cm²","5,000 m²"]}],
         wordProblems:["A room is 6 m × 4 m. If carpet costs Rs 500/m², find total cost.","A square garden has side 20 m. Find its area.","A wall is 5 m × 3 m. How many 1 m² tiles are needed?","A rectangular field is 100 m × 60 m. Find area in m².","A photo is 15 cm × 10 cm. Find its area."],
         quiz:[{q:"Square side 6, area:",a:["12","24","36","48"],c:2},{q:"Rectangle 10×4, area:",a:["14","28","40","80"],c:2},{q:"Area measured in:",a:["cm","m","cm²","cm³"],c:2},{q:"Square side 12m, area:",a:["48 m²","144 m²","24 m²","120 m²"],c:1},{q:"Area formula for rectangle:",a:["2(l+w)","l + w","l × w","4 × side"],c:2},{q:"Room 6×4m, carpet Rs500/m²:",a:["Rs 10,000","Rs 12,000","Rs 24,000","Rs 5,000"],c:1}]
        },
        {t:"Volume", c:"Volume = space inside a 3D shape. Measured in cubic units (cm³, m³).",
         examples:["Cube (side 3): V = 3×3×3 = 27 cm³","Cuboid (5×3×2): V = 5×3×2 = 30 cm³","Cube (side 10): V = 1,000 cm³ = 1 L","1 cm³ = 1 mL, 1,000 cm³ = 1 L"],
         exercises:[{q:"Find the volume:", parts:["Cube, side 4 cm","Cuboid, 6×3×2 cm","Cube, side 5 m","Cuboid, 10×5×4 cm","Cube, side 10 cm","Cuboid, 8×6×3 m"], ans:["64 cm³","36 cm³","125 m³","200 cm³","1,000 cm³","144 m³"]}],
         wordProblems:["A box is 5 cm × 3 cm × 2 cm. Find its volume.","A cube-shaped tank has side 10 cm. How many mL of water can it hold?","A room is 5 m × 4 m × 3 m. Find the volume of air inside.","A cuboid container is 20 × 10 × 15 cm. Find its volume in cm³.","A sugar cube has side 1 cm. What is its volume?"],
         quiz:[{q:"Cube side 4, volume:",a:["16","32","64","256"],c:2},{q:"Cuboid 6×3×2:",a:["11","24","36","72"],c:2},{q:"Volume measured in:",a:["cm","cm²","cm³","m"],c:2},{q:"Cube side 10, volume:",a:["30","100","1,000","10,000"],c:2},{q:"1,000 cm³ = ?",a:["1 mL","1 L","1 m³","10 L"],c:1},{q:"Volume formula for cuboid:",a:["l+w+h","l×w","2(l+w+h)","l×w×h"],c:3}]
        },
        {t:"Word Problems", c:"Apply perimeter, area, and volume formulas to real-life situations.",
         examples:["Garden 20×15m: P=70m, A=300m²","Cube tank side 10cm: V=1,000cm³=1L","Fencing 70m at Rs50/m: cost = Rs3,500","Carpet for 6×4m room at Rs500/m²: Rs12,000"],
         exercises:[{q:"Solve:", parts:["A garden 20×15m. Find P and A.","Fencing costs Rs 50/m. Garden P=70m. Total cost?","Carpet costs Rs 500/m². Room is 6×4m. Total cost?","A box 8×5×3cm. Find volume.","A cube tank side 20cm. Volume in liters?"], ans:["P=70m, A=300m²","Rs 3,500","Rs 12,000","120 cm³","8,000 cm³ = 8 L"]}],
         wordProblems:["A swimming pool is 25×10×2 m. How many liters of water does it hold?","A room 5×4m needs tiles costing Rs 800/m². Find total cost.","A rectangular park 200×150m is surrounded by a path. Find the perimeter.","A cube of side 6 cm. Find surface area (all 6 faces).","A farmer has a 100×80m field. He wants to fence it. Wire costs Rs 25/m. Total cost?"],
         quiz:[{q:"Garden 20×15m, perimeter:",a:["35 m","70 m","300 m","600 m"],c:1},{q:"Same garden, area:",a:["35 m²","70 m²","300 m²","600 m²"],c:2},{q:"Fencing 70m at Rs50/m:",a:["Rs 1,400","Rs 3,500","Rs 7,000","Rs 350"],c:1},{q:"Box 8×5×3 volume:",a:["16","40","120","240"],c:2},{q:"Cube side 20cm, volume:",a:["400","4,000","8,000","80"],c:2},{q:"Surface area of cube side 6:",a:["36","72","144","216"],c:3}]
        }
      ] },
      { title: "Data Handling", content: "Bar graphs, pictographs, line graphs, reading and interpreting data.", key: "data5", hasMathSub: true, subs: [
        {t:"Bar Graphs", c:"Bars represent data. Height shows value. Always has title, labeled axes, and scale.",
         examples:["Each bar represents a category (e.g., fruits sold)","The y-axis shows the quantity","Taller bar = larger value","Always start the scale at 0","Bars should be equal width with equal spacing"],
         exercises:[{q:"Read the bar graph data:", parts:["If the Mango bar reaches 25, how many mangoes?","Apple bar is at 15 and Banana at 20. Which is more?","The tallest bar is at 30. What does that tell you?","Difference between bar at 25 and bar at 10?","If scale goes by 5s, a bar between 15 and 20 is about?"], ans:["25 mangoes","Banana (20>15)","That category has the highest value (30)","Difference = 15","About 17-18"]}],
         wordProblems:["A bar graph shows: Math=30, Science=25, English=20, Urdu=15. Which subject has the most students? What is the total?","The tallest bar is 40 and shortest is 10. What is the range?","Draw a bar graph for: Red=8, Blue=12, Green=5, Yellow=10."],
         quiz:[{q:"Bar graph shows data using:",a:["Lines","Rectangles/bars","Circles","Dots"],c:1},{q:"Y-axis usually shows:",a:["Categories","Values/quantities","Title","Nothing"],c:1},{q:"Taller bar means:",a:["Less value","More value","Same value","No data"],c:1},{q:"Scale should start at:",a:["1","5","10","0"],c:3},{q:"Bar width should be:",a:["Different","Equal","Random","No rule"],c:1},{q:"Range = highest - lowest:",a:["True","False"],c:0}]
        },
        {t:"Pictographs", c:"Pictures/symbols represent data. A key shows what each symbol means.",
         examples:["🍎 = 5 apples. Three 🍎🍎🍎 = 15 apples","Half symbol (🍎) = half the value (2.5 apples)","Always include a key/legend","Easy to read at a glance"],
         exercises:[{q:"If 🍎 = 10 apples:", parts:["🍎🍎🍎 = ?","🍎🍎🍎🍎🍎 = ?","Half 🍎 = ?","🍎🍎 and half = ?"], ans:["30","50","5","25"]},{q:"If ⭐ = 4 students:", parts:["⭐⭐⭐ = ?","⭐⭐⭐⭐⭐ = ?","Half ⭐ = ?","How many ⭐ for 20 students?"], ans:["12","20","2","5"]}],
         wordProblems:["A pictograph uses 🌟 = 5 books. Ali read 🌟🌟🌟 and Sara read 🌟🌟🌟🌟. How many more books did Sara read?","Design a pictograph for: Class A=20, Class B=15, Class C=25 students, using 👤 = 5 students.","A pictograph shows 🚗🚗🚗 for Monday (🚗=10). How many cars on Monday?"],
         quiz:[{q:"Pictograph uses:",a:["Bars","Lines","Pictures/symbols","Circles"],c:2},{q:"🍎 = 5, then 🍎🍎🍎:",a:["3","5","10","15"],c:3},{q:"Key/legend tells:",a:["The title","What each symbol means","The total","Nothing"],c:1},{q:"Half symbol means:",a:["Zero","Half the value","Double","Full value"],c:1},{q:"⭐ = 4, how many ⭐ for 16?",a:["2","3","4","8"],c:2},{q:"Pictographs are easy to:",a:["Calculate","Read at a glance","Draw accurately","Ignore"],c:1}]
        },
        {t:"Line Graphs", c:"Points connected by lines show how data changes over time. Great for trends.",
         examples:["Temperature over a week: points go up and down","Line going up = increasing","Line going down = decreasing","Flat line = no change","Steeper line = faster change"],
         exercises:[{q:"Read the trend:", parts:["Line goes up from Monday to Friday","Line drops sharply on Saturday","Line stays flat Wednesday to Thursday","Line goes up slowly then steeply","Overall line goes from 10 to 50"], ans:["Increasing trend","Sharp decrease","No change","Slow then rapid increase","Overall increase of 40 units"]}],
         wordProblems:["Temperature readings: Mon=20°C, Tue=22°C, Wed=25°C, Thu=23°C, Fri=27°C. Describe the trend.","A plant grew: Week 1=2cm, Week 2=5cm, Week 3=9cm, Week 4=14cm. Is growth increasing or decreasing?","Sales: Jan=100, Feb=150, Mar=130, Apr=200. Which month had the biggest jump?"],
         quiz:[{q:"Line graphs show change over:",a:["Space","Time","Weight","Nothing"],c:1},{q:"Line going up means:",a:["Decrease","Increase","No change","Error"],c:1},{q:"Flat line means:",a:["Increase","Decrease","No change","Missing data"],c:2},{q:"Steeper line means:",a:["Slower change","Faster change","No change","Error"],c:1},{q:"Best for showing trends:",a:["Bar graph","Pie chart","Line graph","Table"],c:2},{q:"Line going down = ?",a:["Increasing","Decreasing","Steady","Cannot tell"],c:1}]
        },
        {t:"Interpreting Data", c:"Read the title first, check labels and scale, then answer questions about highest, lowest, difference, and trends.",
         examples:["Always read the title to know what the graph shows","Check x-axis and y-axis labels","Find highest and lowest values","Calculate differences between values","Look for patterns and trends"],
         exercises:[{q:"From data: Apples=30, Bananas=45, Oranges=20, Grapes=35:", parts:["Which fruit sold most?","Which sold least?","Difference between most and least?","Total fruits sold?","Average per fruit?"], ans:["Bananas (45)","Oranges (20)","45-20 = 25","130","130÷4 = 32.5"]}],
         wordProblems:["A graph shows test scores: Ali=85, Sara=92, Ahmed=78, Fatima=90. Who scored highest? What is the class average?","Monthly rainfall: Jan=5cm, Feb=3cm, Mar=8cm, Apr=12cm, May=15cm. Which month was driest? Describe the trend.","A shop's daily sales: Mon=200, Tue=350, Wed=150, Thu=400, Fri=500. Which was the busiest day? Total weekly sales?"],
         quiz:[{q:"First thing to read on a graph:",a:["Numbers","Title","Colors","Nothing"],c:1},{q:"Range = ?",a:["Highest + lowest","Highest - lowest","Average","Total"],c:1},{q:"From 30,45,20,35 — highest:",a:["30","35","45","20"],c:2},{q:"Average of 10,20,30,40:",a:["20","25","30","35"],c:1},{q:"Trend shows:",a:["Pattern over time","Only one value","Nothing","Colors"],c:0},{q:"Total of 30,45,20,35:",a:["100","120","130","150"],c:2}]
        }
      ] },
      { title: "Patterns & Sequences", content: "Number patterns, skip counting, finding missing numbers, sequences.", key: "patterns5", hasMathSub: true, subs: [
        {t:"Number Patterns", c:"A pattern follows a rule. Find the rule by looking at how each number changes to the next.",
         examples:["2, 4, 6, 8, 10... → rule: add 2","3, 6, 12, 24... → rule: multiply by 2","100, 90, 80, 70... → rule: subtract 10","1, 4, 9, 16, 25... → square numbers (1², 2², 3², 4², 5²)","1, 1, 2, 3, 5, 8... → Fibonacci (add previous two)"],
         exercises:[{q:"Find the rule and next 2 numbers:", parts:["5, 10, 15, 20, __, __","3, 6, 12, 24, __, __","100, 95, 90, 85, __, __","2, 6, 18, 54, __, __","1, 4, 9, 16, __, __","64, 32, 16, 8, __, __"], ans:["25, 30 (add 5)","48, 96 (×2)","80, 75 (subtract 5)","162, 486 (×3)","25, 36 (squares)","4, 2 (÷2)"]}],
         wordProblems:["Ali saves Rs 5 more each week: Week 1=Rs 10, Week 2=Rs 15, Week 3=Rs 20. How much in Week 6?","A ball bounces 100cm, then 50cm, then 25cm. What is the pattern? What is the next bounce?","A tree grows 3 cm each month. After 5 months it is 25 cm. How tall was it at the start?","Seats in rows: Row 1=5, Row 2=8, Row 3=11. How many in Row 6?","Pages read: Day 1=10, Day 2=20, Day 3=40. How many on Day 5?"],
         quiz:[{q:"5,10,15,20 — rule:",a:["Add 5","Add 10","Multiply 2","Subtract 5"],c:0},{q:"3,6,12,24 — rule:",a:["Add 3","Add 6","Multiply 2","Multiply 3"],c:2},{q:"Next: 100,90,80,70,?",a:["50","55","60","65"],c:2},{q:"1,4,9,16 are:",a:["Even numbers","Odd numbers","Square numbers","Prime numbers"],c:2},{q:"2,6,18,54 — rule:",a:["Add 4","Multiply 3","Add 12","Multiply 2"],c:1},{q:"64,32,16,8 — rule:",a:["Subtract 32","Divide by 2","Subtract 16","Divide by 4"],c:1}]
        },
        {t:"Skip Counting", c:"Counting by a number other than 1. Helps with multiplication and finding multiples.",
         examples:["By 3s: 3, 6, 9, 12, 15, 18, 21, 24, 27, 30","By 5s: 5, 10, 15, 20, 25, 30, 35, 40, 45, 50","By 7s: 7, 14, 21, 28, 35, 42, 49, 56, 63, 70","By 25s: 25, 50, 75, 100, 125, 150","Backward by 4s: 40, 36, 32, 28, 24, 20"],
         exercises:[{q:"Skip count and write next 5:", parts:["By 3s from 3","By 7s from 7","By 6s from 6","By 9s from 9","By 25s from 25","Backward by 5s from 50"], ans:["3,6,9,12,15,18","7,14,21,28,35,42","6,12,18,24,30,36","9,18,27,36,45,54","25,50,75,100,125,150","50,45,40,35,30,25"]}],
         wordProblems:["Count by 5s from 5 to 50. How many numbers?","A clock shows 3, 6, 9, 12. What skip count is this?","Ali has Rs 25 coins. He counts: 25, 50, 75... What comes next?","Seats are numbered: 4, 8, 12, 16... What is the 10th seat number?","Count backward by 3 from 30. List the first 6 numbers."],
         quiz:[{q:"Skip by 3: 3,6,9,__",a:["10","11","12","15"],c:2},{q:"Skip by 7: 7,14,__",a:["17","20","21","24"],c:2},{q:"Skip by 25: 25,50,75,__",a:["80","90","100","125"],c:2},{q:"Backward by 5: 50,45,40,__",a:["30","33","35","38"],c:2},{q:"Skip counting helps with:",a:["Addition only","Multiplication","Subtraction only","Nothing"],c:1},{q:"By 9s: 9,18,27,__",a:["30","33","36","45"],c:2}]
        },
        {t:"Finding Missing Numbers", c:"Use the pattern rule to find what number is missing in a sequence.",
         examples:["5, 10, __, 20, 25 → rule +5, missing = 15","2, 6, __, 54, 162 → rule ×3, missing = 18","100, __, 80, 70, 60 → rule -10, missing = 90","1, 4, __, 16, 25 → squares, missing = 9"],
         exercises:[{q:"Find the missing number:", parts:["5, 10, __, 20, 25","2, 6, __, 54","100, __, 80, 70","3, 6, __, 12, 15","__, 8, 12, 16, 20","10, 20, __, 40, 50","4, __, 16, 32, 64","1, 1, 2, __, 5, 8"], ans:["15","18","90","9","4","30","8","3"]}],
         wordProblems:["A sequence: 12, 24, ?, 48. Find the missing number.","Ali counted: 7, 14, ?, 28, 35. What number did he skip?","Pattern: 3, 9, 27, ?, 243. What is the missing number?","Seats: 5, ?, 15, 20, 25. Which seat is missing?","A ball bounces: 80, 40, ?, 10. Find the missing height."],
         quiz:[{q:"5, 10, __, 20:",a:["12","14","15","18"],c:2},{q:"2, 6, __, 54:",a:["12","18","24","36"],c:1},{q:"100, __, 80, 70:",a:["85","90","95","75"],c:1},{q:"3, 6, __, 12:",a:["7","8","9","10"],c:2},{q:"4, __, 16, 32:",a:["6","8","10","12"],c:1},{q:"1, 1, 2, __, 5, 8:",a:["2","3","4","5"],c:1}]
        },
        {t:"Simple Sequences", c:"An arithmetic sequence has a constant difference. A geometric sequence has a constant ratio.",
         examples:["Arithmetic: 2, 5, 8, 11, 14 → difference = 3","Arithmetic: 10, 7, 4, 1 → difference = -3","Geometric: 2, 4, 8, 16 → ratio = 2","Geometric: 81, 27, 9, 3 → ratio = 1/3","Finding next term: add the difference (arithmetic) or multiply by ratio (geometric)"],
         exercises:[{q:"Identify as Arithmetic or Geometric:", parts:["2, 5, 8, 11","3, 6, 12, 24","10, 7, 4, 1","5, 15, 45, 135","100, 80, 60, 40","1, 2, 4, 8"], ans:["Arithmetic (d=3)","Geometric (r=2)","Arithmetic (d=-3)","Geometric (r=3)","Arithmetic (d=-20)","Geometric (r=2)"]},{q:"Find next 3 terms:", parts:["2, 5, 8, 11, __, __, __","3, 6, 12, 24, __, __, __","100, 80, 60, __, __, __"], ans:["14, 17, 20","48, 96, 192","40, 20, 0"]}],
         wordProblems:["Ali's weekly allowance increases by Rs 10 each week starting from Rs 50. What is his allowance in week 5?","A bacteria colony doubles every hour: 1, 2, 4, 8... How many after 8 hours?","Temperatures drop by 3° each hour from 24°C. What is it after 5 hours?"],
         quiz:[{q:"2,5,8,11 is:",a:["Arithmetic","Geometric","Neither","Both"],c:0},{q:"3,6,12,24 is:",a:["Arithmetic","Geometric","Neither","Both"],c:1},{q:"Arithmetic has constant:",a:["Ratio","Difference","Sum","Product"],c:1},{q:"Geometric has constant:",a:["Difference","Ratio","Sum","Product"],c:1},{q:"Next: 2,5,8,11,?",a:["12","13","14","15"],c:2},{q:"Next: 3,6,12,24,?",a:["30","36","48","96"],c:2}]
        }
      ] },
      { title: "Basic Algebra", content: "Finding unknowns, simple equations, using symbols.", key: "algebra5", hasMathSub: true, subs: [
        {t:"Finding Unknowns", c:"An unknown is a number we need to find, represented by a letter like x. Think: what number makes the equation true?",
         examples:["x + 5 = 12 → x = 7 (what plus 5 gives 12?)","x - 3 = 10 → x = 13","2 × x = 14 → x = 7","x ÷ 4 = 5 → x = 20","x + x = 16 → x = 8","15 - x = 9 → x = 6"],
         exercises:[{q:"Find x:", parts:["x + 5 = 12","x - 3 = 10","x + 8 = 20","x - 7 = 15","x + 15 = 30","x - 20 = 5","x + x = 24","100 - x = 65"], ans:["x = 7","x = 13","x = 12","x = 22","x = 15","x = 25","x = 12","x = 35"]},{q:"Find x:", parts:["2x = 14","3x = 27","5x = 45","x ÷ 4 = 5","x ÷ 3 = 8","4x = 100","x ÷ 7 = 6","10x = 120"], ans:["x = 7","x = 9","x = 9","x = 20","x = 24","x = 25","x = 42","x = 12"]}],
         wordProblems:["Ali has some marbles. After getting 5 more, he has 12. How many did he start with?","A number minus 3 equals 10. Find the number.","Double a number is 14. What is the number?","Sara divides her stickers equally into 4 groups of 5. How many total stickers?","I think of a number, add 15, and get 30. What is my number?"],
         quiz:[{q:"x + 5 = 12, x = ?",a:["5","6","7","8"],c:2},{q:"2x = 14, x = ?",a:["5","6","7","8"],c:2},{q:"x - 3 = 10, x = ?",a:["7","10","13","30"],c:2},{q:"x ÷ 4 = 5, x = ?",a:["1","9","15","20"],c:3},{q:"x + x = 16, x = ?",a:["4","8","16","32"],c:1},{q:"15 - x = 9, x = ?",a:["4","5","6","24"],c:2},{q:"3x = 27, x = ?",a:["3","8","9","81"],c:2},{q:"100 - x = 65, x = ?",a:["25","30","35","45"],c:2}]
        },
        {t:"Simple Equations", c:"An equation has = sign. Both sides must balance. Do the same operation to both sides to solve.",
         examples:["x + 3 = 10 → subtract 3 from both: x = 7","x - 5 = 8 → add 5 to both: x = 13","2x = 14 → divide both by 2: x = 7","x/3 = 6 → multiply both by 3: x = 18","3x + 2 = 17 → subtract 2: 3x = 15 → divide by 3: x = 5"],
         exercises:[{q:"Solve step by step:", parts:["x + 3 = 10","x - 5 = 8","2x = 14","x/3 = 6","3x + 2 = 17","2x - 4 = 10","x/5 + 1 = 4","4x - 3 = 13"], ans:["x = 7","x = 13","x = 7","x = 18","x = 5","x = 7","x = 15","x = 4"]},{q:"Check: is x = 5 correct?", parts:["x + 3 = 8","2x = 12","x - 1 = 4","3x = 15","x + 10 = 14"], ans:["Yes (5+3=8)","No (2×5=10≠12)","Yes (5-1=4)","Yes (3×5=15)","No (5+10=15≠14)"]}],
         wordProblems:["3 times a number plus 2 equals 17. Find the number.","A number divided by 5, plus 1, equals 4. What is the number?","Ali's age plus 3 equals 10. How old is Ali?","Twice a number minus 4 is 10. Find the number.","If I add 15 to a number and get 40, what is the number?"],
         quiz:[{q:"x + 3 = 10 → first step:",a:["Add 3","Subtract 3","Multiply 3","Divide 3"],c:1},{q:"2x = 14 → divide by:",a:["7","14","2","x"],c:2},{q:"3x + 2 = 17, x = ?",a:["3","4","5","6"],c:2},{q:"x/3 = 6, x = ?",a:["2","3","9","18"],c:3},{q:"Both sides must be:",a:["Different","Equal","Zero","Positive"],c:1},{q:"2x - 4 = 10, x = ?",a:["3","5","7","8"],c:2}]
        },
        {t:"Using Symbols", c:"Letters like x, y, n represent unknown numbers. Expressions combine numbers and variables.",
         examples:["3x + 2 means '3 times x, plus 2'","If x = 4: 3x + 2 = 3×4 + 2 = 14","If y = 5: 2y - 1 = 2×5 - 1 = 9","x + y means 'add two unknowns'","If x = 3, y = 7: x + y = 10","2(x + 3) means '2 times the sum of x and 3'"],
         exercises:[{q:"If x = 4, find:", parts:["3x + 2","x - 1","2x","5x - 3","x + 10","x × x","2x + 5","10 - x"], ans:["14","3","8","17","14","16","13","6"]},{q:"If x = 3, y = 5, find:", parts:["x + y","x × y","2x + y","y - x","x + 2y","3x - y"], ans:["8","15","11","2","13","4"]}],
         wordProblems:["Ali has x apples. He buys 5 more. Write an expression for total apples.","A book costs x rupees. 3 books cost how much? Write the expression.","Ali is x years old. His father is 3x years old. If Ali is 10, how old is his father?","The length of a rectangle is 2x and width is x. Write expression for perimeter.","If n students each bring 3 pencils, write expression for total pencils."],
         quiz:[{q:"3x + 2, if x = 4:",a:["10","12","14","16"],c:2},{q:"2y - 1, if y = 5:",a:["7","8","9","11"],c:2},{q:"x means:",a:["Always 10","A fixed number","An unknown number","Zero"],c:2},{q:"x + y, if x=3, y=7:",a:["4","10","21","37"],c:1},{q:"3x means:",a:["x + 3","x - 3","3 times x","x divided by 3"],c:2},{q:"If x = 5: x × x = ?",a:["10","15","20","25"],c:3}]
        }
      ] },
    ] : g === 4 ? [
      { title: "Fractions & Decimals", content: "Understanding fractions as parts of a whole. Converting between fractions and decimals.", key: "fractions" },
      { title: "Multiplication & Division", content: "Multiplication tables up to 12. Multi-step word problems.", key: "mult_div" },
      { title: "Geometry", content: "Perimeter of shapes. Understanding angles.", key: "geometry" },
    ] : g === 6 ? [
      { title: "Fractions & Decimals", content: "Understanding fractions as parts of a whole. Converting between fractions and decimals.", key: "fractions" },
      { title: "Multiplication & Division", content: "Order of operations (BODMAS). Multi-step word problems.", key: "mult_div" },
      { title: "Geometry", content: "Volume of cubes and prisms. Understanding angles.", key: "geometry" },
    ] : [
      { title: "Algebra", content: (g === 7 ? "Variables and expressions" : g === 8 ? "Solving linear equations" : g === 9 ? "Quadratic equations" : "Polynomials and factoring") + ".", key: "algebra" },
      { title: "Geometry & Trigonometry", content: (g === 7 ? "Properties of triangles" : g === 8 ? "Pythagorean theorem" : g === 9 ? "Trigonometric ratios" : "Circle theorems") + ".", key: "geo_trig" },
      { title: "Statistics & Probability", content: (g <= 8 ? "Mean, median, mode" : "Probability and permutations") + ". Charts and data analysis.", key: "stats" },
    ],
    science: g <= 3 ? [
      { title: "Living Things", content: "Animals and plants. " + (g === 1 ? "Parts of a plant" : g === 2 ? "Animal habitats" : "Life cycles") + ".", key: "living" },
      { title: "Our Body", content: (g === 1 ? "The five senses" : g === 2 ? "Bones and muscles" : "Digestive system") + ". Taking care of health.", key: "body" },
      { title: "Weather & Seasons", content: (g === 1 ? "Types of weather" : g === 2 ? "The water cycle" : "Seasons and living things") + ".", key: "weather" },
    ] : g === 5 ? [
      { title: "Matter & Materials", content: "States of matter, changes of state, properties of materials, mixtures and solutions.", key: "matter5", hasMathSub: true, subs: [
        {t:"States of Matter", svgType:"statesOfMatter",c:"Matter exists in three states: solid, liquid, and gas. Solids have fixed shape and volume. Liquids have fixed volume but take the shape of their container. Gases fill any space available.",
         examples:["Ice is a solid — it has a fixed shape","Water is a liquid — it flows and takes the shape of its container","Steam is a gas — it spreads out and fills the space","A rock is solid, milk is liquid, air is gas","Your desk is solid, juice is liquid, the wind is gas"],
         exercises:[{q:"Classify as Solid, Liquid, or Gas:", parts:["Ice","Milk","Oxygen","Wood","Oil","Carbon dioxide","Iron","Mercury","Helium","Honey"], ans:["Solid","Liquid","Gas","Solid","Liquid","Gas","Solid","Liquid","Gas","Liquid"]},{q:"True or False:", parts:["Solids have a fixed shape","Liquids can be poured","Gases have a fixed volume","Water is always a liquid","Air is a mixture of gases"], ans:["True","True","False — gases expand","False — can be ice or steam","True"]}],
         wordProblems:[{q:"Name 3 things in your kitchen that are solid, 3 that are liquid, and 1 gas.",a:"Solid: plate, spoon, glass. Liquid: water, milk, oil. Gas: cooking gas/air."},{q:"Why does ice cream melt on a hot day? What state change is this?",a:"Heat energy changes it from solid to liquid. This is called melting."},{q:"Why can you smell perfume from across a room?",a:"Gas particles spread out and move freely in all directions (diffusion)."},{q:"A balloon is filled with helium. What state of matter is helium?",a:"Helium is a gas — it fills the entire balloon."},{q:"Explain why you can walk through air but not through a wall.",a:"Air is gas with widely spaced particles. Wall is solid with tightly packed particles."},{q:"What are the 3 states of matter?",a:"1. Solid 2. Liquid 3. Gas"},{q:"Name 2 properties of a solid.",a:"1. Fixed shape 2. Fixed volume — particles are tightly packed."},{q:"Why can you pour water but not pour a stone?",a:"Water is liquid — particles slide past each other. Stone is solid — fixed shape."},{q:"Which state of matter has the most energy in its particles?",a:"Gas — particles move fastest and have the most energy."},{q:"Name a substance that can exist as all 3 states in everyday life.",a:"Water — ice (solid), water (liquid), steam (gas)."},{q:"Why can you compress a gas but not a liquid?",a:"Gas particles are far apart and can be squeezed closer. Liquid particles are already close."},{q:"Is mercury (in a thermometer) a solid or liquid?",a:"Liquid — mercury is a metal that is liquid at room temperature."},{q:"Label the diagram: ice, water, steam — which state is each?",a:"Ice = Solid. Water = Liquid. Steam = Gas."},{q:"Why does a flat tyre make a bumpy ride?",a:"Compressed air (gas) in tyres absorbs shocks. Flat tyre = no gas cushion = bumpy."},{q:"Name 3 gases found in Earth's atmosphere.",a:"1. Nitrogen (~78%) 2. Oxygen (~21%) 3. Carbon dioxide (~0.04%)"},{q:"Why does a gas fill its container completely?",a:"Gas particles move freely in all directions and fill all available space."},{q:"Honey flows slowly. What state is it? Why does it flow slowly?",a:"Liquid — its particles can move but are thickly packed (high viscosity)."},{q:"What happens to solid particles when heated strongly?",a:"They vibrate faster. If enough heat is added, they break free and the solid melts."},{q:"Is smoke a solid, liquid, or gas?",a:"Smoke is tiny solid particles suspended in gas — it is a mixture of both."},{q:"Why does a balloon feel firm when inflated?",a:"Air (gas) inside pushes outward on the balloon walls from all sides (pressure)."}],
         quiz:[{q:"Solid has:",a:["Fixed shape only","Fixed volume only","Both fixed shape and volume","Neither"],c:2},{q:"Which is a gas?",a:["Milk","Ice","Steam","Oil"],c:2},{q:"Liquids take shape of:",a:["Nothing","Their container","The air","A solid"],c:1},{q:"Air is a:",a:["Solid","Liquid","Gas","Mixture of gases"],c:3},{q:"Which can be compressed?",a:["Solid","Liquid","Gas","None"],c:2},{q:"Particles move fastest in:",a:["Solids","Liquids","Gases","All same"],c:2}]
        },
        {t:"Changes of State", svgType:"waterCycle", c:"Matter can change from one state to another by heating or cooling. Melting, freezing, evaporation, condensation, and sublimation are types of state changes.",
         examples:["Melting: solid → liquid (ice → water) — needs heat","Freezing: liquid → solid (water → ice) — remove heat","Evaporation: liquid → gas (water → steam) — needs heat","Condensation: gas → liquid (steam → water drops) — remove heat","Sublimation: solid → gas directly (dry ice, mothballs)","Boiling point of water: 100°C, Melting point of ice: 0°C"],
         exercises:[{q:"Name the change of state:", parts:["Ice melting into water","Water turning to steam","Steam on a cold mirror","Water freezing into ice","Mothball getting smaller over time","Dew forming on grass"], ans:["Melting","Evaporation/boiling","Condensation","Freezing","Sublimation","Condensation"]},{q:"What is needed?", parts:["To melt ice","To freeze water","To boil water","To condense steam","For evaporation"], ans:["Add heat","Remove heat","Add heat to 100°C","Cool the steam","Heat or wind"]}],
         wordProblems:[{q:"Explain what happens to a glass of cold water on a hot day — why do drops form outside?",a:"Water vapor in air condenses on the cold surface — this is condensation."},{q:"A puddle disappears on a sunny day. What happened?",a:"The water evaporated — changed from liquid to gas due to heat from the sun."},{q:"Why does your bathroom mirror get foggy after a hot shower?",a:"Hot steam (water vapor) condenses on the cooler mirror surface."},{q:"At what temperature does water freeze? What about boiling?",a:"Water freezes at 0°C and boils at 100°C."},{q:"Explain the water cycle using the terms evaporation, condensation, and precipitation.",a:"Sun heats water (evaporation) → vapor rises and cools (condensation) → clouds form → water falls as rain (precipitation)."},{q:"What is the difference between evaporation and boiling?",a:"Evaporation happens at the surface at any temperature. Boiling happens throughout the liquid at 100°C."},{q:"Label the water cycle diagram: name 3 key processes.",a:"1. Evaporation (water → vapor, heated by sun) 2. Condensation (vapor → cloud droplets) 3. Precipitation (rain/snow falling)"},{q:"Why do clothes dry faster on a hot, windy day?",a:"Heat speeds up evaporation. Wind carries away water vapor, preventing saturation near the cloth."},{q:"What state change happens when wax drips from a burning candle?",a:"Melting — solid wax turns to liquid wax near the flame."},{q:"What happens when steam touches a cold window?",a:"It condenses — water vapor turns back into liquid droplets on the cool glass."},{q:"Name all 5 types of state change.",a:"1. Melting (solid→liquid) 2. Freezing (liquid→solid) 3. Evaporation (liquid→gas) 4. Condensation (gas→liquid) 5. Sublimation (solid→gas)"},{q:"What is sublimation? Give one example.",a:"Solid changes directly to gas without becoming liquid. Example: dry ice, mothballs shrinking."},{q:"Why do ice cubes shrink slightly in a freezer even without melting?",a:"Sublimation — tiny amounts of ice change directly to water vapor in the dry freezer air."},{q:"Dew forms on grass in the morning. Explain why.",a:"Air cools overnight. Water vapor in air condenses on cool grass surfaces (condensation)."},{q:"Why does boiling water produce steam?",a:"At 100°C, liquid water has enough energy to break free as water vapor (gas)."},{q:"What change of state happens when you make ice lollies in a freezer?",a:"Freezing — liquid juice loses heat energy and turns into a solid."},{q:"The melting point of iron is 1538°C. What does this tell us?",a:"Iron is solid below 1538°C and needs extreme heat to become liquid."},{q:"When you breathe out on a cold day, why does it look like mist?",a:"Warm moist air from your lungs meets cold outside air and condenses into tiny droplets."},{q:"Why does water in a pot boil faster with a lid on?",a:"Lid traps steam (heat energy), raising temperature inside faster."},{q:"Explain how a refrigerator uses state changes to keep food cold.",a:"Refrigerant liquid evaporates (absorbs heat from inside), then condenses outside (releases heat) — cools the fridge."}],
         quiz:[{q:"Ice → water is:",a:["Freezing","Melting","Boiling","Condensation"],c:1},{q:"Water → steam is:",a:["Melting","Freezing","Evaporation","Condensation"],c:2},{q:"Condensation is:",a:["Solid → liquid","Liquid → gas","Gas → liquid","Solid → gas"],c:2},{q:"Water freezes at:",a:["10°C","0°C","100°C","-10°C"],c:1},{q:"Sublimation is:",a:["Solid → liquid","Solid → gas directly","Gas → solid","Liquid → solid"],c:1},{q:"Boiling point of water:",a:["50°C","80°C","100°C","120°C"],c:2}]
        },
        {t:"Properties of Materials", svgType:"materialProperties", c:"Materials have properties like hardness, flexibility, transparency, and conductivity. These properties determine how we use them.",
         examples:["Hard materials: diamond, steel, glass","Flexible materials: rubber, cloth, plastic","Transparent: glass, water, clear plastic","Opaque: wood, metal, stone — light cannot pass through","Conductors: metals (copper, iron) conduct heat and electricity","Insulators: rubber, wood, plastic — do not conduct"],
         exercises:[{q:"Classify as Conductor or Insulator:", parts:["Copper wire","Rubber gloves","Iron nail","Wooden spoon","Aluminium foil","Plastic ruler"], ans:["Conductor","Insulator","Conductor","Insulator","Conductor","Insulator"]},{q:"Transparent, Translucent, or Opaque:", parts:["Clear glass","Frosted glass","Wooden door","Clean water","Wax paper","Brick wall"], ans:["Transparent","Translucent","Opaque","Transparent","Translucent","Opaque"]}],
         wordProblems:[{q:"Why are cooking pots made of metal but handles of plastic or wood?",a:"Metal conducts heat well (heats food). Plastic/wood are insulators (protect hands from heat)."},{q:"Why do we use glass for windows instead of wood?",a:"Glass is transparent — light passes through. Wood is opaque — blocks light."},{q:"Why are electrical wires covered in rubber or plastic?",a:"Rubber and plastic are insulators — they prevent electric shock and short circuits."},{q:"Name a material that is both hard and transparent.",a:"Glass — it is hard (difficult to scratch) and transparent (light passes through)."},{q:"Why do builders use steel instead of wood for tall buildings?",a:"Steel is much stronger, more durable, and can support heavy loads better than wood."},{q:"Name 3 properties of a good material for making a frying pan.",a:"1. Good heat conductor 2. Hard/strong 3. Non-flammable (e.g., iron or steel)"},{q:"Label the diagram: classify each — conductor or insulator: copper wire, rubber glove, iron nail, plastic ruler.",a:"Conductors: copper wire, iron nail. Insulators: rubber glove, plastic ruler."},{q:"Why is rubber used for car tyres?",a:"Rubber is flexible, durable, and provides good grip (friction) on roads."},{q:"What is the difference between transparent and translucent?",a:"Transparent: light passes clearly through (glass). Translucent: light passes but blurry (frosted glass)."},{q:"Name a material that is flexible and an insulator.",a:"Rubber or plastic — both flexible and do not conduct electricity."},{q:"Why are bridges built with steel and concrete instead of wood?",a:"Steel and concrete are much stronger, more durable, and weather-resistant than wood."},{q:"Name 3 hard materials found at home.",a:"1. Glass 2. Stone/ceramic 3. Metal (iron, steel)"},{q:"Why is cotton used for clothing instead of metal?",a:"Cotton is flexible, soft, lightweight, and breathes — metal is rigid and heavy."},{q:"What material would you use for a waterproof raincoat? Why?",a:"Plastic or rubber-coated fabric — water cannot pass through (waterproof/impermeable)."},{q:"Name one property each: wood, iron, rubber, glass.",a:"Wood: strong but not as hard as metal. Iron: hard conductor. Rubber: flexible insulator. Glass: transparent but brittle."},{q:"What makes diamond the hardest natural material?",a:"Its carbon atoms are arranged in an extremely strong tetrahedral crystal structure."},{q:"Why are fuses made of thin wire that melts easily?",a:"Fuse wire melts quickly when too much current flows — protecting the circuit from damage."},{q:"Give one example each of a material that is: magnetic, non-magnetic.",a:"Magnetic: iron nail. Non-magnetic: plastic spoon."},{q:"Why is aluminium used to make aeroplanes?",a:"Aluminium is lightweight, strong, and resistant to corrosion — ideal for aircraft."},{q:"What property of glass makes it useful for spectacle lenses?",a:"Glass is transparent and can be shaped to bend (refract) light to correct vision."}],
         quiz:[{q:"Which is a conductor?",a:["Rubber","Wood","Copper","Plastic"],c:2},{q:"Transparent means:",a:["Light passes through","Light blocked","Partially see-through","Flexible"],c:0},{q:"Insulators are used for:",a:["Carrying electricity","Blocking electricity flow","Making heat","None"],c:1},{q:"Diamond is very:",a:["Soft","Flexible","Hard","Light"],c:2},{q:"Opaque material:",a:["Glass","Water","Wood","Air"],c:2},{q:"Rubber is:",a:["Conductor","Insulator","Transparent","Magnetic"],c:1}]
        },
        {t:"Mixtures & Solutions", svgType:"mixturesSolutions", c:"A mixture combines two or more substances without chemical change. A solution is a mixture where one substance dissolves in another.",
         examples:["Mixture: sand and iron filings (can be separated with magnet)","Mixture: salad — vegetables mixed together","Solution: salt dissolved in water (salt is solute, water is solvent)","Solution: sugar in tea — sugar dissolves completely","Separation methods: filtering, evaporation, magnetic separation, sieving","Oil and water do not mix — this is an immiscible mixture"],
         exercises:[{q:"Mixture or Solution?", parts:["Salt in water","Sand and gravel","Sugar in tea","Oil and water","Ink in water","Iron filings and sand"], ans:["Solution","Mixture","Solution","Mixture (immiscible)","Solution","Mixture"]},{q:"How would you separate:", parts:["Sand from water","Salt from water","Iron filings from sand","Large stones from small pebbles"], ans:["Filtering","Evaporation","Magnet","Sieving"]}],
         wordProblems:[{q:"You accidentally mix salt and sand. How can you separate them?",a:"Add water (salt dissolves), filter out sand, then evaporate water to get salt back."},{q:"Why does sugar dissolve in hot tea faster than cold tea?",a:"Higher temperature gives particles more energy, so they move faster and dissolve quicker."},{q:"Is air a mixture or a pure substance? Explain.",a:"Air is a mixture — it contains nitrogen (~78%), oxygen (~21%), CO₂, and other gases."},{q:"Explain how you would get clean water from muddy water.",a:"Filter the muddy water through cloth or filter paper to remove solid particles."},{q:"Why does oil float on water instead of mixing?",a:"Oil is less dense than water and is immiscible (doesn't dissolve in water)."},{q:"What is the difference between a mixture and a solution?",a:"Mixture: substances combined but not dissolved (sand+water). Solution: one substance fully dissolves in another (salt+water)."},{q:"Name 4 methods of separating mixtures.",a:"1. Filtering (sand from water) 2. Evaporation (salt from water) 3. Magnet (iron from sand) 4. Sieving (large from small)"},{q:"What is the solute and solvent in salt water?",a:"Solute: salt (the substance that dissolves). Solvent: water (the substance it dissolves in)."},{q:"Label the diagram: identify solute and solvent in a beaker of sugar water.",a:"Solute = sugar (dissolved substance). Solvent = water (liquid doing the dissolving). Together = solution."},{q:"Why does a spoonful of salt disappear when stirred into water?",a:"Salt dissolves — its particles spread evenly between water particles (it becomes invisible but is still there)."},{q:"How would you separate iron filings from a mixture of iron and sand?",a:"Use a magnet — iron filings are attracted to it and stick, while sand stays behind."},{q:"Can you get the salt back from salt water? How?",a:"Yes — evaporate (heat) the water. Water turns to steam and the salt crystals are left behind."},{q:"A mixture of different-sized pebbles and sand — how do you separate them?",a:"Use a sieve — larger pebbles stay on top, sand falls through the holes."},{q:"Why is seawater not safe to drink directly?",a:"It contains dissolved salt (too much salt is harmful). It must be desalinated first."},{q:"What makes a solution different from muddy water?",a:"In a solution, the solute is fully dissolved and cannot be filtered out. Muddy water has visible solid particles that can be filtered."},{q:"Is blood a mixture or a pure substance?",a:"A mixture — it contains red blood cells, white blood cells, platelets, and plasma."},{q:"If you mix oil and water and shake it, what happens?",a:"They temporarily mix but quickly separate — oil rises on top because it is less dense and immiscible."},{q:"What is filtration? When is it used?",a:"Filtration separates insoluble solids from liquids using a filter. Used for muddy water, coffee grounds."},{q:"Explain how salt is obtained from sea water in salt farms.",a:"Sea water is put in shallow pans. Sun evaporates the water, leaving salt crystals behind."},{q:"Name 3 examples of solutions in everyday life.",a:"1. Salt water 2. Sugar in tea 3. Lemon juice in water"}],
         quiz:[{q:"A solution is:",a:["Substances not mixed","One substance dissolved in another","Only solids mixed","Oil and water"],c:1},{q:"Solvent in salt water:",a:["Salt","Water","Both","Neither"],c:1},{q:"Separate iron from sand:",a:["Filter","Evaporate","Magnet","Sieve"],c:2},{q:"Salt from salt water:",a:["Filter","Evaporate","Magnet","Sieve"],c:1},{q:"Oil and water are:",a:["A solution","Miscible","Immiscible","Same density"],c:2},{q:"Air is:",a:["A pure gas","A mixture of gases","Only oxygen","Only nitrogen"],c:1}]
        }
      ] },
      { title: "Forces & Energy", content: "Gravity, friction, simple machines, types of energy, energy conversions.", key: "forces5", hasMathSub: true, subs: [
        {t:"Gravity", svgType:"gravityForce", c:"Gravity is a force that pulls objects toward the center of the Earth. It gives objects weight and keeps us on the ground.",
         examples:["An apple falls from a tree because of gravity","The Moon orbits Earth because of gravity","Objects fall at the same rate regardless of weight (in vacuum)","Weight = mass × gravity","Gravity on Moon is 1/6 of Earth's gravity","Without gravity, everything would float away"],
         exercises:[{q:"True or False:", parts:["Gravity pulls things upward","A heavier ball falls faster than a lighter ball in vacuum","Gravity keeps the Moon in orbit","You weigh less on the Moon","There is no gravity in space","Gravity acts on all objects"], ans:["False — pulls downward","False — same rate in vacuum","True","True — Moon has less gravity","False — it's weaker but exists","True"]}],
         wordProblems:[{q:"Why don't we float off the Earth?",a:"Earth's gravity pulls all objects toward its center, keeping us on the ground."},{q:"If you weigh 60 kg on Earth, about how much would you weigh on the Moon?",a:"About 10 kg — Moon's gravity is 1/6 of Earth's gravity (60 ÷ 6 = 10 kg)."},{q:"Why do astronauts float inside the space station?",a:"They are in free fall (microgravity) — orbiting Earth so fast they constantly fall around it."},{q:"Drop a feather and a coin. Which lands first? Why?",a:"Coin lands first due to less air resistance. In vacuum, both fall at the same rate."},{q:"Explain how gravity causes rain to fall.",a:"Gravity pulls water droplets in clouds downward toward Earth's surface."},{q:"What is the difference between mass and weight?",a:"Mass: amount of matter (stays same everywhere). Weight: force of gravity on mass (changes on Moon)."},{q:"Why does a ball thrown upward come back down?",a:"Gravity constantly pulls it downward, slowing it, stopping it, then pulling it back."},{q:"If you weigh 48 kg on Earth, what is your weight on the Moon?",a:"48 ÷ 6 = 8 kg — Moon's gravity is 1/6 of Earth's."},{q:"Name 3 effects of gravity in everyday life.",a:"1. Objects fall when dropped 2. Rain falls from clouds 3. We stay on the ground"},{q:"Why does the Moon orbit Earth instead of flying off into space?",a:"Earth's gravity pulls the Moon inward, keeping it in orbit around Earth."},{q:"Why do skydivers fall fast before opening a parachute?",a:"Gravity accelerates them downward. Air resistance is low until the parachute opens."},{q:"Label the diagram: show direction of gravity on an object held above the ground.",a:"Gravity arrow points straight downward toward Earth's center."},{q:"Can gravity be zero? Explain.",a:"Not truly zero, but gets weaker with distance. Deep in space far from all planets it becomes almost zero."},{q:"Why are large planets like Jupiter able to hold thick atmospheres?",a:"Jupiter has very strong gravity (large mass) — it holds gas molecules close."},{q:"A fruit hangs on a tree. Describe all forces acting on it.",a:"1. Gravity pulling it down 2. Tension in the stem pulling it up (these balance until it falls)."},{q:"If Earth had twice the gravity, what would happen to you?",a:"You would feel twice as heavy, movement would be harder, and jumping would be lower."},{q:"Why do rivers flow downhill?",a:"Gravity pulls water downward. Water flows from high ground to lower ground."},{q:"What did Galileo discover about falling objects?",a:"All objects fall at the same rate in a vacuum, regardless of their mass (weight)."},{q:"What keeps satellites orbiting Earth?",a:"Earth's gravity pulls them toward Earth while their high speed keeps them moving forward — they orbit."},{q:"Why do we not notice gravity from a nearby tree?",a:"Trees have very little mass compared to Earth. Gravity is only noticeable from very massive objects."}],
         quiz:[{q:"Gravity pulls objects:",a:["Upward","Sideways","Toward Earth's center","Away from Earth"],c:2},{q:"On Moon, you weigh:",a:["Same as Earth","More","About 1/6","Double"],c:2},{q:"What keeps planets orbiting Sun?",a:["Magnetism","Friction","Gravity","Wind"],c:2},{q:"Who discovered gravity?",a:["Einstein","Newton","Galileo","Archimedes"],c:1},{q:"Without gravity:",a:["Nothing changes","Objects would float","Objects would be heavier","Earth would spin faster"],c:1},{q:"Gravity acts on:",a:["Only heavy objects","Only falling objects","All objects with mass","Only Earth"],c:2}]
        },
        {t:"Friction", svgType:"frictionForce", c:"Friction is a force that opposes motion between two surfaces in contact. It can be useful or a nuisance.",
         examples:["Rubbing hands together creates friction and heat","Brakes use friction to stop a car","Ice is slippery because it has very low friction","Rough surfaces have more friction than smooth ones","Useful friction: walking, writing, braking","Unwanted friction: engine parts wearing out, squeaky hinges"],
         exercises:[{q:"More friction or Less friction?", parts:["Rough sandpaper","Smooth ice","Rubber shoes on concrete","Oil on a surface","Tires on wet road vs dry road","A polished floor"], ans:["More","Less","More","Less","Wet = less","Less"]},{q:"Useful or Unwanted friction?", parts:["Walking without slipping","Car engine wearing out","Writing with a pencil","A rusty hinge","Brakes stopping a bicycle","Dragging heavy furniture"], ans:["Useful","Unwanted","Useful","Unwanted","Useful","Unwanted"]}],
         wordProblems:[{q:"Why do we put oil in machines?",a:"Oil reduces friction between moving parts, preventing wear and heat buildup."},{q:"Why are tires made with rough patterns (treads)?",a:"Treads increase friction/grip between tire and road, especially on wet surfaces."},{q:"Why is it harder to walk on ice than on concrete?",a:"Ice has very low friction — smooth surface gives less grip for your shoes."},{q:"How does a parachute use friction (air resistance) to slow down?",a:"Large surface area creates high air resistance (friction with air), reducing falling speed."},{q:"Why do your hands feel warm when you rub them together?",a:"Friction between your hands converts kinetic energy into heat energy."},{q:"Name 3 situations where friction is useful.",a:"1. Brakes stopping a car 2. Shoes gripping the floor 3. Writing with a pencil"},{q:"Name 3 situations where friction is unwanted.",a:"1. Engine parts wearing out 2. Rusty hinges 3. Dragging heavy furniture"},{q:"How do ball bearings reduce friction in machines?",a:"Balls roll instead of sliding — rolling friction is much less than sliding friction."},{q:"Why does a bicycle slow down and stop if you stop pedalling?",a:"Friction between tyres and road, plus air resistance, gradually remove kinetic energy."},{q:"Label the diagram: show where friction acts on a book being pushed across a table.",a:"Friction acts on the bottom of the book, opposing the direction of motion (pointing backward)."},{q:"Why do runners wear spiked shoes?",a:"Spikes dig into the ground, increasing friction/grip to prevent slipping when running fast."},{q:"What is air resistance? Give one example.",a:"Air resistance is friction between a moving object and air. Example: wind slowing a cyclist."},{q:"Why do modern cars have streamlined (curved) shapes?",a:"Streamlined shape reduces air resistance, allowing the car to move faster using less fuel."},{q:"A box is pushed on a rough floor vs a smooth floor. Where does it travel farther?",a:"Smooth floor — less friction means less force opposing motion, so it slides farther."},{q:"Why do brakes work better on dry roads than wet roads?",a:"Water reduces friction between brake pads and wheels/tyres, making stopping harder."},{q:"How does friction help you write with a pencil?",a:"Friction between pencil tip and paper scrapes graphite particles off, leaving marks."},{q:"What would happen if there were no friction at all?",a:"Nothing could grip — you couldn't walk, cars couldn't stop, objects would slide forever."},{q:"Why do match sticks work?",a:"Friction from striking the match generates heat energy that ignites the chemicals."},{q:"How does sandpaper use friction?",a:"The rough surface creates strong friction that wears down and smooths the material it rubs."},{q:"Why do you slow down when swimming?",a:"Water resistance (friction between water and your body) pushes against your forward motion."}],
         quiz:[{q:"Friction opposes:",a:["Gravity","Motion","Energy","Heat"],c:1},{q:"More friction on:",a:["Smooth ice","Rough sandpaper","Oily surface","Wet floor"],c:1},{q:"Oil reduces friction because:",a:["It's heavy","It's smooth and slippery","It's cold","It's solid"],c:1},{q:"Brakes use friction to:",a:["Speed up","Slow down/stop","Turn","Float"],c:1},{q:"Air resistance is a form of:",a:["Gravity","Magnetism","Friction","Energy"],c:2},{q:"Tires have treads for:",a:["Looks","More grip (friction)","Less weight","Speed"],c:1}]
        },
        {t:"Simple Machines", svgType:"simpleMachines", c:"Simple machines make work easier by changing the direction or size of a force. There are 6 types.",
         examples:["Lever: seesaw, crowbar, scissors — a bar that pivots on a fulcrum","Wheel and axle: steering wheel, doorknob, bicycle wheel","Pulley: flagpole rope, crane, window blinds — changes direction of force","Inclined plane (ramp): wheelchair ramp, slide — reduces effort over longer distance","Wedge: axe, knife, doorstop — splits things apart","Screw: jar lid, bolt, drill bit — inclined plane wrapped in a spiral"],
         exercises:[{q:"Name the simple machine:", parts:["A seesaw","A doorknob","A flagpole rope","A wheelchair ramp","An axe blade","A screw in wood","Scissors","A slide in a playground"], ans:["Lever","Wheel and axle","Pulley","Inclined plane","Wedge","Screw","Lever","Inclined plane"]},{q:"True or False:", parts:["A lever needs a fulcrum","A ramp is a type of inclined plane","Pulleys only lift things up","A screw is a wrapped inclined plane","Simple machines eliminate effort completely"], ans:["True","True","False — change direction too","True","False — they reduce effort"]}],
         wordProblems:[{q:"Why is it easier to push a heavy box up a ramp than to lift it straight up?",a:"A ramp (inclined plane) spreads the effort over a longer distance, reducing the force needed."},{q:"Name 3 levers you use at home.",a:"1. Scissors 2. Bottle opener 3. Door handle — all have a fulcrum where force is applied."},{q:"How does a pulley help raise a flag?",a:"It changes the direction of force — you pull down on the rope, the flag goes up."},{q:"A knife is what type of simple machine? How does it work?",a:"A wedge — it concentrates force on a thin edge to cut/split materials apart."},{q:"Why are screws used instead of nails in some furniture?",a:"Screws grip tighter (more friction due to spiral thread) and can be removed easily."},{q:"Name all 6 simple machines.",a:"1. Lever 2. Wheel and axle 3. Pulley 4. Inclined plane 5. Wedge 6. Screw"},{q:"Label the diagram: name the 3 parts of a lever.",a:"1. Fulcrum (pivot point) 2. Effort (where you push/pull) 3. Load (what you are moving)"},{q:"What type of simple machine is a staircase?",a:"An inclined plane — it reduces the effort needed to raise yourself to a higher level."},{q:"How does a screw differ from a nail?",a:"A screw is a wrapped inclined plane — its spiral thread grips tighter and can be unscrewed."},{q:"Name the simple machine in a bicycle wheel.",a:"Wheel and axle — the wheel turns on a central axle, reducing friction and multiplying force."},{q:"Why do crowbars make it easier to lift heavy slabs?",a:"A crowbar is a lever — the long arm multiplies your force many times at the fulcrum."},{q:"How does a doorknob work as a wheel and axle?",a:"The large knob (wheel) multiplies your turning force on the small axle (shaft) that turns the latch."},{q:"What is the fulcrum on a pair of scissors?",a:"The rivet/pin in the middle where the two blades are joined — that is the pivot/fulcrum."},{q:"How does a ramp help people in wheelchairs?",a:"The ramp spreads the upward movement over a longer distance, reducing the force needed."},{q:"Name 2 examples of pulleys used in buildings or construction.",a:"1. Crane lifting materials 2. Elevator cable system"},{q:"A wedge splits wood. How does the shape help?",a:"The thin end concentrates force on a small area. As it goes deeper, the slanted sides push wood apart."},{q:"Do simple machines reduce the total work done? Explain.",a:"No — they make it easier (less force) but you must move over a longer distance. Total work stays the same."},{q:"What makes a jar lid a screw?",a:"The spiral groove (thread) is an inclined plane wrapped around a cylinder — it tightens by turning."},{q:"Name the type of simple machine: 1. Ramp 2. Axe 3. Flagpole rope 4. Seesaw.",a:"1. Inclined plane 2. Wedge 3. Pulley 4. Lever"},{q:"How does a block and tackle (multiple pulleys) help lift very heavy loads?",a:"Multiple pulleys share the load — each pulley halves the force needed, though you pull the rope farther."}],
         quiz:[{q:"A seesaw is a:",a:["Pulley","Lever","Wedge","Screw"],c:1},{q:"How many simple machines?",a:["4","5","6","8"],c:2},{q:"A ramp is:",a:["Lever","Pulley","Inclined plane","Wedge"],c:2},{q:"Pulleys change:",a:["Speed","Direction of force","Weight","Color"],c:1},{q:"A knife blade is a:",a:["Lever","Screw","Wedge","Pulley"],c:2},{q:"Simple machines make work:",a:["Disappear","Easier","Harder","Impossible"],c:1}]
        },
        {t:"Types of Energy", svgType:"energyTypes", c:"Energy is the ability to do work. It exists in many forms and can change from one form to another.",
         examples:["Kinetic energy: energy of moving objects (running, flowing water)","Potential energy: stored energy (a ball on a shelf, stretched rubber band)","Heat energy: from fire, sun, friction","Light energy: from sun, bulb, candle","Sound energy: from speakers, drums, voice","Electrical energy: from batteries, power lines, lightning","Chemical energy: stored in food, fuel, batteries"],
         exercises:[{q:"Name the type of energy:", parts:["A moving car","Food you eat","A burning candle","A charged battery","Music from a speaker","Sunlight","A ball at the top of a hill","A stretched spring"], ans:["Kinetic","Chemical","Heat + light","Electrical/chemical","Sound","Light","Potential","Potential (elastic)"]},{q:"What energy conversion happens?", parts:["Turning on a light bulb","Eating food and running","A solar panel","Burning wood","A windmill generating electricity"], ans:["Electrical → light + heat","Chemical → kinetic + heat","Light → electrical","Chemical → heat + light","Kinetic → electrical"]}],
         wordProblems:[{q:"When you eat food and then play, what energy conversions happen?",a:"Chemical energy (food) → kinetic energy (movement) + heat energy (body warmth)."},{q:"A ball rolls down a hill. Describe the energy change.",a:"Potential energy (at top) converts to kinetic energy (moving) as it rolls down."},{q:"How does a solar panel convert energy?",a:"Light energy from the Sun → electrical energy through photovoltaic cells."},{q:"Name 3 sources of light energy.",a:"1. Sun 2. Light bulb 3. Candle — Sun is natural, others artificial."},{q:"Why does rubbing your hands create heat?",a:"Friction converts kinetic energy (movement) into heat energy (thermal)."},{q:"Name 7 types of energy.",a:"1. Kinetic 2. Potential 3. Heat 4. Light 5. Sound 6. Electrical 7. Chemical"},{q:"What type of energy does a stretched rubber band have?",a:"Elastic potential energy — stored energy due to its stretched/deformed shape."},{q:"Label the diagram: A ball at the top of a ramp, a ball rolling down, a ball at the bottom. Label energy type at each point.",a:"Top: Potential energy (maximum). Rolling: Mix of potential and kinetic. Bottom: Kinetic energy (maximum)."},{q:"A torch battery powers a light bulb. Name the energy conversions.",a:"Chemical (battery) → Electrical (current) → Light + Heat (bulb)"},{q:"What is the Law of Conservation of Energy?",a:"Energy cannot be created or destroyed — it can only be converted from one form to another."},{q:"A guitar is played. Name all energy types involved.",a:"Kinetic energy (fingers plucking) → Sound energy (vibrating string) → some Heat (friction)."},{q:"Why does food give us energy?",a:"Food contains chemical energy stored in molecules. Our body breaks it down and releases it."},{q:"What type of energy do batteries store?",a:"Chemical energy — converted to electrical energy when connected in a circuit."},{q:"How does a windmill/wind turbine convert energy?",a:"Kinetic energy (wind) → Mechanical energy (spinning blades) → Electrical energy (generator)."},{q:"Compare kinetic and potential energy with an example each.",a:"Kinetic: energy of movement (a running dog). Potential: stored energy (a book on a shelf)."},{q:"A TV is switched on. Name the energy conversions.",a:"Electrical energy → Light energy + Sound energy + Heat energy."},{q:"Name 3 natural sources of energy.",a:"1. Sun (solar) 2. Wind 3. Water (hydropower) — all renewable."},{q:"What energy does a compressed spring store?",a:"Elastic potential energy — released as kinetic energy when the spring is let go."},{q:"Why does a light bulb get hot?",a:"Electrical energy converts to light AND heat — the heat is wasted energy."},{q:"Why do power stations burn fuel?",a:"Chemical energy (fuel) → Heat → Steam → Mechanical (turbine) → Electrical energy."}],
         quiz:[{q:"Energy of motion:",a:["Potential","Kinetic","Chemical","Nuclear"],c:1},{q:"Stored energy:",a:["Kinetic","Sound","Potential","Light"],c:2},{q:"Food has ___ energy:",a:["Light","Sound","Chemical","Kinetic"],c:2},{q:"Sun gives us:",a:["Only heat","Only light","Heat and light","Sound"],c:2},{q:"Battery stores:",a:["Kinetic","Chemical/electrical","Sound","Light"],c:1},{q:"Energy can be:",a:["Created","Destroyed","Converted","All of these"],c:2}]
        }
      ] },
      { title: "Earth & Space", content: "Day and night, Moon phases, the solar system, Earth's structure, seasons.", key: "earth5", hasMathSub: true, subs: [
        {t:"Day & Night", svgType:"dayNight", c:"Day and night are caused by Earth rotating on its axis. One full rotation takes about 24 hours. The side facing the Sun has daytime.",
         examples:["Earth spins like a top on its axis","One rotation = 24 hours = 1 day","When Pakistan has daytime, America has nighttime","The Sun doesn't actually move — Earth rotates","At the equator, day and night are roughly equal (12 hours each)","Near the poles, days can be very long or very short depending on season"],
         exercises:[{q:"True or False:", parts:["Earth rotates once every 24 hours","The Sun moves around Earth","When it's day in Pakistan, it's night in the USA","Earth's axis is perfectly straight up","All places on Earth have 12-hour days"], ans:["True","False — Earth rotates","True (approximately)","False — it's tilted 23.5°","False — varies by location and season"]}],
         wordProblems:[{q:"If it's 12 noon in Pakistan, is it day or night in Japan?",a:"It's late afternoon/evening in Japan — Japan is about 4 hours ahead of Pakistan."},{q:"Why do we experience sunrise in the east and sunset in the west?",a:"Earth rotates from west to east, so the Sun appears to move from east to west."},{q:"How many times does Earth rotate in one week?",a:"7 times — one rotation per day, 7 days in a week."},{q:"If Earth stopped rotating, what would happen to day and night?",a:"One side would have permanent day (extreme heat), other permanent night (extreme cold)."},{q:"Why are days longer in summer and shorter in winter?",a:"Earth's tilted axis means your hemisphere gets more direct sunlight in summer."},{q:"How long does one full rotation of Earth take?",a:"24 hours — this is one day."},{q:"Why does the Sun appear to move across the sky?",a:"The Sun does not move — Earth rotates, making it look like the Sun travels from east to west."},{q:"Label the diagram: show Earth with its axis. Label where it is day and where it is night.",a:"Side facing the Sun = Day. Side facing away from the Sun = Night. Axis tilted at 23.5°."},{q:"Name 3 things that would be different if Earth rotated in the opposite direction.",a:"1. Sun would rise in the west 2. Day/night pattern would reverse 3. Weather patterns would change."},{q:"Why do clocks in different countries show different times?",a:"Earth is divided into 24 time zones. As Earth rotates, different regions face the Sun at different times."},{q:"How many degrees does Earth rotate in one hour?",a:"360° ÷ 24 hours = 15° per hour."},{q:"At the North Pole in summer, it can be daylight for 24 hours. Why?",a:"Earth's axis tilts the North Pole toward the Sun — it stays in sunlight even as Earth rotates."},{q:"Why is it colder at the poles than at the equator?",a:"Sunlight hits the equator directly (concentrated). At poles it hits at an angle (spread out, less intense)."},{q:"What would happen if Earth rotated much faster?",a:"Days and nights would be much shorter. Winds would become very strong."},{q:"Why is the sky blue during the day but dark at night?",a:"Day: sunlight scatters in the atmosphere, making it look blue. Night: no sunlight on that side."},{q:"Pakistan has daylight roughly 12-13 hours in summer. How many hours of night?",a:"24 - 13 = about 11 hours of night."},{q:"How does a shadow change from morning to noon to evening?",a:"Morning: long shadow pointing west. Noon: shortest shadow (sun overhead). Evening: long shadow pointing east."},{q:"Why is there no day and night on the Moon like on Earth?",a:"The Moon rotates very slowly — one Moon day equals about 27 Earth days."},{q:"What is Earth's axis?",a:"An imaginary line through Earth from North Pole to South Pole, tilted at 23.5°, around which Earth rotates."},{q:"Can you see stars during daytime? Why or why not?",a:"Usually not — the Sun's light scatters in the atmosphere and outshines the stars. Stars are still there."}],
         quiz:[{q:"Day/night caused by:",a:["Sun moving","Earth rotating","Moon blocking sun","Wind"],c:1},{q:"One rotation =",a:["12 hours","24 hours","7 days","365 days"],c:1},{q:"Earth rotates from:",a:["East to West","West to East","North to South","Doesn't rotate"],c:1},{q:"Sun appears to rise in:",a:["West","North","East","South"],c:2},{q:"Earth's axis is tilted:",a:["0°","23.5°","45°","90°"],c:1},{q:"1 week = ? rotations:",a:["1","5","7","24"],c:2}]
        },
        {t:"Moon Phases", svgType:"moonPhases", c:"The Moon doesn't produce its own light — it reflects sunlight. As the Moon orbits Earth, we see different amounts of its lit side. This creates the phases.",
         examples:["New Moon: Moon is between Earth and Sun — we see the dark side","Waxing Crescent: small sliver of light appears on the right","First Quarter: right half is lit (half moon)","Waxing Gibbous: more than half lit, growing","Full Moon: entire face lit — Moon is opposite the Sun","Waning: the lit part shrinks back through gibbous, quarter, crescent","One complete cycle: about 29.5 days (one lunar month)"],
         exercises:[{q:"Put in order (1-8):", parts:["New Moon","Waxing Crescent","First Quarter","Waxing Gibbous","Full Moon","Waning Gibbous","Last Quarter","Waning Crescent"], ans:["1","2","3","4","5","6","7","8"]},{q:"True or False:", parts:["The Moon makes its own light","A full cycle takes about 29.5 days","We always see the same side of the Moon","The Moon orbits the Sun directly","Waxing means getting bigger"], ans:["False — reflects sunlight","True","True","False — orbits Earth","True"]}],
         wordProblems:[{q:"Why can we sometimes see the Moon during the day?",a:"The Moon orbits Earth independently of the Sun — sometimes it's in our daytime sky."},{q:"If tonight is a Full Moon, approximately when will the next Full Moon be?",a:"About 29.5 days later — one complete lunar cycle."},{q:"Why does the Moon look different each night?",a:"As Moon orbits Earth, we see different amounts of its sunlit side (phases)."},{q:"What is a lunar eclipse? How is it related to Moon phases?",a:"Earth's shadow falls on Moon during Full Moon. Only happens when Sun-Earth-Moon align."},{q:"Name the 8 phases of the Moon in order.",a:"1. New Moon 2. Waxing Crescent 3. First Quarter 4. Waxing Gibbous 5. Full Moon 6. Waning Gibbous 7. Last Quarter 8. Waning Crescent"},{q:"Label the Moon phases diagram: what do waxing and waning mean?",a:"Waxing = lit portion growing larger. Waning = lit portion growing smaller."},{q:"Does the Moon produce its own light?",a:"No — the Moon reflects sunlight. It has no light of its own."},{q:"Why do we always see the same side of the Moon from Earth?",a:"The Moon takes the same time to rotate on its axis as it does to orbit Earth — so the same face is always toward us."},{q:"How long does one complete Moon phase cycle take?",a:"About 29.5 days — called a lunar month."},{q:"During which Moon phase can a solar eclipse happen?",a:"New Moon — when Moon is between Earth and Sun and blocks sunlight."},{q:"During which Moon phase can a lunar eclipse happen?",a:"Full Moon — when Earth is between the Sun and Moon, casting Earth's shadow on the Moon."},{q:"If you see half the Moon lit on the right side, what phase is it?",a:"First Quarter — right half is illuminated."},{q:"What is a crescent Moon?",a:"A thin sliver of lit Moon — either waxing crescent (growing) or waning crescent (shrinking)."},{q:"What is a gibbous Moon?",a:"More than half but not fully lit — waxing gibbous (growing) or waning gibbous (shrinking)."},{q:"How many days does it take to go from New Moon to Full Moon?",a:"About 14-15 days — half of the 29.5-day cycle."},{q:"Why does the Moon appear larger near the horizon than high in the sky?",a:"It is an optical illusion — our brain compares it to objects on the horizon, making it seem bigger."},{q:"If today is First Quarter, what phase will it be in about 7 days?",a:"Full Moon — approximately 7 days later."},{q:"Why does the Moon have craters?",a:"Meteors and asteroids crashed into the Moon's surface over billions of years (no atmosphere to burn them up)."},{q:"Name 3 ways the Moon affects Earth.",a:"1. Controls ocean tides 2. Stabilises Earth's axial tilt 3. Causes lunar and solar eclipses."},{q:"What is the difference between a solar eclipse and a lunar eclipse?",a:"Solar eclipse: Moon blocks Sun's light from Earth. Lunar eclipse: Earth's shadow falls on the Moon."}],
         quiz:[{q:"Moon shines because:",a:["It makes light","Reflects sunlight","Reflects Earth's light","Has fire"],c:1},{q:"Full Moon to Full Moon:",a:["7 days","14 days","29.5 days","365 days"],c:2},{q:"Waxing means:",a:["Getting smaller","Getting bigger","Staying same","Disappearing"],c:1},{q:"New Moon — Moon is:",a:["Fully lit","Between Earth and Sun","Behind Earth","Gone"],c:1},{q:"First Quarter shows:",a:["Full Moon","No Moon","Right half","Left half"],c:2},{q:"Moon orbits:",a:["Sun","Earth","Mars","Jupiter"],c:1}]
        },
        {t:"Solar System", svgType:"solarSystem",c:"Our solar system has the Sun at the center, 8 planets, dwarf planets, moons, asteroids, and comets.",
         examples:["Sun: a star, center of our solar system","Inner planets (rocky): Mercury, Venus, Earth, Mars","Outer planets (gas giants): Jupiter, Saturn, Uranus, Neptune","Dwarf planet: Pluto (reclassified in 2006)","Earth is the 3rd planet from the Sun","Jupiter is the largest planet, Mercury is the smallest","Order: My Very Educated Mother Just Served Us Nachos"],
         exercises:[{q:"Name the planet:", parts:["Closest to Sun","Known as the Red Planet","Largest planet","Has beautiful rings","Our home planet","Farthest from Sun (of 8)","Hottest planet (thick atmosphere)","Known as the Blue Planet"], ans:["Mercury","Mars","Jupiter","Saturn","Earth","Neptune","Venus","Earth"]},{q:"True or False:", parts:["Pluto is still a planet","Jupiter is the largest","Earth is 3rd from the Sun","Mars has rings","The Sun is a star"], ans:["False — dwarf planet","True","True","False — Saturn has rings","True"]}],
         wordProblems:[{q:"Why is Venus hotter than Mercury even though Mercury is closer to the Sun?",a:"Venus has a thick CO₂ atmosphere that traps heat (greenhouse effect). Mercury has no atmosphere."},{q:"How many planets are in our solar system? Name them in order.",a:"8 planets: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune."},{q:"What is the difference between inner and outer planets?",a:"Inner (Mercury-Mars): small and rocky. Outer (Jupiter-Neptune): large gas giants."},{q:"Why is Earth called the 'Goldilocks planet'?",a:"Earth is not too hot, not too cold — just right for liquid water and life."},{q:"What holds all the planets in orbit around the Sun?",a:"The Sun's gravity — its massive size creates strong gravitational pull on all planets."},{q:"Label the solar system diagram: name each planet in order from the Sun.",a:"1. Mercury 2. Venus 3. Earth 4. Mars 5. Jupiter 6. Saturn 7. Uranus 8. Neptune"},{q:"What is the memory trick to remember planet order?",a:"My Very Educated Mother Just Served Us Nachos (Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune)"},{q:"Name the largest and smallest planets in our solar system.",a:"Largest: Jupiter. Smallest: Mercury."},{q:"What is a dwarf planet? Name one example.",a:"A small body orbiting the Sun that hasn't cleared its orbit. Example: Pluto."},{q:"What is an asteroid and where are most found?",a:"A rocky object orbiting the Sun. Most are in the asteroid belt between Mars and Jupiter."},{q:"Why does Saturn have rings?",a:"Saturn has rings of ice and rock particles trapped by its strong gravity — unique in our solar system."},{q:"Why is Mars called the Red Planet?",a:"Mars has iron oxide (rust) on its surface giving it a reddish colour."},{q:"How is a star different from a planet?",a:"A star produces its own light and heat through nuclear fusion. A planet does not — it reflects starlight."},{q:"How long does Earth take to orbit the Sun once?",a:"365.25 days — one year."},{q:"What is a comet? How is it different from an asteroid?",a:"A comet is made of ice and rock with a tail when near the Sun. Asteroids are rocky without tails."},{q:"Why can't humans live on Mercury?",a:"No atmosphere, extreme temperature swings (+430°C day to -180°C night), no water."},{q:"What is the difference between a moon and a planet?",a:"A moon orbits a planet. A planet orbits a star."},{q:"Why does Jupiter have a Great Red Spot?",a:"It is a massive storm that has been raging for hundreds of years in Jupiter's atmosphere."},{q:"How many moons does Earth have? Name it.",a:"1 moon — called the Moon (Luna)."},{q:"Why are the outer planets called gas giants?",a:"They are very large and made mostly of hydrogen and helium gas, not solid rock."}],
         quiz:[{q:"Planets in solar system:",a:["7","8","9","10"],c:1},{q:"Largest planet:",a:["Saturn","Jupiter","Neptune","Earth"],c:1},{q:"Earth is ___ from Sun:",a:["1st","2nd","3rd","4th"],c:2},{q:"Sun is a:",a:["Planet","Moon","Star","Comet"],c:2},{q:"Red Planet:",a:["Venus","Mars","Jupiter","Mercury"],c:1},{q:"Planet with rings:",a:["Mars","Jupiter","Saturn","Neptune"],c:2}]
        },
        {t:"Earth's Structure", svgType:"earthLayers",c:"Earth has layers: crust (surface), mantle (thick hot layer), outer core (liquid metal), inner core (solid metal). The crust is where we live.",
         examples:["Crust: thin outer layer, 5 to 70 km thick, where life exists","Mantle: thickest layer, semi-solid hot rock, causes tectonic plate movement","Outer Core: liquid iron and nickel, creates Earth's magnetic field","Inner Core: solid ball of iron, extremely hot (about 5,500°C)","Earth is like an egg: shell=crust, white=mantle, yolk=core","Tectonic plates float on the mantle and cause earthquakes when they move"],
         exercises:[{q:"Order from outside to inside:", parts:["Crust","Mantle","Outer Core","Inner Core"], ans:["1 (outermost)","2","3","4 (innermost)"]},{q:"True or False:", parts:["The crust is the thickest layer","The mantle is semi-solid rock","The outer core is liquid","The inner core is the hottest part","We live on the mantle"], ans:["False — mantle is thickest","True","True","True","False — we live on the crust"]}],
         wordProblems:[{q:"If you could dig a hole through the Earth, what layers would you pass through?",a:"Crust → Mantle → Outer Core (liquid) → Inner Core (solid) → then reverse."},{q:"Why do earthquakes happen?",a:"Tectonic plates floating on the mantle shift and collide, releasing energy as seismic waves."},{q:"What creates Earth's magnetic field?",a:"The spinning liquid iron and nickel in the outer core generates the magnetic field."},{q:"Compare Earth's layers to a boiled egg.",a:"Shell = crust (thin), white = mantle (thick), yolk = core (center, hot)."},{q:"Why is the inner core solid even though it's the hottest?",a:"Extreme pressure at the center keeps the iron solid despite the high temperature."},{q:"Label the Earth layers diagram: name the 4 layers from outside to inside.",a:"1. Crust (outermost, thin) 2. Mantle (thickest layer) 3. Outer Core (liquid iron/nickel) 4. Inner Core (solid, hottest)"},{q:"What is the thinnest and thickest layer of the Earth?",a:"Thinnest: Crust (5-70 km). Thickest: Mantle (~2,900 km)."},{q:"Why do volcanoes erupt?",a:"Magma (molten rock from the mantle) is pushed up through cracks in the crust and erupts at the surface."},{q:"What is the temperature of Earth's inner core?",a:"About 5,500°C — as hot as the surface of the Sun."},{q:"What are tectonic plates?",a:"Giant pieces of Earth's crust that float on the semi-molten mantle and slowly move."},{q:"Name 3 effects of tectonic plate movement.",a:"1. Earthquakes 2. Volcanoes 3. Formation of mountains"},{q:"What is the difference between magma and lava?",a:"Magma: molten rock inside the Earth. Lava: magma that has erupted and reached the surface."},{q:"Why is the outer core liquid?",a:"The temperature is so high that iron and nickel melt. Less pressure than the inner core allows it to remain liquid."},{q:"How do we know what is inside the Earth if we can't drill that deep?",a:"Scientists study seismic waves (from earthquakes) that travel through Earth — different waves travel at different speeds through different layers."},{q:"What would happen if Earth had no magnetic field?",a:"Solar wind would strip away the atmosphere, and harmful radiation would reach the surface — life would be impossible."},{q:"Why does the crust vary in thickness?",a:"Oceanic crust (~5 km) under oceans is thinner. Continental crust (~35-70 km) under land is thicker."},{q:"Name the layer where tectonic plates float.",a:"The Mantle — plates float on the semi-molten (asthenosphere) part of the upper mantle."},{q:"What is a seismometer used for?",a:"It measures the strength and location of earthquakes (seismic waves)."},{q:"Why do mountains form at plate boundaries?",a:"When two continental plates collide, the crust buckles and is pushed upward forming mountains."},{q:"What are the main elements in Earth's core?",a:"Iron and nickel — Earth's outer core is liquid iron-nickel, inner core is solid iron-nickel."}],
         quiz:[{q:"We live on the:",a:["Mantle","Crust","Core","Atmosphere"],c:1},{q:"Thickest layer:",a:["Crust","Mantle","Outer core","Inner core"],c:1},{q:"Inner core is:",a:["Liquid","Gas","Solid","Semi-solid"],c:2},{q:"Outer core creates:",a:["Atmosphere","Magnetic field","Oceans","Mountains"],c:1},{q:"Earthquakes caused by:",a:["Wind","Rain","Tectonic plates moving","Gravity"],c:2},{q:"Earth's core is mainly:",a:["Rock","Water","Iron and nickel","Gas"],c:2}]
        },
        {t:"Seasons", svgType:"seasonsCycle", c:"Seasons are caused by Earth's tilted axis (23.5°) as it orbits the Sun. Different parts of Earth receive different amounts of sunlight throughout the year.",
         examples:["Summer: your hemisphere tilts toward the Sun — longer days, more heat","Winter: your hemisphere tilts away — shorter days, less heat","Spring and Autumn: transition seasons, moderate temperatures","Pakistan has 4 seasons: Spring (March-May), Summer (June-August), Autumn (September-November), Winter (December-February)","When the Northern Hemisphere has summer, the Southern Hemisphere has winter","At the equator, seasons change very little"],
         exercises:[{q:"Match season to description:", parts:["Longest days, hottest","Shortest days, coldest","Leaves fall, cooling down","Flowers bloom, warming up"], ans:["Summer","Winter","Autumn","Spring"]},{q:"True or False:", parts:["Seasons are caused by Earth's distance from Sun","Earth's axis is tilted 23.5°","Both hemispheres have summer at the same time","Days are longer in summer","The equator has extreme seasons"], ans:["False — caused by tilt","True","False — opposite seasons","True","False — mild changes"]}],
         wordProblems:[{q:"Why is it winter in Australia when it's summer in Pakistan?",a:"Earth's tilt means when the Northern Hemisphere faces the Sun (summer), the Southern Hemisphere faces away from the Sun (winter)."},{q:"If Earth's axis were not tilted, would we have seasons?",a:"No — everywhere would get equal sunlight year-round. No seasons."},{q:"Why are summer days longer than winter days?",a:"In summer, your hemisphere is tilted toward the Sun, so it stays in sunlight longer."},{q:"Which season do you think is best for farming? Why?",a:"Spring/summer — warm temperatures, more sunlight, and rainfall help crops grow."},{q:"How do animals adapt to changing seasons?",a:"Migration (birds), hibernation (bears), growing thicker fur (winter), shedding fur (summer)."},{q:"What causes seasons on Earth?",a:"Earth's tilted axis (23.5°) as it orbits the Sun — not its distance from the Sun."},{q:"Name the 4 seasons and when they occur in Pakistan.",a:"1. Spring (March-May) 2. Summer (June-August) 3. Autumn (September-November) 4. Winter (December-February)"},{q:"Label the diagram: show Earth at its summer and winter positions in orbit around the Sun.",a:"Summer: Northern Hemisphere tilted toward the Sun. Winter: Northern Hemisphere tilted away from the Sun."},{q:"Why is it hotter in summer even though Earth is slightly farther from the Sun?",a:"In summer, your hemisphere tilts toward the Sun — sunlight hits more directly (concentrated), giving more heat."},{q:"What is the longest day of the year called?",a:"The summer solstice — around June 21 in the Northern Hemisphere (longest day, shortest night)."},{q:"What is the shortest day of the year called?",a:"The winter solstice — around December 21 in the Northern Hemisphere (shortest day, longest night)."},{q:"What are equinoxes? When do they occur?",a:"Days when day and night are equal (12 hours each). Occur around March 21 and September 23."},{q:"Why does the equator not have distinct seasons?",a:"The equator is always close to the Sun's direct rays — little change in sunlight throughout the year."},{q:"How does Earth's tilt affect the angle of sunlight?",a:"Tilting toward the Sun = direct rays (concentrated, more heat). Tilting away = angled rays (spread out, less heat)."},{q:"In which season do trees shed leaves? Why?",a:"Autumn — decreasing daylight and cooler temperatures trigger trees to shed leaves to conserve water/energy."},{q:"Why do deserts near the equator stay hot year-round?",a:"Near the equator, the Sun is always nearly overhead — strong sunlight all year with no seasonal change."},{q:"What would happen if Earth were tilted at 90°?",a:"Extreme seasons — poles would have months of sunlight and months of darkness. Tropics would freeze."},{q:"Why do countries near the poles have very long days in summer and very long nights in winter?",a:"Earth's strong tilt means the pole faces the Sun continuously in summer and faces away all of winter."},{q:"How many times does Earth orbit the Sun in one year?",a:"Once — Earth takes 365.25 days to complete one full orbit."},{q:"Name one way plants and one way animals respond to the change from summer to winter.",a:"Plants: shed leaves, stop growing. Animals: hibernate or migrate to warmer places."}],
         quiz:[{q:"Seasons caused by:",a:["Distance from Sun","Earth's tilted axis","Moon's orbit","Wind patterns"],c:1},{q:"Earth's tilt:",a:["0°","23.5°","45°","90°"],c:1},{q:"Longest days in:",a:["Winter","Spring","Summer","Autumn"],c:2},{q:"When the Northern Hemisphere has summer:",a:["The Southern Hemisphere also has summer","The Southern Hemisphere has winter","Both have spring","There are no seasons in the south"],c:1},{q:"How many seasons?",a:["2","3","4","6"],c:2},{q:"Equator has:",a:["Extreme seasons","Mild/no seasons","Only summer","Only winter"],c:1}]
        }
      ] },
      { title: "Human Body Systems", content: "Digestive, respiratory, circulatory, skeletal, and nervous systems.", key: "body5", hasMathSub: true, subs: [
        {t:"Digestive System", svgType:"bodySystem",svgData:{system:"digestive"},c:"The digestive system breaks down food into nutrients. It starts at the mouth and ends at the large intestine.",
         examples:["Mouth: teeth chew, saliva starts digestion","Esophagus: food pipe pushes food to stomach","Stomach: acids break food down (3-4 hours)","Small intestine: nutrients absorbed into blood (6m long)","Large intestine: absorbs water, forms waste","Liver and pancreas produce bile and enzymes"],
         exercises:[{q:"Order food's journey:", parts:["Mouth","Esophagus","Stomach","Small intestine","Large intestine"], ans:["1","2","3","4","5"]},{q:"True or False:", parts:["Digestion starts in stomach","Small intestine is shorter than large","Saliva helps break down food","The liver produces bile","Food stays in stomach for seconds"], ans:["False — starts in mouth","False — small is longer","True","True","False — 3-4 hours"]}],
         wordProblems:[{q:"Why must we chew food properly?",a:"Chewing breaks food into smaller pieces, increasing surface area for enzymes to digest faster."},{q:"What would happen without nutrient absorption?",a:"Body wouldn't get energy or building materials — you would become weak and sick."},{q:"How long does food take to pass through the entire system?",a:"About 24-72 hours from eating to elimination."},{q:"Name the 5 organs/parts of the digestive system in order.",a:"1. Mouth 2. Esophagus 3. Stomach 4. Small Intestine 5. Large Intestine"},{q:"Label the digestive system diagram: where does digestion start?",a:"Digestion starts in the mouth — saliva and teeth begin breaking down food."},{q:"What does the stomach do?",a:"It uses strong acids and muscles to break food into a liquid paste (chyme) over 3-4 hours."},{q:"Why is the small intestine so important?",a:"It absorbs nutrients (proteins, carbohydrates, fats, vitamins) into the bloodstream."},{q:"What does the large intestine absorb?",a:"Water — it removes water from undigested food, making solid waste (stool)."},{q:"What role does saliva play in digestion?",a:"Saliva moistens food and contains enzymes that start breaking down carbohydrates."},{q:"Why do we feel hungry again a few hours after eating?",a:"The stomach empties after 3-4 hours, digestion continues, and blood sugar drops — triggering hunger."},{q:"What would happen if the small intestine didn't work?",a:"Nutrients couldn't be absorbed — severe malnutrition and weight loss would occur."},{q:"Name 3 nutrients absorbed by the small intestine.",a:"1. Glucose (carbohydrates) 2. Amino acids (proteins) 3. Fatty acids (fats)"},{q:"Why is fibre (roughage) important for the digestive system?",a:"Fibre helps food move through the intestines and prevents constipation."},{q:"What is the role of the liver in digestion?",a:"The liver produces bile that breaks down fats. It also processes absorbed nutrients."},{q:"Why does vomiting happen?",a:"The stomach muscle contracts forcefully to push out harmful/irritating contents as a protective reflex."},{q:"What is the esophagus?",a:"A muscular tube that pushes food from the mouth to the stomach through wave-like contractions (peristalsis)."},{q:"Name 3 healthy habits for a good digestive system.",a:"1. Eat fibre-rich foods 2. Drink enough water 3. Chew food thoroughly"},{q:"Why should you not exercise immediately after a heavy meal?",a:"Blood goes to muscles during exercise, reducing blood flow to digestive organs — causing cramps or nausea."},{q:"What happens to food that cannot be digested?",a:"It passes to the large intestine, water is absorbed, and it is eliminated as solid waste (faeces)."},{q:"What is the difference between physical and chemical digestion?",a:"Physical: chewing and churning (breaks food into pieces). Chemical: enzymes and acids break food into molecules."}],
         quiz:[{q:"Digestion starts in:",a:["Stomach","Mouth","Intestine","Liver"],c:1},{q:"Nutrients absorbed in:",a:["Stomach","Large intestine","Small intestine","Mouth"],c:2},{q:"Small intestine about:",a:["1m","3m","6m","10m"],c:2},{q:"Stomach uses:",a:["Water","Acids","Air","Blood"],c:1},{q:"Liver produces:",a:["Saliva","Bile","Blood","Oxygen"],c:1},{q:"Large intestine absorbs:",a:["Nutrients","Water","Air","Food"],c:1}]
        },
        {t:"Respiratory System", svgType:"bodySystem",svgData:{system:"respiratory"},c:"Brings oxygen in and removes carbon dioxide. Nose → trachea → bronchi → lungs → alveoli.",
         examples:["Nose/mouth: air filtered and warmed","Trachea (windpipe): carries air to lungs","Bronchi: two tubes into each lung","Alveoli: tiny sacs where O₂ enters blood, CO₂ leaves","Diaphragm: muscle that controls breathing","We breathe about 20,000 times per day"],
         exercises:[{q:"True or False:", parts:["We breathe in oxygen, out carbon dioxide","Trachea carries food","Lungs are solid","Diaphragm helps breathing","We have 3 lungs"], ans:["True","False — carries air","False — spongy","True","False — 2"]}],
         wordProblems:[{q:"Why breathe faster when running?",a:"Muscles need more oxygen during exercise, so breathing rate increases to supply it."},{q:"Why is smoking harmful?",a:"Tar coats alveoli, reducing gas exchange. Chemicals damage lung tissue and cause cancer."},{q:"What role does the diaphragm play?",a:"It contracts (flattens) to expand lungs for inhaling, relaxes for exhaling."},{q:"Name the path air takes into the lungs.",a:"Nose/Mouth → Trachea → Bronchi → Bronchioles → Alveoli"},{q:"Label the respiratory diagram: where does gas exchange happen?",a:"Gas exchange happens in the alveoli — tiny air sacs where O₂ enters blood and CO₂ leaves."},{q:"What gas do we breathe in? What do we breathe out?",a:"Breathe in: Oxygen (O₂). Breathe out: Carbon dioxide (CO₂) and water vapor."},{q:"Why do alveoli have thin walls and a large surface area?",a:"Thin walls let gases pass easily. Large surface area allows rapid exchange of O₂ and CO₂."},{q:"How many times do we breathe per day (approximately)?",a:"About 20,000 times per day."},{q:"What would happen if the trachea was blocked?",a:"Air cannot reach the lungs — suffocation would occur within minutes."},{q:"Why do you breathe more deeply during exercise?",a:"Deeper breaths take in more air per breath, supplying extra oxygen to working muscles."},{q:"What is the difference between breathing and respiration?",a:"Breathing: moving air in and out physically. Respiration: the chemical process in cells that releases energy from glucose."},{q:"Name 3 things that can damage the respiratory system.",a:"1. Smoking 2. Air pollution 3. Respiratory infections (pneumonia, bronchitis)"},{q:"Why does a cold make breathing harder?",a:"Mucus builds up in the nasal passages and airways, narrowing them and making breathing more difficult."},{q:"How do the bronchi work?",a:"Bronchi are two tubes (one to each lung) that carry air from the trachea into the lung tissue."},{q:"Why is it important to breathe through the nose rather than the mouth?",a:"Nose hairs filter dust, and the nasal lining warms and moistens air before it reaches the lungs."},{q:"What is the role of mucus in the airways?",a:"Mucus traps dust and bacteria. Tiny hairs (cilia) push it up to be swallowed or coughed out."},{q:"Why is it dangerous to be in a room full of carbon monoxide?",a:"CO prevents blood from carrying oxygen — you suffocate without realising it (colorless, odorless)."},{q:"Name 2 ways athletes train their respiratory system.",a:"1. Cardiovascular exercise increases lung capacity 2. Breathing exercises strengthen diaphragm."},{q:"Why does high altitude (mountains) make breathing harder?",a:"Air at high altitude has less oxygen — fewer oxygen molecules per breath, making breathing more difficult."},{q:"Why can holding your breath for too long be dangerous?",a:"CO₂ builds up in blood — the brain forces you to breathe. Extended oxygen deprivation damages brain cells."}],
         quiz:[{q:"We breathe in:",a:["CO₂","Nitrogen","Oxygen","Hydrogen"],c:2},{q:"Gas exchange in:",a:["Trachea","Bronchi","Alveoli","Nose"],c:2},{q:"Diaphragm is a:",a:["Bone","Organ","Muscle","Tube"],c:2},{q:"We breathe out:",a:["Oxygen","CO₂","Nitrogen","Water"],c:1},{q:"Windpipe =",a:["Esophagus","Trachea","Bronchi","Alveoli"],c:1},{q:"Number of lungs:",a:["1","2","3","4"],c:1}]
        },
        {t:"Circulatory System", svgType:"bodySystem",svgData:{system:"circulatory"},c:"Heart pumps blood. Arteries carry blood away, veins bring it back. Blood carries oxygen and nutrients.",
         examples:["Heart beats ~100,000 times/day","Arteries: oxygen-rich blood AWAY from heart","Veins: oxygen-poor blood BACK to heart","Capillaries: tiny vessels for exchange","Heart has 4 chambers: 2 atria, 2 ventricles","Blood also carries white blood cells (fight infection) and platelets (clotting)"],
         exercises:[{q:"Match:", parts:["Blood away from heart","Blood back to heart","Tiny exchange vessels","Pumps blood"], ans:["Arteries","Veins","Capillaries","Heart"]},{q:"True or False:", parts:["Heart is a muscle","Arteries carry blood TO heart","Blood carries oxygen","Heart has 3 chambers","Veins appear blue"], ans:["True","False — away","True","False — 4","True"]}],
         wordProblems:[{q:"Why does heart beat faster during exercise?",a:"Muscles need more oxygen and nutrients, so heart pumps faster to deliver more blood."},{q:"Why is the heart called a double pump?",a:"Right side pumps blood to lungs, left side pumps oxygenated blood to the body."},{q:"Why do doctors check your pulse?",a:"Pulse shows heart rate — helps detect if heart is beating normally or abnormally."},{q:"Label the circulatory system diagram: name the 4 main parts.",a:"1. Heart (pump) 2. Arteries (carry blood away) 3. Veins (bring blood back) 4. Capillaries (exchange vessels)"},{q:"How many times does the heart beat per day?",a:"About 100,000 times per day."},{q:"What is the difference between arteries and veins?",a:"Arteries: carry oxygen-rich blood AWAY from heart. Veins: carry oxygen-poor blood BACK to heart."},{q:"What are capillaries?",a:"Tiny blood vessels where oxygen and nutrients pass into body cells and CO₂ passes out."},{q:"What are the 4 chambers of the heart?",a:"1. Right atrium 2. Right ventricle 3. Left atrium 4. Left ventricle"},{q:"Why does the left side of the heart have thicker walls?",a:"The left side pumps blood to the entire body — it needs more force, so the muscle is thicker."},{q:"What does blood carry around the body?",a:"1. Oxygen 2. Nutrients (glucose) 3. Waste products (CO₂) 4. White blood cells (immunity)"},{q:"What is blood pressure?",a:"The force of blood pushing against artery walls as the heart pumps. High pressure can damage vessels."},{q:"What happens to your heart rate when you are frightened?",a:"It speeds up (adrenaline released) — preparing your body to fight or flee."},{q:"Why is regular exercise good for the heart?",a:"Exercise strengthens the heart muscle, making it pump more efficiently and reducing disease risk."},{q:"Name 3 components of blood and their functions.",a:"1. Red blood cells (carry oxygen) 2. White blood cells (fight infection) 3. Platelets (clot blood)"},{q:"What is the function of platelets?",a:"Platelets clump together to form a clot when a blood vessel is cut, stopping bleeding."},{q:"Why do athletes have a lower resting heart rate?",a:"Regular exercise makes the heart stronger — it pumps more blood per beat, so it beats less often at rest."},{q:"Why do veins appear blue/green under the skin?",a:"Veins carry oxygen-poor blood (darker red). The skin layer makes them appear blue/green."},{q:"What is anaemia?",a:"A condition where there are too few red blood cells or too little haemoglobin, reducing oxygen delivery."},{q:"What does the heart do when you are asleep?",a:"It still beats (about 50-60 times/min) pumping blood to all organs — it never stops."},{q:"How does the circulatory system and respiratory system work together?",a:"Lungs add oxygen to blood and remove CO₂. Heart pumps oxygenated blood to body — they are linked."}],
         quiz:[{q:"Heart beats/day:",a:["1,000","10,000","100,000","1,000,000"],c:2},{q:"Arteries carry blood:",a:["To heart","Away from heart","Nowhere","Only legs"],c:1},{q:"Heart chambers:",a:["2","3","4","5"],c:2},{q:"Oxygen-poor blood in:",a:["Arteries","Veins","Heart only","Lungs"],c:1},{q:"Capillaries are:",a:["Large tubes","Tiny vessels","Bones","Muscles"],c:1},{q:"Blood carries:",a:["Only oxygen","Only food","O₂, nutrients, waste","Only water"],c:2}]
        },
         {t:"Skeletal and Muscular Systems", svgType:"skeleton", c:"206 bones give shape, protect organs, work with muscles for movement. Joints allow bending.",
         examples:["Skull protects brain","Rib cage protects heart and lungs","Spine: 33 vertebrae, supports body","Joints: hinge (knee), ball-and-socket (shoulder)","Muscles contract to pull bones","Tendons: muscle to bone. Ligaments: bone to bone"],
         exercises:[{q:"What does it protect?", parts:["Skull","Rib cage","Spine","Pelvis"], ans:["Brain","Heart+lungs","Spinal cord","Organs"]},{q:"True or False:", parts:["Adults have 206 bones","Muscles push bones","Spine is one solid bone","Babies have more bones"], ans:["True","False — pull","False — 33 vertebrae","True — bones fuse"]}],
         wordProblems:[{q:"Why is calcium important for bones?",a:"Calcium makes bones hard and strong. Without it, bones become weak and brittle."},{q:"What would happen without joints?",a:"You couldn't bend, move, or walk — body would be completely rigid like a statue."},{q:"Name the largest and smallest bones.",a:"Largest: femur (thigh bone). Smallest: stapes (in the ear)."},{q:"Label the skeleton diagram: identify skull, spine, rib cage, femur, humerus.",a:"Skull: head. Spine: backbone (33 vertebrae). Rib cage: chest. Femur: thigh. Humerus: upper arm."},{q:"How many bones does an adult human have?",a:"206 bones."},{q:"Name 3 functions of the skeletal system.",a:"1. Gives body shape and support 2. Protects organs (skull→brain, ribs→lungs) 3. Works with muscles for movement"},{q:"What is the difference between a tendon and a ligament?",a:"Tendon: connects muscle to bone. Ligament: connects bone to bone at joints."},{q:"Why do babies have more bones than adults?",a:"Babies have about 270-300 bones. As they grow, many fuse together into the 206 adult bones."},{q:"Name 2 types of joints and give an example of each.",a:"1. Hinge joint (knee, elbow) — bends in one direction. 2. Ball-and-socket (shoulder, hip) — moves in all directions."},{q:"How do muscles move bones?",a:"Muscles contract (shorten) and pull bones — muscles always pull, never push."},{q:"What is a fracture?",a:"A fracture is a broken or cracked bone. It heals when new bone cells grow across the break."},{q:"Why do humans have a spine (backbone)?",a:"The spine supports the body upright, protects the spinal cord, and allows flexible movement."},{q:"What does the rib cage protect?",a:"The heart and lungs — it forms a protective bony cage around these vital organs."},{q:"Why is the skull hard and curved?",a:"Its rounded, hard shape distributes impact force across its surface, protecting the brain."},{q:"Name 3 nutrients needed for healthy bones.",a:"1. Calcium 2. Phosphorus 3. Vitamin D (helps absorb calcium)"},{q:"What is osteoporosis?",a:"A condition where bones lose density and become weak and brittle, usually in old age."},{q:"How do muscles work in pairs?",a:"When one muscle contracts (bicep), the other relaxes (tricep) and vice versa — antagonistic pairs."},{q:"Name the bones that protect the brain and spinal cord.",a:"Brain: skull (cranium). Spinal cord: vertebrae (spine)."},{q:"Why does regular exercise strengthen bones?",a:"Exercise puts stress on bones, stimulating them to grow denser and stronger."},{q:"What is cartilage?",a:"Smooth, flexible tissue that covers bone ends at joints, reducing friction and absorbing shock."}],
         quiz:[{q:"Adult bones:",a:["106","206","306","406"],c:1},{q:"Skull protects:",a:["Heart","Lungs","Brain","Stomach"],c:2},{q:"Muscles move by:",a:["Pushing","Pulling","Stretching","Twisting"],c:1},{q:"Knee joint type:",a:["Ball-socket","Hinge","Pivot","Fixed"],c:1},{q:"Tendons connect:",a:["Bone-bone","Muscle-bone","Muscle-muscle","Skin-bone"],c:1},{q:"Spine vertebrae:",a:["12","24","33","44"],c:2}]
        },
        {t:"Nervous System", svgType:"nervousSystem", c:"Brain is command center, spinal cord is highway, nerves are wires carrying electrical signals.",
         examples:["Brain: thinking, memory, senses — 1.4 kg","Spinal cord: signals between brain and body","Nerves: throughout body, carry electrical signals","Reflex: automatic response — hand from hot stove","Cerebrum: thinking. Cerebellum: balance. Brain stem: breathing","5 senses connected to brain: sight, hearing, smell, taste, touch"],
         exercises:[{q:"Match:", parts:["Thinking","Signals in spine","Throughout body","Quick auto response","Balance"], ans:["Cerebrum","Spinal cord","Nerves","Reflex","Cerebellum"]}],
         wordProblems:[{q:"Why pull hand from hot stove before thinking?",a:"Reflex arc — signal goes to spinal cord and back (not brain), so response is faster."},{q:"What if spinal cord is damaged?",a:"Signals can't travel between brain and body below the injury — paralysis may occur."},{q:"Why wear helmets?",a:"Helmets protect the brain (skull alone may not absorb all impact force)."},{q:"Name the 3 main parts of the nervous system.",a:"1. Brain (control centre) 2. Spinal cord (highway for signals) 3. Nerves (wires throughout body)"},{q:"Label the nervous system diagram: identify brain, spinal cord, and nerves.",a:"Brain: in skull. Spinal cord: runs through vertebrae. Nerves: branch out to all body parts."},{q:"What are the 3 main parts of the brain?",a:"1. Cerebrum (thinking, memory, senses) 2. Cerebellum (balance, coordination) 3. Brain stem (breathing, heartbeat)"},{q:"What is a reflex action? Give one example.",a:"A reflex is an automatic, fast response without thinking. Example: pulling hand from heat, blinking."},{q:"Why do reflexes bypass the brain?",a:"Reflexes use the spinal cord as a shortcut — making them much faster than conscious reactions."},{q:"Name the 5 senses and the organ for each.",a:"1. Sight (eyes) 2. Hearing (ears) 3. Smell (nose) 4. Taste (tongue) 5. Touch (skin)"},{q:"How fast do nerve signals travel?",a:"Up to 120 metres per second — very fast, but varies by nerve type."},{q:"What happens when a nerve is damaged?",a:"Signals cannot be transmitted along that nerve — loss of feeling or movement in that area."},{q:"Why do you sometimes feel pain in a cut finger for hours after the injury?",a:"Pain nerves continue sending signals to the brain, which keeps processing them as pain."},{q:"What is the difference between the brain and the spinal cord?",a:"Brain: processes information and makes decisions. Spinal cord: transmits signals between brain and body."},{q:"Why do some medicines make you drowsy?",a:"They slow down nerve activity in the brain, reducing alertness."},{q:"What does the cerebellum control?",a:"Balance, coordination, and fine motor movements (like walking, catching a ball)."},{q:"Name 3 things the brain controls automatically.",a:"1. Breathing 2. Heartbeat 3. Digestion — controlled by the brain stem without conscious thought."},{q:"Why is sleep important for the brain?",a:"During sleep, the brain processes memories, repairs itself, and removes waste products."},{q:"What is the brain stem responsible for?",a:"Vital automatic functions: breathing, heartbeat, blood pressure, swallowing."},{q:"How does your nervous system help you avoid danger?",a:"Senses detect danger → nerves send signal to brain → brain decides response → muscles react."},{q:"Why does a person who is blind from birth often have a sharper sense of hearing?",a:"The brain adapts — areas normally used for vision are taken over and used to sharpen other senses."}],
         quiz:[{q:"Command center:",a:["Heart","Brain","Lungs","Spine"],c:1},{q:"Reflex is:",a:["Slow","Automatic fast","No response","Thinking"],c:1},{q:"Spinal cord in:",a:["Skull","Ribs","Spine","Muscles"],c:2},{q:"Brain weighs:",a:["0.5kg","1.4kg","3kg","5kg"],c:1},{q:"Cerebellum:",a:["Thinking","Breathing","Balance","Sight"],c:2},{q:"Nerves carry:",a:["Chemical","Electrical","Magnetic","Sound"],c:1}]
        }
      ] },
      { title: "Living Things & Ecosystems", content: "Classification, food chains, ecosystems, adaptation, plant biology.", key: "eco5", hasMathSub: true, subs: [
        {t:"Classification", svgType:"classificationGroups", c:"Living things grouped by shared features. Kingdoms: Animals, Plants, Fungi, Bacteria. Animals split into vertebrates and invertebrates.",
         examples:["Vertebrates: fish, amphibians, reptiles, birds, mammals","Invertebrates: insects, spiders, worms — 97% of animals","Plants: make own food via photosynthesis","Fungi: mushrooms, mold — decompose dead matter","Bacteria: single-celled, some helpful some harmful"],
         exercises:[{q:"Vertebrate or Invertebrate?", parts:["Eagle","Butterfly","Snake","Spider","Whale","Earthworm","Frog","Ant"], ans:["V","I","V","I","V","I","V","I"]},{q:"Which kingdom?", parts:["Rose","Mushroom","Cat","Mango tree","Mold"], ans:["Plant","Fungi","Animal","Plant","Fungi"]}],
         wordProblems:[{q:"Why aren't mushrooms plants?",a:"Mushrooms don't have chlorophyll and can't photosynthesize — they decompose dead matter for food."},{q:"Name 3 vertebrates and 3 invertebrates at home.",a:"Vertebrates: cat, bird, fish. Invertebrates: ant, spider, housefly."},{q:"Why classify living things?",a:"To organize, study, and understand the millions of species — makes science manageable."},{q:"Name the 5 vertebrate groups.",a:"1. Fish 2. Amphibians 3. Reptiles 4. Birds 5. Mammals"},{q:"Label the classification diagram: sort these into vertebrate/invertebrate — eagle, butterfly, frog, spider.",a:"Vertebrates: eagle, frog. Invertebrates: butterfly, spider."},{q:"What is the main difference between vertebrates and invertebrates?",a:"Vertebrates have a backbone (spine). Invertebrates do not have a backbone."},{q:"Name the 5 kingdoms of living things.",a:"1. Animals 2. Plants 3. Fungi 4. Bacteria 5. Protists"},{q:"Name 3 characteristics of mammals.",a:"1. Warm-blooded 2. Have hair/fur 3. Feed young with milk"},{q:"Why is a bat classified as a mammal, not a bird?",a:"Bats have fur, give birth to live young, and nurse them with milk — they do not lay eggs."},{q:"What is the difference between cold-blooded and warm-blooded animals?",a:"Warm-blooded: maintain constant body temperature (birds, mammals). Cold-blooded: body temperature changes with environment (fish, reptiles)."},{q:"Name 3 characteristics of birds.",a:"1. Have feathers 2. Have beaks/bills 3. Lay eggs 4. Warm-blooded"},{q:"Name 3 examples of amphibians.",a:"1. Frog 2. Toad 3. Salamander — live in water as young, on land as adults."},{q:"Why are insects the most numerous type of animal on Earth?",a:"Insects reproduce rapidly, adapt to many environments, and are small — over 1 million known species."},{q:"What kingdom does a cactus belong to? Why?",a:"Plant kingdom — it has chlorophyll and makes food through photosynthesis."},{q:"What is a scientific name (binomial nomenclature)?",a:"A two-part Latin name given to each species (e.g., Homo sapiens for humans). First = genus, second = species."},{q:"Name 3 animals that are warm-blooded.",a:"1. Dog 2. Eagle 3. Whale — all mammals or birds maintain constant body temperature."},{q:"How do scientists classify a new species they discover?",a:"They study its features (body structure, DNA, behaviour) and place it in the correct kingdom, genus, and species."},{q:"Give one example of a fish, reptile, and amphibian.",a:"Fish: trout. Reptile: lizard. Amphibian: frog."},{q:"Are viruses living things? Why or why not?",a:"Debated — viruses cannot reproduce on their own and have no cells. Most scientists classify them as non-living."},{q:"Why are there so many more invertebrates than vertebrates?",a:"Invertebrates are simpler in structure, reproduce faster, and have adapted to almost every environment on Earth."}],
         quiz:[{q:"Animals with backbone:",a:["Invertebrates","Vertebrates","Plants","Fungi"],c:1},{q:"Plants make food by:",a:["Eating","Photosynthesis","Absorption","Hunting"],c:1},{q:"Mushrooms are:",a:["Plants","Animals","Fungi","Bacteria"],c:2},{q:"% invertebrates:",a:["3%","50%","75%","97%"],c:3},{q:"Which vertebrate?",a:["Ant","Spider","Eagle","Worm"],c:2},{q:"Bacteria are:",a:["Always harmful","Always helpful","Single-celled","Multi-celled"],c:2}]
        },
        {t:"Food Chains & Webs", svgType:"foodChain",c:"Energy flows: Sun → Producer → Primary consumer → Secondary → Tertiary → Decomposer.",
         examples:["Sun → Grass → Rabbit → Fox","Producer: makes food (plants)","Herbivore: eats plants (rabbit)","Carnivore: eats animals (fox)","Top predator: eagle, lion","Decomposer: bacteria, fungi, worms"],
         exercises:[{q:"Identify role:", parts:["Grass","Rabbit","Fox","Eagle","Mushroom","Deer"], ans:["Producer","Primary consumer","Secondary","Tertiary","Decomposer","Primary consumer"]},{q:"Complete chain:", parts:["Sun → ___ → Caterpillar → Bird","Sun → Grass → ___ → Snake"], ans:["Leaf/Plant","Mouse/Frog"]}],
         wordProblems:[{q:"If all rabbits vanished, what happens to foxes?",a:"Foxes lose food source — population decreases or they must find other prey."},{q:"Why are plants called producers?",a:"They produce their own food through photosynthesis using sunlight, water, and CO₂."},{q:"What if there were no decomposers?",a:"Dead matter would pile up, nutrients wouldn't recycle back to soil — ecosystems collapse."},{q:"Label the food chain diagram: Sun → ? → ? → ? → ?",a:"Sun → Grass (producer) → Rabbit (herbivore/primary consumer) → Fox (carnivore/secondary) → Eagle (top predator)"},{q:"What is the difference between a food chain and a food web?",a:"Food chain: single sequence (grass→rabbit→fox). Food web: multiple overlapping chains showing real feeding relationships."},{q:"Name the 4 roles in a food chain.",a:"1. Producer (plants) 2. Primary consumer (herbivore) 3. Secondary consumer (carnivore) 4. Decomposer (fungi/bacteria)"},{q:"What is the original source of energy for all food chains?",a:"The Sun — plants capture solar energy through photosynthesis, and energy passes up the chain."},{q:"If the fox population increases greatly, what happens to rabbits?",a:"Rabbit population decreases — more foxes eat more rabbits than they can reproduce."},{q:"What is a carnivore? Give 2 examples.",a:"An animal that eats only other animals. Examples: 1. Lion 2. Eagle"},{q:"What is an omnivore? Give 2 examples.",a:"An animal that eats both plants and animals. Examples: 1. Human 2. Bear"},{q:"Why is there less energy at each level of a food chain?",a:"About 90% of energy is lost as heat at each stage — only 10% passes to the next level."},{q:"What would happen if all plants disappeared from an ecosystem?",a:"All herbivores would die. Then all carnivores that eat them would die. The entire ecosystem collapses."},{q:"What is a decomposer? Why are they essential?",a:"Decomposers (bacteria, fungi) break down dead matter and recycle nutrients back into soil for plants."},{q:"Give an example of a food chain with 4 links.",a:"Grass → Cricket → Frog → Snake (or Sun → Seaweed → Fish → Shark)"},{q:"What is a predator? What is prey?",a:"Predator: hunts and eats other animals. Prey: the animal that is hunted and eaten."},{q:"Name 3 producers in a pond ecosystem.",a:"1. Algae 2. Water lily 3. Pondweed — all make food through photosynthesis."},{q:"Why do we say energy 'flows' through a food chain?",a:"Energy moves in one direction — from producers to consumers to decomposers, never backward."},{q:"What is a secondary consumer?",a:"An animal that eats the primary consumer (herbivore). Example: fox eats rabbit (rabbit is primary consumer)."},{q:"How do decomposers help the food chain?",a:"They break down dead plants and animals into simple nutrients that go back into the soil for plants."},{q:"Name one example of a food web (list at least 3 chains that overlap).",a:"Chain 1: Grass→Rabbit→Fox. Chain 2: Grass→Mouse→Owl. Chain 3: Grass→Caterpillar→Bird→Hawk. Rabbit and mouse share grass as producer."}],
         quiz:[{q:"Chain starts with:",a:["Consumer","Decomposer","Producer","Predator"],c:2},{q:"Herbivore eats:",a:["Meat","Plants","Both","Nothing"],c:1},{q:"Top predator:",a:["Rabbit","Grass","Eagle","Worm"],c:2},{q:"Decomposers:",a:["Plants","Predators","Break down dead matter","Producers"],c:2},{q:"Energy source:",a:["Water","Soil","Sun","Wind"],c:2},{q:"Food web is:",a:["One chain","Many chains connected","No chains","Only plants"],c:1}]
        },
        {t:"Adaptation", svgType:"adaptationTraits", c:"Special features helping survival. Physical (body) or behavioral (actions).",
         examples:["Camel: hump (fat), wide feet, long eyelashes","Polar bear: thick white fur","Cactus: stores water, spines not leaves","Fish: gills, streamlined body","Chameleon: color change (camouflage)","Birds migrate south (behavioral)"],
         exercises:[{q:"Physical or Behavioral?", parts:["Thick fur","Migration","Long neck","Hibernation","Webbed feet","Bee dance"], ans:["Physical","Behavioral","Physical","Behavioral","Physical","Behavioral"]}],
         wordProblems:[{q:"How does a camel survive in desert?",a:"Hump stores fat (energy), wide feet (don't sink in sand), long eyelashes (block sand)."},{q:"Why do animals hibernate?",a:"To conserve energy during winter when food is scarce — body slows down drastically."},{q:"Design an animal for the Arctic — what features?",a:"Thick white fur (warmth+camouflage), small ears (less heat loss), fat layer, large paws."},{q:"What is adaptation?",a:"A special feature (physical or behavioural) that helps an organism survive in its environment."},{q:"Label the adaptation diagram: name 4 adaptations of a camel.",a:"1. Hump (stores fat for energy) 2. Wide padded feet (don't sink in sand) 3. Long eyelashes (block sand) 4. Can close nostrils (stop sand)"},{q:"What is the difference between physical and behavioural adaptation?",a:"Physical: body feature (thick fur, long beak). Behavioural: action/habit (migration, hibernation)."},{q:"How is a polar bear adapted to Arctic life?",a:"1. Thick white fur (insulation + camouflage) 2. Fat layer under skin 3. Large paws (grip ice) 4. Small ears (less heat loss)"},{q:"Why do fish have streamlined bodies?",a:"Streamlined (torpedo) shape reduces water resistance, allowing fast, efficient swimming."},{q:"How is a cactus adapted to the desert?",a:"1. Spines instead of leaves (reduce water loss) 2. Thick stem stores water 3. Deep roots absorb rain quickly"},{q:"What is camouflage? Give 2 examples.",a:"When an animal blends into its surroundings. Examples: 1. Chameleon changing colour 2. Stick insect looking like a twig"},{q:"Why do birds migrate?",a:"Behavioural adaptation — to escape cold winters and find food in warmer areas, then return in spring."},{q:"How is a duck's foot adapted for swimming?",a:"Webbed feet work like paddles — the flat surface pushes water backward, moving the duck forward."},{q:"Name 3 adaptations of a polar bear.",a:"1. Thick fur (insulation) 2. White colour (camouflage in snow) 3. Layer of blubber (fat for warmth and energy)"},{q:"What adaptation helps an eagle catch prey from high in the sky?",a:"Sharp talons (grip prey), powerful curved beak (tear meat), excellent eyesight (spot prey from great height)."},{q:"How has the giraffe adapted to feed in trees?",a:"Long neck allows it to reach high leaves that other animals cannot reach (reduces competition)."},{q:"What is mimicry? Give an example.",a:"When one animal looks like another dangerous animal to avoid predators. Example: harmless king snake mimics venomous coral snake."},{q:"How do desert plants conserve water?",a:"1. Waxy coating on leaves 2. Spines reduce leaf area 3. Deep roots 4. Stored water in stems"},{q:"Why do animals in cold climates have smaller ears?",a:"Small ears have less surface area — less heat is lost from the body (Allen's Rule)."},{q:"What adaptation helps a woodpecker drill into trees?",a:"Very hard, sharp beak, long sticky tongue, strong neck muscles, and claws to grip bark."},{q:"Name one structural and one behavioural adaptation of a penguin.",a:"Structural: thick blubber layer (keeps warm). Behavioural: huddle together in groups (share body heat in storms)."}],
         quiz:[{q:"Adaptation helps:",a:["Look pretty","Survive","Grow bigger","Move faster"],c:1},{q:"Camel's hump stores:",a:["Water","Fat","Air","Food"],c:1},{q:"Migration is:",a:["Physical","Behavioral","Disease","Neither"],c:1},{q:"Camouflage:",a:["Running fast","Blending in","Flying high","Swimming"],c:1},{q:"Cactus spines reduce:",a:["Growth","Water loss","Sunlight","Roots"],c:1},{q:"Polar bear fur:",a:["Brown","Black","White","Spotted"],c:2}]
        },
        {t:"Plant Biology", svgType:"photosynthesis", c:"Plants make food via photosynthesis: sunlight + water + CO₂ → glucose + oxygen. Parts: roots, stem, leaves, flowers, seeds.",
         examples:["Roots: absorb water, anchor plant","Stem: transports water up, food down","Leaves: photosynthesis happens here (chlorophyll = green)","Flowers: reproduction, attract pollinators","Seeds: contain embryo + food supply","Photosynthesis releases oxygen we breathe"],
         exercises:[{q:"Match part to function:", parts:["Roots","Stem","Leaves","Flowers","Seeds"], ans:["Absorb water","Transport+support","Photosynthesis","Reproduction","New plant"]}],
         wordProblems:[{q:"Why are leaves green?",a:"Chlorophyll (green pigment) absorbs red/blue light for photosynthesis, reflects green."},{q:"What happens to plant in darkness?",a:"Cannot photosynthesize → no food production → turns yellow → eventually dies."},{q:"How do plants clean our air?",a:"They absorb CO₂ and release oxygen during photosynthesis."},{q:"Label the photosynthesis diagram: name the inputs and outputs.",a:"Inputs: CO₂ (from air) + H₂O (from roots) + Sunlight. Outputs: Glucose (food) + Oxygen (released)."},{q:"Write the word equation for photosynthesis.",a:"Carbon dioxide + Water + Sunlight → Glucose + Oxygen"},{q:"Name the 5 main parts of a plant and their functions.",a:"1. Roots (absorb water/minerals) 2. Stem (transport/support) 3. Leaves (photosynthesis) 4. Flowers (reproduction) 5. Seeds (new plant)"},{q:"What is chlorophyll?",a:"The green pigment in leaves that absorbs sunlight for photosynthesis."},{q:"What would happen to a plant if all its leaves were removed?",a:"It could not photosynthesize — no food production — the plant would weaken and die."},{q:"What do roots do?",a:"1. Absorb water and minerals from soil 2. Anchor the plant in the ground"},{q:"How does water travel from roots to leaves?",a:"Through tubes called xylem vessels in the stem — water is pulled up by transpiration from leaves."},{q:"What is transpiration?",a:"Loss of water vapour through tiny pores (stomata) in leaves — helps pull water up from roots."},{q:"Why do leaves have stomata?",a:"Tiny pores that allow CO₂ in for photosynthesis and release O₂ and water vapour."},{q:"Name 3 things plants need to grow well.",a:"1. Sunlight 2. Water 3. Carbon dioxide (also: minerals from soil, suitable temperature)"},{q:"What is pollination?",a:"Transfer of pollen from the male to female part of a flower, allowing fertilisation and seed production."},{q:"How do seeds spread to new places?",a:"1. Wind (dandelion) 2. Animals (berries eaten, seeds excreted) 3. Water (coconut) 4. Explosion (pea pods)"},{q:"Why do plants compete with each other?",a:"They compete for sunlight, water, minerals, and space — those that get more resources grow stronger."},{q:"What is germination?",a:"When a seed begins to grow — it absorbs water, splits, and a shoot and root emerge."},{q:"Why are forests important for the atmosphere?",a:"Forests absorb huge amounts of CO₂ and release O₂ — they are called the 'lungs of the Earth'."},{q:"What do plants do at night (no sunlight)?",a:"They cannot photosynthesize but still respire — absorbing oxygen and releasing CO₂ like animals do."},{q:"Name 3 ways humans use plants.",a:"1. Food (fruits, vegetables, grains) 2. Medicines (herbs, aspirin from willow) 3. Timber/materials (wood, cotton)"}],
         quiz:[{q:"Photosynthesis makes:",a:["CO₂","Glucose + oxygen","Water","Soil"],c:1},{q:"Chlorophyll in:",a:["Roots","Stem","Leaves","Seeds"],c:2},{q:"Roots absorb:",a:["Sunlight","Water + minerals","CO₂","Oxygen"],c:1},{q:"Plants release:",a:["CO₂","Water","Oxygen","Nitrogen"],c:2},{q:"Flowers for:",a:["Photosynthesis","Absorption","Reproduction","Support"],c:2},{q:"Green from:",a:["Water","Chlorophyll","Sunlight","Soil"],c:1}]
        }
      ] },
      { title: "Light, Sound & Magnetism", content: "Light properties, sound waves, magnets and magnetic fields.", key: "lsm5", hasMathSub: true, subs: [
        {t:"Light", svgType:"lightReflection", c:"Light travels in straight lines. It can be reflected, refracted, absorbed. Speed: 300,000 km/s. White light = all colors (ROYGBIV).",
         examples:["Straight lines → shadows form","Reflection: bouncing off mirror","Refraction: bending through water (bent straw)","Rainbow: white light split by rain","Opaque blocks light → shadow","Transparent: glass. Translucent: frosted glass"],
         exercises:[{q:"True or False:", parts:["Light travels in curves","Mirrors reflect light","Bent straw = refraction","Light faster than sound","Shadows from opaque objects","Light can't travel in vacuum"], ans:["False","True","True","True","True","False — it can"]}],
         wordProblems:[{q:"Why see reflection in mirror but not wall?",a:"Mirror has smooth surface (specular reflection). Wall is rough (diffuse reflection)."},{q:"Why rainbow after rain?",a:"Sunlight enters raindrops, splits into 7 colours (refraction), and reflects back to us."},{q:"Why shadows longer in morning?",a:"Sun is low on horizon — light hits objects at a steep angle, creating longer shadows."},{q:"Label the reflection diagram: identify incident ray, reflected ray, normal, and angle of incidence.",a:"Incident ray: incoming light. Normal: perpendicular to surface. Reflected ray: bounced light. Angle in = Angle out."},{q:"Label the refraction diagram: what happens when light enters water?",a:"Light slows down and bends toward the normal as it enters the denser medium (water)."},{q:"What is the speed of light?",a:"300,000 km per second — the fastest speed in the universe."},{q:"Name the 7 colours of the visible spectrum (rainbow order).",a:"Red, Orange, Yellow, Green, Blue, Indigo, Violet — remembered as ROYGBIV."},{q:"What is white light made of?",a:"White light is a mixture of all 7 colours of the visible spectrum — shown by a prism or rainbow."},{q:"What is the law of reflection?",a:"Angle of incidence = Angle of reflection (the incoming and outgoing angles are equal)."},{q:"What is refraction? Give one everyday example.",a:"Refraction: bending of light as it passes from one medium to another. Example: a straw looks bent in a glass of water."},{q:"Why does a swimming pool look shallower than it really is?",a:"Light from the bottom refracts as it exits the water, making the pool appear shallower."},{q:"What is a shadow? How is it formed?",a:"A shadow is a dark area where light is blocked by an opaque object — formed when light cannot pass through."},{q:"Why does a prism split white light into colours?",a:"Different colours of light travel at different speeds in glass — each bends at a slightly different angle."},{q:"What is the difference between a luminous and a non-luminous object?",a:"Luminous: produces its own light (sun, fire, torch). Non-luminous: reflects light (moon, book, you)."},{q:"Why can you see yourself in a calm lake but not in rough water?",a:"Calm water has a smooth, flat surface (specular reflection). Rough water scatters light (diffuse)."},{q:"What happens when light hits an opaque object?",a:"Light cannot pass through — a shadow forms on the other side."},{q:"What happens when light hits a transparent object?",a:"Light passes through — you can see clearly through it (e.g., glass window)."},{q:"Why do we see objects in colour?",a:"Objects absorb some colours of light and reflect others — we see the reflected colour."},{q:"A red apple looks red. What happens to the other colours?",a:"The apple absorbs all other colours (orange, yellow, green, blue) and reflects only red."},{q:"Why does light travel faster in air than in water?",a:"Water molecules are denser — they interact with light and slow it down compared to air."}],
         quiz:[{q:"Light travels:",a:["Curves","Straight lines","Circles","Zigzag"],c:1},{q:"Reflection:",a:["Bending","Bouncing off","Absorbed","Stopping"],c:1},{q:"Refraction:",a:["Bouncing","Bending through medium","Stopping","Disappearing"],c:1},{q:"Speed of light:",a:["300 km/s","3,000 km/s","300,000 km/s","3M km/s"],c:2},{q:"Rainbow order:",a:["ROYGBIV","BVIGYOR","RGBYIV","Random"],c:0},{q:"Shadows need:",a:["Light only","Light + opaque","Darkness only","Water"],c:1}]
        },
        {t:"Sound", svgType:"soundWaves", c:"Sound = vibrations. Travels through solid/liquid/gas, NOT vacuum. Fastest in solids. Pitch = vibration speed. Loudness = decibels.",
         examples:["Guitar string vibrates → sound","Needs medium to travel","Fastest in solids, slowest in gases","Loudness: whisper 20dB, concert 110dB","High pitch = fast vibration, low = slow","Echo: sound bouncing back"],
         exercises:[{q:"True or False:", parts:["Sound in vacuum","Faster in water than air","Higher pitch = faster vibration","See lightning before thunder","Sound from vibrations","Louder = higher decibels"], ans:["False","True","True","True — light faster","True","True"]}],
         wordProblems:[{q:"Why lightning before thunder?",a:"Light travels at 300,000 km/s, sound at ~340 m/s — light is much faster."},{q:"Why can't astronauts hear in space?",a:"Sound needs a medium (solid/liquid/gas). Space is vacuum — no medium to carry sound."},{q:"How does guitar make different sounds?",a:"Thicker/longer strings vibrate slower (low pitch). Thinner/shorter = faster (high pitch)."},{q:"What is sound?",a:"Sound is a vibration that travels as a wave through a medium (solid, liquid, or gas)."},{q:"Label the sound diagram: what does high frequency vs low frequency look like on a wave diagram?",a:"High frequency (high pitch): waves are close together. Low frequency (low pitch): waves are spread apart."},{q:"In which medium does sound travel fastest?",a:"Solids — particles are close together and pass vibrations quickly. Sound is slowest in gases."},{q:"Can sound travel through water?",a:"Yes — sound travels faster in water than in air. Dolphins and whales use sound to communicate underwater."},{q:"What is the unit of loudness (volume)?",a:"Decibels (dB) — a whisper is ~20 dB, normal talk ~60 dB, a jet engine ~130 dB."},{q:"What is pitch? What determines pitch?",a:"Pitch is how high or low a sound is. Higher frequency = higher pitch. Lower frequency = lower pitch."},{q:"What is frequency? What unit is it measured in?",a:"Frequency: number of vibrations per second. Measured in Hertz (Hz)."},{q:"How do ears detect sound?",a:"Sound waves enter the ear canal → vibrate the eardrum → tiny bones amplify → nerve signals sent to brain."},{q:"What is an echo?",a:"An echo is sound that reflects off a hard surface and comes back to you."},{q:"How can you estimate the distance of lightning?",a:"Count seconds between lightning and thunder. Sound travels ~340 m/s — every 3 seconds ≈ 1 km away."},{q:"Why do concert halls have padded walls?",a:"Soft/padded surfaces absorb sound, preventing echoes that would muddle the music."},{q:"What is the difference between sound and light in terms of travelling through space?",a:"Light travels through vacuum (space). Sound cannot — it needs a medium (particles to vibrate)."},{q:"Why do you hear a low rumble from a plane before you see it moving?",a:"No — actually you see the plane before you hear its sound because light is faster than sound."},{q:"Name 3 uses of ultrasound (high-frequency sound humans can't hear).",a:"1. Medical scans (ultrasound images of babies) 2. Sonar (submarine detection) 3. Bat navigation"},{q:"How does a drum make sound?",a:"Hitting the drum skin makes it vibrate rapidly. These vibrations travel through air to your ears."},{q:"Why does sound get quieter the farther you are from the source?",a:"Sound energy spreads out in all directions as it travels — less energy reaches your ears at greater distance."},{q:"What is the range of human hearing?",a:"Humans hear from about 20 Hz to 20,000 Hz. Dogs and bats can hear much higher frequencies."}],
         quiz:[{q:"Sound from:",a:["Light","Heat","Vibrations","Gravity"],c:2},{q:"Fastest in:",a:["Gas","Liquid","Solid","Vacuum"],c:2},{q:"Cannot travel through:",a:["Air","Water","Steel","Vacuum"],c:3},{q:"High pitch =",a:["Slow vibration","Fast vibration","No vibration","Loud"],c:1},{q:"Loudness in:",a:["Meters","Decibels","Hertz","Watts"],c:1},{q:"Echo is:",a:["Stopping","Bouncing back","Getting louder","Disappearing"],c:1}]
        },
        {t:"Magnets", svgType:"magnetPoles", c:"Attract iron, steel, nickel, cobalt. NOT wood, plastic, glass. N+S attract, N+N or S+S repel. Earth is a giant magnet.",
         examples:["Attract: iron, steel, nickel, cobalt","Don't attract: wood, plastic, copper, aluminium","N + S = attract. Same poles = repel","Earth's magnetic field → compass works","Magnetic field: invisible force area","Break magnet → each piece has N and S"],
         exercises:[{q:"Attract? (Yes/No):", parts:["Iron nail","Wood","Steel clip","Plastic","Nickel","Glass","Copper","Aluminium"], ans:["Yes","No","Yes","No","Yes","No","No","No"]},{q:"Attract or Repel?", parts:["N + S","N + N","S + S","S + N"], ans:["Attract","Repel","Repel","Attract"]}],
         wordProblems:[{q:"How does a compass work?",a:"Magnetized needle aligns with Earth's magnetic field, pointing toward magnetic North."},{q:"Can you pick up aluminium with magnet?",a:"No — aluminium is not magnetic. Only iron, steel, nickel, and cobalt are attracted."},{q:"How separate iron from sand with magnet?",a:"Pass a magnet over the mixture — iron filings stick to magnet, sand stays behind."},{q:"Label the magnet diagram: identify N pole, S pole, and draw field lines.",a:"N pole: red end. S pole: blue end. Field lines: curve from N to S outside the magnet."},{q:"Name 4 materials that are magnetic.",a:"1. Iron 2. Steel 3. Nickel 4. Cobalt"},{q:"Name 4 materials that are NOT magnetic.",a:"1. Wood 2. Plastic 3. Copper 4. Aluminium"},{q:"What happens when two North poles are brought together?",a:"They repel (push apart) — like poles always repel."},{q:"What happens when a North pole meets a South pole?",a:"They attract (pull together) — unlike poles always attract."},{q:"What is a magnetic field?",a:"The invisible area of force around a magnet where it can attract or repel other magnets and magnetic materials."},{q:"If you cut a magnet in half, what happens?",a:"Each piece becomes a new magnet with its own North and South pole — you cannot separate the poles."},{q:"Why does Earth behave like a giant magnet?",a:"The spinning liquid iron in Earth's outer core generates a magnetic field around the planet."},{q:"How does Earth's magnetic field help us?",a:"1. Compass navigation 2. Protects Earth from harmful solar wind 3. Guides animals that migrate"},{q:"Name 3 everyday uses of magnets.",a:"1. Fridge magnets 2. Electric motors 3. Loudspeakers 4. Hard drives — magnets are everywhere."},{q:"What is an electromagnet?",a:"A magnet made by passing electric current through a coil of wire — it can be switched on/off."},{q:"Name 2 advantages of an electromagnet over a permanent magnet.",a:"1. Can be switched on and off 2. Strength can be controlled (by changing current)"},{q:"Why do MRI machines use powerful magnets?",a:"Strong magnetic fields align atoms in the body, allowing detailed images of organs and tissues."},{q:"How do electric motors use magnets?",a:"Electric current in a coil creates a magnetic field that interacts with permanent magnets, causing rotation."},{q:"Why is steel used to make permanent magnets rather than soft iron?",a:"Steel retains magnetism (hard magnetic material). Soft iron loses magnetism quickly."},{q:"What are the poles of a magnet?",a:"The two ends — North pole (points toward Earth's geographic North) and South pole."},{q:"How can you test if an object is magnetic without a magnet?",a:"You cannot easily — you need to test it with a known magnet to see if it is attracted."}],
         quiz:[{q:"Magnets attract:",a:["All metals","Iron, steel, nickel","Wood+plastic","Glass"],c:1},{q:"Like poles:",a:["Attract","Repel","Nothing","Stick"],c:1},{q:"Compass points:",a:["South","East","North","West"],c:2},{q:"Earth is a:",a:["Small magnet","Not magnetic","Giant magnet","Electromagnet"],c:2},{q:"Won't attract:",a:["Iron","Steel","Plastic","Nickel"],c:2},{q:"Break magnet:",a:["Loses magnetism","Each has N+S","Only N pieces","Only S pieces"],c:1}]
        }
      ] },
    ] : g === 4 ? [
      { title: "Matter & Materials", content: "States of matter.", key: "matter" },
      { title: "Forces & Energy", content: "Push, pull, magnets.", key: "forces" },
      { title: "Earth & Space", content: "The solar system.", key: "earth" },
    ] : g === 6 ? [
      { title: "Matter & Materials", content: "Mixtures and solutions.", key: "matter" },
      { title: "Forces & Energy", content: "Energy forms.", key: "forces" },
      { title: "Earth & Space", content: "Rocks, earthquakes, volcanoes.", key: "earth" },
    ] : [
      { title: "Physics", content: (g === 7 ? "Speed and acceleration" : g === 8 ? "Newton's Laws" : g === 9 ? "Waves — sound and light" : "Electricity and magnetism") + ".", key: "physics" },
      { title: "Chemistry", content: (g === 7 ? "Elements and mixtures" : g === 8 ? "Atoms and periodic table" : g === 9 ? "Chemical reactions" : "Acids, bases, pH") + ".", key: "chemistry" },
      { title: "Biology", content: (g === 7 ? "Cells" : g === 8 ? "Human organ systems" : g === 9 ? "Genetics" : "Ecology and ecosystems") + ".", key: "biology" },
    ],
    english: g <= 3 ? [
      { title: "Phonics & Reading", content: (g === 1 ? "Letter sounds, CVC words" : g === 2 ? "Long vowels, digraphs" : "Multi-syllable words, fluency") + ".", key: "phonics" },
      { title: "Writing", content: (g === 1 ? "Writing letters and words" : g === 2 ? "Complete sentences" : "Short paragraphs") + ".", key: "writing" },
      { title: "Vocabulary", content: (g === 1 ? "Sight words" : g === 2 ? "Synonyms and antonyms" : "Compound words, prefixes") + ".", key: "vocab" },
      { title: "Sentences", content: "Practice daily-use English sentences with Urdu translations in day-wise subsections. Each day has its own lesson, exercises, and quiz.", key: "sentences", hasMathSub: true, subs: buildEnglishSentencesSubs() },
    ] : g <= 6 ? [
      { title: "Grammar", content: (g === 4 ? "Parts of speech" : g === 5 ? "Tenses, subject-verb agreement" : "Complex sentences, punctuation") + ".", key: "grammar" },
      { title: "Reading Comprehension", content: "Main idea, supporting details, author's purpose.", key: "reading" },
      { title: "Creative Writing", content: (g === 4 ? "Narrative writing" : g === 5 ? "Descriptive writing" : "Persuasive writing") + ".", key: "creative" },
      ...(g === 5 ? [{ title: "Parts of Speech", content: "Study the main parts of speech in textbook-style subsections, with day-range review blocks, exercises, and quizzes.", key: "parts_of_speech", hasMathSub: true, subs: buildEnglishPartsOfSpeechSubs() }] : []),
      ...(g === 5 ? [{ title: "Tenses", content: "Learn all 12 English tenses — Present, Past, and Future. Each tense has Simple, Continuous, Perfect, and Perfect Continuous forms with practice paragraphs and comprehension questions. Tap any sentence to hear it read aloud!", key: "tenses", hasTenses: true }] : []),
      ...(g === 5 ? [{ title: "Vocabulary", content: "Build vocabulary through textbook-style subsections for meanings, opposites, and collective nouns, with day-range review blocks, exercises, and quizzes.", key: "vocabulary", hasMathSub: true, subs: buildEnglishVocabularySubs() }] : []),
      { title: "Sentences", content: "Practice daily-use English sentences with Urdu translations in day-wise subsections. Each day has its own lesson, exercises, and quiz.", key: "sentences", hasMathSub: true, subs: buildEnglishSentencesSubs() },
    ] : [
      { title: "Literature", content: (g === 7 ? "Short stories" : g === 8 ? "Poetry analysis" : g === 9 ? "Novel study" : "Drama") + ".", key: "literature" },
      { title: "Essay Writing", content: (g === 7 ? "Five-paragraph essays" : g === 8 ? "Argumentative essays" : g === 9 ? "Research papers" : "Critical analysis") + ".", key: "essay" },
      { title: "Communication", content: (g === 7 ? "Public speaking" : g === 8 ? "Debate skills" : g === 9 ? "Formal vs informal" : "Professional communication") + ".", key: "comm" },
      { title: "Sentences", content: "Practice daily-use English sentences with Urdu translations in day-wise subsections. Each day has its own lesson, exercises, and quiz.", key: "sentences", hasMathSub: true, subs: buildEnglishSentencesSubs() },
    ],
    social: g <= 3 ? [
      { title: "My Community", content: (g === 1 ? "Family, school, neighborhood" : g === 2 ? "Community helpers" : "Maps and directions") + ".", key: "community" },
      { title: "Pakistan", content: (g === 1 ? "Flag, anthem, symbols" : g === 2 ? "Famous landmarks" : "Provinces and capitals") + ".", key: "pakistan" },
      { title: "Good Citizenship", content: (g === 1 ? "Rules and why we follow them" : g === 2 ? "Rights and responsibilities" : "Environmental responsibility") + ".", key: "citizen" },
    ] : g === 5 ? [
      {
        title: "Pakistan Geography & Provinces",
        content: "Pakistan's location in South Asia, its borders with India, Afghanistan, China, Iran and the Arabian Sea. Four provinces, capital cities, and major landmarks.",
        key: "geography5",
        hasMathSub: true,
        subs: [
          {
            t: "Pakistan's Location & Borders",
            svgType: "pakistanMap",
            c: "Pakistan is in South Asia. It borders India (east), Afghanistan & China (north), Iran (west), and the Arabian Sea (south). Area: ~881,913 km². Capital: Islamabad.",
            examples: [
              "Pakistan lies in South Asia and forms an important link between Central Asia, South Asia, and the Arabian Sea.",
              "India lies to the east, Afghanistan to the northwest, China to the northeast, Iran to the west, and the Arabian Sea to the south.",
              "Islamabad is the capital, while Karachi is the largest city and the country's busiest seaport.",
              "Pakistan covers about 881,913 square kilometres and includes mountains, plains, deserts, and a coastline.",
              "The northern areas connect Pakistan with high mountain ranges, including the Himalaya, Karakoram, and Hindu Kush regions.",
              "The Arabian Sea gives Pakistan access to sea trade, fishing, and major ports such as Karachi and Port Qasim.",
              "Pakistan follows Pakistan Standard Time, also called PKT, which is UTC plus five hours.",
              "The country lies in the Northern Hemisphere, so its seasons follow the usual pattern of spring, summer, autumn, and winter.",
              "Border locations help explain why Pakistan is important for trade, transport, and regional connections."
            ],
            exercises: [
              {
                q: "Fill in the blanks:",
                parts: [
                  "Pakistan is located in which region: ___",
                  "Pakistan's capital city is: ___",
                  "Which sea lies south of Pakistan: ___",
                  "Which country lies east of Pakistan: ___",
                  "Which country lies west of Pakistan: ___",
                  "Which country lies northwest of Pakistan: ___",
                  "Which country lies northeast of Pakistan: ___",
                  "Pakistan's approximate area is: ___",
                  "Pakistan's largest city by population is: ___",
                  "Pakistan follows which time zone: ___"
                ],
                ans: [
                  "South Asia",
                  "Islamabad",
                  "Arabian Sea",
                  "India",
                  "Iran",
                  "Afghanistan",
                  "China",
                  "881,913 km²",
                  "Karachi",
                  "PKT (UTC+5)"
                ]
              },
              {
                q: "True or False:",
                parts: [
                  "Pakistan borders India on the east",
                  "The Arabian Sea is south of Pakistan",
                  "Islamabad is Pakistan's capital",
                  "Pakistan is in South Asia",
                  "China lies to the west of Pakistan",
                  "Karachi is a major port city",
                  "Pakistan has no coastline",
                  "Iran lies west of Pakistan",
                  "Pakistan lies in the Northern Hemisphere",
                  "The Bay of Bengal touches Pakistan"
                ],
                ans: [
                  "True",
                  "True",
                  "True",
                  "True",
                  "False",
                  "True",
                  "False",
                  "True",
                  "True",
                  "False"
                ]
              },
              {
                q: "Match the columns:",
                parts: [
                  "Pakistan is located in which region",
                  "Pakistan's capital city is",
                  "Which sea lies south of Pakistan",
                  "Which country lies east of Pakistan",
                  "Which country lies west of Pakistan",
                  "Which country lies northwest of Pakistan",
                  "Which country lies northeast of Pakistan",
                  "Pakistan's approximate area is",
                  "Pakistan's largest city by population is",
                  "Pakistan follows which time zone"
                ],
                ans: [
                  "South Asia",
                  "Islamabad",
                  "Arabian Sea",
                  "India",
                  "Iran",
                  "Afghanistan",
                  "China",
                  "881,913 km²",
                  "Karachi",
                  "PKT (UTC+5)"
                ]
              }
            ],
            wordProblems: [
              {
                q: "Name the four countries that share a land border with Pakistan.",
                a: "1. India (east) 2. Afghanistan (northwest) 3. China (northeast) 4. Iran (west)"
              },
              {
                q: "On which side of Pakistan is the Arabian Sea located?",
                a: "South"
              },
              {
                q: "If you travel due north from Islamabad, which country will you reach first?",
                a: "China(through the Gilgit-Baltistan mountain area)"
              },
              {
                q: "What continent is Pakistan located in?",
                a: "Asia (specifically South Asia)"
              },
              {
                q: "What is the capital city of Pakistan?",
                a: "Islamabad"
              },
              {
                q: "Pakistan gained independence in which year?",
                a: "1947 (August 14, 1947)"
              },
              {
                q: "What is the approximate area of Pakistan in square kilometers?",
                a: "881,913 square kilometres"
              },
              {
                q: "Pakistan's coastline along the Arabian Sea is approximately how many kilometres long?",
                a: "1,046 kilometres"
              },
              {
                q: "Name three major cities of Pakistan besides the capital.",
                a: "1. Karachi 2. Lahore 3.Peshawar (also Faisalabad, Multan, Rawalpindi)"
              },
              {
                q: "What is the name of the mountain pass that connects Pakistan with Afghanistan?",
                a: "Khyber Pass"
              },
              {
                q: "Which city serves as Pakistan's largest port on the Arabian Sea?",
                a: "Karachi"
              },
              {
                q: "If you stand in Karachi and face the sea, which direction are you facing?",
                a: "South"
              },
              {
                q: "Pakistan shares the longest land border with which country?",
                a: "India (approximately3,323 km)"
              },
              {
                q: "How many time zones does Pakistan use?",
                a: "One — Pakistan Standard Time (PKT), UTC+5"
              },
              {
                q: "Pakistan is located in which hemisphere?",
                a: "Northern hemisphere"
              },
              {
                q: "What latitude range does Pakistan cover?",
                a: "24°N to 37°N (North latitude)"
              },
              {
                q: "Name the world's second-highest mountain peak located in Pakistan.",
                a: "K2, at 8,611 metres, in the Karakoram range"
              },
              {
                q: "Which ocean does the Arabian Sea (at Pakistan's coast) connect to?",
                a: "Indian Ocean"
              },
              {
                q: "What is the name of Pakistan's second largest city by population?",
                a: "Lahore"
              },
              {
                q: "If Iran is to the west of Pakistan, in which direction is India from Pakistan?",
                a: "East"
              }
            ],
            quiz: [
              {
                q: "Pakistan is located in which region?",
                a: [
                  "South Asia",
                  "Islamabad",
                  "Arabian Sea",
                  "India"
                ],
                c: 0
              },
              {
                q: "Pakistan's capital city is?",
                a: [
                  "Arabian Sea",
                  "Islamabad",
                  "India",
                  "Iran"
                ],
                c: 1
              },
              {
                q: "Which sea lies south of Pakistan?",
                a: [
                  "India",
                  "Iran",
                  "Arabian Sea",
                  "Afghanistan"
                ],
                c: 2
              },
              {
                q: "Which country lies east of Pakistan?",
                a: [
                  "Iran",
                  "Afghanistan",
                  "China",
                  "India"
                ],
                c: 3
              },
              {
                q: "Which country lies west of Pakistan?",
                a: [
                  "Iran",
                  "Afghanistan",
                  "China",
                  "881,913 km²"
                ],
                c: 0
              },
              {
                q: "Which country lies northwest of Pakistan?",
                a: [
                  "China",
                  "Afghanistan",
                  "881,913 km²",
                  "Karachi"
                ],
                c: 1
              },
              {
                q: "Which country lies northeast of Pakistan?",
                a: [
                  "881,913 km²",
                  "Karachi",
                  "China",
                  "PKT (UTC+5)"
                ],
                c: 2
              },
              {
                q: "Pakistan's approximate area is?",
                a: [
                  "Karachi",
                  "PKT (UTC+5)",
                  "South Asia",
                  "881,913 km²"
                ],
                c: 3
              },
              {
                q: "Pakistan's largest city by population is?",
                a: [
                  "Karachi",
                  "PKT (UTC+5)",
                  "South Asia",
                  "Islamabad"
                ],
                c: 0
              },
              {
                q: "Pakistan follows which time zone?",
                a: [
                  "South Asia",
                  "PKT (UTC+5)",
                  "Islamabad",
                  "Arabian Sea"
                ],
                c: 1
              },
              {
                q: "Pakistan borders India on the east",
                a: [
                  "True",
                  "False"
                ],
                c: 0
              },
              {
                q: "The Arabian Sea is south of Pakistan",
                a: [
                  "False",
                  "True"
                ],
                c: 1
              },
              {
                q: "Islamabad is Pakistan's capital",
                a: [
                  "True",
                  "False"
                ],
                c: 0
              },
              {
                q: "Pakistan is in South Asia",
                a: [
                  "False",
                  "True"
                ],
                c: 1
              },
              {
                q: "China lies to the west of Pakistan",
                a: [
                  "True",
                  "False"
                ],
                c: 1
              },
              {
                q: "Karachi is a major port city",
                a: [
                  "False",
                  "True"
                ],
                c: 1
              },
              {
                q: "Pakistan has no coastline",
                a: [
                  "True",
                  "False"
                ],
                c: 1
              },
              {
                q: "Iran lies west of Pakistan",
                a: [
                  "False",
                  "True"
                ],
                c: 1
              },
              {
                q: "Pakistan lies in the Northern Hemisphere",
                a: [
                  "True",
                  "False"
                ],
                c: 0
              },
              {
                q: "The Bay of Bengal touches Pakistan",
                a: [
                  "False",
                  "True"
                ],
                c: 0
              }
            ]
          },
          {
            t: "Four Provinces & Major Cities",
            c: "Pakistan has 4 provinces: Punjab (most populous), Sindh, Khyber Pakhtunkhwa (KPK), and Balochistan (largest area). Plus Gilgit-Baltistan and AJK territories.",
            examples: [
              "Pakistan has four provinces: Punjab, Sindh, Khyber Pakhtunkhwa, and Balochistan.",
              "Lahore is the capital of Punjab, Karachi is the capital of Sindh, Peshawar is the capital of Khyber Pakhtunkhwa, and Quetta is the capital of Balochistan.",
              "Balochistan is the largest province by area, while Punjab has the largest population.",
              "Karachi is Pakistan's biggest city and an important centre of trade, industry, and sea transport.",
              "Lahore is famous for history, education, culture, and Mughal architecture.",
              "Peshawar has long been a gateway city linking Pakistan with Afghanistan and Central Asia.",
              "Quetta is known for its dry climate, fruit orchards, and location near mountain passes.",
              "The provinces have different languages, foods, clothes, and customs, but all are part of one country.",
              "Maps help students match each province with its capital and major cities."
            ],
            exercises: [
              {
                q: "Fill in the blanks:",
                parts: [
                  "How many provinces does Pakistan have: ___",
                  "What is the capital of Punjab: ___",
                  "What is the capital of Sindh: ___",
                  "What is the capital of Khyber Pakhtunkhwa: ___",
                  "What is the capital of Balochistan: ___",
                  "Which province is largest by area: ___",
                  "Which province is the most populous: ___",
                  "What is Pakistan's federal capital territory city: ___",
                  "Which city is Pakistan's main port city: ___",
                  "The Khyber Pass is linked with which province: ___"
                ],
                ans: [
                  "Four",
                  "Lahore",
                  "Karachi",
                  "Peshawar",
                  "Quetta",
                  "Balochistan",
                  "Punjab",
                  "Islamabad",
                  "Karachi",
                  "Khyber Pakhtunkhwa"
                ]
              },
              {
                q: "True or False:",
                parts: [
                  "Balochistan is the largest province by area",
                  "Punjab is the most populous province",
                  "Karachi is the capital of Punjab",
                  "Peshawar is the capital of Khyber Pakhtunkhwa",
                  "Quetta is in Sindh",
                  "Islamabad is a separate federal territory",
                  "Lahore is in Punjab",
                  "Gwadar is in Balochistan",
                  "Sindh is famous for the Thar Desert region",
                  "Pakistan has six provinces"
                ],
                ans: [
                  "True",
                  "True",
                  "False",
                  "True",
                  "False",
                  "True",
                  "True",
                  "True",
                  "True",
                  "False"
                ]
              },
              {
                q: "Match the columns:",
                parts: [
                  "How many provinces does Pakistan have",
                  "What is the capital of Punjab",
                  "What is the capital of Sindh",
                  "What is the capital of Khyber Pakhtunkhwa",
                  "What is the capital of Balochistan",
                  "Which province is largest by area",
                  "Which province is the most populous",
                  "What is Pakistan's federal capital territory city",
                  "Which city is Pakistan's main port city",
                  "The Khyber Pass is linked with which province"
                ],
                ans: [
                  "Four",
                  "Lahore",
                  "Karachi",
                  "Peshawar",
                  "Quetta",
                  "Balochistan",
                  "Punjab",
                  "Islamabad",
                  "Karachi",
                  "Khyber Pakhtunkhwa"
                ]
              }
            ],
            wordProblems: [
              {
                q: "Name Pakistan's four provinces.",
                a: "1. Punjab 2. Sindh 3. Khyber Pakhtunkhwa (KPK) 4.Balochistan"
              },
              {
                q: "Which province has the largest population in Pakistan?",
                a: "Punjab (over 60% of Pakistan's population)"
              },
              {
                q: "Which province has the largest area in Pakistan?",
                a: "Balochistan (about 44% of Pakistan's total area)"
              },
              {
                q: "What is the capital of Sindh province?",
                a: "Karachi"
              },
              {
                q: "Which province is known as the 'Gateway to the Silk Route'?",
                a: "Khyber Pakhtunkhwa (KPK) — through the Khyber Pass"
              },
              {
                q: "Lahore is the capital of which province?",
                a: "Punjab"
              },
              {
                q: "Which province is home to the famous Khyber Pass?",
                a: "Khyber Pakhtunkhwa (KPK)"
              },
              {
                q: "If you visit Quetta, which province are you in?",
                a: "Balochistan"
              },
              {
                q: "Which city is called the 'City of Lights'?",
                a: "Karachi"
              },
              {
                q: "Which province produces most of Pakistan's wheat and rice?",
                a: "Punjab"
              },
              {
                q: "Peshawar is the capital of which province?",
                a: "Khyber Pakhtunkhwa (KPK)"
              },
              {
                q: "Which province borders Iran to the west?",
                a: "Balochistan"
              },
              {
                q: "In which province is the port city of Gwadar located?",
                a: "Balochistan (on the ArabianSea coast)"
              },
              {
                q: "Which Pakistani city is famous for its historical fort and Badshahi Mosque?",
                a: "Lahore (Punjab)"
              },
              {
                q: "Which province is known for Sindhi embroidery and the Thar Desert?",
                a: "Sindh"
              },
              {
                q: "Name the two territories of Pakistan besides the four provinces.",
                a: "1. Gilgit-Baltistan (GB) 2. Azad Jammu & Kashmir (AJK)"
              },
              {
                q: "What is the name of the federal capital territory of Pakistan?",
                a: "Islamabad CapitalTerritory (ICT)"
              },
              {
                q: "Which province has the most rivers flowing through it?",
                a: "Punjab (the five rivers —Jhelum, Chenab, Ravi, Beas, Sutlej)"
              },
              {
                q: "Name two famous cities in Punjab province.",
                a: "1. Lahore 2. Faisalabad (also Multan,Rawalpindi, Gujranwala)"
              },
              {
                q: "What does 'Punjab' mean in Urdu/Persian?",
                a: "Land of Five Rivers (Panj = five, Aab =water)"
              }
            ],
            quiz: [
              {
                q: "How many provinces does Pakistan have?",
                a: [
                  "Four",
                  "Lahore",
                  "Karachi",
                  "Peshawar"
                ],
                c: 0
              },
              {
                q: "What is the capital of Punjab?",
                a: [
                  "Karachi",
                  "Lahore",
                  "Peshawar",
                  "Quetta"
                ],
                c: 1
              },
              {
                q: "What is the capital of Sindh?",
                a: [
                  "Peshawar",
                  "Quetta",
                  "Karachi",
                  "Balochistan"
                ],
                c: 2
              },
              {
                q: "What is the capital of Khyber Pakhtunkhwa?",
                a: [
                  "Quetta",
                  "Balochistan",
                  "Punjab",
                  "Peshawar"
                ],
                c: 3
              },
              {
                q: "What is the capital of Balochistan?",
                a: [
                  "Quetta",
                  "Balochistan",
                  "Punjab",
                  "Islamabad"
                ],
                c: 0
              },
              {
                q: "Which province is largest by area?",
                a: [
                  "Punjab",
                  "Balochistan",
                  "Islamabad",
                  "Karachi"
                ],
                c: 1
              },
              {
                q: "Which province is the most populous?",
                a: [
                  "Islamabad",
                  "Karachi",
                  "Punjab",
                  "Khyber Pakhtunkhwa"
                ],
                c: 2
              },
              {
                q: "What is Pakistan's federal capital territory city?",
                a: [
                  "Karachi",
                  "Khyber Pakhtunkhwa",
                  "Four",
                  "Islamabad"
                ],
                c: 3
              },
              {
                q: "Which city is Pakistan's main port city?",
                a: [
                  "Karachi",
                  "Khyber Pakhtunkhwa",
                  "Four",
                  "Lahore"
                ],
                c: 0
              },
              {
                q: "The Khyber Pass is linked with which province?",
                a: [
                  "Four",
                  "Khyber Pakhtunkhwa",
                  "Lahore",
                  "Karachi"
                ],
                c: 1
              },
              {
                q: "Balochistan is the largest province by area",
                a: [
                  "True",
                  "False"
                ],
                c: 0
              },
              {
                q: "Punjab is the most populous province",
                a: [
                  "False",
                  "True"
                ],
                c: 1
              },
              {
                q: "Karachi is the capital of Punjab",
                a: [
                  "True",
                  "False"
                ],
                c: 1
              },
              {
                q: "Peshawar is the capital of Khyber Pakhtunkhwa",
                a: [
                  "False",
                  "True"
                ],
                c: 1
              },
              {
                q: "Quetta is in Sindh",
                a: [
                  "True",
                  "False"
                ],
                c: 1
              },
              {
                q: "Islamabad is a separate federal territory",
                a: [
                  "False",
                  "True"
                ],
                c: 1
              },
              {
                q: "Lahore is in Punjab",
                a: [
                  "True",
                  "False"
                ],
                c: 0
              },
              {
                q: "Gwadar is in Balochistan",
                a: [
                  "False",
                  "True"
                ],
                c: 1
              },
              {
                q: "Sindh is famous for the Thar Desert region",
                a: [
                  "True",
                  "False"
                ],
                c: 0
              },
              {
                q: "Pakistan has six provinces",
                a: [
                  "False",
                  "True"
                ],
                c: 0
              }
            ]
          }
        ]
      },
      {
        title: "Pakistan's Rivers, Climate & Environment",
        content: "The Indus River system waters Pakistan's farms. Pakistan has four seasons. Different climate zones: mountains, plains, deserts, and coast.",
        key: "rivers5",
        hasMathSub: true,
        subs: [
          {
            t: "Pakistan's Rivers & Dams",
            svgType: "pakRivers",
            c: "The Indus River is Pakistan's lifeline. Its tributaries water the Punjab plains. Major dams: Tarbela and Mangla provide water and electricity.",
            examples: [
              "The Indus River is the main river of Pakistan and supports farming, transport, and settlements.",
              "Important tributaries include the Jhelum, Chenab, Ravi, Sutlej, and Kabul rivers.",
              "River water is carried through canals to fields where wheat, rice, cotton, and sugarcane are grown.",
              "Pakistan depends heavily on the Indus Basin irrigation system, one of the largest irrigation networks in the world.",
              "Tarbela Dam on the Indus River and Mangla Dam on the Jhelum River are major dams of Pakistan.",
              "Dams help store water, control floods, and produce hydroelectric power for homes and industries.",
              "Rivers begin in snowy mountains and glaciers, so melting ice is important for the water supply.",
              "Floods can happen when rivers overflow during heavy rains or fast snowmelt.",
              "Clean river water is essential for agriculture, drinking, industry, and daily life."
            ],
            exercises: [
              {
                q: "Fill in the blanks:",
                parts: [
                  "What is Pakistan's longest river: ___",
                  "Which major dam is built on the Indus River: ___",
                  "Which major dam is built on the Jhelum River: ___",
                  "Which river flows near Lahore: ___",
                  "Which river comes from Afghanistan and joins the Indus: ___",
                  "Into which sea does the Indus River empty: ___",
                  "What is Pakistan's famous canal network called: ___",
                  "Punjab is named after which river group: ___",
                  "What is the main purpose of canals in Pakistan: ___",
                  "Which river is called Pakistan's lifeline: ___"
                ],
                ans: [
                  "Indus",
                  "Tarbela Dam",
                  "Mangla Dam",
                  "Ravi",
                  "Kabul River",
                  "Arabian Sea",
                  "Indus Basin Irrigation System",
                  "Five Rivers",
                  "Irrigation",
                  "Indus River"
                ]
              },
              {
                q: "True or False:",
                parts: [
                  "The Indus River is Pakistan's lifeline",
                  "Mangla Dam is built on the Chenab River",
                  "Tarbela Dam helps produce electricity",
                  "Canals help water farms",
                  "The Ravi flows near Lahore",
                  "Pakistan has no dams",
                  "The Kabul River joins the Indus",
                  "The Indus ends in the Arabian Sea",
                  "Irrigation is important because many areas are dry",
                  "Tarbela Dam is on the Jhelum River"
                ],
                ans: [
                  "True",
                  "False",
                  "True",
                  "True",
                  "True",
                  "False",
                  "True",
                  "True",
                  "True",
                  "False"
                ]
              },
              {
                q: "Match the columns:",
                parts: [
                  "What is Pakistan's longest river",
                  "Which major dam is built on the Indus River",
                  "Which major dam is built on the Jhelum River",
                  "Which river flows near Lahore",
                  "Which river comes from Afghanistan and joins the Indus",
                  "Into which sea does the Indus River empty",
                  "What is Pakistan's famous canal network called",
                  "Punjab is named after which river group",
                  "What is the main purpose of canals in Pakistan",
                  "Which river is called Pakistan's lifeline"
                ],
                ans: [
                  "Indus",
                  "Tarbela Dam",
                  "Mangla Dam",
                  "Ravi",
                  "Kabul River",
                  "Arabian Sea",
                  "Indus Basin Irrigation System",
                  "Five Rivers",
                  "Irrigation",
                  "Indus River"
                ]
              }
            ],
            wordProblems: [
              {
                q: "What is the name of the longest river in Pakistan?",
                a: "Indus River (Darya-e-Sindh), approximately 3,180 km total length"
              },
              {
                q: "Name the 'Five Rivers' of Punjab.",
                a: "1. Jhelum 2. Chenab 3. Ravi 4. Beas (now mostlyin India) 5. Sutlej"
              },
              {
                q: "Which dam is the largest in Pakistan by storage capacity?",
                a: "Tarbela Dam (on the Indus River in KPK)"
              },
              {
                q: "What is the purpose of the Indus Basin Irrigation System?",
                a: "To carry water from rivers to farmlands through a vast network of canals, enabling farming in dry areas"
              },
              {
                q: "In which province does the Indus River finally empty into the Arabian Sea?",
                a: "Sindh(near Thatta)"
              },
              {
                q: "Name the dam built on the Jhelum River.",
                a: "Mangla Dam (on the Jhelum River, near Mirpur, AJK)"
              },
              {
                q: "Which river flows past Lahore city?",
                a: "Ravi River"
              },
              {
                q: "The Indus River starts in which country/region?",
                a: "Tibet (China), in the Himalayas /Tibetan Plateau"
              },
              {
                q: "Name two rivers that are tributaries of the Chenab River.",
                a: "The Jhelum and the Raviboth join the Chenab (the Jhelum joins first, then the combined flow joins Chenab)"
              },
              {
                q: "What does 'irrigation' mean?",
                a: "Irrigation means artificially supplying water to farmland through canals, pipes, or channels to grow crops"
              },
              {
                q: "If a canal diverts water from the Indus River, what is its main purpose?",
                a: "To watercrops in dry or semi-arid farmland that does not receive enough rain"
              },
              {
                q: "Which major river comes from Afghanistan and joins the Indus at Attock?",
                a: "Kabul River"
              },
              {
                q: "Name three ways the Tarbela Dam helps Pakistan.",
                a: "1. Stores water for irrigation 2.Generates hydroelectric power 3. Controls floods"
              },
              {
                q: "In which season do rivers in northern Pakistan flood due to snowmelt?",
                a: "Summer (May–July), when warm weather melts glaciers and snow in the mountains"
              },
              {
                q: "What type of farming depends on canals from rivers?",
                a: "Irrigated farming (canal irrigation) — used for wheat, rice, cotton, sugarcane"
              },
              {
                q: "The Chenab River eventually joins which other major river?",
                a: "The Chenab joins the Sutlej, which then joins the Indus River"
              },
              {
                q: "How many provinces benefit from the Indus River's water?",
                a: "All four provinces: Punjab, Sindh, KPK, and Balochistan"
              },
              {
                q: "What is the significance of the Indus Waters Treaty (1960)?",
                a: "It divides the IndusRiver waters between Pakistan and India: Pakistan gets Indus, Jhelum, Chenab; India gets Ravi, Beas,Sutlej"
              },
              {
                q: "Where does the Kabul River originate?",
                a: "In Afghanistan, in the Hindu Kush mountainsnear Kabul city"
              },
              {
                q: "Why is the Indus River called Pakistan's 'lifeline'?",
                a: "It provides water for farming, drinking, and industry to millions of people across all provinces of Pakistan"
              }
            ],
            quiz: [
              {
                q: "What is Pakistan's longest river?",
                a: [
                  "Indus",
                  "Tarbela Dam",
                  "Mangla Dam",
                  "Ravi"
                ],
                c: 0
              },
              {
                q: "Which major dam is built on the Indus River?",
                a: [
                  "Mangla Dam",
                  "Tarbela Dam",
                  "Ravi",
                  "Kabul River"
                ],
                c: 1
              },
              {
                q: "Which major dam is built on the Jhelum River?",
                a: [
                  "Ravi",
                  "Kabul River",
                  "Mangla Dam",
                  "Arabian Sea"
                ],
                c: 2
              },
              {
                q: "Which river flows near Lahore?",
                a: [
                  "Kabul River",
                  "Arabian Sea",
                  "Indus Basin Irrigation System",
                  "Ravi"
                ],
                c: 3
              },
              {
                q: "Which river comes from Afghanistan and joins the Indus?",
                a: [
                  "Kabul River",
                  "Arabian Sea",
                  "Indus Basin Irrigation System",
                  "Five Rivers"
                ],
                c: 0
              },
              {
                q: "Into which sea does the Indus River empty?",
                a: [
                  "Indus Basin Irrigation System",
                  "Arabian Sea",
                  "Five Rivers",
                  "Irrigation"
                ],
                c: 1
              },
              {
                q: "What is Pakistan's famous canal network called?",
                a: [
                  "Five Rivers",
                  "Irrigation",
                  "Indus Basin Irrigation System",
                  "Indus River"
                ],
                c: 2
              },
              {
                q: "Punjab is named after which river group?",
                a: [
                  "Irrigation",
                  "Indus River",
                  "Indus",
                  "Five Rivers"
                ],
                c: 3
              },
              {
                q: "What is the main purpose of canals in Pakistan?",
                a: [
                  "Irrigation",
                  "Indus River",
                  "Indus",
                  "Tarbela Dam"
                ],
                c: 0
              },
              {
                q: "Which river is called Pakistan's lifeline?",
                a: [
                  "Indus",
                  "Indus River",
                  "Tarbela Dam",
                  "Mangla Dam"
                ],
                c: 1
              },
              {
                q: "The Indus River is Pakistan's lifeline",
                a: [
                  "True",
                  "False"
                ],
                c: 0
              },
              {
                q: "Mangla Dam is built on the Chenab River",
                a: [
                  "False",
                  "True"
                ],
                c: 0
              },
              {
                q: "Tarbela Dam helps produce electricity",
                a: [
                  "True",
                  "False"
                ],
                c: 0
              },
              {
                q: "Canals help water farms",
                a: [
                  "False",
                  "True"
                ],
                c: 1
              },
              {
                q: "The Ravi flows near Lahore",
                a: [
                  "True",
                  "False"
                ],
                c: 0
              },
              {
                q: "Pakistan has no dams",
                a: [
                  "False",
                  "True"
                ],
                c: 0
              },
              {
                q: "The Kabul River joins the Indus",
                a: [
                  "True",
                  "False"
                ],
                c: 0
              },
              {
                q: "The Indus ends in the Arabian Sea",
                a: [
                  "False",
                  "True"
                ],
                c: 1
              },
              {
                q: "Irrigation is important because many areas are dry",
                a: [
                  "True",
                  "False"
                ],
                c: 0
              },
              {
                q: "Tarbela Dam is on the Jhelum River",
                a: [
                  "False",
                  "True"
                ],
                c: 0
              }
            ]
          },
          {
            t: "Pakistan's Climate Zones & Seasons",
            c: "Pakistan has 4 seasons. Northern mountains are cold and snowy. The plains of Punjab/Sindh are hot and dry. The monsoon brings rain from July–September. Balochistan and Thar Desert are very dry.",
            examples: [
              "Pakistan has several climate zones, including high mountains, fertile plains, dry deserts, and coastal areas.",
              "The northern mountains remain very cold in winter and receive snowfall at high places.",
              "The plains of Punjab and Sindh are hot in summer and cooler in winter.",
              "Deserts such as Thar are dry, receive little rainfall, and often have very hot days.",
              "Coastal areas near the Arabian Sea usually have more moderate temperatures because of sea winds.",
              "Pakistan experiences four main seasons: spring, summer, autumn, and winter.",
              "Monsoon winds bring much of the summer rainfall, especially to eastern and northern areas.",
              "Climate affects crops, clothing, housing, travel, and the daily life of people in every region.",
              "People in cold areas wear warm clothes, while people in hot areas use lighter clothing and cooling methods."
            ],
            exercises: [
              {
                q: "Fill in the blanks:",
                parts: [
                  "How many main seasons does Pakistan have: ___",
                  "What is the seasonal rainy period called: ___",
                  "When does the monsoon usually arrive: ___",
                  "Which city has a milder climate because of sea breezes: ___",
                  "What is the winter crop season called: ___",
                  "What is the summer crop season called: ___",
                  "Which desert region is known for dry climate: ___",
                  "Which northern region gets heavy snow: ___",
                  "What is the name of the hot summer wind in the plains: ___",
                  "Sea breezes usually give Karachi what kind of temperatures: ___"
                ],
                ans: [
                  "Four",
                  "Monsoon",
                  "July to September",
                  "Karachi",
                  "Rabi",
                  "Kharif",
                  "Thar Desert",
                  "Gilgit-Baltistan",
                  "Loo",
                  "Moderate temperatures"
                ]
              },
              {
                q: "True or False:",
                parts: [
                  "Pakistan has four main seasons",
                  "Monsoon winds bring rain",
                  "Karachi is a coastal city",
                  "The Thar Desert is one of the driest areas",
                  "Northern mountains are colder than the plains",
                  "Wheat is mainly a Kharif crop",
                  "Rabi is the winter crop season",
                  "The Loo is a cold winter wind",
                  "Gilgit-Baltistan receives snowfall",
                  "Monsoon means no rain at all"
                ],
                ans: [
                  "True",
                  "True",
                  "True",
                  "True",
                  "True",
                  "False",
                  "True",
                  "False",
                  "True",
                  "False"
                ]
              },
              {
                q: "Match the columns:",
                parts: [
                  "How many main seasons does Pakistan have",
                  "What is the seasonal rainy period called",
                  "When does the monsoon usually arrive",
                  "Which city has a milder climate because of sea breezes",
                  "What is the winter crop season called",
                  "What is the summer crop season called",
                  "Which desert region is known for dry climate",
                  "Which northern region gets heavy snow",
                  "What is the name of the hot summer wind in the plains",
                  "Sea breezes usually give Karachi what kind of temperatures"
                ],
                ans: [
                  "Four",
                  "Monsoon",
                  "July to September",
                  "Karachi",
                  "Rabi",
                  "Kharif",
                  "Thar Desert",
                  "Gilgit-Baltistan",
                  "Loo",
                  "Moderate temperatures"
                ]
              }
            ],
            wordProblems: [
              {
                q: "How many main seasons does Pakistan have?",
                a: "Four: 1. Spring (Feb–Apr) 2. Summer (May–Aug) 3. Autumn (Sep–Nov) 4. Winter (Dec–Jan)"
              },
              {
                q: "Which season is hottest in Pakistan?",
                a: "Summer (June–August), especially in Sindh and Punjab where temperatures exceed 45°C"
              },
              {
                q: "What causes the monsoon rains in Pakistan?",
                a: "Warm, moist winds blowing from the southwest (Arabian Sea and Indian Ocean) cool and drop rain"
              },
              {
                q: "In which months does winter occur in Pakistan?",
                a: "December to February"
              },
              {
                q: "Which region of Pakistan receives the most snowfall?",
                a: "Northern areas: Gilgit-Baltistan and northern KPK (Swat, Chitral, Murree)"
              },
              {
                q: "Name the driest region of Pakistan.",
                a: "Balochistan (Makran coast and central Balochistan) and the Thar Desert in Sindh"
              },
              {
                q: "Which coastal city has a milder climate due to sea breezes?",
                a: "Karachi (Sindh) — cooled by Arabian Sea breezes"
              },
              {
                q: "What type of climate does most of Pakistan have?",
                a: "Arid (dry) to semi-arid; the south is very dry, north is cold, monsoon affects east"
              },
              {
                q: "In which season do farmers grow wheat in Pakistan?",
                a: "Rabi season (winter, October–March) — wheat is sown in October/November, harvested in April"
              },
              {
                q: "What is a 'monsoon'?",
                a: "A seasonal wind that brings heavy rainfall, in Pakistan fromJuly to September"
              },
              {
                q: "Which direction do monsoon winds come from in Pakistan?",
                a: "From the southwest — crossing the Arabian Sea and Indian Ocean"
              },
              {
                q: "Name the coldest month in northern Pakistan.",
                a: "January — temperatures can drop below -20°C in Gilgit-Baltistan"
              },
              {
                q: "What is the effect of the Himalayas on Pakistan's climate?",
                a: "They block cold windsfrom Central Asia and force moisture-laden clouds to drop rain/snow on the southern slopes"
              },
              {
                q: "How does elevation affect temperature in northern Pakistan?",
                a: "The higher the altitude, the colder it gets (temperature drops ~6°C for every 1,000 m rise)"
              },
              {
                q: "Name two crops grown in the Kharif (summer/monsoon) season.",
                a: "1. Rice 2. Cotton (also maize, sugarcane, millet)"
              },
              {
                q: "Name two crops grown in the Rabi (winter) season.",
                a: "1. Wheat 2. Mustard (also barley, gram, lentils)"
              },
              {
                q: "What is the 'Loo' wind and where does it blow?",
                a: "A hot, dry, dusty wind in summer blowing across Punjab and Sindh from the west; can cause heatstroke"
              },
              {
                q: "Which part of Pakistan is good for tourism in winter because of snow?",
                a: "Northern areas: Murree, Nathia Gali, Swat, and Gilgit-Baltistan"
              },
              {
                q: "What happens to rivers in Pakistan during the monsoon season?",
                a: "River levels rise significantly due to heavy rain and glacier melt, sometimes causing floods"
              },
              {
                q: "Why does Karachi have a more moderate temperature than Lahore in summer?",
                a: "Karachiis on the coast — sea breezes cool it down; Lahore is inland and exposed to intense heat"
              }
            ],
            quiz: [
              {
                q: "How many main seasons does Pakistan have?",
                a: [
                  "Four",
                  "Monsoon",
                  "July to September",
                  "Karachi"
                ],
                c: 0
              },
              {
                q: "What is the seasonal rainy period called?",
                a: [
                  "July to September",
                  "Monsoon",
                  "Karachi",
                  "Rabi"
                ],
                c: 1
              },
              {
                q: "When does the monsoon usually arrive?",
                a: [
                  "Karachi",
                  "Rabi",
                  "July to September",
                  "Kharif"
                ],
                c: 2
              },
              {
                q: "Which city has a milder climate because of sea breezes?",
                a: [
                  "Rabi",
                  "Kharif",
                  "Thar Desert",
                  "Karachi"
                ],
                c: 3
              },
              {
                q: "What is the winter crop season called?",
                a: [
                  "Rabi",
                  "Kharif",
                  "Thar Desert",
                  "Gilgit-Baltistan"
                ],
                c: 0
              },
              {
                q: "What is the summer crop season called?",
                a: [
                  "Thar Desert",
                  "Kharif",
                  "Gilgit-Baltistan",
                  "Loo"
                ],
                c: 1
              },
              {
                q: "Which desert region is known for dry climate?",
                a: [
                  "Gilgit-Baltistan",
                  "Loo",
                  "Thar Desert",
                  "Moderate temperatures"
                ],
                c: 2
              },
              {
                q: "Which northern region gets heavy snow?",
                a: [
                  "Loo",
                  "Moderate temperatures",
                  "Four",
                  "Gilgit-Baltistan"
                ],
                c: 3
              },
              {
                q: "What is the name of the hot summer wind in the plains?",
                a: [
                  "Loo",
                  "Moderate temperatures",
                  "Four",
                  "Monsoon"
                ],
                c: 0
              },
              {
                q: "Sea breezes usually give Karachi what kind of temperatures?",
                a: [
                  "Four",
                  "Moderate temperatures",
                  "Monsoon",
                  "July to September"
                ],
                c: 1
              },
              {
                q: "Pakistan has four main seasons",
                a: [
                  "True",
                  "False"
                ],
                c: 0
              },
              {
                q: "Monsoon winds bring rain",
                a: [
                  "False",
                  "True"
                ],
                c: 1
              },
              {
                q: "Karachi is a coastal city",
                a: [
                  "True",
                  "False"
                ],
                c: 0
              },
              {
                q: "The Thar Desert is one of the driest areas",
                a: [
                  "False",
                  "True"
                ],
                c: 1
              },
              {
                q: "Northern mountains are colder than the plains",
                a: [
                  "True",
                  "False"
                ],
                c: 0
              },
              {
                q: "Wheat is mainly a Kharif crop",
                a: [
                  "False",
                  "True"
                ],
                c: 0
              },
              {
                q: "Rabi is the winter crop season",
                a: [
                  "True",
                  "False"
                ],
                c: 0
              },
              {
                q: "The Loo is a cold winter wind",
                a: [
                  "False",
                  "True"
                ],
                c: 0
              },
              {
                q: "Gilgit-Baltistan receives snowfall",
                a: [
                  "True",
                  "False"
                ],
                c: 0
              },
              {
                q: "Monsoon means no rain at all",
                a: [
                  "False",
                  "True"
                ],
                c: 0
              }
            ]
          }
        ]
      },
      {
        title: "Ancient History of Pakistan",
        content: "Pakistan has one of the world's oldest civilizations — the Indus Valley. Later came the Mughal Empire and British rule, all leaving deep marks on Pakistan's culture.",
        key: "history_ancient5",
        hasMathSub: true,
        subs: [
          {
            t: "Indus Valley Civilization",
            svgType: "indusValley",
            c: "The Indus Valley Civilization (2600–1900 BCE) was one of the world's first urban civilizations. Cities like Mohenjo-daro and Harappa had planned streets, drainage systems, and standardized weights.",
            examples: [
              "The Indus Valley Civilization was one of the world's earliest urban civilizations and flourished thousands of years ago.",
              "Important cities such as Mohenjo-daro and Harappa were built with planned streets and strong brick houses.",
              "Many homes had wells, bathrooms, and drainage systems, showing advanced town planning.",
              "Farmers grew crops and traders exchanged goods such as beads, pottery, cloth, and metal items.",
              "People used seals and symbols, which tell us they had a system of writing that is still not fully understood.",
              "Archaeologists study ruins and artifacts to learn how ancient people lived and worked.",
              "The civilization developed near the Indus River, which provided water, fertile land, and transport routes.",
              "The discovery of these cities helped the world understand the ancient history of the land that is now Pakistan.",
              "Craftsmen were skilled in pottery, jewelry, and metalwork, showing a high level of organization and trade."
            ],
            exercises: [
              {
                q: "Fill in the blanks:",
                parts: [
                  "What is another name for the Indus Valley Civilization: ___",
                  "Which famous Indus city is in Sindh: ___",
                  "Which famous Indus city is in Punjab: ___",
                  "What famous structure is found at Mohenjo-daro: ___",
                  "What material was commonly used for Indus houses: ___",
                  "How were many Indus streets planned: ___",
                  "What advanced sanitation feature did Indus cities have: ___",
                  "What is the status of the Indus script today: ___",
                  "Which ancient region traded with the Indus people: ___",
                  "When did the civilization reach its peak: ___"
                ],
                ans: [
                  "Harappan Civilization",
                  "Mohenjo-daro",
                  "Harappa",
                  "Great Bath",
                  "Baked bricks",
                  "Grid pattern",
                  "Covered drains",
                  "Undeciphered script",
                  "Mesopotamia",
                  "2600-1900 BCE"
                ]
              },
              {
                q: "True or False:",
                parts: [
                  "Harappa and Mohenjo-daro were planned cities",
                  "The Indus script is fully decoded",
                  "Covered drains show advanced sanitation",
                  "The civilization traded with Mesopotamia",
                  "The Great Bath is in Mohenjo-daro",
                  "Indus homes were made from baked bricks",
                  "Harappa is in modern-day Punjab",
                  "The civilization belongs to the medieval period",
                  "Grid-plan streets were a feature of Indus cities",
                  "The civilization has no importance for Pakistan's history"
                ],
                ans: [
                  "True",
                  "False",
                  "True",
                  "True",
                  "True",
                  "True",
                  "True",
                  "False",
                  "True",
                  "False"
                ]
              },
              {
                q: "Match the columns:",
                parts: [
                  "What is another name for the Indus Valley Civilization",
                  "Which famous Indus city is in Sindh",
                  "Which famous Indus city is in Punjab",
                  "What famous structure is found at Mohenjo-daro",
                  "What material was commonly used for Indus houses",
                  "How were many Indus streets planned",
                  "What advanced sanitation feature did Indus cities have",
                  "What is the status of the Indus script today",
                  "Which ancient region traded with the Indus people",
                  "When did the civilization reach its peak"
                ],
                ans: [
                  "Harappan Civilization",
                  "Mohenjo-daro",
                  "Harappa",
                  "Great Bath",
                  "Baked bricks",
                  "Grid pattern",
                  "Covered drains",
                  "Undeciphered script",
                  "Mesopotamia",
                  "2600-1900 BCE"
                ]
              }
            ],
            wordProblems: [
              {
                q: "In which modern-day province of Pakistan is Mohenjo-daro located?",
                a: "Sindh province(near Larkana)"
              },
              {
                q: "When did the Indus Valley Civilization reach its peak?",
                a: "Around 2600–1900 BCE (approximately 4,600 years ago)"
              },
              {
                q: "What was special about the street layout of Mohenjo-daro?",
                a: "Streets were laid out in a grid pattern — straight roads crossing at right angles, like a modern planned city"
              },
              {
                q: "Name one famous structure found in Mohenjo-daro.",
                a: "The Great Bath — a large publicbathing pool (11.9 m × 7 m), also the Granary"
              },
              {
                q: "What does the 'Great Bath' tell us about Indus Valley people?",
                a: "They valued cleanliness and likely had rituals involving public bathing, possibly for religious purification"
              },
              {
                q: "How did Indus Valley people communicate in writing?",
                a: "Through a pictographic script(symbols on clay seals), but it has not been fully decoded yet"
              },
              {
                q: "Has the Indus Valley script been fully decoded?",
                a: "No — scholars have been trying for over 100 years but the script remains undeciphered"
              },
              {
                q: "What materials did Indus Valley people use to build houses?",
                a: "Standardized baked mud bricks of uniform size — showing organized city planning"
              },
              {
                q: "Name two cities of the Indus Valley Civilization.",
                a: "1. Mohenjo-daro (Sindh) 2. Harappa (Punjab)"
              },
              {
                q: "What evidence shows Indus Valley cities had good sanitation?",
                a: "Covered undergrounddrainage systems, bathrooms in houses, public wells — far advanced for their time"
              },
              {
                q: "The Indus Valley Civilization is also known by what other name?",
                a: "Harappan Civilization (named after Harappa, the first city discovered)"
              },
              {
                q: "What animals did Indus Valley people keep?",
                a: "Cattle, buffalo, sheep, goats, elephants, and dogs"
              },
              {
                q: "Why did the Indus Valley Civilization decline around 1900 BCE?",
                a: "Possible causes: 1. Flooding/river change 2. Climate change/drought 3. Foreign invasions 4. Disease"
              },
              {
                q: "With which ancient civilization did Indus Valley people trade?",
                a: "Mesopotamia (modern-day Iraq) — seals and goods found in both regions"
              },
              {
                q: "What were the weights and measures used for in Indus Valley cities?",
                a: "For fair trade — standardized weights ensured honest buying and selling in markets"
              },
              {
                q: "Where is Harappa located in modern-day Pakistan?",
                a: "In Punjab province, near Sahiwal(formerly Montgomery District)"
              },
              {
                q: "The discovery of Mohenjo-daro in 1922 was made by whom?",
                a: "R. D. Banerji (Indian archaeologist); later excavated by Sir John Marshall"
              },
              {
                q: "Why is the Indus Valley Civilization important to Pakistan's history?",
                a: "It shows Pakistan has 5,000+ years of advanced civilization, predating Rome and ancient Greece"
              },
              {
                q: "What type of government did Indus Valley cities likely have?",
                a: "Evidence suggests agoverning council or priest-kings — all cities used uniform weights and city plans, suggesting central authority"
              },
              {
                q: "Name one skill or craft the Indus Valley people were known for.",
                a: "1. Pottery 2. Bead-making 3. Copper and bronze tools 4. Weaving cotton cloth"
              }
            ],
            quiz: [
              {
                q: "What is another name for the Indus Valley Civilization?",
                a: [
                  "Harappan Civilization",
                  "Mohenjo-daro",
                  "Harappa",
                  "Great Bath"
                ],
                c: 0
              },
              {
                q: "Which famous Indus city is in Sindh?",
                a: [
                  "Harappa",
                  "Mohenjo-daro",
                  "Great Bath",
                  "Baked bricks"
                ],
                c: 1
              },
              {
                q: "Which famous Indus city is in Punjab?",
                a: [
                  "Great Bath",
                  "Baked bricks",
                  "Harappa",
                  "Grid pattern"
                ],
                c: 2
              },
              {
                q: "What famous structure is found at Mohenjo-daro?",
                a: [
                  "Baked bricks",
                  "Grid pattern",
                  "Covered drains",
                  "Great Bath"
                ],
                c: 3
              },
              {
                q: "What material was commonly used for Indus houses?",
                a: [
                  "Baked bricks",
                  "Grid pattern",
                  "Covered drains",
                  "Undeciphered script"
                ],
                c: 0
              },
              {
                q: "How were many Indus streets planned?",
                a: [
                  "Covered drains",
                  "Grid pattern",
                  "Undeciphered script",
                  "Mesopotamia"
                ],
                c: 1
              },
              {
                q: "What advanced sanitation feature did Indus cities have?",
                a: [
                  "Undeciphered script",
                  "Mesopotamia",
                  "Covered drains",
                  "2600-1900 BCE"
                ],
                c: 2
              },
              {
                q: "What is the status of the Indus script today?",
                a: [
                  "Mesopotamia",
                  "2600-1900 BCE",
                  "Harappan Civilization",
                  "Undeciphered script"
                ],
                c: 3
              },
              {
                q: "Which ancient region traded with the Indus people?",
                a: [
                  "Mesopotamia",
                  "2600-1900 BCE",
                  "Harappan Civilization",
                  "Mohenjo-daro"
                ],
                c: 0
              },
              {
                q: "When did the civilization reach its peak?",
                a: [
                  "Harappan Civilization",
                  "2600-1900 BCE",
                  "Mohenjo-daro",
                  "Harappa"
                ],
                c: 1
              },
              {
                q: "Harappa and Mohenjo-daro were planned cities",
                a: [
                  "True",
                  "False"
                ],
                c: 0
              },
              {
                q: "The Indus script is fully decoded",
                a: [
                  "False",
                  "True"
                ],
                c: 0
              },
              {
                q: "Covered drains show advanced sanitation",
                a: [
                  "True",
                  "False"
                ],
                c: 0
              },
              {
                q: "The civilization traded with Mesopotamia",
                a: [
                  "False",
                  "True"
                ],
                c: 1
              },
              {
                q: "The Great Bath is in Mohenjo-daro",
                a: [
                  "True",
                  "False"
                ],
                c: 0
              },
              {
                q: "Indus homes were made from baked bricks",
                a: [
                  "False",
                  "True"
                ],
                c: 1
              },
              {
                q: "Harappa is in modern-day Punjab",
                a: [
                  "True",
                  "False"
                ],
                c: 0
              },
              {
                q: "The civilization belongs to the medieval period",
                a: [
                  "False",
                  "True"
                ],
                c: 0
              },
              {
                q: "Grid-plan streets were a feature of Indus cities",
                a: [
                  "True",
                  "False"
                ],
                c: 0
              },
              {
                q: "The civilization has no importance for Pakistan's history",
                a: [
                  "False",
                  "True"
                ],
                c: 0
              }
            ]
          },
          {
            t: "Mughal Empire & British Rule",
            c: "The Mughal Empire (1526–1857) ruled the subcontinent for over 300 years, leaving mosques, forts, and gardens in Pakistan. British rule (1857–1947) then transformed the region until independence.",
            examples: [
              "The Mughal Empire ruled much of South Asia and influenced architecture, language, art, administration, and culture.",
              "Mughal rulers built famous structures, gardens, forts, and mosques, including many landmarks in present-day Pakistan.",
              "Persian, local languages, calligraphy, miniature painting, and court culture grew strongly in the Mughal period.",
              "Later, the British East India Company and then the British government gained control over the region.",
              "British rule changed education, railways, law, administration, and trade, but it also limited local freedom.",
              "Many people resisted colonial rule and demanded fair rights and self-government.",
              "New roads, railways, and communication systems connected cities, but these mainly served colonial interests.",
              "The effects of Mughal and British periods can still be seen in buildings, institutions, and social life.",
              "Understanding these eras helps students explain how outside rulers shaped the subcontinent before independence."
            ],
            exercises: [
              {
                q: "Fill in the blanks:",
                parts: [
                  "Who founded the Mughal Empire: ___",
                  "In which year did the Mughal Empire begin: ___",
                  "Badshahi Mosque is in which city: ___",
                  "Which emperor is linked with Badshahi Mosque: ___",
                  "Which year is linked with direct British rule after revolt: ___",
                  "When did British rule end in the subcontinent: ___",
                  "Who was the last Mughal emperor: ___",
                  "What kind of monuments did the Mughals leave behind: ___",
                  "What major changes came during British rule: ___",
                  "British rule in South Asia is also called what: ___"
                ],
                ans: [
                  "Babur",
                  "1526",
                  "Lahore",
                  "Aurangzeb",
                  "1857",
                  "1947",
                  "Bahadur Shah Zafar",
                  "Mosques and forts",
                  "Railways and administration",
                  "Colonial rule"
                ]
              },
              {
                q: "True or False:",
                parts: [
                  "Babur founded the Mughal Empire",
                  "Aurangzeb was a Mughal emperor",
                  "Badshahi Mosque is in Lahore",
                  "British rule ended in 1947",
                  "The Mughals left forts and mosques",
                  "British rule began after 3000 BCE",
                  "Bahadur Shah Zafar was the last Mughal emperor",
                  "The Mughals ruled for only five years",
                  "Railways expanded during British rule",
                  "Badshahi Mosque is in Quetta"
                ],
                ans: [
                  "True",
                  "True",
                  "True",
                  "True",
                  "True",
                  "False",
                  "True",
                  "False",
                  "True",
                  "False"
                ]
              },
              {
                q: "Match the columns:",
                parts: [
                  "Who founded the Mughal Empire",
                  "In which year did the Mughal Empire begin",
                  "Badshahi Mosque is in which city",
                  "Which emperor is linked with Badshahi Mosque",
                  "Which year is linked with direct British rule after revolt",
                  "When did British rule end in the subcontinent",
                  "Who was the last Mughal emperor",
                  "What kind of monuments did the Mughals leave behind",
                  "What major changes came during British rule",
                  "British rule in South Asia is also called what"
                ],
                ans: [
                  "Babur",
                  "1526",
                  "Lahore",
                  "Aurangzeb",
                  "1857",
                  "1947",
                  "Bahadur Shah Zafar",
                  "Mosques and forts",
                  "Railways and administration",
                  "Colonial rule"
                ]
              }
            ],
            wordProblems: [
              {
                q: "Who founded the Mughal Empire and in which year?",
                a: "Babur (Zahiruddin Muhammad Babur) founded the Mughal Empire in 1526 after the First Battle of Panipat"
              },
              {
                q: "Which Mughal emperor built the Taj Mahal?",
                a: "Shah Jahan (built 1632–1653 in Agra, asa memorial for his wife Mumtaz Mahal)"
              },
              {
                q: "Name the famous mosque in Lahore built by the Mughals.",
                a: "Badshahi Mosque (built byAurangzeb in 1673) — one of the world's largest mosques"
              },
              {
                q: "Which Mughal emperor's rule is called the 'Golden Age'?",
                a: "Akbar the Great (1556–1605) — expanded empire, promoted arts, was religiously tolerant"
              },
              {
                q: "What was the official language of the Mughal court?",
                a: "Persian (Farsi) — also promoted Urdu as a mixed language of the court"
              },
              {
                q: "When did British rule formally begin in the subcontinent?",
                a: "1858 (after the 1857 War of Independence, the British Crown took direct control)"
              },
              {
                q: "What event in 1857 is called the 'War of Independence' in Pakistan?",
                a: "The uprisingagainst the British East India Company — soldiers and civilians rebelled but were defeated"
              },
              {
                q: "Who founded the Aligarh Muslim University to modernize Muslim education?",
                a: "Sir SyedAhmad Khan (founded MAO College in Aligarh, 1875)"
              },
              {
                q: "What was the 'Two Nation Theory'?",
                a: "The idea that Muslims and Hindus are two separate nations with different religion, culture and way of life — they need separate homelands"
              },
              {
                q: "Name one important fort built by the Mughals in Lahore.",
                a: "Lahore Fort (Shahi Qila)— built and expanded by multiple Mughal emperors"
              },
              {
                q: "How did British rule affect local industries?",
                a: "British factory goods replaced local crafts; traditional textile industries suffered; taxes increased poverty"
              },
              {
                q: "Which Mughal emperor extended the empire to its greatest size?",
                a: "Aurangzeb Alamgir(reigned 1658–1707) — empire reached into the Deccan (southern India)"
              },
              {
                q: "Name two examples of Mughal architecture still found in Pakistan.",
                a: "1. Lahore Fort(Shahi Qila) 2. Badshahi Mosque 3. Shalimar Gardens (all in Lahore)"
              },
              {
                q: "What was the role of the East India Company in South Asia?",
                a: "Started as a trading company; gradually seized political and military control; ruled India until 1858"
              },
              {
                q: "Who was the last Mughal emperor?",
                a: "Bahadur Shah Zafar II — exiled by the British toBurma in 1858 after the failed uprising"
              },
              {
                q: "How did the Mughal era contribute to Pakistan's culture today?",
                a: "Mughal art, architecture (mosques, forts, gardens), Urdu language, music, and cuisine became integral parts of Pakistani culture"
              },
              {
                q: "Name a garden built by the Mughals still visited in Lahore.",
                a: "Shalimar Gardens (Bagh-e-Shalimar) — built by Shah Jahan in 1641"
              },
              {
                q: "What language became common among the people during the Mughal era?",
                a: "Urdu — a mixof Persian, Arabic, and local languages, still Pakistan's national language"
              },
              {
                q: "Why did Muslims need a separate country according to the Two Nation Theory?",
                a: "Theyfeared their religion, culture, and rights would not be protected in a Hindu-majority India"
              },
              {
                q: "Name three qualities of Akbar the Great that made him an outstanding ruler.",
                a: "1. Religious tolerance (Din-i-Ilahi) 2. Just administration 3. Patronage of arts, music, and literature"
              }
            ],
            quiz: [
              {
                q: "Who founded the Mughal Empire?",
                a: [
                  "Babur",
                  "1526",
                  "Lahore",
                  "Aurangzeb"
                ],
                c: 0
              },
              {
                q: "In which year did the Mughal Empire begin?",
                a: [
                  "Lahore",
                  "1526",
                  "Aurangzeb",
                  "1857"
                ],
                c: 1
              },
              {
                q: "Badshahi Mosque is in which city?",
                a: [
                  "Aurangzeb",
                  "1857",
                  "Lahore",
                  "1947"
                ],
                c: 2
              },
              {
                q: "Which emperor is linked with Badshahi Mosque?",
                a: [
                  "1857",
                  "1947",
                  "Bahadur Shah Zafar",
                  "Aurangzeb"
                ],
                c: 3
              },
              {
                q: "Which year is linked with direct British rule after revolt?",
                a: [
                  "1857",
                  "1947",
                  "Bahadur Shah Zafar",
                  "Mosques and forts"
                ],
                c: 0
              },
              {
                q: "When did British rule end in the subcontinent?",
                a: [
                  "Bahadur Shah Zafar",
                  "1947",
                  "Mosques and forts",
                  "Railways and administration"
                ],
                c: 1
              },
              {
                q: "Who was the last Mughal emperor?",
                a: [
                  "Mosques and forts",
                  "Railways and administration",
                  "Bahadur Shah Zafar",
                  "Colonial rule"
                ],
                c: 2
              },
              {
                q: "What kind of monuments did the Mughals leave behind?",
                a: [
                  "Railways and administration",
                  "Colonial rule",
                  "Babur",
                  "Mosques and forts"
                ],
                c: 3
              },
              {
                q: "What major changes came during British rule?",
                a: [
                  "Railways and administration",
                  "Colonial rule",
                  "Babur",
                  "1526"
                ],
                c: 0
              },
              {
                q: "British rule in South Asia is also called what?",
                a: [
                  "Babur",
                  "Colonial rule",
                  "1526",
                  "Lahore"
                ],
                c: 1
              },
              {
                q: "Babur founded the Mughal Empire",
                a: [
                  "True",
                  "False"
                ],
                c: 0
              },
              {
                q: "Aurangzeb was a Mughal emperor",
                a: [
                  "False",
                  "True"
                ],
                c: 1
              },
              {
                q: "Badshahi Mosque is in Lahore",
                a: [
                  "True",
                  "False"
                ],
                c: 0
              },
              {
                q: "British rule ended in 1947",
                a: [
                  "False",
                  "True"
                ],
                c: 1
              },
              {
                q: "The Mughals left forts and mosques",
                a: [
                  "True",
                  "False"
                ],
                c: 0
              },
              {
                q: "British rule began after 3000 BCE",
                a: [
                  "False",
                  "True"
                ],
                c: 0
              },
              {
                q: "Bahadur Shah Zafar was the last Mughal emperor",
                a: [
                  "True",
                  "False"
                ],
                c: 0
              },
              {
                q: "The Mughals ruled for only five years",
                a: [
                  "False",
                  "True"
                ],
                c: 0
              },
              {
                q: "Railways expanded during British rule",
                a: [
                  "True",
                  "False"
                ],
                c: 0
              },
              {
                q: "Badshahi Mosque is in Quetta",
                a: [
                  "False",
                  "True"
                ],
                c: 0
              }
            ]
          }
        ]
      },
      {
        title: "Independence & National Identity",
        content: "Pakistan's struggle for independence, the role of Quaid-e-Azam Muhammad Ali Jinnah and Allama Iqbal, August 14 1947, and Pakistan's national symbols.",
        key: "independence5",
        hasMathSub: true,
        subs: [
          {
            t: "Freedom Movement & Quaid-e-Azam",
            svgType: "pakFlag",
            c: "Muhammad Ali Jinnah led the All India Muslim League to win Pakistan's independence on August 14, 1947. Allama Iqbal's vision inspired the movement.",
            examples: [
              "The freedom movement was a long political struggle to secure a separate homeland for the Muslims of the subcontinent.",
              "Quaid-e-Azam Muhammad Ali Jinnah led the movement with determination, clear leadership, and constitutional struggle.",
              "Allama Iqbal's ideas encouraged Muslims to think about political identity, self-respect, and a separate homeland.",
              "The Lahore Resolution of 1940 was an important step toward the creation of Pakistan.",
              "Pakistan came into being on 14 August 1947 after years of effort and sacrifice.",
              "Quaid-e-Azam became the founder of Pakistan and guided the new country in its early days.",
              "The movement taught the values of unity, faith, discipline, and national purpose.",
              "Many men and women contributed to the struggle through speeches, organization, and political work.",
              "Independence brought both hope and major challenges, including migration and building new institutions."
            ],
            exercises: [
              {
                q: "Fill in the blanks:",
                parts: [
                  "When did Pakistan become independent: ___",
                  "Who led the movement for Pakistan: ___",
                  "Muhammad Ali Jinnah is known by which title: ___",
                  "Which political party did Quaid-e-Azam lead: ___",
                  "Who inspired the idea of a separate homeland: ___",
                  "In which city was the Pakistan Resolution passed: ___",
                  "In which year was the Pakistan Resolution passed: ___",
                  "Who was Pakistan's first Prime Minister: ___",
                  "When was Quaid-e-Azam born: ___",
                  "What was the main goal of the freedom movement: ___"
                ],
                ans: [
                  "14 August 1947",
                  "Muhammad Ali Jinnah",
                  "Quaid-e-Azam",
                  "All India Muslim League",
                  "Allama Iqbal",
                  "Lahore",
                  "1940",
                  "Liaquat Ali Khan",
                  "25 December 1876",
                  "Separate homeland"
                ]
              },
              {
                q: "True or False:",
                parts: [
                  "Pakistan became independent in 1947",
                  "Quaid-e-Azam led the Muslim League",
                  "Allama Iqbal inspired the idea of Pakistan",
                  "Liaquat Ali Khan was the first Prime Minister",
                  "14 August is Pakistan's Independence Day",
                  "Pakistan became independent in 1957",
                  "The Lahore Resolution was passed in Lahore",
                  "Jinnah is called Quaid-e-Azam",
                  "The freedom movement wanted a separate homeland",
                  "Allama Iqbal was Pakistan's first Prime Minister"
                ],
                ans: [
                  "True",
                  "True",
                  "True",
                  "True",
                  "True",
                  "False",
                  "True",
                  "True",
                  "True",
                  "False"
                ]
              },
              {
                q: "Match the columns:",
                parts: [
                  "When did Pakistan become independent",
                  "Who led the movement for Pakistan",
                  "Muhammad Ali Jinnah is known by which title",
                  "Which political party did Quaid-e-Azam lead",
                  "Who inspired the idea of a separate homeland",
                  "In which city was the Pakistan Resolution passed",
                  "In which year was the Pakistan Resolution passed",
                  "Who was Pakistan's first Prime Minister",
                  "When was Quaid-e-Azam born",
                  "What was the main goal of the freedom movement"
                ],
                ans: [
                  "14 August 1947",
                  "Muhammad Ali Jinnah",
                  "Quaid-e-Azam",
                  "All India Muslim League",
                  "Allama Iqbal",
                  "Lahore",
                  "1940",
                  "Liaquat Ali Khan",
                  "25 December 1876",
                  "Separate homeland"
                ]
              }
            ],
            wordProblems: [
              {
                q: "What is Quaid-e-Azam's full name?",
                a: "Muhammad Ali Jinnah (Quaid-e-Azam = 'Great Leader' in Urdu)"
              },
              {
                q: "In which city was Quaid-e-Azam born?",
                a: "Karachi (born December 25, 1876)"
              },
              {
                q: "When was Pakistan created (full date)?",
                a: "August 14, 1947 (14th August 1947)"
              },
              {
                q: "What does 'Quaid-e-Azam' mean in English?",
                a: "'Great Leader' or 'Supreme Leader'"
              },
              {
                q: "What was Allama Iqbal's vision for the Muslims of the subcontinent?",
                a: "A separate, independent homeland where Muslims could live freely according to their faith and culture — which became Pakistan"
              },
              {
                q: "What was the Pakistan Resolution of 1940?",
                a: "A resolution passed by the All India Muslim League demanding a separate independent state for Muslims in the subcontinent"
              },
              {
                q: "In which city was the Pakistan Resolution passed?",
                a: "Lahore (at Minto Park, now called Iqbal Park)"
              },
              {
                q: "Who was the first Prime Minister of Pakistan?",
                a: "Liaquat Ali Khan"
              },
              {
                q: "When did Quaid-e-Azam become Pakistan's first Governor-General?",
                a: "August 14, 1947 —the day of independence"
              },
              {
                q: "Which political party led the movement for Pakistan's independence?",
                a: "All India Muslim League (founded 1906)"
              },
              {
                q: "Name two leaders who worked for Pakistan's independence besides Quaid-e-Azam.",
                a: "1.Allama Iqbal 2. Liaquat Ali Khan (also Fatima Jinnah, Sir Syed Ahmad Khan)"
              },
              {
                q: "What is the significance of August 14th for Pakistan?",
                a: "It is Pakistan's Independence Day — celebrated every year with flag hoisting, parades, and national pride"
              },
              {
                q: "What does 'Pakistan' literally mean?",
                a: "'Land of the Pure' (Pak = Pure, Stan = Land)"
              },
              {
                q: "In which year did the All India Muslim League pass the Lahore Resolution?",
                a: "1940"
              },
              {
                q: "When did Quaid-e-Azam pass away?",
                a: "September 11, 1948 (just 13 months after independence)"
              },
              {
                q: "What was Allama Iqbal's famous poem that inspired Muslim youth?",
                a: "'Lab pe aati haidua ban ke tamanna meri' and 'Tarana-e-Milli' ('Chino Arab hamara') among many others"
              },
              {
                q: "What hardships faced by Muslims led to the demand for a separate homeland?",
                a: "1. Separate electorates ignored 2. Cultural and religious differences 3. Fear of Hindu-majority rule 4. Economic discrimination"
              },
              {
                q: "Name two places in Pakistan where you can visit memorials to Quaid-e-Azam.",
                a: "1. Mazar-e-Quaid (tomb) in Karachi 2. Quaid-e-Azam's birthplace and museum in Karachi"
              },
              {
                q: "Why is Allama Iqbal called the 'Poet of the East' (Shair-e-Mashriq)?",
                a: "His poetry in Urdu and Persian inspired Muslim identity, revival, and the dream of freedom across the Muslim world"
              },
              {
                q: "What profession was Quaid-e-Azam trained in?",
                a: "Law — he was a brilliant barrister trained in London (Lincoln's Inn)"
              }
            ],
            quiz: [
              {
                q: "When did Pakistan become independent?",
                a: [
                  "14 August 1947",
                  "Muhammad Ali Jinnah",
                  "Quaid-e-Azam",
                  "All India Muslim League"
                ],
                c: 0
              },
              {
                q: "Who led the movement for Pakistan?",
                a: [
                  "Quaid-e-Azam",
                  "Muhammad Ali Jinnah",
                  "All India Muslim League",
                  "Allama Iqbal"
                ],
                c: 1
              },
              {
                q: "Muhammad Ali Jinnah is known by which title?",
                a: [
                  "All India Muslim League",
                  "Allama Iqbal",
                  "Quaid-e-Azam",
                  "Lahore"
                ],
                c: 2
              },
              {
                q: "Which political party did Quaid-e-Azam lead?",
                a: [
                  "Allama Iqbal",
                  "Lahore",
                  "1940",
                  "All India Muslim League"
                ],
                c: 3
              },
              {
                q: "Who inspired the idea of a separate homeland?",
                a: [
                  "Allama Iqbal",
                  "Lahore",
                  "1940",
                  "Liaquat Ali Khan"
                ],
                c: 0
              },
              {
                q: "In which city was the Pakistan Resolution passed?",
                a: [
                  "1940",
                  "Lahore",
                  "Liaquat Ali Khan",
                  "25 December 1876"
                ],
                c: 1
              },
              {
                q: "In which year was the Pakistan Resolution passed?",
                a: [
                  "Liaquat Ali Khan",
                  "25 December 1876",
                  "1940",
                  "Separate homeland"
                ],
                c: 2
              },
              {
                q: "Who was Pakistan's first Prime Minister?",
                a: [
                  "25 December 1876",
                  "Separate homeland",
                  "14 August 1947",
                  "Liaquat Ali Khan"
                ],
                c: 3
              },
              {
                q: "When was Quaid-e-Azam born?",
                a: [
                  "25 December 1876",
                  "Separate homeland",
                  "14 August 1947",
                  "Muhammad Ali Jinnah"
                ],
                c: 0
              },
              {
                q: "What was the main goal of the freedom movement?",
                a: [
                  "14 August 1947",
                  "Separate homeland",
                  "Muhammad Ali Jinnah",
                  "Quaid-e-Azam"
                ],
                c: 1
              },
              {
                q: "Pakistan became independent in 1947",
                a: [
                  "True",
                  "False"
                ],
                c: 0
              },
              {
                q: "Quaid-e-Azam led the Muslim League",
                a: [
                  "False",
                  "True"
                ],
                c: 1
              },
              {
                q: "Allama Iqbal inspired the idea of Pakistan",
                a: [
                  "True",
                  "False"
                ],
                c: 0
              },
              {
                q: "Liaquat Ali Khan was the first Prime Minister",
                a: [
                  "False",
                  "True"
                ],
                c: 1
              },
              {
                q: "14 August is Pakistan's Independence Day",
                a: [
                  "True",
                  "False"
                ],
                c: 0
              },
              {
                q: "Pakistan became independent in 1957",
                a: [
                  "False",
                  "True"
                ],
                c: 0
              },
              {
                q: "The Lahore Resolution was passed in Lahore",
                a: [
                  "True",
                  "False"
                ],
                c: 0
              },
              {
                q: "Jinnah is called Quaid-e-Azam",
                a: [
                  "False",
                  "True"
                ],
                c: 1
              },
              {
                q: "The freedom movement wanted a separate homeland",
                a: [
                  "True",
                  "False"
                ],
                c: 0
              },
              {
                q: "Allama Iqbal was Pakistan's first Prime Minister",
                a: [
                  "False",
                  "True"
                ],
                c: 0
              }
            ]
          },
          {
            t: "Pakistan's National Symbols",
            c: "Pakistan's flag is dark green and white with a crescent and star. The national anthem is Qaumi Tarana. Other symbols include the Snow Leopard, Jasmine, Shaheen, and Field Hockey.",
            examples: [
              "Pakistan's national flag has a dark green field, a white stripe, a white crescent, and a five-pointed star.",
              "The green part represents the Muslim majority, while the white stripe represents minorities and peace.",
              "The crescent is commonly linked with progress, and the star represents light and knowledge.",
              "The national anthem expresses pride, unity, and love for the homeland.",
              "The national language is Urdu, while many regional languages are also spoken across the country.",
              "The national flower is jasmine, and the national animal is the markhor.",
              "The national bird is the chukar, and the national tree is the deodar.",
              "National symbols help citizens remember identity, unity, and shared heritage.",
              "The flag is raised on national days, at schools, and at official buildings as a sign of respect."
            ],
            exercises: [
              {
                q: "Fill in the blanks:",
                parts: [
                  "What is Pakistan's national language: ___",
                  "What is Pakistan's national flower: ___",
                  "What is Pakistan's national bird: ___",
                  "What is Pakistan's national animal: ___",
                  "What is Pakistan's national fruit: ___",
                  "What is Pakistan's national sport: ___",
                  "What is Pakistan's national anthem called: ___",
                  "Who wrote the lyrics of Pakistan's anthem: ___",
                  "What are the main colors of Pakistan's flag: ___",
                  "What key symbols appear on Pakistan's flag: ___"
                ],
                ans: [
                  "Urdu",
                  "Jasmine",
                  "Shaheen",
                  "Snow Leopard",
                  "Mango",
                  "Field Hockey",
                  "Qaumi Tarana",
                  "Hafeez Jalandhari",
                  "Green and white",
                  "Crescent and star"
                ]
              },
              {
                q: "True or False:",
                parts: [
                  "Urdu is Pakistan's national language",
                  "Jasmine is the national flower",
                  "Shaheen is the national bird",
                  "Snow Leopard is a national symbol",
                  "Field Hockey is the national sport",
                  "Pakistan's flag has no star",
                  "Qaumi Tarana is the national anthem",
                  "Mango is the national fruit",
                  "The national flower is rose",
                  "Hafeez Jalandhari wrote the anthem lyrics"
                ],
                ans: [
                  "True",
                  "True",
                  "True",
                  "True",
                  "True",
                  "False",
                  "True",
                  "True",
                  "False",
                  "True"
                ]
              },
              {
                q: "Match the columns:",
                parts: [
                  "What is Pakistan's national language",
                  "What is Pakistan's national flower",
                  "What is Pakistan's national bird",
                  "What is Pakistan's national animal",
                  "What is Pakistan's national fruit",
                  "What is Pakistan's national sport",
                  "What is Pakistan's national anthem called",
                  "Who wrote the lyrics of Pakistan's anthem",
                  "What are the main colors of Pakistan's flag",
                  "What key symbols appear on Pakistan's flag"
                ],
                ans: [
                  "Urdu",
                  "Jasmine",
                  "Shaheen",
                  "Snow Leopard",
                  "Mango",
                  "Field Hockey",
                  "Qaumi Tarana",
                  "Hafeez Jalandhari",
                  "Green and white",
                  "Crescent and star"
                ]
              }
            ],
            wordProblems: [
              {
                q: "What are the two colors of Pakistan's national flag?",
                a: "Dark green and white"
              },
              {
                q: "What does the green color on Pakistan's flag represent?",
                a: "Islam and the Muslim majority of Pakistan"
              },
              {
                q: "What does the white portion of Pakistan's flag represent?",
                a: "Religious minorities ofPakistan (non-Muslim citizens)"
              },
              {
                q: "What do the crescent (hilal) and star on the flag represent?",
                a: "Crescent = progressand light; Star = knowledge and guidance (also Islamic symbolism)"
              },
              {
                q: "Who wrote the words of Pakistan's national anthem (Qaumi Tarana)?",
                a: "Hafeez Jalandhari (adopted officially in 1954)"
              },
              {
                q: "Who composed the music for Pakistan's national anthem?",
                a: "Ahmed Ghulamali Chagla"
              },
              {
                q: "What is the national animal of Pakistan?",
                a: "Snow Leopard (Panthera uncia) — lives inthe mountains of northern Pakistan"
              },
              {
                q: "What is the national bird of Pakistan?",
                a: "Shaheen (Peregrine Falcon) — a symbol of courage and speed"
              },
              {
                q: "What is the national flower of Pakistan?",
                a: "Jasmine (Chambeli/Yasmeen)"
              },
              {
                q: "What is the national fruit of Pakistan?",
                a: "Mango (Mangifera indica) — Pakistan exports famous varieties like Chaunsa and Anwar Ratol"
              },
              {
                q: "What is the national sport of Pakistan?",
                a: "Field Hockey — Pakistan won multiple Olympic gold medals (1960, 1968, 1976, 1978, 1982, 1984)"
              },
              {
                q: "What is the national tree of Pakistan?",
                a: "Deodar Cedar (Cedrus deodara)"
              },
              {
                q: "What is the national language of Pakistan?",
                a: "Urdu"
              },
              {
                q: "How many stars are on Pakistan's flag?",
                a: "One star (5-pointed star alongside the crescent)"
              },
              {
                q: "What does 'Qaumi Tarana' mean in English?",
                a: "'National Anthem' (Qaumi = national, Tarana = anthem/song)"
              },
              {
                q: "What is the currency of Pakistan?",
                a: "Pakistani Rupee (PKR)"
              },
              {
                q: "What is Quaid-e-Azam's famous three-word motto for Pakistan?",
                a: "'Iman, Ittehad, Nazm' — Faith, Unity, Discipline"
              },
              {
                q: "On which occasions is the Pakistan flag flown at half-mast?",
                a: "On national days of mourning, death of national leaders, or national tragedies"
              },
              {
                q: "What is March 23 celebrated as in Pakistan?",
                a: "Pakistan Day (Youm-e-Pakistan) — anniversary of the 1940 Lahore/Pakistan Resolution"
              },
              {
                q: "Name the national monument in Islamabad that represents Pakistan's four provinces.",
                a: "Minar-e-Pakistan is in Lahore; the Pakistan Monument in Islamabad has four petals representing thefour provinces"
              }
            ],
            quiz: [
              {
                q: "What is Pakistan's national language?",
                a: [
                  "Urdu",
                  "Jasmine",
                  "Shaheen",
                  "Snow Leopard"
                ],
                c: 0
              },
              {
                q: "What is Pakistan's national flower?",
                a: [
                  "Shaheen",
                  "Jasmine",
                  "Snow Leopard",
                  "Mango"
                ],
                c: 1
              },
              {
                q: "What is Pakistan's national bird?",
                a: [
                  "Snow Leopard",
                  "Mango",
                  "Shaheen",
                  "Field Hockey"
                ],
                c: 2
              },
              {
                q: "What is Pakistan's national animal?",
                a: [
                  "Mango",
                  "Field Hockey",
                  "Qaumi Tarana",
                  "Snow Leopard"
                ],
                c: 3
              },
              {
                q: "What is Pakistan's national fruit?",
                a: [
                  "Mango",
                  "Field Hockey",
                  "Qaumi Tarana",
                  "Hafeez Jalandhari"
                ],
                c: 0
              },
              {
                q: "What is Pakistan's national sport?",
                a: [
                  "Qaumi Tarana",
                  "Field Hockey",
                  "Hafeez Jalandhari",
                  "Green and white"
                ],
                c: 1
              },
              {
                q: "What is Pakistan's national anthem called?",
                a: [
                  "Hafeez Jalandhari",
                  "Green and white",
                  "Qaumi Tarana",
                  "Crescent and star"
                ],
                c: 2
              },
              {
                q: "Who wrote the lyrics of Pakistan's anthem?",
                a: [
                  "Green and white",
                  "Crescent and star",
                  "Urdu",
                  "Hafeez Jalandhari"
                ],
                c: 3
              },
              {
                q: "What are the main colors of Pakistan's flag?",
                a: [
                  "Green and white",
                  "Crescent and star",
                  "Urdu",
                  "Jasmine"
                ],
                c: 0
              },
              {
                q: "What key symbols appear on Pakistan's flag?",
                a: [
                  "Urdu",
                  "Crescent and star",
                  "Jasmine",
                  "Shaheen"
                ],
                c: 1
              },
              {
                q: "Urdu is Pakistan's national language",
                a: [
                  "True",
                  "False"
                ],
                c: 0
              },
              {
                q: "Jasmine is the national flower",
                a: [
                  "False",
                  "True"
                ],
                c: 1
              },
              {
                q: "Shaheen is the national bird",
                a: [
                  "True",
                  "False"
                ],
                c: 0
              },
              {
                q: "Snow Leopard is a national symbol",
                a: [
                  "False",
                  "True"
                ],
                c: 1
              },
              {
                q: "Field Hockey is the national sport",
                a: [
                  "True",
                  "False"
                ],
                c: 0
              },
              {
                q: "Pakistan's flag has no star",
                a: [
                  "False",
                  "True"
                ],
                c: 0
              },
              {
                q: "Qaumi Tarana is the national anthem",
                a: [
                  "True",
                  "False"
                ],
                c: 0
              },
              {
                q: "Mango is the national fruit",
                a: [
                  "False",
                  "True"
                ],
                c: 1
              },
              {
                q: "The national flower is rose",
                a: [
                  "True",
                  "False"
                ],
                c: 1
              },
              {
                q: "Hafeez Jalandhari wrote the anthem lyrics",
                a: [
                  "False",
                  "True"
                ],
                c: 1
              }
            ]
          }
        ]
      },
      {
        title: "Government & Citizenship",
        content: "Students learn Pakistan's government structure, citizens' rights and responsibilities, and also compare a presidential system with Pakistan's federal parliamentry system.",
        key: "government5",
        hasMathSub: true,
        subs: [
          {
            t: "Pakistan's Government Structure",
            svgType: "pakGov",
            c: "Pakistan is an Islamic Federal Republic. The President is Head of State. The Prime Minister is Head of Government. Parliament makes laws; the Supreme Court upholds them.",
            examples: [
              "Pakistan is a federal country with a national government and provincial governments that share responsibilities.",
              "The Constitution explains how the state works and how power is divided among institutions.",
              "The President is the head of state, while the Prime Minister is the head of government.",
              "Parliament makes laws, discusses national issues, and represents the people.",
              "The judiciary interprets the law and gives decisions according to the Constitution.",
              "Provinces have their own governments to manage many regional matters.",
              "Elections allow citizens to choose representatives for assemblies and Parliament.",
              "The separation of powers helps prevent one institution from controlling everything.",
              "Local governments also help manage community services and local issues."
            ],
            exercises: [
              {
                q: "Fill in the blanks:",
                parts: [
                  "What type of government does Pakistan have: ___",
                  "Who is the Head of State in Pakistan: ___",
                  "Who is the Head of Government in Pakistan: ___",
                  "What is the lower house of Parliament called: ___",
                  "What is the upper house of Parliament called: ___",
                  "What is Pakistan's highest court called: ___",
                  "Pakistan's Parliament is also called: ___",
                  "Pakistan's current Constitution was adopted in which year: ___",
                  "What are the three branches of government: ___",
                  "What is the minimum voting age in Pakistan: ___"
                ],
                ans: [
                  "Islamic Federal Republic",
                  "President",
                  "Prime Minister",
                  "National Assembly",
                  "Senate",
                  "Supreme Court",
                  "Majlis-e-Shoora",
                  "1973",
                  "Legislature, Executive, Judiciary",
                  "18 years"
                ]
              },
              {
                q: "True or False:",
                parts: [
                  "Pakistan is an Islamic Federal Republic",
                  "The President is the Head of State",
                  "The Prime Minister is the Head of Government",
                  "The Supreme Court is the highest court",
                  "The National Assembly is part of Parliament",
                  "The Senate is the lower house",
                  "Pakistan's Constitution was adopted in 1973",
                  "The judiciary makes all elections happen",
                  "Majlis-e-Shoora is another name for Parliament",
                  "Citizens can vote before age 10"
                ],
                ans: [
                  "True",
                  "True",
                  "True",
                  "True",
                  "True",
                  "False",
                  "True",
                  "False",
                  "True",
                  "False"
                ]
              },
              {
                q: "Match the columns:",
                parts: [
                  "What type of government does Pakistan have",
                  "Who is the Head of State in Pakistan",
                  "Who is the Head of Government in Pakistan",
                  "What is the lower house of Parliament called",
                  "What is the upper house of Parliament called",
                  "What is Pakistan's highest court called",
                  "Pakistan's Parliament is also called",
                  "Pakistan's current Constitution was adopted in which year",
                  "What are the three branches of government",
                  "What is the minimum voting age in Pakistan"
                ],
                ans: [
                  "Islamic Federal Republic",
                  "President",
                  "Prime Minister",
                  "National Assembly",
                  "Senate",
                  "Supreme Court",
                  "Majlis-e-Shoora",
                  "1973",
                  "Legislature, Executive, Judiciary",
                  "18 years"
                ]
              }
            ],
            quiz: [
              {
                q: "What type of government does Pakistan have?",
                a: [
                  "Islamic Federal Republic",
                  "President",
                  "Prime Minister",
                  "National Assembly"
                ],
                c: 0
              },
              {
                q: "Who is the Head of State in Pakistan?",
                a: [
                  "Prime Minister",
                  "President",
                  "National Assembly",
                  "Senate"
                ],
                c: 1
              },
              {
                q: "Who is the Head of Government in Pakistan?",
                a: [
                  "National Assembly",
                  "Senate",
                  "Prime Minister",
                  "Supreme Court"
                ],
                c: 2
              },
              {
                q: "What is the lower house of Parliament called?",
                a: [
                  "Senate",
                  "Supreme Court",
                  "Majlis-e-Shoora",
                  "National Assembly"
                ],
                c: 3
              },
              {
                q: "What is the upper house of Parliament called?",
                a: [
                  "Senate",
                  "Supreme Court",
                  "Majlis-e-Shoora",
                  "1973"
                ],
                c: 0
              },
              {
                q: "What is Pakistan's highest court called?",
                a: [
                  "Majlis-e-Shoora",
                  "Supreme Court",
                  "1973",
                  "Legislature, Executive, Judiciary"
                ],
                c: 1
              },
              {
                q: "Pakistan's Parliament is also called?",
                a: [
                  "1973",
                  "Legislature, Executive, Judiciary",
                  "Majlis-e-Shoora",
                  "18 years"
                ],
                c: 2
              },
              {
                q: "Pakistan's current Constitution was adopted in which year?",
                a: [
                  "Legislature, Executive, Judiciary",
                  "18 years",
                  "Islamic Federal Republic",
                  "1973"
                ],
                c: 3
              },
              {
                q: "What are the three branches of government?",
                a: [
                  "Legislature, Executive, Judiciary",
                  "18 years",
                  "Islamic Federal Republic",
                  "President"
                ],
                c: 0
              },
              {
                q: "What is the minimum voting age in Pakistan?",
                a: [
                  "Islamic Federal Republic",
                  "18 years",
                  "President",
                  "Prime Minister"
                ],
                c: 1
              },
              {
                q: "Pakistan is an Islamic Federal Republic",
                a: [
                  "True",
                  "False"
                ],
                c: 0
              },
              {
                q: "The President is the Head of State",
                a: [
                  "False",
                  "True"
                ],
                c: 1
              },
              {
                q: "The Prime Minister is the Head of Government",
                a: [
                  "True",
                  "False"
                ],
                c: 0
              },
              {
                q: "The Supreme Court is the highest court",
                a: [
                  "False",
                  "True"
                ],
                c: 1
              },
              {
                q: "The National Assembly is part of Parliament",
                a: [
                  "True",
                  "False"
                ],
                c: 0
              },
              {
                q: "The Senate is the lower house",
                a: [
                  "False",
                  "True"
                ],
                c: 0
              },
              {
                q: "Pakistan's Constitution was adopted in 1973",
                a: [
                  "True",
                  "False"
                ],
                c: 0
              },
              {
                q: "The judiciary makes all elections happen",
                a: [
                  "False",
                  "True"
                ],
                c: 0
              },
              {
                q: "Majlis-e-Shoora is another name for Parliament",
                a: [
                  "True",
                  "False"
                ],
                c: 0
              },
              {
                q: "Citizens can vote before age 10",
                a: [
                  "False",
                  "True"
                ],
                c: 0
              }
            ]
          },
          {
            t: "Citizens' Rights & Responsibilities",
            c: "Every Pakistani citizen has rights and responsibilities. Good citizens make a strong nation.",
            examples: [
              "Citizens have rights such as education, security, justice, and freedom within the law.",
              "Citizens also have responsibilities such as obeying laws, respecting others, and helping the community.",
              "Voting is an important civic duty because it allows people to choose their representatives.",
              "Paying taxes helps the government provide roads, schools, hospitals, and other services.",
              "Good citizens protect public property and use national resources carefully.",
              "Respect for rules promotes peace, fairness, and safety in society.",
              "Citizens should show honesty, discipline, and cooperation in daily life.",
              "Helping others, keeping surroundings clean, and following traffic rules are practical civic responsibilities.",
              "Rights and responsibilities go together, because freedom works best when people act responsibly."
            ],
            exercises: [
              {
                q: "Fill in the blanks:",
                parts: [
                  "Free education in Pakistan generally covers which ages: ___",
                  "At what age can citizens vote in Pakistan: ___",
                  "Which of these is a basic right of citizens: ___",
                  "Which is an important civic responsibility: ___",
                  "Which duty helps keep society orderly: ___",
                  "Which value means people should be treated fairly: ___",
                  "What helps people live peacefully together: ___",
                  "Which child protection rule is important in Pakistan: ___",
                  "How should citizens take part in elections: ___",
                  "Which quality strengthens citizenship: ___"
                ],
                ans: [
                  "5 to 16 years",
                  "18 years",
                  "Freedom of speech",
                  "Pay taxes",
                  "Obey laws",
                  "Equality",
                  "Respect others",
                  "Child labour under 14 is illegal",
                  "Vote responsibly",
                  "Honesty"
                ]
              },
              {
                q: "True or False:",
                parts: [
                  "Citizens have both rights and responsibilities",
                  "Free education is an important right",
                  "Paying taxes is a responsibility",
                  "Respecting others helps society",
                  "Voting responsibly is part of good citizenship",
                  "Freedom of speech is a responsibility only",
                  "Children should be protected from unfair labour",
                  "Citizens should ignore laws",
                  "Equality is an important civic value",
                  "Honesty makes communities weaker"
                ],
                ans: [
                  "True",
                  "True",
                  "True",
                  "True",
                  "True",
                  "False",
                  "True",
                  "False",
                  "True",
                  "False"
                ]
              },
              {
                q: "Match the columns:",
                parts: [
                  "Free education in Pakistan generally covers which ages",
                  "At what age can citizens vote in Pakistan",
                  "Which of these is a basic right of citizens",
                  "Which is an important civic responsibility",
                  "Which duty helps keep society orderly",
                  "Which value means people should be treated fairly",
                  "What helps people live peacefully together",
                  "Which child protection rule is important in Pakistan",
                  "How should citizens take part in elections",
                  "Which quality strengthens citizenship"
                ],
                ans: [
                  "5 to 16 years",
                  "18 years",
                  "Freedom of speech",
                  "Pay taxes",
                  "Obey laws",
                  "Equality",
                  "Respect others",
                  "Child labour under 14 is illegal",
                  "Vote responsibly",
                  "Honesty"
                ]
              }
            ],
            quiz: [
              {
                q: "Free education in Pakistan generally covers which ages?",
                a: [
                  "5 to 16 years",
                  "18 years",
                  "Freedom of speech",
                  "Pay taxes"
                ],
                c: 0
              },
              {
                q: "At what age can citizens vote in Pakistan?",
                a: [
                  "Freedom of speech",
                  "18 years",
                  "Pay taxes",
                  "Obey laws"
                ],
                c: 1
              },
              {
                q: "Which of these is a basic right of citizens?",
                a: [
                  "Pay taxes",
                  "Obey laws",
                  "Freedom of speech",
                  "Equality"
                ],
                c: 2
              },
              {
                q: "Which is an important civic responsibility?",
                a: [
                  "Obey laws",
                  "Equality",
                  "Respect others",
                  "Pay taxes"
                ],
                c: 3
              },
              {
                q: "Which duty helps keep society orderly?",
                a: [
                  "Obey laws",
                  "Equality",
                  "Respect others",
                  "Child labour under 14 is illegal"
                ],
                c: 0
              },
              {
                q: "Which value means people should be treated fairly?",
                a: [
                  "Respect others",
                  "Equality",
                  "Child labour under 14 is illegal",
                  "Vote responsibly"
                ],
                c: 1
              },
              {
                q: "What helps people live peacefully together?",
                a: [
                  "Child labour under 14 is illegal",
                  "Vote responsibly",
                  "Respect others",
                  "Honesty"
                ],
                c: 2
              },
              {
                q: "Which child protection rule is important in Pakistan?",
                a: [
                  "Vote responsibly",
                  "Honesty",
                  "5 to 16 years",
                  "Child labour under 14 is illegal"
                ],
                c: 3
              },
              {
                q: "How should citizens take part in elections?",
                a: [
                  "Vote responsibly",
                  "Honesty",
                  "5 to 16 years",
                  "18 years"
                ],
                c: 0
              },
              {
                q: "Which quality strengthens citizenship?",
                a: [
                  "5 to 16 years",
                  "Honesty",
                  "18 years",
                  "Freedom of speech"
                ],
                c: 1
              },
              {
                q: "Citizens have both rights and responsibilities",
                a: [
                  "True",
                  "False"
                ],
                c: 0
              },
              {
                q: "Free education is an important right",
                a: [
                  "False",
                  "True"
                ],
                c: 1
              },
              {
                q: "Paying taxes is a responsibility",
                a: [
                  "True",
                  "False"
                ],
                c: 0
              },
              {
                q: "Respecting others helps society",
                a: [
                  "False",
                  "True"
                ],
                c: 1
              },
              {
                q: "Voting responsibly is part of good citizenship",
                a: [
                  "True",
                  "False"
                ],
                c: 0
              },
              {
                q: "Freedom of speech is a responsibility only",
                a: [
                  "False",
                  "True"
                ],
                c: 0
              },
              {
                q: "Children should be protected from unfair labour",
                a: [
                  "True",
                  "False"
                ],
                c: 0
              },
              {
                q: "Citizens should ignore laws",
                a: [
                  "False",
                  "True"
                ],
                c: 0
              },
              {
                q: "Equality is an important civic value",
                a: [
                  "True",
                  "False"
                ],
                c: 0
              },
              {
                q: "Honesty makes communities weaker",
                a: [
                  "False",
                  "True"
                ],
                c: 0
              }
            ]
          },
          {
            t: "Presidential System",
            svgType: "presidentialSystem",
            c: "In a presidential system, the President usually leads the executive branch and serves for a fixed term. The legislature makes laws, the judiciary interprets laws, and the constitution sets limits so no branch becomes too powerful.",
            examples: [
              "In a presidential system, the President is both the head of state and the head of government.",
              "The President is usually elected separately from the legislature and has fixed powers for a set term.",
              "Ministers or secretaries work under the President and help run different departments.",
              "The legislature makes laws, but the President leads the executive branch directly.",
              "This system is designed so the executive and legislature remain separate institutions.",
              "Checks and balances are important because they limit power and protect democracy.",
              "The President may propose policies, sign laws, and oversee national administration.",
              "Voters often choose a leader directly or through an electoral process for the presidency.",
              "Countries that use a presidential system may show clear executive leadership and fixed terms."
            ],
            exercises: [
              {
                q: "Fill in the blanks:",
                parts: [
                  "Who is the main executive leader in a presidential system: ___",
                  "What is the main job of the executive branch: ___",
                  "Which branch makes laws in a presidential system: ___",
                  "Which branch interprets laws: ___",
                  "What group helps the President run ministries: ___",
                  "What kind of term does a President usually have: ___",
                  "What principle keeps branches separate: ___",
                  "How do citizens mainly choose leaders: ___",
                  "What document limits state power: ___",
                  "What prevents one branch from becoming too strong: ___"
                ],
                ans: [
                  "President",
                  "Runs government",
                  "Legislature",
                  "Judiciary",
                  "Cabinet",
                  "Fixed term",
                  "Separation of powers",
                  "Voting",
                  "Constitution",
                  "Checks and balances"
                ]
              },
              {
                q: "True or False:",
                parts: [
                  "A presidential system separates powers among branches",
                  "The President is usually part of the executive branch",
                  "The legislature makes laws",
                  "The judiciary interprets laws",
                  "A constitution can limit presidential power",
                  "The judiciary runs all ministries",
                  "Checks and balances help stop abuse of power",
                  "Citizens do not vote in a presidential system",
                  "Cabinet members help the executive branch",
                  "A fixed term means the office ends according to rules"
                ],
                ans: [
                  "True",
                  "True",
                  "True",
                  "True",
                  "True",
                  "False",
                  "True",
                  "False",
                  "True",
                  "True"
                ]
              },
              {
                q: "Match the columns:",
                parts: [
                  "Who is the main executive leader in a presidential system",
                  "What is the main job of the executive branch",
                  "Which branch makes laws in a presidential system",
                  "Which branch interprets laws",
                  "What group helps the President run ministries",
                  "What kind of term does a President usually have",
                  "What principle keeps branches separate",
                  "How do citizens mainly choose leaders",
                  "What document limits state power",
                  "What prevents one branch from becoming too strong"
                ],
                ans: [
                  "President",
                  "Runs government",
                  "Legislature",
                  "Judiciary",
                  "Cabinet",
                  "Fixed term",
                  "Separation of powers",
                  "Voting",
                  "Constitution",
                  "Checks and balances"
                ]
              }
            ],
            quiz: [
              {
                q: "Who is the main executive leader in a presidential system?",
                a: [
                  "President",
                  "Runs government",
                  "Legislature",
                  "Judiciary"
                ],
                c: 0
              },
              {
                q: "What is the main job of the executive branch?",
                a: [
                  "Legislature",
                  "Runs government",
                  "Judiciary",
                  "Cabinet"
                ],
                c: 1
              },
              {
                q: "Which branch makes laws in a presidential system?",
                a: [
                  "Judiciary",
                  "Cabinet",
                  "Legislature",
                  "Fixed term"
                ],
                c: 2
              },
              {
                q: "Which branch interprets laws?",
                a: [
                  "Cabinet",
                  "Fixed term",
                  "Separation of powers",
                  "Judiciary"
                ],
                c: 3
              },
              {
                q: "What group helps the President run ministries?",
                a: [
                  "Cabinet",
                  "Fixed term",
                  "Separation of powers",
                  "Voting"
                ],
                c: 0
              },
              {
                q: "What kind of term does a President usually have?",
                a: [
                  "Separation of powers",
                  "Fixed term",
                  "Voting",
                  "Constitution"
                ],
                c: 1
              },
              {
                q: "What principle keeps branches separate?",
                a: [
                  "Voting",
                  "Constitution",
                  "Separation of powers",
                  "Checks and balances"
                ],
                c: 2
              },
              {
                q: "How do citizens mainly choose leaders?",
                a: [
                  "Constitution",
                  "Checks and balances",
                  "President",
                  "Voting"
                ],
                c: 3
              },
              {
                q: "What document limits state power?",
                a: [
                  "Constitution",
                  "Checks and balances",
                  "President",
                  "Runs government"
                ],
                c: 0
              },
              {
                q: "What prevents one branch from becoming too strong?",
                a: [
                  "President",
                  "Checks and balances",
                  "Runs government",
                  "Legislature"
                ],
                c: 1
              },
              {
                q: "A presidential system separates powers among branches",
                a: [
                  "True",
                  "False"
                ],
                c: 0
              },
              {
                q: "The President is usually part of the executive branch",
                a: [
                  "False",
                  "True"
                ],
                c: 1
              },
              {
                q: "The legislature makes laws",
                a: [
                  "True",
                  "False"
                ],
                c: 0
              },
              {
                q: "The judiciary interprets laws",
                a: [
                  "False",
                  "True"
                ],
                c: 1
              },
              {
                q: "A constitution can limit presidential power",
                a: [
                  "True",
                  "False"
                ],
                c: 0
              },
              {
                q: "The judiciary runs all ministries",
                a: [
                  "False",
                  "True"
                ],
                c: 0
              },
              {
                q: "Checks and balances help stop abuse of power",
                a: [
                  "True",
                  "False"
                ],
                c: 0
              },
              {
                q: "Citizens do not vote in a presidential system",
                a: [
                  "False",
                  "True"
                ],
                c: 0
              },
              {
                q: "Cabinet members help the executive branch",
                a: [
                  "True",
                  "False"
                ],
                c: 0
              },
              {
                q: "A fixed term means the office ends according to rules",
                a: [
                  "False",
                  "True"
                ],
                c: 1
              }
            ]
          },
          {
            t: "Federal Parliamentry System",
            svgType: "federalParliamentry",
            c: "Pakistan follows a federal parliamentry system under the 1973 Constitution. Citizens elect representatives, Parliament forms the government, the Prime Minister leads the executive government, and provinces share power through a federal structure.",
            examples: [
              "Pakistan follows a federal parliamentry system in which powers are shared between the federation and the provinces.",
              "In a parliamentary system, the Prime Minister leads the government and is chosen through Parliament.",
              "The President remains the head of state, but most executive authority is exercised through the Prime Minister and cabinet.",
              "Parliament includes elected representatives who debate issues, make laws, and oversee the government.",
              "The cabinet is responsible to Parliament and must keep the confidence of the majority.",
              "Provinces have their own assemblies and chief ministers to handle provincial matters.",
              "Federal systems allow national unity while also recognizing regional needs and local administration.",
              "Coalition building, debate, and majority support are important features of parliamentary government.",
              "This system is different from a presidential system because executive leadership comes from the legislature."
            ],
            exercises: [
              {
                q: "Fill in the blanks:",
                parts: [
                  "What system does Pakistan use at the federal level: ___",
                  "Who is Pakistan's head of government: ___",
                  "Who is Pakistan's head of state: ___",
                  "What is the lower house of Parliament called: ___",
                  "What is the upper house of Parliament called: ___",
                  "What usually forms the government after elections: ___",
                  "What does the word 'federal' mean in this system: ___",
                  "What bodies make laws on many provincial matters: ___",
                  "What is the main role of citizens in elections: ___",
                  "Which constitution explains Pakistan's current federal system: ___"
                ],
                ans: [
                  "Federal parliamentary system",
                  "Prime Minister",
                  "President",
                  "National Assembly",
                  "Senate",
                  "Parliamentary majority",
                  "Shared power with provinces",
                  "Provincial assemblies",
                  "Elect representatives",
                  "1973 Constitution"
                ]
              },
              {
                q: "True or False:",
                parts: [
                  "Pakistan has a federal parliamentary system",
                  "The Prime Minister is the head of government",
                  "The Senate represents the provinces",
                  "The National Assembly represents the people by population",
                  "Provincial assemblies handle many provincial issues",
                  "Citizens play no role in elections",
                  "Government usually depends on majority support in parliament",
                  "Pakistan has no constitution",
                  "The President is the head of state",
                  "Federal means power is shared between center and provinces"
                ],
                ans: [
                  "True",
                  "True",
                  "True",
                  "True",
                  "True",
                  "False",
                  "True",
                  "False",
                  "True",
                  "True"
                ]
              },
              {
                q: "Match the columns:",
                parts: [
                  "What system does Pakistan use at the federal level",
                  "Who is Pakistan's head of government",
                  "Who is Pakistan's head of state",
                  "What is the lower house of Parliament called",
                  "What is the upper house of Parliament called",
                  "What usually forms the government after elections",
                  "What does the word 'federal' mean in this system",
                  "What bodies make laws on many provincial matters",
                  "What is the main role of citizens in elections",
                  "Which constitution explains Pakistan's current federal system"
                ],
                ans: [
                  "Federal parliamentary system",
                  "Prime Minister",
                  "President",
                  "National Assembly",
                  "Senate",
                  "Parliamentary majority",
                  "Shared power with provinces",
                  "Provincial assemblies",
                  "Elect representatives",
                  "1973 Constitution"
                ]
              }
            ],
            quiz: [
              {
                q: "What system does Pakistan use at the federal level?",
                a: [
                  "Federal parliamentary system",
                  "Prime Minister",
                  "President",
                  "National Assembly"
                ],
                c: 0
              },
              {
                q: "Who is Pakistan's head of government?",
                a: [
                  "President",
                  "Prime Minister",
                  "National Assembly",
                  "Senate"
                ],
                c: 1
              },
              {
                q: "Who is Pakistan's head of state?",
                a: [
                  "National Assembly",
                  "Senate",
                  "President",
                  "Parliamentary majority"
                ],
                c: 2
              },
              {
                q: "What is the lower house of Parliament called?",
                a: [
                  "Senate",
                  "Parliamentary majority",
                  "Shared power with provinces",
                  "National Assembly"
                ],
                c: 3
              },
              {
                q: "What is the upper house of Parliament called?",
                a: [
                  "Senate",
                  "Parliamentary majority",
                  "Shared power with provinces",
                  "Provincial assemblies"
                ],
                c: 0
              },
              {
                q: "What usually forms the government after elections?",
                a: [
                  "Shared power with provinces",
                  "Parliamentary majority",
                  "Provincial assemblies",
                  "Elect representatives"
                ],
                c: 1
              },
              {
                q: "What does the word 'federal' mean in this system?",
                a: [
                  "Provincial assemblies",
                  "Elect representatives",
                  "Shared power with provinces",
                  "1973 Constitution"
                ],
                c: 2
              },
              {
                q: "What bodies make laws on many provincial matters?",
                a: [
                  "Elect representatives",
                  "1973 Constitution",
                  "Federal parliamentary system",
                  "Provincial assemblies"
                ],
                c: 3
              },
              {
                q: "What is the main role of citizens in elections?",
                a: [
                  "Elect representatives",
                  "1973 Constitution",
                  "Federal parliamentary system",
                  "Prime Minister"
                ],
                c: 0
              },
              {
                q: "Which constitution explains Pakistan's current federal system?",
                a: [
                  "Federal parliamentary system",
                  "1973 Constitution",
                  "Prime Minister",
                  "President"
                ],
                c: 1
              },
              {
                q: "Pakistan has a federal parliamentary system",
                a: [
                  "True",
                  "False"
                ],
                c: 0
              },
              {
                q: "The Prime Minister is the head of government",
                a: [
                  "False",
                  "True"
                ],
                c: 1
              },
              {
                q: "The Senate represents the provinces",
                a: [
                  "True",
                  "False"
                ],
                c: 0
              },
              {
                q: "The National Assembly represents the people by population",
                a: [
                  "False",
                  "True"
                ],
                c: 1
              },
              {
                q: "Provincial assemblies handle many provincial issues",
                a: [
                  "True",
                  "False"
                ],
                c: 0
              },
              {
                q: "Citizens play no role in elections",
                a: [
                  "False",
                  "True"
                ],
                c: 0
              },
              {
                q: "Government usually depends on majority support in parliament",
                a: [
                  "True",
                  "False"
                ],
                c: 0
              },
              {
                q: "Pakistan has no constitution",
                a: [
                  "False",
                  "True"
                ],
                c: 0
              },
              {
                q: "The President is the head of state",
                a: [
                  "True",
                  "False"
                ],
                c: 0
              },
              {
                q: "Federal means power is shared between center and provinces",
                a: [
                  "False",
                  "True"
                ],
                c: 1
              }
            ]
          }
        ]
      },
      {
        title: "Pakistan's Economy, Agriculture & Culture",
        content: "Pakistan's economy depends on agriculture, industry, and trade. Its rich culture includes literature, folk music, crafts, and festivals.",
        key: "economy5",
        hasMathSub: true,
        subs: [
          {
            t: "Agriculture & Natural Resources",
            c: "About 42% of Pakistanis work in agriculture. Main crops: wheat, cotton, rice, sugarcane. Pakistan has coal, natural gas, copper, gold, and salt mines.",
            examples: [
              "Agriculture is a major part of Pakistan's economy and provides food, raw materials, and employment.",
              "Important crops include wheat, rice, cotton, sugarcane, and maize.",
              "Irrigation from rivers and canals is essential because many farming areas do not receive enough rainfall.",
              "Livestock, fisheries, and orchards also support rural livelihoods and national income.",
              "Pakistan has natural resources such as natural gas, coal, salt, copper, and other minerals.",
              "Forests, water, land, and minerals must be used carefully so they are not wasted or damaged.",
              "Industry depends on agricultural and natural resources for textiles, food processing, and manufacturing.",
              "Farmers work differently in different regions because climate, water, and soil vary across the country.",
              "Conservation and wise use of resources are important for future generations."
            ],
            exercises: [
              {
                q: "Fill in the blanks:",
                parts: [
                  "What is Pakistan's main food crop: ___",
                  "What is cotton often called: ___",
                  "Which crop is a common Kharif crop: ___",
                  "Which crop is a common Rabi crop: ___",
                  "Which place is famous for a major salt mine: ___",
                  "Which underground fuel is a major natural resource: ___",
                  "Which black mineral is used for energy: ___",
                  "Which crop supports the textile industry: ___",
                  "Which sector gives jobs to many Pakistanis: ___",
                  "Which metal resource is found in Pakistan: ___"
                ],
                ans: [
                  "Wheat",
                  "White gold",
                  "Rice",
                  "Wheat",
                  "Khewra",
                  "Natural gas",
                  "Coal",
                  "Cotton",
                  "Agriculture",
                  "Copper"
                ]
              },
              {
                q: "True or False:",
                parts: [
                  "Agriculture is important for Pakistan's economy",
                  "Wheat is a major crop",
                  "Cotton is known as white gold",
                  "Pakistan has natural gas resources",
                  "Khewra is famous for salt",
                  "Cotton is called black gold",
                  "Coal is a natural resource",
                  "Rice is grown in Pakistan",
                  "Agriculture gives jobs to many people",
                  "Pakistan has no mineral resources"
                ],
                ans: [
                  "True",
                  "True",
                  "True",
                  "True",
                  "True",
                  "False",
                  "True",
                  "True",
                  "True",
                  "False"
                ]
              },
              {
                q: "Match the columns:",
                parts: [
                  "What is Pakistan's main food crop",
                  "What is cotton often called",
                  "Which crop is a common Kharif crop",
                  "Which crop is a common Rabi crop",
                  "Which place is famous for a major salt mine",
                  "Which underground fuel is a major natural resource",
                  "Which black mineral is used for energy",
                  "Which crop supports the textile industry",
                  "Which sector gives jobs to many Pakistanis",
                  "Which metal resource is found in Pakistan"
                ],
                ans: [
                  "Wheat",
                  "White gold",
                  "Rice",
                  "Wheat",
                  "Khewra",
                  "Natural gas",
                  "Coal",
                  "Cotton",
                  "Agriculture",
                  "Copper"
                ]
              }
            ],
            wordProblems: [
              {
                q: "What percentage of Pakistan's workforce works in agriculture?",
                a: "About 42% of Pakistan's total workforce"
              },
              {
                q: "Name the four major crops grown in Pakistan.",
                a: "1. Wheat 2. Rice (basmati) 3. Cotton4. Sugarcane"
              },
              {
                q: "Why is cotton called 'white gold' in Pakistan?",
                a: "Cotton is Pakistan's most important export crop; it earns billions of dollars in foreign exchange through textile and clothing exports"
              },
              {
                q: "Which province produces the most wheat and rice in Pakistan?",
                a: "Punjab (the 'breadbasket of Pakistan')"
              },
              {
                q: "What is the difference between Kharif and Rabi crops?",
                a: "Kharif = summer crops sownin June–July, harvested Oct–Nov (rice, cotton, maize); Rabi = winter crops sown Oct–Nov, harvested April (wheat, mustard)"
              },
              {
                q: "Name two important minerals found in Pakistan.",
                a: "1. Coal (Thar Desert, Sindh) 2. Natural gas (Sui, Balochistan) 3. Copper & gold (Reko Diq, Balochistan) 4. Rock salt (Khewra, Punjab)"
              },
              {
                q: "Where are Pakistan's famous salt mines located?",
                a: "Khewra Salt Mine in Punjab — theworld's second largest salt mine, a popular tourist attraction"
              },
              {
                q: "Which natural resource is Balochistan most rich in?",
                a: "Natural gas (Sui gas fields)and also coal, copper, gold (Reko Diq)"
              },
              {
                q: "How does the Indus River system help Pakistan's agriculture?",
                a: "It provides water for irrigation through canals and dams, allowing millions of hectares of farming in otherwise dry land"
              },
              {
                q: "Name two dams that provide hydroelectric power in Pakistan.",
                a: "1. Tarbela Dam (Indus, KPK) 2. Mangla Dam (Jhelum, AJK)"
              },
              {
                q: "What is the significance of Pakistan's fishing industry?",
                a: "Provides livelihood to coastal communities in Sindh and Balochistan; Karachi is a major fishing port; fish is exported internationally"
              },
              {
                q: "Which region has large natural gas reserves?",
                a: "Balochistan (Sui gas field) and Sindh — natural gas heats homes and fuels industry across Pakistan"
              },
              {
                q: "Name three fruits Pakistan is famous for exporting.",
                a: "1. Mangoes (Chaunsa, Anwar Ratol) 2. Kinnow oranges 3. Dates (from Sindh and Balochistan)"
              },
              {
                q: "What is the Thar Desert rich in, and why is it important?",
                a: "Coal — the Thar Coal Field in Sindh has one of the world's 6th largest coal deposits; it can fuel Pakistan's electricity forcenturies"
              },
              {
                q: "Name three animals raised on farms in Pakistan.",
                a: "1. Cattle (for milk and meat) 2.Buffalo (for milk — Pakistan is 4th largest milk producer) 3. Goats 4. Sheep 5. Poultry"
              },
              {
                q: "Why is deforestation a problem for Pakistan?",
                a: "Less forest means more floods, soilerosion, reduced rainfall, loss of wildlife, and climate change — Pakistan has less than 5% forest cover"
              },
              {
                q: "How does tourism contribute to Pakistan's economy?",
                a: "Foreign tourists bring income;Pakistan has world-class mountains (K2, Nanga Parbat), ancient ruins (Mohenjo-daro), and beautiful valleys"
              },
              {
                q: "Name one challenge facing Pakistani farmers and suggest a solution.",
                a: "Challenge: Water shortage / Solution: Build more dams, use drip irrigation, conserve water, improve canal systems"
              },
              {
                q: "What is Pakistan's most important export industry?",
                a: "Textile industry — Pakistan exports clothes, bed linen, yarn and towels worth billions of dollars annually"
              },
              {
                q: "Name two types of industries in Pakistan besides agriculture.",
                a: "1. Textile industry(largest) 2. Cement industry 3. Sugar industry 4. Chemical industry 5. Food processing"
              }
            ],
            quiz: [
              {
                q: "What is Pakistan's main food crop?",
                a: [
                  "Wheat",
                  "White gold",
                  "Rice",
                  "Khewra"
                ],
                c: 0
              },
              {
                q: "What is cotton often called?",
                a: [
                  "Rice",
                  "White gold",
                  "Wheat",
                  "Khewra"
                ],
                c: 1
              },
              {
                q: "Which crop is a common Kharif crop?",
                a: [
                  "Wheat",
                  "Khewra",
                  "Rice",
                  "Natural gas"
                ],
                c: 2
              },
              {
                q: "Which crop is a common Rabi crop?",
                a: [
                  "Khewra",
                  "Natural gas",
                  "Coal",
                  "Wheat"
                ],
                c: 3
              },
              {
                q: "Which place is famous for a major salt mine?",
                a: [
                  "Khewra",
                  "Natural gas",
                  "Coal",
                  "Cotton"
                ],
                c: 0
              },
              {
                q: "Which underground fuel is a major natural resource?",
                a: [
                  "Coal",
                  "Natural gas",
                  "Cotton",
                  "Agriculture"
                ],
                c: 1
              },
              {
                q: "Which black mineral is used for energy?",
                a: [
                  "Cotton",
                  "Agriculture",
                  "Coal",
                  "Copper"
                ],
                c: 2
              },
              {
                q: "Which crop supports the textile industry?",
                a: [
                  "Agriculture",
                  "Copper",
                  "Wheat",
                  "Cotton"
                ],
                c: 3
              },
              {
                q: "Which sector gives jobs to many Pakistanis?",
                a: [
                  "Agriculture",
                  "Copper",
                  "Wheat",
                  "White gold"
                ],
                c: 0
              },
              {
                q: "Which metal resource is found in Pakistan?",
                a: [
                  "Wheat",
                  "Copper",
                  "White gold",
                  "Rice"
                ],
                c: 1
              },
              {
                q: "Agriculture is important for Pakistan's economy",
                a: [
                  "True",
                  "False"
                ],
                c: 0
              },
              {
                q: "Wheat is a major crop",
                a: [
                  "False",
                  "True"
                ],
                c: 1
              },
              {
                q: "Cotton is known as white gold",
                a: [
                  "True",
                  "False"
                ],
                c: 0
              },
              {
                q: "Pakistan has natural gas resources",
                a: [
                  "False",
                  "True"
                ],
                c: 1
              },
              {
                q: "Khewra is famous for salt",
                a: [
                  "True",
                  "False"
                ],
                c: 0
              },
              {
                q: "Cotton is called black gold",
                a: [
                  "False",
                  "True"
                ],
                c: 0
              },
              {
                q: "Coal is a natural resource",
                a: [
                  "True",
                  "False"
                ],
                c: 0
              },
              {
                q: "Rice is grown in Pakistan",
                a: [
                  "False",
                  "True"
                ],
                c: 1
              },
              {
                q: "Agriculture gives jobs to many people",
                a: [
                  "True",
                  "False"
                ],
                c: 0
              },
              {
                q: "Pakistan has no mineral resources",
                a: [
                  "False",
                  "True"
                ],
                c: 0
              }
            ]
          },
          {
            t: "Pakistan's Culture, Festivals & Arts",
            c: "Pakistan has rich cultural diversity. Festivals include Eid ul-Fitr, Eid ul-Adha, and Basant. Traditional arts include truck art, ajrak, blue pottery, and qawwali music.",
            examples: [
              "Pakistan has a rich culture shaped by history, religion, languages, regions, and local traditions.",
              "People in different provinces wear different clothes, speak different languages, and enjoy different foods and customs.",
              "Eid festivals are celebrated with prayers, charity, family gatherings, and special meals.",
              "Folk music, regional dances, embroidery, pottery, truck art, and handicrafts are important cultural expressions.",
              "Literature and poetry, including Urdu and regional traditions, play an important role in cultural identity.",
              "Hospitality, respect for elders, and family values are strong parts of Pakistani society.",
              "Crafts and arts reflect the creativity of people from villages, towns, and cities across the country.",
              "Cultural festivals and national days bring people together and strengthen unity.",
              "Protecting culture means valuing heritage sites, languages, arts, and traditions."
            ],
            exercises: [
              {
                q: "Fill in the blanks:",
                parts: [
                  "What is Pakistan's national language: ___",
                  "What is the traditional national dress: ___",
                  "Which devotional music style is famous in Pakistan: ___",
                  "What traditional patterned cloth is linked with Sindh: ___",
                  "What colorful painted vehicle style is famous in Pakistan: ___",
                  "Which festival comes after Ramadan: ___",
                  "Which festival is linked with sacrifice: ___",
                  "Which spring festival is popularly known in Pakistan: ___",
                  "What makes Pakistan's culture rich and varied: ___",
                  "Which two broad art forms are important in Pakistan: ___"
                ],
                ans: [
                  "Urdu",
                  "Shalwar kameez",
                  "Qawwali",
                  "Ajrak",
                  "Truck art",
                  "Eid ul-Fitr",
                  "Eid ul-Adha",
                  "Basant",
                  "Regional diversity",
                  "Crafts and music"
                ]
              },
              {
                q: "True or False:",
                parts: [
                  "Pakistan has many regional cultures",
                  "Qawwali is part of Pakistan's musical heritage",
                  "Ajrak is linked with Sindhi culture",
                  "Truck art is a famous folk art form",
                  "Basant is known as a spring festival",
                  "Pakistan has no traditional crafts",
                  "Shalwar kameez is a common traditional dress",
                  "Eid ul-Fitr comes after Ramadan",
                  "Cultural diversity is part of Pakistan's identity",
                  "Truck art is a type of river"
                ],
                ans: [
                  "True",
                  "True",
                  "True",
                  "True",
                  "True",
                  "False",
                  "True",
                  "True",
                  "True",
                  "False"
                ]
              },
              {
                q: "Match the columns:",
                parts: [
                  "What is Pakistan's national language",
                  "What is the traditional national dress",
                  "Which devotional music style is famous in Pakistan",
                  "What traditional patterned cloth is linked with Sindh",
                  "What colorful painted vehicle style is famous in Pakistan",
                  "Which festival comes after Ramadan",
                  "Which festival is linked with sacrifice",
                  "Which spring festival is popularly known in Pakistan",
                  "What makes Pakistan's culture rich and varied",
                  "Which two broad art forms are important in Pakistan"
                ],
                ans: [
                  "Urdu",
                  "Shalwar kameez",
                  "Qawwali",
                  "Ajrak",
                  "Truck art",
                  "Eid ul-Fitr",
                  "Eid ul-Adha",
                  "Basant",
                  "Regional diversity",
                  "Crafts and music"
                ]
              }
            ],
            wordProblems: [
              {
                q: "Name four languages spoken in Pakistan.",
                a: "1. Urdu (national) 2. Punjabi 3. Sindhi 4. Pashto 5. Balochi (also English as official language)"
              },
              {
                q: "What is the national and official language of Pakistan?",
                a: "Urdu is the national language; English is also used as an official language"
              },
              {
                q: "Name the two main Eid festivals celebrated in Pakistan.",
                a: "1. Eid ul-Fitr — marks end of Ramadan fasting 2. Eid ul-Adha — Festival of Sacrifice (Qurbani)"
              },
              {
                q: "What traditional dress is commonly worn in Pakistan?",
                a: "Shalwar kameez — for both men and women; often with a dupatta (scarf) for women"
              },
              {
                q: "Name a famous folk dance from Punjab.",
                a: "Bhangra (also Luddi, Jhumar, Sammi) — energetic dances performed at celebrations"
              },
              {
                q: "Name a traditional craft that Pakistan is known for internationally.",
                a: "1. Truck art(vibrant painted trucks) 2. Sindhi ajrak (block-printed fabric) 3. Multan blue pottery"
              },
              {
                q: "What is 'qawwali' and who is Pakistan's most famous qawwali singer?",
                a: "Qawwali is devotional Sufi music praising God and saints; Nusrat Fateh Ali Khan is world-famous"
              },
              {
                q: "Name two famous Urdu poets of Pakistan.",
                a: "1. Faiz Ahmed Faiz 2. Ahmad Faraz 3. Parveen Shakir (also Allama Iqbal, Mir Taqi Mir in classical)"
              },
              {
                q: "What is the significance of food in Pakistani culture?",
                a: "Food is central to hospitality; sharing meals with family and guests is a sacred tradition; refusing food can be seen as impolite"
              },
              {
                q: "Name three traditional Pakistani foods.",
                a: "1. Biryani 2. Nihari 3. Halwa puri (alsokarahi, samosas, lassi, kebabs)"
              },
              {
                q: "What is 'truck art' and what makes it unique to Pakistan?",
                a: "Vibrant, colourful paintings on trucks and buses — a distinctly Pakistani art form using bold patterns, mirrors, and calligraphy"
              },
              {
                q: "Name the famous spring kite festival held in Lahore.",
                a: "Basant — a kite-flying festival celebrating the arrival of spring (now restricted but still culturally celebrated)"
              },
              {
                q: "How is Eid ul-Fitr celebrated in Pakistan?",
                a: "Special prayers at mosque, new clothes, Zakat (charity), visiting relatives, giving Eidi (gifts/money), eating sweets and festive food"
              },
              {
                q: "What is 'mehndi' (henna) and when is it applied?",
                a: "Henna is a natural dye applied in decorative patterns on hands and feet — traditionally at weddings, Eid, and celebrations"
              },
              {
                q: "Name two UNESCO World Heritage Sites in Pakistan.",
                a: "1. Lahore Fort and Shalimar Gardens 2. Mohenjo-daro (Sindh) 3. Rohtas Fort (Punjab) 4. Taxila (Punjab)"
              },
              {
                q: "What traditional music instruments are used in Pakistani music?",
                a: "Tabla (drums), dhol (large drum), sitar, harmonium, flute, rubab (string instrument)"
              },
              {
                q: "What is 'Sufi music' and which region is it associated with?",
                a: "Devotional songs (qawwali, kalam) praising God, saints, and spiritual love; associated with shrines in Punjab and Sindh"
              },
              {
                q: "Name a famous Punjabi folk story (qissa) still loved in Pakistan.",
                a: "Heer Ranjha (byWaris Shah) — the most beloved Punjabi love story; also Sohni Mahiwal, Mirza Sahiban"
              },
              {
                q: "What is the role of elders in Pakistani family culture?",
                a: "Elders are deeply respected; their advice is sought on important matters; they head family decisions; children are expected tocare for elderly parents"
              },
              {
                q: "Name two sports that are popular in Pakistan besides cricket.",
                a: "1. Kabaddi (traditional contact sport) 2. Squash (Pakistan has produced world champions) 3. Polo 4. Field hockey 5. Wrestling (pehlwani)"
              }
            ],
            quiz: [
              {
                q: "What is Pakistan's national language?",
                a: [
                  "Urdu",
                  "Shalwar kameez",
                  "Qawwali",
                  "Ajrak"
                ],
                c: 0
              },
              {
                q: "What is the traditional national dress?",
                a: [
                  "Qawwali",
                  "Shalwar kameez",
                  "Ajrak",
                  "Truck art"
                ],
                c: 1
              },
              {
                q: "Which devotional music style is famous in Pakistan?",
                a: [
                  "Ajrak",
                  "Truck art",
                  "Qawwali",
                  "Eid ul-Fitr"
                ],
                c: 2
              },
              {
                q: "What traditional patterned cloth is linked with Sindh?",
                a: [
                  "Truck art",
                  "Eid ul-Fitr",
                  "Eid ul-Adha",
                  "Ajrak"
                ],
                c: 3
              },
              {
                q: "What colorful painted vehicle style is famous in Pakistan?",
                a: [
                  "Truck art",
                  "Eid ul-Fitr",
                  "Eid ul-Adha",
                  "Basant"
                ],
                c: 0
              },
              {
                q: "Which festival comes after Ramadan?",
                a: [
                  "Eid ul-Adha",
                  "Eid ul-Fitr",
                  "Basant",
                  "Regional diversity"
                ],
                c: 1
              },
              {
                q: "Which festival is linked with sacrifice?",
                a: [
                  "Basant",
                  "Regional diversity",
                  "Eid ul-Adha",
                  "Crafts and music"
                ],
                c: 2
              },
              {
                q: "Which spring festival is popularly known in Pakistan?",
                a: [
                  "Regional diversity",
                  "Crafts and music",
                  "Urdu",
                  "Basant"
                ],
                c: 3
              },
              {
                q: "What makes Pakistan's culture rich and varied?",
                a: [
                  "Regional diversity",
                  "Crafts and music",
                  "Urdu",
                  "Shalwar kameez"
                ],
                c: 0
              },
              {
                q: "Which two broad art forms are important in Pakistan?",
                a: [
                  "Urdu",
                  "Crafts and music",
                  "Shalwar kameez",
                  "Qawwali"
                ],
                c: 1
              },
              {
                q: "Pakistan has many regional cultures",
                a: [
                  "True",
                  "False"
                ],
                c: 0
              },
              {
                q: "Qawwali is part of Pakistan's musical heritage",
                a: [
                  "False",
                  "True"
                ],
                c: 1
              },
              {
                q: "Ajrak is linked with Sindhi culture",
                a: [
                  "True",
                  "False"
                ],
                c: 0
              },
              {
                q: "Truck art is a famous folk art form",
                a: [
                  "False",
                  "True"
                ],
                c: 1
              },
              {
                q: "Basant is known as a spring festival",
                a: [
                  "True",
                  "False"
                ],
                c: 0
              },
              {
                q: "Pakistan has no traditional crafts",
                a: [
                  "False",
                  "True"
                ],
                c: 0
              },
              {
                q: "Shalwar kameez is a common traditional dress",
                a: [
                  "True",
                  "False"
                ],
                c: 0
              },
              {
                q: "Eid ul-Fitr comes after Ramadan",
                a: [
                  "False",
                  "True"
                ],
                c: 1
              },
              {
                q: "Cultural diversity is part of Pakistan's identity",
                a: [
                  "True",
                  "False"
                ],
                c: 0
              },
              {
                q: "Truck art is a type of river",
                a: [
                  "False",
                  "True"
                ],
                c: 0
              }
            ]
          }
        ]
      }
    ] : g <= 6 ? [
      { title: "History", content: (g === 4 ? "Indus Valley, Mesopotamia" : "Mughal Empire, British rule") + ".", key: "history" },
      { title: "Geography", content: (g === 4 ? "Continents and oceans" : "Resources and trade") + ".", key: "geography" },
      { title: "Civics", content: (g === 4 ? "Why government?" : "Democracy and elections") + ".", key: "civics" },
    ] : [
      { title: "World History", content: (g === 7 ? "Renaissance" : g === 8 ? "Industrial Revolution" : g === 9 ? "World Wars" : "Cold War, modern geopolitics") + ".", key: "world_hist" },
      { title: "Pakistan Studies", content: (g === 7 ? "Pakistan Movement" : g === 8 ? "Constitutional history" : g === 9 ? "Foreign policy" : "Economic development") + ".", key: "pak_studies" },
      { title: "Current Affairs", content: (g === 7 ? "United Nations" : g === 8 ? "Human rights" : g === 9 ? "Globalization" : "Sustainable development") + ".", key: "current" },
    ],
    urdu: g <= 3 ? [
      { title: "حروف تہجی", content: "اردو حروف تہجی سیکھیں۔ حروف کی پہچان اور آوازیں۔", key: "huroof" },
      { title: "پڑھنا", content: "سادہ الفاظ اور جملے پڑھنا۔ پڑھنے کی عادت بنائیں۔", key: "reading_ur" },
      { title: "لکھنا", content: "حروف لکھنے کی مشق۔ خوشخطی سیکھیں۔", key: "writing_ur" },
    ] : g === 5 ? [
      { title: "قواعد — اقسام کلام", content: "اسم، فعل، حرف، صفت، ضمیر اور متعلقات کی پہچان اور استعمال۔", key: "qawaid5", hasMathSub: true, subs: [
        {t:"اسم اور اس کی اقسام", c:"اسم وہ لفظ ہے جو کسی شخص، جگہ، چیز یا خیال کا نام ہو۔ اقسام: اسم معرفہ، اسم نکرہ، اسم جمع، اسم صفت۔ مذکر اور مؤنث بنانا بھی ضروری ہے۔",
         examples:["اسم معرفہ: پاکستان، لاہور، قائداعظم، قرآن، دریائے سندھ، مسجد بادشاہی","اسم نکرہ: لڑکا، کتاب، شہر، دریا، پھول، پرندہ، درخت، پہاڑ","اسم جمع: فوج، قوم، جماعت، ٹولی، مجلس، قافلہ","واحد ← جمع: لڑکا←لڑکے، کتاب←کتابیں، درخت←درخت، ستارہ←ستارے، خط←خطوط، عالم←علماء","مذکر: لڑکا، استاد، شیر، گھوڑا، بادشاہ، مرغ، بھائی، چچا","مؤنث: لڑکی، استانی، شیرنی، گھوڑی، ملکہ، مرغی، بہن، چچی","اسم ذات: علی، سارا — اسم صفت: خوبصورت، لمبا — اسم کیفیت: خوشی، غم"],
         exercises:[{q:"اسم معرفہ یا نکرہ بتائیں:", parts:["لاہور","شہر","علامہ اقبال","شاعر","قرآن","کتاب","دریائے سندھ","دریا","مسجد بادشاہی","مسجد"], ans:["معرفہ","نکرہ","معرفہ","نکرہ","معرفہ","نکرہ","معرفہ","نکرہ","معرفہ","نکرہ"]},{q:"واحد سے جمع بنائیں:", parts:["لڑکا","کتاب","پھول","ستارہ","بچہ","خط","عالم","مسئلہ","صفحہ","نظم"], ans:["لڑکے","کتابیں","پھول","ستارے","بچے","خطوط","علماء","مسائل","صفحات","نظمیں"]},{q:"مذکر سے مؤنث بنائیں:", parts:["لڑکا","استاد","شیر","راجا","بادشاہ","مرغ","بھائی","چچا","نوکر","سیٹھ"], ans:["لڑکی","استانی","شیرنی","رانی","ملکہ","مرغی","بہن","چچی","نوکرانی","سیٹھانی"]},{q:"جملے میں اسم نکالیں:", parts:["علی نے لاہور میں کتاب خریدی","سارا سکول جاتی ہے","پاکستان ایک خوبصورت ملک ہے","بچے پارک میں کھیلتے ہیں","استاد نے سبق پڑھایا"], ans:["علی، لاہور، کتاب","سارا، سکول","پاکستان، ملک","بچے، پارک","استاد، سبق"]}],
         wordProblems:["دس اسم معرفہ اور دس اسم نکرہ لکھیں۔","اپنے گھر کی دس چیزوں کے نام لکھ کر بتائیں کون سی قسم ہے۔","پانچ ایسے الفاظ لکھیں جن کا مذکر مؤنث بالکل مختلف ہو۔","دس واحد الفاظ اور ان کی جمع لکھیں۔","اسم ذات، اسم صفت اور اسم کیفیت کی پانچ پانچ مثالیں دیں۔"],
         quiz:[{q:"اسم کی تعریف:",a:["کام کا نام","کسی چیز کا نام","صفت","فعل"],c:1},{q:"'لاہور' کون سا اسم:",a:["نکرہ","معرفہ","جمع","صفت"],c:1},{q:"'لڑکا' کی جمع:",a:["لڑکی","لڑکے","لڑکوں","لڑکیاں"],c:1},{q:"مؤنث 'شیر':",a:["شیرا","شیرنی","شیری","شیرن"],c:1},{q:"اسم جمع:",a:["لڑکا","فوج","لاہور","خوبصورت"],c:1},{q:"'کتاب' کون سا اسم:",a:["معرفہ","نکرہ","جمع","ضمیر"],c:1},{q:"'خط' کی جمع:",a:["خطے","خطوط","خطیں","خطوں"],c:1},{q:"اسم صفت:",a:["علی","لاہور","خوبصورت","دوڑنا"],c:2}]
        },
        {t:"فعل اور اس کے زمانے", c:"فعل وہ لفظ ہے جو کسی کام کا ہونا یا کرنا ظاہر کرے۔ تین زمانے: ماضی، حال، مستقبل۔ فعل لازم اور فعل متعدی میں فرق جانیں۔",
         examples:["فعل ماضی: علی نے کھانا کھایا، سارا نے کتاب پڑھی، بچے کھیلے، بارش ہوئی","فعل حال: علی کھاتا ہے، سارا پڑھتی ہے، بارش ہو رہی ہے، پرندے اڑ رہے ہیں","فعل مستقبل: علی کھائے گا، سارا پڑھے گی، ہم جائیں گے، وہ آئے گا","فعل لازم (خود پر اثر): سونا، اٹھنا، بیٹھنا، ہنسنا، رونا، چلنا","فعل متعدی (دوسرے پر اثر): کھانا، پڑھنا، لکھنا، مارنا، دیکھنا، سننا","فعل امر (حکم): جاؤ، آؤ، بیٹھو، پڑھو، لکھو، کھاؤ","فعل نہی (منع): مت جاؤ، نہ بولو، مت مارو"],
         exercises:[{q:"فعل کا زمانہ بتائیں:", parts:["علی نے کام کیا","سارا پڑھتی ہے","وہ کل آئے گا","ہم نے کھیلا","بارش ہو رہی ہے","میں جاؤں گا","اس نے خط لکھا","وہ گاتی ہے","ہم سفر کریں گے","بچے سو گئے"], ans:["ماضی","حال","مستقبل","ماضی","حال","مستقبل","ماضی","حال","مستقبل","ماضی"]},{q:"فعل لازم یا متعدی:", parts:["سونا","کھانا","اٹھنا","لکھنا","بیٹھنا","پڑھنا","ہنسنا","مارنا","چلنا","دیکھنا"], ans:["لازم","متعدی","لازم","متعدی","لازم","متعدی","لازم","متعدی","لازم","متعدی"]},{q:"فعل امر بنائیں:", parts:["جانا","آنا","پڑھنا","لکھنا","کھانا"], ans:["جاؤ","آؤ","پڑھو","لکھو","کھاؤ"]}],
         wordProblems:["پانچ جملے ماضی، پانچ حال اور پانچ مستقبل میں لکھیں۔","فعل لازم اور متعدی میں فرق مثالوں سے بیان کریں۔","'کھانا' فعل کو تینوں زمانوں اور فعل امر میں استعمال کریں۔","فعل نہی کی پانچ مثالیں جملوں میں لکھیں۔","دس فعل لکھیں اور بتائیں کون سا لازم ہے کون سا متعدی۔"],
         quiz:[{q:"فعل ماضی:",a:["کھاتا ہے","کھائے گا","کھایا","کھا رہا ہے"],c:2},{q:"فعل حال:",a:["گیا","جائے گا","جاتا ہے","جا چکا"],c:2},{q:"فعل لازم:",a:["کھانا","لکھنا","سونا","پڑھنا"],c:2},{q:"فعل متعدی:",a:["اٹھنا","بیٹھنا","لکھنا","سونا"],c:2},{q:"'وہ آئے گا' زمانہ:",a:["ماضی","حال","مستقبل","امر"],c:2},{q:"فعل امر:",a:["گیا","جاتا ہے","جاؤ","جائے گا"],c:2},{q:"فعل نہی:",a:["جاؤ","مت جاؤ","گیا","جائے گا"],c:1},{q:"فعل کی تعریف:",a:["نام","کام کا ہونا","صفت","حرف"],c:1}]
        },
        {t:"حروف، صفت اور ضمیر", c:"حرف: اسم اور فعل کے ساتھ مل کر مطلب واضح کرے۔ صفت: اسم کی خوبی بتائے۔ ضمیر: اسم کی جگہ استعمال ہو۔",
         examples:["حرف جار: سے، میں، پر، کو، تک، کے لیے","حرف عطف: اور، مگر، یا، لیکن، بلکہ، نہ","حرف ندا: اے، ہائے، اللہ، واہ","حرف استفہام: کیا، کون، کہاں، کب، کیوں، کیسے","صفت: خوبصورت لڑکی، لمبا درخت، سرخ گلاب، تیز دھوپ، ٹھنڈا پانی","ضمیر: میں، تم، وہ، ہم، یہ، آپ، کوئی، کچھ"],
         exercises:[{q:"حرف کی قسم بتائیں:", parts:["سے","اور","اے","کیا","مگر","میں","یا","ہائے","کو","لیکن"], ans:["جار","عطف","ندا","استفہام","عطف","جار","عطف","ندا","جار","عطف"]},{q:"صفت نکالیں:", parts:["خوبصورت پھول","لمبا درخت","سرخ گلاب","ٹھنڈا پانی","تیز دھوپ","نیک لڑکا","بہادر سپاہی","میٹھا پھل"], ans:["خوبصورت","لمبا","سرخ","ٹھنڈا","تیز","نیک","بہادر","میٹھا"]},{q:"ضمیر لگائیں:", parts:["___ سکول جاتا ہوں","___ کتاب پڑھتی ہے","___ کھیلتے ہیں","___ آئے گا","___ بہت اچھی ہیں"], ans:["میں","وہ","ہم","وہ","آپ"]}],
         wordProblems:["ہر قسم کے حرف کی پانچ مثالیں جملوں میں لکھیں۔","دس صفتیں لکھیں اور جملوں میں استعمال کریں۔","ضمیر کی چھ اقسام مثالوں سے بیان کریں۔","ایک پیراگراف لکھیں جس میں کم از کم پانچ صفتیں ہوں۔","حرف جار اور حرف عطف میں فرق بتائیں۔"],
         quiz:[{q:"حرف جار:",a:["اور","سے","اے","کیا"],c:1},{q:"حرف عطف:",a:["میں","پر","اور","سے"],c:2},{q:"صفت:",a:["علی","خوبصورت","دوڑنا","سے"],c:1},{q:"ضمیر:",a:["کتاب","لاہور","وہ","خوبصورت"],c:2},{q:"'ٹھنڈا پانی' میں صفت:",a:["پانی","ٹھنڈا","دونوں","کوئی نہیں"],c:1},{q:"'میں' کیا ہے:",a:["اسم","فعل","ضمیر","حرف"],c:2},{q:"حرف ندا:",a:["مگر","اے","کو","یا"],c:1},{q:"حرف استفہام:",a:["سے","اور","کب","پر"],c:2}]
        }
      ] },
      { title: "مضمون نویسی", content: "مضامین لکھنے کا فن — تعارف، مرکزی حصہ اور اختتام۔", key: "mazmoon5", hasMathSub: true, subs: [
        {t:"مضمون لکھنے کے اصول", c:"مضمون تین حصوں پر مشتمل: تعارف، مرکزی حصہ (دلائل و تفصیلات)، اختتام (خلاصہ و رائے)۔ واضح زبان، مربوط خیالات اور صحیح ہجے ضروری ہیں۔",
         examples:["تعارف: موضوع کا ایک دو جملوں میں تعارف — قاری کی توجہ حاصل کریں","مرکزی حصہ: کم از کم تین پیراگراف — دلائل، مثالیں، حقائق","اختتام: خلاصہ، اپنی رائے، آخری بات","اچھے مضمون کی خصوصیات: سادہ زبان، ترتیب، صحیح ہجے، اقتباسات","عنوانات: میرا سکول، قومی پرچم، محنت کی عظمت، میرا وطن، علم کی اہمیت، صفائی","خاکہ بنائیں: لکھنے سے پہلے نکات بنائیں، پھر تفصیل لکھیں"],
         exercises:[{q:"مضمون 'میرا سکول' کا خاکہ:", parts:["تعارف","عمارت و ماحول","اساتذہ و طلبا","سرگرمیاں و کھیل","اختتام"], ans:["نام، مقام، جماعت","کمرے، میدان، باغ","تعداد، محبت، تعلیم","کھیل، تقریبات، مقابلے","محبت، دعا، خوشی"]},{q:"ان مضامین کے لیے تین نکات لکھیں:", parts:["میرا پسندیدہ کھیل","ہمارا قومی پرچم","موسم گرما کی چھٹیاں","میری والدہ","صفائی نصف ایمان","علم کی اہمیت","محنت کی عظمت","میرا پسندیدہ موسم"], ans:["نام/اصول/فوائد","رنگ/چاند ستارہ/احترام","سفر/مزے/واپسی","محبت/قربانی/دعا","حکم/فوائد/عمل","اہمیت/فوائد/ذریعے","کامیابی/مثالیں/نتیجہ","خصوصیات/مزے/یادیں"]}],
         wordProblems:["'میرا پسندیدہ موسم' پر دس جملوں کا مضمون لکھیں۔","'محنت کی عظمت' پر تعارف اور اختتام لکھیں۔","'قومی پرچم' پر مضمون کا خاکہ بنائیں۔","'میری والدہ' پر مختصر مضمون لکھیں۔","'صفائی نصف ایمان' پر اپنی رائے لکھیں۔"],
         quiz:[{q:"مضمون کے حصے:",a:["2","3","4","5"],c:1},{q:"مرکزی حصے میں:",a:["صرف نام","دلائل و تفصیلات","صرف اختتام","کچھ نہیں"],c:1},{q:"اختتام میں:",a:["نئے خیالات","خلاصہ اور رائے","صرف سوالات","تعارف دوبارہ"],c:1},{q:"خاکہ بنانا:",a:["غیر ضروری","لکھنے سے پہلے","لکھنے کے بعد","کبھی نہیں"],c:1},{q:"اچھے مضمون کی خصوصیت:",a:["غلط ہجے","واضح زبان","بے ربط","لمبے جملے"],c:1},{q:"مضمون کا پہلا حصہ:",a:["اختتام","مرکزی","تعارف","خلاصہ"],c:2}]
        },
        {t:"مشہور مضامین — نمونے", c:"مختلف موضوعات پر مضامین کے نمونے — وطن، علم، محنت، قومی ہیرو، موسم۔",
         examples:["میرا وطن پاکستان: 14 اگست 1947 کو آزاد ہوا۔ قائداعظم محمد علی جناح بانی۔ دارالحکومت اسلام آباد۔ چار صوبے۔ خوبصورت پہاڑ، دریا، صحرا۔ مہمان نواز لوگ۔","علم کی اہمیت: علم انسان کی سب سے بڑی دولت۔ قرآن میں حکم: اقرا (پڑھو)۔ علم سے ترقی، عزت، کامیابی ملتی ہے۔","محنت کی عظمت: محنت کامیابی کی کنجی۔ سستی سے نقصان۔ چیونٹی کی مثال — گرمیوں میں محنت، سردیوں میں آرام۔","موسم بہار: پھول کھلتے ہیں، ہریالی ہوتی ہے، موسم خوشگوار ہوتا ہے، پرندے چہچہاتے ہیں۔","ہمارے قومی ہیرو: قائداعظم — آزادی، علامہ اقبال — شاعری سے بیداری، سر سید — تعلیم کی تحریک۔","میرا پسندیدہ کھیل کرکٹ: ٹیمیں، بلے بازی، گیند بازی، فیلڈنگ، پاکستان کی فتوحات۔"],
         exercises:[{q:"مضمون کا عنوان تجویز کریں:", parts:["پاکستان کے بارے میں","تعلیم کے فوائد","سختیوں سے کامیابی","ماں کی محبت","صفائی کی اہمیت","قدرتی آفات"], ans:["میرا وطن پاکستان","علم کی اہمیت","محنت کی عظمت","میری والدہ","صفائی نصف ایمان","قدرتی آفات اور حفاظت"]},{q:"مضمون سے سوالات — 'علم کی اہمیت':", parts:["علم کیا ہے؟","قرآن میں کیا حکم ہے؟","علم سے کیا ملتا ہے؟","بے علم انسان کیسا ہے؟","علم حاصل کرنے کے ذرائع؟"], ans:["انسان کی سب سے بڑی دولت","اقرا — پڑھو","ترقی، عزت، کامیابی","اندھیرے میں ہے","سکول، کتابیں، استاد، انٹرنیٹ"]}],
         wordProblems:["'وطن سے محبت' پر دس جملوں کا مضمون لکھیں۔","'میرے استاد' پر مختصر مضمون لکھیں۔","'کرکٹ' پر مضمون لکھیں — کم از کم تین پیراگراف۔","'بارش کا ایک دن' پر تصویری مضمون لکھیں۔","'ہمارا محلہ' پر مضمون لکھیں۔"],
         quiz:[{q:"پاکستان کب آزاد ہوا:",a:["1945","1946","1947","1948"],c:2},{q:"قائداعظم کا پورا نام:",a:["علامہ اقبال","لیاقت علی","محمد علی جناح","سر سید"],c:2},{q:"دارالحکومت:",a:["لاہور","کراچی","اسلام آباد","پشاور"],c:2},{q:"علم کی اہمیت قرآن میں:",a:["صوم","اقرا","صلاۃ","حج"],c:1},{q:"محنت = ?",a:["سستی","کامیابی کی کنجی","نقصان","بے کار"],c:1},{q:"صوبے:",a:["3","4","5","6"],c:1},{q:"شاعر مشرق:",a:["قائداعظم","علامہ اقبال","سر سید","لیاقت"],c:1},{q:"مضمون میں ضروری:",a:["صرف عنوان","ترتیب و دلائل","صرف لمبائی","تصویریں"],c:1}]
        }
      ] },
      { title: "خط نویسی", content: "ذاتی، سرکاری خطوط اور درخواست نویسی کا طریقہ۔", key: "khat5", hasMathSub: true, subs: [
        {t:"ذاتی خط", c:"دوستوں اور رشتے داروں کو لکھے جاتے ہیں۔ غیر رسمی زبان۔ حصے: تاریخ، سلام، مضمون، خاتمہ، نام۔",
         examples:["تاریخ: 28 مارچ 2026ء","السلام علیکم / محترم بھائی / پیاری سہیلی","مضمون: حال احوال، خبریں، خوشی، غم، دعوت","خاتمہ: والسلام / آپ کا مخلص / دعاگو","نمونہ: 'محترم بھائی، السلام علیکم! امید ہے خیریت سے ہیں۔ میرے امتحانات ختم ہو گئے۔ نتائج اچھے آئے الحمدللہ۔ آپ کو عید پر مدعو کرتا ہوں۔ والسلام۔ آپ کا بھائی، احمد'","یاد رکھیں: پیار و محبت کا اظہار، قریبی تعلق، دلچسپ انداز"],
         exercises:[{q:"خط کے حصے ترتیب سے:", parts:["تاریخ","مکتوب الیہ","سلام","مضمون خط","خاتمہ","اپنا نام"], ans:["1","2","3","4","5","6"]},{q:"کون سا خط ذاتی ہے:", parts:["دوست کو عید مبارک","ہیڈ ماسٹر سے چھٹی","بھائی کو حالات","اخبار ایڈیٹر کو شکایت","دادی کو خط","دفتر کو درخواست"], ans:["ذاتی","سرکاری","ذاتی","سرکاری","ذاتی","سرکاری"]}],
         wordProblems:["دوست کو چھٹیوں کا حال بتاتے ہوئے خط لکھیں۔","دادی کو عید مبارک کا خط لکھیں۔","بھائی کو امتحان کی تیاری کے بارے میں خط لکھیں۔","سہیلی کو سالگرہ کی مبارکباد کا خط لکھیں۔","والد کو مدرسے کی سرگرمیوں کے بارے میں خط لکھیں۔"],
         quiz:[{q:"ذاتی خط لکھا جاتا ہے:",a:["افسر کو","دوست/رشتے دار","اخبار کو","سکول کو"],c:1},{q:"خط میں پہلے:",a:["نام","خاتمہ","تاریخ و سلام","مضمون"],c:2},{q:"ذاتی خط کی زبان:",a:["سرکاری","غیر رسمی","قانونی","انگریزی"],c:1},{q:"خط کے آخر میں:",a:["سلام","تاریخ","والسلام/نام","مضمون"],c:2},{q:"ذاتی خط میں:",a:["سخت زبان","پیار و محبت","قانونی اصطلاحات","کوئی جذبات نہیں"],c:1},{q:"مکتوب الیہ:",a:["لکھنے والا","جسے خط لکھا جائے","ڈاکیا","کاغذ"],c:1}]
        },
        {t:"سرکاری خط اور درخواست", c:"عہدیداروں اور اداروں کو لکھے جاتے ہیں۔ رسمی زبان ضروری۔ درخواست: بنام، مضمون، وجہ، گزارش، نام، تاریخ۔",
         examples:["بنام: محترم ہیڈ ماسٹر صاحب / محترم ایڈیٹر صاحب / محترم ڈی سی صاحب","مضمون: چھٹی / شکایت / درخواست / سفارش","عرض ہے کہ مجھے بخار ہونے کی وجہ سے ایک دن کی چھٹی درکار ہے۔","گزارش ہے کہ مہربانی فرما کر منظور فرمائیں۔","سرکاری خط کے اصول: ادب، وضاحت، مختصر، نکتہ واضح","نمونہ درخواست: بنام ہیڈ ماسٹر ← مضمون: چھٹی ← وجہ: بیماری ← گزارش: منظوری ← نام جماعت تاریخ"],
         exercises:[{q:"درخواست کے حصے:", parts:["بنام","مضمون","تفصیل/وجہ","گزارش","نام و جماعت","تاریخ"], ans:["1","2","3","4","5","6"]},{q:"کس کو لکھیں گے:", parts:["سکول میں چھٹی","محلے کی سڑک خراب","کتابیں نہیں ملیں","پانی کی قلت","نئے کھیل کا سامان"], ans:["ہیڈ ماسٹر","ڈی سی / ناظم","لائبریرین","واٹر بورڈ","ہیڈ ماسٹر"]}],
         wordProblems:["بیماری کی وجہ سے ایک دن کی چھٹی کی درخواست لکھیں۔","محلے میں صفائی نہ ہونے پر ناظم صاحب کو درخواست لکھیں۔","نئے کمپیوٹر لیب کے لیے ہیڈ ماسٹر کو درخواست لکھیں۔","اخبار کے ایڈیٹر کو ٹریفک کے مسئلے پر خط لکھیں۔","کتابیں نہ ملنے کی شکایت لائبریرین کو لکھیں۔"],
         quiz:[{q:"سرکاری خط کی زبان:",a:["غیر رسمی","رسمی","عام بول چال","انگریزی"],c:1},{q:"درخواست 'بنام':",a:["دوست","عہدیدار","بچے","خود"],c:1},{q:"درخواست میں ضروری:",a:["صرف نام","وجہ اور گزارش","صرف تاریخ","کچھ نہیں"],c:1},{q:"چھٹی کی درخواست:",a:["دوست کو","ہیڈ ماسٹر کو","بھائی کو","والد کو"],c:1},{q:"سرکاری خط میں:",a:["محبت کا اظہار","ادب اور وضاحت","مذاق","لمبی کہانی"],c:1},{q:"'گزارش' کا مطلب:",a:["حکم","درخواست/عرض","شکایت","سوال"],c:1}]
        }
      ] },
      { title: "نظمیں اور کہانیاں", content: "مشہور نظمیں، شعر کی ساخت، اخلاقی کہانیاں اور ان کے سبق۔", key: "nazm5", hasMathSub: true, subs: [
        {t:"نظمیں اور شعر", c:"اردو ادب میں بچوں کے لیے خوبصورت نظمیں۔ شعر دو مصرعوں پر مشتمل ہوتا ہے۔ قافیہ آخری ہم آواز الفاظ، ردیف قافیے کے بعد مشترک لفظ۔",
         examples:["لب پہ آتی ہے دعا بن کے تمنا میری — علامہ اقبال","ہمالہ — علامہ اقبال: اے ہمالہ! اے فصیلِ کشورِ ہندوستان","پرندے کی فریاد — اسماعیل میرٹھی: بچوں کو فطرت سے محبت سکھاتی ہے","شعر = دو مصرعے، غزل = ہر شعر مکمل، نظم = ایک موضوع پر","قافیہ: رات/بات، دل/مل، چمن/وطن — ہم آواز الفاظ","ردیف: 'ہے' — اگر ہر شعر 'ہے' پر ختم ہو","مطلع: غزل کا پہلا شعر، مقطع: آخری شعر","غزل اور نظم میں فرق: غزل — مختلف موضوعات، نظم — ایک موضوع"],
         exercises:[{q:"جوابات دیں:", parts:["'لب پہ آتی ہے دعا' کس شاعر کی ہے؟","شعر میں کتنے مصرعے؟","قافیہ کسے کہتے ہیں؟","ردیف کیا ہے؟","غزل اور نظم میں فرق؟","مطلع کیا ہے؟","مقطع کیا ہے؟","اردو کے دو مشہور شاعر؟"], ans:["علامہ اقبال","دو","آخری ہم آواز الفاظ","قافیے کے بعد مشترک لفظ","غزل: مختلف موضوعات، نظم: ایک","غزل کا پہلا شعر","غزل کا آخری شعر","اقبال، غالب"]},{q:"قافیے ملائیں:", parts:["رات","دل","چمن","آسمان","گل","خوشی"], ans:["بات، ملاقات","مل، کل","وطن، سخن","جہان، مکان","بلبل","ہنسی، زندگی"]}],
         wordProblems:["'پرندے' پر چار مصرعوں کی نظم لکھیں۔","شعر اور نثر میں فرق بیان کریں۔","قافیے کے پانچ جوڑے لکھیں۔","علامہ اقبال کے بارے میں پانچ جملے لکھیں۔","اپنی پسندیدہ نظم کے بارے میں لکھیں — کیوں پسند ہے؟"],
         quiz:[{q:"'لب پہ آتی ہے دعا' شاعر:",a:["میر","غالب","اقبال","فیض"],c:2},{q:"شعر میں مصرعے:",a:["1","2","3","4"],c:1},{q:"قافیہ:",a:["پہلے الفاظ","ہم آواز","لمبے","چھوٹے"],c:1},{q:"شاعر مشرق:",a:["غالب","اقبال","میر","فیض"],c:1},{q:"مطلع:",a:["آخری شعر","پہلا شعر","درمیانی","کوئی بھی"],c:1},{q:"غزل میں:",a:["ایک موضوع","مختلف موضوعات","صرف نثر","کوئی موضوع نہیں"],c:1},{q:"ردیف:",a:["پہلا لفظ","قافیے کے بعد مشترک","آخری لفظ ہمیشہ","کوئی نہیں"],c:1},{q:"نظم میں:",a:["مختلف موضوعات","ایک موضوع","کوئی قافیہ نہیں","صرف نثر"],c:1}]
        },
        {t:"اخلاقی کہانیاں اور سبق", c:"کہانیاں سبق سکھاتی ہیں۔ ہر کہانی میں کردار، واقعات اور اخلاقی پیغام ہوتا ہے۔",
         examples:["سچا دوست: مشکل میں ایک دوست نے مدد کی۔ سبق: سچا دوست مشکل میں کام آتا ہے۔","لالچی کتا: پانی میں عکس دیکھ کر بھونکا، ہڈی گر گئی۔ سبق: لالچ بری بلا ہے۔","محنتی چیونٹی: گرمیوں میں خوراک جمع کی، سردیوں میں آرام سے رہی۔ سبق: محنت کا پھل میٹھا۔","شیر اور چوہا: چوہے نے شیر کو جال سے آزاد کیا۔ سبق: چھوٹوں کو حقیر نہ سمجھو۔","سچائی کی طاقت: ایک بچے نے سچ بولا اور سب نے اس کی عزت کی۔ سبق: سچ ہمیشہ جیتتا ہے۔","ایمانداری: ایک دکاندار نے زیادہ پیسے واپس کیے۔ سبق: ایمانداری بہترین پالیسی ہے۔","لومڑی اور انگور: لومڑی انگور نہ توڑ سکی تو کہا کھٹے ہیں۔ سبق: کمزوری چھپانا۔","خرگوش اور کچھوا: کچھوے نے مسلسل چل کر دوڑ جیت لی۔ سبق: سستی نہ کرو، مسلسل محنت کرو۔"],
         exercises:[{q:"کہانی کا سبق بتائیں:", parts:["لالچی کتا","محنتی چیونٹی","شیر اور چوہا","سچا دوست","لومڑی اور انگور","خرگوش اور کچھوا","سچائی کی طاقت","ایمانداری"], ans:["لالچ بری بلا","محنت کا پھل میٹھا","چھوٹوں کو حقیر نہ سمجھو","مشکل میں کام آنا","کمزوری چھپانا","مسلسل محنت","سچ ہمیشہ جیتتا ہے","ایمانداری بہترین پالیسی"]},{q:"کہانی کے کردار بتائیں:", parts:["لالچی کتا","شیر اور چوہا","خرگوش اور کچھوا","محنتی چیونٹی"], ans:["کتا، اس کا عکس","شیر، چوہا، شکاری","خرگوش، کچھوا","چیونٹی، ٹڈا"]}],
         wordProblems:["'محنت کی عظمت' پر ایک کہانی لکھیں۔","'سچائی' کے موضوع پر مختصر کہانی بنائیں۔","اپنی پسندیدہ کہانی کا خلاصہ اور سبق لکھیں۔","'ایمانداری' پر ایک نئی کہانی بنائیں۔","کسی کہانی کا انت بدل کر نیا سبق لکھیں۔"],
         quiz:[{q:"لالچی کتا — سبق:",a:["محنت","لالچ بری بلا","سچ بولو","بڑوں کا احترام"],c:1},{q:"کہانی میں ہوتے ہیں:",a:["صرف الفاظ","کردار و واقعات","اعداد","قافیے"],c:1},{q:"اخلاقی کہانی:",a:["سبق سکھاتی","صرف مزے دیتی","بے مقصد","صرف بڑوں کے لیے"],c:0},{q:"خرگوش اور کچھوا — سبق:",a:["تیز دوڑو","سستی نہ کرو","سو جاؤ","لالچ کرو"],c:1},{q:"شیر اور چوہا — سبق:",a:["طاقت سب کچھ","چھوٹوں کو حقیر نہ سمجھو","بھاگو","لڑو"],c:1},{q:"سچائی:",a:["ہمیشہ ہارتی","ہمیشہ جیتتی","کوئی فرق نہیں","برائی"],c:1}]
        }
      ] },
      { title: "محاورے اور ضرب الامثال", content: "روزمرہ محاورے، ضرب الامثال، ان کے معنی اور استعمال۔", key: "muhawre5", hasMathSub: true, subs: [
        {t:"محاورے", c:"محاورہ ایسا جملہ ہے جس کا اصل مطلب الفاظ سے مختلف ہو۔ محاورے زبان کو خوبصورت بناتے ہیں۔",
         examples:["نو دو گیارہ ہونا = بھاگ جانا","آنکھوں کا تارا = بہت پیارا","ٹکریں مارنا = بہت کوشش کرنا","دال میں کچھ کالا = شک ہونا","ناک میں دم کرنا = بہت تنگ کرنا","آسمان سے گرا کھجور میں اٹکا = ایک مصیبت سے دوسری","انگلیوں پر گننا = بہت کم ہونا","آنکھ کا اندھا نام نیندوان = نام اور کام میں فرق","تیر مارنا = کامیاب ہونا","منہ میں پانی آنا = لالچ آنا","آسمان پر تھوکنا = خود کو نقصان پہنچانا","ہاتھ پیر مارنا = بہت کوشش کرنا","کان بھرنا = چغلی کرنا","آنکھیں چار ہونا = نظریں ملنا","پانی پھیر دینا = ناکام کر دینا"],
         exercises:[{q:"محاورے کا مطلب:", parts:["نو دو گیارہ ہونا","آنکھوں کا تارا","ناک میں دم کرنا","دال میں کالا","ٹکریں مارنا","انگلیوں پر گننا","تیر مارنا","منہ میں پانی آنا","آسمان پر تھوکنا","ہاتھ پیر مارنا","کان بھرنا","پانی پھیر دینا"], ans:["بھاگ جانا","بہت پیارا","بہت تنگ کرنا","شک ہونا","بہت کوشش","بہت کم","کامیاب ہونا","لالچ آنا","خود کو نقصان","بہت کوشش","چغلی کرنا","ناکام کرنا"]},{q:"جملوں میں استعمال:", parts:["نو دو گیارہ","آنکھوں کا تارا","ناک میں دم","تیر مارنا","منہ میں پانی","کان بھرنا"], ans:["چور نو دو گیارہ ہو گیا","وہ ماں کی آنکھوں کا تارا ہے","بچوں نے ناک میں دم کر دیا","اس نے امتحان میں تیر مارا","مٹھائی دیکھ کر منہ میں پانی آ گیا","اس نے استاد کے کان بھرے"]}],
         wordProblems:["دس محاورے ان کے معنی اور جملوں کے ساتھ لکھیں۔","'نو دو گیارہ' پر مختصر کہانی لکھیں۔","روزمرہ زندگی میں پانچ محاورے استعمال کر کے پیراگراف لکھیں۔","محاورے اور سادہ جملے میں فرق بتائیں۔","نئے پانچ محاورے تلاش کریں اور معنی لکھیں۔"],
         quiz:[{q:"'نو دو گیارہ':",a:["گنتی","بھاگ جانا","کم ہونا","سونا"],c:1},{q:"'آنکھوں کا تارا':",a:["بیمار","بہت پیارا","ناراض","اداس"],c:1},{q:"'ناک میں دم':",a:["خوش","تنگ کرنا","مدد","سونا"],c:1},{q:"محاورہ:",a:["سادہ جملہ","خاص مطلب والا","سوال","جواب"],c:1},{q:"'تیر مارنا':",a:["لڑنا","کامیاب ہونا","شکار","بھاگنا"],c:1},{q:"'منہ میں پانی':",a:["پیاس","لالچ","بارش","رونا"],c:1},{q:"'کان بھرنا':",a:["سننا","چغلی کرنا","بہرا ہونا","گانا"],c:1},{q:"'پانی پھیر دینا':",a:["پانی دینا","ناکام کرنا","دھونا","تیرنا"],c:1}]
        },
        {t:"ضرب الامثال", c:"ضرب المثل عوام میں مشہور مقولے ہیں جو تجربے اور حکمت پر مبنی ہوتے ہیں۔",
         examples:["جیسی کرنی ویسی بھرنی = جیسا عمل ویسا نتیجہ","بندر کیا جانے ادرک کا سواد = نالائق قدر نہیں جانتا","جل کا بھنا گرم پانی سے ڈرتا ہے = برا تجربہ ڈراتا ہے","اندھوں میں کانا راجا = کم جاننے والوں میں تھوڑا جاننے والا بڑا","ایک انار سو بیمار = کم چیز زیادہ لوگوں کو چاہیے","اوس چاٹے پیاس نہیں بجھتی = کم سے کام نہیں چلتا","جس کی لاٹھی اس کی بھینس = طاقتور کی بات چلتی ہے","نیکی کر دریا میں ڈال = بھلائی کا بدلہ نہ مانگو","آپ بھلے تو جگ بھلا = اچھے لوگوں کو سب اچھے لگتے ہیں","بوند بوند سے سمندر بنتا ہے = تھوڑا تھوڑا جمع ہو کر بہت بنتا ہے","ضرورت ایجاد کی ماں ہے = ضرورت انسان کو نئی چیزیں بنانے پر مجبور کرتی ہے","جہاں چاہ وہاں راہ = ارادہ ہو تو راستہ مل جاتا ہے"],
         exercises:[{q:"ضرب المثل کا مطلب:", parts:["جیسی کرنی ویسی بھرنی","بندر کیا جانے ادرک","اندھوں میں کانا راجا","ایک انار سو بیمار","جس کی لاٹھی اس کی بھینس","نیکی کر دریا میں ڈال","بوند بوند سے سمندر","جہاں چاہ وہاں راہ","ضرورت ایجاد کی ماں","آپ بھلے تو جگ بھلا"], ans:["جیسا عمل ویسا نتیجہ","نالائق قدر نہ جانے","کم والوں میں تھوڑا بڑا","کم چیز زیادہ لوگ","طاقتور کی بات","بھلائی کا بدلہ نہ مانگو","تھوڑا تھوڑا جمع = بہت","ارادہ ہو تو راستہ","ضرورت نئی ایجاد لاتی","اچھوں کو سب اچھے"]}],
         wordProblems:["دس ضرب الامثال معنی کے ساتھ لکھیں۔","'جیسی کرنی ویسی بھرنی' پر واقعہ لکھیں۔","محاورے اور ضرب المثل میں فرق بیان کریں۔","'جہاں چاہ وہاں راہ' پر کہانی لکھیں۔","پانچ ضرب الامثال جملوں میں استعمال کریں۔"],
         quiz:[{q:"ضرب المثل:",a:["نیا جملہ","عوامی مقولہ","سوال","شعر"],c:1},{q:"'جیسی کرنی':",a:["کام نہ کرو","ویسا نتیجہ","سب اچھا","سونا"],c:1},{q:"'نیکی کر دریا میں ڈال':",a:["دریا میں پھینکو","بھلائی کا بدلہ نہ مانگو","تیرنا سیکھو","مچھلی پکڑو"],c:1},{q:"'بوند بوند سے':",a:["بارش","سمندر بنتا ہے","خشکی","سیلاب"],c:1},{q:"'جہاں چاہ وہاں راہ':",a:["راستہ بند","ارادے سے راستہ","ہارنا","بھاگنا"],c:1},{q:"فرق محاورہ اور ضرب المثل:",a:["ایک ہیں","فرق ہے","نہیں ہوتے","صرف انگریزی"],c:1},{q:"'ضرورت ایجاد کی ماں':",a:["ماں بہترین","ضرورت نیا بناتی","ایجاد ماں","کچھ نہیں"],c:1},{q:"'اندھوں میں کانا':",a:["سب اندھے","کم والوں میں تھوڑا بڑا","کانا برا","آنکھ"],c:1}]
        }
      ] },
      { title: "املا اور ہجے", content: "صحیح ہجے، مشکل الفاظ، اوقاف اور رموز۔", key: "imla5", hasMathSub: true, subs: [
        {t:"صحیح ہجے اور مشکل الفاظ", c:"صحیح ہجے بہت ضروری ہیں۔ غلط ہجے سے مطلب بدل جاتا ہے۔ ع، ح، ء، ہ، ذ، ز، ض، ظ میں فرق جانیں۔",
         examples:["عزت (ع سے) نہ ازت","حکومت (ح سے) نہ ہکومت","انعام (ع سے) نہ انام","مسئلہ (ء کے ساتھ) نہ مسلہ","تعلیم (ع سے) نہ تالیم","محنت (ح سے) نہ مہنت","ذمہ داری (ذ سے) نہ زمہ داری","ضرورت (ض سے) نہ زرورت","ظالم (ظ سے) نہ زالم","حاضر (ح اور ض) نہ ہازر"],
         exercises:[{q:"صحیح ہجے چنیں:", parts:["عزت / ازت","حکومت / ہکومت","انعام / انام","مسئلہ / مسلہ","تعلیم / تالیم","محنت / مہنت","ذمہ / زمہ","ضرورت / زرورت","ظالم / زالم","حاضر / ہازر","ضمیر / زمیر","معلوم / ملوم"], ans:["عزت","حکومت","انعام","مسئلہ","تعلیم","محنت","ذمہ","ضرورت","ظالم","حاضر","ضمیر","معلوم"]},{q:"ع والے الفاظ لکھیں:", parts:["5 الفاظ جن میں ع آتا ہو"], ans:["عزت، علم، عمل، انعام، تعلیم، معلم، عقل، عبادت"]},{q:"ح اور ہ والے الفاظ:", parts:["ح والے 5","ہ والے 5"], ans:["حکومت، محنت، حاضر، حق، حکمت","ہوا، ہاتھ، ہنسنا، ہمسایہ، ہوش"]}],
         wordProblems:["بیس مشکل الفاظ کے صحیح ہجے لکھیں۔","ع، ح، ء، ذ، ض، ظ والے الفاظ کی فہرست بنائیں — ہر ایک کے پانچ۔","غلط ہجے والے دس جملے لکھیں اور درست کریں۔","'ز' اور 'ض' والے پانچ پانچ الفاظ لکھیں اور فرق بتائیں۔","ایک پیراگراف لکھیں جس میں مشکل ہجے والے الفاظ زیادہ ہوں۔"],
         quiz:[{q:"صحیح:",a:["ازت","عزت","اززت","ازّت"],c:1},{q:"صحیح:",a:["ہکومت","حکومت","ھکومت","حکومط"],c:1},{q:"صحیح:",a:["انام","انعام","اینعام","اِنام"],c:1},{q:"غلط ہجے سے:",a:["کچھ نہیں","مطلب بدلتا ہے","خوبصورت","سب سمجھتے"],c:1},{q:"صحیح:",a:["زالم","ظالم","ذالم","ڈالم"],c:1},{q:"صحیح:",a:["زرورت","ضرورت","ذرورت","ڈرورت"],c:1},{q:"ذ والا لفظ:",a:["زمین","ذمہ","ضمیر","ظالم"],c:1},{q:"ض والا لفظ:",a:["ذمہ","زمین","ضمیر","ظلم"],c:2}]
        },
        {t:"اوقاف اور رموز", c:"اوقاف جملوں میں وقفے اور لہجے ظاہر کرتے ہیں۔ صحیح اوقاف سے تحریر واضح ہوتی ہے۔",
         examples:["وقفہ (۔): جملے کے آخر — 'وہ سکول جاتا ہے۔'","سوالیہ نشان (؟): سوال — 'تمہارا نام کیا ہے؟'","فجائیہ (!): حیرت/جذبہ — 'واہ! کیا خوبصورت ہے!'","کاما (،): جملے میں وقفہ — 'احمد، سعد اور سارا آئے۔'","واوین (\" \"): کسی کے الفاظ — 'استاد نے کہا \"پڑھو\"۔'","سیمی کالن (؛): دو متعلق جملے — 'وہ آیا؛ مگر دیر سے۔'","کولن (:): فہرست سے پہلے — 'پھل: سیب، کیلا، انگور۔'","بریکٹ ( ): اضافی معلومات — 'اقبال (شاعر مشرق) عظیم تھے۔'"],
         exercises:[{q:"کون سا نشان:", parts:["تمہارا نام کیا ہے","سبحان اللہ کیا نظارہ ہے","علی نے کہا میں جاؤں گا","احمد ، سعد اور سارا آئے","میں سکول جاتا ہوں","یہ پھل ہیں : سیب ، انگور","وہ آیا ؛ مگر دیر سے","اقبال (شاعر مشرق) عظیم تھے"], ans:["؟","!","\" \"","،","۔",":",  "؛","( )"]},{q:"اوقاف لگائیں:", parts:["کیا تم نے کھانا کھایا___","واہ___ بہت اچھا___","احمد___ سعد اور سارا آئے___","استاد نے کہا___پڑھو___"], ans:["؟","! !",  "، ۔","\"پڑھو\""]}],
         wordProblems:["ہر قسم کے اوقاف والے دو دو جملے لکھیں۔","سوالیہ نشان والے پانچ جملے لکھیں۔","فجائیہ نشان والے پانچ جملے لکھیں۔","ایک پیراگراف لکھیں جس میں تمام اوقاف استعمال ہوں۔","واوین اور کاما کا استعمال مثالوں سے سمجھائیں۔"],
         quiz:[{q:"جملے کے آخر:",a:["کاما","سوالیہ","وقفہ (۔)","فجائیہ"],c:2},{q:"سوال کے آخر:",a:["۔","!","؟","،"],c:2},{q:"حیرت:",a:["۔","؟","!","،"],c:2},{q:"اوقاف کا مقصد:",a:["خوبصورتی","وقفے اور لہجہ","آرائش","کچھ نہیں"],c:1},{q:"واوین:",a:["وقفے کے لیے","کسی کے الفاظ نقل","حیرت","سوال"],c:1},{q:"سیمی کالن:",a:["جملے کا اختتام","دو متعلق جملے","سوال","فہرست"],c:1},{q:"کولن:",a:["جملے کا اختتام","فہرست سے پہلے","حیرت","کسی کے الفاظ"],c:1},{q:"بریکٹ:",a:["سوال","اضافی معلومات","وقفہ","حیرت"],c:1}]
        }
      ] },
      { title: "تذکیر و تانیث، واحد جمع", content: "مذکر مؤنث بنانا، واحد جمع، بے قاعدہ الفاظ۔", key: "tajnees5", hasMathSub: true, subs: [
        {t:"تذکیر و تانیث", c:"مذکر: مرد/نر۔ مؤنث: عورت/مادہ۔ بنانے کے طریقے: آخر میں ی، نی، ہ، آنی لگانا۔ کچھ بالکل مختلف ہوتے ہیں۔",
         examples:["لڑکا ← لڑکی (ی لگانا)","استاد ← استانی (انی لگانا)","شیر ← شیرنی (نی لگانا)","بادشاہ ← ملکہ (بالکل مختلف)","مرغ ← مرغی","گھوڑا ← گھوڑی","نوکر ← نوکرانی","ملک ← ملکہ","بھائی ← بہن (مختلف)","مرد ← عورت (مختلف)","بیل ← گائے (مختلف)","شوہر ← بیوی (مختلف)"],
         exercises:[{q:"مؤنث بنائیں:", parts:["لڑکا","استاد","بادشاہ","مرغ","بھائی","چچا","نانا","سیٹھ","نوکر","شیر","گھوڑا","ملک","مرد","بیل","شوہر"], ans:["لڑکی","استانی","ملکہ","مرغی","بہن","چچی","نانی","سیٹھانی","نوکرانی","شیرنی","گھوڑی","ملکہ","عورت","گائے","بیوی"]},{q:"مذکر بنائیں:", parts:["لڑکی","استانی","رانی","مرغی","بہن","نانی","گھوڑی","شیرنی","بیوی","عورت"], ans:["لڑکا","استاد","راجا","مرغ","بھائی","نانا","گھوڑا","شیر","شوہر","مرد"]}],
         wordProblems:["بیس مذکر الفاظ اور ان کے مؤنث لکھیں۔","پانچ ایسے الفاظ لکھیں جن کا مذکر مؤنث بالکل مختلف ہو۔","مؤنث بنانے کے تین طریقے مثالوں سے بیان کریں۔","جانوروں کے پانچ مذکر مؤنث جوڑے لکھیں۔","رشتوں کے دس مذکر مؤنث جوڑے لکھیں۔"],
         quiz:[{q:"'لڑکا' مؤنث:",a:["لڑکی","لڑکے","لڑکوں","لڑکیاں"],c:0},{q:"'شیر' مؤنث:",a:["شیری","شیرنی","شیرا","شیرن"],c:1},{q:"'استاد' مؤنث:",a:["استادہ","استانی","استادنی","استادی"],c:1},{q:"تذکیر:",a:["مؤنث","مذکر","جمع","واحد"],c:1},{q:"'بادشاہ' مؤنث:",a:["بادشاہی","ملکہ","بادشاہن","رانی"],c:1},{q:"'بھائی' مؤنث:",a:["بھائن","بہن","بھابی","بھائی"],c:1},{q:"'مرد' مؤنث:",a:["مردی","مردانی","عورت","مردن"],c:2},{q:"'نوکر' مؤنث:",a:["نوکری","نوکرانی","نوکرن","نوکرہ"],c:1}]
        },
        {t:"واحد اور جمع", c:"واحد = ایک۔ جمع = زیادہ۔ طریقے: ے، یں، ات، وں، جات لگانا۔ کچھ بے قاعدہ ہوتے ہیں (عربی جمع)۔",
         examples:["لڑکا ← لڑکے (ے لگانا)","کتاب ← کتابیں (یں لگانا)","خط ← خطوط (عربی جمع)","عالم ← علماء (عربی جمع)","مسئلہ ← مسائل (عربی جمع)","بچہ ← بچے","ستارہ ← ستارے","صفحہ ← صفحات (ات لگانا)","کمرہ ← کمرے","نظم ← نظمیں","درخت ← درخت (بعض الفاظ نہیں بدلتے)","آدمی ← لوگ (بالکل مختلف)"],
         exercises:[{q:"جمع بنائیں:", parts:["لڑکا","کتاب","خط","عالم","بچہ","ستارہ","مسئلہ","صفحہ","کمرہ","نظم","لفظ","حرف","فعل","علم","قلم"], ans:["لڑکے","کتابیں","خطوط","علماء","بچے","ستارے","مسائل","صفحات","کمرے","نظمیں","الفاظ","حروف","افعال","علوم","اقلام"]},{q:"واحد بنائیں:", parts:["لڑکے","کتابیں","خطوط","علماء","مسائل","صفحات","الفاظ","حروف","افعال","علوم"], ans:["لڑکا","کتاب","خط","عالم","مسئلہ","صفحہ","لفظ","حرف","فعل","علم"]}],
         wordProblems:["تیس واحد الفاظ اور ان کی جمع لکھیں۔","دس بے قاعدہ جمع والے الفاظ لکھیں (عربی جمع)۔","ایسے پانچ الفاظ لکھیں جن کی جمع نہیں بدلتی۔","جمع بنانے کے پانچ مختلف طریقے مثالوں سے بیان کریں۔","واحد اور جمع والے الفاظ جملوں میں استعمال کریں۔"],
         quiz:[{q:"'کتاب' جمع:",a:["کتب","کتابیں","کتابوں","سب"],c:1},{q:"'خط' جمع:",a:["خطے","خطوط","خطوں","خطیں"],c:1},{q:"'بچہ' جمع:",a:["بچے","بچوں","بچیاں","بچی"],c:0},{q:"واحد:",a:["ایک","دو","زیادہ","کچھ نہیں"],c:0},{q:"'عالم' جمع:",a:["عالمین","علماء","عالمات","عالموں"],c:1},{q:"'لفظ' جمع:",a:["لفظیں","الفاظ","لفظات","لفظوں"],c:1},{q:"'مسئلہ' جمع:",a:["مسئلے","مسائل","مسئلات","مسئلیں"],c:1},{q:"بے قاعدہ جمع:",a:["لڑکے","کتابیں","خطوط","بچے"],c:2}]
        }
      ] },
      { title: "سمجھ بوجھ اور خلاصہ", content: "عبارت فہمی، خلاصہ نویسی، تشریح۔", key: "samajh5", hasMathSub: true, subs: [
        {t:"عبارت فہمی", c:"عبارت کو غور سے پڑھیں، اہم نکات نوٹ کریں، پھر سوالات کے جوابات دیں۔ جواب عبارت میں سے تلاش کریں۔",
         examples:["عبارت 1: 'علی ایک محنتی لڑکا ہے۔ وہ روزانہ صبح جلدی اٹھتا ہے۔ اپنا کام خود کرتا ہے۔ استاد اس سے خوش ہیں۔ خواب: ڈاکٹر بنے۔'","سوال: علی کیسا ہے؟ جواب: محنتی","سوال: خواب کیا ہے؟ جواب: ڈاکٹر بننا","عبارت 2: 'پاکستان ایک خوبصورت ملک ہے۔ شمال میں پہاڑ، جنوب میں سمندر۔ لوگ مہمان نواز ہیں۔ قومی زبان اردو ہے۔'","سوال: شمال میں کیا ہے؟ جواب: پہاڑ","سوال: قومی زبان؟ جواب: اردو"],
         exercises:[{q:"عبارت پڑھیں — 'سارا ایک ذہین لڑکی ہے۔ پانچویں جماعت میں پڑھتی ہے۔ کتابیں پسند ہیں۔ روزانہ ایک گھنٹہ پڑھتی ہے۔ پسندیدہ: کہانیاں۔'", parts:["سارا کیسی ہے؟","کس جماعت میں؟","کیا پسند ہے؟","کتنا وقت پڑھتی ہے؟","پسندیدہ کتاب؟"], ans:["ذہین","پانچویں","کتابیں","ایک گھنٹہ","کہانیاں"]},{q:"عبارت — 'احمد فٹبال کھیلتا ہے۔ اس کی ٹیم نے پچھلے سال ٹورنامنٹ جیتا۔ وہ گول کیپر ہے۔ کوچ اسے بہترین کھلاڑی مانتے ہیں۔ اس کا خواب قومی ٹیم میں جانا ہے۔'", parts:["احمد کیا کھیلتا ہے؟","ٹیم نے کیا جیتا؟","احمد کی پوزیشن؟","کوچ کیا کہتے ہیں؟","خواب کیا ہے؟"], ans:["فٹبال","ٹورنامنٹ","گول کیپر","بہترین کھلاڑی","قومی ٹیم"]}],
         wordProblems:["پانچ جملوں کی عبارت لکھیں اور تین سوالات بنائیں۔","اپنے سکول کے بارے میں عبارت لکھ کر سوالات بنائیں۔","اپنے خاندان کے بارے میں عبارت لکھ کر سوالات بنائیں۔","کسی جانور کے بارے میں عبارت لکھیں اور سوالات بنائیں۔","اپنے پسندیدہ کھیل پر عبارت اور سوالات تیار کریں۔"],
         quiz:[{q:"عبارت فہمی میں پہلے:",a:["سوالات","عبارت پڑھیں","جواب لکھیں","کچھ نہ کریں"],c:1},{q:"جواب ملتا ہے:",a:["خیالات سے","عبارت سے","سوال سے","کہیں نہیں"],c:1},{q:"سمجھ بوجھ:",a:["رٹا","سمجھ کر جواب","نقل","صرف یاد"],c:1},{q:"عبارت کو:",a:["ایک بار","غور سے پڑھیں","نہ پڑھیں","صرف عنوان"],c:1},{q:"اہم نکات:",a:["نظرانداز","نوٹ کریں","بھول جائیں","مٹا دیں"],c:1},{q:"جواب عبارت میں:",a:["کبھی نہیں","ہمیشہ ہوتا ہے","کبھی کبھی","صرف سوال میں"],c:1}]
        },
        {t:"خلاصہ اور تشریح", c:"خلاصہ: مختصر بیان — اہم نکات شامل، غیر ضروری چھوڑیں۔ تشریح: تفصیلی وضاحت — معنی، مفہوم، حوالہ سب شامل۔",
         examples:["خلاصہ اصل سے ایک تہائی ہو","اپنے الفاظ میں لکھیں — نقل نہ کریں","مرکزی خیال نکالیں، پھر اہم نکات چنیں","اپنی رائے شامل نہ کریں — صرف مصنف کا مطلب","تشریح: لفظی معنی + مفہوم + حوالہ + خوبصورتی","خلاصہ اور تشریح میں فرق: خلاصہ مختصر، تشریح تفصیلی"],
         exercises:[{q:"خلاصہ لکھنے کے مراحل:", parts:["پہلا قدم","دوسرا قدم","تیسرا قدم","چوتھا قدم"], ans:["عبارت غور سے پڑھیں","مرکزی خیال نکالیں","اہم نکات چنیں","اپنے الفاظ میں مختصر لکھیں"]},{q:"خلاصہ بنائیں — 'پاکستان خوبصورت ملک ہے۔ شمال میں پہاڑ۔ جنوب میں سمندر۔ مختلف موسم۔ مہمان نواز لوگ۔ قومی زبان اردو۔ دارالحکومت اسلام آباد۔'", parts:["دو جملوں میں خلاصہ"], ans:["پاکستان ایک خوبصورت ملک ہے جس میں پہاڑ، سمندر اور مختلف موسم ہیں۔ لوگ مہمان نواز ہیں اور دارالحکومت اسلام آباد ہے۔"]}],
         wordProblems:["کسی عبارت کا خلاصہ دو جملوں میں لکھیں۔","خلاصے اور تشریح میں فرق بیان کریں۔","کسی نظم کی تشریح لکھیں — لفظی معنی اور مفہوم۔","ایک کہانی کا خلاصہ لکھیں — اہم واقعات شامل کریں۔","خلاصہ نویسی کے پانچ اصول لکھیں۔"],
         quiz:[{q:"خلاصہ:",a:["اصل سے لمبا","مختصر","اصل جتنا","کچھ بھی"],c:1},{q:"خلاصے میں:",a:["اپنی رائے","صرف اہم نکات","غیر ضروری","نئے خیالات"],c:1},{q:"پہلا قدم:",a:["لکھنا","مرکزی خیال نکالیں","نقل","سوالات"],c:1},{q:"تشریح میں:",a:["صرف خلاصہ","معنی + مفہوم + حوالہ","صرف ترجمہ","کچھ نہیں"],c:1},{q:"خلاصہ اصل کا:",a:["دگنا","برابر","ایک تہائی","دس گنا"],c:2},{q:"اپنے الفاظ:",a:["نقل کریں","ضروری ہے","غیر ضروری","کبھی نہیں"],c:1},{q:"فرق خلاصہ/تشریح:",a:["ایک ہیں","خلاصہ مختصر، تشریح تفصیلی","دونوں لمبے","کوئی فرق نہیں"],c:1},{q:"مرکزی خیال:",a:["پہلا لفظ","عبارت کا اہم پیغام","آخری جملہ","عنوان"],c:1}]
        }
      ] },
    ] : g === 4 ? [
      { title: "قواعد", content: "اسم، فعل، حرف — بنیادی اقسام۔", key: "qawaid" },
      { title: "نظم و نثر", content: "نظمیں، کہانیاں، افسانے۔", key: "nazm" },
      { title: "مضمون نویسی", content: "مضامین اور خطوط لکھنا۔", key: "mazmoon" },
    ] : g === 6 ? [
      { title: "قواعد", content: "اسم، فعل، حرف — بنیادی اقسام۔", key: "qawaid" },
      { title: "نظم و نثر", content: "نظمیں، کہانیاں، افسانے۔", key: "nazm" },
      { title: "مضمون نویسی", content: "مضامین اور خطوط لکھنا۔", key: "mazmoon" },
    ] : [
      { title: "ادب", content: (g === 7 ? "غزل کی ساخت" : g === 8 ? "آزاد اور پابند نظم" : g === 9 ? "داستان اور ناول" : "تنقید اور ادبی تحریک") + "۔", key: "adab" },
      { title: "خلاصہ و تشریح", content: "نظم و نثر کا خلاصہ اور تشریح۔ سمجھ کر لکھیں۔", key: "khulasa" },
      { title: "گرامر ایڈوانسڈ", content: (g === 7 ? "محاورے اور ضرب الامثال" : g === 8 ? "تذکیر و تانیث" : g === 9 ? "املا" : "ترجمہ") + "۔", key: "grammar_adv" },
    ],
  };
  return (L[subject] || []).map((l, i) => ({ ...l, id: subject + "_" + g + "_" + i }));
}

function getQuiz(subject, grade, lessonKey) {
  const pool = {
    math: { counting: [{ q: "What comes after 49?", a: ["50","51","48","59"], c: 0 },{ q: "Count by 2s: 2,4,6,__", a: ["7","8","9","10"], c: 1 },{ q: "Which is greater: 37 or 73?", a: ["37","73","Equal","Cannot tell"], c: 1 },{ q: "Place value of 5 in 253?", a: ["Ones","Tens","Hundreds","Thousands"], c: 1 }], add_sub: [{ q: "12 + 8 = ?", a: ["18","19","20","21"], c: 2 },{ q: "25 - 13 = ?", a: ["11","12","13","14"], c: 1 },{ q: "45 + 27 = ?", a: ["62","72","82","71"], c: 1 },{ q: "99 - 56 = ?", a: ["33","43","53","63"], c: 1 }], shapes: [{ q: "Sides of a triangle?", a: ["2","3","4","5"], c: 1 },{ q: "Shape of a clock?", a: ["Square","Circle","Triangle","Oval"], c: 1 },{ q: "Square has ___ equal sides", a: ["2","3","4","5"], c: 2 },{ q: "Next: ○ □ ○ □ ○ ?", a: ["○","□","△","⬡"], c: 1 }], fractions: [{ q: "½ + ½ = ?", a: ["½","1","2","¼"], c: 1 },{ q: "0.5 as fraction?", a: ["¼","½","¾","⅓"], c: 1 },{ q: "Larger: ¾ or ⅔?", a: ["¾","⅔","Equal","Cannot tell"], c: 0 },{ q: "Simplify 4/8", a: ["½","¼","⅔","¾"], c: 0 }], mult_div: [{ q: "6 × 7 = ?", a: ["36","42","48","56"], c: 1 },{ q: "72 ÷ 8 = ?", a: ["7","8","9","10"], c: 2 },{ q: "15 × 4 = ?", a: ["45","50","55","60"], c: 3 },{ q: "144 ÷ 12 = ?", a: ["10","11","12","13"], c: 2 }], geometry: [{ q: "Perimeter of square side 5cm?", a: ["15cm","20cm","25cm","10cm"], c: 1 },{ q: "Right angle = ___ degrees", a: ["45","60","90","180"], c: 2 },{ q: "Area of 6×4 rectangle?", a: ["10","20","24","28"], c: 2 },{ q: "Degrees in triangle?", a: ["90","180","270","360"], c: 1 }], algebra: [{ q: "x + 5 = 12, x = ?", a: ["5","6","7","8"], c: 2 },{ q: "3x = 18, x = ?", a: ["3","5","6","9"], c: 2 },{ q: "2(x+3) = ?", a: ["2x+3","2x+6","x+6","2x+5"], c: 1 },{ q: "x² when x=4?", a: ["8","12","16","20"], c: 2 }], geo_trig: [{ q: "Longest side in right triangle?", a: ["Base","Height","Hypotenuse","Median"], c: 2 },{ q: "Angles in quadrilateral?", a: ["180°","270°","360°","540°"], c: 2 },{ q: "sin(90°) = ?", a: ["0","0.5","1","undefined"], c: 2 },{ q: "a² + b² = ?", a: ["ab","c","c²","2c"], c: 2 }], stats: [{ q: "Mean of 2,4,6,8?", a: ["4","5","6","7"], c: 1 },{ q: "Median of 1,3,5,7,9?", a: ["3","5","7","9"], c: 1 },{ q: "Mode of 2,3,3,5,7?", a: ["2","3","5","7"], c: 1 },{ q: "Coin flip heads?", a: ["¼","⅓","½","1"], c: 2 }] },
    science: { living: [{ q: "Plant part making food?", a: ["Root","Stem","Leaf","Flower"], c: 2 },{ q: "Fish live in?", a: ["Trees","Desert","Water","Mountains"], c: 2 },{ q: "Plants need?", a: ["Water & sunlight","Only soil","Only air","Darkness"], c: 0 },{ q: "Caterpillar becomes?", a: ["Fish","Bird","Butterfly","Snake"], c: 2 }], body: [{ q: "How many senses?", a: ["3","4","5","6"], c: 2 },{ q: "Organ pumping blood?", a: ["Brain","Lungs","Heart","Liver"], c: 2 },{ q: "Bones protect?", a: ["Skin","Muscles","Organs","Hair"], c: 2 },{ q: "Food digested in?", a: ["Heart","Lungs","Stomach","Brain"], c: 2 }], weather: [{ q: "What causes rain?", a: ["Wind","Sun","Condensation","Snow"], c: 2 },{ q: "How many seasons?", a: ["2","3","4","5"], c: 2 },{ q: "Water vapor rising?", a: ["Condensation","Evaporation","Precipitation","Freezing"], c: 1 },{ q: "Measures temperature?", a: ["Barometer","Thermometer","Ruler","Clock"], c: 1 }], matter: [{ q: "Ice is ___ water", a: ["Solid","Liquid","Gas","Plasma"], c: 0 },{ q: "Boiling water becomes?", a: ["Ice","Steam","Oil","Juice"], c: 1 },{ q: "NOT a state of matter?", a: ["Solid","Energy","Liquid","Gas"], c: 1 },{ q: "Salt in water?", a: ["Mixture","Solution","Compound","Element"], c: 1 }], forces: [{ q: "Keeps us on ground?", a: ["Air","Gravity","Friction","Magnetism"], c: 1 },{ q: "Magnet attracts?", a: ["Wood","Plastic","Iron","Glass"], c: 2 },{ q: "Friction ___ motion", a: ["Increases","Slows down","No effect","Creates"], c: 1 },{ q: "Simple machine?", a: ["Computer","Lever","Car","Phone"], c: 1 }], earth: [{ q: "Closest to Sun?", a: ["Venus","Mercury","Earth","Mars"], c: 1 },{ q: "Earth rotates every?", a: ["12 hours","24 hours","7 days","365 days"], c: 1 },{ q: "Moon orbits Earth in?", a: ["1 day","1 week","~1 month","1 year"], c: 2 },{ q: "Earthquakes caused by?", a: ["Wind","Rain","Tectonic plates","Gravity"], c: 2 }], physics: [{ q: "Speed = Distance ÷ ?", a: ["Mass","Time","Force","Energy"], c: 1 },{ q: "Newton's 1st Law?", a: ["Gravity","Inertia","Acceleration","Energy"], c: 1 },{ q: "Sound fastest through?", a: ["Air","Water","Solid","Vacuum"], c: 2 },{ q: "Unit of force?", a: ["Joule","Watt","Newton","Pascal"], c: 2 }], chemistry: [{ q: "Smallest particle?", a: ["Cell","Molecule","Atom","Electron"], c: 2 },{ q: "H₂O is?", a: ["Oxygen","Hydrogen","Water","Salt"], c: 2 },{ q: "pH 7 is?", a: ["Acidic","Neutral","Basic","None"], c: 1 },{ q: "Rusting is ___ change", a: ["Physical","Chemical","Temporary","None"], c: 1 }], biology: [{ q: "Basic unit of life?", a: ["Atom","Cell","Tissue","Organ"], c: 1 },{ q: "DNA carries?", a: ["Blood","Oxygen","Genetic info","Food"], c: 2 },{ q: "Photosynthesis produces?", a: ["CO₂","Water","Oxygen","Nitrogen"], c: 2 },{ q: "Study of ecosystems?", a: ["Botany","Ecology","Zoology","Genetics"], c: 1 }] },
    english: { phonics: [{ q: "'SH' sound?", a: ["/s/","/sh/","/ch/","/th/"], c: 1 },{ q: "Rhymes with 'cat'?", a: ["Dog","Bat","Cup","Run"], c: 1 },{ q: "'CAKE' vowel sound?", a: ["Short","Long","Silent","None"], c: 1 },{ q: "Syllables in 'BANANA'?", a: ["1","2","3","4"], c: 2 }], writing: [{ q: "Sentence starts with?", a: ["Period","Capital letter","Comma","Small letter"], c: 1 },{ q: "Sentence ends with?", a: ["Capital","Comma","Period","Dash"], c: 2 },{ q: "Complete sentence?", a: ["Running fast.","The cat.","She runs fast.","Very big."], c: 2 },{ q: "Paragraph starts with?", a: ["Short","Long","Topic","Final"], c: 2 }], vocab: [{ q: "'Happy'/'Joyful' are?", a: ["Antonyms","Synonyms","Homonyms","None"], c: 1 },{ q: "Opposite of 'TALL'?", a: ["Big","Long","Short","Wide"], c: 2 },{ q: "'Sun'+'flower'=?", a: ["Sunrise","Sunday","Sunflower","Sunshine"], c: 2 },{ q: "'UN' in 'UNHAPPY'?", a: ["Suffix","Prefix","Root","Syllable"], c: 1 }], grammar: [{ q: "NOUN is?", a: ["Action word","Naming word","Describing word","Joining word"], c: 1 },{ q: "'She ___ to school daily'", a: ["go","goes","going","gone"], c: 1 },{ q: "Past tense of 'RUN'?", a: ["Runned","Ran","Running","Runs"], c: 1 },{ q: "'AND','BUT','OR' are?", a: ["Nouns","Verbs","Conjunctions","Adjectives"], c: 2 }], parts_of_speech: [{ q: "An ADVERB describes a?", a: ["Noun","Pronoun","Verb","Article"], c: 2 },{ q: "'Quickly' is which part of speech?", a: ["Noun","Adjective","Adverb","Verb"], c: 2 },{ q: "'She sang beautifully.' The adverb is?", a: ["She","sang","beautifully","none"], c: 2 },{ q: "Which is NOT an adverb?", a: ["Slowly","Happily","Beautiful","Carefully"], c: 2 }], reading: [{ q: "MAIN IDEA is?", a: ["First sentence","What it's mostly about","Last sentence","Title"], c: 1 },{ q: "Finding clues = ?", a: ["Summarizing","Inferring","Predicting","Scanning"], c: 1 },{ q: "Author's purpose?", a: ["Only entertain","Only inform","Inform/entertain/persuade","Only persuade"], c: 2 },{ q: "SUMMARY should be?", a: ["Longer","Same length","Shorter","Questions"], c: 2 }], creative: [{ q: "Beginning, ___, end", a: ["Top","Side","Middle","Bottom"], c: 2 },{ q: "'Sun smiled down'?", a: ["Simile","Metaphor","Personification","Alliteration"], c: 2 },{ q: "'Brave as a lion'?", a: ["Simile","Metaphor","Hyperbole","Idiom"], c: 0 },{ q: "Persuasive writing?", a: ["Describe","Narrate","Convince","Entertain"], c: 2 }], literature: [{ q: "THEME is?", a: ["Setting","Message","Characters","Plot"], c: 1 },{ q: "Using 'like'/'as'?", a: ["Metaphor","Simile","Idiom","Irony"], c: 1 },{ q: "Tells the story?", a: ["Author","Narrator","Character","Reader"], c: 1 },{ q: "Sequence of events?", a: ["Theme","Setting","Plot","Mood"], c: 2 }], essay: [{ q: "Intro should have?", a: ["Conclusion","Thesis statement","Bibliography","Summary"], c: 1 },{ q: "Basic essay paragraphs?", a: ["3","4","5","6"], c: 2 },{ q: "Body paragraphs need?", a: ["Only opinions","Evidence & examples","Only quotes","Questions"], c: 1 },{ q: "Thesis statement is?", a: ["Question","Main argument","Summary","Fact"], c: 1 }], comm: [{ q: "Public speaking needs?", a: ["Mumbling","Eye contact","Looking down","Rushing"], c: 1 },{ q: "In debate you must?", a: ["Yell","Support with evidence","Ignore","Only ask"], c: 1 },{ q: "Formal language in?", a: ["Friend texts","Business emails","Social media","Diary"], c: 1 },{ q: "Active listening?", a: ["Interrupting","Ignoring","Full attention","Multitasking"], c: 2 }] },
    social: { community: [{ q: "Community is?", a: ["Live alone","Live & work together","Never meet","Only play"], c: 1 },{ q: "Fire helper?", a: ["Teacher","Doctor","Firefighter","Chef"], c: 2 },{ q: "Maps help find?", a: ["Time","Directions","Weather","Food"], c: 1 },{ q: "Neighborhood is part of?", a: ["Country","City","Planet","School"], c: 1 }], pakistan: [{ q: "Pakistan flag colors?", a: ["Red & Blue","Green & White","Yellow & Green","White & Blue"], c: 1 },{ q: "Capital of Pakistan?", a: ["Karachi","Lahore","Islamabad","Peshawar"], c: 2 },{ q: "Independence year?", a: ["1945","1946","1947","1948"], c: 2 },{ q: "Provinces count?", a: ["3","4","5","6"], c: 1 }], citizen: [{ q: "Rules keep us?", a: ["Bored","Safe","Tired","Lost"], c: 1 },{ q: "Recycling helps?", a: ["School","Environment","Traffic","Weather"], c: 1 },{ q: "Child's right?", a: ["Education","Driving","Voting","Working"], c: 0 },{ q: "Respecting others?", a: ["Ignoring","Being kind","Being loud","Leaving"], c: 1 }], history: [{ q: "Mohenjo-daro is in?", a: ["India","Pakistan","Iran","Afghanistan"], c: 1 },{ q: "Mughal founder?", a: ["Akbar","Babur","Shah Jahan","Aurangzeb"], c: 1 },{ q: "British rule lasted?", a: ["50 years","100 years","200 years","300 years"], c: 2 },{ q: "Indus Valley known for?", a: ["Pyramids","Planned cities","Castles","Temples"], c: 1 }], geography: [{ q: "Continents count?", a: ["5","6","7","8"], c: 2 },{ q: "Largest ocean?", a: ["Atlantic","Indian","Pacific","Arctic"], c: 2 },{ q: "K2 is ___ highest", a: ["1st","2nd","3rd","4th"], c: 1 },{ q: "Equator divides?", a: ["East & West","North & South","Land & Sea","Day & Night"], c: 1 }], civics: [{ q: "Democracy = rule by?", a: ["King","Army","People","Rich"], c: 2 },{ q: "Elections for?", a: ["Celebrate","Choose leaders","Count people","Collect taxes"], c: 1 },{ q: "Constitution is ___ law", a: ["Lowest","Oldest","Supreme","Weakest"], c: 2 },{ q: "Rights protect?", a: ["Pets","Toys","Freedoms","Money"], c: 2 }], world_hist: [{ q: "Renaissance began in?", a: ["France","England","Italy","Spain"], c: 2 },{ q: "Industrial Revolution in?", a: ["USA","Britain","France","Germany"], c: 1 },{ q: "WWII ended?", a: ["1943","1944","1945","1946"], c: 2 },{ q: "Cold War between?", a: ["UK & France","USA & USSR","China & Japan","India & Pakistan"], c: 1 }], pak_studies: [{ q: "Quaid-e-Azam's name?", a: ["Allama Iqbal","Liaquat Ali Khan","Muhammad Ali Jinnah","Sir Syed"], c: 2 },{ q: "Pakistan Resolution?", a: ["1935","1940","1945","1947"], c: 1 },{ q: "First Constitution?", a: ["1947","1949","1956","1962"], c: 2 },{ q: "Largest province?", a: ["Punjab","Sindh","Balochistan","KPK"], c: 2 }], current: [{ q: "UN stands for?", a: ["United Nations","Universal Network","Union of Nations","United North"], c: 0 },{ q: "SDG goals count?", a: ["10","12","15","17"], c: 3 },{ q: "Globalization connects?", a: ["Only rich","Whole world","Only Asia","Only Europe"], c: 1 },{ q: "Climate change by?", a: ["Trees","Greenhouse gases","Rain","Wind"], c: 1 }] },
    urdu: { huroof: [{ q: "اردو حروف تہجی؟", a: ["32","36","38","40"], c: 2 },{ q: "پہلا حرف؟", a: ["ب","الف","پ","ت"], c: 1 },{ q: "'ک' کے بعد؟", a: ["ق","گ","ل","م"], c: 1 },{ q: "نقطے والے حروف؟", a: ["الف، د","ب، ت، پ","الف، و","د، ر"], c: 1 }], reading_ur: [{ q: "'کتاب' میں حرف؟", a: ["3","4","5","6"], c: 1 },{ q: "'پاکستان' پہلا حرف؟", a: ["الف","ب","پ","ت"], c: 2 },{ q: "نظم میں ___ ہوتا ہے", a: ["حساب","قافیہ","نقشہ","حروف"], c: 1 },{ q: "'سکول' انگریزی میں؟", a: ["Home","School","Park","Shop"], c: 1 }], writing_ur: [{ q: "اردو لکھنے کی سمت؟", a: ["بائیں سے دائیں","دائیں سے بائیں","اوپر سے نیچے","نیچے سے اوپر"], c: 1 },{ q: "جملے کے آخر میں؟", a: ["سوالیہ نشان","وقفہ","کاما","ڈیش"], c: 1 },{ q: "نستعلیق ایک ___؟", a: ["زبان","خط","کتاب","شہر"], c: 1 },{ q: "خوشخطی = ?", a: ["تیز لکھنا","خوبصورت لکھنا","بڑا لکھنا","چھوٹا لکھنا"], c: 1 }], qawaid: [{ q: "اسم کی تعریف؟", a: ["کام","چیز کا نام","صفت","فعل"], c: 1 },{ q: "'دوڑنا' کون سا لفظ؟", a: ["اسم","فعل","حرف","صفت"], c: 1 },{ q: "ماضی = ?", a: ["آنے والا وقت","گزرا ہوا وقت","موجودہ وقت","کوئی نہیں"], c: 1 },{ q: "فعلیہ جملہ شروع؟", a: ["اسم","فعل","حرف","صفت"], c: 1 }], nazm: [{ q: "علامہ اقبال = ?", a: ["قائداعظم","شاعر مشرق","بابائے قوم","مفکر"], c: 1 },{ q: "نظم/نثر فرق؟", a: ["کوئی نہیں","قافیہ و وزن","لمبائی","زبان"], c: 1 },{ q: "کہانی میں؟", a: ["صرف الفاظ","کردار و واقعات","اعداد","سوالات"], c: 1 },{ q: "افسانہ = ?", a: ["نظم","مختصر کہانی","خط","مضمون"], c: 1 }], mazmoon: [{ q: "مضمون آغاز؟", a: ["اختتام","تعارف","نتیجہ","فہرست"], c: 1 },{ q: "خط شروع میں؟", a: ["خیرباد","نام مرسل","سلام","تاریخ"], c: 2 },{ q: "رسمی خط کسے؟", a: ["دوست","عہدیدار","بچے","خود"], c: 1 },{ q: "مضمون میں ضروری؟", a: ["تصاویر","دلائل و مثالیں","گانے","کھیل"], c: 1 }], adab: [{ q: "شعر میں مصرعے؟", a: ["1","2","3","4"], c: 1 },{ q: "مطلع = ?", a: ["آخری","پہلا","درمیانی","کوئی بھی"], c: 1 },{ q: "آزاد نظم میں نہیں؟", a: ["خیال","پابند وزن","الفاظ","معنی"], c: 1 },{ q: "داستان = ?", a: ["مختصر","طویل","حقیقی","سائنسی"], c: 1 }], khulasa: [{ q: "خلاصہ ___؟", a: ["اصل سے لمبا","مختصر","جتنا","مختلف"], c: 1 },{ q: "تشریح = ?", a: ["صرف الفاظ","معنی و مفہوم","قافیے","نام"], c: 1 },{ q: "مرکزی خیال = ?", a: ["پہلا جملہ","اہم پیغام","آخری لفظ","عنوان"], c: 1 },{ q: "تقابلی جائزہ = ?", a: ["نقل","موازنہ","ترجمہ","حذف"], c: 1 }], grammar_adv: [{ q: "'نو دو گیارہ' = ?", a: ["ضرب المثل","محاورہ","مصرع","لفظ"], c: 1 },{ q: "تذکیر = ?", a: ["مونث","مذکر","جمع","واحد"], c: 1 },{ q: "'لڑکا' جمع؟", a: ["لڑکے","لڑکیاں","لڑکوں","لڑکی"], c: 0 },{ q: "ترجمہ = ?", a: ["نقل","ایک زبان سے دوسری","خلاصہ","تبصرہ"], c: 1 }] },
  };
  return pool[subject]?.[lessonKey] || pool[subject]?.[Object.keys(pool[subject])[0]] || [];
}

// ─── Math SVG Visual Components ───
function PlaceValueChart({ number }) {
  const s = String(number).replace(/,/g,"");
  const places = ["Ones","Tens","Hundreds","Thousands","Ten-Th","Hund-Th","Millions","Ten-M","Hund-M","Billions"];
  const colors = ["#38BDF8","#22C55E","#F59E0B","#EF4444","#A855F7","#EC4899","#14B8A6","#F97316","#6366F1","#D946EF"];
  const digits = s.split("").reverse();
  const w = Math.max(digits.length * 90 + 40, 340);
  return (<div className="math-svg"><svg viewBox={`0 0 ${w} 160`} xmlns="http://www.w3.org/2000/svg">
    <rect width={w} height="160" rx="12" fill="#1E293B"/>
    {digits.map((d, i) => {
      const x = w - 70 - i * 90;
      return (<g key={i}>
        <rect x={x} y="15" width="70" height="55" rx="10" fill={colors[i%10]} opacity="0.2" stroke={colors[i%10]} strokeWidth="2"/>
        <text x={x+35} y="54" textAnchor="middle" fill={colors[i%10]} fontSize="32" fontWeight="800" fontFamily="'Baloo 2'">{d}</text>
        <text x={x+35} y="100" textAnchor="middle" fill={colors[i%10]} fontSize="13" fontWeight="700" fontFamily="'Baloo 2'">{places[i] || ""}</text>
        <text x={x+35} y="130" textAnchor="middle" fill="#94A3B8" fontSize="12" fontFamily="'Baloo 2'">{d !== "0" ? d + new Array(i).fill("0").join("") : "0"}</text>
      </g>);
    })}
  </svg></div>);
}

function ExpandedFormSVG({ number, parts }) {
  const w = Math.max(parts.length * 120 + 60, 380);
  const colors = ["#EF4444","#F59E0B","#22C55E","#38BDF8","#A855F7","#EC4899","#14B8A6"];
  return (<div className="math-svg"><svg viewBox={`0 0 ${w} 120`} xmlns="http://www.w3.org/2000/svg">
    <rect width={w} height="120" rx="12" fill="#1E293B"/>
    <text x={w/2} y="34" textAnchor="middle" fill="#F1F5F9" fontSize="24" fontWeight="800" fontFamily="'Baloo 2'">{number}</text>
    <text x={w/2} y="58" textAnchor="middle" fill="#64748B" fontSize="18" fontFamily="'Baloo 2'">=</text>
    {parts.map((p, i) => {
      const x = 30 + i * 120;
      return (<g key={i}>
        <rect x={x} y="68" width="100" height="38" rx="10" fill={colors[i%7]} opacity="0.15" stroke={colors[i%7]} strokeWidth="2"/>
        <text x={x+50} y="93" textAnchor="middle" fill={colors[i%7]} fontSize="16" fontWeight="700" fontFamily="'Baloo 2'">{p}</text>
        {i < parts.length - 1 && <text x={x+112} y="93" textAnchor="middle" fill="#64748B" fontSize="20" fontWeight="800">+</text>}
      </g>);
    })}
  </svg></div>);
}

function NumberLineSVG({ min, max, marks, highlight }) {
  const w = 620, h = 90, pad = 50;
  const lineW = w - pad * 2;
  const getX = (v) => pad + ((v - min) / (max - min)) * lineW;
  return (<div className="math-svg"><svg viewBox={`0 0 ${w} ${h}`} xmlns="http://www.w3.org/2000/svg">
    <rect width={w} height={h} rx="12" fill="#1E293B"/>
    <line x1={pad} y1="48" x2={w-pad} y2="48" stroke="#475569" strokeWidth="3" strokeLinecap="round"/>
    <polygon points={`${pad-8},48 ${pad},42 ${pad},54`} fill="#475569"/>
    <polygon points={`${w-pad+8},48 ${w-pad},42 ${w-pad},54`} fill="#475569"/>
    {marks.map((m, i) => {
      const x = getX(m);
      const isHl = highlight && highlight.includes(m);
      return (<g key={i}>
        <line x1={x} y1="40" x2={x} y2="56" stroke={isHl ? "#F59E0B" : "#94A3B8"} strokeWidth={isHl ? 3 : 2}/>
        <text x={x} y={isHl ? 28 : 75} textAnchor="middle" fill={isHl ? "#F59E0B" : "#94A3B8"} fontSize={isHl ? "15" : "13"} fontWeight={isHl ? "800" : "600"} fontFamily="'Baloo 2'">{m.toLocaleString()}</text>
        {isHl && <circle cx={x} cy="48" r="6" fill="#F59E0B"/>}
      </g>);
    })}
  </svg></div>);
}

function CompareBarsSVG({ num1, num2, label1, label2 }) {
  const mx = Math.max(num1, num2);
  const w1 = (num1 / mx) * 320, w2 = (num2 / mx) * 320;
  const sym = num1 > num2 ? ">" : num1 < num2 ? "<" : "=";
  const symWord = num1 > num2 ? "Greater than" : num1 < num2 ? "Less than" : "Equal to";
  const col1 = num1 >= num2 ? "#22C55E" : "#EF4444", col2 = num2 >= num1 ? "#22C55E" : "#EF4444";
  return (<div className="math-svg"><svg viewBox="0 0 600 120" xmlns="http://www.w3.org/2000/svg">
    <rect width="600" height="120" rx="12" fill="#1E293B"/>
    <rect x="90" y="15" width={w1} height="30" rx="8" fill={col1} opacity="0.7"/>
    <text x="10" y="38" fill="#F1F5F9" fontSize="16" fontWeight="700" fontFamily="'Baloo 2'">{label1 || num1.toLocaleString()}</text>
    <text x={96 + w1} y="38" fill={col1} fontSize="14" fontWeight="700" fontFamily="'Baloo 2'">{num1.toLocaleString()}</text>
    <rect x="90" y="60" width={w2} height="30" rx="8" fill={col2} opacity="0.7"/>
    <text x="10" y="83" fill="#F1F5F9" fontSize="16" fontWeight="700" fontFamily="'Baloo 2'">{label2 || num2.toLocaleString()}</text>
    <text x={96 + w2} y="83" fill={col2} fontSize="14" fontWeight="700" fontFamily="'Baloo 2'">{num2.toLocaleString()}</text>
    <line x1="440" y1="20" x2="440" y2="100" stroke="#334155" strokeWidth="1" strokeDasharray="4"/>
    <text x="530" y="55" textAnchor="middle" fill="#F59E0B" fontSize="36" fontWeight="900" fontFamily="'Baloo 2'">{sym}</text>
    <text x="530" y="85" textAnchor="middle" fill="#F59E0B" fontSize="12" fontWeight="700" fontFamily="'Baloo 2'">{symWord}</text>
  </svg></div>);
}

function CompareTripleSVG() {
  return (<>
    <CompareBarsSVG num1={5432} num2={4999} />
    <CompareBarsSVG num1={3210} num2={4567} />
    <CompareBarsSVG num1={5678} num2={5678} />
  </>);
}

function RoundingSVG({ number, place, result, direction }) {
  const col = direction === "up" ? "#22C55E" : "#F59E0B";
  return (<div className="math-svg"><svg viewBox="0 0 520 110" xmlns="http://www.w3.org/2000/svg">
    <rect width="520" height="110" rx="12" fill="#1E293B"/>
    <rect x="15" y="18" width="140" height="70" rx="12" fill="#38BDF822" stroke="#38BDF8" strokeWidth="2"/>
    <text x="85" y="44" textAnchor="middle" fill="#38BDF8" fontSize="13" fontWeight="700" fontFamily="'Baloo 2'">Original</text>
    <text x="85" y="72" textAnchor="middle" fill="#F1F5F9" fontSize="24" fontWeight="800" fontFamily="'Baloo 2'">{number.toLocaleString()}</text>
    <line x1="165" y1="53" x2="220" y2="53" stroke={col} strokeWidth="3" strokeLinecap="round"/>
    <polygon points={direction==="up"?"220,48 230,53 220,58":"220,48 230,53 220,58"} fill={col}/>
    <rect x="240" y="18" width="130" height="36" rx="10" fill={col+"22"} stroke={col} strokeWidth="2"/>
    <text x="305" y="42" textAnchor="middle" fill={col} fontSize="15" fontWeight="800" fontFamily="'Baloo 2'">Round {direction === "up" ? "↑ UP" : "↓ DOWN"}</text>
    <text x="305" y="76" textAnchor="middle" fill="#94A3B8" fontSize="13" fontFamily="'Baloo 2'">nearest {place}</text>
    <line x1="380" y1="53" x2="420" y2="53" stroke="#A855F7" strokeWidth="3" strokeLinecap="round"/>
    <polygon points="420,48 430,53 420,58" fill="#A855F7"/>
    <rect x="440" y="18" width="65" height="70" rx="12" fill="#A855F722" stroke="#A855F7" strokeWidth="2"/>
    <text x="472" y="44" textAnchor="middle" fill="#A855F7" fontSize="13" fontWeight="700" fontFamily="'Baloo 2'">Result</text>
    <text x="472" y="72" textAnchor="middle" fill="#F1F5F9" fontSize="22" fontWeight="800" fontFamily="'Baloo 2'">{result.toLocaleString()}</text>
  </svg></div>);
}

function RoundingDualSVG() {
  return (<>
    <RoundingSVG number={4567} place="100" result={4600} direction="up" />
    <RoundingSVG number={3421} place="100" result={3400} direction="down" />
  </>);
}

function StatesOfMatterSVG() {
  const [clickedBox, setClickedBox] = React.useState(null);
  
  const handleBoxClick = (label) => {
    setClickedBox(label);
    setTimeout(() => setClickedBox(null), 200);
    
    // TTS
    const utterance = new SpeechSynthesisUtterance(label);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    speechSynthesis.speak(utterance);
  };
  
  const states = [
    {label:"Solid",emoji:"🧊",desc:"Fixed shape & volume",col:"#38BDF8",note:"Tightly packed",dots:[[95,85],[105,85],[100,95],[95,105],[105,105],[100,75],[110,80],[90,100]]},
    {label:"Liquid",emoji:"💧",desc:"Fixed volume, takes shape",col:"#22C55E",note:"Loosely arranged",dots:[[280,75],[295,75],[288,90],[280,105],[295,105],[288,120],[275,85],[300,95]]},
    {label:"Gas",emoji:"💨",desc:"Fills all space",col:"#F59E0B",note:"Far apart, fast-moving",dots:[[425,50],[575,65],[440,95],[570,125],[455,150],[580,170],[430,185],[565,75]]}
  ];
  return (<div className="math-svg" style={{maxWidth:"1000px"}}><svg viewBox="0 0 600 215" xmlns="http://www.w3.org/2000/svg">
    <rect width="600" height="215" rx="12" fill="#1E293B"/>
    <text x="300" y="20" textAnchor="middle" fill="#94A3B8" fontSize="16" fontWeight="700" fontFamily="'Baloo 2'">⚗️ Three States of Matter</text>
    {states.map((s,i) => {
      const bx = i===0?10:i===1?210:410;
      return (<g key={i}>
        <rect x={bx} y="30" width="180" height="170" rx="12" fill={clickedBox === s.label ? s.col+"40" : s.col+"18"} stroke={s.col} strokeWidth={clickedBox === s.label ? "3" : "2"}/>
        <text x={bx+90} y="58" textAnchor="middle" fill={s.col} fontSize="19" fontWeight="800" fontFamily="'Baloo 2'">{s.emoji} {s.label}</text>
        {s.dots.map((d,j) => <circle key={j} cx={d[0]} cy={d[1]} r="9" fill={s.col} opacity="0.75"/>)}
        <text x={bx+90} y="168" textAnchor="middle" fill="#E2E8F0" fontSize="14" fontWeight="700" fontFamily="'Baloo 2'">{s.desc}</text>
        <text x={bx+90} y="186" textAnchor="middle" fill="#64748B" fontSize="12" fontFamily="'Baloo 2'">{s.note}</text>
      </g>);
    })}
    <text x="200" y="118" textAnchor="middle" fill="#F59E0B" fontSize="32" fontWeight="800">→</text>
    <text x="200" y="138" textAnchor="middle" fill="#94A3B8" fontSize="13" fontFamily="'Baloo 2'">+Heat</text>
    <text x="400" y="118" textAnchor="middle" fill="#F59E0B" fontSize="32" fontWeight="800">→</text>
    <text x="400" y="138" textAnchor="middle" fill="#94A3B8" fontSize="13" fontFamily="'Baloo 2'">+Heat</text>
  </svg></div>);
}

function FoodChainSVG() {
  const items = [
    {emoji:"☀️",label:"Sun",sub:"Energy source",col:"#F59E0B"},
    {emoji:"🌿",label:"Producer",sub:"Makes own food",col:"#22C55E"},
    {emoji:"🐰",label:"Herbivore",sub:"Eats plants",col:"#38BDF8"},
    {emoji:"🦊",label:"Carnivore",sub:"Eats animals",col:"#EF4444"},
    {emoji:"🦅",label:"Top Predator",sub:"Apex of chain",col:"#A855F7"}
  ];
  return (<div className="math-svg" style={{maxWidth:"1000px"}}><svg viewBox="0 0 600 165" xmlns="http://www.w3.org/2000/svg">
    <rect width="600" height="165" rx="12" fill="#1E293B"/>
    <text x="300" y="19" textAnchor="middle" fill="#94A3B8" fontSize="16" fontWeight="700" fontFamily="'Baloo 2'">🌱 Food Chain — Energy Flow</text>
    {items.map((it,i) => {
      const x = 15 + i * 118;
      return (<g key={i}>
        <rect x={x} y="28" width="106" height="125" rx="11" fill={it.col+"18"} stroke={it.col} strokeWidth="2"/>
        <text x={x+53} y="75" textAnchor="middle" fontSize="42">{it.emoji}</text>
        <text x={x+53} y="100" textAnchor="middle" fill={it.col} fontSize="15" fontWeight="700" fontFamily="'Baloo 2'">{it.label}</text>
        <text x={x+53} y="118" textAnchor="middle" fill="#94A3B8" fontSize="12.5" fontFamily="'Baloo 2'">{it.sub}</text>
        <text x={x+53} y="143" textAnchor="middle" fill="#475569" fontSize="11" fontFamily="'Baloo 2'">{["Primary","Secondary","Tertiary","",""][i]||""}</text>
        {i<4 && <text x={x+115} y="94" fill="#F59E0B" fontSize="28" fontWeight="800">→</text>}
      </g>);
    })}
  </svg></div>);
}

function SolarSystemSVG() {
  const planets = [
    {l:"Mercury",d:28,c:"#94A3B8",r:5,n:"1st"},
    {l:"Venus",d:52,c:"#F59E0B",r:7,n:"2nd"},
    {l:"Earth",d:78,c:"#38BDF8",r:7,n:"3rd"},
    {l:"Mars",d:104,c:"#EF4444",r:6,n:"4th"},
    {l:"Jupiter",d:140,c:"#F97316",r:13,n:"5th"},
    {l:"Saturn",d:174,c:"#E2C044",r:11,n:"6th"},
    {l:"Uranus",d:202,c:"#14B8A6",r:9,n:"7th"},
    {l:"Neptune",d:226,c:"#6366F1",r:9,n:"8th"}
  ];
  return (<div className="math-svg" style={{maxWidth:"1100px"}}><svg viewBox="0 0 700 210" xmlns="http://www.w3.org/2000/svg">
    <rect width="700" height="210" rx="12" fill="#0F172A"/>
    <text x="350" y="18" textAnchor="middle" fill="#94A3B8" fontSize="13" fontWeight="700" fontFamily="'Baloo 2'">🪐 Our Solar System — 8 Planets</text>
    {[[80,40],[180,25],[260,45],[370,20],[450,42],[540,28],[630,42],[50,160],[150,170],[280,155],[380,168],[480,162],[590,170],[660,155]].map((s,i) => (
      <circle key={i} cx={s[0]} cy={s[1]} r="1.5" fill="white" opacity="0.4"/>
    ))}
    <circle cx="36" cy="115" r="30" fill="#F59E0B" opacity="0.85"/>
    <text x="36" y="121" textAnchor="middle" fontSize="20">☀️</text>
    <text x="36" y="158" textAnchor="middle" fill="#F59E0B" fontSize="10" fontWeight="700" fontFamily="'Baloo 2'">Sun</text>
    {planets.map((p,i) => {
      const cx = 70 + p.d * 2.7;
      return (<g key={i}>
        <circle cx={cx} cy="115" r={p.r} fill={p.c} opacity="0.9"/>
        {p.l==="Saturn" && <ellipse cx={cx} cy="115" rx={p.r+8} ry="3.5" fill="none" stroke="#E2C044" strokeWidth="2" opacity="0.75"/>}
        <line x1={cx} y1={115+p.r+3} x2={cx} y2="162" stroke={p.c} strokeWidth="0.8" opacity="0.4"/>
        <text x={cx} y="172" textAnchor="middle" fill={p.c} fontSize="9.5" fontWeight="700" fontFamily="'Baloo 2'">{p.l}</text>
        <text x={cx} y="185" textAnchor="middle" fill="#475569" fontSize="8.5" fontFamily="'Baloo 2'">{p.n}</text>
      </g>);
    })}
    <text x="185" y="200" textAnchor="middle" fill="#475569" fontSize="9" fontFamily="'Baloo 2'">← Rocky inner planets →</text>
    <text x="510" y="200" textAnchor="middle" fill="#475569" fontSize="9" fontFamily="'Baloo 2'">← Gas giant outer planets →</text>
  </svg></div>);
}

function EarthLayersSVG() {
  return (<div className="math-svg" style={{maxWidth:"1050px"}}><svg viewBox="0 0 560 320" xmlns="http://www.w3.org/2000/svg">
    <rect width="560" height="320" rx="12" fill="#1E293B"/>
    <text x="280" y="22" textAnchor="middle" fill="#94A3B8" fontSize="13" fontWeight="700" fontFamily="'Baloo 2'">🌍 Earth's Internal Layers</text>
    <circle cx="210" cy="175" r="130" fill="#38BDF825" stroke="#38BDF8" strokeWidth="2"/>
    <circle cx="210" cy="175" r="100" fill="#F59E0B22" stroke="#F59E0B" strokeWidth="2"/>
    <circle cx="210" cy="175" r="62" fill="#EF444432" stroke="#EF4444" strokeWidth="2"/>
    <circle cx="210" cy="175" r="30" fill="#F9731670" stroke="#F97316" strokeWidth="2.5"/>
    <text x="210" y="172" textAnchor="middle" fill="#F1F5F9" fontSize="8.5" fontWeight="800" fontFamily="'Baloo 2'">Inner</text>
    <text x="210" y="182" textAnchor="middle" fill="#F1F5F9" fontSize="8.5" fontWeight="800" fontFamily="'Baloo 2'">Core</text>
    <line x1="318" y1="92" x2="390" y2="92" stroke="#38BDF8" strokeWidth="1" strokeDasharray="4" opacity="0.6"/>
    <rect x="392" y="62" width="152" height="50" rx="8" fill="#38BDF812" stroke="#38BDF8" strokeWidth="1"/>
    <text x="468" y="80" textAnchor="middle" fill="#38BDF8" fontSize="12" fontWeight="800" fontFamily="'Baloo 2'">Crust</text>
    <text x="468" y="94" textAnchor="middle" fill="#94A3B8" fontSize="10" fontFamily="'Baloo 2'">5–70 km thick</text>
    <text x="468" y="106" textAnchor="middle" fill="#64748B" fontSize="9.5" fontFamily="'Baloo 2'">Thin outer shell</text>
    <line x1="292" y1="150" x2="390" y2="150" stroke="#F59E0B" strokeWidth="1" strokeDasharray="4" opacity="0.6"/>
    <rect x="392" y="122" width="152" height="50" rx="8" fill="#F59E0B12" stroke="#F59E0B" strokeWidth="1"/>
    <text x="468" y="140" textAnchor="middle" fill="#F59E0B" fontSize="12" fontWeight="800" fontFamily="'Baloo 2'">Mantle</text>
    <text x="468" y="154" textAnchor="middle" fill="#94A3B8" fontSize="10" fontFamily="'Baloo 2'">~2,900 km thick</text>
    <text x="468" y="166" textAnchor="middle" fill="#64748B" fontSize="9.5" fontFamily="'Baloo 2'">Hot semi-solid rock</text>
    <line x1="258" y1="205" x2="390" y2="205" stroke="#EF4444" strokeWidth="1" strokeDasharray="4" opacity="0.6"/>
    <rect x="392" y="182" width="152" height="50" rx="8" fill="#EF444412" stroke="#EF4444" strokeWidth="1"/>
    <text x="468" y="200" textAnchor="middle" fill="#EF4444" fontSize="12" fontWeight="800" fontFamily="'Baloo 2'">Outer Core</text>
    <text x="468" y="214" textAnchor="middle" fill="#94A3B8" fontSize="10" fontFamily="'Baloo 2'">Liquid iron + nickel</text>
    <text x="468" y="226" textAnchor="middle" fill="#64748B" fontSize="9.5" fontFamily="'Baloo 2'">Creates magnetic field</text>
    <line x1="236" y1="175" x2="390" y2="266" stroke="#F97316" strokeWidth="1" strokeDasharray="4" opacity="0.6"/>
    <rect x="392" y="242" width="152" height="50" rx="8" fill="#F9731618" stroke="#F97316" strokeWidth="1"/>
    <text x="468" y="260" textAnchor="middle" fill="#F97316" fontSize="12" fontWeight="800" fontFamily="'Baloo 2'">Inner Core</text>
    <text x="468" y="274" textAnchor="middle" fill="#94A3B8" fontSize="10" fontFamily="'Baloo 2'">Solid iron + nickel</text>
    <text x="468" y="286" textAnchor="middle" fill="#64748B" fontSize="9.5" fontFamily="'Baloo 2'">~5,500°C</text>
  </svg></div>);
}

function BodySystemSVG({ system }) {
  const [clickedBox, setClickedBox] = React.useState(null);
  
  const handleBoxClick = (part) => {
    setClickedBox(part);
    setTimeout(() => setClickedBox(null), 200);
    
    // TTS
    const utterance = new SpeechSynthesisUtterance(part);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    speechSynthesis.speak(utterance);
  };
  
  const data = {
    digestive: {
      title:"🍽️ Digestive System",
      parts:["Mouth","Esophagus","Stomach","Small Intestine","Large Intestine"],
      cols:["#38BDF8","#22C55E","#F59E0B","#A855F7","#EC4899"],
      descs:["Chew + saliva","Pushes food down","Acid breaks food","Absorbs nutrients","Absorbs water"]
    },
    respiratory: {
      title:"🫁 Respiratory System",
      parts:["Nose/Mouth","Trachea","Bronchi","Lungs","Alveoli"],
      cols:["#38BDF8","#22C55E","#F59E0B","#EF4444","#A855F7"],
      descs:["Filters + warms air","Windpipe","Splits to each lung","Gas exchange","O₂ into blood"]
    },
    circulatory: {
      title:"❤️ Circulatory System",
      parts:["Heart","Arteries","Capillaries","Veins","Heart"],
      cols:["#EF4444","#F59E0B","#EC4899","#38BDF8","#EF4444"],
      descs:["Pumps blood","Carry blood away","Exchange O₂/CO₂","Return to heart","Cycle repeats"]
    }
  };
  const d = data[system]; if(!d) return null;
  
  const illustrations = {
    digestive: {
      url: "img/digestive-system.jpg",
      desc: "Mouth → Esophagus → Stomach → Small Intestine → Large Intestine"
    },
    respiratory: {
      urls: ["img/respiratory-system.png", "img/respiration-process-2-1.jpg"],
      desc: "Nose → Trachea → Bronchi → Lungs → Alveoli (gas exchange)"
    },
    circulatory: {
      urls: ["img/human-circulatory-system.jpg", "img/human-circulatory-system-detail.jpg"],
      desc: "Heart → Arteries → Capillaries → Veins → Back to Heart"
    }
  };
  
  const illust = illustrations[system];
  
  return (
    <div>
      <div className="math-svg" style={{maxWidth:"1000px"}}><svg viewBox="0 0 630 170" xmlns="http://www.w3.org/2000/svg">
    <rect width="630" height="170" rx="12" fill="#1E293B"/>
    <text x="315" y="20" textAnchor="middle" fill="#94A3B8" fontSize="13" fontWeight="700" fontFamily="'Baloo 2'">{d.title}</text>
    {d.parts.map((p,i) => {
      const x = 12 + i * 122;
      const isClicked = clickedBox === p;
      return (<g key={i} onClick={() => handleBoxClick(p)} style={{cursor: 'pointer'}}>
        <rect x={x} y="30" width="106" height="128" rx="10" fill={d.cols[i]+"22"} stroke={d.cols[i]} strokeWidth="1.8" style={{transform: isClicked ? 'scale(0.95)' : 'scale(1)', transformOrigin: `${x+53}px 94px`, transition: 'transform 0.1s ease-out'}}/>
        <g style={{transform: isClicked ? 'scale(0.95)' : 'scale(1)', transformOrigin: `${x+53}px 68px`, transition: 'transform 0.1s ease-out'}}>
          <text x={x+53} y="68" textAnchor="middle" fill={d.cols[i]} fontSize="28" fontWeight="900" fontFamily="'Baloo 2'">{i+1}</text>
        </g>
        <g style={{transform: isClicked ? 'scale(0.95)' : 'scale(1)', transformOrigin: `${x+53}px 92px`, transition: 'transform 0.1s ease-out'}}>
          <text x={x+53} y="92" textAnchor="middle" fill={d.cols[i]} fontSize="13" fontWeight="700" fontFamily="'Baloo 2'">{p}</text>
        </g>
        <line x1={x+10} y1="100" x2={x+96} y2="100" stroke={d.cols[i]+"40"} strokeWidth="1"/>
        <text x={x+53} y="116" textAnchor="middle" fill="#94A3B8" fontSize="10" fontFamily="'Baloo 2'">{d.descs[i]}</text>
        {i<4 && <text x={x+114} y="94" fill="#F59E0B" fontSize="28" fontWeight="800" textAnchor="middle">→</text>}
      </g>);
    })}
  </svg></div>
      <div style={{marginTop:"20px", textAlign:"center"}}>
        <h3 style={{color:"#94A3B8", fontSize:"14px", marginBottom:"10px"}}>Illustration</h3>
        {illust.urls ? (
          <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"15px", maxWidth:"900px", margin:"0 auto"}}>
            {illust.urls.map((url, idx) => (
              <img key={idx} src={url} alt={`${system}-${idx}`} style={{width:"100%", height:"400px", borderRadius:"8px", border:"1px solid #475569", boxShadow:"0 4px 6px rgba(0,0,0,0.3)", objectFit:"cover"}} />
            ))}
          </div>
        ) : (
          <img src={illust.url} alt={system} style={{maxWidth:"100%", maxHeight:"450px", borderRadius:"8px", border:"1px solid #475569", boxShadow:"0 4px 6px rgba(0,0,0,0.3)", objectFit:"contain"}} />
        )}
        <p style={{color:"#CBD5E1", fontSize:"13px", marginTop:"10px", lineHeight:"1.5"}}>{illust.desc}</p>
      </div>
    </div>
  );
}

function MoonPhasesSVG() {
  const phases = [
    {e:"🌑",l:"New Moon",d:"Dark side facing us"},
    {e:"🌒",l:"Waxing Crescent",d:"Small right sliver"},
    {e:"🌓",l:"First Quarter",d:"Right half lit"},
    {e:"🌔",l:"Waxing Gibbous",d:"More than half lit"},
    {e:"🌕",l:"Full Moon",d:"Fully illuminated"},
    {e:"🌖",l:"Waning Gibbous",d:"Left shrinking"},
    {e:"🌗",l:"Last Quarter",d:"Left half lit"},
    {e:"🌘",l:"Waning Crescent",d:"Small left sliver"}
  ];
  return (<div className="math-svg" style={{maxWidth:"1050px"}}><svg viewBox="0 0 680 175" xmlns="http://www.w3.org/2000/svg">
    <rect width="680" height="175" rx="12" fill="#0F172A"/>
    <text x="340" y="18" textAnchor="middle" fill="#94A3B8" fontSize="13" fontWeight="700" fontFamily="'Baloo 2'">🌙 Moon Phases — 29.5 Day Cycle</text>
    {phases.map((ph,i) => {
      const x = 10 + i * 83;
      return (<g key={i}>
        <rect x={x} y="26" width="74" height="138" rx="10" fill="#1E293B" stroke="#334155" strokeWidth="1.5"/>
        <text x={x+37} y="74" textAnchor="middle" fontSize="36">{ph.e}</text>
        <text x={x+37} y="96" textAnchor="middle" fill="#CBD5E1" fontSize="9.5" fontWeight="700" fontFamily="'Baloo 2'">{ph.l.split(' ')[0]}</text>
        <text x={x+37} y="110" textAnchor="middle" fill="#CBD5E1" fontSize="9.5" fontWeight="700" fontFamily="'Baloo 2'">{ph.l.split(' ').slice(1).join(' ')}</text>
        <line x1={x+8} y1="118" x2={x+66} y2="118" stroke="#334155" strokeWidth="1"/>
        <text x={x+37} y="133" textAnchor="middle" fill="#64748B" fontSize="8.5" fontFamily="'Baloo 2'">{ph.d.split(' ').slice(0,2).join(' ')}</text>
        <text x={x+37} y="147" textAnchor="middle" fill="#64748B" fontSize="8.5" fontFamily="'Baloo 2'">{ph.d.split(' ').slice(2).join(' ')}</text>
        {i<7 && <text x={x+80} y="77" fill="#F59E0B" fontSize="14" fontWeight="800">→</text>}
      </g>);
    })}
  </svg></div>);
}

function MagnetPolesSVG() {
  return (<div className="math-svg"><svg viewBox="0 0 640 230" xmlns="http://www.w3.org/2000/svg">
    <rect width="640" height="230" rx="12" fill="#1E293B"/>
    <text x="320" y="20" textAnchor="middle" fill="#94A3B8" fontSize="13" fontWeight="700" fontFamily="'Baloo 2'">🧲 Magnetic Poles — Attraction &amp; Repulsion</text>
    {/* ATTRACT panel */}
    <rect x="12" y="30" width="300" height="188" rx="12" fill="#22C55E12" stroke="#22C55E" strokeWidth="1.8"/>
    <text x="162" y="50" textAnchor="middle" fill="#22C55E" fontSize="12" fontWeight="700" fontFamily="'Baloo 2'">✓ Unlike Poles ATTRACT</text>
    <rect x="28" y="62" width="72" height="52" rx="8" fill="#EF444435" stroke="#EF4444" strokeWidth="2.5"/>
    <text x="64" y="95" textAnchor="middle" fill="#EF4444" fontSize="28" fontWeight="900" fontFamily="'Baloo 2'">N</text>
    <rect x="122" y="62" width="72" height="52" rx="8" fill="#38BDF835" stroke="#38BDF8" strokeWidth="2.5"/>
    <text x="158" y="95" textAnchor="middle" fill="#38BDF8" fontSize="28" fontWeight="900" fontFamily="'Baloo 2'">S</text>
    <text x="111" y="94" textAnchor="middle" fill="#F59E0B" fontSize="22" fontWeight="900">⟵⟶</text>
    <path d="M100 72 Q111 52 122 72" fill="none" stroke="#F59E0B" strokeWidth="2" strokeDasharray="4" opacity="0.8"/>
    <path d="M100 104 Q111 124 122 104" fill="none" stroke="#F59E0B" strokeWidth="2" strokeDasharray="4" opacity="0.8"/>
    <text x="222" y="72" fill="#94A3B8" fontSize="10.5" fontFamily="'Baloo 2'">Magnetic:</text>
    <text x="222" y="87" fill="#94A3B8" fontSize="10.5" fontFamily="'Baloo 2'">iron 🔩 steel</text>
    <text x="222" y="102" fill="#94A3B8" fontSize="10.5" fontFamily="'Baloo 2'">nickel, cobalt</text>
    <text x="222" y="118" fill="#64748B" fontSize="10" fontFamily="'Baloo 2'">Not magnetic:</text>
    <text x="222" y="133" fill="#64748B" fontSize="10" fontFamily="'Baloo 2'">wood, plastic,</text>
    <text x="222" y="148" fill="#64748B" fontSize="10" fontFamily="'Baloo 2'">glass, copper</text>
    <text x="162" y="204" textAnchor="middle" fill="#22C55E" fontSize="11" fontWeight="700" fontFamily="'Baloo 2'">Force = PULL together ✓</text>
    {/* REPEL panel */}
    <rect x="328" y="30" width="300" height="188" rx="12" fill="#EF444412" stroke="#EF4444" strokeWidth="1.8"/>
    <text x="478" y="50" textAnchor="middle" fill="#EF4444" fontSize="12" fontWeight="700" fontFamily="'Baloo 2'">✗ Like Poles REPEL</text>
    <rect x="345" y="62" width="72" height="52" rx="8" fill="#EF444435" stroke="#EF4444" strokeWidth="2.5"/>
    <text x="381" y="95" textAnchor="middle" fill="#EF4444" fontSize="28" fontWeight="900" fontFamily="'Baloo 2'">N</text>
    <rect x="438" y="62" width="72" height="52" rx="8" fill="#EF444435" stroke="#EF4444" strokeWidth="2.5"/>
    <text x="474" y="95" textAnchor="middle" fill="#EF4444" fontSize="28" fontWeight="900" fontFamily="'Baloo 2'">N</text>
    <text x="427" y="94" textAnchor="middle" fill="#EF4444" fontSize="22" fontWeight="900">⟶⟵</text>
    <path d="M417 72 Q405 52 388 67" fill="none" stroke="#EF4444" strokeWidth="2" strokeDasharray="4" opacity="0.8"/>
    <path d="M417 104 Q405 124 388 109" fill="none" stroke="#EF4444" strokeWidth="2" strokeDasharray="4" opacity="0.8"/>
    <path d="M427 72 Q438 52 455 67" fill="none" stroke="#EF4444" strokeWidth="2" strokeDasharray="4" opacity="0.8"/>
    <path d="M427 104 Q438 124 455 109" fill="none" stroke="#EF4444" strokeWidth="2" strokeDasharray="4" opacity="0.8"/>
    <text x="536" y="75" fill="#94A3B8" fontSize="10.5" fontFamily="'Baloo 2'">S+S also repels</text>
    <text x="536" y="90" fill="#94A3B8" fontSize="10.5" fontFamily="'Baloo 2'">🧭 Compass uses</text>
    <text x="536" y="105" fill="#64748B" fontSize="10" fontFamily="'Baloo 2'">Earth's magnetic</text>
    <text x="536" y="120" fill="#64748B" fontSize="10" fontFamily="'Baloo 2'">field to point N</text>
    <text x="478" y="204" textAnchor="middle" fill="#EF4444" fontSize="11" fontWeight="700" fontFamily="'Baloo 2'">Force = PUSH apart ✗</text>
  </svg></div>);
}

function LightRefractionSVG() {
  return (<div className="math-svg"><svg viewBox="0 0 640 265" xmlns="http://www.w3.org/2000/svg">
    <rect width="640" height="265" rx="12" fill="#1E293B"/>
    <text x="320" y="18" textAnchor="middle" fill="#94A3B8" fontSize="13" fontWeight="700" fontFamily="'Baloo 2'">💡 Reflection &amp; Refraction of Light</text>
    <rect x="10" y="26" width="302" height="228" rx="10" fill="#38BDF815" stroke="#38BDF8" strokeWidth="1.5"/>
    <text x="161" y="43" textAnchor="middle" fill="#38BDF8" fontSize="13" fontWeight="700" fontFamily="'Baloo 2'">REFLECTION (Mirror)</text>
    <line x1="26" y1="188" x2="298" y2="188" stroke="#94A3B8" strokeWidth="5" strokeLinecap="round"/>
    <text x="161" y="208" textAnchor="middle" fill="#64748B" fontSize="11" fontFamily="'Baloo 2'">Smooth mirror surface</text>
    <line x1="161" y1="100" x2="161" y2="188" stroke="#475569" strokeWidth="1.5" strokeDasharray="5"/>
    <text x="175" y="113" fill="#475569" fontSize="11" fontFamily="'Baloo 2'">Normal</text>
    <line x1="82" y1="74" x2="161" y2="188" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round"/>
    <text x="52" y="70" fill="#F59E0B" fontSize="12" fontWeight="700" fontFamily="'Baloo 2'">Incident</text>
    <line x1="161" y1="188" x2="240" y2="74" stroke="#22C55E" strokeWidth="3" strokeLinecap="round"/>
    <text x="228" y="70" fill="#22C55E" fontSize="12" fontWeight="700" fontFamily="'Baloo 2'">Reflected</text>
    <text x="108" y="166" fill="#F59E0B" fontSize="15" fontFamily="'Baloo 2'">i°</text>
    <text x="200" y="166" fill="#22C55E" fontSize="15" fontFamily="'Baloo 2'">r°</text>
    <text x="161" y="244" textAnchor="middle" fill="#22C55E" fontSize="12" fontWeight="700" fontFamily="'Baloo 2'">Angle i = Angle r (Law of Reflection)</text>
    <rect x="328" y="26" width="302" height="228" rx="10" fill="#A855F715" stroke="#A855F7" strokeWidth="1.5"/>
    <text x="479" y="43" textAnchor="middle" fill="#A855F7" fontSize="13" fontWeight="700" fontFamily="'Baloo 2'">REFRACTION (Water/Glass)</text>
    <rect x="338" y="164" width="282" height="78" rx="5" fill="#38BDF818"/>
    <line x1="338" y1="164" x2="620" y2="164" stroke="#38BDF8" strokeWidth="2.5"/>
    <text x="479" y="230" textAnchor="middle" fill="#38BDF8" fontSize="11" fontFamily="'Baloo 2'">Water/Glass (denser medium)</text>
    <line x1="479" y1="76" x2="479" y2="212" stroke="#475569" strokeWidth="1.5" strokeDasharray="5"/>
    <line x1="400" y1="72" x2="479" y2="164" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round"/>
    <text x="372" y="68" fill="#F59E0B" fontSize="12" fontWeight="700" fontFamily="'Baloo 2'">Incident</text>
    <line x1="479" y1="164" x2="504" y2="236" stroke="#EC4899" strokeWidth="3" strokeLinecap="round"/>
    <text x="506" y="242" fill="#EC4899" fontSize="12" fontWeight="700" fontFamily="'Baloo 2'">Refracted (bent)</text>
    <text x="479" y="118" textAnchor="middle" fill="#94A3B8" fontSize="11" fontFamily="'Baloo 2'">Bends toward normal</text>
    <text x="479" y="255" textAnchor="middle" fill="#A855F7" fontSize="12" fontWeight="700" fontFamily="'Baloo 2'">Light slows &amp; bends entering denser medium</text>
  </svg></div>);
}

function SimpleMachinesSVG() {
  const machines = [
    {n:"Lever",e:"⚖️",d:"Bar + fulcrum",x:"Seesaw, scissors",c:"#38BDF8"},
    {n:"Wheel & Axle",e:"🎡",d:"Wheel on rod",x:"Doorknob, steering",c:"#22C55E"},
    {n:"Pulley",e:null,d:"Rope + wheel",x:"Flagpole, crane",c:"#F59E0B"},
    {n:"Inclined Plane",e:"📐",d:"Sloped surface",x:"Ramp, slide",c:"#A855F7"},
    {n:"Wedge",e:"🪓",d:"Thin sharp edge",x:"Axe, knife",c:"#EF4444"},
    {n:"Screw",e:"🔩",d:"Wrapped ramp",x:"Jar lid, bolt",c:"#EC4899"}
  ];
  return (<div className="math-svg" style={{maxWidth:"1050px"}}><svg viewBox="0 0 590 310" xmlns="http://www.w3.org/2000/svg">
    <rect width="590" height="310" rx="12" fill="#1E293B"/>
    <text x="295" y="19" textAnchor="middle" fill="#94A3B8" fontSize="13" fontWeight="700" fontFamily="'Baloo 2'">⚙️ The 6 Simple Machines</text>
    {machines.map((m,i) => {
      const col = i%3, row = Math.floor(i/3);
      const bx = 10 + col*192, by = 28 + row*136;
      return (<g key={i}>
        <rect x={bx} y={by} width="182" height="128" rx="10" fill={m.c+"18"} stroke={m.c} strokeWidth="1.5"/>
        {m.e ? (
          <text x={bx+91} y={by+46} textAnchor="middle" fontSize="32">{m.e}</text>
        ) : (
          <g>
            <rect x={bx+60} y={by+9} width="62" height="8" rx="3" fill="#64748B"/>
            <line x1={bx+91} y1={by+17} x2={bx+91} y2={by+24} stroke="#64748B" strokeWidth="2.5"/>
            <circle cx={bx+91} cy={by+38} r="14" fill="none" stroke="#F59E0B" strokeWidth="2.5"/>
            <circle cx={bx+91} cy={by+38} r="5" fill="#F59E0B"/>
            <path d={`M${bx+77},${by+38} A14,14 0 0,0 ${bx+105},${by+38}`} fill="none" stroke="#94A3B8" strokeWidth="2"/>
            <line x1={bx+77} y1={by+38} x2={bx+77} y2={by+60} stroke="#94A3B8" strokeWidth="2"/>
            <rect x={bx+69} y={by+60} width="16" height="9" rx="2" fill="#F59E0B30" stroke="#F59E0B" strokeWidth="1.5"/>
            <line x1={bx+105} y1={by+38} x2={bx+105} y2={by+55} stroke="#94A3B8" strokeWidth="2"/>
            <text x={bx+107} y={by+53} fill="#22C55E" fontSize="13" fontFamily="'Baloo 2'">↑F</text>
          </g>
        )}
        <text x={bx+91} y={by+76} textAnchor="middle" fill={m.c} fontSize="12" fontWeight="700" fontFamily="'Baloo 2'">{m.n}</text>
        <text x={bx+91} y={by+93} textAnchor="middle" fill="#94A3B8" fontSize="10" fontFamily="'Baloo 2'">{m.d}</text>
        <line x1={bx+12} y1={by+99} x2={bx+170} y2={by+99} stroke={m.c+"40"} strokeWidth="1"/>
        <text x={bx+91} y={by+114} textAnchor="middle" fill="#64748B" fontSize="9.5" fontFamily="'Baloo 2'">{m.x.split(',')[0]}</text>
        <text x={bx+91} y={by+127} textAnchor="middle" fill="#64748B" fontSize="9.5" fontFamily="'Baloo 2'">{m.x.split(',')[1]||''}</text>
      </g>);
    })}
  </svg></div>);
}

function SkeletonSVG() {
  const [clickedBone, setClickedBone] = React.useState(null);
  
  const handleBoneClick = (bone) => {
    setClickedBone(bone);
    setTimeout(() => setClickedBone(null), 200);
    
    // TTS
    const utterance = new SpeechSynthesisUtterance(bone);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    speechSynthesis.speak(utterance);
  };
  
  return (<div className="math-svg" style={{maxWidth:"1050px"}}><svg viewBox="0 0 560 310" xmlns="http://www.w3.org/2000/svg">
    <rect width="560" height="310" rx="12" fill="#1E293B"/>
    <text x="280" y="18" textAnchor="middle" fill="#94A3B8" fontSize="13" fontWeight="700" fontFamily="'Baloo 2'">🦴 Human Skeleton — 206 Bones</text>
    {/* Dashed lines from labels to bones */}
    <line x1="260" y1="54" x2="232" y2="57" stroke="#F59E0B" strokeWidth="1" strokeDasharray="4" opacity="0.5"/>
    <line x1="260" y1="128" x2="221" y2="135" stroke="#F59E0B" strokeWidth="1" strokeDasharray="4" opacity="0.5"/>
    <line x1="260" y1="180" x2="215" y2="165" stroke="#38BDF8" strokeWidth="1" strokeDasharray="4" opacity="0.5"/>
    <line x1="260" y1="224" x2="236" y2="218" stroke="#22C55E" strokeWidth="1" strokeDasharray="4" opacity="0.5"/>
    <line x1="78" y1="137" x2="155" y2="141" stroke="#A855F7" strokeWidth="1" strokeDasharray="4" opacity="0.5"/>
    <line x1="74" y1="202" x2="146" y2="205" stroke="#A855F7" strokeWidth="1" strokeDasharray="4" opacity="0.5"/>
    <line x1="82" y1="272" x2="182" y2="264" stroke="#EC4899" strokeWidth="1" strokeDasharray="4" opacity="0.5"/>
    <ellipse cx="207" cy="57" rx="25" ry="34" fill="#1E3A5F" stroke={clickedBone === "Skull" ? "#F59E0B" : "#CBD5E1"} strokeWidth={clickedBone === "Skull" ? 2.5 : 1.5} style={{cursor: 'pointer', transition: 'stroke-width 0.1s, stroke 0.1s'}} onClick={() => handleBoneClick("Skull")}/>
    <text x="207" y="63" textAnchor="middle" fill="#CBD5E1" fontSize="15" style={{cursor: 'pointer'}} onClick={() => handleBoneClick("Skull")}>💀</text>
    <line x1="207" y1="91" x2="207" y2="213" stroke={clickedBone === "Spine" ? "#38BDF8" : "#94A3B8"} strokeWidth={clickedBone === "Spine" ? 5 : 4} strokeLinecap="round" style={{cursor: 'pointer', transition: 'stroke 0.1s, stroke-width 0.1s'}} onClick={() => handleBoneClick("Spine")}/>
    {[105,121,137,153,169,185,201].map((y,i) => <rect key={i} x="200" y={y-5} width="14" height="9" rx="2" fill={clickedBone === "Rib Cage" ? "#F59E0B" : "#64748B"} stroke="#94A3B8" strokeWidth="1" style={{cursor: 'pointer', transition: 'fill 0.1s'}} onClick={() => handleBoneClick("Rib Cage")}/>)}
    {[0,1,2,3,4].map(i => (<g key={i} onClick={() => handleBoneClick("Rib Cage")} style={{cursor: 'pointer'}}><path d={`M207,${120+i*14} Q188,${113+i*14} 181,${127+i*14}`} fill="none" stroke={clickedBone === "Rib Cage" ? "#F59E0B" : "#94A3B8"} strokeWidth={clickedBone === "Rib Cage" ? "3" : "2"} style={{transition: 'stroke 0.1s, stroke-width 0.1s'}}/><path d={`M207,${120+i*14} Q226,${113+i*14} 233,${127+i*14}`} fill="none" stroke={clickedBone === "Rib Cage" ? "#F59E0B" : "#94A3B8"} strokeWidth={clickedBone === "Rib Cage" ? "3" : "2"} style={{transition: 'stroke 0.1s, stroke-width 0.1s'}}/></g>))}
    <ellipse cx="207" cy="218" rx="29" ry="18" fill="#1E3A5F" stroke={clickedBone === "Pelvis" ? "#22C55E" : "#94A3B8"} strokeWidth={clickedBone === "Pelvis" ? 2.5 : 1.5} style={{cursor: 'pointer', transition: 'stroke 0.1s, stroke-width 0.1s'}} onClick={() => handleBoneClick("Pelvis")}/>
    <line x1="181" y1="108" x2="155" y2="175" stroke={clickedBone === "Humerus" ? "#F59E0B" : "#94A3B8"} strokeWidth={clickedBone === "Humerus" ? 5 : 4} strokeLinecap="round" style={{cursor: 'pointer', transition: 'stroke 0.1s, stroke-width 0.1s'}} onClick={() => handleBoneClick("Humerus")}/>
    <line x1="155" y1="175" x2="137" y2="229" stroke={clickedBone === "Radius/Ulna" ? "#F59E0B" : "#94A3B8"} strokeWidth={clickedBone === "Radius/Ulna" ? 4 : 3} strokeLinecap="round" style={{cursor: 'pointer', transition: 'stroke 0.1s, stroke-width 0.1s'}} onClick={() => handleBoneClick("Radius/Ulna")}/>
    <line x1="233" y1="108" x2="260" y2="175" stroke={clickedBone === "Humerus" ? "#F59E0B" : "#94A3B8"} strokeWidth={clickedBone === "Humerus" ? 5 : 4} strokeLinecap="round" style={{cursor: 'pointer', transition: 'stroke 0.1s, stroke-width 0.1s'}} onClick={() => handleBoneClick("Humerus")}/>
    <line x1="260" y1="175" x2="278" y2="229" stroke={clickedBone === "Radius/Ulna" ? "#F59E0B" : "#94A3B8"} strokeWidth={clickedBone === "Radius/Ulna" ? 4 : 3} strokeLinecap="round" style={{cursor: 'pointer', transition: 'stroke 0.1s, stroke-width 0.1s'}} onClick={() => handleBoneClick("Radius/Ulna")}/>
    <line x1="193" y1="235" x2="177" y2="290" stroke={clickedBone === "Femur" ? "#F59E0B" : "#94A3B8"} strokeWidth={clickedBone === "Femur" ? 7 : 6} strokeLinecap="round" style={{cursor: 'pointer', transition: 'stroke 0.1s, stroke-width 0.1s'}} onClick={() => handleBoneClick("Femur")}/>
    <line x1="221" y1="235" x2="237" y2="290" stroke={clickedBone === "Femur" ? "#F59E0B" : "#94A3B8"} strokeWidth={clickedBone === "Femur" ? 7 : 6} strokeLinecap="round" style={{cursor: 'pointer', transition: 'stroke 0.1s, stroke-width 0.1s'}} onClick={() => handleBoneClick("Femur")}/>
    <line x1="215" y1="165" x2="260" y2="180" stroke="#38BDF8" strokeWidth={clickedBone === "Spine" ? 2 : 1} strokeDasharray="4" opacity="0.5" style={{transition: 'stroke-width 0.1s'}}/>
    <rect x="260" y={clickedBone === "Skull" ? 44 : 48} width="70" height="20" rx="6" fill="#F59E0B" opacity={clickedBone === "Skull" ? 1 : 0.85} style={{cursor: 'pointer', transition: 'all 0.1s', transform: clickedBone === "Skull" ? 'scale(0.95)' : 'scale(1)', transformOrigin: '295px 61px'}} onClick={() => handleBoneClick("Skull")}/>
    <text x="295" y="61" textAnchor="middle" fill="#1E293B" fontSize="11" fontWeight="700" fontFamily="'Baloo 2'" style={{cursor: 'pointer', pointerEvents: 'none', transform: clickedBone === "Skull" ? 'scale(0.95)' : 'scale(1)', transformOrigin: '295px 61px', transition: 'transform 0.1s ease-out'}} onClick={() => handleBoneClick("Skull")}>Skull</text>
    <rect x="260" y={clickedBone === "Rib Cage" ? 118 : 122} width="70" height="20" rx="6" fill="#F59E0B" opacity={clickedBone === "Rib Cage" ? 1 : 0.85} style={{cursor: 'pointer', transition: 'all 0.1s', transform: clickedBone === "Rib Cage" ? 'scale(0.95)' : 'scale(1)', transformOrigin: '295px 135px'}} onClick={() => handleBoneClick("Rib Cage")}/>
    <text x="295" y="135" textAnchor="middle" fill="#1E293B" fontSize="11" fontWeight="700" fontFamily="'Baloo 2'" style={{cursor: 'pointer', pointerEvents: 'none', transform: clickedBone === "Rib Cage" ? 'scale(0.95)' : 'scale(1)', transformOrigin: '295px 135px', transition: 'transform 0.1s ease-out'}} onClick={() => handleBoneClick("Rib Cage")}>Rib Cage</text>
    <rect x="260" y={clickedBone === "Spine" ? 168 : 172} width="70" height="20" rx="6" fill="#38BDF8" opacity={clickedBone === "Spine" ? 1 : 0.85} style={{cursor: 'pointer', transition: 'all 0.1s', transform: clickedBone === "Spine" ? 'scale(0.95)' : 'scale(1)', transformOrigin: '295px 185px'}} onClick={() => handleBoneClick("Spine")}/>
    <text x="295" y="185" textAnchor="middle" fill="#1E293B" fontSize="11" fontWeight="700" fontFamily="'Baloo 2'" style={{cursor: 'pointer', pointerEvents: 'none', transform: clickedBone === "Spine" ? 'scale(0.95)' : 'scale(1)', transformOrigin: '295px 185px', transition: 'transform 0.1s ease-out'}} onClick={() => handleBoneClick("Spine")}>Spine</text>
    <rect x="260" y={clickedBone === "Pelvis" ? 212 : 216} width="70" height="20" rx="6" fill="#22C55E" opacity={clickedBone === "Pelvis" ? 1 : 0.85} style={{cursor: 'pointer', transition: 'all 0.1s', transform: clickedBone === "Pelvis" ? 'scale(0.95)' : 'scale(1)', transformOrigin: '295px 229px'}} onClick={() => handleBoneClick("Pelvis")}/>
    <text x="295" y="229" textAnchor="middle" fill="#1E293B" fontSize="11" fontWeight="700" fontFamily="'Baloo 2'" style={{cursor: 'pointer', pointerEvents: 'none', transform: clickedBone === "Pelvis" ? 'scale(0.95)' : 'scale(1)', transformOrigin: '295px 229px', transition: 'transform 0.1s ease-out'}} onClick={() => handleBoneClick("Pelvis")}>Pelvis</text>
    <rect x="8" y={clickedBone === "Humerus" ? 125 : 129} width="70" height="20" rx="6" fill="#A855F7" opacity={clickedBone === "Humerus" ? 1 : 0.85} style={{cursor: 'pointer', transition: 'all 0.1s', transform: clickedBone === "Humerus" ? 'scale(0.95)' : 'scale(1)', transformOrigin: '43px 142px'}} onClick={() => handleBoneClick("Humerus")}/>
    <text x="43" y="142" textAnchor="middle" fill="#1E293B" fontSize="11" fontWeight="700" fontFamily="'Baloo 2'" style={{cursor: 'pointer', pointerEvents: 'none', transform: clickedBone === "Humerus" ? 'scale(0.95)' : 'scale(1)', transformOrigin: '43px 142px', transition: 'transform 0.1s ease-out'}} onClick={() => handleBoneClick("Humerus")}>Humerus</text>
    <rect x="4" y={clickedBone === "Radius/Ulna" ? 190 : 194} width="70" height="20" rx="6" fill="#A855F7" opacity={clickedBone === "Radius/Ulna" ? 1 : 0.85} style={{cursor: 'pointer', transition: 'all 0.1s', transform: clickedBone === "Radius/Ulna" ? 'scale(0.95)' : 'scale(1)', transformOrigin: '39px 207px'}} onClick={() => handleBoneClick("Radius/Ulna")}/>
    <text x="39" y="207" textAnchor="middle" fill="#1E293B" fontSize="11" fontWeight="700" fontFamily="'Baloo 2'" style={{cursor: 'pointer', pointerEvents: 'none', transform: clickedBone === "Radius/Ulna" ? 'scale(0.95)' : 'scale(1)', transformOrigin: '39px 207px', transition: 'transform 0.1s ease-out'}} onClick={() => handleBoneClick("Radius/Ulna")}>Radius/Ulna</text>
    <rect x="12" y={clickedBone === "Femur" ? 260 : 264} width="70" height="20" rx="6" fill="#EC4899" opacity={clickedBone === "Femur" ? 1 : 0.85} style={{cursor: 'pointer', transition: 'all 0.1s', transform: clickedBone === "Femur" ? 'scale(0.95)' : 'scale(1)', transformOrigin: '47px 277px'}} onClick={() => handleBoneClick("Femur")}/>
    <text x="47" y="277" textAnchor="middle" fill="#1E293B" fontSize="11" fontWeight="700" fontFamily="'Baloo 2'" style={{cursor: 'pointer', pointerEvents: 'none', transform: clickedBone === "Femur" ? 'scale(0.95)' : 'scale(1)', transformOrigin: '47px 277px', transition: 'transform 0.1s ease-out'}} onClick={() => handleBoneClick("Femur")}>Femur</text>
  </svg></div>);
}

function WaterCycleSVG() {
  return (<div className="math-svg" style={{maxWidth:"1100px"}}><svg viewBox="0 0 680 260" xmlns="http://www.w3.org/2000/svg">
    <rect width="680" height="260" rx="12" fill="#0F172A"/>
    <text x="340" y="18" textAnchor="middle" fill="#94A3B8" fontSize="13" fontWeight="700" fontFamily="'Baloo 2'">💧 The Water Cycle</text>
    <circle cx="77" cy="69" r="30" fill="#F59E0B" opacity="0.75"/>
    <text x="77" y="77" textAnchor="middle" fontSize="26">☀️</text>
    <path d="M0 202 Q115 185 230 202 Q345 219 460 202 Q570 185 680 202 L680 260 L0 260 Z" fill="#38BDF830" stroke="#38BDF8" strokeWidth="1.5"/>
    <text x="340" y="238" textAnchor="middle" fill="#38BDF8" fontSize="13" fontWeight="700" fontFamily="'Baloo 2'">Ocean / Lake / River</text>
    <ellipse cx="318" cy="65" rx="66" ry="39" fill="#F1F5F9" opacity="0.88"/>
    <ellipse cx="283" cy="75" rx="42" ry="32" fill="#F1F5F9" opacity="0.88"/>
    <ellipse cx="353" cy="75" rx="42" ry="32" fill="#F1F5F9" opacity="0.88"/>
    <text x="318" y="77" textAnchor="middle" fill="#475569" fontSize="12" fontWeight="700" fontFamily="'Baloo 2'">☁️ Cloud</text>
    <text x="195" y="158" textAnchor="middle" fill="#F59E0B" fontSize="13" fontWeight="700" fontFamily="'Baloo 2'">⬆ Evaporation</text>
    {[143,176,214,247].map((x,i) => (<text key={i} x={x} y={191} fill="#F59E0B" fontSize="17" opacity="0.8">↑</text>))}
    <text x="450" y="39" textAnchor="middle" fill="#8B5CF6" fontSize="11" fontWeight="700" fontFamily="'Baloo 2'">Condensation (vapor → droplets)</text>
    <text x="472" y="104" textAnchor="middle" fill="#38BDF8" fontSize="13" fontWeight="700" fontFamily="'Baloo 2'">🌧️ Precipitation</text>
    {[415,448,481,514,547].map((x,i) => (<text key={i} x={x} y={130} fill="#38BDF8" fontSize="18">↓</text>))}
    <polygon points="612,202 642,115 672,202" fill="#64748B" opacity="0.75"/>
    <text x="617" y="156" fill="#94A3B8" fontSize="11" fontFamily="'Baloo 2'">⛰️ Mts</text>
    <path d="M639 202 Q651 202 659 224" fill="none" stroke="#38BDF8" strokeWidth="2" strokeDasharray="4"/>
    <text x="636" y="245" textAnchor="middle" fill="#64748B" fontSize="10" fontFamily="'Baloo 2'">Runoff</text>
  </svg></div>);
}

function PhotosynthesisSVG() {
  return (<div className="math-svg" style={{maxWidth:"1100px"}}><svg viewBox="0 0 620 230" xmlns="http://www.w3.org/2000/svg">
    <rect width="620" height="230" rx="12" fill="#1E293B"/>
    <text x="310" y="18" textAnchor="middle" fill="#94A3B8" fontSize="13" fontWeight="700" fontFamily="'Baloo 2'">🌿 Photosynthesis — How Plants Make Food</text>
    <defs><marker id="phArr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#94A3B8"/></marker></defs>
    <circle cx="64" cy="96" r="34" fill="#F59E0B" opacity="0.75"/>
    <text x="64" y="103" textAnchor="middle" fontSize="28">☀️</text>
    <text x="64" y="152" textAnchor="middle" fill="#F59E0B" fontSize="12" fontWeight="700" fontFamily="'Baloo 2'">Sunlight</text>
    <text x="64" y="174" textAnchor="middle" fill="#EF4444" fontSize="13" fontWeight="700" fontFamily="'Baloo 2'">CO₂ ↗</text>
    <text x="64" y="197" textAnchor="middle" fill="#38BDF8" fontSize="13" fontWeight="700" fontFamily="'Baloo 2'">H₂O ↗</text>
    <path d="M98 99 L195 121" stroke="#F59E0B" strokeWidth="2.5" opacity="0.8" markerEnd="url(#phArr)"/>
    <path d="M98 174 L195 148" stroke="#EF4444" strokeWidth="2" opacity="0.7" markerEnd="url(#phArr)"/>
    <path d="M98 196 L195 163" stroke="#38BDF8" strokeWidth="2" opacity="0.7" markerEnd="url(#phArr)"/>
    <ellipse cx="273" cy="137" rx="74" ry="60" fill="#22C55E" opacity="0.65" stroke="#22C55E" strokeWidth="2.5"/>
    <line x1="202" y1="137" x2="344" y2="137" stroke="#15803D" strokeWidth="2.5"/>
    <line x1="273" y1="80" x2="273" y2="193" stroke="#15803D" strokeWidth="2"/>
    <text x="273" y="141" textAnchor="middle" fill="#F0FDF4" fontSize="14" fontWeight="700" fontFamily="'Baloo 2'">🌿 Leaf</text>
    <text x="273" y="160" textAnchor="middle" fill="#dcfce7" fontSize="10" fontFamily="'Baloo 2'">Chlorophyll absorbs light</text>
    <path d="M344 113 L425 77" stroke="#A855F7" strokeWidth="2.5" opacity="0.8" markerEnd="url(#phArr)"/>
    <path d="M344 159 L425 178" stroke="#22C55E" strokeWidth="2.5" opacity="0.8" markerEnd="url(#phArr)"/>
    <rect x="427" y="56" width="125" height="54" rx="8" fill="#A855F720" stroke="#A855F7" strokeWidth="1.5"/>
    <text x="489" y="81" textAnchor="middle" fill="#A855F7" fontSize="13" fontWeight="700" fontFamily="'Baloo 2'">🍬 Glucose</text>
    <text x="489" y="99" textAnchor="middle" fill="#A855F7" fontSize="10" fontFamily="'Baloo 2'">(Energy / Food)</text>
    <rect x="427" y="160" width="125" height="54" rx="8" fill="#22C55E20" stroke="#22C55E" strokeWidth="1.5"/>
    <text x="489" y="185" textAnchor="middle" fill="#22C55E" fontSize="13" fontWeight="700" fontFamily="'Baloo 2'">💨 Oxygen</text>
    <text x="489" y="203" textAnchor="middle" fill="#22C55E" fontSize="10" fontFamily="'Baloo 2'">(Released into air)</text>
    <text x="310" y="222" textAnchor="middle" fill="#475569" fontSize="11" fontFamily="'Baloo 2'">Formula: 6CO₂ + 6H₂O + Sunlight → C₆H₁₂O₆ + 6O₂</text>
  </svg></div>);
}

function MaterialPropertiesSVG() {
  return (<div className="math-svg"><svg viewBox="0 0 620 240" xmlns="http://www.w3.org/2000/svg">
    <rect width="620" height="240" rx="16" fill="#1E293B"/>
    <text x="310" y="24" textAnchor="middle" fill="#E2E8F0" fontSize="17" fontWeight="800" fontFamily="'Baloo 2'">Properties of Materials</text>
    <rect x="36" y="52" width="258" height="154" rx="14" fill="#0F172A" stroke="#38BDF8" strokeWidth="2"/>
    <text x="165" y="76" textAnchor="middle" fill="#38BDF8" fontSize="14" fontWeight="800" fontFamily="'Baloo 2'">Conductors and Insulators</text>
    <circle cx="80" cy="128" r="18" fill="#F59E0B"/><rect x="74" y="109" width="12" height="8" rx="2" fill="#94A3B8"/><rect x="74" y="139" width="12" height="8" rx="2" fill="#94A3B8"/>
    <line x1="98" y1="128" x2="150" y2="128" stroke="#F59E0B" strokeWidth="5"/>
    <line x1="150" y1="128" x2="192" y2="104" stroke="#22C55E" strokeWidth="5"/>
    <line x1="150" y1="128" x2="192" y2="152" stroke="#22C55E" strokeWidth="5"/>
    <circle cx="208" cy="104" r="7" fill="#22C55E"/><circle cx="208" cy="152" r="7" fill="#22C55E"/>
    <rect x="58" y="166" width="58" height="24" rx="8" fill="#334155"/><text x="87" y="182" textAnchor="middle" fill="#F8FAFC" fontSize="11" fontWeight="700" fontFamily="'Baloo 2'">Metal</text>
    <rect x="178" y="166" width="74" height="24" rx="8" fill="#334155"/><text x="215" y="182" textAnchor="middle" fill="#F8FAFC" fontSize="11" fontWeight="700" fontFamily="'Baloo 2'">Rubber</text>
    <rect x="324" y="52" width="260" height="154" rx="14" fill="#0F172A" stroke="#22C55E" strokeWidth="2"/>
    <text x="454" y="76" textAnchor="middle" fill="#22C55E" fontSize="14" fontWeight="800" fontFamily="'Baloo 2'">Transparent to Opaque</text>
    <rect x="360" y="98" width="44" height="82" rx="10" fill="#DDF4FF" stroke="#7DD3FC" strokeWidth="2"/><text x="382" y="194" textAnchor="middle" fill="#7DD3FC" fontSize="10" fontWeight="700" fontFamily="'Baloo 2'">Clear</text>
    <rect x="436" y="98" width="44" height="82" rx="10" fill="#E2E8F055" stroke="#CBD5E1" strokeWidth="2"/><text x="458" y="194" textAnchor="middle" fill="#CBD5E1" fontSize="10" fontWeight="700" fontFamily="'Baloo 2'">Frosted</text>
    <rect x="512" y="98" width="44" height="82" rx="10" fill="#64748B" stroke="#94A3B8" strokeWidth="2"/><text x="534" y="194" textAnchor="middle" fill="#94A3B8" fontSize="10" fontWeight="700" fontFamily="'Baloo 2'">Wood</text>
    <polygon points="336,139 351,132 351,146" fill="#F8FAFC"/><polygon points="412,139 427,132 427,146" fill="#F8FAFC88"/><polygon points="488,139 503,132 503,146" fill="#F8FAFC33"/>
  </svg></div>);
}

function MixturesSolutionsSVG() {
  return (<div className="math-svg"><svg viewBox="0 0 620 240" xmlns="http://www.w3.org/2000/svg">
    <rect width="620" height="240" rx="16" fill="#1E293B"/>
    <text x="310" y="24" textAnchor="middle" fill="#E2E8F0" fontSize="17" fontWeight="800" fontFamily="'Baloo 2'">Mixtures and Solutions</text>
    <rect x="42" y="54" width="248" height="150" rx="14" fill="#0F172A" stroke="#F59E0B" strokeWidth="2"/>
    <text x="166" y="78" textAnchor="middle" fill="#F59E0B" fontSize="14" fontWeight="800" fontFamily="'Baloo 2'">Mixture</text>
    <rect x="104" y="96" width="124" height="84" rx="12" fill="#38BDF822" stroke="#7DD3FC" strokeWidth="2"/>
    <circle cx="129" cy="118" r="8" fill="#FACC15"/><circle cx="159" cy="146" r="8" fill="#F97316"/><circle cx="198" cy="121" r="8" fill="#22C55E"/><circle cx="145" cy="167" r="8" fill="#F97316"/><circle cx="205" cy="159" r="8" fill="#FACC15"/>
    <text x="166" y="195" textAnchor="middle" fill="#94A3B8" fontSize="11" fontWeight="700" fontFamily="'Baloo 2'">Different parts can still be seen</text>
    <rect x="330" y="54" width="248" height="150" rx="14" fill="#0F172A" stroke="#38BDF8" strokeWidth="2"/>
    <text x="454" y="78" textAnchor="middle" fill="#38BDF8" fontSize="14" fontWeight="800" fontFamily="'Baloo 2'">Solution</text>
    <rect x="392" y="96" width="124" height="84" rx="12" fill="#22C55E22" stroke="#86EFAC" strokeWidth="2"/>
    {Array.from({length:5}).map((_,r)=>Array.from({length:6}).map((__,c)=><circle key={r+"_"+c} cx={411+c*16} cy={114+r*13} r="4" fill={r%2===0 ? "#E2E8F0" : "#22C55E"} />))}
    <text x="454" y="195" textAnchor="middle" fill="#94A3B8" fontSize="11" fontWeight="700" fontFamily="'Baloo 2'">Particles spread evenly through the liquid</text>
  </svg></div>);
}

function GravityForceSVG() {
  return (<div className="math-svg"><svg viewBox="0 0 620 240" xmlns="http://www.w3.org/2000/svg">
    <rect width="620" height="240" rx="16" fill="#1E293B"/>
    <text x="310" y="24" textAnchor="middle" fill="#E2E8F0" fontSize="17" fontWeight="800" fontFamily="'Baloo 2'">Gravity Pulls Toward Earth</text>
    <circle cx="310" cy="184" r="44" fill="#2563EB"/>
    <path d="M282 175c10-18 30-28 52-22" stroke="#34D399" strokeWidth="9" fill="none" strokeLinecap="round"/>
    <path d="M302 199c15 9 33 8 46-3" stroke="#BBF7D0" strokeWidth="9" fill="none" strokeLinecap="round"/>
    <text x="310" y="189" textAnchor="middle" fill="#F8FAFC" fontSize="15" fontWeight="800" fontFamily="'Baloo 2'">Earth</text>
    <circle cx="310" cy="72" r="18" fill="#F59E0B"/>
    <line x1="310" y1="90" x2="310" y2="126" stroke="#F59E0B" strokeWidth="4"/>
    <polygon points="310,146 301,128 319,128" fill="#F59E0B"/>
    <line x1="310" y1="146" x2="310" y2="136" stroke="#38BDF8" strokeWidth="4" strokeDasharray="10 8"/>
    <line x1="310" y1="136" x2="310" y2="148" stroke="#38BDF8" strokeWidth="4"/>
    <text x="350" y="110" fill="#F8FAFC" fontSize="14" fontWeight="700" fontFamily="'Baloo 2'">apple falls</text>
    <path d="M310 140 L310 148" stroke="#38BDF8" strokeWidth="4" markerEnd="url(#gravityArrow)"/>
    <text x="310" y="214" textAnchor="middle" fill="#94A3B8" fontSize="12" fontWeight="700" fontFamily="'Baloo 2'">Gravity gives objects weight, makes things fall, and keeps moons and satellites in orbit.</text>
    <defs>
      <marker id="gravityArrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto">
        <path d="M0,0 L10,5 L0,10 z" fill="#38BDF8"/>
      </marker>
    </defs>
  </svg></div>);
}

function FrictionForceSVG() {
  return (<div className="math-svg"><svg viewBox="0 0 620 240" xmlns="http://www.w3.org/2000/svg">
    <rect width="620" height="240" rx="16" fill="#1E293B"/>
    <text x="310" y="24" textAnchor="middle" fill="#E2E8F0" fontSize="17" fontWeight="800" fontFamily="'Baloo 2'">Friction Opposes Motion</text>
    <rect x="78" y="118" width="180" height="40" rx="12" fill="#F59E0B"/>
    <rect x="58" y="160" width="230" height="18" rx="8" fill="#475569"/>
    {Array.from({length:11}).map((_,i)=><line key={i} x1={68+i*20} y1="178" x2={78+i*20} y2="190" stroke="#94A3B8" strokeWidth="2"/>)}
    <line x1="118" y1="100" x2="238" y2="100" stroke="#22C55E" strokeWidth="5"/><polygon points="253,100 235,91 235,109" fill="#22C55E"/>
    <line x1="238" y1="90" x2="148" y2="90" stroke="#EF4444" strokeWidth="5"/><polygon points="133,90 151,81 151,99" fill="#EF4444"/>
    <text x="186" y="72" textAnchor="middle" fill="#22C55E" fontSize="13" fontWeight="800" fontFamily="'Baloo 2'">motion</text>
    <text x="194" y="56" textAnchor="middle" fill="#EF4444" fontSize="13" fontWeight="800" fontFamily="'Baloo 2'">friction</text>
    <circle cx="426" cy="140" r="54" fill="#0F172A" stroke="#38BDF8" strokeWidth="2"/>
    <path d="M387 141c15-20 47-28 78-18" stroke="#7DD3FC" strokeWidth="8" fill="none" strokeLinecap="round"/>
    <text x="426" y="146" textAnchor="middle" fill="#F8FAFC" fontSize="14" fontWeight="800" fontFamily="'Baloo 2'">rough grip</text>
    <text x="310" y="214" textAnchor="middle" fill="#94A3B8" fontSize="12" fontWeight="700" fontFamily="'Baloo 2'">Rough surfaces increase friction. Oil, ice, and polished floors reduce friction.</text>
  </svg></div>);
}

function EnergyTypesSVG() {
  return (<div className="math-svg"><svg viewBox="0 0 620 255" xmlns="http://www.w3.org/2000/svg">
    <rect width="620" height="255" rx="16" fill="#1E293B"/>
    <text x="310" y="24" textAnchor="middle" fill="#E2E8F0" fontSize="17" fontWeight="800" fontFamily="'Baloo 2'">Types of Energy</text>
    {[
      [110,84,'#F59E0B','Heat'],[220,84,'#38BDF8','Light'],[330,84,'#A855F7','Sound'],[440,84,'#22C55E','Kinetic'],
      [165,164,'#EC4899','Chemical'],[290,164,'#F97316','Electrical'],[415,164,'#14B8A6','Potential']
    ].map(([x,y,color,label],i)=><g key={i}><circle cx={x} cy={y} r="34" fill={color+"22"} stroke={color} strokeWidth="3"/><text x={x} y={y+5} textAnchor="middle" fill={color} fontSize="13" fontWeight="800" fontFamily="'Baloo 2'">{label}</text></g>)}
    <rect x="234" y="116" width="152" height="26" rx="13" fill="#0F172A" stroke="#64748B" strokeWidth="1.5"/>
    <text x="310" y="133" textAnchor="middle" fill="#CBD5E1" fontSize="11" fontWeight="700" fontFamily="'Baloo 2'">Energy can change form</text>
    <path d="M199 157 C 225 157, 238 157, 251 157" stroke="#EC4899" strokeWidth="3" fill="none" markerEnd="url(#energyArrow)"/>
    <path d="M316 149 C 300 126, 275 112, 244 102" stroke="#38BDF8" strokeWidth="3" fill="none" markerEnd="url(#energyArrow)"/>
    <path d="M314 147 C 323 125, 332 112, 334 102" stroke="#A855F7" strokeWidth="3" fill="none" markerEnd="url(#energyArrow)"/>
    <path d="M421 149 C 432 132, 438 118, 440 102" stroke="#22C55E" strokeWidth="3" fill="none" markerEnd="url(#energyArrow)"/>
    <path d="M412 90 C 340 70, 220 68, 143 80" stroke="#F59E0B" strokeWidth="3" fill="none" markerEnd="url(#energyArrow)"/>
    <text x="225" y="151" fill="#EC4899" fontSize="9.5" fontWeight="700" fontFamily="'Baloo 2'">stored to current</text>
    <text x="239" y="94" fill="#38BDF8" fontSize="9.5" fontWeight="700" fontFamily="'Baloo 2'">powers light</text>
    <text x="342" y="96" fill="#A855F7" fontSize="9.5" fontWeight="700" fontFamily="'Baloo 2'">makes sound</text>
    <text x="451" y="124" fill="#22C55E" fontSize="9.5" fontWeight="700" fontFamily="'Baloo 2'">becomes motion</text>
    <text x="272" y="66" textAnchor="middle" fill="#F59E0B" fontSize="9.5" fontWeight="700" fontFamily="'Baloo 2'">motion creates heat</text>
    <text x="310" y="232" textAnchor="middle" fill="#94A3B8" fontSize="12" fontWeight="700" fontFamily="'Baloo 2'">Energy can change form, such as chemical energy in food becoming motion and body heat.</text>
    <defs>
      <marker id="energyArrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
        <path d="M0,0 L10,5 L0,10 z" fill="#CBD5E1"/>
      </marker>
    </defs>
  </svg></div>);
}

function DayNightSVG() {
  return (<div className="math-svg"><svg viewBox="0 0 620 240" xmlns="http://www.w3.org/2000/svg">
    <rect width="620" height="240" rx="16" fill="#0F172A"/>
    <circle cx="132" cy="108" r="38" fill="#FACC15"/>
    {Array.from({length:10}).map((_,i)=>{ const a=i*Math.PI/5; return <line key={i} x1={132+Math.cos(a)*48} y1={108+Math.sin(a)*48} x2={132+Math.cos(a)*64} y2={108+Math.sin(a)*64} stroke="#FDE68A" strokeWidth="4" strokeLinecap="round"/>; })}
    <circle cx="395" cy="122" r="66" fill="#2563EB"/>
    <path d="M395 56A66 66 0 0 1 395 188" fill="#0B1220"/>
    <line x1="395" y1="56" x2="395" y2="188" stroke="#F8FAFC55" strokeWidth="2" strokeDasharray="8 8"/>
    <line x1="395" y1="40" x2="415" y2="204" stroke="#F59E0B" strokeWidth="4"/>
    <line x1="182" y1="86" x2="332" y2="86" stroke="#FACC15" strokeWidth="5" strokeLinecap="round" opacity="0.95"/>
    <line x1="182" y1="108" x2="340" y2="108" stroke="#FDE68A" strokeWidth="6" strokeLinecap="round" opacity="0.95"/>
    <line x1="182" y1="130" x2="332" y2="130" stroke="#FACC15" strokeWidth="5" strokeLinecap="round" opacity="0.95"/>
    <polygon points="349,108 334,100 334,116" fill="#FDE68A"/>
    <path d="M438 94c8-12 24-17 38-13-6 8-8 18-5 28-13 2-27-3-33-15z" fill="#E2E8F0"/>
    <circle cx="472" cy="156" r="5" fill="#E2E8F0"/><circle cx="495" cy="138" r="4" fill="#E2E8F0"/><circle cx="504" cy="164" r="3.5" fill="#E2E8F0"/>
    <text x="395" y="222" textAnchor="middle" fill="#94A3B8" fontSize="12" fontWeight="700" fontFamily="'Baloo 2'">As Earth rotates, one side faces the Sun for day while the opposite side experiences night.</text>
  </svg></div>);
}

function SeasonsCycleSVG() {
  return (<div className="math-svg"><svg viewBox="0 0 620 250" xmlns="http://www.w3.org/2000/svg">
    <rect width="620" height="250" rx="16" fill="#1E293B"/>
    <text x="310" y="24" textAnchor="middle" fill="#E2E8F0" fontSize="17" fontWeight="800" fontFamily="'Baloo 2'">Seasons and Earth's Tilt</text>
    <circle cx="310" cy="128" r="34" fill="#FACC15"/>
    <ellipse cx="310" cy="128" rx="205" ry="72" fill="none" stroke="#475569" strokeWidth="2" strokeDasharray="10 8"/>
    {[[105,128,'Summer'],[310,56,'Autumn'],[515,128,'Winter'],[310,200,'Spring']].map(([x,y,label],i)=><g key={i}><circle cx={x} cy={y} r="18" fill="#2563EB"/><line x1={x-8} y1={y-22} x2={x+8} y2={y+22} stroke="#F59E0B" strokeWidth="3"/><text x={x} y={y+40} textAnchor="middle" fill="#F8FAFC" fontSize="12" fontWeight="800" fontFamily="'Baloo 2'">{label}</text></g>)}
    <text x="310" y="230" textAnchor="middle" fill="#94A3B8" fontSize="12" fontWeight="700" fontFamily="'Baloo 2'">Earth's tilt stays the same as it orbits the Sun, so different hemispheres get different sunlight.</text>
  </svg></div>);
}

function NervousSystemSVG() {
  return (<div className="math-svg"><svg viewBox="0 0 620 255" xmlns="http://www.w3.org/2000/svg">
    <rect width="620" height="255" rx="16" fill="#1E293B"/>
    <text x="310" y="24" textAnchor="middle" fill="#E2E8F0" fontSize="17" fontWeight="800" fontFamily="'Baloo 2'">Nervous System</text>
    <circle cx="310" cy="72" r="26" fill="#A855F7"/>
    <rect x="300" y="96" width="20" height="78" rx="10" fill="#8B5CF6"/>
    <line x1="310" y1="115" x2="240" y2="138" stroke="#C084FC" strokeWidth="6"/><line x1="310" y1="115" x2="380" y2="138" stroke="#C084FC" strokeWidth="6"/>
    <line x1="250" y1="140" x2="220" y2="188" stroke="#C084FC" strokeWidth="5"/><line x1="370" y1="140" x2="400" y2="188" stroke="#C084FC" strokeWidth="5"/>
    <line x1="310" y1="174" x2="280" y2="224" stroke="#C084FC" strokeWidth="5"/><line x1="310" y1="174" x2="340" y2="224" stroke="#C084FC" strokeWidth="5"/>
    <rect x="60" y="74" width="120" height="56" rx="12" fill="#0F172A" stroke="#A855F7" strokeWidth="2"/><text x="120" y="98" textAnchor="middle" fill="#A855F7" fontSize="13" fontWeight="800" fontFamily="'Baloo 2'">Brain</text><text x="120" y="116" textAnchor="middle" fill="#CBD5E1" fontSize="11" fontWeight="700" fontFamily="'Baloo 2'">command center</text>
    <rect x="440" y="74" width="120" height="56" rx="12" fill="#0F172A" stroke="#A855F7" strokeWidth="2"/><text x="500" y="98" textAnchor="middle" fill="#A855F7" fontSize="13" fontWeight="800" fontFamily="'Baloo 2'">Spinal Cord</text><text x="500" y="116" textAnchor="middle" fill="#CBD5E1" fontSize="11" fontWeight="700" fontFamily="'Baloo 2'">signal highway</text>
    <text x="310" y="240" textAnchor="middle" fill="#94A3B8" fontSize="12" fontWeight="700" fontFamily="'Baloo 2'">Nerves carry messages between the brain, senses, muscles, and organs.</text>
  </svg></div>);
}

function ClassificationSVG() {
  return (<div className="math-svg"><svg viewBox="0 0 620 245" xmlns="http://www.w3.org/2000/svg">
    <rect width="620" height="245" rx="16" fill="#1E293B"/>
    <text x="310" y="24" textAnchor="middle" fill="#E2E8F0" fontSize="17" fontWeight="800" fontFamily="'Baloo 2'">Classification of Living Things</text>
    <rect x="246" y="48" width="128" height="40" rx="12" fill="#22C55E22" stroke="#22C55E" strokeWidth="2"/><text x="310" y="73" textAnchor="middle" fill="#22C55E" fontSize="14" fontWeight="800" fontFamily="'Baloo 2'">Living Things</text>
    <line x1="310" y1="88" x2="310" y2="116" stroke="#94A3B8" strokeWidth="3"/><line x1="180" y1="116" x2="440" y2="116" stroke="#94A3B8" strokeWidth="3"/>
    <line x1="180" y1="116" x2="180" y2="140" stroke="#94A3B8" strokeWidth="3"/><line x1="440" y1="116" x2="440" y2="140" stroke="#94A3B8" strokeWidth="3"/>
    <rect x="110" y="140" width="140" height="44" rx="12" fill="#38BDF822" stroke="#38BDF8" strokeWidth="2"/><text x="180" y="166" textAnchor="middle" fill="#38BDF8" fontSize="14" fontWeight="800" fontFamily="'Baloo 2'">Vertebrates</text>
    <rect x="370" y="140" width="140" height="44" rx="12" fill="#F59E0B22" stroke="#F59E0B" strokeWidth="2"/><text x="440" y="166" textAnchor="middle" fill="#F59E0B" fontSize="14" fontWeight="800" fontFamily="'Baloo 2'">Invertebrates</text>
    <text x="180" y="206" textAnchor="middle" fill="#CBD5E1" fontSize="11" fontWeight="700" fontFamily="'Baloo 2'">have backbones</text>
    <text x="440" y="206" textAnchor="middle" fill="#CBD5E1" fontSize="11" fontWeight="700" fontFamily="'Baloo 2'">no backbone</text>
    <text x="310" y="228" textAnchor="middle" fill="#94A3B8" fontSize="12" fontWeight="700" fontFamily="'Baloo 2'">Scientists group organisms by shared features such as kingdom and body structure.</text>
  </svg></div>);
}

function AdaptationSVG() {
  return (<div className="math-svg"><svg viewBox="0 0 620 245" xmlns="http://www.w3.org/2000/svg">
    <rect width="620" height="245" rx="16" fill="#1E293B"/>
    <text x="310" y="24" textAnchor="middle" fill="#E2E8F0" fontSize="17" fontWeight="800" fontFamily="'Baloo 2'">Adaptation Helps Survival</text>
    <rect x="46" y="60" width="242" height="146" rx="14" fill="#0F172A" stroke="#F59E0B" strokeWidth="2"/>
    <text x="167" y="84" textAnchor="middle" fill="#F59E0B" fontSize="14" fontWeight="800" fontFamily="'Baloo 2'">Desert Camel</text>
    <ellipse cx="167" cy="150" rx="65" ry="30" fill="#D6A56B"/><circle cx="224" cy="132" r="18" fill="#D6A56B"/><rect x="128" y="100" width="40" height="26" rx="12" fill="#C08457"/>
    <line x1="132" y1="175" x2="125" y2="204" stroke="#D6A56B" strokeWidth="6"/><line x1="158" y1="175" x2="153" y2="204" stroke="#D6A56B" strokeWidth="6"/><line x1="185" y1="175" x2="190" y2="204" stroke="#D6A56B" strokeWidth="6"/><line x1="210" y1="175" x2="217" y2="204" stroke="#D6A56B" strokeWidth="6"/>
    <text x="167" y="223" textAnchor="middle" fill="#CBD5E1" fontSize="11" fontWeight="700" fontFamily="'Baloo 2'">hump, eyelashes, wide feet</text>
    <rect x="332" y="60" width="242" height="146" rx="14" fill="#0F172A" stroke="#22C55E" strokeWidth="2"/>
    <text x="453" y="84" textAnchor="middle" fill="#22C55E" fontSize="14" fontWeight="800" fontFamily="'Baloo 2'">Arctic Polar Bear</text>
    <ellipse cx="453" cy="152" rx="68" ry="26" fill="#F8FAFC"/><circle cx="505" cy="136" r="16" fill="#F8FAFC"/><circle cx="494" cy="123" r="5" fill="#E2E8F0"/><circle cx="515" cy="123" r="5" fill="#E2E8F0"/>
    <text x="453" y="223" textAnchor="middle" fill="#CBD5E1" fontSize="11" fontWeight="700" fontFamily="'Baloo 2'">fur, camouflage, fat layer</text>
  </svg></div>);
}

function SoundWavesSVG() {
  return (<div className="math-svg"><svg viewBox="0 0 620 245" xmlns="http://www.w3.org/2000/svg">
    <rect width="620" height="245" rx="16" fill="#1E293B"/>
    <text x="310" y="24" textAnchor="middle" fill="#E2E8F0" fontSize="17" fontWeight="800" fontFamily="'Baloo 2'">Sound Waves and Vibration</text>
    <rect x="60" y="94" width="48" height="74" rx="12" fill="#475569"/>
    <circle cx="130" cy="131" r="8" fill="#F59E0B"/>
    {[0,1,2,3,4].map(i => <path key={i} d={`M ${145+i*18} 131 q 9 -18 18 0 q 9 18 18 0`} fill="none" stroke="#38BDF8" strokeWidth="4"/>)}
    <text x="84" y="183" textAnchor="middle" fill="#CBD5E1" fontSize="11" fontWeight="700" fontFamily="'Baloo 2'">speaker</text>
    <text x="272" y="98" textAnchor="middle" fill="#38BDF8" fontSize="12" fontWeight="800" fontFamily="'Baloo 2'">sound wave</text>
    <path d="M400 92 q 10 -24 20 0 q 10 24 20 0 q 10 -24 20 0 q 10 24 20 0" fill="none" stroke="#A855F7" strokeWidth="4"/>
    <path d="M400 152 q 25 -10 50 0 q 25 10 50 0" fill="none" stroke="#22C55E" strokeWidth="4"/>
    <text x="486" y="82" textAnchor="middle" fill="#A855F7" fontSize="12" fontWeight="800" fontFamily="'Baloo 2'">high pitch</text>
    <text x="486" y="184" textAnchor="middle" fill="#22C55E" fontSize="12" fontWeight="800" fontFamily="'Baloo 2'">low pitch</text>
    <text x="310" y="224" textAnchor="middle" fill="#94A3B8" fontSize="12" fontWeight="700" fontFamily="'Baloo 2'">Sound is made by vibrations and travels through solids, liquids, and gases, but not through vacuum.</text>
  </svg></div>);
}

function PakistanMapSVG() {
  const legend = [["#38BDF8","KPK"],["#F59E0B","Punjab"],["#22C55E","Balochistan"],["#EF4444","Sindh"],["#8B5CF6","GB/AJK"]];
  return (<div className="math-svg"><svg viewBox="0 0 600 340" xmlns="http://www.w3.org/2000/svg">
    <rect width="600" height="340" rx="12" fill="#0F172A"/>
    <text x="300" y="19" textAnchor="middle" fill="#94A3B8" fontSize="13" fontWeight="700" fontFamily="'Baloo 2'">Pakistan - Provinces &amp; Borders</text>
    <polygon points="152,72 200,44 280,40 325,57 385,72 245,67 225,67" fill="#8B5CF6" opacity="0.78" stroke="#7C3AED" strokeWidth="1.5"/>
    <text x="268" y="60" textAnchor="middle" fill="#DDD6FE" fontSize="9" fontWeight="700" fontFamily="'Baloo 2'">Gilgit-Baltistan / AJK</text>
    <polygon points="92,135 155,72 225,67 245,84 245,164 188,184 122,169" fill="#38BDF8" opacity="0.78" stroke="#0EA5E9" strokeWidth="1.5"/>
    <text x="172" y="124" textAnchor="middle" fill="#E0F2FE" fontSize="11" fontWeight="700" fontFamily="'Baloo 2'">KPK</text>
    <text x="172" y="140" textAnchor="middle" fill="#BAE6FD" fontSize="9" fontFamily="'Baloo 2'">Peshawar</text>
    <polygon points="245,67 388,72 400,88 398,190 328,200 268,200 245,164 245,84" fill="#F59E0B" opacity="0.78" stroke="#D97706" strokeWidth="1.5"/>
    <text x="320" y="130" textAnchor="middle" fill="#FEF3C7" fontSize="13" fontWeight="700" fontFamily="'Baloo 2'">Punjab</text>
    <text x="320" y="148" textAnchor="middle" fill="#FDE68A" fontSize="9" fontFamily="'Baloo 2'">Lahore</text>
    <polygon points="92,169 122,169 188,184 245,200 268,200 258,290 200,300 138,290 92,225" fill="#22C55E" opacity="0.72" stroke="#16A34A" strokeWidth="1.5"/>
    <text x="176" y="248" textAnchor="middle" fill="#DCFCE7" fontSize="11" fontWeight="700" fontFamily="'Baloo 2'">Balochistan</text>
    <text x="176" y="266" textAnchor="middle" fill="#BBF7D0" fontSize="9" fontFamily="'Baloo 2'">Quetta</text>
    <polygon points="268,200 328,200 398,190 435,210 448,300 392,300 258,290" fill="#EF4444" opacity="0.72" stroke="#DC2626" strokeWidth="1.5"/>
    <text x="352" y="252" textAnchor="middle" fill="#FEE2E2" fontSize="11" fontWeight="700" fontFamily="'Baloo 2'">Sindh</text>
    <text x="352" y="270" textAnchor="middle" fill="#FECACA" fontSize="9" fontFamily="'Baloo 2'">Karachi</text>
    <circle cx="282" cy="104" r="6" fill="#F1F5F9" stroke="#F59E0B" strokeWidth="2"/>
    <text x="296" y="102" fill="#F59E0B" fontSize="9" fontWeight="700" fontFamily="'Baloo 2'">Islamabad</text>
    <text x="44" y="100" fill="#64748B" fontSize="10" fontWeight="700" fontFamily="'Baloo 2'">Afghanistan</text>
    <text x="44" y="210" fill="#64748B" fontSize="10" fontWeight="700" fontFamily="'Baloo 2'">Iran</text>
    <text x="300" y="24" textAnchor="middle" fill="#64748B" fontSize="10" fontWeight="700" fontFamily="'Baloo 2'">China</text>
    <text x="492" y="148" fill="#64748B" fontSize="10" fontWeight="700" fontFamily="'Baloo 2'">India</text>
    <text x="300" y="322" textAnchor="middle" fill="#38BDF8" fontSize="12" fontWeight="700" fontFamily="'Baloo 2'">Arabian Sea</text>
    {legend.map(([c, n], i) => (
      <g key={i}>
        <rect x={480} y={58 + i * 28} width="15" height="15" rx="3" fill={c} opacity="0.78"/>
        <text x={499} y={70 + i * 28} fill="#94A3B8" fontSize="10" fontFamily="'Baloo 2'">{n}</text>
      </g>
    ))}
  </svg></div>);
}

function IndusValleySVG() {
  const facts = ["2600-1900 BCE","South Asia (Pakistan)","Grid-plan streets","Drainage system","Standard weights","Undeciphered script","Agriculture & trade","Pottery & seals"];
  const timeline = [{x:32,l:"3000 BCE",s:"Early Indus",c:"#22C55E"},{x:148,l:"2600 BCE",s:"Peak Civilization",c:"#38BDF8"},{x:268,l:"1900 BCE",s:"Decline",c:"#EF4444"},{x:388,l:"1526 CE",s:"Mughal Empire",c:"#F59E0B"},{x:505,l:"1947",s:"Independence",c:"#A855F7"}];
  return (<div className="math-svg"><svg viewBox="0 0 600 300" xmlns="http://www.w3.org/2000/svg">
    <rect width="600" height="300" rx="12" fill="#1E293B"/>
    <text x="300" y="18" textAnchor="middle" fill="#94A3B8" fontSize="13" fontWeight="700" fontFamily="'Baloo 2'">Indus Valley Civilization - Mohenjo-daro</text>
    <rect x="18" y="28" width="176" height="152" rx="8" fill="#B4530930" stroke="#D97706" strokeWidth="2"/>
    <text x="106" y="46" textAnchor="middle" fill="#FDE68A" fontSize="11" fontWeight="700" fontFamily="'Baloo 2'">Citadel (Upper City)</text>
    <rect x="28" y="54" width="72" height="52" rx="5" fill="#38BDF840" stroke="#0EA5E9" strokeWidth="2"/>
    <text x="64" y="74" textAnchor="middle" fill="#F1F5F9" fontSize="10" fontWeight="700" fontFamily="'Baloo 2'">Great</text>
    <text x="64" y="88" textAnchor="middle" fill="#F1F5F9" fontSize="10" fontWeight="700" fontFamily="'Baloo 2'">Bath</text>
    <rect x="112" y="54" width="70" height="52" rx="5" fill="#F59E0B40" stroke="#D97706" strokeWidth="2"/>
    <text x="147" y="78" textAnchor="middle" fill="#FEF3C7" fontSize="10" fontWeight="700" fontFamily="'Baloo 2'">Granary</text>
    <text x="147" y="96" textAnchor="middle" fill="#FDE68A" fontSize="8" fontFamily="'Baloo 2'">Food Store</text>
    <rect x="28" y="116" width="154" height="56" rx="5" fill="#A855F730" stroke="#9333EA" strokeWidth="1.5"/>
    <text x="105" y="148" textAnchor="middle" fill="#E9D5FF" fontSize="10" fontWeight="700" fontFamily="'Baloo 2'">Assembly Hall</text>
    <rect x="206" y="28" width="240" height="152" rx="8" fill="#64748B18" stroke="#475569" strokeWidth="2"/>
    <text x="326" y="45" textAnchor="middle" fill="#CBD5E1" fontSize="11" fontWeight="700" fontFamily="'Baloo 2'">Lower City (Residential)</text>
    {[0,1,2,3].map(i => <line key={"h"+i} x1="206" y1={54+i*40} x2="446" y2={54+i*40} stroke="#94A3B8" strokeWidth="1" opacity="0.5"/>)}
    {[0,1,2,3,4].map(i => <line key={"v"+i} x1={214+i*46} y1="28" x2={214+i*46} y2="180" stroke="#94A3B8" strokeWidth="1" opacity="0.5"/>)}
    {[[214,54],[260,54],[306,54],[352,54],[214,94],[260,94],[306,94],[352,94],[214,134],[260,134]].map(([x,y],i) => (
      <rect key={i} x={x+2} y={y+2} width="38" height="34" rx="4" fill="#92400E" opacity="0.4" stroke="#D97706" strokeWidth="1"/>
    ))}
    <circle cx="380" cy="140" r="11" fill="#38BDF840" stroke="#0EA5E9" strokeWidth="1.5"/>
    <text x="380" y="160" textAnchor="middle" fill="#94A3B8" fontSize="8" fontFamily="'Baloo 2'">Public Well</text>
    <rect x="458" y="28" width="132" height="152" rx="8" fill="#1E3A5F" stroke="#38BDF8" strokeWidth="1.5"/>
    <text x="524" y="46" textAnchor="middle" fill="#38BDF8" fontSize="10" fontWeight="700" fontFamily="'Baloo 2'">Key Facts</text>
    {facts.map((f,i) => <text key={i} x="466" y={60+i*18} fill="#CBD5E1" fontSize="8.5" fontFamily="'Baloo 2'">{f}</text>)}
    <rect x="10" y="188" width="580" height="102" rx="8" fill="#0F172A" stroke="#334155" strokeWidth="1"/>
    <text x="300" y="204" textAnchor="middle" fill="#94A3B8" fontSize="10" fontWeight="700" fontFamily="'Baloo 2'">Timeline - Civilizations in Pakistan</text>
    <line x1="28" y1="225" x2="572" y2="225" stroke="#334155" strokeWidth="1.5"/>
    {timeline.map((t,i) => (
      <g key={i}>
        <circle cx={t.x} cy={225} r="6" fill={t.c}/>
        <text x={t.x} y={218} textAnchor="middle" fill={t.c} fontSize="8.5" fontWeight="700" fontFamily="'Baloo 2'">{t.l}</text>
        <text x={t.x} y={238} textAnchor="middle" fill="#94A3B8" fontSize="8" fontFamily="'Baloo 2'">{t.s}</text>
      </g>
    ))}
  </svg></div>);
}

function PakFlagSVG() {
  const symbols = [
    {e:"Animal",n:"National Animal",v:"Snow Leopard"},
    {e:"Flower",n:"National Flower",v:"Jasmine"},
    {e:"Bird",n:"National Bird",v:"Shaheen"},
    {e:"Tree",n:"National Tree",v:"Deodar Cedar"},
    {e:"Fruit",n:"National Fruit",v:"Mango"},
    {e:"Sport",n:"National Sport",v:"Field Hockey"},
  ];
  return (<div className="math-svg"><svg viewBox="0 0 600 280" xmlns="http://www.w3.org/2000/svg">
    <rect width="600" height="280" rx="12" fill="#1E293B"/>
    <text x="300" y="18" textAnchor="middle" fill="#94A3B8" fontSize="13" fontWeight="700" fontFamily="'Baloo 2'">Pakistan - National Identity &amp; Symbols</text>
    <rect x="18" y="28" width="208" height="136" rx="6" fill="#01411C" stroke="#334155" strokeWidth="2"/>
    <rect x="18" y="28" width="42" height="136" fill="#F8FAFC"/>
    <text x="138" y="108" textAnchor="middle" fill="#F8FAFC" fontSize="52">☪</text>
    <text x="122" y="180" textAnchor="middle" fill="#22C55E" fontSize="11" fontWeight="700" fontFamily="'Baloo 2'">Pakistan Flag</text>
    {[
      "Green = Muslim majority",
      "White = Religious minorities",
      "Crescent = Progress",
      "Star = Light & knowledge",
    ].map((t, i) => <text key={i} x="18" y={196+i*14} fill="#64748B" fontSize="9.5" fontFamily="'Baloo 2'">{t}</text>)}
    <rect x="18" y="250" width="208" height="24" rx="6" fill="#22C55E18" stroke="#22C55E" strokeWidth="1"/>
    <text x="122" y="262" textAnchor="middle" fill="#22C55E" fontSize="9" fontWeight="700" fontFamily="'Baloo 2'">Qaumi Tarana - Hafeez Jalandhari</text>
    {symbols.map((s,i) => {
      const col = i % 3;
      const row = Math.floor(i / 3);
      const sx = 238 + col * 118;
      const sy = 28 + row * 124;
      return (<g key={i}>
        <rect x={sx} y={sy} width="112" height="116" rx="8" fill="#334155" stroke="#475569" strokeWidth="1.5"/>
        <text x={sx+56} y={sy+38} textAnchor="middle" fill="#F1F5F9" fontSize="16" fontWeight="700" fontFamily="'Baloo 2'">{s.e}</text>
        <text x={sx+56} y={sy+56} textAnchor="middle" fill="#94A3B8" fontSize="9" fontFamily="'Baloo 2'">{s.n}</text>
        <line x1={sx+8} y1={sy+62} x2={sx+104} y2={sy+62} stroke="#475569" strokeWidth="1"/>
        <text x={sx+56} y={sy+80} textAnchor="middle" fill="#F1F5F9" fontSize="11" fontWeight="700" fontFamily="'Baloo 2'">{s.v}</text>
      </g>);
    })}
  </svg></div>);
}

function PakGovSVG() {
  return (<div className="math-svg"><svg viewBox="0 0 600 296" xmlns="http://www.w3.org/2000/svg">
    <rect width="600" height="296" rx="12" fill="#1E293B"/>
    <text x="300" y="18" textAnchor="middle" fill="#94A3B8" fontSize="13" fontWeight="700" fontFamily="'Baloo 2'">Pakistan's Government Structure</text>
    <rect x="222" y="26" width="156" height="46" rx="8" fill="#F59E0B18" stroke="#F59E0B" strokeWidth="2"/>
    <text x="300" y="45" textAnchor="middle" fill="#F59E0B" fontSize="12" fontWeight="700" fontFamily="'Baloo 2'">President</text>
    <text x="300" y="60" textAnchor="middle" fill="#FDE68A" fontSize="9" fontFamily="'Baloo 2'">Head of State</text>
    <line x1="300" y1="72" x2="300" y2="88" stroke="#475569" strokeWidth="2"/>
    <rect x="208" y="88" width="184" height="46" rx="8" fill="#A855F718" stroke="#A855F7" strokeWidth="2"/>
    <text x="300" y="107" textAnchor="middle" fill="#A855F7" fontSize="12" fontWeight="700" fontFamily="'Baloo 2'">Prime Minister</text>
    <text x="300" y="122" textAnchor="middle" fill="#E9D5FF" fontSize="9" fontFamily="'Baloo 2'">Head of Government</text>
    <line x1="300" y1="134" x2="300" y2="148" stroke="#475569" strokeWidth="2"/>
    <rect x="218" y="148" width="164" height="40" rx="8" fill="#38BDF818" stroke="#38BDF8" strokeWidth="1.5"/>
    <text x="300" y="165" textAnchor="middle" fill="#38BDF8" fontSize="11" fontWeight="700" fontFamily="'Baloo 2'">Federal Cabinet</text>
    <text x="300" y="180" textAnchor="middle" fill="#BAE6FD" fontSize="9" fontFamily="'Baloo 2'">Ministers of departments</text>
    <line x1="300" y1="188" x2="300" y2="204" stroke="#475569" strokeWidth="2"/>
    <line x1="144" y1="204" x2="456" y2="204" stroke="#475569" strokeWidth="2"/>
    <line x1="144" y1="204" x2="144" y2="218" stroke="#475569" strokeWidth="2"/>
    <line x1="300" y1="204" x2="300" y2="218" stroke="#475569" strokeWidth="2"/>
    <line x1="456" y1="204" x2="456" y2="218" stroke="#475569" strokeWidth="2"/>
    <rect x="54" y="218" width="180" height="48" rx="8" fill="#22C55E18" stroke="#22C55E" strokeWidth="1.5"/>
    <text x="144" y="236" textAnchor="middle" fill="#22C55E" fontSize="11" fontWeight="700" fontFamily="'Baloo 2'">Senate</text>
    <text x="144" y="250" textAnchor="middle" fill="#BBF7D0" fontSize="9" fontFamily="'Baloo 2'">Upper House</text>
    <rect x="218" y="218" width="164" height="48" rx="8" fill="#EC489918" stroke="#EC4899" strokeWidth="1.5"/>
    <text x="300" y="236" textAnchor="middle" fill="#EC4899" fontSize="11" fontWeight="700" fontFamily="'Baloo 2'">Supreme Court</text>
    <text x="300" y="250" textAnchor="middle" fill="#FBCFE8" fontSize="9" fontFamily="'Baloo 2'">Judiciary</text>
    <rect x="366" y="218" width="180" height="48" rx="8" fill="#EF444418" stroke="#EF4444" strokeWidth="1.5"/>
    <text x="456" y="236" textAnchor="middle" fill="#EF4444" fontSize="11" fontWeight="700" fontFamily="'Baloo 2'">National Assembly</text>
    <text x="456" y="250" textAnchor="middle" fill="#FECACA" fontSize="9" fontFamily="'Baloo 2'">Lower House</text>
    <text x="300" y="286" textAnchor="middle" fill="#475569" fontSize="9.5" fontFamily="'Baloo 2'">Governed by the 1973 Constitution</text>
  </svg></div>);
}



function PresidentialSystemSVG() {
  return (<div className="math-svg"><svg viewBox="0 0 600 300" xmlns="http://www.w3.org/2000/svg">
    <rect width="600" height="300" rx="12" fill="#0F172A"/>
    <text x="300" y="18" textAnchor="middle" fill="#94A3B8" fontSize="13" fontWeight="700" fontFamily="'Baloo 2'">Presidential System</text>
    <rect x="220" y="28" width="160" height="48" rx="8" fill="#F59E0B18" stroke="#F59E0B" strokeWidth="2"/>
    <text x="300" y="48" textAnchor="middle" fill="#F59E0B" fontSize="12" fontWeight="700" fontFamily="'Baloo 2'">President</text>
    <text x="300" y="63" textAnchor="middle" fill="#FDE68A" fontSize="9" fontFamily="'Baloo 2'">Executive leader for a fixed term</text>
    <line x1="300" y1="76" x2="300" y2="100" stroke="#475569" strokeWidth="2"/>
    <rect x="212" y="100" width="176" height="38" rx="8" fill="#1E293B" stroke="#64748B"/>
    <text x="300" y="122" textAnchor="middle" fill="#E2E8F0" fontSize="10.5" fontWeight="700" fontFamily="'Baloo 2'">Cabinet and ministries</text>
    <rect x="52" y="176" width="140" height="54" rx="10" fill="#38BDF818" stroke="#38BDF8" strokeWidth="2"/>
    <text x="122" y="197" textAnchor="middle" fill="#38BDF8" fontSize="12" fontWeight="700" fontFamily="'Baloo 2'">Legislature</text>
    <text x="122" y="216" textAnchor="middle" fill="#BAE6FD" fontSize="9" fontFamily="'Baloo 2'">Makes laws</text>
    <rect x="230" y="176" width="140" height="54" rx="10" fill="#22C55E18" stroke="#22C55E" strokeWidth="2"/>
    <text x="300" y="197" textAnchor="middle" fill="#22C55E" fontSize="12" fontWeight="700" fontFamily="'Baloo 2'">Executive</text>
    <text x="300" y="216" textAnchor="middle" fill="#BBF7D0" fontSize="9" fontFamily="'Baloo 2'">Runs government</text>
    <rect x="408" y="176" width="140" height="54" rx="10" fill="#A855F718" stroke="#A855F7" strokeWidth="2"/>
    <text x="478" y="197" textAnchor="middle" fill="#C4B5FD" fontSize="12" fontWeight="700" fontFamily="'Baloo 2'">Judiciary</text>
    <text x="478" y="216" textAnchor="middle" fill="#DDD6FE" fontSize="9" fontFamily="'Baloo 2'">Interprets laws</text>
    <line x1="122" y1="176" x2="300" y2="144" stroke="#334155" strokeWidth="2"/>
    <line x1="300" y1="176" x2="300" y2="144" stroke="#334155" strokeWidth="2"/>
    <line x1="478" y1="176" x2="300" y2="144" stroke="#334155" strokeWidth="2"/>
    <rect x="148" y="252" width="304" height="28" rx="8" fill="#111827" stroke="#334155"/>
    <text x="300" y="270" textAnchor="middle" fill="#CBD5E1" fontSize="10" fontFamily="'Baloo 2'">Checks and balances stop one branch from taking all power</text>
  </svg></div>);
}

function FederalParliamentrySVG() {
  return (<div className="math-svg"><svg viewBox="0 0 620 308" xmlns="http://www.w3.org/2000/svg">
    <rect width="620" height="308" rx="12" fill="#1E293B"/>
    <text x="310" y="18" textAnchor="middle" fill="#94A3B8" fontSize="13" fontWeight="700" fontFamily="'Baloo 2'">Federal Parliamentry System</text>
    <rect x="246" y="28" width="128" height="40" rx="8" fill="#22C55E18" stroke="#22C55E" strokeWidth="2"/>
    <text x="310" y="50" textAnchor="middle" fill="#22C55E" fontSize="11.5" fontWeight="700" fontFamily="'Baloo 2'">Citizens / Voters</text>
    <line x1="310" y1="68" x2="310" y2="94" stroke="#475569" strokeWidth="2"/>
    <rect x="136" y="94" width="348" height="52" rx="10" fill="#38BDF818" stroke="#38BDF8" strokeWidth="2"/>
    <text x="310" y="116" textAnchor="middle" fill="#38BDF8" fontSize="12" fontWeight="700" fontFamily="'Baloo 2'">Parliament</text>
    <text x="310" y="132" textAnchor="middle" fill="#BAE6FD" fontSize="9" fontFamily="'Baloo 2'">National Assembly represents people • Senate represents provinces</text>
    <rect x="238" y="176" width="144" height="48" rx="8" fill="#F59E0B18" stroke="#F59E0B" strokeWidth="2"/>
    <text x="310" y="196" textAnchor="middle" fill="#F59E0B" fontSize="11.5" fontWeight="700" fontFamily="'Baloo 2'">Prime Minister</text>
    <text x="310" y="212" textAnchor="middle" fill="#FDE68A" fontSize="9" fontFamily="'Baloo 2'">Head of government from parliamentary majority</text>
    <rect x="54" y="176" width="126" height="48" rx="8" fill="#A855F718" stroke="#A855F7" strokeWidth="2"/>
    <text x="117" y="196" textAnchor="middle" fill="#C4B5FD" fontSize="11" fontWeight="700" fontFamily="'Baloo 2'">President</text>
    <text x="117" y="212" textAnchor="middle" fill="#DDD6FE" fontSize="8.8" fontFamily="'Baloo 2'">Head of state</text>
    <rect x="440" y="176" width="126" height="48" rx="8" fill="#14B8A618" stroke="#14B8A6" strokeWidth="2"/>
    <text x="503" y="196" textAnchor="middle" fill="#5EEAD4" fontSize="11" fontWeight="700" fontFamily="'Baloo 2'">Provinces</text>
    <text x="503" y="212" textAnchor="middle" fill="#99F6E4" fontSize="8.8" fontFamily="'Baloo 2'">Assemblies share federal power</text>
    <line x1="310" y1="146" x2="310" y2="176" stroke="#475569" strokeWidth="2"/>
    <line x1="180" y1="200" x2="238" y2="200" stroke="#475569" strokeWidth="2"/>
    <line x1="382" y1="200" x2="440" y2="200" stroke="#475569" strokeWidth="2"/>
    <rect x="144" y="250" width="332" height="30" rx="8" fill="#0F172A" stroke="#334155"/>
    <text x="310" y="269" textAnchor="middle" fill="#CBD5E1" fontSize="10" fontFamily="'Baloo 2'">The 1973 Constitution explains how federal and parliamentary institutions work together</text>
  </svg></div>);
}

function PakRiversSVG() {
  const rivers = [
    {n:"Indus",km:"3,180 km",c:"#38BDF8",note:"Longest - main artery"},
    {n:"Jhelum",km:"725 km",c:"#22C55E",note:"Punjab - Mangla Dam"},
    {n:"Chenab",km:"960 km",c:"#A855F7",note:"Joins Indus in Sindh"},
    {n:"Ravi",km:"720 km",c:"#F59E0B",note:"Flows past Lahore"},
    {n:"Kabul",km:"700 km",c:"#EC4899",note:"Meets Indus at Attock"},
    {n:"Sutlej",km:"1,551 km",c:"#14B8A6",note:"Enters from India"},
  ];
  return (<div className="math-svg"><svg viewBox="0 0 630 295" xmlns="http://www.w3.org/2000/svg">
    <rect width="630" height="295" rx="12" fill="#0F172A"/>
    <text x="315" y="18" textAnchor="middle" fill="#94A3B8" fontSize="13" fontWeight="700" fontFamily="'Baloo 2'">Pakistan's Rivers &amp; Water System</text>
    <rect x="18" y="26" width="368" height="256" rx="8" fill="#1E3A5F14" stroke="#334155" strokeWidth="1"/>
    <polygon points="18,95 48,52 90,72 130,44 168,64 198,40 232,57 268,36 300,54 340,30 372,50 386,95" fill="#64748B" opacity="0.45"/>
    <text x="202" y="72" textAnchor="middle" fill="#94A3B8" fontSize="9" fontFamily="'Baloo 2'">Himalayas / Karakoram / Hindu Kush</text>
    <path d="M232,44 Q236,82 222,118 Q212,154 217,194 Q220,234 212,268" fill="none" stroke="#38BDF8" strokeWidth="5.5" strokeLinecap="round" opacity="0.9"/>
    <text x="168" y="178" fill="#38BDF8" fontSize="12" fontWeight="700" fontFamily="'Baloo 2'">Indus River</text>
    <path d="M298,48 Q292,82 283,112 Q267,142 244,162 Q234,167 222,168" fill="none" stroke="#22C55E" strokeWidth="3" strokeLinecap="round" opacity="0.85"/>
    <text x="276" y="112" fill="#22C55E" fontSize="9" fontWeight="700" fontFamily="'Baloo 2'">Jhelum</text>
    <path d="M332,52 Q322,82 312,114 Q297,142 272,160 Q257,165 242,166" fill="none" stroke="#A855F7" strokeWidth="3" strokeLinecap="round" opacity="0.85"/>
    <text x="314" y="110" fill="#A855F7" fontSize="9" fontWeight="700" fontFamily="'Baloo 2'">Chenab</text>
    <path d="M362,57 Q350,82 340,107 Q322,132 302,150 Q282,160 267,160" fill="none" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" opacity="0.85"/>
    <text x="346" y="102" fill="#F59E0B" fontSize="9" fontWeight="700" fontFamily="'Baloo 2'">Ravi</text>
    <path d="M18,110 Q78,110 132,114 Q178,118 217,118" fill="none" stroke="#EC4899" strokeWidth="2.5" strokeLinecap="round" opacity="0.85"/>
    <text x="82" y="106" fill="#EC4899" fontSize="9" fontWeight="700" fontFamily="'Baloo 2'">Kabul</text>
    {[{x:234,y:102,n:"Tarbela",c:"#EF4444"},{x:287,y:128,n:"Mangla",c:"#EF4444"},{x:172,y:118,n:"Warsak",c:"#F97316"}].map((d,i) => (
      <g key={i}>
        <rect x={d.x-13} y={d.y-9} width="26" height="18" rx="3" fill={d.c} opacity="0.85"/>
        <text x={d.x} y={d.y+5} textAnchor="middle" fill="#F1F5F9" fontSize="7" fontWeight="700" fontFamily="'Baloo 2'">DAM</text>
        <text x={d.x} y={d.y-13} textAnchor="middle" fill={d.c} fontSize="8.5" fontWeight="700" fontFamily="'Baloo 2'">{d.n}</text>
      </g>
    ))}
    <rect x="18" y="268" width="368" height="14" fill="#38BDF8" opacity="0.25"/>
    <text x="202" y="279" textAnchor="middle" fill="#38BDF8" fontSize="9.5" fontFamily="'Baloo 2'">Arabian Sea</text>
    <rect x="398" y="26" width="220" height="256" rx="8" fill="#1E293B" stroke="#334155" strokeWidth="1"/>
    <text x="508" y="44" textAnchor="middle" fill="#38BDF8" fontSize="12" fontWeight="700" fontFamily="'Baloo 2'">Major Rivers</text>
    {rivers.map((r,i) => (
      <g key={i}>
        <line x1="406" y1={58+i*34} x2="610" y2={58+i*34} stroke={r.c} strokeWidth="2.5" opacity="0.7"/>
        <text x="408" y={72+i*34} fill={r.c} fontSize="10" fontWeight="700" fontFamily="'Baloo 2'">{r.n} ({r.km})</text>
        <text x="408" y={84+i*34} fill="#64748B" fontSize="8.5" fontFamily="'Baloo 2'">{r.note}</text>
      </g>
    ))}
  </svg></div>);
}

function ColumnAddSVG({ num1, num2, result }) {
  const sr = String(result).split("");
  const maxL = sr.length;
  const s1 = String(num1).padStart(maxL," ").split("");
  const s2 = String(num2).padStart(maxL," ").split("");
  // Calculate carries from right to left
  const d1r = String(num1).split("").reverse().map(Number);
  const d2r = String(num2).split("").reverse().map(Number);
  const carryArr = new Array(maxL).fill(0);
  let carry = 0;
  for(let i=0; i<d1r.length || i<d2r.length; i++){
    const sum = (d1r[i]||0)+(d2r[i]||0)+carry;
    carry = sum >= 10 ? 1 : 0;
    // carry goes to position (maxL - 1 - i - 1) which is the column to the left
    if(carry && (maxL-2-i) >= 0) carryArr[maxL-2-i] = 1;
  }
  const cw = 48, pad = 55;
  const w = maxL * cw + pad + 20, h = 200;
  const xOf = (i) => pad + i * cw + cw/2;
  return (<div className="math-svg"><svg viewBox={`0 0 ${w} ${h}`} xmlns="http://www.w3.org/2000/svg">
    <rect width={w} height={h} rx="12" fill="#1E293B"/>
    <text x={w-10} y="18" textAnchor="end" fill="#64748B" fontSize="11" fontFamily="'Baloo 2'">Column Addition</text>
    {/* Carry circles */}
    {carryArr.map((c,i) => c ? <g key={"c"+i}>
      <circle cx={xOf(i)} cy="40" r="14" fill="#F59E0B22" stroke="#F59E0B" strokeWidth="1.5"/>
      <text x={xOf(i)} y="45" textAnchor="middle" fill="#F59E0B" fontSize="15" fontWeight="800" fontFamily="'Baloo 2'">1</text>
      <path d={`M${xOf(i+1)-5},62 Q${xOf(i+1)-cw/2},30 ${xOf(i)+5},50`} fill="none" stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="3" opacity="0.6"/>
    </g> : null)}
    {/* Number 1 */}
    {s1.map((d,i) => d!==" " ? <text key={"a"+i} x={xOf(i)} y="85" textAnchor="middle" fill="#38BDF8" fontSize="28" fontWeight="800" fontFamily="'Baloo 2'">{d}</text> : null)}
    {/* + sign and Number 2 */}
    <text x="22" y="122" fill="#22C55E" fontSize="26" fontWeight="900" fontFamily="'Baloo 2'">+</text>
    {s2.map((d,i) => d!==" " ? <text key={"b"+i} x={xOf(i)} y="122" textAnchor="middle" fill="#22C55E" fontSize="28" fontWeight="800" fontFamily="'Baloo 2'">{d}</text> : null)}
    {/* Line */}
    <line x1="12" y1="135" x2={w-12} y2="135" stroke="#F59E0B" strokeWidth="3"/>
    {/* Answer */}
    {sr.map((d,i) => <text key={"r"+i} x={xOf(i)} y="172" textAnchor="middle" fill="#F1F5F9" fontSize="30" fontWeight="900" fontFamily="'Baloo 2'">{d}</text>)}
  </svg></div>);
}

function ColumnSubSVG({ num1, num2, result }) {
  const maxL = Math.max(String(num1).length, String(num2).length, String(result).length);
  const s1 = String(num1).padStart(maxL,"0").split("").map(Number);
  const s2 = String(num2).padStart(maxL,"0").split("").map(Number);
  const sr = String(result).padStart(maxL," ").split("");
  // Simulate borrowing: track original and modified top digits
  const newTop = [...s1];
  const changed = new Array(maxL).fill(false); // any column whose value changed
  for(let i=maxL-1; i>=0; i--){
    if(newTop[i] < s2[i]){
      // Need to borrow - find nearest left column with value > 0
      let j = i-1;
      while(j >= 0 && newTop[j] === 0){ newTop[j] = 9; changed[j] = true; j--; }
      if(j >= 0){ newTop[j] -= 1; changed[j] = true; }
      newTop[i] += 10;
      changed[i] = true;
    }
  }
  const cw = 48, pad = 55;
  const w = maxL * cw + pad + 20, h = 210;
  const xOf = (i) => pad + i * cw + cw/2;
  return (<div className="math-svg"><svg viewBox={`0 0 ${w} ${h}`} xmlns="http://www.w3.org/2000/svg">
    <rect width={w} height={h} rx="12" fill="#1E293B"/>
    <text x={w-10} y="18" textAnchor="end" fill="#64748B" fontSize="11" fontFamily="'Baloo 2'">Borrowing</text>
    {/* Borrow annotations above */}
    {changed.map((ch,i) => {
      if(!ch) return null;
      const gave = newTop[i] < s1[i]; // this column gave (decreased)
      const got = newTop[i] > s1[i];  // this column received (increased to 10+)
      return (<g key={"bw"+i}>
        {/* Crossed-out original */}
        <text x={xOf(i)+12} y="38" textAnchor="middle" fill="#EF4444" fontSize="12" fontWeight="600" fontFamily="'Baloo 2'" opacity="0.5"><tspan textDecoration="line-through">{s1[i]}</tspan></text>
        {/* New value in circle */}
        <circle cx={xOf(i)-8} cy="42" r="13" fill={got?"#22C55E22":"#F59E0B22"} stroke={got?"#22C55E":"#F59E0B"} strokeWidth="1.5"/>
        <text x={xOf(i)-8} y="47" textAnchor="middle" fill={got?"#22C55E":"#F59E0B"} fontSize="13" fontWeight="800" fontFamily="'Baloo 2'">{newTop[i]}</text>
        {/* Arrow from lender to receiver */}
        {got && i > 0 && <path d={`M${xOf(i-1)+10},55 Q${xOf(i)-cw/2+10},25 ${xOf(i)-20},35`} fill="none" stroke="#F59E0B" strokeWidth="2" markerEnd="url(#bArr)"/>}
      </g>);
    })}
    {/* Number 1 - original digits (faded if changed) */}
    {s1.map((d,i) => <text key={"a"+i} x={xOf(i)} y="82" textAnchor="middle" fill="#38BDF8" fontSize="28" fontWeight="800" fontFamily="'Baloo 2'" opacity={changed[i]?0.25:1}>{d}</text>)}
    {/* − sign and Number 2 */}
    <text x="22" y="118" fill="#EF4444" fontSize="26" fontWeight="900" fontFamily="'Baloo 2'">−</text>
    {s2.map((d,i) => <text key={"b"+i} x={xOf(i)} y="118" textAnchor="middle" fill="#EF4444" fontSize="28" fontWeight="800" fontFamily="'Baloo 2'">{d}</text>)}
    {/* Line */}
    <line x1="12" y1="132" x2={w-12} y2="132" stroke="#EF4444" strokeWidth="3"/>
    {/* Answer */}
    {sr.map((d,i) => <text key={"r"+i} x={xOf(i)} y="170" textAnchor="middle" fill="#F1F5F9" fontSize="30" fontWeight="900" fontFamily="'Baloo 2'">{d}</text>)}
    <defs><marker id="bArr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#F59E0B"/></marker></defs>
  </svg></div>);
}

function EstimationSVG({ num1, num2, op, rounded1, rounded2, estimate, exact }) {
  const opSym = op === "+" ? "+" : "−";
  const opCol = op === "+" ? "#22C55E" : "#EF4444";
  return (<div className="math-svg"><svg viewBox="0 0 580 130" xmlns="http://www.w3.org/2000/svg">
    <rect width="580" height="130" rx="12" fill="#1E293B"/>
    <text x="290" y="18" textAnchor="middle" fill="#64748B" fontSize="12" fontWeight="700" fontFamily="'Baloo 2'">Estimation: Round → Calculate</text>
    {/* Original */}
    <rect x="15" y="30" width="130" height="85" rx="10" fill="#38BDF822" stroke="#38BDF8" strokeWidth="1.5"/>
    <text x="80" y="52" textAnchor="middle" fill="#38BDF8" fontSize="11" fontWeight="700" fontFamily="'Baloo 2'">Original</text>
    <text x="80" y="75" textAnchor="middle" fill="#F1F5F9" fontSize="18" fontWeight="800" fontFamily="'Baloo 2'">{num1.toLocaleString()}</text>
    <text x="80" y="95" textAnchor="middle" fill={opCol} fontSize="16" fontWeight="800" fontFamily="'Baloo 2'">{opSym} {num2.toLocaleString()}</text>
    {/* Arrow */}
    <line x1="155" y1="72" x2="195" y2="72" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round"/>
    <polygon points="195,67 205,72 195,77" fill="#F59E0B"/>
    <text x="180" y="62" textAnchor="middle" fill="#F59E0B" fontSize="10" fontWeight="700" fontFamily="'Baloo 2'">Round</text>
    {/* Rounded */}
    <rect x="215" y="30" width="130" height="85" rx="10" fill="#F59E0B22" stroke="#F59E0B" strokeWidth="1.5"/>
    <text x="280" y="52" textAnchor="middle" fill="#F59E0B" fontSize="11" fontWeight="700" fontFamily="'Baloo 2'">Rounded</text>
    <text x="280" y="75" textAnchor="middle" fill="#F1F5F9" fontSize="18" fontWeight="800" fontFamily="'Baloo 2'">{rounded1.toLocaleString()}</text>
    <text x="280" y="95" textAnchor="middle" fill={opCol} fontSize="16" fontWeight="800" fontFamily="'Baloo 2'">{opSym} {rounded2.toLocaleString()}</text>
    {/* Arrow */}
    <line x1="355" y1="72" x2="395" y2="72" stroke="#A855F7" strokeWidth="2.5" strokeLinecap="round"/>
    <polygon points="395,67 405,72 395,77" fill="#A855F7"/>
    {/* Result */}
    <rect x="415" y="30" width="150" height="85" rx="10" fill="#22C55E22" stroke="#22C55E" strokeWidth="1.5"/>
    <text x="490" y="52" textAnchor="middle" fill="#22C55E" fontSize="11" fontWeight="700" fontFamily="'Baloo 2'">Estimate</text>
    <text x="490" y="78" textAnchor="middle" fill="#F1F5F9" fontSize="24" fontWeight="900" fontFamily="'Baloo 2'">≈ {estimate.toLocaleString()}</text>
    <text x="490" y="102" textAnchor="middle" fill="#94A3B8" fontSize="11" fontFamily="'Baloo 2'">Exact: {exact.toLocaleString()}</text>
  </svg></div>);
}

function getMathVisualTheme(sub, lessonTitle) {
  const title = `${lessonTitle || ""} ${sub?.t || ""}`.toLowerCase();
  if (/fraction|decimal|ratio|percent/.test(title)) return { accent: "#8B5CF6", soft: "#EDE9FE", dark: "#312E81", chip: "#C4B5FD" };
  if (/algebra|unknown|equation|symbol/.test(title)) return { accent: "#EC4899", soft: "#FCE7F3", dark: "#831843", chip: "#F9A8D4" };
  if (/graph|data|pattern|sequence/.test(title)) return { accent: "#14B8A6", soft: "#CCFBF1", dark: "#134E4A", chip: "#5EEAD4" };
  if (/measure|time|temperature|area|volume|perimeter|shape|angle|line/.test(title)) return { accent: "#F97316", soft: "#FFEDD5", dark: "#9A3412", chip: "#FDBA74" };
  if (/multiply|division|table|factor|multiple|prime|lcm|hcf/.test(title)) return { accent: "#22C55E", soft: "#DCFCE7", dark: "#14532D", chip: "#86EFAC" };
  return { accent: "#38BDF8", soft: "#E0F2FE", dark: "#0F172A", chip: "#7DD3FC" };
}

function clipSvgText(text, maxLength = 140) {
  const clean = normalizeText(text);
  if (clean.length <= maxLength) return clean;
  return clean.slice(0, Math.max(0, maxLength - 1)).trimEnd() + "…";
}

function wrapSvgLines(text, maxChars = 30, maxLines = 4) {
  const words = clipSvgText(text, maxChars * maxLines + 20).split(/\s+/).filter(Boolean);
  const lines = [];
  let current = "";
  words.forEach(word => {
    const next = current ? `${current} ${word}` : word;
    if (next.length <= maxChars) current = next;
    else {
      if (current) lines.push(current);
      current = word;
    }
  });
  if (current) lines.push(current);
  if (lines.length <= maxLines) return lines;
  const trimmed = lines.slice(0, maxLines);
  trimmed[maxLines - 1] = trimmed[maxLines - 1].replace(/…?$/, "") + "…";
  return trimmed;
}

function SvgTextBlock({ text, x, y, maxChars = 30, maxLines = 4, lineHeight = 18, fill = "#E2E8F0", anchor = "start", size = 14, weight = 600 }) {
  const lines = wrapSvgLines(text, maxChars, maxLines);
  return (
    <text x={x} y={y} textAnchor={anchor} fill={fill} fontSize={size} fontWeight={weight} fontFamily="'Baloo 2'">
      {lines.map((line, idx) => <tspan key={idx} x={x} dy={idx === 0 ? 0 : lineHeight}>{line}</tspan>)}
    </text>
  );
}

function getUniqueMathText(items, limit) {
  const seen = new Set();
  const out = [];
  items.forEach(item => {
    const clean = clipSvgText(item, 150);
    const key = clean.toLowerCase();
    if (!clean || seen.has(key)) return;
    seen.add(key);
    out.push(clean);
  });
  return out.slice(0, limit);
}

function getMathSummaryPoints(sub) {
  const points = [];
  splitFactSentences(sub?.c).forEach(line => points.push(line));
  (sub?.examples || []).forEach(line => points.push(line));
  return getUniqueMathText(points, 3);
}

function getMathWorkedExamples(sub) {
  const examples = getUniqueMathText(sub?.examples || [], 3);
  if (examples.length >= 3) return examples;
  const derived = [...examples];
  (sub?.exercises || []).forEach(ex => {
    if (!Array.isArray(ex.parts) || !Array.isArray(ex.ans)) return;
    ex.parts.forEach((part, idx) => {
      if (derived.length >= 3) return;
      derived.push(`${trimQuestionText(part)} -> ${normalizeText(ex.ans[idx])}`);
    });
  });
  return getUniqueMathText(derived, 3);
}

function getMathPracticeExample(sub) {
  if (Array.isArray(sub?.wordProblems) && sub.wordProblems.length) return sub.wordProblems[0];
  if (Array.isArray(sub?.quiz) && sub.quiz.length) return sub.quiz[0].q;
  if (Array.isArray(sub?.examples) && sub.examples.length) return sub.examples[0];
  return sub?.c || "";
}

function getMathQuickRule(sub, lessonTitle) {
  const title = `${lessonTitle || ""} ${sub?.t || ""}`.toLowerCase();
  if (/place value/.test(title)) return "Value = digit × its place.";
  if (/expanded form/.test(title)) return "Write each non-zero place value separately, then add.";
  if (/comparing/.test(title)) return "More digits wins; otherwise compare from the left.";
  if (/rounding/.test(title)) return "Look one place to the right before rounding.";
  if (/number lines/.test(title)) return "Equal spacing helps you locate, compare, and jump correctly.";
  if (/addition/.test(title)) return "Line up place values and carry only when a column reaches 10 or more.";
  if (/borrowing/.test(title)) return "Borrow 1 from the next place to make 10 extra in the current column.";
  if (/estimation in multiplication/.test(title)) return "Round first, multiply quickly, then compare with the exact answer.";
  if (/estimation/.test(title)) return "Round first to get a quick answer that checks your exact work.";
  if (/large multiplication/.test(title)) return "Multiply by each place separately, then add the partial products.";
  if (/long division/.test(title)) return "D-M-S-B: Divide, Multiply, Subtract, Bring down.";
  if (/table/.test(title)) return "Tables are equal groups and skip-counting patterns.";
  if (/factor|multiple/.test(title)) return "Factors divide exactly; multiples come from repeated multiplication.";
  if (/prime|composite/.test(title)) return "Prime numbers have exactly two factors.";
  if (/lcm/.test(title)) return "LCM is the first common multiple you see.";
  if (/hcf/.test(title)) return "HCF is the greatest factor shared by all numbers.";
  if (/divisibility/.test(title)) return "Check the last digit or digit sum before doing full division.";
  if (/proper|improper/.test(title)) return "Compare the numerator with the denominator to decide the type.";
  if (/mixed numbers/.test(title)) return "Divide to make a mixed number; multiply-and-add to go back.";
  if (/equivalent fractions/.test(title)) return "Multiply or divide the top and bottom by the same number.";
  if (/simplifying/.test(title)) return "Use the HCF to reduce a fraction to lowest terms.";
  if (/add & subtract fractions/.test(title)) return "Make denominators the same before combining numerators.";
  if (/multiply fractions/.test(title)) return "Multiply top with top and bottom with bottom, then simplify.";
  if (/decimal place value/.test(title)) return "Each place to the right of the decimal is ten times smaller.";
  if (/fractions ↔ decimals/.test(title)) return "Divide to get a decimal; use place value to turn decimals into fractions.";
  if (/add & subtract decimals/.test(title)) return "Line up decimal points before calculating.";
  if (/comparing decimals/.test(title)) return "Compare whole numbers first, then tenths, hundredths, and beyond.";
  if (/ratio to fraction/.test(title)) return "Turn the ratio into part/whole by adding all parts first.";
  if (/ratio/.test(title)) return "Keep the order the same and simplify only if both parts stay proportional.";
  if (/percentage|real-life problems/.test(title)) return "Percent means out of 100, so benchmark fractions help a lot.";
  if (/conversion/.test(title)) return "Multiply when changing to a smaller unit; divide for a bigger unit.";
  if (/length|mass|capacity/.test(title)) return "Choose a unit that matches the size of the object.";
  if (/time/.test(title)) return "Convert minutes and seconds whenever the total passes 60.";
  if (/temperature/.test(title)) return "Use Celsius and compare hotter/colder by the scale.";
  if (/perimeter/.test(title)) return "Perimeter measures the distance around a shape.";
  if (/area/.test(title)) return "Area measures the space inside a shape.";
  if (/volume/.test(title)) return "Volume measures how much space a solid can hold.";
  if (/bar graph/.test(title)) return "Read the title, scale, and bar height before answering.";
  if (/pictograph/.test(title)) return "Always use the key before counting symbols.";
  if (/line graph/.test(title)) return "Connected points show how values change over time.";
  if (/data/.test(title)) return "Highest, lowest, total, and trend come after reading labels and scale.";
  if (/pattern|sequence|skip counting|missing numbers/.test(title)) return "The change between terms reveals the rule.";
  if (/unknown|equation|symbol/.test(title)) return "Undo operations in reverse order and check by substitution.";
  if (/parallel|perpendicular/.test(title)) return "Parallel never meet; perpendicular meet at 90°.";
  if (/2d shapes/.test(title)) return "Count sides, angles, and lines of symmetry.";
  if (/3d shapes/.test(title)) return "Look at faces, edges, and vertices to name the solid.";
  return "Read carefully, choose the right rule, solve step by step, and check the answer.";
}

function getMathSolveSteps(sub, lessonTitle) {
  const title = `${lessonTitle || ""} ${sub?.t || ""}`.toLowerCase();
  if (/place value/.test(title)) return ["Start at the ones place on the right.", "Move left to name the correct place.", "Find the target digit in the number.", "Multiply the digit by that place value."];
  if (/expanded form/.test(title)) return ["Read each digit and its place.", "Write the non-zero place values separately.", "Join the parts with plus signs.", "Add the parts back to check the number."];
  if (/comparing/.test(title)) return ["Check which number has more digits.", "If equal, compare from the leftmost place.", "Stop at the first place that is different.", "Use >, <, or = and order the numbers."];
  if (/rounding/.test(title)) return ["Choose the place to round to.", "Look at the digit just to its right.", "5 or more means up; 4 or less means down.", "Keep that place and change the rest to zero."];
  if (/number lines/.test(title)) return ["Read the start, end, and interval marks.", "Count equal jumps along the line.", "Locate the point or midpoint carefully.", "Check that the position matches the scale."];
  if (/multi-digit addition/.test(title)) return ["Line up the digits by place value.", "Add from ones toward the left.", "Carry to the next column if needed.", "Estimate to see if the total makes sense."];
  if (/carrying|borrowing/.test(title)) return ["Work from ones to higher places.", "Borrow or carry when the column needs it.", "Rewrite the changed digits clearly.", "Subtract or add again to verify the result."];
  if (/large multiplication/.test(title)) return ["Write the numbers in columns.", "Multiply by the ones digit first.", "Multiply by the next place value.", "Add the partial products carefully."];
  if (/long division/.test(title)) return ["Divide the leading part of the number.", "Multiply the quotient digit back.", "Subtract to find the remainder.", "Bring down the next digit and repeat."];
  if (/table/.test(title)) return ["See the fact as equal groups.", "Skip count or use repeated addition.", "Notice doubles, 5s, and 10s patterns.", "Recall the fact quickly in bigger questions."];
  if (/estimation/.test(title)) return ["Round the numbers to friendly values.", "Do the easier calculation first.", "Compare the estimate with the exact answer.", "Use the estimate to catch mistakes."];
  if (/factor|multiple/.test(title)) return ["List factor pairs or multiples neatly.", "Circle the shared numbers if needed.", "Choose the exact factor or multiple asked for.", "Check by multiplication or division."];
  if (/prime|composite/.test(title)) return ["Test small divisors one by one.", "Count how many factors the number has.", "Exactly two factors means prime.", "More than two factors means composite."];
  if (/lcm/.test(title)) return ["Write multiples of each number.", "Keep going until a common multiple appears.", "Choose the smallest common one.", "Check both numbers divide into it exactly."];
  if (/hcf/.test(title)) return ["List factors of each number.", "Find the common factors.", "Choose the greatest common factor.", "Check it divides every number exactly."];
  if (/divisibility/.test(title)) return ["Look at the last digit or the digit sum.", "Apply the matching divisibility rule.", "Decide if the number divides evenly.", "Confirm with a quick division if needed."];
  if (/proper|improper/.test(title)) return ["Compare numerator with denominator.", "Decide if the fraction is less than or at least 1.", "Name it as proper or improper.", "Sketch or imagine the fraction as parts of a whole."];
  if (/mixed numbers/.test(title)) return ["Divide the numerator by the denominator.", "Use the quotient as the whole number.", "Keep the remainder over the same denominator.", "Reverse by multiply-and-add when needed."];
  if (/equivalent fractions/.test(title)) return ["Choose a number to multiply or divide by.", "Do the same operation to top and bottom.", "Write the new fraction.", "Check the value stays the same."];
  if (/simplifying/.test(title)) return ["Find the HCF of numerator and denominator.", "Divide both by that HCF.", "Write the reduced fraction.", "Check that no common factor is left."];
  if (/add & subtract fractions/.test(title)) return ["Check if denominators already match.", "If not, find a common denominator.", "Combine the numerators only.", "Simplify the final fraction if possible."];
  if (/multiply fractions/.test(title)) return ["Multiply the numerators together.", "Multiply the denominators together.", "Reduce the fraction if possible.", "Convert to a mixed number if needed."];
  if (/decimal place value/.test(title)) return ["Find the decimal point first.", "Read places to the right as tenths, hundredths, and thousandths.", "Match each digit to its place.", "Write the value of the target digit."];
  if (/fractions ↔ decimals/.test(title)) return ["Use division to turn a fraction into a decimal.", "Use place value to turn a decimal into a fraction.", "Write the fraction over 10, 100, or 1000.", "Simplify if possible."];
  if (/add & subtract decimals/.test(title)) return ["Line up decimal points vertically.", "Add zeros to empty places if needed.", "Calculate column by column.", "Bring the decimal point straight down."];
  if (/comparing decimals/.test(title)) return ["Make the decimal lengths equal with zeros.", "Compare whole numbers first.", "Then compare tenths, hundredths, and beyond.", "Choose the greater or smaller value."];
  if (/ratio to fraction/.test(title)) return ["Add the ratio parts to get the total.", "Write the chosen part over the total.", "Simplify the fraction if possible.", "Check both part-fractions match the ratio."];
  if (/ratio/.test(title)) return ["Keep the quantities in the same order.", "Write the ratio with a colon.", "Simplify both parts together.", "Check that the comparison still means the same thing."];
  if (/percentage|real-life problems/.test(title)) return ["Turn the percent into a fraction or decimal.", "Find the whole amount first.", "Calculate the required part, discount, or score.", "Write the answer with context."];
  if (/length|mass|capacity/.test(title)) return ["Choose the correct unit for the object.", "Estimate or read the measurement.", "Convert only if the question asks for it.", "Write the unit with the answer."];
  if (/conversion/.test(title)) return ["Decide whether the new unit is bigger or smaller.", "Multiply for smaller units or divide for bigger ones.", "Use 10, 100, or 1000 as needed.", "Check the size of the answer for reasonableness."];
  if (/time/.test(title)) return ["Read hours, minutes, and seconds carefully.", "Convert when totals pass 60.", "Use counting on or subtraction for elapsed time.", "Write the final time clearly."];
  if (/temperature/.test(title)) return ["Read the Celsius scale carefully.", "Compare hotter and colder values.", "Find the difference if asked.", "Keep the degree sign in the answer."];
  if (/lines & angles/.test(title)) return ["Identify the line or angle shown.", "Estimate or measure the size.", "Classify it by its property.", "Check the name matches the picture."];
  if (/parallel|perpendicular/.test(title)) return ["See whether the lines ever meet.", "If they meet, check for a 90° angle.", "Name them as parallel or perpendicular.", "Match the idea to a real-life example."];
  if (/2d shapes/.test(title)) return ["Count sides and corners.", "Look for equal sides or right angles.", "Check symmetry if needed.", "Name the shape using its properties."];
  if (/3d shapes/.test(title)) return ["Count faces, edges, and vertices.", "Notice whether the solid rolls or stacks.", "Match its net or real object.", "Name the solid correctly."];
  if (/perimeter/.test(title)) return ["Read every side length.", "Add all outer sides together.", "Use the same unit throughout.", "Check that you measured around the shape."];
  if (/area/.test(title)) return ["Identify the base and height or length and width.", "Use the correct area formula.", "Multiply to find the space inside.", "Write square units in the answer."];
  if (/volume/.test(title)) return ["Read the three dimensions.", "Multiply length × width × height.", "Compare the result with cube counting if helpful.", "Write cubic units in the answer."];
  if (/word problems/.test(title) && /perimeter|area|volume/.test(sub?.c || "")) return ["Underline the dimensions and units.", "Choose perimeter, area, or volume.", "Apply the correct formula carefully.", "Write the answer with units or cost."];
  if (/word problems/.test(title) && /each|shared equally|divided/.test(sub?.c || "")) return ["Read the story and underline numbers.", "Look for equal groups or sharing clues.", "Choose multiplication or division.", "Label the final answer clearly."];
  if (/word problems/.test(title)) return ["Read the story twice.", "Underline clue words like total, left, or difference.", "Choose addition or subtraction.", "Solve neatly and write the unit."];
  if (/bar graph/.test(title)) return ["Read the title, axes, and scale.", "Compare the heights of the bars.", "Find the highest, lowest, or difference asked.", "Use the scale to read exact values."];
  if (/pictograph/.test(title)) return ["Read the key before counting anything.", "Count whole and half symbols carefully.", "Multiply by the key value.", "Check the total matches the picture."];
  if (/line graph/.test(title)) return ["Read the time and value axes.", "Follow the points in order.", "Notice rises, falls, and flat parts.", "State the trend with evidence from the graph."];
  if (/interpreting data/.test(title)) return ["Read the title and labels first.", "Find the highest and lowest values.", "Work out totals, averages, or differences.", "Describe any clear pattern or trend."];
  if (/number patterns/.test(title)) return ["Compare one term to the next.", "Spot the repeated change.", "State the rule clearly.", "Use the rule to continue the pattern."];
  if (/skip counting/.test(title)) return ["Choose the jump size.", "Count forward or backward by that amount.", "Write the sequence in order.", "Link the pattern to multiplication facts."];
  if (/missing numbers/.test(title)) return ["Look at the numbers before and after the gap.", "Work out the rule of the pattern.", "Fill in the missing value.", "Check the whole sequence again."];
  if (/sequence/.test(title)) return ["Decide if the pattern adds or multiplies.", "Find the constant difference or ratio.", "Continue the rule carefully.", "Check that every step follows the same pattern."];
  if (/unknown|equation|symbol/.test(title)) return ["Find the operation attached to the variable.", "Undo it in reverse order.", "Isolate the variable step by step.", "Substitute back to check the solution."];
  return ["Read the question carefully.", "Highlight the numbers and key words.", "Choose the correct operation or rule.", "Solve and check if the answer makes sense."];
}

function renderMathPrimaryVisual(sub) {
  if (!sub || !sub.svgType) return null;
  if (sub.svgType === "placeValue") return <PlaceValueChart number={sub.svgData.number} />;
  if (sub.svgType === "expandedForm") return <ExpandedFormSVG number={sub.svgData.number} parts={sub.svgData.parts} />;
  if (sub.svgType === "compare") return <CompareTripleSVG />;
  if (sub.svgType === "rounding") return <RoundingDualSVG />;
  if (sub.svgType === "columnAdd") return <ColumnAddSVG num1={sub.svgData.num1} num2={sub.svgData.num2} result={sub.svgData.result} />;
  if (sub.svgType === "columnSub") return <ColumnSubSVG num1={sub.svgData.num1} num2={sub.svgData.num2} result={sub.svgData.result} />;
  if (sub.svgType === "estimation") return <EstimationSVG num1={sub.svgData.num1} num2={sub.svgData.num2} op={sub.svgData.op} rounded1={sub.svgData.rounded1} rounded2={sub.svgData.rounded2} estimate={sub.svgData.estimate} exact={sub.svgData.exact} />;
  if (sub.svgType === "numberLine") {
    return <>
      <NumberLineSVG min={sub.svgData.min} max={sub.svgData.max} marks={sub.svgData.marks} highlight={sub.svgData.highlight} />
      <div className="math-svg"><svg viewBox="0 0 620 100" xmlns="http://www.w3.org/2000/svg">
        <rect width="620" height="100" rx="12" fill="#1E293B"/>
        <text x="310" y="18" textAnchor="middle" fill="#94A3B8" fontSize="12" fontWeight="700" fontFamily="'Baloo 2'">Positive &amp; Negative Numbers</text>
        <line x1="30" y1="52" x2="590" y2="52" stroke="#475569" strokeWidth="3" strokeLinecap="round"/>
        <polygon points="22,52 30,46 30,58" fill="#475569"/>
        <polygon points="598,52 590,46 590,58" fill="#475569"/>
        {[-5,-4,-3,-2,-1,0,1,2,3,4,5].map((n,i) => {
          const x = 310 + n * 52;
          const isZero = n === 0;
          const isNeg = n < 0;
          const col = isZero ? "#F59E0B" : isNeg ? "#EF4444" : "#22C55E";
          return <g key={i}>
            <line x1={x} y1="44" x2={x} y2="60" stroke={col} strokeWidth={isZero ? 4 : 2}/>
            <text x={x} y="80" textAnchor="middle" fill={col} fontSize={isZero ? "18" : "15"} fontWeight={isZero ? "900" : "700"} fontFamily="'Baloo 2'">{n}</text>
            {isZero && <circle cx={x} cy="52" r="6" fill="#F59E0B"/>}
          </g>;
        })}
        <text x="80" y="38" textAnchor="middle" fill="#EF4444" fontSize="12" fontWeight="700" fontFamily="'Baloo 2'">← Negative</text>
        <text x="540" y="38" textAnchor="middle" fill="#22C55E" fontSize="12" fontWeight="700" fontFamily="'Baloo 2'">Positive →</text>
      </svg></div>
    </>;
  }
  return null;
}

function MathWordProblemStrategySVG({ sub, lessonTitle }) {
  const title = `${lessonTitle || ""} ${sub?.t || ""}`.toLowerCase();
  const multDiv = /multiplication|division/.test(title) || /shared equally|each|per|divided/.test(sub?.c || "");
  const pav = /perimeter|area|volume/.test(lessonTitle || "");
  return (<div className="math-svg"><svg viewBox="0 0 640 260" xmlns="http://www.w3.org/2000/svg">
    <rect width="640" height="260" rx="20" fill="#0F172A"/>
    <text x="34" y="38" fill="#F59E0B" fontSize="13" fontWeight="800" fontFamily="'Baloo 2'">Textbook Model</text>
    <rect x="28" y="56" width="182" height="152" rx="16" fill="#1E293B" stroke="#38BDF8" strokeWidth="1.5"/>
    <text x="50" y="82" fill="#38BDF8" fontSize="16" fontWeight="800" fontFamily="'Baloo 2'">1. Read the Story</text>
    <SvgTextBlock text={multDiv ? "Circle equal groups, each, total, and share clues." : pav ? "Underline dimensions, units, cost, and what must be found." : "Circle numbers and clue words like total, left, or difference."} x={50} y={108} maxChars={22} maxLines={5} fill="#E2E8F0" size={13} weight={600} />
    <rect x="228" y="56" width="182" height="152" rx="16" fill="#1E293B" stroke="#22C55E" strokeWidth="1.5"/>
    <text x="250" y="82" fill="#22C55E" fontSize="16" fontWeight="800" fontFamily="'Baloo 2'">2. Choose Method</text>
    {multDiv ? <>
      <rect x="252" y="108" width="48" height="36" rx="10" fill="#22C55E22" stroke="#22C55E"/><text x="276" y="131" textAnchor="middle" fill="#F8FAFC" fontSize="20" fontWeight="900" fontFamily="'Baloo 2'">4</text>
      <text x="306" y="131" fill="#94A3B8" fontSize="18" fontWeight="700" fontFamily="'Baloo 2'">groups × 6</text>
      <text x="250" y="170" fill="#E2E8F0" fontSize="13" fontWeight="700" fontFamily="'Baloo 2'">Equal groups → multiply</text>
      <text x="250" y="190" fill="#E2E8F0" fontSize="13" fontWeight="700" fontFamily="'Baloo 2'">Shared equally → divide</text>
    </> : pav ? <>
      <rect x="250" y="104" width="96" height="54" rx="10" fill="#F59E0B22" stroke="#F59E0B"/>
      <text x="298" y="128" textAnchor="middle" fill="#F8FAFC" fontSize="14" fontWeight="800" fontFamily="'Baloo 2'">l = 12 m</text>
      <text x="298" y="148" textAnchor="middle" fill="#F8FAFC" fontSize="14" fontWeight="800" fontFamily="'Baloo 2'">w = 8 m</text>
      <text x="250" y="182" fill="#E2E8F0" fontSize="13" fontWeight="700" fontFamily="'Baloo 2'">Around → perimeter</text>
      <text x="250" y="200" fill="#E2E8F0" fontSize="13" fontWeight="700" fontFamily="'Baloo 2'">Inside → area or volume</text>
    </> : <>
      <text x="250" y="116" fill="#F8FAFC" fontSize="18" fontWeight="900" fontFamily="'Baloo 2'">48 + 27 = 75</text>
      <text x="250" y="148" fill="#F8FAFC" fontSize="18" fontWeight="900" fontFamily="'Baloo 2'">75 − 19 = 56</text>
      <text x="250" y="178" fill="#E2E8F0" fontSize="13" fontWeight="700" fontFamily="'Baloo 2'">Total / altogether → add</text>
      <text x="250" y="198" fill="#E2E8F0" fontSize="13" fontWeight="700" fontFamily="'Baloo 2'">Left / difference → subtract</text>
    </>}
    <rect x="428" y="56" width="184" height="152" rx="16" fill="#1E293B" stroke="#A855F7" strokeWidth="1.5"/>
    <text x="450" y="82" fill="#A855F7" fontSize="16" fontWeight="800" fontFamily="'Baloo 2'">3. Solve & Check</text>
    <SvgTextBlock text={multDiv ? "Write the number sentence, solve, and check if the answer matches the groups." : pav ? "Use the right formula, keep units, and check whether the answer is distance, area, or capacity." : "Solve neatly, label the answer, then compare it with the story."} x={450} y={110} maxChars={20} maxLines={5} fill="#E2E8F0" size={13} weight={600} />
    <line x1="210" y1="132" x2="228" y2="132" stroke="#64748B" strokeWidth="3"/><polygon points="228,132 218,126 218,138" fill="#64748B"/>
    <line x1="410" y1="132" x2="428" y2="132" stroke="#64748B" strokeWidth="3"/><polygon points="428,132 418,126 418,138" fill="#64748B"/>
  </svg></div>);
}

function MathMultiplicationMethodSVG() {
  return (<div className="math-svg"><svg viewBox="0 0 640 260" xmlns="http://www.w3.org/2000/svg">
    <rect width="640" height="260" rx="20" fill="#0F172A"/>
    <text x="34" y="38" fill="#22C55E" fontSize="13" fontWeight="800" fontFamily="'Baloo 2'">Textbook Model</text>
    <text x="34" y="64" fill="#F8FAFC" fontSize="24" fontWeight="900" fontFamily="'Baloo 2'">Large Multiplication</text>
    <rect x="34" y="84" width="220" height="136" rx="16" fill="#1E293B" stroke="#22C55E"/>
    <text x="54" y="112" fill="#22C55E" fontSize="15" fontWeight="800" fontFamily="'Baloo 2'">Area / Partial Products</text>
    <rect x="70" y="132" width="90" height="58" fill="#38BDF822" stroke="#38BDF8"/>
    <rect x="160" y="132" width="54" height="58" fill="#F59E0B22" stroke="#F59E0B"/>
    <text x="115" y="124" textAnchor="middle" fill="#F8FAFC" fontSize="14" fontWeight="800" fontFamily="'Baloo 2'">20</text>
    <text x="187" y="124" textAnchor="middle" fill="#F8FAFC" fontSize="14" fontWeight="800" fontFamily="'Baloo 2'">3</text>
    <text x="54" y="166" textAnchor="middle" fill="#F8FAFC" fontSize="14" fontWeight="800" fontFamily="'Baloo 2'">14</text>
    <text x="115" y="166" textAnchor="middle" fill="#F8FAFC" fontSize="15" fontWeight="900" fontFamily="'Baloo 2'">280</text>
    <text x="187" y="166" textAnchor="middle" fill="#F8FAFC" fontSize="15" fontWeight="900" fontFamily="'Baloo 2'">42</text>
    <text x="54" y="208" fill="#94A3B8" fontSize="12" fontWeight="700" fontFamily="'Baloo 2'">14 × 23 = 280 + 42 = 322</text>
    <rect x="278" y="84" width="332" height="136" rx="16" fill="#1E293B" stroke="#86EFAC"/>
    <text x="300" y="112" fill="#86EFAC" fontSize="15" fontWeight="800" fontFamily="'Baloo 2'">Column Method</text>
    <text x="520" y="130" textAnchor="end" fill="#F8FAFC" fontSize="24" fontWeight="900" fontFamily="'Baloo 2'">23</text>
    <text x="520" y="160" textAnchor="end" fill="#22C55E" fontSize="24" fontWeight="900" fontFamily="'Baloo 2'">× 14</text>
    <line x1="420" y1="168" x2="532" y2="168" stroke="#F59E0B" strokeWidth="3"/>
    <text x="520" y="196" textAnchor="end" fill="#38BDF8" fontSize="22" fontWeight="900" fontFamily="'Baloo 2'">92</text>
    <text x="520" y="220" textAnchor="end" fill="#A855F7" fontSize="22" fontWeight="900" fontFamily="'Baloo 2'">230</text>
    <text x="334" y="196" fill="#94A3B8" fontSize="12" fontWeight="700" fontFamily="'Baloo 2'">23 × 4</text>
    <text x="326" y="220" fill="#94A3B8" fontSize="12" fontWeight="700" fontFamily="'Baloo 2'">23 × 10</text>
  </svg></div>);
}

function MathLongDivisionMethodSVG() {
  return (<div className="math-svg"><svg viewBox="0 0 640 260" xmlns="http://www.w3.org/2000/svg">
    <rect width="640" height="260" rx="20" fill="#0F172A"/>
    <text x="34" y="38" fill="#38BDF8" fontSize="13" fontWeight="800" fontFamily="'Baloo 2'">Textbook Model</text>
    <text x="34" y="64" fill="#F8FAFC" fontSize="24" fontWeight="900" fontFamily="'Baloo 2'">Long Division House</text>
    <path d="M90 118 h210 v92" fill="none" stroke="#38BDF8" strokeWidth="4"/>
    <path d="M90 118 q18 -18 36 0" fill="none" stroke="#38BDF8" strokeWidth="4"/>
    <text x="64" y="164" fill="#F8FAFC" fontSize="28" fontWeight="900" fontFamily="'Baloo 2'">4</text>
    <text x="128" y="106" fill="#22C55E" fontSize="26" fontWeight="900" fontFamily="'Baloo 2'">24</text>
    <text x="130" y="164" fill="#F8FAFC" fontSize="28" fontWeight="900" fontFamily="'Baloo 2'">96</text>
    <text x="326" y="102" fill="#94A3B8" fontSize="15" fontWeight="800" fontFamily="'Baloo 2'">D-M-S-B</text>
    <rect x="326" y="116" width="274" height="104" rx="16" fill="#1E293B" stroke="#22C55E"/>
    <text x="346" y="142" fill="#22C55E" fontSize="14" fontWeight="800" fontFamily="'Baloo 2'">1. Divide: 9 ÷ 4 = 2</text>
    <text x="346" y="166" fill="#F8FAFC" fontSize="14" fontWeight="800" fontFamily="'Baloo 2'">2. Multiply: 2 × 4 = 8</text>
    <text x="346" y="190" fill="#F8FAFC" fontSize="14" fontWeight="800" fontFamily="'Baloo 2'">3. Subtract: 9 − 8 = 1</text>
    <text x="346" y="214" fill="#F8FAFC" fontSize="14" fontWeight="800" fontFamily="'Baloo 2'">4. Bring down 6 and repeat</text>
    <text x="130" y="198" fill="#A855F7" fontSize="22" fontWeight="900" fontFamily="'Baloo 2'">− 8</text>
    <line x1="124" y1="204" x2="198" y2="204" stroke="#F59E0B" strokeWidth="3"/>
    <text x="130" y="232" fill="#F8FAFC" fontSize="22" fontWeight="900" fontFamily="'Baloo 2'">16</text>
  </svg></div>);
}

function MathFactorsToolkitSVG({ sub }) {
  const title = (sub?.t || "").toLowerCase();
  return (<div className="math-svg"><svg viewBox="0 0 640 260" xmlns="http://www.w3.org/2000/svg">
    <rect width="640" height="260" rx="20" fill="#0F172A"/>
    <text x="34" y="38" fill="#22C55E" fontSize="13" fontWeight="800" fontFamily="'Baloo 2'">Textbook Model</text>
    {title.includes("lcm") ? <>
      <text x="34" y="66" fill="#F8FAFC" fontSize="24" fontWeight="900" fontFamily="'Baloo 2'">Find the LCM</text>
      <text x="48" y="108" fill="#38BDF8" fontSize="15" fontWeight="800" fontFamily="'Baloo 2'">Multiples of 4</text>
      {["4","8","12","16"].map((n,i)=><rect key={n} x={48+i*64} y="122" width="52" height="34" rx="10" fill={n==="12"?"#22C55E22":"#1E293B"} stroke={n==="12"?"#22C55E":"#475569"}/>)}
      {["4","8","12","16"].map((n,i)=><text key={"t"+n} x={74+i*64} y="144" textAnchor="middle" fill="#F8FAFC" fontSize="16" fontWeight="900" fontFamily="'Baloo 2'">{n}</text>)}
      <text x="48" y="192" fill="#F59E0B" fontSize="15" fontWeight="800" fontFamily="'Baloo 2'">Multiples of 6</text>
      {["6","12","18","24"].map((n,i)=><rect key={n} x={48+i*64} y="206" width="52" height="34" rx="10" fill={n==="12"?"#22C55E22":"#1E293B"} stroke={n==="12"?"#22C55E":"#475569"}/>)}
      {["6","12","18","24"].map((n,i)=><text key={"b"+n} x={74+i*64} y="228" textAnchor="middle" fill="#F8FAFC" fontSize="16" fontWeight="900" fontFamily="'Baloo 2'">{n}</text>)}
      <text x="374" y="150" fill="#22C55E" fontSize="22" fontWeight="900" fontFamily="'Baloo 2'">LCM(4, 6) = 12</text>
      <SvgTextBlock text="List multiples in order and choose the first number that appears in both lists." x={374} y={182} maxChars={28} maxLines={3} fill="#E2E8F0" size={13} weight={700} />
    </> : title.includes("hcf") ? <>
      <text x="34" y="66" fill="#F8FAFC" fontSize="24" fontWeight="900" fontFamily="'Baloo 2'">Find the HCF</text>
      <text x="48" y="104" fill="#38BDF8" fontSize="15" fontWeight="800" fontFamily="'Baloo 2'">Factors of 18</text>
      <text x="48" y="126" fill="#F8FAFC" fontSize="16" fontWeight="700" fontFamily="'Baloo 2'">1, 2, 3, 6, 9, 18</text>
      <text x="48" y="166" fill="#F59E0B" fontSize="15" fontWeight="800" fontFamily="'Baloo 2'">Factors of 24</text>
      <text x="48" y="188" fill="#F8FAFC" fontSize="16" fontWeight="700" fontFamily="'Baloo 2'">1, 2, 3, 4, 6, 8, 12, 24</text>
      <rect x="394" y="92" width="174" height="110" rx="16" fill="#1E293B" stroke="#22C55E"/>
      <text x="482" y="126" textAnchor="middle" fill="#22C55E" fontSize="16" fontWeight="900" fontFamily="'Baloo 2'">Common Factors</text>
      <text x="482" y="154" textAnchor="middle" fill="#F8FAFC" fontSize="18" fontWeight="900" fontFamily="'Baloo 2'">1, 2, 3, 6</text>
      <text x="482" y="184" textAnchor="middle" fill="#F59E0B" fontSize="18" fontWeight="900" fontFamily="'Baloo 2'">HCF = 6</text>
    </> : <>
      <text x="34" y="66" fill="#F8FAFC" fontSize="24" fontWeight="900" fontFamily="'Baloo 2'">Prime, Composite, Factors</text>
      <rect x="44" y="104" width="160" height="108" rx="16" fill="#1E293B" stroke="#38BDF8"/>
      <text x="124" y="130" textAnchor="middle" fill="#38BDF8" fontSize="16" fontWeight="800" fontFamily="'Baloo 2'">Prime: 13</text>
      <text x="124" y="164" textAnchor="middle" fill="#F8FAFC" fontSize="16" fontWeight="800" fontFamily="'Baloo 2'">1 and 13</text>
      <text x="124" y="192" textAnchor="middle" fill="#94A3B8" fontSize="13" fontWeight="700" fontFamily="'Baloo 2'">Exactly two factors</text>
      <rect x="238" y="104" width="160" height="108" rx="16" fill="#1E293B" stroke="#F59E0B"/>
      <text x="318" y="130" textAnchor="middle" fill="#F59E0B" fontSize="16" fontWeight="800" fontFamily="'Baloo 2'">Composite: 12</text>
      <text x="318" y="164" textAnchor="middle" fill="#F8FAFC" fontSize="16" fontWeight="800" fontFamily="'Baloo 2'">1, 2, 3, 4, 6, 12</text>
      <text x="318" y="192" textAnchor="middle" fill="#94A3B8" fontSize="13" fontWeight="700" fontFamily="'Baloo 2'">More than two factors</text>
      <rect x="432" y="104" width="164" height="108" rx="16" fill="#1E293B" stroke="#A855F7"/>
      <SvgTextBlock text="List factor pairs to find all factors, then classify the number." x={452} y={144} maxChars={18} maxLines={4} fill="#E2E8F0" size={14} weight={700} />
    </>}
  </svg></div>);
}
function MathConceptSummarySVG({ sub, lessonTitle }) {
  const theme = getMathVisualTheme(sub, lessonTitle);
  const points = getMathSummaryPoints(sub);
  return (<div className="math-svg"><svg viewBox="0 0 640 250" xmlns="http://www.w3.org/2000/svg">
    <rect width="640" height="250" rx="20" fill="#0F172A"/>
    <rect x="18" y="18" width="604" height="214" rx="18" fill={theme.soft} opacity="0.14" stroke={theme.accent} strokeWidth="1.6"/>
    <text x="34" y="46" fill={theme.accent} fontSize="13" fontWeight="800" fontFamily="'Baloo 2'">Key Idea</text>
    <text x="34" y="74" fill="#F8FAFC" fontSize="24" fontWeight="900" fontFamily="'Baloo 2'">{sub.t}</text>
    <SvgTextBlock text={getMathQuickRule(sub, lessonTitle)} x={34} y={102} maxChars={42} maxLines={2} lineHeight={18} fill="#CBD5E1" size={14} weight={600} />
    {points.map((point, idx) => {
      const y = 132 + idx * 34;
      return <g key={idx}>
        <circle cx="42" cy={y - 5} r="8" fill={theme.accent}/>
        <SvgTextBlock text={point} x={60} y={y} maxChars={55} maxLines={2} lineHeight={16} fill="#E2E8F0" size={13} weight={600} />
      </g>;
    })}
  </svg></div>);
}

function MathFractionsToolkitSVG({ sub }) {
  const title = (sub?.t || "").toLowerCase();
  return (<div className="math-svg"><svg viewBox="0 0 640 260" xmlns="http://www.w3.org/2000/svg">
    <rect width="640" height="260" rx="20" fill="#0F172A"/>
    <text x="34" y="38" fill="#8B5CF6" fontSize="13" fontWeight="800" fontFamily="'Baloo 2'">Textbook Model</text>
    {title.includes("mixed") ? <>
      <text x="34" y="66" fill="#F8FAFC" fontSize="24" fontWeight="900" fontFamily="'Baloo 2'">Improper to Mixed Number</text>
      <text x="54" y="116" fill="#F8FAFC" fontSize="22" fontWeight="900" fontFamily="'Baloo 2'">11 ÷ 4 = 2 remainder 3</text>
      <text x="54" y="170" fill="#8B5CF6" fontSize="30" fontWeight="900" fontFamily="'Baloo 2'">11/4 = 2 3/4</text>
      <rect x="346" y="96" width="216" height="108" rx="16" fill="#1E293B" stroke="#C4B5FD"/>
      <SvgTextBlock text="Whole number = quotient, fraction = remainder over the same denominator." x={366} y={130} maxChars={22} maxLines={4} fill="#E2E8F0" size={14} weight={700} />
    </> : title.includes("equivalent") || title.includes("simplifying") ? <>
      <text x="34" y="66" fill="#F8FAFC" fontSize="24" fontWeight="900" fontFamily="'Baloo 2'">{title.includes("equivalent") ? "Equivalent Fractions" : "Simplifying Fractions"}</text>
      <rect x="48" y="108" width="92" height="34" rx="10" fill="#8B5CF622" stroke="#8B5CF6"/><text x="94" y="131" textAnchor="middle" fill="#F8FAFC" fontSize="18" fontWeight="900" fontFamily="'Baloo 2'">1/2</text>
      <text x="158" y="132" fill="#94A3B8" fontSize="20" fontWeight="900" fontFamily="'Baloo 2'">=</text>
      <rect x="180" y="108" width="92" height="34" rx="10" fill="#8B5CF622" stroke="#8B5CF6"/><text x="226" y="131" textAnchor="middle" fill="#F8FAFC" fontSize="18" fontWeight="900" fontFamily="'Baloo 2'">2/4</text>
      <text x="290" y="132" fill="#94A3B8" fontSize="20" fontWeight="900" fontFamily="'Baloo 2'">=</text>
      <rect x="312" y="108" width="92" height="34" rx="10" fill="#8B5CF622" stroke="#8B5CF6"/><text x="358" y="131" textAnchor="middle" fill="#F8FAFC" fontSize="18" fontWeight="900" fontFamily="'Baloo 2'">4/8</text>
      <text x="50" y="188" fill="#F59E0B" fontSize="18" fontWeight="900" fontFamily="'Baloo 2'">12/18 ÷ 6 = 2/3</text>
      <SvgTextBlock text="Multiply or divide the numerator and denominator by the same number to keep the value unchanged." x={50} y={214} maxChars={40} maxLines={2} fill="#E2E8F0" size={13} weight={700}/>
    </> : title.includes("add") || title.includes("subtract") ? <>
      <text x="34" y="66" fill="#F8FAFC" fontSize="24" fontWeight="900" fontFamily="'Baloo 2'">Add and Subtract Fractions</text>
      <rect x="50" y="110" width="180" height="28" rx="10" fill="#1E293B" stroke="#8B5CF6"/><rect x="50" y="110" width="45" height="28" rx="10" fill="#8B5CF6"/>
      <rect x="250" y="110" width="180" height="28" rx="10" fill="#1E293B" stroke="#8B5CF6"/><rect x="250" y="110" width="90" height="28" rx="10" fill="#A78BFA"/>
      <text x="140" y="92" textAnchor="middle" fill="#F8FAFC" fontSize="18" fontWeight="900" fontFamily="'Baloo 2'">1/4</text>
      <text x="240" y="128" textAnchor="middle" fill="#94A3B8" fontSize="26" fontWeight="900" fontFamily="'Baloo 2'">+</text>
      <text x="340" y="92" textAnchor="middle" fill="#F8FAFC" fontSize="18" fontWeight="900" fontFamily="'Baloo 2'">2/4</text>
      <text x="500" y="128" fill="#22C55E" fontSize="24" fontWeight="900" fontFamily="'Baloo 2'">= 3/4</text>
      <SvgTextBlock text="If denominators match, add only the numerators. If they differ, make equivalent fractions first." x={50} y={192} maxChars={42} maxLines={3} fill="#E2E8F0" size={13} weight={700}/>
    </> : <>
      <text x="34" y="66" fill="#F8FAFC" fontSize="24" fontWeight="900" fontFamily="'Baloo 2'">Proper and Improper Fractions</text>
      <text x="74" y="100" fill="#8B5CF6" fontSize="15" fontWeight="800" fontFamily="'Baloo 2'">Proper 3/5</text>
      <rect x="54" y="116" width="160" height="28" rx="10" fill="#1E293B" stroke="#8B5CF6"/><rect x="54" y="116" width="96" height="28" rx="10" fill="#8B5CF6"/>
      <text x="332" y="100" fill="#F59E0B" fontSize="15" fontWeight="800" fontFamily="'Baloo 2'">Improper 7/5</text>
      <rect x="268" y="116" width="160" height="28" rx="10" fill="#1E293B" stroke="#F59E0B"/><rect x="268" y="116" width="160" height="28" rx="10" fill="#F59E0B"/>
      <rect x="438" y="116" width="60" height="28" rx="10" fill="#F59E0B"/>
      <SvgTextBlock text="Numerator smaller than denominator → proper. Numerator equal to or greater than denominator → improper." x={54} y={188} maxChars={44} maxLines={3} fill="#E2E8F0" size={13} weight={700}/>
    </>}
  </svg></div>);
}

function MathDecimalsToolkitSVG({ sub }) {
  const title = (sub?.t || "").toLowerCase();
  return (<div className="math-svg"><svg viewBox="0 0 640 260" xmlns="http://www.w3.org/2000/svg">
    <rect width="640" height="260" rx="20" fill="#0F172A"/>
    <text x="34" y="38" fill="#8B5CF6" fontSize="13" fontWeight="800" fontFamily="'Baloo 2'">Textbook Model</text>
    {title.includes("fractions") ? <>
      <text x="34" y="66" fill="#F8FAFC" fontSize="24" fontWeight="900" fontFamily="'Baloo 2'">Fractions and Decimals</text>
      <text x="62" y="130" fill="#F8FAFC" fontSize="26" fontWeight="900" fontFamily="'Baloo 2'">3/4 = 0.75</text>
      <text x="62" y="170" fill="#94A3B8" fontSize="16" fontWeight="700" fontFamily="'Baloo 2'">divide 3 by 4</text>
      <rect x="342" y="94" width="220" height="116" rx="16" fill="#1E293B" stroke="#38BDF8"/>
      <text x="452" y="126" textAnchor="middle" fill="#38BDF8" fontSize="15" fontWeight="800" fontFamily="'Baloo 2'">Place Value</text>
      <text x="452" y="158" textAnchor="middle" fill="#F8FAFC" fontSize="24" fontWeight="900" fontFamily="'Baloo 2'">0 . 7 5</text>
      <text x="452" y="186" textAnchor="middle" fill="#94A3B8" fontSize="12" fontWeight="700" fontFamily="'Baloo 2'">7 tenths, 5 hundredths</text>
    </> : title.includes("add") || title.includes("subtract") ? <>
      <text x="34" y="66" fill="#F8FAFC" fontSize="24" fontWeight="900" fontFamily="'Baloo 2'">Add and Subtract Decimals</text>
      <text x="144" y="126" textAnchor="end" fill="#F8FAFC" fontSize="24" fontWeight="900" fontFamily="'Baloo 2'">12.30</text>
      <text x="144" y="156" textAnchor="end" fill="#22C55E" fontSize="24" fontWeight="900" fontFamily="'Baloo 2'">+ 4.75</text>
      <line x1="68" y1="166" x2="150" y2="166" stroke="#F59E0B" strokeWidth="3"/>
      <text x="144" y="198" textAnchor="end" fill="#38BDF8" fontSize="24" fontWeight="900" fontFamily="'Baloo 2'">17.05</text>
      <SvgTextBlock text="Keep decimal points in one straight line and add zeros if places are missing." x={220} y={136} maxChars={28} maxLines={3} fill="#E2E8F0" size={14} weight={700}/>
    </> : <>
      <text x="34" y="66" fill="#F8FAFC" fontSize="24" fontWeight="900" fontFamily="'Baloo 2'">Decimal Place Value</text>
      <rect x="52" y="96" width="508" height="82" rx="16" fill="#1E293B" stroke="#38BDF8"/>
      {["Ones","Tenths","Hundredths","Thousandths"].map((label,i)=><g key={label}><line x1={52+i*127} y1="96" x2={52+i*127} y2="178" stroke="#334155"/><text x={115+i*127} y="122" textAnchor="middle" fill="#38BDF8" fontSize="14" fontWeight="800" fontFamily="'Baloo 2'">{label}</text></g>)}
      <text x="115" y="156" textAnchor="middle" fill="#F8FAFC" fontSize="24" fontWeight="900" fontFamily="'Baloo 2'">3</text>
      <text x="242" y="156" textAnchor="middle" fill="#F8FAFC" fontSize="24" fontWeight="900" fontFamily="'Baloo 2'">4</text>
      <text x="369" y="156" textAnchor="middle" fill="#F8FAFC" fontSize="24" fontWeight="900" fontFamily="'Baloo 2'">8</text>
      <text x="496" y="156" textAnchor="middle" fill="#F8FAFC" fontSize="24" fontWeight="900" fontFamily="'Baloo 2'">2</text>
      <text x="177" y="156" textAnchor="middle" fill="#F59E0B" fontSize="28" fontWeight="900" fontFamily="'Baloo 2'">.</text>
    </>}
  </svg></div>);
}

function MathRatioPercentToolkitSVG({ sub }) {
  const title = (sub?.t || "").toLowerCase();
  return (<div className="math-svg"><svg viewBox="0 0 640 260" xmlns="http://www.w3.org/2000/svg">
    <rect width="640" height="260" rx="20" fill="#0F172A"/>
    <text x="34" y="38" fill="#EC4899" fontSize="13" fontWeight="800" fontFamily="'Baloo 2'">Textbook Model</text>
    {title.includes("ratio to fraction") ? <>
      <text x="34" y="66" fill="#F8FAFC" fontSize="24" fontWeight="900" fontFamily="'Baloo 2'">Ratio to Fraction</text>
      <rect x="56" y="104" width="72" height="52" rx="14" fill="#EC489922"/><text x="92" y="138" textAnchor="middle" fill="#F8FAFC" fontSize="24" fontWeight="900" fontFamily="'Baloo 2'">2</text>
      <text x="144" y="138" fill="#94A3B8" fontSize="26" fontWeight="900" fontFamily="'Baloo 2'">:</text>
      <rect x="164" y="104" width="72" height="52" rx="14" fill="#EC489922"/><text x="200" y="138" textAnchor="middle" fill="#F8FAFC" fontSize="24" fontWeight="900" fontFamily="'Baloo 2'">3</text>
      <text x="280" y="138" fill="#94A3B8" fontSize="26" fontWeight="900" fontFamily="'Baloo 2'">→</text>
      <text x="332" y="138" fill="#F8FAFC" fontSize="24" fontWeight="900" fontFamily="'Baloo 2'">2/5 and 3/5</text>
      <SvgTextBlock text="Add parts first: 2 + 3 = 5. Then write each part over the total." x={58} y={196} maxChars={42} maxLines={2} fill="#E2E8F0" size={13} weight={700}/>
    </> : <>
      <text x="34" y="66" fill="#F8FAFC" fontSize="24" fontWeight="900" fontFamily="'Baloo 2'">Percent as Part of 100</text>
      {Array.from({length:20}).map((_,i)=> { const x = 58 + (i%10)*20; const y = 106 + Math.floor(i/10)*20; return <rect key={i} x={x} y={y} width="18" height="18" fill="#EC4899" stroke="#0F172A"/>; })}
      {Array.from({length:80}).map((_,i)=> { const x = 58 + ((i+20)%10)*20; const y = 106 + Math.floor((i+20)/10)*20; return <rect key={"w"+i} x={x} y={y} width="18" height="18" fill="#1E293B" stroke="#334155"/>; })}
      <text x="300" y="150" fill="#F8FAFC" fontSize="30" fontWeight="900" fontFamily="'Baloo 2'">20%</text>
      <SvgTextBlock text="Shade 20 out of 100 boxes. 25% = one quarter, 50% = one half, 75% = three quarters." x={372} y={126} maxChars={24} maxLines={4} fill="#E2E8F0" size={13} weight={700}/>
    </>}
  </svg></div>);
}

function MathLinesAnglesToolkitSVG() {
  return (<div className="math-svg"><svg viewBox="0 0 640 270" xmlns="http://www.w3.org/2000/svg">
    <rect width="640" height="270" rx="20" fill="#0F172A"/>
    <text x="34" y="38" fill="#38BDF8" fontSize="13" fontWeight="800" fontFamily="'Baloo 2'">Textbook Model</text>
    <text x="34" y="66" fill="#F8FAFC" fontSize="24" fontWeight="900" fontFamily="'Baloo 2'">Lines and Angles</text>
    <rect x="34" y="88" width="250" height="146" rx="16" fill="#1E293B" stroke="#38BDF8"/>
    <text x="52" y="112" fill="#38BDF8" fontSize="15" fontWeight="800" fontFamily="'Baloo 2'">Line, Ray, Segment</text>
    <line x1="64" y1="138" x2="246" y2="138" stroke="#F8FAFC" strokeWidth="4"/><polygon points="64,138 74,132 74,144" fill="#F8FAFC"/><polygon points="246,138 236,132 236,144" fill="#F8FAFC"/>
    <text x="52" y="156" fill="#94A3B8" fontSize="12" fontWeight="700" fontFamily="'Baloo 2'">Line goes on in both directions</text>
    <circle cx="68" cy="188" r="6" fill="#22C55E"/><line x1="68" y1="188" x2="246" y2="188" stroke="#F8FAFC" strokeWidth="4"/><polygon points="246,188 236,182 236,194" fill="#F8FAFC"/>
    <text x="52" y="208" fill="#94A3B8" fontSize="12" fontWeight="700" fontFamily="'Baloo 2'">Ray has one endpoint</text>
    <circle cx="68" cy="224" r="6" fill="#F59E0B"/><circle cx="246" cy="224" r="6" fill="#F59E0B"/><line x1="68" y1="224" x2="246" y2="224" stroke="#F8FAFC" strokeWidth="4"/>
    <text x="52" y="244" fill="#94A3B8" fontSize="12" fontWeight="700" fontFamily="'Baloo 2'">Segment has two endpoints</text>
    <rect x="306" y="88" width="300" height="146" rx="16" fill="#1E293B" stroke="#22C55E"/>
    <text x="326" y="112" fill="#22C55E" fontSize="15" fontWeight="800" fontFamily="'Baloo 2'">Classify the Angles</text>
    <line x1="346" y1="192" x2="346" y2="136" stroke="#F8FAFC" strokeWidth="4"/><line x1="346" y1="192" x2="402" y2="192" stroke="#F8FAFC" strokeWidth="4"/>
    <path d="M346 176 A16 16 0 0 1 362 192" fill="none" stroke="#22C55E" strokeWidth="3"/><text x="372" y="170" fill="#22C55E" fontSize="13" fontWeight="800" fontFamily="'Baloo 2'">90° Right</text>
    <line x1="456" y1="192" x2="456" y2="136" stroke="#F8FAFC" strokeWidth="4"/><line x1="456" y1="192" x2="508" y2="154" stroke="#F8FAFC" strokeWidth="4"/>
    <path d="M456 174 A22 22 0 0 1 478 176" fill="none" stroke="#F59E0B" strokeWidth="3"/><text x="500" y="144" fill="#F59E0B" fontSize="13" fontWeight="800" fontFamily="'Baloo 2'">Acute &lt; 90°</text>
    <line x1="346" y1="234" x2="396" y2="234" stroke="#F8FAFC" strokeWidth="4"/><line x1="346" y1="234" x2="316" y2="194" stroke="#F8FAFC" strokeWidth="4"/>
    <path d="M332 214 A26 26 0 0 0 372 232" fill="none" stroke="#A855F7" strokeWidth="3"/><text x="404" y="236" fill="#A855F7" fontSize="13" fontWeight="800" fontFamily="'Baloo 2'">Obtuse &gt; 90°</text>
    <line x1="456" y1="234" x2="522" y2="234" stroke="#F8FAFC" strokeWidth="4"/><line x1="456" y1="234" x2="390" y2="234" stroke="#F8FAFC" strokeWidth="4"/>
    <text x="464" y="220" fill="#38BDF8" fontSize="13" fontWeight="800" fontFamily="'Baloo 2'">180° Straight</text>
  </svg></div>);
}

function MathParallelPerpendicularToolkitSVG() {
  return (<div className="math-svg"><svg viewBox="0 0 640 270" xmlns="http://www.w3.org/2000/svg">
    <rect width="640" height="270" rx="20" fill="#0F172A"/>
    <text x="34" y="38" fill="#22C55E" fontSize="13" fontWeight="800" fontFamily="'Baloo 2'">Textbook Model</text>
    <text x="34" y="66" fill="#F8FAFC" fontSize="24" fontWeight="900" fontFamily="'Baloo 2'">Parallel and Perpendicular</text>
    <rect x="34" y="88" width="266" height="146" rx="16" fill="#1E293B" stroke="#22C55E"/>
    <text x="54" y="112" fill="#22C55E" fontSize="15" fontWeight="800" fontFamily="'Baloo 2'">Parallel Lines</text>
    <line x1="74" y1="142" x2="254" y2="142" stroke="#F8FAFC" strokeWidth="5"/><line x1="74" y1="178" x2="254" y2="178" stroke="#F8FAFC" strokeWidth="5"/>
    <line x1="96" y1="130" x2="96" y2="192" stroke="#F59E0B" strokeWidth="2"/><line x1="232" y1="130" x2="232" y2="192" stroke="#F59E0B" strokeWidth="2"/>
    <text x="54" y="214" fill="#94A3B8" fontSize="13" fontWeight="700" fontFamily="'Baloo 2'">Same distance apart like train tracks</text>
    <text x="54" y="234" fill="#94A3B8" fontSize="13" fontWeight="700" fontFamily="'Baloo 2'">Symbol: ||</text>
    <rect x="322" y="88" width="284" height="146" rx="16" fill="#1E293B" stroke="#F59E0B"/>
    <text x="342" y="112" fill="#F59E0B" fontSize="15" fontWeight="800" fontFamily="'Baloo 2'">Perpendicular Lines</text>
    <line x1="462" y1="132" x2="462" y2="220" stroke="#F8FAFC" strokeWidth="5"/><line x1="396" y1="176" x2="528" y2="176" stroke="#F8FAFC" strokeWidth="5"/>
    <rect x="462" y="160" width="20" height="20" fill="none" stroke="#38BDF8" strokeWidth="3"/>
    <text x="342" y="206" fill="#94A3B8" fontSize="13" fontWeight="700" fontFamily="'Baloo 2'">Meet to form a right angle of 90°</text>
    <text x="342" y="226" fill="#94A3B8" fontSize="13" fontWeight="700" fontFamily="'Baloo 2'">Symbol: ⊥</text>
  </svg></div>);
}

function Math2DShapesToolkitSVG() {
  return (<div className="math-svg"><svg viewBox="0 0 640 270" xmlns="http://www.w3.org/2000/svg">
    <rect width="640" height="270" rx="20" fill="#0F172A"/>
    <text x="34" y="38" fill="#8B5CF6" fontSize="13" fontWeight="800" fontFamily="'Baloo 2'">Textbook Model</text>
    <text x="34" y="66" fill="#F8FAFC" fontSize="24" fontWeight="900" fontFamily="'Baloo 2'">2D Shapes</text>
    <rect x="34" y="88" width="572" height="146" rx="16" fill="#1E293B" stroke="#8B5CF6"/>
    <rect x="68" y="128" width="54" height="54" fill="#8B5CF622" stroke="#C4B5FD" strokeWidth="3"/><text x="95" y="204" textAnchor="middle" fill="#F8FAFC" fontSize="13" fontWeight="800" fontFamily="'Baloo 2'">Square</text>
    <rect x="156" y="136" width="76" height="42" fill="#38BDF822" stroke="#38BDF8" strokeWidth="3"/><text x="194" y="204" textAnchor="middle" fill="#F8FAFC" fontSize="13" fontWeight="800" fontFamily="'Baloo 2'">Rectangle</text>
    <polygon points="288,182 250,128 326,128" fill="#F59E0B22" stroke="#F59E0B" strokeWidth="3"/><text x="288" y="204" textAnchor="middle" fill="#F8FAFC" fontSize="13" fontWeight="800" fontFamily="'Baloo 2'">Triangle</text>
    <circle cx="390" cy="156" r="28" fill="#22C55E22" stroke="#22C55E" strokeWidth="3"/><text x="390" y="204" textAnchor="middle" fill="#F8FAFC" fontSize="13" fontWeight="800" fontFamily="'Baloo 2'">Circle</text>
    <polygon points="470,182 444,162 454,130 486,130 496,162" fill="#EC489922" stroke="#EC4899" strokeWidth="3"/><text x="470" y="204" textAnchor="middle" fill="#F8FAFC" fontSize="13" fontWeight="800" fontFamily="'Baloo 2'">Pentagon</text>
    <polygon points="554,182 530,168 530,142 554,128 578,142 578,168" fill="#FACC1522" stroke="#FACC15" strokeWidth="3"/><text x="554" y="204" textAnchor="middle" fill="#F8FAFC" fontSize="13" fontWeight="800" fontFamily="'Baloo 2'">Hexagon</text>
    <text x="52" y="112" fill="#94A3B8" fontSize="13" fontWeight="700" fontFamily="'Baloo 2'">Flat shapes have length and width. Count sides, corners, and equal sides.</text>
  </svg></div>);
}

function Math3DShapesToolkitSVG() {
  return (<div className="math-svg"><svg viewBox="0 0 640 270" xmlns="http://www.w3.org/2000/svg">
    <rect width="640" height="270" rx="20" fill="#0F172A"/>
    <text x="34" y="38" fill="#F59E0B" fontSize="13" fontWeight="800" fontFamily="'Baloo 2'">Textbook Model</text>
    <text x="34" y="66" fill="#F8FAFC" fontSize="24" fontWeight="900" fontFamily="'Baloo 2'">3D Shapes</text>
    <rect x="34" y="88" width="572" height="146" rx="16" fill="#1E293B" stroke="#F59E0B"/>
    <g transform="translate(70 112)">
      <rect x="0" y="18" width="54" height="54" fill="none" stroke="#38BDF8" strokeWidth="3"/><rect x="18" y="0" width="54" height="54" fill="none" stroke="#38BDF8" strokeWidth="3"/><line x1="0" y1="18" x2="18" y2="0" stroke="#38BDF8" strokeWidth="3"/><line x1="54" y1="18" x2="72" y2="0" stroke="#38BDF8" strokeWidth="3"/><line x1="54" y1="72" x2="72" y2="54" stroke="#38BDF8" strokeWidth="3"/><line x1="0" y1="72" x2="18" y2="54" stroke="#38BDF8" strokeWidth="3"/>
      <text x="36" y="96" textAnchor="middle" fill="#F8FAFC" fontSize="13" fontWeight="800" fontFamily="'Baloo 2'">Cube</text>
    </g>
    <g transform="translate(206 110)">
      <ellipse cx="36" cy="12" rx="30" ry="12" fill="#22C55E22" stroke="#22C55E" strokeWidth="3"/><line x1="6" y1="12" x2="6" y2="72" stroke="#22C55E" strokeWidth="3"/><line x1="66" y1="12" x2="66" y2="72" stroke="#22C55E" strokeWidth="3"/><ellipse cx="36" cy="72" rx="30" ry="12" fill="#22C55E22" stroke="#22C55E" strokeWidth="3"/>
      <text x="36" y="102" textAnchor="middle" fill="#F8FAFC" fontSize="13" fontWeight="800" fontFamily="'Baloo 2'">Cylinder</text>
    </g>
    <g transform="translate(338 110)">
      <ellipse cx="36" cy="74" rx="32" ry="12" fill="#A855F722" stroke="#A855F7" strokeWidth="3"/><line x1="4" y1="74" x2="36" y2="8" stroke="#A855F7" strokeWidth="3"/><line x1="68" y1="74" x2="36" y2="8" stroke="#A855F7" strokeWidth="3"/>
      <text x="36" y="102" textAnchor="middle" fill="#F8FAFC" fontSize="13" fontWeight="800" fontFamily="'Baloo 2'">Cone</text>
    </g>
    <g transform="translate(470 110)">
      <circle cx="36" cy="42" r="34" fill="#F59E0B22" stroke="#F59E0B" strokeWidth="3"/><ellipse cx="36" cy="42" rx="34" ry="12" fill="none" stroke="#FDE68A" strokeWidth="2"/>
      <text x="36" y="102" textAnchor="middle" fill="#F8FAFC" fontSize="13" fontWeight="800" fontFamily="'Baloo 2'">Sphere</text>
    </g>
    <text x="52" y="112" fill="#94A3B8" fontSize="13" fontWeight="700" fontFamily="'Baloo 2'">3D shapes have length, width, and height. Count faces, edges, and vertices.</text>
  </svg></div>);
}

function MathGeometryToolkitSVG({ sub }) {
  const title = (sub?.t || "").toLowerCase();
  if (title.includes("parallel") || title.includes("perpendicular")) return <MathParallelPerpendicularToolkitSVG />;
  if (title.includes("2d")) return <Math2DShapesToolkitSVG />;
  if (title.includes("3d")) return <Math3DShapesToolkitSVG />;
  return <MathLinesAnglesToolkitSVG />;
}

function MathBarGraphToolkitSVG() {
  return (<div className="math-svg"><svg viewBox="0 0 640 270" xmlns="http://www.w3.org/2000/svg">
    <rect width="640" height="270" rx="20" fill="#0F172A"/>
    <text x="34" y="38" fill="#38BDF8" fontSize="13" fontWeight="800" fontFamily="'Baloo 2'">Textbook Model</text>
    <text x="34" y="66" fill="#F8FAFC" fontSize="24" fontWeight="900" fontFamily="'Baloo 2'">Bar Graphs</text>
    <line x1="86" y1="210" x2="292" y2="210" stroke="#F8FAFC" strokeWidth="4"/><line x1="86" y1="210" x2="86" y2="98" stroke="#F8FAFC" strokeWidth="4"/>
    {[0,10,20,30].map((n, i) => <g key={n}><line x1="78" y1={210 - i*34} x2="94" y2={210 - i*34} stroke="#94A3B8" strokeWidth="2"/><text x="64" y={214 - i*34} textAnchor="end" fill="#94A3B8" fontSize="12" fontWeight="700" fontFamily="'Baloo 2'">{n}</text></g>)}
    <rect x="114" y="142" width="34" height="68" rx="6" fill="#F59E0B"/><rect x="170" y="108" width="34" height="102" rx="6" fill="#22C55E"/><rect x="226" y="74" width="34" height="136" rx="6" fill="#A855F7"/>
    <text x="131" y="230" textAnchor="middle" fill="#F8FAFC" fontSize="12" fontWeight="800" fontFamily="'Baloo 2'">Apple</text><text x="187" y="230" textAnchor="middle" fill="#F8FAFC" fontSize="12" fontWeight="800" fontFamily="'Baloo 2'">Banana</text><text x="243" y="230" textAnchor="middle" fill="#F8FAFC" fontSize="12" fontWeight="800" fontFamily="'Baloo 2'">Mango</text>
    <rect x="330" y="88" width="276" height="146" rx="16" fill="#1E293B" stroke="#38BDF8"/>
    <text x="350" y="114" fill="#38BDF8" fontSize="15" fontWeight="800" fontFamily="'Baloo 2'">How to Read</text>
    <text x="350" y="146" fill="#F8FAFC" fontSize="14" fontWeight="800" fontFamily="'Baloo 2'">1. Read the title and both axes.</text>
    <text x="350" y="172" fill="#F8FAFC" fontSize="14" fontWeight="800" fontFamily="'Baloo 2'">2. Check the scale: 0, 10, 20, 30.</text>
    <text x="350" y="198" fill="#F8FAFC" fontSize="14" fontWeight="800" fontFamily="'Baloo 2'">3. Compare bar heights to find most or least.</text>
    <text x="350" y="224" fill="#94A3B8" fontSize="13" fontWeight="700" fontFamily="'Baloo 2'">Equal-width bars with equal spacing make the graph fair.</text>
  </svg></div>);
}

function MathPictographToolkitSVG() {
  return (<div className="math-svg"><svg viewBox="0 0 640 270" xmlns="http://www.w3.org/2000/svg">
    <rect width="640" height="270" rx="20" fill="#0F172A"/>
    <text x="34" y="38" fill="#22C55E" fontSize="13" fontWeight="800" fontFamily="'Baloo 2'">Textbook Model</text>
    <text x="34" y="66" fill="#F8FAFC" fontSize="24" fontWeight="900" fontFamily="'Baloo 2'">Pictographs</text>
    <rect x="34" y="88" width="262" height="146" rx="16" fill="#1E293B" stroke="#22C55E"/>
    <text x="54" y="114" fill="#22C55E" fontSize="15" fontWeight="800" fontFamily="'Baloo 2'">Key</text>
    <text x="54" y="142" fill="#F8FAFC" fontSize="20" fontWeight="900" fontFamily="'Baloo 2'">★ = 4 students</text>
    <text x="54" y="178" fill="#F8FAFC" fontSize="16" fontWeight="800" fontFamily="'Baloo 2'">Blue  ★ ★ ★  = 12</text>
    <text x="54" y="204" fill="#F8FAFC" fontSize="16" fontWeight="800" fontFamily="'Baloo 2'">Red   ★ ★    = 8</text>
    <text x="54" y="228" fill="#94A3B8" fontSize="13" fontWeight="700" fontFamily="'Baloo 2'">Half a symbol means half the key value.</text>
    <rect x="318" y="88" width="288" height="146" rx="16" fill="#1E293B" stroke="#86EFAC"/>
    <text x="338" y="114" fill="#86EFAC" fontSize="15" fontWeight="800" fontFamily="'Baloo 2'">How to Solve</text>
    <text x="338" y="146" fill="#F8FAFC" fontSize="14" fontWeight="800" fontFamily="'Baloo 2'">1. Read one picture from the key.</text>
    <text x="338" y="172" fill="#F8FAFC" fontSize="14" fontWeight="800" fontFamily="'Baloo 2'">2. Count pictures in each row.</text>
    <text x="338" y="198" fill="#F8FAFC" fontSize="14" fontWeight="800" fontFamily="'Baloo 2'">3. Multiply count by key value.</text>
    <text x="338" y="224" fill="#94A3B8" fontSize="13" fontWeight="700" fontFamily="'Baloo 2'">Example: 3 stars means 3 × 4 = 12 students.</text>
  </svg></div>);
}

function MathLineGraphToolkitSVG() {
  return (<div className="math-svg"><svg viewBox="0 0 640 270" xmlns="http://www.w3.org/2000/svg">
    <rect width="640" height="270" rx="20" fill="#0F172A"/>
    <text x="34" y="38" fill="#A855F7" fontSize="13" fontWeight="800" fontFamily="'Baloo 2'">Textbook Model</text>
    <text x="34" y="66" fill="#F8FAFC" fontSize="24" fontWeight="900" fontFamily="'Baloo 2'">Line Graphs</text>
    <line x1="86" y1="212" x2="300" y2="212" stroke="#F8FAFC" strokeWidth="4"/><line x1="86" y1="212" x2="86" y2="96" stroke="#F8FAFC" strokeWidth="4"/>
    <polyline points="110,188 154,170 198,136 242,150 286,116" fill="none" stroke="#A855F7" strokeWidth="4"/>
    {[["Mon",110,188],["Tue",154,170],["Wed",198,136],["Thu",242,150],["Fri",286,116]].map(([d,x,y]) => <g key={d}><circle cx={x} cy={y} r="6" fill="#F59E0B"/><text x={x} y="232" textAnchor="middle" fill="#F8FAFC" fontSize="12" fontWeight="800" fontFamily="'Baloo 2'">{d}</text></g>)}
    <text x="330" y="112" fill="#A855F7" fontSize="15" fontWeight="800" fontFamily="'Baloo 2'">Trend Reading</text>
    <rect x="330" y="126" width="276" height="108" rx="16" fill="#1E293B" stroke="#A855F7"/>
    <text x="350" y="154" fill="#F8FAFC" fontSize="14" fontWeight="800" fontFamily="'Baloo 2'">Line rising upward = increase</text>
    <text x="350" y="180" fill="#F8FAFC" fontSize="14" fontWeight="800" fontFamily="'Baloo 2'">Line falling downward = decrease</text>
    <text x="350" y="206" fill="#F8FAFC" fontSize="14" fontWeight="800" fontFamily="'Baloo 2'">Flat line = no change</text>
    <text x="350" y="228" fill="#94A3B8" fontSize="13" fontWeight="700" fontFamily="'Baloo 2'">Steeper slope means faster change.</text>
  </svg></div>);
}

function MathDataInterpretationToolkitSVG() {
  return (<div className="math-svg"><svg viewBox="0 0 640 270" xmlns="http://www.w3.org/2000/svg">
    <rect width="640" height="270" rx="20" fill="#0F172A"/>
    <text x="34" y="38" fill="#F59E0B" fontSize="13" fontWeight="800" fontFamily="'Baloo 2'">Textbook Model</text>
    <text x="34" y="66" fill="#F8FAFC" fontSize="24" fontWeight="900" fontFamily="'Baloo 2'">Interpreting Data</text>
    <rect x="34" y="88" width="248" height="146" rx="16" fill="#1E293B" stroke="#F59E0B"/>
    <text x="54" y="114" fill="#F59E0B" fontSize="15" fontWeight="800" fontFamily="'Baloo 2'">Sample Table</text>
    <text x="54" y="142" fill="#F8FAFC" fontSize="14" fontWeight="800" fontFamily="'Baloo 2'">Apples   30</text>
    <text x="54" y="168" fill="#F8FAFC" fontSize="14" fontWeight="800" fontFamily="'Baloo 2'">Bananas  45</text>
    <text x="54" y="194" fill="#F8FAFC" fontSize="14" fontWeight="800" fontFamily="'Baloo 2'">Oranges  20</text>
    <text x="54" y="220" fill="#F8FAFC" fontSize="14" fontWeight="800" fontFamily="'Baloo 2'">Grapes   35</text>
    <rect x="304" y="88" width="302" height="146" rx="16" fill="#1E293B" stroke="#FDE68A"/>
    <text x="324" y="114" fill="#FDE68A" fontSize="15" fontWeight="800" fontFamily="'Baloo 2'">Question Checks</text>
    <text x="324" y="144" fill="#F8FAFC" fontSize="14" fontWeight="800" fontFamily="'Baloo 2'">Highest: 45 bananas</text>
    <text x="324" y="170" fill="#F8FAFC" fontSize="14" fontWeight="800" fontFamily="'Baloo 2'">Lowest: 20 oranges</text>
    <text x="324" y="196" fill="#F8FAFC" fontSize="14" fontWeight="800" fontFamily="'Baloo 2'">Range: 45 - 20 = 25</text>
    <text x="324" y="222" fill="#94A3B8" fontSize="13" fontWeight="700" fontFamily="'Baloo 2'">Always read title, labels, total, difference, and trend.</text>
  </svg></div>);
}

function MathDataHandlingToolkitSVG({ sub }) {
  const title = (sub?.t || "").toLowerCase();
  if (title.includes("pictograph")) return <MathPictographToolkitSVG />;
  if (title.includes("line")) return <MathLineGraphToolkitSVG />;
  if (title.includes("interpreting")) return <MathDataInterpretationToolkitSVG />;
  return <MathBarGraphToolkitSVG />;
}

function MathTextbookStarterSVG({ sub, lessonTitle }) {
  const theme = getMathVisualTheme(sub, lessonTitle);
  const examples = getMathWorkedExamples(sub).slice(0, 2);
  const rule = getMathQuickRule(sub, lessonTitle);
  const steps = getMathSolveSteps(sub, lessonTitle).slice(0, 3);
  return (<div className="math-svg"><svg viewBox="0 0 640 270" xmlns="http://www.w3.org/2000/svg">
    <rect width="640" height="270" rx="20" fill="#0F172A"/>
    <text x="34" y="38" fill={theme.accent} fontSize="13" fontWeight="800" fontFamily="'Baloo 2'">Textbook Model</text>
    <text x="34" y="66" fill="#F8FAFC" fontSize="24" fontWeight="900" fontFamily="'Baloo 2'">{clipSvgText(sub?.t || "Math Method", 24)}</text>
    <rect x="32" y="86" width="242" height="152" rx="18" fill={theme.soft} opacity="0.18" stroke={theme.accent} strokeWidth="1.4"/>
    <text x="52" y="112" fill={theme.accent} fontSize="15" fontWeight="800" fontFamily="'Baloo 2'">Worked Pattern</text>
    <SvgTextBlock text={examples[0] || rule} x={52} y={138} maxChars={24} maxLines={3} lineHeight={18} fill="#F8FAFC" size={14} weight={700}/>
    <line x1="52" y1="178" x2="254" y2="178" stroke="#334155" strokeWidth="1.5"/>
    <SvgTextBlock text={examples[1] || "Check the same pattern with another example."} x={52} y={202} maxChars={24} maxLines={3} lineHeight={18} fill="#CBD5E1" size={13} weight={600}/>
    <rect x="292" y="86" width="316" height="58" rx="18" fill={theme.accent} opacity="0.16" stroke={theme.accent} strokeWidth="1.4"/>
    <text x="314" y="112" fill={theme.chip} fontSize="13" fontWeight="800" fontFamily="'Baloo 2'">Rule to Remember</text>
    <SvgTextBlock text={rule} x={314} y={134} maxChars={31} maxLines={2} lineHeight={17} fill="#F8FAFC" size={14} weight={700}/>
    {steps.map((step, idx) => {
      const y = 170 + idx * 28;
      return <g key={idx}>
        <circle cx="314" cy={y - 4} r="10" fill={theme.accent}/>
        <text x="314" y={y} textAnchor="middle" fill="#082F49" fontSize="12" fontWeight="900" fontFamily="'Baloo 2'">{idx + 1}</text>
        <SvgTextBlock text={step} x={334} y={y} maxChars={31} maxLines={1} lineHeight={16} fill="#E2E8F0" size={13} weight={700}/>
      </g>;
    })}
  </svg></div>);
}

function renderMathTextbookPrimarySVG(sub, lessonTitle) {
  const title = `${lessonTitle || ""} ${sub?.t || ""}`.toLowerCase();
  const content = (sub?.c || "").toLowerCase();
  if ((lessonTitle || "").toLowerCase().includes("geometry")) return <MathGeometryToolkitSVG sub={sub} />;
  if ((lessonTitle || "").toLowerCase().includes("data handling")) return <MathDataHandlingToolkitSVG sub={sub} />;
  if (/word problem|story problem|problem solving/.test(title) || /shared equally|each|perimeter|area|volume|altogether|left/.test(content)) return <MathWordProblemStrategySVG sub={sub} lessonTitle={lessonTitle} />;
  if (/multiplication|multiply|times/.test(title)) return <MathMultiplicationMethodSVG />;
  if (/division|divide|quotient|remainder/.test(title)) return <MathLongDivisionMethodSVG />;
  if (/prime|composite|factor|multiple|hcf|lcm/.test(title)) return <MathFactorsToolkitSVG sub={sub} />;
  if (/fraction|numerator|denominator|mixed number|equivalent/.test(title)) return <MathFractionsToolkitSVG sub={sub} />;
  if (/decimal/.test(title)) return <MathDecimalsToolkitSVG sub={sub} />;
  if (/ratio|percent|percentage/.test(title)) return <MathRatioPercentToolkitSVG sub={sub} />;
  return <MathTextbookStarterSVG sub={sub} lessonTitle={lessonTitle} />;
}

function MathMethodStepsSVG({ sub, lessonTitle }) {
  const theme = getMathVisualTheme(sub, lessonTitle);
  const steps = getMathSolveSteps(sub, lessonTitle);
  return (<div className="math-svg"><svg viewBox="0 0 640 300" xmlns="http://www.w3.org/2000/svg">
    <rect width="640" height="300" rx="20" fill="#0F172A"/>
    <text x="36" y="40" fill={theme.accent} fontSize="13" fontWeight="800" fontFamily="'Baloo 2'">Method Path</text>
    {steps.map((step, idx) => {
      const y = 64 + idx * 56;
      return <g key={idx}>
        {idx < steps.length - 1 && <line x1="78" y1={y + 40} x2="78" y2={y + 60} stroke={theme.chip} strokeWidth="4" strokeLinecap="round" opacity="0.8"/>}
        <circle cx="78" cy={y + 20} r="18" fill={theme.accent}/>
        <text x="78" y={y + 26} textAnchor="middle" fill="#082F49" fontSize="16" fontWeight="900" fontFamily="'Baloo 2'">{idx + 1}</text>
        <rect x="112" y={y} width="486" height="40" rx="14" fill={theme.soft} opacity="0.18" stroke={theme.accent} strokeWidth="1.3"/>
        <SvgTextBlock text={step} x={132} y={y + 24} maxChars={50} maxLines={2} lineHeight={15} fill="#E2E8F0" size={13} weight={700} />
      </g>;
    })}
  </svg></div>);
}

function MathWorkedExamplesSVG({ sub, lessonTitle }) {
  const theme = getMathVisualTheme(sub, lessonTitle);
  const samples = getMathWorkedExamples(sub);
  return (<div className="math-svg"><svg viewBox="0 0 640 280" xmlns="http://www.w3.org/2000/svg">
    <rect width="640" height="280" rx="20" fill="#0F172A"/>
    <text x="34" y="40" fill={theme.accent} fontSize="13" fontWeight="800" fontFamily="'Baloo 2'">Worked Examples</text>
    {samples.map((sample, idx) => {
      const y = 58 + idx * 68;
      return <g key={idx}>
        <rect x="28" y={y} width="584" height="52" rx="16" fill={theme.soft} opacity="0.16" stroke={theme.accent} strokeWidth="1.2"/>
        <rect x="42" y={y + 10} width="78" height="30" rx="12" fill={theme.accent}/>
        <text x="81" y={y + 30} textAnchor="middle" fill="#082F49" fontSize="13" fontWeight="900" fontFamily="'Baloo 2'">Example {idx + 1}</text>
        <SvgTextBlock text={sample} x={136} y={y + 22} maxChars={49} maxLines={2} lineHeight={17} fill="#F8FAFC" size={14} weight={700} />
      </g>;
    })}
  </svg></div>);
}

function MathPracticePlanSVG({ sub, lessonTitle }) {
  const theme = getMathVisualTheme(sub, lessonTitle);
  const problem = clipSvgText(getMathPracticeExample(sub), 180);
  const checks = ["Underline the numbers.", "Pick the rule or operation.", "Solve neatly step by step.", "Check the answer against the story."];
  return (<div className="math-svg"><svg viewBox="0 0 640 280" xmlns="http://www.w3.org/2000/svg">
    <rect width="640" height="280" rx="20" fill="#0F172A"/>
    <text x="34" y="40" fill={theme.accent} fontSize="13" fontWeight="800" fontFamily="'Baloo 2'">Problem Plan</text>
    <rect x="28" y="58" width="270" height="194" rx="18" fill={theme.soft} opacity="0.16" stroke={theme.accent} strokeWidth="1.2"/>
    <text x="46" y="86" fill="#F8FAFC" fontSize="18" fontWeight="800" fontFamily="'Baloo 2'">Try This Question</text>
    <SvgTextBlock text={problem} x={46} y={110} maxChars={28} maxLines={6} lineHeight={18} fill="#E2E8F0" size={14} weight={600} />
    <rect x="316" y="58" width="296" height="82" rx="18" fill={theme.accent} opacity="0.16" stroke={theme.accent} strokeWidth="1.2"/>
    <text x="336" y="84" fill={theme.chip} fontSize="13" fontWeight="800" fontFamily="'Baloo 2'">Quick Rule</text>
    <SvgTextBlock text={getMathQuickRule(sub, lessonTitle)} x={336} y={106} maxChars={30} maxLines={2} lineHeight={17} fill="#F8FAFC" size={14} weight={700} />
    {checks.map((item, idx) => {
      const y = 162 + idx * 28;
      return <g key={idx}>
        <rect x="334" y={y - 13} width="18" height="18" rx="4" fill={theme.soft} opacity="0.26" stroke={theme.chip} strokeWidth="1.1"/>
        <SvgTextBlock text={item} x={364} y={y} maxChars={28} maxLines={1} lineHeight={16} fill="#E2E8F0" size={13} weight={700} />
      </g>;
    })}
  </svg></div>);
}

function MathVisualDeck({ sub, lessonTitle }) {
  const primary = renderMathPrimaryVisual(sub);
  const cards = primary
    ? [
        { label: "Core Model", content: primary },
        { label: "Solve Steps", content: <MathMethodStepsSVG sub={sub} lessonTitle={lessonTitle} /> },
        { label: "Worked Examples", content: <MathWorkedExamplesSVG sub={sub} lessonTitle={lessonTitle} /> },
        { label: "Problem Practice", content: <MathPracticePlanSVG sub={sub} lessonTitle={lessonTitle} /> }
      ]
    : [
        { label: "Textbook Model", content: renderMathTextbookPrimarySVG(sub, lessonTitle) },
        { label: "Solve Steps", content: <MathMethodStepsSVG sub={sub} lessonTitle={lessonTitle} /> },
        { label: "Worked Examples", content: <MathWorkedExamplesSVG sub={sub} lessonTitle={lessonTitle} /> },
        { label: "Problem Practice", content: <MathPracticePlanSVG sub={sub} lessonTitle={lessonTitle} /> }
      ];
  return (
    <div className="math-visual-stack">
      {cards.map((card, idx) => (
        <div key={idx} className="math-visual-panel">
          <div className="math-visual-label">{card.label}</div>
          {card.content}
        </div>
      ))}
    </div>
  );
}

// ─── Math Sub-Quiz Component (proper hooks) ───
function MathSubQuiz({ questions, isUrdu }) {
  const [mqIdx, setMqIdx] = useState(0);
  const [mqAns, setMqAns] = useState([]);
  const [mqRev, setMqRev] = useState(false);
  const [mqDone, setMqDone] = useState(false);
  const mq = questions;
  const currentQ = mq[mqIdx] || {};
  const questionIsUrdu = isUrdu || isUrduText(currentQ.q);
  const mqScore = mqDone ? mqAns.reduce((a,v,i) => a + (v === mq[i]?.c ? 1 : 0), 0) : 0;
  const reset = () => { setMqIdx(0); setMqAns([]); setMqRev(false); setMqDone(false); };
  const speakText = (txt, e) => { if(e) e.stopPropagation(); const ur = isUrduText(txt); window.speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(ttsClean(txt)); u.lang=ur?"ur-PK":"en-US"; u.rate=0.85; const v=window.speechSynthesis.getVoices(); const p=ur?(v.find(x=>x.lang.startsWith("ur"))||v.find(x=>x.lang.startsWith("hi"))||v.find(x=>x.lang.includes("IN"))):(v.find(x=>x.lang.startsWith("en")&&x.localService)||v.find(x=>x.lang.startsWith("en"))); if(p){u.voice=p; if(ur)u.lang=p.lang;} window.speechSynthesis.speak(u); };
  const playSound = (correct) => { try { const ac = new (window.AudioContext||window.webkitAudioContext)(); const osc = ac.createOscillator(); const gain = ac.createGain(); osc.connect(gain); gain.connect(ac.destination); gain.gain.value = 0.15; if(correct){ osc.frequency.value=523; osc.start(); osc.frequency.setValueAtTime(659,ac.currentTime+0.1); osc.frequency.setValueAtTime(784,ac.currentTime+0.2); osc.stop(ac.currentTime+0.35); } else { osc.frequency.value=330; osc.type="square"; osc.start(); osc.frequency.setValueAtTime(277,ac.currentTime+0.15); osc.stop(ac.currentTime+0.3); } } catch(e){} };

  if (mqDone) return (
    <div className="quiz-result">
      <div className="result-emoji">{mqScore >= mq.length - 1 ? "🏆" : mqScore >= mq.length / 2 ? "🌟" : "💪"}</div>
      <h2>{mqScore}/{mq.length} Correct!</h2>
      <p style={{color:"var(--text-secondary)",marginBottom:16,fontFamily:isUrdu?"'Noto Nastaliq Urdu',serif":"inherit",direction:isUrdu?"rtl":"ltr"}}>{mqScore >= mq.length - 1 ? (isUrdu?"شاباش! آپ نے یہ موضوع سیکھ لیا!":"Excellent! You mastered this topic!") : mqScore >= mq.length / 2 ? (isUrdu?"اچھا! غلط جوابات دوبارہ دیکھیں۔":"Good job! Review the ones you missed.") : (isUrdu?"مشق جاری رکھیں!":"Keep practicing! You'll get better.")}</p>
      <button className="start-quiz-btn" style={isUrdu?{fontFamily:"'Noto Nastaliq Urdu',serif"}:{}} onClick={reset}>{isUrdu?"🔄 دوبارہ کوشش":"🔄 Retry Quiz"}</button>
    </div>
  );

  return (
    <div className="quiz-container" style={questionIsUrdu?{direction:"rtl"}:{}}>
      <div className="quiz-progress">{mq.map((_, i) => <div key={i} className={"qp-dot" + (i < mqIdx ? " done" : i === mqIdx ? " current" : "")} />)}</div>
      <div className="quiz-question" onClick={()=>speakText(currentQ.q)} style={{cursor:"pointer",direction:questionIsUrdu?"rtl":"ltr",fontFamily:questionIsUrdu?"'Noto Nastaliq Urdu',serif":"inherit",textAlign:questionIsUrdu?"right":"left"}}>
        <div className="q-num" style={{textAlign:questionIsUrdu?"right":"left",marginBottom:8,fontFamily:questionIsUrdu?"'Noto Nastaliq Urdu',serif":"inherit"}}>{questionIsUrdu?("سوال "+(mqIdx+1)+" از "+mq.length):("Q "+(mqIdx+1)+" of "+mq.length)} <span style={{fontSize:14,opacity:0.5,marginLeft:6}}>🔈</span></div>
        <h3 style={{marginTop:4,fontFamily:questionIsUrdu?"'Noto Nastaliq Urdu',serif":"inherit"}}>{currentQ.q}</h3>
      </div>
      <div className="quiz-options" style={questionIsUrdu?{direction:"rtl"}:{}}>{currentQ.a.map((opt, oi) => {
        const optionIsUrdu = isUrdu || isUrduText(opt);
        const sel = mqAns[mqIdx] === oi, cor = oi === mq[mqIdx].c;
        let cls = "quiz-option";
        if (mqRev && cor) cls += " correct";
        else if (mqRev && sel && !cor) cls += " wrong";
        else if (sel) cls += " selected";
        return (<button key={oi} className={cls} disabled={mqRev} style={optionIsUrdu?{direction:"rtl",fontFamily:"'Noto Nastaliq Urdu',serif",textAlign:"right"}:{}} onClick={() => {
          if (mqRev) return;
          const na = [...mqAns]; na[mqIdx] = oi; setMqAns(na); setMqRev(true);
          playSound(oi === mq[mqIdx].c);
          setTimeout(() => { if (mqIdx < mq.length - 1) { setMqIdx(mqIdx + 1); setMqRev(false); } else setMqDone(true); }, 1200);
        }}><span className="opt-letter">{"ABCD"[oi]}</span><span style={{flex:1,fontFamily:optionIsUrdu?"'Noto Nastaliq Urdu',serif":"inherit",direction:optionIsUrdu?"rtl":"ltr",textAlign:optionIsUrdu?"right":"left"}}>{opt}</span><span style={{fontSize:13,opacity:0.4,marginLeft:6}} onClick={(e)=>speakText(opt,e)}>🔈</span></button>);
      })}</div>
    </div>
  );
}

// ─── TTS Text Cleaner — fixes number reading ───
// ─── Number to Words converter ───
function numToWords(n) {
  if (n === 0) return "zero";
  const ones = ["","one","two","three","four","five","six","seven","eight","nine","ten","eleven","twelve","thirteen","fourteen","fifteen","sixteen","seventeen","eighteen","nineteen"];
  const tens = ["","","twenty","thirty","forty","fifty","sixty","seventy","eighty","ninety"];
  const scales = ["","thousand","million","billion","trillion"];
  if (n < 0) return "negative " + numToWords(-n);
  let words = "";
  let scaleIdx = 0;
  while (n > 0) {
    const chunk = n % 1000;
    if (chunk !== 0) {
      let cw = "";
      const h = Math.floor(chunk / 100), r = chunk % 100;
      if (h > 0) cw += ones[h] + " hundred ";
      if (r > 0) { if (h > 0) cw += "and "; if (r < 20) cw += ones[r]; else cw += tens[Math.floor(r/10)] + (r%10 ? " " + ones[r%10] : ""); }
      words = cw.trim() + (scales[scaleIdx] ? " " + scales[scaleIdx] : "") + (words ? " " : "") + words;
    }
    n = Math.floor(n / 1000);
    scaleIdx++;
  }
  return words.trim();
}

function ttsClean(text) {
  return text
    .replace(/\[(\d+)\]/g, '$1')
    .replace(/₹|Rs\.?\s*/g, 'Rupees ')
    .replace(/→/g, ' to ')
    .replace(/\s=\s(?=_{3,}|\[\s*\]|\s*$)/g, ' ')
    .replace(/(\d)\s*>\s*(\d)/g, '$1 greater than $2')
    .replace(/(\d)\s*<\s*(\d)/g, '$1 less than $2')
    .replace(/___\s*>\s*/g, ' is greater than ')
    .replace(/___\s*<\s*/g, ' is less than ')
    .replace(/_{3,}/g, ' ')
    .replace(/\b>\b/g, ' greater than ')
    .replace(/[≈≥≤]/g, m => m==='≈'?' approximately ':m==='≥'?' greater than or equal to ':' less than or equal to ')
    .replace(/×/g, ' times ')
    .replace(/÷/g, ' divided by ')
    .replace(/←/g, ' left ')
    .replace(/↑/g, ' up ')
    .replace(/↓/g, ' down ')
    // Convert numbers with commas or 4+ digits to words
    .replace(/\d{1,3}(,\d{3})+/g, m => numToWords(parseInt(m.replace(/,/g,""))))
    .replace(/\b\d{4,}\b/g, m => numToWords(parseInt(m)))
    .replace(/\s+/g, ' ').trim();
}

function normalizeHighlightTerm(value) {
  if (value == null) return "";
  return String(value)
    .replace(/\([^)]*\)/g, " ")
    .replace(/[=:_]/g, " ")
    .trim()
    .toLowerCase();
}

function isAsciiLetter(char) {
  return /^[A-Za-z]$/.test(char || "");
}

function getSingleWordHighlightBase(term) {
  const cleaned = normalizeHighlightTerm(term);
  return /^[a-z]+$/.test(cleaned) ? cleaned : "";
}

function buildWordFamilyForms(term) {
  const base = getSingleWordHighlightBase(term);
  const forms = new Set(base ? [base] : []);
  if (!base || base.length < 4) return forms;
  forms.add(base + "s");
  forms.add(base + "es");
  if (base.endsWith("y") && !/[aeiou]y$/.test(base)) forms.add(base.slice(0, -1) + "ies");
  if (base.endsWith("e")) {
    forms.add(base + "d");
    forms.add(base.slice(0, -1) + "ing");
  } else {
    forms.add(base + "ed");
    forms.add(base + "ing");
  }
  if (base.endsWith("c")) {
    forms.add(base + "ked");
    forms.add(base + "king");
  }
  if (/[aeiou][bcdfghjklmnpqrstvwxyz]$/.test(base) && !/[wxy]$/.test(base)) {
    const last = base.slice(-1);
    forms.add(base + last + "ed");
    forms.add(base + last + "ing");
  }
  return forms;
}

function buildHighlightTerms(highlight) {
  const source = Array.isArray(highlight) ? highlight : [highlight];
  return [...new Set(source.map(normalizeHighlightTerm).filter(Boolean))].sort((a, b) => b.length - a.length);
}

function renderHighlightText(text, highlight, keyPrefix = "hl") {
  const terms = buildHighlightTerms(highlight);
  if (!terms.length) return text;
  const lower = String(text).toLowerCase();
  const matches = [];
  terms.forEach(term => {
    let from = 0;
    while (from < lower.length) {
      const idx = lower.indexOf(term, from);
      if (idx === -1) break;
      const before = idx === 0 ? "" : text[idx - 1];
      const after = idx + term.length >= text.length ? "" : text[idx + term.length];
      const needsBoundary = /^[a-z ]+$/.test(term);
      if (!needsBoundary || (!isAsciiLetter(before) && !isAsciiLetter(after))) {
        matches.push({ start: idx, end: idx + term.length });
      }
      from = idx + term.length;
    }
  });
  const wordMatcher = /[A-Za-z]+(?:'[A-Za-z]+)?/g;
  let wordMatch;
  while ((wordMatch = wordMatcher.exec(text)) !== null) {
    const token = wordMatch[0].toLowerCase();
    if (terms.some(term => buildWordFamilyForms(term).has(token))) {
      matches.push({ start: wordMatch.index, end: wordMatch.index + wordMatch[0].length });
    }
  }
  if (!matches.length) return text;
  matches.sort((a, b) => a.start - b.start || (b.end - b.start) - (a.end - a.start));
  const merged = [];
  matches.forEach(match => {
    const last = merged[merged.length - 1];
    if (!last || match.start >= last.end) {
      merged.push(match);
    }
  });
  if (!merged.length) return text;
  const parts = [];
  let cursor = 0;
  merged.forEach((match, index) => {
    if (match.start > cursor) parts.push(text.slice(cursor, match.start));
    parts.push(<span key={keyPrefix + "-" + index} style={{ color:"#38BDF8", fontWeight:700 }}>{text.slice(match.start, match.end)}</span>);
    cursor = match.end;
  });
  if (cursor < text.length) parts.push(text.slice(cursor));
  return <>{parts}</>;
}

function stripInlineUrduForKnownWords(text, words) {
  const families = (words || []).map(word => buildWordFamilyForms(word.en)).filter(set => set.size > 0);
  if (!families.length) return text;
  return String(text).replace(/([A-Za-z]+(?:'[A-Za-z]+)?)\s*\(([^)]*[\u0600-\u06FF][^)]*)\)/g, (full, englishWord) => {
    const token = englishWord.toLowerCase();
    return families.some(set => set.has(token)) ? englishWord : full;
  });
}

// ─── TTS Clickable Sentence ───
function SpeakableSentence({ text, lang = "en", highlight = null, fullWidth = true, buttonStyle = null, textStyle = null }) {
  const [speaking, setSpeaking] = useState(false);
  const handleClick = () => {
    window.speechSynthesis.cancel();
    setSpeaking(true);
    const u = new SpeechSynthesisUtterance(ttsClean(text));
    u.lang = lang === "ur" ? "ur-PK" : "en-US"; u.rate = 0.85; u.pitch = 1.05;
    const voices = window.speechSynthesis.getVoices();
    const pref = lang === "ur"
      ? voices.find(v => v.lang.startsWith("ur")) || voices.find(v => v.lang.startsWith("hi")) || voices.find(v => v.lang.includes("IN"))
      : voices.find(v => v.lang.startsWith("en") && v.localService) || voices.find(v => v.lang.startsWith("en"));
    if (pref) u.voice = pref;
    u.onend = () => setSpeaking(false); u.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(u);
  };
  const renderText = () => {
    let t = text;
    const parts = [];
    let lastIdx = 0;
    const symColors = {'>':'#22C55E','<':'#EF4444','=':'#38BDF8','≥':'#22C55E','≤':'#EF4444','≈':'#A855F7','+':'#F59E0B','×':'#EC4899','÷':'#14B8A6','→':'#38BDF8','←':'#38BDF8','↑':'#22C55E','↓':'#EF4444'};
    // Regex: [X] boxed | digit-symbol-digit math ops | standalone comparison symbols | arrows | blanks
    const re = /\[(\d+)\]|(\d\s*[><=≥≤≈+\-×÷]\s*\d)|(\s[><=≥≤≈]\s)|([→←↑↓])|(___)/g;
    let m;
    while ((m = re.exec(t)) !== null) {
      if (m.index > lastIdx) parts.push(t.slice(lastIdx, m.index));
      if (m[1]) {
        parts.push(<span key={"b"+m.index} style={{display:"inline-block",background:"#F59E0B22",border:"2px solid #F59E0B",borderRadius:6,padding:"0 5px",color:"#F59E0B",fontWeight:800,margin:"0 1px"}}>{m[1]}</span>);
      } else if (m[2]) {
        // digit-symbol-digit: color just the symbol, keep digits normal
        const inner = m[2];
        const si = inner.search(/[><=≥≤≈+\-×÷]/);
        const sym = inner[si];
        const sc = sym==='-'?'#EF4444':(symColors[sym]||'#F59E0B');
        parts.push(inner.slice(0,si));
        parts.push(<span key={"s"+m.index} style={{background:sc+"18",borderRadius:4,padding:"0 4px",color:sc,fontWeight:800,margin:"0 2px"}}>{sym}</span>);
        parts.push(inner.slice(si+1));
      } else if (m[3]) {
        const sym = m[3].trim();
        const sc = symColors[sym]||'#F59E0B';
        parts.push(" ");
        parts.push(<span key={"c"+m.index} style={{background:sc+"18",borderRadius:4,padding:"0 4px",color:sc,fontWeight:800,margin:"0 2px"}}>{sym}</span>);
        parts.push(" ");
      } else if (m[4]) {
        const sym = m[4];
        const sc = symColors[sym]||'#38BDF8';
        parts.push(<span key={"a"+m.index} style={{background:sc+"18",borderRadius:4,padding:"0 3px",color:sc,fontWeight:800,margin:"0 2px"}}>{sym}</span>);
      } else if (m[5]) {
        parts.push(<span key={"u"+m.index} style={{display:"inline-block",borderBottom:"3px solid #F59E0B",minWidth:50,margin:"0 4px"}}>&nbsp;&nbsp;&nbsp;&nbsp;</span>);
      }
      lastIdx = m.index + m[0].length;
    }
    if (parts.length > 0) { if (lastIdx < t.length) parts.push(t.slice(lastIdx)); return <>{parts}</>; }
    return renderHighlightText(text, highlight, "sentence");
  };
  return (
    <button onClick={handleClick} style={{ display: fullWidth ? "block" : "inline-block", width: fullWidth ? "100%" : "auto", maxWidth: "100%", textAlign: lang === "ur" ? "right" : "left", padding: "12px 16px", marginBottom: 6, borderRadius: 10, border: speaking ? "2px solid #38BDF8" : "1px solid rgba(148,163,184,0.15)", background: speaking ? "rgba(56,189,248,0.12)" : "rgba(30,41,59,0.6)", color: speaking ? "#38BDF8" : "#F1F5F9", fontFamily: lang === "ur" ? "'Noto Nastaliq Urdu', serif" : "'Baloo 2', sans-serif", fontSize: 18, lineHeight: 1.7, cursor: "pointer", transition: "all 0.25s", direction: lang === "ur" ? "rtl" : "ltr", boxShadow: speaking ? "0 0 16px rgba(56,189,248,0.2)" : "none", position: "relative", ...buttonStyle }}>
      <span style={{ position: "absolute", right: lang === "ur" ? "auto" : 12, left: lang === "ur" ? 12 : "auto", top: "50%", transform: "translateY(-50%)", fontSize: 16, opacity: speaking ? 1 : 0.4, transition: "opacity 0.2s" }}>{speaking ? "🔊" : "🔈"}</span>
      <span style={{ paddingRight: lang === "ur" ? 0 : 28, paddingLeft: lang === "ur" ? 28 : 0, ...textStyle }}>{renderText()}</span>
    </button>
  );
}

function MixedUrduParagraphSentence({ text, highlight = null }) {
  const [speaking, setSpeaking] = useState(false);
  const handleClick = () => {
    window.speechSynthesis.cancel();
    setSpeaking(true);
    const u = new SpeechSynthesisUtterance(ttsClean(text));
    u.lang = "en-US"; u.rate = 0.85; u.pitch = 1.05;
    const voices = window.speechSynthesis.getVoices();
    const pref = voices.find(v => v.lang.startsWith("en") && v.localService) || voices.find(v => v.lang.startsWith("en"));
    if (pref) u.voice = pref;
    u.onend = () => setSpeaking(false); u.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(u);
  };
  const renderHighlighted = (segment, keyBase) => {
    return renderHighlightText(segment, highlight, keyBase + "-hl");
  };
  const renderText = () => {
    const parts = [];
    const re = /\(([^)]*[\u0600-\u06FF][^)]*)\)/g;
    let lastIdx = 0;
    let match;
    while ((match = re.exec(text)) !== null) {
      if (match.index > lastIdx) {
        parts.push(<React.Fragment key={"txt-" + match.index}>{renderHighlighted(text.slice(lastIdx, match.index), "txt-" + match.index)}</React.Fragment>);
      }
      parts.push(
        <span key={"ur-" + match.index}>
          (
          <span style={{ fontFamily: "'Noto Nastaliq Urdu', serif", direction: "rtl", unicodeBidi: "isolate", textAlign: "right", color: "#C4B5FD" }}>
            {match[1]}
          </span>
          )
        </span>
      );
      lastIdx = match.index + match[0].length;
    }
    if (lastIdx < text.length) {
      parts.push(<React.Fragment key={"tail"}>{renderHighlighted(text.slice(lastIdx), "tail")}</React.Fragment>);
    }
    return parts.length ? <>{parts}</> : renderHighlighted(text, "full");
  };
  return (
    <button onClick={handleClick} style={{ display: "block", width: "100%", maxWidth: "100%", textAlign: "left", padding: "12px 16px", marginBottom: 6, borderRadius: 10, border: speaking ? "2px solid #38BDF8" : "1px solid rgba(148,163,184,0.15)", background: speaking ? "rgba(56,189,248,0.12)" : "rgba(30,41,59,0.6)", color: speaking ? "#38BDF8" : "#F1F5F9", fontFamily: "'Baloo 2', sans-serif", fontSize: 18, lineHeight: 1.7, cursor: "pointer", transition: "all 0.25s", direction: "ltr", boxShadow: speaking ? "0 0 16px rgba(56,189,248,0.2)" : "none", position: "relative" }}>
      <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", fontSize: 16, opacity: speaking ? 1 : 0.4, transition: "opacity 0.2s" }}>{speaking ? "🔊" : "🔈"}</span>
      <span style={{ paddingRight: 28 }}>{renderText()}</span>
    </button>
  );
}

function formatListedAnswer(text) {
  if (typeof text !== "string") return text;
  return text.replace(/(\d+\.)\s+/g, (match, marker, offset) => offset === 0 ? `${marker} ` : `\n${marker} `);
}

function isUrduText(text) {
  return /[\u0600-\u06FF]/.test(String(text || ""));
}

function normalizeText(text) {
  return String(text || "").replace(/\s+/g, " ").trim();
}

function trimQuestionText(text) {
  return normalizeText(String(text || "").replace(/_{3,}/g, "").replace(/\s*:\s*$/, "").replace(/\s*[?؟]\s*$/, ""));
}

function shortPromptLabel(text, isUrdu) {
  const words = trimQuestionText(text).split(/\s+/).filter(Boolean);
  const maxWords = isUrdu ? 6 : 7;
  const label = words.slice(0, maxWords).join(" ");
  return words.length > maxWords ? label + "…" : label;
}

function capitalizeFirst(text) {
  const value = String(text || "").trim();
  return value ? value.charAt(0).toUpperCase() + value.slice(1) : value;
}

function buildPromptCue(text, isUrdu) {
  const clean = trimQuestionText(text);
  if (!clean) return "";
  if (isUrdu) {
    return clean
      .replace(/^(کیا|کون|کہاں|کب|کتنے|کس|نام)\s+/u, "")
      .replace(/\s+(کیا ہے|کون ہے|کہاں ہے|کب ہوا|کتنے ہیں)$/u, "")
      .trim();
  }
  return clean
    .replace(/^(what|which|who|where|when|why|how many|how much|name|list|identify|define|write)\s+/i, "")
    .trim();
}

function buildEnglishAnswerSentence(prompt, valueText) {
  const clean = trimQuestionText(prompt);
  let match;
  if ((match = clean.match(/^What is (.+)$/i))) return `${capitalizeFirst(match[1])} is ${valueText}.`;
  if ((match = clean.match(/^What are (.+)$/i))) return `${capitalizeFirst(match[1])} are ${valueText}.`;
  if ((match = clean.match(/^Who is (.+)$/i))) return `${capitalizeFirst(match[1])} is ${valueText}.`;
  if ((match = clean.match(/^Who was (.+)$/i))) return `${capitalizeFirst(match[1])} was ${valueText}.`;
  if ((match = clean.match(/^Where is (.+)$/i))) return `${capitalizeFirst(match[1])} is located in ${valueText}.`;
  if ((match = clean.match(/^Where are (.+)$/i))) return `${capitalizeFirst(match[1])} are located in ${valueText}.`;
  if ((match = clean.match(/^When did (.+?) become (.+)$/i))) return `${capitalizeFirst(match[1])} became ${match[2]} in ${valueText}.`;
  if ((match = clean.match(/^When did (.+?) begin$/i))) return `${capitalizeFirst(match[1])} began in ${valueText}.`;
  if ((match = clean.match(/^When did (.+?) start$/i))) return `${capitalizeFirst(match[1])} started in ${valueText}.`;
  if ((match = clean.match(/^When did (.+?) happen$/i))) return `${capitalizeFirst(match[1])} happened in ${valueText}.`;
  if ((match = clean.match(/^Which (.+?) is (.+)$/i))) return `The ${match[1]} that is ${match[2]} is ${valueText}.`;
  if ((match = clean.match(/^Which (.+?) are (.+)$/i))) return `The ${match[1]} that are ${match[2]} are ${valueText}.`;
  if ((match = clean.match(/^How many (.+)$/i))) return `${capitalizeFirst(match[1])}: ${valueText}.`;
  if ((match = clean.match(/^(Name|List|Identify|Write) (.+)$/i))) return `${capitalizeFirst(match[2])}: ${valueText}.`;
  return `${shortPromptLabel(buildPromptCue(clean, false) || clean, false)}: ${valueText}`;
}

function buildUrduAnswerSentence(prompt, valueText) {
  const clean = trimQuestionText(prompt);
  let match;
  if ((match = clean.match(/^(.+)\s+کیا ہے$/u))) return `${match[1]} ${valueText} ہے۔`;
  if ((match = clean.match(/^(.+)\s+کون ہے$/u))) return `${match[1]} ${valueText} ہے۔`;
  if ((match = clean.match(/^(.+)\s+کون تھا$/u))) return `${match[1]} ${valueText} تھا۔`;
  if ((match = clean.match(/^(.+)\s+کہاں ہے$/u))) return `${match[1]} ${valueText} میں ہے۔`;
  if ((match = clean.match(/^(.+)\s+کتنے ہیں$/u))) return `${match[1]} ${valueText} ہیں۔`;
  if ((match = clean.match(/^(.+)\s+کب ہوا$/u))) return `${match[1]} ${valueText} میں ہوا۔`;
  if ((match = clean.match(/^نام لکھیں[: ]*(.+)$/u))) return `${match[1]}: ${valueText}`;
  return `${shortPromptLabel(buildPromptCue(clean, true) || clean, true)}: ${valueText}`;
}

function getExerciseKind(question) {
  const q = String(question || "");
  const lower = q.toLowerCase();
  if (lower.includes("fill in the blank") || q.includes("خالی جگہ")) return "fill";
  if (lower.includes("true or false") || q.includes("درست یا غلط")) return "tf";
  if (lower.includes("match the columns") || q.includes("کالم ملائیں")) return "match";
  return null;
}

function buildSeedPairs(sub) {
  const pairs = [];
  const pushPair = (prompt, answer) => {
    const cleanPrompt = trimQuestionText(prompt);
    const cleanAnswer = normalizeText(answer);
    if (!cleanPrompt || !cleanAnswer) return;
    const key = cleanPrompt + "||" + cleanAnswer;
    if (!pairs.some(p => p.key === key)) pairs.push({ key, prompt: cleanPrompt, answer: cleanAnswer });
  };

  (sub.exercises || []).forEach(ex => {
    if (!Array.isArray(ex.parts) || !Array.isArray(ex.ans)) return;
    ex.parts.forEach((part, index) => pushPair(part, ex.ans[index]));
  });

  (sub.quiz || []).forEach(item => {
    if (!item || !Array.isArray(item.a) || typeof item.c !== "number") return;
    pushPair(item.q, item.a[item.c]);
  });

  (sub.wordProblems || []).forEach(item => {
    if (item && typeof item === "object" && item.q && item.a) pushPair(item.q, item.a);
  });

  return pairs;
}

function buildFillPrompt(pair, isUrdu) {
  return isUrdu
    ? buildUrduAnswerSentence(pair.prompt, "___")
    : buildEnglishAnswerSentence(pair.prompt, "___");
}

function buildTrueFalseStatement(pair, answerText, isUrdu) {
  return isUrdu
    ? buildUrduAnswerSentence(pair.prompt, answerText)
    : buildEnglishAnswerSentence(pair.prompt, answerText);
}

function buildGeneratedExercise(kind, pairs, count, isUrdu) {
  const parts = [];
  const ans = [];
  if (!pairs.length || count <= 0) return { parts, ans };

  for (let i = 0; i < count; i++) {
    const pair = pairs[i % pairs.length];
    if (kind === "fill") {
      parts.push(buildFillPrompt(pair, isUrdu));
      ans.push(pair.answer);
      continue;
    }

    if (kind === "tf") {
      const altPair = pairs[(i + 1) % pairs.length];
      const useFalse = i % 2 === 1 && altPair && altPair.answer !== pair.answer;
      parts.push(buildTrueFalseStatement(pair, useFalse ? altPair.answer : pair.answer, isUrdu));
      ans.push(isUrdu ? (useFalse ? "غلط" : "درست") : (useFalse ? "False" : "True"));
      continue;
    }

    if (kind === "match") {
      const cue = buildPromptCue(pair.prompt, isUrdu) || pair.prompt;
      parts.push(shortPromptLabel(cue, isUrdu));
      ans.push(pair.answer);
    }
  }

  return { parts, ans };
}

function splitFactSentences(text) {
  return String(text || "")
    .split(/(?<=[.!?۔؟])\s+/)
    .map(s => normalizeText(s))
    .filter(Boolean);
}

function buildScienceTrueFalseFacts(sub, isUrdu) {
  const facts = [];
  const seen = new Set();
  const addFact = (text) => {
    const clean = normalizeText(text);
    if (!clean) return;
    const key = clean.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    facts.push({ part: clean, ans: isUrdu ? "درست" : "True" });
  };

  (sub.examples || []).forEach(addFact);
  splitFactSentences(sub.c).forEach(addFact);
  (sub.wordProblems || []).forEach(item => {
    if (!item || typeof item !== "object" || !item.a) return;
    const firstSentence = splitFactSentences(item.a)[0];
    if (firstSentence) addFact(firstSentence);
  });

  return facts;
}

function ensureScienceTrueFalseCount(exercise, sub, isUrdu) {
  const targetCount = 10;
  const currentParts = Array.isArray(exercise.parts) ? [...exercise.parts] : [];
  const currentAns = Array.isArray(exercise.ans) ? [...exercise.ans] : [];
  if (currentParts.length >= targetCount) return exercise;

  const existing = new Set(currentParts.map(p => normalizeText(p).toLowerCase()));
  const facts = buildScienceTrueFalseFacts(sub, isUrdu);
  for (const fact of facts) {
    const key = fact.part.toLowerCase();
    if (existing.has(key)) continue;
    currentParts.push(fact.part);
    currentAns.push(fact.ans);
    existing.add(key);
    if (currentParts.length >= targetCount) break;
  }

  if (currentParts.length < targetCount) {
    const fallback = buildGeneratedExercise("tf", buildSeedPairs(sub), targetCount - currentParts.length, isUrdu);
    currentParts.push(...fallback.parts);
    currentAns.push(...fallback.ans);
  }

  return { ...exercise, parts: currentParts, ans: currentAns };
}

function stripMatchPrefixes(exercise) {
  const currentParts = Array.isArray(exercise.parts) ? exercise.parts : [];
  return {
    ...exercise,
    parts: currentParts.map(part => String(part || "").replace(/^Question\s+\d+:\s*/i, "").replace(/^سوال\s+\d+:\s*/i, ""))
  };
}

function ensureExerciseCount(exercise, kind, pairs, isUrdu) {
  const targetCount = 10;
  const currentParts = Array.isArray(exercise.parts) ? [...exercise.parts] : [];
  const currentAns = Array.isArray(exercise.ans) ? [...exercise.ans] : [];
  if (currentParts.length >= targetCount) return exercise;

  const generated = buildGeneratedExercise(kind, pairs, targetCount - currentParts.length, isUrdu);
  return { ...exercise, parts: [...currentParts, ...generated.parts], ans: [...currentAns, ...generated.ans] };
}

function normalizeSubLesson(sub, subjectId) {
  if (!sub || !Array.isArray(sub.exercises)) return sub;

  const isUrdu = subjectId === "urdu" || isUrduText(sub.t) || isUrduText(sub.c);
  const isScience = subjectId === "science";
  const canonicalLabels = {
    fill: isUrdu ? "خالی جگہیں پُر کریں:" : "Fill in the blanks:",
    tf: isUrdu ? "درست یا غلط:" : "True or False:",
    match: isUrdu ? "کالم ملائیں:" : "Match the columns:"
  };
  const pairs = buildSeedPairs(sub);
  const seenKinds = new Set();
  const exercises = sub.exercises.map(ex => {
    const kind = getExerciseKind(ex.q);
    if (!kind || seenKinds.has(kind)) return ex;
    seenKinds.add(kind);
    let ensured = isScience && kind === "tf"
      ? ensureScienceTrueFalseCount(ex, sub, isUrdu)
      : ensureExerciseCount(ex, kind, pairs, isUrdu);
    if (kind === "match") ensured = stripMatchPrefixes(ensured);
    return { ...ensured, q: canonicalLabels[kind] };
  });

  ["fill", "tf", "match"].forEach(kind => {
    if (seenKinds.has(kind) || !pairs.length) return;
    if (isScience && kind === "tf") {
      const generated = ensureScienceTrueFalseCount({ q: canonicalLabels[kind], parts: [], ans: [] }, sub, isUrdu);
      exercises.push({ q: canonicalLabels[kind], parts: generated.parts, ans: generated.ans });
      return;
    }
    let generated = buildGeneratedExercise(kind, pairs, 10, isUrdu);
    if (kind === "match") generated = stripMatchPrefixes(generated);
    exercises.push({ q: canonicalLabels[kind], parts: generated.parts, ans: generated.ans });
  });

  return { ...sub, exercises };
}

function getSimpleMachinePromptVisual(sub, exercise, prompt) {
  if (!sub || sub.t !== "Simple Machines" || !exercise || exercise.q !== "Name the simple machine:") return null;
  const lower = (prompt || "").toLowerCase();
  const badgeStyle = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: 34,
    height: 34,
    borderRadius: 10,
    background: "rgba(245,158,11,0.12)",
    border: "1px solid rgba(245,158,11,0.28)",
    color: "#FDE68A",
    flexShrink: 0
  };
  if (lower.includes("flagpole rope")) {
    return (
      <span style={badgeStyle}>
        <svg width="22" height="22" viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <line x1="15" y1="3" x2="15" y2="18" stroke="#CBD5E1" strokeWidth="1.8"/>
          <circle cx="11" cy="8" r="3.6" fill="none" stroke="#F59E0B" strokeWidth="1.8"/>
          <line x1="11" y1="11.6" x2="11" y2="16.5" stroke="#CBD5E1" strokeWidth="1.8"/>
          <rect x="8.1" y="16.5" width="5.8" height="2.8" rx="1.2" fill="#F59E0B" opacity="0.28" stroke="#F59E0B" strokeWidth="1.1"/>
          <line x1="15" y1="5" x2="18.2" y2="6.8" stroke="#22C55E" strokeWidth="1.8"/>
          <polygon points="18.6,6.9 16.6,5.8 16.8,8.1" fill="#22C55E"/>
        </svg>
      </span>
    );
  }
  const icon = lower.includes("seesaw") ? "⚖️"
    : lower.includes("doorknob") ? "🚪"
    : lower.includes("wheelchair ramp") ? "♿"
    : lower.includes("axe blade") ? "🪓"
    : lower.includes("screw in wood") ? "🔩"
    : lower.includes("scissors") ? "✂️"
    : lower.includes("slide") ? "🛝"
    : null;
  return icon ? <span style={{...badgeStyle,fontSize:18}}>{icon}</span> : null;
}

function WordRow({ en, ur }) {
  const [sEn, setSEn] = useState(false);
  const [sUr, setSUr] = useState(false);
  const [sBoth, setSBoth] = useState(false);
  const getEnglishVoice = () => {
    const voices = window.speechSynthesis.getVoices();
    return voices.find(v => v.lang.startsWith("en") && v.localService) || voices.find(v => v.lang.startsWith("en"));
  };
  const getUrduVoice = () => {
    const voices = window.speechSynthesis.getVoices();
    return voices.find(v => v.lang.startsWith("ur")) || voices.find(v => v.lang.startsWith("hi")) || voices.find(v => v.lang.includes("IN"));
  };
  const speakEn = (e) => {
    e.stopPropagation(); window.speechSynthesis.cancel(); setSEn(true);
    const u = new SpeechSynthesisUtterance(ttsClean(en)); u.lang = "en-US"; u.rate = 0.8;
    const pref = getEnglishVoice();
    if (pref) u.voice = pref;
    u.onend = () => setSEn(false); u.onerror = () => setSEn(false);
    window.speechSynthesis.speak(u);
  };
  const speakUr = (e) => {
    e.stopPropagation(); window.speechSynthesis.cancel(); setSUr(true);
    const u = new SpeechSynthesisUtterance(ur); u.lang = "ur-PK"; u.rate = 0.8;
    const pref = getUrduVoice();
    if (pref) { u.voice = pref; u.lang = pref.lang; }
    u.onend = () => setSUr(false); u.onerror = () => setSUr(false);
    window.speechSynthesis.speak(u);
  };
  const speakBoth = () => {
    window.speechSynthesis.cancel();
    setSBoth(true);
    setSEn(true);
    setSUr(false);
    const enUtter = new SpeechSynthesisUtterance(ttsClean(en));
    enUtter.lang = "en-US";
    enUtter.rate = 0.8;
    const enVoice = getEnglishVoice();
    if (enVoice) enUtter.voice = enVoice;
    enUtter.onend = () => {
      setSEn(false);
      setSUr(true);
      const urUtter = new SpeechSynthesisUtterance(ur);
      urUtter.lang = "ur-PK";
      urUtter.rate = 0.8;
      const urVoice = getUrduVoice();
      if (urVoice) { urUtter.voice = urVoice; urUtter.lang = urVoice.lang; }
      urUtter.onend = () => { setSUr(false); setSBoth(false); };
      urUtter.onerror = () => { setSUr(false); setSBoth(false); };
      window.speechSynthesis.speak(urUtter);
    };
    enUtter.onerror = () => { setSEn(false); setSUr(false); setSBoth(false); };
    window.speechSynthesis.speak(enUtter);
  };
  return (
    <div className="word-row" onClick={speakBoth} style={{ cursor: "pointer", boxShadow: sBoth ? "0 0 0 1px rgba(56,189,248,0.22)" : "none", transition: "box-shadow 0.2s" }}>
      <span className={"word-en" + (sEn ? " word-active" : "")} onClick={speakEn} style={{ cursor: "pointer", color: sEn ? "#38BDF8" : undefined, transition: "color 0.2s" }}>{en} {sEn ? "🔊" : "🔈"}</span>
      <span className={"word-ur" + (sUr ? " word-active" : "")} onClick={speakUr} style={{ cursor: "pointer", color: sUr ? "#38BDF8" : undefined, transition: "color 0.2s" }}>{sUr ? "🔊" : "🔈"} {ur}</span>
    </div>
  );
}


function OppositeWordRow({ en, ur, opposite, oppositeUr }) {
  const cardStyle = {
    background: "rgba(15,23,42,0.45)",
    border: "1px solid rgba(148,163,184,0.18)",
    borderRadius: 12,
    padding: "10px 12px",
    display: "flex",
    flexDirection: "column",
    gap: 6
  };
  const labelStyle = { fontSize: 11, fontWeight: 800, letterSpacing: 0.5, color: "#94A3B8", textTransform: "uppercase" };
  return (
    <div className="word-row" style={{ cursor: "default", flexDirection: "column", alignItems: "stretch", gap: 10 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10, width: "100%" }}>
        <div style={cardStyle}>
          <span style={labelStyle}>Word</span>
          <SpeakableSentence text={en} lang="en" fullWidth={false} buttonStyle={{ background: "rgba(56,189,248,0.12)", border: "1px solid rgba(56,189,248,0.28)", color: "#E0F2FE", justifyContent: "flex-start" }} />
          <SpeakableSentence text={ur} lang="ur" fullWidth={false} buttonStyle={{ background: "rgba(34,197,94,0.10)", border: "1px solid rgba(34,197,94,0.26)", color: "#DCFCE7", justifyContent: "flex-start" }} textStyle={{ fontFamily: "'Noto Nastaliq Urdu', serif", direction: "rtl", textAlign: "right" }} />
        </div>
        <div style={cardStyle}>
          <span style={labelStyle}>Opposite</span>
          <SpeakableSentence text={opposite} lang="en" fullWidth={false} buttonStyle={{ background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.28)", color: "#FEF3C7", justifyContent: "flex-start" }} />
          <SpeakableSentence text={oppositeUr} lang="ur" fullWidth={false} buttonStyle={{ background: "rgba(168,85,247,0.12)", border: "1px solid rgba(168,85,247,0.30)", color: "#F3E8FF", justifyContent: "flex-start" }} textStyle={{ fontFamily: "'Noto Nastaliq Urdu', serif", direction: "rtl", textAlign: "right" }} />
        </div>
      </div>
    </div>
  );
}

function SentencePairRow({ en, ur }) {
  const cardStyle = {
    background: "rgba(15,23,42,0.45)",
    border: "1px solid rgba(148,163,184,0.18)",
    borderRadius: 12,
    padding: "10px 12px",
    display: "flex",
    flexDirection: "column",
    gap: 8
  };
  const labelStyle = { fontSize: 11, fontWeight: 800, letterSpacing: 0.5, color: "#94A3B8", textTransform: "uppercase" };
  return (
    <div className="word-row" style={{ cursor: "default", flexDirection: "column", alignItems: "stretch", gap: 10 }}>
      <div style={cardStyle}>
        <span style={labelStyle}>English Sentence</span>
        <SpeakableSentence text={en} lang="en" buttonStyle={{ background: "rgba(56,189,248,0.10)", border: "1px solid rgba(56,189,248,0.24)", color: "#E0F2FE", marginBottom: 0 }} />
        <span style={{ ...labelStyle, color: "#22C55E", marginTop: 2 }}>Urdu Translation</span>
        <SpeakableSentence text={ur} lang="ur" buttonStyle={{ background: "rgba(34,197,94,0.10)", border: "1px solid rgba(34,197,94,0.26)", color: "#DCFCE7", marginBottom: 0 }} textStyle={{ fontFamily: "'Noto Nastaliq Urdu', serif", direction: "rtl", textAlign: "right" }} />
      </div>
    </div>
  );
}

function AdjWordRow({ en, ur, comp, sup }) {
  const [sEn, setSEn] = useState(false);
  const [sUr, setSUr] = useState(false);
  const speakEn = (e) => {
    e.stopPropagation(); window.speechSynthesis.cancel(); setSEn(true);
    const txt = en + ". " + comp + ". " + sup + ".";
    const u = new SpeechSynthesisUtterance(ttsClean(txt)); u.lang = "en-US"; u.rate = 0.75;
    const voices = window.speechSynthesis.getVoices();
    const pref = voices.find(v => v.lang.startsWith("en") && v.localService) || voices.find(v => v.lang.startsWith("en"));
    if (pref) u.voice = pref;
    u.onend = () => setSEn(false); u.onerror = () => setSEn(false);
    window.speechSynthesis.speak(u);
  };
  const speakUr = (e) => {
    e.stopPropagation(); window.speechSynthesis.cancel(); setSUr(true);
    const u = new SpeechSynthesisUtterance(ur); u.lang = "ur-PK"; u.rate = 0.8;
    const voices = window.speechSynthesis.getVoices();
    const pref = voices.find(v => v.lang.startsWith("ur")) || voices.find(v => v.lang.startsWith("hi")) || voices.find(v => v.lang.includes("IN"));
    if (pref) { u.voice = pref; u.lang = pref.lang; }
    u.onend = () => setSUr(false); u.onerror = () => setSUr(false);
    window.speechSynthesis.speak(u);
  };
  return (
    <div className="word-row" style={{ cursor: "default", flexDirection: "column", alignItems: "stretch", gap: 6 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span onClick={speakEn} style={{ cursor: "pointer", color: sEn ? "#38BDF8" : "#F1F5F9", fontWeight: 700, fontSize: 15, transition: "color 0.2s" }}>{en} → {comp} → {sup} {sEn ? "🔊" : "🔈"}</span>
        <span onClick={speakUr} style={{ cursor: "pointer", color: sUr ? "#38BDF8" : "var(--text-secondary)", fontFamily: "'Noto Nastaliq Urdu', serif", fontSize: 14, direction: "rtl", transition: "color 0.2s" }}>{sUr ? "🔊" : "🔈"} {ur}</span>
      </div>
    </div>
  );
}

function VerbWordRow({ en, ur, v2, v3 }) {
  const [sEn, setSEn] = useState(false);
  const [sUr, setSUr] = useState(false);
  const speakEn = (e) => {
    e.stopPropagation(); window.speechSynthesis.cancel(); setSEn(true);
    const txt = en + ". " + v2 + ". " + v3 + ".";
    const u = new SpeechSynthesisUtterance(ttsClean(txt)); u.lang = "en-US"; u.rate = 0.75;
    const voices = window.speechSynthesis.getVoices();
    const pref = voices.find(v => v.lang.startsWith("en") && v.localService) || voices.find(v => v.lang.startsWith("en"));
    if (pref) u.voice = pref;
    u.onend = () => setSEn(false); u.onerror = () => setSEn(false);
    window.speechSynthesis.speak(u);
  };
  const speakUr = (e) => {
    e.stopPropagation(); window.speechSynthesis.cancel(); setSUr(true);
    const u = new SpeechSynthesisUtterance(ur); u.lang = "ur-PK"; u.rate = 0.8;
    const voices = window.speechSynthesis.getVoices();
    const pref = voices.find(v => v.lang.startsWith("ur")) || voices.find(v => v.lang.startsWith("hi")) || voices.find(v => v.lang.includes("IN"));
    if (pref) { u.voice = pref; u.lang = pref.lang; }
    u.onend = () => setSUr(false); u.onerror = () => setSUr(false);
    window.speechSynthesis.speak(u);
  };
  return (
    <div className="word-row" style={{ cursor: "default", flexDirection: "column", alignItems: "stretch", gap: 6 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span onClick={speakEn} style={{ cursor: "pointer", color: sEn ? "#38BDF8" : "#F1F5F9", fontWeight: 700, fontSize: 15, transition: "color 0.2s" }}>{en} → {v2} → {v3} {sEn ? "🔊" : "🔈"}</span>
        <span onClick={speakUr} style={{ cursor: "pointer", color: sUr ? "#38BDF8" : "var(--text-secondary)", fontFamily: "'Noto Nastaliq Urdu', serif", fontSize: 14, direction: "rtl", transition: "color 0.2s" }}>{sUr ? "🔊" : "🔈"} {ur}</span>
      </div>
    </div>
  );
}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;500;600;700;800&family=Noto+Nastaliq+Urdu:wght@400;700&display=swap');
:root{--bg-primary:#0F172A;--bg-secondary:#1E293B;--bg-card:#1E293B;--bg-elevated:#334155;--text-primary:#F1F5F9;--text-secondary:#94A3B8;--text-muted:#64748B;--accent:#38BDF8;--accent-glow:rgba(56,189,248,0.25);--success:#22C55E;--warning:#F59E0B;--danger:#EF4444;--border:rgba(148,163,184,0.15);--radius:16px;--radius-sm:10px;--shadow:0 4px 24px rgba(0,0,0,0.3);--font:'Baloo 2',sans-serif;--font-ur:'Noto Nastaliq Urdu',serif}
*{margin:0;padding:0;box-sizing:border-box}
body,#root{font-family:var(--font);background:var(--bg-primary);color:var(--text-primary);min-height:100vh;overflow-x:hidden}
.app-container{max-width:720px;margin:0 auto;min-height:100vh;display:flex;flex-direction:column;background:var(--bg-primary)}
.app-header{padding:16px 20px 12px;display:flex;align-items:center;gap:12px;background:var(--bg-secondary);border-bottom:1px solid var(--border);position:sticky;top:0;z-index:100}
.app-header .back-btn,.app-header .home-btn{width:36px;height:36px;border-radius:10px;border:1px solid var(--border);background:var(--bg-elevated);color:var(--text-primary);font-size:18px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .2s}
.app-header .back-btn:hover,.app-header .home-btn:hover{background:var(--accent);color:#0F172A}
.app-header h1{font-size:18px;font-weight:700;flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.header-badge{display:flex;align-items:center;gap:6px;background:linear-gradient(135deg,#F59E0B22,#F59E0B44);border:1px solid #F59E0B55;padding:4px 12px;border-radius:20px;font-size:13px;font-weight:600;color:#F59E0B}
.bottom-nav{display:flex;background:var(--bg-secondary);border-top:1px solid var(--border);padding:6px 0 max(6px,env(safe-area-inset-bottom));position:sticky;bottom:0;z-index:100}
.nav-item{flex:1;display:flex;flex-direction:column;align-items:center;gap:1px;padding:6px 2px;cursor:pointer;border:none;background:none;color:var(--text-muted);font-family:var(--font);font-size:10px;font-weight:600;transition:all .2s}
.nav-item.active{color:var(--accent)}.nav-item .nav-icon{font-size:20px}.nav-item.active .nav-icon{filter:drop-shadow(0 0 8px var(--accent-glow))}
.content{flex:1;overflow-y:auto;padding:20px;padding-bottom:100px}
.welcome-card{background:linear-gradient(135deg,#1E3A5F,#0F172A);border:1px solid var(--border);border-radius:var(--radius);padding:24px;margin-bottom:24px;position:relative;overflow:hidden}
.welcome-card::before{content:'';position:absolute;top:-40px;right:-40px;width:120px;height:120px;background:radial-gradient(circle,var(--accent-glow),transparent 70%);border-radius:50%}
.welcome-card h2{font-size:22px;font-weight:800;margin-bottom:4px}.welcome-card p{color:var(--text-secondary);font-size:14px}
.welcome-card .grade-tag{display:inline-block;background:var(--accent);color:#0F172A;padding:3px 12px;border-radius:12px;font-size:12px;font-weight:700;margin-top:8px}
.streak-banner{display:flex;align-items:center;gap:12px;background:linear-gradient(135deg,#F59E0B22,#EF444422);border:1px solid #F59E0B44;border-radius:var(--radius-sm);padding:14px 18px;margin-bottom:20px}
.streak-banner .streak-fire{font-size:28px}.streak-banner .streak-info h4{font-size:15px;font-weight:700;color:#F59E0B}.streak-banner .streak-info p{font-size:12px;color:var(--text-secondary)}
.section-title{font-size:16px;font-weight:700;margin-bottom:14px;color:var(--text-secondary);text-transform:uppercase;letter-spacing:1px}
.subject-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:24px}
.subject-card{background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);padding:20px 16px;cursor:pointer;transition:all .25s;text-align:left;font-family:var(--font);color:var(--text-primary)}
.subject-card:hover,.subject-card:active{transform:translateY(-2px);box-shadow:var(--shadow);border-color:var(--accent)}
.subject-card .subj-icon{font-size:32px;margin-bottom:10px;display:block}.subject-card .subj-name{font-size:15px;font-weight:700;display:block}
.subject-card .subj-name-ur{font-family:var(--font-ur);font-size:13px;color:var(--text-secondary);display:block;margin-top:2px}
.subject-card .subj-progress{margin-top:10px;height:4px;background:var(--bg-elevated);border-radius:2px;overflow:hidden}
.subject-card .subj-progress-fill{height:100%;border-radius:2px;transition:width .5s ease}
.lesson-list{display:flex;flex-direction:column;gap:12px}
.lesson-card{background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);padding:18px;cursor:pointer;transition:all .2s;text-align:left;font-family:var(--font);color:var(--text-primary)}
.lesson-card:hover{border-color:var(--accent);transform:translateY(-1px)}
.lesson-card .lesson-num{font-size:11px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px}
.lesson-card h3{font-size:16px;font-weight:700;margin:4px 0}.lesson-card p{font-size:13px;color:var(--text-secondary);line-height:1.5}
.lesson-card .lesson-status{margin-top:10px;display:flex;align-items:center;gap:6px;font-size:12px;font-weight:600}
.lesson-detail{background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);padding:24px;margin-bottom:20px}
.lesson-detail h2{font-size:20px;font-weight:800;margin-bottom:12px}.lesson-detail p{font-size:14px;color:var(--text-secondary);line-height:1.7}
.lesson-detail .start-quiz-btn{margin-top:20px;width:100%;padding:14px;border:none;border-radius:var(--radius-sm);background:linear-gradient(135deg,var(--accent),#0EA5E9);color:#0F172A;font-family:var(--font);font-size:16px;font-weight:700;cursor:pointer;transition:all .2s}
.quiz-container{animation:fadeSlide .3s ease}@keyframes fadeSlide{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
.quiz-progress{display:flex;gap:4px;margin-bottom:20px}.quiz-progress .qp-dot{flex:1;height:4px;background:var(--bg-elevated);border-radius:2px;transition:background .3s}.quiz-progress .qp-dot.done{background:var(--success)}.quiz-progress .qp-dot.current{background:var(--accent)}
.quiz-question{background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);padding:24px;margin-bottom:16px}
.quiz-question .q-num{font-size:12px;font-weight:700;color:var(--accent);text-transform:uppercase;letter-spacing:1px;margin-bottom:8px}
.quiz-question h3{font-size:18px;font-weight:700;line-height:1.4}
.quiz-options{display:flex;flex-direction:column;gap:10px}
.quiz-option{padding:14px 18px;border:2px solid var(--border);border-radius:var(--radius-sm);background:var(--bg-card);color:var(--text-primary);font-family:var(--font);font-size:15px;font-weight:600;cursor:pointer;transition:all .2s;text-align:left;display:flex;align-items:center;gap:12px}
.quiz-option:hover{border-color:var(--accent);background:rgba(56,189,248,0.08)}.quiz-option.selected{border-color:var(--accent);background:rgba(56,189,248,0.15)}
.quiz-option.correct{border-color:var(--success);background:rgba(34,197,94,0.15);color:var(--success)}.quiz-option.wrong{border-color:var(--danger);background:rgba(239,68,68,0.15);color:var(--danger)}
.quiz-option .opt-letter{width:28px;height:28px;border-radius:8px;background:var(--bg-elevated);display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;flex-shrink:0}
.quiz-result{background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);padding:32px 24px;text-align:center}
.quiz-result .result-emoji{font-size:64px;margin-bottom:16px}.quiz-result h2{font-size:24px;font-weight:800;margin-bottom:8px}
.quiz-result .score-text{font-size:16px;color:var(--text-secondary);margin-bottom:4px}
.quiz-result .score-big{font-size:48px;font-weight:800;margin:12px 0}.quiz-result .score-big.high{color:var(--success)}.quiz-result .score-big.mid{color:var(--warning)}.quiz-result .score-big.low{color:var(--danger)}
.quiz-result .badge-earned{background:linear-gradient(135deg,#F59E0B22,#F59E0B44);border:1px solid #F59E0B55;border-radius:var(--radius-sm);padding:14px;margin:16px 0;display:flex;align-items:center;gap:12px;animation:pop .4s ease}
@keyframes pop{0%{transform:scale(0.8);opacity:0}60%{transform:scale(1.05)}100%{transform:scale(1);opacity:1}}
.badge-earned .badge-icon{font-size:32px}.badge-earned .badge-info h4{font-size:14px;font-weight:700;color:#F59E0B}.badge-earned .badge-info p{font-size:12px;color:var(--text-secondary)}
.result-actions{display:flex;gap:10px;margin-top:20px}.result-actions button{flex:1;padding:12px;border-radius:var(--radius-sm);font-family:var(--font);font-size:14px;font-weight:700;cursor:pointer;transition:all .2s;border:none}
.result-actions .retry-btn{background:var(--bg-elevated);color:var(--text-primary);border:1px solid var(--border)}.result-actions .next-btn{background:linear-gradient(135deg,var(--accent),#0EA5E9);color:#0F172A}
.stat-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:24px}
.stat-card{background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);padding:18px;text-align:center}
.stat-card .stat-icon{font-size:24px;margin-bottom:6px}.stat-card .stat-value{font-size:24px;font-weight:800}.stat-card .stat-label{font-size:12px;color:var(--text-secondary);font-weight:600}
.progress-bar-container{margin-bottom:12px}.progress-bar-label{display:flex;justify-content:space-between;margin-bottom:6px;font-size:13px;font-weight:600}
.progress-bar-track{height:8px;background:var(--bg-elevated);border-radius:4px;overflow:hidden}.progress-bar-fill{height:100%;border-radius:4px;transition:width .6s ease}
.badge-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.badge-card{background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);padding:18px;text-align:center;transition:all .2s}
.badge-card.earned{border-color:#F59E0B55;background:linear-gradient(135deg,#F59E0B08,#F59E0B15)}.badge-card.locked{opacity:0.4;filter:grayscale(1)}
.badge-card .badge-big-icon{font-size:36px;margin-bottom:8px}.badge-card h4{font-size:13px;font-weight:700}.badge-card p{font-size:11px;color:var(--text-secondary);margin-top:2px}
.tutor-chat{display:flex;flex-direction:column;gap:12px;margin-bottom:16px}
.chat-bubble{max-width:85%;padding:14px 18px;border-radius:16px;font-size:14px;line-height:1.6;animation:fadeSlide .3s ease}
.chat-bubble.ai{align-self:flex-start;background:var(--bg-card);border:1px solid var(--border);border-bottom-left-radius:4px}
.chat-bubble.user{align-self:flex-end;background:linear-gradient(135deg,var(--accent),#0EA5E9);color:#0F172A;border-bottom-right-radius:4px;font-weight:600}
.chat-input-area{display:flex;gap:10px;position:sticky;bottom:80px;background:var(--bg-primary);padding:12px 0}
.chat-input-area input{flex:1;padding:14px 18px;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--bg-card);color:var(--text-primary);font-family:var(--font);font-size:14px;outline:none}
.chat-input-area input:focus{border-color:var(--accent)}
.chat-input-area button{width:48px;height:48px;border-radius:var(--radius-sm);border:none;background:linear-gradient(135deg,var(--accent),#0EA5E9);color:#0F172A;font-size:20px;cursor:pointer;display:flex;align-items:center;justify-content:center}
.grade-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:10px;margin-bottom:20px}
.grade-btn{padding:14px 8px;border-radius:var(--radius-sm);border:2px solid var(--border);background:var(--bg-card);color:var(--text-primary);font-family:var(--font);font-size:16px;font-weight:700;cursor:pointer;transition:all .2s}
.grade-btn:hover,.grade-btn.active{border-color:var(--accent);background:rgba(56,189,248,0.12);color:var(--accent)}
.settings-item{background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);padding:16px 18px;margin-bottom:10px;display:flex;align-items:center;justify-content:space-between}
.settings-item .si-label{font-size:14px;font-weight:600}.settings-item .si-value{font-size:14px;color:var(--accent);font-weight:700}
.reset-btn{width:100%;padding:14px;border-radius:var(--radius-sm);border:2px solid var(--danger);background:transparent;color:var(--danger);font-family:var(--font);font-size:14px;font-weight:700;cursor:pointer;margin-top:20px;transition:all .2s}.reset-btn:hover{background:rgba(239,68,68,0.12)}
.urdu-text{font-family:var(--font-ur);direction:rtl}
.typing-dots{display:flex;gap:4px;padding:4px 0}.typing-dots span{width:8px;height:8px;background:var(--text-muted);border-radius:50%;animation:bounce 1.4s infinite ease-in-out both}
.typing-dots span:nth-child(1){animation-delay:-0.32s}.typing-dots span:nth-child(2){animation-delay:-0.16s}
@keyframes bounce{0%,80%,100%{transform:scale(0)}40%{transform:scale(1)}}
.adverb-day-card{background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);padding:18px;margin-bottom:12px;cursor:pointer;transition:all .2s;text-align:left;font-family:var(--font);color:var(--text-primary)}
.adverb-day-card:hover{border-color:var(--accent);transform:translateY(-1px)}
.adverb-day-card .day-num{font-size:11px;font-weight:700;color:var(--accent);text-transform:uppercase;letter-spacing:1px}
.adverb-day-card h3{font-size:15px;font-weight:700;margin:4px 0 8px}
.adverb-day-card .word-preview{display:flex;flex-wrap:wrap;gap:6px}
.adverb-day-card .word-chip{background:var(--bg-elevated);padding:3px 10px;border-radius:12px;font-size:12px;font-weight:600;color:var(--text-secondary);font-family:var(--font-ur)}
.adverb-detail-section{background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);padding:20px;margin-bottom:16px}
.adverb-detail-section h3{font-size:14px;font-weight:700;color:var(--accent);text-transform:uppercase;letter-spacing:1px;margin-bottom:14px}
.word-row{display:flex;align-items:center;justify-content:space-between;padding:10px 14px;margin-bottom:8px;border-radius:var(--radius-sm);border:1px solid var(--border);background:rgba(30,41,59,0.6);cursor:pointer;transition:all .2s}
.word-row:hover,.word-row:active{border-color:var(--accent);background:rgba(56,189,248,0.08)}
.word-row .word-en{font-size:16px;font-weight:700}.word-row .word-ur{font-family:var(--font-ur);font-size:16px;font-weight:700;color:var(--text-secondary);direction:rtl}
.word-row .word-speaker{font-size:18px;opacity:0.5;transition:opacity .2s}.word-row:hover .word-speaker{opacity:1}
.word-row.speaking{border-color:var(--accent);background:rgba(56,189,248,0.12)}.word-row.speaking .word-speaker{opacity:1}
.tts-hint{display:flex;align-items:center;gap:8px;background:linear-gradient(135deg,rgba(56,189,248,0.1),rgba(56,189,248,0.05));border:1px solid rgba(56,189,248,0.2);border-radius:var(--radius-sm);padding:10px 14px;margin-bottom:16px;font-size:12px;color:var(--accent);font-weight:600}
.play-all-btn{width:100%;padding:12px;border:none;border-radius:var(--radius-sm);background:linear-gradient(135deg,#22C55E,#16A34A);color:white;font-family:var(--font);font-size:14px;font-weight:700;cursor:pointer;transition:all .2s;margin-top:12px}.play-all-btn:hover{filter:brightness(1.1)}
.adverb-home-banner{background:linear-gradient(135deg,#7C3AED22,#7C3AED44);border:1px solid #7C3AED55;border-radius:var(--radius);padding:18px;margin-bottom:24px;cursor:pointer;transition:all .2s;display:flex;align-items:center;gap:14px}
.adverb-home-banner:hover{border-color:#7C3AED;transform:translateY(-1px)}
.adverb-home-banner .banner-icon{font-size:36px}.adverb-home-banner .banner-text h3{font-size:16px;font-weight:700;color:#C4B5FD}.adverb-home-banner .banner-text p{font-size:12px;color:var(--text-secondary);margin-top:2px}
@media(min-width:600px){
  .app-container{max-width:900px}
  .content{padding:24px 32px;padding-bottom:100px}
  .subject-grid{grid-template-columns:repeat(3,1fr) !important}
  .lesson-list{display:grid;grid-template-columns:repeat(2,1fr);gap:12px}
  .grade-grid{grid-template-columns:repeat(5,1fr) !important}
  .quiz-container{max-width:600px;margin:0 auto}
  .quiz-options{display:grid;grid-template-columns:repeat(2,1fr);gap:8px}
  .welcome-card{padding:32px}
  .word-row{padding:14px 18px}
  .adverb-day-card{padding:16px 20px}
  .settings-item{padding:16px 20px}
}
@media(orientation:landscape){
  .app-header{padding:10px 20px 8px}
  .app-header h1{font-size:16px}
  .bottom-nav{padding:4px 0 max(4px,env(safe-area-inset-bottom))}
  .nav-item{padding:4px 2px;font-size:9px}
  .nav-item .nav-icon{font-size:18px}
  .content{padding:14px 20px;padding-bottom:80px}
  .welcome-card{padding:16px;margin-bottom:16px}
  .welcome-card h2{font-size:18px}
  .section-title{font-size:14px;margin-bottom:10px}
  .subject-grid{grid-template-columns:repeat(3,1fr) !important;gap:8px !important}
  .lesson-list{display:grid;grid-template-columns:repeat(2,1fr);gap:8px}
}
@media(orientation:landscape) and (min-width:700px){
  .app-container{max-width:1100px}
  .subject-grid{grid-template-columns:repeat(5,1fr) !important}
  .lesson-list{grid-template-columns:repeat(3,1fr)}
  .quiz-options{grid-template-columns:repeat(2,1fr)}
  .content{padding:16px 40px;padding-bottom:80px}
}
.math-svg{width:100%;max-width:100%;border-radius:12px;margin:12px auto;overflow:hidden;display:flex;justify-content:center}
.math-svg svg{width:100%;height:auto;display:block;max-width:720px}
.math-visual-stack{display:flex;flex-direction:column;gap:16px;margin-top:12px}
.math-visual-panel{padding:14px;border-radius:18px;background:rgba(15,23,42,0.58);border:1px solid rgba(148,163,184,0.18);box-shadow:0 14px 30px rgba(2,6,23,0.22)}
.math-visual-label{font-family:'Baloo 2',sans-serif;font-size:13px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:#F59E0B;margin-bottom:4px}
`;

export default function HomeschoolApp() {
  const stored = loadState();
  const [grade, setGrade] = useState(stored?.grade || null);
  const [studentName, setStudentName] = useState(stored?.studentName || "");
  const [tab, setTab] = useState("home");
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [quizActive, setQuizActive] = useState(false);
  const [quizIdx, setQuizIdx] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState([]);
  const [quizRevealed, setQuizRevealed] = useState(false);
  const [quizDone, setQuizDone] = useState(false);
  const [quizStartTime, setQuizStartTime] = useState(null);
  const [selectedAdverbDay, setSelectedAdverbDay] = useState(null);
  const [selectedPrepDay, setSelectedPrepDay] = useState(null);
  const [selectedAdjDay, setSelectedAdjDay] = useState(null);
  const [selectedConjDay, setSelectedConjDay] = useState(null);
  const [selectedPronDay, setSelectedPronDay] = useState(null);
  const [selectedNounDay, setSelectedNounDay] = useState(null);
  const [selectedVerbDay, setSelectedVerbDay] = useState(null);
  const [posTab, setPosTab] = useState("adverbs");
  const [tenseMain, setTenseMain] = useState("present");
  const [tenseSub, setTenseSub] = useState("simple");
  const [selectedTensePara, setSelectedTensePara] = useState(null);
  const [selectedVocabDay, setSelectedVocabDay] = useState(null);
  const [mathSubIdx, setMathSubIdx] = useState(null);
  const [mathSubTab, setMathSubTab] = useState("examples");
  const [subExerciseGroupIdx, setSubExerciseGroupIdx] = useState(null);
  const [subQuizGroupIdx, setSubQuizGroupIdx] = useState(null);
  const [revealedEx, setRevealedEx] = useState({});
  const [completedQuizzes, setCompletedQuizzes] = useState(stored?.completedQuizzes || {});
  const [totalScore, setTotalScore] = useState(stored?.totalScore || 0);
  const [totalQuizzesDone, setTotalQuizzesDone] = useState(stored?.totalQuizzesDone || 0);
  const [streak, setStreak] = useState(stored?.streak || 0);
  const [lastQuizDate, setLastQuizDate] = useState(stored?.lastQuizDate || null);
  const [earnedBadges, setEarnedBadges] = useState(stored?.earnedBadges || []);
  const [xp, setXp] = useState(stored?.xp || 0);
  const [newBadges, setNewBadges] = useState([]);
  const [chatMessages, setChatMessages] = useState([{ role: "ai", text: "Assalam-o-Alaikum! 👋 I'm your AI tutor. Ask me anything about your lessons — I'll explain it in a way that's easy to understand!" }]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef(null);

  // ─── DB-backed data state ───
  const [dbLoaded, setDbLoaded] = useState(false);
  const [dbPos, setDbPos] = useState({});
  const [dbTenses, setDbTenses] = useState({});
  const [dbVocab, setDbVocab] = useState([]);

  // Load from IndexedDB on mount
  useEffect(() => {
    if (!window.HomeSchoolDB) { setDbLoaded(true); return; }
    (async () => {
      try {
        const pos = await window.HomeSchoolDB.getAllPosTypes();
        if (Object.keys(pos).length > 0) setDbPos(pos);
        const tens = await window.HomeSchoolDB.getAllTenses();
        if (Object.keys(tens).length > 0) setDbTenses(tens);
        const voc = await window.HomeSchoolDB.getVocab();
        if (voc.length > 0) setDbVocab(voc);
      } catch(e) { console.log("DB load fallback to inline:", e); }
      setDbLoaded(true);
    })();
  }, []);

  // Resolve data: use DB if available, fallback to inline constants
  const POS = {
    adverbs: dbPos.adverbs || ADVERBS_DATA,
    prepositions: dbPos.prepositions || PREPOSITIONS_DATA,
    adjectives: dbPos.adjectives || ADJECTIVES_DATA,
    conjunctions: dbPos.conjunctions || CONJUNCTIONS_DATA,
    pronouns: dbPos.pronouns || PRONOUNS_DATA,
    collectiveNouns: dbPos.collectiveNouns || COLLECTIVE_NOUNS_DATA,
    verbs: dbPos.verbs || VERBS_DATA,
  };
  const TENSES = (dbTenses && Object.keys(dbTenses).length > 0) ? dbTenses : TENSES_DATA;
  const VOCAB = dbVocab.length > 0 ? dbVocab : VOCABULARY_DATA;

  useEffect(() => { window.speechSynthesis.getVoices(); window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices(); return () => window.speechSynthesis.cancel(); }, []);
  useEffect(() => { if (grade) saveState({ grade, studentName, completedQuizzes, totalScore, totalQuizzesDone, streak, lastQuizDate, earnedBadges, xp }); }, [grade, studentName, completedQuizzes, totalScore, totalQuizzesDone, streak, lastQuizDate, earnedBadges, xp]);
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chatMessages]);

  const checkBadges = useCallback((qs, qt, si) => {
    const nb = [], all = [...earnedBadges];
    const ck = id => { if (!all.includes(id)) { all.push(id); nb.push(id); } };
    if (totalQuizzesDone === 0) ck("first_quiz"); if (qs === 4) ck("perfect");
    if (totalQuizzesDone + 1 >= 5) ck("five_quizzes"); if (totalQuizzesDone + 1 >= 10) ck("ten_quizzes");
    if (qt < 30) ck("speed_demon"); if (streak + 1 >= 3) ck("streak_3"); if (streak + 1 >= 7) ck("streak_7");
    const ds = new Set(Object.keys(completedQuizzes).map(k => k.split("_")[0])); ds.add(si);
    if (ds.size >= 5) ck("all_subjects"); if (nb.length > 0) { setEarnedBadges(all); setNewBadges(nb); }
  }, [earnedBadges, totalQuizzesDone, streak, completedQuizzes]);

  const finishQuiz = (ans, qs) => {
    const sc = ans.reduce((a, v, i) => a + (v === qs[i].c ? 1 : 0), 0);
    const el = (Date.now() - quizStartTime) / 1000, today = new Date().toDateString();
    const ns = lastQuizDate === new Date(Date.now() - 86400000).toDateString() ? streak + 1 : lastQuizDate === today ? streak : 1;
    setTotalScore(s => s + sc); setTotalQuizzesDone(n => n + 1); setStreak(ns); setLastQuizDate(today);
    setXp(x => x + sc * 25 + (sc === 4 ? 50 : 0));
    setCompletedQuizzes(p => ({ ...p, [selectedLesson.id]: { score: sc, total: 4, date: today } }));
    checkBadges(sc, el, selectedSubject.id); setQuizDone(true);
  };

  const sendChat = async () => {
    if (!chatInput.trim()) return;
    const msg = chatInput.trim(); setChatInput(""); setChatMessages(m => [...m, { role: "user", text: msg }]); setChatLoading(true);
    try {
      const r = await fetch("https://api.anthropic.com/v1/messages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000, system: "You are a friendly AI tutor named Ustaad for a Grade " + grade + " student in Pakistan. Explain simply, use Pakistani examples, respond in English or Urdu. Keep responses concise (2-4 paragraphs). Use emojis occasionally.", messages: [...chatMessages.filter((m, i) => i > 0 || m.role !== "ai").map(m => ({ role: m.role === "ai" ? "assistant" : "user", content: m.text })), { role: "user", content: msg }] }) });
      const d = await r.json();
      setChatMessages(m => [...m, { role: "ai", text: d.content?.map(c => c.text || "").join("") || "Sorry, please try again!" }]);
    } catch { setChatMessages(m => [...m, { role: "ai", text: "Oops! Connection issue. Please try again. 🙏" }]); }
    setChatLoading(false);
  };

  // Show loading while DB initializes
  if (!dbLoaded) return (<><style>{CSS}</style><div className="app-container"><div className="content" style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}><div style={{ fontSize: 56, marginBottom: 16 }}>📚</div><h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Loading HomeSchool...</h2><p style={{ color: "var(--text-secondary)", fontSize: 13 }}>Setting up your learning database</p><div style={{ width: 200, height: 4, background: "var(--bg-elevated)", borderRadius: 4, marginTop: 16, overflow: "hidden" }}><div style={{ width: "60%", height: "100%", background: "var(--accent)", borderRadius: 4, animation: "pulse 1s infinite" }} /></div></div></div></>);

  if (!grade) return (<><style>{CSS}</style><div className="app-container"><div className="content" style={{ display: "flex", flexDirection: "column", justifyContent: "center", minHeight: "100vh", padding: "32px 24px" }}><div style={{ textAlign: "center", marginBottom: 32 }}><div style={{ fontSize: 56, marginBottom: 12 }}>📚</div><h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>HomeSchool</h1><p style={{ color: "var(--text-secondary)", fontSize: 14 }}>Your personal learning companion</p><p style={{ fontFamily: "var(--font-ur)", color: "var(--text-muted)", fontSize: 14, marginTop: 4 }}>آپ کا ذاتی تعلیمی ساتھی</p></div><div style={{ marginBottom: 20 }}><label style={{ fontSize: 13, fontWeight: 700, color: "var(--text-secondary)", marginBottom: 8, display: "block" }}>YOUR NAME</label><input value={studentName} onChange={e => setStudentName(e.target.value)} placeholder="Enter your name..." style={{ width: "100%", padding: "14px 18px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", background: "var(--bg-card)", color: "var(--text-primary)", fontFamily: "var(--font)", fontSize: 15, outline: "none" }} /></div><label style={{ fontSize: 13, fontWeight: 700, color: "var(--text-secondary)", marginBottom: 10, display: "block" }}>SELECT YOUR GRADE</label><div className="grade-grid">{GRADES.map(g => <button key={g.id} className="grade-btn" onClick={() => setGrade(g.id)}>{g.id}</button>)}</div></div></div></>);

  const goHome = () => {
    window.speechSynthesis.cancel();
    setTab("home");
    setSelectedSubject(null);
    setSelectedLesson(null);
    setQuizActive(false);
    setQuizDone(false);
    setQuizAnswers([]);
    setQuizIdx(0);
    setQuizRevealed(false);
    setSelectedAdverbDay(null);
    setSelectedPrepDay(null);
    setSelectedAdjDay(null);
    setSelectedConjDay(null);
    setSelectedPronDay(null);
    setSelectedNounDay(null);
    setSelectedVerbDay(null);
    setSelectedTensePara(null);
    setSelectedVocabDay(null);
    setMathSubIdx(null);
    setMathSubTab("examples");
    setSubExerciseGroupIdx(null);
    setSubQuizGroupIdx(null);
    setRevealedEx({});
    setPosTab("adverbs");
    setTenseMain("present");
    setTenseSub("simple");
    setNewBadges([]);
  };
  const goBack = () => { window.speechSynthesis.cancel(); if (quizDone || quizActive) { setQuizActive(false); setQuizDone(false); setQuizAnswers([]); setQuizIdx(0); setNewBadges([]); } else if (selectedAdverbDay) { setSelectedAdverbDay(null); } else if (selectedPrepDay) { setSelectedPrepDay(null); } else if (selectedAdjDay) { setSelectedAdjDay(null); } else if (selectedConjDay) { setSelectedConjDay(null); } else if (selectedPronDay) { setSelectedPronDay(null); } else if (selectedNounDay) { setSelectedNounDay(null); } else if (selectedVerbDay) { setSelectedVerbDay(null); } else if (selectedTensePara) { setSelectedTensePara(null); } else if (selectedVocabDay) { setSelectedVocabDay(null); } else if (subQuizGroupIdx !== null) { setSubQuizGroupIdx(null); } else if (subExerciseGroupIdx !== null) { setSubExerciseGroupIdx(null); } else if (mathSubIdx !== null) { setMathSubIdx(null); setMathSubTab("examples"); setSubExerciseGroupIdx(null); setSubQuizGroupIdx(null); setRevealedEx({}); } else if (selectedLesson) { setSelectedLesson(null); setPosTab("adverbs"); setTenseMain("present"); setTenseSub("simple"); } else if (selectedSubject) setSelectedSubject(null); else setTab("home"); };
  const selDay = selectedAdverbDay || selectedPrepDay || selectedAdjDay || selectedConjDay || selectedPronDay || selectedNounDay || selectedVerbDay || selectedTensePara || selectedVocabDay || (mathSubIdx !== null);
  const headerTitle = quizActive || quizDone ? (selectedSubject?.id==="urdu"?"امتحان":"Quiz") : selectedAdverbDay ? "Day " + selectedAdverbDay.day + " — Adverbs" : selectedPrepDay ? "Day " + selectedPrepDay.day + " — Prepositions" : selectedAdjDay ? "Day " + selectedAdjDay.day + " — Adjectives" : selectedConjDay ? "Day " + selectedConjDay.day + " — Conjunctions" : selectedPronDay ? "Day " + selectedPronDay.day + " — Pronouns" : selectedNounDay ? "Day " + selectedNounDay.day + " — Nouns" : selectedVerbDay ? "Day " + selectedVerbDay.day + " — Verbs" : selectedTensePara ? selectedTensePara.title : selectedVocabDay ? "Day " + selectedVocabDay.day + " — Vocabulary" : selectedLesson ? selectedLesson.title : selectedSubject ? (selectedSubject.id==="urdu"?selectedSubject.nameUr:selectedSubject.name) : tab === "home" ? "HomeSchool" : tab === "progress" ? "Progress" : tab === "badges" ? "Achievements" : tab === "tutor" ? "AI Tutor" : "Settings";
  const showBack = selectedSubject || selectedLesson || quizActive || quizDone || selDay || tab !== "home";
  const currentQuiz = selectedLesson ? getQuiz(selectedSubject?.id, grade, selectedLesson.key) : [];
  const quizScore = quizDone ? quizAnswers.reduce((a, v, i) => a + (v === currentQuiz[i]?.c ? 1 : 0), 0) : 0;

  const playAll = (p) => { window.speechSynthesis.cancel(); const ss = p.split(/(?<=[.!?])\s+/).filter(Boolean); let i = 0; const next = () => { if (i < ss.length) { const u = new SpeechSynthesisUtterance(ttsClean(ss[i])); u.lang = "en-US"; u.rate = 0.85; u.pitch = 1.05; const v = window.speechSynthesis.getVoices(); const pr = v.find(x => x.lang.startsWith("en") && x.localService) || v.find(x => x.lang.startsWith("en")); if (pr) u.voice = pr; u.onend = () => { i++; next(); }; window.speechSynthesis.speak(u); } }; next(); };

  return (<><style>{CSS}</style><div className="app-container">
    <div className="app-header" style={selectedSubject?.id==="urdu"?{direction:"rtl"}:{}}>{showBack && <button className="back-btn" onClick={goBack}>←</button>}<button className="home-btn" onClick={goHome} title="Home">🏠</button><h1 style={selectedSubject?.id==="urdu"?{fontFamily:"'Noto Nastaliq Urdu',serif",textAlign:"right"}:{}}>{headerTitle}</h1><div className="header-badge"><span>⭐</span><span>{xp} XP</span></div></div>
    <div className="content">
      {tab === "home" && !selectedSubject && !selectedLesson && !quizActive && !selectedAdverbDay && (<>
        <div className="welcome-card"><h2>{studentName ? "Hi, " + studentName + "!" : "Welcome!"} 👋</h2><p>Ready to learn something amazing today?</p><span className="grade-tag">Grade {grade}</span></div>
        {streak > 0 && <div className="streak-banner"><span className="streak-fire">🔥</span><div className="streak-info"><h4>{streak} Day Streak!</h4><p>Keep going — you're doing great!</p></div></div>}
        <h3 className="section-title">Subjects</h3>
        <div className="subject-grid">{SUBJECTS.map(subj => { const ls = getLessons(subj.id, grade), done = ls.filter(l => completedQuizzes[l.id]).length, pct = ls.length > 0 ? (done / ls.length) * 100 : 0; return (<button key={subj.id} className="subject-card" onClick={() => setSelectedSubject(subj)}><span className="subj-icon">{subj.icon}</span><span className="subj-name">{subj.name}</span><span className="subj-name-ur">{subj.nameUr}</span><div className="subj-progress"><div className="subj-progress-fill" style={{ width: pct + "%", background: subj.color }} /></div></button>); })}</div>
      </>)}


      {tab === "home" && selectedSubject && !selectedLesson && !quizActive && (<>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20, direction: selectedSubject?.id==="urdu"?"rtl":"ltr" }}><span style={{ fontSize: 36 }}>{selectedSubject.icon}</span><div><h2 style={{ fontSize: 20, fontWeight: 800, fontFamily: selectedSubject?.id==="urdu"?"'Noto Nastaliq Urdu',serif":"inherit" }}>{selectedSubject?.id==="urdu"?selectedSubject.nameUr:selectedSubject.name}</h2><p style={{ fontSize: 13, color: "var(--text-secondary)", fontFamily: selectedSubject?.id==="urdu"?"'Noto Nastaliq Urdu',serif":"inherit" }}>{selectedSubject?.id==="urdu"?("جماعت "+grade+" • "+getLessons(selectedSubject.id, grade).length+" اسباق"):("Grade "+grade+" • "+getLessons(selectedSubject.id, grade).length+" lessons")}</p></div></div>
        <div className="lesson-list" style={selectedSubject?.id==="urdu"?{direction:"rtl"}:{}}>{getLessons(selectedSubject.id, grade).map((l, i) => { const d = completedQuizzes[l.id]; const isUr = selectedSubject?.id==="urdu"; return (<button key={l.id} className="lesson-card" onClick={() => setSelectedLesson(l)} style={isUr?{direction:"rtl",textAlign:"right",fontFamily:"'Noto Nastaliq Urdu',serif"}:{}}><span className="lesson-num">{isUr?("سبق نمبر "+(i+1)):("Lesson "+(i+1))}</span><h3>{l.title}</h3><p style={isUr?{fontFamily:"'Noto Nastaliq Urdu',serif"}:{}}>{l.content.substring(0, 80)}...</p><div className="lesson-status" style={{ color: d ? "var(--success)" : "var(--text-muted)" }}>{d ? "✅" : "○"} {d ? (isUr?"مکمل — "+d.score+"/4":"Completed — "+d.score+"/4") : (isUr?"شروع نہیں ہوا":"Not started")}</div></button>); })}</div>
      </>)}

      {tab === "home" && selectedLesson && !quizActive && !quizDone && selectedLesson.hasAdverbs && !selDay && (<>
        <div className="lesson-detail"><h2>{selectedLesson.title}</h2><p>{selectedLesson.content}</p>
          <button className="start-quiz-btn" onClick={() => { setQuizActive(true); setQuizIdx(0); setQuizAnswers([]); setQuizRevealed(false); setQuizDone(false); setQuizStartTime(Date.now()); setNewBadges([]); }}>🎯 Start Quiz</button>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8, marginBottom: 14 }}>
          {[{id:"adverbs",label:"📖 Adverbs",c:"#38BDF8"},{id:"prepositions",label:"📍 Prepositions",c:"#22C55E"},{id:"adjectives",label:"🏷️ Adjectives",c:"#F59E0B"},{id:"conjunctions",label:"🔗 Conjunctions",c:"#A855F7"},{id:"pronouns",label:"👤 Pronouns",c:"#EC4899"},{id:"nouns",label:"📦 Col. Nouns",c:"#14B8A6"},{id:"verbs",label:"✏️ Verbs",c:"#F97316"}].map(t => (
            <button key={t.id} onClick={() => setPosTab(t.id)} style={{ flex: "1 1 30%", padding: "8px 4px", borderRadius: 10, border: posTab === t.id ? "2px solid "+t.c : "1px solid rgba(148,163,184,0.15)", background: posTab === t.id ? t.c+"22" : "rgba(30,41,59,0.6)", color: posTab === t.id ? t.c : "#94A3B8", fontFamily: "'Baloo 2', sans-serif", fontSize: 11, fontWeight: 700, cursor: "pointer", transition: "all 0.2s" }}>{t.label}</button>
          ))}
        </div>

        <div className="tts-hint">🔊 Tap English → English voice | Tap Urdu → Urdu voice</div>

        {posTab === "adverbs" && POS.adverbs.map(day => (<div key={day.day} className="adverb-day-card" onClick={() => setSelectedAdverbDay(day)}><span className="day-num">Day {day.day}</span><h3>{day.words.map(w => w.en).join(" • ")}</h3><div className="word-preview">{day.words.map((w, i) => <span key={i} className="word-chip">{w.ur}</span>)}</div></div>))}

        {posTab === "prepositions" && POS.prepositions.map(day => (<div key={day.day} className="adverb-day-card" onClick={() => setSelectedPrepDay(day)}><span className="day-num">Day {day.day}</span><h3>{day.words.map(w => w.en).join(" • ")}</h3><div className="word-preview">{day.words.map((w, i) => <span key={i} className="word-chip">{w.ur}</span>)}</div></div>))}

        {posTab === "adjectives" && POS.adjectives.map(day => (<div key={day.day} className="adverb-day-card" onClick={() => setSelectedAdjDay(day)}><span className="day-num">Day {day.day}</span><h3>{day.words.map(w => w.en).join(" • ")}</h3><div className="word-preview">{day.words.map((w, i) => <span key={i} className="word-chip">{w.ur}</span>)}</div></div>))}

        {posTab === "conjunctions" && POS.conjunctions.map(day => (<div key={day.day} className="adverb-day-card" onClick={() => setSelectedConjDay(day)}><span className="day-num">Day {day.day}</span><h3>{day.words.map(w => w.en).join(" • ")}</h3><div className="word-preview">{day.words.map((w, i) => <span key={i} className="word-chip">{w.ur}</span>)}</div></div>))}

        {posTab === "pronouns" && POS.pronouns.map(day => (<div key={day.day} className="adverb-day-card" onClick={() => setSelectedPronDay(day)}><span className="day-num">Day {day.day}</span><h3>{day.words.map(w => w.en).join(" • ")}</h3><div className="word-preview">{day.words.map((w, i) => <span key={i} className="word-chip">{w.ur}</span>)}</div></div>))}

        {posTab === "nouns" && POS.collectiveNouns.map(day => (<div key={day.day} className="adverb-day-card" onClick={() => setSelectedNounDay(day)}><span className="day-num">Day {day.day}</span><h3>{day.words.map(w => w.en).join(" • ")}</h3><div className="word-preview">{day.words.map((w, i) => <span key={i} className="word-chip">{w.ur}</span>)}</div></div>))}

        {posTab === "verbs" && POS.verbs.map(day => (<div key={day.day} className="adverb-day-card" onClick={() => setSelectedVerbDay(day)}><span className="day-num">Day {day.day}</span><h3>{day.words.map(w => w.en).join(" • ")}</h3><div className="word-preview">{day.words.map((w, i) => <span key={i} className="word-chip">{w.ur}</span>)}</div></div>))}
      </>)}

      {tab === "home" && selectedLesson && !quizActive && !quizDone && selectedLesson.hasAdverbs && selectedAdverbDay && (<>
        <div className="tts-hint">🔊 Tap English word → English voice | Tap Urdu word → Urdu voice | Tap sentence → hear it read!</div>
        <div className="adverb-detail-section"><h3>📝 Day {selectedAdverbDay.day} — Vocabulary</h3>{selectedAdverbDay.words.map((w, i) => <WordRow key={i} en={w.en} ur={w.ur} />)}</div>
        <div className="adverb-detail-section"><h3>📖 Practice Paragraph</h3>
          {selectedAdverbDay.paragraph.split(/(?<=[.!?])\s+/).filter(Boolean).map((s, i) => { const aw = selectedAdverbDay.words.find(w => s.toLowerCase().includes(w.en.toLowerCase())); return <SpeakableSentence key={i} text={s} lang="en" highlight={aw?.en} />; })}
          <button className="play-all-btn" onClick={() => playAll(selectedAdverbDay.paragraph)}>▶️ Play Entire Paragraph</button>
        </div>
      </>)}

      {tab === "home" && selectedLesson && !quizActive && !quizDone && selectedLesson.hasAdverbs && selectedPrepDay && (<>
        <div className="tts-hint">🔊 Tap English word → English voice | Tap Urdu word → Urdu voice | Tap sentence → hear it read!</div>
        <div className="adverb-detail-section"><h3>📍 Day {selectedPrepDay.day} — Prepositions</h3>{selectedPrepDay.words.map((w, i) => <WordRow key={i} en={w.en} ur={w.ur} />)}</div>
        <div className="adverb-detail-section"><h3>📖 Practice Paragraph</h3>
          {selectedPrepDay.paragraph.split(/(?<=[.!?])\s+/).filter(Boolean).map((s, i) => { const pw = selectedPrepDay.words.find(w => s.toLowerCase().includes(w.en.toLowerCase().split(" ")[0])); return <SpeakableSentence key={i} text={s} lang="en" highlight={pw?.en} />; })}
          <button className="play-all-btn" onClick={() => playAll(selectedPrepDay.paragraph)}>▶️ Play Entire Paragraph</button>
        </div>
        {selectedPrepDay.difficult && (<div className="adverb-detail-section"><h3>📚 Difficult Words</h3>{selectedPrepDay.difficult.map((w, i) => <WordRow key={i} en={w.en} ur={w.ur} />)}</div>)}
      </>)}

      {tab === "home" && selectedLesson && !quizActive && !quizDone && selectedLesson.hasAdverbs && selectedAdjDay && (<>
        <div className="tts-hint">🔊 Tap English forms → hear all 3 forms spoken | Tap Urdu → Urdu voice | Tap sentence → hear it read!</div>
        <div className="adverb-detail-section"><h3>🏷️ Day {selectedAdjDay.day} — Adjective Forms</h3>{selectedAdjDay.words.map((w, i) => <AdjWordRow key={i} en={w.en} ur={w.ur} comp={w.comp} sup={w.super} />)}</div>
        <div className="adverb-detail-section"><h3>📖 Practice Paragraph</h3>
          {selectedAdjDay.paragraph.split(/(?<=[.!?])\s+/).filter(Boolean).map((s, i) => { const aw = selectedAdjDay.words.find(w => s.toLowerCase().includes(w.en.toLowerCase())); return <SpeakableSentence key={i} text={s} lang="en" highlight={aw?.en} />; })}
          <button className="play-all-btn" onClick={() => playAll(selectedAdjDay.paragraph)}>▶️ Play Entire Paragraph</button>
        </div>
      </>)}

      {tab === "home" && selectedLesson && !quizActive && !quizDone && selectedLesson.hasAdverbs && selectedConjDay && (<>
        <div className="tts-hint">🔊 Tap English word → English voice | Tap Urdu word → Urdu voice | Tap sentence → hear it read!</div>
        <div className="adverb-detail-section"><h3>🔗 Day {selectedConjDay.day} — Conjunctions</h3>{selectedConjDay.words.map((w, i) => <WordRow key={i} en={w.en} ur={w.ur} />)}</div>
        <div className="adverb-detail-section"><h3>📖 Practice Paragraph</h3>
          {selectedConjDay.paragraph.split(/(?<=[.!?])\s+/).filter(Boolean).map((s, i) => { const cw = selectedConjDay.words.find(w => s.toLowerCase().includes(w.en.toLowerCase().split("...")[0].split(" ")[0])); return <SpeakableSentence key={i} text={s} lang="en" highlight={cw?.en} />; })}
          <button className="play-all-btn" onClick={() => playAll(selectedConjDay.paragraph)}>▶️ Play Entire Paragraph</button>
        </div>
        {selectedConjDay.difficult && (<div className="adverb-detail-section"><h3>📚 Difficult Words</h3>{selectedConjDay.difficult.map((w, i) => <WordRow key={i} en={w.en} ur={w.ur} />)}</div>)}
      </>)}

      {tab === "home" && selectedLesson && !quizActive && !quizDone && selectedLesson.hasAdverbs && selectedPronDay && (<>
        <div className="tts-hint">🔊 Tap English word → English voice | Tap Urdu word → Urdu voice | Tap sentence → hear it read!</div>
        <div className="adverb-detail-section"><h3>👤 Day {selectedPronDay.day} — Pronouns</h3>{selectedPronDay.words.map((w, i) => <WordRow key={i} en={w.en} ur={w.ur} />)}</div>
        <div className="adverb-detail-section"><h3>📖 Practice Paragraph</h3>
          {selectedPronDay.paragraph.split(/(?<=[.!?])\s+/).filter(Boolean).map((s, i) => { const pw = selectedPronDay.words.find(w => s.toLowerCase().includes(w.en.toLowerCase().split(" ")[0].split("/")[0])); return <SpeakableSentence key={i} text={s} lang="en" highlight={pw?.en} />; })}
          <button className="play-all-btn" onClick={() => playAll(selectedPronDay.paragraph)}>▶️ Play Entire Paragraph</button>
        </div>
      </>)}

      {tab === "home" && selectedLesson && !quizActive && !quizDone && selectedLesson.hasAdverbs && selectedNounDay && (<>
        <div className="tts-hint">🔊 Tap English word → English voice | Tap Urdu word → Urdu voice | Tap sentence → hear it read!</div>
        <div className="adverb-detail-section"><h3>📦 Day {selectedNounDay.day} — Collective Nouns</h3>{selectedNounDay.words.map((w, i) => <WordRow key={i} en={w.en} ur={w.ur} />)}</div>
        <div className="adverb-detail-section"><h3>📖 Practice Paragraph</h3>
          {selectedNounDay.paragraph.split(/(?<=[.!?])\s+/).filter(Boolean).map((s, i) => { const nw = selectedNounDay.words.find(w => s.toLowerCase().includes(w.en.toLowerCase())); return <SpeakableSentence key={i} text={s} lang="en" highlight={nw?.en} />; })}
          <button className="play-all-btn" onClick={() => playAll(selectedNounDay.paragraph)}>▶️ Play Entire Paragraph</button>
        </div>
      </>)}

      {tab === "home" && selectedLesson && !quizActive && !quizDone && selectedLesson.hasAdverbs && selectedVerbDay && (<>
        <div className="tts-hint">🔊 Tap V1 → V2 → V3 forms spoken | Tap Urdu → Urdu voice | Tap sentence → hear it read!</div>
        <div className="adverb-detail-section"><h3>✏️ Day {selectedVerbDay.day} — Verb Forms</h3>{selectedVerbDay.words.map((w, i) => <VerbWordRow key={i} en={w.en} ur={w.ur} v2={w.v2} v3={w.v3} />)}</div>
        <div className="adverb-detail-section"><h3>📖 Practice Paragraph</h3>
          {selectedVerbDay.paragraph.split(/(?<=[.!?])\s+/).filter(Boolean).map((s, i) => { const vw = selectedVerbDay.words.find(w => s.toLowerCase().includes(w.en.toLowerCase())); return <SpeakableSentence key={i} text={s} lang="en" highlight={vw?.en} />; })}
          <button className="play-all-btn" onClick={() => playAll(selectedVerbDay.paragraph)}>▶️ Play Entire Paragraph</button>
        </div>
      </>)}

      {tab === "home" && selectedLesson && !quizActive && !quizDone && !selectedLesson.hasAdverbs && !selectedLesson.hasTenses && !selectedLesson.hasVocab && !selectedLesson.hasMathSub && (<div className="lesson-detail"><h2>{selectedLesson.title}</h2><p className={selectedSubject?.id === "urdu" ? "urdu-text" : ""}>{selectedLesson.content}</p><button className="start-quiz-btn" onClick={() => { setQuizActive(true); setQuizIdx(0); setQuizAnswers([]); setQuizRevealed(false); setQuizDone(false); setQuizStartTime(Date.now()); setNewBadges([]); }}>🎯 Start Quiz</button></div>)}

      {tab === "home" && selectedLesson && !quizActive && !quizDone && selectedLesson.hasMathSub && mathSubIdx === null && (<>
        {(() => { const isUr = selectedSubject?.id === "urdu"; return (<>
        <div className="lesson-detail" style={isUr?{direction:"rtl",fontFamily:"'Noto Nastaliq Urdu',serif",textAlign:"right"}:{}}><h2>{selectedLesson.title}</h2><p>{selectedLesson.content}</p></div>
        <h3 className="section-title" style={{ marginTop: 8, direction: isUr?"rtl":"ltr", textAlign: isUr?"right":"left" }}>{isUr ? "📐 موضوعات" : "📐 Topics"}</h3>
        {selectedLesson.subs.map((sub, i) => {
          const topicColors = ["#38BDF8","#22C55E","#F59E0B","#A855F7","#EC4899","#14B8A6","#F97316"];
          const tc = topicColors[i % topicColors.length];
          return (
          <div key={i} className="adverb-day-card" onClick={() => { setMathSubIdx(i); setMathSubTab("examples"); setSubExerciseGroupIdx(null); setSubQuizGroupIdx(null); setRevealedEx({}); }} style={{display:"flex",alignItems:"center",gap:14,direction:isUr?"rtl":"ltr"}}>
            <span style={{display:"inline-flex",alignItems:"center",justifyContent:"center",minWidth:40,height:40,borderRadius:12,background:tc+"22",border:"2px solid "+tc,color:tc,fontSize:16,fontWeight:800,fontFamily:isUr?"'Noto Nastaliq Urdu',serif":"'Baloo 2',sans-serif",flexShrink:0}}>{i+1}</span>
            <div style={{flex:1,textAlign:isUr?"right":"left"}}>
              <h3 style={{fontSize:16,fontWeight:700,margin:0,fontFamily:isUr?"'Noto Nastaliq Urdu',serif":"inherit"}}>{sub.t}</h3>
              <p style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 4, fontFamily:isUr?"'Noto Nastaliq Urdu',serif":"inherit" }}>{sub.c.substring(0,80)}...</p>
            </div>
          </div>);
        })}
        </>); })()}
      </>)}

      {tab === "home" && selectedLesson && !quizActive && !quizDone && selectedLesson.hasMathSub && mathSubIdx !== null && (() => {
        const sub = normalizeSubLesson(selectedLesson.subs[mathSubIdx], selectedSubject?.id);
        const toggleReveal = (k) => setRevealedEx(p => ({...p,[k]:!p[k]}));
        const isUr = selectedSubject?.id === "urdu";
        const isMath = selectedSubject?.id === "math";
        const activeExerciseGroup = sub.exerciseGroups && subExerciseGroupIdx !== null ? sub.exerciseGroups[subExerciseGroupIdx] : null;
        const activeQuizGroup = sub.quizGroups && subQuizGroupIdx !== null ? sub.quizGroups[subQuizGroupIdx] : null;
        const exercisesToRender = activeExerciseGroup ? activeExerciseGroup.exercises : (sub.exerciseGroups ? null : sub.exercises);
        const quizToRender = activeQuizGroup ? activeQuizGroup.questions : (sub.quizGroups ? null : sub.quiz);
        const urS = isUr ? {direction:"rtl",fontFamily:"'Noto Nastaliq Urdu',serif",textAlign:"right"} : {};
        return (<>
        <div className="adverb-detail-section" style={{marginBottom:10,...urS}}>
          <h3 style={{color:"#FF6B35",...urS}}>{isUr?"📖":"📐"} {sub.t}</h3>
          {isMath ? <MathVisualDeck sub={sub} lessonTitle={selectedLesson?.title} /> : <>
          {sub.svgType === "placeValue" && <PlaceValueChart number={sub.svgData.number} />}
          {sub.svgType === "expandedForm" && <ExpandedFormSVG number={sub.svgData.number} parts={sub.svgData.parts} />}
          {sub.svgType === "compare" && <CompareTripleSVG />}
          {sub.svgType === "rounding" && <RoundingDualSVG />}
          {sub.svgType === "columnAdd" && <ColumnAddSVG num1={sub.svgData.num1} num2={sub.svgData.num2} result={sub.svgData.result} />}
          {sub.svgType === "columnSub" && <ColumnSubSVG num1={sub.svgData.num1} num2={sub.svgData.num2} result={sub.svgData.result} />}
          {sub.svgType === "estimation" && <EstimationSVG num1={sub.svgData.num1} num2={sub.svgData.num2} op={sub.svgData.op} rounded1={sub.svgData.rounded1} rounded2={sub.svgData.rounded2} estimate={sub.svgData.estimate} exact={sub.svgData.exact} />}
{sub.svgType === "statesOfMatter" && <StatesOfMatterSVG />}
{sub.svgType === "materialProperties" && <MaterialPropertiesSVG />}
{sub.svgType === "mixturesSolutions" && <MixturesSolutionsSVG />}
{sub.svgType === "gravityForce" && <GravityForceSVG />}
{sub.svgType === "frictionForce" && <FrictionForceSVG />}
{sub.svgType === "foodChain" && <FoodChainSVG />}
{sub.svgType === "solarSystem" && <SolarSystemSVG />}
{sub.svgType === "earthLayers" && <EarthLayersSVG />}
{sub.svgType === "bodySystem" && <BodySystemSVG system={sub.svgData.system} />}
{sub.svgType === "moonPhases" && <MoonPhasesSVG />}
{sub.svgType === "magnetPoles" && <MagnetPolesSVG />}
{sub.svgType === "lightReflection" && <LightRefractionSVG />}
{sub.svgType === "simpleMachines" && <SimpleMachinesSVG />}
{sub.svgType === "energyTypes" && <EnergyTypesSVG />}
{sub.svgType === "dayNight" && <DayNightSVG />}
{sub.svgType === "seasonsCycle" && <SeasonsCycleSVG />}
{sub.svgType === "nervousSystem" && <NervousSystemSVG />}
{sub.svgType === "classificationGroups" && <ClassificationSVG />}
{sub.svgType === "adaptationTraits" && <AdaptationSVG />}
{sub.svgType === "soundWaves" && <SoundWavesSVG />}
{sub.svgType === "skeleton" && <SkeletonSVG />}
          {sub.svgType === "waterCycle" && <WaterCycleSVG />}
          {sub.svgType === "photosynthesis" && <PhotosynthesisSVG />}
          {sub.svgType === "pakistanMap" && <PakistanMapSVG />}
          {sub.svgType === "indusValley" && <IndusValleySVG />}
          {sub.svgType === "pakFlag" && <PakFlagSVG />}
          {sub.svgType === "pakGov" && <PakGovSVG />}
          {sub.svgType === "presidentialSystem" && <PresidentialSystemSVG />}
          {sub.svgType === "federalParliamentry" && <FederalParliamentrySVG />}
          {sub.svgType === "pakRivers" && <PakRiversSVG />}
          {sub.svgType === "numberLine" && <>
            <NumberLineSVG min={sub.svgData.min} max={sub.svgData.max} marks={sub.svgData.marks} highlight={sub.svgData.highlight} />
            <div className="math-svg"><svg viewBox="0 0 620 100" xmlns="http://www.w3.org/2000/svg">
              <rect width="620" height="100" rx="12" fill="#1E293B"/>
              <text x="310" y="18" textAnchor="middle" fill="#94A3B8" fontSize="12" fontWeight="700" fontFamily="'Baloo 2'">Positive &amp; Negative Numbers</text>
              <line x1="30" y1="52" x2="590" y2="52" stroke="#475569" strokeWidth="3" strokeLinecap="round"/>
              <polygon points="22,52 30,46 30,58" fill="#475569"/>
              <polygon points="598,52 590,46 590,58" fill="#475569"/>
              {[-5,-4,-3,-2,-1,0,1,2,3,4,5].map((n,i) => {
                const x = 310 + n * 52;
                const isZero = n === 0;
                const isNeg = n < 0;
                const col = isZero ? "#F59E0B" : isNeg ? "#EF4444" : "#22C55E";
                return (<g key={i} onClick={() => handleBoxClick(s.label)} style={{cursor: 'pointer'}}>
                  <line x1={x} y1="44" x2={x} y2="60" stroke={col} strokeWidth={isZero ? 4 : 2}/>
                  <text x={x} y="80" textAnchor="middle" fill={col} fontSize={isZero ? "18" : "15"} fontWeight={isZero ? "900" : "700"} fontFamily="'Baloo 2'">{n}</text>
                  {isZero && <circle cx={x} cy="52" r="6" fill="#F59E0B"/>}
                </g>);
              })}
              <text x="80" y="38" textAnchor="middle" fill="#EF4444" fontSize="12" fontWeight="700" fontFamily="'Baloo 2'">← Negative</text>
              <text x="540" y="38" textAnchor="middle" fill="#22C55E" fontSize="12" fontWeight="700" fontFamily="'Baloo 2'">Positive →</text>
            </svg></div>
          </>}
          </>}
          {sub.c.split(/(?<=[.!?۔؟])\s+/).filter(Boolean).map((s,i) => <SpeakableSentence key={i} text={s} lang={isUr?"ur":"en"} />)}
          <button className="play-all-btn" style={isUr?{fontFamily:"'Noto Nastaliq Urdu',serif",direction:"rtl"}:{}} onClick={() => playAll(sub.c)}>{isUr?"▶️ سنیں":"▶️ Play Explanation"}</button>
        </div>

        <div style={{display:"flex",gap:6,marginBottom:14,direction:isUr?"rtl":"ltr"}}>
          {[{id:"examples",label:isUr?"💡 مثالیں":"💡 Examples",c:"#38BDF8"},{id:"exercises",label:isUr?"✏️ مشقیں":"✏️ Exercises",c:"#22C55E"},{id:"quiz",label:isUr?"🎯 امتحان":"🎯 Quiz",c:"#F59E0B"}].map(t=>(
            <button key={t.id} onClick={()=>{setMathSubTab(t.id);setSubExerciseGroupIdx(null);setSubQuizGroupIdx(null);setRevealedEx({});}} style={{flex:1,padding:"10px 6px",borderRadius:10,border:mathSubTab===t.id?"2px solid "+t.c:"1px solid rgba(148,163,184,0.15)",background:mathSubTab===t.id?t.c+"22":"rgba(30,41,59,0.6)",color:mathSubTab===t.id?t.c:"#94A3B8",fontFamily:isUr?"'Noto Nastaliq Urdu',serif":"'Baloo 2',sans-serif",fontSize:isUr?14:13,fontWeight:700,cursor:"pointer"}}>{t.label}</button>
          ))}
        </div>

        {mathSubTab === "examples" && sub.dayLessons && (<div style={urS}>
          <h3 className="section-title" style={{color:"#38BDF8",marginBottom:12,direction:isUr?"rtl":"ltr",textAlign:isUr?"right":"left"}}>{sub.lessonLabel || (isUr?"📅 اسباق کے دن":"📅 Lesson Days")}</h3>
          {sub.dayLessons.map((lessonDay, dayIdx) => (
            <div key={lessonDay.day || dayIdx} className="adverb-detail-section" style={urS}>
              <h3 style={{color:"#38BDF8",marginBottom:12,...urS}}>{isUr ? `📅 دن ${lessonDay.day}` : `📅 Day ${lessonDay.day}`}</h3>
              {lessonDay.words && lessonDay.words.map((w, i) => (
                <div key={i} style={{ marginBottom: 10 }}>
                  {"opposite" in w || "oppositeUr" in w ? <OppositeWordRow en={w.en} ur={w.ur} opposite={w.opposite} oppositeUr={w.oppositeUr} /> : "comp" in w || "super" in w ? <AdjWordRow en={w.en} ur={w.ur} comp={w.comp} sup={w.super} /> : "v2" in w || "v3" in w ? <VerbWordRow en={w.en} ur={w.ur} v2={w.v2} v3={w.v3} /> : <WordRow en={w.en} ur={w.ur} />}
                  {w.meaning && <div style={{ padding: "4px 14px", fontSize: 12, color: "var(--text-muted)", fontStyle: "italic" }}>→ {w.meaning}</div>}
                </div>
              ))}
              {lessonDay.pairs && lessonDay.pairs.map((pair, i) => (
                <div key={i} className="word-row" style={{cursor:"default",gap:10}}>
                  <div style={{flex:1}}><SpeakableSentence text={pair.left} lang="en" /></div>
                  <span style={{color:"var(--accent)",fontWeight:800}}>↔</span>
                  <div style={{flex:1}}><SpeakableSentence text={pair.right} lang="en" /></div>
                </div>
              ))}
              {lessonDay.paragraph && (<>
                <div style={{fontSize:12,fontWeight:800,color:"#22C55E",marginTop:12,marginBottom:8,fontFamily:"'Baloo 2',sans-serif"}}>{isUr?"📖 پیراگراف":"📖 Practice Paragraph"}</div>
                {lessonDay.paragraph.split(/(?<=[.!?])\s+/).filter(Boolean).map((s, i) => {
                  const found = (lessonDay.words || []).find(w => s.toLowerCase().includes((w.en || "").toLowerCase().split(" ")[0].replace("(", "")));
                  const hasOpposites = (lessonDay.words || []).some(w => "opposite" in w || "oppositeUr" in w);
                  const sentenceHighlights = (lessonDay.words || []).map(w => w.en).filter(Boolean).filter(word => s.toLowerCase().includes(normalizeHighlightTerm(word)));
                  const paragraphSentence = hasOpposites ? stripInlineUrduForKnownWords(s, lessonDay.words || []) : s;
                  return hasOpposites
                    ? <MixedUrduParagraphSentence key={i} text={paragraphSentence} highlight={sentenceHighlights} />
                    : <SpeakableSentence key={i} text={s} lang="en" highlight={sentenceHighlights} />;
                })}
                <button className="play-all-btn" onClick={() => playAll(lessonDay.paragraph)}>▶️ Play Entire Paragraph</button>
              </>)}
              {lessonDay.difficult && lessonDay.difficult.length > 0 && (<>
                <div style={{fontSize:12,fontWeight:800,color:"#F59E0B",marginTop:12,marginBottom:8,fontFamily:"'Baloo 2',sans-serif"}}>{isUr?"📚 مشکل الفاظ":"📚 Difficult Words"}</div>
                {lessonDay.difficult.map((w, i) => <WordRow key={i} en={w.en} ur={w.ur} />)}
              </>)}
            </div>
          ))}
        </div>)}

        {mathSubTab === "examples" && sub.sentencePairs && (<div className="adverb-detail-section">
          <h3 style={{color:"#38BDF8",marginBottom:10}}>{sub.examplesLabel || "🗣️ Sentences"}</h3>
          {sub.sentencePairs.map((pair, i) => <SentencePairRow key={i} en={pair.en} ur={pair.ur} />)}
          <button className="play-all-btn" onClick={()=>playAll(sub.sentencePairs.map(pair => pair.en).join(" "))}>▶️ Play All English Sentences</button>
        </div>)}

        {mathSubTab === "examples" && !sub.dayLessons && !sub.sentencePairs && sub.examples && (<div className="adverb-detail-section" style={urS}>
          <h3 style={{color:"#38BDF8",marginBottom:10,...urS}}>{sub.examplesLabel || (isUr?"💡 مثالیں":"💡 Examples")}</h3>
          {sub.examples.map((ex,i) => <SpeakableSentence key={i} text={ex} lang={isUr?"ur":"en"} />)}
          <button className="play-all-btn" style={isUr?{fontFamily:"'Noto Nastaliq Urdu',serif",direction:"rtl"}:{}} onClick={()=>playAll(sub.examples.join(". "))}>{isUr?"▶️ سب سنیں":"▶️ Play All Examples"}</button>
        </div>)}

        {mathSubTab === "exercises" && (sub.exerciseGroups || sub.exercises) && (<div style={urS}>
          {sub.exerciseGroups && subExerciseGroupIdx === null ? (
            <>
              <h3 className="section-title" style={{color:"#22C55E",marginBottom:12,direction:isUr?"rtl":"ltr",textAlign:isUr?"right":"left"}}>{isUr?"✏️ مشق کے دن":"✏️ Exercise Days"}</h3>
              {sub.exerciseGroups.map((group, gi) => (
                <div key={group.label} className="adverb-day-card" onClick={() => { setSubExerciseGroupIdx(gi); setRevealedEx({}); }} style={{display:"flex",alignItems:"center",gap:14,direction:isUr?"rtl":"ltr"}}>
                  <span style={{display:"inline-flex",alignItems:"center",justifyContent:"center",minWidth:40,height:40,borderRadius:12,background:"#22C55E22",border:"2px solid #22C55E",color:"#22C55E",fontSize:16,fontWeight:800,fontFamily:"'Baloo 2',sans-serif",flexShrink:0}}>{gi + 1}</span>
                  <div style={{flex:1,textAlign:isUr?"right":"left"}}>
                    <h3 style={{fontSize:16,fontWeight:700,margin:0,fontFamily:isUr?"'Noto Nastaliq Urdu',serif":"inherit"}}>{group.label}</h3>
                    <p style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 4, fontFamily:isUr?"'Noto Nastaliq Urdu',serif":"inherit" }}>{isUr?"ان دنوں کی تمام مشقیں":"All exercises for these days"}</p>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <>
              {activeExerciseGroup && <div className="adverb-detail-section" style={{marginBottom:14,...urS}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:10,flexWrap:"wrap",direction:isUr?"rtl":"ltr"}}>
                  <h3 style={{color:"#22C55E",margin:0,...urS}}>{activeExerciseGroup.label}</h3>
                  <button className="play-all-btn" style={{width:"auto",marginTop:0,padding:"10px 14px",background:"linear-gradient(135deg,#475569,#334155)"}} onClick={() => { setSubExerciseGroupIdx(null); setRevealedEx({}); }}>{isUr?"← دنوں کی فہرست":"← Back to Day Groups"}</button>
                </div>
              </div>}
          {exercisesToRender && exercisesToRender.map((ex,ei) => {
            const qColors = ["#38BDF8","#22C55E","#F59E0B","#A855F7","#EC4899","#14B8A6","#F97316","#6366F1"];
            const qc = qColors[ei % qColors.length];
            const isColumnMatch = ex.q === "Match the columns:" || ex.q === "کالم ملائیں:";
            const matchOrder = isColumnMatch && ex.ans ? ex.ans.map((_,i) => i) : [];
            if (isColumnMatch && matchOrder.length > 1) {
              for (let i = matchOrder.length - 1; i > 0; i--) {
                const swapIndex = ((ei + 1) * (i + 3) + ex.q.length) % (i + 1);
                [matchOrder[i], matchOrder[swapIndex]] = [matchOrder[swapIndex], matchOrder[i]];
              }
              if (matchOrder.every((value, index) => value === index)) {
                matchOrder.push(matchOrder.shift());
              }
            }
            return (
            <div key={ei} className="adverb-detail-section" style={{marginBottom:14,...urS}}>
              <div style={{display:"flex",direction:isUr?"rtl":"ltr",alignItems:"center",gap:10,marginBottom:10}}>
                <span style={{display:"inline-flex",alignItems:"center",justifyContent:"center",minWidth:36,height:36,borderRadius:10,background:qc+"22",border:"2px solid "+qc,color:qc,fontSize:13,fontWeight:800,fontFamily:isUr?"'Noto Nastaliq Urdu',serif":"'Baloo 2',sans-serif"}}>{isUr?("س"+(ei+1)):("Q"+(ei+1))}</span>
                <div style={{flex:1}}><SpeakableSentence text={ex.q} lang={isUr?"ur":"en"} /></div>
              </div>
              {isColumnMatch ? (
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(260px, 1fr))",gap:14,direction:isUr?"rtl":"ltr"}}>
                  <div style={{background:"rgba(15,23,42,0.55)",border:"1px solid rgba(56,189,248,0.25)",borderRadius:12,padding:12}}>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10,gap:8}}>
                      <span style={{color:"#38BDF8",fontSize:12,fontWeight:800,fontFamily:isUr?"'Noto Nastaliq Urdu',serif":"'Baloo 2',sans-serif"}}>{isUr?"کالم A":"Column A"}</span>
                      <span style={{color:"#94A3B8",fontSize:11,fontWeight:700,fontFamily:isUr?"'Noto Nastaliq Urdu',serif":"'Baloo 2',sans-serif"}}>{isUr?"صحیح جواب کالم B میں":"Show correct from Column B"}</span>
                    </div>
                    {ex.parts.map((p,pi) => {
                      const rk = ei+"_A_"+pi;
                      const pc = qColors[(ei+pi+1) % qColors.length];
                      const displayP = p.replace(/(\d)̲/g, '[$1]').replace(/(\d)\u0332/g, '[$1]');
                      return (<div key={"A_"+pi} style={{display:"flex",alignItems:"center",gap:8,marginBottom:8,paddingLeft:isUr?0:4,paddingRight:isUr?4:0,direction:isUr?"rtl":"ltr"}}>
                        <span style={{display:"inline-flex",alignItems:"center",justifyContent:"center",minWidth:28,height:28,borderRadius:8,background:pc+"18",border:"1.5px solid "+pc+"66",color:pc,fontSize:11,fontWeight:800,fontFamily:"'Baloo 2',sans-serif",flexShrink:0}}>A{pi+1}</span>
                        <div style={{flex:1}}><SpeakableSentence text={displayP} lang={isUrduText(displayP)?"ur":"en"} /></div>
                        <button onClick={()=>toggleReveal(rk)} style={{padding:"6px 12px",borderRadius:8,border:"1.5px solid "+(revealedEx[rk]?"#22C55E55":"rgba(148,163,184,0.2)"),background:revealedEx[rk]?"rgba(34,197,94,0.12)":"rgba(30,41,59,0.8)",color:revealedEx[rk]?"#22C55E":"#94A3B8",fontSize:11,fontWeight:700,cursor:"pointer",minWidth:56,fontFamily:isUr?"'Noto Nastaliq Urdu',serif":"'Baloo 2',sans-serif",transition:"all 0.2s"}}>{revealedEx[rk]?(isUr?"چھپائیں":"Hide"):(isUr?"دکھائیں":"Show")}</button>
                        {revealedEx[rk] && ex.ans && ex.ans[pi] && <div style={{maxWidth:"100%"}}><SpeakableSentence text={formatListedAnswer(ex.ans[pi])} lang={isUrduText(ex.ans[pi])?"ur":"en"} fullWidth={false} buttonStyle={{background:"rgba(34,197,94,0.14)",border:"1px solid rgba(34,197,94,0.35)",color:"#DCFCE7",padding:"8px 14px"}} textStyle={{fontSize:16,lineHeight:1.5,whiteSpace:"pre-line",fontFamily:isUrduText(ex.ans[pi])?"'Noto Nastaliq Urdu',serif":"inherit",direction:isUrduText(ex.ans[pi])?"rtl":"ltr",textAlign:isUrduText(ex.ans[pi])?"right":"left"}} /></div>}
                      </div>);
                    })}
                  </div>
                  <div style={{background:"rgba(15,23,42,0.55)",border:"1px solid rgba(245,158,11,0.25)",borderRadius:12,padding:12}}>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10,gap:8}}>
                      <span style={{color:"#F59E0B",fontSize:12,fontWeight:800,fontFamily:isUr?"'Noto Nastaliq Urdu',serif":"'Baloo 2',sans-serif"}}>{isUr?"کالم B":"Column B"}</span>
                      <span style={{color:"#94A3B8",fontSize:11,fontWeight:700,fontFamily:isUr?"'Noto Nastaliq Urdu',serif":"'Baloo 2',sans-serif"}}>{isUr?"صحیح جواب کالم A میں":"Show correct from Column A"}</span>
                    </div>
                    {ex.ans && matchOrder.map((originalIndex,pi) => {
                      const rk = ei+"_B_"+originalIndex;
                      const pc = qColors[(ei+pi+3) % qColors.length];
                      const a = ex.ans[originalIndex];
                      return (<div key={"B_"+pi} style={{display:"flex",alignItems:"center",gap:8,marginBottom:8,paddingLeft:isUr?0:4,paddingRight:isUr?4:0,direction:isUr?"rtl":"ltr"}}>
                        <span style={{display:"inline-flex",alignItems:"center",justifyContent:"center",minWidth:28,height:28,borderRadius:8,background:pc+"18",border:"1.5px solid "+pc+"66",color:pc,fontSize:11,fontWeight:800,fontFamily:"'Baloo 2',sans-serif",flexShrink:0}}>B{pi+1}</span>
                        <div style={{flex:1}}><SpeakableSentence text={a} lang={isUrduText(a)?"ur":"en"} /></div>
                        <button onClick={()=>toggleReveal(rk)} style={{padding:"6px 12px",borderRadius:8,border:"1.5px solid "+(revealedEx[rk]?"#22C55E55":"rgba(148,163,184,0.2)"),background:revealedEx[rk]?"rgba(34,197,94,0.12)":"rgba(30,41,59,0.8)",color:revealedEx[rk]?"#22C55E":"#94A3B8",fontSize:11,fontWeight:700,cursor:"pointer",minWidth:56,fontFamily:isUr?"'Noto Nastaliq Urdu',serif":"'Baloo 2',sans-serif",transition:"all 0.2s"}}>{revealedEx[rk]?(isUr?"چھپائیں":"Hide"):(isUr?"دکھائیں":"Show")}</button>
                        {revealedEx[rk] && ex.parts && ex.parts[originalIndex] && <div style={{maxWidth:"100%"}}><SpeakableSentence text={formatListedAnswer(ex.parts[originalIndex])} lang={isUrduText(ex.parts[originalIndex])?"ur":"en"} fullWidth={false} buttonStyle={{background:"rgba(34,197,94,0.14)",border:"1px solid rgba(34,197,94,0.35)",color:"#DCFCE7",padding:"8px 14px"}} textStyle={{fontSize:16,lineHeight:1.5,whiteSpace:"pre-line",fontFamily:isUrduText(ex.parts[originalIndex])?"'Noto Nastaliq Urdu',serif":"inherit",direction:isUrduText(ex.parts[originalIndex])?"rtl":"ltr",textAlign:isUrduText(ex.parts[originalIndex])?"right":"left"}} /></div>}
                      </div>);
                    })}
                  </div>
                </div>
              ) : ex.parts.map((p,pi) => {
                const rk = ei+"_"+pi;
                const pc = qColors[(ei+pi+1) % qColors.length];
                // Replace underlined chars (like 4̲) with boxed display
                const displayP = p.replace(/(\d)̲/g, '[$1]').replace(/(\d)\u0332/g, '[$1]');
                const promptVisual = getSimpleMachinePromptVisual(sub, ex, displayP);
                return (<div key={pi} style={{display:"flex",alignItems:"center",gap:8,marginBottom:8,paddingLeft:isUr?0:8,paddingRight:isUr?8:0,direction:isUr?"rtl":"ltr"}}>
                  <span style={{display:"inline-flex",alignItems:"center",justifyContent:"center",minWidth:28,height:28,borderRadius:8,background:pc+"18",border:"1.5px solid "+pc+"66",color:pc,fontSize:11,fontWeight:800,fontFamily:"'Baloo 2',sans-serif",flexShrink:0}}>{String.fromCharCode(97+pi)}</span>
                  <div style={{flex:1,display:"flex",alignItems:"center",gap:8}}>
                    {promptVisual}
                    <div style={{flex:1}}><SpeakableSentence text={displayP} lang={isUrduText(displayP)?"ur":"en"} /></div>
                  </div>
                  <button onClick={()=>toggleReveal(rk)} style={{padding:"6px 14px",borderRadius:8,border:"1.5px solid "+(revealedEx[rk]?"#22C55E55":"rgba(148,163,184,0.2)"),background:revealedEx[rk]?"rgba(34,197,94,0.12)":"rgba(30,41,59,0.8)",color:revealedEx[rk]?"#22C55E":"#94A3B8",fontSize:11,fontWeight:700,cursor:"pointer",minWidth:56,fontFamily:isUr?"'Noto Nastaliq Urdu',serif":"'Baloo 2',sans-serif",transition:"all 0.2s"}}>{revealedEx[rk]?(isUr?"چھپائیں":"Hide"):(isUr?"دکھائیں":"Show")}</button>
                  {revealedEx[rk] && ex.ans && ex.ans[pi] && <div style={{maxWidth:"100%"}}><SpeakableSentence text={formatListedAnswer(ex.ans[pi])} lang={isUrduText(ex.ans[pi])?"ur":"en"} fullWidth={false} buttonStyle={{background:"rgba(34,197,94,0.14)",border:"1px solid rgba(34,197,94,0.35)",color:"#DCFCE7",padding:"8px 14px"}} textStyle={{fontSize:16,lineHeight:1.5,whiteSpace:"pre-line",fontFamily:isUrduText(ex.ans[pi])?"'Noto Nastaliq Urdu',serif":"inherit",direction:isUrduText(ex.ans[pi])?"rtl":"ltr",textAlign:isUrduText(ex.ans[pi])?"right":"left"}} /></div>}
                </div>);
              })}
            </div>);
          })}
          {sub.wordProblems && (<div className="adverb-detail-section" style={{marginBottom:14,...urS}}>
            <h3 style={{color:"#F59E0B",fontSize:14,marginBottom:10,...urS}}>{isUr?"🌍 عملی سوالات":"🌍 Word Problems"}</h3>
            {sub.wordProblems.map((wp,wi) => {
              const isObj = typeof wp === "object";
              const qText = isObj ? wp.q : wp;
              const aText = isObj ? wp.a : null;
              return (
              <div key={wi} style={{marginBottom:12}}>
                <div style={{display:"flex",direction:isUr?"rtl":"ltr",alignItems:"flex-start",gap:10}}>
                  <span style={{display:"inline-flex",alignItems:"center",justifyContent:"center",minWidth:32,height:32,borderRadius:10,background:"#F59E0B22",border:"2px solid #F59E0B",color:"#F59E0B",fontSize:12,fontWeight:800,fontFamily:isUr?"'Noto Nastaliq Urdu',serif":"'Baloo 2',sans-serif",flexShrink:0}}>{isUr?("م"+(wi+1)):("W"+(wi+1))}</span>
                  <div style={{flex:1}}><SpeakableSentence text={qText} lang={isUr?"ur":"en"} /></div>
                </div>
                {aText && <div style={{marginTop:6,marginLeft:isUr?0:42,marginRight:isUr?42:0,direction:isUr?"rtl":"ltr"}}>
                  <div style={{background:"rgba(34,197,94,0.08)",border:"1px solid rgba(34,197,94,0.28)",borderRadius:12,padding:"10px 10px 6px"}}>
                    <div style={{color:"#86EFAC",fontSize:12,fontWeight:800,letterSpacing:0.4,textTransform:"uppercase",marginBottom:6,fontFamily:isUr?"'Noto Nastaliq Urdu',serif":"'Baloo 2',sans-serif"}}>{isUr?"✅ جواب":"✅ Answer"}</div>
                    <SpeakableSentence text={formatListedAnswer(aText)} lang={isUr?"ur":"en"} buttonStyle={{background:"rgba(34,197,94,0.16)",border:"1px solid rgba(34,197,94,0.38)",color:"#ECFDF5",marginBottom:0}} textStyle={{fontSize:16,lineHeight:1.55,whiteSpace:"pre-line"}} />
                  </div>
                </div>}
              </div>);
            })}
          </div>)}
            </>
          )}
        </div>)}

        {mathSubTab === "quiz" && (sub.quizGroups || sub.quiz) && (
          sub.quizGroups ? (
            subQuizGroupIdx === null ? (
              <div style={urS}>
                <h3 className="section-title" style={{color:"#F59E0B",marginBottom:12,direction:isUr?"rtl":"ltr",textAlign:isUr?"right":"left"}}>{isUr?"🎯 کوئز کے دن":"🎯 Quiz Days"}</h3>
                {sub.quizGroups.map((group, gi) => (
                  <div key={group.label} className="adverb-day-card" onClick={() => setSubQuizGroupIdx(gi)} style={{display:"flex",alignItems:"center",gap:14,direction:isUr?"rtl":"ltr"}}>
                    <span style={{display:"inline-flex",alignItems:"center",justifyContent:"center",minWidth:40,height:40,borderRadius:12,background:"#F59E0B22",border:"2px solid #F59E0B",color:"#F59E0B",fontSize:16,fontWeight:800,fontFamily:"'Baloo 2',sans-serif",flexShrink:0}}>{gi + 1}</span>
                    <div style={{flex:1,textAlign:isUr?"right":"left"}}>
                      <h3 style={{fontSize:16,fontWeight:700,margin:0,fontFamily:isUr?"'Noto Nastaliq Urdu',serif":"inherit"}}>{group.label}</h3>
                      <p style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 4, fontFamily:isUr?"'Noto Nastaliq Urdu',serif":"inherit" }}>{isUr?"ان دنوں کے سوالات":"Quiz questions for these days"}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={urS}>
                {activeQuizGroup && <div className="adverb-detail-section" style={{marginBottom:14,...urS}}>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:10,flexWrap:"wrap",direction:isUr?"rtl":"ltr"}}>
                    <h3 style={{color:"#F59E0B",margin:0,...urS}}>{activeQuizGroup.label}</h3>
                    <button className="play-all-btn" style={{width:"auto",marginTop:0,padding:"10px 14px",background:"linear-gradient(135deg,#475569,#334155)"}} onClick={() => setSubQuizGroupIdx(null)}>{isUr?"← دنوں کی فہرست":"← Back to Day Groups"}</button>
                  </div>
                </div>}
                {quizToRender && <MathSubQuiz key={"mq_"+mathSubIdx+"_"+subQuizGroupIdx} questions={quizToRender} isUrdu={selectedSubject?.id === "urdu"} />}
              </div>
            )
          ) : (
            <MathSubQuiz key={"mq_"+mathSubIdx} questions={sub.quiz} isUrdu={selectedSubject?.id === "urdu"} />
          )
        )}
        </>);
      })()}

      {tab === "home" && selectedLesson && !quizActive && !quizDone && selectedLesson.hasVocab && !selectedVocabDay && (<>
        <div className="lesson-detail"><h2>{selectedLesson.title}</h2><p>{selectedLesson.content}</p></div>
        <div className="tts-hint">🔊 Tap English → English voice | Tap Urdu → Urdu voice | 55 Days of Vocabulary</div>
        {VOCAB.map(day => (<div key={day.day} className="adverb-day-card" onClick={() => setSelectedVocabDay(day)}><span className="day-num">Day {day.day}</span><h3>{day.words.map(w => w.en).join(" • ")}</h3><div className="word-preview">{day.words.map((w, i) => <span key={i} className="word-chip">{w.ur}</span>)}</div></div>))}
      </>)}

      {tab === "home" && selectedLesson && !quizActive && !quizDone && selectedLesson.hasVocab && selectedVocabDay && (<>
        <div className="tts-hint">🔊 Tap English word → English voice | Tap Urdu → Urdu voice | Tap sentence → hear it!</div>
        <div className="adverb-detail-section"><h3>📝 Day {selectedVocabDay.day} — Words</h3>
          {selectedVocabDay.words.map((w, i) => (
            <div key={i} style={{ marginBottom: 10 }}>
              <WordRow en={w.en} ur={w.ur} />
              <div style={{ padding: "4px 14px", fontSize: 12, color: "var(--text-muted)", fontStyle: "italic" }}>→ {w.meaning}</div>
            </div>
          ))}
        </div>
        <div className="adverb-detail-section"><h3>📖 Practice Paragraph</h3>
          {selectedVocabDay.paragraph.split(/(?<=[.!?])\s+/).filter(Boolean).map((s, i) => {
            const sentenceHighlights = selectedVocabDay.words.map(w => w.en).filter(Boolean).filter(word => s.toLowerCase().includes(normalizeHighlightTerm(word)));
            return <SpeakableSentence key={i} text={s} lang="en" highlight={sentenceHighlights} />;
          })}
          <button className="play-all-btn" onClick={() => playAll(selectedVocabDay.paragraph)}>▶️ Play Entire Paragraph</button>
        </div>
      </>)}

      {tab === "home" && selectedLesson && !quizActive && !quizDone && selectedLesson.hasTenses && !selectedTensePara && (<>
        <div className="lesson-detail"><h2>{selectedLesson.title}</h2><p>{selectedLesson.content}</p></div>

        <div style={{ display: "flex", gap: 6, marginTop: 8, marginBottom: 10 }}>
          {[{id:"present",label:"🕐 Present",c:"#38BDF8"},{id:"past",label:"🕑 Past",c:"#F59E0B"},{id:"future",label:"🕒 Future",c:"#22C55E"}].map(t => (
            <button key={t.id} onClick={() => { setTenseMain(t.id); setTenseSub("simple"); }} style={{ flex: 1, padding: "10px 6px", borderRadius: 10, border: tenseMain === t.id ? "2px solid "+t.c : "1px solid rgba(148,163,184,0.15)", background: tenseMain === t.id ? t.c+"22" : "rgba(30,41,59,0.6)", color: tenseMain === t.id ? t.c : "#94A3B8", fontFamily: "'Baloo 2', sans-serif", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>{t.label}</button>
          ))}
        </div>

        <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
          {[{id:"simple",label:"Simple"},{id:"continuous",label:"Continuous"},{id:"perfect",label:"Perfect"},{id:"perfectContinuous",label:"Perf. Cont."}].map(t => (
            <button key={t.id} onClick={() => setTenseSub(t.id)} style={{ flex: 1, padding: "8px 3px", borderRadius: 8, border: tenseSub === t.id ? "2px solid #E879F9" : "1px solid rgba(148,163,184,0.15)", background: tenseSub === t.id ? "rgba(232,121,249,0.15)" : "rgba(30,41,59,0.6)", color: tenseSub === t.id ? "#E879F9" : "#64748B", fontFamily: "'Baloo 2', sans-serif", fontSize: 10, fontWeight: 700, cursor: "pointer" }}>{t.label}</button>
          ))}
        </div>

        {TENSES[tenseMain] && TENSES[tenseMain][tenseSub] && (<>
          <div className="adverb-detail-section" style={{ marginBottom: 12 }}>
            <h3 style={{ color: "#E879F9" }}>{TENSES[tenseMain][tenseSub].name}</h3>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", fontFamily: "var(--font-ur)", direction: "rtl", marginTop: 4 }}>{TENSES[tenseMain][tenseSub].nameUr}</p>
            <p style={{ fontSize: 12, color: "#38BDF8", marginTop: 8, fontWeight: 600, background: "rgba(56,189,248,0.08)", padding: "8px 12px", borderRadius: 8, border: "1px solid rgba(56,189,248,0.2)" }}>📐 {TENSES[tenseMain][tenseSub].formula}</p>
          </div>
          <div className="tts-hint">🔊 Tap any sentence to hear it read aloud!</div>
          {TENSES[tenseMain][tenseSub].items.map((item, i) => (
            <div key={i} className="adverb-day-card" onClick={() => setSelectedTensePara(item)}>
              <span className="day-num">Paragraph {i + 1}</span>
              <h3>{item.title}</h3>
              <p style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 4 }}>{item.para.substring(0, 80)}...</p>
            </div>
          ))}
        </>)}
      </>)}

      {tab === "home" && selectedLesson && !quizActive && !quizDone && selectedLesson.hasTenses && selectedTensePara && (<>
        <div className="tts-hint">🔊 Tap any sentence to hear it read aloud!</div>
        <div className="adverb-detail-section"><h3>📖 {selectedTensePara.title}</h3>
          {selectedTensePara.para.split(/(?<=[.!?])\s+/).filter(Boolean).map((s, i) => <SpeakableSentence key={i} text={s} lang="en" />)}
          <button className="play-all-btn" onClick={() => playAll(selectedTensePara.para)}>▶️ Play Entire Paragraph</button>
        </div>
        {selectedTensePara.qs && (<div className="adverb-detail-section"><h3>❓ Comprehension Questions</h3>
          {selectedTensePara.qs.map((q, i) => (<div key={i} style={{ padding: "10px 14px", marginBottom: 6, borderRadius: 10, border: "1px solid rgba(148,163,184,0.15)", background: "rgba(30,41,59,0.6)", fontSize: 14, color: "#F1F5F9" }}><span style={{ color: "#F59E0B", fontWeight: 700, marginRight: 8 }}>Q{i+1}.</span>{q}</div>))}
        </div>)}
      </>)}

      {tab === "home" && quizActive && !quizDone && currentQuiz.length > 0 && (<div className="quiz-container">
        <div className="quiz-progress">{currentQuiz.map((_, i) => <div key={i} className={"qp-dot" + (i < quizIdx ? " done" : i === quizIdx ? " current" : "")} />)}</div>
        <div className="quiz-question"><div className="q-num">Question {quizIdx + 1} of {currentQuiz.length}</div><h3 className={selectedSubject?.id === "urdu" ? "urdu-text" : ""}>{currentQuiz[quizIdx].q}</h3></div>
        <div className="quiz-options">{currentQuiz[quizIdx].a.map((opt, oi) => { const sel = quizAnswers[quizIdx] === oi, cor = oi === currentQuiz[quizIdx].c; let cls = "quiz-option"; if (quizRevealed && cor) cls += " correct"; else if (quizRevealed && sel && !cor) cls += " wrong"; else if (sel) cls += " selected"; return (<button key={oi} className={cls} disabled={quizRevealed} onClick={() => { if (quizRevealed) return; const na = [...quizAnswers]; na[quizIdx] = oi; setQuizAnswers(na); setQuizRevealed(true); setTimeout(() => { if (quizIdx < currentQuiz.length - 1) { setQuizIdx(quizIdx + 1); setQuizRevealed(false); } else { finishQuiz(na, currentQuiz); setQuizActive(false); } }, 1200); }}><span className="opt-letter">{"ABCD"[oi]}</span><span className={selectedSubject?.id === "urdu" ? "urdu-text" : ""}>{opt}</span></button>); })}</div>
      </div>)}

      {tab === "home" && quizDone && (<div className="quiz-result">
        <div className="result-emoji">{quizScore === 4 ? "🏆" : quizScore >= 3 ? "🌟" : quizScore >= 2 ? "👍" : "💪"}</div>
        <h2>{quizScore === 4 ? "Perfect!" : quizScore >= 3 ? "Great Job!" : quizScore >= 2 ? "Good Try!" : "Keep Practicing!"}</h2>
        <p className="score-text">You scored</p><div className={"score-big " + (quizScore >= 3 ? "high" : quizScore >= 2 ? "mid" : "low")}>{quizScore}/{currentQuiz.length}</div>
        <p className="score-text">+{quizScore * 25 + (quizScore === 4 ? 50 : 0)} XP earned</p>
        {newBadges.map(bid => { const b = BADGES.find(x => x.id === bid); return b ? <div key={bid} className="badge-earned"><span className="badge-icon">{b.icon}</span><div className="badge-info"><h4>Badge Earned: {b.name}!</h4><p>{b.desc}</p></div></div> : null; })}
        <div className="result-actions"><button className="retry-btn" onClick={() => { setQuizActive(true); setQuizDone(false); setQuizIdx(0); setQuizAnswers([]); setQuizRevealed(false); setQuizStartTime(Date.now()); setNewBadges([]); }}>🔄 Retry</button><button className="next-btn" onClick={() => { setQuizDone(false); setSelectedLesson(null); setNewBadges([]); }}>📚 More Lessons</button></div>
      </div>)}

      {tab === "progress" && (<>
        <div className="stat-grid"><div className="stat-card"><div className="stat-icon">📝</div><div className="stat-value">{totalQuizzesDone}</div><div className="stat-label">Quizzes Done</div></div><div className="stat-card"><div className="stat-icon">🎯</div><div className="stat-value">{totalQuizzesDone > 0 ? Math.round((totalScore / (totalQuizzesDone * 4)) * 100) : 0}%</div><div className="stat-label">Avg Score</div></div><div className="stat-card"><div className="stat-icon">🔥</div><div className="stat-value">{streak}</div><div className="stat-label">Day Streak</div></div><div className="stat-card"><div className="stat-icon">⭐</div><div className="stat-value">{xp}</div><div className="stat-label">Total XP</div></div></div>
        <h3 className="section-title">Subject Progress</h3>
        {SUBJECTS.map(subj => { const ls = getLessons(subj.id, grade), done = ls.filter(l => completedQuizzes[l.id]).length, pct = ls.length > 0 ? Math.round((done / ls.length) * 100) : 0; return (<div key={subj.id} className="progress-bar-container"><div className="progress-bar-label"><span>{subj.icon} {subj.name}</span><span style={{ color: "var(--text-muted)" }}>{done}/{ls.length}</span></div><div className="progress-bar-track"><div className="progress-bar-fill" style={{ width: pct + "%", background: subj.color }} /></div></div>); })}
      </>)}

      {tab === "badges" && (<><div style={{ textAlign: "center", marginBottom: 20 }}><p style={{ fontSize: 14, color: "var(--text-secondary)" }}>{earnedBadges.length} of {BADGES.length} badges earned</p></div><div className="badge-grid">{BADGES.map(b => <div key={b.id} className={"badge-card " + (earnedBadges.includes(b.id) ? "earned" : "locked")}><div className="badge-big-icon">{b.icon}</div><h4>{b.name}</h4><p>{b.desc}</p></div>)}</div></>)}

      {tab === "tutor" && (<><div className="tutor-chat">{chatMessages.map((m, i) => <div key={i} className={"chat-bubble " + (m.role === "ai" ? "ai" : "user")}>{m.text}</div>)}{chatLoading && <div className="chat-bubble ai"><div className="typing-dots"><span /><span /><span /></div></div>}<div ref={chatEndRef} /></div><div className="chat-input-area"><input value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendChat()} placeholder="Ask your tutor anything..." /><button onClick={sendChat} disabled={chatLoading}>➤</button></div></>)}

      {tab === "settings" && (<><div className="settings-item"><span className="si-label">👤 Student Name</span><span className="si-value">{studentName || "Not set"}</span></div><div className="settings-item"><span className="si-label">📚 Current Grade</span><span className="si-value">Grade {grade}</span></div><h3 className="section-title" style={{ marginTop: 20 }}>Change Grade</h3><div className="grade-grid">{GRADES.map(g => <button key={g.id} className={"grade-btn " + (g.id === grade ? "active" : "")} onClick={() => setGrade(g.id)}>{g.id}</button>)}</div><button className="reset-btn" onClick={() => { if (confirm("Reset all progress?")) { setCompletedQuizzes({}); setTotalScore(0); setTotalQuizzesDone(0); setStreak(0); setLastQuizDate(null); setEarnedBadges([]); setXp(0); setNewBadges([]); } }}>🗑️ Reset All Progress</button>
        <h3 className="section-title" style={{ marginTop: 20 }}>📦 Database</h3>
        <div className="settings-item"><span className="si-label">💾 Storage</span><span className="si-value">IndexedDB (Dexie)</span></div>
        <button style={{ width:"100%",padding:"12px",borderRadius:10,border:"1px solid rgba(56,189,248,0.3)",background:"rgba(56,189,248,0.1)",color:"#38BDF8",fontFamily:"'Baloo 2',sans-serif",fontSize:13,fontWeight:700,cursor:"pointer",marginBottom:8 }} onClick={async()=>{if(window.HomeSchoolDB){const s=await window.HomeSchoolDB.getStats();alert("DB Records:\\nParts of Speech: "+s.posData+"\\nTenses: "+s.tensesData+"\\nVocabulary: "+s.vocabData+"\\nMath Chapters: "+s.mathChapters+"\\nQuizzes: "+s.quizData+"\\nCustomizations: "+s.customizations);}}}>📊 View DB Stats</button>
        <button style={{ width:"100%",padding:"12px",borderRadius:10,border:"1px solid rgba(34,197,94,0.3)",background:"rgba(34,197,94,0.1)",color:"#22C55E",fontFamily:"'Baloo 2',sans-serif",fontSize:13,fontWeight:700,cursor:"pointer",marginBottom:8 }} onClick={async()=>{if(window.HomeSchoolDB){const d=await window.HomeSchoolDB.exportAll();const b=new Blob([JSON.stringify(d,null,2)],{type:"application/json"});const a=document.createElement("a");a.href=URL.createObjectURL(b);a.download="homeschool-backup.json";a.click();}}}>💾 Export Backup</button>
        <button style={{ width:"100%",padding:"12px",borderRadius:10,border:"1px solid rgba(239,68,68,0.3)",background:"rgba(239,68,68,0.1)",color:"#EF4444",fontFamily:"'Baloo 2',sans-serif",fontSize:13,fontWeight:700,cursor:"pointer" }} onClick={()=>{if(confirm("Reset database? All customizations will be lost. The app will reload and re-seed from defaults.")){window.HomeSchoolDB?.resetDB();}}}>🔄 Reset Database</button>
      </>)}
    </div>
    <div className="bottom-nav">{[{ id: "home", icon: "🏠", label: "Home" }, { id: "progress", icon: "📊", label: "Progress" }, { id: "badges", icon: "🏆", label: "Badges" }, { id: "tutor", icon: "🤖", label: "Tutor" }, { id: "settings", icon: "⚙️", label: "Settings" }].map(item => <button key={item.id} className={"nav-item " + (tab === item.id ? "active" : "")} onClick={() => { if (item.id === "home") { goHome(); return; } window.speechSynthesis.cancel(); setTab(item.id); setSelectedSubject(null); setSelectedLesson(null); setQuizActive(false); setQuizDone(false); setSelectedAdverbDay(null); setSelectedPrepDay(null); setSelectedAdjDay(null); setSelectedConjDay(null); setSelectedPronDay(null); setSelectedNounDay(null); setSelectedVerbDay(null); setSelectedTensePara(null); setSelectedVocabDay(null); setMathSubIdx(null); setMathSubTab("examples"); setSubExerciseGroupIdx(null); setSubQuizGroupIdx(null); setRevealedEx({}); setPosTab("adverbs"); setTenseMain("present"); setTenseSub("simple"); }}><span className="nav-icon">{item.icon}</span>{item.label}</button>)}</div>
  </div></>);
}
