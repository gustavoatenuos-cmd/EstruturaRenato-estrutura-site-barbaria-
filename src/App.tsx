import { useMemo, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  Check,
  ChevronLeft,
  Clock3,
  MapPin,
  MessageCircle,
  Scissors,
  Sparkles,
  UserRound,
  X,
} from "lucide-react";
import { CompareSlider } from "./components/CompareSlider";

const PHONE = "5543999522591";

type Journey = "barbearia" | "protese" | null;
type Step = "choice" | "booking";
type ServiceId = "corte" | "navalhado" | "barba" | "sobrancelha";

const serviceCatalog: Array<{ id: ServiceId; label: string; price: number }> = [
  { id: "corte", label: "Corte de cabelo", price: 40 },
  { id: "navalhado", label: "Corte navalhado", price: 45 },
  { id: "barba", label: "Barba", price: 25 },
  { id: "sobrancelha", label: "Sobrancelha", price: 15 },
];

const periods = ["Manhã", "Tarde", "Noite"];
const dayOptions = ["Durante a semana", "Final de semana"];

function whatsappUrl(message: string) {
  return `https://wa.me/${PHONE}?text=${encodeURIComponent(message)}`;
}

function formatPrice(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
  });
}

function LanzinnisWordmark({ className = "" }: { className?: string }) {
  return (
    <div className={`brand-lockup ${className}`} role="img" aria-label="Lanzinnis">
      <span>LANZI</span>
      <svg
        className="brand-hair-n"
        viewBox="0 0 72 94"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        <path d="M4 8 C 24 13, 25 72, 66 86" />
        <path d="M15 5 C 34 15, 34 61, 69 77" />
        <path d="M27 4 C 44 18, 45 49, 70 66" />
      </svg>
      <span>NIS</span>
    </div>
  );
}

function App() {
  const [open, setOpen] = useState(true);
  const [journey, setJourney] = useState<Journey>(null);
  const [step, setStep] = useState<Step>("choice");
  const [name, setName] = useState("");
  const [selectedServices, setSelectedServices] = useState<ServiceId[]>([]);
  const [period, setPeriod] = useState("");
  const [days, setDays] = useState("");
  const [compareView, setCompareView] = useState<"perfil" | "frente">("perfil");

  const selection = useMemo(() => {
    const has = (id: ServiceId) => selectedServices.includes(id);
    const haircut = has("navalhado") ? "navalhado" : has("corte") ? "corte" : null;
    const total = selectedServices.reduce(
      (sum, id) => sum + (serviceCatalog.find((item) => item.id === id)?.price ?? 0),
      0
    );

    let label = selectedServices
      .map((id) => serviceCatalog.find((item) => item.id === id)?.label)
      .filter(Boolean)
      .join(" + ");

    let combo = false;

    if (haircut && has("barba") && has("sobrancelha")) {
      label = `${haircut === "navalhado" ? "Corte navalhado" : "Corte"} + barba + sobrancelha`;
      combo = true;
    } else if (haircut && has("barba")) {
      label = `${haircut === "navalhado" ? "Corte navalhado" : "Corte"} + barba`;
      combo = true;
    } else if (haircut && has("sobrancelha")) {
      label = `${haircut === "navalhado" ? "Corte navalhado" : "Corte"} + sobrancelha`;
      combo = true;
    } else if (has("barba") && has("sobrancelha")) {
      label = "Barba + sobrancelha";
      combo = true;
    }

    return { label, total, combo };
  }, [selectedServices]);

  const personalizedMessage = useMemo(() => {
    const firstName = name.trim() || "cliente";
    return `Olá, meu nome é ${firstName}. Quero fazer ${selection.label || "um serviço de barbearia"} (${formatPrice(selection.total)}) e pretendo agendar ${days ? days.toLowerCase() : "em um dia disponível"} ${period ? `na parte da ${period.toLowerCase()}` : ""}. Conheci a Lanzinnis pelo site.`;
  }, [name, selection, period, days]);

  const compareOptions = {
    perfil: {
      title: "Perfil / lateral",
      before: "https://i.imgur.com/uZ9tXsm.png",
      after: "https://i.imgur.com/j7UBqTQ.png",
    },
    frente: {
      title: "Frente",
      before: "https://i.imgur.com/UiHnWNQ.png",
      after: "https://i.imgur.com/nBs53sq.png",
    },
  } as const;

  const activeCompare = compareOptions[compareView];
  const validBooking = Boolean(name.trim() && selectedServices.length && period && days);

  function resetFlow() {
    setJourney(null);
    setStep("choice");
    setName("");
    setSelectedServices([]);
    setPeriod("");
    setDays("");
  }

  function openBooking() {
    setJourney("barbearia");
    setStep("choice");
    setOpen(true);
  }

  function chooseProsthesis() {
    setJourney("protese");
    setOpen(false);
    requestAnimationFrame(() => {
      document.getElementById("protese")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function toggleService(id: ServiceId) {
    setSelectedServices((current) => {
      let next = [...current];

      if (id === "corte" || id === "navalhado") {
        next = next.filter((item) => item !== "corte" && item !== "navalhado");
        if (!current.includes(id)) next.push(id);
        return next;
      }

      return current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id];
    });
  }

  return (
    <main>
      {open && (
        <div className="entry-backdrop" role="dialog" aria-modal="true" aria-label="Escolha seu atendimento">
          <div className="entry-modal">
            <div className="modal-top">
              <LanzinnisWordmark className="modal-wordmark" />
              <button className="modal-close" onClick={() => setOpen(false)} aria-label="Fechar">
                <X size={19} />
              </button>
            </div>

            {journey === null && (
              <div className="modal-stage">
                <span className="eyebrow">Como podemos te atender?</span>
                <h2>Escolha o que você procura hoje.</h2>
                <p className="modal-intro">
                  Um caminho rápido para quem quer agendar a barbearia e outro para quem quer conhecer a prótese capilar.
                </p>

                <div className="journey-grid">
                  <button className="journey-card light-card" onClick={() => setJourney("barbearia")}>
                    <span className="journey-icon"><Scissors size={23} /></span>
                    <div>
                      <strong>Barbearia</strong>
                      <p>Corte, barba, sobrancelha e combinações.</p>
                    </div>
                    <em>Agendar horário <ArrowRight size={16} /></em>
                  </button>

                  <button className="journey-card dark-card" onClick={chooseProsthesis}>
                    <span className="journey-icon"><Sparkles size={23} /></span>
                    <div>
                      <strong>Prótese capilar</strong>
                      <p>Antes e depois, processo e avaliação personalizada.</p>
                    </div>
                    <em>Conhecer solução <ArrowRight size={16} /></em>
                  </button>
                </div>
              </div>
            )}

            {journey === "barbearia" && step === "choice" && (
              <div className="modal-stage">
                <button className="back-link" onClick={resetFlow}>
                  <ChevronLeft size={16} /> início
                </button>
                <span className="eyebrow">Barbearia</span>
                <h2>Como você prefere agendar?</h2>
                <p className="modal-intro">Escolha falar direto com a equipe ou envie sua preferência já organizada.</p>

                <div className="booking-choice-grid">
                  <a
                    className="booking-choice"
                    href={whatsappUrl("Olá, vim pelo site e gostaria de agendar um horário na barbearia.")}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <MessageCircle size={24} />
                    <strong>Agendamento rápido</strong>
                    <span>Abra o WhatsApp e combine o horário diretamente.</span>
                    <em>Ir para o WhatsApp <ArrowRight size={15} /></em>
                  </a>

                  <button className="booking-choice featured-choice" onClick={() => setStep("booking")}>
                    <CalendarDays size={24} />
                    <strong>Agendamento personalizado</strong>
                    <span>Escolha serviço, período e disponibilidade antes de enviar.</span>
                    <em>Montar meu pedido <ArrowRight size={15} /></em>
                  </button>
                </div>
              </div>
            )}

            {journey === "barbearia" && step === "booking" && (
              <div className="modal-stage">
                <button className="back-link" onClick={() => setStep("choice")}>
                  <ChevronLeft size={16} /> voltar
                </button>
                <span className="eyebrow">Agendamento personalizado</span>
                <h2>Deixe seu pedido pronto.</h2>
                <p className="modal-intro">Você escolhe as preferências e a equipe confirma o melhor horário pelo WhatsApp.</p>

                <div className="booking-form">
                  <label className="field-label">Seu nome</label>
                  <div className="name-field">
                    <UserRound size={18} />
                    <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex.: Gustavo" />
                  </div>

                  <div className="field-heading">
                    <label className="field-label">O que você quer fazer?</label>
                    <small>Escolha mais de um serviço e o combo é montado automaticamente.</small>
                  </div>

                  <div className="services-options">
                    {serviceCatalog.map((item) => {
                      const active = selectedServices.includes(item.id);
                      return (
                        <button
                          key={item.id}
                          className={active ? "service-option selected" : "service-option"}
                          onClick={() => toggleService(item.id)}
                        >
                          <span>{active && <Check size={14} />}{item.label}</span>
                          <b>{formatPrice(item.price)}</b>
                        </button>
                      );
                    })}
                  </div>

                  <div className="combo-grid">
                    <button className="combo-card" onClick={() => setSelectedServices(["corte", "barba"])}>
                      <div>
                        <small>COMBO</small>
                        <strong>Corte + barba</strong>
                      </div>
                      <b>R$ 65</b>
                    </button>

                    <button className="combo-card popular" onClick={() => setSelectedServices(["corte", "barba", "sobrancelha"])}>
                      <span className="popular-badge">MAIS PEDIDO</span>
                      <div>
                        <small>COMBO COMPLETO</small>
                        <strong>Corte + barba + sobrancelha</strong>
                      </div>
                      <b>R$ 80</b>
                    </button>
                  </div>

                  {selectedServices.length > 0 && (
                    <div className="booking-summary">
                      <div>
                        <small>{selection.combo ? "COMBO SELECIONADO" : "SERVIÇO SELECIONADO"}</small>
                        <strong>{selection.label}</strong>
                      </div>
                      <b>{formatPrice(selection.total)}</b>
                    </div>
                  )}

                  <label className="field-label">Qual período fica melhor?</label>
                  <div className="choice-row three">
                    {periods.map((item) => (
                      <button key={item} className={period === item ? "choice-pill selected" : "choice-pill"} onClick={() => setPeriod(item)}>
                        {item}
                      </button>
                    ))}
                  </div>

                  <label className="field-label">Quando você prefere?</label>
                  <div className="choice-row two">
                    {dayOptions.map((item) => (
                      <button key={item} className={days === item ? "choice-pill selected" : "choice-pill"} onClick={() => setDays(item)}>
                        {item}
                      </button>
                    ))}
                  </div>

                  <a
                    className={validBooking ? "button primary booking-submit" : "button primary booking-submit disabled"}
                    href={validBooking ? whatsappUrl(personalizedMessage) : undefined}
                    target="_blank"
                    rel="noreferrer"
                    aria-disabled={!validBooking}
                  >
                    Finalizar no WhatsApp <MessageCircle size={18} />
                  </a>
                  {!validBooking && <small className="helper">Preencha nome, serviço, período e disponibilidade.</small>}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <section className="hero">
        <div className="hero-shade" />
        <div className="hero-inner">
          <LanzinnisWordmark className="hero-wordmark" />
        </div>
        <div className="hero-bottom">
          <span>Londrina • PR</span>
          <button onClick={() => { resetFlow(); setOpen(true); }}>
            Agendar atendimento <ArrowRight size={16} />
          </button>
        </div>
      </section>

      <section className="section prosthesis" id="protese">
        <div className="shell prosthesis-layout">
          <div className="section-copy">
            <span className="eyebrow">Prótese capilar masculina</span>
            <h1>Veja a diferença. Depois decida.</h1>
            <p className="lead">
              A proposta é integrar densidade, linha frontal e corte ao rosto sem deixar o resultado com aparência artificial.
            </p>

            <div className="benefit-list">
              <span><Check size={16} /> Avaliação personalizada</span>
              <span><Check size={16} /> Aplicação e integração ao corte</span>
              <span><Check size={16} /> Manutenção e higienização</span>
            </div>

            <a
              className="button primary"
              href={whatsappUrl("Olá, vim pelo site e gostaria de agendar uma avaliação para prótese capilar.")}
              target="_blank"
              rel="noreferrer"
            >
              Quero uma avaliação <MessageCircle size={18} />
            </a>
          </div>

          <div className="comparison-panel">
            <div className="compare-header">
              <div>
                <small>RESULTADOS</small>
                <strong>Compare por ângulo</strong>
              </div>
              <div className="compare-switcher" aria-label="Escolha o ângulo da comparação">
                <button className={compareView === "perfil" ? "compare-tab active" : "compare-tab"} onClick={() => setCompareView("perfil")}>
                  Perfil
                </button>
                <button className={compareView === "frente" ? "compare-tab active" : "compare-tab"} onClick={() => setCompareView("frente")}>
                  Frente
                </button>
              </div>
            </div>

            <CompareSlider key={compareView} beforeSrc={activeCompare.before} afterSrc={activeCompare.after} />

            <div className="slider-note">
              <strong>{activeCompare.title}</strong>
              <span>Arraste para revelar a transformação.</span>
            </div>
          </div>
        </div>
      </section>

      <section className="process-section">
        <div className="shell">
          <div className="section-heading">
            <span className="eyebrow light-eyebrow">Como funciona</span>
            <h2>Um processo pensado para parecer seu.</h2>
          </div>

          <div className="steps">
            <article>
              <b>01</b>
              <h3>Avaliação</h3>
              <p>Entendemos seu objetivo, estilo, rotina e o tipo de resultado que você procura.</p>
            </article>
            <article>
              <b>02</b>
              <h3>Aplicação</h3>
              <p>Integramos densidade, linha frontal e corte para construir um visual coerente.</p>
            </article>
            <article>
              <b>03</b>
              <h3>Manutenção</h3>
              <p>Higienização, retirada, reaplicação e ajustes para preservar o acabamento.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="section barber-section">
        <div className="shell">
          <div className="barber-heading">
            <div>
              <span className="eyebrow">Barbearia Lanzinnis</span>
              <h2>Barbearia também é parte da casa.</h2>
            </div>
            <button className="button outline" onClick={openBooking}>
              Agendar barbearia <Scissors size={18} />
            </button>
          </div>

          <div className="barber-services">
            {serviceCatalog.map((item) => (
              <div className="barber-service" key={item.id}>
                <span>{item.label}</span>
                <b>{formatPrice(item.price)}</b>
              </div>
            ))}
            <div className="barber-service highlight-service">
              <span>Corte + barba + sobrancelha <small>Mais pedido</small></span>
              <b>R$ 80</b>
            </div>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="shell footer-grid">
          <div className="footer-brand">
            <LanzinnisWordmark className="footer-wordmark" />
            <p>Prótese capilar masculina e barbearia em Londrina.</p>
          </div>

          <div className="footer-info">
            <MapPin size={18} />
            <div>
              <small>ENDEREÇO</small>
              <span>Rua Cajá, 22 • Londrina, PR</span>
            </div>
          </div>

          <div className="footer-info">
            <Clock3 size={18} />
            <div>
              <small>ATENDIMENTO</small>
              <span>Segunda a sábado • 09:00 às 19:30</span>
            </div>
          </div>

          <a className="footer-info" href={whatsappUrl("Olá, vim pelo site e gostaria de falar com a Lanzinnis.")} target="_blank" rel="noreferrer">
            <MessageCircle size={18} />
            <div>
              <small>WHATSAPP</small>
              <span>(43) 99952-2591</span>
            </div>
          </a>
        </div>
      </footer>

      <a className="whatsapp-float" href={whatsappUrl("Olá, vim pelo site e gostaria de falar com a Lanzinnis.")} target="_blank" rel="noreferrer" aria-label="WhatsApp">
        <MessageCircle size={23} />
      </a>
    </main>
  );
}

export default App;
