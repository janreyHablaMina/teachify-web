import {
  formatChoiceLabel,
  formatQuestionTypeLabel,
  parseEnumerationItems,
  type PreviewQuestion,
} from "@/lib/quiz/question-utils";

type QuestionPreviewCardProps = {
  question: PreviewQuestion;
  questionNumber: number;
  variant?: "modal" | "page";
};

export function QuestionPreviewCard({
  question,
  questionNumber,
  variant = "page",
}: QuestionPreviewCardProps) {
  const isModal = variant === "modal";

  return (
    <article
      className={
        isModal
          ? "rounded-xl border-2 border-slate-900 bg-white p-4 shadow-[3px_3px_0_#0f172a]"
          : "rounded-xl border border-slate-200 bg-white p-4"
      }
    >
      <p className="m-0 text-[11px] font-black uppercase tracking-[0.08em] text-slate-500">
        Q{questionNumber} - {formatQuestionTypeLabel(question.type)}
      </p>
      <p className={`mt-2 font-bold text-slate-900 ${isModal ? "text-[15px]" : "text-[20px]"}`}>
        {question.question}
      </p>

      {Array.isArray(question.choices) && question.choices.length > 0 ? (
        <ul className={`mt-3 list-disc pl-5 font-semibold text-slate-700 ${isModal ? "text-[14px]" : "text-[15px]"}`}>
          {question.choices.map((choice, choiceIndex) => (
            <li key={`${questionNumber}-${choiceIndex}`}>
              {formatChoiceLabel(question.type, choice, choiceIndex)}
            </li>
          ))}
        </ul>
      ) : null}

      {question.type === "enumeration" ? (
        <div className="mt-3">
          <p className="m-0 text-[13px] font-black text-teal-700">Answer:</p>
          <ul className="mt-1 list-disc pl-5 text-[14px] font-semibold text-teal-700">
            {parseEnumerationItems(question.answer).map((item, itemIndex) => (
              <li key={`${questionNumber}-enum-${itemIndex}`}>{item}</li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="mt-3 text-[13px] font-black text-teal-700">Answer: {question.answer}</p>
      )}

      {question.type !== "enumeration" &&
      question.type !== "multiple_choice" &&
      question.type !== "identification" &&
      question.explanation ? (
        <p className={`mt-1 font-semibold text-slate-600 ${isModal ? "text-[13px]" : "text-[14px]"}`}>
          {question.explanation}
        </p>
      ) : null}
    </article>
  );
}
