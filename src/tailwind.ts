import { clsx, ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Tailwind CSS classnames generator. It merges classnames using `clsx` and `tailwind-merge`.
 * Obviously, this function can only be used client-side in projects that use Tailwind CSS.
 *
 * @param classes - Classnames to be merged.
 * @returns - Tailwind CSS classnames.
 */
export const cn = (...classes: ClassValue[]) => {
  return twMerge(clsx(...classes));
};
