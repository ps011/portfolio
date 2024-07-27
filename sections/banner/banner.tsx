import { useEffect } from "react";
import s from "./banner.module.scss";
import Image from "next/image";

interface BannerProps {
    illustration: string;
    texts: string[];
    ctaLabel: string;
    ctaUrl: string;
    downloadable: boolean;

}
const Banner = ({
  illustration, texts, ctaLabel, ctaUrl, downloadable,
}: BannerProps) => {
  let toRotate;
  let el;
  let loopNum;
  let period;
  let txt;
  let isDeleting;
  const tick = () => {
    const i = loopNum % toRotate.length;
    const fullTxt = toRotate[i];
    if (isDeleting) {
      txt = fullTxt.substring(0, txt.length - 1);
    } else {
      txt = fullTxt.substring(0, txt.length + 1);
    }
    el.innerHTML = `<span>${txt}</span>`;
    let delta = 200 - Math.random() * 100;
    if (isDeleting) {
      delta /= 2;
    }
    if (!isDeleting && txt === fullTxt) {
      delta = period;
      isDeleting = true;
    } else if (isDeleting && txt === "") {
      isDeleting = false;
      loopNum += 1;
      delta = 500;
    }
    setTimeout(() => {
      tick();
    }, delta);
  };

  const TxtType = (elL, toRotateL, periodL) => {
    toRotate = toRotateL;
    el = elL;
    loopNum = 0;
    period = parseInt(periodL, 10) || 2000;
    txt = "";
    tick();
    isDeleting = false;
  };

  useEffect(() => {
    const elements = document.querySelectorAll("#typewrite");
    for (let i = 0; i < elements.length; i += 1) {
      toRotate = elements[i].getAttribute("data-type");
      period = elements[i].getAttribute("data-period");
      if (toRotate) {
        TxtType(elements[i], JSON.parse(toRotate), period);
      }
    }
    const css = document.createElement("style");
    css.type = "text/css";
    css.innerHTML = ".typewrite > .wrap { border-right: 0.08em solid #fff}";
    document.body.appendChild(css);
  }, []);
  return (
    <section className="section-shaped">
      <div className="shape shape-style-1 shape-default">
      </div>
      <div className="container py-md">
        <div className="row justify-content-between align-items-center">
          <div className="col-lg-6 mb-lg-auto">
            <Image height="300" width="300" src={illustration} alt="Banner logo" data-aos="fade-right" className="img-fluid" />
          </div>
          <div className="col-lg-5 mb-5 mb-lg-0">
            <h4 className={s.static}>Hi, I&apos;m</h4>
            <h1 className={`${s["header-title-text"]} type-animate`}>
              <a href="#" id="typewrite" className={s.typewrite} data-period="2000" data-type={JSON.stringify(texts)}>
                <span className="wrap" />
              </a>
            </h1>
            <p className="lead text-white mt-4" />
            { ctaLabel && (
            <a href={ctaUrl} download={downloadable} className="btn btn-secondary">
              <span className="btn-inner--text">{ctaLabel}</span>
            </a>
            )}
          </div>
        </div>
      </div>
      <div className="separator separator-bottom separator-skew">
        <svg x="0" y="0" viewBox="0 0 2560 100" preserveAspectRatio="none" version="1.1" xmlns="http://www.w3.org/2000/svg">
          <polygon className={s.fillWhite} points="2560 0 2560 100 0 100" />
        </svg>
      </div>
    </section>
  );
};

export default Banner;
