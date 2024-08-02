import {useEffect} from "react";
import Image from "next/image";
import Link from "next/link";
import Button from "../../components/tailwind/button";

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
        css.innerHTML = "#typewrite > .wrap { border-right: 0.08em solid #fff}";
        document.body.appendChild(css);
    }, []);
    return (
        <section className="tw-bg-primary-100 tw-mb-16">
            <div className="tw-container tw-h-[70vh]">
                <div className="tw-h-full tw-flex tw-flex-col md:tw-justify-around md:tw-items-center md:tw-flex-row">
                    <div className="tw-flex-1 tw-flex">
                        <Image height="0" width="0" src={illustration} alt="Banner logo" data-aos="fade-right"
                               className="tw-m-auto tw-w-3/6 tw-h-auto"/>
                    </div>
                    <div className="tw-flex-1 tw-flex tw-flex-col tw-mb-5 md:tw-mb-0">
                        <div className="tw-flex-1 tw-min-h-8 md:tw-min-h-16">
                            <h4 className="tw-text-white">Hi, I&apos;m</h4>
                            <h1 className="tw-min-h-20 type-animate">
                                <a href="#" id="typewrite" className="tw-text-white tw-text-5xl" data-period="2000"
                                   data-type={JSON.stringify(texts)}>
                                </a>
                            </h1>
                        </div>
                        <div className="tw-flex-1 tw-mt-4">
                            {ctaLabel && (
                                <Button role="secondary">
                                    <Link href={ctaUrl} download={downloadable} target="_blank">
                                        <span className="hover:tw-text-black">{ctaLabel}</span>
                                    </Link>
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Banner;
