(() => {
  "use strict";

  window.HomeSchoolLessonModules = window.HomeSchoolLessonModules || {};
  window.HomeSchoolLessonModules.math = window.HomeSchoolLessonModules.math || {};
  window.HomeSchoolLessonModules.math[5] = [
  {
    "title": "Whole Numbers",
    "content": "Place value up to millions and beyond. Expanded form of numbers. Comparing and ordering numbers. Rounding numbers to nearest 10, 100, 1000. Number lines.",
    "key": "whole_numbers",
    "hasMathSub": true,
    "subs": [
      {
        "t": "Place Value",
        "c": "Every digit in a number has a place value based on its position. The farther left a digit is, the greater its value.",
        "svgType": "placeValue",
        "svgData": {
          "number": "5,432,187"
        },
        "examples": [
          "In 5,432,187 — 5 is in the Millions place (5,000,000)",
          "4 is in the Hundred-Thousands place (400,000)",
          "3 is in the Ten-Thousands place (30,000)",
          "2 is in the Thousands place (2,000)",
          "1 is in the Hundreds place (100)",
          "8 is in the Tens place (80)",
          "7 is in the Ones place (7)"
        ],
        "exercises": [
          {
            "q": "Write the place value of the underlined digit:",
            "parts": [
              "[4]52,301 → ?",
              "7,[8]21,456 → ?",
              "1,234,[5]67 → ?",
              "[9],000,000 → ?",
              "56,7[8]9 → ?",
              "3,4[5]6,789 → ?"
            ],
            "ans": [
              "400,000",
              "800,000",
              "500",
              "9,000,000",
              "80",
              "50,000"
            ]
          },
          {
            "q": "What is the value of digit 6 in each number?",
            "parts": [
              "6,543,210",
              "1,265,000",
              "45,600",
              "3,456",
              "890,006",
              "162,345"
            ],
            "ans": [
              "6,000,000",
              "60,000",
              "600",
              "6",
              "6",
              "60,000"
            ]
          },
          {
            "q": "Which digit is in the ten-thousands place?",
            "parts": [
              "4,523,100",
              "789,654",
              "12,345,678",
              "56,789",
              "901,234",
              "3,456,789"
            ],
            "ans": [
              "2",
              "8",
              "4",
              "5",
              "0",
              "5"
            ]
          },
          {
            "q": "Write the number in which 7 is in the given place:",
            "parts": [
              "7 in ones place",
              "7 in tens place",
              "7 in hundreds place",
              "7 in thousands place",
              "7 in ten-thousands place",
              "7 in hundred-thousands place"
            ],
            "ans": [
              "___7",
              "__7_",
              "_7__",
              "7,___",
              "_7_,___",
              "7__,___"
            ]
          },
          {
            "q": "True or False:",
            "parts": [
              "In 45,678 the digit 4 is in ten-thousands place",
              "In 123,456 the digit 3 is in hundreds place",
              "In 9,876,543 the digit 8 is in millions place",
              "In 500,000 the digit 5 is in hundred-thousands place",
              "The ones place is always the leftmost digit"
            ],
            "ans": [
              "True",
              "False — it's in thousands",
              "False — it's in hundred-thousands",
              "True",
              "False — it's the rightmost"
            ]
          }
        ],
        "wordProblems": [
          "Pakistan's population is about 240,000,000. What is the place value of 2 in this number?",
          "A library has 123,456 books. What is the place value of 3 in this number?",
          "The distance from Earth to Moon is about 384,400 km. What digit is in the ten-thousands place?",
          "Ali's father earns Rs 250,000 per month. What is the place value of 5?",
          "A school collected 45,678 bottle caps. What is the value of the digit 4?"
        ],
        "quiz": [
          {
            "q": "What is the place value of 3 in 4,356,789?",
            "a": [
              "3,000",
              "30,000",
              "300,000",
              "3,000,000"
            ],
            "c": 2
          },
          {
            "q": "Which digit is in the millions place in 7,654,321?",
            "a": [
              "1",
              "4",
              "6",
              "7"
            ],
            "c": 3
          },
          {
            "q": "The value of 8 in 180,000 is:",
            "a": [
              "8,000",
              "80,000",
              "800",
              "8"
            ],
            "c": 1
          },
          {
            "q": "In 9,123,456 — what place is digit 1 in?",
            "a": [
              "Millions",
              "Hundred-thousands",
              "Ten-thousands",
              "Thousands"
            ],
            "c": 1
          },
          {
            "q": "How many zeros in one million?",
            "a": [
              "5",
              "6",
              "7",
              "8"
            ],
            "c": 1
          },
          {
            "q": "The place value of 0 in 504,321 is:",
            "a": [
              "0",
              "4,000",
              "40,000",
              "None"
            ],
            "c": 0
          },
          {
            "q": "Which number has 5 in the ten-thousands place?",
            "a": [
              "5,234",
              "52,340",
              "523,400",
              "500"
            ],
            "c": 1
          },
          {
            "q": "300,000 in words is:",
            "a": [
              "Thirty thousand",
              "Three hundred thousand",
              "Three million",
              "Three billion"
            ],
            "c": 1
          }
        ]
      },
      {
        "t": "Expanded Form",
        "c": "Expanded form shows the value of each digit separately, added together.",
        "svgType": "expandedForm",
        "svgData": {
          "number": "4,523",
          "parts": [
            "4,000",
            "500",
            "20",
            "3"
          ]
        },
        "examples": [
          "4,523 = 4,000 + 500 + 20 + 3",
          "56,789 = 50,000 + 6,000 + 700 + 80 + 9",
          "123,456 = 100,000 + 20,000 + 3,000 + 400 + 50 + 6",
          "900,000 = 900,000 + 0 + 0 + 0 + 0 + 0",
          "345,678 = 300,000 + 40,000 + 5,000 + 600 + 70 + 8",
          "1,050,000 = 1,000,000 + 50,000"
        ],
        "exercises": [
          {
            "q": "Write in expanded form:",
            "parts": [
              "7,891",
              "34,567",
              "123,000",
              "505,050",
              "89,012",
              "678,901",
              "1,234,567",
              "40,008"
            ],
            "ans": [
              "7,000+800+90+1",
              "30,000+4,000+500+60+7",
              "100,000+20,000+3,000",
              "500,000+5,000+50",
              "80,000+9,000+10+2",
              "600,000+70,000+8,000+900+1",
              "1,200,000+30,000+4,000+500+60+7",
              "40,000+8"
            ]
          },
          {
            "q": "Write in standard form:",
            "parts": [
              "6,000+400+30+2",
              "50,000+3,000+200+10+5",
              "100,000+40,000+500+60",
              "900,000+8,000+7",
              "20,000+300+4",
              "300,000+50,000+1,000+200+30+4"
            ],
            "ans": [
              "6,432",
              "53,215",
              "140,560",
              "908,007",
              "20,304",
              "351,234"
            ]
          },
          {
            "q": "Fill in the blanks:",
            "parts": [
              "4,567 = 4,000 + ___ + 60 + 7",
              "23,456 = 20,000 + ___ + 400 + 56",
              "150,000 = ___ + 50,000",
              "78,901 = 70,000 + 8,000 + ___ + 1",
              "505,005 = 500,000 + ___ + 5"
            ],
            "ans": [
              "500",
              "3,000",
              "100,000",
              "900",
              "5,000"
            ]
          },
          {
            "q": "True or False:",
            "parts": [
              "4,523 = 4,000 + 500 + 20 + 3",
              "7,890 = 7,000 + 800 + 9",
              "10,000 = 1,000 + 0,000",
              "56,070 = 50,000 + 6,000 + 70",
              "99,999 = 90,000 + 9,000 + 900 + 90 + 9"
            ],
            "ans": [
              "True",
              "False — should be +90",
              "False — 10,000 is standard",
              "True",
              "True"
            ]
          }
        ],
        "wordProblems": [
          "A farmer has 12,345 mangoes. Write this number in expanded form.",
          "The price of a car is Rs 567,890. Write in expanded form.",
          "A village has 23,045 people. Show in expanded form. Why is there no thousands term?",
          "A school raised Rs 105,000 for charity. Write in expanded form.",
          "The height of K2 is 8,611 meters. Write in expanded form."
        ],
        "quiz": [
          {
            "q": "Expanded form of 3,456 is:",
            "a": [
              "3+4+5+6",
              "3,000+400+50+6",
              "3,456+0",
              "30+40+50+6"
            ],
            "c": 1
          },
          {
            "q": "Standard form of 50,000+6,000+200+30+1:",
            "a": [
              "5,623",
              "56,231",
              "50,631",
              "5,06,231"
            ],
            "c": 1
          },
          {
            "q": "Which is the expanded form of 10,050?",
            "a": [
              "10,000+50",
              "1,000+50",
              "10,000+500",
              "100+50"
            ],
            "c": 0
          },
          {
            "q": "Fill in: 78,_02 = 70,000+8,000+___+2",
            "a": [
              "0",
              "100",
              "200",
              "9"
            ],
            "c": 0
          },
          {
            "q": "How many terms in expanded form of 40,008?",
            "a": [
              "2",
              "3",
              "4",
              "5"
            ],
            "c": 0
          },
          {
            "q": "900,000+50,000+3,000+400+20+1 = ?",
            "a": [
              "9,53,421",
              "95,3421",
              "9,05,321",
              "90,53,421"
            ],
            "c": 0
          },
          {
            "q": "Expanded form of 100,000 has how many non-zero terms?",
            "a": [
              "1",
              "5",
              "6",
              "0"
            ],
            "c": 0
          },
          {
            "q": "Which number has expanded form: 20,000+5,000+60+3?",
            "a": [
              "2,563",
              "25,630",
              "25,063",
              "20,563"
            ],
            "c": 2
          }
        ]
      },
      {
        "t": "Comparing & Ordering",
        "c": "To compare numbers, check digit count first. If same, compare from left to right. Use > (greater), < (less), = (equal).",
        "svgType": "compare",
        "svgData": {
          "num1": 5432,
          "num2": 4999
        },
        "examples": [
          "5,432 > 4,999 — because 5 thousands > 4 thousands",
          "12,345 < 12,456 — same up to hundreds, then 3 < 4",
          "99,999 < 100,000 — 5 digits < 6 digits",
          "5,678 = 5,678 — same number",
          "Order: 4,521 < 5,123 < 5,234 < 6,001 < 6,100",
          "67,890 > 67,809 — tens place: 9 > 0"
        ],
        "exercises": [
          {
            "q": "Write >, < or = :",
            "parts": [
              "4,567 ___ 4,576",
              "12,345 ___ 12,345",
              "99,999 ___ 100,000",
              "56,789 ___ 56,798",
              "123,456 ___ 123,465",
              "45,000 ___ 44,999",
              "8,901 ___ 9,001",
              "333,333 ___ 333,333"
            ],
            "ans": [
              "<",
              "=",
              "<",
              "<",
              "<",
              ">",
              "<",
              "="
            ]
          },
          {
            "q": "Arrange in ascending order (smallest to largest):",
            "parts": [
              "5,432; 3,210; 4,567; 1,234",
              "45,678; 43,210; 45,123; 44,000",
              "100,000; 99,999; 100,001; 98,765",
              "7,890; 7,980; 7,809; 7,908",
              "23,456; 24,356; 23,465; 24,365"
            ],
            "ans": [
              "1,234 < 3,210 < 4,567 < 5,432",
              "43,210 < 44,000 < 45,123 < 45,678",
              "98,765 < 99,999 < 100,000 < 100,001",
              "7,809 < 7,890 < 7,908 < 7,980",
              "23,456 < 23,465 < 24,356 < 24,365"
            ]
          },
          {
            "q": "Arrange in descending order (largest to smallest):",
            "parts": [
              "6,543; 5,678; 7,890; 4,321",
              "34,567; 35,467; 34,657; 35,476",
              "250,000; 245,000; 255,000; 249,999"
            ],
            "ans": [
              "7,890 > 6,543 > 5,678 > 4,321",
              "35,476 > 35,467 > 34,657 > 34,567",
              "255,000 > 250,000 > 249,999 > 245,000"
            ]
          },
          {
            "q": "Write the greatest and smallest number using digits:",
            "parts": [
              "3, 7, 1, 5",
              "9, 0, 4, 6, 2",
              "8, 3, 5, 1, 0",
              "6, 6, 2, 2",
              "5, 0, 0, 5, 0"
            ],
            "ans": [
              "Greatest: 7,531 Smallest: 1,357",
              "Greatest: 96,420 Smallest: 20,469",
              "Greatest: 85,310 Smallest: 10,358",
              "Greatest: 6,622 Smallest: 2,266",
              "Greatest: 55,000 Smallest: 5,005"
            ]
          }
        ],
        "wordProblems": [
          "Ali scored 45,678 points and Sara scored 45,768 points. Who scored more?",
          "Three cities have populations: Lahore 1,1,200,000; Karachi 1,4900,000; Islamabad 1100,000. Arrange from largest to smallest.",
          "A factory produced 23,456 items in January and 23,465 in February. Which month had more production?",
          "The heights of three mountains are: 8,611m, 8,586m, 8,516m. Arrange in ascending order.",
          "Two shops earned Rs 567,890 and Rs 567,980. Which shop earned more?"
        ],
        "quiz": [
          {
            "q": "Which is greater: 45,678 or 45,876?",
            "a": [
              "45,678",
              "45,876",
              "Equal",
              "Cannot tell"
            ],
            "c": 1
          },
          {
            "q": "Arrange ascending: 7,890; 7,089; 7,908",
            "a": [
              "7,890; 7,089; 7,908",
              "7,089; 7,890; 7,908",
              "7,908; 7,890; 7,089",
              "7,089; 7,908; 7,890"
            ],
            "c": 1
          },
          {
            "q": "The smallest 5-digit number is:",
            "a": [
              "99,999",
              "10,000",
              "10,001",
              "00,001"
            ],
            "c": 1
          },
          {
            "q": "Which symbol: 123,456 ___ 132,456",
            "a": [
              ">",
              "<",
              "=",
              "≠"
            ],
            "c": 1
          },
          {
            "q": "Greatest number from digits 4,0,8,2:",
            "a": [
              "8,420",
              "8,402",
              "8,240",
              "8,042"
            ],
            "c": 0
          },
          {
            "q": "Which is the largest? 99,999; 100,000; 98,765",
            "a": [
              "99,999",
              "100,000",
              "98,765",
              "All equal"
            ],
            "c": 1
          },
          {
            "q": "Descending order of 345, 543, 354, 435:",
            "a": [
              "543>435>354>345",
              "543>435>345>354",
              "345<354<435<543",
              "435>543>354>345"
            ],
            "c": 0
          },
          {
            "q": "Smallest number with digits 5,5,0,0:",
            "a": [
              "5,500",
              "5,050",
              "5,005",
              "55"
            ],
            "c": 2
          }
        ]
      },
      {
        "t": "Rounding Numbers",
        "c": "Rounding makes numbers simpler. Look at the digit to the right of the place you're rounding to. If 5 or more → round up. If less than 5 → round down.",
        "svgType": "rounding",
        "svgData": {
          "number": 4567,
          "place": "100",
          "result": 4600,
          "direction": "up"
        },
        "examples": [
          "4,567 rounded to nearest 10 → 4,570 (7≥5, round up)",
          "4,567 rounded to nearest 100 → 4,600 (6≥5, round up)",
          "4,567 rounded to nearest 1,000 → 5,000 (5≥5, round up)",
          "3,421 rounded to nearest 10 → 3,420 (1<5, round down)",
          "3,421 rounded to nearest 100 → 3,400 (2<5, round down)",
          "3,421 rounded to nearest 1,000 → 3,000 (4<5, round down)",
          "7,850 rounded to nearest 100 → 7,900 (5≥5, round up)",
          "99,950 rounded to nearest 100 → 100,000"
        ],
        "exercises": [
          {
            "q": "Round to the nearest 10:",
            "parts": [
              "4,563",
              "7,895",
              "1,234",
              "9,998",
              "456",
              "12,345",
              "67,891",
              "50,005"
            ],
            "ans": [
              "4,560",
              "7,900",
              "1,230",
              "10,000",
              "460",
              "12,350",
              "67,890",
              "50,010"
            ]
          },
          {
            "q": "Round to the nearest 100:",
            "parts": [
              "4,567",
              "7,850",
              "1,234",
              "9,950",
              "3,456",
              "12,345",
              "67,891",
              "99,960"
            ],
            "ans": [
              "4,600",
              "7,900",
              "1,200",
              "10,000",
              "3,500",
              "12,300",
              "67,900",
              "100,000"
            ]
          },
          {
            "q": "Round to the nearest 1,000:",
            "parts": [
              "4,567",
              "7,500",
              "1,234",
              "9,500",
              "23,456",
              "67,891",
              "1,45,678",
              "5,00,500"
            ],
            "ans": [
              "5,000",
              "8,000",
              "1,000",
              "10,000",
              "23,000",
              "68,000",
              "1,46,000",
              "5,01,000"
            ]
          },
          {
            "q": "True or False:",
            "parts": [
              "4,567 rounded to nearest 10 is 4,570",
              "8,945 rounded to nearest 100 is 8,900",
              "12,500 rounded to nearest 1,000 is 13,000",
              "99,999 rounded to nearest 10 is 100,000",
              "5,555 rounded to nearest 100 is 5,600"
            ],
            "ans": [
              "True",
              "False — should be 8,900... wait, 4<5 so 8,900 is correct. True",
              "True",
              "False — it's 100,000. True",
              "True"
            ]
          }
        ],
        "wordProblems": [
          "A school has 1,267 students. Round to the nearest hundred for the report.",
          "The cost of a laptop is Rs 78,450. Round to the nearest thousand.",
          "A marathon is 42,195 meters. Round to the nearest 100 meters.",
          "A city has 345,678 people. Round to the nearest ten-thousand.",
          "Ali drove 567 km. Round to nearest 10 km."
        ],
        "quiz": [
          {
            "q": "4,567 rounded to nearest 100 is:",
            "a": [
              "4,500",
              "4,600",
              "4,570",
              "5,000"
            ],
            "c": 1
          },
          {
            "q": "Round 8,945 to nearest 1,000:",
            "a": [
              "8,000",
              "9,000",
              "8,900",
              "8,950"
            ],
            "c": 1
          },
          {
            "q": "Round 12,500 to nearest 1,000:",
            "a": [
              "12,000",
              "13,000",
              "12,500",
              "10,000"
            ],
            "c": 1
          },
          {
            "q": "Which rounds to 5,000?",
            "a": [
              "5,600",
              "4,400",
              "4,501",
              "5,500"
            ],
            "c": 2
          },
          {
            "q": "Round 99,950 to nearest 100:",
            "a": [
              "99,900",
              "100,000",
              "99,000",
              "99,950"
            ],
            "c": 1
          },
          {
            "q": "7,350 rounded to nearest 10:",
            "a": [
              "7,400",
              "7,350",
              "7,360",
              "7,300"
            ],
            "c": 1
          },
          {
            "q": "What is 45,678 rounded to nearest 10,000?",
            "a": [
              "40,000",
              "50,000",
              "45,000",
              "46,000"
            ],
            "c": 1
          },
          {
            "q": "Round 999 to nearest 100:",
            "a": [
              "900",
              "990",
              "1,000",
              "1,100"
            ],
            "c": 2
          }
        ]
      },
      {
        "t": "Number Lines",
        "c": "A number line is a straight line with numbers placed at equal intervals. It helps visualize number positions, addition, subtraction, and comparing.",
        "svgType": "numberLine",
        "svgData": {
          "min": 0,
          "max": 100,
          "marks": [
            0,
            10,
            20,
            30,
            40,
            50,
            60,
            70,
            80,
            90,
            100
          ],
          "highlight": [
            25,
            50,
            75
          ]
        },
        "examples": [
          "On a 0 to 100 line, 50 is exactly in the middle",
          "On a 0 to 1000 line, 250 is one-quarter of the way",
          "Numbers increase to the right, decrease to the left",
          "The distance between 30 and 50 is 20 units",
          "To add 3+4 on a number line: start at 3, jump 4 to the right → land on 7",
          "To subtract 8-3: start at 8, jump 3 to the left → land on 5"
        ],
        "exercises": [
          {
            "q": "Mark these numbers on a 0 to 100 number line:",
            "parts": [
              "25",
              "50",
              "75",
              "10",
              "90",
              "33",
              "67",
              "5"
            ],
            "ans": [
              "¼ of the way",
              "½ way",
              "¾ of the way",
              "1/10 of the way",
              "near the end",
              "⅓ of the way",
              "⅔ of the way",
              "very near 0"
            ]
          },
          {
            "q": "What number is halfway between:",
            "parts": [
              "0 and 100",
              "20 and 40",
              "100 and 200",
              "50 and 150",
              "0 and 1,000",
              "400 and 600"
            ],
            "ans": [
              "50",
              "30",
              "150",
              "100",
              "500",
              "500"
            ]
          },
          {
            "q": "Which is closer to 50 on a number line?",
            "parts": [
              "45 or 60",
              "30 or 55",
              "48 or 53",
              "10 or 80",
              "49 or 52",
              "25 or 70"
            ],
            "ans": [
              "45 (5 away vs 10)",
              "55 (5 away vs 20)",
              "48 (2 away vs 3)",
              "Neither — both 40 away",
              "49 (1 away vs 2)",
              "25 (25 away vs 20) → 70"
            ]
          },
          {
            "q": "Find the missing number on the number line:",
            "parts": [
              "0, 10, 20, __, 40, 50",
              "0, 25, 50, __, 100",
              "100, 200, __, 400, 500",
              "0, 5, __, 15, 20",
              "1000, 2000, __, 4000, 5000"
            ],
            "ans": [
              "30",
              "75",
              "300",
              "10",
              "3000"
            ]
          }
        ],
        "wordProblems": [
          "On a road from City A (0 km) to City B (100 km), a petrol station is at the halfway point. At what km is it?",
          "A thermometer shows 0°C to 50°C. If the temperature is halfway, what is it?",
          "On a ruler from 0 to 30 cm, where would you mark 15 cm?",
          "Ali walked from 0 to 200 meters. He stopped after covering three-quarters. How far did he walk?",
          "A number line shows 0 to 1,000. Where would 333 be approximately?"
        ],
        "quiz": [
          {
            "q": "What number is halfway between 0 and 100?",
            "a": [
              "25",
              "50",
              "75",
              "100"
            ],
            "c": 1
          },
          {
            "q": "On a number line, which is farther from 50?",
            "a": [
              "45",
              "55",
              "30",
              "48"
            ],
            "c": 2
          },
          {
            "q": "What is halfway between 200 and 400?",
            "a": [
              "250",
              "300",
              "350",
              "400"
            ],
            "c": 1
          },
          {
            "q": "Missing: 0, 250, 500, ___, 1000",
            "a": [
              "600",
              "700",
              "750",
              "800"
            ],
            "c": 2
          },
          {
            "q": "On a 0 to 1000 line, 100 is at:",
            "a": [
              "One-half",
              "One-quarter",
              "One-tenth",
              "One-fifth"
            ],
            "c": 2
          },
          {
            "q": "Numbers increase in which direction on a number line?",
            "a": [
              "Left",
              "Right",
              "Up",
              "Down"
            ],
            "c": 1
          },
          {
            "q": "Distance between 30 and 80 on number line:",
            "a": [
              "30",
              "50",
              "80",
              "110"
            ],
            "c": 1
          },
          {
            "q": "Which number is closest to 0 on a number line?",
            "a": [
              "99",
              "50",
              "12",
              "1"
            ],
            "c": 3
          }
        ]
      }
    ],
    "id": "math_5_0"
  },
  {
    "title": "Addition & Subtraction",
    "content": "Multi-digit addition and subtraction. Carrying and borrowing techniques. Estimation of sums and differences. Word problems.",
    "key": "add_sub5",
    "hasMathSub": true,
    "subs": [
      {
        "t": "Multi-digit Addition",
        "c": "When adding large numbers, line up the digits by place value. Start from the ones column. If a column adds to 10 or more, carry the extra to the next column.",
        "svgType": "columnAdd",
        "svgData": {
          "num1": 4567,
          "num2": 3845,
          "result": 8412
        },
        "examples": [
          "4,567 + 3,845 = 8,412",
          "12,345 + 7,655 = 20,000",
          "56,789 + 43,211 = 100,000",
          "1,234 + 5,678 = 6,912",
          "99,999 + 1 = 100,000",
          "345 + 2,655 = 3,000",
          "8,050 + 1,950 = 10,000"
        ],
        "exercises": [
          {
            "q": "Add the following:",
            "parts": [
              "4,567 + 3,845",
              "12,345 + 7,655",
              "56,789 + 43,211",
              "23,456 + 34,567",
              "1,234 + 8,766",
              "45,678 + 54,322",
              "99,001 + 999",
              "67,890 + 32,110"
            ],
            "ans": [
              "8,412",
              "20,000",
              "100,000",
              "58,023",
              "10,000",
              "100,000",
              "100,000",
              "100,000"
            ]
          },
          {
            "q": "Find the sum:",
            "parts": [
              "345 + 2,655",
              "8,050 + 1,950",
              "15,000 + 25,000",
              "4,321 + 5,679",
              "78,654 + 11,346",
              "234 + 5,766"
            ],
            "ans": [
              "3,000",
              "10,000",
              "40,000",
              "10,000",
              "90,000",
              "6,000"
            ]
          },
          {
            "q": "Fill in the missing number:",
            "parts": [
              "4,567 + ___ = 10,000",
              "___ + 3,456 = 8,000",
              "25,000 + ___ = 50,000",
              "___ + 45,678 = 100,000",
              "1,234 + ___ = 5,000"
            ],
            "ans": [
              "5,433",
              "4,544",
              "25,000",
              "54,322",
              "3,766"
            ]
          },
          {
            "q": "True or False:",
            "parts": [
              "4,567 + 3,845 = 8,412",
              "12,345 + 7,655 = 19,000",
              "99,999 + 1 = 100,000",
              "50,000 + 50,000 = 100,000",
              "1,234 + 5,678 = 6,812"
            ],
            "ans": [
              "True",
              "False — it's 20,000",
              "True",
              "True",
              "False — it's 6,912"
            ]
          }
        ],
        "wordProblems": [
          "A school has 12,345 boys and 11,678 girls. How many students are there in total?",
          "Ali saved Rs 4,567 in January and Rs 3,845 in February. How much did he save in total?",
          "A factory produced 56,789 items in March and 43,211 in April. Find the total production.",
          "Town A has 34,567 people and Town B has 45,433 people. What is the combined population?",
          "A farmer harvested 8,050 kg of wheat and 1,950 kg of rice. Find the total harvest."
        ],
        "quiz": [
          {
            "q": "4,567 + 3,845 = ?",
            "a": [
              "7,412",
              "8,312",
              "8,412",
              "8,512"
            ],
            "c": 2
          },
          {
            "q": "12,345 + 7,655 = ?",
            "a": [
              "19,000",
              "20,000",
              "21,000",
              "19,900"
            ],
            "c": 1
          },
          {
            "q": "99,999 + 1 = ?",
            "a": [
              "99,000",
              "100,000",
              "100,001",
              "99,999"
            ],
            "c": 1
          },
          {
            "q": "What is 56,789 + 43,211?",
            "a": [
              "99,000",
              "100,000",
              "99,900",
              "100,100"
            ],
            "c": 1
          },
          {
            "q": "4,567 + ___ = 10,000",
            "a": [
              "5,433",
              "5,333",
              "5,543",
              "6,433"
            ],
            "c": 0
          },
          {
            "q": "Which sum equals 100,000?",
            "a": [
              "45,678 + 54,322",
              "45,678 + 55,322",
              "44,678 + 54,322",
              "45,678 + 54,222"
            ],
            "c": 0
          },
          {
            "q": "1,234 + 5,678 = ?",
            "a": [
              "6,812",
              "6,912",
              "7,012",
              "6,902"
            ],
            "c": 1
          },
          {
            "q": "25,000 + 25,000 = ?",
            "a": [
              "40,000",
              "45,000",
              "50,000",
              "55,000"
            ],
            "c": 2
          }
        ]
      },
      {
        "t": "Carrying & Borrowing",
        "c": "Carrying happens in addition when a column adds to 10 or more. Borrowing happens in subtraction when the top digit is smaller than the bottom digit. You take 1 from the next column.",
        "svgType": "columnSub",
        "svgData": {
          "num1": 7003,
          "num2": 2458,
          "result": 4545
        },
        "examples": [
          "478 + 356: ones 8 + 6 = 14, write 4 carry 1. Tens 7 + 5 + 1 = 13, write 3 carry 1. Hundreds 4 + 3 + 1 = 8. Answer: 834",
          "7,003 - 2,458: borrow across zeros. 3 can't subtract 8, borrow from thousands. Answer: 4,545",
          "5,000 - 1,234: borrow from 5. Answer: 3,766",
          "9,100 - 4,567: borrow step by step. Answer: 4,533",
          "6,204 - 3,578: borrow across the 0. Answer: 2,626",
          "800 - 367: borrow twice. Answer: 433"
        ],
        "exercises": [
          {
            "q": "Subtract (practice borrowing):",
            "parts": [
              "7,003 - 2,458",
              "5,000 - 1,234",
              "9,100 - 4,567",
              "6,204 - 3,578",
              "800 - 367",
              "10,000 - 4,567",
              "3,001 - 1,456",
              "8,000 - 2,999"
            ],
            "ans": [
              "4,545",
              "3,766",
              "4,533",
              "2,626",
              "433",
              "5,433",
              "1,545",
              "5,001"
            ]
          },
          {
            "q": "Add with carrying:",
            "parts": [
              "4,789 + 6,345",
              "8,967 + 3,456",
              "5,555 + 4,445",
              "7,896 + 2,345",
              "9,876 + 5,678",
              "3,999 + 6,001"
            ],
            "ans": [
              "11,134",
              "12,423",
              "10,000",
              "10,241",
              "15,554",
              "10,000"
            ]
          },
          {
            "q": "Fill in the blank:",
            "parts": [
              "10,000 - ___ = 4,567",
              "___ - 3,456 = 2,544",
              "8,000 - ___ = 3,765",
              "___ - 1,999 = 5,001",
              "5,000 - ___ = 2,350"
            ],
            "ans": [
              "5,433",
              "6,000",
              "4,235",
              "7,000",
              "2,650"
            ]
          },
          {
            "q": "True or False:",
            "parts": [
              "7,003 - 2,458 = 4,545",
              "5,000 - 1,234 = 3,866",
              "10,000 - 4,567 = 5,433",
              "800 - 367 = 433",
              "9,100 - 4,567 = 4,633"
            ],
            "ans": [
              "True",
              "False — it's 3,766",
              "True",
              "True",
              "False — it's 4,533"
            ]
          }
        ],
        "wordProblems": [
          "A shopkeeper had Rs 10,000. He spent Rs 4,567 on supplies. How much money is left?",
          "A water tank holds 8,000 liters. 2,999 liters were used. How many liters remain?",
          "A school had 5,000 notebooks. They distributed 3,765 to students. How many are left?",
          "Ali had 7,003 stamps. He gave 2,458 to his friend. How many stamps does Ali have now?",
          "A bus can carry 60 passengers. If 47 are on board, how many more can get on?"
        ],
        "quiz": [
          {
            "q": "7,003 - 2,458 = ?",
            "a": [
              "4,445",
              "4,545",
              "4,645",
              "4,555"
            ],
            "c": 1
          },
          {
            "q": "5,000 - 1,234 = ?",
            "a": [
              "3,866",
              "3,766",
              "3,676",
              "3,776"
            ],
            "c": 1
          },
          {
            "q": "10,000 - 4,567 = ?",
            "a": [
              "5,433",
              "5,333",
              "5,533",
              "6,433"
            ],
            "c": 0
          },
          {
            "q": "When do you need to borrow?",
            "a": [
              "Top digit is bigger",
              "Top digit is smaller",
              "Digits are equal",
              "Never"
            ],
            "c": 1
          },
          {
            "q": "800 - 367 = ?",
            "a": [
              "433",
              "443",
              "533",
              "333"
            ],
            "c": 0
          },
          {
            "q": "What is carrying?",
            "a": [
              "Moving digits left",
              "Writing extra when sum ≥ 10",
              "Removing zeros",
              "Skipping columns"
            ],
            "c": 1
          },
          {
            "q": "9,100 - 4,567 = ?",
            "a": [
              "4,433",
              "4,533",
              "4,633",
              "4,333"
            ],
            "c": 1
          },
          {
            "q": "6,204 - 3,578 = ?",
            "a": [
              "2,626",
              "2,726",
              "2,526",
              "3,626"
            ],
            "c": 0
          }
        ]
      },
      {
        "t": "Estimation",
        "c": "Estimation means finding an approximate answer quickly. Round each number to the nearest thousand or hundred first, then add or subtract. It helps you check if your exact answer makes sense.",
        "svgType": "estimation",
        "svgData": {
          "num1": 4892,
          "num2": 3107,
          "op": "+",
          "rounded1": 5000,
          "rounded2": 3000,
          "estimate": 8000,
          "exact": 7999
        },
        "examples": [
          "4,892 + 3,107 ≈ 5,000 + 3,000 = 8,000 (exact: 7,999)",
          "7,823 - 2,198 ≈ 8,000 - 2,000 = 6,000 (exact: 5,625)",
          "12,456 + 8,544 ≈ 12,000 + 9,000 = 21,000 (exact: 21,000)",
          "9,876 - 4,321 ≈ 10,000 - 4,000 = 6,000 (exact: 5,555)",
          "45,678 + 23,456 ≈ 46,000 + 23,000 = 69,000 (exact: 69,134)",
          "6,500 - 3,499 ≈ 7,000 - 3,000 = 4,000 (exact: 3,001)"
        ],
        "exercises": [
          {
            "q": "Estimate by rounding to nearest thousand:",
            "parts": [
              "4,567 + 3,456",
              "8,901 - 2,345",
              "12,678 + 7,345",
              "9,500 - 4,499",
              "6,789 + 3,211",
              "15,432 - 8,567"
            ],
            "ans": [
              "5,000 + 3,000 = 8,000",
              "9,000 - 2,000 = 7,000",
              "13,000 + 7,000 = 20,000",
              "10,000 - 4,000 = 6,000",
              "7,000 + 3,000 = 10,000",
              "15,000 - 9,000 = 6,000"
            ]
          },
          {
            "q": "Estimate by rounding to nearest hundred:",
            "parts": [
              "456 + 345",
              "891 - 234",
              "1,267 + 734",
              "950 - 449",
              "678 + 321"
            ],
            "ans": [
              "500 + 300 = 800",
              "900 - 200 = 700",
              "1,300 + 700 = 2,000",
              "1,000 - 400 = 600",
              "700 + 300 = 1,000"
            ]
          },
          {
            "q": "Is the estimate reasonable? (Yes/No):",
            "parts": [
              "4,567 + 3,456 ≈ 8,000 (exact: 8,023)",
              "8,901 - 2,345 ≈ 7,000 (exact: 6,556)",
              "99 + 99 ≈ 200 (exact: 198)",
              "5,000 - 1 ≈ 4,000 (exact: 4,999)",
              "12,345 + 12,345 ≈ 24,000 (exact: 24,690)"
            ],
            "ans": [
              "Yes",
              "Yes",
              "Yes",
              "No — 5,000 is closer",
              "Yes"
            ]
          }
        ],
        "wordProblems": [
          "A shop earned Rs 4,567 on Monday and Rs 3,456 on Tuesday. Estimate the total earnings.",
          "A tank had 8,901 liters. 2,345 liters were used. Estimate how much is left.",
          "Ali has 12,678 marbles and Sara has 7,345. Estimate how many they have together.",
          "A school has 9,500 books. 4,499 were borrowed. Estimate how many are in the library.",
          "Two trucks carried 45,678 kg and 23,456 kg. Estimate the total weight."
        ],
        "quiz": [
          {
            "q": "Estimate: 4,567 + 3,456 ≈ ?",
            "a": [
              "7,000",
              "8,000",
              "9,000",
              "6,000"
            ],
            "c": 1
          },
          {
            "q": "Estimate: 8,901 - 2,345 ≈ ?",
            "a": [
              "5,000",
              "6,000",
              "7,000",
              "8,000"
            ],
            "c": 2
          },
          {
            "q": "Why do we estimate?",
            "a": [
              "To get exact answers",
              "To check if answers make sense",
              "To skip problems",
              "To round numbers"
            ],
            "c": 1
          },
          {
            "q": "Estimate: 12,678 + 7,345 ≈ ?",
            "a": [
              "19,000",
              "20,000",
              "21,000",
              "18,000"
            ],
            "c": 1
          },
          {
            "q": "Round 4,567 to nearest thousand:",
            "a": [
              "4,000",
              "5,000",
              "4,500",
              "4,600"
            ],
            "c": 1
          },
          {
            "q": "Estimate: 9,876 - 4,321 ≈ ?",
            "a": [
              "5,000",
              "6,000",
              "7,000",
              "4,000"
            ],
            "c": 1
          },
          {
            "q": "Which is the best estimate for 456 + 345?",
            "a": [
              "700",
              "800",
              "900",
              "1,000"
            ],
            "c": 1
          },
          {
            "q": "Estimate: 99,500 + 500 ≈ ?",
            "a": [
              "99,000",
              "100,000",
              "101,000",
              "99,500"
            ],
            "c": 1
          }
        ]
      },
      {
        "t": "Word Problems",
        "c": "Word problems test your ability to identify which operation to use. Key words: 'total', 'sum', 'altogether', 'combined' mean addition. 'Remaining', 'left', 'difference', 'less' mean subtraction.",
        "examples": [
          "Ali had 2,350 marbles. He gave 1,175 to his friend. How many are left? 2,350 - 1,175 = 1,175",
          "A library has 5,678 English books and 4,322 Urdu books. Total books? 5,678 + 4,322 = 10,000",
          "A farmer harvested 12,456 kg of wheat. He sold 8,234 kg. How much is left? 12,456 - 8,234 = 4,222",
          "Shop A earned Rs 34,567 and Shop B earned Rs 45,433. Combined earnings? 34,567 + 45,433 = 80,000",
          "A tank has 8,000 liters. 3,567 liters leak out. How much remains? 8,000 - 3,567 = 4,433",
          "Sara scored 456 in Term 1 and 544 in Term 2. What is her total? 456 + 544 = 1,000"
        ],
        "exercises": [
          {
            "q": "Solve each word problem:",
            "parts": [
              "A school has 12,345 boys and 11,678 girls. Find the total students.",
              "Ali has Rs 50,000. He buys a phone for Rs 34,567. How much money is left?",
              "Two trains carried 23,456 and 34,567 passengers. How many passengers altogether?",
              "A city had 100,000 trees. 34,567 were cut down. How many remain?",
              "A factory made 45,678 items in January and 54,322 in February. Find the total.",
              "Sara had 8,000 stickers. She gave away 2,345 and lost 1,234. How many does she have?"
            ],
            "ans": [
              "24,023",
              "15,433",
              "58,023",
              "65,433",
              "100,000",
              "4,421"
            ]
          },
          {
            "q": "Which operation? Write + or -:",
            "parts": [
              "Ali earned Rs 5,000 and then spent Rs 2,345.",
              "Two classes have 45 and 38 students. Total?",
              "A pool has 10,000 liters. 3,456 evaporated.",
              "Sara collected 234 shells. Her sister collected 345. How many altogether?",
              "A shop had 5,000 items. 1,234 were sold."
            ],
            "ans": [
              "- (subtraction)",
              "+ (addition)",
              "- (subtraction)",
              "+ (addition)",
              "- (subtraction)"
            ]
          }
        ],
        "wordProblems": [
          "A village has 23,456 men, 24,567 women, and 12,345 children. What is the total population?",
          "Ali had Rs 100,000. He spent Rs 34,567 on furniture and Rs 23,456 on electronics. How much is left?",
          "A school collected 45,678 bottles for recycling in March and 34,322 in April. How many bottles in total?",
          "A farmer had 25,000 kg of grain. He sold 12,345 kg and used 5,678 kg at home. How much remains?",
          "Three friends saved Rs 12,345, Rs 23,456, and Rs 14,199. What is their combined savings?"
        ],
        "quiz": [
          {
            "q": "Ali had 2,350 marbles, gave 1,175. How many left?",
            "a": [
              "1,075",
              "1,175",
              "1,275",
              "1,375"
            ],
            "c": 1
          },
          {
            "q": "5,678 + 4,322 = ?",
            "a": [
              "9,000",
              "10,000",
              "9,900",
              "10,100"
            ],
            "c": 1
          },
          {
            "q": "'How many are left?' means:",
            "a": [
              "Addition",
              "Subtraction",
              "Multiplication",
              "Division"
            ],
            "c": 1
          },
          {
            "q": "100,000 - 34,567 = ?",
            "a": [
              "65,433",
              "66,433",
              "64,433",
              "65,333"
            ],
            "c": 0
          },
          {
            "q": "'Altogether' means:",
            "a": [
              "Subtract",
              "Add",
              "Multiply",
              "Divide"
            ],
            "c": 1
          },
          {
            "q": "12,456 - 8,234 = ?",
            "a": [
              "4,222",
              "4,122",
              "4,322",
              "3,222"
            ],
            "c": 0
          },
          {
            "q": "A school has 12,345 + 11,678 students. Total?",
            "a": [
              "23,023",
              "24,023",
              "24,123",
              "23,923"
            ],
            "c": 1
          },
          {
            "q": "50,000 - 34,567 = ?",
            "a": [
              "15,433",
              "16,433",
              "15,333",
              "14,433"
            ],
            "c": 0
          }
        ]
      }
    ],
    "id": "math_5_1"
  },
  {
    "title": "Multiplication & Division",
    "content": "Multiplication of large numbers. Long division step by step. Multiplication tables. Estimation. Word problems.",
    "key": "mult_div5",
    "hasMathSub": true,
    "subs": [
      {
        "t": "Large Multiplication",
        "c": "To multiply large numbers, break them into parts. Multiply by ones digit first, then tens digit, then add. Always line up digits carefully by place value.",
        "examples": [
          "234 × 6 = 1,404",
          "234 × 50 = 11,700",
          "234 × 56 = 1,404 + 11,700 = 13,104",
          "456 × 23 = 456 × 3 + 456 × 20 = 1,368 + 9,120 = 10,488",
          "125 × 40 = 5,000 (multiply by 4, then add a zero)",
          "300 × 50 = 15,000 (3 × 5 = 15, then add three zeros)",
          "999 × 9 = 8,991"
        ],
        "exercises": [
          {
            "q": "Multiply:",
            "parts": [
              "234 × 56",
              "456 × 23",
              "125 × 40",
              "678 × 15",
              "345 × 67",
              "999 × 9",
              "500 × 80",
              "123 × 45"
            ],
            "ans": [
              "13,104",
              "10,488",
              "5,000",
              "10,170",
              "23,115",
              "8,991",
              "40,000",
              "5,535"
            ]
          },
          {
            "q": "Multiply by 10, 100, 1000:",
            "parts": [
              "456 × 10",
              "456 × 100",
              "456 × 1,000",
              "78 × 10",
              "78 × 100",
              "78 × 1,000"
            ],
            "ans": [
              "4,560",
              "45,600",
              "456,000",
              "780",
              "7,800",
              "78,000"
            ]
          },
          {
            "q": "Fill in the blank:",
            "parts": [
              "234 × ___ = 1,404",
              "___ × 50 = 5,000",
              "300 × ___ = 15,000",
              "___ × 9 = 8,991",
              "125 × ___ = 5,000"
            ],
            "ans": [
              "6",
              "100",
              "50",
              "999",
              "40"
            ]
          },
          {
            "q": "True or False:",
            "parts": [
              "456 × 0 = 0",
              "456 × 1 = 456",
              "300 × 50 = 1,500",
              "999 × 9 = 8,991",
              "125 × 8 = 1,000"
            ],
            "ans": [
              "True",
              "True",
              "False — it's 15,000",
              "True",
              "True"
            ]
          }
        ],
        "wordProblems": [
          "A box contains 234 pencils. How many pencils are in 56 boxes?",
          "A farmer plants 125 seeds in each row. He has 40 rows. How many seeds in total?",
          "Each student pays Rs 456 for a trip. If 23 students go, what is the total cost?",
          "A factory produces 678 items per day. How many in 15 days?",
          "A book has 345 pages. How many pages in 67 copies?"
        ],
        "quiz": [
          {
            "q": "234 × 56 = ?",
            "a": [
              "12,104",
              "13,104",
              "13,204",
              "14,104"
            ],
            "c": 1
          },
          {
            "q": "456 × 10 = ?",
            "a": [
              "456",
              "4,560",
              "45,600",
              "4,506"
            ],
            "c": 1
          },
          {
            "q": "Any number × 0 = ?",
            "a": [
              "That number",
              "1",
              "0",
              "Undefined"
            ],
            "c": 2
          },
          {
            "q": "125 × 8 = ?",
            "a": [
              "900",
              "950",
              "1,000",
              "1,100"
            ],
            "c": 2
          },
          {
            "q": "300 × 50 = ?",
            "a": [
              "1,500",
              "15,000",
              "150,000",
              "150"
            ],
            "c": 1
          },
          {
            "q": "Fill: ___ × 9 = 8,991",
            "a": [
              "899",
              "999",
              "989",
              "998"
            ],
            "c": 1
          },
          {
            "q": "456 × 100 = ?",
            "a": [
              "4,560",
              "45,600",
              "456,000",
              "456"
            ],
            "c": 1
          },
          {
            "q": "678 × 15 = ?",
            "a": [
              "10,070",
              "10,170",
              "10,270",
              "9,170"
            ],
            "c": 1
          }
        ]
      },
      {
        "t": "Long Division",
        "c": "Long division has 4 steps that repeat: Divide, Multiply, Subtract, Bring down. Keep repeating until no digits are left to bring down.",
        "examples": [
          "846 ÷ 3 = 282 (3 into 8 = 2r2, bring down 4 = 24, 3 into 24 = 8, bring down 6, 3 into 6 = 2)",
          "1,245 ÷ 5 = 249 (5 into 12 = 2r2, bring down 4 = 24, 5 into 24 = 4r4, bring down 5 = 45, 5 into 45 = 9)",
          "7,200 ÷ 8 = 900",
          "5,040 ÷ 7 = 720",
          "9,999 ÷ 9 = 1,111",
          "4,368 ÷ 4 = 1,092",
          "6,125 ÷ 5 = 1,225"
        ],
        "exercises": [
          {
            "q": "Divide:",
            "parts": [
              "846 ÷ 3",
              "1,245 ÷ 5",
              "7,200 ÷ 8",
              "5,040 ÷ 7",
              "9,999 ÷ 9",
              "4,368 ÷ 4",
              "6,125 ÷ 5",
              "3,648 ÷ 6"
            ],
            "ans": [
              "282",
              "249",
              "900",
              "720",
              "1,111",
              "1,092",
              "1,225",
              "608"
            ]
          },
          {
            "q": "Divide with remainder:",
            "parts": [
              "847 ÷ 3",
              "100 ÷ 7",
              "250 ÷ 8",
              "1,000 ÷ 3",
              "503 ÷ 2",
              "999 ÷ 4"
            ],
            "ans": [
              "282 r1",
              "14 r2",
              "31 r2",
              "333 r1",
              "251 r1",
              "249 r3"
            ]
          },
          {
            "q": "Fill in the blank:",
            "parts": [
              "___ ÷ 5 = 249",
              "846 ÷ ___ = 282",
              "___ ÷ 9 = 1,111",
              "7,200 ÷ ___ = 900",
              "___ ÷ 7 = 720"
            ],
            "ans": [
              "1,245",
              "3",
              "9,999",
              "8",
              "5,040"
            ]
          },
          {
            "q": "True or False:",
            "parts": [
              "846 ÷ 3 = 282",
              "1,245 ÷ 5 = 259",
              "Any number ÷ 1 = that number",
              "0 ÷ 5 = 0",
              "100 ÷ 0 = 0"
            ],
            "ans": [
              "True",
              "False — it's 249",
              "True",
              "True",
              "False — can't divide by zero"
            ]
          }
        ],
        "wordProblems": [
          "846 students are divided into 3 equal groups. How many students in each group?",
          "A farmer has 1,245 apples to pack in bags of 5. How many bags are needed?",
          "Rs 7,200 is shared equally among 8 workers. How much does each get?",
          "5,040 books are placed on 7 shelves equally. How many books per shelf?",
          "A rope 6,125 cm long is cut into 5 equal pieces. How long is each piece?"
        ],
        "quiz": [
          {
            "q": "846 ÷ 3 = ?",
            "a": [
              "272",
              "282",
              "292",
              "262"
            ],
            "c": 1
          },
          {
            "q": "1,245 ÷ 5 = ?",
            "a": [
              "259",
              "239",
              "249",
              "229"
            ],
            "c": 2
          },
          {
            "q": "The 4 steps of long division are:",
            "a": [
              "Add, Subtract, Multiply, Divide",
              "Divide, Multiply, Subtract, Bring down",
              "Bring down, Add, Multiply, Divide",
              "Subtract, Divide, Add, Bring down"
            ],
            "c": 1
          },
          {
            "q": "7,200 ÷ 8 = ?",
            "a": [
              "800",
              "850",
              "900",
              "950"
            ],
            "c": 2
          },
          {
            "q": "Can you divide by zero?",
            "a": [
              "Yes, answer is 0",
              "Yes, answer is 1",
              "No, it's undefined",
              "Yes, answer is infinity"
            ],
            "c": 2
          },
          {
            "q": "9,999 ÷ 9 = ?",
            "a": [
              "1,111",
              "1,011",
              "1,101",
              "1,110"
            ],
            "c": 0
          },
          {
            "q": "847 ÷ 3 = ?",
            "a": [
              "282",
              "282 r1",
              "283",
              "281 r2"
            ],
            "c": 1
          },
          {
            "q": "5,040 ÷ 7 = ?",
            "a": [
              "700",
              "710",
              "720",
              "730"
            ],
            "c": 2
          }
        ]
      },
      {
        "t": "Multiplication Tables",
        "c": "Knowing tables from 1 to 12 by heart makes math much faster. Quick tricks help you remember them easily.",
        "examples": [
          "×2 table: just double the number (7 × 2 = 14)",
          "×5 table: always ends in 0 or 5 (5, 10, 15, 20, 25...)",
          "×9 trick: tens go up, ones go down (9, 18, 27, 36, 45, 54, 63, 72, 81, 90)",
          "×10 table: add a zero (7 × 10 = 70)",
          "×11 table (up to 9): repeat the digit (7 × 11 = 77)",
          "×4 table: double the ×2 answer (7 × 4 = 7 × 2 × 2 = 28)"
        ],
        "exercises": [
          {
            "q": "Fill in quickly:",
            "parts": [
              "7 × 8 =",
              "6 × 9 =",
              "8 × 12 =",
              "9 × 7 =",
              "11 × 6 =",
              "12 × 5 =",
              "4 × 8 =",
              "3 × 12 =",
              "7 × 7 =",
              "8 × 9 ="
            ],
            "ans": [
              "56",
              "54",
              "96",
              "63",
              "66",
              "60",
              "32",
              "36",
              "49",
              "72"
            ]
          },
          {
            "q": "What × what = ?",
            "parts": [
              "___ × 7 = 56",
              "___ × 9 = 108",
              "___ × 8 = 96",
              "___ × 6 = 72",
              "___ × 5 = 60",
              "___ × 11 = 132"
            ],
            "ans": [
              "8",
              "12",
              "12",
              "12",
              "12",
              "12"
            ]
          },
          {
            "q": "True or False:",
            "parts": [
              "7 × 8 = 56",
              "6 × 9 = 56",
              "12 × 12 = 144",
              "8 × 7 = 7 × 8",
              "9 × 6 = 52"
            ],
            "ans": [
              "True",
              "False — it's 54",
              "True",
              "True — multiplication is commutative",
              "False — it's 54"
            ]
          }
        ],
        "wordProblems": [
          "A carton has 12 eggs. How many eggs in 8 cartons?",
          "Each row has 9 chairs. There are 7 rows. How many chairs?",
          "Ali reads 6 pages every day. How many pages in 11 days?",
          "A bus makes 5 trips daily. How many trips in 12 days?",
          "Each packet has 8 biscuits. How many biscuits in 9 packets?"
        ],
        "quiz": [
          {
            "q": "7 × 8 = ?",
            "a": [
              "54",
              "56",
              "58",
              "48"
            ],
            "c": 1
          },
          {
            "q": "6 × 9 = ?",
            "a": [
              "52",
              "54",
              "56",
              "64"
            ],
            "c": 1
          },
          {
            "q": "12 × 12 = ?",
            "a": [
              "124",
              "134",
              "144",
              "154"
            ],
            "c": 2
          },
          {
            "q": "×9 trick: 9 × 7 — tens digit is:",
            "a": [
              "5",
              "6",
              "7",
              "8"
            ],
            "c": 1
          },
          {
            "q": "Any number × 1 = ?",
            "a": [
              "0",
              "1",
              "That number",
              "10"
            ],
            "c": 2
          },
          {
            "q": "8 × 9 = ?",
            "a": [
              "63",
              "72",
              "81",
              "64"
            ],
            "c": 1
          },
          {
            "q": "Which equals 96?",
            "a": [
              "8 × 11",
              "8 × 12",
              "9 × 12",
              "7 × 12"
            ],
            "c": 1
          },
          {
            "q": "11 × 7 = ?",
            "a": [
              "67",
              "77",
              "87",
              "78"
            ],
            "c": 1
          }
        ]
      },
      {
        "t": "Estimation in Multiplication",
        "c": "Round numbers before multiplying for a quick estimate. This helps check if your exact answer is reasonable.",
        "examples": [
          "48 × 31 ≈ 50 × 30 = 1,500 (exact: 1,488)",
          "198 × 5 ≈ 200 × 5 = 1,000 (exact: 990)",
          "67 × 42 ≈ 70 × 40 = 2,800 (exact: 2,814)",
          "312 × 9 ≈ 300 × 9 = 2,700 (exact: 2,808)",
          "495 × 21 ≈ 500 × 20 = 10,000 (exact: 10,395)",
          "89 × 11 ≈ 90 × 10 = 900 (exact: 979)"
        ],
        "exercises": [
          {
            "q": "Estimate by rounding:",
            "parts": [
              "48 × 31",
              "198 × 5",
              "67 × 42",
              "312 × 9",
              "495 × 21",
              "89 × 11",
              "52 × 19",
              "203 × 48"
            ],
            "ans": [
              "50×30 = 1,500",
              "200×5 = 1,000",
              "70×40 = 2,800",
              "300×9 = 2,700",
              "500×20 = 10,000",
              "90×10 = 900",
              "50×20 = 1,000",
              "200×50 = 10,000"
            ]
          },
          {
            "q": "Is the estimate reasonable?",
            "parts": [
              "48 × 31 ≈ 1,500 (exact 1,488)",
              "198 × 5 ≈ 1,000 (exact 990)",
              "67 × 42 ≈ 2,800 (exact 2,814)",
              "89 × 11 ≈ 900 (exact 979)",
              "495 × 21 ≈ 10,000 (exact 10,395)"
            ],
            "ans": [
              "Yes",
              "Yes",
              "Yes",
              "Yes",
              "Yes"
            ]
          }
        ],
        "wordProblems": [
          "A shop sells about 48 items daily. Estimate sales for 31 days.",
          "Each ticket costs Rs 198. Estimate the cost of 5 tickets.",
          "A bus carries about 67 passengers. Estimate passengers in 42 trips.",
          "A worker earns Rs 312 per day. Estimate earnings for 9 days.",
          "A school has 495 students. Each needs about 21 notebooks. Estimate total notebooks needed."
        ],
        "quiz": [
          {
            "q": "Estimate: 48 × 31 ≈ ?",
            "a": [
              "1,200",
              "1,500",
              "1,800",
              "2,000"
            ],
            "c": 1
          },
          {
            "q": "Estimate: 198 × 5 ≈ ?",
            "a": [
              "800",
              "900",
              "1,000",
              "1,100"
            ],
            "c": 2
          },
          {
            "q": "Why estimate multiplication?",
            "a": [
              "To get exact answer",
              "To check if answer is reasonable",
              "To skip calculation",
              "To round numbers"
            ],
            "c": 1
          },
          {
            "q": "Estimate: 67 × 42 ≈ ?",
            "a": [
              "2,400",
              "2,600",
              "2,800",
              "3,000"
            ],
            "c": 2
          },
          {
            "q": "Estimate: 495 × 21 ≈ ?",
            "a": [
              "8,000",
              "9,000",
              "10,000",
              "11,000"
            ],
            "c": 2
          },
          {
            "q": "Round 312 to nearest hundred:",
            "a": [
              "300",
              "310",
              "320",
              "400"
            ],
            "c": 0
          },
          {
            "q": "Estimate: 89 × 11 ≈ ?",
            "a": [
              "800",
              "900",
              "1,000",
              "1,100"
            ],
            "c": 1
          },
          {
            "q": "Estimate: 52 × 19 ≈ ?",
            "a": [
              "800",
              "900",
              "1,000",
              "1,100"
            ],
            "c": 2
          }
        ]
      },
      {
        "t": "Word Problems",
        "c": "Read carefully. 'Each', 'per', 'every' often mean multiplication. 'Shared equally', 'divided into', 'split' mean division.",
        "examples": [
          "A shop sells 45 packets daily. In 30 days: 45 × 30 = 1,350 packets",
          "Rs 7,200 shared among 8 workers: 7,200 ÷ 8 = Rs 900 each",
          "12 boxes with 24 items each: 12 × 24 = 288 items total",
          "1,245 sweets for 5 children equally: 1,245 ÷ 5 = 249 each",
          "A car travels 65 km per hour for 8 hours: 65 × 8 = 520 km",
          "4,368 students in 4 houses equally: 4,368 ÷ 4 = 1,092 per house"
        ],
        "exercises": [
          {
            "q": "Solve:",
            "parts": [
              "A shop sells 45 packets daily. How many in 30 days?",
              "Rs 7,200 is shared equally among 8 workers. How much each?",
              "12 boxes with 24 items each. Total items?",
              "1,245 sweets divided among 5 children equally. How many each?",
              "A car travels 65 km per hour for 8 hours. Total distance?",
              "4,368 students divided into 4 houses equally. How many per house?"
            ],
            "ans": [
              "1,350",
              "900",
              "288",
              "249",
              "520",
              "1,092"
            ]
          },
          {
            "q": "Which operation? × or ÷:",
            "parts": [
              "15 bags with 12 oranges each. Total oranges?",
              "Rs 5,000 shared among 4 friends.",
              "A train makes 6 trips daily for 25 days.",
              "846 books placed equally on 3 shelves.",
              "Each child gets 8 sweets from 96 total."
            ],
            "ans": [
              "× (multiply)",
              "÷ (divide)",
              "× (multiply)",
              "÷ (divide)",
              "÷ (divide)"
            ]
          }
        ],
        "wordProblems": [
          "A baker makes 125 rotis per hour. How many in 8 hours?",
          "9,999 pencils are packed equally into 9 boxes. How many per box?",
          "A school bus makes 3 trips daily carrying 45 students each. How many students travel daily?",
          "A farmer has 5,040 mangoes to fill 7 crates equally. How many per crate?",
          "Each classroom has 6 rows with 8 desks. The school has 12 classrooms. How many desks total?"
        ],
        "quiz": [
          {
            "q": "45 × 30 = ?",
            "a": [
              "1,250",
              "1,350",
              "1,450",
              "1,550"
            ],
            "c": 1
          },
          {
            "q": "7,200 ÷ 8 = ?",
            "a": [
              "800",
              "850",
              "900",
              "950"
            ],
            "c": 2
          },
          {
            "q": "'Shared equally' means:",
            "a": [
              "Add",
              "Subtract",
              "Multiply",
              "Divide"
            ],
            "c": 3
          },
          {
            "q": "12 × 24 = ?",
            "a": [
              "278",
              "288",
              "298",
              "268"
            ],
            "c": 1
          },
          {
            "q": "'Each' and 'per' usually mean:",
            "a": [
              "Addition",
              "Subtraction",
              "Multiplication",
              "Division"
            ],
            "c": 2
          },
          {
            "q": "1,245 ÷ 5 = ?",
            "a": [
              "239",
              "249",
              "259",
              "229"
            ],
            "c": 1
          },
          {
            "q": "65 × 8 = ?",
            "a": [
              "500",
              "510",
              "520",
              "530"
            ],
            "c": 2
          },
          {
            "q": "4,368 ÷ 4 = ?",
            "a": [
              "1,082",
              "1,092",
              "1,102",
              "992"
            ],
            "c": 1
          }
        ]
      }
    ],
    "id": "math_5_2"
  },
  {
    "title": "Factors & Multiples",
    "content": "Factors, multiples, prime and composite numbers, LCM, HCF, divisibility rules.",
    "key": "factors",
    "hasMathSub": true,
    "subs": [
      {
        "t": "Factors & Multiples",
        "c": "Factors divide evenly into a number. Multiples are what you get when you multiply a number.",
        "examples": [
          "Factors of 12: 1, 2, 3, 4, 6, 12",
          "Factors of 20: 1, 2, 4, 5, 10, 20",
          "Multiples of 4: 4, 8, 12, 16, 20, 24...",
          "Multiples of 7: 7, 14, 21, 28, 35...",
          "Every number is a factor of itself",
          "1 is a factor of every number"
        ],
        "exercises": [
          {
            "q": "List all factors:",
            "parts": [
              "18",
              "24",
              "36",
              "48",
              "60",
              "100"
            ],
            "ans": [
              "1,2,3,6,9,18",
              "1,2,3,4,6,8,12,24",
              "1,2,3,4,6,9,12,18,36",
              "1,2,3,4,6,8,12,16,24,48",
              "1,2,3,4,5,6,10,12,15,20,30,60",
              "1,2,4,5,10,20,25,50,100"
            ]
          },
          {
            "q": "List first 5 multiples:",
            "parts": [
              "6",
              "8",
              "9",
              "11",
              "12",
              "15"
            ],
            "ans": [
              "6,12,18,24,30",
              "8,16,24,32,40",
              "9,18,27,36,45",
              "11,22,33,44,55",
              "12,24,36,48,60",
              "15,30,45,60,75"
            ]
          },
          {
            "q": "True or False:",
            "parts": [
              "7 is a factor of 49",
              "5 is a factor of 23",
              "36 is a multiple of 9",
              "15 is a multiple of 4",
              "1 is a factor of every number"
            ],
            "ans": [
              "True",
              "False",
              "True",
              "False",
              "True"
            ]
          }
        ],
        "wordProblems": [
          "Ali has 24 sweets to share equally. What are the possible group sizes?",
          "A number is a multiple of both 4 and 6. What is the smallest such number?",
          "Is 56 a multiple of 7? How do you check?",
          "List all factors of 30 that are also factors of 45.",
          "A teacher wants to arrange 36 students in equal rows. What are the options?"
        ],
        "quiz": [
          {
            "q": "Factors of 18:",
            "a": [
              "1,2,3,6,9,18",
              "1,2,3,9,18",
              "1,2,6,9,18",
              "1,3,6,9,18"
            ],
            "c": 0
          },
          {
            "q": "3rd multiple of 7:",
            "a": [
              "14",
              "21",
              "28",
              "35"
            ],
            "c": 1
          },
          {
            "q": "Is 5 a factor of 35?",
            "a": [
              "Yes",
              "No",
              "Sometimes",
              "Only if even"
            ],
            "c": 0
          },
          {
            "q": "How many factors does 12 have?",
            "a": [
              "4",
              "5",
              "6",
              "7"
            ],
            "c": 2
          },
          {
            "q": "Which is NOT a multiple of 6?",
            "a": [
              "12",
              "18",
              "22",
              "30"
            ],
            "c": 2
          },
          {
            "q": "Factors of a prime number:",
            "a": [
              "1 only",
              "1 and itself",
              "Many",
              "None"
            ],
            "c": 1
          },
          {
            "q": "First common multiple of 3 and 4:",
            "a": [
              "6",
              "8",
              "12",
              "24"
            ],
            "c": 2
          },
          {
            "q": "Is 1 a factor of 100?",
            "a": [
              "Yes",
              "No",
              "Only for odd",
              "Only for even"
            ],
            "c": 0
          }
        ]
      },
      {
        "t": "Prime & Composite",
        "c": "A prime number has exactly 2 factors: 1 and itself. A composite number has more than 2 factors. 1 is neither prime nor composite.",
        "examples": [
          "Primes up to 20: 2, 3, 5, 7, 11, 13, 17, 19",
          "Composites up to 20: 4, 6, 8, 9, 10, 12, 14, 15, 16, 18, 20",
          "2 is the only even prime number",
          "1 is neither prime nor composite",
          "9 = 3 × 3, so 9 is composite",
          "Every even number greater than 2 is composite"
        ],
        "exercises": [
          {
            "q": "Prime or Composite?",
            "parts": [
              "7",
              "12",
              "23",
              "15",
              "29",
              "27",
              "31",
              "49",
              "51",
              "2"
            ],
            "ans": [
              "Prime",
              "Composite",
              "Prime",
              "Composite",
              "Prime",
              "Composite",
              "Prime",
              "Composite",
              "Composite",
              "Prime"
            ]
          },
          {
            "q": "List all primes between:",
            "parts": [
              "1 and 10",
              "10 and 20",
              "20 and 30",
              "30 and 50"
            ],
            "ans": [
              "2,3,5,7",
              "11,13,17,19",
              "23,29",
              "31,37,41,43,47"
            ]
          },
          {
            "q": "True or False:",
            "parts": [
              "All prime numbers are odd",
              "1 is a prime number",
              "Every composite number has more than 2 factors",
              "2 is the smallest prime",
              "91 is prime"
            ],
            "ans": [
              "False — 2 is even and prime",
              "False",
              "True",
              "True",
              "False — 91 = 7 × 13"
            ]
          }
        ],
        "wordProblems": [
          "Is the number of days in a week (7) prime or composite?",
          "Ali says 51 is prime. Is he correct? Explain.",
          "List all prime numbers between 40 and 60.",
          "Can a prime number end in 0? Why or why not?",
          "How many prime numbers are there between 1 and 30?"
        ],
        "quiz": [
          {
            "q": "Which is prime?",
            "a": [
              "9",
              "15",
              "23",
              "21"
            ],
            "c": 2
          },
          {
            "q": "2 is:",
            "a": [
              "Composite",
              "Neither",
              "The only even prime",
              "Odd prime"
            ],
            "c": 2
          },
          {
            "q": "Is 1 prime?",
            "a": [
              "Yes",
              "No",
              "Sometimes",
              "Only in math"
            ],
            "c": 1
          },
          {
            "q": "Factors of a prime:",
            "a": [
              "Only 1",
              "Only itself",
              "1 and itself",
              "Many"
            ],
            "c": 2
          },
          {
            "q": "Which is composite?",
            "a": [
              "7",
              "11",
              "15",
              "13"
            ],
            "c": 2
          },
          {
            "q": "Primes between 10 and 20:",
            "a": [
              "11,13,17,19",
              "11,13,15,17",
              "10,12,14,16",
              "11,12,13,17"
            ],
            "c": 0
          },
          {
            "q": "Is 49 prime?",
            "a": [
              "Yes",
              "No — it's 7×7",
              "No — it's 6×8",
              "Yes — odd numbers are prime"
            ],
            "c": 1
          },
          {
            "q": "Smallest prime number:",
            "a": [
              "0",
              "1",
              "2",
              "3"
            ],
            "c": 2
          }
        ]
      },
      {
        "t": "LCM",
        "c": "LCM (Least Common Multiple) is the smallest number that is a multiple of two or more numbers.",
        "examples": [
          "LCM(4,6): Multiples of 4: 4,8,12,16... Multiples of 6: 6,12,18... LCM = 12",
          "LCM(3,5) = 15",
          "LCM(6,8) = 24",
          "LCM(10,15) = 30",
          "LCM(2,3,4) = 12",
          "If one number is a multiple of the other, LCM = the larger number. LCM(4,12) = 12"
        ],
        "exercises": [
          {
            "q": "Find the LCM:",
            "parts": [
              "4 and 6",
              "3 and 5",
              "6 and 8",
              "10 and 15",
              "8 and 12",
              "5 and 7",
              "9 and 12",
              "2, 3 and 5"
            ],
            "ans": [
              "12",
              "15",
              "24",
              "30",
              "24",
              "35",
              "36",
              "30"
            ]
          },
          {
            "q": "True or False:",
            "parts": [
              "LCM(4,6) = 12",
              "LCM(5,10) = 10",
              "LCM(3,7) = 21",
              "LCM(8,12) = 48",
              "LCM is always ≥ the larger number"
            ],
            "ans": [
              "True",
              "True",
              "True",
              "False — it's 24",
              "True"
            ]
          }
        ],
        "wordProblems": [
          "Two bells ring every 4 and 6 minutes. After how many minutes will they ring together?",
          "Ali visits a shop every 3 days, Sara every 5 days. If both visit today, when will they visit together again?",
          "Bus A comes every 10 minutes, Bus B every 15 minutes. When will both come at the same time?",
          "Find the smallest number divisible by both 8 and 12.",
          "Three lights blink every 2, 3, and 5 seconds. When do all three blink together?"
        ],
        "quiz": [
          {
            "q": "LCM(4,6) = ?",
            "a": [
              "10",
              "12",
              "18",
              "24"
            ],
            "c": 1
          },
          {
            "q": "LCM(3,5) = ?",
            "a": [
              "8",
              "10",
              "15",
              "30"
            ],
            "c": 2
          },
          {
            "q": "LCM(5,10) = ?",
            "a": [
              "5",
              "10",
              "15",
              "50"
            ],
            "c": 1
          },
          {
            "q": "LCM stands for:",
            "a": [
              "Largest Common Multiple",
              "Least Common Multiple",
              "Last Common Multiple",
              "Lower Common Multiple"
            ],
            "c": 1
          },
          {
            "q": "LCM(6,8) = ?",
            "a": [
              "14",
              "24",
              "48",
              "6"
            ],
            "c": 1
          },
          {
            "q": "LCM(2,3,4) = ?",
            "a": [
              "6",
              "12",
              "24",
              "8"
            ],
            "c": 1
          },
          {
            "q": "LCM is always ___ the larger number",
            "a": [
              "Less than",
              "Equal to or greater than",
              "Equal to",
              "Smaller than"
            ],
            "c": 1
          },
          {
            "q": "LCM(7,7) = ?",
            "a": [
              "1",
              "7",
              "14",
              "49"
            ],
            "c": 1
          }
        ]
      },
      {
        "t": "HCF",
        "c": "HCF (Highest Common Factor) is the largest number that divides two or more numbers evenly.",
        "examples": [
          "HCF(12,18): Factors of 12: 1,2,3,4,6,12. Factors of 18: 1,2,3,6,9,18. Common: 1,2,3,6. HCF = 6",
          "HCF(8,20) = 4",
          "HCF(15,25) = 5",
          "HCF(24,36) = 12",
          "HCF(7,13) = 1 (co-prime numbers)",
          "HCF is always ≤ the smaller number"
        ],
        "exercises": [
          {
            "q": "Find the HCF:",
            "parts": [
              "12 and 18",
              "8 and 20",
              "15 and 25",
              "24 and 36",
              "14 and 21",
              "30 and 45",
              "16 and 24",
              "7 and 13"
            ],
            "ans": [
              "6",
              "4",
              "5",
              "12",
              "7",
              "15",
              "8",
              "1"
            ]
          },
          {
            "q": "True or False:",
            "parts": [
              "HCF(12,18) = 6",
              "HCF(7,13) = 1",
              "HCF is always ≤ the smaller number",
              "HCF(10,10) = 10",
              "HCF(5,15) = 15"
            ],
            "ans": [
              "True",
              "True",
              "True",
              "True",
              "False — it's 5"
            ]
          }
        ],
        "wordProblems": [
          "Divide 24 boys and 36 girls into equal groups with no one left. What is the largest group size?",
          "A rope 18m and another 24m are cut into equal pieces (longest possible). How long is each piece?",
          "Find the HCF of 30 and 45. Use it to simplify 30/45.",
          "Two numbers have HCF 1. What are they called?",
          "Ali has 16 red and 24 blue marbles. He makes equal groups with same number of each color. What's the max per group?"
        ],
        "quiz": [
          {
            "q": "HCF(12,18) = ?",
            "a": [
              "3",
              "6",
              "9",
              "12"
            ],
            "c": 1
          },
          {
            "q": "HCF(8,20) = ?",
            "a": [
              "2",
              "4",
              "8",
              "10"
            ],
            "c": 1
          },
          {
            "q": "HCF stands for:",
            "a": [
              "Highest Common Factor",
              "Highest Common Fraction",
              "Half Common Factor",
              "High Count Factor"
            ],
            "c": 0
          },
          {
            "q": "HCF(7,13) = ?",
            "a": [
              "1",
              "7",
              "13",
              "91"
            ],
            "c": 0
          },
          {
            "q": "HCF is always ___ the smaller number",
            "a": [
              "Greater than",
              "Equal to or less than",
              "Greater than or equal to",
              "None"
            ],
            "c": 1
          },
          {
            "q": "HCF(24,36) = ?",
            "a": [
              "6",
              "8",
              "12",
              "24"
            ],
            "c": 2
          },
          {
            "q": "Co-prime means HCF = ?",
            "a": [
              "0",
              "1",
              "Both numbers",
              "Undefined"
            ],
            "c": 1
          },
          {
            "q": "HCF(15,25) = ?",
            "a": [
              "3",
              "5",
              "10",
              "15"
            ],
            "c": 1
          }
        ]
      },
      {
        "t": "Divisibility Rules",
        "c": "Quick ways to check if a number divides evenly without doing full division.",
        "examples": [
          "By 2: last digit is even (0,2,4,6,8)",
          "By 3: sum of digits divisible by 3. Example: 345 → 3+4+5 = 12 → 12÷3 = 4 ✓",
          "By 5: ends in 0 or 5",
          "By 9: sum of digits divisible by 9. Example: 729 → 7+2+9 = 18 → 18÷9 = 2 ✓",
          "By 10: ends in 0",
          "By 4: last two digits divisible by 4. Example: 1,324 → 24÷4 = 6 ✓"
        ],
        "exercises": [
          {
            "q": "Divisible by 2?",
            "parts": [
              "456",
              "123",
              "890",
              "347",
              "1,000",
              "5,671"
            ],
            "ans": [
              "Yes",
              "No",
              "Yes",
              "No",
              "Yes",
              "No"
            ]
          },
          {
            "q": "Divisible by 3?",
            "parts": [
              "345",
              "124",
              "999",
              "250",
              "612",
              "805"
            ],
            "ans": [
              "Yes (3+4+5=12)",
              "No (1+2+4=7)",
              "Yes (9+9+9=27)",
              "No (2+5+0=7)",
              "Yes (6+1+2=9)",
              "No (8+0+5=13)"
            ]
          },
          {
            "q": "Divisible by 5?",
            "parts": [
              "345",
              "124",
              "990",
              "251",
              "1,000",
              "5,673"
            ],
            "ans": [
              "Yes",
              "No",
              "Yes",
              "No",
              "Yes",
              "No"
            ]
          },
          {
            "q": "Divisible by 9?",
            "parts": [
              "729",
              "345",
              "918",
              "250",
              "999",
              "123"
            ],
            "ans": [
              "Yes (18)",
              "No (12)",
              "Yes (18)",
              "No (7)",
              "Yes (27)",
              "No (6)"
            ]
          }
        ],
        "wordProblems": [
          "Is 4,356 divisible by 3? Show your working.",
          "A number ends in 0. Which numbers is it definitely divisible by?",
          "Can a number be divisible by both 2 and 5? Give an example.",
          "Is 7,245 divisible by 9? Use the divisibility rule.",
          "Ali has 345 sweets. Can he share them equally among 5 friends?"
        ],
        "quiz": [
          {
            "q": "Divisibility rule for 3:",
            "a": [
              "Last digit is 3",
              "Sum of digits ÷ 3",
              "Ends in 0 or 3",
              "Last two digits ÷ 3"
            ],
            "c": 1
          },
          {
            "q": "Is 456 divisible by 2?",
            "a": [
              "Yes",
              "No"
            ],
            "c": 0
          },
          {
            "q": "345 divisible by 5?",
            "a": [
              "Yes",
              "No"
            ],
            "c": 0
          },
          {
            "q": "Rule for 10:",
            "a": [
              "Ends in 0",
              "Ends in 5",
              "Sum of digits = 10",
              "Even number"
            ],
            "c": 0
          },
          {
            "q": "Is 729 divisible by 9?",
            "a": [
              "Yes (7+2+9=18)",
              "No",
              "Yes (7+2+9=17)",
              "Cannot tell"
            ],
            "c": 0
          },
          {
            "q": "Divisible by both 2 and 5:",
            "a": [
              "Must end in 0",
              "Must end in 5",
              "Must be odd",
              "Must end in 2"
            ],
            "c": 0
          },
          {
            "q": "Is 124 divisible by 3?",
            "a": [
              "Yes",
              "No (1+2+4=7)",
              "Yes (1+2+4=6)",
              "Cannot tell"
            ],
            "c": 1
          },
          {
            "q": "Rule for 4:",
            "a": [
              "Last digit ÷ 4",
              "Last 2 digits ÷ 4",
              "Sum ÷ 4",
              "Ends in 4"
            ],
            "c": 1
          }
        ]
      }
    ],
    "id": "math_5_3"
  },
  {
    "title": "Fractions",
    "content": "Proper/improper fractions, mixed numbers, equivalent fractions, simplifying, operations.",
    "key": "fractions5",
    "hasMathSub": true,
    "subs": [
      {
        "t": "Proper & Improper",
        "c": "Proper fraction: numerator < denominator (less than 1). Improper fraction: numerator ≥ denominator (≥ 1).",
        "examples": [
          "Proper: 3/4, 2/5, 1/8, 5/12",
          "Improper: 7/4, 5/3, 9/2, 12/5",
          "5/5 = 1 (equal parts = whole)",
          "At the boundary: 4/4 = 1, 8/8 = 1"
        ],
        "exercises": [
          {
            "q": "Classify as Proper or Improper:",
            "parts": [
              "3/7",
              "9/4",
              "5/5",
              "2/11",
              "15/8",
              "7/12",
              "6/6",
              "11/3"
            ],
            "ans": [
              "Proper",
              "Improper",
              "Improper (=1)",
              "Proper",
              "Improper",
              "Proper",
              "Improper (=1)",
              "Improper"
            ]
          }
        ],
        "wordProblems": [
          "Ali ate 3 slices of a pizza cut into 8 pieces. Write as a fraction. Is it proper or improper?",
          "Sara has 7/4 of a cake. Is this more or less than one whole cake?",
          "Write five proper fractions with denominator 10."
        ],
        "quiz": [
          {
            "q": "3/7 is:",
            "a": [
              "Proper",
              "Improper",
              "Mixed",
              "None"
            ],
            "c": 0
          },
          {
            "q": "Which is improper?",
            "a": [
              "3/8",
              "5/9",
              "9/4",
              "2/7"
            ],
            "c": 2
          },
          {
            "q": "5/5 equals:",
            "a": [
              "0",
              "1",
              "5",
              "1/5"
            ],
            "c": 1
          },
          {
            "q": "Proper fraction is always:",
            "a": [
              "Greater than 1",
              "Less than 1",
              "Equal to 1",
              "Greater than 0"
            ],
            "c": 1
          },
          {
            "q": "11/3 is:",
            "a": [
              "Proper",
              "Improper",
              "Mixed",
              "Zero"
            ],
            "c": 1
          },
          {
            "q": "Which is proper?",
            "a": [
              "7/4",
              "9/2",
              "3/8",
              "5/3"
            ],
            "c": 2
          }
        ]
      },
      {
        "t": "Mixed Numbers",
        "c": "A mixed number has a whole part and a fraction: 2¾. Convert improper → mixed by dividing. Convert mixed → improper by multiplying and adding.",
        "examples": [
          "7/4 = 1¾ (7÷4 = 1 remainder 3)",
          "11/3 = 3⅔ (11÷3 = 3 remainder 2)",
          "2¾ = (2×4+3)/4 = 11/4",
          "5½ = (5×2+1)/2 = 11/2"
        ],
        "exercises": [
          {
            "q": "Convert to mixed number:",
            "parts": [
              "7/4",
              "11/3",
              "9/2",
              "15/4",
              "13/5",
              "17/6"
            ],
            "ans": [
              "1¾",
              "3⅔",
              "4½",
              "3¾",
              "2⅗",
              "2⅚"
            ]
          },
          {
            "q": "Convert to improper fraction:",
            "parts": [
              "2¾",
              "3½",
              "1⅔",
              "4¼",
              "5⅗",
              "2⅚"
            ],
            "ans": [
              "11/4",
              "7/2",
              "5/3",
              "17/4",
              "28/5",
              "17/6"
            ]
          }
        ],
        "wordProblems": [
          "Ali has 11/4 meters of rope. Write as a mixed number.",
          "Sara baked 3½ dozen cookies. How many dozens is that as an improper fraction?",
          "A jug holds 7/2 liters. Express as a mixed number."
        ],
        "quiz": [
          {
            "q": "7/4 as mixed:",
            "a": [
              "1¼",
              "1½",
              "1¾",
              "2¼"
            ],
            "c": 2
          },
          {
            "q": "2¾ as improper:",
            "a": [
              "8/4",
              "9/4",
              "10/4",
              "11/4"
            ],
            "c": 3
          },
          {
            "q": "11/3 as mixed:",
            "a": [
              "3⅓",
              "3½",
              "3⅔",
              "4⅓"
            ],
            "c": 2
          },
          {
            "q": "3½ as improper:",
            "a": [
              "5/2",
              "6/2",
              "7/2",
              "8/2"
            ],
            "c": 2
          },
          {
            "q": "15/4 as mixed:",
            "a": [
              "3¼",
              "3½",
              "3¾",
              "4¼"
            ],
            "c": 2
          },
          {
            "q": "To convert mixed → improper:",
            "a": [
              "Add",
              "Multiply whole by denom, add numer",
              "Subtract",
              "Divide"
            ],
            "c": 1
          }
        ]
      },
      {
        "t": "Equivalent Fractions",
        "c": "Fractions that look different but have the same value. Multiply or divide both parts by the same number.",
        "examples": [
          "1/2 = 2/4 = 3/6 = 4/8 = 5/10",
          "2/3 = 4/6 = 6/9 = 8/12",
          "3/4 = 6/8 = 9/12 = 12/16"
        ],
        "exercises": [
          {
            "q": "Find equivalent fractions:",
            "parts": [
              "1/2 = ?/6",
              "2/3 = ?/9",
              "3/4 = ?/12",
              "1/5 = ?/20",
              "4/5 = ?/15",
              "2/7 = ?/14"
            ],
            "ans": [
              "3/6",
              "6/9",
              "9/12",
              "4/20",
              "12/15",
              "4/14"
            ]
          },
          {
            "q": "Are these equivalent? (Yes/No):",
            "parts": [
              "2/4 and 3/6",
              "1/3 and 3/8",
              "4/6 and 6/9",
              "5/10 and 3/6"
            ],
            "ans": [
              "Yes (both = 1/2)",
              "No",
              "Yes (both = 2/3)",
              "Yes (both = 1/2)"
            ]
          }
        ],
        "wordProblems": [
          "Ali ate 2/4 of a pizza and Sara ate 3/6. Did they eat the same amount?",
          "Find three fractions equivalent to 3/5.",
          "Is 4/8 the same as 1/2? Prove it."
        ],
        "quiz": [
          {
            "q": "1/2 = ?/8",
            "a": [
              "2",
              "3",
              "4",
              "5"
            ],
            "c": 2
          },
          {
            "q": "2/3 = 6/?",
            "a": [
              "6",
              "8",
              "9",
              "12"
            ],
            "c": 2
          },
          {
            "q": "Which equals 3/4?",
            "a": [
              "6/9",
              "8/12",
              "9/16",
              "6/8"
            ],
            "c": 3
          },
          {
            "q": "Are 2/4 and 1/2 equivalent?",
            "a": [
              "Yes",
              "No"
            ],
            "c": 0
          },
          {
            "q": "4/6 simplified:",
            "a": [
              "2/4",
              "2/3",
              "3/4",
              "1/2"
            ],
            "c": 1
          },
          {
            "q": "To make equivalent fractions:",
            "a": [
              "Add same number",
              "Multiply both by same number",
              "Subtract",
              "Divide top only"
            ],
            "c": 1
          }
        ]
      },
      {
        "t": "Simplifying",
        "c": "Divide both numerator and denominator by their HCF to get the simplest form.",
        "examples": [
          "8/12: HCF(8,12) = 4 → 8÷4/12÷4 = 2/3",
          "6/9: HCF = 3 → 2/3",
          "15/25: HCF = 5 → 3/5",
          "10/10 = 1",
          "20/30: HCF = 10 → 2/3"
        ],
        "exercises": [
          {
            "q": "Simplify:",
            "parts": [
              "8/12",
              "6/9",
              "15/25",
              "10/20",
              "4/16",
              "12/18",
              "9/27",
              "20/30",
              "14/21",
              "25/100"
            ],
            "ans": [
              "2/3",
              "2/3",
              "3/5",
              "1/2",
              "1/4",
              "2/3",
              "1/3",
              "2/3",
              "2/3",
              "1/4"
            ]
          }
        ],
        "wordProblems": [
          "Simplify 24/36 and explain your steps.",
          "Ali scored 15 out of 25. Write as a simplified fraction.",
          "A class has 12 boys out of 30 students. Simplify the fraction of boys."
        ],
        "quiz": [
          {
            "q": "8/12 simplified:",
            "a": [
              "4/6",
              "2/3",
              "2/4",
              "4/8"
            ],
            "c": 1
          },
          {
            "q": "15/25 simplified:",
            "a": [
              "3/5",
              "5/3",
              "1/5",
              "5/25"
            ],
            "c": 0
          },
          {
            "q": "To simplify, divide by:",
            "a": [
              "LCM",
              "HCF",
              "Sum",
              "Difference"
            ],
            "c": 1
          },
          {
            "q": "6/9 simplified:",
            "a": [
              "3/9",
              "2/9",
              "2/3",
              "3/6"
            ],
            "c": 2
          },
          {
            "q": "10/20 simplified:",
            "a": [
              "1/2",
              "5/10",
              "2/4",
              "1/10"
            ],
            "c": 0
          },
          {
            "q": "Which is already simplest?",
            "a": [
              "4/8",
              "6/9",
              "3/7",
              "10/15"
            ],
            "c": 2
          }
        ]
      },
      {
        "t": "Add & Subtract Fractions",
        "c": "Same denominator: add/subtract numerators. Different denominators: find LCM first, make equivalent, then operate.",
        "examples": [
          "2/7 + 3/7 = 5/7",
          "1/3 + 1/4 = 4/12 + 3/12 = 7/12",
          "5/6 - 1/6 = 4/6 = 2/3",
          "3/4 - 1/3 = 9/12 - 4/12 = 5/12"
        ],
        "exercises": [
          {
            "q": "Add:",
            "parts": [
              "2/7 + 3/7",
              "1/4 + 2/4",
              "1/3 + 1/6",
              "2/5 + 1/3",
              "3/8 + 1/4",
              "1/2 + 1/3"
            ],
            "ans": [
              "5/7",
              "3/4",
              "3/6 = 1/2",
              "6/15+5/15 = 11/15",
              "3/8+2/8 = 5/8",
              "3/6+2/6 = 5/6"
            ]
          },
          {
            "q": "Subtract:",
            "parts": [
              "5/7 - 2/7",
              "3/4 - 1/4",
              "5/6 - 1/3",
              "3/4 - 1/3",
              "7/8 - 1/2",
              "2/3 - 1/4"
            ],
            "ans": [
              "3/7",
              "2/4 = 1/2",
              "5/6 - 2/6 = 3/6 = 1/2",
              "9/12 - 4/12 = 5/12",
              "7/8 - 4/8 = 3/8",
              "8/12 - 3/12 = 5/12"
            ]
          }
        ],
        "wordProblems": [
          "Ali ate 1/4 of a cake and Sara ate 1/3. How much did they eat together?",
          "A tank is 3/4 full. 1/3 is used. How much is left?",
          "Ali walked 2/5 km and then 1/3 km more. Total distance?"
        ],
        "quiz": [
          {
            "q": "2/7 + 3/7 = ?",
            "a": [
              "5/7",
              "5/14",
              "6/7",
              "1"
            ],
            "c": 0
          },
          {
            "q": "1/3 + 1/4 = ?",
            "a": [
              "2/7",
              "2/12",
              "7/12",
              "1/7"
            ],
            "c": 2
          },
          {
            "q": "5/6 - 1/6 = ?",
            "a": [
              "4/6",
              "4/12",
              "2/3",
              "Both A and C"
            ],
            "c": 3
          },
          {
            "q": "Same denominator: add the:",
            "a": [
              "Denominators",
              "Numerators",
              "Both",
              "Neither"
            ],
            "c": 1
          },
          {
            "q": "3/4 - 1/3 = ?",
            "a": [
              "2/1",
              "5/12",
              "1/6",
              "4/12"
            ],
            "c": 1
          },
          {
            "q": "Different denominators → find:",
            "a": [
              "HCF",
              "LCM",
              "Sum",
              "Product"
            ],
            "c": 1
          }
        ]
      },
      {
        "t": "Multiply Fractions",
        "c": "Multiply numerators together and denominators together. Simplify the result.",
        "examples": [
          "2/3 × 4/5 = 8/15",
          "1/2 × 3/4 = 3/8",
          "5/6 × 3/10 = 15/60 = 1/4",
          "Any fraction × 1 = itself",
          "Any fraction × 0 = 0"
        ],
        "exercises": [
          {
            "q": "Multiply:",
            "parts": [
              "2/3 × 4/5",
              "1/2 × 3/4",
              "5/6 × 3/10",
              "2/5 × 5/8",
              "3/7 × 7/9",
              "4/5 × 1/2"
            ],
            "ans": [
              "8/15",
              "3/8",
              "15/60 = 1/4",
              "10/40 = 1/4",
              "21/63 = 1/3",
              "4/10 = 2/5"
            ]
          }
        ],
        "wordProblems": [
          "Ali has 3/4 of a pizza. He eats 1/2 of it. How much pizza did he eat?",
          "A recipe needs 2/3 cup of sugar. If making half the recipe, how much sugar?",
          "A field is 5/6 km long. A farmer plows 3/10 of it. How much was plowed?"
        ],
        "quiz": [
          {
            "q": "2/3 × 4/5 = ?",
            "a": [
              "6/8",
              "8/15",
              "8/8",
              "6/15"
            ],
            "c": 1
          },
          {
            "q": "1/2 × 3/4 = ?",
            "a": [
              "4/6",
              "3/8",
              "3/6",
              "4/8"
            ],
            "c": 1
          },
          {
            "q": "To multiply fractions:",
            "a": [
              "Cross multiply",
              "Top × top, bottom × bottom",
              "Add",
              "Find LCM"
            ],
            "c": 1
          },
          {
            "q": "5/6 × 3/10 = ?",
            "a": [
              "8/16",
              "15/60",
              "2/16",
              "1/2"
            ],
            "c": 1
          },
          {
            "q": "Any fraction × 0 = ?",
            "a": [
              "That fraction",
              "1",
              "0",
              "Undefined"
            ],
            "c": 2
          },
          {
            "q": "3/4 × 4/3 = ?",
            "a": [
              "12/12 = 1",
              "7/7",
              "1/1",
              "9/16"
            ],
            "c": 0
          }
        ]
      }
    ],
    "id": "math_5_4"
  },
  {
    "title": "Decimals",
    "content": "Decimal place value, fraction-decimal conversion, operations, comparing.",
    "key": "decimals5",
    "hasMathSub": true,
    "subs": [
      {
        "t": "Decimal Place Value",
        "c": "The decimal point separates wholes from parts. Tenths = 1/10, Hundredths = 1/100, Thousandths = 1/1000.",
        "examples": [
          "3.47: 3 ones, 4 tenths, 7 hundredths",
          "0.5 = 5 tenths = 5/10 = 1/2",
          "0.25 = 25 hundredths = 25/100 = 1/4",
          "12.08: 1 ten, 2 ones, 0 tenths, 8 hundredths"
        ],
        "exercises": [
          {
            "q": "Write the place value of the underlined digit:",
            "parts": [
              "3.[4]7",
              "0.[2]5",
              "12.0[8]",
              "5.6[3]",
              "0.[9]1",
              "100.[0]5"
            ],
            "ans": [
              "4 tenths",
              "2 tenths",
              "8 hundredths",
              "3 hundredths",
              "9 tenths",
              "0 tenths"
            ]
          }
        ],
        "wordProblems": [
          "A pencil costs Rs 12.50. What does the 5 represent?",
          "Ali ran 3.75 km. Break down each digit's value.",
          "The temperature is 36.8°C. What place is the 8 in?"
        ],
        "quiz": [
          {
            "q": "In 3.47, the 4 is in:",
            "a": [
              "Ones",
              "Tenths",
              "Hundredths",
              "Thousands"
            ],
            "c": 1
          },
          {
            "q": "0.25 = ?",
            "a": [
              "25/10",
              "25/100",
              "25/1000",
              "2/5"
            ],
            "c": 1
          },
          {
            "q": "Tenths place is ___ decimal point:",
            "a": [
              "Before",
              "1st after",
              "2nd after",
              "3rd after"
            ],
            "c": 1
          },
          {
            "q": "12.08: the 8 is in:",
            "a": [
              "Tenths",
              "Hundredths",
              "Ones",
              "Tens"
            ],
            "c": 1
          },
          {
            "q": "0.5 as fraction:",
            "a": [
              "5/100",
              "5/10",
              "5/1000",
              "1/5"
            ],
            "c": 1
          },
          {
            "q": "How many decimal places in 3.456?",
            "a": [
              "1",
              "2",
              "3",
              "4"
            ],
            "c": 2
          }
        ]
      },
      {
        "t": "Fractions ↔ Decimals",
        "c": "Fraction to decimal: divide numerator by denominator. Decimal to fraction: use place value then simplify.",
        "examples": [
          "1/2 = 0.5",
          "1/4 = 0.25",
          "3/4 = 0.75",
          "1/5 = 0.2",
          "0.6 = 6/10 = 3/5",
          "0.125 = 125/1000 = 1/8"
        ],
        "exercises": [
          {
            "q": "Convert fraction to decimal:",
            "parts": [
              "1/2",
              "1/4",
              "3/4",
              "1/5",
              "2/5",
              "3/8",
              "7/10",
              "1/8"
            ],
            "ans": [
              "0.5",
              "0.25",
              "0.75",
              "0.2",
              "0.4",
              "0.375",
              "0.7",
              "0.125"
            ]
          },
          {
            "q": "Convert decimal to fraction:",
            "parts": [
              "0.5",
              "0.25",
              "0.75",
              "0.6",
              "0.8",
              "0.125",
              "0.04",
              "0.9"
            ],
            "ans": [
              "1/2",
              "1/4",
              "3/4",
              "3/5",
              "4/5",
              "1/8",
              "1/25",
              "9/10"
            ]
          }
        ],
        "wordProblems": [
          "Ali ate 3/4 of a pizza. Express as a decimal.",
          "A bottle is 0.75 liters. Express as a fraction.",
          "Sara scored 7/10 on a test. What decimal is that?"
        ],
        "quiz": [
          {
            "q": "1/4 as decimal:",
            "a": [
              "0.4",
              "0.25",
              "0.14",
              "0.75"
            ],
            "c": 1
          },
          {
            "q": "0.6 as fraction:",
            "a": [
              "6/100",
              "3/5",
              "6/5",
              "1/6"
            ],
            "c": 1
          },
          {
            "q": "3/4 as decimal:",
            "a": [
              "0.34",
              "0.43",
              "0.75",
              "0.80"
            ],
            "c": 2
          },
          {
            "q": "0.125 as fraction:",
            "a": [
              "1/8",
              "1/4",
              "1/5",
              "1/125"
            ],
            "c": 0
          },
          {
            "q": "1/5 as decimal:",
            "a": [
              "0.5",
              "0.15",
              "0.2",
              "0.25"
            ],
            "c": 2
          },
          {
            "q": "0.9 as fraction:",
            "a": [
              "9/100",
              "1/9",
              "9/10",
              "90/10"
            ],
            "c": 2
          }
        ]
      },
      {
        "t": "Add & Subtract Decimals",
        "c": "Line up decimal points vertically. Add trailing zeros if needed. Then add or subtract normally.",
        "examples": [
          "3.45 + 2.70 = 6.15",
          "10.00 - 4.56 = 5.44",
          "0.5 + 0.25 = 0.75",
          "7.8 - 3.45 = 7.80 - 3.45 = 4.35"
        ],
        "exercises": [
          {
            "q": "Add:",
            "parts": [
              "3.45 + 2.7",
              "0.5 + 0.25",
              "12.34 + 5.66",
              "8.9 + 1.1",
              "0.75 + 0.25",
              "45.67 + 4.33"
            ],
            "ans": [
              "6.15",
              "0.75",
              "18.00",
              "10.0",
              "1.00",
              "50.00"
            ]
          },
          {
            "q": "Subtract:",
            "parts": [
              "10.00 - 4.56",
              "7.8 - 3.45",
              "5.00 - 2.75",
              "9.5 - 0.75",
              "100.00 - 45.67",
              "3.4 - 1.85"
            ],
            "ans": [
              "5.44",
              "4.35",
              "2.25",
              "8.75",
              "54.33",
              "1.55"
            ]
          }
        ],
        "wordProblems": [
          "Ali bought items for Rs 45.50 and Rs 23.75. What is the total?",
          "Sara had Rs 100.00. She spent Rs 67.85. How much is left?",
          "Two ropes are 3.45m and 2.7m long. What is their total length?"
        ],
        "quiz": [
          {
            "q": "3.45 + 2.7 = ?",
            "a": [
              "5.15",
              "6.15",
              "6.25",
              "5.75"
            ],
            "c": 1
          },
          {
            "q": "10.00 - 4.56 = ?",
            "a": [
              "5.44",
              "5.54",
              "6.44",
              "5.34"
            ],
            "c": 0
          },
          {
            "q": "Key rule for adding decimals:",
            "a": [
              "Line up last digits",
              "Line up decimal points",
              "Line up first digits",
              "No rule"
            ],
            "c": 1
          },
          {
            "q": "0.5 + 0.25 = ?",
            "a": [
              "0.30",
              "0.75",
              "0.70",
              "1.00"
            ],
            "c": 1
          },
          {
            "q": "7.8 - 3.45 = ?",
            "a": [
              "4.35",
              "4.45",
              "3.35",
              "4.25"
            ],
            "c": 0
          },
          {
            "q": "5.00 - 2.75 = ?",
            "a": [
              "2.25",
              "2.75",
              "3.25",
              "2.35"
            ],
            "c": 0
          }
        ]
      },
      {
        "t": "Comparing Decimals",
        "c": "Compare digit by digit from left. Add trailing zeros to make lengths equal. The first different digit determines which is larger.",
        "examples": [
          "0.5 > 0.45 (compare: 0.50 vs 0.45, tenths 5 > 4)",
          "3.14 < 3.2 (compare: 3.14 vs 3.20, tenths 1 < 2)",
          "0.30 = 0.3 (trailing zeros don't change value)",
          "7.891 > 7.89 (7.891 vs 7.890)"
        ],
        "exercises": [
          {
            "q": "Write > , < or = :",
            "parts": [
              "0.5 ___ 0.45",
              "3.14 ___ 3.2",
              "0.30 ___ 0.3",
              "7.89 ___ 7.9",
              "1.05 ___ 1.50",
              "0.99 ___ 1.0",
              "2.500 ___ 2.5",
              "4.56 ___ 4.560"
            ],
            "ans": [
              ">",
              "<",
              "=",
              "<",
              "<",
              "<",
              "=",
              "="
            ]
          },
          {
            "q": "Arrange in ascending order:",
            "parts": [
              "0.5, 0.45, 0.55, 0.4",
              "3.14, 3.2, 3.09, 3.15",
              "1.1, 1.01, 1.10, 0.99"
            ],
            "ans": [
              "0.4, 0.45, 0.5, 0.55",
              "3.09, 3.14, 3.15, 3.2",
              "0.99, 1.01, 1.1, 1.10"
            ]
          }
        ],
        "wordProblems": [
          "Ali ran 3.14 km and Sara ran 3.2 km. Who ran farther?",
          "Which is heavier: 0.5 kg or 0.45 kg?",
          "Arrange these prices from cheapest: Rs 9.99, Rs 10.00, Rs 9.90, Rs 10.01"
        ],
        "quiz": [
          {
            "q": "0.5 vs 0.45:",
            "a": [
              "0.5 < 0.45",
              "0.5 > 0.45",
              "Equal",
              "Cannot compare"
            ],
            "c": 1
          },
          {
            "q": "3.14 vs 3.2:",
            "a": [
              "3.14 > 3.2",
              "3.14 < 3.2",
              "Equal",
              "Cannot compare"
            ],
            "c": 1
          },
          {
            "q": "0.30 vs 0.3:",
            "a": [
              "0.30 > 0.3",
              "0.30 < 0.3",
              "Equal",
              "0.30 is bigger"
            ],
            "c": 2
          },
          {
            "q": "To compare decimals:",
            "a": [
              "Count digits",
              "Line up decimal points, compare left to right",
              "Always pick longer number",
              "Ignore decimals"
            ],
            "c": 1
          },
          {
            "q": "Which is largest?",
            "a": [
              "0.9",
              "0.99",
              "0.09",
              "0.909"
            ],
            "c": 1
          },
          {
            "q": "0.99 vs 1.0:",
            "a": [
              "0.99 > 1.0",
              "Equal",
              "0.99 < 1.0",
              "Cannot tell"
            ],
            "c": 2
          }
        ]
      }
    ],
    "id": "math_5_5"
  },
  {
    "title": "Ratio & Percentage",
    "content": "Simple ratios, converting to fractions, basic percentages, real-life problems.",
    "key": "ratio5",
    "hasMathSub": true,
    "subs": [
      {
        "t": "Simple Ratios",
        "c": "A ratio compares two quantities. Written as a:b. Order matters. Can be simplified like fractions.",
        "examples": [
          "2 boys, 3 girls → ratio 2:3",
          "4:6 simplified = 2:3 (divide both by 2)",
          "10:15 = 2:3",
          "Ratio of 8 to 12 = 8:12 = 2:3"
        ],
        "exercises": [
          {
            "q": "Write the ratio and simplify:",
            "parts": [
              "6 boys to 9 girls",
              "10 red to 15 blue",
              "8 cats to 12 dogs",
              "20 apples to 30 oranges",
              "4 to 4",
              "100 to 50"
            ],
            "ans": [
              "6:9 = 2:3",
              "10:15 = 2:3",
              "8:12 = 2:3",
              "20:30 = 2:3",
              "4:4 = 1:1",
              "100:50 = 2:1"
            ]
          }
        ],
        "wordProblems": [
          "A class has 15 boys and 20 girls. Find the ratio of boys to girls in simplest form.",
          "Mix paint in ratio 2:5. If you use 6 cups of color A, how many cups of color B?",
          "A recipe uses flour and sugar in ratio 3:1. If you use 9 cups of flour, how much sugar?"
        ],
        "quiz": [
          {
            "q": "Ratio of 6 to 9 simplified:",
            "a": [
              "6:9",
              "3:2",
              "2:3",
              "1:3"
            ],
            "c": 2
          },
          {
            "q": "10:15 = ?",
            "a": [
              "5:3",
              "2:3",
              "3:2",
              "1:3"
            ],
            "c": 1
          },
          {
            "q": "Order matters in ratio?",
            "a": [
              "Yes",
              "No",
              "Sometimes",
              "Never"
            ],
            "c": 0
          },
          {
            "q": "4:4 simplified:",
            "a": [
              "4:4",
              "2:2",
              "1:1",
              "0:0"
            ],
            "c": 2
          },
          {
            "q": "Ratio 2:5, total parts:",
            "a": [
              "3",
              "5",
              "7",
              "10"
            ],
            "c": 2
          },
          {
            "q": "20:30 simplified:",
            "a": [
              "2:3",
              "4:6",
              "10:15",
              "1:3"
            ],
            "c": 0
          }
        ]
      },
      {
        "t": "Ratio to Fraction",
        "c": "In ratio a:b, fraction of first = a/(a+b), fraction of second = b/(a+b).",
        "examples": [
          "Ratio 2:3 → first part = 2/5, second = 3/5",
          "10 sweets in ratio 2:3 → group A = 4, group B = 6",
          "Ratio 1:4 → first = 1/5 = 20%, second = 4/5 = 80%"
        ],
        "exercises": [
          {
            "q": "Convert ratio to fractions:",
            "parts": [
              "2:3",
              "1:4",
              "3:7",
              "5:5",
              "1:1",
              "4:1"
            ],
            "ans": [
              "2/5 and 3/5",
              "1/5 and 4/5",
              "3/10 and 7/10",
              "5/10=1/2 and 1/2",
              "1/2 and 1/2",
              "4/5 and 1/5"
            ]
          },
          {
            "q": "Divide the amount by ratio:",
            "parts": [
              "Rs 100 in ratio 2:3",
              "40 sweets in ratio 3:5",
              "60 marks in ratio 1:2",
              "Rs 500 in ratio 4:1"
            ],
            "ans": [
              "Rs 40 and Rs 60",
              "15 and 25",
              "20 and 40",
              "Rs 400 and Rs 100"
            ]
          }
        ],
        "wordProblems": [
          "Ali and Sara share Rs 200 in ratio 3:2. How much does each get?",
          "A rope is cut in ratio 2:5. Total length is 70 cm. Find each piece.",
          "Paint is mixed in ratio 1:3. If total is 8 liters, how much of each color?"
        ],
        "quiz": [
          {
            "q": "Ratio 2:3, first fraction:",
            "a": [
              "2/3",
              "3/5",
              "2/5",
              "3/2"
            ],
            "c": 2
          },
          {
            "q": "Rs 100 in ratio 2:3:",
            "a": [
              "Rs 20 and Rs 30",
              "Rs 40 and Rs 60",
              "Rs 50 and Rs 50",
              "Rs 60 and Rs 40"
            ],
            "c": 1
          },
          {
            "q": "Ratio 1:4, total parts:",
            "a": [
              "3",
              "4",
              "5",
              "14"
            ],
            "c": 2
          },
          {
            "q": "40 sweets in ratio 3:5:",
            "a": [
              "15 and 25",
              "20 and 20",
              "24 and 16",
              "12 and 28"
            ],
            "c": 0
          },
          {
            "q": "Ratio 1:1 means:",
            "a": [
              "Unequal",
              "Equal shares",
              "First gets more",
              "Second gets more"
            ],
            "c": 1
          },
          {
            "q": "Ratio 4:1, first fraction:",
            "a": [
              "1/4",
              "4/5",
              "1/5",
              "4/1"
            ],
            "c": 1
          }
        ]
      },
      {
        "t": "Basic Percentages",
        "c": "Percent = per hundred. 50% = 50/100 = 1/2. Key percentages: 25% = 1/4, 50% = 1/2, 75% = 3/4, 100% = whole.",
        "examples": [
          "50% of 200 = 100",
          "25% of 80 = 20",
          "10% of 500 = 50",
          "75% of 40 = 30",
          "100% of anything = itself",
          "1% of 300 = 3"
        ],
        "exercises": [
          {
            "q": "Find:",
            "parts": [
              "50% of 200",
              "25% of 80",
              "10% of 500",
              "75% of 40",
              "20% of 150",
              "5% of 1,000",
              "100% of 45",
              "1% of 600"
            ],
            "ans": [
              "100",
              "20",
              "50",
              "30",
              "30",
              "50",
              "45",
              "6"
            ]
          },
          {
            "q": "Convert to percentage:",
            "parts": [
              "1/2",
              "1/4",
              "3/4",
              "1/5",
              "2/5",
              "1/10",
              "3/10",
              "7/10"
            ],
            "ans": [
              "50%",
              "25%",
              "75%",
              "20%",
              "40%",
              "10%",
              "30%",
              "70%"
            ]
          }
        ],
        "wordProblems": [
          "Ali scored 75 out of 100. What percentage?",
          "A shirt costs Rs 800. There is a 25% discount. How much do you save?",
          "50% of students in a class of 40 are girls. How many girls?",
          "A test has 20 questions. Sara got 80% correct. How many did she get right?",
          "10% of 500 students were absent. How many were present?"
        ],
        "quiz": [
          {
            "q": "50% of 200:",
            "a": [
              "50",
              "100",
              "150",
              "200"
            ],
            "c": 1
          },
          {
            "q": "25% = ?",
            "a": [
              "1/2",
              "1/3",
              "1/4",
              "1/5"
            ],
            "c": 2
          },
          {
            "q": "10% of 500:",
            "a": [
              "5",
              "50",
              "500",
              "0.5"
            ],
            "c": 1
          },
          {
            "q": "75% of 40:",
            "a": [
              "10",
              "20",
              "30",
              "35"
            ],
            "c": 2
          },
          {
            "q": "100% means:",
            "a": [
              "Nothing",
              "Half",
              "The whole thing",
              "Double"
            ],
            "c": 2
          },
          {
            "q": "1% of 600:",
            "a": [
              "0.6",
              "6",
              "60",
              "600"
            ],
            "c": 1
          },
          {
            "q": "What % is 1/2?",
            "a": [
              "25%",
              "50%",
              "75%",
              "100%"
            ],
            "c": 1
          },
          {
            "q": "20% of 150:",
            "a": [
              "20",
              "25",
              "30",
              "35"
            ],
            "c": 2
          }
        ]
      },
      {
        "t": "Real-life Problems",
        "c": "Percentages are used in discounts, marks, tax, tips, and everyday calculations.",
        "examples": [
          "25% discount on Rs 800: save Rs 200, pay Rs 600",
          "Ali scored 45/50: percentage = (45/50)×100 = 90%",
          "Tax of 10% on Rs 1,000: tax = Rs 100, total = Rs 1,100",
          "Tip of 15% on Rs 500: tip = Rs 75"
        ],
        "exercises": [
          {
            "q": "Solve:",
            "parts": [
              "25% discount on Rs 1,200. How much do you pay?",
              "Ali scored 36/40. What percentage?",
              "10% tax on Rs 2,500. Total amount?",
              "A class of 50 has 80% attendance. How many present?",
              "Price increased by 20% from Rs 500. New price?"
            ],
            "ans": [
              "Rs 900",
              "90%",
              "Rs 2,750",
              "40",
              "Rs 600"
            ]
          }
        ],
        "wordProblems": [
          "A shopkeeper gives 15% discount on Rs 2,000. Find the selling price.",
          "Sara scored 72 out of 80. What is her percentage?",
          "A town's population grew by 10% from 50,000. What is the new population?",
          "Ali saves 25% of his Rs 4,000 salary. How much does he save?",
          "A TV costs Rs 30,000 with 5% tax. What is the total price?"
        ],
        "quiz": [
          {
            "q": "25% discount on Rs 1,200:",
            "a": [
              "Pay Rs 800",
              "Pay Rs 900",
              "Pay Rs 1,000",
              "Pay Rs 300"
            ],
            "c": 1
          },
          {
            "q": "Score 36/40 = ?%",
            "a": [
              "80%",
              "85%",
              "90%",
              "95%"
            ],
            "c": 2
          },
          {
            "q": "10% tax on Rs 2,500:",
            "a": [
              "Rs 250 tax",
              "Rs 25 tax",
              "Rs 2,500 tax",
              "Rs 500 tax"
            ],
            "c": 0
          },
          {
            "q": "80% of 50:",
            "a": [
              "35",
              "40",
              "45",
              "50"
            ],
            "c": 1
          },
          {
            "q": "Price Rs 500 + 20%:",
            "a": [
              "Rs 520",
              "Rs 550",
              "Rs 600",
              "Rs 700"
            ],
            "c": 2
          },
          {
            "q": "15% of Rs 2,000:",
            "a": [
              "Rs 200",
              "Rs 250",
              "Rs 300",
              "Rs 350"
            ],
            "c": 2
          }
        ]
      }
    ],
    "id": "math_5_6"
  },
  {
    "title": "Measurement",
    "content": "Length, mass, capacity, unit conversions, time, temperature.",
    "key": "measurement5",
    "hasMathSub": true,
    "subs": [
      {
        "t": "Length, Mass, Capacity",
        "c": "Length: mm, cm, m, km. Mass: g, kg. Capacity: mL, L. Use the right unit for each situation.",
        "examples": [
          "A pencil is about 15 cm long",
          "A road is measured in km",
          "A bag of flour weighs 1 kg = 1,000 g",
          "A medicine spoon holds about 5 mL",
          "A water bottle holds about 500 mL = 0.5 L",
          "Your height is measured in cm or m"
        ],
        "exercises": [
          {
            "q": "Choose the best unit (mm/cm/m/km/g/kg/mL/L):",
            "parts": [
              "Length of a book",
              "Distance to school",
              "Weight of an apple",
              "Water in a pool",
              "Thickness of a coin",
              "Weight of a car",
              "Medicine dose",
              "Length of a football field"
            ],
            "ans": [
              "cm",
              "km",
              "g",
              "L",
              "mm",
              "kg",
              "mL",
              "m"
            ]
          }
        ],
        "wordProblems": [
          "Ali's book is 25 cm long and 18 cm wide. What unit is used?",
          "A truck carries 5,000 kg. Express in a larger unit.",
          "A recipe needs 250 mL of milk. How many such cups make 1 L?",
          "The school is 2 km away. Express in meters.",
          "A tablet weighs 500 mg. How many tablets make 1 g?"
        ],
        "quiz": [
          {
            "q": "Best unit for road length:",
            "a": [
              "cm",
              "m",
              "km",
              "mm"
            ],
            "c": 2
          },
          {
            "q": "1 kg = ?",
            "a": [
              "10 g",
              "100 g",
              "1,000 g",
              "10,000 g"
            ],
            "c": 2
          },
          {
            "q": "1 L = ?",
            "a": [
              "10 mL",
              "100 mL",
              "1,000 mL",
              "10,000 mL"
            ],
            "c": 2
          },
          {
            "q": "Height measured in:",
            "a": [
              "km",
              "mm",
              "cm or m",
              "mL"
            ],
            "c": 2
          },
          {
            "q": "Medicine dose in:",
            "a": [
              "L",
              "kg",
              "mL",
              "km"
            ],
            "c": 2
          },
          {
            "q": "A car's weight in:",
            "a": [
              "g",
              "mg",
              "kg",
              "cm"
            ],
            "c": 2
          }
        ]
      },
      {
        "t": "Unit Conversions",
        "c": "Bigger to smaller: multiply. Smaller to bigger: divide. Key: 1 km=1000m, 1 m=100cm, 1 kg=1000g, 1 L=1000mL.",
        "examples": [
          "3.5 km = 3,500 m (×1,000)",
          "250 cm = 2.5 m (÷100)",
          "2 kg 500 g = 2,500 g",
          "750 mL = 0.75 L (÷1,000)",
          "4 m 50 cm = 450 cm",
          "1.5 L = 1,500 mL"
        ],
        "exercises": [
          {
            "q": "Convert:",
            "parts": [
              "3.5 km to m",
              "250 cm to m",
              "2 kg 500 g to g",
              "750 mL to L",
              "4 m 50 cm to cm",
              "1.5 L to mL",
              "5,000 m to km",
              "3,200 g to kg"
            ],
            "ans": [
              "3,500 m",
              "2.5 m",
              "2,500 g",
              "0.75 L",
              "450 cm",
              "1,500 mL",
              "5 km",
              "3.2 kg"
            ]
          }
        ],
        "wordProblems": [
          "A rope is 3 m 45 cm long. Express in cm only.",
          "Ali walked 2.5 km. How many meters is that?",
          "A jug holds 1.5 L. How many 250 mL cups can it fill?",
          "A parcel weighs 3 kg 200 g. Express in grams.",
          "The distance is 4,500 m. Express in km."
        ],
        "quiz": [
          {
            "q": "3.5 km = ? m",
            "a": [
              "350",
              "3,500",
              "35,000",
              "35"
            ],
            "c": 1
          },
          {
            "q": "250 cm = ? m",
            "a": [
              "25",
              "2.5",
              "0.25",
              "250"
            ],
            "c": 1
          },
          {
            "q": "Bigger → smaller:",
            "a": [
              "Divide",
              "Multiply",
              "Subtract",
              "Add"
            ],
            "c": 1
          },
          {
            "q": "750 mL = ? L",
            "a": [
              "7.5",
              "75",
              "0.75",
              "0.075"
            ],
            "c": 2
          },
          {
            "q": "1 m = ? cm",
            "a": [
              "10",
              "100",
              "1,000",
              "1"
            ],
            "c": 1
          },
          {
            "q": "5,000 g = ? kg",
            "a": [
              "50",
              "500",
              "5",
              "0.5"
            ],
            "c": 2
          }
        ]
      },
      {
        "t": "Time",
        "c": "1 hour = 60 minutes. 1 minute = 60 seconds. 1 day = 24 hours. Carry over when minutes exceed 60.",
        "examples": [
          "2 hr 45 min + 1 hr 30 min = 4 hr 15 min",
          "3 hr 20 min - 1 hr 50 min = 1 hr 30 min",
          "90 minutes = 1 hr 30 min",
          "2.5 hours = 2 hr 30 min",
          "From 9:15 AM to 11:45 AM = 2 hr 30 min"
        ],
        "exercises": [
          {
            "q": "Add:",
            "parts": [
              "2 hr 45 min + 1 hr 30 min",
              "3 hr 50 min + 2 hr 25 min",
              "5 hr 40 min + 1 hr 35 min",
              "45 min + 30 min"
            ],
            "ans": [
              "4 hr 15 min",
              "6 hr 15 min",
              "7 hr 15 min",
              "1 hr 15 min"
            ]
          },
          {
            "q": "Subtract:",
            "parts": [
              "5 hr 30 min - 2 hr 45 min",
              "3 hr 20 min - 1 hr 50 min",
              "10 hr 00 min - 4 hr 35 min",
              "2 hr 15 min - 55 min"
            ],
            "ans": [
              "2 hr 45 min",
              "1 hr 30 min",
              "5 hr 25 min",
              "1 hr 20 min"
            ]
          },
          {
            "q": "Convert:",
            "parts": [
              "90 min to hr and min",
              "150 min to hr and min",
              "2.5 hr to min",
              "3 hr 15 min to min"
            ],
            "ans": [
              "1 hr 30 min",
              "2 hr 30 min",
              "150 min",
              "195 min"
            ]
          }
        ],
        "wordProblems": [
          "A movie starts at 2:30 PM and lasts 2 hr 15 min. When does it end?",
          "Ali studied from 4:45 PM to 7:00 PM. How long did he study?",
          "A train journey takes 5 hr 40 min. It departs at 8:20 AM. When does it arrive?",
          "Sara slept at 9:30 PM and woke at 6:15 AM. How long did she sleep?",
          "A recipe takes 1 hr 45 min. Ali started at 3:30 PM. When will it be done?"
        ],
        "quiz": [
          {
            "q": "2 hr 45 min + 1 hr 30 min:",
            "a": [
              "3 hr 75 min",
              "4 hr 15 min",
              "4 hr 75 min",
              "3 hr 15 min"
            ],
            "c": 1
          },
          {
            "q": "90 min = ?",
            "a": [
              "1 hr",
              "1 hr 20 min",
              "1 hr 30 min",
              "2 hr"
            ],
            "c": 2
          },
          {
            "q": "1 hour = ? seconds",
            "a": [
              "60",
              "360",
              "600",
              "3,600"
            ],
            "c": 3
          },
          {
            "q": "3 hr 20 min - 1 hr 50 min:",
            "a": [
              "1 hr 30 min",
              "2 hr 30 min",
              "1 hr 70 min",
              "2 hr 10 min"
            ],
            "c": 0
          },
          {
            "q": "2.5 hours = ?",
            "a": [
              "2 hr 5 min",
              "2 hr 50 min",
              "2 hr 30 min",
              "2 hr 25 min"
            ],
            "c": 2
          },
          {
            "q": "1 day = ? hours",
            "a": [
              "12",
              "20",
              "24",
              "48"
            ],
            "c": 2
          }
        ]
      },
      {
        "t": "Temperature",
        "c": "Measured in degrees Celsius (°C). Water freezes at 0°C, boils at 100°C. Body temperature ≈ 37°C.",
        "examples": [
          "Water freezes at 0°C",
          "Water boils at 100°C",
          "Normal body temperature: 37°C",
          "Hot summer day: 40°C to 45°C",
          "Cold winter day: 0°C to 10°C",
          "Room temperature: about 25°C"
        ],
        "exercises": [
          {
            "q": "Arrange from coldest to hottest:",
            "parts": [
              "25°C, 0°C, 100°C, 37°C",
              "40°C, 10°C, 25°C, 5°C",
              "-5°C, 0°C, 10°C, -10°C"
            ],
            "ans": [
              "0, 25, 37, 100",
              "5, 10, 25, 40",
              "-10, -5, 0, 10"
            ]
          },
          {
            "q": "What temperature would you expect?",
            "parts": [
              "Ice cream",
              "Boiling water",
              "A nice spring day",
              "Inside a freezer",
              "Hot tea"
            ],
            "ans": [
              "About -5°C to 0°C",
              "100°C",
              "About 20°C to 25°C",
              "About -18°C",
              "About 60°C to 70°C"
            ]
          }
        ],
        "wordProblems": [
          "The morning temperature is 15°C. By afternoon it rises 12°C. What is the afternoon temperature?",
          "Water is at 80°C. How many more degrees to reach boiling point?",
          "Ali has a fever of 39°C. How much above normal (37°C)?",
          "The temperature dropped from 25°C to 8°C. By how many degrees?",
          "Is -5°C hotter or colder than 0°C?"
        ],
        "quiz": [
          {
            "q": "Water freezes at:",
            "a": [
              "10°C",
              "0°C",
              "100°C",
              "-10°C"
            ],
            "c": 1
          },
          {
            "q": "Body temperature:",
            "a": [
              "25°C",
              "30°C",
              "37°C",
              "40°C"
            ],
            "c": 2
          },
          {
            "q": "Water boils at:",
            "a": [
              "50°C",
              "80°C",
              "100°C",
              "120°C"
            ],
            "c": 2
          },
          {
            "q": "Hot summer day:",
            "a": [
              "10°C",
              "25°C",
              "40°C",
              "0°C"
            ],
            "c": 2
          },
          {
            "q": "Room temperature:",
            "a": [
              "10°C",
              "25°C",
              "37°C",
              "50°C"
            ],
            "c": 1
          },
          {
            "q": "-5°C is ___ than 0°C:",
            "a": [
              "Hotter",
              "Colder",
              "Same",
              "Cannot tell"
            ],
            "c": 1
          }
        ]
      }
    ],
    "id": "math_5_7"
  },
  {
    "title": "Geometry",
    "content": "Lines, angles, parallel/perpendicular, 2D and 3D shapes.",
    "key": "geometry5",
    "hasMathSub": true,
    "subs": [
      {
        "t": "Lines & Angles",
        "c": "Line: infinite both ways. Ray: one endpoint. Segment: two endpoints. Angles: right=90°, acute<90°, obtuse>90°, straight=180°.",
        "examples": [
          "Right angle = 90° (like corner of a book)",
          "Acute angle: 30°, 45°, 60° (sharp, less than 90°)",
          "Obtuse angle: 120°, 150° (wide, between 90° and 180°)",
          "Straight angle = 180° (flat line)",
          "Full rotation = 360°"
        ],
        "exercises": [
          {
            "q": "Classify the angle:",
            "parts": [
              "45°",
              "90°",
              "120°",
              "180°",
              "60°",
              "150°",
              "89°",
              "91°"
            ],
            "ans": [
              "Acute",
              "Right",
              "Obtuse",
              "Straight",
              "Acute",
              "Obtuse",
              "Acute",
              "Obtuse"
            ]
          },
          {
            "q": "True or False:",
            "parts": [
              "A right angle is exactly 90°",
              "An acute angle can be 100°",
              "A straight angle is 180°",
              "An obtuse angle is less than 90°",
              "All angles in a square are right angles"
            ],
            "ans": [
              "True",
              "False",
              "True",
              "False",
              "True"
            ]
          }
        ],
        "wordProblems": [
          "The hands of a clock at 3:00 form what type of angle?",
          "A door opened halfway (90°) forms what angle?",
          "What type of angle does the letter V make?",
          "Two roads meet at 120°. What type of angle?",
          "How many degrees does the minute hand move in 1 hour?"
        ],
        "quiz": [
          {
            "q": "Right angle:",
            "a": [
              "45°",
              "90°",
              "180°",
              "360°"
            ],
            "c": 1
          },
          {
            "q": "Acute angle is:",
            "a": [
              "= 90°",
              "< 90°",
              "> 90°",
              "= 180°"
            ],
            "c": 1
          },
          {
            "q": "Obtuse angle range:",
            "a": [
              "0° to 90°",
              "90° to 180°",
              "180° to 360°",
              "Exactly 90°"
            ],
            "c": 1
          },
          {
            "q": "Straight angle:",
            "a": [
              "90°",
              "180°",
              "270°",
              "360°"
            ],
            "c": 1
          },
          {
            "q": "Clock at 3:00 shows:",
            "a": [
              "Acute",
              "Right",
              "Obtuse",
              "Straight"
            ],
            "c": 1
          },
          {
            "q": "Full rotation:",
            "a": [
              "90°",
              "180°",
              "270°",
              "360°"
            ],
            "c": 3
          }
        ]
      },
      {
        "t": "Parallel & Perpendicular",
        "c": "Parallel lines never meet (like train tracks). Perpendicular lines meet at 90° (like a plus sign).",
        "examples": [
          "Train tracks are parallel",
          "The corner of a room: walls meet at 90° (perpendicular)",
          "The letter H has parallel vertical lines",
          "A plus sign (+) shows perpendicular lines",
          "Opposite edges of a ruler are parallel"
        ],
        "exercises": [
          {
            "q": "Parallel or Perpendicular?",
            "parts": [
              "Train tracks",
              "Corner of a book",
              "Floor and wall",
              "Opposite sides of a rectangle",
              "The letter T",
              "The letter Z (top and bottom lines)"
            ],
            "ans": [
              "Parallel",
              "Perpendicular",
              "Perpendicular",
              "Parallel",
              "Perpendicular",
              "Parallel"
            ]
          },
          {
            "q": "True or False:",
            "parts": [
              "Parallel lines meet at infinity",
              "Perpendicular lines form 90°",
              "A square has both parallel and perpendicular lines",
              "Two lines can be both parallel and perpendicular"
            ],
            "ans": [
              "They never meet",
              "True",
              "True",
              "False"
            ]
          }
        ],
        "wordProblems": [
          "Name 3 examples of parallel lines you see in daily life.",
          "Name 3 examples of perpendicular lines around you.",
          "Are the two rails of a railway track parallel or perpendicular?",
          "Is the crossbar of a goal post perpendicular to the posts?",
          "In the letter E, which lines are parallel?"
        ],
        "quiz": [
          {
            "q": "Parallel lines:",
            "a": [
              "Meet at 90°",
              "Never meet",
              "Cross once",
              "Meet at 180°"
            ],
            "c": 1
          },
          {
            "q": "Perpendicular angle:",
            "a": [
              "45°",
              "60°",
              "90°",
              "180°"
            ],
            "c": 2
          },
          {
            "q": "Train tracks are:",
            "a": [
              "Perpendicular",
              "Parallel",
              "Neither",
              "Both"
            ],
            "c": 1
          },
          {
            "q": "Symbol for parallel:",
            "a": [
              "⊥",
              "||",
              "=",
              "≠"
            ],
            "c": 1
          },
          {
            "q": "Symbol for perpendicular:",
            "a": [
              "⊥",
              "||",
              "=",
              "∠"
            ],
            "c": 0
          },
          {
            "q": "A square has:",
            "a": [
              "Only parallel",
              "Only perpendicular",
              "Both",
              "Neither"
            ],
            "c": 2
          }
        ]
      },
      {
        "t": "2D Shapes",
        "c": "Flat shapes with length and width. Key properties: sides, angles, symmetry.",
        "examples": [
          "Square: 4 equal sides, 4 right angles",
          "Rectangle: opposite sides equal, 4 right angles",
          "Triangle: 3 sides, angles sum = 180°",
          "Circle: no sides, no corners, one curved edge",
          "Pentagon: 5 sides, Hexagon: 6 sides, Octagon: 8 sides"
        ],
        "exercises": [
          {
            "q": "Name the shape:",
            "parts": [
              "4 equal sides, 4 right angles",
              "3 sides",
              "No corners, round",
              "5 sides",
              "Opposite sides equal, 4 right angles",
              "8 sides"
            ],
            "ans": [
              "Square",
              "Triangle",
              "Circle",
              "Pentagon",
              "Rectangle",
              "Octagon"
            ]
          },
          {
            "q": "How many sides?",
            "parts": [
              "Triangle",
              "Square",
              "Pentagon",
              "Hexagon",
              "Octagon",
              "Circle"
            ],
            "ans": [
              "3",
              "4",
              "5",
              "6",
              "8",
              "0 (curved)"
            ]
          }
        ],
        "wordProblems": [
          "A stop sign is what shape? How many sides does it have?",
          "A clock face is what shape?",
          "Name all quadrilaterals (4-sided shapes) you know.",
          "Can a triangle have two right angles? Why not?",
          "What shape has the most lines of symmetry?"
        ],
        "quiz": [
          {
            "q": "Square has ___ equal sides:",
            "a": [
              "2",
              "3",
              "4",
              "5"
            ],
            "c": 2
          },
          {
            "q": "Triangle angles sum:",
            "a": [
              "90°",
              "180°",
              "270°",
              "360°"
            ],
            "c": 1
          },
          {
            "q": "Circle has ___ corners:",
            "a": [
              "1",
              "2",
              "4",
              "0"
            ],
            "c": 3
          },
          {
            "q": "Hexagon sides:",
            "a": [
              "5",
              "6",
              "7",
              "8"
            ],
            "c": 1
          },
          {
            "q": "Rectangle vs square:",
            "a": [
              "Same thing",
              "Rectangle has all equal sides",
              "Square has all equal sides",
              "Neither has right angles"
            ],
            "c": 2
          },
          {
            "q": "Stop sign shape:",
            "a": [
              "Pentagon",
              "Hexagon",
              "Heptagon",
              "Octagon"
            ],
            "c": 3
          }
        ]
      },
      {
        "t": "3D Shapes",
        "c": "Shapes with length, width, and height. They have faces, edges, and vertices (corners).",
        "examples": [
          "Cube: 6 square faces, 12 edges, 8 vertices (dice)",
          "Cuboid: 6 rectangular faces (box, brick)",
          "Sphere: perfectly round, 0 faces, 0 edges (ball)",
          "Cylinder: 2 circular faces, 1 curved surface (can)",
          "Cone: 1 circular base, 1 vertex at top (ice cream cone)",
          "Pyramid: triangular faces meeting at a point"
        ],
        "exercises": [
          {
            "q": "Name the 3D shape:",
            "parts": [
              "A dice",
              "A football",
              "A tin can",
              "An ice cream cone",
              "A brick",
              "An Egyptian structure"
            ],
            "ans": [
              "Cube",
              "Sphere",
              "Cylinder",
              "Cone",
              "Cuboid",
              "Pyramid"
            ]
          },
          {
            "q": "Count faces, edges, vertices:",
            "parts": [
              "Cube",
              "Cuboid",
              "Cylinder",
              "Cone",
              "Sphere"
            ],
            "ans": [
              "6 faces, 12 edges, 8 vertices",
              "6, 12, 8",
              "3 surfaces (2 flat + 1 curved), 2 edges, 0 vertices",
              "2 surfaces (1 flat + 1 curved), 1 edge, 1 vertex",
              "1 curved surface, 0 edges, 0 vertices"
            ]
          }
        ],
        "wordProblems": [
          "What 3D shape is a tennis ball?",
          "A Toblerone box is what shape?",
          "How is a cube different from a cuboid?",
          "Name 3 objects shaped like a cylinder.",
          "A party hat is what 3D shape?"
        ],
        "quiz": [
          {
            "q": "Cube has ___ faces:",
            "a": [
              "4",
              "6",
              "8",
              "12"
            ],
            "c": 1
          },
          {
            "q": "Sphere has ___ edges:",
            "a": [
              "0",
              "1",
              "2",
              "4"
            ],
            "c": 0
          },
          {
            "q": "Cylinder looks like:",
            "a": [
              "A ball",
              "A box",
              "A can",
              "A cone"
            ],
            "c": 2
          },
          {
            "q": "Cone has ___ vertex:",
            "a": [
              "0",
              "1",
              "2",
              "3"
            ],
            "c": 1
          },
          {
            "q": "Cuboid faces:",
            "a": [
              "4 rectangles",
              "6 rectangles",
              "6 squares",
              "8 rectangles"
            ],
            "c": 1
          },
          {
            "q": "Pyramid base shape:",
            "a": [
              "Always circle",
              "Always square",
              "Can vary",
              "Always triangle"
            ],
            "c": 2
          }
        ]
      }
    ],
    "id": "math_5_8"
  },
  {
    "title": "Perimeter, Area & Volume",
    "content": "Perimeter of shapes, area of rectangles/squares, volume of cubes/cuboids, word problems.",
    "key": "pav5",
    "hasMathSub": true,
    "subs": [
      {
        "t": "Perimeter",
        "c": "Perimeter = total distance around a shape. Add all sides.",
        "examples": [
          "Square (side 5cm): P = 4 × 5 = 20 cm",
          "Rectangle (8×5cm): P = 2×(8+5) = 26 cm",
          "Triangle (3,4,5cm): P = 3+4+5 = 12 cm",
          "Regular pentagon (side 6cm): P = 5 × 6 = 30 cm"
        ],
        "exercises": [
          {
            "q": "Find the perimeter:",
            "parts": [
              "Square, side 7 cm",
              "Rectangle, 12 cm × 5 cm",
              "Triangle, sides 6, 8, 10 cm",
              "Square, side 15 m",
              "Rectangle, 20 m × 10 m",
              "Equilateral triangle, side 9 cm"
            ],
            "ans": [
              "28 cm",
              "34 cm",
              "24 cm",
              "60 m",
              "60 m",
              "27 cm"
            ]
          }
        ],
        "wordProblems": [
          "A garden is 25 m × 15 m. Find the perimeter. If fencing costs Rs 50/m, find total cost.",
          "A square park has side 100 m. Ali runs around it 3 times. How far does he run?",
          "A picture frame is 30 cm × 20 cm. How much border strip is needed?",
          "A triangular field has sides 45 m, 60 m, and 75 m. Find its perimeter.",
          "A room is 6 m × 4 m. Find the perimeter. If skirting costs Rs 120/m, find total cost."
        ],
        "quiz": [
          {
            "q": "Square side 7, perimeter:",
            "a": [
              "14",
              "21",
              "28",
              "49"
            ],
            "c": 2
          },
          {
            "q": "Rectangle 12×5, perimeter:",
            "a": [
              "17",
              "34",
              "60",
              "120"
            ],
            "c": 1
          },
          {
            "q": "Perimeter formula for rectangle:",
            "a": [
              "l × w",
              "2(l+w)",
              "l + w",
              "4 × side"
            ],
            "c": 1
          },
          {
            "q": "Equilateral triangle side 9:",
            "a": [
              "18",
              "27",
              "36",
              "45"
            ],
            "c": 1
          },
          {
            "q": "Perimeter measures:",
            "a": [
              "Inside space",
              "Distance around",
              "Volume",
              "Weight"
            ],
            "c": 1
          },
          {
            "q": "Square side 15m, P:",
            "a": [
              "30 m",
              "45 m",
              "60 m",
              "225 m"
            ],
            "c": 2
          }
        ]
      },
      {
        "t": "Area",
        "c": "Area = space inside a shape. Measured in square units (cm², m²).",
        "examples": [
          "Square (side 5): A = 5 × 5 = 25 cm²",
          "Rectangle (8×5): A = 8 × 5 = 40 cm²",
          "A room 6 m × 4 m = 24 m²",
          "Square (side 10): A = 100 cm²"
        ],
        "exercises": [
          {
            "q": "Find the area:",
            "parts": [
              "Square, side 6 cm",
              "Rectangle, 10 × 4 cm",
              "Square, side 12 m",
              "Rectangle, 15 × 8 m",
              "Square, side 25 cm",
              "Rectangle, 100 × 50 m"
            ],
            "ans": [
              "36 cm²",
              "40 cm²",
              "144 m²",
              "120 m²",
              "625 cm²",
              "5,000 m²"
            ]
          }
        ],
        "wordProblems": [
          "A room is 6 m × 4 m. If carpet costs Rs 500/m², find total cost.",
          "A square garden has side 20 m. Find its area.",
          "A wall is 5 m × 3 m. How many 1 m² tiles are needed?",
          "A rectangular field is 100 m × 60 m. Find area in m².",
          "A photo is 15 cm × 10 cm. Find its area."
        ],
        "quiz": [
          {
            "q": "Square side 6, area:",
            "a": [
              "12",
              "24",
              "36",
              "48"
            ],
            "c": 2
          },
          {
            "q": "Rectangle 10×4, area:",
            "a": [
              "14",
              "28",
              "40",
              "80"
            ],
            "c": 2
          },
          {
            "q": "Area measured in:",
            "a": [
              "cm",
              "m",
              "cm²",
              "cm³"
            ],
            "c": 2
          },
          {
            "q": "Square side 12m, area:",
            "a": [
              "48 m²",
              "144 m²",
              "24 m²",
              "120 m²"
            ],
            "c": 1
          },
          {
            "q": "Area formula for rectangle:",
            "a": [
              "2(l+w)",
              "l + w",
              "l × w",
              "4 × side"
            ],
            "c": 2
          },
          {
            "q": "Room 6×4m, carpet Rs500/m²:",
            "a": [
              "Rs 10,000",
              "Rs 12,000",
              "Rs 24,000",
              "Rs 5,000"
            ],
            "c": 1
          }
        ]
      },
      {
        "t": "Volume",
        "c": "Volume = space inside a 3D shape. Measured in cubic units (cm³, m³).",
        "examples": [
          "Cube (side 3): V = 3×3×3 = 27 cm³",
          "Cuboid (5×3×2): V = 5×3×2 = 30 cm³",
          "Cube (side 10): V = 1,000 cm³ = 1 L",
          "1 cm³ = 1 mL, 1,000 cm³ = 1 L"
        ],
        "exercises": [
          {
            "q": "Find the volume:",
            "parts": [
              "Cube, side 4 cm",
              "Cuboid, 6×3×2 cm",
              "Cube, side 5 m",
              "Cuboid, 10×5×4 cm",
              "Cube, side 10 cm",
              "Cuboid, 8×6×3 m"
            ],
            "ans": [
              "64 cm³",
              "36 cm³",
              "125 m³",
              "200 cm³",
              "1,000 cm³",
              "144 m³"
            ]
          }
        ],
        "wordProblems": [
          "A box is 5 cm × 3 cm × 2 cm. Find its volume.",
          "A cube-shaped tank has side 10 cm. How many mL of water can it hold?",
          "A room is 5 m × 4 m × 3 m. Find the volume of air inside.",
          "A cuboid container is 20 × 10 × 15 cm. Find its volume in cm³.",
          "A sugar cube has side 1 cm. What is its volume?"
        ],
        "quiz": [
          {
            "q": "Cube side 4, volume:",
            "a": [
              "16",
              "32",
              "64",
              "256"
            ],
            "c": 2
          },
          {
            "q": "Cuboid 6×3×2:",
            "a": [
              "11",
              "24",
              "36",
              "72"
            ],
            "c": 2
          },
          {
            "q": "Volume measured in:",
            "a": [
              "cm",
              "cm²",
              "cm³",
              "m"
            ],
            "c": 2
          },
          {
            "q": "Cube side 10, volume:",
            "a": [
              "30",
              "100",
              "1,000",
              "10,000"
            ],
            "c": 2
          },
          {
            "q": "1,000 cm³ = ?",
            "a": [
              "1 mL",
              "1 L",
              "1 m³",
              "10 L"
            ],
            "c": 1
          },
          {
            "q": "Volume formula for cuboid:",
            "a": [
              "l+w+h",
              "l×w",
              "2(l+w+h)",
              "l×w×h"
            ],
            "c": 3
          }
        ]
      },
      {
        "t": "Word Problems",
        "c": "Apply perimeter, area, and volume formulas to real-life situations.",
        "examples": [
          "Garden 20×15m: P=70m, A=300m²",
          "Cube tank side 10cm: V=1,000cm³=1L",
          "Fencing 70m at Rs50/m: cost = Rs3,500",
          "Carpet for 6×4m room at Rs500/m²: Rs12,000"
        ],
        "exercises": [
          {
            "q": "Solve:",
            "parts": [
              "A garden 20×15m. Find P and A.",
              "Fencing costs Rs 50/m. Garden P=70m. Total cost?",
              "Carpet costs Rs 500/m². Room is 6×4m. Total cost?",
              "A box 8×5×3cm. Find volume.",
              "A cube tank side 20cm. Volume in liters?"
            ],
            "ans": [
              "P=70m, A=300m²",
              "Rs 3,500",
              "Rs 12,000",
              "120 cm³",
              "8,000 cm³ = 8 L"
            ]
          }
        ],
        "wordProblems": [
          "A swimming pool is 25×10×2 m. How many liters of water does it hold?",
          "A room 5×4m needs tiles costing Rs 800/m². Find total cost.",
          "A rectangular park 200×150m is surrounded by a path. Find the perimeter.",
          "A cube of side 6 cm. Find surface area (all 6 faces).",
          "A farmer has a 100×80m field. He wants to fence it. Wire costs Rs 25/m. Total cost?"
        ],
        "quiz": [
          {
            "q": "Garden 20×15m, perimeter:",
            "a": [
              "35 m",
              "70 m",
              "300 m",
              "600 m"
            ],
            "c": 1
          },
          {
            "q": "Same garden, area:",
            "a": [
              "35 m²",
              "70 m²",
              "300 m²",
              "600 m²"
            ],
            "c": 2
          },
          {
            "q": "Fencing 70m at Rs50/m:",
            "a": [
              "Rs 1,400",
              "Rs 3,500",
              "Rs 7,000",
              "Rs 350"
            ],
            "c": 1
          },
          {
            "q": "Box 8×5×3 volume:",
            "a": [
              "16",
              "40",
              "120",
              "240"
            ],
            "c": 2
          },
          {
            "q": "Cube side 20cm, volume:",
            "a": [
              "400",
              "4,000",
              "8,000",
              "80"
            ],
            "c": 2
          },
          {
            "q": "Surface area of cube side 6:",
            "a": [
              "36",
              "72",
              "144",
              "216"
            ],
            "c": 3
          }
        ]
      }
    ],
    "id": "math_5_9"
  },
  {
    "title": "Data Handling",
    "content": "Bar graphs, pictographs, line graphs, reading and interpreting data.",
    "key": "data5",
    "hasMathSub": true,
    "subs": [
      {
        "t": "Bar Graphs",
        "c": "Bars represent data. Height shows value. Always has title, labeled axes, and scale.",
        "examples": [
          "Each bar represents a category (e.g., fruits sold)",
          "The y-axis shows the quantity",
          "Taller bar = larger value",
          "Always start the scale at 0",
          "Bars should be equal width with equal spacing"
        ],
        "exercises": [
          {
            "q": "Read the bar graph data:",
            "parts": [
              "If the Mango bar reaches 25, how many mangoes?",
              "Apple bar is at 15 and Banana at 20. Which is more?",
              "The tallest bar is at 30. What does that tell you?",
              "Difference between bar at 25 and bar at 10?",
              "If scale goes by 5s, a bar between 15 and 20 is about?"
            ],
            "ans": [
              "25 mangoes",
              "Banana (20>15)",
              "That category has the highest value (30)",
              "Difference = 15",
              "About 17-18"
            ]
          }
        ],
        "wordProblems": [
          "A bar graph shows: Math=30, Science=25, English=20, Urdu=15. Which subject has the most students? What is the total?",
          "The tallest bar is 40 and shortest is 10. What is the range?",
          "Draw a bar graph for: Red=8, Blue=12, Green=5, Yellow=10."
        ],
        "quiz": [
          {
            "q": "Bar graph shows data using:",
            "a": [
              "Lines",
              "Rectangles/bars",
              "Circles",
              "Dots"
            ],
            "c": 1
          },
          {
            "q": "Y-axis usually shows:",
            "a": [
              "Categories",
              "Values/quantities",
              "Title",
              "Nothing"
            ],
            "c": 1
          },
          {
            "q": "Taller bar means:",
            "a": [
              "Less value",
              "More value",
              "Same value",
              "No data"
            ],
            "c": 1
          },
          {
            "q": "Scale should start at:",
            "a": [
              "1",
              "5",
              "10",
              "0"
            ],
            "c": 3
          },
          {
            "q": "Bar width should be:",
            "a": [
              "Different",
              "Equal",
              "Random",
              "No rule"
            ],
            "c": 1
          },
          {
            "q": "Range = highest - lowest:",
            "a": [
              "True",
              "False"
            ],
            "c": 0
          }
        ]
      },
      {
        "t": "Pictographs",
        "c": "Pictures/symbols represent data. A key shows what each symbol means.",
        "examples": [
          "🍎 = 5 apples. Three 🍎🍎🍎 = 15 apples",
          "Half symbol (🍎) = half the value (2.5 apples)",
          "Always include a key/legend",
          "Easy to read at a glance"
        ],
        "exercises": [
          {
            "q": "If 🍎 = 10 apples:",
            "parts": [
              "🍎🍎🍎 = ?",
              "🍎🍎🍎🍎🍎 = ?",
              "Half 🍎 = ?",
              "🍎🍎 and half = ?"
            ],
            "ans": [
              "30",
              "50",
              "5",
              "25"
            ]
          },
          {
            "q": "If ⭐ = 4 students:",
            "parts": [
              "⭐⭐⭐ = ?",
              "⭐⭐⭐⭐⭐ = ?",
              "Half ⭐ = ?",
              "How many ⭐ for 20 students?"
            ],
            "ans": [
              "12",
              "20",
              "2",
              "5"
            ]
          }
        ],
        "wordProblems": [
          "A pictograph uses 🌟 = 5 books. Ali read 🌟🌟🌟 and Sara read 🌟🌟🌟🌟. How many more books did Sara read?",
          "Design a pictograph for: Class A=20, Class B=15, Class C=25 students, using 👤 = 5 students.",
          "A pictograph shows 🚗🚗🚗 for Monday (🚗=10). How many cars on Monday?"
        ],
        "quiz": [
          {
            "q": "Pictograph uses:",
            "a": [
              "Bars",
              "Lines",
              "Pictures/symbols",
              "Circles"
            ],
            "c": 2
          },
          {
            "q": "🍎 = 5, then 🍎🍎🍎:",
            "a": [
              "3",
              "5",
              "10",
              "15"
            ],
            "c": 3
          },
          {
            "q": "Key/legend tells:",
            "a": [
              "The title",
              "What each symbol means",
              "The total",
              "Nothing"
            ],
            "c": 1
          },
          {
            "q": "Half symbol means:",
            "a": [
              "Zero",
              "Half the value",
              "Double",
              "Full value"
            ],
            "c": 1
          },
          {
            "q": "⭐ = 4, how many ⭐ for 16?",
            "a": [
              "2",
              "3",
              "4",
              "8"
            ],
            "c": 2
          },
          {
            "q": "Pictographs are easy to:",
            "a": [
              "Calculate",
              "Read at a glance",
              "Draw accurately",
              "Ignore"
            ],
            "c": 1
          }
        ]
      },
      {
        "t": "Line Graphs",
        "c": "Points connected by lines show how data changes over time. Great for trends.",
        "examples": [
          "Temperature over a week: points go up and down",
          "Line going up = increasing",
          "Line going down = decreasing",
          "Flat line = no change",
          "Steeper line = faster change"
        ],
        "exercises": [
          {
            "q": "Read the trend:",
            "parts": [
              "Line goes up from Monday to Friday",
              "Line drops sharply on Saturday",
              "Line stays flat Wednesday to Thursday",
              "Line goes up slowly then steeply",
              "Overall line goes from 10 to 50"
            ],
            "ans": [
              "Increasing trend",
              "Sharp decrease",
              "No change",
              "Slow then rapid increase",
              "Overall increase of 40 units"
            ]
          }
        ],
        "wordProblems": [
          "Temperature readings: Mon=20°C, Tue=22°C, Wed=25°C, Thu=23°C, Fri=27°C. Describe the trend.",
          "A plant grew: Week 1=2cm, Week 2=5cm, Week 3=9cm, Week 4=14cm. Is growth increasing or decreasing?",
          "Sales: Jan=100, Feb=150, Mar=130, Apr=200. Which month had the biggest jump?"
        ],
        "quiz": [
          {
            "q": "Line graphs show change over:",
            "a": [
              "Space",
              "Time",
              "Weight",
              "Nothing"
            ],
            "c": 1
          },
          {
            "q": "Line going up means:",
            "a": [
              "Decrease",
              "Increase",
              "No change",
              "Error"
            ],
            "c": 1
          },
          {
            "q": "Flat line means:",
            "a": [
              "Increase",
              "Decrease",
              "No change",
              "Missing data"
            ],
            "c": 2
          },
          {
            "q": "Steeper line means:",
            "a": [
              "Slower change",
              "Faster change",
              "No change",
              "Error"
            ],
            "c": 1
          },
          {
            "q": "Best for showing trends:",
            "a": [
              "Bar graph",
              "Pie chart",
              "Line graph",
              "Table"
            ],
            "c": 2
          },
          {
            "q": "Line going down = ?",
            "a": [
              "Increasing",
              "Decreasing",
              "Steady",
              "Cannot tell"
            ],
            "c": 1
          }
        ]
      },
      {
        "t": "Interpreting Data",
        "c": "Read the title first, check labels and scale, then answer questions about highest, lowest, difference, and trends.",
        "examples": [
          "Always read the title to know what the graph shows",
          "Check x-axis and y-axis labels",
          "Find highest and lowest values",
          "Calculate differences between values",
          "Look for patterns and trends"
        ],
        "exercises": [
          {
            "q": "From data: Apples=30, Bananas=45, Oranges=20, Grapes=35:",
            "parts": [
              "Which fruit sold most?",
              "Which sold least?",
              "Difference between most and least?",
              "Total fruits sold?",
              "Average per fruit?"
            ],
            "ans": [
              "Bananas (45)",
              "Oranges (20)",
              "45-20 = 25",
              "130",
              "130÷4 = 32.5"
            ]
          }
        ],
        "wordProblems": [
          "A graph shows test scores: Ali=85, Sara=92, Ahmed=78, Fatima=90. Who scored highest? What is the class average?",
          "Monthly rainfall: Jan=5cm, Feb=3cm, Mar=8cm, Apr=12cm, May=15cm. Which month was driest? Describe the trend.",
          "A shop's daily sales: Mon=200, Tue=350, Wed=150, Thu=400, Fri=500. Which was the busiest day? Total weekly sales?"
        ],
        "quiz": [
          {
            "q": "First thing to read on a graph:",
            "a": [
              "Numbers",
              "Title",
              "Colors",
              "Nothing"
            ],
            "c": 1
          },
          {
            "q": "Range = ?",
            "a": [
              "Highest + lowest",
              "Highest - lowest",
              "Average",
              "Total"
            ],
            "c": 1
          },
          {
            "q": "From 30,45,20,35 — highest:",
            "a": [
              "30",
              "35",
              "45",
              "20"
            ],
            "c": 2
          },
          {
            "q": "Average of 10,20,30,40:",
            "a": [
              "20",
              "25",
              "30",
              "35"
            ],
            "c": 1
          },
          {
            "q": "Trend shows:",
            "a": [
              "Pattern over time",
              "Only one value",
              "Nothing",
              "Colors"
            ],
            "c": 0
          },
          {
            "q": "Total of 30,45,20,35:",
            "a": [
              "100",
              "120",
              "130",
              "150"
            ],
            "c": 2
          }
        ]
      }
    ],
    "id": "math_5_10"
  },
  {
    "title": "Patterns & Sequences",
    "content": "Number patterns, skip counting, finding missing numbers, sequences.",
    "key": "patterns5",
    "hasMathSub": true,
    "subs": [
      {
        "t": "Number Patterns",
        "c": "A pattern follows a rule. Find the rule by looking at how each number changes to the next.",
        "examples": [
          "2, 4, 6, 8, 10... → rule: add 2",
          "3, 6, 12, 24... → rule: multiply by 2",
          "100, 90, 80, 70... → rule: subtract 10",
          "1, 4, 9, 16, 25... → square numbers (1², 2², 3², 4², 5²)",
          "1, 1, 2, 3, 5, 8... → Fibonacci (add previous two)"
        ],
        "exercises": [
          {
            "q": "Find the rule and next 2 numbers:",
            "parts": [
              "5, 10, 15, 20, __, __",
              "3, 6, 12, 24, __, __",
              "100, 95, 90, 85, __, __",
              "2, 6, 18, 54, __, __",
              "1, 4, 9, 16, __, __",
              "64, 32, 16, 8, __, __"
            ],
            "ans": [
              "25, 30 (add 5)",
              "48, 96 (×2)",
              "80, 75 (subtract 5)",
              "162, 486 (×3)",
              "25, 36 (squares)",
              "4, 2 (÷2)"
            ]
          }
        ],
        "wordProblems": [
          "Ali saves Rs 5 more each week: Week 1=Rs 10, Week 2=Rs 15, Week 3=Rs 20. How much in Week 6?",
          "A ball bounces 100cm, then 50cm, then 25cm. What is the pattern? What is the next bounce?",
          "A tree grows 3 cm each month. After 5 months it is 25 cm. How tall was it at the start?",
          "Seats in rows: Row 1=5, Row 2=8, Row 3=11. How many in Row 6?",
          "Pages read: Day 1=10, Day 2=20, Day 3=40. How many on Day 5?"
        ],
        "quiz": [
          {
            "q": "5,10,15,20 — rule:",
            "a": [
              "Add 5",
              "Add 10",
              "Multiply 2",
              "Subtract 5"
            ],
            "c": 0
          },
          {
            "q": "3,6,12,24 — rule:",
            "a": [
              "Add 3",
              "Add 6",
              "Multiply 2",
              "Multiply 3"
            ],
            "c": 2
          },
          {
            "q": "Next: 100,90,80,70,?",
            "a": [
              "50",
              "55",
              "60",
              "65"
            ],
            "c": 2
          },
          {
            "q": "1,4,9,16 are:",
            "a": [
              "Even numbers",
              "Odd numbers",
              "Square numbers",
              "Prime numbers"
            ],
            "c": 2
          },
          {
            "q": "2,6,18,54 — rule:",
            "a": [
              "Add 4",
              "Multiply 3",
              "Add 12",
              "Multiply 2"
            ],
            "c": 1
          },
          {
            "q": "64,32,16,8 — rule:",
            "a": [
              "Subtract 32",
              "Divide by 2",
              "Subtract 16",
              "Divide by 4"
            ],
            "c": 1
          }
        ]
      },
      {
        "t": "Skip Counting",
        "c": "Counting by a number other than 1. Helps with multiplication and finding multiples.",
        "examples": [
          "By 3s: 3, 6, 9, 12, 15, 18, 21, 24, 27, 30",
          "By 5s: 5, 10, 15, 20, 25, 30, 35, 40, 45, 50",
          "By 7s: 7, 14, 21, 28, 35, 42, 49, 56, 63, 70",
          "By 25s: 25, 50, 75, 100, 125, 150",
          "Backward by 4s: 40, 36, 32, 28, 24, 20"
        ],
        "exercises": [
          {
            "q": "Skip count and write next 5:",
            "parts": [
              "By 3s from 3",
              "By 7s from 7",
              "By 6s from 6",
              "By 9s from 9",
              "By 25s from 25",
              "Backward by 5s from 50"
            ],
            "ans": [
              "3,6,9,12,15,18",
              "7,14,21,28,35,42",
              "6,12,18,24,30,36",
              "9,18,27,36,45,54",
              "25,50,75,100,125,150",
              "50,45,40,35,30,25"
            ]
          }
        ],
        "wordProblems": [
          "Count by 5s from 5 to 50. How many numbers?",
          "A clock shows 3, 6, 9, 12. What skip count is this?",
          "Ali has Rs 25 coins. He counts: 25, 50, 75... What comes next?",
          "Seats are numbered: 4, 8, 12, 16... What is the 10th seat number?",
          "Count backward by 3 from 30. List the first 6 numbers."
        ],
        "quiz": [
          {
            "q": "Skip by 3: 3,6,9,__",
            "a": [
              "10",
              "11",
              "12",
              "15"
            ],
            "c": 2
          },
          {
            "q": "Skip by 7: 7,14,__",
            "a": [
              "17",
              "20",
              "21",
              "24"
            ],
            "c": 2
          },
          {
            "q": "Skip by 25: 25,50,75,__",
            "a": [
              "80",
              "90",
              "100",
              "125"
            ],
            "c": 2
          },
          {
            "q": "Backward by 5: 50,45,40,__",
            "a": [
              "30",
              "33",
              "35",
              "38"
            ],
            "c": 2
          },
          {
            "q": "Skip counting helps with:",
            "a": [
              "Addition only",
              "Multiplication",
              "Subtraction only",
              "Nothing"
            ],
            "c": 1
          },
          {
            "q": "By 9s: 9,18,27,__",
            "a": [
              "30",
              "33",
              "36",
              "45"
            ],
            "c": 2
          }
        ]
      },
      {
        "t": "Finding Missing Numbers",
        "c": "Use the pattern rule to find what number is missing in a sequence.",
        "examples": [
          "5, 10, __, 20, 25 → rule +5, missing = 15",
          "2, 6, __, 54, 162 → rule ×3, missing = 18",
          "100, __, 80, 70, 60 → rule -10, missing = 90",
          "1, 4, __, 16, 25 → squares, missing = 9"
        ],
        "exercises": [
          {
            "q": "Find the missing number:",
            "parts": [
              "5, 10, __, 20, 25",
              "2, 6, __, 54",
              "100, __, 80, 70",
              "3, 6, __, 12, 15",
              "__, 8, 12, 16, 20",
              "10, 20, __, 40, 50",
              "4, __, 16, 32, 64",
              "1, 1, 2, __, 5, 8"
            ],
            "ans": [
              "15",
              "18",
              "90",
              "9",
              "4",
              "30",
              "8",
              "3"
            ]
          }
        ],
        "wordProblems": [
          "A sequence: 12, 24, ?, 48. Find the missing number.",
          "Ali counted: 7, 14, ?, 28, 35. What number did he skip?",
          "Pattern: 3, 9, 27, ?, 243. What is the missing number?",
          "Seats: 5, ?, 15, 20, 25. Which seat is missing?",
          "A ball bounces: 80, 40, ?, 10. Find the missing height."
        ],
        "quiz": [
          {
            "q": "5, 10, __, 20:",
            "a": [
              "12",
              "14",
              "15",
              "18"
            ],
            "c": 2
          },
          {
            "q": "2, 6, __, 54:",
            "a": [
              "12",
              "18",
              "24",
              "36"
            ],
            "c": 1
          },
          {
            "q": "100, __, 80, 70:",
            "a": [
              "85",
              "90",
              "95",
              "75"
            ],
            "c": 1
          },
          {
            "q": "3, 6, __, 12:",
            "a": [
              "7",
              "8",
              "9",
              "10"
            ],
            "c": 2
          },
          {
            "q": "4, __, 16, 32:",
            "a": [
              "6",
              "8",
              "10",
              "12"
            ],
            "c": 1
          },
          {
            "q": "1, 1, 2, __, 5, 8:",
            "a": [
              "2",
              "3",
              "4",
              "5"
            ],
            "c": 1
          }
        ]
      },
      {
        "t": "Simple Sequences",
        "c": "An arithmetic sequence has a constant difference. A geometric sequence has a constant ratio.",
        "examples": [
          "Arithmetic: 2, 5, 8, 11, 14 → difference = 3",
          "Arithmetic: 10, 7, 4, 1 → difference = -3",
          "Geometric: 2, 4, 8, 16 → ratio = 2",
          "Geometric: 81, 27, 9, 3 → ratio = 1/3",
          "Finding next term: add the difference (arithmetic) or multiply by ratio (geometric)"
        ],
        "exercises": [
          {
            "q": "Identify as Arithmetic or Geometric:",
            "parts": [
              "2, 5, 8, 11",
              "3, 6, 12, 24",
              "10, 7, 4, 1",
              "5, 15, 45, 135",
              "100, 80, 60, 40",
              "1, 2, 4, 8"
            ],
            "ans": [
              "Arithmetic (d=3)",
              "Geometric (r=2)",
              "Arithmetic (d=-3)",
              "Geometric (r=3)",
              "Arithmetic (d=-20)",
              "Geometric (r=2)"
            ]
          },
          {
            "q": "Find next 3 terms:",
            "parts": [
              "2, 5, 8, 11, __, __, __",
              "3, 6, 12, 24, __, __, __",
              "100, 80, 60, __, __, __"
            ],
            "ans": [
              "14, 17, 20",
              "48, 96, 192",
              "40, 20, 0"
            ]
          }
        ],
        "wordProblems": [
          "Ali's weekly allowance increases by Rs 10 each week starting from Rs 50. What is his allowance in week 5?",
          "A bacteria colony doubles every hour: 1, 2, 4, 8... How many after 8 hours?",
          "Temperatures drop by 3° each hour from 24°C. What is it after 5 hours?"
        ],
        "quiz": [
          {
            "q": "2,5,8,11 is:",
            "a": [
              "Arithmetic",
              "Geometric",
              "Neither",
              "Both"
            ],
            "c": 0
          },
          {
            "q": "3,6,12,24 is:",
            "a": [
              "Arithmetic",
              "Geometric",
              "Neither",
              "Both"
            ],
            "c": 1
          },
          {
            "q": "Arithmetic has constant:",
            "a": [
              "Ratio",
              "Difference",
              "Sum",
              "Product"
            ],
            "c": 1
          },
          {
            "q": "Geometric has constant:",
            "a": [
              "Difference",
              "Ratio",
              "Sum",
              "Product"
            ],
            "c": 1
          },
          {
            "q": "Next: 2,5,8,11,?",
            "a": [
              "12",
              "13",
              "14",
              "15"
            ],
            "c": 2
          },
          {
            "q": "Next: 3,6,12,24,?",
            "a": [
              "30",
              "36",
              "48",
              "96"
            ],
            "c": 2
          }
        ]
      }
    ],
    "id": "math_5_11"
  },
  {
    "title": "Basic Algebra",
    "content": "Finding unknowns, simple equations, using symbols.",
    "key": "algebra5",
    "hasMathSub": true,
    "subs": [
      {
        "t": "Finding Unknowns",
        "c": "An unknown is a number we need to find, represented by a letter like x. Think: what number makes the equation true?",
        "examples": [
          "x + 5 = 12 → x = 7 (what plus 5 gives 12?)",
          "x - 3 = 10 → x = 13",
          "2 × x = 14 → x = 7",
          "x ÷ 4 = 5 → x = 20",
          "x + x = 16 → x = 8",
          "15 - x = 9 → x = 6"
        ],
        "exercises": [
          {
            "q": "Find x:",
            "parts": [
              "x + 5 = 12",
              "x - 3 = 10",
              "x + 8 = 20",
              "x - 7 = 15",
              "x + 15 = 30",
              "x - 20 = 5",
              "x + x = 24",
              "100 - x = 65"
            ],
            "ans": [
              "x = 7",
              "x = 13",
              "x = 12",
              "x = 22",
              "x = 15",
              "x = 25",
              "x = 12",
              "x = 35"
            ]
          },
          {
            "q": "Find x:",
            "parts": [
              "2x = 14",
              "3x = 27",
              "5x = 45",
              "x ÷ 4 = 5",
              "x ÷ 3 = 8",
              "4x = 100",
              "x ÷ 7 = 6",
              "10x = 120"
            ],
            "ans": [
              "x = 7",
              "x = 9",
              "x = 9",
              "x = 20",
              "x = 24",
              "x = 25",
              "x = 42",
              "x = 12"
            ]
          }
        ],
        "wordProblems": [
          "Ali has some marbles. After getting 5 more, he has 12. How many did he start with?",
          "A number minus 3 equals 10. Find the number.",
          "Double a number is 14. What is the number?",
          "Sara divides her stickers equally into 4 groups of 5. How many total stickers?",
          "I think of a number, add 15, and get 30. What is my number?"
        ],
        "quiz": [
          {
            "q": "x + 5 = 12, x = ?",
            "a": [
              "5",
              "6",
              "7",
              "8"
            ],
            "c": 2
          },
          {
            "q": "2x = 14, x = ?",
            "a": [
              "5",
              "6",
              "7",
              "8"
            ],
            "c": 2
          },
          {
            "q": "x - 3 = 10, x = ?",
            "a": [
              "7",
              "10",
              "13",
              "30"
            ],
            "c": 2
          },
          {
            "q": "x ÷ 4 = 5, x = ?",
            "a": [
              "1",
              "9",
              "15",
              "20"
            ],
            "c": 3
          },
          {
            "q": "x + x = 16, x = ?",
            "a": [
              "4",
              "8",
              "16",
              "32"
            ],
            "c": 1
          },
          {
            "q": "15 - x = 9, x = ?",
            "a": [
              "4",
              "5",
              "6",
              "24"
            ],
            "c": 2
          },
          {
            "q": "3x = 27, x = ?",
            "a": [
              "3",
              "8",
              "9",
              "81"
            ],
            "c": 2
          },
          {
            "q": "100 - x = 65, x = ?",
            "a": [
              "25",
              "30",
              "35",
              "45"
            ],
            "c": 2
          }
        ]
      },
      {
        "t": "Simple Equations",
        "c": "An equation has = sign. Both sides must balance. Do the same operation to both sides to solve.",
        "examples": [
          "x + 3 = 10 → subtract 3 from both: x = 7",
          "x - 5 = 8 → add 5 to both: x = 13",
          "2x = 14 → divide both by 2: x = 7",
          "x/3 = 6 → multiply both by 3: x = 18",
          "3x + 2 = 17 → subtract 2: 3x = 15 → divide by 3: x = 5"
        ],
        "exercises": [
          {
            "q": "Solve step by step:",
            "parts": [
              "x + 3 = 10",
              "x - 5 = 8",
              "2x = 14",
              "x/3 = 6",
              "3x + 2 = 17",
              "2x - 4 = 10",
              "x/5 + 1 = 4",
              "4x - 3 = 13"
            ],
            "ans": [
              "x = 7",
              "x = 13",
              "x = 7",
              "x = 18",
              "x = 5",
              "x = 7",
              "x = 15",
              "x = 4"
            ]
          },
          {
            "q": "Check: is x = 5 correct?",
            "parts": [
              "x + 3 = 8",
              "2x = 12",
              "x - 1 = 4",
              "3x = 15",
              "x + 10 = 14"
            ],
            "ans": [
              "Yes (5+3=8)",
              "No (2×5=10≠12)",
              "Yes (5-1=4)",
              "Yes (3×5=15)",
              "No (5+10=15≠14)"
            ]
          }
        ],
        "wordProblems": [
          "3 times a number plus 2 equals 17. Find the number.",
          "A number divided by 5, plus 1, equals 4. What is the number?",
          "Ali's age plus 3 equals 10. How old is Ali?",
          "Twice a number minus 4 is 10. Find the number.",
          "If I add 15 to a number and get 40, what is the number?"
        ],
        "quiz": [
          {
            "q": "x + 3 = 10 → first step:",
            "a": [
              "Add 3",
              "Subtract 3",
              "Multiply 3",
              "Divide 3"
            ],
            "c": 1
          },
          {
            "q": "2x = 14 → divide by:",
            "a": [
              "7",
              "14",
              "2",
              "x"
            ],
            "c": 2
          },
          {
            "q": "3x + 2 = 17, x = ?",
            "a": [
              "3",
              "4",
              "5",
              "6"
            ],
            "c": 2
          },
          {
            "q": "x/3 = 6, x = ?",
            "a": [
              "2",
              "3",
              "9",
              "18"
            ],
            "c": 3
          },
          {
            "q": "Both sides must be:",
            "a": [
              "Different",
              "Equal",
              "Zero",
              "Positive"
            ],
            "c": 1
          },
          {
            "q": "2x - 4 = 10, x = ?",
            "a": [
              "3",
              "5",
              "7",
              "8"
            ],
            "c": 2
          }
        ]
      },
      {
        "t": "Using Symbols",
        "c": "Letters like x, y, n represent unknown numbers. Expressions combine numbers and variables.",
        "examples": [
          "3x + 2 means '3 times x, plus 2'",
          "If x = 4: 3x + 2 = 3×4 + 2 = 14",
          "If y = 5: 2y - 1 = 2×5 - 1 = 9",
          "x + y means 'add two unknowns'",
          "If x = 3, y = 7: x + y = 10",
          "2(x + 3) means '2 times the sum of x and 3'"
        ],
        "exercises": [
          {
            "q": "If x = 4, find:",
            "parts": [
              "3x + 2",
              "x - 1",
              "2x",
              "5x - 3",
              "x + 10",
              "x × x",
              "2x + 5",
              "10 - x"
            ],
            "ans": [
              "14",
              "3",
              "8",
              "17",
              "14",
              "16",
              "13",
              "6"
            ]
          },
          {
            "q": "If x = 3, y = 5, find:",
            "parts": [
              "x + y",
              "x × y",
              "2x + y",
              "y - x",
              "x + 2y",
              "3x - y"
            ],
            "ans": [
              "8",
              "15",
              "11",
              "2",
              "13",
              "4"
            ]
          }
        ],
        "wordProblems": [
          "Ali has x apples. He buys 5 more. Write an expression for total apples.",
          "A book costs x rupees. 3 books cost how much? Write the expression.",
          "Ali is x years old. His father is 3x years old. If Ali is 10, how old is his father?",
          "The length of a rectangle is 2x and width is x. Write expression for perimeter.",
          "If n students each bring 3 pencils, write expression for total pencils."
        ],
        "quiz": [
          {
            "q": "3x + 2, if x = 4:",
            "a": [
              "10",
              "12",
              "14",
              "16"
            ],
            "c": 2
          },
          {
            "q": "2y - 1, if y = 5:",
            "a": [
              "7",
              "8",
              "9",
              "11"
            ],
            "c": 2
          },
          {
            "q": "x means:",
            "a": [
              "Always 10",
              "A fixed number",
              "An unknown number",
              "Zero"
            ],
            "c": 2
          },
          {
            "q": "x + y, if x=3, y=7:",
            "a": [
              "4",
              "10",
              "21",
              "37"
            ],
            "c": 1
          },
          {
            "q": "3x means:",
            "a": [
              "x + 3",
              "x - 3",
              "3 times x",
              "x divided by 3"
            ],
            "c": 2
          },
          {
            "q": "If x = 5: x × x = ?",
            "a": [
              "10",
              "15",
              "20",
              "25"
            ],
            "c": 3
          }
        ]
      }
    ],
    "id": "math_5_12"
  }
];
})();
