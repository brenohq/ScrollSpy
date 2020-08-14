/*
 * Copyright (c) 2016, Globo.com (https://github.com/globocom)
 *
 * License: MIT
 */

export interface ScrollSpyItemOptions {
  el: HTMLElement;
  callback: () => void;
  offset?: number;
  reference?: ScrollSpyItemReference;
}

export type ScrollSpyItemReference = "top" | "bottom";

export interface ScrollSpyItem extends ScrollSpyItemOptions {
  offset: number;
  reference: ScrollSpyItemReference;
}

export interface IntersectionObserver {
    rootMargin: string,
    threshold: number
}

let items: ScrollSpyItem[] = [];

export function clean(): void {
  items = [];
}

export function getItems(): readonly Readonly<ScrollSpyItem>[]{
  return items.map(i => i);
}

export function add(param: ScrollSpyItemOptions): void {
  if (!param.el) {
    throw new Error("[@globocom/scrollspy] item.el is required");
  }

  const item: ScrollSpyItem = { offset: 200, reference: "top", ...param };
  items.push(item);

  observeItem(item, param.callback);
}

export function debug() {
  items.forEach((item, i) => {
    const color = i % 2 ? "red" : "blue";
    const border = `2px dashed ${color}`;
    const nodeHtml = document.createElement("div");
    const position = getElementPos(item);
    const css = [
      `top: ${position};`,
      "width: 100%;",
      "position: absolute;",
      `border-top: ${border};`
    ].join("");

    item.el.style.border = border;

    nodeHtml.className = "debug-line";
    nodeHtml.setAttribute("style", css);
    document.body.appendChild(nodeHtml);
  });
  return items;
}

function observeItem(item: ScrollSpyItem, callback: () => void): void {
  let rootMargin = "";
  if (item.reference === "top") {
    rootMargin = `${item.offset}px 0px ${item.offset}px 0px`;
  } else {
    let offset = -1 * (((item.el.offsetHeight / 100) * 99) - item.offset);
    rootMargin = `0px 0px ${offset}px 0px`;
  }

  let options = {
    rootMargin: rootMargin,
    threshold: 0.01
  };

  let observer = new IntersectionObserver(callback, options);
  observer.observe(item.el);
}

function getElementPos(item: ScrollSpyItem): number {
  const boundClient = item.el.getBoundingClientRect();
  return boundClient[item.reference] - item.offset;
}
