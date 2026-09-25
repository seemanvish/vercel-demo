"use client";

import { useEffect, useRef } from "react";

interface MozartContentfulPageProps {
  html: string;
  css: string;
}

export default function MozartContentfulPage({
  html,
  css,
}: MozartContentfulPageProps) {
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = pageRef.current;

    if (!root) return;

    const tabs = Array.from(
      root.querySelectorAll<HTMLButtonElement>(".mozart-hiw-tab")
    );

    const panes = Array.from(
      root.querySelectorAll<HTMLElement>(".mozart-hiw-pane")
    );

    const handleTabClick = (event: Event) => {
      const tab = event.currentTarget as HTMLButtonElement;
      const step = tab.dataset.step;

      if (!step) return;

      tabs.forEach((item) => {
        const active = item === tab;

        item.classList.toggle("active", active);
        item.setAttribute("aria-selected", String(active));
      });

      panes.forEach((pane) => {
        const active = pane.dataset.shot === step;

        pane.hidden = !active;
        pane.classList.toggle("active", active);
      });
    };

    tabs.forEach((tab) => {
      tab.addEventListener("click", handleTabClick);
    });

    // Match target screenshot: Predictive scaling
    const defaultStep = "6";

tabs.forEach((tab) => {
  const active = tab.dataset.step === defaultStep;

  tab.classList.toggle("active", active);
  tab.setAttribute("aria-selected", String(active));
});

panes.forEach((pane) => {
  const active = pane.dataset.shot === defaultStep;

  pane.hidden = !active;
  pane.classList.toggle("active", active);
});

    return () => {
      tabs.forEach((tab) => {
        tab.removeEventListener("click", handleTabClick);
      });
    };
  }, [html]);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />

      <div
        ref={pageRef}
        className="mozart-contentful-wrapper"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </>
  );
}