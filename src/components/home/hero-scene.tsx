"use client";

import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { useEffect, useRef } from "react";
import { EASE_IN_OUT, EASE_OUT, useIntroDone } from "../motion/hooks";

const HORIZON = 360;
const sky = "var(--img-sky)";

/**
 * Scène d'ouverture : le tracé d'architecte apparaît, le soleil se lève derrière l'horizon,
 * la villa se construit volume par volume. Ensuite, la scène suit la souris (profondeur)
 * et se décompose pendant le défilement (parallaxe à plusieurs vitesses).
 */
export function HeroScene({ label, className }: { label: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const ready = useIntroDone();
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const sunScroll = useTransform(scrollYProgress, [0, 1], [0, 190]);
  const upperScroll = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const baseScroll = useTransform(scrollYProgress, [0, 1], [0, 40]);
  const zoom = useTransform(scrollYProgress, [0, 1], [1, 1.14]);

  const pointerX = useSpring(0, { stiffness: 50, damping: 18 });
  const pointerY = useSpring(0, { stiffness: 50, damping: 18 });
  const sunX = useTransform(pointerX, (v) => v * -46);
  const sunY = useTransform(pointerY, (v) => v * -24);
  const upperX = useTransform(pointerX, (v) => v * -20);
  const baseX = useTransform(pointerX, (v) => v * -10);
  const gridX = useTransform(pointerX, (v) => v * 8);

  useEffect(() => {
    if (reduce) return;
    const onMove = (event: PointerEvent) => {
      pointerX.set(event.clientX / window.innerWidth - 0.5);
      pointerY.set(event.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduce, pointerX, pointerY]);

  const play = ready ? "show" : "hidden";

  return (
    <div ref={ref} className={className}>
      <motion.svg
        viewBox="0 0 800 500"
        preserveAspectRatio="xMidYMid slice"
        role="img"
        aria-label={label}
        style={{ scale: zoom }}
        className="block h-full w-full"
        initial="hidden"
        animate={play}
      >
        <defs>
          <clipPath id="hero-above-horizon">
            <rect x="-200" y="-200" width="1200" height={HORIZON + 200} />
          </clipPath>
        </defs>

        <rect x="-200" y="-200" width="1200" height="900" fill={sky} />

        {/* Tracé d'architecte : lignes de construction qui se dessinent. */}
        <motion.g style={{ x: gridX }} stroke="var(--img-stroke)" strokeWidth="0.6" opacity="0.55">
          {[120, 280, 440, 600, 760].map((x, i) => (
            <motion.line
              key={x}
              x1={x}
              y1="-40"
              x2={x}
              y2={HORIZON}
              variants={{ hidden: { pathLength: 0 }, show: { pathLength: 1 } }}
              transition={{ duration: 1.6, delay: 0.1 + i * 0.08, ease: EASE_IN_OUT }}
            />
          ))}
          {[110, 205, 270].map((y, i) => (
            <motion.line
              key={y}
              x1="-40"
              y1={y}
              x2="840"
              y2={y}
              strokeDasharray="3 6"
              variants={{ hidden: { pathLength: 0 }, show: { pathLength: 1 } }}
              transition={{ duration: 1.8, delay: 0.3 + i * 0.1, ease: EASE_IN_OUT }}
            />
          ))}
        </motion.g>

        {/* Soleil : se lève derrière l'horizon, puis redescend quand on défile. */}
        <g clipPath="url(#hero-above-horizon)">
          <motion.g style={{ y: sunScroll }}>
            <motion.g style={{ x: sunX, y: sunY }}>
              <motion.g
                variants={{ hidden: { y: 360 }, show: { y: 0 } }}
                transition={{ duration: 2, delay: 0.25, ease: EASE_OUT }}
              >
                <circle cx="540" cy={HORIZON} r="170" fill="var(--accent)" opacity="0.92" />
                {[0.42, 0.62].map((ratio, i) => (
                  <motion.rect
                    key={ratio}
                    x="370"
                    y={HORIZON - 170 + 170 * ratio}
                    width="340"
                    height="5"
                    fill={sky}
                    style={{ transformBox: "fill-box", originX: 0 }}
                    variants={{ hidden: { scaleX: 0 }, show: { scaleX: 1 } }}
                    transition={{ duration: 0.9, delay: 1.3 + i * 0.12, ease: EASE_IN_OUT }}
                  />
                ))}
              </motion.g>
            </motion.g>
          </motion.g>
        </g>

        {/* Sol et horizon. */}
        <rect x="-200" y={HORIZON} width="1200" height="400" fill="var(--img-ground)" />
        <motion.rect
          x="-200"
          y={HORIZON - 0.75}
          width="1200"
          height="1.5"
          fill="var(--img-line)"
          opacity="0.5"
          style={{ transformBox: "fill-box", originX: 0.5 }}
          variants={{ hidden: { scaleX: 0 }, show: { scaleX: 1 } }}
          transition={{ duration: 1.4, ease: EASE_IN_OUT }}
        />

        {/* Volume du rez-de-chaussée : sort du sol. */}
        <motion.g style={{ y: baseScroll }}>
          <motion.g style={{ x: baseX }}>
            <g clipPath="url(#hero-above-horizon)">
              <motion.g
                variants={{ hidden: { y: 130 }, show: { y: 0 } }}
                transition={{ duration: 1.5, delay: 0.7, ease: EASE_OUT }}
              >
                <rect x="180" y="270" width="460" height="90" fill="var(--img-b1)" stroke="var(--img-stroke)" />
                <motion.rect
                  x="250"
                  y="292"
                  width="240"
                  height="52"
                  fill="var(--accent)"
                  animate={reduce ? undefined : { opacity: [0.1, 0.22, 0.1] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  opacity="0.12"
                />
              </motion.g>
            </g>
          </motion.g>
        </motion.g>

        {/* Volume en porte-à-faux : descend se poser sur le rez-de-chaussée. */}
        <motion.g style={{ y: upperScroll }}>
          <motion.g style={{ x: upperX }}>
            <motion.g
              variants={{ hidden: { y: -90, opacity: 0 }, show: { y: 0, opacity: 1 } }}
              transition={{ duration: 1.4, delay: 1.1, ease: EASE_OUT }}
            >
              <rect x="120" y="205" width="420" height="65" fill="var(--img-b2)" stroke="var(--img-stroke)" />
              <motion.rect
                x="150"
                y="222"
                width="360"
                height="30"
                fill="var(--accent)"
                style={{ transformBox: "fill-box", originX: 0 }}
                variants={{ hidden: { scaleX: 0, opacity: 0.25 }, show: { scaleX: 1, opacity: 0.25 } }}
                transition={{ duration: 1.2, delay: 1.7, ease: EASE_IN_OUT }}
              />
            </motion.g>
          </motion.g>
        </motion.g>

        {/* Reflets sur la lagune. */}
        {[
          { x: 260, y: HORIZON + 22, w: 320, o: 0.35 },
          { x: 320, y: HORIZON + 44, w: 200, o: 0.2 },
          { x: 370, y: HORIZON + 66, w: 100, o: 0.12 },
        ].map((r, i) => (
          <motion.rect
            key={r.y}
            x={r.x}
            y={r.y}
            width={r.w}
            height="3"
            fill="var(--accent)"
            opacity={r.o}
            style={{ transformBox: "fill-box", originX: 0.5 }}
            variants={{ hidden: { scaleX: 0 }, show: { scaleX: 1 } }}
            transition={{ duration: 1.2, delay: 1.5 + i * 0.12, ease: EASE_OUT }}
          />
        ))}
      </motion.svg>
    </div>
  );
}
