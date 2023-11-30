import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import slugify from "slugify";
import { RGBColor } from "react-color";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const generateOTPCode = () => {
  return Math.floor(Math.random() * (999999 - 100000) + 100000).toString();
};

export function isBase64DataURL(value: string) {
  const base64Regex = /^data:image\/[a-z]+;base64,/;
  return base64Regex.test(value);
}

export const compareObject = (obj1: object, obj2: object): boolean => {
  if (typeof obj1 !== "object" || typeof obj2 !== "object") {
    return false;
  }
  return (
    Object.keys(obj1).length === Object.keys(obj2).length &&
    (Object.keys(obj1) as (keyof typeof obj1)[]).every((key) => {
      return (
        Object.prototype.hasOwnProperty.call(obj2, key) &&
        obj1[key] === obj2[key]
      );
    })
  );
};

export const generateSlug = (name: string) => {
  return slugify(name, { lower: true, locale: "vi" });
};

export const convertHexToRGBA = (hexCode: string): RGBColor => {
  let hex = hexCode.replace("#", "");
  switch (hex.length) {
    case 3:
      return {
        r: parseInt(`${hex[0]}${hex[0]}`, 16),
        g: parseInt(`${hex[1]}${hex[1]}`, 16),
        b: parseInt(`${hex[2]}${hex[2]}`, 16),
        a: 1,
      };
    case 6:
      return {
        r: parseInt(hex.substring(0, 2), 16),
        g: parseInt(hex.substring(2, 4), 16),
        b: parseInt(hex.substring(4, 6), 16),
        a: 1,
      };

    case 8:
      return {
        r: parseInt(hex.substring(0, 2), 16),
        g: parseInt(hex.substring(2, 4), 16),
        b: parseInt(hex.substring(4, 6), 16),
        a: Math.round((parseInt(hex.substring(6, 8), 16) / 255) * 100) / 100,
      };

    default:
      return {
        r: 0,
        g: 0,
        b: 0,
        a: 0,
      };
  }
};
export const convertNumToHex = (n: number) => {
  const hex = n.toString(16);
  return hex.length == 1 ? `0${hex}` : hex;
};

export const convertRGBAToHex = (color: RGBColor): string => {
  return `#${convertNumToHex(color.r)}${convertNumToHex(
    color.g
  )}${convertNumToHex(color.b)}${convertNumToHex(Math.round(color.a! * 255))}`;
};
