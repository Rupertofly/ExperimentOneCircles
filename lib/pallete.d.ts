interface colourObj {
    red: number;
    alpha: number;
    name: string;
    blue: number;
    green: number;
    hex: string;
}
declare enum hues {
    cools = 0,
    warms = 1,
    neutrals = 2,
    pinks = 3,
    purples = 4,
    violets = 5,
    blues = 6,
    aquas = 7,
    greens = 8,
    limes = 9,
    yellows = 10,
    browns = 11,
    oranges = 12,
    apricots = 13,
    reds = 14,
}
declare enum shades {
    black = 0,
    dark = 1,
    mediumDark = 2,
    medium = 3,
    mediumLight = 4,
    light = 5,
    white = 6,
}
declare const PalleteArray: colourObj[][];
/**
 * Get Colour from name
 * @param name colour name
 * @return colour object, get hex string with hex property
 */
declare function getC(name: string): colourObj;
/**
 * Get Colour frame hue name and shade number
 * @param hue hue name
 * @param shad shade number
 * @return colour object, get hex string with hex property
 */
declare function getC(hue: string, shad: number): colourObj;
/**
 * Get Colour frame hue number and shade number
 * @param hue hue number
 * @param shad shade number
 * @return colour object, get hex string with hex property
 */
declare function getC(hue: number, shad: number): colourObj;
/**
 * Get Colour frame hue number and shade name
 * @param hue hue number
 * @param shad shade name
 * @return colour object, get hex string with hex property
 */
declare function getC(hue: number, shad: string): colourObj;
/**
 * Get Colour frame hue name and shade name
 * @param hue hue name
 * @param shad shade name
 * @return colour object, get hex string with hex property
 */
declare function getC(hue: string, shad: string): colourObj;
