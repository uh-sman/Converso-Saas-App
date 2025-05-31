import { auth } from "@clerk/nextjs/server"
import { createClient } from "@supabase/supabase-js"

export const createSupabaseClient = () => {
    return  createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL as string,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string, {
            async accessToken() {
                return (( await auth()).getToken()) 
            }
        }
    )
}