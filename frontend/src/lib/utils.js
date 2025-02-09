import { clsx } from "clsx";
import { formatDistanceToNow } from "date-fns";
import { twMerge } from "tailwind-merge"
// import { formatDistanceToNow } from "date-fns";
import parseISO from "date-fns/parseISO";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
// export const formateDate=(date)=>{
//   return formatDistanceToNow(parseISO(date),{addSuffix:true})
// }

export const formateDate = (date) => {
  if (!date) return "Invalid date";
  try {
    return formatDistanceToNow(parseISO(date), { addSuffix: true });
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid date";
  }
};

export const  formateDateInDDMMYYY = (date) =>{
  return new Date(date).toLocaleDateString('en-GB')
}