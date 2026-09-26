export function normalizeFlashcards(content) {
  if (Array.isArray(content)) return content;
  if (Array.isArray(content?.flashcards)) return content.flashcards;
  if (Array.isArray(content?.content)) return content.content;
  return [];
}

export function normalizeQuiz(content) {
  if (Array.isArray(content)) return content;
  if (Array.isArray(content?.questions)) return content.questions;
  if (Array.isArray(content?.quiz)) return content.quiz;
  return [];
}
