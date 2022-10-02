import {  format } from "date-fns";
export const helper = {
    getMonth(date) {
        return format(date, "MMMM");
    },
    refreshMonth: undefined
};