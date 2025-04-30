// uploadQuestions.js
import { db } from "./firebase";
import { collection, setDoc, doc } from "firebase/firestore";

// Масив питань
const questionsEng = [
  {
    id: 1,
    type: "single",
    question: "Read the text below. What is this advertisement about?",
    image: "https://i.postimg.cc/8kZfnv7f/2025-04-30-03-22-35.png",
    options: [
      { id: 1, label: "a theatrical production" },
      { id: 2, label: "an art exhibition" },
      { id: 3, label: "professional training" },
      { id: 4, label: "an animal charity" },
      { id: 5, label: "a dog school" },
      { id: 6, label: "eco-tourism" },
      { id: 7, label: "handcraft" },
      { id: 8, label: "environmental protection" },
    ],
    answer: "professional training",
  },
  {
    id: 2,
    type: "single",
    question: "Read the text below. What is this advertisement about?",
    image: "https://i.postimg.cc/VN9d90y6/2025-04-30-03-22-45.png",
    options: [
      { id: 1, label: "a theatrical production" },
      { id: 2, label: "an art exhibition" },
      { id: 3, label: "professional training" },
      { id: 4, label: "an animal charity" },
      { id: 5, label: "a dog school" },
      { id: 6, label: "eco-tourism" },
      { id: 7, label: "handcraft" },
      { id: 8, label: "environmental protection" },
    ],
    answer: "handcraft",
  },
  {
    id: 3,
    type: "single",
    question: "Read the text below. What is this advertisement about?",
    image: "https://i.postimg.cc/CMrd4V2j/2025-04-30-03-22-53.png",
    options: [
      { id: 1, label: "a theatrical production" },
      { id: 2, label: "an art exhibition" },
      { id: 3, label: "professional training" },
      { id: 4, label: "an animal charity" },
      { id: 5, label: "a dog school" },
      { id: 6, label: "eco-tourism" },
      { id: 7, label: "handcraft" },
      { id: 8, label: "environmental protection" },
    ],
    answer: "environmental protection",
  },
  {
    id: 4,
    type: "single",
    question: "Read the text below. What is this advertisement about?",
    image: "https://i.postimg.cc/3whwwryH/2025-04-30-03-23-05.png",
    options: [
      { id: 1, label: "a theatrical production" },
      { id: 2, label: "an art exhibition" },
      { id: 3, label: "professional training" },
      { id: 4, label: "an animal charity" },
      { id: 5, label: "a dog school" },
      { id: 6, label: "eco-tourism" },
      { id: 7, label: "handcraft" },
      { id: 8, label: "environmental protection" },
    ],
    answer: "a theatrical production",
  },
  {
    id: 5,
    type: "single",
    question: "Read the text below. What is this advertisement about?",
    image: "https://i.postimg.cc/j5ddz8Qg/2025-04-30-03-23-24.png",
    options: [
      { id: 1, label: "a theatrical production" },
      { id: 2, label: "an art exhibition" },
      { id: 3, label: "professional training" },
      { id: 4, label: "an animal charity" },
      { id: 5, label: "a dog school" },
      { id: 6, label: "eco-tourism" },
      { id: 7, label: "handcraft" },
      { id: 8, label: "environmental protection" },
    ],
    answer: "an animal charity",
  },
  {
    id: 6,
    type: "single",
    question:
      "Read the text below. What was Norman Borlaug’s reaction to the news about his winning the Nobel Peace Prize?",
    image: "https://i.postimg.cc/KvFFLpGn/2025-04-30-03-40-56.png",
    options: [
      { id: 1, label: "He stopped working in the field." },
      { id: 2, label: "He thought it was a joke" },
      { id: 3, label: "He started celebrating at once" },
      { id: 4, label: "He wanted to book a rest day." },
    ],
    answer: "He thought it was a joke",
  },
  {
    id: 7,
    type: "single",
    question:
      "Read the text below. What was Norman Borlaug’s educational background?",
    image: "https://i.postimg.cc/KvFFLpGn/2025-04-30-03-40-56.png",
    options: [
      { id: 1, label: "He was homeschooled by his grandfather." },
      { id: 2, label: "He attended a privileged school as a teenager." },
      { id: 3, label: "He changed his major at university." },
      { id: 4, label: "He left university before getting a degree." },
    ],
    answer: "He changed his major at university.",
  },
  {
    id: 8,
    type: "single",
    question:
      "Read the text below. What motivated Norman Borlaug to go to Mexico?",
    image: "https://i.postimg.cc/KvFFLpGn/2025-04-30-03-40-56.png",
    options: [
      { id: 1, label: "his desire to gain worldwide recognition" },
      { id: 2, label: "an opportunity to work for a chemicals company" },
      { id: 3, label: "a chance to participate in a military project" },
      { id: 4, label: "his wish to provide people with food" },
    ],
    answer: "his wish to provide people with food",
  },
  {
    id: 9,
    type: "single",
    question: "Read the text below. Which statement is TRUE of Norman Borlaug?",
    image: "https://i.postimg.cc/KvFFLpGn/2025-04-30-03-40-56.png",
    options: [
      {
        id: 1,
        label: "His salary was doubled by the chemicals company in 1944.",
      },
      { id: 2, label: "His research aimed at improving wheat had opponents." },
      { id: 3, label: "His inventions were inspired by the Green Revolution." },
      {
        id: 4,
        label:
          "His attempts helped to stop the war between India and Pakistan.",
      },
    ],
    answer: "His research aimed at improving wheat had opponents.",
  },
  {
    id: 10,
    type: "single",
    question:
      "Read the text below. The author mentions all of the following EXCEPT ________.",
    image: "https://i.postimg.cc/KvFFLpGn/2025-04-30-03-40-56.png",
    options: [
      { id: 1, label: "Borlaug served in the army during WWII." },
      { id: 2, label: "Borlaug lived half of his life among starving people." },
      { id: 3, label: "Borlaug worked for the Rockefeller Foundation." },
      { id: 4, label: "Borlaug developed highly productive grains." },
    ],
    answer: "Borlaug served in the army during WWII.",
  },
  {
    id: 11,
    type: "single",
    question:
      "Read the text below. Which of the following is true of the Rice Harvest Festival?",
    image: "https://i.postimg.cc/bwc6d4qh/2025-04-30-04-16-46.png",
    options: [
      { id: 1, label: "has a cooking verb in its name" },
      { id: 2, label: "is the period of arranging marriages" },
      { id: 3, label: "lasts more than a week" },
      { id: 4, label: "praises the season’s first basic food in the region" },
      { id: 5, label: "is a popular celebration of the rainy season" },
      { id: 6, label: "is accompanied by a speed competition" },
      { id: 7, label: "is a thanksgiving ceremony to the sun goddess" },
      {
        id: 8,
        label: "gives a chance to enjoy a meal in an ancient building",
      },
    ],
    answer: "is accompanied by a speed competition",
  },
  {
    id: 12,
    type: "single",
    question:
      "Read the text below. Which of the following is true of the Mid-Autumn Festival?",
    image: "https://i.postimg.cc/rpzgHTJ5/2025-04-30-04-17-00.png",
    options: [
      { id: 1, label: "has a cooking verb in its name" },
      { id: 2, label: "is the period of arranging marriages" },
      { id: 3, label: "lasts more than a week" },
      { id: 4, label: "praises the season’s first basic food in the region" },
      { id: 5, label: "is a popular celebration of the rainy season" },
      { id: 6, label: "is accompanied by a speed competition" },
      { id: 7, label: "is a thanksgiving ceremony to the sun goddess" },
      {
        id: 8,
        label: "gives a chance to enjoy a meal in an ancient building",
      },
    ],
    answer: "is the period of arranging marriages",
  },
  {
    id: 13,
    type: "single",
    question:
      "Read the text below. Which of the following is true of the Yam Festival?",
    image: "https://i.postimg.cc/15PBQwBm/2025-04-30-04-17-20.png",
    options: [
      { id: 1, label: "has a cooking verb in its name" },
      { id: 2, label: "is the period of arranging marriages" },
      { id: 3, label: "lasts more than a week" },
      { id: 4, label: "praises the season’s first basic food in the region" },
      { id: 5, label: "is a popular celebration of the rainy season" },
      { id: 6, label: "is accompanied by a speed competition" },
      { id: 7, label: "is a thanksgiving ceremony to the sun goddess" },
      {
        id: 8,
        label: "gives a chance to enjoy a meal in an ancient building",
      },
    ],
    answer: "praises the season’s first basic food in the region",
  },
  {
    id: 14,
    type: "single",
    question:
      "Read the text below. Which of the following is true of the Sukkoth?",
    image: "https://i.postimg.cc/x1m13Nrm/2025-04-30-04-17-37.png",
    options: [
      { id: 1, label: "has a cooking verb in its name" },
      { id: 2, label: "is the period of arranging marriages" },
      { id: 3, label: "lasts more than a week" },
      { id: 4, label: "praises the season’s first basic food in the region" },
      { id: 5, label: "is a popular celebration of the rainy season" },
      { id: 6, label: "is accompanied by a speed competition" },
      { id: 7, label: "is a thanksgiving ceremony to the sun goddess" },
      {
        id: 8,
        label: "gives a chance to enjoy a meal in an ancient building",
      },
    ],
    answer: "lasts more than a week",
  },
  {
    id: 15,
    type: "single",
    question:
      "Read the text below. Which of the following is true of the Olivagando?",
    image: "https://i.postimg.cc/9ftXv3QF/2025-04-30-04-17-50.png",
    options: [
      { id: 1, label: "has a cooking verb in its name" },
      { id: 2, label: "is the period of arranging marriages" },
      { id: 3, label: "lasts more than a week" },
      { id: 4, label: "praises the season’s first basic food in the region" },
      { id: 5, label: "is a popular celebration of the rainy season" },
      { id: 6, label: "is accompanied by a speed competition" },
      { id: 7, label: "is a thanksgiving ceremony to the sun goddess" },
      {
        id: 8,
        label: "gives a chance to enjoy a meal in an ancient building",
      },
    ],
    answer: "gives a chance to enjoy a meal in an ancient building",
  },
  {
    id: 16,
    type: "single",
    question:
      "Read the text below. Which of the following is true of the Pongal?",
    image: "https://i.postimg.cc/MGxq0smk/2025-04-30-04-18-06.png",
    options: [
      { id: 1, label: "has a cooking verb in its name" },
      { id: 2, label: "is the period of arranging marriages" },
      { id: 3, label: "lasts more than a week" },
      { id: 4, label: "praises the season’s first basic food in the region" },
      { id: 5, label: "is a popular celebration of the rainy season" },
      { id: 6, label: "is accompanied by a speed competition" },
      { id: 7, label: "is a thanksgiving ceremony to the sun goddess" },
      {
        id: 8,
        label: "gives a chance to enjoy a meal in an ancient building",
      },
    ],
    answer: "has a cooking verb in its name",
  },
  {
    id: 17,
    type: "single",
    question:
      "Read the text below. Choose the option that best suits the space under number 1",
    image: "https://i.postimg.cc/3wg61YJ9/2025-04-30-04-57-41.png",
    options: [
      { id: 1, label: "and left me with mixed feelings" },
      { id: 2, label: "money to buy their dream house" },
      { id: 3, label: "and making their dreams come true" },
      { id: 4, label: "Lennie through all his hardships" },
      { id: 5, label: "and often acts like a little child" },
      { id: 6, label: "support of each other until the very end" },
      { id: 7, label: "tell how the plot is going to develop" },
      { id: 8, label: "help Lennie in this tragic incident" },
    ],
    answer: "and often acts like a little child",
  },
  {
    id: 18,
    type: "single",
    question:
      "Read the text below. Choose the option that best suits the space under number 2",
    image: "https://i.postimg.cc/3wg61YJ9/2025-04-30-04-57-41.png",
    options: [
      { id: 1, label: "and left me with mixed feelings" },
      { id: 2, label: "money to buy their dream house" },
      { id: 3, label: "and making their dreams come true" },
      { id: 4, label: "Lennie through all his hardships" },
      { id: 5, label: "and often acts like a little child" },
      { id: 6, label: "support of each other until the very end" },
      { id: 7, label: "tell how the plot is going to develop" },
      { id: 8, label: "help Lennie in this tragic incident" },
    ],
    answer: "money to buy their dream house",
  },
  {
    id: 19,
    type: "single",
    question:
      "Read the text below. Choose the option that best suits the space under number 3",
    image: "https://i.postimg.cc/3wg61YJ9/2025-04-30-04-57-41.png",
    options: [
      { id: 1, label: "and left me with mixed feelings" },
      { id: 2, label: "money to buy their dream house" },
      { id: 3, label: "and making their dreams come true" },
      { id: 4, label: "Lennie through all his hardships" },
      { id: 5, label: "and often acts like a little child" },
      { id: 6, label: "support of each other until the very end" },
      { id: 7, label: "tell how the plot is going to develop" },
      { id: 8, label: "help Lennie in this tragic incident" },
    ],
    answer: "Lennie through all his hardships",
  },
  {
    id: 20,
    type: "single",
    question:
      "Read the text below. Choose the option that best suits the space under number 4",
    image: "https://i.postimg.cc/3wg61YJ9/2025-04-30-04-57-41.png",
    options: [
      { id: 1, label: "and left me with mixed feelings" },
      { id: 2, label: "money to buy their dream house" },
      { id: 3, label: "and making their dreams come true" },
      { id: 4, label: "Lennie through all his hardships" },
      { id: 5, label: "and often acts like a little child" },
      { id: 6, label: "support of each other until the very end" },
      { id: 7, label: "tell how the plot is going to develop" },
      { id: 8, label: "help Lennie in this tragic incident" },
    ],
    answer: "help Lennie in this tragic incident",
  },
  {
    id: 21,
    type: "single",
    question:
      "Read the text below. Choose the option that best suits the space under number 5",
    image: "https://i.postimg.cc/3wg61YJ9/2025-04-30-04-57-41.png",
    options: [
      { id: 1, label: "and left me with mixed feelings" },
      { id: 2, label: "money to buy their dream house" },
      { id: 3, label: "and making their dreams come true" },
      { id: 4, label: "Lennie through all his hardships" },
      { id: 5, label: "and often acts like a little child" },
      { id: 6, label: "support of each other until the very end" },
      { id: 7, label: "tell how the plot is going to develop" },
      { id: 8, label: "help Lennie in this tragic incident" },
    ],
    answer: "support of each other until the very end",
  },
  {
    id: 22,
    type: "single",
    question:
      "Read the text below. Choose the option that best suits the space under number 6",
    image: "https://i.postimg.cc/3wg61YJ9/2025-04-30-04-57-41.png",
    options: [
      { id: 1, label: "and left me with mixed feelings" },
      { id: 2, label: "money to buy their dream house" },
      { id: 3, label: "and making their dreams come true" },
      { id: 4, label: "Lennie through all his hardships" },
      { id: 5, label: "and often acts like a little child" },
      { id: 6, label: "support of each other until the very end" },
      { id: 7, label: "tell how the plot is going to develop" },
      { id: 8, label: "help Lennie in this tragic incident" },
    ],
    answer: "and left me with mixed feelings",
  },
  {
    id: 23,
    type: "single",
    question:
      "Read the text below. Choose the correct option that best suits the space under number 1",
    image: "https://i.postimg.cc/RhcysmRv/2025-04-30-05-15-06.png",
    options: [
      { id: 1, label: "survey" },
      { id: 2, label: "report" },
      { id: 3, label: "finding" },
      { id: 4, label: "research" },
    ],
    answer: "research",
  },
  {
    id: 24,
    type: "single",
    question:
      "Read the text below. Choose the correct option that best suits the space under number 2",
    image: "https://i.postimg.cc/RhcysmRv/2025-04-30-05-15-06.png",
    options: [
      { id: 1, label: "understand" },
      { id: 2, label: "distinguish" },
      { id: 3, label: "notice" },
      { id: 4, label: "differ" },
    ],
    answer: "distinguish",
  },
  {
    id: 25,
    type: "single",
    question:
      "Read the text below. Choose the correct option that best suits the space under number 3",
    image: "https://i.postimg.cc/RhcysmRv/2025-04-30-05-15-06.png",
    options: [
      { id: 1, label: "certainly" },
      { id: 2, label: "doubtfully" },
      { id: 3, label: "accordingly" },
      { id: 4, label: "significantly" },
    ],
    answer: "accordingly",
  },
  {
    id: 26,
    type: "single",
    question:
      "Read the text below. Choose the correct option that best suits the space under number 4",
    image: "https://i.postimg.cc/RhcysmRv/2025-04-30-05-15-06.png",
    options: [
      { id: 1, label: "fitted" },
      { id: 2, label: "connected" },
      { id: 3, label: "supported" },
      { id: 4, label: "dressed" },
    ],
    answer: "fitted",
  },
  {
    id: 27,
    type: "single",
    question:
      "Read the text below. Choose the correct option that best suits the space under number 5",
    image: "https://i.postimg.cc/RhcysmRv/2025-04-30-05-15-06.png",
    options: [
      { id: 1, label: "informed" },
      { id: 2, label: "familiar" },
      { id: 3, label: "aware" },
      { id: 4, label: "known" },
    ],
    answer: "aware",
  },
  {
    id: 28,
    type: "single",
    question:
      "Read the text below. Choose the correct option that best suits the space under number 1",
    image: "https://i.postimg.cc/y8zrdWHj/2025-04-30-05-28-03.png",
    options: [
      { id: 1, label: "has been driven" },
      { id: 2, label: "was driven" },
      { id: 3, label: "is driven" },
      { id: 4, label: "had been driven" },
    ],
    answer: "is driven",
  },
  {
    id: 29,
    type: "single",
    question:
      "Read the text below. Choose the correct option that best suits the space under number 2",
    image: "https://i.postimg.cc/y8zrdWHj/2025-04-30-05-28-03.png",
    options: [
      { id: 1, label: "with" },
      { id: 2, label: "by" },
      { id: 3, label: "from" },
      { id: 4, label: "of" },
    ],
    answer: "by",
  },
  {
    id: 30,
    type: "single",
    question:
      "Read the text below. Choose the correct option that best suits the space under number 3",
    image: "https://i.postimg.cc/y8zrdWHj/2025-04-30-05-28-03.png",
    options: [
      { id: 1, label: "hundreds of" },
      { id: 2, label: "hundred of" },
      { id: 3, label: "hundreds" },
      { id: 4, label: "hundred" },
    ],
    answer: "hundred",
  },
  {
    id: 31,
    type: "single",
    question:
      "Read the text below. Choose the correct option that best suits the space under number 4",
    image: "https://i.postimg.cc/y8zrdWHj/2025-04-30-05-28-03.png",
    options: [
      { id: 1, label: "to double" },
      { id: 2, label: "double" },
      { id: 3, label: "doubling" },
      { id: 4, label: "doubled" },
    ],
    answer: "to double",
  },
  {
    id: 32,
    type: "single",
    question:
      "Read the text below. Choose the correct option that best suits the space under number 5",
    image: "https://i.postimg.cc/y8zrdWHj/2025-04-30-05-28-03.png",
    options: [
      { id: 1, label: "depend" },
      { id: 2, label: "depends" },
      { id: 3, label: "depended" },
      { id: 4, label: "has depended" },
    ],
    answer: "depends",
  },
];

export const uploadQuestionsEng = async () => {
  const questionsRef = collection(db, "questionsEng");

  // Завантажуємо кожне питання в Firebase
  for (let question of questionsEng) {
    await setDoc(doc(questionsRef, question.id.toString()), question);
  }

  console.log("Усі питання завантажено до Firestore ✅");
};
