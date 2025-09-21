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
                    
    useEffect(() => {
        let toRotate: string | null;
        let el: HTMLElement | null;
        let loopNum: number;
        let period: string | null;
        let txt: string;
        let isDeleting: boolean;
        const tick = () => {
            if (!el || !toRotate) return;
            const i = loopNum % (JSON.parse(toRotate) as string[]).length;
            const fullTxt = (JSON.parse(toRotate) as string[])[i];
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
                delta = parseInt(period || "2000", 10);
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
        const TxtType = (elL: HTMLElement, toRotateL: string, periodL: string | null) => {
            toRotate = toRotateL;
            el = elL;
            loopNum = 0;
            period = periodL;
            txt = "";
            tick();
            isDeleting = false;
        };
        const elements = document.querySelectorAll<HTMLElement>("#typewrite");
        elements.forEach(currentEl => {
            const dataType = currentEl.getAttribute("data-type");
            const dataPeriod = currentEl.getAttribute("data-period");
            if (dataType) {
                TxtType(currentEl, dataType, dataPeriod);
            }
        });
        const css = document.createElement("style");
        css.type = "text/css";
        css.innerHTML = "#typewrite > span { border-right: 0.08em solid currentColor; }";
        document.body.appendChild(css);
        return () => {
            document.body.removeChild(css);
        };
    }, []);
    return (
        <section className="mb-16" style={{ backgroundColor: 'var(--theme-primary-100)' }}>
            <div className="container h-[70vh]">
                <div className="h-full flex flex-col md:justify-around md:items-center md:flex-row">
                    <div className="flex-1 flex">
                        <Image height="0" width="0" src={illustration} alt="Banner logo" 
                               className="m-auto w-3/6 h-auto"/>
                    </div>
                    <div className="flex-1 flex flex-col mb-5 md:mb-0">
                        <div className="flex-1 min-h-8 md:min-h-16">
                            <h4 style={{ color: 'var(--theme-tertiary-900)' }}>Hi, I&apos;m</h4>
                            <h1 className="min-h-20 type-animate">
                                <a href="#" id="typewrite" className="text-5xl" style={{ color: 'var(--theme-tertiary-900)' }} data-period="2000"
                                   data-type={JSON.stringify(texts)}>
                                </a>
                            </h1>
                        </div>
                        <div className="flex-1 mt-4">
                            {ctaLabel && (
                                <Button variant="filled">
                                    <Link href={ctaUrl} download={downloadable} target="_blank">
                                        <span>{ctaLabel}</span>
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
