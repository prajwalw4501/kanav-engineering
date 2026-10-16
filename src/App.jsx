import React, { useEffect, useState } from 'react'
import {
  ArrowDownRight, ArrowRight, Menu, X, Building2, Factory, ShieldCheck,
  Ruler, HardHat, MapPin, CheckCircle2, Phone, Mail, MessageCircle,
  MoveUpRight, Wrench, Layers3, Users, Award, Globe2, ChevronRight, ChevronLeft
} from 'lucide-react'
import { siteData, services, sectors, projectLocations, clientExperience, aboutImages } from './data/siteData'

const image = (url) => ({ backgroundImage: `linear-gradient(90deg, rgba(12,18,26,.30), rgba(12,18,26,.08)), url("${url}")` })

// lucide-react has no brand icons, so the WhatsApp logo is inlined.
function WhatsAppIcon({ size = 16 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.14-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2.01-1.41.25-.69.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35zM12.05 21.78h-.01a9.9 9.9 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.9-9.88a9.82 9.82 0 0 1 6.99 2.9 9.82 9.82 0 0 1 2.89 6.99c0 5.45-4.44 9.88-9.89 9.88zM20.52 3.45A11.8 11.8 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.68 1.45h.01c6.55 0 11.89-5.34 11.89-11.89 0-3.18-1.24-6.16-3.48-8.46z"/></svg>
}

function Header() {
  const [open, setOpen] = useState(false)
  const links = [['About', '#about'], ['Services', '#services'], ['Experience', '#experience'], ['Contact', '#contact']]
  return <header className="header">
    <div className="container nav-wrap">
      <a href="#home" className="brand" aria-label="Kanav Engineering home">
        <span className="brand-mark"><Building2 size={25}/></span>
        <span><b>KANAV <em>ENGINEERING</em></b><small>ENGINEERING EXCELLENCE</small></span>
      </a>
      <nav className={open ? 'nav-links nav-open' : 'nav-links'}>
        {links.map(([label, href]) => <a key={label} href={href} onClick={() => setOpen(false)}>{label}</a>)}
        <a className="nav-cta" href="#contact" onClick={() => setOpen(false)}>Discuss a project <ArrowRight size={15}/></a>
      </nav>
      <button className="menu-toggle" onClick={() => setOpen(!open)} aria-label="Toggle navigation">{open ? <X/> : <Menu/>}</button>
    </div>
  </header>
}

function AboutSlider({ images }) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const count = images.length

  useEffect(() => {
    if (paused || count < 2) return
    const id = setInterval(() => setIndex((i) => (i + 1) % count), 3000)
    return () => clearInterval(id)
  }, [paused, count])

  return <div className="about-photo about-slider" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
    <div className="about-slider-track" style={{ transform: `translateX(-${index * 100}%)` }}>
      {images.map((url) => <div className="about-slide" key={url} style={image(url)}></div>)}
    </div>
    {count > 1 && <>
      <button type="button" className="about-slider-nav prev" aria-label="Previous image" onClick={() => setIndex((i) => (i - 1 + count) % count)}><ChevronLeft size={22}/></button>
      <button type="button" className="about-slider-nav next" aria-label="Next image" onClick={() => setIndex((i) => (i + 1) % count)}><ChevronRight size={22}/></button>
    </>}
    {count > 1 && <div className="about-slider-dots">{images.map((url, i) => <button key={url} type="button" className={i === index ? 'active' : ''} aria-label={`Show image ${i + 1}`} onClick={() => setIndex(i)}/>)}</div>}
  </div>
}

function SectionHeading({ eyebrow, title, text, light = false }) {
  return <div className={`section-heading ${light ? 'light' : ''}`}>
    <span className="eyebrow">{eyebrow}</span>
    <h2>{title}</h2>
    {text && <p>{text}</p>}
  </div>
}

function App() {
  const emailReady = siteData.email && !siteData.email.startsWith('REPLACE_')
  const phoneReady = siteData.phone && !siteData.phone.startsWith('REPLACE_')
  const whatsappReady = siteData.whatsapp && !siteData.whatsapp.startsWith('REPLACE_')
  const emailHref = emailReady ? `mailto:${siteData.email}` : '#contact'
  const phoneHref = phoneReady ? `tel:${siteData.phone}` : '#contact'
  const whatsappHref = whatsappReady ? `https://wa.me/${siteData.whatsapp.replace(/\D/g, '')}` : '#contact'

  const [status, setStatus] = useState('idle')

  async function handleContactSubmit(e) {
    e.preventDefault()
    const formEl = e.currentTarget
    setStatus('sending')
    try {
      const res = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(formEl))),
      })
      if (!res.ok) throw new Error('Request failed')
      formEl.reset()
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  return <>
    <Header/>
    <main>
      <section className="hero" id="home">
        <div className="hero-image" style={image('https://plus.unsplash.com/premium_photo-1664300608028-15bcc4da4996?auto=format&fit=crop&w=2200&q=85')}></div>
        <div className="hero-grid"></div>
        <div className="container hero-content">
          <div className="hero-copy">
            <div className="eyebrow eyebrow-gold"><span className="eyebrow-line"></span> FABRICATION · ENGINEERING · INSTALLATION</div>
            <h1>Building strength.<br/><span>Within 3 Days</span></h1>
            <p className="hero-lede">End-to-end fabrication and engineering solutions for industrial, infrastructure, commercial and residential projects.</p>
            <div className="hero-actions">
              <a href="#services" className="button button-gold">Explore our capabilities <ArrowRight size={17}/></a>
              <a href="#about" className="text-link">Discover Kanav <ArrowDownRight size={17}/></a>
            </div>
            <div className="hero-location"><MapPin size={15}/> Based in {siteData.location}</div>
          </div>
          <div className="hero-stamp"><span>KE</span><small>BUILT ON<br/>PRECISION</small></div>
        </div>
        <div className="hero-bottom"><span>01 / ENGINEERED TO PERFORM</span><span>SCROLL TO EXPLORE ↓</span></div>
      </section>

      <section className="stats-strip" aria-label="Company facts">
        <div className="container stats-grid">
          <div className="stat"><span className="stat-number">{siteData.established}</span><span className="stat-label">Established</span></div>
          <div className="stat"><span className="stat-number">{siteData.workshopArea}</span><span className="stat-label">Workshop area*</span></div>
          <div className="stat"><span className="stat-number">{siteData.workforce}</span><span className="stat-label">Skilled professionals</span></div>
          <div className="stat"><span className="stat-number">{siteData.experience}</span><span className="stat-label">Combined industry experience</span></div>
        </div>
      </section>

      <section className="section about-section" id="about">
        <div className="container about-grid">
          <div className="about-visual">
            <AboutSlider images={aboutImages}/>
            <div className="photo-caption"><span className="caption-icon"><Ruler size={20}/></span><span><b>From concept to completion</b><small>One coordinated fabrication journey</small></span></div>
            <div className="outline-square"></div>
          </div>
          <div className="about-copy">
            <SectionHeading eyebrow="ABOUT KANAV ENGINEERING" title={<>Built on expertise.<br/><span className="gold-text">Driven by quality.</span></>} />
            <p>Kanav Engineering is a professionally managed fabrication company specializing in industrial sheds, structural fabrication, mild steel (M.S.) fabrication, stainless steel (S.S.) fabrication and architectural metal solutions.</p>
            <p>With a focus on quality workmanship, engineering excellence, timely execution and customer satisfaction, we support builders, architects, mining companies, industrial clients, government departments, contractors and residential customers.</p>
            <div className="about-points">
              <div><CheckCircle2/><span><b>End-to-end capability</b><small>Design, manufacturing, installation and project execution.</small></span></div>
              <div><CheckCircle2/><span><b>Quality and safety focus</b><small>Professional coordination and dependable delivery.</small></span></div>
            </div>
            <a href="#contact" className="inline-link">Let's discuss your project <ArrowRight size={16}/></a>
          </div>
        </div>
      </section>

      <section className="section services-section" id="services">
        <div className="container">
          <div className="services-heading-row">
            <SectionHeading eyebrow="WHAT WE DO" title={<>Fabrication solutions<br/>made for <span className="gold-text">real-world demands.</span></>} text="A versatile portfolio of structural, industrial and architectural metalwork for projects of different scales." />
            <div className="services-side-note"><span className="side-note-line"></span><p>Technical capability.<br/>Practical execution.<br/>Lasting value.</p></div>
          </div>
          <div className="services-grid">
            {services.map((service, index) => <article className="service-card" key={service.number}>
              <div className="service-image" style={image(service.image)}><span className="service-number">{service.number}</span><span className="service-image-arrow"><MoveUpRight size={20}/></span></div>
              <div className="service-content">
                <h3>{service.title}</h3><p>{service.description}</p>
                <ul>{service.items.map(item => <li key={item}><span className="mini-dot"></span>{item}</li>)}</ul>
                <a href="#contact" className="service-link">Enquire about this service <ArrowRight size={15}/></a>
              </div>
            </article>)}
          </div>
        </div>
      </section>

      <section className="process-section">
        <div className="container process-layout">
          <div className="process-intro">
            <span className="eyebrow eyebrow-gold">HOW WE WORK</span>
            <h2>Clear coordination.<br/><span>Confident delivery.</span></h2>
            <p>Every engagement is approached with professional coordination from design and manufacturing through installation and project execution.</p>
          </div>
          <div className="process-steps">
            {[['01','Understand','Project scope, requirements and site needs.'],['02','Plan & fabricate','Coordinate technical requirements and fabrication.'],['03','Install & deliver','Execute on site with attention to quality and safety.']].map(([n,t,d])=><div className="process-step" key={n}><span className="process-number">{n}</span><div><h3>{t}</h3><p>{d}</p></div><ChevronRight className="process-chevron"/></div>)}
          </div>
        </div>
      </section>

      <section className="section strengths-section">
        <div className="container">
          <SectionHeading eyebrow="THE KANAV ADVANTAGE" title={<>A dependable partner for<br/><span className="gold-text">demanding projects.</span></>} text="A combination of people, capability and project experience built around customer requirements."/>
          <div className="strengths-grid">
            {[
              [Award,'Experienced team','35+ skilled professionals and 25+ years of combined industry experience.'],
              [Factory,'Fabrication capability','A broad scope spanning industrial structures and architectural metal products.'],
              [Globe2,'Multi-state execution','Project experience across Maharashtra, Madhya Pradesh, Uttar Pradesh and Chhattisgarh.'],
              [ShieldCheck,'Quality & safety','A consistent focus on workmanship, safety, coordination and timely execution.'],
              [Users,'Industry relationships',`${siteData.builders} builder associations and ${siteData.architects} architect and engineer associations.`],
              [Wrench,'Customized solutions','Solutions shaped around project scope, site requirements and intended use.'],
            ].map(([Icon,title,description])=><div className="strength-card" key={title}><span className="strength-icon"><Icon size={23}/></span><h3>{title}</h3><p>{description}</p></div>)}
          </div>
        </div>
      </section>

      <section className="section experience-section" id="experience">
        <div className="container experience-grid">
          <div>
            <SectionHeading eyebrow="PROJECT FOOTPRINT" title={<>Experience that<br/><span className="gold-text">reaches beyond borders.</span></>} text="The company profile records project locations across multiple states, supporting regional and multi-state delivery."/>
            <div className="location-list">{projectLocations.map((location, i)=><div className="location-row" key={location.state}><span className="location-index">0{i+1}</span><b>{location.state}</b><span>{location.places}</span></div>)}</div>
          </div>
          <div className="experience-panel">
            <span className="eyebrow eyebrow-gold">INDUSTRIES & PARTNER NETWORKS</span>
            {/* <h3>Industries & partner networks</h3> */}
            {/* <p className="panel-intro">Selected client and partner experience as listed in the company profile.</p> */}
            {clientExperience.map(item=><div className="client-row" key={item.sector}><span>{item.sector}</span><p>{item.names}</p></div>)}
          </div>
        </div>
      </section>

      <section className="sectors-section">
        <div className="container sectors-wrap">
          <div><span className="eyebrow eyebrow-gold">SECTORS WE SERVE</span><h2>Built for a range<br/>of industries.</h2></div>
          <div className="sector-tags">{sectors.map((sector, i)=><span key={sector}><span>0{i+1}</span>{sector}</span>)}</div>
        </div>
      </section>

      <section className="contact-section section" id="contact">
        <div className="container contact-grid">
          <div className="contact-copy">
            <SectionHeading eyebrow="START A CONVERSATION" title={<>Have a project<br/><span className="gold-text">in mind?</span></>} text="Tell us about your industrial, infrastructure, commercial or residential fabrication requirements."/>
            <a className="contact-detail" href={siteData.mapsUrl} target="_blank" rel="noreferrer"><span><MapPin size={19}/></span><div><b>Visit our Workshop</b><p>{siteData.address}</p></div></a>
            <a className="contact-detail" href={phoneHref}><span><Phone size={19}/></span><div><b>Call Us</b><p>{phoneReady ? siteData.phone : 'Phone number to be added'}</p></div></a>
            <a className="contact-detail" href={emailHref}><span><Mail size={19}/></span><div><b>Email To</b><p>{emailReady ? siteData.email : 'Email address to be added'}</p></div></a>
            <div className="contact-actions">
              <a className="button button-dark" href={whatsappHref} target={whatsappReady ? '_blank' : undefined} rel="noreferrer"><WhatsAppIcon size={16}/> WhatsApp</a>
            </div>
          </div>
          <form className="contact-form" onSubmit={handleContactSubmit}>
            <div className="form-heading"><span>PROJECT ENQUIRY</span><h3>Let's talk about what you need.</h3><p>Share a few details and we'll be ready to discuss your requirements.</p></div>
            <div className="form-row">
              <label>Your name<input name="name" required placeholder="Full name"/></label>
              <label>Company<input name="company" placeholder="Company (optional)"/></label>
            </div>
            <div className="form-row">
              <label>Phone number<input name="phone" required type="tel" placeholder="Your contact number"/></label>
              <label>Project type<select name="project" defaultValue="" required><option value="" disabled>Select a service</option><option>Industrial sheds / structures</option><option>M.S. fabrication</option><option>S.S. fabrication</option><option>Architectural metal solutions</option><option>Site fabrication & installation</option><option>Other / not sure yet</option></select></label>
            </div>
            <label>Project details<textarea name="message" required rows="4" placeholder="Tell us about your project, location and requirements..."/></label>
            <button type="submit" className="button button-gold submit-button" disabled={status === 'sending'}>{status === 'sending' ? 'Sending...' : 'Send enquiry'} <ArrowRight size={17}/></button>
            {status === 'success' && <p className="form-note" role="status" style={{ color: '#15803d', fontWeight: 600 }}>Thank you! Your enquiry has been received. Our team will contact you shortly.</p>}
            {status === 'error' && <p className="form-note" role="alert" style={{ color: '#b91c1c', fontWeight: 600 }}>Sorry, we could not send your enquiry. Please try again or call us directly.</p>}
          </form>
        </div>
      </section>

      <section className="closing-banner">
        <div className="container closing-inner"><div><span className="eyebrow eyebrow-gold">KANAV ENGINEERING</span><h2>Building strength through<br/>engineering excellence.</h2></div><a href="#contact" className="round-arrow" aria-label="Contact Kanav Engineering"><ArrowRight size={25}/></a></div>
      </section>
    </main>
    <footer className="footer">
      <div className="container footer-main">
        <a href="#home" className="brand footer-brand"><span className="brand-mark"><Building2 size={23}/></span><span><b>KANAV <em>ENGINEERING</em></b><small>ENGINEERING EXCELLENCE</small></span></a>
        <p>Industrial sheds · Structural fabrication · Architectural metal solutions</p>
        <a href="#home" className="back-top">Back to top ↑</a>
      </div>
      <div className="container footer-bottom"><span>© {new Date().getFullYear()} Kanav Engineering. All rights reserved.</span><span>{siteData.location}</span></div>
    </footer>
    <a className="floating-contact" href={whatsappHref} aria-label="Contact via WhatsApp"><WhatsAppIcon size={24}/></a>
  </>
}

export default App
