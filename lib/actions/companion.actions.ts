"use server";
import { auth } from "@clerk/nextjs/server";
import { createSupabaseClient } from "../supabase";

export const createCompanion = async (formData: Companion) => {
  try {
    const { userId: author } = await auth();
    const supabase = createSupabaseClient();

    const { data, error } = await supabase
      .from("companions")
      .insert({
        ...formData,
        author,
      })
      .select();

    if (error || !data) {
      console.error("Supabase error:", error?.message);
      throw Error(error?.message || "Failed to create companion");
    }

    return data[0];
  } catch (err) {
    console.error("Error in createCompanion:", err);
    throw err; // Re-throw to handle in UI or redirect logic
  }
};

export const getAllCompanions = async ({
  limit = 10,
  page = 1,
  subject,
  topic,
}: GetAllCompanions) => {
  try {
    const supabase = createSupabaseClient();

    let query = supabase.from("companions").select();

    if (subject && topic) {
      query = query
        .ilike("subject", `%${subject}%`)
        .or(`topic.ilike.%${topic}%,name.ilike.%${topic}%`);
    } else if (subject) {
      query = query.ilike("subject", `%${subject}%`);
    } else if (topic) {
      query = query.or(`topic.ilike.%${topic}%,name.ilike.%${topic}%`);
    }

    query = query.range((page - 1) * limit, page * limit - 1);

    const { data: companions, error } = await query;

    if (error) throw new Error(error.message);

    return companions;
  } catch (err) {
    console.error("Error in getAllCompanions:", err);
    throw err; // Re-throw to handle in UI or redirect logic
  }
};

export const getCompanion = async (id: string) => {
  try {
    const supabase = createSupabaseClient();

    const { data: companion, error } = await supabase
      .from("companions")
      .select()
      .eq("id", id);

    if (error) throw new Error(error.message);

    return companion[0];
  } catch (err) {
    console.error("Error in getCompanion:", err);
    throw err; // Re-throw to handle in UI or redirect logic
  }
};

export const addToSessionHistory = async (companionId: string) => {
  const { userId } = await auth();
  const supabase = createSupabaseClient();

  const { data, error } = await supabase.from("session_history").insert({
    companion_id: companionId,
    user_id: userId,
  });
  if (error) throw new Error(error.message);

  return data;
};

export const getRecentSessions = async (limit = 10) => {
    const supabase = createSupabaseClient();

    const { data: sessionHistory, error } = await supabase
      .from("session_history")
      .select(`companions:companion_id (*)`)
      .order("created_at", { ascending: false })
      .limit(limit);
 
    if (error) throw new Error(error.message);

    return sessionHistory.map(({ companions }) => companions);
};
export const getUserSessions = async (userId: string ,limit = 10) => {
  try {
    const supabase = createSupabaseClient();

    const { data: sessionHistory, error } = await supabase
      .from("session_history")
      .select(`companions:companion_id (*)`)
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit);
 
    if (error) throw new Error(error.message);

    return sessionHistory.map(({ companions }) => companions);
  } catch (err) {
    console.error("Error in getRecentSessions:", err);
    throw err; // Re-throw to handle in UI or redirect logic
  }
};
export const getUserCompanions = async (userId: string) => {
  try {
    const supabase = createSupabaseClient();

    const { data: userCompanions, error } = await supabase
      .from("companions")
      .select()
      .eq("author", userId);
 
    if (error) throw new Error(error.message);

    return userCompanions;
  } catch (err) {
    console.error("Error in getRecentSessions:", err);
    throw err; // Re-throw to handle in UI or redirect logic
  }
};


export const newCompanionPermissions = async () => {
  const { userId, has } = await auth();
  const supabase = createSupabaseClient();

  let limit = 0;

  if(has({ plan: 'pro' })) {
    return true;
  } 
  else if(has({ feature: "3_companion_limit" }))  {
    limit = 3
  }
  else if(has({ feature: "10_companion_limit" }))  {
    limit = 10
  }

  const { data, error } = await supabase.from("companions").select("id").eq("author", userId);

  if (error) throw new Error(error.message);

  const companionCount = data.length;

  if (companionCount >= limit) {
     return false
  }
  else {
    return true
  }
}