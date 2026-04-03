import React from "react";
import { motion as Motion } from "framer-motion";
import "./App.css";
import abdusalamPhoto from "./assets/abdusalam-optimized.jpg";
import hennaPhoto from "./assets/henna-optimized.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const stagger = {
  show: { transition: { staggerChildren: 0.18 } },
};

const coupleFade = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

const coupleStagger = {
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.04 } },
};

const PETAL_COLORS = ["#7a2433", "#d28ea0", "#efe0c1", "#c49b43", "#ddc8a5", "#fffaf4"];
const SYMBOLS = {
  pin: "\u{1F4CD}",
  sparkle: "\u2726",
  diamond: "\u25C6",
  emDash: "\u2014",
  heart: "\u2665",
  ring: "\u{1F48D}",
  calendar: "\u{1F4C5}",
  clock: "\u{1F552}",
  mosque: "\u{1F54C}",
  herb: "\u{1F33F}",
  flower: "\u274B",
  middleDot: "\u00B7",
};

function Petals({ count = 12 }) {
  return Array.from({ length: count }).map((_, i) => (
    <div
      key={i}
      className="petal"
      style={{
        left: `${Math.random() * 100}%`,
        top: `-${Math.random() * 20}%`,
        background: PETAL_COLORS[i % PETAL_COLORS.length],
        animationDuration: `${6 + Math.random() * 8}s`,
        animationDelay: `${Math.random() * 6}s`,
        width: `${8 + Math.random() * 10}px`,
        height: `${12 + Math.random() * 14}px`,
        opacity: 0.38,
      }}
    />
  ));
}



function PhotoCard({ name, location, image, alt, objectPosition = "center", imageScale = 1, variants = fadeUp }) {
  return (
    <Motion.div className="photo-card" variants={variants}>
      <div className="photo-frame">
        <img
          className="photo-image"
          src={image}
          alt={alt ?? `${name} portrait`}
          width="800"
          height="1200"
          loading="eager"
          decoding="async"
          fetchPriority="high"
          style={{ objectPosition, transform: `scale(${imageScale})` }}
        />
      </div>
      <div className="photo-name">{name}</div>
      <div className="photo-location">{SYMBOLS.pin} {location}</div>
    </Motion.div>
  );
}

const WEDDING_DATE = new Date("2026-05-17T12:00:00");

function useCountdown() {
  const calc = () => {
    const diff = WEDDING_DATE - new Date();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
      days:    Math.floor(diff / 86400000),
      hours:   Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000)  / 60000),
      seconds: Math.floor((diff % 60000)    / 1000),
    };
  };
  const [time, setTime] = React.useState(calc);
  React.useEffect(() => {
    const id = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

function CountdownSection({ viewport }) {
  const { days, hours, minutes, seconds } = useCountdown();
  const units = [
    { value: days,    label: "Days",    arabic: "\u0623\u064a\u0651\u064e\u0627\u0645" },
    { value: hours,   label: "Hours",   arabic: "\u0633\u064e\u0627\u0639\u064e\u0627\u062a" },
    { value: minutes, label: "Minutes", arabic: "\u062f\u064e\u0642\u064e\u0627\u0626\u0650\u0642" },
    { value: seconds, label: "Seconds", arabic: "\u062b\u064e\u0648\u064e\u0627\u0646\u0650" },
  ];
  return (
    <section className="section countdown-section">
      <Motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={viewport}
        style={{ position: "relative", zIndex: 2 }}
      >
        <Motion.div className="cd-arabic" variants={fadeUp}>
          {"\u064a\u064e\u0648\u0652\u0645\u064f \u0627\u0644\u0641\u064e\u0631\u064e\u062d\u0650 \u0642\u064e\u0627\u062f\u0650\u0645\u064c"}
        </Motion.div>
        <Motion.div className="cd-english" variants={fadeUp}>
          The Day of Joy Approaches
        </Motion.div>
        <div className="shimmer-line" />
        <Motion.div className="cd-label" variants={fadeUp}>
          Counting Down
        </Motion.div>
        <Motion.div className="cd-grid" variants={stagger}>
          {units.map(({ value, label, arabic }) => (
            <Motion.div className="cd-unit" key={label} variants={fadeUp}>
              <div className="cd-value">{String(value).padStart(2, "0")}</div>
              <div className="cd-unit-label">{label}</div>
              <div className="cd-unit-arabic">{arabic}</div>
            </Motion.div>
          ))}
        </Motion.div>
        <div className="shimmer-line" style={{ marginTop: "32px" }} />
        <Motion.div className="cd-date-line" variants={fadeUp}>
          {`17 ${SYMBOLS.middleDot} 05 ${SYMBOLS.middleDot} 2026`}
        </Motion.div>
      </Motion.div>
    </section>
  );
}

function RSVPForm() {
  const [form, setForm] = React.useState({ name: "", phone: "", attending: "", guests: "", wishes: "" });
  const [submitted, setSubmitted] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState("");
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const normalizePhone = (value) => value.replace(/\D/g, "");
  const getValidationError = () => {
    if (!form.name.trim()) return "Please enter your full name.";
    if (!form.phone.trim()) return "Please enter your WhatsApp number.";
    if (!form.attending) return "Please choose whether you are attending.";
    if (!form.guests) return "Please choose the number of guests.";
    if (!form.wishes.trim()) return "Please enter your duas and wishes.";
    return "";
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;

    const validationError = getValidationError();
    if (validationError) {
      setSubmitError(validationError);
      return;
    }

    const normalizedPhone = normalizePhone(form.phone);
    const localPhoneKey = `rsvp-phone:${normalizedPhone}`;
    if (normalizedPhone && window.localStorage.getItem(localPhoneKey)) {
      setSubmitError("This phone number has already been used for an RSVP.");
      return;
    }

    setSubmitError("");
    setIsSubmitting(true);
    try {
      // Simulate submission delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (normalizedPhone) {
        window.localStorage.setItem(localPhoneKey, "submitted");
      }
      setSubmitted(true);
    } catch {
      setSubmitError("We couldn't process your RSVP right now. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) return (
    <div className="rsvp-thanks">
      <div className="rsvp-thanks-icon">Thank You</div>
      <div className="rsvp-thanks-title">{"\u062c\u064e\u0632\u064e\u0627\u0643\u064e \u0627\u0644\u0644\u0647\u064f \u062e\u064e\u064a\u0652\u0631\u064b\u0627"}</div>
      <div className="rsvp-thanks-sub">Thank you, {form.name}! We look forward to celebrating with you.</div>
    </div>
  );

  return (
    <div className="rsvp-form">
      <div className="rsvp-field">
        <label className="rsvp-label">{"Full Name \u00B7 "}{"\u0627\u0644\u0627\u0633\u0645 \u0627\u0644\u0643\u0627\u0645\u0644"}</label>
        <input className="rsvp-input" placeholder="Your full name" value={form.name} onChange={e => set("name", e.target.value)} />
      </div>
      <div className="rsvp-field">
        <label className="rsvp-label">{"WhatsApp Number \u00B7 "}{"\u0631\u0642\u0645 \u0627\u0644\u0648\u0627\u062a\u0633\u0627\u0628"}</label>
        <input className="rsvp-input" placeholder="+91 XXXXX XXXXX" value={form.phone} onChange={e => set("phone", e.target.value)} />
      </div>
      <div className="rsvp-field">
        <label className="rsvp-label">{"Attending \u00B7 "}{"\u0627\u0644\u062d\u0636\u0648\u0631"}</label>
        <div className="rsvp-toggle">
          <button type="button" className={"rsvp-toggle-btn" + (form.attending === "yes" ? " active" : "")} onClick={() => set("attending", "yes")}>Yes, Joyfully!</button>
          <button type="button" className={"rsvp-toggle-btn" + (form.attending === "no" ? " active-no" : "")} onClick={() => set("attending", "no")}>Unable to Attend</button>
        </div>
      </div>
      <div className="rsvp-field">
        <label className="rsvp-label">{"Guests \u00B7 "}{"\u0627\u0644\u0636\u064a\u0648\u0641"}</label>
        <div className="rsvp-toggle">
          {["Just me", "2", "3", "4+"].map(g => (
            <button type="button" key={g} className={"rsvp-toggle-btn" + (form.guests === g ? " active" : "")} onClick={() => set("guests", g)}>{g}</button>
          ))}
        </div>
      </div>
      <div className="rsvp-field">
        <label className="rsvp-label">{"Duas & Wishes \u00B7 "}{"\u0627\u0644\u062f\u0639\u0627\u0621 \u0648\u0627\u0644\u062a\u0647\u0627\u0646\u064a"}</label>
        <textarea className="rsvp-textarea" rows={3} placeholder="Share your blessings and duas for Abdusalam & Fathima Hanna..." value={form.wishes} onChange={e => set("wishes", e.target.value)} />
      </div>
      {submitError && <div className="rsvp-error">{submitError}</div>}
      <Motion.button
        className="rsvp-btn"
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        disabled={isSubmitting}
        onClick={handleSubmit}
      >
        {isSubmitting ? "Submitting..." : "Confirm \u00B7 \u062A\u0623\u0643\u064A\u062F \u2726"}
      </Motion.button>
    </div>
  );
}

export default function App() {
  const scrollRootRef = React.useRef(null);

  React.useEffect(() => {
    [abdusalamPhoto, hennaPhoto].forEach((src) => {
      const image = new Image();
      image.decoding = "async";
      image.fetchPriority = "high";
      image.src = src;
    });
  }, []);

  return (
    <div className="invite" ref={scrollRootRef}>
      <div className="invite-petals" aria-hidden="true">
        <Petals count={24} />
      </div>

      {/* 1. HERO */}
      <section className="section hero-section">
        <Motion.div className="hero-top" variants={stagger} initial="hidden" animate="show">
          <Motion.div className="bismillah" variants={fadeUp}>
            {"\u0628\u0650\u0633\u0652\u0645\u0650 \u0627\u0644\u0644\u064e\u0651\u0647\u0650 \u0627\u0644\u0631\u064e\u0651\u062d\u0652\u0645\u064e\u0670\u0646\u0650 \u0627\u0644\u0631\u064e\u0651\u062d\u0650\u064a\u0645\u0650"}
          </Motion.div>
          <Motion.div className="hero-quote" variants={fadeUp}>
            <div className="hero-quote-arabic">{"\u0648\u064e\u062c\u064e\u0639\u064e\u0644\u064e \u0628\u064e\u064a\u0652\u0646\u064e\u0643\u064f\u0645 \u0645\u064e\u0651\u0648\u064e\u062f\u064e\u0651\u0629\u064b \u0648\u064e\u0631\u064e\u062d\u0652\u0645\u064e\u0629\u064b"}</div>
            <div className="hero-quote-english">"He placed between you love and mercy" {SYMBOLS.emDash} Quran 30:21</div>
          </Motion.div>
        </Motion.div>

        <Motion.div className="hero-middle" variants={stagger} initial="hidden" animate="show">
          <Motion.h1 className="hero-title" variants={fadeUp}>Wedding Invitation</Motion.h1>
          <div className="shimmer-line" />
          <Motion.div className="hero-names" variants={fadeUp}>
            <span>Abdusalam</span>
            <span className="hero-names-sep">{SYMBOLS.sparkle}</span>
            <span>Fathima Hanna</span>
          </Motion.div>
          <div className="shimmer-line" />
        </Motion.div>

        <Motion.div className="hero-bottom" variants={stagger} initial="hidden" animate="show">
          <Motion.div className="hero-event-details" variants={fadeUp}>
            <div className="hed-col">
              <div className="hed-row hed-main">SUNDAY</div>
              <div className="hed-row hed-main">17TH MAY 2026</div>
            </div>
            <div className="hed-vdivider"><span>{SYMBOLS.diamond}</span></div>
            <div className="hed-col">
              <div className="hed-row">AFTERNOON</div>
              <div className="hed-row">LUNCH</div>
            </div>
            <div className="hed-vdivider"><span>{SYMBOLS.diamond}</span></div>
            <div className="hed-col">
              <div className="hed-row">KP LOUNGE</div>
              <div className="hed-row">KONDOTTY</div>
            </div>
          </Motion.div>
        </Motion.div>
      </section>

      {/* 2. QUOTE 1 */}
      <section className="section quote-section">
        <Motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ root: scrollRootRef, once: true, amount: 0.5 }} style={{ position: "relative", zIndex: 2, padding: "0 20px" }}>
          <Motion.div variants={fadeUp}><span className="ornament">{SYMBOLS.sparkle}</span></Motion.div>
          <Motion.div className="arabic-quote" variants={fadeUp}>
            {"\u0648\u064e\u0645\u0650\u0646\u0652 \u0622\u064a\u064e\u0627\u062a\u0650\u0647\u0650 \u0623\u064e\u0646\u0652 \u062e\u064e\u0644\u064e\u0642\u064e \u0644\u064e\u0643\u064f\u0645 \u0645\u0650\u0651\u0646\u0652 \u0623\u064e\u0646\u0641\u064f\u0633\u0650\u0643\u064f\u0645\u0652 \u0623\u064e\u0632\u0652\u0648\u064e\u0627\u062c\u064b\u0627 \u0644\u0650\u0651\u062a\u064e\u0633\u0652\u0643\u064f\u0646\u064f\u0648\u0627 \u0625\u0650\u0644\u064e\u064a\u0652\u0647\u064e\u0627"}
          </Motion.div>
          <div className="shimmer-line" />
          <Motion.div className="quote-translation" variants={fadeUp}>
            "And of His signs is that He created for you from yourselves mates that you may find tranquility in them"
          </Motion.div>
          <Motion.div className="quote-source" variants={fadeUp}>{SYMBOLS.emDash} Quran 30:21</Motion.div>
        </Motion.div>
      </section>

      {/* 3. CORDIALLY INVITED CARD */}
      <section className="section invite-card-section">
        <Motion.div className="invite-card" variants={stagger} initial="hidden" whileInView="show" viewport={{ root: scrollRootRef, once: true, amount: 0.3 }}>
          <span className="card-corner tl">áƒ¦</span>
          <span className="card-corner tr">áƒ¦</span>
          <span className="card-corner bl">áƒ¦</span>
          <span className="card-corner br">áƒ¦</span>
          <Motion.div className="card-bismillah" variants={fadeUp}>{"\u0628\u0650\u0633\u0652\u0645\u0650 \u0627\u0644\u0644\u064e\u0651\u0647\u0650 \u0627\u0644\u0631\u064e\u0651\u062d\u0652\u0645\u064e\u0670\u0646\u0650 \u0627\u0644\u0631\u064e\u0651\u062d\u0650\u064a\u0645\u0650"}</Motion.div>
          <div className="card-shimmer" />
          <Motion.div className="card-cordially" variants={fadeUp}>Cordially Invited</Motion.div>
          <Motion.div className="card-intro" variants={fadeUp}>Together with their families,</Motion.div>
          <div className="card-shimmer" />
          <Motion.div className="card-names" variants={fadeUp}>
            <div className="card-groom">
              <div className="card-person-label">Groom</div>
              <div className="card-person-name">Abdusalam</div>
              <div className="card-person-sub">S/O <span>Abdul Latheef &amp; Sainaba</span></div>
              <div className="card-person-place">Kondotty, Malappuram</div>
            </div>
            <div className="card-and"><div className="card-and-ring">{SYMBOLS.heart}</div></div>
            <div className="card-bride">
              <div className="card-person-label">Bride</div>
              <div className="card-person-name">Fathima Hanna</div>
              <div className="card-person-sub">D/O <span>Mohammed &amp; Mariyam</span></div>
              <div className="card-person-place">Beypore, Kozhikode</div>
            </div>
          </Motion.div>
          <div className="card-shimmer" />
          <Motion.div className="card-event-block" variants={fadeUp}>
            <div className="card-event-title">Marriage Reception</div>
            <div className="card-event-arabic">{"\u0648\u064e\u0644\u0650\u064a\u0645\u064e\u0629\u064f \u0627\u0644\u0639\u064f\u0631\u0633\u0650"}</div>
            <div className="card-event-row"><span>{SYMBOLS.calendar}</span> Sunday, 17th May 2026</div>
            <div className="card-event-row"><span>{SYMBOLS.clock}</span> {`12:00 Noon ${SYMBOLS.middleDot} Lunch`}</div>
            <div className="card-event-row"><span>{SYMBOLS.pin}</span> KP Lounge Auditorium, Kondotty</div>
          </Motion.div>
          <div className="card-shimmer" />
          <Motion.div className="card-dua" variants={fadeUp}>{"\u0628\u064e\u0627\u0631\u064e\u0643\u064e \u0627\u0644\u0644\u064e\u0651\u0647\u064f \u0644\u064e\u0643\u064f\u0645\u064e\u0627 \u0648\u064e\u0628\u064e\u0627\u0631\u064e\u0643\u064e \u0639\u064e\u0644\u064e\u064a\u0652\u0643\u064f\u0645\u064e\u0627"}</Motion.div>
          <Motion.div className="card-dua-en" variants={fadeUp}>May Allah bless you both</Motion.div>
        </Motion.div>
      </section>

      {/* 4. COUPLE PHOTOS */}
      <section className="section couple-section">
        <Motion.div variants={coupleStagger} initial="hidden" whileInView="show" viewport={{ root: scrollRootRef, once: true, amount: 0.2 }} style={{ position: "relative", zIndex: 2, width: "100%" }}>
          <Motion.div className="couple-section-title" variants={coupleFade}>The Blessed Union</Motion.div>
          <div className="shimmer-line" />
          <div className="couple-photos">
            <PhotoCard
              name="Abdusalam"
              location="Kondotty, Malappuram"
              image={abdusalamPhoto}
              objectPosition="50% 10%"
              variants={coupleFade}
            />
            <Motion.div className="heart-divider" variants={coupleFade}>{SYMBOLS.ring}</Motion.div>
            <PhotoCard
              name="Fathima Hanna"
              location="Beypore, Kozhikode"
              image={hennaPhoto}
              objectPosition="50% 10%"
              imageScale={1.52}
              variants={coupleFade}
            />
          </div>
        </Motion.div>
      </section>

      {/* 5. EVENTS */}
      <section className="section events-section">
        <Motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ root: scrollRootRef, once: true, amount: 0.3 }} style={{ position: "relative", zIndex: 2, width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Motion.h2 className="section-heading" variants={fadeUp}>
            Celebrations <span>{`${SYMBOLS.middleDot} `}{"\u0627\u0644\u0627\u062d\u062a\u0641\u0627\u0644\u0627\u062a"}</span>
          </Motion.h2>
          <div className="shimmer-line" />
          <Motion.div className="events-grid" variants={stagger}>
            <Motion.div className="event-card reception" variants={fadeUp}>
              <div className="event-icon">{SYMBOLS.mosque}</div>
              <div className="event-title">Marriage Reception</div>
              <div className="event-arabic">{"\u0648\u0644\u064a\u0645\u0629 \u0627\u0644\u0639\u0631\u0633"}</div>
              <div className="event-detail">
                <strong>{`Sunday ${SYMBOLS.middleDot} 17th May 2026`}</strong>
                {`12:00 Noon ${SYMBOLS.middleDot} Lunch`}<br />
                KP Lounge Auditorium<br />
                Kondotty, Malappuram, Kerala
              </div>
              <button className="map-btn" onClick={() => window.open("https://maps.google.com?q=KP+Lounge+Kondotty")}>
                {`${SYMBOLS.pin} View Location`}
              </button>
            </Motion.div>
            <Motion.div className="event-card mehndi" variants={fadeUp}>
              <div className="event-icon">{SYMBOLS.herb}</div>
              <div className="event-title">Mehndi Night</div>
              <div className="event-arabic">{"\u062d\u0641\u0644\u0629 \u0627\u0644\u062d\u0646\u0627\u0621"}</div>
              <div className="event-detail">
                <strong>{`Saturday ${SYMBOLS.middleDot} 16th May 2026`}</strong>
                6:00 PM onwards<br />
                Family Residence<br />
                Beypore, Kozhikode, Kerala
              </div>
              <button className="map-btn" onClick={() => window.open("https://google.com/maps?q=11.1386026,75.9655216&z=17&hl=en")}>
                {`${SYMBOLS.pin} View Location`}
              </button>
            </Motion.div>
          </Motion.div>
        </Motion.div>
      </section>

      {/* 6. COUNTDOWN */}
      <CountdownSection viewport={{ root: scrollRootRef, once: true, amount: 0.4 }} />

      {/* 7. QUOTE 2 */}
      <section className="section quote2-section">
        <Motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ root: scrollRootRef, once: true, amount: 0.5 }} style={{ position: "relative", zIndex: 2, padding: "0 20px" }}>
          <Motion.div variants={fadeUp}><span className="ornament">{SYMBOLS.flower}</span></Motion.div>
          <Motion.div className="arabic-quote" variants={fadeUp}>
            {"\u0647\u064f\u0646\u064e\u0651 \u0644\u0650\u0628\u064e\u0627\u0633\u064c \u0644\u064e\u0651\u0643\u064f\u0645\u0652 \u0648\u064e\u0623\u064e\u0646\u062a\u064f\u0645\u0652 \u0644\u0650\u0628\u064e\u0627\u0633\u064c \u0644\u064e\u0651\u0647\u064f\u0646\u064e\u0651"}
          </Motion.div>
          <div className="shimmer-line" />
          <Motion.div className="quote-translation" variants={fadeUp}>
            "They are a garment for you and you are a garment for them"
          </Motion.div>
          <Motion.div className="quote-source" variants={fadeUp}>
            {SYMBOLS.emDash} Quran 2:187
          </Motion.div>
        </Motion.div>
      </section>

      {/* 8. RSVP */}
      <section className="section rsvp-section">
        <Motion.div
          className="rsvp-card"
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ root: scrollRootRef, once: true, amount: 0.2 }}
        >
          <Motion.div className="bismillah" variants={fadeUp} style={{ fontSize: "clamp(16px,3vw,22px)" }}>
            {"\u0646\u064e\u062f\u0652\u0639\u064f\u0648\u0643\u064f\u0645\u0652 \u0628\u0650\u0643\u064f\u0644\u0650\u0651 \u0633\u064f\u0631\u064f\u0648\u0631\u0652"}
          </Motion.div>
          <Motion.div className="rsvp-title" variants={fadeUp}>RSVP</Motion.div>
          <Motion.div className="rsvp-deadline" variants={fadeUp}>
            Please confirm your presence by <span>10th May 2026</span>
          </Motion.div>
          <div className="shimmer-line" />
          <RSVPForm />
        </Motion.div>
      </section>

      {/* FOOTER */}
      <footer className="section footer-section">
        <div className="shimmer-line" style={{ marginBottom: "20px" }} />
        <div className="footer-text">{"\u0628\u064e\u0627\u0631\u064e\u0643\u064e \u0627\u0644\u0644\u064e\u0651\u0647\u064f \u0644\u064e\u0643\u064f\u0645\u064e\u0627 \u0648\u064e\u0628\u064e\u0627\u0631\u064e\u0643\u064e \u0639\u064e\u0644\u064e\u064a\u0652\u0643\u064f\u0645\u064e\u0627"}</div>
        <div className="footer-names" style={{ color: "rgba(255,255,255,0.3)", marginTop: "6px", fontSize: "12px" }}>
          May Allah bless you both
        </div>
        <div className="shimmer-line" style={{ margin: "16px auto" }} />
        <div className="footer-names">{`ABDUSALAM ${SYMBOLS.sparkle} FATHIMA HANNA ${SYMBOLS.middleDot} 2026`}</div>
      </footer>

    </div>
  );
}







