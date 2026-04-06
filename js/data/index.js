(() => {
  "use strict";

  const { DATA_VERSION, DATA_MANIFEST } = window.HomeSchoolDataVersion;
  const { SUBJECTS, GRADES, BADGES } = window.HomeSchoolMeta;
  const englishModules = window.HomeSchoolEnglishModules || {};
  const lessonModules = window.HomeSchoolLessonModules || {};
  const quizModules = window.HomeSchoolQuizModules || {};

  const POS_DATA = {
    adverbs: englishModules.ADVERBS_DATA || [],
    prepositions: englishModules.PREPOSITIONS_DATA || [],
    adjectives: englishModules.ADJECTIVES_DATA || [],
    conjunctions: englishModules.CONJUNCTIONS_DATA || [],
    pronouns: englishModules.PRONOUNS_DATA || [],
    collectiveNouns: englishModules.COLLECTIVE_NOUNS_DATA || [],
    verbs: englishModules.VERBS_DATA || [],
  };

  function getLessons(subject, grade) {
    return lessonModules?.[subject]?.[grade] || [];
  }

  function getQuiz(subject, grade, lessonKey) {
    return quizModules?.[subject]?.[grade]?.[lessonKey] || [];
  }

  window.HomeSchoolData = {
    VERSION: DATA_VERSION,
    MANIFEST: DATA_MANIFEST,
    SUBJECTS,
    GRADES,
    BADGES,
    POS_DATA,
    TENSES_DATA: englishModules.TENSES_DATA || {},
    URDU_TO_ENGLISH_DATA: englishModules.URDU_TO_ENGLISH_DATA || [],
    VOCABULARY_DATA: englishModules.VOCABULARY_DATA || [],
    VOCABULARY_LEVELS_DATA: englishModules.VOCABULARY_LEVELS_DATA || {},
    SPEAKING_SKILLS_DATA: englishModules.SPEAKING_SKILLS_DATA || [],
    ADVERB_PHRASES_DATA: englishModules.ADVERB_PHRASES_DATA || [],
    ENGLISH_OPPOSITES_DATA: englishModules.ENGLISH_OPPOSITES_DATA || [],
    ENGLISH_SENTENCE_DATA: englishModules.ENGLISH_SENTENCE_DATA || [],
    getLessons,
    getQuiz,
  };
})();
