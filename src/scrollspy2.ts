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
  pos: number;
}

let items: ScrollSpyItem[] = [];

// ---------

export function clean(): void {
  items = [];
}

function getItems(): readonly Readonly<ScrollSpyItem>[]{
  return items.map(i => i);
}

// function add(param: ScrollSpyItemOptions): void {
//     if (!param.el) {
//         throw new Error("[@globocom/scrollspy] item.el is required");
//     }
//     const item: ScrollSpyItem = Object.assign(
//         { offset: 200, reference: "top", pos: 0 },
//         param
//     );
//     item.pos = getElementPos(item);

//     const index = items.findIndex(i => i.pos > item.pos);

//     items.splice(index === -1 ? items.length : index, 0, item);

//     if (items.length === 1) {
//     setDefaultVariables();
//     startListener();
//     }
//     checkVisibleItems();
// }

interface IntersectionObserver {
    rootMargin: string,
    threshold: number
}

function add(param: ScrollSpyItemOptions): void {
  if (!param.el) {
    throw new Error("[@globocom/scrollspy] item.el is required");
  }
  const item: ScrollSpyItem = Object.assign(
    { offset: 200, reference: "top", pos: 0 },
    param
  );

  let rootMargin = "";
  if (item.reference === "top") {
    // rootMargin = `${item.offset}px 0px 0px 0px`;
    rootMargin = `${item.offset}px 0px ${item.offset}px 0px`;
  } else {
    // rootMargin = `0px 0px ${item.offset}px 0px`;
    
  }

  let options = {
    rootMargin: rootMargin,
    threshold: 0.01
  }

  let observer = new IntersectionObserver(param.callback, options);
  observer.observe(item.el);
}

function debug() {
  items.forEach((item, i) => {
    const color = i % 2 ? "red" : "blue";
    const border = `2px dashed ${color}`;
    const nodeHtml = document.createElement("div");
    const css = [
      `top: ${item.pos};`,
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
