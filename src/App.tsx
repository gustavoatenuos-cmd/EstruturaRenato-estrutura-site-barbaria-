import { useMemo, useState } from "react";
import { ArrowRight, CalendarDays, Check, ChevronLeft, MessageCircle, Scissors, Sparkles, UserRound, X } from "lucide-react";
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
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 0 });
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
    const total = selectedServices.reduce((sum, id) => sum + (serviceCatalog.find((s) => s.id === id)?.price ?? 0), 0);

    let label = selectedServices
      .map((id) => serviceCatalog.find((s) => s.id === id)?.label)
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
    return `Olá, meu nome é ${firstName}. Quero fazer ${selection.label || "um serviço de barbearia"} (${formatPrice(selection.total)}) e pretendo agendar ${days ? days.toLowerCase() : "em um dia disponível"} ${period ? `na parte da ${period.toLowerCase()}` : ""}. Encontrei a Lanzinnis pelo site.`;
  }, [name, selection, period, days]);

  function resetFlow() {
    setJourney(null);
    setStep("choice");
    setName("");
    setSelectedServices([]);
    setPeriod("");
    setDays("");
  }

  function chooseBarber() {
    setJourney("barbearia");
    setStep("choice");
  }

  function chooseProsthesis() {
    setJourney("protese");
    setOpen(false);
    document.getElementById("protese")?.scrollIntoView({ behavior: "smooth" });
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

  function applyCombo(ids: ServiceId[]) {
    setSelectedServices(ids);
  }

  const compareOptions = {
    perfil: {
      title: "Perfil / lateral",
      before: "https://i.imgur.com/j7UBqTQ.png",
      after: "https://i.imgur.com/UiHnWNQ.png",
    },
    frente: {
      title: "Frente",
      before: "https://i.imgur.com/nBs53sq.png",
      after: "https://i.imgur.com/uZ9tXsm.png",
    },
  } as const;

  const activeCompare = compareOptions[compareView];

  const validBooking = Boolean(name.trim() && selectedServices.length && period && days);

  return (
    <main>
      {open && (
        <div className="entry-backdrop" role="dialog" aria-modal="true" aria-label="Escolha seu atendimento">
          <div className="entry-modal">
            <button className="modal-close" onClick={() => setOpen(false)} aria-label="Fechar"><X size={20} /></button>

            {journey === null && (
              <>
                <img src="/assets/logo-lanzinnis.svg" className="modal-logo" alt="Lanzinnis" />
                <span className="eyebrow">Como podemos te atender?</span>
                <h2>Escolha por onde quer começar.</h2>
                <div className="journey-grid">
                  <button className="journey-card" onClick={chooseBarber}>
                    <Scissors size={28} />
                    <strong>Barbearia</strong>
                    <span>Corte, barba, sobrancelha e atendimento personalizado.</span>
                    <em>Quero agendar <ArrowRight size={16} /></em>
                  </button>
                  <button className="journey-card dark" onClick={chooseProsthesis}>
                    <Sparkles size={28} />
                    <strong>Prótese capilar</strong>
                    <span>Conheça o processo, veja o antes e depois e solicite uma avaliação.</span>
                    <em>Conhecer prótese <ArrowRight size={16} /></em>
                  </button>
                </div>
              </>
            )}

            {journey === "barbearia" && step === "choice" && (
              <>
                <button className="back-link" onClick={resetFlow}><ChevronLeft size={16} /> voltar</button>
                <span className="eyebrow">Barbearia</span>
                <h2>Como você prefere agendar?</h2>
                <div className="booking-choice-grid">
                  <a className="booking-choice" href={whatsappUrl("Olá, vim pelo site e gostaria de agendar um horário na barbearia.")} target="_blank" rel="noreferrer">
                    <MessageCircle size={26} />
                    <strong>Agendamento rápido</strong>
                    <span>Abra o WhatsApp e fale direto com a equipe.</span>
                  </a>
                  <button className="booking-choice" onClick={() => setStep("booking")}>
                    <CalendarDays size={26} />
                    <strong>Agendamento personalizado</strong>
                    <span>Informe serviço, período e disponibilidade antes de ir ao WhatsApp.</span>
                  </button>
                </div>
              </>
            )}

            {journey === "barbearia" && step === "booking" && (
              <>
                <button className="back-link" onClick={() => setStep("choice")}><ChevronLeft size={16} /> voltar</button>
                <span className="eyebrow">Agendamento personalizado</span>
                <h2>Monte seu pedido em menos de 1 minuto.</h2>

                <div className="booking-form">
                  <label className="field-label">Seu nome</label>
                  <div className="name-field"><UserRound size={18} /><input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex.: Gustavo" /></div>

                  <div className="service-heading">
                    <div>
                      <label className="field-label">O que você quer fazer?</label>
                      <small>Você pode escolher mais de um serviço. O sistema monta o combo automaticamente.</small>
                    </div>
                  </div>

                  <div className="option-grid services-options smart-services">
                    {serviceCatalog.map((item) => {
                      const active = selectedServices.includes(item.id);
                      return (
                        <button key={item.id} className={active ? "option service-option selected" : "option service-option"} onClick={() => toggleService(item.id)}>
                          <span className="service-name">{active && <Check size={14} />}{item.label}</span>
                          <strong>{formatPrice(item.price)}</strong>
                        </button>
                      );
                    })}
                  </div>

                  <div className="combo-suggestions">
                    <span className="combo-title">Combos</span>
                    <button className="combo-card" onClick={() => applyCombo(["corte", "barba"])}>
                      <span><b>Corte + barba</b><small>O sistema também monta esse combo se você selecionar os dois serviços.</small></span>
                      <strong>R$ 65</strong>
                    </button>
                    <button className="combo-card popular" onClick={() => applyCombo(["corte", "barba", "sobrancelha"])}>
                      <span className="popular-badge">MAIS PEDIDO</span>
                      <span><b>Corte + barba + sobrancelha</b><small>Visual completo em uma única seleção.</small></span>
                      <strong>R$ 80</strong>
                    </button>
                  </div>

                  {selectedServices.length > 0 && (
                    <div className="smart-summary">
                      <div>
                        <small>{selection.combo ? "COMBO MONTADO AUTOMATICAMENTE" : "SERVIÇO SELECIONADO"}</small>
                        <strong>{selection.label}</strong>
                      </div>
                      <b>{formatPrice(selection.total)}</b>
                    </div>
                  )}

                  <label className="field-label">Qual período fica melhor?</label>
                  <div className="option-grid three">
                    {periods.map((item) => <button key={item} className={period === item ? "option selected" : "option"} onClick={() => setPeriod(item)}>{item}</button>)}
                  </div>

                  <label className="field-label">Quando você prefere?</label>
                  <div className="option-grid two">
                    {dayOptions.map((item) => <button key={item} className={days === item ? "option selected" : "option"} onClick={() => setDays(item)}>{item}</button>)}
                  </div>

                  <a className={validBooking ? "button primary booking-submit" : "button primary booking-submit disabled"} href={validBooking ? whatsappUrl(personalizedMessage) : undefined} target="_blank" rel="noreferrer" aria-disabled={!validBooking}>
                    Finalizar no WhatsApp <MessageCircle size={18} />
                  </a>
                  {!validBooking && <small className="helper">Preencha nome, serviço, período e disponibilidade para continuar.</small>}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <section className="hero">
        <div className="hero-shade" />
        <div className="hero-content">
          <img src="/assets/logo-lanzinnis.svg" alt="Lanzinnis" className="hero-logo" />
        </div>
        <button className="reopen" onClick={() => { resetFlow(); setOpen(true); }}>Agendar atendimento</button>
      </section>

      <section className="section prosthesis" id="protese">
        <div className="shell two-columns">
          <div className="section-copy">
            <span className="eyebrow">Prótese capilar masculina</span>
            <h1>Veja a diferença antes de decidir.</h1>
            <p className="lead">A proposta é integrar densidade, linha frontal e corte ao seu rosto de forma natural. Arraste a foto e compare o resultado.</p>
            <div className="mini-points">
              <span><Check size={15}/> Avaliação personalizada</span>
              <span><Check size={15}/> Aplicação e integração</span>
              <span><Check size={15}/> Manutenção e higienização</span>
            </div>
            <a className="button primary" href={whatsappUrl("Olá, vim pelo site e gostaria de agendar uma avaliação para prótese capilar.")} target="_blank" rel="noreferrer">Quero uma avaliação <MessageCircle size={18}/></a>
          </div>
          <div className="slider-wrap">
            <div className="compare-switcher" aria-label="Escolha o ângulo da comparação">
              <button
                className={compareView === "perfil" ? "compare-tab active" : "compare-tab"}
                onClick={() => setCompareView("perfil")}
                type="button"
              >
                Perfil / lateral
              </button>
              <button
                className={compareView === "frente" ? "compare-tab active" : "compare-tab"}
                onClick={() => setCompareView("frente")}
                type="button"
              >
                Frente
              </button>
            </div>

            <CompareSlider
              key={compareView}
              beforeSrc={activeCompare.before}
              afterSrc={activeCompare.after}
            />

            <div className="slider-note">
              <strong>{activeCompare.title}</strong> · arraste a divisão para revelar o antes e depois.
            </div>
          </div>
        </div>
      </section>

      <section className="section how">
        <div className="shell">
          <span className="eyebrow">Como funciona</span>
          <div className="steps">
            <article><b>01</b><h3>Avaliação</h3><p>Entendemos seu objetivo, rotina e estilo de corte.</p></article>
            <article><b>02</b><h3>Aplicação</h3><p>Ajuste, corte e acabamento para integrar a prótese ao visual.</p></article>
            <article><b>03</b><h3>Manutenção</h3><p>Higienização, retirada, reaplicação e os ajustes necessários.</p></article>
          </div>
        </div>
      </section>

      <section className="section barber-section">
        <div className="shell barber-call">
          <div>
            <span className="eyebrow">Barbearia Lanzinnis</span>
            <h2>Quer só cortar, fazer a barba ou cuidar do visual?</h2>
            <p className="lead">Você também pode usar o agendamento personalizado e chegar no WhatsApp com tudo definido.</p>
          </div>
          <button className="button light" onClick={() => { setJourney("barbearia"); setStep("choice"); setOpen(true); }}>Agendar barbearia <Scissors size={18}/></button>
        </div>
      </section>

      <a className="whatsapp-float" href={whatsappUrl("Olá, vim pelo site e gostaria de falar com a Lanzinnis.")} target="_blank" rel="noreferrer" aria-label="WhatsApp"><MessageCircle size={24}/></a>
    </main>
  );
}

export default App;