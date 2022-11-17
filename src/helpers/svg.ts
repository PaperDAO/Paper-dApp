import  { flatten } from 'lodash'

/**
 * Text to array of lines
 */
export const textToArray = (text: string, maxLines: number = 0): string[] => {
  // let valueArray = text.split("\n");
  let valueArray = text.split(/\r\n|\r|\n/);
  valueArray = flatten(valueArray.map(line => !line ? ' ' : line.replace(/(.{89})/g, "$1\n").split("\n")));
  //Truncate
  if(!!maxLines && valueArray.length > maxLines) valueArray.length = maxLines;
  return valueArray;
}

/**
 * text to an SVG element
 */
 export const makeSVGFromString = (text: string, maxLines: number = 0): string => {
  return makeSVG(textToArray(text, maxLines));
}

/**
 * Text Array to an SVG element
 */
export const makeSVG = (text: string[]): string => {
  let svgPrefix = "<svg width='2494' height='3523' viewBox='0 0 2494 3523' fill='none' xmlns='http://www.w3.org/2000/svg'>"
    +"<g filter='url(#filter0_d_1815_20075)'> <path d='M0 0.5H2480V3508.5H184.642L0 3309.79V0.5Z' fill='white'/>"
    +"<path d='M187.142 3309.79V3307.29H184.642H2.5V3H2477.5V3506H187.142V3309.79ZM182.142 3312.29V3502.14L5.73556 3312.29H182.142Z' stroke='#A3A1A1' stroke-width='5'/> </g> <defs> <filter id='filter0_d_1815_20075' x='0' y='0.5' width='2494' height='3522' filterUnits='userSpaceOnUse' color-interpolation-filters='sRGB'> <feFlood flood-opacity='0' result='BackgroundImageFix'/><feColorMatrix in='SourceAlpha' type='matrix' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0' result='hardAlpha'/> <feOffset dx='10' dy='10'/><feGaussianBlur stdDeviation='2'/> <feComposite in2='hardAlpha' operator='out'/> <feColorMatrix type='matrix' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0'/> <feBlend mode='normal' in2='BackgroundImageFix' result='effect1_dropShadow_1815_20075'/>"
    +"<feBlend mode='normal' in='SourceGraphic' in2='effect1_dropShadow_1815_20075' result='shape'/> </filter></defs>";
  let svgText = "";
  let svgSuffix = "</svg>";
  for (let i = 0; i < text.length; i++) {
    let y = (250 + (100 * i));
    svgText += `<text x='200' y='${y.toString()}' font-family='Arial' font-size='53.3' fill='black' xml:space='preserve'>${text[i]}</text>`;
  }
  return svgPrefix+svgText+svgSuffix;
}

/**
 * Image src tag content for SVG image
 */
export const svgImageSrc = (svg: string): string => {
  const buff = Buffer.from(svg);
  const base64data = buff.toString('base64');
  return `data:image/svg+xml;base64,${base64data}`;
}