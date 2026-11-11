import type { supabase as AppClient } from "../../src/integrations/supabase/client";
import type { Analytics as AppAnalytics } from "../../src/lib/analytics";
export const ui={errors:[] as string[],forbidden:[] as string[]};
const deny=(name:string):never=>{ui.forbidden.push(name);throw Error("CAPACITE FERMEE "+name);};
export const supabase=new Proxy({} as Pick<typeof AppClient,"functions">,{get(){return deny("SDK");}});
export const Analytics=new Proxy({} as typeof AppAnalytics,{get(){return deny("Analytics");}});
export const toast={error:(message:string)=>{ui.errors.push(message);},success:(_message:string)=>deny("toast.success")};
