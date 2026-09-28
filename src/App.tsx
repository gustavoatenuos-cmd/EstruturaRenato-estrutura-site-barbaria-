import {
  ArrowRight,
  Check,
  Instagram,
  MapPin,
  MessageCircle,
  Scissors,
  Sparkles,
  Star,
} from "lucide-react";
import { CompareSlider } from "./components/CompareSlider";

const whatsapp = "https://wa.me/5543999522591?text=Oi%2C%20vim%20pelo%20site%20da%20Lanzinnis%20e%20quero%20agendar%20uma%20avalia%C3%A7%C3%A3o.";
const whatsappBarber = "https://wa.me/5543999522591?text=Oi%2C%20vim%20pelo%20site%20da%20Lanzinnis%20e%20quero%20agendar%20um%20hor%C3%A1rio.";

const barberServices = [
  "Corte masculino",
  "Corte + barba",
  "Barba",
  "Sobrancelha",
  "Limpeza de pele",
];

const prosthesisServices = [
  "Avaliação personalizada",
  "Aplicação de prótese capilar",
  "Manutenção e higienização",
  "Retirada e reaplicação",
  "Ajuste e personalização",
  "Corte e integração",
];

function App() {
  return (
    <main>
      <section className="hero" id="inicio">
        <div className="hero-overlay" />
        <div className="hero-content">
          <img src="/assets/logo-lanzinnis.svg" alt="Lanzinnis" className="hero-logo" />
          <span className="hero-kicker">Prótese capilar & barbearia • Londrina</span>
        </div>
        <a className="hero-scroll" href="#protese">Conhecer prótese capilar <ArrowRight size={17} /></a>
      </section>

      <section className="section prosthesis" id="protese">
        <div className="shell two-columns">
          <div className="section-copy">
            <span className="eyebrow">Prótese capilar masculina</span>
            <h1>Naturalidade que você percebe no espelho. Não na prótese.</h1>
            <p className="lead">
              Avaliação, aplicação e manutenção em um processo pensado para integrar corte,
              densidade e acabamento ao seu estilo.
            </p>

            <div className="check-grid">
              {prosthesisServices.map((item) => (
                <div className="check-item" key={item}>
                  <span><Check size={15} /></span>
                  {item}
                </div>
              ))}
            </div>

            <a className="button primary" href={whatsapp} target="_blank" rel="noreferrer">
              Quero fazer uma avaliação <MessageCircle size={18} />
            </a>
          </div>

          <div className="slider-column">
            <CompareSlider
              beforeSrc="/assets/protese-antes.svg"
              afterSrc="/assets/protese-depois.svg"
            />
            <p className="slider-caption">Arraste para comparar o antes e depois de um resultado real.</p>
          </div>
        </div>
      </section>

      <section className="section process">
        <div className="shell">
          <div className="section-heading centered">
            <span className="eyebrow">Como funciona</span>
            <h2>Um processo simples do primeiro contato à manutenção.</h2>
          </div>

          <div className="process-grid">
            <article className="process-card">
              <div className="step">01</div>
              <Sparkles size={24} />
              <h3>Avaliação</h3>
              <p>Entendemos seu objetivo, rotina, estilo de corte e o resultado que você busca.</p>
            </article>
            <article className="process-card featured">
              <div className="step">02</div>
              <Scissors size={24} />
              <h3>Aplicação</h3>
              <p>Ajuste, corte e integração para construir um acabamento natural e coerente com você.</p>
            </article>
            <article className="process-card">
              <div className="step">03</div>
              <Check size={24} />
              <h3>Manutenção</h3>
              <p>Higienização, retirada, reaplicação e ajustes para manter o resultado no dia a dia.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="section barber" id="barbearia">
        <div className="shell two-columns reverse-mobile">
          <div className="barber-visual">
            <div className="barber-mark">
              <Scissors size={28} />
              <span>BARBEARIA</span>
            </div>
            <div className="barber-quote">Seu corte continua sendo parte do resultado.</div>
          </div>

          <div className="section-copy">
            <span className="eyebrow">Barbearia Lanzinnis</span>
            <h2>Do visual completo ao cuidado de rotina.</h2>
            <p className="lead">
              Além da prótese capilar, você encontra os serviços tradicionais da barbearia em um
              ambiente pensado para atendimento próximo e acabamento bem feito.
            </p>

            <div className="services-list">
              {barberServices.map((item) => (
                <div key={item} className="service-row">
                  <span>{item}</span>
                  <ArrowRight size={16} />
                </div>
              ))}
            </div>

            <a className="button secondary" href={whatsappBarber} target="_blank" rel="noreferrer">
              Agendar na barbearia <MessageCircle size={18} />
            </a>
          </div>
        </div>
      </section>

      <section className="section proof">
        <div className="shell proof-grid">
          <div>
            <span className="eyebrow">Atendimento em Londrina</span>
            <h2>Um lugar para cuidar do visual sem complicação.</h2>
          </div>
          <div className="proof-card">
            <div className="stars">
              {[0,1,2,3,4].map((n) => <Star key={n} size={18} fill="currentColor" />)}
            </div>
            <p>
              Atendimento personalizado, foco em naturalidade, discrição e conforto em cada etapa.
            </p>
          </div>
        </div>
      </section>

      <section className="contact">
        <div className="shell contact-grid">
          <div>
            <img src="/assets/logo-lanzinnis.svg" alt="Lanzinnis" className="footer-logo" />
            <p>Prótese capilar masculina e barbearia em Londrina.</p>
          </div>
          <div className="contact-item">
            <MapPin size={20} />
            <div><strong>Endereço</strong><span>Rua Cajá, 22 • Londrina, PR</span></div>
          </div>
          <div className="contact-item">
            <MessageCircle size={20} />
            <div><strong>WhatsApp</strong><a href={whatsapp} target="_blank" rel="noreferrer">(43) 99952-2591</a></div>
          </div>
          <div className="contact-item">
            <Instagram size={20} />
            <div><strong>Instagram</strong><a href="https://instagram.com/lanzinnisbarber" target="_blank" rel="noreferrer">@lanzinnisbarber</a></div>
          </div>
        </div>
      </section>

      <a className="whatsapp-float" href={whatsapp} target="_blank" rel="noreferrer" aria-label="Falar no WhatsApp">
        <MessageCircle size={24} />
      </a>
    </main>
  );
}

export default App;