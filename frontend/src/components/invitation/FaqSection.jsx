export default function FaqSection({ faqs }) {
  if (!faqs?.length) return null;

  return (
    <section className="inv-section inv-faq-section" id="faqs">
      <p className="inv-script-title inv-script-title-small">Frequently Asked Questions</p>
      <div className="inv-faq-list">
        {faqs.map((item, index) => (
          <details key={`${item.question}-${index}`}>
            <summary>{item.question}</summary>
            <p>{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
