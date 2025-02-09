import { clsx } from "clsx";
import { formatDistanceToNow } from "date-fns";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
export const formateDate=(date)=>{
  return formatDistanceToNow(parseISO(date),{addSuffix:true})
}

export const  formateDateInDDMMYYY = (date) =>{
  return new Date(date).toLocaleDateString('en-GB')
}