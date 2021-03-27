import { useEffect } from 'react'
import './banner.module.scss'

const Banner = () => {
  let toRotate
  let el
  let loopNum
  let period
  let txt
  let isDeleting

  const tick = () => {
    const i = loopNum % toRotate.length
    const fullTxt = toRotate[i]
    if (isDeleting) {
      txt = fullTxt.substring(0, txt.length - 1)
    } else {
      txt = fullTxt.substring(0, txt.length + 1)
    }
    el.innerHTML = `<span class="wrap">${txt}</span>`
    let delta = 200 - Math.random() * 100
    if (isDeleting) {
      delta /= 2
    }
    if (!isDeleting && txt === fullTxt) {
      delta = period
      isDeleting = true
    } else if (isDeleting && txt === '') {
      isDeleting = false
      loopNum += 1
      delta = 500
    }
    setTimeout(() => {
      tick()
    }, delta)
  }

  const TxtType = (elL, toRotateL, periodL) => {
    toRotate = toRotateL
    el = elL
    loopNum = 0
    period = parseInt(periodL, 10) || 2000
    txt = ''
    tick()
    isDeleting = false
  }

  useEffect(() => {
    const elements = document.getElementsByClassName('typewrite');
    for (let i = 0; i < elements.length; i += 1) {
      toRotate = elements[i].getAttribute('data-type');
      period = elements[i].getAttribute('data-period');
      if (toRotate) {
        TxtType(elements[i], JSON.parse(toRotate), period);
      }
    }
    const css = document.createElement('style');
    css.type = 'text/css';
    css.innerHTML = '.typewrite > .wrap { border-right: 0.08em solid #fff}';
    document.body.appendChild(css);
  }, [])
  return (
    <section className="section-shaped">
      <div className="shape shape-style-1 shape-default">
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>
      <div className="container py-md">
        <div className="row justify-content-between align-items-center">
          <div className="col-lg-6 mb-lg-auto">
            <img src="/images/illustrations/banner.svg" alt="Banner logo" data-aos="fade-right" className="img-fluid" />
          </div>
          <div className="col-lg-5 mb-5 mb-lg-0">
            <h4 className="static">Hi, I'm</h4>
            <h1 className="header-title-text type-animate">
              <a href="/" className="typewrite" data-period="2000" data-type='[ "Prasheel Soni", "Full Stack Dev", "Open Source Enthusiast", "Traveller", "The Frontend Guy", "From India" ]'>
                <span className="wrap" />
              </a>
            </h1>
            <p className="lead text-white mt-4" />
            <a download href="docs/prasheel-resume.pdf" className="btn btn-icon btn-3 btn-white" type="button">
              <span className="btn-inner--icon"><i className="ni ni-cloud-download-95" /></span>
              <span className="btn-inner--text">Resume</span>
            </a>
          </div>
        </div>
      </div>
      <div className="separator separator-bottom separator-skew">
        <svg x="0" y="0" viewBox="0 0 2560 100" preserveAspectRatio="none" version="1.1" xmlns="http://www.w3.org/2000/svg">
          <polygon className="fill-white" points="2560 0 2560 100 0 100" />
        </svg>
      </div>
    </section>
  )
}

export default Banner
