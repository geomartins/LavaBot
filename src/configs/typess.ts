// type Profile = { firstname?: String; middlename?: String; email?: String; telephone?: String}
// type Welcome = { isGreeting?: boolean }
// type MiddlewareData = {
//     isAuthenticated?: boolean,
//     isTerminated?: boolean
// }

import { DialogContext } from "botbuilder-dialogs"

type Dialog = {
    isDialogComplete?: boolean,
    name?: string,
    isWelcome?: boolean,
    menu?: string,
    email?: String,
    status?: "start" | "progress" | "end",
    dc?: DialogContext
}
export {
    Dialog
}